# REIE DXT Decision-Context Continuity Contract

Status: `DXT_DECISION_CONTEXT_CONTINUITY_CONTRACT_READY`

Contract date: 2026-08-03

## Purpose

This contract governs safe, visible, non-persistent decision context between certified REIE routes.

The program question is:

> Does every certified route clearly help the customer understand what to do next, why that next step matters, and where it leads?

No runtime change, URL-context implementation, route change, canonical change, hidden state, persistence, localStorage, cookies, telemetry, analytics expansion, customer profile, CRM, email, scheduling, form, API, map, provider, navigation, footer, brokerage-disclosure change, shared component, or shared runtime abstraction is authorized by this contract.

## Context Category Classification

| Category | Classification | Rationale |
| --- | --- | --- |
| originating route | SAFE_VISIBLE_CONTEXT | Can orient the customer when visible and non-sensitive. |
| visible source label | SAFE_VISIBLE_CONTEXT | Human-readable source labels such as `Opened from Search` are safe when truthful. |
| city | SAFE_VISIBLE_CONTEXT | City is public route/search context and already appears in URLs. |
| neighborhood slug | SAFE_VISIBLE_CONTEXT | Neighborhood route/search context is public and non-sensitive when neutral. |
| property slug | SAFE_VISIBLE_CONTEXT | Public property route context is acceptable when it does not imply saved history. |
| customer-selected Search criteria already present in the URL | SAFE_ONLY_IF_ALREADY_IN_URL | Criteria can be carried only when explicit in the URL and validated against an allowlist. |
| Buyer intent | SAFE_VISIBLE_CONTEXT | Static visible route intent is acceptable; no inferred readiness profile. |
| Seller intent | SAFE_VISIBLE_CONTEXT | Static visible route intent is acceptable; no valuation or seller lead scoring. |
| Property intent | SAFE_VISIBLE_CONTEXT | Public property-specific question context is acceptable when separated from inquiry submission. |
| Market intent | SAFE_VISIBLE_CONTEXT | Public market context is acceptable when directional and non-predictive. |
| Neighborhood intent | SAFE_VISIBLE_CONTEXT | Public place context is acceptable when neutral and non-ranking. |
| Advisory intent | SAFE_VISIBLE_CONTEXT | Advisory prepares the conversation and can be visibly named. |
| return destination | SAFE_ONLY_IF_ALREADY_IN_URL | Return paths must be allowlisted, same-origin relative paths and removable. |
| visible CTA origin | SAFE_VISIBLE_CONTEXT | Useful for explaining why the destination appeared. |
| explicitly selected preparation topic | REQUIRES_SEPARATE_AUTHORIZATION | Safe only if future UI explicitly collects it without persistence or hidden transfer. |
| saved searches | PROHIBITED_AUTOMATIC_TRANSFER | Saved-search state can expose private intent and must not move automatically. |
| planner inputs | PROHIBITED_AUTOMATIC_TRANSFER | Buyer/seller planner assumptions must not transfer without separate authorization. |
| browsing history | PROHIBITED_AUTOMATIC_TRANSFER | Hidden history is tracking and profiling. |
| inferred preferences | PROHIBITED_AUTOMATIC_TRANSFER | Inference creates suitability and fair-housing risk. |

## Prohibited Automatic Transfer

Future continuity work must not automatically transfer:

- identity;
- email;
- phone;
- private notes;
- financial assumptions;
- affordability inputs;
- lender information;
- saved searches;
- planner inputs;
- browsing history;
- property-view history;
- inferred preferences;
- suitability assessments;
- protected characteristics;
- demographic information;
- hidden scores;
- lead status;
- CRM status;
- consent state beyond existing authorized behavior;
- confidential information;
- cookies or localStorage decision history;
- telemetry-derived context.

## Direct-Entry Requirements

Every destination must remain understandable when:

- there is no prior context;
- visible context is malformed or unsupported;
- property, city, or neighborhood context is stale;
- the page is refreshed;
- a URL is copied or shared;
- the customer uses browser Back or Forward;
- the customer arrives from an external referral;
- context is removed;
- canonical metadata remains independent of context;
- Search URLs already carry explicit criteria.

Context may enhance orientation. It must never become required for route functionality.

## URL And Canonical Requirements

- Canonical URLs must not include transient continuity context.
- Visible context may use query parameters only after a bounded implementation authorization.
- Allowed URL context must be same-origin, route-owned, human-readable, length-limited, and allowlisted.
- Unsupported parameters must be ignored safely.
- Search criteria may be preserved only when already present in the Search URL and validated by the existing Search return contract.
- Context cannot include hidden customer data, CRM state, consent state, telemetry, or inferred preferences.

## Browser Navigation Requirements

- Browser-native Back and Forward behavior must remain intact.
- Future return links may complement browser Back; they must not replace it with a custom journey system.
- Refresh must not create state loss that breaks the destination.
- Shared or copied URLs must remain safe and understandable.

## Visible-Context Presentation Options

Future authorized context may appear as:

- an orientation line;
- a return link;
- a compact context banner;
- a CTA label;
- a breadcrumb-like line when route-owned;
- not shown, when context would add risk or noise.

Context must be visible, human-readable, removable or ignorable where appropriate, non-sensitive, bounded, truthful, non-persistent by default, unrelated to protected characteristics, incapable of producing suitability conclusions, clearly separated from verified evidence, and safe when copied or shared.

No shared runtime component is authorized by this record.

## Return-Path Architecture

Use route-owned return paths:

- Return to Search: property pages when a safe Search URL is already present, otherwise generic `/search` plus browser Back guidance.
- Return to Property: Advisory or Contact only if future explicit visible property context is separately authorized; never hidden.
- Return to Market: City Market and Neighborhood pages may point to route-owned market context.
- Return to Neighborhood: City Market and property pages may point to public neighborhood context when route data supports it.
- Return to Buyer preparation: Contact or Advisory may provide static route choices.
- Return to Seller preparation: Contact or Advisory may provide static route choices.
- Continue to Advisory: use `/contact#advisory-readiness` where preparation is the intent.
- Continue to Contact: use `/contact` or the existing specialized route when beginning the conversation is the intent.
- Start without prior context: every destination must expose a complete direct-entry path.

## Privacy, Fair-Housing, And Trust Boundaries

Continuity must prohibit:

- protected-class steering;
- demographic suitability;
- neighborhood fit conclusions;
- behavioral profiling;
- hidden personalization;
- lead scoring;
- urgency manipulation;
- response-time guarantees;
- representation claims;
- legal, tax, lending, appraisal, valuation, investment, or suitability conclusions;
- AI-generated professional conclusions;
- automatic CRM enrichment;
- undisclosed data transfer.

Brokerage disclosure remains under:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

Future continuity work must not change brokerage disclosure wording, position, styling, or prominence.

## Contract Conclusion

Decision continuity should be implemented route by route, with visible context only where the source route already makes that context explicit. The existing Search return helper is the safest first foundation because it is already allowlisted, direct-entry compatible, non-persistent, and scoped to public Search criteria.
