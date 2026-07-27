import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CAO_CONSULTATION_WORKFLOW_DISPOSITION_CONTRACT_VERSION,
  caoBuyerConsultationOutcomes,
  caoBuyerConsultationWorkflowDefinitions,
  caoLeadDispositionDefinitions,
  caoLeadDispositions,
  caoSellerConsultationOutcomes,
  caoSellerConsultationWorkflowDefinitions,
  canTransitionLeadDisposition,
  validateCaoConsultationWorkflowDispositionContract,
  type CaoLeadDispositionDefinition,
} from '../lib/cao/consultationWorkflowDispositionContract.js';

const FORBIDDEN_RUNTIME_PATTERNS = [
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /navigator\.sendBeacon/,
  /document\.cookie/,
  /localStorage/,
  /sessionStorage/,
  /prisma\./,
  /\$transaction/,
  /\.create\s*\(/,
  /\.update\s*\(/,
  /\.delete\s*\(/,
  /sendEmail/,
  /sendPropertyInquiryNotification/,
  /automationAuthorized:\s*true/,
  /telemetryAuthorized:\s*true/,
];

function expectInvalid(
  input: Parameters<typeof validateCaoConsultationWorkflowDispositionContract>[0],
  expectedIssue: RegExp,
) {
  const result = validateCaoConsultationWorkflowDispositionContract(input);
  assert.equal(result.valid, false);
  assert.match(result.issues.join('\n'), expectedIssue);
}

async function assertNoRuntimeActivation() {
  const contractSource = await readFile('lib/cao/consultationWorkflowDispositionContract.ts', 'utf8');

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(contractSource, pattern, `Sprint 3 contract must remain runtime-neutral: ${pattern}`);
  }
}

function assertContractCompleteness() {
  assert.equal(CAO_CONSULTATION_WORKFLOW_DISPOSITION_CONTRACT_VERSION, 'CAO-1.0-SPRINT-3');
  assert.deepEqual(caoBuyerConsultationOutcomes, [
    'SCHEDULED',
    'COMPLETED',
    'RESCHEDULE_REQUIRED',
    'NO_SHOW',
    'CANCELLED',
    'FOLLOW_UP_REQUIRED',
  ]);
  assert.deepEqual(caoSellerConsultationOutcomes, [
    'STRATEGY_MEETING_SCHEDULED',
    'STRATEGY_COMPLETED',
    'LISTING_PREPARATION',
    'NOT_READY',
    'LOST',
    'FOLLOW_UP_REQUIRED',
  ]);
  assert.deepEqual(caoLeadDispositions, [
    'NEW',
    'WORKING',
    'QUALIFIED',
    'ACTIVE_CLIENT',
    'CLOSED_WON',
    'CLOSED_LOST',
    'NURTURE',
    'ARCHIVED',
  ]);

  const result = validateCaoConsultationWorkflowDispositionContract();
  assert.equal(result.valid, true, result.issues.join('\n'));
}

function assertTransitionRules() {
  assert.equal(canTransitionLeadDisposition('NEW', 'WORKING'), true);
  assert.equal(canTransitionLeadDisposition('QUALIFIED', 'ACTIVE_CLIENT'), true);
  assert.equal(canTransitionLeadDisposition('NURTURE', 'QUALIFIED'), true);
  assert.equal(canTransitionLeadDisposition('ARCHIVED', 'WORKING'), false);
  assert.equal(canTransitionLeadDisposition('CLOSED_WON', 'WORKING'), false);
}

function assertFailureModes() {
  expectInvalid(
    {
      buyerDefinitions: caoBuyerConsultationWorkflowDefinitions.filter((definition) => definition.outcome !== 'NO_SHOW'),
    },
    /Missing buyer consultation outcome NO_SHOW/,
  );

  expectInvalid(
    {
      sellerDefinitions: caoSellerConsultationWorkflowDefinitions.map((definition) =>
        definition.outcome === 'NOT_READY'
          ? { ...definition, requiredDocumentation: [] }
          : definition,
      ),
    },
    /Consultation outcome NOT_READY is missing documentation requirements/,
  );

  expectInvalid(
    {
      buyerDefinitions: caoBuyerConsultationWorkflowDefinitions.map((definition) =>
        definition.outcome === 'COMPLETED'
          ? { ...definition, ownership: { ...definition.ownership, responsibleRole: '' as never } }
          : definition,
      ),
    },
    /Consultation outcome COMPLETED is missing ownership/,
  );

  expectInvalid(
    {
      dispositionDefinitions: caoLeadDispositionDefinitions.filter((definition) => definition.disposition !== 'NURTURE'),
    },
    /Missing lead disposition NURTURE/,
  );

  expectInvalid(
    {
      dispositionDefinitions: caoLeadDispositionDefinitions.map((definition) =>
        definition.disposition === 'WORKING'
          ? { ...definition, allowedTransitions: ['BOGUS' as never] }
          : definition,
      ),
    },
    /Lead disposition WORKING references invalid transition BOGUS/,
  );

  expectInvalid(
    {
      dispositionDefinitions: caoLeadDispositionDefinitions.map((definition): CaoLeadDispositionDefinition =>
        definition.disposition === 'CLOSED_LOST'
          ? { ...definition, auditRequirements: [] }
          : definition,
      ),
    },
    /Lead disposition CLOSED_LOST is missing no-automation audit requirement/,
  );

  expectInvalid(
    {
      dispositionDefinitions: caoLeadDispositionDefinitions.map((definition): CaoLeadDispositionDefinition =>
        definition.disposition === 'ARCHIVED'
          ? { ...definition, kpiMappings: [] }
          : definition,
      ),
    },
    /Lead disposition ARCHIVED is missing KPI mappings/,
  );
}

async function main() {
  assertContractCompleteness();
  assertTransitionRules();
  assertFailureModes();
  await assertNoRuntimeActivation();

  console.log(
    '[cao-consultation-workflow-disposition-standard] ok: consultation outcomes, lead disposition taxonomy, transition validation, documentation requirements, ownership, audit requirements, and no-automation boundary verified.',
  );
}

main().catch((error) => {
  console.error(
    '[cao-consultation-workflow-disposition-standard] failed:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
