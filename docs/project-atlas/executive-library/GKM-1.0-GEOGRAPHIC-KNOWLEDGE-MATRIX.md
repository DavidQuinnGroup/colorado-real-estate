# PROJECT ATLAS(tm)

## Geographic Knowledge Matrix(tm) - GKM 1.0

### Existing Geographic Knowledge Inventory And Classification

Status: `GKM_1.0_EXISTING_KNOWLEDGE_INVENTORY_CERTIFIED_AND_CLOSED`

Assessment date: July 25, 2026

Repository baseline: `e9c2e66b1f96a030e6353c7b40d41a86e68bcb88`

Assessment scope: read-only repository and source-classification assessment

Runtime activation status: `NOT_AUTHORIZED`

Production data status: `NO_GIO_DATA_INSERTED`

Persistence authorization: `NOT_AUTHORIZED`

---

## 1. Executive Summary

GKM 1.0 inventories the existing geographic knowledge already present in the repository and classifies it against the approved GIO and GKC governance standards. The current repository contains meaningful place knowledge, but that knowledge is distributed across static registries, runtime property fields, search filters, map components, market pages, SEO schema modules, internal-link helpers, article generators, MLS normalization, and dormant GIO/GKC governance modules.

The inventory confirms that the highest-confidence future starting point is not broad public activation. The smallest safe next step is a fixture-only and then isolated internal-development mapping of existing municipality, neighborhood, market-area, ZIP-code, subdivision, and property-to-place candidates with all eligibility flags remaining false by default.

This assessment made no Prisma schema changes, created no migrations, inserted no GIO records, mapped no production records, modified no search or map behavior, changed no customer-facing route, activated no GIO read path, connected no vendor, and changed no public SEO behavior.

Certification recommendation:

- `GKM_1.0_EXISTING_KNOWLEDGE_INVENTORY_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GKM_1.0_INTERNAL_DEVELOPMENT_MAPPING_PLAN`

That next authorization should remain non-production and should produce a deterministic mapping plan before any persistence package is considered.

---

## 2. Matrix Methodology

Evidence sources reviewed:

- Repository source files under `app`, `components`, `data`, `lib`, `prisma`, `scripts`, and `docs`.
- Prisma schema and migration history for `Property`, legacy `City` and `Neighborhood`, GIO models, enums, indexes, and foreign keys.
- Current static geography registries, market fixtures, knowledge graph fixtures, search/page registries, polygon fixtures, and schema.org builders.
- Current public runtime geography paths: search, geocode, map, property, market, sitemap, internal links, and structured data.
- Local executive records for GIO Waves 1-4, GKC 1.0 architecture, GKC fixture governance validation, and the Geographic Intelligence Program Roadmap.
- Google Drive source references found and read through the connected Drive integration:
  - `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1`
  - `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS`
  - `PROJECT ATLAS - REAL ESTATE DATA TOOLS`
  - `PROJECT ATLAS - Geographic Intelligence System(tm) Vision`
  - `PROJECT ATLAS - Enterprise Geographic Taxonomy(tm) (EGT 1.0)`
  - `PROJECT ATLAS(tm) Geographic Intelligence Objects(tm)`
  - `BOOK 6 - The REIE Knowledge Graph(tm)`

Classification dimensions:

- Identity, repository location, data structure, and known steward.
- Applicable GIO object type.
- Intelligence domain.
- GKC classification.
- Source status, authority, license posture, freshness, effective date, verification, and conflict state.
- Future disposition.
- Activation eligibility.

Default activation rule:

- All current assets are `NOT_APPROVED` for GIO persistence, search, map, public page, indexing, property enrichment, market analytics, and customer presentation unless a later gate explicitly approves that use.

---

## 3. Current Geographic Knowledge Inventory

| Asset | Repository location | Data structure | Current use | GIO object type | Domain | GKC classification | Source status | Future disposition | Activation eligibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primary city authority registry | `lib/cities.ts` | 13 records with name, slug, market slug, and market stats | Market pages, sitemap, homepage, internal links, property-card market links | `MUNICIPALITY`, `MARKET_AREA` | Market, Editorial | `PROVISIONAL_KNOWLEDGE` for facts; `EDITORIAL_KNOWLEDGE` for framing | First-party static; no per-field source, effective date, or license metadata | `PERSIST_AS_OBJECT_IDENTITY`, `PERSIST_AS_OBSERVATION`, `REQUIRES_SOURCE_UPGRADE` | Fixture only after mapping review; no public GIO activation |
| Legacy city list | `data/cities.ts` | 12 records with slug, name, county | Older programmatic content support | `MUNICIPALITY`; future county reference | Government, Editorial | `PROVISIONAL_KNOWLEDGE` | First-party static; county names unsourced | `PERSIST_AS_OBJECT_IDENTITY`, `REQUIRES_SOURCE_UPGRADE`, `REQUIRES_REDESIGN` | Fixture only; not public-eligible as authoritative county mapping |
| Primary neighborhood authority registry | `lib/neighborhoods.ts` | 22 records with slug, city, lifestyle, anchor, resilience, risk, insurance, efficiency, era, altitude, soil, construction, tactical notes | Neighborhood pages, market pages, strategy generation, article generation, internal links | `NEIGHBORHOOD`, some `SUBDIVISION` candidates | Lifestyle, Market, Environmental and Risk, Construction and Permits, Editorial | `EDITORIAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION`, `RESTRICTED_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | First-party static; no cited authoritative sources; sensitive risk fields lack trust review | `PERSIST_AS_OBJECT_IDENTITY`, `RETAIN_AS_EDITORIAL_CONTENT`, `REQUIRES_SOURCE_UPGRADE`, `REQUIRES_TRUST_REVIEW` | Fixture identity only; no public GIO facts or risk activation |
| Legacy neighborhood fixtures | `data/neighborhoods.ts` | 2 records with slug, city, median price, description, lat/lng, nearby | Legacy/static content support | `NEIGHBORHOOD` | Market, Lifestyle, Relationship | `PROVISIONAL_KNOWLEDGE` | First-party static; duplicate with `lib/neighborhoods.ts`; no source metadata | `REQUIRES_REDESIGN`, `PERSIST_AS_ALIAS`, `DEFER` | Not approved except conflict analysis |
| Neighborhood polygon fixtures | `lib/neighborhoodPolygons.ts` | 2 rectangle polygon records | Static map/overlay candidate data | `NEIGHBORHOOD` | Map, Geography | `PROVISIONAL_KNOWLEDGE` | First-party approximate geometry; no boundary source, precision, or effective date | `REQUIRES_SOURCE_UPGRADE`, `REQUIRES_REDESIGN`, `DEFER` | Not approved for map/public/persistence |
| Current knowledge graph fixture | `data/knowledgeGraph.ts`, `lib/knowledgeGraph.ts` | 5 nodes and related IDs for city, neighborhood, and guide relationships | Related content links | `MUNICIPALITY`, `NEIGHBORHOOD`, non-GIO guide content | Editorial, Relationship | `EDITORIAL_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | First-party static; relationship source and lifecycle absent | `PERSIST_AS_RELATIONSHIP`, `RETAIN_AS_EDITORIAL_CONTENT`, `REQUIRES_REDESIGN` | Fixture-only relationship mapping candidate |
| Market data backbone | `lib/marketData.ts` | 3 `MarketStats` records and valuation helper | Equity/market analytics support | `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD` | Market, Property, Financial | `PROVISIONAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION`, `RESTRICTED_KNOWLEDGE` | First-party static values; inline citation placeholders; no source IDs or effective periods | `PERSIST_AS_OBSERVATION`, `REQUIRES_SOURCE_UPGRADE`, `REQUIRES_TRUST_REVIEW` | Internal fixture only; no public GIO market facts |
| Chart market fixture | `data/marketData.ts` | 6 monthly price points | Chart fallback data | `MARKET_AREA` | Market | `PROVISIONAL_KNOWLEDGE` | Static fixture; no year/source/geography | `RETIRE` or `REQUIRES_REDESIGN` | Not eligible |
| Market reports | `data/marketReports.ts` | 2 dated Boulder report records | Market-report fixture | `MARKET_AREA`, `MUNICIPALITY` | Market | `PROVISIONAL_KNOWLEDGE` | Static; no source class, license, or retrieval metadata | `PERSIST_AS_OBSERVATION`, `REQUIRES_SOURCE_UPGRADE` | Fixture-only after source review |
| Programmatic search registry | `data/searchPages.ts`, `data/programmaticPages.ts`, `data/propertySearches.ts` | 8 city slugs and 28 search intents plus category templates | SEO/search-intent planning | `MUNICIPALITY`, non-GIO content | Search, Editorial, SEO | `EDITORIAL_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | First-party editorial taxonomy | `RETAIN_AS_EDITORIAL_CONTENT`, `REQUIRES_REDESIGN` | No GIO activation |
| Guides, comparisons, relocation, lifestyle fixtures | `data/guides.ts`, `data/comparisons.ts`, `data/cityComparisons.ts`, `data/relocation.ts`, `data/lifestyles.ts` | Small static arrays/templates | Content navigation and programmatic intent | Non-GIO content; some `MUNICIPALITY` relationship candidates | Editorial, Buyer, Seller, Lifestyle | `EDITORIAL_KNOWLEDGE` | First-party editorial; no review metadata | `RETAIN_AS_EDITORIAL_CONTENT`, `PERSIST_AS_RELATIONSHIP` later | No activation |
| Property runtime location fields | `prisma/schema.prisma`, `lib/mls/upsertListing.ts`, property/search modules | `Property.city`, `state`, `zip`, `lat`, `lng`, `neighborhood`, `subdivision`, `schoolDistrict` and MLS normalization | Core public property/search/map runtime | Property relationship, `MUNICIPALITY`, `ZIP_CODE`, `NEIGHBORHOOD`, `SUBDIVISION`, future education object | Property, Market, Search | `LICENSED_FACT`, `PROVISIONAL_KNOWLEDGE`, `RESTRICTED_KNOWLEDGE` | MLS-derived/current database; license and field-level source metadata not represented in GIO | `PERSIST_AS_RELATIONSHIP`, `REQUIRES_LICENSE_REVIEW`, `REQUIRES_TRUST_REVIEW` | Not approved for backfill |
| Search and Typesense geography fields | `app/api/search/route.ts`, `lib/search/*`, `lib/typesense/schema.ts` | Query/filter/facet fields for city, zip, neighborhood, subdivision, school district, lat/lng | Active search and map behavior | Property relationship and object lookup candidates | Search, Property, Market | `LICENSED_FACT` for listing fields; `PROVISIONAL_KNOWLEDGE` for inferred geography | Existing runtime source; not GIO source of truth | `DEFER`; preserve runtime boundary | No GIO runtime import |
| Geocode local anchors | `app/api/geocode/route.ts` | 7 local anchor records plus Mapbox fallback path | Address lookup fallback | `MUNICIPALITY`, point/place candidate | Location, Map | `PROVISIONAL_KNOWLEDGE`, `LICENSED_FACT` when Mapbox used | Local static or licensed commercial; no GIO source record | `PERSIST_AS_ALIAS`, `REQUIRES_LICENSE_REVIEW`, `DEFER` | No activation |
| Market and neighborhood public pages | `app/market/[city]/page.tsx`, `app/market/[city]/[slug]/page.tsx` | Static params from registries plus Typesense inventory lookup/fallback | Active market and neighborhood pages | `MUNICIPALITY`, `NEIGHBORHOOD`, `MARKET_AREA` | Market, Lifestyle, Editorial | Mixed: `EDITORIAL_KNOWLEDGE`, `ENTERPRISE_OBSERVATION`, `PROVISIONAL_KNOWLEDGE` | First-party static plus Typesense count where available | `RETAIN_AS_EDITORIAL_CONTENT`, `PERSIST_AS_OBSERVATION` later | Current pages stay non-GIO |
| Property page geographic content | `app/properties/[id]/page.tsx`, `lib/schema/propertySchema.ts`, `components/RelatedPropertyLinks.tsx` | Runtime property data, market/neighborhood links, structured data | Active property pages | Property relationship | Property, Market, Editorial | `LICENSED_FACT`, `EDITORIAL_KNOWLEDGE`, `RESTRICTED_KNOWLEDGE` | Property database/MLS/Supabase fallback; no GIO relationship rows | `PERSIST_AS_RELATIONSHIP` later | No backfill or enrichment now |
| Structured data location graph | `lib/schema/neighborhoodSchema.ts`, `lib/schema/propertySchema.ts`, schema components | JSON-LD nodes for Place, City, PostalAddress, GeoCoordinates, WebPage, RealEstateAgent | Active SEO/AEO structure | `MUNICIPALITY`, `NEIGHBORHOOD`, property relationship, non-GIO organization/person | SEO, Editorial, Property | `EDITORIAL_KNOWLEDGE`, `LICENSED_FACT`, `PROVISIONAL_KNOWLEDGE` | Derived from repository/runtime fields; source metadata not embedded | `RETAIN_AS_EDITORIAL_CONTENT`, `REQUIRES_SOURCE_UPGRADE` | Preserve current behavior; no GIO activation |
| Internal linking graph | `lib/linking/*`, `components/internal-links/*`, related content components | Link builders from city/neighborhood/property/article registries | Active related-location and content links | Relationship candidates and non-GIO content | Editorial, Search, SEO | `EDITORIAL_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | First-party editorial relationships | `PERSIST_AS_RELATIONSHIP`, `REQUIRES_REDESIGN` | Fixture-only mapping candidate |
| Map components and tile configuration | `components/maps/*`, `components/PropertyMap.tsx`, `components/NeighborhoodOverlayMap.tsx`, `lib/map/tiles.ts` | Leaflet render state, marker fields, tiles | Active map rendering | Property relationship, future point/polygon objects | Map, Search, Property | Runtime display, not source truth | Provider/config source; no GIO source metadata | `DEFER` | No map integration |
| GIO dormant persistence foundation | `prisma/schema.prisma`, `lib/gio/persistence.ts`, GIO migration, safety script | 7 GIO models, 17 enums, helper assertions | Dormant persistence/governance | All first-scope GIO types | Governance | Governance infrastructure, not knowledge asset | Internal architecture | `RETAIN`, future persistence after authorization | Runtime isolated |
| GKC fixture governance package | `lib/gkc/fixtureGovernance.ts`, `scripts/checkGkcFixtureGovernance.ts` | Synthetic classifications, source fixtures, schema keys, assertions | Local deterministic validation only | First-scope GIO types | Governance | Synthetic only | Internal non-production fixture | `RETAIN`, extend for future fixtures | No persistence |

Inventory totals:

- 22 evidence categories inventoried.
- 13 primary city records in `lib/cities.ts`.
- 12 legacy city records in `data/cities.ts`.
- 22 primary neighborhood records in `lib/neighborhoods.ts`.
- 2 legacy neighborhood records in `data/neighborhoods.ts`.
- 2 static polygon records.
- 5 local knowledge-graph nodes.
- 3 market-stat records in `lib/marketData.ts`.
- 2 market-report fixture records.
- 8 search-page city slugs and 28 search-intent slugs.
- 7 local geocode anchors.
- 7 dormant GIO persistence models and 17 GIO enums.
- 6 approved GKC knowledge classifications, 7 GKC source classes, 8 representative GKC schema keys, and 5 synthetic fixture object types.

---

## 4. GIO Object-To-Domain Matrix

| GIO object type | Current repository evidence | Covered domains | Current classification posture | Persistence readiness | Notes |
| --- | --- | --- | --- | --- | --- |
| `MUNICIPALITY` | `lib/cities.ts`, `data/cities.ts`, market routes, sitemap, internal links, property/search city fields, local geocode anchors | Market, Lifestyle, Editorial, Search, Property, Government candidate | Object identity is fixture-ready; facts are provisional until sourced | `READY_FOR_FIXTURE_ONLY_MAPPING` | Best first object type because identity is stable and already drives routes. |
| `NEIGHBORHOOD` | `lib/neighborhoods.ts`, `data/neighborhoods.ts`, neighborhood pages, internal links, property neighborhood field, polygons | Lifestyle, Market, Environmental and Risk, Construction, Editorial | Identity is fixture-ready; many attributes are editorial/restricted/provisional | `READY_FOR_FIXTURE_ONLY_MAPPING_WITH_TRUST_LIMITS` | Boundaries and risk claims require source upgrade. |
| `MARKET_AREA` | city market slugs, `lib/marketData.ts`, market routes, reports, charts, Typesense inventory counts | Market, Investment, Seller, Buyer | Mostly provisional or enterprise observation | `READY_FOR_INTERNAL_SCHEMA_KEY_MAPPING_ONLY` | Observations need period, methodology, source, and license review. |
| `ZIP_CODE` | `Property.zip`, search facets, Typesense schema, geocode/search route handling | Property, Search, Market candidate | Licensed/provisional depending source | `READY_FOR_FIXTURE_ONLY_MAPPING` | No standalone ZIP registry exists; derive candidates only in dry-run reports later. |
| `SUBDIVISION` | `Property.subdivision`, MLS normalization, Typesense/search fields | Property, Public Records, Community Governance candidate | Licensed/provisional/restricted | `DEFER_UNTIL_LICENSE_AND_SOURCE_REVIEW` | Requires subdivision name normalization and public-record support. |
| Property relationship | `Property` string geography fields and dormant `PropertyGeographicRelationship` | Property, Search, Map, Market | Licensed/provisional; relationship confidence not yet persisted | `NOT_READY_FOR_BACKFILL` | Relationship mapping is the key future value, but no production write is authorized. |
| Future object type | Schools, counties, parcels, parks, trails, open space, hazards, utilities, HOAs, builders from architecture docs and some local fields | Education, Public Records, Lifestyle, Infrastructure, Environmental, Governance | Mostly restricted/provisional | `DEFER` | Needs separate object-type authorization and trust review. |
| Non-GIO content | Guides, articles, comparisons, programmatic pages, schema/person/organization data | Editorial, SEO/AEO, Buyer, Seller | Editorial knowledge | `RETAIN_AS_EDITORIAL_CONTENT` | Should not be forced into GIO object rows. |

---

## 5. Repository Asset Classification Matrix

| Repository asset family | GKC class | Trust posture | Duplicate/conflict posture | Recommended action |
| --- | --- | --- | --- | --- |
| City identity names and slugs | `PROVISIONAL_KNOWLEDGE` until source-backed; likely future `AUTHORITATIVE_FACT` | Medium for operational consistency, not authoritative | Duplicate city registries exist | Create fixture-only object mapping; later source municipal identity. |
| City market stats | `PROVISIONAL_KNOWLEDGE` or `ENTERPRISE_OBSERVATION` | Low to medium; no effective period/source | Values differ by file and route context | Require MLS/stat source upgrade and schema-key registry before persistence. |
| Neighborhood identity names and slugs | `EDITORIAL_KNOWLEDGE` plus future object identity | Medium as editorial local taxonomy | Legacy and primary registries overlap | Map primary registry first; legacy registry becomes conflict/alias input. |
| Neighborhood lifestyle descriptions | `EDITORIAL_KNOWLEDGE` | Medium if human-reviewed; review dates absent | Mostly not contradictory | Retain editorial; add authorship/review metadata later. |
| Neighborhood resilience, fire, insurance, soil, water-rights, altitude fields | `RESTRICTED_KNOWLEDGE`, `ENTERPRISE_OBSERVATION`, `PROVISIONAL_KNOWLEDGE` | Low without source/effective date; high-risk domains | Values may conflict with future authoritative environmental data | Keep internal-only; require trust review before persistence or display as governed facts. |
| Static polygons | `PROVISIONAL_KNOWLEDGE` | Low; approximate geometry | May contradict official boundaries | Defer; replace with sourced geometry before map activation. |
| Property MLS geography strings | `LICENSED_FACT` or `PROVISIONAL_KNOWLEDGE` | Medium; source is active listing data but field meaning varies | Neighborhood/subdivision/MLS area ambiguity | Preserve as property runtime fields; future backfill only after license and mapping review. |
| Internal links and knowledge-graph relationships | `EDITORIAL_KNOWLEDGE`, `PROVISIONAL_KNOWLEDGE` | Medium for UX, low as canonical relationship | Duplicate relationship systems exist | Use as fixture relationship candidates, not production truth. |
| Geocode anchors | `PROVISIONAL_KNOWLEDGE`; Mapbox result `LICENSED_FACT` candidate | Low to medium | Local anchors are not boundary authority | Retain for runtime fallback; do not persist without source records. |
| JSON-LD place and property schema | Mixed editorial and runtime fact | Useful presentation structure, not source truth | Derived from same unsourced static/runtime fields | Preserve behavior; later back source metadata before GIO activation. |
| Data Tools categories | Source-class reference | High as strategy/source catalog, not field-level evidence | No conflict with GIO/GKC; broader than current implementation | Use for source matrix and future source registry planning only. |

---

## 6. GKC Classification Matrix

| Classification | Current repository examples | Finding | Future requirement |
| --- | --- | --- | --- |
| `AUTHORITATIVE_FACT` | No current GIO-populated examples; candidate future municipal identity, assessor, clerk, FEMA, Census, planning facts | Repository has candidate pathways but does not carry authoritative source records for current static geography | Add source registry entries, source URLs/IDs, effective/retrieved/verified dates, and review status before persistence. |
| `LICENSED_FACT` | MLS-derived property geography, listing facts, Typesense indexed listing fields, potential Mapbox geocode result | Runtime uses licensed/commercial facts, but no GIO source metadata or display-right matrix exists | License review and public-display controls before any GIO observation or relationship backfill. |
| `ENTERPRISE_OBSERVATION` | Resilience scores, efficiency scores, market-health scores, derived inventory fallback, GC forensics | Derivations exist but calculation version, input lineage, and review status are incomplete | Require calculation version, input evidence, schema key, freshness, confidence, and review status. |
| `EDITORIAL_KNOWLEDGE` | Lifestyle copy, city/neighborhood descriptions, internal-link descriptions, guide/search intent templates | Strong existing public content base | Add authorship, review dates, source notes, and protected-language guardrails before GIO public use. |
| `PROVISIONAL_KNOWLEDGE` | Legacy city/neighborhood fixtures, static polygons, market data fixtures, geocode anchors, property relationship candidates | Largest class of current geographic assets | Use fixture-only mapping and conflict register before internal persistence. |
| `RESTRICTED_KNOWLEDGE` | Environmental/risk fields, school district fields, insurance complexity, water-rights posture, soil/flood/hazard concepts, financing/investment concepts | Present in current logic and architecture, but not governed as public-safe GIO knowledge | Keep internal-only until legal/trust/source review and explicit activation. |
| `UNCLASSIFIED_PENDING_REVIEW` | Any future inventory not covered by this matrix, especially generated articles and long-tail programmatic content | Default for unreviewed content | Must remain not eligible for persistence or activation. |

---

## 7. Source Trust And Freshness Matrix

| Source or source category | Source class | Authority | License status | Public-display permission | Freshness | Effective date | Verification state | Conflict state | Current repository use | Future use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REIE static registries | `FIRST_PARTY_REIE` | Editorial/internal | Internal rights | Public copy currently used, but not GIO-approved | Unknown to stale unless reviewed | Mostly absent | Unverified as source-backed facts | Some duplicates | Active city/neighborhood/content pages | Fixture mapping and editorial retention |
| MLS Grid / IRES / Matrix | `AUTHORITATIVE_INDUSTRY` | Primary for listing facts and MLS market signals | Licensed/restricted | Controlled by MLS/license rules | Live/daily when sync active | Listing/update timestamps available in runtime data | Runtime verified, not GIO-verified | Field ambiguity for neighborhood/subdivision | Property/search/Typesense | Future licensed facts and property relationships |
| Supabase PostgreSQL | `FIRST_PARTY_REIE` | Storage, not external truth | Internal infrastructure | Not a public source | Runtime-current | Row timestamps | Runtime operational | Not a factual authority | Property persistence | GIO storage only after authorization |
| Typesense | `FIRST_PARTY_REIE` | Index, not source truth | Internal infrastructure | Public search output only | Reindex-dependent | Indexed timestamps | Runtime safety checks | Not source of truth | Search/map facets | Eligible index target only after GIO approval |
| Mapbox | `LICENSED_COMMERCIAL` | Commercial geocoder | Licensed | Must follow provider terms | API-current | Response-time | Runtime fallback only | May conflict with authoritative boundaries | Geocode route | Candidate geocode source after license review |
| OpenStreetMap / map tiles | `SECONDARY_PUBLIC` | Presentation context | Provider terms | Tile display only | Provider-dependent | Not captured | Not GIO verified | Not source truth | Map background | Continue as presentation, not fact source |
| County assessor | `AUTHORITATIVE_GOVERNMENT` | Primary for parcel/property public records | Public terms vary | Review required | Source-defined | Required | Not integrated | Potential conflicts with MLS | Not directly integrated | Future public-record facts |
| County clerk and recorder | `AUTHORITATIVE_GOVERNMENT` | Primary for recorded documents | Public terms vary | Review required | Source-defined | Required | Not integrated | Legal interpretation risk | Not integrated | Future title/public-record evidence |
| County/municipal GIS | `AUTHORITATIVE_GOVERNMENT` | Primary for boundaries/layers in scope | Public terms vary | Review required | Source-defined | Required | Not integrated | Boundary variants likely | Not integrated | Future polygons and overlays |
| Planning/building departments | `AUTHORITATIVE_GOVERNMENT` | Primary for permits, zoning, plans | Public terms vary | Restricted summary only | Event-driven | Required | Not integrated | Legal/plan-status risk | Not integrated | Future planning/permit observations |
| Census/BLS/Colorado labor | `AUTHORITATIVE_GOVERNMENT` | Primary for demographic/economic data | Public | Restricted by fair-housing policy | Source cadence | Required | Not integrated | Geography/vintage differences | Not integrated | Future restricted economic observations |
| FEMA/USGS/CGS/weather/environmental sources | `AUTHORITATIVE_GOVERNMENT` | Primary for many environmental facts | Public terms vary | Restricted by trust policy | Source-defined | Required | Not integrated | Map-version conflicts | Not integrated | Future restricted risk context |
| REALTOR association reports / InfoSparks / ShowingTime MarketStats | `AUTHORITATIVE_INDUSTRY` or `LICENSED_COMMERCIAL` | High in market domain | Licensed or terms-limited | Review required | Monthly/quarterly | Required | Not integrated | Methodology differences | Not integrated | Future market observations |
| TitlePro247 / title-company tools / ATTOM / CoreLogic / Black Knight | `LICENSED_COMMERCIAL` | Supplemental/strong for property/public-record aggregates | Licensed/restricted | Restricted until contract review | Provider-defined | Required | Not integrated | May conflict with official records | Not integrated | Future internal-only property/public-record enrichment |
| School resources | `AUTHORITATIVE_GOVERNMENT` or `LICENSED_COMMERCIAL` | Domain-specific | Varies | Restricted by education/fair-housing review | Source-defined | Required | Not integrated | Boundary changes likely | Only property `schoolDistrict` string | Deferred |
| Consumer portals and Google/Street View | `SECONDARY_PUBLIC` or `LICENSED_COMMERCIAL` | Supporting only | Terms-restricted | Not fact source by default | Unknown | Required if used | Not integrated as source | High conflict risk | No governed use | Defer or supporting research only |

---

## 8. Real Estate Data Tools Source Matrix

The authoritative `PROJECT ATLAS - REAL ESTATE DATA TOOLS` Google Doc was found and read through Drive. It contains 16 source/tool categories. The matrix below maps them into the GIO/GKC source-abstraction model without authorizing any integration.

| Data Tools category | Intelligence domains | Applicable GIO object types | Source class | Potential GKC classification | Current repository use | Potential future use | Access method | Licensing dependency | Public-display limitations | Priority | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MLS systems: IRES, Matrix, ShowingTime, Supra, ColoProperty | Market, Property, Search, Map | Property relationship, `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE`, `SUBDIVISION` | `AUTHORITATIVE_INDUSTRY` | `LICENSED_FACT`, `ENTERPRISE_OBSERVATION` | MLS Grid property/search runtime already exists; no GIO use | Source-backed market observations and property relationships | API/manual platform | High | MLS display rules and IDX/license restrictions | High | `REQUIRES_LICENSE_REVIEW` |
| Public record and property research: TitlePro247, IRES public records, assessors, clerk/recorder, CORA | Public Records, Property, Government | Property relationship, future parcel, `SUBDIVISION`, `MUNICIPALITY`, future county | Government or licensed commercial | `AUTHORITATIVE_FACT`, `LICENSED_FACT`, `RESTRICTED_KNOWLEDGE` | TitlePro247 assessed separately; not integrated | Internal-only public-record evidence and conflict resolution | API/manual/web | Medium to high | Legal/title interpretation prohibited | High | `INTERNAL_ONLY`, `REQUIRES_TRUST_REVIEW` |
| GIS and parcel mapping | Government, Environmental and Risk, Infrastructure | Future parcel/county; `MUNICIPALITY`, `NEIGHBORHOOD`, `SUBDIVISION`, future hazard objects | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Only approximate static polygons exist | Boundary, overlay, and containment evidence | Public web/API/file | Varies | Boundary disclaimers, no property-specific risk conclusions | High | `REQUIRES_SOURCE_UPGRADE` |
| County assessor sites | Public Records, Property | Future parcel/property, `MUNICIPALITY`, `SUBDIVISION` | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Not integrated | Property characteristics, tax, sketches, sales history evidence | Public web/API/manual | Varies | No legal/tax conclusions | High | `DEFER_UNTIL_SOURCE_REGISTRY` |
| County clerk and recorder | Public Records, Community Governance | Future parcel/document/HOA; `SUBDIVISION` | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Not integrated | Recorded document evidence | Public web/manual | Varies | Legal interpretation prohibited | Medium | `REQUIRES_TRUST_REVIEW` |
| Market statistics: IRES Stats and REALTOR associations | Market | `MARKET_AREA`, `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE` | `AUTHORITATIVE_INDUSTRY` | `LICENSED_FACT`, `ENTERPRISE_OBSERVATION` | Static market fixtures only | Dated market observations | Licensed UI/API/manual report | High | Attribution/license controls | High | `REQUIRES_LICENSE_REVIEW` |
| Demographic and economic research: Census, ESRI, labor/BLS | Economic and Demographic | `MUNICIPALITY`, `ZIP_CODE`, future county/census geography | Government or licensed commercial | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | Not integrated | Internal analysis, fair-housing-reviewed context | API/manual | ESRI/license if used | Fair-housing controls; avoid steering | Medium | `DEFER` |
| School information: GreatSchools, Colorado SchoolView, district sites | Education | Future school/district; property relationship candidate | Government/licensed/secondary depending source | `RESTRICTED_KNOWLEDGE` | Property `schoolDistrict` string only | Internal education context with disclaimers | API/manual/public web | Varies | Strict fair-housing and attendance-boundary limits | Medium | `DEFER_FOR_EDUCATION_TRUST_REVIEW` |
| Environmental and risk data: FEMA, CGS, wildfire, AQI, radon, water, USGS, NWS | Environmental and Risk | Future hazard/watershed; `MUNICIPALITY`, `NEIGHBORHOOD`, `ZIP_CODE`, `SUBDIVISION` | `AUTHORITATIVE_GOVERNMENT` | `RESTRICTED_KNOWLEDGE`, `AUTHORITATIVE_FACT` | Static risk/resilience fields only | Restricted contextual observations | API/manual/file | Varies | No safety/insurance determinations | Medium | `REQUIRES_TRUST_REVIEW` |
| Building and permit data | Construction and Permits, Government | Future permit/document/property relationship; `MUNICIPALITY`, `SUBDIVISION` | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_FACT`, `RESTRICTED_KNOWLEDGE` | GC heuristics only | Permit history and remodel evidence | Public web/API/manual | Varies | No code-compliance conclusion | Medium | `DEFER` |
| Planning and development | Planning and Development, Government, Investment | `MUNICIPALITY`, `MARKET_AREA`, future development/zoning objects | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_FACT`, `PROVISIONAL_KNOWLEDGE`, `RESTRICTED_KNOWLEDGE` | Not integrated | Comprehensive plan and development context | Public web/API/manual | Varies | Plans are not guarantees | Medium | `REQUIRES_TRUST_REVIEW` |
| HOA research | Community Governance, Public Records | `SUBDIVISION`, future HOA/covenant objects | Government, partner, licensed, or secondary | `RESTRICTED_KNOWLEDGE` | Not integrated | Internal HOA/covenant source evidence | Manual/public/private docs | High | Private docs and legal claims restricted | Low-medium | `DEFER` |
| Title company resources | Public Records, Financing, Seller, Investment | Property relationship, future parcel/document | `LICENSED_COMMERCIAL` | `LICENSED_FACT`, `RESTRICTED_KNOWLEDGE` | Not integrated | Internal property profile/equity context | Partner/API/manual | High | Contractual display restrictions | Medium | `INTERNAL_ONLY` |
| Mortgage and financing tools | Financing, Buyer, Seller | Non-GIO content; future market/context observations | Licensed/commercial or first-party | `RESTRICTED_KNOWLEDGE`, `EDITORIAL_KNOWLEDGE` | Mortgage calculator not part of this package | Customer tools after separate product authorization | API/manual/calculation | Varies | No loan recommendation or affordability conclusion | Low-medium | `DEFER` |
| Consumer research sites | Lifestyle, Property, Market support | Non-GIO or supporting source only | `SECONDARY_PUBLIC` or `LICENSED_COMMERCIAL` | `PROVISIONAL_KNOWLEDGE`, `EDITORIAL_KNOWLEDGE` | Not a governed source | Corroboration only | Public web/manual | Terms vary | Not authoritative; no scraping | Low | `DEFER` |
| Professional research tools: Cloud CMA, RPR, Remine, InfoSparks, CoreLogic, Black Knight, ATTOM | Market, Property, Public Records, Investment | `MARKET_AREA`, property relationship, future parcel | `LICENSED_COMMERCIAL` or `AUTHORITATIVE_INDUSTRY` | `LICENSED_FACT`, `RESTRICTED_KNOWLEDGE` | Not integrated | Internal evidence and analytics | Licensed UI/API | High | Contract controls | Medium | `REQUIRES_LICENSE_REVIEW` |
| Investment research | Investment, Financing, Planning | `MARKET_AREA`, future opportunity zone/rental regulation objects | Mixed | `RESTRICTED_KNOWLEDGE`, `ENTERPRISE_OBSERVATION` | Static financial/market logic only | Internal decision support after trust review | API/manual/calculation | Varies | No investment recommendation | Low-medium | `DEFER` |

---

## 9. Duplicate And Conflict Register

| Conflict | Evidence | Risk | Recommendation |
| --- | --- | --- | --- |
| Duplicate city registries | `lib/cities.ts` has 13 route/market records; `data/cities.ts` has 12 slug/county records | Divergent slug formats and county values can create competing identities | Treat `lib/cities.ts` as current runtime source; use `data/cities.ts` as alias/county-review input only. |
| Duplicate neighborhood registries | `lib/neighborhoods.ts` has 22 records; `data/neighborhoods.ts` has 2 records with median price and lat/lng | Median price and coordinate values may conflict with primary registry and future sources | Retire legacy factual values or move into conflict review fixtures. |
| Approximate polygons vs real boundaries | `lib/neighborhoodPolygons.ts` uses small rectangular coordinate sets | Could be mistaken for official boundaries | Mark as provisional; do not persist or display as governed boundary. |
| Market stats without methodology | `lib/cities.ts`, `lib/marketData.ts`, `data/marketData.ts`, `data/marketReports.ts` | Different market values may appear authoritative without source period | Require schema-key, source, period, and methodology before observation persistence. |
| Neighborhood vs subdivision ambiguity | MLS/property fields and local registries include names that may be informal neighborhoods, MLS areas, or subdivisions | Incorrect relationship assignment risk | Add alias and object-type review before backfill. |
| School district string field | `Property.schoolDistrict` and Typesense search facets exist without education trust controls | Fair-housing and accuracy risk | Defer education objects and customer use until education trust review. |
| Environmental/risk claims in editorial data | fire risk, insurance complexity, soil, water-rights, altitude | High-risk claims without authoritative source and effective date | Keep restricted/internal and require trust review. |
| Internal link graph as relationship source | Internal links encode relatedness but not semantic relationship type or evidence | Could be overpromoted to factual graph | Use only as editorial relationship candidates. |
| Search route fallback market links | Property and card links derive market route from city strings | Unsupported city routes may 404 if not in registry | Preserve current behavior; future GIO route eligibility must be independent. |

---

## 10. Editorial-Versus-Factual Separation

Editorial knowledge currently includes:

- City and neighborhood descriptive copy.
- Lifestyle, anchor, and local-context language.
- Programmatic guide/search-intent templates.
- Internal-link descriptions.
- Article and related-content framing.
- Customer-safe market and property page narrative.

Factual or restricted knowledge candidates currently include:

- City, neighborhood, ZIP, subdivision, and school-district identity claims.
- Market statistics and chart values.
- Inventory counts and market-health scores.
- Fire risk, insurance complexity, soil profile, water-rights posture, altitude, and resilience scores.
- Property geography fields from MLS and the property database.
- Public-record, planning, permit, environmental, title, financing, education, and investment references from source docs.

Separation finding:

- Current runtime often mixes editorial presentation with static values. That is acceptable for current REIE behavior but not sufficient for governed GIO persistence. Future persistence must split object identity, source-backed observation, first-party calculation, and editorial summary into separate records.

---

## 11. Persistence-Candidate Register

| Candidate | Proposed disposition | Readiness | Minimum gating before persistence |
| --- | --- | --- | --- |
| Municipality object identity from `lib/cities.ts` | `PERSIST_AS_OBJECT_IDENTITY` | Fixture-ready | Confirm canonical slug strategy, source municipal identity, alias plan, eligibility defaults false. |
| City aliases from `data/cities.ts` and route slugs | `PERSIST_AS_ALIAS` | Fixture-ready | Normalize aliases and mark source as first-party/provisional until government source added. |
| Neighborhood object identity from `lib/neighborhoods.ts` | `PERSIST_AS_OBJECT_IDENTITY` | Fixture-ready with review | Mark informal/community identity and avoid official-boundary claims. |
| Neighborhood editorial summaries | `RETAIN_AS_EDITORIAL_CONTENT` or future `PERSIST_AS_OBSERVATION` | Not ready for public GIO | Add authorship, review date, and source notes. |
| City-to-neighborhood relationships | `PERSIST_AS_RELATIONSHIP` | Fixture-ready only | Relationship type, directionality, source, confidence, and effective date required. |
| Property city/ZIP/neighborhood/subdivision relationships | `PERSIST_AS_RELATIONSHIP` | Not ready | License review, duplicate prevention, matching confidence, and dry-run ledger required. |
| Market stats | `PERSIST_AS_OBSERVATION` | Not ready | Source class, schema key, period/effective date, method, freshness, confidence, and license review. |
| Search intent/category mappings | `RETAIN_AS_EDITORIAL_CONTENT` | Ready as editorial | Do not persist as geographic fact unless tied to object/page governance later. |
| Static polygons | `DEFER` | Not ready | Authoritative boundary source, precision, license, effective date, and map eligibility review. |
| Environmental/risk fields | `INTERNAL_ONLY`, `REQUIRES_TRUST_REVIEW` | Not ready | Authoritative source, professional/legal language review, conflict preservation. |

---

## 12. Restricted And Deferred Knowledge Register

| Knowledge type | Classification | Reason | Disposition |
| --- | --- | --- | --- |
| Fire risk, flood context, radon, air quality, wildfire, geological hazards, water rights | `RESTRICTED_KNOWLEDGE` | Safety, insurance, environmental, and legal-adjacent risk | Internal-only until trust review. |
| School district, school quality, attendance boundaries, education ratings | `RESTRICTED_KNOWLEDGE` | Fair-housing and assignment-accuracy risk | Deferred until education trust review. |
| Demographics, income, age, education, protected-class-adjacent signals | `RESTRICTED_KNOWLEDGE` | Fair-housing risk | Deferred or internal aggregate only after legal/trust review. |
| HOA documents, covenants, liens, deeds, title records, zoning interpretations | `RESTRICTED_KNOWLEDGE` | Legal/public-record interpretation risk | Internal evidence only; no conclusions. |
| Financing, affordability, investment, cap rate, cash flow, loan guidance | `RESTRICTED_KNOWLEDGE` | Regulated/high-stakes financial risk | Deferred to separate product/trust package. |
| Static polygon boundaries | `PROVISIONAL_KNOWLEDGE` | Approximate and unsourced | Defer. |
| Consumer portal facts | `PROVISIONAL_KNOWLEDGE` | Secondary source and terms constraints | Supporting research only. |
| AI-generated geographic claims | `UNCLASSIFIED_PENDING_REVIEW` | No source-backed governance | Not allowed. |

---

## 13. Activation-Readiness Matrix

| Activation area | Current state | GKM determination |
| --- | --- | --- |
| Fixture validation | GKC fixture validation is certified and closed | Approved only for synthetic/local fixture behavior. |
| Internal development persistence | Not authorized | Recommended as a future assessment/planning gate only. |
| Production internal-only persistence | Not authorized | Blocked until mapping plan, source review, recovery reconfirmation, and explicit mutation authorization. |
| Search | Active search uses current property fields | No GIO search activation approved. |
| Map | Active map uses property coordinates and runtime data | No GIO map activation approved. |
| Public page | Existing pages remain non-GIO | No GIO public-page activation approved. |
| Indexing | Typesense indexes property/listing fields | No GIO indexing approved. |
| Property enrichment | Property page uses current property data and static links | No GIO property enrichment approved. |
| Market analytics | Static and runtime market signals exist | No GIO market analytics activation approved. |
| Customer presentation | Current REIE remains unchanged | No new customer-facing behavior approved. |

---

## 14. Priority Recommendations

1. Treat `lib/cities.ts` and `lib/neighborhoods.ts` as the primary fixture-mapping inputs because they are the active runtime registries.
2. Treat `data/cities.ts`, `data/neighborhoods.ts`, `data/knowledgeGraph.ts`, and internal-link helpers as alias/relationship/conflict inputs, not canonical truth.
3. Keep all market statistics, resilience values, environmental claims, school fields, financing/investment concepts, and title/public-record concepts out of public GIO activation.
4. Create a future source registry plan before any real observations are persisted.
5. Require schema-key registry expansion before market, environmental, education, public-record, or editorial observations are persisted.
6. Require an alias collision ledger before mapping neighborhood, subdivision, MLS area, and market-area strings.
7. Require a property-relationship dry-run ledger before any backfill.
8. Preserve current search, map, market page, property page, sitemap, and SEO behavior until a separate activation package exists.

---

## 15. Risks And Unresolved Questions

| Risk or question | Severity | Current handling |
| --- | --- | --- |
| Current static market data lacks source, method, period, and effective date. | High | Do not persist as GIO observations. |
| Neighborhood risk/intelligence fields may be interpreted as factual or safety guidance. | High | Classify as restricted/provisional; require trust review. |
| MLS neighborhood, subdivision, area, and city strings may not align with official or colloquial geography. | High | Future alias/object matching must be reviewed and confidence-scored. |
| Data Tools source categories are broad and include vendors with licensing restrictions. | High | No integrations authorized; license review required. |
| Current public routes are string/slug based, not GIO-object based. | Medium | Preserve runtime; future adapter must be isolated. |
| GIO enum vocabulary is narrower than the broader architecture docs. | Medium | Future enum/registry expansion likely needed before persistence activation. |
| Static polygons may create false boundary confidence. | Medium | Defer geometry and map use. |
| Google Docs source documents are external to repository version control. | Medium | Record source IDs and required external updates; do not claim external updates unless performed. |
| The Data Tools document says "8 categories" but contains 16 numbered categories. | Low | Matrix treats all 16 numbered categories as source categories. |

---

## 16. Recommended Minimum Internal-Persistence Scope

If a later authorization permits isolated internal-development persistence, the smallest safe proof should be:

- Object types:
  - `MUNICIPALITY`
  - `NEIGHBORHOOD`
  - `MARKET_AREA`
  - `ZIP_CODE`
  - `SUBDIVISION`
- Source records:
  - one first-party REIE editorial/source record;
  - one synthetic or development-only authoritative-government placeholder;
  - one synthetic or development-only authoritative-industry placeholder.
- Object identities:
  - a very small deterministic fixture subset derived from current active registries, not production table rows.
- Aliases:
  - slug aliases and display-name aliases only.
- Relationships:
  - municipality-to-neighborhood and market-area-to-municipality fixture relationships only.
- Observations:
  - no real market values in the first persistence proof;
  - one editorial summary fixture and one source-required synthetic market observation may be enough.
- Eligibility:
  - all flags false by default;
  - no search, map, public page, indexing, property enrichment, market analytics, or customer presentation activation.

Production property relationship backfill should remain out of scope until after a dry-run ledger proves duplicate handling, confidence assignment, source rights, and rollback controls.

---

## 17. Explicit Exclusions

This package did not and does not authorize:

- Prisma schema changes.
- Database migrations.
- GIO table population.
- Production fixture creation.
- Existing property or geography data migration.
- Property relationship backfill.
- Search changes.
- Map changes.
- Runtime read adapters.
- New routes or pages.
- SEO/public behavior changes.
- Typesense collections or reindexing.
- Vendor integrations.
- Scraping external sites.
- AI-generated geographic facts.
- Customer-facing activation.
- Email, CRM, queue, MLS sync, or production mutation workflows.

---

## 18. Enum Or Registry Gaps

Likely future gaps before real persistence:

- Source classes may need to distinguish authoritative government, authoritative industry, licensed commercial, first-party REIE, secondary public, partner-submitted, and user-submitted more explicitly than the current Prisma `GeographicSourceClass` enum.
- Source lifecycle and source health should be separated; current `GeographicHealthState` is health-oriented, not full lifecycle.
- Object lifecycle may need `LIMITED` and `SUPERSEDED` semantics distinct from `DEPRECATED`.
- Relationship types may need expansion for containment, governance, education, development, lifestyle, environmental, and market relationships.
- Observation schema keys need a governed registry before real observations are inserted.
- Alias-type vocabulary may need a dedicated ambiguity/collision review workflow.
- Activation eligibility may eventually need per-domain or per-observation controls, not only object-level controls.

---

## 19. Exact External Google Docs Updates Required

No external Google Doc was updated during this assessment.

Recommended update to `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS`:

```text
PROJECT ATLAS Governance Update - July 25, 2026

GKC 1.0 Fixture Governance Validation is certified and closed.
GKM 1.0 Existing Geographic Knowledge Inventory & Classification is certified and closed.

The current repository contains geographic knowledge across city registries, neighborhood registries, market fixtures, property geography fields, search/map runtime fields, SEO schema, internal links, and source-governance documentation.

No GIO persistence, production data population, search activation, map activation, public-page activation, vendor integration, or customer-facing GIO behavior is authorized by GKM 1.0.

The next recommended gate is GKM_1.0_INTERNAL_DEVELOPMENT_MAPPING_PLAN, limited to deterministic non-production mapping plans and source/alias/conflict ledgers before any persistence authorization.
```

Recommended update to `PROJECT ATLAS - REAL ESTATE DATA TOOLS`:

```text
PROJECT ATLAS Governance Mapping Note - July 25, 2026

The 16 numbered Data Tools categories have been mapped into GIO/GKC source classes for future governance:

- MLS systems: authoritative industry / licensed facts.
- Public records, assessor, clerk/recorder, GIS, planning, permits, environmental, Census, and labor sources: authoritative government where source-specific authority applies.
- Title, professional research, market analytics, financing, consumer portal, ESRI, CoreLogic, ATTOM, Black Knight, and similar systems: licensed commercial or secondary public depending on contract and source role.
- REIE-authored content and calculations: first-party REIE editorial knowledge or enterprise observations.

This mapping does not authorize integrations, scraping, storage, public display, or production GIO persistence. Every source still requires license, authority, freshness, effective-date, public-display, and trust review before activation.
```

---

## 20. Executive Certification Recommendation

GKM 1.0 satisfies the authorized read-only inventory and classification scope.

Recommended certification:

- `GKM_1.0_EXISTING_KNOWLEDGE_INVENTORY_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GKM_1.0_INTERNAL_DEVELOPMENT_MAPPING_PLAN`

Do not begin internal persistence, production population, property relationship backfill, runtime read adapters, source integrations, search/map/page activation, or customer-facing GIO behavior without a separate executive authorization.
