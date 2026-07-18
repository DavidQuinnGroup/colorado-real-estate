import assert from 'node:assert/strict';

import { applyUnsubscribe, findUnsubscribeToken } from '../lib/unsubscribe/store.js';
import { classifyUnsubscribeToken, normalizeUnsubscribeToken, type UnsubscribeTokenRecord } from '../lib/unsubscribe/safety.js';

const VALID_TOKEN = 'wave4a-valid-token-0001';

function record(overrides: Partial<UnsubscribeTokenRecord> = {}): UnsubscribeTokenRecord {
  return {
    token: VALID_TOKEN,
    userId: 'user-fixture',
    searchId: null,
    usedAt: null,
    ...overrides,
  };
}

function assertClassification(
  label: string,
  inputToken: string | null,
  inputRecord: UnsubscribeTokenRecord | null,
  expected: { status: string; statusCode: number; token: string | null },
) {
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

function failingPrisma() {
  return {
    unsubscribeToken: {
      findUnique: async () => {
        throw new Error('fixture prisma lookup failure');
      },
      update: async () => {
        return {};
      },
    },
    savedSearch: {
      update: async () => {
        return {};
      },
    },
    user: {
      update: async () => {
        return {};
      },
    },
    $transaction: async () => {
      throw new Error('fixture prisma transaction failure');
    },
  };
}

function fakeSupabase(lookupRow: UnsubscribeTokenRecord | null = null) {
  const calls: Array<{ table: string; action: string; payload?: unknown; filters: Array<{ column: string; value: unknown }> }> = [];

  return {
    calls,
    client: {
      from(table: string) {
        const filters: Array<{ column: string; value: unknown }> = [];

        return {
          select() {
            return this;
          },
          eq(column: string, value: unknown) {
            filters.push({ column, value });
            return this;
          },
          async maybeSingle() {
            calls.push({ table, action: 'maybeSingle', filters: [...filters] });

            return {
              data: lookupRow,
              error: null,
            };
          },
          update(payload: unknown) {
            return {
              eq(column: string, value: unknown) {
                calls.push({
                  table,
                  action: 'update',
                  payload,
                  filters: [{ column, value }],
                });

                return Promise.resolve({
                  data: null,
                  error: null,
                });
              },
            };
          },
        };
      },
    },
  };
}

const unknownFallback = fakeSupabase(null);
const unknownRecord = await findUnsubscribeToken(VALID_TOKEN, {
  prismaClient: failingPrisma(),
  supabaseClient: unknownFallback.client as never,
});
assert.equal(unknownRecord, null, 'unknown token should use Supabase fallback and return no match without throwing');
assert.deepEqual(unknownFallback.calls[0], {
  table: 'UnsubscribeToken',
  action: 'maybeSingle',
  filters: [{ column: 'token', value: VALID_TOKEN }],
});

const searchScopedRecord = record({ searchId: 'search-fixture' });
const searchFallback = fakeSupabase(searchScopedRecord);
const searchResult = await applyUnsubscribe(searchScopedRecord, {
  prismaClient: failingPrisma(),
  supabaseClient: searchFallback.client as never,
});
assert.equal(searchResult, 'search', 'search-scoped fallback should report search result');
assert.equal(searchFallback.calls.length, 2, 'search-scoped fallback should update only token and saved search');
assert.equal(searchFallback.calls[0].table, 'UnsubscribeToken');
assert.deepEqual(searchFallback.calls[0].filters, [{ column: 'token', value: VALID_TOKEN }]);
assert.equal(searchFallback.calls[1].table, 'SavedSearch');
assert.deepEqual(searchFallback.calls[1].filters, [{ column: 'id', value: 'search-fixture' }]);

const globalRecord = record();
const globalFallback = fakeSupabase(globalRecord);
const globalResult = await applyUnsubscribe(globalRecord, {
  prismaClient: failingPrisma(),
  supabaseClient: globalFallback.client as never,
});
assert.equal(globalResult, 'global', 'global fallback should report global result');
assert.equal(globalFallback.calls.length, 2, 'global fallback should update only token and user');
assert.equal(globalFallback.calls[0].table, 'UnsubscribeToken');
assert.deepEqual(globalFallback.calls[0].filters, [{ column: 'token', value: VALID_TOKEN }]);
assert.equal(globalFallback.calls[1].table, 'User');
assert.deepEqual(globalFallback.calls[1].filters, [{ column: 'id', value: 'user-fixture' }]);

console.log('Unsubscribe safety checks passed.');

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkUnsubscribeSafety.ts
