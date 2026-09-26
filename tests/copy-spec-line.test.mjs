// W5-T6 (UX P1-6): copy-spec-line "carry-away" button on I-02.
//
// buildSpecLine() is pure and DOM-free (no `location` read inside it — see
// static/js/ovs/instruments/i02.mjs's spec.copyLine, which is the only
// place that touches `location`) so it is directly testable under plain
// node. Every CFM number asserted below comes from calling requiredCfm()
// ourselves, not from a hardcoded guess, so this test cannot silently
// drift from the physics module (../static/js/ovs/physics/cfm.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSpecLine } from '../static/js/ovs/instruments/i02.mjs';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';

const HREF = 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/';

test('buildSpecLine: 48in/wall/60k BTU/moderate — the site baseline (min 1,200 / rec 1,500, tests/cfm.test.mjs)', () => {
  const bands = requiredCfm({ widthIn: 48, mount: 'wall', btu: 60000, exposure: 'moderate' });
  assert.equal(bands.minimum, 1200);
  assert.equal(bands.recommended, 1500);
  const state = { 'i02-width': 48, 'i02-mount': 'wall', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  const line = buildSpecLine(state, bands, HREF);
  assert.equal(
    line,
    '48 in wall · 60k BTU · moderate wind → min 1,200 / rec 1,500 CFM — outdoorventilationstandard.com/questions/what-cfm-do-i-need/ (RB-008)',
  );
});

test('buildSpecLine: 48in/island reflects whatever requiredCfm() actually returns, not a hardcoded guess', () => {
  const state = { 'i02-width': 48, 'i02-mount': 'island', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  const bands = requiredCfm({
    widthIn: state['i02-width'], mount: state['i02-mount'],
    btu: state['i02-btu'], exposure: state['i02-exposure'],
  });
  const line = buildSpecLine(state, bands, HREF);
  // Same formatting convention i02.mjs's own dimension-line code uses
  // (Math.round(cfm).toLocaleString('en-US')) — reused here, not reinvented.
  const minStr = Math.round(bands.minimum).toLocaleString('en-US');
  const recStr = Math.round(bands.recommended).toLocaleString('en-US');
  assert.ok(line.includes(`min ${minStr} / rec ${recStr} CFM`), line);
  assert.ok(line.startsWith('48 in island · 60k BTU · moderate wind'), line);
  // Island carries a real premium over wall at the same width/BTU/exposure
  // — asserting the relationship (not a copied literal) keeps this test
  // physics-honest even if requiredCfm()'s constants ever change.
  const wallBands = requiredCfm({ widthIn: 48, mount: 'wall', btu: 60000, exposure: 'moderate' });
  assert.ok(bands.minimum > wallBands.minimum, 'island minimum should exceed the wall baseline');
});

test('buildSpecLine: a third configuration (60in/wall/90k BTU/exposed) also matches requiredCfm() exactly', () => {
  const state = { 'i02-width': 60, 'i02-mount': 'wall', 'i02-btu': 90000, 'i02-exposure': 'exposed' };
  const bands = requiredCfm({
    widthIn: state['i02-width'], mount: state['i02-mount'],
    btu: state['i02-btu'], exposure: state['i02-exposure'],
  });
  const line = buildSpecLine(state, bands, HREF);
  assert.ok(line.includes('60 in wall'), line);
  assert.ok(line.includes('90k BTU'), line);
  assert.ok(line.includes('exposed wind'), line);
  assert.ok(line.includes(`min ${Math.round(bands.minimum).toLocaleString('en-US')}`), line);
  assert.ok(line.includes(`rec ${Math.round(bands.recommended).toLocaleString('en-US')}`), line);
});

test('buildSpecLine embeds the href it is given, stripped of scheme, and cites RB-008', () => {
  const bands = requiredCfm({ widthIn: 42, mount: 'wall', btu: 30000, exposure: 'sheltered' });
  const state = { 'i02-width': 42, 'i02-mount': 'wall', 'i02-btu': 30000, 'i02-exposure': 'sheltered' };
  const toolLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/tools/cfm-calculator/');
  assert.ok(toolLine.includes('outdoorventilationstandard.com/tools/cfm-calculator/'), toolLine);
  assert.ok(!toolLine.includes('https://'), 'scheme should be dropped from the displayed URL');
  assert.ok(toolLine.endsWith('(RB-008)'), toolLine);
  // A different page embedding the same instrument gets its OWN url — no
  // hardcoded page is baked into the formatter.
  const questionLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/');
  assert.ok(questionLine.includes('/questions/what-cfm-do-i-need/'), questionLine);
  assert.notEqual(toolLine, questionLine);
});

test('buildSpecLine returns null without bands (never fabricates a line before the first update())', () => {
  const state = { 'i02-width': 48, 'i02-mount': 'wall', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  assert.equal(buildSpecLine(state, null, HREF), null);
  assert.equal(buildSpecLine(state, undefined, HREF), null);
});

// --- regression: MAJOR — copied line could mix a committed target value
// with mid-tween physics ----------------------------------------------------
//
// buildSpecLine() itself was never the bug: it is a pure formatter that
// faithfully renders whatever (state, bands) pair it is handed. The bug was
// in viz.mjs's wiring — the click handler called
// `spec.copyLine(get(), ctx.physics)`, where get() returns the committed
// *target* state (set synchronously in handleChange(), before any tween
// runs) while ctx.physics is derived from currentNumericState(), which for
// a `type: 'range'` control is the *currently-tweening* `displayed` value.
// For up to TWEEN_MS (200ms) after a width/BTU change, those two can
// describe different widths — pairing them produced a line whose label and
// CFM numbers described two different configurations.
//
// The fix (viz.mjs, runUpdate()) makes the engine write `ctx.state` and
// `ctx.physics` together, from the exact same currentNumericState()
// snapshot, on every call — so spec.copyLine(ctx.state, ctx.physics) can
// never receive a mismatched pair. The two tests below document that
// contract from both ends: what a mismatched pair would have produced
// (so a future regression is visibly wrong, not silently "fine"), and that
// viz.mjs's source is actually wired to the paired snapshot, not get().
test('buildSpecLine contract: a mismatched (state, bands) pair — as the pre-fix get()+ctx.physics wiring could produce mid-tween — renders a self-inconsistent line', () => {
  // Simulate exactly the pre-fix race: `targetState` is the committed
  // target width (60in, what get() would have returned the instant the
  // slider moved) while `midTweenBands` is requiredCfm() computed for the
  // width the tween was still passing through (42in, what
  // currentNumericState()'s `displayed` value would have been a frame or
  // two into the 200ms tween).
  const targetState = { 'i02-width': 60, 'i02-mount': 'wall', 'i02-btu': 60000, 'i02-exposure': 'moderate' };
  const midTweenBands = requiredCfm({ widthIn: 42, mount: 'wall', btu: 60000, exposure: 'moderate' });
  const correctBands = requiredCfm({ widthIn: 60, mount: 'wall', btu: 60000, exposure: 'moderate' });
  // Precondition: the two widths must actually disagree on CFM, or this
  // test would not be exercising anything.
  assert.notEqual(midTweenBands.minimum, correctBands.minimum);

  const mismatchedLine = buildSpecLine(targetState, midTweenBands, HREF);
  const midMinStr = Math.round(midTweenBands.minimum).toLocaleString('en-US');
  const correctMinStr = Math.round(correctBands.minimum).toLocaleString('en-US');
  // The label says 60in (the target)...
  assert.ok(mismatchedLine.startsWith('60 in wall'), mismatchedLine);
  // ...but the numbers are the 42in figures, not the 60in ones — a line
  // that matches no real hood configuration. This is what buildSpecLine
  // MUST still do given a mismatched pair (it has no way to detect one —
  // it is a pure formatter); guarding against ever constructing this pair
  // is viz.mjs's job, verified in the next test.
  assert.ok(mismatchedLine.includes(`min ${midMinStr}`), mismatchedLine);
  assert.ok(!mismatchedLine.includes(`min ${correctMinStr}`), mismatchedLine);

  // A properly matched pair (both from the same width) never has this
  // problem — this is the invariant the ctx.state/ctx.physics wiring in
  // viz.mjs's runUpdate() upholds by construction.
  const consistentLine = buildSpecLine(targetState, correctBands, HREF);
  assert.ok(consistentLine.includes(`min ${correctMinStr}`), consistentLine);
});

test('viz.mjs wires spec.copyLine to the paired ctx.state/ctx.physics snapshot, never to get() (regression for the MAJOR mid-tween mismatch)', () => {
  // createInstrument() is an inert no-op under plain node (no DOM/rAF), so
  // the mid-tween race cannot be exercised end-to-end here (see viz.mjs's
  // module header and tests/viz.test.mjs's "imports cleanly under node"
  // test for that guard). This source-level check is the next best thing:
  // it pins the exact call shape the fix depends on, so a future refactor
  // that reintroduces `get()` here — silently reopening the race — fails
  // this test instead of shipping unnoticed.
  const vizSrc = readFileSync(new URL('../static/js/ovs/viz.mjs', import.meta.url), 'utf8');
  assert.match(
    vizSrc,
    /spec\.copyLine\(ctx\.state,\s*ctx\.physics\)/,
    'spec.copyLine must be called with the ctx.state/ctx.physics pair written together (same currentNumericState() snapshot) by runUpdate()',
  );
  assert.doesNotMatch(
    vizSrc,
    /spec\.copyLine\(get\(\)/,
    'spec.copyLine must never be called with get() (the committed TARGET state) — pairing it with ctx.physics (which can be mid-tween) is exactly the MAJOR bug this guards against',
  );
});
