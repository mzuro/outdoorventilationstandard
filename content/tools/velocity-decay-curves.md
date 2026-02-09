---
title: "Velocity Decay Curves"
description: "Centerline velocity decay visualization for buoyant cooking plumes across four source types, showing capture reliability thresholds at standard hood mounting heights."
date: 2025-11-01
lastmod: 2026-02-05
tags: ["velocity decay", "plume physics", "visualization"]
categories: ["Tools"]
ShowToc: false
---

This diagram visualizes the centerline velocity decay from cooking surface to hood mounting heights for four representative outdoor cooking source types. The minimum capture velocity threshold (0.8 m/s) separates the reliable capture zone from conditions where capture becomes unreliable without compensating exhaust rates.

<div style="max-width: 800px; margin: 0 auto;">

![Velocity Decay Curves](/diagrams/velocity-decay-curves.svg)

</div>

---

## Key Findings

**All source types maintain capture-viable velocities at standard mounting heights.** Even the lowest-output pellet smoker produces centerline velocities above the 0.8 m/s minimum capture threshold at 48 inches — the maximum recommended mounting height. This confirms that velocity decay alone does not cause capture failure for properly sized hoods.

**The practical constraint is not velocity but plume width.** While centerline velocity remains adequate, the plume diameter expands significantly with height (per Morton-Taylor-Turner entrainment theory), requiring progressively larger hood coverage and higher CFM to capture the widened plume.

**Wood-fired sources produce the strongest plumes.** With a convective heat release of 16.25 kW (Q = 25 kW, χ<sub>c</sub> = 0.65), wood-fired grills generate centerline velocities approximately 2× those of pellet smokers across all mounting heights.

## Governing Equation

The velocity decay follows the Heskestad correlation for buoyant plumes:

> u₀ = 1.03 · Q<sub>c</sub><sup>1/3</sup> · (z − z₀)<sup>−1/3</sup>

where u₀ is the centerline velocity (m/s), Q<sub>c</sub> is the convective heat release rate (kW), z is the height above the cooking surface (m), and z₀ is the virtual origin.

The −1/3 power law produces a gradual decay — velocity decreases slowly with height because the buoyant plume continuously converts thermal energy to kinetic energy even as it entrains ambient air.

## Source Papers

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Source heat release rates and convective fractions
- [RB-003: Velocity Decay and Capture](/research/rb-003-velocity-decay-capture/) — Complete velocity decay analysis and capture implications
