# MLS Ingestion

MLS ingestion keeps the Real Estate Intelligence Engine current. It fetches MLS Grid data, normalizes listing fields, stores media, updates search indexes, matches saved searches, queues alerts, and exposes operational status without blocking public page rendering.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Current Role In REIE

MLS ingestion supports four product goals:

- Keep public search and map inventory current.
- Replace placeholder media with reliable listing media.
- Create saved-search alert opportunities from new or changed listings.
- Support SEO authority surfaces with stable, fresh, MLS-backed inventory only after Search Smoke Readiness, search-index health, indexing behavior, and timeout-bounded queue diagnostics pass for large programmatic content batch publication.

No MLS operation should require a public page render to complete a long-running job. Ingestion must remain bounded, observable, idempotent, and recoverable.

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, bounded live syncs, seed commands, smoke scripts, curl checks, Typesense repair |

## Architecture

Primary queues:

- `mls-sync`: starts bounded sync runs.
- `mls-page`: fetches and processes MLS page batches.
- `listings`: processes individual listing payloads when needed.
- `reie-alerts`: processes saved-search alert jobs.
- `reie-dead-letter`: stores structured failed-job records.

Primary workers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/main.ts`

Primary MLS modules:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mlsGridClient.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListingsBatch.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts`

Primary Typesense modules:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`

Primary operational routes:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls-sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/retry/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts`

Generated output:

- `dist/` is generated worker and script output.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

## Admin Protection

Operational routes are protected in production by `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`

Protected MLS and queue routes:

- `GET /api/mls/status`
- `GET /api/mls/retry`
- `POST /api/mls/retry`
- `GET /api/mls/sync`
- `POST /api/mls/sync`
- `GET /api/mls-sync`
- `POST /api/mls-sync`
- `GET /api/admin/dead-letter`

Local development can bypass the key only when neither admin key environment variable is configured.

## Data Flow

1. `/api/mls/sync`, `/api/mls-sync`, or `scripts/mlsSync.ts` starts a bounded sync.
2. `workers/mlsWorker.ts` consumes `mls-sync` jobs when the queue path is used.
3. `syncMLSGrid()` reads `MlsSyncState` and enforces sync lock behavior.
4. MLS Grid pages are fetched with bounded page size, page count, runtime, delay, and per-page timeout.
5. Page payloads are processed through batch/listing modules.
6. `processListing()` identifies the listing, upserts it, updates the search index, processes photos, and triggers saved-search matching.
7. `upsertListing()` maps MLS values into `Property`, preserves the internal property ID, and writes REIE intelligence fields.
8. `processPhotos()` normalizes media and preserves existing photos when MLS returns no usable photos.
9. `updateSearchIndex()` indexes the updated listing into Typesense when configured.
10. Listing, batch, page-worker, direct sync, `/api/mls/status`, and `/admin` surfaces report search index attempts, successes, failures, and missing attempts.
11. Saved-search matches create `AlertEvent` and `AlertQueue` work.
12. Alert and digest processors handle email outside the ingestion lifecycle.
13. Click tracking and CRM workflows can later use alert engagement as lead intelligence.

## Local Startup

Start Redis and Typesense from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Start the app from **Terminal 1: Next.js app**:

```bash
npm run dev
```

Build worker/script output from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
```

Start the MLS coordinator from **Terminal 3: Coordinator**:

```bash
npm run run:worker:mls
```

Run only the MLS page worker from **Terminal 2: MLS Page Worker** when isolating page processing:

```bash
npm run run:worker:mls-page
```

## Safe First Sync Test

Use **Terminal 5: Scripts / curl testing**.

Queue a bounded API dry-run while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Compatibility route dry-run:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Check status:

```bash
npm run smoke:mls-status
npm run smoke:search
```

Preview a bounded direct script sync without Redis or MLS Grid calls:

```bash
npm run run:mls-sync:dry
```

Run a bounded direct script sync only after the dry-run plan is correct:

```bash
npm run run:mls-sync:live
```

Structured direct script dry-run for scheduler logs:

```bash
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Run the compatibility entrypoint in no-write mode:

```bash
node dist/scripts/fetchMLS.js
```

Run the compatibility entrypoint against the active sync pipeline:

```bash
node dist/scripts/fetchMLS.js --sync --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

## Sync Controls

Accepted bounded controls:

- `maxPages`
- `pageSize`
- `startPage`
- `maxRuntimeMs`
- `rateDelayMs`
- `pageTimeoutMs`
- `includeMedia`
- `dryRun`
- `execute`
- `force`

Examples from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=2&pageSize=25&startPage=0&dryRun=true"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=10&pageTimeoutMs=30000&includeMedia=false&dryRun=true"
npm run run:mls-sync:dry
npm run run:mls-sync:help
```

Production status example:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/mls/status"
```

Rules:

- Start with `maxPages=1`, `pageSize=5`, and `dryRun=true` after code changes.
- Use `execute=true`, `dryRun=false`, `--execute`, `--live`, or `npm run run:mls-sync:live` only after dry-run output is understood.
- Direct `node dist/scripts/mlsSync.js` defaults to dry-run.
- Use `force=true` only after inspecting failed queue jobs and running a retry dry-run.
- Keep `pageTimeoutMs` explicit for scheduler and API-triggered syncs.
- Do not run large syncs until Redis, Typesense, Supabase, workers, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics are healthy.
- Do not enqueue a second sync while a healthy sync is active.
- Treat `mlsId` or listing key as the external identity key.
- Keep ingestion idempotent.

## MLS Grid Fetching

Two active fetch paths exist:

- `fetchMLSPage()` is used by coordinator-style page sync.
- `fetchMLSGridListings()` is used by `mls-page` worker jobs.

Both paths support Media expansion and retry without Media when MLS Grid rejects `$expand=Media`.

Required environment variables:

- `MLS_GRID_BASE_URL`
- `MLS_GRID_TOKEN`

Optional environment variables:

- `MLS_GRID_INCLUDE_MEDIA=false`
- `MLS_PAGE_TIMEOUT_MS=30000`

Fetching rules:

- Keep request timeouts bounded.
- Retry without Media only when MLS Grid indicates Media expansion is unsupported or rejected.
- Keep payload shape normalization in MLS modules, not in API handlers.

## Listing Processing

`processListing()` is the shared listing pipeline:

1. Identify listing key or MLS number.
2. Upsert property through `upsertListing()`.
3. Update Typesense through `updateSearchIndex()`.
4. Extract media payloads from MLS fields.
5. Process photos through `processPhotos()`.
6. Run saved-search matching through `matchAndNotify()`.
7. Return warnings plus search index status for worker and sync diagnostics.

`upsertListing()`:

- Maps MLS values into the `Property` model.
- Preserves the internal property ID.
- Keeps ingestion idempotent.
- Writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- Uses listing remarks and available MLS values for early GC-forensics signals.
- Should not erase useful existing data with empty MLS payload values.

`processPhotos()`:

- Deduplicates photo URLs.
- Preserves existing photos when no valid MLS photos are present.
- Respects media order fields.
- Writes `PropertyPhoto` rows in batches.
- Supports the current product goal of replacing placeholder media with reliable MLS/media images.

## Typesense Search Indexing

Typesense runs locally through Docker on `localhost:8109`.

Canonical collections:

- `properties`
- `listings`

Both collections use the schema exported from `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`. The schema requires search-critical fields and required facets, including faceted `neighborhood`, so market and neighborhood pages can query inventory safely.

Single-listing indexing paths:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`

Bulk reindex path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`

Compatibility helpers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js`

Rules:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts` is the canonical schema source.
- `scripts/initTypesense.ts`, `scripts/index.ts`, `scripts/createTypesenseCollection.ts`, and `scripts/createCollection.js` validate required fields and facets before or after collection creation.
- `processListing()` should call `updateSearchIndex()` after a successful upsert so MLS imports become searchable without a separate bulk reindex.
- Search index failures should remain non-destructive but visible in listing job results, batch summaries, direct sync summaries, `/api/mls/status`, and `/admin`.
- `/api/mls/status` should expose a first-class `searchIndex` block with checked jobs, attempts, successes, failures, unattempted jobs, unknown jobs, health, diagnostics, and recent completed job details.
- `/api/mls/status` should expose Terminal 5 smoke command guidance through `commands.smokeOps`, `commands.smokeMlsStatus`, and `commands.smokeSearch`, while preserving raw API inspection commands through `commands.rawStatus` and `commands.rawSearchCheck`.
- `/admin` should surface search-index health and Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- Treat `indexFailed > 0` as degraded search freshness even if Postgres upserts succeeded.
- Verify `npm run smoke:search` metadata after sync/indexing changes. Expected metadata includes source, `meta.source`, health, access level, active filters, bounds state, duration, returned count, mapped count, coordinate-filtered count, `meta.smoke.ready=true`, empty `meta.smoke.blockers`, and Typesense query/filter context.
- Seed helpers must not create ad hoc partial Typesense collections.
- Seed helpers should write bounded test data, create `PropertyPhoto` rows, and index through `indexListing()` so both `properties` and `listings` stay aligned.
- Treat Typesense as rebuildable search infrastructure. Supabase/Postgres remains the source of truth.

## Typesense Repair

Use this sequence after schema changes or when build logs say the local `listings` collection is stale.

Start infrastructure from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Build compiled worker/script output and initialize canonical collections from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typesense:init
```

Reindex Supabase properties into both collections from **Terminal 5: Scripts / curl testing** when Supabase is reachable:

```bash
npm run typesense:reindex
```

If Supabase is not reachable and only schema repair is needed, stop after `npm run typesense:init` and rerun `npm run build`.

Inspection and compatibility commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run typesense:collections:check
npm run typesense:collections
npm run typesense:reset-collections
```

Expected stale-collection warning shape:

```text
Neighborhood inventory lookup skipped because the local Typesense listings collection is stale: Typesense schema listings is invalid: ...
```

Current stale warning includes missing required fields/facets, `price` type mismatch, and default sort mismatch. That warning means code schema validation is working. The live local Typesense collection still needs repair and, when Supabase is reachable, reindexing.

## Seed Data

Run seed commands in **Terminal 5: Scripts / curl testing** after building compiled worker/script output:

```bash
npm run worker:build
```

Use dry-runs first:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Write the bounded David Quinn Group authority seed:

```bash
npm run run:seed:quick
```

Write the broader Boulder/Louisville test inventory:

```bash
npm run run:seed:test
```

When Typesense is offline, stale, or being repaired separately, write only database and photo rows:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Seed command behavior:

- `quickSeed.ts` writes a small authority seed for local REIE zero-state testing.
- `seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Both scripts create or update `Property` rows.
- Both scripts replace existing seeded `PropertyPhoto` rows for their own properties.
- Both scripts report database, photo, and per-collection Typesense status.
- Dry-runs are safe verification checks.
- Live seed commands require Supabase database connectivity.
- Indexed seed commands also require Typesense to be running with the canonical `properties` and `listings` schemas.
- Seed scripts must not run from app startup, API routes, page rendering, or scheduled production jobs.

## Sync State

`MlsSyncState` tracks:

- `lastSync`
- `lastIntelligenceSync`
- `lastPage`
- `totalRecords`
- `isSyncing`

Rules:

- The sync lock prevents concurrent healthy sync runs.
- A future run may continue after a stale lock window.
- Status output should make active, stale, degraded, and idle states visible.

## Status Endpoint

Read status from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
```

The route is dynamic, returns no-store JSON, and uses subsystem timeouts. A slow database or Redis read should produce partial diagnostics instead of hanging the whole endpoint.

Top-level fields:

- `success`
- `status`
- `engine`
- `module`
- `generatedAt`
- `timeoutMs`
- `indexingConfigured`
- `redis`
- `syncDefaults`
- `syncLimits`
- `diagnostics`
- `syncState`
- `propertyFreshness`
- `queues`
- `deadLetter`
- `searchIndex`
- `recentFailedJobs`
- `recentCompletedJobs`

Status interpretation:

- `healthy`: no active work, no diagnostics, and no queue/dead-letter failures.
- `busy`: sync is active, or queues have waiting, active, or delayed work.
- `degraded`: diagnostics are present, any queue has failed jobs, dead-letter waiting count is above zero, recent completed MLS/listing jobs report search index failures, or processed listings did not attempt indexing.

Search metadata check from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:search
```

The search smoke response should include `meta.smoke.ready=true` and no `meta.smoke.blockers`, and timeout-bounded queue diagnostics should be acceptable, before raising ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, live-inventory claims, MLS-backed public expansion, recurring email traffic, or large programmatic content batch publication.

## Retry Endpoint

Read retry status from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
```

Supported retry queue values:

- `all`
- `mls-page`
- `mls-sync`
- `alerts`
- `listings`

Retry controls:

- `queue`: target queue, defaults to `all`.
- `dryRun`: preview only when `true`, `1`, or `yes`.
- `execute`: live retry when `true`, `1`, or `yes`.
- `allowAllLive`: permits broad live retry across all queues only when deliberately set.
- `limit`: failed jobs to inspect per selected queue, default `100`, max `500`.
- `jobId`: target a specific failed job. Targeted retries require a single queue.

Always preview first:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Live retry after reviewing failure reasons:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-page&execute=true&limit=25"
```

Broad live retry across `queue=all` is blocked unless `allowAllLive=true` is supplied intentionally.

Invalid queue values return HTTP `400` with `supportedQueues`.

Failed BullMQ jobs are mirrored into `reie-dead-letter` after final retry exhaustion with source queue, job ID, bounded redacted payload, attempts, error message, stack, and source-job metadata. Status and retry endpoints expose recent dead-letter records through `deadLetter.recent`.

## Admin Dead-Letter Inspection

Use the admin UI after Terminal 1 is running:

```text
http://localhost:3000/admin/dead-letter
```

Inspect dead-letter records from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
```

Filter by source queue and states:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=mls-page&states=waiting,failed&limit=25"
```

Production requests require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
```

Dead-letter inspection is diagnostic only. It does not delete, replay, or retry jobs. Use `/api/mls/retry` with `dryRun=true` before any live retry.

## Production Scheduling

Production MLS scheduling should follow the staged scheduler plan in:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`

MLS rollout order:

1. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
2. Search-index result review from sync output, worker results, `npm run smoke:mls-status`, and `/admin`.
3. `npm run smoke:search` Search Smoke Readiness verification for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
4. Timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
5. Large programmatic content batch publication gate verification for data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics before MLS-backed public expansion.
6. MLS sync recurring schedule.
7. CRM reporting.
8. Alert dry-run.
9. Internal alert live test.
10. Alert live schedule.
11. Digest dry-run.
12. Internal digest live test.
13. Digest live schedule.
14. Manual Typesense repair and reindex only when required.

Conservative MLS starting schedule:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync:live
```

Initial cadence:

- Hourly during early production rollout.
- Increase page size, page count, MLS volume, scheduler cadence, live-inventory claims, or MLS-backed public expansion only after status, retry, dead-letter, timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, Supabase, Redis, Typesense, MLS Grid, search-index counters, indexing behavior, and Search Smoke Readiness are stable with `meta.smoke.ready=true` and no blockers.
- Use `npm run smoke:ops` from Terminal 5 for the standard local status and Search Smoke Readiness check while Terminal 1 is running.

Rules:

- Do not schedule seed scripts.
- Do not schedule destructive Typesense resets.
- Keep recurring email traffic, including recurring alert or digest sends, disabled until sender domain, unsubscribe, click tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

## Alert, Digest, And CRM Integration

MLS ingestion can create saved-search alerts. Alert delivery, digest delivery, click tracking, and CRM reporting are intentionally separate from listing ingestion.

Alert commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
npm run run:alerts:dry
npm run run:alerts:live -- --limit 25
npm run run:worker:alerts:once
npm run run:worker:alerts:once:live
```

Digest commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
```

CRM commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:crm -- --help
npm run run:crm:active
npm run run:crm:pending
npm run run:crm:reviewing
npm run run:crm:all
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
node dist/workers/runCRMTasks.js --limit 20 --status active
```

CRM admin API checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Rules:

- Do not send alert emails during exploratory ingestion tests unless delivery is intentional.
- Alert and digest dry-runs must remain read-only.
- Live alert sends should claim work with `pending -> processing -> sent`.
- Treat degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic because alert and digest clicks land back on search and property pages.
- Click tracking can update `UserInteraction`, `AlertQueue.clickedAt`, `User.heatScore`, and `UserPreference`.
- CRM task reporting is available through Terminal 5, `/api/admin/crm-tasks`, `/api/admin/crm-tasks/[id]`, and `/admin`; the admin review flow can mark tasks as reviewing, complete tasks with notes, and dismiss tasks with notes.
- `/api/admin/crm-tasks` returns `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also return `summary`, `audit`, and `readiness`.
- `/api/admin/crm-tasks/[id]` returns `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` on success and error responses after Detail Route reads, Review, Complete, or Dismiss actions.
- `/admin` CRM API Inspection renders Source from API-provided `inspectionSource` values, preserves failed detail-route inspection metadata when a request fails, and returns to `List Route` metadata after active-list refresh.

## Legacy Cleanup Status

The compatibility runner, normalizer, and demo-helper cleanup pass is complete:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts` wraps `syncMLSGrid()` and no longer imports IRES helpers.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts` owns the useful GC-forensics logic from the old normalizer.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md` is the completion record for the finished cleanup pass.

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

## Troubleshooting

If an MLS API route returns `HTTP_STATUS:000`:

1. Confirm Terminal 1 is running `npm run dev`.
2. Confirm the app is listening on `localhost:3000`.
3. Restart Terminal 1 if the browser or curl cannot reach the app.

If `/api/mls/status` or `/api/mls/retry` returns diagnostics:

1. Read `diagnostics[].area`.
2. For `database:*`, confirm Supabase database connectivity.
3. For `queue:*`, `redis:*`, or `retry*`, confirm Terminal 4 is running `npm run infra:up`.
4. Run `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` from Terminal 5.
5. Run `npm run worker:build`.
6. Restart Terminal 3 worker process.

If status is `degraded`:

1. Inspect `diagnostics`.
2. Inspect `queues` for failed counts.
3. Inspect `recentFailedJobs`.
4. Inspect `deadLetter.recent`.
5. Use `/admin/dead-letter` or `/api/admin/dead-letter` for detail inspection.
6. Run `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` for queue counts and retry policy metadata.
7. Run a dry-run retry for the affected queue.
8. Retry only after the failure reason is understood.

If status is `busy`:

- Check whether `syncState.isSyncing` is true.
- Check queue `active`, `waiting`, and `delayed` counts.
- Wait before enqueueing another sync unless this is an intentional parallel test.

If market pages log that the local Typesense `listings` collection is stale:

1. Confirm Terminal 4 is running `npm run infra:up`.
2. Run `npm run worker:build` from Terminal 5.
3. Run `npm run typesense:init` from Terminal 5.
4. Run `npm run typesense:reindex` from Terminal 5 when Supabase is reachable.
5. Run `npm run build` from Terminal 5.

If database-dependent scripts fail with Supabase pooler errors:

1. Confirm local `.env` and `.env.local` database values.
2. Confirm the Supabase pooler is reachable.
3. Retry only bounded dry-runs first.
4. Do not run large MLS syncs or live seed commands until connectivity is stable.

Known error:

```text
Can't reach database server at aws-0-us-west-2.pooler.supabase.com:6543
```

## Verification

Run after ingestion code or system-documentation changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
```

Run help checks after alert, digest, CRM, or worker script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Run operational smoke checks while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Run equivalent raw curl checks after status, retry, or admin route changes:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

Use the `x-admin-key` header for the same smoke checks when an admin key is configured:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

Run after Typesense schema changes from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** is running:

```bash
npm run worker:build
npm run typesense:init
npm run typesense:reindex
npm run build
```

If Supabase is unreachable and only schema repair is needed:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

## Known Gaps

- Local Typesense collection repair is still needed until `npm run build` no longer reports the stale `listings` collection.
- Supabase connectivity can block alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting when the pooler is unreachable.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.
- Production scheduling needs a final host-level cron or scheduler.
- Recurring email traffic, recurring alert or digest scheduling, and CRM scheduling need production workflow decisions.
- Production smoke verification still needs `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Large programmatic content batch publication should wait for verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
- Dead-letter detail workflow can be expanded beyond inspection into guided retry decisions.
- Large sync throughput should be load-tested before production-size ingestion.
- Production Redis and Typesense providers need final decisions.
- Placeholder property media should continue being replaced by reliable MLS/media handling.
- CRM task review can mark tasks as reviewing, complete tasks with notes, dismiss tasks with notes, and preserve closure audit visibility through `/admin` and `/api/admin/crm-tasks`.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/mls-ingestion.md -->
