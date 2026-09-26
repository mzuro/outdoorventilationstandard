// grease.test.mjs — A6 of the physics re-base. RB-011 Stokes settling
// (rb-011:131, rb-011:143) with the Cunningham slip correction (rb-011:153)
// and the ground-contact distance x_ground = H·U_w/v_s (rb-011:199),
// reproduced against RB-011 Table 3.3a (rb-011:304-312).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stokesSettling, groundContactDistance, cunninghamSlip, RHO_PARTICLE, MU_AIR, MEAN_FREE_PATH_UM, depositionProfile } from '../static/js/ovs/physics/grease.mjs';

const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want} ±${tol}`);
const rel = (got, want, frac, msg) => near(got, want, Math.abs(want) * frac, msg);

test('constants: grease droplet density 900 kg/m³, air viscosity 1.81e-5 Pa·s, mean free path 0.066 µm', () => {
  assert.equal(RHO_PARTICLE, 900);                                            // rb-011:135, rb-011:680
  assert.equal(MU_AIR, 1.81e-5);                                              // rb-011:139, rb-011:678
  assert.equal(MEAN_FREE_PATH_UM, 0.066);                                     // rb-011:153
});

test('RB-011 Table 3.3a settling velocity v_s for 10 / 50 / 100 µm (and 1 µm with slip)', () => {
  rel(stokesSettling(100), 0.271, 0.005, '100 µm');                           // rb-011:312
  rel(stokesSettling(50), 6.78e-2, 0.005, '50 µm');                           // rb-011:311
  rel(stokesSettling(10), 2.8e-3, 0.02, '10 µm');                             // rb-011:309 (printed to 2 s.f.)
  rel(stokesSettling(1.0), 3.1e-5, 0.02, '1 µm');                             // rb-011:306 (slip-corrected)
  // v_s ∝ d_p² above the slip range (rb-011:143)
  near(stokesSettling(100) / stokesSettling(50), 4, 0.01, 'quadratic in d_p');
});

test('Cunningham slip is ≈1 above 2 µm and grows below (rb-011:153)', () => {
  assert.ok(cunninghamSlip(10) > 1 && cunninghamSlip(10) < 1.02);
  assert.ok(cunninghamSlip(1) > 1.1 && cunninghamSlip(1) < 1.2);              // rb-011:306 implies C_c ≈ 1.15 at 1 µm
  assert.ok(cunninghamSlip(0.1) > cunninghamSlip(1));
});

test('RB-011 Table 3.3a ground-contact distance x_ground = H·U/v_s, H = 1.5 m', () => {
  near(groundContactDistance(100, 5), 12.4, 0.1, '100 µm @ 5 mph');          // rb-011:312
  near(groundContactDistance(100, 2), 4.9, 0.1, '100 µm @ 2 mph');           // rb-011:312
  near(groundContactDistance(100, 8), 19.8, 0.2, '100 µm @ 8 mph');          // rb-011:312
  near(groundContactDistance(100, 10), 24.7, 0.2, '100 µm @ 10 mph');        // rb-011:312
  near(groundContactDistance(50, 5), 50, 1, '50 µm @ 5 mph');                // rb-011:311
  rel(groundContactDistance(10, 5), 1200, 0.02, '10 µm @ 5 mph');            // rb-011:309
  // explicit release height
  near(groundContactDistance(100, 5, 1.5), groundContactDistance(100, 5), 1e-12, 'default H = 1.5 m'); // rb-011:298
  near(groundContactDistance(100, 5, 3.0), 2 * groundContactDistance(100, 5), 1e-9, 'linear in H');   // rb-011:199
  assert.equal(groundContactDistance(100, 0), 0);
});

// STAGE-A SHIM (i10 still imports it): the old (v/400)² strip has no paper
// basis; the shim keeps its shape (normalized, non-increasing) until Stage B
// replaces i10's deposition view with particle-size zones.
test('depositionProfile (STAGE-A SHIM) keeps its legacy shape', () => {
  const p = depositionProfile(30, 8);
  assert.equal(p.length, 8);
  assert.equal(p[0].intensity, 1);
  assert.equal(p[7].zIn, 30);
  for (let i = 1; i < p.length; i++) assert.ok(p[i].intensity <= p[i - 1].intensity);
});
