# Weld County Assessor Exact Source Registry MVV Certification

Certification ID: CERT-WELD-COUNTY-ASSESSOR-EXACT-SOURCE-REGISTRY-MVV-001

Reviewed date: 2026-08-16

## Source Identity

- Source ID: `SRC-WELD-COUNTY-ASSESSOR`
- Display name: Weld County Assessor
- Responsible authority: Weld County Assessor's Office
- Jurisdiction: Weld County, Colorado
- Registry class: `AUTHORITATIVE_SOURCE`
- Category: `COUNTY_ASSESSOR`
- Authorization: `AWAITING_PROVIDER_CONFIRMATION`
- Activation: `BLOCKED_NOT_AUTHORIZED`
- Claim eligible: `false`

## Boundary

This Registry MVV establishes exact source identity only. It does not authorize Data Download, Property Card Search, Property Map Search, Property Data Search, Sales and Account Data Explorer, Treasurer, Recorder, permits/records, GIS, provider aggregate use, retrieval, automation, customer display, redistribution, legal use, or runtime activation.

## Semantic Firewalls

- `ASSESSOR_RECORD_NOT_TITLE`
- `ASSESSOR_RECORD_NOT_DEED_VALIDITY`
- `ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS`
- `ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE`
- `ASSESSED_VALUE_NOT_MARKET_VALUE`
- `PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY`
- `PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`
- `DATA_DOWNLOAD_NOT_AUTHORIZED_BY_REGISTRY_MVV`
- `PROPERTY_CARD_HISTORY_NOT_CURRENT_EVIDENCE`
- `PROPERTY_MAP_NOT_PARCEL_OR_TITLE_AUTHORITY`
- `PROPERTY_DATA_CHANNEL_NOT_UNRESTRICTED_OR_REUSE_READY`
- `SALES_DATA_NOT_MARKET_VALUE_OR_APPRAISAL`
- `COUNTY_ASSESSOR_NOT_PERMITS_OR_RECORDS`
- `COUNTY_ASSESSOR_NOT_COUNTY_TREASURER`
- `COUNTY_ASSESSOR_NOT_RECORDER`
- `COUNTY_ASSESSOR_NOT_PARCEL_GIS`
- `SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV`
- `CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV`
- `LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV`

## Historical Property Card Boundary

Weld County Property Card Search is historical-only and has not been updated since 2002 according to official source research. It must not be treated as current evidence.

## Protected Boundaries

No provider call, Data Download, property search, Property Card access, Property Map access, Sales Explorer access, CORA request, API/GIS query, raw property/person data, database write, schema change, Search/Typesense mutation, queue/worker activation, email/CRM action, deployment, or production configuration change is authorized or performed by this certification.
