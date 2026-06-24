# Supabase Recovery Runbook

Date: June 19, 2026

Project: David Quinn Group Real Estate Intelligence Engine

Working path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Purpose

This runbook defines the operator path for restoring Supabase connectivity after `npm run supabase:check:json` reports a stale, missing, paused, or invalid Supabase project reference. Use `npm run supabase:check` as the human-readable companion check, then use `npm run smoke:ops` to confirm protected Master Control Panel policy, recent intake signal visibility, alert status, consolidated notification readiness, direct saved-search alert notification readiness, direct property-inquiry notification readiness, and aggregate launch readiness before production-facing volume increases.

The current local env set is internally consistent, and `npm run supabase:check:json` currently reports readiness. Keep this runbook as the recovery path if that gate regresses.

Historical failure signatures handled by this runbook:

```text
DNS lookup failed: ENOTFOUND otmkoqvmhthitldlnjdk.supabase.co
FATAL: (ENOTFOUND) tenant/user postgres.otmkoqvmhthitldlnjdk not found
```

Historical non-failure that helped isolate those failures:

```text
aws-0-us-west-2.pooler.supabase.com:6543 accepted a TCP connection
```

June 19, 2026 status:

- `npm run supabase:check:json` reports `readiness.level="ready"` with Supabase project DNS, Prisma database, and Supabase REST passing.
- Current preflight dashboard hint: `https://supabase.com/dashboard/project/otmkoqvmhthitldlnjdk`.
- Current launch blocker has moved to property-inquiry notification routing: `PROPERTY_INQUIRY_NOTIFY_TO` and `REIE_INTERNAL_EMAIL` are not configured locally, and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` must remain unset or false for launch.
- `npm run typesense:collections:check` passes for both canonical Typesense collections.
- `npm run run:queue-dashboard -- --failed --sample --limit=5 --timeout-ms=3000` should still be used before retry or live queue decisions.
- Supabase's public status page did not show a broad platform incident for June 1, 2026 during this check. Treat the failure as project status, project ref, credentials, connection-string, account, or local-network specific until the dashboard proves otherwise.

## Terminal 5 Failure Interpretation

When `npm run supabase:check:json`, or the human-readable `npm run supabase:check`, reports this combination:

```text
FAIL Supabase project DNS
PASS Supabase Postgres DNS
PASS Supabase Postgres TCP
FAIL Prisma database
FAIL Supabase REST
```

Interpret it as:

- The regional pooler host is reachable from this machine.
- The configured project API host is not resolving.
- The configured pooler tenant/user is not accepted.
- The next action is dashboard/env recovery, not queue retry, worker restart, reindex, seed, CRM, alert, or digest execution.

Open the dashboard URL printed by the preflight, then confirm whether the project exists and is active. If the dashboard does not show the project, switch to the active Supabase project and replace every Supabase env value listed below as a single matched set.

## What To Verify In Supabase

Open the Supabase dashboard and confirm:

1. The project ref is still `otmkoqvmhthitldlnjdk`.
2. The project is active, not paused, deleted, renamed, migrated, or transferred.
3. The REST API URL is reachable and matches `https://<project-ref>.supabase.co`.
4. The anon key and service role key come from the same active project.
5. The transaction pooler connection string uses the current project ref in the username.
6. The database password is current.
7. The pooler host, port, SSL mode, and pgbouncer settings match the current Supabase connection panel.

`npm run supabase:check:json` and `npm run supabase:check` print a non-secret Postgres URL fingerprint. Use it to confirm:

- `host` and `port` match the Supabase pooler panel.
- `database=postgres`.
- `usernamePattern=postgres.<project-ref>`.
- `projectRef` matches the active project.
- `pgbouncer=true`.
- `connection_limit=1` for local scripts.

## Local Env Values To Replace Together

When the active Supabase project is confirmed or replaced, update these values as one set:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Do not mix keys or database URLs from different Supabase projects.

Use the local template for the expected variable names:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/.env.example`

## Validation Sequence

Run from **Terminal 5: Scripts / curl testing**:

```bash
cd /Users/davidquinn/david-quinn-group/colorado-real-estate
npm run worker:build
npm run supabase:check:json
```

For the companion human-readable report:

```bash
npm run supabase:check
```

The JSON report includes `schemaVersion: 1`, `readiness.level`, `readiness.summary`, `readiness.nextAction`, `readiness.nextCommand`, and per-check `readiness.gates` for automation and scheduler gating.

The JSON readiness gate must report ready before database-backed dry-runs, Typesense reindexing, queue retry, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, large programmatic content batch publication, or live database work can be trusted.

Supabase readiness only proves database and REST connectivity. It does not override Master Control Panel policy, intake signal visibility, notification launch readiness, Search Smoke Readiness, or timeout-bounded queue diagnostics.

After `npm run supabase:check:json` reports readiness, continue:

```bash
npm run typesense:reindex
npm run check:launch-readiness
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:crm:scheduler
npm run run:alerts:dry -- --limit 50
npm run run:digest:dry -- --limit 50
```

When Terminal 1 is running, inspect protected control and intake APIs directly if `npm run smoke:ops` needs lower-level confirmation:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/control-state" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals/<signal-id-from-list-response>?kind=crm_task" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

## Pass Conditions

`npm run supabase:check:json` should report `readiness.level` as ready. The companion `npm run supabase:check` should report:

- Supabase placeholder values: pass.
- Supabase project ref consistency: pass.
- Supabase project DNS: pass.
- Supabase Postgres DNS: pass.
- Supabase Postgres TCP: pass.
- Prisma database: pass.
- Supabase REST: pass.

Then Typesense reindexing should complete without Supabase fetch errors.

Then `npm run smoke:ops` should confirm:

- `/api/mls/status` is reachable.
- `/api/search?limit=5` returns results with healthy search metadata.
- `/api/admin/control-state` returns the intended launch posture.
- `/api/admin/intake-signals?limit=6` returns recent strategy-intake or saved-search handoff visibility.
- Alert status is inspectable and bounded.
- Consolidated notification readiness is non-sending, mutates no rows, and summarizes saved-search alert, property-inquiry notification, and aggregate launch gates.
- Direct saved-search alert notification readiness is non-sending and exposes queue counts plus alert email configuration checks.
- Direct property-inquiry notification readiness is non-sending and exposes a visible recipient check.
- Aggregate launch readiness is non-sending, mutates no rows, and exposes the saved-search and property-inquiry notification gates.
- The public experience smoke passes.

## Keep Blocked Until

Keep these blocked until `npm run supabase:check:json` reports readiness:

- Typesense reindex from Supabase.
- MLS sync dry-run or live sync.
- Live MLS sync enqueue.
- Queue retry of database-connectivity failures.
- Alert dry-run or live send.
- Digest dry-run or live send.
- CRM scheduler reporting.
- Seed dry-runs that touch Supabase.
- Live seed writes.
- Live database work.
- Recurring scheduler activation.
- Recurring email traffic.
- Live-inventory claims.
- MLS-backed public expansion.
- Large programmatic content batch publication.

Keep these still blocked after Supabase readiness when Master Control Panel policy is paused/protected beyond the intended launch posture, intake signal handoff is hidden or unreviewed, notification launch readiness is blocked, property-inquiry recipient routing is missing, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true`, Search Smoke Readiness is degraded, search-index health is degraded, or timeout-bounded queue diagnostics are unacceptable:

- MLS-volume increases.
- Scheduler cadence increases.
- Recurring scheduler activation.
- Recurring email traffic, including recurring alert, digest, or property-inquiry notification sends.
- Live-inventory claims.
- MLS-backed public expansion.
- CRM-informed content planning.
- Large programmatic content batch publication.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md -->
