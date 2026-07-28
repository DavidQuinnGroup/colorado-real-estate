# PROJECT ATLAS(tm) - REIE 7.1 First Impression Experience Design Review(tm)

Status: `REIE_7_1_FIRST_IMPRESSION_EXPERIENCE_DESIGN_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 28, 2026

Current repository baseline:

- Branch: `main`
- Starting HEAD: `4b6e0bf2512d7c9a6e228a48d2dd216ce1e65ab6`
- Starting origin/main: `4b6e0bf2512d7c9a6e228a48d2dd216ce1e65ab6`
- Working tree: clean

This is a documentation-only design review. It defines the desired first-impression customer experience before any implementation. It does not authorize runtime implementation, deployment, visual redesign, database changes, authentication work, telemetry, AI, GIS, provider activation, production mutation, EOI Sprint 4, Executive Workspace implementation, or unrelated work.

## Executive Summary

The first five minutes of REIE should feel calm, premium, intelligent, and easy to trust.

The current public experience has substantial certified capability: home orientation, guided search, property intelligence, market intelligence, seller strategy, public trust routes, global footer navigation, and governed disclosures. The remaining first-impression issue is not absence of substance. It is that the customer can feel the seams between individually improved routes.

The first impression should communicate:

- David Quinn Group is the trusted guide.
- The customer is in a premium advisory environment, not a generic portal.
- The next step is obvious.
- The experience has depth, but does not overwhelm.
- Intelligence is present, but not theatrical.
- Legal and trust disclosures are present, but not dominant.
- Search, property, market, and seller paths belong to one coherent journey.

The recommended implementation package remains:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

This review recommends that Sprint 1 be treated as a first-impression experience pass across the major public routes, not as a feature expansion sprint.

## Customer Emotion Model

Target emotions:

| Emotion | Customer signal | Design implication |
| --- | --- | --- |
| Trust | "This is credible and professionally governed." | Consistent brand identity, restrained disclosures, predictable navigation, no unsupported claims. |
| Luxury | "This feels edited, intentional, and premium." | Generous negative space, fewer boxes, stronger photography, quieter surfaces, cleaner type rhythm. |
| Clarity | "I know where I am and what to do next." | Stable navigation, plain CTA hierarchy, route titles that match customer intent. |
| Intelligence | "This helps me think better." | Market/property/search context presented as decision support, not noise. |
| Simplicity | "I can move without decoding the site." | Fewer competing controls, reduced density, consistent journey language. |
| Confidence | "I can take the next step without risk." | Safe explanations before forms, preserved trust boundaries, visible recovery paths. |
| Calm | "This is not pressuring me." | Spacious layout, restrained motion, no intrusive popups, no cluttered hero surfaces. |
| Professionalism | "This is a serious advisory firm." | Editorial-quality copy, consistent legal posture, stable visual system. |

First 30-second target:

The customer should see a premium Colorado advisory brand, understand the primary pathways, and feel that REIE is a sophisticated decision experience rather than a standard real estate website.

Current first 30-second risk:

The home page is strong, but route-specific headers, visible borders, dense cards, and global brokerage attribution can make the public experience feel more assembled than unified.

## First Five Minutes Journey

Minute 0-1: Orientation

- Customer lands on the home page.
- The brand is immediately visible.
- The page explains the experience through search, seller strategy, market context, and grand-plan planning.
- The customer should not need to understand PROJECT ATLAS, internal governance, or technical intelligence architecture.

Minute 1-2: Choosing a path

- Buyer should naturally move to `/search`.
- Seller should naturally move to `/sell` or future dedicated home-worth path.
- Research-oriented customer should move to `/market`.
- Planning-oriented customer should move to `/grand-plan`.

Minute 2-4: Confidence building

- Search should show list/map coherence and not trap the user.
- Property pages should make price, facts, condition questions, market links, inquiry, and related listings feel connected.
- Market pages should explain context without implying forecast, appraisal, AI advice, or hidden provider intelligence.
- Seller pages should set expectations before intake.

Minute 4-5: Next action

- Customer should understand whether to search more, view a property, read market context, request seller review, ask a property question, or contact David Quinn Group.
- The experience should not pressure form submission.
- The customer should see enough trust language to feel safe, but not so much legal text that momentum collapses.

## Luxury Design Standard

Luxury in REIE should mean restrained confidence.

Visual hierarchy:

- One dominant page idea per first viewport.
- Primary CTA should be obvious, secondary actions visibly quieter.
- Intelligence details should support the decision after orientation, not compete with the headline.

Spacing philosophy:

- Use generous vertical rhythm between major sections.
- Avoid edge crowding on mobile.
- Use spacing and hierarchy before borders.
- Treat borders as functional separators, not default decoration.

Typography philosophy:

- Headings should be strong but controlled.
- Avoid excessive all-caps density inside compact cards.
- Use large type for true hero or section-defining moments only.
- Keep body copy readable with calm line length and clear contrast.

Luxury design language:

- Premium dark base may remain.
- Cyan/Caribbean accents should be used as orientation and action highlights, not as decoration everywhere.
- Cards should feel purposeful and edited.
- Photography should carry place, property, lifestyle, or advisory context.

Content density rules:

- The first viewport should explain one decision, not every capability.
- Repeated cards should be visually quieter than primary actions.
- Trust text should be present, concise, and positioned where it supports action.
- Avoid putting multiple competing frameworks at the same visual weight.

Negative-space rules:

- Every major public route should have breathing room around hero, primary action, and first content transition.
- Mobile layouts should preserve side padding and avoid cramped two-column remnants.
- Dense intelligence blocks should be grouped below the orientation layer.

Color philosophy:

- Use the existing dark premium palette as the foundation.
- Use white and warm light sections only for deliberate contrast.
- Use cyan/Caribbean blue to guide attention.
- Avoid overusing borders and translucent panels to create artificial structure.

Motion philosophy:

- Motion, if later implemented, should be subtle: small hover lifts, map/list transitions, focus-preserving route changes.
- Avoid theatrical animation, parallax distraction, or anything that suggests a marketing gimmick.
- Respect reduced-motion preferences.

Interaction philosophy:

- Primary route movement should be predictable.
- Buttons should be action-oriented and labels should describe the actual next step.
- Map controls should be reachable and not trap touch interaction.
- Forms should explain what happens next before submission.

## Trust Design Standard

Brand consistency:

- `David Quinn Group` should appear predictably in the upper-left navigation area on major public routes.
- Brand identity should link to `/`.
- Public route headers should feel related even when page-specific actions differ.

Professionalism:

- Copy should sound advisory, not promotional.
- Avoid unsupported certainty claims.
- Avoid internal program language in public UI.
- Maintain the distinction between customer-facing guidance and internal/protected intelligence.

Brokerage and legal presentation:

- Brokerage disclosure must remain preserved unless separately approved for relocation or simplification.
- The current global `BrokerageAttribution` creates trust coverage but may dominate the first impression.
- Any implementation should treat disclosure work as legal-preservation design, not removal by preference.

Authority:

- Authority should come from clarity, local context, construction perspective, and market discipline.
- Avoid exposing internal confidence mechanics, protected intelligence, provider names, or governance status to customers.

Customer reassurance:

- Before forms, explain what happens next.
- State when something is not an appraisal, forecast, automated valuation, or AI recommendation.
- Preserve contact/privacy/accessibility/fair-housing trust routes.

## Navigation Standard

Navigation should act as the customer's nervous system for the site.

Required behavior for a future implementation:

- Major public routes should share a recognizable header standard.
- Company identity should be top-left and link to `/`.
- Primary links should emphasize Search, Market, Sell, Grand Plan, About, and Contact, subject to responsive constraints.
- Mobile navigation should prioritize clarity over link volume.
- Footer navigation should remain a stable secondary route map.
- Search/map and property pages should retain clear exits to home, search, market, seller, and contact paths.

Do not change:

- protected admin navigation
- authentication/session behavior
- search semantics
- saved-search behavior
- inquiry/tour/valuation mutation behavior
- CRM, alert, email, or seller-lead processing

## Spacing Standard

Desktop:

- Major sections should feel edited and spacious.
- Content max-widths should remain controlled.
- Use fewer framed panels where spacing can create hierarchy.

Tablet:

- Preserve readable line lengths.
- Avoid cards compressing into awkward grids.
- Keep CTAs reachable without crowding.

Mobile:

- Minimum side padding should feel comfortable at 320px and 386px.
- Buttons should wrap cleanly and maintain usable touch targets.
- Headings should not crowd the viewport edges.
- Sticky/fixed elements should not obscure the first meaningful content.
- Map/list toggles and form actions should remain reachable.

## Typography Standard

The type system should feel editorial and premium.

Rules:

- Use hero-scale type only for hero or major section titles.
- Avoid dense uppercase paragraphs.
- Keep letter spacing stable and readable.
- Use small uppercase labels sparingly as orientation, not as a full information layer.
- Pair strong headings with relaxed body copy.
- Keep button labels short and action-specific.

## Mobile Standard

The mobile experience should feel like a designed product, not a compressed desktop.

Mobile requirements for future implementation review:

- No horizontal overflow at 320px and 386px.
- Navigation remains reachable and understandable.
- Brokerage disclosure does not consume excessive first-viewport attention.
- Search input, filters, chips, list/map toggle, and property cards remain usable.
- Map interactions do not trap the customer.
- CTAs use stacked layouts where needed.
- Forms explain expectation before input.
- Typography remains readable without viewport-based font scaling.

## Page-by-Page Review

| Page/surface | Current strengths | Current weaknesses | Customer perception | Recommended improvements | Priority |
| --- | --- | --- | --- | --- | --- |
| Home `/` | Strong hero image, clear pathways, premium tone, home-base concept. | Header is page-local; some route links are section anchors rather than route paths. | Strong first impression, but must become the system standard. | Use home as design anchor for shared public navigation and first-impression rhythm. | Critical |
| Navigation/header | Home and some routes show brand identity; footer is global. | Headers are route-specific and not globally certified. | Customer may feel pages are separate products. | Establish shared public header and top-left brand-home behavior. | Critical |
| Search `/search` | Certified search/map journey, clear search API, zero-result/degraded behavior, map/list controls. | Search is functionally dense; map visual theme remains partially unresolved. | Powerful but can feel more utilitarian than luxury. | Preserve semantics; improve visual containment, route exits, and bounded map visual QA. | High |
| Property `/properties/[id]` | Strong decision brief, inquiry path, market links, related listings, property context. | Content volume can feel dense; must stay aligned with route navigation. | Intelligent and useful, but could benefit from calmer transitions. | Preserve property intelligence; align header, spacing, CTA hierarchy, and related-path clarity. | High |
| Market `/market` | Market discovery exists, connects to search and seller journeys, customer-safe non-forecast language. | Visual density and local header pattern differ from home. | Useful context, but less emotionally premium than home. | Align with public navigation standard and reduce unnecessary framing where safe. | High |
| City/neighborhood market pages | Existing market context and neighborhood paths support local authority. | Needs first-impression consistency review against top-level market page. | Locally authoritative if hierarchy stays clear. | Apply same spacing/navigation standards after top-level routes. | Medium |
| Seller `/sell` | Clear seller strategy, expectation-setting, existing `HomeValueEstimator`. | No dedicated home-worth route; header differs from home. | Trustworthy, but requested seller route feels incomplete. | Preserve seller flow; defer dedicated route to later sprint; align navigation/spacing now. | High |
| Grand Plan `/grand-plan` | Differentiated advisory path and human-centered planning language. | Uses distinct `gp-*` style system that may feel detached. | Strong concept, potentially disconnected visually. | Bring into shared navigation and visual rhythm without changing intake behavior. | Medium |
| About `/about` | Strong editorial positioning and advisory philosophy. | Mixes dark and light sections; dense card grid. | Credible and thoughtful, but can feel card-heavy. | Reduce visual busyness and align CTA/header behavior. | Medium |
| Contact `/contact` | Conservative trust routing; avoids unverified contact claims. | Public-trust template feels more governance-heavy than customer-warm. | Safe but formal. | Preserve facts; simplify first impression and route back to customer action. | Medium |
| Public trust pages | Strong compliance posture and transparency. | Can feel internal/governance-forward. | Trustworthy but less luxurious. | Keep as detailed backstop; make summary surfaces lighter where legally allowed. | Medium |
| Footer | Global route map, public trust links, brokerage statement. | Dense and governance-heavy. | Useful but could feel operational. | Preserve links; future polish should improve rhythm without removing required disclosures. | Medium |
| Brokerage attribution | Globally present and explicit. | Top-of-page placement can dominate first impression. | Trust coverage, but possible visual interruption. | Treat relocation/simplification as legal-preservation design decision requiring approval. | Critical boundary |
| Map | Certified search/map behavior and cyan UI accents. | Electric Caribbean Blue water/style and theme selection requirements not satisfied. | Functional and useful, not fully brand-tailored. | Bounded style QA only; no new provider or GIS activation. | Medium |

## Requirements Mapping

| REIE requirement | Design review status | Recommendation |
| --- | --- | --- |
| REIE-ADJ-001 | Partially satisfied | Sprint 1 should reduce decorative borders where spacing/hierarchy can replace them. |
| REIE-ADJ-002 | Partially satisfied | Sprint 1 should clarify route inventory and pathways; missing route implementations require later authorization. |
| REIE-ADJ-003 | Satisfied | Preserve home as home base. |
| REIE-ADJ-004 | Satisfied | Preserve home as pathway guide, not content duplication. |
| REIE-ADJ-005 | Partially satisfied | Sprint 1 should define and apply luxury visual standard. |
| REIE-ADJ-006 | Partially satisfied | Sprint 1 should improve negative-space consistency. |
| REIE-ADJ-007 | Partially satisfied | Sprint 1 should reduce visual density. |
| REIE-ADJ-008 | Partially satisfied | Sprint 1 may review map visual accents within existing provider/style limits. |
| REIE-ADJ-009 | Still open | Defer three map themes. |
| REIE-ADJ-010 | Satisfied | Preserve clear route exits from search/map. |
| REIE-ADJ-011 | Partially satisfied | Sprint 1 should establish shared public navigation standard. |
| REIE-ADJ-012 | Partially satisfied | Sprint 1 should standardize top-left company identity. |
| REIE-ADJ-013 | Partially satisfied | Sprint 1 should standardize identity link to `/`. |
| REIE-ADJ-014 | Partially satisfied | Defer AEO expansion until route/navigation standard is complete. |
| REIE-ADJ-015 | Still open | Defer mortgage calculator to financing readiness review. |
| REIE-ADJ-016 | Still open | Defer lender page to compliance and relationship governance. |
| REIE-ADJ-017 | Partially satisfied | Defer dedicated home-worth route to seller valuation sprint. |
| REIE-ADJ-018 | Still open | Treat as legal-preservation disclosure review; no removal without approval. |
| REIE-ADJ-019 | Partially satisfied | Sprint 1 may recommend lighter presentation only if legal content remains preserved. |
| REIE-ADJ-020 | Still open | Defer Sundance page. |
| REIE-ADJ-021 | Still open | Defer Sundance URL. |
| REIE-ADJ-022 | Planned | Defer Sundance article strategy. |
| REIE-ADJ-023 | Partially satisfied | Sprint 1 should include mobile spacing validation. |
| REIE-ADJ-024 | Partially satisfied | Sprint 1 should include bounded map first-state visual review. |
| REIE-ADJ-025 | Still open | Defer water-color/provider-style control. |
| REIE-ADJ-026 through REIE-ADJ-040 | Satisfied as governance boundaries | Preserve prohibitions; no GIS, AI, provider, runtime, or customer activation. |

No requirement is superseded by this design review.

## Recommended Implementation Package

Recommended first implementation package:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

Minimum scope for maximum first-impression improvement:

- Create or apply a shared public navigation/header standard for major public routes.
- Standardize top-left `David Quinn Group` identity and home-link behavior.
- Normalize route transition language between Home, Search, Property, Market, Sell, Grand Plan, About, and Contact.
- Reduce decorative border/line usage where layout hierarchy can carry the structure.
- Increase perceived negative space on dense public sections.
- Improve mobile horizontal comfort at narrow widths.
- Review brokerage disclosure placement and copy as a design requirement, while preserving required legal content and stopping before any unauthorized legal change.
- Review map visual presentation within existing provider/style controls, without new provider access, new map engine, GIS activation, or semantic changes.
- Add future deterministic checks only if implementation is separately authorized.

Excluded from the recommended first package:

- Mortgage calculator implementation.
- Recommended lender page.
- Dedicated home-worth route.
- Sundance page or article creation.
- AEO expansion.
- Three map themes.
- Electric Caribbean Blue water-color control requiring provider/style change.
- Search engine redesign.
- Property intelligence redesign.
- Seller workflow redesign.
- Authentication changes.
- Database changes.
- Telemetry, AI, GIS, provider activation, deployment, or production mutation.

## Executive Recommendation

Approve this design review as the governing first-impression standard for REIE 7.1 Sprint 1.

If David is ready to proceed, the next executive decision should be whether to authorize:

`REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE`

Implementation should remain constrained to the smallest customer-facing package that makes REIE feel unified, premium, trustworthy, and calm in the first five minutes. It should not expand into financing, lender, Sundance, GIS, AI, telemetry, database, authentication, or production certification work.

Until separately authorized, this review remains documentation only.
