# REIE DXT Wave 1D Neighborhood Place-Orientation Implementation Plan

Status: `DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_READY`

Neighborhood runtime remains unauthorized.

No Neighborhood runtime modification is authorized.

No shared Market/Neighborhood runtime abstraction is authorized.

Market runtime implementation remains separate from Neighborhood implementation.

## Governing Question

`What kind of place is this, how is it organized, and what should I verify next?`

The future Neighborhood experience must orient the customer to place before dense evidence. It should help the customer understand geography, housing context, evidence, limitations, verification questions, and the correct continuation into properties, Market context, or Advisory review.

## Current-State Inventory

Inspected runtime family:

- `app/market/[city]/[slug]/page.tsx`
- `app/market/[city]/page.tsx`
- `app/market/page.tsx`
- `components/MarketProduct3VisualIntelligence.tsx`
- `components/ContinueYourDecision.tsx`
- neighborhood data and Product 3 helper usage through existing imports

Current Neighborhood route characteristics:

- page orientation is present but evidence and available inventory can arrive before the customer fully understands the place;
- the route already preserves city, neighborhood, Search, Property, Market, and Advisory continuations;
- Product 3 visual intelligence and market decision workspace patterns are available;
- housing and inventory evidence exists but needs a clearer place-first order;
- limitation and verification language exists but should sit closer to reliance points;
- mobile density risk is highest where market evidence, property inventory, and route continuations cluster.

## Disposition Map

KEEP:

- canonical route family;
- current data sources;
- Search continuation;
- Property exploration continuation;
- Market continuation;
- Advisory continuation;
- Product 3 visual intelligence;
- professional verification boundaries;
- freshness and limitation language.

SIMPLIFY:

- first viewport orientation;
- page headline rhythm;
- dense introductory explanation;
- repeated evidence labels.

MERGE:

- overlapping market-context and place-context copy;
- duplicated continuation language where one compact next-decision section can carry the path.

MOVE LOWER:

- dense inventory interpretation;
- secondary market evidence;
- internal readiness or governance-feeling copy.

PROGRESSIVELY DISCLOSE:

- detailed evidence interpretation;
- source/freshness detail where the first viewport would become dense;
- secondary route context.

MOVE TO DESTINATION PAGE:

- property-specific review guidance that belongs on property pages;
- broad city comparison that belongs on Market pages;
- advisory intake details that belong on Contact or advisory surfaces.

REMOVE:

- unsupported superiority language;
- duplicate claims that do not improve the decision;
- any copy that implies a place is personally suitable.

EXTERNAL REVIEW HOLD:

- brokerage disclosure language and treatment: `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Future Hierarchy

1. Place orientation
2. Governing customer question
3. Concise description of the area
4. Geographic organization and boundaries
5. Housing context
6. Evidence that matters
7. Questions to verify personally or professionally
8. Fair-housing, freshness, uncertainty, and limitation boundaries
9. Property exploration continuation
10. Market and Advisory continuations

## Place-Orientation Requirements

The first viewport should establish what kind of place the customer is reviewing without implying personal fit. It should state the neighborhood name, city relationship, broad geographic orientation, and why the page exists before introducing dense evidence.

The page should not describe a neighborhood as best, ideal, safest, family-oriented, exclusive, or suitable for any protected or personal circumstance.

## Geography Requirements

The future implementation should explain geographic organization using neutral, factual language:

- city relationship;
- neighborhood route context;
- nearby property exploration path;
- map or boundary context only if already available and authorized;
- what the customer should verify physically or professionally before relying on geographic assumptions.

No new maps, map providers, GIS providers, or provider feeds are authorized by this plan.

## Housing-Context Requirements

Housing context should be presented as available context, not as suitability guidance. Future copy should distinguish:

- observed or existing housing context;
- active property inventory;
- facts that need property-level verification;
- facts that require professional review.

## Evidence And Limitation Requirements

Evidence must be grouped by customer decision relevance:

- place context;
- housing context;
- property exploration;
- market context;
- verification questions;
- freshness and limitation boundaries.

Freshness, uncertainty, and limitation language must appear near the points where customers are asked to rely on context.

## Fair-Housing Boundaries

The future implementation must prohibit:

- protected-class steering;
- demographic suitability conclusions;
- best-neighborhood claims;
- family-status assumptions;
- safety guarantees;
- crime-risk conclusions;
- school-quality rankings or conclusions;
- investment guarantees;
- predictive appreciation claims;
- personalized suitability rankings;
- lifestyle matching conclusions based on protected characteristics;
- hidden ranking systems;
- provider expansion;
- persistence;
- telemetry;
- CRM expansion;
- AI advisory.

## Implementation Sequence

1. Re-verify baseline, deployment, route ownership, and certified Wave 1D contract.
2. Inspect `app/market/[city]/[slug]/page.tsx` and directly supporting Neighborhood-specific helpers.
3. Confirm no shared runtime or route-family change is required.
4. Simplify first viewport around the governing question.
5. Move place orientation before dense evidence.
6. Group housing context and evidence by decision relevance.
7. Place fair-housing, freshness, uncertainty, and professional boundaries near reliance points.
8. Preserve Search, Property, Market, and Advisory continuations.
9. Add Neighborhood-specific deterministic validation.
10. Run responsive, accessibility, overflow, route, Search, Market, Buyer, Seller, property, and brokerage-disclosure regression checks.

## Proposed File Ownership

Primary future runtime file: `app/market/[city]/[slug]/page.tsx`

Inspection-only unless separately authorized:

- `app/market/[city]/page.tsx`
- `app/market/page.tsx`
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

## Deterministic Certification Criteria

The future Neighborhood runtime check should verify:

- one H1;
- governing question present;
- place orientation before dense evidence;
- geographic organization and boundaries present;
- housing context present without suitability conclusions;
- evidence grouped by customer decision relevance;
- questions to verify personally or professionally present;
- fair-housing, freshness, uncertainty, and limitation boundaries present near reliance points;
- Property, Market, Search, and Advisory continuations present;
- no protected-class steering, demographic suitability, best-neighborhood, safety, school-quality, investment, appreciation, or personalized ranking claims;
- no provider, API, Search, map, persistence, telemetry, CRM, AI advisory, route, canonical, navigation, footer, or deployment change;
- brokerage disclosure unchanged.

## Certification Gate

Recommended secondary gate:

`READY_FOR_REIE_DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_FOUNDATION_CERTIFICATION`

Neighborhood runtime implementation remains unauthorized until separately approved.
