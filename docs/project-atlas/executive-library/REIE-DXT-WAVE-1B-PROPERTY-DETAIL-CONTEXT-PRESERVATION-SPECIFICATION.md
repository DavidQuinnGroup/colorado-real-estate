# REIE DXT Wave 1B Property Detail Context Preservation Specification

Date: August 2, 2026

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Property Detail Context Preservation Product Specification
Status: `REIE_DXT_WAVE_1B_PROPERTY_DETAIL_CONTEXT_PRESERVATION_SPECIFICATION_READY`

## 1. Executive Product Decision

Selected context-preservation model:

`HYBRID_URL_AND_HISTORY_STATE`

Selected first bounded implementation phase:

`SEARCH_RETURN_URL_AND_CONTEXT_HANDOFF`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_RETURN_URL_AND_CONTEXT_HANDOFF_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

This specification authorizes no implementation. It defines the bounded model for preserving enough customer Search context across:

`Search -> selected property -> property detail -> return to Search`

The specification preserves the existing `/search` route, existing `/properties/[id]` route, existing APIs, existing Search ranking, existing property data, current map provider, no cross-session persistence, no hidden customer profile, and no new route.

## 2. Governing Decision Questions

Search:

**Which homes deserve my attention?**

Property:

**Should I spend more time on this property?**

Context preservation must help the customer move between these two questions without reconstructing the session.

## 3. Current Customer Problem

The certified Search shell helps the customer select a property worth closer review. The existing selected-property preview then links to `/properties/[id]`. When the customer opens property detail and returns, the experience does not guarantee restoration of all meaningful Search decision context.

Customer friction:

- active criteria may need to be reconstructed;
- selected property identity may be lost;
- pinned preview may not reopen;
- mobile list/map mode may reset;
- map bounds, zoom, and list scroll are not preserved;
- direct property entry cannot safely infer a Search origin;
- the customer may lose their prior place in the discovery process.

This is a continuity problem between certified Search and certified Property, not a need for a new property route or a full property overlay.

## 4. Models Evaluated

### A. URL_QUERY_RETURN_STATE

Strengths:

- transparent;
- shareable;
- reload-safe;
- works without hidden storage;
- already aligned with current Search criteria serialization.

Limitations:

- URL should not carry noisy UI-only state;
- selected property and mobile mode can be represented, but map bounds, zoom, scroll, and full preview state may make URLs brittle or too large;
- unknown or stale parameters must be ignored calmly.

Disposition:

Useful as the canonical first-phase context backbone.

### B. BROWSER_HISTORY_STATE

Strengths:

- can preserve ephemeral UI details without exposing them in the URL;
- naturally pairs with browser Back/Forward;
- can carry selected property and mobile mode for same-session return.

Limitations:

- does not survive hard reload or new-tab entry reliably;
- is not visible to the customer;
- requires careful fallback when history is absent or stale.

Disposition:

Useful as subordinate session-navigation state, not as the sole source of truth.

### C. IN_MEMORY_NAVIGATION_STATE

Strengths:

- simple within a mounted Search component;
- already owns selected property, hover, mobile mode, bounds, and list state.

Limitations:

- route transition to `/properties/[id]` may unmount Search;
- hard reload and direct entry lose state;
- insufficient as the primary model across route boundaries.

Disposition:

Useful only for local shell behavior before navigation and after successful restoration.

### D. BOUNDED_SEARCH_RETURN_URL

Strengths:

- explicit customer-safe return destination;
- avoids fabricating Search origin;
- supports direct property entry fallback;
- can preserve existing URL-backed criteria.

Limitations:

- needs validation and length limits;
- should not carry sensitive, identifying, or unsupported state;
- selected property and mobile mode need careful naming and stale handling.

Disposition:

Required first-phase concept.

### E. HYBRID_URL_AND_HISTORY_STATE

Strengths:

- URL preserves transparent, reload-safe, criteria-led return state.
- Browser history state can supplement same-session selected property and mobile mode behavior.
- Direct property entry remains independent.
- No localStorage, cookies, database persistence, telemetry, CRM, profile, or new route is required.

Limitations:

- implementation must keep URL and rendered state synchronized;
- history state must be optional and fail calmly.

Disposition:

Selected.

### F. PROPERTY_DETAIL_OVERLAY_OR_PANEL

Strengths:

- could preserve full Search shell visually.

Limitations:

- effectively creates a new property-detail architecture;
- risks route, accessibility, focus, mobile, canonical, and property-page scope expansion;
- unnecessary for the bounded first phase.

Disposition:

Excluded.

### G. Another Repository-Supported Bounded Model

No superior model was found in repository evidence. The existing architecture already supports URL-backed criteria and same-session route navigation, making the hybrid model the most bounded path.

## 5. Selected Context-Preservation Model

Selected model:

`HYBRID_URL_AND_HISTORY_STATE`

Definition:

- URL carries the transparent Search return destination and supported Search criteria.
- URL may carry a bounded Search-origin marker and selected property id only when generated from Search.
- Browser history state may carry same-session UI hints, such as mobile list/map mode, without being required for correctness.
- In-memory Search state is used only after returning to `/search` and validating the URL/history context.
- Direct property entry does not infer Search origin.
- Unsupported, stale, malformed, or absent context clears safely.

The property page remains a focused property decision brief. The Search shell remains the Search workspace.

## 6. Search Context Inventory

| Context element | Current evidence | Specification posture |
| --- | --- | --- |
| City | URL-backed as `city` | Preserve through URL |
| Free-text query | URL-backed as `q` and legacy `query` | Preserve through URL as `q` |
| Minimum price | URL-backed as `minPrice` and legacy `priceMin` | Preserve through URL as `minPrice` |
| Maximum price | URL-backed as `maxPrice` and legacy `priceMax` | Preserve through URL as `maxPrice` |
| Property type | URL-backed as `propertyType` and legacy `type` | Preserve through URL as `propertyType` |
| Beds | URL-backed as `beds` and legacy `minBeds` | Preserve through URL as `beds` |
| Baths | URL-backed as `baths` and legacy `minBaths` | Preserve through URL as `baths` |
| Sort | No public Search sort control in certified shell | Excluded |
| Result count | Derived from Search response | Recompute on return |
| Map bounds | Component memory from `lastMapBounds` | Deferred |
| Map zoom | Leaflet map state | Deferred |
| Selected property | Component state as `selectedId` | First-phase selected id restoration where valid |
| Pinned preview | Derived from selected property | First-phase reopen only if selected property validates |
| List scroll position | DOM/sidebar state | Deferred |
| List/map mode | `mobileView` component state | First-phase mobile mode hint |
| Mobile list/map mode | Same as `mobileView` | First-phase mobile mode hint |
| Hovered property | Component state as `hoveredId` | Excluded |
| Comparison selections | No certified multi-select comparison model | Excluded |
| Advanced-filter open state | Local UI disclosure state | Optional/deferred |

## 7. Context Classification

`REQUIRED_WHERE_ALREADY_URL_BACKED`

- city;
- free-text query;
- minimum price;
- maximum price;
- property type;
- beds;
- baths.

`REQUIRED_FIRST_PHASE`

- Search-origin marker;
- safe return destination;
- selected property identity;
- mobile list/map mode hint;
- stale-context clearing;
- direct property-entry fallback.

`DEFERRED_WITHIN_CONTEXT_PROGRAM`

- map bounds;
- map zoom;
- list scroll position;
- preview scroll position;
- advanced-filter disclosure state;
- complete restoration after arbitrary route chains.

`OPTIONAL`

- result count announcement after restored Search response;
- focus restoration to selected card when possible;
- property-page orientation text only when Search-origin context exists.

`EXCLUDED`

- sort;
- hovered property;
- comparison selections;
- cross-session restoration;
- customer profile;
- tracking history;
- persistent saved workspace.

## 8. First-Phase Restoration Scope

First phase must restore or preserve:

- supported URL-backed Search criteria;
- explicit Search-origin context when generated from Search;
- selected property identity where valid;
- contextual return URL;
- mobile list/map mode hint where valid;
- direct property entry with no fabricated Search state;
- stale or invalid context clearing;
- Back/Forward synchronization.

First phase may reopen the pinned preview only when:

- the return originated from Search;
- the selected property id is present;
- the restored Search results include that property;
- reopening does not create a focus trap or mobile confusion.

First phase should not attempt:

- map bounds restoration;
- zoom restoration;
- list scroll restoration;
- full workspace restoration;
- any provider or map visual-language change.

## 9. Search-Origin Model

The product should distinguish property detail entry origins:

- Search;
- Market;
- Neighborhood;
- Compare;
- direct URL;
- external link;
- another property page.

Search origin must be explicit. The property page must not infer Search origin from referrer, analytics, cookies, storage, or profile data.

Permitted Search-origin signal:

- a bounded query parameter or return URL generated by Search navigation, such as `from=search` or a validated `returnTo` path.

Prohibited:

- referral inspection as authority;
- hidden customer journey history;
- cookies or storage;
- telemetry-derived context;
- automatic transfer of unrelated planner, profile, or CRM data.

## 10. Direct Property-Entry Model

Direct `/properties/[id]` entry must:

- render the property page independently;
- show no broken Back or return action;
- avoid fabricating Search state;
- avoid forced redirect to Search;
- avoid hidden profile or persistence;
- provide existing property-level continuations such as market context, contact, or city Search where already supported.

If no valid Search return context exists, any Search link should behave as a generic Search continuation, not as a restored session.

## 11. Property Return-Action Model

Recommended customer-facing label:

`Return to Search Results`

Behavior:

- appears only when valid Search-origin context exists;
- points to a validated `/search` URL carrying supported criteria and bounded context;
- may be supplemented by browser Back but must not depend on it;
- falls back to `/search` or existing city Search when Search-origin context is absent;
- has an accessible name such as `Return to Search results with your previous criteria`;
- does not duplicate or replace the browser Back button;
- does not create a new form, route, or Search shell inside the property page.

Mobile behavior:

- action should be reachable near the property orientation area or within existing action flow;
- touch target should remain stable;
- it must not create a confusing second navigation layer.

## 12. Browser Back / Forward Model

Expected behavior:

1. Search -> preview -> property detail -> Back: returns to Search; URL-backed criteria restore; selected property may restore if valid.
2. Search -> property detail -> Back -> Forward: returns to property detail with no mutation of property data or route.
3. Search criteria change -> property detail -> Back: restores the criteria represented in the Search URL used to open the property.
4. Mobile map mode -> property detail -> Back: returns to Search and may restore map mode where a valid mode hint exists.
5. Mobile list mode -> property detail -> Back: returns to Search and may restore list mode where a valid mode hint exists.
6. Direct property entry -> Back: follows browser history or exits as normal; no Search state is fabricated.
7. External referral -> property detail: property page works independently; Search-origin UI does not appear unless a valid return URL exists.
8. Stale or invalid return context: return to safe Search URL and clear unsupported context.
9. Property removed from active result set: restore criteria and clear selected property/preview.
10. Multiple property-detail visits: latest valid Search-origin context governs return; no persistent history ledger is created.

The URL and rendered state must remain synchronized. Search must not show selected property state that is absent from the current result set.

## 13. URL-State Model

Existing URL-backed Search criteria:

- `q`
- `city`
- `minPrice`
- `maxPrice`
- `beds`
- `baths`
- `propertyType`

Legacy accepted inputs remain parse-only where currently supported:

- `query`
- `priceMin`
- `priceMax`
- `minBeds`
- `minBaths`
- `type`

Permitted first-phase return-state parameters should be limited to:

- Search-origin marker, such as `from=search`;
- selected property id, such as `selected=<propertyId>`;
- mobile mode hint, such as `view=list` or `view=map`;
- supported Search criteria listed above.

Parameter rules:

- only encode path/query state, never full external URLs;
- validate return path starts with `/search`;
- reject unknown origins;
- ignore unsupported context parameters;
- enforce a reasonable URL-size ceiling;
- reject or ignore malformed property ids;
- do not include customer-identifying or sensitive data;
- do not alter canonical metadata during the first phase.

Privacy implication:

The URL may expose Search criteria and selected property id to the browser history. This is acceptable only because the data is customer-visible, non-sensitive Search state. It must not include hidden profile, financial, CRM, or behavioral history.

## 14. Browser-History-State Model

Allowed history-state fields:

- `source: "search"`;
- `selectedPropertyId`;
- `mobileView`;
- `returnSearchPath`;
- optional timestamp for stale-state evaluation, if needed.

Lifetime:

- current browser session and navigation stack only;
- not guaranteed across hard reload or new tab;
- subordinate to validated URL state.

Refresh behavior:

- hard reload should degrade to URL-backed criteria only;
- no error should appear because history state is missing.

Why subordinate:

Browser history state is useful for same-session continuity, but URL state remains the transparent and reload-safe source for supported criteria and return destination.

## 15. In-Memory-State Findings

Current in-memory state owners:

- `SearchInterface`: filters, selected id, hovered id, mobile view, search error, map bounds metadata.
- `MapSidebar`: list scroll and active-card DOM.
- `SearchMap`: Leaflet map, marker state, bounds, zoom, clusters.
- `SelectedPropertyDrawer`: focus and preview presentation.

In-memory state is sufficient for the active Search shell but insufficient as the primary route-boundary preservation model because opening `/properties/[id]` may unmount Search and direct entry provides no Search memory.

## 16. Stale-Context Handling

Safe behavior:

- Filters no longer match property: restore filters, clear selected property, do not reopen preview.
- Listing removed: restore Search criteria, show normal result status, clear selected property.
- Search results change: validate selected id against current visible results before showing selection.
- Property ID invalid: ignore selected context and preserve only valid criteria.
- Return URL malformed: fall back to `/search`.
- Unsupported criteria: ignore unknown parameters.
- Map/list mode unavailable: default to list mode.
- Search degraded: show existing degraded Search state, not a context failure.
- Browser history absent: rely on URL criteria or generic Search continuation.

The experience must never trap the customer on property detail or Search.

## 17. Property-Page Bounded Requirements

Allowed future additions:

- contextual return action when Search-origin context is valid;
- concise Search-origin orientation;
- no-context fallback to generic Search or city Search;
- accessible return-action label;
- no dense explanation of the state model.

Prohibited:

- embedding Search controls on property detail;
- duplicating the Search shell;
- property-page redesign;
- new recommendation, ranking, scoring, suitability, approval, or valuation language;
- new route;
- new API;
- persistence or tracking.

## 18. Search-Return Requirements

On return to Search:

- restore supported criteria from URL;
- run existing Search refresh behavior for active criteria;
- validate selected property against returned visible results;
- restore selected property only when valid;
- reopen pinned preview only when valid and not disruptive;
- restore mobile list/map mode from a valid mode hint;
- announce restored state through existing Search state announcement or equivalent accessible status;
- clear stale selected property;
- preserve normal loading, empty, error, and degraded states.

Deferred:

- exact map bounds restoration;
- zoom restoration;
- list scroll restoration;
- card scroll anchoring unless already safely achievable;
- advanced-filter disclosure restoration.

## 19. Desktop Architecture

Desktop should preserve:

- split list/map Search workspace;
- selected property orientation;
- property detail as full route;
- contextual return action on property page only when Search-origin context exists;
- return focus to Search heading, selected card, or selected preview depending on valid context and implementation feasibility.

Avoid:

- duplicating browser Back with confusing page controls;
- embedding a mini Search shell on property page;
- changing the property page into a side panel.

## 20. Tablet Architecture

Tablet should preserve:

- clear Search return destination;
- list/map relationship;
- stable property route behavior;
- readable return action;
- no two-layer navigation ambiguity.

If screen width makes selected preview restoration crowded, return should prioritize Search criteria and result status over forcing preview open.

## 21. Mobile Architecture

At approximately `390x844`:

- mobile mode hint may restore list or map where valid;
- default fallback is list mode;
- selected-property preview may reopen only if it remains readable and dismissible;
- Back gesture and page return action must not fight each other;
- focus should land on a meaningful Search heading, status, or selected item;
- touch targets must remain stable;
- no sticky restoration control should obscure Search, preview, or property content;
- no scroll restoration should be attempted unless it is reliable.

Mobile must not be treated as compressed desktop.

## 22. Accessibility Model

Requirements:

- return action has explicit accessible name;
- restored Search state is announced through a polite status region or equivalent;
- focus after return lands on selected card, selected preview, Search status, or Search heading;
- no focus trap in restored preview;
- direct property entry has no broken contextual control;
- keyboard Back/Forward behavior remains browser-native;
- selection is not communicated by color alone;
- reduced-motion users are not forced through animated map or scroll restoration.

## 23. Privacy And Persistence Boundaries

Prohibited:

- localStorage;
- sessionStorage;
- cookies;
- database persistence;
- authenticated saved state;
- CRM;
- telemetry;
- customer tracking;
- financial profile;
- behavioral profile;
- cross-session restoration;
- hidden Search-history storage.

Permitted context must be transparent, bounded, and session/navigation oriented.

## 24. Route / API / Data Boundaries

Preserve:

- `/search`
- `/properties/[id]`
- existing Search API;
- existing property data;
- existing Search ranking;
- existing map provider;
- existing property page canonical behavior.

Do not authorize:

- route aliases;
- redirects;
- API changes;
- provider changes;
- Prisma changes;
- migrations;
- new evidence claims;
- personalization.

If a future implementation requires a new route, this specification becomes insufficient and a separate route authorization gate is required.

## 25. State Model

| State | Customer message | Primary action | Fallback action | Preserved context | Focus behavior | Trust boundary |
| --- | --- | --- | --- | --- | --- | --- |
| Search entry | Search is ready for property discovery | Refine or select property | Clear criteria | URL criteria | Search prompt/status | No recommendation |
| Selected property | Property selected from list/map | View Property | Close preview | selected id | preview heading | Preview is not full detail |
| Property navigation pending | Opening property detail | Continue | Browser Back | return URL/history state | native navigation | No data mutation |
| Property detail from Search | Property brief with Search return available | Return to Search Results | Browser Back | bounded return state | property orientation | No hidden storage |
| Direct property detail | Property page stands alone | Explore Search or contact | Browser Back | none | property heading | No fabricated origin |
| Return context available | Previous Search context can be restored | Return to Search Results | Generic Search | URL criteria, selected id, mode hint | return action | Transparent context only |
| Return context unavailable | No prior Search context is available | Search by city/general Search | Browser Back | none | property heading | No inference |
| Return context stale | Context can no longer fully apply | Show Search with valid criteria | Clear invalid context | valid criteria only | Search status | No false selection |
| Search restored | Search criteria restored | Continue comparing | Clear Search | criteria, valid selected id | Search status/selected item | No persistence |
| Search degraded | Search returned degraded state | Continue or retry | Contact/advisory | valid criteria | Search status | Existing degraded language |
| Property unavailable | Property cannot be found | Search | Contact | none | not-found heading | No invented property |
| Invalid context | Context rejected | Generic Search | Browser Back | none | Search heading | Fail calmly |
| Mobile list return | Return to list mode | Continue list comparison | Toggle map | criteria, mode | list/status | No scroll guarantee |
| Mobile map return | Return to map mode | Continue map comparison | Toggle list | criteria, mode, valid selection | map/status/preview | No forced map conclusion |

## 26. Loading And Performance Experience

Requirements:

- property navigation uses existing Next route behavior;
- Back return may show existing Search loading/update states;
- delayed Search results should not show stale selected preview;
- image loading remains governed by existing resilient image behavior;
- stale selected property clears before presenting a restored preview;
- degraded Search response uses existing degraded Search language.

No new infrastructure is authorized.

## 27. Acceptance Criteria

A future implementation must demonstrate:

- existing Search and property routes preserved;
- Search-origin context is explicit and bounded;
- direct property entry remains safe;
- Back and Forward remain synchronized;
- authorized first-phase URL criteria restore correctly;
- selected property restores only when valid;
- mobile list/map return behavior is coherent;
- stale context fails safely;
- no cross-session persistence;
- no localStorage, sessionStorage, or cookies;
- no API, ranking, provider, Prisma, CRM, or telemetry changes;
- accessibility and focus restoration;
- marker/preview and Search shell certifications remain preserved;
- Map Visual-Language Normalization remains deferred;
- brokerage disclosure remains unchanged.

## 28. Deterministic Validation Strategy

Future deterministic checks should verify:

- existing `/search` route preserved;
- existing `/properties/[id]` route preserved;
- selected context model is present;
- allowed context fields are limited;
- prohibited persistence APIs are absent;
- direct-entry fallback exists;
- stale-state handling exists;
- Back/Forward model is testable;
- mobile mode restoration is bounded;
- no Search API, property API, provider, ranking, Prisma, CRM, telemetry, or map-provider changes;
- marker-preview preservation;
- Search-shell preservation;
- map-normalization deferral;
- brokerage hold;
- no prohibited claims.

## 29. Responsive And Interaction Certification Plan

Review at:

- `390x844`
- `768x1024`
- `1440x1100`

Test:

- Search -> preview -> property;
- property page return action;
- browser Back;
- browser Forward;
- mobile list mode;
- mobile map mode;
- direct property entry;
- stale context;
- invalid context;
- multiple property visits;
- hard reload;
- new-tab property entry;
- focus restoration;
- no overflow or critical overlap;
- no console errors.

## 30. Likely Implementation File Scope

`REQUIRED`

- `components/search/SearchInterface.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- implementation documentation
- `docs/CHAT_START.md`

`CONDITIONAL`

- `components/maps/MapSidebar.tsx`
- `app/properties/[id]/page.tsx`
- bounded navigation/context utility
- focused deterministic check
- `package.json` and `tsconfig.worker.json` only if registering a focused check

`PROHIBITED_UNLESS_SEPARATELY_AUTHORIZED`

- Search API routes;
- property API routes;
- new routes;
- Prisma;
- migrations;
- map provider files;
- telemetry;
- CRM;
- persistence infrastructure;
- deployment configuration.

## 31. Protected Boundaries

This specification preserves:

- no implementation authorization;
- no runtime changes;
- no route changes;
- no API changes;
- no Search ranking changes;
- no property data changes;
- no map provider changes;
- no Map Visual-Language Normalization;
- no localStorage, sessionStorage, cookies, database persistence, CRM, telemetry, or profile;
- no brokerage disclosure changes;
- no public trust or fair-housing claim expansion;
- no production certification;
- no next phase.

## 32. Deferred Work

Deferred:

- map bounds restoration;
- zoom restoration;
- list scroll restoration;
- advanced-filter disclosure restoration;
- full persistent Search/property workspace;
- property overlay/panel architecture;
- Map Visual-Language Normalization;
- provider/tile/source changes;
- brokerage disclosure changes;
- saved searches or customer profiles;
- telemetry-backed journey analytics.

Map Visual-Language Normalization remains:

`DEFERRED`

Brokerage disclosure remains:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## 33. Open Questions

1. Exact parameter names for Search-origin and selected-property return state.
2. Whether selected preview should reopen by default on mobile or only mark selection.
3. Whether a first implementation should use history state for mobile mode or keep mobile mode URL-backed.
4. Exact maximum URL size and validation behavior.
5. Whether property page needs a visible Search-origin orientation message or only a return action.
6. Whether focus should prefer selected card, selected preview, or Search status after return.

## 34. Exact First Bounded Implementation Phase

Selected first implementation phase:

`SEARCH_RETURN_URL_AND_CONTEXT_HANDOFF`

Scope:

- encode a safe return Search URL from the selected-property preview;
- hand off bounded Search-origin state to the property route;
- expose a contextual property-page return action only where valid;
- restore supported criteria and valid selected-property state on return;
- include mobile mode hint only if it can be implemented without conflicting state;
- fail calmly for direct entry, stale context, invalid context, hard reload, and new-tab entry.

## 35. Exact Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_RETURN_URL_AND_CONTEXT_HANDOFF_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

That gate may authorize only the first bounded implementation phase if explicitly granted. It must not authorize full context preservation, map visual normalization, route changes, API changes, provider changes, persistence, telemetry, CRM, brokerage disclosure changes, or another DXT phase.
