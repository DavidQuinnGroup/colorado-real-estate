# REIE DXT 2 Search Decision Workspace Depth Implementation

Status: `DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Executive recommendation: `READY_FOR_SEARCH_WORKSPACE_LOCAL_CERTIFICATION`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Implementation scope: `components/search/SearchInterface.tsx`

Runtime authorization: `SEARCH_DECISION_WORKSPACE_DEPTH_ONLY`

Push, deployment, and production certification authorization: `false`

## Governing Question

Do these results give me enough reliable context to decide what to inspect, compare, refine, or open next?

## Implementation Summary

Search now includes a bounded route-local `Search Decision Readiness` layer inside the existing Search workspace. The layer organizes visible criteria, available inventory evidence, unavailable evidence, qualitative confidence, degraded-provider posture, comparison readiness, refinement threshold, and Property-opening threshold without changing Search behavior.

The implementation uses only evidence already present in the Search experience:

- current visible Search criteria and active chips;
- visible public result count;
- existing list and map context;
- existing listing-card facts;
- existing degraded-provider and fallback posture;
- existing Search -> Property -> Search return continuity.

## Implemented Hierarchy

1. Search decision workspace orientation
2. Governing Search decision-readiness question
3. Active visible criteria
4. Inventory evidence available now
5. Evidence not available from Search
6. Provider or fallback confidence explanation
7. Comparison criteria the customer should use
8. Refinement threshold
9. Property-opening threshold
10. Search -> Property -> Search return continuity preservation
11. Trust, fair-housing, financial, valuation, professional, provider, API, map, persistence, telemetry, and AI boundaries

## Evidence Treatment

Evidence available now is limited to Search-visible facts. The implementation does not add data sources, provider activation, hidden customer context, inferred preferences, saved searches, scores, rankings, recommendations, or map state restoration.

Evidence not available from Search is explicitly named:

- condition;
- inspection findings;
- records;
- disclosures;
- HOA details;
- insurance;
- taxes;
- total ownership costs;
- affordability;
- financing readiness;
- suitability;
- appreciation;
- safety;
- school quality;
- investment fit.

## Confidence Treatment

Confidence is expressed qualitatively as a Search evidence boundary:

- `Useful for broad orientation`;
- `Useful for focused comparison`;
- `Useful with fallback limits`;
- `Insufficient for comparison`;
- `Updating`.

Confidence is not a score, ranking, recommendation, valuation opinion, financing conclusion, suitability conclusion, or professional advice.

## Degraded-Provider Treatment

The implementation preserves the existing degraded-provider posture. When Search is degraded, the readiness layer labels the evidence posture as fallback-limited and keeps the existing degraded status panel intact. It does not change provider behavior, activate a provider, change Search API behavior, or alter ranking or map behavior.

## Comparison And Threshold Treatment

Search clarifies three customer actions:

- compare visible facts and map context without treating order or prominence as ranking;
- refine when results are too broad, too narrow, or missing criteria the customer can clearly name;
- open a Property view when a result still fits visible criteria and the customer can name what remains to verify.

Property cards, Search controls, Search API, Search return context, map behavior, and Property runtime remain unchanged.

## Protected Boundaries

The implementation explicitly preserves:

- no Search API change;
- no Search ranking change;
- no map rendering, provider, bounds, zoom, selected state, list scroll, preview, or marker behavior change;
- no PropertyCard runtime change;
- no SearchControls runtime change;
- no Property route change;
- no provider activation;
- no URL-state expansion;
- no hidden context;
- no persistence, localStorage, cookies, telemetry, analytics, CRM, email, scheduling, customer profile, saved search, or form behavior;
- no AI advice;
- no scoring, ranking, recommendation, suitability conclusion, valuation certainty, appreciation prediction, pricing opinion, legal advice, tax advice, lending approval, affordability conclusion, protected-class steering, school-quality conclusion, safety conclusion, or investment advice;
- brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Runtime Scope Certification

Authorized runtime file changed:

- `components/search/SearchInterface.tsx`

Protected runtime unchanged:

- `components/PropertyCard.tsx`;
- `components/search/SearchControls.tsx`;
- `app/search/page.tsx`;
- Search API;
- maps and map providers;
- Property route;
- Buyer;
- Seller;
- Market;
- City Market;
- Neighborhood;
- Advisory;
- Contact;
- shared runtime;
- navigation;
- footer;
- brokerage disclosure.

## Local Certification Criteria

- `data-testid="dxt-2-search-decision-workspace-depth"` is present.
- The governing Search decision-readiness question is present.
- Visible criteria, available evidence, unavailable evidence, qualitative confidence, degraded-provider posture, comparison readiness, refinement threshold, and Property-opening threshold are present.
- Search -> Property -> Search return continuity remains intact.
- Direct `/search` entry remains independent.
- No Search API, ranking, map, provider, URL-state, persistence, telemetry, hidden context, customer profile, AI, score, ranking, recommendation, or shared runtime abstraction is introduced.
- Documentation and `docs/CHAT_START.md` identify the next local-certification and next-phase planning gates.

## Status

`DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`
