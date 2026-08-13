# Project Atlas SEO + AEO Authority Maturity Scorecard

Program: `PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE`

Repository baseline audited: `bf06ef8881043409a29c84a061a150ee1137b126`

Disposition: `SEO_AEO_AUTHORITY_MATURITY_SCORECARD_COMPLETE`

This scorecard is documentation-only. It does not authorize implementation, provider activation, telemetry, database changes, Typesense changes, Vercel changes, MLS changes, or deployment.

## Scoring Model

| Score | Meaning |
| --- | --- |
| 5 | Mature: production-ready foundation with visible evidence, canonical routing, freshness/provenance, bounded claims, and machine-readable alignment. |
| 4 | Strong partial: meaningful implementation exists, but normalization or cross-surface governance is still required. |
| 3 | Partial: useful surface exists, but evidence, structured data, freshness, entity linkage, or indexability controls are incomplete. |
| 2 | Minimal: public page exists but is not yet a dependable SEO/AEO answer surface. |
| 1 | Absent or unknown: no dependable current evidence in the audited repository surface. |

## Surface Scorecard

| Surface | SEO | AEO | Source trust | Structured data | Entity graph | Freshness | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Homepage | 4 | 3 | 2 | 4 | 4 | 2 | Strong partial |
| Search | 4 | 3 | 3 | 4 | 3 | 3 | Strong partial |
| Property detail | 4 | 4 | 3 | 4 | 4 | 3 | Strong partial |
| Market hub | 4 | 4 | 4 | 4 | 4 | 3 | Strong partial |
| City market | 4 | 4 | 4 | 4 | 4 | 3 | Strong |
| Neighborhood market | 4 | 4 | 4 | 4 | 4 | 3 | Strong partial |
| City orientation guides | 4 | 4 | 4 | 3 | 4 | 3 | Strong partial |
| Cross-city compare | 4 | 3 | 3 | 2 | 3 | 2 | Partial |
| Property compare | 3 | 3 | 3 | 2 | 3 | 2 | Partial |
| Articles | 4 | 3 | 2 | 4 | 4 | 3 | Partial |
| Sources | 4 | 5 | 5 | 2 | 4 | 4 | Mature foundation |
| Buyer | 4 | 3 | 3 | 2 | 3 | 2 | Partial |
| Seller | 4 | 3 | 3 | 2 | 3 | 2 | Partial |

## Highest-Maturity Foundations

| Foundation | Why it matters |
| --- | --- |
| `/sources` source registry | Best current public provenance surface. It names source class, authorization state, use, limitations, and freshness expectations. |
| Market AEO contracts | Best current answer-unit precursor. They model geography, source, freshness, evidence state, conflict state, limitations, visible answers, and FAQ schema. |
| City orientation guides | Best current direct-answer public route family. They expose question, visible answer, evidence basis, geography, period/freshness, claim eligibility, and protected-boundary attributes. |
| Property schema and property pages | Strong address-level SEO foundation with property facts and verification prompts. Needs stronger source/freshness/citation normalization before broad AEO claims. |
| Buyer/seller preparation pages | Strong professional-boundary language. Needs shared structured answer-unit treatment before AEO expansion. |

## Highest-Priority Gaps

| Priority | Gap | Recommended next control |
| --- | --- | --- |
| 1 | No shared answer-unit contract across route families. | Add a typed `ReieAnswerUnit` contract and route inventory check. |
| 2 | Sitemap `lastModified` uses render/build time. | Add route-specific effective dates or explicitly classify generated dates as build metadata. |
| 3 | Source registry is not yet linked as a uniform citation layer from every answer-capable surface. | Add source-reference fields and public source links to answer units. |
| 4 | Structured-data eligibility is route-specific, not centrally governed. | Add deterministic checks to prevent schema claims from exceeding visible content. |
| 5 | Programmatic article and guide scale can create thin or weakly sourced answers if not gated. | Add indexable/noindex/unpublished/fail-closed thresholds before expansion. |
| 6 | Measurement is not authorized and not implemented. | Define measurement only; implement after telemetry authorization. |

## Route-Family Recommendations

| Route family | Recommendation |
| --- | --- |
| Home/search | Keep as discovery/navigation surfaces. Do not overload them with broad answer claims. |
| Property | Preserve listing/property facts and verification prompts. Add source/freshness/citation normalization before citation-focused AEO expansion. |
| Market/city/neighborhood | Treat as the first public AEO implementation family because market AEO contracts already exist. |
| City orientation guides | Treat as the first direct-answer route family for answer-unit extraction once the shared contract exists. |
| Compare | Keep non-ranking, non-suitability, and customer-controlled boundaries explicit; noindex dynamic customer-selected variants if needed. |
| Articles | Tighten source/citation requirements before further programmatic scale. |
| Sources | Promote as the canonical citation/provenance hub. Consider structured source semantics only after claim governance is approved. |
| Buyer/seller | Keep professional preparation and boundary language; add answer units only for bounded preparation questions. |

## AEO Readiness Rules

An answer surface should not be treated as AEO-ready unless it has:

- a visible answer,
- a canonical URL,
- a named entity/geography scope,
- a source/evidence basis,
- a freshness or effective-date statement,
- a limitation statement,
- a verification path,
- structured data alignment,
- a fair-housing/professional-boundary pass,
- an indexability decision.

## Current Overall Assessment

Project Atlas has a stronger-than-average foundation for SEO and AEO because it already contains public source transparency, market AEO contracts, visible evidence/unknowns language, structured data helpers, canonical routes, and protected-boundary copy.

The main risk is not absence of SEO/AEO primitives. The main risk is scaling answerable content before source/freshness/citation/claim-eligibility governance is centralized.

Recommended next gate:

`READY_FOR_PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE_SYNCHRONIZATION`
