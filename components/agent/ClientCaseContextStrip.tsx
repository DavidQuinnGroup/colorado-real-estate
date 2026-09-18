'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './AgentWorkspaceShell.module.css';

type ClientCaseContext = Readonly<{
  clientCaseId: string;
  displayName: string;
  status: string;
  participantCount: number;
}>;

type ContextState =
  | Readonly<{ clientCaseId: string; kind: 'loading' }>
  | Readonly<{ clientCaseId: string; kind: 'ready'; clientCase: ClientCaseContext }>
  | Readonly<{ clientCaseId: string; kind: 'unavailable' }>;

export default function ClientCaseContextStrip({ clientCaseId }: { clientCaseId: string }) {
  const [state, setState] = useState<ContextState>({ clientCaseId, kind: 'loading' });

  useEffect(() => {
    let active = true;
    void fetch(`/api/agent/client-case-context?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json() as { clientCase?: ClientCaseContext };
        if (!response.ok || !payload.clientCase?.displayName || payload.clientCase.clientCaseId !== clientCaseId) throw new Error('Client Case context is unavailable.');
        if (active) setState({ clientCaseId, kind: 'ready', clientCase: payload.clientCase });
      })
      .catch(() => { if (active) setState({ clientCaseId, kind: 'unavailable' }); });
    return () => { active = false; };
  }, [clientCaseId]);

  const currentState: ContextState = state.clientCaseId === clientCaseId ? state : { clientCaseId, kind: 'loading' };

  if (currentState.kind === 'loading') {
    return <section className={styles.contextStrip} aria-busy="true" aria-label="Client Case context" data-client-case-context-state="loading"><div className={styles.contextInner}><p className={styles.contextStatus} role="status">Loading Client Case context.</p></div></section>;
  }

  if (currentState.kind === 'unavailable') {
    return <section className={styles.contextStrip} aria-label="Client Case context" data-client-case-context-state="unavailable"><div className={styles.contextInner}><p className={styles.contextStatus} role="alert">Client Case context is unavailable.</p><Link className={styles.contextNavigationLink} href="/agent/clients">Open Client Work</Link></div></section>;
  }

  const { clientCase } = currentState;
  const participantLabel = `${clientCase.participantCount} participant${clientCase.participantCount === 1 ? '' : 's'}`;
  return <section className={styles.contextStrip} aria-label="Client Case context" data-client-case-context-state="ready" data-testid="client-case-context-strip"><div className={styles.contextInner}><p className={styles.contextEyebrow}>Client context</p><h2 className={styles.contextTitle}>{clientCase.displayName}</h2><p className={styles.contextStatus}>Status: {clientCase.status} · {participantLabel}</p><nav className={styles.contextNavigation} aria-label="Client Case work navigation"><Link className={styles.contextNavigationLink} href={`/agent/clients/${encodeURIComponent(clientCase.clientCaseId)}`}>Back to Client</Link></nav></div></section>;
}
