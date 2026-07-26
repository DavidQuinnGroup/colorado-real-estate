# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 7 Charter

### Production-Internal Geographic Read Adapter(tm)

Status: `EIP_1.0_SPRINT_7_PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER_AUTHORIZED_FOR_IMPLEMENTATION`

Authorization date: July 25, 2026

Repository baseline: `8545f93f8b4b7bd9ce2905ce3771ba3bab3ced0e`

Parent sprint: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_CERTIFIED_AND_CLOSED`

Correction prerequisite: `EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED`

---

## 1. Executive Objective

Implement a governed production-internal read adapter that retrieves the certified Thornton Geographic Intelligence records from the production GIO persistence foundation through a stable internal contract.

Sprint 7 proves that production-internal knowledge can be retrieved, validated, and consumed by an internal enterprise interface without exposing persistence details or activating customer-facing product behavior.

---

## 2. Certified Production Baseline

Certified subject:

- `Thornton, Colorado`

Certified canonical object ID:

- `cms10utak0002qa0l8mu7gr8i`

Certified row counts:

| Object | Count |
| --- | ---: |
| `GeographicObject` | 1 |
| `GeographicAlias` | 2 |
| `GeographicSource` | 1 |
| `GeographicObservation` | 6 |
| `GeographicEligibility` | 1 |
| `GeographicRelationship` | 0 |
| `PropertyGeographicRelationship` | 0 |

Certified state:

- all eligibility flags false;
- all activation states false;
- object visibility internal-only;
- lifecycle draft;
- no customer visibility.

---

## 3. Authorized Scope

Permitted:

- read-only Prisma queries;
- protected admin-only read route;
- reusable read-adapter TypeScript contract;
- deterministic health and invariant evaluation;
- internal inspection and validation;
- documentation and deployment.

Not permitted:

- Prisma schema changes;
- migrations;
- production writes;
- upserts;
- second `GeographicObject`;
- broad enumeration;
- property relationships;
- search or map consumption;
- public-page, SEO, indexing, analytics, or AI consumption;
- eligibility changes;
- approval or readiness mutation;
- email, alert, CRM, vendor, or MLS mutation.

---

## 4. Required Read Operations

The adapter must support:

- retrieve by certified object ID;
- retrieve by canonical name;
- retrieve by approved alias;
- retrieve certified full aggregate;
- retrieve adapter health and consistency summary.

All operations must resolve to the same certified Thornton object.

---

## 5. Required Invariants

The adapter must prove:

- exactly one certified `GeographicObject`;
- object ID equals `cms10utak0002qa0l8mu7gr8i`;
- object type is `MUNICIPALITY`;
- canonical subject is `Thornton`;
- exactly two aliases;
- exactly one source;
- exactly six observations;
- exactly one eligibility row;
- zero geographic relationships;
- zero property relationships;
- all eligibility and activation flags false;
- no unrelated geographic records exposed;
- missing, duplicate, conflicting, relationship, or eligibility states fail closed;
- no persistence mutation occurs;
- no customer/runtime consumer imports the adapter.

---

## 6. Acceptance Criteria

Sprint 7 succeeds when:

- the certified Thornton production object is retrieved through a stable governed adapter;
- lookup by object ID, canonical name, and approved alias resolves consistently;
- sources, observations, eligibility, and lineage are returned correctly;
- adapter health is deterministic;
- unauthenticated access fails closed;
- repeated reads are stable apart from retrieval timestamps;
- writes remain zero;
- customer visibility remains zero;
- public runtime remains unchanged;
- repository and Google Doc governance are updated.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-7-PRODUCTION-INTERNAL-GEOGRAPHIC-READ-ADAPTER-CHARTER.md -->
