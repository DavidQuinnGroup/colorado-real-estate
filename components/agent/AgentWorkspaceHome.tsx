import Link from 'next/link';
import { ArrowRight, Building2, Calculator, ClipboardCheck, ClipboardList, FileText, FolderKanban, Home, MapPinned, MessageSquareText, ShieldCheck, Store, Users } from 'lucide-react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';

const preparationCapabilities = [
  { title: 'Buyer Preparation', description: 'Prepare the questions, priorities, and professional checkpoints for a buyer consultation.', href: '/agent/prepare/buyer', icon: Users },
  { title: 'Seller Preparation', description: 'Prepare the conversation, timing, and review points for a seller consultation.', href: '/agent/prepare/seller', icon: ClipboardList },
  { title: 'Seller Presentation', description: 'Compose and review the Seller Decision Brief with Agent, Seller, and print preview modes.', href: '/agent/prepare/seller/presentation', icon: FileText },
  { title: 'Professional Inputs', description: 'Record internal professional-input requests, review bounded evidence, and preserve admitted input history.', href: '/agent/prepare/professional-inputs', icon: ClipboardCheck },
  { title: 'Buyer Under Contract', description: 'Coordinate owner-scoped deadlines, factual issues, low-risk decisions, provenance, and reviewed internal outputs.', href: '/agent/under-contract', icon: ClipboardList },
  { title: 'Client Authorization', description: 'Review profile-governed synthetic authorization history, scope, lifecycle, and resolver results.', href: '/agent/authorizations', icon: ShieldCheck },
  { title: 'Client Work', description: 'Create and discover durable owner-scoped Client Case advisory context.', href: '/agent/clients', icon: FolderKanban },
  { title: 'Investment Breakeven', description: 'Model pre-tax capital, financing, rent, operating assumptions, and breakeven scenarios for Agent review.', href: '/agent/investment', icon: Calculator },
  { title: 'Listing Preparation', description: 'Prepare a listing appointment and the property-to-market questions that need review.', href: '/agent/prepare/listing', icon: Store },
  { title: 'Location Preparation', description: 'Prepare geographic and local context for a city, community, neighborhood, access, or place question.', href: '/agent/prepare/place', icon: MapPinned },
  { title: 'Property Preparation', description: 'Prepare property-specific diligence around an address, facts, condition, records, HOA, taxes, title, or insurance.', href: '/agent/prepare/property', icon: Home },
  { title: 'Market Preparation', description: 'Prepare current inventory, pricing, days on market, competition, supply, demand, and market-condition questions.', href: '/agent/prepare/market', icon: Building2 },
  { title: 'Market Update Preparation', description: 'Prepare a dated, evidence-aware market update and human-review draft for a selected conversation context.', href: '/agent/prepare/market-update', icon: MessageSquareText },
] as const;

export default function AgentWorkspaceHome() {
  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-workspace-home" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl border-b border-white/10 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent Workspace</p>
          <h1 className={`mt-3 ${projectAtlasTitleHierarchy.page}`}>Choose what you want to prepare</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">Organize the intelligence, questions, evidence, and preparation for your next professional conversation or task.</p>
        </header>

        <section className="mt-8" aria-labelledby="agent-workspace-capabilities-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Preparation launcher</p>
              <h2 id="agent-workspace-capabilities-heading" className={`mt-1 ${projectAtlasTitleHierarchy.section}`}>Available capabilities</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">Select the work that matches the next conversation. Each preparation surface remains session-only and professionally bounded.</p>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Agent preparation capabilities">
            {preparationCapabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <li key={capability.href}>
                  <Link href={capability.href} className="group flex min-h-60 h-full flex-col border border-white/10 bg-white/[0.035] p-5 text-left no-underline transition hover:border-cyan-100/35 hover:bg-cyan-100/[0.06] sm:p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="agent-workspace-capability-link" data-agent-workspace-capability={capability.href}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-[7px] bg-cyan-100/10 text-cyan-100 ring-1 ring-cyan-100/15"><Icon size={19} aria-hidden="true" /></span>
                    <h3 className={projectAtlasTitleHierarchy.capabilityCard} data-testid="agent-workspace-capability-title">{capability.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{capability.description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-cyan-100">Open preparation <ArrowRight size={16} aria-hidden="true" /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
