import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseContextSummaryError, createClientCaseContextSummaryService } from '../lib/clientCaseContextSummary';

const source = (path: string) => readFileSync(path, 'utf8');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
const strip = source('components/agent/ClientCaseContextStrip.tsx');
const summary = source('lib/clientCaseContextSummary.ts');
const route = source('app/api/agent/client-case-context/route.ts');
const shell = source('components/agent/AgentWorkspaceShell.tsx');
const navigation = source('lib/agentWorkspaceNavigation.ts');
const intelligence = source('components/agent/IntelligenceWorkspace.tsx');
const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');
const schema = source('prisma/schema.prisma');
const fixture = source('components/agent/ClientContextVisualFixture.tsx');
const fixturePage = source('app/agent/design-system/visual-certification/client-context/page.tsx');

assert.equal(packageJson.scripts?.['check:cross-workspace-client-context'], 'jiti scripts/checkCrossWorkspaceClientContext.ts');
assert.match(strip, /api\/agent\/client-case-context\?clientCaseId=/);
assert.match(strip, /data-client-case-context-state="loading"/);
assert.match(strip, /data-client-case-context-state="unavailable"/);
assert.match(strip, /data-client-case-context-state="ready"/);
assert.match(strip, /Loading Client Case context\./);
assert.match(strip, /Client Case context is unavailable\./);
assert.match(strip, /Back to Client/);
assert.doesNotMatch(strip, /api\/agent\/client-cases\?id=/);
assert.match(shell, /clientCaseId && !pathname\.startsWith\('\/agent\/clients'\)/);
assert.match(navigation, /clientCaseId/);
assert.match(intelligence, /function scopedHref/);
assert.match(intelligence, /clientCaseId=\$\{encodeURIComponent\(clientCaseId\)\}/);
assert.match(summary, /where: \{ id, ownerAgentSubject \}/);
assert.match(summary, /_count: \{ select: \{ parties: true \} \}/);
assert.doesNotMatch(summary, /properties:|transactions:|create\(|update\(|delete\(/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /Cache-Control': 'private, no-store/);
assert.doesNotMatch(route, /POST|\.create\(|\.update\(|\.delete\(|\$transaction/);
assert.match(auth, /surface\('\/api\/agent\/client-case-context', 'READ_ONLY_ADMIN_API'/);
assert.match(middleware, /pathname === "\/api\/agent\/client-case-context"/);
assert.match(middleware, /"\/api\/agent\/client-case-context"/);
assert.doesNotMatch(schema, /ClientCaseContextSummary/);
assert.match(fixture, /data-testid="client-context-visual-fixture"/);
assert.match(fixture, /Jordan Avery/);
assert.doesNotMatch(fixture, /fetch\(|prisma|\/api\//i);
assert.match(fixturePage, /ClientContextVisualFixture/);
assert.match(auth, /\/agent\/design-system\/visual-certification\/client-context/);

const calls: Array<{ where: unknown; select: unknown }> = [];
const service = createClientCaseContextSummaryService({
  clientCase: {
    findFirst: async (query: { where: { id: string; ownerAgentSubject: string }; select: unknown }) => {
      calls.push(query);
      return query.where.id === 'case-owned' && query.where.ownerAgentSubject === 'agent-a'
        ? { id: 'case-owned', displayName: 'ATLAS Synthetic Client Case', status: 'ACTIVE', _count: { parties: 1 } }
        : null;
    },
  },
} as never);

void (async () => {
  const clientCase = await service.load('agent-a', 'case-owned');
  assert.deepEqual(clientCase, { clientCaseId: 'case-owned', displayName: 'ATLAS Synthetic Client Case', status: 'ACTIVE', participantCount: 1 });
  assert.deepEqual(calls[0]?.where, { id: 'case-owned', ownerAgentSubject: 'agent-a' });
  assert.deepEqual(calls[0]?.select, { id: true, displayName: true, status: true, _count: { select: { parties: true } } });
  await assert.rejects(() => service.load('agent-a', 'case-foreign'), (error: unknown) => error instanceof ClientCaseContextSummaryError && error.code === 'NOT_FOUND');
  await assert.rejects(() => service.load('agent-a', '<invalid>'), (error: unknown) => error instanceof ClientCaseContextSummaryError && error.code === 'INVALID_REQUEST');
  console.log('cross-workspace-client-context: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
