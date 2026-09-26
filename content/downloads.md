---
title: "Downloads"
layout: "downloads"
url: "/downloads/"
description: "Download research briefs and full papers from the Outdoor Ventilation Standard. All PDFs are mobile-optimized and ready to share."
date: 2026-02-08
lastmod: 2026-09-26
---

Download any research paper in two formats: **2-page summary** (quick reference) or **full paper** (complete analysis with equations, tables, and diagrams).

All PDFs are mobile-optimized, print-ready, and free to download and share.

## Datasets (CSV)

Three reference tables are published as CSV files, version 2, generated from the site's physics modules (`static/js/ovs/physics/`) by `scripts/generate-reference-tables.mjs` rather than transcribed from the paper bodies; each file carries a generator line as its first row.

- [RB-003 centerline velocity decay](/data/rb-003-centerline-velocity-decay.csv) — u_0 (ft/min) from 6 to 72 inches for the eight representative sources.
- [RB-006 crosswind Froude number and deflection](/data/rb-006-crosswind-froude-number.csv) — Fr = U_w / u_0(z) and centerline deflection (inches) for the medium gas grill at five heights and five wind speeds.
- [RB-008 CFM sizing tables](/data/rb-008-cfm-sizing-tables.csv) — required exhaust CFM by source, mounting height and wind exposure class (Tables 3.2a–d).

**Changelog.** 2026-09 — tables regenerated from the physics modules; see revision history in each paper. Version 1 (2026-02) was transcribed from the paper bodies; version 2 recomputes every cell from the papers' printed formulas and RB-001 source parameters, which changes the hand-rounded standard-height velocity rows (18–48 inches) by 1–5% for the gas and wood sources and by up to about 12% for the charcoal-kettle and low-pellet rows, moves the four RB-008 sources the papers list but the modules do not model (charcoal kettle high, kamado, wood-fired large, pellet medium) by up to 2.5%, shifts other CFM cells by at most a few CFM, and adds deflection columns to the RB-006 file.
