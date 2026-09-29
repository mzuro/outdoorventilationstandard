# Physics re-base — Stage A notes (2026-09-26)

Branch `physics/rebase-stage-a`. Plan: `~/work/ovs-recovery/physics-rebase-PLAN-2026-09-26.md`.
Paper cites are `content/research/<file>.md:line`.

## Paper discrepancies found during Stage A

Cells that do NOT reproduce from the paper's own printed formula within the
plan's tolerance and were not already flagged in the plan (§0/§1). Each is
asserted in the tests as the *computed* value with a `paper_printed:` comment;
no constant was fudged to hit the printed cell.

| # | Paper cell | Printed | Computed (paper formula) | Test | Notes |
|---|---|---|---|---|---|
| 1 | RB-002 Table 3.7, Pellet Smoker High @ 30 in, W_rec (`rb-002:652`) | 54 in | 52.1 in | `tests/plume.test.mjs` "W_rec = 1.38 · d_capture" | Formula with the tabulated z_0 = −0.30 (`rb-001:283`) and D_eff 0.45 gives 1.38·(0.48·1.06+0.45) = 1.32 m = 52 in. The paper's note at `rb-002:632` says all pellet variants share the geometry; it evidently reused Pellet Low's z_0 = −0.38 for all three. Pellet Low reproduces (54.2). |
| 2 | RB-006 Table 3.2b, 36 in / 10 mph (`rb-006:455`) | 0.81 m (32 in) | 29.3 in (29.8 in even with the paper's own hand-rounded u_0 = 1.88 m/s) | `tests/wind.test.mjs` "24 in and 36 in rows" | The plan (§0 finding 5) flagged the 10 mph column at 30 in as reproducing to 1.5 in; at 36 in it does not (2.2–2.7 in). Likely an early application of the (1+0.3·(Fr−1)) correction at Fr 2.38 (`rb-006:430`). |
| 3 | RB-006 Table 3.10, "10 mph, standard hood only" (`rb-006:959`) | 30–40 % | 19.2 % | `tests/capture.test.mjs` "RB-006 Table 3.10 wind rows" | Inside the plan's ±15 pt tolerance to the band edge (10.8 pt) but noted because the 8 mph row (`rb-006:956`, 45–55 %) also computes low (38.8 %). Both are Fr ≥ 1.8 where RB-006 says its linear deflection under-predicts; the printed capture bands were not derived from the printed formula. |
| 4 | RB-011 line 147: `v_s = 0.0271 · d_p² [m/s, d_p in µm]` | 0.0271 | 2.71 × 10⁻⁵ (for d_p in µm) | — (module uses `rb-011:143` in SI) | Units erratum: 0.0271·100² = 271 m/s, not the 0.271 m/s Table 3.3a prints. The SI form at `rb-011:143` and Table 3.3a itself are correct and are what the module reproduces. |
| 5 | RB-006 Table 3.4a, Gas Medium 30 in U_crit (`rb-006:633`) | 6.7 / 9.7 / 12.6 mph | 4.8 / 7.0 / 9.3 mph | `tests/capture.test.mjs` "§3.4 threshold identities" | Already plan §0 finding 4 (table computed with the K = 1.70 hood while labelled OH = 0.42 m). Recorded here because the tests now assert the computed values. |
| 6 | RB-008 App A example step 7 (`rb-008:880`) | 1241 CFM | 1240 CFM | `tests/cfm.test.mjs` "App A worked example" | Within ±0.5 %. The paper rounds CFM_plume to 281 before ×3.68×1.20; the module rounds the wall-mount table value (`round(280.8 × 3.68) = 1033`) before the mount multiplier, which is what RB-008 §3.9 literally instructs (`rb-008:556`: apply the factors "to the CFM values in Tables 3.2a-d"). This ordering is what makes island = 1070 and peninsula = 981 exact (`rb-008:567-568`). |

Plan-flagged items confirmed as flagged (not re-listed above): RB-003 standard-height
velocity rows hand-rounded (f); RB-006 Table 3.2b 15 mph column (k); RB-008 §3.3
blower 1500 for 1394 (j); RB-001 Table 3.2 z_0 not derivable from its formula (h).

## Rounding conventions adopted (so Stage B tables regenerate identically)

- Heights on the papers' 0.01 m grid (`heat.mjs HEIGHT_M`), fallback z·0.0254.
- `requiredCfm`: `table = round(plumeCfm × K_CFM)`, `minimum = round(table × mount)`,
  `blower = smallest of [600, 900, 1200, 1500, 1800, 2100, 2400, 3000] ≥ 1.1 × minimum`.
- `coverageAdvisory`: % of recommended is reckoned against `round(W_rec)` (the paper's whole-inch 57 in).
- Capture is 1-D along the wind axis (RB-006 §3.4 convention); the cross-wind axis is not multiplied in. This is what reproduces RB-008 Table 3.10.

## Removed / renamed exports and who still references them (Stage B checklist)

| Old export | Status in Stage A | Referenced by (shim consumers) | Stage B action |
|---|---|---|---|
| `heat.mjs plumeStrength(btu)` | STAGE-A SHIM → u_0 at 30 in of `sourceForBtu(btu)` (fpm) | `i09.mjs:50,137,212` (as "w0") | Replace with `SOURCES` list + `centerlineVelocity(30, src)`; readouts Q_c and u_0 @30 in |
| `plume.mjs plumeRadius(zIn)` | STAGE-A SHIM → `captureDiameter(zIn, gasMedium)/2` | `i01.mjs:18,209`, `i04.mjs:28,105-116`, `i05.mjs:69,215`, `i07.mjs:34,195`, `i08.mjs:58,255`, `i09.mjs:51,163` | Use `captureDiameter(z, src)` (envelope) / `plumeHalfWidthBT` directly |
| `plume.mjs ENTRAINMENT`, `centerlineVelocity(z, w0, z0)` signature | Removed / signature now `(zIn, src)` | `i06.mjs:126-182` calls `centerlineVelocity(z)` — compatible (defaults to Gas Medium); `i08.mjs:36-37` comment about w0=1 | i06: optional SOURCE control; i08: drop the w0 mechanism |
| `wind.mjs deflection(z, windMph, {w0,z0,dz})` | Now `deflection(zIn, windMph, src)` = 0.35·U·z/u_0 — **includes C_D** | `i01.mjs:185-186,192,207`, `i03.mjs:169-170,187`, `i07.mjs:172,193`, `i08.mjs:248,253` all compute `plumeWind = WIND_COUPLING × wind` and pass it to `deflection()`. With `WIND_COUPLING = C_D` (the first Stage A cut) that applied C_D twice: the DEFLECTION readout, `ctx.physics.deflAtHood` (verdict stamp) and the drawn centreline were all 0.35× short and contradicted `/api/explain` (3″ on screen vs 9.4″ from explain-state at the 4 mph default). **Fixed by setting the shim `WIND_COUPLING = 1`** (review MUST-FIX 1); readouts, verdict and drawing now equal explain-state for the same inputs. | Delete the four pre-multiplies, pass the sheltered wind straight to `deflection()`, then drop the `WIND_COUPLING` export from capture.mjs |
| `capture.mjs WIND_COUPLING` | STAGE-A SHIM = `1` (not C_D — see row above); the real constant is `wind.mjs C_D` | `i01.mjs:17`, `i03.mjs:48`, `i07.mjs:33`, `i08.mjs:60` | Remove after the above |
| `sidepanels.mjs effectiveWind(mph, 'none'|'one'|'both')` | Legacy string form accepted as STAGE-A SHIM; `'one'` → `'none'` | `i01.mjs:181`, `i03.mjs:165`, `i07.mjs:171,243,312,318` | Call `effectiveWind(mph, {panels, dir, mount})`; remove the ONE option from `i01.mjs:301` and any i07 control |
| `capture.mjs captureFraction({...panels:'one'})` | `'one'` treated as `'none'` | `i01.mjs:187`, `i05.mjs:318-321`, `i07.mjs:174-177`, `i08.mjs:233` | Pass `windDir` (i01 gains SIDE/REAR; i05 = REAR; i07/i08 = SIDE) and `src` |
| `cfm.mjs requiredCfm({widthIn, btu, mount, exposure})` → `.recommended/.highWind` | Legacy shape accepted (btu → `sourceForBtu`, widthIn ignored); `.recommended` = blower, `.highWind` = exposed table × mount | `i02.mjs:232-241,364-365`, `gradeRatedCfm` reads `.recommended/.minimum` (`i02.mjs:66-67`), `buildSpecLine` (`i02.mjs:113-114`) | Rebuild i02 on `{src, riseIn, mount, exposure, panels}` → MINIMUM/BLOWER/K_CFM/PLUME FLOW readouts + `coverageAdvisory` group; `gradeRatedCfm`: ≥blower PASS, ≥minimum MARGINAL; spec line "60k gas · 30 in · wall · moderate → min 892 / blower 1,200 CFM" |
| `grease.mjs depositionProfile(riseIn, steps)` | STAGE-A SHIM (normalized (u_0(z)/u_0(1))² strip, no paper basis) | `i10.mjs:45,200,211` | Replace i10's strip with particle-size zones from `stokesSettling` / `groundContactDistance` |
| `smoke.mjs` state key `w0`, `panels:'one'` | Ignored | `i01.mjs:332`, `i03.mjs:252`, `i05.mjs:341,344`, `i07.mjs:299`, `i08.mjs:342`, `i09.mjs:219` | Drop `w0`; pass `windDir`/`src` where the instrument has them |
| `smoke.mjs particleCaptured({depthOff, widthOff})` | Now `({windOff}, {xc, ohUp, ohDown})` | tests only | — |
| `src/lib/params.mjs` i01 `panels:'one'` | Rejected (400) | `static/js/ovs/explain-ui.mjs` sends the live i01 state; a user who selects ONE gets a 400 until i01 drops the option | Stage B i01 |
| `src/lib/params.mjs` i02 `btu`, `width` | Optional STAGE-A SHIM keys; `source`/`height`/`panels` optional-with-default | `static/js/ovs/explain-ui.mjs:12` PARAM_MAP still maps `i02-btu`/`i02-width` | Update PARAM_MAP to `source/height/mount/exposure/panels/width`; then make `source` required and delete `btu` |
| KV cache keys | `explain:v2:…`, `ask:v2:…` (`static/js/ovs/physics/version.mjs`) | `src/worker.js:475`, `src/lib/normalize.mjs` | Bump `PHYSICS_VERSION` again if Stage B changes any computed value |

Other Stage B reminders surfaced while implementing:
- The first Stage A cut shipped `WIND_COUPLING = C_D`; the adversarial review caught the double application (see the wind.mjs row). Stage B must not "restore" 0.35 here — the constant belongs only in `wind.mjs`.
- `static/js/ovs/hood-presets.mjs` MOUNT depths (36/40) are the *hood* depths the instruments draw; the capture model now also needs the *cooking* depth (from `SOURCES[*].cookDIn`) for rear wind — already wired through `src`.
- `tests/i02.test.mjs` uses hand-built bands `{minimum, recommended, highWind}`; retarget to `{minimum, blower}` when `gradeRatedCfm` changes.
- `content/tools/*.md` reference tables and `static/data/*.csv` are untouched (Stage B4 generator).
