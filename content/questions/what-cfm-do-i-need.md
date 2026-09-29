---
title: "What CFM does my outdoor kitchen hood need?"
description: "A 60,000 BTU grill at a 30-inch wall mount needs 892 CFM minimum in moderate wind and a 1,200 CFM blower; on an island, 1,070 CFM (RB-008 §3.3, §3.9)."
summary: "A 60,000 BTU gas grill at a 30-inch wall mount needs a minimum of 892 CFM under moderate wind exposure, served by a 1,200 CFM blower — 727 CFM sheltered, 1,004 CFM exposed with side panels, 1,394 CFM exposed without. An island mount multiplies the minimum by 1.20, to 1,070 CFM, because it loses the back wall's free confinement. The figure comes from the plume's mass flow at the hood — source strength and mounting height — not from hood width."
date: 2026-07-11
lastmod: 2026-09-29
reviewed: true
weight: 1
instruments: true
instrument_id: "i02"
instrument_preset: "wall-48"
citations: ["rb-008", "rb-001", "rb-006"]
---

A 60,000 BTU gas grill under a wall-mounted hood at a 30-inch mounting height needs at least **892 CFM** under moderate wind exposure, and a **1,200 CFM blower** — the smallest standard size that clears the minimum by the 10% margin RB-008 requires (RB-008 §3.3, App. A step 8). Across the four wind exposure classes the minimums are 727 CFM sheltered, 892 CFM moderate, 1,004 CFM exposed with side panels, and 1,394 CFM exposed without — with blowers of 900, 1,200, 1,200 and 1,800 CFM (RB-008 §3.3; the paper prints 1,003 for the third case, a 1 CFM rounding difference; for the fourth, RB-008 v1.0 printed a 1,500 CFM blower, only 8% above the minimum, and v1.1 corrects it to 1,800 under the paper's own Appendix A step 8 rule). These are minimums for ingesting the whole plume, not comfort margins; too little exhaust — FM-3, third of RB-007's six failure modes by frequency — is the most *readily correctable* cause of smoke escape (RB-007 Table 3.1, §3.4.5).

## Why island installs need more

The same grill under an island hood needs about **1,070 CFM minimum** — the wall figure times the 1.20 island multiplier RB-008 applies to every one of its tables — and is still served by a 1,200 CFM blower; a peninsula takes 1.10, or 981 CFM (RB-008 §3.9). A wall behind the grill blocks one whole side of ambient infiltration and one whole wind direction for free, and gives escaped plume gas a surface to climb back into the hood along; an island hood, open on all four sides, has to do that work with airflow alone (RB-005 §3.4.3). The instrument above is set to the wall scenario — switch its mount control to island to see the figures move, or open the full [Outdoor Range Hood CFM Calculator](/tools/cfm-calculator/) to run your own source, mounting height, mount and exposure combination.

## Where the number comes from — source and height, not width

RB-008 sizes a hood by the mass of plume arriving at it. The Heskestad plume mass flow, ṁ = 0.071 · Q_c^(1/3) · z^(5/3) + 0.0018 · Q_c, gives the air a plume carries upward through the hood plane at height z for a source of convective output Q_c; for the 60,000 BTU grill (Q_c = 12.3 kW, RB-001 Table 3.1) at 30 inches that is about 242 CFM of bare plume (RB-008 Table 3.1). The hood must also swallow ambient air from around the plume, hold it against wind, and carry a safety margin, so the bare figure is multiplied by K_CFM = 3.0, 3.68, 4.14 or 5.75 depending on wind exposure (RB-008 §2.2): 242 × 3.68 is the 892 CFM above.

Two things follow from the formula. **Mounting height dominates**: the z^(5/3) term means the same grill needs 667 CFM at 24 inches and 1,150 CFM at 36 inches (RB-008 Table 3.2b) — see [how high the hood should be](/questions/mounting-height/). **Burner rating matters far less**: with Q_c entering as a cube root, stepping from a 40,000 to a 60,000 BTU grill raises the moderate-exposure minimum only from 747 to 892 CFM, about 19%, and an 80,000 BTU grill needs 1,019 CFM (RB-008 Table 3.2b, §2.4).

## A wider hood does not need more CFM — but an undersized hood cannot be fixed with CFM

Hood width is not an input to the exhaust rate at all. RB-008 §3.4.3 is explicit that the source's convective output and the mounting height set the requirement (the mount multiplier of §3.9 is applied on top), and its Table 3.10 shows the effect of width running the other way: a hood *wider* than the recommended width needs slightly less airflow, not more, because the extra overhang adds capture margin (RB-008 §3.10). The catch is the other direction. Below about 80% of the recommended width, "increasing CFM cannot compensate for the geometric deficiency" — the plume simply overflows the hood (RB-008 §3.10). The papers' recommended hood for this 60,000 BTU grill at 30 inches is 62 inches wide (RB-002 Table 3.7); the 48-inch hood the instrument opens with is 77% of that — below the 80% line at which RB-008 Table 3.10 rates capture at 65–75% at best; the table's worked case is the medium gas grill's 57-inch hood, and the OVS model's coverage advisory applies the same band to this 62-inch case. Size the width first — [what size hood your grill needs](/questions/what-size-hood-for-my-grill/) — then the airflow.

## Why this is lower than the numbers you may have seen

Most published outdoor figures, including the 1,200 and 1,500 CFM this page itself used to carry for this case, come from a face-velocity rule: hood face area times a capture velocity of around 100 fpm. RB-003 rejects that method for outdoor plumes. A capture velocity is what a hood needs to reach out and pull a passive contaminant toward it; a buoyant plume delivers itself, arriving at the hood at 200–560 fpm, and the hood's only job is to ingest its volume — a correctly sized outdoor hood can run a face velocity of 29 fpm and be right (RB-003 §2.5, §4.1). The face-velocity rule scales with hood area, which is why it wrongly makes wider hoods need more CFM. The indoor rule of thumb errs the other way: 1 CFM per 100 BTU gives 600 CFM for this grill, below even the sheltered outdoor minimum, because it assumes a room that recirculates whatever the hood misses (RB-008 §2.3, §4.3). The RB-008 answer sits between the two because it counts the plume itself.

## Wind pushes the number up — or panels pull it down

The exposure classes are wind at cooking height: sheltered below 3 mph, moderate 3–7 mph, exposed 7–12 mph (RB-008 §2.2). At exposed sites without shielding the multiplier rises to 5.75 — 1,394 CFM here — and even at that rate RB-008 expects capture of only about 60%, because the wind has pushed the plume out from under the hood before the exhaust can act on it (RB-008 §3.3). Side panels cut the multiplier to 4.14, a 28% reduction, and bring the minimum to 1,004 CFM (RB-008 §2.2); above 12 mph RB-008 classes the site as severe, where conventional capture is impractical and enclosure is required. See [does wind affect my hood](/questions/does-wind-affect-my-hood/) and [do side panels work](/questions/do-side-panels-work/) for how much a panel buys back.

## The bottom line

Identify the source, the mounting height, the mount and the exposure; read the minimum; take the smallest standard blower at least 10% above it. A CFM rating alone, without a source and a mounting height behind it, is not a specification — it's a guess. And if the hood under consideration is an indoor unit, none of its ratings transfer as printed — see [can I use an indoor range hood outside](/questions/can-i-use-an-indoor-range-hood-outside/).
