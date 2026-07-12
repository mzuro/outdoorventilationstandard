// i07.mjs — Side Panel Effectiveness (Task 16).
//
// Same module contract as i01.mjs/i05.mjs (the canonical pattern): a single
// `mount(figureEl)` export, re-mount guarded, physics only from
// ../physics/{capture,plume,wind,sidepanels}.mjs. `parsePreset` seeds the
// (fixed, non-controllable) mount/depth exactly like i01 — this instrument
// isolates the panels x wind interaction, so mount is read from the preset
// once and is not itself a control (matching the brief's three-control
// list: panels, wind, width).
//
// Scene is i01's elevation, simplified: ground, grill, hood, bending plume
// envelope + escape wisps, plus side-panel glyphs that appear per the
// PANELS selection and a wind arrow whose length scales with the
// *effective* wind (post-panel-attenuation), not the raw control value —
// so the glyph itself shows what the panels are doing.
//
// v2.1 (F2) adoption:
//   - smoke: same physics as the drawn plume (widthCtl/mountVal/riseIn/
//     windMph/panels — the exact inputs captureFraction/deflection use).
//   - drag: BOTH the hood edge (6" snap, i01-identical) and the wind
//     arrow. The wind arrow's pixel position encodes EFFECTIVE wind
//     (post-panel), not the raw control, so its toValue inverts through
//     effectiveWind(1, panels) — the panel attenuation factor for the
//     CURRENT panels selection, read from the physics module itself
//     (never a re-derived constant) — to recover the raw i07-wind value
//     the control actually holds.
//   - presets: four site-voice scenarios.
//   - verdict: capture thresholds, same rubric as i01, graded on the
//     WITH-PANELS capture (the hero readout — the scenario the panels
//     were added to solve).

import { createInstrument, gradeCapture } from '../viz.mjs';
import { captureFraction, WIND_COUPLING } from '../physics/capture.mjs';
import { plumeRadius } from '../physics/plume.mjs';
import { deflection } from '../physics/wind.mjs';
import { effectiveWind } from '../physics/sidepanels.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const RISE_IN = 30; // fixed hood mounting height, matching i01's canonical rise
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

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i07Mounted === '1') return;
  figureEl.dataset.i07Mounted = '1';

  const { mount: mountVal, widthIn } = parsePreset(figureEl.dataset.preset);
  const depthIn = MOUNT[mountVal].depthIn;

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
  const GX = 300;
  const GY = 296;
  const HY = 96;
  const pxPerIn = (GY - HY) / RISE_IN;
  const PANEL_DROP = (GY - HY) * 0.62; // panels reach partway down from the hood lip

  let H = null;
  const refs = {};
  let panelsNow = 'none'; // tracked so the wind-arrow drag can invert effective->raw wind

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 340');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Side-view diagram of a cooking plume rising toward a hood, with optional side panels that shelter it from wind.');

    const ground = H.el('g');
    ground.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 30, y1: 318, x2: 690, y2: 318 }));
    for (let x = 50; x <= 670; x += 40) {
      ground.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: 318, x2: x - 8, y2: 327 }));
    }
    svg.appendChild(ground);

    const grill = H.el('g');
    grill.appendChild(H.el('line', { class: 'ovs-i-fl', x1: GX - 55, y1: GY, x2: GX + 55, y2: GY }));
    grill.appendChild(H.el('rect', { class: 'ovs-i-fl', x: GX - 55, y: GY, width: 110, height: 16 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX - 40, y1: GY + 16, x2: GX - 40, y2: 316 }));
    grill.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: GX + 40, y1: GY + 16, x2: GX + 40, y2: 316 }));
    svg.appendChild(grill);

    refs.plumeFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.plumeL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.plumeR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(refs.plumeFill);
    svg.appendChild(refs.plumeL);
    svg.appendChild(refs.plumeR);

    // living-smoke layer mount — over the plume, under the hood (i01 order).
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

    refs.wisp1 = H.el('path', { class: 'ovs-i-wisp', d: '', opacity: 0 });
    refs.wisp2 = H.el('path', { class: 'ovs-i-wisp', d: '', opacity: 0 });
    svg.appendChild(refs.wisp1);
    svg.appendChild(refs.wisp2);

    refs.hood = H.el('path', { class: 'ovs-i-hoodfill', d: '' });
    refs.duct = H.el('rect', { class: 'ovs-i-hoodfill', x: GX - 22, y: 34, width: 44, height: 32 });
    svg.appendChild(refs.hood);
    svg.appendChild(refs.duct);

    // side-panel glyphs — thin vertical fins dropping from the hood lip,
    // toggled per the PANELS control
    refs.panelL = H.el('rect', { class: 'ovs-i-hoodfill', x: 0, y: HY, width: 6, height: PANEL_DROP, opacity: 0 });
    refs.panelR = H.el('rect', { class: 'ovs-i-hoodfill', x: 0, y: HY, width: 6, height: PANEL_DROP, opacity: 0 });
    svg.appendChild(refs.panelL);
    svg.appendChild(refs.panelR);

    // wind glyph (shaft length scales with EFFECTIVE wind, not raw wind) —
    // parked above the hood lip (y 18-56) so it stays clear of the side
    // panels, which extend downward from HY (96) regardless of hood width.
    const wind = H.el('g');
    wind.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 30, x2: 90, y2: 30 }));
    refs.windShaft = H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 48, x2: 104, y2: 48 });
    refs.windArrow = H.el('path', { class: 'ovs-i-fl-thin', d: 'M104 48 l-7 -4 m7 4 l-7 4' });
    wind.appendChild(refs.windShaft);
    wind.appendChild(refs.windArrow);
    wind.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: 66, x2: 90, y2: 66 }));
    refs.windLabel = H.el('text', { x: 40, y: 18, text: '' });
    wind.appendChild(refs.windLabel);
    svg.appendChild(wind);

    refs.dimW = H.el('g');
    svg.appendChild(refs.dimW);

    // --- direct-manipulation hit strips (drawn last, on top) ---------------
    refs.dragHood = H.el('rect', {
      class: 'ovs-i-drag-hood-edge', x: 0, y: HY - 40, width: 44, height: 92, fill: 'transparent',
    });
    refs.dragWind = H.el('rect', {
      class: 'ovs-i-drag-wind', x: 36, y: 24, width: 90, height: 48, fill: 'transparent',
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
    const windMph = state['i07-wind'];
    const widthCtl = state['i07-width'];
    const panels = state['i07-panels'];
    panelsNow = panels;

    const effWind = effectiveWind(windMph, panels);
    const plumeWind = WIND_COUPLING * effWind;

    const capWithPanels = captureFraction({
      widthIn: widthCtl, depthIn, mount: mountVal, riseIn: RISE_IN, windMph, panels,
    });
    const capWithoutPanels = captureFraction({
      widthIn: widthCtl, depthIn, mount: mountVal, riseIn: RISE_IN, windMph, panels: 'none',
    });

    // expose physics to the engine's verdict stamp (spec.verdict)
    ctx.physics = { capWithPanels, capWithoutPanels, effWind };

    setReadout('captureWithPanels', capWithPanels);
    setReadout('captureWithoutPanels', capWithoutPanels);
    setReadout('effWind', effWind);

    // --- plume envelope, matching the WITH-panels (active) scenario -----
    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const centerXAt = (zIn) => GX + deflection(zIn, plumeWind) * pxPerIn;
    const yAt = (zIn) => GY - zIn * pxPerIn;
    const halfWAt = (zIn) => plumeRadius(zIn) * pxPerIn;

    let dl = '', dr = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const cx = centerXAt(z);
      const hw = halfWAt(z);
      const y = yAt(z);
      const op = i === 0 ? 'M' : 'L';
      dl += `${op}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
      dr += `${op}${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    refs.plumeL.setAttribute('d', dl);
    refs.plumeR.setAttribute('d', dr);
    let fill = dl;
    for (let i = samples.length - 1; i >= 0; i--) {
      const z = samples[i];
      fill += `L${(centerXAt(z) + halfWAt(z)).toFixed(1)} ${yAt(z).toFixed(1)}`;
    }
    refs.plumeFill.setAttribute('d', `${fill}Z`);
    const status = statusFor(capWithPanels * 100);
    refs.plumeFill.style.fill = STATUS_FILL[status] || '';

    // --- hood, sized to the width control ---------------------------
    const hoodHalfPx = (widthCtl / 2) * pxPerIn;
    const lx = GX - hoodHalfPx, rx = GX + hoodHalfPx;
    refs.hood.setAttribute('d', `M${lx.toFixed(1)} ${HY} L${rx.toFixed(1)} ${HY} L${GX + 22} 66 L${GX - 22} 66 Z`);

    replaceChildren(refs.dimW, H.dimensionLine(lx, HY - 20, rx, HY - 20, `${Math.round(widthCtl)}″`));

    // --- drag hit strip: centered on the downwind (right) hood lip --------
    refs.dragHood.setAttribute('x', (rx - 22).toFixed(1));

    // --- side panels -----------------------------------------------
    refs.panelL.setAttribute('x', (lx - 6).toFixed(1));
    refs.panelR.setAttribute('x', rx.toFixed(1));
    const showLeft = panels === 'both';
    const showRight = panels === 'one' || panels === 'both';
    refs.panelL.setAttribute('opacity', showLeft ? 1 : 0);
    refs.panelR.setAttribute('opacity', showRight ? 1 : 0);

    // --- wind glyph — shaft scales with EFFECTIVE wind ----------------
    refs.windLabel.textContent = `U = ${Math.round(windMph)} mph (eff. ${Math.round(effWind)})`;
    const shaftX = 90 + effWind * 1.5;
    refs.windShaft.setAttribute('x2', shaftX.toFixed(1));
    refs.windArrow.setAttribute('d', `M${shaftX.toFixed(1)} 48 l-7 -4 m7 4 l-7 4`);
    // wind drag strip spans the shaft's full travel at the CURRENT panel
    // attenuation (max raw wind 16 mph -> max effective = 16 * factor).
    const maxEff = effectiveWind(16, panels);
    refs.dragWind.setAttribute('width', (90 + maxEff * 1.5 + 12 - 36).toFixed(1));

    // --- escape wisps, keyed to the WITH-panels capture number --------
    const escape = Math.max(0, 1 - capWithPanels);
    const showWisps = capWithPanels < 0.97;
    if (showWisps) {
      const sx = Math.min(Math.max(rx, centerXAt(RISE_IN) - halfWAt(RISE_IN) * 0.15), 620);
      const kick = 14 + effWind * 2;
      refs.wisp1.setAttribute('d', `M${sx.toFixed(1)} ${HY} C${(sx + kick).toFixed(1)} ${(HY - 24).toFixed(1)} ${(sx + kick * 2).toFixed(1)} ${(HY - 32).toFixed(1)} ${(sx + kick * 3).toFixed(1)} ${(HY - 52).toFixed(1)}`);
      refs.wisp2.setAttribute('d', `M${(sx + 8).toFixed(1)} ${HY} C${(sx + kick + 10).toFixed(1)} ${(HY - 12).toFixed(1)} ${(sx + kick * 2 + 12).toFixed(1)} ${(HY - 16).toFixed(1)} ${(sx + kick * 3 + 16).toFixed(1)} ${(HY - 30).toFixed(1)}`);
      const op = Math.min(0.85, escape * 2.2);
      refs.wisp1.setAttribute('opacity', op.toFixed(2));
      refs.wisp2.setAttribute('opacity', (op * 0.6).toFixed(2));
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
    id: 'i07',
    title: 'Side Panel Effectiveness',
    controls: [
      {
        id: 'i07-panels', type: 'segmented', label: 'SIDE PANELS', value: 'none',
        options: [{ value: 'none', label: 'NONE' }, { value: 'one', label: 'ONE' }, { value: 'both', label: 'BOTH' }],
      },
      { id: 'i07-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 16, step: 1, value: 8, unit: 'mph' },
      { id: 'i07-width', type: 'range', label: 'HOOD WIDTH', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
    ],
    readouts: [
      { id: 'captureWithPanels', label: 'CAPTURE — WITH PANELS', format: 'pct', hero: true },
      { id: 'captureWithoutPanels', label: 'CAPTURE — WITHOUT PANELS', format: 'pct' },
      { id: 'effWind', label: 'EFFECTIVE WIND', format: 'mph' },
    ],
    scene: buildScene,
    update,

    // --- living smoke: derives entirely from the same physics the drawn
    //     plume + readouts use. --------------------------------------------
    smoke: (state) => ({
      sourceX: GX, sourceY: GY, pxPerIn,
      widthIn: state['i07-width'],
      depthIn,
      mount: mountVal,
      riseIn: RISE_IN,
      windMph: state['i07-wind'],
      panels: state['i07-panels'],
      w0: 400,
    }),

    // --- direct manipulation: hood edge (6" snap) and the wind arrow
    //     (inverted through the CURRENT panel attenuation — see header). ----
    drag: [
      {
        target: 'hood-edge', control: 'i07-width', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(((x - GX) * 2) / pxPerIn),
      },
      {
        target: 'wind-arrow', control: 'i07-wind', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => {
          const factor = effectiveWind(1, panelsNow) || 1;
          const eff = Math.max(0, (x - 90) / 1.5);
          return Math.max(0, Math.min(16, Math.round(eff / factor)));
        },
      },
    ],

    // --- story presets: four site-voice scenarios. -------------------------
    presets: [
      { id: 'calm-evening-no-panels', label: 'Calm evening, no panels', state: { 'i07-panels': 'none', 'i07-wind': 0, 'i07-width': 48 } },
      { id: 'breezy-unshielded', label: 'Breezy, unshielded', state: { 'i07-panels': 'none', 'i07-wind': 10, 'i07-width': 48 } },
      { id: 'windy-corner-one-panel', label: 'Windy corner, one panel', state: { 'i07-panels': 'one', 'i07-wind': 14, 'i07-width': 54 } },
      { id: 'exposed-island-both-panels', label: 'Exposed island, both panels', state: { 'i07-panels': 'both', 'i07-wind': 16, 'i07-width': 60 } },
    ],

    // --- verdict stamp: capture-fraction thresholds, graded on the
    //     WITH-PANELS capture — the scenario the panels exist to fix. -------
    verdict: (state, physics) => {
      const cap = physics ? physics.capWithPanels : 0;
      const grade = gradeCapture(cap);
      return {
        grade,
        clauseRef: 'per OVS-H1 §2.4 / RB-006',
        detail: `Plume capture with panels ${Math.round(cap * 100)}% — thresholds 85% PASS / 60% MARGINAL.`,
      };
    },
  };

  createInstrument(container, spec);
}
