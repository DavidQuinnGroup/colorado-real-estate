import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  CURRENT_MARKET_COMPUTATION_MODE,
  CURRENT_MARKET_SUPPORTED_CITIES,
  REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_STATUS,
  computeCurrentMarketAggregates,
} from '../lib/currentMarketComputation';
import { CURRENT_MARKET_COMPUTATION_FIXTURE } from '../lib/currentMarketComputationFixtures';

const result = computeCurrentMarketAggregates(CURRENT_MARKET_COMPUTATION_FIXTURE);
assert.equal(result.status, REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_STATUS);
assert.equal(result.mode, CURRENT_MARKET_COMPUTATION_MODE);
assert.deepEqual(CURRENT_MARKET_SUPPORTED_CITIES, ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont', 'Denver', 'Broomfield', 'Westminster', 'Brighton', 'Arvada']);
assert.equal(result.normalizedListings.length, 7);
assert.deepEqual(result.exclusionCounts, { DUPLICATE_LISTING_IDENTITY: 2, MISSING_SOURCE_MODIFIED_AT: 1, NONCURRENT_STATUS: 1, UNSUPPORTED_STATUS: 1 });
assert.equal(result.sourceSetCurrentness.state, 'CERTIFIED_SOURCE_SET_CURRENTNESS');
assert(Object.values(result.protectedBoundaries).every((value) => value === false));

function aggregate(scopeType: 'CITY' | 'ZIP', scopeId: string, metric: string) {
  const found = result.aggregates.find((item) => item.scope.type === scopeType && item.scope.id === scopeId && item.metric === metric);
  assert(found, `Expected ${scopeType}/${scopeId}/${metric}.`);
  return found;
}

assert.equal(aggregate('CITY', 'Boulder', 'ACTIVE_INVENTORY_COUNT').value, 3);
assert.equal(aggregate('CITY', 'Boulder', 'MEDIAN_ACTIVE_LIST_PRICE').value, 900_000);
assert.equal(aggregate('CITY', 'Boulder', 'MEDIAN_ACTIVE_LIST_PRICE_PER_SQFT').value, 625);
assert.equal(aggregate('CITY', 'Boulder', 'PENDING_COUNT').value, 2);
assert.equal(aggregate('CITY', 'Boulder', 'COMING_SOON_COUNT').value, 0);
assert.equal(aggregate('CITY', 'Boulder', 'PENDING_TO_ACTIVE_RATIO').value, 2 / 3);
assert.equal(aggregate('CITY', 'Louisville', 'MEDIAN_ACTIVE_LIST_PRICE').state, 'INSUFFICIENT_VERIFIED_SAMPLE');
assert.equal(aggregate('CITY', 'Louisville', 'MEDIAN_ACTIVE_LIST_PRICE').value, null);
assert.equal(aggregate('CITY', 'Denver', 'ACTIVE_INVENTORY_COUNT').value, 1);
assert.match(aggregate('CITY', 'Boulder', 'MEDIAN_ACTIVE_LIST_PRICE_PER_SQFT').limitations.join(' '), /list price/i);
assert.match(aggregate('CITY', 'Boulder', 'ACTIVE_INVENTORY_BY_PROPERTY_TYPE').limitations.join(' '), /UNKNOWN/i);
assert.equal(aggregate('CITY', 'Boulder', 'ACTIVE_INVENTORY_BY_PROPERTY_TYPE').breakdown.find((item) => item.key === 'UNSPECIFIED_RESIDENTIAL')?.value, 1);

const source = fs.readFileSync('lib/currentMarketComputation.ts', 'utf8');
assert.doesNotMatch(source, /fetch\(|PrismaClient|prisma\.|process\.env|from ['"]next|Typesense|CRM/, 'Current Market engine must remain pure and non-activating.');
assert.doesNotMatch(source, /maximumSourceAgeHours|SOURCE_STALE/, 'Current Market engine must not apply a per-record source-age gate.');

console.log('CURRENT_MARKET_COMPUTATION_CHECK: PASS');
