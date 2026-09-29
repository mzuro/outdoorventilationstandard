---
title: "How high should an outdoor range hood be above the grill?"
description: "Plume velocity falls only from 412 fpm at 24 inches to 377 fpm at 36, but the airflow a hood must move grows as height^(5/3). 30 inches is a sound default."
summary: "Centerline plume velocity over a medium gas grill drops from about 412 fpm at 24 inches to 393 fpm at 30 and 377 fpm at 36 — the plume never runs out of velocity at any standard height. What height changes is how much plume the hood must swallow (550, 747 and 972 CFM at those three heights under moderate exposure), how wide the plume has grown, and how far wind can push it before capture."
date: 2026-07-11
lastmod: 2026-09-29
reviewed: true
weight: 6
instruments: true
instrument_id: "i06"
citations: ["rb-003", "rb-001", "rb-008"]
---

At a 24-inch mounting height, the plume's centerline velocity over a medium gas grill is about **412 fpm**; at 30 inches, about **393 fpm**; at 36 inches, about **377 fpm** — values recomputed from the Heskestad relation with RB-001 Table 3.2 inputs (RB-003 Table 3.1b v1.0 printed 417, 392 and 370, hand-rounded figures 1–4% off its own formula; v1.1 regenerates the rows to these values; RB-003 §3.1). The decay follows an inverse cube root, so raising the hood a foot costs less than a tenth of the velocity. Velocity is not what limits a higher mount: even the weakest source in the program keeps about 178 fpm at 72 inches (RB-003 Table 3.1b; v1.0 printed 179), and RB-003 concludes that centerline velocity is never the binding constraint for a properly sized hood (RB-003 §3.1, §4.1).

## What height actually changes

Three things grow with height, and none of them is velocity.

**The air the hood must move.** The plume entrains ambient air as it rises, so its mass flow at the hood grows as z^(5/3) — much faster than the velocity falls. Under moderate exposure the medium gas grill needs 550 CFM at 24 inches, 747 at 30 and 972 at 36 (RB-008 Table 3.2b); over the full 18-to-48-inch range the requirement quadruples, from 383 to 1,518 CFM (RB-008 §2.4). This is the reason the papers size hoods by airflow rather than face velocity, and the reason a low mount buys a smaller, quieter blower — see [what CFM you need](/questions/what-cfm-do-i-need/).

**The width of the plume.** The capture diameter over this grill is about 38.6 inches at 24 inches, 41.4 at 30 and 44.3 at 36 (RB-002 Table 3.3a), so the recommended overhang beyond the 24-inch cooking surface grows from about 15 to 17 to 19 inches per side (RB-005 §3.1) — see [how far the hood should extend past the grill](/questions/hood-depth-and-overhang/).

**The reach of the wind.** A 5 mph breeze deflects the plume centerline about 9.0 inches by 24 inches of rise, 11.7 by 30 and 14.7 by 36 (RB-006 Table 3.2b prints 9, 12 and 15). For a 48-inch island hood in that side wind the capture model reads 83% at 18 inches, 67% at 24, 51% at 30 and 38% at 36 — the same hood, the same breeze, a third of the plume lost to a foot of extra height.

## Two things trade off with height

Mounting lower keeps the blower small, the hood narrow and the wind's leverage short — all three favor capture. But mounting lower also leaves less vertical clearance for a tall stockpot or a flare-up. Mounting higher gains headroom and pays for it in all three currencies at once: more airflow, more overhang, and more deflection for the same wind. The instrument above traces centerline velocity continuously from grill surface to full rise so the shallowness of that curve is visible directly; the full [Velocity Decay Curves](/tools/velocity-decay-curves/) tool shows the same trace beside the charcoal case.

## Why 30 inches

Thirty inches is the reference height throughout the papers and the maximum RB-003 recommends for general-purpose residential installations: below it (18–24 inches) airflow needs are moderate and standard 600–900 CFM blowers serve most sources; at it a 900 CFM blower covers every source but the high-output gas grill — on RB-003's standard-outdoor basis (K_CFM = 3.0, which RB-008 carries forward as its Sheltered class; under Moderate exposure the 60,000 BTU grill already needs 892 CFM and a 1,200 CFM blower, RB-008 §3.3); above it (36–48 inches) requirements escalate to 417–1,623 CFM across the source range, hoods approach 72 inches wide, and wind susceptibility rises substantially (RB-003 §4.2). It holds usable clearance for tall cookware while keeping all three penalties in check.

## Practical guidance

Mount as low as the cooking you do allows, and treat 30 inches as the ceiling rather than the floor. Sites with above-average wind exposure should sit toward the lower end of the practical range, since deflection grows with every inch of rise; see the [wind](/questions/does-wind-affect-my-hood/) and [overhang](/questions/hood-depth-and-overhang/) questions for how those two effects compound at a given height.
