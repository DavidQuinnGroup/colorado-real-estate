import { stableGisEvidenceFingerprint } from "../geographic-intelligence/evidenceFingerprint.js";
import { type SourceRightsActivationRecord } from "../sourceRightsActivationReadiness.js";

export const EVIDENCE_DEPTH_FOUNDATION_STATUS = "EVIDENCE_DEPTH_AND_DATA_INTEGRATION_FOUNDATION_CERTIFIED";
export const EVIDENCE_DEPTH_FOUNDATION_VERSION = "1.0.0";

export type EvidenceDepthSubjectType =
  | "CITY"
  | "DECISION_GUIDE"
  | "COMPARISON"
  | "MARKET"
  | "PROPERTY"
  | "NEIGHBORHOOD"
  | "SELLER_READINESS"
  | "BUYER_FINANCING_READINESS"
  | "ADVISORY_PREPARATION"
  | "SYNTHETIC_FIXTURE";

export type EvidenceDepthDomain =
  | "LOCAL_DECISION_INTELLIGENCE"
  | "DECISION_GUIDE"
  | "CROSS_CITY_COMPARISON"
  | "MARKET_INTELLIGENCE"
  | "PROPERTY_INTELLIGENCE"
  | "NEIGHBORHOOD_INTELLIGENCE"
  | "SELLER_READINESS"
  | "BUYER_FINANCING_READINESS"
  | "ADVISORY_PREPARATION"
  | "SOURCE_RIGHTS"
  | "GEOGRAPHIC_INTELLIGENCE";

export type EvidenceDepthSourceType =
  | "REPOSITORY_GOVERNED"
  | "SYNTHETIC_FIXTURE"
  | "MLS_DERIVED"
  | "PUBLIC_OPEN_DATA"
  | "PUBLIC_RECORD"
  | "MUNICIPAL_RECORD"
  | "ASSESSOR_RECORD"
  | "RECORDER_RECORD"
  | "IMAGERY"
  | "PROVIDER_CONTRACT"
  | "UNKNOWN";

export type EvidenceDepthRightsStatus =
  | "PUBLIC_DISPLAY_PERMITTED"
  | "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION"
  | "DERIVED_OR_SUMMARY_USE_ONLY"
  | "INTERNAL_ANALYSIS_ONLY"
  | "RESTRICTED"
  | "UNKNOWN_OR_UNRESOLVED"
  | "PROHIBITED";

export type EvidenceDepthAcquisitionMethod =
  | "SYNTHETIC_FIXTURE"
  | "REPOSITORY_LOCAL_REFERENCE"
  | "GOVERNED_RECORD_REFERENCE"
  | "EXISTING_CERTIFIED_PIPELINE"
  | "FUTURE_PROVIDER_ADAPTER_NOT_ACTIVE"
  | "NOT_ACQUIRED";

export type EvidenceDepthFreshnessStatus =
  | "CURRENT"
  | "AGING"
  | "STALE"
  | "UNDATED"
  | "NOT_APPLICABLE";

export type EvidenceDepthSupportLevel =
  | "UNSUPPORTED"
  | "CONTEXTUAL"
  | "CORROBORATIVE"
  | "DIRECT"
  | "AUTHORITATIVE";

export type EvidenceDepthConflictStatus =
  | "NO_KNOWN_CONFLICT"
  | "COMPATIBLE_EVIDENCE"
  | "UNRESOLVED_CONFLICT"
  | "SUPERSEDED_EVIDENCE"
  | "MATERIAL_CONFLICT"
  | "INSUFFICIENT_INFORMATION_TO_RECONCILE";

export type EvidenceDepthSupersessionStatus =
  | "CURRENT_VERSION"
  | "SUPERSEDES_PRIOR"
  | "SUPERSEDED_BY_NEWER"
  | "HISTORICALLY_VALID"
  | "INVALIDATED"
  | "NOT_APPLICABLE";

export type EvidenceDepthInspectionStatus =
  | "FOUNDATION_FIXTURE_VALIDATED"
  | "REPOSITORY_LOCAL_REVIEWED"
  | "RIGHTS_REVIEW_REQUIRED"
  | "PROVIDER_CONFIRMATION_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "BLOCKED";

export type EvidenceDepthPublicUseEligibility =
  | "ELIGIBLE"
  | "ELIGIBLE_WITH_LIMITATIONS"
  | "INTERNAL_ONLY"
  | "BLOCKED"
  | "UNRESOLVED";

export type EvidenceDepthLimitationCategory =
  | "INCOMPLETE_GEOGRAPHIC_COVERAGE"
  | "INCOMPLETE_TEMPORAL_COVERAGE"
  | "SELF_REPORTED_SOURCE"
  | "INDIRECT_EVIDENCE"
  | "UNRESOLVED_CONFLICT"
  | "STALE_EVIDENCE"
  | "UNCERTAIN_RIGHTS"
  | "AGGREGATION_LIMITATION"
  | "CITYWIDE_NOT_PROPERTY_SPECIFIC"
  | "PROFESSIONAL_VERIFICATION_REQUIRED"
  | "UNAVAILABLE_UNDERLYING_SOURCE"
  | "NON_PUBLIC_USE_RESTRICTION"
  | "ATTRIBUTION_REQUIRED"
  | "SUPERSEDED_EVIDENCE"
  | "DOMAIN_SPECIFIC_RESTRICTION";

export type EvidenceDepthLimitations = Readonly<{
  categories: readonly EvidenceDepthLimitationCategory[];
  notes: readonly string[];
}>;

export type EvidenceDepthSubject = Readonly<{
  subjectId: string;
  subjectType: EvidenceDepthSubjectType;
  canonicalName: string;
  canonicalRoute: string | null;
}>;

export type EvidenceDepthSourceIdentity = Readonly<{
  sourceId: string;
  sourceName: string;
  sourceType: EvidenceDepthSourceType;
  providerId: string | null;
  providerName: string | null;
  originatingAuthority: string | null;
  sourceRights: EvidenceDepthRightsStatus;
  attributionRequired: boolean;
  permittedUses: readonly EvidenceDepthRightsStatus[];
  prohibitedUses: readonly string[];
}>;

export type EvidenceDepthProvenanceStep = Readonly<{
  stepId: string;
  role: "ORIGINATING_AUTHORITY" | "PUBLISHER" | "DISTRIBUTOR" | "ACQUISITION" | "NORMALIZATION" | "VERSION" | "INSPECTION";
  identity: string;
  timestamp: string | null;
}>;

export type EvidenceDepthLineageReference = Readonly<{
  relationship: "DERIVED_FROM" | "CORROBORATES" | "CONFLICTS_WITH" | "SUPERSEDES" | "SUPERSEDED_BY" | "REPLACES_FOR_DEFINED_PURPOSE" | "HISTORICALLY_VALID_FOR_PRIOR_PERIOD";
  evidenceId: string;
  evidenceVersionId: string;
  purpose: string;
}>;

export type EvidenceDepthFreshnessPolicy = Readonly<{
  domain: EvidenceDepthDomain;
  currentWithinDays: number | null;
  agingWithinDays: number | null;
  staleAfterDays: number | null;
  undatedAllowed: boolean;
}>;

export type EvidenceDepthEvidenceItem = Readonly<{
  evidenceId: string;
  evidenceVersionId: string;
  evidenceFamilyId: string;
  subject: EvidenceDepthSubject;
  domain: EvidenceDepthDomain;
  assertionId: string;
  source: EvidenceDepthSourceIdentity;
  acquisitionMethod: EvidenceDepthAcquisitionMethod;
  acquisitionTimestamp: string | null;
  observedOrEffectiveDate: string | null;
  freshnessStatus: EvidenceDepthFreshnessStatus;
  evidenceVersion: string;
  provenanceChain: readonly EvidenceDepthProvenanceStep[];
  supportLevel: EvidenceDepthSupportLevel;
  limitations: EvidenceDepthLimitations;
  conflictStatus: EvidenceDepthConflictStatus;
  supersessionStatus: EvidenceDepthSupersessionStatus;
  lineage: readonly EvidenceDepthLineageReference[];
  inspectionStatus: EvidenceDepthInspectionStatus;
  immutableContentFingerprint: string;
  publicUseEligibility: EvidenceDepthPublicUseEligibility;
  publicUseRationale: readonly string[];
  activation: Readonly<{
    providerCalls: 0;
    networkAcquisition: false;
    persistenceWrites: false;
    productionReads: false;
    publicRouteIntegration: false;
    customerDataAccess: false;
    publicConclusionGenerated: false;
  }>;
}>;

export type EvidenceDepthPostureSummary = Readonly<{
  evidenceItemCount: number;
  sourceRightsPosture: Readonly<Record<EvidenceDepthRightsStatus, number>>;
  freshnessPosture: Readonly<Record<EvidenceDepthFreshnessStatus, number>>;
  supportLevelDistribution: Readonly<Record<EvidenceDepthSupportLevel, number>>;
  conflictPresence: Readonly<Record<EvidenceDepthConflictStatus, number>>;
  publicUseEligibility: Readonly<Record<EvidenceDepthPublicUseEligibility, number>>;
  provenanceComplete: number;
  provenanceIncomplete: number;
  materialLimitations: readonly EvidenceDepthLimitationCategory[];
  hasPublicUseBlockedEvidence: boolean;
  hasUnresolvedRights: boolean;
  hasUnresolvedConflicts: boolean;
  generatedConclusion: false;
  compositeScore: null;
}>;

export const DEFAULT_EVIDENCE_DEPTH_FRESHNESS_POLICIES: readonly EvidenceDepthFreshnessPolicy[] = Object.freeze([
  { domain: "MARKET_INTELLIGENCE", currentWithinDays: 45, agingWithinDays: 120, staleAfterDays: 121, undatedAllowed: false },
  { domain: "PROPERTY_INTELLIGENCE", currentWithinDays: 90, agingWithinDays: 365, staleAfterDays: 366, undatedAllowed: false },
  { domain: "NEIGHBORHOOD_INTELLIGENCE", currentWithinDays: 365, agingWithinDays: 1095, staleAfterDays: 1096, undatedAllowed: true },
  { domain: "LOCAL_DECISION_INTELLIGENCE", currentWithinDays: 365, agingWithinDays: 1095, staleAfterDays: 1096, undatedAllowed: true },
  { domain: "DECISION_GUIDE", currentWithinDays: 365, agingWithinDays: 1095, staleAfterDays: 1096, undatedAllowed: true },
  { domain: "CROSS_CITY_COMPARISON", currentWithinDays: 365, agingWithinDays: 1095, staleAfterDays: 1096, undatedAllowed: true },
  { domain: "SELLER_READINESS", currentWithinDays: null, agingWithinDays: null, staleAfterDays: null, undatedAllowed: true },
  { domain: "BUYER_FINANCING_READINESS", currentWithinDays: null, agingWithinDays: null, staleAfterDays: null, undatedAllowed: true },
  { domain: "ADVISORY_PREPARATION", currentWithinDays: null, agingWithinDays: null, staleAfterDays: null, undatedAllowed: true },
  { domain: "SOURCE_RIGHTS", currentWithinDays: 180, agingWithinDays: 365, staleAfterDays: 366, undatedAllowed: false },
  { domain: "GEOGRAPHIC_INTELLIGENCE", currentWithinDays: 365, agingWithinDays: 1095, staleAfterDays: 1096, undatedAllowed: true },
]);

export function createEvidenceDepthIdentity(input: Readonly<Record<string, unknown>>): string {
  return `edfi_${stableGisEvidenceFingerprint(input).slice(0, 24)}`;
}

export function normalizeSourceRights(record: Pick<SourceRightsActivationRecord, "recommendedDecision" | "publicDisplayPermission" | "transformationPermission" | "attributionRequirements">): EvidenceDepthRightsStatus {
  const publicDisplay = record.publicDisplayPermission.toLowerCase();
  const transformation = record.transformationPermission.toLowerCase();
  const attribution = record.attributionRequirements.toLowerCase();

  if (record.recommendedDecision === "DO_NOT_USE") return "PROHIBITED";
  if (publicDisplay.includes("not approved")) return "RESTRICTED";
  if (record.recommendedDecision === "LEGAL_REVIEW_REQUIRED" || record.recommendedDecision === "PROVIDER_CONFIRMATION_REQUIRED") return "UNKNOWN_OR_UNRESOLVED";
  if (publicDisplay.includes("existing public") || publicDisplay.includes("approve when")) {
    return attribution.includes("unless") || attribution.includes("source") || attribution.includes("credit")
      ? "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION"
      : "PUBLIC_DISPLAY_PERMITTED";
  }
  if (record.recommendedDecision === "APPROVE_WITH_CONDITIONS" && transformation.includes("eligible")) return "DERIVED_OR_SUMMARY_USE_ONLY";
  if (record.recommendedDecision === "APPROVE") return "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION";
  return "UNKNOWN_OR_UNRESOLVED";
}

export function evaluateEvidenceFreshness(
  domain: EvidenceDepthDomain,
  observedOrEffectiveDate: string | null,
  referenceDate: string,
  policies: readonly EvidenceDepthFreshnessPolicy[] = DEFAULT_EVIDENCE_DEPTH_FRESHNESS_POLICIES,
): EvidenceDepthFreshnessStatus {
  const policy = policies.find((entry) => entry.domain === domain);
  if (!observedOrEffectiveDate) return policy?.undatedAllowed ? "UNDATED" : "UNDATED";
  if (!policy || policy.staleAfterDays === null || policy.currentWithinDays === null || policy.agingWithinDays === null) return "NOT_APPLICABLE";

  const observed = Date.parse(observedOrEffectiveDate);
  const reference = Date.parse(referenceDate);
  if (!Number.isFinite(observed) || !Number.isFinite(reference)) return "UNDATED";

  const ageDays = Math.floor((reference - observed) / 86_400_000);
  if (ageDays <= policy.currentWithinDays) return "CURRENT";
  if (ageDays <= policy.agingWithinDays) return "AGING";
  return "STALE";
}

export function evaluatePublicUseEligibility(item: Omit<EvidenceDepthEvidenceItem, "publicUseEligibility" | "publicUseRationale">): Readonly<{
  eligibility: EvidenceDepthPublicUseEligibility;
  rationale: readonly string[];
}> {
  const rationale: string[] = [];

  if (item.source.sourceRights === "PROHIBITED" || item.source.sourceRights === "RESTRICTED") {
    rationale.push("Source rights block public use.");
    return Object.freeze({ eligibility: "BLOCKED", rationale });
  }
  if (item.source.sourceRights === "UNKNOWN_OR_UNRESOLVED") {
    rationale.push("Source rights are unknown or unresolved.");
    return Object.freeze({ eligibility: "UNRESOLVED", rationale });
  }
  if (item.source.sourceRights === "INTERNAL_ANALYSIS_ONLY") {
    rationale.push("Permitted use is internal analysis only.");
    return Object.freeze({ eligibility: "INTERNAL_ONLY", rationale });
  }
  if (item.acquisitionMethod === "FUTURE_PROVIDER_ADAPTER_NOT_ACTIVE" || item.acquisitionMethod === "NOT_ACQUIRED") {
    rationale.push("Acquisition is not active.");
    return Object.freeze({ eligibility: "BLOCKED", rationale });
  }
  if (!isProvenanceComplete(item.provenanceChain)) {
    rationale.push("Provenance chain is incomplete.");
    return Object.freeze({ eligibility: "UNRESOLVED", rationale });
  }
  if (item.freshnessStatus === "STALE" || item.freshnessStatus === "UNDATED") {
    rationale.push("Freshness requires limitation-forward presentation.");
  }
  if (item.conflictStatus === "UNRESOLVED_CONFLICT" || item.conflictStatus === "MATERIAL_CONFLICT" || item.conflictStatus === "INSUFFICIENT_INFORMATION_TO_RECONCILE") {
    rationale.push("Conflict state requires limitation-forward presentation.");
  }
  if (item.supersessionStatus === "SUPERSEDED_BY_NEWER" || item.supersessionStatus === "INVALIDATED") {
    rationale.push("Supersession state blocks current public support.");
    return Object.freeze({ eligibility: "BLOCKED", rationale });
  }
  if (item.supportLevel === "UNSUPPORTED") {
    rationale.push("Unsupported evidence cannot support public presentation.");
    return Object.freeze({ eligibility: "BLOCKED", rationale });
  }
  if (
    item.source.sourceRights === "DERIVED_OR_SUMMARY_USE_ONLY"
    || item.source.sourceRights === "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION"
    || item.limitations.categories.length > 0
    || rationale.length > 0
  ) {
    if (item.source.sourceRights === "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION") rationale.push("Attribution is required.");
    if (item.source.sourceRights === "DERIVED_OR_SUMMARY_USE_ONLY") rationale.push("Only derived or summarized use is permitted.");
    return Object.freeze({ eligibility: "ELIGIBLE_WITH_LIMITATIONS", rationale });
  }

  rationale.push("Source rights, provenance, freshness, conflict, and support requirements pass.");
  return Object.freeze({ eligibility: "ELIGIBLE", rationale });
}

export function finalizeEvidenceDepthItem(
  item: Omit<EvidenceDepthEvidenceItem, "immutableContentFingerprint" | "publicUseEligibility" | "publicUseRationale">,
): EvidenceDepthEvidenceItem {
  const immutableContentFingerprint = stableGisEvidenceFingerprint({
    evidenceFamilyId: item.evidenceFamilyId,
    evidenceId: item.evidenceId,
    evidenceVersion: item.evidenceVersion,
    evidenceVersionId: item.evidenceVersionId,
    assertionId: item.assertionId,
    subject: item.subject,
    domain: item.domain,
    source: item.source,
    observedOrEffectiveDate: item.observedOrEffectiveDate,
    supportLevel: item.supportLevel,
    limitations: item.limitations,
    conflictStatus: item.conflictStatus,
    supersessionStatus: item.supersessionStatus,
    lineage: item.lineage,
  });
  const eligibility = evaluatePublicUseEligibility({ ...item, immutableContentFingerprint });
  return Object.freeze({
    ...item,
    immutableContentFingerprint,
    publicUseEligibility: eligibility.eligibility,
    publicUseRationale: eligibility.rationale,
  });
}

export function buildEvidencePostureSummary(items: readonly EvidenceDepthEvidenceItem[]): EvidenceDepthPostureSummary {
  const materialLimitations = [...new Set(items.flatMap((item) => item.limitations.categories))].sort();
  return Object.freeze({
    evidenceItemCount: items.length,
    sourceRightsPosture: countBy(items, (item) => item.source.sourceRights, emptyRightsCounts()),
    freshnessPosture: countBy(items, (item) => item.freshnessStatus, emptyFreshnessCounts()),
    supportLevelDistribution: countBy(items, (item) => item.supportLevel, emptySupportCounts()),
    conflictPresence: countBy(items, (item) => item.conflictStatus, emptyConflictCounts()),
    publicUseEligibility: countBy(items, (item) => item.publicUseEligibility, emptyEligibilityCounts()),
    provenanceComplete: items.filter((item) => isProvenanceComplete(item.provenanceChain)).length,
    provenanceIncomplete: items.filter((item) => !isProvenanceComplete(item.provenanceChain)).length,
    materialLimitations,
    hasPublicUseBlockedEvidence: items.some((item) => item.publicUseEligibility === "BLOCKED" || item.publicUseEligibility === "INTERNAL_ONLY"),
    hasUnresolvedRights: items.some((item) => item.source.sourceRights === "UNKNOWN_OR_UNRESOLVED"),
    hasUnresolvedConflicts: items.some((item) => item.conflictStatus === "UNRESOLVED_CONFLICT" || item.conflictStatus === "MATERIAL_CONFLICT"),
    generatedConclusion: false,
    compositeScore: null,
  });
}

export function inspectEvidenceDepthFoundation(items: readonly EvidenceDepthEvidenceItem[]): Readonly<{
  status: typeof EVIDENCE_DEPTH_FOUNDATION_STATUS;
  version: typeof EVIDENCE_DEPTH_FOUNDATION_VERSION;
  summary: EvidenceDepthPostureSummary;
  activation: Readonly<{
    providerCalls: 0;
    networkAcquisition: false;
    persistenceWrites: false;
    productionReads: false;
    publicRouteIntegration: false;
    customerDataAccess: false;
    publicConclusionGenerated: false;
  }>;
}> {
  return Object.freeze({
    status: EVIDENCE_DEPTH_FOUNDATION_STATUS,
    version: EVIDENCE_DEPTH_FOUNDATION_VERSION,
    summary: buildEvidencePostureSummary(items),
    activation: {
      providerCalls: 0 as const,
      networkAcquisition: false as const,
      persistenceWrites: false as const,
      productionReads: false as const,
      publicRouteIntegration: false as const,
      customerDataAccess: false as const,
      publicConclusionGenerated: false as const,
    },
  });
}

export function isProvenanceComplete(chain: readonly EvidenceDepthProvenanceStep[]): boolean {
  const roles = new Set(chain.map((step) => step.role));
  return roles.has("PUBLISHER") && roles.has("ACQUISITION") && roles.has("NORMALIZATION") && roles.has("VERSION") && roles.has("INSPECTION");
}

function countBy<TItem, TKey extends string>(
  items: readonly TItem[],
  getKey: (item: TItem) => TKey,
  seed: Record<TKey, number>,
): Readonly<Record<TKey, number>> {
  const counts = { ...seed };
  for (const item of items) counts[getKey(item)] += 1;
  return Object.freeze(counts);
}

function emptyRightsCounts(): Record<EvidenceDepthRightsStatus, number> {
  return {
    PUBLIC_DISPLAY_PERMITTED: 0,
    PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION: 0,
    DERIVED_OR_SUMMARY_USE_ONLY: 0,
    INTERNAL_ANALYSIS_ONLY: 0,
    RESTRICTED: 0,
    UNKNOWN_OR_UNRESOLVED: 0,
    PROHIBITED: 0,
  };
}

function emptyFreshnessCounts(): Record<EvidenceDepthFreshnessStatus, number> {
  return {
    CURRENT: 0,
    AGING: 0,
    STALE: 0,
    UNDATED: 0,
    NOT_APPLICABLE: 0,
  };
}

function emptySupportCounts(): Record<EvidenceDepthSupportLevel, number> {
  return {
    UNSUPPORTED: 0,
    CONTEXTUAL: 0,
    CORROBORATIVE: 0,
    DIRECT: 0,
    AUTHORITATIVE: 0,
  };
}

function emptyConflictCounts(): Record<EvidenceDepthConflictStatus, number> {
  return {
    NO_KNOWN_CONFLICT: 0,
    COMPATIBLE_EVIDENCE: 0,
    UNRESOLVED_CONFLICT: 0,
    SUPERSEDED_EVIDENCE: 0,
    MATERIAL_CONFLICT: 0,
    INSUFFICIENT_INFORMATION_TO_RECONCILE: 0,
  };
}

function emptyEligibilityCounts(): Record<EvidenceDepthPublicUseEligibility, number> {
  return {
    ELIGIBLE: 0,
    ELIGIBLE_WITH_LIMITATIONS: 0,
    INTERNAL_ONLY: 0,
    BLOCKED: 0,
    UNRESOLVED: 0,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/evidence-depth/evidencePosture.ts
