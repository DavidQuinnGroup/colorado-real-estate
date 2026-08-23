import { prepareMarketConversation } from './marketConversationExperience';

export const AGENT_MARKET_UPDATE_PREPARATION_STATUS = 'PROJECT_ATLAS_AGENT_MARKET_UPDATE_PREPARATION_ADMITTED' as const;
export const AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION = 'PROJECT_ATLAS_AGENT_MARKET_UPDATE_PREPARATION_CERTIFIED' as const;

export const MARKET_UPDATE_AUDIENCES = ['BUYER', 'SELLER', 'HOMEOWNER', 'PROSPECT', 'GENERAL'] as const;
export const MARKET_UPDATE_PURPOSES = ['MARKET_CHECK_IN', 'BUYER_MARKET_UPDATE', 'SELLER_MARKET_UPDATE', 'HOMEOWNER_UPDATE', 'GENERAL_MARKET_CONVERSATION'] as const;
export const MARKET_UPDATE_TOPICS = ['INVENTORY', 'DAYS_ON_MARKET', 'MEDIAN_PRICE'] as const;

export type MarketUpdateAudience = (typeof MARKET_UPDATE_AUDIENCES)[number];
export type MarketUpdatePurpose = (typeof MARKET_UPDATE_PURPOSES)[number];
export type MarketUpdateTopic = (typeof MARKET_UPDATE_TOPICS)[number];

export type MarketUpdatePreparationInput = Readonly<{
  marketId: string;
  audience: MarketUpdateAudience;
  purpose: MarketUpdatePurpose;
  topics: readonly MarketUpdateTopic[];
  asOf: string;
}>;

export type MarketUpdatePreparation = Readonly<{
  status: typeof AGENT_MARKET_UPDATE_PREPARATION_STATUS;
  certification: typeof AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION;
  state: 'READY_FOR_HUMAN_REVIEW' | 'EVIDENCE_REVIEW_REQUIRED' | 'NOT_READY';
  input: MarketUpdatePreparationInput;
  executiveSummary: string;
  observations: readonly Readonly<{ label: string; value: string; observationDate: string; sourceId: string | null; freshness: 'CURRENT' | 'STALE' }> [];
  whatChanged: string;
  audienceContext: string;
  talkingPoints: readonly string[];
  clientFriendlyExplanations: readonly string[];
  questionsWorthAsking: readonly string[];
  interpretationLimits: readonly string[];
  sourceFreshness: readonly string[];
  verificationCheckpoints: readonly string[];
  agentNextActions: readonly string[];
  optionalDraftLanguage: string;
  boundaries: Readonly<{
    sessionOnly: true;
    persistence: false;
    customerData: false;
    recipientSelection: false;
    communicationExecution: false;
    adminInheritance: false;
    providerActivity: false;
  }>;
}>;

const TOPIC_MATCHERS: Readonly<Record<MarketUpdateTopic, string>> = Object.freeze({
  INVENTORY: 'inventory',
  DAYS_ON_MARKET: 'days-on-market',
  MEDIAN_PRICE: 'median-price',
});

const audienceContext: Readonly<Record<MarketUpdateAudience, string>> = Object.freeze({
  BUYER: 'Use the dated market snapshot to prepare questions about current choice, timing, and competition. It does not recommend a purchase, offer, or negotiation approach.',
  SELLER: 'Use the dated market snapshot to prepare questions about current supply and buyer activity. It does not establish a list price, timing recommendation, or value conclusion.',
  HOMEOWNER: 'Use the dated market snapshot to prepare a high-level market conversation. It does not establish the value, condition, or sale readiness of a specific property.',
  PROSPECT: 'Use the dated market snapshot to explain the available market context and invite questions. It does not infer goals, priorities, or readiness.',
  GENERAL: 'Use the dated market snapshot as a neutral conversation starting point. It does not make a forecast, strategy recommendation, or suitability conclusion.',
});

function isAudience(value: string): value is MarketUpdateAudience {
  return MARKET_UPDATE_AUDIENCES.includes(value as MarketUpdateAudience);
}

function isPurpose(value: string): value is MarketUpdatePurpose {
  return MARKET_UPDATE_PURPOSES.includes(value as MarketUpdatePurpose);
}

function isTopic(value: string): value is MarketUpdateTopic {
  return MARKET_UPDATE_TOPICS.includes(value as MarketUpdateTopic);
}

function uniqueTopics(topics: readonly MarketUpdateTopic[]) {
  return [...new Set(topics.filter((topic) => isTopic(topic)))];
}

function notReady(input: MarketUpdatePreparationInput): MarketUpdatePreparation {
  return Object.freeze({
    status: AGENT_MARKET_UPDATE_PREPARATION_STATUS,
    certification: AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION,
    state: 'NOT_READY',
    input,
    executiveSummary: 'A supported market, audience, purpose, and at least one evidence topic are required before preparing an update.',
    observations: Object.freeze([]),
    whatChanged: 'No market interpretation is available without admitted evidence.',
    audienceContext: 'No audience-specific preparation is available.',
    talkingPoints: Object.freeze([]),
    clientFriendlyExplanations: Object.freeze([]),
    questionsWorthAsking: Object.freeze([]),
    interpretationLimits: Object.freeze(['Do not create an update until supported, dated market evidence is available.']),
    sourceFreshness: Object.freeze([]),
    verificationCheckpoints: Object.freeze([]),
    agentNextActions: Object.freeze(['Choose a supported market and explicit preparation context.']),
    optionalDraftLanguage: '',
    boundaries: Object.freeze({ sessionOnly: true, persistence: false, customerData: false, recipientSelection: false, communicationExecution: false, adminInheritance: false, providerActivity: false }),
  });
}

export function prepareAgentMarketUpdate(input: MarketUpdatePreparationInput): MarketUpdatePreparation {
  const normalized: MarketUpdatePreparationInput = Object.freeze({
    marketId: input.marketId.trim(),
    audience: input.audience,
    purpose: input.purpose,
    topics: Object.freeze(uniqueTopics(input.topics)),
    asOf: input.asOf.trim(),
  });
  if (!normalized.marketId || !isAudience(normalized.audience) || !isPurpose(normalized.purpose) || !normalized.topics.length || !normalized.asOf) return notReady(normalized);

  const experience = prepareMarketConversation(normalized.marketId, normalized.asOf);
  const briefing = experience.briefing;
  if (!briefing?.briefingSummary) return notReady(normalized);

  const observations = normalized.topics.map((topic) => {
    const evidence = briefing.whatMatters.find((item) => item.id.includes(TOPIC_MATCHERS[topic]));
    const posture = evidence ? briefing.evidencePosture.find((item) => item.observationId.includes(TOPIC_MATCHERS[topic])) : undefined;
    return evidence && posture ? Object.freeze({
      label: evidence.label,
      value: String(evidence.value),
      observationDate: posture.observationDate,
      sourceId: posture.sourceIdentity,
      freshness: posture.freshness,
    }) : null;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (!observations.length) return notReady(normalized);

  const observationList = observations.map((item) => `${item.label}: ${item.value}`).join('; ');
  const sourceFreshness = [...new Set(observations.map((item) => `${item.sourceId ?? 'Repository-local market context'}; observed ${item.observationDate}; ${item.freshness.toLowerCase()}.`))];
  const evidenceReviewRequired = briefing.state !== 'READY' || observations.some((item) => item.freshness !== 'CURRENT');

  return Object.freeze({
    status: AGENT_MARKET_UPDATE_PREPARATION_STATUS,
    certification: AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION,
    state: evidenceReviewRequired ? 'EVIDENCE_REVIEW_REQUIRED' : 'READY_FOR_HUMAN_REVIEW',
    input: normalized,
    executiveSummary: `Prepare a dated ${briefing.briefingSummary.marketLabel} update using the selected evidence. Review the visible source date and verification needs before relying on it in a live conversation.`,
    observations: Object.freeze(observations),
    whatChanged: 'This preparation identifies selected signals from one dated snapshot. It does not assert a trend, forecast, or comparison without separately admitted comparison evidence.',
    audienceContext: audienceContext[normalized.audience],
    talkingPoints: Object.freeze(observations.map((item) => `Observed fact: ${item.label} is recorded as ${item.value} on ${item.observationDate}.`)),
    clientFriendlyExplanations: Object.freeze(observations.map((item) => `${item.label} is one market-level signal. It helps frame questions, but it does not determine what will happen for a specific property or situation.`)),
    questionsWorthAsking: Object.freeze([
      ...briefing.questionsToPrepare.slice(0, 2),
      'What has changed since the visible source date that should be verified before this update is used?',
    ]),
    interpretationLimits: Object.freeze([
      ...briefing.limitations,
      'No prediction, recommendation, pricing, offer, negotiation, investment, ranking, suitability, or protected-class inference is produced.',
    ]),
    sourceFreshness: Object.freeze(sourceFreshness),
    verificationCheckpoints: Object.freeze(briefing.whatNeedsVerification),
    agentNextActions: Object.freeze([
      'Review the source date, freshness, and limitations with the selected market context.',
      'Confirm material current conditions before relying on the update in a live conversation.',
      'Personally review and adapt any optional language before external use.',
    ]),
    optionalDraftLanguage: `For your review, the available ${briefing.briefingSummary.marketLabel} snapshot records ${observationList}. This is dated market context, not a forecast or property-specific conclusion. Before using it in a current conversation, I will verify whether the relevant market conditions have changed.`,
    boundaries: Object.freeze({ sessionOnly: true, persistence: false, customerData: false, recipientSelection: false, communicationExecution: false, adminInheritance: false, providerActivity: false }),
  });
}
