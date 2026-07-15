// i06.mjs — Velocity Decay Curves (Task 15).
//
// Same module contract as i01.mjs/i02.mjs: a single `mount(figureEl)`
// export, re-mount guarded. Physics only from ../physics/plume.mjs
// (centerlineVelocity) — w0=400/z0=12 calibration is never recomputed here.
//
// No mount/width control on this instrument, so it does not read
// `data-preset`.
//
// Scene: a velocity-vs-height chart (height on x, centerline velocity on
// y) sampled every 2in from 0 to 60in; a tracer dot slides along the curve
// to the DISTANCE control; two dashed capture-plane-style reference lines
// mark the wall (100 fpm) and island (150 fpm) minimum capture-velocity
// thresholds — scene lines only, per the brief, not readouts.
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

const SAMPLE_STEP_IN = 2;
const MAX_Z_IN = 60; // matches the DISTANCE control's max
const MAX_VEL_FPM = 450; // y-axis ceiling — clears the z=0 plateau (400 fpm) with headroom
const WALL_THRESHOLD_FPM = 100;
const ISLAND_THRESHOLD_FPM = 150;

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

    // capture-velocity threshold lines (fixed — do not depend on state)
    const wallY = yFor(WALL_THRESHOLD_FPM);
    const islandY = yFor(ISLAND_THRESHOLD_FPM);
    const wall = H.el('line', { class: 'ovs-i-cap-plane', x1: X0, y1: wallY, x2: X1, y2: wallY });
    const wallLabel = H.el('text', { x: X1, y: wallY - 5, 'text-anchor': 'end', text: `wall capture — ${WALL_THRESHOLD_FPM} fpm` });
    const island = H.el('line', { class: 'ovs-i-cap-plane', x1: X0, y1: islandY, x2: X1, y2: islandY });
    const islandLabel = H.el('text', { x: X1, y: islandY - 5, 'text-anchor': 'end', text: `island capture — ${ISLAND_THRESHOLD_FPM} fpm` });
    svg.appendChild(wall);
    svg.appendChild(wallLabel);
    svg.appendChild(island);
    svg.appendChild(islandLabel);

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
    const velocity = centerlineVelocity(distanceIn);

    setReadout('velocity', velocity);

    // --- decay curve, sampled every 2in --------------------------------
    const samples = [];
    for (let z = 0; z <= MAX_Z_IN; z += SAMPLE_STEP_IN) samples.push(z);

    let d = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const x = xFor(z);
      const y = yFor(centerlineVelocity(z));
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
      { id: 'i06-distance', type: 'range', label: 'DISTANCE ABOVE SOURCE', min: 6, max: 60, step: 2, value: 24, unit: 'in' },
    ],
    readouts: [
      { id: 'velocity', label: 'CENTERLINE VELOCITY', format: 'fpm', hero: true },
    ],
    scene: buildScene,
    update,

    // --- direct manipulation: grab the tracer, 2in step to match the
    //     control, clamped to the chart's 6-60in range. ---------------------
    drag: [
      {
        target: '.ovs-i-drag-tracer', control: 'i06-distance', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => Math.max(6, Math.min(MAX_Z_IN, Math.round((((x - X0) / (X1 - X0)) * MAX_Z_IN) / 2) * 2)),
        // W5-T3 visible grip: ride the tracer dot on the curve (same xFor/
        // yFor/centerlineVelocity update() positions the dot with).
        grip: (st) => {
          const z = Math.max(6, Math.min(MAX_Z_IN, st['i06-distance']));
          return { x: xFor(z), y: yFor(centerlineVelocity(z)) };
        },
      },
    ],

    // --- story presets: four site-voice distances. --------------------------
    presets: [
      { id: 'right-at-the-grate', label: 'Right at the grate', state: { 'i06-distance': 6 } },
      { id: 'mid-plume', label: 'Mid-plume', state: { 'i06-distance': 24 } },
      { id: 'near-a-wall-hood', label: 'Near a wall hood', state: { 'i06-distance': 42 } },
      { id: 'near-a-tall-island-hood', label: 'Near a tall island hood', state: { 'i06-distance': 60 } },
    ],

    // No spec.verdict — see the header comment.
  };

  createInstrument(container, spec);
}
