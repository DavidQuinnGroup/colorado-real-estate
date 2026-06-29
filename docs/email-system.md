# Email System

The email system delivers David Quinn Group property intelligence, saved-search alerts, digest summaries, valuation follow-ups, and future CRM communications. Email delivery must stay outside page rendering, respect unsubscribe state, track engagement safely, expose queue diagnostics, and produce enough database evidence to audit delivery.

Email and alert processing are Postgres-driven. Help commands do not require Resend credentials. Dry-run commands do not send through Resend, but Supabase-backed dry-runs still require database connectivity because user, alert, unsubscribe, and email-log state lives in Postgres. Use `npm run supabase:check:json` from **Terminal 5: Scripts / curl testing** as the non-secret readiness gate before alert or digest dry-runs.

Typesense does not control email eligibility or delivery. Local Typesense schema repair is still required so public search, market inventory, neighborhood pages, and property pages stay aligned with email-linked listing activity.

Recurring email traffic, including recurring alert, digest, or property-inquiry notification sends, should wait for `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL`, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` unset or false, `npm run check:launch-readiness`, `npm run supabase:check:json` readiness, healthy search-index diagnostics, Search Smoke Readiness, Master Control Panel policy, intake signal visibility, and timeout-bounded queue diagnostics. Email links drive users back into public search and property pages, so blocked aggregate launch readiness, missing property-inquiry recipient routing, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true`, failed Supabase readiness, `indexFailed > 0`, `meta.smoke.ready=false`, public search smoke blockers, stale public coordinates, missing indexed media, paused or protected control policy beyond the intended launch posture, hidden/unreviewed intake handoff issues, or unacceptable queue diagnostics are launch-readiness issues even when Postgres delivery eligibility is valid.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Terminal Map

| Terminal | Purpose | Email-related usage |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` and API route testing |
| Terminal 2 | MLS Page Worker | no direct email work |
| Terminal 3 | Coordinator | `npm run run:worker:mls` or live alert worker |
| Terminal 4 | Docker / Typesense | Redis queue and Typesense infrastructure |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, digest, alert, CRM help, seed dry-runs, smoke scripts, curl commands, and verification |

## Provider

Provider:

- Resend

Primary send module:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`

Required for live sends:

- `RESEND_API_KEY`

Optional sender controls:

- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO_EMAIL`

Required for live property-inquiry notifications:

- `PROPERTY_INQUIRY_NOTIFY_TO`
- Fallback: `REIE_INTERNAL_EMAIL`

Property-inquiry dry-run control:

- `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN`

`PROPERTY_INQUIRY_NOTIFY_TO` is the preferred internal recipient for high-priority property-inquiry notifications. `REIE_INTERNAL_EMAIL` is only the fallback. Keep `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` unset or false before relying on live property-inquiry delivery.

Default sender:

- `David Quinn Group <alerts@davidquinngroup.com>`

Public URL source for unsubscribe and tracking links:

- `NEXT_PUBLIC_SITE_URL`
- `PUBLIC_SITE_URL`
- fallback: `https://davidquinngroup.com`

## Primary Send Function

`sendEmail(to, listings, options)` sends one or more listing payloads as a branded David Quinn Group property intelligence email.

Supported options:

- `unsubscribeUrl`
- `userId`
- `source`

Current behavior:

- Initializes Resend lazily.
- Allows help commands and dry-run script paths to run without `RESEND_API_KEY`.
- Throws for a real send when `RESEND_API_KEY` is missing.
- Returns a non-send result for empty recipients or empty usable listing arrays.
- Normalizes listing text, numbers, URLs, image URLs, unsubscribe URLs, and tracking URLs.
- Escapes user/listing-provided values before rendering HTML.
- Renders both HTML and plain-text bodies.
- Renders listing images only when the payload includes a valid `http` or `https` image URL.
- Renders the unsubscribe footer only when `unsubscribeUrl` is provided.
- Routes listing image links and `View Intel` links through `/api/track-click` when `userId` and listing identity are available.
- Falls back to direct listing/search URLs when tracking context is not available.

Supported listing payload fields:

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
- `image`
- `url`
- `efficiencyScore`
- `resilienceScore`

Generated output note:

- Email, digest, alert, and CRM scripts run from generated `dist/` output after `npm run worker:build`.
- `dist/` may contain stale JavaScript for deleted source files until generated output is cleaned or regenerated.
- Source scans are authoritative unless a runtime command directly executes stale generated files.

## Alert Email Flow

Primary processor:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts`

Flow:

1. Pending `AlertQueue` row is selected.
2. User email and `User.isUnsubscribed` are checked.
3. Alert payload is validated as a usable listing payload.
4. Live processing claims the alert with `pending -> processing`.
5. `UnsubscribeToken` is created for the recipient.
6. `sendEmail()` sends through Resend with live unsubscribe URL, `userId`, and `source=email_alert`.
7. Listing image and `View Intel` links route through `/api/track-click`.
8. `AlertQueue.status` is updated to `sent`.
9. `EmailLog` row is created with type `PROPERTY_ALERT`.

Failure behavior:

- Failed sends set `AlertQueue.status = failed`.
- Missing email addresses set `AlertQueue.status = skipped`.
- Unsubscribed users set `AlertQueue.status = skipped`.
- Invalid payloads fail the alert instead of attempting a malformed send.
- Dry-run previews do not claim alerts, create unsubscribe tokens, send email, or update status.

## Alert Commands

Run these from **Terminal 5: Scripts / curl testing** unless noted otherwise.

Build worker and script output after TypeScript changes:

```bash
npm run worker:build
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
```

Show alert CLI help:

```bash
npm run run:alerts -- --help
```

Preview pending alerts without sending:

```bash
npm run run:alerts:dry
```

Check aggregate launch readiness before live alert, digest, or recurring email work:

```bash
npm run check:launch-readiness
```

This command does not send email or mutate queue rows. Treat `readiness.level="blocked"` as a live notification blocker until the reported gate is resolved.

Send live alerts explicitly after dry-run, aggregate launch-readiness clearance, and internal live-send approval:

```bash
npm run run:alerts:live -- --limit 25
```

Process pending alerts once through the dry-run worker path:

```bash
npm run run:worker:alerts:once
```

Process pending alerts once through the explicit live worker path after approval:

```bash
npm run run:worker:alerts:once:live
```

Run the live alert worker continuously from **Terminal 3: Coordinator** after recurring email traffic readiness is verified:

```bash
npm run run:worker:alerts
```

## Protected Alert API

`/api/process-alerts` is an operational API. In production it requires `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`.

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Local development can bypass the key only when neither admin key environment variable is configured.

Preview alert processing through the app API while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"
```

Production preview:

```bash
curl --max-time 20 -s -X POST -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/process-alerts?dryRun=true&limit=25"
```

## Digest Email Flow

Primary script:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts`

Flow:

1. Users with `isUnsubscribed = false` and pending alerts are selected.
2. Pending alert payloads are grouped by user.
3. Each payload is validated as a usable listing payload.
4. Malformed payloads are reported in dry-run and marked failed in live mode.
5. Live processing claims usable pending alerts with `pending -> processing`.
6. `UnsubscribeToken` is created for the recipient.
7. `sendEmail()` sends one grouped digest through Resend with `userId` and `source=email_digest`.
8. Listing image and `View Intel` links route through `/api/track-click`.
9. Claimed digest `AlertQueue` rows are updated to `sent`.
10. `EmailLog` row is created with type `PROPERTY_DIGEST`.

Dry-run behavior:

- Previews users, listing counts, malformed payload counts, and readiness.
- Does not create unsubscribe tokens.
- Does not send email.
- Does not claim alerts.
- Does not update alert status.
- Still reads Supabase tables and can fail if database connectivity is unavailable.

Digest commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
npm run run:digest -- --limit 25
```

## Production Scheduling

Production alert and digest scheduling follows:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`

Relevant rollout order:

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
| Alert processing dry-run | every 30 minutes during validation | `npm run run:alerts:dry -- --limit 50` |
| Alert processing live | every 30 minutes after approval | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |

Production scheduling rules:

- Do not enable all live schedules at once.
- Dry-run manually before first production live send.
- Verify `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL` is configured and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false before recurring email traffic, including recurring alert, digest, or property-inquiry notification scheduling.
- Verify `npm run supabase:check:json` reports readiness before recurring email traffic, including recurring alert, digest, or property-inquiry notification scheduling.
- Verify `npm run smoke:mls-status` reports non-degraded search-index health before recurring email traffic, including recurring alert, digest, or property-inquiry notification scheduling.
- Verify `npm run smoke:search` returns expected metadata: `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready=true`, and empty `meta.smoke.blockers`.
- Verify timeout-bounded queue diagnostics with `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` before recurring email traffic, including recurring alert, digest, or property-inquiry notification sends.
- Run `npm run smoke:ops` from Terminal 5 before recurring email traffic, including recurring alert, digest, or property-inquiry notification sends.
- Run `npm run check:launch-readiness` before live alert, digest, or recurring email traffic and treat `readiness.level="blocked"` as a live notification blocker.
- Confirm `npm run smoke:ops` verifies `/api/admin/control-state`, `/api/admin/intake-signals?limit=6`, alert status, consolidated notification readiness, direct saved-search alert notification readiness, direct property-inquiry notification readiness, and aggregate launch readiness before recurring email traffic.
- Confirm `/api/admin/control-state` returns a policy matching the intended email launch posture before recurring alert, digest, or property-inquiry notification sends.
- Confirm `/api/admin/intake-signals` shows whether recent saved-search interaction signals have already been promoted before recurring email traffic drives additional engagement into CRM handoff.
- Run internal live-send tests before recurring email traffic.
- Keep recurring email traffic, including recurring alert, digest, or property-inquiry notification sends, disabled until `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL` is configured, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false, `npm run check:launch-readiness` is not blocked, `npm run supabase:check:json` reports readiness, sender domain, unsubscribe, click tracking, internal live-send tests, search-index health, Search Smoke Readiness is verified with `meta.smoke.ready=true` and no blockers, Master Control Panel policy matches the intended launch posture, intake signal handoff is visible, and timeout-bounded queue diagnostics are acceptable.
- Scheduled CRM reporting should use `npm run run:crm:scheduler` so provider logs receive one machine-readable readiness payload.
- Scheduler output must be visible in provider logs.
- Failed scheduled jobs must surface through provider logs, queue state, timeout-bounded queue dashboard output, admin diagnostics, or dead-letter inspection.
- Seed scripts are not scheduled.

## Unsubscribe Flow

Endpoint:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/unsubscribe/route.ts`

Token model:

- `UnsubscribeToken.token`
- `UnsubscribeToken.userId`
- Optional `UnsubscribeToken.searchId`
- `UnsubscribeToken.usedAt`

Global unsubscribe behavior:

- Token without `searchId` sets `User.isUnsubscribed = true`.
- Sets `User.unsubscribedAt`.
- Records `UnsubscribeToken.usedAt`.

Saved-search unsubscribe behavior:

- Token with `searchId` sets `SavedSearch.isActive = false`.
- Records `UnsubscribeToken.usedAt`.

Response behavior:

- Returns branded HTML pages.
- Uses `Cache-Control: no-store, max-age=0`.
- Uses `robots` `noindex,nofollow`.
- Invalid, missing, or unknown tokens return user-facing HTML errors.

Rules:

- Unsubscribe must be idempotent.
- The route must not expose broad user data.
- Alert and digest processors must respect unsubscribe state before intentional live sends.

## Click Tracking

Current tracking endpoint:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/track-click/route.ts`

Tracked email link shape:

```text
/api/track-click?u=<userId>&l=<listingId>&src=<source>&to=<destinationUrl>
```

Current behavior:

- Normalizes `u`, `l`, `src`, and `to`.
- Sanitizes `src`.
- Accepts only safe `to` destinations.
- Rejects open-redirect destinations by falling back to `/search?selected=<listingId>`.
- Redirects even when tracking context is missing or tracking fails.
- Skips tracking for missing or unsubscribed users.
- Records `UserInteraction` when enough context exists.
- Updates matching `AlertQueue.clickedAt` for sent, pending, or processing alerts.
- Increments `User.heatScore`.
- Asynchronously triggers `updateUserPreferences(userId)`.

Allowed redirect hosts:

- Current request host.
- `davidquinngroup.com`.
- `www.davidquinngroup.com`.
- `localhost`.
- `127.0.0.1`.
- `::1`.

Tracking sources:

- `email_alert`
- `email_digest`
- fallback: `email` or `organic`

## CRM Engagement Path

Email engagement feeds CRM intelligence:

1. Email links route through `/api/track-click`.
2. Tracking records `UserInteraction`, `AlertQueue.clickedAt`, and `User.heatScore`.
3. `updateUserPreferences()` learns bounded buyer preferences from clicked alert payloads.
4. `getHotLeads()` ranks recent clicked leads by recency, heat score, and listing context.
5. `createTask()` can create a `PRE_DISCOVERY_BRIEF` CRM task.
6. Saved-search intake can create `strategy_intake` CRM tasks with alert-readiness metadata.
7. `/api/admin/control-state` reports Master Control Panel policy for automation, public exposure, map precision, private layer visibility, and warnings before recurring email traffic increases engagement volume.
8. `/api/admin/intake-signals` reports recent strategy-intake CRM tasks and saved-search interactions so email engagement handoff quality can be inspected before recurring sends.
9. `/api/admin/intake-signals/[id]` can read one intake signal and promote a saved-search interaction into a CRM task only through an explicit human-reviewed promotion action.
10. `/api/admin/crm-tasks` reports active, pending, reviewing, completed, dismissed, or all CRM task queues.
11. `/api/admin/crm-tasks` reports `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also report closure-audit counts for completed/dismissed tasks, reviewed closures, missing review notes, and closure review coverage.
12. `/api/admin/crm-tasks` reports a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
13. `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
14. `/api/admin/crm-tasks/[id]` requires a non-empty review note before a CRM task can be marked `completed` or `dismissed`.
15. `/admin` surfaces Master Control Panel state, recent intake signals, CRM task readiness gates, closure audit coverage, missing-note counts, active review, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, and note-backed Review, Complete, and Dismiss actions.
16. `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions, preserves failed detail-route inspection metadata when a request fails, and returns to `List Route` metadata after the active-task list refresh.
17. `run:crm` and `run:worker:crm` report bounded CRM task summaries with closure audit counts and CRM readiness gates.
18. `run:crm:scheduler` emits one scheduler-safe JSON payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Related files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/preferences/updateUserPreferences.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/control-state/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/intake-signals/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/intake-signals/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`

Rules:

- CRM task reporting can be automated.
- Master Control Panel policy and intake signal visibility must be inspected before recurring email traffic increases CRM handoff volume.
- Intake signal promotion must remain a human-reviewed CRM handoff action, not an automated email trigger.
- CRM task completion and dismissal must remain human-reviewed through the admin review flow.
- Completed and dismissed CRM tasks require review notes.
- CRM closure audit coverage should stay visible in `/admin` and `/api/admin/crm-tasks`.
- CRM `readiness.level=blocked` should pause CRM automation or scheduler cadence increases until closed tasks have review notes.
- Scheduled CRM reporting should use `npm run run:crm:scheduler`.

## Seed Workflow Adjacency

Seed scripts support local setup, visual QA, map/listing testing, and verification. They are not production email or alert strategy.

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
- Do not use seeded records as evidence for production saved-search alert or email strategy.
- Seed dry-runs are valid verification checks after email, alert, digest, CRM, Typesense-adjacent, or data-shape changes.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- No-index seed commands write database and photo rows without updating Typesense.
- Real MLS media remains the production source for live listing imagery.

## Templates And Legacy Files

Current live email path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`

Current live alert processor:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts`

Current live digest sender:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts`

Existing template files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/propertyAlert.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingAlert.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/listingDigest.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/templates/sellerOutreach.tsx`

Existing specialized sender:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendAlertEmail.ts`

Review these older template and sender files before production cleanup. The active alert and digest paths now use `sendEmail.ts`.

## Search Index And Typesense Adjacency

Email eligibility and delivery remain Postgres-driven. Search-index health and Typesense repair are still operationally relevant because email links point users back into public search, market, neighborhood, and property pages.

Search-index readiness checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Expected readiness signals:

- `/api/mls/status` exposes a `searchIndex` block with `attempted`, `succeeded`, `failed`, `unknown`, `health`, `diagnostics`, and `recent`.
- `/api/mls/status` exposes `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck` for admin and operator guidance.
- `npm run supabase:check:json` should report readiness and `searchIndex.failed` should be `0` before recurring email traffic, including recurring alert, digest, or property-inquiry notification sends.
- `/api/search?limit=5` exposes metadata for `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready`, and `meta.smoke.blockers`.
- `meta.health` should be `healthy` and `meta.smoke.ready` should be `true` unless a known bounded fallback is being intentionally tested.
- Returned listings should include usable coordinates and public-safe media before email campaigns drive traffic into the search experience.

Repair local Typesense from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** infrastructure is running:

```bash
npm run worker:build
npm run typesense:init
```

Reindex from **Terminal 5: Scripts / curl testing** after `npm run supabase:check:json` reports readiness:

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

That warning means schema validation is working and the live local collection needs repair if the warning returns. It should not block email eligibility, but it does affect public search and market inventory accuracy until the collection is rebuilt and reindexed after `npm run supabase:check:json` reports readiness.

## Production Requirements

Before live user email:

- Verify sender domain in Resend.
- Configure SPF, DKIM, and DMARC for the sending domain.
- Set `RESEND_API_KEY`.
- Set `RESEND_FROM_EMAIL`.
- Set `RESEND_REPLY_TO_EMAIL` if replies should route to a controlled inbox.
- Set `PROPERTY_INQUIRY_NOTIFY_TO` or `REIE_INTERNAL_EMAIL` for internal high-priority property-inquiry routing.
- Keep `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` unset or false for launch.
- Set `NEXT_PUBLIC_SITE_URL` or `PUBLIC_SITE_URL`.
- Confirm Supabase connectivity with `npm run supabase:check:json`.
- Run `npm run worker:build`.
- Run dry-run alert processing.
- Run dry-run digest processing.
- Confirm search-index diagnostics are healthy with `npm run smoke:mls-status`.
- Confirm Search Smoke Readiness shows healthy behavior with `npm run smoke:search`, including `meta.smoke.ready=true` and no blockers.
- Confirm Master Control Panel policy, intake signal visibility, alert status, consolidated notification readiness, direct saved-search alert notification readiness, direct property-inquiry notification readiness, and aggregate launch readiness with `npm run smoke:ops`.
- Confirm timeout-bounded queue diagnostics are acceptable with `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
- Send a controlled test to an internal address.
- Confirm unsubscribe links render and work.
- Confirm tracked listing links redirect correctly.
- Confirm `EmailLog`, `AlertQueue.status`, `AlertQueue.clickedAt`, `UserInteraction`, `UserPreference`, and `User.heatScore` behavior.
- Confirm scheduler logs, worker logs, Redis queue state, timeout-bounded queue dashboard output, Resend logs, and admin diagnostics are visible before enabling recurring email traffic.

## Safety Rules

- Do not send email from page rendering.
- Do not send email during MLS ingestion tests unless delivery is intentional.
- Use dry-run mode before intentional live sends.
- Live alert sends must use `run:alerts:live`, `run:worker:alerts:once:live`, continuous worker consumption, or an explicitly live protected API request.
- Respect `User.isUnsubscribed`.
- Treat failed sends as operational issues requiring inspection.
- Treat missing `PROPERTY_INQUIRY_NOTIFY_TO` with no `REIE_INTERNAL_EMAIL` fallback as a live notification blocker.
- Treat `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` as a live property-inquiry notification blocker.
- Keep email payloads self-contained.
- Escape user/listing-provided values before rendering HTML.
- Render plain text as well as HTML.
- Do not index unsubscribe URLs.
- Do not allow arbitrary external click-tracking redirects.
- Treat `npm run supabase:check:json` readiness as required for alert and digest dry-runs.
- Inspect queue and dead-letter diagnostics before live retry or recurring send enablement.
- Run `npm run check:launch-readiness` before live alert, digest, or recurring email traffic, use `npm run check:property-inquiry-notification:readiness` for the direct property-inquiry diagnostic, and treat missing property-inquiry recipient routing, enabled `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN`, or any other `readiness.level="blocked"` result as a live notification blocker.
- Use the readiness JSON `blockedBy` array when triaging blocked notification launch gates. Direct property-inquiry readiness, aggregate launch readiness, and consolidated notification readiness expose the exact blocker code, relevant environment variables, blocker detail, and next command without printing secret values.
- Treat failed `npm run supabase:check:json` readiness, degraded search-index health, degraded Search Smoke Readiness, public search smoke blockers, paused/protected Master Control Panel policy beyond the intended launch posture, hidden/unreviewed intake handoff issues, unacceptable timeout-bounded queue diagnostics, or blocked aggregate launch readiness as live-send blockers for recurring email traffic because email click traffic depends on those pages and CRM handoff must remain reviewable.
- Keep CRM task completion and dismissal human-reviewed through the admin review flow.
- Require review notes for CRM task completion and dismissal.
- Treat CRM `readiness.level=blocked` as an email engagement handoff blocker until review-note coverage is restored.
- Keep seed scripts explicit, bounded, terminal-run, and out of production schedules.

## Known Gaps

- Email templates need consolidation around the current `sendEmail.ts` path.
- Production sender domain authentication needs confirmation.
- Email frequency and digest grouping rules need final business review.
- Reply handling exists as an API route, but full CRM reply workflow needs validation.
- Visual QA for major email clients has not been completed.
- Live send testing should wait until `npm run check:launch-readiness` is not blocked, `npm run supabase:check:json` reports readiness, and Resend credentials are confirmed.
- Alert and digest dry-runs require `npm run supabase:check:json` readiness; current aggregate notification readiness is blocked only by missing property-inquiry recipient routing, inspectable through `npm run check:property-inquiry-notification:readiness`.
- Missing property-inquiry recipient routing now appears in readiness JSON as `blockedBy[].code="property_inquiry_recipient_missing"` with `envVars=["PROPERTY_INQUIRY_NOTIFY_TO","REIE_INTERNAL_EMAIL"]`; enabled property-inquiry dry-run mode appears as `blockedBy[].code="property_inquiry_dry_run_enabled"` with `envVars=["PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN"]`.
- June 29, 2026 12:03 MDT `npm run check:property-inquiry-notification:readiness`, `npm run check:notification-readiness`, `npm run check:launch-readiness`, `npm run check:notification-readiness:strict`, and `npm run check:notification-readiness:strict-contract` refreshed the non-sending, non-mutating notification readiness gates. Saved-search alert readiness remained `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification and aggregate launch readiness remained blocked by missing recipient routing; the strict gate failed closed as expected and the strict contract passed.
- June 29, 2026 12:05 MDT `npm run check:alert-notification-readiness` refreshed the direct saved-search alert gate, stayed non-sending and non-mutating, and remained `watch` with 197 pending / 0 failed / 0 processing rows. `RESEND_API_KEY` and `NEXT_PUBLIC_SITE_URL` passed; built-in sender fallback, missing `RESEND_REPLY_TO_EMAIL`, and pending-row dry-run review remained warnings.
- June 29, 2026 12:07 MDT `npm run run:alerts:dry -- --limit 50` stayed non-sending, previewed 50 ready-to-send saved-search alert rows, sent 0, skipped 0, failed 0, and returned `success=true`.
- June 29, 2026 12:10 MDT `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` completed queue inspection cleanly. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` was `busy` with 273 waiting, 0 active, 0 failed, and no open dead-letter jobs.
- June 29, 2026 12:12 MDT `npm run supabase:check:json` reported `readiness.level="ready"` with all Supabase URL/key shape, project-ref consistency, DNS, TCP, Prisma, and REST checks passing. The suggested Typesense reindex next command was not run because reindexing remains out of scope unless explicitly requested.
- June 29, 2026 13:00 MDT `npm run smoke:mls-status` and `npm run smoke:search` passed against a temporary local Next dev server. MLS status remained `watch` because inventory freshness is 100% stale by `lastIntelligenceSync`, but search-index health was `healthy` with 750 attempted / 750 succeeded / 0 failed recent index updates; public search returned 5 Typesense-backed mapped results with `meta.smoke.ready=true` and no blockers. The temporary server was stopped after the checks.
- June 29, 2026 13:06 MDT `npm run smoke:ops` passed against a temporary local Next dev server. Public-experience smoke, admin/control/intake/CRM/dead-letter/retry/alert inspection metadata, public search, and notification readiness checks passed structurally; MLS status stayed `busy` / `watch` with healthy search-index health and busy media diagnostics; alert status stayed `caution` with 197 pending / 0 failed rows; aggregate notification readiness stayed `blocked` because property-inquiry recipient routing is missing. The temporary server was stopped after the check.
- June 29, 2026 13:10 MDT a masked env-presence check and `npm run check:property-inquiry-notification:readiness` reconfirmed the direct property-inquiry notification gate is non-sending, non-mutating, and blocked only by missing recipient routing. `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL` were unset; `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` was unset; `RESEND_API_KEY`, sender resolution, site URL, and dry-run-disabled checks passed; missing `RESEND_REPLY_TO_EMAIL` remained a warning.
- June 29, 2026 13:15 MDT `npm run check:notification-readiness` rebuilt worker output and completed successfully as a non-sending, non-mutating summary. Saved-search alert notification readiness remained `watch` with 197 pending rows and sender/reply-to/pending-row warnings; property-inquiry notification and aggregate launch notification readiness remained `blocked` with `property_inquiry_recipient_missing` for `PROPERTY_INQUIRY_NOTIFY_TO` / `REIE_INTERNAL_EMAIL`.
- June 29, 2026 13:19 MDT `npm run check:notification-readiness:strict` rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with `strictMode=true`, `commandSuccess=true`, `success=false`, and readiness `blocked`. Saved-search alert notification stayed `watch`; property-inquiry and aggregate launch notification readiness stayed blocked by `property_inquiry_recipient_missing`.
- June 29, 2026 13:54 MDT `npm run check:notification-readiness:strict-contract` rebuilt worker output, sent no email, mutated no rows, and passed. It confirmed the current environment fails closed with readiness `blocked`, the dummy-recipient plus property-inquiry dry-run environment also fails closed, both direct property-inquiry and aggregate dry-run blockers are detected, and the aggregate launch-readiness reply-to warning remains aligned.
- June 29, 2026 14:03 MDT `npm run check:launch-readiness` rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with readiness `blocked`. Supabase connectivity was `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- June 29, 2026 14:11 MDT `npm run check:alert-notification-readiness` rebuilt worker output, sent no email, mutated no rows, and kept saved-search alert notification readiness at `watch`. Queue state stayed 197 pending / 0 failed / 0 processing rows; sampled recipients were unsubscribed=false; `RESEND_API_KEY` and `NEXT_PUBLIC_SITE_URL` passed; built-in sender fallback, missing `RESEND_REPLY_TO_EMAIL`, and pending-row dry-run review remained warnings.
- June 29, 2026 14:15 MDT `npm run run:alerts:dry -- --limit 50` stayed in dry-run preview mode, scanned 50 pending saved-search alert rows, previewed 50 ready-to-send rows, sent 0, skipped 0, failed 0, and returned `success=true`. No live alert send was run.
- June 29, 2026 14:26 MDT `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` completed queue inspection cleanly. Diagnostics were empty; failed jobs, open dead-letter jobs, and stale active jobs were all clear; MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained `busy` with 273 waiting / 0 active / 0 failed jobs. No worker, retry, or live alert processing was run.
- `PROPERTY_INQUIRY_NOTIFY_TO` is still missing and fallback `REIE_INTERNAL_EMAIL` is unset. Do not approve live property-inquiry notification delivery, recurring alert sends, digest sends, or recurring email traffic until recipient routing is configured and strict/aggregate readiness clears.
- `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` must remain unset or false for launch; an enabled dry-run flag is treated as a live property-inquiry notification blocker even when a recipient is configured.
- Timeout-bounded queue diagnostics exist through Terminal 5, but broader admin queue controls are still pending.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` and refreshed with `npm run typesense:reindex` on June 16, 2026.
- Local recurring email traffic readiness smoke has been refreshed with `npm run check:alert-notification-readiness`, `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:notification-readiness:strict-contract`, `npm run check:launch-readiness`, `npm run supabase:check:json`, `npm run smoke:mls-status`, `npm run smoke:search`, `npm run smoke:ops`, `npm run check:fast`, timeout-bounded queue diagnostics, Master Control Panel policy review, intake signal visibility, alert dry-runs, CRM readiness checks, lint, and build; production still needs one internal tracked email click before recurring scheduler activation.
- `npm run build` may show Node `url.parse()` deprecation warnings.

## Verification

Run after email, alert, digest, tracking, CRM, unsubscribe, seed, or Typesense-adjacent changes from **Terminal 5: Scripts / curl testing**:

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

Run functional checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
node dist/scripts/sendDigest.js --help
npm run run:crm -- --help
npm run run:crm:active
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
```

Terminal 5 CRM reports are read-only and should include `audit` and `readiness` objects matching the `/api/admin/crm-tasks` email engagement handoff contract. CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus either `task` or `tasks` on successful reads. Master Control Panel API responses should include `success`, `state`, `policy`, `source`, and `auth`. Intake signal API responses should include `success`, `signals` or `signal`, `summary` for list responses, and `auth`. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

Run admin handoff API checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/control-state" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals/<signal-id-from-list-response>?kind=crm_task" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Run Supabase-backed dry-run checks only after the Supabase JSON readiness gate passes:

```bash
npm run supabase:check:json
npm run check:launch-readiness
npm run run:digest:dry -- --limit 1
npm run run:alerts:dry
npm run run:worker:alerts:dry
```

Run API smoke checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Run equivalent raw curl checks:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting,delayed,failed&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/control-state" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Use the `x-admin-key` header for the same smoke checks when an admin key is configured:

```bash
curl --max-time 20 -s -X POST -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

For a live send test, only use a known internal recipient and confirm `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO_EMAIL`, public site URL, `npm run supabase:check:json`, Search Smoke Readiness, and timeout-bounded queue diagnostics first.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/email-system.md -->
