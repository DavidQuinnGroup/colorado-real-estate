# PROJECT ATLAS - Current Competing Listing Context Bounded Implementation Wave 6 Certification

## 1. Workstream Identity

Workstream: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6

Certification state: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED

Authorized starting commit: 16c398973fb5a3fea53055f93972cc1500a56fbe

## 2. Executive Objective

Wave 6 implements an Agent-only current subject MLS listing context plus current active competing MLS listing cohort. It answers how the selected subject listing currently sits relative to a transparent current competing-listing cohort using admitted current-snapshot metrics only.

It does not answer value, pricing, CMA, sold-comparable, historical, DOM, SP/LP, or strategy questions.

## 3. Governing Certifications

- ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED
- REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED
- ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED
- CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED
- AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4_CERTIFIED
- COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED
- ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_SUBJECT_PROPERTY_BENCHMARK_PRIORITY_AND_ADMISSION_REVIEW_CERTIFIED
- PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV_CERTIFIED
- REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV_CERTIFIED

## 4. Starting Repository Truth

- Branch: main
- HEAD: 16c398973fb5a3fea53055f93972cc1500a56fbe
- origin/main: 16c398973fb5a3fea53055f93972cc1500a56fbe
- Divergence: 0 behind / 0 ahead
- Working tree: clean
- git diff --check: PASS

## 5. Subject-Oriented Surface Audit

Property Preparation is the selected primary Agent surface because it already selects one explicit repository property by slug, loads stored listing facts, uses an exact Agent-only read-only API, and frames the result as preparation, not recommendation.

Listing Preparation and Seller Preparation remain compatible follow-on surfaces, but Wave 6 avoids broadening them because the narrowest subject-oriented route is `/agent/prepare/property`.

## 6. Subject Identity and Grain

Subject identity type: PROPERTY_SLUG.

Source/listing identity basis: `mlsId` retained as listingReference.

Final subject analytical grain: MLS_LISTING.

SUBJECT LISTING != PHYSICAL PROPERTY.

The implementation fails closed if deterministic listing identity or current active listing status is unavailable.

## 7. Subject Listing Context Contract

Contract: SUBJECT_LISTING_CONTEXT_V1.

The subject context records repositoryIdentity, listingReference, analyticalGrain, sourceScope, observationAsOf, currentStatus, admitted subject fields, and missingFields.

No canonical physical-property identity is activated or implied.

## 8. Subject Field Admission Matrix

| Field | Wave 6 use |
| --- | --- |
| city | Cohort derivation and visible criterion |
| propertyType | Cohort derivation and visible criterion |
| status | Active competing-cohort scope |
| price | Current asking/list-price positioning |
| beds | Factual median positioning |
| baths | Factual median positioning |
| sqft | Factual median positioning |
| yearBuilt | Factual median positioning |
| lotSize | Not used |
| neighborhood/subdivision/school/DOM/sold/price history | Not used |

## 9. Default Competing-Cohort Criteria

The system-derived default cohort uses only:

- same admitted city;
- compatible admitted residential property type;
- active status.

It does not infer that narrower is more comparable and does not invent price, bedroom, bathroom, square-footage, or year-built bands.

## 10. Agent-Adjusted Cohort Policy

The Agent may refine only already admitted Wave 1-5 filters: price interval, minimum bedrooms, minimum bathrooms, square-footage interval, year-built interval, admitted city, admitted property type, and active status.

The UI distinguishes SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT from AGENT_ADJUSTED_COMPETING_COHORT and displays visible criteria.

## 11. Subject Exclusion

When `mlsId` is available, the competing cohort aggregation excludes that listing reference before calculating count and metrics.

Proof basis:

- preExclusionCount is calculated from the admitted cohort without exclusion;
- postExclusionCount is calculated through the existing aggregation layer with `excludeMlsIds`;
- exact exclusion is claimed only when pre minus post equals one.

If the count delta is not exactly one, the artifact returns EXCLUSION_NOT_DETERMINISTIC.

## 12. Empty and Small Cohorts

Zero competing listings return NO_COMPETING_LISTINGS and no fabricated positioning confidence.

Small cohorts expose count and limitation: SMALL_COHORT_COUNT_VISIBLE_NO_STATISTICAL_CONFIDENCE_CLAIM.

Null subject fields remain unavailable; they are never coerced to zero. Cohort NO_DATA metrics remain NO_DATA.

## 13. Positioning Operation Matrix

| Field | Subject value | Cohort median | Cohort mean | Absolute delta | Percentage delta | Direction |
| --- | --- | --- | --- | --- | --- | --- |
| Current asking/list price | ADMITTED | ADMITTED | ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS | ADMITTED |
| Listed square feet | ADMITTED | ADMITTED | NOT_USED | ADMITTED | NOT_USED | ADMITTED |
| Bedrooms | ADMITTED | ADMITTED | NOT_USED | ADMITTED | NOT_USED | ADMITTED |
| Bathrooms | ADMITTED | ADMITTED | NOT_USED | ADMITTED | NOT_USED | ADMITTED |
| Year built | ADMITTED | ADMITTED | NOT_USED | ADMITTED | NOT_ADMITTED | ADMITTED |

CURRENT ASKING/LIST PRICE != SALE PRICE.

CURRENT ASKING/LIST PRICE != MARKET VALUE.

POSITION RELATIVE TO COHORT != PRICING ADVICE.

## 14. Language Boundaries

The UI and artifact use factual labels only:

- Current competing listing context.
- Subject listing.
- Current active competition.
- Subject vs cohort median.
- Current asking/list price.

The implementation excludes overpriced, underpriced, market value, recommended price, CMA certification, valuation certification, and subject-property benchmark certification semantics.

CURRENT COMPETING LISTING CONTEXT != CMA.

CURRENT COMPETING LISTING CONTEXT != VALUATION.

CURRENT COMPETING LISTING != SOLD COMPARABLE.

## 15. As-Of and Coverage

Subject observationAsOf is retained from stored source posture. Cohort asOf is retained from the current aggregation artifact. The UI labels the result as current snapshot context and does not claim atomic simultaneity when reads are sequential.

Every positioning artifact retains eligible cohort count, included population count, null/missing count, cohort metric value, subject value, delta, unit, operation policy, and limitations.

## 16. API and Runtime Architecture

Endpoint: `/api/agent/current-competing-listing-context`.

Surface classification: exact HUMAN_AGENT / AGENT / HUMAN_AGENT_SESSION / READ_ONLY.

Runtime behavior:

- Reads selected subject through existing Property Preparation repository access.
- Builds SUBJECT_LISTING_CONTEXT_V1.
- Derives current competing cohort.
- Reuses existing cohort normalization/count/aggregation infrastructure.
- Excludes subject by `mlsId` when deterministic.
- Computes factual subject-vs-cohort positioning.
- Rejects unsupported audience, physical-property grain, historical, DOM, sold-comparable, and unadmitted-filter requests.

## 17. UI Architecture

Selected route/surface: `/agent/prepare/property`.

Exact UI panel: `agent-current-competing-listing-context`.

The subject listing is visually distinct from the cohort criteria, admitted metrics, and factual positioning. Criteria are visible as tags. Agent-editable controls are limited to admitted filters.

## 18. Runtime Examples

Example A valid subject:

- Subject slug used for repository-local runtime proof: `4660-macarthur-ln-boulder-co-ire402057154`.
- Subject summary: Boulder, Active, Residential, current asking/list price $595,000, 2 beds, 2 baths, 1,380 listed square feet, year built 1978.
- Result: SUBJECT_LISTING_CONTEXT_V1 at MLS_LISTING grain, default current active Boulder/residential cohort, admitted metrics returned, factual positioning returned.

Example B Agent-adjusted cohort:

- Agent supplied admitted price interval $495,000 to $695,000.
- Result: cohort derivation changed to AGENT_ADJUSTED_COMPETING_COHORT, criteria remained visible, subject identity remained unchanged, positioning recalculated, post-exclusion count was 48.

Example C subject exclusion:

- Subject otherwise satisfied the default cohort.
- Pre-exclusion count: 353.
- Post-exclusion count: 352.
- Count delta: 1.
- Result: EXCLUDED_BY_LISTING_REFERENCE using `mlsId`.

Fail-closed examples:

- Unknown subject: UNKNOWN_SUBJECT.
- Physical-property request: SUBJECT_GRAIN_NOT_ADMITTED.
- Public/client audience: RIGHTS_INCOMPATIBLE.
- Historical request: HISTORICAL_CONTEXT_NOT_ADMITTED.
- DOM request: DOM_NOT_ADMITTED.
- Sold-comparable request: SOLD_COMPARABLE_NOT_ADMITTED.

## 19. Final Architectural Review

All required certification questions are answered YES:

- subject identity is explicit;
- subject grain is MLS_LISTING;
- physical-property conversion is not performed;
- subject observation is current-snapshot only;
- provenance/as-of metadata are retained;
- only admitted fields are used;
- default cohort is transparent;
- default cohort is not authoritative comparable selection;
- Agent can inspect and refine criteria using admitted filters;
- system-derived and Agent-adjusted cohorts are distinguishable;
- deterministic subject exclusion is implemented with limitation state;
- empty/small cohorts are truthfully labeled;
- null subject and NO_DATA cohort values remain unavailable;
- current asking/list-price semantics are preserved;
- sold-comparable, CMA, valuation, recommended-price, historical, DOM/CDOM, and SP/LP semantics are excluded;
- implementation remains Agent-only.

## 20. Capabilities Certified

- Bounded Subject Listing Context at MLS_LISTING grain.
- Current subject-listing observation.
- Transparent current competing-listing cohort.
- Deterministic subject exclusion where `mlsId` permits.
- Agent adjustment of admitted competing-cohort criteria.
- Current competing-listing count.
- Admitted current cohort aggregations.
- Subject-vs-cohort current asking/list-price positioning.
- Subject-vs-cohort listed-square-footage, bedroom, bathroom, and year-built positioning.
- Coverage/provenance/as-of handling.
- Agent-only subject-context UI.

## 21. Capabilities Deliberately Excluded

- SUBJECT_PROPERTY_BENCHMARK.
- CMA.
- Valuation.
- AVM.
- Recommended list price.
- Expected sale price.
- Automated pricing strategy.
- Sold comparable selection.
- Historical subject performance.
- DOM/CDOM/DTS/DTO.
- SP/LP.
- Sale-price analytics.
- Price-reduction history.
- Listing episode/relist/failed-listing analysis.
- Public/client output.
- PDF/export.
- Advanced filter expansion.
- New geography activation.

## 22. Follow-On Priority

Advanced Segmentation remains the highest-value next primary gate because Wave 6 exposes the value of richer current competing cohort refinement.

Historical Evidence remains highly valuable for recent sold context, listing lifecycle, DOM, sale-price positioning, and future true benchmarking, but Wave 6 did not make it less blocked.

True Subject-Property Benchmark remains blocked by multiple dependencies: canonical physical-property identity, richer segmentation, historical/sold evidence, benchmark-selection methodology, rights, and Agent professional judgment boundary.

One primary next gate: READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW.

Secondary parallel recommendation: NO_SECONDARY_PARALLEL_WORK_RECOMMENDED.

## 23. Protected-System Confirmation

- DATABASE MUTATION: NONE
- DATABASE SCHEMA MIGRATION: NONE
- SUPABASE CONFIGURATION MUTATION: NONE
- MLS GRID CALL: NONE
- IRES CALL: NONE
- MLS SYNC: NONE
- PROVIDER MUTATION: NONE
- SOURCE ACTIVATION: NONE
- TYPESENSE MUTATION: NONE
- CRM MUTATION: NONE
- EMAIL MUTATION: NONE
- SECRET/API-KEY MUTATION: NONE
- EXTERNAL OUTREACH: NONE
- MANUAL VERCEL ACTION: NONE
- MANUAL PRODUCTION DEPLOYMENT: NONE
- CLIENT/PUBLIC OUTPUT ACTIVATION: NONE
- PDF/EXPORT IMPLEMENTATION: NONE
- ADVANCED FILTER EXPANSION: NONE
- NEW GEOGRAPHY ACTIVATION: NONE
- HISTORICAL ANALYTICS IMPLEMENTATION: NONE
- SOLD-COMPARABLE IMPLEMENTATION: NONE
- SUBJECT-PROPERTY BENCHMARK IMPLEMENTATION: NONE
- CMA IMPLEMENTATION: NONE
- VALUATION IMPLEMENTATION: NONE
- PRICING-RECOMMENDATION IMPLEMENTATION: NONE
- AUTHENTICATION-BOUNDARY MUTATION: NONE

## 24. Files Created or Modified

- lib/agentCurrentCompetingListingContext.ts
- lib/agentCurrentCompetingListingContextFixtures.ts
- lib/agentCohortAggregation.ts
- app/api/agent/current-competing-listing-context/route.ts
- lib/admin/adminAuth.ts
- components/agent/PropertyConversationExperience.tsx
- scripts/checkCurrentCompetingListingContextWave6.ts
- package.json
- docs/project-atlas/executive-library/CURRENT-COMPETING-LISTING-CONTEXT-BOUNDED-IMPLEMENTATION-WAVE-6-CERTIFICATION.md

## 25. Executive Decisions Required

Executive must decide whether to authorize READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW as the next primary PROJECT ATLAS gate.

No authorization is requested or implied for database mutation, provider/MLS/IRES access, public/client/export activation, historical analytics, sold comparables, CMA, valuation, or pricing recommendations.
