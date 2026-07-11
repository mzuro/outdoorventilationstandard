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

/**
 * Parse an instrument figure's `data-preset` attribute, e.g. "island-48"
 * -> { mount: "island", widthIn: 48 }. Shared by every instrument module
 * (Tasks 14-16) so the "mount-width" preset grammar and its fallback are
 * defined in exactly one place. Falls back to a 48in install of
 * `fallbackMount` (default "island") when the attribute is absent,
 * unrecognized, or its mount segment isn't in MOUNT.
 */
export function parsePreset(presetStr, fallbackMount = 'island') {
  const fallback = defaultConfig(fallbackMount);
  if (!presetStr) return { mount: fallbackMount, widthIn: fallback.widthIn };
  const parts = String(presetStr).split('-');
  const widthPart = Number(parts[parts.length - 1]);
  const mountPart = parts.slice(0, -1).join('-');
  const mount = MOUNT[mountPart] ? mountPart : fallbackMount;
  const widthIn = Number.isFinite(widthPart) ? snapWidth(widthPart) : fallback.widthIn;
  return { mount, widthIn };
}
