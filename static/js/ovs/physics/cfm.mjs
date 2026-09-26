// cfm.mjs — required exhaust CFM (RB-008, App A steps 4–8).
//
//   ṁ_p       = 0.071·Q_c^(1/3)·z^(5/3) + 0.0018·Q_c   [kg/s]      rb-008:99
//   CFM_plume = ṁ_p / ρ_plume × 2119, ρ_plume = 1.10 kg/m³         rb-008:105-107
//   K_CFM     = F_inf·F_wind·F_safety by wind class                rb-008:142-145
//   table     = round(CFM_plume × K_CFM)          (Tables 3.2a–d, wall-mount)
//   minimum   = round(table × mount multiplier)   (§3.9, rb-008:560-568)
//   blower    = smallest standard size ≥ 1.1 × minimum             rb-008:870, rb-008:614
//
// Hood WIDTH is not a CFM input (RB-008 §3.4.3 / Table 3.10: a wider hood
// needs less, not more); coverageAdvisory() reports the RB-008 Table 3.10
// coverage band for the UI instead. Pure module.

import { SOURCES, sourceForBtu, heightM } from './heat.mjs';
import { recommendedWidth } from './plume.mjs';

/** Plume-average density, kg/m³ (rb-008:105). */
export const RHO_PLUME = 1.10;
export const CFM_PER_M3S = 2119;

/** K_CFM = F_inf × F_wind × F_safety by wind exposure class (rb-008:142-145). */
export const K_CFM = Object.freeze({ sheltered: 3.0, moderate: 3.68, exposedPanels: 4.14, exposed: 5.75 });

/** Installation multipliers, RB-008 §3.9 (rb-008:560-562). */
export const MOUNT_MULT = Object.freeze({ wall: 1.00, peninsula: 1.10, island: 1.20 });

/** Blower selection: at least 1.1 × required (rb-008:870), smallest standard size (rb-008:614). */
export const BLOWER_MARGIN = 1.1;
export const BLOWER_SIZES = Object.freeze([600, 900, 1200, 1500, 1800, 2100, 2400, 3000]);

/** Bare plume mass flow at z metres, kg/s (rb-008:99). */
export function plumeMassFlowKgS(zM, src) {
  return 0.071 * Math.cbrt(src.qcKw) * Math.pow(Math.max(zM, 0), 5 / 3) + 0.0018 * src.qcKw;
}

/** Bare plume volumetric flow at `zIn` inches, CFM (rb-008:107; Table 3.1 rb-008:198-210). */
export function plumeCfm(zIn, src = SOURCES.gasMedium) {
  return plumeMassFlowKgS(heightM(Math.max(0, zIn)), src) / RHO_PLUME * CFM_PER_M3S;
}

/** Smallest standard blower ≥ BLOWER_MARGIN × minimum, or null above the ladder. */
export function blowerFor(minimumCfm) {
  const need = minimumCfm * BLOWER_MARGIN;
  for (const size of BLOWER_SIZES) if (size >= need - 1e-9) return size;
  return null;
}

/** K_CFM for an exposure class; 'exposed' depends on side panels (rb-008:144-145). */
export function kCfmFor(exposure = 'moderate', panels = 'none') {
  if (exposure === 'exposed') return panels === 'both' || panels === 'three' ? K_CFM.exposedPanels : K_CFM.exposed;
  return K_CFM[exposure] ?? K_CFM.moderate;
}

/**
 * Required exhaust CFM.
 *   { src = SOURCES.gasLarge, riseIn = 30, mount = 'wall',
 *     exposure = 'sheltered'|'moderate'|'exposed', panels = 'none'|'both' }
 * Returns { minimum, blower, kCfm, plumeCfm, mount, mountMult,
 *           tables: { sheltered, moderate, exposedPanels, exposed } } where
 * `tables` are the wall-mount Table 3.2a–d values before the mount multiplier.
 *
 * STAGE-A SHIM, remove in Stage B: a legacy call {widthIn, btu, mount,
 * exposure} (i02.mjs, tests/copy-spec-line.test.mjs) is accepted — btu maps
 * to the nearest RB-001 gas row, widthIn is ignored — and the result also
 * carries `.recommended` (= blower) and `.highWind` (= tables.exposed).
 */
export function requiredCfm({ src, btu, riseIn = 30, mount = 'wall', exposure = 'moderate', panels = 'none' } = {}) {
  const source = src ?? (Number.isFinite(btu) ? sourceForBtu(btu) : SOURCES.gasLarge);
  const mountKey = MOUNT_MULT[mount] != null ? mount : 'wall';
  const mountMult = MOUNT_MULT[mountKey];
  const cfmPlume = plumeCfm(riseIn, source);
  const tables = {
    sheltered: Math.round(cfmPlume * K_CFM.sheltered),
    moderate: Math.round(cfmPlume * K_CFM.moderate),
    exposedPanels: Math.round(cfmPlume * K_CFM.exposedPanels),
    exposed: Math.round(cfmPlume * K_CFM.exposed),
  };
  const kCfm = kCfmFor(exposure, panels);
  const table = Math.round(cfmPlume * kCfm);
  const minimum = Math.round(table * mountMult);
  const blower = blowerFor(minimum);
  return {
    minimum, blower, kCfm, plumeCfm: cfmPlume, mount: mountKey, mountMult, tables,
    // STAGE-A SHIM aliases (i02 readouts), remove in Stage B
    recommended: blower ?? minimum,
    highWind: Math.round(tables.exposed * mountMult),
  };
}

/** RB-008 Table 3.10 coverage bands by % of the RB-002 recommended width (rb-008:584-591). */
export function coverageAdvisory(widthIn, riseIn = 30, src = SOURCES.gasMedium) {
  const recommendedWidthIn = recommendedWidth(riseIn, src);
  // The paper reckons "% of recommended" against the whole-inch W_rec it
  // prints (57 in for Gas Medium at 30 in, rb-008:582), so 57 in is 100 %.
  const pct = (widthIn / Math.round(recommendedWidthIn)) * 100;
  // rb-008:584-589 bands; rb-008:591 design rule (≥ 90 % for the tables to hold)
  let band, captureBand;
  if (pct < 80) { band = 'overflow'; captureBand = [65, 75]; }        // rb-008:584 (42 in, 74 %)
  else if (pct < 90) { band = 'marginal'; captureBand = [80, 85]; }   // rb-008:585 (48 in, 84 %)
  else if (pct < 100) { band = 'acceptable'; captureBand = [90, 93]; } // rb-008:586 (54 in, 95 %)
  else { band = 'full'; captureBand = [95, 100]; }                     // rb-008:587-589 (≥ 100 %)
  return { widthIn, recommendedWidthIn, pctOfRecommended: pct, band, captureBand };
}
