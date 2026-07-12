// i01.mjs — Capture Demonstrator (Task 14).
//
// The canonical instrument-module pattern every later instrument (I-03..
// I-10) copies: a single `mount(figureEl)` export that reads the figure's
// `data-preset`, builds a container, and hands a `spec` to
// createInstrument (../viz.mjs). Physics comes exclusively from
// ../physics/{capture,plume,wind,sidepanels}.mjs — nothing here recomputes
// a Gaussian or an entrainment coefficient.
//
// Scene is a side-view line-art elevation adapted from the hero "Figure 1"
// demo in docs/design/modern-standard-mockup.html: cook surface, hood at a
// fixed 30in rise, a Gaussian plume envelope whose centerline bends with
// wind, dimension lines for width/rise, and escape wisps once the hood
// stops fully capturing the plume.

import { createInstrument } from '../viz.mjs';
import { captureFraction, WIND_COUPLING } from '../physics/capture.mjs';
import { plumeRadius } from '../physics/plume.mjs';
import { deflection } from '../physics/wind.mjs';
import { effectiveWind } from '../physics/sidepanels.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset } from '../hood-presets.mjs';

const RISE_IN = 30; // fixed hood mounting height for this demonstrator
const SAMPLE_STEP_IN = 2; // "sampled every 2in of rise" per brief

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
    const panels = state['i01-panels'];
    const depthIn = MOUNT[mountVal].depthIn;

    const effWind = effectiveWind(windMph, panels);
    // The wind the plume actually feels: panel attenuation × at-grade
    // shelter — exactly what captureFraction integrates with, so the drawn
    // trajectory and the deflection readout agree with the capture number.
    const plumeWind = WIND_COUPLING * effWind;
    const deflAtHood = deflection(RISE_IN, plumeWind);
    const capFrac = captureFraction({
      widthIn: widthCtl, depthIn, mount: mountVal, riseIn: RISE_IN, windMph, panels,
    });

    // --- readouts --------------------------------------------------
    setReadout('capture', capFrac);
    setReadout('deflection', deflAtHood);
    setReadout('effWind', effWind);

    // --- wall visibility --------------------------------------------
    refs.wall.setAttribute('opacity', mountVal === 'wall' ? '1' : '0');

    // --- plume envelope, sampled every 2in of rise -------------------
    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const centerXAt = (zIn) => GX + deflection(zIn, plumeWind) * pxPerIn;
    const yAt = (zIn) => GY - zIn * pxPerIn;
    const halfWAt = (zIn) => plumeRadius(zIn) * pxPerIn;

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

    // --- hood + capture plane, sized to the width control (same
    //     inches->px scale as the plume envelope, per RB-005/-006) ------
    const hoodHalfPx = (widthCtl / 2) * pxPerIn;
    const lx = GX - hoodHalfPx, rx = GX + hoodHalfPx;
    refs.hood.setAttribute('d', `M${lx.toFixed(1)} ${HY} L${rx.toFixed(1)} ${HY} L${GX + 22} 66 L${GX - 22} 66 Z`);
    refs.capPlane.setAttribute('x1', (lx - 24).toFixed(1));
    refs.capPlane.setAttribute('x2', (rx + 24).toFixed(1));

    // --- dimension lines (re-measured live) ---------------------------
    replaceChildren(refs.dimW, H.dimensionLine(lx, HY - 20, rx, HY - 20, `${Math.round(widthCtl)}″`));
    replaceChildren(refs.dimRise, H.dimensionLine(660, GY, 660, HY, `${RISE_IN}″ rise`));
    replaceChildren(refs.depthNote, H.noteBox(20, 20, `DEPTH ${depthIn}″ (${mountVal})`));

    // --- wind glyph ----------------------------------------------------
    refs.windLabel.textContent = `U = ${Math.round(windMph)} mph`;
    const shaftX = 90 + windMph * 1.5;
    refs.windShaft.setAttribute('x2', shaftX.toFixed(1));
    refs.windArrow.setAttribute('d', `M${shaftX.toFixed(1)} 136 l-7 -4 m7 4 l-7 4`);

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
        id: 'i01-panels', type: 'segmented', label: 'SIDE PANELS', value: 'none',
        options: [{ value: 'none', label: 'NONE' }, { value: 'one', label: 'ONE' }, { value: 'both', label: 'BOTH' }],
      },
    ],
    readouts: [
      { id: 'capture', label: 'PLUME CAPTURE', format: 'pct', hero: true },
      { id: 'deflection', label: 'DEFLECTION AT HOOD', format: 'in' },
      { id: 'effWind', label: 'EFFECTIVE WIND', format: 'mph' },
    ],
    scene: buildScene,
    update,
  };

  createInstrument(container, spec);
}
