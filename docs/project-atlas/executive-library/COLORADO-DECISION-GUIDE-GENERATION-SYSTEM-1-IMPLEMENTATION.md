# Colorado Decision Guide Generation System(tm) 1.0 Implementation

Status: `COLORADO_DECISION_GUIDE_GENERATION_SYSTEM_1_COMPLETE`

Date: July 29, 2026

## Executive Summary

Colorado Decision Guide Generation System(tm) 1.0 extends Decision Guide Platform(tm) 1.0 from explicit Boulder/Louisville/Lafayette gating into a governed registry-driven generation system.

The system does not create speculative city content and does not add another manually-authored city guide. It combines the reusable Decision Guide Platform, a Colorado City Registry, governed repository-local sources, optional editorial overrides, and deterministic eligibility rules to generate public Decision Guide foundations only where minimum quality thresholds are met.

No production deployment, push, schema change, Prisma change, API change, provider activation, AI activation, public GIS activation, telemetry activation, personalization, customer account feature, calculator, or lender workflow was performed.

## Architecture

| Layer | File | Responsibility |
| --- | --- | --- |
| Colorado City Registry | `lib/coloradoDecisionGuideRegistry.ts` | Maintains a governed city snapshot reconciled from repository-local city, search, content, and neighborhood sources |
| Decision Guide Platform | `lib/decisionGuidePlatform.ts` | Generates editorial, evidence-backed, and foundation guide models |
| City Market Route | `app/market/[city]/page.tsx` | Renders generated guides when registry eligibility passes; fails closed otherwise |
| Sitemap Discovery | `app/sitemap.ts` | Includes publicly eligible generated city guide market routes only |
| Validation Platform | `scripts/checkColoradoDecisionGuideGenerationSystem.ts` | Verifies registry integrity, eligibility, maturity, fail-closed behavior, and content safety |

## Registry Model

Each registry entry exposes:

- Canonical city name
- Route slug
- State
- Search value
- Market route
- Neighborhood availability
- Listing/search availability
- Market-data availability
- Knowledge-source availability
- Imagery availability
- Guide maturity
- Public eligibility
- Freshness
- Optional editorial override status
- Eligibility reasons
- Ineligibility reasons

The registry currently resolves 15 city records from existing repository sources. It is self-contained for runtime stability, and the validation harness reconciles every governed city entry against the city-market source data.

## Guide Maturity Model

| Maturity | Meaning | Public Behavior |
| --- | --- | --- |
| `FOUNDATION` | Governed city market data plus search continuity support standard bounded guide language | Public only when minimum route/search/market requirements pass |
| `EVIDENCE_BACKED` | Repository contains neighborhood and search evidence, but public route/data requirements may still be incomplete | Public only when all eligibility requirements pass |
| `EDITORIALLY_CERTIFIED` | Existing reviewed Boulder/Louisville/Lafayette overrides with richer local-authority content | Public when route/search/market requirements pass |

## Eligibility Rules

A public generated Decision Guide requires:

1. Canonical content city availability.
2. Valid Colorado route identity.
3. Existing market route.
4. Search/listing city support.
5. Governed city market data.
6. Knowledge-source availability.
7. Empty ineligibility reasons.
8. Active platform trust boundaries.

When any minimum requirement is absent, `buildDecisionGuide` returns `null` and the route falls back to the existing market experience without a public Decision Guide.

## Generated-City Coverage

Validation evidence:

- Registry city count: 15
- Public eligible generated guides: 7
- Deferred or ineligible registry entries: 8
- Representative editorially certified guide: present
- Representative evidence-backed registry entry: present
- Representative foundation guide: generated successfully
- Representative ineligible market city: fails closed

Public eligibility is intentionally limited to avoid thin, unsupported statewide publication.

## Publication Safeguards

The generated foundation copy is bounded and transparent:

- It identifies foundation maturity.
- It uses only governed city-market data and standard verification language.
- It avoids unsupported city-specific interpretation.
- It directs customers toward property facts, records, disclosures, condition, costs, financing preparation, and advisor questions.

Prohibited content remains blocked:

- Demographic profiles
- Protected-class suitability
- School rankings
- Safety rankings
- Crime scoring
- Lifestyle stereotypes
- Investment recommendations
- Appreciation predictions
- Unsupported trade-offs
- Fabricated local knowledge
- Urgency claims

## Editorial Override Model

Optional editorial overrides remain additive. Boulder, Louisville, and Lafayette preserve their reviewed guide copy and richer local-authority sections through `DECISION_GUIDE_CITY_CONFIGS`.

Future city overrides should be added only when separately authorized and when repository evidence supports local housing context, practical context, balanced trade-offs, verification prompts, and evidence references.

## Sitemap and Discovery

`app/sitemap.ts` now uses `getPublicDecisionGuideRegistryEntries()` so discovery follows guide eligibility. Existing market routes still exist, but generated guide sitemap inclusion is limited to public eligible entries.

## Validation Evidence

Passed:

- `npm run check:colorado-decision-guide-generation-system`
- `npm run check:boulder-decision-guide`
- `npm run check:louisville-decision-guide`
- `npm run check:lafayette-decision-guide`

Additional full validation is recorded in the final implementation response.

## Remaining Opportunities

- Add city-specific editorial overrides only through future governed city-guide implementation programs.
- Add an approved imagery registry if future publication standards require city-specific visual eligibility.
- Add browser route-matrix automation if generated guide coverage expands materially.
- Add richer evidence-backed guides only when repository-local knowledge reaches a certified threshold.
