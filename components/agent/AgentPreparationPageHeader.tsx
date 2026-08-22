type AgentPreparationPageHeaderProps = Readonly<{
  pageTitle: 'MARKET PREPARATION' | 'LOCATION PREPARATION' | 'PROPERTY PREPARATION' | 'BUYER PREPARATION' | 'SELLER PREPARATION';
  taskHeading: string;
  description: string;
  scopeNote: string;
}>;

export default function AgentPreparationPageHeader({ pageTitle, taskHeading, description, scopeNote }: AgentPreparationPageHeaderProps) {
  return <><div className="max-w-3xl" data-testid="agent-preparation-page-header"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent Workspace</p><p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">{pageTitle}</p><h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{taskHeading}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p></div><p className="max-w-xs text-sm leading-6 text-slate-400">{scopeNote}</p></>;
}
