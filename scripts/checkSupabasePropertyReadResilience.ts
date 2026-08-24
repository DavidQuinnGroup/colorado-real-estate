import assert from 'node:assert/strict';

import {
  SUPABASE_PROPERTY_READ_BACKOFF_MS,
  SUPABASE_PROPERTY_READ_MAX_ATTEMPTS,
  createSupabasePropertyReadFetch,
  type SupabasePropertyReadResilienceEvent,
} from '../lib/property/supabaseReadResilience';

type EventRecord = {
  event: SupabasePropertyReadResilienceEvent;
  attempt: number;
  errorCode?: string;
};

function transportError(code: string) {
  const cause = Object.assign(new Error(`transport ${code}`), { code });
  return new TypeError('fetch failed', { cause });
}

function createScenario(outcomes: Array<Response | Error>) {
  let attempts = 0;
  const delays: number[] = [];
  const events: EventRecord[] = [];
  const fetchImpl: typeof fetch = async () => {
    const outcome = outcomes[attempts++];
    if (outcome instanceof Error) throw outcome;
    return outcome;
  };
  const resilientFetch = createSupabasePropertyReadFetch({
    fetchImpl,
    sleep: async (milliseconds) => {
      delays.push(milliseconds);
    },
    onEvent: (event, metadata) => {
      events.push({ event, ...metadata });
    },
  });

  return { resilientFetch, getAttempts: () => attempts, delays, events };
}

async function expectSingleHttpResponse(status: number) {
  const scenario = createScenario([new Response(null, { status })]);
  const response = await scenario.resilientFetch('https://example.test/rest/v1/Property');
  assert.equal(response.status, status);
  assert.equal(scenario.getAttempts(), 1);
  assert.deepEqual(scenario.events, []);
  assert.deepEqual(scenario.delays, []);
}

async function main() {
  assert.equal(SUPABASE_PROPERTY_READ_MAX_ATTEMPTS, 3);
  assert.deepEqual(SUPABASE_PROPERTY_READ_BACKOFF_MS, [125, 300]);

  const firstAttempt = createScenario([new Response(null, { status: 200 })]);
  assert.equal((await firstAttempt.resilientFetch('https://example.test/rest/v1/Property')).status, 200);
  assert.equal(firstAttempt.getAttempts(), 1);
  assert.deepEqual(firstAttempt.events, []);

  const enotfoundRecovery = createScenario([transportError('ENOTFOUND'), new Response(null, { status: 200 })]);
  assert.equal((await enotfoundRecovery.resilientFetch('https://example.test/rest/v1/Property')).status, 200);
  assert.equal(enotfoundRecovery.getAttempts(), 2);
  assert.deepEqual(enotfoundRecovery.delays, [125]);
  assert.deepEqual(enotfoundRecovery.events.map(({ event }) => event), [
    'SUPABASE_READ_TRANSIENT_FAILURE',
    'SUPABASE_READ_RETRY_ATTEMPT',
    'SUPABASE_READ_RECOVERED_AFTER_RETRY',
  ]);

  const multiTransientRecovery = createScenario([
    transportError('ENOTFOUND'),
    transportError('EAI_AGAIN'),
    new Response(null, { status: 200 }),
  ]);
  assert.equal((await multiTransientRecovery.resilientFetch('https://example.test/rest/v1/Property')).status, 200);
  assert.equal(multiTransientRecovery.getAttempts(), 3);
  assert.deepEqual(multiTransientRecovery.delays, [125, 300]);

  const exhaustedError = transportError('ENOTFOUND');
  const exhausted = createScenario([transportError('ENOTFOUND'), transportError('ENOTFOUND'), exhaustedError]);
  await assert.rejects(() => exhausted.resilientFetch('https://example.test/rest/v1/Property'), (error) => error === exhaustedError);
  assert.equal(exhausted.getAttempts(), 3);
  assert.deepEqual(exhausted.delays, [125, 300]);
  assert.deepEqual(exhausted.events.map(({ event }) => event), [
    'SUPABASE_READ_TRANSIENT_FAILURE',
    'SUPABASE_READ_RETRY_ATTEMPT',
    'SUPABASE_READ_TRANSIENT_FAILURE',
    'SUPABASE_READ_RETRY_ATTEMPT',
    'SUPABASE_READ_TRANSIENT_FAILURE',
    'SUPABASE_READ_RETRY_EXHAUSTED',
  ]);

  await expectSingleHttpResponse(401);
  await expectSingleHttpResponse(403);
  await expectSingleHttpResponse(400);

  const programmingError = new Error('programming error');
  const nonTransport = createScenario([programmingError]);
  await assert.rejects(() => nonTransport.resilientFetch('https://example.test/rest/v1/Property'), (error) => error === programmingError);
  assert.equal(nonTransport.getAttempts(), 1);
  assert.deepEqual(nonTransport.events, []);

  const connectionResetRecovery = createScenario([transportError('ECONNRESET'), new Response(null, { status: 200 })]);
  assert.equal((await connectionResetRecovery.resilientFetch('https://example.test/rest/v1/Property')).status, 200);
  assert.equal(connectionResetRecovery.getAttempts(), 2);

  const writeBlocked = createScenario([new Response(null, { status: 201 })]);
  await assert.rejects(
    () => writeBlocked.resilientFetch('https://example.test/rest/v1/Property', { method: 'POST' }),
    /only permits read requests/,
  );
  assert.equal(writeBlocked.getAttempts(), 0);

  console.log('[supabase-property-read-resilience] ok: bounded read-only retries recover transient transport failures and preserve non-transient behavior.');
}

main().catch((error) => {
  console.error('[supabase-property-read-resilience] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
