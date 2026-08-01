import {
  generateInternalMappingReviewQueue,
  type EvidenceSufficiency,
  type InternalMappingReviewQueueItem,
  type ReviewAction,
  type ReviewStatus,
} from "./internalMappingReviewQueue.js";

export type FixtureReviewerRole =
  | "GMA_GOVERNANCE_REVIEWER"
  | "GMA_ARCHITECTURE_REVIEWER"
  | "GMA_EDITORIAL_SEPARATION_REVIEWER";

export type InternalReviewDecisionFixture = Readonly<{
  decisionId: string;
  queueItemId: string;
  originalPreviewRecordId: string;
  reviewerRole: FixtureReviewerRole;
  reviewStatus: Exclude<ReviewStatus, "PENDING_REVIEW">;
  selectedAction: ReviewAction;
  evidenceSufficiency: EvidenceSufficiency;
  rationale: string;
  preservedAmbiguity: InternalMappingReviewQueueItem["ambiguityType"];
  preservedConflicts: InternalMappingReviewQueueItem["conflictType"];
  editorialSeparationResult: "PASS" | "EDITORIAL_ONLY_LOCKED";
  requestedAdditionalEvidence: string;
  nextPermittedGate: "INTERNAL_PERSISTENCE_PROOF_REQUIRES_SEPARATE_AUTHORIZATION" | "NO_NEXT_GATE";
  prohibitedGates: readonly string[];
  deterministicReviewTimestamp: "2026-07-25T00:00:00.000Z";
  fixtureVersion: "GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_V1";
  activationEligibility: "NOT_ELIGIBLE";
  authoritativeStatus: "NON_AUTHORITATIVE_FIXTURE_ONLY";
  queueEvidenceSnapshot: InternalMappingReviewQueueItem;
}>;

const authorizedReviewerRoles: readonly FixtureReviewerRole[] = [
  "GMA_GOVERNANCE_REVIEWER",
  "GMA_ARCHITECTURE_REVIEWER",
  "GMA_EDITORIAL_SEPARATION_REVIEWER",
] as const;

const prohibitedGates = Object.freeze([
  "GIO_PERSISTENCE",
  "PRODUCTION_MAPPING",
  "FINAL_CANONICAL_SELECTION",
  "PROPERTY_ASSIGNMENT",
  "RUNTIME_ACTIVATION",
  "CUSTOMER_ACTIVATION",
]);

export function generateInternalReviewDecisionFixtures(
  queue: readonly InternalMappingReviewQueueItem[] = generateInternalMappingReviewQueue(),
): readonly InternalReviewDecisionFixture[] {
  const exactMunicipality = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "lib/cities.ts" &&
    item.sourceValue === "Thornton" &&
    item.mappingOutcome === "EXACT_CANONICAL_CANDIDATE"
  );
  const gunbarrelAmbiguity = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "lib/cities.ts" &&
    item.sourceValue === "Gunbarrel" &&
    item.ambiguityType === "OBJECT_TYPE_AMBIGUITY"
  );
  const superiorDuplicate = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/cities.ts" &&
    item.sourceValue === "Superior" &&
    item.conflictType === "DUPLICATE"
  );
  const niwotAuthority = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/cities.ts" &&
    item.sourceValue === "Niwot"
  );
  const marketAreaConflation = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "lib/marketData.ts" &&
    item.sourceValue === "Louisville Housing Market" &&
    item.conflictType === "CONFLICT"
  );
  const staticPolygon = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "lib/neighborhoodPolygons.ts" &&
    item.sourceValue === "Mapleton Hill" &&
    item.reviewerStatus === "DEFERRED"
  );
  const legacyAlias = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/cities.ts" &&
    item.sourceValue === "Boulder" &&
    item.mappingOutcome === "ALIAS_CANDIDATE"
  );
  const legacyDuplicate = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/neighborhoods.ts" &&
    item.sourceValue.includes("Mapleton Hill") &&
    item.conflictType === "DUPLICATE"
  );
  const editorialAssociation = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/searchPages.ts" &&
    item.editorialSeparationStatus === "EDITORIAL_ONLY" &&
    item.conflictType === "NONE"
  );
  const deferredScopeProxy = mustFind(queue, (item) =>
    item.sourceRepositoryLocation === "data/marketReports.ts" &&
    item.reviewerStatus === "DEFERRED"
  );

  return Object.freeze([
    decision("GMA_DECISION_FIXTURE|V1|001", exactMunicipality, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
      selectedAction: "CONFIRM_PREVIEW_CANDIDATE",
      rationale: "Thornton is an exact first-party municipality preview candidate and is approved only for non-authoritative preview continuity.",
      requestedAdditionalEvidence: "authoritative municipal identity source before persistence",
    }),
    decision("GMA_DECISION_FIXTURE|V1|002", gunbarrelAmbiguity, {
      reviewerRole: "GMA_ARCHITECTURE_REVIEWER",
      reviewStatus: "ESCALATED",
      selectedAction: "ESCALATE_FOR_ARCHITECTURAL_REVIEW",
      rationale: "Gunbarrel appears across municipality, neighborhood, and polygon contexts and cannot receive an automated final object type.",
      requestedAdditionalEvidence: "architectural object-type decision and authoritative identity evidence",
    }),
    decision("GMA_DECISION_FIXTURE|V1|003", superiorDuplicate, {
      reviewerRole: "GMA_ARCHITECTURE_REVIEWER",
      reviewStatus: "DUPLICATE_CANDIDATE",
      selectedAction: "REQUEST_ADDITIONAL_EVIDENCE",
      rationale: "Superior remains a primary and legacy registry duplicate candidate and cannot be merged by fixture decision.",
      requestedAdditionalEvidence: "duplicate disposition, alias policy review, and authoritative identity source before persistence",
    }),
    decision("GMA_DECISION_FIXTURE|V1|004", niwotAuthority, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "NEEDS_MORE_EVIDENCE",
      selectedAction: "REQUEST_ADDITIONAL_EVIDENCE",
      rationale: "Niwot requires authoritative identity evidence before any canonical type, alias, or persistence decision.",
      requestedAdditionalEvidence: "authoritative municipal, unincorporated community, postal, or local-governance source",
    }),
    decision("GMA_DECISION_FIXTURE|V1|005", marketAreaConflation, {
      reviewerRole: "GMA_ARCHITECTURE_REVIEWER",
      reviewStatus: "CONFLICT_PRESERVED",
      selectedAction: "PRESERVE_CONFLICT",
      rationale: "Louisville Housing Market cannot be silently converted into a municipality because market area and municipality identity are distinct.",
      requestedAdditionalEvidence: "separate market-area definition, geography basis, and source methodology",
    }),
    decision("GMA_DECISION_FIXTURE|V1|006", staticPolygon, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "DEFERRED",
      selectedAction: "DEFER",
      rationale: "Static polygon coordinates cannot establish an authoritative neighborhood boundary without source, precision, and effective-date review.",
      requestedAdditionalEvidence: "authoritative or reviewed boundary source with precision and effective date",
    }),
    decision("GMA_DECISION_FIXTURE|V1|007", legacyAlias, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "APPROVED_AS_ALIAS_CANDIDATE",
      selectedAction: "CLASSIFY_AS_ALIAS_CANDIDATE",
      rationale: "Legacy Boulder may remain an alias candidate, but repetition across registries does not make it canonical.",
      requestedAdditionalEvidence: "alias policy review and authoritative identity source before persistence",
    }),
    decision("GMA_DECISION_FIXTURE|V1|008", legacyDuplicate, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "DUPLICATE_CANDIDATE",
      selectedAction: "REQUEST_ADDITIONAL_EVIDENCE",
      rationale: "Legacy Mapleton Hill remains a duplicate candidate and cannot be merged by fixture decision.",
      requestedAdditionalEvidence: "duplicate disposition and boundary/source review",
    }),
    decision("GMA_DECISION_FIXTURE|V1|009", editorialAssociation, {
      reviewerRole: "GMA_EDITORIAL_SEPARATION_REVIEWER",
      reviewStatus: "EDITORIAL_ONLY",
      selectedAction: "CLASSIFY_AS_EDITORIAL_ONLY",
      rationale: "Search/page association remains editorial-only because page existence and search intent do not establish geographic identity.",
      requestedAdditionalEvidence: "separate sourced identity proposal before any factual or alias use",
    }),
    decision("GMA_DECISION_FIXTURE|V1|010", deferredScopeProxy, {
      reviewerRole: "GMA_GOVERNANCE_REVIEWER",
      reviewStatus: "DEFERRED",
      selectedAction: "DEFER",
      rationale: "ZIP and subdivision records were not generated in the 91-record queue; this deferred fixture preserves the no-production-data boundary instead of inventing a ZIP or subdivision mapping.",
      requestedAdditionalEvidence: "separate aggregate-only ZIP/subdivision preview authorization and license review",
    }),
  ]);
}

export function validateInternalReviewDecisionFixture(
  fixture: InternalReviewDecisionFixture,
  queue: readonly InternalMappingReviewQueueItem[] = generateInternalMappingReviewQueue(),
): void {
  const queueItem = queue.find((item) => item.queueItemId === fixture.queueItemId);
  if (!queueItem) throw new Error(`Decision fixture references unknown queue item ${fixture.queueItemId}`);
  if (!authorizedReviewerRoles.includes(fixture.reviewerRole)) throw new Error(`Unauthorized reviewer role ${fixture.reviewerRole}`);
  if (fixture.rationale.trim().length < 24) throw new Error("Reviewer rationale is mandatory and must be specific");
  if (fixture.activationEligibility !== "NOT_ELIGIBLE") throw new Error("Decision fixture cannot activate eligibility");
  if (fixture.authoritativeStatus !== "NON_AUTHORITATIVE_FIXTURE_ONLY") throw new Error("Decision fixture cannot become authoritative");
  if (fixture.fixtureVersion !== "GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_V1") throw new Error("Unsupported fixture version");
  if (fixture.queueEvidenceSnapshot !== queueItem && JSON.stringify(fixture.queueEvidenceSnapshot) !== JSON.stringify(queueItem)) {
    throw new Error("Decision fixture altered immutable queue evidence");
  }
  if (fixture.originalPreviewRecordId !== queueItem.previewRecordId) throw new Error("Decision fixture changed original preview record ID");
  if (fixture.evidenceSufficiency !== queueItem.evidenceSufficiency) throw new Error("Decision fixture changed evidence sufficiency");
  if (fixture.preservedAmbiguity !== queueItem.ambiguityType) throw new Error("Decision fixture failed to preserve ambiguity");
  if (fixture.preservedConflicts !== queueItem.conflictType) throw new Error("Decision fixture failed to preserve conflict state");
  if (fixture.prohibitedGates.some((gate) => !prohibitedGates.includes(gate))) throw new Error("Decision fixture contains an unsupported gate");

  validateStatusActionCompatibility(fixture, queueItem);
}

export function summarizeInternalReviewDecisionFixtures(fixtures: readonly InternalReviewDecisionFixture[]) {
  return {
    totalFixtureDecisions: fixtures.length,
    byStatus: countBy(fixtures, (fixture) => fixture.reviewStatus),
    byReviewerRole: countBy(fixtures, (fixture) => fixture.reviewerRole),
    activeEligibilityDecisions: fixtures.filter((fixture) => fixture.activationEligibility !== "NOT_ELIGIBLE").length,
    authoritativeDecisions: fixtures.filter((fixture) => fixture.authoritativeStatus !== "NON_AUTHORITATIVE_FIXTURE_ONLY").length,
    fixtureVersionCount: new Set(fixtures.map((fixture) => fixture.fixtureVersion)).size,
  };
}

function validateStatusActionCompatibility(
  fixture: InternalReviewDecisionFixture,
  queueItem: InternalMappingReviewQueueItem,
) {
  if (fixture.reviewStatus === "APPROVED_AS_PREVIEW_CANDIDATE") {
    if (fixture.selectedAction !== "CONFIRM_PREVIEW_CANDIDATE") throw new Error("Preview candidate approval requires confirm action");
    if (queueItem.ambiguityType !== "NONE" || queueItem.conflictType !== "NONE" || queueItem.editorialSeparationStatus === "EDITORIAL_ONLY") {
      throw new Error("Only unambiguous, non-conflicting, non-editorial items can be approved as preview candidates");
    }
  }

  if (fixture.reviewStatus === "APPROVED_AS_ALIAS_CANDIDATE") {
    if (fixture.selectedAction !== "CLASSIFY_AS_ALIAS_CANDIDATE") throw new Error("Alias candidate approval requires alias action");
    if (queueItem.mappingOutcome !== "ALIAS_CANDIDATE" || queueItem.editorialSeparationStatus === "EDITORIAL_ONLY") {
      throw new Error("Only non-editorial alias candidates can be approved as alias candidates");
    }
  }

  if (fixture.reviewStatus === "EDITORIAL_ONLY") {
    if (fixture.selectedAction !== "CLASSIFY_AS_EDITORIAL_ONLY") throw new Error("Editorial-only status requires editorial action");
    if (queueItem.editorialSeparationStatus !== "EDITORIAL_ONLY") throw new Error("Non-editorial queue item cannot become editorial-only by fixture");
  }

  if (fixture.reviewStatus === "DUPLICATE_CANDIDATE" && queueItem.conflictType !== "DUPLICATE") {
    throw new Error("Duplicate candidate status requires duplicate queue evidence");
  }

  if (fixture.reviewStatus === "CONFLICT_PRESERVED" && queueItem.conflictType !== "CONFLICT") {
    throw new Error("Conflict preservation requires conflict queue evidence");
  }

  if (fixture.reviewStatus === "DEFERRED" && fixture.selectedAction !== "DEFER") {
    throw new Error("Deferred status requires defer action");
  }

  if (fixture.reviewStatus === "ESCALATED" && fixture.selectedAction !== "ESCALATE_FOR_ARCHITECTURAL_REVIEW") {
    throw new Error("Escalated status requires architecture escalation");
  }
}

function decision(
  decisionId: string,
  queueItem: InternalMappingReviewQueueItem,
  input: Pick<InternalReviewDecisionFixture, "reviewerRole" | "reviewStatus" | "selectedAction" | "rationale" | "requestedAdditionalEvidence">,
): InternalReviewDecisionFixture {
  return Object.freeze({
    decisionId,
    queueItemId: queueItem.queueItemId,
    originalPreviewRecordId: queueItem.previewRecordId,
    reviewerRole: input.reviewerRole,
    reviewStatus: input.reviewStatus,
    selectedAction: input.selectedAction,
    evidenceSufficiency: queueItem.evidenceSufficiency,
    rationale: input.rationale,
    preservedAmbiguity: queueItem.ambiguityType,
    preservedConflicts: queueItem.conflictType,
    editorialSeparationResult: queueItem.editorialSeparationStatus === "EDITORIAL_ONLY" ? "EDITORIAL_ONLY_LOCKED" : "PASS",
    requestedAdditionalEvidence: input.requestedAdditionalEvidence,
    nextPermittedGate: "INTERNAL_PERSISTENCE_PROOF_REQUIRES_SEPARATE_AUTHORIZATION",
    prohibitedGates,
    deterministicReviewTimestamp: "2026-07-25T00:00:00.000Z",
    fixtureVersion: "GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_V1",
    activationEligibility: "NOT_ELIGIBLE",
    authoritativeStatus: "NON_AUTHORITATIVE_FIXTURE_ONLY",
    queueEvidenceSnapshot: Object.freeze({ ...queueItem }),
  });
}

function mustFind(
  queue: readonly InternalMappingReviewQueueItem[],
  predicate: (item: InternalMappingReviewQueueItem) => boolean,
): InternalMappingReviewQueueItem {
  const item = queue.find(predicate);
  if (!item) throw new Error("Required representative queue item was not found");
  return item;
}

function countBy<T, K extends string>(items: readonly T[], getKey: (item: T) => K): Record<K, number> {
  return items.reduce<Record<K, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}
