import {
  buildFinancialDecisionPreparation,
  type ReieFinancialDecisionPreparationResult,
} from './financialDecisionPreparationContract';
import {
  validateFinancialScenarioPresentation,
  type ReieFinancialScenarioPresentationItem,
} from './financialScenarioPresentationPolicy';
import {
  validateFinancialDecisionOrchestration,
  type ReieFinancialDecisionOrchestrationInput,
} from './financialDecisionOrchestration';
import type { ReieDecisionContext } from './reieDecisionContextContract';
import type { ReieDecisionEvidenceItem } from './reieDecisionEvidenceClassification';
import type { ReieProfessionalHandoffRequest } from './reieProfessionalHandoffTaxonomy';

export const REIE_FINANCIAL_PREPARATION_COMPOSITION_VERSION = 'REIE_MODULE_6_PHASE_1_CUSTOMER_COMPOSITION_V1' as const;

export type ReieFinancialPreparationCompositionSurface = 'buy' | 'grand-plan' | 'advisory';

export type ReieFinancialProfessionalQuestionGroup = Readonly<{
  role: ReieProfessionalHandoffRequest['role'];
  label: string;
  questions: readonly string[];
}>;

export type ReieFinancialPreparationCompositionModel = Readonly<{
  version: typeof REIE_FINANCIAL_PREPARATION_COMPOSITION_VERSION;
  preparation: ReieFinancialDecisionPreparationResult;
  presentationClassification: 'VALID_SAFE_PRESENTATION' | 'FAIL_CLOSED';
  orchestrationClassification: 'VALID_MODULE_6_ORCHESTRATION' | 'FAIL_CLOSED';
  assumptionInventory: readonly string[];
  missingInputs: readonly string[];
  ownershipCostCategories: readonly string[];
  capexPreparationQuestions: readonly string[];
  movingCostCategories: readonly string[];
  netProceedsRequiredInputs: readonly string[];
  professionalQuestionGroups: readonly ReieFinancialProfessionalQuestionGroup[];
  protectedBoundaries: Readonly<{
    persistence: false;
    hiddenTransfer: false;
    providerData: false;
    lenderData: false;
    recommendation: false;
    affordability: false;
    qualification: false;
    investmentOutput: false;
    netProceedsConclusion: false;
  }>;
}>;

const NO_CONCLUSION = ['No approval, qualification, affordability, buying-power, lender, tax, legal, investment, valuation, or suitability conclusion.'] as const;

const OWNERSHIP_COST_CATEGORIES = [
  'Property taxes',
  'Homeowners insurance',
  'HOA dues and included services',
  'Mortgage insurance',
  'Maintenance and reserves',
  'Utilities and recurring services',
  'Closing and prepaid-cost questions',
] as const;

const CAPEX_PREPARATION_QUESTIONS = [
  'Which inspection, condition, or repair items should be priced or verified?',
  'Which maintenance, reserve, or improvement categories could affect planning?',
  'Which contractor, inspector, engineer, or other specialist should review the open question?',
] as const;

const MOVING_COST_CATEGORIES = [
  'Packing and transportation',
  'Storage and transition overlap',
  'Travel, temporary housing, and timing',
  'Utility, service, and address changes',
  'Cleaning, setup, and accessibility needs',
] as const;

const NET_PROCEEDS_REQUIRED_INPUTS = [
  'Sale price and transaction-cost assumptions',
  'Mortgage payoff and other lien questions',
  'Taxes, fees, credits, repairs, and closing-cost questions',
  'Timing, possession, moving, and transition costs',
  'Professional review of the final transaction statement',
] as const;

const ASSUMPTION_INVENTORY = [
  'Purchase price, down payment, interest rate, and loan term',
  'Recurring ownership-cost assumptions',
  'Closing-cost, moving-cost, maintenance, and reserve questions',
  'Timeline and property-specific facts still requiring verification',
] as const;

const PROFESSIONAL_QUESTION_GROUPS: readonly ReieFinancialProfessionalQuestionGroup[] = [
  {
    role: 'LENDER',
    label: 'Qualified lender',
    questions: ['Which loan terms, lender fees, documentation, and timing rules should be verified?', 'Which user-entered assumptions differ from a lender estimate or approval process?'],
  },
  {
    role: 'TAX_PROFESSIONAL',
    label: 'Tax professional',
    questions: ['Which tax questions, transaction assumptions, or property-specific records require review?'],
  },
  {
    role: 'TITLE_PROFESSIONAL',
    label: 'Title professional or attorney',
    questions: ['Which title, lien, legal, contract, or closing questions require professional confirmation?'],
  },
  {
    role: 'INSURANCE_PROFESSIONAL',
    label: 'Insurance professional',
    questions: ['Which coverage, property-condition, risk, and premium assumptions should be verified?'],
  },
  {
    role: 'INSPECTOR',
    label: 'Inspector, engineer, or contractor',
    questions: ['Which condition, repair, maintenance, CAPEX, or specialist questions remain open?'],
  },
  {
    role: 'REAL_ESTATE_AGENT',
    label: 'Real-estate advisor',
    questions: ['Which property, timing, transition, and transaction questions should be discussed before action?'],
  },
] as const;

function evidence(id: string, value: string): ReieDecisionEvidenceItem {
  return {
    id,
    label: value,
    value,
    classification: 'USER_ASSUMPTION',
    provenance: {
      origin: 'EXPLICIT_CUSTOMER_INPUT',
      reference: 'customer-selected-preparation-context',
      sourceId: null,
      freshness: 'NOT_APPLICABLE',
      rights: 'NOT_APPLICABLE',
    },
    visibility: 'GUIDED',
    verification: 'NOT_REQUIRED',
    prohibitedUse: NO_CONCLUSION,
  };
}

function handoff(id: string, role: ReieProfessionalHandoffRequest['role'], questionCategory: string): ReieProfessionalHandoffRequest {
  return {
    id,
    role,
    questionCategory,
    whyVerificationIsNeeded: 'This question depends on current, professional, property-specific, or transaction-specific review.',
    informationToBring: ['Visible assumptions and unresolved questions selected by the customer.'],
    whatReieCannotDetermine: ['Professional conclusion, approval, qualification, advice, suitability, or final transaction result.'],
    customerSelectedHandoff: true,
    agentPreparationOnly: false,
    contextItemIds: ['financial-goal'],
    providerRecommendation: false,
    ranking: false,
    referralRelationship: false,
    automaticCommunication: false,
  };
}

function buildContext(handoffs: readonly ReieProfessionalHandoffRequest[]): ReieDecisionContext {
  const goal = evidence('financial-goal', 'Prepare financial and transition questions');
  return {
    schemaVersion: 'REIE_DECISION_CONTEXT_V1',
    mode: 'EXPLICIT_CONTEXT_ONLY',
    role: 'CUSTOMER',
    selectedGoals: [{ id: goal.id, domain: 'FINANCING', evidence: goal }],
    items: [],
    professionalHandoffs: handoffs,
    sourcePosture: { state: 'UNVERIFIED', rights: 'UNKNOWN_OR_UNRESOLVED', freshness: 'UNKNOWN' },
    persistencePosture: 'NOT_PERSISTED',
    hiddenTransferPosture: 'PROHIBITED',
    prohibitedOutputs: ['NO_RECOMMENDATION', 'NO_AFFORDABILITY_CONCLUSION', 'NO_QUALIFICATION', 'NO_INVESTMENT_CONCLUSION', 'NO_NET_PROCEEDS_CONCLUSION'],
  };
}

function buildOrchestration(context: ReieDecisionContext, handoffs: readonly ReieProfessionalHandoffRequest[]): ReieFinancialDecisionOrchestrationInput {
  const goal = context.selectedGoals[0].evidence;
  return {
    financialContexts: ['FINANCING_PREPARATION_CONTEXT', 'OWNERSHIP_COST_CONTEXT', 'MOVING_COST_PREPARATION', 'NET_PROCEEDS_INPUT_PREPARATION', 'PROFESSIONAL_VERIFICATION'],
    financialHandoffs: handoffs,
    module8: {
      context,
      primitiveReferences: [{ primitiveId: 'FINANCING_DECISION_WORKSPACE', repositoryReference: 'lib/financingDecisionWorkspace.ts' }],
      outputs: [{ id: 'financial-preparation-goal', domain: 'FINANCING', kind: 'EXPLICIT_ASSUMPTION', evidence: goal }],
      professionalHandoffs: handoffs,
      forbiddenOutputCodes: ['NO_RECOMMENDATION', 'NO_SUITABILITY', 'NO_OFFER_PRICE', 'NO_BID_STRATEGY', 'NO_CONCESSION_RECOMMENDATION', 'NO_SALE_PROBABILITY', 'NO_AUTOMATED_VALUATION', 'NO_INVESTMENT_CONCLUSION', 'NO_TAX_ADVICE', 'NO_LEGAL_ADVICE', 'NO_LENDING_RECOMMENDATION', 'NO_HIDDEN_PERSONALIZATION', 'NO_AUTONOMOUS_COMMUNICATION'],
    },
  };
}

function presentationItems(): readonly ReieFinancialScenarioPresentationItem[] {
  return [
    {
      id: 'financial-assumption-inventory', kind: 'ASSUMPTION_INVENTORY', classification: 'NOT_AVAILABLE', value: null,
      inputs: [], assumptions: ['Customer-selected values remain assumptions until verified.'], calculationType: null, limitations: [...NO_CONCLUSION], recommendation: false,
    },
    {
      id: 'financial-missing-inputs', kind: 'MISSING_INPUT_LIST', classification: 'NOT_AVAILABLE', value: null,
      inputs: [], assumptions: [], calculationType: null, limitations: [...NO_CONCLUSION], recommendation: false,
    },
    {
      id: 'financial-professional-questions', kind: 'PROFESSIONAL_QUESTIONS', classification: 'PROFESSIONAL_VERIFICATION_REQUIRED', value: 'Questions for qualified professional review',
      inputs: [], assumptions: [], calculationType: null, limitations: [...NO_CONCLUSION], recommendation: false,
    },
  ];
}

export function buildFinancialPreparationCompositionModel(): ReieFinancialPreparationCompositionModel {
  const handoffs = PROFESSIONAL_QUESTION_GROUPS.map((group) => handoff(`financial-${group.role.toLowerCase()}`, group.role, group.label));
  const context = buildContext(handoffs);
  const preparation = buildFinancialDecisionPreparation({
    context,
    preparationContext: 'FINANCING_PREPARATION_CONTEXT',
    scenarioInput: {},
    fields: [],
    movingCostCategories: MOVING_COST_CATEGORIES,
    capexCategories: ['Inspection follow-up', 'Maintenance reserve', 'Repair or improvement planning'],
    timeline: null,
    customerSelectedFinancialQuestions: ['Which assumptions should be verified before relying on a financial scenario?'],
    professionalHandoffs: handoffs,
  });
  const presentationClassification = validateFinancialScenarioPresentation(presentationItems()).classification;
  const orchestrationClassification = validateFinancialDecisionOrchestration(buildOrchestration(context, handoffs)).classification;
  return {
    version: REIE_FINANCIAL_PREPARATION_COMPOSITION_VERSION,
    preparation,
    presentationClassification,
    orchestrationClassification,
    assumptionInventory: ASSUMPTION_INVENTORY,
    missingInputs: preparation.missingInputs.map((item) => item.label),
    ownershipCostCategories: OWNERSHIP_COST_CATEGORIES,
    capexPreparationQuestions: CAPEX_PREPARATION_QUESTIONS,
    movingCostCategories: MOVING_COST_CATEGORIES,
    netProceedsRequiredInputs: NET_PROCEEDS_REQUIRED_INPUTS,
    professionalQuestionGroups: PROFESSIONAL_QUESTION_GROUPS,
    protectedBoundaries: {
      persistence: false,
      hiddenTransfer: false,
      providerData: false,
      lenderData: false,
      recommendation: false,
      affordability: false,
      qualification: false,
      investmentOutput: false,
      netProceedsConclusion: false,
    },
  };
}
