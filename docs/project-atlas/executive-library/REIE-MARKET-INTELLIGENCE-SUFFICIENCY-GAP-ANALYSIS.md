# Market Intelligence Sufficiency Gap Analysis

## Status

`PROJECT_ATLAS_MARKET_INTELLIGENCE_SEMANTICS_SUFFICIENCY_AND_PROPERTY_CRITERIA_FOUNDATION_MVV`

This is an internal readiness artifact. It does not admit a source, activate a provider, query MLS/IRES data, persist observations, create a market report, or authorize customer-facing use.

## Current Evidence Inventory

| Current signal | Repository source concept | Classification | Semantic posture | Priority |
| --- | --- | --- | --- | --- |
| Inventory value | `CityStats.inventory` via the certified repository context producer | `AVAILABLE_BUT_SEMANTICS_REQUIRE_RECONCILIATION` | Status set, population, geography, snapshot time, and exclusions are not admitted | P0 |
| Days value | `CityStats.daysOnMarket` via the certified repository context producer | `AVAILABLE_BUT_SEMANTICS_REQUIRE_RECONCILIATION` | Average/median/CDOM/ADOM method, population, period, geography, and exclusions are not admitted | P0 |
| Price value | `CityStats.medianPrice` via the certified repository context producer | `AVAILABLE_BUT_SEMANTICS_REQUIRE_RECONCILIATION` | List/original-list/sold/closed/asking basis, population, period, geography, and exclusions are not admitted | P0 |

All three signals are dated repository context, not sufficient professional market intelligence. Their display state is `METRIC_SEMANTICS_UNRESOLVED` until authoritative source documentation is admitted.

## Intelligence Gap Register

| Category group | Classification | P0-P3 | Source and admission dependency | Implementation dependency |
| --- | --- | --- | --- | --- |
| Active inventory with defined status scope | `AVAILABLE_BUT_SEMANTICS_REQUIRE_RECONCILIATION` | P0 | Authoritative source methodology and permitted-use admission | Defined metric contract and dated observation model |
| New, pending, closed, withdrawn, expired, and cancelled activity | `SOURCE_EXISTS_NOT_ADMITTED` | P0 | Authorized source family, field/status definitions, rights, freshness | Current and historical observation set |
| Median list and closed-sale price; average list and closed-sale price | `SOURCE_EXISTS_NOT_ADMITTED` | P0 | Price-basis methodology, population, period, rights | Separate list-side and closed-sale metrics |
| Average/median DOM, CDOM, ADOM | `AVAILABLE_BUT_SEMANTICS_REQUIRE_RECONCILIATION` | P0 | Authoritative calculation and population documentation | Defined aggregation and comparison-period model |
| Months of supply, absorption rate, listing velocity | `NOT_CURRENTLY_SUPPORTED` | P1 | Defined supply/demand inputs and methodology | Derived-metric governance and validation |
| Price reductions and sale-to-list ratios | `SOURCE_EXISTS_NOT_ADMITTED` | P1 | List-history and closing-field rights and definitions | Event history and ratio rules |
| MoM, QoQ, YoY, rolling three- and six-month comparisons | `NOT_CURRENTLY_SUPPORTED` | P0 | Historical observations with comparable metric definitions | Time-series storage/readiness and comparison rules |
| Property-type, price-band, bedroom, and geographic segments | `NOT_CURRENTLY_SUPPORTED` | P1 | Field-level segmentation rights and minimum-sample policy | Segmentation governance and suppression rules |
| Seasonality and historical range | `NOT_CURRENTLY_SUPPORTED` | P2 | Multi-year comparable history | Statistical methodology and visual reporting design |
| Market share | `NOT_APPROPRIATE / NOT_REQUIRED` | P3 | Separate business-purpose authorization | Separate governance decision |
| Source freshness and metric definitions | `PARTIALLY_SUPPORTED` | P0 | Authoritative source documents and observation timestamps | Per-metric provenance contract |

`SOURCE_EXISTS_NOT_ADMITTED` means repository-adjacent source concepts may exist, but this artifact does not assert access, rights, current availability, permitted use, or activation authority.

## Minimum P0 Evidence Bundle

The minimum bundle that would change Market Update from a point-in-time signal display into useful professional intelligence requires, for one defined geography and property population:

1. Authoritative methodology for inventory, DOM, and price metrics: field/status scope, aggregation, price basis, geography, property population, period, exclusions, source date, and permitted use.
2. Current and comparable monthly observations for active inventory, new listings, pending activity, closed sales, median list price, median closed-sale price, and a defined DOM statistic.
3. At least one valid comparison frame: prior month, prior quarter, same period last year, or documented historical range.
4. Freshness, rights, attribution, conflict, professional-verification, and correction/retirement posture for every metric.
5. Explicit fail-closed handling for unavailable, stale, conflicting, undersampled, or semantically unresolved segments.

Until that bundle is admitted, ATLAS must not imply market direction, leverage, valuation, pricing, demand, supply, or a buyer/seller conclusion.

## Comparative Reporting Relationship

The P0 time-series and semantic-contract requirements are also foundational for `PROJECT_ATLAS_COMPARATIVE_MARKET_REPORTING_AND_EXPORT_REQUIRED`: multi-city comparisons, MoM/YoY tables, charts, print/PDF reports, and exportable reports require identical metric definitions, comparable periods, source attribution, and minimum-sample controls.

`PROJECT_ATLAS_VISUAL_ORIENTATION_AND_CAPABILITY_DIFFERENTIATION_REQUIRED` remains a separate future capability. No charts, tables, exports, or public visuals are implemented by this artifact.

## Recommended Sequence

1. Admit authoritative metric methodology and rights for the three current signals.
2. Establish a governed historical observation/readiness design with no runtime activation.
3. Certify P0 metric definition, freshness, comparison, and fail-closed behavior.
4. Authorize a separate implementation package for derived metrics and segmentation only after source and data readiness are confirmed.
5. Authorize comparative reporting/export and visual orientation separately.
