'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { agentWorkspaceNavigation, agentWorkspaceHref } from '@/lib/agentWorkspaceNavigation';
import { usePathname } from 'next/navigation';
export default function ClientCaseContextStrip({ clientCaseId }: { clientCaseId: string }) {
  const [clientCase, setClientCase] = useState<{ displayName: string; status: string } | null>(null); const pathname = usePathname();
  useEffect(() => { let active = true; void fetch(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async r => r.ok ? r.json() : null).then(data => { if (active && data?.clientCase?.displayName) setClientCase(data.clientCase); }).catch(() => {}); return () => { active = false; }; }, [clientCaseId]);
  if (!clientCase) return null;
  const work = agentWorkspaceNavigation.filter(item => ['clients','buyer','seller','financial','intelligence','transactions'].includes(item.key));
  return <section className="border-b border-cyan-100/20 bg-cyan-100/[0.05] px-5 py-5 sm:px-8 lg:px-12" aria-label="Client Case context"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Project Atlas / Client Work</p><h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{clientCase.displayName}</h2><p className="mt-2 text-sm text-cyan-100">Status: {clientCase.status}</p><nav className="mt-4 flex flex-wrap gap-2" aria-label="Client Case work navigation">{work.map(item => <Link key={item.key} href={item.key === 'clients' ? `/agent/clients/${clientCaseId}` : agentWorkspaceHref(item, clientCaseId)} aria-current={item.active(pathname) ? 'page' : undefined} className="rounded-[7px] border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-100/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100">{item.key === 'clients' ? 'View Case' : item.label}</Link>)}</nav></div></section>;
}
