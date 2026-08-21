import { DECISION_GUIDE_CITY_CONFIGS } from '../decisionGuidePlatform';

import {
  AGENT_PLACE_PREPARATION_CAPABILITY,
  AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  AGENT_PLACE_PREPARATION_P0_CITIES,
  buildAgentPlacePreparationPacket,
  buildAgentPlacePreparationSourcePosture,
  type AgentPlaceCanonicalCity,
  type AgentPlaceObjectType,
  type AgentPlacePreparationPacket,
} from './agentPlacePreparationAdmission';

export const AGENT_PLACE_CONVERSATION_PREPARATION_STATUS = 'REIE_AGENT_PLACE_CONVERSATION_PREPARATION_EXPERIENCE_MVV' as const;

export type AgentPlaceConversationHumanState = Readonly<{
  label: 'Choose a city' | 'Place unavailable' | 'More evidence is required' | 'Professional verification needed' | 'Ready for your review';
  message: string;
}>;

export type AgentPlaceConversationBriefing = Readonly<{
  city: AgentPlaceCanonicalCity;
  headline: string;
  summary: string;
  placeSnapshot: readonly Readonly<{ label: string; value: string; kind: 'FACT' | 'CONTEXT' }> [];
  whatMatters: readonly Readonly<{ label: string; value: string }> [];
  verificationQuestions: readonly string[];
  cityDecisionGuideHref: string;
}>;

export type AgentPlaceConversationExperienceState = Readonly<{
  status: typeof AGENT_PLACE_CONVERSATION_PREPARATION_STATUS;
  packet: AgentPlacePreparationPacket;
  briefing: AgentPlaceConversationBriefing | null;
  humanState: AgentPlaceConversationHumanState;
}>;

const AGENT_PLACE_REQUEST_BASE = Object.freeze({
  actorIdentityType: 'HUMAN_AGENT' as const,
  actorRole: 'AGENT' as const,
  sessionMechanism: 'HUMAN_AGENT_SESSION' as const,
  capability: AGENT_PLACE_PREPARATION_CAPABILITY,
  route: AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  freeFormPlaceValue: null,
  adminContext: false,
  mcpContext: false,
  customerContext: false,
  persistenceRequested: false,
  providerRuntimeRequired: false,
  recommendationRequested: false,
  rankingRequested: false,
  suitabilityRequested: false,
  fairHousingSensitiveRequest: false,
  schoolQualityRequest: false,
  safetyRequest: false,
});

function guideConfig(city: AgentPlaceCanonicalCity) {
  const key = city.canonicalName.toLowerCase() as 'boulder' | 'louisville' | 'lafayette';
  return DECISION_GUIDE_CITY_CONFIGS[key];
}

function unavailable(packet: AgentPlacePreparationPacket, canonicalPlaceId: string | null, requestedObjectType: AgentPlaceObjectType): AgentPlaceConversationExperienceState {
  const reasons = packet.failureReasons;
  let humanState: AgentPlaceConversationHumanState;

  if (!canonicalPlaceId) {
    humanState = { label: 'Choose a city', message: 'Choose one certified city before preparing a briefing.' };
  } else if (requestedObjectType !== 'CITY' || reasons.includes('CITY_ONLY_P0_SCOPE_REQUIRED')) {
    humanState = { label: 'Place unavailable', message: 'This workflow prepares certified city context only. Neighborhoods and other place types are not available here.' };
  } else if (reasons.includes('UNKNOWN_OR_UNADMITTED_CANONICAL_CITY')) {
    humanState = { label: 'Place unavailable', message: 'That city is not available for this briefing. Choose Boulder, Louisville, or Lafayette.' };
  } else if (reasons.includes('STALE_OR_UNKNOWN_SOURCE') || reasons.includes('CONFLICTING_SOURCE_EVIDENCE') || reasons.includes('SOURCE_RIGHTS_UNRESOLVED')) {
    humanState = { label: 'More evidence is required', message: 'The certified City context is not available in a usable state. Choose another certified city or review the available sources.' };
  } else if (reasons.includes('SCHOOL_QUALITY_REQUEST_PROHIBITED') || reasons.includes('SAFETY_REQUEST_PROHIBITED') || reasons.includes('FAIR_HOUSING_SENSITIVE_REQUEST_PROHIBITED') || reasons.includes('SUITABILITY_PROHIBITED') || reasons.includes('RECOMMENDATION_PROHIBITED')) {
    humanState = { label: 'Place unavailable', message: 'This briefing provides neutral City context and verification questions, not recommendations, suitability, school-quality, or safety conclusions.' };
  } else if (reasons.includes('CUSTOMER_CONTEXT_PROHIBITED') || reasons.includes('ADMIN_ONLY_CONTEXT_PROHIBITED') || reasons.includes('MCP_CONTEXT_PROHIBITED') || reasons.includes('PROVIDER_RUNTIME_PROHIBITED') || reasons.includes('PERSISTENCE_PROHIBITED')) {
    humanState = { label: 'Place unavailable', message: 'This briefing is limited to the selected City and certified repository context. Customer, administrative, stored, and provider context are not used.' };
  } else {
    humanState = { label: 'More evidence is required', message: 'This City context is not authorized for a briefing. Choose one certified City.' };
  }

  return Object.freeze({
    status: AGENT_PLACE_CONVERSATION_PREPARATION_STATUS,
    packet,
    briefing: null,
    humanState,
  });
}

export function prepareAgentPlaceConversation(
  canonicalPlaceId: string | null,
  requestedObjectType: AgentPlaceObjectType = 'CITY',
): AgentPlaceConversationExperienceState {
  const city = AGENT_PLACE_PREPARATION_P0_CITIES.find((candidate) => candidate.canonicalPlaceId === canonicalPlaceId) ?? null;
  const sourcePosture = city
    ? buildAgentPlacePreparationSourcePosture(city)
    : {
      sourceId: null,
      sourceClass: 'UNKNOWN' as const,
      sourceReference: null,
      freshness: 'UNKNOWN' as const,
      completeness: 'INCOMPLETE' as const,
      conflict: 'NO_CONFLICT' as const,
      rights: 'UNKNOWN_OR_UNRESOLVED' as const,
      certification: 'UNCERTIFIED' as const,
    };
  const packet = buildAgentPlacePreparationPacket({
    request: { ...AGENT_PLACE_REQUEST_BASE, canonicalPlaceId, requestedObjectType },
    sourcePosture,
  });

  if (packet.admission !== 'ADMITTED' || !packet.city) return unavailable(packet, canonicalPlaceId, requestedObjectType);

  const config = guideConfig(packet.city);
  const cityDecisionGuideHref = `${packet.city.marketRoute}/guides/orienting-before-search`;
  const briefing: AgentPlaceConversationBriefing = Object.freeze({
    city: packet.city,
    headline: config.summaryHeadline,
    summary: config.summaryIntro,
    placeSnapshot: Object.freeze([
      { label: 'Confirmed city', value: `${packet.city.canonicalName}, Colorado`, kind: 'FACT' as const },
      { label: 'Governing context', value: 'Municipal context is part of the City briefing; verify any address-specific jurisdiction directly.', kind: 'CONTEXT' as const },
      { label: 'City context', value: config.distinctValue, kind: 'CONTEXT' as const },
    ]),
    whatMatters: Object.freeze([
      { label: 'Focus for review', value: config.attentionValue },
      { label: 'Housing orientation', value: config.housingPatternLabel },
      { label: 'Access and daily-use context', value: config.accessExplanation },
    ]),
    verificationQuestions: Object.freeze(config.verificationQuestions.slice(0, 3)),
    cityDecisionGuideHref,
  });

  return Object.freeze({
    status: AGENT_PLACE_CONVERSATION_PREPARATION_STATUS,
    packet,
    briefing,
    humanState: { label: 'Ready for your review' as const, message: 'Use this City briefing to organize neutral context and the next facts to verify before the conversation.' },
  });
}
