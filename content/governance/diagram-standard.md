---
title: "Diagram Standard v2.1"
description: "Visual governance standard for all diagrams produced under the Outdoor Ventilation Standard Research Program."
date: 2025-08-01
lastmod: 2025-10-20
weight: 30
---

**Version:** 2.1
**Status:** Active
**Governing Document:** Outdoor Ventilation Standard Charter v2.6

This document establishes the visual governance standard for all diagrams produced under the Outdoor Ventilation Standard Research Program. All diagrams must adhere to these conventions to ensure consistency, technical accuracy, and alignment with the controlled vocabulary defined in Glossary v1.1.

---

## General Principles

1. **Physics fidelity over aesthetics.** Diagrams must accurately represent physical mechanisms. Artistic embellishment that distorts spatial relationships, flow direction, or relative scale is prohibited.

2. **Glossary-aligned labeling.** All labels, annotations, and callouts must use exact terms from Glossary v1.1. No synonym substitution.

3. **Orientation convention.** All diagrams use a consistent coordinate system:
   - Vertical axis: height above cooking surface (z)
   - Horizontal axis: lateral distance from plume centerline (r) or downwind distance (x)
   - Origin: center of the cooking surface at grate level

4. **Scale indicators.** Every diagram must include either a scale bar or explicit dimensional annotations. Qualitative-only diagrams must be labeled "Not to Scale."

---

## Required Diagram Types

The following diagram types form the canonical visual vocabulary for this research program. Each type has a defined purpose, required elements, and labeling conventions.

---

### Diagram Type 1: Buoyant Cooking Plume Profile

**Purpose:** Illustrate the structure and zones of a buoyant cooking plume rising from a barbecue source.

**Required Elements:**
- Cooking surface / grate (shown as a horizontal bar at z = 0)
- Near-Field Plume Region (labeled, shaded distinctly)
- Far-field plume region with expanding boundary
- Plume centerline (dashed vertical line)
- Plume boundary edges showing linear expansion with height
- Entrainment arrows (horizontal, pointing inward at plume boundary)
- Centerline velocity profile indicator (showing decay with height)

**Labeling Requirements:**
- "Buoyant Cooking Plume"
- "Near-Field Plume Region"
- "Entrainment Zone" (at boundary)
- "Velocity Decay" (annotated along centerline)
- Height reference marks (z values)

**Notes:** The plume boundary should depict the linear growth rate b = (6/5) * alpha * z. The near-field region should be visually distinct from the far-field self-similar region.

---

### Diagram Type 2: Entrainment and Velocity Decay

**Purpose:** Show the quantitative relationship between plume height, entrainment rate, and centerline velocity decay.

**Required Elements:**
- Vertical axis: height above source (z)
- Plume width expanding with height (both sides of centerline)
- Entrainment arrows at multiple heights, with arrow length proportional to local entrainment velocity
- Centerline velocity magnitude indicators (decreasing with height)
- Optional: side panel showing velocity decay curve (u_0 vs z)

**Labeling Requirements:**
- "Entrainment Zone"
- "Velocity Decay"
- Entrainment coefficient alpha value (if quantitative)
- Velocity decay exponent notation: u_0 ~ z^(-1/3)
- Temperature decay exponent notation: delta_T ~ z^(-5/3)

**Notes:** This diagram is the primary tool for explaining why hood mounting height is a critical design parameter.

---

### Diagram Type 3: Hood-Plume Interaction (Capture Success)

**Purpose:** Illustrate successful plume capture by a canopy hood.

**Required Elements:**
- Cooking surface at z = 0
- Buoyant Cooking Plume rising from source
- Hood canopy shown at mounting height with correct proportional geometry
- Plume Interception Plane (horizontal dashed line at hood inlet elevation)
- Capture Envelope (shaded volume between hood and source)
- Effective Capture Area (highlighted region of hood face)
- Airflow arrows showing plume entering hood inlet
- Exhaust duct with directional arrow

**Labeling Requirements:**
- "Capture Envelope"
- "Plume Interception Plane"
- "Effective Capture Area"
- Hood mounting height dimension
- Hood overhang dimension
- "Buoyant Cooking Plume"

**Notes:** The plume cross-section at the interception plane must be shown as smaller than the effective capture area to represent the success condition.

---

### Diagram Type 4: Hood-Plume Interaction (Capture Failure)

**Purpose:** Illustrate one or more failure modes where the plume escapes the hood.

**Required Elements:**
- Same base elements as Diagram Type 3
- Missed Plume Region (shaded, distinct color from captured flow)
- At least one failure mechanism depicted:
  - Plume wider than hood at interception plane (geometry failure)
  - Plume laterally displaced by wind (wind failure)
  - Plume penetrating past hood face (momentum-limited capture)
- Arrows showing escaped plume path

**Labeling Requirements:**
- "Missed Plume Region"
- "Momentum-Limited Capture" (if applicable)
- "Wind-Affected Plume Behavior" (if applicable)
- Failure cause annotation

**Notes:** Failure diagrams should be paired with the corresponding success diagram to provide clear contrast. The missed plume region must be visually prominent.

---

### Diagram Type 5: Wind-Affected Plume Behavior

**Purpose:** Illustrate the effect of ambient crosswind on plume trajectory and hood capture.

**Required Elements:**
- Cooking surface at z = 0
- Plume with bent trajectory (showing wind deflection)
- Wind direction arrow (horizontal, with velocity label U_w)
- Undisturbed plume path (dashed, for comparison)
- Hood position relative to deflected plume
- Missed Plume Region (if plume is deflected beyond hood)
- Enhanced entrainment on windward side

**Labeling Requirements:**
- "Wind-Affected Plume Behavior"
- Wind velocity and direction
- "Missed Plume Region" (if applicable)
- "Capture Envelope" boundary
- Deflection angle or trajectory annotation

**Notes:** Show at least two wind conditions: moderate (partial capture) and strong (capture failure). Reference Briggs' two-thirds law for trajectory shape.

---

### Diagram Type 6: Open-Boundary Dilution Comparison

**Purpose:** Contrast plume behavior in enclosed (indoor) vs. open-boundary (outdoor) environments.

**Required Elements:**
- Side-by-side or split diagram:
  - Left: Indoor scenario with walls and ceiling confining plume, pressure-assisted capture
  - Right: Outdoor scenario with open boundaries, three-dimensional dispersion
- Plume paths in both scenarios
- Concentration gradient indicators (dense near source, diffuse at distance)
- Hood in both scenarios for direct comparison

**Labeling Requirements:**
- "Open-Boundary Dilution" (outdoor side)
- "Pressure-Assisted Capture" (indoor side, noting this term is descriptive, pending glossary formalization)
- "Buoyant Cooking Plume" (both sides)
- Wall/ceiling boundaries clearly marked on indoor side
- Open boundary indicators on outdoor side

**Notes:** This is the primary diagram for explaining why indoor ventilation assumptions fail outdoors. The contrast must be visually immediate and unambiguous.

---

## Color Conventions

| Element | Color | Usage |
|---------|-------|-------|
| Buoyant Cooking Plume | Warm gradient (amber to light yellow) | Plume body in all diagrams |
| Capture Envelope | Light blue, semi-transparent | Successful capture zone |
| Missed Plume Region | Red or orange, semi-transparent | Escaped plume volume |
| Entrainment arrows | Gray or light blue | Ambient air being drawn in |
| Hood structure | Dark gray or black outline | Hood canopy and duct |
| Cooking surface | Dark brown or black | Grate or cooking surface |
| Wind arrows | Blue | Ambient crosswind direction |
| Annotations / labels | Black text | All text labels |

---

## Annotation Standards

1. **Leader lines** connect labels to diagram elements. Use straight lines with a terminal dot or arrowhead. Avoid crossing leader lines where possible.

2. **Dimension lines** follow standard engineering drawing conventions: thin lines with terminal ticks or arrows, dimension value centered above the line.

3. **Equation callouts** may be placed in a bordered box adjacent to the relevant region. Use the exact notation from Glossary v1.1.

4. **Figure numbering** follows the format: `Figure [Section].[Sequence]` (e.g., Figure 3.1 for the first diagram in Section 3 of a research output).

5. **Figure captions** must include the diagram type name and a one-sentence description of what the diagram demonstrates.

---

## Prohibited Practices

- Diagrams that depict plume behavior inconsistent with the physical mechanisms described in Glossary v1.1
- Marketing-style illustrations that emphasize product appearance over physics
- Unlabeled diagrams or diagrams using non-glossary terminology
- Diagrams without scale or "Not to Scale" notation
- 3D perspective renderings that distort spatial relationships (use orthographic or sectional views)
- Decorative elements (flames, food imagery, lifestyle context) that do not serve a physics communication purpose

---

## Future Additions (Planned)

- Diagram Type 7: Comparative Hood Geometry (shallow vs. deep canopy)
- Diagram Type 8: Side Panel / Wind Baffle Effect
- Diagram Type 9: CFM vs. Capture Efficiency Relationship
- Interactive diagram specifications for digital publications
