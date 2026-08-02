# REIE DXT Wave 1B Post Search Workspace Shell Next-Phase Review

Date: August 2, 2026

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Post Search Workspace Shell Next-Phase Review
Status: `REIE_DXT_WAVE_1B_POST_SEARCH_SHELL_NEXT_PHASE_SELECTED`

## Executive Decision

Selected next bounded Wave 1B phase:

`PROPERTY_DETAIL_CONTEXT_PRESERVATION`

Recommended outcome:

`READY_FOR_PROPERTY_DETAIL_CONTEXT_PRESERVATION_PRODUCT_SPECIFICATION`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_PROPERTY_DETAIL_CONTEXT_PRESERVATION_PRODUCT_SPECIFICATION`

This review authorizes planning only. It does not authorize implementation, runtime changes, Search changes, property-route changes, map-provider changes, API changes, persistence, telemetry, CRM, brokerage disclosure changes, production certification, or another DXT phase.

## Baseline And Prior Deployment Status

Repository baseline verified before review:

- Branch: `main`
- HEAD: `689f1ae3f7e8100445474a3abca44b6270219503`
- origin/main: `689f1ae3f7e8100445474a3abca44b6270219503`
- Ahead/behind: `0 ahead / 0 behind`
- Working tree: clean

The pending deployment status `51508696112` for commit `689f1ae3f7e8100445474a3abca44b6270219503` completed successfully and was superseded by the final successful Vercel status:

- Status: `success`
- GitHub/Vercel status ID: `51508730275`
- Context: `Vercel`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/BWkyk7i8sv7NfbPHjWPqrtfTTUjk`
- Updated: `2026-08-02T17:14:32Z`

Remote `origin/main` remained at the expected baseline SHA during review. No later commit or deployment superseded the baseline before documentation work began.

## Current Certified Wave 1B State

Certified and closed:

1. Search Marker and Preview Interaction Remediation
2. Search Workspace Information Hierarchy and Shell

Current certified behavior includes:

- click-first listing-marker selection;
- pinned interactive property preview;
- no essential hover dependency;
- synchronized marker, card, and preview state;
- coherent Search decision hierarchy;
- visible result status;
- core and advanced criteria hierarchy;
- unified list/map workspace;
- responsive mobile, tablet, and desktop behavior;
- existing `/search` and `/properties/[id]` routes preserved;
- no Search API, provider, persistence, telemetry, CRM, or brokerage-disclosure changes.

Search governing question:

**Which homes deserve my attention?**

Property governing question:

**Should I spend more time on this property?**

## Candidates Evaluated

### A. Property Detail Context Preservation

Purpose:

- Preserve meaningful Search context when a customer opens a property from the Search workspace and returns.
- Make Search and Property feel like one decision continuum without creating a new route or persistent customer profile.

Decision:

Selected for product specification.

### B. Map Visual-Language Normalization

Purpose:

- Normalize map visual quality and REIE visual language across zoom levels, tile behavior, markers, labels, land, water, roads, and boundaries.

Decision:

Deferred as prerequisite-dependent.

### C. Another Repository-Supported Wave 1B Phase

Decision:

Not selected. The two named candidates cover the current repository-supported post-shell Wave 1B decision space, and Candidate A is the clearest next bounded customer-value phase.

## Property Detail Context Preservation Findings

Repository evidence supports this as the next phase:

- `components/search/SearchInterface.tsx` owns supported Search filters, selected property, hovered property, mobile list/map view, last map bounds, and popstate handling.
- `components/search/SearchControls.tsx` serializes supported criteria into the `/search` query string.
- `components/maps/SelectedPropertyDrawer.tsx` sends `View Property` to the existing `/properties/[id]` route.
- `app/properties/[id]/page.tsx` remains the authoritative property-detail route.
- The Search shell closure certified that Back returns to Search with the shell intact, but full restoration of map bounds, zoom, list scroll, selected preview, and workspace state remains deferred.

Customer friction:

- Selecting `View Property` removes the visible Search map workspace.
- Returning to Search does not yet guarantee restoration of all decision context.
- The customer may need to reconstruct where they were in the list/map comparison flow before deciding whether the property deserves more attention.

This is a decision-continuity problem, not a missing property-page problem.

## Search Context Inventory

| Context item | Current repository evidence | First-phase classification |
| --- | --- | --- |
| Search query | `q` / `query` parsed by `getSearchFiltersFromParams` | `REQUIRED_FOR_FIRST_PHASE` |
| City | `city` parsed and serialized by Search controls | `REQUIRED_FOR_FIRST_PHASE` |
| Price filters | `minPrice`, `maxPrice` parsed and serialized | `REQUIRED_FOR_FIRST_PHASE` |
| Beds/baths | `beds`, `baths` parsed and serialized | `REQUIRED_FOR_FIRST_PHASE` |
| Property type | `propertyType` parsed and serialized | `REQUIRED_FOR_FIRST_PHASE` |
| Sort | No public sort control in certified shell | `EXCLUDED` |
| Map bounds | `lastMapBounds` captured in component memory only | `DEFERRED_WITHIN_CONTEXT_PROGRAM` |
| Zoom | Leaflet map owns zoom; not persisted in Search URL | `DEFERRED_WITHIN_CONTEXT_PROGRAM` |
| Selected property | `selectedId` in `SearchInterface` component state | `REQUIRED_FOR_FIRST_PHASE` |
| Pinned preview | Derived from selected property state | `REQUIRED_FOR_FIRST_PHASE` |
| List scroll position | `MapSidebar` list scroll is DOM state | `DEFERRED_WITHIN_CONTEXT_PROGRAM` |
| List/map mode | `mobileView` in `SearchInterface` component state | `REQUIRED_FOR_FIRST_PHASE` for mobile return |
| Direct property entry | Existing `/properties/[id]` must remain valid without Search context | `REQUIRED_FOR_FIRST_PHASE` |

## Context-Preservation Model Findings

Models evaluated:

1. URL-state preservation
2. Browser-history state
3. In-memory navigation state
4. Search-return URL
5. Existing property route plus bounded restoration
6. Property detail overlay or side panel
7. Another repository-supported bounded model

Recommended model for product specification:

`EXISTING_PROPERTY_ROUTE_PLUS_BOUNDED_SEARCH_RETURN_STATE`

Rationale:

- Keeps `/search` as the Search workspace.
- Keeps `/properties/[id]` as the property-detail route.
- Avoids new routes, overlays, database persistence, localStorage, cookies, profiles, CRM, and telemetry.
- Builds from existing query-string criteria and existing Back/Forward behavior.
- Allows bounded first-phase continuity without requiring full map workspace restoration.

First-phase context preservation should specify:

- search criteria restoration from supported `/search` query parameters;
- selected property restoration only when returning from Search-originated property navigation and the property remains in the result set;
- pinned preview restoration from selected property state where safe;
- mobile list/map mode restoration where safe;
- direct property entry with no assumed Search context;
- clear behavior when context is missing, stale, unsupported, or invalid.

Deferred within the context program:

- exact map bounds restoration;
- zoom restoration;
- list scroll restoration;
- complete workspace restoration after arbitrary route navigation.

Excluded:

- property detail overlay;
- full property drawer replacing `/properties/[id]`;
- cross-session persistence;
- saved customer profile;
- telemetry-backed context transfer.

## Map Visual-Language Findings

Repository evidence confirms the map visual-language issue is real but more constrained:

- `components/maps/SearchMap.tsx` uses Leaflet.
- Default Search tiles use `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`.
- Optional Mapbox outdoors tiles are added only when `NEXT_PUBLIC_MAPBOX_TOKEN` is present.
- The OpenTopoMap layer has `maxZoom: 17`; the map itself allows `maxZoom: 18`.
- Mapbox, when present, is overlaid at low opacity with CSS filters and `mix-blend-mode: soft-light`.
- Marker and UI accents are REIE-controlled; basemap land, water, roads, labels, and boundaries are primarily provider-controlled raster tiles.
- Requirements traceability records open map visual requirements around Electric Caribbean Blue, zoom-level color/filter behavior, and provider/style authorization.
- `scripts/checkMapRenderingSafety.ts` protects against decorative overlays and heavy tile distortion.

Findings:

- Visual switching across zoom levels may be caused by provider raster-tile differences, OpenTopoMap maximum zoom behavior, optional Mapbox overlay behavior, browser/provider fallback, and CSS filters.
- The current repository does not prove that exact water, road, label, boundary, or land colors can be controlled with the current default tile source.
- A coherent map visual language likely requires a separate provider/style feasibility gate before implementation can be safely scoped.

## Map Provider, Tile, Attribution, And Licensing Findings

Grounded repository findings:

- Search default: OpenTopoMap raster tiles.
- Conditional overlay: Mapbox outdoors style when `NEXT_PUBLIC_MAPBOX_TOKEN` exists.
- Public Trust records state that map views use third-party map tile providers.
- Source-rights and geographic intelligence governance repeatedly require explicit attribution, provider, and activation review before new provider use.
- No provider replacement, paid-plan activation, new token behavior, attribution change, tile-source change, or licensing conclusion is authorized by this review.

The map candidate is not blocked forever. It is prerequisite-dependent on a product specification or feasibility review that can establish:

- active provider and tile behavior at relevant zoom levels;
- attribution obligations;
- provider terms and style-control rights;
- whether visual normalization is possible without provider change;
- whether accessibility contrast can be preserved;
- whether changes remain bounded and reversible.

## Customer Impact Comparison

Property Detail Context Preservation:

- Customer impact: high.
- Decision-friction reduction: high.
- Frequency: high for customers who open property detail from Search.
- Visibility: high during the core Search-to-property loop.
- Relationship to certified shell: direct continuation of the newly certified Search workspace.

Map Visual-Language Normalization:

- Customer impact: medium to high.
- Decision-friction reduction: medium.
- Frequency: high, but perceived primarily as visual consistency rather than decision continuity.
- Visibility: high, especially across zoom levels.
- Relationship to certified shell: important but provider-constrained.

Recommendation:

Property Detail Context Preservation creates the greater immediate customer decision benefit because it protects continuity at the exact moment the customer moves from "Which homes deserve my attention?" to "Should I spend more time on this property?"

## Complexity And Risk Comparison

Property Detail Context Preservation:

- Implementation complexity: medium.
- Production risk: moderate and controllable if first specified around existing routes and supported state only.
- Route/browser-history risk: moderate.
- API/data dependency: low if first phase uses existing Search query state and current property route.
- Persistence risk: low if explicitly prohibited.
- Deterministic validation feasibility: strong.
- Reversibility: strong if no route/API/persistence changes occur.

Map Visual-Language Normalization:

- Implementation complexity: medium to high.
- Production risk: higher due to provider, tile, attribution, accessibility, and rendering constraints.
- Provider/licensing risk: high until researched.
- API/data dependency: low unless provider change is introduced.
- Deterministic validation feasibility: moderate; visual QA would be required.
- Reversibility: moderate if limited to CSS, lower if provider or tile-source changes are required.

## Recommended Next Phase

Exact program name:

`REIE_DXT_WAVE_1B_PROPERTY_DETAIL_CONTEXT_PRESERVATION`

Selected next gate:

`READY_FOR_REIE_DXT_WAVE_1B_PROPERTY_DETAIL_CONTEXT_PRESERVATION_PRODUCT_SPECIFICATION`

## Why Now

The Search marker/preview interaction and the Search workspace shell are now certified and closed. The next visible friction occurs when a customer opens a property from Search and then returns. The customer has enough context to decide a property deserves attention, but the Search-to-property-to-Search loop does not yet guarantee restoration of the decision context that produced that attention.

## Why It Outranks The Alternative

Property context preservation:

- directly extends the certified Search shell;
- improves the central customer decision loop;
- can be planned without provider or licensing changes;
- can keep existing routes and APIs;
- has stronger deterministic validation feasibility;
- is less likely to cross protected provider, tile-source, attribution, or map-style boundaries.

Map visual-language normalization remains important but should not outrank the context-preservation phase because it depends on provider/style feasibility and licensing constraints that are not yet resolved.

## Proposed Bounded Product-Specification Scope

The next specification should define:

- exact Search-originated property navigation behavior;
- exact Back and Forward behavior;
- direct property-entry behavior when no Search context exists;
- supported Search criteria restoration;
- selected-property restoration rules;
- pinned-preview restoration rules;
- mobile list/map return behavior;
- missing, stale, invalid, or unsupported context handling;
- no-context fallback language;
- browser-history behavior;
- URL/query behavior;
- accessibility and focus expectations;
- validation and production-certification requirements.

The specification must classify each context item as:

- required for first implementation phase;
- deferred within context program;
- optional;
- excluded.

## Likely Future File Scope

Likely runtime files for a later implementation, subject to separate authorization:

- `components/search/SearchInterface.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `components/maps/MapSidebar.tsx`
- `app/properties/[id]/page.tsx` only if a bounded return-link or no-context treatment is required
- focused deterministic check script, if needed
- `package.json` and `tsconfig.worker.json` only if registering a new check
- implementation record
- `docs/CHAT_START.md`

Prohibited unless separately authorized:

- new routes;
- Search API routes;
- property API routes;
- Prisma or migrations;
- persistence;
- localStorage, sessionStorage, or cookies;
- CRM;
- telemetry;
- map provider or tile-source changes;
- brokerage disclosure changes.

## Route / API / Data / Persistence Implications

Route implications:

- Existing `/search` must remain the Search workspace.
- Existing `/properties/[id]` must remain the property-detail route.
- No new property route, overlay route, redirect, alias, or drawer route should be authorized by the specification.

API/data implications:

- Search API and ranking must remain unchanged unless separately authorized.
- Property data model must remain unchanged.
- No provider or live-data source changes are required for specification.

Persistence implications:

- No database persistence.
- No authenticated profile.
- No CRM.
- No telemetry.
- No localStorage, sessionStorage, or cookies.
- Context must be bounded to URL/browser navigation state and current rendered session behavior unless separately authorized.

## Acceptance And Certification Requirements

Acceptance criteria for a future implementation should include:

- Search-originated property navigation records enough bounded context to return responsibly.
- Back restores supported Search criteria.
- Back restores selected property and preview only when still valid.
- Forward returns to the property route.
- Direct property route entry works without Search context.
- Missing or stale context fails calmly.
- Mobile list/map mode behaves predictably.
- No unsupported restoration claims appear.
- No persistence, telemetry, profile, CRM, provider, or API behavior is introduced.
- Accessibility and focus order remain coherent.
- Existing Search marker/preview behavior remains intact.
- Existing property route remains healthy.

Deterministic validation should verify:

- no new route;
- no Search API changes;
- no property API changes;
- no persistence or storage usage;
- existing filter serialization remains supported;
- direct property entry remains valid;
- Search-to-property CTA remains valid;
- Back/Forward behavior is covered by browser tests or deterministic runtime smoke;
- stale context clears safely;
- brokerage disclosure remains unchanged;
- map visual-language normalization remains deferred.

Production certification should include:

- `/search` normal entry;
- `/search?city=Boulder`;
- selected listing to `/properties/[id]`;
- Back and Forward behavior;
- direct `/properties/[id]` entry;
- mobile list/map return behavior;
- no console errors;
- no route/canonical/sitemap regression;
- Search/map/property route regressions;
- public trust and fair-housing terminology review.

## Protected Boundaries

This review preserves:

- no implementation authorization;
- no runtime changes;
- no Search route change;
- no property route change;
- no Search API change;
- no property API change;
- no ranking change;
- no provider change;
- no map visual-language change;
- no tile-source change;
- no persistence;
- no localStorage, sessionStorage, or cookies;
- no telemetry;
- no CRM;
- no personalization;
- no brokerage disclosure change;
- no new public claim;
- no production certification;
- no next DXT phase.

## Deferred Or Blocked Candidate

Deferred candidate:

`MAP_VISUAL_LANGUAGE_NORMALIZATION`

Status:

`PREREQUISITE_DEPENDENT`

Deferral reason:

- The map visual issue is supported by repository evidence, but the likely solution may involve provider/tile/style/attribution/licensing questions.
- The current OpenTopoMap raster source and optional Mapbox overlay do not prove exact color or label control.
- A future phase must establish whether normalization can be achieved without provider change, paid plan activation, token behavior changes, attribution changes, or licensing risk.

Eligibility later:

- Provider and tile-source behavior inventoried at relevant zooms.
- Attribution obligations and source-rights posture verified.
- Visual target defined without unsupported provider claims.
- Bounded file scope and deterministic visual/regression checks defined.

Expected sequencing:

- After Property Detail Context Preservation specification and, if authorized later, implementation/certification; or sooner only if production evidence shows map visual inconsistency is more damaging than context loss.

## Brokerage Disclosure Hold

Brokerage disclosure remains governed by:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

This review does not modify, relocate, shorten, restyle, reassess, or include brokerage disclosure in the selected Wave 1B phase.

## Open Questions

Questions for the next product specification:

1. Should selected-property restoration be represented through query parameters, browser-history state, or a bounded return URL?
2. What exact context is safe to preserve without storage or tracking?
3. How should direct property-route entry explain absence of Search context, if at all?
4. Should mobile return prefer list view, map view, or the last customer-selected mode?
5. What is the safe fallback when selected property is no longer in the returned result set?
6. Can map bounds and zoom remain deferred without making the first context phase feel incomplete?

## Final Recommendation

Select:

`READY_FOR_PROPERTY_DETAIL_CONTEXT_PRESERVATION_PRODUCT_SPECIFICATION`

Do not begin implementation. Do not begin Map Visual-Language Normalization. Do not change routes, APIs, providers, persistence, telemetry, CRM, or brokerage disclosure.
