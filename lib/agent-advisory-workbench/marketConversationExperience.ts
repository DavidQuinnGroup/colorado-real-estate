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

export const MARKET_CONVERSATION_EXPERIENCE_STATUS = 'DQG_MASTER_APP_MARKET_CONVERSATION_EXPERIENCE_MVV' as const;

export type MarketConversationExperienceState = Readonly<{
  status: typeof MARKET_CONVERSATION_EXPERIENCE_STATUS;
  producer: RealMarketContextProducerResult;
  admission: AgentMarketPreparationAdmission | null;
  briefing: AgentMarketHumanBriefing | null;
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
    humanState: currentness ? 'Currentness needs confirmation' : 'This briefing is unavailable',
    message: currentness
      ? 'The available market evidence is outside its certified review window. Confirm currentness before preparing a briefing.'
      : 'A certified market briefing is not available for this selection. Choose a supported market or review the available evidence first.',
  });
}
export function prepareMarketConversation(marketId: string, asOf: string): MarketConversationExperienceState {
  const producer = produceRealMarketPreparationContext(marketId, asOf);
  if (!producer.context) return unavailable(producer);

  const admission = admitAgentMarketPreparationContext(producer.context);
  const briefing = buildAgentMarketHumanBriefing(admission);
  return Object.freeze({
    status: MARKET_CONVERSATION_EXPERIENCE_STATUS,
    producer,
    admission,
    briefing,
    humanState: briefing.humanState,
    message: admission.state === 'PROFESSIONAL_REVIEW_REQUIRED'
      ? 'Use the supported market context to prepare the conversation, then confirm the point-in-time observations before relying on them.'
      : 'Review the available market context and its verification needs before the conversation.',
  });
}
