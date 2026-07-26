# PROJECT ATLAS(tm)

## GOF 1.0 Wave 3A - Controlled Colorado Production Persistence Activation(tm)

Status: `CERTIFIED_ACTIVATION_FOUNDATION`

Implementation date: July 26, 2026

Repository baseline: `0ab48fbf680839d024849c89e4ee646fbda5f8f8`

GOF WAVE 3A STATUS: `CERTIFIED_ACTIVATION_FOUNDATION`

READINESS CLASSIFICATION: `TRANSACTION_CONTRACT_ONLY`

PRODUCTION EXECUTION STATUS: `NOT_EXECUTED`

RETRIEVAL STATUS: `NOT_AUTHORIZED`

RELATIONSHIP STATUS: `NOT_AUTHORIZED`

RUNTIME ACTIVATION STATUS: `NOT_AUTHORIZED`

CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`

GOF WAVE 4 STATUS: `NOT_AUTHORIZED`

---

## 1. Mission

GOF Wave 3A implements the controlled transaction boundary required for a future production persistence of the certified Colorado `STATE` candidate.

This wave does not execute the production write. It prepares the write-capable service contract, explicit operator controls, fake transactional proof, rollback behavior, idempotency behavior, read-only production preflight, and activation-review record required before any production mutation may be separately authorized.

The certified readiness classification is `TRANSACTION_CONTRACT_ONLY`: the port, transaction contract, fake transaction tests, and activation controls exist; no real Prisma transaction adapter and no production terminal execution command exist in this wave.

Preserved separations:

- persistence is not retrieval;
- subject persistence is not relationship approval;
- persistence is not runtime activation;
- activation is not customer visibility;
- production credentials alone are not execution authorization.

---

## 2. Transaction Architecture

Wave 3A adds:

`lib/gof/coloradoControlledProductionPersistenceActivation.ts`

The service consumes the certified Wave 3 contract:

`lib/gof/coloradoControlledProductionPersistence.ts`

The service writes only through a transaction-port interface:

- `readImmediatePreflight()`;
- `transaction(operation)`;
- `createColoradoObject()`;
- `createSource()`;
- `createAlias()`;
- `createObservation()`;
- `createEligibility()`.

The transaction sequence is:

1. create one Colorado `GeographicObject`;
2. create or deduplicate governed source references;
3. create two aliases;
4. create five governed observations;
5. create one eligibility row with every flag false.

The service creates zero `GeographicRelationship` rows and zero `PropertyGeographicRelationship` rows.

Production rollback is design-proven at the port/fake level only. A real Prisma transaction adapter must still prove rollback behavior in a separate activation-execution substep before any production write.

No public route, protected route, worker, customer route, Search integration, Maps integration, Property Intelligence integration, AI integration, or Executive Intelligence integration is created.

---

## 3. Execution Controls

Future execution requires all of:

- `dryRun = false`;
- execution scope `GOF_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION`;
- confirmed production environment;
- explicit operator authorization;
- acknowledgement that persistence is not retrieval;
- acknowledgement that no relationships are authorized;
- acknowledgement that no customer visibility is authorized;
- exact certified candidate fingerprint;
- branch `main`;
- HEAD and `origin/main` at `0ab48fbf680839d024849c89e4ee646fbda5f8f8`;
- clean working tree;
- immediate successful preflight.

Credentials alone do not authorize execution.

This implementation phase deliberately does not add a production execution script. The future controlled execution method should be a terminal-only command reviewed in a separate activation-execution package. An admin route is not needed because the operation is one controlled governed persistence transaction and can be safer as an operator-run terminal command with repository and database preflight evidence.

---

## 4. Exact Write Contract

Target `GeographicObject`:

| Field | Value |
| --- | --- |
| `objectType` | `STATE` |
| `canonicalName` | `Colorado` |
| `displayName` | `Colorado` |
| `canonicalSlug` | `colorado` |
| `lifecycleStatus` | `DRAFT` |
| `visibility` | `INTERNAL_ONLY` |
| `convenienceParentId` | `null` |
| `mergedIntoId` | `null` |

Database ID is generated only by production persistence during a future authorized transaction.

Planned companion rows:

| Component | Count |
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

Eligibility flags:

- `internalUse = false`;
- `searchEligible = false`;
- `mapEligible = false`;
- `publicPageEligible = false`;
- `indexingEligible = false`;
- `propertyEnrichment = false`;
- `marketAnalytics = false`.

---

## 5. Evidence and Provenance

Persisted source references:

- `State of Colorado`;
- `Colorado GIS`;
- `U.S. Census Bureau`;
- `USGS/GNIS`;
- `PROJECT ATLAS - REAL ESTATE DATA TOOLS`.

Persisted observations preserve:

- Wave 2 evidence ID;
- provider;
- source identifier;
- authority domain;
- evidence type;
- source value;
- conflict status;
- production eligibility flag.

The schema does not directly represent every governance sentence from Wave 2, including long-form licensing/use notes and refresh narrative. Those remain retained in repository governance artifacts and are summarized through source classification, observation values, freshness, confidence, derivation method, review status, and internal-only visibility.

No geometry is persisted.

Evidence-fidelity classification:

| Evidence attribute | Treatment |
| --- | --- |
| provider | stored directly in source name and observation JSON |
| source identifier | stored directly in observation JSON |
| authority domain | stored directly in observation JSON |
| provenance | retained in repository governance and summarized by reviewed observation status |
| confidence | stored directly as `HIGH` on observations |
| licensing/use limitations | retained in repository governance, not directly modeled |
| refresh expectations | normalized through source update cadence and retained in repository governance |
| conflict state | stored directly in observation JSON |
| effective date | retained in Wave 2 governance; not separately persisted by this contract |
| acquisition date | retained in Wave 2 governance; not separately persisted by this contract |
| evidence fingerprint | retained in execution controls and activation evidence |

---

## 6. Idempotency and Conflict Behavior

Expected future behavior:

- empty production state: create one complete governed record set;
- identical complete state: create zero rows and return idempotent success;
- partial prior state: fail closed;
- conflicting prior state: fail closed;
- unrelated records: unchanged.

Conflicts include:

- object type mismatch;
- slug mismatch;
- canonical/display name mismatch;
- lifecycle mismatch;
- visibility mismatch;
- alias mismatch;
- source/evidence mismatch;
- eligibility mismatch;
- companion-record count mismatch;
- any relationship rows.

The fake transaction check proves identical rerun creates zero rows and does not mutate existing fake state.

---

## 7. Rollback and Suppression

Failed initial writes must roll back transactionally. Wave 3A fake transaction tests prove a forced companion-record failure leaves no partial object, alias, source, observation, or eligibility state behind.

Partial production state is not auto-repaired. It fails closed and requires separate corrective authorization.

Post-persistence suppression remains non-destructive by default:

- keep lifecycle `DRAFT`;
- keep visibility `INTERNAL_ONLY`;
- keep all eligibility false;
- keep retrieval disabled;
- keep relationships disabled;
- require separate authorization for corrective mutation.

Destructive deletion is not the default remediation because the governed object and evidence are enterprise audit records once persisted.

---

## 8. Activation-Review Gate

Wave 3A stops at transaction-contract implementation and activation planning.

Before production execution, a separate formal activation-readiness review must verify:

- repository baseline;
- clean working tree;
- migration status up to date;
- `STATE` enum present;
- Colorado object count zero unless proving exact idempotency;
- no conflicting slug/name/source/alias records;
- Thornton fingerprint unchanged;
- relationship counts zero;
- certified candidate fingerprint unchanged;
- execution scope and operator authorization valid;
- post-write validation plan ready;
- idempotency rerun plan ready.

Production execution remains unauthorized until a separate activation-execution review explicitly authorizes a real Prisma adapter, terminal command, operator invocation, and post-write verification.

---

## 9. Future Command Design

The future controlled method should be a terminal command, not an application route.

Proposed command shape for a later authorization package:

`npm run gof:wave3a:execute-colorado -- --execute --scope GOF_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION --authorization-id <GOVERNED_ID> --operator <OPERATOR_ID> --candidate-fingerprint <FINGERPRINT>`

That command does not exist in this wave. A real Prisma adapter also does not exist in this wave.

The future command must:

- refuse execution unless `--execute` is present;
- run dry-run by default;
- confirm repository HEAD and `origin/main`;
- confirm clean working tree;
- run immediate production preflight;
- execute one transaction;
- run post-write validation;
- run an idempotency rerun;
- print a governed evidence summary without secrets.

---

## 10. Post-Write Validation Design

Future read-only verification must confirm:

- exactly one Colorado `STATE` object;
- canonical name `Colorado`;
- display name `Colorado`;
- slug `colorado`;
- lifecycle `DRAFT`;
- visibility `INTERNAL_ONLY`;
- aliases `CO` and `State of Colorado`;
- expected sources;
- expected observations;
- all eligibility flags false;
- zero geographic relationships;
- zero property-geographic relationships;
- Thornton unchanged;
- Sprint 7 cannot retrieve Colorado;
- no customer-visible integration exists.

No production endpoints should be called as part of Wave 3A activation unless a later package explicitly authorizes an internal-only route check.

---

## 11. Safety Check

Wave 3A adds:

`npm run check:gof-wave-3a-controlled-colorado-production-persistence-activation`

The check proves with fake/in-memory persistence:

- unauthorized execution fails;
- dry run writes zero;
- wrong scope fails;
- candidate fingerprint mismatch fails;
- first authorized execution creates one complete record set;
- transaction failure rolls back everything;
- identical second execution creates zero rows;
- partial prior state fails closed;
- conflicting prior state fails closed;
- no relationships are created;
- Thornton is unchanged;
- retrieval remains disabled;
- runtime/customer integration is absent.

The check also performs read-only production preflight proving Colorado remains unpersisted at the time of implementation and that no Colorado alias, observation, or modeled companion conflict is present.

---

## 12. Retained Prohibitions

Wave 3A does not authorize:

- executing the Colorado production write;
- creating a Colorado production row during this implementation phase;
- creating relationships;
- changing Thornton;
- enabling Colorado retrieval;
- changing Sprint 7;
- changing EKCP;
- creating routes;
- activating runtime behavior;
- exposing customer functionality;
- integrating Search, Maps, Property Intelligence, AI, or Executive Intelligence;
- processing saved-search alerts, workers, email, CRM, or MLS;
- beginning GOF Wave 4.
