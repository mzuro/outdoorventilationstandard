// W5-T6 (UX P1-6): copy-spec-line "carry-away" button on I-02.
//
// buildSpecLine() is pure and DOM-free (no `location` read inside it — see
// static/js/ovs/instruments/i02.mjs's spec.copyLine, which is the only
// place that touches `location`) so it is directly testable under plain
// node. Every CFM number asserted below comes from calling requiredCfm()
// ourselves, not from a hardcoded guess, so this test cannot silently
// drift from the physics module (../static/js/ovs/physics/cfm.mjs); the
// two literal cells are the RB-008 §3.3 / §3.9 rows the module reproduces.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildSpecLine } from '../static/js/ovs/instruments/i02.mjs';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';

const HREF = 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/';

const bandsFor = (state) => requiredCfm({
  src: SOURCES[state['i02-source']],
  riseIn: state['i02-height'],
  mount: state['i02-mount'],
  exposure: state['i02-exposure'],
  panels: state['i02-panels'],
});

test('buildSpecLine: Gas Large / 30 in / wall / moderate — the RB-008 §3.3 flagship (min 892 / blower 1,200)', () => {
  const state = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none', 'i02-width': 48 };
  const bands = bandsFor(state);
  assert.equal(bands.minimum, 892);                                           // rb-008:310
  assert.equal(bands.blower, 1200);                                           // rb-008:310 (blower)
  const line = buildSpecLine(state, bands, HREF);
  assert.equal(
    line,
    '60k gas · 30 in · wall · moderate → min 892 / blower 1,200 CFM — outdoorventilationstandard.com/questions/what-cfm-do-i-need/ (RB-008 §3.3 / App A)',
  );
});

test('buildSpecLine: island → 1,070 / 1,200 (RB-008 §3.9 application example)', () => {
  const state = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'island', 'i02-exposure': 'moderate', 'i02-panels': 'none', 'i02-width': 48 };
  const bands = bandsFor(state);
  assert.equal(bands.minimum, 1070);                                          // rb-008:567
  assert.equal(bands.blower, 1200);                                           // rb-008:565-567
  const line = buildSpecLine(state, bands, HREF);
  assert.ok(line.startsWith('60k gas · 30 in · island · moderate → min 1,070 / blower 1,200 CFM'), line);
});

test('buildSpecLine: the label is the SAME state the numbers were computed for, whatever the source/height/exposure', () => {
  const state = { 'i02-source': 'charcoalKettle', 'i02-height': 36, 'i02-mount': 'peninsula', 'i02-exposure': 'exposed', 'i02-panels': 'both', 'i02-width': 60 };
  const bands = bandsFor(state);
  const line = buildSpecLine(state, bands, HREF);
  assert.ok(line.startsWith('15k charcoal · 36 in · peninsula · exposed + panels → '), line);
  // Same formatting convention i02.mjs's own dimension-line code uses.
  assert.ok(line.includes(`min ${bands.minimum.toLocaleString('en-US')} / blower ${bands.blower.toLocaleString('en-US')} CFM`), line);
  // Exposed WITHOUT panels drops the "+ panels" suffix and moves to K_CFM 5.75.
  const noPanels = { ...state, 'i02-panels': 'none' };
  const np = buildSpecLine(noPanels, bandsFor(noPanels), HREF);
  assert.ok(np.startsWith('15k charcoal · 36 in · peninsula · exposed → '), np);
  assert.ok(bandsFor(noPanels).minimum > bands.minimum, 'no panels needs more (K_CFM 5.75 vs 4.14, rb-008:144-145)');
});

test('buildSpecLine: hood width never changes the line\'s CFM numbers (RB-008 §3.4.3 sizes CFM from Q_c and height, rb-008:381-395; width is the Table 3.10 coverage check, rb-008:580-591)', () => {
  const a = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none', 'i02-width': 42 };
  const b = { ...a, 'i02-width': 72 };
  assert.equal(buildSpecLine(a, bandsFor(a), HREF), buildSpecLine(b, bandsFor(b), HREF));
});

test('buildSpecLine: segmented radio strings ("30") resolve exactly like numbers', () => {
  const num = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none' };
  const str = { ...num, 'i02-height': '30' };
  assert.equal(buildSpecLine(str, bandsFor(num), HREF), buildSpecLine(num, bandsFor(num), HREF));
});

test('buildSpecLine: above the blower ladder the line says so rather than inventing a size', () => {
  const state = { 'i02-source': 'gasHigh', 'i02-height': 48, 'i02-mount': 'island', 'i02-exposure': 'exposed', 'i02-panels': 'none' };
  const bands = bandsFor(state);
  assert.equal(bands.blower, null, 'precondition');
  const line = buildSpecLine(state, bands, HREF);
  assert.ok(line.includes(`min ${bands.minimum.toLocaleString('en-US')} / blower above 3,000 CFM`), line);
});

test('buildSpecLine embeds the href it is given, stripped of scheme, and cites RB-008 §3.3 / App A', () => {
  const state = { 'i02-source': 'gasSmall', 'i02-height': 18, 'i02-mount': 'wall', 'i02-exposure': 'sheltered', 'i02-panels': 'none' };
  const bands = bandsFor(state);
  const toolLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/tools/cfm-calculator/');
  assert.ok(toolLine.includes('outdoorventilationstandard.com/tools/cfm-calculator/'), toolLine);
  assert.ok(!toolLine.includes('https://'), 'scheme should be dropped from the displayed URL');
  assert.ok(toolLine.endsWith('(RB-008 §3.3 / App A)'), toolLine);
  // A different page embedding the same instrument gets its OWN url — no
  // hardcoded page is baked into the formatter.
  const questionLine = buildSpecLine(state, bands, 'https://outdoorventilationstandard.com/questions/what-cfm-do-i-need/');
  assert.ok(questionLine.includes('/questions/what-cfm-do-i-need/'), questionLine);
  assert.notEqual(toolLine, questionLine);
});

test('buildSpecLine returns null without bands (never fabricates a line before the first update())', () => {
  const state = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none' };
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
// *target* state while ctx.physics is derived from currentNumericState(),
// which for a `type: 'range'` control is the *currently-tweening* value.
// (After the Stage B rebuild every CFM input on i02 is segmented — instant
// commit, no tween — and the one remaining range control, width, no longer
// moves CFM at all; the pair can still describe two different SOURCES if
// the wiring regressed, so the contract is kept pinned.)
//
// The fix (viz.mjs, runUpdate()) makes the engine write `ctx.state` and
// `ctx.physics` together, from the exact same currentNumericState()
// snapshot, on every call — so spec.copyLine(ctx.state, ctx.physics) can
// never receive a mismatched pair.
test('buildSpecLine contract: a mismatched (state, bands) pair renders a self-inconsistent line', () => {
  const targetState = { 'i02-source': 'gasLarge', 'i02-height': 30, 'i02-mount': 'wall', 'i02-exposure': 'moderate', 'i02-panels': 'none' };
  const staleState = { ...targetState, 'i02-source': 'gasSmall' };
  const staleBands = bandsFor(staleState);
  const correctBands = bandsFor(targetState);
  assert.notEqual(staleBands.minimum, correctBands.minimum);

  const mismatchedLine = buildSpecLine(targetState, staleBands, HREF);
  const staleMinStr = staleBands.minimum.toLocaleString('en-US');
  const correctMinStr = correctBands.minimum.toLocaleString('en-US');
  // The label says 60k gas (the target)...
  assert.ok(mismatchedLine.startsWith('60k gas'), mismatchedLine);
  // ...but the numbers are the 25k figures — a line that matches no real
  // configuration. buildSpecLine MUST still do this given a mismatched
  // pair (it is a pure formatter); guarding against ever constructing the
  // pair is viz.mjs's job, verified in the next test.
  assert.ok(mismatchedLine.includes(`min ${staleMinStr}`), mismatchedLine);
  assert.ok(!mismatchedLine.includes(`min ${correctMinStr}`), mismatchedLine);

  const consistentLine = buildSpecLine(targetState, correctBands, HREF);
  assert.ok(consistentLine.includes(`min ${correctMinStr}`), consistentLine);
});

test('viz.mjs wires spec.copyLine to the paired ctx.state/ctx.physics snapshot, never to get() (regression for the MAJOR mid-tween mismatch)', () => {
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
