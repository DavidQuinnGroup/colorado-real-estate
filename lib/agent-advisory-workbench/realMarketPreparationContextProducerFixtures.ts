import { cities } from '../cities';
import { EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX, runEvidenceExpansionDryRun } from '../coloradoCityEvidenceExpansion';
import { REAL_MARKET_CONTEXT_SOURCE_ID, type RealMarketContextProducerEvaluationInput } from './realMarketPreparationContextProducer';

const source = EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.find((item) => item.sourceId === REAL_MARKET_CONTEXT_SOURCE_ID)!;
const boulder = cities.find((city) => city.marketSlug === 'boulder-co-housing-market')!;
const candidates = runEvidenceExpansionDryRun();

const input = (overrides: Partial<RealMarketContextProducerEvaluationInput> = {}): RealMarketContextProducerEvaluationInput => ({
  marketId: boulder.marketSlug,
  asOf: '2026-08-20',
  city: boulder,
  source,
  candidates,
  ...overrides,
});

export const REAL_MARKET_PREPARATION_CONTEXT_PRODUCER_FIXTURES = Object.freeze({
  complete: input(),
  unknownMarket: input({ marketId: 'niwot-co-housing-market', city: null }),
  unknownRights: input({ source: { ...source, rightsStatus: 'OPEN_DATA_REVIEW_REQUIRED' } }),
  stale: input({ asOf: '2026-08-30' }),
  conflicting: input({ candidates: candidates.map((candidate) => candidate.city === 'Boulder' && candidate.domain === 'MARKET_INTERPRETATION' ? { ...candidate, conflictKey: 'CONFLICT-BOULDER' } : candidate) }),
  incomplete: input({ candidates: candidates.filter((candidate) => candidate.assertionKind !== 'city-market-statistics') }),
  sourceRuntime: input({ source: { ...source, automationFeasibility: 'DRY_RUN_ONLY' } }),
});
