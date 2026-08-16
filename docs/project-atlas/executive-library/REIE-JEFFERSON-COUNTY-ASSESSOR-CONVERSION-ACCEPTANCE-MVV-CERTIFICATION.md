# REIE Jefferson County Assessor Conversion Acceptance MVV Certification

Date: 2026-08-16

## Certification

`SRC-JEFFERSON-COUNTY-ASSESSOR` is accepted by the Public Record and County Source Quality conversion contracts as one exact `COUNTY_ASSESSOR` source identity.

This MVV adds no generic Jefferson source, wildcard County Assessor source, ASPIN/GIS source, Treasurer source, Recorder source, provider aggregate, EXP identity, SRA identity, ingestion path, retrieval path, customer-display path, or legal-use authority.

## Exact Map

- Source ID: `SRC-JEFFERSON-COUNTY-ASSESSOR`
- Public Record class: `COUNTY_ASSESSOR`
- County class: `COUNTY_ASSESSOR`
- Required source confirmation: `EXACT_SOURCE_ID_CONFIRMED`
- Required evidence shape: governed certification/reference structure
- Field sensitivity posture: `RESTRICTED_OR_UNREVIEWED`

## Regression Boundary

The conversion acceptance preserves existing Boulder, Arapahoe, and Broomfield Assessor behavior and deterministic fingerprints. It rejects wrong county, wrong class, ASPIN/GIS, Treasurer, Recorder, provider-only, EXP, SRA, unknown, raw property data, PII, and narrative payload substitutions.

## Authority Boundary

Conversion acceptance is not source activation, source retrieval, public-search automation, customer display, redistribution, or legal-use approval. Any Source Quality evidence, Operational Manifest inclusion, provider access, or runtime use remains separately governed.
