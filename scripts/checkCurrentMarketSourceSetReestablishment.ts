import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('scripts/runCurrentMarketSourceSetReestablishment.ts', 'utf8');
assert.match(source, /process\.argv\.slice\(2\)\.includes\('--execute'\)/);
assert.match(source, /BLOCKED_PENDING_MLS_GRID_MUNICIPALITY_FILTER_TECHNICAL_CLARIFICATION/);
assert.match(source, /A certified provider six-city filter contract is required before any provider or database activity/);
assert.doesNotMatch(source, /City eq/);
assert.match(source, /MAX_PAGES = 100/);
assert.match(source, /MAX_PROVIDER_REQUESTS = 100/);
assert.match(source, /MIN_PROVIDER_DELAY_MS = 1000/);
assert.match(source, /includeMedia: false/);
assert.match(source, /fetchMLSPageResponseFromNextLink/);
assert.match(source, /response\.metadata\.terminationSignal === 'next_link_absent'/);
assert.match(source, /page\.failed > 0/);
assert.match(source, /Unexpected customer, alert, or email side effect detected/);
assert.match(source, /REIE_MLS_SOURCE_SET_REESTABLISHED_CURRENT/);
for (const forbidden of ['processListing', 'updateSearchIndex', 'processPhotos', 'matchAndNotify', 'enqueueAlert', 'sendEmail', 'deleteMany', 'delete(', 'updateMany', 'Typesense', 'CRMTask', 'SellerLead']) {
  assert.equal(source.includes(forbidden), false, `Controlled source-set runner must exclude ${forbidden}.`);
}

console.log('CURRENT_MARKET_SOURCE_SET_REESTABLISHMENT_CHECK: PASS');
