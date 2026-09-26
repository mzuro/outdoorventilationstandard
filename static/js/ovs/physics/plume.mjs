// plume.mjs — Heskestad far-field plume geometry and centerline velocity.
//
//   u_0(z)     = 1.03 · Q_c^(1/3) · (z − z_0)^(−1/3)   [m/s]   rb-001:135
//   b_T(z)     = 0.12 · (z − z_0)                      [m]     rb-001:157, rb-002:981
//   d_capture  = 0.48 · (z − z_0) + D_eff              [m]     rb-002:983
//   W_rec      = K_BASE · d_capture, K_BASE = 1.38             rb-002:490, rb-002:987
//
// Public surface takes inches and returns inches / fpm; internals are SI
// on the papers' 0.01 m height grid (heat.mjs HEIGHT_M) so the printed
// rows reproduce (tests/plume.test.mjs). Default source is Gas Grill —
// Medium, the papers' single-source reference case (plan §0 finding 1).
// Pure module: no DOM, no I/O.

import { SOURCES, heightM } from './heat.mjs';

export const FPM_PER_MS = 196.85;
export const IN_PER_M = 39.3701;

/** RB-002 base width-sizing margin K = M_1 · M_2 = 1.25 · 1.10 (rb-002:490). */
export const K_BASE = 1.38;
/** RB-003 App D.1 wind-inclusive infiltration ratio K_inf (rb-003:1056); F_inf = 2.0 derives from it. */
export const K_INF = 1.70;

/** Centerline velocity u_0 in m/s at height z (metres) for a SOURCES row. */
export function centerlineVelocityMs(zM, src = SOURCES.gasMedium) {
  const h = Math.max(zM - src.z0M, 1e-6); // z − z_0 is always > 0 (z_0 < 0)
  return 1.03 * Math.cbrt(src.qcKw) * Math.pow(h, -1 / 3);
}

/** Centerline velocity u_0 in fpm at `zIn` inches above the cooking surface. */
export function centerlineVelocity(zIn, src = SOURCES.gasMedium) {
  return centerlineVelocityMs(heightM(Math.max(0, zIn)), src) * FPM_PER_MS;
}

/** Gaussian temperature half-width b_T in inches (rb-001:157). */
export function plumeHalfWidthBT(zIn, src = SOURCES.gasMedium) {
  return 0.12 * (heightM(Math.max(0, zIn)) - src.z0M) * IN_PER_M;
}

/** Heskestad capture diameter (98 % flux contour + source width) in inches (rb-002:983). */
export function captureDiameter(zIn, src = SOURCES.gasMedium) {
  return (0.48 * (heightM(Math.max(0, zIn)) - src.z0M) + src.dEffM) * IN_PER_M;
}

/** RB-002 recommended hood width W_rec = K_BASE · d_capture in inches (rb-002:987). */
export function recommendedWidth(zIn, src = SOURCES.gasMedium) {
  return K_BASE * captureDiameter(zIn, src);
}

/**
 * STAGE-A SHIM, remove in Stage B. Old signature `plumeRadius(zIn)` is still
 * imported by i01/i04/i05/i07/i08/i09 to draw the plume envelope. It now
 * returns half the RB-002 capture diameter for Gas Medium so the drawn
 * envelope is the paper's, not the retired `14 + 0.11·z` cone.
 */
export function plumeRadius(zIn) {
  return captureDiameter(zIn, SOURCES.gasMedium) / 2;
}
