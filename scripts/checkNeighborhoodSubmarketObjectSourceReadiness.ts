import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { OBJECT_SOURCE_READINESS_FIXTURES } from '../lib/neighborhood-submarket/objectSourceReadinessFixtures';
import {
  NEIGHBORHOOD_SUBMARKET_OBJECT_SOURCE_READINESS_STATUS,
  evaluateObjectSourceReadiness,
} from '../lib/neighborhood-submarket/objectSourceReadiness';

const read = (path: string): string => readFileSync(path, 'utf8');

const results = Object.fromEntries(
  Object.entries(OBJECT_SOURCE_READINESS_FIXTURES).map(([key, fixture]) => [key, evaluateObjectSourceReadiness(fixture)]),
);

assert.equal(NEIGHBORHOOD_SUBMARKET_OBJECT_SOURCE_READINESS_STATUS, 'IMPLEMENTED_INTERNAL_READINESS_ONLY');

for (const result of Object.values(results)) {
  assert.equal(result.activationState, 'NOT_AUTHORIZED');
  assert.equal(result.publicSearchMapPropertyRouteAeoReady, false);
  assert.equal(result.publicActivationBlocked, true);
}

assert.equal(results.completeInternalGovernanceReady.posture, 'CERTIFICATION_READY');
assert.equal(results.completeInternalGovernanceReady.certificationState, 'CERTIFICATION_READY');
assert.deepEqual(results.completeInternalGovernanceReady.reasons, []);
assert.equal(results.completeInternalGovernanceReady.publicSearchMapPropertyRouteAeoReady, false);

assert(results.niwot.reasons.includes('SUPPORTED_JURISDICTION_REQUIRED'));
assert(results.niwot.reasons.includes('BOUNDARY_EVIDENCE_REQUIRED'));
assert.equal(results.niwot.posture, 'NOT_READY_BOUNDARY');

assert(results.gunbarrel.reasons.includes('EDITORIAL_ONLY_CONTEXT_NOT_FACT_ELIGIBLE'));
assert(results.gunbarrel.reasons.includes('SUPPORTED_JURISDICTION_REQUIRED'));

assert(results.tableMesa.reasons.includes('EVIDENCE_OBSERVATION_REQUIRED'));
assert(results.tableMesa.reasons.includes('BOUNDARY_EVIDENCE_REQUIRED'));

assert.equal(results.municipality.posture, 'CERTIFICATION_READY');
assert.equal(results.subdivision.posture, 'CERTIFICATION_READY');
assert.equal(results.corridor.posture, 'CERTIFICATION_READY');
assert.equal(results.marketArea.posture, 'CERTIFICATION_READY');
assert(results.editorialOnlyContext.reasons.includes('EDITORIAL_ONLY_CONTEXT_NOT_FACT_ELIGIBLE'));

assert(results.unknownRights.reasons.includes('RIGHTS_APPROVAL_REQUIRED'));
assert(results.unknownRights.reasons.includes('SOURCE_REGISTRY_IDENTITY_NOT_USE_AUTHORITY'));
assert(results.unknownRights.reasons.includes('SOURCE_QUALITY_NOT_PERMITTED_USE'));
assert.equal(results.unknownRights.posture, 'NOT_READY_SOURCE_IDENTITY');

assert(results.staleSource.reasons.includes('SOURCE_FRESHNESS_CURRENT_REQUIRED'));
assert.equal(results.staleSource.posture, 'NOT_READY_FRESHNESS');

assert(results.conflictingBoundary.reasons.includes('BOUNDARY_CONFLICT_REQUIRES_REVIEW'));
assert.equal(results.conflictingBoundary.posture, 'NOT_READY_CONFLICT');

assert(results.unsupportedJurisdiction.reasons.includes('SUPPORTED_JURISDICTION_REQUIRED'));
assert.equal(results.unsupportedJurisdiction.posture, 'NOT_READY_JURISDICTION');

assert(results.existingRouteNoAuthority.reasons.includes('EXISTING_ROUTE_DOES_NOT_AUTHORIZE_ACTIVATION'));
assert.equal(results.existingRouteNoAuthority.activationState, 'NOT_AUTHORIZED');

assert(results.sourceRegistryNoUseAuthority.reasons.includes('SOURCE_REGISTRY_IDENTITY_NOT_USE_AUTHORITY'));
assert(results.sourceQualityNoUseAuthority.reasons.includes('SOURCE_QUALITY_NOT_PERMITTED_USE'));

assert(results.requestedPublicActivation.reasons.includes('PUBLIC_ACTIVATION_NOT_AUTHORIZED'));
assert.equal(results.requestedPublicActivation.activationState, 'NOT_AUTHORIZED');

assert(results.missingEvidenceIdentity.reasons.includes('EVIDENCE_IDENTITY_REQUIRED'));
assert(results.unknownEvidenceType.reasons.includes('UNKNOWN_EVIDENCE_TYPE'));
assert(results.editorialEvidence.reasons.includes('EDITORIAL_EVIDENCE_NOT_GOVERNED_FACT_ELIGIBLE'));
assert(results.unsupportedParentRelationship.reasons.includes('PARENT_RELATIONSHIP_EVIDENCE_REQUIRED'));
assert(results.unsupportedParentRelationship.reasons.includes('RELATIONSHIP_EVIDENCE_UNRESOLVED'));
assert(results.staleRelationshipEvidence.reasons.includes('SOURCE_FRESHNESS_CURRENT_REQUIRED'));
assert(results.conflictingRelationshipEvidence.reasons.includes('RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW'));

const contractSource = read('lib/neighborhood-submarket/objectSourceReadiness.ts');
const fixtureSource = read('lib/neighborhood-submarket/objectSourceReadinessFixtures.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

assert.match(contractSource, /MUTABLE_SOURCE_STATE_MUST_NOT_BE_COPIED/);
assert.match(contractSource, /CERTIFICATION_READY/);
assert.match(contractSource, /publicSearchMapPropertyRouteAeoReady: false/);
assert.match(contractSource, /activationState: 'NOT_AUTHORIZED'/);
assert.match(contractSource, /GovernedEvidenceType/);
assert.match(contractSource, /PARENT_RELATIONSHIP_EVIDENCE_REQUIRED/);
assert.match(contractSource, /RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW/);
assert.match(fixtureSource, /GEO-NIWOT/);
assert.match(fixtureSource, /GEO-GUNBARREL/);
assert.match(fixtureSource, /GEO-TABLE-MESA/);
assert.match(fixtureSource, /GEO-MISSING-EVIDENCE-ID-FIXTURE/);
assert.match(fixtureSource, /GEO-UNSUPPORTED-PARENT-FIXTURE/);
assert.equal(
  packageJson.scripts?.['check:neighborhood-submarket-object-source-readiness'],
  'jiti scripts/checkNeighborhoodSubmarketObjectSourceReadiness.ts',
);

console.log('NEIGHBORHOOD_SUBMARKET_OBJECT_SOURCE_READINESS_CHECK: PASS');
