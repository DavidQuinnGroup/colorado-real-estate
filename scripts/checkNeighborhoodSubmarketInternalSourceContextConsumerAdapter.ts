import assert from 'node:assert/strict';
import { buildInternalSourceContextConsumer, INTERNAL_SOURCE_CONTEXT_CONSUMER_ADAPTER_STATUS } from '../lib/neighborhood-submarket/internalSourceContextConsumerAdapter';
import { INTERNAL_SOURCE_CONTEXT_CONSUMER_FIXTURES } from '../lib/neighborhood-submarket/internalSourceContextConsumerAdapterFixtures';
const results = Object.fromEntries(Object.entries(INTERNAL_SOURCE_CONTEXT_CONSUMER_FIXTURES).map(([key, fixture]) => [key, buildInternalSourceContextConsumer(fixture)]));
assert.equal(INTERNAL_SOURCE_CONTEXT_CONSUMER_ADAPTER_STATUS, 'IMPLEMENTED_ADMIN_ONLY_INTERNAL_READINESS');
for (const result of Object.values(results)) { assert.equal(result.visibility, 'ADMIN_ONLY'); assert.equal(result.activationState, 'NOT_AUTHORIZED'); assert.equal(result.customerVisible, false); assert.equal(result.mutationAuthorized, false); }
assert(results.valid.relationship); assert.equal(results.niwot.relationship, null); assert.equal(results.gunbarrel.relationship, null); assert.equal(results.tableMesa.relationship, null);
assert(results.nonSource.reasons.includes('SOURCE_CONTEXT_RELATIONSHIP_REQUIRED')); assert(results.publicRequest.reasons.includes('PUBLIC_VISIBILITY_NOT_AUTHORIZED')); assert(results.activation.reasons.includes('ACTIVATION_NOT_AUTHORIZED')); assert(results.mutation.reasons.includes('MUTATION_NOT_AUTHORIZED')); assert(results.prohibitedClaim.reasons.includes('FAIR_HOUSING_CLAIM_NOT_AUTHORIZED'));
console.log('NEIGHBORHOOD_SUBMARKET_INTERNAL_SOURCE_CONTEXT_CONSUMER_ADAPTER_CHECK: PASS');
