import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const route = readFileSync('app/api/agent/client-case-scenario-financial-context/route.ts', 'utf8');
const service = readFileSync('lib/clientCaseScenarioFinancialContextTransport.ts', 'utf8');
const adminAuth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const path = '/api/agent/client-case-scenario-financial-context';

for (const token of [
  "identityType === 'HUMAN_AGENT'",
  "role === 'AGENT'",
  "mechanism === 'HUMAN_AGENT_SESSION'",
  'authorization.canMutate',
  'isSameOriginAdminRequest(request)',
  "'Cache-Control': 'private, no-store'",
  "Vary: 'Cookie'",
  "runtime = 'nodejs'",
]) assert.ok(route.includes(token), `missing route security contract: ${token}`);

assert.ok(adminAuth.includes(`surface('${path}', 'MUTATING_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true)`));
assert.ok(middleware.includes(`pathname === "${path}"`));
assert.ok(middleware.includes(`"${path}"`));

for (const token of [
  'clientCase: { ownerAgentSubject }',
  'id: scenarioId, clientCaseId',
  'id: scenarioVersionId, scenarioId',
  'ownerAgentSubject',
  'clientCaseId',
  'scenarioId',
  'scenarioVersionId',
]) assert.ok(service.includes(token), `missing owner/Case/Scenario/Version boundary: ${token}`);

for (const forbidden of ['app/client', 'components/', 'public/', 'fetch(', 'Output', 'PDF']) assert.equal(service.includes(forbidden), false, `C2B transport must not widen to ${forbidden}`);

assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-transport-security'], 'jiti scripts/checkClientCaseScenarioFinancialContextTransportSecurity.ts');
console.log('[client-case-scenario-financial-context-transport-security] ok: Human Agent auth, same-origin mutation, owner/Case/Scenario/Version scoping, private caching, and no public/consumer surface are fail-closed.');
