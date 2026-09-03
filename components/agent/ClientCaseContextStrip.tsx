'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function ClientCaseContextStrip({ clientCaseId }: { clientCaseId: string }) {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => { let active = true; void fetch(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async r => r.ok ? r.json() : null).then(data => { if (active && data?.clientCase?.displayName) setName(data.clientCase.displayName); }).catch(() => {}); return () => { active = false; }; }, [clientCaseId]);
  if (!name) return null;
  return <div className="border-b border-cyan-100/20 bg-cyan-100/[0.05] px-5 py-3 text-sm sm:px-8 lg:px-12" aria-label="Client Case context"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2"><span className="text-slate-300"><span className="mr-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Client Case</span>{name}</span><Link href={`/agent/clients/${clientCaseId}`} className="font-semibold text-cyan-100 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100">View Case</Link></div></div>;
}
