import { type GeographicIntelligenceActivationState, type GeographicIntelligencePermittedUse } from "./activationContract.js";
import { type GeographicIntelligenceDomainId, type GeographicIntelligenceSubject } from "./domainContract.js";
import {
  type GisEvidenceAcquisitionRecord,
  type GisEvidenceAuthorityClassification,
  type GisEvidenceLicensingClassification,
  type GisEvidenceProviderIdentity,
  type GisEvidenceSourceIdentity,
  type GisEvidenceVersion,
  type GisProvenanceChain,
} from "./evidenceProvenanceContract.js";

export const GIS_1_0_SPRINT_4_AUTHORIZATION = "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_AUTHORIZED";
export const GIS_1_0_SPRINT_4_CLASSIFICATION = "CONTROLLED_FIXTURE_PROVIDER_ADAPTER";
export const GIS_1_0_SPRINT_4_CERTIFICATION = "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED";
export const GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID = "ATLAS_SYNTHETIC_GEO_EVIDENCE_PROVIDER";
export const GIS_SPRINT_4_SYNTHETIC_PROVIDER_NAME = "Atlas Synthetic Geographic Evidence Provider";
export const GIS_SPRINT_4_ADAPTER_ID = "GIS_SPRINT_4_SYNTHETIC_PROVIDER_ADAPTER";
export const GIS_SPRINT_4_ADAPTER_VERSION = "1.0.0";
export const GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION = "GIS_SPRINT_4_SYNTHETIC_FIXTURE_SCHEMA_V1";
export const GIS_SPRINT_4_NORMALIZATION_VERSION = "GIS_SPRINT_4_NORMALIZATION_V1";

export type GisSprint4FixtureAdapterResultClassification =
  | "NORMALIZED_FIXTURE_EVIDENCE_CREATED"
  | "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE"
  | "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED"
  | "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT"
  | "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA"
  | "FAILED_CLOSED_PROVIDER_ID_MISMATCH"
  | "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED"
  | "FAILED_CLOSED_INCOMPLETE_PROVENANCE"
  | "FAILED_CLOSED_LICENSING_UNKNOWN"
  | "FAILED_CLOSED_PERMITTED_USE_INSUFFICIENT"
  | "FAILED_CLOSED_SUBJECT_MISMATCH"
  | "FAILED_CLOSED_DOMAIN_MISMATCH"
  | "FAILED_CLOSED_INVALID_TEMPORAL_RANGE"
  | "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH"
  | "FAILED_CLOSED_ACTIVATION_DRIFT";

export type GisSprint4SyntheticFixturePayload = Readonly<{
  fixtureOnly: boolean;
  fixtureRecordId: string;
  fixtureSchemaVersion: string;
  syntheticProviderId: string;
  syntheticDatasetId: string;
  sourceRecordKey: string;
  geographicSubjectKey: string;
  intelligenceDomainKey: string;
  assertionKey: string;
  value: string | number | boolean;
  unit: string;
  reportedTime: string;
  effectiveStart: string;
  effectiveEnd: string;
  publicationTime: string;
  acquisitionTime: string;
  licensingClassification: GisEvidenceLicensingClassification;
  permittedUse: GeographicIntelligencePermittedUse;
  sourceAuthority: GisEvidenceAuthorityClassification;
  providerPayloadVersion: string;
  fixtureContentChecksum: string;
  providerMetadata?: Readonly<Record<string, string>>;
  requestedActivation?: GeographicIntelligenceActivationState;
}>;

export type GisSprint4ParsedProviderRecord = Readonly<{
  providerRecordIdentity: string;
  sourceRecordKey: string;
  subjectKey: string;
  domainKey: string;
  assertionKey: string;
  governedValue: string | number | boolean;
  unit: string;
  temporal: Readonly<{
    reportedTime: string;
    publicationTime: string;
    acquisitionTime: string;
    effectiveStart: string;
    effectiveEnd: string;
  }>;
}>;

export type GisSprint4NormalizedEvidenceCandidate = Readonly<{
  adapterId: string;
  adapterVersion: string;
  syntheticProviderId: string;
  fixtureSchemaVersion: string;
  normalizationVersion: string;
  subject: GeographicIntelligenceSubject;
  domainId: GeographicIntelligenceDomainId;
  assertionOrMetricId: string;
  normalizedContent: Readonly<Record<string, string | number | boolean | null>>;
  normalizedContentFingerprint: string;
}>;

export type GisSprint4ObservationCandidate = Readonly<{
  observationId: string;
  subjectIdentity: string;
  domainId: GeographicIntelligenceDomainId;
  assertionOrMetricId: string;
  evidenceVersionId: string;
  observedTime: string;
  internalOnly: true;
  customerVisible: false;
  runtimeEnabled: false;
}>;

export type GisSprint4AdapterSuccess = Readonly<{
  ok: true;
  classification: Exclude<GisSprint4FixtureAdapterResultClassification, `FAILED_CLOSED_${string}`>;
  rawPayload: GisSprint4SyntheticFixturePayload;
  parsedProviderRecord: GisSprint4ParsedProviderRecord;
  normalizedCandidate: GisSprint4NormalizedEvidenceCandidate;
  providerIdentity: GisEvidenceProviderIdentity;
  sourceIdentity: GisEvidenceSourceIdentity;
  acquisitionRecord: GisEvidenceAcquisitionRecord;
  evidenceFamilyId: string;
  evidenceVersion: GisEvidenceVersion;
  provenanceChain: GisProvenanceChain;
  observationCandidate: GisSprint4ObservationCandidate;
  predecessorEvidenceVersionId: string | null;
  adapterResultFingerprint: string;
}>;

export type GisSprint4AdapterFailure = Readonly<{
  ok: false;
  classification: Extract<GisSprint4FixtureAdapterResultClassification, `FAILED_CLOSED_${string}`>;
  rejectionReason: string;
  adapterId: typeof GIS_SPRINT_4_ADAPTER_ID;
  adapterVersion: typeof GIS_SPRINT_4_ADAPTER_VERSION;
  syntheticProviderId: string | null;
  fixtureRecordId: string | null;
  deterministicRejectionFingerprint: string;
}>;

export type GisSprint4AdapterResult = GisSprint4AdapterSuccess | GisSprint4AdapterFailure;

export type GisSprint4ScenarioResult =
  | "NORMALIZED_FIXTURE_EVIDENCE_CREATED"
  | "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE"
  | "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED"
  | "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT"
  | "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA"
  | "FAILED_CLOSED_PROVIDER_ID_MISMATCH"
  | "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED"
  | "FAILED_CLOSED_LICENSING_UNKNOWN"
  | "FAILED_CLOSED_SUBJECT_MISMATCH"
  | "FAILED_CLOSED_DOMAIN_MISMATCH"
  | "FAILED_CLOSED_INVALID_TEMPORAL_RANGE"
  | "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH"
  | "FAILED_CLOSED_INCOMPLETE_PROVENANCE"
  | "FAILED_CLOSED_ACTIVATION_DRIFT";
