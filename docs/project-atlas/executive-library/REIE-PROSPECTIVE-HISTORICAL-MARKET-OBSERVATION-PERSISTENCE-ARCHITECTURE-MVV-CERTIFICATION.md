# REIE Prospective Historical Market Observation Persistence Architecture MVV Certification

## Status

- `REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_CERTIFIED`
- `READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_IMPLEMENTATION_MVV`

This is a schema-free, write-free architecture gate. It does not authorize a migration, database write, scheduler, provider call, historical backfill, Agent consumption, public consumption, or deployment.

## Retention Principle

Future historical Market evidence should retain certified derived aggregate observations, not duplicate raw MLS payloads solely for Market analytics. Existing Property storage remains independently governed. Every future observation represents what a certified current computation produced at one specific certified source cutoff and observation time.

## Recommended Entities

`MarketObservationRun` is an immutable lineage header. Its unique key is `(sourceSetId, sourceCutoff, observationDay)` and captures freshness, certification, all contract versions, governance version, lineage, and invalidation fields.

`MarketAggregateObservation` stores one derived aggregate by run, canonical city/ZIP scope, metric, status scope, optional property-type scope, and optional price-band scope. Its unique key is `(runId, geographyType, geographyId, metric, statusScope, propertyTypeScope, priceBandScope)`. Required indexes support source-cutoff/idempotency checks, time-series Market reads, metric state, and run lineage.

## Future Writer And Cadence

The only future writer is `POST_SYNC_CERTIFIED_OBSERVATION_WRITER`. It must consume a certified current-computation result only, perform no provider retrieval, validate every required version and source cutoff, reject stale/conflicting/insufficient/duplicate input, and write at most one certified observation per source cutoff per day. No writer, worker, or scheduler is implemented here.

## Comparison Eligibility

Two observations are comparable only when both are certified, fresh, non-invalidated, sufficiently sampled, governed, and compatible in geography, metric, source set, status scope, segment scopes, and all version fields. Otherwise they return `COMPARISON_NOT_ELIGIBLE` or a specific fail-closed state.

30-day, 90-day, and YoY comparisons require an explicit target and Executive-approved maximum date tolerance. Until that policy is supplied, candidate selection returns `TOLERANCE_POLICY_REQUIRED`; no nearest-date rule is invented. A period without a certified compatible observation returns `MISSING_PRIOR_PERIOD`.

## Future Read Authorities

Internal Agent analysis requires its separate aggregate visibility/composition gate. Client professional reports require separate product, compliance, and publication approval. Public product requires separate public source, attribution, and display authority. None is permitted by this architecture.

## Verification

`npm run check:prospective-market-observation-persistence-architecture` proves deterministic write eligibility, idempotency guard, future comparison eligibility, tolerance-policy deferral, invalidation handling, aggregate-only retention, separate readers, and no executing dependency.
