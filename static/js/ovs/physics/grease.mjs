// grease.mjs — grease-aerosol settling and ground-contact distance (RB-011).
//
//   v_s      = (ρ_p − ρ_a)·g·d_p² / (18·μ) · C_c          rb-011:131, rb-011:143, rb-011:153
//   C_c      = 1 + (2λ/d_p)·[1.257 + 0.4·exp(−0.55·d_p/λ)], λ = 0.066 µm   rb-011:153
//   x_ground = H · U_w / v_s                                  rb-011:199
// Reproduces RB-011 Table 3.3a (rb-011:304-312). The old (v/400)² deposition
// strip had no paper basis and is gone; depositionProfile below is a
// STAGE-A SHIM for i10 only. Pure module.

import { centerlineVelocity } from './plume.mjs';

export const RHO_PARTICLE = 900;      // kg/m³, liquid grease droplets (rb-011:135)
export const RHO_AIR = 1.2;           // kg/m³ (rb-011:143)
export const MU_AIR = 1.81e-5;        // Pa·s at 20 °C (rb-011:139)
export const MEAN_FREE_PATH_UM = 0.066; // µm (rb-011:153)
const G = 9.81;
const MS_PER_MPH = 0.44704;

/** Cunningham slip correction for a particle of diameter d_p (µm). */
export function cunninghamSlip(dpMicron) {
  const lam = MEAN_FREE_PATH_UM;
  return 1 + (2 * lam / dpMicron) * (1.257 + 0.4 * Math.exp(-0.55 * dpMicron / lam));
}

/** Stokes settling velocity with slip correction, m/s (rb-011:143, rb-011:153). */
export function stokesSettling(dpMicron) {
  const d = dpMicron * 1e-6;
  return (RHO_PARTICLE - RHO_AIR) * G * d * d / (18 * MU_AIR) * cunninghamSlip(dpMicron);
}

/**
 * Downwind distance at which the settling plume centreline reaches the
 * ground, metres: x_ground = H·U_w/v_s (rb-011:199) with H = 1.5 m as the
 * representative release height (rb-011:298).
 */
export function groundContactDistance(dpMicron, windMph, releaseHeightM = 1.5) {
  if (!(windMph > 0)) return 0;
  return releaseHeightM * windMph * MS_PER_MPH / stokesSettling(dpMicron);
}

/**
 * STAGE-A SHIM, remove in Stage B. i10 still draws an 8-zone deposition
 * strip from this; it is a normalized, non-increasing profile of
 * (u_0(z)/u_0(1 in))² with no paper basis (see plan §2 grease.mjs).
 */
export function depositionProfile(riseIn, steps = 8) {
  const out = [];
  const u1 = centerlineVelocity(1);
  for (let i = 0; i < steps; i++) {
    const zIn = (riseIn * i) / (steps - 1);
    out.push({ zIn, intensity: (centerlineVelocity(Math.max(zIn, 1)) / u1) ** 2 });
  }
  const max = out[0].intensity || 1;
  return out.map((p) => ({ ...p, intensity: p.intensity / max }));
}
