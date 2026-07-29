# Market Product 3.0 Market Report Composition Specification

Status: `MARKET_PRODUCT_3_REPORT_COMPOSITION_SPEC_COMPLETE`

## Purpose

Market Report Composition standardizes the order of public market explanation so customers understand the decision context before dense statistics.

## Required Sequence

1. One-sentence market story
2. What changed or an explicit no-change-claim boundary
3. Why it matters
4. Market Pulse
5. Evidence
6. Buyer interpretation
7. Seller interpretation
8. Local variation
9. Confidence and freshness
10. What to verify
11. Next exploration

## Current Implementation

The sequence is implemented through `components/MarketProduct3VisualIntelligence.tsx` and deterministic data from `lib/marketProduct3.ts`.

## Boundaries

- No AI
- No public GIS
- No forecasting
- No automated valuation
- No mortgage calculator
- No lender workflow
- No provider activation
