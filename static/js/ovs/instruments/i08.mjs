// i08.mjs — Indoor vs. Outdoor Comparison (Task 16).
//
// Same module contract as i01.mjs (single `mount(figureEl)` export,
// re-mount guarded). No mount/width control on this instrument (the
// comparison is environment vs. wind, not hood geometry), so — per the
// T15-approved convention — it does not read `data-preset`; hood geometry
// is held fixed (48in island) so the only things that vary are the two
// controls.
//
// Physics only from ../physics/capture.mjs (captureFraction) — outdoor
// uses the control's wind speed as-is; indoor is captureFraction with
// windMph forced to 0, per the brief's stated simplification (indoor's
// near-zero ambient velocity at the cooking station, RB-004 finding #4).
// That simplification is stated again in the instrument's own caption in
// the content page, not just here.
//
// The engine (../viz.mjs) has no built-in "disabled control" mechanism, so
// the WIND control is disabled indoors by reaching into the DOM after
// mount: the underlying <input> gets the real `disabled` attribute (so it
// truly cannot be interacted with, not just styled), its wrapper gets
// `.ovs-i-control--disabled` (dims it) and `aria-disabled="true"`, and its
// value is snapped to 0 via the engine's own `set()` so the slider and the
// physics never disagree. The pre-indoor wind value is remembered and
// restored when the user returns to OUTDOOR.
//
// v2.1 (F2) adoption:
//   - smoke: OUTDOOR ONLY, per the plan. spec.smoke is a pure function of
//     state and never calls inst.set() or touches lastEnv, so it cannot
//     interact with the delicate env-switch reentrancy guard in update()
//     above (documented there) — it is fully orthogonal to it. To hide
//     the smoke indoors WITHOUT an engine hook for "pause this field"
//     (the engine only exposes create/update/frame internally; there is
//     no per-instrument pause() reachable from spec.smoke), this collapses
//     the geom to a degenerate, physically-inert state when indoor:
//     riseIn: 0 and w0: 1 (a tiny NONZERO velocity scale — w0: 0 would
//     make centerlineVelocity()===0 everywhere, and riseK() in smoke.mjs
//     divides by centerlineVelocity(...), so an exact 0 produces a 0/0
//     NaN that corrupts every live particle's z permanently; w0: 1 keeps
//     that denominator finite while still making the rise speed ~0). With
//     riseIn: 0, every spawned particle's retirement test
//     (z >= riseIn*1.02 === 0) is already true at spawn (z starts > 0),
//     so it is recycled the same frame it is created — no particles ever
//     draw indoors, verified in the F2 puppeteer sweep (0 `.ovs-i-smoke`
//     nodes indoors, particles resume immediately on returning outdoor).
//   - presets: four site-voice scenarios (three outdoor wind levels, one
//     indoor) — the indoor preset sets `i08-wind: 0` explicitly so it
//     matches what the environment switch would force anyway, rather than
//     relying on that side effect.
//   - verdict: capture thresholds, same rubric as i01. Applies in BOTH
//     environments — indoor's capture number is exactly as honestly
//     computed (captureFraction at windMph=0) as outdoor's, so grading it
//     is not a stretch; it typically lands PASS indoors, which is itself
//     an informative confirmation of the instrument's point.
//   - drag: not assigned by the plan (no hood/width control here).

import { createInstrument, gradeCapture } from '../viz.mjs';
import { captureFraction } from '../physics/capture.mjs';
import { plumeRadius } from '../physics/plume.mjs';
import { deflection } from '../physics/wind.mjs';
import { WIND_COUPLING } from '../physics/capture.mjs';
import { MOUNT } from '../hood-presets.mjs';

const RISE_IN = 30;
const SAMPLE_STEP_IN = 2;
const WIDTH_IN = 48; // fixed geometry — no width/mount control on this instrument
const MOUNT_VAL = 'island';
const DEPTH_IN = MOUNT[MOUNT_VAL].depthIn;

const ASSUMPTIONS = {
  indoor: [
    'No ambient wind at the cooking station — indoor air velocity is treated as zero.',
    'Thermal stratification: the plume rises into a stable ceiling layer that a hood can rely on to hold escaped gas near the capture zone.',
    'Makeup air is conditioned and delivered on purpose, so it assists rather than disrupts capture.',
  ],
  outdoor: [
    'Wind is the dominant variable — even light breezes deflect the plume measurably (see effective-wind readout).',
    'No enclosure: there is no ceiling or wall to catch and return gas that slips past the hood face.',
    'Radiative and convective losses to the open sky mean the plume itself is less coherent than the equivalent indoor case.',
  ],
};

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i08Mounted === '1') return;
  figureEl.dataset.i08Mounted = '1';

  const keep = new Set(['NOSCRIPT', 'FIGCAPTION']);
  for (const node of Array.from(figureEl.childNodes)) {
    if (node.nodeType === 1 && keep.has(node.tagName)) continue;
    figureEl.removeChild(node);
  }
  const container = document.createElement('div');
  container.className = 'ovs-instrument-mount';
  const figcaption = figureEl.querySelector('figcaption');
  figureEl.insertBefore(container, figcaption || null);

  // --- scene geometry (px) ---------------------------------------------
  const GX = 360; // plume/hood centerline, mid-canvas
  const GY = 296;
  const HY = 96;
  const pxPerIn = (GY - HY) / RISE_IN;

  let H = null;
  const refs = {};
  let inst = null;
  let lastEnv = null;
  let savedWind = null; // outdoor wind value remembered across an indoor visit

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 340');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Split diagram: an enclosed indoor room on the left versus the open outdoor sky on the right, with a shared cooking plume and hood in the center.');

    // --- left: indoor room outline (walls + ceiling) --------------------
    refs.room = H.el('g');
    refs.room.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 40, y1: 40, x2: 40, y2: 318 }));
    refs.room.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 40, y1: 40, x2: 150, y2: 40 }));
    for (let y = 50; y <= 300; y += 26) {
      refs.room.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 40, y1: y, x2: 50, y2: y + 8 }));
    }
    for (let x = 50; x <= 140; x += 22) {
      refs.room.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: 40, x2: x + 6, y2: 50 }));
    }
    refs.room.appendChild(H.el('text', { x: 44, y: 60, text: 'INDOOR' }));
    svg.appendChild(refs.room);

    // --- right: open outdoor sky (no boundary, radiating dashes) --------
    refs.sky = H.el('g');
    for (const [x1, y1, x2, y2] of [[600, 40, 680, 20], [630, 44, 700, 44], [610, 60, 690, 70]]) {
      refs.sky.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1, y1, x2, y2, style: 'stroke-dasharray:2 4' }));
    }
    refs.sky.appendChild(H.el('text', { x: 630, y: 60, text: 'OUTDOOR' }));
    svg.appendChild(refs.sky);

    svg.appendChild(H.el('line', {
      class: 'ovs-i-fl-thin', x1: 360, y1: 30, x2: 360, y2: 330, style: 'stroke-dasharray:2 4', opacity: 0.4,
    }));

    // ground
    const ground = H.el('g');
    ground.appendChild(H.el('line', { class: 'ovs-i-fl', x1: 30, y1: 318, x2: 690, y2: 318 }));
    svg.appendChild(ground);

    // grill + hood + plume, shared between both scenarios
    const grill = H.el('g');
    grill.appendChild(H.el('line', { class: 'ovs-i-fl', x1: GX - 45, y1: GY, x2: GX + 45, y2: GY }));
    grill.appendChild(H.el('rect', { class: 'ovs-i-fl', x: GX - 45, y: GY, width: 90, height: 14 }));
    svg.appendChild(grill);

    refs.plumeFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    refs.plumeL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    refs.plumeR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(refs.plumeFill);
    svg.appendChild(refs.plumeL);
    svg.appendChild(refs.plumeR);

    // living-smoke layer mount — outdoor only, see header note.
    refs.smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(refs.smokeMount);

    refs.wisp1 = H.el('path', { class: 'ovs-i-wisp', d: '', opacity: 0 });
    svg.appendChild(refs.wisp1);

    const hoodHalfPx = (WIDTH_IN / 2) * pxPerIn;
    refs.hood = H.el('path', {
      class: 'ovs-i-hoodfill',
      d: `M${GX - hoodHalfPx} ${HY} L${GX + hoodHalfPx} ${HY} L${GX + 20} 66 L${GX - 20} 66 Z`,
    });
    svg.appendChild(refs.hood);

    // wind glyph (visible / meaningful only outdoors)
    refs.windGroup = H.el('g');
    refs.windGroup.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: 460, y1: 118, x2: 500, y2: 118 }));
    refs.windShaft = H.el('line', { class: 'ovs-i-fl-thin', x1: 460, y1: 136, x2: 500, y2: 136 });
    refs.windArrow = H.el('path', { class: 'ovs-i-fl-thin', d: 'M500 136 l-7 -4 m7 4 l-7 4' });
    refs.windGroup.appendChild(refs.windShaft);
    refs.windGroup.appendChild(refs.windArrow);
    refs.windLabel = H.el('text', { x: 460, y: 106, text: '' });
    refs.windGroup.appendChild(refs.windLabel);
    svg.appendChild(refs.windGroup);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const env = state['i08-environment'];

    // --- one-time wind snap/restore on an environment switch. lastEnv is
    // assigned BEFORE inst.set(): under prefers-reduced-motion the
    // engine's startTween re-enters update() synchronously, so a stale
    // lastEnv here would recurse forever ("Maximum call stack size
    // exceeded"). With lastEnv already committed, the reentrant call sees
    // env === lastEnv and falls straight through to the normal paint.
    //
    // After inst.set() the outer frame RETURNS EARLY: its `state` argument
    // was snapshotted before the set, so letting it finish would overwrite
    // the reentrant paint with stale values (e.g. outdoor restore painting
    // capture/label from wind = 0 while the slider shows the restored
    // value). The engine guarantees a fresh paint for every range set() —
    // synchronously under reduced motion or when the value is already at
    // target, otherwise on the tween's first rAF tick — so nothing is
    // lost by bailing out here. The early return only happens when set()
    // was actually called: the initial mount paint also lands in this
    // block (lastEnv === null) and must fall through to paint normally. ---
    if (env !== lastEnv) {
      const prevEnv = lastEnv;
      lastEnv = env;
      if (inst && env === 'indoor') {
        // Remember the outdoor wind setting so returning to OUTDOOR
        // restores it instead of leaving the slider parked at 0.
        savedWind = inst.get()['i08-wind'];
        inst.set('i08-wind', 0);
        return;
      }
      if (inst && env === 'outdoor' && prevEnv === 'indoor' && savedWind != null) {
        inst.set('i08-wind', savedWind);
        return;
      }
    }

    if (!refs.windCtl) {
      const windInput = container.querySelector('#i08-wind');
      refs.windCtl = windInput ? windInput.closest('.ovs-i-control') : null;
      refs.windInput = windInput;
    }
    if (refs.windCtl) {
      refs.windCtl.classList.toggle('ovs-i-control--disabled', env === 'indoor');
      refs.windCtl.setAttribute('aria-disabled', env === 'indoor' ? 'true' : 'false');
    }
    if (refs.windInput) refs.windInput.disabled = env === 'indoor';

    const windMph = env === 'indoor' ? 0 : state['i08-wind'];
    const capFrac = captureFraction({
      widthIn: WIDTH_IN, depthIn: DEPTH_IN, mount: MOUNT_VAL, riseIn: RISE_IN, windMph, panels: 'none',
    });
    setReadout('capture', capFrac);
    setReadout('assumptionCount', ASSUMPTIONS[env].length);

    // expose physics to the engine's verdict stamp (spec.verdict)
    ctx.physics = { capFrac, env };

    // --- highlight the active side --------------------------------------
    refs.room.setAttribute('opacity', env === 'indoor' ? 1 : 0.18);
    refs.sky.setAttribute('opacity', env === 'outdoor' ? 1 : 0.18);
    refs.windGroup.setAttribute('opacity', env === 'outdoor' ? 1 : 0.15);

    // --- shared plume, bends only when outdoor + wind ------------------
    const plumeWind = WIND_COUPLING * windMph;
    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const centerXAt = (zIn) => GX + deflection(zIn, plumeWind) * pxPerIn;
    const yAt = (zIn) => GY - zIn * pxPerIn;
    const halfWAt = (zIn) => plumeRadius(zIn) * pxPerIn;

    let dl = '', dr = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const cx = centerXAt(z), hw = halfWAt(z), y = yAt(z);
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

    const showWisp = capFrac < 0.97;
    refs.wisp1.setAttribute('opacity', showWisp ? Math.min(0.75, (1 - capFrac) * 2) : 0);
    if (showWisp) {
      const hoodHalfPx = (WIDTH_IN / 2) * pxPerIn;
      const sx = GX + hoodHalfPx;
      refs.wisp1.setAttribute('d', `M${sx} ${HY} C${sx + 18} ${HY - 24} ${sx + 34} ${HY - 30} ${sx + 46} ${HY - 50}`);
    }

    refs.windLabel.textContent = env === 'outdoor' ? `U = ${Math.round(windMph)} mph` : 'U = 0 (indoor)';
    const shaftX = 460 + windMph * 2;
    refs.windShaft.setAttribute('x2', shaftX.toFixed(1));
    refs.windArrow.setAttribute('d', `M${shaftX.toFixed(1)} 136 l-7 -4 m7 4 l-7 4`);

    // --- assumptions list, swapped per environment ----------------------
    if (!refs.assumptionsWrap) {
      const article = container.querySelector('.ovs-i-instrument');
      refs.assumptionsWrap = document.createElement('div');
      refs.assumptionsWrap.className = 'ovs-i-assumptions';
      // h3, not h4: the instrument title is an h2 (viz.mjs, T19 D.9), so
      // an h4 here would skip a level. Styled via the class, not the tag.
      const heading = document.createElement('h3');
      heading.className = 'ovs-i-assumptions-head';
      heading.textContent = 'ASSUMPTIONS IN THIS VIEW';
      refs.assumptionsList = document.createElement('ul');
      refs.assumptionsWrap.appendChild(heading);
      refs.assumptionsWrap.appendChild(refs.assumptionsList);
      if (article) article.appendChild(refs.assumptionsWrap);
    }
    if (refs.assumptionsList) {
      refs.assumptionsList.textContent = '';
      for (const text of ASSUMPTIONS[env]) {
        const li = document.createElement('li');
        li.textContent = text;
        refs.assumptionsList.appendChild(li);
      }
    }
  }

  const spec = {
    id: 'i08',
    title: 'Indoor vs. Outdoor',
    controls: [
      {
        id: 'i08-environment', type: 'segmented', label: 'ENVIRONMENT', value: 'outdoor',
        options: [{ value: 'indoor', label: 'INDOOR' }, { value: 'outdoor', label: 'OUTDOOR' }],
      },
      { id: 'i08-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 12, step: 1, value: 5, unit: 'mph' },
    ],
    readouts: [
      { id: 'capture', label: 'CAPTURE', format: 'pct', hero: true },
      { id: 'assumptionCount', label: 'ASSUMPTIONS IN PLAY' },
    ],
    scene: buildScene,
    update,

    // --- living smoke: outdoor-only (see header note for the riseIn:0/
    //     w0:1 indoor-collapse mechanism). -----------------------------------
    smoke: (state) => {
      const outdoor = state['i08-environment'] === 'outdoor';
      return {
        sourceX: GX, sourceY: GY, pxPerIn,
        widthIn: WIDTH_IN, depthIn: DEPTH_IN, mount: MOUNT_VAL,
        riseIn: outdoor ? RISE_IN : 0,
        windMph: outdoor ? state['i08-wind'] : 0,
        panels: 'none',
        w0: outdoor ? 400 : 1,
      };
    },

    // --- story presets: three outdoor wind levels + one indoor. ------------
    presets: [
      { id: 'calm-outdoor-evening', label: 'Calm outdoor evening', state: { 'i08-environment': 'outdoor', 'i08-wind': 0 } },
      { id: 'breezy-outdoor-patio', label: 'Breezy outdoor patio', state: { 'i08-environment': 'outdoor', 'i08-wind': 8 } },
      { id: 'windy-outdoor-exposure', label: 'Windy outdoor exposure', state: { 'i08-environment': 'outdoor', 'i08-wind': 12 } },
      { id: 'indoor-kitchen', label: 'Indoor kitchen', state: { 'i08-environment': 'indoor', 'i08-wind': 0 } },
    ],

    // --- verdict stamp: capture-fraction thresholds, same rubric as i01,
    //     honest in both environments (see header note). --------------------
    verdict: (state, physics) => {
      const cap = physics ? physics.capFrac : 0;
      const grade = gradeCapture(cap);
      return {
        grade,
        clauseRef: 'per OVS-H1 §2.4 / RB-004',
        detail: `Plume capture ${Math.round(cap * 100)}% (${physics ? physics.env : 'outdoor'}) — thresholds 85% PASS / 60% MARGINAL.`,
      };
    },
  };

  inst = createInstrument(container, spec);
}
