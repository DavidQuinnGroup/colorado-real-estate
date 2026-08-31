'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, ClipboardCheck, FileText, Globe2, Home, LogOut, NotebookTabs, ShieldCheck } from 'lucide-react';

export default function AgentWorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/agent/login') return <>{children}</>;

  return (
    <section className="min-h-screen bg-[#071014] text-slate-100" data-testid="agent-workspace-shell" data-agent-shell="private-professional">
      <header className="border-b border-white/10 bg-[#071014]" data-testid="agent-workspace-navigation">
        <nav className="mx-auto flex min-h-[72px] max-w-6xl flex-col items-start justify-between gap-3 px-5 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-8 lg:px-12" aria-label="Agent workspace navigation">
          <a href="/agent" className="min-w-0 rounded-[7px] no-underline outline-none transition hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" aria-label="Agent Workspace home" data-testid="agent-workspace-home-link">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Project Atlas</p>
            <p className="mt-1 text-sm font-medium text-white">Agent Workspace</p>
          </a>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <a href="/agent/prepare/buyer" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-buyer-link">
              Buyer Preparation
            </a>
            <a href="/agent/prepare/buyer/decision-brief" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-buyer-decision-brief-link">
              <FileText size={15} aria-hidden="true" />
              Buyer Decision Brief
            </a>
            <a href="/agent/prepare/seller" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-seller-link">
              Seller Preparation
            </a>
            <a href="/agent/prepare/seller/presentation" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-seller-presentation-link">
              <FileText size={15} aria-hidden="true" />
              Seller Presentation
            </a>
            <a href="/agent/prepare/seller/financial" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-seller-financial-link">
              <Calculator size={15} aria-hidden="true" />
              Seller Financial
            </a>
            <a href="/agent/prepare/professional-inputs" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-professional-inputs-link">
              <ClipboardCheck size={15} aria-hidden="true" />
              Professional Inputs
            </a>
            <a href="/agent/under-contract" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-under-contract-link">
              <NotebookTabs size={15} aria-hidden="true" />
              Under Contract
            </a>
            <a href="/agent/authorizations" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-client-authorizations-link">
              <ShieldCheck size={15} aria-hidden="true" />
              Client Authorization
            </a>
            <a href="/agent/prepare/listing" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-listing-link">
              Listing Preparation
            </a>
            <a href="/agent/prepare/place" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-place-link">
              Location Preparation
            </a>
            <a href="/agent/prepare/property" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-property-link">
              Property Preparation
            </a>
            <a href="/agent/prepare/market" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-market-link">
              Market Preparation
            </a>
            <a href="/agent/prepare/market-update" className="rounded-[7px] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-market-update-link">
              Market Update
            </a>
            <a href="/agent" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-home-control">
              <Home size={15} aria-hidden="true" />
              Workspace Home
            </a>
            <Link href="/" prefetch={false} className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-cyan-100/25 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-100/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-public-site-link">
              <Globe2 size={15} aria-hidden="true" />
              Public Site
            </Link>
            <a href="/agent/logout?next=/agent" className="inline-flex min-h-10 items-center gap-2 rounded-[7px] border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-sign-out">
              <LogOut size={15} aria-hidden="true" />
              Sign out
            </a>
          </div>
        </nav>
      </header>
      <main className="min-h-[calc(100vh-72px)]">{children}</main>
    </section>
  );
}
