import { getCityByMarketSlug, type CityData } from './cities';
import {
  buildMarketNewsletterAgentReviewPackage,
  MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
  type MarketNewsletterEvidenceScenario,
  type MarketNewsletterSourceReference,
} from './content/marketNewsletterPackage';
import { buildMarketAeoContract, MARKET_AEO_BOULDER_PILOT_ROUTE } from './marketAeoPilot';
import { buildCityMarketExperience } from './marketIntelligenceExperience';
import { buildCityMarketProduct3Experience } from './marketProduct3';
import { neighborhoods } from './neighborhoods';

export const REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS =
  'BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTED';
export const REIE_MARKET_AEO_ANSWER_UNIT_CONTRACT_VERSION = '1.0.0';
export const REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE = MARKET_AEO_BOULDER_PILOT_ROUTE;
export const REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL =
  'https://davidquinngroup.com/market/boulder-co-housing-market';

export type ReieAnswerUnitRequirement = 'MANDATORY' | 'CONDITIONAL' | 'NOT_APPLICABLE';
export type ReieAnswerIntent = 'MARKET_POSTURE' | 'INVENTORY_CONTEXT' | 'PRICE_CONTEXT' | 'PACE_CONTEXT' | 'MARKET_READING_BOUNDARY';
export type ReieAnswerEntityType = 'CITY_MARKET';
export type ReieAnswerFreshnessPosture = 'CURRENT' | 'AGING' | 'UNKNOWN' | 'MISSING' | 'CONFLICTING';
export type ReieAnswerConflictPosture = 'NONE' | 'EXPLICIT_CONFLICT' | 'NOT_APPLICABLE';
export type ReieAnswerPublicEligibility = 'INDEXABLE' | 'NOINDEX' | 'UNPUBLISHED' | 'FAIL_CLOSED';
export type ReieCitationEligibility = 'CITATION_READY' | 'CITATION_READY_WITH_LIMITATIONS' | 'NOT_CITATION_READY';
export type ReieAnswerSemanticSchemaType = 'WebPageElement';
export type ReieAnswerUnitPilotScenario =
  | 'NORMAL'
  | 'STALE_SOURCE_EVIDENCE'
  | 'MISSING_MARKET_EVIDENCE'
  | 'SOURCE_CONFLICT'
  | 'UNSUPPORTED_GEOGRAPHY'
  | 'UNSUPPORTED_QUESTION'
  | 'INSUFFICIENT_EVIDENCE_FOR_CITATION';

export type ReieAnswerFact = Readonly<{
  label: string;
  value: string;
  classification: 'FACT' | 'DERIVED_METRIC' | 'CONTEXT';
  sourceReferenceIds: readonly string[];
}>;

export type ReieAnswerUnit = Readonly<{
  answerUnitId: string;
  question: string;
  intent: ReieAnswerIntent;
  canonicalEntity: {
    id: string;
    name: string;
    type: ReieAnswerEntityType;
  };
  geography: {
    city: 'Boulder';
    state: 'Colorado';
    scope: 'city-market';
  };
  conciseAnswer: string;
  supportingFacts: readonly ReieAnswerFact[];
  evidenceSourceReferences: readonly MarketNewsletterSourceReference[];
  evidenceEffectiveAt: string;
  generatedAt: string;
  updatedAt: string;
  freshnessPosture: ReieAnswerFreshnessPosture;
  conflictPosture: ReieAnswerConflictPosture;
  limitations: readonly string[];
  verificationRequirements: readonly string[];
  canonicalUrl: string;
  semanticSchemaType: ReieAnswerSemanticSchemaType;
  relatedEntities: readonly string[];
  relatedQuestions: readonly string[];
  publicEligibility: ReieAnswerPublicEligibility;
  citationEligibility: ReieCitationEligibility;
}>;

export type ReieAnswerUnitPilotResult = Readonly<{
  status: typeof REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS | 'FAIL_CLOSED';
  route: typeof REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE | string;
  generatedAt: string;
  evidenceEffectiveAt: string;
  publicUnits: readonly ReieAnswerUnit[];
  failClosedUnits: readonly ReieAnswerUnit[];
  failClosedReasons: readonly string[];
}>;

export const REIE_ANSWER_UNIT_FIELD_REQUIREMENTS: Record<keyof ReieAnswerUnit, ReieAnswerUnitRequirement> = {
  answerUnitId: 'MANDATORY',
  question: 'MANDATORY',
  intent: 'MANDATORY',
  canonicalEntity: 'MANDATORY',
  geography: 'MANDATORY',
  conciseAnswer: 'MANDATORY',
  supportingFacts: 'MANDATORY',
  evidenceSourceReferences: 'MANDATORY',
  evidenceEffectiveAt: 'MANDATORY',
  generatedAt: 'MANDATORY',
  updatedAt: 'MANDATORY',
  freshnessPosture: 'MANDATORY',
  conflictPosture: 'MANDATORY',
  limitations: 'MANDATORY',
  verificationRequirements: 'MANDATORY',
  canonicalUrl: 'MANDATORY',
  semanticSchemaType: 'CONDITIONAL',
  relatedEntities: 'CONDITIONAL',
  relatedQuestions: 'CONDITIONAL',
  publicEligibility: 'MANDATORY',
  citationEligibility: 'MANDATORY',
};

type AnswerDraft = Readonly<{
  id: string;
  question: string;
  intent: ReieAnswerIntent;
  conciseAnswer: string;
  facts: readonly ReieAnswerFact[];
  relatedQuestions: readonly string[];
  citationEligibility?: ReieCitationEligibility;
}>;

type BuildBoulderMarketAnswerUnitPilotOptions = Readonly<{
  geographySlug?: string;
  generatedAt?: string;
  scenario?: ReieAnswerUnitPilotScenario;
}>;

function getBoulderNeighborhoodCount() {
  return neighborhoods.filter((neighborhood) => neighborhood.city === 'Boulder').length;
}

function sourceIds(sources: readonly MarketNewsletterSourceReference[]) {
  return sources.map((source) => source.sourceId);
}

function getPrimarySources(sources: readonly MarketNewsletterSourceReference[]) {
  const allowed = new Set([
    'SRC-REIE-CITY-MARKET-FACTS',
    'SRC-REIE-CITY-MARKET-EXPERIENCE',
    'SRC-REIE-MARKET-PRODUCT-3',
    'SRC-MLS-LISTING-DATA',
  ]);
  return sources.filter((source) => allowed.has(source.sourceId));
}

function buildSupportedDrafts({
  city,
  generatedAt,
  sourceReferences,
}: {
  city: CityData;
  generatedAt: string;
  sourceReferences: readonly MarketNewsletterSourceReference[];
}): AnswerDraft[] {
  const neighborhoodCount = getBoulderNeighborhoodCount();
  const marketExperience = buildCityMarketExperience(city, neighborhoodCount);
  const productExperience = buildCityMarketProduct3Experience({ city, marketExperience, neighborhoodCount });
  const sourceReferenceIds = sourceIds(sourceReferences);

  return [
    {
      id: 'market-posture',
      question: 'What is happening in the Boulder housing market?',
      intent: 'MARKET_POSTURE',
      conciseAnswer: `Boulder is framed as ${marketExperience.directionLabel.toLowerCase()} with ${marketExperience.competitivenessLabel.toLowerCase()} in the current governed REIE city market snapshot.`,
      facts: [
        {
          label: 'Market posture',
          value: marketExperience.directionLabel,
          classification: 'DERIVED_METRIC',
          sourceReferenceIds: ['SRC-REIE-CITY-MARKET-EXPERIENCE'],
        },
        {
          label: 'Evidence state',
          value: productExperience.evidenceState,
          classification: 'CONTEXT',
          sourceReferenceIds: ['SRC-REIE-MARKET-PRODUCT-3'],
        },
      ],
      relatedQuestions: ['How quickly are Boulder homes selling?', 'What should I verify before acting on this signal?'],
    },
    {
      id: 'inventory-context',
      question: 'How much housing inventory is available in Boulder?',
      intent: 'INVENTORY_CONTEXT',
      conciseAnswer: `The current Boulder market snapshot carries ${city.stats.inventory} active inventory signal, used as selection-depth context rather than a live MLS guarantee.`,
      facts: [
        {
          label: 'Active inventory signal',
          value: city.stats.inventory,
          classification: 'FACT',
          sourceReferenceIds,
        },
        {
          label: 'Neighborhood context paths',
          value: String(neighborhoodCount),
          classification: 'CONTEXT',
          sourceReferenceIds: ['SRC-REIE-CITY-MARKET-FACTS'],
        },
      ],
      relatedQuestions: ['What is happening in the Boulder housing market?', 'What should I verify before acting on this signal?'],
    },
    {
      id: 'price-context',
      question: 'What is the current Boulder home-price context?',
      intent: 'PRICE_CONTEXT',
      conciseAnswer: `Boulder price context is ${city.stats.medianPrice} median and ${city.stats.pricePerSqFt} per square foot in the governed city market facts; it is not a valuation or appraisal.`,
      facts: [
        {
          label: 'Median price context',
          value: city.stats.medianPrice,
          classification: 'FACT',
          sourceReferenceIds,
        },
        {
          label: 'Price per square foot context',
          value: city.stats.pricePerSqFt,
          classification: 'FACT',
          sourceReferenceIds,
        },
      ],
      relatedQuestions: ['How much housing inventory is available in Boulder?', 'What should I verify before acting on this signal?'],
    },
    {
      id: 'pace-context',
      question: 'How quickly are Boulder homes selling?',
      intent: 'PACE_CONTEXT',
      conciseAnswer: `Boulder pace is represented as ${city.stats.daysOnMarket} days on market and "${marketExperience.timingLabel.toLowerCase()}"; it is preparation context, not a prediction of negotiating outcome.`,
      facts: [
        {
          label: 'Days on market context',
          value: `${city.stats.daysOnMarket} days`,
          classification: 'FACT',
          sourceReferenceIds,
        },
        {
          label: 'Timing context',
          value: marketExperience.timingLabel,
          classification: 'DERIVED_METRIC',
          sourceReferenceIds: ['SRC-REIE-CITY-MARKET-EXPERIENCE'],
        },
      ],
      relatedQuestions: ['What is happening in the Boulder housing market?', 'What should I verify before acting on this signal?'],
    },
    {
      id: 'reading-boundary',
      question: 'What should a buyer or seller understand when reading the current Boulder market data?',
      intent: 'MARKET_READING_BOUNDARY',
      conciseAnswer:
        'Use Boulder market data to decide what to verify next: live inventory, property condition, comparable context, disclosures, financing, insurance, taxes, HOA details, and advisor guidance.',
      facts: [
        {
          label: 'Verification path',
          value: productExperience.verificationPrompt,
          classification: 'CONTEXT',
          sourceReferenceIds: ['SRC-REIE-MARKET-PRODUCT-3'],
        },
        {
          label: 'Generated for pilot',
          value: generatedAt,
          classification: 'CONTEXT',
          sourceReferenceIds: ['SRC-REIE-CITY-MARKET-FACTS'],
        },
      ],
      relatedQuestions: ['What is happening in the Boulder housing market?', 'What should I not conclude from Boulder market data?'],
      citationEligibility: 'CITATION_READY_WITH_LIMITATIONS',
    },
  ];
}

function scenarioToPackageScenario(scenario: ReieAnswerUnitPilotScenario): MarketNewsletterEvidenceScenario {
  if (scenario === 'STALE_SOURCE_EVIDENCE') return 'STALE_SOURCE_EVIDENCE';
  if (scenario === 'MISSING_MARKET_EVIDENCE') return 'MISSING_MARKET_EVIDENCE';
  if (scenario === 'SOURCE_CONFLICT') return 'SOURCE_CONFLICT';
  return 'NORMAL';
}

function freshnessForScenario(scenario: ReieAnswerUnitPilotScenario): ReieAnswerFreshnessPosture {
  if (scenario === 'STALE_SOURCE_EVIDENCE') return 'AGING';
  if (scenario === 'MISSING_MARKET_EVIDENCE') return 'MISSING';
  if (scenario === 'SOURCE_CONFLICT') return 'CONFLICTING';
  return 'CURRENT';
}

function conflictForScenario(scenario: ReieAnswerUnitPilotScenario): ReieAnswerConflictPosture {
  return scenario === 'SOURCE_CONFLICT' ? 'EXPLICIT_CONFLICT' : 'NONE';
}

function publicEligibilityForScenario(scenario: ReieAnswerUnitPilotScenario): ReieAnswerPublicEligibility {
  if (scenario === 'MISSING_MARKET_EVIDENCE' || scenario === 'SOURCE_CONFLICT' || scenario === 'UNSUPPORTED_GEOGRAPHY') {
    return 'FAIL_CLOSED';
  }
  if (scenario === 'UNSUPPORTED_QUESTION') return 'FAIL_CLOSED';
  return 'INDEXABLE';
}

function citationForScenario(
  scenario: ReieAnswerUnitPilotScenario,
  fallback: ReieCitationEligibility = 'CITATION_READY_WITH_LIMITATIONS',
): ReieCitationEligibility {
  if (
    scenario === 'MISSING_MARKET_EVIDENCE' ||
    scenario === 'SOURCE_CONFLICT' ||
    scenario === 'UNSUPPORTED_GEOGRAPHY' ||
    scenario === 'UNSUPPORTED_QUESTION' ||
    scenario === 'INSUFFICIENT_EVIDENCE_FOR_CITATION'
  ) {
    return 'NOT_CITATION_READY';
  }
  return fallback;
}

function limitationsForScenario(scenario: ReieAnswerUnitPilotScenario, contractLimitations: readonly string[]) {
  const scenarioLimitations: string[] = [];
  if (scenario === 'STALE_SOURCE_EVIDENCE') {
    scenarioLimitations.push('Freshness is aging; answer remains public only with explicit limitations.');
  }
  if (scenario === 'INSUFFICIENT_EVIDENCE_FOR_CITATION') {
    scenarioLimitations.push('Answer may be useful to humans but is not eligible for citation until evidence support improves.');
  }
  if (scenario === 'SOURCE_CONFLICT') {
    scenarioLimitations.push('Conflicting source posture fails closed; no public factual answer should be rendered.');
  }
  return [...contractLimitations, ...scenarioLimitations];
}

function unitFromDraft({
  draft,
  city,
  generatedAt,
  evidenceEffectiveAt,
  sourceReferences,
  scenario,
  limitations,
}: {
  draft: AnswerDraft;
  city: CityData;
  generatedAt: string;
  evidenceEffectiveAt: string;
  sourceReferences: readonly MarketNewsletterSourceReference[];
  scenario: ReieAnswerUnitPilotScenario;
  limitations: readonly string[];
}): ReieAnswerUnit {
  const publicEligibility = publicEligibilityForScenario(scenario);

  return Object.freeze({
    answerUnitId: `reie-answer-unit-market-boulder-${draft.id}`,
    question: draft.question,
    intent: draft.intent,
    canonicalEntity: {
      id: `city-market:${city.marketSlug}`,
      name: `${city.name} Market`,
      type: 'CITY_MARKET' as const,
    },
    geography: {
      city: 'Boulder' as const,
      state: 'Colorado' as const,
      scope: 'city-market' as const,
    },
    conciseAnswer: draft.conciseAnswer,
    supportingFacts: draft.facts,
    evidenceSourceReferences: sourceReferences,
    evidenceEffectiveAt,
    generatedAt,
    updatedAt: generatedAt,
    freshnessPosture: freshnessForScenario(scenario),
    conflictPosture: conflictForScenario(scenario),
    limitations,
    verificationRequirements: [
      'Verify live inventory before treating selection depth as current availability.',
      'Verify property condition, comparable context, disclosures, financing, insurance, taxes, HOA details, and advisor guidance before relying on a property-specific conclusion.',
      'Do not treat this market answer as appreciation prediction, investment recommendation, valuation certainty, suitability, or buy/sell timing advice.',
    ],
    canonicalUrl: REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL,
    semanticSchemaType: 'WebPageElement',
    relatedEntities: ['Colorado', 'Boulder', 'Boulder Market', 'REIE governed city market facts'],
    relatedQuestions: draft.relatedQuestions,
    publicEligibility,
    citationEligibility: citationForScenario(scenario, draft.citationEligibility),
  });
}

function unsupportedUnit({
  generatedAt,
  reason,
  scenario,
}: {
  generatedAt: string;
  reason: string;
  scenario: ReieAnswerUnitPilotScenario;
}): ReieAnswerUnit {
  return Object.freeze({
    answerUnitId: `reie-answer-unit-market-boulder-fail-closed-${scenario.toLowerCase().replace(/_/g, '-')}`,
    question: 'Unsupported Boulder market answer request',
    intent: 'MARKET_READING_BOUNDARY',
    canonicalEntity: {
      id: `city-market:${REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE}`,
      name: 'Boulder Market',
      type: 'CITY_MARKET' as const,
    },
    geography: {
      city: 'Boulder' as const,
      state: 'Colorado' as const,
      scope: 'city-market' as const,
    },
    conciseAnswer: reason,
    supportingFacts: [],
    evidenceSourceReferences: [],
    evidenceEffectiveAt: generatedAt.slice(0, 10),
    generatedAt,
    updatedAt: generatedAt,
    freshnessPosture: freshnessForScenario(scenario),
    conflictPosture: scenario === 'SOURCE_CONFLICT' ? 'EXPLICIT_CONFLICT' : 'NOT_APPLICABLE',
    limitations: [reason, 'No unsafe fallback prose is generated for unsupported or insufficient evidence states.'],
    verificationRequirements: ['Restore supported Boulder market evidence before publishing this answer unit.'],
    canonicalUrl: REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL,
    semanticSchemaType: 'WebPageElement',
    relatedEntities: ['Boulder', 'Colorado'],
    relatedQuestions: [],
    publicEligibility: 'FAIL_CLOSED',
    citationEligibility: 'NOT_CITATION_READY',
  });
}

export function buildBoulderMarketAnswerUnitPilot(
  options: BuildBoulderMarketAnswerUnitPilotOptions = {},
): ReieAnswerUnitPilotResult {
  const generatedAt = options.generatedAt ?? '2026-08-13T00:00:00.000Z';
  const requestedRoute = options.geographySlug ?? REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE;
  const scenario = options.scenario ?? 'NORMAL';

  if (requestedRoute !== REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE || scenario === 'UNSUPPORTED_GEOGRAPHY') {
    const failClosedUnit = unsupportedUnit({
      generatedAt,
      scenario: 'UNSUPPORTED_GEOGRAPHY',
      reason: 'Only the Boulder city market route is supported by this answer-unit pilot.',
    });
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: failClosedUnit.evidenceEffectiveAt,
      publicUnits: [],
      failClosedUnits: [failClosedUnit],
      failClosedReasons: [...failClosedUnit.limitations],
    };
  }

  if (scenario === 'UNSUPPORTED_QUESTION') {
    const failClosedUnit = unsupportedUnit({
      generatedAt,
      scenario,
      reason: 'The requested answer intent is outside the Boulder market pilot question set.',
    });
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: failClosedUnit.evidenceEffectiveAt,
      publicUnits: [],
      failClosedUnits: [failClosedUnit],
      failClosedReasons: [...failClosedUnit.limitations],
    };
  }

  const packageResult = buildMarketNewsletterAgentReviewPackage({
    geographySlug: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG,
    generatedAt,
    evidenceScenario: scenarioToPackageScenario(scenario),
  });

  if (packageResult.status === 'FAIL_CLOSED') {
    const failClosedUnit = unsupportedUnit({
      generatedAt,
      scenario: scenario === 'SOURCE_CONFLICT' ? 'SOURCE_CONFLICT' : 'MISSING_MARKET_EVIDENCE',
      reason: packageResult.reviewFlags[0]?.message ?? 'Boulder market evidence is insufficient for public answer units.',
    });
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
      publicUnits: [],
      failClosedUnits: [failClosedUnit],
      failClosedReasons: [...failClosedUnit.limitations],
    };
  }

  const city = getCityByMarketSlug(REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE);
  if (!city) {
    const failClosedUnit = unsupportedUnit({
      generatedAt,
      scenario: 'MISSING_MARKET_EVIDENCE',
      reason: 'Boulder city market facts are unavailable.',
    });
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
      publicUnits: [],
      failClosedUnits: [failClosedUnit],
      failClosedReasons: [...failClosedUnit.limitations],
    };
  }

  const marketExperience = buildCityMarketExperience(city, getBoulderNeighborhoodCount());
  const marketAeoContract = buildMarketAeoContract({
    city,
    marketExperience,
    neighborhoodCount: getBoulderNeighborhoodCount(),
  });
  if (!marketAeoContract) {
    const failClosedUnit = unsupportedUnit({
      generatedAt,
      scenario: 'MISSING_MARKET_EVIDENCE',
      reason: 'Boulder Market AEO contract is unavailable.',
    });
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
      publicUnits: [],
      failClosedUnits: [failClosedUnit],
      failClosedReasons: [...failClosedUnit.limitations],
    };
  }

  const sourceReferences = getPrimarySources(packageResult.sourceReferences);
  const limitations = limitationsForScenario(scenario, marketAeoContract.limitations);
  const units = buildSupportedDrafts({
    city,
    generatedAt,
    sourceReferences,
  }).map((draft) =>
    unitFromDraft({
      draft,
      city,
      generatedAt,
      evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
      sourceReferences,
      scenario,
      limitations,
    }),
  );

  if (scenario === 'SOURCE_CONFLICT') {
    return {
      status: 'FAIL_CLOSED',
      route: requestedRoute,
      generatedAt,
      evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
      publicUnits: [],
      failClosedUnits: units,
      failClosedReasons: ['Conflicting source posture fails closed before public rendering.'],
    };
  }

  return {
    status: REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS,
    route: requestedRoute,
    generatedAt,
    evidenceEffectiveAt: packageResult.evidenceEffectiveDate,
    publicUnits: units.filter((unit) => unit.publicEligibility === 'INDEXABLE'),
    failClosedUnits: units.filter((unit) => unit.publicEligibility === 'FAIL_CLOSED'),
    failClosedReasons: [],
  };
}
