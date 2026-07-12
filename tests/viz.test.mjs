import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerp, fmt, tweenProgress, createInstrument, gradeCapture, presetActiveId } from '../static/js/ovs/viz.mjs';

test('lerp', () => { assert.equal(lerp(0, 10, 0.5), 5); assert.equal(lerp(2, 2, 0.9), 2); });
test('tweenProgress clamps to [0, 1]', () => {
  // rAF timestamps can predate the performance.now() captured at tween
  // start (observed as low as -2.6 ms) — negative elapsed must clamp to 0.
  assert.equal(tweenProgress(97.4, 100), 0);
  assert.equal(tweenProgress(100, 100), 0);       // exactly at start
  assert.equal(tweenProgress(200, 100), 0.5);     // mid (default 200 ms)
  assert.equal(tweenProgress(300, 100), 1);       // exactly at end
  assert.equal(tweenProgress(1000, 100), 1);      // past end clamps to 1
  assert.equal(tweenProgress(150, 100, 100), 0.5); // custom duration
});
test('fmt', () => {
  assert.equal(fmt(0.873, 'pct'), '87%');
  assert.equal(fmt(1497.4, 'cfm'), '1,497 CFM');
  assert.equal(fmt(48, 'in'), '48″');
  assert.equal(fmt(5, 'mph'), '5 mph');
});
test('fmt fpm and int/default', () => {
  assert.equal(fmt(123.6, 'fpm'), '124 fpm');
  assert.equal(fmt(7.4, 'int'), '7');
  assert.equal(fmt(7.6, 'nonsense'), '8');
});

test('gradeCapture applies the standards thresholds (>=0.85 PASS, 0.60-0.85 MARGINAL, <0.60 FAIL)', () => {
  assert.equal(gradeCapture(0.95), 'PASS');
  assert.equal(gradeCapture(0.85), 'PASS');       // boundary inclusive
  assert.equal(gradeCapture(0.849), 'MARGINAL');
  assert.equal(gradeCapture(0.60), 'MARGINAL');   // boundary inclusive
  assert.equal(gradeCapture(0.599), 'FAIL');
  assert.equal(gradeCapture(0.1), 'FAIL');
  // custom thresholds (e.g. CFM recommended-met basis)
  assert.equal(gradeCapture(0.75, { pass: 0.7, marginal: 0.5 }), 'PASS');
});

test('presetActiveId matches only when every listed control equals the state', () => {
  const presets = [
    { id: 'calm', state: { 'i01-wind': 0, 'i01-width': 48, 'i01-mount': 'island', 'i01-panels': 'none' } },
    { id: 'breeze', state: { 'i01-wind': 5, 'i01-width': 48, 'i01-mount': 'island', 'i01-panels': 'none' } },
  ];
  assert.equal(presetActiveId(presets, { 'i01-wind': 0, 'i01-width': 48, 'i01-mount': 'island', 'i01-panels': 'none' }), 'calm');
  assert.equal(presetActiveId(presets, { 'i01-wind': 5, 'i01-width': 48, 'i01-mount': 'island', 'i01-panels': 'none' }), 'breeze');
  // string/number equivalence (range values arrive as numbers, presets too)
  assert.equal(presetActiveId(presets, { 'i01-wind': '0', 'i01-width': '48', 'i01-mount': 'island', 'i01-panels': 'none' }), 'calm');
  // one control off -> no active chip
  assert.equal(presetActiveId(presets, { 'i01-wind': 0, 'i01-width': 60, 'i01-mount': 'island', 'i01-panels': 'none' }), null);
});

test('createInstrument imports cleanly under node (no DOM) and no-ops without a rootEl', () => {
  // Under plain node there is no `document`/`window`; calling createInstrument
  // with a null-ish root must not throw so the module stays importable for
  // the pure-helper tests above. It returns the documented shape.
  const inst = createInstrument(null, { id: 'x', title: 'x', controls: [], readouts: [] });
  assert.equal(typeof inst.set, 'function');
  assert.equal(typeof inst.get, 'function');
  assert.equal(typeof inst.destroy, 'function');
  assert.deepEqual(inst.get(), {});
  // set/destroy must be safe no-ops when there is no root
  assert.doesNotThrow(() => inst.set('a', 1));
  assert.doesNotThrow(() => inst.destroy());
});
