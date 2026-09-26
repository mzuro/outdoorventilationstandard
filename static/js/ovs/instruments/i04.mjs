// i04.mjs — Plume Width by Height (Task 15).
//
// Same module contract as i01.mjs/i02.mjs: a single `mount(figureEl)`
// export, re-mount guarded. Physics only from ../physics/plume.mjs
// (captureDiameter, recommendedWidth) and ../physics/heat.mjs (SOURCES) —
// the Heskestad d_capture = 0.48·(z − z_0) + D_eff (rb-002:983) and the
// RB-002 K = 1.38 width margin are never recomputed here.
//
// No mount/width control on this instrument (it isolates plume growth from
// hood geometry entirely), so it does not read `data-preset`. A SOURCE
// control (physics Stage B) picks the RB-001 Table 3.1 row; the default is
// Gas Grill Medium, the papers' reference case (RB-002 Table 3.3a).
//
// Scene: a symmetric envelope grown from captureDiameter(z, src), always
// drawn over the instrument's full 0-48in range regardless of the slider,
// subtly shaded like i01's plume fill; a horizontal measuring line at the
// HEIGHT-OF-INTEREST control re-measures the envelope live via the engine's
// dimensionLine helper.
//
// v2.1 (F2) adoption:
//   - drag: the measuring line itself is the handle — grab it anywhere
//     along its vertical travel to set HEIGHT OF INTEREST (target
//     'hood-height' -> the engine's `.ovs-i-drag-height` selector).
//   - presets: four site-voice heights.
//   - verdict: SKIPPED, per the plan's explicit list (i04/i06/i09/i10 —
//     "no pass/fail semantics"). Plume width at a height is a pure
//     descriptive dimension with no standards threshold to grade against;
//     nothing here is a compliance question.
//   - smoke/other drag targets: not assigned by the plan.

import { createInstrument } from '../viz.mjs';
import { captureDiameter, recommendedWidth } from '../physics/plume.mjs';
import { SOURCES } from '../physics/heat.mjs';

const SAMPLE_STEP_IN = 2;
const MAX_Z_IN = 48; // fixed envelope range, independent of the slider

/** SOURCE menu — RB-001 Table 3.1 rows (rb-001:241-252). */
const SOURCE_MENU = [
  { value: 'gasSmall', label: 'GAS 25K' },
  { value: 'gasMedium', label: 'GAS 40K' },
  { value: 'gasLarge', label: 'GAS 60K' },
  { value: 'gasHigh', label: 'GAS 80K' },
  { value: 'charcoalKettle', label: 'CHARCOAL' },
  { value: 'woodFired', label: 'WOOD-FIRED' },
  { value: 'pelletHigh', label: 'PELLET' },
];
const sourceFor = (v) => SOURCES[v] || SOURCES.gasMedium;
const shortLabel = (src) => (SOURCE_MENU.find((o) => o.value === src.id) || { label: src.id }).label;

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i04Mounted === '1') return;
  figureEl.dataset.i04Mounted = '1';

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
  const GX = 240; // vertical centerline
  const GY = 320; // source (z=0) plane, y
  const TOP_Y = 50; // z = MAX_Z_IN
  const PX_PER_IN = (GY - TOP_Y) / MAX_Z_IN;

  let H = null;
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 480 360');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Diagram of a cooking plume\'s envelope widening with height above the cook surface, with a measuring line at the selected height.');

    // source / cook-surface line art (static)
    const source = H.el('g');
    source.appendChild(H.el('line', { class: 'ovs-i-fl', x1: GX - 55, y1: GY, x2: GX + 55, y2: GY }));
    source.appendChild(H.el('rect', { class: 'ovs-i-fl', x: GX - 55, y: GY, width: 110, height: 16 }));
    source.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX - 40, y1: GY + 16, x2: GX - 40, y2: 340 }));
    source.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX + 40, y1: GY + 16, x2: GX + 40, y2: 340 }));
    svg.appendChild(source);

    // envelope: fill + edges + centerline (rebuilt every update)
    refs.envFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.envL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envC = H.el('line', { class: 'ovs-i-plume-center', x1: GX, y1: GY, x2: GX, y2: TOP_Y });
    svg.appendChild(refs.envFill);
    svg.appendChild(refs.envL);
    svg.appendChild(refs.envR);
    svg.appendChild(refs.envC);

    // source-width note (constant, at the base)
    refs.sourceNote = H.el('g');
    svg.appendChild(refs.sourceNote);

    // live measuring line at the selected height (rebuilt every update)
    refs.measureLine = H.el('g');
    svg.appendChild(refs.measureLine);

    // drag hit strip, re-measured live onto the current measuring line —
    // wide enough to grab regardless of the envelope's width at that height.
    refs.dragHeight = H.el('rect', {
      class: 'ovs-i-drag-height', x: GX - 80, y: 0, width: 160, height: 44, fill: 'transparent',
    });
    svg.appendChild(refs.dragHeight);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const heightIn = state['i04-height'];
    const src = sourceFor(state['i04-source']);
    // RB-002 capture diameter (98 % flux contour + source width) at the
    // cooking surface and at the selected height, and the RB-002
    // recommended hood width W_rec = 1.38 · d_capture there.
    const sourceWidth = captureDiameter(0, src);
    const widthAtHeight = captureDiameter(heightIn, src);
    const recWidth = recommendedWidth(heightIn, src);

    setReadout('width', widthAtHeight);
    setReadout('recWidth', recWidth);
    setReadout('sourceWidth', sourceWidth);

    // --- envelope, always drawn over the full 0..MAX_Z_IN range ---------
    const samples = [];
    for (let z = 0; z <= MAX_Z_IN; z += SAMPLE_STEP_IN) samples.push(z);

    const yAt = (zIn) => GY - zIn * PX_PER_IN;
    const halfWAt = (zIn) => (captureDiameter(zIn, src) / 2) * PX_PER_IN;

    let dl = '', dr = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const hw = halfWAt(z);
      const y = yAt(z);
      const op = i === 0 ? 'M' : 'L';
      dl += `${op}${(GX - hw).toFixed(1)} ${y.toFixed(1)}`;
      dr += `${op}${(GX + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    refs.envL.setAttribute('d', dl);
    refs.envR.setAttribute('d', dr);
    let fill = dl;
    for (let i = samples.length - 1; i >= 0; i--) {
      const z = samples[i];
      fill += `L${(GX + halfWAt(z)).toFixed(1)} ${yAt(z).toFixed(1)}`;
    }
    refs.envFill.setAttribute('d', `${fill}Z`);

    // --- source-width note (constant) -----------------------------------
    replaceChildren(refs.sourceNote, H.noteBox(20, 20, `${shortLabel(src)} · d_capture AT GRATE ${Math.round(sourceWidth)}″`));

    // --- live measuring line at the selected height ----------------------
    const my = yAt(heightIn);
    const mhw = halfWAt(heightIn);
    replaceChildren(refs.measureLine, H.dimensionLine(
      GX - mhw, my, GX + mhw, my, `${Math.round(widthAtHeight)}″ at ${Math.round(heightIn)}″`,
    ));

    refs.dragHeight.setAttribute('y', (my - 22).toFixed(1));
  }

  const spec = {
    id: 'i04',
    title: 'Plume Width',
    controls: [
      { id: 'i04-height', type: 'range', label: 'HEIGHT OF INTEREST', min: 0, max: 48, step: 2, value: 30, unit: 'in' },
      { id: 'i04-source', type: 'segmented', label: 'SOURCE', value: 'gasMedium', options: SOURCE_MENU },
    ],
    readouts: [
      { id: 'width', label: 'CAPTURE DIAMETER AT HEIGHT', format: 'in', hero: true },
      { id: 'recWidth', label: 'RB-002 RECOMMENDED WIDTH', format: 'in' },
      { id: 'sourceWidth', label: 'DIAMETER AT THE GRATE', format: 'in' },
    ],
    scene: buildScene,
    update,

    // --- direct manipulation: grab the measuring line anywhere along its
    //     vertical travel, 2in step to match the control. -------------------
    drag: [
      {
        target: 'hood-height', control: 'i04-height', axis: 'y', cursor: 'ns-resize',
        toValue: (y) => Math.max(0, Math.min(MAX_Z_IN, Math.round(((GY - y) / PX_PER_IN) / 2) * 2)),
      },
    ],

    // --- story presets: four site-voice heights. ---------------------------
    presets: [
      { id: 'right-at-the-grate', label: 'Right at the grate', state: { 'i04-height': 2, 'i04-source': 'gasMedium' } },
      { id: 'countertop-height', label: 'Countertop height', state: { 'i04-height': 12, 'i04-source': 'gasMedium' } },
      { id: 'standard-capture-zone', label: 'RB-002 row: 30 in, 40k gas', state: { 'i04-height': 30, 'i04-source': 'gasMedium' } },
      { id: 'near-a-tall-hood', label: 'Tall hood, 60k gas', state: { 'i04-height': 48, 'i04-source': 'gasLarge' } },
    ],

    // No spec.verdict — see the header comment.
  };

  createInstrument(container, spec);
}
