import { readFileSync } from 'node:fs';

function requireText(path: string, expected: string) {
  const source = readFileSync(path, 'utf8');
  if (!source.includes(expected)) throw new Error(`${path} is missing ${expected}`);
}

requireText('lib/agentWorkspaceNavigation.ts', "label: 'Client Work'");
requireText('lib/agentWorkspaceNavigation.ts', "label: 'Transactions'");
requireText('lib/agentWorkspaceNavigation.ts', "label: 'Client Authorization'");
requireText('components/agent/AgentWorkspaceShell.tsx', 'aria-current={active ? \'page\' : undefined}');
requireText('components/agent/AgentWorkspaceShell.tsx', '<a href="/agent/logout?next=/agent"');
requireText('components/agent/AgentWorkspaceHome.tsx', "fetch('/api/agent/client-cases'");
requireText('components/agent/AgentWorkspaceHome.tsx', 'No recent active Client Cases');
requireText('middleware.ts', "pathname === '/agent' || pathname.startsWith('/agent/')");
requireText('lib/admin/adminAuth.ts', "pathname === '/agent' || pathname.startsWith('/agent/')");
console.log('Agent Workspace Information Architecture V1 checks passed.');
