import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erf, captureFraction } from '../static/js/ovs/physics/capture.mjs';

test('erf reference values', () => {
  assert.ok(Math.abs(erf(0)) < 1e-7);
  assert.ok(Math.abs(erf(1) - 0.8427008) < 1e-4);
  assert.ok(Math.abs(erf(-1) + 0.8427008) < 1e-4);
});
const base = { widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30 };
test('calm capture is near-total', () => assert.ok(captureFraction({ ...base, windMph: 0 }) > 0.9));
test('wind reduces capture monotonically', () => {
  const c0 = captureFraction({ ...base, windMph: 0 });
  const c5 = captureFraction({ ...base, windMph: 5 });
  const c10 = captureFraction({ ...base, windMph: 10 });
  assert.ok(c0 > c5 && c5 > c10);
});
test('wider hood captures more', () => {
  assert.ok(captureFraction({ ...base, widthIn: 72, windMph: 5 }) >
            captureFraction({ ...base, widthIn: 42, windMph: 5 }));
});
test('side panels help in wind', () => {
  assert.ok(captureFraction({ ...base, windMph: 8, panels: 'both' }) >
            captureFraction({ ...base, windMph: 8 }));
});
test('bounded 0..1 at extremes', () => {
  const c = captureFraction({ ...base, windMph: 40 });
  assert.ok(c >= 0 && c <= 1);
});
test('wall mount responds to wind and beats island', () => {
  const wall = (windMph) => captureFraction({ widthIn: 48, depthIn: 36, mount: 'wall', riseIn: 30, windMph });
  assert.ok(wall(0) > wall(5) && wall(5) > wall(15));
  const island8 = captureFraction({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 8 });
  assert.ok(wall(8) > island8);
});
