// i04.mjs — Plume Width by Height (Task 15).
//
// Same module contract as i01.mjs/i02.mjs: a single `mount(figureEl)`
// export, re-mount guarded. Physics only from ../physics/plume.mjs
// (plumeRadius) — the b0/entrainment calibration is never recomputed here.
//
// No mount/width control on this instrument (it isolates plume growth from
// hood geometry entirely), so it does not read `data-preset`.
//
// Scene: a symmetric envelope grown from plumeRadius(z), always drawn over
// the instrument's full 0-48in range regardless of the slider, subtly
// shaded like i01's plume fill; a horizontal measuring line at the
// HEIGHT-OF-INTEREST control re-measures the envelope live via the engine's
// dimensionLine helper.

import { createInstrument } from '../viz.mjs';
import { plumeRadius } from '../physics/plume.mjs';

const SAMPLE_STEP_IN = 2;
const MAX_Z_IN = 48; // fixed envelope range, independent of the slider

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
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const heightIn = state['i04-height'];
    const sourceWidth = 2 * plumeRadius(0);
    const widthAtHeight = 2 * plumeRadius(heightIn);

    setReadout('width', widthAtHeight);
    setReadout('sourceWidth', sourceWidth);

    // --- envelope, always drawn over the full 0..MAX_Z_IN range ---------
    const samples = [];
    for (let z = 0; z <= MAX_Z_IN; z += SAMPLE_STEP_IN) samples.push(z);

    const yAt = (zIn) => GY - zIn * PX_PER_IN;
    const halfWAt = (zIn) => plumeRadius(zIn) * PX_PER_IN;

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
    replaceChildren(refs.sourceNote, H.noteBox(20, 20, `SOURCE WIDTH ${Math.round(sourceWidth)}″`));

    // --- live measuring line at the selected height ----------------------
    const my = yAt(heightIn);
    const mhw = halfWAt(heightIn);
    replaceChildren(refs.measureLine, H.dimensionLine(
      GX - mhw, my, GX + mhw, my, `${Math.round(widthAtHeight)}″ at ${Math.round(heightIn)}″`,
    ));
  }

  const spec = {
    id: 'i04',
    title: 'Plume Width',
    controls: [
      { id: 'i04-height', type: 'range', label: 'HEIGHT OF INTEREST', min: 0, max: 48, step: 2, value: 30, unit: 'in' },
    ],
    readouts: [
      { id: 'width', label: 'PLUME WIDTH AT HEIGHT', format: 'in', hero: true },
      { id: 'sourceWidth', label: 'SOURCE WIDTH', format: 'in' },
    ],
    scene: buildScene,
    update,
  };

  createInstrument(container, spec);
}
