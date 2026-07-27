# PROJECT ATLAS(tm) - CEP 1.0 Remaining Investment Review(tm)

Status: `CEP_1_0_REMAINING_INVESTMENT_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 27, 2026

## 1. Executive Summary

CEP 1.0 Sprints 1-3 are certified and closed:

- Sprint 1: Search and Map Experience
- Sprint 2: Property Intelligence Experience
- Sprint 3: Conversion and Seller Acquisition

The certified customer journey now substantially supports:

`Discover -> Evaluate -> Engage`

This review evaluates the strongest remaining CEP investment opportunities and recommends one next implementation program for separate executive authorization.

Final planning outcome:

`CEP_1_0_REMAINING_INVESTMENT_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Recommended next implementation program:

`CEP_1_0_MARKET_INTELLIGENCE_EXPERIENCE_AND_OPTIMIZATION`

This document does not authorize Sprint 4, runtime implementation, UI changes, API changes, deployment, database changes, provider activation, GIS work, AI activation, or production mutation.

## 2. Baseline

- Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`
- Branch: `main`
- Starting HEAD: `6e929e53993dc1742d6ebb1488880f8d4844a119`
- Starting origin/main: `6e929e53993dc1742d6ebb1488880f8d4844a119`
- Initial working tree: clean
- Remote confirmation: `git fetch origin main` completed successfully before documentation work.

Recent commits reviewed:

- `6e929e5 Certify CEP 1.0 Sprint 3 in production`
- `9e150e2 Implement CEP 1.0 Conversion and Seller Acquisition Baseline`
- `4485f7f Certify CEP 1.0 Sprint 2 in production`
- `324fc0c Implement CEP 1.0 Property Intelligence Experience`
- `56252b6 Certify CEP 1.0 Sprint 1 in production`

## 3. Authorization

David authorized repository analysis, architecture review, capability inventory, customer journey review, documentation, prioritization, roadmap refinement, documentation commit, and documentation push for the CEP 1.0 Remaining Investment Review.

Not authorized:

- Sprint 4 implementation
- runtime implementation
- UI changes
- API changes
- deployment
- database changes
- Prisma schema changes
- migrations
- provider activation
- GIS Sprint 9
- AI runtime activation
- production mutation
- customer-visible production action

## 4. Review Methodology

The review used repository evidence from:

- certified CEP Sprint 1-3 records
- the CEP 1.0 architecture roadmap
- public route inventory under `app/**`
- customer-facing components under `components/**`
- market, neighborhood, analytics, AI, GIS, search, property, seller, and conversion modules under `lib/**`
- deterministic safety and smoke scripts under `scripts/**`
- GIS, EKCP, EIP, and public/protected intelligence governance records

Each candidate was scored using the weighted model in Section 7. Scores are directional planning evidence, not implementation authorization.

## 5. Current Customer-Journey State

Certified CEP coverage now supports:

- Discover: `/search`, search API, map/list controls, zero-result recovery, degraded fallback messaging, selected-property navigation.
- Evaluate: property detail decision brief, source and freshness posture, public-fact confidence boundary, related listings, inquiry visibility.
- Engage: buyer inquiry guidance, tour-intent guidance, selected-property conversion guidance, seller review guidance, post-confirmation recovery paths.

Remaining investment should therefore avoid rebuilding the same journey. It should either increase qualified demand into the certified journey or improve continuity between existing certified surfaces.

## 6. Candidate Repository Evidence

### A. Navigation and Conversion Optimization

Repository evidence:

- `app/layout.tsx`
- `components/Footer.tsx`
- `components/internal-links/*`
- `components/CityNavigation.tsx`
- `components/ContextLinks.tsx`
- `components/RelatedContent.tsx`
- `components/RelatedPropertyLinks.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- Sprint 1-3 certified search, property, and conversion paths

Strengths:

- High implementation readiness.
- Low dependency and governance complexity.
- Directly reuses certified Sprint 1-3 work.
- Likely fast time to visible value.

Constraints:

- Lower differentiation than market/community intelligence.
- Benefit is incremental unless tied to a larger information architecture objective.
- Measurement is only partially ready because analytics activation and new persistence are not authorized.

Planning conclusion:

Strong optimization candidate, but not the highest-return standalone program after Sprints 1-3 because it mainly improves existing path efficiency rather than expanding qualified demand or local-market authority.

### B. Community and Neighborhood Intelligence

Repository evidence:

- `app/market/[city]/[slug]/page.tsx`
- `components/CityGuides.tsx`
- `components/CityNeighborhoods.tsx`
- `components/NearbyNeighborhoods.tsx`
- `components/NeighborhoodMarketLink.tsx`
- `components/NeighborhoodStats.tsx`
- `components/NeighborhoodOverlayMap.tsx`
- `lib/neighborhoods.ts`
- `lib/neighborhoodPolygons.ts`
- `lib/schema/neighborhoodSchema.ts`
- `lib/geographic-intelligence/*`
- GIS 1.0 Sprint 1-8 governance records
- EKCP and EIP geographic readiness records

Strengths:

- High customer value and differentiation.
- Existing neighborhood pages and schemas provide useful starting surfaces.
- Strong local-authority fit for the brand.

Constraints:

- GIS provider progression remains paused after Sprint 8.
- GIS Sprint 9 is not authorized.
- Runtime geographic consumption, provider data display, relationship traversal, and unresolved provider data remain prohibited.
- Licensing, attribution, and customer-display boundaries create high governance complexity.

Planning conclusion:

Strategically important, but should not be the next CEP implementation unless David separately authorizes a customer-safe community context program that explicitly avoids GIS activation and provider data. Full community intelligence belongs after clearer geographic customer-use authorization.

### C. Market Intelligence Experience

Repository evidence:

- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `components/CityMarketStats.tsx`
- `components/MarketChart.tsx`
- `components/MarketHomesLinks.tsx`
- `components/MarketNeighborhoodLinks.tsx`
- `components/MarketPriceChart.tsx`
- `components/MarketStats.tsx`
- `components/RelatedArticles.tsx`
- `components/LeadCapture.tsx`
- `lib/marketData.ts`
- `lib/marketMetrics.ts`
- `lib/marketAnalytics.ts`
- `lib/marketHealth.ts`
- `lib/marketPulse.ts`
- `lib/marketReport.ts`
- `lib/marketTrends.ts`
- `lib/schema/neighborhoodSchema.ts`
- `components/schema/FAQSchema.tsx`
- `scripts/publicExperienceSmoke.ts`

Strengths:

- Existing public routes, components, structured data, internal links, and smoke coverage already exist.
- Fits both buyer and seller decision context without creating new mutation paths.
- Can increase organic discovery, answer-engine readiness, seller intent, and consultation readiness.
- Reuses certified Sprint 1 search, Sprint 2 property evaluation, and Sprint 3 conversion paths.
- Can stay public-fact, source-bounded, and non-AI.

Constraints:

- Market freshness and source posture need strict customer-safe language.
- Existing route style and claims require careful review to avoid unsupported certainty.
- Measurement readiness is partial unless future analytics activation is separately authorized.
- Neighborhood intelligence overlaps with GIS-sensitive concepts and must avoid unauthorized provider/geographic activation.

Planning conclusion:

This is the strongest next investment. It has enough repository readiness to produce visible customer and business value while avoiding the higher-risk GIS and AI activation gates.

### D. AI-Grounded Customer Guidance

Repository evidence:

- `lib/ai/generateSellerMessage.ts`
- `lib/ai/selectVariant.ts`
- `lib/ai/selectVariantBandit.ts`
- `lib/ai/selectVariantContextual.ts`
- `lib/ai/buildContextKey.ts`
- `lib/repository/intelligence/*`
- `lib/publicTrust.ts`
- enterprise intelligence and learning-system governance records

Strengths:

- High potential differentiation.
- Repository contains early AI helper and enterprise intelligence architecture.
- Could eventually support guided explanations, buyer questions, seller guidance, and decision support.

Constraints:

- Customer AI activation is explicitly not authorized.
- Existing helper calls OpenAI directly when used and would require separate grounding, privacy, consent, fair-housing, hallucination, source-citation, and runtime safety gates before customer use.
- High governance complexity and production risk.

Planning conclusion:

Do not prioritize next. AI should follow after market and guidance source models are stronger and after David separately authorizes an AI grounding gate.

## 7. Scoring Model

Scale:

- `1`: weak or low
- `3`: moderate
- `5`: strong or high

Positive criteria increase score. Production risk and governance complexity are drag factors and are subtracted.

Weights:

| Criterion | Weight |
| --- | ---: |
| Customer value | 1.4 |
| Lead-generation value | 1.2 |
| Revenue impact | 1.2 |
| Implementation readiness | 1.1 |
| Architecture reuse | 1.0 |
| Dependency readiness | 1.0 |
| Time to customer value | 1.0 |
| Differentiation | 1.0 |
| Maintainability | 0.8 |
| Measurement readiness | 0.8 |
| Production risk | -1.0 |
| Governance complexity | -0.8 |

## 8. Scored Comparison

| Candidate | Customer value | Lead value | Revenue | Readiness | Reuse | Dependencies | Time value | Differentiation | Maintainability | Measurement | Risk | Governance | Weighted score | Rank |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Market Intelligence Experience | 5 | 4 | 5 | 4 | 5 | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 39.4 | 1 |
| Navigation and Conversion Optimization | 4 | 3 | 3 | 5 | 5 | 5 | 5 | 2 | 5 | 3 | 2 | 2 | 38.1 | 2 |
| Community and Neighborhood Intelligence | 5 | 4 | 4 | 3 | 4 | 2 | 3 | 5 | 3 | 2 | 5 | 5 | 28.0 | 3 |
| AI-Grounded Customer Guidance | 4 | 4 | 4 | 2 | 3 | 2 | 2 | 5 | 2 | 2 | 5 | 5 | 25.8 | 4 |

## 9. Why Alternatives Ranked Lower

Navigation and Conversion Optimization ranked close behind the recommendation. It is safer and faster, but it is mostly a path-efficiency program after Sprints 1-3 already improved search, property, and conversion. It should be folded into the recommended market program where market pages need better routes into search, property, seller review, and contact paths.

Community and Neighborhood Intelligence has high strategic value, but much of the richest version depends on geographic governance, licensing, attribution, public display, and runtime-consumption decisions. It should be sequenced after a market-intelligence pass establishes a public-safe local context model.

AI-Grounded Customer Guidance has high long-term differentiation, but it is the least appropriate next implementation. It requires explicit AI authorization, source grounding, fair-housing controls, hallucination testing, privacy review, and customer-safe citation behavior before runtime use.

## 10. Recommended Next Program

Program:

`CEP_1_0_MARKET_INTELLIGENCE_EXPERIENCE_AND_OPTIMIZATION`

Executive objective:

Turn existing market and neighborhood surfaces into a certified public market-intelligence journey that helps buyers and sellers understand local context, continue into certified search/property/conversion paths, and trust the source and freshness of public market claims.

Business case:

- Builds qualified top-of-funnel demand without creating new backend workflows.
- Strengthens seller acquisition by connecting market curiosity to the certified seller review path.
- Strengthens buyer confidence by connecting local market context to certified search and property evaluation.
- Improves organic and answer-engine readiness through existing schema and market pages.
- Produces visible value with lower risk than GIS or AI activation.

Customer value:

- Clearer local market orientation.
- Better explanation of market-wide metrics and source boundaries.
- Easier path from city/neighborhood context into search, property evaluation, and consultation.
- Better seller understanding before requesting a review.

Repository readiness:

- Market routes already exist.
- City and neighborhood data already exist.
- Market components and charts already exist.
- FAQ and neighborhood schema helpers already exist.
- Internal-link components already exist.
- Public smoke coverage already includes market and neighborhood metadata checks.
- Sprint 1-3 certified journeys are available as downstream destinations.

Reusable systems:

- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `components/CityMarketStats.tsx`
- `components/MarketHomesLinks.tsx`
- `components/MarketNeighborhoodLinks.tsx`
- `components/LeadCapture.tsx`
- `components/schema/FAQSchema.tsx`
- `lib/marketData.ts`
- `lib/marketMetrics.ts`
- `lib/marketAnalytics.ts`
- `lib/marketHealth.ts`
- `lib/marketReport.ts`
- `lib/marketTrends.ts`
- `lib/neighborhoods.ts`
- `lib/schema/neighborhoodSchema.ts`
- `scripts/publicExperienceSmoke.ts`

Dependencies:

- Certified Sprint 1 search and map baseline.
- Certified Sprint 2 property-intelligence experience.
- Certified Sprint 3 conversion and seller-acquisition baseline.
- Public-safe market-source and freshness language.
- Existing public-experience smoke and focused future market-intelligence safety check.
- No provider, GIS, AI, schema, migration, or production mutation dependency should be introduced.

Explicit exclusions:

- GIS Sprint 9
- provider contact or provider data
- live geographic services
- AI summaries or chatbot behavior
- automated valuations
- new market predictions
- new persistence
- database schema changes
- analytics activation
- CRM, email, alert, inquiry, tour, or seller-lead backend changes
- production deployment without separate authorization

Production risk:

Medium. The primary risks are unsupported market claims, stale metric presentation, confusing source attribution, and accidental overlap with GIS-sensitive community intelligence. These can be mitigated through source/freshness controls, customer-safe copy, deterministic checks, and non-mutating production certification.

Authorization boundary:

Future implementation must be separately authorized. This review authorizes no runtime work. A later implementation authorization should name exact market routes/components, validation commands, responsive dimensions, accessibility gates, source/freshness requirements, prohibited claims, and deployment boundary.

## 11. Proposed Sprint Sequence

The following is a proposed sequence only. It does not authorize Sprint 4 or any runtime implementation.

### Proposed Sprint 4 - Market Intelligence Baseline

Objective: certify the public market page hierarchy, source/freshness posture, market-safe claims, and buyer/seller route continuity.

Likely scope if separately authorized:

- Review and improve city market page hierarchy.
- Review and improve neighborhood market page hierarchy where public-safe.
- Add source/freshness and market-wide-disclaimer clarity.
- Connect market pages to certified search, property, and seller paths.
- Add deterministic market-intelligence safety checks.

### Proposed Sprint 5 - Market-to-Conversion Optimization

Objective: improve how market readers become searchers, property evaluators, or seller-review requests.

Likely scope if separately authorized:

- Improve market CTAs without new mutation paths.
- Clarify buyer versus seller next steps.
- Improve mobile market navigation.
- Strengthen accessibility and no-overflow checks.
- Prepare measurement definitions without activating analytics.

### Proposed Sprint 6 - Market Measurement and AEO Readiness

Objective: strengthen measurable market engagement and answer-engine readiness without new external telemetry.

Likely scope if separately authorized:

- Review structured data.
- Review FAQ quality and source boundaries.
- Define market-engagement KPIs.
- Add local deterministic validation for AEO/source/freshness requirements.

## 12. KPI Readiness

KPIs for the recommended program:

| KPI | Current measurability | Future authorization needed |
| --- | --- | --- |
| Market page visits | Requires analytics or server-log access | Analytics/log review authorization |
| Market-to-search clicks | Partially prepared through existing links; not fully measured | Instrumentation authorization |
| Market-to-seller-review starts | Seller form exists; click/start measurement needs authorization | Instrumentation or safe read authorization |
| Market-to-property navigation | Existing links/search paths; not fully measured | Instrumentation authorization |
| Neighborhood guide engagement | Existing pages and metadata; not fully measured | Analytics/log review authorization |
| Zero-result recovery after market search | Search baseline exists | Search interaction measurement authorization |
| Seller review submissions from market path | Existing valuation records, subject to safe read | Safe read/reporting authorization |
| Source/freshness display coverage | Can be locally checked | Deterministic safety script |
| Responsive market usability | Can be locally checked | Browser validation during implementation |
| AEO/structured-data validity | Can be locally checked | Structured-data validation during implementation |

No KPI instrumentation, tracking vendor activation, cookies, analytics persistence, or production data read is authorized by this review.

## 13. Risk and Mitigation

| Risk | Mitigation |
| --- | --- |
| Unsupported market certainty | Require public-safe copy and no guarantee/prediction claims. |
| Stale market facts | Display source/freshness posture and avoid precise recency claims when unsupported. |
| GIS boundary confusion | Use existing public repository market/neighborhood context only; do not activate GIS/provider data. |
| AI boundary confusion | Prohibit generated guidance and chatbot behavior. |
| Conversion-flow mutation expansion | Link to existing certified flows without changing submission behavior. |
| Visual or mobile regression | Require responsive browser review at desktop, tablet, mobile, and narrow mobile dimensions. |
| SEO/AEO overclaiming | Validate schema and FAQ content against public-safe source boundaries. |

## 14. Remaining Gaps

- No runtime implementation is authorized.
- Market pages have not been certified under a dedicated CEP market-intelligence sprint.
- Measurement remains largely inactive and requires separate authorization.
- Community intelligence remains constrained by GIS and provider boundaries.
- AI guidance remains unauthorized.
- Sprint 4 remains unauthorized.

## 15. Recommended Next Executive Decision

David should decide whether to authorize:

`CEP_1_0_SPRINT_4_MARKET_INTELLIGENCE_BASELINE`

The expected authorization should be a controlled implementation sprint focused on public market-intelligence hierarchy, source/freshness clarity, buyer/seller route continuity, responsive/accessibility review, deterministic safety coverage, local validation, documentation, commit, and push.

Codex does not authorize that decision.

## 16. Validation Evidence

Documentation-only validation required by this review:

- `git diff --check`
- `git status --short --branch --untracked-files=all`

No runtime tests, production checks, deployments, database commands, provider calls, AI calls, or mutation-bearing workflows are authorized by this review.

## 17. Stop Conditions

Codex stopped before:

- Sprint 4 implementation
- runtime implementation
- UI changes
- API changes
- deployment
- provider activation
- GIS Sprint 9
- AI activation
- database changes
- production actions
- unrelated work
