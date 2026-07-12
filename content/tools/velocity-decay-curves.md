---
title: "Velocity Decay Curves"
description: "Centerline velocity decay visualization for a reference buoyant cooking plume at standard hood mounting heights, with source-type variation discussed per RB-003."
date: 2025-11-01
lastmod: 2026-07-11
reviewed: true
tags: ["velocity decay", "plume physics", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 5
instrument_id: "i06"
related_questions:
  - "/questions/mounting-height/"
related_papers:
  - "/research/rb-001-buoyant-plume-behavior/"
  - "/research/rb-003-velocity-decay-capture/"
---

This diagram visualizes centerline velocity decay from the cooking surface up to hood mounting height for a single reference plume, calibrated to a representative ~60,000 BTU gas grill (see Governing Equation below). Stronger and weaker sources — wood-fired at one end, pellet smokers at the other — shift the curve up or down without changing its shape; those source-type differences are quantified in [RB-003](/research/rb-003-velocity-decay-capture/) rather than drawn as separate curves here.

<div style="max-width: 800px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same centerline-velocity function (`physics/plume.mjs`) driving the instrument above; live values update as you move the distance control.*

| Distance above source | Centerline velocity |
|---|---|
| 6″ | 400 fpm |
| 12″ | 400 fpm |
| 18″ | 349 fpm |
| 24″ | 317 fpm |
| 30″ | 295 fpm |
| 36″ | 277 fpm |
| 48″ | 252 fpm |
| 60″ | 234 fpm |

Centerline velocity holds at 400 fpm from the cooking surface up to the 12-inch reference height, then decays to about 295 fpm by a 30-inch mounting height and 252 fpm by 48 inches — a cube-root decay, not a linear one [RB-003 §2.1]. Even at 60 inches, well beyond any standard mounting height, this reference plume's centerline velocity (234 fpm) stays more than double the ASHRAE 100 fpm capture-velocity reference cited elsewhere on this site [RB-003 §2.5]. The velocity loss from 24 to 48 inches (317 to 252 fpm, a 21% drop) is proportionally smaller than the mass-flow and plume-width growth over the same interval, which is why RB-008's CFM tables — not centerline velocity — govern hood sizing at greater mounting heights [RB-003 §4.1].

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
