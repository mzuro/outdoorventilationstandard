---
title: "Where does the grease from an outdoor grill go?"
description: "Three places: the hood's filters and tray if captured; surfaces within about 5 meters for escaped coarse droplets; the wider air for the fine fraction."
summary: "Three destinations. Captured grease ends up in the hood's filters and tray — baffles catch 70-98% of the coarse droplets that carry most of the mass (85-98% for those above 20 micrometers). Escaped coarse droplets land close: above 50 micrometers within about a meter, 20-50 micrometers within 1-5 meters downwind. The fine fraction disperses too widely to deposit locally. So the grease film on the hood, deck, and downwind furniture is a direct readout of how much the hood missed."
date: 2026-07-15
lastmod: 2026-07-15
reviewed: false
weight: 14
draft: true
instruments: true
instrument_id: "i10"
fallback_svg: "grease-aerosol-deposition"
citations: ["rb-011", "rb-012"]
---

<!--
DRAFT — W5 safety/YMYL page (where does grill grease go). HELD FOR MARK
ZURO'S PERSONAL REVIEW (draft: true), same gate as the G3 clearance page
and the W4 covered-patio trio. Do not publish without Mark flipping the
draft flag. `reviewed` is deliberately false until that review actually
happens (W5 review2 finding): flip BOTH `draft` and `reviewed` together
after Mark's review, so the E-E-A-T byline never attests a review that
has not occurred.

WHY THIS PAGE IS GATED (the YMYL trigger, per W5 review2 Major):
The page carries actionable fire-prevention guidance, not just staining
physics — a dedicated H2 ("Why the 'where' matters: fire, not just
staining") plus prescriptive cleaning cadences: an ignitable film
(5-20 g/m²) forms within 1-2 seasons if never cleaned; "clean the deck
within half a meter of the grill after every session and out to 2 meters
monthly"; "filter cleaning is a fire-prevention measure." That
fire-prevention cleaning-cadence language is the YMYL trigger.

MARK'S DECISION (one of two):
  (a) KEEP the fire language and publish as SAFETY GUIDANCE — then it
      stays gated in the safety-review cluster and ships only after your
      personal review, alongside the G3/W4 safety pages; OR
  (b) STRIP the fire/cleaning-cadence language down to pure deposition
      physics (where the grease goes, capture as the control knob) —
      then it is no longer YMYL and can publish as a normal
      non-safety question page.
Until you choose, it stays draft:true.

WHAT ELSE WAS SOFTENED THIS ROUND (W5 review2 minors, still in place):
1. Baffle 70-98% capture is now scoped to droplets >10 µm (per RB-011
   §4.2), not the whole >2.5 µm coarse mode (§3.1 gives 20-40% at
   1-5 µm, 50-70% at 5-10 µm — the old wording over-claimed).
2. §3.4/§3.5 deposition fluxes now carry the "modeled engineering
   estimates, not field-validated" qualifier RB-011 §5.2 requires.
3. The 5-12 g/m²/season figure now states the 2-hour/session basis
   RB-011 §3.4/§3.6.2 uses, so the arithmetic closes.

BACKLINK: the grease-aerosol-deposition tool's related_questions entry to
this page is commented out while this is draft (avoids an empty "Questions"
section); uncomment it AT PUBLISH. The theme's related render already uses
.Site.GetPage, so no link 404s regardless.
-->

Cooking grease leaves the grill as an aerosol, and particle size decides everything that happens next. Most of the mass — 50 to 80% — rides in coarse droplets larger than 2.5 micrometers (RB-011 §2.2), and coarse droplets don't travel: those above 50 micrometers settle within about a meter of the escape point, the 20-50 micrometer band within 1 to 5 meters downwind, and the 10-20 micrometer band within 5 to 30 meters (RB-011 §3.3). Particles below 5 micrometers disperse too broadly to matter for local deposition. What the hood captures ends up in its filters and grease tray — standard baffle filters hold 70-98% of the droplets above 10 micrometers, which carry most of the coarse mass, and 85-98% of those above 20 micrometers (RB-011 §3.1, §4.2); what it misses becomes the film on the hood exterior, the deck, and whatever sits downwind.

## The deposition map

These deposition fluxes are modeled engineering estimates — derived from the dispersion model and published deposition velocities, not yet validated by field measurement (RB-011 §5.2). The heaviest deposition lands on the hood's own outer surfaces — 500 to 2,000 mg/m² per hour, visible after a single session — followed by the decking directly below and around the grill at 100 to 450 mg/m² per hour (RB-011 §3.5). A horizontal surface 2 meters downwind collects roughly 50 to 120 mg/m² per cooking hour, which over a 50-session season of roughly two-hour sessions compounds to about 5 to 12 grams per square meter (RB-011 §3.4). The instrument above shows the model's vertical intensity profile for the missed-plume region — brightest near the source and fading with height; in the module driving it, deposition intensity falls to roughly half its source value by 30 inches up.

## Capture efficiency is the control knob

Deposition is not a fixed tax on grilling — it tracks the hood's capture fraction directly. A hood achieving 95% capture holds the 2-meter deposition rate to about 3-10 mg/m² per hour, cosmetically negligible; the same site at 50% capture sees 100-250 mg/m² per hour, visible staining after one session (RB-011 §4.1). Under the most common failure conditions — inadequate overhang, or a crosswind around 5 mph — 25 to 40% of the aerosol escapes, roughly 75 to 120 grams of grease spread over adjacent surfaces per season (RB-011 §3.2); push the wind to 8 mph with no side panels and the paper's own failure-mode table puts escape at 45-55% (RB-011 Table 3.2). The levers that raise capture are the usual ones: [width and overhang](/questions/what-size-hood-for-my-grill/), [CFM](/questions/what-cfm-do-i-need/), and [wind mitigation](/questions/do-side-panels-work/).

## Wind turns a circle into an arrow

In calm air the deposition footprint is a rough circle centered under the grill; with wind it becomes a downwind ellipse, and a surface 2 meters downwind receives 2 to 4 times what it would in calm conditions (RB-011 §3.7, §4.3). The paper's practical corollary: place combustible or hard-to-clean surfaces upwind of the grill, not downwind, and orient the installation for the prevailing breeze (RB-011 §4.3).

## Why the "where" matters: fire, not just staining

The dominant outdoor grease-fire scenario in the papers is not spontaneous ignition — it is a flare-up or ember reaching a surface that has quietly accumulated grease (RB-011 §3.6.1). The deposition physics sets the timeline: an ignitable film (5-20 g/m²) forms on the deck directly below the grill within 1 to 2 seasons if never cleaned, which is why RB-011's practical recommendation is cleaning the deck within half a meter of the grill after every session and out to 2 meters monthly during the season (RB-011 §3.6.4). Inside the hood the concentration is highest of all: the plume impingement pattern loads the hood's center 2 to 3 times faster than its edges (RB-012 §4.4), each 2-hour session adds about 7 grams to the filters, and manufacturer guidance to clean or replace them every 1 to 3 months is consistent with that loading rate (RB-011 §3.9). The paper's framing is worth repeating: filter cleaning is a fire-prevention measure, not just a performance measure (RB-011 §4.5), and a neglected grease tray is its highest-fire-risk scenario outright (RB-011 §3.6.3, §4.4). The physics explains those cadences; the binding cleaning schedule for your installation is the manufacturer's.

## The bottom line

Grease goes where the physics sends it: mass-heavy coarse droplets land within arm's reach to a few meters, the fine fraction leaves the neighborhood, and the split between "in the tray" and "on the deck" is set almost entirely by capture. If surfaces around the grill are filming up, read it as a capture diagnosis — then fix the width, airflow, or wind exposure that's causing the miss, and keep the surfaces the papers flag on a cleaning cadence. The full [Grease Aerosol Deposition Pattern](/tools/grease-aerosol-deposition/) tool carries the complete transport analysis.
