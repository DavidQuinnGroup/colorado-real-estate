# REIE DXT Wave 1B Current Provider Style Constraint Remediation Implementation

Date: August 2, 2026

Program: REIE Decision Experience Transformation (DXT 1.0)

Phase: Wave 1B - Map Visual-Language Normalization / Current Provider Style Constraint Remediation

Status: READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_LOCAL_CERTIFICATION_AND_PUSH_REVIEW

## Baseline

Implementation began from the authorized repository baseline:

- Branch: `main`
- HEAD: `4fb474c514cee0307fc6dba78ab9d6890cfa31af`
- origin/main: `4fb474c514cee0307fc6dba78ab9d6890cfa31af`
- Ahead/behind: `0 ahead / 0 behind`
- Working tree: clean
- Baseline message: `Specify REIE map visual language`

Prior deployment verification for the baseline:

- Status: `success`
- GitHub/Vercel status ID: `51510970808`
- Context: `Vercel`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/CK4pipGTLDvHziffzBRs279SfAXc`
- Updated: `2026-08-02T19:11:43Z`
- Supersession status at implementation start: not superseded

## Authorized Scope

The authorization permitted bounded implementation inside the existing Search map experience only.

Authorized runtime scope used:

- `components/maps/SearchMap.tsx`
- `app/globals.css`

Authorized validation and documentation scope used:

- `scripts/checkDxtMapVisualLanguageNormalization.ts`
- `package.json`
- `tsconfig.worker.json`
- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-CURRENT-PROVIDER-STYLE-CONSTRAINT-REMEDIATION-IMPLEMENTATION.md`
- `docs/CHAT_START.md`

No runtime route, Search API, provider, tile-source, token, environment, persistence, telemetry, CRM, brokerage disclosure, or non-Search map change was authorized or implemented.

## Customer Problem And Root Cause

The certified Search workspace still exposed a customer-experience gap: the map was the dominant visual decision surface, but the current OpenTopoMap raster presentation did not feel fully aligned with the restrained REIE decision experience. The issue was not a broken map. It was a style-constraint problem: provider-controlled raster imagery, existing tile zoom behavior, and local presentation rules created a visual surface that could feel busier than the surrounding Search decision workspace.

The root cause remained the one established in the product specification: current-provider OpenTopoMap styling plus application-level presentation constraints, not a need for a provider replacement.

## Implementation Summary

The implementation normalized the existing Search map without replacing the provider or changing tile sources.

Implemented changes:

- kept OpenTopoMap as the active Search map provider;
- preserved the existing OpenTopoMap tile URL;
- made the optional Mapbox overlay fail closed by default before reading a public token;
- aligned Search map zoom limits to the OpenTopoMap native maximum of `17`;
- added explicit active-provider, tile URL, maximum zoom, and tile-status data attributes for deterministic certification;
- moved the primary Search basemap treatment to the Leaflet tile pane so raster tiles receive a consistent visual presentation;
- limited the global tile-reset override so it does not remove the authorized Search basemap treatment;
- preserved readable OpenTopoMap attribution;
- added customer-safe tile loading and unavailable messaging;
- refined marker, cluster, and selected-property hierarchy without adding scores, rankings, recommendations, or new decision claims.

## Active Provider And Tile Behavior

The active Search map provider remains OpenTopoMap:

- Active tile URL: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`
- Active provider attribute: `data-search-map-provider="opentopomap"`
- Active tile URL attribute: `data-search-map-tile-url`
- Active maximum zoom attribute: `data-search-map-max-zoom="17"`

Observed local production browser verification confirmed tile requests only to:

- `a.tile.opentopomap.org`
- `b.tile.opentopomap.org`
- `c.tile.opentopomap.org`

No Mapbox tile request was observed in the local production review.

## Provider-Selection Behavior

Provider-selection behavior remains conservative:

- OpenTopoMap is the active provider.
- The optional Mapbox overlay helper remains present only as previously bounded architecture.
- `OPTIONAL_MAPBOX_OVERLAY_ENABLED` is set to `false`.
- The optional Mapbox helper returns `null` before reading `NEXT_PUBLIC_MAPBOX_TOKEN`.
- No Mapbox activation, token requirement, environment change, provider replacement, tile-source change, or layer selector was introduced.

This preserves a future separately governed provider path without changing current public provider behavior.

## Base-Map Normalization

Base-map normalization was implemented as presentation treatment over the active Search basemap, not as a provider replacement.

The Search map canvas now uses a restrained background behind the tile pane, and the active Leaflet tile pane applies the bounded visual treatment:

- saturation reduction;
- contrast softening;
- brightness restraint;
- slight sepia warmth;
- stable opacity.

The treatment is intentionally modest. It reduces visual noise while preserving legibility, map utility, provider attribution, and the current OpenTopoMap identity.

## CSS Filter Or Presentation Treatment

The primary applied presentation rule is scoped to the Search map tile pane:

`filter: saturate(0.74) contrast(0.9) brightness(0.96) sepia(0.04);`

`opacity: 0.96;`

Global map tile reset behavior was narrowed so it no longer strips the authorized Search basemap class:

`.reie-map-canvas .leaflet-tile:not(.reie-search-basemap-tile)`

The implementation does not use inversion, hue rotation, grayscale conversion, decorative overlays, provider masking, or attribution-hiding techniques.

## Zoom-Constraint Alignment

The Search map now uses explicit zoom constants:

- Minimum zoom: `8`
- Initial zoom: `12`
- Maximum zoom: `17`
- OpenTopoMap `maxNativeZoom`: `17`

Cluster fit and single-listing view transitions clamp to the authorized maximum zoom. This prevents the Search map from asking the current provider for unsupported raster detail and keeps the visual presentation stable across user zoom behavior.

## Marker And Cluster Normalization

Marker and cluster styling was lightly normalized to better fit the Search workspace:

- marker background remains legible over varied map terrain;
- marker shadows and selected state were restrained but strengthened for priority;
- cluster styling remains clear without becoming a dashboard or scoring system;
- hover, selected, and keyboard/click behavior remain intact.

No recommendation, ranking, score, grade, approval, suitability, affordability, school, safety, or demographic language was introduced.

## Selected-Property Visual Priority

Selected-property priority remains centered on the existing marker and preview model:

- selected markers retain clear visual priority;
- selected marker `aria-pressed` behavior remains available;
- selected property preview/drawer behavior remains intact;
- property detail links preserve Search return context.

The implementation did not add a new panel, overlay, route, or property-detail context feature.

## Map Control Treatment

Existing map controls were preserved:

- Leaflet zoom controls remain available.
- No layer selector was added.
- No Search-this-area control was added.
- No provider toggle was added.
- No route or map-mode architecture changed.

Attribution controls are enabled and styled for readability rather than hidden.

## Loading And Fallback Treatment

The map now tracks active tile loading state in component memory:

- `initial`
- `loading`
- `delayed`
- `ready`
- `unavailable`

When tiles are delayed or unavailable, the Search map displays concise customer-safe messaging:

- delayed: `Map detail is still loading. The list and selected property remain available.`
- unavailable: `Map tiles are not fully available. The list remains ready for comparing homes.`

The fallback is informational only. It does not create persistence, telemetry, provider calls, retry infrastructure, or a new decision conclusion.

## Attribution Preservation

OpenTopoMap attribution remains present and readable. The attribution includes:

- OpenStreetMap contributors;
- SRTM;
- OpenTopoMap;
- CC-BY-SA reference.

Attribution control remains enabled on the Leaflet map and is visually constrained for mobile and desktop readability.

## Desktop Implementation

Local production review at approximately `1440x1100` confirmed:

- OpenTopoMap provider attributes were present;
- active tile requests used only OpenTopoMap hosts;
- Mapbox request count was `0`;
- attribution was visible;
- markers and clusters rendered;
- selected property behavior remained intact;
- no horizontal overflow was observed;
- no clean-load console errors were observed.

## Tablet Implementation

Local production review at approximately `768x1024` confirmed:

- Search map layout remained bounded;
- OpenTopoMap tile requests remained provider-consistent;
- attribution remained visible;
- markers and clusters rendered;
- selected marker and drawer behavior remained intact;
- no horizontal overflow was observed;
- no clean-load console errors were observed.

## Mobile Implementation

Local production review at approximately `390x844` confirmed:

- the mobile Search map toggle opened the map surface correctly;
- the map used a single bounded visual surface;
- OpenTopoMap provider attributes were present;
- attribution remained visible;
- markers and clusters rendered;
- selected marker and drawer behavior remained intact;
- no horizontal overflow was observed;
- no clean-load console errors were observed.

## Accessibility Implementation

Accessibility posture was preserved or improved through:

- continued keyboard-operable marker controls;
- preserved selected marker `aria-pressed` state;
- accessible tile fallback status via `aria-live="polite"`;
- preserved map control accessibility;
- readable attribution links;
- no color-only status communication for tile fallback;
- no new hidden form, saved state, or context transfer.

## Performance Findings

The implementation reduced unnecessary tile churn by using:

- OpenTopoMap maximum native zoom alignment;
- `updateWhenIdle: true`;
- `updateWhenZooming: false`;
- bounded `keepBuffer`;
- stable opacity and tile-pane presentation.

No new provider calls, background workers, telemetry, persistence, API calls, CRM calls, or production-data mutation were introduced.

## Files Changed

Runtime:

- `components/maps/SearchMap.tsx`
- `app/globals.css`

Validation:

- `scripts/checkDxtMapVisualLanguageNormalization.ts`
- `package.json`
- `tsconfig.worker.json`

Documentation:

- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-CURRENT-PROVIDER-STYLE-CONSTRAINT-REMEDIATION-IMPLEMENTATION.md`
- `docs/CHAT_START.md`

Generated validation output was treated as drift and removed before commit.

## Deterministic Validation

Added deterministic check:

`npm run check:dxt-map-visual-language-normalization`

The check verifies:

- Search map remains bounded to OpenTopoMap;
- active tile URL and provider attributes exist;
- maximum zoom aligns to `17`;
- Mapbox overlay remains fail-closed by default;
- attribution remains present;
- visual treatment is scoped and does not use prohibited filters;
- tile loading/fallback messages exist;
- marker, cluster, and selected-property behavior remains intact;
- Search workspace, marker preview, and return-context surfaces remain present;
- non-Search maps retain their existing providers;
- no persistence, telemetry, CRM, recommendation, affordability, ranking, school, safety, or protected-class language was introduced.

## Local Validation

Local validation included:

- `git diff --check`
- `git diff --cached --check`
- authorized file-scope review
- complete diff review
- generated-drift review
- `npm run check:dxt-map-visual-language-normalization`
- Search map rendering and baseline checks
- Search workspace, marker preview, and return-context checks
- Search runtime and property-route safety checks
- Product Cohesion and Decision Journey checks
- Public Trust and source-rights checks
- market, neighborhood, Geographic Intelligence, Local Decision Intelligence, unsubscribe, alert, buyer, seller, financing, advisory, and Grand Plan regressions
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- local production Search smoke
- local production public-experience smoke

## Visual Certification Review

Local browser review verified:

- provider: `opentopomap`;
- tile URL: OpenTopoMap;
- maximum zoom: `17`;
- tile status reached `ready`;
- attribution visible;
- active tile hosts were OpenTopoMap only;
- Mapbox request count was `0`;
- observed zooms included the bounded range through `17`;
- no horizontal overflow was observed at mobile, tablet, or desktop review sizes;
- no clean-load console errors were observed.

## Interaction Review

Interaction review verified:

- Search map entry;
- mobile map toggle;
- zoom controls;
- marker selection;
- selected property preview/drawer;
- Search return-context property detail link;
- attribution visibility;
- no Search-this-area control;
- no layer control;
- no provider selector;
- no address-bar or route desynchronization from this work.

## Search Workspace Regression Findings

Search workspace shell behavior remained intact:

- Search route and shell remain existing surfaces;
- list and map interaction remain connected;
- mobile toggle remains available;
- Search result context remains preserved;
- no new route, API, provider, persistence, telemetry, or CRM behavior was introduced.

## Marker / Preview Regression Findings

Marker and preview regression findings:

- markers render;
- clusters render;
- selected marker state is visible;
- selected marker accessibility state remains available;
- selected property preview/drawer remains available;
- property detail continuation remains available;
- no score, grade, ranking, recommendation, or suitability claim was introduced.

## Search Return Context Regression Findings

Search return context remained preserved:

- property detail links continue to include Search return context;
- direct Search-origin handoff remains bounded;
- no full property-detail context restoration was introduced;
- Property Detail Context Preservation Phase 2 remains deferred.

## Trust And Fair-Housing Findings

No trust, fair-housing, or steering boundary was crossed.

The implementation introduced no:

- school ranking;
- safety ranking;
- demographic targeting;
- protected-class proxy;
- suitability conclusion;
- desirability claim;
- affordability claim;
- qualification claim;
- approval claim;
- recommendation to proceed or delay;
- lender, provider, or brokerage claim.

## Public Trust And Source-Rights Findings

Public Trust and source-rights posture remained bounded:

- OpenTopoMap attribution remains visible;
- no provider replacement occurred;
- no provider activation occurred;
- no new evidence source was activated;
- no source-rights claim was changed;
- no production data was mutated.

## Non-Search Map Boundary

Non-Search map boundaries were preserved.

The implementation did not modify:

- property detail map provider behavior;
- Boulder market map provider behavior;
- neighborhood overlay map provider behavior;
- non-Search map routes;
- map/GIS architecture outside the existing Search map component.

## Provider And Licensing Boundaries

Provider and licensing boundaries preserved:

- no OpenTopoMap replacement;
- no Mapbox activation;
- no token or environment requirement;
- no tile-source change;
- no provider selector;
- no attribution removal;
- no licensing claim beyond existing provider attribution;
- no public GIS activation.

## Deferred Work

Deferred:

- provider replacement;
- tile-source change;
- Mapbox activation;
- route/API changes;
- persistence;
- telemetry;
- CRM;
- Search-this-area behavior;
- layer controls;
- property-detail context preservation;
- additional DXT phases;
- production certification;
- documentation closure.

## Brokerage Disclosure Hold

Brokerage disclosure remains on hold:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

No brokerage disclosure copy, placement, route, or compliance statement was changed.

## Protected Boundaries

Protected boundaries remained intact:

- no new route;
- no route behavior change;
- no Search API change;
- no map/GIS provider activation;
- no non-Search map change;
- no provider token or environment change;
- no persistence;
- no telemetry;
- no CRM;
- no personalization;
- no AI;
- no public-record lookup;
- no production data mutation;
- no deployment configuration change;
- no brokerage disclosure change;
- no Phase 2 or next initiative.

## Local Commit And Push Status

The implementation is intended for one local commit after validation.

Push remains unauthorized. Manual deployment remains unauthorized. Production certification remains unauthorized.

Next authorization gate:

`READY_FOR_REIE_DXT_WAVE_1B_MAP_VISUAL_LANGUAGE_LOCAL_CERTIFICATION_AND_PUSH_REVIEW`
