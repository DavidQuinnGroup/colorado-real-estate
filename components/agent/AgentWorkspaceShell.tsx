'use client';

import type { ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import ClientCaseContextStrip from '@/components/agent/ClientCaseContextStrip';
import AgentWorkspaceNavigation from '@/components/agent/AgentWorkspaceNavigation';

import styles from './AgentWorkspaceShell.module.css';

export default function AgentWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clientCaseId = searchParams.get('clientCaseId');

  if (pathname === '/agent/login') return <>{children}</>;

  return (
    <section className={`atlas-ds-root atlas-ds-shell-agent atlas-ds-density-operational ${styles.shell}`} data-agent-shell="private-professional" data-testid="agent-workspace-shell">
      <a className={styles.skipLink} href="#agent-workspace-content">Skip to workspace content</a>
      <AgentWorkspaceNavigation clientCaseId={clientCaseId} />
      {clientCaseId && !pathname.startsWith('/agent/clients') ? <ClientCaseContextStrip clientCaseId={clientCaseId} /> : null}
      <div className={styles.main} id="agent-workspace-content" tabIndex={-1}>{children}</div>
    </section>
  );
}
