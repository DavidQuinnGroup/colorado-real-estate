# REIE DXT Market -> City Market -> Neighborhood -> Property Continuity Plan

Status: `MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_PLAN_READY`

Planning date: 2026-08-03

Planning identifier:

`MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY`

## Objective

Assess the remaining Market, City Market, Neighborhood, and Property continuity gaps after Buyer/Seller continuity and prepare a bounded implementation plan without runtime changes.

No Market, City Market, Neighborhood, Search, Property, Advisory, Contact, provider, map, API, persistence, telemetry, navigation, footer, or brokerage-disclosure runtime implementation is authorized by this record.

## Route And CTA Inventory

Routes inspected:

- `/market`
- representative `/market/[city]`
- representative `/market/[city]/[slug]`
- representative Property route
- Search and Property continuations from the Market and Neighborhood surfaces

Current ownership model:

- Market index owns broad market briefing orientation and Search continuation.
- City Market owns city-level briefing, market signals, neighborhood investigation, Search continuation, Property continuation, Seller continuation where supported, and Advisory continuation.
- Neighborhood owns place orientation, city-market context, neighborhood-specific Search continuation, Property path continuation, and Advisory continuation.
- Property owns specific-property evaluation, Search return continuity, Market context, Property inquiry, Advisory preparation, and Contact general conversation continuation.

Material current continuations:

- `/market` -> City Market and Search.
- City Market -> Search, Neighborhood, Property, Seller, Advisory.
- Neighborhood -> Search This Neighborhood, City Market Context, Property path, Advisory.
- Property -> Search return, Market Context, Neighborhood Context, Ask About This Property, Advisory, Contact.

## Continuity Gap Assessment

The remaining gap is customer-orientation continuity rather than missing route access.

Observed risks:

- Market and City Market can send customers into Search or Neighborhood without always clarifying whether they are investigating evidence, place context, or live property options.
- Neighborhood can support both city context and property exploration, but future implementation should avoid making place orientation appear like a suitability or ranking workflow.
- Property already has Search return and professional handoff continuity; future Market/Neighborhood work should not rework the Property experience unless a route-local link clarification is explicitly authorized.
- Advisory links remain useful but should not become dominant before Search or place/property investigation when the customer still needs self-guided evidence.

No route is a hard dead end. The opportunity is to reduce loops and clarify destination intent.

## Destination Ownership Model

Destination ownership should remain:

- `Search`: current inventory and explicit customer-selected property criteria.
- `Market`: broad market briefing and city-selection orientation.
- `City Market`: city market evidence, current signals, and conditions to investigate.
- `Neighborhood`: place orientation and neutral geography/housing context.
- `Property`: specific property evaluation.
- `Advisory`: preparation for a focused professional conversation.
- `Contact`: beginning a general professional conversation.

## Recommended Bounded Implementation Phases

Phase 1: Market index -> City Market / Search orientation.

- File: `app/market/page.tsx`
- Clarify whether the customer should start with a city briefing or Search.
- Preserve Market Briefing Foundation and Search behavior.

Phase 2: City Market -> Neighborhood / Search / Property continuity.

- File: `app/market/[city]/page.tsx`
- Clarify the decision difference between investigating neighborhoods, searching current properties, and carrying market questions forward.
- Preserve City Market Briefing implementation.

Phase 3: Neighborhood -> Property / Search / City Market continuity.

- File: `app/market/[city]/[slug]/page.tsx`
- Clarify that Neighborhood is place orientation, Search is current property inventory, and Property is address-level evaluation.
- Preserve fair-housing and place-orientation boundaries.

Property route changes are not expected for the first implementation pass because Search return and Property professional handoff continuity are already certified.

## Primary File Ownership

Future likely runtime ownership:

- `app/market/page.tsx`
- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`

Inspection-only unless separately authorized:

- `app/properties/[id]/page.tsx`
- Search routes and components
- map components
- provider integrations
- APIs
- Advisory runtime
- Contact runtime
- navigation
- footer
- brokerage disclosure

## Shared-File Stop Conditions

Stop and report if future implementation appears to require:

- shared route state;
- shared CTA abstraction;
- Search runtime changes;
- Search API or ranking changes;
- map/provider changes;
- Property route changes beyond inspection;
- new URL context categories;
- hidden personalization;
- persistence;
- localStorage;
- cookies;
- telemetry;
- CRM;
- email;
- scheduling;
- navigation or footer changes;
- brokerage-disclosure changes.

## Protected Boundaries

Future implementation must preserve:

- no neighborhood rankings;
- no protected-class steering;
- no demographic suitability;
- no best-neighborhood claims;
- no safety guarantees;
- no school-quality conclusions;
- no investment guarantees;
- no appreciation predictions;
- no hidden personalization;
- no persistence;
- no telemetry;
- no shared route state;
- no provider or map changes.

Market and Neighborhood copy must keep geography neutral, keep directional signals distinct from verified evidence, and avoid suitability conclusions.

## Deterministic Certification Criteria

Future local certification must verify:

- Market, City Market, and Neighborhood route ownership remains distinct;
- Search remains the live inventory destination;
- Property remains the address-level evaluation destination;
- City Market and Neighborhood routes preserve canonicals and route paths;
- fair-housing and professional boundaries remain present;
- no protected-class, demographic, safety, school-quality, investment, appreciation, or suitability claims are introduced;
- no hidden state, persistence, telemetry, Search API, map, provider, navigation, footer, brokerage-disclosure, Advisory, Contact, or Property inquiry changes occur;
- direct entry remains understandable on each route;
- responsive and accessibility review passes.

## Production-Certification Criteria

Future production certification should inspect:

- `/market`
- representative `/market/[city]`
- representative `/market/[city]/[slug]`
- representative Property route reached from the continuity path
- `/search`
- `/contact`
- `/brokerage-disclosures`
- `/api/search?limit=1`

Certification must verify HTTP success, canonical preservation, one H1 per route, clear route-specific next-step intent, no document-level horizontal overflow, keyboard-focusable continuations, fair-housing preservation, and protected-system preservation.

## Final-Phase Recommendation

This is recommended as the final material cross-route continuity runtime phase after Buyer/Seller continuity, absent production defects or new business authorization.

Rationale:

- Search -> Property -> Search Return continuity is certified.
- Property -> Advisory -> Contact continuity is certified.
- Buyer/Seller -> Advisory -> Contact continuity is being implemented route-locally.
- Market -> City Market -> Neighborhood -> Property is the remaining broad decision-surface family with material cross-route continuity value.
- It should be implemented only after separate planning certification and bounded implementation authorization.

Recommended next gate:

`READY_FOR_REIE_DXT_MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_PLAN_CERTIFICATION`

## Accepted Limitations

This plan does not authorize runtime implementation, Market remediation, Neighborhood remediation, Search changes, Property changes, Advisory changes, Contact changes, hidden context, persistence, telemetry, provider activation, map changes, API changes, shared abstractions, navigation changes, footer changes, or brokerage-disclosure changes.
