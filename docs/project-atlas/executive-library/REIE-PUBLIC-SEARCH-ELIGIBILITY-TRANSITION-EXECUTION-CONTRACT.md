# REIE Public Search Eligibility Transition Execution Contract

Program: `REIE_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_EXECUTION_CONTRACT`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`ELIGIBILITY_TRANSITION_EXECUTION_CONTRACT_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

This certification adds a pure transition-execution contract for future `Property.publicSearchEligibility` writes. It transforms a certified deterministic initialization plan into an auditable dry-run write specification, but performs no database write.

## Workstream 1 Synchronization

Synchronized commit:

- `d29d3cda0db4346a1a6816bb872a1148ab93cf55`
- `Certify public search eligibility planning engine`

Post-sync canonical baseline before this local work:

- `HEAD = origin/main = d29d3cda0db4346a1a6816bb872a1148ab93cf55`
- divergence `0 behind / 0 ahead`
- working tree clean

## Current Certified Foundation

- `Property.publicSearchEligibility` exists and remains nullable.
- Database distribution remains certified as:
  - `NULL`: `75490`
  - `CERTIFIED_ELIGIBLE`: `0`
  - `PUBLIC_SCOPE_UNVERIFIED`: `0`
  - `CERTIFIED_INELIGIBLE`: `0`
- Current runtime consumers ignore the field.
- The initialization planner is certified to produce deterministic proposed actions.
- No transition has been executed.

## Certified Plan Input Contract

The execution contract accepts a certified initialization plan, plan identity, snapshot scope fingerprint, generated timestamp, transition entries, and expected aggregate counts.

Optional expected plan and scope fingerprints can be supplied. Mismatches fail certification. Arbitrary write objects are not accepted unless they pass the same deterministic validation.

## Writable Action Whitelist

Only these actions become future write candidates:

- `SET_CERTIFIED_ELIGIBLE`
- `SET_PUBLIC_SCOPE_UNVERIFIED`
- `SET_CERTIFIED_INELIGIBLE`

These actions are excluded:

- `NO_CHANGE`
- `BLOCKED_IDENTITY`
- `BLOCKED_SNAPSHOT_INCOMPLETE`
- `BLOCKED_MISSING_AUTHORITY`
- any future blocked action.

## Write Field Boundary

The future executor may write only:

- `Property.publicSearchEligibility`

It must not write `status`, `isPrivateExclusive`, source timestamps, source identity, price, or unrelated `Property` fields. Broad `updateMany` by status or category is explicitly disallowed.

## Before-State Precondition

Every candidate includes an expected current eligibility state. Future execution must be compare-and-set aware:

- expected current state;
- proposed next state;
- skip/block on state drift instead of overwriting.

No DB execution occurred.

## Identity Safety

Each candidate includes:

- canonical `Property` ID;
- source identity fingerprint for audit when present;
- deterministic reason code.

Duplicate property IDs fail certification. Conflicting proposed transitions for a single ID also fail certification.

## Batching Design

The contract creates deterministic batches with:

- batch index;
- candidate entries;
- expected current states;
- proposed states;
- expected write count;
- batch fingerprint.

Default maximum initial batch size is `100`, with tests using a smaller batch to prove determinism and resume behavior.

## Checkpoint And Resume

Checkpoint is allowed only after an entire certified batch succeeds. Restart semantics require:

- resume after last completed batch;
- revalidate the next batch before-state;
- tolerate replay without corrupting state;
- not skip failed or unverified entries.

The contract supports run-local execution state; no schema expansion is required for this pure dry-run certification.

## Dry-Run Contract

Dry-run output includes:

- total plan rows;
- writable rows;
- blocked rows;
- no-change rows;
- batch count;
- per-target-state counts;
- expected before-state distribution;
- conflicting or drifted entries;
- write-set fingerprint.

Dry-run flags remain `databaseWritesPerformed=false`, `providerCallsPerformed=false`, `typesenseMutationsPerformed=false`, and `alertMutationsPerformed=false`.

## Execution Result Contract

Future result states are represented without executing them:

- `APPLIED`
- `NO_CHANGE`
- `BLOCKED_STATE_DRIFT`
- `BLOCKED_MISSING_ROW`
- `BLOCKED_IDENTITY_MISMATCH`
- `FAILED_WRITE`

## Failure And Replay Behavior

The contract represents row disappearance, state drift, identity mismatch, partial batch failure, and duplicate replay. It favors fail-closed unresolved remainder reporting over silent continuation.

## Rollback Design

Rollback is not modeled as blindly restoring all previous states. The contract prepares compare-and-set rollback records that are valid only when current DB state still equals the state produced by the candidate transition.

## Dual-Gate Safety

Runtime remains on legacy behavior during future writes. `NULL` fail-closed behavior must not be activated until initialization/reconciliation is complete and separately certified.

## Typesense / Search Gate

No Typesense rebuild may occur until:

- certified writes complete;
- unresolved population is known;
- DB eligibility distribution is certified;
- runtime indexing predicate is separately authorized.

## Saved Search / Alert Gate

No Saved Search or alert behavior changes occurred. Future unresolved, ineligible, and post-activation `NULL` rows remain excluded from Saved Search new-listing and alert candidacy.

## Fixture Certification

Validation command:

- `npm run check:public-search-eligibility-transition-execution`

Passed cases:

- valid eligible transition;
- valid unverified transition;
- valid ineligible transition;
- `NO_CHANGE` excluded;
- blocked action excluded;
- duplicate `Property` ID;
- conflicting transitions;
- missing `Property` ID;
- expected `NULL` before-state;
- expected certified before-state;
- simulated state drift;
- missing row;
- plan fingerprint mismatch;
- scope fingerprint mismatch;
- batch fingerprint determinism;
- repeated dry-run determinism;
- batch resume contract;
- replay safety;
- partial-failure representation;
- only `publicSearchEligibility` writable;
- `status` never writable;
- `isPrivateExclusive` never writable;
- no provider;
- no DB write;
- no Typesense;
- no alerts.

Fixture summary:

- total plan rows: `6`
- writable rows: `4`
- blocked rows: `1`
- no-change rows: `1`
- batch count: `2`
- target counts:
  - `CERTIFIED_ELIGIBLE`: `2`
  - `PUBLIC_SCOPE_UNVERIFIED`: `1`
  - `CERTIFIED_INELIGIBLE`: `1`
- expected before-state distribution:
  - `NULL`: `2`
  - `PUBLIC_SCOPE_UNVERIFIED`: `1`
  - `CERTIFIED_INELIGIBLE`: `1`

## Static Validation

Required validation passed:

- `npm run check:public-search-eligibility-state-contract`
- `npm run check:public-search-eligibility-initialization-plan`
- `npm run check:public-search-eligibility-transition-execution`
- `npm run typecheck`
- `npm run worker:build`
- `npm run build`
- `git diff --check`

Generated `dist` artifacts were cleaned from the commit scope after worker-build checks.

## Future Write Authorization Shape

The first actual eligibility write must require:

- complete certified provider snapshot;
- certified plan fingerprint;
- dry-run counts;
- explicit batch size;
- before-state snapshot;
- exact count of eligible, unverified, and ineligible writes;
- zero status/private mutation;
- before/after DB counts;
- no runtime activation;
- no Typesense;
- no alerts.

## Files

Implementation:

- `lib/mls/publicSearchEligibilityTransitionExecution.ts`
- `scripts/checkPublicSearchEligibilityTransitionExecution.ts`
- `package.json`
- `tsconfig.worker.json`

Documentation:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-PUBLIC-SEARCH-ELIGIBILITY-TRANSITION-EXECUTION-CONTRACT.md`

## Provider Status

- MLS Grid: `LIVE_CALLS_PAUSED_PENDING_SUPPORT_CLARIFICATION`
- LightBox additional calls in this workstream: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Protected-System Confirmation

No provider call occurred. No database write occurred. No eligibility row was initialized. No Prisma schema or migration changed. No production runtime consumer changed. No Typesense rebuild or mutation occurred. No Saved Search or alert behavior changed. No email was sent. No deployment occurred.

## Recommendation

Synchronize this local execution-contract certification only after Executive review. The next implementation gate should remain the future first-write authorization package, not an actual write.

Next authorization gate:

- `READY_FOR_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_EXECUTION_CONTRACT_SYNCHRONIZATION`
