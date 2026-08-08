# PROJECT ATLAS(TM) REIE Market Intelligence and AEO Shared Architecture

Status: `REIE_MARKET_INTELLIGENCE_AEO_SHARED_ARCHITECTURE_READY`

Scope: architecture and planning only. No customer runtime implementation, data acquisition, telemetry, provider activation, or AI content generation is authorized.

## 1. Material Gap

Certified Market, City Market, and Neighborhood journeys already provide route ownership, decision preparation, Search/Property continuity, structured data, sitemap/robots coverage, and public-trust boundaries. The remaining material gap is not a redesign: public market claims, answers, and schema lack one explicit shared contract for source identity, freshness, period, scope, limitation, stale/unavailable behavior, and claim eligibility.

This is the evidence-backed next Market Intelligence baseline and the correct foundation for AEO/editorial authority. It avoids treating SEO/AEO as generic content production.

## 2. Shared Truth Contract

Use the existing GIS Evidence and Provenance Standard concepts rather than a new evidence system. For every future public market fact, answer, FAQ, or structured-data assertion, define:

| Contract element | Required rule |
| --- | --- |
| Source identity | Identify source/dataset/publication, publisher, originating authority, version/locator, jurisdiction, and update cadence; do not treat a provider name as proof. |
| Market period | State the covered period separately from publication, acquisition, observation, and effective dates. Do not imply currentness from an undifferentiated timestamp. |
| Geographic identity | Bind the claim to its canonical city, market area, or neighborhood scope. Do not transfer facts across nearby places, aliases, or market boundaries. |
| Freshness | Reuse `UNKNOWN`, `CURRENT`, `AGING`, `STALE`, and `EXPIRED`; unknown, stale, expired, or missing freshness cannot support a current factual answer. |
| Confidence and limitations | Keep market-wide context separate from property condition, taxes, HOA, insurance, financing, title, inspection, valuation, suitability, safety, or professional conclusions. |
| Conflict and supersession | Preserve conflict; do not silently select a winner. Withdrawn, invalidated, or superseded evidence cannot be represented as current. |
| Answer/claim eligibility | A concise answer or FAQ is eligible only when its scoped source, period, freshness, permitted use, and limitation are present and public-safe. |
| Structured-data eligibility | Schema may describe the route/entity only when it matches visible, eligible content and canonical URL; it may not amplify unsupported metrics, predictions, or local claims. |
| Editorial separation | Editorial expertise, narrative, and interpretation must be labelled or kept separate from evidence-derived facts; no fabricated local expertise. |

## 3. Required Public Behaviors for a Future Implementation

- **Current eligible evidence:** display concise answer-oriented structure with scoped source/period/freshness and a route-appropriate next decision.
- **Aging evidence:** retain context only with visible aging qualification; no implied current metric.
- **Stale, expired, unavailable, unlicensed, or conflicted evidence:** fail closed to limitation and verification language; do not invent replacement facts or schema claims.
- **Scope mismatch:** no cross-city, cross-neighborhood, property-level, or customer-specific inference.

## 4. AEO and Editorial Authority

Existing assets include `app/sitemap.ts`, `app/robots.ts`, FAQ/schema helpers, route metadata, city and neighborhood schema builders, articles, internal links, and certified public routes. The remaining architecture is answer quality and eligibility—not an AI-content system.

Future AEO pages should use canonical questions, concise visible answers, evidence/freshness labels, limitation text, canonical entities/URLs, internal links to Search/Property/Buyer/Seller/Advisory paths, and schema that mirrors visible eligible content. Prohibited patterns: generic AI content farms, fabricated local expertise, unsourced factual expansion, fake reviews/testimonials, keyword stuffing, doorway pages, thin mass pages, prediction/valuation claims, and unverified local assertions.

## 5. Future Implementation Surface

Likely Market implementation surface, only after separate authorization:

- `app/market/[city]/page.tsx` and `app/market/[city]/[slug]/page.tsx`;
- `lib/marketData.ts`, `lib/marketMetrics.ts`, `lib/marketHealth.ts`, `lib/marketReport.ts`, and `lib/marketTrends.ts`;
- Market chart/stat/link components and existing FAQ/schema helpers;
- focused deterministic market/AEO source-freshness check and existing public-experience smoke coverage.

The first pilot should be one existing canonical city-market route (recommended: Boulder city market) plus only its already-certified continuity paths. It must not add providers, GIS layers, public geographic activation, new persistence, database/schema changes, telemetry, AI behavior, form/API changes, CRM/email/workers, or customer-data handling.

## 6. Recommended Sequencing

1. Approve a bounded Market/AEO implementation charter containing the shared truth contract and a single canonical city-market pilot.
2. Implement source/freshness/limitation and visible-answer/schema alignment together on that route.
3. Validate claim eligibility, canonical/structured-data consistency, responsive/accessibility behavior, existing public smoke, and protected boundaries.
4. Certify or reject before expanding to additional city or neighborhood routes.

Provider/counsel feasibility may proceed independently. No external source may enter the Market/AEO pilot without a later provider, rights, acquisition, persistence, and public-display authorization.
