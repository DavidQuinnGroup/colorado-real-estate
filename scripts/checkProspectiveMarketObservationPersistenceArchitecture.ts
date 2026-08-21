import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  MARKET_OBSERVATION_PERSISTENCE_ENTITIES,
  MARKET_OBSERVATION_READ_AUTHORITIES,
  PROSPECTIVE_MARKET_OBSERVATION_PROTECTED_BOUNDARIES,
  REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_STATUS,
  REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_NEXT_GATE,
  evaluateMarketComparison,
  evaluateProspectiveMarketObservationWrite,
} from '../lib/prospectiveMarketObservationPersistenceArchitecture';
import {
  CURRENT_CERTIFIED_MARKET_OBSERVATION,
  PRIOR_CERTIFIED_MARKET_OBSERVATION,
  PROSPECTIVE_MARKET_OBSERVATION_WRITE_FIXTURE,
} from '../lib/prospectiveMarketObservationPersistenceArchitectureFixtures';

assert.equal(REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_STATUS, 'REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_CERTIFIED');
assert.equal(REIE_PROSPECTIVE_HISTORICAL_MARKET_OBSERVATION_PERSISTENCE_NEXT_GATE, 'READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_IMPLEMENTATION_MVV');
assert.equal(evaluateProspectiveMarketObservationWrite(PROSPECTIVE_MARKET_OBSERVATION_WRITE_FIXTURE).state, 'WRITE_ARCHITECTURE_READY');
assert.equal(evaluateProspectiveMarketObservationWrite({ ...PROSPECTIVE_MARKET_OBSERVATION_WRITE_FIXTURE, duplicateObservationExists: true }).state, 'DUPLICATE_OBSERVATION');
assert.equal(evaluateProspectiveMarketObservationWrite({ ...PROSPECTIVE_MARKET_OBSERVATION_WRITE_FIXTURE, sourceFresh: false }).state, 'STALE_SOURCE_SET');
assert.equal(evaluateMarketComparison(CURRENT_CERTIFIED_MARKET_OBSERVATION, PRIOR_CERTIFIED_MARKET_OBSERVATION, 30, 3).state, 'COMPARISON_ELIGIBLE');
assert.equal(evaluateMarketComparison(CURRENT_CERTIFIED_MARKET_OBSERVATION, PRIOR_CERTIFIED_MARKET_OBSERVATION, 30, null).state, 'TOLERANCE_POLICY_REQUIRED');
assert.equal(evaluateMarketComparison(CURRENT_CERTIFIED_MARKET_OBSERVATION, { ...PRIOR_CERTIFIED_MARKET_OBSERVATION, statusScope: 'PENDING' }, 30, 3).state, 'COMPARISON_NOT_ELIGIBLE');
assert.equal(evaluateMarketComparison(CURRENT_CERTIFIED_MARKET_OBSERVATION, { ...PRIOR_CERTIFIED_MARKET_OBSERVATION, certificationState: 'INVALIDATED', invalidatedAt: '2026-08-01T00:00:00.000Z', invalidationReason: 'fixture' }, 30, 3).state, 'INVALIDATED_OBSERVATION');
assert.equal(MARKET_OBSERVATION_PERSISTENCE_ENTITIES.length, 2);
assert.equal(MARKET_OBSERVATION_PERSISTENCE_ENTITIES[1].name, 'MarketAggregateObservation');
assert(MARKET_OBSERVATION_READ_AUTHORITIES.every((authority) => authority.permittedNow === false));
assert(Object.values(PROSPECTIVE_MARKET_OBSERVATION_PROTECTED_BOUNDARIES).every((value) => value === false));

const source = fs.readFileSync('lib/prospectiveMarketObservationPersistenceArchitecture.ts', 'utf8');
assert.doesNotMatch(source, /fetch\(|PrismaClient|prisma\.|process\.env|from ['"]next|Typesense|CRM/, 'Persistence architecture must remain non-executing.');

console.log('PROSPECTIVE_MARKET_OBSERVATION_PERSISTENCE_ARCHITECTURE_CHECK: PASS');
