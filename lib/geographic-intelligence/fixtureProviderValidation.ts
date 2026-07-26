import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import { validateGisEvidenceVersion, validateGisProvenanceCompleteness } from "./evidenceValidation.js";
import {
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
  type GisSprint4AdapterFailure,
  type GisSprint4AdapterSuccess,
  type GisSprint4SyntheticFixturePayload,
} from "./fixtureProviderAdapterContract.js";
import {
  GIS_SPRINT_4_SUPPORTED_DOMAIN,
  GIS_SPRINT_4_SUPPORTED_SUBJECT,
  sprint4ChecksumForPayload,
} from "./fixtureProviderNormalization.js";

export function validateSprint4FixturePayload(payload: Partial<GisSprint4SyntheticFixturePayload>): GisSprint4AdapterFailure["classification"] | null {
  if (payload.fixtureOnly !== true) return "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED";
  if (payload.fixtureSchemaVersion !== GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION) return "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA";
  if (payload.syntheticProviderId !== GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID) return "FAILED_CLOSED_PROVIDER_ID_MISMATCH";
  if (!hasRequiredPayloadShape(payload)) return "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT";
  if (payload.providerMetadata?.incompleteProvenance === "true") return "FAILED_CLOSED_INCOMPLETE_PROVENANCE";
  if (Object.values(payload.requestedActivation ?? GIS_FAIL_CLOSED_ACTIVATION).some((value) => value !== false)) return "FAILED_CLOSED_ACTIVATION_DRIFT";
  if (payload.effectiveStart > payload.effectiveEnd || payload.acquisitionTime < payload.publicationTime) return "FAILED_CLOSED_INVALID_TEMPORAL_RANGE";
  if (payload.licensingClassification === "UNKNOWN") return "FAILED_CLOSED_LICENSING_UNKNOWN";
  if (payload.permittedUse !== "INTERNAL_RESEARCH_ONLY") return "FAILED_CLOSED_PERMITTED_USE_INSUFFICIENT";
  if (payload.geographicSubjectKey !== GIS_SPRINT_4_SUPPORTED_SUBJECT.subjectIdentity) return "FAILED_CLOSED_SUBJECT_MISMATCH";
  if (payload.intelligenceDomainKey !== GIS_SPRINT_4_SUPPORTED_DOMAIN) return "FAILED_CLOSED_DOMAIN_MISMATCH";
  if (payload.fixtureContentChecksum !== sprint4ChecksumForPayload(payload)) return "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH";
  return null;
}

export function validateSprint4AdapterSuccess(result: GisSprint4AdapterSuccess): readonly string[] {
  const failures: string[] = [];
  if (result.normalizedCandidate.adapterId !== GIS_SPRINT_4_ADAPTER_ID) failures.push("ADAPTER_ID_MISMATCH");
  if (result.normalizedCandidate.adapterVersion !== GIS_SPRINT_4_ADAPTER_VERSION) failures.push("ADAPTER_VERSION_MISMATCH");
  if (result.normalizedCandidate.syntheticProviderId !== GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID) failures.push("PROVIDER_ID_MISMATCH");
  if (result.sourceIdentity.sourceLocator !== null) failures.push("SOURCE_LOCATOR_MUST_BE_NULL_FOR_FIXTURE");
  if (result.evidenceVersion.customerDisplayAuthorized !== false) failures.push("CUSTOMER_DISPLAY_MUST_BE_FALSE");
  if (result.evidenceVersion.redistributionAuthorized !== false) failures.push("REDISTRIBUTION_MUST_BE_FALSE");
  if (result.evidenceVersion.runtimeActivationAuthorized !== false) failures.push("RUNTIME_MUST_BE_FALSE");
  if (Object.values(result.acquisitionRecord.authorizationState).some((value) => value !== false)) failures.push("ACQUISITION_AUTHORIZATION_MUST_BE_FALSE");
  if (result.observationCandidate.customerVisible !== false || result.observationCandidate.runtimeEnabled !== false) failures.push("OBSERVATION_MUST_BE_INTERNAL_ONLY");
  failures.push(...validateGisEvidenceVersion(result.evidenceVersion));
  failures.push(...validateGisProvenanceCompleteness(result.providerIdentity, result.sourceIdentity, result.acquisitionRecord, result.evidenceVersion, result.provenanceChain));
  return Object.freeze(failures);
}

function hasRequiredPayloadShape(payload: Partial<GisSprint4SyntheticFixturePayload>): payload is GisSprint4SyntheticFixturePayload {
  return [
    payload.fixtureRecordId,
    payload.syntheticDatasetId,
    payload.sourceRecordKey,
    payload.geographicSubjectKey,
    payload.intelligenceDomainKey,
    payload.assertionKey,
    payload.unit,
    payload.reportedTime,
    payload.effectiveStart,
    payload.effectiveEnd,
    payload.publicationTime,
    payload.acquisitionTime,
    payload.licensingClassification,
    payload.permittedUse,
    payload.sourceAuthority,
    payload.providerPayloadVersion,
    payload.fixtureContentChecksum,
  ].every((value) => typeof value === "string" && value.length > 0)
    && ["string", "number", "boolean"].includes(typeof payload.value);
}
