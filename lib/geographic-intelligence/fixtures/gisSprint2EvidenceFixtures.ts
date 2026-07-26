import { GIS_FAIL_CLOSED_ACTIVATION } from "../activationContract.js";
import { GIS_SPRINT_1_SYNTHETIC_SUBJECT } from "./gisSprint1Fixtures.js";
import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import {
  type GisEvidenceAcquisitionRecord,
  type GisEvidenceConflict,
  type GisEvidenceObservationLineage,
  type GisEvidenceProviderIdentity,
  type GisEvidenceSourceIdentity,
  type GisEvidenceSupersession,
  type GisEvidenceVersion,
  type GisProvenanceChain,
  type GisSprint2ScenarioResult,
} from "../evidenceProvenanceContract.js";
import {
  evaluateGisEvidenceFreshness,
  validateGisConflictPreserved,
  validateGisEvidenceVersion,
  validateGisObservationLineage,
  validateGisProvenanceCompleteness,
  validateGisSupersession,
} from "../evidenceValidation.js";

export const GIS_SPRINT_2_FIXTURE_TIME = "2026-07-26T12:00:00.000Z";
export const GIS_SPRINT_2_LATER_FIXTURE_TIME = "2026-07-27T12:00:00.000Z";
export const GIS_SPRINT_2_REFERENCE_TIME = "2026-08-15T12:00:00.000Z";
export const GIS_SPRINT_2_PROVIDER_BOUNDARY_NOTE = "NO_LIVE_PROVIDER_NO_ACQUISITION_NO_ADAPTER";

export const GIS_SPRINT_2_SYNTHETIC_PROVIDER: GisEvidenceProviderIdentity = Object.freeze({
  providerId: "GIS-S2-PROVIDER-SYNTHETIC-001",
  canonicalProviderName: "Synthetic Sprint 2 Provider",
  providerType: "SYNTHETIC_FIXTURE",
  providerRole: "DISTRIBUTOR",
  originator: false,
  distributor: true,
  authorityClassification: "UNKNOWN",
  jurisdiction: "SYNTHETIC",
  providerVersion: "GIS_SPRINT_2_PROVIDER_V1",
});

export const GIS_SPRINT_2_SYNTHETIC_AUTHORITY: GisEvidenceProviderIdentity = Object.freeze({
  ...GIS_SPRINT_2_SYNTHETIC_PROVIDER,
  providerId: "GIS-S2-AUTHORITY-SYNTHETIC-001",
  canonicalProviderName: "Synthetic Originating Authority",
  providerRole: "ORIGINATING_AUTHORITY",
  originator: true,
  distributor: false,
});

export const GIS_SPRINT_2_SYNTHETIC_SOURCE: GisEvidenceSourceIdentity = Object.freeze({
  sourceId: "GIS-S2-SOURCE-SYNTHETIC-DATASET-001",
  canonicalSourceName: "Synthetic Evidence and Provenance Dataset",
  sourceType: "SYNTHETIC_DATASET",
  datasetOrPublicationId: "GIS-S2-DATASET-001",
  publisherProviderId: GIS_SPRINT_2_SYNTHETIC_PROVIDER.providerId,
  originatingAuthorityProviderId: GIS_SPRINT_2_SYNTHETIC_AUTHORITY.providerId,
  sourceVersion: "GIS_SPRINT_2_SOURCE_V1",
  sourceLocator: null,
  jurisdiction: "SYNTHETIC",
  subjectCoverage: Object.freeze([GIS_SPRINT_1_SYNTHETIC_SUBJECT.subjectIdentity]),
  domainCoverage: Object.freeze(["COMMUNITY_INTELLIGENCE"] as const),
  updateCadence: "STATIC_FIXTURE",
});

const baseContent = Object.freeze({
  assertion: "synthetic.community.fixture.measure",
  value: "alpha",
  unit: null,
  subjectIdentity: GIS_SPRINT_1_SYNTHETIC_SUBJECT.subjectIdentity,
  domainId: "COMMUNITY_INTELLIGENCE",
});

const changedContent = Object.freeze({ ...baseContent, value: "beta" });
const conflictContent = Object.freeze({ ...baseContent, value: "conflict" });

export const GIS_SPRINT_2_BASE_CONTENT_FINGERPRINT = stableGisEvidenceFingerprint(baseContent);
export const GIS_SPRINT_2_CHANGED_CONTENT_FINGERPRINT = stableGisEvidenceFingerprint(changedContent);

export const GIS_SPRINT_2_ACQUISITION_A: GisEvidenceAcquisitionRecord = acquisition(
  "GIS-S2-ACQUISITION-A",
  "FIXTURE_ACQUIRED",
  GIS_SPRINT_2_FIXTURE_TIME,
  GIS_SPRINT_2_BASE_CONTENT_FINGERPRINT,
);

export const GIS_SPRINT_2_ACQUISITION_B_DUPLICATE: GisEvidenceAcquisitionRecord = acquisition(
  "GIS-S2-ACQUISITION-B-DUPLICATE",
  "DUPLICATE_CONTENT",
  GIS_SPRINT_2_LATER_FIXTURE_TIME,
  GIS_SPRINT_2_BASE_CONTENT_FINGERPRINT,
);

export const GIS_SPRINT_2_ACQUISITION_C_CHANGED: GisEvidenceAcquisitionRecord = acquisition(
  "GIS-S2-ACQUISITION-C-CHANGED",
  "CHANGED_CONTENT",
  GIS_SPRINT_2_LATER_FIXTURE_TIME,
  GIS_SPRINT_2_CHANGED_CONTENT_FINGERPRINT,
);

export const GIS_SPRINT_2_EVIDENCE_VERSION_A: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-A",
  versionSequence: "001",
  contentFingerprint: GIS_SPRINT_2_BASE_CONTENT_FINGERPRINT,
  normalizedContent: baseContent,
  acquisitionId: GIS_SPRINT_2_ACQUISITION_A.acquisitionId,
  status: "CURRENT",
  freshness: "CURRENT",
});

export const GIS_SPRINT_2_EVIDENCE_VERSION_C: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-C",
  versionSequence: "002",
  contentFingerprint: GIS_SPRINT_2_CHANGED_CONTENT_FINGERPRINT,
  normalizedContent: changedContent,
  acquisitionId: GIS_SPRINT_2_ACQUISITION_C_CHANGED.acquisitionId,
  status: "CURRENT",
  supersedesEvidenceVersionId: GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId,
  freshness: "CURRENT",
});

export const GIS_SPRINT_2_SUPERSESSION_C: GisEvidenceSupersession = Object.freeze({
  supersessionId: "GIS-S2-SUPERSESSION-C",
  predecessorEvidenceVersionId: GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId,
  successorEvidenceVersionId: GIS_SPRINT_2_EVIDENCE_VERSION_C.evidenceVersionId,
  evidenceFamilyId: GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceFamilyId,
  subjectIdentity: GIS_SPRINT_1_SYNTHETIC_SUBJECT.subjectIdentity,
  domainId: "COMMUNITY_INTELLIGENCE",
  reason: "CONTENT_CHANGED",
  supersessionTime: GIS_SPRINT_2_LATER_FIXTURE_TIME,
  predecessorHistoricallyValid: true,
  predecessorInvalidated: false,
});

export const GIS_SPRINT_2_CONFLICT_EVIDENCE: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-D-CONFLICT",
  versionSequence: "003",
  contentFingerprint: stableGisEvidenceFingerprint(conflictContent),
  normalizedContent: conflictContent,
  acquisitionId: "GIS-S2-ACQUISITION-D-CONFLICT",
  status: "CURRENT",
  freshness: "CURRENT",
});

export const GIS_SPRINT_2_CONFLICT: GisEvidenceConflict = Object.freeze({
  conflictId: "GIS-S2-CONFLICT-D",
  evidenceVersionIds: Object.freeze([
    GIS_SPRINT_2_EVIDENCE_VERSION_C.evidenceVersionId,
    GIS_SPRINT_2_CONFLICT_EVIDENCE.evidenceVersionId,
  ]),
  subjectIdentity: GIS_SPRINT_1_SYNTHETIC_SUBJECT.subjectIdentity,
  domainId: "COMMUNITY_INTELLIGENCE",
  assertionOrMetricId: "synthetic.community.fixture.measure",
  conflictType: "VALUE_CONFLICT",
  detectionMethod: "DETERMINISTIC_FIXTURE_COMPARISON",
  conflictStatus: "PRESERVED",
  resolutionStatus: "UNRESOLVED",
  resolutionAuthority: null,
  resolutionExplanation: null,
  internalOnly: true,
});

export const GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-E-UNKNOWN-RIGHTS",
  versionSequence: "004",
  contentFingerprint: stableGisEvidenceFingerprint({ ...baseContent, value: "unknown-rights" }),
  normalizedContent: { ...baseContent, value: "unknown-rights" },
  acquisitionId: "GIS-S2-ACQUISITION-E",
  status: "VALIDATED",
  licensingClassification: "UNKNOWN",
  permittedUse: "UNKNOWN",
  freshness: "CURRENT",
});

export const GIS_SPRINT_2_EXPIRED_VERSION: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-F-EXPIRED",
  versionSequence: "005",
  contentFingerprint: stableGisEvidenceFingerprint({ ...baseContent, value: "expired" }),
  normalizedContent: { ...baseContent, value: "expired" },
  acquisitionId: "GIS-S2-ACQUISITION-F",
  status: "EXPIRED",
  effectiveInterval: { effectiveStart: "2026-07-01T00:00:00.000Z", effectiveEnd: "2026-08-01T00:00:00.000Z" },
  freshness: "EXPIRED",
});

export const GIS_SPRINT_2_INVALIDATED_VERSION: GisEvidenceVersion = evidenceVersion({
  evidenceVersionId: "GIS-S2-EVIDENCE-VERSION-J-INVALIDATED",
  versionSequence: "006",
  contentFingerprint: stableGisEvidenceFingerprint({ ...baseContent, value: "invalidated" }),
  normalizedContent: { ...baseContent, value: "invalidated" },
  acquisitionId: "GIS-S2-ACQUISITION-J",
  status: "INVALIDATED",
  invalidated: true,
  freshness: "STALE",
});

export const GIS_SPRINT_2_PROVENANCE_CHAIN_A: GisProvenanceChain = Object.freeze({
  provenanceChainId: "GIS-S2-PROVENANCE-A",
  originatingAuthorityProviderId: GIS_SPRINT_2_SYNTHETIC_AUTHORITY.providerId,
  publisherProviderId: GIS_SPRINT_2_SYNTHETIC_PROVIDER.providerId,
  distributorProviderId: GIS_SPRINT_2_SYNTHETIC_PROVIDER.providerId,
  sourceId: GIS_SPRINT_2_SYNTHETIC_SOURCE.sourceId,
  acquisitionId: GIS_SPRINT_2_ACQUISITION_A.acquisitionId,
  normalizationIdentity: "GIS_SPRINT_2_NORMALIZATION_FIXTURE_V1",
  evidenceVersionId: GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId,
  observationId: "GIS-S2-OBSERVATION-A",
  derivedIntelligenceId: null,
  complete: true,
  missingElements: Object.freeze([]),
});

export const GIS_SPRINT_2_LINEAGE_A: GisEvidenceObservationLineage = Object.freeze({
  observationId: "GIS-S2-OBSERVATION-A",
  evidenceVersionIds: Object.freeze([GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId]),
  lineageOrder: "NORMALIZED_SORTED_SET",
  transformationIdentity: "GIS_SPRINT_2_OBSERVATION_LINEAGE_FIXTURE",
  transformationVersion: "GIS_SPRINT_2_LINEAGE_V1",
  lineageFingerprint: stableGisEvidenceFingerprint([
    GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId,
    "GIS_SPRINT_2_LINEAGE_V1",
  ]),
  completenessState: "COMPLETE",
});

export function certifyGisSprint2EvidenceScenarios(): Readonly<Record<string, GisSprint2ScenarioResult>> {
  const scenarioAValid = [
    ...validateGisEvidenceVersion(GIS_SPRINT_2_EVIDENCE_VERSION_A),
    ...validateGisProvenanceCompleteness(
      GIS_SPRINT_2_SYNTHETIC_PROVIDER,
      GIS_SPRINT_2_SYNTHETIC_SOURCE,
      GIS_SPRINT_2_ACQUISITION_A,
      GIS_SPRINT_2_EVIDENCE_VERSION_A,
      GIS_SPRINT_2_PROVENANCE_CHAIN_A,
    ),
    ...validateGisObservationLineage(GIS_SPRINT_2_LINEAGE_A, [GIS_SPRINT_2_EVIDENCE_VERSION_A]),
  ].length === 0;

  const duplicate = GIS_SPRINT_2_ACQUISITION_A.contentFingerprint === GIS_SPRINT_2_ACQUISITION_B_DUPLICATE.contentFingerprint;
  const changed = GIS_SPRINT_2_EVIDENCE_VERSION_A.contentFingerprint !== GIS_SPRINT_2_EVIDENCE_VERSION_C.contentFingerprint
    && validateGisSupersession(GIS_SPRINT_2_EVIDENCE_VERSION_A, GIS_SPRINT_2_EVIDENCE_VERSION_C, GIS_SPRINT_2_SUPERSESSION_C).length === 0;
  const conflict = validateGisConflictPreserved(GIS_SPRINT_2_CONFLICT).length === 0;
  const unknownRights = validateGisEvidenceVersion(GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION).includes("LICENSING_UNKNOWN_FAIL_CLOSED")
    && validateGisEvidenceVersion(GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION).includes("PERMITTED_USE_UNKNOWN_FAIL_CLOSED");
  const freshness = evaluateGisEvidenceFreshness(GIS_SPRINT_2_EXPIRED_VERSION, GIS_SPRINT_2_REFERENCE_TIME) === "EXPIRED";
  const invalidSupersession = validateGisSupersession(
    GIS_SPRINT_2_EVIDENCE_VERSION_A,
    GIS_SPRINT_2_EVIDENCE_VERSION_A,
    { ...GIS_SPRINT_2_SUPERSESSION_C, successorEvidenceVersionId: GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId },
    [GIS_SPRINT_2_EVIDENCE_VERSION_A.evidenceVersionId],
  ).length > 0;
  const subjectMismatch = validateGisSupersession(
    GIS_SPRINT_2_EVIDENCE_VERSION_A,
    { ...GIS_SPRINT_2_EVIDENCE_VERSION_C, subject: { ...GIS_SPRINT_2_EVIDENCE_VERSION_C.subject, subjectIdentity: "OTHER-SUBJECT" } },
    GIS_SPRINT_2_SUPERSESSION_C,
  ).includes("SUPERSESSION_SUBJECT_MISMATCH");
  const incompleteProvenance = validateGisProvenanceCompleteness(
    { ...GIS_SPRINT_2_SYNTHETIC_PROVIDER, providerId: "" },
    GIS_SPRINT_2_SYNTHETIC_SOURCE,
    GIS_SPRINT_2_ACQUISITION_A,
    GIS_SPRINT_2_EVIDENCE_VERSION_A,
    { ...GIS_SPRINT_2_PROVENANCE_CHAIN_A, complete: false, missingElements: ["providerId"] },
  ).length > 0;
  const invalidated = validateGisObservationLineage(
    { ...GIS_SPRINT_2_LINEAGE_A, evidenceVersionIds: [GIS_SPRINT_2_INVALIDATED_VERSION.evidenceVersionId] },
    [GIS_SPRINT_2_INVALIDATED_VERSION],
  ).includes("INVALIDATED_EVIDENCE_CANNOT_SUPPORT_OBSERVATION");

  if (!scenarioAValid || !duplicate || !changed || !conflict || !unknownRights || !freshness || !invalidSupersession || !subjectMismatch || !incompleteProvenance || !invalidated) {
    throw new Error("GIS Sprint 2 evidence scenario certification failed.");
  }

  return Object.freeze({
    scenarioA: "VALIDATED_FIXTURE_EVIDENCE_CHAIN",
    scenarioB: "DETERMINISTIC_DUPLICATE_ACQUISITION",
    scenarioC: "VALIDATED_CHANGED_EVIDENCE_VERSION",
    scenarioD: "PRESERVED_UNRESOLVED_CONFLICT",
    scenarioE: "FAILED_CLOSED_LICENSING_UNKNOWN",
    scenarioF: "VALIDATED_DETERMINISTIC_FRESHNESS",
    scenarioG: "FAILED_CLOSED_INVALID_SUPERSESSION",
    scenarioH: "FAILED_CLOSED_SUBJECT_MISMATCH",
    scenarioI: "FAILED_CLOSED_INCOMPLETE_PROVENANCE",
    scenarioJ: "FAILED_CLOSED_INVALIDATED_EVIDENCE",
  });
}

function acquisition(
  acquisitionId: string,
  acquisitionResult: GisEvidenceAcquisitionRecord["acquisitionResult"],
  acquiredTime: string,
  contentFingerprint: string,
): GisEvidenceAcquisitionRecord {
  return Object.freeze({
    acquisitionId,
    sourceId: GIS_SPRINT_2_SYNTHETIC_SOURCE.sourceId,
    providerId: GIS_SPRINT_2_SYNTHETIC_PROVIDER.providerId,
    acquisitionMethod: "SYNTHETIC_FIXTURE",
    acquiredTime,
    requestedLocatorOrIdentity: "GIS-S2-FIXTURE-REQUEST",
    responseOrArtifactIdentity: `${acquisitionId}-ARTIFACT`,
    acquisitionResult,
    normalizationStatus: "NORMALIZED",
    validationStatus: "VALIDATED",
    rejectionReason: null,
    contentFingerprint,
    authorizationState: GIS_FAIL_CLOSED_ACTIVATION,
  });
}

function evidenceVersion(overrides: Partial<GisEvidenceVersion> & Pick<GisEvidenceVersion, "evidenceVersionId" | "versionSequence" | "contentFingerprint" | "normalizedContent" | "acquisitionId" | "status" | "freshness">): GisEvidenceVersion {
  return Object.freeze({
    evidenceFamilyId: "GIS-S2-EVIDENCE-FAMILY-SYNTHETIC-COMMUNITY-MEASURE",
    evidenceVersionId: overrides.evidenceVersionId,
    versionSequence: overrides.versionSequence,
    subject: GIS_SPRINT_1_SYNTHETIC_SUBJECT,
    domainId: "COMMUNITY_INTELLIGENCE",
    assertionOrMetricId: "synthetic.community.fixture.measure",
    contentFingerprint: overrides.contentFingerprint,
    normalizedContent: overrides.normalizedContent,
    schemaVersion: "GIS_SPRINT_2_EVIDENCE_SCHEMA_V1",
    sourceVersion: GIS_SPRINT_2_SYNTHETIC_SOURCE.sourceVersion,
    publicationTime: "2026-07-20T00:00:00.000Z",
    observedTime: "2026-07-20T00:00:00.000Z",
    effectiveInterval: overrides.effectiveInterval ?? { effectiveStart: "2026-07-20T00:00:00.000Z", effectiveEnd: null },
    acquisitionId: overrides.acquisitionId,
    status: overrides.status,
    licensingClassification: overrides.licensingClassification ?? "CONTRACTUAL_INTERNAL_USE",
    permittedUse: overrides.permittedUse ?? "INTERNAL_RESEARCH_ONLY",
    quality: overrides.quality ?? "VALIDATED",
    freshness: overrides.freshness,
    authority: overrides.authority ?? "UNKNOWN",
    confidence: overrides.confidence ?? "UNKNOWN",
    supersedesEvidenceVersionId: overrides.supersedesEvidenceVersionId ?? null,
    supersededByEvidenceVersionId: overrides.supersededByEvidenceVersionId ?? null,
    withdrawn: overrides.withdrawn ?? false,
    invalidated: overrides.invalidated ?? false,
    internalOnly: true,
    customerDisplayAuthorized: false,
    redistributionAuthorized: false,
    runtimeActivationAuthorized: false,
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/fixtures/gisSprint2EvidenceFixtures.ts
