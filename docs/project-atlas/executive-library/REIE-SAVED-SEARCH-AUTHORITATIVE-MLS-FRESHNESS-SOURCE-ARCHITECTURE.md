# REIE Saved Search Authoritative MLS Freshness Source Architecture

Date: 2026-08-13

Program: `REIE_SAVED_SEARCH_AUTHORITATIVE_MLS_FRESHNESS_SOURCE_ARCHITECTURE_AND_REMEDIATION_FEASIBILITY`

Status: `SOURCE_FRESHNESS_CONTRACT_IMPLEMENTED_LOCALLY_MIGRATION_AUTHORIZATION_REQUIRED`

## Executive Result

The narrowest safe path is an additive persisted `Property.sourceModifiedAt` timestamp sourced from MLS Grid `ModificationTimestamp`.

This timestamp must represent upstream MLS source-change time, not REIE ingestion time. It must not overload `createdAt`, `updatedAt`, or `lastIntelligenceSync`.

This workstream implemented only a repository-local pure contract and fixture check. It did not edit Prisma schema, run a migration, run MLS sync, mutate production data, activate workers, send email, call providers, change Typesense, or deploy.

## MLS Grid Timestamp Inventory

| Field | Classification | Repository evidence |
| --- | --- | --- |
| `ModificationTimestamp` | `SOURCE_CHANGE_TIMESTAMP` | Used by `fetchMLSGridListings()` as `$filter: ModificationTimestamp gt lastSync` and `$orderby: ModificationTimestamp asc`; used by `fetchMLSPage()` ordering; used by Typesense update fallback. |
| `ListingModificationTimestamp` | `SOURCE_CHANGE_TIMESTAMP` | Used by Typesense update fallback. |
| `MajorChangeTimestamp` | `SOURCE_CHANGE_TIMESTAMP` | Used by Typesense update fallback. |
| `PriceChangeTimestamp` | `SOURCE_CHANGE_TIMESTAMP` | Used by Typesense update fallback. |
| `ListingContractDate` | `LISTING_ORIGIN_TIMESTAMP` | Used by Typesense created/listed fallback. |
| `OnMarketDate` | `LISTING_ORIGIN_TIMESTAMP` | Used by Typesense created/listed fallback. |
| `OriginalEntryTimestamp` | `LISTING_ORIGIN_TIMESTAMP` | Used by Typesense created/listed fallback. |
| `StatusChangeTimestamp` | `STATUS_TIMESTAMP` | Used by Typesense update fallback; not equivalent to all-source modification. |
| `PhotosChangeTimestamp` | `UNKNOWN` | No current repository mapper, indexer, or fetch contract references it. |

## Current Persistence

`Property` currently persists:

- `createdAt`: database insertion time;
- `updatedAt`: database mutation time;
- `lastIntelligenceSync`: REIE ingestion/runtime sync time.

None is authoritative MLS source freshness.

`MlsSyncState` currently persists sync progress:

- `lastSync`
- `lastIntelligenceSync`
- `lastPage`
- `totalRecords`
- `isSyncing`

This is operational state, not per-property source freshness.

## Recommended Contract

Recommended field: `Property.sourceModifiedAt DateTime?`

Semantics:

- source: MLS Grid `ModificationTimestamp`;
- meaning: upstream source-change timestamp for this property row;
- nullable behavior: `null` means unavailable, malformed, not backfilled, or not yet refreshed through the new mapper;
- backfill behavior: existing rows remain compatible with `null`;
- ingestion mapping: parse `ModificationTimestamp`; persist only valid values;
- comparison behavior: never replace an existing `sourceModifiedAt` with a missing, malformed, or older incoming timestamp; same timestamp is no-op; newer timestamp persists;
- alert use: a candidate can satisfy source freshness only when `sourceModifiedAt` is non-null, valid, and within the configured freshness window;
- Search implication: no current public Search behavior requires this field;
- Typesense implication: not required for current Search ranking/filtering unless a future public UI needs source-freshness sorting/filtering.

Do not create redundant fields such as both `mlsModificationTimestamp` and `sourceModifiedAt` unless a later multi-source provider abstraction requires it.

## Ingestion Mapping

Narrow mapping point: `lib/mls/upsertListing.ts`, inside `buildPropertyRecordWithDiagnostics()`, immediately beside the existing MLS payload normalization and before `Property` create/update payload construction.

Behavior:

- timestamp present and valid: map to `sourceModifiedAt`;
- timestamp missing: keep existing value on update, create `null` on create;
- malformed timestamp: keep existing value on update, create `null` on create, emit diagnostics in a later implementation;
- older incoming timestamp: keep existing value;
- same incoming timestamp: no-op;
- newer incoming timestamp: persist incoming timestamp;
- duplicate ingestion: idempotent through same timestamp no-op;
- historical record: nullable compatible until refreshed or backfilled.

## Alert Eligibility Integration

The certified `NEW_LISTING` target becomes:

`sourceModifiedAt fresh within 72 hours` + `status Active` + `public` + `SavedSearch match` + `subscribed user` + `no prior user/property/type NEW_LISTING event` -> `FIRST_ALERTABLE_MATCH_FOR_USER`.

No production alert events were created in this workstream.

## Backfill / Existing Rows

Classification: `NATURAL_NEXT_SYNC_SUFFICIENT` for future rows after schema/mapping authorization; `BOUNDED_BACKFILL_REQUIRED` only if Executive HQ wants existing rows to become eligible without waiting for MLS Grid delta updates.

Existing raw source payload is not persisted in the current `Property` model, so historical rows cannot be source-backfilled from local `Property` alone. A backfill would require a separately authorized MLS Grid refresh/read or another authoritative stored source.

## MLS Sync Posture

Read-only snapshot on 2026-08-13T21:12:07.914Z:

- `MlsSyncState.lastSync`: `2026-06-20T01:06:03.000Z`
- `MlsSyncState.lastIntelligenceSync`: `2026-06-20T01:06:02.678Z`
- `MlsSyncState.lastPage`: `1`
- `MlsSyncState.totalRecords`: `850`
- `MlsSyncState.isSyncing`: `false`
- total `Property` rows: `15282`
- max `Property.createdAt`: `2026-06-20T01:02:05.616Z`
- max `Property.updatedAt`: `2026-06-20T01:06:02.112Z`
- max `Property.lastIntelligenceSync`: `2026-06-20T01:06:02.111Z`
- active/public listings: `1287`
- active/public within 72 hours by current `lastIntelligenceSync`: `0`

Root-cause classification: `CERTIFICATION_GATE`.

Evidence: scheduler documentation requires bounded dry-runs, readiness gates, and provider/scheduler rollout decisions before recurring MLS sync or live MLS volume increases. The current state is not a stale active lock (`isSyncing=false`) and no current evidence showed a runtime failure in this workstream.

## Schema / Migration Safety

Recommended future migration:

```sql
ALTER TABLE "Property" ADD COLUMN "sourceModifiedAt" TIMESTAMP(3);
CREATE INDEX "Property_sourceModifiedAt_idx" ON "Property"("sourceModifiedAt");
```

Safety:

- additive nullable field;
- no destructive migration;
- no existing-row incompatibility;
- rollback can drop index and column before any dependent runtime release;
- initial rows remain `null` until natural sync or bounded backfill;
- deterministic checks should pass before migration execution;
- Prisma client regeneration and deployment must be separately authorized with migration.

This workstream did not edit `prisma/schema.prisma` because doing so without authorized migration generation/execution would create an incomplete implementation boundary.

## Repository-Local Implementation

Implemented:

- `lib/mls/sourceFreshness.ts`
- `scripts/checkMlsSourceFreshnessContract.ts`
- `npm run check:mls-source-freshness-contract`
- `tsconfig.worker.json` compiler inclusion

The implementation is pure and inert:

- no Prisma schema use;
- no database read/write;
- no queue operation;
- no provider call;
- no email send;
- no worker/scheduler activation.

## Deterministic Test Results

Command:

`npm run check:mls-source-freshness-contract`

Result:

- status: `SUCCESS`
- mode: `FIXTURE_ONLY_NO_SIDE_EFFECT`
- recommended persisted field: `sourceModifiedAt`
- primary payload field: `ModificationTimestamp`
- window hours: `72`
- fresh `ModificationTimestamp`: `PASS`
- exactly-at-window boundary: `PASS`
- stale timestamp: `PASS`
- missing timestamp: `PASS`
- malformed timestamp: `PASS`
- source timestamp newer than ingestion time: `PASS`
- ingestion time newer than source timestamp: `PASS`
- duplicate ingest / older incoming timestamp: `PASS`
- active/public candidate: `PASS`
- inactive candidate: `PASS`
- private candidate: `PASS`
- already-alerted candidate: `PASS`
- database reads/writes: `0`
- queue jobs: `0`
- provider calls: `0`
- emails sent: `0`
- workers activated: `0`
- migrations run: `0`

## Internal Proof Readiness

Classification: `FRESHNESS_PERSISTENCE_THEN_NORMAL_SYNC_SUFFICIENT`

After an authorized additive migration, Prisma client generation, ingestion mapper update, and one authorized fresh MLS update, a truthful internal proof can use `sourceModifiedAt` to evaluate the certified 72-hour source-freshness window.

## Broad Activation Blockers

- no `savedSearchId` attribution in `AlertEvent` or `AlertQueue`;
- no cadence preference;
- no timezone policy;
- no quiet-hour policy;
- no per-search communication preference;
- broader unsubscribe attribution remains incomplete;
- changed-listing taxonomy beyond `NEW_LISTING` remains absent.

## Provider Status

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

No provider calls were made.

## Next Authorization Gate

`READY_FOR_REIE_ADDITIVE_SOURCE_MODIFIED_AT_SCHEMA_AND_INGESTION_MAPPING_AUTHORIZATION`
