# Decision Guide Platform(tm) 1.0 Architecture

Status: `DECISION_GUIDE_PLATFORM_1_COMPLETE`

Date: July 29, 2026

## Executive Summary

Decision Guide Platform(tm) 1.0 extracts the common product architecture proven by Boulder Decision Guide(tm) 1.0, Louisville Decision Guide(tm) 1.0, and Lafayette Decision Guide(tm) 1.0 into one reusable governed platform.

This is not a new city implementation and does not redesign customer-facing city guide surfaces. The platform preserves the existing city market route, Product 2.0 visual language, Decision Guide test surfaces, Market Product(tm) 2.0 continuity, and Fair Housing trust boundaries while reducing future city guide work to city-specific knowledge, imagery, and neighborhood links.

## Platform Architecture

The reusable platform is centered in `lib/decisionGuidePlatform.ts`.

| Layer | Responsibility | Standardized Output |
| --- | --- | --- |
| City key gate | Restricts Decision Guide rendering to explicitly configured cities | `boulder`, `louisville`, `lafayette` |
| City configuration | Stores city-specific identity, housing context, practical context, trade-offs, and verification questions | Governed copy and local evidence |
| Guide builder | Combines city data, neighborhood data, and market signal into the runtime guide model | Hero, summary, context, trade-offs, questions, continuity |
| Framework constants | Defines the product sequence and trust-source labels | Context -> Trade-offs -> Questions -> Evidence -> Next Step |
| Trust boundaries | Centralizes non-activation and neutral-language safeguards | No AI, public GIS, telemetry, ranking, demographic targeting, or investment guidance |
| Continuity builder | Produces consistent downstream journey links | Market, Search, Buyer, Seller, Financing, Grand Plan |

## Decision Guide Template

Future city guides should follow this section order:

1. Hero
   - City identity statement
   - Primary market signal
   - Inventory context
   - Search city homes CTA
   - Explore city neighborhoods CTA

2. Decision Summary
   - What distinguishes the city
   - What deserves attention
   - What to verify

3. Local Authority Framework
   - Context
   - Trade-offs
   - Questions
   - Evidence
   - Next Step

4. Housing Context
   - Housing pattern
   - City or neighborhood variation
   - Condition before assumptions

5. Practical Living Context
   - Access relationships
   - Location or neighborhood specificity
   - Research discipline

6. Balanced Trade-offs
   - Strength
   - Trade-off to evaluate

7. Questions to Verify
   - Customer-facing diligence questions

8. Neighborhood Continuity
   - Governed neighborhood paths
   - Local anchors

9. Decision Journey Continuity
   - Market context
   - Search continuity
   - Buyer continuity
   - Seller continuity
   - Financing education continuity
   - Grand Plan continuity

## Reusable Components

| Component | Platform Standard |
| --- | --- |
| Hero | Uses city identity, market signal, inventory, and two CTAs without adding new backend behavior |
| Decision Summary | Three concise cards focused on distinction, attention, and verification |
| Local Authority Framework | Reusable five-step decision model: Context -> Trade-offs -> Questions -> Evidence -> Next Step |
| Housing Context | Uses city-specific housing pattern language plus neighborhood-era evidence |
| Practical Living Context | Uses neutral daily-life and access language without demographic steering |
| Balanced Trade-offs | Pairs strengths with explicit customer diligence responsibilities |
| Questions to Verify | Converts interest into property, cost, records, and advisor questions |
| Neighborhood Continuity | Uses existing governed neighborhood routes and anchors |
| Market Continuity | Keeps the customer on the city market route when needed |
| Search Continuity | Uses existing `/search?city=` flow |
| Property Continuity | Preserved through Search and neighborhood-to-property progression |
| Buyer Continuity | Links to `/buy` |
| Seller Continuity | Links to `/sell` |
| Financing Continuity | Links to `/buy#financing-confidence` without lender workflow |
| Grand Plan Continuity | Links to `/grand-plan` |

## Product Standardization

Future guides inherit these standards:

| Standard | Requirement |
| --- | --- |
| Typography | Use existing Product 2.0 uppercase headings, compact labels, and readable body copy |
| Spacing | Preserve current Market Product 2.0 section spacing and mobile rhythm |
| Section order | Do not reorder platform sections without a separate governed product decision |
| CTA placement | Primary city search CTA in hero; neighborhood CTA adjacent; journey CTAs at the continuity layer |
| Decision hierarchy | Summary before detail; interpretation before action |
| Progressive disclosure | Keep methodology and secondary detail below primary decision context |
| Mobile behavior | Single primary idea per viewport; no horizontal overflow |
| Verification prompts | Phrase as questions, not rankings, scores, promises, or urgency claims |
| Trust language | Educational, neutral, evidence-based, and non-predictive |

## Fair Housing Platform

The platform preserves neutral language and explicit prohibited patterns.

Required neutral patterns:

- Describe places through property facts, neighborhood anchors, access relationships, housing patterns, market context, and verification needs.
- Encourage customers to verify individual property facts, costs, records, disclosures, inspections, financing readiness, and advisor questions.
- Treat neighborhoods as distinct local contexts without declaring one superior.
- Explain trade-offs without steering, ranking, demographic claims, school scoring, safety scoring, or investment advice.

Prohibited patterns:

- Do not describe a city or neighborhood as the best, safest, most desirable, or appropriate for a protected class.
- Do not provide demographic recommendations.
- Do not rank schools, safety, crime, appreciation, or investment quality.
- Do not create urgency.
- Do not introduce AI, public GIS, telemetry, new providers, customer accounts, lender workflows, calculators, schema changes, Prisma changes, or API changes.

## Implementation Checklist

For a future city guide:

1. Confirm the city and neighborhoods already exist in governed repository data.
2. Add one explicit city key to the Decision Guide platform only after authorization.
3. Add city-specific identity, summary, housing context, practical context, trade-offs, and verification questions.
4. Use only existing city statistics, neighborhood records, route helpers, search routes, and journey links.
5. Preserve platform section order and CTA placement.
6. Add minimal city-specific validation using the shared Decision Guide validation contract.
7. Update the governed implementation record.
8. Run the dedicated city check, neighboring guide checks, market checks, typecheck, lint, build, public smoke, and `git diff --check`.

## Validation Checklist

The reusable validation platform verifies:

- Extracted platform builder exists.
- City guide configuration exists and is explicitly gated.
- Hero, summary, framework, context, trade-offs, questions, neighborhoods, and continuity test surfaces remain present.
- Market Product(tm) 2.0 decision surfaces remain present.
- Search, market, buyer, seller, financing education, and Grand Plan continuity remain present.
- AI, public GIS, telemetry, ranking, demographic targeting, school ranking, safety ranking, and investment recommendation flags remain false.
- Prohibited claim and activation language is absent from the route and platform source.
- `package.json` exposes the city validation script.

## Authoring Guide

Use this template for city-specific copy:

| Field | Authoring Standard |
| --- | --- |
| Identity | Explain how the city should be evaluated as a decision market |
| Distinction | Name factual local character without superiority claims |
| Attention | Identify the small set of factors customers should compare |
| Verification | Direct customers toward property facts, records, costs, financing readiness, and advisor questions |
| Housing pattern | Reference housing eras or forms from governed neighborhood data |
| Local variation | Name neighborhoods as separate contexts, not ranked choices |
| Practical living | Discuss access relationships and routes as customer-specific verification items |
| Trade-offs | Pair each strength with a diligence obligation |
| Questions | Ask neutral, evidence-seeking questions |

## Files Changed

- `lib/decisionGuidePlatform.ts`
- `app/market/[city]/page.tsx`
- `scripts/decisionGuideValidation.ts`
- `scripts/checkBoulderDecisionGuide.ts`
- `scripts/checkLouisvilleDecisionGuide.ts`
- `scripts/checkLafayetteDecisionGuide.ts`
- `tsconfig.worker.json`
- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/DECISION-GUIDE-PLATFORM-1-ARCHITECTURE.md`

## Remaining Opportunities

- Add a future city only through a separate governed implementation charter.
- Add reusable city imagery mapping if a future guide program authorizes guide-specific imagery treatment.
- Add browser-level city guide certification fixtures if the number of guides grows enough to justify route matrix automation.
