---
title: "Does wind really affect an outdoor range hood?"
description: "Yes — modeled capture at a 48-inch island hood falls from 87% in still air to 51% at 5 mph and 8% at 10 mph in a side wind. Wind outweighs CFM or width."
summary: "Yes — at a 48-inch island hood in a side wind, modeled capture drops from about 87% in still air to 51% at 5 mph and to roughly 8% at 10 mph. Wind is the single largest variable in outdoor hood performance, larger than CFM or hood size, because it moves the plume out from under the hood before the exhaust can act on it."
date: 2026-07-11
lastmod: 2026-09-29
reviewed: true
weight: 2
instruments: true
instrument_id: "i03"
citations: ["rb-006", "rb-009"]
---

A 48-inch island hood at a standard 30-inch mounting height over a medium gas grill captures, in the OVS model, about **87% of the plume in still air**, **51% at 5 mph**, and roughly **8% at 10 mph** with the wind blowing across the hood face — all three along the side-wind axis, the model's reading against RB-006's escape thresholds (RB-006 §3.4; the model is one-dimensional along the wind axis, so the still-air figure is the plume fraction inside the hood's 12-inch end overhangs, not a two-dimensional capture). No amount of extra CFM fixes this on its own: RB-008 sizes an unshielded exposed site at 5.75 times the bare plume flow and still expects only about 60% capture, because wind doesn't just dilute the plume, it physically pushes it out from under the hood before the exhaust can act on it (RB-008 §3.3).

## What's actually happening

A buoyant plume rises straight up only in calm air. Any crosswind bends its path sideways as it climbs, by δ = 0.35 · U_w · z / u_0(z) — proportional to wind speed and to the height it has to rise, inversely to its own velocity (RB-006 §3.1). At a 30-inch rise a 5 mph breeze deflects the centerline about 11.7 inches (RB-006 Table 3.2b prints 12). The 48-inch hood overhangs the 24-inch cooking surface by exactly 12 inches per side, so at 5 mph the plume centerline is sitting on the hood's edge — RB-006's "centerline exits hood" threshold, at which about half the plume is outside (RB-006 §3.4). By 10 mph the deflection is 23.5 inches (RB-006 Table 3.2b prints 23), twice the overhang, which is why capture collapses between 5 and 10 mph rather than declining gently.

## Why smoke escapes on a breezy day

Wind speeds that feel trivial standing next to a grill are not trivial at the top of the plume's rise, and they are lower than the forecast: 5 mph at cooking height corresponds to a reported 8–10 mph, since weather stations measure at 10 m (RB-006 §4.2). The instrument above shows the deflection trajectory directly — drag the wind control and watch how quickly the plume's path exits the hood's footprint. The full [Wind Deflection Trajectories](/tools/wind-deflection-trajectory/) tool isolates this same model at every standard mounting height, from 18 to 48 inches, and flags the speeds above which RB-006 says the plume is disrupted altogether.

## What actually helps

Four things counter wind directly, and none of them is a bigger blower. **Mount lower**: the same hood in the same 5 mph breeze reads 83% at 18 inches against 51% at 30. **Add side panels**: two panels reaching two-thirds of the way down to the cooking surface cut the wind the plume feels by 60% — it experiences 40% of the ambient speed (RB-009 Table 3.1a) — lifting the 5 mph reading from 51% to 80% and the 8 mph reading from 20% to 70%. **Widen the hood**: the papers' recommended 57-inch width for this grill reads 72% at 5 mph, and 93% with panels (RB-006 Table 3.10 prints 70–75% and 88–92%). **Put a wall behind it** if the wind comes from behind: a rear wall cuts that wind by 60–80% (RB-006 §3.9.2). See the [side-panel](/questions/do-side-panels-work/), [mounting-height](/questions/mounting-height/) and [island-vs-wall](/questions/island-vs-wall-hood/) questions for the numbers.

## Practical takeaway

If a site sees sustained breeze above roughly 5 mph at cooking height — most open yards, elevated decks, and waterfront installs — plan for side panels, a wider hood, or a lower mount from the start rather than trying to out-blow the wind with a bigger fan.
