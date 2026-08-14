import type { Metadata } from 'next';

import {
  buildAgentBriefingPreparationPacket,
  type AgentBriefingPreparationInput,
  type AgentBriefingPacket,
} from '@/lib/agentBriefingPreparation';

type Scenario = 'ready' | 'incomplete' | 'blocked';
type SearchValue = string | string[] | undefined;

type AgentBriefingPreparationPageProps = {
  searchParams?: Promise<{ scenario?: SearchValue }>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Briefing Preparation | REIE Admin',
  description: 'Protected, read-only internal preview for the evidence-bound Agent Briefing Packet.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const GENERATED_AT = '2026-08-14T12:00:00.000Z';

function scalar(value: SearchValue) {
  return typeof value === 'string' ? value : null;
}

function scenarioFrom(value: SearchValue): Scenario {
  const scenario = scalar(value);
  if (scenario === 'ready' || scenario === 'incomplete' || scenario === 'blocked') return scenario;
  return 'blocked';
}

function demoInput(scenario: Scenario): AgentBriefingPreparationInput {
  if (scenario === 'incomplete') {
    return {
      generatedAt: GENERATED_AT,
      briefingType: 'MARKET_PLACE',
      purpose: 'Review a current-state internal market-and-place evidence example with incomplete evidence.',
      evidenceSections: [{
        id: 'incomplete-market-example',
        title: 'Incomplete market example',
        sourceIdentity: 'REIE controlled demo source',
        evidence: [
          { label: 'Pending market evidence', value: null, state: 'UNKNOWN' },
          { label: 'Unavailable market evidence', value: null, state: 'NOT_AVAILABLE' },
          { label: 'Unverified market evidence', value: null, state: 'NOT_VERIFIED' },
        ],
        limitations: ['This controlled demo intentionally contains incomplete evidence.'],
        verificationRequirements: ['Verify each missing item through an appropriate authorized source before relying on it.'],
      }],
    };
  }

  if (scenario === 'blocked') {
    return {
      generatedAt: GENERATED_AT,
      briefingType: 'MARKET_PLACE',
      purpose: 'Demonstrate the internal fair-housing fail-closed posture.',
      evidenceSections: [{
        id: 'blocked-fair-housing-example',
        title: 'Blocked evidence example',
        sourceIdentity: 'REIE controlled demo source',
        visibleDate: '2026-08-14',
        effectiveDate: '2026-08-14',
        evidence: [{ label: 'Neighborhood suitability', value: 'Ideal for families', state: 'FACTUAL_SUPPLIED' }],
        limitations: ['This controlled demo is intentionally prohibited and must remain unavailable for briefing use.'],
        verificationRequirements: ['Use neutral objective sources and retain human fair-housing responsibility.'],
      }],
    };
  }

  return {
    generatedAt: GENERATED_AT,
    briefingType: 'MARKET_PLACE',
    purpose: 'Prepare neutral current-state internal market-and-place evidence for an agent meeting.',
    evidenceSections: [
      {
        id: 'market-snapshot-example',
        title: 'Current market example',
        sourceIdentity: 'REIE controlled demo market source',
        visibleDate: '2026-08-14',
        effectiveDate: '2026-08-01',
        evidence: [
          { label: 'Inventory context', value: 'Supplied current-state context', state: 'FACTUAL_SUPPLIED' },
          { label: 'Prepared ratio context', value: '3.2', state: 'CALCULATED_SUPPLIED' },
        ],
        limitations: ['The source/date posture must be reviewed before any external use.'],
        verificationRequirements: ['Confirm the briefing purpose and source dates before discussing this section.'],
      },
      {
        id: 'place-context-example',
        title: 'Place context example',
        sourceIdentity: 'REIE controlled demo place source',
        visibleDate: '2026-08-14',
        effectiveDate: '2026-08-08',
        evidence: [{ label: 'Objective place reference', value: 'Supplied neutral reference', state: 'FACTUAL_SUPPLIED' }],
        limitations: ['Place context remains source-bound and is not suitability guidance.'],
        verificationRequirements: ['Refer place-specific questions to suitable objective sources.'],
      },
    ],
  };
}

function ScenarioLink({ scenario, current }: { scenario: Scenario; current: Scenario }) {
  const selected = scenario === current;
  return (
    <a
      href={`/admin/agent-briefing-preparation?scenario=${scenario}`}
      className={`border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${selected ? 'border-cyan-200/60 bg-cyan-200/15 text-cyan-50' : 'border-white/15 text-slate-300 hover:border-cyan-200/40'}`}
    >
      {scenario}
    </a>
  );
}

function BoundaryList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </section>
  );
}

function PacketPreview({ packet }: { packet: AgentBriefingPacket }) {
  const failed = packet.status === 'FAIL_CLOSED';

  return (
    <div className="mt-8 space-y-6" data-testid="agent-briefing-preparation-packet" data-agent-briefing-status={packet.status}>
      <section className="border border-cyan-200/30 bg-cyan-200/[0.07] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">INTERNAL AGENT PREPARATION ONLY</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Evidence-Bound Current-State Agent Briefing</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
          Current-state internal preparation only — no history, comparison, trend, or change analysis.
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-slate-400">Packet status</dt><dd className="mt-1 font-medium text-cyan-100">{packet.status}</dd></div>
          <div><dt className="text-slate-400">Readiness</dt><dd className="mt-1 font-medium text-cyan-100">{packet.readiness}</dd></div>
          <div><dt className="text-slate-400">Briefing type</dt><dd className="mt-1 font-medium text-cyan-100">{packet.briefingType || 'NOT_AVAILABLE'}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-slate-300">Internal purpose: {packet.purpose || 'NOT_AVAILABLE'}</p>
      </section>

      {failed ? (
        <section className="border border-amber-200/40 bg-amber-200/[0.08] p-5" data-testid="agent-briefing-fail-closed">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">Fail closed — do not use this evidence for briefing talking points</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Canonical public-trust boundary blocked this demo input.</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200">
            {packet.failureReasons.map((reason) => <li key={reason}>• {reason}</li>)}
          </ul>
        </section>
      ) : (
        <>
          <section className="space-y-5" data-testid="agent-briefing-evidence-sections">
            {packet.sections.map((section) => (
              <article key={section.id} className="border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75">Evidence section</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{section.title}</h2>
                  </div>
                  <span className="border border-amber-200/30 px-2 py-1 text-xs font-semibold text-amber-100">{section.completeness}</span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="text-slate-400">Source identity</dt><dd className="mt-1 text-slate-100">{section.sourceIdentity || 'NOT_AVAILABLE'}</dd></div>
                  <div><dt className="text-slate-400">Visible date</dt><dd className="mt-1 text-slate-100">{section.visibleDate || 'NOT_AVAILABLE'}</dd></div>
                  <div><dt className="text-slate-400">Effective date</dt><dd className="mt-1 text-slate-100">{section.effectiveDate || 'NOT_AVAILABLE'}</dd></div>
                </dl>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.12em] text-slate-400"><tr><th className="pb-3 pr-4">Evidence</th><th className="pb-3 pr-4">Value</th><th className="pb-3">Canonical state</th></tr></thead>
                    <tbody className="divide-y divide-white/10 text-slate-200">
                      {section.evidence.map((item) => <tr key={`${section.id}-${item.label}`}><td className="py-3 pr-4 font-medium">{item.label}</td><td className="py-3 pr-4">{item.value || 'NOT_AVAILABLE'}</td><td className="py-3 text-cyan-100">{item.state}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div><h3 className="text-sm font-semibold text-white">Limitations</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{section.limitations.map((item) => <li key={item}>• {item}</li>)}</ul></div>
                  <div><h3 className="text-sm font-semibold text-white">Verification requirements</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-slate-300">{section.verificationRequirements.map((item) => <li key={item}>• {item}</li>)}</ul></div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <BoundaryList title="Missing / incomplete evidence posture" items={packet.missingEvidence.length ? packet.missingEvidence : ['No incomplete evidence is reported by the canonical packet.']} />
            <BoundaryList title="Neutral internal talking-point inputs" items={packet.internalTalkingPointInputs.length ? packet.internalTalkingPointInputs : ['No talking points are available from incomplete evidence.']} />
          </section>
          <BoundaryList title="Review questions" items={packet.reviewQuestions} />
        </>
      )}

      <section className="border border-white/10 bg-white/[0.03] p-5" data-testid="agent-briefing-human-boundary">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Human professional responsibility</p>
        <p className="mt-3 text-sm leading-6 text-slate-200">
          Managing-broker and human professionals retain brokerage policy, supervision, legal, compliance, fiduciary, pricing, negotiation, offer, suitability, required-training, and client-specific judgment.
        </p>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <BoundaryList title="Canonical professional boundary" items={packet.professionalBoundary} />
        <BoundaryList title="Canonical fair-housing / public-trust boundary" items={packet.fairHousingBoundary} />
      </section>
      <BoundaryList title="Human review checklist" items={packet.humanReviewChecklist} />
    </div>
  );
}

export default async function AgentBriefingPreparationPage({ searchParams }: AgentBriefingPreparationPageProps) {
  const params = searchParams ? await searchParams : {};
  const scenario = scenarioFrom(params.scenario);
  const packet = buildAgentBriefingPreparationPacket(demoInput(scenario));

  return (
    <main className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="agent-briefing-preparation-page" data-agent-briefing-route="/admin/agent-briefing-preparation" data-agent-briefing-internal-only="true" data-agent-briefing-persistence="false" data-agent-briefing-customer="false">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/70">PROJECT ATLAS / Agent Review</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">Fixture/demo-only preview. No live REIE, provider, customer, or property evidence is retrieved or accepted.</p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Controlled demo scenarios">
            <ScenarioLink scenario="ready" current={scenario} />
            <ScenarioLink scenario="incomplete" current={scenario} />
            <ScenarioLink scenario="blocked" current={scenario} />
          </nav>
        </header>
        <PacketPreview packet={packet} />
      </div>
    </main>
  );
}
