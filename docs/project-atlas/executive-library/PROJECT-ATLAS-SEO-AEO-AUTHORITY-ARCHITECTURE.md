# Project Atlas SEO + AEO Authority Architecture

Program: `PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE`

Repository baseline audited: `bf06ef8881043409a29c84a061a150ee1137b126`

Disposition: `ARCHITECTURAL_AUDIT_CAPABILITY_INVENTORY_GAP_ANALYSIS_GOVERNING_CONTRACT_AND_ROADMAP_COMPLETE`

This record is documentation-only. It does not implement public-page changes, runtime code, provider activation, telemetry, database changes, Typesense changes, Vercel changes, MLS changes, LightBox work, ATTOM work, or deployment.

The authorization attachment available to this run ended mid-sentence in the maturity-scorecard section. Because the authorized scope was clearly architectural audit, inventory, gap analysis, governing contract, and roadmap, this work was kept local and documentation-only.

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

Recommended next gate:

`READY_FOR_PROJECT_ATLAS_SEO_AEO_AUTHORITY_ARCHITECTURE_SYNCHRONIZATION`
