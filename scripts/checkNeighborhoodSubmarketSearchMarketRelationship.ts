import assert from 'node:assert/strict';
import { evaluateSearchMarketRelationship, NEIGHBORHOOD_SUBMARKET_SEARCH_MARKET_RELATIONSHIP_STATUS } from '../lib/neighborhood-submarket/searchMarketRelationship';
import { SEARCH_MARKET_RELATIONSHIP_FIXTURES } from '../lib/neighborhood-submarket/searchMarketRelationshipFixtures';
const results = Object.fromEntries(Object.entries(SEARCH_MARKET_RELATIONSHIP_FIXTURES).map(([key, fixture]) => [key, evaluateSearchMarketRelationship(fixture)]));
assert.equal(NEIGHBORHOOD_SUBMARKET_SEARCH_MARKET_RELATIONSHIP_STATUS, 'IMPLEMENTED_INTERNAL_ARCHITECTURE_ONLY');
for (const result of Object.values(results)) { assert.equal(result.activationState, 'NOT_AUTHORIZED'); assert.equal(result.searchRuntimeActivated, false); assert.equal(result.marketRuntimeActivated, false); assert.equal(result.mapActivated, false); assert.equal(result.propertyActivated, false); assert.equal(result.aeoActivated, false); }
assert.equal(results.municipality.visibility, 'PUBLIC/GUIDED_ELIGIBLE');
assert.equal(results.niwot.visibility, 'DATA_INSUFFICIENT'); assert.equal(results.gunbarrel.visibility, 'DATA_INSUFFICIENT'); assert.equal(results.tableMesa.visibility, 'DATA_INSUFFICIENT');
assert(results.ranking.reasons.includes('RANKING_NOT_AUTHORIZED')); assert.equal(results.ranking.visibility, 'COMPLIANCE_BLOCKED'); assert(results.suitability.reasons.includes('SUITABILITY_NOT_AUTHORIZED')); assert(results.activation.reasons.includes('PUBLIC_ACTIVATION_NOT_AUTHORIZED'));
console.log('NEIGHBORHOOD_SUBMARKET_SEARCH_MARKET_RELATIONSHIP_CHECK: PASS');
