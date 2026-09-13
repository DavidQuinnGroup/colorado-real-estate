import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const layout = source('app/agent/layout.tsx');
const shell = source('components/agent/AgentWorkspaceShell.tsx');
const navigation = source('components/agent/AgentWorkspaceNavigation.tsx');
const home = source('components/agent/AgentWorkspaceHome.tsx');
const styles = source('components/agent/AgentWorkspaceShell.module.css');
const navigationRegistry = source('lib/agentWorkspaceNavigation.ts');

assert.match(layout, /<AgentWorkspaceShell>\{children\}<\/AgentWorkspaceShell>/, 'The shared Agent layout must own the canonical shell.');
assert.match(shell, /atlas-ds-shell-agent/, 'The Agent profile must be applied at the shared shell boundary.');
assert.match(shell, /atlas-ds-density-operational/, 'The Agent shell must consume the certified operational density.');
assert.match(shell, /AgentWorkspaceNavigation/, 'Global navigation must remain owned by the shared Agent shell.');
assert.match(shell, /Skip to workspace content/, 'The Agent shell must provide a keyboard skip link.');
assert.match(shell, /id="agent-workspace-content"/, 'The skip link must target the workspace content region.');
assert.match(navigation, /agentWorkspaceNavigation\.map/, 'Both responsive navigations must use the canonical destination registry.');
assert.match(navigation, /aria-current=\{active \? 'page' : undefined\}/, 'Active routes must remain programmatically identified.');
assert.match(navigation, /aria-expanded=\{menuOpen\}/, 'The mobile navigation trigger must expose its state.');
assert.match(navigation, /aria-controls="agent-workspace-mobile-navigation"/, 'The mobile navigation trigger must control the disclosure region.');
assert.match(navigation, /event\.key !== 'Escape'/, 'The mobile navigation must support Escape dismissal.');
assert.match(navigation, /triggerRef\.current\?\.focus\(\)/, 'Escape dismissal must restore trigger focus.');
assert.match(navigation, /href="\/" prefetch=\{false\}/, 'Public Site must retain its non-prefetched same-origin navigation behavior.');
assert.match(navigation, /href="\/agent\/logout\?next=\/agent"/, 'Sign out must retain its existing route and return target.');
assert.match(navigation, /onNavigate=\{closeMenu\}/, 'The mobile disclosure must close when an internal destination is selected.');
assert.match(styles, /var\(--atlas-profile-canvas\)/, 'Shell canvas must consume the profile-resolved Foundation token.');
assert.match(styles, /var\(--atlas-profile-surface-primary\)/, 'Shell materials must consume profile-resolved Foundation tokens.');
assert.match(styles, /prefers-reduced-motion/, 'Shell transitions must respect reduced motion.');
assert.doesNotMatch(styles, /#[0-9a-fA-F]{3,8}/, 'Shell composition must not duplicate resolved Foundation colors.');
assert.match(home, /agentWorkspaceNavigation\.find/, 'Workspace Home cards must use canonical navigation destinations.');
assert.match(home, /className=\{styles\.launchCard\}/, 'Workspace Home launch cards must be semantic links.');
assert.match(home, /data-persistence="false"/, 'Workspace Home must retain its session-only contract.');
assert.doesNotMatch(home, /fake|revenue|lead count|task queue|activity feed/i, 'Workspace Home must not add fabricated dashboard data.');

for (const [label, href, route] of [
  ['Workspace Home', '/agent', 'app/agent/page.tsx'],
  ['Client Work', '/agent/clients', 'app/agent/clients/page.tsx'],
  ['Buyer', '/agent/prepare/buyer', 'app/agent/prepare/buyer/page.tsx'],
  ['Seller', '/agent/prepare/seller', 'app/agent/prepare/seller/page.tsx'],
  ['Financial Strategy', '/agent/strategy', 'app/agent/strategy/page.tsx'],
  ['Intelligence', '/agent/prepare/market', 'app/agent/prepare/market/page.tsx'],
  ['Transactions', '/agent/transactions', 'app/agent/transactions/page.tsx'],
  ['Outputs', '/agent/outputs', 'app/agent/outputs/page.tsx'],
  ['Client Authorization', '/agent/authorizations', 'app/agent/authorizations/page.tsx'],
] as const) {
  assert.match(navigationRegistry, new RegExp(`label: '${label}', href: '${href.replaceAll('/', '\\/')}'`), `${label} must remain in the canonical navigation registry.`);
  assert.equal(existsSync(resolve(process.cwd(), route)), true, `${label} must retain an admitted route.`);
}

console.log('AGENT_WORKSPACE_SHELL_ADOPTION_CHECK: PASS');
