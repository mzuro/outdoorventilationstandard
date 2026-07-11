import { centerlineVelocity } from './plume.mjs';
export function depositionProfile(riseIn, steps = 8) {
  const out = [];
  for (let i = 0; i < steps; i++) {
    const zIn = (riseIn * i) / (steps - 1);
    out.push({ zIn, intensity: (centerlineVelocity(Math.max(zIn, 1)) / 400) ** 2 });
  }
  const max = out[0].intensity;
  return out.map((p) => ({ ...p, intensity: p.intensity / max }));
}
