import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import { type GeographicIntelligenceDomainId, type GeographicIntelligenceSubject } from "./domainContract.js";
import { stableGisEvidenceFingerprint } from "./evidenceFingerprint.js";
import {
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  GIS_SPRINT_4_NORMALIZATION_VERSION,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_NAME,
  type GisSprint4NormalizedEvidenceCandidate,
  type GisSprint4ObservationCandidate,
  type GisSprint4ParsedProviderRecord,
  type GisSprint4SyntheticFixturePayload,
} from "./fixtureProviderAdapterContract.js";
import {
  type GisEvidenceAcquisitionRecord,
  type GisEvidenceProviderIdentity,
  type GisEvidenceSourceIdentity,
  type GisEvidenceVersion,
  type GisProvenanceChain,
} from "./evidenceProvenanceContract.js";

export const GIS_SPRINT_4_SUPPORTED_SUBJECT: GeographicIntelligenceSubject = Object.freeze({
  subjectIdentity: "SYNTHETIC_MUNICIPALITY_ALPHA",
  subjectSelectionContract: "SYNTHETIC_FIXTURE_SUBJECT",
  objectType: "SYNTHETIC",
  canonicalName: "Synthetic Municipality Alpha",
  canonicalSlug: "synthetic-municipality-alpha",
  lifecycle: "SYNTHETIC_FIXTURE",
  visibility: "INTERNAL_ONLY",
  relationshipCount: 0,
  productionRuntimeRead: false,
});

export const GIS_SPRINT_4_SUPPORTED_DOMAIN: GeographicIntelligenceDomainId = "ENVIRONMENTAL_INTELLIGENCE";

export function sprint4ChecksumForPayload(payload: GisSprint4SyntheticFixturePayload): string {
  return stableGisEvidenceFingerprint(canonicalPayloadContent(payload));
}

export function parseSprint4SyntheticPayload(payload: GisSprint4SyntheticFixturePayload): GisSprint4ParsedProviderRecord {
  return Object.freeze({
    providerRecordIdentity: stableId("GIS-S4-PARSED", payload.syntheticProviderId, payload.syntheticDatasetId, payload.sourceRecordKey, payload.providerPayloadVersion),
    sourceRecordKey: payload.sourceRecordKey,
    subjectKey: payload.geographicSubjectKey,
    domainKey: payload.intelligenceDomainKey,
    assertionKey: payload.assertionKey,
    governedValue: payload.value,
    unit: payload.unit,
    temporal: Object.freeze({
      reportedTime: payload.reportedTime,
      publicationTime: payload.publicationTime,
      acquisitionTime: payload.acquisitionTime,
      effectiveStart: payload.effectiveStart,
      effectiveEnd: payload.effectiveEnd,
    }),
  });
}

export function normalizeSprint4FixtureEvidence(payload: GisSprint4SyntheticFixturePayload, parsed: GisSprint4ParsedProviderRecord): GisSprint4NormalizedEvidenceCandidate {
  const normalizedContent = Object.freeze({
    assertionOrMetricId: parsed.assertionKey,
    domainId: GIS_SPRINT_4_SUPPORTED_DOMAIN,
    subjectIdentity: GIS_SPRINT_4_SUPPORTED_SUBJECT.subjectIdentity,
    unit: parsed.unit,
    value: parsed.governedValue,
  });
  return Object.freeze({
    adapterId: GIS_SPRINT_4_ADAPTER_ID,
    adapterVersion: GIS_SPRINT_4_ADAPTER_VERSION,
    syntheticProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    fixtureSchemaVersion: GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
    normalizationVersion: GIS_SPRINT_4_NORMALIZATION_VERSION,
    subject: GIS_SPRINT_4_SUPPORTED_SUBJECT,
    domainId: GIS_SPRINT_4_SUPPORTED_DOMAIN,
    assertionOrMetricId: parsed.assertionKey,
    normalizedContent,
    normalizedContentFingerprint: stableGisEvidenceFingerprint(normalizedContent),
  });
}

export function formSprint4ProviderIdentity(): GisEvidenceProviderIdentity {
  return Object.freeze({
    providerId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    canonicalProviderName: GIS_SPRINT_4_SYNTHETIC_PROVIDER_NAME,
    providerType: "SYNTHETIC_FIXTURE",
    providerRole: "INTERNAL_SOURCE",
    originator: true,
    distributor: false,
    authorityClassification: "INFORMAL",
    jurisdiction: "SYNTHETIC_FIXTURE_ONLY",
    providerVersion: GIS_SPRINT_4_ADAPTER_VERSION,
  });
}

export function formSprint4SourceIdentity(payload: GisSprint4SyntheticFixturePayload): GisEvidenceSourceIdentity {
  return Object.freeze({
    sourceId: stableId("GIS-S4-SOURCE", payload.syntheticDatasetId, GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION),
    canonicalSourceName: "Synthetic Sprint 4 Fixture Dataset",
    sourceType: "SYNTHETIC_DATASET",
    datasetOrPublicationId: payload.syntheticDatasetId,
    publisherProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    originatingAuthorityProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    sourceVersion: payload.providerPayloadVersion,
    sourceLocator: null,
    jurisdiction: "SYNTHETIC_FIXTURE_ONLY",
    subjectCoverage: Object.freeze([GIS_SPRINT_4_SUPPORTED_SUBJECT.subjectIdentity]),
    domainCoverage: Object.freeze([GIS_SPRINT_4_SUPPORTED_DOMAIN]),
    updateCadence: "STATIC_FIXTURE",
  });
}

export function formSprint4AcquisitionRecord(
  payload: GisSprint4SyntheticFixturePayload,
  source: GisEvidenceSourceIdentity,
  contentFingerprint: string,
  result: "FIXTURE_ACQUIRED" | "DUPLICATE_CONTENT" | "CHANGED_CONTENT",
): GisEvidenceAcquisitionRecord {
  return Object.freeze({
    acquisitionId: stableId("GIS-S4-ACQUISITION", payload.fixtureRecordId, payload.acquisitionTime, contentFingerprint),
    sourceId: source.sourceId,
    providerId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    acquisitionMethod: "SYNTHETIC_FIXTURE",
    acquiredTime: payload.acquisitionTime,
    requestedLocatorOrIdentity: payload.sourceRecordKey,
    responseOrArtifactIdentity: payload.fixtureRecordId,
    acquisitionResult: result,
    normalizationStatus: "NORMALIZED",
    validationStatus: "VALIDATED",
    rejectionReason: null,
    contentFingerprint,
    authorizationState: GIS_FAIL_CLOSED_ACTIVATION,
  });
}

export function formSprint4EvidenceVersion(
  payload: GisSprint4SyntheticFixturePayload,
  source: GisEvidenceSourceIdentity,
  acquisition: GisEvidenceAcquisitionRecord,
  normalized: GisSprint4NormalizedEvidenceCandidate,
  predecessorEvidenceVersionId: string | null,
): GisEvidenceVersion {
  const evidenceFamilyId = sprint4EvidenceFamilyId(source.sourceId, normalized.subject.subjectIdentity, normalized.domainId, normalized.assertionOrMetricId);
  const evidenceVersionId = sprint4EvidenceVersionId(evidenceFamilyId, normalized.normalizedContentFingerprint);
  return Object.freeze({
    evidenceFamilyId,
    evidenceVersionId,
    versionSequence: normalized.normalizedContentFingerprint.slice(0, 12),
    subject: normalized.subject,
    domainId: normalized.domainId,
    assertionOrMetricId: normalized.assertionOrMetricId,
    contentFingerprint: normalized.normalizedContentFingerprint,
    normalizedContent: normalized.normalizedContent,
    schemaVersion: GIS_SPRINT_4_NORMALIZATION_VERSION,
    sourceVersion: source.sourceVersion,
    publicationTime: payload.publicationTime,
    observedTime: payload.reportedTime,
    effectiveInterval: Object.freeze({
      effectiveStart: payload.effectiveStart,
      effectiveEnd: payload.effectiveEnd,
    }),
    acquisitionId: acquisition.acquisitionId,
    status: "VALIDATED",
    licensingClassification: payload.licensingClassification,
    permittedUse: payload.permittedUse,
    quality: "VALIDATED",
    freshness: "CURRENT",
    authority: payload.sourceAuthority,
    confidence: "MODERATE",
    supersedesEvidenceVersionId: predecessorEvidenceVersionId,
    supersededByEvidenceVersionId: null,
    withdrawn: false,
    invalidated: false,
    internalOnly: true,
    customerDisplayAuthorized: false,
    redistributionAuthorized: false,
    runtimeActivationAuthorized: false,
  });
}

export function formSprint4ProvenanceChain(
  source: GisEvidenceSourceIdentity,
  acquisition: GisEvidenceAcquisitionRecord,
  version: GisEvidenceVersion,
  observation: GisSprint4ObservationCandidate,
): GisProvenanceChain {
  return Object.freeze({
    provenanceChainId: stableId("GIS-S4-PROVENANCE", source.sourceId, acquisition.acquisitionId, version.evidenceVersionId, observation.observationId),
    originatingAuthorityProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    publisherProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    distributorProviderId: null,
    sourceId: source.sourceId,
    acquisitionId: acquisition.acquisitionId,
    normalizationIdentity: `${GIS_SPRINT_4_ADAPTER_ID}:${GIS_SPRINT_4_ADAPTER_VERSION}:${GIS_SPRINT_4_NORMALIZATION_VERSION}`,
    evidenceVersionId: version.evidenceVersionId,
    observationId: observation.observationId,
    derivedIntelligenceId: null,
    complete: true,
    missingElements: Object.freeze([]),
  });
}

export function formSprint4ObservationCandidate(version: GisEvidenceVersion): GisSprint4ObservationCandidate {
  return Object.freeze({
    observationId: stableId("GIS-S4-OBSERVATION", version.evidenceVersionId, version.observedTime),
    subjectIdentity: version.subject.subjectIdentity,
    domainId: version.domainId,
    assertionOrMetricId: version.assertionOrMetricId,
    evidenceVersionId: version.evidenceVersionId,
    observedTime: version.observedTime,
    internalOnly: true,
    customerVisible: false,
    runtimeEnabled: false,
  });
}

export function sprint4EvidenceFamilyId(sourceId: string, subjectIdentity: string, domainId: string, assertionOrMetricId: string): string {
  return stableId("GIS-S4-EVIDENCE-FAMILY", sourceId, subjectIdentity, domainId, assertionOrMetricId);
}

export function sprint4EvidenceVersionId(evidenceFamilyId: string, contentFingerprint: string): string {
  return stableId("GIS-S4-EVIDENCE-VERSION", evidenceFamilyId, contentFingerprint);
}

function canonicalPayloadContent(payload: GisSprint4SyntheticFixturePayload): Readonly<Record<string, string | number | boolean>> {
  return Object.freeze({
    assertionKey: payload.assertionKey,
    effectiveEnd: payload.effectiveEnd,
    effectiveStart: payload.effectiveStart,
    fixtureRecordId: payload.fixtureRecordId,
    geographicSubjectKey: payload.geographicSubjectKey,
    intelligenceDomainKey: payload.intelligenceDomainKey,
    publicationTime: payload.publicationTime,
    reportedTime: payload.reportedTime,
    sourceRecordKey: payload.sourceRecordKey,
    syntheticDatasetId: payload.syntheticDatasetId,
    syntheticProviderId: payload.syntheticProviderId,
    unit: payload.unit,
    value: payload.value,
  });
}

function stableId(prefix: string, ...parts: readonly string[]): string {
  return `${prefix}-${stableGisEvidenceFingerprint(parts).slice(0, 24)}`;
}
