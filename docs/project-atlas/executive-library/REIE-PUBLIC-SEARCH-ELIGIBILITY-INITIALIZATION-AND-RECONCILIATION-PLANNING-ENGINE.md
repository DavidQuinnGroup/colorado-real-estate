# REIE Public Search Eligibility Initialization And Reconciliation Planning Engine

Program: `REIE_PUBLIC_SEARCH_ELIGIBILITY_INITIALIZATION_AND_RECONCILIATION_PLANNING_ENGINE`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`ELIGIBILITY_INITIALIZATION_PLANNING_ENGINE_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

This certification implements a pure, deterministic planning engine for future `Property.publicSearchEligibility` initialization and reconciliation. It does not initialize rows, write the database, call MLS Grid, activate Search predicates, rebuild Typesense, or send alerts.

## Workstream 1 Synchronization

Synchronized commit:

- `7d3c4f4a863e71419196f4c0dbdc9762550330c5`
- `Certify public search eligibility migration execution`

Post-sync canonical baseline before Workstream 2:

- `HEAD = origin/main = 7d3c4f4a863e71419196f4c0dbdc9762550330c5`
- divergence `0 behind / 0 ahead`
- working tree clean

## Current Certified State

The additive database migration is already executed.

Certified distribution remains:

- `Property.publicSearchEligibility IS NULL`: `75490`
- `CERTIFIED_ELIGIBLE`: `0`
- `PUBLIC_SCOPE_UNVERIFIED`: `0`
- `CERTIFIED_INELIGIBLE`: `0`

Current runtime consumers ignore `publicSearchEligibility`. Existing `NULL` rows retain legacy behavior until a future initialization, DB certification, and explicit runtime activation gate.

## Planning Input Contract

The planner accepts:

- snapshot certification: completeness, scope fingerprint, capture timestamp, provider identity, and authoritative current public-scope source IDs;
- local row inputs: `Property` ID, source identity, current status, private-exclusive posture, and current eligibility state;
- optional authoritative status resolutions for snapshot-absent or unverified identities.

The contract performs no provider query.

## Snapshot Completeness Gate

If the provider snapshot is incomplete, omitted local rows are not classified as absent. The planner returns `BLOCKED_SNAPSHOT_INCOMPLETE` with reason `SNAPSHOT_INCOMPLETE_NO_ABSENCE_CLASSIFICATION`.

Rows present in an incomplete snapshot do not create authority to classify omitted rows.

## Snapshot Member Plan

For a complete certified Active/Coming Soon snapshot, a local row with valid unique identity, public-scope status, and no private-exclusive posture may be proposed as:

- action: `SET_CERTIFIED_ELIGIBLE`
- proposed eligibility: `CERTIFIED_ELIGIBLE`
- reason: `SNAPSHOT_MEMBER_PUBLIC_SCOPE_STATUS`

No database write is performed.

## Snapshot Absence Plan

For a local public-active row absent from a complete snapshot, the planner proposes only:

- action: `SET_PUBLIC_SCOPE_UNVERIFIED`
- proposed eligibility: `PUBLIC_SCOPE_UNVERIFIED`
- reason: `SNAPSHOT_ABSENT_PUBLIC_ACTIVE_REQUIRES_VERIFICATION`

The planner does not fabricate `Pending`, `Closed`, `Withdrawn`, `Expired`, `Cancelled`, or `Deleted`.

## Authoritative Status Resolution Plan

For later authoritative provider evidence:

- `Active` or `Coming Soon` resolves to `CERTIFIED_ELIGIBLE`;
- certified non-public-search states resolve to `CERTIFIED_INELIGIBLE`;
- failed or ambiguous resolution remains fail-closed as `PUBLIC_SCOPE_UNVERIFIED`.

Status mutation is represented as separately permitted and separately required. Eligibility planning does not couple a status write into the pure contract.

## Identity And Privacy Handling

Missing, duplicate, or ambiguous source identities do not certify eligibility. They produce `BLOCKED_IDENTITY` with deterministic reason codes.

Private-exclusive listings cannot become public-search eligible solely because their source ID appears in the provider snapshot. The planner proposes `CERTIFIED_INELIGIBLE` while preserving `isPrivateExclusive` as an independently authoritative field.

## Null And Legacy Handling

`NULL` means `LEGACY_NOT_YET_CERTIFIED` during rollout. The planner does not equate `NULL` with `CERTIFIED_ELIGIBLE` or `PUBLIC_SCOPE_UNVERIFIED`.

Explicit transitions are proposed only when enough evidence exists.

## Output Contract

Each row emits:

- `propertyId`;
- safe source identity;
- current status and current eligibility;
- proposed eligibility;
- action;
- deterministic reason code;
- status mutation permitted/required separately;
- public Search, Typesense, Saved Search, and alert eligibility after proposed transition.

No database write is emitted by the planner.

## Aggregate Summary

The fixture-certified summary for the main plan:

- total considered: `15`
- proposed eligible: `3`
- proposed unverified: `1`
- proposed ineligible: `3`
- no-change: `4`
- blocked identity: `3`
- blocked authority: `1`
- incomplete-snapshot blocked: `0`

The separate incomplete snapshot fixture certifies `incomplete-snapshot blocked: 1`.

## Idempotency

Repeated planning with identical inputs produces an identical plan. Rows already in the intended certified state emit `NO_CHANGE` instead of redundant mutation.

## Write-Set Safety

The planner returns explicit write-set safety flags:

- immutable plan required: `true`
- broad `updateMany` allowed: `false`
- status mutation from filtered-feed absence allowed: `false`
- privacy mutation allowed: `false`

Future execution must operate only from a certified deterministic plan or equivalent bounded input.

## Checkpoint And Resume Design

Future large reconciliation execution should support batch IDs, checkpoints, resumable write batches, before/after counts, and failure isolation.

No schema expansion is required by this pure planning contract.

## Typesense Gate

Typesense rebuild remains blocked until:

1. eligibility transitions are executed;
2. database eligibility distribution is certified;
3. unresolved/blocked populations are understood;
4. runtime indexing predicate is explicitly activated.

No Typesense mutation occurred.

## Saved Search And Alert Gate

`PUBLIC_SCOPE_UNVERIFIED`, `CERTIFIED_INELIGIBLE`, and post-activation `NULL` must not become Saved Search new-listing or alert candidates.

No alert mutation, queue mutation, email send, or worker activation occurred.

## Future Write Sequence

Future authorization should proceed in this order:

1. rate-governed scoped live recertification;
2. complete Active/Coming Soon provider snapshot;
3. build deterministic eligibility plan;
4. Executive/automated plan certification;
5. execute only certified transition set;
6. resolve absent IDs authoritatively;
7. execute resolved transition set;
8. certify database eligibility distribution;
9. activate runtime predicate separately;
10. rebuild Typesense;
11. certify Search;
12. only later resume alert proof.

## Fixture Certification

Passed:

- complete snapshot plus present Active;
- complete snapshot plus present Coming Soon;
- complete snapshot plus absent local Active;
- incomplete snapshot plus absent local Active;
- private-exclusive snapshot member;
- missing identity;
- duplicate identity;
- `NULL` legacy row;
- already `CERTIFIED_ELIGIBLE`;
- already `PUBLIC_SCOPE_UNVERIFIED`;
- already `CERTIFIED_INELIGIBLE`;
- unverified plus provider `Pending`;
- unverified plus provider `Closed`;
- unverified plus provider `Active`;
- missing authoritative resolution;
- deterministic reason codes;
- idempotent repeated plan;
- aggregate counts;
- no status fabrication;
- no privacy mutation;
- no database writes;
- no provider calls;
- no Typesense mutation;
- no alert side effects.

Validation command:

- `npm run check:public-search-eligibility-initialization-plan`

## Files

Implementation:

- `lib/mls/publicSearchEligibilityInitializationPlan.ts`
- `scripts/checkPublicSearchEligibilityInitializationPlan.ts`
- `package.json`
- `tsconfig.worker.json`

Documentation:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-PUBLIC-SEARCH-ELIGIBILITY-INITIALIZATION-AND-RECONCILIATION-PLANNING-ENGINE.md`

## Provider Status

- MLS Grid: `MLS_GRID_LIVE_CALLS_PAUSED_PENDING_RATE_LIMIT_CLARIFICATION`
- LightBox calls consumed by this workstream: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Protected-System Confirmation

No Property row was initialized. No database write occurred. No MLS Grid call occurred. No LightBox call occurred. No ATTOM investigation occurred. No Search predicate was activated. No Typesense reindex or mutation occurred. No Saved Search or alert activation occurred. No deployment occurred.

## Recommendation

Do not proceed to runtime activation from this planning-engine certification alone. The next gate should synchronize the local planning-engine certification commit if accepted, then wait for MLS Grid rate-limit clarification before any scoped live recertification or provider-backed snapshot work.

Next authorization gate:

- `READY_FOR_PUBLIC_SEARCH_ELIGIBILITY_INITIALIZATION_PLANNING_ENGINE_SYNCHRONIZATION`
