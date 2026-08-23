# REIE Authoritative Market Metric Definition And Evidence Contract MVV Certification

## Status

- `PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV_CERTIFIED`
- `SOURCE_METHODOLOGY_ADMISSION_STILL_REQUIRED`
- `READY_FOR_AUTHORITATIVE_METRIC_DEFINITION_ADMISSION`

## Scope

This MVV adds a pure, typed internal contract for market metric definitions, observations, permitted uses, prohibited interpretations, historical metadata, and deterministic comparability. It changes no provider, MLS, IRES, database, schema, runtime data retrieval, persistence, public route, customer record, CRM, communication, credential, authorization, or deployment behavior.

## Definition And Observation Separation

`MarketMetricDefinition` establishes semantic identity independently of a numeric or textual observation. It carries metric family, source family and concept, unit, aggregation, populations, listing-status scope, geography, period, price/DOM/activity basis, methodology/version references, semantic and admission states, freshness contract, limitations, permitted uses, and machine-readable prohibited interpretations.

`MarketMetricObservation` carries only a reported value plus its geography, population/status segment, period/as-of/source/ATLAS-observed dates, freshness, source evidence and methodology references, calculation version, verification state, and limitations. An observation cannot supply omitted semantic meaning through its display string.

## Current Evidence Posture

Current city-context inventory, days-on-market, and price signals are represented as `SEMANTICS_UNRESOLVED`. Their labels remain explicitly bounded:

- `Inventory signal (semantics unresolved)`
- `Days-on-market signal (semantics unresolved)`
- `Price signal (semantics unresolved)`

The contract does not call the DOM measure average, median, ADOM, or CDOM. It does not call the price measure list, original-list, sold, or closed-sale. It does not certify active-inventory methodology. The existing Agent Market and Market Update semantic adapter derives these labels from the new definitions, preserving its fail-closed runtime posture.

## Methodology, Uses, And Prohibitions

Every definition can reference an eventual MLS, IRES, provider, official methodology, or certified repository source. Current definitions retain a null methodology reference and specify the exact evidence required. They are admitted only for raw-observation, Agent-preparation, and audience-update-preparation contexts; historical comparison, derived calculation, comparative reporting, and public display are not admitted.

Every current definition preserves `NO_TREND_INFERENCE`, `NO_FORECAST`, buyer/seller-leverage, affordability, valuation, pricing, and negotiation prohibitions.

## Historical And Comparability Contract

Historical existence is distinct from certified comparability. Comparison requires stable metric definition, methodology, calculation version, population, status population, and period metadata. Mismatched definitions fail `NOT_COMPARABLE`; missing metadata fails `INSUFFICIENT_METADATA`. Matching observations under current unresolved definitions remain `COMPARABLE_WITH_LIMITATIONS`; a separate fixture-only certified definition proves the `COMPARABLE` state without admitting a real source. No MoM, QoQ, YoY, rolling-period, or point-in-time market calculation is added.

## P0 Readiness

The contract can represent future active inventory, new listings, pending activity, closed sales, defined DOM/CDOM, price measures, price reductions, sale-to-list relationships, months of supply, and prior-period comparisons. Defining these concepts does not admit values, methodology, source use, or public reporting.

## Verification

`npm run check:market-metric-definition-evidence` proves unresolved DOM and price labels cannot masquerade as specific measures, use restrictions remain enforceable, metadata-incomplete observations fail closed, incompatible definitions cannot compare, compatible fixtures retain their limitations, and protected boundaries remain false.

Existing Market Preparation, Market Update, source-quality, current-market-computation, historical-observation, professional-handoff, authorization, and public-trust checks remain required release gates.

## Next Gate

`SOURCE_METHODOLOGY_ADMISSION_STILL_REQUIRED`: admit authoritative source methodology, population/status/period/geography semantics, methodology version, freshness, and permitted uses for each proposed metric before upgrading any definition or enabling historical comparison, derived calculation, comparative reporting, or public display.
