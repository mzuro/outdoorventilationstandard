// i09.mjs — Heat Release Rate Comparison (Task 16).
//
// Same module contract as i01.mjs (single `mount(figureEl)` export,
// re-mount guarded). No mount/width control on this instrument (it
// isolates appliance heat output from hood geometry), so — per the
// T15-approved convention — it does not read `data-preset`.
//
// Physics only from ../physics/{heat,plume}.mjs: `plumeStrength(btu)`
// (../physics/heat.mjs) supplies w0, the plume's rise velocity at the
// source, calibrated so a 60,000 BTU appliance (the program's baseline
// "medium gas grill") yields exactly w0 = 400 fpm — the same 400 fpm
// default baked into ../physics/plume.mjs's `centerlineVelocity`. Every
// other appliance's plume envelope is drawn by taking `plumeRadius` (pure
// geometry, no heat input) and visually scaling it by w0/400, per the
// brief — this is a deliberate visualization device, not a new physics
// formula: nothing here recomputes what plumeStrength/plumeRadius already
// compute.
//
// v2.1 (F2) adoption:
//   - smoke: strength-scaled, per the plan. Rides the REAL w0 for the
//     selected appliance (rise speed) and the real displayRiseIn, so the
//     smoke's recycle plane matches the drawn envelope's top exactly.
//     There is no hood/capture concept in this instrument at all — it
//     isolates appliance heat output from hood geometry — so the smoke is
//     given a deliberately oversized nominal aperture (NOMINAL_WIDTH_IN/
//     NOMINAL_DEPTH_IN below) so every particle always registers as
//     "captured" and none render ember-orange: there is no readout here
//     an escape tint could agree or disagree with, so showing one would
//     fabricate a capture story this instrument doesn't tell. One known,
//     cosmetic-only divergence: the drawn envelope's WIDTH is deliberately
//     exaggerated by strengthScale beyond plumeRadius() (the visualization
//     device described above), but smoke.mjs has no equivalent knob — the
//     live smoke's lateral spread follows the real (unscaled)
//     plumeRadius(z) at the real riseIn, so at the extremes (15k vs 120k
//     BTU) the smoke will look narrower/wider than the exaggerated
//     envelope outline it rides inside. That is a divergence between two
//     decorative layers, not a physics disagreement — neither layer has a
//     width/capture readout to contradict.
//   - presets: four site-voice appliance scenarios.
//   - verdict: SKIPPED, per the plan's explicit list — heat release rate
//     is an input to hood/CFM sizing (see i02), not itself a graded
//     compliance quantity.
//   - drag: not assigned by the plan (segmented control only, no
//     continuous handle to grab).

import { createInstrument } from '../viz.mjs';
import { plumeStrength } from '../physics/heat.mjs';
import { plumeRadius } from '../physics/plume.mjs';

const NOMINAL_WIDTH_IN = 4000; // deliberately oversized: see header note (no capture concept here)
const NOMINAL_DEPTH_IN = 4000;

const BASELINE_W0 = 400; // calibration amendment: plumeStrength(60000) === 400
const DISPLAY_RISE_IN = 36; // envelope height at strengthScale = 1 (the baseline appliance)

const APPLIANCES = [
  { value: 'portable15', label: 'PORTABLE 15K', btu: 15000, glyphWidthIn: 16 },
  { value: 'burner3-45', label: '3-BURNER 45K', btu: 45000, glyphWidthIn: 30 },
  { value: 'burner4-60', label: '4-BURNER 60K', btu: 60000, glyphWidthIn: 40 },
  { value: 'pro90', label: 'PRO 90K', btu: 90000, glyphWidthIn: 52 },
  { value: 'proSear120', label: 'PRO+SEAR 120K', btu: 120000, glyphWidthIn: 64 },
];

// Local formatter (brief: extend fmt ONLY here, per the i02 BTU-bubble /
// i05 signed-delta precedent): 90000 -> "90k BTU".
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
  const TOP_Y = 50; // ceiling of the drawable area — the tallest scaled envelope must clear this
  const MAX_DISPLAY_IN = 48; // calibrates px-per-inch so even the largest appliance's scaled envelope stays on-canvas
  const PX_PER_IN = (GY - TOP_Y) / MAX_DISPLAY_IN;
  const SAMPLE_STEP_IN = 2;

  let H = null;
  const refs = {};

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 480 360');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Diagram of a cooking plume growing taller and wider with the selected appliance\'s heat release rate.');

    refs.appliance = H.el('rect', { class: 'ovs-i-fl', x: GX - 20, y: GY, width: 40, height: 14 });
    svg.appendChild(refs.appliance);
    refs.applianceLegs = H.el('g');
    svg.appendChild(refs.applianceLegs);

    refs.envFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.envL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.envC = H.el('line', { class: 'ovs-i-plume-center', x1: GX, y1: GY, x2: GX, y2: GY });
    svg.appendChild(refs.envFill);
    svg.appendChild(refs.envL);
    svg.appendChild(refs.envR);
    svg.appendChild(refs.envC);

    // living-smoke layer mount — over the envelope (see header note).
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

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
    const key = state['i09-appliance'];
    const appliance = APPLIANCES.find((a) => a.value === key) || APPLIANCES[2];
    const btu = appliance.btu;
    const w0 = plumeStrength(btu);
    const strengthScale = w0 / BASELINE_W0;
    const displayRiseIn = DISPLAY_RISE_IN * strengthScale;

    setReadout('w0', w0);
    setReadout('btu', btu);
    // BTU readout: engine has already written the raw rounded number via
    // setReadout above; restyle it with the local "k BTU" formatter —
    // mirrors i05's aria-labelledby override for a non-hero readout.
    const btuEl = container.querySelector('output[aria-labelledby="btu-label"]');
    if (btuEl) btuEl.textContent = fmtBtu(btu);

    // --- appliance glyph, sized per selection (illustrative only) ------
    const halfW = (appliance.glyphWidthIn / 2) * PX_PER_IN * 0.5; // 0.5: glyph reads as a footprint, not the plume envelope
    refs.appliance.setAttribute('x', (GX - halfW).toFixed(1));
    refs.appliance.setAttribute('width', (halfW * 2).toFixed(1));
    replaceChildren(refs.applianceLegs,
      H.el('line', { class: 'ovs-i-fl-thin', x1: GX - halfW + 4, y1: GY + 14, x2: GX - halfW + 4, y2: GY + 26 }),
      H.el('line', { class: 'ovs-i-fl-thin', x1: GX + halfW - 4, y1: GY + 14, x2: GX + halfW - 4, y2: GY + 26 }));

    // --- envelope: height AND width scaled by w0/400 -------------------
    const samples = [];
    for (let z = 0; z <= displayRiseIn; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== displayRiseIn) samples.push(displayRiseIn);

    const yAt = (zIn) => GY - zIn * PX_PER_IN;
    const halfWAt = (zIn) => plumeRadius(zIn) * strengthScale * PX_PER_IN;

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
    refs.envC.setAttribute('y2', yAt(displayRiseIn).toFixed(1));

    replaceChildren(refs.scaleNote, H.noteBox(20, 20, `w0/400 = ${strengthScale.toFixed(2)}×`));
    replaceChildren(refs.measureLine, H.dimensionLine(
      GX - halfWAt(displayRiseIn), yAt(displayRiseIn), GX + halfWAt(displayRiseIn), yAt(displayRiseIn),
      `${Math.round(w0)} fpm at source`,
    ));
  }

  const spec = {
    id: 'i09',
    title: 'Heat Release Rate',
    controls: [
      {
        id: 'i09-appliance', type: 'segmented', label: 'APPLIANCE', value: 'burner4-60',
        options: APPLIANCES.map((a) => ({ value: a.value, label: a.label })),
      },
    ],
    readouts: [
      { id: 'w0', label: 'PLUME RISE VELOCITY (W0)', format: 'fpm', hero: true },
      { id: 'btu', label: 'BURNER RATING' },
    ],
    scene: buildScene,
    update,

    // --- living smoke: strength-scaled per the real w0/displayRiseIn for
    //     the selected appliance (see header note re: nominal aperture). ----
    smoke: (state) => {
      const key = state['i09-appliance'];
      const appliance = APPLIANCES.find((a) => a.value === key) || APPLIANCES[2];
      const w0 = plumeStrength(appliance.btu);
      const displayRiseIn = DISPLAY_RISE_IN * (w0 / BASELINE_W0);
      return {
        sourceX: GX, sourceY: GY, pxPerIn: PX_PER_IN,
        widthIn: NOMINAL_WIDTH_IN, depthIn: NOMINAL_DEPTH_IN, mount: 'island',
        riseIn: displayRiseIn,
        windMph: 0, panels: 'none',
        w0,
      };
    },

    // --- story presets: four site-voice appliance scenarios. ---------------
    presets: [
      { id: 'weekend-portable', label: 'Weekend portable', state: { 'i09-appliance': 'portable15' } },
      { id: 'family-3-burner', label: 'Family 3-burner', state: { 'i09-appliance': 'burner3-45' } },
      { id: 'standard-4-burner', label: 'Standard 4-burner', state: { 'i09-appliance': 'burner4-60' } },
      { id: 'pro-sear-station', label: 'Pro sear station', state: { 'i09-appliance': 'proSear120' } },
    ],

    // No spec.verdict — see the header comment.
  };

  createInstrument(container, spec);
}
