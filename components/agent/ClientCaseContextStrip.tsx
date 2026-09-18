'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { agentWorkspaceNavigation, agentWorkspaceHref } from '@/lib/agentWorkspaceNavigation';
import { usePathname } from 'next/navigation';
import styles from './AgentWorkspaceShell.module.css';
export default function ClientCaseContextStrip({ clientCaseId }: { clientCaseId: string }) {
  const [clientCase, setClientCase] = useState<{ displayName: string; status: string } | null>(null); const pathname = usePathname();
  useEffect(() => { let active = true; void fetch(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async r => r.ok ? r.json() : null).then(data => { if (active && data?.clientCase?.displayName) setClientCase(data.clientCase); }).catch(() => {}); return () => { active = false; }; }, [clientCaseId]);
  if (!clientCase) return null;
  const work = agentWorkspaceNavigation.filter(item => ['clients','buyer','seller','financial','intelligence','transactions','outputs','authorizations'].includes(item.key));
  return <section className={styles.contextStrip} aria-label="Client Case context"><div className={styles.contextInner}><p className={styles.contextEyebrow}>Project Atlas / Client Work</p><h2 className={styles.contextTitle}>{clientCase.displayName}</h2><p className={styles.contextStatus}>Status: {clientCase.status}</p><nav className={styles.contextNavigation} aria-label="Client Case work navigation">{work.map(item => <Link key={item.key} href={item.key === 'clients' ? `/agent/clients/${clientCaseId}` : agentWorkspaceHref(item, clientCaseId)} aria-current={item.active(pathname) ? 'page' : undefined} className={styles.contextNavigationLink}>{item.key === 'clients' ? 'View Case' : item.label}</Link>)}</nav></div></section>;
}
