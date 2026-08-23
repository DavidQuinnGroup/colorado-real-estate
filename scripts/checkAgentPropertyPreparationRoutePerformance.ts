import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const page = source('app/agent/prepare/property/page.tsx');
const experience = source('components/agent/PropertyConversationExperience.tsx');
const repository = source('lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository.ts');
const propertyApi = source('app/api/agent/prepare/property/route.ts');
const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');

assert.ok(!page.includes('getAgentPropertyConversationCandidate'), 'Property page first render must not block on selector or detail data.');
assert.ok(!page.includes('async function'), 'Property page server work must remain limited to the protected shell render.');
assert.ok(experience.includes('fetch(`/api/agent/prepare/property?q=${encodeURIComponent(searchQuery)}`'), 'The selector must query only after explicit Agent input.');
assert.ok(experience.includes("useState<CandidateSearchState>('NO_SEARCH_YET')") && !experience.includes('useEffect(() =>'), 'The selector must not load candidates on the first protected page render.');
assert.ok(experience.includes("fetch(`/api/agent/prepare/property?property=${encodeURIComponent(selectedCandidate.property.slug)}`"), 'Selected-property detail must be deferred until the explicit prepare action.');
assert.ok(repository.includes('CANDIDATE_SUMMARY_COLUMNS') && repository.includes("'slug', 'address', 'city', 'state', 'zip', 'status', 'price', 'propertyType', 'neighborhood'") && repository.includes('AGENT_PROPERTY_SEARCH_RESULT_LIMIT = 8'), 'The on-demand selector must use the compact, bounded summary projection.');
assert.ok(repository.includes('getAgentPropertyConversationCandidate(slug') && repository.includes('where: {\n        slug,'), 'Selected briefing data must use an exact canonical slug read.');
assert.ok(propertyApi.includes("authorizeAdminRequest(request, { pathname: AGENT_PROPERTY_API_PATH, method: 'GET' })"), 'The deferred read endpoint must enforce its exact Agent authorization surface.');
assert.ok(propertyApi.includes("'Cache-Control': 'private, no-store'") && propertyApi.includes('export const revalidate = 0'), 'The deferred response must remain private and uncached.');
assert.ok(auth.includes("surface('/api/agent/prepare/property', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'The deferred read must not broaden Agent access.');
assert.ok(!auth.includes("surface('/api/agent/:path*'"), 'The deferred read must not create generic Agent API authorization.');
assert.ok(middleware.includes('pathname === "/agent/prepare/property"') && middleware.includes('buildAgentLoginRedirect'), 'The protected page must retain the established Agent sign-in return behavior.');
assert.ok(!experience.match(/localStorage|sessionStorage|sendBeacon|CRM|ATTOM|LightBox|providerRuntime|customerData/i), 'The performance path must not add persistence, customer, provider, or CRM activity.');

console.log('AGENT_PROPERTY_PREPARATION_ROUTE_PERFORMANCE_CHECK: PASS');
