---
title: "CFM Sizing Calculator"
description: "Physics-based interactive calculator for determining minimum exhaust airflow (CFM) for outdoor cooking ventilation hoods, from hood width, mount type, wind exposure, and burner rating."
date: 2025-12-15
lastmod: 2026-07-11
reviewed: true
tags: ["CFM sizing", "interactive tool", "hood design"]
categories: ["Tools"]
ShowToc: false
weight: 1
instrument_id: "i02"
aliases: ["/tools/cfm-calculator.html"]
related_questions:
  - "/questions/what-cfm-do-i-need/"
related_papers:
  - "/research/rb-001-buoyant-plume-behavior/"
  - "/research/rb-003-velocity-decay-capture/"
  - "/research/rb-005-hood-geometry-capture/"
  - "/research/rb-006-wind-interaction-crossflow/"
  - "/research/rb-008-cfm-requirements/"
---

This calculator implements a face-velocity CFM sizing method — hood face area times a 100 fpm capture velocity (see Methodology) — with mount premiums from [RB-008: CFM Requirements for Outdoor Cooking Ventilation](/research/rb-008-cfm-requirements/) §3.9. It computes the minimum exhaust airflow required for reliable plume capture from hood width, mount type, wind exposure, and burner output.

## Reference readings

*Representative values below are computed directly from the same sizing function (`physics/cfm.mjs`) driving the calculator above, at the 60,000 BTU baseline and moderate wind exposure; live values update as you move the controls.*

| Hood width | Wall — minimum | Wall — recommended | Island — minimum | Island — recommended |
|---|---|---|---|---|
| 42″ | 1,050 CFM | 1,325 CFM | 1,250 CFM | 1,575 CFM |
| 48″ | 1,200 CFM | 1,500 CFM | 1,450 CFM | 1,800 CFM |
| 54″ | 1,350 CFM | 1,700 CFM | 1,625 CFM | 2,025 CFM |
| 60″ | 1,500 CFM | 1,875 CFM | 1,800 CFM | 2,250 CFM |
| 72″ | 1,800 CFM | 2,250 CFM | 2,150 CFM | 2,700 CFM |

A 48-inch wall-mounted outdoor hood works out to a minimum of approximately 1,200 CFM, with 1,500 CFM as the recommended moderate-exposure target, under this calculator's face-velocity model (Methodology, step 1). The same 48-inch width on an island mount needs about 1,450 CFM minimum and 1,800 CFM recommended — roughly 20% more across every width in the lineup, the fixed island premium this calculator applies from RB-008's island-versus-wall CFM adjustment [RB-008 §3.9]. At the 48-inch wall size, moving from sheltered to exposed wind conditions raises the recommended figure from 1,325 CFM to 1,800 CFM without changing the hood at all — the exposure band is this calculator's own modeling assumption (Methodology, step 3); RB-008's wind factors live in a different, plume-mass-flow framework and do not map directly onto this face-velocity base.

## Methodology

The calculator uses the following physics:

1. **Base requirement** is a face-velocity calculation: the hood face area (width × a 36-inch nominal face depth) times a 100 fpm capture velocity — the upper end of the ASHRAE face-velocity band cited in RB-003/RB-005. Per RB-008 §3.4.3, hood depth and cooking-surface area do **not** independently drive the required exhaust rate — only plume strength, mounting height, and the open-sides penalty do — so depth is held at this fixed reference and is not itself a calculator input.

2. **Mount premium** multiplies the base by 1.0 (wall), 1.1 (peninsula), or 1.2 (island), per RB-008 §3.9 — the open-sides infiltration, omnidirectional wind exposure, and loss of wall (Coanda) attachment an island hood must make up with airflow instead of a wall.

3. **Exposure multiplier** scales the recommended figure by 1.1 (sheltered), 1.25 (moderate), or 1.5 (exposed); a separate 1.75× high-wind design margin is offered above the exposure tiers for sites that are consistently windy.

4. **BTU adjustment** adds 100 CFM for every 10,000 BTU of burner output above the 60,000 BTU baseline, applied to every tier.

5. **Source data** (heat release rates, convective fractions) are from [RB-001](/research/rb-001-buoyant-plume-behavior/). Wind exposure bands are informed by [RB-006](/research/rb-006-wind-interaction-crossflow/).

## Source Papers

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Heat release rate data
- [RB-003: Velocity Decay and Capture](/research/rb-003-velocity-decay-capture/) — ASHRAE face-velocity band underlying the 100 fpm capture velocity
- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Capture geometry and the island premium range behind the mount multipliers
- [RB-006: Wind Interaction and Crossflow](/research/rb-006-wind-interaction-crossflow/) — Wind correction factors
- [RB-008: CFM Requirements](/research/rb-008-cfm-requirements/) — CFM sizing methodology (§3.9) and the depth-independence result (§3.4.3)
