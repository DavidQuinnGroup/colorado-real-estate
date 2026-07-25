# PROJECT ATLAS - GIO 1.0 Repository Discovery & Alignment

Program: `Geographic Intelligence System`

Architecture: `Geographic Intelligence Objects - GIO 1.0`

Parent architecture: `Enterprise Geographic Taxonomy - EGT 1.0`

Discovery date: July 25, 2026

Repository baseline: `632f106f412a43722afa2bb0fcc1517a21dd45b3`

Discovery status: `GIO_1.0_WAVE_1_REPOSITORY_DISCOVERY_CERTIFIED_AND_CLOSED`

Runtime implementation status: `NOT_AUTHORIZED`

Review status: `CHIEF_ENTERPRISE_ARCHITECT_APPROVED`

## Executive Result

GIO 1.0 is aligned with a real repository need. The current REIE already uses geographic concepts across Property, Search, Maps, Market pages, Neighborhood pages, Property Intelligence, internal linking, schema metadata, and static authority datasets, but those concepts are not yet represented as canonical reusable Geographic Intelligence Objects.

The repository is property-centered with partial city and neighborhood support. It does not yet contain a governed object contract for place identity, source authority, geometry provenance, lifecycle, trust metadata, relationship metadata, eligibility, conflict preservation, or domain-specific geographic intelligence inheritance.

The correct implementation posture is additive architecture. GIO should reuse the existing Property, Search, Map, Market, Property Intelligence, and Repository Governance systems rather than replace them.

No runtime implementation, database migration, route, API, ingestion, map, search, public-page, vendor, production-data, or workflow change is authorized by this discovery record.

## Wave 1 Closure Decision

Chief Enterprise Architect review approved the GIO 1.0 Repository Discovery & Alignment findings.

Approved findings:

- GIO is architecturally necessary.
- The existing `Property` model remains the production runtime anchor.
- GIO must be additive and must not replace current search, maps, routes, MLS ingestion, or geographic page behavior.
- Existing city, neighborhood, market, polygon, and static geography data must be classified before governed migration.
- `MarketArea` must remain distinct from `Municipality`.
- Source abstraction must precede additional vendor integration.
- School intelligence requires a later trust-specific review.

Approved initial canonical object scope:

- `Municipality`
- `Neighborhood`
- `MarketArea`
- `ZipCode`
- `Subdivision`

Explicit initial-scope exclusions:

- `SchoolDistrict` remains part of the long-term GIO architecture but is deferred from the first persistence implementation.
- Existing `Property` records must not be converted into GIO objects during the initial implementation. Property should connect to GIO through an additive relationship structure.

Final Wave 1 status:

`GIO_1.0_WAVE_1_REPOSITORY_DISCOVERY_CERTIFIED_AND_CLOSED`

## Discovery Boundary

This discovery was limited to repository inspection and documentation. It did not run live syncs, workers, queue retries, email sends, CRM mutations, MLS requests, Typesense reset/reindex, migrations, production form submissions, or deployment.

Preflight state:

- Branch: `main`
- `HEAD`: `632f106f412a43722afa2bb0fcc1517a21dd45b3`
- `origin/main`: `632f106f412a43722afa2bb0fcc1517a21dd45b3`
- Working tree before discovery edits: clean

Reference availability:

- The repository contains `docs/future-vision.md`, `docs/STATEoftheUNION`, `docs/content-architecture.md`, `docs/platform-architecture.md`, `REIE_MASTER_V7_TRACEABILITY.md`, and the PROJECT ATLAS executive library.
- The named Google Drive-style references in the work package, including `PROJECT ATLAS - REAL ESTATE DATA TOOLS`, `PROJECT ATLAS - Geographic Intelligence System Vision`, and `Enterprise Geographic Taxonomy - EGT 1.0`, were not found as local repository documents during this discovery.
- The Real Estate Data Tools matrix below is therefore mapped from repository evidence, work-package categories, and the supplied GIO architecture standard, not from a separately inspected local data-tools register.

## Current Geographic Capability Inventory

| Area | Current evidence | GIO alignment | Gap |
| --- | --- | --- | --- |
| Property source of truth | `prisma/schema.prisma` has `Property` with address, city, state, zip, lat, lng, neighborhood, subdivision, schoolDistrict, altitude, soilType, and resilience/efficiency fields. | Strong launch-value anchor for `Property` objects and property-to-place relationships. | Place fields are strings or direct attributes, not governed object references with source, freshness, boundary, lifecycle, or conflict metadata. |
| City records | `prisma/schema.prisma` has `City`; `lib/cities.ts` and `data/cities.ts` contain market-facing city datasets. | Candidate `Municipality`, `Community`, and `Market Area` seed evidence. | Duplicate city concepts exist across Prisma/static data, with limited identity strategy and no source/freshness metadata. |
| Neighborhood records | `prisma/schema.prisma` has `Neighborhood`; `lib/neighborhoods.ts` has richer editorial/resilience profiles; `data/neighborhoods.ts` has simpler point-based profiles. | Candidate `Neighborhood` and customer-presentation content. | Neighborhood identity, boundary type, legal/editorial distinction, provenance, and review state are not governed. |
| Search runtime | `/api/search` and `lib/search/searchProperties.ts` filter by city, neighborhood, property type, status, price, beds, baths, bounds, and public/contracted access. | GIO can improve exact place, alias, hierarchy, and ambiguous-place resolution. | Search currently resolves places through literal strings and bounding boxes, not canonical object identity or relationship-aware geographic resolution. |
| Typesense schema | `lib/typesense/schema.ts` indexes `city`, `state`, `zip`, `neighborhood`, `subdivision`, `schoolDistrict`, `lat`, `lng`, and `location`. | Existing search index can consume canonical fields later. | Index fields are listing/property fields, not object/relationship documents; no GIO eligibility, lifecycle, or source-trust fields. |
| Map runtime | `components/maps/SearchMap.tsx` renders coordinate listings, bounds changes, marker clustering, selected-property popups, and customer-safe map status. | GIO can later add map eligibility and object layer rules. | No governed map layer model, zoom eligibility, geometry source, boundary precision, or object rendering density rules. |
| Market pages | `app/market/[city]/page.tsx` generates city market pages from `lib/cities.ts` and `lib/neighborhoods.ts`, with schema and FAQ surfaces. | Candidate public-page eligibility and SEO presentation layer. | Market pages use city market slugs and static stats without dated market observation objects or source/freshness classifications. |
| Neighborhood pages | `app/market/[city]/[slug]/page.tsx` generates neighborhood intelligence pages from `lib/neighborhoods.ts`, Typesense inventory lookup, schema, FAQs, and related links. | Candidate neighborhood object presentation and related-object exploration. | Inventory source fallback is runtime-specific; neighborhood metrics are not separated into public facts, editorial interpretation, calculated metrics, and observations. |
| Property pages | `app/properties/[id]/page.tsx` connects property facts to city market links, neighborhood links, public listing context, construction, financial, and market sections. | Strong consumer of future property-to-place relationships and inherited context. | Inherited city/neighborhood context is assembled procedurally rather than through typed relationships and trust-aware inheritance rules. |
| Static relationship data | `data/knowledgeGraph.ts` has city/neighborhood/guide/address nodes with `related` links. | Useful predecessor for GIO relationship concepts. | Relationships are untyped strings without source, direction semantics, confidence, effective dates, or public visibility. |
| Geometry helpers | `lib/neighborhoodPolygons.ts` has small sample polygon coordinate arrays; `lib/utils/geo-logic.ts` has distance/efficiency calculations. | Candidate utilities for future geographic resolution and calculated observations. | Current polygons are not authoritative boundaries; calculations are not tied to source strategy, spatial reference, derivation method, or review status. |
| Repository governance | `/admin/repository/*`, `lib/repository/*`, and EIA persistence models support enterprise objects, relationships, provenance, coverage, and governance-adapter concepts. | Strong model pattern for governance discipline and traceability. | The repository-governance system is not a GIO domain model and should not be overloaded as the public geographic object store without an approved charter. |

## Existing Geographic Object Catalog

| Object type | Current representation | Evidence | Modeling quality | GIO disposition |
| --- | --- | --- | --- | --- |
| State | Hard-coded `CO` and `Colorado` values in property data, schema nodes, city data, and public copy. | `prisma/schema.prisma`, `lib/schema/propertySchema.ts`, `lib/schema/neighborhoodSchema.ts` | Not first-class. | `REUSE_WITH_EXTENSION` as a root geography only if needed for hierarchy and SEO. |
| County | Static city records include county labels such as Boulder County and Weld County. | `data/cities.ts` | String-only, sometimes multi-county text. | `ADDITIVE_NEW_COMPONENT` after source review. |
| Municipality / city / town | Prisma `City`, static `lib/cities.ts`, `data/cities.ts`, city market routes. | `prisma/schema.prisma`, `lib/cities.ts`, `app/market/[city]/page.tsx` | Multiple parallel models. | `REUSE_WITH_EXTENSION` after canonical identity reconciliation. |
| Community | Represented implicitly by city/neighborhood/public copy and Gunbarrel-style market data. | `lib/cities.ts`, `lib/neighborhoods.ts` | Ambiguous with municipality and neighborhood. | `DEFER` until object-definition rules distinguish legal, informal, and marketing identities. |
| Neighborhood | Prisma `Neighborhood`, rich static `lib/neighborhoods.ts`, simple `data/neighborhoods.ts`, neighborhood routes. | `prisma/schema.prisma`, `lib/neighborhoods.ts`, `data/neighborhoods.ts`, `app/market/[city]/[slug]/page.tsx` | Useful but duplicated and mixed fact/editorial/calculated data. | `REUSE_WITH_EXTENSION` as a launch core class. |
| Subdivision | Optional `Property.subdivision`, Typesense field, search query field. | `prisma/schema.prisma`, `lib/typesense/schema.ts`, `/api/search` | Property attribute only. | `ADDITIVE_NEW_COMPONENT` after source strategy. |
| ZIP code | `Property.zip`, Typesense facet/query field, property schema postal code. | `prisma/schema.prisma`, `lib/typesense/schema.ts`, `lib/schema/propertySchema.ts` | Property attribute only. | `ADDITIVE_NEW_COMPONENT` for search/filter normalization. |
| Market area | City market slugs and market pages; no distinct market-area object. | `lib/cities.ts`, `app/market/[city]/page.tsx` | Conflated with city/municipality. | `ADDITIVE_NEW_COMPONENT`; should not equal municipality by default. |
| MLS area | No first-class model found. MLS data is listing/property-centered. | `lib/mls/*`, `prisma/schema.prisma` | Not represented. | `DEFER` until source/license mapping is approved. |
| Property | First-class Prisma model, route, schema, search, map, alert, inquiry, and indexing anchor. | `prisma/schema.prisma`, `app/properties/[id]/page.tsx`, `/api/search`, `lib/typesense/schema.ts` | Strong existing runtime object. | `REUSE_AS_IS` as runtime anchor; add relationships rather than replace. |
| Parcel | No first-class parcel model found. | Repository scan | Not represented. | `DEFER` until assessor/title source strategy. |
| School district | Optional `Property.schoolDistrict`; static school district strings. | `prisma/schema.prisma`, `lib/schools.ts`, `lib/typesense/schema.ts` | Attribute/string only. | `DEFER`; requires later trust-specific review and is excluded from the first persistence implementation. |
| School | Static `lib/schools.ts` records with slug, name, city, district, lat, lng. | `lib/schools.ts` | Static point records, no source/freshness. | `REUSE_WITH_EXTENSION` only after disclaimers and source verification. |
| Park / trail / open space / lifestyle anchor | `primaryAnchor`, landmarks, search page categories, public copy. | `lib/neighborhoods.ts`, `lib/landmarks.ts`, `data/searchPages.ts`, `lib/linking/buildLinkGraph.ts` | Editorial/string/point data, not reusable objects. | `ADDITIVE_NEW_COMPONENT` later; initial wave can preserve as presentation fields. |
| HOA / covenant area | No first-class model found. | Repository scan | Not represented. | `DEFER` pending source/license/freshness model. |
| Builder / builder community / development | No first-class model found. | Repository scan | Not represented. | `DEFER` pending source and customer-value review. |
| Government jurisdiction / special district | No first-class GIO model found; repository-governance objects are enterprise governance, not public geography. | `lib/repository/server.ts` | Separate governance system. | `DEFER` or `ADDITIVE_NEW_COMPONENT` only after source strategy. |
| Environmental / hazard area | Neighborhood fire-risk/soil/insurance labels and property soil/polybutylene flags. | `lib/neighborhoods.ts`, `prisma/schema.prisma`, `app/properties/[id]/page.tsx` | Mixed editorial/calculated/context fields; not sourced zones. | `DEFER` public hazard areas; retain current neutral context. |
| Market report / observation | Static `data/marketReports.ts`, `data/marketData.ts`, city stats, market pages. | `data/marketReports.ts`, `data/marketData.ts`, `lib/cities.ts` | Not date/source governed beyond static fields. | `ADDITIVE_NEW_COMPONENT` as dated observations after source review. |

## Relationship Inventory

| Relationship method | Evidence | Current behavior | Conflict or duplication | GIO recommendation |
| --- | --- | --- | --- | --- |
| Prisma foreign keys | `PropertyPhoto`, `PriceHistory`, `OpenHouse`, `AlertEvent`, `LeadInteraction`, `SavedSearch`, `City` to `Neighborhood`, EIA provenance relations. | Strong relational integrity for property photos/history/user flows and enterprise intelligence. | Geographic relationships are limited mostly to `City -> Neighborhood`; property-to-place is string-based. | Reuse FK discipline for GIO, but do not mutate schema without a charter. |
| Property string fields | `Property.city`, `zip`, `neighborhood`, `subdivision`, `schoolDistrict`. | Search, property page, schema, links, and Typesense consume strings directly. | Same place can appear as case/slug/name variants; no canonical place ID. | Normalize through future object references and alias resolution. |
| Route slug relationships | `/market/${city.marketSlug}`, `/market/${city}/${neighborhood.slug}`, `/properties/${slug || id}`. | SEO and navigation depend on slugs. | City market slug differs from city slug; neighborhood city segment uses lower-case display name. | Preserve URLs; add canonical object identity under them. |
| Static related arrays | `data/knowledgeGraph.ts` `related` arrays. | Related content can be derived from string IDs. | Untyped, undated, non-directional, no confidence/source. | Convert only after defining typed relationship metadata. |
| Procedural link builders | `lib/linking/buildLinkGraph.ts`, `getCityLinks`, `getNeighborhoodLinks`, `getPropertyLinks`. | Builds related pages and search links from city/neighborhood/property context. | Logic is duplicated across builders and components. | Reuse as presentation layer; future GIO relationships should feed it. |
| Coordinate proximity | `SearchMap`, geocode route, logistics/efficiency helpers, NorthStar coordinates. | Maps and logistics use lat/lng and fallback anchors. | Calculations are useful but not source-governed observations. | Treat proximity/travel as calculated observations, not permanent place facts. |
| Bounds queries | `/api/search`, Supabase fallback, Typesense filters. | Search filters properties by `lat/lng` box and valid coordinates. | Bounds are property filters, not object containment. | Preserve runtime; future GIO resolution can add parent assignment separately. |
| Structured-data containment | Schema builders use `containedInPlace`, `areaServed`, and `PostalAddress`. | Public SEO graph expresses place relationships. | Schema graph relationships are generated from current strings, not governed objects. | Reuse output shape after canonical GIO IDs exist. |
| Repository governance relationships | `repository_relationship` read model has source/target, type, confidence, traceability. | Internal enterprise-governance graph. | Not a public geographic object graph. | Borrow design; decide persistence strategy in charter. |
| Spatial joins / PostGIS | No PostGIS or point-in-polygon implementation found. | Not present. | Sample polygons exist but are not authoritative. | `ADDITIVE_NEW_COMPONENT` only after geometry source review. |

## GIO Alignment Matrix

| GIO concern | Current state | Evidence | Alignment status | Reuse opportunity | Gap | Recommendation | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Canonical identity | Property has stable IDs/slugs; city/neighborhood identity is split across Prisma and static files. | `prisma/schema.prisma`, `lib/cities.ts`, `data/cities.ts`, `lib/neighborhoods.ts` | Partial | Reuse property IDs and existing public slugs. | No canonical place ID or alias table. | Define additive GIO identity contract before schema work. | P0 |
| Object lifecycle | Property/listing status exists; EIA governance has lifecycle-like states; places do not. | `Property.status`, EIA enums/models | Partial | Reuse EIA lifecycle language patterns. | No place lifecycle states. | Add proposed/active/limited/deprecated/archived semantics in charter. | P0 |
| Geometry | Property coordinates, static school/landmark points, sample neighborhood polygons. | `Property.lat/lng`, `lib/schools.ts`, `lib/landmarks.ts`, `lib/neighborhoodPolygons.ts` | Partial | Reuse coordinate validation logic. | No geometry source, precision, SRID, effective date, or authoritative boundary model. | Start with points and bbox metadata; defer public polygons. | P0 |
| Relationship metadata | Repository governance has confidence/traceability; GIO geography does not. | `lib/repository/server.ts`, `prisma/schema.prisma` EIA models | Partial outside GIO | Reuse repository relationship design. | No typed geographic relationship table. | Add typed relationship contract in Wave 2 charter. | P0 |
| Source abstraction | MLS Grid client, Supabase fallback, Typesense index, Mapbox geocode, EIA provenance. | `lib/mls/mlsGridClient.ts`, `/api/geocode`, EIA models | Partial | Reuse source-class discipline from EIA. | Public geographic data lacks source registry. | Create GIO source registry before vendor expansion. | P0 |
| Trust metadata | EIA supports confidence/freshness/privacy/provenance; geocode returns source/confidence; search returns health/source. | EIA models, `/api/geocode`, `/api/search` | Partial | Reuse field vocabulary. | City/neighborhood/market data lacks source/freshness/review. | Define trust metadata as required for material facts. | P0 |
| Search eligibility | Search filters by property fields; no object eligibility. | `/api/search`, `lib/search/searchProperties.ts` | Partial | Reuse existing public/contracted access guard. | No object-level search/page/map eligibility. | Add independent eligibility flags in model charter. | P1 |
| Map eligibility | Listing markers/clusters render from valid coordinates. | `components/maps/SearchMap.tsx` | Partial | Preserve stable listing map. | No GIO map layers, zoom density, geometry complexity rules. | Defer object layers until canonical geometry exists. | P1 |
| Page eligibility | City market pages, neighborhood pages, property pages, sitemap city market routes. | `app/market/*`, `app/properties/*`, `app/sitemap.ts` | Partial | Reuse route/page patterns. | No completeness/indexation decision per object; neighborhood pages not in sitemap. | Add page eligibility and indexation state before expansion. | P1 |
| Market observations | Static city stats and market data arrays. | `lib/cities.ts`, `data/marketData.ts`, `data/marketReports.ts` | Weak | Reuse display modules. | Not dated/sourced observations; market area conflated with city. | Create `MarketArea` and `MarketObservation` concepts in charter. | P1 |
| Fair-housing boundary | Public trust docs/pages exist; content avoids some unsafe claims. | `app/fair-housing/page.tsx`, PIE closures | Partial | Reuse trust-safety review posture. | Neighborhood/lifestyle terms and school/demographic expansion need explicit review. | Add fair-housing review gate for all GIO public presentation. | P0 |
| Vendor-agnostic design | MLS Grid and Mapbox exist as integrations; code still abstracts some fallbacks. | `lib/mls/mlsGridClient.ts`, `/api/geocode`, `lib/search/supabaseSearch.ts` | Partial | Reuse fallback/source health patterns. | Future tools could couple object model to providers. | Source registry must model source roles, not vendors. | P0 |

## Real Estate Data Tools Source Matrix

| Source or category | Intelligence domain | Candidate object types | Source authority class | Current use | Potential future use | Access or licensing dependency | Trust considerations | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MLS Grid / MLS services | Market, property, listing media | Property, Market Observation, MLS Area, Market Area | Authoritative industry source | Active bounded listing ingestion and media processing; Typesense indexing. | Dated market observations, inventory counts, listing-to-place enrichment. | Existing MLS credentials/license; display restrictions. | Must distinguish listing facts from market conclusions and participation claims. | P0 |
| Supabase PostgreSQL | Internal source of truth | Property, user/search/alert objects, future GIO tables | First-party enterprise source | Prisma/Supabase search fallback and repository services. | Additive GIO persistence after charter. | Existing DB access; migration authorization required. | Must preserve production write boundaries. | P0 |
| Typesense | Search index | Property search documents, future GIO search docs | First-party/search infrastructure | Active `properties` and `listings` schema/index. | Rebuildable GIO object index after source-of-truth model exists. | Existing service; reset/reindex requires explicit authorization. | Index is not source of truth. | P1 |
| Mapbox geocoding | Geocoding, map support | Property, Address, Point, Landmark | Licensed commercial source | `/api/geocode` uses Mapbox when token configured, local fallback otherwise. | Address resolution, alias hints, candidate point coordinates. | Token/license/display constraints. | Geocode confidence is not authoritative parcel identity. | P1 |
| OpenStreetMap tiles | Map presentation | Map background only | Secondary public/open source | `BoulderMarketMap` uses OSM tile layer. | Base map fallback. | OSM tile policy/attribution. | Tile display is not source evidence for object facts. | P2 |
| County assessor | Public records | Parcel, Property, County, Tax District | Authoritative government source | No direct integration found. | Parcel identity, tax/assessment facts, land attributes. | County-specific access and terms. | Must separate public record facts from valuation/advice. | P1 |
| County clerk and recorder | Public records, title context | Parcel, Property, Covenant Area, HOA, Easement | Authoritative government source | No direct integration found. | Recorded-document links and relationship evidence. | County-specific access; document redistribution limits. | Must avoid legal interpretation. | P2 |
| County/municipal GIS | Geometry, planning | Municipality, Neighborhood, Parcel, Zoning, Special District | Authoritative government source | No direct integration found. | Boundaries, zoning, districts, public facilities. | GIS license/terms vary by jurisdiction. | Geometry precision/effective dates are required. | P1 |
| FEMA / hazard sources | Environmental | Flood Zone, Floodplain, Property context | Authoritative government source | No direct integration found. | Flood-zone context and disclaimers. | Public data access plus display rules. | Must not create property-specific risk/insurance conclusions. | P2 |
| Colorado state agencies | Government, environment, economics | State, County, Environmental Zone, Economic Observation | Authoritative government source | No direct integration found. | Statewide environmental/economic context. | Source-specific terms. | Must retain effective dates and limitations. | P2 |
| U.S. Census / BLS | Demographic/economic | Census Geography, Statistical Area, Economic Observation | Authoritative government source | No direct integration found. | Economic and demographic context if lawful and relevant. | Public datasets; fair-housing review. | Protected-class steering risk; likely internal or carefully scoped public use. | P3 |
| School districts / school resources | Education | School District, School, Attendance Boundary | Authoritative government/education source | Static `lib/schools.ts`; `Property.schoolDistrict` string. | Schools and attendance-boundary objects. | District data and change cadence. | Must disclaim assignment verification and avoid school-quality judgments. | P2 |
| HOA and management records | Community governance | HOA, Covenant Area, Management Company | Public/private mixed source | No direct integration found. | Governance context and document references. | Often private/incomplete/licensed. | Must distinguish recorded facts from privately maintained records. | P3 |
| Title platforms / TitlePro247 | Public records/title research | Parcel, Property, Owner/record context, Document Reference | Licensed commercial source | No active call found; prior docs repeatedly prohibit TitlePro247 calls without authorization. | Manual research workflow or approved integration. | License/access and display restrictions. | High legal/trust boundary; no legal/title conclusions. | P3 |
| Mortgage and financing tools | Financing | Financing Observation, Property context | Licensed commercial/first-party calculated | Future backlog only. | Cost assumptions and calculators. | Provider/API terms if external. | No affordability, approval, or financial advice conclusions. | P3 |
| Consumer research platforms | Lifestyle/amenity | Local Business, Lifestyle Anchor, Amenity | Secondary public/licensed commercial | No direct integration found. | Lifestyle object enrichment if maintained. | Scraping/licensing constraints. | Freshness and subjective-quality risk. | P3 |
| First-party REIE editorial data | Lifestyle, market, property education | Neighborhood, Market Area, Guide, Lifestyle Anchor | First-party enterprise source | `lib/neighborhoods.ts`, `lib/cities.ts`, content/linking modules. | Presentation layer for sourced GIO objects. | Internal editorial review required. | Must mark editorial vs fact/calculation. | P0 |

## Architecture Risk Register

| Risk | Evidence | Impact | Mitigation | Priority |
| --- | --- | --- | --- | --- |
| Duplicate geographic models | `City`/`Neighborhood` Prisma plus `lib/*` and `data/*` records. | Conflicting names/slugs/stats as GIO grows. | Canonical identity registry and migration map before implementation. | P0 |
| Market area / municipality conflation | City market pages use city market slugs as market reports. | Incorrect aggregation and SEO semantics. | Model `MarketArea` separately from `Municipality`. | P0 |
| Boundary ambiguity | Neighborhood polygons are sample coordinates; no authoritative boundary source. | Public map/property enrichment could imply false containment. | Require geometry source/precision/effective date; defer public polygons. | P0 |
| String-based property relationships | Property city/neighborhood/subdivision/schoolDistrict are strings. | Hard to resolve aliases, duplicates, and parent relationships. | Add additive relationship layer rather than replacing property fields immediately. | P0 |
| Thin-page and SEO duplication | Programmatic city/neighborhood/search structures exist; sitemap includes city market pages only. | Scaling pages before content/source readiness could create low-value pages. | Page eligibility, completeness, canonical state, and indexation controls. | P1 |
| Data freshness risk | Static market/neighborhood data lacks source/freshness metadata. | Stale market or risk claims. | Trust metadata with last verified, effective date, and review state. | P0 |
| Vendor coupling | MLS/Grid, Mapbox, Typesense, Supabase all influence runtime. | GIO could accidentally encode vendor-specific fields. | Source-class abstraction and provider adapters. | P0 |
| Licensing/display risk | Future data tools may include licensed sources. | Unauthorized public display or storage. | Source registry with display constraints before ingestion. | P0 |
| Runtime coupling | Search/map/property pages are production-certified. | GIO changes could regress closed programs. | First implementation must be persistence/docs-only or read-only adapter with safety checks. | P0 |
| Migration risk | Prisma/Supabase are production source of truth. | Schema change could affect search, alerts, CRM, MLS. | Additive migrations only after explicit charter and rollback plan. | P0 |
| Fair-housing/trust concerns | Neighborhood, school, demographic, safety, and lifestyle objects are sensitive. | Steering or unsupported claims. | Public-presentation review and prohibited-claim matrix. | P0 |

## Recommended GIO 1.0 Implementation Baseline

Smallest durable baseline:

1. Preserve `Property` as the runtime anchor and do not alter current listing ingestion, search, map, property route, alert, CRM, or email behavior.
2. Add a canonical GIO object contract for launch-value place objects only: `Municipality`, `Neighborhood`, `MarketArea`, `ZipCode`, and `Subdivision`.
3. Add a typed relationship contract before adding object volume: `LOCATED_IN`, `PART_OF`, `WITHIN_ZIP_CODE`, `INCLUDED_IN_MARKET_AREA`, `OBSERVED_BY`, and `RELATED_TO` with source, confidence, effective date, derivation method, review status, and public visibility.
4. Add a source registry and trust metadata vocabulary before importing new tools or vendor data.
5. Connect existing `Property` records to GIO objects through additive property-geographic relationships while preserving current string fields and runtime behavior.
6. Add eligibility fields for search, map, public page, property enrichment, and indexation as independent controls.
7. Produce a mapping plan from current string/static sources to canonical object candidates before any migration.

This baseline is intentionally smaller than the full GIO catalog. It creates a governed object and relationship spine while preserving the certified public runtime.

## Proposed Implementation Waves

| Wave | Scope | Dependencies | Runtime impact | Migration impact | Testing requirements | Reversibility | Customer value | Enterprise value | Launch relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Wave 1 - Discovery & Alignment | This document and handoff update. | Current repo inspection. | None. | None. | `git diff --check`, diff review, status. | Fully reversible docs change. | None direct. | Establishes evidence baseline. | High as governance. |
| Wave 2 - Canonical Core Charter | Draft implementation charter, object contract, relationship contract, source registry contract, safety plan. | Chief Enterprise Architect review. | None if documentation-only. | None. | Docs checks and governance review. | Fully reversible docs change. | None direct. | Defines safe implementation scope. | High. |
| Wave 3 - Additive Persistence Foundation | Add GIO object/source/relationship tables or approved repository-governance extension. | Approved charter, migration plan, rollback plan. | No intended runtime behavior change. | Additive migration only. | Prisma migration review, typecheck, lint, safety checks, DB preflight. | Reversible only with migration rollback plan. | Enables future consistency. | High. |
| Wave 4 - Current Data Mapping | Map existing city/neighborhood/market/static data to candidate GIO records in dry-run/report mode. | Persistence foundation. | None if dry-run first. | Optional seed/mapping only after authorization. | Dry-run report, duplicate/alias checks. | High before writes; medium after seed. | Improves internal understanding. | High. |
| Wave 5 - Read-Only Resolution Adapter | Read-only service to resolve property strings to GIO candidates without changing public pages. | Seeded canonical records and relationships. | None if not wired into public runtime. | None. | Unit tests, no-runtime-change safety check. | High. | None direct. | Medium. |
| Wave 6 - Search/Map/Page Eligibility Preview | Internal preview of GIO eligibility and relationship coverage. | Resolution adapter. | Internal/admin only. | None/additive observations. | Admin safety checks and read-only browser review. | High. | Better future discovery planning. | Medium. |
| Wave 7 - Customer Presentation Integration | Selectively use GIO for public city/neighborhood/property context. | Production certification charter. | Public runtime change. | None or additive reads. | Full public smoke, browser verification, trust checks. | Medium. | High. | Post-charter only. |
| Wave 8 - Data Tool Integration | Evaluate/activate approved external sources by domain. | Source registry, legal/licensing review, operational authorization. | Varies. | Varies. | Source-specific dry-runs and display-safety checks. | Low to medium. | High if governed. | Deferred. |

## Explicit Deferral Register

| Deferred capability | Reason | Revisit condition |
| --- | --- | --- |
| Public polygon boundary rendering | No authoritative geometry source/precision/effective-date model yet. | Source registry and geometry governance approved. |
| Parcel/title/covenant/HOA modeling | Requires county/title/HOA source strategy and legal/display constraints. | Source and licensing review complete. |
| School attendance boundaries | Time-sensitive and assignment-sensitive. | District source strategy plus disclaimer/presentation rules. |
| Environmental hazard zones | High trust and insurance/safety implications. | Authoritative sources, limitation copy, and fair-housing/trust review. |
| Demographic object expansion | Fair-housing steering risk. | Legal/ethical review and narrow public-use rules. |
| New vendor integrations | Work package explicitly prohibits integrations. | Separate approved integration charter. |
| Typesense GIO index | Source-of-truth GIO model does not exist yet. | Persistence and mapping complete; reset/reindex authorization granted. |
| Public page expansion for every object class | Thin-page and freshness risk. | Page eligibility and content completeness thresholds. |
| AI-generated geographic conclusions | Non-goal in GIO architecture. | Separate AI governance and human-review program. |
| Automated valuation, affordability, safety, school-quality, investment, insurance, or legal conclusions | Explicitly outside trust boundary. | Not recommended for GIO 1.0. |

## GIO Object-Class Fit

Launch-value object classes with existing repository evidence:

- `Property`: strong existing source-of-truth model and public route.
- `Municipality`: represented through `lib/cities.ts`, `data/cities.ts`, and city market routes.
- `Neighborhood`: represented through Prisma, static data, market routes, schema, links, and search filters.
- `ZIP Code`: represented on `Property` and in search/index fields, but not as a first-class object.
- `Subdivision`: represented on `Property` and in search/index fields, but not as a first-class object.
- `School District`: represented on `Property` and in search/index fields, but not as a first-class education object.
- `Market Area`: implied by city market routes and market slugs, but not separated from municipality identity.
- `Market Observation`: implied by static stats and market report data, but not modeled as dated observations.
- `Park`, `Trail`, `Open Space`, and `Lifestyle Anchor`: represented editorially as `primaryAnchor` values, but not as reusable objects.

Object classes with insufficient implementation evidence today:

- County, parcel, school, attendance boundary, HOA, special district, zoning district, environmental zone, transit route, transit station, builder, development, utility territory, census geography, and watershed.

These may be valid GIO candidates, but each requires a separate source, licensing, maintenance, and customer-value review before implementation.

## Alignment Findings

### Finding 1 - Property should remain the runtime anchor.

The `Property` model already drives search, maps, alerts, property pages, indexing, photos, inquiry paths, and public decision support. GIO should not replace it. GIO should introduce place objects and relationships that enrich properties without changing property routing or core listing ingestion behavior in the first implementation charter.

### Finding 2 - City and neighborhood data need canonical identity before expansion.

City and neighborhood concepts appear in Prisma, static data, route slugs, Typesense fields, search filters, property links, schema builders, and content modules. GIO Wave 2 should first reconcile identity, canonical slug rules, aliases, and public-page eligibility for this existing footprint before adding more object classes.

### Finding 3 - Market areas must be separated from municipalities.

Existing market URLs use city market slugs such as `/market/boulder-co-housing-market`. GIO should distinguish municipality identity from market-area aggregation, because future market observations may cover MLS areas, neighborhoods, ZIP codes, subdivisions, or custom analytical territories.

### Finding 4 - Current neighborhood intelligence mixes fact, editorial, and calculation.

`lib/neighborhoods.ts` contains useful customer-facing profile data, but it mixes lifestyle descriptions, resilience scores, fire risk labels, insurance complexity, soil profile, construction narrative, and tactical leverage. GIO should separate public facts, editorial interpretation, calculated observations, professional-context prompts, and source-backed risk context.

### Finding 5 - Relationship typing is the major missing foundation.

The repository has `related` links and procedural link builders, but not GIO relationship types such as `LOCATED_IN`, `CONTAINS`, `WITHIN_ATTENDANCE_BOUNDARY`, `NEAR_TRAIL`, `INCLUDED_IN_MARKET_AREA`, or `OBSERVED_BY` with direction, confidence, source, effective date, and public visibility.

### Finding 6 - Geometry must be governed before map-layer expansion.

Map rendering is listing-coordinate based and currently stable. The sample `lib/neighborhoodPolygons.ts` should not be treated as authoritative. Any GIO boundary work needs geometry source, precision, effective date, spatial reference, and review metadata before public rendering or property enrichment.

### Finding 7 - Existing Repository Governance patterns are useful, but not a substitute for GIO.

The enterprise repository already has governance, provenance, object, relationship, coverage, lineage, and recommendation concepts. GIO should borrow governance discipline from that system, but a separate implementation charter must decide whether GIO uses new tables, repository-object extensions, or a hybrid. This discovery does not authorize any persistence design.

## Recommended Wave 2 Charter Scope

The GIO 1.0 Wave 2 Canonical Core Model Charter should remain documentation-only and define only the additive canonical core model boundary.

Minimum recommended Wave 2 scope:

- Define canonical GIO object status enums and identity fields for `Municipality`, `Neighborhood`, `MarketArea`, `ZipCode`, and `Subdivision` candidates.
- Define typed relationship contracts for `Property LOCATED_IN Municipality`, `Property LOCATED_IN Neighborhood`, `Property WITHIN_ZIP_CODE ZIP Code`, `Neighborhood PART_OF Municipality`, `Market Area AGGREGATES Geography`, and `Market Observation OBSERVED_BY Market Area`.
- Define trust metadata fields for source class, source identifier, retrieved date, last verified date, confidence, freshness state, editorial review state, and public visibility.
- Define page, search, map, and property-enrichment eligibility as independent fields.
- Preserve existing `Property`, `/api/search`, `SearchMap`, property pages, market pages, Typesense schemas, CRM, alerts, MLS ingestion, and email behavior during the first additive implementation.

Explicit exclusions for the first implementation charter:

- No wholesale schema replacement.
- No public-page generation expansion.
- No new vendor integration.
- No scraping.
- No AI-generated conclusions.
- No automatic valuations, affordability determinations, safety rankings, school-quality judgments, investment recommendations, insurance determinations, or legal interpretations.
- No route, API, search, map, ingestion, or public-copy behavior change unless separately authorized by a charter.

## Open Architectural Questions

1. Should GIO persistence live as a dedicated geographic object system, an extension of repository-governance objects, or a hybrid with public-runtime tables and governance mirror records?
2. What is the authoritative identity strategy for municipalities, communities, neighborhoods, subdivisions, ZIP codes, and market areas?
3. Which initial sources are legally and operationally approved for city, neighborhood, boundary, school district, ZIP, and market-area identity?
4. Which current static city/neighborhood fields should be retained as editorial presentation data versus converted into sourced facts or calculated observations?
5. What public disclaimers are required for boundaries, school assignments, environmental context, market observations, and lifestyle anchors?
6. What object classes must remain internal-only until licensing, freshness, and fair-housing review are complete?
7. What later trust-specific review is required before `SchoolDistrict`, `School`, or attendance-boundary implementation?

## Decision

`GIO_1.0_WAVE_1_REPOSITORY_DISCOVERY_CERTIFIED_AND_CLOSED`

GIO 1.0 is valid for the REIE. Wave 1 Repository Discovery & Alignment is certified and closed.

Runtime implementation remains blocked until a separately approved implementation package names the scope, persistence strategy, source strategy, validation plan, rollback plan, and production boundaries.

## Next Authorized Action

The Wave 2 charter has been drafted as documentation-only work:

`GIO 1.0 - Wave 2 Canonical Core Model Implementation Charter`

Next recommended authorization is Wave 3 additive persistence-foundation review. The Wave 2 charter does not authorize runtime implementation.
