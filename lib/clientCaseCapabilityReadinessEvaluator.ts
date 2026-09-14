import type { PrismaClient } from '@prisma/client';

import {
  createClientCaseEffectiveContextResolver,
  type EffectiveContext,
  type EffectiveContextRequest,
  type ResolvedInput,
} from './clientCaseEffectiveContextResolver';
import {
  getCapabilityAdmission,
  getCapabilityInputContract,
  isClientCaseCapability,
  type CapabilityInputContract,
  type CapabilityRequirement,
  type ClientCaseCapability,
  type ReadinessInputOrigin,
} from './clientCaseCapabilityReadinessRegistry';

export const CLIENT_CASE_CAPABILITY_READINESS_EVALUATOR_VERSION = 'CANONICAL_CLIENT_CASE_CAPABILITY_READINESS_EVALUATOR_V1' as const;

export type CapabilityReadinessStatus = 'INSUFFICIENT' | 'PRELIMINARY_READY' | 'COMPREHENSIVE_READY';
export type RequirementPresence = 'PRESENT' | 'MISSING' | 'NOT_APPLICABLE';
export type RequirementVerification = 'VERIFIED' | 'UNVERIFIED' | 'NOT_REQUIRED' | 'UNKNOWN';
export type RequirementFreshness = 'CURRENT' | 'STALE' | 'NOT_APPLICABLE' | 'UNKNOWN';
export type RequirementProfessionalInput = 'SATISFIED' | 'REQUIRED' | 'NOT_REQUIRED' | 'UNKNOWN';

export type ClientCaseCapabilityReadinessExecutionParameters = Readonly<{
  annualInterestRateBasisPoints?: number;
  marketScope?: 'STATE' | 'CITY' | 'NEIGHBORHOOD';
}>;

export type ReadinessMatchedInput = Readonly<{
  semanticKey: string;
  origin: ReadinessInputOrigin;
  sourceRecordId: string;
  sourceVersionId: string | null;
  scenarioVersionId: string | null;
  contributingSourceRecordIds: readonly string[];
}>;

export type CapabilityRequirementReadiness = Readonly<{
  requirementId: string;
  level: CapabilityRequirement['level'];
  presence: RequirementPresence;
  verification: RequirementVerification;
  freshness: RequirementFreshness;
  professionalInput: RequirementProfessionalInput;
  conflict: boolean;
  matchedInputs: readonly ReadinessMatchedInput[];
}>;

export type CapabilityReadinessResult = Readonly<{
  evaluatorVersion: typeof CLIENT_CASE_CAPABILITY_READINESS_EVALUATOR_VERSION;
  capability: ClientCaseCapability;
  contractVersion: CapabilityInputContract['version'];
  evaluatedAt: string;
  context: Readonly<{
    clientCaseId: string;
    mode: EffectiveContext['mode'];
    scenarioId: string | null;
    scenarioVersionId: string | null;
    effectiveContextContractVersion: EffectiveContext['contractVersion'];
    effectiveContextRulesetVersion: EffectiveContext['resolutionRulesetVersion'];
  }>;
  status: CapabilityReadinessStatus;
  requirements: readonly CapabilityRequirementReadiness[];
  missingPreliminary: readonly string[];
  missingComprehensive: readonly string[];
  helpfulMissing: readonly string[];
  unverified: readonly string[];
  stale: readonly string[];
  professionalInputNeeded: readonly string[];
  conflicts: readonly string[];
  limitations: readonly EffectiveContext['limitations'][number][];
}>;

export class ClientCaseCapabilityReadinessError extends Error {
  constructor(
    readonly code: 'INVALID_REQUEST' | 'UNKNOWN_CAPABILITY' | 'CAPABILITY_NOT_ADMITTED' | 'INVALID_EXECUTION_PARAMETERS',
    message: string,
  ) {
    super(message);
  }
}

type EffectiveContextResolver = Readonly<{
  resolve(ownerAgentSubject: string, clientCaseId: string, request: EffectiveContextRequest): Promise<EffectiveContext>;
}>;

function requiredId(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160) {
    throw new ClientCaseCapabilityReadinessError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function parseExecutionParameters(capability: ClientCaseCapability, raw: unknown): ClientCaseCapabilityReadinessExecutionParameters {
  if (raw === undefined) return {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ClientCaseCapabilityReadinessError('INVALID_EXECUTION_PARAMETERS', 'Execution parameters are invalid.');
  }
  const value = raw as Record<string, unknown>;
  const allowed = capability === 'FINANCIAL_STRATEGY'
    ? new Set(['annualInterestRateBasisPoints'])
    : capability === 'MARKET_INTELLIGENCE'
      ? new Set(['marketScope'])
      : new Set<string>();
  if (Object.keys(value).some((key) => !allowed.has(key))) {
    throw new ClientCaseCapabilityReadinessError('INVALID_EXECUTION_PARAMETERS', 'Execution parameters are not supported by this capability.');
  }
  const parameters: Record<string, unknown> = {};
  if (Object.hasOwn(value, 'annualInterestRateBasisPoints')) {
    if (typeof value.annualInterestRateBasisPoints !== 'number' || !Number.isSafeInteger(value.annualInterestRateBasisPoints) || value.annualInterestRateBasisPoints < 0) {
      throw new ClientCaseCapabilityReadinessError('INVALID_EXECUTION_PARAMETERS', 'annualInterestRateBasisPoints is invalid.');
    }
    parameters.annualInterestRateBasisPoints = value.annualInterestRateBasisPoints;
  }
  if (Object.hasOwn(value, 'marketScope')) {
    if (value.marketScope !== 'STATE' && value.marketScope !== 'CITY' && value.marketScope !== 'NEIGHBORHOOD') {
      throw new ClientCaseCapabilityReadinessError('INVALID_EXECUTION_PARAMETERS', 'marketScope is invalid.');
    }
    parameters.marketScope = value.marketScope;
  }
  return parameters as ClientCaseCapabilityReadinessExecutionParameters;
}

function applies(requirement: CapabilityRequirement, parameters: ClientCaseCapabilityReadinessExecutionParameters): boolean {
  if (requirement.applicability.kind === 'ALWAYS') return true;
  return parameters[requirement.applicability.parameter] === requirement.applicability.value;
}

function inputLineage(input: ResolvedInput): ReadinessMatchedInput {
  return {
    semanticKey: input.semanticKey,
    origin: input.origin as ReadinessInputOrigin,
    sourceRecordId: input.sourceRecordId,
    sourceVersionId: input.sourceVersionId,
    scenarioVersionId: input.scenarioVersionId,
    contributingSourceRecordIds: [...input.contributingSourceRecordIds],
  };
}

function matchingInputs(context: EffectiveContext, requirement: CapabilityRequirement): readonly ResolvedInput[] {
  if (requirement.source !== 'EFFECTIVE_INPUT') return [];
  return context.resolvedInputs.filter((input) => input.semanticKey === requirement.semanticKey && requirement.acceptableOrigins.includes(input.origin as ReadinessInputOrigin));
}

function hasObjective(context: EffectiveContext, semanticKey: string) {
  return context.objectives.some((objective) => objective.objectiveType === semanticKey && objective.status === 'ACTIVE' && objective.archivedAt === null);
}

function hasExecutionParameter(parameters: ClientCaseCapabilityReadinessExecutionParameters, key: string) {
  return Object.hasOwn(parameters, key);
}

function requirementPresence(context: EffectiveContext, requirement: CapabilityRequirement, parameters: ClientCaseCapabilityReadinessExecutionParameters, applicable: boolean, inputs: readonly ResolvedInput[]): RequirementPresence {
  if (!applicable) return 'NOT_APPLICABLE';
  if (requirement.source === 'EFFECTIVE_INPUT') return inputs.length ? 'PRESENT' : 'MISSING';
  if (requirement.source === 'OBJECTIVE') return hasObjective(context, requirement.semanticKey) ? 'PRESENT' : 'MISSING';
  if (requirement.source === 'EXECUTION_PARAMETER') return hasExecutionParameter(parameters, requirement.semanticKey) ? 'PRESENT' : 'MISSING';
  return context.properties.length ? 'PRESENT' : 'MISSING';
}

function verification(requirement: CapabilityRequirement, presence: RequirementPresence, inputs: readonly ResolvedInput[]): RequirementVerification {
  if (presence !== 'PRESENT') return 'UNKNOWN';
  if (requirement.verificationPolicy === 'ANY_ACCEPTABLE_ORIGIN') return 'NOT_REQUIRED';
  return inputs.some((input) => input.provenance.evidenceAdmissionId || input.provenance.professionalInputId) ? 'VERIFIED' : 'UNVERIFIED';
}

function freshness(requirement: CapabilityRequirement, presence: RequirementPresence, inputs: readonly ResolvedInput[], evaluationTime: Date): RequirementFreshness {
  if (requirement.freshnessPolicy.kind === 'NONE' || presence === 'NOT_APPLICABLE') return 'NOT_APPLICABLE';
  if (presence !== 'PRESENT') return 'UNKNOWN';
  const maxAgeMs = requirement.freshnessPolicy.days * 24 * 60 * 60 * 1000;
  const observed = inputs.map((input) => input.temporal.observedAt ?? input.temporal.effectiveAt).filter((entry): entry is Date => entry instanceof Date);
  if (!observed.length) return 'UNKNOWN';
  return observed.every((entry) => evaluationTime.getTime() - entry.getTime() <= maxAgeMs) ? 'CURRENT' : 'STALE';
}

function professionalInput(requirement: CapabilityRequirement, presence: RequirementPresence, inputs: readonly ResolvedInput[]): RequirementProfessionalInput {
  if (requirement.professionalInputPolicy === 'NOT_REQUIRED' || presence === 'NOT_APPLICABLE') return 'NOT_REQUIRED';
  if (presence !== 'PRESENT') return 'UNKNOWN';
  return inputs.some((input) => input.provenance.professionalInputId) ? 'SATISFIED' : 'REQUIRED';
}

function conflict(context: EffectiveContext, requirement: CapabilityRequirement, inputs: readonly ResolvedInput[]) {
  return inputs.some((input) => input.limitations.includes('CONFLICT_REQUIRES_CAPABILITY_RULE'))
    || context.limitations.some((limitation) => limitation.code === 'CONFLICT_REQUIRES_CAPABILITY_RULE' && limitation.semanticKey === requirement.semanticKey);
}

function requirementReadiness(context: EffectiveContext, requirement: CapabilityRequirement, parameters: ClientCaseCapabilityReadinessExecutionParameters, evaluationTime: Date): CapabilityRequirementReadiness {
  const applicable = applies(requirement, parameters);
  const inputs = matchingInputs(context, requirement);
  const presence = requirementPresence(context, requirement, parameters, applicable, inputs);
  return {
    requirementId: requirement.id,
    level: requirement.level,
    presence,
    verification: verification(requirement, presence, inputs),
    freshness: freshness(requirement, presence, inputs, evaluationTime),
    professionalInput: professionalInput(requirement, presence, inputs),
    conflict: applicable && conflict(context, requirement, inputs),
    matchedInputs: inputs.map(inputLineage).sort((left, right) => left.sourceRecordId.localeCompare(right.sourceRecordId)),
  };
}

function blocking(result: CapabilityRequirementReadiness) {
  return result.presence === 'MISSING' || result.verification === 'UNVERIFIED' || result.freshness === 'STALE' || result.professionalInput === 'REQUIRED' || result.conflict;
}

export function evaluateCapabilityReadinessFromContext(
  context: EffectiveContext,
  contract: CapabilityInputContract,
  rawParameters: unknown = {},
  evaluationTime = new Date(),
): CapabilityReadinessResult {
  const parameters = parseExecutionParameters(contract.capability, rawParameters);
  if (!Number.isFinite(evaluationTime.getTime())) throw new ClientCaseCapabilityReadinessError('INVALID_REQUEST', 'Evaluation time is invalid.');
  const requirements = contract.requirements.map((requirement) => requirementReadiness(context, requirement, parameters, evaluationTime));
  const missingAtLevel = (level: CapabilityRequirementReadiness['level']) => requirements.filter((requirement) => requirement.level === level && requirement.presence === 'MISSING').map((requirement) => requirement.requirementId);
  const blockedAtLevel = (level: CapabilityRequirementReadiness['level']) => requirements.filter((requirement) => requirement.level === level && blocking(requirement));
  const missingPreliminary = missingAtLevel('PRELIMINARY_REQUIRED');
  const missingComprehensive = missingAtLevel('COMPREHENSIVE_REQUIRED');
  const helpfulMissing = missingAtLevel('HELPFUL');
  const unverified = requirements.filter((requirement) => requirement.verification === 'UNVERIFIED').map((requirement) => requirement.requirementId);
  const stale = requirements.filter((requirement) => requirement.freshness === 'STALE').map((requirement) => requirement.requirementId);
  const professionalInputNeeded = requirements.filter((requirement) => requirement.professionalInput === 'REQUIRED').map((requirement) => requirement.requirementId);
  const conflicts = requirements.filter((requirement) => requirement.conflict).map((requirement) => requirement.requirementId);
  const status: CapabilityReadinessStatus = blockedAtLevel('PRELIMINARY_REQUIRED').length
    ? 'INSUFFICIENT'
    : blockedAtLevel('COMPREHENSIVE_REQUIRED').length ? 'PRELIMINARY_READY' : 'COMPREHENSIVE_READY';
  return {
    evaluatorVersion: CLIENT_CASE_CAPABILITY_READINESS_EVALUATOR_VERSION,
    capability: contract.capability,
    contractVersion: contract.version,
    evaluatedAt: evaluationTime.toISOString(),
    context: {
      clientCaseId: context.clientCase.id,
      mode: context.mode,
      scenarioId: context.scenario?.id ?? null,
      scenarioVersionId: context.scenario?.resolvedVersionId ?? null,
      effectiveContextContractVersion: context.contractVersion,
      effectiveContextRulesetVersion: context.resolutionRulesetVersion,
    },
    status,
    requirements,
    missingPreliminary,
    missingComprehensive,
    helpfulMissing,
    unverified,
    stale,
    professionalInputNeeded,
    conflicts,
    limitations: context.limitations.map((limitation) => ({ ...limitation })),
  };
}

export type CapabilityReadinessRequest = Readonly<{
  clientCaseId: string;
  capability: ClientCaseCapability;
  scenarioVersionId?: string;
  executionParameters?: ClientCaseCapabilityReadinessExecutionParameters;
}>;

export function createClientCaseCapabilityReadinessServiceFromResolver(resolver: EffectiveContextResolver) {
  return {
    async evaluate(ownerAgentSubject: string, rawRequest: CapabilityReadinessRequest, evaluationTime = new Date()): Promise<CapabilityReadinessResult> {
      const clientCaseId = requiredId(rawRequest?.clientCaseId, 'clientCaseId');
      const owner = requiredId(ownerAgentSubject, 'ownerAgentSubject');
      if (!isClientCaseCapability(rawRequest?.capability)) {
        throw new ClientCaseCapabilityReadinessError('UNKNOWN_CAPABILITY', 'The requested capability is unknown.');
      }
      const admission = getCapabilityAdmission(rawRequest.capability);
      if (admission.admission !== 'ADMITTED_V1') {
        throw new ClientCaseCapabilityReadinessError('CAPABILITY_NOT_ADMITTED', 'The requested capability is not admitted to the V1 readiness foundation.');
      }
      const contract = getCapabilityInputContract(rawRequest.capability);
      if (!contract) throw new ClientCaseCapabilityReadinessError('CAPABILITY_NOT_ADMITTED', 'The requested capability has no admitted readiness contract.');
      const parameters = parseExecutionParameters(rawRequest.capability, rawRequest.executionParameters);
      const contextRequest: EffectiveContextRequest = rawRequest.scenarioVersionId === undefined
        ? { mode: 'CANONICAL_BASELINE' }
        : { mode: 'SCENARIO_VERSION', scenarioVersionId: requiredId(rawRequest.scenarioVersionId, 'scenarioVersionId') };
      const context = await resolver.resolve(owner, clientCaseId, contextRequest);
      return evaluateCapabilityReadinessFromContext(context, contract, parameters, evaluationTime);
    },
  };
}

export function createClientCaseCapabilityReadinessService(prisma: Pick<PrismaClient, 'clientCase' | 'clientCaseScenarioVersion'>) {
  return createClientCaseCapabilityReadinessServiceFromResolver(createClientCaseEffectiveContextResolver(prisma));
}
