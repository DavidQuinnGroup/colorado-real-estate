import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_7_AUTHORIZATION,
  GIS_1_0_SPRINT_7_CERTIFICATION,
  GIS_1_0_SPRINT_7_CLASSIFICATION,
  GIS_SPRINT_7_IMPLEMENTATION_VERSION,
} from "../lib/geographic-intelligence/controlledProviderPilotContract.js";
import {
  GIS_SPRINT_7_ADAPTER_DESIGN_ID,
  GIS_SPRINT_7_ADAPTER_DESIGN_VERSION,
  buildGisSprint7ControlledProviderPilotDesign,
  buildGisSprint7DesignAuditRecord,
  certifyGisSprint7ControlledProviderPilotScenarios,
  gisSprint7ControlledProviderPilotFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint7ControlledProviderPilotFixtures.js";
import { assertGisSprint7ControlledProviderPilotDesign } from "../lib/geographic-intelligence/controlledProviderPilotValidation.js";

const design = buildGisSprint7ControlledProviderPilotDesign();
const audit = buildGisSprint7DesignAuditRecord(design);
const scenarios = certifyGisSprint7ControlledProviderPilotScenarios();
const invariants = assertGisSprint7ControlledProviderPilotDesign(design);
const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_7",
  implementationVersion: GIS_SPRINT_7_IMPLEMENTATION_VERSION,
  authorization: GIS_1_0_SPRINT_7_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_7_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_7_CERTIFICATION,
  pilotId: design.pilotId,
  pilotVersion: design.pilotVersion,
  providerId: design.providerInventoryEntryId,
  providerCanonicalName: design.providerCanonicalName,
  exactDatasetOrServiceId: design.exactDatasetOrServiceId,
  exactDatasetOrServiceName: design.exactDatasetOrServiceName,
  adapterDesignId: GIS_SPRINT_7_ADAPTER_DESIGN_ID,
  adapterDesignVersion: GIS_SPRINT_7_ADAPTER_DESIGN_VERSION,
  officialEvidenceReferences: design.officialSourceEvidenceReferences,
  capabilityId: design.pilotCapabilityId,
  intelligenceDomain: design.intelligenceDomain,
  evidenceCategories: design.evidenceCategories,
  geographicScope: design.geographicScope,
  subjectSelectionContract: design.subjectSelection,
  authorizedFields: design.authorizedFields,
  prohibitedFields: design.prohibitedFields,
  accessMethod: design.accessMethod,
  technicalFormat: design.expectedTechnicalFormat,
  licensingState: design.licensingState,
  permittedUseState: design.permittedUseState,
  attributionState: design.attributionRequirement,
  maximumRequests: design.limits.maximumRequests,
  maximumRecords: design.limits.maximumRecords,
  maximumGeographicScope: design.limits.maximumGeographicExtent,
  maximumDuration: design.limits.maximumExecutionDurationSeconds,
  operatorControls: design.operatorControls,
  auditRequirements: design.auditRequirements,
  auditDesignRecord: audit,
  stopConditions: design.stopConditions,
  rollbackExpectations: design.rollbackExpectations,
  fixtureScenarioResults: scenarios,
  invariantResults: invariants,
  designDisposition: design.designDisposition,
  deterministicDesignFingerprint: gisSprint7ControlledProviderPilotFingerprint(),
  providerContacts: 0,
  accountsCreated: 0,
  credentialsRequested: 0,
  credentialsUsed: 0,
  termsAccepted: 0,
  providerConnections: 0,
  providerDataAcquisitions: 0,
  productionReads: 0,
  productionWrites: 0,
  liveAdapterExecutions: 0,
  runtimeActivations: 0,
  downstreamIntegrations: 0,
  customerVisibleChanges: 0,
  geographicRelationships: 0,
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_AUTHORIZED");
assert.equal(certification.classification, "CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED");
assert.equal(certification.providerId, "colorado-geological-survey");
assert.equal(certification.exactDatasetOrServiceId, "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY");
assert.equal(certification.designDisposition, "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED");
assert.equal(certification.fixtureScenarioResults.scenarioA, "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED");
assert.equal(certification.fixtureScenarioResults.scenarioN, "ZERO_LIVE_PILOT_EXECUTION");
assert.equal(certification.invariantResults.length, 60);
assert.equal(certification.providerContacts, 0);
assert.equal(certification.accountsCreated, 0);
assert.equal(certification.credentialsRequested, 0);
assert.equal(certification.credentialsUsed, 0);
assert.equal(certification.termsAccepted, 0);
assert.equal(certification.providerConnections, 0);
assert.equal(certification.providerDataAcquisitions, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.liveAdapterExecutions, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.downstreamIntegrations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.geographicRelationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-controlled-provider-pilot-design-certification] ok: GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED with zero provider contact, accounts, credentials, terms acceptance, provider connections, provider data acquisition, production reads/writes, live adapter execution, runtime activation, downstream integration, customer-visible effect, or geographic relationships.");
