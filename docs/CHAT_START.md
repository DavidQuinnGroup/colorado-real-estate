# Chat Start Context

Use this file to restart work on the Real Estate Intelligence Engine without losing project direction, operating rules, current blockers, scheduler status, seed workflow status, cleanup status, or verification baseline.

## Project

Product:

- David Quinn Group Real Estate Intelligence Engine

Workspace:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Master plan:

- `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

Primary goal:

- Build a Colorado real estate intelligence platform that combines premium MLS search, property intelligence, market content, saved-search alerts, digest emails, CRM lead intelligence, operational recovery, dead-letter inspection, scheduler planning, explicit seed workflows, and SEO authority for David Quinn Group, with emphasis on Boulder, Denver, and the surrounding Front Range.

## Required User Preferences

- Always name the full file path being created or replaced.
- Replace full files, not snippets.
- Put a file path comment at the bottom of code files when file syntax allows comments.
- JSON files cannot include comments.
- State which VS Code terminal should run commands.
- End each work response with the next recommended file.
- Do not describe replaced legacy code as a file delete.
- Mention deletes only when an actual separate file should be removed.

## Operating Docs To Read First

Primary:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/README.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/PROJECT_SYSTEM.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/STATEoftheUNION`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/atlas-platform-plan.md`

Architecture:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/platform-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/mls-ingestion.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/alert-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/email-system.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`

## Current Product Direction

REIE should become David Quinn Group's public intelligence layer for Colorado real estate, not only a property search site.

Core outcomes:

- Premium map-led Colorado property search.
- Reliable MLS Grid ingestion with real listing media instead of placeholders.
- Search backed by Postgres source-of-truth data and Typesense indexing.
- Search/map diagnostics that distinguish Typesense results, database fallback, health, access level, filters, bounds state, request timing, mapped records, coordinate-filtered records, and Search Smoke Readiness blockers.
- Saved-search alerts and digest emails with safe tracking and unsubscribe flows.
- CRM intelligence based on clicks, saved searches, preferences, alert engagement, and heat score.
- Crawlable city, neighborhood, market, property, article, and tool surfaces.
- Operational tooling for sync status, retry, dead-letter inspection, scheduler planning, seed verification, CRM task reporting, and CRM scheduler/admin readiness.
- Clear David Quinn Group authority signals for Colorado, Boulder, Denver, and nearby Front Range markets.

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, `npm run smoke:ops`, bounded live syncs, seed commands, CRM help, smoke checks, curl checks, Typesense repair |

## Current Architecture Snapshot

Frontend:

- Next.js App Router
- React
- Tailwind CSS
- Leaflet map/search experience

Database:

- Supabase PostgreSQL
- Prisma Client

Search:

- Typesense
- `properties` collection
- `listings` collection
- Canonical schema in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- Required field, required facet, field type, sortable field, and default sort validation for both search collections

Queues and workers:

- Redis
- BullMQ
- `mls-sync`
- `mls-page`
- `reie-alerts`
- `reie-dead-letter`
- Compiled worker output in `dist/workers`
- Compiled script output in `dist/scripts`

Email:

- Resend
- Alert and digest rendering through `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- Unsubscribe through `/api/unsubscribe`
- Click tracking through `/api/track-click`
- Delivery records through `EmailLog`

MLS intelligence:

- `scripts/fetchMLS.ts` is a compatibility wrapper around the active `syncMLSGrid()` path.
- `upsertListing.ts` writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- `processPhotos.ts` preserves existing photos when MLS returns no usable media.
- `processListing.ts` updates Typesense through `updateSearchIndex.ts` after successful upsert.
- `updateSearchIndex.ts` delegates to the canonical listing indexer.
- Listing jobs, page-worker jobs, batch processing, direct syncs, `/api/mls/status`, and `/admin` can surface search-index attempts, successes, failures, and errors.
- Legacy IRES/helper cleanup is complete, including old root-level demo MLS helpers.

Typesense indexing:

- `lib/typesense/indexListing.ts` indexes single listings into both `properties` and `listings`.
- `lib/typesense/indexProperties.ts` reuses the same document mapper for bulk reindexing.
- `scripts/initTypesense.ts`, `scripts/index.ts`, `scripts/createTypesenseCollection.ts`, and `scripts/createCollection.js` use canonical schema validation.
- `/api/search` returns source, `meta.source`, health, access level, active filters, bounds state, duration, returned count, mapped count, coordinate-filtered count, `meta.smoke`, and Typesense collection/query/filter/sort metadata.
- `meta.smoke` reports Terminal 5 `npm run smoke:search` readiness with command, terminal, ready, blockers, and structured checks.
- `searchPropertiesWithMeta()` returns server-side database search results with matching map diagnostics.
- `app/search/page.tsx` passes normalized server search metadata into `SearchInterface`.
- `app/page.tsx` preserves `/api/search` metadata for homepage map searches and supplies compatible fallback smoke diagnostics when needed.
- `SearchInterface`, `MapInner`, and `SearchMap` keep sidebar listings, map listings, selection state, hover state, public/contracted access filtering, and metadata aligned.
- `SearchMap` exposes search metadata through `data-search-*` and `data-search-smoke-*` attributes and a compact diagnostic overlay when metadata exists or coordinate filtering occurs.
- `/api/mls/status` exposes a first-class `searchIndex` block with recent completed job counters and diagnostics.
- `/api/mls/status` exposes first-class smoke commands in `commands.smokeOps`, `commands.smokeMlsStatus`, and `commands.smokeSearch`, while preserving raw curl commands in `commands.rawStatus` and `commands.rawSearchCheck`.
- `/admin` surfaces search-index health and Terminal 5 smoke checks for MLS status and Search Smoke Readiness.

Seed data:

- `scripts/quickSeed.ts` writes a small David Quinn Group authority seed.
- `scripts/seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Both scripts create/update `Property` rows and replace their own `PropertyPhoto` rows.
- Both scripts report database, photo, and per-collection Typesense status.
- Seed commands are explicit Terminal 5 tools, not app startup behavior, API behavior, scheduled jobs, or production inventory strategy.

CRM:

- `UserInteraction`
- `AlertQueue.clickedAt`
- `User.heatScore`
- `UserPreference`
- `PRE_DISCOVERY_BRIEF` tasks through `prisma.cRMTask`
- `strategy_intake` tasks from saved-search intake
- `/api/admin/crm-tasks` lists active, pending, reviewing, completed, dismissed, or all CRM queues with alert-readiness metadata.
- `/api/admin/crm-tasks` returns `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also include an `audit` block for closure review coverage, completed/dismissed counts, closed tasks with review notes, and closed tasks missing review notes.
- `/api/admin/crm-tasks` returns a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
- `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
- `/api/admin/crm-tasks/[id]` requires a non-empty review note before a CRM task can be marked `completed` or `dismissed`.
- `/api/admin/crm-tasks/[id]` records `metadata.review.completedAt` or `metadata.review.dismissedAt` when tasks are closed.
- `/admin` surfaces CRM task readiness, readiness gates, active review state, latest saved-search intake, Review actions, note-backed Complete/Dismiss actions, closure audit coverage, missing-note counts, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, and the visible `npm run run:crm:scheduler` command.
- `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
- `/admin` CRM command panels are structured to remain readable on smaller screens.
- CLI reporting through `npm run run:crm`, `npm run run:crm:active`, `npm run run:crm:pending`, `npm run run:crm:reviewing`, `npm run run:crm:all`, and `node dist/workers/runCRMTasks.js` includes closure audit counts and CRM readiness gates.
- Scheduler-safe CRM reporting uses `npm run run:crm:scheduler` for one machine-readable Terminal 5 payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Generated output:

- `dist/` is generated worker and script output.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

## Protected Operational APIs

These routes require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` in production:

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

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Local development can bypass the key only when neither admin key environment variable is configured.

## Current Known Warnings

These are known and non-blocking:

- Node `url.parse()` deprecation warnings appear during `next build`.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.

## Current Known Blocker

Supabase connectivity currently blocks alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting. Use `npm run supabase:check:json` as the non-secret readiness gate and follow the recovery runbook:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md`

```text
DNS lookup failed: ENOTFOUND otmkoqvmhthitldlnjdk.supabase.co
FATAL: (ENOTFOUND) tenant/user postgres.otmkoqvmhthitldlnjdk not found
```

## Verification Baseline

Run from **Terminal 5: Scripts / curl testing** after meaningful changes:

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

If `npm run supabase:check:json` reports blocked, stop before Supabase-backed dry-runs, seed checks, CRM scheduler reporting, reindexing, or live database work.

Run script help checks after alert, digest, CRM, or worker script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
```

Run operational smoke checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

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
curl --max-time 8 -X POST -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

If an admin key is configured locally, send it in the request:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

If curl returns `HTTP_STATUS:000`, start or restart **Terminal 1: Next.js app**:

```bash
npm run dev
```

## Typesense Repair Sequence

Use after schema changes or when build logs say the local `listings` collection is stale.

Start Docker infrastructure from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Compile scripts and recreate canonical collections from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typesense:init
```

After `npm run supabase:check:json` reports readiness, reindex from **Terminal 5: Scripts / curl testing**:

```bash
npm run supabase:check:json
npm run typesense:reindex
```

If Supabase is unreachable and only schema repair is needed, stop after `npm run typesense:init`, then confirm with:

```bash
npm run build
```

Inspection and legacy compatibility commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run typesense:collections:check
npm run typesense:collections
npm run typesense:reset-collections
```

Use `npm run typesense:init` as the primary local schema repair command.

## Seed Commands

Run seed commands from **Terminal 5: Scripts / curl testing** after `npm run worker:build` and `npm run supabase:check:json` report readiness.

Safe dry-runs:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Controlled writes with Typesense indexing:

```bash
npm run run:seed:quick
npm run run:seed:test
```

Controlled database/photo writes without Typesense indexing:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Seed rules:

- Dry-runs are read-only, but they still require `npm run supabase:check:json` readiness because seed inventory checks touch Supabase.
- Live and no-index seed write commands require `npm run supabase:check:json` readiness before any database rows are written.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- Seed scripts create or update bounded `Property` rows and replace their own `PropertyPhoto` rows.
- Seed scripts report database, photo, and per-collection Typesense status.
- Seed scripts should not be scheduled or run from public app code.
- Real MLS media remains the production source for live listing imagery.

## Safe MLS Commands

Queue a bounded sync dry-run from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Compatibility route dry-run:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Run a bounded direct script sync from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Queue a bounded live sync from **Terminal 5: Scripts / curl testing** only after dry-run/status/retry/dead-letter inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Run the compatibility entrypoint in no-write mode from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js
```

Run the compatibility entrypoint through the active sync pipeline from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js --sync --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Read MLS operations status from **Terminal 5: Scripts / curl testing**:

```bash
npm run smoke:mls-status
```

Check Search Smoke Readiness from **Terminal 5: Scripts / curl testing**:

```bash
npm run smoke:search
```

Expected Search Smoke Readiness is `meta.smoke.ready=true` with no `meta.smoke.blockers`.

Use raw curl only when inspecting HTTP status output, protected-route auth, or one-off API behavior.

Treat search-index diagnostics in `/api/mls/status` as real blockers for reliable public search. Recent completed jobs that report `indexFailed > 0`, `searchIndexIndexed=false`, or processed records with no indexing attempt should be investigated before increasing sync volume.

Preview retry from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Use targeted queue/job retry when possible. Broad live retry across queues requires `allowAllLive=true` and should remain exceptional.

## Production Scheduler Rollout

Rollout order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index result review from sync output, worker results, `npm run smoke:mls-status`, and `/admin`.
4. `npm run smoke:search` Search Smoke Readiness verification for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
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
| Alert processing live | every 30 minutes after approval | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |
| Typesense schema repair | manual only | `npm run typesense:init` |
| Typesense reindex | manual only after `npm run supabase:check:json` readiness | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

## Alert, Digest, And CRM Commands

Alert checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
npm run run:alerts:dry
npm run run:alerts:live -- --limit 25
npm run run:worker:alerts:once
npm run run:worker:alerts:once:live
```

Digest checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
```

CRM checks from **Terminal 5: Scripts / curl testing**:

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

Terminal 5 CRM reports are read-only and should include `audit` plus `readiness` output. Use `npm run run:crm:scheduler` for recurring production scheduler jobs. Use `npm run run:crm:active` for manual Terminal 5 operator review when human-readable output is preferred. The `readiness.level` value should match the same `ready`, `watch`, or `blocked` contract used by `/api/admin/crm-tasks`.

Before enabling the first recurring CRM provider schedule, follow the CRM first-live scheduler test in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.

CRM admin API checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. The list route should also include `summary`, `audit`, and `readiness` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

Use `/admin` for human review. CRM task completion and dismissal require a review note, closure audit coverage should remain at 100% after new closures, and the CRM API Inspection panel should show readable Terminal 5 API and scheduler command blocks with API-provided `List Route` metadata returning after `Detail Route` review actions while preserving failed detail-route evidence when a request fails.

Expected CRM readiness levels:

- `ready`: closure audit is clean and no active CRM task blockers were detected.
- `watch`: closure audit is clean but active review work or incomplete alert criteria need attention.
- `blocked`: closed CRM tasks are missing review notes.

Only run Supabase-backed dry-runs after `npm run supabase:check:json` reports readiness.

## Admin Dead-Letter Commands

Open after Terminal 1 is running:

```text
http://localhost:3000/admin/dead-letter
```

Inspect from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
```

Production requests require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
```

## Legacy MLS Cleanup Status

The legacy MLS helper cleanup pass is complete:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts` wraps `syncMLSGrid()` as a compatibility entrypoint.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts` owns useful GC-forensics mapping from the old normalizer.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md` is the cleanup completion record.

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

## Hard Rules

- Never run unbounded MLS syncs.
- Keep heavy MLS, alert, email, indexing, CRM, seed writes, and retry work outside page rendering.
- Use `dryRun=true` or `npm run run:mls-sync:dry` before live MLS work.
- Direct `node dist/scripts/mlsSync.js` defaults to dry-run.
- Use `execute=true`, `dryRun=false`, `--execute`, or `--live` for intentional live MLS syncs; scheduler live commands should still include explicit page, page-size, start-page, JSON, and page-timeout bounds.
- Keep `pageTimeoutMs` / `--page-timeout-ms` explicit for scheduled or API-triggered syncs.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- Treat `npm run supabase:check:json`, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics as production-readiness gates before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.
- Use `npm run supabase:check:json` and `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` before retry, scheduler, recurring email traffic, alert, digest, live-inventory, MLS-backed public expansion, content-planning, large programmatic content batch publication, or MLS-volume decisions.
- Treat `npm run supabase:check:json`, search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics as gates before live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.
- Treat Supabase/Postgres as the source of truth.
- Treat Typesense as a rebuildable search index.
- Keep `properties` and `listings` Typesense schemas compatible.
- Treat search-index failures and timeout-bounded queue diagnostics as operational diagnostics, not silent warnings.
- Preserve existing listing photos when MLS returns no usable media.
- Keep alert, digest, and seed dry-runs read-only, but do not run them until `npm run supabase:check:json` reports readiness.
- Do not schedule recurring email traffic, including recurring alert or digest sends, until `npm run supabase:check:json`, sender domain, unsubscribe, tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Treat failed `npm run supabase:check:json`, degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic.
- Allow large programmatic content batch publication only after `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Live alert sends should claim work with `pending -> processing -> sent`.
- Keep unsubscribe idempotent.
- Keep tracked redirects safe.
- Keep CRM task completion human-reviewed through the admin CRM task review flow.
- Require a review note before marking CRM tasks `completed` or `dismissed`.
- Keep CRM closure audit coverage visible in `/admin` and `/api/admin/crm-tasks`.
- Treat CRM `readiness.level=blocked` as a scheduler cadence or automation blocker until closed tasks have review notes.
- Preserve unrelated user work.

## Current Near-Term Sequence

1. Restore or replace the configured Supabase project/database endpoint using `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md`.
2. Confirm Supabase readiness with `npm run supabase:check:json`, or `npm run supabase:check` for a human-readable check.
3. Reindex Typesense from Supabase after `npm run supabase:check:json` reports readiness.
4. Verify search-index health with `npm run smoke:mls-status` and Search Smoke Readiness source, `meta.source`, health, access level, filters, bounds, returned, mapped, coordinate-filtered, duration, and `meta.smoke.ready=true` with no blockers through `npm run smoke:search` after reindex.
5. Rerun alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting after `npm run supabase:check:json` reports readiness.
6. Clean or regenerate stale `dist/` artifacts if generated output is being used directly.
7. Continue MLS ingestion hardening and media replacement.
8. Expand timeout-bounded admin queue, sync, alert, digest, and CRM completion workflows.
9. Continue public search/map/listing polish and placeholder media replacement.
10. Strengthen city, neighborhood, property, article, and market authority surfaces through large programmatic content batch publication gated by `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
11. Choose production schedulers for MLS sync, alerts, digests, and CRM reporting.
12. Decide production Redis and Typesense providers.
13. Load-test production-size MLS ingestion before increasing sync volume.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/CHAT_START.md -->
