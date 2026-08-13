# Project Atlas SEO + AEO Authority Maturity Scorecard

Program: `PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE`

Repository baseline audited: `02e9b8576a7b22c7d25260827f2b9b587cab70da`

Disposition: `SEO_AEO_AUTHORITY_MATURITY_SCORECARD_COMPLETE`

This scorecard is documentation-only. It does not authorize implementation, provider activation, telemetry, database changes, Typesense changes, Vercel changes, MLS changes, public-page changes, metadata changes, JSON-LD changes, sitemap changes, robots changes, or deployment.

## Scoring Model

| Score | Meaning |
| --- | --- |
| 5 | Mature / strong: repository evidence shows a dependable production foundation with visible content, source/trust treatment, and appropriate machine-readable support. |
| 4 | Advanced: meaningful implementation exists, with bounded normalization or governance gaps remaining. |
| 3 | Functional / partial: useful public capability exists, but material evidence, source, freshness, schema, entity, or indexability gaps remain. |
| 2 | Early: page or concept exists but is weak as a dependable SEO/AEO authority surface. |
| 1 | Minimal: little repository evidence of current capability. |
| 0 | Absent / not established: no dependable current repository evidence. |

Scores reflect repository evidence, not aspiration or documentation-only concepts.

## Public-Surface Maturity Scorecard

| Surface | SEO maturity | AEO maturity | Source / trust maturity | Structured-data maturity | Entity / relationship maturity | Freshness maturity |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | 4 | 3 | 2 | 4 | 4 | 2 |
| Search | 4 | 3 | 3 | 4 | 3 | 3 |
| Property | 4 | 4 | 3 | 4 | 4 | 3 |
| Market | 4 | 4 | 4 | 4 | 4 | 3 |
| City | 4 | 4 | 4 | 4 | 4 | 3 |
| Neighborhood | 4 | 4 | 4 | 4 | 4 | 3 |
| Compare | 3 | 3 | 3 | 2 | 3 | 2 |
| Guides | 4 | 4 | 4 | 3 | 4 | 3 |
| Articles | 4 | 3 | 2 | 4 | 4 | 3 |
| Sources | 4 | 5 | 5 | 2 | 4 | 4 |
| Buyer | 4 | 3 | 3 | 2 | 3 | 2 |
| Seller | 4 | 3 | 3 | 2 | 3 | 2 |

## Per-Score Evidence Matrix

| Surface | SEO evidence | AEO evidence | Source / trust evidence | Structured-data evidence | Entity / relationship evidence | Freshness evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | Canonical metadata and Open Graph in `app/page.tsx`. | REIE concept, FAQ answers, and discovery paths are visible. | Trust is mostly brand/boundary language, not source-backed facts. | Tool schema and FAQ schema are emitted. | Organization/service/search/market links establish identity. | No strong route-specific evidence-effective date. |
| Search | Canonical metadata and server-rendered search route. | Search workspace answers discovery intent but not full citation intent. | Provider degradation and verification paths are visible in search components. | Tool schema and FAQ schema are emitted. | Links properties, market, buyer/seller, and comparison. | Search metadata/fallback state exists, but no normalized freshness contract. |
| Property | Dynamic metadata and canonical property URLs. | Property facts, verification prompts, and limitations are visible. | Listing/source limitations exist but not full source registry citation. | Property schema and FAQ schema are emitted. | Property, city, address, offer, and service relationships exist. | Listing update fields exist; citation-grade effective dates are not normalized. |
| Market | Canonical market hub and sitemap inclusion. | Evidence/unknowns and market readiness answers are visible. | Source-freshness cue and `/sources` paths are present. | FAQ schema is emitted. | City/neighborhood/guide/search relationships are visible. | Local source freshness exists; route-wide effective date remains partial. |
| City | Generated city metadata and canonical city market route. | Market AEO contract exposes visible answers. | Source, freshness, conflict state, and claim eligibility are modeled. | City market schema and FAQ schema are emitted. | City, state, neighborhoods, market, and guide relationships exist. | Market AEO freshness status exists; sitemap dates remain build-time. |
| Neighborhood | Generated neighborhood metadata and canonical route. | Place intelligence and verification limits are visible. | Source freshness and protected boundaries are visible. | Neighborhood/place schema is emitted. | Neighborhood, city, property, market relationships exist. | Local freshness cues exist; per-answer effective date is not universal. |
| Compare | Cross-city compare has canonical metadata; property compare is noindex. | Neutral comparison questions are visible. | No-ranking/no-scoring/customer-controlled boundaries are visible. | No strong structured-data surface for comparison. | City/property comparison relationships exist but are intentionally bounded. | Customer-selected and comparative context freshness is limited. |
| Guides | Generated guide metadata and canonical guide URLs. | Direct question/answer and visible answer blocks exist. | Evidence basis, geography, freshness, claim eligibility, and limitations are visible. | Question/Answer schema is emitted; broader schema governance remains partial. | Guide links city, market, source, and related decision context. | Period/freshness field exists, but not yet a shared answer-unit field. |
| Articles | Article metadata, canonical URL, and static params exist. | Editorial answers exist but are less evidence-bound than guides. | Source attribution is weaker than `/sources` or market AEO. | Article schema and FAQ schema are emitted. | Article, author, organization, topic, and breadcrumb nodes exist. | Published/modified dates exist, but source effective dates are weaker. |
| Sources | Canonical source route and index/follow metadata exist. | Best public provenance answer surface. | Source class, authorization, permitted use, limitations, and claim eligibility are explicit. | Dedicated source/dataset schema is not implemented. | Source records connect to source paths, jurisdictions, and REIE use. | Registry reference and source verification dates exist. |
| Buyer | Canonical metadata and index/follow robots exist. | Preparation questions, assumptions, unknowns, and handoff guidance exist. | Professional and financing boundaries are visible. | No primary structured answer schema beyond page content. | Links search, market, property, contact/advisory paths. | No route-specific evidence-effective date foundation. |
| Seller | Canonical metadata and index/follow robots exist. | Seller preparation and property evidence questions are visible. | Valuation, pricing, source activation, and professional-boundary limits are visible. | No primary structured answer schema beyond page content. | Links home worth, market, search, contact/advisory paths. | No route-specific evidence-effective date foundation. |

## Surface Evidence Notes

| Surface | Concise repository evidence |
| --- | --- |
| Homepage | `app/page.tsx` has canonical metadata, Open Graph, FAQ schema, and `WebApplication` tool schema. It is strong for discovery and identity, but has limited explicit source/freshness evidence. |
| Search | `app/search/page.tsx` has canonical metadata, Open Graph, FAQ schema, tool schema, server-side public property read, and route-to-market/property continuation. Trust/freshness is present but not a complete answer-unit model. |
| Property | `app/properties/[id]/page.tsx` generates property metadata, canonical URL, property schema, FAQ schema, verification prompts, and protected-boundary attributes. Source/freshness attribution is not yet normalized into a citation layer. |
| Market | `app/market/page.tsx` has canonical metadata, FAQ schema, source-freshness cue, market readiness evidence, certified guide discovery, and non-ranking boundaries. |
| City | `app/market/[city]/page.tsx` uses generated metadata, city market schema, FAQ schema, and `buildMarketAeoContract` with visible answers, source, freshness, conflict state, and claim eligibility. |
| Neighborhood | `app/market/[city]/[slug]/page.tsx` uses neighborhood schema, place/entity context, market/source freshness, property context, and fair-housing/protected-boundary attributes. |
| Compare | `app/compare/page.tsx` has canonical metadata and neutral city comparison boundaries. `app/properties/compare/page.tsx` is dynamic and noindex, preserving customer-controlled selection but limiting SEO/AEO publication value. |
| Guides | `app/market/[city]/guides/[slug]/page.tsx` exposes direct question/answer schema, visible answer, evidence basis, geography, period/freshness, claim eligibility, and provider/fair-housing boundaries. |
| Articles | `app/articles/[slug]/page.tsx` and `lib/articles.ts` provide article metadata, article schema, FAQ schema, author/date fields, and programmatic article generation. Source and freshness support is weaker than market/guide routes. |
| Sources | `app/sources/page.tsx` and `lib/sourceRegistry.ts` expose source registry version, reference date, source class, authorization state, permitted use, limitations, claim eligibility, and protected boundaries. |
| Buyer | `app/buy/page.tsx` has canonical metadata and extensive preparation, assumptions, unknowns, financing/professional boundaries, and telemetry/provider/scoring/ranking false markers. Structured data is not a primary foundation. |
| Seller | `app/sell/page.tsx` has canonical metadata, seller evidence and preparation boundaries, valuation/listing-price prohibitions, source-claim markers, and provider/telemetry/customer-mutation false markers. |

## Cross-Cutting Capability Scorecard

| Capability | SEO strength | AEO strength | Evidence |
| --- | ---: | ---: | --- |
| Canonical URL architecture | 4 | 3 | Most major public routes define canonical metadata; dynamic/customer-selected variants need stricter governance. |
| Metadata | 4 | 2 | Titles/descriptions/Open Graph are common; answer-specific metadata is not centralized. |
| Sitemap | 3 | 2 | `app/sitemap.ts` includes static, trust, city-market, and guide routes, but uses build-time `now` and omits normalized evidence dates. |
| Robots/crawl controls | 4 | 3 | `app/robots.ts` blocks `/admin/` and `/api/`; property compare is noindex. |
| Internal linking | 4 | 3 | Search, market, guides, sources, buyer/seller, compare, and properties cross-link naturally; no formal relationship map exists. |
| Structured data | 4 | 3 | Tool, FAQ, Article, Place/city/neighborhood, property, guide, and agent schemas exist; eligibility/parity checks are not centralized. |
| Entity identity | 4 | 3 | Organization, person, agent, service, city, neighborhood, property, guide, and source entities exist; shared answer-unit identities are missing. |
| Geographic hierarchy | 4 | 4 | State/city/neighborhood/property relationships are visible and route-backed; scale governance remains needed. |
| Evidence provenance | 3 | 4 | Source registry and market/guide evidence blocks are strong; not universal across answer-capable routes. |
| Source transparency | 3 | 5 | `/sources` is a mature trust surface; route-level source citation is not uniformly linked. |
| Freshness semantics | 3 | 3 | Source registry and market AEO freshness exist; sitemap and route families need normalized effective-date semantics. |
| Conflict handling | 2 | 4 | Market AEO explicitly handles Superior conflict/aging; not yet a shared cross-surface contract. |
| Answer extractability | 3 | 4 | Market AEO and guides have visible answer primitives; generic answer-unit serialization is not implemented. |
| Citation-worthiness | 3 | 3 | Strong ingredients exist, but final citation classifications are not implemented in code. |
| Deterministic factual synthesis | 3 | 4 | Market AEO and market-newsletter package assemble governed facts deterministically; public answer reuse is not yet implemented. |
| Author/editorial accountability | 3 | 3 | Articles and public brand identity exist; review/accountability signals vary by route family. |
| Server-rendered factual availability | 4 | 4 | Major pages are server-rendered or generated with visible factual content. |
| Duplication/thin-content controls | 2 | 2 | Some route eligibility/fail-closed behavior exists; broad scale thresholds are not codified. |
| Fair-housing/trust gates | 4 | 4 | Many routes include no-ranking/no-scoring/no-provider/no-telemetry/fair-housing boundary attributes. |
| Measurement readiness | 2 | 2 | Measurement is intentionally not implemented; future plan requires privacy/telemetry authorization. |

## Gap Register Summary

| Priority | Gap | Affected surface | Size | Risk | Recommended action |
| --- | --- | --- | --- | --- | --- |
| P0 | Shared answer-unit contract absent | Market, city, guides, articles, property | M | Medium | Implement a typed contract and deterministic inventory check first. |
| P1 | Sitemap freshness semantics are build-time oriented | Sitemap, all indexable routes | S | Low | Replace or qualify `lastModified` with route-specific modified/effective dates. |
| P1 | Source registry not uniformly linked from answer surfaces | All answer-capable pages | M | Medium | Add source-reference fields to answer units and visible citation blocks. |
| P1 | Structured-data eligibility not centrally governed | Schema-emitting routes | M | Medium | Add visible/structured parity checks before schema expansion. |
| P1 | Programmatic scale controls not codified | City, neighborhood, article, guide | L | High | Add indexable/noindex/unpublished/fail-closed thresholds and duplicate/thin checks. |
| P2 | Articles are weaker on source/freshness evidence | Articles | S | Medium | Add source/freshness evidence before further article scaling. |
| P2 | Customer-selected comparison routes are not citation surfaces | Compare/property compare | XS | Low | Preserve noindex where customer-selected and dynamic. |
| WATCH | Measurement is design-only | Platform | M | Medium | Wait for telemetry/privacy authorization. |
| WATCH | Emerging AEO files/feeds/endpoints lack clear value | Platform | S | Medium | Monitor after answer-unit foundation exists. |
| NOT_JUSTIFIED | Provider/public-record enrichment as a prerequisite | Property/source facts | XL | High | Do not depend on LightBox/ATTOM/county sources for first implementation. |

## Highest-Maturity Foundations

| Foundation | Why it matters |
| --- | --- |
| `/sources` source registry | Best current public provenance surface. It names source class, authorization state, use, limitations, claim eligibility, protected boundaries, and freshness expectations. |
| Market AEO contracts | Best current answer-unit precursor. They model geography, source, freshness, evidence state, conflict state, limitations, visible answers, and FAQ schema. |
| City orientation guides | Best direct-answer route family. They expose question, visible answer, evidence basis, geography, period/freshness, claim eligibility, and protected-boundary attributes. |
| Property schema and property pages | Strong address-level SEO foundation with property facts and verification prompts. Needs stronger source/freshness/citation normalization before broad AEO claims. |
| Buyer/seller preparation pages | Strong professional-boundary language. Needs answer-unit treatment before AEO expansion. |

## Recommended First Implementation Candidate

`BOULDER_MARKET_AEO_ANSWER_UNIT_CONTRACT_AND_QUALITY_GATE_PILOT`

Minimum valuable implementation:

- define a typed `ReieAnswerUnit` contract,
- derive one Boulder market answer-unit fixture from existing `buildMarketAeoContract` evidence,
- add a deterministic check for entity, geography, question, concise answer, source, evidence-effective date, freshness, limitations, canonical URL, public eligibility, and citation eligibility,
- preserve current public UI until separately authorized.

Out of scope:

- public page rewrites,
- sitemap/robots/metadata/JSON-LD changes,
- provider data,
- telemetry,
- database/schema changes,
- Typesense/MLS/Vercel changes,
- broad city/neighborhood scale.

## Executive Disposition

Selected disposition:

`SEO_AEO_AUTHORITY_ARCHITECTURE_COMPLETE_READY_FOR_BOUNDED_IMPLEMENTATION`

Immediate next gate:

`READY_FOR_PROJECT_ATLAS_SEO_AEO_AUTHORITY_COMPLETION_SYNCHRONIZATION`

Bounded implementation gate after synchronization:

`READY_FOR_BOUNDED_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTATION_AUTHORIZATION`
