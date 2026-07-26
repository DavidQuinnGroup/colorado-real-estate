# PROJECT ATLAS(tm)

## CGEP 1.0 - Colorado Geographic Coverage Matrix(tm)

Status: `CERTIFIED_PLANNING_FOUNDATION`

CGEP 1.0 STATUS: `CERTIFIED_PLANNING_FOUNDATION`

Matrix date: July 26, 2026

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Initial Operational Coverage: `IRES_SERVICE_TERRITORY`

Implementation authorization: `NOT_AUTHORIZED`

Persistence authorization: `NOT_AUTHORIZED`

Runtime authorization: `NOT_AUTHORIZED`

Customer-facing authorization: `NOT_AUTHORIZED`

---

## 1. Purpose

This matrix distinguishes the planning, acquisition, governance, implementation, and customer-visibility state for each planned CGEP object type. It is documentation-only and does not authorize any state transition.

---

## 2. Coverage State Definitions

| State | Meaning |
| --- | --- |
| `PLANNED` | The object type is included in the statewide enterprise taxonomy. |
| `ACQUIRED` | Source evidence has been collected for governed review. |
| `GOVERNED` | Governance review, lifecycle state, confidence, authority, and eligibility are recorded. |
| `IMPLEMENTED` | Source code, schema, persistence, read, or internal runtime capability exists for an authorized scope. |
| `CUSTOMER_VISIBLE` | A customer-facing activation gate has approved public use. |

Rules:

- Planned does not imply acquired.
- Acquired does not imply governed.
- Governed does not imply implemented.
- Implemented does not imply customer-visible.
- Customer-visible requires a separate activation decision.

---

## 3. Coverage Matrix

| Object type | Planned | Acquired | Governed | Implemented | Customer-visible | Current note |
| --- | --- | --- | --- | --- | --- | --- |
| `STATE` | Yes | No | No | No | No | Colorado root subject remains framework-defined only. |
| `COUNTY` | Yes | No | No | No | No | County relationships remain deferred. |
| `MUNICIPALITY` | Yes | Partial | Partial | Partial internal only | No | Thornton is the only certified production-internal pilot subject; broad municipality coverage remains unauthorized. |
| `CITY` | Yes | No | No | No | No | City remains a label/type candidate until CGO review. |
| `TOWN` | Yes | No | No | No | No | Town remains a label/type candidate until CGO review. |
| `CONSOLIDATED_CITY_COUNTY` | Yes | No | No | No | No | Future-governed only. |
| `CENSUS_DESIGNATED_PLACE` | Yes | No | No | No | No | Future-governed only. |
| `UNINCORPORATED_COMMUNITY` | Yes | No | No | No | No | Future-governed only. |
| `SPECIAL_DISTRICT` | Yes | No | No | No | No | Deferred civic/legal object. |
| `IMPROVEMENT_DISTRICT` | Yes | No | No | No | No | Deferred civic/legal object. |
| `NEIGHBORHOOD` | Yes | No | No | Schema/object type only | Existing public copy/routes are legacy runtime, not CGEP visibility | Existing REIE references do not constitute governed CGEP activation. |
| `COMMUNITY` | Yes | No | No | No | No | Future editorial/customer governance required. |
| `SUBDIVISION` | Yes | No | No | Schema/object type only | No | Future source reconciliation required. |
| `PLANNED_COMMUNITY` | Yes | No | No | No | No | Future builder/plat/source governance required. |
| `HOA` | Yes | No | No | No | No | Deferred legal/source review. |
| `PROPERTY` | Yes | Existing runtime data only | No CGEP governance | Existing runtime only | Existing property pages are legacy runtime, not CGEP visibility | Property is not converted into governed geography. |
| `ZIP_CODE` | Yes | No | No | Schema/object type only | Existing search/property usage is legacy runtime, not CGEP visibility | Postal governance remains unauthorized. |
| `ZIP_CODE_TABULATION_AREA` | Yes | No | No | No | No | Deferred statistical/postal object. |
| `CENSUS_TRACT` | Yes | No | No | No | No | Deferred statistical object. |
| `CENSUS_BLOCK_GROUP` | Yes | No | No | No | No | Deferred statistical object. |
| `METROPOLITAN_STATISTICAL_AREA` | Yes | No | No | No | No | Deferred statistical object. |
| `MICROPOLITAN_STATISTICAL_AREA` | Yes | No | No | No | No | Deferred statistical object. |
| `SCHOOL_DISTRICT` | Yes | No | No | No | No | Deferred education trust review. |
| `SCHOOL_ATTENDANCE_AREA` | Yes | No | No | No | No | Deferred high-risk education boundary review. |
| `MLS_SERVICE_TERRITORY` | Yes | No | No | No | No | IRES service territory remains operational focus, not governed MLS integration. |
| `MLS_AREA` | Yes | No | No | No | No | Deferred industry/source object. |
| `MARKET_AREA` | Yes | No | No | Schema/object type only | No | Future market governance required. |
| `OPERATIONAL_COVERAGE_AREA` | Yes | No | No | No | No | IRES coverage is current business focus only. |
| `PARK` | Yes | No | No | No | No | Deferred recreation object. |
| `OPEN_SPACE` | Yes | No | No | No | No | Deferred recreation/environmental object. |
| `RECREATION_AREA` | Yes | No | No | No | No | Deferred recreation object. |
| `TRAIL_SYSTEM` | Yes | No | No | No | No | Deferred recreation/spatial object. |
| `SKI_AREA` | Yes | No | No | No | No | Deferred recreation object. |
| `WATERSHED` | Yes | No | No | No | No | Deferred environmental object. |
| `FLOODPLAIN` | Yes | No | No | No | No | Deferred high-risk environmental object. |
| `WILDFIRE_RISK_AREA` | Yes | No | No | No | No | Deferred high-risk environmental object. |
| `RIVER_CORRIDOR` | Yes | No | No | No | No | Deferred environmental/spatial object. |
| `MOUNTAIN_AREA` | Yes | No | No | No | No | Deferred environmental/editorial object. |
| `TRANSIT_DISTRICT` | Yes | No | No | No | No | Deferred transportation object. |
| `TRANSIT_CORRIDOR` | Yes | No | No | No | No | Deferred transportation object. |
| `OPPORTUNITY_ZONE` | Yes | No | No | No | No | Deferred economic/legal overlay. |
| `HISTORIC_DISTRICT` | Yes | No | No | No | No | Deferred legal/source overlay. |
| `OVERLAY_DISTRICT` | Yes | No | No | No | No | Deferred planning/legal overlay. |
| `TAX_DISTRICT` | Yes | No | No | No | No | Deferred tax/legal overlay. |
| `UTILITY_SERVICE_AREA` | Yes | No | No | No | No | Deferred utility/service object. |

---

## 4. Domain Coverage Interpretation

The enterprise geographic domain is statewide, but the current CGEP coverage state is primarily planned-only. IRES service territory is the initial operational coverage for future sequencing, not a limit on statewide architecture.

Existing public pages, static city data, property fields, search filters, schema strings, and editorial content are not CGEP customer-visible activation unless a future CGEP activation gate explicitly approves them as such.

---

## 5. Matrix Boundaries

This matrix does not authorize:

- acquiring new source data;
- approving object types;
- approving Colorado as a governed subject;
- approving counties;
- approving relationships;
- implementing schema or source code;
- exposing customer-facing geography.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/CGEP-1.0-COLORADO-GEOGRAPHIC-COVERAGE-MATRIX.md -->
