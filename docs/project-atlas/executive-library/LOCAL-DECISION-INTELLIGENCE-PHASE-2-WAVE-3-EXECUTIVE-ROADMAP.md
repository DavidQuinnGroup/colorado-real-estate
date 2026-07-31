# PROJECT ATLAS(TM) Local Decision Intelligence(TM) Phase 2 Wave 3 Executive Roadmap

Status: `LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_3_READY_FOR_IMPLEMENTATION`

Date: July 31, 2026

## 1. Purpose

This executive roadmap defines the recommended remaining implementation sequence for completing Local Decision Intelligence(TM) coverage across the Colorado Front Range service territory currently supported by PROJECT ATLAS(TM) repository data.

This is a planning and architecture record only. It does not implement Wave 3, create routes, change registry eligibility, modify runtime code, activate protected capabilities, push, deploy, or authorize production work.

## 2. Baseline

Planning baseline:

- branch: `main`
- HEAD: `ef6ff227f9122ccbeb0d0232ffbba6edb18f208d`
- origin/main: `ef6ff227f9122ccbeb0d0232ffbba6edb18f208d`
- prior governed status: `LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_2_CERTIFIED_AND_CLOSED`
- required remediation: none

Current Local Decision Intelligence maturity inventory:

| Maturity | Cities |
| --- | --- |
| `ENHANCED_FOUNDATION` | Broomfield, Superior, Longmont, Denver |
| `FOUNDATION` | Erie, Westminster |
| previously certified Decision Guides | Boulder, Louisville, Lafayette |

## 3. Authoritative Repository Review

Reviewed local repository records and architecture:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-1-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-1-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-2-PLANNING-CHARTER.md`
- `docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-2-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/DECISION-GUIDE-PLATFORM-1-ARCHITECTURE.md`
- `docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-SOURCE-RIGHTS-MATRIX-1.md`
- `docs/project-atlas/executive-library/GMA-1.0-READ-ONLY-MAPPING-PREVIEW.md`
- `docs/project-atlas/executive-library/GMA-1.0-INTERNAL-REVIEW-DECISION-FIXTURE.md`
- `docs/project-atlas/executive-library/EIP-1.0-SPRINT-4-INTERNAL-GEOGRAPHIC-ACTIVATION-READINESS-LEDGER.md`
- `lib/coloradoDecisionGuideRegistry.ts`
- `lib/cities.ts`
- `data/cities.ts`
- `data/searchPages.ts`
- `lib/neighborhoods.ts`
- `lib/decisionGuidePlatform.ts`
- `scripts/checkLocalDecisionIntelligencePhase1.ts`
- `scripts/checkLocalDecisionIntelligencePhase2Wave1.ts`
- `scripts/checkLocalDecisionIntelligencePhase2Wave2.ts`
- `scripts/decisionGuideValidation.ts`

Local availability limitation:

- The repository contains REIE 7.1 adjustment, traceability, customer-experience, and sprint certification records.
- No local repository file was found matching `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1`.
- No local repository file was found matching `PROJECT ATLAS - REAL ESTATE DATA TOOLS`.
- This roadmap relies on repository-local governance, registry, route, source-rights, and certification records and does not claim review of unavailable source documents.

## 4. Executive Roadmap

Recommendation: finish the already-public `FOUNDATION` backlog first, then address canonical/search-support expansion candidates, and defer ambiguous neighborhood/submarket identities until a later enterprise intelligence phase.

The remaining Local Decision Intelligence program should proceed in this order:

1. Phase 2 Wave 3: upgrade Erie and Westminster from `FOUNDATION` to `ENHANCED_FOUNDATION`.
2. Phase 2 Wave 4: resolve and implement Niwot as a governed local-community/city-market candidate only if search support and authority language are explicitly authorized.
3. Phase 2 Wave 5: implement Brighton, Firestone, and Frederick as a northern/eastern municipal expansion wave after the missing-search-city-support pattern is resolved.
4. Phase 2 Wave 6 or enterprise transition: resolve Thornton and Gunbarrel separately because the current registry marks both with canonical-content and search-support blockers, and Gunbarrel is also represented as a Boulder neighborhood identity.

This sequence preserves certified architecture, minimizes runtime risk, keeps certification units manageable, and avoids using route existence, search intent, or neighborhood copy as automatic evidence of canonical city-level readiness.

## 5. Remaining City Inventory

Repository-supported candidates remaining after Phase 2 Wave 2:

| Candidate | Current registry posture | Current route posture | Current search posture | Recommended disposition |
| --- | --- | --- | --- | --- |
| Erie | public eligible, `FOUNDATION` | `/market/erie-co-housing-market` | supported | Wave 3 upgrade to `ENHANCED_FOUNDATION` |
| Westminster | public eligible, `FOUNDATION` | `/market/westminster-co-housing-market` | supported | Wave 3 upgrade to `ENHANCED_FOUNDATION` |
| Niwot | ineligible, `FOUNDATION`, `missing-search-city-support` | `/market/niwot-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | Wave 4 authority/search-support reconciliation candidate |
| Brighton | ineligible, `FOUNDATION`, `missing-search-city-support` | `/market/brighton-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | Wave 5 municipal expansion candidate |
| Firestone | ineligible, `FOUNDATION`, `missing-search-city-support` | `/market/firestone-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | Wave 5 municipal expansion candidate |
| Frederick | ineligible, `FOUNDATION`, `missing-search-city-support` | `/market/frederick-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | Wave 5 municipal expansion candidate |
| Thornton | ineligible, `FOUNDATION`, `missing-canonical-content-city` and `missing-search-city-support` | `/market/thornton-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | later city-level candidate after canonical-content and search-support reconciliation |
| Gunbarrel | ineligible, `FOUNDATION`, `missing-canonical-content-city` and `missing-search-city-support`; ambiguous object type | `/market/gunbarrel-co-housing-market` exists in registry and canonical city data | not supported in `data/searchPages.ts` | defer as neighborhood/submarket intelligence unless separate governance resolves city-level identity |

Cities already covered:

| Covered status | Cities |
| --- | --- |
| `ENHANCED_FOUNDATION` | Broomfield, Superior, Longmont, Denver |
| previously certified Decision Guides | Boulder, Louisville, Lafayette |

No additional cities outside repository-supported candidate sets are added by this roadmap.

## 6. Recommended Implementation Waves

### Phase 2 Wave 3: Erie And Westminster

Recommendation: `APPROVE_ERIE_AND_WESTMINSTER`

Why these cities belong together:

- Both are already public Local Decision Intelligence cities at `FOUNDATION`.
- Both have canonical market routes and supported city-search continuity.
- Both can use the proven upgrade path from Longmont and Broomfield without route, search, or canonical-identity reconciliation.
- Both close the remaining public `FOUNDATION` backlog and simplify the maturity inventory.

Why Wave 3 should precede later waves:

- It provides the highest certification efficiency with the lowest architecture risk.
- It avoids mixing clean maturity upgrades with blocked canonical/search-support work.
- It converts all existing public Phase 1 city implementations to the Phase 2 `ENHANCED_FOUNDATION` standard before expanding into less-settled candidates.

Architectural considerations:

- Reuse `ENHANCED_FOUNDATION` maturity, enhanced city configs, shared guide builder, source metadata, market route convention, and corrected continuity destination identities.
- Do not modify search behavior, registry eligibility rules, APIs, maps, GIS, providers, schema, telemetry, alerts, queues, or customer data.
- Add dedicated deterministic Wave 3 validation rather than weakening prior Wave 1 or Wave 2 certification scripts.

Certification considerations:

- Verify Erie and Westminster retain existing routes and evidence limitations.
- Verify `Search Erie Homes -> /search?city=Erie` and `Search Westminster Homes -> /search?city=Westminster`.
- Verify `Buyer Guidance`, `Seller Guidance`, `Financing Guidance`, `Grand Plan`, and `Advisory Guidance` labels match the remediated continuity contract.
- Confirm no regression to Broomfield, Superior, Longmont, Denver, Boulder, Louisville, Lafayette, search, market, buyer, seller, financing, Grand Plan, advisory/contact, property, neighborhood, disclosures, alerts, unsubscribe, and public trust boundaries.

Expected reuse opportunities:

- Longmont/Broomfield upgrade pattern.
- Existing city registry public-entry posture.
- Existing Phase 2 content sections.
- Existing route and search support.
- Existing responsive market page layout.

### Phase 2 Wave 4: Niwot Authority And Search-Support Reconciliation

Recommended scope: Niwot only, unless implementation authorization explicitly broadens the wave.

Why Niwot belongs in a separate wave:

- Niwot has canonical city data and a registry market route, but the registry is fail-closed due to `missing-search-city-support`.
- Governance records flag a municipality/community authority question requiring careful language before canonical selection.
- Treating Niwot as a single focused wave prevents the implementation from combining a local-community authority decision with unrelated municipal expansion.

Why Wave 4 should follow Wave 3:

- The public `FOUNDATION` backlog should be closed before resolving more complex object-type and search-support issues.
- Niwot can become the governed precedent for unincorporated/community Local Decision Intelligence language without blocking Erie and Westminster.

Architectural considerations:

- Preserve fail-closed behavior until search support and authority wording are explicitly reconciled.
- Use route `/market/niwot-co-housing-market` only if eligibility requirements are satisfied.
- Avoid GIS, boundary, postal, demographic, school, safety, or property-condition conclusions.

Certification considerations:

- Validate that Niwot search continuity exists before public eligibility is enabled.
- Validate explicit limitation language that citywide/community context cannot substitute for property-specific, municipal/county, title, insurance, inspection, or records review.
- Validate no unsupported claim that Niwot is a municipality if the implementation standard chooses local-community framing.

Expected reuse opportunities:

- Superior fail-closed reconciliation pattern.
- Existing canonical city data and route naming convention.
- Existing `ENHANCED_FOUNDATION` content model with stronger authority limitations.

### Phase 2 Wave 5: Brighton, Firestone, And Frederick

Recommended scope: Brighton, Firestone, and Frederick.

Why these cities belong together:

- All three are canonical city-data candidates with market routes and the same registry blocker: `missing-search-city-support`.
- They form a manageable northern/eastern municipal expansion group after the search-support reconciliation pattern is proven.
- They share implementation prerequisites without requiring neighborhood/submarket identity decisions.

Why Wave 5 should follow Niwot:

- Niwot provides the first controlled search-support reconciliation after the clean Wave 3 upgrade.
- A three-city municipal expansion should not be the first place to test the search-support governance path.

Architectural considerations:

- Add search support through existing conventions only if authorized.
- Preserve registry safeguards until each city satisfies canonical route, search, content, evidence, and validation requirements.
- Keep content differentiated by municipal context, housing-stock pattern, transportation relationships, development pattern, and property-specific due diligence.

Certification considerations:

- Use one dedicated Wave 5 check or a reusable remaining-city check that asserts each city independently.
- Confirm no weakening of Erie, Westminster, Broomfield, Superior, Longmont, Denver, Boulder, Louisville, or Lafayette maturity.
- Confirm no new provider, GIS, map, schema, API, telemetry, alert, worker, queue, or customer-data behavior.

Expected reuse opportunities:

- Niwot search-support reconciliation pattern.
- Phase 2 `ENHANCED_FOUNDATION` architecture.
- Shared content and validation contracts.

### Phase 2 Wave 6 Or Enterprise Transition: Thornton And Gunbarrel

Recommended scope: split the candidates by object-type risk.

Thornton should remain a later city-level candidate after canonical-content and search-support blockers are resolved. Repository governance identifies Thornton as a strong municipality preview candidate, but current public registry eligibility remains fail-closed.

Gunbarrel should not be implemented as a city-level Local Decision Intelligence route during Phase 2 unless separate governance resolves its object type. Current repository evidence represents Gunbarrel both as a city/market candidate and as a Boulder neighborhood identity, and GMA records flag it as `AMBIGUOUS_OBJECT_TYPE` with manual review required.

Why this should follow earlier waves:

- Thornton and Gunbarrel carry higher governance risk than Erie, Westminster, Niwot, Brighton, Firestone, and Frederick.
- Gunbarrel overlaps directly with neighborhood/submarket intelligence questions that are outside the current Local Decision Intelligence city-level scope.
- Thornton requires canonical-content and search-support reconciliation before public eligibility can be certified.

Architectural considerations:

- Thornton can be planned as a city-level implementation only after canonical-content and search support are reconciled.
- Gunbarrel should be treated as a later neighborhood/submarket or enterprise-market-intelligence candidate unless governance explicitly separates city, neighborhood, and market-area identities.
- Do not create public routes, boundaries, polygon logic, GIS, maps, or search behavior from the ambiguous object-type evidence.

Certification considerations:

- Do not certify Gunbarrel city-level Local Decision Intelligence while it remains a same-name city/neighborhood conflict.
- Do not infer market-area identity from route slugs.
- Require object-type, alias, boundary, and search-support decisions before implementation authorization.

Expected reuse opportunities:

- Future enterprise submarket intelligence architecture.
- GMA/EIP conflict-resolution records.
- Local Decision Intelligence content model only if city-level identity is explicitly authorized.

## 7. Recommended Wave 3 Scope

Recommended Wave 3 implementation authorization:

`LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_3_IMPLEMENTATION_AUTHORIZATION`

Authorized cities to include:

1. Erie, Colorado
2. Westminster, Colorado

Wave 3 objective:

- Upgrade Erie from `FOUNDATION` to `ENHANCED_FOUNDATION`.
- Upgrade Westminster from `FOUNDATION` to `ENHANCED_FOUNDATION`.
- Preserve existing routes:
  - `/market/erie-co-housing-market`
  - `/market/westminster-co-housing-market`
- Preserve prior evidence limitations and protected-boundary metadata.
- Use the Phase 2 `ENHANCED_FOUNDATION` completeness standard without expanding it.
- Add deterministic Wave 3 validation.
- Stop after one local implementation commit unless push and production certification are separately authorized.

Wave 3 should not include:

- Niwot
- Gunbarrel
- Thornton
- Brighton
- Firestone
- Frederick
- new neighborhood intelligence
- GIS, map-boundary, provider, AI, personalization, telemetry, schema, API, alert, queue, worker, email, customer-data, search-ranking, or production-data changes

## 8. Enhanced Foundation Standard

The Phase 2 `ENHANCED_FOUNDATION` standard remains sufficient. No expansion is recommended for Wave 3.

Each Wave 3 city should include:

- Decision Snapshot
- Local Character
- Market Drivers
- neutral conditional lifestyle decision criteria
- Buyer Guidance
- Seller Guidance
- due-diligence prompts
- maturity transparency
- evidence limitations
- city-specific relevance
- exact Decision Journey continuity
- responsive quality
- prohibited-claim and fair-housing safety
- deterministic certification

Wave 3 should promote Erie and Westminster only after the complete standard is locally certified.

## 9. Content And Evidence Rules

Acceptable content:

- durable local context
- municipal and development pattern
- housing-stock characteristics
- transportation and regional-access framework
- commercial and employment-center influences where supportable
- recreation and geographic context
- property-age and maintenance review prompts
- title, property-record, HOA, inspection, insurance, environmental, municipal, and qualified professional due-diligence prompts where framed as verification needs

Evidence boundaries:

- Use repository-local city market data and established governance records only.
- Do not invent current statistics, provider-derived conclusions, rankings, or forecasts.
- Do not use page existence, market-route slugs, search-intent pages, polygon fixtures, or neighborhood copy as standalone canonical evidence.
- Treat current or unstable facts as unsupported unless separately verified and authorized.

Prohibited claim categories:

- steering
- demographic targeting or protected-class proxies
- school ratings
- safety ratings
- city or neighborhood rankings
- suitability declarations
- investment recommendations
- appreciation forecasts
- valuation claims
- urgency claims
- unsupported causation
- definitive property, insurance, environmental, soil, structural, drainage, or hazard conclusions

## 10. Route And Journey Plan

Wave 3 route plan:

| City | Route | Search continuity |
| --- | --- | --- |
| Erie | `/market/erie-co-housing-market` | `/search?city=Erie` |
| Westminster | `/market/westminster-co-housing-market` | `/search?city=Westminster` |

Required continuity model for each city:

| Label | Destination | Destination identity |
| --- | --- | --- |
| `Search {City} Homes` | `/search?city={City}` | `city-search` |
| `Buyer Guidance` | `/buy` | `buyer-guidance` |
| `Seller Guidance` | `/sell` | `seller-guidance` |
| `Financing Guidance` | `/buy#financing-confidence` | `financing-confidence` |
| `Grand Plan` | `/grand-plan` | `grand-plan` |
| `Advisory Guidance` | `/contact` | `advisory` |

CTA labels must be rendered from governed continuity semantics and must not be derived from overloaded destination identities.

## 11. Validation And Certification Plan

Recommended local validation for Wave 3:

- `git diff --check`
- `npm run check:local-decision-intelligence-phase-1`
- `npm run check:local-decision-intelligence-phase-2-wave-1`
- `npm run check:local-decision-intelligence-phase-2-wave-2`
- new `npm run check:local-decision-intelligence-phase-2-wave-3`
- Colorado Decision Guide generation checks
- Boulder Decision Guide check
- Louisville Decision Guide check
- Lafayette Decision Guide check
- Decision Journey check
- Grand Plan journey safety check
- public runtime safety
- search runtime safety
- public trust readiness
- unsubscribe safety
- relevant alert dry-run checks in non-sending mode only
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- local public route smoke checks
- local browser review for Erie and Westminster at desktop, tablet, and mobile
- browser Back behavior from each city route to city-filtered search and back

The Wave 3 deterministic check should assert:

- Erie route and maturity
- Westminster route and maturity
- complete enhanced architecture for both cities
- city-specific content tokens for each city
- evidence limitation language
- exact continuity labels, destinations, and identities
- no prohibited claims
- preserved maturity for Broomfield, Superior, Longmont, Denver, Boulder, Louisville, Lafayette
- no public eligibility changes for Niwot, Gunbarrel, Thornton, Brighton, Firestone, or Frederick

## 12. Likely Implementation File Plan

Likely required for Wave 3 implementation:

- `lib/decisionGuidePlatform.ts`
- `lib/coloradoDecisionGuideRegistry.ts`
- `scripts/checkLocalDecisionIntelligencePhase1.ts`
- new `scripts/checkLocalDecisionIntelligencePhase2Wave3.ts`
- `package.json`
- `tsconfig.worker.json`

Conditionally required:

- `scripts/checkLocalDecisionIntelligencePhase2Wave1.ts`, only if shared validation expectations need explicit preservation updates
- `scripts/checkLocalDecisionIntelligencePhase2Wave2.ts`, only if shared preservation expectations need explicit preservation updates
- shared validation utilities, only if they reduce duplication without altering prior certification meaning
- `docs/CHAT_START.md`, only for active handoff after local implementation certification

Prohibited or unnecessary for Wave 3 implementation:

- `app/market/[city]/page.tsx`, unless a genuine shared-rendering defect is discovered
- `lib/cities.ts`, because Erie and Westminster are already canonical and route-supported
- `data/searchPages.ts`, because Erie and Westminster search continuity is already supported
- neighborhood records
- Prisma schema or migrations
- public APIs
- map, GIS, provider, telemetry, cookie/storage, ranking, valuation, alert, queue, worker, email, environment, dependency, deployment, or production-data files

## 13. Risks And Dependencies

| Risk | Level | Mitigation |
| --- | --- | --- |
| Erie/Westminster content remains too generic for `ENHANCED_FOUNDATION` | Moderate | Require city-specific tokens and local decision criteria in the Wave 3 deterministic check. |
| Existing `FOUNDATION` preservation expectations fail after maturity promotion | Low | Update Phase 1 preservation logic to allow Erie and Westminster promotion only with explicit Wave 3 assertions. |
| Continuity labels regress to prior overloaded destination behavior | Low | Reuse the Wave 1 remediation identity contract and assert exact label/href/identity combinations. |
| Niwot is implemented prematurely as a city without authority/search-support resolution | Moderate | Exclude Niwot from Wave 3 and document it as a Wave 4 reconciliation candidate. |
| Gunbarrel is treated as city-level despite same-name neighborhood conflict | High | Defer Gunbarrel to neighborhood/submarket or enterprise object-type resolution; do not include in Phase 2 Wave 3. |
| Brighton, Firestone, Frederick search-support blockers are weakened instead of resolved | Moderate | Keep them ineligible until a later authorized wave satisfies search support through existing conventions. |
| Thornton is treated as ready because canonical city data exists | Moderate | Preserve fail-closed status until canonical-content and search-support blockers are resolved. |
| Source-rights scope is over-expanded | High | Use repository-local evidence only; do not activate government, permit, recorder, imagery, provider, GIS, or live data sources. |
| Protected capabilities are accidentally activated during implementation | Low | Keep Wave 3 limited to city config and deterministic checks; run public runtime, search runtime, unsubscribe, and alert dry-run safety checks. |

## 14. Long-Term Implementation Sequence

Recommended sequence:

1. Close Phase 2 Wave 3: Erie and Westminster upgrades.
2. Plan and implement Phase 2 Wave 4: Niwot authority/search-support reconciliation if still desired after Wave 3.
3. Plan and implement Phase 2 Wave 5: Brighton, Firestone, and Frederick municipal expansion after search-support conventions are proven.
4. Plan Thornton separately as a later city-level implementation candidate once canonical-content and search-support blockers are resolved.
5. Defer Gunbarrel to neighborhood/submarket or enterprise market intelligence unless governance explicitly resolves city, neighborhood, market-area, alias, and route identity conflicts.

## 15. Executive Recommendation

Executive recommendation:

`LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_3_IMPLEMENTATION_AUTHORIZATION`

Recommended Wave 3 scope:

- Erie, Colorado
- Westminster, Colorado

Planning finding:

`LOCAL_DECISION_INTELLIGENCE_PHASE_2_WAVE_3_READY_FOR_IMPLEMENTATION`

Required remediation: none.

This recommendation does not authorize implementation, push, deployment, production certification, another city, neighborhood intelligence, GIS, providers, search-ranking changes, schema/API changes, alerts, queues, workers, email, customer data, or any protected capability.
