// i10.mjs — Failure Modes + Grease Deposition (Task 16).
//
// Shared by two content pages (failure-mode-taxonomy.md and
// grease-aerosol-deposition.md), both of which carry `instrument_id: "i10"`
// — this is the one module in the suite mounted from two different pages.
// Same module contract as i01.mjs otherwise (single `mount(figureEl)`
// export, re-mount guarded). No mount/width control, so it does not read
// `data-preset`.
//
// The instrument is one spec with a VIEW segmented control switching
// between two sub-views:
//   - "Failure modes": an interactive taxonomy tree (HTML <details>/
//     <summary>, NOT SVG, per the brief) built from RB-007's six failure
//     modes (content/research/rb-007-failure-modes.md §3.1-3.9) — the
//     exact names, root mechanisms, symptoms and correctable/design-locked
//     classification are taken from that paper.
//   - "Grease deposition": an SVG heat-strip of `depositionProfile(30)`
//     (../physics/grease.mjs) — 8 zones colored by intensity, with a
//     height-selectable tracer.
// The default tab is chosen from the mounting page's URL: the grease page
// defaults to the deposition tab, every other page (i.e. the
// failure-mode-taxonomy page) defaults to the taxonomy tab.
//
// Physics only from ../physics/grease.mjs (depositionProfile) — reused
// twice: once for the fixed 8-zone strip, once (with steps=2) to read the
// intensity at the continuously-selectable HEIGHT control, since
// depositionProfile always normalizes by its z=0 sample, which is a
// constant 1 regardless of riseIn/steps (z=0 <= centerlineVelocity's z0,
// so centerlineVelocity(0..z0) === w0 always) — so this is not a new
// formula, just the same exported function called at a different height.
//
// v2.1 (F2) adoption:
//   - presets: four site-voice scenarios covering both VIEW tabs (one
//     taxonomy, three deposition heights). Per the plan, this is the ONLY
//     v2.1 feature this instrument adopts.
//   - verdict: SKIPPED, per the plan's explicit list. The taxonomy tab is
//     a reference tree, not a measurement; the deposition tab's intensity
//     is a relative (0-1) profile shape with no pass/fail threshold of
//     its own — RB-007's classification (design-locked / correctable) is
//     already presented per failure mode via its own tag, which is a
//     better-fit affordance than a single scene-wide stamp.
//   - drag/smoke: not assigned by the plan.

import { createInstrument } from '../viz.mjs';
import { depositionProfile } from '../physics/grease.mjs';

const STRIP_RISE_IN = 30;
const STRIP_ZONES = 8;

// RB-007 §3.1-3.9 — six failure modes, root mechanism / symptom / action
// condensed from the paper's own prose (§3.2-3.7) and classified per
// Table 3.9 (Design-Locked: FM-1; Partially correctable: FM-2, FM-5;
// Fully correctable: FM-3, FM-4, FM-6).
const FAILURE_MODES = [
  {
    id: 'FM-1', name: 'Inadequate Overhang', classification: 'fail', tag: 'DESIGN-LOCKED',
    mechanism: 'The hood’s footprint at the plume interception plane is smaller than the plume’s expanded cross-section there — the plume extends past the hood on one or more sides.',
    symptom: 'Continuous, symmetric smoke escape from all sides, even in still air; more blower speed barely helps because the plume is beyond the hood’s physical reach.',
    action: 'Design-locked — requires a wider/deeper hood. A 3-4in perimeter lip or side panels give partial relief but do not resolve the underlying geometric deficiency.',
  },
  {
    id: 'FM-2', name: 'Excessive Mounting Height', classification: 'warn', tag: 'PARTIALLY CORRECTABLE',
    mechanism: 'Every plume parameter degrades with height at once: the plume grows wider, mass flow rises as z^(5/3), velocity falls, and wind vulnerability increases.',
    symptom: 'Diffuse, general escape around the whole perimeter; the plume looks wide and weak at hood height. Temporarily lowering the grill produces an immediate, visible improvement.',
    action: 'Lower the hood or raise the cooking surface if the mounting allows it. If the mounting position is fixed, it is design-locked — compensate with more CFM or wind shielding.',
  },
  {
    id: 'FM-3', name: 'Insufficient Exhaust Rate', classification: 'ok', tag: 'FULLY CORRECTABLE',
    mechanism: 'Installed CFM is below the plume’s mass flow plus the required infiltration margin (CFM_required = CFM_plume × K_CFM).',
    symptom: 'Escape concentrated at the hood edges (the center captures cleanly); worsens as grease filters load, and improves immediately when blower speed is increased.',
    action: 'Clean or replace filters, upgrade the blower, reduce duct restriction (fewer elbows, shorter run), or run on the highest available speed.',
  },
  {
    id: 'FM-4', name: 'Wind-Deflected Plume Escape', classification: 'ok', tag: 'FULLY CORRECTABLE',
    mechanism: 'Ambient wind displaces the plume centerline downwind beyond the available overhang on that side.',
    symptom: 'Directional escape from the downwind side only, intermittent and correlated with wind gusts, rotating with wind direction.',
    action: 'Add side panels (the single most effective intervention) or a rear panel, increase CFM, reorient the grill so its long axis faces the prevailing wind, or reduce mounting height.',
  },
  {
    id: 'FM-5', name: 'Geometry-Induced Spillage', classification: 'warn', tag: 'PARTIALLY CORRECTABLE',
    mechanism: 'The hood’s external dimensions are adequate, but a non-uniform internal velocity distribution leaves the perimeter under-suctioned — the Effective Capture Area is well below the total face area.',
    symptom: 'Escape from the hood corners and mid-edges in still air, while the center directly above the grill captures cleanly and the pattern stays symmetric (not directional).',
    action: 'Install full-face grease filters/baffles, add a perimeter lip, or increase CFM. Canopy shape and exhaust-collar position are design-locked without replacing the hood.',
  },
  {
    id: 'FM-6', name: 'Momentum-Limited Capture', classification: 'ok', tag: 'FULLY CORRECTABLE',
    mechanism: 'The hood’s exhaust-induced edge velocity is too low to overcome the plume’s own outward expansion (or a light crossflow), even when total CFM matches the plume’s mass flow.',
    symptom: 'Slow, diffuse "seeping" escape at the edges rather than a coherent escaping stream — most common with charcoal or low-output pellet-smoker sources.',
    action: 'Increase CFM (the most effective single lever), add a perimeter lip, reduce mounting height, or add side panels for wind-exacerbated cases.',
  },
];

function buildTaxonomyHtml() {
  const wrap = document.createElement('div');
  wrap.className = 'ovs-i-taxonomy';
  for (const fm of FAILURE_MODES) {
    const details = document.createElement('details');
    details.className = 'ovs-i-fm-branch';

    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.textContent = `${fm.id} — ${fm.name}`;
    const tag = document.createElement('span');
    tag.className = `ovs-i-fm-tag ovs-i-fm-tag--${fm.classification}`;
    tag.textContent = fm.tag;
    summary.appendChild(title);
    summary.appendChild(tag);
    details.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'ovs-i-fm-body';
    for (const [label, text] of [['Root mechanism', fm.mechanism], ['Symptom', fm.symptom], ['Corrective action', fm.action]]) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(text));
      body.appendChild(p);
    }
    details.appendChild(body);
    wrap.appendChild(details);
  }
  return wrap;
}

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i10Mounted === '1') return;
  figureEl.dataset.i10Mounted = '1';

  const path = (typeof window !== 'undefined' && window.location) ? window.location.pathname : '';
  const defaultView = /grease/i.test(path) ? 'deposition' : 'taxonomy';

  const keep = new Set(['NOSCRIPT', 'FIGCAPTION']);
  for (const node of Array.from(figureEl.childNodes)) {
    if (node.nodeType === 1 && keep.has(node.tagName)) continue;
    figureEl.removeChild(node);
  }
  const container = document.createElement('div');
  container.className = 'ovs-instrument-mount';
  const figcaption = figureEl.querySelector('figcaption');
  figureEl.insertBefore(container, figcaption || null);

  // --- heat-strip geometry (px) -----------------------------------------
  const GY = 320; // z = 0 (grill)
  const TOP_Y = 60; // z = STRIP_RISE_IN
  const PX_PER_IN = (GY - TOP_Y) / STRIP_RISE_IN;
  const STRIP_X = 200, STRIP_W = 90;

  let H = null;
  const refs = { zones: [] };

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 480 360');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Vertical heat-strip showing grease deposition intensity by height above the grill, brightest near the source and fading with height.');

    const zoneH = (GY - TOP_Y) / STRIP_ZONES;
    for (let i = 0; i < STRIP_ZONES; i++) {
      const y = GY - (i + 1) * zoneH;
      const rect = H.el('rect', {
        x: STRIP_X, y: y.toFixed(1), width: STRIP_W, height: zoneH.toFixed(1),
        style: 'fill:var(--accent);stroke:var(--surface);stroke-width:1',
      });
      const label = H.el('text', { x: STRIP_X + STRIP_W + 10, y: (y + zoneH / 2 + 3.5).toFixed(1), text: '' });
      svg.appendChild(rect);
      svg.appendChild(label);
      refs.zones.push({ rect, label });
    }
    svg.appendChild(H.el('text', { x: STRIP_X, y: GY + 18, text: '0″ (grill)' }));
    svg.appendChild(H.el('text', { x: STRIP_X, y: TOP_Y - 8, text: `${STRIP_RISE_IN}″` }));

    refs.tracerLine = H.el('line', {
      class: 'ovs-i-cap-plane', x1: STRIP_X - 14, y1: GY, x2: STRIP_X, y2: GY,
    });
    refs.tracerLabel = H.el('text', { x: STRIP_X - 18, y: GY, 'text-anchor': 'end', text: '' });
    svg.appendChild(refs.tracerLine);
    svg.appendChild(refs.tracerLabel);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const view = state['i10-view'];
    const heightIn = state['i10-height'];

    ctx.svg.style.display = view === 'deposition' ? '' : 'none';
    if (refs.taxonomyWrap) refs.taxonomyWrap.style.display = view === 'taxonomy' ? '' : 'none';

    if (!refs.heightWrap) {
      const input = container.querySelector('#i10-height');
      refs.heightWrap = input ? input.closest('.ovs-i-control') : null;
    }
    if (refs.heightWrap) refs.heightWrap.style.display = view === 'deposition' ? '' : 'none';

    if (!refs.readoutsWrap) refs.readoutsWrap = container.querySelector('.ovs-i-readouts');
    if (refs.readoutsWrap) refs.readoutsWrap.style.display = view === 'deposition' ? '' : 'none';

    // --- deposition zones (physics: depositionProfile only) ------------
    const zones = depositionProfile(STRIP_RISE_IN, STRIP_ZONES);
    for (let i = 0; i < zones.length; i++) {
      // zones[0] is z=0 (grill) and refs.zones[0] is the bottommost band
      // (built at y = GY - zoneH, i.e. nearest the grill) — indices line
      // up directly, no reversal.
      const z = zones[i];
      const ref = refs.zones[i];
      ref.rect.style.opacity = (0.15 + z.intensity * 0.85).toFixed(2);
      ref.label.textContent = `${Math.round(z.zIn)}″ — ${Math.round(z.intensity * 100)}%`;
    }

    const atHeight = depositionProfile(Math.max(heightIn, 0), 2)[1];
    setReadout('intensity', atHeight.intensity);

    const ty = GY - Math.min(heightIn, STRIP_RISE_IN) * PX_PER_IN;
    refs.tracerLine.setAttribute('y1', ty.toFixed(1));
    refs.tracerLine.setAttribute('y2', ty.toFixed(1));
    refs.tracerLabel.setAttribute('y', (ty + 3.5).toFixed(1));
    refs.tracerLabel.textContent = `${Math.round(heightIn)}″`;
  }

  const spec = {
    id: 'i10',
    title: 'Failure Modes & Grease Deposition',
    controls: [
      {
        id: 'i10-view', type: 'segmented', label: 'VIEW', value: defaultView,
        options: [{ value: 'taxonomy', label: 'FAILURE MODES' }, { value: 'deposition', label: 'GREASE DEPOSITION' }],
      },
      { id: 'i10-height', type: 'range', label: 'HEIGHT ABOVE GRILL', min: 0, max: 30, step: 1, value: 15, unit: 'in' },
    ],
    readouts: [
      { id: 'intensity', label: 'DEPOSITION INTENSITY AT HEIGHT', format: 'pct', hero: true },
    ],
    scene: buildScene,
    update,

    // --- story presets: one taxonomy scenario + three deposition heights.
    //     No spec.verdict — see the header comment. ------------------------
    presets: [
      { id: 'browse-the-failure-modes', label: 'Browse the failure modes', state: { 'i10-view': 'taxonomy', 'i10-height': 15 } },
      { id: 'deposition-at-the-grate', label: 'Deposition at the grate', state: { 'i10-view': 'deposition', 'i10-height': 2 } },
      { id: 'deposition-mid-hood', label: 'Deposition mid-hood', state: { 'i10-view': 'deposition', 'i10-height': 15 } },
      { id: 'deposition-near-the-hood', label: 'Deposition near the hood', state: { 'i10-view': 'deposition', 'i10-height': 28 } },
    ],
  };

  createInstrument(container, spec);

  // Taxonomy tree lives beside the SVG, not inside it (HTML, per the
  // brief) — inserted once, then shown/hidden by update() above.
  const sceneWrap = container.querySelector('.ovs-i-scene');
  refs.taxonomyWrap = buildTaxonomyHtml();
  refs.taxonomyWrap.style.display = defaultView === 'taxonomy' ? '' : 'none';
  if (sceneWrap) sceneWrap.appendChild(refs.taxonomyWrap);
  else container.appendChild(refs.taxonomyWrap);
}
