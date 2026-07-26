# PROJECT ATLAS(tm)

## CGEP 1.0 - Enterprise Geographic Inventory(tm)

Status: `CERTIFIED_PLANNING_FOUNDATION`

CGEP 1.0 STATUS: `CERTIFIED_PLANNING_FOUNDATION`

Inventory date: July 26, 2026

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Initial Operational Coverage: `IRES_SERVICE_TERRITORY`

Implementation authorization: `NOT_AUTHORIZED`

Persistence authorization: `NOT_AUTHORIZED`

Runtime authorization: `NOT_AUTHORIZED`

Customer-facing authorization: `NOT_AUTHORIZED`

---

## 1. Purpose

This inventory catalogs every planned geographic object type defined by the Colorado Geographic Ontology - CGO 1.0 for future statewide geographic governance.

This is a planning inventory only and does not authorize implementation, persistence, retrieval, activation, or customer visibility.

Statewide comparison is a future enterprise objective. It is not acquired, governed, implemented, production-readable, or customer-visible through this inventory.

---

## 2. Inventory Summary

| Category | Planned object types | Initial sequencing posture |
| --- | --- | --- |
| Administrative | `STATE`, `COUNTY`, `MUNICIPALITY`, `CITY`, `TOWN`, `CONSOLIDATED_CITY_COUNTY`, `CENSUS_DESIGNATED_PLACE`, `UNINCORPORATED_COMMUNITY`, `SPECIAL_DISTRICT`, `IMPROVEMENT_DISTRICT` | Foundation first; statewide model before advanced overlays. |
| Community and real estate | `NEIGHBORHOOD`, `COMMUNITY`, `SUBDIVISION`, `PLANNED_COMMUNITY`, `HOA`, `PROPERTY` | Sequenced after administrative identity and source authority are stable; property remains runtime anchor unless separately authorized. |
| Statistical and postal | `ZIP_CODE`, `ZIP_CODE_TABULATION_AREA`, `CENSUS_TRACT`, `CENSUS_BLOCK_GROUP`, `METROPOLITAN_STATISTICAL_AREA`, `MICROPOLITAN_STATISTICAL_AREA` | Sequenced after source and boundary-confidence rules are defined. |
| Education | `SCHOOL_DISTRICT`, `SCHOOL_ATTENDANCE_AREA` | Deferred pending trust-specific review. |
| Market and operational | `MLS_SERVICE_TERRITORY`, `MLS_AREA`, `MARKET_AREA`, `OPERATIONAL_COVERAGE_AREA` | Sequenced after geographic independence and operational-coverage boundaries are stable. |
| Environmental and recreation | `PARK`, `OPEN_SPACE`, `RECREATION_AREA`, `TRAIL_SYSTEM`, `SKI_AREA`, `WATERSHED`, `FLOODPLAIN`, `WILDFIRE_RISK_AREA`, `RIVER_CORRIDOR`, `MOUNTAIN_AREA` | Deferred pending source, freshness, and customer-risk review. |
| Transportation and overlays | `TRANSIT_DISTRICT`, `TRANSIT_CORRIDOR`, `OPPORTUNITY_ZONE`, `HISTORIC_DISTRICT`, `OVERLAY_DISTRICT`, `TAX_DISTRICT`, `UTILITY_SERVICE_AREA` | Deferred pending legal, source, and service-area review. |

---

## 3. Planned Object Type Inventory

| Object type | Domain role | Initial operational coverage | Statewide expansion requirement | Governance responsibility |
| --- | --- | --- | --- | --- |
| `STATE` | Enterprise root geography for Colorado. | Colorado root subject definition. | Must support all Colorado counties, municipalities, postal constructs, and overlays. | Executive geographic governance; source authority review. |
| `COUNTY` | Administrative parent and civic jurisdiction. | IRES-relevant counties first. | Must support all 64 Colorado counties without redesign. | Administrative geography governance; county-source review. |
| `MUNICIPALITY` | Incorporated city or town. | IRES service territory municipalities first; Thornton remains the only current production-internal pilot subject. | Must support all Colorado incorporated places, including multi-county municipalities. | Subject governance; relationship governance for containment and overlap. |
| `CITY` | City label or city-class municipality concept. | IRES city labels after municipality governance. | Must distinguish label from governed object identity statewide. | Identity governance; alias/type reconciliation. |
| `TOWN` | Town label or town-class municipality concept. | IRES town labels after municipality governance. | Must distinguish label from governed object identity statewide. | Identity governance; alias/type reconciliation. |
| `CONSOLIDATED_CITY_COUNTY` | Combined city and county government. | Not initial operational coverage. | Must support Denver-like constructs without forcing single hierarchy. | Administrative governance; relationship governance. |
| `CENSUS_DESIGNATED_PLACE` | Census-recognized non-incorporated place. | IRES-relevant places after county foundation. | Must distinguish statistical place from municipality and postal city. | Statistical/source governance. |
| `UNINCORPORATED_COMMUNITY` | Recognized place outside incorporated municipalities. | IRES-relevant places after county and municipality foundation. | Must support census, postal, local, and editorial place distinctions. | Identity governance; ambiguity review. |
| `SPECIAL_DISTRICT` | Special-purpose governmental district. | Deferred. | Must support overlapping districts statewide. | Civic/legal governance. |
| `IMPROVEMENT_DISTRICT` | Improvement or local district. | Deferred. | Must support overlapping and funding district models statewide. | Civic/legal governance. |
| `NEIGHBORHOOD` | Local residential geography. | IRES-market neighborhoods after authority and identity rules. | Must support city-specific and unincorporated neighborhoods statewide. | Market geography governance; source and editorial separation review. |
| `COMMUNITY` | Customer-facing or editorial community construct. | Not initial implementation; may be IRES-first later. | Must remain distinct from legal, MLS, and administrative objects. | Editorial governance; customer visibility review. |
| `SUBDIVISION` | Recorded, MLS, builder, or locally recognized subdivision. | IRES listing and property-context priority. | Must support source conflicts across MLS, county, builder, and public records. | Source reconciliation governance; property-context review. |
| `PLANNED_COMMUNITY` | Master-planned or phased community. | IRES-relevant candidates after source review. | Must handle phases, builders, name changes, and multiple jurisdictions. | Source authority and lifecycle governance. |
| `HOA` | Homeowners association or covenant-governed area. | Deferred. | Must support legal ambiguity, membership uncertainty, and source limits statewide. | Legal/source governance. |
| `PROPERTY` | Individual real estate asset or listing/parcel context. | Existing runtime anchor only. | Must not be converted into governed geography without separate authorization. | Property-context governance. |
| `ZIP_CODE` | Postal code geography or assignment construct. | IRES service territory postal codes first. | Must support USPS/postal semantics statewide without treating ZIPs as legal boundaries. | Postal-source governance; boundary-confidence review. |
| `ZIP_CODE_TABULATION_AREA` | Census statistical approximation of ZIP geography. | Deferred. | Must distinguish ZCTA from postal ZIP statewide. | Statistical/postal governance. |
| `CENSUS_TRACT` | Census statistical tract. | Deferred. | Must support census vintages statewide. | Statistical governance. |
| `CENSUS_BLOCK_GROUP` | Census statistical block group. | Deferred. | Must support census vintages statewide. | Statistical governance. |
| `METROPOLITAN_STATISTICAL_AREA` | Federal metro statistical area. | Deferred. | Must support federal statistical definitions statewide. | Statistical governance. |
| `MICROPOLITAN_STATISTICAL_AREA` | Federal micro statistical area. | Deferred. | Must support federal statistical definitions statewide. | Statistical governance. |
| `SCHOOL_DISTRICT` | Education jurisdiction. | Deferred. | Must support statewide districts without school-quality conclusions. | Education trust governance. |
| `SCHOOL_ATTENDANCE_AREA` | School assignment or attendance boundary. | Deferred. | Must support source volatility, dates, and disclaimers statewide. | Education trust and customer-risk governance. |
| `MLS_SERVICE_TERRITORY` | MLS coverage or service territory. | IRES service territory as operational focus only. | Must support other MLS/service territories without redesign. | Industry/source governance. |
| `MLS_AREA` | MLS-defined area or label. | IRES-relevant MLS areas after provider/source review. | Must preserve provider-specific semantics statewide. | Industry/source governance. |
| `MARKET_AREA` | Real estate market grouping. | IRES market-area candidates first. | Must support statewide market segmentation without forcing administrative hierarchy. | Enterprise market governance; methodology review. |
| `OPERATIONAL_COVERAGE_AREA` | Enterprise service or operational focus area. | IRES service territory. | Must remain independent from enterprise geographic domain. | Business governance; geographic independence review. |
| `PARK` | Park geography. | Deferred. | Must support statewide park sources and access limits. | Recreation/source governance. |
| `OPEN_SPACE` | Open space or preserved land. | Deferred. | Must support source freshness and access restrictions statewide. | Recreation/environmental governance. |
| `RECREATION_AREA` | Recreation geography. | Deferred. | Must support statewide recreation types and source limits. | Recreation governance. |
| `TRAIL_SYSTEM` | Trail or trail network. | Deferred. | Must support line or network geometry statewide. | Recreation/spatial governance. |
| `SKI_AREA` | Ski area or resort geography. | Deferred. | Must support mountain-market and recreation source boundaries. | Recreation/source governance. |
| `WATERSHED` | Hydrologic drainage geography. | Deferred. | Must support hydrologic hierarchies statewide. | Environmental trust governance. |
| `FLOODPLAIN` | Flood-risk or flood-boundary area. | Deferred. | Must support high-risk source and freshness rules statewide. | High-risk environmental governance. |
| `WILDFIRE_RISK_AREA` | Wildfire hazard or risk area. | Deferred. | Must support high-risk source and freshness rules statewide. | High-risk environmental governance. |
| `RIVER_CORRIDOR` | River or riparian corridor. | Deferred. | Must support line, buffer, and corridor distinctions statewide. | Environmental/spatial governance. |
| `MOUNTAIN_AREA` | Mountain, range, foothill, or mountain-market geography. | Deferred. | Must distinguish editorial, physical, and market meanings. | Environmental/editorial governance. |
| `TRANSIT_DISTRICT` | Transit district or authority area. | Deferred. | Must support service districts statewide. | Transportation/source governance. |
| `TRANSIT_CORRIDOR` | Transit route, corridor, or station geography. | Deferred. | Must support line and corridor semantics statewide. | Transportation/spatial governance. |
| `OPPORTUNITY_ZONE` | Incentive or policy geography. | Deferred. | Must support legal/source effective dates statewide. | Economic/legal governance. |
| `HISTORIC_DISTRICT` | Historic designation area. | Deferred. | Must support designation source and restrictions statewide. | Legal/source governance. |
| `OVERLAY_DISTRICT` | Planning, zoning, taxation, or policy overlay. | Deferred. | Must support overlapping overlays statewide. | Legal/planning governance. |
| `TAX_DISTRICT` | Taxing district or revenue district. | Deferred. | Must support overlapping and effective-date rules statewide. | Legal/tax governance. |
| `UTILITY_SERVICE_AREA` | Utility provider service area. | Deferred. | Must support provider-specific service coverage statewide. | Utility/source governance. |

---

## 4. Inventory Boundaries

This inventory is not:

- a schema design;
- a migration plan;
- a source integration plan;
- a data acquisition authorization;
- an approval record;
- a persistence authorization;
- a runtime contract;
- a customer-visible feature plan.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/CGEP-1.0-ENTERPRISE-GEOGRAPHIC-INVENTORY.md -->
