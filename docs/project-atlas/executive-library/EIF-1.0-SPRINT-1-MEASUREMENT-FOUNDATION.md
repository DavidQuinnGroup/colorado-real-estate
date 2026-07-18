# EIF 1.0 Sprint 1 - Measurement Foundation

Date: 2026-07-18
Status: `IMPLEMENTED`
Scope: additive internal-only measurement foundation

## Architecture

EIF 1.0 Sprint 1 introduces a code-governed Enterprise KPI Registry, deterministic KPI evaluation, a fixture-labeled Enterprise Health demonstration, read-only internal APIs, and an internal Repository Studio registry interface.

The sprint intentionally does not add live collection, production telemetry streams, workers, schedulers, queue consumers, CRM automation, email behavior, public analytics, predictive intelligence, AI recommendations, or autonomous decisions.

## Domain Objects

The implementation preserves these semantic roles in `lib/enterprise-kpi`:

- `EnterpriseKPI`: canonical KPI definition with stable id, owner, formula, source, thresholds, lifecycle, and governance notes.
- `KPISource`: system definition and source availability.
- `KPIObservation`: value, timestamp, provenance, availability, and notes.
- `KPIThreshold`: target, warning, and critical boundaries.
- `KPIHealthContribution`: represented by each `KpiEvaluation` and its health inclusion/exclusion fields.
- `EnterpriseHealthSnapshot`: calculation version, included/excluded/unknown KPIs, domain results, overall result, provenance, timestamp, and limitations.

No Prisma model or migration was added in Sprint 1 because production mutation authority was not granted. The physical persistence path remains a future governed decision.

## KPI Definition Standard

Every KPI definition includes:

- Stable enterprise identifier.
- Name and description.
- Business purpose.
- Domain.
- Executive owner role.
- Formula or calculation method.
- Measurement unit.
- Aggregation type.
- Desired trend direction.
- Source-system definition.
- Update frequency.
- Freshness expectation.
- Target, warning, and critical thresholds.
- Weight or explicit non-weighted status.
- Effective version.
- Lifecycle state.
- Governance notes.

## Status Semantics

Permitted statuses are:

- `HEALTHY`
- `WARNING`
- `CRITICAL`
- `UNKNOWN`
- `NOT_APPLICABLE`

Missing, stale, or unavailable observations resolve to `UNKNOWN`. `NOT_APPLICABLE` is returned only when an observation carries an explicit governed not-applicable reason.

## Health Calculation

KPI evaluation applies thresholds deterministically:

- Higher-is-better: values at or above warning are healthy, values above critical and below warning are warning, values at or below critical are critical.
- Lower-is-better: values at or below warning are healthy, values below critical and above warning are warning, values at or above critical are critical.

Domain health is calculated only from included KPI evaluations. Unknown, stale, and not-applicable KPIs are listed as exclusions and are not hidden.

Overall health requires at least four included KPIs across at least three domains. If that minimum-data rule is not met, overall health is `UNKNOWN`.

## Source Provenance

Sprint 1 supports:

- `LIVE_INTERNAL`
- `NON_PRODUCTION_FIXTURE`
- `DEFINED_ONLY`

The initial Enterprise Health demonstration is `NON_PRODUCTION_FIXTURE`. It must not be presented as live enterprise health.

## Data Limitations

Initial fixture-backed KPIs:

- `KPI-PLAT-001`
- `KPI-PLAT-002`
- `KPI-OPS-001`
- `KPI-GOV-001`

All other Sprint 1 KPIs are `DEFINED_BUT_UNAVAILABLE` until trustworthy governed sources are connected. No observations are fabricated for unavailable KPIs.

## API Contracts

Internal admin-only read APIs:

- `GET /api/admin/enterprise/kpis`
- `GET /api/admin/enterprise/kpis/[id]`
- `GET /api/admin/enterprise/kpi-evaluations`
- `GET /api/admin/enterprise/health`

All routes return structured JSON, require Repository admin authorization, expose source availability and freshness fields, and provide no mutation methods.

## Access Controls

The APIs use `authorizeRepositoryAdminRequest` and `repositoryAdminUnauthorizedResponse`, matching the existing Repository Studio admin API pattern. When an admin key is configured, callers must provide `x-admin-key`, `Authorization: Bearer`, `adminKey`, or the admin cookie.

The internal interface is under Repository Studio:

- `/admin/repository/enterprise-kpis`
- `/admin/repository/enterprise-kpis/[id]`

## Adding Future KPIs Safely

1. Add the KPI to `ENTERPRISE_KPI_REGISTRY`.
2. Use a stable `KPI-<DOMAIN>-NNN` identifier.
3. Fill every required definition field.
4. Mark source availability as `DEFINED_BUT_UNAVAILABLE` unless a trustworthy governed source exists.
5. Add or update deterministic tests in `scripts/checkEnterpriseKpiSafety.ts`.
6. Do not add a live collector, scheduler, worker, or mutation path without separate authorization.
7. Update this document and any governed capability inventory affected by the KPI.

## Rollback Procedure

Rollback is code-only for Sprint 1:

1. Revert the Sprint 1 commit.
2. Redeploy through the established Git-triggered deployment path.
3. Confirm the Repository Studio and `/api/admin/enterprise/*` routes are absent or restored to the previous state.
4. No production data rollback is required because Sprint 1 adds no production writes, migrations, workers, or live collectors.

## Validation

Required validation includes:

- `npm run check:enterprise-kpi-safety`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npx prisma migrate status`
- `npm run build`
- `git diff --check`

Existing critical public behavior should remain unaffected because Sprint 1 is additive and internal-only.
