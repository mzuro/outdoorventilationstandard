import { plumeRadius } from './plume.mjs';
import { deflection } from './wind.mjs';
import { effectiveWind } from './sidepanels.mjs';

export function erf(x) {
  const s = Math.sign(x), a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}

// Wind-plume coupling coefficient. RB-006 §3.1 calibrates the deflection of a
// buoyant cooking plume in crossflow to delta_x(z) = 0.35 · U_w · z / u_0(z)
// (C_d = 0.348, rounded to 0.35) against the RB-003 benchmark deflections.
// Applied to the deflection integrator here it reproduces RB-006 Table 3.2b
// (Gas Grill Medium): 30" / 5 mph → ~13" (paper 12"). Exported so instrument
// scenes draw the same trajectory the capture model computes with
// (i01/i03/i07/i08 import it) — keeps the calibration single-sourced.
export const WIND_COUPLING = 0.35;

// erf stays as-is (Abramowitz–Stegun 7.1.26)
const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const clamp01 = (x) => Math.max(0, Math.min(1, x));

export function captureFraction({ widthIn, depthIn, mount, riseIn, windMph, panels = 'none' }) {
  const sigma = plumeRadius(riseIn) / 2;
  const xc = deflection(riseIn, WIND_COUPLING * effectiveWind(windMph, panels)); // inches, no sigma division here
  let axial;
  if (mount === 'wall') {
    // Plume anchored at the back wall (x = 0); the wall reflects the upwind
    // Gaussian tail (mass cannot escape through the wall). Reflected-Gaussian
    // capture over the one-sided aperture [0, D]:
    axial = (phi((depthIn - xc) / sigma) - phi((0 - xc) / sigma))
          + (phi((depthIn + xc) / sigma) - phi(xc / sigma));
  } else {
    axial = phi((depthIn / 2 - xc) / sigma) - phi((-depthIn / 2 - xc) / sigma);
  }
  axial = clamp01(axial);
  const lateral = erf((widthIn / 2) / (sigma * Math.SQRT2));
  return clamp01(axial * lateral);
}
