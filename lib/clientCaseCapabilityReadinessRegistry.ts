import { CRITERION_SEMANTICS, FACT_SEMANTICS, OBJECTIVE_TYPES } from './clientCaseContextSemanticRegistry';
import { SCENARIO_ASSUMPTION_SEMANTICS, SCENARIO_CRITERION_SEMANTICS } from './clientCaseScenarioSemanticRegistry';

export const CLIENT_CASE_CAPABILITY_READINESS_FOUNDATION_VERSION = 'CANONICAL_CLIENT_CASE_CAPABILITY_READINESS_FOUNDATION_V1' as const;

export const CLIENT_CASE_CAPABILITIES = [
  'FINANCIAL_STRATEGY',
  'BUYER_DECISION',
  'MARKET_INTELLIGENCE',
  'INVESTMENT_ANALYSIS',
  'SELLER_DECISION',
  'PROPERTY_INTELLIGENCE',
  'LOCATION_INTELLIGENCE',
] as const;

export type ClientCaseCapability = (typeof CLIENT_CASE_CAPABILITIES)[number];
export type CapabilityAdmission = 'ADMITTED_V1' | 'DEFERRED' | 'NEEDS_RECONCILIATION' | 'NOT_A_READINESS_CAPABILITY';
export type RequirementLevel = 'PRELIMINARY_REQUIRED' | 'COMPREHENSIVE_REQUIRED' | 'HELPFUL';
export type RequirementSource = 'EFFECTIVE_INPUT' | 'OBJECTIVE' | 'CASE_PROPERTY' | 'EXECUTION_PARAMETER';
export type VerificationPolicy = 'ANY_ACCEPTABLE_ORIGIN' | 'EVIDENCE_OR_PROFESSIONAL_INPUT_REQUIRED';
export type ProfessionalInputPolicy = 'NOT_REQUIRED' | 'PROFESSIONAL_INPUT_REQUIRED';
export type FreshnessPolicy = Readonly<{ kind: 'NONE' }> | Readonly<{ kind: 'MAX_AGE_DAYS'; days: number }>;
export type ExecutionParameterKey = 'annualInterestRateBasisPoints' | 'marketScope';
export type ReadinessInputOrigin = 'CANONICAL_FACT' | 'CANONICAL_CRITERION' | 'SCENARIO_ASSUMPTION' | 'SCENARIO_CRITERION' | 'EXECUTION_PARAMETER';

export type CapabilityRequirement = Readonly<{
  id: string;
  label: string;
  group: 'CLIENT' | 'FINANCIAL' | 'LOCATION' | 'MARKET';
  level: RequirementLevel;
  source: RequirementSource;
  semanticKey: string;
  acceptableOrigins: readonly ReadinessInputOrigin[];
  verificationPolicy: VerificationPolicy;
  freshnessPolicy: FreshnessPolicy;
  professionalInputPolicy: ProfessionalInputPolicy;
  applicability: Readonly<{ kind: 'ALWAYS' }> | Readonly<{ kind: 'EXECUTION_PARAMETER_EQUALS'; parameter: 'marketScope'; value: 'CITY' }>;
  sourceEvidence: Readonly<{ path: string; rationale: string }>;
}>;

export type CapabilityInputContract = Readonly<{
  capability: ClientCaseCapability;
  version: 1;
  requirements: readonly CapabilityRequirement[];
}>;

export type CapabilityAdmissionRecord = Readonly<{
  capability: ClientCaseCapability;
  admission: CapabilityAdmission;
  rationale: string;
}>;

const always = { kind: 'ALWAYS' } as const;
const noFreshness = { kind: 'NONE' } as const;
const anyOrigin = 'ANY_ACCEPTABLE_ORIGIN' as const;
const noProfessionalInput = 'NOT_REQUIRED' as const;

function requirement(
  id: string,
  label: string,
  group: CapabilityRequirement['group'],
  level: RequirementLevel,
  source: RequirementSource,
  semanticKey: string,
  acceptableOrigins: readonly ReadinessInputOrigin[],
  sourceEvidence: CapabilityRequirement['sourceEvidence'],
  applicability: CapabilityRequirement['applicability'] = always,
): CapabilityRequirement {
  return Object.freeze({
    id,
    label,
    group,
    level,
    source,
    semanticKey,
    acceptableOrigins: Object.freeze([...acceptableOrigins]),
    verificationPolicy: anyOrigin,
    freshnessPolicy: noFreshness,
    professionalInputPolicy: noProfessionalInput,
    applicability,
    sourceEvidence: Object.freeze(sourceEvidence),
  });
}

export const CAPABILITY_ADMISSION_REGISTRY = Object.freeze([
  { capability: 'FINANCIAL_STRATEGY', admission: 'ADMITTED_V1', rationale: 'Certified Scenario price and down-payment context plus the existing financing preparation contract establish a bounded planning-readiness contract.' },
  { capability: 'BUYER_DECISION', admission: 'ADMITTED_V1', rationale: 'Certified Buyer objective and search Criteria provide direct, durable decision-context semantics.' },
  { capability: 'MARKET_INTELLIGENCE', admission: 'ADMITTED_V1', rationale: 'Existing Market workspace distinguishes client location Criteria from an explicit market-scope execution parameter.' },
  { capability: 'INVESTMENT_ANALYSIS', admission: 'NEEDS_RECONCILIATION', rationale: 'Existing investment analysis requires rent, expenses, financing, and property economics not represented by certified Effective Context semantics.' },
  { capability: 'SELLER_DECISION', admission: 'NEEDS_RECONCILIATION', rationale: 'Existing Seller decision/presentation contracts rely on seller preparation, property evidence, and market inputs not yet modeled as certified Client Case semantics.' },
  { capability: 'PROPERTY_INTELLIGENCE', admission: 'NEEDS_RECONCILIATION', rationale: 'Existing Property workspace requires property facts beyond the current Case Property relationship and occupancy semantic.' },
  { capability: 'LOCATION_INTELLIGENCE', admission: 'NEEDS_RECONCILIATION', rationale: 'Current Client Case context has no canonical location-object relationship or supported location-intelligence input contract.' },
] as const satisfies readonly CapabilityAdmissionRecord[]);

export const CAPABILITY_INPUT_CONTRACTS = Object.freeze([
  Object.freeze({
    capability: 'FINANCIAL_STRATEGY',
    version: 1,
    requirements: Object.freeze([
      requirement('FINANCIAL_STRATEGY_OBJECTIVE', 'Financial strategy objective', 'CLIENT', 'PRELIMINARY_REQUIRED', 'OBJECTIVE', 'FINANCIAL_STRATEGY', [], { path: 'lib/clientCaseContextSemanticRegistry.ts', rationale: 'Certified Client Case objective type.' }),
      requirement('FINANCIAL_STRATEGY_TARGET_ACQUISITION_PRICE', 'Target acquisition price', 'FINANCIAL', 'PRELIMINARY_REQUIRED', 'EFFECTIVE_INPUT', 'TARGET_ACQUISITION_PRICE_CENTS', ['SCENARIO_ASSUMPTION'], { path: 'lib/clientCaseScenarioSemanticRegistry.ts', rationale: 'Hypothetical target acquisition price is an approved Scenario assumption.' }),
      requirement('FINANCIAL_STRATEGY_DOWN_PAYMENT_CONTEXT', 'Down payment context', 'FINANCIAL', 'COMPREHENSIVE_REQUIRED', 'EFFECTIVE_INPUT', 'DOWN_PAYMENT_BPS', ['SCENARIO_ASSUMPTION'], { path: 'lib/clientCaseScenarioSemanticRegistry.ts', rationale: 'Hypothetical down payment basis points are an approved Scenario assumption.' }),
      requirement('FINANCIAL_STRATEGY_INTEREST_RATE', 'Interest rate assumption', 'FINANCIAL', 'COMPREHENSIVE_REQUIRED', 'EXECUTION_PARAMETER', 'annualInterestRateBasisPoints', ['EXECUTION_PARAMETER'], { path: 'lib/financingScenarioCalculator.ts', rationale: 'Financing calculations require an explicit interest-rate assumption; it is not a certified Client Case fact.' }),
    ]),
  }),
  Object.freeze({
    capability: 'BUYER_DECISION',
    version: 1,
    requirements: Object.freeze([
      requirement('BUYER_DECISION_OBJECTIVE', 'Buyer objective', 'CLIENT', 'PRELIMINARY_REQUIRED', 'OBJECTIVE', 'BUY_PRIMARY_HOME', [], { path: 'lib/clientCaseContextSemanticRegistry.ts', rationale: 'Certified Client Case objective type.' }),
      requirement('BUYER_DECISION_TARGET_CITIES', 'Target cities', 'LOCATION', 'PRELIMINARY_REQUIRED', 'EFFECTIVE_INPUT', 'TARGET_CITIES', ['CANONICAL_CRITERION', 'SCENARIO_CRITERION'], { path: 'lib/clientCaseContextSemanticRegistry.ts', rationale: 'Certified Buyer location criterion with registered Scenario override semantics.' }),
      requirement('BUYER_DECISION_PRICE_RANGE', 'Purchase price range', 'FINANCIAL', 'COMPREHENSIVE_REQUIRED', 'EFFECTIVE_INPUT', 'PURCHASE_PRICE_RANGE_CENTS', ['CANONICAL_CRITERION'], { path: 'lib/clientCaseContextSemanticRegistry.ts', rationale: 'Certified Buyer Criterion semantic.' }),
      requirement('BUYER_DECISION_MIN_BEDROOMS', 'Minimum bedrooms', 'CLIENT', 'HELPFUL', 'EFFECTIVE_INPUT', 'MIN_BEDROOMS', ['CANONICAL_CRITERION', 'SCENARIO_CRITERION'], { path: 'lib/clientCaseContextSemanticRegistry.ts', rationale: 'Certified Buyer Criterion with registered Scenario override semantics.' }),
    ]),
  }),
  Object.freeze({
    capability: 'MARKET_INTELLIGENCE',
    version: 1,
    requirements: Object.freeze([
      requirement('MARKET_INTELLIGENCE_SCOPE', 'Market scope', 'MARKET', 'PRELIMINARY_REQUIRED', 'EXECUTION_PARAMETER', 'marketScope', ['EXECUTION_PARAMETER'], { path: 'lib/marketDecisionWorkspace.ts', rationale: 'Market workspace requires an explicit state, city, or neighborhood scope.' }),
      requirement('MARKET_INTELLIGENCE_TARGET_CITIES', 'Target cities for city market scope', 'LOCATION', 'PRELIMINARY_REQUIRED', 'EFFECTIVE_INPUT', 'TARGET_CITIES', ['CANONICAL_CRITERION', 'SCENARIO_CRITERION'], { path: 'lib/marketDecisionWorkspace.ts', rationale: 'City-scoped market context may use certified client location Criteria; state scope does not require it.' }, { kind: 'EXECUTION_PARAMETER_EQUALS', parameter: 'marketScope', value: 'CITY' }),
    ]),
  }),
] as const satisfies readonly CapabilityInputContract[]);

const REGISTERED_EFFECTIVE_SEMANTICS = new Set<string>([
  ...Object.keys(FACT_SEMANTICS),
  ...Object.keys(CRITERION_SEMANTICS),
  ...Object.keys(SCENARIO_ASSUMPTION_SEMANTICS),
  ...Object.keys(SCENARIO_CRITERION_SEMANTICS),
]);
const EXECUTION_PARAMETERS = new Set<ExecutionParameterKey>(['annualInterestRateBasisPoints', 'marketScope']);
const LEVELS = new Set<RequirementLevel>(['PRELIMINARY_REQUIRED', 'COMPREHENSIVE_REQUIRED', 'HELPFUL']);
const ORIGINS = new Set<ReadinessInputOrigin>(['CANONICAL_FACT', 'CANONICAL_CRITERION', 'SCENARIO_ASSUMPTION', 'SCENARIO_CRITERION', 'EXECUTION_PARAMETER']);

export class ClientCaseCapabilityContractError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function assertCapabilityContractRegistryIntegrity(
  contracts: readonly CapabilityInputContract[] = CAPABILITY_INPUT_CONTRACTS,
  admissions: readonly CapabilityAdmissionRecord[] = CAPABILITY_ADMISSION_REGISTRY,
) {
  const capabilityIds = new Set<string>();
  const requirementIds = new Set<string>();
  const admissionIds = new Set<string>();
  for (const admission of admissions) {
    if (!CLIENT_CASE_CAPABILITIES.includes(admission.capability) || admissionIds.has(admission.capability) || !admission.rationale.trim()) {
      throw new ClientCaseCapabilityContractError('Capability admission registry is invalid.');
    }
    admissionIds.add(admission.capability);
  }
  if (admissionIds.size !== CLIENT_CASE_CAPABILITIES.length) throw new ClientCaseCapabilityContractError('Capability admission registry is incomplete.');
  for (const contract of contracts) {
    if (capabilityIds.has(contract.capability) || contract.version !== 1 || !contract.requirements.length) throw new ClientCaseCapabilityContractError('Capability contract identity is invalid.');
    const admission = admissions.find((entry) => entry.capability === contract.capability);
    if (admission?.admission !== 'ADMITTED_V1') throw new ClientCaseCapabilityContractError('Only admitted capabilities may have a V1 contract.');
    capabilityIds.add(contract.capability);
    for (const item of contract.requirements) {
      if (!item.id.trim() || requirementIds.has(item.id) || !LEVELS.has(item.level) || !['EFFECTIVE_INPUT', 'OBJECTIVE', 'CASE_PROPERTY', 'EXECUTION_PARAMETER'].includes(item.source) || !item.label.trim() || !item.sourceEvidence.path || !item.sourceEvidence.rationale) {
        throw new ClientCaseCapabilityContractError('Capability requirement identity is invalid.');
      }
      requirementIds.add(item.id);
      if (!['ANY_ACCEPTABLE_ORIGIN', 'EVIDENCE_OR_PROFESSIONAL_INPUT_REQUIRED'].includes(item.verificationPolicy) || !['NOT_REQUIRED', 'PROFESSIONAL_INPUT_REQUIRED'].includes(item.professionalInputPolicy)) {
        throw new ClientCaseCapabilityContractError('Capability requirement policy is invalid.');
      }
      if (item.freshnessPolicy.kind === 'MAX_AGE_DAYS' && (!Number.isInteger(item.freshnessPolicy.days) || item.freshnessPolicy.days < 1)) throw new ClientCaseCapabilityContractError('Capability requirement freshness policy is invalid.');
      if (item.source === 'EFFECTIVE_INPUT' && !REGISTERED_EFFECTIVE_SEMANTICS.has(item.semanticKey)) throw new ClientCaseCapabilityContractError('Capability requirement semantic is not registered.');
      if (item.source === 'OBJECTIVE' && !OBJECTIVE_TYPES.includes(item.semanticKey as (typeof OBJECTIVE_TYPES)[number])) throw new ClientCaseCapabilityContractError('Capability objective requirement is invalid.');
      if (item.source === 'EXECUTION_PARAMETER' && !EXECUTION_PARAMETERS.has(item.semanticKey as ExecutionParameterKey)) throw new ClientCaseCapabilityContractError('Capability execution-parameter requirement is invalid.');
      if (item.source === 'CASE_PROPERTY') throw new ClientCaseCapabilityContractError('Case Property requirements are not admitted until a registered semantic contract exists.');
      if (item.source !== 'EFFECTIVE_INPUT' && item.acceptableOrigins.length !== 0 && !(item.source === 'EXECUTION_PARAMETER' && item.acceptableOrigins.length === 1 && item.acceptableOrigins[0] === 'EXECUTION_PARAMETER')) {
        throw new ClientCaseCapabilityContractError('Capability requirement origin policy is invalid.');
      }
      if (item.source === 'EFFECTIVE_INPUT' && (!item.acceptableOrigins.length || item.acceptableOrigins.some((origin) => !ORIGINS.has(origin) || origin === 'EXECUTION_PARAMETER'))) throw new ClientCaseCapabilityContractError('Capability requirement origin policy is invalid.');
      if (item.applicability.kind === 'EXECUTION_PARAMETER_EQUALS' && item.applicability.parameter !== 'marketScope') throw new ClientCaseCapabilityContractError('Capability applicability is invalid.');
    }
  }
  if (capabilityIds.size !== admissions.filter((entry) => entry.admission === 'ADMITTED_V1').length) throw new ClientCaseCapabilityContractError('Capability contract registry is incomplete.');
}

export function getCapabilityAdmission(capability: ClientCaseCapability): CapabilityAdmissionRecord {
  const entry = CAPABILITY_ADMISSION_REGISTRY.find((candidate) => candidate.capability === capability);
  if (!entry) throw new ClientCaseCapabilityContractError('Capability admission is unavailable.');
  return entry;
}

export function getCapabilityInputContract(capability: ClientCaseCapability): CapabilityInputContract | null {
  return CAPABILITY_INPUT_CONTRACTS.find((candidate) => candidate.capability === capability) ?? null;
}

export function isClientCaseCapability(value: unknown): value is ClientCaseCapability {
  return typeof value === 'string' && CLIENT_CASE_CAPABILITIES.includes(value as ClientCaseCapability);
}

assertCapabilityContractRegistryIntegrity();
