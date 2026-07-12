---
title: "CFM Sizing Calculator"
description: "Physics-based interactive calculator for determining minimum exhaust airflow (CFM) for outdoor cooking ventilation hoods. Covers all source types, mounting heights, and wind exposure classes."
date: 2025-12-15
lastmod: 2026-07-11
reviewed: true
tags: ["CFM sizing", "interactive tool", "hood design"]
categories: ["Tools"]
ShowToc: false
weight: 1
instrument_id: "i02"
aliases: ["/tools/cfm-calculator.html"]
---

This calculator implements the face-velocity CFM sizing method from [RB-008: CFM Requirements for Outdoor Cooking Ventilation](/research/rb-008-cfm-requirements/) §3.9. It computes the minimum exhaust airflow required for reliable plume capture from hood width, mount type, wind exposure, and burner output.

## Methodology

The calculator uses the following physics:

1. **Base requirement** is a face-velocity calculation: the hood face area (width × a 36-inch nominal face depth) times a 100 fpm capture velocity — the upper end of the ASHRAE face-velocity band cited in RB-003/RB-005. Per RB-008 §3.4.3, hood depth and cooking-surface area do **not** independently drive the required exhaust rate — only plume strength, mounting height, and the open-sides penalty do — so depth is held at this fixed reference and is not itself a calculator input.

2. **Mount premium** multiplies the base by 1.0 (wall), 1.1 (peninsula), or 1.2 (island), per RB-008 §3.9 — the open-sides infiltration, omnidirectional wind exposure, and loss of wall (Coanda) attachment an island hood must make up with airflow instead of a wall.

3. **Exposure multiplier** scales the recommended figure by 1.1 (sheltered), 1.25 (moderate), or 1.5 (exposed); a separate 1.75× high-wind design margin is offered above the exposure tiers for sites that are consistently windy.

4. **BTU adjustment** adds 100 CFM for every 10,000 BTU of burner output above the 60,000 BTU baseline, applied to every tier.

5. **Source data** (heat release rates, convective fractions) are from [RB-001](/research/rb-001-buoyant-plume-behavior/). Wind exposure bands are informed by [RB-006](/research/rb-006-wind-interaction-crossflow/).

## Source Papers

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Heat release rate data
- [RB-003: Velocity Decay and Capture](/research/rb-003-velocity-decay-capture/) — Mass flow and CFM multiplier framework
- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Infiltration factor derivation
- [RB-006: Wind Interaction and Crossflow](/research/rb-006-wind-interaction-crossflow/) — Wind correction factors
- [RB-008: CFM Requirements](/research/rb-008-cfm-requirements/) — Complete methodology and lookup tables
