export type AgentNavigationType = 'WORKSPACE' | 'WORK_DOMAIN' | 'UTILITY';

export type AgentNavigationItem = {
  key: string;
  label: string;
  href: string;
  type: AgentNavigationType;
  active: (pathname: string) => boolean;
};

const startsWith = (prefix: string) => (pathname: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

export const agentWorkspaceNavigation: AgentNavigationItem[] = [
  { key: 'home', label: 'Workspace Home', href: '/agent', type: 'WORKSPACE', active: (pathname) => pathname === '/agent' },
  { key: 'clients', label: 'Client Work', href: '/agent/clients', type: 'WORK_DOMAIN', active: startsWith('/agent/clients') },
  { key: 'buyer', label: 'Buyer', href: '/agent/prepare/buyer', type: 'WORK_DOMAIN', active: startsWith('/agent/prepare/buyer') },
  { key: 'seller', label: 'Seller', href: '/agent/prepare/seller', type: 'WORK_DOMAIN', active: startsWith('/agent/prepare/seller') || startsWith('/agent/prepare/listing') },
  { key: 'financial', label: 'Financial Strategy', href: '/agent/strategy', type: 'WORK_DOMAIN', active: (pathname) => ['/agent/strategy', '/agent/investment', '/agent/advanced-return'].includes(pathname) || startsWith('/agent/prepare/seller/financial')(pathname) },
  { key: 'intelligence', label: 'Intelligence', href: '/agent/prepare/market', type: 'WORK_DOMAIN', active: (pathname) => ['/agent/prepare/market', '/agent/prepare/market-update', '/agent/prepare/place', '/agent/prepare/property'].includes(pathname) },
  { key: 'transactions', label: 'Transactions', href: '/agent/under-contract', type: 'WORK_DOMAIN', active: startsWith('/agent/under-contract') },
  { key: 'authorizations', label: 'Client Authorization', href: '/agent/authorizations', type: 'UTILITY', active: startsWith('/agent/authorizations') },
];

export const agentWorkspacePrimaryDomains = agentWorkspaceNavigation.filter((item) => item.type === 'WORK_DOMAIN');

export function agentWorkspaceHref(item: AgentNavigationItem, clientCaseId?: string | null) {
  if (!clientCaseId || !['buyer', 'seller', 'financial', 'intelligence', 'transactions'].includes(item.key)) return item.href;
  return `${item.href}?clientCaseId=${encodeURIComponent(clientCaseId)}`;
}
