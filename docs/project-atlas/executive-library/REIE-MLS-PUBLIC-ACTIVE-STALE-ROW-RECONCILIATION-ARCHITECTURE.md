# REIE MLS Public-Active Stale-Row Reconciliation Architecture

Program: `REIE_MLS_PUBLIC_ACTIVE_STALE_ROW_RECONCILIATION_ARCHITECTURE`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`ADDITIVE_ELIGIBILITY_STATE_REQUIRED`

This workstream completed a zero-provider-call architecture review and added a pure fixture-only reconciliation contract/check. No MLS Grid, LightBox, ATTOM, database, Typesense, alert, route, runtime, deployment, or provider mutation occurred.

## Current Public Eligibility Contract

Repository predicates observed:

- Public search: `app/api/search/route.ts` and `lib/search/searchProperties.ts` apply `isPrivateExclusive = false` for public access and default `status = Active` when no explicit status is supplied.
- Active: `lib/search/listingQuality.ts` defines default marketable status as `Active`; saved-search fixture intent in `lib/alerts/intent/evaluateAlertIntent.ts` also requires `status = Active`.
- Coming Soon: the future MLS scoped ingest filter includes `StandardStatus eq 'Coming Soon'`, but the current public search and saved-search new-listing defaults do not treat Coming Soon as default public-active.
- Private: `Property.isPrivateExclusive` is the repository public/private predicate; contracted access may see private rows when authorized.
- Property Product: `lib/property/publicPropertyRead.ts` resolves by `id`, `slug`, or `mlsId` and does not independently certify current provider Active/Coming Soon membership.
- Typesense: `lib/typesense/indexProperties.ts` imports mapped Supabase `Property` rows into both search collections; current indexing does not certify current provider public-scope membership before import.
- Saved Search: `lib/alerts/intent/evaluateAlertIntent.ts` requires valid identity/city, `status = Active`, `isPrivateExclusive = false`, authoritative freshness, matching saved-search criteria, active user/search, usable payload, and no duplicate event.

Relevant fields:

- `Property.mlsId`
- `Property.status`
- `Property.isPrivateExclusive`
- `Property.sourceModifiedAt`
- `Property.id`
- `Property.slug`

## Absence Semantics

`LOCAL_PUBLIC_ACTIVE_ROW_ABSENT_FROM_CURRENT_PROVIDER_PUBLIC_SCOPE` means:

- a local `Property` row currently satisfies the local public-active predicate; and
- its repository-native source identity is absent from a conclusively completed provider Active/Coming Soon public-scope snapshot.

It proves only:

- `NO_LONGER_PRESENT_IN_CURRENT_ACTIVE_COMING_SOON_SNAPSHOT`

It does not by itself prove:

- Pending
- Closed
- Withdrawn
- Expired
- Cancelled
- Deleted

Absence from a filtered feed is not a replacement-status observation.

## Reconciliation Options

1. Exact source-identity status lookup for absent IDs: most authoritative per ID, but worst request economy if it requires one provider request per absent ID.
2. Provider-supported batched ID filter: best request economy if MLS Grid supports bounded batched identity filtering for the repository-native source ID. Requires later bounded live proof; syntax is not assumed here.
3. Broader transactional-status reconciliation feed: can resolve status for IDs present in broader status scopes but is heavier and must still prove completion for the selected status universe.
4. Provider nextLink traversal over a narrow status universe: authoritative when traversal completes, but request volume depends on provider count for the selected universe.
5. Local eligibility quarantine pending authoritative verification: safest fail-closed posture for search/alerts, but current schema lacks a durable field that distinguishes public eligibility verification from listing status.

Best architecture:

- Use a completed Active/Coming Soon source-ID snapshot to isolate absent local public-active rows.
- Resolve the absent set with the lowest-request authoritative provider mechanism that is later proven under the MLS Grid rate governor.
- Persist eligibility separately from listing status before any durable quarantine or public-scope mutation.

## Provider Request Economy

Conceptual complexity:

- One-ID-per-request: `O(absent IDs)` provider requests; authoritative but likely inefficient under the warning.
- Batched ID filter: `O(ceil(absent IDs / provider-supported batch size))`; preferred if supported and certified.
- Broader status feed: `O(provider pages for selected status universe)`; potentially high but checkpointable and complete if provider traversal completes.
- Existing Active/Coming Soon nextLink traversal: already required for public-scope capture; does not resolve replacement status for absent IDs.

Unsupported provider syntax remains `REQUIRES_BOUNDED_LIVE_PROOF`.

## Local Quarantine Assessment

Existing fields cannot durably represent `PUBLIC_SCOPE_UNVERIFIED` without corrupting semantics:

- changing `status` would fabricate a provider status;
- changing `isPrivateExclusive` would misclassify access rights;
- changing `sourceModifiedAt` would not represent public eligibility;
- deleting the `Property` row would lose history and route continuity.

Durable fail-closed reconciliation therefore requires an additive eligibility state, for example a future field or governed sidecar state such as `publicScopeVerificationStatus`, before implementation.

## Typesense Consequence

Typesense is a rebuildable search index, not the source of truth.

Required gate:

1. Complete DB public-search scope certification.
2. Exclude unresolved or absent/unverified public-active rows from public search eligibility.
3. Only then authorize a Typesense rebuild.

A rebuilt index must not preserve listings known to be absent from the completed current provider public scope unless another authoritative condition supports continued eligibility.

## Property Product Consequence

Historical `Property` records should not be automatically deleted.

Route availability and status representation are separate from public search eligibility:

- historical record retention can remain;
- public listing/search eligibility must fail closed when current provider public-scope verification is absent;
- a property route must not imply current Active status unless authoritative evidence supports it;
- status text must not be fabricated from filtered-feed absence.

## Saved Search Consequence

Unverified or absent public-active rows are not `NEW_LISTING` candidates.

They must not:

- match Saved Search as new listings;
- enqueue alerts;
- create alert events;
- create queue jobs;
- send email.

Alert eligibility resumes only after authoritative current-state evidence supports it.

## Identity Contract

Repository-native reconciliation identity is `Property.mlsId`.

The MLS upsert path derives `mlsId` from the first available provider/source identifier in this order:

1. `ListingKey`
2. `ListingId`
3. `MlsId`
4. `MLSNumber`
5. `ListingNumber`
6. `Id`
7. `mlsid`

`Property.mlsId` is unique and non-null in the schema. Missing source identity blocks upsert and must block reconciliation certification. Duplicate local source identities must block certification rather than force a public-scope decision.

## Future Reconciliation Run Design

After the full scoped ingest is explicitly authorized and completed:

1. Capture complete current provider Active/Coming Soon source IDs with governed nextLink traversal.
2. Compare against local rows satisfying `status = Active` and `isPrivateExclusive = false`.
3. Isolate `LOCAL_PUBLIC_ACTIVE_ROW_ABSENT_FROM_CURRENT_PROVIDER_PUBLIC_SCOPE`.
4. Resolve absent IDs with the lowest-request authoritative provider mechanism proven under the rate governor.
5. Update local eligibility/status only from authoritative evidence.
6. Certify DB public-search scope.
7. Authorize Typesense rebuild only after DB certification.

## Failure and Interrupt Safety

- Incomplete provider snapshot: no absent-set classification.
- Partial ID reconciliation: update or certify only resolved IDs; unresolved IDs remain fail-closed.
- Provider rate limit: stop, checkpoint, and preserve unresolved state.
- Timeout: stop without expanding stale classification.
- Ambiguous identity: block certification for affected rows.
- Missing provider record: treat as unresolved/unverified, not deleted or closed.
- Conflicting state: preserve conflict evidence and fail closed for search/alert eligibility.

## Fixture Plan and Results

Implemented check:

- `npm run check:mls-public-active-reconciliation-contract`

Result:

- `SUCCESS`
- `FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_SIDE_EFFECT`
- `ADDITIVE_ELIGIBILITY_STATE_REQUIRED`

Covered cases:

- present Active;
- present Coming Soon provider-scope semantics;
- absent locally Active;
- absent but provider Pending;
- absent but provider Closed;
- absent but provider Withdrawn/Cancelled/Expired;
- absent and provider lookup unavailable;
- duplicate source ID;
- missing identity;
- incomplete snapshot;
- unverified listing not search eligible;
- unverified listing not alert eligible;
- no DB writes;
- no provider calls;
- no Typesense writes;
- no alert queue writes.

## Implementation Performed

Pure zero-side-effect contract/check only:

- `lib/mls/publicActiveReconciliationContract.ts`
- `scripts/checkMlsPublicActiveReconciliationContract.ts`
- npm check wiring
- worker build inclusion
- documentation and handoff

No production behavior was changed.

## Provider Status

- MLS Grid: `MLS_GRID_LIVE_CALLS_PAUSED_PENDING_RATE_LIMIT_CLARIFICATION`
- LightBox: `LIGHTBOX_SIX_PRODUCT_EVALUATION_SMOKE_TEST_SUCCESSFUL`
- LightBox additional calls in this workstream: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Recommendation

Do not implement stale-row reconciliation by mutating `status`, `isPrivateExclusive`, deleting rows, reindexing Typesense, or suppressing routes from filtered-feed absence alone.

Next executive gate should decide the additive eligibility-state shape and separately authorize a bounded provider-capability proof for the most request-efficient absent-ID status-resolution mechanism.
