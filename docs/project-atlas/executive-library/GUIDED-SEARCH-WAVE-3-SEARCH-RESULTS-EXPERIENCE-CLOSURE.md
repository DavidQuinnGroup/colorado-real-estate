# Guided Search Experience Restoration Program

Status: `CERTIFIED_AND_CLOSED`

Program: PROJECT ATLAS - Guided Search Experience Restoration Program
Wave: Wave 3 - Search Results Experience
Governing reference: REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1
Implementation commit: `87091fdc88ce32d1bd7f4401f814916396eca8a1`
Implementation commit message: `Restore Guided Search Wave 3 search results experience`
Production domain: `https://davidquinngroup.com`
Certification date: July 24, 2026

## Scope

Wave 3 refined the public Search result-card presentation so customers can more quickly scan, compare, select, and open listings while preserving all existing runtime behavior.

The certified implementation changed only:

- `components/PropertyCard.tsx`
- `scripts/checkMapRenderingSafety.ts`
- `scripts/publicExperienceSmoke.ts`

No documentation, runtime, schema, migration, package, environment, configuration, dependency, or generated file was included in the Wave 3 implementation commit.

## Promotion Evidence

Pre-promotion repository review passed:

- Branch: `main`
- Local HEAD before push: `87091fdc88ce32d1bd7f4401f814916396eca8a1`
- Status before push: `main...origin/main [ahead 1]`
- The only local commit beyond `origin/main` was the certified Wave 3 implementation commit.
- Working tree was clean.

Push result:

- `origin/main` advanced from `28ddedd` to `87091fdc88ce32d1bd7f4401f814916396eca8a1`.
- Post-push alignment confirmed: `HEAD = origin/main = 87091fdc88ce32d1bd7f4401f814916396eca8a1`.

Deployment result:

- Deployment provider: Vercel
- Deployment identifier: `dpl_5rx8dDcnSffRZmiBVMbEPzQocHxi`
- Deployment URL: `https://david-quinn-group-8rde-34hfawsi9-david-quinns-projects-a0953600.vercel.app`
- Production aliases included `https://davidquinngroup.com`, `https://www.davidquinngroup.com`, and `https://david-quinn-group-8rde.vercel.app`.
- Target: `production`
- Created: July 24, 2026 09:53:37 MDT
- Terminal status: `READY`
- Production commit SHA certified by repository and deployment sequence: `87091fdc88ce32d1bd7f4401f814916396eca8a1`

## Validation Evidence

Final local validation before promotion passed during Wave 3 final review:

- `git diff --check`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check:search-runtime-safety`
- `npm run check:map-rendering-safety`
- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=<local-loopback-server> npm run smoke:public-experience`

Production validation passed:

- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=https://davidquinngroup.com npm run smoke:public-experience`
- `/` returned HTTP 200.
- `/grand-plan` returned HTTP 200.
- `/search` returned HTTP 200.
- `/contact` returned HTTP 200.
- `/api/search?limit=5` returned HTTP 200 with `resultCount=5`, `found=1287`, `source="database"`, `health="degraded"`, and `fallbackReason="Search provider fallback served the request."`
- `/favicon.ico` returned HTTP 404 as a known resource watch item.

The production smoke did not use localhost and did not require a protected admin route.

## Listing-Card Certification

Production `/search` rendered the approved Wave 3 result-card hierarchy:

1. Photo
2. Price
3. Address and location
4. Compact beds, bathrooms, and square-footage facts
5. Property type and status
6. Review Context
7. Property-detail CTA

Presentation certification passed:

- Listing status was visible in the card body and did not depend only on image overlay treatment.
- Repeated `Listing Facts` content was removed.
- Useful property context remained available.
- Result cards retained a premium presentation and did not become compressed MLS table rows.
- Price, location, bedrooms, bathrooms, square footage, property type, and status were quickly identifiable across consecutive cards.

## Responsive Certification

Production browser review passed at representative widths:

- Desktop `1280x900`: document/client width `1280/1280`; no horizontal overflow; sidebar `449x211`; representative card `448x528`; image `446x251`; CTA `View Property` visible; Leaflet tile sample `256x256`, `filter: none`, `object-fit: fill`.
- Tablet `900x1050`: document/client width `900/900`; no horizontal overflow; sidebar `441x361`; representative card `440x523`; image `438x246`; CTA `View Property` visible; Leaflet tile sample `256x256`, `filter: none`, `object-fit: fill`.
- Mobile `386x900`: document/client width `386/386`; no horizontal overflow; sidebar `386x67`; representative card `386x505`; image `384x216`; CTA `View Property` visible; core facts remained readable.

Production measurements were consistent with local certification baselines of approximately `528px` desktop, `523px` tablet, and `505px` mobile card height. Text wrapping remained usable, result rhythm stayed calm, and mobile List/Map switching remained functional.

## Selected-Card Certification

Selected-card production behavior and presentation passed:

- Selected cards were immediately recognizable while remaining subordinate to price, address, facts, and image.
- Selected state displayed `Selected Property` and `Map Synced`.
- Selected context was exposed through `aria-describedby`.
- Card selection synchronized selected-card appearance, marker state, popup state, sidebar state, and Selected Property Drawer state.
- Marker selection synchronized the corresponding card, popup, and drawer.

## Interaction Certification

Production GET-based and non-mutating interaction review passed:

- City refinement changed the URL to `/search?city=Boulder` and returned 38 visible cards.
- Combined refinements preserved existing URL keys: `city`, `minPrice`, `maxPrice`, `beds`, `baths`, and `propertyType`; the safe test returned 10 visible cards.
- Specific Property search used the existing `q` key and returned 68 visible cards for the safe public query.
- Removing an active price chip removed only that refinement and updated URL/results correctly.
- Clear Search returned to `/search`, cleared all refinements, and restored 250 visible cards.
- Card selection opened the selected-card presentation and synchronized marker, popup, sidebar, and drawer state.
- Marker selection synchronized the corresponding card and drawer.
- The `View Property` CTA retained the existing property href. Direct route verification for `/properties/cmqln53qg09rvpi4jzrvdb33v` returned HTTP 200 and opened the property page.
- GET-only no-results URL `/search?city=DefinitelyNoResultsForWave3&minPrice=999999999` returned zero cards and rendered the customer-safe empty state.
- Mobile List/Map switching preserved `aria-pressed` behavior and map/list layout.

Headless coordinate clicking of the nested `View Property` link was intercepted by the footer after scroll during certification, but the link href and direct property-detail route were verified unchanged. This was classified as a browser automation artifact, not a Wave 3 runtime regression.

## Copy And Claim Review

Production wording introduced or changed in Wave 3 passed trust review:

- `Review Context`
- `Map Context`
- `Open details when this listing deserves a closer look.`
- `View Property`
- `Selected Property`
- `Map Synced`

The language remained factual, neutral, review-oriented, and advisor-safe. It did not imply recommendation, ranking, personalization, AI analysis, advisor endorsement, property condition verification, neighborhood quality, investment value, hidden opportunity, ideal fit, exclusive access, or complete market coverage.

## Runtime And Map Protection

Runtime behavior remained within the approved Wave 3 boundary:

- `/api/search` remained available.
- URL parameter contract, filter semantics, sorting, pagination, result limits, Prisma search path, Supabase REST fallback, and Typesense integration boundary were not changed.
- Map bounds, marker rendering, clustering, popups, hover synchronization, selected-property state, drawer mechanics, auto-pan, mobile List/Map switching, property-detail routing, and Save Search runtime were preserved.
- Leaflet rendering remained `256x256` tiles with `filter: none` and `object-fit: fill`.

No environment variables, production configuration, database schema, migrations, packages, dependencies, live syncs, workers, queues, email sends, CRM mutations, MLS Grid requests, OpenAI calls, TitlePro247 calls, Typesense reset/reindex, saved-search dry-runs, or production data repair actions were performed.

## No-Mutation Certification

The production review window began at `2026-07-24T15:53:37.000Z`, matching the implementation deployment creation time.

Read-only production certification found zero new records in:

- `User`: 0
- `SavedSearch`: 0
- `CRMTask`: 0
- `UserInteraction`: 0
- `LeadInteraction`: 0
- `AlertQueue`: 0
- `AlertEvent`: 0
- `EmailLog`: 0
- `UserPreference`: 0

No Save Search form, Contact form, or Grand Plan form was submitted during certification.

## Deferred Watch Items

These items are documented only and remain non-blocking for Wave 3:

- Missing `public/favicon.ico`: pre-existing resource watch; production `/favicon.ico` returned HTTP 404.
- External `media.mlsgrid.com` image failures: pre-existing external resource watch; production browser console showed external image request failures. No fix was made during Wave 3.
- Direct URL-filter hydration mismatch: pre-existing URL-filter SSR/client-state watch. Direct filter URLs rendered and worked during certification; no fix was made during Wave 3.

## Final Decision

`GUIDED_SEARCH_WAVE_3_CERTIFIED_AND_CLOSED`

Wave 3 is promoted, production-certified, documented, and closed. Wave 4 is not authorized by this record.
