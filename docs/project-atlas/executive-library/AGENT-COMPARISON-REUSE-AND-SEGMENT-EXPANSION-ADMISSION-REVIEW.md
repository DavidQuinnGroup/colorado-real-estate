# Agent Comparison Reuse and Segment Expansion Admission Review

## 1. Workstream identity

Status: `AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW_CERTIFIED`

Version: `AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_ADMISSION_REVIEW_V1`

Scope: architecture, documentation, repository analysis, and inert certification only. This package does not implement a new product surface, mutate data, activate a provider, alter schema, deploy, or authorize customer/public output.

## 2. Executive objective

Answer the operating question: if a licensed Colorado real-estate Agent performs recurring current-snapshot comparison work manually in IRES, which reusable ATLAS comparison capability should replace that work, what already exists, what is missing, and which evidence/data gates remain required before REIE can do it correctly.

## 3. Governing certifications/contracts

- `ATLAS_COHORT_COMPARATIVE_CONTRACT_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_CERTIFIED`
- `ADMITTED_BASIC_AGGREGATION_CERTIFIED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`
- Wave 3 next gate: `READY_FOR_AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW`

## 4. Starting repository truth

Starting branch: `main`

Starting HEAD/origin: `9b48304da16f4712e815357b1fdd4dd491c0e4b6`

Starting divergence: `0 behind / 0 ahead`

Starting working tree: clean

Starting diff check: pass

## 5. Wave 3 implementation audit

Wave 3 is an Agent-only, read-only, current-snapshot comparison implementation. `lib/agentCurrentSnapshotComparison.ts` supports two to six cohort artifacts at the engine layer and emits `COHORT_N_RUNTIME_READY`, but the API and UI are currently A/B only. The API is GET-only at `/api/agent/current-snapshot-comparison`, requires a human Agent session, returns private no-store responses, and does not expose mutation methods. The current UI lives in `components/agent/AgentCurrentSnapshotComparison.tsx` and is mounted only in Market Update Preparation.

The comparison contract is reusable because it is not materially coupled to Market Update narrative logic. It is still constrained by current MLS listing grain, current repository property-search projection, as-of instant snapshot semantics, Agent-only rights, and admitted metric operation policy.

## 6. Shared comparison architecture findings

The shared architecture already exists at three levels:

- cohort normalization and filter validation in `lib/agentCohortBuilder.ts`;
- basic Agent-only metric aggregation in `lib/agentCohortAggregation.ts`;
- current-snapshot comparison and relationship classification in `lib/agentCurrentSnapshotComparison.ts`.

The missing shared architecture is presentation configuration: default presets, copy guards, surface-specific labels, buyer criteria adaptation, and interval semantics are embedded or implicit rather than governed as reusable surface configuration.

## 7. Surface coupling findings

`AgentCurrentSnapshotComparison` has a `surface` prop, uses Agent-only proof markers, and fetches the shared API. The Market Update mount is a first consumer, not a hard architectural dependency. Current coupling is primarily UI defaults and primary metric selection, not engine or API coupling.

## 8. Buyer Preparation reuse review

Buyer Preparation is a high-value reuse target. The existing `PropertyCriteriaProfileEditor` captures session-only buyer criteria with explicit no-persistence, no-saved-search, no-provider-query markers. Reuse is admitted after a small local foundation that maps buyer criteria to current comparison presets without recommendations, suitability claims, offer strategy, or customer-data persistence.

## 9. Location Preparation reuse review

Location Preparation is a very high-value reuse target for city-vs-city current comparison. The blocker is not the comparison engine; it is city-set alignment. Location Preparation P0 admits Boulder, Louisville, and Lafayette editorial city packets, while the cohort engine admits Boulder, Louisville, Lafayette, Superior, Erie, and Longmont for current MLS-listing comparison. Reuse requires explicit city-set handling and copy that keeps editorial place context separate from current market facts.

## 10. Market Preparation reuse review

Market Preparation is a high-value, low-cost reuse target. It already operates on the same six market cities as the cohort engine and is a more natural point-in-time market-analysis surface than Market Update alone. It should consume the same shared comparison component configuration rather than forking the Market Update UI.

## 11. Seller Preparation reuse review

Seller Preparation has high eventual value, but it sits near pricing, CMA, and subject-property benchmark boundaries. It should not receive broad comparison reuse until a subject-property benchmark contract exists and the product copy explicitly avoids pricing recommendations.

## 12. Listing Preparation reuse review

Listing Preparation has high eventual value for competing-listing context, but listing lifecycle, representation, public marketing, and pricing boundaries make it a later reuse target. It should follow the subject-property benchmark foundation.

## 13. Property Preparation reuse review

Property Preparation should be deferred for direct current cohort comparison. The current engine is MLS-listing grain; Property Preparation is property-specific and can cross into physical-property identity. It requires an MLS-listing-to-physical-property grain firewall and a subject-property benchmark contract before reuse.

## 14. Surface reuse ranking

| Rank | Surface | Finding |
| --- | --- | --- |
| 1 | Location Preparation | Very high value; ready after city-set alignment and copy guard. |
| 2 | Buyer Preparation | Very high value; ready after criteria-to-cohort adapter and no-recommendation guard. |
| 3 | Market Preparation | High value and low cost; ready after shared surface config. |
| 4 | Market Update Preparation | Already implemented; maintain Wave 3 guardrails. |
| 5 | Seller Preparation | Defer until subject-property benchmark. |
| 6 | Listing Preparation | Defer until subject-property benchmark and listing lifecycle rights review. |
| 7 | Property Preparation | Defer until grain contract exists. |

## 15. Current segmentation inventory

Current admitted cohort filters are city, Residential property type, Active status scope, price min/max, beds minimum, baths minimum, square-foot min/max, and year-built min/max. Current admitted metrics are count, min/max/median/mean current asking/list price, median bedrooms, median bathrooms, median listed square feet, and median year built.

## 16. Candidate advanced segmentation fields

Candidate fields fall into four groups:

- ready after interval contract: price bands, beds, baths, listed square feet, year built;
- ready after small local foundation: ZIP;
- blocked by source semantics or rights: neighborhood, subdivision, school district, lot size, lat/lng/radius/polygon, non-Residential property type, status beyond Active, listing agent/office;
- blocked by absence or grain: garage, HOA, basement, style, condition, new construction, waterfront, zoning, county, subject-property identity.

## 17. Per-field admission classification

| Field | Tier | Admission |
| --- | --- | --- |
| city | Quick | `ADMITTED_NOW` |
| propertyType:Residential | Quick | `ADMITTED_NOW` |
| statusScope:Active | Quick | `ADMITTED_NOW` |
| priceMin/priceMax | Quick | `READY_AFTER_INTERVAL_CONTRACT` |
| bedsMin/bedsMax/exactBeds | Advanced | `READY_AFTER_INTERVAL_CONTRACT` |
| bathsMin/bathsMax/exactBaths | Advanced | `READY_AFTER_INTERVAL_CONTRACT` |
| sqftMin/sqftMax | Advanced | `READY_AFTER_INTERVAL_CONTRACT` |
| yearBuiltMin/yearBuiltMax | Advanced | `READY_AFTER_INTERVAL_CONTRACT` |
| zip | Advanced | `READY_AFTER_SMALL_LOCAL_FOUNDATION` |
| neighborhood/subdivision | Expert | `BLOCKED_BY_SOURCE_SEMANTICS` |
| schoolDistrict | Expert | `BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY` |
| lotSize | Expert | `BLOCKED_BY_SOURCE_SEMANTICS` |
| lat/lng/radius/polygon | Expert | `BLOCKED_BY_SOURCE_SEMANTICS` |
| nonResidentialPropertyType | Expert | `BLOCKED_BY_SOURCE_SEMANTICS` |
| statusBeyondActive | Expert | `BLOCKED_BY_SOURCE_SEMANTICS` |
| listingAgent/listingOffice | Expert | `BLOCKED_BY_RIGHTS_OR_AUDIENCE_POLICY` |
| garage/HOA/basement/style/condition/newConstruction/waterfront/zoning/county | Deferred | `BLOCKED_BY_FIELD_ABSENCE` |
| subjectPropertyIdentity | Deferred | `BLOCKED_BY_GRAIN_CONTRACT` |

## 18. Per-field Agent value classification

Very high: city, price bands, subject-property identity.

High: Residential property type, Active status, beds, baths, listed square feet, ZIP, neighborhood, subdivision, radius/polygon, status beyond Active, missing expected property criteria fields.

Medium: year built, school district, lot size, non-Residential property type, listing agent/office.

## 19. Quick vs Advanced vs Expert filter-tier recommendation

Quick Filters should stay limited to city, Residential, Active, and common price bands. Advanced Property Filters should add interval-safe beds, baths, listed square feet, year built, and ZIP after local admission. Expert MLS Filters should hold neighborhood, subdivision, school district, lot, map geometry, non-Residential property types, non-Active statuses, and office/agent fields until source semantics, rights, and methodology are certified.

## 20. Current interval semantics

Current Prisma predicates are inclusive: `gte` and `lte`. Adjacent ranges sharing an endpoint therefore overlap. For example, `500000-1000000` and `1000000-1500000` both include exactly `1000000`.

## 21. Explicit interval-contract recommendation

Admit explicit interval semantics before advanced segment expansion. Preserve the current inclusive behavior for manual Quick Filter inputs, but define generated adjacent comparison bands as half-open except the terminal band when needed. Every generated preset should declare whether it is inclusive, half-open, open-ended, or exact.

## 22. Adjacent-band policy

Generated adjacent bands must be disjoint by construction. Shared endpoints should use `[min,max)` for all non-terminal bands and `[min,max]` only where the terminal boundary must include the last value. UI/API labels must not imply disjointness unless the interval policy enforces it.

## 23. Numeric-filter interval applicability

The interval contract applies to price, bedrooms, bathrooms, listed square feet, year built, and any future numeric filters. It does not admit source fields that are absent, unnormalized, rights-restricted, or grain-incompatible.

## 24. Cohort-N runtime-contract findings

The Wave 3 engine can compare two to six cohorts. The current API parser and UI expose only A/B query prefixes and A/B controls. Cohort-N is therefore engine-ready but not product/API-ready.

## 25. Cohort-N orchestration findings

Cohort-N needs a request grammar, stable cohort IDs and colors, display order, readable labels, partial failure artifacts, and a ranking policy. It should not be bundled into the next Location/Buyer/Market reuse wave.

## 26. Multi-market readiness

Multi-market side-by-side comparison is ready after small local foundation for the six cohort-admitted cities. Expansion beyond Boulder, Louisville, Lafayette, Superior, Erie, and Longmont is not admitted even though IRES CityID evidence has observed high-priority values such as Broomfield, Westminster, Brighton, Denver, and Niwot. Those values remain source-geography observations, not ATLAS canonical city activation.

## 27. Multi-cohort failure-policy recommendation

Return valid cohort artifacts with explicit failed-cohort artifacts for no-data or calculation failure states, and suppress rank operations when required cohorts are incomplete. Rights failures should fail the affected comparison as rights-blocked.

## 28. Multi-cohort ranking recommendation

Ranking should be admitted only when every ranked cohort has the same metric, calculation version, grain, source scope, temporal basis, period form, audience, and comparable as-of posture. Ties must be deterministic and surfaced as ties, not arbitrary ordering.

## 29. Agent-labor replacement matrix

| Manual IRES work | ATLAS replacement | Readiness |
| --- | --- | --- |
| City-vs-city current market check | Current snapshot comparison in Location/Market Preparation | Ready after small local foundation |
| Buyer criteria segment comparison | Buyer criteria-to-cohort adapter plus current snapshot comparison | Ready after small local foundation |
| Price band comparison | Existing price filters plus interval contract | Ready after interval contract |
| Bedroom/bath/sqft/year segment check | Advanced interval filters plus existing admitted metrics | Ready after interval contract |
| Seller competing-listing context | Subject-property benchmark plus cohort comparison | Deferred |
| Listing launch competitive set | Subject-property benchmark plus listing lifecycle guard | Deferred |
| Neighborhood/subdivision report | Geographic/source semantics admission | Blocked |
| Historical trend/comparison | Historical observation and event-basis methodology | Blocked |

## 30. Product-value ranking

Highest value next: Location + Buyer + Market reuse with interval semantics. Next: Cohort-N API/UI. Then: ZIP and advanced numeric filters. Later: subject-property benchmark for Seller/Listing/Property. Blocked until separate authorization: historical metrics, sold metrics, DOM/CDOM, client/public exports, and source-geography expansion.

## 31. Subject-property benchmark readiness

Not ready. The current implementation compares cohorts of MLS listing observations. Subject-property benchmarking needs a separate contract that distinguishes a listing observation from a physical property and prevents silent conversion between grains.

## 32. Segmentation-vs-benchmark sequencing

Implement segmentation reuse and interval semantics before subject-property benchmark. That path expands value without crossing physical-property identity, CMA, pricing recommendation, or listing-launch boundaries.

## 33. Geography-expansion readiness

Not ready beyond the six admitted cohort cities. Location P0 admits only Boulder, Louisville, and Lafayette. IRES CityID evidence is useful source-geography evidence, but its own firewall blocks runtime ingestion, listing assignment, geographic object creation, search/map use, public display, coverage claims, and activation.

## 34. Source/rights findings

Current comparison output is Agent-only. Agent filter use does not imply public display, client reporting, export, or provider redistribution rights. Unresolved source-rights and public/client display gates remain hard blockers for broader reporting.

## 35. Combined next-wave feasibility

Feasible if bounded to Location Preparation, Buyer Preparation, Market Preparation, and interval semantics. Not recommended to combine Cohort-N UI/API or subject-property benchmark into that same wave.

## 36. Exact recommended next implementation package

`Agent Decision Comparison Reuse and Interval Semantics - Bounded Implementation Wave 4`

Gate: `READY_FOR_AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4`

## 37. Exact included scope

- Extract reusable current-snapshot comparison surface configuration from the Market Update implementation.
- Mount bounded comparison reuse in Location Preparation, Buyer Preparation, and Market Preparation.
- Add explicit interval semantics for numeric comparison presets while preserving current Quick Filter behavior.
- Keep Agent-only, read-only, current-snapshot, MLS-listing-grain boundaries.

## 38. Explicitly excluded scope

No Cohort-N UI/API runtime, Seller/Listing/Property benchmark, historical comparison, sold metrics, DOM/CDOM, recommendations, client/public output, PDF/export, provider writes, database/schema changes, Supabase/Typesense/CRM/email changes, secrets, or deployment.

## 39. Follow-on sequence

1. Wave 4: shared surface reuse plus interval semantics.
2. Wave 5: Cohort-N API/UI with deterministic partial-failure and ranking policy.
3. Wave 6: ZIP and advanced numeric filters.
4. Wave 7: subject-property benchmark admission.
5. Later: Seller/Listing/Property reuse after benchmark certification.

## 40. Checker/fixture results if created

Created deterministic checker: `scripts/checkAgentComparisonReuseSegmentExpansionAdmissionReview.ts`

Fixture coverage:

- Location reuse consumes existing comparison artifacts without Market Update semantics.
- Buyer reuse consumes existing comparison artifacts without recommendation semantics.
- Inclusive adjacent price bands are overlapping.
- Proposed half-open adjacent price bands are disjoint.
- Unbounded ranges classify deterministically.
- Admitted segmentation fields pass.
- Unadmitted fields fail closed.
- Filter-safe does not equal aggregation-admitted.
- Cohort-N can represent more than two cohorts at the engine contract level.
- Multi-cohort partial failure policy is deterministic.
- Agent filter use does not imply public display.
- Subject-property benchmark cannot silently convert MLS listing grain to physical-property grain.

## 41. Validation results

Validation commands for this package:

- `npm run check:current-snapshot-comparative-intelligence`
- `npm run check:comparative-intelligence-admission-review`
- `npm run check:atlas-cohort-comparative-contract`
- `npm run check:reusable-agent-cohort-builder`
- `npm run check:admitted-basic-aggregation`
- `npm run check:agent-comparison-reuse-segment-expansion-admission-review`
- `npm run typecheck`
- `git diff --check`

## 42. Certification/readiness state

`AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW_CERTIFIED`

## 43. Git state

This section must be completed with exact post-validation Git state at final report time.

## 44. Executive decisions required

Executive must authorize or decline Wave 4:

`READY_FOR_AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4`

Executive must separately decide whether Cohort-N UI/API should be scheduled as Wave 5, whether ZIP should enter the advanced filter foundation, and when to commission a subject-property benchmark admission package for Seller/Listing/Property reuse.
