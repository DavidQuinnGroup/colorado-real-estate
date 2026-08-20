import {
  validateReieDecisionEvidenceItem,
  type ReieDecisionEvidenceItem,
} from '../reieDecisionEvidenceClassification';
import {
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from '../reieProfessionalHandoffTaxonomy';

export const AGENT_MARKET_PREPARATION_CONTEXT_CLASS = 'AGENT_MARKET_PREPARATION_CONTEXT' as const;
export const AGENT_MARKET_PREPARATION_TASK = 'MARKET_CONVERSATION' as const;
export const AGENT_MARKET_PREPARATION_ADAPTER_STATUS = 'DQG_AGENT_PREPARATION_CONTEXT_ADAPTER_MARKET_ONLY_MVV' as const;

export const AGENT_MARKET_PREPARATION_STATES = [
  'READY',
  'INCOMPLETE',
  'CONFLICTING',
  'STALE',
  'PROFESSIONAL_REVIEW_REQUIRED',
  'INSUFFICIENT_CONTEXT',
  'UNAUTHORIZED_CONTEXT',
  'UNSUPPORTED_TASK_CONTEXT',
] as const;

export type AgentMarketPreparationState = (typeof AGENT_MARKET_PREPARATION_STATES)[number];
export type AgentMarketReviewSurface = 'MARKET' | 'DECISION_GUIDES' | 'SOURCES';

export type AgentMarketObservation = Readonly<{
  id: string;
  label: string;
  evidence: ReieDecisionEvidenceItem;
  sourceClass: 'CERTIFIED_MARKET_EVIDENCE';
  observationDate: string;
  effectiveDate: string | null;
  freshness: 'CURRENT' | 'STALE';
  permittedUse: 'AGENT_MARKET_PREPARATION_APPROVED';
  completeness: 'COMPLETE' | 'INCOMPLETE';
  conflict: 'NO_CONFLICT' | 'CONFLICTING';
  certification: 'CERTIFIED';
  professionalVerificationRequired: boolean;
}>;

export type AgentMarketPreparationContextInput = Readonly<{
  contextClass: typeof AGENT_MARKET_PREPARATION_CONTEXT_CLASS;
  task: typeof AGENT_MARKET_PREPARATION_TASK;
  market: Readonly<{ id: string; label: string }>;
  observations: readonly AgentMarketObservation[];
  limitations: readonly string[];
  verificationQuestions: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  reviewSurfaces: readonly AgentMarketReviewSurface[];
}>;

export type AgentMarketPreparationContext = Readonly<{
  contextClass: typeof AGENT_MARKET_PREPARATION_CONTEXT_CLASS;
  task: typeof AGENT_MARKET_PREPARATION_TASK;
  market: Readonly<{ id: string; label: string }>;
  observations: readonly AgentMarketObservation[];
  limitations: readonly string[];
  verificationQuestions: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  reviewSurfaces: readonly AgentMarketReviewSurface[];
  persistence: false;
  mutation: false;
  providerActivity: false;
  customerData: false;
  hiddenContext: false;
  adminInheritance: false;
  mcpAuthority: false;
}>;

export type AgentMarketPreparationAdmission = Readonly<{
  status: typeof AGENT_MARKET_PREPARATION_ADAPTER_STATUS;
  state: AgentMarketPreparationState;
  context: AgentMarketPreparationContext | null;
  reasons: readonly string[];
  nextAction: 'REVIEW_BRIEFING' | 'VERIFY_EVIDENCE' | 'CONFIRM_CURRENTNESS' | 'SEEK_PROFESSIONAL_REVIEW' | 'SUPPLY_CERTIFIED_CONTEXT' | 'STOP';
}>;

export type AgentMarketHumanBriefing = Readonly<{
  status: typeof AGENT_MARKET_PREPARATION_ADAPTER_STATUS;
  state: AgentMarketPreparationState;
  humanState: string;
  briefingSummary: Readonly<{ marketLabel: string; supportedObservationCount: number }> | null;
  whatMatters: readonly ReieDecisionEvidenceItem[];
  whatNeedsVerification: readonly string[];
  questionsToPrepare: readonly string[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  evidencePosture: readonly Readonly<{ observationId: string; sourceIdentity: string | null; observationDate: string; effectiveDate: string | null; freshness: 'CURRENT' | 'STALE'; permittedUse: 'AGENT_MARKET_PREPARATION_APPROVED'; completeness: 'COMPLETE' | 'INCOMPLETE'; conflict: 'NO_CONFLICT' | 'CONFLICTING'; certification: 'CERTIFIED' }> [];
  limitations: readonly string[];
  reviewSurfaces: readonly AgentMarketReviewSurface[];
  prohibitedOutputs: readonly string[];
  nextAction: AgentMarketPreparationAdmission['nextAction'];
}>;

export const AGENT_MARKET_HUMAN_STATE: Readonly<Record<AgentMarketPreparationState, string>> = Object.freeze({
  READY: 'Ready for your review',
  INCOMPLETE: 'Information to verify',
  CONFLICTING: 'Conflicting information needs review',
  STALE: 'Currentness needs confirmation',
  PROFESSIONAL_REVIEW_REQUIRED: 'Professional review needed',
  INSUFFICIENT_CONTEXT: 'More context is required',
  UNAUTHORIZED_CONTEXT: 'This briefing is unavailable',
  UNSUPPORTED_TASK_CONTEXT: 'This briefing is unavailable',
});

const TOP_LEVEL_KEYS = new Set(['contextClass', 'task', 'market', 'observations', 'limitations', 'verificationQuestions', 'professionalHandoffs', 'reviewSurfaces']);
const MARKET_KEYS = new Set(['id', 'label']);
const OBSERVATION_KEYS = new Set(['id', 'label', 'evidence', 'sourceClass', 'observationDate', 'effectiveDate', 'freshness', 'permittedUse', 'completeness', 'conflict', 'certification', 'professionalVerificationRequired']);
const EVIDENCE_KEYS = new Set(['id', 'label', 'value', 'classification', 'provenance', 'visibility', 'verification', 'prohibitedUse']);
const PROVENANCE_KEYS = new Set(['origin', 'reference', 'sourceId', 'freshness', 'rights']);
const HANDOFF_KEYS = new Set(['id', 'role', 'questionCategory', 'whyVerificationIsNeeded', 'informationToBring', 'whatReieCannotDetermine', 'customerSelectedHandoff', 'agentPreparationOnly', 'contextItemIds', 'providerRecommendation', 'ranking', 'referralRelationship', 'automaticCommunication']);
const FORBIDDEN_KEYS = new Set(['customerName', 'email', 'phone', 'crmId', 'crmContactId', 'leadId', 'customerProfile', 'clientDNA', 'behavioralSignal', 'customerPreference', 'protectedClass', 'healthData', 'privateFinancialData', 'privateMessage', 'customerDocument', 'storedCustomerHistory', 'transactionPartyIdentity', 'hiddenPersonalization', 'browsingHistory', 'analytics', 'telemetryProfile', 'priorPreparationHistory', 'localStorage', 'sessionStorage', 'packetCookies', 'hiddenUrlState', 'adminSessionContext', 'mcpState', 'repositoryState', 'providerRuntime', 'mutationAuthority', 'recommendation', 'ranking', 'score', 'suitability']);
const PROHIBITED_OUTPUTS = Object.freeze([
  'NO_PREDICTION', 'NO_RECOMMENDATION', 'NO_RANKING', 'NO_SCORING', 'NO_URGENCY', 'NO_SUITABILITY', 'NO_AFFORDABILITY', 'NO_PRICING', 'NO_OFFER', 'NO_NEGOTIATION', 'NO_INVESTMENT', 'NO_PROVIDER_SELECTION', 'NO_STEERING', 'NO_PROTECTED_CLASS_INFERENCE',
]);

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function hasOnlyKeys(value: unknown, keys: ReadonlySet<string>) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).every((key) => keys.has(key));
}

function containsForbiddenKey(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsForbiddenKey);
  return Object.entries(value).some(([key, nested]) => {
    const requiredFalseHandoffFlag = ['providerRecommendation', 'ranking', 'referralRelationship', 'automaticCommunication'].includes(key) && nested === false;
    return (FORBIDDEN_KEYS.has(key) && !requiredFalseHandoffFlag) || containsForbiddenKey(nested);
  });
}

function unique(values: readonly string[]) {
  return Object.freeze([...new Set(values.map(text).filter(Boolean))]);
}

function fail(state: AgentMarketPreparationState, reasons: readonly string[], nextAction: AgentMarketPreparationAdmission['nextAction']): AgentMarketPreparationAdmission {
  return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state, context: null, reasons: Object.freeze([...new Set(reasons)].sort()), nextAction });
}

function validateObservation(observation: AgentMarketObservation) {
  const reasons = [...validateReieDecisionEvidenceItem(observation.evidence)];
  if (!hasOnlyKeys(observation, OBSERVATION_KEYS)) reasons.push('UNDECLARED_OBSERVATION_FIELD');
  if (!hasOnlyKeys(observation.evidence, EVIDENCE_KEYS) || !hasOnlyKeys(observation.evidence.provenance, PROVENANCE_KEYS)) reasons.push('UNDECLARED_EVIDENCE_FIELD');
  if (!text(observation.id) || !text(observation.label) || !text(observation.observationDate)) reasons.push('OBSERVATION_ID_LABEL_AND_DATE_REQUIRED');
  if (observation.sourceClass !== 'CERTIFIED_MARKET_EVIDENCE') reasons.push('UNSUPPORTED_SOURCE_CLASS');
  if (observation.permittedUse !== 'AGENT_MARKET_PREPARATION_APPROVED') reasons.push('AGENT_PERMITTED_USE_REQUIRED');
  if (observation.certification !== 'CERTIFIED') reasons.push('CERTIFICATION_REQUIRED');
  if (!text(observation.evidence.provenance.sourceId) || observation.evidence.provenance.rights !== 'REVIEWED') reasons.push('SOURCE_IDENTITY_AND_REVIEWED_RIGHTS_REQUIRED');
  if (!['CURRENT', 'STALE'].includes(observation.freshness)) reasons.push('FRESHNESS_INVALID');
  if (!['COMPLETE', 'INCOMPLETE'].includes(observation.completeness)) reasons.push('COMPLETENESS_INVALID');
  if (!['NO_CONFLICT', 'CONFLICTING'].includes(observation.conflict)) reasons.push('CONFLICT_STATE_INVALID');
  return reasons;
}

export function admitAgentMarketPreparationContext(input: unknown): AgentMarketPreparationAdmission {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('INSUFFICIENT_CONTEXT', ['CONTEXT_OBJECT_REQUIRED'], 'SUPPLY_CERTIFIED_CONTEXT');
  if (containsForbiddenKey(input)) return fail('UNAUTHORIZED_CONTEXT', ['FORBIDDEN_CONTEXT_FIELD'], 'STOP');
  if (!hasOnlyKeys(input, TOP_LEVEL_KEYS)) return fail('UNAUTHORIZED_CONTEXT', ['UNDECLARED_CONTEXT_FIELD'], 'STOP');
  const context = input as AgentMarketPreparationContextInput;
  if (context.contextClass !== AGENT_MARKET_PREPARATION_CONTEXT_CLASS) return fail('UNAUTHORIZED_CONTEXT', ['UNSUPPORTED_CONTEXT_CLASS'], 'STOP');
  if (context.task !== AGENT_MARKET_PREPARATION_TASK) return fail('UNSUPPORTED_TASK_CONTEXT', ['MARKET_TASK_REQUIRED'], 'STOP');
  if (!hasOnlyKeys(context.market, MARKET_KEYS) || !text(context.market.id) || !text(context.market.label)) return fail('INSUFFICIENT_CONTEXT', ['MARKET_IDENTITY_REQUIRED'], 'SUPPLY_CERTIFIED_CONTEXT');
  if (!Array.isArray(context.observations) || context.observations.length === 0) return fail('INSUFFICIENT_CONTEXT', ['CERTIFIED_OBSERVATION_REQUIRED'], 'SUPPLY_CERTIFIED_CONTEXT');
  if (!Array.isArray(context.limitations) || !Array.isArray(context.verificationQuestions) || !Array.isArray(context.professionalHandoffs) || !Array.isArray(context.reviewSurfaces)) return fail('INSUFFICIENT_CONTEXT', ['STRUCTURED_CONTEXT_FIELDS_REQUIRED'], 'SUPPLY_CERTIFIED_CONTEXT');
  const reasons = context.observations.flatMap(validateObservation);
  context.professionalHandoffs.forEach((handoff) => {
    if (!hasOnlyKeys(handoff, HANDOFF_KEYS)) reasons.push('UNDECLARED_HANDOFF_FIELD');
    reasons.push(...validateReieProfessionalHandoffRequest(handoff));
  });
  if (context.reviewSurfaces.some((surface) => !['MARKET', 'DECISION_GUIDES', 'SOURCES'].includes(surface))) reasons.push('UNAUTHORIZED_REVIEW_SURFACE');
  if (reasons.length > 0) return fail('UNAUTHORIZED_CONTEXT', reasons, 'STOP');

  const admitted = Object.freeze({
    ...context,
    market: Object.freeze({ id: context.market.id.trim(), label: context.market.label.trim() }),
    observations: Object.freeze(context.observations.map((observation) => Object.freeze({ ...observation, effectiveDate: observation.effectiveDate ? observation.effectiveDate.trim() : null }))),
    limitations: unique(context.limitations), verificationQuestions: unique(context.verificationQuestions), professionalHandoffs: Object.freeze([...context.professionalHandoffs]), reviewSurfaces: Object.freeze([...new Set(context.reviewSurfaces)]),
    persistence: false as const, mutation: false as const, providerActivity: false as const, customerData: false as const, hiddenContext: false as const, adminInheritance: false as const, mcpAuthority: false as const,
  });
  if (admitted.observations.some((observation) => observation.conflict === 'CONFLICTING')) return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: 'CONFLICTING', context: admitted, reasons: Object.freeze([]), nextAction: 'VERIFY_EVIDENCE' });
  if (admitted.observations.some((observation) => observation.freshness === 'STALE')) return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: 'STALE', context: admitted, reasons: Object.freeze([]), nextAction: 'CONFIRM_CURRENTNESS' });
  if (admitted.observations.some((observation) => observation.completeness === 'INCOMPLETE' || observation.evidence.classification === 'NOT_AVAILABLE' || observation.evidence.classification === 'UNVERIFIED_INPUT')) return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: 'INCOMPLETE', context: admitted, reasons: Object.freeze([]), nextAction: 'VERIFY_EVIDENCE' });
  if (admitted.observations.some((observation) => observation.professionalVerificationRequired || observation.evidence.classification === 'PROFESSIONAL_VERIFICATION_REQUIRED') || admitted.professionalHandoffs.length > 0) return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: 'PROFESSIONAL_REVIEW_REQUIRED', context: admitted, reasons: Object.freeze([]), nextAction: 'SEEK_PROFESSIONAL_REVIEW' });
  return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: 'READY', context: admitted, reasons: Object.freeze([]), nextAction: 'REVIEW_BRIEFING' });
}

export function buildAgentMarketHumanBriefing(admission: AgentMarketPreparationAdmission): AgentMarketHumanBriefing {
  const context = admission.context;
  if (!context) return Object.freeze({ status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS, state: admission.state, humanState: AGENT_MARKET_HUMAN_STATE[admission.state], briefingSummary: null, whatMatters: [], whatNeedsVerification: admission.reasons, questionsToPrepare: [], professionalHandoffs: [], evidencePosture: [], limitations: [], reviewSurfaces: [], prohibitedOutputs: PROHIBITED_OUTPUTS, nextAction: admission.nextAction });
  const verification = [
    ...context.observations.filter((observation) => observation.completeness === 'INCOMPLETE' || observation.conflict === 'CONFLICTING' || observation.freshness === 'STALE' || observation.professionalVerificationRequired || observation.evidence.verification !== 'NOT_REQUIRED').map((observation) => observation.label),
    ...context.verificationQuestions,
  ];
  return Object.freeze({
    status: AGENT_MARKET_PREPARATION_ADAPTER_STATUS,
    state: admission.state,
    humanState: AGENT_MARKET_HUMAN_STATE[admission.state],
    briefingSummary: Object.freeze({ marketLabel: context.market.label, supportedObservationCount: context.observations.filter((observation) => observation.evidence.classification === 'FACT' || observation.evidence.classification === 'DERIVED_ILLUSTRATION').length }),
    whatMatters: Object.freeze(context.observations.filter((observation) => observation.evidence.classification === 'FACT' || observation.evidence.classification === 'DERIVED_ILLUSTRATION').map((observation) => observation.evidence)),
    whatNeedsVerification: unique(verification),
    questionsToPrepare: context.verificationQuestions,
    professionalHandoffs: context.professionalHandoffs,
    evidencePosture: Object.freeze(context.observations.map((observation) => Object.freeze({ observationId: observation.id, sourceIdentity: observation.evidence.provenance.sourceId, observationDate: observation.observationDate, effectiveDate: observation.effectiveDate, freshness: observation.freshness, permittedUse: observation.permittedUse, completeness: observation.completeness, conflict: observation.conflict, certification: observation.certification }))),
    limitations: context.limitations,
    reviewSurfaces: context.reviewSurfaces,
    prohibitedOutputs: PROHIBITED_OUTPUTS,
    nextAction: admission.nextAction,
  });
}
