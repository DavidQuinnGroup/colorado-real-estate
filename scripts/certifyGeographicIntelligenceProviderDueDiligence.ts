import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_6_AUTHORIZATION,
  GIS_1_0_SPRINT_6_CERTIFICATION,
  GIS_1_0_SPRINT_6_CLASSIFICATION,
  GIS_SPRINT_6_EVALUATION_SUBJECT,
  GIS_SPRINT_6_IMPLEMENTATION_VERSION,
} from "../lib/geographic-intelligence/providerDueDiligenceContract.js";
import {
  GIS_SPRINT_6_SOURCE_REFERENCES,
  buildGisSprint6DueDiligenceComparison,
  buildGisSprint6ProviderDueDiligenceRecords,
  certifyGisSprint6ProviderDueDiligenceScenarios,
  gisSprint6ProviderDueDiligenceFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint6ProviderDueDiligenceFixtures.js";
import { assertGisSprint6DueDiligenceRecords } from "../lib/geographic-intelligence/providerDueDiligenceValidation.js";

const records = buildGisSprint6ProviderDueDiligenceRecords();
const comparison = buildGisSprint6DueDiligenceComparison(records);
const invariants = assertGisSprint6DueDiligenceRecords(records, GIS_SPRINT_6_SOURCE_REFERENCES, comparison);
const scenarios = certifyGisSprint6ProviderDueDiligenceScenarios();
const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_6",
  implementationVersion: GIS_SPRINT_6_IMPLEMENTATION_VERSION,
  authorization: GIS_1_0_SPRINT_6_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_6_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_6_CERTIFICATION,
  evaluationSubject: GIS_SPRINT_6_EVALUATION_SUBJECT,
  providersReviewed: records.map((record) => record.canonicalProviderName),
  datasetsOrServicesIdentified: records.map((record) => ({ provider: record.canonicalProviderName, source: record.exactSourceOrDatasetReviewed })),
  officialSourceReferences: GIS_SPRINT_6_SOURCE_REFERENCES.map((source) => ({
    referenceId: source.referenceId,
    providerOrAuthority: source.providerOrAuthority,
    title: source.title,
    officialPublisher: source.officialPublisher,
    url: source.url,
    accessDate: source.accessDate,
    verificationState: source.verificationState,
  })),
  currentVerificationResults: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.currentVerificationState])),
  licensingFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.licensingState])),
  termsFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.permittedUseState])),
  attributionFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.attributionRequirement])),
  technicalAccessFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.accessMethod])),
  authenticationFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.authenticationRequirement])),
  accountRequirementFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.accountRequirement])),
  updateCadenceFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.updateCadence])),
  geographicCoverageFindings: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.geographicCoverage])),
  unresolvedQuestions: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.unresolvedQuestions])),
  conflictingEvidence: records.filter((record) => record.currentVerificationState === "CONFLICTING_EVIDENCE").map((record) => record.providerInventoryEntryId),
  candidateDispositions: Object.fromEntries(records.map((record) => [record.providerInventoryEntryId, record.disposition])),
  comparativeOrdering: comparison.orderedProviderInventoryEntryIds,
  proposedMinimumProviderSet: comparison.revisedProposedMinimumProviderSet,
  pilotAuthorizationReviewCandidates: comparison.pilotAuthorizationReviewCandidates,
  legalReviewRequirements: comparison.legalReviewRequirements,
  technicalReviewRequirements: comparison.technicalReviewRequirements,
  commercialReviewRequirements: comparison.commercialReviewRequirements,
  scenarios,
  invariantResults: invariants,
  deterministicDueDiligenceFingerprint: gisSprint6ProviderDueDiligenceFingerprint(),
  providerContacts: 0,
  formsSubmitted: 0,
  accountsCreated: 0,
  registrations: 0,
  credentialsRequested: 0,
  credentialsUsed: 0,
  termsAccepted: 0,
  contractsAccepted: 0,
  purchases: 0,
  restrictedDownloads: 0,
  providerDataAcquisitions: 0,
  productionReads: 0,
  productionWrites: 0,
  liveAdapters: 0,
  runtimeActivations: 0,
  downstreamIntegrations: 0,
  customerVisibleChanges: 0,
  geographicRelationships: 0,
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_AUTHORIZED");
assert.equal(certification.classification, "CONTROLLED_PROVIDER_DUE_DILIGENCE");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED");
assert.equal(certification.providersReviewed.length, 4);
assert.equal(certification.officialSourceReferences.length, 11);
assert.deepEqual([...certification.pilotAuthorizationReviewCandidates].sort(), ["colorado-geological-survey", "u-s-geological-survey"]);
assert.deepEqual(certification.proposedMinimumProviderSet, ["colorado-geological-survey", "u-s-geological-survey", "fema-flood-map-source-class", "air-quality-source-class"]);
assert.equal(certification.scenarios.scenarioN, "ZERO_PROVIDER_DATA_ACQUISITION");
assert.equal(certification.invariantResults.length, 51);
assert.equal(certification.providerContacts, 0);
assert.equal(certification.formsSubmitted, 0);
assert.equal(certification.accountsCreated, 0);
assert.equal(certification.registrations, 0);
assert.equal(certification.credentialsRequested, 0);
assert.equal(certification.credentialsUsed, 0);
assert.equal(certification.termsAccepted, 0);
assert.equal(certification.contractsAccepted, 0);
assert.equal(certification.purchases, 0);
assert.equal(certification.restrictedDownloads, 0);
assert.equal(certification.providerDataAcquisitions, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.liveAdapters, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.downstreamIntegrations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.geographicRelationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-provider-due-diligence-certification] ok: GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED with zero provider contact, forms, accounts, registrations, credentials, terms acceptance, contracts, purchases, restricted downloads, provider data acquisition, production reads/writes, live adapters, runtime activation, downstream integration, customer-visible effect, or geographic relationships.");
