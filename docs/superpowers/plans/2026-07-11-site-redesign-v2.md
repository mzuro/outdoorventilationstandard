# OVS v2 Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace PaperMod with a custom "Modern Standard" theme and rebuild the site's 10 tools as live explorable instruments, gated behind a staging preview Mark approves before production.

**Architecture:** Custom Hugo theme (`themes/ovs/`) styled from a committed design-reference mockup; interactivity via plain ES modules in `static/js/ovs/` (no build step): one shared `viz.mjs` engine + pure physics modules per instrument, embedded anywhere through a Hugo shortcode. Pure logic is TDD'd with `node --test`; templates are verified by `hugo` builds and browser checks.

**Tech Stack:** Hugo 0.155.2 (extended not required), vanilla ES modules + SVG, node:test (zero npm deps), Cloudflare Workers (existing `wrangler.jsonc` + new preview config), existing `src/worker.js` AI endpoints.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-11-site-redesign-v2-design.md` — read it before starting any task.
- Design reference (canonical visual truth): `docs/design/modern-standard-mockup.html`. When a task says "match the mockup," open this file and extract/adapt its actual CSS/SVG/JS.
- Hood presets: wall = 36" deep, island = 40" deep; model widths **42, 48, 54, 60, 72**; width controls snap in 6" increments; defaults always land on a model width. Never name any brand.
- Voice: answer in the first two sentences; brief, to the point, relevant; no filler.
- Reviewer byline (exact string): `Reviewed by Mark Zuro, outdoor ventilation product specialist with 15+ years designing and engineering outdoor-rated range hoods.`
- Citations: numbered IEEE-style `[1]` with a references list; papers cited as RB-0XX.
- Both themes first-class: light default + dark via `prefers-color-scheme`; accent `#1747c4` light / `#8fb0ff` dark.
- Accessibility: keyboard-operable controls, `aria-live` readouts, visible focus, `prefers-reduced-motion` honored (static render, no particles).
- All existing URLs keep resolving. The `governance/` section keeps its URLs (nav label becomes "Standard").
- Preserve worker API contracts: `POST /api/ask` body `{question, cf_token, website}` → `{answer, links[]}`; `POST /api/track`; Fuse.js search over `/index.json`; Turnstile script `https://challenges.cloudflare.com/turnstile/v0/api.js`.
- No page ever scrolls horizontally at 375px; wide tables get their own `overflow-x:auto` wrapper.
- **Never merge `redesign/v2` to `main` or deploy production. The plan ends at the staging preview; production is Mark's explicit call.**
- Run all commands from repo root: `~/code/hugo-sites/outdoorventilationstandard`.
- Every commit message ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## File Structure

```
docs/design/modern-standard-mockup.html      # committed design reference (exists)
package.json                                 # + "test": "node --test tests/"
tests/*.test.mjs                             # node:test suites for all pure modules
static/js/ovs/
  hood-presets.mjs                           # MOUNT, MODEL_WIDTHS, WIDTH_STEP, snapWidth, defaultConfig
  physics/plume.mjs                          # plumeRadius, centerlineVelocity
  physics/wind.mjs                           # deflection
  physics/capture.mjs                        # erf, captureFraction
  physics/cfm.mjs                            # requiredCfm
  physics/sidepanels.mjs                     # effectiveWind
  physics/heat.mjs                           # plumeStrength
  physics/grease.mjs                         # depositionProfile
  viz.mjs                                    # createInstrument engine (+ exported pure helpers lerp, fmt)
  instruments/i01.mjs … i10.mjs              # one scene module per instrument
themes/ovs/
  theme.toml
  layouts/_default/{baseof.html,single.html,list.html}
  layouts/index.html
  layouts/questions/single.html
  layouts/tools/{single.html,list.html}
  layouts/research/{single.html,list.html}
  layouts/partials/{head.html,header.html,footer.html,schema.html,byline.html,citations.html}
  layouts/shortcodes/{instrument.html,note.html}
  layouts/{search.html → page kind via layout front matter}, layouts/404.html
assets/ovs/css/{tokens.css,base.css,components.css}   # bundled via Hugo pipes in head.html
content/questions/{_index.md + 6 question pages}
wrangler.preview.jsonc                       # staging worker, noindex
```

Interface rule: physics modules are pure (no DOM); `viz.mjs` owns all DOM; instrument modules glue one physics module to one scene and export `mount(rootEl)`.

---

### Task 1: Test harness + repo scaffolding

**Files:**
- Modify: `package.json` (add test script)
- Create: `tests/smoke.test.mjs`

**Interfaces:** Produces: `npm test` runs `node --test tests/`.

- [ ] **Step 1: Add test script.** In `package.json` `"scripts"`, add `"test": "node --test tests/"`.
- [ ] **Step 2: Write smoke test** `tests/smoke.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
test('harness runs', () => assert.equal(1 + 1, 2));
```

- [ ] **Step 3: Run** `npm test` — Expected: `pass 1`.
- [ ] **Step 4: Commit** `chore: add node --test harness`.

### Task 2: hood-presets.mjs (TDD)

**Files:** Create `static/js/ovs/hood-presets.mjs`, `tests/hood-presets.test.mjs`.

**Interfaces — Produces (every geometry instrument consumes these exact names):**
```js
export const MOUNT = { wall: { depthIn: 36 }, island: { depthIn: 40 } };
export const MODEL_WIDTHS = [42, 48, 54, 60, 72];
export const WIDTH_STEP = 6;
export function snapWidth(w)            // → nearest 6" multiple clamped to [42,72]; ties round up
export function defaultConfig(mount)    // → { mount, widthIn: 48, depthIn: MOUNT[mount].depthIn }
```

- [ ] **Step 1: Failing tests** `tests/hood-presets.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOUNT, MODEL_WIDTHS, WIDTH_STEP, snapWidth, defaultConfig } from '../static/js/ovs/hood-presets.mjs';

test('mount depths', () => { assert.equal(MOUNT.wall.depthIn, 36); assert.equal(MOUNT.island.depthIn, 40); });
test('model widths', () => assert.deepEqual(MODEL_WIDTHS, [42, 48, 54, 60, 72]));
test('snap to 6in increments', () => {
  assert.equal(snapWidth(44), 42);            // nearest
  assert.equal(snapWidth(45), 48);            // tie rounds up
  assert.equal(snapWidth(66), 66);            // valid increment even though not a model
  assert.equal(snapWidth(30), 42);            // clamp low
  assert.equal(snapWidth(99), 72);            // clamp high
});
test('defaults land on a model width', () => {
  const c = defaultConfig('island');
  assert.equal(c.depthIn, 40);
  assert.ok(MODEL_WIDTHS.includes(c.widthIn));
});
```

- [ ] **Step 2: Run** `npm test` — Expected: FAIL (module not found).
- [ ] **Step 3: Implement** `static/js/ovs/hood-presets.mjs`:

```js
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
```

- [ ] **Step 4: Run** `npm test` — Expected: PASS.
- [ ] **Step 5: Commit** `feat: hood preset module (wall 36 / island 40, 6in width snap)`.

### Task 3: physics/plume.mjs (TDD)

**Files:** Create `static/js/ovs/physics/plume.mjs`, `tests/plume.test.mjs`.

**Interfaces — Produces:**
```js
export const ENTRAINMENT = 0.11;                       // half-angle spread coefficient
export function plumeRadius(zIn, b0 = 6)               // inches at height z above cook surface
export function centerlineVelocity(zIn, w0 = 160, z0 = 12) // fpm; constant to z0, then w0·cbrt(z0/z)
```

- [ ] **Step 1: Failing tests** `tests/plume.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plumeRadius, centerlineVelocity } from '../static/js/ovs/physics/plume.mjs';

test('radius grows linearly from source radius', () => {
  assert.equal(plumeRadius(0), 6);
  assert.ok(Math.abs(plumeRadius(100) - (6 + 0.11 * 100)) < 1e-9);
});
test('velocity constant in near field then decays as cbrt', () => {
  assert.equal(centerlineVelocity(6), 160);
  assert.equal(centerlineVelocity(12), 160);
  assert.ok(Math.abs(centerlineVelocity(96) - 160 * Math.cbrt(12 / 96)) < 1e-9);
});
test('velocity strictly decreasing beyond z0', () => {
  assert.ok(centerlineVelocity(24) > centerlineVelocity(48));
  assert.ok(centerlineVelocity(48) > centerlineVelocity(96));
});
```

- [ ] **Step 2: Run** `npm test` — FAIL. **Step 3: Implement:**

```js
export const ENTRAINMENT = 0.11;
export function plumeRadius(zIn, b0 = 6) { return b0 + ENTRAINMENT * zIn; }
export function centerlineVelocity(zIn, w0 = 160, z0 = 12) {
  return zIn <= z0 ? w0 : w0 * Math.cbrt(z0 / zIn);
}
```

- [ ] **Step 4:** `npm test` PASS. **Step 5: Commit** `feat: plume spread and velocity-decay model (RB-002, RB-003)`.

### Task 4: physics/wind.mjs + sidepanels.mjs (TDD)

**Files:** Create `static/js/ovs/physics/wind.mjs`, `static/js/ovs/physics/sidepanels.mjs`, `tests/wind.test.mjs`.

**Interfaces — Produces:**
```js
// wind.mjs — dx/dz = U/w(z); integrate stepwise. U in mph (→ ×88 fpm), z in inches.
export function deflection(zIn, windMph, { w0 = 160, z0 = 12, dz = 1 } = {})  // → inches downwind
// sidepanels.mjs
export function effectiveWind(windMph, panels)  // 'none' → ×1, 'one' → ×0.65, 'both' → ×0.4
```

- [ ] **Step 1: Failing tests** `tests/wind.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflection } from '../static/js/ovs/physics/wind.mjs';
import { effectiveWind } from '../static/js/ovs/physics/sidepanels.mjs';

test('no wind, no deflection', () => assert.equal(deflection(30, 0), 0));
test('deflection monotonic in wind and height', () => {
  assert.ok(deflection(30, 5) > deflection(30, 2));
  assert.ok(deflection(36, 5) > deflection(24, 5));
});
test('5mph over 30in rise deflects on the order of the hood depth', () => {
  const x = deflection(30, 5);      // U/w ≈ 440/160 near field → tens of inches
  assert.ok(x > 20 && x < 120, `got ${x}`);
});
test('side panels attenuate wind', () => {
  assert.equal(effectiveWind(10, 'none'), 10);
  assert.equal(effectiveWind(10, 'one'), 6.5);
  assert.equal(effectiveWind(10, 'both'), 4);
});
```

- [ ] **Step 2:** `npm test` FAIL. **Step 3: Implement** `wind.mjs`:

```js
import { centerlineVelocity } from './plume.mjs';
export function deflection(zIn, windMph, { w0 = 160, z0 = 12, dz = 1 } = {}) {
  const uFpm = windMph * 88;
  let x = 0;
  for (let h = dz; h <= zIn; h += dz) x += (uFpm / centerlineVelocity(h, w0, z0)) * dz;
  return x;
}
```

`sidepanels.mjs`:

```js
const FACTOR = { none: 1, one: 0.65, both: 0.4 };
export function effectiveWind(windMph, panels) { return windMph * (FACTOR[panels] ?? 1); }
```

- [ ] **Step 4:** `npm test` PASS. **Step 5: Commit** `feat: wind deflection integrator and side-panel attenuation (RB-006, RB-009)`.

### Task 5: physics/capture.mjs (TDD)

**Files:** Create `static/js/ovs/physics/capture.mjs`, `tests/capture.test.mjs`.

**Interfaces — Produces (I-01, I-05, I-07, I-08 consume):**
```js
export function erf(x)  // Abramowitz–Stegun 7.1.26, |error| < 1.5e-7
export function captureFraction({ widthIn, depthIn, mount, riseIn, windMph, panels = 'none' }) // → 0..1
```

Model (state in method notes): plume at rise height has Gaussian cross-section, σ = plumeRadius(rise)/2; crosswind displaces centerline by `deflection(rise, effectiveWind(wind, panels))` along the depth axis. Island: aperture ±D/2 around center. Wall: plume anchored at the back wall, wall blocks upwind escape → one-sided aperture D. Width axis (no crosswind component): `erf((W/2)/(σ√2))`. Total = axial × lateral, clamped to [0,1].

- [ ] **Step 1: Failing tests** `tests/capture.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erf, captureFraction } from '../static/js/ovs/physics/capture.mjs';

test('erf reference values', () => {
  assert.ok(Math.abs(erf(0)) < 1e-7);
  assert.ok(Math.abs(erf(1) - 0.8427008) < 1e-4);
  assert.ok(Math.abs(erf(-1) + 0.8427008) < 1e-4);
});
const base = { widthIn: 48, depthIn: 40, mount: 'island', riseIn: 30 };
test('calm capture is near-total', () => assert.ok(captureFraction({ ...base, windMph: 0 }) > 0.9));
test('wind reduces capture monotonically', () => {
  const c0 = captureFraction({ ...base, windMph: 0 });
  const c5 = captureFraction({ ...base, windMph: 5 });
  const c10 = captureFraction({ ...base, windMph: 10 });
  assert.ok(c0 > c5 && c5 > c10);
});
test('wider hood captures more', () => {
  assert.ok(captureFraction({ ...base, widthIn: 72, windMph: 5 }) >
            captureFraction({ ...base, widthIn: 42, windMph: 5 }));
});
test('side panels help in wind', () => {
  assert.ok(captureFraction({ ...base, windMph: 8, panels: 'both' }) >
            captureFraction({ ...base, windMph: 8 }));
});
test('bounded 0..1 at extremes', () => {
  const c = captureFraction({ ...base, windMph: 40 });
  assert.ok(c >= 0 && c <= 1);
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implement:**

```js
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
  const xc = deflection(riseIn, effectiveWind(windMph, panels));
  let axial;
  if (mount === 'wall') {
    axial = phi((depthIn - xc) / sigma) - phi((0 - xc) / sigma) + phi(xc / sigma); // wall reflects upwind half
  } else {
    axial = phi((depthIn / 2 - xc) / sigma) - phi((-depthIn / 2 - xc) / sigma);
  }
  const lateral = erf((widthIn / 2) / (sigma * Math.SQRT2));
  return Math.max(0, Math.min(1, axial * lateral));
}
```

- [ ] **Step 4:** `npm test` PASS (if the wall reflection term makes `axial` exceed 1 in calm air, clamp `axial = Math.min(1, axial)` before multiplying — keep the test suite green with honest bounds). **Step 5: Commit** `feat: Gaussian capture-fraction model (RB-005)`.

### Task 6: physics/cfm.mjs + heat.mjs + grease.mjs (TDD)

**Files:** Create `static/js/ovs/physics/cfm.mjs`, `heat.mjs`, `grease.mjs`, `tests/cfm.test.mjs`.

**Interfaces — Produces:**
```js
// cfm.mjs — area (ft²) × capture velocity (wall 100 fpm, island 150 fpm), wind multiplier, BTU adder
export function requiredCfm({ widthIn, depthIn, mount, btu = 60000, exposure = 'moderate' })
// → { minimum, recommended, highWind }  (integers, rounded to nearest 25)
// heat.mjs
export function plumeStrength(btu) // → w0 fpm = 160 · cbrt(btu/60000)
// grease.mjs
export function depositionProfile(riseIn, steps = 8) // → [{zIn, intensity 0..1}] normalized, decreasing with height
```

CFM model (state in method notes): `base = areaFt2 × vCapture`; `minimum = base`; `recommended = base × exposureFactor` (sheltered 1.1 / moderate 1.25 / exposed 1.5); `highWind = base × 1.75`; add `+100 CFM per 10k BTU above 60k` to all three; round to 25.

- [ ] **Step 1: Failing tests** `tests/cfm.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requiredCfm } from '../static/js/ovs/physics/cfm.mjs';
import { plumeStrength } from '../static/js/ovs/physics/heat.mjs';
import { depositionProfile } from '../static/js/ovs/physics/grease.mjs';

test('48in wall baseline', () => {
  const r = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall' });
  assert.equal(r.minimum, 1200);                    // 12 ft² × 100 fpm
  assert.equal(r.recommended, 1500);                // ×1.25
  assert.equal(r.highWind, 2100);                   // ×1.75
});
test('island needs more than wall', () => {
  const w = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall' });
  const i = requiredCfm({ widthIn: 48, depthIn: 40, mount: 'island' });
  assert.ok(i.minimum > w.minimum);
});
test('btu above 60k adds to all bands', () => {
  const a = requiredCfm({ widthIn: 48, depthIn: 36, mount: 'wall', btu: 90000 });
  assert.equal(a.minimum, 1500);                    // +300
});
test('ordering always min <= rec <= high', () => {
  const r = requiredCfm({ widthIn: 72, depthIn: 40, mount: 'island', exposure: 'exposed' });
  assert.ok(r.minimum <= r.recommended && r.recommended <= r.highWind);
});
test('plume strength scales with cbrt of heat', () => {
  assert.equal(plumeStrength(60000), 160);
  assert.ok(Math.abs(plumeStrength(120000) - 160 * Math.cbrt(2)) < 1e-9);
});
test('deposition normalized and decreasing', () => {
  const p = depositionProfile(30);
  assert.equal(p[0].intensity, 1);
  for (let i = 1; i < p.length; i++) assert.ok(p[i].intensity <= p[i - 1].intensity);
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implement** `cfm.mjs`:

```js
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
```

`heat.mjs`:

```js
export function plumeStrength(btu) { return 160 * Math.cbrt(btu / 60000); }
```

`grease.mjs`:

```js
import { centerlineVelocity } from './plume.mjs';
export function depositionProfile(riseIn, steps = 8) {
  const out = [];
  for (let i = 0; i < steps; i++) {
    const zIn = (riseIn * i) / (steps - 1);
    out.push({ zIn, intensity: (centerlineVelocity(Math.max(zIn, 1)) / 160) ** 2 });
  }
  const max = out[0].intensity;
  return out.map((p) => ({ ...p, intensity: p.intensity / max }));
}
```

- [ ] **Step 4:** `npm test` PASS. **Step 5: Commit** `feat: CFM band, heat scaling, grease deposition models (RB-008, RB-011)`.

### Task 7: viz.mjs engine

**Files:** Create `static/js/ovs/viz.mjs`, `tests/viz.test.mjs`.

**Interfaces — Produces (every instrument consumes exactly this):**
```js
export function lerp(a, b, t)                       // pure
export function fmt(value, spec)                    // spec: 'int'|'pct'|'cfm'|'in'|'fpm'|'mph' → string, tabular-safe
export function createInstrument(rootEl, spec)      // → { set(id, value), get(), destroy() }
// spec = {
//   id, title,
//   controls: [{ id, type: 'range'|'segmented', label, min, max, step, value, detents?, options?, unit? }],
//   readouts: [{ id, label, format }],
//   scene(svgEl, helpers) {},                      // build static SVG once; helpers below
//   update(state, ctx) {},                         // ctx = { svg, setReadout(id, value), reduced }
// }
// helpers = { el(tag, attrs), dimensionLine(x1,y1,x2,y2,label), noteBox(x,y,text) }
```

Behavior contract (implement fully; the mockup's hero JS is the working reference to adapt):
1. Renders a `<fieldset>` of controls: `range` → `<input type=range>` + value bubble; `segmented` → radio group styled as segments. Detents render as `<datalist>` tick marks. Every control labeled, keyboard-operable, `focus-visible` styled.
2. State changes tween over 200 ms with `requestAnimationFrame`, calling `update` with interpolated numeric state each frame; non-numeric (segmented) values switch instantly.
3. `matchMedia('(prefers-reduced-motion: reduce)')` → no tween, single `update` call, `ctx.reduced = true` (instruments skip particles).
4. Readouts are `<output aria-live="polite">` elements updated via `ctx.setReadout(id, value)` (applies `fmt`).
5. `destroy()` cancels rAF and removes listeners.
6. All markup created via DOM APIs into `rootEl`; classes prefixed `ovs-i-` and styled in `components.css` (Task 9).

- [ ] **Step 1: Failing tests for the pure exports** `tests/viz.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerp, fmt } from '../static/js/ovs/viz.mjs';

test('lerp', () => { assert.equal(lerp(0, 10, 0.5), 5); assert.equal(lerp(2, 2, 0.9), 2); });
test('fmt', () => {
  assert.equal(fmt(0.873, 'pct'), '87%');
  assert.equal(fmt(1497.4, 'cfm'), '1,497 CFM');
  assert.equal(fmt(48, 'in'), '48″');
  assert.equal(fmt(5, 'mph'), '5 mph');
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implement** `viz.mjs` — full engine per the contract; `lerp`/`fmt`:

```js
export function lerp(a, b, t) { return a + (b - a) * t; }
export function fmt(value, spec) {
  switch (spec) {
    case 'pct': return `${Math.round(value * 100)}%`;
    case 'cfm': return `${Math.round(value).toLocaleString('en-US')} CFM`;
    case 'in': return `${Math.round(value)}″`;
    case 'fpm': return `${Math.round(value)} fpm`;
    case 'mph': return `${Math.round(value)} mph`;
    default: return String(Math.round(value));
  }
}
```

(then `createInstrument` and helpers per items 1–6; guard all `document`/`window` access so the module still imports under node for the pure tests).

- [ ] **Step 4:** `npm test` PASS. **Step 5: Browser check:** temporary `static/dev-viz.html` that mounts a 2-control dummy instrument; `hugo server` → verify slider tween, keyboard operation, reduced-motion (macOS: System Settings → Accessibility → Display → Reduce motion). Delete the dev file after.
- [ ] **Step 6: Commit** `feat: ovs-viz instrument engine`.

### Task 8: tokens.css + base.css + components.css

**Files:** Create `assets/ovs/css/tokens.css`, `base.css`, `components.css`.

**Interfaces — Produces:** CSS custom properties every template/instrument uses: `--ground, --surface, --ink, --muted, --line, --accent, --accent-ink, --note-bg, --mono, --sans`; classes `ovs-note`, `ovs-clause`, `ovs-chip`, `ovs-table`, `ovs-i-*` (engine controls/readouts), `.byline`.

- [ ] **Step 1:** Extract the palette, type stacks, rules, NOTE-box, chip, and table styles from `docs/design/modern-standard-mockup.html` `<style>` block into the three files: tokens (custom properties, light + `@media (prefers-color-scheme: dark)` redefinitions), base (reset, typography scale, layout containers, focus states, reduced-motion), components (nav, cards, clause numbers, chips, NOTE boxes, tables with `overflow-x:auto` wrappers, instrument control/readout styling).
- [ ] **Step 2:** Accent exactly `#1747c4` light / `#8fb0ff` dark; verify every ink/ground pair ≥ 4.5:1 (spot-check with a contrast calculator).
- [ ] **Step 3: Commit** `feat: ovs design tokens and component styles from D3 mockup`.

### Task 9: Theme skeleton (baseof, head, header, footer, schema, config)

**Files:** Create `themes/ovs/theme.toml`, `layouts/_default/{baseof.html,single.html,list.html}`, `partials/{head.html,header.html,footer.html,schema.html,byline.html}`, `layouts/404.html`; Modify `hugo.toml` (set `theme = "ovs"`, keep `[outputs]` JSON for search index).

**Interfaces — Produces:** blocks `{{ block "main" . }}`; partial contracts: `schema.html` emits JSON-LD by type (`Organization` sitewide, `TechArticle` for research, `WebApplication` for tools, `FAQPage` for questions, `BreadcrumbList` everywhere); `byline.html` renders the exact reviewer string from Global Constraints + published/updated dates.

- [ ] **Step 1:** `head.html`: meta, canonical, OG (keep existing og-image), Hugo pipes bundle of the three CSS files (`resources.Get | resources.Concat | minify | fingerprint`), `<script type="module">` only on pages that declare `instruments: true` front matter.
- [ ] **Step 2:** Header: site name + nav **Questions · Instruments · Research · Standard · About** (Standard → `/governance/`). Footer: pledge NOTE box, methodology/references/contact links, dates.
- [ ] **Step 3:** `hugo.toml`: switch theme, add `[[menu.main]]` entries, keep outputs/index.json.
- [ ] **Step 4: Verify:** `hugo --gc --minify` builds with zero errors; `hugo server` shows every existing page readable (unstyled sections are fine at this point, no 404s). PaperMod is NOT removed yet.
- [ ] **Step 5: Commit** `feat: ovs theme skeleton with E-E-A-T schema and byline partials`.

### Task 10: Homepage template

**Files:** Create `themes/ovs/layouts/index.html`; Reference: current `layouts/index.html` (root — for `/api/ask`, `/api/track`, Turnstile, question-history JS to port) and the mockup (for structure/visuals).

- [ ] **Step 1:** Build the mockup's homepage structure as a Hugo template: hero (identity + I-01 mount point `<div data-instrument="i01">` + ask box) → question cards (list `content/questions/` pages) → instruments grid (list `content/tools/`) → research library table (12 RB papers with tier chips) → trust strip → footer.
- [ ] **Step 2:** Port the ask-box JS from the current root `layouts/index.html` verbatim where possible (Turnstile render, honeypot `website` field, `/api/ask` POST, links dedup, `/api/track`), restyled with citation chips.
- [ ] **Step 3:** Delete root `layouts/index.html` (theme version now owns the page).
- [ ] **Step 4: Verify:** `hugo server` — homepage renders both themes, ask box hits the worker in prod build only (dev: expect network error — acceptable), no horizontal scroll at 375px.
- [ ] **Step 5: Commit** `feat: answer-first homepage on ovs theme`.

### Task 11: Research templates (single + list)

**Files:** Create `themes/ovs/layouts/research/{single.html,list.html}`.

- [ ] **Step 1:** Single: clause-numbered sticky TOC (from `.TableOfContents`, desktop side rail / mobile disclosure), byline partial, dates, tier chip, numbered references section (existing content's reference lists render as-is), `TechArticle` schema.
- [ ] **Step 2:** List: the mockup's tabular research library (ID, title, tier, updated).
- [ ] **Step 3: Verify:** all 12 RB pages + `/research/` build and render; TOC anchors work.
- [ ] **Step 4: Commit** `feat: research paper templates with clause TOC`.

### Task 12: Instrument + question templates and shortcode

**Files:** Create `themes/ovs/layouts/tools/{single.html,list.html}`, `layouts/questions/single.html`, `shortcodes/instrument.html`, `shortcodes/note.html`, `partials/citations.html`; Create `content/questions/_index.md`.

**Interfaces — Produces:** shortcode `{{</* instrument id="i03" preset="island-48" */>}}` renders:

```html
<figure class="ovs-instrument" data-instrument="{{ .Get "id" }}" data-preset="{{ .Get "preset" }}">
  <noscript>{{/* embed static/diagrams/<mapped>.svg inline */}}</noscript>
</figure>
<script type="module">
  import { mount } from '/js/ovs/instruments/{{ .Get "id" }}.mjs';
  document.querySelectorAll('[data-instrument="{{ .Get "id" }}"]').forEach(mount);
</script>
```

- [ ] **Step 1:** Build shortcode with an id→legacy-SVG map for noscript fallbacks (i03→wind-deflection-trajectory.svg, i04→plume-width-by-height.svg, i05→hood-geometry-comparison.svg, i06→velocity-decay-curves.svg, i07→side-panel-effectiveness.svg, i08→indoor-vs-outdoor-comparison.svg, i09→heat-release-rate-comparison.svg, i10→failure-mode-taxonomy.svg; i01/i02 get a one-line noscript text fallback).
- [ ] **Step 2:** Tool single template: instrument full-width + "Method & assumptions" section + related questions/papers; `WebApplication` schema. Question template: answer-first layout, embedded instrument, citations partial (numbered list from front matter `citations: [rb-005, rb-008]`), `FAQPage` schema, byline.
- [ ] **Step 3: Verify:** build clean; a test question page with the shortcode renders figure + noscript.
- [ ] **Step 4: Commit** `feat: instrument shortcode, tool and question templates`.

### Task 13: Search + Standard/About templates

**Files:** Create `themes/ovs/layouts/_default/search.html` (or layout referenced by `content/search.md`), restyle `governance/`, `about/`, `methodology`, `references`, `downloads`, `legal` via `_default/single.html` + a `governance/list.html` if needed. Reference: current search page JS for Fuse + AI toggle contract.

- [ ] **Step 1:** Port search page: Fuse.js over `/index.json` + AI-answer segmented toggle + shared question history (reuse current JS; restyle only).
- [ ] **Step 2:** Standard section list page: numbered document-style index of governance docs.
- [ ] **Step 3: Verify:** search works in `hugo server` (Fuse path), all remaining pages styled, `hugo --gc --minify` zero errors. Remove PaperMod theme dir/submodule and any `[params]` it needed; build again — still zero errors.
- [ ] **Step 4: Commit** `feat: search, standard, about templates; remove PaperMod`.

### Task 14: Instruments I-01 + I-02 (canonical pattern)

**Files:** Create `static/js/ovs/instruments/i01.mjs`, `i02.mjs`; Modify `content/tools/cfm-calculator.md` (front matter: `instruments: true`, add shortcode); create `content/tools/capture-demonstrator.md` (I-01's page, aliased from nothing — new URL). Reference: mockup hero JS (adapt into i01).

**Interfaces — Consumes:** `createInstrument`, physics modules, `hood-presets`. **Produces:** `export function mount(figureEl)` — the contract every later instrument follows; presets parsed from `data-preset="island-48"` (`mount-width`).

- [ ] **Step 1:** i01 (Capture Demonstrator): controls = wind 0–20 mph, width slider (42–72 step 6, detents at model widths), mount segmented (wall/island → depth 36/40), panels segmented. Scene: mockup's Figure-1 line-art hood + plume with dimension lines; update: bend plume via `deflection`, capture readout via `captureFraction` (fmt 'pct'), escaped-wisp rendering past the lip, particles skipped when `ctx.reduced`.
- [ ] **Step 2:** i02 (CFM Requirement): controls = width/mount/exposure/BTU (30k–150k step 10k); readouts = three bands from `requiredCfm` (fmt 'cfm'); scene: horizontal band chart with the three values as dimension-line-annotated bars.
- [ ] **Step 3: Verify in browser:** both instruments on their tool pages — sliders snap to 6", defaults 48" island where preset says so, capture drops with wind and recovers with panels, CFM matches the Task 6 test values (48" wall → 1200/1500/2100), keyboard + reduced-motion OK.
- [ ] **Step 4: Commit** `feat: I-01 capture demonstrator and I-02 CFM instrument`.

### Task 15: Instruments I-03…I-06

**Files:** Create `instruments/i03.mjs` (Wind Deflection — wind + rise sliders, trajectory curve from `deflection` sampled every 2", dimension line shows offset at hood plane), `i04.mjs` (Plume Width — rise slider, growing `plumeRadius` envelope with width readout at height), `i05.mjs` (Hood Geometry — two side-by-side hoods, independent width/depth/mount, capture readouts, "Δ capture" comparison), `i06.mjs` (Velocity Decay — distance slider tracing `centerlineVelocity` curve, fpm readout, marker at capture-velocity threshold 100/150 fpm). Modify the four matching `content/tools/*.md` pages (front matter + shortcode).

- [ ] Steps per instrument: implement `mount()` following the Task 14 pattern → browser-verify interactions and readouts move correctly and monotonically → commit each (`feat: I-0N <name> instrument`), 4 commits.

### Task 16: Instruments I-07…I-10

**Files:** Create `instruments/i07.mjs` (Side Panels — panels segmented + wind slider; show attenuated wind arrow + capture delta via `effectiveWind`/`captureFraction`), `i08.mjs` (Indoor vs Outdoor — environment toggle: indoor assumptions list vs outdoor with wind slider enabled; capture comparison), `i09.mjs` (Heat Release — appliance segmented picker {portable 15k, 3-burner 45k, 4-burner 60k, pro 90k, pro+sear 120k BTU} → `plumeStrength` scales plume height/width scene), `i10.mjs` (Failure Modes + Grease — interactive taxonomy tree: click/keyboard-expand failure branches from rb-007's taxonomy, plus `depositionProfile` heat-strip). Modify matching `content/tools/*.md`.

- [ ] Steps as Task 15: implement → browser-verify → commit each, 4 commits.

### Task 17: Six question pages

**Files:** Create in `content/questions/`: `what-cfm-do-i-need.md`, `does-wind-affect-my-hood.md`, `island-vs-wall-hood.md`, `hood-depth-and-overhang.md`, `do-side-panels-work.md`, `mounting-height.md`.

Front matter per page: `title` (the question verbatim), `summary` (the two-sentence answer), `instruments: true`, `citations: [rb-0xx, …]`, `reviewed: true`, dates.

- [ ] **Step 1:** Write each page in the spec's voice: first two sentences answer the question with concrete numbers (defaults from the hood lineup — e.g., CFM page: "A 48-inch wall hood over a standard 60k BTU grill needs a minimum of about 1,200 CFM, and 1,500 CFM is the recommended target. Island installations and windy sites need more."), then the embedded instrument preset to the scenario, then 2–4 short paragraphs of why, then numbered citations. 300–500 words max per page. No filler, no keyword stuffing.
- [ ] **Step 2:** Cross-link: each question → its instrument page + cited papers; homepage question cards pick these up automatically (Task 10 lists the section).
- [ ] **Step 3: Verify:** pages build, FAQPage schema present (view source), byline renders, instrument presets match the scenario in the text.
- [ ] **Step 4: Commit** `content: six answer-first question pages`.

### Task 18: E-E-A-T & link audit

**Files:** Modify `content/about/_index.md` (or equivalent — entity statement: who runs the site, editorial policy, funding independence, reviewer bio with the exact credential line); any template fixes the audit surfaces.

- [ ] **Step 1:** Validate JSON-LD on one page of each type with `npx -y structured-data-testing-tool` or manual paste into https://validator.schema.org — Organization, Person, TechArticle, WebApplication, FAQPage, BreadcrumbList all parse.
- [ ] **Step 2:** `hugo --gc --minify` then crawl `public/` for broken internal links: `npx -y linkinator ./public --recurse --silent` → zero broken internal links.
- [ ] **Step 3:** Confirm every technical page shows byline + dates; confirm no brand names appear: `grep -ri "rangehoods\|<brand>" content/ themes/ovs/` → only legitimate hits (none expected in content).
- [ ] **Step 4: Commit** `feat: entity/about page and E-E-A-T audit fixes`.

### Task 19: Full build + review-panel gate

**Files:** none new (fixes as needed).

- [ ] **Step 1:** `npm test` → all pass. `hugo --gc --minify` → zero errors/warnings.
- [ ] **Step 2:** Dispatch the adversarial review panel (physics-vs-paper, accessibility, mobile 375px, SEO/schema, performance — per spec §9 item 2) against the built site; fix all confirmed findings; re-run builds/tests.
- [ ] **Step 3:** Lighthouse (Chrome DevTools or `npx -y lighthouse http://localhost:1313 --preset=desktop`) on homepage, one paper, one instrument, one question page: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95.
- [ ] **Step 4: Commit** `fix: review panel findings`.

### Task 20: Staging preview deploy

**Files:** Create `wrangler.preview.jsonc` (copy of `wrangler.jsonc` with `"name": "ovs-v2-preview"`, no custom domain/routes); Modify `src/worker.js` (add `X-Robots-Tag: noindex` response header when `env.PREVIEW === "1"`, set `"vars": { "PREVIEW": "1" }` in the preview config only).

- [ ] **Step 1:** Build: `hugo --gc --minify`. Deploy: `npx wrangler deploy --config wrangler.preview.jsonc` (first run may need `npx wrangler login` — pause and ask Mark if auth is missing).
- [ ] **Step 2:** Smoke: preview URL serves homepage 200; `curl -sI <preview-url> | grep -i x-robots-tag` → `noindex`; `/api/ask` responds; spot-check an instrument on a phone.
- [ ] **Step 3:** Commit `chore: staging preview config`. Push branch: `git push -u origin redesign/v2`.
- [ ] **Step 4:** Hand Mark the walkthrough checklist (homepage, 6 questions, 10 instruments, 3 papers, search, standard/about, both themes, phone + desktop) with the preview URL. **STOP — production merge only on Mark's explicit approval.**

---

## Self-review notes

- Spec coverage: §3 tokens→T8; §4 IA→T9–13, T17; §5 presets→T2 (+detents in T7/T14); §6 E-E-A-T→T9 (schema/byline), T17 (voice), T18 (audit); §7 instruments→T14–16 (I-01…I-10 all assigned); §8 templates→T9–13; §9 gates→T19–20; §11 out-of-scope respected (papers restyled only).
- Type consistency: physics signatures in T3–6 match consumption in T14–16; `mount(figureEl)` contract defined once (T14) and referenced with its signature; `fmt` specs match readout usage.
- Deliberate deviations from bite-size granularity: template tasks (T10–13) and instruments I-03…I-10 (T15–16) specify contract + verification rather than full inline code — the committed mockup is the canonical code reference and each task names its exact physics inputs, controls, and readouts. Executors follow the fully-coded T14 pattern.
