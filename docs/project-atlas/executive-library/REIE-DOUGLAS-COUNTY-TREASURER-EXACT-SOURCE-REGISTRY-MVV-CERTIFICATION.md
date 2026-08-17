# REIE Douglas County Treasurer Exact Source Registry MVV Certification

Status: Locally implemented, pending validation and canonicalization
Reviewed: 2026-08-17

## Source Identity

- Source ID: `SRC-DOUGLAS-COUNTY-TREASURER`
- Display name: Douglas County Treasurer
- Responsible organization: Douglas County Treasurer's Office
- Jurisdiction: Douglas County, Colorado
- Source class: `AUTHORITATIVE_SOURCE`
- Category: `COUNTY_TREASURER_TAX`
- Authorization: `AWAITING_PROVIDER_CONFIRMATION`
- Activation: `BLOCKED_NOT_AUTHORIZED`
- Claim eligible: `false`
- Initial sensitivity: `RESTRICTED_OR_UNREVIEWED`

## Certified Registry Scope

This MVV adds only the exact Registry identity and finite County Treasurer exact-source definition for Douglas County Treasurer. It does not add source activation, source retrieval, tax search, payment, Statement or Certificate of Taxes Due action, lien/delinquency workflow, Public Trustee operation, Assessor parcel-detail use, Recorder use, GIS use, ingestion, customer display, or legal-use authority.

## Semantic Firewalls

- `TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY`
- `TREASURER_RECORD_NOT_TITLE`
- `TREASURER_RECORD_NOT_RECORDER_INDEX`
- `TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY`
- `PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY`
- `PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY`
- `PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE`
- `PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY`
- `TAX_CURRENTNESS_SOURCE_SPECIFIC`
- `FEE_STATUS_SOURCE_SPECIFIC`
- `DOUGLAS_TREASURER_BILLED_ONE_YEAR_IN_ARREARS_NOT_CURRENTNESS_GUARANTEE`
- `DOUGLAS_TAX_STATEMENT_RECEIPT_NOT_TITLE_OR_LIEN_CLEARANCE`
- `DOUGLAS_TAX_LIEN_DELINQUENCY_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION`
- `DOUGLAS_PAYMENT_VENDOR_NOT_DATA_REUSE_OR_AUTOMATION_AUTHORITY`
- `DOUGLAS_STATEMENT_OR_CERTIFICATE_OF_TAXES_DUE_DISTINCT_GOVERNED_CHANNEL`
- `DOUGLAS_ASSESSOR_PARCEL_DETAIL_SEPARATE_SOURCE_AUTHORITY`

## Currentness Limitation

Douglas County Treasurer billing-currentness metadata is treated as a source-specific limitation. The one-year-in-arrears posture and direction to the Assessor for current information do not grant Assessor authority within the Treasurer source.

## Operational Manifest Posture

Douglas County Treasurer is intentionally not included in the Operational Manifest by this Registry MVV. Manifest inclusion requires a separate Source Quality evidence package and authorization gate.

## Protected-System Confirmation

This certification covers repository-local Registry and deterministic checker artifacts only. It does not authorize provider/API calls, tax/property search, ArcGIS or GIS retrieval, downloads, scraping, database mutation, schema migration, Typesense/Search mutation, Saved Search, alerts, email, CRM, workers, deployment, or production configuration.
