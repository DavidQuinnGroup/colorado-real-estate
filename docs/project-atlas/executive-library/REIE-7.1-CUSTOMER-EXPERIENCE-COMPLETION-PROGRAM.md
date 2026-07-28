# PROJECT ATLAS(tm) - REIE 7.1 Customer Experience Completion Program(tm)

Status: `REIE_7_1_CUSTOMER_EXPERIENCE_COMPLETION_PROGRAM_ESTABLISHED_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 28, 2026

Current repository baseline:

- Branch: `main`
- Starting HEAD: `47cff694c2f407f32500826a11a613b457d04683`
- Starting origin/main: `47cff694c2f407f32500826a11a613b457d04683`
- Working tree: clean

This is a documentation-only customer-experience program establishment record. It does not authorize runtime implementation, deployment, visual redesign, database changes, authentication work, telemetry, AI, GIS, provider activation, production mutation, EOI Sprint 4, Executive Workspace implementation, or unrelated work.

## Executive Summary

The REIE 7.1 Customer Experience Completion Program transitions PROJECT ATLAS from enterprise-foundation work back to the public customer experience.

CEP, CIM, CAO, EOI, GIS governance, repository governance, and EPARB have created a substantial enterprise foundation. The remaining high-return work is customer-facing: make the existing experience feel coherent, premium, trustworthy, and complete against the open REIE 7.1 customer requirements.

The strongest first sprint is:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

Sprint 1 should group the requirements that share the same customer surface and implementation mechanics:

- navigation consistency
- company identity and home-link consistency
- route completion clarity
- luxury visual trust
- negative space and clutter reduction
- mobile horizontal spacing polish
- bounded public-trust disclosure review
- search/map visual review within existing provider and certified search semantics

This first sprint should not implement mortgage calculators, lender pages, Sundance editorial content, AI guidance, GIS activation, telemetry, database work, authentication changes, or production mutation.

## Customer Journey Review

Current certified customer journey:

`Home -> Search -> Property -> Market -> Seller / Inquiry`

Repository evidence:

- `app/page.tsx` establishes the home page as a customer pathway hub with search, community, seller, grand-plan, about, and contact entry points.
- `app/search/page.tsx` provides the certified guided property search and map experience.
- `app/properties/[id]/page.tsx` provides property decision context, inquiry entry, market links, related listings, and public listing facts.
- `app/market/page.tsx`, `app/market/[city]/page.tsx`, and `app/market/[city]/[slug]/page.tsx` provide market and neighborhood context.
- `app/sell/page.tsx` provides seller strategy and the existing `HomeValueEstimator`.
- `components/Footer.tsx` provides global footer navigation and public-trust links.
- `app/layout.tsx` renders the global `BrokerageAttribution` above all public pages.

Customer-facing strengths:

- Major public capabilities already have routes.
- The home page functions as a decision hub rather than duplicating all page experiences.
- Search, property, market, and seller journeys are certified.
- Public trust, privacy, accessibility, fair housing, contact, terms, and brokerage disclosure pages exist.
- Passive measurement attributes exist without telemetry activation.

Customer-facing friction:

- Public headers are route-specific; global menu consistency is not certified.
- Company identity and home-link placement are present on some major pages but not proven across all public routes.
- Several customer-facing pages still rely on visible borders, dense cards, or compact spacing that conflict with the luxury/negative-space requirements.
- Mobile spacing is partially implemented but not globally certified against the REIE 7.1 source concern.
- `app/layout.tsx` renders brokerage attribution globally at the top; disclosure relocation or simplification requires legal/brokerage review.
- `/sell` contains seller valuation capability, but no dedicated home-worth route exists.
- No mortgage calculator route was found.
- No recommended lender route was found.
- No Sundance route or Sundance article strategy was found.
- Search map color requirements remain partially implemented or not found because provider/style control is bounded.

## Open REIE Requirements

Highest-priority open or partially implemented customer-facing requirements:

| Requirement | Current repository evidence | Current status | Program handling |
| --- | --- | --- | --- |
| REIE-ADJ-001 | Public pages still use many bordered sections/cards. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1 visual trust baseline. |
| REIE-ADJ-002 | Core routes exist; mortgage, lender, and Sundance routes are missing. | `PARTIALLY_IMPLEMENTED` | Include route inventory and route clarity in Sprint 1; defer missing content-heavy routes. |
| REIE-ADJ-005 | CEP improved presentation, but no REIE 7.1 global luxury audit is certified. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-006 | Responsive spacing exists, but no global negative-space certification exists. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-007 | CTA hierarchy improved, but global declutter remains open. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-008 | Search map uses existing tile/provider behavior and cyan UI accents. | `PARTIALLY_IMPLEMENTED` | Include visual review only; do not replace map provider. |
| REIE-ADJ-009 | No three-option map theme selector found. | `NOT_FOUND_IN_REPOSITORY` | Defer to future map-theme authorization. |
| REIE-ADJ-011 | Global footer exists; headers are route-specific. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-012 | Top-left company identity exists on home and sell; not globally proven. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-013 | Brand-home links exist on some pages; not globally proven. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-014 | Schema and AEO helpers exist, but full AEO completion is not certified. | `PARTIALLY_IMPLEMENTED` | Defer until route/navigation cleanup. |
| REIE-ADJ-015 | No `/mortgage` route found. | `NOT_FOUND_IN_REPOSITORY` | Defer to buyer-financing readiness review. |
| REIE-ADJ-016 | No lender route found. | `NOT_FOUND_IN_REPOSITORY` | Defer to lender-governance and compliance review. |
| REIE-ADJ-017 | `/sell` and valuation API exist; no dedicated home-worth page found. | `PARTIALLY_IMPLEMENTED` | Defer to Sprint 2 candidate after Sprint 1. |
| REIE-ADJ-018 | `BrokerageAttribution` renders globally before `main`. | `NOT_FOUND_IN_REPOSITORY` | Include analysis only; runtime relocation requires legal/brokerage authorization. |
| REIE-ADJ-019 | Summary/detail disclosure separation exists. | `PARTIALLY_IMPLEMENTED` | Include bounded public-trust review; preserve legal content. |
| REIE-ADJ-020/021/022 | No Sundance route found; article route exists. | `NOT_FOUND_IN_REPOSITORY` / `PLANNED` | Defer to local editorial program. |
| REIE-ADJ-023 | Responsive padding exists; source-specific mobile crowding not certified. | `PARTIALLY_IMPLEMENTED` | Include in Sprint 1. |
| REIE-ADJ-024/025 | Initial map styling and water-color control not certified. | `PARTIALLY_IMPLEMENTED` / `NOT_FOUND_IN_REPOSITORY` | Include only bounded visual QA; defer provider/style changes. |

Geographic and enterprise-knowledge requirements REIE-ADJ-026 through REIE-ADJ-040 remain implemented-certified governance boundaries. They do not authorize GIS, AI, provider activation, customer visibility, runtime activation, or production mutation.

## Customer Trust Analysis

Trust is created by:

- a predictable home base and escape route from every major journey
- consistent brand identity in a known location
- clean visual hierarchy that makes the next action obvious
- restrained public-trust disclosure placement that preserves legal content without overwhelming the first impression
- search/property/market/seller continuity that does not make users relearn navigation on every page
- customer-safe explanations around property intelligence, valuation, financing, market context, and map limits
- preserving certified inquiry, tour, saved-search, alert, seller, CRM, email, admin, and protected-intelligence boundaries

Trust is weakened by:

- route-specific headers that feel like separate products
- excessive visible borders and dense cards
- mobile edge crowding
- top-of-page disclosure dominance if it distracts from customer orientation
- missing expected routes for mortgage, lender, home-worth, and Sundance content
- implied map or geographic precision beyond current authorized capability

## Luxury Experience Analysis

Luxury presentation in this repository should mean quiet confidence, clear editorial hierarchy, generous spacing, excellent typography discipline, and fewer competing boxes.

The current public experience already has strong ingredients:

- dark premium palette
- high-quality home hero image
- structured public routes
- market and property intelligence content
- high-trust public disclosures
- route-specific customer pathways

The unfinished luxury work is not a full redesign. It is a disciplined reduction of clutter and inconsistency:

- fewer unnecessary borders
- more consistent section spacing
- stronger typographic hierarchy
- cleaner top-level navigation
- better mobile side padding
- calmer card density
- route transitions that feel intentional rather than stitched together

## Navigation Analysis

Observed navigation architecture:

- Home page defines local `navigationLinks`.
- Seller page has a simple top-left brand link but not the same header as home.
- Market page uses a top-left brand link and page-local CTAs.
- Search page delegates customer navigation into `SearchInterface`.
- Property pages include links back to search, market, property authority links, inquiry surfaces, and related listings.
- Footer links are globally reused through `components/Footer.tsx`.

Confirmed gap:

REIE-ADJ-011, REIE-ADJ-012, and REIE-ADJ-013 remain partially implemented because global header/menu identity behavior is not certified across all major public routes.

Sprint 1 should establish a shared public-navigation standard, but the implementation should remain narrow:

- consistent company identity
- identity links to `/`
- consistent major journey links where appropriate
- accessible labels
- mobile-safe behavior
- no broad site-navigation redesign
- no customer authentication or admin-auth changes

## Mobile Analysis

Repository evidence shows responsive padding and breakpoint usage across public pages. The REIE 7.1 register still classifies mobile crowding as partially implemented because there has not been a source-specific mobile spacing audit.

Sprint 1 should verify and improve:

- 320px, 386px, tablet, and desktop public route spacing
- no horizontal overflow
- navigation reachability
- readable heading scale
- CTA wrapping
- card density
- map/list controls where already certified
- brokerage disclosure impact on first viewport

Sprint 1 should not alter search semantics, result eligibility, map provider behavior, saved-search behavior, inquiry/tour submissions, or seller-lead mutation logic.

## Brand Consistency Review

The brand appears consistently in copy as `David Quinn Group`, and `lib/publicTrust.ts` centralizes public trust naming.

Open brand-consistency work:

- Ensure public route headers place company identity predictably.
- Ensure the identity links home.
- Keep the home page as the customer base.
- Avoid mixing route-specific header patterns without a reason.
- Align CTA language across search, market, property, seller, grand-plan, about, and contact surfaces.

Brand work must preserve:

- public trust disclosures
- fair housing and accessibility routes
- brokerage disclosure requirements
- no unsupported brokerage, lender, MLS, geographic, AI, or valuation claims

## Implementation Priorities

Priority 1:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

Goal:

Create the minimum customer-facing improvement package that makes the existing experience feel coherent, premium, and easier to navigate without changing business logic.

Authorized candidate scope for a future Sprint 1 implementation:

- shared public navigation standard for major public routes
- consistent top-left company identity and home-link behavior
- route completion inventory and customer-facing route clarity
- visual border/line reduction where no functional framing is needed
- negative-space and density pass on major public routes
- mobile side-spacing pass
- bounded brokerage disclosure presentation review with legal-preservation constraints
- bounded search/map visual QA without new provider, map engine, or GIS activation
- focused deterministic regression coverage

Explicitly outside first sprint:

- mortgage calculator implementation
- recommended lender route
- lender relationship or endorsement
- Sundance route or article production
- dedicated home-worth route implementation
- AI guidance
- GIS/provider activation
- telemetry activation
- database changes
- authentication changes
- admin dashboard/workspace changes

## Recommended Sprint Sequence

Sprint 1:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

- Navigation consistency.
- Route clarity.
- Brand-home consistency.
- Luxury spacing.
- Visual trust and clutter reduction.
- Mobile polish.
- Bounded disclosure/map visual review.

Sprint 2 candidate:

`REIE_7_1_SELLER_VALUATION_ROUTE_COMPLETION`

- Dedicated home-worth route if separately authorized.
- Reuse `/sell`, `HomeValueEstimator`, and existing valuation boundary.
- Do not create automated valuation claims or new persistence without authorization.

Sprint 3 candidate:

`REIE_7_1_BUYER_FINANCING_AND_MORTGAGE_READINESS_REVIEW`

- Governance and compliance review before any mortgage calculator or lender page implementation.
- Define assumptions, disclosures, lender boundaries, and prohibited claims.

Sprint 4 candidate:

`REIE_7_1_LOCAL_EDITORIAL_EXPERIENCE_READINESS`

- Sundance page/article strategy only after content ownership, rights, route purpose, and editorial governance are authorized.

Sprint 5 candidate:

`REIE_7_1_SEARCH_MAP_VISUAL_THEME_REVIEW`

- Map theme and water-color feasibility review only if provider/style control can be handled without unauthorized GIS/provider activation.

## Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Documentation-only program is mistaken for implementation approval | High | Keep Sprint 1 explicitly not authorized until David approves it separately. |
| Luxury polish becomes broad redesign | High | Limit Sprint 1 to major public routes and traceable REIE 7.1 requirements. |
| Navigation changes regress certified journeys | High | Preserve CEP-certified search, property, market, seller, inquiry, saved-search, and alert behavior. |
| Brokerage disclosure simplification weakens legal posture | High | Treat disclosure changes as bounded review unless legal/brokerage approval is present. |
| Mortgage or lender work creates compliance exposure | High | Defer to buyer-financing readiness review. |
| Map styling implies unauthorized GIS/provider activation | High | Limit Sprint 1 to existing map provider/style controls and customer-safe language. |
| Missing route work expands too quickly | Medium | Defer mortgage, lender, Sundance, and dedicated home-worth routes to separate decisions. |
| Mobile polish misses real breakpoints | Medium | Require desktop, tablet, mobile, and narrow-mobile review in future implementation validation. |

## Executive Recommendation

Answer to required questions:

1. Customers should first see a premium home base that orients them to search, market, seller strategy, property evaluation, and advisory contact without clutter.
2. The unfinished areas are global navigation consistency, public visual polish, mobile spacing, route-completion clarity, brokerage-disclosure presentation, map theme expectations, and missing financing/editorial/seller-valuation routes.
3. Pages needing review are `/`, `/search`, `/market`, `/market/[city]`, `/market/[city]/[slug]`, `/properties/[id]`, `/sell`, `/grand-plan`, `/about`, `/contact`, and public trust routes. The first sprint should polish patterns, not fully redesign all pages.
4. Missing routes include mortgage calculator, recommended lender, Sundance, and a dedicated home-worth route.
5. Incomplete journeys include buyer financing, lender guidance, dedicated seller valuation, Sundance editorial discovery, global navigation continuity, and map-theme customization.
6. The greatest trust comes from consistent navigation, stable brand identity, honest source/valuation/disclosure boundaries, readable mobile layouts, and preservation of certified behavior.
7. The luxury experience comes from restrained presentation, generous negative space, fewer borders, clear hierarchy, strong photography, and calm CTA structure.
8. One implementation sprint should group navigation consistency, brand-home behavior, visual trust, luxury spacing, mobile polish, route clarity, and bounded public trust/map visual review.
9. Sprint 1 should absolutely not change search semantics, property eligibility, map provider, inquiries, tours, saved searches, alerts, CRM, seller processing, admin authentication, database schema, telemetry, AI, GIS, provider access, or production behavior outside the authorized public UI scope.
10. The minimum implementation producing maximum customer impact is a controlled public-navigation and visual-trust baseline across major public routes, with responsive validation and no backend changes.

Final recommendation:

David should next decide whether to authorize `REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`.

Until that decision is made, this program is established as planning and governance only.
