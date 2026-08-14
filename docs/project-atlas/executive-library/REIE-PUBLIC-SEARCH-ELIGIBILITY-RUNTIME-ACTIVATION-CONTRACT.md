# REIE Public Search Eligibility Runtime Activation Contract

Program: `REIE_PUBLIC_SEARCH_ELIGIBILITY_RUNTIME_ACTIVATION_CONTRACT`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`PUBLIC_SEARCH_ELIGIBILITY_RUNTIME_ACTIVATION_CONTRACT_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

This certification defines the pure runtime activation contract for `Property.publicSearchEligibility`. It does not activate the predicate in application runtime, mutate `Property`, call MLS Grid or any other provider, rebuild Typesense, change Search behavior, change Saved Search behavior, create alerts, send email, deploy, or consume external quota.

## Workstream 1 Synchronization

Synchronized first-write readiness commit:

- `47da16c024fd44d4de0108fb1ba890b32d7744b6`
- `Certify public search eligibility first write readiness`

Post-sync canonical baseline before this local work:

- `HEAD = origin/main = 47da16c024fd44d4de0108fb1ba890b32d7744b6`
- divergence `0 behind / 0 ahead`
- working tree clean

## Activation Mode Contract

Implementation:

- `lib/mls/publicSearchEligibilityRuntimeContract.ts`

Supported modes:

- `LEGACY`
- `CERTIFIED_ELIGIBILITY`

`LEGACY` preserves current public discovery behavior. `publicSearchEligibility` is ignored in this mode, including when it is `NULL`, `CERTIFIED_ELIGIBLE`, `PUBLIC_SCOPE_UNVERIFIED`, or `CERTIFIED_INELIGIBLE`.

`CERTIFIED_ELIGIBILITY` makes `publicSearchEligibility` an additional fail-closed predicate for public Search discovery, Typesense inclusion, database fallback inclusion, Saved Search matching, and `NEW_LISTING` alert candidacy.

## Activation Preconditions

Certified activation is not ready until all of the following are true:

- provider snapshot certified complete;
- transition writes executed;
- absent rows reconciled or explicitly accepted fail-closed;
- database eligibility distribution certified;
- expected `NULL` population understood;
- unresolved state-drift failures equal `0`;
- Search index activation plan certified;
- Typesense rebuild ready;
- Saved Search behavior ready;
- alert behavior separately gated;
- database distribution no longer remains all `NULL`.

Current expected readiness is `NOT_READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY`.

Current blocking reasons include:

- `PROVIDER_SNAPSHOT_NOT_CERTIFIED_COMPLETE`
- `TRANSITION_WRITES_NOT_EXECUTED`
- `DB_ELIGIBILITY_DISTRIBUTION_NOT_CERTIFIED`
- `EXPECTED_NULL_POPULATION_NOT_UNDERSTOOD`
- `SEARCH_INDEX_ACTIVATION_PLAN_NOT_CERTIFIED`
- `TYPESENSE_REBUILD_NOT_READY`
- `DB_REMAINS_ALL_NULL`

## Public Search Predicate

In `CERTIFIED_ELIGIBILITY` mode, a property is eligible for public Search only when:

- `publicSearchEligibility = CERTIFIED_ELIGIBLE`;
- authoritative status remains public-scope, currently `Active` or `Coming Soon`;
- `isPrivateExclusive = false`;
- no other public-read restriction is present.

The certified eligibility state is additive. It does not override status, privacy, or any other public-read restriction.

## Null Semantics

In `LEGACY` mode, `NULL` does not change public discovery.

In `CERTIFIED_ELIGIBILITY` mode, `NULL` fails closed with:

- `CERTIFIED_ELIGIBILITY_REQUIRED_NULL_FAIL_CLOSED`

## Unverified Semantics

`PUBLIC_SCOPE_UNVERIFIED` fails closed in `CERTIFIED_ELIGIBILITY` mode with:

- `PUBLIC_SCOPE_UNVERIFIED_FAIL_CLOSED`

This state is not publicly discoverable until a later certified transition resolves it.

## Ineligible Semantics

`CERTIFIED_INELIGIBLE` fails closed in `CERTIFIED_ELIGIBILITY` mode with:

- `CERTIFIED_INELIGIBLE_FAIL_CLOSED`

## Certified Eligible Semantics

`CERTIFIED_ELIGIBLE` is necessary but not sufficient. Public discovery still requires public-scope status, no private-exclusive flag, and no other public-read restriction.

Representative block reasons:

- `CERTIFIED_ELIGIBLE_PRIVATE_EXCLUSIVE_BLOCKED`
- `CERTIFIED_ELIGIBLE_STATUS_NOT_PUBLIC`
- `CERTIFIED_ELIGIBLE_OTHER_PUBLIC_RESTRICTION_BLOCKED`

## Typesense Index Predicate

The contract requires Typesense inclusion to equal the shared public Search predicate. No separate Typesense-only eligibility rule is allowed.

This workstream did not rebuild or mutate Typesense.

## Search Fallback Parity

The contract requires database fallback eligibility to equal the shared public Search predicate. Fallback must not leak records blocked from Typesense by certified eligibility.

This workstream did not change Search runtime behavior.

## Property Product Boundary

Historical property route retention remains separate from public Search discovery. A property blocked from public Search under the certified predicate may still retain its historical property-route behavior when otherwise authorized by the existing product contract.

The fixture contract pins `historicalPropertyRouteRetained = true` separately from Search eligibility.

## Saved Search / NEW_LISTING Predicate

Saved Search matching and `NEW_LISTING` alert candidacy must use the same certified public discovery predicate, then additionally require:

- authoritative status exactly `Active`;
- source freshness for Saved Search;
- saved-search criteria match;
- alert consent;
- no duplicate alert event.

`Coming Soon` can be Search eligible but is not a `NEW_LISTING` alert candidate under this contract.

This workstream did not activate alert consumers, create queue jobs, or send email.

## Fixture Certification

Fixture script:

- `scripts/checkPublicSearchEligibilityRuntimeContract.ts`

Package script:

- `npm run check:public-search-eligibility-runtime-contract`

Certified cases:

- legacy `NULL`;
- legacy certified eligible;
- certified activation `NULL`;
- certified activation `PUBLIC_SCOPE_UNVERIFIED`;
- certified activation `CERTIFIED_INELIGIBLE`;
- certified activation `CERTIFIED_ELIGIBLE` with `Active`;
- certified activation `CERTIFIED_ELIGIBLE` with `Coming Soon`;
- certified activation `CERTIFIED_ELIGIBLE` with private-exclusive block;
- certified activation `CERTIFIED_ELIGIBLE` with non-public status block;
- Search predicate;
- Typesense predicate;
- database fallback predicate parity;
- Saved Search predicate;
- `NEW_LISTING` composition;
- historical route retention as separate behavior;
- activation readiness when all prerequisites are present;
- missing provider snapshot;
- unresolved writes;
- all-`NULL` database;
- unresolved state drift;
- deterministic reason codes;
- no database writes;
- no provider calls;
- no Typesense mutation;
- no alert side effects.

## Activation Sequence

Future activation sequence:

1. provider rate clearance
2. scoped ingest recertification
3. complete public snapshot
4. deterministic eligibility plan
5. first bounded write
6. complete eligibility initialization
7. resolve unverified population
8. certify DB distribution
9. activate shared runtime predicate
10. rebuild Typesense
11. certify Search/fallback parity
12. certify Saved Search predicate
13. later authorize one-send alert proof

## Rollback / Deactivation Design

The deactivation design requires:

- activation config remains separate from stored eligibility;
- rollback to `LEGACY` mode does not rewrite eligibility rows;
- material Search regression returns runtime to `LEGACY` mode.

## Build And Static Validation

Required validation set:

- `npm run check:public-search-eligibility-state-contract`
- `npm run check:public-search-eligibility-initialization-plan`
- `npm run check:public-search-eligibility-transition-execution`
- `npm run check:public-search-eligibility-first-write-readiness`
- `npm run check:public-search-eligibility-runtime-contract`
- `npm run typecheck`
- `npm run worker:build`
- `npm run build`
- `git diff --check`

Generated `dist` output is build artifact only and must be cleaned before commit scope certification.

## Protected Boundaries

This workstream performed:

- zero provider API calls;
- zero LightBox calls;
- zero ATTOM investigation;
- zero MLS Grid calls;
- zero database writes;
- zero `Property` row mutations;
- zero Prisma schema changes;
- zero Search runtime activation;
- zero Typesense mutation or reindex;
- zero Saved Search runtime activation;
- zero alert creation;
- zero queue job creation;
- zero email sends;
- zero deployment.

Provider status remains:

- MLS Grid: `LIVE_CALLS_PAUSED_PENDING_SUPPORT_RATE_LIMIT_CLARIFICATION`
- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed in this workstream: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Next Authorization Gate

`READY_FOR_PUBLIC_SEARCH_ELIGIBILITY_RUNTIME_ACTIVATION_CONTRACT_SYNCHRONIZATION`
