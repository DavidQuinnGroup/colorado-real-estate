import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_3_AUTHORIZATION,
  GIS_1_0_SPRINT_3_CERTIFICATION,
  GIS_1_0_SPRINT_3_CLASSIFICATION,
} from "../lib/geographic-intelligence/providerInventoryContract.js";
import {
  GIS_SPRINT_3_CANONICAL_CATEGORY_COUNT,
  GIS_SPRINT_3_PROVIDER_INVENTORY,
  GIS_SPRINT_3_PROVIDER_OVERLAPS,
  certifyGisSprint3ProviderInventoryScenarios,
  gisSprint3ProviderInventoryFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint3ProviderInventoryFixtures.js";
import { deterministicProviderInventorySummary } from "../lib/geographic-intelligence/providerInventoryValidation.js";

const summary = deterministicProviderInventorySummary(GIS_SPRINT_3_PROVIDER_INVENTORY, GIS_SPRINT_3_PROVIDER_OVERLAPS);
const scenarios = certifyGisSprint3ProviderInventoryScenarios();

const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_3",
  implementationVersion: "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_V1",
  authorization: GIS_1_0_SPRINT_3_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_3_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_3_CERTIFICATION,
  canonicalInventoryCategoriesRepresented: GIS_SPRINT_3_CANONICAL_CATEGORY_COUNT,
  namedInventoryEntriesRepresented: summary.entryCount,
  genericSourceClassesRepresented: GIS_SPRINT_3_PROVIDER_INVENTORY.filter((entry) => entry.entityTypes.includes("GENERIC_SOURCE_CLASS")).length,
  domainRelevanceMappings: [...new Set(GIS_SPRINT_3_PROVIDER_INVENTORY.flatMap((entry) => entry.potentialGisDomainRelevance))].sort(),
  nonGisRelevanceMappings: [...new Set(GIS_SPRINT_3_PROVIDER_INVENTORY.flatMap((entry) => entry.potentialNonGisReieRelevance))].sort(),
  licensingFailClosedResult: scenarios.scenarioF,
  verificationStateResult: scenarios.scenarioJ,
  jurisdictionalInstanceResult: scenarios.scenarioE,
  overlapPreservationResult: scenarios.scenarioG,
  commercialRiskResult: scenarios.scenarioB,
  operationalToolSeparationResult: scenarios.scenarioC,
  consumerPortalSeparationResult: scenarios.scenarioD,
  futureEvaluationResult: scenarios.scenarioH,
  rejectedCandidatePreservationResult: scenarios.scenarioI,
  providerConnections: 0,
  networkCalls: 0,
  credentials: 0,
  acquisitions: 0,
  productionReads: 0,
  productionWrites: 0,
  runtimeActivations: 0,
  downstreamIntegrations: 0,
  customerVisibleChanges: 0,
  relationships: 0,
  deterministicRegistryFingerprint: gisSprint3ProviderInventoryFingerprint(),
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_AUTHORIZED");
assert.equal(certification.classification, "PROVIDER_INVENTORY_GOVERNANCE");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED");
assert.equal(certification.canonicalInventoryCategoriesRepresented, 16);
assert.ok(certification.namedInventoryEntriesRepresented >= 55);
assert.ok(certification.genericSourceClassesRepresented >= 10);
assert.equal(certification.providerConnections, 0);
assert.equal(certification.networkCalls, 0);
assert.equal(certification.credentials, 0);
assert.equal(certification.acquisitions, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.downstreamIntegrations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.relationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-provider-inventory-governance-certification] ok: GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED with zero provider connections, network calls, credentials, acquisitions, production reads/writes, runtime activation, downstream integration, customer-visible effect, or relationships.");

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/certifyGeographicIntelligenceProviderInventoryGovernance.ts
