# EIA 1.0 Wave 1 Persistence Foundation

## Status

Wave 1 implements an additive persistence foundation for PROJECT ATLAS Enterprise Intelligence Activation. It does not activate live intelligence collection, scheduled processing, worker execution, queue release, customer-facing behavior, official decision workflow, production seeds, or backfills.

`GAP-006` remains `OPEN_MATERIAL_REDUCED`.

## Architecture Implementation Record

The implementation adds EIA-owned Prisma models and enums under the `EIA*` namespace. Existing EIF Sprint 1-5 deterministic fixture logic remains unchanged and non-persistent unless a future governed activation explicitly calls the persistence repository.

The persistence boundary is `lib/enterprise-kpi/persistence.ts`. It provides classification guards, idempotency-key generation, and opt-in repository methods. Existing admin EIF routes continue to read deterministic fixture-backed services.

## Persistent Object Inventory

| Domain | Models |
| --- | --- |
| Shared provenance and evidence | `EIAProvenance`, `EIAEvidenceReference`, `EIAEvidenceLink` |
| Measurement | `EIAKpiObservation`, `EIAKpiEvaluation`, `EIAKpiThresholdEvaluation`, `EIAKpiTransition` |
| Enterprise health | `EIAEnterpriseHealthSnapshot`, `EIADomainHealthSnapshot`, `EIAHealthContribution` |
| Enterprise intelligence | `EIAIntelligenceEvent`, `EIAIntelligenceSignal`, `EIAExecutiveInsight` |
| Decision support | `EIADecisionSituation`, `EIADecisionPackage`, `EIADecisionOption`, `EIADecisionCriterion`, `EIADecisionScore`, `EIADecisionRecommendation`, `EIADecisionReviewSchedule`, `EIADecisionDisposition`, `EIADecisionOverride` |
| Initiative lifecycle | `EIAEnterpriseInitiative`, `EIAInitiativeStatusHistory`, `EIAInitiativeBaseline`, `EIAExpectedOutcome`, `EIAOutcomeObservation`, `EIAOutcomeVariance`, `EIAInitiativeReview` |
| Learning | `EIADecisionEvaluation`, `EIARecommendationEvaluation`, `EIALessonLearned`, `EIAImprovementAction`, `EIAImprovementActionStatusHistory`, `EIAContinuousImprovementBacklogItem` |

## Model Ownership Matrix

| Model group | Canonical owner | Operational steward | Creating system | Writers | Readers | Mutable classification | Retention | Privacy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `EIAProvenance`, `EIAEvidence*` | PROJECT ATLAS Executive Architecture | Enterprise Architecture Office | Governed EIA persistence services | Governed services only | Internal, Executive, System | `APPEND_ONLY` | `AUDIT` | `SYSTEM` |
| `EIAKpi*`, `EIA*Health*` | PROJECT ATLAS Measurement Foundation | REIE Platform Operations | Governed measurement persistence services | Governed services only | Internal, Executive, System | `APPEND_ONLY` / `IMMUTABLE_VERSIONED` | `HISTORICAL` | `INTERNAL` |
| `EIAIntelligence*`, `EIAExecutiveInsight` | PROJECT ATLAS Enterprise Intelligence | Executive Architecture Office | Governed intelligence persistence services | Governed services only | Executive, System | `APPEND_ONLY` | `HISTORICAL` | `EXECUTIVE` |
| `EIADecision*` | PROJECT ATLAS Decision Support | Executive Architecture Office | Governed decision-support persistence services | Governed services only | Executive, System | `APPEND_ONLY` / `REFERENCE_DATA` | `HISTORICAL` | `EXECUTIVE` |
| `EIAEnterpriseInitiative`, `EIAImprovementAction` | PROJECT ATLAS Learning System | Enterprise Architecture Office | Governed learning persistence services | Governed services only | Executive, System | `MUTABLE_WITH_HISTORY` | `HISTORICAL` | `EXECUTIVE` |

## Immutability Classification Matrix

| Classification | Objects |
| --- | --- |
| `APPEND_ONLY` | Provenance, evidence, KPI observations/evaluations/transitions, intelligence events/signals, executive insights, decision packages/options/scores/recommendations, dispositions, overrides, baselines, outcomes, variances, reviews, evaluations, lessons |
| `IMMUTABLE_VERSIONED` | Enterprise and domain health snapshots |
| `MUTABLE_WITH_HISTORY` | Initiative operating state, improvement-action state, backlog administrative state |
| `REFERENCE_DATA` | Decision criteria |

Mutable workflow state must be represented with `EIAInitiativeStatusHistory` or `EIAImprovementActionStatusHistory`.

## Provenance And Lineage Specification

Every root EIA object stores or links to:

- Source system and source type.
- Source record or query reference where available.
- Observation, ingestion, and processing timestamps.
- Environment and data-origin classification.
- Fixture set and fixture scenario for fixture records.
- Schema, domain-model, calculation, canon, repository, and application-version fields where applicable.
- Confidence, freshness, privacy, sensitivity, PII, and retention classification.
- Supersession or correction references where corrections occur.

Lineage is reconstructable through strong foreign keys from KPI observations through evaluations, health snapshots, intelligence, decisions, initiatives, outcomes, reviews, evaluations, lessons, and improvement actions. `EIAEvidenceLink` is the only generic evidence attachment table; it trades strict per-object foreign keys for a single governed many-to-many evidence ledger and is validated by the safety script.

## Idempotency Strategy

Idempotency is enforced with unique keys on ingestion/calculation roots including:

- `EIAKpiObservation.idempotencyKey`
- `EIAKpiEvaluation.idempotencyKey`
- `EIAKpiThresholdEvaluation.idempotencyKey`
- `EIAKpiTransition.idempotencyKey`
- `EIADecisionScore.idempotencyKey`
- `EIADecisionRecommendation.idempotencyKey`

The persistence helper builds KPI observation keys from environment, origin, fixture scope, KPI identifier, observation period, observation timestamp, and calculation version. Repeated identical writes resolve deterministically through `upsert` with an empty update.

## Fixture/Live Separation Standard

Every persisted root object has explicit `environment` and `dataOrigin` fields. Fixture records require `fixtureSet` and `fixtureScenario`; non-fixture records reject fixture metadata. Mixed fixture/live aggregation is prohibited by the persistence boundary by default.

Existing EIF Sprint 1-5 fixtures remain deterministic, fixture-backed, and non-persistent unless future governed activation explicitly writes records.

## Access-Control Review

Wave 1 adds no public routes and no unauthenticated routes. Existing EIF APIs remain under `/api/admin/enterprise/:path*`, protected by repository admin middleware. No customer-facing dashboard or public intelligence endpoint is introduced.

## Privacy Review

The model supports `EIAPrivacy`, `EIASensitivity`, `EIAPii`, and `EIARetention` classifications. Wave 1 does not persist customer PII, raw search text, email addresses, names, or behavioral identifiers. Future writes should prefer references to canonical records and aggregated or pseudonymous evidence where identity is unnecessary.

## Migration Record

Migration: `prisma/migrations/20260718164000_eia_wave1_persistence_foundation/migration.sql`

The migration is additive:

- Creates EIA enums.
- Creates EIA tables.
- Creates EIA indexes and uniqueness constraints.
- Adds EIA-only foreign keys with `ON DELETE RESTRICT`.

It does not drop, rename, or alter existing tables or columns.

## Rollback Procedure

If rollback is required before any production records are written, run a reviewed SQL rollback that drops EIA foreign keys, EIA tables, and EIA enums in reverse dependency order. Do not use `prisma db push`. If any EIA records exist, export and archive them first, then obtain executive approval before dropping the persistence layer.

Application rollback is a normal Git revert of the Wave 1 commit after confirming no deployed code depends on the EIA models.

## Validation Record

Wave 1 adds:

```text
npm run check:enterprise-intelligence-persistence-safety
```

The safety check verifies required models, provenance classifications, fixture/live separation, idempotency constraints, indexes, additive SQL posture, authorization posture, absence of public exposure, and absence of live activation.

## Known Limitations

- No live source adapters exist.
- No historical backfill is performed.
- No production intelligence records are created by Wave 1.
- Generic evidence links require persistence-boundary validation.
- EIA 1.0 is not certified by this implementation alone.
- `GAP-006` remains open until live-source adapters, production persistence activation, official decision history, and actual live outcome observations are separately governed and reviewed.

## Wave 1 Completion Report

Wave 1 completion requires validation, governed migration application, deployment, post-deployment health checks, commit, push, and final repository alignment. Wave 2 is not authorized by this record.
