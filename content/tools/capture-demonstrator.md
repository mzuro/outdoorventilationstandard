---
title: "Capture Demonstrator"
description: "Interactive plume-capture model for an outdoor range hood: mounting height, overhang, and wind exposure decide whether the grill plume is captured or lost."
summary: "An interactive model of plume capture over an open-air grill. Move the mounting height, hood width, and wind speed controls and watch the capture boundary shift in real time — the same physics behind every other instrument on this site, isolated into one demonstrator."
date: 2026-07-11
lastmod: 2026-07-15
reviewed: true
tags: ["plume capture", "interactive tool", "hood design"]
categories: ["Tools"]
ShowToc: false
weight: -1
draft: false
instrument_id: "i01"
instrument_preset: "island-48"
related_questions:
  - "/questions/hood-depth-and-overhang/"
  - "/questions/does-wind-affect-my-hood/"
related_papers:
  - "/research/rb-002-entrainment-lateral-plume-spread/"
  - "/research/rb-005-hood-geometry-capture/"
  - "/research/rb-006-wind-interaction-crossflow/"
---

This instrument demonstrates the core capture problem this standard exists to address: whether a buoyant cooking plume, as it rises and expands, stays inside the hood's capture envelope or escapes it. Every other instrument on this site isolates one variable from this same model — this one lets you move all of them at once.

<div style="max-width: 960px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same capture-fraction physics module (`physics/capture.mjs`) driving the instrument above, at a 48-inch hood width and the fixed 30-inch mounting rise; live values update as you move the controls.*

| Mount | Wind speed | Modeled capture |
|---|---|---|
| Wall | 0 mph | 99% |
| Wall | 5 mph | 99% |
| Wall | 10 mph | 87% |
| Wall | 15 mph | 36% |
| Island | 0 mph | 97% |
| Island | 5 mph | 79% |
| Island | 10 mph | 24% |
| Island | 15 mph | 1% |

A 48-inch wall-mounted hood holds roughly 87% modeled capture at 10 mph, while the same width on an island mount falls to about 24% at the same wind speed — the rear wall's reflection of the upwind plume tail is doing most of the work [RB-005 §3.4.4]. In still air the two mounts are nearly identical in this model (99% wall, 97% island); the gap opens entirely with wind, not hood geometry — which is why RB-006 grades installations by wind exposure class rather than by hood shape [RB-006 §3.8]. Above 15 mph an unshielded island hood's modeled capture collapses to about 1%, the same wind-deflected-escape failure mode this program catalogs separately [RB-007].

## How the demonstrator works

The demonstrator combines three results from the research program into a single interactive model:

1. **Plume width by height** — the Morton-Taylor-Turner entrainment relationship from [RB-002](/research/rb-002-entrainment-lateral-plume-spread/), which sets how far the plume has expanded by the time it reaches the hood.
2. **Hood geometry and capture** — the Gaussian capture-fraction model from [RB-005](/research/rb-005-hood-geometry-capture/), which determines what fraction of that expanded plume the hood face actually intercepts.
3. **Wind deflection** — the crosswind integrator from [RB-006](/research/rb-006-wind-interaction-crossflow/), which bends the plume trajectory before it reaches the capture plane.

Default preset is a 48-inch island installation (`island-48`) — no wall, no side panels, so wind sensitivity is at its maximum. This is illustrative, not a design tool: it does not account for burner-specific heat release rate, so it should not be used to size a real installation. Use the [Outdoor Range Hood CFM Calculator](/tools/cfm-calculator/) for that.

## Source Papers

- [RB-002: Entrainment and Lateral Plume Spread](/research/rb-002-entrainment-lateral-plume-spread/) — Plume width model
- [RB-005: Hood Geometry and Capture](/research/rb-005-hood-geometry-capture/) — Capture-fraction model
- [RB-006: Wind Interaction and Crossflow](/research/rb-006-wind-interaction-crossflow/) — Wind deflection integrator
