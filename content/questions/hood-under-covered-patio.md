---
title: "Can I use an outdoor range hood under a covered patio?"
summary: "Yes — a wind-sheltered site is where an outdoor hood works best, and a covered kitchen is where one is most needed. The three constraints are clearance to the structure above the hood, getting the exhaust out from under the roof rather than back into it, and sizing for capture — under a roof, escaped smoke accumulates instead of dispersing."
date: 2026-07-12
lastmod: 2026-07-12
reviewed: true
weight: 8
draft: true
instruments: true
instrument_id: "i02"
instrument_preset: "wall-48"
citations: ["rb-008", "rb-012", "rb-007", "rb-011"]
---

<!--
DRAFT — W4 safety-adjacent install page. HELD FOR MARK ZURO'S PERSONAL
REVIEW (draft: true). Do not publish without Mark flipping the flag;
`reviewed: true` is contingent on that review actually happening.

CLAIMS I COULD NOT SOURCE from the RB papers (omitted or stated as model
assumption / qualitative physics — Mark may supply field experience):
1. Duct routing, duct termination, and ductless/recirculating operation.
   RB-008 lists "blower and duct sizing" only as unpublished downstream
   work. The duct section below states only the qualitative point that
   discharging captured effluent under the same roof defeats capture,
   and sends the reader to the manual/code authority for routing rules.
2. Minimum hood-to-ceiling clearance number for covered patios. RB-012
   §3.7 gives hood SURFACE temperatures and the clearance thresholds the
   codes it cites use, but no patio-ceiling clearance table. No number
   is invented.
3. The instrument's sheltered "recommended" figure (1,325 CFM for a
   48-inch wall hood): the 1.1x sheltered margin is the instrument
   model's assumption — RB-008's K_CFM framework is source-based and is
   silent on a width-based sheltered multiplier. Attributed in the text.
4. Whether any specific covered configuration counts as permitted
   "outdoor use" for a given appliance — manual territory, said so.
-->

Yes — and a covered, wind-screened site is actually where an outdoor hood performs best, because wind is the thing that breaks outdoor capture. The catch is that a covered patio is also where a hood is least optional: under open sky, escaped smoke disperses; under a roof it accumulates. So the hood you install has to genuinely work, and three constraints decide whether it does.

## Shelter is a capture advantage — if it is real shelter

RB-008 sizes exhaust by wind exposure class, and the multipliers fall as shelter improves: a sheltered site needs about 3.0&times; the bare plume flow, a moderate site 3.68&times;, and an exposed site without panels 5.75&times; (RB-008 §2.2). Note what counts as sheltered, though — RB-008's sheltered tables assume an "enclosed patio, courtyard, dense landscaping on all sides" with wind below 3 mph at cooking height (§3.2), while a covered porch open to the weather is classed as *moderate* exposure. A roof alone is not shelter; what matters is the wind the plume actually feels. Judge your site by its wind, not its roof.

The instrument above is set to a 48-inch wall hood over a 60,000 BTU grill. Switch its wind-exposure control to SHELTERED and the recommended tier drops from 1,500 to about 1,325 CFM — but the 1,200 CFM minimum does not move, because the minimum is set by capture physics, not weather. (The sheltered margin itself is the instrument model's assumption; RB-008's exposure factors are defined in a source-based framework and the paper is silent on this width-based mapping.) The full [CFM Sizing Calculator](/tools/cfm-calculator/) runs any width, mount, and BTU combination.

## Clearance to the structure above the hood

A roof means there is combustible construction above your hood, and hood surfaces run hot: at a 30-inch mounting height, peak surface temperatures reach roughly 95&ndash;178&nbsp;&deg;C and exceed the 71&nbsp;&deg;C (160&nbsp;&deg;F) clearance-to-combustibles threshold used by the codes RB-012 cites for most sources (RB-012 §3.7). The hood surface will not ignite anything by itself; the risk is sustained heat transfer into wood framing directly above it. RB-012's assessment is that clearance, heat shielding, or non-combustible construction above the hood eliminates this risk (§3.7) — but the specific clearance for your structure is a question for the hood's installation manual and your local code authority, not for a physics site.

## The exhaust has to leave the covered volume

A hood is only half of a ventilation system; the other half is where the captured effluent goes. The research program has not published duct-design guidance (RB-008 names blower and duct sizing as downstream work), so this page will not invent routing rules — but the qualitative physics is not negotiable: capture only counts if the smoke, grease, and combustion gases actually leave the covered volume. A hood that discharges under the same roof has moved the plume, not removed it, and the grease-laden airstream it concentrates is exactly the material RB-011 identifies as the fuel in hood-interior fire scenarios (RB-011 §3.6.3). Duct to the outside of the covered structure, per the manufacturer's instructions and local code.

## Do not let the roof shrink the hood

The most common outdoor installation failure is a compound one: a hood that is both too narrow and too weak, installed on indoor assumptions (RB-007 §3.1). A covered patio makes that failure worse, not better, because the escaped fraction now has nowhere to go — see [Is it safe to grill under a covered patio?](/questions/is-it-safe-to-grill-under-a-covered-patio/) for what accumulation means for fire and air quality, and [Does a covered outdoor kitchen need a hood?](/questions/does-a-covered-outdoor-kitchen-need-a-hood/) for why the roof raises the stakes. Size the hood for the grill and the site as if the roof were not there; treat the shelter as margin, never as a discount.
