---
title: "Wind Deflection Trajectories"
description: "Side-view diagram showing how crosswind bends the buoyant cooking plume at different wind speeds, from still air to 12 mph. Illustrates the critical wind speed for capture failure."
date: 2025-11-20
lastmod: 2026-07-11
reviewed: true
tags: ["wind effects", "plume deflection", "visualization"]
categories: ["Tools"]
ShowToc: false
weight: 3
instrument_id: "i03"
related_questions:
  - "/questions/does-wind-affect-my-hood/"
related_papers:
  - "/research/rb-006-wind-interaction-crossflow/"
  - "/research/rb-009-side-panel-effectiveness/"
---

This diagram shows how ambient crosswind deflects the buoyant cooking plume away from the hood's capture zone. Even moderate breezes (5 mph) can push the plume to the edge of hood coverage, and winds above 8 mph cause outright capture failure for unshielded installations.

<div style="max-width: 880px; margin: 0 auto;">

<!-- The figure below is auto-embedded by tools/single.html from this
     page's `instrument_id` front matter; no shortcode call is needed
     here. Left in prose form as a note for anyone reading the source. -->

</div>

---

## Reference readings

*Representative values below are computed directly from the same wind-coupled deflection model (`physics/wind.mjs`, `physics/capture.mjs`) driving the instrument above, no side panels; live values update as you move the controls.*

| Mounting rise | 3 mph | 5 mph | 8 mph | 12 mph | 20 mph |
|---|---|---|---|---|---|
| 18″ | 4.3″ | 7.1″ | 11.4″ | 17.1″ | 28.5″ |
| 30″ | 7.8″ | 13.0″ | 20.8″ | 31.2″ | 51.9″ |
| 48″ | 14.0″ | 23.3″ | 37.2″ | 55.8″ | 93.1″ |

At a 30-inch mounting height, a 5 mph crosswind deflects the plume centerline about 13 inches — approaching the 17-inch overhang RB-005 recommends for a medium gas grill at that mounting height [RB-005 §3.1] — and an 8 mph crosswind deflects it about 21 inches, beyond any reasonable overhang [RB-006 §3.1]. The same crosswind deflects a plume roughly 1.8× farther at a 48-inch mounting height than at 30 inches, because the plume has more time to drift sideways before it reaches a higher hood [RB-006 §3.1]. Deflection scales linearly with wind speed at a fixed mounting height in this model: at 30 inches, the 12 mph deflection (31.2 inches) is almost exactly four times the 3 mph deflection (7.8 inches), matching the model's linear wind term [RB-006 §3.1].

## Key Findings

**3 mph is manageable.** At light breezes, the plume deflects approximately 8 inches at 30-inch mounting height — well within the recommended 17-inch overhang margin.

**5 mph is marginal.** The 13-inch deflection approaches the overhang limit. Gusts beyond 5 mph will intermittently push the plume outside the hood boundary, producing the characteristic gust-correlated smoke escape of FM-4 (wind-deflected plume escape).

**8 mph and above cause failure.** The roughly 21-inch deflection exceeds any reasonable overhang. Side panels or wind baffles become mandatory at this exposure level.

**12+ mph is impractical for open hoods.** At sustained winds above 12 mph, the plume is laid nearly horizontal. No conventional canopy hood can capture this — physical enclosure is required.

## Source Papers

- [RB-006: Wind Interaction and Crossflow](/research/rb-006-wind-interaction-crossflow/) — Complete deflection analysis
- [RB-009: Side Panel Effectiveness](/research/rb-009-side-panel-effectiveness/) — Wind mitigation strategies
