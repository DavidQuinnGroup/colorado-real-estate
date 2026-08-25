# PROJECT ATLAS - Admitted Filter Registry & Priority 1 Property Segmentation Wave 7 Certification

Status: `ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`

Certification date: 2026-08-25

Starting repository truth:
- branch: `main`
- HEAD: `3f357c7bc781e00c42e592b88a2bc5446feb11f2`
- origin/main: `3f357c7bc781e00c42e592b88a2bc5446feb11f2`
- divergence: `0 behind / 0 ahead`
- working tree: clean

## Architecture

Wave 7 adds one canonical registry at `lib/agentAdmittedFilterRegistry.ts`.

The registry governs:
- legacy quick filters;
- Priority 1 advanced property filters;
- property field basis;
- operator policy;
- value type and unit;
- null policy;
- analytical grain;
- source scope;
- rights/audience posture;
- filter tier;
- filterable vs aggregatable separation;
- geography activation false for every Wave 7 filter.

Registry version:

`AGENT_ADMITTED_FILTER_REGISTRY_V1`

Registry authority:

`ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`

## Registered Filters

Legacy registrations:
- `city`
- `propertyType`
- `statusScope`
- `priceMin`
- `priceMax`
- `bedsMin`
- `bathsMin`
- `sqftMin`
- `sqftMax`
- `yearBuiltMin`
- `yearBuiltMax`

Priority 1 registrations:
- `bedsMax`
- `bedsExact`
- `bathsMax`
- `bathsExact`
- `lotSizeMin`
- `lotSizeMax`

No Wave 7 geography registrations were added.

## Semantics

Bedroom semantics:
- `bedsMin` means `Property.beds >= value`;
- `bedsMax` means `Property.beds <= value`;
- `bedsExact` means `Property.beds = value`;
- `bedsMin = 3` and `bedsMax = 3` normalize to the same canonical exact semantics as `bedsExact = 3`.

Bathroom semantics:
- `bathsMin` means `Property.baths >= value`;
- `bathsMax` means `Property.baths <= value`;
- `bathsExact` means `Property.baths = value`;
- bathroom values remain decimal-safe through normalization and query construction.

Lot-acreage semantics:
- exact persisted field: `Property.lotSize`;
- canonical unit: acres;
- `lotSizeMin` means `Property.lotSize >= value`;
- `lotSizeMax` means `Property.lotSize <= value`;
- lot acreage is admitted for filtering only.

Null/unknown policy:
- null is not zero;
- unknown is not false;
- records with null values for a requested numeric filter do not satisfy the predicate;
- existing aggregation artifacts continue to disclose included population and null/missing counts.

Rights/audience policy:
- Agent-only;
- no public/client/export/PDF activation;
- no new metrics;
- no historical/sold/CMA/valuation/recommendation semantics.

## Integration

Shared cohort definition:
- `AgentCohortQuickFilters` now includes Priority 1 fields.
- deterministic serialization includes Priority 1 fields.
- contradictory ranges fail closed.
- exact fields outside supplied min/max ranges fail closed.

Shared query/count:
- `buildAgentCohortPrismaWhere` builds all numeric predicates from normalized interval semantics.
- no arbitrary field/operator/value triples reach Prisma.
- `lotSize` uses the same interval machinery and remains filter-only.

Existing aggregation compatibility:
- existing admitted metrics operate over richer cohorts;
- no lot-size metric was added;
- no bedroom/bathroom metric expansion was added.

Buyer adapter:
- existing buyer `bedrooms.max` maps to `bedsMax`;
- existing buyer `bathrooms.max` maps to `bathsMax`;
- buyer lot square feet remains unmapped because Wave 7 admits persisted lot acres, not buyer-entered lot square feet conversion;
- existing unmapped criteria remain surfaced.

Current Competing Listing Context:
- Agent-adjusted refinements accept Priority 1 fields;
- default system-derived competing cohort remains unchanged;
- criteria visibility now includes max/exact bed/bath and lot acres when applied;
- subject exclusion by `mlsId` remains intact.

Cohort-N:
- the shared parser and normalized cohort definition carry Priority 1 fields across 2-6 cohorts;
- blocked keys such as ZIP fail closed instead of being silently ignored.

UI/product review:
- existing quick filters remain visible and familiar;
- new property refinements are added as Agent-facing controls;
- exact beds and exact baths are distinct labels;
- maximum beds and maximum baths are distinct labels;
- bathroom controls allow decimal increments;
- lot controls are labeled `Minimum lot acres` and `Maximum lot acres`;
- no registry internals are exposed as user-facing technical noise;
- no new geography, metric, physical-property, historical, or recommendation implication appears.

## Runtime Proof

Read-only runtime validation used actual repository `Property` rows through the existing Prisma-backed read path. It did not call MLS Grid, IRES, external providers, Supabase configuration APIs, Typesense, CRM, email, or deployment systems.

Observed subject for Current Competing Listing Context proof:
- slug: `3990-pleasant-ridge-rd-boulder-co-ire1366453`
- MLS ID: `IRE1366453`
- city/type/status: Boulder / Residential / Active
- price/beds/baths/sqft/lot acres/year: 1475000 / 3 / 2 / 1948 / 0.87 / 1963

Runtime examples:
- Bedroom range, Boulder Residential Active, `bedsMin=2`, `bedsMax=3`: READY, count 167, 9 existing metric artifacts, grain `MLS_LISTING`.
- Exact bedrooms, Boulder Residential Active, `bedsExact=3`: READY, count 78, exact serialization retained.
- Fractional bathrooms: no active Residential fractional bathroom value was observed inside the existing six-city admitted scope during runtime proof. Deterministic checker proof confirms `bathsExact=2.5` survives normalization and query construction without rounding.
- Lot acreage, Boulder Residential Active, `lotSizeMin=0.1`, `lotSizeMax=0.25`: READY, count 96, 9 existing metric artifacts, no lot metric introduced.
- Current Competing Listing Context default: READY, system-derived, post-exclusion count 352, subject exclusion `EXCLUDED_BY_LISTING_REFERENCE`, delta 1.
- Current Competing Listing Context refined: READY, Agent-adjusted, post-exclusion count 50, visible criteria include exact bedrooms, minimum bathrooms, and minimum lot acres; subject exclusion delta 1.
- Buyer mapping: mapped minimum/maximum bedrooms and minimum/maximum bathrooms; lot size remained unmapped.
- Cohort-N: READY for three exact-bedroom cohorts; readiness `COHORT_N_RUNTIME_READY`; 9 comparison results.
- Unadmitted `garageSpaces`: rejected with `FILTER_REJECTED:garageSpaces`.
- Unadmitted `zip`: rejected with `FILTER_REJECTED:zip`.
- Contradictory `bedsMin=4`, `bedsMax=2`: rejected with `FILTER_REJECTED:bedsRange` and interval reason.
- Negative lot acreage: rejected with `FILTER_REJECTED:lotSizeMin`.

Bounded performance observations from the live proof:
- bedroom range aggregation: 321 ms;
- exact bedrooms count: 268 ms;
- lot-acreage aggregation: 333 ms;
- default competing context: 677 ms;
- refined competing context: 554 ms;
- Cohort-N with three cohorts: 848 ms.

These are bounded observations from one read-only run, not benchmark claims.

## Validation

Passed:
- `npm run check:admitted-filter-registry-priority-1-property-segmentation-wave-7`
- `npm run check:advanced-property-segmentation-and-geography-admission-review`
- `npm run check:current-competing-listing-context-wave-6`
- `npm run check:cohort-n-multi-market-comparative-intelligence-wave-5`
- `npm run check:agent-decision-comparison-reuse-interval-semantics-wave-4`
- `npm run check:current-snapshot-comparative-intelligence`
- `npm run check:atlas-cohort-comparative-contract`
- `npm run check:reusable-agent-cohort-builder`
- `npm run check:admitted-basic-aggregation`
- `npm run check:canonical-physical-property-identity`
- `npm run check:market-intelligence-semantics-property-criteria-foundation`
- `npm run check:agent-property-conversation-preparation-experience`
- `npm run check:ires-cityid-evidence`
- `npm run check:neighborhood-submarket-geographic-object-governance`
- `./node_modules/.bin/jiti scripts/checkSourceRightsActivationReadiness.ts`
- `./node_modules/.bin/jiti scripts/checkSourceQualityBoulderCountyParcelGisEvidence.ts`
- `npm run typecheck`

Build result is recorded in final execution evidence.

## Capability Certification

Wave 7 certifies:
- canonical Agent admitted-filter registry;
- registry-governed shared cohort validation;
- registry metadata for legacy filters;
- registry metadata for Priority 1 filters;
- `bedsMax`;
- `bedsExact`;
- `bathsMax`;
- `bathsExact`;
- `lotSizeMin` in acres;
- `lotSizeMax` in acres;
- decimal-safe bathroom filtering;
- explicit lot-acreage unit/null policy;
- deterministic filter normalization;
- deterministic filter serialization;
- fail-closed unadmitted fields/operators;
- Buyer adapter extension for existing max bed/bath criteria;
- Current Competing Listing Context Agent refinement;
- Cohort-N compatibility with Priority 1 segmentation;
- existing admitted metrics over richer cohorts;
- Agent-only Priority 1 property segmentation.

Still blocked:
- lot-size aggregation;
- subject-vs-lot positioning;
- property subtype;
- garage/parking;
- HOA;
- basement;
- style;
- construction/new construction;
- builder/model;
- zoning;
- utilities;
- schools;
- remarks/text;
- listing-agent/office filters;
- photo/open-house filters;
- ZIP;
- new municipalities;
- county;
- subdivision;
- neighborhood;
- MLS Area/SubArea;
- map/polygon/radius;
- historical analytics;
- sold comparables;
- physical-property benchmark;
- CMA;
- valuation;
- recommendations;
- client/public/export.

## Next-Gate Priority Analysis

Compared candidates:

| Candidate | Agent-labor value | Dependency readiness | External burden | Methodology risk | Rights risk | Time to value | Leverage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ZIP postal listing filter foundation | high | high | low | low/moderate | low/moderate | fast | high |
| additional municipality / city-set versioning | high | moderate | low/moderate | moderate | low/moderate | moderate | high |
| targeted historical / event evidence admission | very high | low/moderate | high | high | high | slower | very high |
| Expert / MLS filter foundation | medium/high | moderate | moderate | high | high | moderate | high |
| subject-property benchmark foundation admission | very high | low | high | high | high | slower | very high |

One primary next gate:

`READY_FOR_ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION`

Why it ranks first:

Wave 7 now provides the registry, parser, query, UI, and fail-closed framework needed for a small, high-value filter addition. ZIP can be reviewed as postal listing filter semantics without canonical geography activation, without provider calls, without schema migration, and without historical or benchmark methodology.

Secondary parallel recommendation:

No Secondary Overflow implementation is recommended. A read-only ZIP postal-filter red-team could be useful only if Executive wants independent review before authorizing the ZIP foundation gate.

Executive decisions genuinely required:
- authorize or reject `READY_FOR_ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION`;
- decide whether fractional bathroom live-data absence in the six-city active scope requires future monitoring before broader UI treatment changes.

## Protected-System Confirmation

DATABASE MUTATION: NONE

DATABASE SCHEMA MIGRATION: NONE

SUPABASE CONFIGURATION MUTATION: NONE

MLS GRID CALL: NONE

IRES CALL: NONE

MLS SYNC: NONE

PROVIDER MUTATION: NONE

SOURCE ACTIVATION: NONE

TYPESENSE MUTATION: NONE

CRM MUTATION: NONE

EMAIL MUTATION: NONE

SECRET/API-KEY MUTATION: NONE

EXTERNAL OUTREACH: NONE

MANUAL VERCEL ACTION: NONE

MANUAL PRODUCTION DEPLOYMENT: NONE

NEW GEOGRAPHY ACTIVATION: NONE

ZIP ACTIVATION: NONE

ADDITIONAL MUNICIPALITY ACTIVATION: NONE

COUNTY FILTER ACTIVATION: NONE

SUBDIVISION / NEIGHBORHOOD ACTIVATION: NONE

MLS AREA / SUBAREA ACTIVATION: NONE

MAP / POLYGON / RADIUS FILTER ACTIVATION: NONE

PROPERTY SUBTYPE FILTER ACTIVATION: NONE

GARAGE / PARKING FILTER ACTIVATION: NONE

HOA FILTER ACTIVATION: NONE

BASEMENT / STYLE FILTER ACTIVATION: NONE

CONSTRUCTION / NEW-CONSTRUCTION FILTER ACTIVATION: NONE

SCHOOL FILTER ACTIVATION: NONE

REMARKS / TEXT FILTER ACTIVATION: NONE

PHOTO / OPEN-HOUSE FILTER ACTIVATION: NONE

NEW AGGREGATION METRIC IMPLEMENTATION: NONE

LOT-SIZE AGGREGATION IMPLEMENTATION: NONE

HISTORICAL ANALYTICS IMPLEMENTATION: NONE

SOLD-COMPARABLE IMPLEMENTATION: NONE

SUBJECT-PROPERTY BENCHMARK IMPLEMENTATION: NONE

CMA IMPLEMENTATION: NONE

VALUATION IMPLEMENTATION: NONE

RECOMMENDATION IMPLEMENTATION: NONE

CLIENT/PUBLIC OUTPUT ACTIVATION: NONE

PDF/EXPORT IMPLEMENTATION: NONE

AUTHENTICATION-BOUNDARY MUTATION: NONE
