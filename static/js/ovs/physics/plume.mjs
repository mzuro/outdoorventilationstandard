export const ENTRAINMENT = 0.11;

export function plumeRadius(zIn, b0 = 6) {
  return b0 + ENTRAINMENT * zIn;
}

export function centerlineVelocity(zIn, w0 = 160, z0 = 12) {
  return zIn <= z0 ? w0 : w0 * Math.cbrt(z0 / zIn);
}
