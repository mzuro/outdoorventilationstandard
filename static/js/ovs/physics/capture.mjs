import { plumeRadius } from './plume.mjs';
import { deflection } from './wind.mjs';
import { effectiveWind } from './sidepanels.mjs';

export function erf(x) {
  const s = Math.sign(x), a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}

// Ground-level shelter: free-stream wind is attenuated near grade and around
// the appliance; 0.5 is standard dispersion-modeling practice.
const SHELTER = 0.5;

// erf stays as-is (Abramowitz–Stegun 7.1.26)
const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const clamp01 = (x) => Math.max(0, Math.min(1, x));

export function captureFraction({ widthIn, depthIn, mount, riseIn, windMph, panels = 'none' }) {
  const sigma = plumeRadius(riseIn) / 2;
  const xc = deflection(riseIn, SHELTER * effectiveWind(windMph, panels)); // inches, no sigma division here
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
