# REIE DXT Wave 1D City Market Briefing Implementation Plan

Status: `DXT_WAVE_1D_CITY_MARKET_BRIEFING_PLAN_READY`

City Market runtime remains unauthorized.

No city Market runtime modification was performed.

## Governing Question

`What is happening in this city market, what evidence matters, and what should I investigate next?`

The future City Market experience should extend the certified Market Briefing Foundation into the city route family without changing the Market index, Neighborhood runtime, Search, maps, providers, APIs, persistence, telemetry, CRM, shared runtime components, shared CSS, routes, canonical URLs, or deployment configuration.

## Current-State Inventory

Inspected runtime target:

- `app/market/[city]/page.tsx`

Inspection-only related files:

- `app/market/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `components/CityMarketStats.tsx`
- `components/MarketHomesLinks.tsx`
- `components/MarketNeighborhoodLinks.tsx`
- `components/MarketProduct3VisualIntelligence.tsx`
- `components/ContinueYourDecision.tsx`
- city and neighborhood data helpers used by the route

Current City Market route characteristics:

- route and canonical handling are already established;
- city data, neighborhood paths, Product 3 visual intelligence, Search continuation, Seller continuation, and Advisory paths are present;
- the first viewport still reads more like a market intelligence report or decision guide than a concise customer briefing;
- dense statistics, decision-guide modules, and evidence transparency can appear before the customer has a simple city market question;
- neighborhood pathways are present but should be sequenced as investigation paths rather than rankings;
- fair-housing, evidence, freshness, and professional-boundary language exists and should be placed closer to reliance points during implementation.

## Disposition Map

KEEP:

- canonical city Market route family;
- existing city data and market stats;
- Product 3 visual intelligence;
- Search continuation;
- Neighborhood continuation;
- Property exploration continuation;
- Seller continuation;
- Advisory continuation;
- decision-guide eligibility;
- public schema and FAQ behavior;
- fair-housing and protected-boundary markers.

SIMPLIFY:

- first viewport orientation;
- H1 and opening promise;
- dense introductory copy;
- repeated market-intelligence labels.

MERGE:

- overlapping market-signal and decision-guide framing;
- duplicate continuity language where one compact next-decision section can carry the path.

MOVE LOWER:

- dense statistics;
- secondary decision-guide modules;
- broad governance-feeling copy;
- source and evidence transparency details that interrupt the first viewport.

PROGRESSIVELY DISCLOSE:

- detailed evidence interpretation;
- source maturity and confidence language;
- secondary neighborhood lists where mobile density becomes high.

MOVE TO DESTINATION PAGE:

- property-specific review guidance that belongs on property pages;
- Neighborhood place-orientation details that belong on Neighborhood routes;
- seller-preparation details that belong on Seller.

REMOVE:

- unsupported certainty language;
- duplicate claims that do not improve the customer decision;
- any copy that implies one city, neighborhood, or housing pattern is personally suitable.

EXTERNAL REVIEW HOLD:

- brokerage disclosure language and treatment: `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Future Hierarchy

1. City market orientation
2. Governing customer question
3. Concise city briefing promise
4. Current city Market signals
5. Evidence that matters to the decision
6. Directional-versus-verified explanation
7. Neighborhood paths and conditions to investigate
8. Freshness, uncertainty, fair-housing, and professional boundaries
9. Dominant Search continuation
10. Compact Neighborhood, Property, Seller, and Advisory continuations

## Implementation Sequence

1. Re-verify baseline, deployment, route ownership, and certified Wave 1D records.
2. Inspect `app/market/[city]/page.tsx` and directly supporting City Market-specific helpers.
3. Confirm no shared runtime, Search, maps, providers, APIs, persistence, telemetry, CRM, route, canonical, or deployment change is required.
4. Simplify the first viewport around the governing City Market question.
5. Preserve one dominant `Search With Market Context` action.
6. Reorganize existing city signals by decision relevance without inventing new market evidence.
7. Move neighborhood paths into investigation context rather than ranking context.
8. Place directional-versus-verified, freshness, uncertainty, fair-housing, and professional-boundary language near reliance points.
9. Preserve Product 3, Search, Neighborhood, Property, Seller, and Advisory continuations.
10. Add City Market-specific deterministic validation.
11. Run responsive, accessibility, overflow, route, Search, Market index, Neighborhood, Buyer, Seller, property, and brokerage-disclosure regression checks.

## Proposed File Ownership

Primary future runtime file: `app/market/[city]/page.tsx`

Inspection-only unless separately authorized:

- `app/market/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- shared runtime components
- shared CSS
- Search
- maps
- APIs
- provider integrations
- route registries
- navigation
- footer

Shared runtime files require stop-and-report authorization before modification.

## Shared-File Risks

Potential shared-file risks:

- `components/MarketProduct3VisualIntelligence.tsx`
- `components/ContinueYourDecision.tsx`
- city and neighborhood data helpers
- shared CSS and route registries
- Search and map integrations

Safer implementation posture:

- prefer `app/market/[city]/page.tsx` only;
- use existing props, helpers, and components without changing shared behavior;
- stop before modifying shared runtime files.

## Protected Boundaries

The future implementation must not introduce:

- market-timing certainty;
- guaranteed appreciation;
- investment recommendation;
- buy-now or sell-now conclusion;
- suitability conclusion;
- neighborhood ranking;
- school-quality conclusion;
- safety conclusion;
- protected-class steering;
- demographic desirability claims;
- provider expansion;
- persistence;
- telemetry;
- CRM expansion;
- AI advisory;
- new maps;
- new GIS;
- new APIs.

## Deterministic Certification Criteria

The future City Market runtime check should verify:

- exactly one H1;
- governing City Market question present;
- first viewport reads as a city market briefing rather than a dashboard;
- one dominant Search action;
- current city Market signals present;
- evidence organized by decision relevance;
- directional-versus-verified language present;
- neighborhood paths framed as investigation paths, not rankings;
- freshness, uncertainty, fair-housing, and professional-boundary language near reliance points;
- Search, Neighborhood, Property, Seller, and Advisory continuations present;
- Product 3 visual intelligence preserved;
- no Market index, Neighborhood, Buyer, Seller, Search, map, provider, API, persistence, telemetry, CRM, route, canonical, navigation, footer, brokerage disclosure, or deployment change;
- no protected-class steering, city or neighborhood ranking, school-quality conclusion, safety conclusion, suitability conclusion, investment recommendation, predictive certainty, or personalized advice.

## Certification Gate

Recommended next gate:

`READY_FOR_REIE_DXT_WAVE_1D_CITY_MARKET_BRIEFING_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
