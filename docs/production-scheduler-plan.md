# Production Scheduler Plan

This document defines the first production scheduling plan for the Real Estate Intelligence Engine. It covers MLS sync, alert processing, digest processing, CRM reporting, Typesense maintenance, seed-script boundaries, prerequisites, rollout gates, monitoring, cleanup constraints, and open decisions.

The goal is simple: recurring production work must be explicit, bounded, observable, reversible where possible, and easy to pause.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Launch-gate checklist:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Scheduling Principles

- Public pages must not depend on long-running scheduled work.
- Every scheduled job must use bounded command arguments.
- Recurring email traffic jobs must use explicit live commands.
- Scheduler output must be visible in provider logs.
- Failed scheduled jobs must surface through provider logs, queue state, admin diagnostics, or dead-letter inspection.
- Queue diagnostics must use the timeout-bounded Terminal 5 command before retry, recurring email traffic, alert, digest, scheduler, live-inventory claims, large programmatic content batch publication, or MLS-volume decisions.
- Search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics are production-readiness gates before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, live-inventory claims, MLS-backed public expansion, or recurring email traffic.
- Supabase/Postgres remains the source of truth.
- Typesense remains rebuildable search infrastructure.
- Search-index failures during MLS processing are degraded search freshness events and must be visible before schedule volume increases.
- Search Smoke Readiness must be checked with `npm run smoke:search` when validating public search behavior after scheduler or index changes, and `meta.smoke.ready` must be true with no blockers before MLS volume, scheduler cadence, recurring email traffic, live-inventory claims, or MLS-backed public expansion increases.
- Terminal 5 smoke scripts are the standard local shorthand for `/api/mls/status` and `/api/search?limit=5` checks.
- `/api/mls/status` should expose `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck` for admin and operator guidance.
- Redis/BullMQ remains the queue runtime, not durable business storage.
- Seed scripts are controlled setup and verification tools; they are not recurring scheduled jobs.
- Do not enable all live schedules at once.

## Required Production Pieces

Before enabling production schedules:

- Production worker host selected.
- Production Redis provider selected.
- Production Typesense provider selected.
- Scheduler provider selected.
- Supabase connectivity verified from the worker and scheduler runtimes with `npm run supabase:check:json`.
- MLS Grid credentials verified from the worker and scheduler runtimes.
- Resend sender domain verified.
- `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` configured.
- Production environment variables set on app, worker, and scheduler runtimes.
- Operator knows where scheduler logs, worker logs, Redis queue status, Typesense health, Resend logs, and admin diagnostics live.
- `npm run smoke:mls-status` search-index health verified.
- `npm run smoke:search` Search Smoke Readiness verified with `meta.smoke.ready=true` and no blockers.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` timeout-bounded queue diagnostics verified.

## Generated Output Note

- Worker and script runtime uses generated files in `dist/`.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated from a clean output directory.
- Source scans are authoritative unless a runtime command directly executes stale generated files.
- If generated output becomes operationally confusing, clean generated output and rerun `npm run worker:build`.

## Candidate Scheduler Host

Acceptable options:

- Worker-host native cron or scheduled jobs.
- Railway cron jobs.
- Render cron jobs.
- Fly.io scheduled machines.
- VPS cron with process supervision.
- GitHub Actions only for low-risk maintenance jobs, not preferred for live email or MLS ingestion.

Recommendation:

- Use the same provider family as the persistent worker host when possible. That keeps secrets, logs, networking, Redis access, and deployment behavior easier to reason about.

## Admin Protection

Production operational routes require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Protected routes relevant to scheduling and monitoring:

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

## Rollout Order

Enable recurring production work in this order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index result review from sync output, worker result payloads, `npm run smoke:mls-status`, and `/admin`.
4. `npm run smoke:search` Search Smoke Readiness verification for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
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

Do not move to the next gate until logs, database state, email state, and admin diagnostics are understood for the current gate.

## Job 1: MLS Sync

Purpose:

- Keep MLS-backed inventory fresh without running unbounded ingestion.

Candidate command:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync:live
```

Scheduler-safe dry-run command:

```bash
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Local protected API dry-run and live examples from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Initial cadence:

- Every 30 to 60 minutes during business hours.
- Every 2 to 4 hours overnight.

Starting limits:

- `max-pages=1`
- `page-size=25`
- `start-page=0`
- `page-timeout-ms=30000`

Supported direct script controls:

- `--dry-run` is the default and does not contact MLS Grid.
- `--execute` or `--live` is required for a direct live script sync.
- `--json` prints structured output for scheduler logs.
- `--page-timeout-ms=<number>` bounds each MLS Grid page request.

Example scheduler-safe dry-run output command:

```bash
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Escalation path:

- Increase page size or page count only after status, retry, dead-letter, `npm run supabase:check:json`, Redis, Typesense, MLS Grid behavior, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are stable.
- Increase page size or page count only when recent MLS summaries report `indexFailed=0`.
- Treat `indexFailed > 0` as a blocker for search-scale increases, even if Postgres upserts succeeded.
- Confirm `npm run smoke:search` Search Smoke Readiness reports expected source, `meta.source`, health, access level, filters, bounds, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers, and confirm timeout-bounded queue diagnostics are acceptable, before increasing scheduler cadence or MLS volume.

Preconditions:

- Redis reachable.
- `npm run supabase:check:json` reports readiness.
- MLS Grid reachable.
- Typesense reachable if indexing is enabled.
- Workers compiled with `npm run worker:build`.
- `MlsSyncState` lock behavior confirmed.
- Legacy MLS helper cleanup remains complete; do not reintroduce removed IRES/demo helper paths.

Failure review:

- Check `npm run smoke:mls-status`.
- Check `/api/mls/retry`.
- Check `/api/admin/dead-letter` or `/admin/dead-letter`.
- Check recent admin MLS completions for `indexAttempted`, `indexSucceeded`, and `indexFailed`.
- Check the `/admin` search-index health card.
- Check `npm run smoke:search` Search Smoke Readiness for source, `meta.source`, health, access level, filters, bounds, returned, mapped, coordinate filtering, duration, and `meta.smoke` blockers.
- Run `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` from Terminal 5 for queue counts, retry policy, and diagnostics.
- Review provider logs before retrying failed jobs.
- Confirm no stale sync lock is blocking the next bounded run.
- If listings are upserting but not searchable, inspect `searchIndex`, `indexFailed`, and `/api/search` metadata before running broad reindex work.

Rules:

- Never run unbounded MLS syncs.
- Keep MLS fetch work out of request lifecycles.
- Use `npm run run:mls-sync:dry` before scheduling `npm run run:mls-sync:live`.
- Route-triggered live sync requires `execute=true` or `dryRun=false`.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- Keep page timeouts explicit for scheduled jobs.
- Terminal 3 one-shot worker accepts `MLS_PAGE_TIMEOUT_MS`.
- Treat MLS ingestion as idempotent.
- Keep current production flow anchored to MLS Grid, `syncMLSGrid()`, `fetchMLSPage()`, `processListing()`, `upsertListing()`, `processPhotos()`, and `updateSearchIndex()`.
- `processListing()` should continue to update Typesense immediately after the Postgres upsert and report the index result.
- Keep `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts` as a compatibility wrapper only.

Acceptance gate before increasing MLS cadence or volume:

- Direct script summary or worker results show `indexAttempted > 0` when records are processed.
- Direct script summary or worker results show `indexFailed=0`.
- `npm run smoke:mls-status` does not report recent search-index diagnostics.
- `/admin` recent MLS completions do not show failed search-index values.
- `/admin` search-index health is not degraded.
- `npm run smoke:search` returns metadata with expected `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready=true`, and empty `meta.smoke.blockers` values.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` reports acceptable timeout-bounded queue diagnostics.

## Job 2: Alert Processing

Purpose:

- Send timely saved-search alerts from pending `AlertQueue` rows.

Dry-run command:

```bash
npm run run:alerts:dry -- --limit 50
```

Live command:

```bash
npm run run:alerts:live -- --limit 50
```

Worker dry-run one-shot:

```bash
npm run run:worker:alerts:once
```

Worker live one-shot:

```bash
npm run run:worker:alerts:once:live
```

Initial cadence:

- Dry-run manually before first production live send.
- Live every 15 to 30 minutes only after sender domain, unsubscribe, tracking, internal live-send tests, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified for recurring email traffic.

Starting limit:

- `limit=50`

Preconditions:

- `npm run supabase:check:json` reports readiness.
- Resend configured.
- Sender domain verified.
- Unsubscribe verified.
- Click tracking verified.
- `npm run smoke:mls-status` search-index health reviewed.
- `npm run smoke:search` Search Smoke Readiness reviewed with `meta.smoke.ready=true` and no blockers.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` timeout-bounded queue diagnostics reviewed.
- Alert dry-run reviewed.
- Internal live-send test completed.

Rules:

- Alert dry-run must remain read-only.
- The base alert script is dry-run by default.
- Live sends must use `run:alerts:live` or an explicit live worker command.
- Continuous alert worker mode consumes queued jobs live and should not be used as a dry-run substitute.
- Live sends claim rows with `pending -> processing -> sent`.
- Failed sends must be inspected, not silently discarded.
- Do not schedule recurring email traffic, including live alert sends, until internal live-send tests, search-index health, Search Smoke Readiness passes with `meta.smoke.ready=true` and no blockers, and timeout-bounded queue diagnostics are acceptable.

## Job 3: Digest Processing

Purpose:

- Send grouped property intelligence emails instead of single-listing alerts where appropriate.

Dry-run command:

```bash
npm run run:digest:dry -- --limit 25
```

Live command:

```bash
npm run run:digest -- --limit 50
```

Initial cadence:

- Daily or weekly only after product rules are finalized.

Starting limits:

- `limit=25` for dry-runs.
- `limit=50` for first live production runs.

Preconditions:

- Digest grouping rules approved.
- Resend sender domain verified.
- `npm run supabase:check:json` reports readiness.
- Alert payload quality verified.
- Unsubscribe and click tracking verified.
- `npm run smoke:mls-status` search-index health reviewed.
- `npm run smoke:search` Search Smoke Readiness reviewed with `meta.smoke.ready=true` and no blockers.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` timeout-bounded queue diagnostics reviewed.
- Internal live-send test completed.

Rules:

- Digest dry-run must remain read-only.
- Live digest sends should only mark usable claimed alerts as sent.
- Malformed payloads should be marked explicitly.
- Do not enable recurring email traffic, including recurring digest sends, until alert delivery behavior, search-index health, Search Smoke Readiness is stable with `meta.smoke.ready=true` and no blockers, and timeout-bounded queue diagnostics are acceptable.

## Job 4: CRM Reporting

Purpose:

- Surface active CRM tasks, review-state transitions, closure audit coverage, CRM readiness gates, and engagement signals for human review.

Traceability:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Command:

```bash
npm run run:crm:active
```

Scheduler-safe JSON command:

```bash
npm run run:crm:scheduler
```

Use `npm run run:crm:scheduler` for recurring production scheduler jobs. Use `npm run run:crm:active` for manual Terminal 5 operator review when human-readable output is preferred.

Expected scheduler JSON shape:

- Top-level `success`, `mode`, `schemaVersion`, `generatedAt`, `terminal`, `command`, `options`, `report`, and `tasks`.
- `mode` should be `scheduler`.
- `schemaVersion` should be `1`.
- `generatedAt` should be an ISO timestamp for provider-log auditing.
- `command` should be `npm run run:crm:scheduler`.
- `report.audit` includes closure review coverage and missing-note counts.
- `report.readiness.level` is `ready`, `watch`, or `blocked`.
- `report.readiness.level=blocked` pauses CRM scheduler cadence increases.
- CRM scheduler readiness is part of the launch-core gate in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`.

Initial cadence:

- Daily business-morning report.
- Optional midday report after volume increases.

Preconditions:

- `npm run supabase:check:json` reports readiness.
- Click tracking is producing `UserInteraction` data.
- Preference learning is producing `UserPreference` data.
- CRM task CLI and `/admin` CRM readiness output are useful enough for operator review.
- Terminal 5 CRM reports include closure audit counts and the same CRM readiness gates used by `/api/admin/crm-tasks`.
- `/admin` CRM closure audit coverage and missing-note counts are visible.
- `/admin` CRM API Inspection metadata is visible for `generatedAt`, `inspectionSource`, `route`, `terminal`, and `command`.
- `/api/admin/crm-tasks?status=active&limit=6` returns `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also return active CRM tasks, `audit`, and `readiness` blocks.
- `/api/admin/crm-tasks/[id]` returns `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` on success and error responses; successful responses also return one CRM task when a task id from the list response is inspected.
- CRM Review, Complete, and Dismiss actions expose `/api/admin/crm-tasks/[id]` inspection metadata before the active-task list refresh returns `/api/admin/crm-tasks` metadata, preserve failed detail-route inspection metadata when a request fails, and render the visible Source field from API-provided `inspectionSource` values as it moves from `Detail Route` back to `List Route`.
- CRM `readiness.level` is not `blocked`.

Rules:

- CRM reporting may be automated.
- Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs receive one machine-readable payload.
- CRM task completion and dismissal must remain human-reviewed through the admin review flow.
- Completed and dismissed CRM tasks require review notes.
- CRM `readiness.level=blocked` must block CRM scheduler cadence increases until closed tasks have review notes.
- Scheduled CRM reporting must not mutate CRM task status.
- Do not create or complete CRM tasks blindly from scheduled reporting.

CRM API verification from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API output should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. The successful CRM task list response should also include `summary`, `audit`, and `readiness`.

The `/admin` CRM API Inspection panel should show single-task route metadata after Review, Complete, or Dismiss actions, preserve failed detail-route inspection metadata when a request fails, then return to active-task list metadata after the list refresh. The visible Source field should render API-provided `inspectionSource` values and move from `Detail Route` back to `List Route`.

Scheduled CLI JSON output should include `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `terminal`, `command`, `options`, `report`, `report.audit`, `report.readiness`, and `tasks`. Treat a CLI or API `readiness.level` of `blocked` as a stop condition for CRM cadence escalation.

First live scheduler test:

1. Run `npm run worker:build` from **Terminal 5: Scripts / curl testing**.
2. Run `npm run run:crm:scheduler` from **Terminal 5: Scripts / curl testing**.
3. Confirm the output is valid JSON with `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`.
4. Confirm `report.readiness.level` is not `blocked`.
5. Confirm `/admin` CRM API Inspection renders API-provided `inspectionSource` values, showing `List Route` metadata, updating to `Detail Route` metadata after a Review, Complete, or Dismiss action, preserving failed detail-route evidence when a request fails, and returning to `List Route`.
6. Configure the provider scheduler with `npm run run:crm:scheduler`.
7. Run the provider job once manually.
8. Confirm provider logs include `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`.

## Job 5: Typesense Maintenance

Purpose:

- Repair or rebuild search indexes after schema changes, data migrations, or controlled recovery events.

Canonical schema source:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`

Canonical runners:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts`

Compatibility helpers:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.js`

Manual local schema repair from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** is running:

```bash
npm run worker:build
npm run typesense:init
```

Manual reindex from **Terminal 5: Scripts / curl testing** after `npm run supabase:check:json` reports readiness:

```bash
npm run typesense:reindex
```

Cadence:

- Not scheduled by default.
- Run manually after schema changes, data migrations, or controlled recovery events.

Rules:

- Schema repair and data reindexing are separate steps.
- Do not schedule destructive Typesense resets without explicit operator approval.
- Reindex only when `npm run supabase:check:json` reports readiness.
- Both `properties` and `listings` must use the canonical schema.
- Search runners validate required fields and facets before accepting existing collections.
- Prefer normal MLS-driven `updateSearchIndex()` writes for day-to-day freshness.
- Use full reindexing for schema repair, controlled recovery, or confirmed drift, not as the first response to an isolated failed job.
- Seed helpers should write bounded test data, create `PropertyPhoto` rows, and index through `indexListing()` instead of creating ad hoc collections.
- Use `npm run typesense:init` as the primary local schema repair command.

## Not Scheduled: Seed Scripts

Purpose:

- Seed scripts support local setup, controlled demonstrations, and verification of database, photo, and index behavior.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Dry-run verification commands from **Terminal 5: Scripts / curl testing**:

```bash
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

- Do not schedule seed scripts as recurring production jobs.
- Do not run seed scripts from app startup, API routes, or page rendering.
- Do not treat local seed records as production inventory strategy.
- Use dry-runs as verification checks.
- Live seed commands require database connectivity.
- Run `npm run supabase:check:json` before live seed write commands.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- Seed scripts create or update bounded `Property` rows and replace their own `PropertyPhoto` rows.
- Seed scripts report database, photo, and per-collection Typesense status.
- Real MLS media remains the production source for live listing imagery.

## Suggested Initial Schedule

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
| Typesense reindex | manual only | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

## Monitoring Checklist

After enabling a scheduled job, inspect:

- Scheduler/provider logs.
- For CRM scheduler jobs, confirm provider logs include `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`.
- For CRM scheduler jobs, rerun `npm run run:crm:scheduler` from **Terminal 5: Scripts / curl testing** when comparing provider output to local readiness.
- For CRM scheduler jobs, confirm `/api/admin/crm-tasks` and `/api/admin/crm-tasks/[id]` still return `inspectionSource`, `route`, `terminal`, and `command` on success and error responses.
- For CRM scheduler jobs, confirm `/admin` preserves failed detail-route inspection metadata and returns to `List Route` after active-list refresh.
- Worker logs.
- `npm run smoke:mls-status`.
- `/api/mls/retry`.
- `/api/admin/dead-letter`.
- `/admin/dead-letter`.
- `/admin` recent MLS completions, including search-index counters.
- `npm run smoke:search` Search Smoke Readiness for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate filtering, duration, and `meta.smoke` blockers.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
- `AlertQueue` statuses.
- `EmailLog` records.
- `UserInteraction` records.
- Resend dashboard.
- Redis queue state.
- Typesense health and collection state.

## Local Verification Commands

Run required checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run supabase:check:json
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run build
```

Run script help and seed dry-run checks from **Terminal 5: Scripts / curl testing** after alert, digest, CRM, or seed script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
npm run run:crm:scheduler
npm run run:seed:quick:dry
npm run run:seed:test:dry
node dist/workers/runCRMTasks.js --help
```

Run local operational smoke checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

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

If any curl returns `HTTP_STATUS:000`, start or restart **Terminal 1: Next.js app**:

```bash
npm run dev
```

## Cleanup And Source Scan Rules

Legacy MLS cleanup is complete and recorded in:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`

Before deleting any future worker, script, queue, or MLS-related file:

1. Confirm no active imports reference it.
2. Confirm no worker, script, API route, page, component, data file, or queue path depends on it.
3. Preserve or intentionally reject any useful business logic.
4. Update documentation.
5. Run the Terminal 5 verification baseline.

Useful source scan from **Terminal 5: Scripts / curl testing**:

```bash
rg -n "fetchIRESListings|normalizeIRESListing|normalizeListing|lib/mls/fetchMLS|mockListings|enqueueListings|parseMLS|scheduleJobs|mlsImporter|lib/mlsSync" . --glob '!dist/**' --glob '!typesense-data/**' --glob '!node_modules/**' --glob '!*.tsbuildinfo'
```

## Current Known Warnings And Blockers

- Production Redis provider decision is still open.
- Production Typesense provider decision is still open.
- Production worker host decision is still open.
- Production scheduler provider decision is still open.
- Resend sender domain authentication needs confirmation before recurring alert or digest sends.
- Supabase connectivity from local scripts is currently a blocker until `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md` is completed and `npm run supabase:check:json` reports readiness.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- Search-index failure reporting now exists; production rollout still needs live-provider verification that the counters appear in scheduler logs, worker results, `npm run smoke:mls-status`, and `/admin`.
- `/api/search` metadata now exists; production rollout still needs live verification through `npm run smoke:search` for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate filtering, duration, `meta.smoke.ready=true`, empty `meta.smoke.blockers`, and Typesense query/filter context after Supabase connectivity and provider selection are confirmed.
- Production smoke verification still needs `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Unacceptable timeout-bounded queue diagnostics should block recurring email traffic, including recurring alert or digest sends, until queue health is understood.
- Large programmatic content batch publication should wait for verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
- `npm run build` currently logs Node `[DEP0169]` warnings from `url.parse()` usage during static generation.
- CRM closure audit controls, CRM API inspection metadata, failed detail-route preservation, and note-backed completion/dismissal are implemented locally; production admin smoke verification still needs to run after Terminal 1 and Supabase are reachable.
- Alert frequency and digest grouping rules need final business approval.
- Seed scripts now create local photo rows, but real MLS media remains the production source of truth.

## Decision Log To Complete

Before enabling production schedules, decide:

- Worker host provider.
- Redis provider.
- Typesense provider.
- Scheduler provider.
- MLS sync cadence.
- Alert cadence.
- Digest cadence.
- CRM reporting cadence.
- Live email sender and reply-to address.
- Operator who receives failure notifications.

## Current Status

The scheduler plan is ready for provider selection and staged rollout. The first production-grade path should be a bounded MLS sync with visible search-index counters, followed by `npm run smoke:search` Search Smoke Readiness verification with `meta.smoke.ready=true` and no blockers, timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, large programmatic content batch publication gate verification before MLS-backed public expansion, then recurring bounded MLS sync, CRM reporting with `readiness.level` not blocked and CRM API Inspection metadata verified, alert delivery, and digest delivery. Typesense repair and reindex remain manual operational actions. Seed scripts remain manual controlled setup and verification tools.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md -->
