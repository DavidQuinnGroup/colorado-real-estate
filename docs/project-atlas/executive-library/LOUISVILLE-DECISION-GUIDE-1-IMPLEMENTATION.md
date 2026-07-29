# PROJECT ATLAS(tm)

# Louisville Decision Guide(tm) 1.0 Implementation

Date: July 29, 2026
Status: `LOUISVILLE_DECISION_GUIDE_1_COMPLETE`

## Executive Summary

Louisville Decision Guide(tm) 1.0 extends the certified Boulder Decision Guide(tm) pattern to the Louisville city market route:

- `/market/louisville-co-housing-market`

The implementation transforms Louisville from a market-statistics-first city page into a decision-oriented city guide that explains what distinguishes Louisville, what deserves attention, what customers should verify, how neighborhood context changes the decision, and which next step is logical.

The implementation reuses existing city data, neighborhood records, market decision workspace components, financing education, journey measurement attributes, routes, SEO, structured data, and media resilience behavior. No backend architecture, APIs, Prisma schema, database, provider, AI, public GIS, telemetry, personalization, accounts, mortgage calculator, lender workflow, school ranking, safety ranking, demographic scoring, investment scoring, prediction, or recommendation engine was added.

## Louisville Product Review

Before implementation:

- Louisville had a valid city market page with market context and Market Decision Workspace content.
- Louisville identity was present, but the page did not frame Louisville as a city decision before market statistics.
- Search continuity existed lower in the page, but the first viewport did not clearly say where a customer should begin.
- Neighborhood continuity existed, but the customer had to move through market sections before reaching local Louisville neighborhood paths.
- Buyer, seller, financing, and Grand Plan continuity were present elsewhere in the platform, but not organized as a Louisville decision pathway.

## Product Improvements

The Louisville page now adds:

1. Louisville Decision Guide hero with Search Louisville Homes and Explore Louisville Neighborhoods actions.
2. Louisville Decision Summary focused on what distinguishes Louisville, what deserves attention, and what to verify.
3. Context -> Trade-offs -> Questions -> Evidence -> Next Step framework.
4. Housing Context using existing Louisville neighborhood records.
5. Practical Living Context focused on access relationships, neighborhood specificity, and research discipline.
6. Balanced Strengths And Trade-offs section.
7. Questions To Verify section.
8. Explore Louisville Neighborhoods section linking into governed Louisville neighborhood pages.
9. Market, Search, Buyer, Seller, Financing, and Grand Plan continuity links.
10. Dedicated Louisville validation contract.

## Fair Housing And Trust Review

The Louisville guide uses neutral, non-ranking, non-predictive language.

Explicitly preserved:

- No demographic targeting.
- No protected-class suitability.
- No school rankings.
- No safety rankings.
- No crime scoring.
- No lifestyle stereotypes.
- No investment recommendations.
- No appreciation predictions.
- No urgency claims.
- No unsupported local claims.

The dedicated validation check verifies Louisville guide architecture, continuity, fair-housing boundaries, and prohibited activation exclusions.

## Before / After Measurements

Representative route:

- `/market/louisville-co-housing-market`

Before production baseline:

| Viewport | Louisville Guide Hero | Market Workspace | Market Brief | Search Homes Links |
| --- | ---: | ---: | ---: | ---: |
| Desktop 1440x1100 | Not present | 664 px | 1290 px | 7142 px |
| Tablet 820x1100 | Not present | 701 px | 1465 px | 7731 px |
| Mobile 390x900 | Not present | 805 px | 1782 px | 9511 px |

After local implementation:

| Viewport | Louisville Guide Hero | Guide Summary | Guide Framework | Neighborhood Paths | Market Workspace |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop 1440x1100 | 152 px | 731 px | 1195 px | 2963 px | 3782 px |
| Tablet 820x1100 | 152 px | 768 px | 1350 px | 3284 px | 4196 px |
| Mobile 390x900 | 164 px | 885 px | 1699 px | 4287 px | 5319 px |
| Narrow mobile 360x800 | 186 px | 925 px | 1739 px | 4392 px | 5424 px |

Outcome:

- Louisville-specific decision identity and search action now appear in the first viewport.
- Market evidence remains available below the guide.
- No horizontal overflow was detected.

## Browser Review

Reviewed locally:

- `/market/louisville-co-housing-market`

Viewports:

- Desktop `1440x1100`
- Tablet `820x1100`
- Mobile `390x900`
- Narrow mobile `360x800`

Confirmed:

- Louisville Decision Guide hero, summary, framework, context, trade-offs, verification questions, neighborhood paths, and continuity links rendered.
- Search Louisville Homes CTA rendered.
- Explore Louisville Neighborhoods CTA rendered.
- Old Town Louisville neighborhood link rendered.
- Buyer guidance, seller guidance, financing guidance, and Grand Plan continuity links rendered.
- No horizontal overflow.
- No console warnings/errors.
- No broken rendered media.
- Zero rendered `media.mlsgrid.com` images.
- No fair-housing-sensitive prohibited terms detected in visible text.

Screenshot evidence:

- `/tmp/reie-louisville-decision-guide/desktop-before.png`
- `/tmp/reie-louisville-decision-guide/desktop-after.png`
- `/tmp/reie-louisville-decision-guide/tablet-before.png`
- `/tmp/reie-louisville-decision-guide/tablet-after.png`
- `/tmp/reie-louisville-decision-guide/mobile-before.png`
- `/tmp/reie-louisville-decision-guide/mobile-after.png`
- `/tmp/reie-louisville-decision-guide/narrow-mobile-after.png`

## Files Modified

- `app/market/[city]/page.tsx`
- `scripts/checkBoulderDecisionGuide.ts`
- `scripts/checkLouisvilleDecisionGuide.ts`
- `package.json`
- `tsconfig.worker.json`
- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/BOULDER-DECISION-GUIDE-1-PRODUCTION-CERTIFICATION.md`
- `docs/project-atlas/executive-library/LOUISVILLE-DECISION-GUIDE-1-IMPLEMENTATION.md`

## Validation Evidence

Passed:

- `npm run check:boulder-decision-guide`
- `npm run check:louisville-decision-guide`
- `npm run check:neighborhood-product-2`
- `npm run check:reie-market-intelligence-v8`
- `npm run check:public-trust-readiness`
- `npm run check:production-media-resilience`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `PUBLIC_EXPERIENCE_SMOKE_BASE_URL=http://localhost:3000 npm run smoke:public-experience`
- `git diff --check`
- Browser console review: zero warnings/errors on `/market/louisville-co-housing-market` across desktop, tablet, mobile, and narrow mobile.

## Remaining Opportunities

- Extract the city guide copy into a standalone data module if a third city guide is authorized.
- Add lawful, source-approved city imagery only after asset governance authorizes it.
- Add neutral commute or school-resource education only with source, freshness, and fair-housing governance.
- Add city comparison only after a governed comparison framework is authorized.

## Certification Decision

`LOUISVILLE_DECISION_GUIDE_1_COMPLETE`
