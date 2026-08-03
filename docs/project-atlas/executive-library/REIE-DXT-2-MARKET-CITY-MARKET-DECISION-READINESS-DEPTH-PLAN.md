# REIE DXT 2 Market And City Market Decision Readiness Depth Plan

Status: `DXT_2_MARKET_CITY_MARKET_DECISION_READINESS_DEPTH_PLAN_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Selected next bounded phase: `MARKET_CITY_MARKET_DECISION_READINESS_DEPTH`

Runtime authorization: `false`

Push, deployment, and production certification authorization: `false`

## Planning Objective

Prepare the next DXT 2 phase after Property and Search readiness depth by deepening Market and City Market decision readiness without changing providers, maps, Search, Property, APIs, persistence, telemetry, or shared runtime abstractions.

## Candidate Inventory

| Candidate | Customer value | Implementation scope | Runtime ownership | Shared-file risk | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Market and City Market Decision Readiness Depth | High. Customers need to decide whether a market view is specific enough to refine Search, inspect a city, compare neighborhoods, or open Property. | Route-local presentation in Market and City Market surfaces. | `app/market/page.tsx` and `app/market/[city]/page.tsx` in separately bounded phases. | Moderate because two route owners participate; no shared abstraction should be authorized first. | Selected next phase. |
| Buyer/Seller Readiness Depth Extension | Medium. Buyer and Seller already have continuity and preparation hierarchy. | Route-local copy depth. | `app/buy/page.tsx`, `app/sell/page.tsx`. | Low. | Defer until Market/Search readiness is certified. |
| Contact/Advisory Readiness Depth Extension | Medium-low. Wave 1E already clarified the handoff. | Route-local presentation. | `components/AdvisoryHandoffGuide.tsx`, `app/contact/page.tsx`. | Low. | Defer absent production evidence of confusion. |
| Neighborhood Decision Readiness Depth | Medium-high but should follow Market and City Market depth so place orientation remains downstream of market evidence. | Route-local presentation. | `app/market/[city]/[slug]/page.tsx`. | Low. | Plan as a follow-on only after Market and City Market readiness are certified. |

## Selected Next Phase

`MARKET_CITY_MARKET_DECISION_READINESS_DEPTH`

The phase is selected because Market and City Market are the remaining major decision-readiness surfaces where customers compare broad market evidence before moving into Search, Neighborhood, or Property. The work should deepen customer understanding of evidence, missing evidence, uncertainty, and investigation thresholds without ranking places or predicting outcomes.

## Proposed Future Hierarchy

1. Market or City Market decision orientation
2. Governing decision-readiness question
3. Current market evidence available now
4. Evidence not available from the route
5. Directional versus verified treatment
6. Qualitative confidence boundaries
7. Conditions that justify moving to Search
8. Conditions that justify inspecting neighborhoods
9. Conditions that justify opening Property
10. Professional, fair-housing, valuation, financial, provider, map, API, persistence, telemetry, and AI boundaries

## Runtime Ownership

Primary future ownership:

- `app/market/page.tsx`
- `app/market/[city]/page.tsx`

Potential follow-on ownership, not authorized in the first phase:

- `app/market/[city]/[slug]/page.tsx`

Inspection-only:

- Search runtime;
- Property runtime;
- maps and providers;
- Market data sources;
- APIs;
- shared CTA components;
- navigation;
- footer;
- brokerage disclosure.

## Implementation Sequence

1. Certify Search Decision Workspace Depth locally and in production.
2. Reconfirm Market and City Market route ownership and current certified continuity.
3. Implement Market readiness depth route-locally.
4. Implement City Market readiness depth route-locally only if it remains within the same bounded authorization.
5. Preserve Search, Neighborhood, and Property continuations without hidden context.
6. Add deterministic implementation validation.
7. Run Market, City Market, Search, map, public runtime, public trust, Property, Neighborhood, and regression validation.
8. Create one local implementation commit.
9. Stop before push, deployment, or production certification.

## Deterministic Certification Criteria

- Market and City Market governing questions are present.
- Available evidence and unavailable evidence are separated.
- Directional versus verified treatment is clear.
- Qualitative confidence is present and is not a score.
- Search, Neighborhood, and Property next-step thresholds are present.
- No neighborhood ranking, best-neighborhood claim, safety conclusion, school-quality conclusion, protected-class steering, investment guarantee, appreciation prediction, pricing certainty, suitability conclusion, provider activation, AI advice, persistence, telemetry, hidden context, Search API change, map/provider change, or shared runtime abstraction is introduced.
- Direct route entry and canonical behavior remain preserved.
- Brokerage disclosure remains unchanged.

## Accepted Limitations

- This plan does not authorize Market or City Market runtime implementation.
- The plan does not authorize Neighborhood runtime implementation.
- The plan does not authorize providers, maps, Search APIs, Property routes, persistence, telemetry, hidden context, scoring, ranking, AI advice, or shared runtime abstractions.
- It authorizes no shared runtime abstraction.

## Recommended Gate

`READY_FOR_REIE_DXT_2_MARKET_CITY_MARKET_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
