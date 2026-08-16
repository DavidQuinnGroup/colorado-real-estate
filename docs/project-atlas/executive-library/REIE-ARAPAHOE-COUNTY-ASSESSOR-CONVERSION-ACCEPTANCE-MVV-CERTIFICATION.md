# REIE Arapahoe County Assessor Conversion Acceptance MVV Certification

## Scope

This MVV adds exact County/Public Record conversion acceptance for:

- `SRC-ARAPAHOE-COUNTY-ASSESSOR`
- `COUNTY_ASSESSOR`

The source depends on the canonical Arapahoe County Assessor Registry identity established in the immediately preceding Registry MVV.

## Public Record Core compatibility

Public Record Structured Evidence Conversion Core now accepts only the exact Arapahoe County Assessor source ID paired with `COUNTY_ASSESSOR`.

This is a bounded compatibility addition required by the existing County wrapper delegation path. It does not redesign the generic Public Record core, add wildcard county assessor acceptance, introduce alias matching, or create a provider aggregate.

## County specialization support

County Structured Evidence Conversion now exposes the same finite class and exact source mapping. The County wrapper continues to delegate to Public Record Conversion Core and does not duplicate conversion logic.

## Firewalls

`EXP-SRC-ARAPAHOE-COUNTY-ASSESSOR`, `SRA-ARAPAHOE-COUNTY-ASSESSOR`, generic County Assessor identifiers, provider-only assessor identifiers, Parcel Search, Assessor Data Mart, GIS, Treasurer, Recorder, and foreign source/class pairings are rejected.

`RESTRICTED_OR_UNREVIEWED` is the initial field-sensitivity posture for Arapahoe Assessor conversion acceptance. Certification-only conversion preserves `RIGHTS = UNKNOWN`, `TECHNICAL ACCESS = UNKNOWN`, `FRESHNESS = UNKNOWN`, `ATTRIBUTION = UNKNOWN`, and `PROVENANCE = UNKNOWN / INCOMPLETE`. Fee remains unasserted.

Public-record or government-source status does not imply rights, technical readiness, automated extraction, redistribution, freshness, completeness, legal use, or customer display.

## Non-activation

This MVV does not create Arapahoe Assessor Source Quality evidence, a Human-Reviewed finding, Operational Manifest inclusion, source activation, property-search submission, Data Mart export, GIS access, retrieval, scraping, raw property-data use, owner/address lookup, parcel/account lookup, customer-display authority, legal-use approval, route/UI behavior, DB/CRM behavior, Search/Typesense mutation, worker/queue behavior, deployment, or production configuration.

## Determinism

Identical structured Arapahoe Assessor conversion requests produce stable input fingerprints, conversion fingerprints, linkage output, normalization output, control summaries, and assembly behavior. Existing Boulder Assessor conversion behavior remains exact-source bound and does not grant rights, access, freshness, attribution, provenance, or findings to Arapahoe County Assessor.

## Evidence basis

The implementation used repository-local structured architecture only. No external research, property-search access, Data Mart export, GIS access, provider credentials, raw property data, PII, owner/address lookup, parcel/account lookup, or customer/person record was accessed.
