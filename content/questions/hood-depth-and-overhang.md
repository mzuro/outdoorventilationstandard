---
title: "How far should an outdoor hood extend past the grill?"
description: "The plume over a medium gas grill is 27 inches across at the grate and 41 by a 30-inch mount. Overhang keeps the hood ahead of that growth and the wind."
summary: "The plume's capture diameter over a medium gas grill is already about 27 inches at the cooking surface — wider than the 24-inch grate — and grows to about 41 inches by a 30-inch mounting height and 50 inches by 48 inches (RB-002). The hood has to overhang the grill on every side to stay ahead of that growth, and then by more on the side the wind pushes toward: the papers call for 11 to 26 inches per side depending on height."
date: 2026-07-11
lastmod: 2026-09-26
reviewed: true
weight: 4
instruments: true
instrument_id: "i01"
instrument_preset: "island-54"
citations: ["rb-002", "rb-005", "rb-006"]
---

A cooking plume's capture diameter — the 98% flux contour plus the source width — is about **27 inches** at the surface of a medium gas grill, already 3 inches wider than its 24-inch grate, and widens as it rises through entrainment of surrounding air. By a 30-inch mounting height it has grown to about **41 inches**; by 48 inches, about **50 inches** (RB-002 Table 3.3a prints 1.05 m and 1.27 m; the formula is d_capture = 0.48 · (z − z_0) + D_eff, RB-002 App. A.3). The hood's overhang exists to stay ahead of that growth, not just to look proportional: RB-005 puts the recommended overhang at 11 to 26 inches per side across the 18-to-48-inch height range, and 15 to 20 inches per side at 30 inches (RB-005 §3.1) — 17 inches for this grill, which is how RB-002 arrives at its 57-inch recommended width (RB-002 Table 3.7).

## Overhang isn't cosmetic

Every inch a hood's edge sits past the grill's edge is an inch of margin against a plume that is continuously spreading outward as it rises, plus whatever a crosswind adds on top of the natural growth. Undersized overhang is a design-locked failure — it can't be fixed after installation the way a CFM shortfall can be corrected with a stronger blower (RB-007 §3.9). The instrument above is set to a 54-inch island hood, 15 inches of overhang beyond the cooking surface at each end; in the capture model it reads about 94% in still air and 66% in a 5 mph side wind. Open the full [Capture Demonstrator](/tools/capture-demonstrator/) to move mounting height, width, wind speed and wind direction together and watch the capture boundary shift.

## Width keeps paying until the overhang beats the wind

In a side wind, each 6 inches of width is worth real capture until the overhang exceeds the wind's deflection plus the plume's spread. At a steady 5 mph across the hood face — 11.7 inches of centerline deflection at 30 inches (RB-006 Table 3.2b) — the model reads about 36% for a 42-inch island hood, 51% at 48 inches, 66% at 54, 78% at 60 and 94% at 72 inches over the identical grill. The papers' 57-inch recommendation sits where the overhang (17 inches) clears the deflection with a plume half-width to spare, RB-006's 25%-escape condition (RB-006 §3.4).

## Depth is the same question turned ninety degrees

When the wind blows from the front or rear, what matters is the front-to-back overhang, and width does nothing. A typical 40-inch-deep island hood over this grill's 21-inch cooking depth has only 9.5 inches of overhang each way and reads about 39% in a 5 mph rear wind; the papers' recommended depth is 53 inches (RB-002 Table 3.6b). A wall behind the grill removes that exposure — see [island vs. wall](/questions/island-vs-wall-hood/).

## What drives capture once overhang is adequate

Once the hood clears the plume plus its wind deflection, the remaining levers are the ones that shrink the deflection itself: mounting lower, adding side panels, or siting the hood somewhere less exposed. See the [mounting-height](/questions/mounting-height/) and [side-panel](/questions/do-side-panels-work/) questions for the numbers behind each option.

## Practical takeaway

Size overhang to the plume's width at your actual mounting height plus the deflection of the wind you actually get — on the axis the wind comes from — not to the grill's dimensions alone. The side-to-side width half of the decision is covered in [what size hood your grill needs](/questions/what-size-hood-for-my-grill/).
