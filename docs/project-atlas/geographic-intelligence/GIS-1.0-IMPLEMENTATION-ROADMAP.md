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
| Sprint 1 | Architecture Foundation | Establish provider-neutral contracts, fail-closed activation, initial domains, deterministic fixtures, safety checks, and certification docs. | `GIS_1_0_SPRINT_1_ARCHITECTURE_FOUNDATION_CERTIFIED` | None remaining for Sprint 1 closure |
| Sprint 2 | Evidence and Provenance Foundation | Expand evidence identity, lineage, provenance, time, freshness, quality, and explainability rules. | `NOT_AUTHORIZED` | Evidence model implementation and any fixture extension |
| Sprint 3 | Provider Inventory Governance | Map provider inventory context into governed licensing, authority, permitted-use, acquisition-readiness, and stop-condition records. | `NOT_AUTHORIZED` | Provider selection and provider licensing validation |
| Sprint 4 | Controlled Fixture Adapter | Create a non-production fixture adapter that proves provider-boundary behavior without external calls or live data. | `NOT_AUTHORIZED` | Fixture adapter implementation |
| Sprint 5 | Geographic Intelligence Persistence Design | Design persistence boundaries and migration implications without applying schema changes. | `NOT_AUTHORIZED` | Schema change, migration, production persistence |
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

The next governed phase, if authorized separately, is GIS 1.0 Sprint 2 Evidence and Provenance Foundation. It should remain architecture and fixture-led until provider licensing, acquisition, persistence, retrieval, runtime, downstream, and customer gates are explicitly approved.
