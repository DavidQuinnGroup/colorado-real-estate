# REIE Bounded Current Market Computation MVV Certification

## Status

- `REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_CERTIFIED`
- `CURRENT_COMPUTATION_CERTIFIED_BUT_LIVE_READ_AUTHORIZATION_REQUIRED`
- `READY_FOR_AGENT_MARKET_AGGREGATE_VISIBILITY_GATE`

The implementation is a pure deterministic fixture-only engine. It has no database adapter, provider retrieval, source refresh, persistence, scheduler, public route, Agent composition, customer data, or deployment behavior.

## Normalization And Population

Every candidate record requires a stable MLS identity, one of the six supported city values, a valid five-digit ZIP (ZIP+4 normalizes to five digits), a valid source-modified time inside the caller-supplied freshness window, and a supported status. Duplicate listing identities are excluded as a whole. Unknown statuses, unsupported cities, stale records, invalid ZIPs, and invalid timestamps are excluded with deterministic reason counts.

The finite status taxonomy is `ACTIVE`, `COMING_SOON`, `PENDING`, `CLOSED`, `INACTIVE`, and `UNKNOWN`. Repository evidence supports `Active`, `Coming Soon`, `Pending`, `Under Contract`, `Closed`, `Sold`, `Inactive`, `Withdrawn`, `Expired`, `Cancelled`, and `Canceled`; unmapped values remain `UNKNOWN`. Current metrics do not infer missing semantics.

The property-type taxonomy maps only exact supported values: single-family/detached, condo/condominium, townhome/townhouse, multi-family/multifamily, land, and other. Broad `Residential` remains `UNKNOWN`, preserving the limitation rather than inventing a segment.

## Certified Current Metrics

- active inventory count;
- median active list price, with sparse sample suppression;
- median active list price per square foot, using positive current list price and positive stored square footage only;
- active inventory by normalized property type, retaining unknown counts in provenance;
- pending count;
- pending-to-active ratio when the active denominator is nonzero.

Each aggregate carries scope, sample/population size, source-set identity, computation time, oldest/latest admitted source-modified time, freshness, normalization and metric versions, and limitations. Price bands are deliberately deferred because no Executive threshold policy is established.

No closed-sale price, list-to-sale ratio, price reduction, DOM/CDOM, inventory age, time-to-contract, pending velocity, absorption, months of supply, or period-over-period metric is produced.

## Agent And Live-Read Boundary

The existing Agent Market contract is not modified. The engine is not yet an Agent-visible source. A separate live read-only internal adapter authorization is needed before evaluating real synchronized data, followed by a separate Agent aggregate visibility/composition gate. Internal readiness does not authorize client or public use.

## Verification

`npm run check:current-market-computation` proves deterministic normalization, scope, duplicate/invalid handling, metric populations, current-list versus sale semantics, sparse handling, provenance, and non-activation boundaries.
