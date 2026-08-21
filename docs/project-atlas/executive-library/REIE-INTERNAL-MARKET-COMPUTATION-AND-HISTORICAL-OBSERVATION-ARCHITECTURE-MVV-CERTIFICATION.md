# REIE Internal Market Computation And Historical Observation Architecture MVV Certification

## Status

- `REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_CERTIFIED`
- `REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_CERTIFIED`
- `READY_FOR_BOUNDED_CURRENT_MARKET_COMPUTATION_IMPLEMENTATION_MVV`
- `READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_GATE`

This is an internal architecture, metric-contract, and readiness certification. It does not activate Market computation, a database read or write path, provider retrieval, Agent mutation, public display, a scheduler, or deployment.

## Governing Source Posture

The restriction-triggered source-governance certification is inherited. Authorized access, legitimate professional purpose, and no identified material restriction permit ordinary internal professional analysis; missing affirmative language does not itself block it. The identified MLS restriction is provider retrieval rate behavior. Future Market computation must use already synchronized data and must not introduce separate or abusive provider retrieval. No provider contact is called for by this architecture.

## Repository Evidence Inventory

The current `Property` model retains current `price` (mapped from `ListPrice`/`CurrentPrice`), raw `status`, `sqft`, beds, baths, year built, property type, city, ZIP, source freshness, and raw neighborhood/subdivision text. It does not retain close price/date, original list price, source listing-origin date, DOM/CDOM, county, normalized status transitions, or canonical neighborhood assignment. `PriceHistory` exists as a schema model but this review found no admitted writer or certified history read establishing its coverage. `createdAt` and `updatedAt` are local timestamps, not source market-event evidence.

Existing repository-local city market context can continue to support the separately certified Agent preparation contract only within its source, freshness, and professional-verification boundaries. It is not evidence that the current Property rows reconstruct a historical market.

## Metric Contract

`lib/internalMarketComputationArchitecture.ts` inventories every candidate metric with exact source fields, population, numerator, denominator, time window, inclusions, exclusions, null and duplicate handling, status/geography treatment, date field, aggregation, display rounding, sample condition, freshness, and limitation.

- Current inventory, list-price, price-per-square-foot, price-band, pending-to-active, city/ZIP, and segment metrics require at least certified status or field normalization.
- Sold-price, list-to-sale, price-change, DOM, inventory-age, and pending-velocity metrics require fields not retained today or source semantics certification.
- Months-of-supply and absorption require a defined historical event period and are not inferred from a point-in-time current count.
- Neighborhood/submarket metrics require canonical governed geography; raw text does not create an assignment. County requires a field or governed relationship not retained today.

## Historical Evidence

Current rows are not prior inventory snapshots. A listing price-history record is not a market snapshot. No certified periodic Market observation store exists. Therefore 30-day, 90-day, and YoY changes require prospective certified observations unless a future package separately certifies reconstructed history from reliable event evidence. Such reconstructed evidence must be labeled `RECONSTRUCTED_HISTORY`, never `OBSERVED_HISTORY`.

`HISTORICAL_OBSERVATION_START_DATE` is the first successfully certified prospective observation after a separately authorized write-path activation.

## Preferred Architecture

Three bounded options were evaluated: raw property payload snapshots, precomputed aggregates only, and normalized listing observations plus aggregates. The preferred option is `NORMALIZED_LISTING_OBSERVATION_PLUS_AGGREGATE`:

1. A certified observation-run header captures source identity/cutoff, observation time, completeness, freshness, exclusions, and every required version.
2. One normalized listing observation per stable MLS identity and run retains only fields needed to reproduce governed metrics, not the full raw MLS payload.
3. Versioned aggregates are stored per observation run, canonical geography, optional segment, and metric definition.

The minimum grain is run, normalized listing observation, and aggregate. Optional future segmentation is property type, bedrooms, price, square footage, and year built. The recommended future frequency is a hybrid: at most one certified post-sync observation per source cutoff/day, derived from already synchronized data. It does not authorize a sync, a query, a schedule, or a write.

## Provenance, Quality, And Retention

Every future observation requires source identity, source cutoff, observation time, record inclusion/exclusion counts and reasons, freshness, completeness, metric, normalization, geography, schema, and source-definition versions. A stale source, incomplete retrieval, failed computation, or unknown metric version blocks certification. Field incompleteness, uncertain status/geography, insufficient sample, or duplicates produce a visible degraded state rather than a clean-looking statistic.

The future retention purpose is reproducibility, correction, quality audit, and period comparison. The minimum useful horizon is at least thirteen months after a certified observation for YoY comparison, subject to future controlling terms. Corrected observations append and link to superseded runs. A later controlling term may require deletion or restriction through a separately authorized retention policy.

## Consumption Boundaries And Activation Sequence

Private Agent use is a future separately authorized consumer of certified, fresh, internally governed aggregates. Client-facing professional work product needs a separate professional/compliance and publication gate. Public Market display needs separate product, source, attribution, and public-display authority. Internal use never implies public use.

The future sequence is: bounded current-computation implementation; dry-run observation generation; persistence schema and write-path authorization; prospective observation accumulation; 30-day, 90-day, and YoY comparison gates as evidence matures; then a separately authorized Agent experience enhancement. No phase is activated by this certification.

## Verification

`npm run check:internal-market-computation-architecture` verifies inherited restriction-triggered governance, metric coverage, historical separation, deterministic quality failures, architecture selection, versioning, and side-effect-free contract boundaries.
