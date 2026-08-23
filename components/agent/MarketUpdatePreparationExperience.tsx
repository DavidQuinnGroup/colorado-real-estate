'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, FileText, RefreshCw, ShieldCheck } from 'lucide-react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import {
  MARKET_UPDATE_AUDIENCES,
  MARKET_UPDATE_PURPOSES,
  MARKET_UPDATE_TOPICS,
  prepareAgentMarketUpdate,
  type MarketUpdateAudience,
  type MarketUpdatePurpose,
  type MarketUpdateTopic,
} from '@/lib/agent-advisory-workbench/marketUpdatePreparation';

const MARKETS = [
  { id: 'boulder-co-housing-market', label: 'Boulder' },
  { id: 'louisville-co-housing-market', label: 'Louisville' },
  { id: 'lafayette-co-housing-market', label: 'Lafayette' },
  { id: 'superior-co-housing-market', label: 'Superior' },
  { id: 'erie-co-housing-market', label: 'Erie' },
  { id: 'longmont-co-housing-market', label: 'Longmont' },
] as const;

const audienceLabels: Readonly<Record<MarketUpdateAudience, string>> = Object.freeze({
  BUYER: 'Buyer', SELLER: 'Seller', HOMEOWNER: 'Homeowner', PROSPECT: 'Prospective client', GENERAL: 'General conversation',
});
const purposeLabels: Readonly<Record<MarketUpdatePurpose, string>> = Object.freeze({
  MARKET_CHECK_IN: 'Market check-in', BUYER_MARKET_UPDATE: 'Buyer market update', SELLER_MARKET_UPDATE: 'Seller market update', HOMEOWNER_UPDATE: 'Homeowner update', GENERAL_MARKET_CONVERSATION: 'General market conversation',
});
const topicLabels: Readonly<Record<MarketUpdateTopic, string>> = Object.freeze({
  INVENTORY: 'Inventory', DAYS_ON_MARKET: 'Days on market', MEDIAN_PRICE: 'Median price',
});

function today() {
  return new Date().toISOString().slice(0, 10);
}

function selectClass(selected: boolean) {
  return `flex min-h-12 cursor-pointer items-center justify-between border px-3 py-2 text-sm transition ${selected ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/30'}`;
}

export default function MarketUpdatePreparationExperience() {
  const [marketId, setMarketId] = useState('');
  const [audience, setAudience] = useState<MarketUpdateAudience>('GENERAL');
  const [purpose, setPurpose] = useState<MarketUpdatePurpose>('MARKET_CHECK_IN');
  const [topics, setTopics] = useState<MarketUpdateTopic[]>(['INVENTORY', 'DAYS_ON_MARKET', 'MEDIAN_PRICE']);
  const [preparedInput, setPreparedInput] = useState<Readonly<{ marketId: string; audience: MarketUpdateAudience; purpose: MarketUpdatePurpose; topics: readonly MarketUpdateTopic[] }> | null>(null);
  const asOf = useMemo(() => today(), []);
  const preparation = useMemo(() => preparedInput ? prepareAgentMarketUpdate({ ...preparedInput, asOf }) : null, [asOf, preparedInput]);

  const toggleTopic = (topic: MarketUpdateTopic) => setTopics((current) => current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]);
  const prepare = () => setPreparedInput({ marketId, audience, purpose, topics });

  return <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-market-update-preparation-experience" data-agent-only="true" data-session-only="true" data-persistence="false" data-customer-data="false" data-recipient-selection="false" data-communication-execution="false" data-provider-activity="false" data-admin-inheritance="false">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <AgentPreparationPageHeader pageTitle="MARKET UPDATE PREPARATION" taskHeading="Prepare a dated market update" description="Select the market, conversation context, and evidence to organize a human-reviewed update on this page." scopeNote="This is session-only preparation. It does not select recipients, send, publish, or save a communication." />
      </header>

      <section className="mt-8 border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="market-update-selection-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Update context</p><h2 id="market-update-selection-heading" className={`mt-1 ${projectAtlasTitleHierarchy.selectionSection}`}>Choose what to prepare</h2></div><p className="text-sm text-slate-400">Selections remain editable after preparation.</p></div>
        <div className="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-2">
          <fieldset><legend className={projectAtlasTitleHierarchy.selectionGroup}>Market</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{MARKETS.map((market) => <label key={market.id} className={selectClass(marketId === market.id)}><span>{market.label}</span><input type="radio" name="market-update-market" value={market.id} checked={marketId === market.id} onChange={() => setMarketId(market.id)} className="h-4 w-4 accent-cyan-200" /></label>)}</div></fieldset>
          <fieldset><legend className={projectAtlasTitleHierarchy.selectionGroup}>Audience</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{MARKET_UPDATE_AUDIENCES.map((item) => <label key={item} className={selectClass(audience === item)}><span>{audienceLabels[item]}</span><input type="radio" name="market-update-audience" value={item} checked={audience === item} onChange={() => setAudience(item)} className="h-4 w-4 accent-cyan-200" /></label>)}</div></fieldset>
          <fieldset><legend className={projectAtlasTitleHierarchy.selectionGroup}>Purpose</legend><div className="mt-3 grid gap-2">{MARKET_UPDATE_PURPOSES.map((item) => <label key={item} className={selectClass(purpose === item)}><span>{purposeLabels[item]}</span><input type="radio" name="market-update-purpose" value={item} checked={purpose === item} onChange={() => setPurpose(item)} className="h-4 w-4 accent-cyan-200" /></label>)}</div></fieldset>
          <fieldset><legend className={projectAtlasTitleHierarchy.selectionGroup}>Topics to emphasize</legend><div className="mt-3 grid gap-2">{MARKET_UPDATE_TOPICS.map((item) => <label key={item} className={selectClass(topics.includes(item))}><span>{topicLabels[item]}</span><input type="checkbox" checked={topics.includes(item)} onChange={() => toggleTopic(item)} className="h-4 w-4 accent-cyan-200" /></label>)}</div></fieldset>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400">Use only the admitted market evidence shown below. Confirm currentness before relying on it in a live conversation.</p><button type="button" onClick={prepare} disabled={!marketId || !topics.length} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-market-update-prepare">Prepare update <ArrowRight size={16} aria-hidden="true" /></button></div>
      </section>

      {!preparation ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-market-update-empty-state">Choose a supported market and at least one topic, then prepare the update.</section> : null}
      {preparation?.state === 'NOT_READY' ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.05] p-5 text-sm leading-6 text-amber-50/90" role="status">{preparation.executiveSummary}</section> : null}
      {preparation && preparation.state !== 'NOT_READY' ? <div className="mt-8 space-y-5" data-testid="agent-market-update-package" data-market-update-state={preparation.state}>
        <section className="border border-cyan-200/20 bg-cyan-100/[0.06] p-5 sm:p-6"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">Executive market summary</p><h2 className="mt-2 text-2xl font-semibold text-white">{MARKETS.find((market) => market.id === preparation.input.marketId)?.label} market update</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-200">{preparation.executiveSummary}</p></section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="text-lg font-semibold">Key market observations</h2></div><dl className="mt-5 grid gap-3">{preparation.observations.map((item) => <div key={item.label} className="border border-white/10 bg-black/15 p-4"><dt className="text-xs text-slate-400">Observed fact</dt><dd className="mt-2 font-medium text-white">{item.label}</dd><dd className="mt-2 text-sm leading-6 text-slate-300">{item.value}</dd></div>)}</dl></div><div className="border border-amber-200/20 bg-amber-100/[0.05] p-5 sm:p-6"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><h2 className="text-lg font-semibold">What could change the interpretation</h2></div><p className="mt-5 text-sm leading-6 text-slate-300">{preparation.whatChanged}</p><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{preparation.interpretationLimits.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h2 className="text-lg font-semibold">Why it matters to this conversation</h2><p className="mt-4 text-sm leading-6 text-slate-300">{preparation.audienceContext}</p><h3 className="mt-6 text-sm font-semibold text-white">Talking points</h3><ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">{preparation.talkingPoints.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h2 className="text-lg font-semibold">Client-friendly explanations</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{preparation.clientFriendlyExplanations.map((item) => <li key={item}>{item}</li>)}</ul><h3 className="mt-6 text-sm font-semibold text-white">Questions worth asking</h3><ol className="mt-3 space-y-3 text-sm leading-6 text-slate-300">{preparation.questionsWorthAsking.map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-cyan-100">{index + 1}.</span>{item}</li>)}</ol></div></section>
        <section className="grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"><h2 className="text-lg font-semibold">Sources, as-of dates &amp; freshness</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{preparation.sourceFreshness.map((item) => <li key={item}>{item}</li>)}</ul><h3 className="mt-6 text-sm font-semibold text-white">Verification checkpoints</h3><ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">{preparation.verificationCheckpoints.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="border border-emerald-200/20 bg-emerald-100/[0.05] p-5 sm:p-6"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-100" aria-hidden="true" /><h2 className="text-lg font-semibold">Agent next actions</h2></div><ol className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{preparation.agentNextActions.map((item, index) => <li key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"><span className="text-emerald-100">{index + 1}.</span>{item}</li>)}</ol></div></section>
        <section className="border border-white/10 bg-white/[0.025] p-5 sm:p-6"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Optional human-review language</p><h2 className="mt-1 text-lg font-semibold">Draft market update language</h2></div></div><p className="mt-5 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-slate-200">{preparation.optionalDraftLanguage}</p><p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">This language is not sent, published, saved, or addressed to a recipient. Review and adapt it personally before any external use.</p></section>
        <div className="flex justify-end"><button type="button" onClick={prepare} className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-100/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]" data-testid="agent-market-update-refresh"><RefreshCw size={16} aria-hidden="true" /> Update preparation</button></div>
      </div> : null}
    </div>
  </main>;
}
