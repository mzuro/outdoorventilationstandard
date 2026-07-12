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
//   - verdict: SKIPPED, documented. NOTE: this is a deliberate DEVIATION
//     from the plan (docs/superpowers/plans/2026-07-12-v2.1-fun-physics.md
//     lists i02 among the verdict instruments: "verdict: i01/i02/i05/i07/
//     i08"). The deviation is the implementer's own call, on these merits:
//     this instrument has no "installed/actual CFM" control — only the
//     three physics bands (minimum, recommended, high-wind) computed FOR
//     the configured hood. A PASS/FAIL stamp needs an actual airflow to
//     grade against those bands, and every framing available from the
//     current control set would be untruthful: grading the tool's own
//     recommended output against its own recommended band is a tautology
//     (always PASS); assuming the user's blower delivers the minimum (or
//     any other number) fabricates an input the user never supplied. Both
//     are less truthful than presenting the three bands as-is, which is
//     already the complete, honest answer this instrument gives — so no
//     spec.verdict is wired here. A non-tautological verdict would need a
//     new user-entered "rated CFM" control graded on the recommended-met
//     basis; that is a design change deferred to a future task, not
//     something this rollout invents.
//   - smoke: not assigned to this instrument by the plan (it has no plume
//     elevation to visualize).

import { createInstrument } from '../viz.mjs';
import { requiredCfm } from '../physics/cfm.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const AXIS_MAX_CFM = 3500;

// Local formatter (brief: extend fmt ONLY here, not in the engine):
// 60000 -> "60k BTU".
const fmtBtu = (btu) => `${Math.round(btu / 1000)}k BTU`;

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
  const ROWS = [
    { key: 'minimum', label: 'MINIMUM', y: 64 },
    { key: 'recommended', label: 'RECOMMENDED', y: 124 },
    { key: 'highWind', label: 'HIGH-WIND', y: 184 },
  ];
  const BAR_H = 22;
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
    svg.setAttribute('viewBox', '0 0 720 270');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Bar chart of the three airflow bands — minimum, recommended, and high-wind CFM — on a 0 to 3,500 CFM axis.');

    // axis + gridlines at every 500 CFM
    const axis = H.el('g');
    axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: X0, y1: AXIS_Y, x2: X1, y2: AXIS_Y }));
    for (let cfm = 0; cfm <= AXIS_MAX_CFM; cfm += 500) {
      const x = xFor(cfm);
      axis.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: x, y1: 30, x2: x, y2: AXIS_Y, opacity: 0.25 }));
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
    ],
    readouts: [
      { id: 'recommended', label: 'RECOMMENDED', format: 'cfm', hero: true },
      { id: 'minimum', label: 'MINIMUM', format: 'cfm' },
      { id: 'highWind', label: 'HIGH-WIND', format: 'cfm' },
    ],
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

    // No spec.verdict: see the header comment — this instrument has no
    // installed/actual-CFM input to grade a stamp against.
  };

  // Exposed on the figure element so the shared "Explain this
  // configuration" button (partials/instrument-figure.html,
  // static/js/ovs/explain-ui.mjs) can read the live control state via
  // .get() without this module knowing anything about that feature.
  figureEl.ovsInstrument = createInstrument(container, spec);
}
