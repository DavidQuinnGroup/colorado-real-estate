# Market Product 3.0 Market Pulse Public Specification

Status: `MARKET_PRODUCT_3_MARKET_PULSE_SPEC_COMPLETE`

## Purpose

Market Pulse turns existing market facts into a readable decision signal. It is not a prediction, recommendation engine, ranking, valuation, or investment model.

## Required Fields

- Condition
- Observed direction
- Period
- Exact evidence values
- Plain-language interpretation
- Buyer interpretation
- Seller interpretation
- Verification prompt

## Public Rules

- Use governed repository data only.
- Separate condition from direction.
- Preserve exact values.
- State when period-over-period movement is unavailable.
- Keep rich interpretation to certified cities.
- Use sparse-state copy for foundation cities.

## Prohibited

- No AI
- No public GIS
- No forecasting
- No appreciation claims
- No urgency claims
- No school ranking
- No safety or crime claims
- No source/provider activation

## Current Activation

- `/market`: statewide discovery pulse.
- `/market/boulder-co-housing-market`: complete city pulse.
- `/market/lafayette-co-housing-market`: complete city pulse.
- `/market/louisville-co-housing-market`: complete city pulse.
- Foundation city routes: sparse bounded pulse.
