# PROJECT ATLAS(tm)

## SellerLead Schema Reconciliation & Migration Repair

Status: `SELLER_LEAD_SCHEMA_RECONCILIATION_CERTIFIED_AND_CLOSED`

Authorization date: July 25, 2026

Repository baseline: `e24e655d003e93ca9a7b8c983340acb492d9bc8e`

---

## Executive Summary

This package implements the narrow SellerLead schema/migration repair required before GIO 1.0 Wave 3 can be truthfully deployed through Prisma migrations.

The repair preserves the production `SellerLead` UUID identity strategy:

- PostgreSQL `SellerLead.id` remains `uuid`.
- Default remains `gen_random_uuid()`.
- Prisma models `SellerLead.id` as `String @db.Uuid`.
- Existing SellerLead UUID values are preserved.
- No CUID/text conversion is introduced.
- No SellerLead business rows are rewritten.

The Recovery Gate was later satisfied by executive confirmation of a restorable Supabase production backup. The parity migration was truthfully resolved as applied through Prisma, and the SellerLead UUID corrective migration was deployed through `npx prisma migrate deploy`.

Post-deploy verification confirmed SellerLead row count and UUID identity hash were unchanged.

---

## Production Recovery Evidence

- Project: `davidquinn-leads`
- Project ID: `otmkoqvmhthitldlnjdk`
- Environment: Production
- Plan: Supabase Pro
- Scheduled Backups: Enabled
- Latest Verified Backup: `2026-07-25 09:49:14 UTC`
- Restore Capability: Verified
- PITR: Not enabled (optional add-on)
- Executive Determination: `RECOVERY_GATE_SATISFIED`

---

## Immutable Preflight

Branch:

- `main`

Starting HEAD:

- `e24e655d003e93ca9a7b8c983340acb492d9bc8e`

`origin/main`:

- `e24e655d003e93ca9a7b8c983340acb492d9bc8e`

Starting working tree:

- clean

Deployment status at baseline:

- GitHub/Vercel status: `success`
- Vercel status ID: `51084632132`
- Description: `Deployment has completed`

Prisma:

- `prisma`: `5.22.0`
- `@prisma/client`: `5.22.0`

Initial migration status:

- `20260722210000_repair_seller_lead_schema_parity` pending.
- `20260722211500_repair_seller_lead_id_type` pending only because an empty local directory existed.
- `20260725143000_gio_wave3_additive_persistence_foundation` pending.

---

## Production Read-Only Evidence

Production database target:

- PostgreSQL database `postgres`
- schema `public`
- host family `aws-0-us-west-2.pooler.supabase.com`
- direct port `5432`
- credentials were not printed

Production `_prisma_migrations`:

- No rows existed for the three pending migration names before this repair.

Production `SellerLead` evidence:

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

Production indexes:

- `SellerLead_pkey`
- `SellerLead_propertyId_idx`

Production counts before mutation:

- `SellerLead`: 1
- `Property`: 15,282
- `CRMTask`: 7
- `SellerLead.propertyId` nulls: 0
- `SellerLead.listingid` nulls: 1
- `propertyId` / `listingid` mismatches where both are non-null: 0
- `CRMTask` rows with missing SellerLead FK target: 0

Representative SellerLead UUID preserved:

- `5608cf96-5f28-4c91-8acc-2547aca93125`

Production GIO state before any mutation:

- GIO tables present: 0
- GIO enums present: 0

---

## Dependency Audit

Direct database dependency on `SellerLead.id`:

- `CRMTask.leadid -> SellerLead.id`
- `CRMTask.leadid` is `uuid`, nullable.
- Constraint: `CRMTask_leadid_fkey`
- Delete behavior: `ON DELETE CASCADE`
- Update behavior: `NO ACTION`

The cascade is from deleted SellerLead rows to dependent CRMTask rows. It does not allow CRMTask deletion to delete SellerLead rows.

Related pre-existing observations:

- `CRMTask.leadId` is a separate text column referencing `User.id`.
- `CRMTask.id` remains Prisma-modeled as `String @id @default(cuid())`, while production evidence shows UUID/default drift. This package did not change that separate identity because the authorization was bounded to SellerLead and its direct dependent FK.
- `email_replies.lead_id` is text and has no database FK to `SellerLead`.
- The webhook path references lowercase `seller_leads`, but no lowercase production `seller_leads` table was found. This is a pre-existing runtime concern outside this repair.
- No dependent views were found for `public."SellerLead"`.

---

## Empty Migration Directory Disposition

The local directory `prisma/migrations/20260722211500_repair_seller_lead_id_type` contained no `migration.sql`.

Historical checks found:

- No tracked entries for that directory in `HEAD`.
- No git history for a tracked `migration.sql` under that directory.
- No production `_prisma_migrations` row for the migration name.

Disposition:

- The empty untracked local directory was removed.
- No migration ledger row was created.
- No prior migration SQL was rewritten.
- The replacement repair is represented by a new corrective migration.

---

## Corrective Migration

Added migration:

- `prisma/migrations/20260725142500_seller_lead_uuid_schema_reconciliation/migration.sql`

Ordering:

- The timestamp intentionally sorts after seller-lead parity and before GIO Wave 3.

SQL behavior:

- Creates `pgcrypto` if needed for `gen_random_uuid()`.
- If `SellerLead.id` is already `uuid`, it sets the default to `gen_random_uuid()`.
- If `SellerLead.id` is `text`, it fails closed unless every existing non-null value is UUID-shaped, then converts using `id::uuid`.
- If `SellerLead.id` has any other type, it fails closed.
- If `CRMTask.leadid` is absent, it adds nullable `uuid`.
- If `CRMTask.leadid` is `text`, it fails closed unless every existing non-null value is UUID-shaped, then converts using `leadid::uuid`.
- If `CRMTask.leadid` has any other type, it fails closed.
- If the SellerLead FK is missing, it adds `CRMTask_leadid_fkey` with `ON DELETE CASCADE ON UPDATE NO ACTION`.
- It creates `CRMTask_leadid_idx` if absent.

Prohibited behavior absent:

- No SellerLead ID value rewrite.
- No SellerLead delete.
- No SellerLead truncate.
- No SellerLead table drop.
- No `SellerLead.id` drop.
- No GIO data insertion.

---

## Prisma Model Alignment

`SellerLead.id` now uses:

```prisma
String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
```

`CRMTask.leadid` is modeled as:

```prisma
sellerLeadId String? @map("leadid") @db.Uuid
sellerLead   SellerLead? @relation(fields: [sellerLeadId], references: [id], onDelete: Cascade)
```

This aligns the direct SellerLead FK path without changing CRM user ownership through `CRMTask.leadId`.

---

## Safety Automation

Added:

- `scripts/checkSellerLeadSchemaSafety.ts`
- `npm run check:seller-lead-schema-safety`

The check verifies:

- SellerLead uses the governed UUID strategy.
- CRMTask exposes the lowercase production `leadid` FK as UUID-compatible.
- The empty migration directory is absent.
- The repair migration fails closed on non-UUID text values.
- The repair migration does not rewrite SellerLead IDs or destroy SellerLead data.
- The parity migration still represents the intended propertyId/listingid repair.
- The GIO migration remains data-dormant.
- Runtime seller-lead files do not generate SellerLead IDs in application code.

---

## Production Mutation Decision

Production mutation result:

- Completed through governed Prisma commands after Recovery Gate satisfaction.

Commands executed:

- `npx prisma migrate resolve --applied 20260722210000_repair_seller_lead_schema_parity`
- `npx prisma migrate deploy`

Resolve result:

- `20260722210000_repair_seller_lead_schema_parity` marked as applied.
- Immediate status then showed only `20260725142500_seller_lead_uuid_schema_reconciliation` and `20260725143000_gio_wave3_additive_persistence_foundation` pending.

Deploy result:

- Applied `20260725142500_seller_lead_uuid_schema_reconciliation`.
- Applied `20260725143000_gio_wave3_additive_persistence_foundation`.
- Prisma reported all migrations successfully applied.

Commands intentionally not executed:

- `prisma db push`
- Manual `_prisma_migrations` edits
- Isolated/manual GIO SQL execution
- Any SellerLead business-data update
- Any GIO row insertion

---

## Validation Evidence

Local validation completed July 25, 2026:

- `npx prisma format` - passed.
- `npx prisma validate` - passed.
- `npm run check:seller-lead-schema-safety` - passed.
- `npx prisma generate` - passed.
- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm run check:geographic-intelligence-object-safety` - passed.
- `npm run check:seller-journey-safety` - passed.
- `npm run check:track-click-runtime-safety` - passed.
- `npm run check:search-runtime-safety` - passed.
- `npm run check:enterprise-intelligence-persistence-safety` - passed.
- `npm run check:repository-governance-adapter-safety` - passed.
- `npm run check:production-dependencies` - passed.
- `npm run check:prisma-client-parity` - passed.
- `npm run check:public-runtime-safety` - passed.
- `npm run check:fast` - passed; MLS dry run reported `dryRun=true`, `executed=false`, and "No MLS Grid request was made."
- `npm run build` - passed; Next.js 15.1.11 generated 141 static pages.

Notification readiness remained `watch` because 195 pending saved-search alert rows are available for dry-run review. No email was sent and no alert rows were mutated.

---

## Current Status

SellerLead repair state:

- Implemented.
- Deployed.
- Production-verified.
- Certified and closed.

Implementation commit:

- `670e6dbaeb3d1e048661e6f61ff192bc83c4c796`

Code/docs deployment:

- GitHub/Vercel commit status: `success`
- Vercel status ID: `51084926603`
- Description: `Deployment has completed`
- Target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/5Fgk5B3TNPQGVntwtEzy82QEqDRj`

Production smoke after deployment:

- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=https://davidquinngroup.com npm run smoke:public-experience` - passed.
- Representative property route: `/properties/32224-poudre-canyon-rd-bellvue-co-ire1363681`.
- No property inquiry, contact, Grand Plan, Save Search, email, CRM, MLS live request, Typesense reset/reindex, or database migration mutation was performed.

Production migration state:

- Complete.
- `npx prisma migrate status` reports `Database schema is up to date!`

Final SellerLead preservation evidence:

- SellerLead row count before deploy: 1.
- SellerLead row count after deploy: 1.
- SellerLead ID hash before deploy: `0b3f2a96dbf98c97fb8dfba37306d904`.
- SellerLead ID hash after deploy: `0b3f2a96dbf98c97fb8dfba37306d904`.
- Property row count before deploy: 15,282.
- Property row count after deploy: 15,282.
- Property ID hash before deploy: `ad9942b742ea52aaa663205ad5c4f64f`.
- Property ID hash after deploy: `ad9942b742ea52aaa663205ad5c4f64f`.

Final SellerLead schema evidence:

- `SellerLead.id`: `uuid`, not null, default `gen_random_uuid()`.
- `SellerLead.propertyId`: `text`, not null.
- `SellerLead.listingid`: `text`, nullable.
- `CRMTask.leadid`: `uuid`, nullable.
- `CRMTask_leadid_fkey`: `CRMTask.leadid -> SellerLead.id`, `ON DELETE CASCADE`, `ON UPDATE NO ACTION`.
- `CRMTask.leadId` user ownership remains separately present and unchanged.

GIO Wave 3 state:

- Deployed and verified as additive schema-only.
- GIO business record count remains zero across all seven GIO tables.

Closure:

- `SELLER_LEAD_SCHEMA_RECONCILIATION_CERTIFIED_AND_CLOSED`
