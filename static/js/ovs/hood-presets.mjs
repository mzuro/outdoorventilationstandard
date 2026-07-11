export const MOUNT = { wall: { depthIn: 36 }, island: { depthIn: 40 } };
export const MODEL_WIDTHS = [42, 48, 54, 60, 72];
export const WIDTH_STEP = 6;

export function snapWidth(w) {
  const snapped = Math.round(w / WIDTH_STEP) * WIDTH_STEP;
  return Math.min(MODEL_WIDTHS[MODEL_WIDTHS.length - 1], Math.max(MODEL_WIDTHS[0], snapped));
}

export function defaultConfig(mount) {
  return { mount, widthIn: 48, depthIn: MOUNT[mount].depthIn };
}
