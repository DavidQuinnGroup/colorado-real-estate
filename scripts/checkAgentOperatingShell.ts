import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[agent-operating-shell] ${message}`);
}

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const rootLayout = source('app/layout.tsx');
const applicationShell = source('components/ApplicationShell.tsx');
const agentLayout = source('app/agent/layout.tsx');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
const agentNavigation = source('components/agent/AgentWorkspaceNavigation.tsx');
const agentNavigationRegistry = source('lib/agentWorkspaceNavigation.ts');
const agentShellContracts = `${agentShell}\n${agentNavigation}\n${agentNavigationRegistry}`;
const marketLayout = source('app/agent/prepare/market/layout.tsx');
const marketPage = source('app/agent/prepare/market/page.tsx');
const marketExperience = source('components/agent/MarketConversationExperience.tsx');
const auth = source('lib/admin/adminAuth.ts');
const middleware = source('middleware.ts');

assert(rootLayout.includes('<ApplicationShell>{children}</ApplicationShell>'), 'root layout must delegate chrome ownership to ApplicationShell');
assert(applicationShell.includes("pathname?.startsWith('/agent')") && applicationShell.includes("pathname?.startsWith('/admin')"), 'private route trees must bypass public chrome');
assert(applicationShell.includes('<BrokerageAttribution />') && applicationShell.includes('<PublicNavigation />') && applicationShell.includes('<PlatformFooter />'), 'public chrome must remain owned by the public shell');
assert(agentLayout.includes('<AgentWorkspaceShell>{children}</AgentWorkspaceShell>'), 'agent route tree must use the dedicated Agent shell');
assert(!marketLayout.includes('fixed inset-0 z-50'), 'market layout must not create an overlapping fixed viewport');
assert(!agentShell.includes('sticky top-0'), 'Agent navigation must not cover briefing content while scrolling');
assert(agentShellContracts.includes('Project Atlas') && agentShellContracts.includes('Agent Workspace'), 'Agent product identity is required');
assert(agentShellContracts.includes('href="/agent"') && agentShellContracts.includes('agent-workspace-home-link'), 'Agent workspace navigation must return to the canonical home route.');
assert(agentShellContracts.includes('href="/"') && agentShellContracts.includes('agent-workspace-public-site-link'), 'Agent workspace navigation must expose the canonical Public Site return route.');
assert(agentShellContracts.includes("href: '/agent/prepare/buyer'"), 'Buyer Preparation must be an exact Agent navigation destination.');
assert(agentShellContracts.includes("href: '/agent/prepare/seller'"), 'Seller Preparation must be an exact Agent navigation destination.');
assert(agentNavigationRegistry.includes("startsWith('/agent/prepare/listing')"), 'Listing Preparation must remain represented by the Seller navigation family.');
assert(agentNavigationRegistry.includes("'/agent/prepare/property'"), 'Property Preparation must remain represented by the Intelligence navigation family.');
assert(agentShellContracts.includes("href: '/agent/prepare/market'"), 'Market Preparation must remain an exact Agent navigation destination.');
assert(agentNavigationRegistry.includes("'/agent/prepare/market-update'"), 'Market Update Preparation must remain represented by the Intelligence navigation family.');
assert(agentShellContracts.includes('href="/agent/logout?next=/agent"'), 'Agent shell must expose existing sign-out with the canonical Workspace Home return.');
for (const forbidden of ['/admin', 'MCP', 'Search Homes', 'PublicNavigation', 'PlatformFooter', 'localStorage', 'sessionStorage']) {
  assert(!agentShellContracts.includes(forbidden), `Agent shell must not introduce ${forbidden}`);
}
assert(marketPage.includes('MarketConversationExperience'), 'Market workflow route must remain unchanged');
assert(marketExperience.includes('data-agent-only="true"') && marketExperience.includes('data-persistence="false"'), 'Market experience must remain Agent-only and ephemeral');
assert(auth.includes("surface('/agent', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION']") && auth.includes("surface('/agent/prepare/buyer'") && auth.includes("surface('/agent/prepare/market'") && auth.includes("surface('/agent/prepare/property'") && auth.includes("['AGENT']"), 'Agent Workspace Home and exact workflows must remain classified.');
assert(auth.includes("surface('/agent/prepare/market-update'"), 'Market Update Preparation must use exact Agent authorization.');
assert(auth.includes("surface('/agent/prepare/seller'") && auth.includes("surface('/agent/prepare/listing'"), 'Seller and Listing Preparation must use exact Agent authorization surfaces.');
assert(middleware.includes("pathname === '/agent' || pathname.startsWith('/agent/')"), 'The full Agent namespace must retain its existing login protection.');

console.log('AGENT_OPERATING_SHELL_CHECK: PASS');
