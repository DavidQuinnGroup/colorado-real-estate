# EIA 1.0 Wave 2 Sprint 1 Repository Governance Adapter

## Mission And Scope

Sprint 1 implements the Repository Governance Adapter as the first manually invoked live-source adapter for PROJECT ATLAS. It reads authoritative Enterprise Repository governance state, maps supported live values to existing EIF governance KPIs, and persists observations/evaluations through the EIA Wave 1 persistence layer.

The adapter is internal-only, read-only at source, manually invoked, deterministic, provenance-complete, idempotent, non-public, and human-governed.

## Explicit Exclusions

This sprint does not authorize scheduling, cron, workers, queues, backfills, repository repair, stewardship changes, relationship creation, governance exception closure, customer data writes, CRM writes, MLS writes, Typesense writes, email sends, official decisions, roadmap/task creation, Sprint 2, or closing `GAP-006`.

## Source-System Inventory

| Source | Role | Authority |
| --- | --- | --- |
| `repository_health_summary` | Governance, stewardship, and relationship completeness percentages | Canonical persisted Repository health summary |
| `repository_object_health` | Object-level governance/stewardship/relationship/traceability facts | Canonical persisted Repository health view/table |
| `repository_object` | Canonical object identifiers and `updated_at` source effective time | Canonical Repository object table |
| `repository_governance_exception_candidates` | Exception count evidence for unsupported metrics | Canonical persisted exception candidate source |

No display component or cached UI summary is treated as authoritative.

## Authoritative-Source Determination

The authoritative source hierarchy for Sprint 1 is:

1. Canonical persisted Repository records in Supabase.
2. Existing deterministic Repository services derived from those records.
3. Generated artifacts only as documentation evidence.
4. Fixtures only for tests.

The adapter reads Supabase-backed Repository records directly through existing Repository source access and does not mutate them.

## Adapter Contract

| Field | Value |
| --- | --- |
| Adapter ID | `REPOSITORY_GOVERNANCE` |
| Canonical name | Repository Governance Adapter |
| Version | `1.0.0` |
| Source system | Enterprise Repository |
| Reliability | `AUTHORITATIVE` |
| Owner | PROJECT ATLAS Executive Architecture |
| Steward | Enterprise Architecture Office |
| Invocation | Internal admin-only POST |
| Inspection | Internal admin-only GET |

The adapter separates source reading, normalization, validation, observation mapping, persistence, and inspection in `lib/repository/governanceAdapter.ts`.

## KPI Mapping Table

| KPI ID | Name | Source | Formula owner | Unit | Grain | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `KPI-GOV-001` | Repository Governance Coverage | `repository_health_summary.governance_completeness_pct` | Existing EIF KPI registry | Percent | One observation per invocation/source state | Supported |
| `KPI-GOV-002` | Stewardship Coverage | `repository_health_summary.stewardship_completeness_pct` | Existing EIF KPI registry | Percent | One observation per invocation/source state | Supported |
| `KPI-GOV-003` | Platform Traceability Coverage | `repository_object_health` PLAT traceability coverage | Existing EIF KPI registry | Percent | One observation per invocation/source state | Supported |

Requested metrics without canonical EIF KPI IDs remain unsupported/unavailable: governance exception count, governance recovery rate, missing steward count, relationship completeness percent, broken relationship count, platform traceability gap count, repository health score, and repository risk level.

## Formula Ownership

The adapter does not redefine KPI formulas, thresholds, domain weights, enterprise health weights, risk classifications, confidence rules, or opportunity rules. It uses existing EIF KPI definitions and `evaluateKpi`.

## Observation Grain

Default grain is one observation per supported KPI per adapter invocation/source-state fingerprint. Observation time is the best available Repository source effective time from `repository_object.updated_at`. Invocation and processing time are recorded separately in provenance.

## Freshness Policy

Invocation mode is manual. Expected refresh is on demand. Freshness uses 24 hours for fresh and 7 days for stale/expired visibility. Stale observations remain historical and visible.

## Confidence Policy

Source reliability is authoritative, but confidence is reduced when values are unavailable, source coverage is incomplete, or object-health counts disagree with repository-health totals.

## Failure Classifications

The adapter result supports `SUCCESS`, `PARTIAL`, `UNAVAILABLE`, `UNAUTHORIZED`, `STALE`, `INCOMPLETE`, `INVALID`, `SCHEMA_MISMATCH`, `SOURCE_CONFLICT`, and `PERSISTENCE_FAILURE`.

## Provenance Design

Every execute-mode write creates EIA provenance with source system, source query reference, source effective time, invocation time, processing time, environment, `LIVE` data origin, adapter calculation version, source-state fingerprint, creating service, application version, confidence, freshness, privacy, sensitivity, and retention.

## Source-State Fingerprint

The adapter computes a SHA-256 fingerprint from sorted repository health, object health, object version, governance-exception count, coverage summary, and PLAT traceability values. The fingerprint excludes nondeterministic generated timestamps and secrets.

## Idempotency Strategy

Observation and evaluation idempotency keys include environment, origin, KPI ID, observation window, source-state fingerprint, calculation version, and threshold version where applicable. Repeated invocation against unchanged source state deduplicates. Material source-state changes create new observations.

## Fixture/Live Separation

Live adapter observations use `LIVE`. Existing EIF demonstrations remain fixture-backed. The persistence boundary requires explicit origin and prohibits mixed fixture/live aggregation by default.

## Access-Control Review

The route is `/api/admin/enterprise/repository-governance-adapter` and reuses Repository admin authorization. Unauthenticated invocation and inspection return `401`. No public route is added.

## Privacy Review

The adapter source queries do not select customer fields, emails, names, notes, credentials, secrets, tokens, or customer identifiers. Persisted evidence uses source query references, canonical RIDs, counts, percentages, and source-state hashes.

## Retention Classification

Live observations are historical enterprise records. Provenance/evidence is retained as audit evidence. Archival is non-destructive. No retention worker or deletion job is added.

## Validation Record

New command:

```text
npm run check:repository-governance-adapter-safety
```

The check verifies contract identity, authoritative source reads, no Repository mutation, manual admin route, no public exposure, explicit live origin, provenance/idempotency/fingerprint, no scheduler/worker/queue activation, and no customer PII introduction.

## Deployment Record

Deployment is valid only after all safety/regression checks pass, the commit is pushed, and Vercel reports success for the commit.

## Known Limitations

Only three canonical governance KPIs are supported in Sprint 1. Other requested metrics are reported as unsupported until the EIF registry adds canonical KPI definitions and formulas. No automated ingestion or historical backfill is performed.

## Suspension And Rollback

Suspend by disabling/removing access to the admin route or reverting the adapter commit. Historical observations and provenance should be preserved. No Repository Studio, EIF fixture, EIA Wave 1 schema, or customer-facing behavior depends on automatic adapter execution.

## Sprint Completion Status

Sprint 1 completion requires validation, deployment, one controlled manual invocation where safe, post-deployment health checks, a clean synchronized repository, and executive review. Sprint 2 is not authorized by this record.
