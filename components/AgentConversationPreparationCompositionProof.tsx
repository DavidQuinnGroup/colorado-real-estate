'use client';

import { useMemo, useState, type ReactNode } from 'react';

import {
  AGENT_CONVERSATION_PREPARATION_TYPES,
  buildAgentConversationPreparationPacket,
  type AgentConversationPreparationType,
} from '@/lib/agent-advisory-workbench/agentConversationPreparationComposition';
import { AGENT_CONVERSATION_PREPARATION_FIXTURES } from '@/lib/agent-advisory-workbench/agentConversationPreparationFixtures';

type FixtureKey = 'marketComplete' | 'marketIncomplete' | 'conflictingEvidence' | 'sellerMissingFacts' | 'offerProfessional';
type FixtureOption = Readonly<{ key: FixtureKey; label: string; description: string }>;

const FIXTURES_BY_TYPE: Readonly<Record<AgentConversationPreparationType, readonly FixtureOption[]>> = {
  MARKET_PLACE: [
    { key: 'marketComplete', label: 'Complete current evidence', description: 'Current synthetic market-and-place evidence with explicit limitations.' },
    { key: 'marketIncomplete', label: 'Incomplete evidence', description: 'Synthetic missing evidence that requires verification before reliance.' },
    { key: 'conflictingEvidence', label: 'Conflicting evidence', description: 'Synthetic conflict that remains visible for professional review.' },
  ],
  SELLER_UPDATE_REVIEW: [{ key: 'sellerMissingFacts', label: 'Missing factual baseline', description: 'Synthetic seller-update facts with visible missing evidence only.' }],
  OFFER_PREPARATION_REVIEW: [{ key: 'offerProfessional', label: 'Professional review required', description: 'Synthetic offer-preparation readiness with a verification handoff.' }],
};

function List({ items }: { items: readonly string[] }) {
  if (items.length === 0) return <p className="mt-2 text-sm leading-6 text-slate-400">None supplied.</p>;
  return <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-200">{items.map((item) => <li key={item}>- {item}</li>)}</ul>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border border-white/10 bg-white/[0.03] p-5"><h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">{title}</h2>{children}</section>;
}

export default function AgentConversationPreparationCompositionProof() {
  const [preparationType, setPreparationType] = useState<AgentConversationPreparationType>('MARKET_PLACE');
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>('marketComplete');
  const options = FIXTURES_BY_TYPE[preparationType];
  const packet = useMemo(() => buildAgentConversationPreparationPacket(AGENT_CONVERSATION_PREPARATION_FIXTURES[fixtureKey]), [fixtureKey]);

  function selectType(type: AgentConversationPreparationType) {
    setPreparationType(type);
    setFixtureKey(FIXTURES_BY_TYPE[type][0].key);
  }

  return (
    <main className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="agent-conversation-preparation-proof" data-agent-only="true" data-persistence="false" data-customer-data="false" data-network="false">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/70">PROJECT ATLAS / Agent Review</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Agent Conversation Preparation</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">Synthetic, local-only preparation proof. No customer, property, provider, source, CRM, or persistent context is retrieved or accepted.</p>
        </header>

        <section className="mt-6 border border-white/10 bg-white/[0.03] p-5" aria-label="Synthetic preparation selection">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Preparation type</p>
          <div className="mt-3 flex flex-wrap gap-2" data-testid="agent-preparation-type-selector">
            {AGENT_CONVERSATION_PREPARATION_TYPES.map((type) => <button key={type} type="button" onClick={() => selectType(type)} className={`border px-3 py-2 text-xs font-semibold tracking-[0.1em] ${type === preparationType ? 'border-cyan-200/60 bg-cyan-200/15 text-cyan-50' : 'border-white/15 text-slate-300 hover:border-cyan-200/40'}`}>{type}</button>)}
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Synthetic fixture</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3" data-testid="agent-synthetic-fixture-selector">
            {options.map((option) => <button key={option.key} type="button" onClick={() => setFixtureKey(option.key)} className={`border p-3 text-left ${option.key === fixtureKey ? 'border-cyan-200/60 bg-cyan-200/[0.08]' : 'border-white/15 hover:border-cyan-200/40'}`}><span className="block text-sm font-medium text-white">{option.label}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{option.description}</span></button>)}
          </div>
          <button type="button" onClick={() => { setPreparationType('MARKET_PLACE'); setFixtureKey('marketComplete'); }} className="mt-5 border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-200 hover:border-cyan-200/50" data-testid="agent-preparation-reset">Reset synthetic selection</button>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2" data-testid="agent-conversation-preparation-packet" data-readiness={packet.readiness}>
          <Section title="Preparation purpose"><p className="mt-2 text-sm leading-6 text-slate-200">{packet.purpose || 'NOT_AVAILABLE'}</p></Section>
          <Section title="Preparation type"><p className="mt-2 text-sm text-slate-200">{packet.preparationType || 'NOT_AVAILABLE'}</p></Section>
          <Section title="Packet readiness"><p className="mt-2 text-sm font-medium text-cyan-100">{packet.readiness}</p><List items={packet.reasons} /></Section>
          <Section title="Relevant context"><List items={packet.relevantContext.map((item) => `${item.label}: ${item.value || 'NOT_AVAILABLE'} (${item.classification})`)} /></Section>
          <Section title="Known evidence"><List items={packet.knownEvidence.map((item) => `${item.label}: ${item.value || 'NOT_AVAILABLE'} (${item.classification})`)} /></Section>
          <Section title="Assumptions"><List items={packet.assumptions.map((item) => `${item.label}: ${item.value || 'NOT_AVAILABLE'} (${item.classification})`)} /></Section>
          <Section title="Limitations"><List items={packet.limitations} /></Section>
          <Section title="Missing / conflicting evidence"><List items={[...packet.conflicts, ...packet.reasons.filter((reason) => reason.includes('MISSING') || reason.includes('CONFLICT'))]} /></Section>
          <Section title="Questions / items to verify"><List items={packet.openQuestions} /></Section>
          <Section title="Professional handoff categories"><div className="mt-2 space-y-4 text-sm text-slate-200">{packet.professionalHandoffs.length ? packet.professionalHandoffs.map((handoff) => <div key={handoff.id} className="border-l border-cyan-200/40 pl-3"><p className="font-medium">{handoff.role}: {handoff.questionCategory}</p><p className="mt-1 text-slate-300">{handoff.whyVerificationIsNeeded}</p><List items={[...handoff.informationToBring, ...handoff.whatReieCannotDetermine]} /></div>) : <p className="text-slate-400">No professional handoff is supplied by this synthetic fixture.</p>}</div></Section>
          <Section title="REIE surfaces to review"><p className="mt-2 text-sm text-slate-200" data-testid="agent-review-references">{packet.surfaceReferences.join(' / ') || 'NOT_AVAILABLE'}</p><p className="mt-2 text-xs leading-5 text-slate-400">Plain typed references only. No context transfer or packet navigation occurs.</p></Section>
          <Section title="Safe conversation topics"><List items={packet.safeConversationTopics} /></Section>
          <Section title="Do-not-conclude boundaries"><List items={packet.doNotConclude} /></Section>
        </div>
      </div>
    </main>
  );
}
