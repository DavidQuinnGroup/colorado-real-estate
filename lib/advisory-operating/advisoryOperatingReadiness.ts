import {
  ADVISORY_EVIDENCE_PREPARATION_TARGET,
  buildAdvisoryEvidencePreparation,
  type AdvisoryEvidencePreparationSummary,
  type AdvisoryEvidenceProfessionalReviewCategory,
  type AdvisoryEvidenceQuestionCategory,
} from "../evidence-depth/advisoryEvidencePreparation.js";
import { type EvidenceDepthEvidenceItem } from "../evidence-depth/evidencePosture.js";

export const ADVISORY_OPERATING_READINESS_STANDARD = "ADVISORY_OPERATING_READINESS_STANDARD";
export const ADVISORY_OPERATING_READINESS_STATUS = "ADVISORY_OPERATING_READINESS_INTERNAL_STANDARD_READY";
export const ADVISORY_OPERATING_READINESS_VERSION = "1.0.0";

export type AdvisoryOperatingStage =
  | "ORIENT"
  | "REVIEW_REIE_CONTEXT"
  | "IDENTIFY_OPEN_QUESTIONS"
  | "REVIEW_EVIDENCE_POSTURE"
  | "APPLY_PROFESSIONAL_BOUNDARIES"
  | "PREPARE_CONVERSATION"
  | "SEQUENCE_NEXT_STEPS"
  | "RECORD_NO_CUSTOMER_DATA";

export type AdvisoryDecisionContext =
  | "COMPARE_MARKETS"
  | "BUY"
  | "FINANCE"
  | "SELL"
  | "PREPARE"
  | "VERIFY"
  | "GRAND_PLAN_COORDINATION"
  | "PROFESSIONAL_REVIEW";

export type ReieSurfaceCategory =
  | "CROSS_CITY_COMPARISON"
  | "CITY_OR_DECISION_GUIDE_CONTEXT"
  | "SEARCH"
  | "BUYER_GUIDANCE"
  | "BUYER_FINANCING_READINESS"
  | "SELLER_GUIDANCE"
  | "SELLER_READINESS"
  | "MARKET_CONTEXT"
  | "PROPERTY_CONTEXT"
  | "NEIGHBORHOOD_CONTEXT"
  | "GRAND_PLAN"
  | "ADVISORY_HANDOFF";

export type AdvisoryOpenQuestionCategory =
  | "GOALS_AND_DECISION_CONTEXT"
  | "MARKET_AND_GEOGRAPHIC_CONTEXT"
  | "PROPERTY_SPECIFIC_REVIEW"
  | "FINANCING"
  | "SELLER_PREPARATION"
  | "TIMING_AND_SEQUENCING"
  | "EVIDENCE_LIMITATIONS"
  | "SOURCE_AND_RIGHTS"
  | "PROFESSIONAL_VERIFICATION"
  | "NEXT_ACTIONS";

export type AdvisoryProfessionalEscalationCategory =
  | "LENDING"
  | "LEGAL"
  | "TAX"
  | "APPRAISAL"
  | "INSPECTION"
  | "ENGINEERING"
  | "INSURANCE"
  | "TITLE"
  | "ENVIRONMENTAL"
  | "MUNICIPAL"
  | "HOA"
  | "PROPERTY_CONDITION_SPECIALIST"
  | "EVIDENCE_RIGHTS_REVIEW";

export type AdvisoryNextStepCategory =
  | "REVIEW_MORE_REIE_CONTEXT"
  | "VERIFY_WITH_QUALIFIED_SOURCE"
  | "GATHER_RELEVANT_DOCUMENTS"
  | "COMPARE_ALTERNATIVES"
  | "REVIEW_PROPERTY_OR_NEIGHBORHOOD"
  | "SPEAK_WITH_APPROPRIATE_PROFESSIONAL"
  | "CONTINUE_TO_ADVISORY"
  | "PAUSE_UNTIL_INFORMATION_VERIFIED";

export type AdvisoryBoundaryReminder =
  | "CUSTOMER_PRIORITIES_NOT_INFERRED"
  | "EVIDENCE_POSTURE_IS_NOT_CERTAINTY"
  | "ELIGIBILITY_IS_NOT_RECOMMENDATION"
  | "AUTHORITATIVE_EVIDENCE_STILL_HAS_LIMITATIONS"
  | "CITYWIDE_CONTEXT_NOT_PROPERTY_SPECIFIC"
  | "ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW"
  | "REIE_SUPPORTS_DECISIONS_DOES_NOT_DECIDE"
  | "NO_URGENCY_OR_PRESSURE"
  | "NO_RANKING_SCORING_OR_LEAD_PRIORITY"
  | "NO_OUTCOME_GUARANTEE"
  | "NO_CUSTOMER_PROFILING";

export type AdvisoryConsistencyRequirement =
  | "USE_CERTIFIED_LABELS_AND_DESTINATIONS"
  | "DISTINGUISH_INFORMATION_FROM_CONCLUSIONS"
  | "PRESERVE_LIMITATIONS"
  | "IDENTIFY_PROFESSIONAL_BOUNDARIES"
  | "AVOID_UNSUPPORTED_CLAIMS"
  | "AVOID_STEERING_OR_CODED_PREFERENCE_LANGUAGE"
  | "AVOID_SCHOOL_SAFETY_DEMOGRAPHIC_DESIRABILITY_OR_PROTECTED_CLASS_PROXY_CLAIMS"
  | "AVOID_VALUATION_PRICING_INVESTMENT_AFFORDABILITY_AND_QUALIFICATION_CONCLUSIONS"
  | "PRESERVE_PUBLIC_PRIVATE_EVIDENCE_BOUNDARIES"
  | "AVOID_COLLECTING_UNNECESSARY_CUSTOMER_INFORMATION";

export type AdvisoryOperatingFixture = Readonly<{
  fixtureId: string;
  label: string;
  decisionContexts: readonly AdvisoryDecisionContext[];
  requestedSurfaces: readonly ReieSurfaceCategory[];
  openQuestionCategories: readonly AdvisoryOpenQuestionCategory[];
  evidenceItems: readonly EvidenceDepthEvidenceItem[];
  requestedProfessionalEscalations: readonly AdvisoryProfessionalEscalationCategory[];
  requestedNextSteps: readonly AdvisoryNextStepCategory[];
  insufficientInformation: boolean;
  prohibitedOutputProbe: boolean;
}>;

export type AdvisoryOperatingPreparationPrompt = Readonly<{
  promptId: string;
  stage: AdvisoryOperatingStage;
  category: AdvisoryOpenQuestionCategory;
  prompt: string;
  evidenceQuestionCategory: AdvisoryEvidenceQuestionCategory | null;
  professionalEscalation: AdvisoryProfessionalEscalationCategory | null;
  nextStepCategory: AdvisoryNextStepCategory | null;
  boundaryReminder: AdvisoryBoundaryReminder;
  blockedUseWarning: boolean;
  attributionReminder: boolean;
  unresolvedConflictNotice: boolean;
}>;

export type AdvisoryOperatingPreparation = Readonly<{
  standard: typeof ADVISORY_OPERATING_READINESS_STANDARD;
  status: typeof ADVISORY_OPERATING_READINESS_STATUS;
  version: typeof ADVISORY_OPERATING_READINESS_VERSION;
  fixtureId: string;
  stages: readonly AdvisoryOperatingStage[];
  decisionContexts: readonly AdvisoryDecisionContext[];
  reieSurfaceCategories: readonly ReieSurfaceCategory[];
  openQuestionCategories: readonly AdvisoryOpenQuestionCategory[];
  evidencePreparationTarget: typeof ADVISORY_EVIDENCE_PREPARATION_TARGET;
  evidencePreparation: AdvisoryEvidencePreparationSummary;
  evidenceLimitationPrompts: readonly string[];
  professionalReviewCategories: readonly AdvisoryProfessionalEscalationCategory[];
  consistencyRequirements: readonly AdvisoryConsistencyRequirement[];
  boundaryReminders: readonly AdvisoryBoundaryReminder[];
  possibleNextStepCategories: readonly AdvisoryNextStepCategory[];
  prompts: readonly AdvisoryOperatingPreparationPrompt[];
  activation: Readonly<{
    publicUiChanged: false;
    publicRouteCreated: false;
    publicApiCreated: false;
    contactFieldsChanged: false;
    contactSubmissionChanged: false;
    customerContextTransfer: false;
    customerDataAccepted: false;
    customerRecordCreated: false;
    advisorDashboardCreated: false;
    advisorAccountCreated: false;
    crmTasks: false;
    leadScoring: false;
    leadRouting: false;
    tracking: false;
    telemetry: false;
    profiling: false;
    personalization: false;
    persistenceReads: false;
    persistenceWrites: false;
    providerCalls: 0;
    networkAcquisition: false;
    queueJobs: false;
    workers: false;
    email: false;
    publicEvidenceLabels: false;
  }>;
  customerRecommendation: null;
  transactionRecommendation: null;
  cityOrPropertyRecommendation: null;
  leadScore: null;
  urgency: null;
  conversionProbability: null;
  salesScript: null;
  personalizedActionPlan: null;
  valuation: null;
  pricing: null;
  affordability: null;
  qualification: null;
  forecast: null;
  suitability: null;
  propertyConditionConclusion: null;
  investmentAdvice: null;
}>;

export type AdvisoryOperatingInspection = Readonly<{
  standard: typeof ADVISORY_OPERATING_READINESS_STANDARD;
  status: typeof ADVISORY_OPERATING_READINESS_STATUS;
  version: typeof ADVISORY_OPERATING_READINESS_VERSION;
  fixtureCount: number;
  operatingStagesCovered: readonly AdvisoryOperatingStage[];
  reieSurfacesCovered: readonly ReieSurfaceCategory[];
  openQuestionCategoriesCovered: readonly AdvisoryOpenQuestionCategory[];
  professionalReviewCategoriesCovered: readonly AdvisoryProfessionalEscalationCategory[];
  evidenceBoundaryPromptCount: number;
  blockedUseWarningCount: number;
  attributionReminderCount: number;
  unresolvedConflictNoticeCount: number;
  prohibitedOutputAssertions: Readonly<{
    recommendations: false;
    leadScores: false;
    urgency: false;
    conversionProbability: false;
    salesScripts: false;
    personalizedActionPlans: false;
    valuation: false;
    pricing: false;
    affordability: false;
    qualification: false;
    forecasts: false;
    suitability: false;
    propertyConditionConclusions: false;
    investmentAdvice: false;
  }>;
  preparations: readonly AdvisoryOperatingPreparation[];
}>;

const OPERATING_STAGES: readonly AdvisoryOperatingStage[] = Object.freeze([
  "ORIENT",
  "REVIEW_REIE_CONTEXT",
  "IDENTIFY_OPEN_QUESTIONS",
  "REVIEW_EVIDENCE_POSTURE",
  "APPLY_PROFESSIONAL_BOUNDARIES",
  "PREPARE_CONVERSATION",
  "SEQUENCE_NEXT_STEPS",
  "RECORD_NO_CUSTOMER_DATA",
]);

export const ADVISORY_CONSISTENCY_REQUIREMENTS: readonly AdvisoryConsistencyRequirement[] = Object.freeze([
  "USE_CERTIFIED_LABELS_AND_DESTINATIONS",
  "DISTINGUISH_INFORMATION_FROM_CONCLUSIONS",
  "PRESERVE_LIMITATIONS",
  "IDENTIFY_PROFESSIONAL_BOUNDARIES",
  "AVOID_UNSUPPORTED_CLAIMS",
  "AVOID_STEERING_OR_CODED_PREFERENCE_LANGUAGE",
  "AVOID_SCHOOL_SAFETY_DEMOGRAPHIC_DESIRABILITY_OR_PROTECTED_CLASS_PROXY_CLAIMS",
  "AVOID_VALUATION_PRICING_INVESTMENT_AFFORDABILITY_AND_QUALIFICATION_CONCLUSIONS",
  "PRESERVE_PUBLIC_PRIVATE_EVIDENCE_BOUNDARIES",
  "AVOID_COLLECTING_UNNECESSARY_CUSTOMER_INFORMATION",
]);

export const ADVISORY_BOUNDARY_REMINDERS: readonly AdvisoryBoundaryReminder[] = Object.freeze([
  "CUSTOMER_PRIORITIES_NOT_INFERRED",
  "EVIDENCE_POSTURE_IS_NOT_CERTAINTY",
  "ELIGIBILITY_IS_NOT_RECOMMENDATION",
  "AUTHORITATIVE_EVIDENCE_STILL_HAS_LIMITATIONS",
  "CITYWIDE_CONTEXT_NOT_PROPERTY_SPECIFIC",
  "ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW",
  "REIE_SUPPORTS_DECISIONS_DOES_NOT_DECIDE",
  "NO_URGENCY_OR_PRESSURE",
  "NO_RANKING_SCORING_OR_LEAD_PRIORITY",
  "NO_OUTCOME_GUARANTEE",
  "NO_CUSTOMER_PROFILING",
]);

export function buildAdvisoryOperatingPreparation(
  fixture: AdvisoryOperatingFixture,
): AdvisoryOperatingPreparation {
  const evidencePreparation = buildAdvisoryEvidencePreparation(fixture.evidenceItems);
  const evidenceProfessionalEscalations = mapEvidenceProfessionalCategories(evidencePreparation.professionalReviewCategories);
  const professionalReviewCategories = uniqueSorted([
    ...fixture.requestedProfessionalEscalations,
    ...evidenceProfessionalEscalations,
  ]);
  const openQuestionCategories = uniqueSorted([
    ...fixture.openQuestionCategories,
    ...mapEvidenceQuestionCategories(evidencePreparation.questionCategories),
    ...(fixture.insufficientInformation ? ["EVIDENCE_LIMITATIONS" as const, "PROFESSIONAL_VERIFICATION" as const] : []),
  ]);
  const possibleNextStepCategories = uniqueSorted([
    ...fixture.requestedNextSteps,
    ...(evidencePreparation.blockedUseCount > 0 ? ["PAUSE_UNTIL_INFORMATION_VERIFIED" as const] : []),
    ...(professionalReviewCategories.length > 0 ? ["SPEAK_WITH_APPROPRIATE_PROFESSIONAL" as const] : []),
  ]);
  const prompts = buildOperatingPrompts(fixture, evidencePreparation, openQuestionCategories, professionalReviewCategories, possibleNextStepCategories);

  return Object.freeze({
    standard: ADVISORY_OPERATING_READINESS_STANDARD,
    status: ADVISORY_OPERATING_READINESS_STATUS,
    version: ADVISORY_OPERATING_READINESS_VERSION,
    fixtureId: fixture.fixtureId,
    stages: OPERATING_STAGES,
    decisionContexts: uniqueSorted(fixture.decisionContexts),
    reieSurfaceCategories: uniqueSorted(fixture.requestedSurfaces),
    openQuestionCategories,
    evidencePreparationTarget: evidencePreparation.target,
    evidencePreparation,
    evidenceLimitationPrompts: Object.freeze(evidencePreparation.prompts.map((prompt) => prompt.prompt)),
    professionalReviewCategories,
    consistencyRequirements: ADVISORY_CONSISTENCY_REQUIREMENTS,
    boundaryReminders: ADVISORY_BOUNDARY_REMINDERS,
    possibleNextStepCategories,
    prompts: Object.freeze(prompts),
    activation: {
      publicUiChanged: false as const,
      publicRouteCreated: false as const,
      publicApiCreated: false as const,
      contactFieldsChanged: false as const,
      contactSubmissionChanged: false as const,
      customerContextTransfer: false as const,
      customerDataAccepted: false as const,
      customerRecordCreated: false as const,
      advisorDashboardCreated: false as const,
      advisorAccountCreated: false as const,
      crmTasks: false as const,
      leadScoring: false as const,
      leadRouting: false as const,
      tracking: false as const,
      telemetry: false as const,
      profiling: false as const,
      personalization: false as const,
      persistenceReads: false as const,
      persistenceWrites: false as const,
      providerCalls: 0 as const,
      networkAcquisition: false as const,
      queueJobs: false as const,
      workers: false as const,
      email: false as const,
      publicEvidenceLabels: false as const,
    },
    customerRecommendation: null,
    transactionRecommendation: null,
    cityOrPropertyRecommendation: null,
    leadScore: null,
    urgency: null,
    conversionProbability: null,
    salesScript: null,
    personalizedActionPlan: null,
    valuation: null,
    pricing: null,
    affordability: null,
    qualification: null,
    forecast: null,
    suitability: null,
    propertyConditionConclusion: null,
    investmentAdvice: null,
  });
}

export function inspectAdvisoryOperatingReadiness(
  fixtures: readonly AdvisoryOperatingFixture[],
): AdvisoryOperatingInspection {
  const preparations = fixtures.map((fixture) => buildAdvisoryOperatingPreparation(fixture));
  return Object.freeze({
    standard: ADVISORY_OPERATING_READINESS_STANDARD,
    status: ADVISORY_OPERATING_READINESS_STATUS,
    version: ADVISORY_OPERATING_READINESS_VERSION,
    fixtureCount: fixtures.length,
    operatingStagesCovered: uniqueSorted(preparations.flatMap((preparation) => preparation.stages)),
    reieSurfacesCovered: uniqueSorted(preparations.flatMap((preparation) => preparation.reieSurfaceCategories)),
    openQuestionCategoriesCovered: uniqueSorted(preparations.flatMap((preparation) => preparation.openQuestionCategories)),
    professionalReviewCategoriesCovered: uniqueSorted(preparations.flatMap((preparation) => preparation.professionalReviewCategories)),
    evidenceBoundaryPromptCount: preparations.reduce((count, preparation) => count + preparation.evidenceLimitationPrompts.length, 0),
    blockedUseWarningCount: preparations.reduce((count, preparation) => count + preparation.prompts.filter((prompt) => prompt.blockedUseWarning).length, 0),
    attributionReminderCount: preparations.reduce((count, preparation) => count + preparation.prompts.filter((prompt) => prompt.attributionReminder).length, 0),
    unresolvedConflictNoticeCount: preparations.reduce((count, preparation) => count + preparation.prompts.filter((prompt) => prompt.unresolvedConflictNotice).length, 0),
    prohibitedOutputAssertions: {
      recommendations: false as const,
      leadScores: false as const,
      urgency: false as const,
      conversionProbability: false as const,
      salesScripts: false as const,
      personalizedActionPlans: false as const,
      valuation: false as const,
      pricing: false as const,
      affordability: false as const,
      qualification: false as const,
      forecasts: false as const,
      suitability: false as const,
      propertyConditionConclusions: false as const,
      investmentAdvice: false as const,
    },
    preparations: Object.freeze(preparations),
  });
}

function buildOperatingPrompts(
  fixture: AdvisoryOperatingFixture,
  evidencePreparation: AdvisoryEvidencePreparationSummary,
  openQuestionCategories: readonly AdvisoryOpenQuestionCategory[],
  professionalReviewCategories: readonly AdvisoryProfessionalEscalationCategory[],
  possibleNextStepCategories: readonly AdvisoryNextStepCategory[],
): AdvisoryOperatingPreparationPrompt[] {
  const prompts: AdvisoryOperatingPreparationPrompt[] = [];

  for (const category of openQuestionCategories) {
    prompts.push(makePrompt(
      fixture.fixtureId,
      "IDENTIFY_OPEN_QUESTIONS",
      category,
      promptForOpenQuestion(category),
      null,
      null,
      null,
      boundaryForQuestion(category),
      false,
      false,
      false,
    ));
  }

  for (const prompt of evidencePreparation.prompts) {
    prompts.push(makePrompt(
      fixture.fixtureId,
      "REVIEW_EVIDENCE_POSTURE",
      mapEvidenceQuestionCategory(prompt.category),
      prompt.prompt,
      prompt.category,
      prompt.professionalReviewCategory ? mapEvidenceProfessionalCategory(prompt.professionalReviewCategory) : null,
      prompt.blockedUse || prompt.internalOnly ? "PAUSE_UNTIL_INFORMATION_VERIFIED" : null,
      boundaryForEvidencePrompt(prompt.category),
      prompt.blockedUse || prompt.internalOnly,
      prompt.promptType === "ATTRIBUTION_REMINDER",
      prompt.promptType === "UNRESOLVED_CONFLICT_NOTICE",
    ));
  }

  for (const escalation of professionalReviewCategories) {
    prompts.push(makePrompt(
      fixture.fixtureId,
      "APPLY_PROFESSIONAL_BOUNDARIES",
      "PROFESSIONAL_VERIFICATION",
      `Identify ${formatCategory(escalation)} as a qualified-review category; do not provide the professional conclusion.`,
      null,
      escalation,
      "SPEAK_WITH_APPROPRIATE_PROFESSIONAL",
      "ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW",
      false,
      false,
      false,
    ));
  }

  for (const nextStep of possibleNextStepCategories) {
    prompts.push(makePrompt(
      fixture.fixtureId,
      "SEQUENCE_NEXT_STEPS",
      "NEXT_ACTIONS",
      `Keep ${formatCategory(nextStep)} as a possible category only; do not automatically choose it for a real customer.`,
      null,
      null,
      nextStep,
      "REIE_SUPPORTS_DECISIONS_DOES_NOT_DECIDE",
      false,
      false,
      false,
    ));
  }

  if (fixture.prohibitedOutputProbe) {
    prompts.push(makePrompt(
      fixture.fixtureId,
      "PREPARE_CONVERSATION",
      "NEXT_ACTIONS",
      "Do not convert preparation into urgency language, lead scoring, a sales script, or a personalized recommendation.",
      null,
      null,
      null,
      "NO_URGENCY_OR_PRESSURE",
      false,
      false,
      false,
    ));
  }

  prompts.push(makePrompt(
    fixture.fixtureId,
    "RECORD_NO_CUSTOMER_DATA",
    "GOALS_AND_DECISION_CONTEXT",
    "Do not save customer identity, contact details, selected markets, property identifiers, financial details, conversation notes, readiness state, advisor selections, evidence packets, or next-step selections.",
    null,
    null,
    null,
    "NO_CUSTOMER_PROFILING",
    false,
    false,
    false,
  ));

  return prompts;
}

function promptForOpenQuestion(category: AdvisoryOpenQuestionCategory): string {
  switch (category) {
    case "GOALS_AND_DECISION_CONTEXT":
      return "Clarify the decision being discussed without inferring customer priorities.";
    case "MARKET_AND_GEOGRAPHIC_CONTEXT":
      return "Identify which market or geographic context may need review without ranking locations.";
    case "PROPERTY_SPECIFIC_REVIEW":
      return "Separate property-specific questions from citywide or marketwide context.";
    case "FINANCING":
      return "Identify financing questions that belong with a qualified lender or advisor.";
    case "SELLER_PREPARATION":
      return "Organize seller preparation and document questions without valuation or pricing conclusions.";
    case "TIMING_AND_SEQUENCING":
      return "Frame timing and sequencing as discussion topics, not prescribed actions.";
    case "EVIDENCE_LIMITATIONS":
      return "Preserve freshness, scope, provenance, conflict, and rights limitations.";
    case "SOURCE_AND_RIGHTS":
      return "Confirm permitted-use boundaries before any customer-facing representation.";
    case "PROFESSIONAL_VERIFICATION":
      return "Identify qualified-review categories without providing professional conclusions.";
    case "NEXT_ACTIONS":
      return "List possible next-step categories without choosing a path for the customer.";
  }
}

function boundaryForQuestion(category: AdvisoryOpenQuestionCategory): AdvisoryBoundaryReminder {
  switch (category) {
    case "MARKET_AND_GEOGRAPHIC_CONTEXT":
      return "NO_RANKING_SCORING_OR_LEAD_PRIORITY";
    case "PROPERTY_SPECIFIC_REVIEW":
      return "CITYWIDE_CONTEXT_NOT_PROPERTY_SPECIFIC";
    case "FINANCING":
    case "PROFESSIONAL_VERIFICATION":
      return "ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW";
    case "SOURCE_AND_RIGHTS":
    case "EVIDENCE_LIMITATIONS":
      return "EVIDENCE_POSTURE_IS_NOT_CERTAINTY";
    case "NEXT_ACTIONS":
    case "TIMING_AND_SEQUENCING":
      return "REIE_SUPPORTS_DECISIONS_DOES_NOT_DECIDE";
    case "GOALS_AND_DECISION_CONTEXT":
    case "SELLER_PREPARATION":
      return "CUSTOMER_PRIORITIES_NOT_INFERRED";
  }
}

function boundaryForEvidencePrompt(category: AdvisoryEvidenceQuestionCategory): AdvisoryBoundaryReminder {
  switch (category) {
    case "SOURCE_AND_RIGHTS":
    case "ATTRIBUTION":
    case "INTERNAL_ONLY_EVIDENCE":
    case "BLOCKED_EVIDENCE":
      return "ELIGIBILITY_IS_NOT_RECOMMENDATION";
    case "CITYWIDE_VS_PROPERTY_SPECIFIC":
    case "GEOGRAPHIC_SCOPE":
      return "CITYWIDE_CONTEXT_NOT_PROPERTY_SPECIFIC";
    case "PROFESSIONAL_VERIFICATION":
    case "PROPERTY_SPECIFIC_VERIFICATION":
      return "ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW";
    case "CONFLICTING_EVIDENCE":
    case "FRESHNESS":
    case "PROVENANCE":
    case "TEMPORAL_SCOPE":
    case "UNRESOLVED_EVIDENCE":
      return "EVIDENCE_POSTURE_IS_NOT_CERTAINTY";
  }
}

function mapEvidenceQuestionCategories(categories: readonly AdvisoryEvidenceQuestionCategory[]): AdvisoryOpenQuestionCategory[] {
  return categories.map(mapEvidenceQuestionCategory);
}

function mapEvidenceQuestionCategory(category: AdvisoryEvidenceQuestionCategory): AdvisoryOpenQuestionCategory {
  switch (category) {
    case "SOURCE_AND_RIGHTS":
    case "ATTRIBUTION":
    case "INTERNAL_ONLY_EVIDENCE":
    case "BLOCKED_EVIDENCE":
      return "SOURCE_AND_RIGHTS";
    case "FRESHNESS":
    case "PROVENANCE":
    case "TEMPORAL_SCOPE":
    case "CONFLICTING_EVIDENCE":
    case "UNRESOLVED_EVIDENCE":
      return "EVIDENCE_LIMITATIONS";
    case "GEOGRAPHIC_SCOPE":
    case "CITYWIDE_VS_PROPERTY_SPECIFIC":
      return "MARKET_AND_GEOGRAPHIC_CONTEXT";
    case "PROPERTY_SPECIFIC_VERIFICATION":
      return "PROPERTY_SPECIFIC_REVIEW";
    case "PROFESSIONAL_VERIFICATION":
      return "PROFESSIONAL_VERIFICATION";
  }
}

function mapEvidenceProfessionalCategories(
  categories: readonly AdvisoryEvidenceProfessionalReviewCategory[],
): AdvisoryProfessionalEscalationCategory[] {
  return categories.map(mapEvidenceProfessionalCategory);
}

function mapEvidenceProfessionalCategory(
  category: AdvisoryEvidenceProfessionalReviewCategory,
): AdvisoryProfessionalEscalationCategory {
  switch (category) {
    case "LEGAL":
      return "LEGAL";
    case "TAX":
      return "TAX";
    case "LENDING":
      return "LENDING";
    case "APPRAISAL":
      return "APPRAISAL";
    case "INSPECTION":
      return "INSPECTION";
    case "ENGINEERING":
      return "ENGINEERING";
    case "INSURANCE":
      return "INSURANCE";
    case "TITLE":
      return "TITLE";
    case "MUNICIPAL_OR_HOA":
      return "MUNICIPAL";
    case "ENVIRONMENTAL":
      return "ENVIRONMENTAL";
    case "REAL_ESTATE_ADVISORY":
    case "QUALIFIED_SOURCE":
      return "EVIDENCE_RIGHTS_REVIEW";
  }
}

function makePrompt(
  fixtureId: string,
  stage: AdvisoryOperatingStage,
  category: AdvisoryOpenQuestionCategory,
  prompt: string,
  evidenceQuestionCategory: AdvisoryEvidenceQuestionCategory | null,
  professionalEscalation: AdvisoryProfessionalEscalationCategory | null,
  nextStepCategory: AdvisoryNextStepCategory | null,
  boundaryReminder: AdvisoryBoundaryReminder,
  blockedUseWarning: boolean,
  attributionReminder: boolean,
  unresolvedConflictNotice: boolean,
): AdvisoryOperatingPreparationPrompt {
  return Object.freeze({
    promptId: `${fixtureId}:${stage}:${category}:${prompt.slice(0, 32).replace(/ /g, "_")}`,
    stage,
    category,
    prompt,
    evidenceQuestionCategory,
    professionalEscalation,
    nextStepCategory,
    boundaryReminder,
    blockedUseWarning,
    attributionReminder,
    unresolvedConflictNotice,
  });
}

function formatCategory(value: string): string {
  return value.toLowerCase().replace(/_/g, " ");
}

function uniqueSorted<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}
