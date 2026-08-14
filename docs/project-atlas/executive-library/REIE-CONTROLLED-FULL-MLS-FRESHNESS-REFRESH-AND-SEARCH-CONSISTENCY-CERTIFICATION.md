# REIE Controlled Full MLS Freshness Refresh And Search Consistency Certification

Date: 2026-08-14

Program: `REIE_CONTROLLED_FULL_MLS_FRESHNESS_REFRESH_AND_SEARCH_CONSISTENCY_CERTIFICATION`

Status: `GUARD_BOUNDED_FULL_REFRESH_EXECUTED_TYPESENSE_REINDEX_REQUIRED`

## Executive Result

PROJECT ATLAS executed the authorized controlled MLS Grid freshness refresh using the existing lower-level MLS page fetch, listing upsert, and sync-state helpers.

The run processed `50,000` MLS records with `0` record failures. It stopped at the configured `500` page guard, not at a natural empty terminal page.

The refresh populated `Property.sourceModifiedAt` from MLS Grid `ModificationTimestamp` for the processed corpus and materially increased current database inventory. No Typesense mutation, alert mutation, email send, worker activation, scheduler activation, provider work, deployment, or runtime code change occurred.

Production Search remains healthy, but `/api/search` is still served from Typesense with `found = 1,287`, while the refreshed database now has `11,762` active/public properties. Search is therefore healthy but stale relative to the refreshed database and requires a separately authorized Typesense reindex.

## Workstream 1 Synchronization

The existing local certification commit was synchronized before the full refresh:

`9119d8dde6cbb00a0c6fe66377e00526a9c64fb9`

Subject:

`Certify sourceModifiedAt migration refresh`

Post-sync canonical baseline before the full refresh:

- `HEAD = origin/main = 9119d8dde6cbb00a0c6fe66377e00526a9c64fb9`
- divergence: `0 behind / 0 ahead`
- working tree: clean
- no deployment occurred

## Pre-Refresh Snapshot

Snapshot time:

`2026-08-13T21:43:17.957Z`

Aggregate evidence:

- total `Property` rows: `15,287`
- active/public rows: `1,291`
- rows with `sourceModifiedAt`: `5`
- active/public rows with `sourceModifiedAt`: `4`
- active/public rows inside 24 hours: `4`
- active/public rows inside 48 hours: `4`
- active/public rows inside 72 hours: `4`
- active/public rows inside 7 days: `4`
- rows missing `sourceModifiedAt`: `15,282`
- min `sourceModifiedAt`: `2026-08-13T21:34:37.696Z`
- max `sourceModifiedAt`: `2026-08-13T21:35:37.429Z`
- `MlsSyncState.lastSync`: `2026-08-13T21:36:30.585Z`
- `MlsSyncState.lastIntelligenceSync`: `2026-08-13T21:36:30.585Z`
- `MlsSyncState.lastPage`: `1`
- `MlsSyncState.totalRecords`: `855`
- `MlsSyncState.isSyncing`: `false`
- `AlertEvent` rows: `273`
- `AlertQueue` rows: `283`
- `EmailLog` rows: `78`

Local Typesense admin endpoint from `.env.local` was unreachable at `localhost:8109`.

## Refresh Mechanism

The standard live MLS sync runner was not used because its `processListing` path can call Typesense indexing, photo processing, and saved-search alert generation.

The controlled refresh used existing lower-level repository modules only:

- `fetchMLSPage`
- `upsertListing`
- `markMlsSyncStarted`
- `markMlsSyncFinished`

Excluded paths:

- `processListing`
- `updateSearchIndex`
- `processPhotos`
- `matchAndNotify`
- `enqueueAlert`
- `sendEmail`

Execution options:

- start page: `0`
- page size: `100`
- include media: `false`
- timeout: `30,000 ms`
- max pages guard: `500`
- max failures: `25`
- max failure rate: `0.02`

## Refresh Execution Result

Execution window:

- started: `2026-08-13T21:44:27.798Z`
- completed: `2026-08-14T04:44:03.557Z`

Aggregate result:

- status: `STOPPED`
- stopped reason: `max_pages_guard`
- pages fetched: `500`
- empty terminal page: `null`
- listings fetched: `50,000`
- processed: `50,000`
- created: `49,386`
- updated: `614`
- unchanged: `0`
- skipped: `0`
- failed: `0`
- sourceModifiedAt populated in run: `50,000`
- sourceModifiedAt decisions:
  - `persist_incoming`: `49,999`
  - `no_change_same_timestamp`: `1`

Protected side-effect counters:

- alerts created by runner: `0`
- alert queue jobs created by runner: `0`
- email logs created by runner: `0`
- Typesense attempted by runner: `0`
- workers activated by runner: `0`

The runner exit code was non-zero because the configured page guard stopped the run while the feed was still returning full pages. The database sync-state was returned to `isSyncing = false`.

## Timestamp Lineage

Representative newly created row:

- source field: MLS Grid `ModificationTimestamp`
- incoming timestamp: `2026-08-13T21:43:37.439Z`
- prior `sourceModifiedAt`: `null`
- persisted `sourceModifiedAt`: `2026-08-13T21:43:37.439Z`
- decision: `persist_incoming`

Representative existing same-timestamp row:

- source field: MLS Grid `ModificationTimestamp`
- incoming timestamp: `2026-08-13T21:34:37.696Z`
- prior `sourceModifiedAt`: `2026-08-13T21:34:37.696Z`
- persisted `sourceModifiedAt`: `2026-08-13T21:34:37.696Z`
- decision: `no_change_same_timestamp`

## Post-Refresh Database State

Snapshot time:

`2026-08-14T04:46:45.328Z`

Aggregate evidence:

- total `Property` rows: `64,673`
- active/public rows: `11,762`
- rows with `sourceModifiedAt`: `50,000`
- active/public rows with `sourceModifiedAt`: `10,748`
- rows missing `sourceModifiedAt`: `14,673`
- active/public rows inside 24 hours: `1,910`
- active/public rows inside 48 hours: `3,989`
- active/public rows inside 72 hours: `5,562`
- active/public rows inside 7 days: `9,839`
- active/public rows inside 30 days: `10,748`
- min `sourceModifiedAt`: `2026-08-06T14:55:37.600Z`
- max `sourceModifiedAt`: `2026-08-13T21:43:37.439Z`

Status distribution:

- `Closed`: `45,705`
- `Active`: `11,763`
- `Sold`: `3,599`
- `Pending`: `1,917`
- `Expired`: `674`
- `Active Under Contract`: `414`
- `Withdrawn`: `311`
- `Coming Soon`: `290`

Visibility distribution:

- `isPrivateExclusive = false`: `64,672`
- `isPrivateExclusive = true`: `1`

## MLS Sync Health

Post-refresh `MlsSyncState`:

- `lastSync`: `2026-08-14T04:44:03.235Z`
- `lastIntelligenceSync`: `2026-08-14T04:44:03.235Z`
- `lastPage`: `500`
- `totalRecords`: `50,855`
- `isSyncing`: `false`

No stuck sync lock was observed.

## Saved Search Fresh-Candidate Result

Read-only aggregate:

- fresh active/public properties inside 72 hours: `5,562`
- active saved searches: `5`
- emailable users: `9`
- maximum saved-search/property candidate pairs before criteria-level matching and dedupe: `27,810`

No alert matching, queueing, email sending, unsubscribe mutation, or customer-data mutation was authorized or performed.

## Search And Typesense State

Production `/api/search?limit=5` after refresh:

- HTTP status: `200`
- health: `healthy`
- source: `typesense`
- found: `1,287`
- returned: `5`
- mapped: `5`
- access level: `public`
- Typesense collection reported by API metadata: `listings`

Production `/search` after refresh:

- HTTP status: `200`
- page title: `Guided Colorado Property Search | David Quinn Group`
- embedded initial search meta source: `database`
- embedded initial returned count: `250`
- embedded initial mapped count: `250`
- embedded initial health: `healthy`

Local Typesense admin endpoint:

- `http://localhost:8109/collections`
- HTTP status: `000`
- result: connection unavailable from the local environment

## DB Vs Typesense Consistency

The refreshed database active/public count is `11,762`.

Production Typesense-backed `/api/search` reports `found = 1,287`.

Classification:

`FULL_TYPESENSE_REINDEX_REQUIRED`

Proposed action:

Authorize a separately bounded full Typesense reindex from the refreshed database, followed by production Search API and rendered `/search` consistency certification. Do not release saved-search alerts until search consistency and a separate alert proof gate are both authorized.

## Alert And Email Side-Effect Confirmation

Pre-refresh counts:

- `AlertEvent`: `273`
- `AlertQueue`: `283`
- `EmailLog`: `78`

Post-refresh counts:

- `AlertEvent`: `273`
- `AlertQueue`: `283`
- `EmailLog`: `78`

Rows created since pre-refresh snapshot:

- `AlertEvent`: `0`
- `AlertQueue`: `0`
- `EmailLog`: `0`

No Resend call, email send, digest send, alert worker activation, scheduler activation, or queue release occurred.

## Protected-System Confirmation

No deployment occurred.

No runtime code was modified.

No Typesense mutation or reindex occurred.

No LightBox call, credential retrieval, application mutation, provider configuration mutation, or provider activation occurred.

No ATTOM investigation or provider call occurred.

No SavedSearch, User/customer, unsubscribe, CRM, schema, Vercel, MLS configuration, worker, scheduler, or email system mutation occurred beyond the authorized MLS Grid reads, normal `Property` creates/updates/upserts, `sourceModifiedAt` population, and `MlsSyncState` updates.

## Provider Status

LightBox:

- `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed by Project Atlas evaluation: `0`

ATTOM:

- `PENDING_PROVIDER_RESPONSE`

## Executive Recommendation

Authorize `FULL_TYPESENSE_REINDEX_AND_SEARCH_CONSISTENCY_CERTIFICATION` as the next gate.

Keep saved-search alerts protected until after Search consistency is restored and a separate fresh-candidate/alert proof gate is authorized.

## Next Authorization Gate

`READY_FOR_FULL_TYPESENSE_REINDEX_AND_SEARCH_CONSISTENCY_CERTIFICATION`
