# PROJECT ATLAS(tm)

## Enterprise Knowledge Consumption Program(tm) - Sprint 2 Charter

### Enterprise Geographic Hierarchy & Relationship Consumer Service(tm)

Status: `EKCP_1.0_SPRINT_2_ENTERPRISE_GEOGRAPHIC_HIERARCHY_RELATIONSHIP_CONSUMER_SERVICE_CHARTER_CREATED_IMPLEMENTATION_NOT_AUTHORIZED`

Charter date: July 26, 2026

Repository baseline: `40c47b9a78ddd818160ffbdb48a23706bee284dd`

Parent sprint: `EKCP_1.0_SPRINT_1_ENTERPRISE_GEOGRAPHIC_CONSUMER_ADAPTER_CERTIFIED_AND_CLOSED`

Current readiness finding: `GOVERNED_RELATIONSHIP_SOURCE_NOT_READY`

Implementation authorization: `NOT_AUTHORIZED`

EKCP SPRINT 2 STATUS: `NOT_AUTHORIZED`

PREREQUISITE STATUS: `GOVERNED_RELATIONSHIP_SOURCE_NOT_READY`

---

## 1. Charter Purpose

Define the governed architecture, prerequisites, implementation boundaries, and authorization gates for a future reusable enterprise service that consumes approved geographic hierarchy and relationship knowledge.

This charter is documentation-only. Sprint 2 implementation is not yet authorized. It does not authorize source-code changes, Prisma changes, migrations, routes, runtime activation, production data mutation, Search integration, Maps integration, Property Intelligence integration, AI integration, Executive Intelligence integration, or customer-visible behavior.

Sprint 2 implementation is blocked until a governed relationship-detail read source exists and is separately implemented, reviewed, validated, and certified.

This charter also does not authorize data acquisition, relationship population, production persistence, relationship approval, production retrieval, product integration, or any downstream consumer activation.

---

## 2. Governing Findings

Current architecture establishes these findings:

- Persistence schema support is not equivalent to relationship-consumption readiness;
- A governed relationship-detail read source does not yet exist;
- Sprint 7 relationship counts are not an authorized relationship-detail source;
- Sprint 7 currently fails closed when relationship rows are present;
- EKCP must not access Prisma, SQL, relationship tables, GIO persistence helpers, routes, or Sprint 7 implementation modules directly;
- downstream enterprise consumers must not need to understand Prisma, SQL, persistence schema, GIO helper implementation, route implementation, or Sprint 7 adapter internals.

The existing Sprint 7 read contract can confirm the certified Thornton subject and the absence of relationship rows. It cannot provide hierarchy, containment, adjacency, overlap, peer, lifecycle, or market relationship details.

---

## 3. Required Two-Stage Model

Sprint 2 requires two governed stages.

### Stage A - Governed Relationship Read Foundation(tm)

Mission:

Create the neutral, read-only enterprise contract and governed source through which approved relationship details may be retrieved.

Stage A must define and enforce:

- eligible relationship records;
- approval requirements;
- evidence requirements;
- relationship directionality;
- source attribution;
- confidence and review status;
- authorization boundaries;
- fail-closed behavior;
- deterministic ordering;
- zero-write guarantees.

Stage A must be separately implemented, reviewed, validated, and certified before Stage B implementation may begin.

Stage A must not be bypassed by reading Prisma, SQL, GIO relationship tables, GIO persistence helpers, protected routes, or Sprint 7 implementation modules from EKCP.

### Stage B - Enterprise Geographic Hierarchy & Relationship Consumer Service(tm)

Mission:

Expose stable, domain-oriented relationship operations through EKCP without exposing persistence or read-adapter implementation details.

Potential operations:

- `getParent`
- `getChildren`
- `getAncestors`
- `getContainingAreas`
- `getRelationships`

These operations are charter candidates only. They are not implementation authorization.

Stage B may begin only after Stage A is certified and a separate Sprint 2 implementation authorization is granted.

---

## 4. Deferred Capabilities

The following capabilities are explicitly deferred:

- `getAdjacentAreas`
- `getPeers`
- spatial overlap consumption

Deferral rationale:

- adjacency requires governed boundary or spatial evidence;
- overlap requires geometry precision, source provenance, effective dating, and approved interpretation;
- peers require a separate enterprise definition and must not ambiguously combine same-parent, same-type, comparable-market, or adjacent concepts.

No implementation may infer adjacency, overlap, or peer relationships from string similarity, route existence, page metadata, editorial content, map fixtures, static polygons, property fields, or market copy.

---

## 5. Relationship Taxonomy

Existing persistence taxonomy:

- `CONTAINS`
- `WITHIN`
- `OVERLAPS`
- `ADJACENT_TO`
- `SUPERSEDES`
- `RELATED_MARKET`

Initial candidate families:

| Family | Persistence values | Sprint 2 posture |
| --- | --- | --- |
| Containment and hierarchy | `CONTAINS`, `WITHIN` | Candidate only after Stage A certification |
| Lifecycle | `SUPERSEDES` | Candidate only after Stage A certification |
| Associative market | `RELATED_MARKET` | Candidate only after Stage A certification and market-definition review |

Deferred or higher-risk:

| Persistence value | Reason |
| --- | --- |
| `ADJACENT_TO` | Requires boundary, spatial, source, and interpretation governance. |
| `OVERLAPS` | Requires geometry precision, effective date, source authority, and approved overlap semantics. |

Persisted enum availability does not approve Sprint 2 consumption. Each relationship family requires relationship-specific evidence, review, and authorization.

---

## 6. Proposed Neutral Contract

The future Stage A neutral relationship read contract should be shaped around enterprise geographic concepts, not storage objects.

Conceptual request fields:

- governed subject identifier;
- relationship intent;
- relationship family;
- direction;
- maximum depth;
- request ID.

Conceptual result fields:

- read-only envelope;
- `writesPerformed = 0`;
- governed subject summary;
- relationship subject summary;
- relationship family and direction;
- hierarchy depth where applicable;
- evidence and source summary;
- confidence;
- review status;
- governance boundary;
- warnings;
- blocking failures.

Recommended result behavior:

- valid, authorized, no-result states return success with empty arrays;
- unsupported relationship kinds fail closed;
- unauthorized relationship sources fail closed;
- incomplete evidence fails closed unless the contract explicitly represents the relationship as non-consumable review metadata;
- every result preserves zero writes and no activation.

Deterministic ordering:

1. relationship-family precedence;
2. hierarchy depth;
3. display name;
4. stable subject identifier.

---

## 7. Failure Model

Required failure vocabulary:

- `SUBJECT_NOT_FOUND`
- `RELATIONSHIP_SOURCE_NOT_AUTHORIZED`
- `RELATIONSHIP_KIND_UNSUPPORTED`
- `NO_APPROVED_RELATIONSHIPS`
- `RELATIONSHIP_EVIDENCE_INCOMPLETE`
- `DOWNSTREAM_INTEGRATION_NOT_AUTHORIZED`

Semantic distinction:

| State | Recommended representation |
| --- | --- |
| Valid empty result | `success=true`, empty relationship array, no blocking failure. |
| No approved relationships for an otherwise authorized subject and kind | Prefer `success=true`, empty relationship array, warning or metadata value `NO_APPROVED_RELATIONSHIPS`. |
| Unsupported relationship kind | `success=false`, blocking failure `RELATIONSHIP_KIND_UNSUPPORTED`. |
| Unauthorized relationship source | `success=false`, blocking failure `RELATIONSHIP_SOURCE_NOT_AUTHORIZED`. |
| Incomplete evidence for a requested consumable relationship | `success=false`, blocking failure `RELATIONSHIP_EVIDENCE_INCOMPLETE`. |
| Downstream integration attempted by Search, Maps, Property Intelligence, AI, Executive Intelligence, runtime, or customer surface | `success=false`, blocking failure `DOWNSTREAM_INTEGRATION_NOT_AUTHORIZED`. |

Stage A validation must prove these states are deterministic and fail closed where required.

---

## 8. Dependency Model

Required architecture:

```text
Governed Geographic Relationship Knowledge
        |
        v
Governed Relationship Persistence
        |
        v
Neutral Geographic Relationship Read Contract
        |
        v
Governed Relationship Read Implementation
        |
        v
EKCP Relationship Consumer Service
        |
        v
Future Enterprise Consumers
```

EKCP Stage B may consume only the neutral relationship read contract produced by Stage A.

Prohibited dependencies:

- Prisma imports;
- SQL access;
- direct `GeographicRelationship` or `PropertyGeographicRelationship` table access;
- GIO persistence helper access;
- protected route access;
- Sprint 7 implementation module imports;
- Search imports;
- Maps imports;
- Property Intelligence imports;
- AI imports;
- Executive Intelligence runtime imports;
- customer-facing route, page, component, worker, alert, email, CRM, MLS, Typesense, or vendor workflow imports.

---

## 9. Governance Boundaries

Sprint 2 must preserve:

- Quality != Readiness
- Readiness != Approval
- Approval != Activation
- Production Persistence != Runtime Consumption
- Runtime Consumption != Customer Visibility
- Subject Consumption != Relationship Consumption
- Relationship Availability != Downstream Product Integration

These are hard boundaries. Relationship records, if later approved for internal consumption, do not authorize Search, Maps, Property Intelligence, AI, Executive Intelligence, runtime behavior, customer visibility, public pages, indexing, analytics, email, alerts, CRM, MLS, Typesense, or vendor activation.

Required governance gates:

1. Source definition gate: relationship source classes, evidence requirements, and eligible relationship record criteria are defined.
2. Stage A implementation authorization gate: neutral relationship read foundation implementation is separately authorized.
3. Stage A review gate: Stage A implementation is formally reviewed for source, evidence, directionality, approval, and dependency boundaries.
4. Stage A certification gate: Stage A is certified before any EKCP relationship consumer implementation begins.
5. Stage B authorization gate: EKCP relationship consumer service implementation is separately authorized after Stage A certification.
6. Stage B review gate: Stage B is formally reviewed for domain contract, failure semantics, dependency isolation, and zero activation.
7. Stage B certification gate: Stage B is certified as internal consumption infrastructure only.
8. Downstream integration authorization gate: Search, Maps, Property Intelligence, AI, Executive Intelligence, runtime, customer, or public behavior requires a later separate authorization after Stage B certification.

---

## 10. Safety And Validation Plan

Future Stage A validation must prove:

- neutral relationship read contract exists;
- relationship source is governed and authorized;
- eligible relationship records are filtered by approval and evidence requirements;
- directionality is deterministic;
- source attribution is present;
- confidence and review status are present;
- unauthorized source states fail closed;
- unsupported relationship kinds fail closed;
- incomplete evidence fails closed;
- valid empty results remain distinguishable from failures;
- no writes occur;
- no runtime or customer activation occurs.

Future Stage B validation must prove:

- EKCP imports only the neutral relationship read contract;
- EKCP does not import Prisma, SQL, GIO persistence helpers, routes, or Sprint 7 implementation modules;
- EKCP performs no writes;
- EKCP creates no route;
- EKCP introduces no runtime activation;
- EKCP introduces no customer visibility;
- EKCP introduces no Search integration;
- EKCP introduces no Maps integration;
- EKCP introduces no Property Intelligence integration;
- EKCP introduces no AI integration;
- EKCP introduces no Executive Intelligence integration;
- deterministic ordering is stable;
- failure states are stable and fail closed.

Required future validation commands should include:

```bash
npm run check:ekcp-sprint-2-enterprise-geographic-relationship-consumer-service
npm run check:ekcp-sprint-1-enterprise-geographic-consumer-adapter
npm run check:eip-sprint-7-production-internal-geographic-read-adapter
npm run typecheck
npm run lint
git diff --check
```

Validation must not run production writes, workers, email processing, CRM mutation, MLS synchronization, alert processing, Typesense mutation, deployment, or destructive commands.

---

## 11. Documentation Plan

Required documentation for any future implementation:

- Stage A architecture and implementation report;
- Stage A public neutral contract documentation;
- Stage A dependency graph and safety evidence;
- Stage B EKCP consumer service implementation report;
- Stage B public contract documentation;
- roadmap update preserving `NOT_AUTHORIZED` until certification gates are satisfied;
- `docs/CHAT_START.md` handoff update only after an authorized documentation change.

This charter does not authorize Google Drive updates, certification claims, implementation reports, commits, pushes, deployment, or customer activation.

---

## 12. Acceptance Criteria For Future Authorization

Sprint 2 implementation may be considered for authorization only when:

- Stage A is explicitly authorized;
- Stage A creates a neutral relationship read contract;
- Stage A relationship source is read-only, governed, and certified;
- Stage A proves approved relationship details can be retrieved without exposing persistence;
- Stage A proves no writes and no activation;
- Stage B receives separate implementation authorization;
- downstream integrations remain explicitly out of scope.

Until those criteria are met, Sprint 2 remains `NOT_AUTHORIZED`.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2-ENTERPRISE-GEOGRAPHIC-HIERARCHY-RELATIONSHIP-CONSUMER-SERVICE-CHARTER.md -->
