---
title: "How much clearance does an outdoor hood need?"
description: "Modeled hood surfaces reach 95-178 °C at a 30-inch mount — above the 71 °C threshold the IRC provision cited in RB-012 uses for clearance. Manual and code govern."
summary: "Clearance is two questions. Above and around the hood: modeled peak hood-surface temperatures run 95-178 °C at a 30-inch mount for the gas, charcoal, and wood sources tabulated — above the 71 °C surface-temperature threshold the IRC provision cited in RB-012 uses to trigger clearance to combustibles — so wood framing or a pergola roof above a hood needs clearance, heat shielding, or non-combustible construction. Below the hood, mounting height is a capture question. Your appliance manual and local code authority set the binding numbers; this page reports what the physics and the cited codes say, not a clearance of its own."
date: 2026-07-15
lastmod: 2026-07-15
reviewed: false
weight: 12
draft: true
instruments: true
instrument_id: "i09"
citations: ["rb-012", "rb-011", "rb-010", "rb-004"]
---

<!--
DRAFT — W5 safety page (G3, clearance to combustibles). HELD FOR MARK
ZURO'S PERSONAL REVIEW (draft: true), same gate as the W4 covered-patio
trio. Do not publish without Mark flipping the draft flag. `reviewed`
is deliberately false until that review actually happens (W5 review
finding): flip BOTH `draft` and `reviewed` together after Mark's review,
so the E-E-A-T byline never attests a review that has not occurred.

CLAIMS I COULD NOT SOURCE from the RB papers (deliberately omitted or
attributed to the codes rather than to this program):
1. NO OVS-issued clearance distance anywhere on this page. Every
   distance/threshold is presented as a citation to NFPA 211, IRC
   M1901.1, or the NFPA 10-ft grill recommendation exactly as RB-012
   §3.7 / RB-011 §3.6.3 report them. The papers do not derive an
   independent clearance number and neither does this page.
2. Minimum ceiling height above a hood — no RB source; reader directed
   to manual + code authority (same omission as the W4 trio).
3. IMC 507.2.6 / commercial Type-I hood clearances (which rank in this
   query's SERP) — not covered by any RB paper; deliberately not cited.
   Only the RB-004 §3.4 observation that IMC hood-clearance provisions
   assume a ceiling is used.
4. Clearance for horizontal/side combustibles at grill level (deck
   railings, cabinetry flanking the grill) — RB-011 covers grease
   deposition on those surfaces but no temperature/clearance analysis;
   omitted rather than invented.
5. This page links ONE draft page (is-it-safe-to-grill-under-a-covered-
   patio, the W4 covered-patio safety page); its other question link
   (mounting-height) is already published. Publish order matters — the
   trio is P0 and should ship first or simultaneously. AT PUBLISH: add
   the reciprocal body link from mounting-height (published, so it
   cannot carry a link to this draft until this page ships) — tracked
   in docs/superpowers/BACKLOG.md.
-->

Clearance is really two questions, and they point in opposite directions. Above and around the hood it is a fire question: hood surfaces get hot enough that the codes cited in the research program require distance from combustible construction. Below the hood it is a capture question — how high above the grill the hood should sit — answered separately in [how high an outdoor hood should be mounted](/questions/mounting-height/). On both, your appliance manual and your local building or fire code authority set the binding numbers; this page reports what the physics and the cited codes say, and issues no clearance of its own.

## Above the hood: the surfaces run hotter than the code threshold

The modeled peak hood-surface temperature at an 18-inch mount is 145-254&nbsp;°C depending on the source, 95-178&nbsp;°C at 30 inches, and still 64-114&nbsp;°C at 48 inches (RB-012 §3.7). For comparison, the IRC clearance provision cited in RB-012 treats 71&nbsp;°C (160&nbsp;°F) as the surface temperature above which equipment must maintain clearance to combustible construction, and NFPA 211 requires 6 inches of clearance for connectors running at 121&nbsp;°C or more, reduced to 1 inch with approved heat shields (RB-012 §3.7). Most source types exceed the 71&nbsp;°C threshold at a 30-inch mount, and all but the weakest still do at 48 inches (RB-012 §3.7); the notable exception is a pellet smoker in low mode, which stays below it at every tabulated height (RB-012 Tables 3.6-3.8). That is the physics reason wood framing, a pergola beam, or a patio-roof joist directly above a hood needs clearance, heat shielding, or non-combustible construction, not just paint.

One nuance this page states more narrowly than the paper does: RB-012 §3.7 says the hood surface itself is not a fire hazard because it sits "well below ignition temperature for any common material" — but the same section's numbers support only a scoped version of that reassurance. Long-term exposure ignition for unpainted softwood begins around 120-150&nbsp;°C and short-term (minutes) ignition at roughly 250&nbsp;°C and above (RB-012 §3.7); the paper's own worst modeled case — a large wood-fired source at an 18-inch mount — reaches 254&nbsp;°C, at the edge of the short-term band, and most sources at 18-30 inches model above the long-term band (RB-012 Table 3.4c). What holds at every height is the mechanism: the hazard is sustained heat transfer from a hot hood surface to combustibles held close to it, and distance, shielding, or non-combustible construction eliminates it.

## The fuel decides how hot — through radiative fraction, not BTU

Those wide temperature ranges are source ranges, not uncertainty. At an 18-inch mount the modeled peak runs from 59&nbsp;°C over a pellet smoker in low mode to 254&nbsp;°C over a large wood-fired source (RB-012 §3.4). The first entry on RB-012's commonly-misunderstood list is treating a BTU rating as a proxy for that spread: total heat output does not predict hood surface temperature — the radiant load χ<sub>r</sub>&nbsp;·&nbsp;Q<sub>total</sub> does, and charcoal's radiative fraction (0.40-0.55) is roughly double that of gas (0.20-0.30), so a 30,000 BTU/hr charcoal fire heats the hood like a 60,000 BTU/hr gas grill (RB-012 §5.2.1, §4.1; radiative fractions per §3.1). The instrument above compares appliances on a different axis — heat release rate, the input that drives plume rise velocity and CFM sizing, not hood temperature; the full [Heat Release Rate Comparison](/tools/heat-release-rate-comparison/) tool carries that comparison. A hood installed over a gas grill today may sit over a charcoal or wood fire next season, which is why RB-012 recommends rating the installation for the worst source it may ever serve, not the first one (RB-012 §4.2).

## Around the grill: the 10-foot recommendation

Separate from the hood, RB-011 reports the NFPA-recommended minimum of 10 feet (3 meters) between grills and combustible structures, and finds it consistent with the grease-deposition physics: by 3 meters downwind, seasonal grease accumulation falls to 1-4 g/m² — below the threshold for significant fire-risk enhancement (RB-011 §3.6.3). A roofed outdoor kitchen puts structure permanently inside that radius, which shifts the load onto capture, cleaning, and clearances — the situation examined in [is it safe to grill under a covered patio](/questions/is-it-safe-to-grill-under-a-covered-patio/).

## Below the hood: a capture question with a thermal twist

Mounting height is set by capture physics, but heat pulls the other way: raising a hood from 18 to 36 inches cuts its peak surface temperature roughly 45-55%, while the same rise degrades capture and inflates the required CFM (RB-012 §4.5). For 304 stainless there is no thermal constraint and the capture optimum governs; thermally limited materials (galvanized, aluminum, standard powder coat) may force a higher mount than capture would want (RB-012 §4.5) — one more reason material and height should be decided together.

## Why you must ask your local authority

None of the standards the research program reviewed issues outdoor-specific clearances for residential cooking ventilation — RB-010's applicability survey classifies hood clearance as "applicable but incomplete" (RB-010 Diagram 6.3). The indoor codes' hood-clearance provisions assume a ceiling exists (RB-004 §3.4); NFPA 96's fire-protection framework was developed for indoor commercial kitchens and does not address outdoor fire dynamics — unlimited air, wind spread, no room confinement (RB-010 Gap S-6); and local amendments for outdoor kitchens vary from full indoor-code application to complete exemption (RB-010 Gap C-3). In that gap, the two documents with actual authority over your installation are the appliance manual's placement restrictions and whatever your local code official applies. Ask before building; the answer is jurisdiction-specific by design.

## The honest checklist

Keep combustible construction above the hood at the clearance your code authority and the hood's listing require — the surface temperatures make that a physics necessity, not bureaucracy. Treat the NFPA 10-foot grill-to-structure recommendation as the default where nothing closer is explicitly permitted. Choose the hood material for the hottest fuel you'll ever burn under it. And if any of this page's cited thresholds conflict with your manual or your local code, the manual and the code win — they are the binding documents; this page is the explanation of why they ask for what they ask.
