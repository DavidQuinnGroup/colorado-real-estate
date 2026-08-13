# Project Atlas SEO + AEO Authority Architecture

Program: `PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE`

Repository baseline audited: `02e9b8576a7b22c7d25260827f2b9b587cab70da`

Disposition: `SEO_AEO_AUTHORITY_ARCHITECTURE_COMPLETE_READY_FOR_BOUNDED_IMPLEMENTATION`

This record is documentation-only. It does not implement public-page changes, runtime code, provider activation, telemetry, database changes, Typesense changes, Vercel changes, MLS changes, LightBox work, ATTOM work, or deployment.

This completion record extends the initial architecture record that was intentionally limited when the prior authorization attachment ended mid-sentence. The completion remains architecture, audit, governance, prioritization, and roadmap only.

## Executive Model

SEO and AEO are complementary, not interchangeable.

SEO makes REIE discoverable, crawlable, canonical, internally connected, and eligible for search-result presentation.

AEO makes REIE answerable, attributable, evidence-bounded, machine-understandable, and safe for citation by answer engines.

The governing pipeline is:

`REIE EVIDENCE -> CANONICAL FACTS -> SOURCE/PROVENANCE -> FRESHNESS/EFFECTIVE DATE -> ENTITY + GEOGRAPHIC RELATIONSHIPS -> STRUCTURED ANSWER UNITS -> HUMAN-READABLE PUBLIC KNOWLEDGE -> MACHINE-READABLE SEMANTICS -> SEARCH/ANSWER DISCOVERY -> ATTRIBUTABLE/CITATION-WORTHY ANSWERS`

AEO must not be reduced to FAQ pages, keyword stuffing, AI prose, speculative answer pages, unsupported summaries, or programmatic pages without evidence/freshness/provenance.

## SEO Architecture Inventory

| Capability | Current evidence | Maturity | Gap / required control |
| --- | --- | --- | --- |
| Canonical metadata | Core pages use Next metadata and canonical URLs across home, search, buy, sell, market, compare, sources, articles, city, neighborhood, guide, and property surfaces. | Strong partial | Add an explicit inventory of canonical coverage and fail closed for future dynamic routes. |
| Robots policy | `app/robots.ts` allows public routes and disallows `/admin/` and `/api/`. | Mature | Keep admin/API exclusion enforced during future public expansion. |
| Sitemap | `app/sitemap.ts` exposes static routes, trust routes, city market routes, and orientation guides. | Partial | It uses generation-time `now` for `lastModified` and does not yet model article/property/indexable inventory with source-specific freshness. |
| Open Graph | Core editorial and market routes provide Open Graph metadata. | Strong partial | Normalize all public knowledge surfaces to the same canonical/entity model. |
| Structured data | Organization/agent, WebApplication/tool, Article, FAQPage, Place/city/neighborhood, property, and guide schemas exist. | Strong partial | Create a structured-data eligibility contract so schema is emitted only when visible content, evidence, and claim boundaries match. |
| Public source trust | `/sources` exposes registry status, source class, authorization state, freshness, permitted use, limitations, and protected boundaries. | Mature foundation | Convert the source registry into a shared citation layer for answer units. |
| Internal linking | Search, market, guide, property, buy/sell, compare, and sources link into each other with decision-oriented paths. | Strong partial | Add explicit entity relationship mapping and anchor rules for city, neighborhood, property, source, guide, and service nodes. |
| Admin exclusion | Admin routes are outside public sitemap and blocked by robots. | Mature | Maintain noindex/authorization boundaries on admin preview surfaces. |
| Programmatic scale | City, neighborhood, guide, article, and property surfaces exist or can scale. | Partial | Add indexability thresholds before broad programmatic expansion. |

## AEO Capability Inventory

| Capability | Current evidence | Maturity | Gap / required control |
| --- | --- | --- | --- |
| Evidence/provenance | `lib/sourceRegistry.ts`, `/sources`, market AEO contracts, guide evidence blocks, and public limitation language expose provenance. | Strong foundation | Centralize source IDs in answer units so each answer can cite its evidence basis. |
| Canonical facts | City, neighborhood, article, property, buyer/seller, and comparison surfaces expose facts and boundaries. | Partial | Create a canonical fact contract that separates source observations, REIE-derived calculations, and editorial interpretation. |
| Freshness/effective date | Source registry has reference dates and verification dates; market AEO contracts have freshness statuses. | Partial | Distinguish evidence effective date, source verification date, render date, and sitemap `lastModified`. |
| Entity model | Organization, agent, person, website, service, property, place, city, neighborhood, article, and question nodes exist. | Strong partial | Normalize `@id` relationships and cross-route entity references. |
| Answer units | Market AEO and orientation guides already model visible answers with question, answer, source, geography, freshness, limitations, and eligibility. | Strong partial | Generalize this contract across public knowledge surfaces. |
| Claim eligibility | Market AEO and source registry distinguish eligible, limited, conflict, unknown, and inactive evidence. | Strong partial | Add a shared claim-eligibility vocabulary and fail-closed checks. |
| Citation-worthiness | `/sources` and public guide/source links support attribution. | Partial | Require every indexable answer unit to expose source, date, limitation, and verification path. |
| Fair-housing/professional boundary | Buyer, seller, compare, guide, market, and source surfaces include explicit limits. | Strong | Convert these into a reusable AEO boundary standard. |
| Answer-engine discovery | Schema and visible answer blocks exist on several route families. | Partial | Add machine-readable answer-unit serialization only after governance is finalized. |

## Public Surface Inventory

| Surface | SEO role | AEO role | Current maturity |
| --- | --- | --- | --- |
| `/` | Primary brand and REIE entry point. | Explains the REIE concept and routes users toward search/market/property context. | Strong partial |
| `/search` | High-priority discovery route with canonical metadata and tool schema. | Describes the search workspace and directs customers toward verified property and market context. | Strong partial |
| `/properties/[id]` | Address/listing route with property metadata and property schema. | Exposes property facts, media, verification prompts, and limits. | Strong partial |
| `/market` | Colorado market hub and city/neighborhood router. | Summarizes market context with evidence and unknowns. | Strong partial |
| `/market/[city]` | City market landing and answer route. | Uses market AEO contracts with source, freshness, geography, and limitations. | Strong |
| `/market/[city]/[slug]` | Neighborhood/place intelligence route. | Connects place context, property inventory, source freshness, and limitations. | Strong partial |
| `/market/[city]/guides/[slug]` | Decision guide route. | Provides visible question/answer, source, geography, freshness, claim eligibility, and boundary attributes. | Strong |
| `/compare` | Canonical market comparison workspace. | Helps compare bounded city context without rankings or recommendations. | Strong partial |
| `/properties/compare` | Customer-controlled property comparison workspace. | Supports evidence-limited comparison of selected properties. | Partial |
| `/articles/[slug]` | Editorial/programmatic article route. | Uses Article schema and FAQs but needs stronger source/evidence attachment. | Partial |
| `/sources` | Source-trust route. | Canonical public provenance and authorization registry. | Mature foundation |
| `/buy` | Buyer preparation route. | Separates available evidence, assumptions, unknowns, and professional handoff. | Strong partial |
| `/sell` | Seller preparation route. | Separates preparation guidance, pricing-context limits, and professional handoff. | Strong partial |

## Question / Answer Intent Taxonomy

REIE answer units should classify intent before publication.

| Intent family | Example customer question | AEO treatment |
| --- | --- | --- |
| Discover | "Where should I start looking?" | Route to search, market, and place context without ranking or suitability conclusions. |
| Compare | "How do these cities or homes differ?" | Present bounded dimensions, not automated recommendations. |
| Verify | "What should I confirm before relying on this?" | Surface missing evidence, source paths, freshness, and professional review needs. |
| Interpret | "What does this market signal mean?" | Explain directionally with source/freshness limits and no forecast certainty. |
| Prepare | "What should I ask an advisor, lender, inspector, HOA, title company, or municipality?" | Produce professional handoff questions, not legal/tax/lending/inspection conclusions. |
| Attribute | "Where did this information come from?" | Link to `/sources`, source records, and route-level evidence blocks. |

## REIE Answer Unit Contract

Every indexable AEO answer unit should eventually include these fields:

| Field | Requirement |
| --- | --- |
| `id` | Stable route-local identifier. |
| `canonicalUrl` | Public canonical URL where the answer is visible. |
| `question` | Human-readable customer question. |
| `answer` | Direct bounded answer visible on the page. |
| `answerType` | Discover, compare, verify, interpret, prepare, or attribute. |
| `entityRefs` | City, neighborhood, property, source, organization, service, or guide references. |
| `geography` | State/city/neighborhood/address scope as applicable. |
| `evidenceBasis` | Source IDs, REIE-derived calculations, editorial record, or explicit unsupported state. |
| `sourceProvenance` | Public source route and source record references. |
| `effectiveDate` | Date or period represented by the evidence. |
| `sourceVerificationDate` | Last date the source or source registry entry was verified. |
| `renderedAt` | Page render/build date if needed, never a substitute for evidence freshness. |
| `freshnessStatus` | Current, aging, unknown, explicit conflict, not current, or not available. |
| `claimEligibility` | Eligible, eligible-limited, excluded, or fail-closed. |
| `limitations` | Human-readable limits and unsupported conclusions. |
| `verificationPath` | Next source or professional review path. |
| `structuredDataEligibility` | Whether schema may represent the answer. |
| `indexability` | Indexable, noindex, unpublished, or fail-closed. |

## Entity And Knowledge Graph Model

The graph should remain entity-first:

| Entity | Public role | Relationship requirements |
| --- | --- | --- |
| Organization | David Quinn Group publisher and service provider. | Owns site/service nodes and source trust presentation. |
| Person / RealEstateAgent | Professional identity and expertise node. | Links to organization, service, area served, and expertise claims. |
| Service | Real Estate Intelligence Engine. | Links to search, market, property, buyer, seller, and source surfaces. |
| State / City / Neighborhood | Geographic scope. | Links to market pages, guides, properties, sources, and limitations. |
| Property | Address/listing fact surface. | Links to location, offer/listing facts, verification prompts, and source limitations. |
| Source | Provenance and authorization record. | Links to surfaces that rely on it and exposes activation/freshness limits. |
| Article / Guide | Editorial answer surface. | Links to entity, question, source, freshness, and claim eligibility. |
| Answer Unit | Direct answer object. | Links question, answer, evidence, freshness, limitations, schema eligibility, and public route. |

## Structured Data Review

| Schema family | Status | Governance rule |
| --- | --- | --- |
| Organization / RealEstateAgent / Person / WebSite | Present | Keep as stable site-level identity graph. |
| WebApplication / tool schema | Present on home/search | Use for REIE/search tooling, not for unsupported AI claims. |
| Article | Present | Require stronger source/evidence and modified-date alignment before scaling programmatic articles. |
| FAQPage | Present | Use only where visible FAQ answers are bounded and not speculative. |
| Question / Answer | Present in orientation guides | Expand only through the answer-unit contract. |
| Place / City / Neighborhood | Present | Keep geography explicit; do not infer suitability or protected-class conclusions. |
| Property / SingleFamilyResidence | Present | Keep property facts tied to listing evidence and verification boundaries. |
| BreadcrumbList | Present in schema helpers | Keep canonical route hierarchy aligned with visible navigation. |
| Source / Dataset / ClaimReview | Not implemented | Do not add until source/citation governance defines exact public claims and evidence status. |
| llms.txt / answer feed | Not implemented | Watch category; do not publish until answer-unit governance and crawl policy are approved. |

## Citation-Worthiness Standard

An answer is citation-worthy only when all conditions hold:

- The answer is visible to humans on an indexable public route.
- The answer has a stable canonical URL.
- The answer has a named geography or entity scope.
- The evidence basis is named and distinguishable from REIE-derived interpretation.
- The source, registry record, or route-level provenance is visible or linked.
- The represented period/effective date is explicit.
- The source verification date or freshness status is explicit.
- Limitations and unsupported conclusions are visible.
- Professional-review or source-review paths are visible when the answer is not final.
- Structured data mirrors the visible answer and does not broaden the claim.

Final citation classifications:

| Classification | Required posture |
| --- | --- |
| `CITATION_READY` | Stable URL, explicit entity/geography, visible answer, visible source/provenance, evidence-effective date, current or acceptable freshness, no unresolved conflict, reproducible methodology, neutral language, and human/editorial accountability. |
| `CITATION_READY_WITH_LIMITATIONS` | Same as citation-ready, but with explicit aging, partial evidence, limited claim scope, or professional verification dependency clearly visible. |
| `NOT_CITATION_READY` | Missing source/provenance, missing freshness/effective date, unsupported or conflicting evidence, thin/duplicate content, unstable URL, hidden-only claim, speculative language, or prohibited fair-housing/professional implication. |

## Freshness And Temporal Semantics

Freshness must separate four dates:

| Date | Meaning | Current gap |
| --- | --- | --- |
| Evidence effective date | The period the fact or market signal represents. | Present on some AEO contracts, not universal. |
| Source verification date | When the source record or source page was checked. | Present in source registry, not always connected to answer units. |
| Render/build date | When the page or sitemap was generated. | Present implicitly; should not stand in for evidence freshness. |
| Content modified date | When editorial/public content changed. | Present on articles; not normalized across route families. |

The sitemap currently uses `new Date()` for `lastModified`. That is acceptable as a build signal but weak as a content-freshness signal. Future SEO/AEO implementation should replace or qualify it with route-specific effective dates where possible.

## Programmatic Scale And Indexability

Future programmatic pages should use these states:

| State | Criteria |
| --- | --- |
| `INDEXABLE` | Canonical route, visible answer, source/freshness/provenance, stable entity identity, structured-data eligibility, and no protected-boundary violation. |
| `NOINDEX` | Useful to customers but not citation-ready, personalized, customer-selected, thin, stale, or not evidence-complete. |
| `UNPUBLISHED` | Internal/admin/agent review or draft-only surface. |
| `FAIL_CLOSED` | Unsupported geography/entity, stale/conflicting evidence, missing source authority, protected boundary, or unsupported claim. |

The long-term ambition for hundreds of cities and thousands of neighborhoods must be governed by evidence depth and uniqueness. A route must not be indexable merely because a slug can be generated.

## Project Atlas AEO Authority Standard

Future material public knowledge surfaces should be evaluated against this standard.

| Requirement | Status | Notes |
| --- | --- | --- |
| Explicit question/intent | `MANDATORY` | Required for any answer-oriented surface. |
| Canonical entity identity | `MANDATORY` | Must name the entity and stable route identity. |
| Explicit geography | `MANDATORY` when geography is material | State/city/neighborhood/address scope must be visible. |
| Concise factual answer | `MANDATORY` for AEO surfaces | Must be visible to humans, not only schema. |
| Visible supporting evidence | `MANDATORY` | May be route-local evidence, source registry reference, or explicit unavailable state. |
| Source attribution | `MANDATORY` when external or registry-backed facts are used | Link or name source/provenance. |
| Evidence-effective date | `MANDATORY` when the answer depends on dated facts | Must not be replaced by render/build date. |
| Freshness state | `MANDATORY` for market/source/property facts | Current, aging, unknown, conflict, not current, or not available. |
| Conflict/limitation disclosure | `MANDATORY` when evidence is incomplete, aging, conflict-bound, or interpretation-bound | Superior-style conflict handling is the model. |
| Canonical URL | `MANDATORY` for indexable AEO | Required for citation and reproducibility. |
| Machine-readable semantics | `CONDITIONAL` | Emit only when structured data matches visible content. |
| Human-visible / structured parity | `MANDATORY` when schema is emitted | JSON-LD must not broaden the claim. |
| Stable terminology | `MANDATORY` | Use consistent source, freshness, entity, and claim terms. |
| Related entity relationships | `CONDITIONAL` | Required when relationship context improves interpretation. |
| Related questions | `CONDITIONAL` | Useful for guide/market/article surfaces; not required on every page. |
| Professional-boundary safety | `MANDATORY` | No legal, tax, lending, inspection, appraisal, valuation, or representation conclusions. |
| Fair-housing safety | `MANDATORY` | No steering, protected-class implication, demographic proxy, school/safety ranking, or suitability conclusion. |
| Citation-worthiness | `MANDATORY` for citation-targeted answers | Classify as ready, ready-with-limitations, or not-ready. |

## Project Atlas SEO Authority Standard

Future public route families should be evaluated against this standard.

| Requirement | Status | Notes |
| --- | --- | --- |
| Unique canonical URL | `MANDATORY` | One canonical route per indexable surface. |
| Unique title | `MANDATORY` | Should identify entity, geography, and value. |
| Useful meta description | `MANDATORY` | Should describe the actual page, not stuff keywords. |
| Indexability decision | `MANDATORY` | Indexable/noindex/unpublished/fail-closed. |
| Crawlability | `MANDATORY` | Robots and access must match intended visibility. |
| Sitemap eligibility | `CONDITIONAL` | Include only indexable, stable, useful pages. |
| Server-rendered meaningful content | `MANDATORY` | Search/answer systems should see useful content without private interaction. |
| Explicit entity/geography | `CONDITIONAL` | Mandatory for place, market, property, guide, and source surfaces. |
| Internal linking | `MANDATORY` | Links must reflect real semantic relationships. |
| Structured data | `CONDITIONAL` | Use where schema accurately describes visible content. |
| Author/editorial accountability | `CONDITIONAL` | Mandatory for articles, guides, advice-like education, and citation-targeted answers. |
| Source/freshness visibility | `CONDITIONAL` | Mandatory for factual, market, property, source, and answer surfaces. |
| Duplicate/thin-content protection | `MANDATORY` for programmatic surfaces | Required before city/neighborhood scale. |
| Correct HTTP status | `MANDATORY` | Missing entities must not masquerade as valid content. |
| Canonicalization | `MANDATORY` | Query/customer-selected variants need explicit treatment. |
| Mobile usability | `MANDATORY` | Existing certified public UX standards remain in force. |
| Performance awareness | `CONDITIONAL` | Required before broad template expansion or heavy schema/media additions. |

## SEO+AEO Shared Trust Gate

No public knowledge surface should pass merely because it is technically optimized.

| Trust requirement | Gate treatment |
| --- | --- |
| Factual support | Required for factual or answer claims. |
| Permitted-use support | Required when source rights or provider authorization matter. |
| Evidence provenance | Required for citation-targeted answers. |
| Freshness | Required for time-sensitive facts. |
| Geographic precision | Required for place/market/property content. |
| Neutral language | Required everywhere. |
| Conflict disclosure | Required when conflict exists or currentness is not supported. |
| Missing-data handling | Required where unavailable data might otherwise imply certainty. |
| Professional boundaries | Required for real estate, lending, valuation, legal, tax, inspection, insurance, title, and transaction content. |
| Fair-housing safety | Required everywhere. |
| Visible/structured parity | Required whenever structured data is emitted. |

## REIE Answer Unit Contract Finalization

| Field | Requirement | Notes |
| --- | --- | --- |
| `answerUnitId` | `MANDATORY` | Stable identifier, route-local or globally namespaced. |
| `question` / `intent` | `MANDATORY` | Direct user question and intent family. |
| `canonicalEntity` | `MANDATORY` | Primary entity being answered about. |
| `entityType` | `MANDATORY` | Organization, service, state, city, neighborhood, property, source, guide, article, or answer. |
| `geography` | `CONDITIONAL` | Mandatory for real estate/place/property/market answers. |
| `conciseAnswer` | `MANDATORY` | Human-visible direct answer. |
| `supportingFacts` | `MANDATORY` | Bounded factual inputs, not hidden speculation. |
| `evidenceSourceReferences` | `MANDATORY` | Source IDs, route evidence, or explicit unsupported state. |
| `evidenceEffectiveAt` | `MANDATORY` when dated | Period/date represented by the evidence. |
| `generatedAt` / `updatedAt` | `MANDATORY` | Generation/update timestamp, separate from evidence freshness. |
| `freshnessPosture` | `MANDATORY` | Current, aging, unknown, conflict, not current, or unavailable. |
| `conflictPosture` | `MANDATORY` | None, explicit conflict, unknown, or fail-closed. |
| `limitations` | `MANDATORY` | Unsupported conclusions and professional boundaries. |
| `verificationRequirements` | `MANDATORY` | Source/professional review path. |
| `canonicalUrl` | `MANDATORY` | Stable public URL if eligible for publication. |
| `semanticSchemaType` | `CONDITIONAL` | FAQPage, Question/Answer, Article, Place, Property, WebPage, or none. |
| `relatedEntities` | `CONDITIONAL` | Required when relationships materially improve interpretation. |
| `relatedQuestions` | `CONDITIONAL` | Useful on market/guide/article surfaces. |
| `publicEligibility` | `MANDATORY` | Indexable, noindex, unpublished, or fail-closed. |
| `citationEligibility` | `MANDATORY` | Citation-ready, ready-with-limitations, or not-ready. |

## Gap Register

| Gap | Surface | SEO impact | AEO impact | Trust impact | Current implementation | Missing capability | Dependency | Size | Risk | Duplication risk | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shared answer-unit contract absent | Market, city, neighborhood, guides, articles, property | Medium | High | High | Market AEO and guides have local answer-like models. | Typed shared answer unit and deterministic inventory check. | Architecture contract. | M | Medium | Low | P0 |
| Sitemap dates are build-time dates | Sitemap | Medium | Medium | Medium | `app/sitemap.ts` uses `new Date()`. | Route-specific effective/modified dates and source freshness mapping. | Answer/freshness model. | S | Low | Low | P1 |
| Source registry not uniformly cited | All answer surfaces | Low | High | High | `/sources` and source registry exist. | Shared citation/source references on answer units. | Source-reference convention. | M | Medium | Low | P1 |
| Structured-data eligibility decentralized | Schema-emitting routes | Medium | High | Medium | Per-route schema helpers exist. | Cross-surface parity/eligibility checks. | Answer unit and schema roadmap. | M | Medium | Low | P1 |
| Articles have weaker source attachment | Articles | Medium | Medium | Medium | Article schema and FAQ exist. | Visible source/freshness/evidence blocks before scaling. | Source/citation standard. | S | Medium | Medium | P2 |
| Customer-selected property compare is noindex but answer-like | Property compare | Low | Medium | Medium | Dynamic noindex workspace with boundaries. | Explicit noindex answer eligibility and structured-data non-emission rule. | Indexability threshold. | XS | Low | Low | P2 |
| Programmatic scale thresholds not codified in code | City/neighborhood/article scale | High | High | High | Documentation and some fail-closed route logic exist. | Deterministic duplicate/thin/evidence-depth checks. | Quality gates. | L | High | High | P1 |
| Measurement is design-only | Platform | Medium | Medium | Low | No telemetry authorized. | Future privacy-approved measurement plan. | Executive telemetry authorization. | M | Medium | Low | WATCH |
| llms.txt/feed/endpoints unproven | Platform | Low | Unknown | Medium | Not implemented. | Evidence of value and governance. | AEO conventions review. | S | Medium | Medium | WATCH |
| Provider public-record enrichment unavailable | Property/source facts | Low | Medium | Medium | LightBox/ATTOM pending; source registry marks status. | Provider authorization and permitted use, if future approved. | Provider response. | XL | High | Low | NOT_JUSTIFIED now |

## Structured-Data Roadmap

| Candidate | Classification | Rationale |
| --- | --- | --- |
| Organization / RealEstateAgent / Person / WebSite | `EXISTING_SUFFICIENT` | Stable identity graph already exists. |
| WebApplication / Search tool | `EXISTING_SUFFICIENT` | Home/search tool schema is useful and visible-aligned. |
| Market Question/Answer units | `IMPLEMENT_NOW_CANDIDATE` | Market AEO contracts already provide visible questions, answers, source, freshness, and limitations. |
| City orientation guide Question/Answer | `IMPLEMENT_NOW_CANDIDATE` | Guides already expose visible answers and evidence fields. |
| Place / City / Neighborhood | `LATER` | Existing schema is strong; prioritize answer-unit governance first. |
| Property / SingleFamilyResidence | `LATER` | Property schema exists; source/freshness citation normalization should precede expansion. |
| Article | `LATER` | Article schema exists; source/freshness attachment needs improvement before scale. |
| FAQPage expansion | `REQUIRES_POLICY_REVIEW` | FAQ schema must not become answer stuffing. |
| Dataset / Source metadata | `REQUIRES_POLICY_REVIEW` | Useful for `/sources`, but claim and permitted-use semantics must be exact. |
| ClaimReview | `NOT_APPROPRIATE` | REIE is not currently operating as a public fact-checking publisher. |
| llms.txt / answer feeds / endpoints | `LATER` or `WATCH` | Do not publish without clear value, governance, and parity checks. |

## Entity / Internal-Link Authority Roadmap

| Relationship | Priority | Rule |
| --- | --- | --- |
| State -> City -> Neighborhood -> Property | P1 | Use genuine geography containment and visible routes only. |
| City <-> Market | P1 | City market pages should remain canonical market authority. |
| City <-> Guides | P1 | Link guides to city market context and back to related questions. |
| Neighborhood <-> Market | P2 | Strengthen only where neighborhood identity is canonical and useful. |
| Property <-> Neighborhood <-> City | P2 | Link only when property geography is reliable. |
| Market <-> Articles | P2 | Link when article topic genuinely supports market interpretation. |
| Fact / Answer <-> Source | P0 | Every citation-targeted answer needs source linkage. |
| Guide <-> Related Questions | P2 | Use semantically adjacent questions, not artificial link volume. |

No artificial link farms, doorway pages, or keyword-only relationship blocks are justified.

## Market / Newsletter Package Reuse Disposition

| Component | Classification | Reuse posture |
| --- | --- | --- |
| Market metrics assembled from governed city data | `REUSABLE_PUBLIC_FACT_PRIMITIVE` | Reuse only after answer-unit source/freshness mapping. |
| Source references | `REUSABLE_SOURCE_FRESHNESS_PRIMITIVE` | Useful for future citation blocks. |
| Evidence effective date | `REUSABLE_SOURCE_FRESHNESS_PRIMITIVE` | Good model for separating package generation from evidence date. |
| Review flags | `REUSABLE_REVIEW_FLAG` | Useful for fail-closed answer eligibility. |
| Agent talking point inputs | `AGENT_ONLY` | Not public without editorial transformation. |
| Customer education inputs | `REQUIRES_TRANSFORMATION` | Can inform public copy after review and source alignment. |
| Protected admin preview | `NOT_PUBLIC` | Must remain protected; do not expose package UI. |
| Email/scheduler/customer communication flags | `NOT_PUBLIC` | Preserve as non-activation boundaries. |

Deterministic market fact assembly can reduce duplication in future Market AEO work, but only by reusing source/freshness/fact primitives. It must not publish agent-review material directly.

## Technical AEO Conventions

| Mechanism | Classification | Reason |
| --- | --- | --- |
| Shared in-repo answer-unit contract | `RECOMMENDED_NOW` | High value, testable, no provider/telemetry dependency. |
| Deterministic answer-unit inventory check | `RECOMMENDED_NOW` | Prevents schema/content drift before public implementation. |
| Route-local public JSON embedded in HTML | `WATCH` | Could help extraction, but risks hidden-claim drift. |
| `llms.txt` | `WATCH` | Category is emerging; no clear current need without answer-unit governance. |
| Answer-specific feeds | `WATCH` | Potential value after answer inventory exists. |
| Public answer-unit endpoints | `NOT_JUSTIFIED` | Adds API surface and maintenance risk before demand is proven. |
| Alternate machine-readable pages | `WATCH` | Consider only with strict visible parity. |
| Additional XML feeds | `NOT_JUSTIFIED` | Sitemap is sufficient until scale requirements are clearer. |
| Source metadata endpoints | `WATCH` | Potentially useful after source policy review; no endpoint now. |

## Quality / Certification Gates

| Gate | Deterministic checks to define |
| --- | --- |
| `SEO_GATE` | Canonical, unique metadata, robots, sitemap eligibility, indexability, duplicate/thin checks, internal links, structured-data validity, status-code expectations, mobile certification. |
| `AEO_GATE` | Answer unit, explicit entity, explicit geography, concise factual answer, evidence-effective date, source references, semantic structure, visible/structured parity, citation eligibility. |
| `SHARED_TRUST_GATE` | Evidence support, freshness, conflict handling, permitted use, fair-housing safety, professional boundaries, no unsupported superlatives, no fabricated claims. |

## Measurement Roadmap

No telemetry or analytics implementation is authorized.

| Measurement area | Existing/non-invasive path | Requires future authorization |
| --- | --- | --- |
| Crawl/index health | Search Console or external manual review, if already available to operators. | Automated reporting ingestion. |
| Impressions/ranking/query coverage | Manual Search Console export or operator review. | Analytics/Search Console API integration. |
| Organic traffic | Existing analytics only if already authorized by Executive HQ. | New analytics, cookies, event tracking, or telemetry. |
| Page performance | Local Lighthouse/manual build diagnostics. | Production monitoring integration. |
| Answer-engine citation visibility | Manual spot checks and documented screenshots. | Automated monitoring or scraping. |
| Question coverage | Repository inventory check. | Search/referral intent telemetry. |
| Extraction accuracy | Local schema/DOM checks. | Third-party answer-engine monitoring. |
| Citation/source correctness | Manual or deterministic route checks. | Provider/source monitoring integration. |

## Implementation Waves

| Wave | Objective | Surfaces | Size | Dependencies | Protected systems | Checks | Deployment/certification gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Wave 1 | Foundation contracts and quality gates | Docs, types/check scripts only | M | This architecture | No runtime/provider/telemetry | Contract, route inventory, diff check | Local certification, then sync |
| Wave 2 | Market pilot | Boulder market route and market AEO contract | M | Wave 1 | No provider/telemetry/database | SEO/AEO/shared trust gates | Public-route certification after explicit implementation authorization |
| Wave 3 | City pilot | One additional certified city route | S | Wave 2 | No provider/telemetry/database | Same as Wave 2 plus duplication check | Production certification |
| Wave 4 | Neighborhood pilot | One canonical neighborhood route | M | Wave 1 and source/freshness mapping | No GIS/provider activation | Place/entity/fair-housing checks | Production certification |
| Wave 5 | Property/source semantics | Property detail and `/sources` linkage | L | Source/citation contract | No LightBox/ATTOM unless separately authorized | Property/source parity checks | Separate protected approval |
| Wave 6 | Scale/internal authority | Broader city/neighborhood/link graph | XL | Proven pilots and scale thresholds | No artificial link farms | Duplicate/thin/freshness checks | Phased certification |
| Wave 7 | Measurement/optimization | Reporting only | M | Privacy/measurement authorization | Telemetry remains off unless approved | Measurement governance checks | Separate telemetry gate |

## Recommended First Implementation

Recommended candidate: `BOULDER_MARKET_AEO_ANSWER_UNIT_CONTRACT_AND_QUALITY_GATE_PILOT`

Rationale:

- Boulder market architecture already has certified Market AEO foundations.
- It can materially improve source/freshness/citation governance without broad public churn.
- It is independently testable through a deterministic answer-unit inventory check.
- It does not depend on LightBox, ATTOM, county-source activation, telemetry, database schema changes, Typesense changes, MLS changes, or provider credentials.
- It preserves customer-facing behavior if initially implemented as a contract/check layer before visible UI changes.

Minimum valuable SEO+AEO implementation:

| In scope | Out of scope |
| --- | --- |
| Typed `ReieAnswerUnit` contract for market answers. | Broad public-page rewrite. |
| Boulder market answer-unit fixture derived from existing market AEO contract. | New provider data. |
| Deterministic check for question, entity, geography, source, freshness, limitation, canonical URL, schema eligibility, and citation eligibility. | Telemetry or analytics. |
| Documentation update and local certification. | Sitemap, robots, metadata, JSON-LD, or public UI changes unless separately authorized. |
| Follow-on recommendation for visible route integration. | Scaling to 500+ cities or 10,000 neighborhoods. |

## Provider Independence

This architecture and the recommended first implementation do not depend on LightBox, ATTOM, county sources, public-record retrieval, provider credentials, MLS changes, Typesense changes, or Vercel changes.

Provider statuses remain:

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed by PROJECT ATLAS: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Human / Fair-Housing / Professional Boundary

AEO does not relax any REIE trust boundary.

The following remain prohibited:

- demographic steering,
- protected-class implications,
- desirability rankings,
- safety rankings,
- school quality rankings,
- suitability conclusions,
- appreciation prediction,
- investment-return prediction,
- valuation certainty,
- legal/tax/lending conclusions,
- fabricated expertise,
- unsupported superlatives.

## Market Newsletter Reuse

The market newsletter agent review package is an internal review asset, not a public SEO/AEO surface.

It is still useful as architecture because it packages:

- reusable market facts,
- source references,
- freshness status,
- review flags,
- agent approval requirements,
- unsupported-geography fail-closed behavior.

Future reuse should be limited to the answer-unit/evidence layer. It must not become autonomous customer communication, email scheduling, CRM mutation, telemetry, provider activation, or public publication without separate authorization.

## SEO + AEO Quality Gates

| Gate | Required evidence |
| --- | --- |
| `SEO_CANONICAL_GATE` | Canonical URL, indexability decision, metadata, sitemap inclusion or exclusion, and internal-link path. |
| `AEO_ANSWER_UNIT_GATE` | Question, answer, entity, geography, source, freshness, limitations, claim eligibility, and verification path. |
| `STRUCTURED_DATA_ALIGNMENT_GATE` | JSON-LD mirrors visible content and does not broaden the claim. |
| `SOURCE_PROVENANCE_GATE` | Source registry or visible source basis exists and authorization state is clear. |
| `FAIR_HOUSING_TRUST_GATE` | No protected-class inference, suitability conclusion, steering, ranking, investment certainty, valuation certainty, lending/legal/tax conclusion, or unsupported professional claim. |
| `PROGRAMMATIC_SCALE_GATE` | Duplicate/thin/stale/conflicting pages fail closed or noindex. |
| `MEASUREMENT_GATE` | Only after explicit telemetry/analytics authorization. |

## Measurement Model

No telemetry or analytics implementation is authorized by this record.

Future measurement should distinguish:

- organic search discovery,
- answer-engine citation/referral discovery,
- canonical route impressions,
- source-route engagement,
- answer-unit extraction success,
- zero-click/citation presence where observable,
- customer continuation quality,
- protected-boundary violations,
- stale or noindex fail-closed events.

## Roadmap

1. Governing contract and scorecard documentation.
2. Shared answer-unit type and route inventory check.
3. Source/freshness/citation fields wired into answer-capable route families.
4. Sitemap and `lastModified` semantics corrected around evidence effective dates.
5. Structured-data eligibility checks added for FAQ, article, guide, market, place, property, and source-adjacent surfaces.
6. Programmatic scale rules for indexable/noindex/unpublished/fail-closed surfaces.
7. Public implementation wave for the highest-maturity answer surfaces only.
8. Measurement plan after explicit telemetry authorization.

## Protected-System Confirmation

This record did not:

- activate providers,
- retrieve credentials,
- call LightBox,
- investigate or call ATTOM,
- call county/GIS/public-record providers,
- modify runtime application code,
- modify database schema or data,
- modify Typesense,
- modify MLS,
- modify Vercel,
- deploy,
- add telemetry,
- mutate customer data,
- start email, queue, worker, scheduler, CRM, or notification systems.

## Next Gate

Immediate next gate:

`READY_FOR_PROJECT_ATLAS_SEO_AEO_AUTHORITY_COMPLETION_SYNCHRONIZATION`

Bounded implementation gate after synchronization:

`READY_FOR_BOUNDED_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTATION_AUTHORIZATION`
