# Atlas Platform Plan

This document is the roadmap-level plan for the Real Estate Intelligence Engine. It keeps the build aligned with `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0` while implementation moves across search, MLS ingestion, seed data, alerts, digest email, CRM intelligence, SEO authority, admin operations, queue diagnostics, scheduling, and production readiness.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Product Thesis

The Real Estate Intelligence Engine should become David Quinn Group's public intelligence layer for Colorado real estate.

The goal is not only to show listings. The goal is to combine MLS-backed inventory, local expertise, map intelligence, saved-search behavior, email engagement, CRM signals, operational reliability, and authority content into a platform that helps clients make better decisions and helps search engines understand David Quinn Group as a trusted authority in Colorado, Boulder, Denver, and the greater Front Range.

## Primary Outcomes

- A premium map-led property search experience.
- Reliable MLS Grid ingestion with real listing media.
- Search results backed by Postgres source-of-truth data and Typesense indexing.
- Explicit seed workflows for local setup and verification.
- Saved-search alerts and digest emails with safe tracking and unsubscribe flows.
- CRM intelligence based on user engagement, saved searches, preferences, and alert clicks.
- Admin visibility for MLS sync status, retry, dead-letter diagnostics, queue health, alerts, digest sends, and CRM tasks.
- Crawlable city, neighborhood, market, property, article, and tool pages.
- Consistent David Quinn Group entity signals across public pages, schema, email, and CRM surfaces.
- Production workflows that can be operated safely without unbounded syncs, hidden seed writes, silent email sends, or unclear queue failures.

## Current Platform State

Core application:

- Next.js App Router frontend and API routes.
- Supabase PostgreSQL as the source of truth.
- Prisma as the application query client.
- Redis and BullMQ for queue-backed background work.
- Typesense for property and listing search.
- Resend for alert and digest email delivery.
- Compiled Node workers in `dist/workers`.
- Compiled Node scripts in `dist/scripts`.

Generated output:

- `dist/` is generated worker and script output.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

Search and map:

- `/search` is the primary search surface.
- `/api/search` returns search metadata, including source, `meta.source`, health, access level, filters, bounds, returned count, mapped count, coordinate-filtered count, response duration, `meta.smoke`, and Typesense query context when available.
- `meta.smoke` reports Terminal 5 `npm run smoke:search` readiness with command, terminal, ready, blockers, and structured checks.
- Homepage search and `/search` pass search metadata into the map layer for diagnostics, including fallback smoke diagnostics when metadata is missing.
- Map and sidebar interaction is smooth.
- Sidebar listing selection recenters the map and can open map previews.
- Premium terrain styling, contour treatment, and electric blue water are established design targets.
- Remaining search work should preserve speed and smooth interaction while adding intelligence.

MLS ingestion:

- MLS Grid sync is bounded by page size, page count, runtime, per-page timeout, rate delay, and worker execution.
- Route-triggered sync validation should use `dryRun=true` first.
- Live route-triggered sync work requires `execute=true` or `dryRun=false`.
- Forced route-triggered sync work requires `force=true` and should only follow status, retry, and dead-letter inspection.
- Direct script sync defaults to dry-run unless `--execute` or `--live` is passed.
- Direct script sync supports scheduler-safe JSON output through `--json`.
- MLS page fetch timeout is controlled by `pageTimeoutMs`, `--page-timeout-ms`, or `MLS_PAGE_TIMEOUT_MS`.
- Listings are normalized and upserted into Postgres.
- `scripts/fetchMLS.ts` is a compatibility wrapper around the active `syncMLSGrid()` path.
- `upsertListing()` writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- Photos are normalized into `PropertyPhoto`.
- Existing media is preserved when MLS returns no usable photos.
- `processListing()` updates Typesense through `updateSearchIndex()` immediately after the Postgres upsert.
- Direct sync, page worker, listing worker, admin status, and MLS status diagnostics expose search-index attempts, successes, failures, unknown states, health, diagnostics, and recent index outcomes.
- Listing changes can trigger saved-search matching and alert queue creation.
- Failed BullMQ jobs are mirrored into `reie-dead-letter` after final retry exhaustion with bounded and redacted payload snapshots.
- Legacy MLS helper cleanup is complete.

Search indexing:

- Typesense uses two compatible collections: `properties` and `listings`.
- Both collections must keep search-critical fields compatible, including faceted `neighborhood`.
- `lib/typesense/schema.ts` is the canonical schema source.
- The canonical schema validates required fields, required facets, expected field types, sortable fields, and default sort field.
- Single-listing indexing flows through `lib/mls/updateSearchIndex.ts` and `lib/typesense/indexListing.ts`.
- Active MLS listing processing reports `indexAttempted`, `indexSucceeded`, and `indexFailed` so index drift is visible before scaling sync volume.
- Bulk reindexing flows through `lib/typesense/indexProperties.ts` and `scripts/index.ts`.
- Compatibility helpers use the canonical schema and validate created collections.
- Local Typesense collections must be repaired after schema changes.
- Supabase-backed reindexing should run after collection repair when `npm run supabase:check:json` reports readiness.
- `/api/mls/status` exposes first-class `searchIndex` health.
- `/api/mls/status` exposes first-class smoke command guidance through `commands.smokeOps`, `commands.smokeMlsStatus`, and `commands.smokeSearch`, while preserving raw API inspection commands through `commands.rawStatus` and `commands.rawSearchCheck`.
- `npm run smoke:search` is the Search Smoke Readiness check before raising MLS volume, recurring email traffic, alert or digest traffic, or scheduler cadence.

Seed data:

- `scripts/quickSeed.ts` writes a small David Quinn Group authority seed.
- `scripts/seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Both seed scripts create or update `Property` rows.
- Both seed scripts replace existing seeded `PropertyPhoto` rows for their own properties.
- Both seed scripts report database, photo, and per-collection Typesense status.
- Seed commands are explicit Terminal 5 tools, not app startup behavior, API behavior, recurring scheduler behavior, or production inventory strategy.
- Real MLS media remains the production source for live listing imagery.

Alerts, digest email, and engagement:

- Saved searches generate deduplicated `AlertQueue` work through `AlertEvent`.
- Alert and digest dry-runs are read-only.
- The base alert script is dry-run by default.
- Live alert sends must use `npm run run:alerts:live`, `npm run run:worker:alerts:once:live`, continuous worker queue consumption, or an explicitly live protected API request.
- Live alert sends claim work with `pending -> processing -> sent`.
- Alert and digest sends use `lib/email/sendEmail.ts`.
- Email links use `/api/track-click` when user context exists.
- Unsubscribe links use `/api/unsubscribe`.
- Click tracking can update `UserInteraction`, `AlertQueue.clickedAt`, `User.heatScore`, and learned preferences.
- Recurring email traffic, including recurring alert or digest sends, should wait for `npm run supabase:check:json`, sender domain, unsubscribe, click tracking, internal live-send validation, healthy search-index diagnostics, healthy Search Smoke Readiness, and acceptable timeout-bounded queue diagnostics.

CRM intelligence:

- Preference learning writes to `UserPreference`.
- Hot lead ranking uses heat score, activity recency, saved searches, preferences, and alert clicks.
- `createTask()` creates `PRE_DISCOVERY_BRIEF` tasks through `prisma.cRMTask`.
- Saved-search intake creates `strategy_intake` CRM tasks with alert-readiness metadata.
- CRM task reporting exists through `scripts/runCRM.ts`, `workers/runCRMTasks.ts`, `/api/admin/crm-tasks`, `/api/admin/crm-tasks/[id]`, and `/admin`.
- CRM review can mark tasks as reviewing, completed, or dismissed.
- CRM completion and dismissal require review notes.
- CRM closure audit coverage is reported through `/api/admin/crm-tasks` and surfaced in `/admin`.
- CRM admin API responses include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus either `task` or `tasks` on successful reads.
- `/api/admin/crm-tasks` reports `inspectionSource: "List Route"` and `/api/admin/crm-tasks/[id]` reports `inspectionSource: "Detail Route"` on success and error responses.
- `/admin` CRM API Inspection renders Source from API-provided `inspectionSource`, showing `List Route` metadata for `/api/admin/crm-tasks` by default, briefly showing `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions, preserving failed detail-route inspection metadata when a request fails, and returning the main panel to `List Route` metadata after active-task refresh.
- CRM readiness verdicts are reported through `/api/admin/crm-tasks` and surfaced in `/admin` with gates for Closure Audit, Active Review, and Alert Criteria.
- Terminal 5 CRM reports from `scripts/runCRM.ts` and `workers/runCRMTasks.ts` are read-only and include closure audit counts plus CRM readiness gates.
- Scheduled CRM reporting uses `npm run run:crm:scheduler` for one machine-readable readiness payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Admin and operations:

- `/admin` provides the operations entry point.
- `/admin` shows the current MLS sync envelope, including page size, page count, runtime, page timeout, and worker/check terminals.
- `/admin` shows recent MLS completion metrics, including search-index attempt/success/failure values when available.
- `/admin` shows search-index health in MLS operations so index drift is visible before scheduler cadence increases.
- `/admin/dead-letter` provides dead-letter inspection.
- `/admin/dead-letter` shows active filter summary and inspection terminal context.
- `/api/mls/status` provides sync, queue, dead-letter, and recent search-index diagnostics.
- `/api/mls/retry` provides dry-run and live retry for failed BullMQ jobs.
- `/api/mls/sync` and `/api/mls-sync` expose bounded protected sync entrypoints.
- `/api/mls/sync` documents expected job result metrics for ingestion, alerts, and search-index reporting.
- `/api/process-alerts` exposes bounded protected alert processing.
- `/api/admin/dead-letter` provides bounded dead-letter inspection.
- `/api/admin/crm-tasks` provides bounded CRM task reporting, closure-audit coverage, and CRM readiness verdicts.
- `/api/admin/crm-tasks/[id]` provides bounded CRM task review updates with note-required completion and dismissal.
- `scripts/queueDashboard.ts` provides timeout-bounded Terminal 5 diagnostics for MLS, page-worker, alert, and dead-letter queues through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.

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

## Operating Rules

- Never run unbounded MLS syncs.
- Keep MLS syncs bounded by page size, page count, runtime, page timeout, and rate delay.
- Keep heavy ingestion, alerting, indexing, email, retry, CRM, seed writes, and reporting work out of page rendering.
- Keep API routes bounded and diagnostic.
- Treat Supabase/Postgres as the source of truth.
- Treat Typesense as a rebuildable search index.
- Preview retries before live retry.
- Use targeted queue/job retry when possible.
- Treat broad live retry across all queues as exceptional and require `allowAllLive=true`.
- Inspect timeout-bounded queue dashboard and dead-letter diagnostics before live retry.
- Use dry-run mode before live email sends.
- Treat failed `npm run supabase:check:json`, degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as blockers before recurring email traffic, including recurring alert or digest sends.
- Keep alert, digest, and seed dry-runs read-only.
- Keep unsubscribe behavior idempotent.
- Keep tracked redirects constrained to safe destinations.
- Keep CRM task completion and dismissal human-reviewed through the admin review flow.
- Require review notes for CRM task completion and dismissal.
- Keep CRM closure audit coverage visible in `/admin` and `/api/admin/crm-tasks`.
- Treat CRM `readiness.level=blocked` as a scheduler cadence or automation blocker until closed tasks have review notes.
- Keep seed scripts explicit, terminal-run, and out of recurring production schedules.
- Keep public authority pages crawlable, internally linked, locally specific, and tied clearly to David Quinn Group.

## Terminal Map

| Terminal | Purpose | Primary commands |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, `npm run smoke:ops`, bounded live syncs, seed commands, CRM help, smoke checks, curl checks, Typesense repair |

## Verification Baseline

Run after platform-level code or architecture changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run supabase:check:json
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run typecheck
npm run lint
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
```

Run script help checks after alert, digest, CRM, or worker script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Run operational smoke checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Use equivalent raw curl checks when protected route auth, HTTP status output, or one-off API diagnostics are needed:

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

Expected current non-blocking warnings:

- Node `url.parse()` deprecation warnings appear during build.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- Search metadata now exists with source, health, access level, filters, bounds, returned, mapped, coordinate-filtered, and duration fields, but full Typesense result verification should wait until `npm run supabase:check:json` reports readiness and reindex is complete.
- `dist/` may contain stale generated JavaScript for deleted source files until generated output is cleaned.

Known current blocker:

```text
DNS lookup failed: ENOTFOUND otmkoqvmhthitldlnjdk.supabase.co
FATAL: (ENOTFOUND) tenant/user postgres.otmkoqvmhthitldlnjdk not found
```

This can block alert, digest, CRM, MLS, seed, and reindex commands that depend on Supabase. Follow `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md` and use `npm run supabase:check:json` as the non-secret readiness gate.

## Roadmap Sequence

### Phase 1. Local Search Index Stabilization

Goal:

- Ensure local `properties` and `listings` collections both use the current canonical schema.

Work:

- Start Docker/Typesense from **Terminal 4: Docker / Typesense**.
- Build worker output from **Terminal 5: Scripts / curl testing**.
- Repair Typesense collections with `npm run typesense:init`.
- Reindex Typesense with `npm run typesense:reindex` after `npm run supabase:check:json` reports readiness.
- Confirm local Typesense collections remain schema-ready with `npm run typesense:collections:check`.
- Confirm `npm run smoke:mls-status` reports `searchIndex.failed=0`.
- Confirm `npm run smoke:search` reports Search Smoke Readiness with `meta.smoke.ready=true` and no blockers.

Commands from **Terminal 5: Scripts / curl testing** after Terminal 4 is running:

```bash
npm run worker:build
npm run typesense:init
npm run supabase:check:json
npm run typesense:reindex
npm run smoke:ops
```

If Supabase is unreachable and only schema repair is needed:

```bash
npm run worker:build
npm run typesense:init
npm run build
```

### Phase 2. Supabase Connectivity And Dry-Run Recovery

Goal:

- Restore reliable database access for operational scripts.

Work:

- Confirm `DATABASE_URL` and Supabase pooler availability with `npm run supabase:check:json`.
- Run seed dry-runs.
- Run alert dry-run.
- Run digest dry-run.
- Run CRM scheduler reporting and confirm the output includes `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, and `report.readiness`.
- Run CRM admin API checks and confirm list/detail success and error responses include `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command`.
- Confirm `/api/admin/crm-tasks` returns `inspectionSource: "List Route"` and `/api/admin/crm-tasks/[id]` returns `inspectionSource: "Detail Route"` on success and error responses.
- Confirm `/admin` CRM API Inspection renders Source from API-provided `inspectionSource`, showing `List Route` metadata, then `Detail Route` metadata after Review, Complete, or Dismiss actions, preserving failed detail-route inspection metadata when a request fails, before returning to `List Route` metadata.
- Run route-triggered MLS dry-runs before queueing live sync work.
- Run bounded MLS sync only after status checks are clean.

Commands from **Terminal 5: Scripts / curl testing** after `npm run supabase:check:json` reports readiness:

```bash
npm run supabase:check:json
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:alerts:dry
npm run run:digest:dry -- --limit 1
npm run run:crm:scheduler
npm run smoke:ops
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
npm run run:mls-sync:dry
```

### Phase 3. Seed Workflow And Local Visual QA

Goal:

- Keep local development and map/listing visual QA usable without turning seed records into a production content strategy.

Work:

- Use seed dry-runs as verification checks.
- Use no-index seed commands when Typesense is offline or intentionally being repaired separately.
- Use indexed seed commands only when Typesense is healthy and collections match the canonical schema.
- Confirm seeded records create `PropertyPhoto` rows and reduce placeholder media in local seeded views.
- Keep seed scripts out of app startup, API routes, page rendering, and production schedules.

Commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

### Phase 4. MLS Production Hardening

Goal:

- Make ingestion durable before scaling volume.

Work:

- Validate bounded MLS sync behavior.
- Use `npm run run:mls-sync:dry` before any direct live script sync.
- Use `npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000` for scheduler-safe dry-run validation.
- Use explicitly bounded live scheduler commands such as `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000` instead of broad live shortcuts.
- Keep page timeout bounded through `pageTimeoutMs`, `--page-timeout-ms`, or `MLS_PAGE_TIMEOUT_MS`.
- Use `execute=true` for intentional live route syncs.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- Confirm sync locks and state updates.
- Confirm photo persistence and real media coverage.
- Confirm stale placeholder media is reduced.
- Confirm Typesense reindex reflects current Postgres listings.
- Confirm live or dry-run sync summaries report `indexFailed=0` before increasing MLS volume.
- Treat `indexFailed > 0` as degraded search freshness even when the Postgres upsert succeeds.
- Confirm `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, recurring email traffic, live-inventory claims, or MLS-backed public expansion.
- Inspect failed jobs through `/admin/dead-letter`.
- Use `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md` as the completion record for removed legacy MLS helpers.

Success criteria:

- Bounded syncs complete without hanging.
- Failed jobs are explainable and recoverable.
- Existing real media is not overwritten by empty MLS media.
- Typesense search results reflect current listing state.
- Search-index failures are visible in script output, worker results, admin completions, and `/api/mls/status`.
- Public search metadata identifies degraded source, access-level filtering, bounds filtering, coordinate filtering, and response duration.
- REIE intelligence fields are populated consistently through the active `upsertListing()` path.

### Phase 5. Public Search And Map Intelligence

Goal:

- Move from a visually strong property map to a more useful intelligence surface.

Work:

- Keep sidebar and map state synchronized.
- Make selected-listing behavior reliable for every sidebar item.
- Improve listing preview cards.
- Use `/api/search` metadata to distinguish empty inventory, coordinate filtering, access-level filtering, bounds filtering, DB fallback, degraded health, Typesense result drift, and `meta.smoke` readiness blockers.
- Replace placeholder property media with MLS/media-derived images.
- Add market or neighborhood context overlays only after map performance remains stable.
- Preserve fast interaction and clear mobile behavior.

Success criteria:

- Clicking every visible listing either opens a preview or explains why it cannot.
- Sidebar media uses real property images whenever available.
- `/api/search` metadata shows source, `meta.source`, health, access level, filters, bounds, returned, mapped, coordinate-filtered, duration, and `meta.smoke.ready=true` with no blockers during local verification.
- Map visual styling remains premium without slowing interaction.

### Phase 6. Authority Page Expansion

Goal:

- Build Google-recognizable local authority around David Quinn Group.

Work:

- Use `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md` as the control document for public authority surfaces.
- Strengthen city pages.
- Strengthen neighborhood pages.
- Improve market pages.
- Improve property pages.
- Add useful article and guide surfaces where they support real search intent.
- Improve internal links between market, property, city, neighborhood, tool, and article pages.
- Keep schema markup consistent across agent, article, FAQ, tool, and property pages.
- Use fresh MLS-backed inventory as supporting evidence only where stable.
- Do not treat local seed content as production authority content.
- Use CRM engagement signals for content prioritization only after protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and API Inspection metadata are visible.
- Use live-inventory claims only after search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- Allow large programmatic content batch publication only after data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.

Authority signals to reinforce:

- David Quinn Group.
- Colorado real estate.
- Boulder real estate.
- Denver real estate.
- Greater Front Range relocation, neighborhood, buyer, seller, and market expertise.

### Phase 7. Email, Digest, And CRM Readiness

Goal:

- Prepare engagement workflows for controlled production use.

Work:

- Confirm Resend sender domain authentication.
- Confirm unsubscribe behavior.
- Confirm click tracking redirects safely.
- Run alert and digest dry-runs before intentional live sends.
- Confirm `npm run smoke:mls-status` search-index health before recurring email traffic.
- Confirm `npm run smoke:search` Search Smoke Readiness before recurring email traffic.
- Send controlled internal tests before user-facing sends.
- Validate `EmailLog`, `AlertQueue`, `UserInteraction`, `UserPreference`, and CRM task records.
- Validate CRM closure audit coverage through `/admin` and `/api/admin/crm-tasks`.
- Validate CRM `readiness.level` is not `blocked` before scheduler cadence increases.
- Validate CRM API Inspection `List Route` and `Detail Route` metadata behavior through API-provided `inspectionSource` values, including failed detail-route preservation in `/admin`, before recurring CRM reporting.

Success criteria:

- No email sends from page rendering.
- Dry-runs do not mutate state.
- Live sends are intentional, explicit, bounded, logged, and reversible at the user preference level.
- Email click destinations are healthy before recurring email traffic, including recurring alert or digest sends, is enabled.
- CRM tasks are useful enough for human review, and completed/dismissed CRM tasks retain review notes.

### Phase 8. Admin Operations Expansion

Goal:

- Give the platform enough operational visibility to recover cleanly.

Work:

- Keep `/admin/dead-letter` diagnostic only.
- Continue expanding queue health surfaces from the current timeout-bounded Terminal 5 dashboard.
- Continue expanding MLS sync summaries from the current admin sync envelope.
- Add recent ingestion diagnostics.
- Add alert and digest reporting.
- Expand CRM audit history views beyond the current closure coverage metrics.
- Keep live retry separated from inspection until audit/confirmation flows are designed.

Success criteria:

- Operator can see queue state, failed jobs, and recent sync outcomes without reading raw logs first.
- Operator can decide whether a retry, schema repair, database fix, or code fix is appropriate.

### Phase 9. Production Scheduling And Hosting Decisions

Goal:

- Move from local scripts to reliable production operations.

Work:

- Choose managed Redis provider.
- Choose managed Typesense provider.
- Choose production worker host.
- Choose production scheduler provider.
- Finalize the scheduler approach documented in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.
- Set production limits for MLS throughput.
- Confirm email sending domain and reply handling.
- Define alert and digest cadence rules.
- Keep seed scripts out of recurring production schedules.

Rollout order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index diagnostics review through `npm run smoke:mls-status`.
4. Search Smoke Readiness verification through `npm run smoke:search`, including `meta.smoke.ready=true` and no blockers.
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
| Typesense reindex | manual only | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

Success criteria:

- Recurring jobs are scheduled explicitly.
- Database-backed recurring jobs do not run unless `npm run supabase:check:json` reports readiness.
- Production workers are observable.
- Search infrastructure is replaceable and recoverable.
- Email sends are bounded and auditable.
- Queue diagnostics are timeout-bounded before retry, ingestion volume, scheduler cadence, recurring scheduler activation, recurring email traffic, alert, digest, live-inventory, MLS-volume, MLS-backed public expansion, or large programmatic content batch publication decisions.
- `npm run supabase:check:json`, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics pass before email traffic is sent into the search experience.
- Large programmatic content batch publication waits for verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
- Seed scripts remain controlled manual tools.

## Current Known Gaps

- Local Typesense `properties` and `listings` collections are schema-ready.
- Supabase connectivity can block alert, digest, CRM, MLS, seed, and reindex dry-runs/reporting until `npm run supabase:check:json` reports readiness. Use `npm run supabase:check` for a human-readable check.
- Production smoke verification still needs `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and an internal tracked email click before recurring scheduler activation or recurring email traffic.
- Production Redis and Typesense provider decisions are still open.
- Production worker host and scheduler provider decisions are still open.
- Email domain authentication needs confirmation before recurring email traffic.
- CRM closure audit controls, note-backed completion/dismissal, CRM API Inspection metadata, and failed detail-route preservation are implemented locally; production admin smoke verification still needs to run after Terminal 1 is running and `npm run supabase:check:json` reports readiness.
- Placeholder property media should continue being replaced by reliable MLS/media handling.
- Seed scripts now create local photo rows, but real MLS media remains the production source of truth.
- Admin UI has MLS sync envelope visibility and dead-letter inspection, but broader queue, sync, alert, digest, and CRM controls are pending.
- Large MLS sync throughput needs controlled load testing.
- Legacy MLS helper cleanup is complete and recorded in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`.

## Working Standard

For each implementation step:

- Replace full files when editing.
- Provide the full path of each file being created or replaced.
- Add the file path comment at the bottom of code files when file syntax allows comments.
- Keep changes scoped to the current module.
- Avoid unrelated refactors.
- Do not delete files unless cleanup is specifically identified.
- Preserve existing user work and unrelated changes.
- Verify with worker build, `npm run supabase:check:json`, MLS dry-run, queue dashboard, TypeScript, lint, seed dry-runs when relevant, and production build checks.
- State which terminal should run user-facing commands.
- State the next file to work on.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/atlas-platform-plan.md -->
