import { createHash } from 'node:crypto';

import type { Prisma, SellerFinancialResult, SellerFinancialScenario } from '@prisma/client';

import {
  SELLER_FINANCIAL_INPUT_REGISTRY,
  SELLER_FINANCIAL_INPUT_KEYS,
  SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1,
  type SellerFinancialInputKey,
  type SellerFinancialSourceClass,
  type SellerFinancialValueState,
} from './sellerFinancialEstimatedScenario';

export const SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION = 'SELLER_FINANCIAL_OUTPUT_INTEGRATION_V1' as const;
export const SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION = 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1' as const;
export const SELLER_FINANCIAL_OUTPUT_SOURCE_VERSION_PREFIX = 'seller-financial-estimated-scenario-v1:' as const;

type JsonRecord = Readonly<Record<string, Prisma.JsonValue>>;

export type SellerFinancialOutputDependency = Readonly<{
  upstreamArtifact: string;
  downstreamArtifact: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1';
  dependencyType: 'FINANCIAL_DEPENDENCY' | 'FACT_DEPENDENCY';
  materiality: 'HIGH' | 'CRITICAL';
  versionUsed: string;
  fieldMetricScope: readonly string[];
  changePolicy: string;
  invalidationPolicy: 'RECOMPOSE_REQUIRED' | 'REVIEW_REQUIRED';
  reviewPolicy: 'AGENT_REVIEW_REQUIRED';
  currentState: 'CURRENT';
}>;

export type SellerFinancialOutputEvidence = Readonly<{
  sourceSnapshotRefs: readonly Prisma.JsonValue[];
  metricRefs: readonly Prisma.JsonValue[];
  analysisRefs: readonly Prisma.JsonValue[];
  agentInputRefs: readonly Prisma.JsonValue[];
  assumptionRefs: readonly Prisma.JsonValue[];
  limitationRefs: readonly Prisma.JsonValue[];
  rightsRefs: readonly Prisma.JsonValue[];
  freshnessRefs: readonly Prisma.JsonValue[];
  reviewState: 'AGENT_REVIEWED';
  fingerprint: string;
}>;

export type SellerFinancialOutputSemanticProfile = Readonly<{
  schemaVersion: typeof SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION;
  moduleKind: 'FINANCIAL_SCENARIO';
  title: 'Estimated Seller Net Proceeds';
  qualifier: 'ESTIMATED';
  scenario: Readonly<{
    scenarioKey: string;
    versionOrdinal: number;
    lifecycleState: 'REVIEWED';
    reviewedAt: string;
  }>;
  result: Readonly<{
    calculationContract: typeof SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1;
    state: 'ESTIMATED';
    asOf: string;
  }>;
  financials: Readonly<{
    estimatedSalePriceCents: number;
    estimatedPayoffCents: number;
    estimatedSellerCostsCents: number;
    estimatedNetProceedsCents: number;
    netProceedsBasisPoints: number | null;
  }>;
  costBreakdown: readonly Readonly<{
    key: SellerFinancialInputKey;
    label: string;
    state: 'VALUE';
    amountCents: number;
    sourceQualifier: string;
  }>[];
  sourceQualifications: readonly Readonly<{
    key: SellerFinancialInputKey;
    label: string;
    state: SellerFinancialValueState;
    sourceClass: SellerFinancialSourceClass;
    sourceQualifier: string;
    provenanceRef: string;
  }>[];
  unknownZeroNotIncluded: readonly Readonly<{
    key: SellerFinancialInputKey;
    state: Exclude<SellerFinancialValueState, 'VALUE'> | 'ZERO_VALUE';
  }>[];
  freshness: Readonly<{ state: 'POINT_IN_TIME'; asOf: string }>;
  conflictState: 'NO_CONFLICT_RECORDED';
  reviewState: 'AGENT_REVIEWED';
  limitations: readonly string[];
}>;

export type SellerFinancialOutputComposition = Readonly<{
  sourceVersionRef: string;
  displayVersion: string;
  effectiveAsOf: Date;
  contentFingerprint: string;
  semanticProfile: SellerFinancialOutputSemanticProfile;
  dependencies: readonly SellerFinancialOutputDependency[];
  evidence: SellerFinancialOutputEvidence;
  decisionRef: string;
}>;

export class SellerFinancialOutputIntegrationError extends Error {
  constructor(
    readonly code: 'INVALID_FINANCIAL_PROFILE' | 'SCENARIO_NOT_REVIEWED' | 'RESULT_NOT_AVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

function asRecord(value: Prisma.JsonValue, field: string): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} must be an object.`);
  }
  return value as JsonRecord;
}

function arrayValue(value: Prisma.JsonValue, field: string): readonly Prisma.JsonValue[] {
  if (!Array.isArray(value)) throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} must be an array.`);
  return value;
}

function stringValue(value: Prisma.JsonValue | undefined, field: string): string {
  if (typeof value !== 'string' || !value) throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} must be a string.`);
  return value;
}

function integerValue(value: Prisma.JsonValue | undefined, field: string, nullable = false): number | null {
  if (nullable && value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value)) throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} must be integer cents.`);
  return value;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

function qualifier(sourceClass: SellerFinancialSourceClass) {
  return {
    PROFESSIONAL_INPUT: 'Professional-provided input',
    CLIENT_PROVIDED: 'Client-provided input',
    AGENT_ESTIMATE: 'Agent estimate',
    SYSTEM_SOURCE: 'System source input',
    SCENARIO_ASSUMPTION: 'Scenario assumption',
    UNKNOWN: 'Unknown input',
  }[sourceClass];
}

function sourceClass(value: Prisma.JsonValue | undefined, field: string): SellerFinancialSourceClass {
  if (!['PROFESSIONAL_INPUT', 'CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SYSTEM_SOURCE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'].includes(String(value))) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} has an unsupported source class.`);
  }
  return value as SellerFinancialSourceClass;
}

function valueState(value: Prisma.JsonValue | undefined, field: string): SellerFinancialValueState {
  if (!['VALUE', 'UNKNOWN', 'NOT_INCLUDED'].includes(String(value))) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} has an unsupported value state.`);
  }
  return value as SellerFinancialValueState;
}

function inputKey(value: Prisma.JsonValue | undefined, field: string): SellerFinancialInputKey {
  if (!SELLER_FINANCIAL_INPUT_KEYS.includes(String(value) as SellerFinancialInputKey)) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `${field} has an unsupported input key.`);
  }
  return value as SellerFinancialInputKey;
}

function provenanceRef(scenario: SellerFinancialScenario, input: JsonRecord) {
  const professionalInputId = input.professionalInputId;
  if (typeof professionalInputId === 'string' && professionalInputId) return `ProfessionalInput:${professionalInputId}`;
  return `SellerFinancialScenario:${scenario.id}:input:${inputKey(input.key, 'input.key')}`;
}

function inputSnapshots(scenario: SellerFinancialScenario) {
  const inputs = arrayValue(scenario.inputSnapshot, 'scenario.inputSnapshot').map((value) => {
    const input = asRecord(value, 'scenario.inputSnapshot entry');
    const key = inputKey(input.key, 'scenario.inputSnapshot.key');
    const state = valueState(input.state, `scenario.inputSnapshot.${key}.state`);
    const source = sourceClass(input.sourceClass, `scenario.inputSnapshot.${key}.sourceClass`);
    const amountCents = state === 'VALUE' ? integerValue(input.amountCents, `scenario.inputSnapshot.${key}.amountCents`) : null;
    return Object.freeze({ key, state, sourceClass: source, amountCents, provenanceRef: provenanceRef(scenario, input) });
  });
  if (new Set(inputs.map((input) => input.key)).size !== inputs.length) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', 'Scenario inputs must be unique by key.');
  }
  return inputs.sort((left, right) => SELLER_FINANCIAL_INPUT_KEYS.indexOf(left.key) - SELLER_FINANCIAL_INPUT_KEYS.indexOf(right.key));
}

function resultValues(result: SellerFinancialResult) {
  const payload = asRecord(result.resultPayload, 'result.resultPayload');
  const calculationContract = stringValue(payload.calculationContract, 'result.calculationContract');
  if (calculationContract !== SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', 'Result calculation contract is unsupported.');
  }
  if (payload.state !== 'ESTIMATED' || payload.qualifier !== 'ESTIMATED') {
    throw new SellerFinancialOutputIntegrationError('RESULT_NOT_AVAILABLE', 'Only materialized estimated Seller Financial results may be composed.');
  }
  const includedCostKeys = arrayValue(payload.includedCostKeys, 'result.includedCostKeys').map((key) => inputKey(key, 'result.includedCostKeys entry'));
  return Object.freeze({
    asOf: stringValue(payload.asOf, 'result.asOf'),
    grossSalePriceCents: integerValue(payload.grossSalePriceCents, 'result.grossSalePriceCents')!,
    estimatedPayoffCents: integerValue(payload.estimatedPayoffCents, 'result.estimatedPayoffCents')!,
    totalEstimatedSellerCostsCents: integerValue(payload.totalEstimatedSellerCostsCents, 'result.totalEstimatedSellerCostsCents')!,
    estimatedNetProceedsCents: integerValue(payload.estimatedNetProceedsCents, 'result.estimatedNetProceedsCents')!,
    netProceedsBasisPoints: integerValue(payload.netProceedsBasisPoints, 'result.netProceedsBasisPoints', true),
    includedCostKeys,
  });
}

function professionalReferences(scenario: SellerFinancialScenario) {
  return arrayValue(scenario.professionalInputRefs, 'scenario.professionalInputRefs').map((value) => {
    const reference = asRecord(value, 'scenario.professionalInputRefs entry');
    const id = stringValue(reference.id, 'professional input id');
    const versionOrdinal = integerValue(reference.versionOrdinal, 'professional input version')!;
    const evidenceAdmissionId = stringValue(reference.evidenceAdmissionId, 'evidence admission id');
    return Object.freeze({ id, versionOrdinal, evidenceAdmissionId });
  });
}

export function buildSellerFinancialOutputComposition(scenario: SellerFinancialScenario, result: SellerFinancialResult): SellerFinancialOutputComposition {
  if (scenario.lifecycleState !== 'REVIEWED' || !scenario.reviewedAt) {
    throw new SellerFinancialOutputIntegrationError('SCENARIO_NOT_REVIEWED', 'Only a reviewed Seller Financial scenario may be composed into an output.');
  }
  if (result.scenarioId !== scenario.id || result.ownerAgentSubject !== scenario.ownerAgentSubject) {
    throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', 'The selected Seller Financial result does not belong to the scenario.');
  }
  const values = resultValues(result);
  const inputs = inputSnapshots(scenario);
  const inputByKey = new Map(inputs.map((input) => [input.key, input]));
  const salePrice = inputByKey.get('SALE_PRICE');
  const payoff = inputByKey.get('PAYOFF');
  if (!salePrice || !payoff || salePrice.state !== 'VALUE' || payoff.state !== 'VALUE') {
    throw new SellerFinancialOutputIntegrationError('RESULT_NOT_AVAILABLE', 'The selected result is missing required supported inputs.');
  }
  const costBreakdown = values.includedCostKeys.map((key) => {
    const input = inputByKey.get(key);
    if (!input || input.state !== 'VALUE' || input.amountCents === null) {
      throw new SellerFinancialOutputIntegrationError('INVALID_FINANCIAL_PROFILE', `Result includes an unavailable cost input: ${key}.`);
    }
    return Object.freeze({ key, label: SELLER_FINANCIAL_INPUT_REGISTRY[key].label, state: 'VALUE' as const, amountCents: input.amountCents, sourceQualifier: qualifier(input.sourceClass) });
  });
  const sourceQualifications = inputs.map((input) => Object.freeze({
    key: input.key,
    label: SELLER_FINANCIAL_INPUT_REGISTRY[input.key].label,
    state: input.state,
    sourceClass: input.sourceClass,
    sourceQualifier: qualifier(input.sourceClass),
    provenanceRef: input.provenanceRef,
  }));
  const unknownZeroNotIncluded: Array<Readonly<{ key: SellerFinancialInputKey; state: Exclude<SellerFinancialValueState, 'VALUE'> | 'ZERO_VALUE' }>> = [];
  for (const input of inputs) {
    if (input.state !== 'VALUE') unknownZeroNotIncluded.push(Object.freeze({ key: input.key, state: input.state }));
    else if (input.amountCents === 0) unknownZeroNotIncluded.push(Object.freeze({ key: input.key, state: 'ZERO_VALUE' as const }));
  }
  const profile = Object.freeze({
    schemaVersion: SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
    moduleKind: 'FINANCIAL_SCENARIO' as const,
    title: 'Estimated Seller Net Proceeds' as const,
    qualifier: 'ESTIMATED' as const,
    scenario: Object.freeze({ scenarioKey: scenario.scenarioKey, versionOrdinal: scenario.versionOrdinal, lifecycleState: 'REVIEWED' as const, reviewedAt: scenario.reviewedAt.toISOString() }),
    result: Object.freeze({ calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, state: 'ESTIMATED' as const, asOf: values.asOf }),
    financials: Object.freeze({ estimatedSalePriceCents: values.grossSalePriceCents, estimatedPayoffCents: values.estimatedPayoffCents, estimatedSellerCostsCents: values.totalEstimatedSellerCostsCents, estimatedNetProceedsCents: values.estimatedNetProceedsCents, netProceedsBasisPoints: values.netProceedsBasisPoints }),
    costBreakdown: Object.freeze(costBreakdown),
    sourceQualifications: Object.freeze(sourceQualifications),
    unknownZeroNotIncluded: Object.freeze(unknownZeroNotIncluded),
    freshness: Object.freeze({ state: 'POINT_IN_TIME' as const, asOf: values.asOf }),
    conflictState: 'NO_CONFLICT_RECORDED' as const,
    reviewState: 'AGENT_REVIEWED' as const,
    limitations: Object.freeze(['Estimated scenario only; not a settlement statement, tax, legal, lending, title, or guaranteed-proceeds conclusion.', 'Source qualifications are preserved as point-in-time inputs and do not establish currentness beyond the recorded as-of.']),
  }) satisfies SellerFinancialOutputSemanticProfile;
  const professional = professionalReferences(scenario);
  const dependencies: SellerFinancialOutputDependency[] = [
    Object.freeze({ upstreamArtifact: `SellerFinancialScenario:${scenario.id}`, downstreamArtifact: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1', dependencyType: 'FINANCIAL_DEPENDENCY', materiality: 'CRITICAL', versionUsed: `SellerFinancialScenario:${scenario.id}:v${scenario.versionOrdinal}:${scenario.scenarioFingerprint}`, fieldMetricScope: ['scenarioIdentity', 'scenarioVersion', 'inputSnapshot', 'sourceQualification', 'reviewedAt'], changePolicy: 'A material Seller Financial scenario change requires a successor reviewed output.', invalidationPolicy: 'RECOMPOSE_REQUIRED', reviewPolicy: 'AGENT_REVIEW_REQUIRED', currentState: 'CURRENT' }),
    Object.freeze({ upstreamArtifact: `SellerFinancialResult:${result.id}`, downstreamArtifact: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1', dependencyType: 'FINANCIAL_DEPENDENCY', materiality: 'CRITICAL', versionUsed: `SellerFinancialResult:${result.id}:${result.resultFingerprint}`, fieldMetricScope: ['estimatedSalePriceCents', 'estimatedPayoffCents', 'totalEstimatedSellerCostsCents', 'estimatedNetProceedsCents', 'netProceedsBasisPoints', 'asOf'], changePolicy: 'A material Seller Financial result change requires a successor reviewed output.', invalidationPolicy: 'RECOMPOSE_REQUIRED', reviewPolicy: 'AGENT_REVIEW_REQUIRED', currentState: 'CURRENT' }),
    ...professional.flatMap((reference) => [
      Object.freeze({ upstreamArtifact: `ProfessionalInput:${reference.id}`, downstreamArtifact: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1', dependencyType: 'FINANCIAL_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: `ProfessionalInput:${reference.id}:v${reference.versionOrdinal}`, fieldMetricScope: ['value', 'effectiveAt', 'expiresAt', 'verificationStatus'], changePolicy: 'A changed professional input requires Agent review and a successor output.', invalidationPolicy: 'REVIEW_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const }),
      Object.freeze({ upstreamArtifact: `EvidenceAdmission:${reference.evidenceAdmissionId}`, downstreamArtifact: 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1', dependencyType: 'FACT_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: `EvidenceAdmission:${reference.evidenceAdmissionId}`, fieldMetricScope: ['admission', 'rights', 'freshness', 'verification'], changePolicy: 'A changed evidence admission requires Agent review and a successor output.', invalidationPolicy: 'REVIEW_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const }),
    ]),
  ];
  const evidence = Object.freeze({
    sourceSnapshotRefs: Object.freeze(sourceQualifications.map((item) => Object.freeze({ key: item.key, label: item.label, sourceQualifier: item.sourceQualifier, provenanceRef: item.provenanceRef, asOf: values.asOf }))),
    metricRefs: Object.freeze([
      Object.freeze({ key: 'ESTIMATED_SALE_PRICE', amountCents: values.grossSalePriceCents, qualifier: 'ESTIMATED' }),
      Object.freeze({ key: 'ESTIMATED_PAYOFF', amountCents: values.estimatedPayoffCents, qualifier: 'ESTIMATED' }),
      Object.freeze({ key: 'ESTIMATED_SELLER_COSTS', amountCents: values.totalEstimatedSellerCostsCents, qualifier: 'ESTIMATED' }),
      Object.freeze({ key: 'ESTIMATED_NET_PROCEEDS', amountCents: values.estimatedNetProceedsCents, qualifier: 'ESTIMATED' }),
      Object.freeze({ key: 'NET_PROCEEDS_BASIS_POINTS', basisPoints: values.netProceedsBasisPoints, qualifier: 'ESTIMATED' }),
    ]),
    analysisRefs: Object.freeze([{ calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, resultFingerprint: result.resultFingerprint }]),
    agentInputRefs: Object.freeze(sourceQualifications.filter((item) => ['AGENT_ESTIMATE', 'CLIENT_PROVIDED'].includes(item.sourceClass)).map((item) => Object.freeze({ key: item.key, sourceQualifier: item.sourceQualifier, provenanceRef: item.provenanceRef }))),
    assumptionRefs: Object.freeze(sourceQualifications.filter((item) => item.sourceClass === 'SCENARIO_ASSUMPTION').map((item) => Object.freeze({ key: item.key, sourceQualifier: item.sourceQualifier, provenanceRef: item.provenanceRef }))),
    limitationRefs: Object.freeze([...profile.limitations, ...unknownZeroNotIncluded.map((item) => `${item.key}:${item.state}`)]),
    rightsRefs: Object.freeze(['AGENT_REVIEWED_ESTIMATED_SCENARIO_ONLY']),
    freshnessRefs: Object.freeze([Object.freeze({ state: 'POINT_IN_TIME', asOf: values.asOf, conflictState: 'NO_CONFLICT_RECORDED' })]),
    reviewState: 'AGENT_REVIEWED' as const,
    fingerprint: '',
  });
  const evidenceWithFingerprint = Object.freeze({ ...evidence, fingerprint: fingerprint(evidence) }) satisfies SellerFinancialOutputEvidence;
  return Object.freeze({
    sourceVersionRef: `${SELLER_FINANCIAL_OUTPUT_SOURCE_VERSION_PREFIX}${scenario.id}`,
    displayVersion: `Estimated Seller Net Proceeds V${scenario.versionOrdinal}`,
    effectiveAsOf: new Date(values.asOf),
    contentFingerprint: fingerprint(profile),
    semanticProfile: profile,
    dependencies: Object.freeze(dependencies),
    evidence: evidenceWithFingerprint,
    decisionRef: `SELLER_FINANCIAL_SCENARIO_SELECTED:${scenario.id}`,
  });
}

export function isSellerFinancialOutputSemanticProfile(value: unknown): value is SellerFinancialOutputSemanticProfile {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && (value as { schemaVersion?: unknown }).schemaVersion === SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION);
}
