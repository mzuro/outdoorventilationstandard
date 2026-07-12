import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflection } from '../static/js/ovs/physics/wind.mjs';
import { effectiveWind } from '../static/js/ovs/physics/sidepanels.mjs';
import { WIND_COUPLING } from '../static/js/ovs/physics/capture.mjs';

test('no wind, no deflection', () => assert.equal(deflection(30, 0), 0));
test('deflection monotonic in wind and height', () => {
  assert.ok(deflection(30, 5) > deflection(30, 2));
  assert.ok(deflection(36, 5) > deflection(24, 5));
});

// The displayed deflection is WIND_COUPLING * integrator (capture.mjs applies
// the same product at its call sites). RB-006 §3.1 calibrates the coupling to 0.35.
test('WIND_COUPLING is RB-006 §3.1 calibrated 0.35', () => {
  assert.equal(WIND_COUPLING, 0.35);
});
test('displayed deflection matches RB-006 Table 3.2b (Gas Grill Medium, 30")', () => {
  const displayed = (mph) => WIND_COUPLING * deflection(30, mph);
  // RB-006 Table 3.2b @30": 2mph=5", 5mph=12", 8mph=19", 10mph=25"
  assert.ok(Math.abs(displayed(2) - 5) <= 1.5, `2mph got ${displayed(2).toFixed(1)}`);
  assert.ok(Math.abs(displayed(5) - 12) <= 1.5, `5mph got ${displayed(5).toFixed(1)}`);   // RB-006 Table 3.2b: 12in at 30in/5mph
  assert.ok(Math.abs(displayed(8) - 19) <= 2, `8mph got ${displayed(8).toFixed(1)}`);
  assert.ok(Math.abs(displayed(10) - 25) <= 2, `10mph got ${displayed(10).toFixed(1)}`);
});
test('displayed deflection matches RB-006 Table 3.2b vs height at 5 mph', () => {
  const displayed = (z) => WIND_COUPLING * deflection(z, 5);
  // RB-006 Table 3.2b @5mph: 18"=6", 24"=9", 30"=12", 36"=15", 48"=22"
  assert.ok(Math.abs(displayed(18) - 6) <= 1.5, `18in got ${displayed(18).toFixed(1)}`);
  assert.ok(Math.abs(displayed(30) - 12) <= 1.5, `30in got ${displayed(30).toFixed(1)}`);
  assert.ok(Math.abs(displayed(48) - 22) <= 2, `48in got ${displayed(48).toFixed(1)}`);
});
test('side panels attenuate wind', () => {
  assert.equal(effectiveWind(10, 'none'), 10);
  assert.equal(effectiveWind(10, 'one'), 6.5);   // model assumption: single panel ~35% reduction (papers silent on single panel)
  assert.equal(effectiveWind(10, 'both'), 4);     // RB-006 §3.9.1: both panels reduce wind 40-60% (0.4 = 60%, top of range)
});
