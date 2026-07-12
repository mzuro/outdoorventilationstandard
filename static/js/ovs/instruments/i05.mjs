// i05.mjs — Hood Geometry Comparison (Task 15).
//
// Same module contract as i01.mjs/i02.mjs, plus `parsePreset` seeding the
// A side's initial mount/width exactly like i01/i02 — the first
// multi-scene instrument in the suite (A/B), sharing one drawing function
// (`buildSide`/`paintSide`) between the two halves per the brief ("keep it
// simple, reuse one drawing function for both sides"). Physics only from
// ../physics/capture.mjs (captureFraction) — no deflection is drawn here;
// wind only feeds the capture-fraction integral for each side, at a fixed
// 30in rise (matching i01's canonical rise).

import { createInstrument } from '../viz.mjs';
import { captureFraction } from '../physics/capture.mjs';
import { plumeRadius } from '../physics/plume.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset } from '../hood-presets.mjs';

const RISE_IN = 30;
const SAMPLE_STEP_IN = 2;

const STATUS_FILL = {
  ok: null, // fall back to the .ovs-i-plume-fill CSS default
  warn: 'rgba(138, 90, 0, 0.12)',
  fail: 'rgba(180, 35, 24, 0.14)',
};

function statusFor(pct) {
  if (pct >= 90) return 'ok';
  if (pct >= 70) return 'warn';
  return 'fail';
}

// Local formatter (extended only here, per the i02 BTU-bubble precedent):
// a signed percent for the A-B delta, e.g. 0.23 -> "+23%", -0.23 -> "-23%".
const fmtSignedPct = (frac) => `${frac >= 0 ? '+' : ''}${Math.round(frac * 100)}%`;

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i05Mounted === '1') return;
  figureEl.dataset.i05Mounted = '1';

  const { mount: mountVal, widthIn } = parsePreset(figureEl.dataset.preset);
  const otherMount = mountVal === 'island' ? 'wall' : 'island';

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
  const CX_A = 190, CX_B = 550;
  const DIVIDER_X = 360;
  const GY = 300; // appliance plane, y (shared)
  const PX_PER_IN = 3.2;
  const TOP_Y = GY - RISE_IN * PX_PER_IN; // hood mouth, y (shared, fixed rise)

  let H = null;
  const refs = {};

  function buildSide(svg, cx, wallSide) {
    const g = H.el('g');

    // appliance line art — fixed size, independent of the width control
    g.appendChild(H.el('line', { class: 'ovs-i-fl', x1: cx - 40, y1: GY, x2: cx + 40, y2: GY }));
    g.appendChild(H.el('rect', { class: 'ovs-i-fl', x: cx - 40, y: GY, width: 80, height: 12 }));

    // wall backdrop (visible only when mount === 'wall'), flanking the
    // outer edge of this mini-scene
    const wallX = wallSide === 'left' ? cx - 130 : cx + 130;
    const wall = H.el('g');
    wall.appendChild(H.el('line', { class: 'ovs-i-fl', x1: wallX, y1: 40, x2: wallX, y2: GY + 12 }));
    for (let y = 50; y <= GY; y += 26) {
      const tickDx = wallSide === 'left' ? 10 : -10;
      wall.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: wallX, y1: y, x2: wallX + tickDx, y2: y + 8 }));
    }
    svg.appendChild(wall);

    const envFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    const envL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    const envR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(envFill);
    svg.appendChild(envL);
    svg.appendChild(envR);

    const hood = H.el('path', { class: 'ovs-i-hoodfill', d: '' });
    const duct = H.el('rect', { class: 'ovs-i-hoodfill', x: cx - 18, y: TOP_Y - 60, width: 36, height: 26 });
    svg.appendChild(hood);
    svg.appendChild(duct);
    svg.appendChild(g);

    const capLabel = H.el('text', { x: cx, y: 22, 'text-anchor': 'middle', text: '' });
    svg.appendChild(capLabel);

    return { cx, wall, envFill, envL, envR, hood, capLabel };
  }

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 320');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Side-by-side comparison of two hood configurations, A and B, over identical cooking sources, shaded by how much of each plume its hood captures.');

    svg.appendChild(H.el('text', { x: CX_A, y: 48, 'text-anchor': 'middle', text: 'A' }));
    svg.appendChild(H.el('text', { x: CX_B, y: 48, 'text-anchor': 'middle', text: 'B' }));
    svg.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: DIVIDER_X, y1: 30, x2: DIVIDER_X, y2: GY + 20, style: 'stroke-dasharray:2 4' }));

    refs.a = buildSide(svg, CX_A, 'left');
    refs.b = buildSide(svg, CX_B, 'right');
  }

  function paintSide(side, widthIn2, mountVal2, capFrac) {
    side.wall.setAttribute('opacity', mountVal2 === 'wall' ? '1' : '0');

    const hoodHalf = (widthIn2 / 2) * PX_PER_IN;
    const cx = side.cx;
    side.hood.setAttribute('d', `M${(cx - hoodHalf).toFixed(1)} ${TOP_Y} L${(cx + hoodHalf).toFixed(1)} ${TOP_Y} L${cx + 18} ${TOP_Y - 34} L${cx - 18} ${TOP_Y - 34} Z`);

    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const yAt = (zIn) => GY - zIn * PX_PER_IN;
    const halfWAt = (zIn) => plumeRadius(zIn) * PX_PER_IN;

    let dl = '', dr = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const hw = halfWAt(z);
      const y = yAt(z);
      const op = i === 0 ? 'M' : 'L';
      dl += `${op}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
      dr += `${op}${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    side.envL.setAttribute('d', dl);
    side.envR.setAttribute('d', dr);
    let fill = dl;
    for (let i = samples.length - 1; i >= 0; i--) {
      const z = samples[i];
      fill += `L${(cx + halfWAt(z)).toFixed(1)} ${yAt(z).toFixed(1)}`;
    }
    side.envFill.setAttribute('d', `${fill}Z`);
    const status = statusFor(capFrac * 100);
    side.envFill.style.fill = STATUS_FILL[status] || '';

    side.capLabel.textContent = `${widthIn2}″ ${mountVal2} — ${Math.round(capFrac * 100)}% capture`;
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const widthA = state['i05-widthA'];
    const widthB = state['i05-widthB'];
    const mountA = MOUNT[state['i05-mountA']] ? state['i05-mountA'] : 'island';
    const mountB = MOUNT[state['i05-mountB']] ? state['i05-mountB'] : 'wall';
    const windMph = state['i05-wind'];

    const capA = captureFraction({
      widthIn: widthA, depthIn: MOUNT[mountA].depthIn, mount: mountA, riseIn: RISE_IN, windMph, panels: 'none',
    });
    const capB = captureFraction({
      widthIn: widthB, depthIn: MOUNT[mountB].depthIn, mount: mountB, riseIn: RISE_IN, windMph, panels: 'none',
    });

    setReadout('captureA', capA);
    setReadout('captureB', capB);
    const delta = capA - capB;
    setReadout('deltaCapture', delta);
    // Local override to the signed-percent format (brief: "+23%"); the
    // engine's generic 'pct' formatter has already run via setReadout
    // above, so this always wins, mirroring i02's BTU-bubble pattern.
    const deltaEl = container.querySelector('output[aria-labelledby="deltaCapture-label"]');
    if (deltaEl) deltaEl.textContent = fmtSignedPct(delta);

    paintSide(refs.a, widthA, mountA, capA);
    paintSide(refs.b, widthB, mountB, capB);
  }

  const spec = {
    id: 'i05',
    title: 'Hood Geometry Comparison',
    controls: [
      { id: 'i05-widthA', type: 'range', label: 'WIDTH A', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i05-mountA', type: 'segmented', label: 'MOUNT A', value: mountVal,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      { id: 'i05-widthB', type: 'range', label: 'WIDTH B', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i05-mountB', type: 'segmented', label: 'MOUNT B', value: otherMount,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      { id: 'i05-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 12, step: 1, value: 8, unit: 'mph' },
    ],
    readouts: [
      { id: 'captureA', label: 'CAPTURE A', format: 'pct', hero: true },
      { id: 'captureB', label: 'CAPTURE B', format: 'pct', hero: true },
      { id: 'deltaCapture', label: 'Δ CAPTURE (A − B)', format: 'pct' },
    ],
    scene: buildScene,
    update,
  };

  createInstrument(container, spec);
}
