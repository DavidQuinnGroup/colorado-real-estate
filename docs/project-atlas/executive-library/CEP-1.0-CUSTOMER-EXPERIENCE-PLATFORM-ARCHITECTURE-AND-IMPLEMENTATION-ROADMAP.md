# PROJECT ATLAS(tm) - CEP 1.0 Customer Experience Platform(tm) Architecture and Implementation Roadmap

Status: `CEP_1_0_ARCHITECTURE_AND_ROADMAP_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 26, 2026

Repository baseline: `740648261c068eac7661923c5e11aec3a71b365d`

## 1. Executive Summary

CEP 1.0 defines the governed customer-facing integration program for the David Quinn Group Real Estate Intelligence Engine. It converts completed architecture into visible buyer, seller, and agent value without replacing the existing Search Runtime, Property Intelligence Experience, Geographic Intelligence System, Enterprise Knowledge contracts, alerts, seller lead capture, market pages, SEO/AEO assets, or governance records.

CEP 1.0 is an architecture and implementation roadmap only. It does not authorize runtime implementation, UI changes, API changes, database changes, instrumentation, production actions, deployment, customer-visible changes, GIS Sprint 9, provider connection, live external acquisition, AI runtime activation, or geographic runtime consumption.

The recommended first implementation phase, if separately authorized, is CEP Sprint 1: Search and Map Experience Baseline. It should make the already-live search/map journey easier to complete, easier to trust, easier to save, and easier to convert from, while preserving current contracts and customer-safe public/private intelligence separation.

## 2. Program Status

- Program: `PROJECT_ATLAS_CEP_1_0_CUSTOMER_EXPERIENCE_PLATFORM`
- Current state: `ARCHITECTURE_AND_ROADMAP_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`
- Strongest permitted outcome: `CEP_1_0_ARCHITECTURE_AND_ROADMAP_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`
- Implementation authorization: `NOT_AUTHORIZED`
- Production action authorization: `NOT_AUTHORIZED`
- Deployment authorization: `NOT_AUTHORIZED`
- GIS Sprint 9 authorization: `NOT_AUTHORIZED`
- Provider connection authorization: `NOT_AUTHORIZED`
- Customer-visible change authorization: `NOT_AUTHORIZED`

## 3. Repository Baseline

Baseline verification performed before documentation work:

- Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`
- Branch: `main`
- Starting HEAD: `740648261c068eac7661923c5e11aec3a71b365d`
- Starting origin/main: `740648261c068eac7661923c5e11aec3a71b365d`
- Initial working tree: clean
- Latest commit: `7406482 Establish GIS 1.0 licensing attribution gate`

No repository changes after the expected baseline were found before this documentation-only work began.

## 4. Governing Context

CEP 1.0 preserves these distinctions:

- quality does not equal readiness
- readiness does not equal approval
- approval does not equal persistence
- persistence does not equal retrieval
- retrieval does not equal consumption
- consumption readiness does not equal runtime enablement
- runtime activation does not equal downstream integration
- downstream integration does not equal customer visibility
- provider evaluation does not equal provider approval
- public access does not equal use permission
- licensing resolution does not equal technical connection
- technical feasibility does not equal live execution
- architectural planning does not equal implementation authorization

CEP 1.0 must reuse completed architecture and must not duplicate existing contracts, adapters, components, governance records, or source-of-truth systems where governed capabilities already exist.

## 5. GIS Strategic Pause

GIS 1.0 Sprints 1-8 are certified and closed. Provider progression is paused after Sprint 8 as:

`GIS_1_0_PROVIDER_PROGRESSION_PAUSED_AFTER_SPRINT_8`

The Colorado Geological Survey pathway remains preserved as:

`READY_FOR_FUTURE_TECHNICAL_FEASIBILITY_AUTHORIZATION`

GIS Sprint 8 resolved the licensing and attribution gate only to the extent needed for later technical-feasibility consideration:

`LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW`

GIS Sprint 9 remains `NOT_AUTHORIZED`. CEP 1.0 may reference already-governed geographic architecture and public-safe patterns, but it must not authorize provider contact, accounts, credentials, terms acceptance, downloads, live service calls, provider acquisition, provider persistence, operational provider use, unresolved provider-data display, geographic runtime consumption, relationship traversal, hierarchy inference, or GOF Wave 5.

## 6. CEP 1.0 Executive Purpose

CEP 1.0 answers:

How do we make buying or selling real estate easier, more understandable, and more valuable than competing real estate platforms?

The program should integrate current REIE capabilities into coherent customer journeys that support property discovery, trust, saved-search continuity, buyer consultation, seller consultation, tour requests, listing appointments, organic visibility, AEO performance, and measurable revenue contribution.

## 7. Business Case

CEP 1.0 shifts PROJECT ATLAS from additional provider progression toward direct customer and business value. The business case is strongest where visible customer benefit aligns with already-implemented systems:

- search and map workflows can produce immediate engagement and saved-search lift
- property detail pages can convert existing intelligence into clearer buyer questions
- seller intake can convert market curiosity into consultation requests
- saved searches and alerts can increase repeat visits and lead quality
- source, provenance, confidence, freshness, and disclaimers can increase trust
- structured data, market pages, internal links, and FAQ schema can improve organic and answer-engine visibility
- CRM task creation and intake metadata can improve agent productivity when governed carefully

## 8. Customer Experience Principles

- Start with the customer journey, not the internal system boundary.
- Reuse governed architecture before creating new surfaces.
- Keep public claims customer-safe, sourced, explainable, and bounded.
- Make lead capture contextual rather than disruptive.
- Preserve clear public/private intelligence separation.
- Prefer progressive disclosure over overwhelming property pages.
- Make mobile search a first-class experience.
- Treat trust, accessibility, privacy, fair housing, and correction paths as core product requirements.

## 9. Existing Capability Inventory

| Capability | Customer journey | Repository evidence | Status | Reusable assets | Dependencies | Authorization constraints | Production risk | Customer value | Recommended CEP phase | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Public guided search route | Buyer broad search, refinement | `app/search/page.tsx`; `components/search/SearchInterface.tsx`; `components/search/SearchControls.tsx` | `IMPLEMENTED_NEEDS_REVIEW` | SSR initial results, filter URL state, FAQ schema, authority links | Search runtime, listing quality, public schema | No search behavior changes without new auth | Medium | High | Phase 1 | Core customer entry point exists. |
| Search API route | Search query/filter behavior | `app/api/search/route.ts`; `lib/search/searchProperties.ts`; `lib/search/supabaseSearch.ts`; `lib/search/runtimeAdapter.ts` | `IMPLEMENTED_NEEDS_REVIEW` | Typesense/database fallback, meta, quality contract | Prisma, Typesense, Supabase fallback | No API/ranking/runtime changes now | High | High | Phase 1 | Requires careful regression if changed later. |
| Map/list synchronization | Buyer map/list movement | `components/maps/MapInner.tsx`; `components/maps/SearchMap.tsx`; `components/maps/MapSidebar.tsx`; `components/maps/SelectedPropertyDrawer.tsx` | `IMPLEMENTED_NEEDS_REVIEW` | selected/hovered state, drawer, mobile toggle, private filtering | Leaflet/map rendering safety | No UI/runtime changes now | Medium | High | Phase 1 | Good reuse target for baseline polish. |
| Mobile search view | Buyer mobile search | `components/search/SearchInterface.tsx`; `app/globals.css` | `PARTIALLY_IMPLEMENTED` | list/map segmented mobile state | Responsive browser validation | No customer-visible UI changes now | Medium | High | Phase 1 | Needs mobile usability certification if authorized. |
| Saved search | Buyer saves search | `components/maps/SaveSearch.tsx`; `app/api/save-search/route.ts`; `lib/alerts/*` | `IMPLEMENTED_NEEDS_REVIEW` | intent, timeline, north-star anchors, alert readiness | User, SavedSearch, alert queue | No mutation behavior changes now | High | High | Phase 1/3 | Existing public mutation path; changes need safety review. |
| Alert engine | Returning visitor, market updates | `lib/alerts/processAlertQueue.ts`; `lib/alerts/sendAlert.ts`; `lib/email/templates/propertyAlert.ts`; `scripts/alertNotificationReadiness.ts` | `IMPLEMENTED_NEEDS_REVIEW` | matching, queue, email templates, readiness scripts | email, queue, user subscriptions | No queue retries/live sends now | High | High | Phase 3 | Operationally sensitive. |
| Property detail pages | Buyer evaluates property | `app/properties/[id]/page.tsx`; `components/PropertyInquiryForm.tsx`; `components/RelatedPropertyLinks.tsx` | `IMPLEMENTED_NEEDS_REVIEW` | facts, property schema, FAQ, inquiry CTA, related links | Prisma/Supabase fallback, public trust | No property-page changes now | Medium | High | Phase 2 | Strong CEP integration surface. |
| Property Intelligence Experience | Buyer evaluation and trust | `docs/project-atlas/executive-library/PIE-1.0-PROPERTY-INTELLIGENCE-EXPERIENCE-PROGRAM-CLOSURE.md`; PIE Wave 1-5 docs | `CERTIFIED_AND_REUSABLE` | construction, financial, market, decision workspace closure docs | Existing public-safe projections | No new runtime activation now | Medium | High | Phase 2 | Certification is document-supported. |
| Property inquiry/tour request | Buyer asks question or requests tour | `components/PropertyInquiryForm.tsx`; `app/api/property-inquiry/route.ts`; `lib/email/sendPropertyInquiryNotification.ts` | `IMPLEMENTED_NEEDS_REVIEW` | CRM task, lead interaction, high-priority notification | public schema, email | No changes/live tests now | High | High | Phase 3 | Existing customer mutation and notification path. |
| Seller valuation request | Seller asks for home-value assessment | `app/sell/page.tsx`; `components/HomeValueEstimator.tsx`; `app/api/valuation/route.ts`; `lib/seller/createSellerLead.ts` | `IMPLEMENTED_NEEDS_REVIEW` | seller intake, CRM task, seller lead record | public schema, CRM | No changes now | High | High | Phase 3 | Consultation request, not automated valuation. |
| Market pages and local content | Seller/buyer market context | `app/market/[city]/page.tsx`; `app/market/[city]/[slug]/page.tsx`; `lib/market*.ts`; `components/Market*.tsx` | `IMPLEMENTED_NEEDS_REVIEW` | city/neighborhood pages, charts, internal links | market data freshness | No customer-visible copy/data change now | Medium | Medium | Phase 6 | Useful for trust and SEO. |
| Geographic intelligence contracts | Neighborhood/community context | `lib/geographic-intelligence/*`; `docs/project-atlas/geographic-intelligence/*`; EKCP/EIP docs | `ARCHITECTURE_ONLY` for CEP customer use | domain, evidence, provenance, attribution, disclaimer, pilot matrix | GIS authorization, licensing, legal | Customer display/runtime use not authorized | High | Medium | Phase 4 | Reuse contracts only; no provider data display. |
| Enterprise geographic consumption readiness | Future geographic integration | `docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2R-COLORADO-ENTERPRISE-GEOGRAPHIC-CONSUMPTION-READINESS.md` | `CERTIFIED_AND_REUSABLE` for readiness | consumption-readiness model | runtime authorization absent | Runtime/customer activation not authorized | High | Medium | Phase 4 | Ready does not equal enabled. |
| Public/private intelligence separation | Trust and compliance | `lib/runtime/publicSchemaSafety.ts`; `lib/publicTrust.ts`; search/map private filtering | `IMPLEMENTED_NEEDS_REVIEW` | schema assertion, listing classification, access-level filtering | runtime safety validation | Must not expose protected intelligence | High | High | All | Central CEP boundary. |
| SEO and structured data | Organic/AEO discovery | `app/sitemap.ts`; `app/robots.ts`; `components/schema/*`; property/search schemas | `IMPLEMENTED_NEEDS_REVIEW` | WebApplication, FAQ, property, agent schema | content accuracy | No customer-visible change now | Medium | Medium | Phase 6 | AEO improvement needs instrumentation. |
| Analytics and measurement | Conversion optimization | `lib/analytics/trackBehavior.ts`; `lib/analytics/getLeadPerformance.ts`; `app/api/track-click/route.ts`; EIF docs | `PARTIALLY_IMPLEMENTED` | behavior tracking, lead performance helpers | event coverage, privacy | No instrumentation changes now | Medium | Medium | Phase 6 | KPI framework needs instrumentation plan. |
| AI personalization helpers | Future guidance | `lib/ai/selectVariant*.ts`; `lib/ai/generateSellerMessage.ts`; EIF docs | `ARCHITECTURE_ONLY` for customer guidance | variant selection, seller message helper | grounding, review, authorization | Open-ended chatbot not authorized | High | Medium | Phase 5 | Customer AI requires separate grounding gate. |
| Navigation/header/footer | Journey continuity | `app/layout.tsx`; `components/Footer.tsx`; internal-link components | `IMPLEMENTED_NEEDS_REVIEW` | global layout, footer, internal links | UX review | No customer-visible navigation change now | Low/Medium | Medium | Phase 6 | Optimize after core flows are stable. |
| Mortgage affordability | Buyer affordability | Search found no dedicated calculator component or route beyond guidance/intake context | `MISSING` | None located | lender/legal/compliance/content | No mortgage product integration now | Medium | Medium | Phase 3 | Consider simple governed estimator only if authorized. |
| Property comparison | Buyer compares properties | No dedicated comparison workspace located | `MISSING` | selected property drawer and result cards | state model, UI, persistence decision | No implementation now | Medium | High | Phase 2 | Good future differentiator. |
| Correction paths | Trust and error handling | route-level errors, schema-unavailable handling, safety docs | `PARTIALLY_IMPLEMENTED` | customer-safe error messages | process owner | No workflow changes now | Medium | Medium | Phase 2/Trust | Needs explicit customer correction model. |

## 10. Reusable Architecture

Source-of-truth and reuse targets:

- Search source: `lib/search/searchProperties.ts`, `lib/search/supabaseSearch.ts`, `lib/search/runtimeAdapter.ts`, `app/api/search/route.ts`
- Public listing UI: `components/search/*`, `components/maps/*`, `components/PropertyCard.tsx`
- Property detail projection: `app/properties/[id]/page.tsx`
- Property inquiry: `components/PropertyInquiryForm.tsx`, `app/api/property-inquiry/route.ts`
- Saved search and alerts: `components/maps/SaveSearch.tsx`, `app/api/save-search/route.ts`, `lib/alerts/*`
- Seller intake: `components/HomeValueEstimator.tsx`, `app/api/valuation/route.ts`
- Market context: `app/market/*`, `lib/market*.ts`, `components/Market*.tsx`
- Trust and public safety: `lib/publicTrust.ts`, `lib/runtime/publicSchemaSafety.ts`
- Geographic governance: `lib/geographic-intelligence/*`, `lib/eip/*`, `lib/ekcp/*`, GIS/EIP/EKCP docs
- SEO/AEO: `components/schema/*`, `app/sitemap.ts`, `app/robots.ts`
- Measurement: `lib/analytics/*`, `app/api/track-click/route.ts`, EIF docs

CEP should compose these systems through bounded phases, not collapse them into one route, service, or component.

## 11. Customer Journey Analysis

| Journey | Current experience | Reusable systems | Gaps/friction | Trust requirements | Conversion opportunity | Dependencies | Phase | Success criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buyer begins broad location search | `/search` starts with guided Colorado search and initial listings | Search page, SearchInterface, MapSidebar | Broad intent not yet personalized | clear source/status, public listing boundary | save search, Grand Plan, contact | search runtime | Phase 1 | search starts, result engagement, no blank map |
| Buyer refines search criteria | URL filters for city, price, beds, baths, type, keyword | SearchControls, API params | no advanced recovery or recommendations | transparent filter state | save refined search | API/search quality | Phase 1 | filter completion, refinement success |
| Buyer moves between list and map | list/map sync and mobile toggle exist | MapInner, SearchMap, MapSidebar | map bounds behavior not first-class in current controls | map result count and coordinate status | property detail/open inquiry | Leaflet safety | Phase 1 | map engagement, selection rate |
| Buyer evaluates a property | property detail page and drawer exist | property page, drawer, PIE docs | property intelligence not fully unified into one decision panel | provenance, confidence, freshness, disclaimers | ask question, tour | PIE projection | Phase 2 | detail engagement, CTA rate |
| Buyer compares multiple properties | no dedicated comparison workspace | cards, drawer, property detail | comparison is manual | source and attribute consistency | consultation after shortlist | state/persistence decisions | Phase 2 | comparison starts, shortlist CTA |
| Buyer saves a property | no dedicated saved-property system found | property CTA, user/lead tables | save property absent or not obvious | privacy and consent | follow-up, collections | persistence authorization | Phase 3 | saved property events |
| Buyer saves a search | SaveSearch exists | SaveSearch, API, alerts | alert readiness and consent need continued review | unsubscribe, frequency, data use | alerts, repeat visits | alert engine | Phase 1/3 | saved searches, return visitors |
| Buyer requests a tour | property inquiry supports tour timeline | PropertyInquiryForm, API, notification | live availability not integrated | no guarantee claims | high-priority CRM task | email/CRM | Phase 3 | tour requests, response SLA |
| Buyer asks property question | property inquiry notes exist | inquiry form, CRM metadata | no structured question taxonomy | customer-safe response path | qualified buyer lead | CRM workflow | Phase 3 | qualified inquiries |
| Buyer explores community | market and neighborhood pages exist | market routes, internal links, GIS contracts | governed geographic runtime not enabled | licensing/provenance/geographic boundaries | neighborhood guide CTA | GIS/EKCP auth | Phase 4 | guide engagement |
| Buyer estimates affordability | no dedicated mortgage calculator located | seller/buyer guidance copy only | affordability workflow missing | lender/legal disclaimers | lender intro, consultation | compliance/lender auth | Phase 3 | calculator use, lender clicks |
| Seller requests assessment | `/sell` and HomeValueEstimator exist | seller form, valuation API, CRM | not automated valuation, needs clear positioning | no automated appraisal claim | seller lead, listing appointment | CRM/schema | Phase 3 | seller requests |
| Seller explores market | market pages exist | market pages, charts, seller intake | seller-specific market path can improve | freshness/source clarity | consultation | market data | Phase 6 | seller market engagement |
| Seller requests consultation | seller intake creates lead and CRM task | HomeValueEstimator, API | follow-up SLA not displayed as process | privacy and brokerage disclaimer | listing appointment | CRM | Phase 3 | consultations booked |
| Returning visitor resumes activity | saved search and alerts exist | SavedSearch, alerts | customer account/session continuity not evident | consent and unsubscribe | repeat visits | auth/session decision | Phase 3 | return visitor rate |
| Agent receives qualified lead | CRM tasks created for property/seller flows | CRM task APIs, metadata, lead performance | lead context needs standardized agent view | source/consent/provenance | faster follow-up | CRM workflows | Phase 3 | lead-to-consult conversion |

## 12. Workstream Definitions

### A. Search Intelligence(tm)

Scope: search entry, query and filter behavior, result relevance, ranking review, map/list synchronization, clustering or grouping review, bounds behavior, property comparison, saved searches, recommendations, recovery, zero-result guidance, mobile search, performance, and accessibility.

Boundary: no current authorization to change runtime search, ranking, API behavior, map behavior, or UI. Future implementation must preserve `app/api/search/route.ts` contracts, listing-quality rules, private/public filtering, and safety checks.

### B. Property Intelligence(tm)

Scope: reuse completed PIE capabilities in property detail, listing facts, price and market context, property history, comparable context, condition and risk explanations, provenance, confidence, freshness, permitted-use boundaries, and actionable customer guidance.

Boundary: PIE certification can be reused, but customer-facing projection changes require separate implementation authorization and source-safe display rules.

### C. Geographic Intelligence(tm)

Scope: reuse already-authorized geographic contracts and outputs for neighborhood/community context, geographic hierarchy, public/protected separation, possible future map overlays, attribution, provenance, licensing boundaries, and future integration points.

Boundary: no GIS Sprint 9, no live provider connection, no operational provider acquisition, no provider persistence, no customer display of unresolved provider data, and no geographic runtime consumption.

### D. Customer Guidance(tm)

Scope: guided search, comparison assistance, contextual explanations, decision support, buyer questions, seller questions, mortgage-related guidance, market explanations, local expertise, and future AI-grounded assistance.

Boundary: AI must remain grounded in governed data and explicit authorization. Open-ended chatbot behavior and ungrounded generated claims are not authorized.

### E. Conversion Intelligence(tm)

Scope: save search, schedule tour, ask an agent, request property analysis, request seller consultation, home-value request, mortgage calculator, recommended-lender experience, similar properties, alerts, market updates, neighborhood guides, lead attribution, and conversion measurement.

Boundary: lead generation should stay contextual and journey-integrated. No new mutation, email, CRM, alert, analytics, or lender integration behavior is authorized by this document.

### F. Trust(tm)

Scope: source presentation, attribution, provenance, confidence, freshness, explainability, local expertise, customer-safe disclaimers, public/private intelligence boundaries, AI grounding, error handling, correction paths, accessibility, privacy, security, and fair-housing considerations.

Boundary: trust controls are product requirements, not optional labels. Claims must be backed by governed records or public-safe source evidence.

## 13. Dependency Map

- Phase 1 depends on current public search route, search API, listing-quality contract, map rendering safety, SearchControls, MapSidebar, and SaveSearch.
- Phase 2 depends on property detail route, PIE closure records, public trust classification, source/provenance/freshness display patterns, and property inquiry CTA.
- Phase 3 depends on SaveSearch, alerts, property inquiry, seller intake, CRM task creation, unsubscribe boundaries, privacy, and lead attribution.
- Phase 4 depends on GIS Sprints 1-8, EKCP readiness, GMA, public/protected intelligence separation, and separate runtime authorization.
- Phase 5 depends on EIF, AI helper boundaries, governed source grounding, fair housing review, legal/compliance review, and explicit AI runtime authorization.
- Phase 6 depends on analytics/event coverage, market pages, SEO/AEO schema, performance, accessibility, and business-process feedback loops.

## 14. Authorization Boundaries

CEP 1.0 architecture is authorized. CEP 1.0 implementation is not authorized.

Future implementation must be separately authorized by phase or sprint and must name exact files, routes, APIs, data access, mutation paths, validation commands, deployment boundaries, and stop conditions.

## 15. Explicit Prohibitions

This roadmap does not authorize:

- runtime implementation
- UI implementation
- search behavior changes
- map behavior changes
- API changes
- route changes
- database schema changes
- Prisma changes
- migrations
- data writes
- provider connection
- external acquisition
- GIS Sprint 9
- AI runtime activation
- customer-visible features
- production deployment
- Vercel actions
- environment-variable changes
- credentials
- account creation
- paid services
- provider contact
- terms acceptance
- production mutation
- live alert sends, queue retries, or CRM mutation tests

## 16. Prioritization Model

Scale: 1 low, 3 medium, 5 high. Weighted score equals positive value/readiness/reuse criteria minus risk/governance drag.

Weights:

- direct customer value: 1.4
- lead-generation value: 1.2
- revenue potential: 1.2
- competitive differentiation: 1.0
- implementation readiness: 1.1
- dependency readiness: 1.0
- time to visible value: 1.0
- architecture reuse: 1.0
- enterprise leverage: 0.8
- measurement readiness: 0.8
- production risk: -1.0
- governance complexity: -0.8

| Track | Customer value | Lead value | Revenue | Differentiation | Impl readiness | Dependency readiness | Time value | Reuse | Enterprise | Measurement | Risk | Governance | Score | Rank |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Search and Map Experience | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 3 | 3 | 3 | 31.6 | 1 |
| Property Intelligence | 5 | 4 | 4 | 5 | 3 | 4 | 3 | 5 | 5 | 3 | 3 | 4 | 29.6 | 2 |
| Conversion and Seller Acquisition | 4 | 5 | 5 | 3 | 4 | 3 | 4 | 4 | 4 | 3 | 4 | 4 | 28.0 | 3 |
| Navigation and Conversion Optimization | 3 | 4 | 4 | 2 | 4 | 4 | 4 | 4 | 3 | 3 | 2 | 2 | 27.4 | 4 |
| Market Intelligence | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 3 | 3 | 24.8 | 5 |
| Geographic and Community Intelligence | 4 | 3 | 4 | 5 | 2 | 2 | 2 | 4 | 5 | 2 | 5 | 5 | 20.4 | 6 |
| AI-Grounded Customer Assistance | 4 | 4 | 4 | 5 | 2 | 2 | 2 | 3 | 5 | 2 | 5 | 5 | 20.0 | 7 |

The preliminary priority sequence is revised by moving Navigation and Conversion Optimization ahead of Market Intelligence because it can reuse current routes and CTAs with lower governance complexity once Phase 1 and Phase 3 are authorized. Geographic and AI work remain strategically important but should follow after stronger grounding, authorization, and customer-safe projection decisions.

## 17. Recommended Phase Sequence

1. Phase 0 - Architecture and Baseline
2. Phase 1 - Search and Map Experience
3. Phase 2 - Property Intelligence Integration
4. Phase 3 - Conversion and Seller Acquisition
5. Phase 4 - Navigation and Conversion Optimization
6. Phase 5 - Market Intelligence and Optimization
7. Phase 6 - Geographic and Community Intelligence
8. Phase 7 - AI-Grounded Customer Guidance

This structure preserves small visible increments while moving high-risk geographic and AI activation later.

## 18. Phase Charters

### Phase 0 - Architecture and Baseline

- Executive objective: establish CEP 1.0 governance and inventory.
- Customer value: none directly; prevents unsafe implementation.
- Business value: focuses investment on reusable customer value.
- Scope: documentation, inventory, roadmap, authorization boundaries.
- Exclusions: runtime, UI, API, production, deployment.
- Reusable architecture: entire repository review.
- Dependencies: clean baseline.
- Authorization boundary: documentation only.
- Production risk: low.
- Validation: docs-only diff, path checks, no runtime changes.
- Outcomes: approved architecture and first sprint decision.
- Stop conditions: any need to modify runtime code.
- Entry criteria: clean main at expected baseline.
- Exit criteria: document complete and committed.

### Phase 1 - Search and Map Experience

- Executive objective: improve the highest-value customer entry point.
- Customer value: easier broad search, refinement, mobile list/map movement, zero-result recovery, saved-search entry.
- Business value: more search engagement, saved searches, tour/property inquiries.
- Scope: if authorized later, bounded UX and contract-preserving improvements to search shell.
- Exclusions: ranking overhaul, schema changes, production data mutation, provider work.
- Reusable architecture: `app/search/page.tsx`, `app/api/search/route.ts`, `components/search/*`, `components/maps/*`.
- Dependencies: search runtime, map rendering safety, public experience smoke.
- Authorization boundary: separate sprint required.
- Production risk: medium.
- Validation: typecheck, lint, public smoke, browser desktop/mobile, map pixel/render checks, route/API evidence.
- Outcomes: search success rate, filter completion, map engagement, saved-search starts.
- Stop conditions: changed API contract, private data exposure, degraded map/list sync.
- Entry criteria: explicit executive authorization.
- Exit criteria: evidence-backed customer search certification.

### Phase 2 - Property Intelligence Integration

- Executive objective: make property evaluation clearer and more trustworthy.
- Customer value: facts, context, condition/risk explanations, provenance, confidence, freshness.
- Business value: stronger inquiries and consultation quality.
- Scope: if authorized later, customer-safe PIE projection into property pages.
- Exclusions: unverified claims, protected intelligence, new provider data, GIS runtime.
- Reusable architecture: property route, PIE closure docs, publicTrust, schema components.
- Dependencies: source/provenance display model.
- Authorization boundary: separate sprint required.
- Production risk: medium.
- Validation: property route safety, structured-data checks, public copy review, browser evidence.
- Outcomes: detail engagement, inquiry rate, trust interaction rate.
- Stop conditions: unsupported claim or unlicensed data display.
- Entry criteria: Phase 1 stable or explicitly bypassed.
- Exit criteria: property-intelligence projection certified.

### Phase 3 - Conversion and Seller Acquisition

- Executive objective: convert intent into qualified buyer and seller opportunities.
- Customer value: contextual next steps without disruptive popups.
- Business value: buyer leads, seller leads, consultations, listing appointments.
- Scope: if authorized later, refine save-search, property inquiry, seller request, tour, and lead attribution flows.
- Exclusions: live email tests, queue retries, CRM mutations outside safe validation, lender activation without approval.
- Reusable architecture: SaveSearch, property inquiry, valuation API, CRM task metadata, alerts.
- Dependencies: privacy, unsubscribe, CRM boundaries.
- Authorization boundary: separate sprint required.
- Production risk: high.
- Validation: non-mutating checks first; mutation tests only with explicit production-safe protocol.
- Outcomes: qualified leads, lead-to-consult conversion.
- Stop conditions: uncontrolled notification, duplicate lead mutation, unsubscribe regression.
- Entry criteria: explicit mutation authorization and test plan.
- Exit criteria: conversion flow certified with rollback and evidence.

### Phase 4 - Navigation and Conversion Optimization

- Executive objective: connect high-value journeys across search, property, market, sell, and contact paths.
- Customer value: fewer dead ends and clearer next steps.
- Business value: higher conversion from existing traffic.
- Scope: if authorized later, internal links, CTA hierarchy, route continuity, footer/header review.
- Exclusions: new data claims or major route rebuilds.
- Reusable architecture: `app/layout.tsx`, `components/Footer.tsx`, internal-link components.
- Dependencies: Phase 1-3 journey decisions.
- Authorization boundary: separate sprint required.
- Production risk: low/medium.
- Validation: accessibility, mobile, route checks, SEO checks.
- Outcomes: CTA engagement, journey continuation.
- Stop conditions: broken canonical paths or confusing lead intent.
- Entry criteria: target journey selected.
- Exit criteria: navigation optimization certified.

### Phase 5 - Market Intelligence and Optimization

- Executive objective: improve buyer/seller market context and measurable performance.
- Customer value: clearer local context and market explanations.
- Business value: organic traffic, seller engagement, content leverage.
- Scope: if authorized later, market-page context, SEO/AEO, structured content, measurement.
- Exclusions: unsupported market predictions, stale claims, uninstrumented KPI claims.
- Reusable architecture: market routes, market components, schema components, analytics.
- Dependencies: content freshness and instrumentation.
- Authorization boundary: separate sprint required.
- Production risk: medium.
- Validation: structured-data checks, browser review, performance/accessibility, analytics verification.
- Outcomes: organic traffic, AEO referrals, market engagement.
- Stop conditions: stale or unsourced market claims.
- Entry criteria: measurement plan.
- Exit criteria: market intelligence certification.

### Phase 6 - Geographic and Community Intelligence

- Executive objective: add governed community context without breaking GIS pause.
- Customer value: neighborhood/community orientation.
- Business value: differentiation and local expertise.
- Scope: if authorized later, public-safe geographic context using authorized outputs only.
- Exclusions: GIS Sprint 9, provider contact, live services, unresolved provider data, geographic runtime consumption.
- Reusable architecture: GIS Sprints 1-8, EKCP, GMA, market/community pages.
- Dependencies: legal/licensing/attribution and runtime authorization.
- Authorization boundary: separate executive authorization required.
- Production risk: high.
- Validation: GIS safety checks, attribution/disclaimer checks, public/protected separation checks.
- Outcomes: neighborhood guide engagement and trust.
- Stop conditions: provider-data display, licensing ambiguity, protected intelligence exposure.
- Entry criteria: explicit geographic customer-use authorization.
- Exit criteria: geographic customer context certified.

### Phase 7 - AI-Grounded Customer Guidance

- Executive objective: provide bounded customer assistance grounded in governed data.
- Customer value: clearer explanations and decision support.
- Business value: differentiated guidance and better-qualified leads.
- Scope: if authorized later, narrow AI assistance with citations/grounding and deterministic guardrails.
- Exclusions: open-ended chatbot, ungrounded claims, fair-housing risk, protected data exposure.
- Reusable architecture: EIF, repository intelligence, AI helpers, public trust contracts.
- Dependencies: grounding source registry, review, measurement, compliance.
- Authorization boundary: separate AI runtime authorization required.
- Production risk: high.
- Validation: red-team prompts, source grounding checks, fair-housing review, hallucination controls.
- Outcomes: guidance interactions, lead quality, satisfaction.
- Stop conditions: ungrounded claim, discriminatory steering risk, protected intelligence leak.
- Entry criteria: explicit AI authorization.
- Exit criteria: AI guidance gate certified.

## 19. KPI Framework

### Customer KPIs

| KPI | Current measurability |
| --- | --- |
| search success rate | Requires instrumentation |
| filter completion | Requires instrumentation |
| result engagement | Requires instrumentation |
| property-detail engagement | Requires instrumentation |
| map engagement | Requires instrumentation |
| property saves | Deferred unless saved-property capability exists |
| saved searches | Currently measurable through saved-search records, subject to safe read authorization |
| return visitors | Requires analytics/session instrumentation |
| tour requests | Currently measurable through property inquiry CRM/interaction records, subject to safe read authorization |
| seller valuation requests | Currently measurable through seller intake records, subject to safe read authorization |
| customer guidance interactions | Requires future instrumentation |
| customer satisfaction | Requires business-process integration |

### Business KPIs

| KPI | Current measurability |
| --- | --- |
| qualified buyer leads | Currently measurable through lead/CRM records, subject to safe read authorization |
| qualified seller leads | Currently measurable through seller lead/CRM records, subject to safe read authorization |
| buyer consultations | Requires business-process integration |
| listing appointments | Requires business-process integration |
| lead-to-consultation conversion | Requires CRM process integration |
| consultation-to-client conversion | Requires CRM process integration |
| client-to-close conversion | Requires business/revenue integration |
| organic traffic | Requires analytics integration |
| AEO referrals | Requires analytics/referrer instrumentation |
| lead source attribution | Partially measurable through metadata; needs normalization |
| revenue contribution | Requires business-process integration |

### Enterprise KPIs

| KPI | Current measurability |
| --- | --- |
| architecture reuse | Measurable by implementation review |
| shared-component adoption | Measurable by code review |
| duplicate-system reduction | Measurable by architecture review |
| runtime stability | Currently measurable through validation/smoke when authorized |
| performance | Requires Lighthouse/browser/performance checks |
| accessibility | Requires accessibility checks |
| production safety | Measurable through safety scripts and diff review |
| governance compliance | Measurable through docs and safety checks |
| provenance coverage | Requires feature-specific source model |
| measurement coverage | Requires instrumentation inventory |
| regression coverage | Measurable through scripts and tests |

## 20. Production-Safety Model

CEP implementation must use an evidence-first safety model:

- preflight branch/HEAD/origin and working-tree verification
- exact scope and authorization statement
- docs or runtime diff classification before validation
- no schema/migration/env/deployment changes unless explicitly authorized
- public/private intelligence separation review
- source/provenance/freshness/confidence review for customer claims
- route/API contract review
- desktop and mobile browser evidence for public UI changes
- rollback and stop-condition definition before production changes
- final HEAD/origin/working-tree proof

## 21. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Over-implementing before authorization | Keep CEP 1.0 as architecture only until David authorizes a sprint. |
| Duplicating existing systems | Require capability reuse review in every phase. |
| Exposing protected intelligence | Enforce publicTrust and public/private data review. |
| Unsupported AI or local-market claims | Require grounded sources, review gates, and no open-ended chatbot. |
| GIS pause erosion | Keep Sprint 9 and provider progression explicitly unauthorized. |
| Lead-flow mutation risk | Use non-mutating validation first and explicit mutation protocol only when authorized. |
| Measurement overclaiming | Distinguish currently measurable, instrumentation-required, process-required, and deferred KPIs. |
| SEO/AEO claim drift | Require structured-data validation and source freshness review. |

## 22. Open Decisions

- Should David authorize CEP Sprint 1 Search and Map Experience Baseline?
- What exact public search outcomes matter most: search success, saved search, tour request, property inquiry, or consultation?
- Should saved-property persistence be introduced, or should saved searches remain the primary continuity object?
- What level of seller valuation experience is appropriate before a human consultation?
- Which analytics stack and privacy posture should govern CEP measurement?
- When should geographic community context be revisited after the GIS strategic pause?
- What explicit grounding and compliance gates are required before AI customer guidance?

## 23. Recommended First Implementation Sprint

Recommended next executive action:

Authorize `CEP_1_0_SPRINT_1_SEARCH_AND_MAP_EXPERIENCE_BASELINE`.

Suggested Sprint 1 scope, if authorized later:

- inspect current `/search` desktop and mobile behavior
- preserve existing search API contracts and ranking behavior unless explicitly included
- improve only the search/map/customer-guidance surfaces named in the authorization
- strengthen zero-result recovery, filter clarity, map/list continuity, saved-search entry, and trust/status display
- validate with typecheck, lint, targeted safety scripts, public experience smoke, route/API checks, desktop/mobile browser evidence, and `git diff --check`

Sprint 1 must not include property intelligence implementation, seller-flow mutation changes, GIS runtime consumption, AI runtime activation, provider work, schema changes, deployment, or production mutation unless separately authorized.

## 24. Required Executive Authorization

Implementation requires a new explicit executive authorization from David. The authorization should name:

- phase/sprint name
- exact implementation scope
- files/routes/APIs allowed to change
- prohibited areas
- validation commands
- browser evidence expectations
- production/deployment authorization state
- commit/push authorization state

Without that authorization, CEP remains documentation-only.

## 25. Stop Conditions

Stop before:

- implementing the recommended first sprint
- modifying runtime code
- modifying UI
- modifying APIs
- changing search or map behavior
- changing property pages
- changing lead-generation behavior
- adding instrumentation
- adding persistence
- changing database schema
- deploying
- connecting providers
- enabling AI
- enabling geographic runtime consumption
- making customer-visible changes
- taking production actions

## 26. Evidence Appendix

Primary repository evidence reviewed:

- `app/search/page.tsx`
- `app/api/search/route.ts`
- `components/search/SearchInterface.tsx`
- `components/search/SearchControls.tsx`
- `components/maps/MapInner.tsx`
- `components/maps/SearchMap.tsx`
- `components/maps/MapSidebar.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `components/maps/SaveSearch.tsx`
- `app/api/save-search/route.ts`
- `app/properties/[id]/page.tsx`
- `components/PropertyInquiryForm.tsx`
- `app/api/property-inquiry/route.ts`
- `app/sell/page.tsx`
- `components/HomeValueEstimator.tsx`
- `app/api/valuation/route.ts`
- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `app/layout.tsx`
- `components/Footer.tsx`
- `components/schema/FAQSchema.tsx`
- `lib/schema/propertySchema.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/search/searchProperties.ts`
- `lib/search/supabaseSearch.ts`
- `lib/search/runtimeAdapter.ts`
- `lib/runtime/publicSchemaSafety.ts`
- `lib/publicTrust.ts`
- `lib/alerts/processAlertQueue.ts`
- `lib/alerts/sendAlert.ts`
- `lib/email/sendPropertyInquiryNotification.ts`
- `lib/seller/createSellerLead.ts`
- `lib/crm/createTask.ts`
- `lib/analytics/trackBehavior.ts`
- `lib/analytics/getLeadPerformance.ts`
- `app/api/track-click/route.ts`
- `lib/ai/selectVariant.ts`
- `lib/ai/selectVariantBandit.ts`
- `lib/ai/selectVariantContextual.ts`
- `lib/ai/generateSellerMessage.ts`
- `lib/geographic-intelligence/*`
- `lib/eip/*`
- `lib/ekcp/*`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-EXPERIENCE-RESTORATION-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-WAVE-1-EDITORIAL-EXPERIENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-WAVE-2-SEARCH-REFINEMENT-CLOSURE.md`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-WAVE-3-SEARCH-RESULTS-EXPERIENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-WAVE-4-GUIDED-MAP-EXPERIENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/GUIDED-SEARCH-WAVE-5-SEARCH-COMPLETION-ADVISOR-CONTINUITY-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-PROPERTY-INTELLIGENCE-EXPERIENCE-PROGRAM-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-WAVE-1-PROPERTY-INTELLIGENCE-FOUNDATION-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-WAVE-2-CONSTRUCTION-INTELLIGENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-WAVE-3-FINANCIAL-INTELLIGENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-WAVE-4-MARKET-INTELLIGENCE-CLOSURE.md`
- `docs/project-atlas/executive-library/PIE-1.0-WAVE-5-EXECUTIVE-DECISION-WORKSPACE-CLOSURE.md`
- `docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2R-COLORADO-ENTERPRISE-GEOGRAPHIC-CONSUMPTION-READINESS.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-SPRINT-8-LICENSING-AND-ATTRIBUTION-RESOLUTION-GATE.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-LICENSING-AND-ATTRIBUTION-STANDARD.md`
- `scripts/publicExperienceSmoke.ts`
- `scripts/checkSearchRuntimeSafety.ts`
- `scripts/checkSearchRuntimeAdapterSafety.ts`
- `scripts/checkSearchListingQuality.ts`
- `scripts/checkMapRenderingSafety.ts`
- `scripts/checkPropertyRouteSafety.ts`
- `scripts/propertyInquirySmoke.ts`
- `scripts/propertyInquiryNotificationReadiness.ts`
- `scripts/alertNotificationReadiness.ts`
