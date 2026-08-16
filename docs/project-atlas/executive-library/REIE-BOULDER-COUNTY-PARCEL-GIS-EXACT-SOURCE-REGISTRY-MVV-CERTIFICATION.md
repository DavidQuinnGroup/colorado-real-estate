# REIE Boulder County Parcel GIS Exact Source Registry MVV Certification

## Scope

This MVV adds one exact Source Registry identity:

- `SRC-BOULDER-COUNTY-PARCEL-GIS`

The source represents only the official-source identity for Boulder County GIS Parcel Boundaries / Parcels. It does not represent Address Points, Park Boundaries, Assessor tabular/property records, Recorder records, Treasurer records, permit records, zoning records, ownership facts, valuation facts, title status, legal descriptions, or customer-display authority.

## Registry posture

The record is `AUTHORITATIVE_SOURCE` with bounded category `PARCEL_GEOMETRY`. It is `AWAITING_PROVIDER_CONFIRMATION`, `BLOCKED_NOT_AUTHORIZED`, and claim-ineligible.

Registry identity does not certify rights, technical access, freshness, attribution, disclaimer sufficiency, provenance completeness, retrieval, feature-service access, download, ingestion, transformation, map rendering, spatial join, redistribution, legal use, Source Quality readiness, Operational Manifest inclusion, or customer display.

## Parcel geometry firewall

The Registry limitations preserve these mandatory firewalls:

- `PARCEL_GEOMETRY_NOT_OWNERSHIP`
- `PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION`
- `PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD`
- `PARCEL_GEOMETRY_NOT_TITLE`
- `GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY`
- `OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`

Parcel GIS may support only future-governed parcel geometry, parcel boundary/reference, parcel identifier reference, and spatial join/reference context after separate authorization.

## Source separation

`SRC-BCOD-ADDRESS-POINTS` cannot confirm parcel identity or substitute for Parcel GIS.

`SRC-BCOD-PARK-BOUNDARIES` cannot establish parcel or property facts or substitute for Parcel GIS.

Shared Boulder County organization or platform context does not create evidence, rights, freshness, attribution, access, technical, or governance inheritance between Parcel GIS, Address Points, Park Boundaries, Assessor, Recorder, Treasurer, permit, zoning, ownership, valuation, title, or legal-description sources.

## Evidence basis

The implementation used repository-local Source Registry architecture and the prior official-source research handoff. This package performed no ArcGIS feature-service query, Boulder County API call, dataset download, scraping, parcel record retrieval, geometry retrieval, owner/address retrieval, provider call, database write, Prisma/schema change, Typesense mutation, Search activation, Saved Search change, alert/email/queue/CRM action, deployment, or production configuration change.
