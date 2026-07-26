# PROJECT ATLAS(tm)

## GIS 1.0 Provider Evaluation and Selection Governance Standard

Status: `GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED`

Date: July 26, 2026

---

## Executive Purpose

This standard defines how potential geographic intelligence providers and source classes are evaluated before any live due diligence, provider contact, account creation, contract review, acquisition, adapter implementation, persistence, retrieval, runtime integration, downstream integration, or customer visibility is authorized.

Provider evaluation is an internal governance artifact only. It does not authorize provider use.

## Relationship to Sprints 1-4

Sprint 1 established domains, exact subject identity, provider-neutral contracts, lifecycle separation, activation separation, licensing, permitted use, and customer separation.

Sprint 2 established provider and source identity, immutable evidence versions, provenance, temporal integrity, licensing, permitted use, authority, quality, freshness, conflict preservation, and deterministic fingerprints.

Sprint 3 established governed provider inventory categories, inventory entries, source classes, overlaps, verification states, licensing uncertainty, provider/source/tool/dataset/authority separation, and future provider-evaluation eligibility.

Sprint 4 established a fictional fixture-provider adapter pattern with deterministic provider-specific normalization and fail-closed validation.

Sprint 5 reuses those certified contracts additively and does not modify their semantics.

## Capability-Bounded Evaluation

Every evaluation must be tied to a specific capability requirement, evidence need, jurisdiction or coverage requirement, required intelligence domains, and intended internal use.

Sprint 5 certifies one deterministic fixture capability:

- Capability requirement: `ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION`
- Intended use: `INTERNAL_GOVERNANCE_EVALUATION_ONLY`
- Required domain: `ENVIRONMENTAL_INTELLIGENCE`
- Required coverage: `VARIABLE`
- Reference date: `2026-07-26`

No provider is ranked globally outside this context.

## Scoring Criteria and Weights

The scoring model is `GIS_SPRINT_5_PROVIDER_EVALUATION_SCORING_MODEL` version `1.0.0`.

It includes 24 explicit criteria: source authority, subject relevance, domain relevance, geographic coverage, evidence completeness, freshness potential, quality potential, licensing certainty, permitted-use certainty, attribution burden, technical-access certainty, contract complexity, commercial cost, implementation complexity, continuity risk, dependency risk, overlap or redundancy, unique-value contribution, resilience contribution, current verification state, privacy/security risk, customer-value potential, explainability, and auditability.

Weights normalize deterministically to `1.0`. Unknown values receive an explicit uncertainty penalty or governance block. Scores do not override mandatory gates.

## Mandatory Gates

Sprint 5 represents non-negotiable gates separately from scores:

- Licensing gate.
- Permitted-use gate.
- Capability relevance gate.
- Geographic coverage gate.
- Verification gate.
- Legal-review gate.
- Privacy/security gate.
- Technical-feasibility gate.
- Conflict-of-interest disclosure gate.

Gate states are `PASS`, `CONDITIONAL`, `FAIL`, `UNKNOWN`, or `NOT_APPLICABLE`.

Unknown legal, licensing, permitted-use, technical-feasibility, or current-availability gates prevent implementation readiness.

## Dispositions

The strongest Sprint 5 disposition is `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE`.

That disposition does not authorize provider contact, account creation, credential use, contracting, acquisition, adapter implementation, persistence, retrieval, runtime use, downstream integration, or customer display.

Supported dispositions include insufficient evidence, outside capability scope, operational-tool-only, research-reference-only, governance review, authority review, licensing review, legal review, technical review, commercial review, deferral, rejection, fallback retention, supplemental retention, and controlled due-diligence candidacy.

## Minimum Provider Set

Sprint 5 can propose a minimum provider set only as:

`PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE`

The set is capability-bounded, preserves unresolved gates, and does not approve providers, architecture, acquisition, contracts, adapters, persistence, retrieval, runtime, downstream integration, or customer visibility.

## Conflict-of-Interest Transparency

Commercial relationships, memberships, preferred-vendor arrangements, affiliate interests, or evaluator conflicts must be representable. Unknown conflict status remains unknown and cannot be assumed favorable.

## Retained Prohibitions

No provider was contacted. No account was created. No credentials were used. No live research occurred. No current provider facts were externally verified. No pricing was obtained. No contract was reviewed or accepted. No purchase was made. No provider was approved for implementation. No provider adapter was authorized. No data was acquired. No persistence or runtime behavior was introduced. No customer behavior changed.

## Future Decision Gate

The next governed phase, if separately authorized, is GIS 1.0 Sprint 6 Controlled Provider Due Diligence. Sprint 5 does not begin or authorize Sprint 6.
