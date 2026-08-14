# REIE Public Search Eligibility Discovery Parity Certification Architecture

Program: `REIE_PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_ARCHITECTURE`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_ARCHITECTURE_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

This workstream adds a pure deterministic certification architecture for planned public Search discovery, Typesense index inclusion, database Search fallback eligibility, Saved Search eligibility, and `NEW_LISTING` alert candidacy. It does not wire the certified predicate into production runtime behavior, rebuild Typesense, mutate Search, mutate Saved Search, create alerts, call providers, read live databases, write rows, run workers, deploy, or activate `CERTIFIED_ELIGIBILITY`.

## Architectural Foundation

Implementation:

- `lib/mls/publicSearchEligibilityDiscoveryParityCertification.ts`

Fixture checker:

- `scripts/checkPublicSearchEligibilityDiscoveryParityCertification.ts`

The certification contract composes the canonical runtime predicate from `lib/mls/publicSearchEligibilityRuntimeContract.ts` through `evaluatePublicSearchEligibilityRuntime`. It does not create a competing public-search eligibility predicate.

## Parity Contract

The contract classifies supplied planned semantics as:

- `PARITY`
- `DIVERGENCE`
- `INSUFFICIENT_EVIDENCE`

`PARITY` requires the planned public Search discovery, Typesense inclusion, and database fallback decisions to equal the canonical public-discovery predicate. It also requires planned Saved Search and `NEW_LISTING` decisions to equal the canonical Saved Search and alert predicates.

`DIVERGENCE` identifies the exact surface that differs from the canonical predicate:

- public Search discovery;
- Typesense index inclusion;
- database Search fallback;
- Saved Search;
- `NEW_LISTING` alert candidacy.

`INSUFFICIENT_EVIDENCE` is returned when any planned surface is missing or explicitly unavailable. Missing evidence does not certify parity.

## Search, Typesense, And Fallback Semantics

The shared public-discovery predicate remains authoritative. In `CERTIFIED_ELIGIBILITY` mode, `CERTIFIED_ELIGIBLE` is necessary but not sufficient. Public-scope status must still be present, private-exclusive listings remain blocked, and other public-read restrictions remain blocking.

Typesense planned inclusion must equal the canonical public Search discovery predicate. Database Search fallback planned eligibility must also equal that same predicate. This contract only certifies planned semantics; it does not alter Typesense indexing or database fallback code.

## Saved Search And NEW_LISTING Semantics

Saved Search and `NEW_LISTING` eligibility require the canonical public-discovery predicate plus:

- exact `Active` status;
- source freshness for Saved Search;
- saved-search criteria match;
- alert consent;
- no duplicate alert event.

`Coming Soon` can remain public Search eligible under the canonical predicate while failing closed for `NEW_LISTING` candidacy.

## Null, Unverified, And Ineligible Semantics

In `CERTIFIED_ELIGIBILITY` mode:

- `NULL` fails closed;
- `PUBLIC_SCOPE_UNVERIFIED` fails closed;
- `CERTIFIED_INELIGIBLE` fails closed;
- `CERTIFIED_ELIGIBLE` remains subject to status, privacy, and public-read restrictions.

In `LEGACY` mode, the eligibility state is not required for current public discovery behavior.

## Fixture Certification

Validation command:

- `npm run check:public-search-eligibility-discovery-parity-certification`

Certified cases:

- fully aligned certified-eligible case;
- `PUBLIC_SCOPE_UNVERIFIED` fail closed;
- `CERTIFIED_INELIGIBLE` fail closed;
- `NULL` fail closed in certified mode;
- `CERTIFIED_ELIGIBLE` blocked by private-exclusive posture;
- public Search predicate divergence;
- Typesense inclusion divergence;
- database fallback divergence;
- Saved Search divergence;
- Saved Search exact `Active` requirement;
- Saved Search freshness requirement;
- Saved Search criteria-match requirement;
- Saved Search consent requirement;
- Saved Search dedup requirement;
- insufficient evidence classification;
- deterministic identical-input output;
- certification cannot activate runtime behavior;
- certification cannot mutate Search;
- certification cannot mutate Typesense;
- certification cannot create Saved Search events;
- certification cannot create alerts or send email;
- legacy-versus-certified mode distinction.

## Protected Boundaries

This workstream performed:

- zero MLS Grid calls;
- zero LightBox calls;
- zero ATTOM calls;
- zero county calls;
- zero provider credential retrieval;
- zero live provider snapshot traversal;
- zero database access requiring credentials;
- zero eligibility-row writes;
- zero migrations;
- zero runtime activation;
- zero Search behavior changes;
- zero Typesense mutation or rebuild;
- zero database fallback behavior changes;
- zero Saved Search behavior changes;
- zero AlertEvent or AlertQueue creation;
- zero email sends;
- zero worker execution;
- zero deployment.

## Next Gate

`READY_FOR_DISCOVERY_PARITY_ARCHITECTURE_SYNCHRONIZATION`
