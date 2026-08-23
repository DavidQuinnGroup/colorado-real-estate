import { prepareMarketConversation } from './marketConversationExperience';

export const AGENT_MARKET_UPDATE_PREPARATION_STATUS = 'PROJECT_ATLAS_AGENT_MARKET_UPDATE_PREPARATION_ADMITTED' as const;
export const AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION = 'PROJECT_ATLAS_AGENT_MARKET_UPDATE_PREPARATION_CERTIFIED' as const;

export const MARKET_UPDATE_AUDIENCES = ['BUYER', 'SELLER', 'HOMEOWNER', 'PROSPECT', 'GENERAL'] as const;
export const MARKET_UPDATE_PURPOSES = ['MARKET_CHECK_IN', 'BUYER_MARKET_UPDATE', 'SELLER_MARKET_UPDATE', 'HOMEOWNER_UPDATE', 'GENERAL_MARKET_CONVERSATION'] as const;
export const MARKET_UPDATE_TOPICS = ['INVENTORY', 'DAYS_ON_MARKET', 'MEDIAN_PRICE'] as const;
export const MARKET_UPDATE_NARRATIVE_CLASSES = ['DIRECT_OBSERVATION', 'DEFINITIONAL_EXPLANATION', 'RELATIONAL_SYNTHESIS', 'BOUNDED_PROFESSIONAL_QUESTION', 'AUDIENCE_AWARE_EXPLANATION', 'LIMITATION_VERIFICATION'] as const;

export type MarketUpdateAudience = (typeof MARKET_UPDATE_AUDIENCES)[number];
export type MarketUpdatePurpose = (typeof MARKET_UPDATE_PURPOSES)[number];
export type MarketUpdateTopic = (typeof MARKET_UPDATE_TOPICS)[number];
export type MarketUpdateNarrativeClass = (typeof MARKET_UPDATE_NARRATIVE_CLASSES)[number];

export type MarketUpdatePreparationInput = Readonly<{
  marketId: string;
  audience: MarketUpdateAudience;
  purpose: MarketUpdatePurpose;
  topics: readonly MarketUpdateTopic[];
  asOf: string;
}>;

export type MarketUpdateNarrativeStatement = Readonly<{
  class: MarketUpdateNarrativeClass;
  text: string;
  evidenceIds: readonly string[];
}>;

export type MarketUpdateObservation = Readonly<{
  id: MarketUpdateTopic;
  evidenceId: string;
  label: string;
  value: string;
  market: string;
  sourceId: string | null;
  sourceDate: string;
  atlasObservedDate: string;
  freshness: 'CURRENT' | 'STALE';
  verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED';
  directObservation: MarketUpdateNarrativeStatement;
  plainLanguageDescription: MarketUpdateNarrativeStatement;
  semanticQualifier: MarketUpdateNarrativeStatement;
}>;

export type MarketUpdateSourceRecord = Readonly<{
  evidenceId: string;
  sourceId: string | null;
  market: string;
  metric: string;
  sourceDate: string;
  atlasObservedDate: string;
  freshness: 'CURRENT' | 'STALE';
  verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED';
}>;

export type MarketUpdatePreparation = Readonly<{
  status: typeof AGENT_MARKET_UPDATE_PREPARATION_STATUS;
  certification: typeof AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION;
  state: 'READY_FOR_HUMAN_REVIEW' | 'EVIDENCE_REVIEW_REQUIRED' | 'NOT_READY';
  input: MarketUpdatePreparationInput;
  executiveSummary: MarketUpdateNarrativeStatement;
  observations: readonly MarketUpdateObservation[];
  evidenceSynthesis: MarketUpdateNarrativeStatement;
  whatCouldChangeInterpretation: MarketUpdateNarrativeStatement;
  audienceContext: MarketUpdateNarrativeStatement;
  talkingPoints: readonly MarketUpdateNarrativeStatement[];
  clientFriendlyExplanations: readonly MarketUpdateNarrativeStatement[];
  questionsWorthAsking: readonly MarketUpdateNarrativeStatement[];
  interpretationLimits: readonly MarketUpdateNarrativeStatement[];
  sourceFreshness: readonly MarketUpdateSourceRecord[];
  verificationCheckpoints: readonly MarketUpdateNarrativeStatement[];
  agentNextActions: readonly MarketUpdateNarrativeStatement[];
  optionalDraftLanguage: MarketUpdateNarrativeStatement | null;
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

const audienceLabels: Readonly<Record<MarketUpdateAudience, string>> = Object.freeze({
  BUYER: 'buyer',
  SELLER: 'seller',
  HOMEOWNER: 'homeowner',
  PROSPECT: 'prospective client',
  GENERAL: 'general market conversation',
});

const purposeLabels: Readonly<Record<MarketUpdatePurpose, string>> = Object.freeze({
  MARKET_CHECK_IN: 'market check-in',
  BUYER_MARKET_UPDATE: 'buyer market update',
  SELLER_MARKET_UPDATE: 'seller market update',
  HOMEOWNER_UPDATE: 'homeowner update',
  GENERAL_MARKET_CONVERSATION: 'general market conversation',
});

function statement(kind: MarketUpdateNarrativeClass, text: string, evidenceIds: readonly string[] = []): MarketUpdateNarrativeStatement {
  return Object.freeze({ class: kind, text, evidenceIds: Object.freeze([...evidenceIds]) });
}

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

function joined(items: readonly string[]) {
  if (items.length < 2) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function metricValue(topic: MarketUpdateTopic, raw: string) {
  const number = raw.match(/\d[\d,]*/)?.[0] ?? raw;
  if (topic === 'INVENTORY') return `${number} active listings`;
  if (topic === 'DAYS_ON_MARKET') return `${number} days`;
  return raw.replace(/\s+median-price context$/i, '').trim();
}

function metricDefinition(topic: MarketUpdateTopic) {
  if (topic === 'INVENTORY') return Object.freeze({
    label: 'Active inventory',
    description: 'Active inventory describes the homes represented as available for sale in the admitted market snapshot.',
    qualifier: 'This single inventory figure does not show whether available choice is greater or smaller than usual; that requires an admitted prior-period or year-over-year comparison.',
    question: 'How does current active inventory compare with the same period last year or another admitted benchmark?',
    nextStep: 'Compare active inventory with an admitted prior-period or year-over-year benchmark before characterizing buyer choice.',
  });
  if (topic === 'DAYS_ON_MARKET') return Object.freeze({
    label: 'Days on market',
    description: 'The days-on-market measure provides marketing-time context for the admitted market snapshot.',
    qualifier: 'The admitted evidence does not define whether this days-on-market measure is median, average, or another calculation, and it does not establish whether homes are moving faster or slower than before.',
    question: 'Is the current days-on-market measure materially different from an admitted recent range, and how does the source define it?',
    nextStep: 'Confirm the source definition and compare the days-on-market measure with an admitted recent range before describing pace.',
  });
  return Object.freeze({
    label: 'Median price',
    description: 'The median price measure marks the middle of the admitted price distribution in this market snapshot.',
    qualifier: 'The admitted evidence does not identify whether this measure is list price, sold price, or another price definition, and it does not establish price direction.',
    question: 'Does the admitted median-price measure represent list price, sold price, or another source definition?',
    nextStep: 'Confirm the price definition and compare it with admitted prior-period evidence before discussing change.',
  });
}

function audienceExplanation(audience: MarketUpdateAudience) {
  if (audience === 'BUYER') return 'For a buyer conversation, these measures help frame questions about available listings, price context, and marketing-time context. They do not by themselves establish negotiating leverage, affordability, or an offer approach.';
  if (audience === 'SELLER') return 'For a seller conversation, these measures help frame questions about competing inventory, price-positioning context, and marketing-time context. They do not establish a listing price, launch timing, or expected sale result.';
  if (audience === 'HOMEOWNER') return 'For a homeowner conversation, these measures provide broad market orientation and help identify what should be monitored. They are not a property-specific valuation, condition assessment, or sale-readiness conclusion.';
  if (audience === 'PROSPECT') return 'For a prospective-client conversation, these measures provide a clear starting point for market orientation and for identifying the next evidence to review. They do not infer intent, urgency, or readiness.';
  return 'For a general market conversation, these measures provide neutral orientation to the admitted snapshot. They do not assume buyer or seller intent or establish what conditions will do next.';
}

function topicTalkingPoint(observation: MarketUpdateObservation, audience: MarketUpdateAudience): MarketUpdateNarrativeStatement {
  const audienceFocus = audience === 'BUYER' ? 'available choice and search expectations' : audience === 'SELLER' ? 'competing inventory and current positioning questions' : audience === 'HOMEOWNER' ? 'broad market orientation rather than property value' : audience === 'PROSPECT' ? 'the next evidence an Agent would review' : 'a neutral explanation of the current snapshot';
  return statement('AUDIENCE_AWARE_EXPLANATION', `${observation.label}: ${observation.value}. In this ${audienceLabels[audience]} conversation, it is useful for ${audienceFocus}.`, [observation.evidenceId]);
}

function notReady(input: MarketUpdatePreparationInput): MarketUpdatePreparation {
  const limitation = statement('LIMITATION_VERIFICATION', 'A supported market, audience, purpose, and at least one admitted evidence topic are required before preparing an update.');
  return Object.freeze({
    status: AGENT_MARKET_UPDATE_PREPARATION_STATUS,
    certification: AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION,
    state: 'NOT_READY',
    input,
    executiveSummary: limitation,
    observations: Object.freeze([]),
    evidenceSynthesis: limitation,
    whatCouldChangeInterpretation: limitation,
    audienceContext: limitation,
    talkingPoints: Object.freeze([]),
    clientFriendlyExplanations: Object.freeze([]),
    questionsWorthAsking: Object.freeze([]),
    interpretationLimits: Object.freeze([limitation]),
    sourceFreshness: Object.freeze([]),
    verificationCheckpoints: Object.freeze([]),
    agentNextActions: Object.freeze([statement('BOUNDED_PROFESSIONAL_QUESTION', 'Choose a supported market and explicit preparation context.')]),
    optionalDraftLanguage: null,
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
  const briefingSummary = briefing?.briefingSummary;
  if (!briefing || !briefingSummary) return notReady(normalized);

  const observations = normalized.topics.map((topic) => {
    const evidence = briefing.whatMatters.find((item) => item.id.includes(TOPIC_MATCHERS[topic]));
    const posture = evidence ? briefing.evidencePosture.find((item) => item.observationId.includes(TOPIC_MATCHERS[topic])) : undefined;
    if (!evidence || !posture) return null;
    const metric = metricDefinition(topic);
    const value = metricValue(topic, String(evidence.value));
    const evidenceIds = [evidence.id];
    return Object.freeze({
      id: topic,
      evidenceId: evidence.id,
      label: metric.label,
      value,
      market: briefingSummary.marketLabel,
      sourceId: posture.sourceIdentity,
      sourceDate: posture.observationDate,
      atlasObservedDate: posture.observationDate,
      freshness: posture.freshness,
      verificationStatus: 'PROFESSIONAL_VERIFICATION_REQUIRED' as const,
      directObservation: statement('DIRECT_OBSERVATION', `The admitted ${briefingSummary.marketLabel} snapshot records ${value.toLowerCase()} for ${metric.label.toLowerCase()}.`, evidenceIds),
      plainLanguageDescription: statement('DEFINITIONAL_EXPLANATION', metric.description, evidenceIds),
      semanticQualifier: statement('LIMITATION_VERIFICATION', metric.qualifier, evidenceIds),
    });
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (!observations.length) return notReady(normalized);

  const evidenceIds = observations.map((item) => item.evidenceId);
  const facts = observations.map((item) => item.value);
  const sourceFreshness = Object.freeze(observations.map((item) => Object.freeze({
    evidenceId: item.evidenceId,
    sourceId: item.sourceId,
    market: item.market,
    metric: item.label,
    sourceDate: item.sourceDate,
    atlasObservedDate: item.atlasObservedDate,
    freshness: item.freshness,
    verificationStatus: item.verificationStatus,
  })));
  const evidenceReviewRequired = briefing.state !== 'READY' || observations.some((item) => item.freshness !== 'CURRENT');
  const purpose = purposeLabels[normalized.purpose];
  const synthesis = statement('RELATIONAL_SYNTHESIS', `Together, ${joined(observations.map((item) => item.label.toLowerCase()))} provide different views of the same ${briefingSummary.marketLabel} snapshot: available choice, marketing-time context, and price context where selected. They do not establish a trend, cause, recommendation, or future direction.`, evidenceIds);
  const sharedLimitation = statement('LIMITATION_VERIFICATION', `These are point-in-time market measures dated ${observations[0].sourceDate}. They do not establish whether inventory, marketing time, or prices are moving up or down without separately admitted comparison evidence.`, evidenceIds);
  const audienceContext = statement('AUDIENCE_AWARE_EXPLANATION', `${audienceExplanation(normalized.audience)} For this ${purpose}, use the selected measures to prepare a clearer conversation, then personally verify the source definitions and current conditions.`, evidenceIds);
  const questions = Object.freeze(observations.map((item) => statement('BOUNDED_PROFESSIONAL_QUESTION', metricDefinition(item.id).question, [item.evidenceId])));
  const verification = Object.freeze([
    statement('LIMITATION_VERIFICATION', `Confirm the visible source date (${observations[0].sourceDate}) and whether newer admitted market evidence is available.`, evidenceIds),
    ...observations.map((item) => item.semanticQualifier),
  ]);
  const draft = statement('AUDIENCE_AWARE_EXPLANATION', `For review: The admitted ${briefingSummary.marketLabel} snapshot records ${joined(facts)}. ${synthesis.text} Because the source date is ${observations[0].sourceDate}, I would treat these figures as a point-in-time reference and verify the relevant definitions and current conditions before using them in a ${audienceLabels[normalized.audience]} conversation.`, evidenceIds);

  return Object.freeze({
    status: AGENT_MARKET_UPDATE_PREPARATION_STATUS,
    certification: AGENT_MARKET_UPDATE_PREPARATION_CERTIFICATION,
    state: evidenceReviewRequired ? 'EVIDENCE_REVIEW_REQUIRED' : 'READY_FOR_HUMAN_REVIEW',
    input: normalized,
    executiveSummary: statement('RELATIONAL_SYNTHESIS', `For this ${purpose}, the admitted ${briefingSummary.marketLabel} snapshot provides ${joined(facts)}. The selected measures are dated ${observations[0].sourceDate} and should be used as evidence for preparation, not as a forecast or property-specific conclusion.`, evidenceIds),
    observations: Object.freeze(observations),
    evidenceSynthesis: synthesis,
    whatCouldChangeInterpretation: statement('LIMITATION_VERIFICATION', 'A newer source date, an admitted prior-period comparison, property-type or price-band segmentation, closed-sale or pending-sale evidence, or a clarified metric definition could change how these measures are understood.', evidenceIds),
    audienceContext,
    talkingPoints: Object.freeze(observations.map((item) => topicTalkingPoint(item, normalized.audience))),
    clientFriendlyExplanations: Object.freeze(observations.flatMap((item) => [item.plainLanguageDescription, item.semanticQualifier])),
    questionsWorthAsking: questions,
    interpretationLimits: Object.freeze([sharedLimitation, ...observations.map((item) => item.semanticQualifier)]),
    sourceFreshness,
    verificationCheckpoints: verification,
    agentNextActions: Object.freeze([
      statement('LIMITATION_VERIFICATION', `Verify the source date and freshness status for the selected ${briefingSummary.marketLabel} measures before relying on them in a live conversation.`, evidenceIds),
      ...observations.map((item) => statement('BOUNDED_PROFESSIONAL_QUESTION', metricDefinition(item.id).nextStep, [item.evidenceId])),
      statement('AUDIENCE_AWARE_EXPLANATION', 'Keep any property-specific valuation, pricing, offer, negotiation, or timing discussion separate from this market-level preparation.', evidenceIds),
    ]),
    optionalDraftLanguage: draft,
    boundaries: Object.freeze({ sessionOnly: true, persistence: false, customerData: false, recipientSelection: false, communicationExecution: false, adminInheritance: false, providerActivity: false }),
  });
}
