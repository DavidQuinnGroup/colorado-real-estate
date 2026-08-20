import {
  AGENT_PROPERTY_PREPARATION_CAPABILITY,
  AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  buildAgentPropertyPreparationPacket,
  type AgentPropertyPreparationPacket,
  type AgentPropertyPreparationProperty,
  type AgentPropertyPreparationRequest,
  type AgentPropertyPreparationSourcePosture,
} from './agentPropertyPreparationAdmission';

export type AgentPropertyConversationCandidate = Readonly<{
  property: AgentPropertyPreparationProperty;
  sourcePosture: AgentPropertyPreparationSourcePosture;
}>;

export type AgentPropertyPreparationHumanState = Readonly<{
  label:
    | 'Ready for your review'
    | 'Information to verify'
    | 'Currentness needs confirmation'
    | 'Conflicting information needs review'
    | 'More evidence is required'
    | 'Property unavailable'
    | 'Professional verification needed';
  message: string;
}>;

const AGENT_PROPERTY_REQUEST: AgentPropertyPreparationRequest = Object.freeze({
  actorRole: 'AGENT',
  capability: AGENT_PROPERTY_PREPARATION_CAPABILITY,
  route: AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  adminContext: false,
  customerContext: false,
  persistenceRequested: false,
  providerRuntimeRequired: false,
  publicRecordRequested: false,
  recommendationRequested: false,
  fairHousingSensitiveRequest: false,
});

export function prepareAgentPropertyConversation(candidate: AgentPropertyConversationCandidate) {
  const packet = buildAgentPropertyPreparationPacket({
    property: candidate.property,
    sourcePosture: candidate.sourcePosture,
    request: AGENT_PROPERTY_REQUEST,
  });

  return Object.freeze({
    packet,
    humanState: getAgentPropertyPreparationHumanState(candidate, packet),
  });
}

export function getAgentPropertyPreparationHumanState(
  candidate: AgentPropertyConversationCandidate,
  packet: AgentPropertyPreparationPacket,
): AgentPropertyPreparationHumanState {
  const { property, sourcePosture } = candidate;

  if (property.resolvedPropertyCount === 0) {
    return { label: 'Property unavailable', message: 'Choose one property from the supported repository results before preparing a briefing.' };
  }
  if (property.resolvedPropertyCount !== 1) {
    return { label: 'More evidence is required', message: 'The selection is ambiguous. Choose the single property record that matches the intended listing.' };
  }
  if (property.isPrivateExclusive || property.state !== 'CO' || property.status?.trim().toUpperCase() !== 'ACTIVE') {
    return { label: 'Property unavailable', message: 'This property is outside the active public Colorado preparation scope. Choose an active public Colorado property.' };
  }
  if (property.origin !== 'REPOSITORY_PROPERTY') {
    return { label: 'Property unavailable', message: 'Only an existing repository property can be prepared. Synthetic or guessed property context is not available.' };
  }
  if (sourcePosture.sourceId === null || sourcePosture.sourceClass !== 'EXISTING_REPOSITORY_LISTING_FACTS') {
    return { label: 'More evidence is required', message: 'The listing source identity is not available. Choose a property with certified repository listing facts.' };
  }
  if (sourcePosture.freshness !== 'CURRENT') {
    return { label: 'Currentness needs confirmation', message: 'The stored listing observation is not current enough for this briefing. Confirm the listing directly before relying on it.' };
  }
  if (sourcePosture.completeness !== 'COMPLETE') {
    return { label: 'More evidence is required', message: 'Required listing facts are incomplete, so a partial briefing is not available.' };
  }
  if (sourcePosture.conflict !== 'NO_CONFLICT') {
    return { label: 'Conflicting information needs review', message: 'The stored evidence has a conflict. Resolve it through the authoritative listing source before preparing a briefing.' };
  }
  if (packet.failureReasons.includes('INSUFFICIENT_FACTUAL_EVIDENCE') || packet.failureReasons.includes('CANONICAL_PROPERTY_IDENTITY_INCOMPLETE') || packet.failureReasons.includes('SOURCE_RIGHTS_OR_CERTIFICATION_REQUIRED')) {
    return { label: 'More evidence is required', message: 'Required property or source evidence is incomplete, so a partial briefing is not available.' };
  }
  if (packet.failureReasons.includes('ADMIN_ONLY_CONTEXT_PROHIBITED')) {
    return { label: 'Property unavailable', message: 'Administrative context is not part of Agent property preparation. Use the Agent Workspace only.' };
  }
  if (packet.failureReasons.includes('CUSTOMER_CONTEXT_PROHIBITED')) {
    return { label: 'Property unavailable', message: 'Customer context is not available in this property briefing. Prepare only the selected property facts.' };
  }
  if (packet.failureReasons.includes('PUBLIC_RECORD_RETRIEVAL_PROHIBITED')) {
    return { label: 'Professional verification needed', message: 'Public records are not retrieved here. Confirm the appropriate tax, title, permit, or county record directly.' };
  }
  if (packet.failureReasons.includes('PROVIDER_RUNTIME_PROHIBITED')) {
    return { label: 'Property unavailable', message: 'This briefing does not call a provider or refresh a source. Use the stored repository evidence only.' };
  }
  if (packet.failureReasons.includes('RECOMMENDATION_PROHIBITED') || packet.failureReasons.includes('FAIR_HOUSING_SENSITIVE_REQUEST_PROHIBITED')) {
    return { label: 'Property unavailable', message: 'This preparation surface provides factual orientation and verification questions, not recommendations or suitability conclusions.' };
  }
  if (!packet.snapshot) {
    return { label: 'Property unavailable', message: 'This property context is not authorized for Agent preparation. Choose a supported repository property.' };
  }
  if (packet.readiness === 'REVIEW_REQUIRED') {
    return { label: 'Professional verification needed', message: 'The admitted facts are available, but some configuration evidence still requires direct professional verification.' };
  }

  return { label: 'Ready for your review', message: 'This briefing uses the current admitted repository listing facts. Verify material details before relying on them.' };
}
