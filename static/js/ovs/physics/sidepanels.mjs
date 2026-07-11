const FACTOR = { none: 1, one: 0.65, both: 0.4 };

export function effectiveWind(windMph, panels) {
  return windMph * (FACTOR[panels] ?? 1);
}
