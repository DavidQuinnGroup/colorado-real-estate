import {
  CAPABILITY_ADMISSION_REGISTRY,
  getCapabilityInputContract,
  type ClientCaseCapability,
  type ExecutionParameterKey,
} from './clientCaseCapabilityReadinessRegistry';
import type { CapabilityReadinessResult } from './clientCaseCapabilityReadinessEvaluator';

export type AgentReadinessCapabilityOption = Readonly<{
  id: ClientCaseCapability;
  label: string;
  executionParameters: readonly ExecutionParameterKey[];
}>;

export type AgentReadinessResultPresentation = Readonly<{
  requirementLabels: Readonly<Record<string, string>>;
  result: CapabilityReadinessResult;
}>;

function titleCaseCapability(capability: ClientCaseCapability) {
  return capability.toLowerCase().split('_').map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join(' ');
}

export function getAgentReadinessCapabilities(): readonly AgentReadinessCapabilityOption[] {
  return CAPABILITY_ADMISSION_REGISTRY
    .filter((entry) => entry.admission === 'ADMITTED_V1')
    .map((entry) => ({
      id: entry.capability,
      label: titleCaseCapability(entry.capability),
      executionParameters: (getCapabilityInputContract(entry.capability)?.requirements ?? [])
        .filter((requirement) => requirement.source === 'EXECUTION_PARAMETER')
        .map((requirement) => requirement.semanticKey as ExecutionParameterKey),
    }));
}

export function presentAgentReadinessResult(result: CapabilityReadinessResult): AgentReadinessResultPresentation {
  const contract = getCapabilityInputContract(result.capability);
  if (!contract) throw new Error('An admitted readiness capability must have an input contract.');
  return {
    result,
    requirementLabels: Object.fromEntries(contract.requirements.map((requirement) => [requirement.id, requirement.label])),
  };
}
