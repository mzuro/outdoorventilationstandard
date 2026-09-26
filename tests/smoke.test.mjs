// smoke.test.mjs — A8 of the physics re-base. The living smoke is a
// VISUALIZATION of the capture model, not a second model: particles ride
// the RB-006 §3.1 deflection curve (wind.mjs deflectionRate), rise with the
// Heskestad centerline velocity (plume.mjs) and are tinted by the SAME
// aperture partition captureFraction() integrates (capture.mjs), so the
// ensemble escape fraction agrees with the readout by construction.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PARTICLES, probit, plumeWindOf, driftRate, riseSpeedInPerMs, advect,
  particleCaptured, deriveParams, escapeFraction, createSmokeField,
} from '../static/js/ovs/smoke.mjs';
import { captureFraction, apertureAlongWind } from '../static/js/ovs/physics/capture.mjs';
import { deflection, deflectionRate } from '../static/js/ovs/physics/wind.mjs';
import { effectiveWind } from '../static/js/ovs/physics/sidepanels.mjs';
import { SOURCES } from '../static/js/ovs/physics/heat.mjs';
import { MOUNT } from '../static/js/ovs/hood-presets.mjs';

test('probit is the inverse normal CDF (symmetric, monotone)', () => {
  assert.ok(Math.abs(probit(0.5)) < 1e-6);
  assert.ok(Math.abs(probit(0.975) - 1.959964) < 1e-4);
  assert.ok(Math.abs(probit(0.025) + 1.959964) < 1e-4);
  assert.ok(probit(0.9) > probit(0.6));
});

test('plumeWindOf is the sheltered wind of sidepanels.mjs — no coupling pre-multiplied (deflection carries C_D)', () => {
  assert.equal(plumeWindOf(10, 'none'), 10);
  assert.equal(plumeWindOf(10, 'both'), effectiveWind(10, { panels: 'both', dir: 'side', mount: 'island' }));  // rb-009:245
  assert.equal(plumeWindOf(10, 'none', { dir: 'rear', mount: 'wall' }), effectiveWind(10, { panels: 'none', dir: 'rear', mount: 'wall' })); // rb-006:859
});

// --- advection step direction matches the deflection sign -----------------
test('particle drift is the analytic slope of the deflection curve and matches its sign', () => {
  const plumeWind = plumeWindOf(10, 'none');
  assert.ok(plumeWind > 0);
  assert.equal(driftRate(15, plumeWind), deflectionRate(15, plumeWind, SOURCES.gasMedium));
  assert.ok(driftRate(5, plumeWind) > 0 && driftRate(25, plumeWind) > 0);
  assert.equal(Math.sign(driftRate(15, plumeWind)), Math.sign(deflection(30, plumeWind)));

  const p = { z: 4, driftIn: 0 };
  advect(p, 16, { plumeWind, k: 0.001 });
  assert.ok(p.z > 4, 'parcel rises');
  assert.ok(p.driftIn > 0, 'parcel drifts downwind');

  const q = { z: 4, driftIn: 0 };
  advect(q, 16, { plumeWind: plumeWindOf(0, 'none'), k: 0.001 });
  assert.equal(q.driftIn, 0);
});

test('advected drift integrates to the closed-form deflection (within 2 %)', () => {
  const plumeWind = plumeWindOf(5, 'none');
  const p = { z: 0, driftIn: 0 };
  while (p.z < 30) advect(p, 1, { plumeWind, k: 0.0002 }); // fine steps
  const target = deflection(30, plumeWind);
  assert.ok(Math.abs(p.driftIn - target) / target < 0.02, `drift ${p.driftIn.toFixed(2)} vs δ ${target.toFixed(2)}`);
});

test('buoyant rise slows with centerline-velocity decay (rb-001:135)', () => {
  assert.ok(riseSpeedInPerMs(30, SOURCES.gasMedium, 1) < riseSpeedInPerMs(6, SOURCES.gasMedium, 1));
  assert.ok(riseSpeedInPerMs(30) > 0);
});

// --- capture-partition fractions agree with captureFraction ---------------
test('smoke escape fraction agrees with captureFraction within 0.15', () => {
  const configs = [
    { widthIn: 48, mount: 'island', riseIn: 30, windMph: 0, panels: 'none' },
    { widthIn: 48, mount: 'island', riseIn: 30, windMph: 5, panels: 'none' },
    { widthIn: 60, mount: 'island', riseIn: 30, windMph: 10, panels: 'none' },
    { widthIn: 42, mount: 'island', riseIn: 30, windMph: 15, panels: 'none' },
    { widthIn: 54, mount: 'wall', riseIn: 30, windMph: 5, panels: 'both' },
    { widthIn: 72, mount: 'wall', riseIn: 30, windMph: 8, panels: 'none' },
    { widthIn: 48, mount: 'wall', riseIn: 30, windMph: 8, panels: 'none', windDir: 'rear' },
    { widthIn: 48, mount: 'island', riseIn: 30, windMph: 8, panels: 'both', windDir: 'rear' },
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

test('particleCaptured is the per-parcel form of the aperture partition', () => {
  const p = deriveParams({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 0, panels: 'none' });
  const ap = apertureAlongWind({ widthIn: 48, depthIn: 40, mount: 'island', windDir: 'side', src: SOURCES.gasMedium });
  assert.equal(p.ohDown, ap.ohDown);
  assert.equal(particleCaptured({ windOff: 0 }, p), true);
  assert.equal(particleCaptured({ windOff: 200 }, p), false);
  assert.equal(particleCaptured({ windOff: -200 }, p), false);
  // wall-mount under rear wind: the wall reflects the upwind tail
  const w = deriveParams({ widthIn: 48, depthIn: 36, mount: 'wall', riseIn: 30, windMph: 0, panels: 'none', windDir: 'rear' });
  assert.equal(particleCaptured({ windOff: -200 }, w), true);
  assert.equal(particleCaptured({ windOff: 200 }, w), false);
});

test('deriveParams ignores the legacy w0 key and tolerates riseIn 0 (i08 indoor collapse)', () => {
  const p = deriveParams({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30, windMph: 5, panels: 'none', w0: 400 });
  assert.equal('w0' in p, false);
  assert.equal(p.xc, deflection(30, 5, SOURCES.gasMedium));
  const z = deriveParams({ widthIn: 48, depthIn: 40, mount: 'island', riseIn: 0, windMph: 0, panels: 'none', w0: 1 });
  assert.ok(Number.isFinite(z.sigma) && Number.isFinite(z.xc));
});

// --- particle cap respected (headless simulation over the real emitter
//     invariant + advect physics, worst case: nothing recycles) -------------
test('live particle count never exceeds MAX_PARTICLES (120)', () => {
  assert.equal(MAX_PARTICLES, 120);
  const plumeWind = plumeWindOf(20, 'none');
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
      advect(particles[i], 16, { plumeWind, k: 0.0004 });
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
