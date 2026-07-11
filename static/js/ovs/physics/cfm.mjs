const V_CAPTURE = { wall: 100, island: 150 };
const EXPOSURE = { sheltered: 1.1, moderate: 1.25, exposed: 1.5 };
const round25 = (x) => Math.round(x / 25) * 25;

export function requiredCfm({ widthIn, depthIn, mount, btu = 60000, exposure = 'moderate' }) {
  const base = (widthIn * depthIn / 144) * V_CAPTURE[mount];
  const btuAdd = Math.max(0, (btu - 60000) / 10000) * 100;
  return {
    minimum: round25(base + btuAdd),
    recommended: round25(base * (EXPOSURE[exposure] ?? 1.25) + btuAdd),
    highWind: round25(base * 1.75 + btuAdd),
  };
}
