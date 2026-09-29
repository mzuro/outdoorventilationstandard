// i09.mjs — Heat Release Rate Comparison (Task 16; re-based on RB-001 in
// physics Stage B).
//
// Same module contract as i01.mjs (single `mount(figureEl)` export,
// re-mount guarded). No mount/width control on this instrument (it
// isolates appliance heat output from hood geometry), so — per the
// T15-approved convention — it does not read `data-preset`.
//
// Physics only from ../physics/{heat,plume}.mjs: the APPLIANCE control is
// the RB-001 Table 3.1 source list itself (heat.mjs SOURCES — Q_total,
// χ_c, Q_c, D_eff, and the tabulated virtual origin z_0 of Table 3.2), and
// the readouts are the paper's own quantities for that row: the convective
// heat Q_c = χ_c · Q_total (rb-001:241-252) and the Heskestad centerline
// velocity u_0 at the 30 in reference height (plume.mjs centerlineVelocity;
// RB-003 Table 3.1b's 30 in row, rb-003:281). The drawn envelope is the
// RB-002 capture diameter d_capture(z) = 0.48·(z − z_0) + D_eff
// (plume.mjs captureDiameter, rb-002:983) — a stronger source has a wider,
// faster plume through its own Q_c / D_eff / z_0, not through a
// visualization scale factor (the old w0/400 device is gone).
//
// v2.1 (F2) adoption:
//   - smoke: rides the selected source's own centerline velocity and
//     capture diameter (smoke.mjs takes `src`). There is no hood/capture
//     concept in this instrument — it isolates appliance heat output from
//     hood geometry — so the smoke is given a deliberately oversized
//     nominal aperture (NOMINAL_WIDTH_IN/NOMINAL_DEPTH_IN) so every
//     particle always registers as "captured" and none render
//     ember-orange: there is no readout here an escape tint could agree or
//     disagree with. SHARED RULE with i03 for no-capture-concept
//     instruments: never imply a capture verdict the page's physics
//     doesn't compute.
//   - presets: four site-voice appliance scenarios.
//   - verdict: SKIPPED, per the plan's explicit list — heat release rate
//     is an input to hood/CFM sizing (see i02), not itself a graded
//     compliance quantity.
//   - drag: not assigned by the plan (segmented control only).

import { createInstrument } from '../viz.mjs';
import { SOURCES, SOURCE_IDS } from '../physics/heat.mjs';
import { centerlineVelocity, captureDiameter } from '../physics/plume.mjs';

const NOMINAL_WIDTH_IN = 4000; // deliberately oversized: see header note (no capture concept here)
const NOMINAL_DEPTH_IN = 4000;

const REF_HEIGHT_IN = 30; // the papers' reference mounting height (RB-003 Table 3.1b row, rb-003:281)
const DISPLAY_RISE_IN = 48; // envelope drawn to the top of the paper's standard-height grid

/** Short segmented labels for the RB-001 rows, in SOURCE_IDS order. */
const SHORT_LABEL = {
  gasSmall: 'GAS 25K', gasMedium: 'GAS 40K', gasLarge: 'GAS 60K', gasHigh: 'GAS 80K',
  charcoalKettle: 'CHARCOAL 15K', woodFired: 'WOOD 40K', pelletLow: 'PELLET 8K', pelletHigh: 'PELLET 30K',
};
const sourceFor = (v) => SOURCES[v] || SOURCES.gasMedium;

// Local formatter (brief: extend fmt ONLY here, per the i02/i05 precedent):
// 60000 -> "60k BTU".
const fmtBtu = (btu) => `${Math.round(btu / 1000)}k BTU`;

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i09Mounted === '1') return;
  figureEl.dataset.i09Mounted = '1';

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
  const GX = 240;
  const GY = 320; // source (z=0) plane, y
  const TOP_Y = 50; // z = DISPLAY_RISE_IN
  const PX_PER_IN = (GY - TOP_Y) / DISPLAY_RISE_IN;
  const SAMPLE_STEP_IN = 2;

  let H = null;
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 480 360');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Diagram of a cooking plume\'s capture-diameter envelope for the selected RB-001 appliance, measured at the 30-inch reference height.');

    refs.appliance = H.el('rect', { class: 'ovs-i-fl', x: GX - 20, y: GY, width: 40, height: 14 });
    svg.appendChild(refs.appliance);
    refs.applianceLegs = H.el('g');
    svg.appendChild(refs.applianceLegs);

    refs.envFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.envL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envC = H.el('line', { class: 'ovs-i-plume-center', x1: GX, y1: GY, x2: GX, y2: TOP_Y });
    svg.appendChild(refs.envFill);
    svg.appendChild(refs.envL);
    svg.appendChild(refs.envR);
    svg.appendChild(refs.envC);

    // living-smoke layer mount — over the envelope (see header note).
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

    // reference-height plane (dashed) + its measuring line
    const refY = GY - REF_HEIGHT_IN * PX_PER_IN;
    svg.appendChild(H.el('line', { class: 'ovs-i-cap-plane', x1: 40, y1: refY, x2: 440, y2: refY }));
    // short label at the far left so it clears the centred measuring-line label
    svg.appendChild(H.el('text', { x: 40, y: refY - 6, text: `${REF_HEIGHT_IN}″ reference` }));

    refs.scaleNote = H.el('g');
    svg.appendChild(refs.scaleNote);
    refs.measureLine = H.el('g');
    svg.appendChild(refs.measureLine);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const src = sourceFor(state['i09-appliance']);
    const u0 = centerlineVelocity(REF_HEIGHT_IN, src);
    const dCap = captureDiameter(REF_HEIGHT_IN, src);

    setReadout('u0', u0);
    setReadout('qc', src.qcKw);
    setReadout('btu', src.btu);
    // Local formatters: Q_c wants one decimal (the engine's default rounds
    // to an integer); the rated input reads as "60k BTU".
    const qcEl = container.querySelector('output[aria-labelledby="qc-label"]');
    if (qcEl) qcEl.textContent = `${src.qcKw.toFixed(1)} kW`;
    const btuEl = container.querySelector('output[aria-labelledby="btu-label"]');
    if (btuEl) btuEl.textContent = fmtBtu(src.btu);

    ctx.physics = { src, u0, dCap };

    // --- appliance glyph, sized to the RB-002 A.4 cooking width (illustrative) --
    const halfW = (src.cookWIn / 2) * PX_PER_IN * 0.5; // 0.5: glyph reads as a footprint, not the plume envelope
    refs.appliance.setAttribute('x', (GX - halfW).toFixed(1));
    refs.appliance.setAttribute('width', (halfW * 2).toFixed(1));
    replaceChildren(refs.applianceLegs,
      H.el('line', { class: 'ovs-i-fl-thin', x1: GX - halfW + 4, y1: GY + 14, x2: GX - halfW + 4, y2: GY + 26 }),
      H.el('line', { class: 'ovs-i-fl-thin', x1: GX + halfW - 4, y1: GY + 14, x2: GX + halfW - 4, y2: GY + 26 }));

    // --- envelope: RB-002 capture diameter for THIS source -------------
    const samples = [];
    for (let z = 0; z <= DISPLAY_RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== DISPLAY_RISE_IN) samples.push(DISPLAY_RISE_IN);

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

    replaceChildren(refs.scaleNote, H.noteBox(20, 20, `${SHORT_LABEL[src.id] || src.id} · Q_c ${src.qcKw.toFixed(1)} kW · z_0 ${src.z0M.toFixed(2)} m`));
    const my = yAt(REF_HEIGHT_IN);
    replaceChildren(refs.measureLine, H.dimensionLine(
      GX - halfWAt(REF_HEIGHT_IN), my, GX + halfWAt(REF_HEIGHT_IN), my,
      `${Math.round(u0)} fpm · d_capture ${Math.round(dCap)}″ at ${REF_HEIGHT_IN}″`,
    ));
  }

  const spec = {
    id: 'i09',
    title: 'Heat Release Rate',
    controls: [
      {
        id: 'i09-appliance', type: 'segmented', label: 'APPLIANCE (RB-001 TABLE 3.1)', value: 'gasMedium',
        options: SOURCE_IDS.map((id) => ({ value: id, label: SHORT_LABEL[id] || id })),
      },
    ],
    readouts: [
      { id: 'u0', label: `u_0 AT ${REF_HEIGHT_IN}″`, format: 'fpm', hero: true },
      { id: 'qc', label: 'CONVECTIVE HEAT Q_c' },
      { id: 'btu', label: 'RATED INPUT' },
    ],
    scene: buildScene,
    update,

    // --- living smoke: the selected source's own plume (see header note
    //     re: nominal aperture). ------------------------------------------
    smoke: (state) => ({
      sourceX: GX, sourceY: GY, pxPerIn: PX_PER_IN,
      widthIn: NOMINAL_WIDTH_IN, depthIn: NOMINAL_DEPTH_IN, mount: 'island',
      riseIn: DISPLAY_RISE_IN,
      windMph: 0, windDir: 'side', panels: 'none',
      src: sourceFor(state['i09-appliance']),
    }),

    // --- story presets: four site-voice appliance scenarios. ---------------
    presets: [
      { id: 'weekend-charcoal', label: 'Weekend charcoal kettle', state: { 'i09-appliance': 'charcoalKettle' } },
      { id: 'reference-40k-gas', label: 'Reference 40k gas grill', state: { 'i09-appliance': 'gasMedium' } },
      { id: 'flagship-60k-gas', label: 'RB-008 60k gas grill', state: { 'i09-appliance': 'gasLarge' } },
      { id: 'pro-80k-gas', label: 'Pro 80k gas grill', state: { 'i09-appliance': 'gasHigh' } },
    ],

    // No spec.verdict — see the header comment.
  };

  createInstrument(container, spec);
}
