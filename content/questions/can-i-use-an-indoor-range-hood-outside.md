---
title: "Can I use an indoor range hood outside?"
description: "Physically yes, but the ratings don't transfer: outdoors a hood loses all six indoor capture mechanisms, and indoor CFM rules run 1.7-2.5x too low (RB-004)."
summary: "Physically, yes — but its ratings won't come with it. Indoors a hood gets six free capture assists: walls, a ceiling, room negative pressure, controlled makeup air, still air, and a finite room volume that recirculates escaped smoke back to the hood. Outdoors all six are gone, first-pass capture is the only capture, and the indoor rules a spec sheet is built on run 1.7-2.5x too low for open-air conditions."
date: 2026-07-15
lastmod: 2026-07-15
reviewed: true
weight: 10
instruments: true
instrument_id: "i08"
citations: ["rb-004", "rb-008", "rb-012"]
---

An indoor range hood will bolt to an outdoor wall and its blower will spin — but the performance printed on its spec sheet was measured in a room, and the room is doing much of the work. RB-004 catalogues six indoor capture mechanisms an enclosed kitchen provides for free: walls that funnel air back toward the hood, a ceiling that collects and recirculates escaped smoke, negative room pressure that drifts contaminants hoodward, makeup air delivered gently on purpose, the near-total absence of wind, and a finite room volume the exhaust keeps turning over (RB-004 §2.1). Outdoors, every one of them is absent. Whatever the hood misses on the first pass is gone — outdoor capture efficiency *is* first-pass capture efficiency, with no recirculation credit (RB-004 §2.3).

## The environment is the difference, not the appliance

The plume coming off the grill doesn't know whether it's indoors or outdoors — velocity, temperature, and mass flow are identical; the entire performance gap comes from the capture environment (RB-004 §3.9). The instrument above isolates the one environmental variable that moves most: with the same 48-inch island hood, the model reads about 97% capture in still, indoor-like air, but about 46% in an 8 mph crosswind — no change to the hood at all. Open the full [Indoor vs. Outdoor Ventilation Comparison](/tools/indoor-vs-outdoor-comparison/) for the mechanism-by-mechanism breakdown.

## The spec-sheet numbers don't transfer

The familiar indoor sizing rules understate outdoor requirements systematically, not marginally:

- **CFM.** The indoor ASHRAE BTU method assigns 1 CFM per 100 BTU/hr — 600 CFM for a 60,000 BTU grill (RB-008 §2.3). The physics-based outdoor analysis shows that same grill at a 30-inch mount needs 727 CFM even sheltered and 892 CFM in moderate exposure — the indoor rule underspecifies by 21% to 49% (RB-008 §4.3), and across indoor exhaust-rate tables generally the shortfall is 1.7-2.5x (RB-004 §3.4, §4.1). See [what CFM you need](/questions/what-cfm-do-i-need/) for outdoor-derived figures.
- **Capture ratings.** A UL 710 capture rating is measured in an enclosed test room with all six indoor assists present; a hood rated at 85% there may achieve only 50-65% first-pass capture outdoors, depending on wind and installation geometry (RB-004 §3.3.2).
- **Overhang.** Indoor practice sizes overhang at 6-9 inches per side; outdoor conditions call for 15-26 inches per side because the open-air plume spreads unconfined and wind deflects it (RB-004 §4.2). See [what size hood your grill needs](/questions/what-size-hood-for-my-grill/).

## Heat at the hood face is harsher than indoor duty assumes

Grills radiate far more heat into the hood than indoor ranges do. At a 30-inch mounting height the modeled peak hood-surface temperature runs roughly 95-178&nbsp;°C depending on the source (RB-012 §3.7). Against the material ratings in RB-012 §3.4, standard powder coatings (rated around 175&nbsp;°C) and aluminum (recommended maximum 150&nbsp;°C) are marginal-to-failing over hotter sources at low mounts, while 304 stainless steel and copper are the only common hood materials the paper rates unconditionally safe for all sources at all mounting heights (RB-012 §4.2). Many indoor hoods use exactly the materials that sit on the wrong side of that line.

## What this page does not cover

Weather sealing, corrosion resistance, motor enclosures, and electrical listing for damp or wet locations are manufacturer and listing matters — they are outside this research program's scope, and nothing here should be read as clearing an indoor-listed appliance for outdoor installation. This page covers the capture physics only; the listing question belongs to the manufacturer's documentation and your local code authority.

## The bottom line

The honest answer isn't "indoor hoods are flimsier" — it's that indoor ratings describe a partnership between hood and room. Take the room away and the same hardware needs roughly twice the airflow and substantially more width and overhang to do the same job. Size to the outdoor numbers first; whether a given appliance may be installed outdoors at all is a listing question its manufacturer has to answer.
