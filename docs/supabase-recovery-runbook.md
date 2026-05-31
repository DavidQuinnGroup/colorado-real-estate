# Supabase Recovery Runbook

Date: May 31, 2026

Project: David Quinn Group Real Estate Intelligence Engine

Working path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Purpose

This runbook defines the operator path for restoring Supabase connectivity after `npm run supabase:check` reports a stale, missing, paused, or invalid Supabase project reference.

The current local env set is internally consistent, but it points at project ref `otmkoqvmhthitldlnjdk`, whose project API host does not resolve and whose Postgres tenant/user is not accepted by the pooler.

Current verified failures:

```text
DNS lookup failed: ENOTFOUND otmkoqvmhthitldlnjdk.supabase.co
FATAL: (ENOTFOUND) tenant/user postgres.otmkoqvmhthitldlnjdk not found
```

Current verified non-failure:

```text
aws-0-us-west-2.pooler.supabase.com:6543 accepted a TCP connection
```

## What To Verify In Supabase

Open the Supabase dashboard and confirm:

1. The project ref is still `otmkoqvmhthitldlnjdk`.
2. The project is active, not paused, deleted, renamed, migrated, or transferred.
3. The REST API URL is reachable and matches `https://<project-ref>.supabase.co`.
4. The anon key and service role key come from the same active project.
5. The transaction pooler connection string uses the current project ref in the username.
6. The database password is current.
7. The pooler host, port, SSL mode, and pgbouncer settings match the current Supabase connection panel.

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
npm run supabase:check
```

The preflight must pass before database-backed dry-runs can be trusted.

After `npm run supabase:check` passes, continue:

```bash
npm run typesense:reindex
npm run smoke:mls-status
npm run smoke:search
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:crm:scheduler
npm run run:alerts:dry -- --limit 50
npm run run:digest:dry -- --limit 50
```

## Pass Conditions

`npm run supabase:check` should report:

- Supabase placeholder values: pass.
- Supabase project ref consistency: pass.
- Supabase project DNS: pass.
- Supabase Postgres DNS: pass.
- Supabase Postgres TCP: pass.
- Prisma database: pass.
- Supabase REST: pass.

Then Typesense reindexing should complete without Supabase fetch errors.

## Keep Blocked Until

Keep these blocked until Supabase preflight passes:

- Typesense reindex from Supabase.
- MLS sync dry-run or live sync.
- Alert dry-run or live send.
- Digest dry-run or live send.
- CRM scheduler reporting.
- Seed dry-runs that touch Supabase.
- Recurring scheduler activation.
- Recurring email traffic.
- MLS-backed public expansion.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/supabase-recovery-runbook.md -->
