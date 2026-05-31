# REIE Launch Core Checklist

Date: May 30, 2026

Project: David Quinn Group Real Estate Intelligence Engine

Working path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Primary plan:

- `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`

Supabase recovery runbook:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md`

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Purpose

This checklist defines the minimum launch core for REIE: the pieces that must be stable before live MLS sync, recurring email traffic, production scheduler activation, MLS-backed public expansion, or large programmatic content batch publication.

The rule is simple: dry-run and inspect first, then enable live behavior only after the relevant system is verified from the correct terminal.

## Launch Core Definition

The launch core is considered ready when these surfaces are working together:

- Public search/map experience loads quickly and supports listing discovery.
- Sidebar and map selection behavior is reliable.
- Listing media comes from real MLS or approved seed/test data, not hidden placeholder fallbacks.
- MLS Grid sync can run in bounded dry-run mode.
- Prisma write path can upsert live MLS listings without breaking existing media.
- Typesense schema matches the current canonical listing fields.
- Search indexing updates both `properties` and `listings` collections.
- MLS/listing jobs expose search index attempts, successes, failures, and errors in job results and `/api/mls/status`.
- `/api/mls/status` exposes `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck` for admin and operator guidance.
- Search/map responses expose source, health, access level, filters, bounds, returned, mapped, coordinate-filtered counts, and response duration.
- Saved-search alerts can be previewed safely.
- Live alert sends are explicitly gated.
- Recurring email traffic, including live alert and digest sends, waits for healthy Search Smoke Readiness and acceptable timeout-bounded queue diagnostics because email click traffic lands on search and property pages.
- CRM scheduler reporting emits a machine-readable readiness payload before recurring production schedules are enabled.
- `/admin` surfaces CRM readiness, closure audit coverage, note-backed CRM completion/dismissal, and CRM API Inspection metadata.
- Admin routes are protected in production.
- Dead-letter inspection and retry flows are available.
- Search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are available before retry, scheduler, recurring email traffic, alert, digest, live-inventory claims, MLS-backed public expansion, large programmatic content batch publication, or MLS-volume decisions.
- Documentation matches actual commands and routes.

## Current Ready State

These areas are already part of the working launch core:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/search/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapSidebar.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/LuxuryIntelligencePopup.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/page.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/dead-letter/page.tsx`

## Must Validate Before Production

Validate these before live production use:

1. MLS Grid credentials are present in the deployment environment.
2. Supabase production database URL is present and points to the intended database.
3. Redis is reachable from worker and scheduler environments.
4. Typesense is reachable and protected by the intended API key.
5. Resend sender domain is verified.
6. Public unsubscribe route works from a real email.
7. Public click tracking redirects safely.
8. Live alert send has been tested with an internal recipient.
9. MLS sync dry-run completes within configured page, runtime, and page-timeout bounds.
10. Typesense `listings` collection has been rebuilt with the current schema.
11. Search/map page loads with live indexed data.
12. `npm run smoke:search` Search Smoke Readiness shows expected `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready=true`, and empty `meta.smoke.blockers`.
13. `npm run smoke:mls-status` shows recent MLS/listing jobs with `indexFailed=0`, non-degraded `searchIndex.health`, and no unresolved search-index diagnostics.
14. Admin operations routes require a key in production.
15. Timeout-bounded queue dashboard output from `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` is visible from the production operations environment.
16. `npm run run:crm:scheduler` outputs JSON with `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`.
17. CRM `report.readiness.level` is not `blocked` before recurring CRM scheduler activation.
18. `/api/admin/crm-tasks` and `/api/admin/crm-tasks/[id]` expose `inspectionSource` values of `List Route` and `Detail Route` on success and error responses.
19. `/admin` CRM Task Readiness shows CRM API Inspection fields for `generatedAt`, `inspectionSource`, `route`, `terminal`, `command`, closure audit coverage, note-backed completion/dismissal, and the visible Terminal 5 CRM scheduler command in readable command panels on smaller screens.
20. CRM Review, Complete, and Dismiss actions update CRM API Inspection metadata from the single-task detail route before returning to active-task list metadata, with the visible API-provided Source field moving from `Detail Route` back to `List Route`.
21. Failed CRM list/detail API calls preserve `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` metadata so the admin panel can still show the inspected route.

## Terminal Commands

Use **Terminal 1: Next.js app**:

```bash
npm run dev
```

Use **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Use **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run supabase:check
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run typesense:init
npm run typesense:reindex
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm:scheduler
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Use **Terminal 2: MLS Page Worker** only when validating queue consumption:

```bash
npm run run:worker:mls-page
```

Use **Terminal 3: Coordinator** only when validating broader worker coordination:

```bash
npm run run:worker:mls
npm run run:worker:mls-page
```

## Protected Route Checks

Run these from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Equivalent protected/raw curl checks:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=10" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses. Successful detail responses should include `task`. Successful list responses should include `tasks`, `summary`, `audit`, and `readiness`.

## Live Action Gates

Do not run live production actions until dry-run output has been reviewed.

Live MLS sync gate:

- Dry-run route or `npm run run:mls-sync:dry` has passed.
- Scheduler-safe dry-run command with `--json` and `--page-timeout-ms=30000` has passed.
- Direct script sync defaults to dry-run; live direct sync requires `--execute`, `--live`, or an explicitly bounded live command such as `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
- Route-triggered live sync uses `execute=true` or `dryRun=false`.
- `force=true` is used only after status, retry, failed-job, and dead-letter inspection.
- Runtime, page, and page-timeout bounds are acceptable.
- Database target is confirmed.
- Typesense target is confirmed.
- Recent MLS/listing completions show successful search indexing or no index diagnostics.
- `npm run smoke:mls-status` has `searchIndex.failed=0` and no unresolved search-index diagnostics.
- `npm run smoke:search` reports healthy Search Smoke Readiness for source, `meta.source`, access level, filters, bounds, mapped count, coordinate filtering, response duration, and `meta.smoke.ready=true` with no blockers.
- Search-index health and indexing behavior are acceptable before live-inventory claims or MLS-backed public expansion.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` reports acceptable queue diagnostics before recurring email traffic, live-inventory claims, MLS-backed public expansion, MLS-volume decisions, scheduler cadence increases, or large programmatic content batch publication.
- Queue dashboard source-queue dead-letter summaries are reviewed when the local Next API is not running.
- Busy queue dashboard output points to the relevant worker start command, and the worker is started or explicitly deferred before increasing scheduler cadence or ingestion volume.
- Database-connectivity queue failures route to `npm run supabase:check` before dry-run retry or live retry.
- MLS workers must pass their startup database preflight before consuming queued MLS sync or page jobs.
- Stale active queue jobs are not acceptable diagnostics; inspect retry state, source-queue dead letters, and worker process health before retrying or adding work.
- Stale active recovery uses a dry run first: `npm run run:queue-maintenance -- --queue=mls-page --job-id=<jobId>`. Live recovery requires the same command with `--execute` only after the target job is stale and unlocked.
- Failed-job retry uses a dry run first: `npm run run:queue-maintenance -- --action=retry-failed --queue=mls-sync --limit=10`. Live retry requires a target `--job-id=<jobId>` plus `--execute`.
- Existing failed jobs can be captured for review with `npm run run:queue-maintenance -- --action=capture-dead-letter --queue=mls-sync --job-id=<jobId> --execute` after a dry run.
- Reviewed dead-letter records can be resolved with `npm run run:queue-maintenance -- --action=resolve-dead-letter --queue=reie-dead-letter --job-id=<jobId> --execute` after a dry run; this does not retry or remove the original source job.

Live alert gate:

- Internal test recipient has received a valid alert.
- Unsubscribe link works.
- Click tracking works.
- Sender domain is verified.
- Suppression and unsubscribe records are honored.
- `npm run smoke:mls-status` search-index health has been reviewed before the live send.
- `npm run smoke:search` returns healthy Search Smoke Readiness before the live send.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` returns acceptable queue diagnostics before the live send.

Live scheduler gate:

- Manual command works.
- Protected route works.
- Timeout-bounded queue dashboard output from `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` is visible.
- `npm run smoke:ops` passes while Terminal 1 is running.
- CRM scheduler command `npm run run:crm:scheduler` outputs `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`.
- CRM admin API checks expose `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, with `audit` and `readiness` where applicable.
- `/admin` shows the CRM API Inspection panel with `generatedAt`, `inspectionSource`, `route`, `terminal`, the Terminal 5 inspection command, closure audit coverage, note-backed completion/dismissal, and the visible `npm run run:crm:scheduler` command in readable command panels on smaller screens.
- CRM Review, Complete, and Dismiss actions refresh CRM API Inspection metadata from `/api/admin/crm-tasks/[id]` before the active-task list refresh, preserve failed detail-route inspection metadata when a request fails, and the visible API-provided Source field returns from `Detail Route` to `List Route`.
- CRM `report.readiness.level=blocked` stops CRM scheduler activation until closed tasks have review notes.
- CRM scheduler readiness should remain traceable to `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`.
- CRM recurring scheduler setup should follow `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.
- Logs are visible.
- Failure behavior is known.
- Retry path is available.

## Do Not Automate Yet

Keep these manual until validated:

- Full MLS production sync at high volume.
- Continuous live alert sending.
- Public digest sending.
- Automatic retry of repeated dead-letter jobs.
- Programmatic public SEO expansion at large scale.
- Any command that writes to production without dry-run support.
- Recurring email traffic, including recurring alert or digest sends, when search-index diagnostics are degraded, Search Smoke Readiness is blocked, or timeout-bounded queue diagnostics are unacceptable.

## SEO Authority Core

The launch core should support David Quinn Group authority signals without manufacturing thin pages.

Authority control document:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`

Priority SEO surfaces:

- Colorado real estate intelligence.
- Boulder housing market intelligence.
- Denver area housing market intelligence.
- Local city and neighborhood market pages.
- Property search pages with real inventory and useful internal links.
- Agent and organization schema.
- Article, FAQ, and tool schema where the page actually supports it.

Quality rules:

- Prefer fewer strong pages over many weak pages.
- Every public page should answer a real buyer, seller, relocation, or investor question.
- Internal links should guide users by city, neighborhood, property type, and market intent.
- Do not publish large programmatic batches until data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

## Verification Baseline

Run this baseline from **Terminal 5: Scripts / curl testing** before marking launch-core work complete:

```bash
npm run worker:build
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm:scheduler
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

## Known Non-Blocking Warnings

- `npm run build` may show Node `url.parse()` deprecation warnings.
- Local Typesense `properties` and `listings` schemas were verified ready with `npm run typesense:collections:check` on May 31, 2026; reindexing still depends on Supabase connectivity.
- Generated `dist/` output can contain stale JavaScript for deleted source files until `npm run worker:build` is rerun from a clean output state.

## Immediate Next Work

The next high-value work after this checklist is to tighten the launch path around actual local validation:

1. Restore or replace the configured Supabase endpoint so database-backed dry-runs and Typesense reindexing can fetch records.
2. Confirm Supabase readiness with `npm run supabase:check`.
3. Reindex local Typesense with `npm run typesense:reindex`.
4. Verify `/search` against the reindexed data.
5. Verify `npm run smoke:search` Search Smoke Readiness shows expected source, `meta.source`, health, access level, filters, bounds, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
6. Validate protected MLS dry-run routes.
7. Validate protected alert dry-run route.
8. Confirm map/sidebar selected-listing popup reliability with real indexed data.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md -->
