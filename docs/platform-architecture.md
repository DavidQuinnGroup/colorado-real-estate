# Platform Architecture

The Real Estate Intelligence Engine is David Quinn Group's Colorado property intelligence platform. It combines premium map search, MLS Grid ingestion, local market content, saved-search alerts, digest email, property intelligence, CRM lead intelligence, operational visibility, admin diagnostics, queue diagnostics, dead-letter inspection, seed data workflows, and SEO authority infrastructure.

This document is the detailed working architecture reference for the `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0` implementation.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Platform Goal

Build a durable public intelligence layer for Colorado real estate. The platform should help clients search, compare, save, and evaluate property while helping search engines understand David Quinn Group as an authoritative source for Colorado, Boulder, Denver, and the surrounding Front Range markets.

Primary markets:

- Boulder
- Denver
- Louisville
- Lafayette
- Superior
- Erie
- Broomfield
- Longmont
- Greater Colorado Front Range expansion markets

Operating principle:

- Public pages should be fast, crawlable, and locally specific.
- Ingestion, alerting, retries, email, indexing, seed data, CRM task generation, and operational recovery should run through bounded background systems or explicit scripts.

## High-Level Stack

Frontend:

- Next.js App Router
- React
- Tailwind CSS
- Leaflet map surfaces

Database:

- Supabase PostgreSQL
- Prisma Client

Queue and workers:

- Redis
- BullMQ
- Compiled worker output in `dist/workers`
- Compiled script output in `dist/scripts`

Search:

- Typesense
- `properties` collection
- `listings` collection
- Canonical field and facet validation in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`

Email:

- Resend
- Branded alert and digest rendering through `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- `EmailLog` records in Postgres

Local infrastructure:

- Docker Compose
- Redis on `localhost:6379`
- Typesense on `localhost:8109`

Generated output:

- `dist/` is generated worker/script output.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, smoke scripts, bounded live syncs, seed commands, CRM help, curl checks, Typesense repair |

## Data Ownership

- Supabase PostgreSQL is the source of truth.
- Prisma is the application query layer.
- Typesense is a rebuildable search index.
- Redis/BullMQ is the async job system.
- Dead-letter records are operational diagnostics, not durable customer-facing business records.
- Seed data scripts are explicit local/controlled setup tools, not hidden app startup behavior.
- Email logs, alert statuses, unsubscribe tokens, user interactions, user preferences, and CRM tasks belong in Postgres.

## Public Experience Architecture

Primary surfaces:

- `/`
- `/search`
- `/properties/[id]`
- `/market/[city]`
- `/market/[city]/[slug]`

Representative files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/properties/[id]/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/market/[city]/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/market/[city]/[slug]/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapSidebar.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/PropertyDetail.tsx`

Current product rules:

- Keep the map and sidebar interaction smooth.
- Keep selected listing and marker behavior synchronized.
- Prefer real MLS/media assets over placeholders.
- Preserve the visual intelligence layer: dark terrain, high-contrast contours, electric blue water, and premium listing previews.
- Preserve search metadata from API/server search into map components so source, `meta.source`, health, access level, filters, bounds state, request duration, returned count, mapped count, coordinate-filtered count, and Search Smoke Readiness are visible during diagnostics.
- Use `/api/search` metadata to distinguish Typesense results, database fallback, bounds/filter behavior, access-level filtering, request timing, coordinate filtering, and Search Smoke Readiness blockers during viewport search.
- Keep `SearchInterface`, `MapInner`, and `SearchMap` aligned so sidebar listings, map listings, selected ids, hovered ids, public/contracted visibility, and metadata describe the same result set.
- Add heavier market/neighborhood overlays only after baseline interaction remains fast.

## MLS Ingestion Architecture

Primary flow:

1. API route or script starts a bounded MLS sync.
2. `workers/mlsWorker.ts` consumes `mls-sync` jobs when the queue path is used.
3. `syncMLSGrid()` reads `MlsSyncState` and enforces sync lock behavior.
4. MLS Grid pages are fetched with bounded page count, page size, runtime, per-page timeout, and rate delay.
5. Listings are normalized and upserted into Postgres.
6. `upsertListing()` writes REIE intelligence fields into `Property`, including `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
7. Photos are normalized into `PropertyPhoto`.
8. Existing photos are preserved when MLS returns no usable media.
9. `processListing()` calls `updateSearchIndex()` after a successful upsert.
10. Updated listings are indexed into Typesense where configured.
11. Listing, batch, page-worker, and direct sync summaries report search index attempts, successes, and failures.
12. Saved searches are matched.
13. Alert work is queued for separate processing.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls-sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/retry/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mlsGridClient.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts`

Rules:

- Never run unbounded MLS syncs.
- Keep long-running MLS ingestion in workers or scripts.
- Keep API handlers bounded and diagnostic.
- Use `dryRun=true` first for route-triggered MLS sync validation.
- Use `execute=true` or `dryRun=false` only when intentionally enqueueing live MLS work.
- Use `force=true` only after inspecting MLS status, retry status, failed jobs, and dead-letter records.
- Use `pageTimeoutMs`, `--page-timeout-ms`, or `MLS_PAGE_TIMEOUT_MS` to keep slow MLS pages bounded.
- Keep direct script sync dry-run by default; live direct script sync must use `--execute`, `--live`, or the explicit live npm command.
- Scheduled live direct sync commands should still include explicit `--execute`, `--json`, `--max-pages`, `--page-size`, `--start-page`, and `--page-timeout-ms` bounds.
- Use `--json` for scheduler-safe dry-runs and machine-readable validation output.
- Preserve existing real media when MLS returns empty or unusable media.
- Treat MLS operations as idempotent.
- Treat search index failures as operational diagnostics that should be visible in job results, `/api/mls/status`, and `/admin`.
- Use `npm run smoke:ops` from Terminal 5 as the standard local shorthand for `/api/mls/status` and `/api/search?limit=5` readiness.
- Expose first-class smoke command guidance from `/api/mls/status` through `commands.smokeOps`, `commands.smokeMlsStatus`, and `commands.smokeSearch`.
- Preserve raw status/search command compatibility through `commands.rawStatus` and `commands.rawSearchCheck`.
- Keep `scripts/fetchMLS.ts` as a compatibility wrapper around `syncMLSGrid()`, not as a separate legacy IRES ingestion path.
- Keep GC-forensics field mapping in the active `upsertListing()` path so search, property pages, alerts, and CRM all read the same intelligence surface.
- Legacy IRES/helper cleanup is complete, including deleted root-level demo MLS helpers.

Safe API dry-run and live enqueue examples from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Direct script dry-run and bounded live commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

## Legacy MLS Cleanup

Cleanup completion record:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`

Deleted legacy files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchIRESListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/normalizeIRESListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/normalizeListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mockListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/enqueueListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/parseMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/scheduleJobs.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mlsImporter.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mlsSync.ts`

Current deletion candidates:

- None in the confirmed dead-helper pass.

## Search Index Architecture

Typesense is the search index, not the source of truth. Supabase/Postgres remains canonical.

Current collections:

- `properties`: canonical app search collection.
- `listings`: MLS/listing inventory collection used by listing-oriented search and market inventory lookups.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`

Rules:

- Keep `properties` and `listings` schema-compatible for shared search surfaces.
- Both collections must expose search-critical fields.
- Both collections must include faceted `neighborhood`.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts` is the canonical schema source.
- Search scripts validate required fields and required facets before accepting an existing collection.
- Collection schema repair and Supabase-backed reindexing are separate steps.
- Reindexing can be repeated and should not be treated as source-of-truth mutation.
- `app/api/search/route.ts` should return metadata for source, `meta.source`, health, access level, active filters, bounds state, request duration, returned count, mapped count, coordinate-filtered count, `meta.smoke`, and Typesense collection/query/filter/sort context.
- `meta.smoke` should expose Terminal 5 `npm run smoke:search` readiness through `ready`, `blockers`, `command`, `terminal`, and structured checks.
- Server-side database search should use `searchPropertiesWithMeta()` when a page needs map diagnostics.
- `searchPropertiesWithMeta()` should return metadata compatible with the map metadata contract.
- `app/search/page.tsx` should pass normalized server search metadata into `SearchInterface`.
- `app/page.tsx` should preserve `/api/search` metadata and provide a compatible fallback smoke diagnostic when needed.
- `SearchInterface`, `MapInner`, and `SearchMap` should keep visible listings and metadata aligned across public and contracted access levels.
- `SearchMap` should expose search metadata through `data-search-*` and `data-search-smoke-*` attributes and only show visual diagnostics when metadata exists or coordinate filtering occurred.
- Treat `meta.smoke.ready=false` or non-empty `meta.smoke.blockers` as degraded Search Smoke Readiness.
- `/api/mls/status` should expose a first-class `searchIndex` block with recent completed job counters and diagnostics.
- `/admin` should surface search-index health and Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- `/admin` Search Smoke Readiness should state the pass condition: `meta.smoke.ready=true` with no blockers.
- Treat `indexFailed > 0` as degraded search freshness even if Postgres upserts succeeded.
- Seed helpers must not create ad hoc partial Typesense collections.
- Seed helpers should write bounded test data, create `PropertyPhoto` rows, and index through `indexListing()` so both `properties` and `listings` stay aligned.

Typesense repair sequence:

```bash
npm run worker:build
npm run typesense:init
npm run typesense:reindex
```

If Supabase is unreachable and only schema repair is needed:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

Expected stale collection warning shape:

```text
Neighborhood inventory lookup skipped because the local Typesense listings collection is stale: Typesense schema listings is invalid: ...
```

Current stale warning includes missing required fields/facets, `price` type mismatch, and default sort mismatch. That warning means code schema validation is working. The live local Typesense collection still needs repair.

## Seed Data Architecture

Seed data exists to keep local development and visual QA usable when MLS or Supabase data is incomplete. It is explicit and bounded.

Primary seed files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Commands from **Terminal 5: Scripts / curl testing** after `npm run worker:build` and `npm run supabase:check:json` report readiness:

```bash
npm run supabase:check:json
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:seed:quick
npm run run:seed:test
```

Commands for database/photo writes without Typesense indexing:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Rules:

- `quickSeed.ts` writes a small David Quinn Group authority seed.
- `seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Seed scripts create or update `Property` rows.
- Seed scripts replace existing seeded `PropertyPhoto` rows for their own properties.
- Seed scripts report database, photo, and per-collection Typesense status.
- Dry-runs are read-only verification checks, but they still require `npm run supabase:check:json` readiness because seed inventory checks touch Supabase.
- Live and no-index seed write commands require `npm run supabase:check:json` readiness before any database rows are written.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- Seed data should not run automatically during app startup, API routes, page rendering, or production schedules.
- Real MLS media remains the production source for live listing imagery.

## Alert Architecture

Primary flow:

1. Property is created or updated.
2. Saved searches are matched through Postgres/Supabase logic.
3. `AlertEvent` deduplicates by user, property, and alert type.
4. `AlertQueue` stores the alert payload.
5. Alert processor claims pending alerts with `pending -> processing -> sent`.
6. Resend delivers the email.
7. `EmailLog` records send metadata.
8. Click tracking records engagement and redirects to the intended destination.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/matchSearches.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/process-alerts/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runAlerts.ts`

Commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:alerts:dry
npm run run:alerts:live -- --limit 25
npm run run:worker:alerts:once
npm run run:worker:alerts:once:live
```

Rules:

- Alert matching is Postgres-driven, not Typesense-driven.
- Dry-runs must not mutate alert state.
- Live alert sends must be intentional, explicit, and bounded.
- Continuous alert worker mode consumes queued jobs live.
- Malformed alert payloads should fail explicitly.
- Click tracking should not block safe redirects.
- Recurring email traffic, including recurring alert sends, should wait for `npm run supabase:check:json` readiness, healthy `npm run smoke:mls-status` search-index diagnostics, `npm run smoke:search` Search Smoke Readiness, and acceptable timeout-bounded queue diagnostics.

## Email, Digest, And Unsubscribe Architecture

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingAlert.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingDigest.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/unsubscribe/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`

Current behavior:

- Lazy Resend initialization.
- Branded property intelligence HTML rendering.
- Plain-text email fallback.
- Safe property and image URL normalization.
- Optional `RESEND_REPLY_TO_EMAIL`.
- `EmailLog` creation for alert and digest sends.
- Tokenized unsubscribe links.
- Safe tracked redirects through `/api/track-click`.
- Click behavior stored for lead scoring and engagement intelligence.

Commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
npm run run:digest -- --limit 25
```

Rules:

- Do not send email from page rendering.
- Do not send exploratory MLS ingestion emails unless delivery is intentional.
- Keep unsubscribe behavior idempotent.
- Keep tracked redirects constrained to safe destinations.
- Digest dry-runs must be read-only.
- Live digest sends should only mark usable claimed alerts as sent.
- Recurring email traffic, including recurring digest sends, should wait for `npm run supabase:check:json` readiness, healthy search-index diagnostics, Search Smoke Readiness, and acceptable timeout-bounded queue diagnostics because email click traffic lands on search and property pages.

## CRM Intelligence Architecture

Primary flow:

1. `/api/track-click` records `UserInteraction`.
2. Matching `AlertQueue.clickedAt` can be updated.
3. `User.heatScore` can be incremented.
4. Preference learning reads clicked alert payloads and updates `UserPreference`.
5. Hot lead ranking scores recent clicks, heat score, saved searches, preferences, and alert clicks.
6. `createTask()` builds a `PRE_DISCOVERY_BRIEF` CRM task from current lead data.
7. Saved-search intake creates `strategy_intake` CRM tasks with alert-readiness metadata.
8. `/api/admin/crm-tasks` lists active, pending, reviewing, completed, dismissed, or all CRM queues.
9. `/api/admin/crm-tasks` reports `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also report summary counts, closure-audit counts for completed/dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
10. `/api/admin/crm-tasks` reports a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
11. `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
12. `/api/admin/crm-tasks/[id]` requires a non-empty review note before a CRM task can be marked `completed` or `dismissed`.
13. `/admin` surfaces CRM task readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with `generatedAt`, `inspectionSource`, `route`, `terminal`, and `command`, the Terminal 5 CRM scheduler command, smaller-screen-readable CRM command panels, and note-backed Review, Complete, and Dismiss actions.
14. CRM Review, Complete, and Dismiss actions update CRM API Inspection metadata from `/api/admin/crm-tasks/[id]` before the active-task list refresh returns the panel to `/api/admin/crm-tasks` metadata, preserve failed detail-route inspection metadata when a request fails, and render the visible Source field from API-provided `inspectionSource` as it moves from `Detail Route` back to `List Route`.
15. CRM runners list bounded active tasks with closure audit counts and CRM readiness gates for review and operational handoff.
16. `run:crm:scheduler` emits one scheduler-safe JSON payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/preferences/updateUserPreferences.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`

Commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:crm -- --help
npm run run:crm:active
npm run run:crm:pending
npm run run:crm:reviewing
npm run run:crm:all
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
node dist/workers/runCRMTasks.js --limit 20 --status active
```

Terminal 5 CRM reports are read-only and should include `audit` and `readiness` objects matching the `/api/admin/crm-tasks` operational contract. CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. Review, Complete, and Dismiss actions should expose `/api/admin/crm-tasks/[id]` inspection metadata before the list refresh returns `/api/admin/crm-tasks` metadata, failed detail-route attempts should preserve inspection metadata, and `/admin` should render the API-provided `inspectionSource` as the visible Source field. Scheduled CRM reporting should use `npm run run:crm:scheduler`.

CRM API checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Rules:

- CRM tasks should not be auto-completed before review.
- CRM task completion and dismissal require review notes.
- Automatic CRM task creation should avoid duplicate pending pre-discovery briefs.
- Manual CRM task creation may create a fresh task intentionally.
- CRM worker output is currently a bounded task collector/reporting surface.
- CRM closure audit coverage should remain visible in `/admin` and `/api/admin/crm-tasks`.
- CRM `readiness.level=blocked` should block scheduler cadence or automation increases until closed tasks have review notes.
- Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs receive one machine-readable readiness payload.
- Do not query obsolete fields such as `scheduledFor`.

## SEO And Authority Architecture

Primary surfaces:

- Content architecture control: `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`
- City pages
- Neighborhood pages
- Property pages
- Market pages
- Article pages
- Schema components
- Internal linking components

Authority rules:

- Keep pages crawlable.
- Keep local context specific, not generic.
- Connect property, city, neighborhood, article, tool, and market pages with internal links.
- Keep David Quinn Group entity signals consistent across metadata, schema, email, admin surfaces, and content.
- Treat fresh MLS-backed inventory as a trust signal only when it is stable, indexed, and correctly linked.
- Keep seed content useful for local development without treating it as a production content source.
- Use CRM engagement signals for content prioritization only after protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and API Inspection metadata are visible.
- Use live-inventory claims and MLS-backed public expansion only after `npm run supabase:check:json` reports readiness and search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- Allow large programmatic content batch publication only after `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

## Queue Architecture

Queues:

- `mls-sync`
- `mls-page`
- `listings`
- `reie-alerts`
- `reie-dead-letter`

Queue helpers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/redis.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsPageQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/listingQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/alertQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/deadLetterQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/worker.ts`

Queue diagnostics:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/queueDashboard.ts`
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`

Rules:

- API routes enqueue work; workers do heavy processing.
- Failed BullMQ jobs are mirrored into `reie-dead-letter` after final retry exhaustion.
- Dead-letter payloads are bounded and redacted for diagnostics.
- Alert processing can be run by API, script, or worker path, but intentional live sends must be explicit.
- Retry operations should be previewed before live retry.
- Targeted retry should include a specific queue and job id.
- Broad live retry across all queues requires `allowAllLive=true` and should be treated as an exception.
- Dead-letter inspection should not delete, replay, or retry jobs; it is diagnostic only.
- Timeout-bounded queue dashboard output is diagnostic only and should be used before deciding whether to retry, repair, or scale workers.

## Worker Architecture

Entry points:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/main.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`

Commands:

```bash
npm run worker:build
npm run run:worker:mls
npm run run:worker:mls-page
npm run run:worker:alerts
npm run run:worker:alerts:once
npm run run:worker:alerts:once:live
npm run run:worker:crm
node dist/workers/main.js --workers=mls,mls-page
node dist/workers/main.js --workers=alert
```

## API Architecture

Operational APIs:

- `GET /api/mls/status`
- `GET /api/mls/retry`
- `POST /api/mls/retry`
- `GET /api/mls/sync`
- `POST /api/mls/sync`
- `GET /api/mls-sync`
- `POST /api/mls-sync`
- `GET /api/admin/dead-letter`
- `GET /api/admin/crm-tasks`
- `GET /api/admin/crm-tasks/[id]`
- `PATCH /api/admin/crm-tasks/[id]`
- `GET /api/process-alerts`
- `POST /api/process-alerts`

User-facing APIs:

- `GET /api/search`
- `POST /api/save-search`
- `GET /api/track-click`
- `GET /api/unsubscribe`
- `POST /api/valuation`
- `POST /api/logistics`

Webhook APIs:

- `POST /api/webhooks/email-reply`

Rules:

- Return structured JSON errors for API consumers.
- Keep request lifecycle bounded.
- Return partial diagnostics when a database, Redis, queue, or Typesense subsystem is slow.
- Surface recent search index failures and missing index attempts from completed MLS/listing jobs as MLS status diagnostics.
- Keep `/api/search` metadata stable enough for Terminal 5 smoke checks, admin visibility, map diagnostics, and Search Smoke Readiness decisions.
- Keep `/api/mls/status` command metadata stable enough for admin to show `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck`.
- Do not fetch large MLS datasets from API handlers.
- Prefer `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops` for local status and Search Smoke Readiness checks; use `curl --max-time 8` for lower-level status, retry, and admin inspection checks.
- Admin endpoints must require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` in production.
- `/api/track-click` should redirect safely even when tracking fails.

Accepted admin auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

## Admin Architecture

Admin routes:

- `/admin`
- `/admin/dead-letter`

Admin files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/dead-letter/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/DeadLetterInspector.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts`

Current behavior:

- Operations landing page is available at `/admin`.
- Operations landing page shows the current MLS sync envelope, including page size, page count, runtime, page timeout, and worker/check terminals.
- Operations landing page shows first-class search-index health from `/api/mls/status`.
- Operations landing page recent MLS completions show search index attempts, successes, failures, and per-listing index errors when job results include them.
- Operations landing page exposes Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- Operations landing page surfaces CRM task readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, the Terminal 5 CRM scheduler command, smaller-screen-readable CRM command panels, and note-backed Review, Complete, and Dismiss actions that expose `Detail Route` metadata before returning to `List Route` metadata.
- Dead-letter inspector is available at `/admin/dead-letter`.
- Dead-letter API supports bounded inspection by limit, source queue, and state.
- Dead-letter inspector shows active filter summary and inspection terminal context.
- Production requests require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.
- Local development allows access without an admin key only when no key is configured.

Future direction:

- Add broader queue health views.
- Add recent MLS ingestion history and persisted sync summaries.
- Add alert and digest reporting.
- Expand CRM production smoke verification and audit history views.
- Keep destructive actions out of the UI until audit and confirmation flows exist.

## Operations Commands

MLS/search smoke checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Equivalent MLS status curl:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
```

MLS sync route dry-run from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

MLS sync route live enqueue from **Terminal 5: Scripts / curl testing** after status/retry inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Direct MLS script checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Queue dashboard from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
```

Retry status from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
```

Preview failed jobs before retrying from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Targeted or single-queue live retry from **Terminal 5: Scripts / curl testing** after dry-run inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-sync&execute=true&limit=10"
```

Inspect dead-letter records from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

Seed dry-runs from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Production dead-letter inspection:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
```

## Verification

Run after platform-level changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run typecheck
npm run lint
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
```

Run help checks after alert, digest, CRM, or worker script changes:

```bash
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Run smoke checks after status, search, retry, or admin operations API changes while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Run equivalent raw curl checks:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Use the `x-admin-key` header for the same smoke checks when an admin key is configured:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

If any curl returns `HTTP_STATUS:000`, start or restart **Terminal 1: Next.js app** with `npm run dev`.

Known current non-blocking warnings:

- Node `url.parse()` deprecation warnings appear during `next build`.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.

Known current blocker:

- Supabase connectivity can block database-dependent dry-runs, seed checks, CRM scheduler reporting, reindexing, queue retry, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, large programmatic content batch publication, and live database work until `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md` is completed and `npm run supabase:check:json` reports readiness.

## Current Known Gaps

- Local Typesense `properties` and `listings` collections are schema-ready.
- Supabase connectivity from local scripts is currently a blocker until `npm run supabase:check:json` reports readiness. Use `npm run supabase:check` for a human-readable check.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.
- Production Redis provider decision is still open.
- Production Typesense provider decision is still open.
- MLS sync scheduling needs a production scheduler.
- Recurring email traffic, recurring alert or digest scheduling, and CRM scheduling need production workflow decisions.
- Production smoke verification still needs `npm run supabase:check:json`, `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Admin UI has MLS sync envelope visibility and dead-letter inspection, but broader queue controls are still pending.
- CRM closure audit controls, note-backed completion/dismissal, CRM API Inspection metadata, and failed detail-route preservation are implemented locally; production admin smoke verification still needs to run after Terminal 1 is running and `npm run supabase:check:json` reports readiness.
- Production-size MLS throughput still needs load testing.
- Placeholder property media should continue being replaced by reliable MLS/media handling.
- Seed scripts now create local photo rows, but real MLS media remains the production source of truth.
- Map/listing polish should continue toward the Master V 7.0 visual target.

## Architecture Rule Summary

- Keep the public app fast.
- Keep ingestion, seed writes, and email outside normal page rendering.
- Use queues for heavy or retryable work.
- Preserve Postgres as source of truth.
- Treat Typesense as replaceable search infrastructure.
- Keep `properties` and `listings` schema-compatible for shared search surfaces.
- Make every MLS operation idempotent.
- Make every seed script explicit, bounded, and terminal-run.
- Make every alert deduplicated.
- Preview failed-job retries before live retry.
- Keep digest and alert dry-runs read-only, and run Supabase-backed digest or alert dry-runs only after `npm run supabase:check:json` reports readiness.
- Keep recurring email traffic, including recurring alert or digest sends, disabled when `npm run supabase:check:json` reports blocked, search-index health is degraded, `meta.smoke.ready=false`, public search smoke blockers are present, or timeout-bounded queue diagnostics are unacceptable.
- Inspect dead-letter records before deciding whether a retry or code fix is appropriate.
- Keep SEO authority surfaces crawlable, internally linked, locally specific, and tied clearly to David Quinn Group.
- Gate CRM-informed content planning behind protected CRM readiness, closure audit coverage, API Inspection metadata, and failed detail-route preservation.
- Keep live-inventory claims and MLS-backed public expansion gated behind `npm run supabase:check:json` readiness, search-index health, Search Smoke Readiness, indexing behavior, and acceptable timeout-bounded queue diagnostics.
- Keep large programmatic content batch publication gated behind `npm run supabase:check:json`, verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/platform-architecture.md -->
