# EIF 1.0 Sprint 4 - Decision Support

Date: 2026-07-18
Status: `IMPLEMENTED`
Scope: internal-only deterministic executive decision support

## Architecture

Sprint 4 preserves the governed EIF layering:

`Measurement Foundation -> Intelligence Core -> Executive Workspace -> Decision Support -> Human Leadership Decision`

Decision Support consumes governed intelligence and Executive Workspace output. It creates structured decision situations, fixture-backed decision packages, deterministic options, explainable scores, expected outcomes, recommendations, non-persistent dispositions, and semantic review schedules. It does not execute decisions, create tasks, modify roadmaps, persist decisions, or claim final authority.

## Decision Situation Standard

Each `DecisionSituation` includes stable id, title, executive question, situation summary, triggering intelligence events, relevant domains, KPIs, risks, opportunities, urgency, decision horizon, constraints, assumptions, evidence references, confidence, freshness, provenance, and known limitations.

Situations require governed evidence. Unsupported narrative-only situations are rejected by the service.

## Decision Package Standard

Each `EnterpriseDecisionPackage` includes:

- Decision Situation.
- Executive Question.
- Why the Decision Matters.
- Supporting Evidence.
- Constraints and assumptions.
- Options and option comparison.
- Recommended option or no-recommendation state.
- Risks and tradeoffs.
- Expected outcomes.
- Confidence and data freshness.
- Known limitations.
- Human decision requirement.
- Semantic review schedule.

Every package is labeled `HUMAN_DECISION_REQUIRED` and `NON_PRODUCTION_FIXTURE`.

## Option Model

Options support the governed types `INVEST`, `IMPROVE`, `MAINTAIN`, `OBSERVE`, `DEFER`, `PAUSE`, `RETIRE`, `INVESTIGATE`, and `VALIDATE_DATA`.

Each option includes action, benefit, customer impact, enterprise impact, engineering implications, operational implications, financial implications, risks, dependencies, reversibility, expected outcomes, evidence, assumptions, limitations, and an explainable score.

Financial values remain `UNKNOWN` where no trustworthy source exists.

## Criterion Model and Provisional Weights

Initial criteria are centralized in `lib/enterprise-kpi/decisionSupport.ts` and versioned as `EIF-1.0-decision-criteria-v1`.

| Criterion | Weight | Direction |
| --- | ---: | --- |
| Customer Value | 25% | Benefit |
| Strategic Alignment | 20% | Benefit |
| Enterprise Leverage | 15% | Benefit |
| Operational Impact | 10% | Benefit |
| Engineering Effort | 10% | Burden |
| Financial Value | 10% | Benefit |
| Risk | 10% | Burden |

Weights are provisional, configurable in code, validated to sum to 100%, and not duplicated in route handlers or components.

## Scoring Normalization

Higher final scores always mean a more favorable option.

Benefit criteria use the raw score directly as the normalized score. Burden criteria invert the raw score, so high engineering effort or high risk lowers desirability.

Unknown, insufficient-evidence, and not-applicable criteria are excluded from the score numerator and reduce coverage/confidence. They are not converted to zero or neutral scores.

Final scores are rounded to whole numbers to avoid false precision.

## Risk Adjustment

The `RISK` criterion is a burden criterion. Risk components remain separately inspectable by category:

- Technical risk.
- Operational risk.
- Customer risk where applicable.
- Governance risk where applicable.
- Financial uncertainty.
- Opportunity cost.

Sprint 4 does not collapse risk into an unexplained score.

## Recommendation Logic

The recommendation engine is deterministic and bounded. It may return:

- A preferred option.
- No recommendation because evidence is insufficient.
- Executive judgment required when scores are effectively tied.
- Data validation before decision.
- Deferral pending evidence.

Recommendations include reason, supporting criteria, material risks, material unknowns, confidence, alternative option, conditions that could change the recommendation, evidence, provenance, calculation version, and `HUMAN_DECISION_REQUIRED`.

No generative AI is used.

## Disposition and Override Semantics

Sprint 4 supports conceptual dispositions:

- `APPROVED`
- `REJECTED`
- `DEFERRED`
- `REVISED`
- `MORE_EVIDENCE_REQUIRED`
- `NO_DECISION`

Current dispositions are demonstration-only and non-persistent. They are not official enterprise decisions.

Override examples require rationale and include original recommendation, selected option placeholder, decision-authority role placeholder, risks accepted, expected outcomes, review date, evidence acknowledged, timestamp, provenance, and demonstration-only status. No fake named executives or approval records are created.

## Expected Outcome Model

Expected outcomes include id, description, KPI link when available, baseline, target, horizon, measurement method, source, confidence, limitations, and provenance.

When baseline or target data is absent, values are `UNAVAILABLE`. Sprint 4 does not fabricate improvement percentages.

## Review Schedule Model

Review schedules are semantic only. They include review date, trigger, relevant outcome ids, required evidence, responsible leadership role, and `SEMANTIC_ONLY_NOT_SCHEDULED` status.

Sprint 4 does not create calendar events, tasks, schedulers, reminders, or persisted review records.

## Evidence Traceability

Required traceability is preserved:

`Decision Package -> Decision Situation -> Intelligence Event -> Detection Rule -> KPI Evaluation -> Observation -> Source and Provenance`

Criterion scores also include supporting evidence references.

## Confidence Methodology

Decision confidence considers source intelligence confidence, evidence coverage, freshness, source reliability, criterion coverage, fixture provenance, assumptions, and unknown values.

Sprint 4 distinguishes confidence in calculation behavior from confidence in real-world applicability. Fixture-backed packages may demonstrate calculation correctness, but they do not claim high confidence about live enterprise conditions.

## Fixture Semantics

All current packages are `NON_PRODUCTION_FIXTURE`. Live-data-backed outputs are zero. Fixture packages validate interface, scoring, and governance contracts only.

## Access Controls

Internal read-only APIs:

- `GET /api/admin/enterprise/decision-situations`
- `GET /api/admin/enterprise/decision-packages`
- `GET /api/admin/enterprise/decision-packages/[id]`
- `GET /api/admin/enterprise/decision-packages/[id]/comparison`
- `GET /api/admin/enterprise/decision-packages/[id]/recommendation`
- `GET /api/admin/enterprise/decision-packages/[id]/expected-outcomes`

Routes use existing Repository admin authorization and return `401` without authorization. No public decision API or customer-facing decision interface is added.

## Known Limitations

- No production database writes.
- No schema migration.
- No persistent decisions, dispositions, overrides, notes, comments, or review history.
- No live-source adapters.
- No task, issue, roadmap, initiative, queue, CRM, email, MLS, Typesense, or worker action.
- Financial values are unknown where no governed source exists.
- Fixture-backed recommendations are not official leadership decisions.

## Future Persistence Requirements

Official decision recording requires separately approved schema, audit model, authorization model, lifecycle states, review schedules, override storage, retention rules, and production-write authorization.

## Future Official Approval Workflow

A future approval workflow should include decision authority, rationale, evidence acknowledgement, disposition state, override behavior, review schedule, expected-outcome tracking, audit events, and rollback/appeal semantics. Sprint 4 does not implement this workflow.

## Sprint 5 Dependencies

Sprint 5 can depend on the Expected Outcome model but still requires separate authorization before adding live tracking, persistence, reminders, outcome measurement, or official decision records.

## GAP-006 Assessment

`GAP-006` remains `OPEN_MATERIAL_REDUCED`.

Evidence supporting reduction:

- Sprint 1 Measurement Foundation exists.
- Sprint 2 Intelligence Core exists.
- Sprint 3 Executive Workspace exists.
- Sprint 4 Decision Support now demonstrates explainable decision packages and deterministic recommendations.

Evidence preventing closure:

- Live-source adapters are absent.
- Production persistence is absent by design.
- Official decisions and outcome tracking are non-persistent.
- Fixture-backed decision packages cannot certify live KPI engine operation.

## Rollback

Rollback is code-only:

1. Revert the Sprint 4 commit.
2. Redeploy through the established Git/Vercel path.
3. Confirm `/admin/repository/decision-support` and `/api/admin/enterprise/decision-*` routes are removed or return to prior behavior.
4. No database rollback is required because Sprint 4 adds no migration or production writes.
