# REIE County Property Identity Schema Migration Certification

Date: 2026-08-22

Program: `REIE_COUNTY_PROPERTY_IDENTITY_SCHEMA_MIGRATION_AND_BOULDER_MAPPING_FOUNDATION_MVV`

Status: `REIE_COUNTY_PROPERTY_IDENTITY_SCHEMA_MIGRATION_CERTIFIED`

## Scope

This package creates an additive, empty, runtime-inert identity substrate for governed county property identifiers. It does not retrieve, ingest, map, or display county data.

## Models

- `PropertySourceIdentity`: canonical external identifier scoped by source, jurisdiction, type, and normalized textual value.
- `PropertySourceIdentityObservation`: append-only observation provenance and deterministic replay fingerprint.
- `PropertySourceIdentityRelationship`: directed, many-to-many external identity relationship with effective dates and deterministic replay fingerprint.
- `PropertyCountyIdentityMapping`: separate Atlas Property mapping with explicit status, confidence, basis, verification, conflict, and temporal posture.

`sourceId` is a Source Registry reference, not a database foreign key. Source Registry, Source Rights, and Source Quality retain their existing authorities.

## Boulder Foundation

Future Boulder adapters may map `strap` / `ACCOUNTNO` to `ASSESSOR_ACCOUNT`, `folio` / `PARCELNO` to `PARCEL`, and `Account_Parcels` to `ACCOUNT_TO_PARCEL`. Parcel values remain text and may contain letters. This package creates no Boulder rows.

## Safety

The migration adds enums, tables, indexes, check constraints, and restrictive foreign keys only. It does not alter existing `Property` columns, update existing rows, or create domain rows. The mapping check constraint prevents a `FUZZY_ADDRESS_CANDIDATE` from becoming `MATCHED`.

No owner, owner-mailing, customer, CRM, protected-class, demographic, targeting, or public-owner fields are introduced. No runtime reads, routes, Search, Map, MLS, IRES, county retrieval, source activation, backfill, or public activation is introduced.

## Target And Preflight

The established Supabase/Postgres production target passed the repository's non-secret readiness check and Prisma migration status check. The target migration history was current before this package, and the only pending migration after implementation was `20260822190000_add_county_property_identity_foundation`.

The established recovery posture records scheduled daily physical backups and verified restore capability. No backup, restore, credential, or configuration change was performed by this package.

Pre-migration aggregate verification:

- `Property` rows: `75,490`.
- New county identity tables: absent.
- No property, customer, or owner records were read.

## SQL Review And Execution

Reviewed migration:

`prisma/migrations/20260822190000_add_county_property_identity_foundation/migration.sql`

The reviewed SQL contains only `CREATE TYPE`, `CREATE TABLE`, `CREATE INDEX`, restrictive foreign-key, and safety check-constraint statements. It contains no `DROP`, `INSERT`, `UPDATE`, `DELETE`, or existing `Property` column alteration.

The first deployment attempt was rejected before completion because two long PostgreSQL index identifiers collided after identifier truncation. PostgreSQL rolled back the transaction; aggregate verification confirmed no county identity tables existed. The failed migration record was marked rolled back, index names were shortened in both Prisma and SQL, the SQL was re-reviewed, and the corrected migration applied successfully.

Post-migration verification:

- Prisma reports all `18` migrations applied and the database schema current.
- All four tables exist.
- All nine expected enums exist.
- Expected uniqueness, replay, mapping, and endpoint-safety constraints exist.
- `Property` rows remain `75,490`.
- `PropertySourceIdentity`: `0` rows.
- `PropertySourceIdentityObservation`: `0` rows.
- `PropertySourceIdentityRelationship`: `0` rows.
- `PropertyCountyIdentityMapping`: `0` rows.

## Validation

Passed:

- `npx prisma validate`
- `npx prisma generate`
- `npx prisma migrate status`
- `npm run check:county-property-identity-schema`
- property public-record architecture and Agent Property/Listing preparation checks
- Agent Buyer, Seller, Location, Market, login-return, and session-continuity checks
- Source Registry, Source Rights, Source Quality, and geographic provenance checks
- Public Trust, Public Runtime Safety, Admin Auth Safety, Prisma Client parity, and runtime source-import checks
- `npm run typecheck`
- `npm run build`
- `git diff --check`

The production build passed. It emitted only existing unrelated lint warnings in financial-decision, MLS, and Sundance modules.

## Certification Boundary

`REIE_COUNTY_PROPERTY_IDENTITY_SCHEMA_MIGRATION_CERTIFIED` means only that the empty schema substrate is present and validated. It does not authorize Boulder County source ingestion, property mapping, or customer/runtime use.
