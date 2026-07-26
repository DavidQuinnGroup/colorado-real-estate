import { GIS_FAIL_CLOSED_ACTIVATION } from "../activationContract.js";
import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import {
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  GIS_1_0_SPRINT_4_CERTIFICATION,
  GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
  type GisSprint4AdapterSuccess,
  type GisSprint4ScenarioResult,
  type GisSprint4SyntheticFixturePayload,
} from "../fixtureProviderAdapterContract.js";
import {
  GIS_SPRINT_4_SUPPORTED_DOMAIN,
  GIS_SPRINT_4_SUPPORTED_SUBJECT,
  sprint4ChecksumForPayload,
} from "../fixtureProviderNormalization.js";
import { validateSprint4AdapterSuccess } from "../fixtureProviderValidation.js";
import { runGisSprint4SyntheticFixtureProviderAdapter } from "../syntheticFixtureProviderAdapter.js";

export const GIS_SPRINT_4_SYNTHETIC_DATASET_ID = "GIS_SPRINT_4_SYNTHETIC_FIXTURE_DATASET";
export const GIS_SPRINT_4_FIXED_REPORTED_TIME = "2026-07-26T12:00:00.000Z";
export const GIS_SPRINT_4_FIXED_PUBLICATION_TIME = "2026-07-26T12:05:00.000Z";
export const GIS_SPRINT_4_FIXED_ACQUISITION_TIME = "2026-07-26T12:10:00.000Z";
export const GIS_SPRINT_4_BOUNDARY_NOTE = "FIXTURE_PROOF_IS_NOT_PROVIDER_APPROVAL";

export const GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD = withChecksum({
  fixtureOnly: true,
  fixtureRecordId: "GIS-S4-FIXTURE-ALPHA-001",
  fixtureSchemaVersion: GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  syntheticProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
  syntheticDatasetId: GIS_SPRINT_4_SYNTHETIC_DATASET_ID,
  sourceRecordKey: "synthetic-source-record-alpha-001",
  geographicSubjectKey: GIS_SPRINT_4_SUPPORTED_SUBJECT.subjectIdentity,
  intelligenceDomainKey: GIS_SPRINT_4_SUPPORTED_DOMAIN,
  assertionKey: "synthetic_environmental_fixture_index",
  value: 42,
  unit: "fixture-index-points",
  reportedTime: GIS_SPRINT_4_FIXED_REPORTED_TIME,
  effectiveStart: "2026-07-01T00:00:00.000Z",
  effectiveEnd: "2026-07-31T23:59:59.000Z",
  publicationTime: GIS_SPRINT_4_FIXED_PUBLICATION_TIME,
  acquisitionTime: GIS_SPRINT_4_FIXED_ACQUISITION_TIME,
  licensingClassification: "CONTRACTUAL_INTERNAL_USE",
  permittedUse: "INTERNAL_RESEARCH_ONLY",
  sourceAuthority: "INFORMAL",
  providerPayloadVersion: "synthetic-payload-v1",
  fixtureContentChecksum: "",
  providerMetadata: Object.freeze({
    syntheticFixtureOnly: "true",
    proprietarySchema: "false",
  }),
  requestedActivation: GIS_FAIL_CLOSED_ACTIVATION,
});

export const GIS_SPRINT_4_CHANGED_FIXTURE_PAYLOAD = withChecksum({
  ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD,
  value: 43,
  providerPayloadVersion: "synthetic-payload-v2",
  fixtureContentChecksum: "",
});

export function certifyGisSprint4FixtureProviderScenarios(): Readonly<Record<string, GisSprint4ScenarioResult>> {
  const scenarioA = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD));
  const scenarioB = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, scenarioA));
  const scenarioC = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_CHANGED_FIXTURE_PAYLOAD, scenarioA));
  const scenarioD = runGisSprint4SyntheticFixtureProviderAdapter({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, assertionKey: "" });
  const scenarioE = runGisSprint4SyntheticFixtureProviderAdapter({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, fixtureSchemaVersion: "UNSUPPORTED_SYNTHETIC_SCHEMA" });
  const scenarioF = runGisSprint4SyntheticFixtureProviderAdapter({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, syntheticProviderId: "WRONG_SYNTHETIC_PROVIDER" });
  const scenarioG = runGisSprint4SyntheticFixtureProviderAdapter({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, fixtureOnly: false });
  const scenarioH = runGisSprint4SyntheticFixtureProviderAdapter(withChecksum({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, licensingClassification: "UNKNOWN", fixtureContentChecksum: "" }));
  const scenarioI = runGisSprint4SyntheticFixtureProviderAdapter(withChecksum({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, geographicSubjectKey: "SYNTHETIC_MUNICIPALITY_BETA", fixtureContentChecksum: "" }));
  const scenarioJ = runGisSprint4SyntheticFixtureProviderAdapter(withChecksum({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, intelligenceDomainKey: "MARKET_INTELLIGENCE", fixtureContentChecksum: "" }));
  const scenarioK = runGisSprint4SyntheticFixtureProviderAdapter(withChecksum({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, effectiveStart: "2026-08-01T00:00:00.000Z", fixtureContentChecksum: "" }));
  const scenarioL = runGisSprint4SyntheticFixtureProviderAdapter({ ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, fixtureContentChecksum: "mismatch" });
  const scenarioM = runGisSprint4SyntheticFixtureProviderAdapter({
    ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD,
    providerMetadata: Object.freeze({ incompleteProvenance: "true" }),
  });
  const scenarioN = runGisSprint4SyntheticFixtureProviderAdapter({
    ...GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD,
    requestedActivation: {
      ...GIS_FAIL_CLOSED_ACTIVATION,
      ["runtimeAuthorized"]: true,
    },
  });

  const successFailures = [scenarioA, scenarioB, scenarioC].flatMap((result) => validateSprint4AdapterSuccess(result));
  const allScenariosValid = [
    scenarioA.classification === "NORMALIZED_FIXTURE_EVIDENCE_CREATED",
    scenarioB.classification === "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE",
    scenarioB.evidenceFamilyId === scenarioA.evidenceFamilyId,
    scenarioB.evidenceVersion.evidenceVersionId === scenarioA.evidenceVersion.evidenceVersionId,
    scenarioB.adapterResultFingerprint === scenarioB.adapterResultFingerprint,
    scenarioC.classification === "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED",
    scenarioC.evidenceFamilyId === scenarioA.evidenceFamilyId,
    scenarioC.evidenceVersion.evidenceVersionId !== scenarioA.evidenceVersion.evidenceVersionId,
    scenarioC.predecessorEvidenceVersionId === scenarioA.evidenceVersion.evidenceVersionId,
    scenarioD.classification === "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT",
    scenarioE.classification === "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA",
    scenarioF.classification === "FAILED_CLOSED_PROVIDER_ID_MISMATCH",
    scenarioG.classification === "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED",
    scenarioH.classification === "FAILED_CLOSED_LICENSING_UNKNOWN",
    scenarioI.classification === "FAILED_CLOSED_SUBJECT_MISMATCH",
    scenarioJ.classification === "FAILED_CLOSED_DOMAIN_MISMATCH",
    scenarioK.classification === "FAILED_CLOSED_INVALID_TEMPORAL_RANGE",
    scenarioL.classification === "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH",
    scenarioM.classification === "FAILED_CLOSED_INCOMPLETE_PROVENANCE",
    scenarioN.classification === "FAILED_CLOSED_ACTIVATION_DRIFT",
    successFailures.length === 0,
    scenarioA.normalizedCandidate.adapterId === GIS_SPRINT_4_ADAPTER_ID,
    scenarioA.normalizedCandidate.adapterVersion === GIS_SPRINT_4_ADAPTER_VERSION,
    scenarioA.providerIdentity.providerId === GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
    Object.values(scenarioA.acquisitionRecord.authorizationState).every((value) => value === false),
    GIS_1_0_SPRINT_4_CERTIFICATION === "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED",
  ].every(Boolean);
  if (!allScenariosValid) throw new Error("GIS Sprint 4 synthetic fixture provider adapter scenario certification failed.");

  return Object.freeze({
    scenarioA: "NORMALIZED_FIXTURE_EVIDENCE_CREATED",
    scenarioB: "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE",
    scenarioC: "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED",
    scenarioD: "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT",
    scenarioE: "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA",
    scenarioF: "FAILED_CLOSED_PROVIDER_ID_MISMATCH",
    scenarioG: "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED",
    scenarioH: "FAILED_CLOSED_LICENSING_UNKNOWN",
    scenarioI: "FAILED_CLOSED_SUBJECT_MISMATCH",
    scenarioJ: "FAILED_CLOSED_DOMAIN_MISMATCH",
    scenarioK: "FAILED_CLOSED_INVALID_TEMPORAL_RANGE",
    scenarioL: "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH",
    scenarioM: "FAILED_CLOSED_INCOMPLETE_PROVENANCE",
    scenarioN: "FAILED_CLOSED_ACTIVATION_DRIFT",
  });
}

export function gisSprint4FixtureProviderCertificationArtifacts(): Readonly<{
  baseline: GisSprint4AdapterSuccess;
  duplicate: GisSprint4AdapterSuccess;
  changed: GisSprint4AdapterSuccess;
  outputFingerprint: string;
}> {
  const baseline = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD));
  const duplicate = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD, baseline));
  const changed = requireSuccess(runGisSprint4SyntheticFixtureProviderAdapter(GIS_SPRINT_4_CHANGED_FIXTURE_PAYLOAD, baseline));
  return Object.freeze({
    baseline,
    duplicate,
    changed,
    outputFingerprint: stableGisEvidenceFingerprint({
      scenarios: certifyGisSprint4FixtureProviderScenarios(),
      baselineEvidenceFamilyId: baseline.evidenceFamilyId,
      baselineEvidenceVersionId: baseline.evidenceVersion.evidenceVersionId,
      changedEvidenceVersionId: changed.evidenceVersion.evidenceVersionId,
      duplicateEvidenceVersionId: duplicate.evidenceVersion.evidenceVersionId,
      baselineFingerprint: baseline.adapterResultFingerprint,
      duplicateFingerprint: duplicate.adapterResultFingerprint,
      changedFingerprint: changed.adapterResultFingerprint,
    }),
  });
}

function withChecksum(payload: GisSprint4SyntheticFixturePayload): GisSprint4SyntheticFixturePayload {
  const candidate = Object.freeze({
    ...payload,
    fixtureContentChecksum: "",
  });
  return Object.freeze({
    ...candidate,
    fixtureContentChecksum: sprint4ChecksumForPayload(candidate),
  });
}

function requireSuccess(result: ReturnType<typeof runGisSprint4SyntheticFixtureProviderAdapter>): GisSprint4AdapterSuccess {
  if (!result.ok) throw new Error(`Expected GIS Sprint 4 adapter success, received ${result.classification}`);
  return result;
}
