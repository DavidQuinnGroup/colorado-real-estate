# REIE Legacy Capability Disposition MVV Certification

Status: `REIE_LEGACY_CAPABILITY_DISPOSITION_MVV_CERTIFIED`
Date: 2026-08-18

## Scope

`lib/reieLegacyCapabilityDisposition.ts` records nine legacy artifacts and
their current exact consumer evidence without deleting or refactoring code.
The register distinguishes certified-current, safe-reusable, unconsumed,
quarantined, deprecated, rewrite-required, and deletion-after-clearance
categories. No listed legacy artifact is promoted to certified public product
capability by this package.

## Consumer findings

- `lib/financialEngine.ts`, `components/MarketChart.tsx`,
  `lib/strategyGenerator.ts`, `components/maps/MarketGauge.tsx`,
  `lib/getMarketData.ts`, and `lib/marketPulse.ts` have no runtime importers
  in the inspected repository source graph.
- `lib/marketMetrics.ts` is imported only by `lib/financialEngine.ts`.
- `lib/marketAnalytics.ts` is imported only by `lib/marketPulse.ts`.
- `lib/marketData.ts` is imported by `lib/getMarketData.ts` and the internal
  read-only mapping fixture `lib/gma/readOnlyMappingPreviewFixtures.ts`.

## Boundaries

The register does not authorize public display, customer-facing use,
financing or investment conclusions, negotiation guidance, valuation claims,
provider activation, persistence, deletion, or UI changes. A future rewrite
must separately establish source, rights, freshness, evidence, compliance,
professional-review, and output-disclosure posture.

`scripts/checkReieLegacyCapabilityDisposition.ts` validates the structured
register, artifact existence, required vocabulary, and recorded consumers.

`scripts/checkReieLegacyImportConsumerSafety.ts` resolves static source imports
and fails if designated legacy artifacts are consumed by public/customer
routes, certified decision-intelligence contracts, Module 8, Grand Plan,
Buyer Financing Planner, or decision workspaces except explicit legacy-internal
edges recorded in the register.
