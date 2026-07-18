# EIF 1.0 Sprint 3 - Executive Workspace

Date: 2026-07-18
Status: `IMPLEMENTED`
Scope: internal-only executive presentation and review workspace

## Architecture

Sprint 3 preserves the governed EIF layering:

`Measurement Foundation -> Intelligence Core -> Executive Workspace`

The Executive Workspace composes existing KPI registry, evaluation, health, trend, transition, risk, opportunity, confidence, freshness, provenance, and intelligence-event services. It does not own KPI formulas, thresholds, domain weights, health scoring, trend detection, risk rules, opportunity rules, confidence calculation, freshness calculation, or evidence generation.

## Command Center Composition

The Executive Command Center is implemented at `/admin/repository/executive-command-center`.

It presents enterprise status first, followed by material changes, risks, opportunities, attention items, domain health, data integrity, evidence drill-down, and known limitations. The page is server-rendered behind the existing Repository Studio admin middleware and does not fetch unauthenticated client-side payloads.

The read-only API is:

- `GET /api/admin/enterprise/executive-command-center`

The API uses the existing Repository admin authorization helper and returns `401` without authorization.

## Daily Executive Brief Rules

The Daily Executive Brief is deterministic and template-based. It is exposed through:

- `GET /api/admin/enterprise/executive-brief`

Required sections are:

- Enterprise Status
- Material Changes
- Customer Signals
- Platform Signals
- Operations Signals
- Governance Signals
- Top Risk
- Top Opportunity
- Executive Attention Required
- Data Confidence and Limitations

The brief states fixture provenance, unknown states, stale or unavailable evidence, calculation version, generated timestamp, supporting event identifiers, and evidence references. It does not use generative AI, strategic investment recommendations, roadmap commands, or unsupported causation.

## Material-Change Ranking

Material changes are derived from governed threshold transitions, trend changes, unknown-domain availability gaps, and freshness conditions. Ranking is deterministic:

- Severity rank: `CRITICAL=5`, `HIGH=4`, `MEDIUM=3`, `LOW=2`.
- Confidence rank: `HIGH=4`, `MEDIUM=3`, `LOW=2`, `INSUFFICIENT=1`.
- Freshness risk rank: `STALE=4`, `UNKNOWN=3`, `AGING=2`, `FRESH=1`.
- Scope rank: evidence count capped at five references.
- Domain importance: Sprint 2 provisional domain weights multiplied by 10.
- Recency rank: timestamped fixture-window changes rank above missing timestamps.

No opaque score or AI ranking is used.

## Risk Ranking

Risk signals come from Sprint 2 deterministic risk detection. Sprint 3 ranks them for presentation by severity, confidence, evidence count, and stable identifier. Risk language preserves qualified phrasing such as "associated with" and "requires investigation."

Risk presentation includes condition, severity, affected domain, consequence, confidence, evidence count, suggested investigation area, provenance, and supporting evidence.

## Opportunity Ranking

Opportunity signals come from Sprint 2 deterministic opportunity detection. Sprint 3 ranks them by confidence, evidence count, and stable identifier. Opportunity language supports review only and does not approve investments, roadmap decisions, preview expansion, or public launch.

## Executive Attention Queue

The attention queue is non-persistent and presentation-only. Item sources include:

- Critical and warning risk signals.
- Negative threshold transitions.
- Stale required data.
- Unknown domains.
- Medium-or-better confidence opportunities for review.
- Recovery events for acknowledgment review.

Each item includes stable id, type, title, priority, domain, reason, supporting intelligence-event id when available, evidence references, confidence, freshness, provenance, suggested review action, and rank score.

No acknowledgment, assignment, note, or history is stored.

## Evidence Drill-Down

Every material executive element supports this traceability chain:

`Executive Summary -> Intelligence Event -> Detection Rule -> KPI Evaluation -> Observation -> Source and Provenance`

Missing evidence remains explicit rather than being converted to healthy or zero states.

## Data-Integrity Presentation

The visible Data Integrity Panel includes:

- Overall provenance.
- Fixture-backed output count.
- Live-data-backed output count.
- Defined-but-unavailable KPI count.
- Unknown KPI count.
- Stale KPI count.
- Unknown domain count.
- Overall coverage.
- Confidence limitations.
- Freshness limitations.
- Persistence limitations.
- Current `GAP-006` status.

The panel is visible on the Command Center page and is not hidden behind technical navigation.

## Fixture Semantics

Current output is explicitly `NON_PRODUCTION_FIXTURE`. The label is visible in the first viewport of the Command Center and propagates through APIs, brief metadata, evidence references, risks, opportunities, attention items, and data-integrity summaries.

Sprint 3 does not imply live enterprise status, live customer behavior, live operational risk, live business performance, or live preview activity.

## Access Controls

All new APIs use `authorizeRepositoryAdminRequest` and `repositoryAdminUnauthorizedResponse`.

The middleware matcher now includes `/api/admin/enterprise/:path*` in addition to Repository Studio routes. No customer-visible navigation or public API route is added.

## Empty and Unknown States

The workspace deliberately preserves:

- `UNKNOWN` overall health.
- Unknown domain health.
- No-risk and no-opportunity states.
- No material-change states.
- Insufficient trend data.
- Stale evidence.
- Defined-but-unavailable sources.
- Fixture-only intelligence.
- Unauthorized access.
- Safe service-error responses.

Zeros are used only for known counts, not as substitutes for unknown health.

## Known Limitations

- No production database writes.
- No schema migration.
- No live-source adapters.
- No workers, schedulers, queue processing, CRM mutation, email activation, MLS mutation, or Typesense mutation.
- No persistent acknowledgment, assignment, notes, or brief history.
- Fixture-backed intelligence validates presentation and governance contracts only.

## Future Persistence Requirements

Future acknowledgment, assignment, note, and brief-history capabilities require separately approved schema design, migration review, authorization review, audit behavior, and production-write authorization.

## Future Live-Source Requirements

Live-source activation requires governed adapters, source freshness contracts, read isolation, data-quality controls, privacy review, operational monitors, and explicit authorization. Sprint 3 does not activate live telemetry or collection.

## GAP-006 Assessment

`GAP-006` remains `OPEN_MATERIAL_REDUCED`.

Evidence supporting reduction:

- Sprint 1 Measurement Foundation exists.
- Sprint 2 Intelligence Core exists.
- Sprint 3 Executive Workspace now presents health, trends, transitions, risks, opportunities, attention, evidence, and data integrity.

Evidence preventing closure:

- Live-source adapters are absent.
- Production persistence is absent by design.
- Executive review state is non-persistent.
- Fixture-backed output cannot certify live KPI engine operation.

## Rollback

Rollback is code-only:

1. Revert the Sprint 3 commit.
2. Redeploy through the established Git/Vercel path.
3. Confirm `/api/admin/enterprise/executive-command-center`, `/api/admin/enterprise/executive-brief`, and `/admin/repository/executive-command-center` are removed or return to prior behavior.
4. No database rollback is required because Sprint 3 adds no migration or production writes.
