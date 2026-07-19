# EIA 1.0 Wave 2 Sprint 2 Enterprise Adapter Framework

## Sprint Status

`IMPLEMENTED_PENDING_DEPLOYMENT_VALIDATION`

## Scope

Sprint 2 extracts shared live-source adapter lifecycle behavior from the certified Repository Governance Adapter into a reusable Enterprise Adapter Framework.

The sprint refactors Repository Governance Adapter execution to consume the framework while preserving its external admin route, adapter identity, adapter version, calculation version, supported KPI IDs, source fingerprint semantics, evidence keys, idempotency keys, provenance classifications, fixture/live separation, and manual invocation model.

Platform Availability Adapter implementation is deferred. Sprint 2 does not authorize Sprint 3.

## Architectural Findings

The certified Sprint 1 adapter combined two responsibilities in `lib/repository/governanceAdapter.ts`:

- Repository-specific behavior: authoritative Repository source reads, source-state normalization, Repository governance source fingerprint input selection, supported KPI mapping, unsupported KPI explanations, and Repository-specific source query references.
- Generic lifecycle behavior: environment detection, invocation identity, source freshness classification, canonical KPI validation, provenance creation, evidence reference upsert, KPI observation/evaluation upsert, evidence linking, deduplication accounting, result shaping, and inspection.

The extraction keeps Repository source behavior in the Repository boundary and moves the generic lifecycle to `lib/enterprise-kpi/adapterFramework.ts`.

## Implemented Framework

The Enterprise Adapter Framework defines:

- `EnterpriseAdapterLifecycleConfig`
- `EnterpriseAdapterMetadata`
- `EnterpriseAdapterObservationPlan`
- `EnterpriseAdapterResult`
- `invokeEnterpriseAdapter`
- `inspectEnterpriseAdapter`
- `fingerprintEnterpriseAdapterSourceState`
- `freshnessForEnterpriseAdapterSource`

The framework does not embed Repository table names, Repository KPI IDs, Repository source queries, public routes, workers, schedulers, queues, email sends, MLS calls, CRM mutations, Typesense writes, or fixture promotion logic.

## Repository Governance Adapter Refactor

The Repository Governance Adapter now supplies a framework config with:

- Adapter ID: `REPOSITORY_GOVERNANCE`
- Adapter version: `1.0.0`
- Calculation version: `EIA-1.0-repository-governance-adapter-v1`
- Invocation prefix: `RGOV`
- Source type: `repository_governance_adapter_invocation`
- Evidence type: `REPOSITORY_GOVERNANCE_SOURCE_STATE`
- Supported KPI IDs: `KPI-GOV-001`, `KPI-GOV-002`, `KPI-GOV-003`

The existing admin route remains:

```text
/api/admin/enterprise/repository-governance-adapter
```

The route remains internal-admin only and continues to support:

- `GET` inspection.
- `POST` dry-run by default.
- `POST ?execute=true` controlled execution.

## Idempotency Preservation

The framework continues to use the Wave 1 persistence repository for observation and evaluation upserts.

Observation idempotency remains based on:

- Environment.
- Data origin.
- KPI ID.
- Period start.
- Period end.
- Observed-at timestamp.
- Source-state fingerprint.
- Calculation version.

Evaluation idempotency remains based on:

- Environment.
- Data origin.
- KPI ID.
- Observation ID.
- Source-state fingerprint.
- Calculation version.
- Threshold version.

The Repository Governance source fingerprint remains computed from sorted Repository health, object health, object versions, governance exception count, coverage summary, and PLAT traceability values.

## Provenance Handling

Execute mode continues to create EIA provenance with:

- Source system: `Enterprise Repository`
- Source query reference: `repository_health_summary + repository_object_health + repository_object + repository_governance_exception_candidates`
- Data origin: `LIVE`
- Privacy: `SYSTEM` for provenance and evidence.
- Privacy: `INTERNAL` for observations and evaluations.
- Sensitivity: `INTERNAL`
- Retention: `AUDIT` for provenance/evidence and `HISTORICAL` for observations/evaluations.
- Creating app version from `VERCEL_GIT_COMMIT_SHA`, `NEXT_PUBLIC_APP_VERSION`, or `LOCAL`.

## Fixture Handling

The framework persists only explicitly classified `LIVE` adapter outputs. It does not read, aggregate, promote, or rewrite EIF fixture observations.

Existing EIF fixture demonstrations remain separate and retain `NON_PRODUCTION_FIXTURE` handling in their existing modules.

## Access Control And Privacy

The refactor does not add public routes or UI surfaces.

The Repository Governance Adapter route continues to reuse Repository admin authorization. The framework does not inspect customer records and does not introduce email, phone, password, secret, token, or customer field references.

## Production-Write Review

Authorized write surface remains limited to governed EIA persistence writes in execute mode:

- EIA provenance.
- EIA evidence references.
- EIA KPI observations.
- EIA KPI evaluations.
- EIA evidence links.

No Enterprise Repository source tables are mutated. No customer, CRM, MLS, Typesense, email, queue, worker, scheduler, cron, fixture, or public-exposure writes are introduced.

## Safety Checks

Sprint 2 adds:

```text
npm run check:enterprise-adapter-framework-safety
```

The existing Repository Governance Adapter safety check remains:

```text
npm run check:repository-governance-adapter-safety
```

## Known Limitations

Platform Availability Adapter is deferred by this implementation.

`GAP-006` remains `OPEN_MATERIAL_REDUCED`; Sprint 2 expands adapter infrastructure but does not complete all live-source adapter coverage, official decision history, or actual live outcome observation requirements.

Sprint 3 is not authorized by this record.

## Rollback Procedure

Revert the Sprint 2 implementation commit and redeploy. No database rollback is required because Sprint 2 introduces no Prisma schema change and no migration.

Historical EIA observations created by previously authorized Sprint 1 invocations should be preserved.
