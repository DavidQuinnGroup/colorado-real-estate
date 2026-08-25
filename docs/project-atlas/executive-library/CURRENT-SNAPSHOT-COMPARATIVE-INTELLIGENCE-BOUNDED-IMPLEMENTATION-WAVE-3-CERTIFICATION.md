# Current-Snapshot Comparative Intelligence Bounded Implementation Wave 3 Certification

## 1. Workstream Identity

Workstream: `CURRENT-SNAPSHOT COMPARATIVE INTELLIGENCE - BOUNDED IMPLEMENTATION WAVE 3`.

Certification target: `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`.

## 2. Executive Objective

Wave 3 implements the first bounded runtime Comparative Intelligence capability over certified current-snapshot Agent cohorts and admitted metric artifacts. It answers how two current markets or segments differ for the exact property type and filters selected by an Agent.

## 3. Governing Certifications / Contracts

- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`
- `ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED`
- `PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV_CERTIFIED`
- `REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV_CERTIFIED`
- `IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED`

## 4. Starting Repository Truth

Verified before implementation:

- Branch: `main`
- `HEAD`: `008c0d4b9ef3ee5d4a2ac2a52f61e700c802aa31`
- `origin/main`: `008c0d4b9ef3ee5d4a2ac2a52f61e700c802aa31`
- Divergence: `0 behind / 0 ahead`
- Working tree: clean
- `git diff --check`: PASS

## 5. Admission Review Baseline

The baseline admission review commit was `008c0d4b9ef3ee5d4a2ac2a52f61e700c802aa31`, subject `docs(atlas): admit current snapshot comparisons`, with next gate `READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3`.

## 6. Implementation Scope

Implemented Agent-only current-snapshot cohort comparison for admitted Wave 2 metrics. The implementation adds runtime contracts, comparability validation, comparison artifact calculation, Cohort A/B orchestration, Cohort N-ready runtime shape, protected read-only API access, and one bounded Agent Workspace UI integration.

## 7. Files Created / Modified

- `lib/agentCurrentSnapshotComparison.ts`
- `app/api/agent/current-snapshot-comparison/route.ts`
- `components/agent/AgentCurrentSnapshotComparison.tsx`
- `components/agent/MarketUpdatePreparationExperience.tsx`
- `lib/admin/adminAuth.ts`
- `scripts/checkCurrentSnapshotComparativeIntelligence.ts`
- `package.json`
- `docs/project-atlas/executive-library/CURRENT-SNAPSHOT-COMPARATIVE-INTELLIGENCE-BOUNDED-IMPLEMENTATION-WAVE-3-CERTIFICATION.md`

## 8. Comparability Validator Architecture

The validator reuses Wave 1 normalized cohort definitions and Wave 2 metric artifacts. It validates metric identity, calculation version, field basis, aggregation, unit, analytical grain, source scope, temporal basis, period form, artifact state, requested operation policy, as-of alignment, and Agent-only rights before producing deltas.

## 9. Comparability States

The runtime returns `COMPARABLE`, `COMPARABLE_WITH_LIMITATIONS`, `NOT_COMPARABLE`, `EVIDENCE_INSUFFICIENT`, or `RIGHTS_BLOCKED`.

## 10. Comparability Reason Codes

Runtime reasons include `METRIC_ID_MISMATCH`, `CALCULATION_VERSION_MISMATCH`, `FIELD_BASIS_MISMATCH`, `AGGREGATION_MISMATCH`, `UNIT_MISMATCH`, `GRAIN_MISMATCH`, `SOURCE_SCOPE_MISMATCH`, `TEMPORAL_BASIS_MISMATCH`, `PERIOD_FORM_MISMATCH`, `LEFT_ARTIFACT_NO_DATA`, `RIGHT_ARTIFACT_NO_DATA`, `AS_OF_EVIDENCE_INSUFFICIENT`, `RIGHTS_INCOMPATIBLE`, `UNSUPPORTED_METRIC_ID`, `UNSUPPORTED_OPERATION`, and `OPERATION_NOT_ADMITTED:*`.

## 11. Metric Compatibility Rules

Wave 3 requires identical metric id, calculation version, field basis, aggregation, and unit. Unsupported metric ids are rejected before artifact creation.

## 12. Analytical-Grain Rules

Only `MLS_LISTING` is admitted. `PHYSICAL_PROPERTY`, `TRANSACTION`, `LISTING_EPISODE`, and scenario grains fail closed.

## 13. Source-Scope Rules

Only `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION` is admitted. IRES-native exports, MLS-provider reads, multi-source equivalence, and external-provider populations are not admitted in Wave 3.

## 14. Geography-Compatibility Rules

Different admitted city values may be compared because they share the same Wave 1 municipality-city semantic type. Unmapped or unsupported geography remains rejected by the cohort validator.

## 15. Property / Filter Population Rules

Cohorts may differ by city, property type, status, price band, bedrooms, bathrooms, listed square feet, and year built only through the Wave 1 quick-filter contract. The comparison preserves filter differences and does not claim physical-property identity or cross-source duplicate resolution.

## 16. Temporal / Current-Snapshot Rules

Only `OBSERVATION_AS_OF_TIMESTAMP` with `AS_OF_INSTANT_SNAPSHOT` is admitted. Historical, MoM, QoQ, YoY, YTD, rolling-period, DOM, CDOM, DTS, DTO, and sale-event comparisons are blocked.

## 17. As-Of Alignment Policy

Cohorts are calculated during the same API request, but not through a database-level atomic snapshot guarantee. Wave 3 records request timestamp, per-cohort observation timestamps, maximum skew, and a 5000 ms same-request tolerance. Skew within tolerance is `ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE`; missing evidence is `AS_OF_EVIDENCE_INSUFFICIENT`; skew above tolerance is `COMPARABLE_WITH_AS_OF_LIMITATION`.

## 18. Stock / Flow Boundary

The comparison is current listing-record stock only. Count difference is not supply, demand, absorption, market pace, or market strength.

## 19. Null / Coverage Policy

Count includes all validated cohort records. Numeric aggregations exclude null source values and report eligible, included, and null/missing counts. Material coverage differences surface limitations and do not fabricate values.

## 20. Calculation-Version Policy

All implemented metrics require `AGENT_COHORT_BASIC_AGGREGATION_V1`. Version mismatch fails closed.

## 21. Audience / Rights Policy

Runtime output is `AGENT_ONLY`. Public display, client reports, and export are blocked. The API requires an exact Human Agent session classification.

## 22. Cohort Relationship Classification

Implemented states: `SAME_POPULATION`, `DISJOINT`, `SUBSET`, `SUPERSET`, `OVERLAPPING`, and `UNKNOWN_RELATIONSHIP`. Different supported cities are deterministic `DISJOINT`. Same city with nested price, square-footage, year-built, bedrooms, or bathrooms filters may classify as `SUBSET` or `SUPERSET`. Same-city overlapping but non-nested ranges classify as `OVERLAPPING`. Unproven relationships return `UNKNOWN_RELATIONSHIP`.

## 23. Comparative Result Artifact

Each result carries deterministic id, comparison version, metric id/version, cohort labels and ids, side-by-side values, admitted deltas, direction, ranks where admitted, comparability status and reasons, cohort relationship, coverage, as-of alignment, source scope, grain, calculation version, rights posture, limitations, and creation timestamp.

## 24. Zero-Denominator Policy

When the comparison baseline is zero, percentage delta is null and a limitation is emitted. `0 -> X` is never labeled `+100%`.

## 25. PER-METRIC ALLOWED OPERATIONS

| Metric | SIDE_BY_SIDE | ABSOLUTE_DELTA | PERCENTAGE_DELTA | DIRECTION | RANK |
|---|---|---|---|---|---|
| Matching current MLS listing records | ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Current asking/list price minimum | ADMITTED | ADMITTED | NOT_ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Current asking/list price maximum | ADMITTED | ADMITTED | NOT_ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Current asking/list price median | ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Current asking/list price mean | ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Bedrooms median | ADMITTED | ADMITTED | NOT_ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Bathrooms median | ADMITTED | ADMITTED | NOT_ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Listed square feet median | ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS | ADMITTED | ADMITTED_WITH_LIMITATIONS |
| Year built median | ADMITTED | ADMITTED | NOT_ADMITTED | ADMITTED | ADMITTED_WITH_LIMITATIONS |

## 26. Cohort A/B Orchestration

The API evaluates Cohort A and Cohort B under one request, reusing `aggregateAgentCohort` for admitted metric artifacts and applying Wave 3 validation before output.

## 27. Cohort N Readiness

Status: `COHORT_N_RUNTIME_READY`. The runtime contract accepts two to six cohorts and can rank compatible multi-cohort artifacts. The UI remains A/B-only for Wave 3.

## 28. Read-Only API Architecture

API path: `/api/agent/current-snapshot-comparison`. It is GET-only, `private, no-store`, exact Agent-session protected, read-only, and provider-free.

## 29. Agent Workspace Integration

The reusable component `AgentCurrentSnapshotComparison` is mounted once in `MarketUpdatePreparationExperience`, next to the certified reusable cohort builder.

## 30. Exact User-Facing Metric Labels

Implemented labels include `Matching current MLS listing records`, `Current asking/list price median`, `Current asking/list price mean`, and `Listed square feet median`.

## 31. Comparative Narrative Boundary

UI language is limited to side-by-side values, mathematical delta, comparability status, relationship, coverage, and as-of skew. It does not generate market strength, desirability, leverage, appreciation, pricing advice, buyer advice, seller advice, or investment recommendations.

## 32. Runtime Example A

City-vs-city runtime proof:

- Request: Boulder Active Residential vs Louisville Active Residential.
- HTTP status: `200`.
- Comparison status: `READY`.
- Relationship: `DISJOINT`.
- As-of skew: `1 ms`; tolerance `5000 ms`; status `ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE`.
- Matching current MLS listing records: `353` vs `46`; absolute delta `307`; percentage delta `667.3913043478261%`; direction `HIGHER`.
- Current asking/list price median: `$1,099,000` vs `$872,000`; absolute delta `$227,000`; percentage delta `26.03211009174312%`; direction `HIGHER`.
- Current asking/list price mean: `$1,493,155` vs `$1,107,617`; absolute delta `$385,538`; percentage delta `34.807880341309316%`; direction `HIGHER`.
- Listed square feet median: `1,950` vs `2,271`; absolute delta `-321`; percentage delta `-14.134742404227213%`; direction `LOWER`.

## 33. Runtime Example B

Price-band runtime proof:

- Request: Boulder Active Residential $500K-$1M vs Boulder Active Residential $1M-$2M.
- HTTP status: `200`.
- Comparison status: `READY`.
- Relationship: `OVERLAPPING` because the current inclusive filter contract includes the exact `$1,000,000` boundary in both cohorts.
- As-of skew: `0 ms`; tolerance `5000 ms`; status `ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE`.
- Matching current MLS listing records: `97` vs `111`; absolute delta `-14`; percentage delta `-12.612612612612612%`; direction `LOWER`.
- Current asking/list price median: `$750,000` vs `$1,495,000`; absolute delta `-$745,000`; percentage delta `-49.83277591973244%`; direction `LOWER`.
- Current asking/list price mean: `$751,305` vs `$1,492,474`; absolute delta `-$741,169`; percentage delta `-49.66042959542344%`; direction `LOWER`.
- Listed square feet median: `1,290` vs `2,479`; absolute delta `-1,189`; percentage delta `-47.962888261395725%`; direction `LOWER`.

## 34. Fail-Closed Runtime Results

Fail-closed runtime proof:

- Historical request: HTTP `422`; no results; reasons `COHORT_2:FILTER_REJECTED:periodForm`, `COHORT_2:FILTER_REJECTED:temporalBasis`.
- Physical-property grain request: HTTP `422`; no results; reason `COHORT_2:FILTER_REJECTED:analyticalGrain`.
- DOM request: HTTP `422`; no results; reason `UNSUPPORTED_METRIC_ID`.
- Public audience request: HTTP `422`; no results; reason `RIGHTS_INCOMPATIBLE`.

## 35. Deterministic Checker / Fixture Proof

`npm run check:current-snapshot-comparative-intelligence` proves valid city comparison, valid segment comparison, subset/superset/overlap/unknown relationship classification, metric id/version enforcement, grain/source/current-snapshot enforcement, sale-price/DOM rejection, no-data handling, zero-baseline handling, operation policy, direction, rank, rights enforcement, scenario rejection, deterministic as-of alignment, and protected boundary checks.

## 36. Regression Results

Regression results:

- `npm run check:comparative-intelligence-admission-review`: PASS.
- `npm run check:atlas-cohort-comparative-contract`: PASS.
- `npm run check:reusable-agent-cohort-builder`: PASS.
- `npm run check:admitted-basic-aggregation`: PASS.
- `npm run check:agent-market-update-preparation`: PASS.

## 37. Typecheck Result

`npm run typecheck`: PASS.

## 38. Build Result

`npm run build`: PASS. Build emitted only pre-existing unrelated lint warnings in `lib/financialDecisionPreparationContract.ts`, `lib/mls/fetchMLSPage.ts`, `lib/mls/paginationContract.ts`, and `lib/sundanceContentGenerationGate.ts`.

## 39. Git Diff Check

`git diff --check`: PASS before staging. Final staged diff check is recorded in the final response.

## 40. Capabilities Now Implemented

- Agent-only current-snapshot A/B comparison.
- Admitted metric side-by-side display.
- Operation-admitted absolute delta, percentage delta, direction, and rank.
- Coverage and as-of limitation metadata.
- Cohort relationship classification.
- Exact protected read-only comparison endpoint.
- Reusable Agent comparison UI.

## 41. Capabilities Deliberately Deferred

Historical comparisons, trend analysis, DOM/CDOM/DTS/DTO, SP/LP, sale-price comparisons, supply/absorption, listing-episode analysis, client/public reports, PDF/export, recommendation logic, scenario/investment comparisons, and broader Agent-surface rollout are deferred.

## 42. Historical / Methodology Blockers

Blocked items require admitted historical source snapshots or event evidence, listing-episode and relist methodology, sale-price methodology, denominator definitions for supply/absorption, and interpretation/recommendation governance.

## 43. Rights / Audience Blockers

Client reports, public display, and export require separate rights/audience admission. Wave 3 does not prove those rights.

## 44. Protected-System Confirmation

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

CLIENT/PUBLIC COMPARATIVE PUBLICATION: NONE

PDF/EXPORT IMPLEMENTATION: NONE

AUTHENTICATION-BOUNDARY MUTATION: NONE beyond adding the exact read-only Agent API surface required for Wave 3.

## 45. Final Commit / Push State

Final commit and push state are recorded in the final response after certification.

## 46. Certification State

Certification state: `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`, conditional on the final validation results recorded in the final response.

## 47. Next Recommended Gate

Recommended next gate: `READY_FOR_AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW`.

## 48. Executive Decisions Required

No Executive decision is required to complete Wave 3 if final validation passes. Future reuse, client/public rights, historical evidence admission, and recommendation semantics require separate authorization.
