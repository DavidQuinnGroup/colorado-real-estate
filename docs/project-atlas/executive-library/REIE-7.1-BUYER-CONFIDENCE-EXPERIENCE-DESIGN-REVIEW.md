# REIE 7.1 Buyer Confidence Experience Design Review

Status: `REIE_7_1_BUYER_CONFIDENCE_EXPERIENCE_DESIGN_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 28, 2026

Review version: `v1.0`

Current repository baseline:

- Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`
- Branch: `main`
- Starting HEAD: `d700396b844018deb5a0eb6bfbc4015896452942`
- Starting origin/main: `d700396b844018deb5a0eb6bfbc4015896452942`
- Working tree: clean

This is a documentation-only design review. It does not authorize implementation, deployment, runtime changes, Mortgage Calculator, Lender implementation, AEO, Sundance, AI, GIS, provider activation, authentication changes, database changes, production mutation, or unrelated work.

## 1. Executive Summary

REIE 7.1 now has certified production foundations for first impression, shared navigation, route continuity, visual trust, and seller confidence. The remaining high-value customer-experience opportunity is buyer confidence.

The current buyer journey already contains strong pieces:

- home page buyer entry through `Start Your Search`
- guided search with list/map, filters, active criteria, zero-result recovery, degraded-search messaging, market links, advisor links, and Grand Plan continuity
- property pages with Property Decision Brief, decision summary, construction questions, financial questions, public-fact source boundaries, market links, related listings, and inquiry entry
- market pages with city and neighborhood context, market decision briefs, neighborhood paths, and buyer/seller FAQs
- shared navigation and footer from certified Sprint 1

The gap is not inventory discovery. The gap is confidence sequencing.

Buyers can search, compare, evaluate, and inquire, but the experience does not yet provide a single calm buyer-confidence path that says: start broad, understand the market, compare options, understand ownership-cost assumptions, clarify neighborhood fit, then decide whether to tour, ask, save, or continue researching.

The strongest next implementation package is:

`REIE_7_1_SPRINT_3_BUYER_CONFIDENCE_EXPERIENCE_BASELINE`

Recommended package:

- create a buyer-confidence orientation layer using existing home, search, property, market, neighborhood, and inquiry capabilities
- strengthen buyer-specific transitions from home -> search -> property -> market/neighborhood -> inquiry
- introduce affordability awareness as education and verification guidance, not a calculator or lender recommendation
- clarify market timing through existing market context
- make neighborhood confidence more discoverable from search and property pages
- preserve all search semantics, inquiry behavior, saved-search behavior, alerts, valuation behavior, CRM, database, AI, GIS, provider, and authentication boundaries

## 2. Buyer Emotion Model

### Discovery

What the buyer feels:

- I want options, but I do not know where to start.
- I am comparing price, location, lifestyle, commute, schools, risk, and timing at once.
- I need to know whether this site can help without overwhelming me.

Current repository support:

- `app/page.tsx` presents REIE as Colorado Front Range advisory and offers `Start Your Search`.
- Home copy promises better decisions, local expertise, and construction knowledge.
- Featured communities link to market and search paths.

Current friction:

- The buyer value proposition is strong but broad. It does not yet give the buyer a dedicated confidence path.
- Financing confidence is implied through property-level financial questions but not introduced early.
- Neighborhood confidence is present in market/community data but not framed as a buyer confidence sequence.

Intended emotional state:

The buyer should feel oriented, not sold to.

### Orientation

What the buyer feels:

- I need a structured way to narrow choices.
- I need to understand what the map, filters, market pages, and property details are supposed to do together.

Current repository support:

- `components/search/SearchInterface.tsx` says: start broadly, explore together, refine with context.
- `components/search/SearchControls.tsx` clarifies place, budget, home type, beds, baths, and specific-property query fields.
- Active chips and criteria summaries help buyers understand what is shaping the result set.

Current friction:

- The buyer sees useful search controls, but not a buyer journey frame: what to do before searching, what to do after a property catches attention, and how to use market/neighborhood context.
- The search experience currently includes links to market, seller review, contact, and Grand Plan, but a buyer-specific confidence pathway is not the dominant hierarchy.

Intended emotional state:

The buyer should feel that search is a guided decision process, not a filter panel.

### Search

What the buyer feels:

- I need to compare many homes quickly without losing context.
- I need to know whether results are complete enough to trust.

Current repository support:

- Certified search/map baseline exists.
- Search state, list/map synchronization, active criteria, zero-result recovery, fallback messaging, and mobile List/Map controls are implemented.
- Selected-property drawer explains review context and next steps.

Current friction:

- Search helps buyers refine, but it does not yet explicitly teach how to evaluate tradeoffs: location fit, affordability assumptions, market timing, condition questions, and neighborhood confidence.

Intended emotional state:

The buyer should feel in control of the search and understand what each refinement is doing.

### Comparison

What the buyer feels:

- I found several homes, but I do not know which tradeoffs matter most.
- A lower price may hide higher ownership risk.
- A beautiful home may not be the best strategic fit.

Current repository support:

- Property pages include calculated price per square foot, related listings, public facts, construction context, market pathway, source/freshness boundaries, decision brief, decision summary, and questions to ask.
- Selected-property drawer includes review context, map context, property signals, and links to property, inquiry, and market.

Current friction:

- The property decision workspace is strong, but the transition from search selection to buyer confidence is still property-by-property.
- There is no buyer confidence summary across "known, compare, verify, discuss, next" before a buyer is asked to contact.

Intended emotional state:

The buyer should feel that the platform helps them compare wisely, not just choose emotionally.

### Financing Awareness

What the buyer feels:

- I need to know what I can afford.
- I do not want a generic calculator to give me false precision.
- I need to know which assumptions belong to a lender, insurer, tax professional, attorney, or advisor.

Current repository support:

- Property pages contain `Financial Context`, `Ownership Costs to Verify`, and `Financial Questions to Ask`.
- The terms page warns users to independently verify financing and suitability.
- REIE-ADJ-015 and REIE-ADJ-016 identify Mortgage Calculator and recommended lender page as open future buyer-financing items.

Current friction:

- Financing awareness appears late on the property page, not early in the buyer journey.
- There is no dedicated buyer-facing explanation of affordability assumptions.
- There is no mortgage route or recommended lender route, and implementation is not authorized by this review.

Intended emotional state:

The buyer should feel financially oriented without being pushed into a lender workflow or unsupported estimate.

### Market Understanding

What the buyer feels:

- Is this a good time to buy?
- Is this neighborhood competitive?
- Am I overpaying?

Current repository support:

- `/market` provides market discovery and links to search, seller, city markets, and neighborhood paths.
- City market pages include Market Decision Briefs, market direction, pricing, competitiveness, timing, source disclaimers, and neighborhood hubs.
- Neighborhood market pages include resilience, efficiency, construction, lifestyle, and inventory context.

Current friction:

- Market intelligence is available, but buyers may not know when to use it in the search journey.
- The relationship between city market context, neighborhood context, and property-level comparison needs a clearer buyer-specific explanation.

Intended emotional state:

The buyer should feel that market timing is understandable, not mysterious.

### Decision Confidence

What the buyer feels:

- I need to decide whether to tour, ask a question, keep searching, or pause.
- I do not want to contact an agent before I know what to ask.

Current repository support:

- Property pages ask "Is this property right for me?", "What should I know before touring?", "How does it compare with the market?", and "What should I investigate further?"
- Property inquiry supports `Schedule Tour`, `Ready Now`, `90 Days`, and `Researching`.
- The form includes clear timeline choices and recovery links after submission.

Current friction:

- The strongest buyer-confidence concepts live inside individual property pages. They are not yet visible as a buyer journey across the site.
- "Contact" can still feel like a conversion step instead of the natural outcome of better questions.

Intended emotional state:

The buyer should feel ready to ask a focused question, not pressured to become a lead.

## 3. Buyer Confidence Journey

Ideal journey:

`Home -> Buyer Confidence Orientation -> Guided Search -> Property Decision Brief -> Market / Neighborhood Context -> Affordability Awareness -> Ask / Tour / Continue Search`

### Beginning: Discovery and Orientation

Design intent:

- Explain what REIE helps buyers understand before they search.
- Make search feel consultative.
- Show that the goal is confidence, not lead capture.

Recommended content posture:

- "Start broad, then sharpen the decision."
- "Compare homes by fit, context, timing, condition, and cost assumptions."
- "Use market and neighborhood context before touring."

Primary repository reuse:

- `app/page.tsx`
- `components/home/HomeSearchExperience`
- shared `PublicNavigation`
- existing `/search`, `/market`, `/contact`, and `/grand-plan` paths

### Middle: Search, Comparison, Financing Awareness, and Market Understanding

Design intent:

- Keep search operationally unchanged.
- Add buyer confidence cues around why a buyer should use filters, map, property pages, and market context.
- Introduce affordability awareness as a verification checklist, not a mortgage calculator.

Primary repository reuse:

- `components/search/SearchInterface.tsx`
- `components/search/SearchControls.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `app/properties/[id]/page.tsx`
- `app/market/page.tsx`
- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`

### End: Decision Confidence, Contact, and Next Steps

Design intent:

- Position contact as the next step after the buyer understands what to ask.
- Keep inquiry and tour submission behavior unchanged.
- Preserve the difference between education, public facts, professional interpretation, and external professional review.

Primary repository reuse:

- `PropertyInquiryForm`
- property page decision summary
- property decision brief
- contact route
- existing public trust and terms boundaries

## 4. Trust Review

Trust is created by current repository evidence:

- shared public navigation and consistent home link from Sprint 1
- certified Seller Confidence route from Sprint 2
- guided search state visibility, active criteria, zero-result recovery, and fallback messaging
- property pages that separate public facts from interpretation and professional review
- market pages that disclaim forecast, valuation, appraisal, and AI recommendation posture
- brokerage disclosures and terms pages
- clear non-activation boundaries around telemetry, AI, GIS, provider data, and protected intelligence

Trust is weakened by current buyer-friction points:

- no dedicated buyer confidence orientation
- no early affordability-awareness explanation
- buyer financing requirements remain open and not found as routes
- neighborhood intelligence exists but is not yet framed as a buyer confidence layer
- search-to-property-to-market flow works, but the confidence model is not visible as a single journey
- contact can still appear before a buyer understands what questions to ask

Trust recommendation:

Use buyer confidence language before conversion:

- "What you know"
- "What to compare"
- "What to verify"
- "What to ask"
- "What to do next"

Do not introduce:

- instant affordability claims
- automated mortgage qualification
- recommended lender endorsements
- investment advice
- legal, tax, insurance, lending, or inspection advice
- AI-generated buyer guidance

## 5. Luxury Experience Review

Luxury experience should feel calm, spacious, deliberate, and quietly expert.

Current strengths:

- dark premium public visual system
- certified shared navigation
- mature property visual treatment
- restrained CTA language
- strong real estate intelligence positioning
- property and market pages that already feel more consultative than commodity portals

Current weaknesses:

- buyer confidence is spread across multiple pages instead of composed as one premium journey
- search panels are necessarily dense because they carry list/map/filter controls
- market pages include substantial intelligence but can feel analytical before a buyer understands why it matters
- financing anxiety is not addressed early enough

Luxury recommendations:

- add one cohesive buyer-confidence orientation package rather than more dense cards everywhere
- use editorial sectioning, fewer borders, and direct buyer questions
- keep typography calm and clear
- avoid feature-heavy copy
- make "education before conversion" visible
- keep mobile layouts comfortable and non-overflowing

## 6. Search Experience Review

Current search strengths:

- supports city, price, beds, baths, property type, and keyword/specific-property search controls
- active filter chips and criteria summaries are visible
- List/Map toggle supports mobile
- search state and degraded-service messaging are customer-safe
- selected-property drawer gives review context and links to full property, inquiry, and market context
- search does not silently change semantics when the map moves

Current search uncertainty:

- buyers may not know which first refinement matters most
- buyers may treat budget fields as affordability guidance even though they are search filters only
- buyers may not know when to shift from search into market/neighborhood context
- buyers may not know when a property deserves a tour versus more research

Search recommendation:

Future implementation should add buyer-confidence orientation around existing search controls:

- start with place and lifestyle fit
- then budget as a search range, not affordability advice
- then compare property type, condition, and market context
- then open property decision brief before asking or touring

No search semantics should change.

## 7. Neighborhood Experience Review

Current neighborhood strengths:

- `lib/neighborhoods.ts` provides neighborhood authority data.
- city market pages surface neighborhood hubs, resilience, efficiency, and local signals.
- neighborhood pages provide construction, resilience, lifestyle, inventory, and related content context.
- article pages can connect neighborhood context to buyer/seller strategy.

Current neighborhood uncertainty:

- neighborhood context is discoverable from market/property paths but not yet framed as part of buyer confidence.
- search does not foreground neighborhood confidence as a guided buyer step.
- buyers may not know which neighborhood signals matter before choosing properties.

Neighborhood recommendation:

Future implementation should make neighborhood support answer:

- "Does this area fit my daily life?"
- "What should I understand about resilience, access, lifestyle, and inventory?"
- "Which neighborhood context should I read before touring?"

This should reuse existing market and neighborhood pages. It should not activate GIS, infer geographic hierarchy, add provider data, or expose protected intelligence.

## 8. Financing Awareness Review

Current financing support:

- property pages include financial context, ownership costs to verify, and financial questions to ask.
- terms require independent verification of financing, insurance, taxes, legal status, and suitability.
- REIE requirements identify Mortgage Calculator and recommended lender page as open future work.

Current financing gap:

- no `/mortgage` route was found.
- no recommended lender route was found.
- no buyer affordability orientation exists before search.
- no mortgage calculator implementation is authorized.
- no lender relationship or endorsement governance has been completed in this review.

Financing awareness design:

Affordability should be introduced as a confidence checklist:

- price range is a search input, not affordability approval
- total monthly cost depends on loan terms, taxes, insurance, HOA, PMI, maintenance, closing costs, and reserves
- buyers should verify assumptions with qualified lending, insurance, tax, legal, and advisory professionals
- REIE can help organize questions, not issue financing conclusions

Recommended future implementation:

Add buyer-financing awareness copy and checklists using existing page architecture. Do not implement a calculator or lender page in Sprint 3 unless separately authorized after financing governance.

## 9. Market Intelligence Review

Current market strengths:

- `/market` provides a certified discovery destination.
- city market pages include Market Decision Briefs, direction, pricing, timing, competitiveness, inventory, neighborhood hubs, and source-boundary language.
- neighborhood pages include local intelligence useful for buyer confidence.
- property pages link to market context and explain that market context is not a property-specific conclusion.

Current market uncertainty:

- buyers may not know when to consult market context during search.
- timing guidance can feel abstract unless connected to buyer decisions.
- market intelligence exists as a strong destination, but not yet as a buyer confidence step.

Market recommendation:

Future implementation should integrate market timing into the buyer journey:

- before searching: "understand the market shape"
- while comparing: "compare property facts against area context"
- before touring: "know what market facts do and do not answer"
- before contact: "bring focused timing, offer, and diligence questions"

Do not create forecasts, automated recommendations, AI advice, or investment claims.

## 10. Differentiation Strategy

REIE should not try to out-feature Zillow, Redfin, Realtor.com, or brokerage template sites.

The differentiation should be experiential:

- Zillow teaches customers to browse.
- Redfin teaches customers to filter and transact.
- Realtor.com teaches customers to inventory-hop.
- Typical brokerage sites teach customers to contact an agent quickly.
- REIE should teach customers how to think before they act.

Buyer confidence differentiation:

- local market context before urgency
- neighborhood intelligence before surface preference
- construction questions before finish-quality assumptions
- affordability assumptions before price-range confidence
- property decision brief before inquiry
- consultative contact after the buyer knows what to ask

The tone should remain:

- educational
- calm
- premium
- locally authoritative
- transparent
- consultative

## 11. Requirements Mapping

| Requirement | Relationship to Buyer Confidence | Current Status | Design Review Disposition |
| --- | --- | --- | --- |
| REIE-ADJ-001 | Buyer pages should avoid unnecessary visual noise. | `PARTIALLY_IMPLEMENTED` | Continue using calm spacing and fewer decorative borders in future buyer-confidence package. |
| REIE-ADJ-002 | Buyer journey benefits from distinct routes and clear destinations. | `PARTIALLY_IMPLEMENTED` | Buyer Confidence can improve journey clarity without creating every missing route. |
| REIE-ADJ-003 | Home should orient buyers to major pathways. | `IMPLEMENTED_CERTIFIED` | Preserve home as buyer starting point. |
| REIE-ADJ-004 | Home should guide rather than duplicate full experiences. | `IMPLEMENTED_CERTIFIED` | Preserve; add orientation, not full page duplication. |
| REIE-ADJ-005 | Buyer confidence requires luxury page polish. | `PARTIALLY_IMPLEMENTED` | Advance through calm buyer-confidence hierarchy. |
| REIE-ADJ-006 | Buyer anxiety is reduced by negative space and readable pacing. | `PARTIALLY_IMPLEMENTED` | Apply to buyer confidence sections. |
| REIE-ADJ-007 | Too many competing CTAs weaken confidence. | `PARTIALLY_IMPLEMENTED` | Recommend buyer-specific CTA hierarchy. |
| REIE-ADJ-008 | Map visual trust affects buyer confidence. | `PARTIALLY_IMPLEMENTED` | Preserve bounded search/map behavior; defer map styling/provider changes. |
| REIE-ADJ-010 | Buyers need clear exits from search/map. | `IMPLEMENTED_CERTIFIED` | Preserve and make buyer next steps more explicit. |
| REIE-ADJ-011 | Consistent menu bars build buyer trust. | `IMPLEMENTED_CERTIFIED` through Sprint 1 | Preserve shared public navigation. |
| REIE-ADJ-012 | Company identity top-left supports confidence. | `IMPLEMENTED_CERTIFIED` through Sprint 1 | Preserve. |
| REIE-ADJ-013 | Brand-home link supports orientation. | `IMPLEMENTED_CERTIFIED` through Sprint 1 | Preserve. |
| REIE-ADJ-014 | AEO can support future buyer education. | `PARTIALLY_IMPLEMENTED` | Defer AEO expansion. |
| REIE-ADJ-015 | Mortgage Calculator would address affordability anxiety. | `NOT_FOUND_IN_REPOSITORY` | Do not implement in Sprint 3; add affordability awareness only unless separately authorized. |
| REIE-ADJ-016 | Recommended lender page could help but creates compliance risk. | `NOT_FOUND_IN_REPOSITORY` | Defer to lender-governance/compliance review. |
| REIE-ADJ-017 | Home Worth is seller-focused and now production certified. | `IMPLEMENTED_CERTIFIED` by Sprint 2 | Preserve; do not mix seller valuation with buyer confidence. |
| REIE-ADJ-018 | Brokerage disclosure affects first impression. | `PARTIALLY_IMPLEMENTED` through Sprint 1 | Preserve legal disclosure posture. |
| REIE-ADJ-019 | Disclosure clarity supports trust. | `PARTIALLY_IMPLEMENTED` | Preserve summary/detail pattern. |
| REIE-ADJ-023 | Mobile crowding can reduce confidence. | `PARTIALLY_IMPLEMENTED` | Include mobile comfort in future Sprint 3 validation. |
| REIE-ADJ-024/025 | Map color expectations remain bounded by provider/style constraints. | `PARTIALLY_IMPLEMENTED` / `NOT_FOUND_IN_REPOSITORY` | Defer map-theme/provider work. |
| REIE-ADJ-026 through REIE-ADJ-040 | Geographic governance boundaries protect buyer trust. | `IMPLEMENTED_CERTIFIED` | Preserve no GIS/customer activation without separate authorization. |

Buyer journey requirements inferred from repository evidence:

| Buyer Journey Need | Repository Evidence | Status |
| --- | --- | --- |
| Begin search confidently | Home and search orientation | `PARTIALLY_FULFILLED` |
| Understand options | Search list/map and filters | `FULFILLED` |
| Understand neighborhoods | Market and neighborhood pages | `PARTIALLY_FULFILLED` |
| Know what can be afforded | Property financial questions only | `PARTIALLY_FULFILLED` |
| Understand market timing | Market Decision Briefs | `PARTIALLY_FULFILLED` |
| Compare properties | Property Decision Brief and related links | `FULFILLED` |
| Know what to ask before contact | Property decision summary and inquiry form | `PARTIALLY_FULFILLED` |
| Continue naturally after inquiry | Inquiry recovery links | `FULFILLED` |

## 12. Recommended Implementation

Recommended next implementation package:

`REIE_7_1_SPRINT_3_BUYER_CONFIDENCE_EXPERIENCE_BASELINE`

Executive objective:

Create a cohesive buyer confidence journey that helps buyers understand the market, options, neighborhoods, affordability assumptions, property tradeoffs, and next steps before asking for contact.

Recommended scope:

- buyer-confidence orientation on the home/search path
- buyer-specific confidence copy and section hierarchy
- improved search-to-property-to-market buyer continuity
- clearer market/neighborhood confidence links from buyer surfaces
- affordability awareness checklist using existing property financial-question posture
- buyer "known / compare / verify / ask / next" guidance using existing property decision concepts
- mobile and desktop readability review
- documentation and deterministic safety checks

Likely runtime areas if later authorized:

- `app/page.tsx`
- `app/search/page.tsx`
- `components/search/SearchInterface.tsx`
- `components/search/SearchControls.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `app/properties/[id]/page.tsx`
- `app/market/page.tsx`
- narrowly related validation scripts
- governed documentation

Explicit exclusions:

- no Mortgage Calculator
- no recommended lender implementation
- no lender endorsement
- no financing quote or affordability conclusion
- no new search semantics
- no map provider/style replacement
- no saved-search mutation change
- no inquiry/tour backend change
- no CRM workflow change
- no database schema change or migration
- no telemetry activation
- no AI customer guidance
- no GIS or provider activation
- no protected intelligence exposure
- no production mutation

Validation required if later authorized:

- typecheck
- lint
- build
- Prisma validate
- REIE buyer-confidence safety check
- public runtime safety
- search/listing/map safety
- property inquiry safety
- seller journey preservation
- responsive browser review for desktop, tablet, mobile, and narrow mobile
- no horizontal overflow
- no unsupported financing, lender, AI, GIS, provider, valuation, or investment claims

## 13. Executive Recommendation

Authorize `REIE_7_1_SPRINT_3_BUYER_CONFIDENCE_EXPERIENCE_BASELINE` as the next controlled customer-experience implementation sprint only if David wants to continue REIE 7.1 toward buyer trust and buyer conversion.

The sprint should not be a mortgage sprint, lender sprint, AEO sprint, Sundance sprint, AI sprint, GIS sprint, or search-engine redesign. It should be a buyer confidence sprint: a customer-facing orchestration layer that uses existing certified search, property, market, neighborhood, and inquiry capabilities to reduce uncertainty before conversion.

Recommended next executive decision:

David should decide whether to authorize `REIE_7_1_SPRINT_3_BUYER_CONFIDENCE_EXPERIENCE_BASELINE` for controlled implementation. Codex must not authorize that decision.
