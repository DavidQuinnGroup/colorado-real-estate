import {
  readOnlyMappingPreviewRecords,
  type PreviewRecord,
} from "../../scripts/checkGmaReadOnlyMappingPreview.js";

export type ReviewStatus =
  | "PENDING_REVIEW"
  | "NEEDS_MORE_EVIDENCE"
  | "APPROVED_AS_PREVIEW_CANDIDATE"
  | "APPROVED_AS_ALIAS_CANDIDATE"
  | "EDITORIAL_ONLY"
  | "DUPLICATE_CANDIDATE"
  | "CONFLICT_PRESERVED"
  | "DEFERRED"
  | "REJECTED"
  | "ESCALATED";

export type ReviewAction =
  | "CONFIRM_PREVIEW_CANDIDATE"
  | "CLASSIFY_AS_ALIAS_CANDIDATE"
  | "PRESERVE_CONFLICT"
  | "REQUEST_ADDITIONAL_EVIDENCE"
  | "CLASSIFY_AS_EDITORIAL_ONLY"
  | "DEFER"
  | "REJECT"
  | "ESCALATE_FOR_ARCHITECTURAL_REVIEW";

export type EvidenceSufficiency =
  | "SUFFICIENT_FOR_PREVIEW"
  | "INSUFFICIENT"
  | "CONFLICTING"
  | "EDITORIAL_ONLY"
  | "REQUIRES_AUTHORITATIVE_SOURCE"
  | "REQUIRES_MANUAL_BOUNDARY_REVIEW"
  | "REQUIRES_LICENSE_REVIEW"
  | "REQUIRES_ARCHITECTURAL_DECISION";

export type DecisionStatus =
  | "UNDECIDED"
  | "NON_PRODUCTION_REVIEW_ONLY"
  | "REJECTED_FOR_PREVIEW"
  | "ESCALATED_FOR_ARCHITECTURE";

export type InternalMappingReviewQueueItem = Readonly<{
  queueItemId: string;
  previewRecordId: string;
  sourceAsset: string;
  sourceRepositoryLocation: string;
  sourceValue: string;
  proposedObjectType: PreviewRecord["proposedTargetObjectType"];
  proposedCanonicalCandidate: string;
  mappingOutcome: PreviewRecord["outcome"];
  mappingMethod: PreviewRecord["mappingMethod"];
  confidence: PreviewRecord["confidence"];
  ambiguityType: PreviewRecord["ambiguityStatus"];
  conflictType: PreviewRecord["conflictStatus"];
  editorialSeparationStatus: PreviewRecord["editorialSeparationStatus"];
  evidenceSummary: string;
  missingEvidence: string;
  evidenceSufficiency: EvidenceSufficiency;
  recommendedAction: ReviewAction;
  reviewerStatus: ReviewStatus;
  reviewerNote: string;
  decisionStatus: DecisionStatus;
  decisionRationale: string;
  activationEligibility: "NOT_ELIGIBLE";
  createdTimestamp: "2026-07-25T00:00:00.000Z";
  reviewVersion: "GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1";
  sourcePreviewSnapshot: PreviewRecord;
}>;

export type ReviewDecision = Readonly<{
  queueItemId: string;
  previewRecordId: string;
  requestedAction: ReviewAction;
  reviewerStatus: ReviewStatus;
  reviewerNote: string;
  decisionStatus: DecisionStatus;
  decisionRationale: string;
  activationEligibility: "NOT_ELIGIBLE";
  decidedTimestamp: "2026-07-25T00:00:00.000Z";
  reviewVersion: "GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1";
}>;

export const permittedReviewStatuses: readonly ReviewStatus[] = [
  "PENDING_REVIEW",
  "NEEDS_MORE_EVIDENCE",
  "APPROVED_AS_PREVIEW_CANDIDATE",
  "APPROVED_AS_ALIAS_CANDIDATE",
  "EDITORIAL_ONLY",
  "DUPLICATE_CANDIDATE",
  "CONFLICT_PRESERVED",
  "DEFERRED",
  "REJECTED",
  "ESCALATED",
] as const;

export const permittedReviewActions: readonly ReviewAction[] = [
  "CONFIRM_PREVIEW_CANDIDATE",
  "CLASSIFY_AS_ALIAS_CANDIDATE",
  "PRESERVE_CONFLICT",
  "REQUEST_ADDITIONAL_EVIDENCE",
  "CLASSIFY_AS_EDITORIAL_ONLY",
  "DEFER",
  "REJECT",
  "ESCALATE_FOR_ARCHITECTURAL_REVIEW",
] as const;

const actionToStatus: Record<ReviewAction, ReviewStatus> = {
  CONFIRM_PREVIEW_CANDIDATE: "APPROVED_AS_PREVIEW_CANDIDATE",
  CLASSIFY_AS_ALIAS_CANDIDATE: "APPROVED_AS_ALIAS_CANDIDATE",
  PRESERVE_CONFLICT: "CONFLICT_PRESERVED",
  REQUEST_ADDITIONAL_EVIDENCE: "NEEDS_MORE_EVIDENCE",
  CLASSIFY_AS_EDITORIAL_ONLY: "EDITORIAL_ONLY",
  DEFER: "DEFERRED",
  REJECT: "REJECTED",
  ESCALATE_FOR_ARCHITECTURAL_REVIEW: "ESCALATED",
};

const terminalDecisionByStatus: Record<ReviewStatus, DecisionStatus> = {
  PENDING_REVIEW: "UNDECIDED",
  NEEDS_MORE_EVIDENCE: "NON_PRODUCTION_REVIEW_ONLY",
  APPROVED_AS_PREVIEW_CANDIDATE: "NON_PRODUCTION_REVIEW_ONLY",
  APPROVED_AS_ALIAS_CANDIDATE: "NON_PRODUCTION_REVIEW_ONLY",
  EDITORIAL_ONLY: "NON_PRODUCTION_REVIEW_ONLY",
  DUPLICATE_CANDIDATE: "NON_PRODUCTION_REVIEW_ONLY",
  CONFLICT_PRESERVED: "NON_PRODUCTION_REVIEW_ONLY",
  DEFERRED: "NON_PRODUCTION_REVIEW_ONLY",
  REJECTED: "REJECTED_FOR_PREVIEW",
  ESCALATED: "ESCALATED_FOR_ARCHITECTURE",
};

export function loadReadOnlyPreviewLedger(): readonly PreviewRecord[] {
  return readOnlyMappingPreviewRecords.map((record) => Object.freeze({ ...record }));
}

export function getEvidenceSufficiency(record: PreviewRecord): EvidenceSufficiency {
  if (record.editorialSeparationStatus === "EDITORIAL_ONLY") return "EDITORIAL_ONLY";
  if (record.ambiguityStatus === "OBJECT_TYPE_AMBIGUITY") return "REQUIRES_ARCHITECTURAL_DECISION";
  if (record.ambiguityStatus === "BOUNDARY_AMBIGUITY") return "REQUIRES_MANUAL_BOUNDARY_REVIEW";
  if (record.conflictStatus === "CONFLICT") return "CONFLICTING";
  if (record.ambiguityStatus === "SOURCE_AMBIGUITY") return "REQUIRES_AUTHORITATIVE_SOURCE";
  if (record.mappingType === "OBSERVATION_MAPPING") return "REQUIRES_LICENSE_REVIEW";
  if (record.confidence === "LOW" || record.confidence === "UNRESOLVED") return "INSUFFICIENT";
  return "SUFFICIENT_FOR_PREVIEW";
}

export function getMissingEvidence(record: PreviewRecord): string {
  const missing: string[] = [];

  if (record.ambiguityStatus === "OBJECT_TYPE_AMBIGUITY") missing.push("architectural object-type decision");
  if (record.ambiguityStatus === "BOUNDARY_AMBIGUITY") missing.push("manual boundary review");
  if (record.ambiguityStatus === "SOURCE_AMBIGUITY") missing.push("authoritative source confirmation");
  if (record.conflictStatus === "CONFLICT") missing.push("conflict-preservation rationale");
  if (record.conflictStatus === "DUPLICATE") missing.push("duplicate-review disposition");
  if (record.editorialSeparationStatus === "EDITORIAL_ONLY") missing.push("separate sourced factual proposal before any factual use");
  if (record.mappingType === "OBSERVATION_MAPPING") missing.push("source, license, period, and methodology review");
  if (record.outcome === "DEFERRED") missing.push("new authorization before further mapping");

  return missing.length > 0 ? missing.join("; ") : "none for non-production preview review";
}

export function getRecommendedAction(record: PreviewRecord): ReviewAction {
  if (record.conflictStatus === "CONFLICT") return "PRESERVE_CONFLICT";
  if (record.editorialSeparationStatus === "EDITORIAL_ONLY") return "CLASSIFY_AS_EDITORIAL_ONLY";
  if (record.ambiguityStatus === "OBJECT_TYPE_AMBIGUITY") return "ESCALATE_FOR_ARCHITECTURAL_REVIEW";
  if (record.outcome === "DUPLICATE_CANDIDATE" || record.conflictStatus === "DUPLICATE") return "REQUEST_ADDITIONAL_EVIDENCE";
  if (record.outcome === "ALIAS_CANDIDATE") return "CLASSIFY_AS_ALIAS_CANDIDATE";
  if (record.outcome === "DEFERRED") return "DEFER";
  if (record.humanReviewRequirement === "REQUIRED") return "REQUEST_ADDITIONAL_EVIDENCE";
  return "CONFIRM_PREVIEW_CANDIDATE";
}

export function getInitialReviewStatus(record: PreviewRecord): ReviewStatus {
  if (record.ambiguityStatus === "OBJECT_TYPE_AMBIGUITY") return "ESCALATED";
  if (record.conflictStatus === "CONFLICT") return "CONFLICT_PRESERVED";
  if (record.editorialSeparationStatus === "EDITORIAL_ONLY") return "EDITORIAL_ONLY";
  if (record.outcome === "DUPLICATE_CANDIDATE" || record.conflictStatus === "DUPLICATE") return "DUPLICATE_CANDIDATE";
  if (record.outcome === "DEFERRED") return "DEFERRED";
  return "PENDING_REVIEW";
}

export function generateInternalMappingReviewQueue(
  previewRecords: readonly PreviewRecord[] = loadReadOnlyPreviewLedger(),
): readonly InternalMappingReviewQueueItem[] {
  return previewRecords.map((record, index) => {
    const reviewerStatus = getInitialReviewStatus(record);

    return Object.freeze({
      queueItemId: `GMA_REVIEW_QUEUE|V1|${String(index + 1).padStart(3, "0")}`,
      previewRecordId: record.previewId,
      sourceAsset: record.sourceAsset,
      sourceRepositoryLocation: record.repositoryLocation,
      sourceValue: record.sourceValue,
      proposedObjectType: record.proposedTargetObjectType,
      proposedCanonicalCandidate: record.proposedCanonicalName,
      mappingOutcome: record.outcome,
      mappingMethod: record.mappingMethod,
      confidence: record.confidence,
      ambiguityType: record.ambiguityStatus,
      conflictType: record.conflictStatus,
      editorialSeparationStatus: record.editorialSeparationStatus,
      evidenceSummary: record.evidenceSummary,
      missingEvidence: getMissingEvidence(record),
      evidenceSufficiency: getEvidenceSufficiency(record),
      recommendedAction: getRecommendedAction(record),
      reviewerStatus,
      reviewerNote: "Deterministic fixture queue item; no production reviewer decision recorded.",
      decisionStatus: terminalDecisionByStatus[reviewerStatus],
      decisionRationale: "Non-production review classification only; no canonical selection or active mapping.",
      activationEligibility: "NOT_ELIGIBLE",
      createdTimestamp: "2026-07-25T00:00:00.000Z",
      reviewVersion: "GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1",
      sourcePreviewSnapshot: Object.freeze({ ...record }),
    } satisfies InternalMappingReviewQueueItem);
  });
}

export function validateReviewTransition(item: InternalMappingReviewQueueItem, action: ReviewAction): ReviewStatus {
  const nextStatus = actionToStatus[action];

  if (item.editorialSeparationStatus === "EDITORIAL_ONLY" && action !== "CLASSIFY_AS_EDITORIAL_ONLY" && action !== "REJECT" && action !== "ESCALATE_FOR_ARCHITECTURAL_REVIEW") {
    throw new Error(`Editorial-only item cannot transition through factual action ${action}`);
  }

  if (item.ambiguityType !== "NONE" && action === "CONFIRM_PREVIEW_CANDIDATE") {
    throw new Error("Ambiguous item cannot be approved as a preview candidate without separate architecture review");
  }

  if (item.conflictType === "DUPLICATE" && action === "CONFIRM_PREVIEW_CANDIDATE") {
    throw new Error("Duplicate candidate cannot be merged or confirmed as canonical by the queue");
  }

  if (item.conflictType === "CONFLICT" && action !== "PRESERVE_CONFLICT" && action !== "REQUEST_ADDITIONAL_EVIDENCE" && action !== "ESCALATE_FOR_ARCHITECTURAL_REVIEW") {
    throw new Error(`Conflict item must remain preserved; invalid action ${action}`);
  }

  if (item.activationEligibility !== "NOT_ELIGIBLE") {
    throw new Error("Review queue items cannot become active");
  }

  return nextStatus;
}

export function recordDeterministicReviewDecision(
  item: InternalMappingReviewQueueItem,
  action: ReviewAction,
  reviewerNote: string,
): ReviewDecision {
  const reviewerStatus = validateReviewTransition(item, action);

  return Object.freeze({
    queueItemId: item.queueItemId,
    previewRecordId: item.previewRecordId,
    requestedAction: action,
    reviewerStatus,
    reviewerNote,
    decisionStatus: terminalDecisionByStatus[reviewerStatus],
    decisionRationale: "Decision remains a deterministic non-production queue classification.",
    activationEligibility: "NOT_ELIGIBLE",
    decidedTimestamp: "2026-07-25T00:00:00.000Z",
    reviewVersion: "GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1",
  });
}

export function summarizeInternalMappingReviewQueue(items: readonly InternalMappingReviewQueueItem[]) {
  return {
    totalQueueItems: items.length,
    byStatus: countBy(items, (item) => item.reviewerStatus),
    byEvidenceSufficiency: countBy(items, (item) => item.evidenceSufficiency),
    editorialOnlyItems: items.filter((item) => item.editorialSeparationStatus === "EDITORIAL_ONLY").length,
    ambiguousItems: items.filter((item) => item.ambiguityType !== "NONE").length,
    duplicateItems: items.filter((item) => item.conflictType === "DUPLICATE").length,
    conflictItems: items.filter((item) => item.conflictType === "CONFLICT").length,
    activationEligibleItems: items.filter((item) => item.activationEligibility !== "NOT_ELIGIBLE").length,
  };
}

export function getUnresolvedReviewItems(items: readonly InternalMappingReviewQueueItem[]) {
  return items.filter((item) =>
    item.reviewerStatus === "PENDING_REVIEW" ||
    item.reviewerStatus === "NEEDS_MORE_EVIDENCE" ||
    item.reviewerStatus === "CONFLICT_PRESERVED" ||
    item.reviewerStatus === "ESCALATED" ||
    item.evidenceSufficiency !== "SUFFICIENT_FOR_PREVIEW"
  );
}

function countBy<T, K extends string>(items: readonly T[], getKey: (item: T) => K): Record<K, number> {
  return items.reduce<Record<K, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}
