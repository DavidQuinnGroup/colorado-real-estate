# REIE MLS Grid Rate Limit Safety And Scoped Ingest Recertification Preparation

Date: 2026-08-14

Program: `REIE_MLS_GRID_RATE_LIMIT_SAFETY_AND_SCOPED_INGEST_RECERTIFICATION_PREPARATION`

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical baseline at execution:

- Branch: `main`
- `HEAD = origin/main = a82daed8304189b043b16b7ece0f30fe58a0060e`
- Divergence: `0 behind / 0 ahead`
- Latest local Primary work was uncommitted at start and preserved.

## Executive Status

Final classification:

`MLS_GRID_RATE_SAFETY_AND_FILTER_REMEDIATION_LOCALLY_CERTIFIED_READY_FOR_NEW_BOUNDED_LIVE_PROOF`

No MLS Grid API request was made during this workstream. No full scoped ingest, Typesense mutation, alert/email activity, worker/scheduler activation, deployment, push, LightBox call, ATTOM investigation, or CRM/customer-data mutation occurred.

## Provider Safety Event

Executive HQ received provider safety evidence on August 14, 2026:

- Account-specific observed activity: `5.0 requests/second`
- Account-specific cited limit: `2 requests/second`

Provider warning thresholds stated in the notice:

- `7200` requests/hour
- `3072 MB/hour`
- `4 RPS` warning threshold
- `40000` requests/rolling 24h
- `40 GB/24h`

Temporary suspension thresholds stated:

- `18000` requests/hour
- `4096 MB/hour`
- `6 RPS`
- `60000` requests/rolling 24h
- `60 GB/24h`

PROJECT ATLAS treats the account-specific `2 RPS` warning as the operative ceiling until MLS Grid clarifies otherwise. The implemented PROJECT ATLAS policy is intentionally below that ceiling.

## Shared MLS Request Governor

The shared MLS provider request boundary is `lib/mls/rateLimiter.ts`.

All identified MLS Grid HTTP paths already flow through the shared limiter and now inherit the upgraded governor:

- `lib/mls/fetchMLSPage.ts`
  - `fetchMLSPage`
  - `fetchMLSPageResponse`
  - `fetchMLSPageResponseFromNextLink`
- `lib/mls/mlsGridClient.ts`
  - `fetchMLSGridListings`
- Callers that route through those helpers:
  - `lib/mls/syncMLSGrid.ts`
  - `lib/mls/scopedIngestAcceleration.ts`
  - `workers/mlsPageWorker.ts`
  - `workers/mlsWorker.ts`
  - `scripts/fetchMLS.ts`
  - `scripts/mlsSync.ts`
  - `scripts/runMlsScopedAcceleratedIngest.ts`

Effective policy:

- Maximum sustained request rate: `1 request/second`
- Minimum inter-request interval: `1000 ms`
- Burst capacity: `1`
- No multi-request burst
- Concurrent callers serialize through one shared chain

Default configurable guardrails:

- `MLS_GRID_MAX_REQUESTS_PER_RUN`, default `1000`
- `MLS_GRID_MAX_REQUESTS_PER_MINUTE`, default `60`
- `MLS_GRID_MAX_REQUESTS_PER_HOUR`, default `3600`
- `MLS_GRID_MAX_REQUESTS_PER_24H`, default `30000`

The governor records run-scoped attempted, succeeded, failed, start/end time, request timestamps, average request rate, and effective policy. It does not persist provider credentials and does not create a scheduler or daemon.

## Retry And Backoff

Retryable statuses:

- `408`
- `429`
- `500`
- `502`
- `503`
- `504`

Retry policy:

- Default bounded retries: `2`
- `Retry-After` honored when present
- Exponential bounded backoff otherwise
- Governor applies to every retry attempt
- Non-retryable 4xx responses fail without tight retry loops

## Filter Forwarding Remediation

The prior live proof was invalid because the initial scoped request did not forward the intended filter into the metadata-preserving request path.

Remediated scoped filter:

`MlgCanView eq true and (StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')`

The initial scoped request now forwards:

- `$filter`
- `$orderby=ModificationTimestamp desc`
- `$count=true`
- `$top=100`
- no `$expand=Media`

Subsequent traversal continues to use validated provider `@odata.nextLink`.

## NextLink Safety

Preserved protections:

- HTTPS only
- provider host match
- no credentialed URLs
- no arbitrary external URL
- existing authorization header mechanism
- no raw nextLink printing in live runner output
- governor applies equally to initial and nextLink requests

## Concurrency Separation

Database row processing may use bounded concurrency.

Provider HTTP requests remain globally sequential through the governor. Row-level upsert concurrency cannot create parallel MLS Grid requests because page fetches are outside the row-processing worker pool and both MLS request helpers share the same request governor.

## No-Call Certification

Validation performed with fixtures, mocks, static analysis, and local deterministic timing only.

Passed:

- `npm run check:mls-rate-governor-safety`
- `npm run check:mls-pagination-contract`
- `npm run check:mls-source-freshness-contract`
- `npm run check:saved-search-new-listing-semantics`
- `npm run check:mls-scoped-ingest-acceleration`
- `npm run typecheck`
- `npm run worker:build`
- `git diff --check`

The rate-governor fixture certified:

- 1 RPS enforcement
- no burst above 1
- concurrent callers serialize
- initial filtered request
- nextLink request
- retry still respects governor
- 429 Retry-After behavior
- bounded retries
- run request budget
- exhausted budget fail-closed behavior
- request accounting
- wrong-host nextLink rejection
- malformed nextLink rejection
- scope fingerprint mismatch
- checkpoint resume
- Active/Coming Soon filter forwarding
- DB worker concurrency does not increase provider RPS
- zero real provider calls during fixtures

## Prepared Future Live Proof

Prepared but not executed:

- exact certified Active/Coming Soon filter
- provider nextLink traversal
- max `2 pages / 200 records`
- max `1 provider request/sec`
- burst `1`
- explicit request-count budget
- no Typesense
- no alerts/email
- before/after DB counts
- provider request-accounting evidence

Suggested command shape for a separately authorized future proof:

`npm run run:mls-scoped-accelerated-ingest -- --execute --simulate-resume --max-pages=2 --max-rows=200 --max-provider-requests=2 --concurrency=6 --top=100 --timeout-ms=45000`

## Suggested MLS Grid Support Question

Executive HQ may ask MLS Grid:

> We received an account-specific warning citing a 2 requests/second limit, while the general warning threshold language references 4 RPS. Which sustained RPS limit governs this specific IDX subscription, and do you recommend a lower operational target for bounded bulk synchronization under this account?

Do not ask for a limit increase yet.

## Preserved Sequencing

1. Recertify safe scoped MLS live ingest.
2. Complete Active/Coming Soon ingest.
3. Reconcile stale public-active DB rows.
4. Certify DB public-search scope.
5. Reindex Typesense.
6. Certify Search.
7. Only then resume Saved Search live-proof work.

## Next Gate

`READY_FOR_2_PAGE_MLS_GRID_RATE_GOVERNED_SCOPED_LIVE_RECERTIFICATION`
