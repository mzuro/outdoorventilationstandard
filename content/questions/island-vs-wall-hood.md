---
title: "Island or wall-mounted outdoor range hood — which works better?"
description: "In an 8 mph wind from behind, a 48-inch wall hood holds 88% modeled capture; the same hood on an island drops to 12%. In a side wind the two are identical."
summary: "It depends on where the wind comes from. With the wind blowing from behind the grill, a 48-inch wall hood holds about 88% modeled capture at 8 mph while an island hood over the same grill drops to about 12% — the wall shelters the plume and reflects it back into the capture zone. With the wind blowing across the hood face, the wall is parallel to the flow and the two mounts read the same."
date: 2026-07-11
lastmod: 2026-09-29
reviewed: true
weight: 3
instruments: true
instrument_id: "i05"
citations: ["rb-005", "rb-002", "rb-006"]
---

With the wind from behind the grill the difference is the whole story. Along the rear-wind axis the OVS model gives a 48-inch wall hood about 97% in calm air and a same-width island hood about 76%; in an 8 mph rear wind the wall hood still holds roughly **88%** while the island hood falls to roughly **12%**. Turn the wind to blow across the hood face and the gap vanishes — along the side-wind axis both mounts read about 87% in still air and 20% at 8 mph, because a wall parallel to the flow shelters nothing. (The OVS capture model — which reads a Gaussian plume, σ = 1.5·b_T, a model assumption, against RB-006 §3.4's deflection-versus-overhang thresholds — is one-dimensional along the wind axis, so its still-air figure is the plume fraction inside the hood's overhang along that axis — front to back for a rear wind, end to end for a side wind — not a two-dimensional capture; that is why the two calm-air readings differ.) The mount question is really a wind-direction question.

## Why the wall matters so much

A wall behind the grill does two things. It shelters: within the recirculation zone behind a solid wall the effective wind is only 20–40% of the freestream, a 60–80% reduction in what the plume feels (RB-006 §3.9.2). And it reflects: plume gas that would otherwise drift past the open back edge meets the wall and is redirected up its face and back into the hood's suction field (RB-005 §3.4.4). The capture model gives the wall-mounted hood a one-sided aperture — the plume can only be pushed toward the open front — and applies the 70% midpoint of RB-006's sheltering range; an island hood has no such boundary on any side, so wind-deflected plume mass is simply lost. The full [Hood Geometry Comparison](/tools/hood-geometry-comparison/) tool lets you compare any two widths and mounts at your own wind speed.

## Depth is the island's lever, not width

Wall hoods in a standard outdoor lineup run 36 inches deep; island hoods run 40 inches. Over a 21-inch-deep cooking surface that gives the island hood only 9.5 inches of front-to-back overhang on each side, and against a rear wind that overhang is the entire defense — width adds nothing, since a wind blowing front-to-back never reaches the hood's ends. The papers' recommended depth for this grill at 30 inches is 53 inches (RB-002 Table 3.6b, D_min); a 57 × 53-inch island hood reads about 95% in calm air and 70% in a 5 mph rear wind in the model, against 76% and 39% for the 48 × 40-inch preset — all four along the rear-wind axis (the same 57 × 53 hood reads about 96% in still air along its side-wind axis, as the [Capture Demonstrator](/tools/capture-demonstrator/) notes). An island hood earns its keep front-to-back.

## When island still makes sense

Island installs are often unavoidable — outdoor kitchens built around a peninsula or bar have no wall to mount against, so a BBQ island vent hood is the only option. In that case, treat wind mitigation as mandatory rather than optional, and match it to the wind. Two side panels shelter against a lateral wind (60% reduction at two-thirds depth) but do little against wind from the front or rear (15%; RB-009 Table 3.1a); a rear panel — RB-009's three-sided configuration — is the island's substitute for the missing wall (RB-009 Table 3.1b). See [do side panels work](/questions/do-side-panels-work/). Airflow needs also rise: RB-008 multiplies every island requirement by 1.20, so the 60,000 BTU grill that needs 892 CFM on a wall needs 1,070 on an island (RB-008 §3.9) — see [what CFM you need](/questions/what-cfm-do-i-need/). And size the width to the plume as usual: [what size hood your grill needs](/questions/what-size-hood-for-my-grill/).

## Bottom line

Choose wall-mounted whenever the layout allows it — it is more forgiving of the most common wind direction with less hardware. Choose island only when the site requires it, give it real front-to-back overhang, and plan panels into the build rather than adding them after the first windy cookout reveals the gap.
