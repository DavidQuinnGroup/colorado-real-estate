import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildReieAdjustmentTraceabilityRegister,
  validateReieAdjustmentTraceabilityRegister,
} from '../lib/eparb/requirementsTraceabilityContract.js';

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
  /runtimeActivationAuthorized:\s*true/,
];

async function assertNoRuntimeActivation() {
  const source = await readFile('lib/eparb/requirementsTraceabilityContract.ts', 'utf8');
  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(source, pattern, `REIE adjustments traceability must remain governance-only: ${pattern}`);
  }
}

async function assertDocumentationCoverage() {
  const register = await readFile('docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-REQUIREMENTS-REGISTER.md', 'utf8');
  const matrix = await readFile('docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-TRACEABILITY-MATRIX.md', 'utf8');
  const review = await readFile('docs/project-atlas/executive-library/EPARB-REVIEW-001-ENTERPRISE-ADMINISTRATIVE-AUTHENTICATION-AND-ACCESS-ARCHITECTURE.md', 'utf8');
  const chatStart = await readFile('docs/CHAT_START.md', 'utf8');

  assert.match(register, /SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY/, 'Register must record source reconciliation.');
  assert.match(register, /REIE-ADJ-001/, 'Register must include REIE-ADJ-001.');
  assert.match(register, /REIE-ADJ-040/, 'Register must include REIE-ADJ-040.');
  assert.match(register, /No strategic completion review/, 'Register must include future completion reconciliation rule.');
  assert.match(register, /SUPERSEDED/, 'Register must document supersession rule.');
  assert.match(matrix, /Future Authorization Path/, 'Traceability matrix must include future authorization path.');
  assert.match(matrix, /REIE-ADJ-015/, 'Traceability matrix must include Mortgage Calculator requirement.');
  assert.match(matrix, /REIE-ADJ-020/, 'Traceability matrix must include Sundance page requirement.');
  assert.match(review, /Requirements Traceability/, 'EPARB Review 1 must connect to requirements traceability.');
  assert.match(chatStart, /REIE_7_1_ADJUSTMENTS_REQUIREMENTS_REGISTER_ESTABLISHED/, 'CHAT_START must record register establishment.');
}

function assertRegisterCompleteness() {
  const register = buildReieAdjustmentTraceabilityRegister();
  const result = validateReieAdjustmentTraceabilityRegister(register);

  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.equal(register.sourceDocument.title, 'PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS');
  assert.equal(register.sourceDocument.googleDocumentId, '1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs');
  assert.equal(register.sourceDocument.sourceReconciliationStatus, 'SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY');
  assert.equal(register.policy.strategicCompletionRequiresReconciliation, true);
  assert.equal(register.policy.futureImplementationMustDeclareRelationship, true);
  assert.equal(register.policy.supersededRequiresRationaleAndExecutiveApproval, true);
  assert.equal(register.policy.runtimeActivationAuthorized, false);
  assert.equal(register.requirements.length, 40);
  assert.ok(register.requirements.some((requirement) => requirement.implementationStatus === 'NOT_FOUND_IN_REPOSITORY'));
  assert.ok(register.requirements.some((requirement) => requirement.implementationStatus === 'PARTIALLY_IMPLEMENTED'));
  assert.ok(register.requirements.some((requirement) => requirement.implementationStatus === 'IMPLEMENTED_CERTIFIED'));
}

function assertFailureModes() {
  const register = buildReieAdjustmentTraceabilityRegister();

  const duplicate = validateReieAdjustmentTraceabilityRegister({
    ...register,
    requirements: [...register.requirements, register.requirements[0]],
  });
  assert.equal(duplicate.valid, false);
  assert.match(duplicate.issues.join('\n'), /Duplicate requirement identifier/);

  const missingOwner = validateReieAdjustmentTraceabilityRegister({
    ...register,
    requirements: register.requirements.map((requirement) =>
      requirement.identifier === 'REIE-ADJ-015'
        ? { ...requirement, owningProgram: '' }
        : requirement,
    ),
  });
  assert.equal(missingOwner.valid, false);
  assert.match(missingOwner.issues.join('\n'), /REIE-ADJ-015 is missing owning program/);

  const supersededWithoutRationale = validateReieAdjustmentTraceabilityRegister({
    ...register,
    requirements: register.requirements.map((requirement) =>
      requirement.identifier === 'REIE-ADJ-015'
        ? { ...requirement, implementationStatus: 'SUPERSEDED' as const }
        : requirement,
    ),
  });
  assert.equal(supersededWithoutRationale.valid, false);
  assert.match(supersededWithoutRationale.issues.join('\n'), /SUPERSEDED without rationale/);

  const certifiedWithoutEvidence = validateReieAdjustmentTraceabilityRegister({
    ...register,
    requirements: register.requirements.map((requirement) =>
      requirement.identifier === 'REIE-ADJ-003'
        ? { ...requirement, certificationEvidence: [] }
        : requirement,
    ),
  });
  assert.equal(certifiedWithoutEvidence.valid, false);
  assert.match(certifiedWithoutEvidence.issues.join('\n'), /certified without evidence/);
}

async function main() {
  assertRegisterCompleteness();
  assertFailureModes();
  await assertNoRuntimeActivation();
  await assertDocumentationCoverage();

  console.log(
    '[reie-adjustments-traceability] ok: source reconciliation, requirement identifiers, ownership, statuses, dispositions, unresolved visibility, certified evidence, supersession rules, and no-activation posture verified.',
  );
}

main().catch((error) => {
  console.error('[reie-adjustments-traceability] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
