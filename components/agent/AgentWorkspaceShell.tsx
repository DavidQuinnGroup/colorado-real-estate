'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AgentWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/agent/login') return <>{children}</>;

  return (
    <section className="min-h-screen bg-[#071014] text-slate-100" data-testid="agent-workspace-shell" data-agent-shell="private-professional">
      <header className="border-b border-white/10 bg-[#071014]" data-testid="agent-workspace-navigation">
        <nav className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12" aria-label="Agent workspace navigation">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Project Atlas</p>
            <p className="mt-1 text-sm font-medium text-white">Agent Workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/agent/prepare/market" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-market-link">
              Market Preparation
            </Link>
            <Link href="/agent/logout?next=/agent/prepare/market" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-sign-out">
              <LogOut size={15} aria-hidden="true" />
              Sign out
            </Link>
          </div>
        </nav>
      </header>
      <main className="min-h-[calc(100vh-72px)]">{children}</main>
    </section>
  );
}
