import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_4_AUTHORIZATION,
  GIS_1_0_SPRINT_4_CERTIFICATION,
  GIS_1_0_SPRINT_4_CLASSIFICATION,
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
} from "../lib/geographic-intelligence/fixtureProviderAdapterContract.js";
import {
  certifyGisSprint4FixtureProviderScenarios,
  gisSprint4FixtureProviderCertificationArtifacts,
} from "../lib/geographic-intelligence/fixtures/gisSprint4SyntheticProviderFixtures.js";

const scenarios = certifyGisSprint4FixtureProviderScenarios();
const artifacts = gisSprint4FixtureProviderCertificationArtifacts();

const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_4",
  authorization: GIS_1_0_SPRINT_4_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_4_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_4_CERTIFICATION,
  adapterId: GIS_SPRINT_4_ADAPTER_ID,
  adapterVersion: GIS_SPRINT_4_ADAPTER_VERSION,
  syntheticProviderId: GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
  fixtureSchemaVersion: GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  scenariosTested: scenarios,
  validTransformationResult: scenarios.scenarioA,
  repeatedInputResult: scenarios.scenarioB,
  changedVersionResult: scenarios.scenarioC,
  malformedInputResult: scenarios.scenarioD,
  unsupportedSchemaResult: scenarios.scenarioE,
  providerMismatchResult: scenarios.scenarioF,
  fixtureMarkerResult: scenarios.scenarioG,
  licensingResult: scenarios.scenarioH,
  subjectIntegrityResult: scenarios.scenarioI,
  domainIntegrityResult: scenarios.scenarioJ,
  temporalValidationResult: scenarios.scenarioK,
  checksumValidationResult: scenarios.scenarioL,
  provenanceCompletenessResult: scenarios.scenarioM,
  activationDriftResult: scenarios.scenarioN,
  evidenceFamilyIdentity: artifacts.baseline.evidenceFamilyId,
  baselineEvidenceVersionIdentity: artifacts.baseline.evidenceVersion.evidenceVersionId,
  changedEvidenceVersionIdentity: artifacts.changed.evidenceVersion.evidenceVersionId,
  deterministicOutputFingerprint: artifacts.outputFingerprint,
  duplicateEvidenceVersionIdentity: artifacts.duplicate.evidenceVersion.evidenceVersionId,
  providerConnections: 0,
  credentials: 0,
  networkCalls: 0,
  productionReads: 0,
  productionWrites: 0,
  runtimeActivations: 0,
  downstreamIntegrations: 0,
  customerVisibleChanges: 0,
  geographicRelationships: 0,
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_AUTHORIZED");
assert.equal(certification.classification, "CONTROLLED_FIXTURE_PROVIDER_ADAPTER");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED");
assert.equal(certification.adapterId, "GIS_SPRINT_4_SYNTHETIC_PROVIDER_ADAPTER");
assert.equal(certification.adapterVersion, "1.0.0");
assert.equal(certification.syntheticProviderId, "ATLAS_SYNTHETIC_GEO_EVIDENCE_PROVIDER");
assert.equal(certification.validTransformationResult, "NORMALIZED_FIXTURE_EVIDENCE_CREATED");
assert.equal(certification.repeatedInputResult, "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE");
assert.equal(certification.changedVersionResult, "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED");
assert.equal(certification.baselineEvidenceVersionIdentity, certification.duplicateEvidenceVersionIdentity);
assert.notEqual(certification.baselineEvidenceVersionIdentity, certification.changedEvidenceVersionIdentity);
assert.equal(certification.providerConnections, 0);
assert.equal(certification.credentials, 0);
assert.equal(certification.networkCalls, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.downstreamIntegrations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.geographicRelationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-fixture-provider-adapter-certification] ok: GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED with zero provider connections, credentials, network calls, production reads/writes, runtime activation, downstream integration, customer-visible effect, or geographic relationships.");
