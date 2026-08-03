# REIE DXT Wave 1D Market Neighborhood Discovery Implementation Readiness

Program: REIE Decision Experience Transformation (DXT 1.0)

Phase: Wave 1D - Market and Neighborhood Discovery Foundation

Status: `DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_READY_FOR_CERTIFICATION`

Date: August 2, 2026

## 1. Readiness Decision

Wave 1D Market and Neighborhood Discovery is ready for documentation-foundation certification.

Runtime implementation remains unauthorized.

For deterministic validation continuity: runtime implementation remains unauthorized.

No Market runtime was modified.

No Neighborhood runtime was modified.

## 2. Market Inventory

Current Market runtime families inspected:

- `app/market/page.tsx`
- `app/market/[city]/page.tsx`
- `components/MarketProduct3VisualIntelligence.tsx`
- `components/MarketHomesLinks.tsx`
- `components/MarketNeighborhoodLinks.tsx`
- `components/CityMarketStats.tsx`
- `components/MarketStats.tsx`
- `components/MarketPriceChart.tsx`
- `components/MarketChart.tsx`
- `lib/marketDecisionWorkspace.ts`
- `lib/marketIntelligenceExperience.ts`
- `lib/marketProduct3.ts`
- `lib/marketData.ts`

Observed current hierarchy:

- Market index begins with a decision workspace and continues into visual-intelligence synthesis, city market paths, certified guide links, Search, Seller, financing, and trust boundaries.
- City market pages combine city identity, decision guide content, market stats, visual intelligence, neighborhood links, Search, Seller, financing, FAQ/schema, and trust boundaries.

Current risks for future implementation:

- market pages can feel like dense evidence reports before the customer understands the decision question;
- several continuation paths can compete in the same viewport;
- visual-intelligence and stats sections need clearer separation between directional context and verified evidence.

## 3. Neighborhood Inventory

Current Neighborhood runtime families inspected:

- `app/market/[city]/[slug]/page.tsx`
- `components/NeighborhoodProduct3Experience.tsx`
- `components/NeighborhoodMarketStats.tsx`
- `components/NeighborhoodStats.tsx`
- `components/NeighborhoodLinks.tsx`
- `components/MarketNeighborhoodLinks.tsx`
- `components/NearbyNeighborhoods.tsx`
- `components/NeighborhoodArticles.tsx`
- `components/NeighborhoodMarketLink.tsx`
- `components/NeighborhoodOverlayMap.tsx`
- `lib/neighborhoods.ts`
- `lib/neighborhoodProduct3.ts`
- `lib/neighborhoodPolygons.ts`
- `lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.ts`

Observed current hierarchy:

- Neighborhood pages establish route identity and canonical metadata, then combine inventory lookup, market decision workspace, local context, nearby neighborhoods, product intelligence, Search, city market continuity, FAQ/schema, and verification boundaries.

Current risks for future implementation:

- place orientation can compete with market evidence and inventory evidence;
- customers may see evidence density before understanding what kind of place is being described;
- fair-housing and suitability boundaries must remain prominent when discussing place context.

## 4. Implementation Sequence

Future separately authorized sequence:

1. Market index simplification
2. City market page simplification
3. Neighborhood page simplification
4. Market-to-Neighborhood transition review
5. Neighborhood-to-Search and Neighborhood-to-Property transition review
6. Visual-intelligence density review
7. Responsive and accessibility certification
8. Production certification

Each phase should be separately authorized and separately certified.

## 5. Future File Ownership

This section defines future file ownership for separately authorized Wave 1D runtime phases.

Market index phase:

- likely owner: `app/market/page.tsx`
- inspect only unless justified: Market Product 3, Market link components, shared CSS, Search, maps, provider helpers

City market phase:

- likely owner: `app/market/[city]/page.tsx`
- inspect only unless justified: city data, market intelligence helpers, decision-guide platform, shared components

Neighborhood phase:

- likely owner: `app/market/[city]/[slug]/page.tsx`
- inspect only unless justified: neighborhood data, overlay maps, product intelligence helpers, Typesense inventory helpers, shared components

Stop-and-report files:

- shared CSS;
- navigation;
- footer;
- route registries;
- Search APIs;
- map providers;
- Prisma;
- persistence;
- telemetry;
- CRM;
- provider integrations;
- deployment configuration.

## 6. Deterministic Certification Criteria

This section defines deterministic certification criteria for future Wave 1D review.

Future Wave 1D runtime checks should verify:

- governing question appears early for each surface;
- Market pages read as customer briefings;
- Neighborhood pages orient to place before dense evidence;
- Search, Property, Buyer, Seller, Market, Neighborhood, and Advisory continuations remain correct;
- evidence and freshness boundaries are adjacent to claims;
- fair-housing boundaries are present for neighborhood context;
- no protected-class steering, demographic suitability, best-neighborhood, safety, school-quality, investment, appreciation, or personalized suitability claims are introduced;
- no forecast, valuation, ranking, investment recommendation, predictive certainty, or provider activation appears;
- no route, navigation, footer, Search, map, Prisma, persistence, telemetry, CRM, provider, AI, deployment, or production-data changes occur without explicit authorization.

## 7. Final Readiness Status

Wave 1D foundation readiness:

`DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_READY_FOR_CERTIFICATION`

Recommended next gate:

`READY_FOR_REIE_DXT_WAVE_1D_MARKET_AND_NEIGHBORHOOD_DISCOVERY_FOUNDATION_CERTIFICATION`
