'use client';

import { CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import {
  BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES,
  BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS,
  buyerDecisionBriefFingerprint,
  type BuyerDecisionBriefCertificationFixtureId,
} from '@/lib/buyerDecisionBriefFoundation';

type PersistedOutput = Readonly<{
  id: string;
  sourceVersionRef: string;
  versionOrdinal: number;
  displayVersion: string;
  contentFingerprint: string;
  lifecycleState: string;
  created: boolean;
  buyerDecisionBrief?: Readonly<{ fixtureId: BuyerDecisionBriefCertificationFixtureId; offerPriceContextCents: number }>;
}>;

function currency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function BuyerDecisionBriefPreview() {
  const [fixtureId, setFixtureId] = useState<BuyerDecisionBriefCertificationFixtureId>('ATLAS_CERTIFICATION_BUYER_BRIEF_A');
  const [history, setHistory] = useState<readonly PersistedOutput[]>([]);
  const [state, setState] = useState<'LOADING' | 'READY' | 'PERSISTING' | 'FAILED'>('LOADING');
  const [message, setMessage] = useState<string | null>(null);
  const brief = BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES[fixtureId];
  const buyerHistory = useMemo(() => history.filter((output) => output.buyerDecisionBrief), [history]);

  async function restore() {
    const response = await fetch('/api/agent/outputs', { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to restore reviewed Buyer Decision Brief history.');
    const payload = await response.json() as { outputs?: PersistedOutput[] };
    setHistory(payload.outputs ?? []);
  }

  useEffect(() => {
    void (async () => {
      try {
        await restore();
        setState('READY');
      } catch (error) {
        setState('FAILED');
        setMessage(error instanceof Error ? error.message : 'Unable to restore reviewed Buyer Decision Brief history.');
      }
    })();
  }, []);

  async function persist() {
    setState('PERSISTING');
    setMessage(null);
    try {
      const response = await fetch('/api/agent/outputs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerDecisionBriefFixtureId: fixtureId, reviewConfirmation: 'AGENT_REVIEWED' }),
      });
      const payload = await response.json() as { output?: PersistedOutput; error?: string };
      if (!response.ok || !payload.output) throw new Error(payload.error ?? 'Unable to persist the reviewed Buyer Decision Brief.');
      await restore();
      setState('READY');
      setMessage(payload.output.versionOrdinal ? `Reviewed Buyer Decision Brief ${payload.output.created ? 'persisted' : 'restored'} as version #${payload.output.versionOrdinal}.` : null);
    } catch (error) {
      setState('FAILED');
      setMessage(error instanceof Error ? error.message : 'Unable to persist the reviewed Buyer Decision Brief.');
    }
  }

  return <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="buyer-decision-brief-preview" data-agent-only="true" data-client-data="false" data-provider-activity="false" data-pdf="false">
    <div className="mx-auto max-w-6xl">
      <AgentPreparationPageHeader pageTitle="BUYER PREPARATION" taskHeading="Review a bounded Buyer decision snapshot" description="Organize exact reviewed context, unknowns, tradeoffs, and follow-up without an automated purchase recommendation." scopeNote="Synthetic certification fixtures only. No client profile, provider lookup, payment calculation, PDF, delivery, CRM, or external request is activated." />
      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-label="Buyer Decision Brief review">
        <article className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex items-start gap-3"><FileCheck2 className="mt-0.5 h-5 w-5 text-cyan-100" aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Reviewed semantic snapshot</p><h1 className="mt-1 text-2xl font-semibold text-white">{brief.title}</h1></div></div>
          <label className="mt-6 block text-sm font-semibold text-slate-200" htmlFor="buyer-decision-brief-fixture">Certification decision context</label>
          <select id="buyer-decision-brief-fixture" aria-label="Certification decision context" value={fixtureId} onChange={(event) => setFixtureId(event.target.value as BuyerDecisionBriefCertificationFixtureId)} className="mt-2 w-full border border-white/15 bg-[#0b181d] px-3 py-3 text-sm text-white">
            {BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS.map((id) => <option key={id} value={id}>{id.endsWith('_A') ? 'Brief A - $650,000 offer context' : 'Brief B - $660,000 offer context'}</option>)}
          </select>
          <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Decision type</dt><dd className="mt-1 text-sm font-medium text-white">Property evaluation</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Offer context</dt><dd className="mt-1 text-sm font-medium text-white">{currency(brief.decisionContext.offerPriceContextCents)} <span className="font-normal text-slate-400">Agent scenario assumption</span></dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Property</dt><dd className="mt-1 text-sm font-medium text-white">Synthetic identity only; listing status not required</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Location</dt><dd className="mt-1 text-sm font-medium text-white">Boulder <span className="font-normal text-slate-400">synthetic context</span></dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Market</dt><dd className="mt-1 text-sm font-medium text-amber-100">Current metrics not bound</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-slate-400">Financing</dt><dd className="mt-1 text-sm font-medium text-amber-100">Payment calculation deferred</dd></div>
          </dl>
          <div className="mt-6 border-t border-white/10 pt-5"><h2 className="text-sm font-semibold text-white">Questions for review</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{brief.followUp.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={() => void persist()} disabled={state === 'LOADING' || state === 'PERSISTING'} data-testid="persist-buyer-decision-brief" className="inline-flex min-h-11 items-center gap-2 bg-cyan-200 px-4 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"><CheckCircle2 size={16} aria-hidden="true" />Review and persist brief</button>{message ? <p role="status" className={state === 'FAILED' ? 'text-sm text-amber-100' : 'text-sm text-emerald-100'}>{message}</p> : null}</div>
        </article>
        <aside className="border border-white/10 bg-white/[0.02] p-5" aria-label="Buyer Brief evidence and history"><div className="flex items-center gap-2 text-cyan-100"><ShieldCheck size={17} aria-hidden="true" /><h2 className="text-sm font-semibold">Evidence and history</h2></div><p className="mt-3 text-sm leading-6 text-slate-300">Fingerprint {buyerDecisionBriefFingerprint(brief)}</p><p className="mt-4 text-xs leading-5 text-slate-400">The snapshot retains unknown property facts, no current market metric, and no lender rate or payment calculation.</p><div className="mt-6 border-t border-white/10 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Reviewed versions</p><ul className="mt-3 space-y-3">{buyerHistory.length ? buyerHistory.map((output) => <li key={output.id} className="border border-white/10 p-3 text-sm"><p className="font-medium text-white">{output.displayVersion} #{output.versionOrdinal}</p><p className="mt-1 text-slate-400">{output.buyerDecisionBrief ? currency(output.buyerDecisionBrief.offerPriceContextCents) : output.contentFingerprint}</p></li>) : <li className="text-sm text-slate-400">No Buyer Decision Brief has been persisted.</li>}</ul></div></aside>
      </section>
    </div>
  </main>;
}
