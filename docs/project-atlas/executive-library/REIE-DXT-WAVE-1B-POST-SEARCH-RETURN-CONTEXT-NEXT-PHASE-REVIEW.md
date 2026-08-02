# REIE DXT Wave 1B Post Search Return Context Next-Phase Review

Date: August 2, 2026

Program: REIE Decision Experience Transformation (DXT 1.0)

Phase: Wave 1B - Post Search Return Context Next-Phase Review

Authorization: Strategic review only. Documentation only. Implementation, runtime changes, route changes, API changes, map-provider changes, tile-source changes, persistence, telemetry, brokerage-disclosure changes, production certification, and next-phase execution are not authorized by this record.

## Status

`REIE_DXT_WAVE_1B_POST_SEARCH_RETURN_CONTEXT_NEXT_PHASE_SELECTED`

Selected outcome:

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_PRODUCT_SPECIFICATION`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_PRODUCT_SPECIFICATION_AUTHORIZATION`

The next gate may authorize product specification and feasibility review only. It must not authorize map implementation, provider changes, tile-source changes, API changes, route changes, persistence, telemetry, brokerage-disclosure changes, production deployment, or Phase 2 execution without explicit authorization.

## Baseline

Repository baseline verified before documentation work:

- Branch: `main`
- HEAD: `1e2bedda52d4c7357d89e74b60091cd6fb66fa24`
- `origin/main`: `1e2bedda52d4c7357d89e74b60091cd6fb66fa24`
- Ahead/behind: `0 ahead / 0 behind`
- Working tree: clean
- Latest commit message: `Close Search return context handoff`

Prior deployment status for the baseline:

- Status: `success`
- GitHub/Vercel status ID: `51510182222`
- Context: `Vercel`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/CQz4hdieQT1RToupvFYoBESvu5PS`
- Updated: `2026-08-02T18:30:37Z`
- Supersession status: no later `origin/main` commit superseded `1e2bedda52d4c7357d89e74b60091cd6fb66fa24` during baseline verification.

## Current Certified Wave 1B State

Certified and closed:

- Search marker and preview interaction remediation.
- Persistent Search workspace shell.
- Search return URL and context handoff.

Certified Search state:

- Existing `/search` remains the authoritative Search workspace surface.
- Existing `/properties/[id]` property routes remain the property-detail surface.
- Marker selection uses click-first selected-property preview behavior rather than actionable hover dependency.
- Search workspace hierarchy and mobile List/Map behavior remain certified.
- Search return handoff uses a bounded hybrid URL and history-state model.
- Direct property entry fails safely without assuming a Search origin.
- Selected-property restoration is bounded to valid, visible results.

Deferred and unauthorized:

- Full Property Detail Context Preservation beyond the Phase 1 Search return handoff.
- Map Visual-Language Normalization.
- Brokerage disclosure copy changes pending `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.
- Any provider, tile, API, persistence, telemetry, CRM, route, or deployment behavior change.

## Candidates Evaluated

| Candidate | Status | Summary |
| --- | --- | --- |
| A. `MAP_VISUAL_LANGUAGE_NORMALIZATION_FEASIBILITY_AND_PRODUCT_SPECIFICATION` | `SELECTED_FOR_PRODUCT_SPECIFICATION` | Highest current customer-experience leverage. The map is the dominant Search interface and active evidence indicates visual inconsistency is now the most visible remaining premium-experience gap. |
| B. `PROPERTY_DETAIL_CONTEXT_PRESERVATION_PHASE_2` | `DEFERRED` | Useful, but Phase 1 solved the highest-friction return-context problem. Further restoration would add complexity before evidence proves enough incremental value. |
| C. `WAVE_1B_CLOSURE_AND_TRANSITION` | `NOT_SELECTED` | Closure is premature while a major map visual-language issue remains active in the customer-facing Search experience. |
| D. Another bounded Search/property phase | `REJECTED_NOW` | No repository-supported alternative outranks the map visual-language gap without inventing new analytics, feedback, or defects. |

## Map Architecture Inventory

Current Search map architecture:

- Primary file: `components/maps/SearchMap.tsx`.
- Map library: Leaflet imported from `leaflet`.
- Leaflet CSS is imported directly by the Search map component.
- Default tile layer: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`.
- Default tile CSS class: `reie-saturday-topo-tiles`.
- Default tile `maxZoom`: `17`.
- Map `maxZoom`: `18`.
- Optional overlay: Mapbox outdoors style via `NEXT_PUBLIC_MAPBOX_TOKEN`.
- Optional overlay URL: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=...`.
- Optional overlay CSS class: `reie-mapbox-detail-tiles`.
- Optional overlay opacity: `0.18`.
- Optional overlay blend mode: `soft-light`.
- Marker and cluster visuals are REIE-controlled through `luxury-marker` and `luxury-cluster` classes.
- Marker clustering is local to the Search map component and uses a deterministic screen-grid grouping model.
- Bounds, zoom, resize, marker selection, hover state, and selected-property preview are controlled within the existing Search map/component architecture.

Adjacent map surfaces:

- `components/PropertyMap.tsx` uses React Leaflet, CARTO dark tiles, and public/contracted precision gating.
- `components/BoulderMarketMap.tsx` uses React Leaflet and OpenStreetMap tiles.
- `components/NeighborhoodOverlayMap.tsx` uses React Leaflet, OpenStreetMap tiles, and neighborhood polygon overlays.
- `app/globals.css` contains global Leaflet tile reset rules for `.reie-map-canvas .leaflet-tile` and separate legacy/global marker and tile styling rules.
- `scripts/checkMapRenderingSafety.ts` protects Leaflet tile geometry, resize invalidation, and avoidance of decorative basemap overlays.

Implication:

Search map visual-language normalization is not a simple copy polish issue. It touches the perceived quality of the primary discovery surface and depends on tile-source behavior, overlay behavior, CSS filters, attribution constraints, and provider style-control limits.

## Map Visual-Language Findings

Customer-facing issue:

- The Search map currently does not consistently feel like a premium decision platform. It can read as rough, externally styled, or visually disconnected from the certified REIE Product Experience language.

Repository-grounded causes to investigate:

- OpenTopoMap raster tiles are provider-controlled and may shift visual density, color, label treatment, and terrain detail across zoom levels.
- OpenTopoMap is capped at `maxZoom: 17` while the map itself allows `maxZoom: 18`.
- Optional Mapbox outdoors overlay behavior depends on `NEXT_PUBLIC_MAPBOX_TOKEN` and may create environment-dependent visual differences.
- The Mapbox overlay is blended at low opacity with CSS filters and `mix-blend-mode: soft-light`, which may not produce stable perceived color or label hierarchy.
- Search map tile styling exists inside `SearchMap.tsx`, while other Leaflet resets and marker styles also exist globally in `app/globals.css`.
- Prior requirement records already classify Electric Caribbean Blue map styling and zoom-level filter behavior as partially implemented/open.

Experience finding:

- Map Visual-Language Normalization is now the most important unresolved Wave 1B customer-experience problem because Search is a primary customer-discovery interface and the map occupies the emotional center of the experience.

## Map Provider, Tile, Attribution, And Licensing Findings

Current repository evidence:

- Search uses OpenTopoMap by default.
- Search conditionally uses Mapbox outdoors only when `NEXT_PUBLIC_MAPBOX_TOKEN` exists.
- Other map surfaces use OpenStreetMap or CARTO tile sources.
- Public and geographic governance records repeatedly require attribution, source-rights, provider, and activation review before new provider behavior is introduced.
- No repository record currently authorizes a provider replacement, paid tile-plan activation, new tile source, new token behavior, attribution change, or licensing conclusion for map visual normalization.

Provider/licensing conclusion:

- Product specification is ready to begin because the problem is clear and bounded.
- Implementation is not ready until official provider documentation, current production tile behavior, attribution obligations, and style-control rights are verified.
- The next phase must treat provider verification as a first-class feasibility requirement.
- If the desired visual standard cannot be achieved with the existing tile posture, the specification must stop at recommendation and require separate provider/tile authorization before implementation.

## Property Context Phase 2 Findings

Property Detail Context Preservation Phase 2 would likely evaluate:

- fuller Search-state return restoration;
- additional return copy;
- optional preservation of filter summaries;
- stronger selected-property rehydration;
- possible scroll or map-mode restoration;
- edge cases for stale or incompatible Search contexts.

Current finding:

- Phase 1 already solved the primary customer problem: a property opened from Search now has a bounded and explicit return path back to relevant Search context.
- Additional restoration may add customer value for heavier Search sessions, but the next increment risks URL, history-state, and selection complexity before enough evidence proves it is the highest-value next move.
- It should remain deferred unless production evidence shows repeated post-property return friction or incomplete Search context recovery.

## Wave 1B Closure Findings

Wave 1B closure would be reasonable only if the Search and property decision loop had no material customer-facing issue left inside the authorized DXT Wave 1B territory.

Closure is not recommended now because:

- A visible map visual-language problem remains active.
- The map is not peripheral; it is a primary Search decision surface.
- Prior DXT and requirements records already identify map styling as unresolved.
- Closing Wave 1B would defer a high-salience premium-experience gap into an undefined future track.

## Customer Impact Comparison

Map Visual-Language Normalization:

- Customer value: high.
- Enterprise leverage: high.
- Use frequency: high for Search-led sessions.
- Differentiation: high because the map determines whether REIE feels like a coherent decision platform or a conventional listings tool.
- Mobile impact: high because the map/list decision loop is central on small screens.
- Accessibility impact: medium to high; contrast and marker clarity require explicit handling.
- Trust impact: high; inconsistent basemap visuals can make the product feel less intentional even when data behavior is correct.

Property Detail Context Preservation Phase 2:

- Customer value: medium.
- Enterprise leverage: medium.
- Use frequency: medium to high for deep property-review sessions.
- Differentiation: medium; it improves continuity but does not address the most visible Search experience gap.
- Mobile impact: medium.
- Accessibility impact: medium.
- Trust impact: medium.

Wave 1B Closure:

- Customer value: low now.
- Enterprise leverage: medium only if it frees focus for a better track.
- Risk: closure would prematurely accept an unresolved premium-experience gap.

Another bounded Search/property phase:

- Customer value: unknown without inventing new evidence.
- Enterprise leverage: unknown.
- Risk: high risk of feature accumulation.

## Complexity And Risk Comparison

Map Visual-Language Normalization:

- Complexity: medium for specification; medium to high for future implementation depending on provider/tile outcome.
- Production risk: medium because map tiles, marker contrast, attribution, and browser rendering are customer-visible.
- Governance readiness: ready for specification; not ready for implementation.
- Evidence readiness: sufficient to justify specification; insufficient to authorize tile/provider change.
- Source-rights readiness: prerequisite for implementation.
- Reversibility: medium if implemented with contained styling and existing providers; lower if it requires provider replacement.

Property Detail Context Preservation Phase 2:

- Complexity: medium.
- Production risk: medium because it touches Search/property history and URL behavior.
- Governance readiness: specification exists, but incremental value is less urgent after Phase 1.
- Reversibility: medium.

Wave 1B Closure:

- Complexity: low.
- Production risk: low.
- Customer risk: medium because it leaves the map issue unplanned.

Another bounded Search/property phase:

- Complexity: unknown.
- Production risk: unknown.
- Governance readiness: not established.

## Diminishing-Returns Assessment

DXT Wave 1B has produced meaningful customer value:

- marker interactions are now click-first and stable;
- Search workspace hierarchy is more coherent;
- property return context is explicit and bounded.

Continuing to add deeper Search/property state mechanics now risks diminishing returns. However, map visual-language normalization is not merely polish. It is a first-impression and decision-confidence issue on a primary interactive surface. The next highest-value move is therefore to standardize and specify the Search map experience before closing Wave 1B or extending deeper property context preservation.

REIE should continue Wave 1B only through a bounded map visual-language specification and feasibility review. It should not begin broad Search redesign, provider replacement, property-context Phase 2, or Wave 2 work under this authorization.

## Recommended Next Outcome

Selected recommendation:

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_PRODUCT_SPECIFICATION`

Program name:

`REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION`

Customer or enterprise problem:

The Search map is functionally certified but visually inconsistent with the premium decision-platform experience REIE is trying to create. Customers should experience the map as calm, intentional, legible, and integrated with the Search decision loop, not as an externally styled or uneven technical embed.

Why now:

- Search marker/preview, workspace hierarchy, and Search return context have been certified.
- The remaining high-salience Search gap is visual-language coherence.
- Phase 2 property context work would be additive; map visual-language work addresses a foundational first-impression problem.
- Closure would leave a known map issue unresolved.

Why it outranks alternatives:

- It affects the main Search decision surface.
- It improves trust, perceived product quality, and wayfinding simultaneously.
- It can be planned without runtime changes.
- It establishes provider/licensing prerequisites before any risky implementation.
- It avoids premature feature accumulation in property context mechanics.

## Proposed Bounded Planning Scope

The next phase should produce an implementation-ready product specification and feasibility record for Search map visual-language normalization.

Include:

- desired Search map emotional state;
- map visual principles;
- tile/provider inventory;
- current production tile behavior at key zooms;
- official provider attribution and licensing verification;
- style-control feasibility;
- allowed and prohibited basemap treatments;
- marker, cluster, selected, hover, and focus-state visual standards;
- preview/drawer relationship to the map;
- mobile map/list visual hierarchy;
- accessibility and contrast requirements;
- no-overclaim public copy rules;
- deterministic check requirements;
- rollback criteria;
- exact first bounded implementation phase if feasible.

Exclude:

- implementation;
- route creation;
- provider replacement;
- tile-source change;
- token or environment change;
- Search API change;
- map-provider activation;
- persistence;
- telemetry;
- brokerage disclosure change.

## Likely Future File Scope

Likely specification-only files:

- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-MAP-VISUAL-LANGUAGE-NORMALIZATION-PRODUCT-SPECIFICATION.md`
- `docs/CHAT_START.md`

Likely future implementation files only if separately authorized after specification:

- `components/maps/SearchMap.tsx`
- `app/globals.css`
- possibly a focused deterministic check under `scripts/`
- `package.json` and `tsconfig.worker.json` only if a new check is registered
- implementation record under `docs/project-atlas/executive-library/`
- `docs/CHAT_START.md`

Files and behaviors requiring separate authorization:

- map provider configuration;
- tile-source URLs;
- environment variables;
- API routes;
- Search data behavior;
- route behavior;
- property pages;
- brokerage disclosure copy;
- telemetry or analytics;
- persistence.

## Provider, Licensing, Route, API, And Data Implications

Provider:

- Existing Search provider posture remains OpenTopoMap default with optional Mapbox outdoors overlay.
- No new provider is authorized.
- No provider replacement is authorized.
- Next specification must verify provider documentation before any style-control recommendation becomes implementation-ready.

Licensing and attribution:

- Existing attribution and licensing posture must be inventoried and preserved unless separately authorized.
- Any visual normalization that changes tile source, provider, overlay, attribution, or token usage requires explicit provider/licensing authorization.

Routes and APIs:

- No route change is justified by this review.
- `/search` remains the authorized surface.
- No Search API, property API, geocode API, or logistics API change is authorized.

Data:

- No new public intelligence claim is authorized.
- No new map data source is authorized.
- No persistence, telemetry, CRM, personalization, or hidden customer-state behavior is authorized.

## Acceptance And Certification Requirements

Future specification acceptance criteria:

- One exact map visual-language model is selected.
- Provider/tile constraints are explicitly verified or marked as blockers.
- Required attribution and source-rights posture is recorded.
- Basemap, marker, cluster, selected state, hover state, and focus state are specified.
- Mobile and desktop map hierarchy is specified.
- Accessibility contrast and non-color-only selection state are specified.
- No provider, route, API, persistence, telemetry, or brokerage-disclosure change is authorized by implication.

Future implementation certification requirements, if separately authorized:

- Search map remains contained within `/search`.
- No new route exists.
- Existing Search API behavior remains unchanged.
- Existing marker/preview and return-context certifications remain preserved.
- Tile behavior is stable at representative zoom levels.
- Attribution is visible or otherwise compliant with the selected provider model.
- Mobile, tablet, and desktop visual QA passes.
- Keyboard and list-equivalent selection paths remain accessible.
- No prohibited public claims or protected-boundary content appears.
- Regression checks pass for Search, map, property routes, buyer/seller journeys, market/neighborhood routes, sitemap, canonical, public trust, and source-rights readiness.

## Protected Boundaries

This review does not authorize:

- runtime implementation;
- map provider changes;
- tile-source changes;
- token or environment changes;
- route changes;
- API changes;
- Search behavior changes;
- property route changes;
- persistence;
- telemetry;
- CRM;
- personalization;
- brokerage disclosure changes;
- Contact, buyer, seller, financing, advisory, market, neighborhood, Grand Plan, Compare, navigation, footer, sitemap, canonical, Prisma, migration, worker, email, provider, AI, deployment configuration, or production-data changes.

## Deferred Or Rejected Candidates

`PROPERTY_DETAIL_CONTEXT_PRESERVATION_PHASE_2`

- Disposition: deferred.
- Reason: Phase 1 solved the primary return-context problem. Further restoration should wait for evidence that remaining friction is materially hurting the decision journey.
- Future eligibility: production evidence of repeated return-state confusion, incomplete result restoration, or high-value Search-to-property decision friction.

`WAVE_1B_CLOSURE_AND_TRANSITION`

- Disposition: rejected now.
- Reason: closure would leave the map visual-language problem unresolved.
- Future eligibility: after map visual-language specification is completed and either implemented/certified or formally deferred with clear provider/licensing blockers.

Another bounded Search/property phase:

- Disposition: rejected now.
- Reason: no repository-supported alternative has clearer value than the map issue.
- Future eligibility: concrete production evidence, repository defect, or governance record identifying a higher-value bounded Search/property problem.

## Open Questions

- Is `NEXT_PUBLIC_MAPBOX_TOKEN` configured in production for Search tile overlay behavior?
- Does the current OpenTopoMap plus optional Mapbox overlay satisfy provider attribution and usage obligations in all environments?
- Can the desired premium REIE visual language be achieved with existing providers and CSS treatment alone?
- Would exact color control require a provider/style change or a custom tile style?
- What provider documentation governs style modification, attribution, caching, and public display?
- Can visual normalization preserve Search map accessibility, marker contrast, and list-equivalent keyboard operation?
- Should non-Search map surfaces remain out of scope for the first map-normalization phase?

## Brokerage Disclosure Hold

Brokerage disclosure remains on hold:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

This review does not authorize any brokerage disclosure copy change, disclaimer update, attribution rewrite, or marketing claim.

## Validation

Required validation for this documentation-only review:

- exact repository baseline verification;
- latest deployment verification for `1e2bedda52d4c7357d89e74b60091cd6fb66fa24`;
- no superseding remote commit observed;
- documentation-only scope verification;
- complete diff review;
- all required candidates evaluated;
- map architecture inventoried from repository evidence;
- provider/licensing conclusions grounded in repository evidence and explicit unresolved prerequisites;
- exactly one outcome selected;
- implementation remains unauthorized;
- protected boundaries explicit;
- no runtime or generated drift;
- `git diff --check`;
- `git diff --cached --check`;
- `npm run typecheck`;
- `npm run lint`.

## Executive Review Certification

DXT Wave 1B should not close yet. The next best customer and enterprise step is a bounded Search map visual-language normalization product specification and feasibility review. This recommendation addresses the largest remaining Search decision-experience gap without authorizing implementation, provider changes, tile-source changes, route changes, API changes, persistence, telemetry, or brokerage disclosure changes.
