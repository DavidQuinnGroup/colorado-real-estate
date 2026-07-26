# PROJECT ATLAS(tm)

## GIS 1.0 Controlled Provider Pilot Standard

Status: `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED`

Date: July 26, 2026

---

## Boundary

`CONTROLLED PROVIDER PILOT DESIGN DOES NOT AUTHORIZE LIVE EXECUTION`

Controlled provider pilot design is an internal authorization-and-design stage after Sprint 6 due diligence. It may select one exact provider dataset or service family already supported by Sprint 6 evidence, define a fail-closed pilot contract, specify fields, scope, limits, operator controls, audit requirements, stop conditions, rollback expectations, fixture scenarios, and validation. It does not authorize provider contact, accounts, credentials, terms acceptance, contracts, purchases, provider connections, live calls, provider data acquisition, persistence, retrieval, runtime activation, downstream integration, customer visibility, relationships, hierarchy traversal, Colorado runtime consumption, GOF Wave 5, or Sprint 8.

## Principles

- `GIS-CPPD-P001 Exact Subject Principle`: the pilot design must bind to one exact provider inventory entry and one exact dataset or service family from certified Sprint 6 evidence.
- `GIS-CPPD-P002 Evidence Trace Principle`: the design must cite only governed Sprint 6 source-reference IDs and must not expand research.
- `GIS-CPPD-P003 Rights Fail-Closed Principle`: public availability does not approve licensing, permitted use, attribution, derivative use, redistribution, or customer display.
- `GIS-CPPD-P004 Dry-Run-First Principle`: any future pilot must be dry-run-first and cannot execute from Sprint 7.
- `GIS-CPPD-P005 Scope-Minimization Principle`: fields, records, requests, geography, duration, and subject selection must be explicitly bounded.
- `GIS-CPPD-P006 Operator-Control Principle`: missing pilot identity, provider identity, dataset identity, adapter identity, explicit mode, operator acknowledgement, limits, scope, expiration, authorization control, or audit record fails closed.
- `GIS-CPPD-P007 Audit-Immutability Principle`: the design must define audit fields before any later execution phase is considered.
- `GIS-CPPD-P008 Zero-Effect Principle`: Sprint 7 must produce zero live execution, zero provider acquisition, zero production reads, zero production writes, zero runtime activations, zero customer-visible effects, and zero relationships.
- `GIS-CPPD-P009 Prior-Certification Preservation Principle`: certified GOF, EKCP, EIP, GIO, and GIS Sprint 1-Sprint 6 semantics remain unchanged.
- `GIS-CPPD-P010 Next-Gate Principle`: Sprint 7 certification may recommend a next governed gate, but it does not authorize Sprint 8.

## Contract Requirements

Every controlled provider pilot design must include:

- pilot ID, pilot version, program identity, sprint identity, provider inventory entry ID, canonical provider name, exact dataset or service ID, exact dataset or service name, and official Sprint 6 source-reference IDs;
- capability ID, intelligence domain, evidence categories, jurisdiction, geographic scope, and subject-selection contract;
- authorized fields, prohibited fields, access method, expected technical format, authentication state, account state, credential state, terms state, licensing state, permitted-use state, attribution state, derivative-use state, redistribution state, and customer-display state;
- dry-run requirement, all execution authorization flags, record/request/geographic/duration limits, operator controls, audit requirements, stop conditions, rollback expectations, unresolved questions, legal review requirements, licensing review requirements, technical review requirements, design disposition, deterministic fingerprint, and internal-only state.

All execution authorization flags must remain false.

## Scenario Requirements

Certification must cover:

| Scenario | Required result |
| --- | --- |
| A Valid pilot design | `PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED` |
| B Missing dataset selection | `DATASET_SELECTION_REQUIRED` |
| C Unresolved licensing | `LICENSING_REVIEW_REQUIRED` |
| D Unresolved attribution | `ATTRIBUTION_REVIEW_REQUIRED` |
| E Scope mismatch | `FAILED_CLOSED_SCOPE_MISMATCH` |
| F Field mismatch | `FAILED_CLOSED_FIELD_SCOPE_MISMATCH` |
| G Subject-scope mismatch | `FAILED_CLOSED_SUBJECT_SCOPE_INVALID` |
| H Volume expansion | `FAILED_CLOSED_VOLUME_LIMIT_EXCEEDED` |
| I Execution authorization drift | `FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE` |
| J Persistence authorization drift | `FAILED_CLOSED_PERSISTENCE_AUTHORIZATION_FALSE` |
| K Runtime authorization drift | `FAILED_CLOSED_RUNTIME_AUTHORIZATION_FALSE` |
| L Customer visibility drift | `FAILED_CLOSED_CUSTOMER_VISIBILITY_FALSE` |
| M Audit determinism | `DETERMINISTIC_PILOT_AUDIT_DESIGN` |
| N No live execution | `ZERO_LIVE_PILOT_EXECUTION` |

## Required Controls

Sprint 7 safety validation must prove there are no Prisma imports, database clients, SQL, migrations, production access, environment-variable access, credentials, provider contact, account creation, procurement, purchasing, restricted downloads, external calls, hard-coded live URLs, scraping, browser automation, real provider connections, provider data acquisition, polling, scheduling, worker integration, persistence, production retrieval, runtime registry, routes, pages, downstream integration, customer visibility, redistribution authorization, geographic relationships, hierarchy inference, Colorado runtime activation, GOF Wave 5 work, Sprint 8 authorization, or certified GOF/EKCP/EIP/GIO/GIS Sprint 1-Sprint 6 semantic regression.

The certification must also prove exact CGS landslide-inventory subject selection, Sprint 6 evidence traceability, unresolved licensing and attribution fail-closed behavior, deterministic fingerprints, immutable audit design, all 60 controlled-provider pilot design invariants, all fixture scenarios A-N, and zero production or customer effect.
