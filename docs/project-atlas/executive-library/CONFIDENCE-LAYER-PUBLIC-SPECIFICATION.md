# Market Product 3.0 Confidence Layer Public Specification

Status: `MARKET_PRODUCT_3_CONFIDENCE_LAYER_SPEC_COMPLETE`

## Purpose

The Confidence Layer tells customers how much to rely on a market interpretation and what they still need to verify.

## Required Content

- Source authority
- Freshness
- Completeness
- Limitations
- Conflicts
- Verification requirements

## Presentation

The public layer uses progressive disclosure through an accessible `details` and `summary` element. It is compact by default and available before deeper market sections.

## Trust Boundaries

- No AI
- No public GIS
- No percentages or false precision
- No opaque confidence score
- No provider activation
- No source activation
- No customer telemetry

## Evidence States

- `complete`: certified public interpretation allowed.
- `sparse`: bounded foundation interpretation only.
- `missing`: do not publish rich guidance.
- `conflict`: do not publish rich guidance until reconciled.
