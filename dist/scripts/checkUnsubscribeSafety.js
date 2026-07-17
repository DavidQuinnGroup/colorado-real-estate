import assert from 'node:assert/strict';
import { classifyUnsubscribeToken, normalizeUnsubscribeToken } from '../lib/unsubscribe/safety.js';
const VALID_TOKEN = 'wave4a-valid-token-0001';
function record(overrides = {}) {
    return {
        token: VALID_TOKEN,
        userId: 'user-fixture',
        searchId: null,
        usedAt: null,
        ...overrides,
    };
}
function assertClassification(label, inputToken, inputRecord, expected) {
    const classification = classifyUnsubscribeToken(inputToken, inputRecord);
    assert.equal(classification.status, expected.status, label);
    assert.equal(classification.statusCode, expected.statusCode, label);
    assert.equal(classification.token, expected.token, label);
}
assert.equal(normalizeUnsubscribeToken(null), null, 'missing token should be rejected');
assert.equal(normalizeUnsubscribeToken('short'), null, 'short token should be rejected');
assert.equal(normalizeUnsubscribeToken('x'.repeat(201)), null, 'overlong token should be rejected');
assert.equal(normalizeUnsubscribeToken('invalid token with spaces'), null, 'token with spaces should be rejected');
assert.equal(normalizeUnsubscribeToken(` ${VALID_TOKEN} `), VALID_TOKEN, 'valid token should be trimmed');
assertClassification('missing token', null, null, {
    status: 'missing_or_malformed',
    statusCode: 400,
    token: null,
});
assertClassification('malformed token', normalizeUnsubscribeToken('bad token'), null, {
    status: 'missing_or_malformed',
    statusCode: 400,
    token: null,
});
assertClassification('unknown token', VALID_TOKEN, null, {
    status: 'not_found',
    statusCode: 404,
    token: null,
});
assertClassification('already used global token', VALID_TOKEN, record({ usedAt: new Date('2026-07-17T12:00:00.000Z') }), {
    status: 'already_used',
    statusCode: 200,
    token: VALID_TOKEN,
});
assertClassification('valid global token', VALID_TOKEN, record(), {
    status: 'active',
    statusCode: 200,
    token: VALID_TOKEN,
});
assertClassification('valid saved-search token', VALID_TOKEN, record({ searchId: 'search-fixture' }), {
    status: 'active',
    statusCode: 200,
    token: VALID_TOKEN,
});
assertClassification('repeated valid fixture request after use', VALID_TOKEN, record({ searchId: 'search-fixture', usedAt: new Date() }), {
    status: 'already_used',
    statusCode: 200,
    token: VALID_TOKEN,
});
console.log('Unsubscribe safety checks passed.');
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkUnsubscribeSafety.ts
