import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION,
  caoQueueReadinessStates,
  caoQueueServiceLevelTargets,
  getCaoQueueReadinessSummary,
  getCaoQueueReadinessView,
  validateCaoOperationsQueueReadinessContract,
  type CaoQueueReadinessInput,
} from '../lib/cao/index.js';

const FORBIDDEN_CONTRACT_PATTERNS = [
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

const FORBIDDEN_RUNTIME_MUTATION_PATTERNS = [
  /automate assignment/i,
  /automate routing/i,
  /automate prioritization/i,
  /automate lifecycle/i,
  /sendEmail\s*\(/,
  /sendPropertyInquiryNotification\s*\(/,
  /processAlertQueue\s*\(/,
  /createTask\s*\(/,
  /createSellerLead\s*\(/,
];

function assertValidContract() {
  assert.equal(CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION, 'CAO-1.0-SPRINT-2');

  const validation = validateCaoOperationsQueueReadinessContract();
  assert.equal(validation.valid, true, validation.issues.join('; '));

  for (const state of ['UNASSIGNED', 'ASSIGNED', 'WAITING', 'OVERDUE', 'COMPLETED', 'DISMISSED']) {
    assert.ok(caoQueueReadinessStates.includes(state as never), `Expected queue state ${state}.`);
  }

  assert.ok(caoQueueServiceLevelTargets.some((target) => target.taskType === 'property_inquiry' && target.targetHours === 12));
  assert.ok(caoQueueServiceLevelTargets.some((target) => target.taskType === 'strategy_intake' && target.targetHours === 24));
}

function assertReadinessViews() {
  const now = Date.now();
  const task = (overrides: Partial<CaoQueueReadinessInput>): CaoQueueReadinessInput => ({
    id: 'task-1',
    status: 'pending',
    priority: 'high',
    type: 'property_inquiry',
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    ...overrides,
  });

  const unassigned = getCaoQueueReadinessView(task({}));
  assert.equal(unassigned.queueState, 'UNASSIGNED');
  assert.equal(unassigned.crmLifecycleState, 'OPEN');
  assert.equal(unassigned.automationAuthorized, false);
  assert.equal(unassigned.telemetryAuthorized, false);
  assert.equal(unassigned.ownership.responsibleRole, 'OPERATIONS_LEAD');
  assert.equal(unassigned.ownership.escalationOwner, 'BROKER_REVIEW');

  const assigned = getCaoQueueReadinessView(task({ status: 'reviewing' }));
  assert.equal(assigned.queueState, 'ASSIGNED');
  assert.equal(assigned.crmLifecycleState, 'IN_PROGRESS');

  const waiting = getCaoQueueReadinessView(task({ status: 'waiting' }));
  assert.equal(waiting.queueState, 'WAITING');
  assert.equal(waiting.crmLifecycleState, 'WAITING');

  const overdue = getCaoQueueReadinessView(
    task({
      status: 'pending',
      createdAt: new Date(now - 14 * 60 * 60 * 1000).toISOString(),
    }),
  );
  assert.equal(overdue.queueState, 'OVERDUE');
  assert.equal(overdue.serviceLevel.visibility, 'OVERDUE');
  assert.equal(overdue.review.operationalReadiness, 'WATCH');

  const completedMissingReview = getCaoQueueReadinessView(task({ status: 'completed', hasReviewNote: false }));
  assert.equal(completedMissingReview.queueState, 'COMPLETED');
  assert.equal(completedMissingReview.review.closureReviewRequired, true);
  assert.equal(completedMissingReview.review.operationalReadiness, 'BLOCKED');

  const dismissedReady = getCaoQueueReadinessView(task({ status: 'dismissed', hasReviewNote: true }));
  assert.equal(dismissedReady.queueState, 'DISMISSED');
  assert.equal(dismissedReady.review.reviewComplete, true);
}

function assertSummary() {
  const now = Date.now();
  const summary = getCaoQueueReadinessSummary([
    {
      id: 'task-1',
      status: 'pending',
      type: 'property_inquiry',
      createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-2',
      status: 'reviewing',
      type: 'strategy_intake',
      createdAt: new Date(now - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-3',
      status: 'completed',
      type: 'property_inquiry',
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      hasReviewNote: false,
    },
  ]);

  assert.equal(summary.total, 3);
  assert.equal(summary.unassigned, 1);
  assert.equal(summary.assigned, 1);
  assert.equal(summary.completed, 1);
  assert.equal(summary.reviewIncomplete, 3);
  assert.equal(summary.operationalReadiness, 'BLOCKED');
}

function assertInvalidContractsFail() {
  assert.match(
    validateCaoOperationsQueueReadinessContract({
      queueStateDefinitions: [],
    }).issues.join('; '),
    /Missing queue readiness state UNASSIGNED/,
  );

  assert.match(
    validateCaoOperationsQueueReadinessContract({
      serviceLevelTargets: [{ taskType: 'property_inquiry', targetHours: 0, approachingAfterPercent: 75, serviceLevel: 'FIRST_RESPONSE' }],
    }).issues.join('; '),
    /Invalid service-level target hours/,
  );
}

async function assertNoRuntimePrimitives() {
  const contractSource = await readFile('lib/cao/operationsQueueReadinessContract.ts', 'utf8');
  const listRouteSource = await readFile('app/api/admin/crm-tasks/route.ts', 'utf8');
  const detailRouteSource = await readFile('app/api/admin/crm-tasks/[id]/route.ts', 'utf8');

  for (const pattern of FORBIDDEN_CONTRACT_PATTERNS) {
    assert.equal(pattern.test(contractSource), false, `CAO Sprint 2 contract must not include runtime primitive: ${pattern}`);
  }

  for (const pattern of FORBIDDEN_RUNTIME_MUTATION_PATTERNS) {
    assert.equal(pattern.test(listRouteSource), false, `CAO Sprint 2 list readiness must not introduce automation primitive: ${pattern}`);
    assert.equal(pattern.test(detailRouteSource), false, `CAO Sprint 2 detail readiness must not introduce automation primitive: ${pattern}`);
  }
}

async function main() {
  assertValidContract();
  assertReadinessViews();
  assertSummary();
  assertInvalidContractsFail();
  await assertNoRuntimePrimitives();

  console.log(
    '[cao-operations-queue-review-readiness] ok: queue states, ownership, SLA visibility, review readiness, fail-closed validation, and no-automation boundary verified.',
  );
}

main().catch((error) => {
  console.error('[cao-operations-queue-review-readiness] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
