# PROJECT ATLAS(tm)

## GIS 1.0 Implementation Roadmap

Status: `PLANNING_ROADMAP`

Date: July 26, 2026

---

## Roadmap Principle

Every sprint below requires its own authorization gate. Completion of one sprint does not authorize the next sprint.

## Proposed Sequence

| Sprint | Name | Purpose | Current state | Separate approvals required |
| --- | --- | --- | --- | --- |
| Sprint 1 | Architecture Foundation | Establish provider-neutral contracts, fail-closed activation, initial domains, deterministic fixtures, safety checks, and certification docs. | `CERTIFIED_AND_CLOSED` | None remaining for Sprint 1 closure |
| Sprint 2 | Evidence and Provenance Foundation | Establish provider-neutral evidence identity, provider/source separation, acquisition records, immutable versions, provenance chains, supersession, conflicts, lineage, deterministic fingerprints, and fail-closed validation. | `GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_CERTIFIED` | None remaining for Sprint 2 closure |
| Sprint 3 | Provider Inventory Governance | Map provider inventory context into governed licensing, authority, permitted-use, acquisition-readiness, and stop-condition records. | `GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED` | None remaining for Sprint 3 closure |
| Sprint 4 | Controlled Fixture Adapter | Create a non-production fixture adapter that proves provider-boundary behavior without external calls or live data. | `GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED` | None remaining for Sprint 4 closure |
| Sprint 5 | Provider Evaluation and Selection Governance | Evaluate and govern potential provider selection without live acquisition, persistence, retrieval, runtime, downstream integration, or customer visibility. | `GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED` | None remaining for Sprint 5 closure |
| Sprint 6 | Controlled Provider Due Diligence | Conduct official-source-backed due diligence over selected candidates without provider approval, acquisition, adapter implementation, persistence, retrieval, runtime, downstream integration, or customer visibility. | `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED` | None remaining for Sprint 6 closure |
| Sprint 7 | Controlled Provider Pilot Authorization and Design | Select one Sprint 6-supported exact provider dataset or service family and define a fail-closed, dry-run-first pilot design without execution. | `GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED` | None remaining for Sprint 7 closure |
| Sprint 8 | Licensing and Attribution Resolution Gate | Resolve legal, licensing, attribution, permitted-use, derivative-use, redistribution, customer-display, rate-limit, and technical unknowns before any live execution can be considered. | `NOT_AUTHORIZED` | Legal/licensing/attribution and technical feasibility review |
| Sprint 9 | First Downstream Intelligence Integration | Plan first internal downstream integration while preserving customer separation. | `NOT_AUTHORIZED` | Downstream integration |
| Sprint 10 | Customer Visibility Pilot | Plan limited customer presentation only after licensing, runtime, downstream, and trust gates pass. | `NOT_AUTHORIZED` | Customer presentation |

## Explicit Future Approval Gates

- Provider selection: separate approval required.
- Provider licensing validation: separate approval required.
- Live acquisition: separate approval required.
- Schema change: separate approval required.
- Migration: separate approval required.
- Production persistence: separate approval required.
- Production retrieval: separate approval required.
- Runtime use: separate approval required.
- Downstream integration: separate approval required.
- Customer presentation: separate approval required.

## Current Retained Prohibitions

No provider contact, accounts, credentials, terms acceptance, contracts, purchases, restricted downloads, operational acquisitions, live providers, live adapters, persistence, retrieval, external operational calls, scraping, browser automation, production database writes, migrations, runtime activation, downstream integrations, customer-visible changes, geographic relationships, hierarchy traversal, Colorado runtime consumption, GOF Wave 5 work, or Sprint 8 work are authorized by this roadmap.

## Recommended Next Decision Gate

The next governed phase, if authorized separately, is GIS 1.0 Sprint 8 Licensing and Attribution Resolution Gate. Sprint 7 selected Colorado Geological Survey `Colorado Landslide Inventory` as the controlled pilot design subject, but licensing, permitted use, attribution, derivative use, redistribution, customer display, rate-limit behavior, and exact live schema remain unresolved. Sprint 8 remains `NOT_AUTHORIZED`; this roadmap does not authorize provider use, legal approval, contract approval, acquisition, adapter implementation, persistence, retrieval, runtime use, downstream integration, or customer visibility.
