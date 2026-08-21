# REIE Internal Synchronized Property Market Read Adapter MVV Certification

## Status

- `REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_CERTIFIED`
- `REIE_CURRENT_MARKET_SOURCE_SET_CURRENTNESS_CONTRACT_CERTIFIED`
- `REIE_CURRENT_MARKET_STATUS_POPULATION_CONTRACT_CERTIFIED`

The adapter is a read-only internal bridge from already synchronized `Property` rows to the pure Current Market engine. It uses Prisma `findMany` only. It has no provider retrieval, sync, source activation, write, schema, scheduler, public route, customer join, CRM access, or Agent UI behavior.

## Minimum Projection

The only projected fields are `mlsId`, `city`, `zip`, `status`, `price`, `sqft`, `propertyType`, and `sourceModifiedAt`. The query is restricted case-insensitively to Boulder, Louisville, Lafayette, Superior, Erie, and Longmont. It does not project remarks, photos, address, agents, office, relationships, customer data, saved searches, alerts, or any content unrelated to the certified current-Market contract.

## Source-Set Currentness

The adapter cannot use `MlsSyncState.lastSync` as proof of a successful, complete source observation. A Current Market computation instead requires a matching source-set completion record containing a run identity, start and completion timestamps, a source cutoff, counts, a terminal traversal signal, and zero errors.

The completion certificate is evaluated against the aggregate computation time. A partial, failed, nonterminal, incomplete, or mismatched source-set record fails closed. Existing historical `MlsSyncState` values are intentionally insufficient for a current Market assertion.

`sourceModifiedAt` remains the last MLS record-change timestamp. It is retained as provenance and a data-quality signal, but it is not a per-record Market-inventory admission cutoff. Missing record-change time is reported without excluding a current-status record that was included in a certified source-set observation.

## Status And Property-Type Population

Current Market population is normalized before metric computation. `Active` is active inventory; `Pending`, `Under Contract`, and `Active Under Contract` map to pending; `Coming Soon` is reported separately. Closed, sold, inactive, withdrawn, expired, and cancelled statuses are excluded from the current population.

Generic `Residential` maps to `UNSPECIFIED_RESIDENTIAL`, not to a dwelling subtype. It can participate in overall inventory while remaining an explicit non-inferential category for type segmentation.

## Aggregate Reporting

The standalone read runner reports that a matching source-set completion certificate is required and does not compute an uncertified snapshot. The controlled source-set runner may produce same-run aggregate reports by city after a terminal, error-free source-set traversal. Reports contain only counts, metrics, source-set provenance, sparse states, and limitations; they never print raw listing records or identities.

Current rows remain current levels only and do not support trend, velocity, historical inventory, historical pricing, 30-day, 90-day, or YoY claims.
