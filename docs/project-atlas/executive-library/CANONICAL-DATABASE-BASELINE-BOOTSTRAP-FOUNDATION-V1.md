# Canonical Database Baseline Bootstrap Foundation V1

## Purpose

This local-only foundation creates a canonical, schema-only PostgreSQL starting point for a future fresh-environment bootstrap. It does not change production, add a forward migration, change Prisma models, or mutate business data.

## Artifact And Historical State

- Baseline artifact: `prisma/baseline/20260919_production_aligned_hybrid_v1/schema.sql`
- Artifact source: `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`, with `pgcrypto` declared first.
- Historical cutoff: `20260919000000_canonical_schema_reconciliation_v1`.
- The artifact is deliberately outside `prisma/migrations`. Bootstrap applies it to an empty local database and uses `prisma migrate resolve --applied` to record the immutable historical migration sequence. It never replays the historical parity-repair migration.
- Future migrations stay in the ordinary `prisma/migrations` chain. A temporary baseline-aware Prisma workspace is used to develop and certify a future migration without using the legacy history as its shadow-database replay source.

## Local Guardrails

The bootstrap command requires all of the following:

- `ATLAS_BASELINE_LOCAL_MODE=1`
- `ATLAS_BASELINE_RESET=1`
- An explicit `ATLAS_BASELINE_DATABASE_URL`; `DATABASE_URL` is never a fallback.
- `localhost` or `127.0.0.1`, port `55432`, and one of the allowlisted disposable database names.

The local certification obtains its short-lived credential from the existing local Docker PostgreSQL harness and never prints it. It verifies two independently reset fresh databases, valid fresh `LeadInteraction` foreign keys, historical migration-state resolution, a baseline-aware temporary `migrate dev`, identical `migrate deploy` execution on two paths, and post-migration convergence. The generated synthetic migration, temporary workspace, and all four allowlisted disposable databases are removed before the check completes.

## Governed Differences

The fresh baseline contains no business data and therefore creates valid `LeadInteraction` foreign keys. This is intentionally distinct from the production `NOT VALID` constraints, which await separately authorized historical-data validation. `City` and `Neighborhood` remain in the fresh baseline because they are canonical Prisma models, while their production absence remains a documented dormant historical distinction.

External public-schema ownership is not copied into this artifact. The authoritative inventory remains `lib/schema/canonicalSchemaOwnership.ts`: PROJECT ATLAS-owned external objects are deferred to their owning subsystem, legacy active tables remain legacy-owned, and `profiles` remains provider-auth adjacent. No PostGIS dependency is required; `pgcrypto` is required.

## Commands

```bash
ATLAS_BASELINE_LOCAL_MODE=1 ATLAS_BASELINE_RESET=1 \
ATLAS_BASELINE_DATABASE=atlas_canonical_baseline_run1 \
ATLAS_BASELINE_DATABASE_URL='postgresql://postgres:...@127.0.0.1:55432/atlas_canonical_baseline_run1?schema=public' \
npm run bootstrap:canonical-database-baseline:local

npm run check:canonical-database-baseline
ATLAS_BASELINE_LOCAL_MODE=1 ATLAS_BASELINE_RESET=1 npm run certify:canonical-database-baseline:local
```

The certification targets only the existing disposable local Docker harness. Running the bootstrap or certification against production, preview, remote, or an unallowlisted database is rejected.
