'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { agentWorkspacePrimaryDomains } from '@/lib/agentWorkspaceNavigation';

type ClientCase = { id: string; displayName: string; updatedAt: string; _count?: { parties: number; properties: number; transactions: number } };

export default function AgentWorkspaceHome() {
  const [cases, setCases] = useState<ClientCase[]>([]); const [failed, setFailed] = useState(false);
  useEffect(() => { let active = true; void fetch('/api/agent/client-cases', { cache: 'no-store' }).then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<{ clientCases?: ClientCase[] }>; }).then((data) => { if (active) setCases((data.clientCases || []).slice(0, 5)); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, []);
  return <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12" data-testid="agent-workspace-home" data-persistence="false"><div className="mx-auto max-w-6xl">
    <header className="max-w-3xl border-b border-white/10 pb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas</p><h1 className="mt-3 text-3xl font-semibold text-white">Agent Workspace</h1><p className="mt-3 text-base leading-7 text-slate-300">Start bounded advisory preparation, resume durable Client Work, or move into the work domain that matches the next decision.</p></header>
    <section className="mt-8" aria-labelledby="start-work"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Start new work</p><h2 id="start-work" className="mt-2 text-xl font-semibold text-white">Choose a work domain</h2><div className="mt-4 flex flex-wrap gap-3">{agentWorkspacePrimaryDomains.map((item) => <Link key={item.key} href={item.href} className="inline-flex min-h-10 items-center rounded-[7px] border border-white/15 px-4 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/45 hover:bg-cyan-100/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100">{item.label}</Link>)}</div></section>
    <section className="mt-10 border-t border-white/10 pt-7" aria-labelledby="recent-client-work"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Resume client work</p><h2 id="recent-client-work" className="mt-2 text-xl font-semibold text-white">Recent active Cases</h2></div><Link href="/agent/clients" className="text-sm font-semibold text-cyan-100 hover:text-white">Open Client Work</Link></div>
      {failed ? <p className="mt-4 text-sm text-slate-400">Client Work is temporarily unavailable. Navigation remains available.</p> : cases.length ? <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">{cases.map((clientCase) => <li key={clientCase.id}><Link href={`/agent/clients/${clientCase.id}`} className="block py-4 transition hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"><p className="font-semibold text-white">{clientCase.displayName}</p><p className="mt-1 text-sm text-slate-400">{clientCase._count?.parties || 0} parties · {clientCase._count?.properties || 0} properties · {clientCase._count?.transactions || 0} Transactions</p></Link></li>)}</ul> : <p className="mt-4 text-sm text-slate-400">No recent active Client Cases are available to this Agent.</p>}
    </section>
  </div></div>;
}
