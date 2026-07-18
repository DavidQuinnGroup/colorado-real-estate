# EIF 1.0 Sprint 2 - Intelligence Core

Date: 2026-07-18
Status: `IMPLEMENTED`
Scope: additive internal-only deterministic enterprise intelligence

## Architecture

Sprint 2 preserves this governed flow:

`Enterprise KPI Registry -> KPI Observations -> KPI Evaluation Service -> Trend and Transition Analysis -> Enterprise Health Engine -> Risk and Opportunity Detection -> Enterprise Intelligence Events`

Route handlers and React pages call reusable services only. They do not own trend, transition, health scoring, risk, opportunity, confidence, freshness, or evidence logic.

## Health-Domain Calculation

Domain health uses eligible KPI evaluations only. `UNKNOWN` and `NOT_APPLICABLE` values are excluded from scoring but remain visible in `excludedKpis`, `unknownKpis`, `staleKpis`, and `notApplicableKpis`.

Calculation method:

1. Evaluate each KPI with Sprint 1 thresholds.
2. Convert statuses to normalized scores: `HEALTHY=100`, `WARNING=60`, `CRITICAL=0`.
3. Include only KPIs with non-null scores and positive KPI weights.
4. Require at least one eligible KPI and at least 25% domain evidence coverage before producing a domain score.
5. Calculate weighted score as `sum(score * weight) / sum(weight)`.
6. Return `UNKNOWN` when evidence is insufficient.

Tradeoff: this method is deterministic and transparent, but early domains with few live-backed KPIs remain unknown rather than inflated by missing data.

## Overall Enterprise Health

Overall health uses explicit provisional domain weights:

- `PLATFORM`: 0.22
- `CUSTOMER`: 0.16
- `OPERATIONS`: 0.20
- `BUSINESS`: 0.14
- `GROWTH`: 0.12
- `GOVERNANCE`: 0.16

At least three scored domains are required. Unknown domains remain visible. Fixture provenance propagates to the final result.

These weights are provisional and configurable; they are not permanently authoritative.

## Trend Methodology

KPI trends use ordered observations and respect each KPI's desired trend direction. The engine distinguishes raw movement from business improvement:

- `IMPROVING`
- `DECLINING`
- `STABLE`
- `VOLATILE`
- `INSUFFICIENT_DATA`
- `UNKNOWN`

The output exposes window start/end, observation count, starting value, ending value, absolute change, percentage change when safe, freshness, confidence, provenance, and evidence references. Percentage change is omitted when the baseline is zero or invalid.

No trend result claims statistical significance.

## Transition Logic

Transitions compare adjacent evaluated observations and emit deterministic threshold-change records such as `WARNING -> HEALTHY`, `WARNING -> CRITICAL`, `UNKNOWN -> HEALTHY`, and freshness transitions where represented by evaluation context.

Each transition includes KPI id, previous/current status, previous/current value, timestamp, thresholds, calculation version, provenance, and evidence. Duplicate transition ids are suppressed in the same evaluation context.

## Risk Rules

Sprint 2 risk rules detect:

- KPI enters `CRITICAL`.
- KPI declines across the governed trend window.
- Domain health falls below a governed threshold.
- Required data becomes stale.
- Overall evidence coverage falls below minimum.

Risk language avoids unsupported causation and uses investigative phrasing. Signals identify affected domains, severity, confidence, evidence, potential consequence, and suggested investigation area.

## Opportunity Rules

Sprint 2 opportunity rules detect:

- KPI improves consistently.
- A formerly warning KPI returns to healthy.
- Governance coverage maintains target.

Opportunity signals are not investment recommendations. They identify supporting evidence, confidence, relevant domain, potential enterprise value, and suggested human review area.

## Intelligence Events

Events contain stable ids, class, title, summary, severity, domain, KPI ids, evidence, confidence, freshness, provenance, rule id, calculation version, detection timestamp, and attention level. Events contain no executable action.

Initial classes include threshold crossings, trend changes, enterprise risks, enterprise opportunities, and governance signals where rules produce evidence.

## Evidence Lineage

Every trend, transition, risk, opportunity, and event includes `EvidenceReference` entries with evidence type, KPI id, source system, timestamp, provenance, calculation version, and safe internal route where available.

No event should be generated without evidence references.

## Confidence Methodology

Confidence considers observation count, provenance, freshness, evidence coverage, and rule certainty.

Fixture-backed results may reach medium confidence in calculation behavior, but not high confidence in real enterprise conditions. Live confidence requires governed live sources and is outside Sprint 2.

## Freshness Methodology

Freshness derives from each KPI's freshness expectation, observation timestamp, evaluation timestamp, and source availability:

- `FRESH`
- `AGING`
- `STALE`
- `UNKNOWN`

Freshness is centralized in `assessFreshness` and is not duplicated in route handlers.

## Fixture Semantics

The demonstration dataset is explicitly `NON_PRODUCTION_FIXTURE`. It shows improving, declining, stable, insufficient-data, threshold-transition, stale-data risk, risk signal, opportunity signal, calculable domain health, unknown domain health, and an overall Enterprise Health result.

No fixture output is live operational intelligence.

## API Contracts

Internal read-only APIs:

- `GET /api/admin/enterprise/health`
- `GET /api/admin/enterprise/health/domains`
- `GET /api/admin/enterprise/kpi-trends`
- `GET /api/admin/enterprise/kpi-transitions`
- `GET /api/admin/enterprise/intelligence-events`
- `GET /api/admin/enterprise/risks`
- `GET /api/admin/enterprise/opportunities`

Collections support bounded pagination and filtering where applicable. No mutation methods are exposed.

## Access Controls

Routes use the existing Repository admin authorization helper. Unauthenticated production requests must return `401`.

## Known Limitations

- No production writes, schema migration, persistence layer, or live collection adapter.
- No predictive analytics, AI conclusions, Executive Command Center, Daily Executive Brief, decision packages, or public intelligence.
- Fixture results remain suitable for engineering/governance validation only.

## Adding Rules Safely

1. Add deterministic rule logic in `lib/enterprise-kpi/intelligence.ts`.
2. Require evidence references for every emitted signal or event.
3. Add safety coverage in `scripts/checkEnterpriseIntelligenceSafety.ts`.
4. Document rule semantics and limits.
5. Do not add live adapters, persistence, workers, or schedulers without separate authorization.

## Rollback

Rollback is code-only:

1. Revert the Sprint 2 commit.
2. Redeploy through the established Git/Vercel path.
3. Confirm `/api/admin/enterprise/*` Sprint 2 routes and `/admin/repository/intelligence-core` return to the prior state.
4. No database rollback is required because Sprint 2 adds no migration or production writes.
