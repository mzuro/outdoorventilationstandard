// i01.mjs — Capture Demonstrator (Task 14).
//
// The canonical instrument-module pattern every later instrument (I-03..
// I-10) copies: a single `mount(figureEl)` export that reads the figure's
// `data-preset`, builds a container, and hands a `spec` to
// createInstrument (../viz.mjs). Physics comes exclusively from
// ../physics/{capture,plume,wind,sidepanels,heat}.mjs — nothing here
// recomputes a Gaussian, a deflection or a panel factor.
//
// Scene is a side-view line-art elevation adapted from the hero "Figure 1"
// demo in docs/design/modern-standard-mockup.html: cook surface, hood at a
// fixed 30in rise, the RB-002 capture-diameter envelope whose centerline
// bends with the RB-006 §3.1 deflection, dimension lines for the along-
// wind span/rise, and escape wisps once the hood stops fully capturing the
// plume. WIND DIRECTION (physics Stage B) picks the axis the elevation
// looks along: SIDE (hood width in play) or REAR (hood depth; a wall-mount
// shelters the plume, rb-006:859).

import { createInstrument, gradeCapture } from '../viz.mjs';
import { captureFraction } from '../physics/capture.mjs';
import { captureDiameter } from '../physics/plume.mjs';
import { deflection } from '../physics/wind.mjs';
import { effectiveWind } from '../physics/sidepanels.mjs';
import { SOURCES } from '../physics/heat.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const RISE_IN = 30; // fixed hood mounting height for this demonstrator
const SAMPLE_STEP_IN = 2; // "sampled every 2in of rise" per brief
// The papers' single-source reference case (Gas Grill Medium, plan §0
// finding 1) — the source every capture/deflection table on this page is
// printed for (RB-006 Table 3.2b, Table 3.10; RB-008 Table 3.10).
const SRC = SOURCES.gasMedium;

const STATUS_FILL = {
  ok: null, // null = fall back to the .ovs-i-plume-fill CSS default (var(--plume))
  warn: 'rgba(138, 90, 0, 0.12)',
  fail: 'rgba(180, 35, 24, 0.14)',
};

function statusFor(pct) {
  if (pct >= 90) return 'ok';
  if (pct >= 70) return 'warn';
  return 'fail';
}

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i01Mounted === '1') return;
  figureEl.dataset.i01Mounted = '1';

  const { mount: mountVal, widthIn } = parsePreset(figureEl.dataset.preset);

  // Clear any placeholder content that isn't the <noscript> fallback or an
  // authored <figcaption> — both are left untouched; everything else is
  // scratch space for the instrument's own container.
  const keep = new Set(['NOSCRIPT', 'FIGCAPTION']);
  for (const node of Array.from(figureEl.childNodes)) {
    if (node.nodeType === 1 && keep.has(node.tagName)) continue;
    figureEl.removeChild(node);
  }
  const container = document.createElement('div');
  container.className = 'ovs-instrument-mount';
  const figcaption = figureEl.querySelector('figcaption');
  figureEl.insertBefore(container, figcaption || null);

  // --- scene geometry (px), fixed regardless of controls ---------------
  const GX = 300; // grill/hood centerline (left of center: room for downwind drift)
  const GY = 296; // grill (cook surface) plane, y
  const HY = 96; // hood mouth (capture plane), y — RISE_IN above the grill
  const ZH = GY - HY;
  const pxPerIn = ZH / RISE_IN; // same inches->px scale used for width so hood/plume stay physically comparable

  let H = null; // { el, dimensionLine, noteBox } — captured from scene()
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 340');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Side-view diagram of a cooking plume rising toward a hood; wind bends the plume and the hood width determines how much of it is captured.');

    // ground
    const ground = H.el('g');
    ground.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 30, y1: 318, x2: 690, y2: 318 }));
    for (let x = 50; x <= 670; x += 40) {
      ground.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: 318, x2: x - 8, y2: 327 }));
    }
    svg.appendChild(ground);

    // wall (only shown when mount === 'wall') — a backdrop cue, not a
    // pixel-precise clearance geometry; hood placement is unaffected.
    refs.wall = H.el('g');
    refs.wall.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 20, y1: 40, x2: 20, y2: 318 }));
    for (let y = 50; y <= 300; y += 26) {
      refs.wall.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 20, y1: y, x2: 30, y2: y + 8 }));
    }
    svg.appendChild(refs.wall);

    // grill line art (static) — cook surface at GY, body + legs down to the
    // ground line (318), sized to stay inside the 0..340 viewBox.
    const grill = H.el('g');
    grill.appendChild(H.el('line', { class: 'ovs-i-fl', x1: GX - 55, y1: GY, x2: GX + 55, y2: GY }));
    grill.appendChild(H.el('rect', { class: 'ovs-i-fl', x: GX - 55, y: GY, width: 110, height: 16 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX - 40, y1: GY + 16, x2: GX - 40, y2: 316 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX + 40, y1: GY + 16, x2: GX + 40, y2: 316 }));
    svg.appendChild(grill);

    // capture plane (dashed, spans a bit past the hood lips)
    refs.capPlane = H.el('line', { class: 'ovs-i-cap-plane', x1: 0, y1: HY, x2: 0, y2: HY });
    svg.appendChild(refs.capPlane);

    // plume: fill + edges + centerline (built fresh each update; placeholders here)
    refs.plumeFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.plumeL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.plumeR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.plumeC = H.el('path', { class: 'ovs-i-plume-center', d: '' });
    svg.appendChild(refs.plumeFill);
    svg.appendChild(refs.plumeL);
    svg.appendChild(refs.plumeR);
    svg.appendChild(refs.plumeC);

    // living-smoke layer mount — the engine (spec.smoke) fills this <g>; it
    // sits over the plume envelope but under the hood, so captured smoke
    // visually disappears into the hood mouth.
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

    // escape wisps (downwind of the hood lip)
    refs.wisp1 = H.el('path', { class: 'ovs-i-wisp', d: '', opacity: 0 });
    refs.wisp2 = H.el('path', { class: 'ovs-i-wisp', d: '', opacity: 0 });
    svg.appendChild(refs.wisp1);
    svg.appendChild(refs.wisp2);

    // hood (drawn over the plume, like the mockup)
    refs.hood = H.el('path', { class: 'ovs-i-hoodfill', d: '' });
    refs.duct = H.el('rect', { class: 'ovs-i-hoodfill', x: GX - 22, y: 34, width: 44, height: 32 });
    svg.appendChild(refs.hood);
    svg.appendChild(refs.duct);

    // wind glyph
    const wind = H.el('g');
    wind.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 118, x2: 90, y2: 118 }));
    refs.windShaft = H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 136, x2: 104, y2: 136 });
    refs.windArrow = H.el('path', { class: 'ovs-i-fl-thin', d: 'M104 136 l-7 -4 m7 4 l-7 4' });
    wind.appendChild(refs.windShaft);
    wind.appendChild(refs.windArrow);
    wind.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 154, x2: 90, y2: 154 }));
    refs.windLabel = H.el('text', { x: 40, y: 106, text: '' });
    wind.appendChild(refs.windLabel);
    svg.appendChild(wind);

    // dimension-line + note-box mount points (rebuilt every update())
    refs.dimW = H.el('g');
    refs.dimRise = H.el('g');
    refs.depthNote = H.el('g');
    svg.appendChild(refs.dimW);
    svg.appendChild(refs.dimRise);
    svg.appendChild(refs.depthNote);

    // --- direct-manipulation hit strips (drawn last so they sit on top for
    //     pointer capture; transparent fill, ≥44px hit area). The engine
    //     (spec.drag) wires pointer events; these rects only get positioned
    //     here and re-measured live in update(). ------------------------------
    refs.dragHood = H.el('rect', {
      class: 'ovs-i-drag-hood-edge', x: 0, y: HY - 40, width: 44, height: 92,
      fill: 'transparent',
    });
    refs.dragWind = H.el('rect', {
      class: 'ovs-i-drag-wind', x: 36, y: 112, width: 90, height: 48,
      fill: 'transparent',
    });
    svg.appendChild(refs.dragHood);
    svg.appendChild(refs.dragWind);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout, reduced } = ctx;
    const windMph = state['i01-wind'];
    const widthCtl = state['i01-width'];
    const mountVal = MOUNT[state['i01-mount']] ? state['i01-mount'] : 'island';
    const panels = state['i01-panels'] === 'both' ? 'both' : 'none';
    const windDir = state['i01-dir'] === 'rear' ? 'rear' : 'side';
    const depthIn = MOUNT[mountVal].depthIn;

    // The wind the plume actually feels: the sheltered wind of
    // sidepanels.mjs (panels by direction; the rear wall under a rear wind,
    // rb-006:859). deflection() carries the RB-006 §3.1 coupling C_D
    // itself, so this sheltered wind is passed straight in — exactly what
    // captureFraction() deflects with, so the drawn centreline, the
    // DEFLECTION readout and the capture number agree (and equal
    // src/lib/explain-state.mjs computeI01State for the same inputs).
    const effWind = effectiveWind(windMph, { panels, dir: windDir, mount: mountVal });
    const deflAtHood = deflection(RISE_IN, effWind, SRC);
    const capFrac = captureFraction({
      widthIn: widthCtl, depthIn, mount: mountVal, riseIn: RISE_IN, windMph, windDir, panels, src: SRC,
    });

    // --- readouts --------------------------------------------------
    setReadout('capture', capFrac);
    setReadout('deflection', deflAtHood);
    setReadout('effWind', effWind);

    // expose physics to the engine's verdict stamp (spec.verdict)
    ctx.physics = { capFrac, deflAtHood, effWind, windDir };

    // --- the drawn elevation looks ALONG the wind axis (RB-006 §3.4's
    //     1-D convention): under a SIDE wind the hood spans its width and
    //     the wall is a backdrop; under a REAR wind the hood spans its
    //     depth and a wall-mount's wall stands at the upwind edge, the
    //     grill against it. Width does not enter the rear-wind capture at
    //     all, so its slider is greyed (i08's disabled pattern). --------
    const rearView = windDir === 'rear';
    const spanIn = rearView ? depthIn : widthCtl;
    // wall-mount under rear wind: the plume centre sits cookDIn/2 in from
    // the wall (RB-002 A.4 cooking depth, heat.mjs SOURCES) and the hood
    // runs from the wall to its full depth.
    const wallX = rearView && mountVal === 'wall' ? GX - (SRC.cookDIn / 2) * pxPerIn : 20;
    refs.wall.setAttribute('opacity', mountVal === 'wall' ? '1' : '0');
    refs.wall.setAttribute('transform', `translate(${(wallX - 20).toFixed(1)} 0)`);
    if (!refs.widthCtl) {
      const input = container.querySelector('#i01-width');
      refs.widthCtl = input ? input.closest('.ovs-i-control') : null;
      refs.widthInput = input;
    }
    if (refs.widthCtl) {
      refs.widthCtl.classList.toggle('ovs-i-control--disabled', rearView);
      refs.widthCtl.setAttribute('aria-disabled', rearView ? 'true' : 'false');
    }
    if (refs.widthInput) refs.widthInput.disabled = rearView;

    // --- plume envelope, sampled every 2in of rise -------------------
    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const centerXAt = (zIn) => GX + deflection(zIn, effWind, SRC) * pxPerIn;
    const yAt = (zIn) => GY - zIn * pxPerIn;
    // RB-002 capture diameter d_capture = 0.48(z − z_0) + D_eff (rb-002:983)
    const halfWAt = (zIn) => (captureDiameter(zIn, SRC) / 2) * pxPerIn;

    let dl = '', dr = '', dc = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const cx = centerXAt(z);
      const hw = halfWAt(z);
      const y = yAt(z);
      const op = i === 0 ? 'M' : 'L';
      dl += `${op}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
      dr += `${op}${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
      dc += `${op}${cx.toFixed(1)} ${y.toFixed(1)}`;
    }
    refs.plumeL.setAttribute('d', dl);
    refs.plumeR.setAttribute('d', dr);
    refs.plumeC.setAttribute('d', dc);
    // fill: walk up the left edge, back down the right edge
    let fill = dl;
    for (let i = samples.length - 1; i >= 0; i--) {
      const z = samples[i];
      const cx = centerXAt(z);
      const hw = halfWAt(z);
      const y = yAt(z);
      fill += `L${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    refs.plumeFill.setAttribute('d', `${fill}Z`);

    const status = statusFor(capFrac * 100);
    refs.plumeFill.style.fill = STATUS_FILL[status] || '';

    // --- hood + capture plane, spanning the along-wind dimension (same
    //     inches->px scale as the plume envelope, per RB-005/-006) ------
    const spanPx = spanIn * pxPerIn;
    const lx = rearView && mountVal === 'wall' ? wallX : GX - spanPx / 2;
    const rx = lx + spanPx;
    refs.hood.setAttribute('d', `M${lx.toFixed(1)} ${HY} L${rx.toFixed(1)} ${HY} L${GX + 22} 66 L${GX - 22} 66 Z`);
    refs.capPlane.setAttribute('x1', (lx - 24).toFixed(1));
    refs.capPlane.setAttribute('x2', (rx + 24).toFixed(1));

    // --- drag hit strip: centered on the downwind (right) hood lip; parked
    //     off-canvas under a rear wind, where width is not in play --------
    refs.dragHood.setAttribute('x', rearView ? '-400' : (rx - 22).toFixed(1));

    // --- dimension lines (re-measured live) ---------------------------
    replaceChildren(refs.dimW, H.dimensionLine(lx, HY - 20, rx, HY - 20, rearView ? `${depthIn}″ deep` : `${Math.round(widthCtl)}″`));
    replaceChildren(refs.dimRise, H.dimensionLine(660, GY, 660, HY, `${RISE_IN}″ rise`));
    replaceChildren(refs.depthNote, H.noteBox(20, 20, rearView
      ? `REAR WIND · ${widthCtl}″ WIDE (${mountVal}) — width not in play`
      : `SIDE WIND · DEPTH ${depthIn}″ (${mountVal})`));

    // --- wind glyph ----------------------------------------------------
    refs.windLabel.textContent = `U = ${Math.round(windMph)} mph`;
    const shaftX = 90 + windMph * 1.5;
    refs.windShaft.setAttribute('x2', shaftX.toFixed(1));
    refs.windArrow.setAttribute('d', `M${shaftX.toFixed(1)} 136 l-7 -4 m7 4 l-7 4`);
    // wind drag strip spans the shaft's full travel (0..20 mph) so the whole
    // arrow is grabbable regardless of the current speed
    refs.dragWind.setAttribute('width', (90 + 20 * 1.5 + 12 - 36).toFixed(1));

    // --- escape wisps: downwind of the hood lip once capture < ~0.97 --
    const escape = Math.max(0, 1 - capFrac);
    const showWisps = capFrac < 0.97;
    if (showWisps) {
      // Anchor at the downwind hood lip or the plume edge, whichever is
      // further downwind — but keep the anchor on-canvas so the wisps stay
      // visible even when an extreme-wind plume has left the frame.
      const sx = Math.min(Math.max(rx, centerXAt(RISE_IN) - halfWAt(RISE_IN) * 0.15), 620);
      const kick = 14 + windMph * 2;
      refs.wisp1.setAttribute('d', `M${sx.toFixed(1)} ${HY} C${(sx + kick).toFixed(1)} ${(HY - 24).toFixed(1)} ${(sx + kick * 2).toFixed(1)} ${(HY - 32).toFixed(1)} ${(sx + kick * 3).toFixed(1)} ${(HY - 52).toFixed(1)}`);
      refs.wisp2.setAttribute('d', `M${(sx + 8).toFixed(1)} ${HY} C${(sx + kick + 10).toFixed(1)} ${(HY - 12).toFixed(1)} ${(sx + kick * 2 + 12).toFixed(1)} ${(HY - 16).toFixed(1)} ${(sx + kick * 3 + 16).toFixed(1)} ${(HY - 30).toFixed(1)}`);
      const op = Math.min(0.85, escape * 2.2);
      refs.wisp1.setAttribute('opacity', op.toFixed(2));
      refs.wisp2.setAttribute('opacity', (op * 0.6).toFixed(2));
      // Flowing cue — CSS-driven, neutralized globally for reduced motion.
      refs.wisp1.classList.toggle('ovs-i-wisp-anim', !reduced);
      refs.wisp2.classList.toggle('ovs-i-wisp-anim', !reduced);
    } else {
      refs.wisp1.setAttribute('opacity', 0);
      refs.wisp2.setAttribute('opacity', 0);
      refs.wisp1.classList.remove('ovs-i-wisp-anim');
      refs.wisp2.classList.remove('ovs-i-wisp-anim');
    }
  }

  const spec = {
    id: 'i01',
    title: 'Capture Demonstrator',
    controls: [
      { id: 'i01-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 20, step: 1, value: 4, unit: 'mph' },
      { id: 'i01-width', type: 'range', label: 'HOOD WIDTH', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i01-mount', type: 'segmented', label: 'MOUNT', value: mountVal,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      {
        id: 'i01-dir', type: 'segmented', label: 'WIND DIRECTION', value: 'side',
        options: [{ value: 'side', label: 'SIDE' }, { value: 'rear', label: 'REAR' }],
      },
      // 'one' panel is not offered: RB-009 has no row for a single panel and
      // §3.5.1 warns a lone windward panel can worsen escape (rb-009:369).
      {
        id: 'i01-panels', type: 'segmented', label: 'SIDE PANELS', value: 'none',
        options: [{ value: 'none', label: 'NONE' }, { value: 'both', label: 'BOTH' }],
      },
    ],
    readouts: [
      { id: 'capture', label: 'PLUME CAPTURE', format: 'pct', hero: true },
      { id: 'deflection', label: 'DEFLECTION AT HOOD', format: 'in' },
      { id: 'effWind', label: 'EFFECTIVE WIND', format: 'mph' },
    ],
    // W5-T2: mirror the hero readout (+ verdict grade, added automatically)
    // in the narrow-viewport sticky strip. Values are copied from the real
    // readout by the engine, never recomputed.
    stickyReadout: ['capture'],
    scene: buildScene,
    update,

    // --- living smoke: derives ENTIRELY from the same physics the readouts
    //     use (deflection trajectory, captureDiameter spread, the
    //     captureFraction aperture partition for the ember-orange escape
    //     tint). Fixed pixel geometry (GX/GY/pxPerIn) + the current physics
    //     state; the hood plane is defined by riseIn in physics space (see
    //     smoke.mjs contract note), not by a pixel-space HY. ------------------
    smoke: (state) => {
      const m = MOUNT[state['i01-mount']] ? state['i01-mount'] : 'island';
      return {
        sourceX: GX, sourceY: GY, pxPerIn,
        widthIn: state['i01-width'],
        depthIn: MOUNT[m].depthIn,
        mount: m,
        riseIn: RISE_IN,
        windMph: state['i01-wind'],
        windDir: state['i01-dir'] === 'rear' ? 'rear' : 'side',
        panels: state['i01-panels'] === 'both' ? 'both' : 'none',
        src: SRC,
      };
    },

    // --- direct manipulation: grab the downwind hood lip (snaps to the 6″
    //     model grid) or the wind arrow (0-20 mph). Both drive inst.set() so
    //     the sliders, bubbles, readouts and smoke stay in lockstep. ----------
    drag: [
      {
        target: 'hood-edge', control: 'i01-width', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(((x - GX) * 2) / pxPerIn),
      },
      {
        target: 'wind-arrow', control: 'i01-wind', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => Math.max(0, Math.min(20, Math.round((x - 90) / 1.5))),
        // W5-T3 visible grip: ride the arrow tip (shaftX = 90 + mph*1.5),
        // not the hit strip's static center.
        grip: (st) => ({ x: 90 + Math.max(0, Math.min(20, st['i01-wind'])) * 1.5 + 14, y: 136 }),
      },
    ],

    // --- story presets: full four-control scenarios so each lands exactly on
    //     its node values regardless of the prior state. ----------------------
    presets: [
      { id: 'calm-evening', label: 'Calm evening', state: { 'i01-wind': 0, 'i01-width': 48, 'i01-mount': 'island', 'i01-dir': 'side', 'i01-panels': 'none' } },
      { id: 'breeze', label: 'Light breeze', state: { 'i01-wind': 5, 'i01-width': 48, 'i01-mount': 'island', 'i01-dir': 'side', 'i01-panels': 'none' } },
      { id: 'paper-hood-breeze', label: 'RB-002 hood (57 in), breeze', state: { 'i01-wind': 5, 'i01-width': 60, 'i01-mount': 'island', 'i01-dir': 'side', 'i01-panels': 'none' } },
      { id: 'island-party-exposed', label: 'Island party, exposed', state: { 'i01-wind': 10, 'i01-width': 60, 'i01-mount': 'island', 'i01-dir': 'side', 'i01-panels': 'none' } },
      { id: 'sheltered-wall', label: 'Wall, rear wind, panels', state: { 'i01-wind': 5, 'i01-width': 54, 'i01-mount': 'wall', 'i01-dir': 'rear', 'i01-panels': 'both' } },
    ],

    // --- verdict stamp: capture-fraction thresholds (>=0.85 PASS,
    //     0.60-0.85 MARGINAL, <0.60 FAIL). The bands are this instrument's
    //     MODEL CRITERIA: no research bulletin defines PASS/MARGINAL capture
    //     bands (RB-005 §2.2 "The Capture Envelope Geometry" is where the
    //     capture-envelope reasoning lives, but it defines no grading cut),
    //     so the stamp cites the paper for the DATA and labels the
    //     thresholds as the OVS model criterion — never attributing the cut
    //     to a section that does not define it. ----------------------------
    //     W5-T3 (UX P1-3): the explanation renders ON the stamp (`plain` +
    //     threshold line); the engine also adds the static "Grades apply to
    //     the model configuration, not to any product." footnote. ----------
    verdict: (state, physics) => {
      const cap = physics ? physics.capFrac : 0;
      const grade = gradeCapture(cap);
      const pct = Math.round(cap * 100);
      return {
        grade,
        plain: `${pct}% of smoke captured in this modeled scene`,
        clauseRef: 'capture data: RB-005 §2.2, RB-006 §3.4 · thresholds: OVS model criterion (≥85% PASS · ≥60% MARGINAL)',
        detail: `Plume capture ${pct}% — capture data: RB-005 §2.2 / RB-006 §3.4; the 85% PASS / 60% MARGINAL thresholds are the OVS model criterion, not a paper rubric.`,
      };
    },
  };

  // Exposed on the figure element so the shared "Explain this
  // configuration" button (partials/instrument-figure.html,
  // static/js/ovs/explain-ui.mjs) can read the live control state via
  // .get() without this module knowing anything about that feature.
  figureEl.ovsInstrument = createInstrument(container, spec);
}
