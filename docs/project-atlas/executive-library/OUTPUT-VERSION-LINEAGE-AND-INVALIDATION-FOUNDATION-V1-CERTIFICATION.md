# PROJECT ATLAS - Output Version, Lineage, and Invalidation Foundation V1 Certification

## A. Executive Result

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1` implements the first shared, domain-only foundation for output versions, lineage, evidence snapshots, dependencies, invalidation, diffs, reuse rules, and Agent-visible version history.

Certification status:

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_WITH_HOLDS`

Product status:

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_DOMAIN_ONLY_PRINT_PDF_PERSISTENCE_DELIVERY_HELD`

Persistence position:

`DOMAIN_ONLY_SUFFICIENT_FOR_CURRENT_PHASE`

## B. Starting Repository State

Expected certified starting commit:

`a68eef0b160c5024d06c67c84165f2444479131a`

Verified starting gate:

| Gate | Result |
|------|--------|
| Branch | `main` |
| HEAD | `a68eef0b160c5024d06c67c84165f2444479131a` |
| Origin/main | `a68eef0b160c5024d06c67c84165f2444479131a` |
| Divergence | `0 ahead / 0 behind` |
| Worktree | Clean |
| `git diff --check` | PASS |

## C. Current Versioning Reconciliation

| Existing Concept | Shared Version Treatment |
|------------------|--------------------------|
| Product version | Output version content reference |
| Contract version | Output contract version |
| Packet version | Preparation/intelligence reference |
| Composition ID | Composition version / fingerprint input |
| Content version | Output content version |
| Narrative version | Narrative reference |
| Recommendation version | Recommendation reference |
| Cohort version | Source snapshot / dependency version |
| Competition version | Source snapshot / dependency version |
| Pricing scenario version | Pricing reference |
| Search-band version | Pricing dependency reference |
| Financial link version | Financial reference |
| Post-launch review version | Post-launch reference |
| Checkpoint version | Post-launch lineage reference |
| Seller decision version | Seller/client decision reference |
| Evidence ID / version | Output evidence snapshot reference |
| As-of / freshness | Source snapshot and freshness reference |

## D. Output Version Contract

`AtlasOutputVersion` supports machine-stable output version ID, output product ID, product kind, contract version, display version, audience, subject, purpose, created/updated/effective dates, lifecycle state, review state, template/content/composition/presentation versions, parent/prior/derived/revised/refreshed/recomposed/supersession references, preparation/intelligence/analysis/narrative/recommendation/pricing/financial/post-launch/decision/evidence/dependency/rights/freshness references, Agent authorship, and content fingerprint.

## E. Required Output Version Table

| Output Version | Product | State | Parent / Prior | Evidence Snapshot | Pricing | Decision | Current? |
|----------------|---------|-------|----------------|-------------------|---------|----------|----------|
| seller-decision-brief-v1-reviewed | Seller Presentation | ARCHIVED_HISTORICAL_REFERENCE | none | evidence-snapshot-seller-v1 | none | none | No |
| seller-decision-brief-v2-reviewed | Seller Presentation | AGENT_REVIEWED | seller-decision-brief-v1-reviewed | evidence-snapshot-seller-v2 | seller-pricing-framework | seller-pricing-decision-v1-fixture | No |
| seller-pricing-version-reviewed | Seller Presentation | AGENT_REVIEWED | seller-decision-brief-v2-reviewed | evidence-snapshot-pricing-v1 | SELLER_PRICING_SCENARIO_V1 | seller-pricing-decision-v1-fixture | No |
| seller-launch-context-version | Seller Presentation | SELLER_REVIEWED_OR_PRESENTED | seller-pricing-version-reviewed | evidence-snapshot-launch-v1 | SELLER_PRICING_SCENARIO_V1 | seller-pricing-decision-v1-fixture | No |
| seller-post-launch-review-current | Seller Presentation | AGENT_REVIEW_REQUIRED | seller-launch-context-version | evidence-snapshot-post-launch-v1 | SELLER_PRICING_SCENARIO_V1 | post-launch-decision-v1-fixture | No |
| seller-update-superseded-version | Seller Update | SUPERSEDED | seller-post-launch-review-current | evidence-snapshot-seller-update-prior | SELLER_PRICING_SCENARIO_V1 | post-launch-decision-v1-fixture | No |
| seller-update-current-version | Seller Update | READY_FOR_SELLER_REVIEW | seller-update-superseded-version | evidence-snapshot-seller-update-current | SELLER_PRICING_SCENARIO_V1 | post-launch-decision-v1-fixture | Yes |
| seller-update-invalidated-version | Seller Update | INVALIDATED | seller-update-current-version | evidence-snapshot-seller-update-invalidated | SELLER_PRICING_SCENARIO_V1 | post-launch-decision-v1-fixture | No |
| seller-update-draft-successor | Seller Update | DRAFT | seller-update-current-version | evidence-snapshot-seller-update-successor | SELLER_PRICING_SCENARIO_V1 | next-seller-decision-seam | Draft |
| financial-decision-version-seam | Financial Review Seam | AGENT_REVIEW_REQUIRED | seller-pricing-version-reviewed | evidence-snapshot-financial-seam | SELLER_PRICING_SCENARIO_V1 | seller-pricing-decision-v1-fixture | Seam |
| render-version-seam | Render Seam | COMPOSED | seller-update-current-version | evidence-snapshot-seller-update-current | SELLER_PRICING_SCENARIO_V1 | post-launch-decision-v1-fixture | Seam |

## F. Required State-Machine Table

| State | Mutable | Seller Usable | Entry Condition | Allowed Next States | Material Change Effect |
|-------|---------|---------------|-----------------|---------------------|------------------------|
| DRAFT | Yes | No | New or successor draft created | COMPOSED, FAIL_CLOSED | Mutate/recompose in place |
| COMPOSED | Limited | No | Composition completed | AGENT_REVIEW_REQUIRED, AGENT_REVIEWED, INVALIDATED, FAIL_CLOSED | Derive review-required version if material |
| AGENT_REVIEW_REQUIRED | No material edits | No | Review gate triggered | AGENT_REVIEWED, INVALIDATED, FAIL_CLOSED | Derive successor |
| AGENT_REVIEWED | Immutable | Internal reviewed | Agent review completed | READY_FOR_SELLER_REVIEW, INVALIDATED, SUPERSEDED, ARCHIVED_HISTORICAL_REFERENCE | Derive successor |
| READY_FOR_SELLER_REVIEW | Immutable | Yes after Agent use | Seller-ready output prepared | SELLER_REVIEWED_OR_PRESENTED, INVALIDATED, SUPERSEDED | Derive successor |
| SELLER_REVIEWED_OR_PRESENTED | Immutable | Yes | Seller reviewed or presented | SUPERSEDED, ARCHIVED_HISTORICAL_REFERENCE, INVALIDATED | Derive successor and retain history |
| INVALIDATED | Immutable | No | Material dependency changed | DRAFT, SUPERSEDED, ARCHIVED_HISTORICAL_REFERENCE | Create successor |
| SUPERSEDED | Immutable | Historical only | Successor became current | ARCHIVED_HISTORICAL_REFERENCE | Preserve as readable history |
| ARCHIVED_HISTORICAL_REFERENCE | Immutable | Historical only | Historical retention reference | none | Preserve only |
| FAIL_CLOSED | No | No | Required contract evidence invalid | DRAFT | Restart from valid draft |

## G. Reviewed Immutability

Reviewed versions are immutable for subject, audience, content references, composition references, evidence snapshot references, pricing references, financial references, post-launch references, Agent content references, decision references, effective as-of, review state, and reviewed-at metadata. A material change derives a successor version.

## H. Required Lineage Table

| Current Version | Parent | Prior Reviewed | Derived From | Refreshed From | Supersedes | Reason |
|-----------------|--------|----------------|--------------|----------------|------------|--------|
| seller-decision-brief-v2-reviewed | seller-decision-brief-v1-reviewed | seller-decision-brief-v1-reviewed | seller-decision-brief-v1-reviewed | none | seller-decision-brief-v1-reviewed | CONTENT_REVISION |
| seller-pricing-version-reviewed | seller-decision-brief-v2-reviewed | seller-decision-brief-v2-reviewed | seller-decision-brief-v2-reviewed | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | none | PRICING_CHANGE |
| seller-launch-context-version | seller-pricing-version-reviewed | seller-pricing-version-reviewed | seller-pricing-version-reviewed | none | none | INITIAL_DRAFT |
| seller-post-launch-review-current | seller-launch-context-version | seller-launch-context-version | seller-launch-context-version | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | none | POST_LAUNCH_REVIEW |
| seller-update-current-version | seller-update-superseded-version | seller-update-superseded-version | seller-post-launch-review-current | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | seller-update-superseded-version | DATA_REFRESH |
| seller-update-draft-successor | seller-update-current-version | seller-update-current-version | seller-update-current-version | market-snapshot-b | none | DATA_REFRESH |
| render-version-seam | seller-update-current-version | seller-update-current-version | seller-update-current-version | none | none | RENDER_RELEVANT_CONTENT_CHANGE |

Lineage reasons admitted: PARENT_VERSION, PRIOR_REVIEWED_VERSION, DERIVED_FROM, REVISED_FROM, REFRESHED_FROM, RECOMPOSED_FROM, SUPERSEDES, SUPERSEDED_BY.

## I. Version Creation Reasons

Implemented creation reasons: INITIAL_DRAFT, CONTENT_REVISION, DATA_REFRESH, AGENT_EDIT, PRICING_CHANGE, FINANCIAL_CHANGE, POST_LAUNCH_REVIEW, AUDIENCE_TRANSFORM, PRODUCT_TRANSFORM, COMPOSITION_CHANGE, RENDER_RELEVANT_CONTENT_CHANGE.

## J. Template / Instance Distinction

Output product templates, section definitions, and module definitions remain reusable and client-neutral. Output product instances, output versions, section instances, and module instances are subject/audience/version scoped.

## K. Required Section / Module Instance Table

| Instance | Definition | Output Version | Input Version(s) | Evidence Snapshot | Content Version | Review | Fingerprint |
|----------|------------|----------------|------------------|-------------------|-----------------|--------|-------------|
| section-instance-seller-brief-executive-summary | seller-brief-executive-summary | seller-decision-brief-v2-reviewed | Seller V2 / Pricing | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | SECTION_INSTANCE_FINGERPRINT |
| section-instance-seller-brief-context | seller-brief-context | seller-decision-brief-v2-reviewed | Seller V2 | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | SECTION_INSTANCE_FINGERPRINT |
| section-instance-seller-brief-market | seller-brief-market | seller-decision-brief-v2-reviewed | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | SECTION_INSTANCE_FINGERPRINT |
| module-instance-seller-module-current-market-snapshot | seller-module-current-market-snapshot | seller-decision-brief-v2-reviewed | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | MODULE_INSTANCE_FINGERPRINT |
| module-instance-seller-module-current-competition | seller-module-current-competition | seller-decision-brief-v2-reviewed | CURRENT_COMPETING_LISTING_CONTEXT_V1 | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | MODULE_INSTANCE_FINGERPRINT |
| module-instance-seller-module-recommendation-card | seller-module-recommendation-card | seller-decision-brief-v2-reviewed | SELLER_DECISION_BRIEF_NARRATIVE_V1 | evidence-snapshot-seller-v2 | SELLER_DECISION_BRIEF_V2 | Agent review required | MODULE_INSTANCE_FINGERPRINT |

## L. Required Evidence Snapshot Table

| Evidence Snapshot | Output Version | Source Snapshots | Metrics / Analysis | Rights | Freshness | Limitations | Review |
|-------------------|----------------|------------------|--------------------|--------|-----------|-------------|--------|
| evidence-snapshot-seller-v2 | seller-decision-brief-v2-reviewed | subject, market, competition | propertyFacts, currentMarket, currentCompetition | Agent internal / Seller review | Point in time | Domain-only fixture | Agent review required |
| evidence-snapshot-pricing-v1 | seller-pricing-version-reviewed | market, competition, search-band, pricing | searchBands, priceAssumption | Agent internal | Point in time | No valuation / forecast | Agent review required |
| evidence-snapshot-post-launch-v1 | seller-post-launch-review-current | post-launch, market, competition | changeSets, responseInputs | Agent internal | Point in time | Review gated | Agent review required |
| evidence-snapshot-seller-update-current | seller-update-current-version | post-launch, market, competition | sellerUpdateModules | Agent internal / Seller review | Point in time | No PDF/share/delivery | Agent review required |
| evidence-snapshot-financial-seam | financial-decision-version-seam | financial reference, pricing context | financialReviewState | Agent internal | Point in time | No financial advice | Agent review required |

## M. Required Source Snapshot Table

| Source Snapshot | Source | Subject / Cohort / Query | As-Of | Used Fields / Metrics | Coverage | Rights | Fingerprint |
|-----------------|--------|--------------------------|-------|-----------------------|----------|--------|-------------|
| source-snapshot-subject-property | SELLER_DECISION_BRIEF_V2 | seller-decision-brief-subject-property | 2026-08-27 | propertyType, beds, baths, squareFeet, lot, yearBuilt | Subject property facts | ADMITTED_FOR_AGENT_INTERNAL | SOURCE_SNAPSHOT_FINGERPRINT |
| source-snapshot-current-market-cohort | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | ATLAS_COHORT_CONTRACT_V1_BLOCK_1 | 2026-08-27 | currentPopulation, currentPriceMetrics, searchBandCount | Current market cohort | ADMITTED_FOR_AGENT_INTERNAL | SOURCE_SNAPSHOT_FINGERPRINT |
| source-snapshot-current-competition | CURRENT_COMPETING_LISTING_CONTEXT_V1 | seller-current-competition-set | 2026-08-27 | listingIds, askingPrice, status, propertyFacts | Current competition | ADMITTED_FOR_AGENT_INTERNAL | SOURCE_SNAPSHOT_FINGERPRINT |
| source-snapshot-search-band-context | SELLER_PRICING_SEARCH_BAND_V1 | seller-pricing-search-band-set | 2026-08-27 | lowerBound, upperBound, boundarySemantics, listingCount | Search-band context | ADMITTED_FOR_AGENT_INTERNAL | SOURCE_SNAPSHOT_FINGERPRINT |

## N. Required Dependency Table

| Upstream Artifact | Downstream Artifact | Dependency Type | Materiality | Version Used | Invalidation Policy | Current State |
|-------------------|---------------------|-----------------|-------------|--------------|---------------------|---------------|
| PROPERTY FACT | PROPERTY MODULE | FACT_DEPENDENCY | HIGH | SELLER_DECISION_BRIEF_V2 | RECOMPOSE_REQUIRED | CURRENT |
| MARKET SNAPSHOT | MARKET MODULE | MARKET_DEPENDENCY | HIGH | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | REFRESH_RECOMMENDED | REFRESH_RECOMMENDED |
| MARKET SNAPSHOT | PRICING CURRENT CONTEXT | MARKET_DEPENDENCY | HIGH | AGENT_CURRENT_SNAPSHOT_COMPARISON_V1 | REVIEW_REQUIRED | REVIEW_REQUIRED |
| COMPETITION SET | PRICING SCENARIO | COMPETITION_DEPENDENCY | HIGH | CURRENT_COMPETING_LISTING_CONTEXT_V1 | REVIEW_REQUIRED | REVIEW_REQUIRED |
| SEARCH-BAND SET | PRICE OPTION | SEARCH_BAND_DEPENDENCY | HIGH | SELLER_PRICING_SEARCH_BAND_V1 | RECOMPUTE_REQUIRED | RECOMPUTE_REQUIRED |
| AGENT NARRATIVE | SELLER OUTPUT | NARRATIVE_DEPENDENCY | MEDIUM | SELLER_DECISION_BRIEF_NARRATIVE_V1 | REVIEW_REQUIRED | CURRENT |
| RECOMMENDATION | SELLER DECISION | RECOMMENDATION_DEPENDENCY | CRITICAL | SELLER_DECISION_BRIEF_NARRATIVE_V1 | REVIEW_REQUIRED | REVIEW_REQUIRED |
| PRICING SCENARIO | FINANCIAL LINK | FINANCIAL_DEPENDENCY | CRITICAL | SELLER_PRICING_FINANCIAL_LINK_V1 | REVIEW_REQUIRED | REVIEW_REQUIRED |
| POST-LAUNCH REVIEW | SELLER UPDATE | PRICING_DEPENDENCY | HIGH | SELLER_POST_LAUNCH_REVIEW_V1 | REVIEW_REQUIRED | REVIEW_REQUIRED |
| RIGHTS | OUTPUT MODULE | RIGHTS_DEPENDENCY | CRITICAL | RIGHTS_SNAPSHOT_V1 | RIGHTS_REVIEW_REQUIRED | RIGHTS_REVIEW_REQUIRED |
| FRESHNESS | OUTPUT MODULE | FRESHNESS_DEPENDENCY | HIGH | FRESHNESS_SNAPSHOT_V1 | FRESHNESS_REVIEW_REQUIRED | FRESHNESS_REVIEW_REQUIRED |

## O. Required Invalidation Table

| Upstream Change | Dependency | Resulting State | Recompute | Recompose | Agent Review | Seller Effect |
|-----------------|------------|-----------------|-----------|-----------|--------------|---------------|
| PROPERTY_FACT_CHANGE | FACT_DEPENDENCY | RECOMPOSE_REQUIRED | Yes | Yes | Yes | Property module and Seller summary require review |
| MARKET_REFRESH | MARKET_DEPENDENCY | REFRESH_RECOMMENDED | No | Yes | Yes | Market module and pricing context should refresh |
| COMPETITION_CHANGE | COMPETITION_DEPENDENCY | REVIEW_REQUIRED | No | Yes | Yes | Pricing scenario and Seller Update require review |
| SEARCH_BAND_CHANGE | SEARCH_BAND_DEPENDENCY | RECOMPUTE_REQUIRED | Yes | Yes | Yes | Price option context requires recomputation |
| PRICE_ASSUMPTION_CHANGE | PRICING_DEPENDENCY | RECOMPUTE_REQUIRED | Yes | Yes | Yes | Pricing output and financial link require review |
| SELECTED_PRICING_SCENARIO_CHANGE | PRICING_DEPENDENCY | REVIEW_REQUIRED | Yes | Yes | Yes | Seller pricing decision and Seller Update require review |
| SELLER_TIMING_CHANGE | AGENT_INPUT_DEPENDENCY | REVIEW_REQUIRED | No | Yes | Yes | Timeline, pricing posture, and financial reference require review |
| FINANCIAL_CONSTRAINT_CHANGE | FINANCIAL_DEPENDENCY | REVIEW_REQUIRED | Yes | Yes | Yes | Financial decision preparation seam becomes review-required |
| AGENT_RECOMMENDATION_CHANGE | RECOMMENDATION_DEPENDENCY | REVIEW_REQUIRED | No | Yes | Yes | Linked Seller decision and output version require review |
| RIGHTS_CHANGE | RIGHTS_DEPENDENCY | RIGHTS_REVIEW_REQUIRED | No | Yes | Yes | Module/output held until rights review clears |
| FRESHNESS_CHANGE | FRESHNESS_DEPENDENCY | FRESHNESS_REVIEW_REQUIRED | No | Yes | Yes | Module/output needs freshness review |
| PRESENTATION_ONLY_CHANGE | PRESENTATION_DEPENDENCY | CURRENT | No | No | No | Render seam changes without material content invalidation |

## P. Required Output Diff Table

| Diff Class | Prior | Current | Severity | Invalidated Dependencies | Agent Action | Seller Summary |
|------------|-------|---------|----------|--------------------------|--------------|----------------|
| DATA_REFRESH | seller-update-current-version | seller-update-draft-successor | DATA_REFRESH | dep-market-module, dep-market-pricing-context | Review refreshed data | Market context refreshed |
| AGENT_INPUT_CHANGED | seller-update-current-version | seller-update-draft-successor | MATERIAL_CONTENT | dep-agent-narrative-output | Review Agent content | Agent content changed |
| RECOMMENDATION_CHANGED | seller-update-current-version | seller-update-draft-successor | DECISION_RELEVANT | dep-recommendation-decision | Review decision | Recommendation changed |
| PRICING_CHANGED | seller-update-current-version | seller-update-draft-successor | DECISION_RELEVANT | dep-pricing-financial-link | Review pricing | Pricing changed |
| FINANCIAL_CHANGED | seller-update-current-version | seller-update-draft-successor | FINANCIAL_CRITICAL | dep-pricing-financial-link | Review financial seam | Financial link changed |
| NO_MATERIAL_CHANGE | seller-update-current-version | render-version-seam | NON_MATERIAL_CONTENT | none | No content action | No material change |
| PRESENTATION_ONLY | seller-update-current-version | render-version-seam | PRESENTATION_ONLY | dep-presentation-render | Render-only review | Presentation-only change |

## Q. Required Seller Version-Chain Table

| Order | Artifact | Version | Parent / Prior | Evidence | Review | Decision Link | Downstream |
|------:|----------|---------|----------------|----------|--------|---------------|------------|
| 1 | SELLER DECISION BRIEF V1 | SELLER_DECISION_BRIEF_FOUNDATION_V1 | none | evidence-snapshot-seller-v1 | AGENT_REVIEWED | none | SELLER_DECISION_BRIEF_V2 |
| 2 | SELLER DECISION BRIEF V2 | SELLER_DECISION_BRIEF_V2 | seller-decision-brief-v1-reviewed | evidence-snapshot-seller-v2 | AGENT_REVIEW_REQUIRED | seller-pricing-decision-v1-fixture | PRICING_SCENARIO |
| 3 | PRICING SCENARIO | SELLER_PRICING_SCENARIO_V1 | seller-decision-brief-v2-reviewed | evidence-snapshot-pricing-v1 | AGENT_REVIEW_REQUIRED | seller-pricing-decision-v1-fixture | SELLER_PRICING_DECISION |
| 4 | SELLER PRICING DECISION | SELLER_PRICING_DECISION_V1 | SELLER_PRICING_SCENARIO_V1 | evidence-snapshot-pricing-v1 | AGENT_REVIEW_REQUIRED | seller-pricing-decision-v1-fixture | LAUNCH_CONTEXT |
| 5 | LAUNCH CONTEXT | SELLER_LAUNCH_CONTEXT_V1 | SELLER_PRICING_DECISION_V1 | evidence-snapshot-launch-v1 | AGENT_REVIEWED | seller-pricing-decision-v1-fixture | POST_LAUNCH_REVIEW |
| 6 | POST-LAUNCH REVIEW | SELLER_POST_LAUNCH_REVIEW_V1 | seller-launch-context-version | evidence-snapshot-post-launch-v1 | AGENT_REVIEW_REQUIRED | post-launch-decision-v1-fixture | SELLER_UPDATE |
| 7 | SELLER UPDATE | SELLER_UPDATE_PRODUCT_V1 | seller-post-launch-review-current | evidence-snapshot-seller-update-current | AGENT_REVIEW_REQUIRED | post-launch-decision-v1-fixture | NEXT_SELLER_UPDATE_SEAM |
| 8 | NEXT SELLER UPDATE SEAM | SELLER_UPDATE_PRODUCT_V1 | seller-update-current-version | evidence-snapshot-seller-update-successor | DRAFT | next-seller-decision-seam | FINANCIAL_DECISION_SEAM |
| 9 | FINANCIAL DECISION SEAM | REIE_FINANCIAL_DECISION_PREPARATION_V1 | SELLER_PRICING_FINANCIAL_LINK_V1 | evidence-snapshot-financial-seam | AGENT_REVIEW_REQUIRED | seller-pricing-decision-v1-fixture | RENDER_SEAM |
| 10 | RENDER SEAM | SELLER_OUTPUT_RENDER_VERSION_SEAM_V1 | seller-update-current-version | evidence-snapshot-seller-update-current | COMPOSED | post-launch-decision-v1-fixture | PRINT_PDF_GATE |

## R. Required Pricing Lineage Table

| Pricing Artifact | Version | Evidence Inputs | Agent Input | Seller Decision | Downstream | Invalidation Trigger |
|------------------|---------|-----------------|-------------|-----------------|------------|----------------------|
| PRICING OBJECTIVE | BALANCE_PRICE_AND_TIME | pricing-objective | Agent objective interpretation | seller-pricing-decision-v1-fixture | Pricing scenario | AGENT_RECOMMENDATION_CHANGE |
| SEARCH-BAND SET | SELLER_PRICING_SEARCH_BAND_V1 | pricing-search-bands | Agent-defined bands | seller-pricing-decision-v1-fixture | Price option | SEARCH_BAND_CHANGE |
| PRICE ASSUMPTION | SELLER_PRICING_SCENARIO_V1 | pricing-selected-price-assumption | Agent-authored assumption | seller-pricing-decision-v1-fixture | Pricing scenario | PRICE_ASSUMPTION_CHANGE |
| PRICING SCENARIO | SELLER_PRICING_SCENARIO_V1 | pricing-current-cohort, pricing-current-competition | Agent scenario rationale | seller-pricing-decision-v1-fixture | Seller pricing decision | SELECTED_PRICING_SCENARIO_CHANGE |
| POSITIONING THEMES | SELLER_DECISION_BRIEF_STRATEGY_V1 | seller-positioning-themes | Agent positioning interpretation | seller-pricing-decision-v1-fixture | Seller output | AGENT_RECOMMENDATION_CHANGE |
| AGENT RATIONALE | SELLER_PRICING_AGENT_RATIONALE_V1 | pricing-agent-rationale | Agent-authored rationale | seller-pricing-decision-v1-fixture | Recommendation | AGENT_RECOMMENDATION_CHANGE |
| SELLER PRICING DECISION | SELLER_PRICING_DECISION_V1 | pricing-seller-decision | Agent records decision | seller-pricing-decision-v1-fixture | Launch context | SELECTED_PRICING_SCENARIO_CHANGE |
| RESPONSE CHECKPOINT | SELLER_PRICING_RESPONSE_CHECKPOINT_V1 | pricing-response-checkpoint | Agent checkpoint plan | seller-pricing-decision-v1-fixture | Post-launch review | SELLER_TIMING_CHANGE |

## S. Required Post-Launch Lineage Table

| Post-Launch Artifact | Version | Prior Reference | Current Inputs | Agent Interpretation | Seller Decision | Next |
|----------------------|---------|-----------------|----------------|----------------------|-----------------|------|
| POST-LAUNCH REVIEW | SELLER_POST_LAUNCH_REVIEW_V1 | seller-launch-context-version | currentMarket, currentCompetition | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER UPDATE |
| CHECKPOINT | SELLER_POST_LAUNCH_CHECKPOINT_V1 | pricing response checkpoint | checkpoint | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | NEXT CHECKPOINT |
| MARKET CHANGE SET | SELLER_POST_LAUNCH_CHANGE_SET_V1 | prior market snapshot | currentMarket | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER UPDATE |
| COMPETITION CHANGE SET | SELLER_POST_LAUNCH_CHANGE_SET_V1 | prior competition set | currentCompetition | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER UPDATE |
| SUBJECT CHANGE SET | SELLER_POST_LAUNCH_CHANGE_SET_V1 | prior subject context | currentSubject | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER UPDATE |
| RESPONSE INPUT SET | SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_V1 | prior response inputs | responseInputs | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER UPDATE |
| UPDATED RECOMMENDATION | SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_V1 | prior recommendation | agentInterpretation | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SELLER DECISION |
| SELLER DECISION | SELLER_POST_LAUNCH_SELLER_DECISION_V1 | SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_V1 | sellerDecision | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | NEXT CHECKPOINT |
| NEXT CHECKPOINT | SELLER_POST_LAUNCH_CHECKPOINT_V1 | SELLER_POST_LAUNCH_SELLER_DECISION_V1 | nextCheckpoint | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | NEXT SELLER UPDATE |
| SELLER UPDATE | SELLER_UPDATE_PRODUCT_V1 | SELLER_POST_LAUNCH_REVIEW_V1 | sellerUpdateProduct | SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1 | post-launch-decision-v1-fixture | SUPERSESSION SEAM |

## T. Required Financial Invalidation Table

| Upstream Pricing / Seller Change | Financial Reference | Previous State | Resulting State | Reason | Agent Action |
|----------------------------------|---------------------|----------------|-----------------|--------|--------------|
| PRICE_ASSUMPTION_CHANGE | PRICE ASSUMPTION | READY_FOR_REVIEW | REVIEW_REQUIRED | Price assumption changed | Review financial preparation seam |
| SELECTED_PRICING_SCENARIO_CHANGE | SELECTED PRICING SCENARIO | READY_FOR_REVIEW | REVIEW_REQUIRED | Selected scenario changed | Review financial link before Seller use |
| SELLER_TIMING_CHANGE | SELLER TIMING | READY_FOR_REVIEW | REVIEW_REQUIRED | Seller timing changed | Review timing-dependent financial assumptions |
| FINANCIAL_CONSTRAINT_CHANGE | FINANCIAL CONSTRAINT | READY_FOR_REVIEW | REVIEW_REQUIRED | Seller financial constraint changed | Hold financial reference for Agent review |

## U. Required Reuse Table

| Artifact | Same Product New Version | Seller Update | Buyer | Market | Property | Location | Investment | Financial | Advisory |
|----------|--------------------------|---------------|-------|--------|----------|----------|------------|-----------|----------|
| OUTPUT PRODUCT INSTANCE | NEW_INSTANCE | REFERENCE_REUSE | AUDIENCE_TRANSFORM | RECOMPOSE | RECOMPOSE | RECOMPOSE | RECOMPOSE | REFERENCE_REUSE | REFERENCE_REUSE |
| OUTPUT VERSION | REFERENCE_REUSE | DIRECT_REUSE | AUDIENCE_TRANSFORM | RECOMPOSE | RECOMPOSE | RECOMPOSE | RECOMPOSE | REFERENCE_REUSE | DIRECT_REUSE |
| SECTION DEFINITION | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE |
| SECTION INSTANCE | REFERENCE_REUSE | REFERENCE_REUSE | AUDIENCE_TRANSFORM | RECOMPOSE | RECOMPOSE | RECOMPOSE | RECOMPOSE | REFERENCE_REUSE | REFERENCE_REUSE |
| MODULE DEFINITION | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE | DIRECT_REUSE |
| MODULE INSTANCE | REFERENCE_REUSE | DIRECT_REUSE | AUDIENCE_TRANSFORM | RECOMPOSE | RECOMPOSE | RECOMPOSE | RECOMPOSE | REFERENCE_REUSE | REFERENCE_REUSE |
| EVIDENCE SNAPSHOT | REFERENCE_REUSE | REFERENCE_REUSE | AUDIENCE_TRANSFORM | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE |
| AGENT NARRATIVE | REFERENCE_REUSE | RECOMPOSE | AUDIENCE_TRANSFORM | RECOMPOSE | RECOMPOSE | RECOMPOSE | RECOMPOSE | NOT_REUSABLE | REFERENCE_REUSE |
| SELLER DECISION | REFERENCE_REUSE | DIRECT_REUSE | NOT_REUSABLE | NOT_REUSABLE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE | REFERENCE_REUSE |

## V. Required Subject / Audience Transformation Table

| Change | New Product Instance | New Output Version | Rights Review | Evidence Reuse | Review Required |
|--------|----------------------|--------------------|---------------|----------------|-----------------|
| SAME SUBJECT / NEW DRAFT | No | Yes | No | Prior evidence snapshot can be referenced | Yes |
| SAME SUBJECT / NEW REVIEW | No | Yes | No | Prior reviewed snapshot can be referenced | Yes |
| NEW SUBJECT | Yes | No | Yes | Definitions only; subject evidence cannot transfer | Yes |
| NEW CLIENT | Yes | No | Yes | Only source definitions can be reused after rights review | Yes |
| AGENT INTERNAL TO SELLER | No | Yes | Yes | Permitted source snapshots may be reused after rights review | Yes |
| SELLER TO BUYER | No | Yes | Yes | Audience transform required; Seller decision content is not reusable | Yes |
| SELLER TO INVESTOR | No | Yes | Yes | Investment transform requires financial/professional review | Yes |
| AGENT INTERNAL TO PUBLIC | No | Yes | Yes | Public rights review required; default hold | Yes |
| SELLER PRESENTATION TO SELLER UPDATE | No | Yes | No | Prior reviewed Seller version and evidence snapshots can be referenced | Yes |
| SELLER PRESENTATION TO PROPERTY ANALYSIS | Yes | No | Yes | Property definitions may be reused; client-scoped content cannot | Yes |

## W. Required Agent Version UI Table

| UI Element | Canonical Data | Agent Question Answered | Action | Readiness |
|------------|----------------|-------------------------|--------|-----------|
| CURRENT VERSION BADGE | AtlasOutputVersion | What version am I viewing? | Inspect current state | IMPLEMENTED |
| VERSION HISTORY PANEL | outputVersions + lineage references | What came before it? | Compare to prior | IMPLEMENTED |
| WHAT CHANGED SUMMARY | AtlasOutputVersionDiff | What changed? | Review diff | IMPLEMENTED |
| DEPENDENCY WARNING | AtlasOutputDependency + invalidation | What requires review? | Open warning | IMPLEMENTED |
| COMPARE TO PRIOR | priorReviewedVersion + diff | How is this different? | Compare | IMPLEMENTED |
| CREATE NEW DRAFT SEAM | creationReason CONTENT_REVISION | Can I create a successor? | Draft successor seam | SESSION_SAFE |
| CREATE NEXT SELLER UPDATE SEAM | SELLER_UPDATE_PRODUCT_V1 | What happens next? | Create next update seam | SESSION_SAFE |
| REFRESH EVIDENCE SEAM | source/evidence snapshot refs | What needs refresh? | Refresh evidence seam | SESSION_SAFE |
| REUSE CONTENT / MODULE SEAM | reuseRules | What can be reused? | Review reuse rules | IMPLEMENTED |
| SELLER VERSION / DECISION REFERENCE | sellerClientDecisionReferences | What decision is linked? | Inspect decision | IMPLEMENTED |

## X. Required Dependency Warning Table

| Warning | Upstream Change | Downstream Artifact | State | Required Action |
|---------|-----------------|---------------------|-------|-----------------|
| MARKET REFRESH AVAILABLE | MARKET_REFRESH | Market module / pricing context | REFRESH_RECOMMENDED | Refresh evidence and review market-dependent modules |
| COMPETITION CHANGED | COMPETITION_CHANGE | Pricing scenario / Seller Update | REVIEW_REQUIRED | Review competition and pricing context |
| PRICING REVIEW REQUIRED | PRICE_ASSUMPTION_CHANGE | Pricing output | RECOMPUTE_REQUIRED | Review pricing scenario before Seller use |
| FINANCIAL REVIEW REQUIRED | FINANCIAL_CONSTRAINT_CHANGE | Financial link | REVIEW_REQUIRED | Review financial preparation seam |
| RIGHTS REVIEW REQUIRED | RIGHTS_CHANGE | Output module | RIGHTS_REVIEW_REQUIRED | Hold module/output until rights review clears |
| FRESHNESS REVIEW REQUIRED | FRESHNESS_CHANGE | Output module | FRESHNESS_REVIEW_REQUIRED | Refresh or review source freshness |
| SELLER DECISION SUPERSEDED | AGENT_RECOMMENDATION_CHANGE | Seller decision | SUPERSEDED | Create successor decision reference |

## Y. Required Fingerprint Table

| Fingerprint | Inputs | Stable Across | Changes When | Use |
|-------------|--------|---------------|--------------|-----|
| OUTPUT CONTENT FINGERPRINT | product, audience, subject, module content, evidence snapshots, pricing, decision | Render-only visual changes | Material content/evidence/decision changes | Detect reviewed output material changes |
| SOURCE SNAPSHOT FINGERPRINT | source, query/cohort, as-of, member identities, used fields, calculation version | Presentation changes | Source/query/value changes | Reproduce reviewed evidence |
| MODULE INSTANCE FINGERPRINT | module definition, inputs, evidence snapshot, content, Agent input, visual | Unchanged inputs and content | Module inputs/content/evidence change | Scope module instances |
| SECTION INSTANCE FINGERPRINT | section definition, module order, module instance references | Module content unchanged | Section/module order or references change | Scope section composition |
| EVIDENCE SNAPSHOT FINGERPRINT | source snapshots, metrics, analysis, Agent inputs, assumptions, limitations | Render changes | Evidence/analysis assumptions change | Reproduce evidence basis |

## Z. Required Reproducibility Table

| Reproducibility Input | Version / Snapshot | Required | Purpose |
|-----------------------|--------------------|----------|---------|
| PRODUCT CONTRACT VERSION | OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1 | Yes | Interpret output semantics |
| OUTPUT VERSION | seller-update-current-version | Yes | Identify reviewed output |
| CONTENT VERSION | SELLER_UPDATE_PRODUCT_V1 | Yes | Rebuild content references |
| COMPOSITION VERSION | SELLER_UPDATE_PRODUCT_V1 | Yes | Rebuild module composition |
| TEMPLATE VERSION | SHARED_OUTPUT_PRODUCT_COMPOSITION_V1 | Yes | Rebuild definitions |
| PREPARATION VERSION | SELLER_DECISION_BRIEF_FOUNDATION_V1 | Yes | Trace preparation |
| SOURCE SNAPSHOT IDS | source-snapshot-* | Yes | Rebuild evidence |
| COHORT VERSION | ATLAS_COHORT_CONTRACT_V1_BLOCK_1 | Yes | Trace market cohort |
| COMPETITION VERSION | CURRENT_COMPETING_LISTING_CONTEXT_V1 | Yes | Trace competition |
| METRIC / CALCULATION VERSION | OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1 | Yes | Trace calculation |
| NARRATIVE VERSION | SELLER_DECISION_BRIEF_NARRATIVE_V1 | Yes | Trace Agent content |
| AGENT INPUT VERSION | SELLER_DECISION_BRIEF_STRATEGY_V1 | Yes | Trace Agent input |
| RECOMMENDATION VERSION | SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_V1 | Yes | Trace recommendation |
| PRICING SCENARIO VERSION | SELLER_PRICING_SCENARIO_V1 | Yes | Trace pricing |
| SEARCH-BAND VERSION | SELLER_PRICING_SEARCH_BAND_V1 | Yes | Trace search bands |
| POST-LAUNCH REVIEW VERSION | SELLER_POST_LAUNCH_REVIEW_V1 | Yes | Trace post-launch review |
| SELLER DECISION VERSION | SELLER_POST_LAUNCH_SELLER_DECISION_V1 | Yes | Trace Seller decision |
| EVIDENCE SNAPSHOT | evidence-snapshot-seller-update-current | Yes | Trace evidence |
| RIGHTS | agent-internal-rights | Yes | Trace rights |
| FRESHNESS | point-in-time-current-market | Yes | Trace freshness |
| EFFECTIVE AS-OF | 2026-08-27 | Yes | Trace date context |
| REVIEW STATE | AGENT_REVIEW_REQUIRED | Yes | Trace review |
| CONTENT FINGERPRINT | OUTPUT_CONTENT_FINGERPRINT | Yes | Detect material changes |

## AA. Required Persistence Mapping Table

| Phase-1 Domain Contract | Future Durable Entity | First Persistence Need | Current Status |
|-------------------------|----------------------|------------------------|----------------|
| OUTPUT PRODUCT INSTANCE | OutputProduct | Cross-session reviewed output history | FUTURE_GATE |
| OUTPUT VERSION | OutputVersion | Retain reviewed output/Seller decision across sessions | FUTURE_GATE |
| SECTION INSTANCE | OutputSectionInstance | Durable output reproduction | FUTURE_GATE |
| MODULE INSTANCE | OutputModuleInstance | Durable module-level reuse/diff | FUTURE_GATE |
| OUTPUT EVIDENCE SNAPSHOT | OutputEvidenceSnapshot | Reviewed evidence retention | FUTURE_GATE |
| OUTPUT DEPENDENCY | OutputDependency | Cross-session invalidation monitoring | FUTURE_GATE |
| OUTPUT REVIEW STATE | OutputReview | Reviewed/presented state retention | FUTURE_GATE |
| SELLER DECISION | OutputDecision | Cross-session Seller decision audit | FUTURE_GATE |
| CHECKPOINT | OutputCheckpoint | Cross-session post-launch comparison | FUTURE_GATE |
| RENDER SEAM | OutputRender | PDF/print render production | FUTURE_GATE |

## AB. Current Output-Family Readiness

| Capability | Status |
|------------|--------|
| SHARED OUTPUT PRODUCT | Implemented |
| OUTPUT VERSION CONTRACT | Implemented |
| VERSION STATE MACHINE | Implemented |
| REVIEWED IMMUTABILITY | Implemented |
| SUPERSESSION | Implemented |
| SECTION INSTANCE | Implemented |
| MODULE INSTANCE | Implemented |
| SOURCE SNAPSHOT | Implemented |
| EVIDENCE SNAPSHOT | Implemented |
| DEPENDENCY GRAPH | Implemented |
| MATERIAL CHANGE EVALUATION | Implemented |
| INVALIDATION | Implemented |
| OUTPUT DIFF | Implemented |
| SELLER V2 VERSION ADAPTER | Implemented |
| PRICING VERSION ADAPTER | Implemented |
| POST-LAUNCH VERSION ADAPTER | Implemented |
| SELLER UPDATE VERSION CHAIN | Implemented |
| FINANCIAL INVALIDATION SEAM | Implemented with holds |
| AGENT VERSION HISTORY | Implemented |
| CURRENT / PRIOR DIFF | Implemented |
| DEPENDENCY WARNINGS | Implemented |
| REUSE RULES | Implemented |
| SUBJECT SCOPE | Implemented |
| AUDIENCE TRANSFORM | Implemented |
| REPRODUCIBILITY | Implemented |
| RENDER VERSION SEAM | Implemented with holds |
| DURABLE PERSISTENCE | Next gate |
| PRINT / PDF | Next gate |
| DELIVERY | Next gate |
| CROSS-PRODUCT REUSE | Domain-only proof |

## AC. Agent UI / Local Experience

The Agent Seller Presentation route now exposes:

- `output-version-lineage-invalidation-foundation`
- `output-version-current-badge`
- `output-version-history-panel`
- `output-version-compare-to-prior`
- `output-version-diff-summary`
- `output-version-dependency-warnings`
- `output-version-successor-actions`
- `output-version-reuse-rules`
- `output-version-render-seam`
- `output-version-persistence-seam`

These answer current version, prior version, why the version exists, what changed, what dependencies require review, what Seller decision is linked, what can be reused, and what future render/persistence seam exists.

## AD. First Complete Fixture

Fixture ID:

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1`

The fixture includes Seller Decision Brief V2, pricing scenario version, Seller pricing decision, post-launch review version, current market snapshot, current competition snapshot, Seller Update version, Agent recommendation version, Seller decision version, dependency graph, material upstream change, invalidation, output diff, successor version, supersession, financial review required, and render seam.

## AE. Product-Family Reuse Proof

The shared contracts apply to Seller, Seller Update, Buyer, Market, Property, Location, Investment, Financial, and Advisory products through reusable definitions, version-scoped instances, audience transform rules, rights review, evidence reuse constraints, and output-version references.

## AF. First True Persistence Gate

Durable persistence becomes materially necessary before:

- A cross-session post-launch review must compare to a prior reviewed output, or
- A Seller decision / reviewed output must be retained across sessions.

Minimum future durable entities:

- OutputProduct
- OutputVersion
- OutputSectionInstance
- OutputModuleInstance
- OutputEvidenceSnapshot
- OutputDependency
- OutputReview
- OutputDecision
- OutputCheckpoint
- OutputRender

Executive authorization required:

- Durable output persistence authorization
- Rights and retention reconciliation
- Schema/migration authorization
- Cross-session Seller decision retention authorization

## AG. Validation

Validation completed:

- `npm run check:output-version-lineage-invalidation-foundation`
- `npm run check:seller-post-launch-current-context-review`
- `npm run check:seller-pricing-positioning-decision-framework`
- `npm run check:seller-decision-brief-v2`
- `npm run check:seller-decision-brief-composition-preview`
- `npm run check:seller-decision-brief-foundation`
- `npm run check:shared-output-product-section-module-foundation`
- `jiti scripts/checkSellerUpdatePreparation.ts`
- `npm run check:current-snapshot-comparative-intelligence`
- `npm run check:current-competing-listing-context-wave-6`
- `jiti scripts/checkProfessionalHandoffCohesion.ts`
- `jiti scripts/checkFinancialDecisionPreparationContract.ts`
- `jiti scripts/checkFinancialScenarioPresentationPolicy.ts`
- `npm run check:agent-operating-shell`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Local route verification for `/agent/prepare/seller/presentation`
- `git diff --check`

## AH. Protected Holds

No persistence, schema migration, provider call, MLS Grid call, IRES call, Typesense mutation, Supabase mutation, database mutation, cron, polling, webhook, CRM mutation, customer-data mutation, email/message execution, PDF generation, share delivery, durable output storage, cross-session retention, deployment, automated valuation, automated pricing recommendation, or financial advice was performed.

## AI. Next Gate Prioritization

| Rank | Gate | Why | Dependencies | What It Unlocks |
|------|------|-----|--------------|-----------------|
| 1 | READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE | Output versions now have content fingerprints and render seam | Output version foundation, Seller Update preview | PDF/print architecture |
| 2 | READY_FOR_DURABLE_OUTPUT_PERSISTENCE_AUTHORIZATION | Persistence becomes material for cross-session reviewed output history | Rights/retention approval, schema authorization | Durable output history |
| 3 | READY_FOR_SELLER_FINANCIAL_DECISION_PREPARATION_V1 | Financial invalidation seam exists but product is not implemented | Pricing continuity, financial review policy | Financial decision preparation |
| 4 | READY_FOR_SELLER_UPDATE_VISUAL_DEPTH | Seller Update is versioned and ready for richer visual treatment | Seller Update modules, version UI | Better seller-facing update |

## AJ. Next Primary Package Design

| Workstream | Objective | Canonical Inputs | Surfaces | Success Gate | Validation | Unlocks | Collision Boundary |
|------------|-----------|------------------|----------|--------------|------------|---------|--------------------|
| 1 | Define print/PDF output product architecture | OutputVersion, render seam, Seller Update | Domain contracts | Render contract exists | New checker/typecheck | Print/PDF planning | No PDF generation |
| 2 | Add render-version and page/composition primitives | Output content fingerprint, visual version | Agent Seller Presentation | Render seam visible | Checker/UI route verification | Print preview depth | No share/delivery |
| 3 | Certify PDF generation readiness without execution | Render contract, rights/freshness states | Certification doc/checker | Readiness explicit | Build/lint/checker | Future PDF implementation | No generated PDF |
| 4 | Rank persistence vs render follow-on | Output version persistence mapping | Executive Library | Next gate selected | Certification report | Executive authorization clarity | No schema/migration |

## AK. Next Gate

`READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE`

Why it is next:

Output version identity, lineage, evidence snapshots, dependency warnings, content fingerprints, and render seam are now explicit. Print/PDF architecture can use these without inventing output semantics.

## AL. Completion Token

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_WITH_HOLDS`

## AM. Output Version Status

`OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_DOMAIN_ONLY_PRINT_PDF_PERSISTENCE_DELIVERY_HELD`

## AN. Persistence Position

`DOMAIN_ONLY_SUFFICIENT_FOR_CURRENT_PHASE`
