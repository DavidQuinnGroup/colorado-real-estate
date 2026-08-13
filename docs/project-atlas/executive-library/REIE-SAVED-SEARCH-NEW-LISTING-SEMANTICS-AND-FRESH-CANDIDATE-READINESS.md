# REIE Saved Search NEW_LISTING Semantics And Fresh-Candidate Readiness

Date: 2026-08-13

Program: `REIE_SAVED_SEARCH_NEW_LISTING_SEMANTICS_AND_FRESH_CANDIDATE_READINESS`

Status: `NEW_LISTING_SEMANTICS_CERTIFIED_NO_CURRENT_FRESH_CANDIDATE`

## Executive Result

The existing `NEW_LISTING` production queue path currently means:

- a `Property` is being processed through MLS ingestion;
- the property has an `id` and `city`;
- at least one active saved search in the same city belongs to a globally subscribed user;
- the property matches the saved-search city, minimum price, beds, optional type, and optional bounds criteria;
- no prior `AlertEvent(userId, propertyId, type = NEW_LISTING)` exists.

It does not currently prove:

- newly listed by MLS listing date;
- newly active by MLS status transition;
- newly created in REIE;
- first time the listing became public/search-eligible;
- first time a specific saved search matched;
- authoritative source freshness.

The narrow defensible target contract for future proofing is:

`NEW_LISTING` should mean `FIRST_ALERTABLE_MATCH_FOR_USER` over a public active listing that has a fresh authoritative source timestamp, matches a subscribed active saved search, and has no prior `AlertEvent(userId, propertyId, type = NEW_LISTING)`.

Customer-visible copy should prefer saved-search-match language unless authoritative source freshness is proven. Current active alert digest copy does not say "new listing", "newly listed", "just listed", or "new match"; it uses factual property-intelligence update language.

## Semantics Distinctions

| Candidate semantic | Current support |
| --- | --- |
| `NEW_TO_REIE` | Not reliably supported. `createdAt` is repository insertion time, not MLS source newness. |
| `NEWLY_ACTIVE` | Not supported. No persisted status transition timestamp is available on `Property`. |
| `NEWLY_LISTED_BY_MLS_DATE` | Not supported in persisted `Property`; MLS list-date fields are not stored. |
| `NEWLY_MATCHING_A_SAVED_SEARCH` | Partially supported only through current matching at processing time; no saved-search attribution is stored. |
| `FIRST_ALERTABLE_MATCH_FOR_USER` | Supported at user/property/type dedupe level through `AlertEvent` uniqueness. |

## Freshness Source-Of-Truth Findings

| Field/source | Classification | Finding |
| --- | --- | --- |
| MLS Grid `ModificationTimestamp` | `AUTHORITATIVE_FOR_SOURCE_CHANGE_WINDOW` | Used by the MLS fetch request filter and ordering, but not persisted to `Property`. |
| MLS list date / on-market date / status-change timestamp | `UNKNOWN` | Potentially authoritative, but not currently persisted or certified in the `Property` model. |
| `Property.lastIntelligenceSync` | `USEFUL_BUT_NOT_AUTHORITATIVE` | Set from ingestion runtime `syncedAt`; useful as REIE processing recency, not MLS newness. |
| `Property.createdAt` | `NOT_RELIABLE_FOR_NEWNESS` | Database insertion time only. |
| `Property.updatedAt` | `NOT_RELIABLE_FOR_NEWNESS` | Database mutation time only. |
| Current runtime time | `NOT_RELIABLE_FOR_NEWNESS` | Cannot substitute for source timestamp. |

## Read-Only Data Evidence

Read-only Prisma inspection on 2026-08-13T20:58:56.337Z found:

- `MlsSyncState.lastSync`: `2026-06-20T01:06:03.000Z`
- `MlsSyncState.lastIntelligenceSync`: `2026-06-20T01:06:02.678Z`
- `MlsSyncState.totalRecords`: `850`
- `MlsSyncState.isSyncing`: `false`
- total `Property` rows: `15282`
- active public listings: `1287`
- active private listings: `1`
- active/public missing `lastIntelligenceSync`: `3`
- active/public `lastIntelligenceSync` within 1 day: `0`
- active/public `lastIntelligenceSync` within 2 days: `0`
- active/public `lastIntelligenceSync` within 3 days: `0`
- active/public `lastIntelligenceSync` within 7 days: `0`
- active/public `lastIntelligenceSync` within 30 days: `0`
- active/public `createdAt` within 30 days: `0`
- active/public `updatedAt` within 30 days: `0`
- max `Property.createdAt`: `2026-06-20T01:02:05.616Z`
- max `Property.updatedAt`: `2026-06-20T01:06:02.112Z`
- max `Property.lastIntelligenceSync`: `2026-06-20T01:06:02.111Z`

The prior 1,000-row staleness finding is explained by current repository/database state: active/public data has not been refreshed recently, and `lastIntelligenceSync` is an ingestion timestamp rather than an authoritative listing-newness timestamp. Historical and non-active rows dominate the broader property table, and even the active/public subset has zero 30-day fresh rows under the available timestamp.

## Proposed Freshness Window

Initial future proof window: `72 hours`.

Rationale:

- `24 hours` is strongest for customer-facing "new" claims but brittle if MLS ingestion cadence is not continuously active.
- `48 hours` is plausible but still fragile while scheduler/worker activation remains unauthorized.
- `72 hours` is the narrowest practical proof window that can tolerate bounded ingestion delay while still avoiding stale "new listing" claims.
- `7 days` is too broad for a first proof unless copy is strictly "saved-search match" and not "new listing".

The proof must use an authoritative persisted source timestamp, not current runtime time.

## Saved Search Intersection

SavedSearch read-only posture:

- active subscribed saved searches: `5`
- malformed rows observed in prior certification: `0`
- globally unsubscribed users: `0`
- current candidate query using active/public + `lastIntelligenceSync <= 7 days` produced `0` candidate properties, `0` saved-search match pairs, and `0` undeduped pairs.

No current genuinely fresh, eligible, non-customer-sensitive production candidate exists for a future one-send proof.

## Attribution Result

Classification: `SAFE_FOR_ONE_BOUNDED_INTERNAL_PROOF`

Reason: a one-row internal proof can manually bind one saved search and one candidate at execution time, with before/after inspection and a single explicit recipient. This does not make broad activation safe.

Broad activation remains blocked because `AlertEvent` and `AlertQueue` do not store `savedSearchId`, and therefore cannot preserve per-search attribution, per-search unsubscribe semantics, or multi-search re-entry context.

## Narrow Remediation

Implemented a fixture-only, non-sending reliability seam:

- explicit inactive listing block: `PROPERTY_INACTIVE`;
- explicit private listing block: `PROPERTY_PRIVATE`;
- missing freshness remains blocked as `PROPERTY_STALE`;
- unsupported ambiguous repository timestamp block: `NEWNESS_UNSUPPORTED`;
- active renderer copy assertion rejects "new listing", "newly listed", "just listed", and "new match";
- fixture dry-run counters remain zero for database reads, database writes, queue jobs, provider calls, email logs, unsubscribe tokens, workers, and customer data exposure.

This remediation does not activate production matching, sending, workers, queues, providers, or schema changes.

## Deterministic Certification

Command:

`npm run check:saved-search-new-listing-semantics`

Result:

- status: `SUCCESS`
- mode: `FIXTURE_ONLY_NO_SIDE_EFFECT`
- cases evaluated: `21`
- `PROPERTY_INVALID`: `1`
- `PROPERTY_INACTIVE`: `1`
- `PROPERTY_PRIVATE`: `1`
- `PROPERTY_STALE`: `2`
- `SEARCH_INACTIVE`: `1`
- `USER_UNSUBSCRIBED`: `1`
- `USER_MISSING_EMAIL`: `1`
- criteria mismatches: city `1`, price `1`, beds `1`, type `1`, bounds `1`
- duplicate event: `1`
- `NEWNESS_UNSUPPORTED`: `1`
- render-ready no-send paths: `5`
- delivery blocked in no-send mode: `5`
- database reads: `0`
- database rows created: `0`
- database rows mutated: `0`
- queue jobs created/changed: `0`
- provider calls: `0`
- email log rows created: `0`
- unsubscribe tokens created: `0`
- workers activated: `0`
- customer data exposed: `0`
- copy subject: `David Quinn Group: 1 property intelligence update`
- prohibited newness phrases present: `0`

## Future Internal Live Proof Design

A future one-send proof must be separately authorized and must require:

- one explicitly named internal/test recipient resolved at execution time;
- no customer recipient selection;
- one known saved search;
- one known candidate with authoritative source timestamp inside the approved freshness window;
- one event maximum;
- one queue item maximum only if queue use is explicitly authorized;
- one Resend call maximum;
- before/after counts for `AlertEvent`, `AlertQueue`, `EmailLog`, and `UnsubscribeToken`;
- no scheduler;
- no continuous worker loop;
- no backlog release;
- explicit unsubscribe/token posture;
- cleanup/rollback instructions approved before execution.

Because no current production fresh candidate exists, a non-production fixture email proof or waiting for a natural fresh candidate is safer than manufacturing production data.

## Broad Activation Blockers

- no persisted authoritative source timestamp on `Property`;
- no `savedSearchId` on `AlertEvent` or `AlertQueue`;
- no cadence preference;
- no timezone or quiet-hour policy;
- no per-search communication preference;
- broad unsubscribe integration remains incomplete for per-search attribution;
- changed-listing taxonomy beyond `NEW_LISTING` is absent;
- current production data freshness is stale;
- no scheduler or broad worker activation is authorized.

## Provider Status

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

No provider calls were made.

## Protected Systems

No email was sent. No Resend send call occurred. No production `AlertEvent`, `AlertQueue`, `EmailLog`, `SavedSearch`, `User`, unsubscribe, CRM, `Property`, Prisma schema, migration, MLS sync, Typesense, Vercel, LightBox, ATTOM, provider, or deployment mutation occurred.

## Next Authorization Gate

`READY_FOR_REIE_SAVED_SEARCH_AUTHORITATIVE_FRESHNESS_SOURCE_AND_INTERNAL_PROOF_DECISION`
