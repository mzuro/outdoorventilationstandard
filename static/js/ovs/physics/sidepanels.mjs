// sidepanels.mjs — wind sheltering by side panels and a rear wall.
//
//   U_eff = U_w · (1 − R_panel)                                   rb-009:232
//   R_panel: RB-009 Table 3.1a (two side panels, rb-009:240-247) and
//            Table 3.1b (sides + rear, rb-009:251-260), by fractional
//            enclosure f (panel depth / mounting height) and wind direction.
//   Rear wall (wall-mount, wind from the rear): 60–80 % reduction,
//            R_WALL = 0.70 midpoint                               rb-006:859
//
// A single panel is NOT modelled: no paper row exists and RB-009 §3.5.1
// warns a lone windward panel can push plume gas out the open side
// (rb-009:369). Pure module.

const TWO_F = [0.25, 0.33, 0.50, 0.67, 0.75, 1.00];
export const R_PANEL = Object.freeze({
  // RB-009 Table 3.1a — two side panels (rb-009:242-247)
  two: Object.freeze({
    f: TWO_F,
    lateral:   [0.20, 0.28, 0.45, 0.60, 0.68, 0.85],
    frontRear: [0.05, 0.08, 0.12, 0.15, 0.18, 0.22],
    diag:      [0.12, 0.17, 0.28, 0.37, 0.42, 0.52],
    avg:       [0.10, 0.15, 0.25, 0.33, 0.38, 0.48],
  }),
  // RB-009 Table 3.1b — three panels, sides + rear, front open (rb-009:255-260)
  three: Object.freeze({
    f: TWO_F,
    rear:    [0.18, 0.26, 0.45, 0.62, 0.72, 0.88],
    lateral: [0.20, 0.28, 0.45, 0.60, 0.68, 0.85],
    front:   [0.05, 0.08, 0.12, 0.18, 0.22, 0.30],
    diag:    [0.14, 0.20, 0.35, 0.48, 0.55, 0.68],
    avg:     [0.14, 0.20, 0.34, 0.47, 0.54, 0.68],
  }),
});

/** Rear-wall wind reduction, midpoint of RB-006 §3.9.2's 60–80 % (rb-006:859). */
export const R_WALL = 0.70;

/** Default fractional enclosure: f = 0.67 → lateral R = 0.60 (rb-009:245). */
export const F_DEFAULT = 0.67;

function interp(fs, rs, f) {
  if (!(f > 0)) return 0;
  if (f >= fs[fs.length - 1]) return rs[rs.length - 1];
  if (f <= fs[0]) return rs[0] * (f / fs[0]); // below the first row: scale toward 0 at f = 0
  for (let i = 1; i < fs.length; i++) {
    if (f <= fs[i]) {
      const t = (f - fs[i - 1]) / (fs[i] - fs[i - 1]);
      return rs[i - 1] + t * (rs[i] - rs[i - 1]);
    }
  }
  return rs[rs.length - 1];
}

/**
 * R_panel for a panel configuration and wind direction.
 *   panels: 'none' | 'both' (two side panels) | 'three' (sides + rear)
 *   dir:    'side' (lateral) | 'rear' | 'front' | 'diag' (45°) | 'avg'
 *   f:      fractional enclosure (panel depth / mounting height)
 */
export function panelReduction({ panels = 'none', f = F_DEFAULT, dir = 'side' } = {}) {
  if (panels === 'both') {
    const t = R_PANEL.two;
    const col = dir === 'rear' || dir === 'front' ? t.frontRear : dir === 'diag' ? t.diag : dir === 'avg' ? t.avg : t.lateral;
    return interp(t.f, col, f);
  }
  if (panels === 'three') {
    const t = R_PANEL.three;
    const col = dir === 'rear' ? t.rear : dir === 'front' ? t.front : dir === 'diag' ? t.diag : dir === 'avg' ? t.avg : t.lateral;
    return interp(t.f, col, f);
  }
  return 0;
}

/**
 * The wind the plume feels, mph. `opts`:
 *   { panels: 'none'|'both'|'three', f, dir: 'side'|'rear'|'front'|'diag'|'avg', mount: 'wall'|'peninsula'|'island' }
 * A wall-mount under rear wind gets the RB-006 §3.9.2 recirculation-zone
 * reduction (rb-006:859); under a side wind the wall is parallel to the flow
 * and does nothing.
 */
export function effectiveWind(windMph, opts = {}) {
  const { panels = 'none', f = F_DEFAULT, dir = 'side', mount = 'island' } = opts || {};
  let u = windMph * (1 - panelReduction({ panels, f, dir }));
  if (mount === 'wall' && dir === 'rear') u *= (1 - R_WALL);
  return u;
}
