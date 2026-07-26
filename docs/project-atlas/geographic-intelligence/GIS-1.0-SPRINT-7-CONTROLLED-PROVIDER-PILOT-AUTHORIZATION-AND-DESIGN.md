# PROJECT ATLAS(tm)

## GIS 1.0 Sprint 7 Controlled Provider Pilot Authorization and Design

Status: `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED`

Date: July 26, 2026

---

## Certification Summary

GIS Sprint 7 established a controlled provider pilot authorization-and-design framework for one Sprint 6-supported Colorado Geological Survey subject. It selected the `Colorado Landslide Inventory` service family, defined fail-closed pilot contracts, dry-run-only fixture scenarios, invariants, safety validation, certification output, audit requirements, stop conditions, rollback expectations, and unresolved review gates. Sprint 7 does not authorize provider contact, accounts, credentials, terms acceptance, provider connections, provider data acquisition, live adapter execution, persistence, retrieval, runtime activation, downstream integration, customer visibility, relationships, hierarchy traversal, Colorado runtime consumption, GOF Wave 5, or Sprint 8.

## Implemented Surface

- `lib/geographic-intelligence/controlledProviderPilotContract.ts`
- `lib/geographic-intelligence/controlledProviderPilotValidation.ts`
- `lib/geographic-intelligence/fixtures/gisSprint7ControlledProviderPilotFixtures.ts`
- `scripts/checkGeographicIntelligenceControlledProviderPilotSafety.ts`
- `scripts/certifyGeographicIntelligenceControlledProviderPilotDesign.ts`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-CONTROLLED-PROVIDER-PILOT-STANDARD.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-SPRINT-7-CONTROLLED-PROVIDER-PILOT-AUTHORIZATION-AND-DESIGN.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-CGS-CONTROLLED-PILOT-DESIGN.md`

## Pilot Subject

- Provider inventory entry: `colorado-geological-survey`
- Provider: Colorado Geological Survey
- Exact dataset or service family: `CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY`
- Exact dataset or service name: `Colorado Landslide Inventory`
- Sprint 6 evidence references: `GIS-S6-SRC-CGS-GIS-PORTAL`, `GIS-S6-SRC-CGS-MAPPING`
- Intelligence domain: `ENVIRONMENTAL_INTELLIGENCE`
- Evidence categories: geologic hazards, landslides, environmental risk
- Design disposition: `PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED`

## Pilot Design

The pilot design is dry-run-first and execution-inert. It defines one synthetic internal Colorado test bounding box, one synthetic subject selection, maximum two requests, maximum 25 records, maximum 120 seconds, explicit authorized fields, explicit prohibited fields, immutable audit requirements, and fail-closed operator controls.

The expected technical format is `ArcGIS REST service metadata and feature records, schema unresolved`. Authentication and account requirements are not indicated by Sprint 6 evidence. Credentials are not authorized.

## Rights And Review State

- Terms: `REVIEW_REQUIRED`
- Licensing: `REVIEW_REQUIRED`
- Permitted use: `REVIEW_REQUIRED`
- Attribution: `REVIEW_REQUIRED`
- Derivative use: `REVIEW_REQUIRED`
- Redistribution: `REVIEW_REQUIRED`
- Customer display: `REVIEW_REQUIRED`
- Rate limit: `UNDEFINED_FAIL_CLOSED`

Public documentation and public GIS-service evidence do not grant operational use. Legal, licensing, attribution, redistribution, derivative-use, and customer-display review remain unresolved.

## Scenario Certification

| Scenario | Result |
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

## Invariant Certification

All 60 required controlled-provider pilot design invariants pass. The certification proves exact pilot identity, exact provider identity, exact dataset identity, Sprint 6 evidence traceability, explicit geographic and subject scope, explicit fields, unresolved licensing and attribution fail-closed behavior, all authorization flags false, bounded limits, required operator controls, required audit fields, stop conditions, rollback expectations, deterministic fingerprints, no live endpoint invocation, no provider connection, no data acquisition, no production reads or writes, no real adapter execution, no account, no credentials, no terms acceptance, no prior-sprint semantic regression, and no Sprint 8 authorization.

## Certification Output

- Authorization: `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_AUTHORIZED`
- Classification: `CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN`
- Certification: `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED`
- Pilot ID: `GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN`
- Adapter design ID: `GIS_SPRINT_7_CGS_LANDSLIDE_INVENTORY_ADAPTER_DESIGN`
- Adapter design version: `0.0.0-design-only`
- Provider contacts: `0`
- Accounts created: `0`
- Credentials requested: `0`
- Credentials used: `0`
- Terms accepted: `0`
- Provider connections: `0`
- Provider data acquisitions: `0`
- Production reads: `0`
- Production writes: `0`
- Live adapter executions: `0`
- Runtime activations: `0`
- Downstream integrations: `0`
- Customer-visible changes: `0`
- Geographic relationships: `0`

## Governance State

- GIS Sprint 1: `CERTIFIED_AND_CLOSED`
- GIS Sprint 2: `CERTIFIED_AND_CLOSED`
- GIS Sprint 3: `CERTIFIED_AND_CLOSED`
- GIS Sprint 4: `CERTIFIED_AND_CLOSED`
- GIS Sprint 5: `CERTIFIED_AND_CLOSED`
- GIS Sprint 6: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`
- GIS Sprint 7: `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED`
- GIS Sprint 8: `NOT_AUTHORIZED`

Retained prohibitions: live execution, provider calls, provider contact, accounts, credentials, terms acceptance, contracts, purchases, provider data acquisition, live adapters, persistence, retrieval, enterprise consumption, runtime activation, downstream integration, customer visibility, Colorado runtime consumption, geographic relationships, hierarchy inference, GOF Wave 5, and Sprint 8 remain `NOT_AUTHORIZED`.

## Validation Commands

- `npm run worker:build`
- `npm run check:geographic-intelligence-controlled-provider-pilot-safety`
- `npm run certify:geographic-intelligence-controlled-provider-pilot-design`
- `npm run check:geographic-intelligence-provider-due-diligence-safety`
- `npm run certify:geographic-intelligence-provider-due-diligence`
- `npm run check:geographic-intelligence-provider-evaluation-safety`
- `npm run certify:geographic-intelligence-provider-evaluation-governance`
- `npm run check:geographic-intelligence-fixture-provider-adapter-safety`
- `npm run certify:geographic-intelligence-fixture-provider-adapter`
- `npm run check:geographic-intelligence-provider-inventory-safety`
- `npm run certify:geographic-intelligence-provider-inventory-governance`
- `npm run check:geographic-intelligence-evidence-provenance-safety`
- `npm run certify:geographic-intelligence-evidence-provenance-foundation`
- `npm run check:geographic-intelligence-architecture-safety`
- `npm run certify:geographic-intelligence-architecture-foundation`
- `npm run check:geographic-intelligence-object-safety`
- `npm run check:eip-sprint-7-production-internal-geographic-read-adapter`
- `npm run check:ekcp-sprint-1-enterprise-geographic-consumer-adapter`
- `npm run check:ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

## Next Decision Gate

Recommended next governed phase based on findings: GIS 1.0 Sprint 8 Licensing and Attribution Resolution Gate. This recommendation does not authorize Sprint 8 and does not authorize live provider execution.
