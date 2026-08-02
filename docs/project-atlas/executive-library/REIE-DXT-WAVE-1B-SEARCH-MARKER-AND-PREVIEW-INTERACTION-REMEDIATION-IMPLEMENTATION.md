# REIE DXT Wave 1B Search Marker And Preview Interaction Remediation Implementation

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1B - Search Marker And Preview Interaction Remediation
Status: LOCAL_IMPLEMENTATION_COMPLETE_PUSH_UNAUTHORIZED
Created: 2026-08-02

## Baseline

Verified before implementation:

- Branch: `main`
- HEAD: `edc73a51d136b8d3ee933fab9c33561d2d1e06b0`
- origin/main: `edc73a51d136b8d3ee933fab9c33561d2d1e06b0`
- Ahead/behind: `0 ahead / 0 behind`
- Working tree: clean

Prior deployment status:

- GitHub/Vercel state: `success`
- Status ID: `51506167569`
- Context: `Vercel`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/2zTzf5FS9oiaoxfWX4EwaYsmvBQ8`
- Associated SHA: `edc73a51d136b8d3ee933fab9c33561d2d1e06b0`

## Authorized Scope

Authorized implementation:

- bounded Search marker and preview interaction remediation;
- click-first marker selection;
- supplemental hover only;
- pinned interactive property preview using current architecture;
- selected marker state;
- list/map synchronization preservation;
- touch and keyboard accessibility support where current architecture permits;
- focused deterministic validation;
- implementation record and handoff update.

Not authorized:

- push;
- production certification;
- property-detail workspace;
- map visual-language normalization;
- route changes;
- API changes;
- provider or tile-source changes;
- Search ranking changes;
- persistence;
- telemetry;
- CRM;
- brokerage disclosure changes;
- full Search redesign;
- next DXT phase.

## Current Production Defect

The Search map had two competing property-preview models:

1. the existing React selected-property drawer rendered by `SearchInterface`;
2. a Leaflet popup built in `SearchMap` and opened on marker hover and click.

That meant the actionable map preview path still depended on Leaflet popup behavior. Pointer movement away from a marker could close the popup before the user could reliably activate the primary `View Property` action. This violated the DXT Wave 1B specification that essential preview actions must not depend on hover.

## Root Cause

`SearchMap` bound `buildPopupHtml(property)` to each listing marker and opened the popup from both `mouseover` and `click`. The hover popup included the primary property route CTA, so hover controlled the lifetime of an actionable preview. The selected React drawer already existed, but marker interaction still treated the Leaflet popup as an actionable preview.

## Selected Interaction Model

Implemented model:

`CLICK_PINNED_PREVIEW_WITH_PERSISTENT_MAP`

Bounded implementation expression:

- marker click selects a property;
- selected property renders through the existing `SelectedPropertyDrawer`;
- hover only highlights and synchronizes;
- the map remains visible;
- the drawer remains open until explicit close, Escape, replacement selection, reset, or stale selection removal;
- no new route or property-detail workspace was added.

## Files Changed

Runtime:

- `components/maps/SearchMap.tsx`
- `components/search/SearchInterface.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`

Deterministic validation:

- `scripts/checkDxtSearchMarkerPreviewInteraction.ts`
- `scripts/checkMapRenderingSafety.ts`
- `package.json`
- `tsconfig.worker.json`

Documentation:

- `docs/project-atlas/executive-library/REIE-DXT-WAVE-1B-SEARCH-MARKER-AND-PREVIEW-INTERACTION-REMEDIATION-IMPLEMENTATION.md`
- `docs/CHAT_START.md`

## Click Behavior

Marker click now:

- selects the listing through existing Search selected-state flow;
- clears supplemental hover state;
- renders the existing pinned selected-property drawer;
- preserves the visible map;
- avoids direct route navigation from the marker;
- avoids opening an actionable Leaflet popup.

## Hover Behavior

Hover now:

- remains supplemental;
- highlights marker/card state where current architecture supports it;
- does not open the actionable preview;
- does not control the preview lifetime;
- cannot make the primary property-detail action inaccessible.

## Pinned Preview Lifetime

The selected-property drawer remains the actionable pinned preview. It stays open until:

- a different marker or listing card is selected;
- the explicit close control is activated;
- Escape is pressed within the Search workspace;
- Search reset clears selection;
- the selected listing is removed from visible results.

Pointer movement away from the marker does not close the drawer.

## Close And Dismiss Behavior

Implemented:

- explicit drawer close control;
- Escape dismissal at the Search workspace level;
- selection clearing when the preview closes;
- stale selection clearing when the listing leaves visible results.

Not implemented:

- empty-map click dismissal, because it was optional and could conflict with map drag/touch behavior.

## Selected Marker State

Markers now expose:

- `data-testid="reie-search-map-marker-button"`;
- `data-marker-property-id`;
- `data-marker-state`;
- `aria-pressed`;
- distinct `selected` and `hovered` visual classes.

The selected marker includes a non-color outline treatment so selected state is not color-only.

## List / Map Synchronization

Preserved:

- marker click selects the property;
- list-card click selects the same property;
- selected sidebar card metadata remains available;
- hover/focus may still synchronize supplemental hover state;
- stale selected property state clears when the selected listing leaves visible results.

No new forced recentering, list scroll restoration, URL-state redesign, or cross-route restoration was introduced.

## Touch Behavior

Touch devices use tap selection through the marker click path. The selected preview uses the existing drawer and preserves:

- reachable primary CTA;
- explicit close control;
- stable map/list mode behavior;
- no hover dependency.

The full future mobile property-detail sheet was not implemented.

## Accessibility Behavior

Implemented or preserved:

- marker button metadata with `aria-pressed`;
- selected drawer receives focus when opened;
- explicit close button;
- Escape dismissal from the Search workspace;
- visible focus states on drawer actions;
- list-card selection as the accessible fallback path where Leaflet marker keyboard behavior is limited;
- no hover-only essential action.

Known bounded limitation:

- Full Leaflet marker keyboard traversal remains constrained by the current map library architecture. The implementation preserves an equivalent list-card selection path and records this for later certification.

## Loading And Missing-Data Behavior

The selected-property preview continues to use current drawer behavior:

- resilient listing image with fallback source;
- neutral unavailable values for missing facts;
- existing property detail route as primary CTA;
- stale selected state clears when results remove the property.

No new data source, inferred property claim, or provider dependency was added.

## Back / Forward Preservation

No browser history model was redesigned in this phase. Existing Search URL/filter behavior remains intact. Full property-detail Search-state restoration remains deferred and unauthorized.

## Data / Trust Boundaries

The implementation introduces no:

- valuation certainty;
- property-condition conclusion;
- title, ownership, permit, HOA, or insurance conclusion;
- financing approval;
- affordability, suitability, or investment recommendation;
- demographic targeting;
- protected-class proxy;
- school or safety ranking;
- internal evidence metadata.

## Automated Validation

Required local validation includes:

- `npm run check:dxt-search-marker-preview-interaction`
- `npm run check:search-runtime-safety`
- `npm run check:search-listing-quality`
- `npm run check:cep-search-map-baseline`
- `npm run check:map-rendering-safety`
- `npm run check:property-route-safety`
- `npm run check:reie-product-experience-cohesion-wave`
- `npm run check:decision-journey-experience`
- `npm run check:property-product-3-1`
- `npm run check:public-runtime-safety`
- `npm run check:public-trust-readiness`
- `npm run check:source-rights-activation-readiness`
- `npm run check:unsubscribe-safety`
- `npm run check:alert-readiness`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- local production public-experience smoke against a running build.

## Responsive And Interaction Review

Required local review viewports:

- approximately `390x844`;
- approximately `768x1024`;
- approximately `1440x1100`.

Review must confirm:

- preview opens by click/tap;
- preview remains open while interacting with it;
- primary CTA can be activated;
- explicit close works;
- Escape works where authorized;
- selected marker is clear;
- only one preview is open;
- map remains visible;
- no hover dependency on touch devices;
- no critical overflow, overlap, clipping, broken layout, or clean-load console error.

## Protected Boundaries

Preserved:

- no route changes;
- no API changes;
- no Search ranking changes;
- no provider or tile-source changes;
- no map visual-language normalization;
- no GIS expansion;
- no Prisma changes;
- no persistence;
- no telemetry;
- no CRM;
- no brokerage disclosure changes;
- no property-page redesign;
- no compare redesign;
- no deployment configuration change;
- no production-data mutation.

## Local Implementation Status

Status: `LOCAL_IMPLEMENTATION_COMPLETE_PUSH_UNAUTHORIZED`

Push remains unauthorized.

Production certification remains unauthorized.

Next gate:

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_MARKER_AND_PREVIEW_LOCAL_CERTIFICATION_AND_PUSH_REVIEW`
