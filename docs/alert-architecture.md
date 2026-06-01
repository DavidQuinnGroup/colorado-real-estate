# Alert Architecture

The alert system turns saved searches into timely David Quinn Group property intelligence. It must avoid duplicate sends, respect unsubscribe state, keep email delivery outside page rendering, preserve engagement data, expose queue diagnostics, and feed preference learning, hot-lead scoring, CRM follow-up, and future client service workflows.

Alert matching is Postgres-driven. Typesense powers public search, market inventory, neighborhood pages, and listing discovery, but alert eligibility and deduplication remain tied to Supabase/Postgres so notification behavior follows the source of truth.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Product Goals

- Notify subscribed users when a new or changed listing matches their saved search.
- Keep alert delivery reliable even when the local search index is being repaired.
- Use branded, useful property intelligence rather than generic listing blasts.
- Track engagement safely so CRM follow-up reflects real user behavior.
- Preserve unsubscribe and redirect safety before any production live-send cadence.
- Keep every live-send path explicit, bounded, and reviewable.

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, alert/digest dry-runs, seed commands, CRM help, smoke scripts, curl checks, Typesense repair |

## Core Data Model

Saved search intent:

- `SavedSearch`
- Stores criteria such as city, minimum price, beds, property type, and map bounds.
- Only active saved searches are eligible for matching.

Alert deduplication:

- `AlertEvent`
- Deduplicates by `userId`, `propertyId`, and `type`.
- Prevents repeated `NEW_LISTING` alerts for the same user and property.

Alert work:

- `AlertQueue`
- Stores `userId`, `status`, `payload`, `clickedAt`, and timestamps.
- Current statuses are `pending`, `processing`, `sent`, `skipped`, and `failed`.

Delivery logging:

- `EmailLog`
- Records alert and digest send metadata.

Engagement:

- `UserInteraction`
- Stores tracked email click behavior and lead-scoring metadata.
- Listing email clicks currently record `type = LISTING_CLICK`.

Preference learning:

- `UserPreference`
- Stores learned preferences from clicked alert payloads.

## Matching Flow

Primary file:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/matchSearches.ts`

Flow:

1. MLS ingestion upserts a property into Postgres.
2. `processListing()` calls the saved-search matching path.
3. Active saved searches are loaded with subscribed users.
4. A property is evaluated against saved criteria: city, price, beds, property type, and map bounds.
5. `AlertEvent` deduplicates by user, property, and alert type.
6. New `AlertQueue` rows are created for non-duplicate matches.
7. Summary counts report scanned searches, matched searches, queued alerts, duplicate skips, user skips, and invalid property skips.

Rules:

- Search-index timing must not control alert eligibility.
- Alert matching can still run from Postgres when Typesense is stale, offline, or being repaired.
- Supabase/Postgres connectivity is required for matching, queueing, delivery, engagement, and CRM follow-up.
- Local Typesense repair still matters because alert and digest emails send users back into public search, market, neighborhood, and property pages.
- Recurring email traffic, including recurring alert or digest sends, should wait until `npm run smoke:mls-status` search-index diagnostics, `npm run smoke:search` Search Smoke Readiness reports `meta.smoke.ready=true` with no blockers, and timeout-bounded queue diagnostics are acceptable so recipients land on current public search/property surfaces.

## Alert Payload

Alert payloads are intentionally denormalized so email generation does not require a full property join.

Payload fields include:

- `id`
- `propertyId`
- `mlsId`
- `slug`
- `address`
- `city`
- `state`
- `price`
- `beds`
- `baths`
- `sqft`
- `propertyType`
- `image`
- `efficiencyScore`
- `resilienceScore`
- `url`

Rules:

- Keep payloads self-contained enough for email rendering.
- Treat malformed payloads as explicit failures.
- Do not silently send incomplete alert emails.
- Use real MLS/media-derived images whenever available.
- Local seed images are acceptable for development and visual QA, but they are not production inventory strategy.

## Alert Processing

Primary processor:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts`

The processor can:

- Process pending alerts in bounded batches.
- Process one alert by id.
- Run in dry-run preview mode.
- Skip users without email.
- Skip unsubscribed users.
- Fail invalid payloads.
- Claim alerts with `pending -> processing`.
- Send email through `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`.
- Create `EmailLog` rows after successful sends.
- Preserve structured counts for scripts, APIs, and workers.

Protected API route:

- `GET /api/process-alerts`
- `GET /api/process-alerts?dryRun=true`
- `POST /api/process-alerts`
- `POST /api/process-alerts?dryRun=true&limit=25`

Scripts:

- `npm run run:alerts`
- `npm run run:alerts:dry`
- `npm run run:alerts:live`

Workers:

- `npm run run:worker:alerts`
- `npm run run:worker:alerts:dry`
- `npm run run:worker:alerts:once`
- `npm run run:worker:alerts:once:live`

## Admin Protection

`/api/process-alerts`, `/api/admin/dead-letter`, `/api/mls/status`, and `/api/mls/retry` are operational surfaces. In production they require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Local development can bypass the key only when neither admin key environment variable is configured.

Production example:

```bash
curl --max-time 20 -s -X POST -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/process-alerts?dryRun=true&limit=25"
```

## Claiming And Dry-Run Rules

Live alert sends claim work before delivery:

```text
pending -> processing -> sent
```

Failure states:

- Missing email: `skipped`
- Unsubscribed user: `skipped`
- Invalid payload: `failed`
- Send failure: `failed`

Dry-run behavior:

- Does not claim alerts.
- Does not create unsubscribe tokens.
- Does not send email.
- Does not update `AlertQueue.status`.
- Returns preview, skipped, and failed classifications for review.

Live behavior:

- Requires `npm run run:alerts:live`, `npm run run:worker:alerts:once:live`, continuous worker queue consumption, or an explicit live API request.
- Must remain bounded by limit, one-shot scope, or queue worker concurrency.
- Must be preceded by a reviewed dry-run and internal live-send test.
- Should not be scheduled broadly while `npm run smoke:mls-status` reports degraded search-index health, `npm run smoke:search` reports `meta.smoke.ready=false`, blockers, unexpected database fallback, filtering, or mapping issues, or timeout-bounded queue diagnostics are unacceptable.

## Worker Modes

Primary file:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts`

Modes:

- `queue`: consume BullMQ jobs from `reie-alerts`
- `batch`: poll pending database alerts
- `hybrid`: run queue consumer and batch polling

Environment controls:

- `ALERT_WORKER_MODE`
- `ALERT_WORKER_BATCH_SIZE`
- `ALERT_WORKER_INTERVAL_MS`
- `ALERT_WORKER_CONCURRENCY`
- `ALERT_WORKER_ONCE`
- `ALERT_WORKER_DRY_RUN`

Default mode:

- `hybrid`

Rules:

- `ALERT_WORKER_DRY_RUN=true` is allowed only in one-shot or batch mode.
- Dry-run worker mode must not silently consume BullMQ queue jobs.
- `npm run run:worker:alerts:once` is a dry-run batch one-shot.
- `npm run run:worker:alerts:once:live` is an explicit live one-shot.
- `npm run run:worker:alerts` is a continuous live worker and belongs in **Terminal 3: Coordinator** after recurring email traffic readiness is verified.

Generated output note:

- Worker runtime executes compiled files from `dist/workers`.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

## Email Delivery

Primary file:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`

Provider:

- Resend

Required for real sends:

- `RESEND_API_KEY`

Optional sender controls:

- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`

Current behavior:

- Lazy Resend initialization.
- Branded David Quinn Group alert and digest rendering.
- One or more listing payloads per message.
- Normalized text, number, URL, and image fields.
- HTML and plain-text bodies.
- Tracked CTA destinations through `/api/track-click`.
- Tokenized unsubscribe links through `/api/unsubscribe`.
- `EmailLog` creation for alert and digest sends.

Rules:

- Do not send email from page rendering.
- Do not send exploratory MLS ingestion emails unless delivery is intentional.
- Confirm Resend credentials and sender domain authentication before production live sends.
- Run dry-runs before intentional live sends.
- Keep recurring email traffic, including recurring alert or digest sends, disabled until sender domain, unsubscribe, click tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness is verified with `meta.smoke.ready=true` and no blockers, and timeout-bounded queue diagnostics are acceptable.

## Digest Delivery

Primary file:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts`

Digest behavior:

- Groups relevant listing payloads into a single branded email where possible.
- Supports strict CLI parsing.
- Supports dry-run preview mode.
- Supports bounded live send mode.

Digest commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
npm run run:digest -- --limit 25
```

Digest rules:

- Use dry-run first.
- Dry-run does not create unsubscribe tokens, claim alerts, send email, or mutate statuses.
- Live sends claim usable pending alerts and mark malformed payloads explicitly.
- Preserve unsubscribe links.
- Preserve tracked click destinations.
- Record successful sends in `EmailLog`.
- Do not enable recurring email traffic, including recurring digest sends, until alert delivery behavior, search-index health, Search Smoke Readiness is stable with `meta.smoke.ready=true` and no blockers, and timeout-bounded queue diagnostics are acceptable.

## Production Scheduling

Production alert and digest scheduling follows the staged scheduler plan:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`

Relevant rollout order:

1. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
2. Search-index result review from sync output, worker results, `npm run smoke:mls-status`, and `/admin`.
3. `npm run smoke:search` metadata verification for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
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

Conservative starting schedule:

| Job | Cadence | Command |
| --- | --- | --- |
| Alert processing dry-run | every 30 minutes during validation | `npm run run:alerts:dry -- --limit 50` |
| Alert processing live | every 30 minutes after approval | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |

Scheduling rules:

- Do not enable all live schedules at once.
- Start with manual dry-runs.
- Run controlled internal live-send tests before user-facing schedules.
- Run `npm run smoke:ops` from Terminal 5 before recurring email traffic, including recurring alert or digest sends.
- Keep scheduler logs visible in the selected provider.
- Failed scheduled jobs must surface through provider logs, queue state, admin diagnostics, or dead-letter inspection.
- Seed scripts are not scheduled.

## Click Tracking

Primary route:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`

Flow:

1. User clicks an email CTA.
2. Tracking endpoint receives user/listing context and a destination.
3. Destination is validated and constrained to safe local or David Quinn Group destinations.
4. Missing tracking context still redirects safely.
5. Missing or unsubscribed users are not tracked.
6. Matching sent, pending, or processing alert rows are updated with `clickedAt` when enough context exists.
7. `UserInteraction` records the click with source and destination metadata.
8. `User.heatScore` is incremented.
9. `updateUserPreferences(userId)` runs asynchronously.
10. User is redirected to the listing or search destination.

Allowed redirect hosts:

- current request host
- `davidquinngroup.com`
- `www.davidquinngroup.com`
- `localhost`
- `127.0.0.1`
- `::1`

Rule:

- `/api/track-click` should redirect safely even when tracking fails.

## CRM Engagement Path

Email engagement contributes to CRM intelligence:

1. `/api/track-click` records click behavior.
2. `updateUserPreferences()` learns bounded buyer preference signals.
3. `getHotLeads()` ranks leads by recent clicks, heat score, and listing context.
4. `createTask()` can create `PRE_DISCOVERY_BRIEF` CRM tasks.
5. Saved-search intake can create `strategy_intake` CRM tasks with alert-readiness metadata.
6. `/api/admin/crm-tasks` reports active, pending, reviewing, completed, dismissed, or all CRM task queues.
7. `/api/admin/crm-tasks` reports `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also report closure-audit counts for completed/dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
8. `/api/admin/crm-tasks` reports a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
9. `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
10. `/api/admin/crm-tasks/[id]` requires a non-empty review note before a CRM task can be marked `completed` or `dismissed`.
11. `/admin` surfaces CRM task readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, and note-backed Review, Complete, and Dismiss actions.
12. `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
13. `run:crm` and `run:worker:crm` report bounded CRM task summaries with closure audit counts and CRM readiness gates.
14. `run:crm:scheduler` emits one scheduler-safe JSON payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Related files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/preferences/updateUserPreferences.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`

Rules:

- CRM task reporting can be automated.
- CRM task completion and dismissal must remain human-reviewed through the admin review flow.
- Completed and dismissed CRM tasks require review notes.
- CRM closure audit coverage should stay visible in `/admin` and `/api/admin/crm-tasks`.
- CRM `readiness.level=blocked` should pause CRM automation or scheduler cadence increases until closed tasks have review notes.
- Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs can be parsed reliably.

## Unsubscribe

Primary route:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/unsubscribe/route.ts`

Behavior:

- Tokenized unsubscribe links.
- Idempotent unsubscribe updates.
- Safe local response page.
- No email send side effects.

Rules:

- Unsubscribe must be safe to click repeatedly.
- The route should not expose broad user data.
- Alert and digest processors must respect unsubscribed users before intentional live sends.

## Dead-Letter Handling

Failed BullMQ alert jobs are mirrored into:

- `reie-dead-letter`

Dead-letter payload snapshots contain:

- source queue
- source job id
- source job name
- failed reason
- timestamp
- attempts made
- bounded and redacted original payload
- stack

This is separate from `AlertQueue.status = failed`, which tracks application-level alert processing state.

Inspection surfaces:

- `GET /api/admin/dead-letter`
- `/admin/dead-letter`
- `GET /api/mls/status`
- `GET /api/mls/retry`
- `scripts/queueDashboard.ts`
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`

Rules:

- Dead-letter inspection is diagnostic only.
- BullMQ dead-letter capture happens after final retry exhaustion.
- Timeout-bounded queue dashboard output is diagnostic only and should be checked before deciding whether to retry alert jobs, repair payload data, or scale workers.
- `/admin/dead-letter` should show active filter summary and inspection terminal context.
- Retry remains handled through `/api/mls/retry` after dry-run preview.
- Targeted retry should include a specific queue and job id.
- Broad live retry across queues requires `allowAllLive=true` and should remain exceptional.

## Seed Workflow Adjacency

Seed scripts support local setup, visual QA, map/listing testing, and verification. They are not part of production alert cadence.

Primary files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Commands from **Terminal 5: Scripts / curl testing** after `npm run worker:build`:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run run:seed:quick
npm run run:seed:test
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Rules:

- Seed scripts are explicit terminal-run tools.
- Do not run seed scripts from app startup, API routes, page rendering, or recurring production schedules.
- Do not treat local seed records as production authority content.
- Do not use seeded records as evidence for production saved-search alert strategy.
- Seed dry-runs are valid verification checks after alert, digest, CRM, Typesense-adjacent, or data-shape changes.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- No-index seed commands write database and photo rows without updating Typesense.
- Real MLS media remains the production source for live listing imagery.

## Typesense Adjacency

Alert eligibility and delivery remain Postgres-driven. Typesense repair is operationally relevant because alert and digest emails point users back into public search, market, neighborhood, and property pages.

Repair local Typesense from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** infrastructure is running:

```bash
npm run worker:build
npm run typesense:init
```

After `npm run supabase:check:json` reports readiness, repopulate search documents:

```bash
npm run supabase:check:json
npm run typesense:reindex
```

Current stale-collection warning includes:

- Missing required fields and facets.
- `price` type mismatch: expected `int32`, received `int64`.
- Default sort mismatch: expected `price`, received `updated_at`.

Expected warning shape:

```text
Neighborhood inventory lookup skipped because the local Typesense listings collection is stale: Typesense schema listings is invalid: ...
```

That warning means schema validation is working and the live local collection still needs repair. It should not block alert matching, but it does affect public search and market inventory accuracy until the collection is rebuilt and reindexed after `npm run supabase:check:json` reports readiness.

Search metadata check from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
npm run smoke:search
```

The search smoke response should include `meta.smoke.ready=true` and no `meta.smoke.blockers`, and timeout-bounded queue diagnostics should be acceptable before recurring email traffic, including recurring alert or digest sends.

Expected metadata should expose source, health, access level, filters, bounds state, duration, returned count, mapped count, coordinate-filtered count, and Typesense query/filter context when Typesense is active.

## Operational Commands

Build worker/script output from **Terminal 5: Scripts / curl testing** before running compiled scripts:

```bash
npm run worker:build
```

Inspect queue state from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run smoke:ops
```

Show alert CLI help from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
```

Preview queued alerts without sending from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts:dry
```

Send live alerts explicitly from **Terminal 5: Scripts / curl testing** after dry-run and internal live-send approval:

```bash
npm run run:alerts:live -- --limit 25
```

Process alerts once through dry-run worker path from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:worker:alerts:once
```

Process alerts once through live worker path from **Terminal 5: Scripts / curl testing** after approval:

```bash
npm run run:worker:alerts:once:live
```

Run alert worker continuously from **Terminal 3: Coordinator** after recurring email traffic readiness is verified:

```bash
npm run run:worker:alerts
```

Preview through protected API from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"
```

Inspect alert-related dead-letter jobs from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting,delayed,failed&limit=25"
```

Preview alert queue retry state from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=reie-alerts&dryRun=true&limit=10"
```

Live retry alert queue jobs only after the dry-run confirms the root cause is fixed:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=reie-alerts&execute=true&limit=10"
```

Inspect CRM command help from **Terminal 5: Scripts / curl testing**:

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

Terminal 5 CRM reports are read-only and should include `audit` and `readiness` objects matching the `/api/admin/crm-tasks` handoff contract. CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

Inspect CRM task APIs from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

## Rules

- Do not send email from page rendering.
- Do not send email during exploratory MLS ingestion unless delivery is being tested intentionally.
- Always dedupe with `AlertEvent`.
- Always respect `User.isUnsubscribed`.
- Keep alert payloads self-contained.
- Use dry-run mode before intentional live sends.
- Treat `failed` as requiring inspection, not silent discard.
- Keep tracked redirect destinations constrained.
- Keep unsubscribe idempotent.
- Do not use Typesense as the source of truth for alert eligibility.
- Keep alert, digest, and seed dry-runs read-only.
- Treat CRM `readiness.level=blocked` as a CRM handoff blocker until review-note coverage is restored.
- Keep seed scripts explicit, bounded, terminal-run, and out of production schedules.
- Inspect queue and dead-letter diagnostics before live retry.
- Inspect `npm run smoke:mls-status` search-index diagnostics, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics before enabling recurring email traffic, including recurring alert or digest sends. Public search should report `meta.smoke.ready=true` with no blockers, and queue diagnostics should be acceptable.
- Keep `/api/mls/status` command metadata stable for `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck`.
- Treat degraded search-index health, `meta.smoke.ready=false`, non-empty public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic because alert and digest clicks land back on search and property pages.

## Verification

Run after alert, email, digest, tracking, CRM, unsubscribe, seed, or Typesense-adjacent changes from **Terminal 5: Scripts / curl testing**:

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

Run functional help checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
node dist/workers/runCRMTasks.js --help
```

Run Supabase-backed dry-runs only after `npm run supabase:check:json` reports readiness:

```bash
npm run supabase:check:json
npm run run:alerts:dry
npm run run:worker:alerts:dry
npm run run:digest:dry -- --limit 25
```

Run API smoke checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Run equivalent raw curl checks:

```bash
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting,delayed,failed&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Use the `x-admin-key` header for the same smoke checks when an admin key is configured:

```bash
curl --max-time 20 -s -X POST -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

If any curl returns `HTTP_STATUS:000`, start or restart **Terminal 1: Next.js app** with:

```bash
npm run dev
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

## Current Known Gaps

- Supabase connectivity can block alert, digest, CRM, MLS, seed, and Typesense reindex dry-runs/reporting until `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md` is completed and `npm run supabase:check:json` reports readiness.
- Email domain authentication should be confirmed before production alert or digest sends.
- Production smoke verification still needs `npm run smoke:mls-status`, `npm run smoke:search`, timeout-bounded queue diagnostics, and one internal tracked email click before recurring scheduler activation or recurring email traffic.
- Saved-search alert frequency controls are not yet implemented.
- Digest grouping rules need final product decisions.
- CRM closure audit controls, note-backed completion/dismissal, CRM API Inspection metadata, and failed detail-route preservation are implemented locally; production admin smoke verification still needs to run after Terminal 1 is running and `npm run supabase:check:json` reports readiness.
- `sendAlertEmail.ts` and older email templates should be reviewed before production cleanup.
- Admin dead-letter inspection and timeout-bounded Terminal 5 queue diagnostics exist; live retry controls should remain separate until audit and confirmation flows are designed.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.
- Node `url.parse()` deprecation warnings still appear during `npm run build`.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/alert-architecture.md -->
