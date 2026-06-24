# Real Estate Intelligence Engine

David Quinn Group's Colorado Real Estate Intelligence Engine is a Next.js platform for property search, MLS ingestion, saved-search alerts, digest emails, CRM lead intelligence, local market intelligence, operational recovery, dead-letter inspection, seed-data workflows, scheduler planning, and SEO authority across Colorado with emphasis on Boulder, Denver, and the Front Range.

This repo is the working implementation path for `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`.

Master V7 traceability is tracked in `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`.

Authoritative Master V7 source PDF: `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`.

## Product Direction

REIE should become a public intelligence layer, not only a property search site.

Core outcomes:

- Smooth Colorado property search with map/sidebar/listing interactions.
- Reliable MLS Grid ingestion with real listing media instead of placeholders.
- Search/map diagnostics that show source, health, access level, active filters, bounds status, returned count, mapped count, coordinate-filtered count, and request timing.
- Property intelligence fields populated during ingestion, including `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- Saved-search alerts and digest emails that drive useful client engagement.
- Tracked listing clicks, unsubscribe handling, preference learning, and CRM lead intelligence.
- Crawlable city, neighborhood, market, property, article, and tool surfaces.
- Operational tooling for sync status, retry, dead-letter inspection, seed verification, scheduler planning, CRM task reporting, and CRM scheduler/admin readiness.
- Clear David Quinn Group authority signals for Colorado, Boulder, Denver, and nearby Front Range markets.

## Terminal Map

Use this layout while developing:

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, `npm run smoke:ops`, bounded live syncs, seed commands, CRM help, smoke checks, curl checks, Typesense repair |

## Local Startup

Start infrastructure in **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

This starts:

- Redis on `localhost:6379` for BullMQ queues.
- Typesense on `localhost:8109` for search.

Start the app in **Terminal 1: Next.js app**:

```bash
npm run dev
```

Build worker and script files after TypeScript changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
```

Use `.env.example` as the non-secret local environment template. Copy it to `.env.local`, replace placeholders with active provider values, and verify Supabase before database-backed work:

```bash
npm run supabase:check:json
npm run supabase:check
```

Start workers in **Terminal 3: Coordinator**:

```bash
npm run run:worker:mls
npm run run:worker:mls-page
```

The coordinator can run all workers or a subset:

```bash
node dist/workers/main.js --workers=mls,mls-page,alert
node dist/workers/main.js --workers=alert
```

## Core Runtime Services

- Next.js app: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Dead-letter UI: `http://localhost:3000/admin/dead-letter`
- Redis: `redis://localhost:6379`
- Typesense: `http://localhost:8109`
- Typesense collections: `properties`, `listings`
- MLS sync queue: `mls-sync`
- MLS page queue: `mls-page`
- Alert queue: `reie-alerts`
- Listing queue: `listings`
- Dead-letter queue: `reie-dead-letter`

## Admin Protection

Operational APIs are protected in production by `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Local development can bypass the key only when neither admin key environment variable is configured. Production should always configure one of the admin key variables.

Protected operational APIs:

- `GET /api/mls/status`
- `GET /api/mls/retry`
- `POST /api/mls/retry`
- `GET /api/mls/sync`
- `POST /api/mls/sync`
- `GET /api/mls-sync`
- `POST /api/mls-sync`
- `GET /api/admin/dead-letter`
- `GET /api/admin/control-state`
- `PATCH /api/admin/control-state`
- `GET /api/admin/crm-tasks`
- `GET /api/admin/crm-tasks/[id]`
- `PATCH /api/admin/crm-tasks/[id]`
- `GET /api/admin/intake-signals`
- `GET /api/admin/intake-signals/[id]`
- `PATCH /api/admin/intake-signals/[id]`
- `GET /api/process-alerts`
- `POST /api/process-alerts`

## Generated Output

- `dist/` is generated worker and script output.
- The known stale legacy MLS generated artifacts were removed on June 21 08:28 MDT; `npm run worker:build` passed and the no-source `dist/*.js` scan returned empty.
- Source scans remain authoritative when reviewing intended behavior.

## MLS Sync

Queue a bounded dry-run MLS sync from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Compatibility route:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Run direct script sync from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Queue a bounded live sync from **Terminal 5: Scripts / curl testing** only after dry-run, status, retry, and dead-letter inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Run the compatibility entrypoint in no-write mode:

```bash
node dist/scripts/fetchMLS.js
```

Run the compatibility entrypoint through the active sync pipeline:

```bash
node dist/scripts/fetchMLS.js --sync --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Read MLS operations status:

```bash
npm run smoke:mls-status
```

Production status request:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/mls/status"
```

MLS intelligence behavior:

- Use `dryRun=true` or `npm run run:mls-sync:dry` before live MLS work.
- Direct `node dist/scripts/mlsSync.js` defaults to dry-run.
- Use `execute=true`, `dryRun=false`, `--execute`, or `--live` for intentional live MLS syncs; scheduler live commands should still include explicit page, page-size, start-page, JSON, and page-timeout bounds.
- Keep `pageTimeoutMs` / `--page-timeout-ms` explicit for scheduled or API-triggered syncs.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- `scripts/fetchMLS.ts` is a compatibility wrapper around the active `syncMLSGrid()` path.
- `upsertListing.ts` writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- `processListing.ts` updates Typesense through `updateSearchIndex.ts` after successful upsert.
- `processListing.ts` exposes listing-level media extraction diagnostics for direct media arrays, nested media arrays, top-level photo fields, extracted media count, and ignored media item count before `processPhotos.ts` decides whether to replace `PropertyPhoto` rows.
- `processListingsBatch.ts` aggregates those listing-level media diagnostics into batch counts for listings with media, direct arrays, nested arrays, top-level photo fields, extracted media items, ignored media items, and per-field media-shape frequency without exposing raw media URLs.
- Page-worker completion logs, `/api/mls/status`, completed-job admin summaries, and `/api/mls/sync` dry-run metric and inspection hints surface aggregate `mediaDiagnostics` before live sync volume is increased.
- Listing jobs, page-worker jobs, batch processing, direct syncs, `/api/mls/status`, and `/admin` can surface search-index attempts, successes, failures, and errors.
- `/api/mls/status` exposes a first-class `searchIndex` block with attempted, succeeded, failed, unknown, health, diagnostics, and recent index outcomes.
- `/api/mls/status` exposes a first-class `mediaDiagnostics` block with checked jobs, jobs carrying media diagnostics, listing/media extraction counts, ignored-media counts, direct/nested/top-level media shape counts, and health.
- `/api/mls/status` exposes first-class smoke and Supabase preflight commands through `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.supabaseCheck`, and `commands.supabaseCheckJson`.
- `/api/mls/status` preserves raw status/search API command compatibility through `commands.rawStatus` and `commands.rawSearchCheck`.
- `/admin` labels Terminal 5 public search verification as Search Smoke Readiness and expects `meta.smoke.ready=true` with no blockers.
- `npm run smoke:ops` checks MLS status, retry/dead-letter status, public search, Master Control Panel control state, recent intake signals, alert status, consolidated notification readiness, direct saved-search alert notification readiness, direct property-inquiry notification readiness, aggregate launch readiness, and public experience assertions. It sends `x-admin-key` automatically when `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` is configured.
- `npm run check:notification-readiness` runs the non-sending saved-search alert, property-inquiry notification, and aggregate launch notification readiness checks, treats expected blocked readiness exits as parsed readiness results, and emits one Terminal 5 JSON summary with bounded failed and warning child checks.
- `npm run check:notification-readiness:strict` emits the same non-sending JSON but exits nonzero when aggregate notification readiness is blocked.
- `npm run check:notification-readiness:strict-contract` verifies the strict fail-closed contract in the current environment and in a dummy-recipient dry-run environment without sending email or mutating rows.
- `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` suppresses high-priority property-inquiry notification sends for local/staging validation; launch readiness treats that flag as a live-send blocker.
- Treat `indexFailed > 0` as degraded search freshness even when Postgres upserts succeed.
- Treat `npm run supabase:check:json`, `npm run check:notification-readiness:strict`, `npm run check:launch-readiness`, `npm run smoke:mls-status`, `npm run smoke:search`, and timeout-bounded queue diagnostics as production-readiness gates before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, live-inventory claims, MLS-backed public expansion, large programmatic content batch publication, or recurring email traffic.
- `processPhotos.ts` preserves existing photos when MLS returns no usable media.
- Top-level listing photo URL fields are extracted without forcing `MediaType: image`, so top-level PDF URLs remain subject to the non-image media guard.
- Legacy IRES/helper cleanup is complete, including deleted root-level demo MLS helpers.

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

## MLS Retry

Inspect queue status and retry policy from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
```

Read retry status from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
```

Preview failed-job retries before changing queue state:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Retry a targeted queue only after reviewing failures. Live retry requires `execute=true` or `dryRun=false`:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-page&execute=true&limit=25"
```

Use targeted queue/job retry when possible. Broad live retry across queues requires `allowAllLive=true` and should remain exceptional.

Supported retry queues:

- `all`
- `mls-page`
- `mls-sync`
- `alerts`
- `listings`

## Admin Dead-Letter Inspection

Open the admin UI after Terminal 1 is running:

```text
http://localhost:3000/admin/dead-letter
```

Inspect dead-letter records from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

Filter by source queue and states:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=mls-page&states=waiting,failed&limit=25"
```

Production requests require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
```

This endpoint is diagnostic only. It does not delete, replay, or retry jobs. Use `/api/mls/retry` with `dryRun=true` before any live retry.

## Typesense

Run Typesense commands in **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** infrastructure is running.

Build script output first:

```bash
npm run worker:build
```

Canonical schema source:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`

Canonical indexing paths:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`

Both `properties` and `listings` must use the same canonical field set. The schema validates required fields and required facets, including faceted `neighborhood`, plus REIE intelligence fields used by search, map, market, and neighborhood pages.

Search result diagnostics:

- `/api/search` returns top-level `source`, `health`, `accessLevel`, `boundsApplied`, `filtersApplied`, `durationMs`, `returned`, `mapped`, `coordinateFiltered`, `meta.source`, `meta.smoke`, and Typesense query/filter metadata.
- `meta.smoke` reports `command`, `terminal`, `ready`, `blockers`, and structured checks for Terminal 5 `npm run smoke:search` verification.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts` exports `searchPropertiesWithMeta()` for server-rendered search pages with matching map metadata.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx` passes normalized server search metadata into the public `/search` experience.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx` preserves `/api/search` metadata for the homepage map and supplies a compatible fallback smoke diagnostic when metadata is missing.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`, and `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx` keep sidebar, map, access-level filtering, and metadata aligned.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx` exposes metadata through `data-search-*` and `data-search-smoke-*` attributes plus a compact map diagnostic overlay.

Terminal 5 Search Smoke Readiness check while Terminal 1 is running:

```bash
npm run smoke:search
```

Primary local repair sequence:

```bash
npm run worker:build
npm run typesense:init
npm run supabase:check:json
npm run typesense:reindex
```

If Supabase is unreachable and only the local collection schema needs repair:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

Inspection and compatibility commands:

```bash
npm run typesense:collections:check
npm run typesense:collections
npm run typesense:reset-collections
```

Bounded reindex without deleting collections:

```bash
node dist/scripts/index.js --batch-size=100 --max-records=100
```

Collection-only schema repair:

```bash
node dist/scripts/index.js --reset --collections-only
```

Compatibility helpers use the canonical schema and validate required fields/facets:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js`

Seed helpers write bounded test data, create `PropertyPhoto` rows, and index through `indexListing()` instead of creating ad hoc Typesense collections:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

If `npm run build` logs that the local Typesense `listings` collection is stale or missing faceted `neighborhood`, the code schema is valid but the live local collection needs repair. Run:

```bash
npm run worker:build
npm run typesense:init
npm run supabase:check:json
npm run typesense:reindex
```

## Seed Data

Run seed commands in **Terminal 5: Scripts / curl testing** after `npm run worker:build` and `npm run supabase:check:json` report readiness.

Use dry-runs first:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Write the bounded authority seed:

```bash
npm run run:seed:quick
```

Write the broader test property seed:

```bash
npm run run:seed:test
```

When Typesense is offline or intentionally being repaired separately, write only the database and photo rows:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Seed command behavior:

- `quickSeed.ts` writes a small David Quinn Group authority seed.
- `seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Both scripts replace existing seeded `PropertyPhoto` rows for their own properties.
- Both scripts report database, photo, and per-collection Typesense index status.
- Dry-runs are read-only, but they still require `npm run supabase:check:json` readiness because seed inventory checks touch Supabase.
- Live and no-index seed write commands require `npm run supabase:check:json` readiness before any database rows are written.
- Indexed seed commands also require Typesense to be running and collections to match the canonical schema.
- Seed scripts must not run from app startup, API routes, page rendering, or scheduled production jobs.

## Alerts And Digests

Show alert CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
```

Preview saved-search alert processing without sending email:

```bash
npm run run:alerts:dry
```

Check aggregate launch readiness before live alert, digest, or recurring email work:

```bash
npm run check:launch-readiness
```

The aggregate readiness check does not send email or mutate queue rows. Treat `readiness.level="blocked"` as a live notification blocker.

The base alert script is dry-run by default. Live sends require the explicit live script after dry-run and aggregate launch-readiness clearance:

```bash
npm run run:alerts:live -- --limit 25
```

Process alerts once through the worker path in dry-run batch mode:

```bash
npm run run:worker:alerts:once
```

Explicit live one-shot worker run:

```bash
npm run run:worker:alerts:once:live
```

Run the alert worker continuously from **Terminal 3: Coordinator**:

```bash
npm run run:worker:alerts
```

Continuous alert worker mode consumes queue jobs live. Use it only after recurring email traffic readiness is verified through `npm run check:launch-readiness`, `npm run supabase:check:json`, alert send behavior, sender domain, unsubscribe, click tracking, internal live-send tests, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics.

Process alerts through the protected API in dry-run mode:

```bash
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"
```

Show digest CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest -- --help
```

Preview grouped digest sends without sending email:

```bash
npm run run:digest:dry -- --limit 25
```

Run grouped digest sends:

```bash
npm run run:digest -- --limit 25
```

Email behavior:

- Alert and digest sends happen outside page rendering.
- Alert live sends claim alerts with `pending -> processing -> sent`.
- Alert and digest dry-runs are read-only.
- Worker dry-run mode is limited to one-shot or batch mode so it cannot silently consume queue jobs.
- Unsubscribe links route through `/api/unsubscribe`.
- Listing links can route through `/api/track-click` when user context is available.
- `EmailLog` records send metadata.
- Recurring email traffic, including recurring alert, digest, or property-inquiry notification sends, should wait until `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL` is configured, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false, `npm run check:launch-readiness` is not blocked, `npm run supabase:check:json`, sender domain, unsubscribe, click tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Treat blocked `npm run check:launch-readiness`, missing property-inquiry recipient routing, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true`, failed `npm run supabase:check:json`, degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic because alert and digest clicks land back on search and property pages.

## CRM Intelligence

Show CRM CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Inspect active CRM tasks:

```bash
npm run run:crm:active
npm run run:crm:pending
npm run run:crm:reviewing
npm run run:crm:all
```

Scheduler-safe CRM JSON report:

```bash
npm run run:crm:scheduler
```

Terminal 5 CRM reports are read-only and include closure audit counts plus the same CRM readiness gates used by `/api/admin/crm-tasks`. Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs receive one machine-readable payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Use `npm run run:crm:scheduler` for recurring production scheduler jobs. Use `npm run run:crm:active` for manual Terminal 5 operator review when human-readable output is preferred.

Before enabling the first recurring provider schedule, follow the CRM first-live scheduler test in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.

Current CRM behavior:

- Click tracking records `UserInteraction`, matching `AlertQueue.clickedAt`, and `User.heatScore`.
- Preference learning updates `UserPreference` from clicked alert payloads.
- Hot lead ranking scores recency, heat score, and listing context.
- `createTask()` creates `PRE_DISCOVERY_BRIEF` tasks through `prisma.cRMTask`.
- Saved-search intake creates `strategy_intake` CRM tasks with alert-readiness metadata.
- `/api/admin/crm-tasks` lists active, pending, reviewing, completed, dismissed, or all CRM queues.
- `/api/admin/crm-tasks` includes `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also include closure-audit counts for completed and dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
- `/api/admin/crm-tasks` includes a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
- `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
- `/api/admin/crm-tasks/[id]` requires a non-empty review note before a task can be marked `completed` or `dismissed`.
- `/admin` surfaces CRM task readiness, readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, the visible `npm run run:crm:scheduler` command, and note-backed Review, Complete, and Dismiss actions.
- `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
- `/admin` CRM command panels are structured to remain readable on smaller screens.
- CRM task completion and dismissal remain human-reviewed through the admin review flow.

CRM readiness levels:

- `ready`: closure audit is clean and no active CRM task blockers were detected.
- `watch`: closure audit is clean, but active review work or incomplete alert criteria need attention.
- `blocked`: closed CRM tasks are missing review notes and scheduler cadence or automation increases should pause.

Inspect CRM task APIs while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. The list route should also include `summary`, `audit`, and `readiness` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

## Production Scheduler

The scheduler plan is staged and conservative. Full details live in:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`

Rollout order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index diagnostics review through `npm run smoke:mls-status`.
4. Search Smoke Readiness verification through `npm run smoke:search`, including `meta.smoke.ready=true` and no blockers.
5. Timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
6. Large programmatic content batch publication gate verification after `npm run supabase:check:json` reports readiness for data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics before MLS-backed public expansion.
7. MLS sync recurring schedule.
8. CRM reporting.
9. Alert dry-run.
10. Internal alert live test.
11. Alert live schedule.
12. Digest dry-run.
13. Internal digest live test.
14. Digest live schedule.
15. Manual Typesense repair and reindex only when required.

Conservative starting schedule:

| Job | Cadence | Command |
| --- | --- | --- |
| MLS sync dry-run | hourly during validation | `npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000` |
| MLS sync live | hourly after approval | `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000` |
| Alert processing dry-run | every 30 minutes during validation | `npm run run:alerts:dry -- --limit 50` |
| Alert processing live | every 30 minutes after approval and non-blocked launch readiness | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |
| Typesense schema repair | manual only | `npm run typesense:init` |
| Typesense reindex | manual only after `npm run supabase:check:json` readiness | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

## API Surfaces

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

`GET /api/search` returns source, health, access level, filters, bounds, returned, mapped, coordinate-filtered, duration, `meta.source`, `meta.smoke`, and Typesense query/filter metadata so map/search issues can be separated into Typesense, database fallback, bounds/filter behavior, access-level filtering, request timing, coordinate-filtering causes, and Terminal 5 smoke-readiness blockers.

`GET /api/mls/status` returns MLS, queue, dead-letter, freshness, and search-index diagnostics. Its `commands` block includes `smokeOps`, `smokeMlsStatus`, and `smokeSearch` for Terminal 5 operator guidance, plus raw curl compatibility fields for API-level inspection. `/admin` surfaces the search command as Search Smoke Readiness and states the `meta.smoke.ready=true` pass condition.

Webhook APIs:

- `POST /api/webhooks/email-reply`

## Verification

Run required checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run supabase:check:json
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
```

Validate Docker Compose from **Terminal 4: Docker / Typesense**:

```bash
docker compose config
```

Safe operational smoke checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Equivalent raw curl checks:

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

Help checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Database-dependent checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run supabase:check:json
npm run run:alerts:dry
npm run run:worker:alerts:dry
npm run run:digest:dry -- --limit 1
npm run run:crm:active
```

If curl returns `HTTP_STATUS:000`, start or restart Terminal 1 with:

```bash
npm run dev
```

## Current Local Repair Sequence

Use this sequence after Typesense schema changes.

Terminal 4:

```bash
npm run infra:up
```

Terminal 5:

```bash
npm run worker:build
npm run typesense:init
npm run supabase:check:json
npm run typesense:reindex
```

If Supabase is unreachable and only the local collection schema needs repair, run:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

## Key Documentation

- `PROJECT_SYSTEM.md`
- `docs/CHAT_START.md`
- `docs/STATEoftheUNION`
- `docs/atlas-platform-plan.md`
- `docs/platform-architecture.md`
- `docs/production-architecture.md`
- `docs/production-scheduler-plan.md`
- `docs/launch-core-checklist.md`
- `docs/legacy-mls-cleanup-plan.md`
- `docs/mls-ingestion.md`
- `docs/alert-architecture.md`
- `docs/email-system.md`
- `docs/content-architecture.md`

## SEO And Authority Direction

REIE should strengthen David Quinn Group's topical authority by combining:

- Original Colorado market intelligence.
- Boulder and Denver neighborhood expertise.
- Property-level intelligence pages.
- Internally linked city, neighborhood, market, article, and listing pages.
- Structured schema for real estate agent, article, FAQ, and local market content.
- Fresh MLS-backed property inventory and useful property intelligence.
- Consistent David Quinn Group entity signals across public pages, schema, email, and admin/CRM surfaces.
- CRM engagement signals for content planning only after protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and API Inspection metadata are visible.
- Live-inventory claims and MLS-backed public expansion only after `npm run supabase:check:json` reports readiness and search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- Large programmatic content batch publication only after `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

The product goal is not just search. It is a public intelligence layer that helps Google and clients understand David Quinn Group as a trusted Colorado authority.

## Current Known Gaps

- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` and refreshed with `npm run typesense:reindex` on June 16, 2026.
- `npm run supabase:check:json` currently reports readiness, but it remains a required gate before Supabase-backed dry-runs, reindexing, queue retry, scheduler activation, or live database work.
- Aggregate notification launch readiness is currently blocked until `PROPERTY_INQUIRY_NOTIFY_TO` or `REIE_INTERNAL_EMAIL` is configured for property-inquiry delivery and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false; inspect the consolidated blocker with `npm run check:notification-readiness`, the fail-closed gate with `npm run check:notification-readiness:strict`, the strict contract with `npm run check:notification-readiness:strict-contract`, and the direct blocker with `npm run check:property-inquiry-notification:readiness`.
- June 21 verification is current through the 10:22 MDT fast verification and the 10:21 MDT MLS photo media-hardening ops smoke after the 07:31 MDT Supabase refresh and 08:14 MDT production build: `npm run check:fast`, `npm run build`, `npm run supabase:check:json`, and `npm run smoke:ops` passed. Current runtime posture is MLS status `busy` / `watch`, search `typesense` healthy with `meta.smoke.ready=true`, saved-search alert readiness `watch` with 197 pending / 0 failed / 0 processing, property-inquiry notification readiness `blocked`, and aggregate launch readiness `blocked`; production still needs one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Known stale legacy MLS generated artifacts in `dist/` were cleaned on June 21 08:28 MDT; `npm run worker:build` passed afterward and no generated JavaScript files lacked live TypeScript sources.
- MLS photo normalization now rejects string non-image media URLs and PDF/document/brochure/video/floor-plan/virtual-tour records before replacing `PropertyPhoto` rows; `npm run smoke:ops` covers this with PDF and misleading property-media fixtures.
- Production Redis provider decision is open.
- Production Typesense provider decision is open.
- Production worker host and scheduler provider decisions are open.
- Recurring email traffic, recurring alert, digest, or property-inquiry notification scheduling, and CRM scheduling need final production cadence decisions.
- Email domain authentication must be confirmed before recurring email traffic.
- Email client visual QA has not been completed.
- CRM closure audit controls, note-backed completion/dismissal, CRM API Inspection metadata, and failed detail-route preservation are implemented locally and covered by the refreshed local `npm run smoke:ops`; production workflow still needs live environment confirmation before scheduler or recurring-email activation.
- Large programmatic content batch publication should wait for `npm run supabase:check:json`, verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/README.md -->
