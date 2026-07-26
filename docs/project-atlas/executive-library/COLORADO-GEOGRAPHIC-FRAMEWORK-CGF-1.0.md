# PROJECT ATLAS(tm)

## Colorado Geographic Framework - CGF 1.0

Status: `CERTIFIED_GOVERNANCE_FOUNDATION`

CGF 1.0 STATUS: `CERTIFIED_GOVERNANCE_FOUNDATION`

GEOGRAPHIC CONSTITUTION STATUS: `CERTIFIED_AND_ESTABLISHED`

Framework date: July 26, 2026

Repository baseline: `9bee379964a938f805b4bc5a27d34e2955a7dcd9`

Enterprise Geographic Domain: `ENTIRE_STATE_OF_COLORADO`

Initial Operational Business Focus: `IRES_SERVICE_TERRITORY`

Initial Operational Coverage: `IRES_SERVICE_TERRITORY`

Operational Coverage: `IRES_SERVICE_TERRITORY`

Implementation authorization: `NOT_AUTHORIZED`

Persistence authorization: `NOT_AUTHORIZED`

Runtime authorization: `NOT_AUTHORIZED`

Customer activation authorization: `NOT_AUTHORIZED`

No implementation authorization.

No persistence authorization.

No runtime authorization.

No customer activation authorization.

---

## 1. Purpose

CGF 1.0 establishes the constitutional geographic framework for future Real Estate Intelligence Engine geographic capabilities across Colorado. It defines how the enterprise thinks about geographic identity, taxonomy, authority, relationships, lifecycle, confidence, business focus, expansion, and governance boundaries before any additional implementation is authorized.

CGF 1.0 and CGO 1.0 are the two permanent geographic pillars of PROJECT ATLAS. Together they form the Geographic Constitution(tm). CGF governs how the enterprise thinks about and governs geography. CGO governs what geographic concepts mean. CGEP must derive its inventory and roadmap from CGO.

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

This framework is documentation-only. It does not create source code, modify Prisma, create migrations, mutate production data, approve Colorado as a governed subject, approve relationship facts, populate relationship rows, create routes, activate runtime behavior, alter Search, alter Maps, alter Property Intelligence, alter AI, alter Executive Intelligence, update Google Drive documents, or expose new customer-visible behavior.

CGF 1.0 is a governing standard. It is not an implementation plan, persistence plan, retrieval plan, or activation plan.

---

## 2. Enterprise Geographic Principles

Enterprise geography must be:

- statewide in domain;
- source-aware in evidence;
- lifecycle-governed before use;
- confidence-bearing when material facts are represented;
- independent from current business focus;
- additive to existing production behavior;
- reversible before public activation;
- explicit about the difference between subject approval, relationship approval, retrieval approval, consumption approval, and customer visibility.

The Real Estate Intelligence Engine must not treat current operational coverage as the boundary of its geographic domain. Current business priorities may determine sequencing, but not ontology.

---

## 3. Geographic Ontology

The enterprise geographic ontology defines durable concepts independent of database structure.

| Concept | Definition |
| --- | --- |
| Geographic subject | A governed real-world place, jurisdiction, area, market construct, postal unit, or other geographic entity that may later receive identity, evidence, relationships, lifecycle state, and eligibility. |
| Geographic object | A represented geographic subject after it has an approved enterprise identity model. |
| Geographic alias | A governed alternate name, abbreviation, source-specific name, legacy name, slug, or spelling variation associated with a geographic object. |
| Geographic relationship | A governed directional or symmetric fact connecting two geographic objects. |
| Geographic observation | A source-backed fact, measurement, label, attribute, or evidence point about a geographic object or relationship. |
| Geographic authority | A source, institution, or governed enterprise decision that is permitted to support a geographic claim within defined limits. |
| Geographic eligibility | A separate governance state determining whether an object, relationship, or observation may be used for specific internal or external purposes. |

Ontology rules:

- A subject can exist conceptually before it is an approved object.
- An object can be approved without approving all possible relationships involving it.
- A relationship can be proposed only after its source and target subjects satisfy the prerequisite state required by the relationship policy.
- An observation can support an object or relationship without being customer-visible.
- Eligibility is purpose-specific and must not collapse internal use, retrieval, Search, Maps, AI, indexing, and public display into one flag.

---

## 4. Geographic Object Taxonomy

CGF 1.0 defines framework-level object categories for future governance. CGO 1.0 is the canonical semantic dictionary and controlling exhaustive planned object ontology. If CGF category examples and CGO semantic object types diverge, CGO controls object meaning and CGEP inventory derivation.

CGF 1.0 does not authorize implementation of any new type.

### 4.1 Core Administrative And Civic Geography

| Type | Description | Initial posture |
| --- | --- | --- |
| `STATE` | The State of Colorado as the enterprise root geography. | Framework-defined only; not implemented. |
| `COUNTY` | Colorado county or county-equivalent jurisdiction. | Framework-defined only; not implemented. |
| `MUNICIPALITY` | Incorporated city or town. | Existing first-scope type; current production-internal pilot covers Thornton only. |
| `UNINCORPORATED_PLACE` | Census, postal, or locally recognized place outside municipal incorporation. | Future-governed only. |
| `REGION` | Governed multi-jurisdiction area used for enterprise analysis or operations. | Future-governed only. |

### 4.2 Real Estate And Market Geography

| Type | Description | Initial posture |
| --- | --- | --- |
| `NEIGHBORHOOD` | Locally meaningful residential area or named neighborhood. | Existing first-scope type; no broad activation. |
| `MARKET_AREA` | Enterprise or industry market grouping used for comparison and reporting. | Existing first-scope type; no broad activation. |
| `SUBDIVISION` | Recorded, MLS, builder, or locally recognized subdivision construct. | Existing first-scope type; no broad activation. |
| `COMMUNITY` | Customer-facing or editorial community grouping. | Future-governed only. |
| `DEVELOPMENT` | Builder, master-planned, or phased development area. | Future-governed only. |

### 4.3 Postal And Spatial Reference Geography

| Type | Description | Initial posture |
| --- | --- | --- |
| `ZIP_CODE` | Postal code geography or postal assignment construct. | Existing first-scope type; no broad activation. |
| `POSTAL_CITY` | Postal naming construct that may differ from municipality. | Future-governed only. |
| `PARCEL` | Legal or assessor parcel reference. | Future-governed only; high-trust review required. |
| `BOUNDARY_AREA` | Geometry-backed polygon or bounded area used for analysis. | Future-governed only. |

### 4.4 Restricted And High-Trust Geography

| Type | Description | Initial posture |
| --- | --- | --- |
| `SCHOOL_DISTRICT` | Education jurisdiction or attendance-related area. | Deferred; trust-specific review required. |
| `SCHOOL_ATTENDANCE_AREA` | School assignment or boundary area. | Deferred; trust-specific review required. |
| `HOA` | Homeowners association or covenant-governed area. | Deferred; source and legal review required. |
| `METRO_DISTRICT` | Special district or quasi-governmental district. | Deferred; source and legal review required. |
| `ENVIRONMENTAL_ZONE` | Flood, fire, hazard, conservation, or other environmental area. | Deferred; high-risk review required. |
| `ZONING_AREA` | Planning, zoning, overlay, or land-use area. | Deferred; legal/source review required. |

---

## 5. Geographic Relationship Taxonomy

CGF 1.0 defines relationship families. It does not approve any relationship fact.

| Relationship family | Direction | Meaning | Initial posture |
| --- | --- | --- | --- |
| `WITHIN` | Directed | Source is administratively, spatially, or governed-logically within target. | Approved vocabulary with limited scope only; facts not approved. |
| `CONTAINS` | Directed inverse | Source contains target under the same governed basis as `WITHIN`. | Approved vocabulary with limited scope only; facts not approved. |
| `PART_OF` | Directed | Source participates in a broader construct without strict containment. | Framework-defined only. |
| `OVERLAPS` | Symmetric or directed with basis | Source and target share partial geography. | Framework-defined only. |
| `ADJACENT_TO` | Symmetric | Source borders or is geographically next to target. | Framework-defined only. |
| `SERVES` | Directed | Source authority, provider, MLS, district, or service area serves target geography. | Framework-defined only. |
| `ASSOCIATED_WITH` | Directed or symmetric | Weak governed association that is not containment. | Framework-defined only. |
| `ALIAS_OF` | Directed or resolved equivalence | Candidate identity equivalence or alias relation. | Framework-defined only. |
| `SUPERSEDES` | Directed temporal | Source replaces or succeeds target identity. | Framework-defined only. |

Relationship rules:

- No duplicate inverse records unless a separately governed model requires materialized inverses.
- No circular containment.
- Multi-county municipalities must not be forced into a single-parent model without a governed basis.
- Partial containment, overlap, multiple containment parents, service-area relationships, and editorial market grouping must remain separate concepts.
- Administrative containment must not be inferred from search filters, public copy, MLS strings, or customer-facing routes.
- Relationship approval is independent from object approval.

---

## 6. Geographic Authority Model

Every material geographic claim must identify the authority basis allowed for that claim.

| Authority class | Examples | Permitted use |
| --- | --- | --- |
| `AUTHORITATIVE_GOVERNMENT` | State, county, municipality, assessor, planning, GIS, census, postal authority where applicable. | Primary support for legal, civic, administrative, and boundary claims. |
| `AUTHORITATIVE_INDUSTRY` | MLS, industry data provider, regulated real estate source. | Support for listing-market and real-estate operational claims within license limits. |
| `FIRST_PARTY_ENTERPRISE` | Governed REIE decisions, curated editorial market definitions, internal review outcomes. | Support for enterprise-specific constructs when clearly labeled. |
| `LICENSED_COMMERCIAL` | Paid data provider or licensed enrichment source. | Support only within contract, attribution, and display limits. |
| `SECONDARY_PUBLIC` | Public reference, public website, or non-primary compiled source. | Supplemental support; not primary authority for high-risk claims. |
| `EDITORIAL` | Human-authored community or lifestyle context. | Customer-facing narrative only; cannot establish governed facts by itself. |

Authority rules:

- Source authority is claim-specific, not global.
- A source may be authoritative for one claim and insufficient for another.
- Customer-facing display rights must be evaluated separately from internal evidence rights.
- No vendor or source integration is authorized by listing a source class.

---

## 7. Geographic Identity Model

Geographic identity must be stable, explainable, and resilient to ambiguity.

Identity dimensions:

- canonical name;
- display name;
- object type;
- jurisdiction or governing context;
- aliases and abbreviations;
- source authority;
- lifecycle state;
- confidence state;
- ambiguity state;
- merge, supersession, and retirement history.

Colorado identity principles:

- The enterprise geographic domain is the entire State of Colorado.
- Colorado may be treated as the enterprise root geographic subject only after a separately authorized state/root-geography governance decision.
- `Colorado` and `CO` are candidate aliases, not approved subject identity by themselves.
- Existing public copy and schema strings do not create governed subject identity.

Identity rules:

- A name alone is insufficient identity.
- A slug is not identity.
- A database row ID is not business identity.
- Existing storage fields must not leak into public geographic contracts.
- Ambiguous identity must be retained for review rather than silently resolved.

---

## 8. Geographic Lifecycle

The lifecycle governs progression from concept to use.

| Lifecycle state | Definition | Authorization effect |
| --- | --- | --- |
| `CONCEPTUAL` | A place or geography is known as an enterprise concept. | No persistence, retrieval, or activation. |
| `CANDIDATE` | The subject is selected for evidence gathering. | Documentation and evidence work only. |
| `ACQUIRED` | Source evidence has been collected. | No approval by itself. |
| `CLASSIFIED` | Object type and domain classification have been reviewed. | No approval by itself. |
| `MAPPED` | Candidate identity, aliases, and conflicts have been reviewed. | No approval by itself. |
| `QUALITY_PASSED` | Evidence and structure pass quality rules. | Does not imply readiness. |
| `READINESS_QUALIFIED` | A purpose-specific readiness review is complete. | Does not imply approval. |
| `APPROVED` | Executive or governed approval decision is recorded. | Does not imply activation. |
| `PERSISTENCE_AUTHORIZED` | A separate production/internal persistence authorization exists. | Allows only the authorized persistence scope. |
| `PRODUCTION_READ_AUTHORIZED` | A separate production read authorization exists. | Allows only the authorized retrieval scope. |
| `CONSUMPTION_AUTHORIZED` | A specific enterprise consumer may consume the governed contract. | Does not imply customer visibility. |
| `CUSTOMER_VISIBLE_AUTHORIZED` | A public/customer activation gate is approved. | Allows only the specified public use. |
| `RETIRED` | The object, relationship, or observation is no longer active. | Must preserve audit and redirect strategy where relevant. |

Lifecycle boundaries:

- Quality != Readiness
- Readiness != Approval
- Approval != Activation
- Production Persistence != Production Retrieval
- Production Retrieval != Enterprise Consumption
- Enterprise Consumption != Customer Visibility
- Subject Approval != Relationship Approval

---

## 9. Geographic Confidence Model

Confidence expresses trust in a claim, not whether the claim may be used.

| Confidence | Meaning |
| --- | --- |
| `AUTHORITATIVE` | Supported by the governing source for the specific claim. |
| `HIGH_CONFIDENCE` | Strong evidence exists, but the source is not the sole governing authority. |
| `CORROBORATED` | Multiple compatible sources support the claim. |
| `DERIVED` | Claim is produced by a governed derivation such as spatial analysis or normalization. |
| `EDITORIAL` | Claim is human-authored context or presentation, not an authoritative geographic fact. |
| `PROVISIONAL` | Useful for internal review only, pending stronger evidence. |
| `DISPUTED` | Evidence conflicts and requires governance resolution. |
| `UNKNOWN` | No sufficient confidence assessment exists. |

Confidence rules:

- Confidence does not authorize persistence.
- Confidence does not authorize retrieval.
- Confidence does not authorize Search, Maps, AI, indexing, or customer display.
- Conflicting claims must be preserved with conflict context until resolved.
- Confidence must be scoped to the claim, source, date, and use case.

---

## 10. Enterprise Geographic Domain Vs. Business Focus

Enterprise Geographic Domain: `Entire State of Colorado`

Operational Coverage: initially `IRES service territory`

Customer Experience Coverage: `NOT_AUTHORIZED`

Feature Activation: `NOT_AUTHORIZED`

Customer Visibility: `NOT_AUTHORIZED`

Domain means the complete geographic universe the REIE may eventually govern. Business focus means the initial operating, evidence, customer, data, or service-area priority.

Rules:

- The enterprise domain is statewide even when implementation priorities begin inside IRES service territory.
- IRES service territory may sequence the first useful work, but it must not define the outer ontology.
- Future Colorado capabilities must remain compatible with expansion outside the initial business focus.
- Business focus can change without redefining the enterprise domain.
- Domain-wide architecture must not imply domain-wide activation.

---

## 11. Geographic Principles

### Geographic Independence Principle(tm) - EGP-001

Geographic governance must remain independent from current business focus, customer routes, search filters, MLS coverage, static city lists, public copy, and implementation convenience.

This principle requires:

- statewide ontology before local implementation;
- source-backed claims before confidence assignment;
- confidence before readiness;
- readiness before approval;
- approval before persistence authorization;
- persistence authorization before production retrieval;
- production retrieval before enterprise consumption;
- enterprise consumption before customer-visible activation.

The enterprise may prioritize IRES service territory first, but geographic truth must not be narrowed to IRES service territory.

### Geographic Activation Principle(tm) - EGP-002

Knowledge availability does not imply customer availability. Geographic capabilities become customer-visible only through explicit product activation.

### Geographic Extensibility Principle(tm) - EGP-003

The ontology shall accommodate future geographic object types and relationship families without foundational redesign.

---

## 12. Future Expansion Strategy

CGF 1.0 supports staged expansion without committing to implementation.

| Expansion stage | Purpose | Authorization posture |
| --- | --- | --- |
| State/root geography governance | Define whether and how Colorado enters governed subject scope. | Future documentation authorization required. |
| Administrative geography | Govern counties, municipalities, and multi-county containment models. | Future evidence, approval, persistence, and retrieval authorizations required. |
| Postal and market geography | Govern ZIP codes, postal cities, market areas, and customer-useful groupings. | Future authorization required. |
| Property-geography connection | Govern property-to-geography relationships. | Future production mutation authorization required. |
| Internal consumption | Allow enterprise services to consume approved read contracts. | Future consumer-specific authorization required. |
| Customer activation | Expose approved geographic intelligence in public product surfaces. | Future customer activation authorization required. |

Expansion guardrails:

- Every expansion must identify object scope, relationship scope, source authority, confidence model, lifecycle gates, eligibility, and rollback posture.
- No expansion can use CGF 1.0 as implementation approval.
- High-risk geography requires separate trust review before use.
- Customer-facing geography must be downstream of approved subject, relationship, persistence, read, and consumption gates.

---

## 13. Governance Boundaries

CGF 1.0 explicitly does not authorize:

- source code creation;
- Prisma schema changes;
- database migrations;
- production writes;
- relationship-row population;
- relationship approval;
- Colorado subject approval;
- persistence authorization;
- production read authorization;
- runtime route creation;
- Search integration;
- Maps integration;
- Property Intelligence integration;
- AI integration;
- Executive Intelligence integration;
- MLS synchronization;
- Typesense indexing or reindexing;
- alert processing;
- CRM mutation;
- email processing;
- deployment;
- Google Drive updates;
- customer activation.

Authorized scope:

- create this documentation-only framework in the repository.

Required future gate:

- A separately authorized state/root-geography governance charter must exist before Colorado can be reconsidered as an approved governed subject.

Required relationship reminder:

- Colorado subject approval, if later achieved, would still not approve Thornton `WITHIN` Colorado or any other relationship fact.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/COLORADO-GEOGRAPHIC-FRAMEWORK-CGF-1.0.md -->
