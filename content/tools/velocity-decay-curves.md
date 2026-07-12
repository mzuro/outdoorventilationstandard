---
title: "Velocity Decay Curves"
description: "Centerline velocity decay visualization for buoyant cooking plumes across four source types, showing capture reliability thresholds at standard hood mounting heights."
date: 2025-11-01
lastmod: 2026-07-11
reviewed: true
tags: ["velocity decay", "plume physics", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 5
instrument_id: "i06"
---

This diagram visualizes the centerline velocity decay from cooking surface to hood mounting heights for four representative outdoor cooking source types. The minimum capture velocity threshold (0.8 m/s) separates the reliable capture zone from conditions where capture becomes unreliable without compensating exhaust rates.

<div style="max-width: 800px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Key Findings

**All source types maintain capture-viable velocities at standard mounting heights.** Even the lowest-output pellet smoker produces centerline velocities above the 0.8 m/s minimum capture threshold at 48 inches — the maximum recommended mounting height. This confirms that velocity decay alone does not cause capture failure for properly sized hoods.

**The practical constraint is not velocity but plume width.** While centerline velocity remains adequate, the plume diameter expands significantly with height (per Morton-Taylor-Turner entrainment theory), requiring progressively larger hood coverage and higher CFM to capture the widened plume.

**Wood-fired sources produce the strongest plumes.** With a convective heat release of 16.25 kW (Q = 25 kW, χ<sub>c</sub> = 0.65), wood-fired grills generate centerline velocities approximately 2× those of pellet smokers across all mounting heights.

## Governing Equation

The live instrument above draws a single reference plume, calibrated to a representative ~60,000 BTU gas grill, not a separate curve per source type. Centerline velocity holds constant at w<sub>0</sub> = 400 fpm from the cooking surface up to a 12-inch reference height (z<sub>0</sub>), then decays with the cube root of height above that point:

> w(z) = 400 fpm, for z &le; 12 in
> w(z) = 400 &middot; &#8731;(12 / z) fpm, for z &gt; 12 in

The cube-root law produces a gradual decay — velocity decreases slowly with height because the buoyant plume continuously converts thermal energy to kinetic energy even as it entrains ambient air. The per-source-type comparisons in Key Findings above (wood-fired vs. pellet, etc.) are RB-001's and RB-003's own measured differences between appliances — this single-plume instrument does not compute separate Q<sub>c</sub>/z<sub>0</sub> curves per source.

## Source Papers

- [RB-001: Buoyant Plume Behavior](/research/rb-001-buoyant-plume-behavior/) — Source heat release rates and convective fractions
- [RB-003: Velocity Decay and Capture](/research/rb-003-velocity-decay-capture/) — Complete velocity decay analysis and capture implications
