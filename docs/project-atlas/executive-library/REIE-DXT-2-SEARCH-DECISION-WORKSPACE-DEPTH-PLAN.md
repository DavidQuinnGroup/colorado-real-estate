# REIE DXT 2 Search Decision Workspace Depth Plan

Status: `DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLAN_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Selected secondary phase: `SEARCH_DECISION_WORKSPACE_DEPTH`

Runtime authorization: `false`

Push, deployment, and production certification authorization: `false`

## Governing Question

What evidence helps the customer compare active options, understand what is missing, and decide which property deserves a closer look?

## Current Search Findings

Search already owns active property inventory and exposes:

- visible Search criteria;
- filter controls and criteria chips;
- list and map context;
- degraded-provider/fallback posture;
- buyer confidence framework;
- property-card continuations;
- certified Search return URL behavior into Property;
- safe public runtime and Search API checks.

The remaining depth gap is not ranking or map behavior. The gap is customer-facing evidence organization: Search should more clearly separate active criteria, visible evidence, missing evidence, comparison basis, provider/fallback confidence, and the reason to open a property.

## Proposed Future Search Hierarchy

1. Search decision workspace orientation
2. Governing Search decision-readiness question
3. Active visible criteria
4. Inventory evidence available now
5. Evidence not available from Search
6. Provider or fallback confidence explanation
7. Comparison criteria the customer should use
8. Questions to ask before opening a property
9. Property-card next-step threshold
10. Search -> Property -> Search return continuity
11. Trust, fair-housing, financial, valuation, professional, provider, API, map, and data-source boundaries

## Evidence Treatment

Use only evidence already visible in Search:

- URL-visible criteria;
- filter state already shown to the customer;
- listing card facts;
- map/list presentation;
- degraded-provider/fallback status;
- existing Search return context;
- existing Property destination links.

Do not add provider activation, private customer evidence, hidden state, saved Search behavior, ranking systems, new map state, or new URL context categories.

## Protected Boundaries

Future implementation must not modify without separate authorization:

- Search API behavior;
- Search ranking;
- map rendering, map providers, map bounds, zoom, selected state, list scroll, preview state, or marker behavior;
- property routes or canonicals;
- provider activation;
- database, Prisma, schema, migrations, or persistence;
- localStorage, cookies, telemetry, analytics, hidden context, or customer profiles;
- CRM, email, scheduling, forms, inquiry behavior, or lead routing;
- navigation, footer, brokerage disclosure, or shared runtime abstractions.

## Candidate Runtime Ownership

Preferred future ownership:

- `components/search/SearchInterface.tsx`

Conditional future ownership, only if separately authorized:

- `components/PropertyCard.tsx` for property-card threshold copy;
- `components/search/SearchControls.tsx` for visible criteria presentation.

Inspection-only:

- `app/search/page.tsx`;
- Search API;
- map components;
- ranking/runtime adapters;
- Property route;
- shared CTA or continuity components.

## Implementation Sequence

1. Reverify the certified Property Decision Readiness Depth production state after that phase is pushed and certified.
2. Inspect current Search route and component ownership.
3. Confirm no ranking, map, API, provider, persistence, telemetry, or URL-context expansion is required.
4. Add a route-local Search decision-readiness layer using visible criteria and existing listing evidence only.
5. Preserve existing Search -> Property -> Search return behavior.
6. Add deterministic implementation validation.
7. Run Search, map, public-runtime, public-trust, Property, and regression validation.
8. Create one local implementation commit.
9. Stop before push, deployment, or production certification.

## Deterministic Certification Criteria

- Search governing question is present.
- Active visible criteria are clearly separated from inferred or unavailable evidence.
- Available inventory evidence and missing evidence are present.
- Provider/fallback confidence is understandable and non-alarming.
- Property-card next-step threshold is present without ranking or recommendations.
- Search -> Property -> Search return continuity remains intact.
- Direct `/search` entry remains independent.
- No Search API, ranking, map, provider, persistence, telemetry, hidden context, customer profile, or shared runtime abstraction is introduced.
- Fair-housing, financial, valuation, and professional boundaries are preserved.
- Brokerage disclosure remains unchanged.

## Accepted Limitations

- This plan does not authorize Search runtime implementation.
- The plan does not authorize map restoration, bounds restoration, list-scroll restoration, preview restoration, selected-card restoration, ranking, provider activation, Search API changes, persistence, telemetry, or hidden context.
- Property, Advisory, Contact, Buyer, Seller, Market, and Neighborhood runtime remain unchanged.

## Recommended Gate

`READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLAN_CERTIFICATION`
