import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CAO_OPERATING_MODEL_CONTRACT_VERSION,
  canTransition,
  caoBuyerLifecycleDefinitions,
  caoOperationalKpiOwnership,
  caoOwnershipContracts,
  caoServiceLevelContracts,
  validateCaoOperatingModelContract,
  type CaoLifecycleStateDefinition,
  type CaoOperatingModelValidationResult,
} from '../lib/cao/index.js';

const FORBIDDEN_RUNTIME_PATTERNS = [
  /fetch\s*\(/,
  /navigator\.sendBeacon/,
  /XMLHttpRequest/,
  /document\.cookie/,
  /localStorage/,
  /sessionStorage/,
  /prisma\./,
  /PrismaClient/,
  /sendEmail/,
  /sendPropertyInquiryNotification/,
  /processAlertQueue/,
  /createTask\s*\(/,
  /createSellerLead\s*\(/,
  /OpenAI/,
  /GIS Sprint 9/,
];

function assertValidContract() {
  assert.equal(CAO_OPERATING_MODEL_CONTRACT_VERSION, 'CAO-1.0-SPRINT-1');

  const validation = validateCaoOperatingModelContract();
  assert.equal(validation.valid, true, validation.issues.join('; '));

  assert.equal(canTransition(caoBuyerLifecycleDefinitions, 'NEW', 'ASSIGNED'), true);
  assert.equal(canTransition(caoBuyerLifecycleDefinitions, 'NEW', 'ACTIVE_CLIENT'), false);

  assert(caoOwnershipContracts.every((contract) => contract.responsibleRole && contract.escalationOwner && contract.closureOwner));
  assert(caoServiceLevelContracts.some((contract) => contract.serviceLevel === 'FIRST_RESPONSE'));
  assert(caoServiceLevelContracts.some((contract) => contract.serviceLevel === 'FOLLOW_UP'));
  assert(caoServiceLevelContracts.some((contract) => contract.serviceLevel === 'CONSULTATION_SCHEDULING'));
  assert(caoServiceLevelContracts.some((contract) => contract.serviceLevel === 'CLOSURE_REVIEW'));
  assert(caoOperationalKpiOwnership.every((kpi) => kpi.telemetryRequired === false));
}

function assertInvalidContractFails(result: CaoOperatingModelValidationResult, pattern: RegExp) {
  assert.equal(result.valid, false);
  assert.match(result.issues.join('; '), pattern);
}

function assertFailureModes() {
  const invalidTransitionDefinition: CaoLifecycleStateDefinition = {
    ...caoBuyerLifecycleDefinitions[0],
    allowedTransitions: ['NOT_A_STATE' as never],
  };

  assertInvalidContractFails(
    validateCaoOperatingModelContract({
      buyerDefinitions: [
        invalidTransitionDefinition as CaoLifecycleStateDefinition<'NEW'>,
        ...caoBuyerLifecycleDefinitions.slice(1),
      ],
    }),
    /Invalid transition from NEW to NOT_A_STATE/,
  );

  assertInvalidContractFails(
    validateCaoOperatingModelContract({
      ownershipContracts: caoOwnershipContracts.filter((contract) => contract.state !== 'NEW'),
    }),
    /Missing ownership contract for NEW/,
  );

  assertInvalidContractFails(
    validateCaoOperatingModelContract({
      serviceLevelContracts: caoServiceLevelContracts.filter((contract) => !contract.appliesToStates.includes('ASSIGNED')),
    }),
    /Missing service-level definition for ASSIGNED/,
  );

  assertInvalidContractFails(
    validateCaoOperatingModelContract({
      buyerDefinitions: caoBuyerLifecycleDefinitions.map((definition) =>
        definition.state === 'CLOSED' ? { ...definition, requiredNotes: [] } : definition,
      ),
    }),
    /Missing closure requirements for terminal state CLOSED/,
  );

  assertInvalidContractFails(
    validateCaoOperatingModelContract({
      kpiOwnership: caoOperationalKpiOwnership.map((kpi) =>
        kpi.kpi === 'CAO-KPI-SLA-COMPLIANCE' ? { ...kpi, telemetryRequired: true as false } : kpi,
      ),
    }),
    /must not require telemetry/,
  );
}

async function assertNoRuntimePrimitives() {
  const source = await readFile('lib/cao/operatingModelContract.ts', 'utf8');

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.equal(pattern.test(source), false, `CAO Sprint 1 contract must not include runtime primitive: ${pattern}`);
  }
}

async function main() {
  assertValidContract();
  assertFailureModes();
  await assertNoRuntimePrimitives();

  console.log(
    '[cao-operating-model-service-level-contract] ok: lifecycles, ownership, service levels, KPI ownership, invalid transitions, closure requirements, and no-runtime boundary verified.',
  );
}

main().catch((error) => {
  console.error('[cao-operating-model-service-level-contract] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
