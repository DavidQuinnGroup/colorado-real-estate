# REIE DXT Wave 1B Map Visual-Language Normalization Product Specification

Date: August 2, 2026

Program: REIE Decision Experience Transformation (DXT 1.0)

Phase: Wave 1B - Map Visual-Language Normalization Product Specification

Authorization: Product specification and provider/licensing feasibility review only. Documentation only. Implementation, runtime changes, map-provider changes, tile-source changes, token or environment changes, route or API changes, persistence, telemetry, brokerage-disclosure changes, production certification, and next-phase execution are not authorized by this record.

## 1. Executive Product Decision

Status:

`REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_SPECIFICATION_READY`

Selected product model:

`CURRENT_PROVIDER_CONFIGURATION_NORMALIZATION`

Provider-authorization classification:

`READY_FOR_BOUNDED_IMPLEMENTATION`

Selected first bounded implementation phase:

`CURRENT_PROVIDER_STYLE_CONSTRAINT_REMEDIATION`

Exact next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Implementation may only proceed if separately authorized and must remain within the current provider architecture. Any provider replacement, tile-source change, token/environment change, Mapbox activation, attribution rewrite, route/API change, persistence, telemetry, or brokerage-disclosure change requires separate authorization.

## 2. Governing Product Question

How should the map help customers understand which homes and places deserve closer attention without visually competing with the decision?

The map should support property discovery. It should not become the dominant product, a GIS dashboard, or an ornamental backdrop.

## 3. Current Customer Problem

The customer problem is visual coherence, not Search functionality.

Customers may experience:

- inconsistent color treatment across map zoom levels;
- apparent visual switching during zoom;
- differing emphasis among land, roads, labels, terrain, and overlays;
- a map that can feel like an external utility rather than part of the REIE decision workspace;
- reduced confidence that Search is one coherent premium product.

The desired outcome is a calm, restrained, accessible, attribution-compliant Search map that feels visually consistent across supported zoom levels while keeping property markers and selected-property context dominant.

## 4. Map Architecture Inventory

Primary Search map files:

- `components/maps/SearchMap.tsx`
- `components/maps/MapInner.tsx`
- `components/maps/MapSidebar.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `components/search/SearchInterface.tsx`
- `app/search/page.tsx`
- `app/globals.css`

Current Search map implementation:

- `SearchMap.tsx` imports Leaflet directly from `leaflet` and imports `leaflet/dist/leaflet.css`.
- Map center defaults to `[40.0174, -105.276]`.
- Initial zoom is `12`.
- Minimum zoom is `8`.
- Maximum map zoom is `18`.
- Leaflet attribution control is currently disabled with `attributionControl: false`.
- Default tile layer is OpenTopoMap: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`.
- Default tile layer has `className: 'reie-saturday-topo-tiles'`.
- Default tile layer has `maxZoom: 17`.
- Optional Mapbox outdoors tile URL is built only when `NEXT_PUBLIC_MAPBOX_TOKEN` exists.
- Optional Mapbox URL pattern is `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=...`.
- Optional Mapbox overlay has `className: 'reie-mapbox-detail-tiles'`, `maxZoom: 18`, `opacity: 0.18`, and `tileSize: 256`.
- No layer-control UI exists.
- Marker layer uses a Leaflet layer group.
- Marker clustering is implemented in application code with `CLUSTER_GRID_SIZE = 86` and `CLUSTER_DISABLE_ZOOM = 15`.
- Property markers are Leaflet `divIcon` markers with a button using `data-testid="reie-search-map-marker-button"`.
- Selected and hovered marker states are generated through marker class modifiers.
- Cluster markers are Leaflet `divIcon` markers with a button using `luxury-cluster`.
- Selected-property preview is the certified click-pinned `SelectedPropertyDrawer`.
- Map resize handling uses `ResizeObserver` and `map.invalidateSize({ animate: false, pan: false })`.
- Map diagnostics are present as hidden or customer-safe status surfaces and are covered by existing deterministic checks.

Search shell relationship:

- `MapInner.tsx` filters private listings for public users, normalizes Search metadata, clears stale selected IDs, and passes selected/hovered state to `SearchMap`.
- `MapSidebar.tsx` owns list-side Search decision context, property cards, selection, hover synchronization, mapped-count language, completion guidance, and Save Search.
- `SelectedPropertyDrawer.tsx` owns the click-pinned preview, property detail link, inquiry link, market link, and bounded Search return handoff.
- `SearchInterface.tsx` preserves the Search shell, mobile List/Map mode, and `data-search-map-visual-normalization="deferred"`.

Global and scoped CSS:

- `SearchMap.tsx` contains scoped global styles for Leaflet container, zoom controls, tile classes, markers, clusters, selected state, hover state, and reduced motion.
- `app/globals.css` contains `.reie-map-canvas .leaflet-tile` reset rules that force `width: 256px`, `height: 256px`, `max-width: none`, `object-fit: fill`, and `filter: none`.
- `app/globals.css` also contains a legacy `.luxury-topo-tiles` filter and global marker/cluster styles.

Adjacent non-Search map surfaces:

- `components/PropertyMap.tsx` uses React Leaflet with CARTO dark tiles and public/contracted precision gating.
- `components/BoulderMarketMap.tsx` uses React Leaflet with OpenStreetMap tiles.
- `components/NeighborhoodOverlayMap.tsx` uses React Leaflet with OpenStreetMap tiles and polygon overlays.

Deterministic checks:

- `scripts/checkMapRenderingSafety.ts` verifies Search map tile geometry, avoids decorative basemap overlays, preserves resize invalidation, validates marker/preview behavior, and protects Search shell semantics.
- `scripts/checkDxtSearchWorkspaceShell.ts` currently asserts that Map Visual-Language Normalization remains deferred.
- `scripts/checkDxtSearchReturnContextHandoff.ts` currently asserts that Map Visual-Language Normalization remains deferred.

## 5. Production Behavior Inventory

Safe production observation was performed against `https://davidquinngroup.com/search` through a non-mutating Chrome DevTools Protocol session.

Verified facts:

- Production Search returned the expected page title: `Guided Colorado Property Search | David Quinn Group`.
- Desktop Search map canvas was present.
- Initial tile requests used only OpenTopoMap subdomains:
  - `a.tile.opentopomap.org`
  - `b.tile.opentopomap.org`
  - `c.tile.opentopomap.org`
- No Mapbox tile requests were observed during the production probe.
- No CARTO or OpenStreetMap standard tile requests were observed for the Search map during the production probe.
- Initial observed tile zoom was `12`.
- Public zoom-control interaction generated OpenTopoMap tile requests across observed zoom levels `10` through `17`.
- No production console events were observed during the probe.
- Marker and cluster DOM remained present during the probe.
- Observed tile images were native `256x256`.
- The effective tile image CSS sample reported `filter: none`, consistent with the global Leaflet tile reset.

Verified production inference:

- In the observed production environment, `NEXT_PUBLIC_MAPBOX_TOKEN` was not producing active Search map tile requests.
- The active production Search basemap behavior is OpenTopoMap raster tiles.
- The visually changing map character is therefore primarily explained by OpenTopoMap raster tile styling and density changes across zoom levels, combined with REIE application/CSS constraints that do not currently impose a coherent effective visual standard on those loaded tile images.

Unverified hypotheses:

- A different environment with `NEXT_PUBLIC_MAPBOX_TOKEN` active may add the Mapbox outdoors overlay.
- Browser/device rendering may slightly affect perceived color and contrast.
- Exact provider-side tile update cadence or server-side fallback behavior was not verified beyond the observed production session.

## 6. Root-Cause Finding

Selected classification:

`COMBINED_CAUSE`

Evidence:

- Repository code configures OpenTopoMap raster tiles as the default Search map basemap.
- Production observation verified OpenTopoMap tile requests only.
- Repository code configures an optional Mapbox outdoors overlay when `NEXT_PUBLIC_MAPBOX_TOKEN` exists, but production observation did not show active Mapbox tile requests.
- Repository code sets OpenTopoMap layer `maxZoom: 17` while the map allows `maxZoom: 18`.
- Existing application styling defines tile classes and filters, but production tile samples report effective `filter: none`.
- Global Leaflet tile reset deliberately protects native tile geometry and disables tile distortion.

Conclusion:

The proven production root cause is not active provider switching. It is a combined product/technical cause: provider-controlled OpenTopoMap raster zoom styling plus application-level styling constraints that currently do not produce a consistent REIE visual language on the actual loaded tile images.

Implementation is not blocked by unknown root cause if the first phase remains within current provider configuration. Implementation is blocked for any provider, tile-source, token, environment, or attribution change unless separately authorized.

## 7. Provider And Tile Findings

OpenTopoMap:

- Configured in `components/maps/SearchMap.tsx`.
- Activates by default.
- Verified active in production Search.
- Tile type: raster PNG.
- Styling control available to REIE: limited to client-side presentation around the raster tile, not provider-side cartographic styling.
- Attribution obligations: OpenTopoMap official usage text requires visible credit for OpenStreetMap contributors, SRTM, and OpenTopoMap map presentation under CC-BY-SA.
- Token requirement: none observed in repository.
- Usage consideration: OpenTopoMap official FAQ says web/app embedding is permitted if server load is not excessive and no availability guarantee is provided.
- Visual consistency implication: provider-controlled raster styling changes by zoom; exact water, road, terrain, and label colors are not reliably controllable from REIE code.

Mapbox Outdoors:

- Configured conditionally in `components/maps/SearchMap.tsx`.
- Activates only when `NEXT_PUBLIC_MAPBOX_TOKEN` is available to the client bundle.
- Not observed active in production Search.
- Tile type: raster tiles requested from a Mapbox style endpoint.
- Styling control available to REIE: limited if using Mapbox-owned `mapbox/outdoors-v12`; broader style control would require a custom Mapbox style and separate authorization.
- Attribution obligations: Mapbox documentation requires logo and text attribution for maps using Mapbox styles, data, or software.
- Token requirement: Mapbox access token with appropriate public scopes.
- Usage/pricing implication: account/token/pricing posture is not established by repository evidence and must not be inferred.
- Visual consistency implication: enabling the overlay without a full attribution/token/provider decision could change production appearance and obligations.

Leaflet:

- Provides tile-layer loading, marker rendering, zoom controls, attribution control, and map state.
- Leaflet official documentation states tile layers load URL templates and that most tile servers require attribution.
- Leaflet does not by itself normalize provider cartography; it renders provider tiles and application overlays.

Fallback provider:

- No Search-specific fallback provider is implemented for map tiles.
- The fallback state is a visual/availability state, not a provider chain.
- Adjacent maps use separate providers and should not be treated as Search fallback.

Adjacent non-Search maps:

- `PropertyMap.tsx`: CARTO dark basemap, separate property precision model.
- `BoulderMarketMap.tsx`: OpenStreetMap standard tiles.
- `NeighborhoodOverlayMap.tsx`: OpenStreetMap standard tiles.
- These surfaces are later reuse candidates only; they are not included in the first Search map normalization phase.

## 8. Attribution And Licensing Findings

OpenTopoMap:

- Official OpenTopoMap usage text states the online map is CC-BY-SA and gives a required visible license text including OpenStreetMap contributors, SRTM, and OpenTopoMap.
- The Search map currently disables Leaflet attribution control, so future implementation must verify and correct visible attribution if the current Search surface lacks compliant provider attribution.
- This is an implementation requirement, not authorization to change attribution under this specification.

OpenStreetMap:

- OpenStreetMap copyright guidance requires attribution when using OSM data.
- OSM tile usage policy requires visible license attribution and says attribution must not be hidden behind UI, toggles, or off-screen.
- OSM standard tile policy is directly scoped to `tile.openstreetmap.org`, but OSM attribution remains relevant where OSM data underlies providers.

Mapbox:

- Mapbox documentation requires both logo and text attribution for Mapbox map styles or data, including classic styles such as Mapbox Outdoors.
- If Mapbox is activated or standardized later, attribution must include the Mapbox requirements and any required OpenStreetMap links.
- Client-side Mapbox tokens may be public tokens, but secret scopes must not be exposed.

Repository/source-rights implication:

- Current Search implementation has attribution control disabled.
- Any implementation must explicitly certify attribution visibility, mobile readability, link behavior, and provider-specific obligations.
- Exact provider legal compliance remains a certification item for implementation and production review.

## 9. Official-Source Verification

Access date for official sources: August 2, 2026.

| Source | Finding | Architectural implication | Blocking? |
| --- | --- | --- | --- |
| OpenTopoMap official About/Usage page, `https://opentopomap.org/about` | OpenTopoMap identifies itself as a topographic map generated from OpenStreetMap and SRTM data; it provides the `https://{a|b|c}.tile.opentopomap.org/{z}/{x}/{y}.png` tile path; usage text requires visible credit for OpenStreetMap contributors, SRTM, and OpenTopoMap under CC-BY-SA; no availability guarantee is stated. | Current Search production provider and repository tile URL match OpenTopoMap. Future implementation must preserve or restore visible attribution and cannot assume SLA-backed availability. | Blocks provider/tile changes; does not block current-provider normalization. |
| OpenStreetMap Tile Usage Policy, `https://operations.osmfoundation.org/policies/tiles/` | OSMF tile servers require visible attribution, valid browser referrer posture, normal caching, no bulk download or prefetch, and no hiding attribution. | Direct use of OSM standard tiles is not the Search map model, but OSM-derived attribution and anti-prefetch principles should inform REIE map behavior. | Not blocking for current OpenTopoMap-only normalization; blocking for any direct OSM standard tile switch without review. |
| OpenStreetMap Copyright and License, `https://www.openstreetmap.org/copyright` | OSM data is ODbL; users must credit OpenStreetMap and make license availability clear. | Any OSM-derived provider must retain accurate attribution and avoid implying REIE owns map data. | Not blocking; attribution must be certified. |
| Mapbox Attribution, `https://docs.mapbox.com/help/dive-deeper/attribution/` | Maps using Mapbox map designs, data, or software usually require Mapbox logo and text attribution; classic styles including Mapbox Outdoors require both logo and text attribution. | Current optional Mapbox overlay cannot be standardized or activated without attribution and token posture review. | Blocks Mapbox standardization unless separately authorized and certified. |
| Mapbox Access Tokens and Token Management, `https://docs.mapbox.com/help/dive-deeper/access-tokens/` and `https://docs.mapbox.com/accounts/guides/tokens/` | Public tokens are intended for client-side applications and should be least-privilege; secret tokens are server-side and must not be exposed; public scopes such as style tile access may be required for raster style tiles. | `NEXT_PUBLIC_MAPBOX_TOKEN` must remain public-token only if used client-side; no token change is authorized here. | Blocks token/environment changes. |
| Leaflet Reference, `https://leafletjs.com/reference.html#tilelayer` | `L.tileLayer` loads URL-template tile layers; tile servers often require attribution; `maxZoom`, `minZoom`, `className`, and attribution options govern layer behavior; Leaflet attribution control can display layer attribution. | Current Search uses valid Leaflet tile-layer architecture but disables attribution control and relies on application CSS for visual treatment. | Not blocking; informs bounded implementation. |

## 10. Visual-Language Principles

The REIE Search map must be:

- calm;
- premium;
- restrained;
- readable;
- decision-led;
- consistent across supported zoom levels;
- lower visual priority than selected properties and decision controls;
- clear enough for geographic orientation;
- accessible;
- attribution-compliant;
- mobile-readable;
- not ornamental;
- not a GIS analysis dashboard.

The map should invite attention to homes and places that deserve comparison. It should not compete with the selected property, pinned preview, or Search decision controls.

## 11. Base-Map Visual Standard

Land:

- Quiet, low-saturation, consistent across zoom.
- Should not become bright, muddy, or overly textured.

Water:

- Calm, recognizable, subordinate to markers.
- Exact REIE blue should not be specified unless provider/style control supports it.

Primary roads:

- Legible but not visually dominant.
- Should not overpower property markers.

Secondary roads:

- Visible at appropriate zooms, lower priority than primary roads.

Highways:

- Clearly readable for orientation, but not bright enough to pull attention from listings.

Parks and open space:

- Helpful context, subdued contrast.
- Should not create a one-note green map or obscure markers.

Terrain:

- Useful for Boulder-area geography but should remain quiet.
- Provider topographic density may increase by zoom; this is acceptable only if the tone remains coherent.

City and neighborhood labels:

- Readable when present.
- Provider-controlled label density may change with zoom, but the change must not resemble a full theme switch.

Boundaries:

- Subordinate unless they directly aid orientation.

Points of interest:

- Low priority; should not distract from homes, clusters, and selected preview.

Transit where present:

- Subordinate and contextual only.

Background contrast:

- Enough contrast to distinguish roads, water, terrain, and markers without becoming harsh.

Attribution region:

- Visible, readable, unobstructed, and not hidden behind controls or previews.

## 12. Marker And Cluster Standard

Default property marker:

- Clear and readable against terrain, roads, and labels.
- Premium but compact.
- Price text must remain legible.

Hovered marker:

- Supplemental state only.
- May elevate visually, but must not be required for preview access.

Selected marker:

- Dominant marker state.
- Must remain visually distinct without color alone.
- Must preserve the existing selected state ring/inset or an equivalent non-color cue.

Unavailable or stale marker:

- Should fail quiet, not imply a listing recommendation or defect in the property.
- Must not introduce scary or warning-heavy language without evidence.

Cluster:

- Readable count.
- Clearly separate from individual markers.
- Should not resemble a score, ranking, or approval indicator.

Listing-card highlight:

- Must remain synchronized with selected/hovered map state where currently certified.

Pinned preview:

- Remains the primary selected-property context.
- Must sit above map background and not compete with attribution.

Map background:

- Always lower priority than markers, clusters, preview, and Search controls.

## 13. Zoom-Consistency Standard

Must remain consistent while zooming:

- provider identity;
- overall visual tone;
- land/water relationship;
- road hierarchy;
- marker identity;
- selected-marker identity;
- cluster language;
- label readability standard;
- preview relationship;
- attribution presence;
- loading behavior.

May change appropriately while zooming:

- label density;
- road detail;
- terrain detail;
- cluster expansion;
- marker count;
- geographic context.

Rule:

Provider-controlled detail changes are acceptable. Apparent product-theme switching is not.

## 14. Desktop Experience

At approximately `1440x1100`:

- Search list and map should feel like one workspace.
- Map contrast should be restrained enough that cards and selected preview remain dominant.
- Markers should be immediately recognizable and readable.
- Selected preview should be visually senior to the basemap.
- Road and label density should orient rather than dominate.
- Attribution should be visible without interfering with markers or preview.
- Zoom controls should remain subdued, accessible, and bottom-right unless implementation proves a better compliant placement.
- Loading and tile fallback should feel intentional, not broken.
- The map must not look like a GIS console, dashboard, scorecard, or utility embed.

## 15. Tablet Experience

At approximately `768x1024`:

- Map readability should survive reduced width.
- Marker and cluster touch targets should remain usable.
- Preview relationship should remain clear and not obscure attribution.
- Zoom controls should remain reachable and not crowded.
- Labels should remain legible enough for orientation, not dense enough to compete with markers.
- No visual crowding should appear between map guide, controls, markers, preview, and attribution.

## 16. Mobile Experience

At approximately `390x844`:

- Map mode should feel like a focused decision view, not a compressed desktop map.
- Map contrast should be quiet enough to let markers and preview lead.
- Marker size and separation should support touch.
- Cluster count must be readable.
- Selected-marker treatment must remain non-color-only.
- The selected preview/drawer should clearly relate to the selected marker and list.
- List/Map toggle should remain the primary mode switch.
- Zoom controls should remain usable without becoming a dominant action.
- Attribution must remain visible and readable.
- Thumb reach and touch targets should remain stable.
- Label density should orient but not crowd.
- The map must not visually compete with the pinned property preview.

## 17. Accessibility Requirements

Future implementation must preserve or improve:

- text and control contrast;
- marker and cluster contrast;
- non-color-only selected state;
- visible focus;
- keyboard-equivalent listing path;
- readable attribution;
- stable touch targets;
- reduced-motion compatibility;
- no rapid or disorienting style changes during zoom;
- no essential meaning conveyed only by base-map color;
- map-unavailable fallback;
- no color-only status communication;
- no score, ranking, suitability, desirability, school, safety, or protected-class implication.

## 18. Attribution Standard

Future implementation must:

- show required provider attribution;
- show OpenStreetMap attribution where provider/data usage requires it;
- show OpenTopoMap attribution while OpenTopoMap tiles remain active;
- show Mapbox logo/text attribution if Mapbox styles, data, or software are active;
- keep attribution visible on desktop, tablet, and mobile;
- avoid hiding attribution behind UI, off-screen, or under previews;
- preserve link behavior where required;
- avoid minimizing attribution beyond provider terms;
- certify attribution through deterministic and browser checks.

This specification does not authorize attribution changes. It defines attribution as a mandatory implementation and certification requirement.

## 19. Provider Options Evaluated

| Option | Evaluation | Classification |
| --- | --- | --- |
| A. `CURRENT_PROVIDER_CONFIGURATION_NORMALIZATION` | Use existing OpenTopoMap default posture; normalize effective layer/CSS behavior, marker/cluster hierarchy, loading/fallback, and attribution visibility without changing provider/tile source. Best bounded match to current production evidence. | `SELECTED` |
| B. `SINGLE_EXISTING_PROVIDER_ENFORCEMENT` | Could enforce OpenTopoMap-only behavior across environments and remove environment-dependent overlay behavior, but disabling configured Mapbox behavior may still be a runtime/provider posture decision requiring careful implementation authorization. | `DEFERRED_WITHIN_SELECTED_SCOPE` |
| C. `CURRENT_MAPBOX_STYLE_STANDARDIZATION` | Not selected because Mapbox was not observed active in production and would require token, attribution, and licensing proof. | `READY_WITH_SEPARATE_PROVIDER_AUTHORIZATION` |
| D. `NEW_CUSTOM_MAPBOX_STYLE` | Could improve style control, but requires separate provider/style/token/licensing/account/cost authorization. | `BLOCKED_BY_PROVIDER_OR_LICENSING` |
| E. `ALTERNATE_PROVIDER_OR_CUSTOM_TILE_STACK` | Too broad for Wave 1B bounded remediation; requires strategic, licensing, technical, cost, and operational authorization. | `BLOCKED_BY_PROVIDER_OR_LICENSING` |
| F. `MARKER_AND_CLUSTER_ONLY_NORMALIZATION` | Useful but insufficient because the verified production issue is also basemap visual character and attribution posture. | `REJECTED_AS_INCOMPLETE` |
| G. Another repository-supported model | No repository-supported model outranks current-provider normalization. | `REJECTED_NOW` |

## 20. Selected Product Model

Selected model:

`CURRENT_PROVIDER_CONFIGURATION_NORMALIZATION`

Definition:

Normalize the Search map visual language using the current provider architecture. The first implementation should focus on the effective OpenTopoMap production path, layer/CSS constraints, marker/cluster hierarchy, loading/fallback presentation, and attribution posture without changing provider, tile source, token, environment, route, API, persistence, telemetry, or brokerage disclosure.

Primary product goal:

Make the Search map feel like one calm REIE decision workspace across zoom levels while preserving functional Search certifications.

## 21. Provider-Authorization Classification

Classification:

`READY_FOR_BOUNDED_IMPLEMENTATION`

Conditions:

- Implementation must use current provider architecture.
- No provider replacement is authorized.
- No tile-source change is authorized.
- No Mapbox activation or standardization is authorized.
- No token/environment change is authorized.
- Any attribution visibility correction must remain limited to accurately reflecting already active provider obligations.
- If implementation discovers that provider change is required to achieve the desired visual language, implementation must stop and return to a separate provider authorization gate.

## 22. Non-Search Map Scope

`components/PropertyMap.tsx`

- Classification: `LATER_REUSE_CANDIDATE`
- Reason: separate CARTO dark provider and property precision model. Do not include in first phase.

`components/BoulderMarketMap.tsx`

- Classification: `LATER_REUSE_CANDIDATE`
- Reason: separate OpenStreetMap market map surface. Do not include unless future Product Experience standardization authorizes reuse.

`components/NeighborhoodOverlayMap.tsx`

- Classification: `LATER_REUSE_CANDIDATE`
- Reason: polygon-overlay behavior is separate from Search property discovery. Do not include in first phase.

Any new shared map utility:

- Classification: `CONDITIONAL`
- Reason: only justified if required to keep Search implementation contained and deterministic.

All non-Search map visual changes:

- Classification: `REQUIRES_SEPARATE_CERTIFICATION`

## 23. Performance Requirements

Future implementation must preserve:

- no material regression in map loading;
- no unnecessary duplicate tile requests;
- no provider switching during interaction;
- no excessive CSS filtering cost;
- no marker-rendering regression;
- no mobile memory regression;
- graceful provider/tile failure;
- preserved map-unavailable fallback;
- no bulk prefetching;
- no background scanning across zoom levels;
- no new telemetry or analytics.

## 24. Public Trust And Source-Rights Boundaries

Future implementation must:

- accurately name providers only where public-facing naming is required;
- preserve accurate attribution;
- avoid claiming REIE owns provider map data;
- avoid hidden provider switching;
- avoid unsupported completeness claims;
- avoid source-right overclaims;
- avoid token exposure beyond public client-token patterns already authorized;
- preserve provider/public-display restrictions;
- avoid school, safety, ranking, demographic, suitability, or desirability claims.

## 25. Route, API, Data, And Persistence Boundaries

Preserve:

- `/search`;
- `/properties/[id]`;
- Search APIs;
- Search ranking;
- property data;
- canonical and sitemap behavior;
- Search return context;
- marker/preview interaction;
- selected-property drawer;
- mobile List/Map mode;
- brokerage disclosure hold.

Do not authorize:

- new route;
- route alias;
- route redirect;
- API change;
- ranking change;
- Prisma change;
- persistence;
- telemetry;
- CRM;
- personalization;
- new property claim;
- new geographic claim;
- production-data change.

## 26. State Model

| State | Visible customer state | Map visual treatment | Primary action | Fallback | Trust boundary |
| --- | --- | --- | --- | --- | --- |
| Normal map load | Calm Search map with visible markers/clusters | Current provider, normalized tone | Select marker or use list | List remains usable | No completeness claim |
| Tile loading | Map area may fill progressively | Neutral loading posture, no alarming state | Continue browsing list | Keep map controls stable | No provider blame copy |
| Delayed tiles | Some tiles arrive slowly | Quiet unavailable/loading treatment | Continue with list/cards | Map-unavailable fallback if material | Do not imply property defect |
| Provider unavailable | Map cannot load tiles | Clear, restrained map-unavailable state | Use list results | Retry by normal browser reload | No unsupported outage promise |
| Token unavailable | Mapbox overlay absent if token missing | OpenTopoMap path remains coherent | Use map normally | No Mapbox-dependent UI | Do not reveal token details |
| Fallback active | If future fallback is authorized | Must be visually disclosed only if customer-impacting | Continue Search | Return to list | No hidden provider switching |
| Zoom transition | Detail changes as user zooms | Tone, marker identity, and attribution stay stable | Continue zooming/selecting | Preserve list | No theme-switch feeling |
| Marker clustering | Groups combine at broader zooms | Cluster count readable and subordinate | Select cluster or zoom | List remains available | No score/ranking implication |
| Marker expansion | Individual markers appear at closer zooms | Same marker identity | Select property | List remains available | No recommendation implication |
| Property selected | Selected marker and pinned preview dominate | Basemap recedes | View property or close preview | List card path | No suitability conclusion |
| Preview open | Pinned selected-property drawer visible | Map remains supporting context | View Property / inquiry path | Close preview | Preserve Search return context |
| Map unavailable | Map surface fails safely | Clear low-drama fallback | Use list Search | Refresh or adjust Search | No provider/source overclaim |
| Attribution unavailable/incomplete | Must be treated as certification failure | Do not hide map obligations | Stop certification | Fix only with authorization | Provider compliance required |
| Mobile map mode | Full map mode with clear controls | Low visual competition | Select marker or switch to list | List mode | Attribution visible |
| List mode return | Customer returns to list | Selected/list state preserved where certified | Continue comparison | Search controls | No hidden persistence |

## 27. Acceptance Criteria

Future implementation must demonstrate:

- one coherent visual map language across supported zoom levels;
- no unintended provider or theme switching;
- active production provider behavior remains known and certified;
- selected markers remain dominant;
- cluster and marker states remain accessible;
- list/map and preview interaction certifications remain intact;
- attribution remains compliant and visible;
- mobile readability passes;
- no provider, token, licensing, route, API, persistence, telemetry, CRM, or brokerage change occurs outside explicit authorization;
- no performance regression;
- graceful provider failure;
- Search/property regressions pass;
- no unsafe public trust, source-rights, fair-housing, suitability, or ranking claim appears.

## 28. Deterministic Validation Strategy

Future deterministic checks should verify:

- selected provider/layer contract;
- no unauthorized tile source;
- no zoom-dependent provider switching;
- attribution presence;
- marker and cluster state contract;
- selected-state accessibility;
- preserved click-pinned preview;
- preserved Search shell;
- preserved return context;
- no route/API/ranking/persistence/telemetry change;
- provider token not exposed in documentation or logs;
- brokerage hold remains;
- protected claims remain absent;
- Mapbox is not activated unless separately authorized;
- OpenTopoMap attribution obligations are represented if OpenTopoMap remains active.

Candidate focused check:

`check:dxt-map-visual-language-normalization`

This check is not authorized by this specification. It is a likely future implementation validation artifact only if separately authorized.

## 29. Visual And Interaction Certification Plan

Future certification should review:

- `390x844`
- `768x1024`
- `1440x1100`

Representative zoom levels:

- close property-level zoom;
- neighborhood-level zoom;
- city-level zoom;
- broader regional zoom.

Verify:

- visual continuity;
- labels;
- roads;
- land;
- water;
- terrain;
- clusters;
- markers;
- selected marker;
- pinned preview;
- attribution;
- controls;
- loading;
- fallback;
- no console errors;
- no excessive tile failures;
- no interaction regression;
- no provider switch;
- no Search return-context regression;
- no mobile List/Map regression.

## 30. Likely Implementation File Scope

Required if implementation is separately authorized:

- `components/maps/SearchMap.tsx`
- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-MAP-VISUAL-LANGUAGE-NORMALIZATION-IMPLEMENTATION.md`
- `docs/CHAT_START.md`

Conditional:

- `app/globals.css`
- a narrow map tile/provider utility if it reduces risk
- marker/cluster presentation extraction only if containment improves
- focused deterministic check under `scripts/`
- `package.json` and `tsconfig.worker.json` only if registering a check

Prohibited unless separately authorized:

- route files;
- API routes;
- Prisma;
- migrations;
- Search ranking/data files;
- provider configuration;
- environment files;
- token settings;
- deployment configuration;
- telemetry/analytics;
- CRM;
- brokerage disclosure files;
- non-Search map surfaces.

## 31. Protected Boundaries

Do not:

- implement during this specification phase;
- change runtime code;
- change CSS;
- change routes;
- change APIs;
- change Search ranking;
- change provider or tile source;
- change token or environment behavior;
- activate Mapbox;
- add provider account behavior;
- add persistence;
- add telemetry;
- add CRM;
- add personalization;
- change brokerage disclosure;
- change sitemap/canonical behavior;
- change property pages;
- change non-Search maps;
- mutate production data;
- manually deploy;
- begin another DXT phase.

## 32. Deferred Work

Deferred:

- Mapbox style standardization.
- Custom Mapbox style.
- Alternate provider or custom tile stack.
- Non-Search map standardization.
- Property Detail Context Preservation Phase 2.
- Wave 1B closure.
- Brokerage disclosure changes.
- Full map provider strategy.
- GIS/LDI/public geographic intelligence expansion.

## 33. Open Questions

- Does the current production Search surface display sufficient visible OpenTopoMap/OSM/SRTM attribution, given `attributionControl: false`?
- Should implementation remove, keep, or explicitly fail closed around optional Mapbox overlay code if production does not use it?
- Can effective visual tone be normalized without CSS filters on individual tile images?
- Should the map `maxZoom` be aligned with OpenTopoMap `maxZoom: 17`, or should zoom `18` remain available with a clearly stable visual fallback?
- How should attribution be placed so it remains visible with the selected-property drawer on mobile?
- Should future non-Search maps inherit Search map standards after Search certification?

## 34. Selected First Bounded Implementation Phase Or Prerequisite

Selected first bounded implementation phase:

`CURRENT_PROVIDER_STYLE_CONSTRAINT_REMEDIATION`

Scope:

- Use current Search map provider architecture.
- Preserve OpenTopoMap as the active production Search provider unless separate authorization changes that.
- Normalize effective visual tone and hierarchy without provider/tile/token changes.
- Correct or restore required attribution visibility if current Search attribution is incomplete, limited to already active provider obligations.
- Preserve marker/cluster/selected-preview/Search-return certifications.
- Preserve mobile List/Map behavior.
- Add deterministic checks only if separately authorized.

Stop condition for future implementation:

If the desired REIE visual language requires provider replacement, custom Mapbox style, token/environment change, attribution rewrite beyond active-provider obligations, or a tile-source change, implementation must stop and seek separate provider authorization.

## 35. Exact Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_NORMALIZATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

That gate may authorize bounded implementation only if explicitly granted. It must not automatically authorize provider changes, tile-source changes, token/environment changes, Mapbox activation, route/API changes, persistence, telemetry, brokerage-disclosure changes, production certification, Wave 1B closure, or another DXT phase.
