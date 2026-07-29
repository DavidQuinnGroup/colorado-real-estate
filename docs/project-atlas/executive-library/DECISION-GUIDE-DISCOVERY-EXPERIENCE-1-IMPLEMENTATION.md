# Decision Guide Discovery Experience(tm) 1.0 Implementation

Status: `DECISION_GUIDE_DISCOVERY_EXPERIENCE_1_COMPLETE`

Date: July 29, 2026

## Executive Summary

Decision Guide Discovery Experience(tm) 1.0 improves public discovery of currently certified Colorado Decision Guides on the existing `/market` route. It does not create a new route, does not publish incomplete city intelligence, and does not present foundation cities as completed local-authority products.

## Customer Improvement

The market index now includes a certified-guide discovery section for:

- Boulder
- Lafayette
- Louisville

Each card connects customers to the certified city Decision Guide, market context, neighborhood paths, search continuity, and buyer/seller next steps.

## Eligibility Rule

The discovery section is driven by the Colorado Decision Guide Registry and filters for:

- `publicEligibility === true`
- `guideMaturity === 'EDITORIALLY_CERTIFIED'`
- `optionalEditorialOverride === true`

Foundation cities remain available as ordinary market pages lower in the market index. They are not marketed as completed certified guides.

## Trust Boundaries

The section explicitly preserves:

- No incomplete city promotion.
- No unsupported statewide coverage claim.
- No school or safety ranking.
- No demographic targeting.
- No AI, public GIS, telemetry, or personalization activation.
- No provider activation.
- No schema, Prisma, or persistence changes.

## Files Modified

- `app/market/page.tsx`

This record is not legal advice and does not issue final legal conclusions.
