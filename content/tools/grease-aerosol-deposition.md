---
title: "Grease Aerosol Deposition Pattern"
description: "Visualization of grease particle transport and deposition zones in the missed plume region, showing how particle size determines transport distance, deposition intensity, and health/fire risk."
date: 2026-01-10
lastmod: 2026-07-15
reviewed: true
tags: ["grease aerosol", "particle transport", "fire risk"]
categories: ["Tools"]
ShowToc: false
weight: 9
instrument_id: "i10"
fallback_svg: "grease-aerosol-deposition"
related_questions:
  # Gated: where-does-grill-grease-go is draft:true (YMYL, held for Mark's
  # review). Uncomment when that page publishes. Left commented so this
  # tool does not render an empty "Questions" section while it is drafted;
  # the theme uses .Site.GetPage so it would not 404 either way.
  # - "/questions/where-does-grill-grease-go/"
related_papers:
  - "/research/rb-011-grease-aerosol-transport/"
---

When the buoyant cooking plume escapes the hood (partially or fully), grease aerosol is carried into the surrounding environment. This diagram shows how particle size determines how far the grease travels and where it deposits.

<div style="max-width: 960px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*The "grease deposition" view of the instrument above draws a vertical intensity-by-height strip (`physics/grease.mjs`), scaled from the same centerline-velocity decay used by the velocity-decay instrument — a visualization proxy for how quickly rising plume energy falls off with height, not a separate settling-velocity calculation. It is a different axis from the horizontal Zone 1-3 distances described below, which come directly from RB-011's Stokes settling-velocity analysis.*

| Height above grill | Deposition intensity |
|---|---|
| 0″ | 100% |
| 9″ | 100% |
| 13″ | 96% |
| 17″ | 79% |
| 21″ | 68% |
| 26″ | 60% |
| 30″ | 54% |

This instrument's vertical intensity strip holds at its maximum from the grill surface to about the 12-inch reference height, then falls to roughly 54% by 30 inches — the same height range over which centerline velocity itself decays fastest. That vertical falloff is a distinct measurement axis from RB-011's own finding that the coarse droplet mode (>10 micron), which carries the majority of total grease mass, settles predominantly within a few meters of the source regardless of hood height [RB-011 §4.2]. Near-field hood capture effectiveness for that coarse mode is 70-98% for standard baffle filters, which is why effective hood operation — not distance from the grill — is the primary lever on near-field deposition [RB-011 §4.2].

## The Three Deposition Zones

**Zone 1: Coarse droplets above 50 micrometers — within about 1 meter.** The largest droplets settle fastest (Stokes settling velocity roughly 0.07-0.27 m/s) and land on the surfaces immediately adjacent to the cooking station — the drip pan, grill exterior, and adjacent countertop [RB-011 §3.3].

**Zone 2: 20-50 micrometers — 1 to 5 meters downwind.** Gravitational settling still dominates, but the wind carries these droplets further before they land: decking, outdoor furniture, and siding within about 5 meters [RB-011 §3.3].

**Zone 3: 10-20 micrometers — 5 to 30 meters downwind.** Settling plus turbulent diffusion deposits this band on adjacent structures, vegetation, and out to a neighboring property boundary [RB-011 §3.3].

Mass is concentrated at the coarse end: the coarse mode as a whole (2.5-100 micrometers) carries 50-80% of total grease mass [RB-011 §2.2]. Below about 5 micrometers, the fine fraction — the accumulation mode (0.1-2.5 micrometers, 20-40% of mass) and the ultrafine mode (under 0.1 micrometers, less than 5%) — disperses too broadly to matter for local deposition; it is the PM2.5 fraction most relevant to respiratory exposure, removed by atmospheric processes rather than local settling [RB-011 §2.2, §3.3].

## Fire Risk Implications

Accumulated grease deposits from Zone 1 and Zone 2 on combustible surfaces (wood siding, vinyl, fabric awnings) represent a fire hazard. The accumulation rate depends on cooking frequency, source type (wood-fired produces the most aerosol), and capture efficiency of the installed hood.

## Source Paper

- [RB-011: Grease Aerosol Transport and Deposition](/research/rb-011-grease-aerosol-transport/) — Complete particle transport analysis
