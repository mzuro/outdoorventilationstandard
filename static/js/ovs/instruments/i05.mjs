// i05.mjs — Hood Geometry Comparison (Task 15).
//
// Same module contract as i01.mjs/i02.mjs, plus `parsePreset` seeding the
// A side's initial mount/width exactly like i01/i02 — the first
// multi-scene instrument in the suite (A/B), sharing one drawing function
// (`buildSide`/`paintSide`) between the two halves per the brief ("keep it
// simple, reuse one drawing function for both sides"). Physics only from
// ../physics/capture.mjs (captureFraction) — no deflection is drawn here;
// wind only feeds the capture-fraction integral for each side, at a fixed
// 30in rise (matching i01's canonical rise).
//
// v2.1 (F2) adoption — the multi-scene instrument, so several features are
// hand-rolled per side rather than delegated to the single-field engine
// hooks (documented at each site below; no viz.mjs/smoke.mjs changes):
//   - smoke: BOTH mini-scenes. spec.smoke only supports ONE geomState per
//     instrument (one createSmokeField, one rAF-serviced field) — there is
//     no engine capability for a second, independently-parametrized field
//     (side B needs its own mount/width/depth). Rather than patch the
//     engine for a rollout task, this instrument creates its own two
//     createSmokeField instances (imported directly from ../smoke.mjs,
//     same factory the engine uses) and drives them with a small,
//     self-contained lifecycle local to this module: one extra rAF loop
//     (ONE loop services BOTH fields — not two — keeping the "one rAF for
//     smoke" spirit even though the engine's own tween-rAF is a separate,
//     mostly-idle loop here since spec.smoke is unused), one
//     IntersectionObserver on the shared scene wrapper, and a
//     document.hidden listener — mirroring the engine's own smoke
//     lifecycle (viz.mjs's smokeShouldRun/IO/visibilitychange) exactly,
//     because instruments cannot reach the engine's private smokeField to
//     call its pause()/resume() themselves.
//     Particle cap: MAX_PARTICLES (120) is enforced PER FIELD inside
//     smoke.mjs's closure (`particles.length >= MAX_PARTICLES`), not
//     globally across fields — so in principle two fields could reach 240
//     live particles combined. In practice each field's STEADY-STATE
//     count is far below its own cap (smoke.mjs's own comment: "~55 ms ->
//     ~55 live... far under the 120 hard cap"), so the two fields together
//     idle near ~100-110, verified empirically in the F2 puppeteer sweep
//     (counts `.ovs-i-smoke` nodes across both mini-scenes). Documented
//     here per the task's explicit ask to check and record this.
//   - drag: BOTH hood widths (i05-widthA / i05-widthB), 6" snap, via two
//     distinct classes (`.ovs-i-drag-hood-edge-a`/`-b`) passed as raw
//     selectors — the engine's `hood-edge` keyword only maps to a single
//     shared selector, so reusing it twice would make `svg.querySelector`
//     find the same (first) element for both drag entries.
//   - presets: four site-voice A/B scenarios landing exactly on their
//     values.
//   - verdict: TWO small stamps (one per side), per the plan. spec.verdict
//     renders exactly one `.ovs-i-stamp`, positioned by fixed CSS
//     (bottom-right of the whole scene) — insufficient for a per-side
//     stamp under each mini-scene. This instrument builds two stamp
//     elements directly (reusing the same `.ovs-i-stamp` visual language,
//     grade coloring and slam animation via new tiny CSS modifiers
//     `--small`/`--left`/`--right` in components.css) and re-stamps them
//     on a local settle-debounce (220ms of no update() calls — the
//     engine's own settle() is only reachable from inside createInstrument
//     and not exposed to instruments). BOTH the repaint and the slam are
//     settle-gated (F2 review F-2 fix): update() runs on every tween frame
//     and drag pointermove, and the stamps are aria-live, so painting
//     per-frame walked the grades through transient intermediate values
//     mid-tween and streamed mutations to screen readers. The stamps paint
//     once at mount (no slam, matching the engine's updateVerdict(false)
//     on load), then exactly once per settle; under reduced motion there
//     are no tweens (one update() per change), so they repaint immediately
//     per change and never slam — mirroring the engine's own
//     settle()-per-change behavior under reduced motion.

import { createInstrument, gradeCapture } from '../viz.mjs';
import { captureFraction } from '../physics/capture.mjs';
import { plumeRadius } from '../physics/plume.mjs';
import { createSmokeField } from '../smoke.mjs';
import { MOUNT, MODEL_WIDTHS, parsePreset, snapWidth } from '../hood-presets.mjs';

const RISE_IN = 30;
const SAMPLE_STEP_IN = 2;

const STATUS_FILL = {
  ok: null, // fall back to the .ovs-i-plume-fill CSS default
  warn: 'rgba(138, 90, 0, 0.12)',
  fail: 'rgba(180, 35, 24, 0.14)',
};

function statusFor(pct) {
  if (pct >= 90) return 'ok';
  if (pct >= 70) return 'warn';
  return 'fail';
}

// Local formatter (extended only here, per the i02 BTU-bubble precedent):
// a signed percent for the A-B delta, e.g. 0.23 -> "+23%", -0.23 -> "-23%".
const fmtSignedPct = (frac) => `${frac >= 0 ? '+' : ''}${Math.round(frac * 100)}%`;

export function mount(figureEl) {
  if (!figureEl || figureEl.dataset.i05Mounted === '1') return;
  figureEl.dataset.i05Mounted = '1';

  const { mount: mountVal, widthIn } = parsePreset(figureEl.dataset.preset);
  const otherMount = mountVal === 'island' ? 'wall' : 'island';

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
  const CX_A = 190, CX_B = 550;
  const DIVIDER_X = 360;
  const GY = 300; // appliance plane, y (shared)
  const PX_PER_IN = 3.2;
  const TOP_Y = GY - RISE_IN * PX_PER_IN; // hood mouth, y (shared, fixed rise)

  let H = null;
  const refs = {};

  // v2.1 dual-smoke + dual-stamp state (self-contained, see header note).
  const reducedMode = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
    ? (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } })()
    : false;
  let smokeA = null, smokeB = null;
  let smokeVisible = true;
  let smokeRafId = null;
  let io = null, visHandler = null;
  let stampA = null, stampB = null;
  let settleTimer = null;
  let firstPaint = true;
  let lastCapA = 0, lastCapB = 0;

  function buildSide(svg, cx, wallSide, sideKey) {
    const g = H.el('g');

    // appliance line art — fixed size, independent of the width control
    g.appendChild(H.el('line', { class: 'ovs-i-fl', x1: cx - 40, y1: GY, x2: cx + 40, y2: GY }));
    g.appendChild(H.el('rect', { class: 'ovs-i-fl', x: cx - 40, y: GY, width: 80, height: 12 }));

    // wall backdrop (visible only when mount === 'wall'), flanking the
    // outer edge of this mini-scene
    const wallX = wallSide === 'left' ? cx - 130 : cx + 130;
    const wall = H.el('g');
    wall.appendChild(H.el('line', { class: 'ovs-i-fl', x1: wallX, y1: 40, x2: wallX, y2: GY + 12 }));
    for (let y = 50; y <= GY; y += 26) {
      const tickDx = wallSide === 'left' ? 10 : -10;
      wall.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: wallX, y1: y, x2: wallX + tickDx, y2: y + 8 }));
    }
    svg.appendChild(wall);

    const envFill = H.el('path', { class: 'ovs-i-plume-fill', d: '' });
    const envL = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    const envR = H.el('path', { class: 'ovs-i-plume-edge', d: '' });
    svg.appendChild(envFill);
    svg.appendChild(envL);
    svg.appendChild(envR);

    // living-smoke layer mount — over the envelope, under the hood.
    const smokeMount = H.el('g', { class: 'ovs-i-smoke-mount' });
    svg.appendChild(smokeMount);

    const hood = H.el('path', { class: 'ovs-i-hoodfill', d: '' });
    const duct = H.el('rect', { class: 'ovs-i-hoodfill', x: cx - 18, y: TOP_Y - 60, width: 36, height: 26 });
    svg.appendChild(hood);
    svg.appendChild(duct);
    svg.appendChild(g);

    const capLabel = H.el('text', { x: cx, y: 22, 'text-anchor': 'middle', text: '' });
    svg.appendChild(capLabel);

    // drag hit strip: this side's own width, centered on the right hood
    // lip (the envelope here is symmetric/undeflected, unlike i01).
    const dragHood = H.el('rect', {
      class: `ovs-i-drag-hood-edge-${sideKey}`, x: 0, y: TOP_Y - 40, width: 44, height: 92, fill: 'transparent',
    });
    svg.appendChild(dragHood);

    return { cx, wall, envFill, envL, envR, hood, capLabel, smokeMount, dragHood };
  }

  function buildScene(svg, helpers) {
    H = helpers;
    svg.setAttribute('viewBox', '0 0 720 320');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Side-by-side comparison of two hood configurations, A and B, over identical cooking sources, shaded by how much of each plume its hood captures.');

    svg.appendChild(H.el('text', { x: CX_A, y: 48, 'text-anchor': 'middle', text: 'A' }));
    svg.appendChild(H.el('text', { x: CX_B, y: 48, 'text-anchor': 'middle', text: 'B' }));
    svg.appendChild(H.el('line', { class: 'ovs-i-fl-thin', x1: DIVIDER_X, y1: 30, x2: DIVIDER_X, y2: GY + 20, style: 'stroke-dasharray:2 4' }));

    refs.a = buildSide(svg, CX_A, 'left', 'a');
    refs.b = buildSide(svg, CX_B, 'right', 'b');

    // Two independent smoke fields (see header note) — created here so
    // they exist before the engine's first runUpdate() call.
    smokeA = createSmokeField(refs.a.smokeMount, { sourceX: CX_A, sourceY: GY, pxPerIn: PX_PER_IN });
    smokeB = createSmokeField(refs.b.smokeMount, { sourceX: CX_B, sourceY: GY, pxPerIn: PX_PER_IN });
    smokeA.setReduced(reducedMode);
    smokeB.setReduced(reducedMode);
  }

  function paintSide(side, widthIn2, mountVal2, capFrac) {
    side.wall.setAttribute('opacity', mountVal2 === 'wall' ? '1' : '0');

    const hoodHalf = (widthIn2 / 2) * PX_PER_IN;
    const cx = side.cx;
    side.hood.setAttribute('d', `M${(cx - hoodHalf).toFixed(1)} ${TOP_Y} L${(cx + hoodHalf).toFixed(1)} ${TOP_Y} L${cx + 18} ${TOP_Y - 34} L${cx - 18} ${TOP_Y - 34} Z`);
    side.dragHood.setAttribute('x', (cx + hoodHalf - 22).toFixed(1));

    const samples = [];
    for (let z = 0; z <= RISE_IN; z += SAMPLE_STEP_IN) samples.push(z);
    if (samples[samples.length - 1] !== RISE_IN) samples.push(RISE_IN);

    const yAt = (zIn) => GY - zIn * PX_PER_IN;
    const halfWAt = (zIn) => plumeRadius(zIn) * PX_PER_IN;

    let dl = '', dr = '';
    for (let i = 0; i < samples.length; i++) {
      const z = samples[i];
      const hw = halfWAt(z);
      const y = yAt(z);
      const op = i === 0 ? 'M' : 'L';
      dl += `${op}${(cx - hw).toFixed(1)} ${y.toFixed(1)}`;
      dr += `${op}${(cx + hw).toFixed(1)} ${y.toFixed(1)}`;
    }
    side.envL.setAttribute('d', dl);
    side.envR.setAttribute('d', dr);
    let fill = dl;
    for (let i = samples.length - 1; i >= 0; i--) {
      const z = samples[i];
      fill += `L${(cx + halfWAt(z)).toFixed(1)} ${yAt(z).toFixed(1)}`;
    }
    side.envFill.setAttribute('d', `${fill}Z`);
    const status = statusFor(capFrac * 100);
    side.envFill.style.fill = STATUS_FILL[status] || '';

    side.capLabel.textContent = `${widthIn2}″ ${mountVal2} — ${Math.round(capFrac * 100)}% capture`;
  }

  // --- v2.1 dual-smoke lifecycle (see header note) -----------------------
  function smokeShouldRun() {
    return (!!smokeA || !!smokeB) && !reducedMode && smokeVisible
      && !(typeof document !== 'undefined' && document.hidden);
  }
  function smokeTick(now) {
    if (smokeA) smokeA.frame(now);
    if (smokeB) smokeB.frame(now);
    smokeRafId = smokeShouldRun() ? window.requestAnimationFrame(smokeTick) : null;
  }
  function ensureSmokeRaf() {
    if (smokeRafId == null && smokeShouldRun()) smokeRafId = window.requestAnimationFrame(smokeTick);
  }

  // --- v2.1 dual verdict stamps (see header note) -------------------------
  function paintStamp(el, cap) {
    if (!el) return;
    const grade = gradeCapture(cap);
    const pct = Math.round(cap * 100);
    el.dataset.grade = grade;
    el.replaceChildren();
    const g = document.createElement('span');
    g.className = 'ovs-i-stamp-grade';
    g.textContent = grade;
    el.appendChild(g);
    // W5-T3 (UX P1-3): explanation ON the stamp, not in a title tooltip —
    // same plain-line + threshold-line shape the engine renders for
    // spec.verdict instruments.
    const p = document.createElement('span');
    p.className = 'ovs-i-stamp-plain';
    p.textContent = `${pct}% captured in this modeled scene`;
    el.appendChild(p);
    const c = document.createElement('span');
    c.className = 'ovs-i-stamp-clause';
    // The 0.85/0.60 grade bands are this instrument's MODEL CRITERIA — no
    // research bulletin (and no clause on this site) defines PASS/MARGINAL
    // bands, so they are labeled as such rather than attributed. The RB
    // citation is where the capture reasoning lives: RB-005 §4.3 "Island
    // Versus Wall-Mount: A Significant Performance Gap" (content/research/
    // rb-005-hood-geometry-capture.md) — exactly this A/B comparison.
    c.textContent = 'model criterion: ≥85% PASS · ≥60% MARGINAL — RB-005 §4.3';
    el.appendChild(c);
    el.title = `Plume capture ${pct}% — model-criterion thresholds 85% PASS / 60% MARGINAL (capture data: RB-005).`;
  }
  function slamStamp(el) {
    if (!el || reducedMode) return;
    el.classList.remove('ovs-i-stamp--slam');
    void el.offsetWidth;
    el.classList.add('ovs-i-stamp--slam');
  }
  function scheduleStamps() {
    // Repaint AND slam together, settle-gated (see header note / F2 review
    // F-2). Reduced motion: no tweens, one update() per change — paint
    // immediately and statically, never slam (mirrors the engine's
    // settle()-per-change under reduced motion).
    if (reducedMode) {
      paintStamp(stampA, lastCapA);
      paintStamp(stampB, lastCapB);
      return;
    }
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      settleTimer = null;
      paintStamp(stampA, lastCapA);
      paintStamp(stampB, lastCapB);
      slamStamp(stampA);
      slamStamp(stampB);
    }, 220);
  }

  function update(state, ctx) {
    const { setReadout } = ctx;
    const widthA = state['i05-widthA'];
    const widthB = state['i05-widthB'];
    const mountA = MOUNT[state['i05-mountA']] ? state['i05-mountA'] : 'island';
    const mountB = MOUNT[state['i05-mountB']] ? state['i05-mountB'] : 'wall';
    const windMph = state['i05-wind'];

    const capA = captureFraction({
      widthIn: widthA, depthIn: MOUNT[mountA].depthIn, mount: mountA, riseIn: RISE_IN, windMph, panels: 'none',
    });
    const capB = captureFraction({
      widthIn: widthB, depthIn: MOUNT[mountB].depthIn, mount: mountB, riseIn: RISE_IN, windMph, panels: 'none',
    });
    lastCapA = capA;
    lastCapB = capB;

    setReadout('captureA', capA);
    setReadout('captureB', capB);
    const delta = capA - capB;
    setReadout('deltaCapture', delta);
    // Local override to the signed-percent format (brief: "+23%"); the
    // engine's generic 'pct' formatter has already run via setReadout
    // above, so this always wins, mirroring i02's BTU-bubble pattern.
    const deltaEl = container.querySelector('output[aria-labelledby="deltaCapture-label"]');
    if (deltaEl) deltaEl.textContent = fmtSignedPct(delta);

    paintSide(refs.a, widthA, mountA, capA);
    paintSide(refs.b, widthB, mountB, capB);

    if (smokeA) {
      smokeA.update({ widthIn: widthA, depthIn: MOUNT[mountA].depthIn, mount: mountA, riseIn: RISE_IN, windMph, panels: 'none', w0: 400 });
    }
    if (smokeB) {
      smokeB.update({ widthIn: widthB, depthIn: MOUNT[mountB].depthIn, mount: mountB, riseIn: RISE_IN, windMph, panels: 'none', w0: 400 });
    }
    ensureSmokeRaf();

    // Stamps: NOT painted per-frame here (F2 review F-2). The mount-time
    // update() has nothing to paint anyway (stampA/stampB don't exist until
    // the post-mount block below, which paints them once from lastCapA/B —
    // present from the start, no slam on load, matching i01's
    // updateVerdict(false)); every later change settle-debounces to exactly
    // one repaint + one slam per side via scheduleStamps().
    if (firstPaint) firstPaint = false;
    else scheduleStamps();
  }

  const spec = {
    id: 'i05',
    title: 'Hood Geometry Comparison',
    controls: [
      { id: 'i05-widthA', type: 'range', label: 'WIDTH A', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i05-mountA', type: 'segmented', label: 'MOUNT A', value: mountVal,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      { id: 'i05-widthB', type: 'range', label: 'WIDTH B', min: 42, max: 72, step: 6, value: widthIn, unit: 'in', detents: MODEL_WIDTHS },
      {
        id: 'i05-mountB', type: 'segmented', label: 'MOUNT B', value: otherMount,
        options: [{ value: 'wall', label: 'WALL' }, { value: 'island', label: 'ISLAND' }],
      },
      { id: 'i05-wind', type: 'range', label: 'WIND SPEED', min: 0, max: 12, step: 1, value: 8, unit: 'mph' },
    ],
    readouts: [
      { id: 'captureA', label: 'CAPTURE A', format: 'pct', hero: true },
      { id: 'captureB', label: 'CAPTURE B', format: 'pct', hero: true },
      { id: 'deltaCapture', label: 'Δ CAPTURE (A − B)', format: 'pct' },
    ],
    // W5-T2 sticky strip: both sides' hero captures. No spec.verdict here
    // (the dual stamps are custom, see header note), so the strip carries
    // the two values only — copied verbatim by the engine.
    stickyReadout: ['captureA', 'captureB'],
    scene: buildScene,
    update,

    // --- direct manipulation: BOTH hood widths, 6" snap. Two distinct
    //     selectors (see header note) — the `hood-edge` keyword only maps
    //     to one shared selector in the engine. -----------------------------
    drag: [
      {
        target: '.ovs-i-drag-hood-edge-a', control: 'i05-widthA', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(((x - CX_A) * 2) / PX_PER_IN),
      },
      {
        target: '.ovs-i-drag-hood-edge-b', control: 'i05-widthB', axis: 'x', cursor: 'ew-resize',
        toValue: (x) => snapWidth(((x - CX_B) * 2) / PX_PER_IN),
      },
    ],

    // --- story presets: four site-voice A/B scenarios. ---------------------
    presets: [
      { id: 'calm-comparison', label: 'Calm comparison', state: { 'i05-widthA': 48, 'i05-mountA': 'island', 'i05-widthB': 48, 'i05-mountB': 'wall', 'i05-wind': 0 } },
      { id: 'windy-comparison', label: 'Windy comparison', state: { 'i05-widthA': 48, 'i05-mountA': 'island', 'i05-widthB': 48, 'i05-mountB': 'wall', 'i05-wind': 10 } },
      { id: 'undersized-vs-oversized', label: 'Undersized vs. oversized island', state: { 'i05-widthA': 42, 'i05-mountA': 'island', 'i05-widthB': 72, 'i05-mountB': 'island', 'i05-wind': 6 } },
      { id: 'exposed-island-vs-sheltered-wall', label: 'Exposed island vs. sheltered wall', state: { 'i05-widthA': 60, 'i05-mountA': 'island', 'i05-widthB': 42, 'i05-mountB': 'wall', 'i05-wind': 10 } },
    ],

    // No spec.verdict — see the header comment; two stamps are built
    // directly below instead.
  };

  createInstrument(container, spec);

  // --- v2.1: two stamps + this instrument's own smoke visibility lifecycle,
  //     built/wired here (after mount) because they need the scene wrapper
  //     the engine creates internally (`.ovs-i-scene`), which spec.scene
  //     is not handed. ---------------------------------------------------
  const svgWrap = container.querySelector('.ovs-i-scene');
  if (svgWrap) {
    stampA = document.createElement('div');
    stampA.className = 'ovs-i-stamp ovs-i-stamp--small ovs-i-stamp--left';
    stampA.setAttribute('aria-live', 'polite');
    stampB = document.createElement('div');
    stampB.className = 'ovs-i-stamp ovs-i-stamp--small ovs-i-stamp--right';
    stampB.setAttribute('aria-live', 'polite');
    svgWrap.appendChild(stampA);
    svgWrap.appendChild(stampB);
    // Paint immediately with whatever update() already computed at mount
    // (createInstrument's own initial runUpdate() ran before this point,
    // so paintStamp was called above with stampA/stampB still null —
    // repaint once now that the elements exist, from the values update()
    // cached, no re-derivation).
    paintStamp(stampA, lastCapA);
    paintStamp(stampB, lastCapB);

    // W5-T3 (UX P1-3): graded instruments carry the model-configuration
    // footnote. The engine adds this for spec.verdict instruments; this
    // instrument's stamps are custom (no spec.verdict), so it appends the
    // same element itself — identical class and wording.
    const inst = container.querySelector('.ovs-i-instrument');
    if (inst && !inst.querySelector('.ovs-i-verdict-foot')) {
      const foot = document.createElement('p');
      foot.className = 'ovs-i-verdict-foot';
      foot.textContent = 'Grades apply to the model configuration, not to any product.';
      inst.appendChild(foot);
    }

    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver((entries) => {
        smokeVisible = entries.some((e) => e.isIntersecting);
        if (smokeVisible) { if (smokeA) smokeA.resume(); if (smokeB) smokeB.resume(); ensureSmokeRaf(); }
        else { if (smokeA) smokeA.pause(); if (smokeB) smokeB.pause(); }
      }, { threshold: 0 });
      io.observe(svgWrap);
    }
  }
  if (typeof document !== 'undefined') {
    visHandler = () => {
      if (document.hidden) { if (smokeA) smokeA.pause(); if (smokeB) smokeB.pause(); }
      else if (smokeVisible) { if (smokeA) smokeA.resume(); if (smokeB) smokeB.resume(); ensureSmokeRaf(); }
    };
    document.addEventListener('visibilitychange', visHandler);
  }
  ensureSmokeRaf();
}
