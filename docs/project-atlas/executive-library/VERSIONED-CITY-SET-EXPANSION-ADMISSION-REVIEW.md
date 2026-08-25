# PROJECT ATLAS - Versioned City-Set Expansion Admission Review

Status: `VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CERTIFIED`

Review version: `VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_V1`

Recommended authority: `AGENT_ADMITTED_LISTING_CITY_SET_V1`

Selected next gate: `READY_FOR_VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9`

This review is an admission review only. It does not activate Denver, Broomfield, Westminster, Niwot, Brighton, Arvada, Aurora, or any other new city/place in runtime.

## 1. Workstream Identity

Workstream: Versioned City-Set Expansion Admission Review.

Certification target: `VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CERTIFIED`.

## 2. Executive Objective

Determine which additional municipalities or listing-location places can safely join the canonical Agent cohort city set, and define the versioned governance architecture required to prevent scattered hard-coded city allowlists.

## 3. Governing Certifications / Contracts

- `AGENT_ADMITTED_FILTER_REGISTRY_V1`
- `LISTING_POSTAL_CODE_FILTER_V1`
- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`
- `AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4_CERTIFIED`
- `COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED`
- `CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED`
- `ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`
- `ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CERTIFIED`
- `IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED`
- Existing governed geography, source-quality, and source-rights governance.

## 4. Starting Repository Truth

- Branch: `main`
- HEAD: `3ee46a58b4932ca535d616e1cd901b68cef7c43d`
- origin/main: `3ee46a58b4932ca535d616e1cd901b68cef7c43d`
- Divergence: `0 behind / 0 ahead`
- Working tree: clean
- `git diff --check`: PASS

## 5. Wave 8 Baseline

Wave 8 certified ZIP as an Agent-only listing postal attribute filter. ZIP requires one admitted city, supports single and multi-select values, preserves leading-zero string semantics, normalizes ZIP+4 to base five digits, and does not create geography, ZIP-only cohorts, map/polygon behavior, public output, CMA, valuation, or recommendations.

## 6. Current Six-City Baseline

The current admitted Agent cohort city set is exactly Boulder, Louisville, Lafayette, Superior, Erie, and Longmont. These remain certified and unchanged.

## 7. Current City-Set Implementation / Allowlist Audit

Current runtime admission is implemented in `lib/agentCohortBuilder.ts` as `AGENT_COHORT_SUPPORTED_CITIES`. Current market normalization separately defines the same six labels in `lib/currentMarketComputation.ts` as `CURRENT_MARKET_SUPPORTED_CITIES`. Agent UI surfaces import the cohort-builder city list directly. This is operationally coherent today but not a canonical versioned authority.

## 8. Duplicated City-Logic Findings

Duplicated city logic exists across cohort validation, current market computation, comparison surfaces, Current Competing Listing Context, and ZIP scope enforcement. Wave 8 ZIP validation depends on the cohort builder's admitted-city normalization rather than a reusable city-set authority. Future expansion should replace duplicated allowlists with one versioned authority while allowing surface-specific subsets.

## 9. Property.city Semantic Finding

Property.city is a required listing-location city label populated from source listing fields. It is sufficient for Agent MLS_LISTING-grain cohort filtering, but it is not by itself a canonical municipality, county, postal city, polygon membership, assessor jurisdiction, neighborhood, subdivision, MLS area, or public-record identity.

## 10. Property.city Data Type / Nullability

`Property.city` is `String` and required in `prisma/schema.prisma`. It is indexed. Repository-local coverage measured 75,490 populated rows out of 75,490 total rows.

## 11. Source Field / Mapping

The MLS upsert path maps `Property.city` from `City` or `city` in `lib/mls/upsertListing.ts`. The mapping trims and whitespace-normalizes labels. No IRES CityID is persisted into `Property.city`, and no numeric CityID inference is authorized.

## 12. Address Role

`Property.city` is part of the current listing property location address at MLS_LISTING grain. It should be used as a listing filter, not as a parcel, assessor, or municipal boundary authority.

## 13. Normalization Findings

Current runtime city normalization trims, collapses whitespace, and lowercases for matching against admitted labels. It does not admit aliases such as `City of Broomfield`; unknown aliases fail closed.

## 14. Label-Variant Findings

Repository-local review observed one dominant exact label for each reviewed city: Boulder, Louisville, Lafayette, Superior, Erie, Longmont, Denver, Broomfield, Westminster, Niwot, Brighton, Arvada, and Aurora. No case/punctuation variants were observed in the measured candidate set.

## 15. Analytical Grain

City filtering remains `MLS_LISTING` grain.

## 16. Source Scope

Source scope remains `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`.

## 17. Rights Posture

Agent-only internal filtering and comparison are compatible with the current listing projection. Public, client-private, export/PDF, source activation, provider expansion, and customer-visible geography claims remain blocked.

## 18-24. Current Six-City Baselines

| City | IRES CityID evidence | Total rows | Active rows | Active Residential | Distinct ZIPs | Top ZIPs | State |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Boulder | 9 | 1,266 | 387 | 353 | 5 | 80304:96; 80302:89; 80301:74; 80303:63; 80305:31 | `CURRENTLY_ADMITTED` |
| Louisville | 61 | 227 | 48 | 46 | 1 | 80027:46 | `CURRENTLY_ADMITTED` |
| Lafayette | 53 | 417 | 59 | 54 | 1 | 80026:54 | `CURRENTLY_ADMITTED` |
| Superior | 93 | 184 | 44 | 43 | 1 | 80027:43 | `CURRENTLY_ADMITTED` |
| Erie | 24 | 1,134 | 132 | 129 | 2 | 80516:126; 80026:3 | `CURRENTLY_ADMITTED` |
| Longmont | 60 | 1,226 | 271 | 248 | 3 | 80504:103; 80501:74; 80503:71 | `CURRENTLY_ADMITTED` |

## 25. Current Six-City ZIP Compatibility

All six have populated ZIP values for Active Residential rows and remain compatible with Wave 8 ZIP filtering.

## 26. Current Six-City Comparison Readiness

All six remain ready for current-snapshot comparison and Cohort-N under existing certified semantics.

## 27-49. Candidate Evidence and Admission Matrix

| City/place | Semantic type | IRES CityID evidence | Total rows | Active Residential | Distinct ZIPs | Top ZIPs | Admission state | Key boundary |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| Denver | `CITY_AND_COUNTY` | 19 | 11,134 | 2,013 | 39 | 80211:151; 80210:111; 80220:101; 80202:99; 80204:96; 80205:88 | `READY_FOR_WAVE_9_RUNTIME_ADMISSION` | Listing-city filtering only; no city/county geography object activation. |
| Broomfield | `CITY_AND_COUNTY` | 12 | 1,505 | 223 | 3 | 80020:92; 80023:92; 80021:39 | `READY_FOR_WAVE_9_RUNTIME_ADMISSION` | City/county and assessor identity remain separate. |
| Westminster | `LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY` | 101 | 1,255 | 172 | 6 | 80031:104; 80030:25; 80021:18; 80234:16; 80020:7; 80023:2 | `READY_FOR_WAVE_9_RUNTIME_ADMISSION` | Cross-county status does not block listing-city filtering; no one-county claim. |
| Niwot | `UNINCORPORATED_COMMUNITY` | 70 | 67 | 20 | 1 | 80503:20 | `BLOCKED_BY_PLACE_IDENTITY` | Niwot is not certified as an incorporated municipality; governed place identity remains unresolved. |
| Brighton | `MUNICIPALITY` | 11 | 1,333 | 211 | 3 | 80601:129; 80602:53; 80603:29 | `READY_FOR_WAVE_9_RUNTIME_ADMISSION` | Listing-city filtering only; no county/subdivision/public-record activation. |
| Arvada | `MUNICIPALITY` | 3 | 2,578 | 287 | 5 | 80007:72; 80003:65; 80004:59; 80005:58; 80002:33 | `READY_FOR_WAVE_9_RUNTIME_ADMISSION` | Bounded high-value adjacent Front Range candidate. |
| Aurora | `LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY` | 108 | 7,451 | 981 | 11 | 80016:159; 80019:142; 80013:126; 80014:116; 80018:113; 80015:85 | `DEFERRED_NOT_WAVE_9_PRIORITY` | Strong data, but deferred to keep first implementation wave bounded. |

Source distribution for each reviewed Active Residential group was `IRE` by MLS ID prefix. This supports source-scope continuity but does not by itself create admission: `DATA_EXISTS_DOES_NOT_EQUAL_CITY_ADMITTED`.

## 50. Recommended Authority Name

Use `AGENT_ADMITTED_LISTING_CITY_SET_V1`.

## 51. Authority Semantic Scope

The authority governs listing-location city labels for Agent MLS_LISTING-grain cohort filtering. It must not be named municipality-only because Niwot and cross-county listing places require truthful semantic typing.

## 52. Versioning Policy

Each authority version records its active labels, candidates, blocked entries, semantic types, source scope, rights, and limitations.

## 53. Admission Key Policy

Use lower-case stable keys derived from exact display labels unless a separately reviewed alias policy is introduced.

## 54. Display-Label Policy

Use the exact repository/source label as display label.

## 55. Query-Value / Normalization Policy

Trim, collapse whitespace, lower-case for matching, and query the exact canonical `Property.city` label with insensitive equality. Unknown aliases fail closed.

## 56. Place/City Semantic-Type Policy

Supported types should include `MUNICIPALITY`, `CITY_AND_COUNTY`, `LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY`, and `UNINCORPORATED_COMMUNITY`.

## 57. Version-Introduced Policy

Existing six cities use `CURRENT_SIX_CITY_BASELINE`; approved additions use the implementation wave version; candidates and blocked entries use `NOT_INTRODUCED`.

## 58. Active / Candidate / Blocked State Policy

Runtime should consume only `ACTIVE`/admitted entries. Candidate metadata must not activate runtime.

## 59. Analytical-Grain Policy

All entries in this authority are `MLS_LISTING` grain.

## 60. Source-Scope Policy

All reviewed ready entries remain inside `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`.

## 61. Rights Policy

Agent-only filtering and internal analysis are permitted; public/client/export use remains blocked.

## 62. ZIP-Compatibility Policy

ZIP remains a listing postal attribute. City + ZIP remains logical intersection. ZIP must derive its admitted-city check from the future authority and must not infer city identity.

## 63. Surface-Availability Policy

Shared cohort, comparison, Cohort-N, Current Competing Listing Context, Property Preparation, Buyer Preparation, and Market Preparation may consume the expanded Agent city set after Wave 9. Location Preparation remains a narrower independently governed subset until separately approved.

## 64. Comparison-Availability Policy

City differences preserve metric semantics. Comparison remains current snapshot, Agent-only, no ranking of cities by desirability.

## 65. Governed-Geography Relationship Policy

Listing city admission does not create municipality, county, polygon, assessor, subdivision, neighborhood, or public-record relationships.

## 66. IRES CityID Relationship Policy

IRES CityID evidence supports source-specific reconciliation only. It remains `NOT_RECONCILED` to ATLAS geography and `NOT_AUTHORIZED` for activation.

## 67. Existing Six-City Migration Plan

Move Boulder, Louisville, Lafayette, Superior, Erie, and Longmont into `AGENT_ADMITTED_LISTING_CITY_SET_V1` as active entries without changing keys, display labels, query values, ZIP behavior, or comparison semantics.

## 68. Single-Authority Migration Plan

Replace direct six-city arrays in cohort validation and current market normalization with the shared authority. Surface subsets should derive from authority metadata instead of redefining identity.

## 69. Surface-Specific Subset Policy

Global Agent cohort city admission does not automatically admit a city to Location Preparation or any public/customer-facing surface.

## 70. Cohort Reproducibility / Version Policy

Future cohort artifacts should record the authority version in limitations or metadata. Direct cohort identity churn is not required for the current implementation if version metadata is persisted in the normalized artifact.

## 71-80. ZIP / Comparison Deliverables

ZIP city-scope integration should consult `AGENT_ADMITTED_LISTING_CITY_SET_V1`. Future ZIP options can be derived from selected admitted city plus current repository projection, not a hand-maintained city-to-ZIP ontology. Current-snapshot comparison, admitted aggregation, Cohort-N, and Current Competing Listing Context are ready after the shared city authority is implemented. The Cohort-N 2-6 cohort limit must remain unchanged.

## 81-87. Agent Surface Deliverables

Shared cohort engine: ready for Wave 9.

Current Competing Listing Context: ready for Wave 9 after consuming the shared authority.

Property Preparation: ready for Agent-only subject/city filtering; no public output.

Buyer Preparation: ready to consume city selection as neutral criteria; no suitability or steering.

Market Preparation: ready for dated current-snapshot context; no public market report activation.

Location Preparation: not globally ready for all new cities; requires surface-specific subset approval and content/product foundation.

## 88-95. Rights / Governance Deliverables

Agent filter rights and Agent display rights are sufficient for internal preparation. Client-private rights, public rights, and export/PDF rights remain blocked. Fair-housing guard: city filtering/comparison cannot create demographic, steering, desirability, safety, school-quality, socioeconomic, investment, forecast, or recommendation claims. Source-quality and source-rights limitations remain attached to any future public/source expansion.

## 96. Exact Ready City Set

Ready for Wave 9 runtime admission: Denver, Broomfield, Westminster, Brighton, and Arvada.

## 97. Exact Deferred City Set

Deferred from Wave 9 priority: Aurora.

## 98. Exact Blocked City Set

Blocked by place identity: Niwot.

## 99. Exact New-City Activation Recommendation

Authorize a bounded Wave 9 implementation for Denver, Broomfield, Westminster, Brighton, and Arvada only, after implementing `AGENT_ADMITTED_LISTING_CITY_SET_V1`.

## 100. Exact Versioned Authority Implementation Scope

Create the canonical authority in shared library code, migrate the six current city entries, mark Wave 9 ready additions as active only in that implementation package, and keep non-active metadata inert.

## 101-108. Exact Shared File / System Scope

Expected scope: `lib/agentCohortBuilder.ts`, `lib/currentMarketComputation.ts`, `lib/agentCurrentSnapshotComparisonSurfaceConfig.ts`, Agent UI components that read city options, ZIP validation integration, Current Competing Listing Context integration, Buyer/Market surface adapters, deterministic checker, package script, and certification document. Excluded: schema, provider, MLS/IRES calls, source activation, public/client/export activation, Location Preparation expansion beyond explicit subset.

## 109. Expected Runtime Proofs

Prove current six cities still pass; Denver/Broomfield/Westminster/Brighton/Arvada pass only after Wave 9; Niwot and Aurora remain inactive; ZIP requires admitted city; city + ZIP composes as intersection; Cohort-N still enforces 2-6 cohorts; no public/export behavior appears.

## 110. Expected Regression Plan

Run Wave 8 ZIP, ZIP foundation, Wave 7, advanced geography admission, Current Competing Listing Context, Cohort-N, current snapshot comparison, cohort contract, reusable cohort builder, canonical physical property identity, IRES CityID, governed geography, source-rights, source-quality, map/search, property preparation, location preparation, market preparation, buyer preparation, typecheck, and `git diff --check`.

## 111. Expected Certification Target

`VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9_CERTIFIED`.

## 112. One Primary Next Gate

`READY_FOR_VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9`.

## 113. Why It Ranks First

The architecture now has enough evidence to admit priority listing-city labels, but doing so by editing scattered allowlists would create drift. The versioned authority must be implemented first and used as the sole runtime source.

## 114. Follow-On Sequence

After Wave 9: targeted historical/event evidence admission, expert/MLS filter admission, governed subdivision/neighborhood admission, subject-property benchmark foundation.

## 115. Secondary Parallel Recommendation

`TARGETED_HISTORICAL_EVENT_EVIDENCE_READINESS_RED_TEAM` is suitable for a separate read-only inert Secondary package if it does not modify shared runtime files or depend on Wave 9 merges.

## 116. Executive Decisions Required

Approve or reject Wave 9 scope: `AGENT_ADMITTED_LISTING_CITY_SET_V1` plus Denver, Broomfield, Westminster, Brighton, and Arvada. Decide separately whether Aurora should be moved into Wave 9 or left for a later larger-city expansion. Niwot requires governed place identity reconciliation before admission.

## 117. Final Certification / Readiness State

`VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CERTIFIED`.

## 118. Git / Commit / Push State

To be completed by the final execution report after commit and push.

## Protected-System Final Confirmation

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
