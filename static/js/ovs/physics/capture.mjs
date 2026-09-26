// capture.mjs — capture fraction of the plume by the hood (RB-006 §3.4).
//
// Model (plan §2, owner decision 4):
//   • The plume at hood height is Gaussian about its centreline with
//     σ = 1.5 · b_T  — the radius of RB-002's time-averaged 90 % flux
//     contour d_mean = 2·1.5·b_T (rb-002:392).
//   • The hood's aperture along the wind axis is ±OH about the UNDEFLECTED
//     centreline, where OH is the overhang beyond the cooking surface —
//     exactly how RB-006 §3.4 states its thresholds (rb-006:600-614):
//     δ = OH − b_T → 25 % escape, δ = OH → 50 %, δ = OH + b_T → >50 %.
//     Side wind: OH = (hood width − cooking width)/2;
//     rear wind: OH = (hood depth − cooking depth)/2 (island), or the front
//     overhang hood depth − cooking depth, one-sided, for a wall-mount whose
//     wall reflects the upwind tail (rb-006:857-859).
//   • The centreline is shifted by the RB-006 §3.1 deflection of the
//     SHELTERED wind (sidepanels.mjs: panels, rear wall).
//   Capture = Φ((OH − δ)/σ) − Φ((−OH − δ)/σ).
// It reproduces RB-008 Table 3.10's still-air column, RB-006 §3.4's
// identities and RB-006 Table 3.10's 0/5 mph rows (tests/capture.test.mjs).
// Pure module.

import { SOURCES, heightM } from './heat.mjs';
import { plumeHalfWidthBT, centerlineVelocityMs, IN_PER_M } from './plume.mjs';
import { deflection, C_D, MS_PER_MPH } from './wind.mjs';
import { effectiveWind } from './sidepanels.mjs';

/** Abramowitz–Stegun 7.1.26 (|error| < 1.5e-7). */
export function erf(x) {
  const s = Math.sign(x), a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const clamp01 = (x) => Math.max(0, Math.min(1, x));

/** σ / b_T for the Gaussian plume at hood height (rb-002:392). */
export const SIGMA_PER_BT = 1.5;

/**
 * STAGE-A SHIM, remove in Stage B. i01.mjs:185, i03.mjs:169, i07.mjs:172
 * and i08.mjs:248 still compute `plumeWind = WIND_COUPLING * wind` and pass
 * that to deflection() — a habit from the old integrator, which did not
 * carry the coupling itself. wind.mjs deflection() now IS the RB-006 §3.1
 * closed form 0.35·U·z/u_0 (rb-006:428), so any pre-multiplication would
 * apply C_D twice and make the DEFLECTION readout, the verdict stamp and
 * the drawn centreline 0.35× short of what /api/explain reports for the
 * same inputs. Exporting 1 keeps those four call sites correct until
 * Stage B deletes the multiplication and this export. The real constant is
 * wind.mjs C_D.
 */
export const WIND_COUPLING = 1;

/** Resolve the legacy `panels` strings to the sidepanels.mjs options. */
function panelsOpt(panels) {
  return panels === 'both' || panels === 'three' ? panels : 'none';
}

/**
 * Aperture geometry along the wind axis, inches. Returns { ohUp, ohDown }:
 * the aperture is [−ohUp, +ohDown] about the undeflected centreline with the
 * wind blowing toward +x.
 */
export function apertureAlongWind({ widthIn, depthIn, mount = 'island', windDir = 'side', src = SOURCES.gasMedium }) {
  if (windDir === 'rear' || windDir === 'front') {
    const cook = src.cookDIn;
    if (mount === 'wall' && windDir === 'rear') {
      // grill against the wall, hood back at the wall: the plume can only be
      // pushed toward the open front; the wall reflects the upwind tail.
      const front = Math.max(0, depthIn - cook);
      return { ohUp: Infinity, ohDown: front };
    }
    const oh = Math.max(0, (depthIn - cook) / 2);
    return { ohUp: oh, ohDown: oh };
  }
  const oh = Math.max(0, (widthIn - src.cookWIn) / 2);
  return { ohUp: oh, ohDown: oh };
}

/**
 * Fraction of the plume captured by the hood.
 *   widthIn, depthIn : hood dimensions (in)
 *   mount            : 'wall' | 'peninsula' | 'island'
 *   riseIn           : mounting height above the cooking surface (in)
 *   windMph          : ambient wind at cooking height
 *   windDir          : 'side' (default) | 'rear'
 *   panels           : 'none' | 'both' | 'three'  ('one' is not modelled, rb-009:369)
 *   f                : side-panel fractional enclosure (default 0.67)
 *   src              : heat.mjs SOURCES row (default Gas Medium)
 */
export function captureFraction({ widthIn, depthIn, mount = 'island', riseIn = 30, windMph = 0, windDir = 'side', panels = 'none', f, src = SOURCES.gasMedium }) {
  if (!(riseIn > 0)) return 1;
  const sigma = SIGMA_PER_BT * plumeHalfWidthBT(riseIn, src);
  const uEff = effectiveWind(Math.max(0, windMph || 0), { panels: panelsOpt(panels), f, dir: windDir, mount });
  const delta = deflection(riseIn, uEff, src);
  const { ohUp, ohDown } = apertureAlongWind({ widthIn, depthIn, mount, windDir, src });
  const upper = phi((ohDown - delta) / sigma);
  const lower = Number.isFinite(ohUp) ? phi((-ohUp - delta) / sigma) : 0;
  return clamp01(upper - lower);
}

/**
 * RB-006 §3.4 critical wind speeds (mph) for a hood: U = δ·u_0(z)/(C_D·z)
 * (rb-006:618) with δ_25 = OH − b_T (rb-006:610), δ_100 = OH (rb-006:614),
 * δ_50 = OH + b_T (rb-006:604). Ambient wind — panels are not applied.
 */
export function criticalWinds({ widthIn, depthIn, mount = 'island', riseIn = 30, windDir = 'side', src = SOURCES.gasMedium }) {
  const z = heightM(riseIn);
  const u0 = centerlineVelocityMs(z, src);
  const { ohDown } = apertureAlongWind({ widthIn, depthIn, mount, windDir, src });
  const ohM = ohDown / IN_PER_M;
  const bT = plumeHalfWidthBT(riseIn, src) / IN_PER_M;
  const toMph = (deltaM) => Math.max(0, deltaM) * u0 / (C_D * z) / MS_PER_MPH;
  return { u25: toMph(ohM - bT), uCenterline: toMph(ohM), u50: toMph(ohM + bT) };
}
