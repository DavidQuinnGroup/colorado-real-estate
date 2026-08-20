import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { admitAgentMarketPreparationContext } from '../lib/agent-advisory-workbench/agentMarketPreparationContextAdapter';
import { REAL_MARKET_PREPARATION_CONTEXT_PRODUCER_FIXTURES as fixtures } from '../lib/agent-advisory-workbench/realMarketPreparationContextProducerFixtures';
import { REAL_MARKET_CONTEXT_MAX_AGE_DAYS, REAL_MARKET_CONTEXT_PRODUCER_STATUS, evaluateRealMarketPreparationContext, produceRealMarketPreparationContext } from '../lib/agent-advisory-workbench/realMarketPreparationContextProducer';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const producer = read('lib/agent-advisory-workbench/realMarketPreparationContextProducer.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

const complete = evaluateRealMarketPreparationContext(fixtures.complete);
assert.equal(REAL_MARKET_CONTEXT_PRODUCER_STATUS, 'DQG_AGENT_MARKET_REAL_CERTIFIED_CONTEXT_PRODUCER_MVV');
assert.equal(REAL_MARKET_CONTEXT_MAX_AGE_DAYS, 31);
assert.equal(complete.state, 'CERTIFIED');
assert.ok(complete.context);
assert.equal(complete.context?.market.id, 'boulder-co-housing-market');
assert.equal(complete.context?.observations.length, 3);
assert.equal(admitAgentMarketPreparationContext(complete.context).state, 'PROFESSIONAL_REVIEW_REQUIRED');
assert.equal(produceRealMarketPreparationContext('boulder-co-housing-market', '2026-08-20').state, 'CERTIFIED');

for (const [fixture, state] of [
  [fixtures.unknownMarket, 'UNKNOWN_MARKET'],
  [fixtures.unknownRights, 'RIGHTS_NOT_PERMITTED'],
  [fixtures.stale, 'STALE_SOURCE'],
  [fixtures.conflicting, 'CONFLICTING_SOURCE'],
  [fixtures.incomplete, 'INCOMPLETE_SOURCE'],
  [fixtures.sourceRuntime, 'SOURCE_NOT_CERTIFIED'],
] as const) {
  const result = evaluateRealMarketPreparationContext(fixture);
  assert.equal(result.state, state);
  assert.equal(result.context, null);
}

for (const unsupportedMarket of ['niwot-co-housing-market', 'gunbarrel-co-housing-market', 'table-mesa', 'denver-co-housing-market']) {
  assert.equal(produceRealMarketPreparationContext(unsupportedMarket, '2026-08-20').context, null);
}

for (const marker of [
  "REAL_MARKET_CONTEXT_SOURCE_ID = 'EXP-SRC-REIE-CITY-MARKET-DATA'",
  'SUPPORTED_MARKET_IDS',
  'REVIEWED_INTERNAL_REPOSITORY_RIGHTS_REQUIRED',
  'MARKET_SOURCE_FRESHNESS_CONFIRMATION_REQUIRED',
  'MARKET_SOURCE_CONFLICT_REQUIRES_REVIEW',
  'USEFUL_MARKET_OBSERVATION_THRESHOLD_NOT_MET',
]) {
  assert(producer.includes(marker), `producer must retain ${marker}`);
}

for (const forbidden of ['fetch(', 'process.env', 'PrismaClient', 'CRM', 'customerName', 'recommendation: true', 'ranking: true', 'score:', 'marketHealthScore', 'localStorage', 'sessionStorage', 'document.cookie']) {
  assert.equal(producer.includes(forbidden), false, `producer must not reference ${forbidden}`);
}

assert.equal(packageJson.scripts?.['check:real-market-preparation-context-producer'], 'jiti scripts/checkRealMarketPreparationContextProducer.ts');
console.log('REAL_MARKET_PREPARATION_CONTEXT_PRODUCER_CHECK: PASS');
