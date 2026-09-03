'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe2, LogOut } from 'lucide-react';

import { agentWorkspaceNavigation } from '@/lib/agentWorkspaceNavigation';

export default function AgentWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/agent/login') return <>{children}</>;

  return <section className="min-h-screen bg-[#071014] text-slate-100" data-testid="agent-workspace-shell" data-agent-shell="private-professional">
    <header className="border-b border-white/10 bg-[#071014]" data-testid="agent-workspace-navigation">
      <nav className="mx-auto max-w-7xl px-5 py-3 sm:px-8 lg:px-12" aria-label="Agent workspace navigation"><div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/agent" className="min-w-0 rounded-[7px] no-underline outline-none transition hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" aria-label="Agent Workspace home" data-testid="agent-workspace-home-link"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Project Atlas</p><p className="mt-1 text-sm font-medium text-white">Agent Workspace</p></Link>
        <div className="flex flex-wrap items-center gap-1">
          {agentWorkspaceNavigation.map((item) => { const active = item.active(pathname); return <Link key={item.key} href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-10 items-center rounded-[7px] px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 ${active ? 'bg-cyan-100/15 text-cyan-100' : item.type === 'UTILITY' ? 'border border-white/15 text-slate-300 hover:border-white/30 hover:bg-white/[0.06] hover:text-white' : 'text-slate-200 hover:bg-white/[0.08] hover:text-white'}`} data-agent-nav-key={item.key}>{item.label}</Link>; })}
          <span className="hidden h-6 border-l border-white/15 sm:block" aria-hidden="true" />
          <Link href="/" prefetch={false} className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-cyan-100/25 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-100/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"><Globe2 size={15} aria-hidden="true" />Public Site</Link>
          <a href="/agent/logout?next=/agent" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"><LogOut size={15} aria-hidden="true" />Sign out</a>
        </div>
      </div></nav>
    </header>
    <main className="min-h-[calc(100vh-72px)]">{children}</main>
  </section>;
}
