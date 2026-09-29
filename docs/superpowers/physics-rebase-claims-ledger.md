# Physics re-base — claims ledger (Stage B content)

Generated 2026-09-29 by `node scripts/physics-claims-ledger.mjs`. Every hand-written numeric
claim on the 9 live question pages and 11 tool pages, recomputed from
`static/js/ovs/physics/*.mjs` and checked for presence in the page text. The generated
"Reference readings" tables and the three CSVs are verified separately by
`node scripts/generate-reference-tables.mjs --check`. Rows whose module call reads
"paper: …" quote a printed paper cell that no module computes; verify them against the
paper line, not here.

Claims: 172; verified ✓: 172; ✗: 0.

| page | claim text | module call | value | citation | status |
|---|---|---|---|---|---|
| questions/what-cfm-do-i-need.md | needs at least **892 CFM** | requiredCfm({src:gasLarge,riseIn:30,mount:'wall',exposure:'moderate'}).minimum | 892 | RB-008 §3.3 | ✓ |
| questions/what-cfm-do-i-need.md | and a **1,200 CFM blower** | … .blower | 1,200 | RB-008 §3.3, App. A step 8 | ✓ |
| questions/what-cfm-do-i-need.md | minimums are 727 CFM sheltered, 892 CFM moderate, 1,004 CFM exposed with side panels, and 1,394 CFM exposed without | requiredCfm(gasLarge, 30, wall, 'sheltered').minimum; … 'moderate'; … 'exposed', panels 'both' (RB-008 v1.0 printed 1,003; v1.1 prints 1,004); … 'exposed', panels 'none' | 727 / 892 / 1,004 / 1,394 | RB-008 §3.3 | ✓ |
| questions/what-cfm-do-i-need.md | with blowers of 900, 1,200, 1,200 and 1,800 CFM | .blower sheltered; .blower moderate; .blower exposed+panels; .blower exposed (RB-008 v1.0 printed 1,500; v1.1 prints 1,800 under App. A step 8) | 900 / 1,200 / 1,200 / 1,800 | RB-008 §3.3, App. A step 8 | ✓ |
| questions/what-cfm-do-i-need.md | only 8% above the minimum | 1500 / minimum(exposed) − 1 | 8 | RB-008 §3.3 (v1.0 erratum j; v1.1 prints 1,800) | ✓ |
| questions/what-cfm-do-i-need.md | needs about **1,070 CFM minimum** | requiredCfm(… mount:'island').minimum | 1,070 | RB-008 §3.9 | ✓ |
| questions/what-cfm-do-i-need.md | times the 1.20 island multiplier | MOUNT_MULT.island | 1.20 | RB-008 §3.9 | ✓ |
| questions/what-cfm-do-i-need.md | a peninsula takes 1.10, or 981 CFM | MOUNT_MULT.peninsula; requiredCfm(… mount:'peninsula').minimum | 1.10 / 981 | RB-008 §3.9 | ✓ |
| questions/what-cfm-do-i-need.md | about 242 CFM of bare plume | plumeCfm(30, gasLarge) | 242 | RB-008 Table 3.1 | ✓ |
| questions/what-cfm-do-i-need.md | K_CFM = 3.0, 3.68, 4.14 or 5.75 | K_CFM.sheltered; K_CFM.moderate; K_CFM.exposedPanels; K_CFM.exposed | 3.0 / 3.68 / 4.14 / 5.75 | RB-008 §2.2 | ✓ |
| questions/what-cfm-do-i-need.md | needs 667 CFM at 24 inches and 1,150 CFM at 36 inches | requiredCfm(gasLarge, 24, moderate).minimum; … 36 | 667 / 1,150 | RB-008 Table 3.2b | ✓ |
| questions/what-cfm-do-i-need.md | only from 747 to 892 CFM, about 19% | requiredCfm(gasMedium, 30, moderate).minimum; requiredCfm(gasLarge, 30, moderate).minimum; ratio − 1 | 747 / 892 / 19 | RB-008 Table 3.2b, §2.4 | ✓ |
| questions/what-cfm-do-i-need.md | an 80,000 BTU grill needs 1,019 CFM | requiredCfm(gasHigh, 30, moderate).minimum | 1,019 | RB-008 Table 3.2b | ✓ |
| questions/what-cfm-do-i-need.md | is 62 inches wide (RB-002 Table 3.7) | recommendedWidth(30, gasLarge) | 62 | RB-002 Table 3.7 | ✓ |
| questions/what-cfm-do-i-need.md | is 77% of that | coverageAdvisory(48, 30, gasLarge).pctOfRecommended | 77 | RB-008 Table 3.10 | ✓ |
| questions/what-cfm-do-i-need.md | RB-008 Table 3.10 rates capture at 65–75% at best | paper: printed band | — | RB-008 Table 3.10 (42″ row, Gas Medium basis; coverageAdvisory applies the band to Gas Large) | ✓ |
| questions/what-cfm-do-i-need.md | 1 CFM per 100 BTU gives 600 CFM for this grill | paper: 60,000 / 100 | — | RB-008 §2.3 | ✓ |
| questions/what-cfm-do-i-need.md | arriving at the hood at 200–535 fpm | paper: printed range (v1.1: 200-535 fpm; RB-001 Table 3.5) | — | RB-003 §4.1 | ✓ |
| questions/what-cfm-do-i-need.md | can run a face velocity of 29 fpm | paper: printed example | — | RB-003 §4.1 | ✓ |
| questions/what-cfm-do-i-need.md | multiplier rises to 5.75 — 1,394 CFM here | K_CFM.exposed; minimum exposed | 5.75 / 1,394 | RB-008 §2.2, §3.3 | ✓ |
| questions/what-cfm-do-i-need.md | cut the multiplier to 4.14, a 28% reduction, and bring the minimum to 1,004 CFM | K_CFM.exposedPanels; 1 − 4.14/5.75; minimum exposed+panels | 4.14 / 28 / 1,004 | RB-008 §2.2 | ✓ |
| questions/what-cfm-do-i-need.md | description: "A 60,000 BTU grill at a 30-inch wall mount needs 892 CFM minimum in moderate wind and a 1,200 CFM blower; on an island, 1,070 CFM | minimum; blower; island minimum | 892 / 1,200 / 1,070 | RB-008 §3.3, §3.9 | ✓ |
| questions/mounting-height.md | is about **412 fpm**; at 30 inches, about **393 fpm**; at 36 inches, about **377 fpm** | centerlineVelocity(24, gasMedium); … 30; … 36 | 412 / 393 / 377 | RB-003 Table 3.1a/b, regenerated (paper prints 417/392/370) | ✓ |
| questions/mounting-height.md | keeps about 178 fpm at 72 inches (RB-003 Table 3.1b; v1.0 printed 179) | centerlineVelocity(72, pelletLow) | 178 | RB-003 §3.1 | ✓ |
| questions/mounting-height.md | needs 550 CFM at 24 inches, 747 at 30 and 972 at 36 | requiredCfm(gasMedium, 24, moderate).minimum; … 30; … 36 | 550 / 747 / 972 | RB-008 Table 3.2b | ✓ |
| questions/mounting-height.md | from 383 to 1,518 CFM | requiredCfm(gasMedium, 18, moderate).minimum; … 48 | 383 / 1,518 | RB-008 Table 3.2b, §2.4 | ✓ |
| questions/mounting-height.md | about 38.6 inches at 24 inches, 41.4 at 30 and 44.3 at 36 | captureDiameter(24, gasMedium); … 30; … 36 | 38.6 / 41.4 / 44.3 | RB-002 Table 3.3a | ✓ |
| questions/mounting-height.md | grows from about 15 to 17 to 19 inches per side | (recommendedWidth(24) − 24)/2; … 30; … 36 | 15 / 17 / 19 | RB-005 §3.1, Table 3.1b | ✓ |
| questions/mounting-height.md | about 9.0 inches by 24 inches of rise, 11.7 by 30 and 14.7 by 36 | deflection(24, 5, gasMedium); … 30; … 36 | 9.0 / 11.7 / 14.7 | RB-006 Table 3.2b (prints 9/12/15) | ✓ |
| questions/mounting-height.md | reads 83% at 18 inches, 67% at 24, 51% at 30 and 38% at 36 | captureFraction(48×40 island, side, 5 mph, rise 18); … rise 24; … rise 30; … rise 36 | 83 / 67 / 51 / 38 | RB-006 §3.4 model | ✓ |
| questions/mounting-height.md | requirements escalate to 417–1,623 CFM across the source range | paper: printed range | — | RB-003 §4.2 | ✓ |
| questions/mounting-height.md | RB-003 Table 3.1b v1.0 printed 417, 392 and 370 | paper: superseded printed cells | — | RB-003 Table 3.1b (v1.0 cells; v1.1 prints 412/393/377 = module values) | ✓ |
| questions/mounting-height.md | description: "Plume velocity falls only from 412 fpm at 24 inches to 377 fpm at 36 | centerlineVelocity(24); centerlineVelocity(36) | 412 / 377 | RB-003 Table 3.1b regenerated | ✓ |
| questions/does-wind-affect-my-hood.md | about **87% of the plume in still air**, **51% at 5 mph**, and roughly **8% at 10 mph** | captureFraction(48×40 island, side, 0 mph); … 5 mph; … 10 mph | 87 / 51 / 8 | RB-006 §3.4 | ✓ |
| questions/does-wind-affect-my-hood.md | at 5.75 times the bare plume flow | K_CFM.exposed | 5.75 | RB-008 §3.3 | ✓ |
| questions/does-wind-affect-my-hood.md | by δ = 0.35 · U_w · z / u_0(z) | C_D | 0.35 | RB-006 §3.1 | ✓ |
| questions/does-wind-affect-my-hood.md | deflects the centerline about 11.7 inches (RB-006 Table 3.2b prints 12) | deflection(30, 5, gasMedium) | 11.7 | RB-006 Table 3.2b | ✓ |
| questions/does-wind-affect-my-hood.md | by exactly 12 inches per side | (48 − cookWIn 24)/2 | 12 | RB-002 App. A.4 | ✓ |
| questions/does-wind-affect-my-hood.md | By 10 mph the deflection is 23.5 inches (RB-006 Table 3.2b prints 23) | deflection(30, 10, gasMedium) (Table 3.2b v1.1 prints 0.60 m / 23 in; v1.0 printed 0.63 m / 25 in) | 23.5 | RB-006 Table 3.2b | ✓ |
| questions/does-wind-affect-my-hood.md | reads 83% at 18 inches against 51% at 30 | captureFraction(… rise 18, 5 mph); … rise 30 | 83 / 51 | model | ✓ |
| questions/does-wind-affect-my-hood.md | cut the wind the plume feels by 60% — it experiences 40% of the ambient speed | panelReduction({panels:'both', f:0.67, dir:'side'}); 1 − R | 60 / 40 | RB-009 Table 3.1a | ✓ |
| questions/does-wind-affect-my-hood.md | from 51% to 80% and the 8 mph reading from 20% to 70% | capture 5 mph; … panels both; capture 8 mph; … panels both | 51 / 80 / 20 / 70 | RB-009 Table 3.1a + RB-006 §3.4 | ✓ |
| questions/does-wind-affect-my-hood.md | recommended 57-inch width for this grill reads 72% at 5 mph, and 93% with panels | recommendedWidth(30, gasMedium); captureFraction(57 island, side, 5); … panels both | 57 / 72 / 93 | RB-006 Table 3.10 (prints 70–75 / 88–92) | ✓ |
| questions/does-wind-affect-my-hood.md | cuts that wind by 60–80% | paper: printed range | — | RB-006 §3.9.2 | ✓ |
| questions/does-wind-affect-my-hood.md | description: "Yes — modeled capture at a 48-inch island hood falls from 87% in still air to 51% at 5 mph and 8% at 10 mph | capture 0; capture 5; capture 10 | 87 / 51 / 8 | RB-006 §3.4 model | ✓ |
| questions/island-vs-wall-hood.md | gives a 48-inch wall hood about 97% in calm air and a same-width island hood about 76% | captureFraction(48×36 wall, rear, 0); captureFraction(48×40 island, rear, 0) | 97 / 76 | RB-006 §3.4, §3.9.2 (rear-wind axis) | ✓ |
| questions/island-vs-wall-hood.md | still holds roughly **88%** while the island hood falls to roughly **12%** | wall rear 8 mph; island rear 8 mph | 88 / 12 | RB-006 §3.9.2; RB-005 §3.4.4 | ✓ |
| questions/island-vs-wall-hood.md | both mounts read about 87% in still air and 20% at 8 mph | side wind 0; side wind 8 | 87 / 20 | model | ✓ |
| questions/island-vs-wall-hood.md | applies the 70% midpoint | R_WALL | 70 | RB-006 §3.9.2 | ✓ |
| questions/island-vs-wall-hood.md | only 9.5 inches of front-to-back overhang | (40 − cookDIn 21)/2 | 9.5 | RB-002 App. A.4 | ✓ |
| questions/island-vs-wall-hood.md | recommended depth for this grill at 30 inches is 53 inches | paper: printed cell | — | RB-002 Table 3.6b (D_min) | ✓ |
| questions/island-vs-wall-hood.md | reads about 95% in calm air and 70% in a 5 mph rear wind in the model, against 76% and 39% | captureFraction(57×53 island, rear, 0); … 5 mph; 48×40 island rear 0; … 5 mph | 95 / 70 / 76 / 39 | model | ✓ |
| questions/island-vs-wall-hood.md | the same 57 × 53 hood reads about 96% in still air along its side-wind axis | captureFraction(57×40 island, side, 0) — width-only aperture, depth irrelevant on this axis | 96 | model (side-wind axis) | ✓ |
| questions/island-vs-wall-hood.md | (60% reduction at two-thirds depth) but do little against wind from the front or rear (15% | panelReduction side f=0.67; panelReduction rear f=0.67 | 60 / 15 | RB-009 Table 3.1a | ✓ |
| questions/island-vs-wall-hood.md | needs 892 CFM on a wall needs 1,070 on an island | minimum wall; minimum island | 892 / 1,070 | RB-008 §3.9 | ✓ |
| questions/island-vs-wall-hood.md | description: "In an 8 mph wind from behind, a 48-inch wall hood holds 88% modeled capture; the same hood on an island drops to 12% | wall rear 8; island rear 8 | 88 / 12 | model | ✓ |
| questions/hood-depth-and-overhang.md | is about **27 inches** at the surface | captureDiameter(0, gasMedium) | 27 | RB-002 App. A.3 | ✓ |
| questions/hood-depth-and-overhang.md | grown to about **41 inches**; by 48 inches, about **50 inches** | captureDiameter(30); captureDiameter(48) | 41 / 50 | RB-002 Table 3.3a | ✓ |
| questions/hood-depth-and-overhang.md | 17 inches for this grill, which is how RB-002 arrives at its 57-inch recommended width | (recommendedWidth(30) − 24)/2; recommendedWidth(30) | 17 / 57 | RB-002 Table 3.7; RB-005 §3.1 | ✓ |
| questions/hood-depth-and-overhang.md | 15 inches of overhang beyond the cooking surface at each end; in the capture model it reads about 94% in still air and 66% in a 5 mph side wind | (54 − 24)/2; captureFraction(54×40 island, side, 0); … 5 mph | 15 / 94 / 66 | model | ✓ |
| questions/hood-depth-and-overhang.md | 11.7 inches of centerline deflection at 30 inches | deflection(30, 5) | 11.7 | RB-006 Table 3.2b | ✓ |
| questions/hood-depth-and-overhang.md | about 36% for a 42-inch island hood, 51% at 48 inches, 66% at 54, 78% at 60 and 94% at 72 inches | capture 42 @5; 48; 54; 60; 72 | 36 / 51 / 66 / 78 / 94 | model | ✓ |
| questions/hood-depth-and-overhang.md | has only 9.5 inches of overhang each way and reads about 39% in a 5 mph rear wind | (40 − 21)/2; captureFraction(48×40 island, rear, 5) | 9.5 / 39 | model | ✓ |
| questions/hood-depth-and-overhang.md | 11 to 26 inches per side | paper: printed range | — | RB-005 §3.1 | ✓ |
| questions/hood-depth-and-overhang.md | description: "The plume over a medium gas grill is 27 inches across at the grate and 41 by a 30-inch mount | captureDiameter(0); captureDiameter(30) | 27 / 41 | RB-002 Table 3.3a | ✓ |
| questions/do-side-panels-work.md | about **20% with no side panels** to about **70% with panels on both sides**; at 5 mph, from 51% to 80% | capture 8 mph; … panels both; capture 5 mph; … panels both | 20 / 70 / 51 / 80 | RB-009 Table 3.1a + RB-006 §3.4 | ✓ |
| questions/do-side-panels-work.md | wind-reduction coefficient of 0.60 against a lateral wind | panelReduction({panels:'both', f:0.67, dir:'side'}) | 0.60 | RB-009 Table 3.1a | ✓ |
| questions/do-side-panels-work.md | **40% of the ambient speed** — 3.2 mph in an 8 mph breeze | 1 − R; effectiveWind(8, {panels:'both', dir:'side'}) | 40 / 3.2 | RB-009 §3.1 | ✓ |
| questions/do-side-panels-work.md | centerline's 18.8-inch excursion at 8 mph shrinks to about 7.5 inches | deflection(30, 8); deflection(30, 3.2) | 18.8 / 7.5 | RB-006 §3.1 | ✓ |
| questions/do-side-panels-work.md | hood's 12-inch overhang | (48 − 24)/2 | 12 | RB-002 App. A.4 | ✓ |
| questions/do-side-panels-work.md | cut the wind by only about 15% | panelReduction rear f=0.67 | 15 | RB-009 Table 3.1a | ✓ |
| questions/do-side-panels-work.md | drops from 5.75 without panels to 4.14 with them — a 28% reduction | K_CFM.exposed; K_CFM.exposedPanels; 1 − 4.14/5.75 | 5.75 / 4.14 / 28 | RB-008 §2.2 | ✓ |
| questions/do-side-panels-work.md | means 1,004 CFM instead of 1,394 | minimum exposed+panels; minimum exposed | 1,004 / 1,394 | RB-008 §3.3 | ✓ |
| questions/do-side-panels-work.md | description: "Yes — on a 48-inch island hood in an 8 mph side wind, panels on both sides lift modeled capture from about 20% to 70% | capture 8; … both | 20 / 70 | model | ✓ |
| questions/what-size-hood-for-my-grill.md | is about **27 inches** at the grate and widens as it rises: roughly **41 inches** by a 30-inch mounting height and **50 inches** by 48 inches | captureDiameter(0); captureDiameter(30); captureDiameter(48) | 27 / 41 / 50 | RB-002 Table 3.3a | ✓ |
| questions/what-size-hood-for-my-grill.md | a base margin of 1.38 for turbulent intermittency | K_BASE | 1.38 | RB-002 §3.5 | ✓ |
| questions/what-size-hood-for-my-grill.md | a **57-inch** hood at 30 inches over this grill | recommendedWidth(30, gasMedium) | 57 | RB-002 Table 3.7 | ✓ |
| questions/what-size-hood-for-my-grill.md | 0.48 inch of diameter per inch of rise | (captureDiameter(48) − captureDiameter(24))/24 | 0.48 | RB-002 App. A.3 | ✓ |
| questions/what-size-hood-for-my-grill.md | the capture diameter at a 30-inch mount is 48 inches | captureDiameter(30, gasHigh) | 48 | RB-002 §3.6 (W_min); RB-005 Table 3.1a | ✓ |
| questions/what-size-hood-for-my-grill.md | about 9.5 inches at that height (RB-006 Table 3.2d prints 10) | deflection(30, 5, gasHigh) | 9.5 | RB-006 Table 3.2d | ✓ |
| questions/what-size-hood-for-my-grill.md | is 67 inches — about 15 inches of overhang per side | recommendedWidth(30, gasHigh); (W_rec − 36)/2 | 67 / 15 | RB-002 Table 3.7 | ✓ |
| questions/what-size-hood-for-my-grill.md | give 51 inches over a small gas grill, 57 over a medium, 62 over a large and 67 over a high-output | recommendedWidth(30, gasSmall); … gasMedium; … gasLarge; … gasHigh | 51 / 57 / 62 / 67 | RB-002 Table 3.7 | ✓ |
| questions/what-size-hood-for-my-grill.md | is 84% of the 57-inch recommendation | coverageAdvisory(48, 30, gasMedium).pctOfRecommended; recommendedWidth(30) | 84 / 57 | RB-008 Table 3.10 | ✓ |
| questions/what-size-hood-for-my-grill.md | reads about 87%; in a 5 mph side wind it reads about 51%, against 72% for the 57-inch hood and 94% for a 72-inch one | capture 48 @0; 48 @5; 57 @5; 72 @5 | 87 / 51 / 72 / 94 | model | ✓ |
| questions/what-size-hood-for-my-grill.md | 15–20 inches per side at 30 inches for all source types | paper: printed range | — | RB-005 §3.1 | ✓ |
| questions/what-size-hood-for-my-grill.md | 6 to 12 inches per side (RB-010 Gap S-5) | paper: printed range | — | RB-010 Gap S-5 | ✓ |
| questions/what-size-hood-for-my-grill.md | description: "Size to the plume, not the grill: over a medium gas grill at a 30-inch mount the capture diameter is 41 inches and the recommended hood 57 | captureDiameter(30); recommendedWidth(30) | 41 / 57 | RB-002 Table 3.3a, 3.7 | ✓ |
| questions/can-i-use-an-indoor-range-hood-outside.md | reads about 87% capture in still, indoor-like air, but about 20% in an 8 mph crosswind | captureFraction(48×40 island, side, 0); … 8 mph | 87 / 20 | model | ✓ |
| questions/can-i-use-an-indoor-range-hood-outside.md | needs 727 CFM even sheltered and 892 CFM in moderate exposure | minimum sheltered; minimum moderate | 727 / 892 | RB-008 §3.3 | ✓ |
| questions/can-i-use-an-indoor-range-hood-outside.md | call for 11–26 inches per side | paper: printed range | — | RB-005 §3.1 | ✓ |
| questions/does-an-outdoor-hood-need-a-duct.md | outdoor exhaust rates of 727-892 CFM | minimum sheltered; minimum moderate | 727 / 892 | RB-008 §3.3 | ✓ |
| tools/capture-demonstrator.md | from about 87% in still air to 51% at 5 mph and 20% at 8 mph | side 0; side 5; side 8 | 87 / 51 / 20 | RB-006 §3.4 model | ✓ |
| tools/capture-demonstrator.md | the 12 inches of overhang beyond each end | (48 − 24)/2 | 12 | RB-002 App. A.4 | ✓ |
| tools/capture-demonstrator.md | about 87% end to end (the side-wind axis, 12 inches beyond each end of the cooking surface) | captureFraction(48×40 island, side, 0); (48 − 24)/2 | 87 / 12 | model (side-wind axis) | ✓ |
| tools/capture-demonstrator.md | about 97% for the wall hood and 76% for the island — not a two-dimensional capture | captureFraction(48×36 wall, rear, 0); captureFraction(48×40 island, rear, 0) | 97 / 76 | model (rear-wind axis) | ✓ |
| tools/capture-demonstrator.md | still holds about 88% at 8 mph while the island hood — with only 9.5 inches of front-to-back overhang on each side — has fallen to about 12% | wall rear 8; (40 − 21)/2; island rear 8 | 88 / 9.5 / 12 | RB-006 §3.9.2 model | ✓ |
| tools/capture-demonstrator.md | is 57 inches wide by 53 inches deep | recommendedWidth(30) (53 in depth = RB-002 Table 3.6b, paper) | 57 | RB-002 Tables 3.6b, 3.7 | ✓ |
| tools/capture-demonstrator.md | the 48-inch preset is 84% of that width | coverageAdvisory(48,30).pctOfRecommended | 84 | RB-008 Table 3.10 | ✓ |
| tools/capture-demonstrator.md | about 96% in still air and 72% at 5 mph | captureFraction(57 island, side, 0); … 5 | 96 / 72 | RB-006 Table 3.10 (>95 / 70–75) | ✓ |
| tools/capture-demonstrator.md | leaves 16 inches of overhang front and back, the same island hood reads about 95% in still air | (53 − 21)/2; captureFraction(57×53 island, rear, 0) | 16 / 95 | model (rear-wind axis) | ✓ |
| tools/cfm-calculator.md | needs a minimum of 892 CFM under moderate wind exposure and a 1,200 CFM blower | minimum; blower | 892 / 1,200 | RB-008 §3.3 | ✓ |
| tools/cfm-calculator.md | Sheltered sites need 727 CFM (900 CFM blower); an exposed site with side panels needs 1,004 CFM | sheltered min; sheltered blower; exposed+panels min (paper 1,003) | 727 / 900 / 1,004 | RB-008 §3.3 | ✓ |
| tools/cfm-calculator.md | without panels 1,394 CFM | exposed min | 1,394 | RB-008 §3.3 | ✓ |
| tools/cfm-calculator.md | only 8% above the minimum | 1500/1394 − 1 | 8 | RB-008 §3.3 (v1.0 erratum j; v1.1 prints 1,800) | ✓ |
| tools/cfm-calculator.md | v1.1 corrects it to 1,800 CFM under | blower exposed | 1,800 | RB-008 App. A step 8 | ✓ |
| tools/cfm-calculator.md | 892 becomes 1,070 CFM, still served by a 1,200 CFM blower | wall min; island min; island blower | 892 / 1,070 / 1,200 | RB-008 §3.9 | ✓ |
| tools/cfm-calculator.md | from 475 CFM at 18 inches to 1,775 CFM at 48 | requiredCfm(gasLarge, 18).minimum; … 48 | 475 / 1,775 | RB-008 Table 3.2b | ✓ |
| tools/cfm-calculator.md | adds about 19% | 892/747 − 1 | 19 | RB-008 §2.4 | ✓ |
| tools/cfm-calculator.md | 3.0 sheltered, 3.68 moderate, 4.14 exposed with side panels, 5.75 exposed without | K_CFM | 3.0 / 3.68 / 4.14 / 5.75 | RB-008 §2.2 | ✓ |
| tools/cfm-calculator.md | Wall 1.00, peninsula 1.10, island 1.20 | MOUNT_MULT | 1.00 / 1.10 / 1.20 | RB-008 §3.9 | ✓ |
| tools/cfm-calculator.md | honestly above 1,364 CFM | BLOWER_SIZES[3] / BLOWER_MARGIN | 1,364 | RB-008 §3.11 + App. A step 8 | ✓ |
| tools/cfm-calculator.md | W_rec = 1.38 × capture diameter | K_BASE | 1.38 | RB-002 §3.6 | ✓ |
| tools/cfm-calculator.md | delivers itself at 200–535 fpm | paper: printed range (v1.1: 200-535 fpm; RB-001 Table 3.5) | — | RB-003 §4.1 | ✓ |
| tools/cfm-calculator.md | face velocity of about 29 fpm | paper: printed example | — | RB-003 §4.1 | ✓ |
| tools/wind-deflection-trajectory.md | about 11.7 inches (RB-006 Table 3.2b prints 12) | deflection(30, 5) | 11.7 | RB-006 Table 3.2b | ✓ |
| tools/wind-deflection-trajectory.md | RB-002 Table 3.6b prints 17, footnoting the exact 16.5 | paper: printed cell; footnote = (W_rec − 24)/2 | — | RB-002 Table 3.6b v1.1 (30″ OH cell 0.42 / 17″ + footnote; RB-005 Table 3.1b prints 17) | ✓ |
| tools/wind-deflection-trajectory.md | about 18.8 inches (Table 3.2b: 19) | deflection(30, 8) | 18.8 | RB-006 Table 3.2b | ✓ |
| tools/wind-deflection-trajectory.md | roughly 1.8× farther at a 48-inch mounting height than at 30 inches (21.1 versus 11.7 inches at 5 mph) | deflection(48,5)/deflection(30,5); deflection(48, 5); deflection(30, 5) | 1.8 / 21.1 / 11.7 | RB-006 §3.1 | ✓ |
| tools/wind-deflection-trajectory.md | the 12 mph deflection (28.2 inches) is four times the 3 mph deflection (7.0 inches) | deflection(30, 12); deflection(30, 3) | 28.2 / 7.0 | RB-006 §3.1 | ✓ |
| tools/wind-deflection-trajectory.md | RB-006 Table 3.4a v1.1 prints 4.8, 7.0 and 9.3 mph for this row | criticalWinds(57 island).u25; … .uCenterline; … .u50 | 4.8 / 7.0 / 9.3 | RB-006 Table 3.4a (v1.1, Revision history) | ✓ |
| tools/wind-deflection-trajectory.md | (3.8, 7.0 and 12.7 inches) are the RB-003 benchmark | deflection(18, 3); deflection(30, 3); deflection(48, 3) | 3.8 / 7.0 / 12.7 | RB-006 §3.1 (benchmark 4/7/12) | ✓ |
| tools/wind-deflection-trajectory.md | the 25%-escape wind at about 4.8 mph and centerline exit at about 7.0 mph | criticalWinds(57 island).u25; … .uCenterline | 4.8 / 7.0 | RB-006 §3.4 identities (Table 3.4a v1.0 printed 6.7/9.7; v1.1 prints 4.8/7.0) | ✓ |
| tools/wind-deflection-trajectory.md | Fr > 2.7 at every standard height by 15 mph | FR_DISRUPTED; min froude(18..48, 15) = 3.03 | 2.7 | RB-006 §3.8, Table 3.8 | ✓ |
| tools/plume-width-by-height.md | already about 27 inches at the cooking surface | captureDiameter(0) | 27 | RB-002 App. A.3 | ✓ |
| tools/plume-width-by-height.md | grows to about 41.4 inches by a 30-inch mounting height (RB-002 Table 3.3a prints 1.05 m, 41 inches) and 50.1 inches by 48 inches | captureDiameter(30); captureDiameter(48) | 41.4 / 50.1 | RB-002 Table 3.3a | ✓ |
| tools/plume-width-by-height.md | linear at 0.48 inch of diameter per inch of rise | (captureDiameter(48) − captureDiameter(24))/24 | 0.48 | RB-002 App. A.3 | ✓ |
| tools/plume-width-by-height.md | is 1.38 × the capture diameter — 57 inches at 30 inches over this grill | K_BASE; recommendedWidth(30) | 1.38 / 57 | RB-002 §3.6, Table 3.7 | ✓ |
| tools/plume-width-by-height.md | about 17 inches per side at that height | (W_rec − 24)/2 | 17 | RB-005 §3.1 | ✓ |
| tools/plume-width-by-height.md | from about 37 inches (small gas grill) to 48 inches (high-output gas grill) | captureDiameter(30, gasSmall); captureDiameter(30, gasHigh) | 37 / 48 | RB-002 §3.6 W_min | ✓ |
| tools/plume-width-by-height.md | capture diameter at 30 inches is about 45 inches — wider than the 41 inches over the 24-inch medium gas grill | captureDiameter(30, charcoalKettle); captureDiameter(30, gasMedium) | 45 / 41 | RB-002 §4.3 | ✓ |
| tools/hood-geometry-comparison.md | holds about 88% and the island hood about 12% across the entire lineup | wall rear 8 (width-independent); island rear 8 | 88 / 12 | RB-006 §3.4 model | ✓ |
| tools/hood-geometry-comparison.md | The 76-point gap | difference of the printed (rounded) percentages | 76 | model | ✓ |
| tools/hood-geometry-comparison.md | from about 11% at 42 inches to 74% at 72 inches | side 8, 42; side 8, 72 | 11 / 74 | model | ✓ |
| tools/hood-geometry-comparison.md | has grown to 41 inches | captureDiameter(30) | 41 | RB-002 Table 3.3a, 3.9 | ✓ |
| tools/hood-geometry-comparison.md | sits 17 inches inside the 41-inch plume | d_capture − 24; d_capture | 17 / 41 | RB-002 Table 3.3a | ✓ |
| tools/hood-geometry-comparison.md | Minimum geometry (9-inch overhang per side) | (d_capture − 24)/2 | 9 | RB-005 Table 3.1a | ✓ |
| tools/hood-geometry-comparison.md | a 42-inch hood in still air reads about 74% | captureFraction(42 island, 0) | 74 | RB-008 Table 3.10 (65–75) | ✓ |
| tools/hood-geometry-comparison.md | Recommended outdoor (17-inch overhang per side) | (W_rec − 24)/2 | 17 | RB-005 Table 3.1b | ✓ |
| tools/hood-geometry-comparison.md | yields a 57-inch recommended hood width for this source and height, which the model reads at about 96% in still air | recommendedWidth(30); captureFraction(57 island, 0) | 57 / 96 | RB-002 Table 3.7; RB-008 Table 3.10 (>95) | ✓ |
| tools/velocity-decay-curves.md | from about 508 fpm at 6 inches to 393 fpm by a 30-inch mounting height and 350 fpm by 48 inches | centerlineVelocity(6); … 30; … 48 | 508 / 393 / 350 | RB-003 Table 3.1b | ✓ |
| tools/velocity-decay-curves.md | inputs — 435/412/393/377/350 fpm | centerlineVelocity(18); 24; 30; 36; 48 | 435 / 412 / 393 / 377 / 350 | RB-003 Table 3.1b regenerated (prints 453/417/392/370/337) | ✓ |
| tools/velocity-decay-curves.md | centerline velocity (314 fpm) is three times the 100 fpm | centerlineVelocity(72) | 314 | RB-003 §3.1 | ✓ |
| tools/velocity-decay-curves.md | (412 to 350 fpm, a 15% drop) | centerlineVelocity(24); centerlineVelocity(48); 1 − u(48)/u(24) | 412 / 350 / 15 | RB-003 Table 3.1b | ✓ |
| tools/velocity-decay-curves.md | from 550 to 1,518 CFM for this source under moderate exposure | requiredCfm(gasMedium, 24).minimum; … 48 | 550 / 1,518 | RB-008 Table 3.2b | ✓ |
| tools/velocity-decay-curves.md | holds about 222 fpm at 30 inches and still about 178 fpm at 72 inches (RB-003 Table 3.1b; v1.0 printed 179) | centerlineVelocity(30, pelletLow); … 72 | 222 / 178 | RB-003 Table 3.1b | ✓ |
| tools/velocity-decay-curves.md | from about 222 fpm (pellet smoker, low) to 485 fpm (high-output gas grill) | centerlineVelocity(30, pelletLow); centerlineVelocity(30, gasHigh) | 222 / 485 | RB-003 §3.1 | ✓ |
| tools/velocity-decay-curves.md | charcoal kettle's 230 fpm at 30 inches — below a 25,000 BTU gas grill's 342 fpm | centerlineVelocity(30, charcoalKettle); centerlineVelocity(30, gasSmall) | 230 / 342 | RB-001 §4.3 | ✓ |
| tools/side-panel-effectiveness.md | from about 20% with no side panels to about 70% with panels on both sides | capture 8; … both | 20 / 70 | RB-009 Table 3.1a + RB-006 §3.4 | ✓ |
| tools/side-panel-effectiveness.md | R_panel = 0.60 in RB-009 Table 3.1a, so the plume feels 40% of the ambient speed — 3.2 mph instead of 8 | panelReduction side f=0.67; 1 − R; effectiveWind(8, both, side) | 0.60 / 40 / 3.2 | RB-009 §3.1 | ✓ |
| tools/side-panel-effectiveness.md | to 50 points at 8 mph | difference of the printed (rounded) percentages at 8 mph | 50 | model | ✓ |
| tools/side-panel-effectiveness.md | still holds about 35% capture while the unshielded hood has collapsed to about 0% | capture 16 both; capture 16 none | 35 / 0 | model | ✓ |
| tools/side-panel-effectiveness.md | R_panel = 0.45 at half the mounting height, 0.60 at two-thirds, and 0.85 for full-depth panels | R_PANEL.two.lateral f=0.50; f=0.67; f=1.00 | 0.45 / 0.60 / 0.85 | RB-009 Table 3.1a | ✓ |
| tools/side-panel-effectiveness.md | (R_panel = 0.12–0.22) | R_PANEL.two.frontRear f=0.50; f=1.00 | 0.12 / 0.22 | RB-009 Table 3.1a | ✓ |
| tools/side-panel-effectiveness.md | decreases from 5.75 (exposed, no panels) to 4.14 (exposed, with panels) — a 28% reduction | K_CFM.exposed; K_CFM.exposedPanels; 1 − 4.14/5.75 | 5.75 / 4.14 / 28 | RB-008 §2.2 | ✓ |
| tools/side-panel-effectiveness.md | the model reads 72% and 93% for that hood, and 51% versus 80% for the 48-inch preset | 57 @5; 57 @5 both; 48 @5; 48 @5 both | 72 / 93 / 51 / 80 | RB-006 Table 3.10 (70–75 / 88–92) | ✓ |
| tools/indoor-vs-outdoor-comparison.md | models at about 87% capture | capture 0 | 87 | model | ✓ |
| tools/indoor-vs-outdoor-comparison.md | 48 inches is 84% of the 57-inch width | coverageAdvisory(48,30).pctOfRecommended; recommendedWidth(30) | 84 / 57 | RB-008 Table 3.10 | ✓ |
| tools/indoor-vs-outdoor-comparison.md | drops modeled capture to about 51% | capture 5 | 51 | model | ✓ |
| tools/indoor-vs-outdoor-comparison.md | 8 mph takes it to about 20% | capture 8 | 20 | model | ✓ |
| tools/indoor-vs-outdoor-comparison.md | modeled capture is about 2%; for that class RB-008 sets the CFM multiplier over bare plume mass flow at 5.75× without panels, versus 3.0× for a sheltered installation, a 92% increase | capture 12; K_CFM.exposed; K_CFM.sheltered; 5.75/3.0 − 1 | 2 / 5.75 / 3.0 / 92 | RB-008 §2.2, §3.6 | ✓ |
| tools/indoor-vs-outdoor-comparison.md | moves the centerline about 11.7 inches | deflection(30, 5) | 11.7 | RB-006 §3.2 | ✓ |
| tools/heat-release-rate-comparison.md | 2.4× the rated heat and 2.4× the convective output | gasLarge.btu / gasSmall.btu; gasLarge.qcKw / gasSmall.qcKw | 2.4 / 2.4 | RB-001 Table 3.1 | ✓ |
| tools/heat-release-rate-comparison.md | only from about 342 to 444 fpm, a 30% gain | centerlineVelocity(30, gasSmall); centerlineVelocity(30, gasLarge); ratio − 1 | 342 / 444 / 30 | RB-001 §2.2 | ✓ |
| tools/heat-release-rate-comparison.md | for doubling Q<sub>c</sub> at 26% | 2^(1/3) − 1 | 26 | RB-008 §2.4 | ✓ |
| tools/heat-release-rate-comparison.md | kettle's 1.8 kW convective output is about a third of the 25,000 BTU small gas grill's 5.1 kW | charcoalKettle.qcKw; gasSmall.qcKw | 1.8 / 5.1 | RB-001 Table 3.1 | ✓ |
| tools/heat-release-rate-comparison.md | about 230 fpm at 30 inches against 342 fpm | centerlineVelocity(30, charcoalKettle); centerlineVelocity(30, gasSmall) | 230 / 342 | RB-001 §3.5 | ✓ |
| tools/heat-release-rate-comparison.md | produces 16.4 kW convective — about 485 fpm at 30 inches | gasHigh.qcKw; centerlineVelocity(30, gasHigh) | 16.4 / 485 | RB-001 Table 3.1, §3.5 | ✓ |
| tools/heat-release-rate-comparison.md | From 1.5 kW in low-smoke mode (about 222 fpm at 30 inches) to 5.7 kW in high-temperature grilling mode (about 355 fpm) | pelletLow.qcKw; centerlineVelocity(30, pelletLow); pelletHigh.qcKw; centerlineVelocity(30, pelletHigh) | 1.5 / 222 / 5.7 / 355 | RB-001 Table 3.1 | ✓ |
| tools/grease-aerosol-deposition.md | settles at about 0.271 m/s and reaches the ground about 12.4 m downwind in a 5 mph wind | stokesSettling(100); groundContactDistance(100, 5) | 0.271 / 12.4 | RB-011 Table 3.3a | ✓ |
| tools/grease-aerosol-deposition.md | a 10 µm droplet (0.0028 m/s) would travel about 1.2 km | stokesSettling(10); groundContactDistance(10, 5)/1000 | 0.0028 / 1.2 | RB-011 Table 3.3a | ✓ |
| tools/grease-aerosol-deposition.md | Stokes settling velocity roughly 0.07–0.27 m/s | paper: printed range = stokesSettling(50)/(100) | — | RB-011 §3.3 (50–100 µm rows) | ✓ |
| tools/failure-mode-taxonomy.md | FM-1 | paper: categorical page — no physics numbers | — | RB-007 §3.1–3.9 | ✓ |
