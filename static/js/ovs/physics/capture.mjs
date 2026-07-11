import { plumeRadius } from './plume.mjs';
import { deflection } from './wind.mjs';
import { effectiveWind } from './sidepanels.mjs';

export function erf(x) {
  const s = Math.sign(x), a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return s * y;
}
const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

export function captureFraction({ widthIn, depthIn, mount, riseIn, windMph, panels = 'none' }) {
  const sigma = plumeRadius(riseIn) / 2;
  const xc = deflection(riseIn, effectiveWind(windMph, panels)) / sigma; // normalize by plume width
  let axial;
  if (mount === 'wall') {
    axial = phi((depthIn - xc) / sigma) - phi((0 - xc) / sigma) + phi(xc / sigma); // wall reflects upwind half
  } else {
    axial = phi((depthIn / 2 - xc) / sigma) - phi((-depthIn / 2 - xc) / sigma);
  }
  axial = Math.min(1, axial); // clamp axial to honest bounds
  const lateral = erf((widthIn / 2) / (sigma * Math.SQRT2));
  return Math.max(0, Math.min(1, axial * lateral));
}
