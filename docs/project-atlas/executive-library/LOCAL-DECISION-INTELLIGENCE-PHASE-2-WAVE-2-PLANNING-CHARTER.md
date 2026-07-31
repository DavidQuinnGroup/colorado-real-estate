# PROJECT ATLAS(TM) Local Decision Intelligence(TM) Phase 2 Wave 2 Planning Charter

Status: `LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_2_PLANNING_READY_FOR_IMPLEMENTATION`

Date: July 31, 2026

## 1. Purpose

This planning charter defines the authorized implementation-ready scope for Local Decision Intelligence(TM) Phase 2 Wave 2.

This is a planning and architecture record only. It does not implement Broomfield, implement Superior, change public runtime behavior, activate protected capabilities, push, deploy, or authorize Wave 2 implementation.

## 2. Baseline

Planning baseline:

- branch: `main`
- HEAD: `88a0b4b7a404c4f8f7e369117cf2f66e9f1f8795`
- origin/main: `88a0b4b7a404c4f8f7e369117cf2f66e9f1f8795`
- prior governed status: `LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_1_CERTIFIED_AND_CLOSED`
- required remediation: none

Current certified Local Decision Intelligence coverage:

| Maturity | Cities |
| --- | --- |
| `ENHANCED_FOUNDATION` | Longmont, Denver |
| `FOUNDATION` | Broomfield, Erie, Westminster |
| previously certified Decision Guides | Boulder, Louisville, Lafayette |

## 3. Authoritative Repository Review

Reviewed local repository records:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-1-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-1-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/DECISION-GUIDE-PLATFORM-1-ARCHITECTURE.md`
- `docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-ACQUISITION-ENRICHMENT-1-IMPLEMENTATION.md`
- `docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-EVIDENCE-EXPANSION-1-IMPLEMENTATION.md`
- `docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-SOURCE-RIGHTS-MATRIX-1.md`
- `docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-REQUIREMENTS-REGISTER.md`
- `docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-TRACEABILITY-MATRIX.md`
- `lib/coloradoDecisionGuideRegistry.ts`
- `lib/cities.ts`
- `lib/decisionGuidePlatform.ts`
- `lib/neighborhoods.ts`
- `lib/marketReport.ts`
- `scripts/checkLocalDecisionIntelligencePhase1.ts`
- `scripts/checkLocalDecisionIntelligencePhase2Wave1.ts`
- `scripts/decisionGuideValidation.ts`

Local availability limitation:

- The repository contains the REIE 7.1 adjustments and traceability records.
- No local repository file was found matching `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1`.
- No local repository file was found matching `PROJECT ATLAS - REAL ESTATE DATA TOOLS`.
- This charter therefore relies on the available repository-local architecture, governance, source-rights, and certification records and does not claim review of unavailable source documents.

## 4. City-Pairing Decision

Recommendation: `APPROVE_BROOMFIELD_AND_SUPERIOR`

Broomfield and Superior are the correct Wave 2 pairing if implementation authorization explicitly includes the Superior route/data reconciliation prerequisite described in this charter.

Rationale:

| Criterion | Finding |
| --- | --- |
| Business value | Broomfield is already public and certified at `FOUNDATION`; Superior is a nearby high-relevance Boulder County city already present in repository evidence pathways. |
| Geographic authority | Broomfield has a complete public city-market route and registry entry. Superior has neighborhood records and legacy market-report evidence, but the current Decision Guide registry marks it ineligible because the canonical city route and market data are missing. |
| Architectural reuse | Broomfield can reuse the Wave 1 `ENHANCED_FOUNDATION` upgrade path. Superior can reuse the same architecture after canonical city data and registry eligibility are reconciled. |
| Manageable implementation size | Two cities remains manageable if Superior reconciliation stays minimal and limited to existing city-market conventions. |
| Content differentiation | Broomfield and Superior have different durable local contexts: Broomfield should emphasize municipal/county structure, regional access, mixed development, and housing-stock variation; Superior should emphasize planned-community patterns, Boulder County context, redevelopment/rebuilding sensitivity, regional access, and due-diligence verification. |
| Certification efficiency | Broomfield validates upgrade preservation. Superior validates new-city onboarding after Wave 1 remediation improved continuity semantics. |
| Relationship to certified coverage | The pair expands from Longmont/Denver into one existing Phase 1 city and one adjacent Boulder County candidate without broadening into a large multi-city wave. |

Planning conclusion:

- Broomfield is implementation-ready as an upgrade candidate.
- Superior is pairing-approved but not implementation-ready until the implementation task reconciles canonical city-market data and Decision Guide registry eligibility.
- If implementation authorization does not include the Superior reconciliation prerequisite, the pair should be revised before implementation.

## 5. Broomfield Upgrade Scope

Broomfield should move from `FOUNDATION` to `ENHANCED_FOUNDATION` only if the implementation satisfies the full Phase 2 completeness standard.

Preserve:

- existing public route: `/market/broomfield-co-housing-market`
- existing `FOUNDATION` certification evidence until promotion is locally certified
- existing city data and search path
- limitation-forward language
- no-neighborhood-evidence fallback behavior unless separate governed neighborhood evidence is certified
- prior protected-boundary assertions

Required enhancements:

- Decision Snapshot refined from foundation orientation into a concise Broomfield-specific decision overview
- Local Character covering durable municipal/county structure, development pattern, housing-stock variation, transportation framework, commercial/employment access, recreation/geographic context, and planning influences where supportable
- Market Drivers covering inventory structure, housing-type distribution, land/development pattern, regional access, employment/commercial centers, municipal context, and seasonal or property-type review without forecasts
- conditional Lifestyle Decision Considerations using structures such as `If commuting matters`, `If newer construction matters`, `If lot size matters`, `If municipal context matters`, and `If access to recreation matters`
- Buyer Guidance covering housing types, location tradeoffs, property age, maintenance exposure, new construction or established-area review, transportation, municipal/geographic factors, and evidence limitations
- Seller Guidance covering presentation, condition documentation, buyer comparison context, local competition, property-type differentiation, and advisor next steps without pricing promises
- Due-Diligence Considerations covering property age, construction type, HOA documents where applicable, title/property-record review, municipal requirements, insurance review, environmental/geographic review where relevant, and qualified professional review
- maturity and evidence transparency disclosing `ENHANCED_FOUNDATION` only after all requirements pass
- Decision Journey continuity using the Wave 1 remediation label-to-destination semantics
- responsive review at desktop, tablet, and mobile

Existing Broomfield foundation content that can be preserved:

- city market route and search continuity
- existing market statistics as bounded repository-local orientation
- foundation verification language around property records, disclosures, costs, condition, financing readiness, and advisor review
- protected-boundary metadata and trust language

Areas requiring material enhancement:

- locally specific development and municipal context
- housing-stock and property-type differentiation
- Broomfield-specific market drivers and decision criteria
- richer buyer/seller/due-diligence guidance
- `ENHANCED_FOUNDATION` evidence limitations

## 6. Superior New-City Scope

Superior may be implemented at `ENHANCED_FOUNDATION` only after the implementation reconciles its fail-closed registry state.

Current repository evidence:

- `lib/coloradoDecisionGuideRegistry.ts` contains Superior as an ineligible entry with `marketRoute: null`, `guideMaturity: 'EVIDENCE_BACKED'`, and ineligibility reasons `missing-market-route` and `missing-market-data`.
- `lib/cities.ts` does not currently include Superior in the canonical city market route list.
- `lib/marketReport.ts` contains a legacy Superior market report.
- `lib/neighborhoods.ts` contains Superior neighborhood records for Rock Creek, Sagmore, and Original Superior.
- Colorado City Intelligence records identify Superior as evidence-relevant but fail-closed because of incomplete source coverage and unresolved registry/geographic conflicts.

Required implementation prerequisites:

- add Superior to the canonical city data only if authorized in implementation scope
- assign canonical route `/market/superior-co-housing-market`
- reconcile Decision Guide registry eligibility from fail-closed to public eligible only after route and market data support exist
- ensure Superior is not promoted to `EVIDENCE_BACKED` or `EDITORIALLY_CERTIFIED`
- preserve unresolved geographic/source conflict boundaries; do not convert internal geographic knowledge, preview mappings, or neighborhood records into authoritative GIS or customer-visible geographic claims

Required Superior content themes:

- planned-community and development patterns
- housing-stock age and form
- rebuilding and redevelopment context framed cautiously and historically/durably
- transportation and regional access toward Boulder County, Denver/Boulder routes, and nearby employment/service centers
- commercial and municipal context
- geographic constraints and location-specific due diligence
- property-condition and due-diligence considerations
- relationship to Boulder County and nearby markets

Sensitive-context rules:

- Do not assert current fire damage, current property condition, insurance availability, insurance pricing, soil conditions, environmental conditions, structural conditions, school quality, safety, demographics, investment performance, future appreciation, or neighborhood suitability.
- Any rebuilding, hazard, insurance, construction, environmental, or geographic context must be framed as a matter for qualified verification through property records, municipal records, disclosures, inspections, insurance review, title review, and professional advice.
- Neighborhood names may be used only as repository-local context and not as rankings, suitability comparisons, or conclusive local-market claims.

## 7. Enhanced Foundation Completeness Standard

The Wave 1 standard remains sufficient for Wave 2. No standard expansion is required.

Wave 2 `ENHANCED_FOUNDATION` completeness requires:

- Decision Snapshot that explains what materially shapes the local housing environment, what deserves deeper review, what the platform can and cannot conclude, and the most relevant next action
- Local Character with durable factual context
- Market Drivers with observable, non-predictive influences
- neutral conditional Lifestyle Decision Considerations
- Buyer Guidance
- Seller Guidance
- due-diligence prompts framed through qualified verification
- maturity transparency
- evidence limitations
- CTA and Decision Journey continuity
- responsive quality
- prohibited-claim and fair-housing safety
- reusable architecture alignment
- deterministic certification

Necessary refinement:

- Wave 2 validation should be named and scoped as Phase 2 Wave 2 rather than extending the Wave 1 check in place. This preserves closure evidence for Wave 1 while allowing Wave 2 to assert Broomfield/Superior-specific prerequisites.

## 8. Reusable Architecture Plan

Preferred architecture:

- reuse `ENHANCED_FOUNDATION` maturity
- reuse `EnhancedFoundationCityConfig`
- reuse `buildEnhancedFoundationDecisionGuide`
- reuse `DECISION_GUIDE_ENHANCED_FOUNDATION_SOURCE`
- reuse `buildDecisionGuideContinuityLinks`
- reuse explicit destination identities from Wave 1 remediation:
  - `city-search`
  - `buyer-guidance`
  - `seller-guidance`
  - `financing-confidence`
  - `grand-plan`
  - `advisory`
- reuse the existing market page presentation and data attributes
- reuse existing public route convention `/market/{city}-co-housing-market`
- reuse existing search route convention `/search?city={City}`

Recommended minimal architecture changes:

- expand `EnhancedFoundationDecisionGuideKey` to include `broomfield` and `superior`
- add Broomfield and Superior entries to `ENHANCED_FOUNDATION_CITY_CONFIGS`
- make Superior eligible in the registry only after canonical city data and market route support are added
- add a new deterministic `checkLocalDecisionIntelligencePhase2Wave2.ts` rather than mutating the Wave 1 certification script into a different scope
- update Phase 1 preservation expectations so Broomfield may be `ENHANCED_FOUNDATION` after Wave 2 while Erie and Westminster remain `FOUNDATION`

Avoid:

- new frontend components
- broad market page refactors
- new data-provider abstractions
- GIS or mapping integration
- route-specific rendering branches for Broomfield or Superior
- copy-only implementation without deterministic checks

## 9. Content And Evidence Plan

Acceptable durable local context:

- municipal/county structure and planning posture where phrased generally and verified from repository-supported knowledge
- development pattern
- housing-stock characteristics
- transportation framework
- regional access relationships
- commercial/employment centers
- recreation and geography
- broad rebuilding/redevelopment context for Superior only when limitation-forward
- property-age, construction-type, HOA, title, record, inspection, insurance-review, and municipal-review prompts

Evidence limitations:

- repository-local city market data and neighborhood records can support bounded orientation
- current statistics must not be invented or refreshed externally during implementation
- legacy Superior market report data must not become public certification unless reconciled through canonical city-market architecture
- government, permit, recorder, planning, imagery, and Boulder County open-data sources remain blocked from customer display or durable storage unless separately authorized and source-rights-reviewed

Required language patterns:

- `If commuting matters...`
- `If newer construction matters...`
- `If lot size matters...`
- `If access to recreation matters...`
- `If established housing matters...`
- `Verify through qualified sources or professionals...`
- `This page is ENHANCED_FOUNDATION maturity...`
- `This guide does not forecast, rank, value, certify, or replace property-specific review...`

Prohibited claim categories:

- best-place or best-neighborhood claims
- safety, school, crime, demographic, protected-class, or suitability claims
- forecasts, appreciation predictions, urgency claims, valuation, pricing superiority, or investment recommendations
- unsupported environmental, soil, structural, insurance, hazard, or current-condition conclusions
- provider-derived or regulatory certification claims

Fair-housing safeguards:

- frame local context around property facts, access relationships, housing form, municipal context, records, costs, and verification needs
- avoid steering language
- avoid demographic proxies
- avoid school or safety ratings
- avoid neighborhood ranking or suitability comparisons

## 10. Route And Journey Plan

Expected Wave 2 routes:

- Broomfield: `/market/broomfield-co-housing-market`
- Superior: `/market/superior-co-housing-market`

Superior route prerequisite:

- `/market/superior-co-housing-market` cannot be certified until `lib/cities.ts` includes Superior with `marketSlug: "superior-co-housing-market"` and the Decision Guide registry has a matching public-eligible market route.

Required continuity for both cities:

| Label | Destination | Destination identity |
| --- | --- | --- |
| `Market Context` | city market route | `market` |
| `Search Broomfield Homes` / `Search Superior Homes` | `/search?city=Broomfield` / `/search?city=Superior` | `city-search` |
| `Buyer Guidance` | `/buy` | `buyer-guidance` |
| `Seller Guidance` | `/sell` | `seller-guidance` |
| `Financing Guidance` | `/buy#financing-confidence` | `financing-confidence` |
| `Grand Plan` | `/grand-plan` | `grand-plan` |
| `Advisory Guidance` | `/contact` | `advisory` |

Browser Back behavior must be checked after city-search navigation for both Broomfield and Superior.

## 11. Validation And Certification Plan

Required local validation:

- `git diff --check`
- `npm run check:local-decision-intelligence-phase-1`
- `npm run check:local-decision-intelligence-phase-2-wave-1`
- new `npm run check:local-decision-intelligence-phase-2-wave-2`
- `npm run check:boulder-decision-guide`
- `npm run check:louisville-decision-guide`
- `npm run check:lafayette-decision-guide`
- `npm run check:decision-journey-experience`
- `npm run check:grand-plan-journey-safety`
- `npm run check:public-runtime-safety`
- `npm run check:search-runtime-safety`
- `npm run check:public-trust-readiness`
- `npm run check:unsubscribe-safety`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Required deterministic Wave 2 check assertions:

- Broomfield and Superior exist in canonical city data after implementation
- Broomfield and Superior use canonical market slugs
- registry entries are public eligible
- both disclose `ENHANCED_FOUNDATION`
- neither is promoted to `EVIDENCE_BACKED` or `EDITORIALLY_CERTIFIED`
- Superior no longer carries `missing-market-route` or `missing-market-data` after implementation
- guide identity preserves non-predictive boundaries
- Decision Snapshot fields are complete and city-specific
- Local Character, Market Drivers, conditional lifestyle criteria, Buyer Guidance, Seller Guidance, due-diligence questions, and evidence limitations meet minimum counts
- continuity label/href/destination identities match the Wave 1 remediation contract
- prohibited claims and activation text are absent
- protected-boundary flags remain false
- preserved cities retain correct maturity:
  - Longmont and Denver remain `ENHANCED_FOUNDATION`
  - Erie and Westminster remain `FOUNDATION`
  - Boulder, Louisville, and Lafayette remain `EDITORIALLY_CERTIFIED`

Required browser and route certification:

- local HTTP 200 for Broomfield, Superior, Longmont, Denver, Erie, Westminster, Boulder, Louisville, Lafayette, homepage, search, market, buyer, seller, financing confidence, Grand Plan, contact, disclosures, representative property, and representative neighborhood
- responsive browser review for Broomfield and Superior at desktop `1440 x 1100`, tablet `768 x 1024`, and mobile `390 x 844`
- no horizontal overflow
- no broken or overlapping content
- visible `ENHANCED_FOUNDATION`
- corrected CTA labels
- no console or runtime errors
- browser Back after city-search navigation for both cities

Production certification should mirror the local certification scope after a separately authorized implementation push.

## 12. Likely Implementation File Plan

Likely required:

- `lib/decisionGuidePlatform.ts`
- `lib/coloradoDecisionGuideRegistry.ts`
- `lib/cities.ts`
- `scripts/checkLocalDecisionIntelligencePhase1.ts`
- `scripts/checkLocalDecisionIntelligencePhase2Wave1.ts`
- `scripts/checkLocalDecisionIntelligencePhase2Wave2.ts`
- `package.json`
- `tsconfig.worker.json`

Conditionally required:

- `lib/marketReport.ts` only if the implementation reconciles or retires legacy Superior market-report evidence into the canonical city path
- `docs/CHAT_START.md` only for implementation handoff or certification closure
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-2-IMPLEMENTATION.md` or equivalent implementation record if repository governance requires it during implementation
- `app/market/[city]/page.tsx` only if validation proves a generic page-level metadata or phase label needs wave-agnostic correction; no city-specific rendering branch should be added

Prohibited or unnecessary:

- public page redesigns
- new frontend components
- APIs
- Prisma schema
- migrations
- search ranking
- map boundaries
- provider adapters
- telemetry
- AI or personalization files
- alerts, queues, workers, email, notifications
- environment variables
- package dependencies
- deployment configuration

## 13. Risks And Mitigations

| Risk | Classification | Mitigation |
| --- | --- | --- |
| Superior lacks canonical city-market route and is currently registry-ineligible. | HIGH | Implementation authorization must include minimal `lib/cities.ts` and registry reconciliation before Superior can be certified. If this is not authorized, revise the city pair. |
| Superior has unresolved geographic/source conflict references in GMA/EIP records. | HIGH | Treat those records as fail-closed governance evidence only. Do not activate GIS, map boundaries, property relationships, or authoritative geography. |
| Superior rebuilding/hazard context could drift into unsupported current-condition, insurance, safety, or environmental claims. | HIGH | Require limitation-forward copy, qualified-source language, prohibited-claim scans, and no definitive property or insurance conclusions. |
| Broomfield upgrade could accidentally weaken Phase 1 evidence limitations. | MODERATE | Preserve existing route and limitation posture; require Phase 1 and Wave 2 checks to confirm authorized maturity and evidence boundaries. |
| Existing `EnhancedFoundationDecisionGuideKey` is hard-coded to Wave 1 cities. | MODERATE | Expand the union only for authorized Wave 2 cities; avoid broader abstraction unless needed by type safety. |
| Validation gap if Wave 1 check is reused directly for Wave 2. | MODERATE | Add a dedicated Wave 2 deterministic check and keep Wave 1 closure evidence stable. |
| Content differentiation may be thin if implementation uses generic city copy. | MODERATE | Require city-specific local-character, market-driver, buyer/seller, and due-diligence assertions for Broomfield and Superior. |
| Scope creep into GIS, providers, imagery, source-rights, or neighborhood intelligence. | HIGH | Keep implementation bounded to repository-local city-market data and durable local context; maintain protected-boundary checks. |
| Responsive density could regress as content grows. | MODERATE | Require browser review at desktop, tablet, and mobile with overflow and console checks. |
| Accidental maturity inflation. | MODERATE | Certify only `ENHANCED_FOUNDATION`; explicitly assert no `EVIDENCE_BACKED` or `EDITORIALLY_CERTIFIED` promotion. |

## 14. Implementation Authorization Recommendation

Recommended next authorization:

`LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_2_IMPLEMENTATION_AUTHORIZATION`

The implementation authorization should explicitly include:

- Broomfield upgrade from `FOUNDATION` to `ENHANCED_FOUNDATION`
- Superior canonical city-market route and registry reconciliation
- Superior implementation at `ENHANCED_FOUNDATION` only if route/data prerequisites pass
- a new deterministic Wave 2 validation script
- preservation of Wave 1 remediation continuity semantics
- local validation, browser review, one implementation commit, and no push/deploy unless separately authorized

This recommendation does not authorize implementation.

## 15. Planning Finding

Planning finding:

`LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_2_READY_FOR_IMPLEMENTATION`

Required remediation: none.

Implementation remains blocked until explicit implementation authorization is granted.
