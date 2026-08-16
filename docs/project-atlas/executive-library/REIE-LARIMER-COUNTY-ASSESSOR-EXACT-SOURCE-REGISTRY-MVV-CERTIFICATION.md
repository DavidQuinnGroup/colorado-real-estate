# Larimer County Assessor Exact Source Registry MVV Certification

Certification ID: CERT-LARIMER-COUNTY-ASSESSOR-EXACT-SOURCE-REGISTRY-MVV-001

Reviewed date: 2026-08-16

## Source Identity

- Source ID: `SRC-LARIMER-COUNTY-ASSESSOR`
- Display name: Larimer County Assessor
- Responsible authority: Larimer County Assessor's Office
- Jurisdiction: Larimer County, Colorado
- Registry class: `AUTHORITATIVE_SOURCE`
- Category: `COUNTY_ASSESSOR`
- Authorization: `AWAITING_PROVIDER_CONFIRMATION`
- Activation: `BLOCKED_NOT_AUTHORIZED`
- Claim eligible: `false`

## Boundary

This Registry MVV establishes exact source identity only. It does not authorize Public Data Center download, public search submission, GIS/map access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use.

## Semantic Firewalls

- `ASSESSOR_RECORD_NOT_TITLE`
- `ASSESSOR_RECORD_NOT_DEED_VALIDITY`
- `ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS`
- `ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE`
- `ASSESSED_VALUE_NOT_MARKET_VALUE`
- `PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY`
- `PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`
- `PUBLIC_DATA_CENTER_NOT_DOWNLOAD_OR_AUTOMATION_AUTHORITY`
- `GIS_OR_MAP_CHANNEL_NOT_ASSESSOR_RECORD_AUTHORITY`
- `PLANNING_OR_ZONING_NOT_ASSESSOR_RECORD_AUTHORITY`
- `PUBLIC_TRUSTEE_NOT_ASSESSOR_RECORD_AUTHORITY`
- `COUNTY_ASSESSOR_NOT_COUNTY_TREASURER`
- `COUNTY_ASSESSOR_NOT_RECORDER`
- `COUNTY_ASSESSOR_NOT_PARCEL_GIS`
- `SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV`
- `CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV`
- `LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV`

## Non-Inheritance

Larimer does not inherit Boulder, Arapahoe, Broomfield, Jefferson, Treasurer, Recorder, Parcel GIS, Public Trustee, Planning, Zoning, GIS/map, Public Data Center, permit-source, Source Quality, or Operational Manifest authority.

## Protected Boundaries

No provider call, Public Data Center download, CORA request, API/GIS query, raw property/person data, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
