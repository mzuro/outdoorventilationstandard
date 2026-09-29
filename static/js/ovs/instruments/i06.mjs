// i06.mjs — Velocity Decay Curves (Task 15).
//
// Same module contract as i01.mjs/i02.mjs: a single `mount(figureEl)`
// export, re-mount guarded. Physics only from ../physics/plume.mjs
// (centerlineVelocity — the Heskestad u_0 = 1.03·Q_c^(1/3)·(z − z_0)^(−1/3),
// rb-001:135) and ../physics/heat.mjs (SOURCES) — nothing is recomputed
// here.
//
// No mount/width control on this instrument, so it does not read
// `data-preset`. A SOURCE control (physics Stage B) picks the RB-001 row;
// the default is Gas Grill Medium, whose column is RB-003 Table 3.1b.
//
// Scene: a velocity-vs-height chart (height on x, centerline velocity on
// y) sampled every 2in from 6 to 72in; a tracer dot slides along the curve
// to the DISTANCE control; one dashed reference line marks the ASHRAE
// heavy-duty face velocity of 100 fpm, which RB-003 §2.5 explains is NOT
// the outdoor capture criterion (every source clears it at every height,
// rb-003:287) — a scene line only, not a readout. The old 150 fpm
// "island threshold" line had no paper basis and is gone.
//
// v2.1 (F2) adoption:
//   - drag: the tracer dot itself, along its curve's x-axis (distance).
//     There is no keyword in the engine's DRAG_SELECTORS map for a bare
//     tracer, so this uses viz.mjs's documented raw-selector fallback
//     (`DRAG_SELECTORS[d.target] || d.target`) with a custom class.
//   - presets: four site-voice distances.
//   - verdict: SKIPPED, per the plan's explicit list — a velocity reading
//     at an arbitrary height has no PASS/FAIL threshold of its own (the
//     wall/island lines drawn here are reference context, not a graded
//     readout).
//   - smoke: not assigned by the plan.

import { createInstrument } from '../viz.mjs';
import { centerlineVelocity } from '../physics/plume.mjs';
import { SOURCES } from '../physics/heat.mjs';

const SAMPLE_STEP_IN = 2;
const MIN_Z_IN = 6; // RB-003 Table 3.1b starts at 6 in (rb-003:277)
const MAX_Z_IN = 72; // matches the DISTANCE control's max and the table's last row
const MAX_VEL_FPM = 700; // y-axis ceiling — clears Gas High-Output at 6 in (615 fpm, rb-003:277)
const ASHRAE_FACE_FPM = 100; // reference only (rb-003:287, RB-003 §2.5)

/** SOURCE menu — RB-001 Table 3.1 rows, the RB-003 Table 3.1b columns. */
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
  if (!figureEl || figureEl.dataset.i06Mounted === '1') return;
  figureEl.dataset.i06Mounted = '1';

  const keep = new Set(['NOSCRIPT', 'FIGCAPTION']);
  for (const node of Array.from(figureEl.childNodes)) {
    if (node.nodeType === 1 && keep.has(node.tagName)) continue;
    figureEl.removeChild(node);
  }
  const container = document.createElement('div');
  container.className = 'ovs-instrument-mount';
  const figcaption = figureEl.querySelector('figcaption');
  figureEl.insertBefore(container, figcaption || null);

  // --- chart geometry (px), fixed regardless of controls ---------------
  const X0 = 100, X1 = 690; // z = 0 .. MAX_Z_IN
  const Y_TOP = 40, Y_BOTTOM = 280; // velocity = MAX_VEL_FPM .. 0
  const xFor = (zIn) => X0 + (Math.min(zIn, MAX_Z_IN) / MAX_Z_IN) * (X1 - X0);
  const yFor = (fpm) => Y_BOTTOM - (Math.min(fpm, MAX_VEL_FPM) / MAX_VEL_FPM) * (Y_BOTTOM - Y_TOP);

  let H = null;
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 320');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Chart of centerline plume velocity decaying with height above the source, with a tracer at the selected distance and wall/island capture-velocity thresholds.');

    // axis + gridlines
    const axis = H.el('g');
    axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0, y1: Y_BOTTOM, x2: X1, y2: Y_BOTTOM }));
    axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0, y1: Y_TOP, x2: X0, y2: Y_BOTTOM }));
    for (let z = 0; z <= MAX_Z_IN; z += 12) {
      const x = xFor(z);
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: Y_BOTTOM, x2: x, y2: Y_BOTTOM + 6 }));
      axis.appendChild(H.el('text', { x, y: Y_BOTTOM + 20, 'text-anchor': 'middle', text: `${z}″` }));
    }
    for (let v = 0; v <= MAX_VEL_FPM; v += 100) {
      const y = yFor(v);
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0 - 6, y1: y, x2: X0, y2: y }));
      axis.appendChild(H.el('text', { x: X0 - 10, y: y + 3.5, 'text-anchor': 'end', text: `${v}` }));
    }
    axis.appendChild(H.el('text', { x: X1, y: Y_BOTTOM + 34, 'text-anchor': 'end', text: 'height above source, in' }));
    svg.appendChild(axis);

    // ASHRAE face-velocity reference line (fixed — does not depend on state)
    const refY = yFor(ASHRAE_FACE_FPM);
    svg.appendChild(H.el('line', { class: 'ovs-i-cap-plane', x1: X0, y1: refY, x2: X1, y2: refY }));
    svg.appendChild(H.el('text', { x: X1, y: refY - 5, 'text-anchor': 'end', text: `ASHRAE face velocity ${ASHRAE_FACE_FPM} fpm — not the outdoor criterion (RB-003 §2.5)` }));

    // source note (rebuilt per update)
    refs.sourceNote = H.el('g');
    svg.appendChild(refs.sourceNote);

    // decay curve (rebuilt each update only if calibration ever moved; here
    // it is static, but built in update() alongside the tracer for symmetry
    // with the other instruments' "everything live" convention)
    refs.curve = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(refs.curve);

    // tracer dot + live dimension line to the axis
    refs.tracerDrop = H.el('line', { class: 'ovs-i-fl-thin', x1: 0, y1: 0, x2: 0, y2: 0, style: 'stroke-dasharray:2 3' });
    refs.tracer = H.el('circle', { r: 5, style: 'fill:var(--accent);stroke:var(--surface);stroke-width:2' });
    svg.appendChild(refs.tracerDrop);
    svg.appendChild(refs.tracer);
    refs.dimLabel = H.el('g');
    svg.appendChild(refs.dimLabel);

    // drag hit strip, re-measured live around the tracer — full chart
    // height so the whole vertical curve stays grabbable at any distance.
    refs.dragTracer = H.el('rect', {
      class: 'ovs-i-drag-tracer', x: 0, y: Y_TOP, width: 44, height: Y_BOTTOM - Y_TOP, fill: 'transparent',
    });
    svg.appendChild(refs.dragTracer);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const distanceIn = state['i06-distance'];
    const src = sourceFor(state['i06-source']);
    const velocity = centerlineVelocity(distanceIn, src);

    setReadout('velocity', velocity);
    setReadout('qc', src.qcKw);
    // Local formatter (brief: extend fmt ONLY here): Q_c wants one decimal.
    const qcEl = container.querySelector('output[aria-labelledby="qc-label"]');
    if (qcEl) qcEl.textContent = `${src.qcKw.toFixed(1)} kW`;

    replaceChildren(refs.sourceNote, H.noteBox(X0 + 10, Y_TOP - 24, `${shortLabel(src)} · Q_c ${src.qcKw.toFixed(1)} kW · z_0 ${src.z0M.toFixed(2)} m`));

    // --- decay curve, sampled every 2in --------------------------------
    const samples = [];
    for (let z = MIN_Z_IN; z <= MAX_Z_IN; z += SAMPLE_STEP_IN) samples.push(z);

    let d = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const x = xFor(z);
      const y = yFor(centerlineVelocity(z, src));
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    refs.curve.setAttribute('d', d);

    // --- tracer, slides along the curve to the DISTANCE control --------
    const tx = xFor(distanceIn);
    const ty = yFor(velocity);
    refs.tracer.setAttribute('cx', tx.toFixed(1));
    refs.tracer.setAttribute('cy', ty.toFixed(1));
    refs.tracerDrop.setAttribute('x1', tx.toFixed(1));
    refs.tracerDrop.setAttribute('y1', Y_BOTTOM.toFixed(1));
    refs.tracerDrop.setAttribute('x2', tx.toFixed(1));
    refs.tracerDrop.setAttribute('y2', ty.toFixed(1));

    replaceChildren(refs.dimLabel, H.dimensionLine(
      X0, ty, tx, ty, `${Math.round(velocity)} fpm at ${Math.round(distanceIn)}″`,
    ));

    refs.dragTracer.setAttribute('x', (tx - 22).toFixed(1));
  }

  const spec = {
    id: 'i06',
    title: 'Velocity Decay',
    controls: [
      { id: 'i06-distance', type: 'range', label: 'DISTANCE ABOVE SOURCE', min: MIN_Z_IN, max: MAX_Z_IN, step: 2, value: 30, unit: 'in' },
      { id: 'i06-source', type: 'segmented', label: 'SOURCE', value: 'gasMedium', options: SOURCE_MENU },
    ],
    readouts: [
      { id: 'velocity', label: 'CENTERLINE VELOCITY u_0', format: 'fpm', hero: true },
      { id: 'qc', label: 'CONVECTIVE HEAT Q_c' },
    ],
    scene: buildScene,
    update,

    // --- direct manipulation: grab the tracer, 2in step to match the
    //     control, clamped to the chart's 6-60in range. ---------------------
    drag: [
      {
        target: '.ovs-i-drag-tracer', control: 'i06-distance', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => Math.max(MIN_Z_IN, Math.min(MAX_Z_IN, Math.round((((x - X0) / (X1 - X0)) * MAX_Z_IN) / 2) * 2)),
        // W5-T3 visible grip: ride the tracer dot on the curve (same xFor/
        // yFor/centerlineVelocity update() positions the dot with).
        grip: (st) => {
          const z = Math.max(MIN_Z_IN, Math.min(MAX_Z_IN, st['i06-distance']));
          return { x: xFor(z), y: yFor(centerlineVelocity(z, sourceFor(st['i06-source']))) };
        },
      },
    ],

    // --- story presets: four site-voice distances. --------------------------
    presets: [
      { id: 'right-at-the-grate', label: 'Right at the grate', state: { 'i06-distance': 6, 'i06-source': 'gasMedium' } },
      { id: 'standard-hood-height', label: 'RB-003 row: 30 in, 40k gas', state: { 'i06-distance': 30, 'i06-source': 'gasMedium' } },
      { id: 'charcoal-kettle', label: 'Charcoal kettle at 30 in', state: { 'i06-distance': 30, 'i06-source': 'charcoalKettle' } },
      { id: 'near-a-tall-island-hood', label: 'Tall hood, 60k gas', state: { 'i06-distance': 48, 'i06-source': 'gasLarge' } },
    ],

    // No spec.verdict — see the header comment.
  };

  createInstrument(container, spec);
}
