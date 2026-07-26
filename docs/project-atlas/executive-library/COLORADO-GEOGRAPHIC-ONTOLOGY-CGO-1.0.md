# PROJECT ATLAS(tm)

## Colorado Geographic Ontology - CGO 1.0

Status: `CERTIFIED_GOVERNANCE_FOUNDATION`

CGO 1.0 STATUS: `CERTIFIED_GOVERNANCE_FOUNDATION`

GEOGRAPHIC CONSTITUTION STATUS: `CERTIFIED_AND_ESTABLISHED`

Ontology date: July 26, 2026

Repository baseline: `9bee379964a938f805b4bc5a27d34e2955a7dcd9`

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Operational Coverage: `IRES_SERVICE_TERRITORY`

Implementation authorization: `NOT_AUTHORIZED`

Persistence authorization: `NOT_AUTHORIZED`

Retrieval authorization: `NOT_AUTHORIZED`

Runtime authorization: `NOT_AUTHORIZED`

Customer activation authorization: `NOT_AUTHORIZED`

---

## 1. Constitutional Role

CGF 1.0 and CGO 1.0 are the two permanent geographic pillars of PROJECT ATLAS.

Together they form the Geographic Constitution(tm).

The Colorado Geographic Framework(tm), CGF 1.0, governs how the enterprise thinks about and governs geography.

The Colorado Geographic Ontology(tm), CGO 1.0, governs what geographic concepts mean.

The Colorado Geographic Expansion Program(tm), CGEP 1.0, must derive its inventory, authority catalog, coverage matrix, and implementation roadmap from CGO.

CGO 1.0 is semantic and constitutional. It is not an implementation schema, Prisma design, source-ingestion plan, persistence contract, read adapter, route plan, customer-experience plan, or data population authorization.

Canonical terminology:

- Geographic Constitution(tm)
- Colorado Geographic Framework(tm)
- Colorado Geographic Ontology(tm)
- Colorado Geographic Expansion Program(tm)
- Enterprise Geographic Domain
- Operational Coverage
- Customer Experience Coverage
- Geographic Independence Principle(tm)
- Geographic Activation Principle(tm)
- Geographic Extensibility Principle(tm)

Canonical display terminology:

- Geographic Constitution™
- Colorado Geographic Framework™
- Colorado Geographic Ontology™
- Colorado Geographic Expansion Program™
- Geographic Independence Principle™
- Geographic Activation Principle™
- Geographic Extensibility Principle™

---

## 2. Geographic Object Ontology

An object type is a governed semantic class. A label, alias, abbreviation, source code, slug, MLS area string, postal string, or customer-facing phrase is not an object type by itself.

CGO 1.0 defines the following planned object families. Inclusion in the ontology does not imply that any object type is currently acquired, governed, implemented, production-readable, or customer-visible.

### Administrative

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `STATE` | Statewide civic root context, currently Colorado for the enterprise domain. | Semantic only; not implemented. |
| `COUNTY` | County or county-equivalent administrative jurisdiction. | Semantic only; not implemented. |
| `MUNICIPALITY` | Incorporated municipal government unit. | Existing first-scope type; only Thornton has limited production-internal pilot evidence. |
| `CITY` | Municipal label commonly used for an incorporated city; may map to `MUNICIPALITY` after governance. | Semantic label/type candidate only. |
| `TOWN` | Municipal label commonly used for an incorporated town; may map to `MUNICIPALITY` after governance. | Semantic label/type candidate only. |
| `CONSOLIDATED_CITY_COUNTY` | Combined city and county government construct. | Semantic only; not implemented. |
| `CENSUS_DESIGNATED_PLACE` | Census-recognized place that may not be incorporated. | Semantic only; not implemented. |
| `UNINCORPORATED_COMMUNITY` | Locally recognized community outside municipal incorporation. | Semantic only; not implemented. |
| `SPECIAL_DISTRICT` | Special-purpose governmental district. | Semantic only; not implemented. |
| `IMPROVEMENT_DISTRICT` | Improvement, local, or quasi-governmental district with defined purpose or funding scope. | Semantic only; not implemented. |

### Community And Real Estate

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `NEIGHBORHOOD` | Locally meaningful residential area, often source-dependent or editorially mediated. | Existing first-scope type; no broad activation. |
| `COMMUNITY` | Customer-facing or enterprise community construct distinct from legal jurisdiction. | Semantic only; not implemented. |
| `SUBDIVISION` | Recorded, MLS, builder, or locally recognized subdivision construct. | Existing first-scope type; no broad activation. |
| `PLANNED_COMMUNITY` | Master-planned, phased, or planned residential community. | Semantic only; not implemented. |
| `HOA` | Homeowners association or covenant-governed community area. | Semantic only; high-trust review required. |
| `PROPERTY` | Individual real estate asset or listing/parcel context; not automatically a GIO object. | Existing runtime anchor only; no CGO conversion authorization. |

### Statistical And Postal

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `ZIP_CODE` | Postal assignment construct; not a legal boundary. | Existing first-scope type; no broad activation. |
| `ZIP_CODE_TABULATION_AREA` | Census statistical approximation of ZIP Code geography. | Semantic only; not implemented. |
| `CENSUS_TRACT` | Census statistical geography. | Semantic only; not implemented. |
| `CENSUS_BLOCK_GROUP` | Census statistical geography below tract level. | Semantic only; not implemented. |
| `METROPOLITAN_STATISTICAL_AREA` | Federal statistical metro area. | Semantic only; not implemented. |
| `MICROPOLITAN_STATISTICAL_AREA` | Federal statistical micro area. | Semantic only; not implemented. |

### Education

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `SCHOOL_DISTRICT` | Education jurisdiction or district. | Semantic only; trust-specific review required. |
| `SCHOOL_ATTENDANCE_AREA` | School assignment or attendance boundary. | Semantic only; trust-specific review required. |

### Market And Operational

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `MLS_SERVICE_TERRITORY` | MLS service or coverage territory. | Semantic only; no provider integration. |
| `MLS_AREA` | MLS-defined or MLS-used area label or grouping. | Semantic only; no provider integration. |
| `MARKET_AREA` | Governed real estate market grouping. | Existing first-scope type; no broad activation. |
| `OPERATIONAL_COVERAGE_AREA` | Enterprise business focus or service coverage construct. | Semantic only; does not constrain domain. |

### Environmental And Recreation

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `PARK` | Public or private park geography. | Semantic only; not implemented. |
| `OPEN_SPACE` | Open space, preserved land, or recreation-adjacent area. | Semantic only; not implemented. |
| `RECREATION_AREA` | Outdoor recreation area. | Semantic only; not implemented. |
| `TRAIL_SYSTEM` | Trail, path, or connected trail network. | Semantic only; not implemented. |
| `SKI_AREA` | Ski resort or ski terrain geography. | Semantic only; not implemented. |
| `WATERSHED` | Hydrologic drainage geography. | Semantic only; high-trust review required. |
| `FLOODPLAIN` | Flood-risk or flood-boundary area. | Semantic only; high-risk review required. |
| `WILDFIRE_RISK_AREA` | Wildfire risk or hazard geography. | Semantic only; high-risk review required. |
| `RIVER_CORRIDOR` | River, riparian, or river-adjacent corridor. | Semantic only; not implemented. |
| `MOUNTAIN_AREA` | Mountain, range, foothills, or mountain-market geography. | Semantic only; not implemented. |

### Transportation And Overlays

| Object type | Meaning | Current authorization status |
| --- | --- | --- |
| `TRANSIT_DISTRICT` | Transit service district or authority area. | Semantic only; not implemented. |
| `TRANSIT_CORRIDOR` | Transit route, corridor, or station-oriented geography. | Semantic only; not implemented. |
| `OPPORTUNITY_ZONE` | Incentive or policy geography. | Semantic only; legal/source review required. |
| `HISTORIC_DISTRICT` | Historic preservation or designation geography. | Semantic only; legal/source review required. |
| `OVERLAY_DISTRICT` | Planning, zoning, taxation, or policy overlay. | Semantic only; legal/source review required. |
| `TAX_DISTRICT` | Taxing district or revenue district. | Semantic only; legal/source review required. |
| `UTILITY_SERVICE_AREA` | Utility service provider area. | Semantic only; source review required. |

---

## 3. Identity Ontology

Enterprise geographic identity consists of:

- stable enterprise subject identifier;
- canonical name;
- display name;
- aliases;
- source identifiers;
- object type;
- authority domain;
- lifecycle state;
- effective period;
- geometry availability;
- provenance.

Identity rules:

- Names are not themselves enterprise identity.
- Abbreviations are not themselves enterprise identity.
- Source IDs are not themselves enterprise identity.
- Slugs are not themselves enterprise identity.
- Existing storage identifiers are not themselves business identity.
- Enterprise identity must preserve ambiguity until a governed decision resolves it.

---

## 4. Relationship Ontology

| Relationship | Meaning | Directionality | Inverse | Symmetry | Multiplicity | Evidence expectations | Governance risks | Current authorization status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CONTAINS` | Source contains target under a governed basis. | Directed | `WITHIN` | Not symmetric | One-to-many or many-to-many depending basis | Administrative, spatial, or source-defined containment evidence. | Duplicate inverse records; circular containment; false single-parent hierarchy. | Gate 2 limited-scope vocabulary approval for governed administrative containment only; no facts, implementation, persistence, or retrieval. |
| `WITHIN` | Source is within target under a governed basis. | Directed | `CONTAINS` | Not symmetric | Many-to-one or many-to-many depending basis | Same evidence basis as `CONTAINS`. | Multi-county municipalities; partial containment; inferred containment from weak sources. | Gate 2 limited-scope vocabulary approval for governed administrative containment only; no facts, implementation, persistence, or retrieval. |
| `OVERLAPS` | Source and target share partial geography. | Symmetric or directed with basis | Usually self-inverse | Often symmetric | Many-to-many | Boundary or source-defined overlap evidence. | Confusing overlap with containment. | Semantic only; not authorized. |
| `INTERSECTS` | Source geometry intersects target geometry. | Symmetric or directed with basis | Usually self-inverse | Often symmetric | Many-to-many | Geometry evidence with date, precision, and method. | Spatial false positives; geometry freshness. | Semantic only; not authorized. |
| `ADJACENT_TO` | Source borders or is next to target. | Symmetric | Usually self-inverse | Symmetric | Many-to-many | Boundary or adjacency evidence. | Ambiguous distance threshold. | Semantic only; not authorized. |
| `SUPERSEDES` | Source replaces or succeeds target over time. | Directed temporal | `SUPERSEDED_BY` | Not symmetric | One-to-one or one-to-many | Lifecycle, merger, rename, or source-history evidence. | Loss of audit trail. | Semantic only; not authorized. |
| `RELATED_MARKET` | Source has a market relationship to target without strict hierarchy. | Directed or symmetric by method | Method-specific | Method-specific | Many-to-many | Market methodology and effective period. | Editorial or business bias treated as fact. | Semantic only; not authorized. |
| `SERVED_BY` | Source geography is served by provider, authority, district, or coverage area. | Directed | `SERVES` | Not symmetric | Many-to-many | Service territory or provider authority evidence. | Service coverage confused with legal geography. | Semantic only; not authorized. |
| `MEMBER_OF` | Source is a member of a group, program, region, or collection. | Directed | `HAS_MEMBER` | Not symmetric | Many-to-many | Membership or grouping evidence. | Grouping confused with containment. | Semantic only; not authorized. |
| `PART_OF` | Source participates in a broader construct without strict containment. | Directed | `HAS_PART` | Not symmetric | Many-to-many | Source or enterprise methodology evidence. | Collapsing multiple hierarchies into one tree. | Semantic only; not authorized. |

Only `CONTAINS` and `WITHIN` have Gate 2 limited-scope approval for governed administrative-containment vocabulary. This does not authorize relationship facts, implementation, persistence, retrieval, runtime use, or customer visibility.

---

## 5. Attribute Ontology

Reusable attribute domains:

| Attribute domain | Examples | Semantic category |
| --- | --- | --- |
| Identity | canonical name, display name, alias, slug, source identifier | Intrinsic object attributes. |
| Administrative | jurisdiction, government type, county, incorporation status | Intrinsic or relationship attributes. |
| Demographic | population, household count, census profile | Time-series observations or derived indicators. |
| Housing | housing stock, tenure, permits, subdivision count | Time-series observations or derived indicators. |
| Market | median price, inventory, absorption, days on market | Time-series observations or derived indicators. |
| Education | district, attendance area, school assignment note | Relationship attributes or restricted observations. |
| Environmental | flood, wildfire, watershed, open space | Restricted observations or relationship attributes. |
| Transportation | transit access, corridor, commute context | Observations, derived indicators, or presentation fields. |
| Lifestyle | community narrative, amenities, recreation | Customer-facing presentation fields or editorial attributes. |
| Economic | employment, income, tax district, incentives | Observations or derived indicators. |
| Governance | lifecycle, eligibility, review status, approval state | Governance attributes. |
| Provenance | source, effective date, retrieval date, reviewer, confidence | Provenance attributes. |

Attribute distinctions:

- intrinsic object attributes describe the object itself;
- time-series observations vary by date or period;
- derived indicators are calculated and must retain method;
- relationship attributes describe a specific relationship;
- customer-facing presentation fields require activation review.

---

## 6. Geometry Semantics

| Geometry state | Meaning |
| --- | --- |
| `POINT` | A coordinate or representative location. |
| `LINE` | A route, corridor, trail, river, or linear geography. |
| `POLYGON` | A single bounded area. |
| `MULTIPOLYGON` | Multiple bounded areas represented as one object. |
| `NO_GOVERNED_GEOMETRY` | No approved geometry exists. |
| `APPROXIMATE_GEOMETRY` | Geometry is approximate, derived, generalized, or presentation-only. |
| `AUTHORITATIVE_GEOMETRY` | Geometry is sourced from an authority valid for the specific claim. |
| `DERIVED_GEOMETRY` | Geometry is calculated from other governed geometry or source data. |

Geometry presence does not authorize spatial relationships. Spatial relationships require separate relationship governance, evidence, confidence, and authorization.

---

## 7. Multiplicity And Hierarchy Rules

- Colorado is the enterprise root context for the current statewide domain.
- A municipality may span multiple counties.
- A geographic subject may have multiple valid contextual parents.
- Administrative, statistical, operational, and market hierarchies must not be collapsed into one universal tree.
- A neighborhood may have editorial or source-dependent boundaries.
- ZIP Codes, school areas, market areas, and municipal boundaries may overlap.
- Property relationships may be many-to-many.
- Circular containment is invalid.
- Duplicate inverse relationships must be governed consistently.

---

## 8. Confidence And Evidence Semantics

| Confidence | Meaning |
| --- | --- |
| `AUTHORITATIVE` | Supported by the governing source for the specific claim. |
| `CORROBORATED` | Multiple compatible sources support the claim. |
| `DERIVED` | Produced by governed calculation, spatial process, or normalization. |
| `EDITORIAL` | Human-authored context or presentation, not authoritative fact. |
| `DISPUTED` | Sources conflict and require governance resolution. |
| `INCOMPLETE` | Evidence is missing, stale, insufficient, or not yet reviewed. |

Evidence strength, quality, readiness, approval, and activation are separate concepts:

- evidence strength != quality;
- quality != readiness;
- readiness != approval;
- approval != activation;
- activation != customer visibility.

---

## 9. Lifecycle And Status Semantics

CGO 1.0 aligns with existing governed lifecycle stages and does not invent a conflicting lifecycle.

Canonical lifecycle semantics:

- `CONCEPTUAL`: known idea or place concept only;
- `CANDIDATE`: selected for evidence gathering;
- `ACQUIRED`: evidence collected;
- `CLASSIFIED`: object type and domain class reviewed;
- `MAPPED`: identity, aliases, and conflicts reviewed;
- `QUALITY_PASSED`: quality rules passed;
- `READINESS_QUALIFIED`: purpose-specific readiness review complete;
- `APPROVED`: governed approval decision recorded;
- `PERSISTENCE_AUTHORIZED`: separate persistence gate approved;
- `PRODUCTION_READ_AUTHORIZED`: separate retrieval gate approved;
- `CONSUMPTION_AUTHORIZED`: specific enterprise consumer approved;
- `CUSTOMER_VISIBLE_AUTHORIZED`: public/customer activation approved;
- `RETIRED`: active use ended while preserving audit history.

---

## 10. Coverage And Activation Semantics

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Operational Coverage: initially `IRES_SERVICE_TERRITORY`

Customer Experience Coverage: `NOT_AUTHORIZED`

Feature Activation: `NOT_AUTHORIZED`

Customer Visibility: `NOT_AUTHORIZED`

### Geographic Independence Principle(tm) - EGP-001

Enterprise geographic knowledge shall never be constrained by the current business footprint. Operational business focus may change without requiring redesign of enterprise geographic architecture.

### Geographic Activation Principle(tm) - EGP-002

Knowledge availability does not imply customer availability. Geographic capabilities become customer-visible only through explicit product activation.

### Geographic Extensibility Principle(tm) - EGP-003

The ontology shall accommodate future geographic object types and relationship families without foundational redesign.

---

## 11. Governance Boundaries

- ontology definition != acquisition;
- acquisition != governance;
- governance != implementation;
- implementation != activation;
- activation != customer visibility;
- subject approval != relationship approval;
- geographic coverage != operational service commitment.

---

## 12. Authorization Status

`CGO 1.0 STATUS: CERTIFIED_GOVERNANCE_FOUNDATION`

CGO 1.0 authorizes:

- semantic documentation only.

CGO 1.0 does not authorize:

- implementation;
- persistence;
- retrieval;
- runtime behavior;
- customer activation;
- source integration;
- relationship facts;
- production data mutation;
- route creation;
- downstream integration.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/COLORADO-GEOGRAPHIC-ONTOLOGY-CGO-1.0.md -->
