// ovs-viz — the single DOM layer for all OVS instruments (Tasks 14-16).
//
// This module must import cleanly under plain node (no `document`/`window`)
// so the pure helpers below can be unit-tested without a DOM. Every access
// to a global browser API is therefore guarded.
//
// v2.1 (F1) additive layers — all opt-in via new spec keys, so instruments
// not yet migrated keep working unchanged:
//   spec.smoke(state)   -> geomState|null  (living-smoke visualization)
//   spec.drag[]         -> direct manipulation of scene handles
//   spec.presets[]      -> one-tap story chips (animated via the same tweens)
//   spec.verdict(state, physics) -> PASS/MARGINAL/FAIL rubber-stamp on settle

import { createSmokeField } from './smoke.mjs';

const TWEEN_MS = 200;

const SVG_NS = 'http://www.w3.org/2000/svg';

// keyword drag targets -> the hit-strip class the instrument scene draws
const DRAG_SELECTORS = {
  'hood-edge': '.ovs-i-drag-hood-edge',
  'wind-arrow': '.ovs-i-drag-wind',
  'hood-height': '.ovs-i-drag-height',
};

/**
 * Grade a capture fraction into a standards verdict. Pure. Default
 * thresholds per the plan: >=0.85 PASS, 0.60-0.85 MARGINAL, <0.60 FAIL.
 * Instruments on a different basis (e.g. CFM recommended-met) pass their
 * own thresholds.
 */
export function gradeCapture(capFrac, { pass = 0.85, marginal = 0.6 } = {}) {
  if (capFrac >= pass) return 'PASS';
  if (capFrac >= marginal) return 'MARGINAL';
  return 'FAIL';
}

/**
 * Which preset (if any) the committed `state` currently equals — for the
 * chip active-state. Every control listed in a preset must match (string-
 * compared so segmented literals and numeric ranges compare uniformly).
 * Pure. Returns the preset id or null.
 */
export function presetActiveId(presets, state) {
  for (const p of presets || []) {
    let match = true;
    for (const [id, val] of Object.entries(p.state || {})) {
      if (String(state[id]) !== String(val)) { match = false; break; }
    }
    if (match) return p.id;
  }
  return null;
}

/** Linear interpolation. Pure. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Tween progress at time `now` for a tween started at `start`, clamped to
 * [0, 1]. Pure. The low clamp matters: a rAF timestamp can predate the
 * performance.now() captured when the tween started (observed as low as
 * -2.6 ms on the first frame), which would otherwise leak t < 0 into
 * lerp()/update().
 */
export function tweenProgress(now, start, dur = TWEEN_MS) {
  return Math.min(1, Math.max(0, (now - start) / dur));
}

/** Format a numeric value for a readout/control-bubble. Pure, tabular-safe. */
export function fmt(value, spec) {
  switch (spec) {
    case 'pct': return `${Math.round(value * 100)}%`;
    case 'cfm': return `${Math.round(value).toLocaleString('en-US')} CFM`;
    case 'in': return `${Math.round(value)}″`;
    case 'fpm': return `${Math.round(value)} fpm`;
    case 'mph': return `${Math.round(value)} mph`;
    default: return String(Math.round(value));
  }
}

const hasDom = typeof document !== 'undefined' && typeof window !== 'undefined';

function prefersReducedMotion() {
  if (!hasDom || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Create a DOM element with attributes, for use inside `spec.scene`. */
function el(tag, attrs) {
  const isSvgTag = SVG_TAGS.has(tag);
  const node = isSvgTag
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    }
  }
  return node;
}

const SVG_TAGS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
  'polygon', 'text', 'tspan', 'defs', 'use', 'marker',
]);

/** A dimension line: main line + two end ticks + centered label, OVS figure style. */
function dimensionLine(x1, y1, x2, y2, label) {
  const g = el('g', { class: 'ovs-i-dim' });
  const tickLen = 6;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // unit normal to the line, for the end ticks
  const nx = -dy / len, ny = dx / len;
  g.appendChild(el('line', {
    class: 'ovs-i-dim-line', x1, y1, x2, y2,
  }));
  g.appendChild(el('line', {
    class: 'ovs-i-dim-tick',
    x1: x1 - nx * tickLen / 2, y1: y1 - ny * tickLen / 2,
    x2: x1 + nx * tickLen / 2, y2: y1 + ny * tickLen / 2,
  }));
  g.appendChild(el('line', {
    class: 'ovs-i-dim-tick',
    x1: x2 - nx * tickLen / 2, y1: y2 - ny * tickLen / 2,
    x2: x2 + nx * tickLen / 2, y2: y2 + ny * tickLen / 2,
  }));
  if (label != null) {
    g.appendChild(el('text', {
      class: 'ovs-i-dim-label',
      x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 6,
      'text-anchor': 'middle', text: label,
    }));
  }
  return g;
}

/** A bordered annotation box with text, OVS figure style. */
function noteBox(x, y, text) {
  const g = el('g', { class: 'ovs-i-notebox' });
  const t = el('text', {
    class: 'ovs-i-notebox-text', x: x + 6, y: y + 14, text,
  });
  g.appendChild(el('rect', {
    class: 'ovs-i-notebox-rect', x, y, width: 4 + text.length * 6.2, height: 20,
  }));
  g.appendChild(t);
  return g;
}

const HELPERS = { el, dimensionLine, noteBox };

function makeControl(control) {
  const wrap = document.createElement('div');
  wrap.className = 'ovs-i-control';

  const label = document.createElement('label');
  label.className = 'ovs-i-control-label';
  const labelText = document.createElement('span');
  labelText.className = 'ovs-i-control-label-text';
  labelText.textContent = control.label;
  label.appendChild(labelText);

  let output = null;
  if (control.type === 'range') {
    // `for` only makes sense pointing at a single input; a segmented
    // control's label instead gets linked via aria-labelledby below.
    label.setAttribute('for', control.id);
    output = document.createElement('output');
    output.className = 'ovs-i-bubble';
    output.setAttribute('for', control.id);
    label.appendChild(output);
  }
  wrap.appendChild(label);

  let input;
  const bag = { wrap, label, output, radios: null };

  if (control.type === 'range') {
    input = document.createElement('input');
    input.type = 'range';
    input.className = 'ovs-i-range';
    input.id = control.id;
    if (control.min != null) input.min = String(control.min);
    if (control.max != null) input.max = String(control.max);
    if (control.step != null) input.step = String(control.step);
    input.value = String(control.value);

    if (control.detents && control.detents.length) {
      const listId = `${control.id}-detents`;
      const datalist = document.createElement('datalist');
      datalist.id = listId;
      datalist.className = 'ovs-i-detents';
      for (const d of control.detents) {
        const opt = document.createElement('option');
        opt.value = String(d);
        datalist.appendChild(opt);
      }
      input.setAttribute('list', listId);
      wrap.appendChild(input);
      wrap.appendChild(datalist);
    } else {
      wrap.appendChild(input);
    }
    bag.input = input;
  } else if (control.type === 'segmented') {
    const group = document.createElement('div');
    group.className = 'ovs-i-segmented';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-labelledby', `${control.id}-label`);
    labelText.id = `${control.id}-label`;
    const radios = [];
    (control.options || []).forEach((opt, i) => {
      const optId = `${control.id}-${i}`;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = control.id;
      radio.id = optId;
      radio.value = String(opt.value);
      radio.className = 'ovs-i-segmented-input';
      if (opt.value === control.value) radio.checked = true;
      const segLabel = document.createElement('label');
      segLabel.className = 'ovs-i-segmented-label';
      segLabel.setAttribute('for', optId);
      segLabel.textContent = opt.label != null ? opt.label : String(opt.value);
      group.appendChild(radio);
      group.appendChild(segLabel);
      radios.push(radio);
    });
    wrap.appendChild(group);
    bag.radios = radios;
    bag.group = group;
  }

  return bag;
}

/**
 * Create an instrument mounted into `rootEl` per `spec`.
 * Returns { set(id, value), get(), destroy() }.
 *
 * Guarded so this factory is a harmless no-op object under plain node
 * (no DOM) — only the pure helpers above need to run there.
 */
export function createInstrument(rootEl, spec) {
  if (!hasDom || !rootEl) {
    // No DOM (node test run) or no mount point: return the documented
    // shape as an inert no-op so callers don't need to branch.
    return { set() {}, get() { return {}; }, destroy() {} };
  }

  const reduced = prefersReducedMotion();

  const state = {}; // committed/target numeric or literal values, keyed by control id
  const displayed = {}; // currently-displayed (possibly tweened) values

  for (const c of spec.controls || []) {
    state[c.id] = c.value;
    displayed[c.id] = c.value;
  }

  rootEl.innerHTML = '';
  rootEl.classList.add('ovs-i');

  const article = document.createElement('div');
  article.className = 'ovs-i-instrument';
  if (spec.id) article.dataset.instrument = spec.id;

  if (spec.title) {
    const h = document.createElement('h2');
    h.className = 'ovs-i-title';
    h.textContent = spec.title;
    article.appendChild(h);
  }

  const svgWrap = document.createElement('div');
  svgWrap.className = 'ovs-i-scene';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'ovs-i-svg');
  svgWrap.appendChild(svg);
  article.appendChild(svgWrap);

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'ovs-i-controls';
  if (spec.title) {
    const legend = document.createElement('legend');
    legend.className = 'ovs-i-legend';
    legend.textContent = `${spec.title} controls`;
    fieldset.appendChild(legend);
  }

  const controlBags = new Map();
  const listeners = []; // { target, type, handler } for destroy()

  for (const c of spec.controls || []) {
    const bag = makeControl(c);
    fieldset.appendChild(bag.wrap);
    controlBags.set(c.id, bag);

    if (c.type === 'range') {
      const handler = () => handleChange(c.id, Number(bag.input.value));
      bag.input.addEventListener('input', handler);
      listeners.push({ target: bag.input, type: 'input', handler });
      if (bag.output) bag.output.textContent = c.unit ? `${c.value} ${c.unit}` : String(c.value);
    } else if (c.type === 'segmented') {
      for (const radio of bag.radios) {
        const handler = () => { if (radio.checked) handleChange(c.id, radio.value); };
        radio.addEventListener('change', handler);
        listeners.push({ target: radio, type: 'change', handler });
      }
    }
  }
  article.appendChild(fieldset);

  const readoutsWrap = document.createElement('div');
  readoutsWrap.className = 'ovs-i-readouts';
  const readoutEls = new Map();
  for (const r of spec.readouts || []) {
    const row = document.createElement('div');
    row.className = r.hero ? 'ovs-i-readout ovs-i-readout--hero' : 'ovs-i-readout';
    const label = document.createElement('span');
    label.className = 'ovs-i-readout-label';
    label.id = `${r.id}-label`;
    label.textContent = r.label;
    const output = document.createElement('output');
    output.className = 'ovs-i-readout-value';
    output.setAttribute('aria-live', 'polite');
    output.setAttribute('aria-labelledby', `${r.id}-label`);
    row.appendChild(label);
    row.appendChild(output);
    readoutsWrap.appendChild(row);
    readoutEls.set(r.id, { el: output, format: r.format });
  }
  article.appendChild(readoutsWrap);

  rootEl.appendChild(article);

  // ---- W5-T2 sticky mobile readout strip (opt-in via spec.stickyReadout) --
  // At narrow widths an instrument stack is ~2 viewports tall, so a control
  // change updates readouts the user cannot see. While the instrument is in
  // the viewport at <=760px, a one-line fixed strip pinned to the viewport
  // bottom mirrors the named readouts (+ the verdict grade when the
  // instrument has one). It NEVER computes anything: setReadout() copies the
  // exact formatted string it just wrote into the real readout, and
  // updateVerdict() copies the exact grade — physics-honest by construction.
  // aria-hidden: the real readouts already announce via aria-live; the strip
  // must not double-announce. position:fixed overlays content — CLS 0.
  let strip = null;
  let stripIo = null;
  let stripMq = null;
  let stripMqHandler = null;
  const stripCells = new Map(); // readout id -> value <span>
  let stripGrade = null;
  if (
    Array.isArray(spec.stickyReadout) && spec.stickyReadout.length
    && typeof IntersectionObserver === 'function'
    && typeof window.matchMedia === 'function'
  ) {
    strip = document.createElement('div');
    strip.className = 'ovs-i-strip';
    strip.setAttribute('aria-hidden', 'true');
    strip.hidden = true;
    for (const rid of spec.stickyReadout) {
      const r = (spec.readouts || []).find((x) => x.id === rid);
      if (!r) continue;
      const cell = document.createElement('span');
      cell.className = 'ovs-i-strip-cell';
      const lab = document.createElement('span');
      lab.className = 'ovs-i-strip-label';
      lab.textContent = r.label;
      const val = document.createElement('span');
      val.className = 'ovs-i-strip-value';
      cell.appendChild(lab);
      cell.appendChild(val);
      strip.appendChild(cell);
      stripCells.set(rid, val);
    }
    if (typeof spec.verdict === 'function') {
      stripGrade = document.createElement('span');
      stripGrade.className = 'ovs-i-strip-grade';
      strip.appendChild(stripGrade);
    }
    document.body.appendChild(strip);

    stripMq = window.matchMedia('(max-width: 760px)');
    let stripInView = false;
    const syncStrip = () => { strip.hidden = !(stripInView && stripMq.matches); };
    stripIo = new IntersectionObserver((entries) => {
      stripInView = entries.some((e) => e.isIntersecting);
      syncStrip();
    }, { threshold: 0 });
    stripIo.observe(article);
    stripMqHandler = syncStrip;
    if (stripMq.addEventListener) stripMq.addEventListener('change', stripMqHandler);
    else if (stripMq.addListener) stripMq.addListener(stripMqHandler);
  }

  function setReadout(id, value) {
    const r = readoutEls.get(id);
    if (!r) return;
    r.el.textContent = fmt(value, r.format);
    // Mirror the SAME formatted string into the sticky strip (W5-T2) —
    // never a recomputation, so the strip cannot disagree with the readout.
    const cell = stripCells.get(id);
    if (cell) cell.textContent = r.el.textContent;
  }

  const ctx = { svg, setReadout, reduced, physics: null };

  if (typeof spec.scene === 'function') {
    spec.scene(svg, HELPERS);
  }

  // ---- v2.1 smoke layer (opt-in via spec.smoke) --------------------------
  let smokeField = null;
  let smokeVisible = true;
  let io = null;
  let visHandler = null;
  if (typeof spec.smoke === 'function') {
    const g0 = spec.smoke(currentNumericState());
    if (g0) {
      const group = document.createElementNS(SVG_NS, 'g');
      group.setAttribute('class', 'ovs-i-smoke-layer');
      // Sit the smoke with the plume, beneath the hood: the instrument marks
      // an insertion point with .ovs-i-smoke-mount; otherwise append on top.
      const mount = svg.querySelector('.ovs-i-smoke-mount') || svg;
      mount.appendChild(group);
      smokeField = createSmokeField(group, {
        sourceX: g0.sourceX, sourceY: g0.sourceY, pxPerIn: g0.pxPerIn,
      });
      smokeField.setReduced(reduced);
      smokeField.update(g0);
    }
  }

  function smokeShouldRun() {
    return !!smokeField && !reduced && smokeVisible && !(hasDom && document.hidden);
  }

  let rafId = null;
  // Per-control tween state: id → { from, start }. Each control keeps its
  // own origin and clock so a change on one control never resets another's
  // in-flight tween. A single shared rAF loop services all of them.
  const tweens = new Map();

  function nowMs() {
    return window.performance ? window.performance.now() : Date.now();
  }

  function currentNumericState() {
    const snapshot = {};
    for (const c of spec.controls || []) {
      snapshot[c.id] = c.type === 'range' ? displayed[c.id] : state[c.id];
    }
    return snapshot;
  }

  function runUpdate() {
    const st = currentNumericState();
    if (typeof spec.update === 'function') spec.update(st, ctx);
    if (smokeField && typeof spec.smoke === 'function') {
      const gs = spec.smoke(st);
      if (gs) smokeField.update(gs);
    }
    // W5-T3: keep the visible drag grips glued to their (just re-measured)
    // hit strips / grip anchors.
    positionGrips();
  }

  function refreshBubble(id) {
    const c = (spec.controls || []).find((ctrl) => ctrl.id === id);
    const bag = controlBags.get(id);
    if (!c || !bag || !bag.output) return;
    const val = Math.round(displayed[id]);
    bag.output.textContent = c.unit ? `${val} ${c.unit}` : String(val);
  }

  function tick(now) {
    const hadTweens = tweens.size > 0;
    if (hadTweens) {
      for (const [id, tween] of tweens) {
        const t = tweenProgress(now, tween.start);
        const to = state[id];
        displayed[id] = t >= 1 ? to : lerp(tween.from, to, t);
        refreshBubble(id);
        if (t >= 1) tweens.delete(id);
      }
      runUpdate();
    }
    // Living smoke rides the SAME single rAF (Global Constraint: one rAF).
    if (smokeShouldRun()) smokeField.frame(now);
    // One orchestrated moment: the verdict re-stamps only when motion settles.
    if (hadTweens && tweens.size === 0) settle();
    if (tweens.size > 0 || smokeShouldRun()) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function ensureRaf() {
    if (rafId == null && (tweens.size > 0 || smokeShouldRun())) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function startTween(id) {
    if (reduced) {
      // No tween: snap displayed to target, single update call, instant stamp.
      displayed[id] = state[id];
      refreshBubble(id);
      runUpdate();
      settle();
      return;
    }
    if (displayed[id] === state[id]) {
      // Already at the target: nothing to animate, just repaint.
      tweens.delete(id);
      if (rafId == null) runUpdate();
      ensureRaf();
      return;
    }
    // (Re)start THIS control's tween from its current displayed position;
    // other controls' in-flight tweens keep their own origin and clock.
    tweens.set(id, { from: displayed[id], start: nowMs() });
    ensureRaf();
  }

  function clampToControl(c, value) {
    let v = Number(value);
    if (!Number.isFinite(v)) v = state[c.id];
    if (c.min != null) v = Math.max(Number(c.min), v);
    if (c.max != null) v = Math.min(Number(c.max), v);
    return v;
  }

  function handleChange(id, value) {
    const c = (spec.controls || []).find((ctrl) => ctrl.id === id);
    if (!c) return;
    if (c.type === 'range') {
      state[id] = clampToControl(c, value);
      startTween(id);
    } else {
      // Non-numeric (segmented) values switch instantly: a single update call.
      state[id] = value;
      displayed[id] = value;
      runUpdate();
      settle();
      ensureRaf();
    }
    // Preset-active tracks the COMMITTED state and must recompute on every
    // change, never wait for settle(): a held drag re-arms tweens on each
    // pointermove, so a settle-gated recompute would keep a stale chip
    // asserted through the whole sweep. Cheap string comparison per change.
    // The verdict-stamp slam stays settle-gated on purpose (one orchestrated
    // moment at rest, not a re-slam per pointermove).
    updatePresetActive();
  }

  // ---- v2.1 preset chips (opt-in via spec.presets) -----------------------
  const presetChips = new Map();
  if (Array.isArray(spec.presets) && spec.presets.length) {
    const row = document.createElement('div');
    row.className = 'ovs-i-presets';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Try a scenario');
    // W5-T3 (UX P1-2): a visible "TRY:" row label so the chips read as
    // invitations, not metadata tags.
    const rowLabel = document.createElement('span');
    rowLabel.className = 'ovs-i-presets-label';
    rowLabel.textContent = 'TRY:';
    row.appendChild(rowLabel);
    for (const preset of spec.presets) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ovs-i-preset';
      chip.textContent = preset.label;
      chip.dataset.presetId = preset.id;
      const handler = () => applyPreset(preset);
      chip.addEventListener('click', handler);
      listeners.push({ target: chip, type: 'click', handler });
      row.appendChild(chip);
      presetChips.set(preset.id, chip);
    }
    // Chips sit above the controls (below the scene), so the story leads.
    article.insertBefore(row, fieldset);
  }

  function applyPreset(preset) {
    const entries = Object.entries(preset.state || {});
    entries.forEach(([id, val], idx) => {
      // Staggered so the controls animate to the scenario one after another
      // (each control tweens itself via the engine). Instant under reduced.
      if (reduced) set(id, val);
      else window.setTimeout(() => set(id, val), idx * 60);
    });
  }

  function updatePresetActive() {
    if (!presetChips.size) return;
    const active = presetActiveId(spec.presets, get());
    for (const [id, chip] of presetChips) {
      const on = id === active;
      chip.classList.toggle('ovs-i-preset--active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  // ---- v2.1 verdict stamp (opt-in via spec.verdict) ----------------------
  let stampEl = null;
  if (typeof spec.verdict === 'function') {
    stampEl = document.createElement('div');
    stampEl.className = 'ovs-i-stamp';
    stampEl.setAttribute('aria-live', 'polite');
    // Positioned over the scene; svgWrap is the positioning context.
    svgWrap.appendChild(stampEl);

    // W5-T3 (UX P1-3): a graded instrument also carries a static visible
    // footnote so PASS can never read as product certification. Wording per
    // the v2.2 UX report.
    const foot = document.createElement('p');
    foot.className = 'ovs-i-verdict-foot';
    foot.textContent = 'Grades apply to the model configuration, not to any product.';
    article.appendChild(foot);
  }

  function updateVerdict(animate) {
    if (!stampEl) return;
    const v = spec.verdict(get(), ctx.physics);
    // Mirror the exact grade into the sticky strip (W5-T2) before any early
    // return, so strip and stamp can never disagree.
    if (stripGrade) {
      if (v && v.grade) {
        stripGrade.hidden = false;
        stripGrade.textContent = v.grade;
        stripGrade.dataset.grade = v.grade;
      } else {
        stripGrade.hidden = true;
      }
    }
    if (!v || !v.grade) { stampEl.hidden = true; return; }
    stampEl.hidden = false;
    stampEl.dataset.grade = v.grade;
    stampEl.replaceChildren();
    const g = document.createElement('span');
    g.className = 'ovs-i-stamp-grade';
    g.textContent = v.grade;
    stampEl.appendChild(g);
    // W5-T3 (UX P1-3): the plain-language line renders ON the stamp — the
    // old title-tooltip carried the explanation and (per Tse's rule) no one
    // would ever see it. `plain` is supplied by the instrument's verdict().
    if (v.plain) {
      const p = document.createElement('span');
      p.className = 'ovs-i-stamp-plain';
      p.textContent = v.plain;
      stampEl.appendChild(p);
    }
    if (v.clauseRef) {
      const c = document.createElement('span');
      c.className = 'ovs-i-stamp-clause';
      c.textContent = v.clauseRef;
      stampEl.appendChild(c);
    }
    if (v.detail) stampEl.title = v.detail;
    if (animate && !reduced) {
      // Restart the slam: remove, force reflow, re-add.
      stampEl.classList.remove('ovs-i-stamp--slam');
      void stampEl.offsetWidth;
      stampEl.classList.add('ovs-i-stamp--slam');
    }
  }

  function settle() {
    // Verdict only. Preset-active is handled per-change in handleChange();
    // gating it here would leave a stale chip asserted through a held drag.
    updateVerdict(true);
  }

  // ---- v2.1 direct manipulation (opt-in via spec.drag) -------------------
  const dragCleanups = [];

  // ---- W5-T3 (UX P1-1): visible drag handles ------------------------------
  // The hit strips are transparent, so on touch there was ZERO indication a
  // drag exists ("unless users have prior knowledge that a gesture exists,
  // they won't try"). Every wired drag target now gets a small grip glyph —
  // a pad with three grip ticks, in the site's dimension-line drawing
  // language — always visible, engine-positioned after every update().
  // Default anchor: the center of the hit strip's authored geometry (the
  // instruments re-measure the strips live, so this tracks hood lips and
  // measuring lines for free). Drags whose visual anchor is NOT the strip
  // center (wind-arrow tips, i06's tracer dot) supply spec.drag[].grip:
  // (state) => ({x, y}) in viewBox coordinates. pointer-events:none — the
  // strip beneath still takes the pointer; aria-hidden — the grip
  // duplicates the sliders, which remain the accessible path.
  const grips = [];
  function makeGripGlyph(axis) {
    const g = el('g', { class: 'ovs-i-grip', 'aria-hidden': 'true' });
    // rotation and hint-pulse animation live on separate nested groups so
    // the CSS pulse (a transform) can never clobber the rotate.
    const rot = el('g', axis === 'y' ? { transform: 'rotate(90)' } : {});
    const inner = el('g', { class: 'ovs-i-grip-inner' });
    inner.appendChild(el('rect', {
      class: 'ovs-i-grip-pad', x: -10, y: -13, width: 20, height: 26, rx: 3,
    }));
    for (const off of [-4.5, 0, 4.5]) {
      inner.appendChild(el('line', {
        class: 'ovs-i-grip-tick', x1: off, y1: -6.5, x2: off, y2: 6.5,
      }));
    }
    rot.appendChild(inner);
    g.appendChild(rot);
    return g;
  }
  function positionGrips() {
    if (!grips.length) return;
    const st = currentNumericState();
    for (const gr of grips) {
      let x;
      let y;
      if (typeof gr.d.grip === 'function') {
        const p = gr.d.grip(st);
        if (!p) continue;
        x = Number(p.x);
        y = Number(p.y);
      } else {
        x = Number(gr.handle.getAttribute('x') || 0) + Number(gr.handle.getAttribute('width') || 0) / 2;
        y = Number(gr.handle.getAttribute('y') || 0) + Number(gr.handle.getAttribute('height') || 0) / 2;
      }
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      gr.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    }
  }
  function clientToUser(evt) {
    if (typeof svg.getScreenCTM !== 'function') return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    return {
      x: inv.a * evt.clientX + inv.c * evt.clientY + inv.e,
      y: inv.b * evt.clientX + inv.d * evt.clientY + inv.f,
    };
  }
  for (const d of spec.drag || []) {
    const sel = DRAG_SELECTORS[d.target] || d.target;
    const handle = svg.querySelector(sel);
    if (!handle) continue;
    handle.classList.add('ovs-i-draggable');
    if (d.cursor) handle.style.cursor = d.cursor;
    // visible grip glyph for this drag target (W5-T3, see above)
    const gripEl = makeGripGlyph(d.axis);
    svg.appendChild(gripEl);
    grips.push({ el: gripEl, handle, d });
    let dragging = false;
    const apply = (evt) => {
      const u = clientToUser(evt);
      const coord = d.axis === 'y' ? u.y : u.x;
      const v = d.toValue(coord, u);
      if (v != null && Number.isFinite(Number(v))) set(d.control, v);
    };
    const onDown = (evt) => {
      dragging = true;
      if (handle.setPointerCapture) { try { handle.setPointerCapture(evt.pointerId); } catch { /* ignore */ } }
      apply(evt);
      evt.preventDefault();
    };
    const onMove = (evt) => { if (dragging) { apply(evt); evt.preventDefault(); } };
    const onUp = (evt) => {
      dragging = false;
      if (handle.releasePointerCapture) { try { handle.releasePointerCapture(evt.pointerId); } catch { /* ignore */ } }
    };
    handle.addEventListener('pointerdown', onDown);
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
    dragCleanups.push(() => {
      handle.removeEventListener('pointerdown', onDown);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
    });
  }

  // W5-T3 (UX P1-1): one-time grip hint pulse on first viewport entry —
  // once per session (sessionStorage), never under reduced motion (the
  // engine skips it AND base.css neutralizes the keyframes).
  if (grips.length && !reduced && typeof IntersectionObserver === 'function') {
    let hinted = false;
    try { hinted = window.sessionStorage.getItem('ovs-grip-hint') === '1'; } catch { /* storage blocked */ }
    if (!hinted) {
      const hintIo = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        hintIo.disconnect();
        try { window.sessionStorage.setItem('ovs-grip-hint', '1'); } catch { /* storage blocked */ }
        for (const gr of grips) gr.el.classList.add('ovs-i-grip--hint');
        window.setTimeout(() => {
          for (const gr of grips) gr.el.classList.remove('ovs-i-grip--hint');
        }, 2000);
      }, { threshold: 0.4 });
      hintIo.observe(svgWrap);
      dragCleanups.push(() => hintIo.disconnect());
    }
  }

  // ---- smoke lifecycle: pause off-viewport and when the tab is hidden ----
  if (smokeField) {
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver((entries) => {
        smokeVisible = entries.some((e) => e.isIntersecting);
        if (smokeVisible) { smokeField.resume(); ensureRaf(); } else { smokeField.pause(); }
      }, { threshold: 0 });
      io.observe(svgWrap);
    }
    visHandler = () => {
      if (document.hidden) { smokeField.pause(); } else if (smokeVisible) { smokeField.resume(); ensureRaf(); }
    };
    document.addEventListener('visibilitychange', visHandler);
  }

  // Initial paint: single update call with the spec's starting values.
  runUpdate();
  updateVerdict(false); // stamp present from the start; no slam on load
  updatePresetActive();
  ensureRaf(); // kick the shared rAF if smoke is live and on-screen

  function set(id, value) {
    const c = (spec.controls || []).find((ctrl) => ctrl.id === id);
    if (!c) return;
    if (c.type === 'range') {
      const bag = controlBags.get(id);
      if (bag && bag.input) {
        bag.input.value = String(value);
        // The browser clamps range inputs to [min, max]; read the post-clamp
        // value back so internal state can never diverge from the visible
        // slider. handleChange clamps again against c.min/c.max for safety.
        value = Number(bag.input.value);
      }
    } else {
      const bag = controlBags.get(id);
      if (bag && bag.radios) {
        for (const radio of bag.radios) radio.checked = radio.value === String(value);
      }
    }
    handleChange(id, value);
  }

  function get() {
    const snapshot = {};
    for (const c of spec.controls || []) snapshot[c.id] = state[c.id];
    return snapshot;
  }

  function destroy() {
    if (rafId != null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (io) { io.disconnect(); io = null; }
    if (stripIo) { stripIo.disconnect(); stripIo = null; }
    if (stripMq && stripMqHandler) {
      if (stripMq.removeEventListener) stripMq.removeEventListener('change', stripMqHandler);
      else if (stripMq.removeListener) stripMq.removeListener(stripMqHandler);
      stripMq = null; stripMqHandler = null;
    }
    if (strip) { strip.remove(); strip = null; }
    if (visHandler) { document.removeEventListener('visibilitychange', visHandler); visHandler = null; }
    if (smokeField) { smokeField.destroy(); smokeField = null; }
    for (const cleanup of dragCleanups) cleanup();
    for (const { target, type, handler } of listeners) {
      target.removeEventListener(type, handler);
    }
    rootEl.innerHTML = '';
  }

  return { set, get, destroy };
}
