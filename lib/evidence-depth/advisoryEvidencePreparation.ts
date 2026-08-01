import {
  buildEvidencePostureSummary,
  type EvidenceDepthConflictStatus,
  type EvidenceDepthEvidenceItem,
  type EvidenceDepthFreshnessStatus,
  type EvidenceDepthLimitationCategory,
  type EvidenceDepthPublicUseEligibility,
  type EvidenceDepthRightsStatus,
  type EvidenceDepthSupportLevel,
} from "./evidencePosture.js";

export const CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_STATUS = "CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_FOUNDATION_READY";
export const CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_VERSION = "1.0.0";
export const ADVISORY_EVIDENCE_PREPARATION_TARGET = "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE";

export type AdvisoryEvidenceQuestionCategory =
  | "SOURCE_AND_RIGHTS"
  | "FRESHNESS"
  | "PROVENANCE"
  | "CONFLICTING_EVIDENCE"
  | "GEOGRAPHIC_SCOPE"
  | "TEMPORAL_SCOPE"
  | "CITYWIDE_VS_PROPERTY_SPECIFIC"
  | "PROPERTY_SPECIFIC_VERIFICATION"
  | "PROFESSIONAL_VERIFICATION"
  | "ATTRIBUTION"
  | "UNRESOLVED_EVIDENCE"
  | "INTERNAL_ONLY_EVIDENCE"
  | "BLOCKED_EVIDENCE";

export type AdvisoryEvidencePromptType =
  | "QUESTION_PROMPT"
  | "LIMITATION_PROMPT"
  | "VERIFICATION_PROMPT"
  | "ESCALATION_PROMPT"
  | "PUBLIC_USE_WARNING"
  | "ATTRIBUTION_REMINDER"
  | "UNRESOLVED_CONFLICT_NOTICE"
  | "FRESHNESS_REVIEW_NOTICE"
  | "PROFESSIONAL_REVIEW_NOTICE"
  | "INTERNAL_ONLY_RESTRICTION";

export type AdvisoryEvidenceEscalationCategory =
  | "RIGHTS_REVIEW"
  | "QUALIFIED_SOURCE_REVIEW"
  | "PROPERTY_SPECIFIC_REVIEW"
  | "PROFESSIONAL_REVIEW"
  | "ATTRIBUTION_REVIEW"
  | "CONFLICT_REVIEW"
  | "FRESHNESS_REVIEW"
  | "PUBLIC_USE_BLOCKED";

export type AdvisoryEvidenceProfessionalReviewCategory =
  | "LEGAL"
  | "TAX"
  | "LENDING"
  | "APPRAISAL"
  | "INSPECTION"
  | "ENGINEERING"
  | "INSURANCE"
  | "TITLE"
  | "MUNICIPAL_OR_HOA"
  | "ENVIRONMENTAL"
  | "REAL_ESTATE_ADVISORY"
  | "QUALIFIED_SOURCE";

export type AdvisoryEvidencePreparationPrompt = Readonly<{
  promptId: string;
  evidenceId: string;
  evidenceVersionId: string;
  category: AdvisoryEvidenceQuestionCategory;
  promptType: AdvisoryEvidencePromptType;
  prompt: string;
  limitationCategories: readonly EvidenceDepthLimitationCategory[];
  escalationCategory: AdvisoryEvidenceEscalationCategory | null;
  professionalReviewCategory: AdvisoryEvidenceProfessionalReviewCategory | null;
  publicUseWarning: boolean;
  internalOnly: boolean;
  blockedUse: boolean;
}>;

export type AdvisoryEvidencePreparationSummary = Readonly<{
  target: typeof ADVISORY_EVIDENCE_PREPARATION_TARGET;
  status: typeof CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_STATUS;
  version: typeof CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_VERSION;
  evidenceItemsReviewed: number;
  publicUsePosture: Readonly<Record<EvidenceDepthPublicUseEligibility, number>>;
  sourceRightsPosture: Readonly<Record<EvidenceDepthRightsStatus, number>>;
  freshnessPosture: Readonly<Record<EvidenceDepthFreshnessStatus, number>>;
  supportLevelDistribution: Readonly<Record<EvidenceDepthSupportLevel, number>>;
  conflictPresence: Readonly<Record<EvidenceDepthConflictStatus, number>>;
  materialRightsRestrictions: readonly EvidenceDepthRightsStatus[];
  freshnessIssues: readonly EvidenceDepthFreshnessStatus[];
  unresolvedConflictCount: number;
  provenanceGapCount: number;
  scopeLimitations: readonly EvidenceDepthLimitationCategory[];
  professionalReviewCategories: readonly AdvisoryEvidenceProfessionalReviewCategory[];
  questionCategories: readonly AdvisoryEvidenceQuestionCategory[];
  blockedUseCount: number;
  prompts: readonly AdvisoryEvidencePreparationPrompt[];
  activation: Readonly<{
    providerCalls: 0;
    networkAcquisition: false;
    persistenceReads: false;
    persistenceWrites: false;
    productionReads: false;
    publicRouteIntegration: false;
    publicApiCreated: false;
    contactSubmissionChanges: false;
    customerDataAccess: false;
    crmTasks: false;
    leadScoring: false;
    leadRouting: false;
    tracking: false;
    telemetry: false;
    personalization: false;
    publicConclusionGenerated: false;
  }>;
  generatedCustomerRecommendation: false;
  substantiveRealEstateConclusion: null;
  compositeEvidenceScore: null;
  leadScore: null;
}>;

export function buildAdvisoryEvidencePreparation(
  items: readonly EvidenceDepthEvidenceItem[],
): AdvisoryEvidencePreparationSummary {
  const posture = buildEvidencePostureSummary(items);
  const prompts = items.flatMap((item) => buildPromptsForEvidence(item));
  return Object.freeze({
    target: ADVISORY_EVIDENCE_PREPARATION_TARGET,
    status: CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_STATUS,
    version: CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_VERSION,
    evidenceItemsReviewed: items.length,
    publicUsePosture: posture.publicUseEligibility,
    sourceRightsPosture: posture.sourceRightsPosture,
    freshnessPosture: posture.freshnessPosture,
    supportLevelDistribution: posture.supportLevelDistribution,
    conflictPresence: posture.conflictPresence,
    materialRightsRestrictions: uniqueSorted(
      items
        .map((item) => item.source.sourceRights)
        .filter((rights) => rights !== "PUBLIC_DISPLAY_PERMITTED" && rights !== "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION"),
    ),
    freshnessIssues: uniqueSorted(
      items
        .map((item) => item.freshnessStatus)
        .filter((freshness) => freshness === "AGING" || freshness === "STALE" || freshness === "UNDATED"),
    ),
    unresolvedConflictCount: items.filter((item) => isUnresolvedConflict(item.conflictStatus)).length,
    provenanceGapCount: posture.provenanceIncomplete,
    scopeLimitations: uniqueSorted(
      posture.materialLimitations.filter((limitation) =>
        limitation === "CITYWIDE_NOT_PROPERTY_SPECIFIC"
        || limitation === "INCOMPLETE_GEOGRAPHIC_COVERAGE"
        || limitation === "INCOMPLETE_TEMPORAL_COVERAGE"
        || limitation === "AGGREGATION_LIMITATION"
      ),
    ),
    professionalReviewCategories: uniqueSorted(prompts.map((prompt) => prompt.professionalReviewCategory).filter(isDefined)),
    questionCategories: uniqueSorted(prompts.map((prompt) => prompt.category)),
    blockedUseCount: prompts.filter((prompt) => prompt.blockedUse || prompt.internalOnly).length,
    prompts: Object.freeze(prompts),
    activation: {
      providerCalls: 0 as const,
      networkAcquisition: false as const,
      persistenceReads: false as const,
      persistenceWrites: false as const,
      productionReads: false as const,
      publicRouteIntegration: false as const,
      publicApiCreated: false as const,
      contactSubmissionChanges: false as const,
      customerDataAccess: false as const,
      crmTasks: false as const,
      leadScoring: false as const,
      leadRouting: false as const,
      tracking: false as const,
      telemetry: false as const,
      personalization: false as const,
      publicConclusionGenerated: false as const,
    },
    generatedCustomerRecommendation: false as const,
    substantiveRealEstateConclusion: null,
    compositeEvidenceScore: null,
    leadScore: null,
  });
}

export function inspectAdvisoryEvidencePreparation(items: readonly EvidenceDepthEvidenceItem[]): Readonly<{
  target: typeof ADVISORY_EVIDENCE_PREPARATION_TARGET;
  summary: AdvisoryEvidencePreparationSummary;
}> {
  return Object.freeze({
    target: ADVISORY_EVIDENCE_PREPARATION_TARGET,
    summary: buildAdvisoryEvidencePreparation(items),
  });
}

function buildPromptsForEvidence(item: EvidenceDepthEvidenceItem): AdvisoryEvidencePreparationPrompt[] {
  const prompts: AdvisoryEvidencePreparationPrompt[] = [];

  addRightsPrompts(prompts, item);
  addFreshnessPrompts(prompts, item);
  addConflictPrompts(prompts, item);
  addScopePrompts(prompts, item);
  addSupportPrompts(prompts, item);

  if (item.publicUseEligibility === "ELIGIBLE_WITH_LIMITATIONS") {
    prompts.push(makePrompt(item, "UNRESOLVED_EVIDENCE", "LIMITATION_PROMPT", "Preserve stated limitations before using this evidence in any advisory preparation.", null, null, false, false, false));
  }

  return prompts;
}

function addRightsPrompts(prompts: AdvisoryEvidencePreparationPrompt[], item: EvidenceDepthEvidenceItem) {
  switch (item.source.sourceRights) {
    case "UNKNOWN_OR_UNRESOLVED":
      prompts.push(makePrompt(item, "SOURCE_AND_RIGHTS", "PUBLIC_USE_WARNING", "Do not treat unresolved source rights as customer-ready; verify permitted use before any public presentation.", "RIGHTS_REVIEW", "LEGAL", true, false, true));
      prompts.push(makePrompt(item, "UNRESOLVED_EVIDENCE", "VERIFICATION_PROMPT", "Preserve the unresolved-rights posture until a qualified rights review resolves it.", "RIGHTS_REVIEW", "LEGAL", true, false, true));
      break;
    case "RESTRICTED":
    case "PROHIBITED":
      prompts.push(makePrompt(item, "BLOCKED_EVIDENCE", "PUBLIC_USE_WARNING", "Block public use and do not paraphrase beyond the represented permitted-use boundary.", "PUBLIC_USE_BLOCKED", "LEGAL", true, false, true));
      break;
    case "INTERNAL_ANALYSIS_ONLY":
      prompts.push(makePrompt(item, "INTERNAL_ONLY_EVIDENCE", "INTERNAL_ONLY_RESTRICTION", "Use only for internal preparation within represented permissions; do not attach evidence or derived conclusions to customer communications.", "RIGHTS_REVIEW", "LEGAL", true, true, false));
      break;
    case "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION":
      prompts.push(makePrompt(item, "ATTRIBUTION", "ATTRIBUTION_REMINDER", "Preserve attribution and confirm the presentation format can carry the required source reference.", "ATTRIBUTION_REVIEW", null, false, false, false));
      break;
    case "DERIVED_OR_SUMMARY_USE_ONLY":
      prompts.push(makePrompt(item, "SOURCE_AND_RIGHTS", "LIMITATION_PROMPT", "Limit preparation to derived or summarized use and avoid exposing underlying material beyond represented permission.", "RIGHTS_REVIEW", "LEGAL", true, false, false));
      break;
    case "PUBLIC_DISPLAY_PERMITTED":
      prompts.push(makePrompt(item, "SOURCE_AND_RIGHTS", "QUESTION_PROMPT", "Retain source and provenance context; public eligibility does not convert support into certainty.", null, null, false, false, false));
      break;
  }
}

function addFreshnessPrompts(prompts: AdvisoryEvidencePreparationPrompt[], item: EvidenceDepthEvidenceItem) {
  if (item.freshnessStatus === "STALE") {
    prompts.push(makePrompt(item, "FRESHNESS", "FRESHNESS_REVIEW_NOTICE", "Disclose recency limitations and verify whether newer support is needed before using present-tense language.", "FRESHNESS_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.freshnessStatus === "UNDATED") {
    prompts.push(makePrompt(item, "TEMPORAL_SCOPE", "VERIFICATION_PROMPT", "Do not treat undated support as current; identify what temporal context is missing.", "FRESHNESS_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.freshnessStatus === "AGING") {
    prompts.push(makePrompt(item, "FRESHNESS", "QUESTION_PROMPT", "Confirm whether the evidence remains useful for the advisory question being prepared.", "FRESHNESS_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
}

function addConflictPrompts(prompts: AdvisoryEvidencePreparationPrompt[], item: EvidenceDepthEvidenceItem) {
  if (isUnresolvedConflict(item.conflictStatus)) {
    prompts.push(makePrompt(item, "CONFLICTING_EVIDENCE", "UNRESOLVED_CONFLICT_NOTICE", "Preserve the disagreement and avoid selecting a winner without additional qualified-source review.", "CONFLICT_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.conflictStatus === "SUPERSEDED_EVIDENCE" || item.supersessionStatus === "SUPERSEDED_BY_NEWER") {
    prompts.push(makePrompt(item, "PROVENANCE", "LIMITATION_PROMPT", "Retain historical context and avoid using superseded evidence as current support.", "QUALIFIED_SOURCE_REVIEW", "QUALIFIED_SOURCE", false, false, item.publicUseEligibility === "BLOCKED"));
  }
}

function addScopePrompts(prompts: AdvisoryEvidencePreparationPrompt[], item: EvidenceDepthEvidenceItem) {
  if (item.limitations.categories.includes("CITYWIDE_NOT_PROPERTY_SPECIFIC")) {
    prompts.push(makePrompt(item, "CITYWIDE_VS_PROPERTY_SPECIFIC", "VERIFICATION_PROMPT", "Do not apply citywide context directly to a property; identify property, neighborhood, municipal, HOA, inspection, title, insurance, environmental, structural, or specialist questions as applicable.", "PROPERTY_SPECIFIC_REVIEW", "REAL_ESTATE_ADVISORY", false, false, false));
  }
  if (item.limitations.categories.includes("INCOMPLETE_GEOGRAPHIC_COVERAGE") || item.limitations.categories.includes("AGGREGATION_LIMITATION")) {
    prompts.push(makePrompt(item, "GEOGRAPHIC_SCOPE", "LIMITATION_PROMPT", "Clarify the geographic scope before using this evidence to frame an advisory question.", "QUALIFIED_SOURCE_REVIEW", "REAL_ESTATE_ADVISORY", false, false, false));
  }
  if (item.limitations.categories.includes("INCOMPLETE_TEMPORAL_COVERAGE")) {
    prompts.push(makePrompt(item, "TEMPORAL_SCOPE", "LIMITATION_PROMPT", "Clarify the relevant time period before relying on this evidence for preparation.", "FRESHNESS_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.limitations.categories.includes("PROFESSIONAL_VERIFICATION_REQUIRED")) {
    prompts.push(makePrompt(item, "PROFESSIONAL_VERIFICATION", "PROFESSIONAL_REVIEW_NOTICE", "Identify which qualified professional should review this topic before any conclusion is discussed.", "PROFESSIONAL_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
}

function addSupportPrompts(prompts: AdvisoryEvidencePreparationPrompt[], item: EvidenceDepthEvidenceItem) {
  if (item.supportLevel === "CONTEXTUAL" || item.supportLevel === "CORROBORATIVE") {
    prompts.push(makePrompt(item, "PROVENANCE", "QUESTION_PROMPT", "Ask what additional direct or qualified-source support would be needed before the topic is presented as resolved.", "QUALIFIED_SOURCE_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.supportLevel === "DIRECT" || item.supportLevel === "AUTHORITATIVE") {
    prompts.push(makePrompt(item, "PROVENANCE", "QUESTION_PROMPT", "Review rights, freshness, scope, and limitations even when the evidence relationship is direct or authoritative.", "QUALIFIED_SOURCE_REVIEW", "QUALIFIED_SOURCE", false, false, false));
  }
  if (item.supportLevel === "UNSUPPORTED") {
    prompts.push(makePrompt(item, "BLOCKED_EVIDENCE", "ESCALATION_PROMPT", "Do not use unsupported evidence for advisory preparation except to identify what support is missing.", "PUBLIC_USE_BLOCKED", "QUALIFIED_SOURCE", true, false, true));
  }
}

function makePrompt(
  item: EvidenceDepthEvidenceItem,
  category: AdvisoryEvidenceQuestionCategory,
  promptType: AdvisoryEvidencePromptType,
  prompt: string,
  escalationCategory: AdvisoryEvidenceEscalationCategory | null,
  professionalReviewCategory: AdvisoryEvidenceProfessionalReviewCategory | null,
  publicUseWarning: boolean,
  internalOnly: boolean,
  blockedUse: boolean,
): AdvisoryEvidencePreparationPrompt {
  return Object.freeze({
    promptId: `${item.evidenceId}:${item.evidenceVersionId}:${category}:${promptType}`,
    evidenceId: item.evidenceId,
    evidenceVersionId: item.evidenceVersionId,
    category,
    promptType,
    prompt,
    limitationCategories: item.limitations.categories,
    escalationCategory,
    professionalReviewCategory,
    publicUseWarning,
    internalOnly,
    blockedUse,
  });
}

function isUnresolvedConflict(conflictStatus: EvidenceDepthConflictStatus): boolean {
  return conflictStatus === "UNRESOLVED_CONFLICT"
    || conflictStatus === "MATERIAL_CONFLICT"
    || conflictStatus === "INSUFFICIENT_INFORMATION_TO_RECONCILE";
}

function uniqueSorted<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}

function isDefined<T>(value: T | null): value is T {
  return value !== null;
}
