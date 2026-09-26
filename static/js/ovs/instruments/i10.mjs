// i10.mjs — Failure Modes + Grease Deposition (Task 16; deposition view
// re-based on RB-011 in physics Stage B).
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
//   - "Grease deposition": RB-011 Table 3.3a as a chart — for each
//     particle size the downwind distance at which a settling droplet
//     released at H = 1.5 m reaches the ground, x_ground = H·U_w/v_s
//     (rb-011:199, rb-011:298-312), on a log axis, at the WIND SPEED
//     control. The PARTICLE SIZE control picks the row the readouts
//     report: x_ground and the Stokes settling velocity v_s
//     (rb-011:143, slip-corrected rb-011:153).
// The default tab is chosen from the mounting page's URL: the grease page
// defaults to the deposition tab, every other page (i.e. the
// failure-mode-taxonomy page) defaults to the taxonomy tab.
//
// Physics only from ../physics/grease.mjs (stokesSettling,
// groundContactDistance). The old 8-zone (v/400)² "deposition intensity"
// strip had no paper basis and is gone (plan §2).
//
// RB-011's own caveat is carried onto the chart (rb-011:314): for fine
// particles (< 2.5 µm) gravitational settling is not the governing
// removal mechanism — turbulent diffusion, washout and coagulation are —
// so their kilometre-scale x_ground rows are printed but flagged.
//
// v2.1 (F2) adoption:
//   - presets: four site-voice scenarios covering both VIEW tabs (one
//     taxonomy, three deposition). Per the plan, this is the ONLY v2.1
//     feature this instrument adopts.
//   - verdict: SKIPPED, per the plan's explicit list. The taxonomy tab is
//     a reference tree, not a measurement; a ground-contact distance has
//     no pass/fail threshold of its own — RB-007's classification
//     (design-locked / correctable) is already presented per failure mode
//     via its own tag.
//   - drag/smoke: not assigned by the plan.

import { createInstrument } from '../viz.mjs';
import { stokesSettling, groundContactDistance } from '../physics/grease.mjs';

/** RB-011 Table 3.3a particle-size rows, µm (rb-011:304-312). */
const SIZES_UM = [1, 2.5, 5, 10, 20, 50, 100];
/** Below this size settling is not the governing mechanism (rb-011:314). */
const FINE_LIMIT_UM = 2.5;
/** Log axis: 1 m .. 1,000 km. */
const AXIS_MIN_M = 1, AXIS_MAX_M = 1e6;

/** Distance formatter: "12.4 m", "1.2 km", "> 1,000 km". Pure. */
export function fmtDistance(m) {
  if (!(m > 0)) return '— (calm)';
  if (m >= AXIS_MAX_M) return '> 1,000 km';
  if (m >= 10000) return `${Math.round(m / 1000).toLocaleString('en-US')} km`;
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  if (m >= 100) return `${Math.round(m)} m`;
  return `${m.toFixed(1)} m`;
}
/** Settling-velocity formatter: "0.271 m/s", "2.8e-3 m/s". Pure. */
export function fmtSettling(v) {
  return v >= 0.01 ? `${v.toFixed(3)} m/s` : `${v.toExponential(1)} m/s`;
}

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

  // --- bar-chart geometry (viewBox px) ----------------------------------
  const X0 = 110, X1 = 450; // log axis: AXIS_MIN_M .. AXIS_MAX_M
  const ROW_TOP = 56, ROW_PITCH = 34, BAR_H = 16;
  const AXIS_Y = ROW_TOP + SIZES_UM.length * ROW_PITCH + 6;
  const xFor = (m) => {
    if (!(m > AXIS_MIN_M)) return X0;
    const t = Math.log10(Math.min(m, AXIS_MAX_M)) / Math.log10(AXIS_MAX_M);
    return X0 + t * (X1 - X0);
  };

  let H = null;
  const refs = { rows: [] };

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 480 360');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Bar chart of the downwind ground-contact distance for escaped grease droplets by particle size, on a logarithmic axis from 1 metre to 1,000 kilometres.');

    svg.appendChild(H.el('text', { x: X0, y: 24, text: 'GROUND-CONTACT DISTANCE x_ground = H·U/v_s (H = 1.5 m) — RB-011 Table 3.3a' }));

    // log-axis gridlines at each decade
    const axis = H.el('g');
    axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0, y1: AXIS_Y, x2: X1, y2: AXIS_Y }));
    for (let dec = 0; dec <= 6; dec++) {
      const m = 10 ** dec;
      const x = xFor(m);
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: ROW_TOP - 8, x2: x, y2: AXIS_Y, opacity: 0.25 }));
      axis.appendChild(H.el('text', { x, y: AXIS_Y + 16, 'text-anchor': 'middle', text: dec < 3 ? `${m} m` : `${m / 1000} km` }));
    }
    svg.appendChild(axis);

    for (let i = 0; i < SIZES_UM.length; i++) {
      const y = ROW_TOP + i * ROW_PITCH;
      const label = H.el('text', { x: X0 - 10, y: y + BAR_H / 2 + 3.5, 'text-anchor': 'end', text: `${SIZES_UM[i]} µm` });
      const bar = H.el('rect', { class: 'ovs-i-bar', x: X0, y, width: 0, height: BAR_H });
      const value = H.el('text', { x: X0, y: y + BAR_H / 2 + 3.5, text: '' });
      svg.appendChild(label);
      svg.appendChild(bar);
      svg.appendChild(value);
      refs.rows.push({ um: SIZES_UM[i], y, label, bar, value });
    }

    refs.note = H.el('g');
    svg.appendChild(refs.note);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const view = state['i10-view'];
    const windMph = Number(state['i10-wind']);
    const sizeUm = Number(state['i10-size']) || 100;
    const deposition = view === 'deposition';

    ctx.svg.style.display = deposition ? '' : 'none';
    if (refs.taxonomyWrap) refs.taxonomyWrap.style.display = view === 'taxonomy' ? '' : 'none';

    if (!refs.depositionCtls) {
      refs.depositionCtls = ['#i10-wind', 'input[name="i10-size"]']
        .map((sel) => { const el = container.querySelector(sel); return el ? el.closest('.ovs-i-control') : null; })
        .filter(Boolean);
    }
    for (const el of refs.depositionCtls) el.style.display = deposition ? '' : 'none';

    if (!refs.readoutsWrap) refs.readoutsWrap = container.querySelector('.ovs-i-readouts');
    if (refs.readoutsWrap) refs.readoutsWrap.style.display = deposition ? '' : 'none';

    // --- readouts for the selected size (physics: grease.mjs only) ------
    const vs = stokesSettling(sizeUm);
    const xg = groundContactDistance(sizeUm, windMph);
    setReadout('xGround', xg);
    setReadout('vs', vs);
    // Local formatters (brief: extend fmt ONLY here): metres/kilometres and
    // a settling velocity that can be 3.1e-5 m/s.
    const xEl = container.querySelector('output[aria-labelledby="xGround-label"]');
    if (xEl) xEl.textContent = fmtDistance(xg);
    const vEl = container.querySelector('output[aria-labelledby="vs-label"]');
    if (vEl) vEl.textContent = fmtSettling(vs);
    ctx.physics = { sizeUm, windMph, vs, xGround: xg };

    // --- bars: every RB-011 Table 3.3a row at this wind ------------------
    for (const row of refs.rows) {
      const m = groundContactDistance(row.um, windMph);
      const x = xFor(m);
      row.bar.setAttribute('width', Math.max(0, x - X0).toFixed(1));
      row.bar.style.opacity = row.um === sizeUm ? '' : '0.45';
      const fine = row.um < FINE_LIMIT_UM;
      row.value.setAttribute('x', (x + 6).toFixed(1));
      row.value.textContent = `${fmtDistance(m)}${fine && m > 0 ? ' — settling not governing' : ''}`;
      row.label.style.fontWeight = row.um === sizeUm ? '700' : '';
    }
    replaceChildren(refs.note, H.noteBox(X0, AXIS_Y + 26, windMph > 0
      ? `U = ${Math.round(windMph)} mph · < ${FINE_LIMIT_UM} µm: diffusion/washout govern, not settling (RB-011 §3.3)`
      : 'U = 0 mph — no downwind transport; droplets settle in place'));
  }

  const spec = {
    id: 'i10',
    title: 'Failure Modes & Grease Deposition',
    controls: [
      {
        id: 'i10-view', type: 'segmented', label: 'VIEW', value: defaultView,
        options: [{ value: 'taxonomy', label: 'FAILURE MODES' }, { value: 'deposition', label: 'GREASE DEPOSITION' }],
      },
      { id: 'i10-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 12, step: 1, value: 5, unit: 'mph' },
      {
        id: 'i10-size', type: 'segmented', label: 'PARTICLE SIZE', value: 100,
        options: [10, 20, 50, 100].map((um) => ({ value: um, label: `${um} µm` })),
      },
    ],
    readouts: [
      { id: 'xGround', label: 'GROUND-CONTACT DISTANCE', hero: true },
      { id: 'vs', label: 'SETTLING VELOCITY v_s' },
    ],
    scene: buildScene,
    update,

    // --- story presets: one taxonomy scenario + three deposition cases
    //     (RB-011 Table 3.3a cells: 100 µm @ 2/5 mph, 10 µm @ 10 mph).
    //     No spec.verdict — see the header comment. ------------------------
    presets: [
      { id: 'browse-the-failure-modes', label: 'Browse the failure modes', state: { 'i10-view': 'taxonomy', 'i10-wind': 5, 'i10-size': 100 } },
      { id: 'calm-patio-coarse', label: 'Calm patio, 100 µm', state: { 'i10-view': 'deposition', 'i10-wind': 2, 'i10-size': 100 } },
      { id: 'breezy-coarse', label: 'Breezy, 100 µm', state: { 'i10-view': 'deposition', 'i10-wind': 5, 'i10-size': 100 } },
      { id: 'windy-fines', label: 'Windy, 10 µm fines', state: { 'i10-view': 'deposition', 'i10-wind': 10, 'i10-size': 10 } },
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
