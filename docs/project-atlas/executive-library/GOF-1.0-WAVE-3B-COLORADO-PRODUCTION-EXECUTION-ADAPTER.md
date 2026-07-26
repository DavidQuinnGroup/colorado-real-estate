# PROJECT ATLAS(tm)

## GOF 1.0 Wave 3B - Colorado Production Execution Adapter(tm)

Status: `CERTIFIED_EXECUTION_READY`

Implementation date: July 26, 2026

Repository baseline: `eac5efdee2d420670219c973a1cafa0aa83b78f7`

GOF WAVE 3B STATUS: `CERTIFIED_EXECUTION_READY`

EXECUTION READINESS CLASSIFICATION: `EXECUTION_READY_PENDING_OPERATOR_AUTHORIZATION`

OPERATOR CONTROL CLASSIFICATION: `PRESENCE_ONLY_OPERATOR_CONTROL`

MOCKED PRISMA PROOF: `PRESENT`

PRODUCTION DRY-RUN PROOF: `PRESENT`

PRODUCTION WRITE PROOF: `NONE`

PRODUCTION EXECUTION STATUS: `NOT_EXECUTED`

RETRIEVAL STATUS: `NOT_AUTHORIZED`

RELATIONSHIP STATUS: `NOT_AUTHORIZED`

RUNTIME ACTIVATION STATUS: `NOT_AUTHORIZED`

CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`

GOF WAVE 4 STATUS: `NOT_AUTHORIZED`

---

## 1. Mission

Wave 3B implements the real Prisma-backed execution adapter and terminal command required for a future controlled production persistence of the certified Colorado `STATE` candidate.

This wave does not execute the production write. It ends at certified execution readiness only: `EXECUTION_READY_PENDING_OPERATOR_AUTHORIZATION`.

---

## 2. Real-Adapter Architecture

Wave 3B adds:

`lib/gof/coloradoProductionExecutionAdapter.ts`

The adapter consumes the certified Wave 3 persistence contract and implements a Prisma-backed Wave 3A transaction port. It exposes only the Colorado `STATE` activation path and does not expose a generic geographic-object write method.

The `GeographicObject` `STATE` lookup/create path uses Prisma raw SQL inside the Prisma client/transaction boundary because the deployed generated Prisma client may reject newly added enum values before client regeneration. Companion source, alias, observation, and eligibility writes remain on Prisma model APIs.

Implemented adapter capabilities:

- read-only production preflight;
- complete-state inspection;
- conflict inspection;
- one Prisma transaction;
- deterministic created and deduplicated counts;
- exact-state idempotent success;
- fail-closed partial-state behavior;
- fail-closed conflict behavior.

The adapter creates zero relationship rows and does not modify existing geographic objects.

---

## 3. Command Design

Wave 3B adds:

`scripts/activateGofWave3bColoradoPersistence.ts`

Package command:

`npm run activate:gof-wave-3b-colorado-persistence -- --dry-run`

The command defaults to dry run. It is not invoked by builds, deployments, tests, linting, type checking, worker compilation, or package installation.

Future execution requires:

- `--execute`;
- exact scope `GOF_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION`;
- `--expected-commit`;
- `--candidate-fingerprint`;
- `--confirm-production`;
- `--authorization-id`;
- `--operator-id`;
- `--acknowledge-persistence-not-retrieval`;
- `--acknowledge-no-relationships`;
- `--acknowledge-no-customer-visibility`;
- environment variable `GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN`.

The token is not embedded in source code and is not printed in command output.

The token control is presence-only in Wave 3B. Source code does not contain or validate a fixed token value. Operator control is therefore certified only in combination with the exact commit, exact scope, exact candidate fingerprint, operator metadata, production confirmation, and explicit no-retrieval/no-relationship/no-customer-visibility acknowledgements.

---

## 4. Repository Control

Execution controls require:

- branch `main`;
- `HEAD = expectedCommit`;
- `origin/main = expectedCommit`;
- clean working tree;
- Prisma migrations up to date.

The clean-working-tree check excludes only command-generated `dist` output so the package build step cannot mark its own dry-run command dirty. Source, documentation, configuration, Prisma, route, runtime, and integration drift remain blocking.

Wave 3B uses a governed expected-commit parameter rather than hardcoding its own future commit. This keeps repository validation strong without making later certified execution impossible after the Wave 3B implementation commit.

---

## 5. Transaction Behavior

The future authorized transaction atomically creates:

- one `GeographicObject`;
- two aliases;
- five governed source records;
- five governed observations;
- one eligibility row.

Target object:

| Field | Value |
| --- | --- |
| `objectType` | `STATE` |
| `canonicalName` | `Colorado` |
| `displayName` | `Colorado` |
| `canonicalSlug` | `colorado` |
| `lifecycleStatus` | `DRAFT` |
| `visibility` | `INTERNAL_ONLY` |

Aliases:

- `CO`;
- `State of Colorado`.

Eligibility flags are all false.

The database-generated object ID is propagated to aliases, observations, and eligibility inside the transaction.

---

## 6. Evidence Mapping

Sources:

- `State of Colorado`;
- `Colorado GIS`;
- `U.S. Census Bureau`;
- `USGS/GNIS`;
- `PROJECT ATLAS - REAL ESTATE DATA TOOLS`.

Observations store:

- evidence ID;
- provider;
- source identifier;
- authority domain;
- evidence type;
- source value;
- conflict state;
- production eligibility flag.

Long-form provenance, licensing/use limitations, refresh narrative, effective date, and acquisition date remain retained in repository governance documentation and are summarized by source classification, observation confidence, derivation method, review status, and internal-only visibility.

---

## 7. Idempotency and Conflicts

Empty state:

- future authorized execution creates exactly one complete record set.

Exact complete state:

- future identical execution creates zero rows;
- returns idempotent success;
- does not update timestamps or governed content.

Partial state:

- fails closed;
- no automatic repair;
- no additional writes.

Conflicting state:

- fails closed;
- zero writes.

Conflicts include slug, object type, canonical/display name, aliases, source identifiers, evidence fingerprint, lifecycle, visibility, eligibility, companion-record counts, and relationships.

---

## 8. Rollback and Correction

The real adapter uses one Prisma transaction. Mocked Prisma tests prove transaction invocation and rollback behavior without production writes.

If a companion write fails, the transaction rolls back and leaves no object, alias, source, observation, or eligibility rows staged in the mocked adapter state.

Post-persistence correction is not automatic. Any corrective mutation requires separate authorization. Destructive deletion is not the default because a persisted governed object is an enterprise audit record.

---

## 9. Post-Write Verification

Wave 3B implements read-only verification through the same preflight/complete-state inspection used by idempotency.

Future post-write verification must confirm:

- exactly one Colorado `STATE` object;
- canonical and display name `Colorado`;
- slug `colorado`;
- lifecycle `DRAFT`;
- visibility `INTERNAL_ONLY`;
- exactly two aliases;
- exactly five sources;
- exactly five observations;
- exactly one all-false eligibility row;
- zero geographic relationships;
- zero property-geographic relationships;
- Thornton unchanged;
- no Sprint 7 Colorado retrieval;
- no EKCP Colorado consumption;
- no runtime/customer visibility.

---

## 10. Safe-Test Evidence

Safety command:

`npm run check:gof-wave-3b-colorado-production-execution-adapter`

The check uses mocked Prisma transaction behavior to prove:

- command defaults to dry run;
- conflicting command modes are rejected;
- credentials alone are insufficient;
- wrong scope fails;
- fingerprint mismatch fails;
- repository mismatch fails;
- dirty tree fails;
- preflight conflicts block transactions;
- first execution creates the expected record set in mocked state;
- transaction failure rolls back;
- identical repeat is idempotent;
- partial state fails closed;
- conflicting state fails closed;
- no relationship writes occur;
- Thornton remains unchanged;
- retrieval remains disabled;
- runtime/downstream integrations are absent.

Production proof remains read-only only. The production dry-run command is present and validated as a non-writing execution path. No production transaction proof is claimed before separate authorization.

---

## 11. Production Execution Gate

Production Colorado persistence remains unauthorized after Wave 3B.

Before production execution, a formal execution-readiness review must authorize:

- exact expected commit;
- exact command invocation;
- operator authorization ID;
- operator identity;
- candidate fingerprint;
- preflight evidence;
- execution window;
- post-write verification;
- idempotency rerun.

---

## 12. Retained Prohibitions

Wave 3B does not authorize:

- executing the production write;
- creating the Colorado production object;
- creating relationships;
- modifying Thornton;
- enabling Colorado retrieval;
- changing Sprint 7 or EKCP;
- changing Search, Maps, Property Intelligence, AI, or Executive Intelligence;
- creating public routes, application pages, workers, alerts, email, CRM, or MLS synchronization;
- customer visibility;
- GOF Wave 4.
