# PROJECT ATLAS(tm)

## Enterprise Knowledge Consumption Program(tm) - Sprint 2 Stage A Charter

### Governed Relationship Read Foundation(tm)

### Source Definition & Authorization Charter

Status: `EKCP_1.0_SPRINT_2_STAGE_A_GOVERNED_RELATIONSHIP_READ_FOUNDATION_SOURCE_DEFINITION_CHARTER_CREATED_IMPLEMENTATION_NOT_AUTHORIZED`

Charter date: July 26, 2026

Repository baseline: `048d7f59cbbc9e28705a17f89fef8e1fa8435f23`

Parent charter: `EKCP_1.0_SPRINT_2_ENTERPRISE_GEOGRAPHIC_HIERARCHY_RELATIONSHIP_CONSUMER_SERVICE_CHARTER_CREATED_IMPLEMENTATION_NOT_AUTHORIZED`

STAGE A STATUS: `NOT_AUTHORIZED`

RELATIONSHIP SOURCE STATUS: `GOVERNED_RELATIONSHIP_SOURCE_NOT_READY`

IMPLEMENTATION STATUS: `NOT_AUTHORIZED`

Recommended readiness gate: `GOVERNED_RELATIONSHIP_SOURCE_READY_FOR_IMPLEMENTATION`

---

## 1. Mission

Define the authoritative governance model for determining when a geographic relationship record becomes eligible for production-internal read retrieval and future EKCP consumption.

This charter is documentation-only. It does not authorize source code, Prisma changes, migrations, relationship population, production relationship reads, data acquisition execution, routes, deployment, runtime activation, customer visibility, Search integration, Maps integration, Property Intelligence integration, AI integration, Executive Intelligence runtime integration, Google Drive updates, commits, pushes, or production data mutation.

No relationship fact is approved by this charter. A proposed relationship remains a candidate until evidence, source authority, review, conflict, approval, and activation boundaries satisfy the gates below.

---

## 2. Source Authority Model

`PROJECT ATLAS - REAL ESTATE DATA TOOLS` is the canonical external source inventory for source discovery and source category alignment. Stage A remains source-abstracted: implementation and future consumers must depend on governed source classes and evidence envelopes, not vendor-specific APIs, file formats, credentials, routes, or storage objects.

Acceptable source categories:

| Source category | Authority level | Evidence requirements | Review requirements | Refresh expectations | Conflict priority |
| --- | --- | --- | --- | --- | --- |
| Authoritative government GIS | Highest for legal, administrative, boundary, and jurisdictional facts in the source's domain | Dataset identity, issuing authority, geometry or record reference, acquisition date, effective date, license/display posture, provenance | Manual source review and boundary interpretation review | Follow source update cadence; at minimum review on published boundary changes or annually when cadence is unknown | Highest for its statutory or administrative domain |
| Municipal, county, state, or federal records | Highest for records formally maintained by the governing jurisdiction | Record reference, ordinance or administrative record where applicable, jurisdiction, effective date, acquisition date, provenance | Manual review by authorized enterprise reviewer | Event-driven for ordinances and official records; annual audit if no event feed exists | Highest for official non-GIS administrative facts |
| Approved enterprise geographic mappings | High after internal approval; not authoritative outside approved scope | Mapping decision ID, source inputs, reviewer decision, approved relationship family, effective date, provenance | Must pass enterprise approval workflow and conflict review | Review when source inputs refresh or decision reaches review date | Below authoritative government records; above editorial and derived-only evidence |
| Governed editorial determinations | Supporting for enterprise market or content relevance only | Editorial rationale, source context, reviewer, intended relationship family, explicit non-authoritative classification | Editorial and governance review; cannot create legal, boundary, or administrative facts | Review when market/content strategy changes or annually | Lower than authoritative, enterprise mapping, and derived spatial evidence |
| Derived spatial relationships | Conditional; depends on approved input geometry and method | Input geometry source, method, precision, tolerance, rule version, execution date, effective date, reviewer | Spatial method review, source review, and conflict review | Refresh whenever input geometry changes or method version changes | Below direct authoritative records unless the authoritative source explicitly supports derivation |
| External commercial datasets | Variable; license- and domain-limited | Provider, dataset version, license posture, acquisition date, field meaning, effective date, provenance | License review, field-meaning review, freshness review, and governance approval | Provider cadence; must include expiration or refresh date | Below authoritative government sources; priority depends on approved domain and license |
| Manually reviewed enterprise records | Supporting to high within approved enterprise scope | Reviewer, source evidence bundle, rationale, effective date, confidence, conflict status, provenance | Manual approval by named authority or governed approval role | Review date required; default annual review if no better cadence exists | Below authoritative external records; above unreviewed or editorial-only inputs |

Authority hierarchy:

1. Authoritative government GIS for governed boundary and jurisdiction facts.
2. Formal municipal, county, state, or federal records for official non-GIS facts.
3. Approved enterprise geographic mappings with traceable source inputs.
4. Approved derived spatial relationships from authoritative inputs.
5. External commercial datasets within approved licensed scope.
6. Manually reviewed enterprise records.
7. Governed editorial determinations for editorial or market-context relationships only.

Unverified sources, route existence, SEO metadata, page copy, static fixtures, property strings, market copy, map display, search facets, or repeated legacy usage are not sufficient by themselves to authorize relationship-read eligibility.

---

## 3. Initial Relationship Scope

Minimum initial Stage A scope recommendation:

| Relationship family | Persistence value | Stage A posture | Enterprise value | Risk |
| --- | --- | --- | --- | --- |
| Containment | `CONTAINS` | Preferred initial candidate | Enables hierarchy, parent/child retrieval, containing area summaries, and future geographic rollups. | False containment can create misleading jurisdiction, market, or customer claims. |
| Containment inverse | `WITHIN` | Preferred initial candidate | Supports ancestors and containing-area operations with clear inverse semantics. | Inverse duplication and circular containment must be controlled. |

Evaluate but do not automatically authorize:

| Relationship family | Persistence value | Stage A posture | Enterprise value | Risk |
| --- | --- | --- | --- | --- |
| Lifecycle | `SUPERSEDES` | Evaluate after containment model is stable | Preserves object evolution, boundary changes, merges, and retired identities. | Requires careful effective dating and historical interpretation. |
| Associative market | `RELATED_MARKET` | Evaluate after market-definition review | Supports internal market intelligence and future enterprise analysis. | May conflict with administrative geography or editorial assumptions. |

Continue deferring:

| Relationship family | Persistence value or concept | Reason |
| --- | --- | --- |
| Adjacency | `ADJACENT_TO` | Requires governed boundary or spatial evidence, precision, tolerance, and interpretation rules. |
| Spatial overlap | `OVERLAPS` | Requires approved geometry precision, overlap threshold, effective dating, and legal/market interpretation safeguards. |
| Peer or comparability relationships | Future concept only | Requires separate enterprise definition and must not combine same-parent, same-type, comparable-market, or adjacent concepts. |

Initial Stage A should start with `CONTAINS` and `WITHIN` only after Gate 2 approval. `SUPERSEDES` and `RELATED_MARKET` should remain evaluation items. `ADJACENT_TO`, `OVERLAPS`, and peer/comparability relationships remain deferred.

---

## 4. Eligible Relationship-Record Criteria

A relationship record may enter the governed read source only when all criteria are satisfied:

- source subject is approved for the requested relationship family;
- target subject is approved for the requested relationship family;
- relationship type is authorized for Stage A;
- directionality is valid for the relationship family;
- evidence envelope is present and complete;
- evidence source is authorized for the relationship family;
- confidence meets the approved threshold;
- review status is approved;
- relationship is not expired;
- relationship is not superseded unless explicitly requested as historical context;
- no unresolved material conflict exists;
- provenance is traceable to source and review evidence;
- stable source and target identifiers are present;
- effective date is present when the source or relationship is time-sensitive;
- refresh or expiration date is present when the source has a review cadence;
- activation and customer visibility remain false.

Minimum confidence threshold:

- `HIGH` or better enterprise-equivalent confidence for production-internal governed reads;
- `MEDIUM` may remain review metadata only and must not become eligible for consumer retrieval unless a separate exception is approved;
- `LOW`, `INSUFFICIENT`, unreviewed, conflicted, rejected, expired, or superseded records are not eligible for governed read retrieval.

---

## 5. Evidence Model

Minimum evidence envelope:

- source provider;
- source class;
- source record or dataset reference;
- acquisition date;
- effective date;
- reviewed date;
- reviewer or approval authority;
- confidence;
- evidence method;
- provenance;
- conflict status;
- expiration or refresh date where applicable;
- licensing or display restriction posture;
- relationship family;
- directionality;
- source subject identifier;
- target subject identifier.

Evidence classes:

| Evidence class | Definition | Eligibility posture |
| --- | --- | --- |
| Authoritative evidence | Direct evidence from a governing or official source for its domain. | Eligible after review, conflict check, and approval. |
| Corroborating evidence | Supporting evidence that confirms or contextualizes an authoritative or approved source. | Supports confidence but should not independently authorize material relationships. |
| Derived evidence | Relationship produced by approved rules from governed inputs. | Eligible only when input sources, derivation method, precision, and review are approved. |
| Editorial evidence | Human-authored or enterprise-context rationale. | Can support editorial or market-context relationships only; cannot authorize boundary, legal, jurisdictional, or administrative facts alone. |

Evidence must remain separable from relationship availability. Evidence completion does not equal approval, approval does not equal activation, and activation is outside Stage A.

---

## 6. Approval Model

Governed relationship states:

| State | Meaning | Read eligibility |
| --- | --- | --- |
| `ACQUIRED` | Source evidence has been identified or obtained. | Not eligible |
| `CLASSIFIED` | Relationship family, source class, and evidence class have been assigned. | Not eligible |
| `EVIDENCE_COMPLETE` | Required evidence envelope is complete. | Not eligible |
| `QUALITY_PASSED` | Evidence and structure pass quality checks. | Not eligible |
| `READY_FOR_REVIEW` | Record is ready for approval decision. | Not eligible |
| `APPROVED` | Authorized authority approves the relationship for the specified internal read scope. | Eligible only if non-expired and conflict-free |
| `REJECTED` | Relationship was reviewed and rejected. | Not eligible |
| `SUPERSEDED` | Relationship was replaced by a newer approved relationship or source. | Not eligible for current reads; may be historical only if separately authorized |
| `EXPIRED` | Relationship exceeded effective period or refresh deadline. | Not eligible |

Required governance separations:

- Quality != Readiness
- Readiness != Approval
- Approval != Activation

Only approved, non-expired, non-superseded, conflict-free relationships may become eligible for governed read retrieval. Approval must specify scope; an approval for internal read eligibility does not authorize EKCP Stage B, downstream product integration, or customer visibility.

---

## 7. Conflict-Resolution Model

Unresolved material conflicts fail closed.

Conflict cases:

| Conflict case | Required handling |
| --- | --- |
| Two authoritative sources disagree | Preserve both evidence records, block read eligibility, escalate to source authority review. |
| Source and derived geometry conflict | Prefer source authority within its domain; block derived relationship until method or source discrepancy is resolved. |
| Directional inconsistency | Block both directions until a single directionality model is approved. |
| Circular containment | Block the cycle; require hierarchy review and cycle-breaking decision. |
| Duplicate inverse relationships | Collapse into one canonical relationship representation or one derived inverse; block duplicate exposure. |
| Obsolete boundaries | Mark stale relationship `SUPERSEDED` or `EXPIRED`; require current evidence before read eligibility. |
| Overlapping jurisdictions | Preserve overlap as conflict or separately approved relationship type; do not infer containment. |
| Market relationships conflict with administrative geography | Preserve market relationship as analytical or editorial only unless separately approved; do not override administrative containment. |

Conflict priority:

1. Official source authority within its domain.
2. Effective date and currentness.
3. Approved enterprise decision scope.
4. Evidence precision and method.
5. License and display constraints.
6. Editorial or market rationale.

No relationship may enter the governed read source while a material conflict is unresolved.

---

## 8. Directionality And Inverse Relationships

Directionality rules:

| Relationship | Directionality | Inverse behavior | Duplicate prevention |
| --- | --- | --- | --- |
| `CONTAINS` | Directional from container to contained subject | Inverse may be derived as `WITHIN` when authorized | Do not expose both persisted and derived inverse unless one canonical representation is selected. |
| `WITHIN` | Directional from contained subject to container | Inverse may be derived as `CONTAINS` when authorized | Do not duplicate inverse records across both directions without governance. |
| `SUPERSEDES` | Directional from newer/current subject to prior subject unless otherwise approved | Inverse may be represented as superseded-by in contract metadata | Prevent circular supersession and require effective dates. |
| `RELATED_MARKET` | Usually directional or scoped-associative; must be defined by market review | Inverse is not assumed unless the relationship is approved as symmetric | Prevent vague bidirectional market associations. |
| Future `ADJACENT_TO` | Symmetric only if boundary methodology supports it | Inverse normally derived, not separately persisted | Prevent duplicate adjacency pairs. |
| Future `OVERLAPS` | Symmetric or directional by area/share only after approved semantics | Inverse depends on approved overlap model | Prevent unqualified overlap claims. |

Circular containment detection is mandatory. A subject cannot contain itself, cannot be its own ancestor, and cannot participate in a containment cycle. Duplicate inverse relationships must be detected before read eligibility.

---

## 9. Neutral Read-Contract Authorization

Future neutral contract boundary concepts:

- subject identifier;
- relationship family;
- direction;
- maximum depth;
- relationship summaries;
- evidence summaries;
- confidence;
- review status;
- provenance;
- warnings;
- blocking failures;
- deterministic ordering.

Contract behavior:

- read-only envelope;
- zero writes;
- valid authorized empty results return empty collections;
- unauthorized source, unsupported family, incomplete evidence, missing subject, expired relationship, superseded relationship, and unresolved conflict states fail closed;
- deterministic ordering by relationship-family precedence, hierarchy depth, display name, and stable subject identifier.

The neutral contract must not define implementation-specific imports, routes, Prisma types, table names, SQL, persistence helper dependencies, protected route dependencies, Sprint 7 adapter details, or downstream product integration.

---

## 10. Read-Source Eligibility Gate

Recommended gate:

`GOVERNED_RELATIONSHIP_SOURCE_READY_FOR_IMPLEMENTATION`

This state requires:

- source authority model approved;
- initial relationship families approved;
- evidence model approved;
- approval states approved;
- conflict model approved;
- directionality and inverse rules approved;
- neutral contract boundary approved;
- initial pilot subject set identified;
- zero-write read implementation scope approved;
- production writes remain prohibited;
- customer and runtime activation remain prohibited.

Until this gate is reached, Stage A remains `NOT_AUTHORIZED`.

---

## 11. Pilot Recommendation

Smallest governed pilot recommendation:

- one existing certified municipality subject;
- one or more containment candidates only if evidence exists and is approved;
- no adjacency, overlap, peer, market-comparable, or public/customer use.

Potential candidate relationships, not approved facts:

- Thornton within an approved county;
- Thornton within Colorado;
- Colorado within the United States.

Evidence required before any candidate can become an approved relationship fact:

- approved source and target subjects;
- authoritative source evidence for the relationship;
- effective date and source record or dataset reference;
- reviewer or approval authority;
- confidence at the approved threshold;
- conflict review showing no unresolved material conflict;
- directionality decision;
- expiration or refresh date where applicable;
- traceable provenance.

The existing Thornton municipality subject may be useful as a pilot anchor, but this charter does not create, infer, approve, retrieve, or persist any relationship fact. Colorado, United States, county, or any other containing subject must be separately approved before relationship eligibility can be considered.

---

## 12. Safety Boundaries

This charter prohibits:

- direct Prisma access by EKCP;
- direct table access by future consumers;
- production writes;
- relationship population;
- data acquisition execution;
- relationship approval;
- production relationship retrieval;
- API routes;
- runtime activation;
- customer visibility;
- Search integration;
- Maps integration;
- Property Intelligence integration;
- AI integration;
- Executive Intelligence runtime integration;
- Google Drive updates;
- saved-search alert inspection or mutation.

Future source definition, Stage A implementation, Stage B implementation, and downstream integrations each require separate authorization.

---

## 13. Authorization Gates

Gate sequence:

1. Gate 1 - Source Definition Charter Approved
2. Gate 2 - Initial Relationship Families Approved
3. Gate 3 - Pilot Evidence Package Approved
4. Gate 4 - Stage A Implementation Authorized
5. Gate 5 - Stage A Architectural Review Passed
6. Gate 6 - Stage A Controlled Read Validation Passed
7. Gate 7 - Stage A Certified and Closed
8. Gate 8 - Stage B Implementation Authorized

Current status:

| Gate | Status |
| --- | --- |
| Gate 1 - Source Definition Charter Approved | `PENDING_REVIEW` |
| Gate 2 - Initial Relationship Families Approved | `NOT_AUTHORIZED` |
| Gate 3 - Pilot Evidence Package Approved | `NOT_AUTHORIZED` |
| Gate 4 - Stage A Implementation Authorized | `NOT_AUTHORIZED` |
| Gate 5 - Stage A Architectural Review Passed | `NOT_STARTED` |
| Gate 6 - Stage A Controlled Read Validation Passed | `NOT_STARTED` |
| Gate 7 - Stage A Certified and Closed | `NOT_STARTED` |
| Gate 8 - Stage B Implementation Authorized | `NOT_AUTHORIZED` |

No later gate may be assumed from an earlier gate. Source definition approval does not authorize implementation, relationship population, production retrieval, Stage B, downstream integration, or customer activation.

---

## 14. Documentation Boundary

Do not update as part of this charter:

- Sprint 2 implementation reports;
- roadmap;
- `docs/CHAT_START.md`;
- Google Drive documents;
- source code;
- package configuration;
- Prisma schema or migrations.

This charter is the only authorized artifact for the current documentation-only prerequisite step.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2-STAGE-A-GOVERNED-RELATIONSHIP-READ-FOUNDATION-SOURCE-DEFINITION-CHARTER.md -->
