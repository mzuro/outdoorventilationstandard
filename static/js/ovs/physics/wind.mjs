// wind.mjs — crossflow deflection of the plume centerline (RB-006 §3.1).
//
//   δ(z) = C_D · U_w · z / u_0(z)        C_D = 0.35 (0.348 calibrated)   rb-006:424-428
//   Fr   = U_w / u_0(z)                                                  rb-006:534
//
// The closed form is the paper's definition (not an integral of U/u_0 —
// RB-006 calibrated the closed form directly against the RB-003 3 mph
// benchmark, rb-006:418-424) and reproduces RB-006 Table 3.2b/3.2c at
// 2–10 mph (tests/wind.test.mjs). Above Fr ≈ 2.7 the paper calls the plume
// "disrupted" (rb-006:775) and its printed 15 mph cells depart from this
// formula; callers should flag that regime via froude() rather than trust a
// deflection number there.
//
// Public surface: inches, mph, RB-001 source rows (heat.mjs SOURCES);
// internal SI. Pure module.

import { SOURCES, heightM } from './heat.mjs';
import { centerlineVelocityMs, IN_PER_M } from './plume.mjs';

/** RB-006 §3.1 calibration constant (rb-006:428). */
export const C_D = 0.35;
export const MS_PER_MPH = 0.44704;

/** Plume centerline deflection at hood height, inches (rb-006:428). */
export function deflection(zIn, windMph, src = SOURCES.gasMedium) {
  if (!(windMph > 0) || !(zIn > 0)) return 0;
  const z = heightM(zIn);
  return C_D * windMph * MS_PER_MPH * z / centerlineVelocityMs(z, src) * IN_PER_M;
}

/**
 * dδ/dz in inches per inch of rise — the analytic derivative of the closed
 * form on the smooth 0.0254 m/in mapping, so a smoke particle stepped by
 * deflectionRate·dz traces exactly the curve deflection() reports.
 * With u_0 ∝ (z − z_0)^(−1/3):  δ ∝ z·(z − z_0)^(1/3)  →
 * dδ/dz ∝ (z − z_0)^(1/3) + z / (3 (z − z_0)^(2/3)).
 */
export function deflectionRate(zIn, windMph, src = SOURCES.gasMedium) {
  if (!(windMph > 0)) return 0;
  // Smooth 0.0254 m/in mapping, whereas deflection() uses the papers'
  // HEIGHT_M grid at the tabulated heights (30 in → 0.76 m, not 0.762 m).
  // The slope therefore differs from d/dz of the gridded deflection() by
  // ≤ 0.26 % at those heights — invisible in the smoke, and the integral of
  // this rate still lands within 2 % of deflection() (tests/smoke.test.mjs).
  const z = Math.max(0, zIn) * 0.0254;
  const h = Math.max(z - src.z0M, 1e-6);
  const k = C_D * windMph * MS_PER_MPH / (1.03 * Math.cbrt(src.qcKw)); // δ = k · z · h^(1/3)
  const dm = k * (Math.cbrt(h) + z / (3 * Math.pow(h, 2 / 3)));          // metres per metre
  return dm; // dimensionless slope: same in inches per inch
}

/** Crosswind Froude number Fr = U_w / u_0(z) (rb-006:534). */
export function froude(zIn, windMph, src = SOURCES.gasMedium) {
  if (!(windMph > 0)) return 0;
  return windMph * MS_PER_MPH / centerlineVelocityMs(heightM(Math.max(0, zIn)), src);
}

/** RB-006 Table 4.1 regime boundary: above this the plume is "disrupted" (rb-006:775). */
export const FR_DISRUPTED = 2.7;
