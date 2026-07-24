# Guided Search Experience Restoration Program

Status: `CERTIFIED_AND_CLOSED`

Program: PROJECT ATLAS - Guided Search Experience Restoration Program
Wave: Wave 2 - Search Refinement
Governing reference: REAL ESTATE INTELLIGENCE ENGINE - MASTER V7.1
Implementation commit: `932076340a654d0d6331e92ce0b9044c542cf310`
Implementation commit message: `Restore Guided Search Wave 2 refinement experience`
Production domain: `https://davidquinngroup.com`
Certification date: July 24, 2026

## Scope

Wave 2 refined the public Search controls into an advisor-guided presentation hierarchy while preserving existing runtime behavior.

The certified implementation changed only:

- `components/maps/SaveSearch.tsx`
- `components/search/SearchControls.tsx`
- `scripts/checkMapRenderingSafety.ts`
- `scripts/publicExperienceSmoke.ts`

No documentation, runtime, schema, migration, package, environment, configuration, or generated file was included in the Wave 2 implementation commit.

## Promotion Evidence

Pre-promotion repository review passed:

- Branch: `main`
- Local HEAD before push: `932076340a654d0d6331e92ce0b9044c542cf310`
- Status before push: `main...origin/main [ahead 1]`
- The only local commit beyond `origin/main` was the certified Wave 2 implementation commit.
- Working tree was clean.

Push result:

- `origin/main` advanced from `07ed623` to `932076340a654d0d6331e92ce0b9044c542cf310`.
- Post-push alignment confirmed: `HEAD = origin/main = 932076340a654d0d6331e92ce0b9044c542cf310`.

Deployment result:

- Deployment provider/status context: GitHub commit status `Vercel`
- Pending status ID: `51040891486`
- Terminal success status ID: `51040985517`
- Deployment target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/Q7cULor6Fhst4pdJf2mCcVL7mLcE`
- Completion observation: `2026-07-24T14:58:17Z`
- Deployment result: `success`
- Production commit SHA: `932076340a654d0d6331e92ce0b9044c542cf310`

## Validation Evidence

Final local validation before promotion passed:

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
- `/api/search?limit=5` returned HTTP 200 with 5 public results, `returned=5`, `found=1287`, `source="database"`, `health="degraded"`, and `fallbackReason="Search provider fallback served the request."`
- `/favicon.ico` returned HTTP 404 as a known resource watch item.

The production smoke did not use localhost and did not require a protected admin route.

## Production Search Certification

Production `/search` rendered the approved Wave 2 refinement hierarchy:

1. Where
2. Budget
3. Home Type
4. Details
5. Specific Property

Presentation certification passed:

- City rendered as the visually primary full-width first control.
- Minimum and maximum price remained paired.
- Property Type appeared before Bedrooms and Bathrooms.
- Keyword, address, ZIP, and MLS search appeared last in the Specific Property section.
- Section labels were lightweight and presentation-only.
- No wizard, onboarding sequence, mandatory workflow, or progressive-disclosure runtime was introduced.

Copy and trust certification passed:

- Refinement guidance encouraged progressive clarity without unsupported intelligence claims.
- Specific Property helper copy read: `Use this when you already know an address, ZIP code, keyword, or MLS number.`
- Save Search presentation positioned saving as a continuation after exploration.
- No automated ranking, personalization, AI recommendation, guaranteed relevance, advisor review, or automatic Grand Plan integration was implied.
- Provider and infrastructure terminology was not exposed in customer-facing empty-state diagnostics.

## Save Search Preservation

Production Save Search behavior remained unchanged by Wave 2:

- Endpoint remained `/api/save-search`.
- Request payload, captured filters, authentication, persistence, validation, success state, error state, alert timing, notes handling, CRM routing, and email behavior were not changed.
- No production Saved Search was created during certification.

## Responsive Certification

Production browser review passed at representative widths:

- Desktop `1280x900`: no horizontal overflow; form `444x672`; City `440x42`; paired price fields `220x40`; map `828x836`; Leaflet tile sample `256x256`, `filter: none`, `object-fit: fill`.
- Tablet `900x1050`: no horizontal overflow; form `436x672`; City `432x42`; paired price fields `216x40`; map `456x986`; Leaflet tile sample `256x256`, `filter: none`, `object-fit: fill`.
- Mobile `386x900`: no horizontal overflow; intro `382x774`; form `378x684`; City `374x42`; paired price fields `187x40`; Specific Property `376x147`; List/Map toggle visible and readable.

Mobile Map mode rendered 157 markers after toggling from List to Map, with `aria-pressed` changing to List `false` and Map `true`.

Save Search remained lower in the listing workflow and did not visually overpower the active search controls or listing exploration.

## Interaction Certification

Production GET-based interaction review passed:

- City refinement changed the URL to `/search?city=Boulder` and returned 38 visible cards.
- Combined refinement preserved existing URL keys: `city`, `minPrice`, `maxPrice`, `beds`, `baths`, and `propertyType`; the safe test returned 3 visible cards.
- Specific Property search used the existing `q` key and introduced no new query semantics.
- Removing the `City: Boulder` chip removed only the `city` parameter and preserved the remaining active refinements.
- Clear Search returned to `/search`, cleared all refinements, and restored 250 visible cards.
- Mobile List/Map switching preserved `aria-pressed` behavior and rendered map markers.
- Selecting marker `3990 Pleasant Ridge Rd` opened the popup and synchronized the Selected Property Drawer.
- Selecting the matching listing preserved popup and drawer synchronization.
- GET-only no-results URL `/search?city=NoResultsAtlasWave2City&minPrice=99999999` returned zero cards, zero markers, customer-safe empty-state handling, and no provider diagnostics.

## Runtime And Map Protection

Runtime behavior remained within the approved Wave 2 boundary:

- `/api/search` remained available.
- `buildSearchParams`, `getSearchFiltersFromParams`, URL parameter contract, filtering, sorting, pagination, result limits, Prisma search path, Supabase REST fallback, and Typesense integration boundary were not changed.
- Map bounds, marker rendering, clustering, popups, auto-pan, hover synchronization, selected-property state, Selected Property Drawer, and mobile List/Map switching were preserved.
- Leaflet rendering remained `256x256` tiles with `filter: none` and `object-fit: fill`.

No environment variables, production configuration, database schema, migrations, packages, dependencies, live syncs, workers, queues, email sends, CRM mutations, MLS Grid requests, OpenAI calls, TitlePro247 calls, Typesense reset/reindex, saved-search dry-runs, or production data repair actions were performed.

## No-Mutation Certification

Read-only production certification produced no new timestamped records after `2026-07-24T14:56:00Z` in:

- `User`: 0
- `SavedSearch`: 0
- `AlertQueue`: 0
- `EmailLog`: 0
- `CRMTask`: 0
- `LeadInteraction`: 0
- `UserInteraction`: 0
- `UserPreference`: 0

No Save Search form, Contact form, or Grand Plan form was submitted during certification.

## Deferred Watch Items

These items are documented only and remain non-blocking for Wave 2:

- Missing `public/favicon.ico`: pre-existing resource watch; production `/favicon.ico` returned HTTP 404.
- External `media.mlsgrid.com` image failures: pre-existing external resource watch; production Search still references `media.mlsgrid.com` assets, and a direct sample image probe returned HTTP 400. No fix was made during Wave 2.
- Direct URL-filter hydration mismatch: pre-existing URL-filter SSR/client-state watch; production direct `/search?city=Boulder` emitted React hydration error `#418`, while the page rendered 38 cards. No fix was made during Wave 2.

## Final Decision

`GUIDED_SEARCH_WAVE_2_CERTIFIED_AND_CLOSED`

Wave 2 is promoted, production-certified, documented, and closed. Wave 3 is not authorized by this record.
