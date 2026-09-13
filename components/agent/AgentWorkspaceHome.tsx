'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { agentWorkspaceNavigation } from '@/lib/agentWorkspaceNavigation';

import styles from './AgentWorkspaceShell.module.css';

type ClientCase = { id: string; displayName: string; updatedAt: string; _count?: { parties: number; properties: number; transactions: number } };
type LaunchGroup = { heading: string; keys: string[]; descriptions: Record<string, string> };

const launchGroups: LaunchGroup[] = [
  {
    heading: 'Client and decision work',
    keys: ['clients', 'buyer', 'seller'],
    descriptions: {
      clients: 'Open or continue the durable case context for current advisory work.',
      buyer: 'Prepare the next buyer conversation and decision path.',
      seller: 'Prepare a seller conversation, listing work, or presentation.',
    },
  },
  {
    heading: 'Strategy and intelligence',
    keys: ['financial', 'intelligence'],
    descriptions: {
      financial: 'Review the existing financial and investment strategy workspaces.',
      intelligence: 'Prepare market, location, property, and evidence-aware intelligence.',
    },
  },
  {
    heading: 'Workflow and governance',
    keys: ['transactions', 'outputs', 'authorizations'],
    descriptions: {
      transactions: 'Continue transaction-specific records and working context.',
      outputs: 'Access existing internal and client-facing output records.',
      authorizations: 'Review the client authorization records that govern approved actions.',
    },
  },
];

export default function AgentWorkspaceHome() {
  const [cases, setCases] = useState<ClientCase[]>([]); const [failed, setFailed] = useState(false);
  useEffect(() => { let active = true; void fetch('/api/agent/client-cases', { cache: 'no-store' }).then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<{ clientCases?: ClientCase[] }>; }).then((data) => { if (active) setCases((data.clientCases || []).slice(0, 5)); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, []);
  return <main className={styles.home} data-testid="agent-workspace-home" data-persistence="false"><div className={styles.homeInner}>
    <header className={styles.homeHeader}><p className={styles.homeEyebrow}>Project Atlas</p><h1 className={styles.homeTitle}>Agent Workspace</h1><p className={styles.homeIntroduction}>Choose a work area, continue an existing Client Case, or move directly to the operational record that supports the next decision.</p></header>
    {launchGroups.map((group) => <section aria-labelledby={`agent-home-${group.heading.replaceAll(' ', '-').toLowerCase()}`} className={styles.homeSection} key={group.heading}><h2 className={styles.homeSectionHeading} id={`agent-home-${group.heading.replaceAll(' ', '-').toLowerCase()}`}>{group.heading}</h2><div className={styles.launchGrid}>{group.keys.map((key) => { const item = agentWorkspaceNavigation.find((candidate) => candidate.key === key); if (!item) return null; return <Link className={styles.launchCard} href={item.href} key={item.key}><div><h3 className={styles.launchCardTitle}>{item.label}</h3><p className={styles.launchCardDescription}>{group.descriptions[key]}</p></div><span className={styles.launchCardAction}>Open workspace <ArrowUpRight aria-hidden="true" size={16} /></span></Link>; })}</div></section>)}
    <section aria-labelledby="recent-client-work" className={`${styles.homeSection} ${styles.recentWork}`}><div className={styles.recentWorkHeader}><div><p className={styles.homeEyebrow}>Resume client work</p><h2 className={styles.homeSectionHeading} id="recent-client-work">Recent active Cases</h2></div><Link className={styles.recentWorkLink} href="/agent/clients">Open Client Work</Link></div>
      {failed ? <p className={styles.homeEmpty}>Client Work is temporarily unavailable. Navigation remains available.</p> : null}
      {!failed && cases.length === 0 ? <p className={styles.homeEmpty}>No recent active Client Cases are available to this Agent.</p> : null}
      {!failed && cases.length ? <ul className={styles.caseList}>{cases.map((clientCase) => <li className={styles.caseListItem} key={clientCase.id}><Link className={styles.caseLink} href={`/agent/clients/${clientCase.id}`}><p className={styles.caseTitle}>{clientCase.displayName}</p><p className={styles.caseMetadata}>{clientCase._count?.parties || 0} parties · {clientCase._count?.properties || 0} properties · {clientCase._count?.transactions || 0} Transactions</p></Link></li>)}</ul> : null}
    </section>
  </div></main>;
}
