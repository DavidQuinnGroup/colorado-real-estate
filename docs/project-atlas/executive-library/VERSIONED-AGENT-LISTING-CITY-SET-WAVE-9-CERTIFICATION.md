# VERSIONED AGENT LISTING CITY SET & PRIORITY CITY EXPANSION - WAVE 9 CERTIFICATION

STATUS: VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9_CERTIFIED

NEXT GATE: READY_FOR_HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW

## Runtime Authority

Canonical authority: AGENT_ADMITTED_LISTING_CITY_SET_V1

Runtime source: `lib/agentAdmittedListingCitySet.ts`

Compatibility exports:

- `lib/agentCohortBuilder.ts` re-exports the active authority as `AGENT_COHORT_SUPPORTED_CITIES`.
- `lib/currentMarketComputation.ts` derives `CURRENT_MARKET_SUPPORTED_CITIES` from the same active authority.
- `lib/agentAdmittedFilterRegistry.ts` records `city.valueAuthority = AGENT_ADMITTED_LISTING_CITY_SET_V1`.

## Active Global Shared Agent Listing Cities

- Boulder
- Louisville
- Lafayette
- Superior
- Erie
- Longmont
- Denver
- Broomfield
- Westminster
- Brighton
- Arvada

## Explicit Non-Admissions

- Aurora: DEFERRED / NOT ACTIVE
- Niwot: BLOCKED / NOT ACTIVE

## Boundary

This wave admits listing-city labels for agent-only current MLS listing-record analytical preparation. It does not certify municipal boundaries, neighborhood identity, county equivalence, polygon/radius filtering, source geography object activation, sold comparable methodology, historical analytics, public display, client export, valuation, pricing recommendation, or CMA output.

Location Preparation remains limited to Boulder, Louisville, and Lafayette.

DATABASE MUTATION: NONE

PROVIDER / MLS MUTATION: NONE

SUPABASE MUTATION: NONE

SCHEMA MUTATION: NONE

DEPLOYMENT: NONE

## Deterministic Proof

Script: `scripts/checkVersionedAgentListingCitySetWave9.ts`

Required assertions:

- Exact active set is the prior six plus Denver, Broomfield, Westminster, Brighton, and Arvada.
- Aurora remains deferred and fails closed.
- Niwot remains blocked and fails closed.
- ZIP filters remain listing-level postal-code predicates and require one admitted active city.
- Cohort-N parsing accepts seven active city cohorts.
- Current Competing Listing Context can derive a Denver subject city into the shared cohort engine.
- Location Preparation subset is preserved.
- No duplicated hard-coded six-city runtime allowlist remains in cohort builder or current market computation.
