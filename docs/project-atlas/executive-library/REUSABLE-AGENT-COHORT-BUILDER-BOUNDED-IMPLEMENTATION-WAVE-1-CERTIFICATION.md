# PROJECT ATLAS - Reusable Agent Cohort Builder Bounded Implementation Wave 1

Status: `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`

Next gate: `READY_FOR_ADMITTED_BASIC_AGGREGATION_WAVE_2`

## Scope Implemented

- Shared Agent cohort definition foundation in `lib/agentCohortBuilder.ts`.
- Read-only current listing-record count adapter in `lib/agentCohortCount.ts`.
- GET-only count endpoint in `app/api/agent/cohort-count/route.ts`.
- Reusable Agent UI component in `components/agent/AgentCohortBuilder.tsx`.
- Market Update preparation integration in `components/agent/MarketUpdatePreparationExperience.tsx`.
- Deterministic certification checker in `scripts/checkReusableAgentCohortBuilder.ts`.

## Admitted Wave 1 Semantics

- Analytical grain: `MLS_LISTING`.
- Cohort type: `MLS_LISTING_COHORT`.
- Stock/flow class: `STOCK`.
- Temporal basis: `OBSERVATION_AS_OF_TIMESTAMP`.
- Period form: `AS_OF_INSTANT_SNAPSHOT`.
- Source scope: `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`.
- Audience posture: Agent-only preparation.
- Persistence posture: session-only UI; no saved cohort persistence.
- Count label: `Matching current MLS listing records`.

## Quick Filters Implemented

- City: Boulder, Louisville, Lafayette, Superior, Erie, Longmont.
- Property type: Residential.
- Status scope: Active.
- Minimum and maximum price.
- Minimum beds.
- Minimum baths.
- Minimum and maximum square feet.
- Minimum and maximum year built.

Unsupported filters fail closed. Null fields are not converted to zero. Unknown geography, invalid numeric ranges, unsupported status, unsupported property type, scenario requests, historical/event-flow requests, and non-MLS-listing grain requests are rejected by validation.

## Protected Boundaries

This implementation does not perform database mutation, schema migration, provider calls, MLS/IRES synchronization, source activation, Typesense mutation, CRM/email activity, customer-data persistence, public/client report generation, PDF/export, deployment, recommendations, scenario modeling, DOM/CDOM/DTO/DTS calculation, SP/LP calculation, absorption calculation, relisting/listing-episode analytics, or historical comparison.

## Implementation Readiness

| Capability | Status |
| --- | --- |
| Reusable Agent cohort definition | Ready for Wave 1 Agent use |
| Quick Filters foundation | Ready for current listing-record stock counts |
| Safe admitted count | Ready when local repository read succeeds |
| Advanced filters | Blocked pending field semantics and methodology admission |
| Basic aggregation beyond count | Next authorized gate required |
| Historical/event-flow analytics | Blocked pending historical event evidence and methodology |
| Client-facing reports/export | Blocked pending rights, audience, and presentation gates |

## Certification Evidence

Checker: `npm run check:reusable-agent-cohort-builder`

Required assertions:

- Valid basic cohort passes.
- Grain and temporal basis remain explicit.
- Missing or invalid geography fails closed.
- Invalid price, square-foot, and year-built ranges fail closed.
- Unsupported filters are rejected.
- Null handling remains explicit and is not zero-filled.
- Serialization is deterministic independent of input key order.
- Count label uses listing-record grain.
- Source scope is current repository property search projection.
- Current/historical and scenario boundaries remain closed.
- Reusable component is integrated into Market Update preparation.
