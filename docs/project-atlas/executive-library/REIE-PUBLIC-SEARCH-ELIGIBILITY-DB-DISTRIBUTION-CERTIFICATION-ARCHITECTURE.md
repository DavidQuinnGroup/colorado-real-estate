# REIE Public Search Eligibility DB Distribution Certification Architecture

Status: locally certified architecture, fixture-only.

This contract defines how future supplied evidence for `Property.publicSearchEligibility` distribution will be certified after eligibility writes eventually occur. It does not query, inspect, or mutate the live database, and it does not claim the current database is certified.

## Foundation

The architecture composes the existing public-search eligibility family:

- state contract for `CERTIFIED_ELIGIBLE`, `PUBLIC_SCOPE_UNVERIFIED`, and `CERTIFIED_INELIGIBLE`;
- initialization planning and transition execution;
- compare-and-set write safety and deterministic batching;
- first-write readiness;
- runtime activation contract;
- Discovery Parity certification;
- Activation Operations Readiness.

It does not create a new public-search predicate and does not replace dry-run, write-proof, parity, operations-readiness, Search, Typesense, Saved Search, or operator-authorization gates.

## Evidence Model

Certification accepts supplied evidence only:

- certification phase;
- certification context and capture timestamp;
- total `Property` rows in scope;
- `NULL`, `CERTIFIED_ELIGIBLE`, `PUBLIC_SCOPE_UNVERIFIED`, and `CERTIFIED_INELIGIBLE` counts;
- total classified count and explicit excluded/out-of-scope count where applicable;
- transition/write evidence;
- plan, write-set, provider snapshot, and optional batch fingerprints;
- unresolved identity/status counts;
- activation prerequisite evidence;
- protected-boundary assertions.

## Semantics

An all-`NULL` distribution is not activation-ready. `NULL` rows require explicit explanation before activation. `PUBLIC_SCOPE_UNVERIFIED` remains unresolved and cannot be treated as eligible. `CERTIFIED_INELIGIBLE` remains ineligible. `CERTIFIED_ELIGIBLE` rows are only potentially eligible after the canonical runtime predicate and all separate activation gates are satisfied.

The mathematical reconciliation rule is:

`NULL + CERTIFIED_ELIGIBLE + PUBLIC_SCOPE_UNVERIFIED + CERTIFIED_INELIGIBLE + excludedOutOfScope = totalPropertyRows`

Missing counts, negative counts, non-integer counts, impossible totals, unsupported gaps, and contradictory supplied evidence fail closed.

## Phase Awareness

The same distribution can mean different things in different rollout phases:

- `PRE_WRITE` cannot certify post-write distribution;
- `FIRST_BOUNDED_WRITE` may be successful but still partial;
- `INITIALIZATION_IN_PROGRESS` remains not ready;
- `INITIALIZATION_COMPLETE` requires no unexplained `NULL` population;
- `UNVERIFIED_RESOLUTION_IN_PROGRESS` remains not ready;
- `FINAL_PRE_ACTIVATION_CERTIFICATION` requires no remaining `NULL` or `PUBLIC_SCOPE_UNVERIFIED` rows.

## Activation Boundary

DB distribution certification is one prerequisite only. It never activates `CERTIFIED_ELIGIBILITY`, never authorizes runtime mode changes, and never replaces provider snapshot certification, transition/write chain certification, Discovery Parity, Search/Typesense/fallback/Saved Search readiness, Activation Operations Readiness, or explicit operator authorization.

Protected actions remain prohibited: provider calls, credential retrieval, DB reads/writes, Prisma changes, runtime activation, Search mutation, Typesense mutation/rebuild, Saved Search mutation, alerts, email, CRM, queues/workers, deployment, and Vercel operations.
