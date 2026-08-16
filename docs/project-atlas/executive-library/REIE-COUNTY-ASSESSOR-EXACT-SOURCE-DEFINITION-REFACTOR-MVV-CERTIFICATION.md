# PROJECT ATLAS - County Assessor Exact Source Definition Refactor MVV Certification

Date: 2026-08-16

## Purpose

This certification records a bounded refactor that reduces mechanical duplication for the seven canonical County Assessor exact source identities.

The refactor does not add a new County Assessor source, activate a source, retrieve data, or change customer-facing authority.

## Finite Definition Set

The finite identity set is centralized in `lib/sourceQualityCountyAssessorExactSourceDefinitions.ts`:

- `SRC-BOULDER-COUNTY-ASSESSOR`
- `SRC-ADAMS-COUNTY-ASSESSOR`
- `SRC-ARAPAHOE-COUNTY-ASSESSOR`
- `SRC-BROOMFIELD-COUNTY-ASSESSOR`
- `SRC-JEFFERSON-COUNTY-ASSESSOR`
- `SRC-LARIMER-COUNTY-ASSESSOR`
- `SRC-WELD-COUNTY-ASSESSOR`

Centralized fields are limited to exact source ID, source class, jurisdiction, and responsible organization.

## Explicitly Non-Centralized Fields

The refactor does not centralize rights, technical access, freshness, attribution, provenance, fees, sensitivity, reviewed dates, certification references, evidence, Manifest eligibility, activation posture, claim eligibility, or source-specific limitations.

Source-specific evidence modules remain independent.

Operational Manifest membership remains explicit and separate.

Registry records remain explicit.

## Fail-Closed Behavior

Unknown assessor-looking source IDs are rejected unless separately added to the finite exact-source definition set through an authorized replication wave.

Examples that remain rejected:

- `SRC-DOUGLAS-COUNTY-ASSESSOR`
- `SRC-DENVER-COUNTY-ASSESSOR`
- `SRC-FAKE-COUNTY-ASSESSOR`
- `SRC-GENERIC-COUNTY-ASSESSOR`
- `SRC-PROVIDER-COUNTY-ASSESSOR`

The refactor does not introduce wildcard, prefix, organization, category-only, or statewide County Assessor acceptance.

## Stability

- Source Registry remains 20 records.
- Operational Manifest remains 19 sources.
- `SRC-BOULDER-PERMIT-CANDIDATES` remains the only Registry-only source.
- All seven County Assessor evidence modules remain independent.
- Deterministic conversion behavior and fingerprints remain governed by the same source-specific evidence requests.

## Protected-System Confirmation

This refactor does not perform provider calls, external research, GIS/API calls, Property Portal access, downloads, scraping, property search, raw data retrieval, database writes, schema changes, Search/Typesense mutation, Saved Search, alerts/email, CRM, queues/workers, deployment, or production configuration.
