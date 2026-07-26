# PROJECT ATLAS(tm)

## CGEP 1.0 Phase 1 - Colorado Root Geography Governance Charter(tm)

Status: `APPROVED_GOVERNANCE_FOUNDATION`

Charter date: July 26, 2026

Repository baseline: `696461b3414059a718aa31d91c7f26d534e6cbbe`

CGEP PHASE 1 CHARTER STATUS: `APPROVED_GOVERNANCE_FOUNDATION`

IMPLEMENTATION STATUS: `NOT_AUTHORIZED`

COLORADO SUBJECT STATUS: `NOT_GOVERNED`

STATE OBJECT SCOPE STATUS: `APPROVED_IN_PRINCIPLE`

PRODUCTION PERSISTENCE STATUS: `NOT_AUTHORIZED`

PRODUCTION READ STATUS: `NOT_AUTHORIZED`

CUSTOMER ACTIVATION STATUS: `NOT_AUTHORIZED`

---

## 1. Root Subject Role

Mission: define the governed process through which Colorado may become the approved enterprise root geographic subject for the statewide REIE domain.

Colorado should serve as:

- enterprise root context for the current statewide domain;
- canonical state subject;
- parent context for eligible statewide geographic subjects;
- reference point for statewide comparative intelligence.

Root context does not create automatic parent relationships. Root context does not authorize subordinate geography, county objects, municipal objects, property relationships, Search, Maps, Property Intelligence, AI, Executive Intelligence, runtime behavior, or customer visibility.

Colorado as enterprise root context does not currently mean Colorado is an acquired, approved, persisted, or production-readable subject.

---

## 2. Object Type

Recommended formal inclusion:

`STATE`

Semantic meaning:

- A reusable governed state-level civic and administrative object type for state geographic subjects.

Current intended governed instance:

- `Colorado`, as the enterprise root subject candidate for `ENTIRE_STATE_OF_COLORADO`.

Geographic Instance Principle(tm) - EGP-004:

> Enterprise geographic object types define reusable semantics. Individual geographic entities are governed instances of those types.

Examples:

- `STATE` -> Colorado
- `COUNTY` -> Boulder County
- `MUNICIPALITY` -> Thornton
- `NEIGHBORHOOD` -> Old North Boulder

Authority domain:

- State and federal administrative identity, boundary, and source-governed state reference evidence.

Allowed identifiers:

- future stable enterprise subject identifier;
- official state or federal source identifiers when acquired;
- source record identifiers from approved evidence packages.

Allowed aliases:

- `Colorado`
- `CO`
- `State of Colorado`

Geometry expectations:

- identity approval may proceed without customer-visible geometry;
- authoritative polygon or multipolygon geometry should be evaluated before spatial relationship approval;
- simplified internal geometry may be used only if separately governed and labeled as simplified;
- geometry requires source lineage, versioning, effective dates, and confidence.

Lifecycle requirements:

- identified;
- acquired;
- classified;
- mapped;
- evidence complete;
- quality passed;
- ready for review;
- approved;
- production persistence;
- production retrieval;
- enterprise consumption;
- customer activation.

Permitted relationship families for future consideration:

- `WITHIN`
- `CONTAINS`
- `OVERLAPS`
- `INTERSECTS`
- `ADJACENT_TO`
- `SUPERSEDES`
- `PART_OF`

Governance constraints:

- no relationship fact is authorized by approving `STATE`;
- approval of the `STATE` type does not approve Colorado as an instance;
- circular containment is invalid;
- duplicate inverse relationships must be governed consistently;
- state identity must not be inferred from public copy, property state strings, or a subordinate subject observation;
- `STATE` inclusion is approved in principle for governed subject evidence planning only;
- no source-code or schema implementation is authorized by this documentation decision.

---

## 3. Identity Model

Proposed identity evaluation:

| Identity element | Phase 1 proposed treatment |
| --- | --- |
| Canonical name | `Colorado` |
| Display name | `Colorado` |
| Aliases | `CO`, `State of Colorado` |
| Official source identifiers | Required before evidence package approval; not selected by this charter. |
| Stable enterprise subject ID | Required before approval; not created or approved by this charter. |
| Effective period | Required for identity and boundary evidence. |
| Authority | Must identify claim-specific state or federal authority. |
| Provenance | Required for every material identity claim. |

This charter does not create or approve a final enterprise ID. A future governed evidence package may recommend a stable enterprise subject identifier only after the identity standard and source evidence are approved.

Names, abbreviations, source identifiers, slugs, and runtime strings are not themselves enterprise identity.

---

## 4. Authority And Evidence

Authoritative sources to evaluate:

- State of Colorado official records and GIS;
- U.S. Census Bureau;
- USGS/GNIS where applicable;
- federal administrative-boundary sources;
- approved enterprise source records.

`PROJECT ATLAS - REAL ESTATE DATA TOOLS` is the canonical provider inventory for source discovery and provider classification. Use of that inventory does not authorize provider integration or data ingestion.

Required evidence:

- authoritative identity evidence;
- boundary evidence;
- source identifiers;
- effective date;
- acquisition date;
- review date;
- provenance;
- licensing and usage constraints;
- update cadence;
- conflict status.

Evidence must distinguish identity, geometry, licensing, source freshness, and permitted use. Evidence completeness does not imply quality, readiness, approval, persistence, retrieval, activation, or customer visibility.

---

## 5. Geometry Semantics

Colorado geometry evaluation must determine whether the subject requires:

- authoritative polygon or multipolygon geometry;
- simplified internal geometry;
- geometry versioning;
- effective dates;
- source lineage.

Geometry approval is separate from identity approval. Geometry approval does not automatically authorize `WITHIN`, `CONTAINS`, `OVERLAPS`, `INTERSECTS`, property relationships, map rendering, or spatial customer features.

---

## 6. Lifecycle

CGEP Phase 1 uses the existing governed lifecycle:

1. identified;
2. acquired;
3. classified;
4. mapped;
5. evidence complete;
6. quality passed;
7. ready for review;
8. approved;
9. production persistence;
10. production retrieval;
11. enterprise consumption;
12. customer activation.

This charter does not create a conflicting lifecycle and does not move Colorado into any lifecycle state beyond documentation-only planning.

---

## 7. Quality Requirements

Quality checks must cover:

- canonical identity;
- alias accuracy;
- object classification;
- authoritative source agreement;
- geometry validity;
- provenance completeness;
- effective-date consistency;
- source licensing;
- deterministic representation.

Quality review must be deterministic, evidence-backed, and repeatable. Quality passed does not imply readiness or approval.

---

## 8. Readiness Requirements

Readiness is separate from quality.

Readiness requires:

- complete evidence;
- approved object type;
- approved identity semantics;
- approved mapping;
- no unresolved material conflicts;
- review owner;
- production-safety plan;
- rollback or isolation plan where applicable.

Readiness passed does not imply subject approval, persistence, retrieval, enterprise consumption, or customer visibility.

---

## 9. Approval And Activation Boundaries

Preserved boundaries:

- Quality != Readiness
- Readiness != Approval
- Approval != Persistence
- Persistence != Retrieval
- Retrieval != Consumption
- Consumption != Customer Visibility
- Colorado subject approval != subordinate subject approval
- Colorado subject approval != relationship approval

No approval boundary may be collapsed for implementation convenience.

---

## 10. Relationship Impact

Colorado approval would allow reconsideration, but not automatic approval, of:

Thornton `WITHIN` Colorado

and:

Colorado `CONTAINS` Thornton

Relationship evidence and approval remain governed separately. Relationship reconsideration must evaluate source authority, relationship basis, directionality, inverse handling, duplicate prevention, circular-containment prevention, and whether geometry or administrative evidence is sufficient for the specific claim.

---

## 11. Pilot Scope

Smallest valid governance pilot:

- one Colorado root subject;
- identity, aliases, and authority;
- approved state classification;
- evidence package;
- quality review;
- readiness review;
- approval decision.

The pilot must not include counties, municipalities, subordinate subject approval, relationship-row creation, customer-visible statewide expansion, Search, Maps, Property Intelligence, AI, Executive Intelligence, runtime activation, or production writes in the same implementation scope.

---

## 12. Authorization Gates

| Gate | Name | Authorization effect |
| --- | --- | --- |
| Gate 1 | Phase 1 Charter Approved | Allows documentation-only Phase 1 planning closure. |
| Gate 2 | `STATE` Object Scope Approved | Allows `STATE` to proceed into governed subject evidence planning only. |
| Gate 3 | Colorado Evidence Package Approved | Allows quality review preparation only. |
| Gate 4 | Colorado Quality Review Passed | Allows readiness review preparation only. |
| Gate 5 | Colorado Readiness Review Passed | Allows executive subject-approval review only. |
| Gate 6 | Colorado Subject Approval Granted | Allows separate persistence authorization to be requested. |
| Gate 7 | Production Persistence Authorized | Allows only bounded authorized persistence work. |
| Gate 8 | Production Read Authorized | Allows only bounded authorized retrieval work. |
| Gate 9 | Relationship Pilot Reconsideration Authorized | Allows relationship evidence review only; no automatic relationship approval. |
| Gate 10 | Customer Activation Separately Authorized | Allows only explicitly approved customer-facing use. |

Current gate state:

- Gate 1: `APPROVED`
- Gate 2: `APPROVED_IN_PRINCIPLE`
- Gates 3-10: `NOT_AUTHORIZED`

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/CGEP-1.0-PHASE-1-COLORADO-ROOT-GEOGRAPHY-GOVERNANCE-CHARTER.md -->
