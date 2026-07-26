# PROJECT ATLAS(tm)

## GOF 1.0 Wave 3C-R1 - Colorado Persistence Idempotency Recovery Review(tm)

Status: `IDEMPOTENCY_CORRECTION_CERTIFIED_PENDING_RECOVERY_EXECUTION`

Review date: July 26, 2026

Repository baseline reviewed: `f5ef20148934fb9982672de0bfec9f3af784de94`

Candidate fingerprint: `280b283ba101707b2fb0a85b801db2ce6220c2f56fa7f232d2d0dd6396bb2719`

Colorado production state: `COLORADO_PERSISTED_INTERNAL_IDEMPOTENCY_UNRESOLVED`

Colorado production retrieval remains `NOT_AUTHORIZED`.

Geographic relationships remain `NOT_AUTHORIZED`.

Runtime and customer visibility remain `NOT_AUTHORIZED`.

GOF Wave 4 remains `NOT_AUTHORIZED`.

---

## 1. Production Event

The controlled Wave 3C initial production persistence succeeded.

Initial invocation:

`GOF_WAVE_3B|STATE|COLORADO|f5ef20148934`

Initial result:

- status: `EXECUTED_CREATED`;
- geographic objects created: `1`;
- aliases created: `2`;
- sources created: `5`;
- observations created: `5`;
- eligibility rows created: `1`;
- geographic relationships created: `0`;
- property-geographic relationships created: `0`;
- post-write verification: `PASSED`;
- Thornton: `UNCHANGED`;
- retrieval: `false`;
- customer visibility: `false`.

The identical idempotency execution then failed before transaction invocation with:

`GOF Wave 3B preflight detected Colorado companion-record conflicts.`

No second transaction executed, and no retry, repair, deletion, retrieval activation, relationship creation, or customer visibility activation was attempted.

---

## 2. Containment

The recovery review treats the persisted Colorado record set as production state and permits read-only inspection only.

Required containment state:

- exactly one Colorado `STATE` object;
- lifecycle `DRAFT`;
- visibility `INTERNAL_ONLY`;
- zero geographic relationships;
- zero property-geographic relationships;
- Thornton unchanged;
- Sprint 7 Colorado retrieval disabled;
- EKCP Colorado consumption disabled;
- customer visibility disabled.

---

## 3. Root Cause

Root cause file:

`lib/gof/coloradoProductionExecutionAdapter.ts`

Root cause path:

- `readPreflight`;
- `companion_conflicts` SQL;
- `executeGofWave3bColoradoProductionPersistence`.

Defect class:

`OWNERSHIP_SCOPING_DEFECT`

The Wave 3B preflight originally counted Colorado-looking aliases and observations globally before resolving whether those companion rows belonged to the persisted Colorado `STATE` object. After the first transaction, the newly created Colorado-owned aliases and observations matched the global conflict selectors:

- alias normalized values `co` and `state of colorado`;
- observation keys beginning `gof.wave3.colorado.`;
- observation value schema `gof.wave3.colorado.evidence.v1`.

Those rows were legitimate owned companion rows, but the preflight classified them as conflicts. First post-write verification passed because the same preflight also detected the object support state as complete; the later second execution failed because the global companion conflict count was checked before accepting idempotent complete state.

---

## 4. Corrected Comparison Contract

The correction preserves fail-closed behavior and replaces the global conflict classification with ownership-aware exact-state comparison.

Object comparison is material for:

- `objectType`;
- `canonicalName`;
- `displayName`;
- `canonicalSlug`;
- `lifecycleStatus`;
- `visibility`;
- `convenienceParentId`;
- `mergedIntoId`.

Object comparison ignores:

- database-generated row ID;
- created timestamp;
- updated timestamp.

Alias comparison is material for:

- alias text;
- normalized alias value;
- alias type;
- language;
- lifecycle status;
- source canonical name.

Source comparison is material for:

- canonical name;
- source class;
- authority level;
- access method;
- default update cadence;
- licensing restriction;
- public display restriction;
- health state.

Observation comparison is material for:

- observation key;
- value kind;
- value schema key;
- canonical JSON payload;
- source canonical name;
- freshness;
- confidence;
- derivation method;
- review status;
- public visibility.

Eligibility comparison is material for every eligibility flag.

Ordering is normalized deterministically. JSON object key ordering is normalized deterministically. Database-generated IDs and timestamps are non-material for governed equality.

---

## 5. Retained Fail-Closed Rules

The correction must continue to reject:

- missing companion rows;
- duplicate or extra companion rows;
- aliases owned by another object;
- observations owned by another object;
- missing expected sources;
- materially altered source fields;
- materially altered observation payloads;
- missing eligibility;
- changed eligibility;
- changed lifecycle;
- changed visibility;
- object-type or slug conflicts;
- relationship rows;
- property-geographic relationship rows;
- Thornton fingerprint drift.

---

## 6. Regression Evidence

Recovery safety check:

`npm run check:gof-wave-3c-colorado-idempotency-recovery`

The check proves:

- production-shaped exact Colorado state returns `DRY_RUN_IDEMPOTENT_NOOP`;
- proposed writes are all zero for exact state;
- generated object IDs do not participate in governed equality;
- timestamps do not participate in governed equality;
- ordering normalizes deterministically;
- JSON property ordering normalizes deterministically;
- missing companion state fails closed;
- changed lifecycle fails closed;
- changed visibility fails closed;
- relationship rows fail closed;
- property relationship rows fail closed;
- command default remains dry run;
- production execution remains separately token-gated;
- relationship, retrieval, runtime, and customer-visible integrations remain absent.

---

## 7. Production Read-Only Verification

After correction, production verification may use only:

- dry-run mode;
- verify/read-only mode;
- read-only inspection.

Expected corrected result before any separate recovery execution:

- one complete Colorado state detected;
- state classified as exact and idempotent;
- created rows: `0`;
- updated rows: `0`;
- relationship writes: `0`;
- Thornton unchanged;
- retrieval disabled;
- customer visibility disabled.

No `--execute` command is authorized by this recovery review.

---

## 8. Closure Boundary

This review does not close Wave 3C.

This review does not authorize:

- production execution;
- Colorado retrieval;
- relationship creation;
- Sprint 7 changes;
- EKCP changes;
- Search, Maps, Property Intelligence, AI, or Executive Intelligence activation;
- customer visibility;
- GOF Wave 4.

A separate idempotency recovery execution authorization is required before running any execute-mode command again. That execution must create zero rows, update zero rows, write zero relationships, and pass final read-only verification.
