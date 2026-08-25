# PROJECT ATLAS - Comparative Intelligence Foundation Admission Review

Status recommendation: `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED`

Next gate: `READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3`

## 1. Workstream Identity

Workstream: Comparative Intelligence Foundation - Admission Review.

This is an admission and architecture review only. It does not implement a runtime comparison engine or comparative Agent UI.

## 2. Executive Objective

Determine which independently defined cohorts and admitted metric artifacts can be compared now using current canonical repository truth without inventing historical data, MLS methodology, source equivalence, identity semantics, or display rights.

## 3. Governing Certifications / Contracts

- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`
- `ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED`
- `PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV`
- `REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV_CERTIFIED`
- `IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED`
- Existing source-quality and source-rights governance

## 4. Starting Repository Truth

- Branch: `main`
- HEAD: `b45d2f99602eb0f1bf2927a65f604571586b442a`
- origin/main: `b45d2f99602eb0f1bf2927a65f604571586b442a`
- Divergence: `0 behind / 0 ahead`
- Working tree: clean
- `git diff --check`: PASS

## 5. Wave 1-2 Runtime Artifact Inventory

Wave 1 supplies deterministic current MLS listing cohort normalization with explicit `MLS_LISTING` grain, `OBSERVATION_AS_OF_TIMESTAMP`, `AS_OF_INSTANT_SNAPSHOT`, supported city geography, and `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION` source scope.

Wave 2 supplies admitted Agent-only metric artifacts for current listing count, current asking/list price min/max/median/mean, bedrooms median, bathrooms median, listed square feet median, and year-built median. Each artifact carries metric ID, calculation version, cohort ID/version, source scope, temporal basis, field basis, coverage counts, limitations, and rights posture.

## 6. Current Cohort Metadata Sufficiency

Current cohorts are sufficient for bounded current-snapshot comparison when both cohorts validate under Wave 1 and retain the same grain, source scope, stock/snapshot period form, and supported city geography contract.

Not sufficient: physical-property comparison, listing-episode comparison, transaction comparison, historical event comparison, cross-source population comparison, or statewide/provider-equivalence claims.

## 7. Current Metric-Artifact Metadata Sufficiency

Wave 2 metric artifacts are stable enough for comparison admission when both sides share metric ID, calculation version, aggregation, unit, grain, source scope, field basis, null policy, period form, and rights posture.

Coverage metadata is sufficient to surface limitations. It is not sufficient to hide null/missing differences or to treat sparse artifacts as fully equivalent.

## 8. Track A current-snapshot findings

Track A is admitted for bounded implementation: compare current `MLS_LISTING` cohort artifacts from `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION` with `AS_OF_INSTANT_SNAPSHOT` semantics.

Ready-now families:

- City vs city current snapshot for supported Wave 1 cities.
- Segment vs segment within supported fields.
- Subsegment vs parent when relationship is deterministically knowable.
- Property characteristic segment comparisons using admitted Quick Filters.
- Two-cohort side-by-side and same-metric absolute differences where operation policy admits it.

Track A must preserve factual comparative observations and avoid market-strength, desirability, appreciation, negotiating-power, recommendation, or forecast statements.

## 9. Track B historical/temporal findings

Track B is not admitted. MoM, QoQ, YoY, YTD, rolling periods, multi-year trends, historical active inventory, and historical asking/list-price trends remain blocked by historical data and methodology. Current snapshot artifacts cannot be relabeled as historical snapshots.

## 10. Geography-vs-Geography Admission

`CITY_VS_CITY_CURRENT_SNAPSHOT` is `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` for Boulder, Louisville, Lafayette, Superior, Erie, and Longmont when the comparison uses the same admitted metric and same source/temporal/grain contract.

Different cohort sizes do not invalidate the comparison, but raw count and coverage differences must be displayed.

## 11. Segment-vs-Segment Admission

`SEGMENT_VS_SEGMENT_CURRENT_SNAPSHOT` is `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` for admitted Quick Filter segments such as price bands, bedroom minimums, bathroom minimums, listed square-footage ranges, and year-built ranges.

Overlapping cohorts are admissible only with relationship metadata and no claim of statistical independence.

## 12. Subsegment-vs-Parent Admission

`SUBSEGMENT_VS_PARENT_CURRENT_SNAPSHOT` is `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` when deterministic filter containment proves subset/parent relationship. The result must disclose subset relationship and must not imply independent samples.

## 13. Multi-Cohort Admission

`MULTI_COHORT_CURRENT_SNAPSHOT` is `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION`. The repository has the necessary cohort and metric artifact primitives, but Wave 3 needs bounded orchestration metadata: maximum cohort count, deterministic ordering, per-cohort failure handling, shared request timestamp, and as-of alignment disclosure.

Recommended initial maximum: six cohorts, matching the six Wave 1 supported Agent market cities. This limit is repository-grounded in the current supported city set.

## 14. As-Of Alignment Findings

Current Wave 2 artifacts are generated at request time. Two separately queried cohorts can have slight timestamp skew. For Agent-only current comparisons, slight skew is acceptable with disclosure when all artifacts share `OBSERVATION_AS_OF_TIMESTAMP` and `AS_OF_INSTANT_SNAPSHOT` semantics.

Wave 3 should add a comparison request timestamp, per-cohort artifact timestamp, and a tolerated alignment window. Exact database snapshot atomicity is not currently established and must not be claimed.

## 15. Source-Population Alignment Findings

All admitted Wave 1-2 cohorts use `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`. This is sufficient for bounded current-snapshot comparisons inside that source population only.

It does not admit IRES + RECO equivalence, statewide MLS equivalence, all Colorado listing coverage, physical-property coverage, or cross-source duplicate suppression claims.

## 16. Geography Alignment Findings

The six supported cities share a repository-supported Agent market city contract sufficient for current city-filter comparisons. Denver, Broomfield, Westminster, Niwot, Brighton, statewide geographies, neighborhoods, and polygons are not admitted by this review.

## 17. Per-Metric Comparison Readiness

| Metric | Readiness | Reason |
| --- | --- | --- |
| Matching current MLS listing records | Ready now | Same count grain and source scope; raw count limitations required |
| Current asking/list price minimum | Ready now | Same current asking/list price field basis |
| Current asking/list price maximum | Ready now | Same current asking/list price field basis |
| Current asking/list price median | Ready now | High-value current snapshot comparison |
| Current asking/list price mean | Ready now | Outlier limitation required |
| Bedrooms median | Ready now | Characteristic comparison only |
| Bathrooms median | Ready now | Characteristic comparison only |
| Listed square feet median | Ready now | Use listed square-footage label only |
| Year built median | Ready now | Absolute/directional comparison only; no percentage delta |

## 18. Per-metric allowed comparison operations

| Metric family | Operations |
| --- | --- |
| Listing count | side-by-side, absolute delta, percentage delta with zero-denominator policy, direction, rank |
| Asking/list price median and mean | side-by-side, absolute delta, percentage delta with zero-denominator policy, direction, rank |
| Asking/list price min/max | side-by-side, absolute delta, direction, rank |
| Bedrooms median | side-by-side, absolute delta, direction, rank |
| Bathrooms median | side-by-side, absolute delta, direction, rank |
| Listed square feet median | side-by-side, absolute delta, percentage delta with zero-denominator policy, direction, rank |
| Year built median | side-by-side, absolute delta, direction, rank |

Percentage delta is not admitted for year built, bedrooms, bathrooms, or asking/list price min/max.

## 19. Count-Normalization Limitations

Raw listing counts may be shown side by side, ranked, and compared by absolute or percentage delta with limitations. They must not be labeled inventory rate, supply, demand, market activity, months of supply, or absorption. Normalized count/rate metrics require an admitted denominator and remain deferred.

## 20. Overlap / Nesting Relationship Requirements

Wave 3 should include relationship metadata:

- `DISJOINT`
- `OVERLAPPING`
- `SUBSET`
- `SUPERSET`
- `SAME_POPULATION`
- `UNKNOWN_RELATIONSHIP`

Relationship metadata is `REQUIRED_FOR_MVP` for subsegment/parent and overlapping segment comparisons, `RECOMMENDED_FOR_MVP` for city-vs-city, and `DEFERRED` only where relationships cannot yet be deterministically inferred.

## 21. Comparability-Validator Runtime Readiness

The existing certified comparability states remain sufficient: `COMPARABLE`, `COMPARABLE_WITH_LIMITATIONS`, `NOT_COMPARABLE`, `EVIDENCE_INSUFFICIENT`, and `RIGHTS_BLOCKED`.

Wave 3 needs a small repository-local validator that checks metric ID/version, grain, source scope, temporal basis, period form, field basis, calculation version, artifact state, coverage, rights, and cohort relationship. No new status vocabulary is required now.

## 22. Zero-Denominator Requirements

The existing zero-denominator policy remains correct: `0 -> X` must not automatically become `+100%`.

Wave 3 behavior requirements:

- Baseline value `0`, comparison value greater than `0`: percentage delta `null` with zero-denominator reason.
- Both values `0`: percentage delta `null`; direction may be flat only for absolute value.
- One artifact `NO_DATA`: comparison fails closed or returns no-data state.
- Both artifacts `NO_DATA`: no comparative value.
- Empty cohort: count can be zero, non-count metrics remain no-data.
- Insufficient coverage: compare only with explicit coverage limitation, or fail closed if below a future threshold.

## 23. Agent Workflow / Value Mapping

High value:

- Boulder vs Louisville / city-vs-city market snapshot for buyer location comparison, relocation discussion, seller context, and market preparation.
- Six-city side-by-side regional orientation after small orchestration foundation.
- Price-band vs price-band for entry/mid/high search context without demand/supply inference.
- 2+ bedroom vs 4+ bedroom or smaller vs larger listed-square-footage segments for buyer and seller preparation.
- Subsegment vs parent for seller context without pricing recommendation.

Moderate value:

- Year-built median comparisons.
- Asking/list price mean comparisons where outliers are disclosed.

Low value:

- Percentage delta for characteristic fields such as bedrooms, bathrooms, or year built. These are not admitted.

## 24. Audience / Rights Posture

Current comparative foundation is Agent-only. `CLIENT_PRIVATE`, `PUBLIC`, and `EXPORT_PDF` remain blocked absent rights and presentation admission. Analytical comparability does not expand source rights.

## 25. Implementation Readiness Matrix

| Capability | Readiness |
| --- | --- |
| City vs city listing count | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city current asking/list-price median | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city current asking/list-price mean | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city asking-price range | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city bedrooms median | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city bathrooms median | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city listed-square-feet median | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| City vs city year-built median | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Price-band vs price-band | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Characteristic segment vs segment | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Subsegment vs parent | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Multi-city side-by-side | `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION` |
| Rank by admitted current metric | `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION` |
| Absolute delta | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Percentage delta | `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION` |

## 26. Historical Blocker Matrix

| Capability | Blocker |
| --- | --- |
| MoM, QoQ, YoY, YTD | `BLOCKED_BY_HISTORICAL_DATA` |
| Rolling periods | `BLOCKED_BY_HISTORICAL_DATA` |
| Multi-year trend | `BLOCKED_BY_HISTORICAL_DATA` |
| Historical active inventory | `BLOCKED_BY_HISTORICAL_DATA` |
| Historical asking/list-price trend | `BLOCKED_BY_HISTORICAL_DATA` |
| DOM/CDOM/DTS/DTO | `BLOCKED_BY_METHODOLOGY` |
| SP/LP and sale-price statistics | `BLOCKED_BY_METHODOLOGY` |

## 27. Advanced Comparison Blocker Matrix

| Capability | Blocker |
| --- | --- |
| Subject property vs benchmark | `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION` |
| Listing vs competing listings | `READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION` |
| Seller pricing comparison | `BLOCKED_BY_METHODOLOGY` |
| Buyer competitive positioning | `BLOCKED_BY_METHODOLOGY` |
| Failed-listing comparison | `BLOCKED_BY_HISTORICAL_DATA` |
| Relist comparison | `BLOCKED_BY_HISTORICAL_DATA` |
| Scenario vs observed benchmark | `BLOCKED_BY_METHODOLOGY` |

## 28. Recommended Bounded Wave 3 Scope

Implement current-snapshot comparative intelligence for Agent-only use:

- Independently defined Cohort A and Cohort B.
- Optional bounded Cohort N up to six current supported cities.
- Same admitted Wave 2 metric registry.
- Comparability validator.
- Side-by-side values.
- Absolute delta where operation policy admits it.
- Percentage delta only where operation policy admits it and zero-denominator policy is satisfied.
- Direction/rank where operation policy admits it.
- Coverage comparison.
- Cohort relationship metadata.
- Current as-of alignment metadata.
- Factual comparative observations only.

## 29. Explicitly Excluded Wave 3 Scope

No historical comparisons, recommendation engine, seller pricing advice, buyer offer advice, investment/scenario engine, public/client reporting, PDF/export, provider calls, MLS/IRES calls, source activation, schema migration, database mutation, DOM/CDOM/SP-LP, months of supply, absorption, status-event history, price-change history, relist analytics, failed-listing analytics, or cross-MLS population-equivalence claims.

## 30. Deterministic Checker / Fixture Results

Checker: `npm run check:comparative-intelligence-admission-review`.

The checker validates current-snapshot admissibility, metric-version rejection, grain mismatch rejection, source mismatch rejection, current-vs-historical rejection, asking-price-vs-sale-price rejection, geography/segment/subset admission with limitations, no-data fail-closed behavior, rights mismatch rejection, zero-denominator policy requirements, readiness matrix entries, and the IRES Compare Two Years evidence boundary.

## 31. Validation Results

Validation commands and final results are recorded in the execution report.

## 32. Certification / Readiness Recommendation

`CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED`

Historical comparative intelligence is not certified.

## 33. Next Gate

`READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3`

## 34. Git State

Final commit and push state are recorded in the execution report after verification.

## 35. Executive Decisions Required

Executive approval is required before Wave 3 implementation and separately before historical analytics, advanced/Expert filters, client/private reporting, public reporting, PDF/export, source/provider activation, schema changes, MLS/IRES calls, recommendation engines, or deployment.

## Canonical IRES Compare Two Years Evidence

The controlled IRES Compare Two Years experiment remains non-comparable design evidence: a report labeled `2025 vs 2026` retained `Listing Date Min: 01/01/2026` and `Listing Date Max: 08/25/2026`, forcing the displayed 2025 population to zero. Report labels do not establish comparability; ATLAS must validate metric, grain, population, source, geography, temporal/event basis, as-of semantics, coverage, calculation version, and rights.
