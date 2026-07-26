import assert from "node:assert/strict";

import {
  GIS_1_0_PROGRAM_AUTHORIZATION,
  GIS_1_0_SPRINT_1_CERTIFICATION,
  GIS_1_0_SPRINT_1_CLASSIFICATION,
} from "../lib/geographic-intelligence/activationContract.js";
import {
  GIS_INITIAL_DOMAIN_REGISTRY,
  assertGisInitialDomainRegistryFailClosed,
} from "../lib/geographic-intelligence/domainRegistry.js";
import {
  GIS_SPRINT_1_DERIVED_FIXTURE,
  GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE,
  GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE,
  assertGisSprint1FixturesGoverned,
} from "../lib/geographic-intelligence/fixtures/gisSprint1Fixtures.js";

const certification = Object.freeze({
  program: "GIS_1_0",
  authorization: GIS_1_0_PROGRAM_AUTHORIZATION,
  sprint: "GIS_1_0_SPRINT_1",
  classification: GIS_1_0_SPRINT_1_CLASSIFICATION,
  certification: GIS_1_0_SPRINT_1_CERTIFICATION,
  domainCount: GIS_INITIAL_DOMAIN_REGISTRY.length,
  activation: {
    acquisitionAuthorized: false,
    persistenceAuthorized: false,
    retrievalAuthorized: false,
    enterpriseConsumptionAuthorized: false,
    runtimeAuthorized: false,
    downstreamIntegrationAuthorized: false,
    customerVisibilityAuthorized: false,
  },
  productionEffect: {
    deployments: 0,
    migrations: 0,
    productionWrites: 0,
    externalAcquisitions: 0,
    runtimeActivations: 0,
    downstreamIntegrations: 0,
    customerVisibleChanges: 0,
    relationshipsCreated: 0,
  },
  retainedProhibitions: {
    coloradoRuntimeConsumption: "NOT_AUTHORIZED",
    gofWave5: "NOT_AUTHORIZED",
    geographicRelationships: "NOT_AUTHORIZED",
    customerVisibility: "NOT_AUTHORIZED",
  },
  deterministicEvidence: {
    unknownRightsEvidence: GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.evidenceIdentity,
    providerBoundary: GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.adapterIdentity,
    derivedFixtureFingerprint: GIS_SPRINT_1_DERIVED_FIXTURE.contentFingerprint,
  },
});

assert.equal(certification.authorization, "AUTHORIZED_FOR_ARCHITECTURE_AND_IMPLEMENTATION_PLANNING");
assert.equal(certification.classification, "GEOGRAPHIC_INTELLIGENCE_ARCHITECTURE_FOUNDATION");
assert.equal(certification.certification, "GIS_1_0_SPRINT_1_ARCHITECTURE_FOUNDATION_CERTIFIED");
assert.equal(certification.domainCount, 8);
assertGisInitialDomainRegistryFailClosed();
assertGisSprint1FixturesGoverned();
assert.deepEqual(Object.values(certification.activation), [false, false, false, false, false, false, false]);
assert.deepEqual(Object.values(certification.productionEffect), [0, 0, 0, 0, 0, 0, 0, 0]);
assert.equal(certification.retainedProhibitions.coloradoRuntimeConsumption, "NOT_AUTHORIZED");
assert.equal(certification.retainedProhibitions.gofWave5, "NOT_AUTHORIZED");
assert.equal(certification.retainedProhibitions.geographicRelationships, "NOT_AUTHORIZED");
assert.equal(certification.retainedProhibitions.customerVisibility, "NOT_AUTHORIZED");

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-architecture-foundation-certification] ok: GIS_1_0_SPRINT_1_ARCHITECTURE_FOUNDATION_CERTIFIED with zero production, runtime, provider, relationship, downstream, or customer-visible effect.");

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/certifyGeographicIntelligenceArchitectureFoundation.ts
