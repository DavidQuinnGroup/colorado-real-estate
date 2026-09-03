import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseError, createClientCaseContextService } from '../lib/clientCaseContextFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260905000000_add_canonical_client_case_context_foundation_v1/migration.sql', 'utf8');
const service = readFileSync('lib/clientCaseContextFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/client-cases/route.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const model of ['ClientCase', 'ClientCaseParty', 'ClientCaseProperty']) assert.match(schema, new RegExp(`model ${model} \\{`));
for (const value of ['ACTIVE', 'ARCHIVED', 'PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'CURRENT_HOME', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_PROPERTY']) assert.match(schema, new RegExp(`\\b${value}\\b`));
assert.match(schema, /clientCaseId\s+String\?/);
assert.match(schema, /clientCase\s+ClientCase\?\s+@relation\(fields: \[clientCaseId\], references: \[id\], onDelete: SetNull\)/);
assert.match(schema, /canonicalProperty\s+CanonicalPhysicalProperty/);
assert.match(schema, /@@unique\(\[clientCaseId, canonicalPropertyId\]\)/);
assert.match(migration, /CREATE TABLE "ClientCase"/);
assert.match(migration, /ALTER TABLE "Transaction" ADD COLUMN "clientCaseId" TEXT/);
assert.match(migration, /ON DELETE SET NULL/);
assert.doesNotMatch(migration, /\b(DROP|TRUNCATE|DELETE\s+FROM|UPDATE\s+"Transaction")\b/i);
assert.doesNotMatch(migration, /\bINSERT\s+INTO\b/i);

assert.match(service, /where: \{ id, ownerAgentSubject \}/);
assert.match(service, /where: \{ ownerAgentSubject, status:/);
assert.match(service, /status: 'ARCHIVED', archivedAt: new Date\(\)/);
assert.match(service, /status: 'ACTIVE', archivedAt: null/);
assert.match(service, /where: \{ id: transactionId, ownerAgentSubject \}/);
assert.match(service, /clientCaseId: id/);
assert.doesNotMatch(service, /delete\(/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /if \(id\) return NextResponse\.json\(\{ clientCase: await service\.detail\(subject, id\)/);
assert.match(middleware, /pathname === "\/agent\/clients" \|\| pathname\.startsWith\('\/agent\/clients\/'\)/);
assert.match(middleware, /pathname === "\/api\/agent\/client-cases"/);
assert.match(auth, /surface\('\/agent\/clients'/);
assert.match(auth, /surface\('\/api\/agent\/client-cases'/);
assert.match(workspace, /data-testid="client-cases-workspace"/);
assert.match(workspace, /data-testid="client-case-detail"/);
assert.match(workspace, /No linked Transactions yet/);
assert.match(workspace, /clientCaseId\?: string/);
assert.doesNotMatch(workspace, /activeClientCaseId/);
assert.equal(packageJson.scripts?.['check:canonical-client-case-context-foundation'], 'jiti scripts/checkCanonicalClientCaseContextFoundation.ts');

const calls: Array<{ operation: string; where?: Record<string, unknown> }> = [];
const owned = { id: 'case-owned', ownerAgentSubject: 'AGENT_A', status: 'ACTIVE', displayName: 'ATLAS Synthetic Client Case' };
const foundationService = createClientCaseContextService({
  clientCase: {
    findMany: async (query: { where: Record<string, unknown> }) => { calls.push({ operation: 'list', where: query.where }); return []; },
    findFirst: async (query: { where: { id: string; ownerAgentSubject: string } }) => query.where.id === 'case-owned' && query.where.ownerAgentSubject === 'AGENT_A' ? owned : null,
    findUnique: async () => null,
    create: async () => owned,
    update: async () => owned,
  },
  clientCaseParty: { create: async () => ({}) },
  clientCaseProperty: { create: async () => ({}), findFirst: async () => null, update: async () => ({}) },
  canonicalPhysicalProperty: { findUnique: async () => ({ id: 'property-owned' }) },
  transaction: { findFirst: async () => null, update: async () => ({}) },
} as never);

void (async () => {
  await foundationService.listOwned('AGENT_A');
  assert.deepEqual(calls[0], { operation: 'list', where: { ownerAgentSubject: 'AGENT_A', status: 'ACTIVE' } });
  await assert.rejects(() => foundationService.detail('AGENT_A', 'case-foreign'), (error: unknown) => error instanceof ClientCaseError && error.code === 'NOT_FOUND');
  await assert.rejects(() => foundationService.attachTransaction('AGENT_A', 'case-owned', 'transaction-foreign'), (error: unknown) => error instanceof ClientCaseError && error.code === 'OWNERSHIP_DENIED');
  await foundationService.archive('AGENT_A', 'case-owned');
  await foundationService.reactivate('AGENT_A', 'case-owned');
  console.log('CANONICAL_CLIENT_CASE_CONTEXT_FOUNDATION_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
