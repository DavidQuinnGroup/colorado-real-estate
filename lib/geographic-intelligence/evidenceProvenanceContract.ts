import {
  type GeographicIntelligenceActivationState,
  type GeographicIntelligenceConfidence,
  type GeographicIntelligenceFreshness,
  type GeographicIntelligencePermittedUse,
} from "./activationContract.js";
import { type GeographicIntelligenceDomainId, type GeographicIntelligenceSubject } from "./domainContract.js";

export const GIS_1_0_SPRINT_2_AUTHORIZATION = "GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_AUTHORIZED";
export const GIS_1_0_SPRINT_2_CLASSIFICATION = "EVIDENCE_AND_PROVENANCE_FOUNDATION";
export const GIS_1_0_SPRINT_2_CERTIFICATION = "GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_CERTIFIED";

export type GisEvidenceProviderRole =
  | "ORIGINATING_AUTHORITY"
  | "PRIMARY_PUBLISHER"
  | "DISTRIBUTOR"
  | "AGGREGATOR"
  | "COMMERCIAL_VENDOR"
  | "INTERNAL_SOURCE"
  | "UNKNOWN";

export type GisEvidenceProviderType =
  | "SYNTHETIC_FIXTURE"
  | "GOVERNMENT"
  | "COMMERCIAL"
  | "NONPROFIT"
  | "INTERNAL"
  | "UNKNOWN";

export type GisEvidenceAuthorityClassification =
  | "UNKNOWN"
  | "INFORMAL"
  | "SECONDARY"
  | "COMMERCIAL"
  | "GOVERNMENTAL"
  | "STATUTORY"
  | "AUTHORITATIVE";

export type GisEvidenceQuality =
  | "UNKNOWN"
  | "INCOMPLETE"
  | "UNVERIFIED"
  | "VALIDATED"
  | "HIGH_INTEGRITY"
  | "REJECTED";

export type GisEvidenceLicensingClassification =
  | "UNKNOWN"
  | "PUBLIC_DOMAIN"
  | "OPEN_LICENSE"
  | "CONTRACTUAL_INTERNAL_USE"
  | "CONTRACTUAL_DERIVED_USE"
  | "CONTRACTUAL_DISPLAY_USE"
  | "CONTRACTUAL_REDISTRIBUTION"
  | "RESTRICTED"
  | "PROHIBITED";

export type GisEvidenceStatus =
  | "PROPOSED"
  | "ACQUIRED_FIXTURE_ONLY"
  | "NORMALIZED"
  | "VALIDATED"
  | "REJECTED"
  | "CURRENT"
  | "SUPERSEDED"
  | "WITHDRAWN"
  | "EXPIRED"
  | "INVALIDATED"
  | "RETAINED_HISTORICAL";

export type GisEvidenceProviderIdentity = Readonly<{
  providerId: string;
  canonicalProviderName: string;
  providerType: GisEvidenceProviderType;
  providerRole: GisEvidenceProviderRole;
  originator: boolean;
  distributor: boolean;
  authorityClassification: GisEvidenceAuthorityClassification;
  jurisdiction: string;
  providerVersion: string | null;
}>;

export type GisEvidenceSourceIdentity = Readonly<{
  sourceId: string;
  canonicalSourceName: string;
  sourceType: "SYNTHETIC_DATASET" | "PUBLICATION" | "DATASET" | "INTERNAL_RECORD" | "UNKNOWN";
  datasetOrPublicationId: string;
  publisherProviderId: string;
  originatingAuthorityProviderId: string;
  sourceVersion: string;
  sourceLocator: string | null;
  jurisdiction: string;
  subjectCoverage: readonly string[];
  domainCoverage: readonly GeographicIntelligenceDomainId[];
  updateCadence: "UNKNOWN" | "STATIC_FIXTURE" | "EVENT_DRIVEN" | "PERIODIC" | "CONTINUOUS";
}>;

export type GisEvidenceAcquisitionRecord = Readonly<{
  acquisitionId: string;
  sourceId: string;
  providerId: string;
  acquisitionMethod: "SYNTHETIC_FIXTURE" | "GOVERNED_RECORD_REFERENCE" | "FUTURE_PROVIDER_ADAPTER";
  acquiredTime: string;
  requestedLocatorOrIdentity: string | null;
  responseOrArtifactIdentity: string;
  acquisitionResult: "FIXTURE_ACQUIRED" | "DUPLICATE_CONTENT" | "CHANGED_CONTENT" | "REJECTED" | "NOT_AUTHORIZED";
  normalizationStatus: "NOT_STARTED" | "NORMALIZED" | "REJECTED";
  validationStatus: "NOT_VALIDATED" | "VALIDATED" | "REJECTED";
  rejectionReason: string | null;
  contentFingerprint: string;
  authorizationState: GeographicIntelligenceActivationState;
}>;

export type GisEvidenceEffectiveInterval = Readonly<{
  effectiveStart: string | null;
  effectiveEnd: string | null;
}>;

export type GisEvidenceVersion = Readonly<{
  evidenceFamilyId: string;
  evidenceVersionId: string;
  versionSequence: string;
  subject: GeographicIntelligenceSubject;
  domainId: GeographicIntelligenceDomainId;
  assertionOrMetricId: string;
  contentFingerprint: string;
  normalizedContent: Readonly<Record<string, string | number | boolean | null>>;
  schemaVersion: string;
  sourceVersion: string;
  publicationTime: string | null;
  observedTime: string;
  effectiveInterval: GisEvidenceEffectiveInterval;
  acquisitionId: string;
  status: GisEvidenceStatus;
  licensingClassification: GisEvidenceLicensingClassification;
  permittedUse: GeographicIntelligencePermittedUse;
  quality: GisEvidenceQuality;
  freshness: GeographicIntelligenceFreshness;
  authority: GisEvidenceAuthorityClassification;
  confidence: GeographicIntelligenceConfidence;
  supersedesEvidenceVersionId: string | null;
  supersededByEvidenceVersionId: string | null;
  withdrawn: boolean;
  invalidated: boolean;
  internalOnly: true;
  customerDisplayAuthorized: false;
  redistributionAuthorized: false;
  runtimeActivationAuthorized: false;
}>;

export type GisProvenanceChain = Readonly<{
  provenanceChainId: string;
  originatingAuthorityProviderId: string | null;
  publisherProviderId: string | null;
  distributorProviderId: string | null;
  sourceId: string;
  acquisitionId: string;
  normalizationIdentity: string;
  evidenceVersionId: string;
  observationId: string | null;
  derivedIntelligenceId: string | null;
  complete: boolean;
  missingElements: readonly string[];
}>;

export type GisEvidenceSupersession = Readonly<{
  supersessionId: string;
  predecessorEvidenceVersionId: string;
  successorEvidenceVersionId: string;
  evidenceFamilyId: string;
  subjectIdentity: string;
  domainId: GeographicIntelligenceDomainId;
  reason: "CONTENT_CHANGED" | "CORRECTION" | "WITHDRAWAL" | "EXPIRATION" | "INVALIDATION";
  supersessionTime: string;
  predecessorHistoricallyValid: boolean;
  predecessorInvalidated: boolean;
}>;

export type GisEvidenceConflictType =
  | "VALUE_CONFLICT"
  | "TEMPORAL_CONFLICT"
  | "SUBJECT_CONFLICT"
  | "AUTHORITY_CONFLICT"
  | "GEOMETRY_CONFLICT"
  | "COVERAGE_CONFLICT"
  | "LICENSING_CONFLICT"
  | "VERSION_CONFLICT";

export type GisEvidenceConflict = Readonly<{
  conflictId: string;
  evidenceVersionIds: readonly string[];
  subjectIdentity: string;
  domainId: GeographicIntelligenceDomainId;
  assertionOrMetricId: string;
  conflictType: GisEvidenceConflictType;
  detectionMethod: "DETERMINISTIC_FIXTURE_COMPARISON";
  conflictStatus: "DETECTED" | "PRESERVED" | "REJECTED";
  resolutionStatus: "UNRESOLVED" | "GOVERNED_RESOLUTION_REQUIRED";
  resolutionAuthority: string | null;
  resolutionExplanation: string | null;
  internalOnly: true;
}>;

export type GisEvidenceObservationLineage = Readonly<{
  observationId: string;
  evidenceVersionIds: readonly string[];
  lineageOrder: "NORMALIZED_SORTED_SET" | "ORDERED_INPUT_SET";
  transformationIdentity: string;
  transformationVersion: string;
  lineageFingerprint: string;
  completenessState: "COMPLETE" | "INCOMPLETE";
}>;

export type GisSprint2ScenarioResult =
  | "VALIDATED_FIXTURE_EVIDENCE_CHAIN"
  | "DETERMINISTIC_DUPLICATE_ACQUISITION"
  | "VALIDATED_CHANGED_EVIDENCE_VERSION"
  | "PRESERVED_UNRESOLVED_CONFLICT"
  | "FAILED_CLOSED_LICENSING_UNKNOWN"
  | "VALIDATED_DETERMINISTIC_FRESHNESS"
  | "FAILED_CLOSED_INVALID_SUPERSESSION"
  | "FAILED_CLOSED_SUBJECT_MISMATCH"
  | "FAILED_CLOSED_INCOMPLETE_PROVENANCE"
  | "FAILED_CLOSED_INVALIDATED_EVIDENCE";

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/evidenceProvenanceContract.ts
