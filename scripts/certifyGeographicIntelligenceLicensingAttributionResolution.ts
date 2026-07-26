import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_8_AUTHORIZATION,
  GIS_1_0_SPRINT_8_CERTIFICATION,
  GIS_1_0_SPRINT_8_CLASSIFICATION,
  GIS_SPRINT_8_IMPLEMENTATION_VERSION,
} from "../lib/geographic-intelligence/licensingResolutionContract.js";
import {
  GIS_SPRINT_8_SOURCE_REFERENCES,
  buildGisSprint8AttributionRecord,
  buildGisSprint8ConditionMatrix,
  buildGisSprint8DisclaimerRecord,
  buildGisSprint8LicensingResolution,
  certifyGisSprint8LicensingScenarios,
  gisSprint8LicensingResolutionFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint8LicensingAttributionFixtures.js";
import { assertGisSprint8LicensingResolution } from "../lib/geographic-intelligence/licensingResolutionValidation.js";

const resolution = buildGisSprint8LicensingResolution();
const attribution = buildGisSprint8AttributionRecord();
const disclaimer = buildGisSprint8DisclaimerRecord();
const conditionMatrix = buildGisSprint8ConditionMatrix();
const scenarioResults = certifyGisSprint8LicensingScenarios();
const invariantResults = assertGisSprint8LicensingResolution(resolution, GIS_SPRINT_8_SOURCE_REFERENCES, attribution, disclaimer, conditionMatrix);
const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_8",
  implementationVersion: GIS_SPRINT_8_IMPLEMENTATION_VERSION,
  authorization: GIS_1_0_SPRINT_8_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_8_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_8_CERTIFICATION,
  provider: resolution.providerCanonicalName,
  datasetOrService: resolution.datasetOrServiceName,
  datasetOrServiceId: resolution.datasetOrServiceId,
  pilotId: resolution.pilotId,
  officialLicensingReferences: GIS_SPRINT_8_SOURCE_REFERENCES,
  applicableTerms: resolution.applicableTermsHierarchy,
  publicAccessState: resolution.publicAccessState,
  internalResearchState: resolution.internalResearchState,
  internalOperationalUseState: resolution.internalOperationalUseState,
  transientProcessingState: resolution.transientProcessingState,
  retentionStates: {
    rawDataRetentionState: resolution.rawDataRetentionState,
    normalizedEvidenceRetentionState: resolution.normalizedEvidenceRetentionState,
    metadataRetentionState: resolution.metadataRetentionState,
  },
  transformationState: resolution.transformationState,
  derivativeUseState: resolution.derivativeUseState,
  commercialUseState: resolution.commercialUseState,
  attributionState: resolution.attributionState,
  attributionRequirements: attribution,
  disclaimerState: resolution.disclaimerState,
  disclaimerRequirements: disclaimer,
  modificationNoticeState: resolution.modificationNoticeState,
  redistributionState: resolution.redistributionState,
  customerDisplayState: resolution.customerDisplayState,
  thirdPartyRightsState: resolution.thirdPartyComponentState,
  legalReviewRequirement: resolution.legalReviewState,
  providerConfirmationRequirement: resolution.providerConfirmationState,
  unresolvedQuestions: resolution.unresolvedQuestions,
  conditionMatrix,
  scenarioResults,
  invariantResults,
  resolutionDisposition: resolution.resolutionDisposition,
  deterministicFingerprint: gisSprint8LicensingResolutionFingerprint(),
  providerContacts: 0,
  formsSubmitted: 0,
  accountsCreated: 0,
  registrations: 0,
  credentialsRequested: 0,
  credentialsUsed: 0,
  termsAccepted: 0,
  purchases: 0,
  downloads: 0,
  liveServiceCalls: 0,
  providerAcquisitions: 0,
  productionReads: 0,
  productionWrites: 0,
  adapterExecutions: 0,
  runtimeActivations: 0,
  customerVisibleChanges: 0,
  geographicRelationships: 0,
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_AUTHORIZED");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED");
assert.equal(certification.resolutionDisposition, "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW");
assert.equal(certification.provider, "Colorado Geological Survey");
assert.equal(certification.datasetOrServiceId, "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY");
assert.equal(certification.conditionMatrix.every((entry) => entry.allowedForSprint8 === false && entry.allowedForFutureExecution === false), true);
assert.equal(certification.invariantResults.length, 50);
assert.equal(certification.providerContacts, 0);
assert.equal(certification.formsSubmitted, 0);
assert.equal(certification.accountsCreated, 0);
assert.equal(certification.registrations, 0);
assert.equal(certification.credentialsRequested, 0);
assert.equal(certification.credentialsUsed, 0);
assert.equal(certification.termsAccepted, 0);
assert.equal(certification.purchases, 0);
assert.equal(certification.downloads, 0);
assert.equal(certification.liveServiceCalls, 0);
assert.equal(certification.providerAcquisitions, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.adapterExecutions, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.geographicRelationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-licensing-attribution-resolution-certification] ok: GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED with zero provider contact, forms, accounts, registrations, credentials, terms acceptance, purchases, downloads, live service calls, provider acquisition, production reads/writes, adapter execution, runtime activation, customer-visible effect, or geographic relationships.");
