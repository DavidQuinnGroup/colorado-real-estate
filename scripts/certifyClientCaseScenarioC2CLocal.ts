import assert from 'node:assert/strict';

import { PrismaClient } from '@prisma/client';

import {
  CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE,
  ClientCaseScenarioFinancialContextTransportError,
  createClientCaseScenarioFinancialContextTransportService,
} from '../lib/clientCaseScenarioFinancialContextTransport';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required.');
const parsedDatabaseUrl = new URL(databaseUrl);
if (!['localhost', '127.0.0.1', '::1'].includes(parsedDatabaseUrl.hostname)) {
  throw new Error('C2C local certification is restricted to a loopback PostgreSQL database.');
}

const owner = (() => {
  const value = process.env.REIE_AGENT_SUBJECT;
  if (!value) throw new Error('REIE_AGENT_SUBJECT is required.');
  return value;
})();

const prisma = new PrismaClient();
const primaryCaseId = 'c2c_local_case_populated';
const noPositionCaseId = 'c2c_local_case_no_position';

async function scenarioId(clientCaseId: string, name: string) {
  const scenario = await prisma.clientCaseScenario.findFirst({
    where: { clientCaseId, name, clientCase: { ownerAgentSubject: owner } },
    select: { id: true, currentVersionId: true },
  });
  assert(scenario, `Missing local C2C fixture Scenario: ${name}`);
  assert(scenario.currentVersionId, `Missing current version for local C2C fixture Scenario: ${name}`);
  return { id: scenario.id, currentVersionId: scenario.currentVersionId };
}

async function main() {
  const transport = createClientCaseScenarioFinancialContextTransportService(prisma);
  const populated = await scenarioId(primaryCaseId, 'Boulder move with liquidity reserve');
  const empty = await scenarioId(primaryCaseId, 'Empty-selection review');
  const legacy = await scenarioId(primaryCaseId, 'Earlier planning baseline');
  const noPosition = await scenarioId(noPositionCaseId, 'Initial affordability conversation');

  let working = await transport.readWorkingContext(owner, primaryCaseId, populated.id);
  assert.equal(working.lifecycle, CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE);
  assert.equal(working.state, 'WORKING_CONTEXT');
  assert.equal(working.draft?.selectionCount, 3);
  assert.equal(working.reviewRequiredCount, 2);

  const unavailableSelection = working.facts.find((fact) => fact.selected && !fact.currentObservation);
  assert(unavailableSelection?.selectedObservationId && working.draft, 'Missing selected no-longer-current C2C fixture fact.');
  const storedUnavailableSelection = await prisma.clientCaseScenarioFinancialContextDraftSelection.findFirst({
    where: { draftId: working.draft.id, clientCaseId: primaryCaseId, domain: unavailableSelection.domain },
  });
  assert(storedUnavailableSelection, 'Missing persisted no-longer-current draft selection.');
  const afterUnavailableDeselect = await transport.mutateDraft(owner, primaryCaseId, populated.id, 'DESELECT', {
    expectedRevision: working.draft.revision,
    selection: { domain: unavailableSelection.domain, entityId: unavailableSelection.entityId, observationId: unavailableSelection.selectedObservationId },
  });
  assert.equal(afterUnavailableDeselect.draft?.selectionCount, 2);
  assert.equal(afterUnavailableDeselect.facts.some((fact) => fact.entityId === unavailableSelection.entityId && fact.selected), false);
  await prisma.clientCaseScenarioFinancialContextDraftSelection.create({ data: storedUnavailableSelection });
  working = await transport.readWorkingContext(owner, primaryCaseId, populated.id);
  assert.equal(working.draft?.selectionCount, 3);
  assert.equal(working.reviewRequiredCount, 2);

  const fixedVersion = await prisma.clientCaseScenarioVersion.findFirst({
    where: { scenarioId: populated.id, financialContextManifest: { isNot: null } },
    orderBy: { versionNumber: 'desc' },
    select: { id: true },
  });
  assert(fixedVersion, 'Missing frozen C2C Scenario Version.');
  const fixed = await transport.readFixedContext(owner, primaryCaseId, populated.id, fixedVersion.id);
  assert.equal(fixed.state, 'CAPTURED');
  assert.equal(fixed.entries.length, 3);

  const comparison = await transport.compareToCurrent(owner, primaryCaseId, populated.id, fixedVersion.id);
  assert.equal(comparison.state, 'COMPARISON_AVAILABLE');
  const classifications = new Set(comparison.differences.map((difference) => difference.classification));
  for (const expected of ['LATER_CORRECTION', 'NO_LONGER_CURRENT', 'CURRENT_FACT_NOT_PART_OF_VERSION']) {
    assert(classifications.has(expected as never), `Missing expected comparison classification: ${expected}`);
  }

  let emptyWorking = await transport.readWorkingContext(owner, primaryCaseId, empty.id);
  assert.equal(emptyWorking.state, 'EMPTY_SELECTION');
  const liability = emptyWorking.facts.find((fact) => fact.domain === 'LIABILITY');
  const qualification = emptyWorking.facts.find((fact) => fact.domain === 'BORROWING_QUALIFICATION');
  assert(liability?.currentObservation && qualification?.currentObservation, 'Missing mutable C2C certification facts.');

  emptyWorking = await transport.mutateDraft(owner, primaryCaseId, empty.id, 'SELECT', {
    expectedRevision: emptyWorking.draft?.revision ?? null,
    selection: { domain: liability.domain, entityId: liability.entityId, observationId: liability.currentObservation.id },
  });
  assert.equal(emptyWorking.draft?.selectionCount, 1);
  emptyWorking = await transport.mutateDraft(owner, primaryCaseId, empty.id, 'DESELECT', {
    expectedRevision: emptyWorking.draft?.revision,
    selection: { domain: liability.domain, entityId: liability.entityId, observationId: liability.currentObservation.id },
  });
  assert.equal(emptyWorking.draft?.selectionCount, 0);
  emptyWorking = await transport.mutateDraft(owner, primaryCaseId, empty.id, 'SELECT', {
    expectedRevision: emptyWorking.draft?.revision,
    selection: { domain: qualification.domain, entityId: qualification.entityId, observationId: qualification.currentObservation.id },
  });
  emptyWorking = await transport.mutateDraft(owner, primaryCaseId, empty.id, 'REVIEW', {
    expectedRevision: emptyWorking.draft?.revision,
    selection: { domain: qualification.domain, entityId: qualification.entityId, observationId: qualification.currentObservation.id },
  });
  assert.equal(emptyWorking.reviewRequiredCount, 0);
  const staleRevision = emptyWorking.draft?.revision;
  emptyWorking = await transport.mutateDraft(owner, primaryCaseId, empty.id, 'CLEAR_ALL', { expectedRevision: staleRevision });
  assert.equal(emptyWorking.state, 'EMPTY_SELECTION');
  assert.equal(emptyWorking.draft?.selectionCount, 0);

  await assert.rejects(
    transport.mutateDraft(owner, primaryCaseId, empty.id, 'CLEAR_ALL', { expectedRevision: staleRevision }),
    (error: unknown) => error instanceof ClientCaseScenarioFinancialContextTransportError && error.code === 'CONFLICT',
  );
  await assert.rejects(
    transport.readWorkingContext('unauthorized-c2c-owner', primaryCaseId, populated.id),
    (error: unknown) => error instanceof Error && 'code' in error && error.code === 'NOT_FOUND',
  );

  const noFinancialPosition = await transport.readWorkingContext(owner, noPositionCaseId, noPosition.id);
  assert.equal(noFinancialPosition.state, 'NO_FINANCIAL_POSITION');
  const legacyFixed = await transport.readFixedContext(owner, primaryCaseId, legacy.id, legacy.currentVersionId);
  assert.equal(legacyFixed.state, 'LEGACY_NO_FINANCIAL_CONTEXT');

  console.log('[client-case-scenario-c2c-local] ok: local persisted working/fixed/comparison/empty/no-position/legacy states, select/deselect/review/clear, stale-write rejection, owner isolation, and retained post-Freeze intent are certified.');
}

main().finally(() => prisma.$disconnect());
