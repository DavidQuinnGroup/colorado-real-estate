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
| Sprint 5 | Provider Evaluation and Selection Governance | Evaluate and govern potential provider selection without live acquisition, persistence, retrieval, runtime, downstream integration, or customer visibility. | `NOT_AUTHORIZED` | Provider evaluation and selection governance |
| Sprint 6 | Internal Retrieval Design | Design internal retrieval contracts for persisted intelligence without enabling runtime reads. | `NOT_AUTHORIZED` | Production retrieval |
| Sprint 7 | Enterprise Consumer Design | Design enterprise-consumption contracts for future downstream consumers without activation. | `NOT_AUTHORIZED` | Enterprise consumption |
| Sprint 8 | Controlled Runtime Activation | Plan bounded runtime use only after persistence, retrieval, and consumption gates are separately certified. | `NOT_AUTHORIZED` | Runtime use and feature activation |
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

No live providers, external calls, credentials, scraping, browser automation, production database writes, migrations, runtime activation, downstream integrations, customer-visible changes, geographic relationships, hierarchy traversal, Colorado runtime consumption, or GOF Wave 5 work are authorized by this roadmap.

## Recommended Next Decision Gate

The next governed phase, if authorized separately, is GIS 1.0 Sprint 5 Provider Evaluation and Selection Governance. This is the justified architectural next step because Sprint 4 proves only the synthetic adapter pattern; real provider evaluation and selection governance must occur before live acquisition, licensing validation, persistence design, retrieval, runtime use, downstream integration, or customer visibility.
