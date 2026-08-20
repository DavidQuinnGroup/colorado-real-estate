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
assert(agentShell.includes('Project Atlas') && agentShell.includes('Agent Workspace'), 'Agent product identity is required');
assert(agentShell.includes('href="/agent/prepare/market"'), 'only the existing Market Preparation destination may be present');
assert(agentShell.includes('href="/agent/logout?next=/agent/prepare/market"'), 'Agent shell must expose existing sign-out');
for (const forbidden of ['/admin', 'MCP', 'Search Homes', 'PublicNavigation', 'PlatformFooter', 'localStorage', 'sessionStorage']) {
  assert(!agentShell.includes(forbidden), `Agent shell must not introduce ${forbidden}`);
}
assert(marketPage.includes('MarketConversationExperience'), 'Market workflow route must remain unchanged');
assert(marketExperience.includes('data-agent-only="true"') && marketExperience.includes('data-persistence="false"'), 'Market experience must remain Agent-only and ephemeral');
assert(auth.includes("surface('/agent/prepare/market'") && auth.includes("['AGENT']"), 'exact Agent Market authorization must remain classified');
assert(middleware.includes('pathname === "/agent/prepare/market"'), 'exact Market route login protection must remain');

console.log('AGENT_OPERATING_SHELL_CHECK: PASS');
