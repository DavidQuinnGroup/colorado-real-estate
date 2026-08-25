import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION,
  INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROTECTED_BOUNDARIES,
  REIE_CURRENT_MARKET_MINIMUM_VERIFIED_SAMPLE_SIZE,
  REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_STATUS,
} from '../lib/internalSynchronizedPropertyMarketReadAdapter';
import { CURRENT_MARKET_SUPPORTED_CITIES } from '../lib/currentMarketComputation';

assert.equal(REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_STATUS, 'REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_CURRENTNESS_CERTIFIED');
assert.deepEqual(Object.keys(INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION).sort(), ['city', 'mlsId', 'price', 'propertyType', 'sourceModifiedAt', 'sqft', 'status', 'zip']);
assert.deepEqual(CURRENT_MARKET_SUPPORTED_CITIES, ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont', 'Denver', 'Broomfield', 'Westminster', 'Brighton', 'Arvada']);
assert.equal(REIE_CURRENT_MARKET_MINIMUM_VERIFIED_SAMPLE_SIZE, 5);
assert(Object.values(INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROTECTED_BOUNDARIES).every((value) => value === false));

const source = fs.readFileSync('lib/internalSynchronizedPropertyMarketReadAdapter.ts', 'utf8');
assert.match(source, /prisma\.property\.findMany/);
assert.match(source, /select:\s*INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION/);
assert.match(source, /CurrentMarketSourceSetCompletion/);
assert.match(source, /sourceSet\.sourceSetId !== read\.sourceSetId/);
assert.doesNotMatch(source, /maximumSourceAgeHours|72/);
assert.doesNotMatch(source, /create\(|createMany\(|update\(|updateMany\(|delete\(|deleteMany\(|upsert\(|\$executeRaw|\$queryRaw|fetch\(/, 'Read adapter must have no mutation, raw query, or provider retrieval.');
for (const forbidden of ['email', 'customer', 'lead', 'savedSearch', 'alert', 'photo', 'description', 'listingAgent', 'listingOffice']) {
  assert(!Object.prototype.hasOwnProperty.call(INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION, forbidden), `Adapter must not project ${forbidden}.`);
}

console.log('INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_CHECK: PASS');
