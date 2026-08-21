import {
  admitAgentMarketPreparationContext,
  buildAgentMarketHumanBriefing,
  type AgentMarketHumanBriefing,
  type AgentMarketPreparationAdmission,
} from './agentMarketPreparationContextAdapter';
import {
  produceRealMarketPreparationContext,
  type RealMarketContextProducerResult,
} from './realMarketPreparationContextProducer';
import {
  composeAgentBriefing,
  type AgentBriefingComposition,
  type AgentBriefingTraceability,
} from './agentBriefingComposition';

export const MARKET_CONVERSATION_EXPERIENCE_STATUS = 'DQG_MASTER_APP_MARKET_CONVERSATION_EXPERIENCE_MVV' as const;

export type MarketConversationExperienceState = Readonly<{
  status: typeof MARKET_CONVERSATION_EXPERIENCE_STATUS;
  producer: RealMarketContextProducerResult;
  admission: AgentMarketPreparationAdmission | null;
  briefing: AgentMarketHumanBriefing | null;
  composition: AgentBriefingComposition | null;
  humanState: string;
  message: string;
}>;

function unavailable(producer: RealMarketContextProducerResult): MarketConversationExperienceState {
  const currentness = producer.state === 'STALE_SOURCE';
  return Object.freeze({
    status: MARKET_CONVERSATION_EXPERIENCE_STATUS,
    producer,
    admission: null,
    briefing: null,
    composition: null,
    humanState: currentness ? 'Currentness needs confirmation' : 'This briefing is unavailable',
    message: currentness
      ? 'The available market evidence is outside its certified review window. Confirm currentness before preparing a briefing.'
      : 'A certified market briefing is not available for this selection. Choose a supported market or review the available evidence first.',
  });
}

function trace(sourceReferences: readonly string[], evidenceKeys: readonly string[], freshness: AgentBriefingTraceability['freshness'], compositionRule: AgentBriefingTraceability['compositionRule']): AgentBriefingTraceability {
  return { sourceReferences, evidenceKeys, freshness, compositionRule };
}

function display(value: unknown) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : 'Not available';
}

function composeMarketBriefing(briefing: AgentMarketHumanBriefing): AgentBriefingComposition | null {
  if (!briefing.briefingSummary || briefing.whatMatters.length < 3 || !briefing.evidencePosture.length) return null;
  const [inventory, daysOnMarket, medianPrice] = briefing.whatMatters;
  const sourceReferences = briefing.evidencePosture.map((item) => item.sourceIdentity || 'REIE_MARKET_CONTEXT');
  const factKeys = briefing.evidencePosture.map((item) => item.observationId);
  const observedAt = briefing.evidencePosture[0]?.observationDate || 'the recorded observation date';
  const label = briefing.briefingSummary.marketLabel;
  return composeAgentBriefing({
    surface: 'MARKET',
    subject: label,
    executiveBriefing: {
      id: 'market-executive-briefing', contentClass: 'SUPPORTED_SYNTHESIS',
      text: `The available ${label} snapshot records ${inventory.value}, ${medianPrice.value}, and ${daysOnMarket.value}. It is dated ${observedAt}, so it is useful for orientation and should be refreshed before a current client conversation.`,
      traceability: trace(sourceReferences, factKeys, 'POINT_IN_TIME', 'FACT_AND_CONTEXT_SYNTHESIS'),
    },
    whatMatters: [{ id: 'market-orientation', contentClass: 'LIMITATION', text: 'Use the snapshot to frame the available supply, price context, and time on market without inferring a forecast, value conclusion, or strategy.', traceability: trace(sourceReferences, ['market-orientation'], 'POINT_IN_TIME', 'LIMITATION_RENDER') }],
    whyItMatters: [{ id: 'market-why', contentClass: 'SUPPORTED_SYNTHESIS', text: 'The three signals provide a concise starting point for a market conversation; they do not establish the current position of a specific property.', traceability: trace(sourceReferences, ['market-why'], 'POINT_IN_TIME', 'FACT_AND_CONTEXT_SYNTHESIS') }],
    keyEvidence: [
      { id: 'market-inventory', label: inventory.label, value: display(inventory.value), contentClass: 'DIRECT_FACT', text: display(inventory.value), traceability: trace(sourceReferences, [factKeys[0]], 'POINT_IN_TIME', 'DIRECT_RENDER') },
      { id: 'market-days-on-market', label: daysOnMarket.label, value: display(daysOnMarket.value), contentClass: 'DIRECT_FACT', text: display(daysOnMarket.value), traceability: trace(sourceReferences, [factKeys[1]], 'POINT_IN_TIME', 'DIRECT_RENDER') },
      { id: 'market-median-price', label: medianPrice.label, value: display(medianPrice.value), contentClass: 'DIRECT_FACT', text: display(medianPrice.value), traceability: trace(sourceReferences, [factKeys[2]], 'POINT_IN_TIME', 'DIRECT_RENDER') },
    ],
    whatCouldChangeInterpretation: [{ id: 'market-currentness', contentClass: 'VERIFICATION_TRIGGER', text: `Inventory, days on market, and median-price context may have changed since ${observedAt}.`, traceability: trace(sourceReferences, ['market-currentness'], 'POINT_IN_TIME', 'VERIFICATION_TRIGGER_RENDER') }],
    questionsWorthAsking: briefing.questionsToPrepare.slice(0, 3).map((text, index) => ({ id: `market-question-${index + 1}`, text, triggerEvidenceKeys: factKeys })),
    reviewSurfaces: briefing.reviewSurfaces.map((surface) => ({ id: surface, label: surface === 'MARKET' ? 'Market context' : surface === 'DECISION_GUIDES' ? 'Decision guides' : 'Sources and methodology', href: surface === 'MARKET' ? `/market/${label.toLowerCase().replaceAll(' market', '').replaceAll(' ', '-')}-co-housing-market` : surface === 'DECISION_GUIDES' ? '/market' : '/sources' })),
    sourcesFreshnessLimitations: briefing.limitations.map((text, index) => ({ id: `market-limitation-${index + 1}`, contentClass: 'LIMITATION' as const, text, traceability: trace(sourceReferences, [`market-limitation-${index + 1}`], 'POINT_IN_TIME', 'LIMITATION_RENDER') })),
    professionalCheckpoints: [],
  });
}

export function prepareMarketConversation(marketId: string, asOf: string): MarketConversationExperienceState {
  const producer = produceRealMarketPreparationContext(marketId, asOf);
  if (!producer.context) return unavailable(producer);

  const admission = admitAgentMarketPreparationContext(producer.context);
  const briefing = buildAgentMarketHumanBriefing(admission);
  const composition = composeMarketBriefing(briefing);
  return Object.freeze({
    status: MARKET_CONVERSATION_EXPERIENCE_STATUS,
    producer,
    admission,
    briefing,
    composition,
    humanState: briefing.humanState,
    message: admission.state === 'PROFESSIONAL_REVIEW_REQUIRED'
      ? 'Use the supported market context to prepare the conversation, then confirm the point-in-time observations before relying on them.'
      : 'Review the available market context and its verification needs before the conversation.',
  });
}
