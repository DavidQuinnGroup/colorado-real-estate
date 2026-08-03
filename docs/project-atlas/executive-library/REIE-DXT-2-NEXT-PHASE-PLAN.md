# REIE DXT 2 Next Phase Plan

Status: `DXT_2_NEXT_PHASE_PLAN_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Selected next bounded phase: `NEIGHBORHOOD_DECISION_READINESS_DEPTH`

Runtime authorization: `false`

Push, deployment, and production certification authorization: `false`

## Planning Objective

Evaluate remaining DXT 2 decision-readiness opportunities after Property, Search, Market, and City Market depth, and select the next bounded phase without authorizing runtime changes.

## Candidate Comparison

| Candidate | Customer value | Implementation scope | Runtime ownership | Shared-file risk | Protected-system risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Neighborhood Decision Readiness Depth | High. Neighborhood is the next place where customers need to separate place orientation from property evidence and fair-housing-sensitive assumptions. | Route-local presentation. | `app/market/[city]/[slug]/page.tsx` | Low if route-local. | High fair-housing and suitability risk, manageable through explicit boundaries. | Selected. |
| Buyer Decision Readiness Depth | Medium-high. Buyer already has preparation, financing, Search, Advisory, and Contact continuity. | Route-local presentation. | `app/buy/page.tsx` | Low. | High if it drifts into affordability, qualification, lending, or buying-power conclusions. | Defer. |
| Seller Decision Readiness Depth | Medium-high. Seller already has preparation, valuation-safety, review, Advisory, and Contact continuity. | Route-local presentation. | `app/sell/page.tsx` | Low. | High if it drifts into valuation certainty, appraisal equivalence, or pricing guarantees. | Defer. |

## Selected Next Phase

`NEIGHBORHOOD_DECISION_READINESS_DEPTH`

Neighborhood Decision Readiness Depth is selected because Neighborhood is now the remaining route family most directly downstream of certified Market and City Market readiness. It should help the customer decide whether place context is sufficient to return to Search, inspect Property, or prepare Advisory questions without implying neighborhood ranking or suitability.

## Proposed Future Runtime Ownership

Primary future runtime file:

- `app/market/[city]/[slug]/page.tsx`

Inspection-only zones:

- `app/market/page.tsx`;
- `app/market/[city]/page.tsx`;
- Search runtime and Search API;
- Property runtime;
- maps and providers;
- Buyer and Seller runtime;
- Advisory and Contact runtime;
- shared runtime;
- navigation;
- footer;
- brokerage disclosure.

## Proposed Implementation Sequence

1. Certify Market and City Market Decision Readiness Depth locally and in production.
2. Reconfirm representative Neighborhood route ownership and certified continuity.
3. Implement a route-local Neighborhood Decision Readiness layer using existing place-orientation evidence only.
4. Separate available place evidence, unavailable property evidence, assumptions, confidence, freshness, and verification.
5. Preserve Search and Property continuations without hidden context.
6. Add deterministic implementation validation.
7. Run Neighborhood, Market, City Market, Search, Property, map, public runtime, public trust, responsive, accessibility, and regression validation.
8. Create one local implementation commit and stop before push.

## Deterministic Certification Criteria

- Neighborhood governing question remains present.
- Available place evidence and unavailable property evidence are separated.
- Confidence remains qualitative and is not a score.
- Freshness and verification boundaries are adjacent to reliance points.
- Search and Property thresholds are present.
- Direct route entry and canonical behavior are preserved.
- No neighborhood ranking is introduced.
- No protected-class steering is introduced.
- No demographic desirability, family-status assumption, safety conclusion, school-quality conclusion, suitability conclusion, investment conclusion, appreciation prediction, valuation certainty, provider activation, AI advice, hidden context, persistence, telemetry, Search API change, map/provider change, or shared runtime abstraction is introduced.
- Brokerage disclosure remains unchanged.

## Buyer And Seller Deferral Criteria

Buyer Decision Readiness Depth remains deferred because future implementation must preserve:

- No affordability or qualification conclusion;
- no buying-power conclusion;
- no lender ranking;
- no credit analysis;
- no personalized financial advice;
- no hidden Buyer context.

Seller Decision Readiness Depth remains deferred because future implementation must preserve:

- No valuation certainty;
- no appraisal equivalence;
- no guaranteed pricing;
- no predictive pricing conclusion;
- no investment advice;
- no hidden Seller context.

## Recommended Gate

`READY_FOR_REIE_DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
