# REIE Additive sourceModifiedAt Schema And Ingestion Mapping Certification

Date: 2026-08-13

Program: `REIE_ADDITIVE_SOURCE_MODIFIED_AT_SCHEMA_AND_INGESTION_MAPPING`

Status: `SOURCE_MODIFIED_AT_SCHEMA_AND_INERT_MAPPING_PREPARED_MIGRATION_NOT_EXECUTED`

## Executive Result

REIE can safely add an additive nullable authoritative MLS source timestamp and map MLS Grid `ModificationTimestamp` into it without executing a production migration or MLS sync.

Implemented locally:

- `Property.sourceModifiedAt DateTime?`
- `@@index([sourceModifiedAt])`
- additive migration artifact
- source-freshness persistence decision helper
- inert MLS `upsertListing` mapping
- fixture validation for schema, migration, mapping, and freshness-window behavior
- inert alert intent type/fixture recognition of `sourceModifiedAt`

Not executed:

- migration
- MLS sync
- MLS refresh
- production data write
- alert creation
- email send
- worker/scheduler activation
- Typesense change
- deployment

## Prisma Schema Change

`Property` now includes:

- `sourceModifiedAt DateTime?`
- `@@index([sourceModifiedAt])`

Existing timestamp fields retain their meanings:

- `createdAt`: database insertion time
- `updatedAt`: database mutation time
- `lastIntelligenceSync`: REIE ingestion/runtime sync time

`sourceModifiedAt` is the internal authoritative MLS source-change timestamp.

## Migration Artifact

Migration artifact:

`prisma/migrations/20260813213000_add_property_source_modified_at/migration.sql`

SQL:

```sql
ALTER TABLE "Property" ADD COLUMN "sourceModifiedAt" TIMESTAMP(3);

CREATE INDEX "Property_sourceModifiedAt_idx" ON "Property"("sourceModifiedAt");
```

The migration is additive and nullable. Existing rows remain valid with `NULL`.

The migration was not executed.

## Index Decision

Index included.

Justification: the certified future `NEW_LISTING` predicate requires freshness-window filtering over `sourceModifiedAt` within the 72-hour eligibility window. The field is not added to Typesense because current public Search behavior does not need source-freshness filtering or ranking.

## MLS Ingestion Mapping

Updated mapping:

`lib/mls/upsertListing.ts`

The mapper now resolves `sourceModifiedAt` through:

`resolveMlsSourceModifiedAt(listing, existing?.sourceModifiedAt)`

Behavior:

- valid newer `ModificationTimestamp`: persist incoming value
- same timestamp: keep existing value
- older incoming timestamp: keep existing value
- missing timestamp: keep existing value on update, `NULL` on create
- malformed timestamp: keep existing value on update, `NULL` on create
- existing `NULL`: valid incoming timestamp may populate

No unrelated listing fields were altered.

## Historical Row Posture

Existing rows remain `sourceModifiedAt = NULL` until a separately authorized normal MLS sync, bounded backfill, or provider refresh populates them.

No historical timestamps were fabricated from `createdAt`, `updatedAt`, or `lastIntelligenceSync`.

## Alert Contract Integration

The inert alert intent property type and fixture now recognize `sourceModifiedAt`.

No production alert predicate was activated. No `AlertEvent`, `AlertQueue`, `EmailLog`, worker, scheduler, or email send path was invoked.

## Typesense / Search / API Boundary

No Typesense schema or indexing change was made.

No customer-facing API or public surface was changed to expose `sourceModifiedAt`.

The field remains an internal evidence/freshness primitive.

## Validation Results

Prisma:

- `npx prisma validate`: passed
- `npx prisma generate`: passed locally; no migration executed

TypeScript and checks:

- `npm run check:mls-source-freshness-contract`: passed
- `npm run check:saved-search-new-listing-semantics`: passed
- `npm run typecheck`: passed

Source-freshness check result:

- status: `SUCCESS`
- mode: `FIXTURE_ONLY_NO_SIDE_EFFECT`
- recommended persisted field: `sourceModifiedAt`
- primary payload field: `ModificationTimestamp`
- migration artifact verified
- window hours: `72`
- fresh timestamp: `PASS`
- exactly-at-window boundary: `PASS`
- stale timestamp: `PASS`
- missing timestamp: `PASS`
- malformed timestamp: `PASS`
- source timestamp newer than ingestion: `PASS`
- ingestion time newer than source timestamp: `PASS`
- duplicate/older incoming timestamp: `PASS`
- upsert valid newer timestamp mapping: `PASS`
- upsert missing timestamp with existing null: `PASS`
- upsert older timestamp preserves existing: `PASS`
- active/public candidate: `PASS`
- inactive candidate: `PASS`
- private candidate: `PASS`
- already-alerted candidate: `PASS`
- database reads: `0`
- database rows created: `0`
- database rows mutated: `0`
- queue jobs created: `0`
- provider calls: `0`
- emails sent: `0`
- workers activated: `0`
- migrations run: `0`

## Next MLS Sync / Backfill Readiness

Classification: `NATURAL_NEXT_MLS_SYNC_SUFFICIENT`

After this implementation is synchronized and the migration is separately executed, the next authorized normal MLS sync can populate `sourceModifiedAt` for incoming or changed listings. A bounded backfill is optional only if Executive HQ wants existing historical rows eligible before natural MLS deltas occur.

## MLS Refresh Authorization Requirement

To restore MLS freshness from the current June 20 state, a separate authorization must explicitly permit:

- production migration execution for `sourceModifiedAt`;
- Prisma client/runtime deployment if needed;
- bounded MLS sync or refresh with explicit page limits;
- post-sync read-only validation of `sourceModifiedAt`, `lastIntelligenceSync`, `MlsSyncState`, and active/public candidate counts;
- no alert send unless separately authorized.

## Protected Systems

No production migration was executed. No database rows were written. No MLS sync or refresh was run. No alerts were created. No email was sent. No worker or scheduler was activated. No Typesense, Vercel, LightBox, ATTOM, provider, CRM, customer data, or public API mutation occurred.

## Provider Status

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Next Authorization Gate

`READY_FOR_SOURCE_MODIFIED_AT_MIGRATION_EXECUTION_AND_BOUNDED_MLS_FRESHNESS_REFRESH_AUTHORIZATION`
