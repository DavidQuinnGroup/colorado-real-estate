import type { Metadata } from 'next';
import MultiDimensionalStrategyWorkspace from '@/components/agent/MultiDimensionalStrategyWorkspace';
import MultiPropertyFinancialScenarioWorkspace from '@/components/agent/MultiPropertyFinancialScenarioWorkspace';
import { agentWorkspaceHierarchy } from '@/lib/agentWorkspacePresentation';

export const dynamic = 'force-dynamic'; export const revalidate = 0;
export const metadata: Metadata = { title: 'Financial Strategy | Project Atlas Agent', description: 'Private Agent workspace for governed multi-property financial scenario analysis.' };
export default function StrategySuitePage() {
  return <><header className="border-b border-[color:color-mix(in_srgb,var(--atlas-profile-border-subtle)_34%,transparent)] bg-[color:color-mix(in_srgb,var(--atlas-profile-surface-primary)_72%,transparent)] px-5 py-8 text-[var(--atlas-text-primary)] shadow-[var(--atlas-depth-1)] backdrop-blur-2xl sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--atlas-information-system-status)]">Project Atlas / Agent Workspace</p><h1 className={`mt-2 ${agentWorkspaceHierarchy.page}`}>Financial Strategy</h1><p className={`mt-3 max-w-3xl ${agentWorkspaceHierarchy.supporting}`}>Review governed scenario and strategy analysis while preserving the distinction between modeled assumptions, locked versions, and review-required Outputs.</p></div></header><MultiPropertyFinancialScenarioWorkspace /><MultiDimensionalStrategyWorkspace /></>;
}
