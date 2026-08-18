import assert from 'node:assert/strict';
import { GEOGRAPHIC_OBJECT_FIXTURES } from '../lib/neighborhood-submarket/geographicObjectGovernanceFixtures';
import { GEOGRAPHIC_OBJECT_FIREWALL, validateGeographicObject } from '../lib/neighborhood-submarket/geographicObjectGovernance';
for (const item of Object.values(GEOGRAPHIC_OBJECT_FIXTURES)) assert.equal(validateGeographicObject(item), true);
assert.equal(GEOGRAPHIC_OBJECT_FIXTURES.niwot.activationState, 'NOT_AUTHORIZED'); assert.equal(GEOGRAPHIC_OBJECT_FIXTURES.gunbarrel.readinessState, 'AMBIGUOUS_IDENTITY'); assert.equal(GEOGRAPHIC_OBJECT_FIXTURES.tableMesa.readinessState, 'EVIDENCE_INSUFFICIENT');
assert.deepEqual(GEOGRAPHIC_OBJECT_FIREWALL, { publicRoute: false, searchMap: false, propertyAssignment: false, providerApi: false, persistence: false, activation: false });
console.log('NEIGHBORHOOD_SUBMARKET_GEOGRAPHIC_OBJECT_GOVERNANCE_CHECK: PASS');
