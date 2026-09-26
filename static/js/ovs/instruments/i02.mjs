// i02.mjs — CFM Requirement (Task 14; rebuilt on RB-008 in physics Stage B).
//
// Same module contract as i01.mjs (the canonical pattern): a single
// `mount(figureEl)` export that reads `data-preset`, builds a container,
// and hands a spec to createInstrument. Physics comes exclusively from
// ../physics/cfm.mjs (requiredCfm, coverageAdvisory) and ../physics/
// heat.mjs (SOURCES) — no number on this instrument is computed here.
//
// Inputs are RB-008's own (App A steps 1–8): the cooking SOURCE (an RB-001
// Table 3.1 row), the MOUNTING HEIGHT (the paper's 18/24/30/36/48 in table
// columns), the MOUNT (wall / peninsula / island multipliers, §3.9), the
// wind EXPOSURE class and, for the exposed class only, whether SIDE PANELS
// are fitted (K_CFM 4.14 with, 5.75 without; rb-008:142-145). Hood WIDTH
// is deliberately NOT a CFM input — RB-008 §3.4.3 / Table 3.10 show a
// wider hood needs less, not more — so the width control lives in its own
// "COVERAGE CHECK" group whose only output is the Table 3.10 coverage
// band from coverageAdvisory(); it never touches the CFM readouts.
//
// Readouts: MINIMUM (hero; RB-008 required CFM = CFM_plume × K_CFM × mount)
// and BLOWER (App A step 8: smallest standard size ≥ 1.1 × minimum), plus
// K_CFM and PLUME FLOW as the two factors the minimum is built from.
//
// Scene: three horizontal bars on a fixed 0–4,000 CFM axis — minimum,
// blower, and an "IF EXPOSED" reference (this source/height/mount in the
// exposed-without-panels class, i.e. what the same hood would need with
// no wind screening) — each annotated with a live dimension line. The
// layout (viewBox starting at y=-64, 52px row pitch, top-left stamp band)
// is the fix/instrument-layout geometry and is unchanged.
//
// v2.1 (F2) adoption:
//   - drag: a small "HOOD WIDTH" ruler-gauge hosts the 6"-snapping drag
//     affordance (same `hood-edge` -> `.ovs-i-drag-hood-edge` engine
//     target as i01) for the coverage-check width.
//   - presets: five site-voice scenarios, keyed to source/height/mount/
//     exposure/panels (+ a coverage width), landing exactly.
//   - verdict: the optional "CHECK A HOOD" rated-CFM entry (a real number
//     the visitor supplied, never one this tool invented) is graded
//     against the already-computed bands: ≥ blower PASS, ≥ minimum
//     MARGINAL, else FAIL. Left empty, no stamp. See spec.verdict for why
//     the cut itself is an OVS model criterion while both numbers it
//     compares against are RB-008's.
//   - smoke: not assigned (bar chart, no plume elevation).

import { createInstrument } from '../viz.mjs';
import { requiredCfm, coverageAdvisory, BLOWER_MARGIN, BLOWER_SIZES } from '../physics/cfm.mjs';
import { SOURCES } from '../physics/heat.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const AXIS_MAX_CFM = 4000; // fits Gas High-Output @48 in, island, exposed (3,731 CFM)

/** The SOURCE control's menu: the plan's seven (pellet low omitted). */
const SOURCE_MENU = [
  { value: 'gasSmall', label: 'GAS 25K' },
  { value: 'gasMedium', label: 'GAS 40K' },
  { value: 'gasLarge', label: 'GAS 60K' },
  { value: 'gasHigh', label: 'GAS 80K' },
  { value: 'charcoalKettle', label: 'CHARCOAL' },
  { value: 'woodFired', label: 'WOOD-FIRED' },
  { value: 'pelletHigh', label: 'PELLET' },
];
/** RB-008 Table 3.1 / 3.2 mounting-height columns (rb-008:198). */
const HEIGHTS_IN = [18, 24, 30, 36, 48];
const FUEL_WORD = { gas: 'gas', charcoal: 'charcoal', wood: 'wood-fired', pellet: 'pellet' };

/** Resolve a control value to an RB-001 SOURCES row (default Gas Large — the RB-008 §3.3 flagship). */
export function sourceFor(value) {
  return SOURCES[value] || SOURCES.gasLarge;
}
/** Resolve a control value to a paper-grid mounting height (default 30 in). */
export function heightFor(value) {
  const n = Number(value);
  return HEIGHTS_IN.includes(n) ? n : 30;
}
/** Resolve a control value to an RB-008 §3.9 mount key (default island). */
export function mountFor(value) {
  return value === 'wall' || value === 'peninsula' || value === 'island' ? value : 'island';
}

/** "60k gas", "15k charcoal", "40k wood-fired", "30k pellet". */
export const fmtSource = (src) => `${Math.round(src.btu / 1000)}k ${FUEL_WORD[src.fuel] || src.fuel}`;
const fmtCfm = (cfm) => Math.round(cfm).toLocaleString('en-US');

/**
 * Grade a user-entered "rated CFM" against this instrument's own computed
 * bands. Pure — no DOM (tested directly, see tests/i02.test.mjs).
 * Boundaries inclusive on the upper side, same convention as gradeCapture:
 * >= blower -> PASS, >= minimum -> MARGINAL, else FAIL. `bands` is exactly
 * what requiredCfm() returns — this function does no physics of its own,
 * only compares. When the minimum is so high that no standard size on the
 * cfm.mjs BLOWER_SIZES ladder clears 1.1× it (blower === null), PASS is
 * the paper's own rule applied directly: rated >= BLOWER_MARGIN × minimum
 * (rb-008:870) — the same test blowerFor() runs, using its exported
 * constant, not a re-derived one.
 */
export function gradeRatedCfm(ratedCfm, bands) {
  const passAt = bands.blower != null ? bands.blower : bands.minimum * BLOWER_MARGIN;
  if (ratedCfm >= passAt) return { grade: 'PASS' };
  if (ratedCfm >= bands.minimum) return { grade: 'MARGINAL' };
  return { grade: 'FAIL' };
}

// This instrument's basis: RB-008 §3.3 (the worked minimum / blower table,
// rb-008:307-319) and Appendix A (the step-by-step method whose step 8 is
// the blower rule, rb-008:829-880). Appended to the copy-spec-line output
// and named on the verdict stamp.
const CITATION = 'RB-008 §3.3 / App A';

/**
 * W5-T6 (UX P1-6, "carry-away"): the one-line, physics-honest spec summary
 * for the copy-spec-line button — e.g. "60k gas · 30 in · wall · moderate →
 * min 892 / blower 1,200 CFM — outdoorventilationstandard.com/questions/
 * what-cfm-do-i-need/ (RB-008 §3.3 / App A)".
 *
 * Pure and DOM-free (no `location` read here — the caller passes `href`)
 * so it stays unit-testable under plain node. `bands` must be the SAME
 * object requiredCfm() returned for `state` (update() hands it through via
 * ctx.physics.bands) — this function only formats numbers, it never
 * computes them, so the copied line can never disagree with the screen.
 * Returns null if `bands` is missing (called before the first update()).
 * The source/height/mount fallbacks are the exact helpers update() uses,
 * so the label and the numbers can never describe different inputs.
 */
export function buildSpecLine(state, bands, href) {
  if (!bands) return null;
  const src = sourceFor(state['i02-source']);
  const height = heightFor(state['i02-height']);
  const mount = mountFor(state['i02-mount']);
  const exposure = state['i02-exposure'] || 'moderate';
  const panels = state['i02-panels'] === 'both' ? 'both' : 'none';
  const exposureStr = exposure === 'exposed' ? (panels === 'both' ? 'exposed + panels' : 'exposed') : exposure;
  const blowerStr = bands.blower != null ? fmtCfm(bands.blower) : `above ${fmtCfm(BLOWER_SIZES[BLOWER_SIZES.length - 1])}`;
  // The report's own example drops the scheme — a spec line meant to be
  // texted or read aloud doesn't need it.
  const shownHref = String(href || '').replace(/^https?:\/\//, '');
  return `${fmtSource(src)} · ${height} in · ${mount} · ${exposureStr} → min ${fmtCfm(bands.minimum)} / blower ${blowerStr} CFM — ${shownHref} (${CITATION})`;
}

/**
 * The COVERAGE CHECK sentence for a coverageAdvisory() result, e.g.
 * "48 in is 77% of the 62 in RB-002 width — plume overflows the hood
 * (65–75% capture at best): upgrade width rather than CFM." Pure; formats
 * the advisory only (RB-008 Table 3.10 bands, rb-008:584-591).
 */
export function coverageSentence(cov) {
  const pct = Math.round(cov.pctOfRecommended);
  const rec = Math.round(cov.recommendedWidthIn);
  const [lo, hi] = cov.captureBand;
  const verdict = {
    overflow: `plume overflows the hood (${lo}–${hi}% capture at best): upgrade width rather than CFM`,
    marginal: `marginal coverage (${lo}–${hi}% capture at best): upgrade width rather than CFM`,
    acceptable: `near-adequate coverage (${lo}–${hi}% capture): a slight CFM increase compensates`,
    full: `full coverage (${lo}%+ capture): the CFM bands above hold`,
  }[cov.band] || cov.band;
  return `${Math.round(cov.widthIn)} in is ${pct}% of the ${rec} in RB-002 width — ${verdict}.`;
}

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i02Mounted === '1') return;
  figureEl.dataset.i02Mounted = '1';

  const { mount: mountVal, widthIn } = parsePreset(figureEl.dataset.preset);

  // Clear placeholder content; keep <noscript> and any authored <figcaption>.
  const keep = new Set(['NOSCRIPT', 'FIGCAPTION']);
  for (const node of Array.from(figureEl.childNodes)) {
    if (node.nodeType === 1 && keep.has(node.tagName)) continue;
    figureEl.removeChild(node);
  }
  const container = document.createElement('div');
  container.className = 'ovs-instrument-mount';
  const figcaption = figureEl.querySelector('figcaption');
  figureEl.insertBefore(container, figcaption || null);

  // --- band-chart geometry (viewBox px) --------------------------------
  const X0 = 150; // bar origin (after row labels)
  const X1 = 690; // AXIS_MAX_CFM
  // Rows sit on a 52px pitch and the viewBox starts at y=-64, so the chart
  // carries a state-independent empty band across its top-left — the
  // row-label column x<140 down to y=85 and the x<510 band above the
  // gridlines (GRID_TOP) — where the verdict stamp lives (components.css,
  // `[data-instrument="i02"] .ovs-i-stamp`). Physics and every plotted
  // value are untouched by that geometry — only where the bars are drawn.
  const VIEWBOX = '0 -64 720 334';
  const ROWS = [
    { key: 'minimum', label: 'MINIMUM', y: 90 },
    { key: 'blower', label: 'BLOWER', y: 142 },
    { key: 'exposedRef', label: 'IF EXPOSED', y: 194 },
  ];
  const BAR_H = 22;
  const GRID_TOP = 56; // gridlines start 34px above the first bar
  const AXIS_Y = 236;
  const xFor = (cfm) => X0 + (Math.min(cfm, AXIS_MAX_CFM) / AXIS_MAX_CFM) * (X1 - X0);

  // --- HOOD WIDTH drag gauge (top-right, above the bands) ---------------
  // A small ruler, not a hood elevation: fixed 42-72in scale, drag target
  // is its right edge, exactly like i01's hood-edge except linear.
  const WIDTH_X0 = 520, WIDTH_X1 = 690; // 42in .. 72in
  const WIDTH_Y = 16, WIDTH_H = 14;
  const widthX = (w) => WIDTH_X0 + ((w - 42) / 30) * (WIDTH_X1 - WIDTH_X0);

  let H = null;
  const refs = { rows: {} };

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', VIEWBOX);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Bar chart of the required exhaust airflow — RB-008 minimum, the blower to specify, and the exposed-site reference — on a 0 to 4,000 CFM axis.');

    // axis + gridlines at every 500 CFM
    const axis = H.el('g');
    axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0, y1: AXIS_Y, x2: X1, y2: AXIS_Y }));
    for (let cfm = 0; cfm <= AXIS_MAX_CFM; cfm += 500) {
      const x = xFor(cfm);
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: GRID_TOP, x2: x, y2: AXIS_Y, opacity: 0.25 }));
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: AXIS_Y, x2: x, y2: AXIS_Y + 6 }));
      axis.appendChild(H.el('text', {
        x, y: AXIS_Y + 20, 'text-anchor': 'middle',
        text: cfm === 0 ? '0' : `${(cfm / 1000).toFixed(1).replace('.0', '')}k`,
      }));
    }
    axis.appendChild(H.el('text', { x: X1, y: AXIS_Y + 34, 'text-anchor': 'end', text: 'exhaust airflow, CFM' }));
    svg.appendChild(axis);

    // one bar + row label + dimension-line mount per band
    for (const row of ROWS) {
      const g = H.el('g');
      g.appendChild(H.el('text', {
        x: X0 - 10, y: row.y + BAR_H / 2 + 3.5, 'text-anchor': 'end', text: row.label,
      }));
      const bar = H.el('rect', {
        class: 'ovs-i-bar', x: X0, y: row.y, width: 0, height: BAR_H,
      });
      const dim = H.el('g');
      g.appendChild(bar);
      g.appendChild(dim);
      svg.appendChild(g);
      refs.rows[row.key] = { bar, dim, y: row.y };
    }

    // --- HOOD WIDTH gauge + drag handle --------------------------------
    const gauge = H.el('g');
    gauge.appendChild(H.el('text', { x: WIDTH_X0, y: WIDTH_Y - 6, text: 'HOOD WIDTH (coverage)' }));
    gauge.appendChild(H.el('line', {
      class: 'ovs-i-fl-thin', x1: WIDTH_X0, y1: WIDTH_Y + WIDTH_H / 2, x2: WIDTH_X1, y2: WIDTH_Y + WIDTH_H / 2,
    }));
    refs.widthBar = H.el('rect', { class: 'ovs-i-bar', x: WIDTH_X0, y: WIDTH_Y, width: 0, height: WIDTH_H });
    gauge.appendChild(refs.widthBar);
    refs.widthLabel = H.el('text', { x: WIDTH_X1, y: WIDTH_Y + WIDTH_H + 12, 'text-anchor': 'end', text: '' });
    gauge.appendChild(refs.widthLabel);
    svg.appendChild(gauge);

    // Transparent hit strip re-measured live (in update()) to sit centered
    // on the current right edge — same ≥44px-tall convention as i01.
    refs.dragWidth = H.el('rect', {
      // --square modifier: 44x44 (not 44x92 like the hood elevations), so
      // the mobile hit-area scale-up in components.css grows BOTH axes.
      class: 'ovs-i-drag-hood-edge ovs-i-drag-hood-edge--square', x: 0, y: WIDTH_Y - 15, width: 44, height: 44, fill: 'transparent',
    });
    svg.appendChild(refs.dragWidth);
  }

  function replaceChildren(g, ...nodes) {
    while (g.firstChild) g.removeChild(g.firstChild);
    for (const n of nodes) g.appendChild(n);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const src = sourceFor(state['i02-source']);
    const riseIn = heightFor(state['i02-height']);
    const mountKey = mountFor(state['i02-mount']);
    const exposure = state['i02-exposure'] || 'moderate';
    const panels = state['i02-panels'] === 'both' ? 'both' : 'none';

    const bands = requiredCfm({ src, riseIn, mount: mountKey, exposure, panels });
    // The exposed-without-panels reference for the same source/height/
    // mount: asked of the module (not tables.exposed × mountMult here),
    // so the bar is a requiredCfm() output like the other two.
    const exposedRef = requiredCfm({ src, riseIn, mount: mountKey, exposure: 'exposed', panels: 'none' }).minimum;
    const cov = coverageAdvisory(Number(state['i02-width']), riseIn, src);

    setReadout('minimum', bands.minimum);
    setReadout('blower', bands.blower != null ? bands.blower : 0);
    setReadout('kCfm', bands.kCfm);
    setReadout('plumeCfm', bands.plumeCfm);
    // Local formatting (brief: extend fmt ONLY here, not in the engine).
    // The engine's default formatter rounds to an integer, which would turn
    // K_CFM 3.68 into "4"; and a blower above the ladder has no size.
    const kEl = container.querySelector('output[aria-labelledby="kCfm-label"]');
    if (kEl) kEl.textContent = `${bands.kCfm.toFixed(2)}×`;
    if (bands.blower == null) {
      const bEl = container.querySelector('output[aria-labelledby="blower-label"]');
      if (bEl) bEl.textContent = `> ${fmtCfm(BLOWER_SIZES[BLOWER_SIZES.length - 1])} CFM`;
    }

    // Expose the exact requiredCfm()/coverageAdvisory() output on the
    // shared ctx channel so the verdict stamp (spec.verdict) and the
    // copy-spec-line button (spec.copyLine) read these numbers verbatim.
    ctx.physics = { bands, exposedRef, cov };

    const values = { minimum: bands.minimum, blower: bands.blower, exposedRef };
    for (const [key, row] of Object.entries(refs.rows)) {
      const cfm = values[key];
      if (cfm == null) {
        row.bar.setAttribute('width', '0');
        replaceChildren(row.dim, H.noteBox(X0, row.y - 24, `no standard size ≥ 1.1 × ${fmtCfm(bands.minimum)} CFM`));
        continue;
      }
      const x = xFor(cfm);
      row.bar.setAttribute('width', Math.max(0, x - X0).toFixed(1));
      // Dimension line re-measures the bar live, annotated with its value.
      replaceChildren(row.dim, H.dimensionLine(X0, row.y - 10, x, row.y - 10, `${fmtCfm(cfm)} CFM`));
    }

    // --- SIDE PANELS only enter K_CFM in the exposed class (rb-008:144-
    //     145): grey the control otherwise, the way i08 disables WIND
    //     indoors. The engine has no disable hook, so reach into the DOM. --
    if (!refs.panelsCtl) {
      const radio = container.querySelector('input[name="i02-panels"]');
      refs.panelsCtl = radio ? radio.closest('.ovs-i-control') : null;
      refs.panelRadios = Array.from(container.querySelectorAll('input[name="i02-panels"]'));
    }
    const panelsOff = exposure !== 'exposed';
    if (refs.panelsCtl) {
      refs.panelsCtl.classList.toggle('ovs-i-control--disabled', panelsOff);
      refs.panelsCtl.setAttribute('aria-disabled', panelsOff ? 'true' : 'false');
    }
    for (const r of refs.panelRadios || []) r.disabled = panelsOff;

    // --- COVERAGE CHECK sentence (RB-008 Table 3.10) --------------------
    refs.lastCov = cov;
    if (refs.coverageNote) refs.coverageNote.textContent = coverageSentence(cov);

    // --- HOOD WIDTH gauge + drag handle ---------------------------------
    const widthCtl = Number(state['i02-width']);
    const wx = widthX(widthCtl);
    refs.widthBar.setAttribute('width', Math.max(0, wx - WIDTH_X0).toFixed(1));
    refs.widthLabel.textContent = `${Math.round(widthCtl)}″ · ${Math.round(cov.pctOfRecommended)}% of ${Math.round(cov.recommendedWidthIn)}″`;
    refs.dragWidth.setAttribute('x', (wx - 22).toFixed(1));
  }

  const spec = {
    id: 'i02',
    title: 'CFM Requirement',
    controls: [
      {
        id: 'i02-source', type: 'segmented', label: 'SOURCE', value: 'gasLarge',
        options: SOURCE_MENU,
      },
      {
        id: 'i02-height', type: 'segmented', label: 'MOUNTING HEIGHT', value: 30,
        options: HEIGHTS_IN.map((h) => ({ value: h, label: `${h}″` })),
      },
      {
        id: 'i02-mount', type: 'segmented', label: 'MOUNT', value: mountVal,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'peninsula', label: 'PENINSULA' }, { value: 'island', label: 'ISLAND' }],
      },
      {
        id: 'i02-exposure', type: 'segmented', label: 'WIND EXPOSURE', value: 'moderate',
        options: [
          { value: 'sheltered', label: 'SHELTERED' },
          { value: 'moderate', label: 'MODERATE' },
          { value: 'exposed', label: 'EXPOSED' },
        ],
      },
      {
        id: 'i02-panels', type: 'segmented', label: 'SIDE PANELS (exposed only)', value: 'none',
        options: [{ value: 'none', label: 'NONE' }, { value: 'both', label: 'BOTH' }],
      },
      // Coverage check only — never read by the CFM computation. Pulled
      // into its own "COVERAGE CHECK" <fieldset> post-mount below.
      { id: 'i02-width', type: 'range', label: 'HOOD WIDTH', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      // Optional, separate from the spec inputs above: does not drive
      // requiredCfm() at all — only compared against the bands once typed.
      // value: null so the instrument opens with the field empty and no
      // stamp. Pulled into its own "CHECK A HOOD" <fieldset> post-mount.
      // step: 'any' — a real nameplate figure such as 1,437 CFM is graded
      // exactly like any other (gradeRatedCfm never rounds).
      {
        id: 'i02-rated', type: 'number', label: "HOOD'S RATED CFM", value: null,
        min: 0, step: 'any', placeholder: 'e.g. 1500',
      },
    ],
    // stripLabel: the <=760px sticky strip shows both cells plus the
    // verdict grade badge on one line; values are copied verbatim, only
    // the label text is abbreviated.
    readouts: [
      { id: 'minimum', label: 'MINIMUM', stripLabel: 'MIN', format: 'cfm', hero: true },
      { id: 'blower', label: 'BLOWER', stripLabel: 'BLW', format: 'cfm' },
      { id: 'kCfm', label: 'K_CFM' },
      { id: 'plumeCfm', label: 'PLUME FLOW', format: 'cfm' },
    ],
    stickyReadout: ['minimum', 'blower'],
    scene: buildScene,
    update,

    // --- direct manipulation: grab the width gauge's right edge, 6" snap,
    //     matching i01's hood-edge drag exactly. ---------------------------
    drag: [
      {
        target: 'hood-edge', control: 'i02-width', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(42 + ((x - WIDTH_X0) / (WIDTH_X1 - WIDTH_X0)) * 30),
      },
    ],

    // --- story presets: keyed to source/height/mount/exposure/panels. The
    //     first is RB-008 §3.3's worked case (892 / 1,200; rb-008:310). ---
    presets: [
      { id: 'paper-flagship', label: 'RB-008 worked case (60k, wall)', state: { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none', 'i02-width': 60 } },
      { id: 'compact-wall', label: 'Compact wall kitchen', state: { 'i02-source': 'gasMedium', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'sheltered', 'i02-panels': 'none', 'i02-width': 54 } },
      { id: 'standard-island', label: 'Standard island', state: { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'island', 'i02-exposure': 'moderate', 'i02-panels': 'none', 'i02-width': 60 } },
      { id: 'exposed-panels', label: 'Exposed island, panels', state: { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-panels': 'both', 'i02-width': 60 } },
      { id: 'pro-outdoor-kitchen', label: 'Pro outdoor kitchen', state: { 'i02-source': 'gasHigh', 'i02-height': 36, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-panels': 'none', 'i02-width': 72 } },
    ],

    // --- verdict stamp: grades the visitor's OWN typed "rated CFM" against
    //     this configuration's bands (>= blower PASS, >= minimum MARGINAL,
    //     else FAIL — gradeRatedCfm above). Both numbers compared against
    //     are RB-008's: the minimum is App A steps 4–7 (rb-008:834-880) and
    //     the blower is App A step 8's 1.1× standard-size rule (rb-008:870;
    //     §3.3 rb-008:307-319). The PASS/MARGINAL split itself is an OVS
    //     model criterion: RB-008 does not define a scale for comparing an
    //     arbitrary nameplate figure against those two numbers, so the
    //     stamp labels the cut as ours and the data as the paper's — the
    //     same "cite the data, not a nonexistent rubric" pattern i01 uses.
    //     The stamp never validates, certifies, or recommends a product;
    //     the engine's standard "Grades apply to the model configuration,
    //     not to any product." footnote applies. Returns { grade: null }
    //     (stamp hidden) whenever the optional field is empty or not a
    //     finite, positive number.
    verdict: (state, physics) => {
      const rated = state['i02-rated'];
      if (rated == null || !Number.isFinite(rated) || rated <= 0) return { grade: null };
      const bands = (physics && physics.bands) || { minimum: 0, blower: 0 };
      const { grade } = gradeRatedCfm(rated, bands);
      const ratedStr = fmtCfm(rated);
      const blowerStr = bands.blower != null ? fmtCfm(bands.blower) : `${BLOWER_MARGIN}× the minimum`;
      const minStr = fmtCfm(bands.minimum);
      let plain;
      if (grade === 'PASS') {
        plain = `${ratedStr} CFM meets the RB-008 blower for this configuration.`;
      } else if (grade === 'MARGINAL') {
        plain = `${ratedStr} CFM clears the ${minStr} CFM minimum but is under the ${blowerStr} CFM blower.`;
      } else {
        plain = `${ratedStr} CFM is below the ${minStr} CFM RB-008 minimum for this configuration.`;
      }
      return {
        grade,
        plain,
        clauseRef: `model criterion: ≥ blower PASS · ≥ minimum MARGINAL — ${CITATION}`,
        detail: `Rated CFM ${ratedStr} vs. this configuration's RB-008 minimum (${minStr}) and blower (${blowerStr}) — both from RB-008 §3.3 / App A; the PASS/MARGINAL split is an OVS model criterion.`,
      };
    },

    // --- W5-T6 (UX P1-6): "carry-away" copy-spec-line button --------------
    // The engine calls this with the paired ctx.state/ctx.physics snapshot.
    // `href` is read from `location` right here (the one DOM touch), then
    // handed to the pure, node-testable buildSpecLine().
    copyLine: (state, physics) => buildSpecLine(
      state,
      physics && physics.bands,
      typeof location !== 'undefined' ? location.origin + location.pathname : '',
    ),
  };

  // Exposed on the figure element so the shared "Explain this
  // configuration" button (partials/instrument-figure.html,
  // static/js/ovs/explain-ui.mjs) can read the live control state via
  // .get() without this module knowing anything about that feature.
  figureEl.ovsInstrument = createInstrument(container, spec);

  // --- post-mount regrouping ---------------------------------------------
  // The engine renders every spec.controls entry into one shared fieldset.
  // Two of them are not CFM inputs and must not read as such: the coverage
  // width and the rated-CFM check. The engine has no grouping hook (same
  // situation i08 is in for its disabled-control styling), so — same
  // established pattern — move each control's wrap into its own labeled
  // <fieldset> after the readouts.
  const article = container.querySelector('.ovs-i-instrument');
  const foot = article && article.querySelector('.ovs-i-verdict-foot');
  function regroup(controlId, className, legendText, noteText) {
    const label = article && article.querySelector(`label[for="${controlId}"]`);
    const wrap = label && label.closest('.ovs-i-control');
    if (!article || !wrap) return null;
    const section = document.createElement('fieldset');
    section.className = className;
    const legend = document.createElement('legend');
    legend.className = `${className}-legend`;
    legend.textContent = legendText;
    section.appendChild(legend);
    const note = document.createElement('p');
    note.className = `${className}-note`;
    note.textContent = noteText;
    section.appendChild(note);
    wrap.classList.add(`${className}-control`);
    section.appendChild(wrap); // moves it out of the main controls fieldset
    if (foot) article.insertBefore(section, foot);
    else article.appendChild(section);
    return section;
  }
  const coverage = regroup(
    'i02-width', 'ovs-i-coverage', 'COVERAGE CHECK',
    'Width does not set CFM (RB-008 §3.4.3): a narrower hood needs more, not less. Check the hood against the RB-002 recommended width instead.',
  );
  if (coverage) {
    refs.coverageNote = document.createElement('p');
    refs.coverageNote.className = 'ovs-i-coverage-readout';
    refs.coverageNote.setAttribute('aria-live', 'polite');
    coverage.appendChild(refs.coverageNote);
    // The engine's mount-time update() ran before this element existed —
    // fill it once now from the coverageAdvisory() result that update()
    // cached (no re-derivation).
    if (refs.lastCov) refs.coverageNote.textContent = coverageSentence(refs.lastCov);
  }
  regroup(
    'i02-rated', 'ovs-i-check-hood', 'CHECK A HOOD',
    "Optional — enter a candidate hood's rated CFM to see how it compares to the bands above. Doesn't change them.",
  );
}
