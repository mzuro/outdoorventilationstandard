// i02.mjs — CFM Requirement (Task 14).
//
// Same module contract as i01.mjs (the canonical pattern): a single
// `mount(figureEl)` export that reads `data-preset`, builds a container,
// and hands a spec to createInstrument. Physics comes exclusively from
// ../physics/cfm.mjs (requiredCfm) — the three bands are never recomputed
// here.
//
// Scene: three horizontal bars (minimum / recommended / high-wind) on a
// fixed 0-3500 CFM axis, each annotated with a live dimension line. The
// bars animate for free: the engine tweens the width/BTU range values and
// calls update() every frame, so the bars re-derive from the tweened
// state.
//
// v2.1 (F2) adoption, per the plan's per-instrument assignment:
//   - drag: this instrument has no side-view hood elevation (it is a bar
//     chart), so there is no literal hood-edge glyph to grab. A small
//     "HOOD WIDTH" ruler-gauge is added to the scene purely to host the
//     6"-snapping drag affordance (mirrors i01's hood-edge drag pattern,
//     same `hood-edge` -> `.ovs-i-drag-hood-edge` engine target); it does
//     not duplicate or disagree with any bar — width still drives the
//     bands exclusively through requiredCfm().
//   - presets: four site-voice scenarios landing exactly on their control
//     values.
//   - verdict: ADDED (this task; was previously SKIPPED — see git history
//     for the original deferral note). This instrument still has no
//     "installed/actual CFM" reading of its own — only the three physics
//     bands (minimum, recommended, high-wind) computed FOR the configured
//     hood. That's still true, and it's still why the verdict is NOT
//     wired against the tool's own output: grading requiredCfm()'s
//     recommended figure against its own recommended band would be a
//     tautology (always PASS), and assuming a blower value the user never
//     supplied would fabricate an input. Neither is honest. What changed:
//     an optional "HOOD'S RATED CFM" control (its own "CHECK A HOOD"
//     section, separate from the WIDTH/MOUNT/EXPOSURE/BTU spec inputs)
//     lets a visitor type their candidate hood's own rated CFM — a real
//     number they supplied, not one this tool invented — and spec.verdict
//     grades THAT number against the already-computed bands. Left empty
//     (the default), the field commits nothing and the stamp stays
//     hidden: the instrument behaves exactly as it always has, three bars
//     and no stamp. See the comment above spec.verdict below for why the
//     PASS/MARGINAL/FAIL cut itself is this instrument's own comparison
//     convention, not an RB-008 grading rubric.
//   - smoke: not assigned to this instrument by the plan (it has no plume
//     elevation to visualize).

import { createInstrument } from '../viz.mjs';
import { requiredCfm } from '../physics/cfm.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const AXIS_MAX_CFM = 3500;

// Local formatter (brief: extend fmt ONLY here, not in the engine):
// 60000 -> "60k BTU".
const fmtBtu = (btu) => `${Math.round(btu / 1000)}k BTU`;

/**
 * Grade a user-entered "rated CFM" against this instrument's own computed
 * bands. Pure — no DOM, mirrors viz.mjs's gradeCapture (tested directly,
 * see tests/i02.test.mjs). Boundaries inclusive on the upper side, same
 * convention as gradeCapture: >= recommended -> PASS, >= minimum ->
 * MARGINAL, else FAIL. `bands` is exactly what requiredCfm() returns —
 * this function does no physics of its own, only compares.
 */
export function gradeRatedCfm(ratedCfm, bands) {
  if (ratedCfm >= bands.recommended) return { grade: 'PASS' };
  if (ratedCfm >= bands.minimum) return { grade: 'MARGINAL' };
  return { grade: 'FAIL' };
}

// This instrument's basis paper (RB-008, "Required Exhaust Airflow") — the
// citation appended to the copy-spec-line output below. Not derived from
// `bands`; it names the paper the whole instrument is built on, same as
// every other RB-008 reference in this file's comments.
const CITATION = 'RB-008';

/**
 * W5-T6 (UX P1-6, "carry-away"): build the one-line, physics-honest spec
 * summary for the copy-spec-line button — e.g. "48 in island · 60k BTU ·
 * moderate wind → min 1,450 / rec 1,800 CFM — outdoorventilationstandard.
 * com/questions/what-cfm-do-i-need/ (RB-008)".
 *
 * Pure and DOM-free (no `location` read here — the caller passes `href`)
 * so it stays unit-testable under plain node. `bands` must be the SAME
 * object requiredCfm() returned for `state` (update() below hands it
 * through via ctx.physics.bands) — this function only formats numbers, it
 * never computes them, so the copied line can never disagree with what's
 * on screen. Returns null if `bands` is missing (e.g. called before the
 * first update()).
 *
 * The mount fallback below is deliberately the exact same expression
 * update() uses to derive `mountKey` (`MOUNT[state['i02-mount']] ? ... :
 * 'island'`) — not the instrument's own inverted guess — so the two can
 * never disagree about which mount a given `state['i02-mount']` value
 * means. `MOUNT` (hood-presets.mjs) only defines 'wall' and 'island'; there
 * is no 'peninsula' entry, matching every other MOUNT[...] fallback in this
 * codebase (i01.mjs, i05.mjs) and this instrument's own segmented control
 * (WALL/ISLAND only, no peninsula option — see the `controls` array below).
 * requiredCfm()/MOUNT_MULT (cfm.mjs) DO carry a peninsula multiplier, but
 * purely for the physics module's own direct-call API (see tests/cfm.test
 * .mjs) — no instrument, including this one's update(), ever resolves
 * 'peninsula' as a mountKey today, so labeling one here without update()
 * also computing island-vs-peninsula bands would just recreate the exact
 * label/numbers mismatch this fix removes. If a future task adds a
 * peninsula option to MOUNT and this control, update() and buildSpecLine()
 * must gain their peninsula handling together, in the same change.
 */
export function buildSpecLine(state, bands, href) {
  if (!bands) return null;
  const width = Math.round(Number(state['i02-width']));
  const mount = MOUNT[state['i02-mount']] ? state['i02-mount'] : 'island';
  const exposure = state['i02-exposure'] || 'moderate';
  const min = Math.round(bands.minimum).toLocaleString('en-US');
  const rec = Math.round(bands.recommended).toLocaleString('en-US');
  // The report's own example drops the scheme ("outdoorventilationstandard
  // .com/..." not "https://outdoorventilationstandard.com/...") — a spec
  // line meant to be texted or read aloud doesn't need it.
  const shownHref = String(href || '').replace(/^https?:\/\//, '');
  return `${width} in ${mount} · ${fmtBtu(state['i02-btu'])} · ${exposure} wind → min ${min} / rec ${rec} CFM — ${shownHref} (${CITATION})`;
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
  const X1 = 690; // 3500 CFM
  // Rows sit on a 52px pitch (was 60) and the viewBox starts at y=-64
  // (was 0), so the chart carries a state-independent empty band across
  // its top-left — the row-label column x<140 down to y=85 and the
  // x<510 band above the gridlines (GRID_TOP) — that is where the
  // verdict stamp now lives (components.css, `[data-instrument="i02"]
  // .ovs-i-stamp`). Bottom-right, the engine default, covered the 2k/2.5k
  // tick labels and the axis caption on desktop and half the scene on
  // mobile; nowhere in the old 720x270 frame was free of data at every
  // control state. Physics and every plotted value are untouched — only
  // where the bars are drawn.
  const VIEWBOX = '0 -64 720 334';
  const ROWS = [
    { key: 'minimum', label: 'MINIMUM', y: 90 },
    { key: 'recommended', label: 'RECOMMENDED', y: 142 },
    { key: 'highWind', label: 'HIGH-WIND', y: 194 },
  ];
  const BAR_H = 22;
  const GRID_TOP = 56; // gridlines start 34px above the first bar
  const AXIS_Y = 236;
  const xFor = (cfm) => X0 + (Math.min(cfm, AXIS_MAX_CFM) / AXIS_MAX_CFM) * (X1 - X0);

  // --- HOOD WIDTH drag gauge (top-right, above the bands) ---------------
  // A small ruler, not a hood elevation: fixed 42-72in scale, drag target
  // is its right edge, exactly like i01's hood-edge except linear instead
  // of centered-on-a-hood.
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
    svg.setAttribute('aria-label', 'Bar chart of the three airflow bands — minimum, recommended, and high-wind CFM — on a 0 to 3,500 CFM axis.');

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
    gauge.appendChild(H.el('text', { x: WIDTH_X0, y: WIDTH_Y - 6, text: 'HOOD WIDTH' }));
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
      // --square modifier: this strip is 44x44 (not 44x92 like the hood
      // elevations), so the mobile hit-area scale-up in components.css
      // must grow BOTH axes for it (F3 QA F-6).
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
    const mountKey = MOUNT[state['i02-mount']] ? state['i02-mount'] : 'island';
    // Depth is not a CFM driver (RB-008 §3.4.3); mount carries the island premium.
    const bands = requiredCfm({
      widthIn: state['i02-width'],
      mount: mountKey,
      btu: state['i02-btu'],
      exposure: state['i02-exposure'],
    });

    setReadout('recommended', bands.recommended);
    setReadout('minimum', bands.minimum);
    setReadout('highWind', bands.highWind);

    // Expose the exact requiredCfm() output on the shared ctx channel (same
    // object shape as i01/i07/i08) so both the verdict stamp (spec.verdict)
    // and the copy-spec-line button (spec.copyLine) read these numbers
    // verbatim instead of recomputing them.
    ctx.physics = { bands };

    for (const [key, row] of Object.entries(refs.rows)) {
      const cfm = bands[key];
      const x = xFor(cfm);
      row.bar.setAttribute('width', Math.max(0, x - X0).toFixed(1));
      // Dimension line re-measures the bar live, annotated with its value.
      replaceChildren(row.dim, H.dimensionLine(
        X0, row.y - 10, x, row.y - 10,
        `${Math.round(cfm).toLocaleString('en-US')} CFM`,
      ));
    }

    // BTU control bubble: engine writes the raw number; restyle it with the
    // local formatter. update() always runs after the engine's bubble
    // refresh, so this wins in every code path (init, tween tick, reduced).
    const btuBubble = container.querySelector('output[for="i02-btu"]');
    if (btuBubble) btuBubble.textContent = fmtBtu(state['i02-btu']);

    // --- HOOD WIDTH gauge + drag handle ---------------------------------
    const widthCtl = state['i02-width'];
    const wx = widthX(widthCtl);
    refs.widthBar.setAttribute('width', Math.max(0, wx - WIDTH_X0).toFixed(1));
    refs.widthLabel.textContent = `${Math.round(widthCtl)}″`;
    refs.dragWidth.setAttribute('x', (wx - 22).toFixed(1));
  }

  const spec = {
    id: 'i02',
    title: 'CFM Requirement',
    controls: [
      { id: 'i02-width', type: 'range', label: 'HOOD WIDTH', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i02-mount', type: 'segmented', label: 'MOUNT', value: mountVal,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      {
        id: 'i02-exposure', type: 'segmented', label: 'WIND EXPOSURE', value: 'moderate',
        options: [
          { value: 'sheltered', label: 'SHELTERED' },
          { value: 'moderate', label: 'MODERATE' },
          { value: 'exposed', label: 'EXPOSED' },
        ],
      },
      { id: 'i02-btu', type: 'range', label: 'BURNER RATING', min: 30000, max: 150000, step: 10000, value: 60000 },
      // Optional, separate from the four spec inputs above: does not drive
      // requiredCfm() at all (it isn't read anywhere in update()'s bands
      // computation) — it is only compared against the bands once typed.
      // value: null so the instrument opens with the field empty and no
      // stamp, matching this instrument's pre-existing behavior exactly.
      // Pulled into its own "CHECK A HOOD" <fieldset> post-mount below so
      // it never reads as a fifth required spec control.
      // step: 'any' — a real nameplate figure such as 1,437 CFM is graded
      // exactly like any other (gradeRatedCfm never rounds), so a 25-CFM
      // step only made the field :invalid (stepMismatch) for the very
      // numbers visitors copy off a spec sheet.
      {
        id: 'i02-rated', type: 'number', label: "HOOD'S RATED CFM", value: null,
        min: 0, step: 'any', placeholder: 'e.g. 1500',
      },
    ],
    // stripLabel: the <=760px sticky strip (viz.mjs, spec.stickyReadout)
    // shows both cells plus the verdict grade badge on one line; at 375px
    // the full labels ellipsized ("RECOM… 1,800 CFM  MI… 1,450 CFM  FAIL")
    // once the badge appeared. The strip copies values verbatim; only the
    // label text is abbreviated.
    readouts: [
      { id: 'recommended', label: 'RECOMMENDED', stripLabel: 'REC', format: 'cfm', hero: true },
      { id: 'minimum', label: 'MINIMUM', stripLabel: 'MIN', format: 'cfm' },
      { id: 'highWind', label: 'HIGH-WIND', format: 'cfm' },
    ],
    // W5-T2 sticky strip: hero + minimum, plus the verdict grade (added
    // automatically by the engine whenever spec.verdict is a function).
    // Engine copies values verbatim.
    stickyReadout: ['recommended', 'minimum'],
    scene: buildScene,
    update,

    // --- direct manipulation: grab the width gauge's right edge, 6" snap,
    //     matching i01's hood-edge drag exactly (same conversion shape). ----
    drag: [
      {
        target: 'hood-edge', control: 'i02-width', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(42 + ((x - WIDTH_X0) / (WIDTH_X1 - WIDTH_X0)) * 30),
      },
    ],

    // --- story presets: four site-voice scenarios landing exactly on their
    //     control values. ---------------------------------------------------
    presets: [
      { id: 'compact-wall', label: 'Compact wall kitchen', state: { 'i02-width': 42, 'i02-mount': 'wall', 'i02-exposure': 'sheltered', 'i02-btu': 40000 } },
      { id: 'standard-island', label: 'Standard island', state: { 'i02-width': 48, 'i02-mount': 'island', 'i02-exposure': 'moderate', 'i02-btu': 60000 } },
      { id: 'big-island-exposed', label: 'Big island, exposed', state: { 'i02-width': 60, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-btu': 90000 } },
      { id: 'pro-outdoor-kitchen', label: 'Pro outdoor kitchen', state: { 'i02-width': 72, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-btu': 120000 } },
    ],

    // --- verdict stamp: grades the visitor's OWN typed "rated CFM" against
    //     this instrument's already-computed bands (>= recommended PASS,
    //     >= minimum MARGINAL, else FAIL — see gradeRatedCfm above). This
    //     PASS/MARGINAL/FAIL cut is this instrument's MODEL CRITERION, not
    //     an RB-008 grading rubric: RB-008 defines the minimum/recommended/
    //     high-wind CFM figures themselves (requiredCfm(), content/research/
    //     rb-008-*.md), but the paper does not define a scale for comparing
    //     an arbitrary rated-CFM number against those figures — that
    //     recommended-met/minimum-met split is this site's own comparison
    //     convention, exactly the same "model criterion, cite the data not
    //     a nonexistent rubric" pattern i01.mjs uses for its capture
    //     thresholds (see the comment above i01's own verdict field). The
    //     stamp never validates, certifies, or recommends a product — it
    //     only compares the number the visitor typed to the bands already
    //     on screen, and the engine's standard "Grades apply to the model
    //     configuration, not to any product." footnote applies here too.
    //     Returns { grade: null } (stamp hidden — see updateVerdict() in
    //     viz.mjs) whenever the optional field is empty or not a finite,
    //     positive number, so with the field untouched the three bars and
    //     their readouts are computed exactly as before and no PASS/
    //     MARGINAL/FAIL stamp ever appears. (The "CHECK A HOOD" input box
    //     and the engine's standard grading footnote DO now render on the
    //     page at all times once spec.verdict exists — that's the visible
    //     surface of this feature, not a regression in the bars/readouts.)
    verdict: (state, physics) => {
      const rated = state['i02-rated'];
      if (rated == null || !Number.isFinite(rated) || rated <= 0) return { grade: null };
      const bands = (physics && physics.bands) || { minimum: 0, recommended: 0, highWind: 0 };
      const { grade } = gradeRatedCfm(rated, bands);
      const ratedStr = Math.round(rated).toLocaleString('en-US');
      const recStr = Math.round(bands.recommended).toLocaleString('en-US');
      const minStr = Math.round(bands.minimum).toLocaleString('en-US');
      let plain;
      if (grade === 'PASS') {
        plain = `${ratedStr} CFM meets the recommended target for this configuration.`;
      } else if (grade === 'MARGINAL') {
        plain = `${ratedStr} CFM clears the minimum but falls short of the ${recStr} CFM recommended target.`;
      } else {
        plain = `${ratedStr} CFM is below the ${minStr} CFM minimum for this configuration.`;
      }
      return {
        grade,
        plain,
        clauseRef: 'model criterion: ≥ recommended PASS · ≥ minimum MARGINAL — RB-008',
        detail: `Rated CFM ${ratedStr} vs. this configuration's bands (minimum ${minStr}, recommended ${recStr}) — model-criterion thresholds; minimum from RB-008, recommended layers this site's own exposure-multiplier assumption on top.`,
      };
    },

    // --- W5-T6 (UX P1-6): "carry-away" copy-spec-line button --------------
    // The engine calls this with its own get()/ctx.physics — see viz.mjs's
    // copyLine block. `href` is read from `location` right here (the one
    // DOM touch), then handed to the pure, node-testable buildSpecLine().
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

  // --- "CHECK A HOOD" section --------------------------------------------
  // The engine (createInstrument) renders every spec.controls entry into
  // one shared fieldset, so 'i02-rated' lands there like a fifth spec
  // input. It isn't one: it doesn't drive requiredCfm() and is entirely
  // optional. The engine has no grouping hook for this (same situation
  // i08.mjs is in for its disabled-control styling), so — same established
  // pattern — reach into the DOM post-mount and move that one control's
  // wrap into its own labeled <fieldset>, positioned after the readouts so
  // it reads as "now check a candidate hood against the numbers above."
  const article = container.querySelector('.ovs-i-instrument');
  const ratedLabel = article && article.querySelector('label[for="i02-rated"]');
  const ratedWrap = ratedLabel && ratedLabel.closest('.ovs-i-control');
  if (article && ratedWrap) {
    const section = document.createElement('fieldset');
    section.className = 'ovs-i-check-hood';
    const legend = document.createElement('legend');
    legend.className = 'ovs-i-check-hood-legend';
    legend.textContent = 'CHECK A HOOD';
    section.appendChild(legend);
    const note = document.createElement('p');
    note.className = 'ovs-i-check-hood-note';
    note.textContent = "Optional — enter a candidate hood's rated CFM to see how it compares to the bands above. Doesn't change them.";
    section.appendChild(note);
    ratedWrap.classList.add('ovs-i-check-hood-control');
    section.appendChild(ratedWrap); // moves it out of the main controls fieldset
    const foot = article.querySelector('.ovs-i-verdict-foot');
    if (foot) article.insertBefore(section, foot);
    else article.appendChild(section);
  }
}
