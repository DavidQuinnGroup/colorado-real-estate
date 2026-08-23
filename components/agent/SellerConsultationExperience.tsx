'use client';

import { ArrowRight, Compass, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import AgentBriefingComposition from '@/components/agent/AgentBriefingComposition';
import PropertyCriteriaProfileEditor from '@/components/agent/PropertyCriteriaProfileEditor';
import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import SellerConsultationPlaybook from '@/components/agent/SellerConsultationPlaybook';
import {
  AGENT_SELLER_CONSULTATION_POSITIONS,
  AGENT_SELLER_DISCUSSION_PRIORITIES,
  AGENT_SELLER_PREPARATION_CAPABILITY,
  AGENT_SELLER_PREPARATION_ROUTE,
  AGENT_SELLER_TIMING_OPTIONS,
  type AgentSellerDiscussionPriority,
  type AgentSellerPreparationRequest,
} from '@/lib/agent-advisory-workbench/agentSellerPreparationAdmission';
import { prepareAgentSellerConsultation } from '@/lib/agent-advisory-workbench/agentSellerConsultationPreparation';

const labels: Record<AgentSellerDiscussionPriority, string> = {
  SELLING_PROCESS: 'Selling process',
  TIMING: 'Timing',
  PROPERTY_CONDITION_PREPARATION: 'Property condition / preparation',
  PRICING_DISCUSSION: 'Pricing discussion',
  CURRENT_MARKET_QUESTIONS: 'Current market questions',
  PROPERTY_FACTS_RECORDS: 'Property facts / records',
  SHOWING_LAUNCH_PREPARATION: 'Showing / launch preparation',
  SELLER_PROCEEDS_FINANCIAL_QUESTIONS: 'Seller proceeds / financial questions',
  OFFER_REVIEW_PROCESS: 'Offer review process',
  DECISION_PROCESS: 'Decision process',
  REPRESENTATION_BROKERAGE_PROCESS: 'Representation / brokerage process',
  PROFESSIONAL_QUESTIONS: 'Professional questions to clarify',
};

type Position = AgentSellerPreparationRequest['position'];
type Timing = NonNullable<AgentSellerPreparationRequest['timing']>;

export default function SellerConsultationExperience() {
  const [position, setPosition] = useState<Position | null>(null);
  const [priorities, setPriorities] = useState<AgentSellerDiscussionPriority[]>([]);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [cityContext, setCityContext] = useState<AgentSellerPreparationRequest['cityContext']>(null);
  const [propertyReadiness, setPropertyReadiness] = useState<AgentSellerPreparationRequest['propertyReadiness']>(null);
  const [proceedsDiscussion, setProceedsDiscussion] = useState<AgentSellerPreparationRequest['proceedsDiscussion']>(null);
  const [preparedRequest, setPreparedRequest] = useState<AgentSellerPreparationRequest | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [message, setMessage] = useState('Choose a consultation position and at least two Seller topics to prepare the briefing.');
  const experience = useMemo(() => preparedRequest ? prepareAgentSellerConsultation(preparedRequest) : null, [preparedRequest]);
  const canPrepare = Boolean(position && priorities.length >= 2);
  const selectedTiming = AGENT_SELLER_TIMING_OPTIONS.find((option) => option.value === timing);

  function changed() {
    if (preparedRequest) {
      setNeedsUpdate(true);
      setMessage('Your selections changed. The visible briefing reflects the previous choices until you update it.');
    }
  }

  function toggle(priority: AgentSellerDiscussionPriority) {
    changed();
    setPriorities((current) => current.includes(priority) ? current.filter((value) => value !== priority) : [...current, priority]);
  }

  function prepare() {
    if (!position || priorities.length < 2) {
      setMessage('Choose a consultation position and at least two Seller topics before preparing the briefing.');
      return;
    }
    const updating = Boolean(preparedRequest);
    setPreparedRequest({
      actorIdentityType: 'HUMAN_AGENT', actorRole: 'AGENT', sessionMechanism: 'HUMAN_AGENT_SESSION',
      capability: AGENT_SELLER_PREPARATION_CAPABILITY, route: AGENT_SELLER_PREPARATION_ROUTE,
      position, priorities, timing, cityContext, propertyReadiness, proceedsDiscussion,
      customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false,
      mcpContext: false, protectedClassRequest: false, demographicInferenceRequested: false,
      suitabilityConclusionRequested: false, pricingRecommendationRequested: false, legalConclusionRequested: false,
      taxAdviceRequested: false,
    });
    setNeedsUpdate(false);
    setMessage(updating ? 'Your session-only Seller consultation briefing has been updated for the current selections.' : 'Your session-only Seller consultation briefing is ready for review.');
  }

  return <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="agent-seller-consultation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-recommendation="false" data-suitability="false" data-fair-housing-inference="false" data-same-page-decision-continuity="true">
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-white/10 pb-8">
        <AgentPreparationPageHeader pageTitle="SELLER PREPARATION" taskHeading="Prepare for a seller consultation" description="Organize an explicit, session-only Seller consultation briefing before the conversation begins." scopeNote="Use explicit context, evidence, and professional verification to prepare the consultation." />
      </header>
      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-labelledby="seller-setup-heading">
        <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Consultation setup</p><h2 id="seller-setup-heading" className={`mt-2 ${projectAtlasTitleHierarchy.selectionSection}`}>Choose what the conversation needs to emphasize</h2></div>
            <span className="text-xs text-slate-400">No information is saved</span>
          </div>
          <fieldset className="mt-6">
            <legend className={projectAtlasTitleHierarchy.selectionGroup}>Choose where this seller conversation begins</legend>
            <p className="mt-1 text-sm leading-6 text-slate-400">Choose the description that best matches the conversation you are preparing.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[[AGENT_SELLER_CONSULTATION_POSITIONS[0], 'Starting the seller conversation', 'Clarify goals, property situation, timing, process, and what should be prepared.'], [AGENT_SELLER_CONSULTATION_POSITIONS[1], 'Preparing to move toward market', 'Organize readiness questions and preparation steps before a listing plan is treated as settled.']].map(([value, title, description]) => <label key={value} className={`cursor-pointer border p-4 transition ${position === value ? 'border-cyan-200/70 bg-cyan-200/10' : 'border-white/10 bg-black/10 hover:border-white/30'}`}><input type="radio" name="seller-consultation-position" value={value} checked={position === value} onChange={() => { setPosition(value as Position); changed(); }} className="sr-only" /><span className="block text-sm font-semibold text-white">{title}</span><span className="mt-1 block text-sm leading-6 text-slate-400">{description}</span></label>)}
            </div>
          </fieldset>
          <fieldset className="mt-8">
            <legend className={projectAtlasTitleHierarchy.selectionGroup}>Choose the topics to emphasize</legend>
            <p className="mt-1 text-sm leading-6 text-slate-400">{priorities.length} selected. Every selected topic receives Priority Focus treatment; the complete Seller consultation playbook remains available.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {AGENT_SELLER_DISCUSSION_PRIORITIES.map((priority) => { const checked = priorities.includes(priority); return <label key={priority} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition ${checked ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 bg-black/10 text-slate-300'}`}><input type="checkbox" checked={checked} onChange={() => toggle(priority)} className="h-4 w-4 accent-cyan-200" /><span className="font-medium">{labels[priority]}</span></label>; })}
            </div>
          </fieldset>
          <div className="mt-7 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><h2 className="text-sm font-semibold text-white">Optional Seller context</h2><p className="mt-1 text-sm leading-6 text-slate-400">Use only explicit conversation context. These prompts do not create a property or customer record.</p></div></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Select label="City / location context" value={cityContext ?? ''} onChange={(value) => { setCityContext((value || null) as AgentSellerPreparationRequest['cityContext']); changed(); }} options={['Boulder', 'Louisville', 'Lafayette']} empty="No City chosen" />
              <Select label="When might they want to sell?" value={timing ?? ''} onChange={(value) => { setTiming((value || null) as Timing | null); changed(); }} options={AGENT_SELLER_TIMING_OPTIONS.map((option) => `${option.value}|${option.label}`)} empty="Not discussed" helper={selectedTiming?.description ?? 'Choose a clear horizon only when it has been discussed.'} />
              <Select label="Property occupancy / readiness context" value={propertyReadiness ?? ''} onChange={(value) => { setPropertyReadiness((value || null) as AgentSellerPreparationRequest['propertyReadiness']); changed(); }} options={['OWNER_OCCUPIED_REPORTED|Owner-occupied (reported)', 'VACANT_REPORTED|Vacant (reported)', 'PREPARATION_NEEDS_DISCUSSION|Preparation needs discussion']} empty="Not discussed" />
              <Select label="Known proceeds discussion" value={proceedsDiscussion ?? ''} onChange={(value) => { setProceedsDiscussion((value || null) as AgentSellerPreparationRequest['proceedsDiscussion']); changed(); }} options={['PAYOFF_OR_LIEN_QUESTION|Payoff or lien question', 'SELLING_COST_QUESTION|Selling-cost question', 'TAX_QUESTION|Tax question', 'OTHER_REPORTED|Another reported question']} empty="Not discussed" helper="Use only what was stated. Confirm financial, title, tax, and legal questions with the appropriate professional." />
            </div>
          </div>
          <PropertyCriteriaProfileEditor context="SELLER_PROPERTY_FACT" />
          <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400" aria-live="polite">{message}</p><button type="button" onClick={prepare} disabled={!canPrepare} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-seller-prepare-briefing">{preparedRequest ? 'Update my briefing' : 'Prepare my briefing'} <ArrowRight size={16} aria-hidden="true" /></button></div>
        </div>
        <aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Briefing scope"><Compass className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A focused Seller briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Review the selected priorities, then inspect the complete playbook and professional checkpoints when needed.</p></aside>
      </section>
      {!experience ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-seller-empty-state">Choose a consultation position and at least two Seller topics, then prepare your briefing.</section> : null}
      {experience?.composition && needsUpdate ? <section className="mt-8 border border-cyan-200/20 bg-cyan-100/[0.06] p-5" data-testid="agent-seller-briefing-update-state" aria-live="polite">Selections ready to update. The briefing remains visible for comparison. Select Update my briefing to regenerate it without leaving this page.</section> : null}
      {experience?.composition ? <div data-testid="agent-seller-briefing"><AgentBriefingComposition briefing={experience.composition} showNextActions={false} />{experience.playbook ? <SellerConsultationPlaybook playbook={experience.playbook} /> : null}</div> : null}
    </div>
  </main>;
}

function Select({ label, value, onChange, options, empty, helper }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; empty: string; helper?: string }) {
  return <label className="text-sm font-medium text-slate-200">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"><option value="">{empty}</option>{options.map((option) => { const [optionValue, optionLabel] = option.split('|'); return <option key={optionValue} value={optionValue}>{optionLabel ?? optionValue}</option>; })}</select>{helper ? <span className="mt-2 block text-xs font-normal leading-5 text-slate-400">{helper}</span> : null}</label>;
}
