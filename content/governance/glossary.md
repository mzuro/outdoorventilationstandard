---
title: "Glossary v1.1"
description: "Controlled vocabulary for all research, publications, and agent outputs produced under the Outdoor Ventilation Standard Research Program."
date: 2025-08-01
lastmod: 2025-10-12
weight: 20
---

**Version:** 1.1
**Status:** Active
**Governing Document:** Outdoor Ventilation Standard Charter v2.6

This glossary defines the controlled vocabulary for all research, publications, and agent outputs produced under the Outdoor Ventilation Standard Research Program. All contributors — human or AI — must use these exact terms. Synonym substitution and alternate phrasing are prohibited per the Research Program Charter.

---

## Core Terms

### 1. Buoyant Cooking Plume

The thermally driven, turbulent column of heated air, combustion byproducts, aerosolized grease particulates, and gaseous cooking effluent that rises from a barbecue or high-heat cooking surface due to the density differential between the heated gas mixture and the surrounding ambient atmosphere. The plume is initiated by convective heat transfer from the cooking surface and flame, producing a localized region of reduced-density gas that accelerates upward under gravitational buoyancy forces. In the far-field, the plume behaves as a weakly buoyant turbulent plume whose centerline velocity, temperature excess, and radius are described by the Heskestad plume correlations and the Morton-Taylor-Turner (1956) integral model.

**Source Domain:** Fire science; buoyant plume fluid dynamics
**Physical Mechanism:** Gravitational buoyancy arising from the density deficit of heated combustion gases relative to ambient air. The convective heat release rate Q (kW) drives the plume's buoyancy flux, governing centerline velocity, entrainment rate, and spatial extent.

---

### 2. Entrainment Zone

The annular region surrounding a buoyant plume where ambient air is drawn radially inward and incorporated into the rising column through turbulent engulfment at the plume boundary. As formalized by Morton, Taylor, and Turner (1956), the entrainment rate is parameterized by the entrainment coefficient alpha, such that the horizontal inflow velocity at the plume edge is proportional to the local mean centerline vertical velocity (U_e = alpha * W_c). This process is the dominant mechanism by which the plume gains mass, increases in volume flux, widens in radius, and dilutes in temperature and contaminant concentration with height.

**Source Domain:** Fluid dynamics; turbulent plume theory (Morton, Taylor & Turner, 1956)
**Physical Mechanism:** Turbulent shear-driven engulfment of ambient fluid at the plume-environment interface. For a pure buoyant plume, the entrainment coefficient alpha is approximately 0.10-0.16, and the plume radius b grows linearly as b = (6/5) * alpha * z, where z is height above the virtual origin.

---

### 3. Near-Field Plume Region

The zone immediately above the cooking surface or combustion source where the plume is in its most concentrated, highest-temperature, and highest-velocity state, prior to developing the self-similar Gaussian profiles characteristic of the far-field buoyant plume. In fire plume theory, this corresponds to the persistent flame zone and the lower intermittent flame zone, where combustion reactions may still be active and the plume has not yet been substantially diluted by entrainment. For a barbecue cooking plume, the near-field extends from the cooking grate to approximately 1.5 to 3 characteristic source diameters above the heat source.

**Source Domain:** Fire science; plume zone classification (Heskestad; McCaffrey, 1979)
**Physical Mechanism:** In the near-field, the plume is governed by the strongly buoyant regime where excess temperature is a substantial fraction of ambient absolute temperature. The flow exhibits coherent large-scale puffing instabilities, high contaminant concentrations, and steep radial gradients. Entrainment is less efficient per unit height than in the far-field.

---

### 4. Velocity Decay

The monotonic reduction in mean centerline upward velocity of a buoyant plume as distance from the heat source increases, caused by progressive entrainment of low-momentum ambient air. For a point-source buoyant plume in the far-field, Heskestad's correlation predicts centerline velocity decays as u_0 proportional to Q_c^(1/3) * (z - z_0)^(-1/3), where Q_c is the convective heat release rate, z is height, and z_0 is the virtual origin. This inverse-one-third power-law decay is a fundamental result of the self-similar solution to the turbulent buoyant plume equations.

**Source Domain:** Fire science; buoyant plume fluid dynamics (Heskestad plume correlations)
**Physical Mechanism:** As the plume entrains ambient air, total mass flux increases while buoyancy flux is conserved. Conservation of momentum, augmented by integrated buoyancy force, combined with increasing plume cross-sectional area, requires centerline velocity to decrease with height. This decay rate determines the minimum hood mounting height at which sufficient plume velocity exists for reliable capture.

---

### 5. Capture Envelope

The three-dimensional spatial volume surrounding an exhaust hood within which the hood's induced airflow field possesses sufficient velocity magnitude and directional alignment to intercept, contain, and extract a buoyant cooking plume before it disperses into the ambient environment. The envelope boundary is defined by the locus of points where hood-induced velocity equals or exceeds the minimum capture velocity required to overcome plume buoyant momentum, ambient crosswind forces, and turbulent fluctuations.

**Source Domain:** HVAC engineering; industrial ventilation (ACGIH; ASHRAE)
**Physical Mechanism:** The capture envelope is established by the negative-pressure field generated by the exhaust fan, inducing an inward velocity field below and around the hood opening. For a canopy hood without enclosure walls, the capture envelope contracts rapidly with increasing distance from the hood face, approximately as the inverse square of distance, making hood height and overhang geometry critical design parameters.

---

### 6. Effective Capture Area

The functional subset of a hood's total physical inlet area through which meaningful plume interception and contaminant extraction actually occur, as distinguished from the gross geometric footprint of the hood. It represents the area where local face velocity is sufficient to overcome the plume's buoyant momentum and ambient disturbances. The effective capture area is always less than or equal to the total hood face area, with the difference attributable to non-uniform velocity distribution, dead zones at the hood periphery, and aerodynamic losses.

**Source Domain:** HVAC engineering; ventilation system design (ASHRAE; ACGIH)
**Physical Mechanism:** Velocity distribution across a hood inlet is inherently non-uniform. Regions where local inward velocity falls below the capture threshold contribute negligibly to contaminant removal. For outdoor canopy hoods, the absence of enclosure walls permits ambient air to short-circuit into the hood from the sides, reducing the fraction of exhausted air carrying contaminant. The ratio of effective capture area to total hood area is a key performance metric analogous to capture efficiency defined in ASHRAE Standard 154.

---

### 7. Plume Interception Plane

The horizontal cross-sectional plane located at the elevation of the hood inlet where the rising buoyant plume must be fully contained within the hood's effective capture area for complete contaminant capture. At this plane, the plume has expanded from its source diameter to a width determined by the entrainment-driven linear growth rate and any lateral deflection from ambient winds. If the plume cross-section at hood height exceeds the effective capture area, or is laterally offset beyond hood boundaries, a fraction of the plume escapes capture.

**Source Domain:** HVAC engineering; exhaust hood design (ASHRAE; fire plume theory)
**Physical Mechanism:** At the interception plane, the plume has a defined diameter, centerline velocity, and temperature excess calculable from Heskestad correlations given the source heat release rate and mounting height. The hood must be sized so its effective capture area encompasses the full plume cross-section, including margin for turbulent fluctuations, wind-induced displacement, and intermittent puffing. This concept provides the geometric basis for minimum hood overhang requirements.

---

### 8. Momentum-Limited Capture

A ventilation failure condition in which the exhaust hood's induced airflow possesses insufficient momentum flux to overcome the upward buoyant momentum of the cooking plume and redirect plume gases into the hood opening. This arises when the convective heat release rate generates a plume with buoyant momentum exceeding the inward momentum imposed by the hood's exhaust system at the plume interception plane. The plume penetrates through or spills past the hood, resulting in contaminant escape despite an active exhaust system.

**Source Domain:** HVAC engineering; fluid dynamics (ACGIH; ASHRAE)
**Physical Mechanism:** The buoyant plume carries upward momentum flux that increases with height due to continuous buoyancy forces acting on entrained mass. When the hood exhaust rate (CFM) or face velocity is insufficient, the plume's buoyant momentum dominates and the plume stagnates at the hood face and spills laterally, or penetrates through entirely. This failure mode is exacerbated by increased mounting height, high heat release rates, and the absence of side panels.

---

### 9. Missed Plume Region

The spatial volume occupied by the fraction of a buoyant cooking plume that escapes beyond the hood's capture envelope and is not intercepted by the exhaust system, resulting in uncontrolled release of smoke, grease aerosol, combustion byproducts, and heated air. This region arises when: the plume cross-section at the interception plane exceeds the effective capture area; crosswinds deflect the plume beyond hood boundaries; the exhaust rate is insufficient (momentum-limited capture); or hood geometry provides inadequate overhang.

**Source Domain:** HVAC engineering; exhaust hood performance analysis (ASHRAE Standard 154)
**Physical Mechanism:** The missed plume region is the complement of the captured plume fraction. In outdoor installations, it is substantially larger than in indoor installations because: (a) no enclosure walls redirect escaped gases back toward the hood; (b) ambient wind creates time-varying lateral deflections; and (c) the open boundary eliminates pressure-assisted capture. The missed plume region is the primary source of nuisance smoke exposure and grease deposition in adjacent areas.

---

### 10. Open-Boundary Dilution

The process by which a buoyant cooking plume and its contaminants undergo progressive mixing and concentration reduction as they disperse into the unbounded outdoor atmosphere, absent enclosure walls, ceilings, or confining surfaces. Unlike indoor environments where contaminant concentrations accumulate within a finite room volume, outdoor open-boundary conditions permit three-dimensional dispersion, resulting in rapid volumetric dilution that scales with the cube of distance from the source in still conditions and is further accelerated by wind and atmospheric turbulence.

**Source Domain:** Atmospheric dispersion science; environmental fluid mechanics
**Physical Mechanism:** The plume transitions from near-field entrainment-driven behavior to an atmospheric dispersion regime governed by ambient wind, atmospheric stability, and turbulent diffusion. For outdoor cooking applications, open-boundary dilution has two opposing consequences: it reduces peak concentration at any point relative to an enclosed space, but renders mechanical exhaust capture more difficult because the hood cannot rely on room pressurization or wall-guided flow to direct the plume toward the exhaust inlet.

---

### 11. Wind-Affected Plume Behavior

The deflection, bending, distortion, and potential disruption of a thermally buoyant cooking plume caused by ambient horizontal wind or cross-flow conditions. When crosswind velocity U_w acts on a buoyant plume with initial vertical velocity W_0, the plume trajectory bends downwind, with deflection governed by the ratio of wind momentum flux to plume buoyancy flux. At moderate crosswinds, the centerline follows Briggs' two-thirds law. At higher wind speeds, the plume may be bent near-horizontal, bifurcated into counter-rotating vortices, or fully disrupted.

**Source Domain:** Atmospheric fluid dynamics; fire plume behavior in wind (Briggs plume rise equations)
**Physical Mechanism:** The crosswind imposes horizontal drag on the plume column, creating a pressure differential that deflects it downwind while enhancing turbulent mixing at the windward boundary. The trajectory is determined by competition between vertical buoyancy force and horizontal wind momentum. Even modest winds of 2-5 mph can deflect a cooking plume laterally beyond the hood overhang, moving the plume outside the capture envelope. This necessitates larger hoods, deeper overhang, side panels, and higher exhaust rates in exposed outdoor installations.

---

## Foundational References

- Morton, B.R., Taylor, G.I., and Turner, J.S. (1956). "Turbulent gravitational convection from maintained and instantaneous sources." *Proceedings of the Royal Society A*, 234, pp. 1-23.
- Heskestad, G. "Fire Plumes, Flame Height, and Air Entrainment." Chapter 13, *SFPE Handbook of Fire Protection Engineering*, 5th ed. Springer, 2016.
- ASHRAE. *ASHRAE Handbook — HVAC Applications*, Chapter 33: Kitchen Ventilation.
- ASHRAE Standard 154. *Ventilation for Commercial Cooking Operations*.
- ACGIH. *Industrial Ventilation: A Manual of Recommended Practice for Design*, 30th ed.
- Briggs, G.A. (1965). "A plume rise model compared with observations." *Journal of the Air Pollution Control Association*, 15(9), pp. 433-438.
- Zukoski, E.E. (1995). "Properties of Fire Plumes." In *Combustion Fundamentals of Fire*, ed. G. Cox, Academic Press.
- McCaffrey, B.J. (1979). "Purely Buoyant Diffusion Flames: Some Experimental Results." NBSIR 79-1910, National Bureau of Standards.
