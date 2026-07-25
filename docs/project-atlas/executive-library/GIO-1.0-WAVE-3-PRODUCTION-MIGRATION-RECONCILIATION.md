# PROJECT ATLAS(tm)

## GIO 1.0 Wave 3 - Production Migration Reconciliation

Status: `GIO_1.0_WAVE_3_SCHEMA_MIGRATION_PENDING_BLOCKED`

Reconciliation date: July 25, 2026

Repository baseline: `3d99aa82117556a3a6535be351ab8f72acf90065`

---

## Executive Summary

Production migration reconciliation was authorized for three pending migrations:

1. `20260722210000_repair_seller_lead_schema_parity`
2. `20260722211500_repair_seller_lead_id_type`
3. `20260725143000_gio_wave3_additive_persistence_foundation`

The reconciliation stopped before production mutation. The GIO migration was not deployed.

Stop conditions were met:

- A current restorable Supabase backup could not be independently confirmed from available local tooling.
- `20260722211500_repair_seller_lead_id_type` exists locally as an empty migration directory with no `migration.sql`.
- Production `SellerLead` definitions differ materially from the Prisma model and from the implied intent of the empty id-type repair migration.
- Applying `npx prisma migrate deploy` would not be a truthful migration-history reconciliation because it would apply or attempt to apply unresolved seller-lead migration history before the GIO migration.

---

## Immutable Preflight

Branch:

- `main`

Starting HEAD:

- `3d99aa82117556a3a6535be351ab8f72acf90065`

`origin/main`:

- `3d99aa82117556a3a6535be351ab8f72acf90065`

Working tree before reconciliation documentation:

- clean

Production database target:

- PostgreSQL database `postgres`
- schema `public`
- host family `aws-0-us-west-2.pooler.supabase.com`
- direct port `5432`
- credentials were not printed

Prisma version:

- `prisma`: `5.22.0`
- `@prisma/client`: `5.22.0`

Deployment status at preflight:

- Commit `3d99aa82117556a3a6535be351ab8f72acf90065`
- GitHub/Vercel status: `success`
- Vercel status ID: `51084475226`
- Description: `Deployment has completed`
- Timestamp: `2026-07-25T16:38:35Z`

Initial migration status:

- `npx prisma migrate status` reported 14 local migration entries.
- Unapplied migrations:
  - `20260722210000_repair_seller_lead_schema_parity`
  - `20260722211500_repair_seller_lead_id_type`
  - `20260725143000_gio_wave3_additive_persistence_foundation`

Relevant `_prisma_migrations` records:

- No rows existed for the three pending migration names.

Backup/recovery status:

- Not confirmed.
- The Supabase CLI is not installed in this environment.
- Local environment exposes application Supabase keys, but no Supabase management access token suitable for backup verification.
- Because backup/recovery posture could not be confirmed, production mutation was not performed.

---

## Migration SQL Review

### `20260722210000_repair_seller_lead_schema_parity`

SQL contents:

- `ALTER TABLE "SellerLead" ADD COLUMN IF NOT EXISTS "propertyId" TEXT`
- `UPDATE "SellerLead" SET "propertyId" = COALESCE("propertyId", "listingid") WHERE "propertyId" IS NULL`
- `ALTER TABLE "SellerLead" ALTER COLUMN "propertyId" SET NOT NULL`
- `ALTER TABLE "SellerLead" ALTER COLUMN "listingid" DROP NOT NULL`
- `CREATE INDEX IF NOT EXISTS "SellerLead_propertyId_idx" ON "SellerLead"("propertyId")`

Intended end state:

- `SellerLead.propertyId` exists as `text` and is non-null.
- `SellerLead.listingid` is nullable.
- `SellerLead_propertyId_idx` exists.

Data transformation:

- Yes. The migration can update seller-lead business rows where `propertyId` is null.

Destructive statements:

- No drops.
- Nullability is loosened for `listingid`.
- Nullability is tightened for `propertyId`.

Rollback implications:

- Rolling back after the data transformation would require a governed business-data decision, not a blind schema rollback.

Rerun safety against apparent production state:

- The intended schema end state is already present.
- Current seller-lead evidence shows 1 row, 0 `propertyId` nulls, 1 `listingid` null, and the `SellerLead_propertyId_idx` index present.
- Resolving this migration as applied could be truthful only if backup/recovery were confirmed and the second seller-lead migration issue were separately resolved.

Disposition:

- `B - Resolve as Applied` is evidence-supported for this migration's schema end state, but no resolve command was executed because broader stop conditions remain.

### `20260722211500_repair_seller_lead_id_type`

SQL contents:

- No `migration.sql` file exists.
- The local directory is empty and is not represented by tracked files.

Intended end state:

- Indeterminate from migration SQL.
- The directory name implies seller-lead id-type repair.

Production evidence:

- `SellerLead.id` is `uuid NOT NULL DEFAULT gen_random_uuid()`.
- Current Prisma model declares `SellerLead.id String @id @default(cuid())`.
- Other production `SellerLead` definitions also differ from the Prisma model:
  - `city` is nullable in production but required in Prisma.
  - `price` is `numeric` in production but `Int?` in Prisma.
  - `reason` is nullable in production but required in Prisma.
  - production has legacy/additional columns including `listingid`, `dealscore`, `status`, `createdat`, `contactedAt`, `repliedAt`, `outreachCount`, `variant`, `contextKey`, and `strategy`.

Data transformation:

- Unknown because there is no SQL.

Destructive statements:

- Unknown because there is no SQL.

Rollback implications:

- Unknown.

Rerun safety against apparent production state:

- Cannot be evaluated because the migration has no SQL.

Disposition:

- `C - Stop for Repair Migration`

Rationale:

- Migration history cannot be truthfully reconciled from an empty migration directory.
- Production definitions differ materially from the Prisma model.
- A corrective migration or model-alignment decision is required before any migration deployment.

### `20260725143000_gio_wave3_additive_persistence_foundation`

SQL contents:

- Creates 17 GIO enum types.
- Creates seven GIO tables.
- Creates indexes and uniqueness constraints.
- Adds restrictive foreign keys.
- Adds `GeographicObservation_json_schema_boundary` check constraint.

Intended tables:

- `GeographicObject`
- `GeographicAlias`
- `GeographicRelationship`
- `GeographicSource`
- `GeographicObservation`
- `GeographicEligibility`
- `PropertyGeographicRelationship`

Destructive statements:

- None found.
- No `DROP TABLE`, `DROP COLUMN`, `DELETE`, `TRUNCATE`, `UPDATE`, or `INSERT`.

Business-data insertion:

- None.

Geometry/PostGIS:

- None.

Rerun safety against apparent production state:

- Production evidence shows GIO tables and GIO enums are absent.
- The migration remains additive and should be safe once earlier migration-history blockers are resolved and backup/recovery is confirmed.

Disposition:

- `C - Stop before applying`

Rationale:

- GIO migration itself remains acceptable, but Prisma migration deployment cannot proceed truthfully while earlier seller-lead migration history is unresolved.

---

## Production Schema Evidence

### SellerLead Table

Production `SellerLead` columns:

- `id`: `uuid`, not null, default `gen_random_uuid()`
- `listingid`: `text`, nullable
- `city`: `text`, nullable
- `price`: `numeric`, nullable
- `beds`: `integer`, nullable
- `dealscore`: `integer`, nullable
- `reason`: `text`, nullable
- `status`: `text`, nullable, default `'new'::text`
- `createdat`: `timestamp without time zone`, nullable, default `now()`
- `contactedAt`: `timestamp without time zone`, nullable
- `repliedAt`: `timestamp without time zone`, nullable
- `outreachCount`: `integer`, nullable, default `0`
- `variant`: `text`, nullable
- `contextKey`: `text`, nullable
- `strategy`: `text`, nullable
- `propertyId`: `text`, not null

Constraints:

- Primary key: `SellerLead_pkey` on `id`
- Not-null check constraints for `id` and `propertyId`
- No foreign-key constraints found for `SellerLead`

Indexes:

- `SellerLead_pkey`
- `SellerLead_propertyId_idx`

Business-row counts before any mutation:

- `SellerLead`: 1
- `Property`: 15,282
- `SellerLead.propertyId` nulls: 0
- `SellerLead.listingid` nulls: 1
- `propertyId` / `listingid` mismatches where both are non-null: 0

Dependent views:

- None found for `public."SellerLead"`.

### GIO Schema Absence

Before deployment:

- GIO tables found: none
- GIO enums found: none
- GIO business rows: none, because GIO tables are absent

---

## Commands Executed

Read-only or local commands:

- `git status --short --branch`
- `git rev-parse HEAD`
- `git rev-parse origin/main`
- `npx prisma --version`
- `npx prisma migrate status`
- `curl -s https://api.github.com/repos/DavidQuinnGroup/colorado-real-estate/commits/3d99aa82117556a3a6535be351ab8f72acf90065/status`
- local SQL file inspection with `sed`
- local migration directory inspection with `ls`, `find`, `git ls-tree`, and `rg`
- read-only production metadata queries through Prisma using the direct database endpoint

Commands intentionally not executed:

- `npx prisma migrate resolve --applied ...`
- `npx prisma migrate deploy`
- `prisma db push`
- any GIO data insert
- any seller-lead data mutation
- any customer form submission
- any email send
- any CRM mutation
- any MLS live request
- any Typesense reset or reindex

---

## Result

Migration deployment result:

- Not run.

Final migration status:

- Still pending/blocked.
- The three migrations remain unapplied in the local migration status view.

No unintended business-data changes:

- No production mutation commands were executed.
- No GIO data was inserted.
- No seller-lead business records were modified by this reconciliation.

---

## Wave 3 Closure Recommendation

Retain:

`GIO_1.0_WAVE_3_SCHEMA_MIGRATION_PENDING_BLOCKED`

Do not certify and close Wave 3 until:

- backup/recovery posture is confirmed;
- the empty `20260722211500_repair_seller_lead_id_type` migration-history issue is resolved;
- SellerLead Prisma/schema drift is governed;
- production migration history can be reconciled truthfully;
- `npx prisma migrate deploy` can run without applying unresolved or ambiguous prior migrations;
- post-deploy GIO schema presence is verified directly.

---

## Recommended Next Authorization

Authorize a narrow SellerLead production schema repair/reconciliation package before any GIO schema deployment.

That package should decide whether to:

- align Prisma to the existing production `SellerLead` UUID/legacy shape;
- create a new corrective migration for SellerLead id/type/schema parity;
- remove or replace the empty local migration directory through a governed repository change;
- mark `20260722210000_repair_seller_lead_schema_parity` applied only after backup/recovery is confirmed.

GIO Wave 4 remains unauthorized.

---

## SellerLead Repair Follow-Up

Follow-up package:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/SELLER-LEAD-SCHEMA-RECONCILIATION-AND-MIGRATION-REPAIR.md`

Result:

- The local SellerLead repair package was implemented.
- The empty untracked `20260722211500_repair_seller_lead_id_type` directory was removed after git-history and production-ledger checks found no tracked migration SQL or applied ledger row.
- A new corrective migration was added: `20260725142500_seller_lead_uuid_schema_reconciliation`.
- Prisma now models `SellerLead.id` as UUID with `gen_random_uuid()` and models the production `CRMTask.leadid` SellerLead FK as UUID-compatible.
- Production mutation was still not executed because backup/recovery could not be independently confirmed.

Updated pending migration order:

1. `20260722210000_repair_seller_lead_schema_parity`
2. `20260725142500_seller_lead_uuid_schema_reconciliation`
3. `20260725143000_gio_wave3_additive_persistence_foundation`

Retained stop condition:

- Do not run `npx prisma migrate resolve`, `npx prisma migrate deploy`, or any equivalent production mutation until current restorable Supabase backup/PITR posture and restore access are confirmed.
