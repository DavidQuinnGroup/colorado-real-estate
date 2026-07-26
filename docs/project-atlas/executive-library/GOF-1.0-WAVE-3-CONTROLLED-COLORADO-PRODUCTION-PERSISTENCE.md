# PROJECT ATLAS(tm)

## GOF 1.0 Wave 3 - Controlled Colorado Production Persistence(tm)

Status: `CERTIFIED_DRY_RUN_FOUNDATION`

Implementation date: July 26, 2026

Repository baseline: `f0af851a7c26ba7aa854e570575cbe45f952a49b`

GOF WAVE 3 STATUS: `CERTIFIED_DRY_RUN_FOUNDATION`

PRODUCTION WRITE STATUS: `NOT_EXECUTED`

PRODUCTION RETRIEVAL STATUS: `NOT_AUTHORIZED`

RELATIONSHIP STATUS: `NOT_AUTHORIZED`

RUNTIME ACTIVATION STATUS: `NOT_AUTHORIZED`

CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`

---

## 1. Mission

GOF 1.0 Wave 3 defines the controlled production-persistence boundary for the governed Colorado `STATE` object.

This wave does not write Colorado to production. It creates a deterministic contract, dry-run evaluator, idempotency policy, rollback posture, and safety check so a later separately authorized production persistence action can be reviewed against a precise proposed schema surface.

Wave 3 is certified as a dry-run foundation only. It is not an execution-ready database adapter because no write-capable transaction implementation is included in this wave.

Wave 3 preserves these boundaries:

- implementing the `STATE` object type does not approve Colorado;
- approving Colorado as a governed subject does not authorize relationships;
- planning Colorado persistence does not authorize production retrieval;
- production persistence does not authorize runtime activation;
- runtime activation does not authorize customer visibility.

---

## 2. Architecture

Wave 3 adds a pure implementation boundary:

`lib/gof/coloradoControlledProductionPersistence.ts`

The boundary consumes only:

- `lib/gof/coloradoGovernedInstanceFoundation.ts`;
- `lib/gio/persistence.ts`.

It does not import Prisma, instantiate database clients, create routes, call external services, invoke Search, invoke Maps, invoke Property Intelligence, invoke AI, invoke Executive Intelligence, or expose runtime/customer behavior.

The safety check adds the only permitted production interaction:

`scripts/checkGofWave3ControlledColoradoProductionPersistence.ts`

That script performs read-only production inspection through raw `SELECT` queries and evaluates the pure Wave 3 dry-run contract. It performs zero inserts, updates, deletes, upserts, transactions, relationship writes, route creation, retrieval activation, worker activation, CRM mutation, MLS sync, alert processing, or email processing.

The current boundary exposes a pure execution-plan function that requires a separate governed authorization scope before it will return a plan. That function does not contain a Prisma client, persistence port, or database transaction implementation.

---

## 3. Proposed Colorado Record

Proposed `GeographicObject` row:

| Field | Value |
| --- | --- |
| `id` | `DATABASE_GENERATED_ON_AUTHORIZED_EXECUTION` |
| `objectType` | `STATE` |
| `canonicalName` | `Colorado` |
| `displayName` | `Colorado` |
| `canonicalSlug` | `colorado` |
| `lifecycleStatus` | `DRAFT` |
| `visibility` | `INTERNAL_ONLY` |
| `convenienceParentId` | `null` |
| `mergedIntoId` | `null` |
| idempotency key | `GIO_OBJECT|STATE|colorado` |

The repository does not preassign the production database ID. The unique identity surface is the existing governed storage constraint:

`GeographicObject(objectType, canonicalSlug)`

Planned companion rows if a future production-write authorization is issued:

| Table | Planned maximum |
| --- | ---: |
| `GeographicObject` | 1 |
| `GeographicAlias` | 2 |
| `GeographicSource` | 5 |
| `GeographicObservation` | 5 |
| `GeographicEligibility` | 1 |
| `GeographicRelationship` | 0 |
| `PropertyGeographicRelationship` | 0 |

Aliases:

- `CO`;
- `State of Colorado`.

Eligibility defaults remain all false:

- internal use: `false`;
- search eligible: `false`;
- map eligible: `false`;
- public page eligible: `false`;
- indexing eligible: `false`;
- property enrichment: `false`;
- market analytics: `false`.

---

## 4. Provenance Model

The persistence contract preserves Wave 2 governed evidence through `GeographicSource` and `GeographicObservation` planning records.

Planned sources:

- `State of Colorado`;
- `Colorado GIS`;
- `U.S. Census Bureau`;
- `USGS/GNIS`;
- `PROJECT ATLAS - REAL ESTATE DATA TOOLS`.

Planned observations carry the Wave 2 evidence identifiers, provider, authority domain, source identifier, source value, evidence type, and conflict status using schema key:

`gof.wave3.colorado.evidence.v1`

No geometry is imported. No source is contacted at runtime. No customer-display source claim is authorized.

---

## 5. Idempotency and Conflict Behavior

Wave 3 is idempotent around:

- `objectType = STATE`;
- `canonicalSlug = colorado`;
- idempotency key `GIO_OBJECT|STATE|colorado`;
- exact `DRAFT` and `INTERNAL_ONLY` lifecycle and visibility state.

Dry-run outcomes:

- `DRY_RUN_READY`: no Colorado `STATE` object exists and the proposed write would be bounded to the planned ceiling if later authorized.
- `DRY_RUN_IDEMPOTENT_NOOP`: an exact matching Colorado `STATE` object already exists and no write is needed.
- `BLOCKED_SCHEMA_OR_DATA_MISMATCH`: a conflicting Colorado or `STATE` row exists, relationship rows are present, or the certified Thornton fingerprint changed.

Conflict behavior is fail-closed. Wave 3 does not silently update, merge, overwrite, activate, or delete existing production data.

Partial prior persistence is not treated as idempotent. An existing Colorado `STATE` object must have the exact object fields and complete companion alias, source, observation, eligibility, and zero-relationship state before a repeat is classified as `DRY_RUN_IDEMPOTENT_NOOP`; otherwise the dry run blocks.

---

## 6. Rollback and Suppression Strategy

No rollback is executed in Wave 3 because no write is executed.

For a future authorized production write, rollback must be separately reviewed. The preferred suppression posture is non-destructive:

- keep `visibility = INTERNAL_ONLY`;
- keep all eligibility flags false;
- preserve `DRAFT` lifecycle unless a later governed lifecycle decision authorizes a change;
- do not delete governed evidence rows unless a separate remediation authorization approves removal.

Customer suppression is already the default because no public eligibility, public page, Search, Maps, indexing, property enrichment, runtime route, or retrieval adapter is authorized.

---

## 7. Dry-Run Production Inspection

The Wave 3 safety check reads production state only.

It verifies:

- production currently contains one `GeographicObject`;
- `STATE` object count is zero;
- Colorado-named governed object count is zero;
- `GeographicRelationship` count is zero;
- `PropertyGeographicRelationship` count is zero;
- the certified Thornton production fingerprint remains:

`cms10utak0002qa0l8mu7gr8i|MUNICIPALITY|Thornton|thornton-colorado|DRAFT|INTERNAL_ONLY|2026-07-25T23:50:19.341Z`

The dry-run performs zero writes and returns the proposed write ceiling only as review evidence for a future, separate authorization.

---

## 8. Boundary Review

Wave 3 does not authorize:

- actual Colorado production write;
- Colorado production retrieval;
- relationship creation;
- Thornton to Colorado relationship creation;
- county relationship modeling;
- public endpoints;
- protected runtime route changes;
- customer-visible pages;
- Search integration;
- Maps integration;
- Property Intelligence integration;
- AI integration;
- Executive Intelligence integration;
- MLS synchronization;
- saved-search alert processing;
- CRM mutation;
- email processing;
- deployment.

No saved-search alert rows are inspected or mutated.

---

## 9. Validation Requirements

Required validation:

- `npm run check:gof-wave-3-controlled-colorado-production-persistence`;
- `npm run check:gof-wave-2-colorado-governed-instance-foundation`;
- `npm run check:gof-wave-1-state-object-type-foundation`;
- `npm run check:geographic-intelligence-object-safety`;
- `npm run check:eip-sprint-6-controlled-production-internal-geographic-persistence-pilot`;
- `npm run check:eip-sprint-7-production-internal-geographic-read-adapter`;
- `npm run check:ekcp-sprint-1-enterprise-geographic-consumer-adapter`;
- `npx prisma migrate status`;
- `npx prisma validate`;
- `npm run typecheck`;
- `npm run lint`;
- `git diff --check`.

Wave 3 certification covers only the dry-run foundation. The production Colorado write remains unauthorized and unexecuted. A separate controlled-execution authorization must define the write-capable transaction implementation, operator control, production execution command, and post-write verification before any Colorado row may be created.

GOF Wave 4 remains unauthorized.
