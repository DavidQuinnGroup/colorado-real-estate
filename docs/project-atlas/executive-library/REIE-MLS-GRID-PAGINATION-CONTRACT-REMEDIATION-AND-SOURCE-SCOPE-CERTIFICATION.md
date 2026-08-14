# REIE MLS Grid Pagination Contract Remediation And Source Scope Certification

Date: 2026-08-14

Program: `REIE_MLS_GRID_PAGINATION_CONTRACT_REMEDIATION_AND_SOURCE_SCOPE_CERTIFICATION`

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical baseline at execution:

- Branch: `main`
- `HEAD = origin/main = b84d64c31db9d882c00b195f4eb57a23229f8864`
- Divergence: `0 behind / 0 ahead`
- Worktree before work: clean

## Executive Status

Final classification:

`MLS_PAGINATION_REMEDIATION_CERTIFIED_READY_FOR_SCOPED_INGEST`

No additional MLS Property ingestion was performed. No `Property` rows, `MlsSyncState` rows, Typesense collections, alert rows, queue rows, email rows, customer data, provider settings, Vercel configuration, or runtime deployment were mutated.

## MLS Response Contract

The prior `fetchMLSPage` path requested `/Property` with:

- `$orderby=ModificationTimestamp desc`
- `$skip=page * top`
- `$top=top`
- optional `$expand=Media`

That path returned only `value[]`, so provider metadata such as `@odata.count` and `@odata.nextLink` was discarded.

The remediation adds a repository-native page contract:

- `value`: sanitized array of listing payload records.
- `metadata.sourceCount`: `@odata.count` when requested and returned; otherwise `null`.
- `metadata.nextLink`: `@odata.nextLink` when returned; otherwise `null`.
- `metadata.hasNextLink`: boolean provider continuation signal.
- `metadata.terminationSignal`: `not_terminal`, `next_link_absent`, or `empty_page`.
- `metadata.rawResponseKeys`: response-key inventory for deterministic checks without retaining raw provider payloads.

Existing callers remain compatible because `fetchMLSPage()` still returns `value[]`.

New future-ingest helpers:

- `fetchMLSPageResponse()` requests count metadata and returns `value + metadata`.
- `fetchMLSPageResponseFromNextLink()` follows a provider `@odata.nextLink` only after validation.
- `validateProviderNextLink()` rejects missing, malformed, credentialed, unsupported-protocol, and wrong-host URLs.

## Pagination Mode Decision

Certified future traversal mode:

`PROVIDER_NEXTLINK_TRAVERSAL`

Rationale:

- The provider returned `@odata.count` and `@odata.nextLink` for the current source response.
- Bare `$orderby=ModificationTimestamp desc + $skip` is not certified for large-scale traversal because timestamp ties can shift records while the source changes.
- Provider-issued nextLink avoids locally reconstructing skip/order progression and provides the strongest available continuation signal.

Termination should be based on:

1. `@odata.nextLink` absent after processing a page; or
2. `value.length === 0`.

Short pages without nextLink are terminal. Short pages with nextLink are not terminal until the provider continuation signal ends.

## Deterministic Order Findings

The active full-refresh helper orders only by `ModificationTimestamp desc`.

Fixture validation confirms `ModificationTimestamp` is not a unique ordering key. If offset pagination is ever used again, it must use a provider-supported stable multi-field order such as `ModificationTimestamp desc, ListingKey`, but that behavior was not assumed here.

Because nextLink is now the recommended traversal mechanism, future scoped ingest should not depend on manual offset prediction or local `totalRecords`.

## Source Count And Scope Findings

Read-only provider metadata/count probes were performed with at most one row returned per query and no database mutation.

Important caveat:

- The provider returned `@odata.count = 574000` for the unfiltered Property feed at one probe point.
- Filtered counts such as `StandardStatus eq 'Closed'` returned a larger count (`598606`) than the unfiltered count.
- Therefore provider counts are useful for scoping direction and guard sizing, but the full-feed count behavior is inconsistent and should not be treated as a financial-grade invariant without provider confirmation.

Directional status counts observed:

| Probe | Count |
| --- | ---: |
| All Property | 574000 |
| Active | 29738 |
| Coming Soon | 154 |
| Pending | 5609 |
| Active Under Contract | 1081 |
| Closed | 598606 |
| Expired | 750 |
| Withdrawn | 337 |
| Canceled | 0 |
| Cancelled | Provider rejected as invalid enum |

Display-eligible count probes using `MlgCanView eq true`:

| Probe | Count |
| --- | ---: |
| Viewable Active | 29725 |
| Viewable Coming Soon | 154 |
| Viewable Pending | 5608 |
| Viewable Active Under Contract | 1081 |
| Viewable Active + Coming Soon, modified since 2026-07-15 | 22545 |

Recency probes:

| Probe | Count |
| --- | ---: |
| Modified since 2026-08-13T18:00:00Z | 4133 |
| Modified since 2026-08-07T00:00:00Z | 47982 |
| Modified since 2026-07-15T00:00:00Z | 192250 |
| Modified since 2026-01-01T00:00:00Z | 239279 |
| Modified since 2025-08-14T00:00:00Z | 636275 |

The provider rejected `CloseDate` as a filter field for the Property replication resource. Provider error stated replication requests can only be filtered by:

- `MlgCanView`
- `ModificationTimestamp`
- `OriginatingSystemName`
- `StandardStatus`
- `ListingId`
- `PropertyType`
- `ListOfficeMlsId`

## REIE Product Requirement Mapping

`PUBLIC_SEARCH_REQUIRED`:

- `MlgCanView eq true`
- `StandardStatus eq 'Active'`
- `StandardStatus eq 'Coming Soon'`

`PROPERTY_HISTORY_REQUIRED`:

- Not required for immediate public Search correction.
- May later justify a bounded recent-closed or property-detail history design, but requires a separate source-rights and storage decision.

`MARKET_ANALYTICS_REQUIRED`:

- Bounded historical or recent status-change windows may be useful, but full 574k+ feed ingestion is not required to restore public Search correctness.

`INTERNAL_ONLY_USEFUL`:

- Pending and Active Under Contract can support internal advisory review and transaction-state research, but should not be included in public Search unless product policy explicitly chooses that.

`NOT_CURRENTLY_JUSTIFIED`:

- Full available Property feed.
- Expired, Withdrawn, and broad Closed/Sold history for the immediate Search consistency objective.

## Ingest Scope Options

### Option A - Active / Coming Soon Only

Filter:

`MlgCanView eq true and (StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')`

Approximate source count:

- Active: `29725`
- Coming Soon: `154`
- Combined directional count: about `29879`

Benefits:

- Best fit for public Search, Property Product, saved-search NEW_LISTING alerts, SEO/AEO current inventory, and immediate Typesense consistency.
- Smallest justified production dataset.
- Avoids full-feed storage and stale-document burden.

Tradeoffs:

- Does not support broad historical analytics or closed-sale market history.

### Option B - Active + Current Transactional States

Filter:

`MlgCanView eq true and StandardStatus in Active, Coming Soon, Pending, Active Under Contract`

Approximate source count:

- About `36568` directionally.

Benefits:

- Supports internal transaction-state awareness.

Tradeoffs:

- Public Search semantics become less clean unless pending/contract statuses are intentionally separated or hidden.
- Alerts need explicit policy to avoid notifying on non-public-search states.

### Option C - Active + Bounded Recent Closed/Historical Window

Potential filters:

- Current active/coming soon scope plus bounded `ModificationTimestamp` window for historical analysis.

Benefits:

- Supports market analytics and listing-history research.

Tradeoffs:

- `CloseDate` is not filterable in the provider replication endpoint.
- `ModificationTimestamp` is not equivalent to closed-date history and can include status edits, corrections, and other changes.
- Requires separate data-model and product-scope design.

### Option D - Full Available Property Feed

Approximate source count:

- Directionally `574000+`, with observed count inconsistencies.

Benefits:

- Maximum raw source availability.

Tradeoffs:

- Not justified for immediate public Search correctness.
- Largest storage, sync-duration, stale-reconciliation, Typesense, and licensing/display-scope risk.
- Would require a dedicated historical-data architecture and source-rights review.

## Recommended Source Scope

Recommended next ingest certification:

`OPTION A - ACTIVE / COMING SOON ONLY`

Use:

`MlgCanView eq true and (StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')`

Reasoning:

- It aligns with the public Search and Property Product surface.
- It is materially smaller than the full feed.
- It preserves future expansion paths for pending/contract/internal history without silently choosing the largest source scope.
- It gives Typesense a clean public-search target.

No executive source-scope choice is required before proceeding with Option A. A separate executive decision is required only if REIE wants pending, under-contract, recent-closed, or full historical ingestion in the next wave.

## MlsSyncState Semantics

`MlsSyncState.totalRecords` is now explicitly treated as:

`LOCAL_PROCESSED_RECORD_COUNT`

It must not be used as:

- provider source count;
- intended scope count;
- terminal-page prediction.

No schema migration was executed. A future additive schema could introduce separate concepts such as `sourceCountAtStart`, `intendedScopeCount`, `lastNextLink`, and `processedCount`, but the next scoped ingest can proceed without schema migration if the runner records those values in its certification output and keeps `totalRecords` as local processed count.

## Validation

Commands run:

- `npm run check:mls-pagination-contract`
- `npm run check:mls-source-freshness-contract`

Both passed.

`check:mls-pagination-contract` is fixture-only and validated:

- page with `value`, count, and nextLink;
- terminal page without nextLink;
- empty page;
- short page with nextLink;
- stable repeated page metadata;
- tied `ModificationTimestamp` records;
- malformed nextLink;
- wrong-host nextLink rejection;
- absent count;
- source count changing between requests;
- local processed count distinct from source count;
- no DB write;
- no provider call;
- no alert/email/Typesense side effect.

## Typesense Consequence

Future Typesense reindex should target public/search-eligible persisted rows for the canonical Search collections, not the full MLS feed.

The current repository reindex path imports all fetched `Property` rows into both canonical collections (`properties` and `listings`) with upsert semantics. That is not sufficient by itself for a future source-scope correction unless stale/obsolete rows outside the intended public scope are reconciled.

Recommended future indexing posture:

- Persist only the intended current public inventory scope for the next ingest wave; or
- If broader history is persisted later, make Typesense indexing filter to public/search-eligible rows.

No Typesense mutation or reindex occurred in this workstream.

## Resume-Ingest Design

Recommended next authorization:

`REIE_MLS_GRID_SCOPED_ACTIVE_COMING_SOON_NEXTLINK_INGEST_CERTIFICATION`

Required scope:

`MlgCanView eq true and (StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')`

Traversal mechanism:

- Start with `/Property` request using the scoped filter, `$count=true`, `$top=100`, and provider-supported ordering.
- Continue only through provider `@odata.nextLink`.
- Validate every nextLink with provider-bound host/protocol checks.

Expected range:

- Directional source count about `29879` records.
- Guard should be based on `sourceCount / top` plus a small margin, not on `MlsSyncState.totalRecords`.

Termination signal:

- Provider nextLink absent; or
- empty page.

Resume state:

- Record current page/processed count and provider nextLink in certification output.
- Do not treat local processed count as source cardinality.

Failure handling:

- Stop on material fetch/upsert failure rate.
- Stop on wrong-host/malformed/credentialed nextLink.
- Stop if source count shifts materially enough to invalidate the guard.

Duplicate handling:

- Use `mlsId` upsert as existing row identity.
- Report created/updated/unchanged/skipped/failed.

`sourceModifiedAt`:

- Continue using `ModificationTimestamp` as source freshness field and existing persistence decisions.

Protected boundary:

- Alerts disabled.
- Email disabled.
- Workers/scheduler disabled.
- Typesense disabled until scoped ingest is certified complete.

## Protected Systems

No additional MLS pages were ingested. No full MLS refresh, `Property` mutation, Typesense mutation, reindex, alert creation, queue creation, email send, worker activation, scheduler activation, customer-data mutation, LightBox call, ATTOM investigation, deployment, or push occurred.

Provider status remains:

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Next Gate

`READY_FOR_REIE_MLS_GRID_SCOPED_ACTIVE_COMING_SOON_NEXTLINK_INGEST_CERTIFICATION`
