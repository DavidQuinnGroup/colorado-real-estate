# REIE DXT Search -> Property -> Search Return Continuity Implementation

Status: `DXT_SEARCH_PROPERTY_RETURN_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Implementation date: 2026-08-03

Planning baseline: `9fa4015653b9912ae3736f15d3918e0f178c1629`

## Objective

This implementation improves the visible return path from a Property page back to Search when the Property page is opened with already-authorized Search return context.

It answers:

> When I open a property from Search, can I clearly return to the same visible Search decision context without creating hidden state?

## Authorized Runtime Scope

Runtime file changed:

- `app/properties/[id]/page.tsx`

Runtime files not changed:

- Search runtime
- Search APIs
- Search ranking
- maps and map providers
- `PropertyInquiryForm`
- Property inquiry APIs
- Advisory runtime
- Contact runtime
- Buyer runtime
- Seller runtime
- Market runtime
- Neighborhood runtime
- navigation
- footer
- brokerage disclosure

## Existing Safe Context Contract

The implementation uses the existing `lib/search/searchReturnContext.ts` contract without expanding it.

Already supported context:

- `from=search`
- `returnTo`
- `selected`
- `view`
- visible Search criteria already allowlisted in the Search URL:
  - `q`
  - `city`
  - `minPrice`
  - `maxPrice`
  - `beds`
  - `baths`
  - `propertyType`

The return path remains restricted to internal `/search` URLs. External URLs, protocol URLs, unsupported query keys, malformed selected-property values, unsupported view hints, and unsafe values are rejected before the Property page renders contextual return UI.

## Implementation Summary

The Property page now:

- derives a human-readable return presentation only after `parsePropertySearchReturnContext` accepts the incoming URL;
- shows a visible orientation line such as `Opened from [City] Search` when the safe return URL includes a city criterion;
- uses a normal link back to the sanitized Search URL;
- aligns route-local Search continuations with the same validated return target when context exists;
- preserves the normal city Search fallback when no valid context exists;
- avoids displaying raw query strings;
- avoids new query parameters;
- avoids hidden state, persistence, cookies, localStorage, telemetry, analytics, CRM, email, scheduling, or API behavior.

## Direct Entry And Malformed Context

Direct Property entry remains independent:

- direct Property entry remains independent;
- the Property page renders normally;
- no Search-origin UI is fabricated;
- a local Search fallback remains available;
- the canonical URL remains clean.

Malformed, external, unsupported, or unsafe return context is ignored:

- no unsafe destination is rendered;
- no redirect occurs;
- no validation details are exposed to the customer;
- the page falls back to the normal Search destination.

## Canonical And Browser Behavior

Canonical metadata remains the clean Property URL.

Transient Search return context does not alter canonical tags, route paths, or Property route identity.

The return link complements browser Back and Forward behavior. It does not intercept browser history and does not restore map bounds, zoom, list scroll, selected cards, or previews.

## Protected Boundary Findings

No protected system was modified.

The implementation does not introduce:

- new Search behavior;
- new URL context categories;
- map state restoration;
- persistence;
- telemetry;
- analytics;
- customer profiles;
- hidden context transfer;
- Property inquiry changes;
- Advisory or Contact runtime changes;
- shared CTA or continuity abstractions;
- navigation or footer changes.

Brokerage disclosure remains under `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Local Certification Criteria

Local certification must verify:

- direct Property URL renders with one H1 and no fabricated Search origin;
- valid Search return context renders a visible return action;
- malformed or external return context is rejected;
- no raw URL is displayed as customer copy;
- canonical metadata remains clean;
- browser Back remains native;
- the return link is keyboard focusable with visible focus styling;
- mobile, tablet, and desktop layouts have no document-level horizontal overflow;
- Search, Property inquiry, Advisory, Contact, Buyer, Seller, Market, Neighborhood, maps, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure remain unchanged.

## Implementation Result

Certification recommendation:

`READY_FOR_SEARCH_PROPERTY_RETURN_CONTINUITY_LOCAL_CERTIFICATION`
