# David Quinn Group REIE Project System

This file is the operating system for the local Real Estate Intelligence Engine project. It should stay aligned with `README.md`, the current Prisma schema, worker scripts, seed scripts, and the architecture documents.

## Active Project

Project path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Product:

- Real Estate Intelligence Engine

Company/entity:

- David Quinn Group

Primary goal:

- Build a production-grade Colorado real estate intelligence platform that establishes David Quinn Group as a trusted authority for Colorado, Boulder, Denver, and the greater Front Range.

## Related Documents

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/README.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/STATEoftheUNION`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/CHAT_START.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/atlas-platform-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/platform-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/mls-ingestion.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/alert-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/email-system.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, `npm run smoke:ops`, bounded live syncs, seed commands, CRM help, smoke checks, curl checks, Typesense repair |

Use **Terminal 5: Scripts / curl testing** for verification unless a command specifically starts a long-running service.

## Platform Stack

Frontend:

- Next.js App Router
- React
- Tailwind CSS
- Leaflet map surfaces

Database:

- Supabase PostgreSQL
- Prisma Client as the application query layer

Queue and workers:

- Redis
- BullMQ
- Compiled Node workers in `dist/workers`
- Compiled Node scripts in `dist/scripts`

Search:

- Typesense
- `properties` collection
- `listings` collection
- Canonical schema validation in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`

Email:

- Resend
- Branded HTML/text rendering through `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- `EmailLog` records in Postgres

Seed data:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`
- Explicit npm scripts for dry-run, indexed write, and no-index write modes

Local infrastructure:

- Docker Compose
- Redis on `localhost:6379`
- Typesense on `localhost:8109`

## Source Of Truth Rules

- Supabase/Postgres is the source of truth for business data.
- Prisma is the query client, not the schema authority.
- Typesense is a rebuildable search index.
- Redis/BullMQ is the async job system, not durable business storage.
- Dead-letter records are operational diagnostics, not customer-facing records.
- Seed scripts are explicit setup and verification tools, not hidden app startup behavior.
- Public pages should remain fast, crawlable, and locally specific.
- Heavy ingestion, alerting, email, retry, indexing, seed writes, CRM, and reporting work should run through bounded scripts or workers.
- `npm run supabase:check:json`, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics are production-readiness gates before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.
- `dist/` is generated output and may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

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
- `GET /api/admin/crm-tasks`
- `GET /api/admin/crm-tasks/[id]`
- `PATCH /api/admin/crm-tasks/[id]`
- `GET /api/process-alerts`
- `POST /api/process-alerts`

## Current Product Surfaces

Public:

- `/`
- `/search`
- `/properties/[id]`
- `/market/[city]`
- `/market/[city]/[slug]`

Admin:

- `/admin`
- `/admin/dead-letter`

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

## Local Startup Sequence

Start Docker services from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Start the Next.js app from **Terminal 1: Next.js app**:

```bash
npm run dev
```

Build worker and script files from **Terminal 5: Scripts / curl testing** after TypeScript changes:

```bash
npm run worker:build
```

Start the coordinator from **Terminal 3: Coordinator** when background workers are needed:

```bash
npm run run:worker:mls
npm run run:worker:mls-page
```

Run a worker subset from **Terminal 3: Coordinator** when isolating behavior:

```bash
node dist/workers/main.js --workers=mls,mls-page,alert
node dist/workers/main.js --workers=alert
```

## MLS System

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls-sync/route.ts`

Rules:

- Never run unbounded MLS syncs.
- Use page count, page size, runtime, rate-delay, and page-timeout bounds.
- Keep long-running ingestion in workers or scripts.
- Keep API handlers bounded and protected.
- Use dry-run first through API routes when validating queue behavior.
- Direct `node dist/scripts/mlsSync.js` defaults to dry-run.
- Use `execute=true`, `dryRun=false`, `--execute`, or `--live` for intentional live MLS syncs; scheduler live commands should still include explicit page, page-size, start-page, JSON, and page-timeout bounds.
- Keep `pageTimeoutMs` / `--page-timeout-ms` explicit for scheduled or API-triggered syncs.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- Use `MlsSyncState` for sync state and lock behavior.
- Preserve existing property media if MLS returns no usable media.
- Mirror failed BullMQ jobs into `reie-dead-letter` after final retry exhaustion with bounded and redacted payload snapshots.
- Treat MLS operations as idempotent.
- `processListing.ts` should update Typesense through `updateSearchIndex.ts` after a successful upsert.
- Listing jobs, page-worker jobs, batch processing, direct syncs, `/api/mls/status`, and `/admin` should surface search-index attempts, successes, failures, and errors.
- `/api/mls/status` should expose a first-class `searchIndex` block with attempted, succeeded, failed, unknown, health, diagnostics, and recent index outcomes.
- `/api/mls/status` should expose first-class Terminal 5 smoke and Supabase preflight commands through `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.supabaseCheck`, and `commands.supabaseCheckJson`.
- `/api/mls/status` should preserve raw status/search API command compatibility through `commands.rawStatus` and `commands.rawSearchCheck`.
- Keep `scripts/fetchMLS.ts` as a compatibility wrapper around `syncMLSGrid()`.
- Keep REIE intelligence field mapping in `upsertListing.ts`.
- `upsertListing.ts` writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- Legacy IRES/helper cleanup is complete, including old root-level demo MLS helpers.

Bounded dry-run sync API call from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Compatibility dry-run sync API call from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Bounded sync command from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Bounded live sync API call from **Terminal 5: Scripts / curl testing** after status, retry, and dead-letter inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Compatibility no-write command from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js
```

Compatibility sync command from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js --sync --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Read MLS status and Search Smoke Readiness from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
```

Production status request:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/mls/status"
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

## MLS Retry And Dead Letter

Retry routes and dead-letter inspection are operational safety surfaces. They should help diagnose and rerun failed jobs without hiding root causes.

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/retry/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/DeadLetterInspector.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/dead-letter/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/deadLetterQueue.ts`

Rules:

- Inspect before retrying.
- Use `dryRun=true` before live retry.
- Use `execute=true` or `dryRun=false` for intentional live retry.
- Use targeted queue and job id retry when possible.
- Broad live retry across queues requires `allowAllLive=true` and should remain exceptional.
- Keep live retry bounded by queue, state, and limit.
- Do not add destructive admin actions without audit and confirmation flows.
- Admin endpoints require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` in production.

Inspect queue counts, retry policy, and diagnostics from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
```

Read retry status from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=mls-page&dryRun=true&limit=10"
```

Preview all retryable jobs from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Inspect dead-letter records from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
```

## Search Index System

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`

Compatibility and seed helpers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Rules:

- Maintain compatible `properties` and `listings` schemas.
- Include search-critical fields in both collections.
- Include faceted `neighborhood` in both collections.
- Treat Typesense as replaceable infrastructure.
- Validate schema before deleting, creating, or reindexing collections.
- Repair local Typesense collections after schema changes.
- Reindex from Supabase after collection repair when `npm run supabase:check:json` reports readiness.
- Use `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts` as the canonical schema source.
- `indexListing.ts` is the canonical single-listing indexer for both `properties` and `listings`.
- `indexProperties.ts` reuses the same document mapper for bulk reindexing.
- `/api/search` should return source, `meta.source`, health, access level, active filters, bounds status, request duration, returned count, mapped count, coordinate-filtered count, `meta.smoke`, and Typesense query/filter metadata.
- `/api/search` `meta.smoke` should expose Terminal 5 `npm run smoke:search` readiness with `ready`, `blockers`, `command`, `terminal`, and structured checks.
- `searchPropertiesWithMeta()` should be used when server-rendered search pages need map diagnostics.
- `searchPropertiesWithMeta()` should emit metadata compatible with `SearchMapMeta`, including access level, filters, health, returned count, mapped count, and coordinate-filtered count.
- `app/search/page.tsx` should pass normalized server search metadata into `SearchInterface`.
- `app/page.tsx` should preserve `/api/search` metadata for homepage map searches and provide a compatible fallback smoke diagnostic if the API response lacks metadata.
- `SearchInterface`, `MapInner`, and `SearchMap` should keep sidebar listings, map listings, public/contracted access filtering, and metadata aligned.
- `SearchMap` should preserve search metadata in `data-search-*` and `data-search-smoke-*` attributes and show diagnostics only when metadata exists or coordinate filtering occurs.
- Treat `meta.smoke.ready=false` or non-empty `meta.smoke.blockers` as degraded Search Smoke Readiness before raising MLS volume, recurring email traffic, alert or digest traffic, or scheduler cadence.
- Search-index failures should be treated as operational diagnostics, not silent warnings.
- `/api/mls/status` should expose a first-class `searchIndex` block with recent completed job counters and diagnostics.
- `/admin` should surface search-index health and Terminal 5 smoke checks for MLS status, Search Smoke Readiness, and combined operational readiness.
- `/admin` Search Smoke Readiness should state the pass condition: `meta.smoke.ready=true` with no blockers.
- Treat `indexFailed > 0` as degraded search freshness even if Postgres upserts succeeded.
- Do not create ad hoc partial Typesense collections in seed scripts or compatibility helpers.
- Seed helpers should create `PropertyPhoto` rows and index through `indexListing()` so both `properties` and `listings` stay aligned.

Start infrastructure from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Compile worker/script output and recreate canonical collections from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run supabase:check:json
npm run supabase:check
npm run typesense:init
```

Reindex Supabase properties into both collections from **Terminal 5: Scripts / curl testing** after `npm run supabase:check:json` reports readiness:

```bash
npm run supabase:check:json
npm run typesense:reindex
```

Check Search Smoke Readiness from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:search
```

If `npm run build` logs that the local Typesense `listings` collection is stale, the code schema is valid but the live local collection still needs repair. Run the Terminal 4 and Terminal 5 repair sequence above.

## Seed Data System

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/package.json`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/tsconfig.worker.json`

Commands from **Terminal 5: Scripts / curl testing** after `npm run worker:build` and `npm run supabase:check:json` report readiness:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:seed:quick
npm run run:seed:test
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Rules:

- `quickSeed.ts` writes a small David Quinn Group authority seed.
- `seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Seed scripts create or update `Property` rows.
- Seed scripts replace existing seeded `PropertyPhoto` rows for their own properties.
- Seed scripts report database, photo, and per-collection Typesense status.
- Dry-runs are read-only, but they still require `npm run supabase:check:json` readiness because seed inventory checks touch Supabase.
- Live and no-index seed write commands require `npm run supabase:check:json` readiness before any database rows are written.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- No-index commands write database and photo rows without updating Typesense.
- Seed scripts must not run from app startup, API routes, page rendering, or recurring production schedulers.
- Real MLS media remains the production source for live listing imagery.

## Alert And Email System

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/matchSearches.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingAlert.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingDigest.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runAlerts.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/process-alerts/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/unsubscribe/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts`

Rules:

- Do not send email from page rendering.
- Use dry-run mode before intentional live sends.
- The base alert script is dry-run by default.
- Live alert sends require `npm run run:alerts:live` or `npm run run:worker:alerts:once:live`.
- Continuous alert worker mode consumes queued jobs live.
- Worker dry-run mode is valid only for one-shot or batch mode, so it cannot silently consume queue jobs.
- Keep alert and digest dry-runs read-only.
- Respect `User.isUnsubscribed`.
- Keep unsubscribe idempotent.
- Keep tracked redirects constrained to safe local or site destinations.
- Record delivery attempts in `EmailLog`.
- Use `AlertEvent` for deduplication.
- Claim live alert work with `pending -> processing -> sent`.
- Mark malformed alert payloads explicitly.
- Preserve unsubscribe and tracking links in rendered email.
- Do not schedule recurring email traffic, including recurring alert or digest sends, until `npm run supabase:check:json`, sender domain, unsubscribe, tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Treat failed `npm run supabase:check:json`, degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic because alert and digest clicks land back on search and property pages.

Show alert CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
```

Preview saved-search alert processing from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts:dry
```

Live saved-search alert processing from **Terminal 5: Scripts / curl testing** after approval:

```bash
npm run run:alerts:live -- --limit 25
```

Process alerts once through the worker path in dry-run batch mode from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:worker:alerts:once
```

Explicit live one-shot alert worker run from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:worker:alerts:once:live
```

Run the continuous alert worker from **Terminal 3: Coordinator** only after recurring email traffic readiness is verified:

```bash
npm run run:worker:alerts
```

Process alerts through the protected API in dry-run mode from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"
```

Show digest CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest -- --help
```

Preview grouped digest sends from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest:dry -- --limit 25
```

Run grouped digest sends from **Terminal 5: Scripts / curl testing** after approval:

```bash
npm run run:digest -- --limit 25
```

## CRM Intelligence System

Core files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/preferences/updateUserPreferences.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`

Current behavior:

- `/api/track-click` records listing engagement through `UserInteraction`.
- Matching sent, pending, or processing `AlertQueue` rows can receive `clickedAt`.
- User click behavior can increase `User.heatScore`.
- Preference learning updates `UserPreference` from clicked alert payloads.
- Hot lead ranking combines heat score, activity recency, saved searches, preference count, and alert clicks.
- `createTask()` creates `PRE_DISCOVERY_BRIEF` tasks through `prisma.cRMTask`.
- Saved-search intake creates `strategy_intake` CRM tasks with alert-readiness metadata.
- `/api/admin/crm-tasks` lists active, pending, reviewing, completed, dismissed, or all CRM queues.
- `/api/admin/crm-tasks` returns `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also return closure-audit counts for completed and dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
- `/api/admin/crm-tasks` returns a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
- `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
- `/api/admin/crm-tasks/[id]` requires a non-empty review note before a task can be marked `completed` or `dismissed`.
- `/admin` surfaces CRM task readiness, readiness gates, active review state, latest saved-search intake, closure audit coverage, missing-note counts, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, the visible `npm run run:crm:scheduler` command, and note-backed Review, Complete, and Dismiss actions.
- `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
- `/admin` CRM command panels are structured to remain readable on smaller screens.
- CRM task runner output is a bounded reporting surface.
- Scheduler-safe CRM reporting uses `npm run run:crm:scheduler` for one machine-readable Terminal 5 payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Rules:

- Do not auto-complete CRM tasks before review.
- Avoid duplicate pending pre-discovery briefs unless manual creation is intentional.
- Keep CRM runners bounded.
- Do not query obsolete fields such as `scheduledFor`.
- Use the admin CRM review flow to mark tasks as reviewing, completed, or dismissed.
- Require review notes for CRM task completion and dismissal.
- Keep CRM closure audit coverage visible in `/admin` and `/api/admin/crm-tasks`.
- Treat CRM `readiness.level=blocked` as a scheduler cadence or automation blocker until closed tasks have review notes.
- Use JSON output for scheduled CRM reporting so provider logs can be parsed reliably.

CRM readiness levels:

- `ready`: closure audit is clean and no active CRM task blockers were detected.
- `watch`: closure audit is clean, but active review work or incomplete alert criteria need attention.
- `blocked`: closed CRM tasks are missing review notes.

Show CRM help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Inspect CRM tasks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:crm:active
npm run run:crm:pending
npm run run:crm:reviewing
npm run run:crm:all
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --limit 20 --status active
```

Terminal 5 CRM reports are read-only and include closure audit counts plus the same CRM readiness gates used by `/api/admin/crm-tasks`. Use `npm run run:crm:scheduler` for recurring production scheduler jobs. Use `npm run run:crm:active` for manual Terminal 5 operator review when human-readable output is preferred.

Before enabling the first recurring CRM provider schedule, follow the CRM first-live scheduler test in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.

Inspect CRM task APIs from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. The list route should also include `summary`, `audit`, and `readiness` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

## Production Scheduler System

The production scheduler plan is staged and conservative.

Rollout order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index diagnostics review through `npm run smoke:mls-status`.
4. Search Smoke Readiness verification through `npm run smoke:search`, including `meta.smoke.ready=true` with no blockers.
5. Timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
6. Large programmatic content batch publication gate verification for data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics before MLS-backed public expansion.
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
| Alert processing live | every 30 minutes after approval | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |
| Typesense schema repair | manual only | `npm run typesense:init` |
| Typesense reindex | manual only after `npm run supabase:check:json` readiness | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

Rules:

- Scheduler output must be visible in provider logs.
- Do not enable all live schedules at once.
- Do not schedule seed scripts.
- Do not schedule destructive Typesense resets without explicit operator approval.
- Use the same provider family as the persistent worker host when possible.
- Keep recurring email traffic disabled until `npm run supabase:check:json`, Resend domain, unsubscribe, click tracking, internal live-send tests, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

## SEO And Authority System

Primary goal:

- Help search engines and users understand David Quinn Group as a local Colorado real estate authority.

Rules:

- Keep public pages crawlable.
- Keep city and neighborhood content locally specific.
- Use internal links between market, city, neighborhood, property, tool, and article pages.
- Keep schema markup consistent with David Quinn Group entity signals.
- Use fresh MLS-backed inventory only when it is stable, indexed, and correctly linked.
- Avoid generic real estate content that does not reinforce Colorado, Boulder, Denver, or Front Range authority.
- Reinforce expertise through local market context, property intelligence, and useful client workflows rather than thin content.
- Do not treat local seed content as production authority content.
- Use CRM engagement signals for content prioritization only after protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and API Inspection metadata are visible.
- Use live-inventory claims and MLS-backed public expansion in public authority content only after search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- Allow large programmatic content batch publication only after `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

Authority targets:

- Colorado real estate.
- Boulder real estate.
- Denver real estate.
- Greater Front Range neighborhoods and markets.
- Listing intelligence, market intelligence, and owner/seller/buyer decision support.

## Editing Standards

- Replace full files when editing.
- Provide the full file path being created or replaced.
- Put the file path comment at the bottom of code files when file syntax allows comments.
- Keep changes scoped to the current module.
- Avoid unrelated refactors.
- Do not delete files unless cleanup is specifically identified.
- Preserve existing user work and unrelated changes.
- Verify before closing the task.

## Verification Baseline

Run after meaningful code or system-documentation changes from **Terminal 5: Scripts / curl testing**:

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

If `npm run supabase:check:json` reports blocked, stop before Supabase-backed dry-runs, seed checks, scheduler reporting, reindexing, or live database work.

Run CLI help checks after alert, digest, CRM, or worker script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
```

Run operational smoke checks while Terminal 1 is active:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

`npm run smoke:search` should include `/api/search` metadata with `meta.source`, `meta.smoke.ready`, `meta.smoke.blockers`, source, health, access level, filters, bounds, returned count, mapped count, coordinate-filtered count, and duration.

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

Run after Typesense schema changes from **Terminal 5: Scripts / curl testing** once **Terminal 4: Docker / Typesense** is running:

```bash
npm run worker:build
npm run typesense:init
```

Then reindex after `npm run supabase:check:json` reports readiness:

```bash
npm run supabase:check:json
npm run typesense:reindex
```

Known current non-blocking warnings:

- Node `url.parse()` deprecation warnings appear during `next build`.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- Production smoke verification still needs `npm run supabase:check:json`, `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.

Known current blocker:

- Supabase connectivity currently blocks alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting. On June 1, 2026, `npm run supabase:check:json` remained the machine-readable recovery gate and `npm run supabase:check` remained the human-readable companion check. The configured Supabase values consistently point to project ref `otmkoqvmhthitldlnjdk`, the Postgres pooler host resolves and accepts TCP connections, but Prisma authentication and the configured Supabase project API host still fail:

```text
DNS lookup failed: ENOTFOUND otmkoqvmhthitldlnjdk.supabase.co
FATAL: (ENOTFOUND) tenant/user postgres.otmkoqvmhthitldlnjdk not found
```

Recovery runbook:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md`

## Current Near-Term Priorities

1. Restore or replace the configured Supabase project/database endpoint so local scripts can resolve and reach Supabase.
2. Confirm Supabase readiness with `npm run supabase:check:json`, or `npm run supabase:check` for a human-readable check.
3. Reindex Typesense from Supabase with `npm run typesense:reindex` after `npm run supabase:check:json` reports readiness.
4. Verify search-index health with `npm run smoke:mls-status` and Search Smoke Readiness source, `meta.source`, health, access level, filters, bounds, returned, mapped, coordinate-filtered, duration, and `meta.smoke.ready=true` with no blockers through `npm run smoke:search` after reindex.
5. Rerun alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting after `npm run supabase:check:json` reports readiness.
6. Clean or regenerate stale `dist/` artifacts if generated output is being used directly.
7. Continue MLS ingestion hardening and media replacement.
8. Expand timeout-bounded admin queue, sync, alert, digest, and CRM visibility.
9. Continue public search/map/listing polish.
10. Strengthen city, neighborhood, property, article, and market authority surfaces through large programmatic content batch publication gated by `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
11. Finalize the production scheduler host using `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.
12. Decide production Redis and Typesense providers.
13. Load-test production-size MLS ingestion before increasing sync volume.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/PROJECT_SYSTEM.md -->
