# REIE Public Record Conversion Core With County Specialization MVV Certification

## Scope

This MVV implements a bounded `PUBLIC_RECORD_STRUCTURED_EVIDENCE_CONVERSION_CONTRACT` for exact public/government record sources and preserves the existing County Conversion contract as the County-facing compatibility specialization.

## Public Record Core Boundary

The core accepts only explicit allowlisted public/government record source IDs and finite source classes. It is not an arbitrary source converter. It requires exact source confirmation, controlled certification metadata, governed `reviewedAt`, structured references, and finite field-sensitivity posture.

## County Specialization

The County contract remains the canonical API for existing County evidence modules. It delegates conversion to the public-record core while preserving County result vocabulary, County firewall language, canonical linkage output, and existing Assessor/Treasurer call sites.

## Backward Compatibility

`SRC-BOULDER-COUNTY-ASSESSOR` and `SRC-BOULDER-COUNTY-TREASURER` continue to convert through their unchanged source-specific evidence modules. Their certification-only outputs preserve unknown rights, technical access, freshness, attribution, and provenance dimensions.

## County Accela Support

`SRC-BOULDER-COUNTY-ACCELA-PERMITS` is added as an exact County Conversion source with the `COUNTY_PERMIT` class. No County Accela source-specific evidence package is created by this MVV.

## Permit Candidate Removal

`SRC-BOULDER-PERMIT-CANDIDATES` is removed from operational County Conversion authority. It remains Registry discovery context only and is explicitly rejected as a conversion source.

## City Boundary

The public-record core can model later City Boulder permit sources without labeling them County sources. City Open Data and City Portal sources remain independent channels with no rights, access, freshness, attribution, provenance, activation, or display inheritance.

## Firewalls

Public, government, Open Data, Portal, and Accela status does not imply unrestricted use, automation permission, technical readiness, freshness, attribution, completeness, legal use, customer display, retrieval, scraping, or source activation.

## Evidence Boundary

No source-specific Permit evidence module, human-reviewed permit finding, Operational Manifest entry, Registry mutation, route/UI change, provider call, portal inspection, correspondence parsing, protected artifact parsing, raw permit/property/person/customer data, database, CRM, Search, Typesense, deployment, or push is included.

## Determinism

The core and County specialization produce deterministic input fingerprints, canonical `SourceEvidenceLinkageRecord[]` output, deterministic conversion fingerprints, and canonical Normalization / Control / Assembly compatibility without current time or random identifiers.
