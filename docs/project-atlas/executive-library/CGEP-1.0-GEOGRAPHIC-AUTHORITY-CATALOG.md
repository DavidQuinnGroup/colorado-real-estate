# PROJECT ATLAS(tm)

## CGEP 1.0 - Geographic Authority Catalog(tm)

Status: `CERTIFIED_PLANNING_FOUNDATION`

CGEP 1.0 STATUS: `CERTIFIED_PLANNING_FOUNDATION`

Catalog date: July 26, 2026

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Initial Operational Coverage: `IRES_SERVICE_TERRITORY`

Implementation authorization: `NOT_AUTHORIZED`

Persistence authorization: `NOT_AUTHORIZED`

Runtime authorization: `NOT_AUTHORIZED`

Customer-facing authorization: `NOT_AUTHORIZED`

---

## 1. Purpose

This catalog associates each planned geographic object type with likely authoritative source classes and governance responsibilities. It is a planning catalog only. It does not authorize source integration, production reads, production writes, external data ingestion, customer display, or automated conclusions.

`PROJECT ATLAS - REAL ESTATE DATA TOOLS` remains the canonical provider/source inventory supporting CGEP 1.0 and this Geographic Authority Catalog. This catalog classifies source authority and governance responsibility; it does not rewrite provider contents or authorize provider integration.

---

## 2. Authority Classes

| Authority class | Role |
| --- | --- |
| `AUTHORITATIVE_GOVERNMENT` | Primary support for state, county, municipal, parcel, district, planning, and boundary claims when the source governs the specific claim. |
| `AUTHORITATIVE_INDUSTRY` | Support for MLS, listing-market, and industry-defined real estate constructs within license and display limits. |
| `FIRST_PARTY_ENTERPRISE` | Support for explicitly governed REIE market, region, editorial, or operational constructs. |
| `LICENSED_COMMERCIAL` | Supplemental or operational support where license, attribution, and display rights permit. |
| `SECONDARY_PUBLIC` | Supplemental context only; not primary authority for high-risk or legal claims. |
| `EDITORIAL` | Narrative and customer-facing context; cannot establish governed facts alone. |

---

## 3. Object-Type Authority Catalog

| Object type | Primary authority source classes | Supplemental source classes | Governance responsibility |
| --- | --- | --- | --- |
| `STATE` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `FIRST_PARTY_ENTERPRISE` | Verify Colorado root identity, aliases, legal/civic status, and statewide domain boundaries. |
| `COUNTY` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern county identity, aliases, boundary evidence, and county-to-state relationships. |
| `MUNICIPALITY` | `AUTHORITATIVE_GOVERNMENT` | `AUTHORITATIVE_INDUSTRY`, `SECONDARY_PUBLIC`, `FIRST_PARTY_ENTERPRISE` | Govern incorporated-place identity, multi-county status, aliases, and administrative relationships. |
| `CITY` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern whether city is label, alias, or municipality subtype. |
| `TOWN` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern whether town is label, alias, or municipality subtype. |
| `CONSOLIDATED_CITY_COUNTY` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC` | Govern combined city/county semantics without collapsing hierarchy. |
| `CENSUS_DESIGNATED_PLACE` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern statistical place identity distinct from municipality and postal city. |
| `UNINCORPORATED_COMMUNITY` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `EDITORIAL`, `LICENSED_COMMERCIAL` | Separate census, postal, local, and editorial place identity. |
| `SPECIAL_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern overlapping district identity and authority basis. |
| `IMPROVEMENT_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern improvement district purpose, funding, and boundaries. |
| `NEIGHBORHOOD` | `FIRST_PARTY_ENTERPRISE` | `AUTHORITATIVE_INDUSTRY`, `SECONDARY_PUBLIC`, `EDITORIAL` | Govern local-name evidence, boundaries where available, and editorial separation. |
| `MARKET_AREA` | `FIRST_PARTY_ENTERPRISE`, `AUTHORITATIVE_INDUSTRY` | `LICENSED_COMMERCIAL`, `EDITORIAL` | Govern market methodology, effective dates, and intended use. |
| `SUBDIVISION` | `AUTHORITATIVE_GOVERNMENT`, `AUTHORITATIVE_INDUSTRY` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC`, `EDITORIAL` | Reconcile recorded, MLS, builder, and local-name conflicts. |
| `PLANNED_COMMUNITY` | `AUTHORITATIVE_GOVERNMENT`, `AUTHORITATIVE_INDUSTRY`, `LICENSED_COMMERCIAL` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern builder, plat, phase, and market naming evidence. |
| `HOA` | `AUTHORITATIVE_GOVERNMENT`, `LICENSED_COMMERCIAL` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern legal ambiguity, covenant source, and membership uncertainty. |
| `PROPERTY` | `AUTHORITATIVE_GOVERNMENT`, `AUTHORITATIVE_INDUSTRY`, `FIRST_PARTY_ENTERPRISE` | `LICENSED_COMMERCIAL` | Preserve property as runtime anchor unless separate conversion is authorized. |
| `ZIP_CODE` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `AUTHORITATIVE_INDUSTRY` | Preserve postal semantics and avoid treating ZIPs as legal boundaries. |
| `ZIP_CODE_TABULATION_AREA` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC` | Govern census statistical semantics distinct from postal ZIPs. |
| `CENSUS_TRACT` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC` | Govern census vintage and statistical geography. |
| `CENSUS_BLOCK_GROUP` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC` | Govern census vintage and sub-tract statistical geography. |
| `METROPOLITAN_STATISTICAL_AREA` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern federal statistical area definitions. |
| `MICROPOLITAN_STATISTICAL_AREA` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern federal statistical area definitions. |
| `SCHOOL_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC` | Govern education-boundary evidence without school-quality conclusions. |
| `SCHOOL_ATTENDANCE_AREA` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL` | Govern volatility, effective dates, and high-risk display limitations. |
| `MLS_SERVICE_TERRITORY` | `AUTHORITATIVE_INDUSTRY` | `FIRST_PARTY_ENTERPRISE`, `SECONDARY_PUBLIC` | Govern provider territory without creating integration. |
| `MLS_AREA` | `AUTHORITATIVE_INDUSTRY` | `FIRST_PARTY_ENTERPRISE`, `LICENSED_COMMERCIAL` | Govern provider-specific labels and license limits. |
| `OPERATIONAL_COVERAGE_AREA` | `FIRST_PARTY_ENTERPRISE` | `AUTHORITATIVE_INDUSTRY`, `EDITORIAL` | Govern business focus without constraining enterprise geography. |
| `PARK` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern park identity, access, and display limits. |
| `OPEN_SPACE` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern open-space identity, restrictions, and freshness. |
| `RECREATION_AREA` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern recreation geography and customer-risk limits. |
| `TRAIL_SYSTEM` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern line/network source and freshness. |
| `SKI_AREA` | `AUTHORITATIVE_GOVERNMENT`, `LICENSED_COMMERCIAL` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern ski area identity, boundary, and provider limits. |
| `WATERSHED` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL`, `SECONDARY_PUBLIC` | Govern hydrologic hierarchy and high-trust source. |
| `FLOODPLAIN` | `AUTHORITATIVE_GOVERNMENT` | `LICENSED_COMMERCIAL` | Govern high-risk flood source, freshness, and non-advisory limits. |
| `WILDFIRE_RISK_AREA` | `AUTHORITATIVE_GOVERNMENT`, `LICENSED_COMMERCIAL` | `SECONDARY_PUBLIC` | Govern high-risk wildfire source, freshness, and non-advisory limits. |
| `RIVER_CORRIDOR` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern river, buffer, and corridor distinctions. |
| `MOUNTAIN_AREA` | `AUTHORITATIVE_GOVERNMENT`, `FIRST_PARTY_ENTERPRISE` | `SECONDARY_PUBLIC`, `EDITORIAL` | Govern physical, market, and editorial distinctions. |
| `TRANSIT_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern transit authority and service area evidence. |
| `TRANSIT_CORRIDOR` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern route, line, station, and corridor semantics. |
| `OPPORTUNITY_ZONE` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern legal/economic designation and effective dates. |
| `HISTORIC_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern historic designation and restrictions. |
| `OVERLAY_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern planning, zoning, policy, or tax overlay basis. |
| `TAX_DISTRICT` | `AUTHORITATIVE_GOVERNMENT` | `SECONDARY_PUBLIC`, `LICENSED_COMMERCIAL` | Govern taxing authority, overlap, and effective dates. |
| `UTILITY_SERVICE_AREA` | `AUTHORITATIVE_GOVERNMENT`, `LICENSED_COMMERCIAL` | `SECONDARY_PUBLIC` | Govern provider service area and display limits. |

---

## 4. Governance Responsibility Model

Every future object-type package must identify:

- claim type;
- primary authority class;
- accepted source names;
- source freshness expectations;
- display and license limitations;
- reviewer responsibility;
- conflict policy;
- confidence vocabulary;
- lifecycle transitions;
- eligibility limits;
- rollback or retirement posture.

No source class in this catalog authorizes a vendor integration or external data acquisition.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/CGEP-1.0-GEOGRAPHIC-AUTHORITY-CATALOG.md -->
