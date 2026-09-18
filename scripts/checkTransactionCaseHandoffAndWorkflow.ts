import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { TransactionCaseHandoffError, TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_VERSION, createTransactionCaseHandoffService, isAllowedTransactionStageTransition, isAllowedTransactionStatusTransition } from '../lib/transactionCaseHandoff';
import { formatCount, formatTransactionSectionSummary, formatTransactionSummary } from '../components/agent/clientCommandCenterTypes';
import { humanizeTransactionValue } from '../lib/transactionPresentation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260911000000_add_transaction_case_handoff_and_workflow_v1/migration.sql', 'utf8');
const service = readFileSync('lib/transactionCaseHandoff.ts', 'utf8');
const route = readFileSync('app/api/agent/transactions/route.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const navigation = readFileSync('lib/agentWorkspaceNavigation.ts', 'utf8');
const clientCases = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const workspace = readFileSync('components/agent/TransactionWorkspace.tsx', 'utf8');
const detail = readFileSync('components/agent/TransactionDetailWorkspace.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_VERSION, 'TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_V1');
assert.equal(humanizeTransactionValue('PREPARATION'), 'Preparation');
assert.equal(humanizeTransactionValue('SELLER'), 'Seller listing');
assert.equal(isAllowedTransactionStatusTransition('DRAFT', 'ACTIVE'), true);
assert.equal(isAllowedTransactionStatusTransition('DRAFT', 'CLOSED'), false);
assert.equal(isAllowedTransactionStatusTransition('CLOSED', 'ACTIVE'), false);
assert.equal(isAllowedTransactionStageTransition('PREPARATION', 'UNDER_CONTRACT'), true);
assert.equal(isAllowedTransactionStageTransition('UNDER_CONTRACT', 'PREPARATION'), false);
assert.equal(isAllowedTransactionStageTransition('PRE_CLOSING', 'CLOSED'), false);
for (const item of ['TransactionLifecycleStatus', 'TransactionPartyRole', 'TransactionParty']) assert.match(schema, new RegExp(`${item}`));
assert.match(schema, /canonicalPropertyId\s+String\?/);
assert.match(schema, /status\s+TransactionLifecycleStatus/);
assert.match(schema, /stage\s+TransactionOperationalStage/);
assert.match(schema, /PREPARATION/);
assert.match(schema, /SELLER/);
assert.match(schema, /@@unique\(\[transactionId, clientCasePartyId\]\)/);
assert.match(migration, /ADD COLUMN "status"/);
assert.match(migration, /ALTER COLUMN "canonicalPropertyId" DROP NOT NULL/);
assert.match(migration, /CREATE TABLE "TransactionParty"/);
assert.doesNotMatch(migration, /^\s*DROP\s+(?:TABLE|TYPE|COLUMN)\b|^\s*TRUNCATE\b|^\s*DELETE\s+FROM\b|^\s*UPDATE\s+"Transaction"\b|^\s*INSERT\s+INTO\b/im);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /clientCaseId/);
assert.match(middleware, /pathname === "\/api\/agent\/transactions"/);
assert.match(auth, /surface\('\/agent\/transactions'/);
assert.match(auth, /surface\('\/api\/agent\/transactions'/);
assert.match(navigation, /href: '\/agent\/transactions'/);
assert.match(clientCases, /\/agent\/transactions/);
assert.match(workspace, /data-testid="transactions-workspace"/);
assert.match(detail, /data-testid="transaction-detail-workspace"/);
assert.doesNotMatch(service, /delete\(/);
assert.doesNotMatch(service, /createOutput|sendEmail|sendSms|calendar/i);
assert.match(service, /summaryForClientCase/);
assert.match(service, /groupBy\(\{ by: \['status'\]/);
assert.equal(packageJson.scripts?.['check:transaction-case-handoff-and-workflow'], 'jiti scripts/checkTransactionCaseHandoffAndWorkflow.ts');

const calls: Array<{ operation: string; where?: Record<string, unknown> }> = [];
const ownedCase = { id: 'case-owned', ownerAgentSubject: 'AGENT_A', status: 'ACTIVE', displayName: 'ATLAS Synthetic Client Case' };
const serviceForSecurity = createTransactionCaseHandoffService({
  clientCase: { findFirst: async (query: { where: Record<string, unknown> }) => query.where.id === 'case-owned' && query.where.ownerAgentSubject === 'AGENT_A' ? ownedCase : null },
  transaction: { findMany: async (query: { where: Record<string, unknown> }) => { calls.push({ operation: 'list', where: query.where }); return []; }, findFirst: async () => null, findUnique: async () => null },
} as never);

const summaryCalls: Array<Record<string, unknown>> = [];
const summaryService = createTransactionCaseHandoffService({
  clientCase: { findFirst: async (query: { where: Record<string, unknown> }) => ['case-owned', 'case-empty'].includes(query.where.id as string) && query.where.ownerAgentSubject === 'AGENT_A' ? { ...ownedCase, id: query.where.id as string } : null },
  transaction: {
    groupBy: async (query: Record<string, unknown>) => {
      summaryCalls.push(query);
      return (query.where as { clientCaseId?: string }).clientCaseId === 'case-empty'
        ? []
        : [{ status: 'DRAFT', _count: { _all: 1 } }, { status: 'ACTIVE', _count: { _all: 2 } }];
    },
    findMany: async (query: Record<string, unknown>) => {
      summaryCalls.push(query);
      return (query.where as { clientCaseId?: string }).clientCaseId === 'case-empty'
        ? []
        : [
      { id: 'draft-1', label: 'Draft transaction', side: 'BUYER', status: 'DRAFT', stage: 'PREPARATION', updatedAt: new Date('2026-09-18T00:00:00Z') },
      { id: 'active-1', label: 'Active transaction', side: 'SELLER', status: 'ACTIVE', stage: 'UNDER_CONTRACT', updatedAt: new Date('2026-09-17T00:00:00Z') },
        ];
    },
  },
} as never);

void (async () => {
  await serviceForSecurity.listOwned('AGENT_A');
  assert.deepEqual(calls[0], { operation: 'list', where: { ownerAgentSubject: 'AGENT_A' } });
  await assert.rejects(() => serviceForSecurity.listOwned('AGENT_A', 'case-foreign'), (error: unknown) => error instanceof TransactionCaseHandoffError && error.code === 'OWNERSHIP_DENIED');
  const summary = await summaryService.summaryForClientCase('AGENT_A', 'case-owned');
  assert.deepEqual(summary, {
    totalTransactionCount: 3,
    draftTransactionCount: 1,
    activeTransactionCount: 2,
    recentTransactions: [
      { id: 'draft-1', label: 'Draft transaction', side: 'BUYER', status: 'DRAFT', stage: 'PREPARATION', updatedAt: new Date('2026-09-18T00:00:00Z') },
      { id: 'active-1', label: 'Active transaction', side: 'SELLER', status: 'ACTIVE', stage: 'UNDER_CONTRACT', updatedAt: new Date('2026-09-17T00:00:00Z') },
    ],
  });
  assert.deepEqual(summaryCalls.map((query) => query.where), [
    { ownerAgentSubject: 'AGENT_A', clientCaseId: 'case-owned' },
    { ownerAgentSubject: 'AGENT_A', clientCaseId: 'case-owned' },
  ]);
  const emptySummary = await summaryService.summaryForClientCase('AGENT_A', 'case-empty');
  assert.deepEqual(emptySummary, { totalTransactionCount: 0, draftTransactionCount: 0, activeTransactionCount: 0, recentTransactions: [] });
  await assert.rejects(() => summaryService.summaryForClientCase('AGENT_A', 'case-foreign'), (error: unknown) => error instanceof TransactionCaseHandoffError && error.code === 'OWNERSHIP_DENIED');
  assert.equal(formatTransactionSummary({ totalTransactionCount: 0, draftTransactionCount: 0, activeTransactionCount: 0 }), 'None recorded');
  assert.equal(formatTransactionSummary({ totalTransactionCount: 1, draftTransactionCount: 1, activeTransactionCount: 0 }), '1 draft transaction');
  assert.equal(formatTransactionSummary({ totalTransactionCount: 1, draftTransactionCount: 0, activeTransactionCount: 1 }), '1 transaction');
  assert.equal(formatTransactionSummary({ totalTransactionCount: 2, draftTransactionCount: 2, activeTransactionCount: 0 }), '2 draft transactions');
  assert.equal(formatTransactionSummary({ totalTransactionCount: 2, draftTransactionCount: 1, activeTransactionCount: 1 }), '2 transactions');
  assert.equal(formatTransactionSectionSummary({ totalTransactionCount: 1, draftTransactionCount: 1, activeTransactionCount: 0 }), '1 draft transaction.');
  assert.equal(formatCount(0, 'person', 'people'), '0 people');
  assert.equal(formatCount(1, 'person', 'people'), '1 person');
  assert.equal(formatCount(2, 'property', 'properties'), '2 properties');
  assert.equal(formatCount(1, 'transaction', 'transactions'), '1 transaction');
  console.log('TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
