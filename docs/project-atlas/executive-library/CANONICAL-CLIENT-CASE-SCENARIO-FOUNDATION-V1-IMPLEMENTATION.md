# PROJECT ATLAS - Canonical Client Case Scenario Foundation V1

## Scope

This implementation adds a durable, server-only generic Scenario foundation beneath the existing owner-scoped `ClientCase`. A Case may have zero or more independent hypothetical Scenarios. A Scenario is not a replacement Case, a recommendation, a Plan, a Transaction, an Output, Evidence, Professional Input, a Saved Search, or a client authorization.

The implementation adds no route, UI, selector, effective-context resolver, readiness engine, analytical snapshot, capability consumer, cross-workspace prefill, Output/Transaction lineage, CRM integration, or production Scenario data.

## Durable Model

- `ClientCaseScenario` is the Case-owned logical root with mutable editorial metadata (`name`, optional `description`) and minimal lifecycle (`ACTIVE`, `ARCHIVED`). Physical delete and reactivation operations are intentionally absent.
- `ClientCaseScenarioVersion` is a stable, immutable definition with a per-Scenario monotonic `versionNumber`. The root stores a deterministic `currentVersionId`; arbitrary timestamp ordering is not used to select the current definition.
- Each version owns its own `ClientCaseScenarioAssumption`, `ClientCaseScenarioCriterion`, `ClientCaseScenarioPropertyDisposition`, and `ClientCaseScenarioObjective` children. Versions hold the complete Scenario-specific overlay, not canonical Case Facts or Criteria.
- A duplicate creates a new root and independent Version 1, copying the source current definition and recording source Scenario/version lineage. There is no live inheritance or shared mutable child row.

## Semantics and Boundaries

The bounded code-owned registry admits only capability-neutral hypothetical assumptions (`TARGET_ACQUISITION_PRICE_CENTS`, `DOWN_PAYMENT_BPS`, `CASH_ALLOCATION_CENTS`, and `HOLDING_PERIOD_MONTHS`) and Scenario criteria (`TARGET_CITIES`, `MIN_BEDROOMS`, and `MAX_PURCHASE_PRICE_CENTS`). Values are validated by typed semantic key. This is not arbitrary JSON or a general override facility.

Property dispositions are `SELL`, `RETAIN`, or `RETAIN_AS_RENTAL` and reference an existing same-Case `ClientCaseProperty`; they do not change the physical Property or canonical Case-property role. Objective links are many-to-many at the Scenario-version level and must reference same-Case objectives. Unknown prospective property acquisition is deliberately deferred rather than represented with a fake physical Property.

Scenario assumptions are explicitly hypothetical. They cannot masquerade as canonical Facts, Evidence, Professional Input, Transaction truth, Output truth, or authorization state. Scenario-specific criteria remain separate from `ClientCaseCriterion`.

## Ownership, Versioning, and Transactions

The server domain receives the authenticated Agent subject from its caller and owner-scopes every read and mutation through `ClientCase`. Case, Scenario, Objective, and Case-property references are validated together. Cross-owner and cross-Case access fails closed.

Create, definition update, and duplicate use Prisma interactive transactions. Creation produces the root, Version 1, children, and current-version pointer atomically. Definition updates require `expectedCurrentVersionId`, create a new version, and conditionally advance the pointer; stale updates and concurrent duplicate version numbers fail closed. Root metadata rename does not create a definition version. Archived Scenarios preserve history and reject definition updates.

The database enforces stable version identity, per-Scenario unique version numbering, and foreign-key identity. The complete invariant that a root `currentVersionId` belongs to that same root is enforced transactionally in the server domain; no public operation accepts an arbitrary current-version pointer.

## Migration

Migration: `20260914010000_add_client_case_scenario_foundation`

The migration adds three Scenario enums, six Scenario tables, indexes, unique constraints, and restrictive foreign keys only. It contains no `DROP`, `TRUNCATE`, `DELETE`, `INSERT`, data update, backfill, schema rewrite, or change to existing Client Case semantics. Existing Cases remain valid with zero Scenarios, and no baseline or default Scenario is created.

## Compatibility and Publication

Old application with the new schema is safe because additions are new Scenario tables and reverse relations only. New application with the current Production schema is also safe because the Scenario service has no route, workspace, startup, or existing request-path consumer. The recommended protected publication order is application publication first, then the separately authorized exact Production migration. Neither normal push nor Production migration is authorized by this implementation package.

## Validation

`npm run check:client-case-scenario-foundation` uses synthetic in-memory data to prove root/version creation, multiple Case Scenarios, immutable history, stale update rejection, independent duplication, archive/history behavior, same-Case Objective/property validation, owner isolation, no partial creation after validation failure, and canonical Fact/Criterion/property-role protection.

Foundation V1, multi-property financial Scenario, Buyer/Seller, intelligence, financial/investment, Output/auth/evidence, and Saved Search/CRM regressions remain separate gates. No Production Scenario record is created for validation.

## Deferred Work

The generic effective-context resolver, capability readiness contracts, analytical snapshots, Scenario UI, active Scenario session state, Buyer/Seller/Financial/Investment/Property/Location/Market consumption, Scenario comparison, adopted-plan semantics, prospective acquisition representation, and Output/Transaction lineage remain deferred.
