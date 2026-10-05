import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { classifyAdminSurface, sanitizeAgentReturnPath } from '../lib/admin/adminAuth';

const route = readFileSync('app/api/agent/client-case-scenarios/route.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseScenarioWorkspace.tsx', 'utf8');
const index = readFileSync('components/agent/ClientCaseScenarioIndexWorkspace.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseScenarioWorkspace.module.css', 'utf8');
const commandCenter = readFileSync('components/agent/ClientCommandCenter.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');

for (const token of ['authorizeAdminRequest', 'HUMAN_AGENT_SESSION', 'isSameOriginAdminRequest', "'Cache-Control': 'private, no-store'", 'createClientCaseScenarioService']) assert.match(route, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(auth, /surface\('\/api\/agent\/client-case-scenarios'.*MUTATING_ADMIN_API.*HUMAN_AGENT_SESSION/);
assert.match(auth, /isClientCaseScenarioReturn/);
assert.match(middleware, /isAgentProtectedApiRoute[^;]+\/api\/agent\/client-case-scenarios/);
assert.match(middleware, /matcher:[^;]+\/api\/agent\/client-case-scenarios/);
for (const path of [
  '/agent/clients/case-a/scenarios',
  '/agent/clients/case-a/scenarios/scenario-a',
  '/agent/clients/case-a/scenarios/scenario-a/versions/version-a',
]) {
  assert.equal(sanitizeAgentReturnPath(path), path);
  const surface = classifyAdminSurface(path);
  assert.deepEqual(surface.acceptedIdentityTypes, ['HUMAN_AGENT']);
  assert.deepEqual(surface.requiredRoles, ['AGENT']);
  assert.deepEqual(surface.allowedMechanisms, ['HUMAN_AGENT_SESSION']);
}
for (const token of ['Financial Context', 'Include in analysis version', 'Clear all selections', 'View / Edit Financial Position', 'Review selected financial information', 'Create analysis version', 'Financial information used for this version', 'Compare with Current Financial Position', 'Create new version', 'Financial context was not captured for this earlier version.']) assert.match(workspace, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
for (const action of ['SELECT', 'DESELECT', 'REVIEW', 'CLEAR_ALL', 'REVIEW_CREATE_ANALYSIS_VERSION', 'CREATE_ANALYSIS_VERSION']) assert.match(workspace, new RegExp(action));
assert.match(workspace, /type="checkbox"/);
assert.match(workspace, /!fact\.selected && !fact\.currentObservation/);
assert.match(workspace, /fact\.selectedObservationId \|\| fact\.currentObservation\?\.id/);
assert.match(workspace, /aria-modal="true"/);
assert.match(workspace, /aria-expanded|<details/);
assert.match(workspace, /No Output, report, or calculation is generated/);
assert.doesNotMatch(workspace, /Generate (Report|PDF)|Send to Client/);
assert.match(index, /New Scenario/);
assert.match(commandCenter, /section\('scenarios'/);
assert.match(styles, /@media \(max-width: 28rem\)/);
assert.match(styles, /:focus-visible/);
assert.match(styles, /cursor: pointer/);
assert.equal((schema.match(/model ClientCaseScenarioFinancialContextDraft \{/g) || []).length, 1);
assert.equal((schema.match(/model ClientCaseScenarioFinancialContextManifest \{/g) || []).length, 1);
console.log('[client-case-scenario-c2c-workspace] ok: protected routes, actual C2B workflow, working/fixed/comparison/special states, accessibility, responsive structure, and Product boundaries are present.');
