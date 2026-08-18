# REIE Arapahoe County Parcel GIS Exact Source Registry MVV Certification

Date: 2026-08-18

Status: `ARAPAHOE_PARCEL_GIS_EXACT_SOURCE_IDENTITY_READY_FOR_REGISTRY_MVV`

## Evidence Basis

This MVV records the human-reviewed correspondence relayed by Scott Dobbins,
Business Systems Manager, Arapahoe County Assessor's Office, dated 2026-08-17.
The correspondence identifies one GIS source of truth for parcels: `Parcels`.
It states that Mapping maintains the base layer from long sheets,
subdivisions, and other cadastral updates. The base layer contains parcel
geometry, AIN, and PIN.

The correspondence separately identifies `Assessor_Parcels` as an enriched
layer that joins Parcels geometry with Aumentum/DataMart Assessor information.
It also identifies ArapaMAP, Address/Parcel Info, downloadable GIS data, other
mapping platforms, and Assessor Tax Maps as delivery or derivative contexts.

## Exact Source Identity

- Source ID: `SRC-ARAPAHOE-COUNTY-PARCEL-GIS`
- Public/source name: `Arapahoe County Parcels`
- Base source name: `Parcels`
- Responsible authority: `Arapahoe County Mapping / GIS`
- Registry class: `AUTHORITATIVE_SOURCE`
- Registry category: `PARCEL_GEOMETRY`
- Conversion class: `COUNTY_GIS_PARCEL_GEOMETRY`
- Source Quality evidence: `CERT-ARAPAHOE-COUNTY-PARCEL-GIS-SOURCE-QUALITY-EVIDENCE-001`

The correspondence does not establish an endpoint, access method, rights,
terms, freshness, attribution, fees, field sensitivity, provenance, or reuse
permission. Those fields remain unresolved and are not inferred here.

## Semantic Firewalls

- `Parcels` is base parcel geometry/cadastral authority only.
- `ARAPAHOE_PARCELS_NOT_ASSESSOR_PARCELS`.
- `ASSESSOR_PARCELS_DERIVED_ENRICHED_LAYER_NOT_BASE_GEOMETRY_AUTHORITY`.
- `AUMENTUM_DATAMART_NOT_PARCEL_GEOMETRY_AUTHORITY`.
- `ARAPAMAP_NOT_PARCEL_SOURCE_IDENTITY`.
- `ADDRESS_PARCEL_INFO_NOT_PARCEL_SOURCE_IDENTITY`.
- `TAX_MAPS_DERIVATIVE_NOT_BASE_PARCEL_SOURCE`.
- Parcel geometry is not ownership, legal description, Assessor record, or
  title evidence.
- Address Points and Park Boundaries do not substitute for `Parcels`.
- Government or open-data status does not establish unrestricted reuse,
  verified completeness, or customer-display authority.

## Current Posture

- Authorization: `AWAITING_PROVIDER_CONFIRMATION`.
- Activation: `BLOCKED_NOT_AUTHORIZED`.
- Claim eligibility: `false`.
- Current use: exact source identity and source-governance review only.
- Operational Manifest: not included.
- Retrieval, download, feature-service access, scraping, conversion of raw
  geometry, storage, map rendering, customer display, and runtime use: not
  authorized.

This MVV does not create ownership, assessment, sales, title, tax, legal,
property-search, or customer-facing property-fact authority.

## Deterministic Artifacts

- `lib/sourceRegistry.ts`
- `lib/sourceQualityGeospatialEvidenceConversionContract.ts`
- `lib/sourceQualityCountyGeospatialEvidenceConversionContract.ts`
- `lib/sourceQualityArapahoeCountyParcelGisEvidence.ts`
- `scripts/checkSourceQualityArapahoeCountyParcelGisEvidence.ts`
- `scripts/checkReieSourceRegistryGrandPlanAdvancement.ts`

## Next Gate

`ARAPAHOE_COUNTY_PARCEL_GIS_SOURCE_GOVERNANCE_AND_PROVIDER_CONFIRMATION_REQUIRED`
