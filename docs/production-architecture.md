# Production Architecture

David Quinn Group's Real Estate Intelligence Engine is a Next.js, Supabase, Redis/BullMQ, Typesense, Resend, and worker-based platform for Colorado property search, MLS ingestion, saved-search alerts, digest emails, CRM lead intelligence, market intelligence, operational recovery, queue diagnostics, seed-data controls, and SEO authority.

Production architecture has one central rule: public pages stay fast and crawlable; ingestion, indexing, email, retry, CRM, seed writes, and operational recovery run through bounded background systems or explicit controlled scripts.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Production Goal

Production should support:

- Fast public search, market, neighborhood, property, article, and tool pages.
- Reliable MLS Grid ingestion with bounded syncs.
- Search infrastructure that can be rebuilt from Postgres.
- Safe alert and digest email delivery.
- Safe click tracking, unsubscribe handling, preference learning, and CRM task reporting.
- Admin visibility for status, sync limits, retry, alert processing, queue diagnostics, and dead-letter inspection.
- Durable David Quinn Group authority signals for Colorado, Boulder, Denver, and the greater Front Range.

## Runtime Components

Generated output note:

- `dist/` is generated worker and script output.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

### Next.js App

Responsibilities:

- Public search/map UI.
- Property, city, neighborhood, and market pages.
- Admin UI.
- Bounded API routes.
- SEO metadata and schema components.
- Save-search, unsubscribe, tracked-click, valuation, logistics, and webhook routes.

Production rules:

- API routes must remain stateless and bounded.
- API routes may enqueue work, read status, inspect dead-letter records, process bounded batches, retry bounded failed jobs, redirect tracked clicks, or update single records.
- API routes must not perform long-running MLS ingestion directly.
- API routes must not run seed scripts.
- Operational API routes must require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` in production.
- API routes should return structured JSON diagnostics when Redis, Typesense, queue, or database dependencies are slow.
- `npm run smoke:mls-status`, `npm run smoke:search`, and timeout-bounded queue diagnostics are the first local production-readiness checks before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, live-inventory claims, MLS-backed public expansion, or recurring email traffic.

### Supabase PostgreSQL

Role:

- Source of truth for business data.

Owns:

- Properties.
- Property photos.
- Users.
- Saved searches.
- Alerts and alert events.
- Email logs.
- Click behavior.
- Preferences.
- CRM tasks.
- MLS sync state.

Rules:

- Prisma is the application query client.
- MLS identity is anchored by `Property.mlsId`.
- `MlsSyncState` tracks MLS sync progress and lock state.
- Engagement data belongs in Postgres, not in Redis.
- Seed data scripts may write bounded local or controlled setup records, but production MLS data remains the authoritative inventory source.

### Redis And BullMQ

Role:

- Queue runtime and operational job state.

Queues:

- `mls-sync`: coordinator-level MLS sync jobs.
- `mls-page`: MLS page fetch and batch processing jobs.
- `listings`: individual listing processing jobs.
- `reie-alerts`: saved-search alert work.
- `reie-dead-letter`: structured failed-job records.

Production rules:

- Use a managed Redis or Redis-compatible provider with persistence and monitoring.
- Workers and scripts must use the same production Redis endpoint.
- Dead-letter data is diagnostic, not the source of truth.

### Typesense

Role:

- Low-latency search engine for property search, map results, and listing inventory lookups.

Collections:

- `properties`: canonical app search collection.
- `listings`: MLS/listing inventory collection.

Rules:

- Typesense is rebuildable from Supabase/Postgres.
- `properties` and `listings` must stay schema-compatible for shared search surfaces.
- Both collections must include faceted `neighborhood`.
- Canonical schema validation lives in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`.
- Do not depend on local Typesense data directories in production.
- Use a managed Typesense provider or a durable self-hosted instance with backup and recovery procedures.
- Treat production schema changes as planned operations: validate schema, recreate or migrate collections, then reindex from Postgres.

### Workers

Compiled worker entry points live in `dist/workers`.

Workers:

- `main.js`: coordinator that launches selected workers.
- `mlsWorker.js`: consumes `mls-sync`.
- `mlsPageWorker.js`: consumes `mls-page`.
- `alertWorker.js`: consumes `reie-alerts` and can poll pending database alerts.
- `runCRMTasks.js`: bounded CRM task reporting worker.

Production rules:

- Workers need a persistent runtime, not Vercel request handlers.
- Suitable worker hosts include Railway, Render, Fly.io, a VPS, or another long-running process host.
- Worker deployment must run `npm run worker:build` before starting compiled workers.
- Worker processes should be observable and restartable.
- Continuous alert worker mode consumes queue jobs live and should be enabled only after recurring email traffic readiness is verified.
- Recurring email traffic readiness includes sender-domain authentication, unsubscribe, click tracking, internal live-send testing, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
- Seed scripts are not worker daemons and should not be scheduled as recurring jobs.

## Production Deployment Shape

Recommended separation:

- Vercel or equivalent: Next.js app and stateless API routes.
- Supabase: managed Postgres.
- Managed Redis: BullMQ queues.
- Managed Typesense or durable self-hosted Typesense: search.
- Worker host: compiled worker processes.
- Scheduler: recurring MLS sync, alert processing, digest processing, and CRM reporting.
- Resend: transactional email.

Do not depend on `localhost` service URLs in production.

## Environment Variables

Core:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MLS_GRID_BASE_URL`
- `MLS_GRID_TOKEN`
- `REDIS_URL`
- `TYPESENSE_HOST`
- `TYPESENSE_PORT`
- `TYPESENSE_PROTOCOL`
- `TYPESENSE_API_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`
- `PUBLIC_SITE_URL`

Optional controls:

- `MLS_GRID_INCLUDE_MEDIA`
- `MLS_SYNC_MAX_PAGES`
- `MLS_SYNC_PAGE_SIZE`
- `MLS_PAGE_TIMEOUT_MS`
- `MLS_SYNC_RATE_DELAY_MS`
- `ALERT_RUN_LIMIT`
- `ALERT_RUN_DRY_RUN`
- `ALERT_WORKER_MODE`
- `ALERT_WORKER_DRY_RUN`
- `DIGEST_RUN_LIMIT`
- `DIGEST_RUN_DRY_RUN`
- `CRM_RUN_LIMIT`
- `CRM_RUN_STATUS`
- `RESEND_REPLY_TO_EMAIL`
- `REIE_ADMIN_API_KEY`
- `ADMIN_API_KEY`
- `GOOGLE_INDEXING_ACCESS_TOKEN`

Production requirements:

- `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` must be configured for protected admin endpoints.
- Resend sender domain must be verified before recurring alert or digest sends.
- Public site URL variables must point to the canonical production domain.
- Search-index health through `npm run smoke:mls-status`, Search Smoke Readiness through `npm run smoke:search`, and timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` must be verified before recurring email traffic, including recurring alert or digest sends.

## Protected Operational APIs

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Protected operational APIs:

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

Local development can bypass the key only when neither admin key environment variable is configured.

## MLS Production Flow

1. Scheduler or operator starts a bounded MLS sync.
2. `mls-sync` queue receives a job.
3. MLS worker runs `syncMLSGrid()`.
4. `MlsSyncState` controls lock behavior and progress.
5. MLS Grid pages are fetched with bounded runtime, page size, page count, per-page timeout, and delay.
6. Listings are normalized and upserted into `Property`.
7. `upsertListing()` writes production REIE intelligence fields: `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
8. Photos are normalized into `PropertyPhoto`.
9. Existing photos are preserved when MLS returns no usable media.
10. `processListing()` calls `updateSearchIndex()` after a successful upsert.
11. Updated listings are indexed into Typesense where configured.
12. Listing, batch, page-worker, and direct sync summaries report search index attempts, successes, and failures.
13. Saved searches are matched through Postgres.
14. `AlertEvent` deduplicates matches.
15. `AlertQueue` stores alert work for separate processing.

Production rules:

- Never run unbounded MLS syncs.
- Start production limits conservatively.
- Use API dry-runs before queueing live sync work through routes.
- Live sync route calls require `execute=true` or `dryRun=false`.
- Use `force=true` only after inspecting failed queue state, retry status, and dead-letter records.
- Use `pageTimeoutMs`, `--page-timeout-ms`, or `MLS_PAGE_TIMEOUT_MS` to keep slow MLS page fetches bounded.
- Direct script sync defaults to dry-run; live direct sync requires `--execute`, `--live`, or the explicit live npm command.
- Scheduled live direct sync commands should still include explicit `--execute`, `--json`, `--max-pages`, `--page-size`, `--start-page`, and `--page-timeout-ms` bounds.
- Use `--json` for scheduler-safe dry-runs and machine-readable validation output.
- Load-test throughput before production-size ingestion.
- Keep MLS fetch work outside request lifecycles.
- Treat MLS ingestion as idempotent.
- Treat search index failures as production diagnostics that should surface through job results, `/api/mls/status`, and `/admin`.
- Treat degraded Search Smoke Readiness as a production readiness issue because search, property pages, alerts, digests, and CRM click paths depend on it.
- Keep `/api/mls/status` command metadata stable so operators and `/admin` can surface `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck`.
- Keep `scripts/fetchMLS.ts` as a compatibility wrapper around `syncMLSGrid()`, not as a separate legacy IRES production path.
- Keep GC-forensics field mapping in `upsertListing()` so property pages, search, alerts, digest, and CRM read from the same production intelligence surface.
- Legacy IRES/helper cleanup is complete. Current production MLS flow should stay anchored to MLS Grid, `syncMLSGrid()`, `fetchMLSPage()`, `processListing()`, `upsertListing()`, `processPhotos()`, and `updateSearchIndex()`.

Local protected dry-run and live examples from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
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

## Search Index Production Flow

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`

Compatibility and seed helpers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Rules:

- Schema changes require collection repair, migration, or reset.
- Reindex after schema repair when Supabase is reachable.
- Treat Typesense as disposable infrastructure rebuilt from Postgres.
- Keep `properties` and `listings` compatible.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts` is the canonical schema source.
- Search scripts validate required fields and facets before accepting an existing collection.
- Compatibility helpers must use the canonical schema or delegate to the compiled canonical runner.
- `/api/search` should return metadata for source, `meta.source`, health, access level, active filters, bounds state, request duration, returned count, mapped count, coordinate-filtered count, `meta.smoke`, and Typesense collection/query/filter/sort context.
- `/api/search` `meta.smoke` should report Terminal 5 `npm run smoke:search` readiness through `ready`, `blockers`, `command`, `terminal`, and structured checks.
- Server-rendered search pages should use `searchPropertiesWithMeta()` when map diagnostics are needed.
- `app/search/page.tsx` should pass normalized server search metadata into `SearchInterface`.
- `app/page.tsx` should preserve `/api/search` metadata and provide a compatible fallback smoke diagnostic when needed.
- Map surfaces should preserve search metadata into `SearchMap` so production support can distinguish source, health, access level, filters, bounds state, timing, mapping, coordinate-filtering, and smoke-readiness issues quickly.
- `/api/mls/status` should expose a first-class `searchIndex` block with recent completed job counters and diagnostics.
- `/admin` should surface search-index health and Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- `/admin` Search Smoke Readiness should state the pass condition: `meta.smoke.ready=true` with no blockers.
- Treat `indexFailed > 0` as degraded search freshness even if Postgres upserts succeeded.
- Production rollout should verify `npm run smoke:search` metadata for `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready=true`, and empty `meta.smoke.blockers`.
- Seed helpers must not create ad hoc partial Typesense collections.
- Seed helpers should write bounded test data, create `PropertyPhoto` rows, and index through `indexListing()` so both `properties` and `listings` stay aligned.
- Production search results should be based on MLS-backed or controlled production records, not local demo seed content.

Local repair sequence from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** is running:

```bash
npm run worker:build
npm run typesense:init
```

Reindex when Supabase is reachable:

```bash
npm run typesense:reindex
```

If Supabase is unreachable and only local schema repair is needed:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

Known local warning until repair:

```text
Neighborhood inventory lookup skipped because the local Typesense listings collection is stale: Typesense schema listings is invalid: ...
```

## Seed Data Production Position

Seed scripts are controlled setup and verification tools. They are not part of recurring production runtime.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Local and controlled-use commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Controlled write commands:

```bash
npm run run:seed:quick
npm run run:seed:test
```

Database/photo-only controlled write commands:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Rules:

- Do not run seed scripts from app startup, public API routes, page rendering, or scheduled production jobs.
- Do not use local seed records as production inventory strategy.
- Dry-run seed commands are safe verification checks.
- Live seed commands require database connectivity.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- Seed scripts create or update bounded `Property` rows and replace their own `PropertyPhoto` rows.
- Seed scripts report database, photo, and per-collection Typesense status.
- Real MLS media remains the production source for live listing imagery.

## Alert And Digest Production Flow

Alert flow:

1. Listing is created or updated.
2. Saved-search matching checks active saved searches.
3. `AlertEvent` deduplicates by user, property, and type.
4. `AlertQueue` stores the alert payload.
5. Alert processor claims pending rows with `pending -> processing -> sent`.
6. Resend sends branded David Quinn Group email.
7. `EmailLog` records delivery metadata.
8. `/api/track-click` records engagement when context is valid.
9. `/api/unsubscribe` handles tokenized unsubscribe requests idempotently.

Digest flow:

- Digest processor groups eligible pending alert work by user.
- Digest dry-run is read-only.
- Live digest sends only mark usable claimed alerts as sent.
- Malformed payloads should be marked explicitly.

Production rules:

- Do not send email from page rendering.
- Dry-runs must remain read-only.
- Intentional live sends must be explicit and bounded.
- Live alert sends must use `run:alerts:live`, `run:worker:alerts:once:live`, continuous worker consumption, or an explicitly live protected API request.
- Resend domain authentication must be verified before recurring email traffic.
- Unsubscribe behavior must remain idempotent.
- Tracked redirects must be constrained to safe destinations.
- Recurring email traffic, including recurring alert or digest sends, must wait for healthy `npm run smoke:mls-status` search-index diagnostics, healthy `npm run smoke:search` Search Smoke Readiness, and acceptable timeout-bounded queue diagnostics.

Commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:alerts:dry
npm run run:alerts:live -- --limit 25
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
```

## CRM Production Flow

CRM intelligence is based on engagement, preferences, saved searches, alert clicks, and heat score.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/preferences/updateUserPreferences.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`

Current flow:

1. `/api/track-click` records `UserInteraction`.
2. Matching `AlertQueue.clickedAt` can be updated.
3. `User.heatScore` can be incremented.
4. `updateUserPreferences()` learns bounded buyer preferences from clicked alert payloads.
5. `getHotLeads()` ranks leads by recency, heat score, saved searches, preferences, and alert clicks.
6. `createTask()` creates `PRE_DISCOVERY_BRIEF` records with `prisma.cRMTask`.
7. Saved-search intake creates `strategy_intake` CRM records with alert-readiness metadata.
8. `/api/admin/crm-tasks` reports active, pending, reviewing, completed, dismissed, or all CRM task queues.
9. `/api/admin/crm-tasks` reports `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also report closure-audit counts for completed and dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
10. `/api/admin/crm-tasks` reports a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
11. `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
12. `/api/admin/crm-tasks/[id]` requires a non-empty review note before a task can be marked `completed` or `dismissed`.
13. `/admin` surfaces CRM task readiness, readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, and note-backed Review, Complete, and Dismiss actions.
14. `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
15. `run:crm` and `run:worker:crm` report bounded CRM task summaries with closure audit counts and CRM readiness gates for review.
16. `run:crm:scheduler` emits one scheduler-safe JSON payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Production rule:

- CRM task reporting can be automated, but task completion and dismissal must stay human-reviewed through the admin review flow.
- Completed and dismissed CRM tasks require review notes.
- Closure audit coverage should remain visible in `/admin` and `/api/admin/crm-tasks`.
- CRM `readiness.level=blocked` must block scheduler cadence or automation increases until closed tasks have review notes.
- Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs can be parsed reliably.

Commands from **Terminal 5: Scripts / curl testing**:

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

Terminal 5 CRM reports are read-only and should include `audit` and `readiness` objects matching the `/api/admin/crm-tasks` operational contract.

CRM API checks while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

## Admin And Dead-Letter Production Flow

Admin UI:

- `/admin`
- `/admin/dead-letter`

Admin scripts:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/queueDashboard.ts`
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`

Admin API:

- `GET /api/admin/dead-letter`
- `GET /api/mls/status`
- `GET /api/mls/retry`
- `POST /api/mls/retry`
- `GET /api/process-alerts`
- `POST /api/process-alerts`

Dead-letter records include:

- Source queue.
- Source job id.
- Source job name.
- Failed reason.
- Timestamp.
- Attempts made.
- Stack.
- Bounded and redacted original payload snapshot.

Rules:

- Dead-letter inspection is diagnostic only.
- Dead-letter inspection does not delete, replay, or retry jobs.
- Timeout-bounded queue dashboard output is diagnostic only and should be checked before deciding whether to retry jobs, repair data, or scale workers.
- `/admin` should expose the current MLS sync envelope, including page size, page count, runtime, page timeout, and worker/check terminals.
- `/admin` should expose first-class search-index health from `/api/mls/status`.
- `/admin` should expose recent MLS completion search index attempts, successes, failures, and per-listing index errors when job return values include them.
- `/admin` should expose Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- `/admin/dead-letter` should expose active filter summary and inspection terminal context.
- Live retry remains handled by `/api/mls/retry` after dry-run preview.
- Targeted live retry should use a specific `queue` and `jobId`.
- Broad live retry across all queues requires `allowAllLive=true` and should be avoided unless the failure mode is understood.
- Production admin requests must include `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Production inspection:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

Local retry inspection from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=true&limit=10"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-sync&execute=true&limit=10"
```

## API Production Rules

- Keep request lifecycle bounded.
- Return structured JSON errors.
- Return partial diagnostics when dependencies are slow.
- Surface recent search index failures and missing index attempts from completed MLS/listing jobs as MLS status diagnostics.
- Keep `/api/search` metadata stable enough for local smoke checks, production support, admin visibility, map diagnostics, and `meta.smoke` readiness decisions.
- Do not fetch large MLS datasets from API handlers.
- Do not send email from public page rendering.
- Do not run seed scripts from API handlers.
- Admin endpoints require an admin key in production.
- `/api/track-click` should redirect safely even when tracking fails.
- Prefer `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops` for local readiness checks; use `curl --max-time 8` for lower-level operational checks.
- Treat `meta.smoke.ready=false` or non-empty `meta.smoke.blockers` as degraded Search Smoke Readiness before raising MLS volume, recurring email traffic, alert or digest traffic, or scheduler cadence.

## Scheduler Requirements

Production still needs explicit scheduler decisions for:

- MLS sync.
- Alert processing.
- Digest processing.
- CRM reporting.
- Typesense reindex/repair operations when schema changes occur.

Scheduler rules:

- Schedules must use bounded command arguments.
- MLS dry-run schedules should prefer structured JSON output.
- Recurring email traffic jobs must be intentional and observable.
- Recurring email traffic jobs should remain disabled when search-index health is degraded, `meta.smoke.ready=false`, public search smoke blockers are present, or timeout-bounded queue diagnostics are unacceptable.
- Scheduler output should be logged somewhere visible.
- Failed scheduled jobs should surface through provider logs, queue state, or admin diagnostics.
- Seed scripts should not be recurring scheduled jobs.

Candidate scheduled commands:

```bash
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:alerts:dry -- --limit 50
npm run run:alerts:live -- --limit 50
npm run run:digest -- --limit 50
npm run run:crm:scheduler
```

These limits are starting points, not final production throughput settings. MLS live scheduling, alert dry-run scheduling, alert live scheduling, digest scheduling, and CRM scheduling are separate rollout gates.

## SEO And Authority Architecture

The production architecture supports search visibility through:

- Content architecture control: `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`.
- Fast crawlable market and property pages.
- Structured data for agent, article, FAQ, tool, and local real estate content.
- Internal links between city, neighborhood, property, article, tool, and market pages.
- Fresh MLS-backed property inventory.
- Search metadata that can show source, health, access level, filters, bounds state, timing, and whether records were coordinate-filtered before map display.
- Search-index diagnostics that show when MLS ingestion succeeded but public search freshness is degraded.
- Localized Boulder, Denver, and Colorado market intelligence.
- Consistent David Quinn Group brand signals across page metadata, schema, email, admin surfaces, CRM surfaces, and public content.
- CRM engagement signals for content planning only after protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and API Inspection metadata are visible.
- Live-inventory claims and MLS-backed public expansion only after search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- Large programmatic content batch publication only after data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

The platform should position David Quinn Group as the authoritative Colorado real estate intelligence source, not merely as a property search interface.

## Local Operations Commands

Start infrastructure from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Start the app from **Terminal 1: Next.js app**:

```bash
npm run dev
```

Build workers from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
```

Run workers from **Terminal 3: Coordinator**:

```bash
npm run run:worker:mls
npm run run:worker:mls-page
npm run run:worker:alerts
node dist/workers/main.js --workers=mls,mls-page
node dist/workers/main.js --workers=alert
```

Run a bounded MLS sync directly from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Inspect queue state from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run smoke:ops
```

Run seed dry-runs from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Inspect dead-letter records from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

## Verification

Run required checks from **Terminal 5: Scripts / curl testing** before considering worker, API, search, or production-doc changes complete:

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

Run after Docker or Typesense config changes from **Terminal 4: Docker / Typesense**:

```bash
docker compose config
```

Run after alert, digest, CRM, or seed script changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
npm run run:seed:quick:dry
npm run run:seed:test:dry
node dist/workers/runCRMTasks.js --help
```

Current verified local baseline:

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

Current build warnings:

- Node emits `[DEP0169]` warnings from `url.parse()` usage during static generation.
- Local `npm run build` can warn that the Typesense `listings` collection is stale until local Typesense is repaired and reindexed.

Run smoke checks after status, search, retry, or admin operations route changes from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

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

## Current Known Gaps

- Production Redis provider decision is still open.
- Production Typesense provider decision is still open.
- Production worker host decision is still open.
- MLS sync scheduling needs a production scheduler.
- Recurring email traffic, recurring alert or digest scheduling, and CRM scheduling need production workflow decisions.
- Email domain authentication should be confirmed before recurring alert or digest sends.
- Production smoke verification still needs `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Typesense collection repair and reindex should be run locally until `npm run build` no longer reports the stale `listings` collection.
- Supabase connectivity from local scripts is currently a blocker when `aws-0-us-west-2.pooler.supabase.com:6543` is unreachable.
- Timeout-bounded queue diagnostics exist through the Terminal 5 dashboard and admin/dead-letter UI, and they gate live-inventory claims, scheduler cadence, recurring scheduler activation, MLS-volume decisions, recurring email traffic, MLS-backed public expansion, and large programmatic content batch publication; broader operational controls are still pending.
- CRM closure audit controls, note-backed completion/dismissal, CRM API Inspection metadata, and failed detail-route preservation are implemented locally; production admin smoke verification still needs to run after Terminal 1 and Supabase are reachable.
- Legacy MLS helper cleanup is complete and recorded in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`.
- Large sync throughput should be load-tested before production-size ingestion.
- Large programmatic content batch publication should wait for verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
- Placeholder property media should continue being replaced by reliable MLS/media handling.
- Seed scripts now create local photo rows, but real MLS media remains the production source of truth.

## Summary

REIE has a production-oriented foundation:

- Queue-backed MLS ingestion.
- Worker-based page and alert processing.
- Redis-backed retry and dead-letter behavior.
- Typesense search infrastructure with `properties` and `listings` collections.
- Saved-search alerts, digest emails, unsubscribe handling, safe click tracking, preference learning, and CRM task reporting.
- Operations endpoints and admin UI for status, sync, retry, alert processing, CRM readiness verdicts, CRM closure audit coverage, and dead-letter inspection.
- Timeout-bounded queue dashboard diagnostics for MLS, page-worker, alert, and dead-letter queues.
- Explicit seed scripts for controlled local setup and verification.

The remaining production work is provider selection, worker hosting, scheduler design, observability, email-domain validation, CRM production smoke verification, controlled load testing, and continued development of public intelligence surfaces that strengthen David Quinn Group's Colorado authority.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-architecture.md -->
