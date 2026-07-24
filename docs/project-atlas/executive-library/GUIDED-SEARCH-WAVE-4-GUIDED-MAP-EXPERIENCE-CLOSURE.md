# Guided Search Experience Restoration Program

Status: `CERTIFIED_AND_CLOSED`

Program: PROJECT ATLAS - Guided Search Experience Restoration Program
Wave: Wave 4 - Guided Map Experience
Governing reference: REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1
Implementation commit: `1261dec205af1fb52e0f48ef506a41f5651db90e`
Implementation commit message: `Restore Guided Search Wave 4 guided map experience`
Production domain: `https://davidquinngroup.com`
Certification date: July 24, 2026

## Scope

Wave 4 refined the public Search map presentation so customers can better understand mapped properties, marker/list relationships, selected-property continuity, popup context, drawer context, and mobile List/Map movement while preserving existing runtime-sensitive map behavior.

The certified implementation changed only:

- `app/globals.css`
- `components/maps/MapSidebar.tsx`
- `components/maps/SearchMap.tsx`
- `components/maps/SelectedPropertyDrawer.tsx`
- `scripts/checkMapRenderingSafety.ts`
- `scripts/publicExperienceSmoke.ts`

No API, runtime, schema, migration, package, dependency, configuration, environment, documentation, generated, MLS, CRM, auth, email, or persistence file was included in the Wave 4 implementation commit.

## Promotion Evidence

Pre-promotion repository review passed:

- Branch: `main`
- Local HEAD before push: `1261dec205af1fb52e0f48ef506a41f5651db90e`
- Status before push: `main...origin/main [ahead 1]`
- The only local commit beyond `origin/main` was the certified Wave 4 implementation commit.
- Working tree was clean.

Push result:

- `origin/main` advanced from `2309cf99cb7d2ffb1457098d87f814aeb6840bb8` to `1261dec205af1fb52e0f48ef506a41f5651db90e`.
- Post-push alignment confirmed: `HEAD = origin/main = 1261dec205af1fb52e0f48ef506a41f5651db90e`.

Deployment result:

- Deployment provider: Vercel
- Production domain certified: `https://davidquinngroup.com`
- Production commit SHA certified by repository push sequence and rendered Wave 4 production behavior: `1261dec205af1fb52e0f48ef506a41f5651db90e`
- Vercel CLI and API token were not available locally, so a canonical `dpl_` deployment identifier could not be read without changing project access or configuration.
- Production edge evidence included Vercel request IDs `sfo1::iad1::87krp-1784914039666-8e8588cf8856` for `/search` and `sfo1::iad1::lv822-1784914041426-71b42417f103` for `/api/search?limit=5`.
- Production `/search` served the Wave 4 asset set and rendered the Wave 4 client-only map orientation node, confirming the implementation was live.
- Production certification completed successfully on July 24, 2026.

## Validation Evidence

Final local validation before promotion passed during Wave 4 final review:

- `git diff --check`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check:search-runtime-safety`
- `npm run check:map-rendering-safety`
- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=http://127.0.0.1:3001 npm run smoke:public-experience`

Production validation passed:

- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=https://davidquinngroup.com npm run smoke:public-experience`
- `/` returned HTTP 200.
- `/grand-plan` returned HTTP 200.
- `/search` returned HTTP 200.
- `/contact` returned HTTP 200.
- `/api/search?limit=5` returned HTTP 200 with `found=1287`, `source="database"`, `health="degraded"`, `returned=5`, `mapped=5`, `coordinateFiltered=0`, and `meta.smoke.ready=true`.
- The degraded database source was the known safe provider-fallback posture and had no smoke blockers.
- `/favicon.ico` returned HTTP 404 as a known resource watch item.

## Map Orientation Certification

Production `/search` rendered the approved Wave 4 map orientation surface:

- `Map View`
- `Properties shown here have public map coordinates.`
- `Select a marker to compare it with the list.`

The guidance remained concise, subordinate, non-modal, and non-obstructive. It used `pointer-events: none`, introduced no state or event handlers, did not obscure Leaflet controls, did not block marker or cluster interaction, and did not imply complete map or inventory coverage.

Mapped-count wording rendered as `properties shown on this map`, accurately distinguishing mapped properties from total Search results without exposing provider, coordinate, geocoding, database, or fallback diagnostics.

## Popup And Drawer Certification

Production popup certification passed:

- Popup vocabulary included `Review Context`, `Map Context`, and `View Property`.
- Older `Listing Facts`, `Advisory Note`, and `Location Fit` wording was removed from the primary public Search map popup.
- Popup remained compact and map-specific, with price, address, facts, context, and property-detail CTA readable.
- Popup href preserved the existing property route, for example `/properties/cmqln605g0b7mpi4jcsgwcxu6` during mobile marker certification.

Production Selected Property Drawer certification passed:

- Drawer vocabulary included `Selected Property`, `Property Details`, `Review Context`, `Map Context`, and `View Property`.
- Helper copy explained that the panel reflects the property selected from the map or listing results.
- Drawer copy did not imply automated analysis, advisor review, lifestyle fit, personalized location intelligence, neighborhood scoring, or complete market coverage.
- CTA hierarchy remained clear: `View Property` primary, inquiry subordinate, market-context link subordinate.
- Drawer height and internal scrolling remained usable on mobile.

Runtime-sensitive drawer and popup mechanics were unchanged: state, open/close behavior, `role="dialog"`, `aria-labelledby`, close-button accessible name, CTA destinations, property routing, event propagation, selection synchronization, and auto-pan behavior were preserved.

## Marker And Cluster Certification

Production selected-marker and cluster presentation passed:

- Selected marker used the Wave 4 active treatment with readable dark text on `rgb(207, 250, 254)`.
- Hover and selected states remained visually distinct.
- Cluster border rendered as `2px solid rgba(207, 250, 254, 0.68)`.
- Dense mobile map areas remained usable.
- Reduced-motion CSS remained in place for marker, cluster, and popup CTA transitions.

The following remained unchanged by Wave 4: marker values, coordinates, metadata, click and hover handlers, selection state, cluster counts, bucket logic, `CLUSTER_GRID_SIZE`, `CLUSTER_DISABLE_ZOOM`, `fitCluster`, and zoom behavior.

## Responsive And Leaflet Certification

Production browser review passed at representative widths:

- Desktop `1280x900`: document/client width `1276/1276`; no horizontal overflow; map `828x837`; guidance `332x69`; sidebar `449x213`; Leaflet tile sample `256x256`.
- Tablet `900x1050`: document/client width `896/896`; no horizontal overflow; map `456x987`; guidance `332x69`; sidebar `441x363`; Leaflet tile sample `256x256`.
- Mobile List `386x900`: document/client width `386/386`; no horizontal overflow; list active; map hidden as expected; List/Map toggle showed `listPressed=true` and `mapPressed=false`.
- Mobile Map `386x900`: document/client width `386/386`; no horizontal overflow; map `386x836`; guidance `362x89`; visible cluster `42x42`; popup `286x361`; drawer `354x669`; List/Map toggle showed `listPressed=false` and `mapPressed=true`.

Leaflet rendering contract passed at desktop, tablet, and mobile-map widths:

- Tiles remained `256x256`.
- `max-width: none`.
- `object-fit: fill`.
- `filter: none`.
- No tile stretching, blurring, global image-rule interference, or CSS transform distortion was observed.

## Interaction Certification

Production non-mutating interaction review passed:

- Marker selection activated the marker, opened popup, selected the corresponding property, opened the drawer, and synchronized selected card/list/sidebar state.
- Listing-card selection selected the corresponding marker, opened popup and drawer, and synchronized selected card/sidebar state.
- Cluster selection preserved existing `fitCluster` behavior: mobile map changed from 125 markers / 32 clusters to 250 markers / 0 clusters without URL mutation.
- Popup `View Property` href preserved the existing property route, and direct GET navigation to the popup href opened the expected property page.
- Drawer `View Property` click preserved the existing href and opened the expected property page.
- Drawer close cleared selected state, active marker, popup, drawer, selected card, and sidebar selected ID.
- Mobile List/Map switching worked and preserved `aria-pressed`.
- Empty-state GET URL `/search?city=DefinitelyNoResultsForWave4&minPrice=999999999` returned zero cards and rendered `No Properties Match This View` without provider or infrastructure terminology.

Headless pointer hover did not expose a visible hovered attribute during certification, but Wave 4 made no changes to hover handlers or hover state mechanics. Marker/list selection synchronization, selected state, popup, and drawer synchronization were verified in production.

## Copy And Claim Review

Production wording introduced or changed in Wave 4 passed trust review:

- `Map View`
- `Properties shown here have public map coordinates.`
- `Select a marker to compare it with the list.`
- `properties shown on this map`
- `Selected Property`
- `Property Details`
- `Review Context`
- `Map Context`
- `View Property`

The language remained factual, neutral, review-oriented, and advisor-safe. It did not imply personalized location intelligence, best area, ideal location, safe or desirable neighborhood, commute suitability, lifestyle compatibility, neighborhood scoring, investment quality, advisor-reviewed location, automated spatial recommendation, complete inventory, hidden listings, or exclusive inventory.

## Runtime And Map Protection

Runtime behavior remained within the approved Wave 4 boundary:

- `/api/search` remained available.
- URL parameter contract, filtering, sorting, pagination, result limits, Prisma search path, Supabase REST fallback, Typesense integration boundary, Save Search runtime, property routing, auth, alerts, email, CRM, MLS, schema, migrations, dependencies, environment variables, and production configuration were not changed.
- Leaflet initialization, tile-layer configuration, ResizeObserver, `map.invalidateSize`, bounds callbacks, `onBoundsChange`, map-query coupling, marker coordinates, marker values, marker metadata, marker events, selected-property state, hovered-property state, popup events, `fitCluster`, `panTo`, auto-pan, drawer state, card/marker synchronization, and mobile List/Map state were preserved.

No environment variables, production configuration, database schema, migrations, packages, dependencies, live syncs, workers, queues, email sends, CRM mutations, MLS Grid requests, OpenAI calls, TitlePro247 calls, Typesense reset/reindex, saved-search dry-runs, or production data repair actions were performed.

## No-Mutation Certification

The production review window covered Wave 4 certification activity through a read-only database check beginning at `2026-07-24T16:42:08.643Z`.

Read-only certification found zero new records in:

- `User`: 0
- `SavedSearch`: 0
- `AlertQueue`: 0
- `EmailLog`: 0
- `CRMTask`: 0
- `UserInteraction`: 0
- `LeadInteraction`: 0
- `UserPreference`: 0

No Save Search form, Contact form, or Grand Plan form was submitted during certification. No production write workflow was executed.

## Deferred Watch Items

These items are documented only and remain non-blocking for Wave 4:

- Missing `public/favicon.ico`: pre-existing resource watch; production `/favicon.ico` returned HTTP 404.
- External `media.mlsgrid.com` image failures: pre-existing external resource watch. No image loading, domain, or fallback mechanics were changed during Wave 4.
- Direct URL-filter hydration warning: pre-existing URL-filter SSR/client-state watch. Direct filter URLs rendered and worked during certification; no fix was made during Wave 4.

## Final Decision

`GUIDED_SEARCH_WAVE_4_CERTIFIED_AND_CLOSED`

Wave 4 is promoted, production-certified, documented, and closed. Wave 5 is not authorized by this record.
