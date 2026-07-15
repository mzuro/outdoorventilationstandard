import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PARTICLES, probit, plumeWindOf, driftRate, riseSpeedInPerMs, advect,
  particleCaptured, deriveParams, escapeFraction, createSmokeField,
} from '../static/js/ovs/smoke.mjs';
import { captureFraction } from '../static/js/ovs/physics/capture.mjs';
import { deflection } from '../static/js/ovs/physics/wind.mjs';
import { MOUNT } from '../static/js/ovs/hood-presets.mjs';

test('probit is the inverse normal CDF (symmetric, monotone)', () => {
  assert.ok(Math.abs(probit(0.5)) < 1e-6);
  assert.ok(Math.abs(probit(0.975) - 1.959964) < 1e-4);
  assert.ok(Math.abs(probit(0.025) + 1.959964) < 1e-4);
  assert.ok(probit(0.9) > probit(0.6)); // monotone increasing
});

// --- advection step direction matches the deflection sign -----------------
test('particle drift direction matches the deflection sign', () => {
  const plumeWind = plumeWindOf(10, 'none');
  assert.ok(plumeWind > 0);
  // driftRate (dx per dz) has the same sign as the wind at every height
  assert.ok(driftRate(5, plumeWind) > 0);
  assert.ok(driftRate(25, plumeWind) > 0);
  // and matches the sign of the net deflection the capture model integrates
  assert.equal(Math.sign(driftRate(15, plumeWind)), Math.sign(deflection(30, plumeWind)));

  // a live-advected parcel drifts downwind (positive) under positive wind
  const p = { z: 4, driftIn: 0 };
  advect(p, 16, { plumeWind, w0: 400, k: 0.001 });
  assert.ok(p.z > 4, 'parcel rises');
  assert.ok(p.driftIn > 0, 'parcel drifts downwind');

  // calm air: no drift
  const q = { z: 4, driftIn: 0 };
  advect(q, 16, { plumeWind: plumeWindOf(0, 'none'), w0: 400, k: 0.001 });
  assert.equal(q.driftIn, 0);
});

test('buoyant rise slows with centerline-velocity decay', () => {
  // higher in the plume the parcel is slower (velocity decays with z past z0)
  assert.ok(riseSpeedInPerMs(30, 400, 1) < riseSpeedInPerMs(6, 400, 1));
});

// --- capture-partition fractions agree with captureFraction ---------------
test('smoke escape fraction agrees with captureFraction within 0.15', () => {
  const configs = [
    { widthIn: 48, mount: 'island', riseIn: 30, windMph: 0, panels: 'none' },
    { widthIn: 48, mount: 'island', riseIn: 30, windMph: 5, panels: 'none' },
    { widthIn: 60, mount: 'island', riseIn: 30, windMph: 10, panels: 'none' },
    { widthIn: 42, mount: 'island', riseIn: 30, windMph: 15, panels: 'none' },
    { widthIn: 54, mount: 'wall', riseIn: 30, windMph: 5, panels: 'both' },
    { widthIn: 72, mount: 'wall', riseIn: 30, windMph: 8, panels: 'one' },
  ];
  for (const c of configs) {
    const depthIn = MOUNT[c.mount].depthIn;
    const capFrac = captureFraction({ ...c, depthIn });
    const esc = escapeFraction({ ...c, depthIn });
    assert.ok(
      Math.abs(esc - (1 - capFrac)) <= 0.15,
      `escape ${esc.toFixed(3)} vs 1-capture ${(1 - capFrac).toFixed(3)} for ${JSON.stringify(c)}`,
    );
  }
});

test('particleCaptured is the per-parcel form of the capture partition', () => {
  const p = deriveParams({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 0, panels: 'none' });
  // a parcel at the centerline is captured; one far outside the aperture escapes
  assert.equal(particleCaptured({ depthOff: 0, widthOff: 0 }, p), true);
  assert.equal(particleCaptured({ depthOff: 200, widthOff: 0 }, p), false);
  assert.equal(particleCaptured({ depthOff: 0, widthOff: 200 }, p), false);
});

// --- particle cap respected (headless simulation over the real emitter
//     invariant + advect physics, worst case: nothing recycles) -------------
test('live particle count never exceeds MAX_PARTICLES (120)', () => {
  assert.equal(MAX_PARTICLES, 120);
  const plumeWind = plumeWindOf(20, 'none'); // worst case: 20 mph
  const particles = [];
  let accum = 0;
  const SPAWN_MS = 90;
  let maxSeen = 0;
  for (let f = 0; f < 20000; f++) {
    accum += 16;
    while (accum >= SPAWN_MS) {
      accum -= SPAWN_MS;
      if (particles.length < MAX_PARTICLES) particles.push({ z: 0, driftIn: 0 });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      advect(particles[i], 16, { plumeWind, w0: 400, k: 0.0004 });
      if (particles[i].z >= 30 * 1.02) particles.splice(i, 1);
    }
    if (particles.length > maxSeen) maxSeen = particles.length;
  }
  assert.ok(maxSeen <= MAX_PARTICLES, `peak live particles ${maxSeen}`);
});

test('createSmokeField is a harmless no-op with no DOM/group', () => {
  const f = createSmokeField(null, {});
  assert.equal(typeof f.update, 'function');
  assert.equal(typeof f.frame, 'function');
  assert.doesNotThrow(() => { f.update({}); f.frame(0); f.setReduced(true); f.pause(); f.resume(); f.destroy(); });
});
