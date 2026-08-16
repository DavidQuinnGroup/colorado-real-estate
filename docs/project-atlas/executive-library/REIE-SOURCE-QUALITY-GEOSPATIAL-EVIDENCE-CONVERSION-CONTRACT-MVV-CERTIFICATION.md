# REIE Source Quality Geospatial Evidence Conversion Contract MVV Certification

## Scope

This MVV adds the bounded GIS/Public-Geospatial Source Quality conversion contract and a thin County GIS wrapper.

Authorized files:

- `lib/sourceQualityGeospatialEvidenceConversionContract.ts`
- `scripts/checkSourceQualityGeospatialEvidenceConversionContract.ts`
- `lib/sourceQualityCountyGeospatialEvidenceConversionContract.ts`
- `scripts/checkSourceQualityCountyGeospatialEvidenceConversionContract.ts`

The implementation does not modify Public Record conversion, County Public Record conversion, Source Registry, Operational Manifest, Admin Preview, Source Quality source-specific evidence, Search, Typesense, database schema, runtime providers, customer display, or deployment configuration.

## Source classes

Finite GIS semantic classes are:

- `COUNTY_GIS_ADDRESS_POINTS`
- `COUNTY_GIS_PARK_BOUNDARIES`
- `COUNTY_GIS_PARCEL_GEOMETRY`

Only these exact source mappings are accepted in this MVV:

- `SRC-BCOD-ADDRESS-POINTS` -> `COUNTY_GIS_ADDRESS_POINTS`
- `SRC-BCOD-PARK-BOUNDARIES` -> `COUNTY_GIS_PARK_BOUNDARIES`

`SRC-BOULDER-COUNTY-PARCEL-GIS` is not accepted for conversion in this MVV, even though its Registry identity is canonical. Parcel GIS conversion requires separate authorization.

## Evidence model

The request model is governed metadata only:

- `schemaVersion`
- `sourceId`
- `sourceClass`
- `sourceConfirmation`
- `evidenceReferences`
- `certificationReference`
- `fieldSensitivityPosture`
- `conversionAuthorityClass`
- `reviewedAt`

The first evidence class is `CERTIFICATION_REFERENCE`. Raw GIS data, coordinates, geometry, GeoJSON, feature attributes, addresses, parcel identifiers, owner data, source-record payloads, customer data, and person data are rejected.

## Canonical pipeline

The generic GIS converter emits canonical `SourceEvidenceLinkageRecord[]`, delegates to `normalizeSourceEvidence`, delegates to `summarizeSourceQuality`, and exposes an assembly request for `assembleSourceQualitySummaries`.

The County wrapper owns exact County GIS source validation only. It delegates conversion and assembly to the generic GIS converter and does not duplicate hashing, linkage creation, normalization, control, or assembly.

## Fingerprints

The converter uses the canonical shared deterministic utility namespaces:

- `gis-public-geospatial-input`
- `gis-public-geospatial-conversion`

It does not reuse Public Record namespaces and does not reuse the separate GIS fixture fingerprint utility.

## Firewalls

Mandatory firewalls include:

- `ADDRESS_POINT_NOT_PARCEL_CONFIRMATION`
- `PARK_BOUNDARY_NOT_PROPERTY_OR_PARCEL_FACT`
- `PARCEL_GEOMETRY_NOT_OWNERSHIP`
- `PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION`
- `PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD`
- `PARCEL_GEOMETRY_NOT_TITLE`
- `COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY`
- `GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY`
- `OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`

Conversion does not alter `AWAITING_PROVIDER_CONFIRMATION`, `BLOCKED_NOT_AUTHORIZED`, or `claimEligible=false` Registry posture.

## Evidence basis

This package used repository-local contracts and deterministic fixtures only. It performed no provider/API call, county operational call, ArcGIS feature query, dataset download, scraping, raw GIS ingestion, database write, schema migration, Search or Typesense mutation, Saved Search change, alert/email/CRM/queue/worker mutation, deployment, production configuration change, or customer display authorization.
