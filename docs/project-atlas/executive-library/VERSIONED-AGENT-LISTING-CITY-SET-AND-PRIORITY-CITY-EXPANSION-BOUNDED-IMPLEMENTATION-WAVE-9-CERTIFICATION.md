# VERSIONED AGENT LISTING-CITY SET AND PRIORITY CITY EXPANSION - BOUNDED IMPLEMENTATION WAVE 9 CERTIFICATION

1. WORKSTREAM IDENTITY: Versioned Agent Listing City Set and Priority City Expansion, bounded implementation Wave 9.
2. EXECUTIVE OBJECTIVE: Replace duplicated shared Agent listing-city allowlists with a canonical versioned runtime authority and activate only Denver, Broomfield, Westminster, Brighton, and Arvada in addition to the existing six.
3. GOVERNING CERTIFICATIONS / CONTRACTS: Versioned City Set Expansion Admission Review, ZIP Postal Listing Filter Wave 8, Admitted Filter Registry Wave 7, Current Competing Listing Context Wave 6, Cohort-N Wave 5, Current Snapshot Comparison Wave 3, Admitted Basic Aggregation Wave 2, Reusable Agent Cohort Builder Wave 1, Atlas Cohort Contract.
4. STARTING REPOSITORY TRUTH: implementation started from `9f3e6c4e009899977c42647c8c13f844c7f8bbb2` on `main`, equal to `origin/main`, divergence `0/0`, clean worktree.
5. VERSIONED CITY-SET ADMISSION BASELINE: prior six active cities were Boulder, Louisville, Lafayette, Superior, Erie, and Longmont; admission review approved Denver, Broomfield, Westminster, Brighton, and Arvada for Wave 9 runtime admission.
6. CITY-SET REPOSITORY RECONCILIATION: shared Agent cohort and current-market city admission now reconcile to one authority, while reviewed non-active cities remain represented as non-active states.
7. DUPLICATED CITY-AUTHORITY FINDINGS: `lib/agentCohortBuilder.ts` and `lib/currentMarketComputation.ts` had separate shared city lists; both now derive from the canonical authority.
8. CANONICAL RUNTIME AUTHORITY: `AGENT_ADMITTED_LISTING_CITY_SET` in `lib/agentAdmittedListingCitySet.ts`.
9. AUTHORITY VERSION: `AGENT_ADMITTED_LISTING_CITY_SET_V1`.
10. AUTHORITY SEMANTIC SCOPE: listing-city label admission for Agent-only current MLS listing-record analytical preparation, not canonical jurisdiction or geography-object activation.
11. AUTHORITY METADATA MODEL: entries declare key, display/query label, source geography id where active, semantic type, runtime state, version introduced, grain, source scope, Agent-only rights, ZIP compatibility, comparison compatibility, surface availability, and limitations.
12. ACTIVE / DEFERRED / BLOCKED / UNKNOWN STATE POLICY: only `ACTIVE` enters shared cohort queries; `DEFERRED`, `BLOCKED`, and unknown values fail closed with deterministic reasons.
13. NORMALIZATION POLICY: trim, whitespace collapse, case normalization, and canonical id/label matching only; no speculative aliases.
14. ANALYTICAL-GRAIN POLICY: authority is limited to `MLS_LISTING`.
15. SOURCE-SCOPE POLICY: authority is limited to `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`.
16. RIGHTS POLICY: authority is `AGENT_ONLY`; public display, client report, export, CMA, valuation, and recommendation uses remain excluded.
17. VERSION / PROVENANCE POLICY: normalized cohorts now expose `citySetAuthority = AGENT_ADMITTED_LISTING_CITY_SET_V1`; future membership changes require governed contract evolution.
18. BOULDER MIGRATION: active via authority, version introduced `CURRENT_SIX_CITY_BASELINE`.
19. LOUISVILLE MIGRATION: active via authority, version introduced `CURRENT_SIX_CITY_BASELINE`.
20. LAFAYETTE MIGRATION: active via authority, version introduced `CURRENT_SIX_CITY_BASELINE`.
21. SUPERIOR MIGRATION: active via authority, version introduced `CURRENT_SIX_CITY_BASELINE`.
22. ERIE MIGRATION: active via authority with cross-county listing-label limitation.
23. LONGMONT MIGRATION: active via authority with cross-county listing-label limitation.
24. SIX-CITY BACKWARD-COMPATIBILITY RESULT: prior six remain active and preserve existing labels/order.
25. EXISTING COHORT-IDENTITY IMPACT: existing normalized filter serialization remains stable for unchanged cohorts; added `citySetAuthority` is additive provenance.
26. EXISTING ZIP-COMPATIBILITY RESULT: existing six-city ZIP behavior remains compatible.
27. EXISTING COMPARISON RESULT: existing comparison surfaces continue passing deterministic checks.
28. DENVER ACTIVATION: active in shared Agent listing-city authority.
29. DENVER RUNTIME EVIDENCE: deterministic check proves Denver normalizes, builds city/ZIP query predicates, and is eligible for shared cohort and competing-context derivation.
30. BROOMFIELD ACTIVATION: active in shared Agent listing-city authority.
31. BROOMFIELD CITY/COUNTY LIMITATION: represented as `CITY_AND_COUNTY`; no county-boundary or jurisdiction analytics are admitted.
32. BROOMFIELD RUNTIME EVIDENCE: deterministic check proves Broomfield normalizes, builds city/ZIP query predicates, and remains Agent-only.
33. WESTMINSTER ACTIVATION: active in shared Agent listing-city authority.
34. WESTMINSTER CROSS-COUNTY LIMITATION: represented as a listing city label with cross-county geography limitation; no county equivalence is admitted.
35. WESTMINSTER RUNTIME EVIDENCE: deterministic check proves Westminster normalizes and accepts ZIP `80031`.
36. BRIGHTON ACTIVATION: active in shared Agent listing-city authority.
37. BRIGHTON RUNTIME EVIDENCE: deterministic check proves Brighton normalizes and accepts ZIP `80601`.
38. ARVADA ACTIVATION: active in shared Agent listing-city authority.
39. ARVADA RUNTIME EVIDENCE: deterministic check proves Arvada normalizes and accepts ZIP `80007`.
40. AURORA DEFERRED RESULT: Aurora is present as `DEFERRED` and not active.
41. NIWOT BLOCKED RESULT: Niwot is present as `BLOCKED` for unincorporated/community-place governance and not active.
Aurora: DEFERRED / NOT ACTIVE.
Niwot: BLOCKED / NOT ACTIVE.
42. UNKNOWN-CITY FAIL-CLOSED RESULT: unknown city values fail with `CITY_NOT_ADMITTED`.
43. DATA-EXISTS-VS-ADMISSION PROOF: authority membership, not repository row existence, controls runtime admission.
44. CITY FILTER REGISTRY INTEGRATION: `AGENT_ADMITTED_FILTER_REGISTRY.city.valueAuthority` points to `AGENT_ADMITTED_LISTING_CITY_SET_V1`.
45. SINGLE-AUTHORITY MIGRATION: shared runtime city validation now uses `getActiveAgentListingCity`.
46. LEGACY SHARED ALLOWLIST DISPOSITION: old cohort-builder list is now a compatibility export from authority; current-market list is derived from authority.
47. SURFACE-SPECIFIC SUBSET POLICY: surface subsets remain allowed and must not be deleted merely because the global authority exists.
48. ZIP CITY-SCOPE INTEGRATION: ZIP remains a listing postal-code predicate and still requires one active admitted city.
49. ZIP + EXISTING SIX-CITY REGRESSION: Wave 8 ZIP checker passes after fixture update from Denver to Aurora as the non-active city.
50. ZIP + NEW-CITY RESULT: Denver, Broomfield, Westminster, Brighton, and Arvada each accept representative ZIP filters in deterministic checks.
51. AURORA + ZIP FAIL-CLOSED RESULT: Aurora plus ZIP fails closed with city-deferred and active-city-required reasons.
52. NIWOT + ZIP FAIL-CLOSED RESULT: Niwot plus ZIP fails closed with city-blocked and active-city-required reasons.
53. ZIP-ONLY FAIL-CLOSED RESULT: ZIP-only cohort still fails with `ZIP_REQUIRES_ADMITTED_CITY`.
54. PRIORITY 1 FILTER COMPOSITION: new active city plus ZIP composes with existing Priority 1 property segmentation filters through the same normalized cohort path.
55. SHARED QUERY / COUNT INTEGRATION: `buildAgentCohortPrismaWhere` resolves active city labels from the authority.
56. EXISTING AGGREGATION COMPATIBILITY: admitted basic aggregation regression passes.
57. CURRENT-SNAPSHOT COMPARISON COMPATIBILITY: current-snapshot comparison regression passes.
58. CITY-COMPARISON LANGUAGE BOUNDARY: city comparison remains listing-record analytical preparation, not city ranking or location advice.
59. CITY-RANKING BOUNDARY: no recommendation, ranking, valuation, or CMA logic is introduced.
60. COHORT-N INTEGRATION: Cohort-N parser accepts active authority city ids.
61. COHORT-N 2-6 LIMIT PRESERVATION: existing Cohort-N limit behavior remains preserved; seven-cohort requests remain rejected by comparison runtime.
62. COHORT-N DEFERRED / BLOCKED CITY BEHAVIOR: deferred/blocked cities invalidate their cohort and do not enter comparison.
63. NEW-CITY SUBJECT ELIGIBILITY: active new city subject listing labels can derive shared competing cohorts.
64. DEFAULT COMPETING-COHORT BEHAVIOR: default competing cohort uses the subject's active listing city and existing property/status constraints.
65. SUBJECT ZIP BEHAVIOR: subject ZIP remains optional refinement and remains listing-level postal code, not geography identity.
66. SUBJECT EXCLUSION REGRESSION: current competing listing context regression passes.
67. BROOMFIELD SUBJECT GRAIN / COUNTY BOUNDARY: Broomfield subject use remains `MLS_LISTING` grain and does not admit county-boundary semantics.
68. WESTMINSTER SUBJECT GRAIN / COUNTY BOUNDARY: Westminster subject use remains listing-city label scope and does not admit county-boundary semantics.
69. GLOBAL SHARED COHORT CITY SET: active shared set is Boulder, Louisville, Lafayette, Superior, Erie, Longmont, Denver, Broomfield, Westminster, Brighton, Arvada.
70. PROPERTY PREPARATION CITY SET: shared Agent city selector consumes the expanded active set where it imports `AGENT_COHORT_SUPPORTED_CITIES`.
71. CURRENT COMPETING LISTING CONTEXT CITY SET: selector and derivation consume the expanded active set.
72. BUYER PREPARATION CITY SET: shared comparison controls consume the expanded active set except surface-specific restrictions.
73. MARKET PREPARATION CITY SET: current-market computation derives from the expanded active authority.
74. LOCATION PREPARATION CITY SET: remains Boulder, Louisville, Lafayette only.
75. COHORT-N CITY SET: uses the expanded active authority through cohort normalization.
76. ZIP-SURFACE CITY SET: ZIP scope follows active admitted listing cities only.
77. SURFACE-SPECIFIC SUBSET RESULT: Location Preparation subset is preserved via `AGENT_LOCATION_PREPARATION_CITY_KEYS`.
78. UI ORDERING POLICY: order preserves the prior six first, then Denver, Broomfield, Westminster, Brighton, Arvada.
79. UI DISPLAY-LABEL POLICY: display labels are canonical authority labels.
80. AURORA UI RESULT: Aurora is not in active selector options.
81. NIWOT UI RESULT: Niwot is not in active selector options.
82. WAVE 9 CHECKER RESULT: `npm run check:versioned-agent-listing-city-set-wave-9` passes.
83. RUNTIME EXAMPLE A - DENVER: normalization ready; DB read path returned unavailable due local Prisma initialization, not city rejection.
84. RUNTIME EXAMPLE B - BROOMFIELD: normalization ready; DB read path returned unavailable due local Prisma initialization, not city rejection.
85. RUNTIME EXAMPLE C - WESTMINSTER: normalization ready; DB read path returned unavailable due local Prisma initialization, not city rejection.
86. RUNTIME EXAMPLE D - BRIGHTON: normalization ready; DB read path returned unavailable due local Prisma initialization, not city rejection.
87. RUNTIME EXAMPLE E - ARVADA: normalization ready; DB read path returned unavailable due local Prisma initialization, not city rejection.
88. RUNTIME EXAMPLE F - EXISTING SIX-CITY REGRESSION: existing six deterministic regressions pass.
89. RUNTIME EXAMPLE G - AURORA: normalization fails closed with `CITY_DEFERRED`.
90. RUNTIME EXAMPLE H - NIWOT: normalization fails closed with `CITY_BLOCKED`.
91. RUNTIME EXAMPLE I - UNKNOWN CITY: normalization fails closed with `CITY_NOT_ADMITTED`.
92. RUNTIME EXAMPLE J - NEW CITY + ZIP + PRIORITY 1: checker verifies new city plus representative ZIP predicate; Priority 1 composition regression remains passing.
93. RUNTIME EXAMPLE K - COHORT-N CROSS-CITY: parser admits active cross-city Cohort-N input; runtime comparison still enforces the existing maximum.
94. RUNTIME EXAMPLE L - CURRENT COMPETING LISTING CONTEXT: Denver subject derives `denver` default competing city and validates ready.
95. PERFORMANCE / BOUNDEDNESS FINDINGS: authority lookup is in-memory over a finite registry; no provider calls, persistence, search indexing, or external reads were added.
96. HUMAN UX / PRODUCT REVIEW: active city selectors inherit expanded labels; Location Preparation intentionally remains restricted.
97. REGRESSION RESULTS: Wave 9, admission review, Wave 8 ZIP, Wave 7 filter registry, Wave 6 competing context, Wave 5 Cohort-N, Wave 4 interval semantics, Wave 3 current snapshot, Wave 2 aggregation, Wave 1 builder, Atlas contract, Buyer, Market, Location, Property, source-rights, source-quality, IRES CityID, geography governance, map safety, current market, and internal market read checks passed.
98. TYPECHECK: `npm run typecheck` passed.
99. BUILD: `npm run build` passed with pre-existing unused-variable lint warnings.
100. GIT DIFF CHECK: `git diff --check` passed before commit; final `git diff --check HEAD` passed.
101. CAPABILITIES CERTIFIED: canonical versioned listing-city authority, expanded active shared city set, deferred/blocked non-admission states, ZIP integration, comparison reuse, current-market derivation, and surface subset preservation.
102. CAPABILITIES DELIBERATELY EXCLUDED: provider/MLS mutation, Supabase mutation, schema/database mutation, deployment, public/client/export activation, CMA, valuation, recommendation, sold comparable methodology, historical/event analytics, neighborhood/subdivision identity, polygon/radius filtering.
103. HISTORICAL-EVIDENCE READINESS: now ranks first because broader current segmentation makes time/history the dominant remaining analytical limitation.
104. EXPERT / MLS FILTER READINESS: useful but secondary; source-specific semantics still need admission review.
105. SUBDIVISION / NEIGHBORHOOD READINESS: still blocked by identity and governed-place semantics; do not equate MLS subdivision, ATLAS neighborhood, ZIP, and listing city.
106. SUBJECT-BENCHMARK READINESS: still blocked by physical-property identity, historical/sold evidence, benchmark-selection methodology, rights, Agent judgment, and CMA/valuation boundary.
107. AURORA FOLLOW-ON READINESS: deferred; exact follow-on prerequisite is separate admission review after priority scope, not Wave 9 activation.
108. NIWOT / GOVERNED-PLACE FOLLOW-ON READINESS: should proceed through governed place/community identity architecture rather than forced listing-city admission.
109. ONE PRIMARY NEXT GATE: `READY_FOR_HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW` - Targeted Historical / Event Evidence Admission Review.
110. WHY IT RANKS FIRST: after Wave 9, city/ZIP current-snapshot segmentation is materially broader; recurring Agent reporting gaps now concentrate on temporal evidence such as 2025 vs 2026, YTD, MoM, QoQ, YoY, active inventory history, new-listing events, pending events, closed-sale activity, price changes, DOM/CDOM, and SP/LP.
111. FOLLOW-ON SEQUENCE: historical/event evidence first, then expert/MLS filter admission, then subdivision/neighborhood or governed-place identity, then subject benchmark foundation when evidence and methodology are ready.
112. SECONDARY PARALLEL RECOMMENDATION: if Primary starts historical/event evidence, Secondary should run collision-safe read-only expert/MLS filter readiness or subdivision/neighborhood identity red-team, not duplicate history.
113. PROTECTED-SYSTEM CONFIRMATION: no infrastructure, provider, MLS, database, schema, Supabase, secret, CRM, Search index, customer-data, authorization, deployment, or public activation changes were made.
DATABASE MUTATION: NONE.
DEPLOYMENT: NONE.
114. CERTIFICATION STATE: `VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9_CERTIFIED`.
115. GIT / COMMIT / PUSH STATE: final commit is recorded in Git; verify with final repository status.
116. EXECUTIVE DECISIONS REQUIRED: approve or reject the recommended next primary gate, decide whether Secondary should red-team expert/MLS filters or smaller-area geography, and separately verify Vercel production deployment readiness if desired.
