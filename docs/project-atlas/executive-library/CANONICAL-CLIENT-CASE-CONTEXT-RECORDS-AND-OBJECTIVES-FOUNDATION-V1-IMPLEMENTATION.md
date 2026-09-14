# PROJECT ATLAS - Canonical Client Case Context Records and Objectives Foundation V1

## Scope

This implementation extends the existing owner-scoped `ClientCase` root with durable objectives, canonical Facts, and canonical Criteria. It is an additive persistence and server-domain foundation only. It does not add a Client Case UI, cross-workspace consumption, Scenario runtime, a readiness engine, analytical snapshots, Transaction or Output lineage changes, Saved Search synchronization, CRM activity, external contact, or production backfill.

## Durable Records

- `ClientCaseObjective` supports the registered objective types `BUY_PRIMARY_HOME`, `SELL_CURRENT_HOME`, `INVESTMENT_ACQUISITION`, and `FINANCIAL_STRATEGY`, with `ACTIVE`, `COMPLETED`, and `ARCHIVED` lifecycles.
- `ClientCaseFact` and `ClientCaseCriterion` are distinct records with independent semantic registries, values, scope, provenance, timing, and successor lineage.
- Scope is explicit and server-validated as `CASE`, `OBJECTIVE`, or the existing `ClientCaseProperty` relationship. Property scope never accepts a bare physical-property identifier.
- Fact and Criterion records keep a non-null scope reference and partial unique current-record index. A successor transaction first marks the predecessor superseded and then creates the new record; historical values remain available.

## Semantic Registry

The initial registry is intentionally small and code-owned. It contains one low-risk property Fact (`PROPERTY_OCCUPANCY_STATUS`) and three representative Criteria (`TARGET_CITIES`, `MIN_BEDROOMS`, and `PURCHASE_PRICE_RANGE_CENTS`). Values are validated against their registered type and allowed scope before persistence. New keys require a bounded code change and registry validation; the foundation is not a user-defined key/value store.

## Provenance and Ownership

The server derives the Case owner from the authenticated Agent subject passed to the domain service. Objective and Case-property scope targets must belong to that same Case. Admitted `EvidenceAdmission` and materialized `ProfessionalInput` references are owner-checked and may be used only with their matching source posture. This foundation neither creates evidence nor promotes an Evidence Candidate, external response, or Professional Input.

## Migration

Migration: `20260914000000_add_client_case_context_records_and_objectives_foundation`

The SQL only creates Foundation V1 enums, tables, indexes, and foreign keys. It contains no data update, insert, backfill, drop, truncate, or reset. Existing `ClientCase` rows remain valid with zero objectives, Facts, or Criteria.

## Compatibility

Old application with new schema is safe because all additions are new tables and reverse relations; no existing column, required relation, or existing record is changed. New application with the old Production schema is also safe: the new server-domain module has no route or workspace consumer, and no startup or existing request path queries its new Prisma delegates. A normal application publication may therefore precede the separately authorized Production migration; Foundation V1 persistence remains unavailable until that migration is applied.

## Validation

`npm run check:client-case-context-records-foundation` verifies the schema/migration invariants, separate Fact and Criterion contracts, registry discipline, property/objective scope validation, successor behavior, ownership denial, invalid-value rejection, and prohibited runtime vocabulary. Existing Client Case, Evidence Admission, Professional Input, Client Authorization, Output, and multi-property Scenario checks remain separate regressions.

## Production Gate

No Production schema migration, data mutation, deployment, or human UI review is performed by this foundation implementation. The required next protected-system decision is explicit authorization of the reviewed migration artifact and its approved publication sequence.
