import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOUNT, MODEL_WIDTHS, WIDTH_STEP, snapWidth, defaultConfig } from '../static/js/ovs/hood-presets.mjs';

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
