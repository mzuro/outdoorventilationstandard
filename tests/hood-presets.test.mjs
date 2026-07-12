import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOUNT, MODEL_WIDTHS, WIDTH_STEP, snapWidth, defaultConfig, parsePreset } from '../static/js/ovs/hood-presets.mjs';

test('mount depths', () => { assert.equal(MOUNT.wall.depthIn, 36); assert.equal(MOUNT.island.depthIn, 40); });
test('model widths', () => assert.deepEqual(MODEL_WIDTHS, [42, 48, 54, 60, 72]));
test('snap to 6in increments', () => {
  assert.equal(snapWidth(44), 42);            // nearest
  assert.equal(snapWidth(45), 48);            // tie rounds up
  assert.equal(snapWidth(66), 66);            // valid increment even though not a model
  assert.equal(snapWidth(30), 42);            // clamp low
  assert.equal(snapWidth(99), 72);            // clamp high
});
test('defaults land on a model width', () => {
  const c = defaultConfig('island');
  assert.equal(c.depthIn, 40);
  assert.ok(MODEL_WIDTHS.includes(c.widthIn));
});

// parsePreset — the data-preset grammar every instrument module shares.
test('parsePreset parses mount-width presets', () => {
  assert.deepEqual(parsePreset('island-48'), { mount: 'island', widthIn: 48, depthIn: 40 });
  assert.deepEqual(parsePreset('wall-54'), { mount: 'wall', widthIn: 54, depthIn: 36 });
});
test('parsePreset snaps and clamps the width segment', () => {
  assert.deepEqual(parsePreset('wall-44'), { mount: 'wall', widthIn: 42, depthIn: 36 }); // nearest 6in
  assert.deepEqual(parsePreset('island-99'), { mount: 'island', widthIn: 72, depthIn: 40 }); // clamp high
});
test('parsePreset falls back to defaultConfig on malformed input', () => {
  const fallback = defaultConfig('island');
  assert.deepEqual(parsePreset(''), fallback);
  assert.deepEqual(parsePreset(undefined), fallback);
  // unknown mount, unparseable width -> full fallback
  assert.deepEqual(parsePreset('foo-bar'), fallback);
  // 'wall--10' splits to mount segment "wall-" (unknown -> island) and
  // width segment "10" (clamped up to 42) — codified current behavior
  assert.deepEqual(parsePreset('wall--10'), { mount: 'island', widthIn: 42, depthIn: 40 });
});
test('parsePreset honors fallbackMount', () => {
  assert.deepEqual(parsePreset('', 'wall'), defaultConfig('wall'));
  assert.deepEqual(parsePreset('nonsense', 'wall'), { mount: 'wall', widthIn: 48, depthIn: 36 });
});
