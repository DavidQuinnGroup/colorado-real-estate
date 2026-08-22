'use client';

import Link from 'next/link';
import { ChevronDown, ClipboardList, Compass, Landmark, ListChecks } from 'lucide-react';

import type {
  AgentBuyerAgentReadyGuide,
  AgentBuyerProfessionalPlaybook,
} from '@/lib/agent-advisory-workbench/agentBuyerProfessionalPlaybook';

type BuyerConsultationPlaybookProps = {
  playbook: AgentBuyerProfessionalPlaybook;
};

function AgentReadyGuide({ guide }: { guide: AgentBuyerAgentReadyGuide }) {
  return (
    <div className="grid gap-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-300 lg:grid-cols-2">
      <div>
        <h4 className="font-semibold text-white">Key questions</h4>
        <ul className="mt-3 space-y-3">
          {guide.keyQuestions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Talking points</h4>
        <ul className="mt-3 space-y-3">
          {guide.talkingPoints.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Facts to confirm</h4>
        <ul className="mt-3 space-y-3">
          {guide.factsToConfirm.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Professional checkpoints</h4>
        <ul className="mt-3 space-y-3">
          {guide.professionalCheckpoints.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <p className="border-l border-cyan-100/30 pl-3 text-sm leading-6 text-cyan-50 lg:col-span-2">
        <span className="font-semibold">Expected outcome:</span> {guide.expectedOutcome}
      </p>
    </div>
  );
}

function PlaybookSection({
  section,
}: {
  section: AgentBuyerProfessionalPlaybook['sections'][number];
}) {
  return (
    <article
      className="border border-white/10 bg-white/[0.035] p-5 sm:p-6"
      data-testid="agent-buyer-playbook-section"
      data-agent-buyer-playbook-section={section.id}
      data-agent-buyer-playbook-emphasis={section.emphasis}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        {section.emphasis === 'SELECTED_PRIORITY' ? (
          <span className="border border-cyan-100/25 bg-cyan-100/[0.08] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
            Priority focus
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{section.summary}</p>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        {section.prompts.map((prompt) => (
          <li key={prompt} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
            <span className="pt-2 text-cyan-100" aria-hidden="true">•</span>
            <span>{prompt}</span>
          </li>
        ))}
      </ul>
      {section.guide ? (
        <details className="group mt-5 border border-white/10 bg-black/10 p-4" data-testid="agent-buyer-section-guide">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-cyan-100">
            Agent-ready questions and talking points
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="mt-5">
            <AgentReadyGuide guide={section.guide} />
          </div>
        </details>
      ) : null}
    </article>
  );
}

export default function BuyerConsultationPlaybook({
  playbook,
}: BuyerConsultationPlaybookProps) {
  const core = playbook.sections.filter((section) => section.level === 'CORE');
  const detail = playbook.sections.filter((section) => section.level === 'DETAIL');

  return (
    <section
      className="mt-5"
      aria-labelledby="buyer-consultation-playbook-heading"
      data-testid="agent-buyer-professional-playbook"
      data-agent-buyer-professional-playbook={playbook.status}
      data-agent-buyer-playbook-persistence={String(playbook.protectedBoundaries.persistence)}
      data-agent-buyer-playbook-recommendation={String(playbook.protectedBoundaries.recommendation)}
      data-agent-buyer-playbook-suitability={String(playbook.protectedBoundaries.suitability)}
      data-agent-buyer-playbook-fair-housing={String(playbook.protectedBoundaries.fairHousingInference)}
    >
      <div className="border border-cyan-200/20 bg-cyan-100/[0.045] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-cyan-100" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/80">
              Consultation playbook
            </p>
            <h2 id="buyer-consultation-playbook-heading" className="mt-1 text-xl font-semibold text-white">
              Prepare the full buyer conversation
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
          Work through the core preparation before the consultation, then open
          supporting detail when the conversation needs it. This is an Agent
          preparation tool, not a customer profile, recommendation, or
          professional conclusion.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {core.map((section) => <PlaybookSection key={section.id} section={section} />)}
      </div>

      <section className="mt-5 border border-white/10 bg-white/[0.025] p-5 sm:p-6" aria-labelledby="consultation-agenda-heading">
        <div className="flex items-center gap-3">
          <ListChecks className="h-5 w-5 text-cyan-100" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
              Conversation sequence
            </p>
            <h2 id="consultation-agenda-heading" className="mt-1 text-lg font-semibold text-white">
              Consultation conversation agenda
            </h2>
          </div>
        </div>
        <ol className="mt-5 grid gap-3 text-sm leading-6 text-slate-300 lg:grid-cols-2">
          {playbook.consultationAgenda.map((step, index) => (
            <li key={step.id} className="border-l border-cyan-100/25 pl-3">
              <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
              <span className="font-semibold text-cyan-100">{index + 1}.</span>
                <div>
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="mt-1">{step.summary}</p>
                </div>
              </div>
              <details className="group mt-3 border border-white/10 bg-black/10 p-4" data-testid="agent-buyer-agenda-guide">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-cyan-100">
                  Use in consultation
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="mt-5">
                  <AgentReadyGuide guide={step.guide} />
                </div>
              </details>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5 border border-emerald-200/20 bg-emerald-100/[0.045] p-5 sm:p-6" aria-labelledby="buyer-next-action-plan-heading">
        <div className="flex items-center gap-3">
          <Compass className="h-5 w-5 text-emerald-100" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100/80">
              Follow-through
            </p>
            <h2 id="buyer-next-action-plan-heading" className="mt-1 text-lg font-semibold text-white">
              Next action plan
            </h2>
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-white">Agent actions</h3>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
              {playbook.nextActionPlan.agentActions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Buyer discussion / clarification</h3>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
              {playbook.nextActionPlan.buyerClarifications.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Landmark className="h-5 w-5 text-amber-100" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-white">Professional verification</h3>
            </div>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
              {playbook.nextActionPlan.professionalVerification.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {playbook.nextActionPlan.atlasContinuations.length ? (
            <div>
              <h3 className="text-sm font-semibold text-white">ATLAS continuation actions</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                {playbook.nextActionPlan.atlasContinuations.map((action) => (
                  <li key={action.id}>
                    {action.href ? (
                      <Link href={action.href} prefetch={false} className="font-semibold text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-white">
                        {action.text}
                      </Link>
                    ) : action.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {detail.length ? (
        <details className="group mt-5 border border-white/10 bg-white/[0.025]" data-testid="agent-buyer-playbook-detail">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Supporting preparation</p>
              <h2 className="mt-1 text-lg font-semibold text-white">Process, verification, and offer detail</h2>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="grid gap-5 border-t border-white/10 p-5 sm:p-6 xl:grid-cols-2">
            {detail.map((section) => <PlaybookSection key={section.id} section={section} />)}
          </div>
        </details>
      ) : null}
    </section>
  );
}
