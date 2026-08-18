import type { AgentBriefingPacket } from '../agentBriefingPreparation';
import type { OfferPreparationReadiness } from '../offerPreparationReadiness';
import {
  validateReieDecisionContext,
  type ReieDecisionContextInput,
} from '../reieDecisionContextContract';
import type { ReieDecisionEvidenceItem } from '../reieDecisionEvidenceClassification';
import {
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from '../reieProfessionalHandoffTaxonomy';
import type { SellerUpdatePreparationPacket } from '../sellerUpdatePreparation';

export const AGENT_CONVERSATION_PREPARATION_COMPOSITION_STATUS = 'REIE_AGENT_CONVERSATION_PREPARATION_COMPOSITION_MVV' as const;
export const AGENT_CONVERSATION_PREPARATION_VISIBILITY = 'ADMIN_ONLY' as const;

export const AGENT_CONVERSATION_PREPARATION_TYPES = [
  'MARKET_PLACE',
  'SELLER_UPDATE_REVIEW',
  'OFFER_PREPARATION_REVIEW',
] as const;

export type AgentConversationPreparationType = (typeof AGENT_CONVERSATION_PREPARATION_TYPES)[number];
export type AgentConversationPacketReadiness =
  | 'READY_FOR_AGENT_REVIEW'
  | 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE'
  | 'REVIEW_REQUIRED_CONFLICTING_EVIDENCE'
  | 'PROFESSIONAL_REVIEW_REQUIRED'
  | 'COMPLIANCE_REVIEW_REQUIRED'
  | 'FAIL_CLOSED';

export type AgentConversationSurface = 'BUY' | 'SELL' | 'MARKET' | 'PROPERTY' | 'DECISION_GUIDES' | 'SOURCES';

export type AgentConversationPreparationInput = Readonly<{
  preparationType: AgentConversationPreparationType;
  purpose: string;
  context: ReieDecisionContextInput;
  surfaceReferences: readonly AgentConversationSurface[];
  assumptions: readonly ReieDecisionEvidenceItem[];
  limitations: readonly string[];
  openQuestions: readonly string[];
  conflicts: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  marketPlacePacket: AgentBriefingPacket | null;
  sellerUpdatePacket: SellerUpdatePreparationPacket | null;
  offerPreparation: OfferPreparationReadiness | null;
}>;

export type AgentConversationPreparationPacket = Readonly<{
  status: typeof AGENT_CONVERSATION_PREPARATION_COMPOSITION_STATUS;
  visibility: typeof AGENT_CONVERSATION_PREPARATION_VISIBILITY;
  activationState: 'NOT_AUTHORIZED';
  preparationType: AgentConversationPreparationType | null;
  purpose: string | null;
  relevantContext: readonly ReieDecisionEvidenceItem[];
  knownEvidence: readonly ReieDecisionEvidenceItem[];
  assumptions: readonly ReieDecisionEvidenceItem[];
  limitations: readonly string[];
  conflicts: readonly string[];
  openQuestions: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  surfaceReferences: readonly AgentConversationSurface[];
  safeConversationTopics: readonly string[];
  doNotConclude: readonly string[];
  readiness: AgentConversationPacketReadiness;
  reasons: readonly string[];
  protectedBoundaries: Readonly<{
    persistence: false;
    crm: false;
    customerData: false;
    hiddenTransfer: false;
    providerSelection: false;
    recommendation: false;
    ranking: false;
    scoring: false;
    network: false;
    database: false;
  }>;
}>;

const TYPE_SURFACES: Readonly<Record<AgentConversationPreparationType, readonly AgentConversationSurface[]>> = {
  MARKET_PLACE: ['MARKET', 'DECISION_GUIDES', 'SOURCES'],
  SELLER_UPDATE_REVIEW: ['SELL', 'PROPERTY', 'MARKET', 'SOURCES'],
  OFFER_PREPARATION_REVIEW: ['BUY', 'PROPERTY', 'MARKET', 'SOURCES'],
};

const DO_NOT_CONCLUDE = Object.freeze([
  'No recommendation, ranking, scoring, urgency, affordability, investment, pricing, offer, negotiation, or suitability conclusion.',
  'No provider selection, referral assignment, outreach, scheduling, CRM task, or customer-data action.',
  'No protected-class, demographic, health, disability, age, family-status, or behavioral inference.',
]);

const PROTECTED_BOUNDARIES = Object.freeze({
  persistence: false,
  crm: false,
  customerData: false,
  hiddenTransfer: false,
  providerSelection: false,
  recommendation: false,
  ranking: false,
  scoring: false,
  network: false,
  database: false,
} as const);

const PROHIBITED_INPUT_KEYS = new Set([
  'customerName', 'email', 'phone', 'addressBookId', 'customerProfileId', 'crmContactId', 'leadId', 'rawNarrative',
  'behavioralProfile', 'browsingHistory', 'protectedClass', 'healthData', 'disability', 'familyStatus', 'leadScore',
  'urgencyScore', 'conversionProbability', 'hiddenRouteContext', 'hiddenPersonalization', 'persistedCustomerState',
  'persistence', 'crmTask', 'taskWrite', 'outreach', 'providerSelection',
]);

const PROHIBITED_LANGUAGE = /\b(?:recommend(?:ed|ation)?|best fit|suitab(?:le|ility)|steering|protected class|demographic|afford(?:able|ability)|investment (?:advice|recommendation)|offer price|opening bid|escalation amount|negotiation strategy|listing price|valuation|lead score|urgency)\b/i;

function text(value: string) {
  return value.trim();
}

function unique(values: readonly string[]) {
  return Object.freeze([...new Set(values.map(text).filter(Boolean))]);
}

function containsProhibitedInput(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsProhibitedInput);
  return Object.entries(value).some(([key, nested]) => PROHIBITED_INPUT_KEYS.has(key) || containsProhibitedInput(nested));
}

function containsProhibitedLanguage(values: readonly string[]) {
  return values.some((value) => PROHIBITED_LANGUAGE.test(value));
}

function expectedPacketPresent(input: AgentConversationPreparationInput) {
  if (input.preparationType === 'MARKET_PLACE') return input.marketPlacePacket?.status !== 'FAIL_CLOSED';
  if (input.preparationType === 'SELLER_UPDATE_REVIEW') return input.sellerUpdatePacket?.status === 'READY_FOR_AGENT_REVIEW';
  return input.offerPreparation?.status === 'OFFER_PREPARATION_READINESS_IMPLEMENTED';
}

function safeTopics(input: AgentConversationPreparationInput) {
  const topics = [
    'Review supplied evidence, assumptions, limitations, and open verification questions.',
    'Confirm whether a qualified professional review is needed before reliance.',
  ];
  if (input.preparationType === 'MARKET_PLACE') topics.push('Review current market and place context with source and date limitations visible.');
  if (input.preparationType === 'SELLER_UPDATE_REVIEW') topics.push('Review supplied listing facts, missing evidence, and factual update questions.');
  if (input.preparationType === 'OFFER_PREPARATION_REVIEW') topics.push('Review readiness stages and verification domains before any decision discussion.');
  return Object.freeze(topics);
}

function fail(input: AgentConversationPreparationInput, reasons: readonly string[]): AgentConversationPreparationPacket {
  return Object.freeze({
    status: AGENT_CONVERSATION_PREPARATION_COMPOSITION_STATUS,
    visibility: AGENT_CONVERSATION_PREPARATION_VISIBILITY,
    activationState: 'NOT_AUTHORIZED',
    preparationType: AGENT_CONVERSATION_PREPARATION_TYPES.includes(input.preparationType) ? input.preparationType : null,
    purpose: text(input.purpose) || null,
    relevantContext: [], knownEvidence: [], assumptions: [], limitations: [], conflicts: [], openQuestions: [], professionalHandoffs: [], surfaceReferences: [],
    safeConversationTopics: [], doNotConclude: DO_NOT_CONCLUDE, readiness: 'FAIL_CLOSED', reasons: Object.freeze([...new Set(reasons)].sort()),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}

export function buildAgentConversationPreparationPacket(input: AgentConversationPreparationInput): AgentConversationPreparationPacket {
  const reasons: string[] = [];
  if (!AGENT_CONVERSATION_PREPARATION_TYPES.includes(input.preparationType)) reasons.push('UNSUPPORTED_PREPARATION_TYPE');
  if (!text(input.purpose)) reasons.push('PREPARATION_PURPOSE_REQUIRED');
  if (containsProhibitedInput(input)) reasons.push('PROHIBITED_IDENTITY_OR_PERSISTENCE_INPUT');
  if (containsProhibitedLanguage([input.purpose, ...input.limitations, ...input.openQuestions, ...input.conflicts])) reasons.push('PROHIBITED_CONCLUSION_REQUESTED');
  const context = validateReieDecisionContext(input.context);
  if (context.classification !== 'VALID_EXPLICIT_CONTEXT' || input.context.role !== 'ADMIN') reasons.push('ADMIN_EXPLICIT_CONTEXT_REQUIRED', ...context.reasons);
  input.assumptions.forEach((item) => { if (item.classification !== 'USER_ASSUMPTION') reasons.push('ASSUMPTIONS_MUST_REMAIN_USER_ASSUMPTIONS'); });
  input.professionalHandoffs.forEach((handoff) => reasons.push(...validateReieProfessionalHandoffRequest(handoff)));
  if (!expectedPacketPresent(input)) reasons.push('REQUIRED_CERTIFIED_PREPARATION_OUTPUT_MISSING');
  const allowedSurfaces = TYPE_SURFACES[input.preparationType] || [];
  if (input.surfaceReferences.some((surface) => !allowedSurfaces.includes(surface))) reasons.push('SURFACE_REFERENCE_NOT_ALLOWED_FOR_PREPARATION_TYPE');
  if (reasons.length > 0) return fail(input, reasons);

  const evidence = [...input.context.selectedGoals, ...input.context.items].map((item) => item.evidence);
  const knownEvidence = evidence.filter((item) => item.classification === 'FACT' || item.classification === 'DERIVED_ILLUSTRATION');
  const missing = evidence.some((item) => item.classification === 'NOT_AVAILABLE' || item.classification === 'UNVERIFIED_INPUT');
  const professional = evidence.some((item) => item.classification === 'PROFESSIONAL_VERIFICATION_REQUIRED') || input.professionalHandoffs.length > 0;
  const readiness: AgentConversationPacketReadiness = input.conflicts.length > 0
    ? 'REVIEW_REQUIRED_CONFLICTING_EVIDENCE'
    : missing ? 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE'
      : professional ? 'PROFESSIONAL_REVIEW_REQUIRED'
        : 'READY_FOR_AGENT_REVIEW';

  return Object.freeze({
    status: AGENT_CONVERSATION_PREPARATION_COMPOSITION_STATUS,
    visibility: AGENT_CONVERSATION_PREPARATION_VISIBILITY,
    activationState: 'NOT_AUTHORIZED',
    preparationType: input.preparationType,
    purpose: text(input.purpose),
    relevantContext: Object.freeze(evidence),
    knownEvidence: Object.freeze(knownEvidence),
    assumptions: Object.freeze(input.assumptions),
    limitations: unique(input.limitations), conflicts: unique(input.conflicts), openQuestions: unique(input.openQuestions),
    professionalHandoffs: Object.freeze(input.professionalHandoffs), surfaceReferences: Object.freeze([...new Set(input.surfaceReferences)]),
    safeConversationTopics: safeTopics(input), doNotConclude: DO_NOT_CONCLUDE, readiness, reasons: [],
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
