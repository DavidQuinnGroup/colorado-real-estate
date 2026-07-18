import { FIXTURE_OBSERVATION_TIMESTAMP } from "./health.js";
import {
  DECISION_CRITERIA,
  DECISION_SUPPORT_CALCULATION_VERSION,
  DECISION_SUPPORT_PROVENANCE,
  HUMAN_DECISION_REQUIRED,
  buildDecisionSupportSnapshot,
  getDecisionPackage,
  type DecisionCriterion,
  type DecisionDispositionStatus,
  type DecisionOption,
  type EnterpriseDecisionPackage,
  type ExpectedOutcome,
} from "./decisionSupport.js";
import type {
  ConfidenceAssessment,
  EvidenceReference,
  KpiDomain,
} from "./types.js";

export const LEARNING_SYSTEM_CALCULATION_VERSION = "EIF-1.0-learning-system-v1";
export const LEARNING_SYSTEM_ROUTE = "/admin/repository/learning-system";
export const HUMAN_REVIEW_REQUIRED = "HUMAN_REVIEW_REQUIRED";
export const LEARNING_SYSTEM_PROVENANCE = "NON_PRODUCTION_FIXTURE";
export const BASELINE_UNAVAILABLE = "BASELINE_UNAVAILABLE";

export type InitiativeLifecycleState =
  | "PROPOSED"
  | "APPROVED"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAUSED"
  | "CANCELLED"
  | "UNDER_REVIEW";

export type LearningObservationProvenance =
  | "LIVE"
  | "NON_PRODUCTION_FIXTURE"
  | "MANUAL_GOVERNED_INPUT"
  | "UNKNOWN";

export type VarianceState =
  | "EXCEEDED"
  | "MET"
  | "PARTIALLY_MET"
  | "MISSED"
  | "INCONCLUSIVE"
  | "NOT_MEASURABLE"
  | "UNKNOWN";

export type Materiality = "HIGH" | "MEDIUM" | "LOW" | "NONE" | "UNKNOWN";
export type VarianceDirection = "FAVORABLE" | "UNFAVORABLE" | "NEUTRAL" | "UNKNOWN";
export type LearningConfidenceLevel = ConfidenceAssessment["level"];
export type DecisionEvaluationResult =
  | "STRONG_PROCESS"
  | "ADEQUATE_PROCESS"
  | "WEAK_PROCESS"
  | "INSUFFICIENT_EVIDENCE"
  | "NOT_EVALUATED";
export type RecommendationCalibration =
  | "WELL_CALIBRATED"
  | "DIRECTIONALLY_CORRECT"
  | "OVERCONFIDENT"
  | "UNDERCONFIDENT"
  | "MISALIGNED"
  | "INCONCLUSIVE";
export type LessonType =
  | "CUSTOMER"
  | "PLATFORM"
  | "OPERATIONS"
  | "BUSINESS"
  | "GROWTH"
  | "GOVERNANCE"
  | "DECISION_PROCESS"
  | "DATA_QUALITY"
  | "EXECUTION"
  | "RISK";
export type ImprovementActionState =
  | "PROPOSED"
  | "NEEDS_REVIEW"
  | "ACCEPTED_CONCEPTUALLY"
  | "DEFERRED"
  | "REJECTED";

export type LearningLimitation = {
  limitationId: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
};

export type LearningEvidenceReference = {
  evidenceId: string;
  evidenceType:
    | "LEARNING_FIXTURE"
    | "DECISION_PACKAGE"
    | "DECISION_OPTION"
    | "EXPECTED_OUTCOME"
    | "OUTCOME_OBSERVATION"
    | "OUTCOME_VARIANCE"
    | "INITIATIVE_REVIEW"
    | "LESSON"
    | "KPI_EVIDENCE";
  sourceSystem: string;
  timestamp: string;
  provenance: LearningObservationProvenance;
  calculationVersion: string;
  kpiId?: string;
  decisionPackageId?: string;
  decisionOptionId?: string;
  initiativeId?: string;
  expectedOutcomeId?: string;
  observationId?: string;
  varianceId?: string;
  reviewId?: string;
  lessonId?: string;
  sourceEvidenceId?: string;
  internalRoute?: string;
};

export type InitiativeBaseline = {
  baselineId: string;
  initiativeId: string;
  relevantKpiId: string | null;
  value: number | typeof BASELINE_UNAVAILABLE;
  measurementTimestamp: string | null;
  measurementWindow: string;
  source: string;
  provenance: LearningObservationProvenance;
  confidence: LearningConfidenceLevel;
  freshness: "FRESH" | "AGING" | "STALE" | "UNKNOWN" | "NOT_APPLICABLE";
  knownLimitations: LearningLimitation[];
};

export type LearningExpectedOutcome = ExpectedOutcome & {
  desiredDirection: "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "NEUTRAL";
  baselineRef: InitiativeBaseline;
  assumptions: string[];
};

export type OutcomeObservation = {
  observationId: string;
  initiativeId: string;
  expectedOutcomeId: string;
  kpiId: string | null;
  actualValue: number | "UNAVAILABLE";
  observationTimestamp: string | null;
  evaluationWindow: string;
  source: string;
  freshness: "FRESH" | "AGING" | "STALE" | "UNKNOWN" | "NOT_APPLICABLE";
  confidence: LearningConfidenceLevel;
  provenance: LearningObservationProvenance;
  evidence: LearningEvidenceReference[];
  limitations: LearningLimitation[];
};

export type OutcomeVariance = {
  varianceId: string;
  initiativeId: string;
  expectedOutcomeId: string;
  expectedValue: number | "UNAVAILABLE";
  desiredDirection: LearningExpectedOutcome["desiredDirection"];
  actualValue: number | "UNAVAILABLE";
  absoluteVariance: number | null;
  percentageVariance: number | null;
  interpretation: VarianceDirection;
  state: VarianceState;
  materiality: Materiality;
  confidence: LearningConfidenceLevel;
  freshness: OutcomeObservation["freshness"];
  evidenceCoverage: number;
  calculationVersion: string;
  provenance: LearningObservationProvenance;
  limitations: LearningLimitation[];
};

export type EnterpriseInitiative = {
  initiativeId: string;
  title: string;
  description: string;
  originatingDecisionPackageId: string;
  selectedDecisionOptionId: string;
  decisionDisposition: DecisionDispositionStatus;
  decisionAuthorityRole: "EXECUTIVE_ROLE_PLACEHOLDER";
  strategicDomain: KpiDomain;
  initiativeOwnerRole: string;
  startDate: string;
  plannedReviewDate: string;
  lifecycleState: InitiativeLifecycleState;
  expectedOutcomes: LearningExpectedOutcome[];
  baselines: InitiativeBaseline[];
  dependencies: string[];
  risks: string[];
  assumptions: string[];
  evidence: LearningEvidenceReference[];
  confidence: LearningConfidenceLevel;
  freshness: "FRESH" | "AGING" | "STALE" | "UNKNOWN";
  provenance: LearningObservationProvenance;
  knownLimitations: LearningLimitation[];
  fixture: true;
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
};

export type DecisionEvaluation = {
  evaluationId: string;
  initiativeId: string;
  decisionPackageId: string;
  result: DecisionEvaluationResult;
  evidenceAvailableAtDecisionTime: LearningEvidenceReference[];
  evidenceCoverage: number;
  decisionConfidence: LearningConfidenceLevel;
  alternativesConsidered: string[];
  risksAcknowledged: string[];
  assumptionsRecorded: string[];
  selectedOptionFollowedRecommendation: boolean;
  overrideRationaleAdequate: boolean | "NOT_APPLICABLE";
  reviewTimingAppropriate: boolean;
  decisionProcessCompliant: boolean;
  outcomeQuality: VarianceState;
  hindsightLimitations: string[];
  explanation: string;
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
  provenance: LearningObservationProvenance;
};

export type RecommendationEvaluation = {
  evaluationId: string;
  initiativeId: string;
  decisionPackageId: string;
  originalRecommendedOptionId: string | null;
  originalConfidence: LearningConfidenceLevel;
  originalEvidenceCoverage: number;
  actualSelectedOptionId: string;
  outcomeAchieved: VarianceState;
  materialRisksCorrectlySurfaced: boolean | "INCONCLUSIVE";
  materialUnknownsCorrectlySurfaced: boolean | "INCONCLUSIVE";
  scoringModelFavoredEventualResult: boolean | "INCONCLUSIVE";
  differentCriterionWeightingMayHaveChangedRecommendation: boolean | "INCONCLUSIVE";
  calibrationFinding: RecommendationCalibration;
  proposedWeightAdjustment: "HUMAN_REVIEW_RECOMMENDATION_ONLY" | "NONE";
  limitations: string[];
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
  provenance: LearningObservationProvenance;
};

export type InitiativeReview = {
  reviewId: string;
  initiativeSummary: string;
  originalDecision: string;
  originalRecommendation: string;
  expectedOutcomes: LearningExpectedOutcome[];
  actualOutcomes: OutcomeObservation[];
  outcomeVariances: OutcomeVariance[];
  whatWorked: string[];
  whatDidNotWork: string[];
  unexpectedResults: string[];
  risksRealized: string[];
  risksAvoided: string[];
  assumptionsValidated: string[];
  assumptionsInvalidated: string[];
  decisionQuality: DecisionEvaluation;
  recommendationQuality: RecommendationEvaluation;
  lessonsLearned: string[];
  proposedImprovementActions: string[];
  remainingUnknowns: string[];
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
  labels: [typeof HUMAN_REVIEW_REQUIRED, typeof LEARNING_SYSTEM_PROVENANCE];
  provenance: LearningObservationProvenance;
};

export type LessonLearned = {
  lessonId: string;
  title: string;
  summary: string;
  sourceInitiativeId: string;
  sourceReviewId: string;
  relevantDomains: KpiDomain[];
  relevantKpis: string[];
  relevantDecisionCriteria: string[];
  lessonType: LessonType;
  evidence: LearningEvidenceReference[];
  confidence: LearningConfidenceLevel;
  applicability: "BROAD" | "CONTEXT_SPECIFIC" | "REQUIRES_VALIDATION";
  limitations: LearningLimitation[];
  proposedGovernanceImpact: string;
  provenance: LearningObservationProvenance;
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
};

export type ImprovementAction = {
  actionId: string;
  title: string;
  description: string;
  sourceLessonId: string;
  sourceInitiativeId: string;
  relevantDomain: KpiDomain;
  proposedOwnerRole: string | "UNKNOWN";
  priority: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  expectedBenefit: string;
  evidence: LearningEvidenceReference[];
  confidence: LearningConfidenceLevel;
  dependencies: string[];
  risks: string[];
  suggestedReviewDate: string;
  currentState: ImprovementActionState;
  ranking: ContinuousImprovementBacklogItem["ranking"];
  provenance: LearningObservationProvenance;
  humanReviewRequired: typeof HUMAN_REVIEW_REQUIRED;
};

export type ContinuousImprovementBacklogItem = {
  actionId: string;
  rank: number;
  ranking: {
    customerImpact: number | "UNKNOWN";
    enterpriseLeverage: number | "UNKNOWN";
    riskReduction: number | "UNKNOWN";
    evidenceConfidence: number;
    urgency: number;
    estimatedEffort: number | "UNKNOWN";
    reversibility: number | "UNKNOWN";
    strategicAlignment: number;
    totalScore: number | null;
    criteriaVersion: string;
  };
};

export type LearningLifecycle = {
  initiative: EnterpriseInitiative;
  decisionPackage: EnterpriseDecisionPackage;
  selectedOption: DecisionOption;
  observations: OutcomeObservation[];
  variances: OutcomeVariance[];
  decisionEvaluation: DecisionEvaluation;
  recommendationEvaluation: RecommendationEvaluation;
  review: InitiativeReview;
  lessons: LessonLearned[];
  improvementActions: ImprovementAction[];
  traceability: LearningEvidenceReference[];
};

export type LearningSystemSnapshot = {
  metadata: {
    generatedAt: string;
    calculationVersion: string;
    sourceCalculationVersions: string[];
    route: string;
    access: "internal_admin";
    persistence: "READ_ONLY_NON_PERSISTENT";
    labels: [typeof HUMAN_REVIEW_REQUIRED, typeof LEARNING_SYSTEM_PROVENANCE];
  };
  materialityRules: string[];
  lifecycles: LearningLifecycle[];
  lessons: LessonLearned[];
  improvementActions: ImprovementAction[];
  continuousImprovementBacklog: ContinuousImprovementBacklogItem[];
  summary: {
    initiativeCount: number;
    initiativesUnderReview: number;
    outcomesExceeded: number;
    outcomesMet: number;
    outcomesPartiallyMet: number;
    outcomesMissed: number;
    inconclusiveReviews: number;
    recentLessons: number;
    proposedImprovementActions: number;
    decisionProcessConcerns: number;
    recommendationCalibrationConcerns: number;
    liveDataBackedOutputs: number;
    fixtureBackedOutputs: number;
    definedButUnavailableOutputs: number;
    gap006Status: "OPEN_MATERIAL_REDUCED";
  };
};

type LifecycleDraft = {
  initiativeId: string;
  packageId: string;
  selectedOptionId: string;
  title: string;
  description: string;
  domain: KpiDomain;
  ownerRole: string;
  state: InitiativeLifecycleState;
  disposition: DecisionDispositionStatus;
  actualValue: number | "UNAVAILABLE";
  baselineValue: number | typeof BASELINE_UNAVAILABLE;
  targetValue: number | "UNAVAILABLE";
  desiredDirection: LearningExpectedOutcome["desiredDirection"];
  decisionResult: DecisionEvaluationResult;
  calibration: RecommendationCalibration;
  lessonType: LessonType;
  lessonTitle: string;
  actionTitle: string;
  observationNote: string;
};

const MATERIALITY_RULES = [
  "Variance percentage is calculated only when expected value is numeric and non-zero.",
  "Missing baselines, targets, or observations produce NOT_MEASURABLE or INCONCLUSIVE states, not zero values.",
  "For higher-is-better KPIs, actual values at or above target are favorable; for lower-is-better KPIs, actual values at or below target are favorable.",
  "Materiality is HIGH at 20% or greater variance, MEDIUM at 10% or greater, LOW above zero, and NONE when the target is met exactly.",
  "Fixture-backed outcomes may demonstrate deterministic behavior but cannot certify real-world causation.",
];

const LIFECYCLE_DRAFTS: LifecycleDraft[] = [
  {
    initiativeId: "INIT-CUSTOMER-WORKFLOW-FIXTURE",
    packageId: "DP-CUSTOMER-OPPORTUNITY",
    selectedOptionId: "OPT-CUSTOMER-VALIDATE",
    title: "Fixture customer workflow validation",
    description: "Demonstrates a successful initiative lifecycle from customer opportunity package to review.",
    domain: "CUSTOMER",
    ownerRole: "Product Leadership",
    state: "COMPLETED",
    disposition: "APPROVED",
    actualValue: 82,
    baselineValue: 52,
    targetValue: 75,
    desiredDirection: "HIGHER_IS_BETTER",
    decisionResult: "ADEQUATE_PROCESS",
    calibration: "DIRECTIONALLY_CORRECT",
    lessonType: "CUSTOMER",
    lessonTitle: "Bounded participant validation improved review confidence",
    actionTitle: "Standardize fixture-to-live participant validation evidence",
    observationNote: "Fixture result exceeded the expected confidence target.",
  },
  {
    initiativeId: "INIT-PLATFORM-RISK-FIXTURE",
    packageId: "DP-PLATFORM-RISK",
    selectedOptionId: "OPT-PLATFORM-INVESTIGATE",
    title: "Fixture platform risk review",
    description: "Demonstrates mixed outcomes after an evidence-backed platform investigation decision.",
    domain: "PLATFORM",
    ownerRole: "Engineering Leadership",
    state: "UNDER_REVIEW",
    disposition: "APPROVED",
    actualValue: 68,
    baselineValue: 50,
    targetValue: 80,
    desiredDirection: "HIGHER_IS_BETTER",
    decisionResult: "STRONG_PROCESS",
    calibration: "WELL_CALIBRATED",
    lessonType: "PLATFORM",
    lessonTitle: "Early risk review reduced uncertainty but did not meet every target",
    actionTitle: "Add future live-source readiness gates before expansion decisions",
    observationNote: "Fixture result partially met the intended improvement target.",
  },
  {
    initiativeId: "INIT-DATA-INTEGRITY-FIXTURE",
    packageId: "DP-DATA-INTEGRITY",
    selectedOptionId: "OPT-DATA-DEFER-DECISIONS",
    title: "Fixture data integrity measurement plan",
    description: "Demonstrates an inconclusive learning review when baseline and outcome data are unavailable.",
    domain: "OPERATIONS",
    ownerRole: "Operations Leadership",
    state: "UNDER_REVIEW",
    disposition: "MORE_EVIDENCE_REQUIRED",
    actualValue: "UNAVAILABLE",
    baselineValue: BASELINE_UNAVAILABLE,
    targetValue: "UNAVAILABLE",
    desiredDirection: "NEUTRAL",
    decisionResult: "INSUFFICIENT_EVIDENCE",
    calibration: "INCONCLUSIVE",
    lessonType: "DATA_QUALITY",
    lessonTitle: "Outcome learning requires governed measurement coverage",
    actionTitle: "Define authorized baseline capture before future reviews",
    observationNote: "Fixture intentionally leaves actual outcome unavailable.",
  },
  {
    initiativeId: "INIT-GOVERNANCE-RECOVERY-FIXTURE",
    packageId: "DP-GOVERNANCE-RECOVERY",
    selectedOptionId: "OPT-GOV-MAINTAIN",
    title: "Fixture governance recovery review",
    description: "Demonstrates a poor outcome with a strong decision process and explicit hindsight limitations.",
    domain: "GOVERNANCE",
    ownerRole: "Governance Leadership",
    state: "UNDER_REVIEW",
    disposition: "APPROVED",
    actualValue: 42,
    baselineValue: 55,
    targetValue: 70,
    desiredDirection: "HIGHER_IS_BETTER",
    decisionResult: "STRONG_PROCESS",
    calibration: "OVERCONFIDENT",
    lessonType: "RISK",
    lessonTitle: "Strong process can still coincide with adverse fixture outcomes",
    actionTitle: "Require explicit adverse-scenario review for governance recovery packages",
    observationNote: "Fixture result missed the target despite a strong decision process.",
  },
];

export function buildLearningSystemSnapshot(): LearningSystemSnapshot {
  const decisionSupport = buildDecisionSupportSnapshot();
  const lifecycles = LIFECYCLE_DRAFTS.map((draft) => buildLifecycle(draft));
  const lessons = uniqueBy(lifecycles.flatMap((item) => item.lessons), (item) => item.lessonId);
  const improvementActions = uniqueBy(lifecycles.flatMap((item) => item.improvementActions), (item) => item.actionId);
  const continuousImprovementBacklog = rankBacklog(improvementActions);

  return {
    metadata: {
      generatedAt: FIXTURE_OBSERVATION_TIMESTAMP,
      calculationVersion: LEARNING_SYSTEM_CALCULATION_VERSION,
      sourceCalculationVersions: [
        DECISION_SUPPORT_CALCULATION_VERSION,
        decisionSupport.metadata.calculationVersion,
      ],
      route: LEARNING_SYSTEM_ROUTE,
      access: "internal_admin",
      persistence: "READ_ONLY_NON_PERSISTENT",
      labels: [HUMAN_REVIEW_REQUIRED, LEARNING_SYSTEM_PROVENANCE],
    },
    materialityRules: MATERIALITY_RULES,
    lifecycles,
    lessons,
    improvementActions,
    continuousImprovementBacklog,
    summary: {
      initiativeCount: lifecycles.length,
      initiativesUnderReview: lifecycles.filter((item) => item.initiative.lifecycleState === "UNDER_REVIEW").length,
      outcomesExceeded: lifecycles.flatMap((item) => item.variances).filter((item) => item.state === "EXCEEDED").length,
      outcomesMet: lifecycles.flatMap((item) => item.variances).filter((item) => item.state === "MET").length,
      outcomesPartiallyMet: lifecycles.flatMap((item) => item.variances).filter((item) => item.state === "PARTIALLY_MET").length,
      outcomesMissed: lifecycles.flatMap((item) => item.variances).filter((item) => item.state === "MISSED").length,
      inconclusiveReviews: lifecycles.filter((item) => item.variances.some((variance) => variance.state === "INCONCLUSIVE" || variance.state === "NOT_MEASURABLE")).length,
      recentLessons: lessons.length,
      proposedImprovementActions: improvementActions.filter((item) => item.currentState === "PROPOSED" || item.currentState === "NEEDS_REVIEW").length,
      decisionProcessConcerns: lifecycles.filter((item) => item.decisionEvaluation.result === "WEAK_PROCESS" || item.decisionEvaluation.result === "INSUFFICIENT_EVIDENCE").length,
      recommendationCalibrationConcerns: lifecycles.filter((item) => item.recommendationEvaluation.calibrationFinding === "OVERCONFIDENT" || item.recommendationEvaluation.calibrationFinding === "MISALIGNED").length,
      liveDataBackedOutputs: 0,
      fixtureBackedOutputs: lifecycles.length,
      definedButUnavailableOutputs: lifecycles.filter((item) => item.observations.some((observation) => observation.actualValue === "UNAVAILABLE")).length,
      gap006Status: "OPEN_MATERIAL_REDUCED",
    },
  };
}

export function getLearningInitiatives(options: { limit?: number; offset?: number; domain?: KpiDomain; state?: InitiativeLifecycleState } = {}) {
  const snapshot = buildLearningSystemSnapshot();
  const filtered = snapshot.lifecycles
    .map((item) => item.initiative)
    .filter((item) => (options.domain ? item.strategicDomain === options.domain : true))
    .filter((item) => (options.state ? item.lifecycleState === options.state : true));
  const { limit, offset } = pagination(options);
  return { count: filtered.length, limit, offset, initiatives: filtered.slice(offset, offset + limit) };
}

export function getLearningLifecycle(initiativeId: string) {
  return buildLearningSystemSnapshot().lifecycles.find((item) => item.initiative.initiativeId === initiativeId) ?? null;
}

export function getInitiativeOutcomes(initiativeId: string) {
  const lifecycle = getLearningLifecycle(initiativeId);
  return lifecycle ? { expectedOutcomes: lifecycle.initiative.expectedOutcomes, observations: lifecycle.observations } : null;
}

export function getInitiativeVariances(initiativeId: string) {
  return getLearningLifecycle(initiativeId)?.variances ?? null;
}

export function getInitiativeReview(initiativeId: string) {
  return getLearningLifecycle(initiativeId)?.review ?? null;
}

export function getDecisionEvaluation(initiativeId: string) {
  return getLearningLifecycle(initiativeId)?.decisionEvaluation ?? null;
}

export function getRecommendationEvaluation(initiativeId: string) {
  return getLearningLifecycle(initiativeId)?.recommendationEvaluation ?? null;
}

export function getLessonsLearned(options: { limit?: number; offset?: number; domain?: KpiDomain; type?: LessonType } = {}) {
  const snapshot = buildLearningSystemSnapshot();
  const filtered = snapshot.lessons
    .filter((item) => (options.domain ? item.relevantDomains.includes(options.domain) : true))
    .filter((item) => (options.type ? item.lessonType === options.type : true));
  const { limit, offset } = pagination(options);
  return { count: filtered.length, limit, offset, lessons: filtered.slice(offset, offset + limit) };
}

export function getImprovementActions(options: { limit?: number; offset?: number; domain?: KpiDomain; state?: ImprovementActionState } = {}) {
  const snapshot = buildLearningSystemSnapshot();
  const filtered = snapshot.improvementActions
    .filter((item) => (options.domain ? item.relevantDomain === options.domain : true))
    .filter((item) => (options.state ? item.currentState === options.state : true));
  const { limit, offset } = pagination(options);
  return { count: filtered.length, limit, offset, actions: filtered.slice(offset, offset + limit) };
}

export function getContinuousImprovementBacklog(options: { limit?: number; offset?: number } = {}) {
  const snapshot = buildLearningSystemSnapshot();
  const { limit, offset } = pagination(options);
  return {
    count: snapshot.continuousImprovementBacklog.length,
    limit,
    offset,
    backlog: snapshot.continuousImprovementBacklog.slice(offset, offset + limit),
  };
}

export function calculateOutcomeVariance(input: {
  initiativeId: string;
  expectedOutcomeId: string;
  expectedValue: number | "UNAVAILABLE";
  actualValue: number | "UNAVAILABLE";
  desiredDirection: LearningExpectedOutcome["desiredDirection"];
  confidence: LearningConfidenceLevel;
  freshness: OutcomeObservation["freshness"];
  evidenceCoverage: number;
  provenance: LearningObservationProvenance;
}): OutcomeVariance {
  const limitations: LearningLimitation[] = [];
  let absoluteVariance: number | null = null;
  let percentageVariance: number | null = null;
  let interpretation: VarianceDirection = "UNKNOWN";
  let state: VarianceState = "UNKNOWN";
  let materiality: Materiality = "UNKNOWN";

  if (input.expectedValue === "UNAVAILABLE" || input.actualValue === "UNAVAILABLE") {
    state = "NOT_MEASURABLE";
    limitations.push(limitation(`${input.expectedOutcomeId}-MISSING`, "Expected or actual outcome value is unavailable.", "HIGH"));
  } else {
    absoluteVariance = Number((input.actualValue - input.expectedValue).toFixed(2));
    percentageVariance = input.expectedValue === 0 ? null : Number(((absoluteVariance / Math.abs(input.expectedValue)) * 100).toFixed(2));
    if (percentageVariance === null) {
      limitations.push(limitation(`${input.expectedOutcomeId}-PCT`, "Percentage variance is unavailable because the expected value is zero.", "MEDIUM"));
    }
    const favorable =
      input.desiredDirection === "LOWER_IS_BETTER"
        ? input.actualValue <= input.expectedValue
        : input.desiredDirection === "HIGHER_IS_BETTER"
          ? input.actualValue >= input.expectedValue
          : input.actualValue === input.expectedValue;
    interpretation = favorable ? (absoluteVariance === 0 ? "NEUTRAL" : "FAVORABLE") : "UNFAVORABLE";
    state = classifyVariance(input.actualValue, input.expectedValue, input.desiredDirection);
    materiality = classifyMateriality(percentageVariance, absoluteVariance);
  }

  return {
    varianceId: `VAR-${input.initiativeId}-${input.expectedOutcomeId}`,
    initiativeId: input.initiativeId,
    expectedOutcomeId: input.expectedOutcomeId,
    expectedValue: input.expectedValue,
    desiredDirection: input.desiredDirection,
    actualValue: input.actualValue,
    absoluteVariance,
    percentageVariance,
    interpretation,
    state,
    materiality,
    confidence: input.confidence,
    freshness: input.freshness,
    evidenceCoverage: input.evidenceCoverage,
    calculationVersion: LEARNING_SYSTEM_CALCULATION_VERSION,
    provenance: input.provenance,
    limitations,
  };
}

function buildLifecycle(draft: LifecycleDraft): LearningLifecycle {
  const decisionPackage = getDecisionPackage(draft.packageId);
  if (!decisionPackage) throw new Error(`Missing decision package ${draft.packageId}.`);
  const selectedOption = decisionPackage.options.find((item) => item.optionId === draft.selectedOptionId);
  if (!selectedOption) throw new Error(`Missing selected option ${draft.selectedOptionId}.`);

  const sourceOutcome = selectedOption.expectedOutcomes[0] ?? decisionPackage.expectedOutcomes[0];
  const baseline = buildBaseline(draft, sourceOutcome);
  const expectedOutcome = buildExpectedOutcome(draft, sourceOutcome, baseline);
  const traceability = buildTraceability(draft, decisionPackage, selectedOption, expectedOutcome);
  const observation = buildObservation(draft, expectedOutcome, traceability);
  const variance = calculateOutcomeVariance({
    initiativeId: draft.initiativeId,
    expectedOutcomeId: expectedOutcome.outcomeId,
    expectedValue: expectedOutcome.target,
    actualValue: observation.actualValue,
    desiredDirection: expectedOutcome.desiredDirection,
    confidence: observation.confidence,
    freshness: observation.freshness,
    evidenceCoverage: observation.evidence.length,
    provenance: observation.provenance,
  });

  const initiative: EnterpriseInitiative = {
    initiativeId: draft.initiativeId,
    title: draft.title,
    description: `${draft.description} This is a NON_PRODUCTION_FIXTURE demonstration and requires human review.`,
    originatingDecisionPackageId: decisionPackage.packageId,
    selectedDecisionOptionId: selectedOption.optionId,
    decisionDisposition: draft.disposition,
    decisionAuthorityRole: "EXECUTIVE_ROLE_PLACEHOLDER",
    strategicDomain: draft.domain,
    initiativeOwnerRole: draft.ownerRole,
    startDate: "2026-07-18",
    plannedReviewDate: "2026-08-17",
    lifecycleState: draft.state,
    expectedOutcomes: [expectedOutcome],
    baselines: [baseline],
    dependencies: selectedOption.dependencies,
    risks: selectedOption.risks.map((item) => item.description),
    assumptions: selectedOption.assumptions,
    evidence: traceability,
    confidence: confidenceFromVariance(variance),
    freshness: observation.freshness === "FRESH" ? "FRESH" : observation.freshness === "AGING" ? "AGING" : observation.freshness === "STALE" ? "STALE" : "UNKNOWN",
    provenance: "NON_PRODUCTION_FIXTURE",
    knownLimitations: [
      limitation(`${draft.initiativeId}-FIXTURE`, "Initiative is fixture-backed and not an official enterprise record.", "HIGH"),
      limitation(`${draft.initiativeId}-NO-PERSISTENCE`, "No initiative, review, lesson, or action is persisted.", "HIGH"),
    ],
    fixture: true,
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
  };

  const decisionEvaluation = buildDecisionEvaluation(draft, decisionPackage, selectedOption, variance, traceability);
  const recommendationEvaluation = buildRecommendationEvaluation(draft, decisionPackage, selectedOption, variance);
  const review = buildReview(draft, initiative, decisionPackage, selectedOption, observation, variance, decisionEvaluation, recommendationEvaluation);
  const lesson = buildLesson(draft, initiative, review, variance, decisionPackage, traceability);
  const action = buildImprovementAction(draft, initiative, lesson, variance, selectedOption);
  const enrichedReview = {
    ...review,
    lessonsLearned: [lesson.lessonId],
    proposedImprovementActions: [action.actionId],
  };

  return {
    initiative,
    decisionPackage,
    selectedOption,
    observations: [observation],
    variances: [variance],
    decisionEvaluation,
    recommendationEvaluation,
    review: enrichedReview,
    lessons: [lesson],
    improvementActions: [action],
    traceability: [
      lessonEvidence(lesson.lessonId, "LESSON", draft.initiativeId, decisionPackage.packageId),
      ...traceability,
    ],
  };
}

function buildBaseline(draft: LifecycleDraft, outcome: ExpectedOutcome): InitiativeBaseline {
  return {
    baselineId: `BASE-${draft.initiativeId}`,
    initiativeId: draft.initiativeId,
    relevantKpiId: outcome.relevantKpiId,
    value: draft.baselineValue,
    measurementTimestamp: draft.baselineValue === BASELINE_UNAVAILABLE ? null : "2026-07-18T00:00:00Z",
    measurementWindow: draft.baselineValue === BASELINE_UNAVAILABLE ? "BASELINE_UNAVAILABLE" : "fixture-baseline-window",
    source: draft.baselineValue === BASELINE_UNAVAILABLE ? "DEFINED_BUT_UNAVAILABLE" : "EIF Sprint 5 fixture baseline",
    provenance: "NON_PRODUCTION_FIXTURE",
    confidence: draft.baselineValue === BASELINE_UNAVAILABLE ? "INSUFFICIENT" : "LOW",
    freshness: draft.baselineValue === BASELINE_UNAVAILABLE ? "UNKNOWN" : "FRESH",
    knownLimitations: [
      limitation(`BASE-${draft.initiativeId}-FIXTURE`, "Baseline is fixture-backed or explicitly unavailable.", "HIGH"),
    ],
  };
}

function buildExpectedOutcome(draft: LifecycleDraft, outcome: ExpectedOutcome, baseline: InitiativeBaseline): LearningExpectedOutcome {
  return {
    ...outcome,
    outcomeId: `${draft.initiativeId}-EXPECTED-1`,
    description: outcome.description,
    baseline: draft.baselineValue === BASELINE_UNAVAILABLE ? "UNAVAILABLE" : draft.baselineValue,
    target: draft.targetValue,
    desiredDirection: draft.desiredDirection,
    baselineRef: baseline,
    assumptions: [
      "Outcome is a deterministic fixture demonstration.",
      "Human leadership must validate applicability before using the lesson operationally.",
    ],
    limitations: [
      ...outcome.limitations,
      limitation(`${draft.initiativeId}-OUTCOME-FIXTURE`, "Expected outcome is linked to a Sprint 4 decision package but remains non-persistent.", "HIGH"),
    ],
    provenance: DECISION_SUPPORT_PROVENANCE,
  };
}

function buildObservation(
  draft: LifecycleDraft,
  expectedOutcome: LearningExpectedOutcome,
  traceability: LearningEvidenceReference[],
): OutcomeObservation {
  return {
    observationId: `OBS-${draft.initiativeId}-1`,
    initiativeId: draft.initiativeId,
    expectedOutcomeId: expectedOutcome.outcomeId,
    kpiId: expectedOutcome.relevantKpiId,
    actualValue: draft.actualValue,
    observationTimestamp: draft.actualValue === "UNAVAILABLE" ? null : "2026-08-17T00:00:00Z",
    evaluationWindow: draft.actualValue === "UNAVAILABLE" ? "OUTCOME_OBSERVATION_UNAVAILABLE" : "fixture-review-window",
    source: draft.actualValue === "UNAVAILABLE" ? "DEFINED_BUT_UNAVAILABLE" : "EIF Sprint 5 fixture observation",
    freshness: draft.actualValue === "UNAVAILABLE" ? "UNKNOWN" : "FRESH",
    confidence: draft.actualValue === "UNAVAILABLE" ? "INSUFFICIENT" : "LOW",
    provenance: "NON_PRODUCTION_FIXTURE",
    evidence: [
      lessonEvidence(`OBS-${draft.initiativeId}-1`, "OUTCOME_OBSERVATION", draft.initiativeId, draft.packageId),
      ...traceability,
    ],
    limitations: [
      limitation(`OBS-${draft.initiativeId}-FIXTURE`, draft.observationNote, "HIGH"),
    ],
  };
}

function buildDecisionEvaluation(
  draft: LifecycleDraft,
  decisionPackage: EnterpriseDecisionPackage,
  selectedOption: DecisionOption,
  variance: OutcomeVariance,
  traceability: LearningEvidenceReference[],
): DecisionEvaluation {
  const followedRecommendation = decisionPackage.recommendation.recommendedOptionId === selectedOption.optionId;
  return {
    evaluationId: `DEVAL-${draft.initiativeId}`,
    initiativeId: draft.initiativeId,
    decisionPackageId: decisionPackage.packageId,
    result: draft.decisionResult,
    evidenceAvailableAtDecisionTime: traceability.filter((item) => item.evidenceType !== "OUTCOME_OBSERVATION" && item.evidenceType !== "OUTCOME_VARIANCE"),
    evidenceCoverage: decisionPackage.recommendation.confidence.score,
    decisionConfidence: decisionPackage.confidence.level,
    alternativesConsidered: decisionPackage.options.map((item) => item.optionId),
    risksAcknowledged: selectedOption.risks.map((item) => item.riskId),
    assumptionsRecorded: selectedOption.assumptions,
    selectedOptionFollowedRecommendation: followedRecommendation,
    overrideRationaleAdequate: followedRecommendation ? "NOT_APPLICABLE" : true,
    reviewTimingAppropriate: true,
    decisionProcessCompliant: decisionPackage.humanDecisionRequired === HUMAN_DECISION_REQUIRED && decisionPackage.dispositionDemo.officialDecision === false,
    outcomeQuality: variance.state,
    hindsightLimitations: [
      "Decision quality is evaluated separately from outcome quality.",
      "Fixture outcomes cannot prove causation.",
    ],
    explanation: `${draft.decisionResult} is based on evidence coverage, alternatives, risks, assumptions, and human-review semantics rather than the outcome alone.`,
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
    provenance: "NON_PRODUCTION_FIXTURE",
  };
}

function buildRecommendationEvaluation(
  draft: LifecycleDraft,
  decisionPackage: EnterpriseDecisionPackage,
  selectedOption: DecisionOption,
  variance: OutcomeVariance,
): RecommendationEvaluation {
  return {
    evaluationId: `REVAL-${draft.initiativeId}`,
    initiativeId: draft.initiativeId,
    decisionPackageId: decisionPackage.packageId,
    originalRecommendedOptionId: decisionPackage.recommendation.recommendedOptionId,
    originalConfidence: decisionPackage.recommendation.confidence.level,
    originalEvidenceCoverage: decisionPackage.recommendation.confidence.score,
    actualSelectedOptionId: selectedOption.optionId,
    outcomeAchieved: variance.state,
    materialRisksCorrectlySurfaced: selectedOption.risks.length > 0 ? true : "INCONCLUSIVE",
    materialUnknownsCorrectlySurfaced: decisionPackage.recommendation.materialUnknowns.length > 0 ? true : "INCONCLUSIVE",
    scoringModelFavoredEventualResult: decisionPackage.recommendation.recommendedOptionId === selectedOption.optionId,
    differentCriterionWeightingMayHaveChangedRecommendation: draft.calibration === "OVERCONFIDENT" ? true : "INCONCLUSIVE",
    calibrationFinding: draft.calibration,
    proposedWeightAdjustment: draft.calibration === "OVERCONFIDENT" ? "HUMAN_REVIEW_RECOMMENDATION_ONLY" : "NONE",
    limitations: [
      "Recommendation calibration is fixture-backed.",
      "No decision weights are changed automatically.",
    ],
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
    provenance: "NON_PRODUCTION_FIXTURE",
  };
}

function buildReview(
  draft: LifecycleDraft,
  initiative: EnterpriseInitiative,
  decisionPackage: EnterpriseDecisionPackage,
  selectedOption: DecisionOption,
  observation: OutcomeObservation,
  variance: OutcomeVariance,
  decisionEvaluation: DecisionEvaluation,
  recommendationEvaluation: RecommendationEvaluation,
): InitiativeReview {
  return {
    reviewId: `REV-${draft.initiativeId}`,
    initiativeSummary: `${initiative.title} remained ${initiative.lifecycleState} in a NON_PRODUCTION_FIXTURE review.`,
    originalDecision: `${draft.disposition} demonstration disposition selected ${selectedOption.optionId}; no official decision was persisted.`,
    originalRecommendation: decisionPackage.recommendation.reason,
    expectedOutcomes: initiative.expectedOutcomes,
    actualOutcomes: [observation],
    outcomeVariances: [variance],
    whatWorked: variance.interpretation === "FAVORABLE" ? ["Outcome was associated with meeting or exceeding the fixture target."] : ["Decision evidence and review structure remained traceable."],
    whatDidNotWork: variance.interpretation === "UNFAVORABLE" ? ["Fixture outcome missed the target and requires human review before action."] : [],
    unexpectedResults: variance.state === "MISSED" ? ["Adverse fixture result occurred despite a strong process signal."] : [],
    risksRealized: variance.state === "MISSED" ? selectedOption.risks.map((item) => item.description) : [],
    risksAvoided: variance.state === "EXCEEDED" || variance.state === "MET" ? selectedOption.risks.map((item) => item.description).slice(0, 1) : [],
    assumptionsValidated: variance.interpretation === "FAVORABLE" ? selectedOption.assumptions.slice(0, 2) : [],
    assumptionsInvalidated: variance.interpretation === "UNFAVORABLE" ? selectedOption.assumptions.slice(0, 2) : [],
    decisionQuality: decisionEvaluation,
    recommendationQuality: recommendationEvaluation,
    lessonsLearned: [],
    proposedImprovementActions: [],
    remainingUnknowns: [
      "Live-source outcome evidence is unavailable.",
      "Persistence and official workflow adoption are not authorized.",
      "Causality requires further validation.",
    ],
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
    labels: [HUMAN_REVIEW_REQUIRED, LEARNING_SYSTEM_PROVENANCE],
    provenance: "NON_PRODUCTION_FIXTURE",
  };
}

function buildLesson(
  draft: LifecycleDraft,
  initiative: EnterpriseInitiative,
  review: InitiativeReview,
  variance: OutcomeVariance,
  decisionPackage: EnterpriseDecisionPackage,
  traceability: LearningEvidenceReference[],
): LessonLearned {
  return {
    lessonId: `LESSON-${draft.initiativeId}`,
    title: draft.lessonTitle,
    summary: `The fixture outcome ${variance.state} was associated with ${initiative.title}; this lesson requires validation before policy or workflow adoption.`,
    sourceInitiativeId: initiative.initiativeId,
    sourceReviewId: review.reviewId,
    relevantDomains: [initiative.strategicDomain],
    relevantKpis: initiative.expectedOutcomes.map((item) => item.relevantKpiId).filter((item): item is string => Boolean(item)),
    relevantDecisionCriteria: DECISION_CRITERIA.map((item) => item.criterionId),
    lessonType: draft.lessonType,
    evidence: [
      lessonEvidence(review.reviewId, "INITIATIVE_REVIEW", initiative.initiativeId, decisionPackage.packageId),
      lessonEvidence(variance.varianceId, "OUTCOME_VARIANCE", initiative.initiativeId, decisionPackage.packageId),
      ...traceability,
    ],
    confidence: confidenceFromVariance(variance),
    applicability: variance.confidence === "INSUFFICIENT" ? "REQUIRES_VALIDATION" : "CONTEXT_SPECIFIC",
    limitations: [
      limitation(`LESSON-${draft.initiativeId}-FIXTURE`, "Lesson is fixture-backed and not enterprise policy.", "HIGH"),
      limitation(`LESSON-${draft.initiativeId}-CAUSE`, "Association is shown; causation is not established.", "HIGH"),
    ],
    proposedGovernanceImpact: "Review as a candidate governance learning item; do not auto-adopt.",
    provenance: "NON_PRODUCTION_FIXTURE",
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
  };
}

function buildImprovementAction(
  draft: LifecycleDraft,
  initiative: EnterpriseInitiative,
  lesson: LessonLearned,
  variance: OutcomeVariance,
  selectedOption: DecisionOption,
): ImprovementAction {
  const ranking = scoreBacklogItem(draft, variance, selectedOption);
  return {
    actionId: `ACTION-${draft.initiativeId}`,
    title: draft.actionTitle,
    description: `Proposed human-reviewed action derived from ${lesson.lessonId}; no task, roadmap item, notification, or ownership assignment is created.`,
    sourceLessonId: lesson.lessonId,
    sourceInitiativeId: initiative.initiativeId,
    relevantDomain: initiative.strategicDomain,
    proposedOwnerRole: initiative.initiativeOwnerRole,
    priority: ranking.totalScore === null ? "UNKNOWN" : ranking.totalScore >= 70 ? "HIGH" : ranking.totalScore >= 50 ? "MEDIUM" : "LOW",
    expectedBenefit: selectedOption.expectedBenefit,
    evidence: lesson.evidence,
    confidence: lesson.confidence,
    dependencies: selectedOption.dependencies,
    risks: selectedOption.risks.map((item) => item.description),
    suggestedReviewDate: initiative.plannedReviewDate,
    currentState: "NEEDS_REVIEW",
    ranking,
    provenance: "NON_PRODUCTION_FIXTURE",
    humanReviewRequired: HUMAN_REVIEW_REQUIRED,
  };
}

function buildTraceability(
  draft: LifecycleDraft,
  decisionPackage: EnterpriseDecisionPackage,
  selectedOption: DecisionOption,
  expectedOutcome: LearningExpectedOutcome,
): LearningEvidenceReference[] {
  const packageEvidence = decisionPackage.supportingEvidence.map((item) => fromKpiEvidence(item, draft.initiativeId, decisionPackage.packageId));
  return uniqueBy([
    lessonEvidence(decisionPackage.packageId, "DECISION_PACKAGE", draft.initiativeId, decisionPackage.packageId),
    lessonEvidence(selectedOption.optionId, "DECISION_OPTION", draft.initiativeId, decisionPackage.packageId),
    lessonEvidence(expectedOutcome.outcomeId, "EXPECTED_OUTCOME", draft.initiativeId, decisionPackage.packageId),
    ...packageEvidence,
  ], (item) => item.evidenceId);
}

function fromKpiEvidence(reference: EvidenceReference, initiativeId: string, decisionPackageId: string): LearningEvidenceReference {
  return {
    evidenceId: `LEARN-${reference.evidenceId}`,
    evidenceType: "KPI_EVIDENCE",
    sourceSystem: reference.sourceSystem,
    timestamp: reference.timestamp,
    provenance: reference.provenance === "NON_PRODUCTION_FIXTURE" ? "NON_PRODUCTION_FIXTURE" : "UNKNOWN",
    calculationVersion: reference.calculationVersion,
    kpiId: reference.kpiId,
    decisionPackageId,
    initiativeId,
    sourceEvidenceId: reference.evidenceId,
    internalRoute: reference.internalRoute,
  };
}

function lessonEvidence(
  id: string,
  evidenceType: LearningEvidenceReference["evidenceType"],
  initiativeId: string,
  decisionPackageId: string,
): LearningEvidenceReference {
  return {
    evidenceId: `LEARN-${id}`,
    evidenceType,
    sourceSystem: "EIF Learning System fixture",
    timestamp: FIXTURE_OBSERVATION_TIMESTAMP,
    provenance: "NON_PRODUCTION_FIXTURE",
    calculationVersion: LEARNING_SYSTEM_CALCULATION_VERSION,
    initiativeId,
    decisionPackageId,
    internalRoute: LEARNING_SYSTEM_ROUTE,
  };
}

function rankBacklog(actions: ImprovementAction[]): ContinuousImprovementBacklogItem[] {
  return actions
    .map((action) => ({ actionId: action.actionId, ranking: action.ranking }))
    .sort((left, right) => (right.ranking.totalScore ?? -1) - (left.ranking.totalScore ?? -1) || left.actionId.localeCompare(right.actionId))
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function scoreBacklogItem(
  draft: LifecycleDraft,
  variance: OutcomeVariance,
  selectedOption: DecisionOption,
): ContinuousImprovementBacklogItem["ranking"] {
  const effortScore = criterionScore(selectedOption, "ENGINEERING_EFFORT");
  const riskScore = criterionScore(selectedOption, "RISK");
  const customerImpact = criterionScore(selectedOption, "CUSTOMER_VALUE");
  const enterpriseLeverage = criterionScore(selectedOption, "ENTERPRISE_LEVERAGE");
  const strategicAlignment = numericOrDefault(criterionScore(selectedOption, "STRATEGIC_ALIGNMENT"), 50);
  const confidenceScore = variance.confidence === "HIGH" ? 90 : variance.confidence === "MEDIUM" ? 70 : variance.confidence === "LOW" ? 45 : 10;
  const urgency = variance.state === "MISSED" ? 90 : variance.state === "PARTIALLY_MET" ? 70 : variance.state === "NOT_MEASURABLE" ? 65 : 45;
  const effort = effortScore === "UNKNOWN" ? "UNKNOWN" : 100 - effortScore;
  const reversibility = selectedOption.reversibility === "HIGH" ? 90 : selectedOption.reversibility === "MEDIUM" ? 65 : selectedOption.reversibility === "LOW" ? 35 : "UNKNOWN";
  const values = [customerImpact, enterpriseLeverage, riskScore, confidenceScore, urgency, effort, reversibility, strategicAlignment];
  const numericValues = values.filter((item): item is number => typeof item === "number");
  const totalScore = numericValues.length < 5 ? null : Math.round(numericValues.reduce((sum, item) => sum + item, 0) / numericValues.length);
  return {
    customerImpact,
    enterpriseLeverage,
    riskReduction: riskScore === "UNKNOWN" ? "UNKNOWN" : 100 - riskScore,
    evidenceConfidence: confidenceScore,
    urgency,
    estimatedEffort: effort,
    reversibility,
    strategicAlignment,
    totalScore: draft.targetValue === "UNAVAILABLE" ? null : totalScore,
    criteriaVersion: DECISION_CRITERIA[0]?.version ?? "UNKNOWN",
  };
}

function criterionScore(option: DecisionOption, criterionId: DecisionCriterion["criterionId"]) {
  const score = option.score.criterionContributions.find((item) => item.criterionId === criterionId)?.rawAssessment;
  return typeof score === "number" ? score : "UNKNOWN";
}

function classifyVariance(actualValue: number, expectedValue: number, desiredDirection: LearningExpectedOutcome["desiredDirection"]): VarianceState {
  if (desiredDirection === "NEUTRAL") return actualValue === expectedValue ? "MET" : "INCONCLUSIVE";
  const ratio = desiredDirection === "LOWER_IS_BETTER" ? expectedValue / actualValue : actualValue / expectedValue;
  if (!Number.isFinite(ratio)) return "INCONCLUSIVE";
  if (ratio >= 1.05) return "EXCEEDED";
  if (ratio >= 1) return "MET";
  if (ratio >= 0.75) return "PARTIALLY_MET";
  return "MISSED";
}

function classifyMateriality(percentageVariance: number | null, absoluteVariance: number | null): Materiality {
  if (percentageVariance === null || absoluteVariance === null) return "UNKNOWN";
  const absolutePercent = Math.abs(percentageVariance);
  if (absolutePercent === 0) return "NONE";
  if (absolutePercent >= 20) return "HIGH";
  if (absolutePercent >= 10) return "MEDIUM";
  return "LOW";
}

function confidenceFromVariance(variance: OutcomeVariance): LearningConfidenceLevel {
  if (variance.state === "NOT_MEASURABLE" || variance.state === "UNKNOWN") return "INSUFFICIENT";
  if (variance.evidenceCoverage >= 3 && variance.provenance === "LIVE") return "HIGH";
  if (variance.evidenceCoverage >= 2) return "LOW";
  return "INSUFFICIENT";
}

function numericOrDefault(value: number | "UNKNOWN", fallback: number) {
  return typeof value === "number" ? value : fallback;
}

function pagination(options: { limit?: number; offset?: number }) {
  return {
    limit: Math.min(Math.max(options.limit ?? 100, 1), 250),
    offset: Math.max(options.offset ?? 0, 0),
  };
}

function limitation(limitationId: string, description: string, severity: LearningLimitation["severity"]): LearningLimitation {
  return { limitationId, description, severity };
}

function uniqueBy<T>(items: T[], keyFor: (item: T) => string) {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFor(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}
