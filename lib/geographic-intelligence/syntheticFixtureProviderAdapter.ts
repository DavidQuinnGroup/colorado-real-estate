import { stableGisEvidenceFingerprint } from "./evidenceFingerprint.js";
import {
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  type GisSprint4AdapterFailure,
  type GisSprint4AdapterResult,
  type GisSprint4AdapterSuccess,
  type GisSprint4SyntheticFixturePayload,
} from "./fixtureProviderAdapterContract.js";
import {
  formSprint4AcquisitionRecord,
  formSprint4EvidenceVersion,
  formSprint4ObservationCandidate,
  formSprint4ProviderIdentity,
  formSprint4ProvenanceChain,
  formSprint4SourceIdentity,
  normalizeSprint4FixtureEvidence,
  parseSprint4SyntheticPayload,
} from "./fixtureProviderNormalization.js";
import { validateSprint4FixturePayload } from "./fixtureProviderValidation.js";

export function runGisSprint4SyntheticFixtureProviderAdapter(
  payload: Partial<GisSprint4SyntheticFixturePayload>,
  prior?: GisSprint4AdapterSuccess,
): GisSprint4AdapterResult {
  const validationFailure = validateSprint4FixturePayload(payload);
  if (validationFailure) return failure(payload, validationFailure);

  const rawPayload = payload as GisSprint4SyntheticFixturePayload;
  const parsedProviderRecord = parseSprint4SyntheticPayload(rawPayload);
  const normalizedCandidate = normalizeSprint4FixtureEvidence(rawPayload, parsedProviderRecord);
  const providerIdentity = formSprint4ProviderIdentity();
  const sourceIdentity = formSprint4SourceIdentity(rawPayload);
  const changedFromPrior = prior
    && prior.sourceIdentity.sourceId === sourceIdentity.sourceId
    && prior.evidenceVersion.subject.subjectIdentity === normalizedCandidate.subject.subjectIdentity
    && prior.evidenceVersion.domainId === normalizedCandidate.domainId
    && prior.evidenceVersion.assertionOrMetricId === normalizedCandidate.assertionOrMetricId
    && prior.evidenceVersion.contentFingerprint !== normalizedCandidate.normalizedContentFingerprint;
  const duplicateOfPrior = prior?.evidenceVersion.contentFingerprint === normalizedCandidate.normalizedContentFingerprint;
  const acquisitionRecord = formSprint4AcquisitionRecord(
    rawPayload,
    sourceIdentity,
    normalizedCandidate.normalizedContentFingerprint,
    duplicateOfPrior ? "DUPLICATE_CONTENT" : changedFromPrior ? "CHANGED_CONTENT" : "FIXTURE_ACQUIRED",
  );
  const predecessorEvidenceVersionId = changedFromPrior ? prior.evidenceVersion.evidenceVersionId : null;
  const evidenceVersion = formSprint4EvidenceVersion(rawPayload, sourceIdentity, acquisitionRecord, normalizedCandidate, predecessorEvidenceVersionId);
  const observationCandidate = formSprint4ObservationCandidate(evidenceVersion);
  const provenanceChain = formSprint4ProvenanceChain(sourceIdentity, acquisitionRecord, evidenceVersion, observationCandidate);
  const classification = duplicateOfPrior
    ? "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE"
    : changedFromPrior
      ? "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED"
      : "NORMALIZED_FIXTURE_EVIDENCE_CREATED";

  const result = {
    ok: true,
    classification,
    rawPayload,
    parsedProviderRecord,
    normalizedCandidate,
    providerIdentity,
    sourceIdentity,
    acquisitionRecord,
    evidenceFamilyId: evidenceVersion.evidenceFamilyId,
    evidenceVersion,
    provenanceChain,
    observationCandidate,
    predecessorEvidenceVersionId,
    adapterResultFingerprint: "",
  } satisfies Omit<GisSprint4AdapterSuccess, "adapterResultFingerprint"> & { adapterResultFingerprint: string };

  return Object.freeze({
    ...result,
    adapterResultFingerprint: stableGisEvidenceFingerprint({
      classification: result.classification,
      evidenceFamilyId: result.evidenceFamilyId,
      evidenceVersionId: result.evidenceVersion.evidenceVersionId,
      provenanceChainId: result.provenanceChain.provenanceChainId,
      observationId: result.observationCandidate.observationId,
    }),
  });
}

function failure(
  payload: Partial<GisSprint4SyntheticFixturePayload>,
  classification: GisSprint4AdapterFailure["classification"],
): GisSprint4AdapterFailure {
  const rejectionReason = classification;
  return Object.freeze({
    ok: false,
    classification,
    rejectionReason,
    adapterId: GIS_SPRINT_4_ADAPTER_ID,
    adapterVersion: GIS_SPRINT_4_ADAPTER_VERSION,
    syntheticProviderId: typeof payload.syntheticProviderId === "string" ? payload.syntheticProviderId : null,
    fixtureRecordId: typeof payload.fixtureRecordId === "string" ? payload.fixtureRecordId : null,
    deterministicRejectionFingerprint: stableGisEvidenceFingerprint({
      classification,
      fixtureRecordId: payload.fixtureRecordId ?? null,
      syntheticProviderId: payload.syntheticProviderId ?? null,
    }),
  });
}
