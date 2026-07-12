// Single face capture velocity (fpm). RB-005 §2.5 uses the face-velocity method
// v_face = Q/A_hood; RB-003 (Foundations) cites the ASHRAE face-velocity band of
// 50-100 fpm — we take the 100 fpm upper bound as the wall-mount baseline.
const V_CAPTURE = 100;

// Nominal hood face depth (in) used for the base capture requirement. RB-008
// §3.4.3 establishes that hood depth / cooking-surface area does NOT drive the
// required exhaust rate (only Q_c and mounting height do); the base CFM in
// RB-008 Tables 3.2a-d is depth-independent. So depth is intentionally held at
// the wall reference and is not a CFM input — the island premium below is the
// entire mount adjustment, not a depth term.
const FACE_DEPTH_IN = 36;

// Mount premium over the wall-mount baseline. RB-008 §3.9: island = 1.20x wall
// (mid of RB-005 §3.4.3's 1.15-1.25 range), driven by open-sides infiltration
// (F_inf 2.0 -> 2.3-2.5), omnidirectional wind exposure, and loss of the Coanda
// wall attachment -- NOT by the island hood's greater physical depth.
const MOUNT_MULT = { wall: 1.0, peninsula: 1.1, island: 1.2 };

// "Recommended" band multipliers by wind exposure. Model assumption: RB-008's
// F_wind bands (1.3/1.6/2.5) live in a plume-mass-flow K_CFM framework that does
// not map onto this area-x-velocity base, so the paper is silent here.
const EXPOSURE = { sheltered: 1.1, moderate: 1.25, exposed: 1.5 };
const round25 = (x) => Math.round(x / 25) * 25;

export function requiredCfm({ widthIn, mount = 'wall', btu = 60000, exposure = 'moderate' }) {
  // Face-velocity capture requirement at the wall baseline, scaled by mount.
  const base = (widthIn * FACE_DEPTH_IN / 144) * V_CAPTURE * (MOUNT_MULT[mount] ?? 1);
  const btuAdd = Math.max(0, (btu - 60000) / 10000) * 100;
  return {
    minimum: round25(base + btuAdd),
    recommended: round25(base * (EXPOSURE[exposure] ?? 1.25) + btuAdd),
    highWind: round25(base * 1.75 + btuAdd),
  };
}
