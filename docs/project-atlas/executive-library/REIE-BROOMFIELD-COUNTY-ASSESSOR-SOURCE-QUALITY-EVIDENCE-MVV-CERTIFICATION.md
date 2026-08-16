# REIE Broomfield County Assessor Source Quality Evidence MVV Certification

Date: 2026-08-16

## Certification

`SRC-BROOMFIELD-COUNTY-ASSESSOR` has source-specific Source Quality evidence represented as certification-only metadata.

This package uses the canonical County/Public Record conversion path and does not include raw property records, owner records, addresses, parcel/account data, valuation rows, taxpayer information, narrative/PDF evidence, web-derived data, or provider correspondence.

## Evidence Posture

- Source ID: `SRC-BROOMFIELD-COUNTY-ASSESSOR`
- Source class: `COUNTY_ASSESSOR`
- Source confirmation: `EXACT_SOURCE_ID_CONFIRMED`
- Evidence references: exactly one `CERTIFICATION_REFERENCE`
- Certification ID: `CERT-BROOMFIELD-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001`
- Field sensitivity: `RESTRICTED_OR_UNREVIEWED`
- Conversion authority: `EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW`
- Manifest eligibility: `READY_WITH_KNOWN_GAPS`

`READY_WITH_KNOWN_GAPS` is governance eligibility only. It does not authorize source activation or customer-facing use.

## Dimensions

- Rights: `UNKNOWN`
- Technical access: `UNKNOWN`
- Freshness: `UNKNOWN`
- Attribution: `UNKNOWN`
- Provenance: `UNKNOWN`
- Fee posture: unasserted

## Firewalls

- `ASSESSOR_RECORD_NOT_TITLE`
- `ASSESSOR_RECORD_NOT_DEED_VALIDITY`
- `ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS`
- `ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE`
- `ASSESSED_VALUE_NOT_MARKET_VALUE`
- `PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY`
- `PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`
- `COUNTY_ASSESSOR_NOT_COUNTY_TREASURER`
- `COUNTY_ASSESSOR_NOT_RECORDER`
- `COUNTY_ASSESSOR_NOT_PARCEL_GIS`
- `BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR`
- `ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR`
- `CONSOLIDATED_CITY_COUNTY_STATUS_NOT_SOURCE_AGGREGATION_AUTHORITY`
- `RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE`
- `SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE`
- `CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE`
- `LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE`

## Scope Boundary

This MVV does not mutate the Source Registry, add Operational Manifest inclusion, retrieve source data, activate Broomfield property search, query GIS, write a database, modify schema, mutate Search or Typesense, send communications, enqueue work, or deploy.
