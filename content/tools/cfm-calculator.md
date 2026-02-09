---
title: "CFM Sizing Calculator"
description: "Physics-based interactive calculator for determining minimum exhaust airflow (CFM) for outdoor cooking ventilation hoods. Covers all source types, mounting heights, and wind exposure classes."
date: 2025-12-15
lastmod: 2026-02-05
tags: ["CFM sizing", "interactive tool", "hood design"]
categories: ["Tools"]
ShowToc: false
---

This calculator implements the physics-based CFM sizing methodology developed in [RB-008: CFM Requirements for Outdoor Cooking Ventilation](/research/rb-008-cfm-requirements/). It computes the minimum exhaust airflow required for reliable plume capture based on the Heskestad plume mass flow correlation.

<iframe src="/tools/cfm-calculator.html" width="100%" height="1200" frameborder="0" style="border: 1px solid #DDD; border-radius: 8px; background: #FAFAFA;"></iframe>

---

## Methodology

The calculator uses the following physics:

1. **Bare plume mass flow** is computed from the Heskestad correlation: m&#775; = 0.071 · Q<sub>c</sub><sup>1/3</sup> · z<sup>5/3</sup> + 0.0018 · Q<sub>c</sub>

2. **Total required CFM** is the bare plume flow multiplied by the composite correction factor K<sub>CFM</sub>, which accounts for:
   - **Infiltration (F<sub>inf</sub> = 2.0):** Ambient air drawn into the hood beyond the plume boundary
   - **Wind correction (F<sub>wind</sub>):** Additional CFM needed for wind-deflected plume capture
   - **Safety factor (F<sub>safety</sub> = 1.15):** Margin for correlation uncertainty and source variability

3. **Source data** (heat release rates, convective fractions) are from [RB-001](/research/rb-001-buoyant-plume-behavior/). Wind correction factors are from [RB-006](/research/rb-006-wind-interaction-crossflow/).

## Source Papers

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Heat release rate data
- [RB-003: Velocity Decay and Capture](/research/rb-003-velocity-decay-capture/) — Mass flow and CFM multiplier framework
- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Infiltration factor derivation
- [RB-006: Wind Interaction and Crossflow](/research/rb-006-wind-interaction-crossflow/) — Wind correction factors
- [RB-008: CFM Requirements](/research/rb-008-cfm-requirements/) — Complete methodology and lookup tables
