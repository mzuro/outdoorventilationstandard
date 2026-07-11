// ovs-viz — the single DOM layer for all OVS instruments (Tasks 14-16).
//
// This module must import cleanly under plain node (no `document`/`window`)
// so the pure helpers below can be unit-tested without a DOM. Every access
// to a global browser API is therefore guarded.

const TWEEN_MS = 200;

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
    const h = document.createElement('h3');
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

  function setReadout(id, value) {
    const r = readoutEls.get(id);
    if (!r) return;
    r.el.textContent = fmt(value, r.format);
  }

  const ctx = { svg, setReadout, reduced };

  if (typeof spec.scene === 'function') {
    spec.scene(svg, HELPERS);
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
    if (typeof spec.update === 'function') spec.update(currentNumericState(), ctx);
  }

  function refreshBubble(id) {
    const c = (spec.controls || []).find((ctrl) => ctrl.id === id);
    const bag = controlBags.get(id);
    if (!c || !bag || !bag.output) return;
    const val = Math.round(displayed[id]);
    bag.output.textContent = c.unit ? `${val} ${c.unit}` : String(val);
  }

  function tick(now) {
    for (const [id, tween] of tweens) {
      const t = tweenProgress(now, tween.start);
      const to = state[id];
      displayed[id] = t >= 1 ? to : lerp(tween.from, to, t);
      refreshBubble(id);
      if (t >= 1) tweens.delete(id);
    }
    runUpdate();
    if (tweens.size > 0) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function startTween(id) {
    if (reduced) {
      // No tween: snap displayed to target and issue a single update call.
      displayed[id] = state[id];
      refreshBubble(id);
      runUpdate();
      return;
    }
    if (displayed[id] === state[id]) {
      // Already at the target: nothing to animate, just repaint.
      tweens.delete(id);
      if (rafId == null) runUpdate();
      return;
    }
    // (Re)start THIS control's tween from its current displayed position;
    // other controls' in-flight tweens keep their own origin and clock.
    tweens.set(id, { from: displayed[id], start: nowMs() });
    if (rafId == null) rafId = window.requestAnimationFrame(tick);
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
    }
  }

  // Initial paint: single update call with the spec's starting values.
  runUpdate();

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
    for (const { target, type, handler } of listeners) {
      target.removeEventListener(type, handler);
    }
    rootEl.innerHTML = '';
  }

  return { set, get, destroy };
}
