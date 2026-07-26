import { GIS_FAIL_CLOSED_ACTIVATION, assertGisFailClosedActivation } from "./activationContract.js";
import {
  type GisEvidenceAcquisitionRecord,
  type GisEvidenceConflict,
  type GisEvidenceObservationLineage,
  type GisEvidenceProviderIdentity,
  type GisEvidenceSourceIdentity,
  type GisEvidenceSupersession,
  type GisEvidenceVersion,
  type GisProvenanceChain,
} from "./evidenceProvenanceContract.js";

export function validateGisEvidenceVersion(version: GisEvidenceVersion): readonly string[] {
  const failures: string[] = [];
  if (!version.evidenceFamilyId) failures.push("EVIDENCE_FAMILY_ID_REQUIRED");
  if (!version.evidenceVersionId) failures.push("EVIDENCE_VERSION_ID_REQUIRED");
  if (!version.subject.subjectIdentity) failures.push("SUBJECT_IDENTITY_REQUIRED");
  if (!version.domainId) failures.push("DOMAIN_IDENTITY_REQUIRED");
  if (!version.contentFingerprint) failures.push("CONTENT_FINGERPRINT_REQUIRED");
  if (!version.licensingClassification) failures.push("LICENSING_REQUIRED");
  if (!version.permittedUse) failures.push("PERMITTED_USE_REQUIRED");
  if (version.licensingClassification === "UNKNOWN") failures.push("LICENSING_UNKNOWN_FAIL_CLOSED");
  if (version.permittedUse === "UNKNOWN") failures.push("PERMITTED_USE_UNKNOWN_FAIL_CLOSED");
  if (version.customerDisplayAuthorized !== false) failures.push("CUSTOMER_DISPLAY_NOT_AUTHORIZED");
  if (version.redistributionAuthorized !== false) failures.push("REDISTRIBUTION_NOT_AUTHORIZED");
  if (version.runtimeActivationAuthorized !== false) failures.push("RUNTIME_NOT_AUTHORIZED");
  if (version.effectiveInterval.effectiveStart && version.effectiveInterval.effectiveEnd && version.effectiveInterval.effectiveStart > version.effectiveInterval.effectiveEnd) failures.push("EFFECTIVE_INTERVAL_INVALID");
  if (version.publicationTime && version.effectiveInterval.effectiveEnd && version.effectiveInterval.effectiveEnd < version.publicationTime) failures.push("EXPIRATION_PRECEDES_PUBLICATION");
  if (version.status === "REJECTED" && version.quality === "VALIDATED") failures.push("REJECTED_CANNOT_BE_VALIDATED");
  if (version.status === "WITHDRAWN" && version.freshness === "CURRENT") failures.push("WITHDRAWN_CANNOT_BE_CURRENT");
  if (version.status === "INVALIDATED" && version.freshness === "CURRENT") failures.push("INVALIDATED_CANNOT_BE_CURRENT");
  if (version.status === "EXPIRED" && version.freshness === "CURRENT") failures.push("EXPIRED_CANNOT_BE_CURRENT");
  return Object.freeze(failures);
}

export function assertGisAcquisitionInert(acquisition: GisEvidenceAcquisitionRecord): void {
  if (!acquisition.acquisitionId) throw new Error("GIS acquisition identity is required.");
  if (!acquisition.sourceId) throw new Error("GIS acquisition source identity is required.");
  if (!acquisition.providerId) throw new Error("GIS acquisition provider identity is required.");
  if (!acquisition.contentFingerprint) throw new Error("GIS acquisition content fingerprint is required.");
  assertGisFailClosedActivation(acquisition.authorizationState);
}

export function validateGisProvenanceCompleteness(
  provider: GisEvidenceProviderIdentity,
  source: GisEvidenceSourceIdentity,
  acquisition: GisEvidenceAcquisitionRecord,
  version: GisEvidenceVersion,
  chain: GisProvenanceChain,
): readonly string[] {
  const failures: string[] = [];
  if (!provider.providerId) failures.push("PROVIDER_IDENTITY_REQUIRED");
  if (!source.sourceId) failures.push("SOURCE_IDENTITY_REQUIRED");
  if (!acquisition.acquisitionId) failures.push("ACQUISITION_IDENTITY_REQUIRED");
  if (acquisition.authorizationState !== GIS_FAIL_CLOSED_ACTIVATION) failures.push("ACQUISITION_AUTHORIZATION_MUST_BE_FALSE");
  if (source.publisherProviderId === source.originatingAuthorityProviderId && provider.providerRole === "DISTRIBUTOR") failures.push("PROVIDER_SOURCE_ROLE_COLLAPSED");
  if (version.acquisitionId !== acquisition.acquisitionId) failures.push("VERSION_ACQUISITION_MISMATCH");
  if (chain.evidenceVersionId !== version.evidenceVersionId) failures.push("CHAIN_VERSION_MISMATCH");
  if (!chain.complete || chain.missingElements.length > 0) failures.push("PROVENANCE_INCOMPLETE");
  return Object.freeze(failures);
}

export function validateGisSupersession(
  predecessor: GisEvidenceVersion,
  successor: GisEvidenceVersion,
  supersession: GisEvidenceSupersession,
  visited: readonly string[] = [],
): readonly string[] {
  const failures: string[] = [];
  if (supersession.predecessorEvidenceVersionId === supersession.successorEvidenceVersionId) failures.push("SUPERSESSION_SELF_REFERENCE");
  if (visited.includes(supersession.successorEvidenceVersionId)) failures.push("SUPERSESSION_CYCLE");
  if (predecessor.evidenceFamilyId !== successor.evidenceFamilyId || supersession.evidenceFamilyId !== predecessor.evidenceFamilyId) failures.push("SUPERSESSION_FAMILY_MISMATCH");
  if (predecessor.subject.subjectIdentity !== successor.subject.subjectIdentity || supersession.subjectIdentity !== predecessor.subject.subjectIdentity) failures.push("SUPERSESSION_SUBJECT_MISMATCH");
  if (predecessor.domainId !== successor.domainId || supersession.domainId !== predecessor.domainId) failures.push("SUPERSESSION_DOMAIN_MISMATCH");
  return Object.freeze(failures);
}

export function validateGisConflictPreserved(conflict: GisEvidenceConflict): readonly string[] {
  const failures: string[] = [];
  if (conflict.evidenceVersionIds.length < 2) failures.push("CONFLICT_REQUIRES_MULTIPLE_EVIDENCE_VERSIONS");
  if (conflict.resolutionStatus !== "UNRESOLVED" && conflict.resolutionStatus !== "GOVERNED_RESOLUTION_REQUIRED") failures.push("CONFLICT_AUTO_RESOLVED");
  if (conflict.resolutionAuthority || conflict.resolutionExplanation) failures.push("CONFLICT_HAS_UNAUTHORIZED_RESOLUTION");
  if (conflict.internalOnly !== true) failures.push("CONFLICT_MUST_BE_INTERNAL_ONLY");
  return Object.freeze(failures);
}

export function validateGisObservationLineage(lineage: GisEvidenceObservationLineage, versions: readonly GisEvidenceVersion[]): readonly string[] {
  const failures: string[] = [];
  const versionIds = new Set(versions.map((version) => version.evidenceVersionId));
  if (lineage.completenessState !== "COMPLETE") failures.push("LINEAGE_INCOMPLETE");
  if (lineage.evidenceVersionIds.length === 0) failures.push("LINEAGE_REQUIRES_EVIDENCE_VERSION");
  for (const id of lineage.evidenceVersionIds) {
    if (!versionIds.has(id)) failures.push("LINEAGE_UNKNOWN_EVIDENCE_VERSION");
  }
  if (!lineage.transformationIdentity || !lineage.transformationVersion || !lineage.lineageFingerprint) failures.push("LINEAGE_TRANSFORMATION_REQUIRED");
  if (versions.some((version) => version.invalidated || version.status === "INVALIDATED")) failures.push("INVALIDATED_EVIDENCE_CANNOT_SUPPORT_OBSERVATION");
  return Object.freeze(failures);
}

export function evaluateGisEvidenceFreshness(version: GisEvidenceVersion, referenceTime: string): GisEvidenceVersion["freshness"] {
  const expiration = version.effectiveInterval.effectiveEnd;
  if (!expiration) return version.freshness === "UNKNOWN" ? "UNKNOWN" : version.freshness;
  if (expiration < referenceTime) return "EXPIRED";
  return "CURRENT";
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/evidenceValidation.ts
