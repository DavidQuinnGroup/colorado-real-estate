# PROJECT ATLAS - Enterprise Capability Verification Wave 03C

## 1. Executive Summary

Wave 3C traced the post-click Prisma `P2022` from Wave 3B to schema drift in the connected `UserPreference` table.

The approved migration history and current Prisma schema both define `UserPreference.createdAt` and `UserPreference.updatedAt`. The connected database table is a legacy/partial shape: it has no `createdAt`, has nullable `updatedAt`, uses `double precision` for `avgBeds`, allows nullable `topCities`, has no id default, and uses a non-canonical foreign-key constraint name.

The smallest safe correction is a forward-only `UserPreference` schema-parity migration. The migration was prepared but not applied to the shared database because Wave 3C does not authorize production database mutation.

## 2. Baseline

- Branch: `main`.
- Baseline commit: `c300b03`.
- Working tree at preflight: clean.
- `.env.local`: ignored by `.gitignore:46`.
- Verification date: 2026-07-17.

## 3. P2022 Observation

Wave 3B successfully persisted one controlled tracked click, but the asynchronous `updateUserPreferences()` path logged Prisma `P2022`.

Observed error:

- Source: `lib/preferences/updateUserPreferences.ts`.
- Function: `updateUserPreferences(userId)`.
- Prisma call: `prisma.userPreference.upsert(...)`.
- Missing column: `UserPreference.createdAt`.

Tracking itself succeeded. The error affected post-click preference enrichment, not the `LISTING_CLICK`, `AlertQueue.clickedAt`, redirect, or heat-score mutation.

## 4. Runtime Path

Runtime flow:

1. `app/api/track-click/route.ts` validates user, listing, source, and destination.
2. The route writes `UserInteraction` with `type='LISTING_CLICK'`.
3. The route updates matching `AlertQueue.clickedAt`.
4. The route increments `User.heatScore` by 5.
5. The route calls `updateUserPreferences(userId).catch(...)` asynchronously.
6. `updateUserPreferences()` aggregates clicked alert payloads and upserts `UserPreference`.

The failure occurred at step 6.

## 5. Prisma Schema Evidence

Current Prisma model:

```prisma
model UserPreference {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  avgPrice  Int?
  avgBeds   Int?
  topCities String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Intended shape from Prisma:

- `id` text primary key with generated default.
- `userId` text unique, required.
- Foreign key to `User(id)` with cascade delete.
- `avgPrice` integer nullable.
- `avgBeds` integer nullable.
- `topCities` text array, required.
- `createdAt` timestamp, required, default now.
- `updatedAt` timestamp, required and application-updated by Prisma.

## 6. Migration Evidence

Approved migration `20260511102000_reie_mls_sync_intelligence` created `UserPreference` with:

- `id` text primary key.
- `userId` text required.
- `avgPrice` integer nullable.
- `avgBeds` integer nullable.
- `topCities` `TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]`.
- `createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- `updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- unique index on `userId`.
- foreign key to `User(id)` with cascade behavior.

The migration ledger contains one rolled-back row for this migration with database error `42830` on an unrelated `AlertEvent` foreign key, followed by a completed row with zero applied steps. This supports a drift/legacy-table condition rather than the current database being authoritative.

## 7. Database Evidence

Bounded read-only inspection of the connected database returned:

- Row count: 0.
- Columns present: `id`, `userId`, `avgPrice`, `avgBeds`, `topCities`, `updatedAt`.
- Missing column: `createdAt`.
- `avgBeds`: `double precision`, expected `integer`.
- `topCities`: nullable with no default, expected non-null `TEXT[]` with empty-array default.
- `updatedAt`: nullable with `now()` default, expected required timestamp.
- `id`: no database default, expected generated default in migration history.
- Unique index: `UserPreference_userId_key` present.
- Primary key: `UserPreference_pkey` present.
- Foreign key: present as `fk_user`, functionally valid but not canonical migration name.

No preference values or user-identifying data were printed.

## 8. Root Cause

Primary cause classification: `ENVIRONMENT_DATABASE_DRIFT`.

The connected database table does not match the approved migration or Prisma schema. The migration history shows prior failed/rolled-back activity around the canonical migration, and the live table has a legacy/partial shape.

## 9. Operational Impact

Operational-impact classification: `NONBLOCKING_DEGRADED_ENRICHMENT`.

The click path persisted tracking, `clickedAt`, and heat score. The failure degrades preference-learning enrichment and can affect downstream customer-intelligence and CRM context, but current evidence does not show a total platform launch blocker.

It remains a recurring alert activation watch item because recurring engagement analytics should not rely on a known schema mismatch.

## 10. Correction Selected

Selected correction: Path A - add/repair missing columns through a forward-only migration.

Reason:

- Migration history and Prisma agree that timestamps are canonical.
- The application behavior expects `UserPreference` writes to succeed.
- The connected database has zero rows, so the migration is low data-volume risk.
- Hiding or suppressing `P2022` would leave the schema inconsistent.

## 11. Files Changed

- `prisma/migrations/20260717133000_repair_user_preference_schema_parity/migration.sql`.
- `docs/project-atlas/executive-library/ENTERPRISE-CAPABILITY-VERIFICATION-WAVE-03C.md`.
- Project Atlas roll-up docs and JSON records as listed in the Wave 3C final report.

## 12. Migration Plan

Migration filename:

- `prisma/migrations/20260717133000_repair_user_preference_schema_parity/migration.sql`

SQL summary:

- Ensure `pgcrypto` exists for `gen_random_uuid()`.
- Set `UserPreference.id` default to `gen_random_uuid()::TEXT`.
- Add `createdAt` if missing.
- Backfill `createdAt` from existing `createdAt`, `updatedAt`, or `CURRENT_TIMESTAMP`.
- Set `createdAt` default and `NOT NULL`.
- Add `updatedAt` if missing.
- Backfill `updatedAt` from existing `updatedAt`, `createdAt`, or `CURRENT_TIMESTAMP`.
- Set `updatedAt` default and `NOT NULL`.
- Convert `avgBeds` to integer if the current type is not integer.
- Add/backfill/default `topCities` as non-null `TEXT[]`.
- Rename legacy `fk_user` constraint to `UserPreference_userId_fkey` when safe.
- Add canonical foreign key if missing.

Expected data behavior:

- Existing rows preserved.
- Existing null timestamps backfilled deterministically.
- Existing null `topCities` values backfilled to empty arrays.
- Existing fractional `avgBeds`, if any, rounded to integer to match application behavior.

Expected lock/impact:

- Current row count is 0, so expected duration category is brief.
- `ALTER TABLE` takes a table lock while applying. With zero rows, expected lock duration is brief, but it is still a production database mutation.

Rollback or compensating plan:

- Preferred rollback is a new forward migration after inspection.
- If the migration causes unexpected application behavior, first disable use of preference enrichment while preserving tracking.
- Destructive rollback such as dropping columns should not be run without explicit authorization and row-level backup review.

## 13. Validation Performed

Performed:

- Static trace of `updateUserPreferences`, Prisma model, migrations, docs, and call path.
- Bounded read-only database inspection of table columns, row count, indexes, constraints, and migration ledger.
- JSON validation for Project Atlas structured files.
- Static/build validation commands listed in the final response.

Not performed:

- Migration was not applied to the shared database.
- No isolated database migration apply was run because the repository has no configured local test database or migration-test harness.
- No live click revalidation was run after the migration because production application is not authorized.

## 14. Production Authorization Status

Production application required: yes.

Authorization status: not authorized in Wave 3C.

Apply only after explicit approval using the selected deployment procedure, either Prisma migration deployment or controlled Supabase SQL execution.

Preflight query:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'UserPreference'
ORDER BY ordinal_position;

SELECT COUNT(*)::int AS count
FROM "UserPreference";
```

Validation queries:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'UserPreference'
ORDER BY ordinal_position;

SELECT COUNT(*)::int AS count
FROM "UserPreference";

SELECT conname, contype, pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND t.relname = 'UserPreference'
ORDER BY conname;
```

Expected application behavior after migration:

- `updateUserPreferences()` upsert should no longer fail on missing `createdAt`.
- New preference rows should receive timestamp defaults.
- Repeated preference updates should continue updating preference fields through Prisma.

Risk level: low to medium.

## 15. Residual Risks

- Migration still needs explicit production/shared-database approval.
- The migration has not been applied to the connected database, so the runtime `P2022` remains until application.
- The May 11 migration history contains a prior rolled-back attempt; future schema work should continue to inspect ledger state before migration deployment.
- `updatedAt` behavior depends on Prisma writes after schema parity; database default handles insert fallback but Prisma owns `@updatedAt` updates.

## 16. Capability and Gap Impact

- `PROD-007 Notifications`: unchanged partial; click tracking is proven, but recurring operations remain gated.
- `INTEL-002 Customer Intelligence`: reduced risk but still partial until migration is applied and preference update is revalidated.
- `OPS-005 Reliability`: unchanged partial; this wave improves schema-readiness evidence but does not complete monitoring/readiness proof.
- `GAP-001`: not closed. Schema parity is prepared but not applied.
- Preference-refresh schema alignment: remains `WATCH_PENDING_AUTHORIZATION`.

## 17. Recommended Next Step

Approve controlled application of `20260717133000_repair_user_preference_schema_parity` to the shared database, then rerun a bounded non-email preference-update validation against the already-clicked controlled alert.

Do not proceed to DNS correction, CRM task mutation, recurring workers, schedulers, or alert backlog processing as part of this step.

## 18. Commands Not Run

- Production/shared database migration application.
- `prisma db push`.
- Database reset.
- Destructive rollback.
- Live queue processing.
- Recurring workers or schedulers.
- Email sends.
- CRM mutation.
- MLS Grid requests.
- OpenAI requests.
- TitlePro247 requests.
- Typesense reset or reindex.
- Additional tracked click or replacement email.
