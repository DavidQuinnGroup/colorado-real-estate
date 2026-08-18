import {
  REIE_DECISION_CONTEXT_DOMAINS,
  validateReieDecisionContext,
  type ReieDecisionContext,
  type ReieDecisionContextDomain,
} from './reieDecisionContextContract';
import {
  validateReieDecisionEvidenceItem,
  type ReieDecisionEvidenceItem,
} from './reieDecisionEvidenceClassification';
import {
  validateReieProfessionalHandoffRequest,
  type ReieProfessionalHandoffRequest,
} from './reieProfessionalHandoffTaxonomy';

export const MULTI_DIMENSIONAL_STRATEGY_ORCHESTRATION_VERSION = 'REIE_MODULE_8_ORCHESTRATION_V1' as const;

export const MULTI_DIMENSIONAL_STRATEGY_ORCHESTRATION_DOMAINS = REIE_DECISION_CONTEXT_DOMAINS;
export type ReieModule8Domain = ReieDecisionContextDomain;

export const REIE_MODULE_8_PRIMITIVE_REGISTRY = {
  GRAND_PLAN: 'app/grand-plan/page.tsx',
  COMPARE: 'app/compare/page.tsx',
  BUYER_DECISION_WORKSPACE: 'lib/buyerDecisionWorkspace.ts',
  SELLER_DECISION_WORKSPACE: 'lib/sellerDecisionWorkspace.ts',
  PROPERTY_DECISION_WORKSPACE: 'lib/property/propertyDecisionWorkspace.ts',
  MARKET_DECISION_WORKSPACE: 'lib/marketDecisionWorkspace.ts',
  FINANCING_DECISION_WORKSPACE: 'lib/financingDecisionWorkspace.ts',
  OFFER_PREPARATION_READINESS: 'lib/offerPreparationReadiness.ts',
  SELLER_UPDATE_PREPARATION: 'lib/sellerUpdatePreparation.ts',
  ADVISORY_HANDOFF: 'components/AdvisoryHandoffGuide.tsx',
  SOURCE_QUALITY_PUBLIC_TRUST: 'lib/sourceQualityOperationalManifest.ts',
} as const;

export type ReieModule8PrimitiveId = keyof typeof REIE_MODULE_8_PRIMITIVE_REGISTRY;
export type ReieModule8PrimitiveReference = Readonly<{
  primitiveId: ReieModule8PrimitiveId;
  repositoryReference: (typeof REIE_MODULE_8_PRIMITIVE_REGISTRY)[ReieModule8PrimitiveId];
}>;

export const REIE_MODULE_8_SAFE_OUTPUT_KINDS = [
  'SELECTED_GOAL',
  'KNOWN_FACT',
  'EXPLICIT_ASSUMPTION',
  'MISSING_INFORMATION',
  'DERIVED_ILLUSTRATION',
  'VERIFICATION_REQUIREMENT',
  'DECISION_QUESTION',
  'CROSS_DOMAIN_DEPENDENCY',
  'PROFESSIONAL_QUESTION',
  'SAFE_CONTINUATION_TARGET',
] as const;

export type ReieModule8SafeOutputKind = (typeof REIE_MODULE_8_SAFE_OUTPUT_KINDS)[number];
export type ReieModule8OrchestrationItem = Readonly<{
  id: string;
  domain: ReieModule8Domain;
  kind: ReieModule8SafeOutputKind;
  evidence: ReieDecisionEvidenceItem;
}>;

export const REIE_MODULE_8_MASTER_CONCEPT_DISPOSITIONS = {
  SELL_TO_BUY_TRANSITION: 'SAFE_DECISION_PREPARATION',
  EQUITY_BRIDGE: 'PROFESSIONAL_QUESTION_GENERATION',
  CONTINGENCY_TIMELINE: 'AGENT_ONLY_PREPARATION',
  INTERTWINED_ASSESSMENT: 'SAFE_DECISION_PREPARATION',
  LISTING_PREP_ROI: 'USER_ENTERED_SCENARIO_ILLUSTRATION',
  TACTICAL_CONCESSIONS: 'DEPRECATED_OUTPUT',
  SCENARIO_MODELING: 'USER_ENTERED_SCENARIO_ILLUSTRATION',
  PROBABILITY_OF_SALE: 'PROHIBITED_OUTPUT',
  STRATEGY_GENERATOR: 'SAFE_DECISION_PREPARATION',
  BUYER_OFFER_STRATEGY: 'PROFESSIONAL_QUESTION_GENERATION',
  SELLER_MARKETING_STRATEGY: 'AGENT_ONLY_PREPARATION',
  NEGOTIATION_PLAYBOOK: 'PROHIBITED_OUTPUT',
  MOVING_COST: 'USER_ENTERED_SCENARIO_ILLUSTRATION',
  GETTING_READY: 'SAFE_DECISION_PREPARATION',
  POST_CLOSING_STRATEGY: 'PROFESSIONAL_QUESTION_GENERATION',
} as const;

export const REIE_MODULE_8_FORBIDDEN_OUTPUT_CODES = [
  'NO_RECOMMENDATION',
  'NO_SUITABILITY',
  'NO_OFFER_PRICE',
  'NO_BID_STRATEGY',
  'NO_CONCESSION_RECOMMENDATION',
  'NO_SALE_PROBABILITY',
  'NO_AUTOMATED_VALUATION',
  'NO_INVESTMENT_CONCLUSION',
  'NO_TAX_ADVICE',
  'NO_LEGAL_ADVICE',
  'NO_LENDING_RECOMMENDATION',
  'NO_HIDDEN_PERSONALIZATION',
  'NO_AUTONOMOUS_COMMUNICATION',
] as const;

export type ReieModule8ForbiddenOutputCode = (typeof REIE_MODULE_8_FORBIDDEN_OUTPUT_CODES)[number];
export type ReieModule8OrchestrationInput = Readonly<{
  context: ReieDecisionContext;
  primitiveReferences: readonly ReieModule8PrimitiveReference[];
  outputs: readonly ReieModule8OrchestrationItem[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  forbiddenOutputCodes: readonly ReieModule8ForbiddenOutputCode[];
}>;

export type ReieModule8OrchestrationValidation = Readonly<{
  classification: 'VALID_MODULE_8_ORCHESTRATION' | 'FAIL_CLOSED';
  orchestration: ReieModule8OrchestrationInput | null;
  reasons: readonly string[];
}>;

function validatePrimitiveReference(reference: ReieModule8PrimitiveReference): readonly string[] {
  const reasons: string[] = [];
  if (!Object.prototype.hasOwnProperty.call(REIE_MODULE_8_PRIMITIVE_REGISTRY, reference.primitiveId)) reasons.push('PRIMITIVE_ID_INVALID');
  if (REIE_MODULE_8_PRIMITIVE_REGISTRY[reference.primitiveId] !== reference.repositoryReference) reasons.push('PRIMITIVE_REPOSITORY_REFERENCE_INVALID');
  return reasons;
}

function validateOrchestrationItem(item: ReieModule8OrchestrationItem): readonly string[] {
  const reasons = [...validateReieDecisionEvidenceItem(item.evidence)];
  if (!item.id.trim()) reasons.push('ORCHESTRATION_ITEM_ID_REQUIRED');
  if (!MULTI_DIMENSIONAL_STRATEGY_ORCHESTRATION_DOMAINS.includes(item.domain)) reasons.push('ORCHESTRATION_DOMAIN_INVALID');
  if (!REIE_MODULE_8_SAFE_OUTPUT_KINDS.includes(item.kind)) reasons.push('ORCHESTRATION_OUTPUT_KIND_INVALID');
  if (item.evidence.classification === 'PROHIBITED_OUTPUT') reasons.push('PROHIBITED_OUTPUT_CANNOT_BE_ORCHESTRATION_OUTPUT');
  if (item.kind === 'KNOWN_FACT' && item.evidence.classification !== 'FACT') reasons.push('KNOWN_FACT_MUST_USE_FACT_CLASSIFICATION');
  if (item.kind === 'EXPLICIT_ASSUMPTION' && item.evidence.classification !== 'USER_ASSUMPTION') reasons.push('EXPLICIT_ASSUMPTION_MUST_USE_USER_ASSUMPTION_CLASSIFICATION');
  if (item.kind === 'DERIVED_ILLUSTRATION' && item.evidence.classification !== 'DERIVED_ILLUSTRATION') reasons.push('DERIVED_ILLUSTRATION_MUST_USE_DERIVED_CLASSIFICATION');
  if (item.kind === 'MISSING_INFORMATION' && item.evidence.classification !== 'NOT_AVAILABLE' && item.evidence.classification !== 'UNVERIFIED_INPUT') reasons.push('MISSING_INFORMATION_MUST_BE_UNVERIFIED_OR_NOT_AVAILABLE');
  if (item.kind === 'VERIFICATION_REQUIREMENT' && item.evidence.classification !== 'PROFESSIONAL_VERIFICATION_REQUIRED') reasons.push('VERIFICATION_REQUIREMENT_MUST_REQUIRE_PROFESSIONAL_VERIFICATION');
  return reasons;
}

export function validateMultiDimensionalStrategyOrchestration(input: ReieModule8OrchestrationInput): ReieModule8OrchestrationValidation {
  const reasons: string[] = [];
  const contextValidation = validateReieDecisionContext({
    role: input.context.role,
    selectedGoals: input.context.selectedGoals,
    items: input.context.items,
    professionalHandoffs: input.context.professionalHandoffs,
    sourcePosture: input.context.sourcePosture,
    persistencePosture: input.context.persistencePosture,
    hiddenTransferPosture: input.context.hiddenTransferPosture,
    prohibitedOutputs: input.context.prohibitedOutputs,
  });
  if (contextValidation.classification !== 'VALID_EXPLICIT_CONTEXT') reasons.push(...contextValidation.reasons);
  if (input.context.schemaVersion !== 'REIE_DECISION_CONTEXT_V1') reasons.push('CONTEXT_SCHEMA_VERSION_INVALID');
  if (input.context.mode !== 'EXPLICIT_CONTEXT_ONLY') reasons.push('CONTEXT_MODE_INVALID');
  input.primitiveReferences.forEach((reference) => reasons.push(...validatePrimitiveReference(reference)));
  input.outputs.forEach((item) => reasons.push(...validateOrchestrationItem(item)));
  input.professionalHandoffs.forEach((handoff) => reasons.push(...validateReieProfessionalHandoffRequest(handoff)));
  if (input.professionalHandoffs.some((handoff) => !input.context.professionalHandoffs.some((contextHandoff) => contextHandoff.id === handoff.id))) reasons.push('HANDOFF_MUST_EXIST_IN_CONTEXT');
  if (input.context.persistencePosture !== 'NOT_PERSISTED') reasons.push('ORCHESTRATION_MUST_REMAIN_NOT_PERSISTED');
  if (input.context.hiddenTransferPosture !== 'PROHIBITED') reasons.push('ORCHESTRATION_HIDDEN_TRANSFER_PROHIBITED');
  for (const code of REIE_MODULE_8_FORBIDDEN_OUTPUT_CODES) {
    if (!input.forbiddenOutputCodes.includes(code)) reasons.push(`FORBIDDEN_OUTPUT_CODE_NOT_DECLARED_${code}`);
  }
  if (reasons.length > 0) return { classification: 'FAIL_CLOSED', orchestration: null, reasons: Object.freeze([...new Set(reasons)].sort()) };
  return {
    classification: 'VALID_MODULE_8_ORCHESTRATION',
    orchestration: Object.freeze({ ...input, context: input.context }),
    reasons: Object.freeze([]),
  };
}
