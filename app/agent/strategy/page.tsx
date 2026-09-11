import type { Metadata } from 'next';
import MultiDimensionalStrategyWorkspace from '@/components/agent/MultiDimensionalStrategyWorkspace';
import MultiPropertyFinancialScenarioWorkspace from '@/components/agent/MultiPropertyFinancialScenarioWorkspace';
import { agentWorkspaceHierarchy } from '@/lib/agentWorkspacePresentation';

export const dynamic = 'force-dynamic'; export const revalidate = 0;
export const metadata: Metadata = { title: 'Financial Strategy | Project Atlas Agent', description: 'Private Agent workspace for governed multi-property financial scenario analysis.' };
export default function StrategySuitePage() {
  return <><header className="border-b border-white/10 bg-[#08151a] px-5 py-8 text-slate-100 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Project Atlas / Agent Workspace</p><h1 className={`mt-2 ${agentWorkspaceHierarchy.page}`}>Financial Strategy</h1><p className={`mt-3 max-w-3xl ${agentWorkspaceHierarchy.supporting}`}>Review governed scenario and strategy analysis while preserving the distinction between modeled assumptions, locked versions, and review-required Outputs.</p></div></header><MultiPropertyFinancialScenarioWorkspace /><MultiDimensionalStrategyWorkspace /></>;
}
