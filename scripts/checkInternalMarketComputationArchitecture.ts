import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  CURRENT_MARKET_METRICS,
  HISTORICAL_COMPARISON_READINESS,
  HISTORICAL_MARKET_EVIDENCE_INVENTORY,
  MARKET_ARCHITECTURE_PROTECTED_BOUNDARIES,
  MARKET_OBSERVATION_VERSIONING,
  MARKET_SNAPSHOT_ARCHITECTURE_OPTIONS,
  PREFERRED_MARKET_SNAPSHOT_ARCHITECTURE,
  REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_STATUS,
  REIE_HISTORICAL_MARKET_OBSERVATION_NEXT_GATE,
  REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_STATUS,
  REIE_INTERNAL_MARKET_COMPUTATION_NEXT_GATE,
  assessMarketObservationQuality,
  evaluateInheritedMarketSourceGovernance,
} from '../lib/internalMarketComputationArchitecture';
import { MARKET_OBSERVATION_QUALITY_FIXTURES } from '../lib/internalMarketComputationArchitectureFixtures';

assert.equal(REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_STATUS, 'REIE_INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_CERTIFIED');
assert.equal(REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_STATUS, 'REIE_HISTORICAL_MARKET_OBSERVATION_ARCHITECTURE_CERTIFIED');
assert.equal(REIE_INTERNAL_MARKET_COMPUTATION_NEXT_GATE, 'READY_FOR_BOUNDED_CURRENT_MARKET_COMPUTATION_IMPLEMENTATION_MVV');
assert.equal(REIE_HISTORICAL_MARKET_OBSERVATION_NEXT_GATE, 'READY_FOR_BOUNDED_HISTORICAL_OBSERVATION_PERSISTENCE_GATE');

for (const category of ['INVENTORY', 'PRICE', 'PACE', 'SUPPLY_COMPETITION', 'SEGMENT', 'GEOGRAPHY']) {
  assert(CURRENT_MARKET_METRICS.some((metric) => metric.category === category), `Missing ${category} metric inventory.`);
}
assert(CURRENT_MARKET_METRICS.some((metric) => metric.id === 'MEDIAN_LIST_PRICE' && metric.readiness === 'READY_AFTER_STATUS_NORMALIZATION'));
assert(CURRENT_MARKET_METRICS.some((metric) => metric.id === 'MEDIAN_AND_AVERAGE_SOLD_PRICE' && metric.readiness === 'REQUIRES_MISSING_FIELD'));
assert(CURRENT_MARKET_METRICS.some((metric) => metric.id === 'MONTHS_OF_SUPPLY_AND_ABSORPTION' && metric.readiness === 'REQUIRES_HISTORICAL_OBSERVATIONS'));
assert(CURRENT_MARKET_METRICS.some((metric) => metric.id === 'CANONICAL_NEIGHBORHOOD_SUBMARKET_GEOGRAPHY' && metric.readiness === 'READY_AFTER_GEOGRAPHY_NORMALIZATION'));

assert.equal(evaluateInheritedMarketSourceGovernance('CURRENT_AGGREGATE_STATISTIC').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluateInheritedMarketSourceGovernance('AGENT_PROFESSIONAL_SYNTHESIS').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');
assert.equal(evaluateInheritedMarketSourceGovernance('RETAINED_AGGREGATE_SNAPSHOT').decision, 'NOT_BLOCKED_BY_PERMISSION_POSTURE');

assert.deepEqual(assessMarketObservationQuality(MARKET_OBSERVATION_QUALITY_FIXTURES.certifiable), { state: 'CERTIFIABLE', reasons: [] });
assert.deepEqual(assessMarketObservationQuality(MARKET_OBSERVATION_QUALITY_FIXTURES.degraded), { state: 'DEGRADED', reasons: ['DUPLICATE_CONTAMINATION', 'GEOGRAPHY_UNRESOLVED', 'MINIMUM_SAMPLE_NOT_MET', 'REQUIRED_FIELDS_INCOMPLETE', 'STATUS_NORMALIZATION_UNCERTAIN'] });
assert.equal(assessMarketObservationQuality(MARKET_OBSERVATION_QUALITY_FIXTURES.stale).state, 'BLOCKED');
assert.equal(assessMarketObservationQuality(MARKET_OBSERVATION_QUALITY_FIXTURES.incompleteRetrieval).state, 'BLOCKED');
assert.equal(assessMarketObservationQuality(MARKET_OBSERVATION_QUALITY_FIXTURES.unknownVersion).state, 'BLOCKED');

assert.equal(HISTORICAL_MARKET_EVIDENCE_INVENTORY.find((item) => item.evidenceClass === 'OBSERVATION_HISTORY')?.state, 'REQUIRES_PROSPECTIVE_SNAPSHOT');
assert(HISTORICAL_COMPARISON_READINESS.every((item) => item.state === 'REQUIRES_PROSPECTIVE_SNAPSHOT'));
assert.equal(MARKET_SNAPSHOT_ARCHITECTURE_OPTIONS.length, 3);
assert.equal(PREFERRED_MARKET_SNAPSHOT_ARCHITECTURE.id, 'NORMALIZED_LISTING_OBSERVATION_PLUS_AGGREGATE');
assert.equal(PREFERRED_MARKET_SNAPSHOT_ARCHITECTURE.rawPayloadRetention, false);
assert(Object.values(MARKET_OBSERVATION_VERSIONING).every((value) => value.startsWith('REQUIRED')));
assert(Object.values(MARKET_ARCHITECTURE_PROTECTED_BOUNDARIES).every((value) => value === false));

const contractSource = fs.readFileSync('lib/internalMarketComputationArchitecture.ts', 'utf8');
assert.doesNotMatch(contractSource, /fetch\(|PrismaClient|prisma\.|process\.env|from ['"]next|from ['"]@prisma|from ['"]@\/lib\/prisma/, 'Architecture contract must remain side-effect free.');

console.log('INTERNAL_MARKET_COMPUTATION_ARCHITECTURE_CHECK: PASS');
