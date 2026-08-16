# REIE Broomfield County Assessor Conversion Acceptance MVV Certification

Date: 2026-08-16

## Certification

`SRC-BROOMFIELD-COUNTY-ASSESSOR` is accepted by the existing Public Record and County source-quality conversion contracts as an exact `COUNTY_ASSESSOR` source.

This MVV adds only source-specific allowlist and class-map support for the Broomfield Assessor Department. It does not create a wildcard County Assessor identity, a Broomfield government aggregate, a GIS source, a Treasurer source, a Recorder source, an EXP/SRA source, or provider-only authority.

## Exact Map

- `SRC-BROOMFIELD-COUNTY-ASSESSOR` -> `COUNTY_ASSESSOR`

## Required Conversion Posture

- Exact source confirmation is required: `EXACT_SOURCE_ID_CONFIRMED`.
- Certification/reference shape is required.
- Field sensitivity remains `RESTRICTED_OR_UNREVIEWED`.
- Rights, technical access, freshness, attribution, provenance, and fee posture remain unknown or unasserted.

## Boundaries

- Boulder Assessor conversion behavior remains preserved.
- Arapahoe Assessor conversion behavior remains preserved.
- Cross-county evidence inheritance is not permitted.
- Wrong class, wrong county, GIS, Treasurer, Recorder, provider-only, EXP/SRA, unknown, narrative, raw property, and person-data payloads fail closed.
- Conversion acceptance grants no retrieval, access, source activation, customer display, or legal-use authority.
