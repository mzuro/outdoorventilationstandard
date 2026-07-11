import { centerlineVelocity } from './plume.mjs';

export function deflection(zIn, windMph, { w0 = 160, z0 = 12, dz = 1 } = {}) {
  const uFpm = windMph * 88;
  let x = 0;
  for (let h = dz; h <= zIn; h += dz) x += (uFpm / centerlineVelocity(h, w0, z0)) * dz;
  return x;
}
