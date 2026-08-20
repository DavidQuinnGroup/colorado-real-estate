import { cities, type CityData } from '../cities';
import {
  EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX,
  runEvidenceExpansionDryRun,
  type EvidenceCandidate,
  type EvidenceExpansionSource,
} from '../coloradoCityEvidenceExpansion';
import { COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE } from '../coloradoCityIntelligenceFactory';
import type { AgentMarketPreparationContextInput, AgentMarketObservation } from './agentMarketPreparationContextAdapter';

export const REAL_MARKET_CONTEXT_PRODUCER_STATUS = 'DQG_AGENT_MARKET_REAL_CERTIFIED_CONTEXT_PRODUCER_MVV' as const;
export const REAL_MARKET_CONTEXT_SOURCE_ID = 'EXP-SRC-REIE-CITY-MARKET-DATA' as const;
export const REAL_MARKET_CONTEXT_MAX_AGE_DAYS = 31;

const SUPPORTED_MARKET_IDS = [
  'boulder-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'superior-co-housing-market',
  'erie-co-housing-market',
  'longmont-co-housing-market',
] as const;

export type RealMarketContextProducerState =
  | 'CERTIFIED'
  | 'UNKNOWN_MARKET'
  | 'SOURCE_NOT_CERTIFIED'
  | 'RIGHTS_NOT_PERMITTED'
  | 'STALE_SOURCE'
  | 'INCOMPLETE_SOURCE'
  | 'CONFLICTING_SOURCE'
  | 'INVALID_AS_OF_DATE';

export type RealMarketContextProducerResult = Readonly<{
  status: typeof REAL_MARKET_CONTEXT_PRODUCER_STATUS;
  state: RealMarketContextProducerState;
  context: AgentMarketPreparationContextInput | null;
  reasons: readonly string[];
}>;

export type RealMarketContextProducerEvaluationInput = Readonly<{
  marketId: string;
  asOf: string;
  city: CityData | null;
  source: EvidenceExpansionSource | null;
  candidates: readonly EvidenceCandidate[];
}>;

function fail(state: Exclude<RealMarketContextProducerState, 'CERTIFIED'>, reasons: readonly string[]): RealMarketContextProducerResult {
  return Object.freeze({
    status: REAL_MARKET_CONTEXT_PRODUCER_STATUS,
    state,
    context: null,
    reasons: Object.freeze([...new Set(reasons)].sort()),
  });
}

function parseIsoDay(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day ? timestamp : null;
}

function buildObservations(city: CityData): readonly AgentMarketObservation[] {
  const marketId = city.marketSlug;
  const fields: readonly Readonly<{ id: string; label: string; value: string }>[] = [
    { id: 'inventory', label: 'Active inventory signal', value: `${city.stats.inventory} active inventory signal` },
    { id: 'days-on-market', label: 'Days-on-market context', value: `${city.stats.daysOnMarket} days-on-market context` },
    { id: 'median-price', label: 'Median-price context', value: `${city.stats.medianPrice} median-price context` },
  ];

  return Object.freeze(fields.map((field) => Object.freeze({
    id: `${marketId}-${field.id}`,
    label: `${city.name} ${field.label}`,
    evidence: Object.freeze({
      id: `${marketId}-${field.id}-evidence`,
      label: `${city.name} ${field.label}`,
      value: field.value,
      classification: 'FACT' as const,
      provenance: Object.freeze({
        origin: 'GOVERNED_SOURCE_FACT' as const,
        reference: 'Repository-local city market statistics and Decision Guide registry',
        sourceId: REAL_MARKET_CONTEXT_SOURCE_ID,
        freshness: 'CURRENT' as const,
        rights: 'REVIEWED' as const,
      }),
      visibility: 'AGENT_ONLY' as const,
      verification: 'REQUIRED' as const,
      prohibitedUse: Object.freeze(['NO_PREDICTION', 'NO_RECOMMENDATION', 'NO_RANKING', 'NO_SCORING', 'NO_SUITABILITY']),
    }),
    sourceClass: 'CERTIFIED_MARKET_EVIDENCE' as const,
    observationDate: COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
    effectiveDate: COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
    freshness: 'CURRENT' as const,
    permittedUse: 'AGENT_MARKET_PREPARATION_APPROVED' as const,
    completeness: 'COMPLETE' as const,
    conflict: 'NO_CONFLICT' as const,
    certification: 'CERTIFIED' as const,
    professionalVerificationRequired: true,
  })));
}

export function evaluateRealMarketPreparationContext(input: RealMarketContextProducerEvaluationInput): RealMarketContextProducerResult {
  const marketId = input.marketId.trim().toLowerCase();
  const asOf = parseIsoDay(input.asOf);
  const observedAt = parseIsoDay(COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE);
  if (asOf === null || observedAt === null) return fail('INVALID_AS_OF_DATE', ['VALID_AS_OF_DATE_REQUIRED']);
  if (!SUPPORTED_MARKET_IDS.includes(marketId as (typeof SUPPORTED_MARKET_IDS)[number]) || !input.city || input.city.marketSlug !== marketId) {
    return fail('UNKNOWN_MARKET', ['SUPPORTED_CANONICAL_MARKET_ID_REQUIRED']);
  }
  if (!input.source || input.source.sourceId !== REAL_MARKET_CONTEXT_SOURCE_ID || input.source.accessMethod !== 'REPOSITORY_LOCAL' || input.source.automationFeasibility !== 'READY_REPOSITORY_LOCAL') {
    return fail('SOURCE_NOT_CERTIFIED', ['CERTIFIED_REPOSITORY_LOCAL_MARKET_SOURCE_REQUIRED']);
  }
  if (input.source.rightsStatus !== 'PUBLIC_TERMS_IDENTIFIED' || input.source.permittedStorage !== 'YES_REPOSITORY_LOCAL') {
    return fail('RIGHTS_NOT_PERMITTED', ['REVIEWED_INTERNAL_REPOSITORY_RIGHTS_REQUIRED']);
  }
  if (asOf < observedAt || (asOf - observedAt) / 86_400_000 > REAL_MARKET_CONTEXT_MAX_AGE_DAYS) {
    return fail('STALE_SOURCE', ['MARKET_SOURCE_FRESHNESS_CONFIRMATION_REQUIRED']);
  }

  const marketCandidates = input.candidates.filter((candidate) => candidate.city === input.city!.name && candidate.sourceId === REAL_MARKET_CONTEXT_SOURCE_ID && candidate.domain === 'MARKET_INTERPRETATION');
  if (marketCandidates.some((candidate) => candidate.conflictKey !== null)) return fail('CONFLICTING_SOURCE', ['MARKET_SOURCE_CONFLICT_REQUIRES_REVIEW']);
  if (!marketCandidates.some((candidate) => candidate.status === 'CANDIDATE_CREATED' && candidate.assertionKind === 'city-market-statistics')) {
    return fail('INCOMPLETE_SOURCE', ['COMPLETE_CERTIFIED_MARKET_OBSERVATIONS_REQUIRED']);
  }

  const observations = buildObservations(input.city);
  if (observations.length < 3) return fail('INCOMPLETE_SOURCE', ['USEFUL_MARKET_OBSERVATION_THRESHOLD_NOT_MET']);
  const context: AgentMarketPreparationContextInput = Object.freeze({
    contextClass: 'AGENT_MARKET_PREPARATION_CONTEXT',
    task: 'MARKET_CONVERSATION',
    market: Object.freeze({ id: input.city.marketSlug, label: `${input.city.name} market` }),
    observations,
    limitations: Object.freeze([
      'Point-in-time repository market context; confirm current conditions before relying on it.',
      'This context is market-level only and does not establish property-specific value, condition, availability, or strategy.',
    ]),
    verificationQuestions: Object.freeze([
      `Have the ${input.city.name} inventory, days-on-market, and median-price signals changed since ${COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE}?`,
      'Which source-supported market fact should the agent verify before using this context in a conversation?',
    ]),
    professionalHandoffs: Object.freeze([Object.freeze({
      id: `${input.city.marketSlug}-market-verification`,
      role: 'REAL_ESTATE_AGENT' as const,
      questionCategory: 'Current market evidence review',
      whyVerificationIsNeeded: 'Repository market observations are point-in-time and require professional confirmation before conversational reliance.',
      informationToBring: Object.freeze(observations.map((observation) => observation.label)),
      whatReieCannotDetermine: Object.freeze(['A recommendation, pricing strategy, offer strategy, negotiation strategy, or suitability conclusion.']),
      customerSelectedHandoff: false,
      agentPreparationOnly: true,
      contextItemIds: Object.freeze(observations.map((observation) => observation.evidence.id)),
      providerRecommendation: false as const,
      ranking: false as const,
      referralRelationship: false as const,
      automaticCommunication: false as const,
    })]),
    reviewSurfaces: Object.freeze(['MARKET', 'DECISION_GUIDES', 'SOURCES'] as const),
  });
  return Object.freeze({ status: REAL_MARKET_CONTEXT_PRODUCER_STATUS, state: 'CERTIFIED', context, reasons: Object.freeze([]) });
}

export function produceRealMarketPreparationContext(marketId: string, asOf: string): RealMarketContextProducerResult {
  const normalizedMarketId = marketId.trim().toLowerCase();
  return evaluateRealMarketPreparationContext({
    marketId: normalizedMarketId,
    asOf,
    city: cities.find((city) => city.marketSlug === normalizedMarketId) ?? null,
    source: EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.find((source) => source.sourceId === REAL_MARKET_CONTEXT_SOURCE_ID) ?? null,
    candidates: runEvidenceExpansionDryRun(),
  });
}
