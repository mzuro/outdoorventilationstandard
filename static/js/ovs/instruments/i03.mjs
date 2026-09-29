// i03.mjs — Wind Deflection Trajectories (Task 15).
//
// Same module contract as i01.mjs/i02.mjs (the canonical pattern): a single
// `mount(figureEl)` export, re-mount guarded, physics only from
// ../physics/{wind,sidepanels}.mjs — no captureFraction here, this
// instrument isolates the RB-006 §3.1 deflection δ = 0.35·U·z/u_0(z) by
// itself (wind.mjs carries the coupling C_D; nothing is pre-multiplied).
//
// This instrument has no mount/width control (unlike i01/i02), so it does
// not read `data-preset` — the trajectory geometry depends only on
// wind/rise/panels.
//
// Scene: side-view elevation. A dashed hood-plane line tracks the RISE
// slider; the plume centerline is sampled every 2in from the grill up to
// the current rise and drawn as a bending polyline, next to a straight
// (undeflected) reference so the bend reads visually; a live dimension
// line reports the horizontal offset at the hood plane, matching the
// deflection readout exactly (the same sheltered wind feeds both — mirrors
// i01, RB-006 §3.1). Above the RB-006 Table 3.8 regime boundary (Fr > 2.7,
// rb-006:775) the paper calls the plume "disrupted" and its own printed
// 15 mph cells depart from the formula, so a note box flags that regime
// (wind.mjs froude / FR_DISRUPTED) rather than trusting the number.
//
// v2.1 (F2) adoption:
//   - smoke: this instrument has no hood/width/mount control at all — it
//     isolates the deflection integrator by itself — so there is no real
//     aperture to partition captured-vs-escaped smoke against. The smoke
//     layer still rides the SAME wind/rise physics the readouts use
//     (riseIn from the real RISE slider, windMph/panels from the real
//     controls). SHARED RULE with i09 (F2 review F-5 fix): instruments
//     with no on-page capture concept (no aperture control, no capture
//     readout) give the smoke a deliberately OVERSIZED nominal aperture
//     (NOMINAL_WIDTH_IN/NOMINAL_DEPTH_IN below) so every particle always
//     registers as captured and none render ember-orange — an escape tint
//     would imply a capture verdict this page's physics never computes.
//     (An earlier revision tinted against a phantom 48in island aperture
//     with no on-page counterpart, telling an escape story nothing here
//     states or grades; that was inconsistent with i09 and is gone.)
//     Deflection is this page's story, and the trajectory line already
//     tells it. Documented explicitly per the smoke.mjs contract note:
//     geom carries no hoodPlaneY, so the recycle plane is riseIn (the
//     real slider value) in physics space, matching the dashed hood-plane
//     line drawn at the same pxPerIn scale.
//   - drag: the wind arrow (0-20 mph), same shape as i01's.
//   - presets: four site-voice scenarios.
//   - verdict: not assigned by the plan (no capture concept here to grade).

import { createInstrument } from '../viz.mjs';
import { deflection, froude, FR_DISRUPTED } from '../physics/wind.mjs';
import { effectiveWind } from '../physics/sidepanels.mjs';

// Deliberately oversized: every particle always registers as captured, no
// escape tint — same rule and same values as i09 (see header note).
const NOMINAL_WIDTH_IN = 4000;
const NOMINAL_DEPTH_IN = 4000;
const NOMINAL_MOUNT = 'island';

const SAMPLE_STEP_IN = 2; // "sampled every 2in of rise" per brief
const MAX_RISE_IN = 48; // control max — sets the fixed vertical scale

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i03Mounted === '1') return;
  figureEl.dataset.i03Mounted = '1';

  // Clear placeholder content; keep <noscript> and any authored <figcaption>.
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
  const GX = 300; // centerline at the grill (undeflected origin)
  const GY = 296; // grill (cook surface) plane, y
  const GROUND_Y = 318;
  const PX_PER_IN_Y = (GY - 60) / MAX_RISE_IN; // vertical scale, calibrated to the 48in slider max
  const PX_PER_IN_X = 2.8; // horizontal (deflection) scale — compressed so even the 20mph/no-panel worst case stays on-canvas

  let H = null;
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 340');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Side-view diagram of a cooking plume\'s centerline bending downwind as it rises toward the hood plane.');

    // ground
    const ground = H.el('g');
    ground.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 30, y1: GROUND_Y, x2: 690, y2: GROUND_Y }));
    for (let x = 50; x <= 670; x += 40) {
      ground.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: GROUND_Y, x2: x - 8, y2: GROUND_Y + 9 }));
    }
    svg.appendChild(ground);

    // grill line art (static)
    const grill = H.el('g');
    grill.appendChild(H.el('line', { class: 'ovs-i-fl', x1: GX - 55, y1: GY, x2: GX + 55, y2: GY }));
    grill.appendChild(H.el('rect', { class: 'ovs-i-fl', x: GX - 55, y: GY, width: 110, height: 16 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX - 40, y1: GY + 16, x2: GX - 40, y2: GROUND_Y - 2 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX + 40, y1: GY + 16, x2: GX + 40, y2: GROUND_Y - 2 }));
    svg.appendChild(grill);

    // straight (zero-wind) reference — dashed, so the bend in the real
    // trajectory reads clearly against it
    refs.baseline = H.el('line', {
      class: 'ovs-i-fl-thin', x1: GX, y1: GY, x2: GX, y2: GY, style: 'stroke-dasharray:3 4',
    });
    svg.appendChild(refs.baseline);

    // trajectory: bending polyline, sampled every 2in of rise
    refs.trajectory = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(refs.trajectory);

    // living-smoke layer mount — sits over the trajectory, under the
    // hood-plane annotation (see header note re: nominal aperture).
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

    // hood-plane reference line (dashed, tracks the RISE slider)
    refs.hoodPlane = H.el('line', { class: 'ovs-i-cap-plane', x1: 0, y1: 0, x2: 0, y2: 0 });
    svg.appendChild(refs.hoodPlane);
    refs.hoodPlaneLabel = H.el('text', { x: 0, y: 0, text: 'HOOD PLANE' });
    svg.appendChild(refs.hoodPlaneLabel);

    // wind glyph (same shape as i01's)
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

    // drag hit strip over the wind arrow — same geometry as i01's.
    refs.dragWind = H.el('rect', {
      class: 'ovs-i-drag-wind', x: 36, y: 112, width: 90, height: 48, fill: 'transparent',
    });
    svg.appendChild(refs.dragWind);

    // dimension-line mount points (rebuilt every update())
    refs.dimOffset = H.el('g');
    refs.dimRise = H.el('g');
    svg.appendChild(refs.dimOffset);
    svg.appendChild(refs.dimRise);

    // plume-regime note (RB-006 Table 3.8): shown only when Fr > 2.7
    refs.regimeNote = H.el('g');
    svg.appendChild(refs.regimeNote);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const windMph = state['i03-wind'];
    const riseIn = state['i03-rise'];
    const panels = state['i03-panels'];

    // The wind the plume actually feels: the RB-009 panel-sheltered wind
    // (side wind — the panels' lateral row, rb-009:242-247). deflection()
    // carries C_D itself, so the sheltered wind is passed straight in —
    // the readout and the drawn trajectory share it, so they never disagree.
    const effWind = effectiveWind(windMph, { panels: panels === 'both' ? 'both' : 'none', dir: 'side' });
    const deflAtHood = deflection(riseIn, effWind);
    const fr = froude(riseIn, effWind);
    const disrupted = fr > FR_DISRUPTED;

    setReadout('deflection', deflAtHood);
    setReadout('effWind', effWind);
    setReadout('froude', fr);
    // Local formatter (brief: extend fmt ONLY here): the engine's default
    // rounds to an integer; Fr wants two decimals.
    const frEl = container.querySelector('output[aria-labelledby="froude-label"]');
    if (frEl) frEl.textContent = `${fr.toFixed(2)}${disrupted ? ' (disrupted)' : ''}`;
    ctx.physics = { deflAtHood, effWind, fr, disrupted };

    const hoodY = GY - riseIn * PX_PER_IN_Y;

    // --- baseline + hood-plane -----------------------------------------
    refs.baseline.setAttribute('y2', hoodY);
    refs.hoodPlane.setAttribute('y1', hoodY);
    refs.hoodPlane.setAttribute('y2', hoodY);

    // --- trajectory, sampled every 2in of rise --------------------------
    const samples = [];
    for (let z = 0; z <= riseIn; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== riseIn) samples.push(riseIn);

    const xAt = (zIn) => GX + deflection(zIn, effWind) * PX_PER_IN_X;
    const yAt = (zIn) => GY - zIn * PX_PER_IN_Y;

    let d = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      d += `${i === 0 ? 'M' : 'L'}${xAt(z).toFixed(1)} ${yAt(z).toFixed(1)}`;
    }
    refs.trajectory.setAttribute('d', d);

    const endX = xAt(riseIn);
    refs.hoodPlane.setAttribute('x1', Math.min(GX - 80, endX - 20).toFixed(1));
    refs.hoodPlane.setAttribute('x2', Math.max(GX + 80, endX + 20).toFixed(1));
    refs.hoodPlaneLabel.setAttribute('x', Math.min(GX - 80, endX - 20).toFixed(1));
    refs.hoodPlaneLabel.setAttribute('y', (hoodY - 6).toFixed(1));

    // --- dimension lines (re-measured live) -----------------------------
    replaceChildren(refs.dimOffset, H.dimensionLine(
      GX, hoodY - 26, endX, hoodY - 26, `${Math.round(deflAtHood)}″ offset`,
    ));
    replaceChildren(refs.dimRise, H.dimensionLine(
      660, GY, 660, hoodY, `${Math.round(riseIn)}″ rise`,
    ));

    // --- plume regime note: RB-006 Table 3.8 "disrupted" above Fr 2.7 ----
    replaceChildren(refs.regimeNote, ...(disrupted
      ? [H.noteBox(20, 20, `PLUME REGIME DISRUPTED (Fr ${fr.toFixed(1)} > ${FR_DISRUPTED}) — RB-006 §3.8`)]
      : []));

    // --- wind glyph ------------------------------------------------------
    refs.windLabel.textContent = `U = ${Math.round(windMph)} mph`;
    const shaftX = 90 + windMph * 1.5;
    refs.windShaft.setAttribute('x2', shaftX.toFixed(1));
    refs.windArrow.setAttribute('d', `M${shaftX.toFixed(1)} 136 l-7 -4 m7 4 l-7 4`);
    // wind drag strip spans the shaft's full travel (0..20 mph), same as i01.
    refs.dragWind.setAttribute('width', (90 + 20 * 1.5 + 12 - 36).toFixed(1));
  }

  const spec = {
    id: 'i03',
    title: 'Wind Deflection',
    controls: [
      { id: 'i03-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 20, step: 1, value: 5, unit: 'mph' },
      { id: 'i03-rise', type: 'range', label: 'MOUNTING RISE', min: 18, max: 48, step: 2, value: 30, unit: 'in' },
      // 'one' panel is not offered: no RB-009 row for it (rb-009:369).
      {
        id: 'i03-panels', type: 'segmented', label: 'SIDE PANELS', value: 'none',
        options: [{ value: 'none', label: 'NONE' }, { value: 'both', label: 'BOTH' }],
      },
    ],
    readouts: [
      { id: 'deflection', label: 'DEFLECTION AT HOOD PLANE', format: 'in', hero: true },
      { id: 'effWind', label: 'EFFECTIVE WIND', format: 'mph' },
      { id: 'froude', label: 'CROSSWIND FROUDE Fr' },
    ],
    // W5-T2 sticky strip: hero readout only (no verdict on this
    // instrument). Values are copied verbatim from the real readout.
    stickyReadout: ['deflection'],
    scene: buildScene,
    update,

    // --- living smoke: real riseIn/windMph/panels; oversized nominal
    //     aperture so nothing ever tints as escaping (see header note —
    //     shared always-captured rule with i09). ---------------------------
    smoke: (state) => ({
      sourceX: GX, sourceY: GY, pxPerIn: PX_PER_IN_Y,
      widthIn: NOMINAL_WIDTH_IN,
      depthIn: NOMINAL_DEPTH_IN,
      mount: NOMINAL_MOUNT,
      riseIn: state['i03-rise'],
      windMph: state['i03-wind'],
      windDir: 'side',
      panels: state['i03-panels'] === 'both' ? 'both' : 'none',
    }),

    // --- direct manipulation: the wind arrow, 0-20 mph. --------------------
    drag: [
      {
        target: 'wind-arrow', control: 'i03-wind', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => Math.max(0, Math.min(20, Math.round((x - 90) / 1.5))),
        // W5-T3 visible grip: ride the arrow tip (shaftX = 90 + mph*1.5).
        grip: (st) => ({ x: 90 + Math.max(0, Math.min(20, st['i03-wind'])) * 1.5 + 14, y: 136 }),
      },
    ],

    // --- story presets: four site-voice scenarios. -------------------------
    presets: [
      { id: 'calm-low-mount', label: 'Calm, low mount', state: { 'i03-wind': 0, 'i03-rise': 24, 'i03-panels': 'none' } },
      { id: 'breezy-standard', label: 'Breezy, standard mount', state: { 'i03-wind': 8, 'i03-rise': 30, 'i03-panels': 'none' } },
      { id: 'gusty-tall-mount', label: 'Gusty, tall mount', state: { 'i03-wind': 16, 'i03-rise': 42, 'i03-panels': 'none' } },
      { id: 'sheltered-high-wind', label: 'Sheltered, high wind', state: { 'i03-wind': 16, 'i03-rise': 30, 'i03-panels': 'both' } },
    ],
  };

  createInstrument(container, spec);
}
