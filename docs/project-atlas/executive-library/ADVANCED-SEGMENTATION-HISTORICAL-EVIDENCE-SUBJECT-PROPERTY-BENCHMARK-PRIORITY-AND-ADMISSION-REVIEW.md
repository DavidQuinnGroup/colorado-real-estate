# PROJECT ATLAS - Advanced Segmentation, Historical Evidence, and Subject-Property Benchmark Priority and Admission Review

## 1. Certification

Status: ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_SUBJECT_PROPERTY_BENCHMARK_PRIORITY_AND_ADMISSION_REVIEW_CERTIFIED

Recommended next authorization gate: READY_FOR_CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION

Recommended next workstream: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6

Secondary parallel workstream recommendation: NO_SECONDARY_PARALLEL_WORK_RECOMMENDED_FOR_NEXT_GATE

Repository baseline reviewed:

- Branch: main
- HEAD/origin/main: 0b22a953c06f08e68a21323959fbf4af1622a3b7
- Commit subject: feat(atlas): implement cohort-n comparative intelligence wave 5
- Starting gate: READY_FOR_ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_AND_SUBJECT_PROPERTY_BENCHMARK_AUTHORIZATION

## 2. Scope and Protected Boundaries

This review is architecture, admission, and priority analysis only. It does not implement advanced segmentation, historical evidence, subject-property benchmarking, CMA, valuation, MLS/IRES retrieval, provider synchronization, public presentation, export, or customer delivery.

Protected boundary confirmations:

- DATABASE MUTATION: NONE
- PROVIDER/MLS/IRES MUTATION: NONE
- SUPABASE MUTATION: NONE
- TYPESENSE MUTATION: NONE
- CRM/EMAIL/CUSTOMER-DATA MUTATION: NONE
- SECRET ACCESS OR LOGGING: NONE
- PUBLIC/CLIENT/EXPORT ACTIVATION: NONE
- DEPLOYMENT: NONE

## 3. Non-Negotiable Truth Invariants

- FIELD PRESENT != FIELD SEMANTICS ADMITTED
- CURRENT PROJECTION != HISTORICAL SNAPSHOT
- OLD DATE ON CURRENT ROW != HISTORICAL AS-OF EVIDENCE
- MLS LISTING != PHYSICAL PROPERTY
- CURRENT COMPETING LISTING CONTEXT != CMA
- AGENT_ONLY RIGHTS DO NOT IMPLY CLIENT/PUBLIC/EXPORT RIGHTS

## 4. Repository-Grounded Capability Baseline

Wave 1 through Wave 5 established reusable Agent-only current-snapshot comparison machinery:

- Cohort contract grain: MLS_LISTING.
- Observation posture: current repository property search projection.
- Admitted cohort filters: city, propertyType, statusScope, priceMin, priceMax, bedsMin, bathsMin, sqftMin, sqftMax, yearBuiltMin, yearBuiltMax.
- Supported cities in the current cohort builder: Boulder, Louisville, Lafayette, Superior, Erie, Longmont.
- Supported property type: residential.
- Supported status scope: active.
- Admitted aggregation metrics: current listing count, current asking/list price min/max/median/mean, median bedrooms, median bathrooms, median listed square feet, median year built.
- Comparative runtime posture: COHORT_N_RUNTIME_READY for two to six current-snapshot cohorts.
- Rights posture: AGENT_ONLY.

The current system is therefore strong for bounded, current, Agent-only listing-cohort comparison. It is not yet a historical market engine, CMA engine, valuation engine, or physical-property benchmark engine.

## 5. Current Property Data Inventory

The repository Property model contains current listing-shaped fields: mlsId, slug, address, city, state, zip, price, beds, baths, sqft, lotSize, yearBuilt, propertyType, status, lat, lng, neighborhood, subdivision, schoolDistrict, description, listingAgent, listingOffice, lastIntelligenceSync, sourceModifiedAt, photos, priceHistory, openHouses, geographicRelationships, countyIdentityMappings, and canonicalListingEvents.

The current Property model does not contain admitted first-class fields for garage spaces, HOA amount, builder, water rights, zoning, construction status, architectural style, basement, waterfront, individual school names, distressed status, concessions, close price, close date, DOM/CDOM, or listing contract lifecycle events.

The MLS mapper currently populates core current listing fields from source payloads, including listing id, address, city/state/zip, price, bedroom/bath counts, living area, lot size, year built, property type, status, neighborhood/area text, subdivision, school district text, remarks, agent/office, and coordinates.

Source freshness inventory recognizes ModificationTimestamp, ListingModificationTimestamp, MajorChangeTimestamp, PriceChangeTimestamp, ListingContractDate, OnMarketDate, OriginalEntryTimestamp, StatusChangeTimestamp, and PhotosChangeTimestamp. Those timestamps are inventory and freshness evidence, not a certified event history or historical as-of market record.

## 6. Track A - Advanced Segmentation and Filtering

Track A asks which IRES-style search/reporting filters can become reusable REIE cohort dimensions.

Ready or already admitted for current Agent-only cohorts:

- Municipality/city for the current supported allowlist.
- Residential property type.
- Active status scope.
- Price interval.
- Bedroom minimum.
- Bathroom minimum.
- Listed square-foot interval.
- Year-built interval.

Field-present but not yet semantically admitted as advanced filters:

- zip: present on Property, but not admitted as a cohort geography dimension.
- lotSize: present and normalized toward acres, but needs admission rules for units, nulls, acreage/lots, and outliers.
- neighborhood: present as raw source text, but not a governed geographic object dimension.
- subdivision: present as raw source text, but not a governed geographic object dimension.
- schoolDistrict: present as raw text, but not a school attendance/quality/assignment dimension.
- description/remarks: present as text, but requires NLP/admission policy before use as criteria.
- listingAgent/listingOffice: present, but use requires professional, privacy, and reporting-purpose review.
- photos/openHouses: related data exists, but comparison semantics are not admitted.
- lat/lng: present, but spatial/polygon semantics require governed geographic relationship admission.

Missing or blocked advanced filter dimensions:

- Garage spaces/type.
- HOA presence/amount.
- Builder/model/new-construction semantics.
- Construction status.
- Architectural style.
- Basement/finished basement.
- Waterfront/water access/water meter/water rights.
- Zoning.
- Individual school names and attendance boundaries.
- Distressed property status.
- Units/multifamily details as an admitted listing-cohort dimension.
- MLS area/subarea as canonical geography rather than source-specific raw text.

Track A readiness: PARTIALLY_READY_REPOSITORY_LOCAL_ADMISSION_REQUIRED.

Smallest useful Track A follow-on: READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW.

Recommended Track A implementation order after the next primary gate:

1. Admit ZIP and lot-size current filters with null, unit, and boundary semantics.
2. Admit exact/min/max bedroom and bathroom interval semantics where useful for Agent workflows.
3. Admit photo/open-house presence only if the user-facing question is listing-exposure context, not quality or value.
4. Admit governed neighborhood/subdivision only after geographic object mapping, source identity, and eligibility are resolved.
5. Keep raw remarks, schools, HOA, garage, zoning, construction, and water rights blocked until source-field inventory, semantics, and rights are proven.

## 7. Track B - Historical Market Evidence

Track B asks whether REIE can replace IRES recurring historical reporting.

Current repository historical posture:

- Current Property rows are current stored state, not dated inventory snapshots.
- PriceHistory and OpenHouse tables exist, but coverage, writer authority, and certified read semantics are not established for market history.
- Close price and close date are not retained in the current Property model.
- Historical event history is not reliably available from current rows.
- The prospective observation architecture is certified as architecture, but it has not been authorized to retrieve provider data or persist observations.
- Historical MLS use reconciliation remains required: HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED.

Historical requirement matrix:

| IRES-style work | Current REIE state | Evidence required before correctness |
| --- | --- | --- |
| Active inventory as-of date | Blocked | Dated snapshots or certified reconstructible event ledger |
| Median asking price as-of date | Blocked | As-of inventory population and price observation semantics |
| New listings in period | Blocked | Listing entry events, period boundaries, duplicate policy |
| Pending listings in period | Blocked | Status-change events and source status mapping |
| Withdrawn/expired/back-on-market | Blocked | Status event ledger and source lifecycle definitions |
| Price reductions | Blocked | Price-change event ledger, original/current price semantics |
| Closed sales and dollar volume | Blocked | Close price, close date, transaction population, rights |
| Median/average sold price | Blocked | Closed-sale field coverage and period methodology |
| DOM/CDOM/DTS/DTO | Blocked | Source fields plus exact methodology definitions |
| SP/LP or sale-to-list ratios | Blocked | Sold price, final/original list price, concessions policy |
| Months of supply/absorption | Blocked | Inventory snapshots, closed sales, and period definitions |
| MoM/QoQ/YoY/YTD/rolling windows | Blocked | Historical observations with aligned as-of/period windows |

Prospective history is the lowest-risk historical foundation because future observations can be captured under an explicit governance and retention contract. Retrospective history remains blocked until MLS/IRES historical use, field availability, coverage, licensing, and methodology are admitted.

Track B readiness: ARCHITECTURE_READY_RUNTIME_BLOCKED.

Smallest useful Track B follow-on: READY_FOR_TARGETED_HISTORICAL_EVENT_EVIDENCE_ADMISSION_REVIEW.

## 8. Track C - Subject-Property Benchmark and Competing Listing Context

Track C asks whether a specific property can be evaluated against a relevant market.

The current Property Preparation repository supports an active repository listing selected by slug. It includes mlsId, slug, address, city, state, zip, status, price, beds, baths, sqft, lotSize, yearBuilt, propertyType, neighborhood, sourceModifiedAt, and freshness. The certified narrative states that this establishes listing position and configuration, not condition, value, or property-specific conclusions.

Admitted now after a small bounded implementation:

- Subject current listing observation at MLS_LISTING grain.
- Competing current listing cohort built from already admitted Wave 1-5 current filters.
- Agent-only subject-vs-current-active-cohort context for price, size, beds, baths, year built, and supported city/property/status dimensions.
- Clear no-CMA, no-valuation, no-sold-comps, no-recommendation labeling.

Not admitted now:

- True subject physical-property benchmark.
- CMA or valuation.
- Sold comparable selection.
- Adjustment grids.
- Condition/view/remodel/finish quality inference.
- Client/public/export delivery.
- Historical subject trajectory.

Track C readiness:

- Current competing listing context: READY_AFTER_SMALL_LOCAL_FOUNDATION.
- True subject-property benchmark: BLOCKED_BY_IDENTITY_HISTORY_AND_METHOD.

Smallest useful Track C package and recommended primary next workstream: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6.

Minimum Wave 6 architecture requirements:

- Define a subject listing observation contract that explicitly uses MLS_LISTING grain.
- Adapt Property Preparation active repository listings into that subject observation.
- Reuse the existing Agent cohort builder and current snapshot comparison engine.
- Restrict comparison to admitted current fields and metrics.
- Emit no-data and insufficient-data states rather than fabricating context.
- Label the artifact current competing-listing context, not CMA.
- Keep rights AGENT_ONLY.
- Block public/client/export surfaces.
- Preserve source/as-of evidence and filter provenance.

Wave 6 certification target: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED.

## 9. ATLAS Cohort Contract Requirements

The ATLAS Cohort Contract must remain explicit about:

- Grain: MLS_LISTING unless a future gate admits physical-property identity.
- Source scope: current repository projection for current comparisons.
- As-of semantics: current observation timestamp is not historical reconstruction.
- Criteria mapping: every buyer/seller/Agent criterion must be admitted, rejected, or returned as unmapped.
- Null policy: nulls cannot silently match advanced filters.
- Count-zero and no-data policy: empty cohorts produce defined no-data artifacts.
- Rights/audience: AGENT_ONLY until a separate public/client/export gate.
- Provenance: source, filter, as-of, and version metadata must travel with comparison artifacts.

## 10. Comparative Market Intelligence Engine Requirements

The Comparative Market Intelligence Engine should be a reusable layer, not a one-off report generator.

Required primitives:

- Cohort definition parser.
- Criteria admission mapper.
- Current listing cohort query builder.
- Numeric interval evaluator.
- Current aggregation engine.
- Cohort-N comparator.
- Subject listing observation adapter.
- Evidence/provenance envelope.
- No-data/insufficient-data state generator.
- Rights/audience gate.
- Future historical observation reader, gated separately.
- Future physical-property identity resolver, gated separately.

Do not collapse the engine into CMA. CMA requires sold comparables, methodology, subject adjustments, and rights that are not yet admitted.

## 11. Cross-Track Priority

Priority ranking:

1. Track C narrow current competing-listing context.
2. Track A advanced segmentation admission.
3. Track B targeted historical event evidence admission.
4. True subject-property benchmark/CMA foundation after identity, history, and methodology gates.

Why Track C ranks first:

- It directly replaces a high-frequency manual Agent workflow: understanding how a subject listing sits against live competition.
- It can reuse Wave 1-5 cohort and comparison primitives.
- It can remain at MLS_LISTING grain and avoid physical-property identity claims.
- It does not require sold history, retrospective snapshots, or provider mutation.
- It creates the smallest valuable next capability while preserving truth boundaries.

Track A improves Track C after admission by adding richer current filters. Track B enables future historical and sold-comparable intelligence but is blocked for implementation by evidence, rights, and methodology. True subject-property benchmark depends on both identity and historical/sold evidence.

## 12. Implementation-Readiness and Blocker Matrix

| Capability | Readiness | Primary blocker |
| --- | --- | --- |
| Current active cohort comparison | Runtime ready | Limited admitted dimensions |
| Cohort-N current market comparison | Runtime ready | Current-snapshot only |
| Subject current listing observation | Ready after small local foundation | Needs explicit contract and adapter |
| Current competing listing context | Recommended next | Must preserve no-CMA/no-valuation boundary |
| ZIP current filtering | Admission-ready | Null and geography semantics |
| Lot-size current filtering | Admission-ready | Unit/outlier/null semantics |
| Raw neighborhood/subdivision filtering | Blocked | Governed object mapping and source identity |
| School criteria | Blocked | Attendance/assignment/source semantics |
| Garage/HOA/zoning/water rights | Blocked | Field absence and source admission |
| Historical market reporting | Blocked | Snapshots/event ledger/closed-sale evidence |
| Sold comparable intelligence | Blocked | Close data, methodology, rights |
| True physical-property benchmark | Blocked | Canonical identity population and method |
| Public/client/export reporting | Blocked | Separate rights and product authorization |

## 13. Proposed Implementation Waves

Wave 6 primary: CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6.

Scope:

- Subject listing observation contract.
- Property Preparation subject adapter.
- Current competing cohort query using admitted filters.
- Subject-to-cohort comparison artifact.
- Agent-only preparation surface integration.
- Deterministic fixtures for no-data, insufficient-data, valid comparison, unmapped criteria, and forbidden CMA labels.

Wave 6A: ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW.

Scope:

- ZIP, lot-size, exact/interval bed/bath, and optional listing-exposure dimensions.
- Governed geography admission plan for neighborhood/subdivision.

Wave 6B: TARGETED_HISTORICAL_EVENT_EVIDENCE_ADMISSION_REVIEW.

Scope:

- Historical MLS/IRES use reconciliation.
- Event/snapshot field coverage matrix.
- Prospective observation implementation boundary.
- Retrospective feasibility decision.

Wave 7: SUBJECT_PROPERTY_BENCHMARK_FOUNDATION_ADMISSION_REVIEW.

Scope:

- Physical-property identity population readiness.
- Sold comparable and adjustment methodology.
- Agent-only benchmark artifact contract.

## 14. Executive Decisions Required

Executive must decide:

1. Whether to authorize CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6 as the next primary implementation package.
2. Whether the Wave 6 artifact must appear first in Property Preparation, Seller Preparation, Listing Preparation, or a shared Agent-only comparison component.
3. Whether to keep the next gate strictly current-active listing context and explicitly exclude CMA/valuation/sold comps.
4. Whether to authorize a later Track A admission review for ZIP, lot size, and governed geography.
5. Whether to authorize a later Track B evidence review for historical MLS/IRES rights, coverage, snapshots, event history, and close data.

No Executive decision is required to mutate database, provider, MLS/IRES, Supabase, Typesense, CRM, customer data, secrets, public pages, exports, or deployment under this review because all are out of scope.

## 15. Final Status

Recommended certification/status:

- ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_SUBJECT_PROPERTY_BENCHMARK_PRIORITY_AND_ADMISSION_REVIEW_CERTIFIED
- READY_FOR_CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION
- CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6
- HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED
- NO_SECONDARY_PARALLEL_WORK_RECOMMENDED_FOR_NEXT_GATE

Files created or modified by this package:

- docs/project-atlas/executive-library/ADVANCED-SEGMENTATION-HISTORICAL-EVIDENCE-SUBJECT-PROPERTY-BENCHMARK-PRIORITY-AND-ADMISSION-REVIEW.md
- scripts/checkAdvancedSegmentationHistoricalEvidenceSubjectPropertyBenchmarkPriorityAdmissionReview.ts
- package.json
