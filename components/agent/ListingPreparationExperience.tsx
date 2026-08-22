'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ClipboardCheck, Compass, FileSearch, ShieldCheck, SlidersHorizontal } from 'lucide-react';

import AgentBriefingComposition from '@/components/agent/AgentBriefingComposition';
import ListingPreparationPlaybook from '@/components/agent/ListingPreparationPlaybook';
import { evaluateAgentListingEvidenceAdmission, type AgentListingEvidenceAdmissionResult } from '@/lib/agent-advisory-workbench/agentListingEvidenceAdmission';
import { AGENT_LISTING_LAUNCH_HORIZONS, AGENT_LISTING_PREPARATION_CAPABILITY, AGENT_LISTING_PREPARATION_PRIORITIES, AGENT_LISTING_PREPARATION_ROUTE, AGENT_LISTING_PREPARATION_POSITIONS, type AgentListingLaunchHorizon, type AgentListingPreparationPriority, type AgentListingPreparationRequest } from '@/lib/agent-advisory-workbench/agentListingPreparationAdmission';
import { prepareAgentListingConsultation } from '@/lib/agent-advisory-workbench/agentListingConsultationPreparation';
import type { AgentPropertyConversationCandidate, AgentPropertyConversationCandidateSummary } from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparation';

const topicLabels: Record<AgentListingPreparationPriority, string> = {
  PRE_LISTING_READINESS: 'Pre-listing readiness', PROPERTY_FACTS_RECORDS: 'Property facts & records', CONDITION_REPAIRS_IMPROVEMENTS: 'Condition, repairs & improvements', PRESENTATION_MEDIA_ACCESS: 'Presentation, media & access', DISCLOSURES_DOCUMENTS: 'Disclosures & documents', PRICING_MARKET_INPUTS: 'Pricing & market inputs', MARKETING_LISTING_DATA_PREPARATION: 'Marketing & listing-data preparation', LAUNCH_CHECKPOINTS: 'Launch & showing checkpoints', PROFESSIONAL_VERIFICATION: 'Professional verification',
};

function candidateLabel(candidate: AgentPropertyConversationCandidateSummary) {
  const { address, city, state, zip } = candidate.property;
  return `${address || 'Property'} · ${city || 'Colorado'}, ${state || 'CO'} ${zip || ''}`.trim();
}

function formatObservedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function EvidenceReadiness({ evidence }: { evidence: AgentListingEvidenceAdmissionResult }) {
  if (!evidence.admitted || !evidence.identity) {
    return <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.05] p-5" data-testid="agent-listing-evidence-not-admitted" aria-live="polite"><p className="text-sm font-semibold text-amber-100">Property evidence was not admitted</p><p className="mt-2 text-sm leading-6 text-amber-50/80">This Listing briefing remains generic. Resolve the listed identity, provenance, source, rights, freshness, jurisdiction, or conflict gate before using property evidence.</p><ul className="mt-3 space-y-1 text-sm text-amber-50/80">{evidence.reasons.map((reason) => <li key={reason}>{reason.replaceAll('_', ' ').toLowerCase()}</li>)}</ul></section>;
  }

  const source = evidence.evidence[0];
  return <section className="mt-8 border border-cyan-200/20 bg-cyan-100/[0.04]" data-testid="agent-listing-evidence-readiness" data-admission-state={evidence.state} data-canonical-property-reference={evidence.identity.canonicalPropertyReference}>
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Governed property evidence</p><h2 className="mt-1 text-lg font-semibold text-white">What we know for this Listing preparation</h2><p className="mt-2 text-sm leading-6 text-slate-300">{evidence.identity.address}</p><p className="mt-1 text-xs leading-5 text-slate-400">Canonical reference: {evidence.identity.canonicalPropertyReference} · Listing reference: {evidence.identity.listingReference}</p></div><span className="w-fit border border-amber-100/25 bg-amber-100/[0.08] px-3 py-1 text-xs font-semibold text-amber-50">Admitted with limitations</span></div>
    <div className="grid gap-px border-y border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">{evidence.evidence.map((item) => <div key={item.evidenceId} className="bg-[#0b171c] px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{item.evidenceId.replace('listing-', '')}</p><p className="mt-2 text-sm leading-6 text-slate-200">{item.assertion}</p></div>)}</div>
    <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2"><div><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-amber-100" aria-hidden="true" /><h3 className="text-base font-semibold text-white">What needs verification</h3></div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{evidence.verificationRequired.map((item) => <li key={item}>{item}</li>)}</ul></div><div><div className="flex items-center gap-3"><FileSearch className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h3 className="text-base font-semibold text-white">What to prepare next</h3></div><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{evidence.professionalCheckpoints.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div></div>
    <details className="border-t border-white/10" data-testid="agent-listing-evidence-source-detail"><summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-cyan-100 sm:px-6">Source, freshness &amp; limitations</summary><div className="grid gap-5 border-t border-white/10 px-5 py-5 text-sm leading-6 text-slate-300 sm:px-6 lg:grid-cols-2"><div><p className="font-medium text-white">Source reference</p><p className="mt-1">{source.citation}</p><p className="mt-4 font-medium text-white">Observed date &amp; jurisdiction</p><p className="mt-1">Observed {formatObservedAt(source.observedAt)} · {evidence.identity.jurisdiction}</p><p className="mt-4 font-medium text-white">Use posture</p><p className="mt-1">Private Agent listing preparation only. Direct verification is required before reliance.</p></div><div><p className="font-medium text-white">Still not admitted</p><ul className="mt-1 space-y-2">{evidence.missingEvidence.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-4 font-medium text-white">Provenance</p><p className="mt-1">{evidence.identity.provenance}</p></div></div></details>
  </section>;
}

export default function ListingPreparationExperience() {
  const [position, setPosition] = useState<AgentListingPreparationRequest['position']>('AFTER_SELLER_ENGAGEMENT');
  const [identifiedSellerPropertyConfirmed, setIdentifiedSellerPropertyConfirmed] = useState(false);
  const [priorities, setPriorities] = useState<AgentListingPreparationPriority[]>(['PRE_LISTING_READINESS', 'PROPERTY_FACTS_RECORDS']);
  const [launchHorizon, setLaunchHorizon] = useState<AgentListingLaunchHorizon | null>(null);
  const [candidates, setCandidates] = useState<readonly AgentPropertyConversationCandidateSummary[]>([]);
  const [candidateLoadState, setCandidateLoadState] = useState<'LOADING' | 'READY' | 'FAILED'>('LOADING');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [preparedEvidence, setPreparedEvidence] = useState<AgentListingEvidenceAdmissionResult | null>(null);
  const [preparedRequest, setPreparedRequest] = useState<AgentListingPreparationRequest | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadCandidates() {
      try {
        const response = await fetch('/api/agent/prepare/property', { cache: 'no-store', credentials: 'same-origin' });
        const payload = await response.json() as { candidates?: AgentPropertyConversationCandidateSummary[] };
        if (!response.ok || !payload.candidates) throw new Error('Property selector unavailable.');
        if (active) { setCandidates(payload.candidates); setCandidateLoadState('READY'); }
      } catch {
        if (active) setCandidateLoadState('FAILED');
      }
    }
    void loadCandidates();
    return () => { active = false; };
  }, []);

  const request: AgentListingPreparationRequest = {
    actorIdentityType: 'HUMAN_AGENT', actorRole: 'AGENT', sessionMechanism: 'HUMAN_AGENT_SESSION', capability: AGENT_LISTING_PREPARATION_CAPABILITY, route: AGENT_LISTING_PREPARATION_ROUTE, position, identifiedSellerPropertyConfirmed, priorities, launchHorizon,
    customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false, mcpContext: false, propertyIdentityProvided: false, mlsDataRequested: false, publicActivationRequested: false, pricingRecommendationRequested: false, marketingRecommendationRequested: false, legalConclusionRequested: false, taxAdviceRequested: false, protectedClassRequest: false, demographicInferenceRequested: false, suitabilityConclusionRequested: false,
  };
  const experience = preparedRequest ? prepareAgentListingConsultation(preparedRequest) : null;
  const canPrepare = identifiedSellerPropertyConfirmed && priorities.length >= 2;
  const selectedCandidate = useMemo(() => candidates.find((candidate) => candidate.property.slug === selectedSlug) || null, [candidates, selectedSlug]);
  const changed = () => setNeedsUpdate(Boolean(preparedRequest));
  const togglePriority = (topic: AgentListingPreparationPriority) => { setPriorities((current) => current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]); changed(); };
  const selectedHorizon = AGENT_LISTING_LAUNCH_HORIZONS.find((option) => option.value === launchHorizon);

  async function prepare() {
    if (!canPrepare) return;
    setIsPreparing(true); setEvidenceError(null); setPreparedEvidence(null);
    try {
      if (selectedCandidate) {
        const response = await fetch(`/api/agent/prepare/property?property=${encodeURIComponent(selectedCandidate.property.slug)}`, { cache: 'no-store', credentials: 'same-origin' });
        const payload = await response.json() as { candidate?: AgentPropertyConversationCandidate; error?: string };
        if (!response.ok || !payload.candidate) throw new Error(payload.error || 'Property evidence is unavailable.');
        setPreparedEvidence(evaluateAgentListingEvidenceAdmission({ candidate: payload.candidate, actorRole: 'AGENT', sessionMechanism: 'HUMAN_AGENT_SESSION', persistenceRequested: false, providerRuntimeRequired: false, publicActivationRequested: false }));
      }
    } catch {
      setEvidenceError('The selected property evidence is unavailable. The generic Listing briefing remains available; verify the property through the appropriate current source before relying on it.');
    } finally {
      setPreparedRequest(request); setNeedsUpdate(false); setIsPreparing(false);
    }
  }

  return <main className="min-h-full bg-[#071014] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="agent-listing-preparation-experience" data-agent-only="true" data-persistence="false" data-same-page-decision-continuity="true" data-listing-identity-retention="false" data-listing-mls-activity="false" data-listing-public-activation="false" data-provider-activity="false" data-customer-data="false">
    <div className="mx-auto max-w-6xl">
      <header className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Agent workspace / Listing preparation</p><h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Prepare a seller property for the next reviewed decision</h1><p className="mt-4 text-base leading-7 text-slate-300">Organize the questions, admitted evidence, and professional checkpoints that may need attention after Seller engagement. This private workspace is session-only: it does not retain a seller or property identity, create a listing, use MLS data, publish marketing, or authorize launch activity.</p></header>
      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-label="Listing preparation choices"><div className="border border-white/10 bg-[#0b171c] p-5 sm:p-6"><div className="flex items-start gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 text-cyan-100" aria-hidden="true" /><div><h2 className="text-lg font-semibold text-white">Set preparation emphasis</h2><p className="mt-1 text-sm leading-6 text-slate-400">Select every topic that deserves emphasis. Selections are unlimited, retain the full playbook, and do not change with selection order.</p></div></div><fieldset className="mt-6"><legend className="text-sm font-semibold text-white">Preparation position</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{AGENT_LISTING_PREPARATION_POSITIONS.map((option) => <label key={option} className="flex cursor-pointer items-start gap-3 border border-white/10 bg-black/10 p-4"><input type="radio" name="listing-position" checked={position === option} onChange={() => { setPosition(option); changed(); }} className="mt-1 h-4 w-4 accent-cyan-200" /><span><span className="block text-sm font-semibold text-white">{option === 'AFTER_SELLER_ENGAGEMENT' ? 'After Seller engagement' : 'Moving toward a possible launch'}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{option === 'AFTER_SELLER_ENGAGEMENT' ? 'Organize the post-consultation work without assuming a listing plan.' : 'Sequence open readiness checks without authorizing launch activity.'}</span></span></label>)}</div></fieldset><fieldset className="mt-7 border-t border-white/10 pt-6"><legend className="text-sm font-semibold text-white">Identified Seller property</legend><label className="mt-3 flex cursor-pointer items-start gap-3 border border-white/10 bg-black/10 p-4"><input type="checkbox" checked={identifiedSellerPropertyConfirmed} onChange={(event) => { setIdentifiedSellerPropertyConfirmed(event.target.checked); changed(); }} className="mt-1 h-4 w-4 accent-cyan-200" /><span><span className="block text-sm font-semibold text-white">I have confirmed there is an identified Seller property for this private preparation session.</span><span className="mt-1 block text-xs leading-5 text-slate-400">Do not enter an address, owner, MLS number, customer information, or other property identity here. This confirmation is not retained.</span></span></label></fieldset><fieldset className="mt-7 border-t border-white/10 pt-6" data-testid="agent-listing-evidence-selector"><legend className="text-sm font-semibold text-white">Optional governed property evidence</legend><p className="mt-1 text-sm leading-6 text-slate-400">Choose only an existing supported repository property to add a limited, private evidence-readiness view. This is not MLS activity and does not retain the selection.</p><div className="mt-4 grid gap-3" data-load-state={candidateLoadState}>{candidateLoadState === 'LOADING' ? <p className="border border-dashed border-white/15 px-4 py-4 text-sm text-slate-400">Loading supported repository properties.</p> : null}{candidateLoadState === 'FAILED' ? <p className="border border-dashed border-amber-200/30 px-4 py-4 text-sm text-amber-100">Supported repository properties are unavailable. Continue with the generic Listing briefing or refresh to retry.</p> : null}{candidateLoadState === 'READY' ? candidates.slice(0, 12).map((candidate) => <label key={candidate.property.slug} className="flex cursor-pointer items-center justify-between gap-4 border border-white/10 bg-black/10 p-4"><span className="min-w-0"><span className="block truncate text-sm font-medium text-white">{candidateLabel(candidate)}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{candidate.property.propertyType || 'Property type to verify'} · {candidate.property.status}</span></span><input type="radio" name="listing-evidence-property" value={candidate.property.slug} checked={selectedSlug === candidate.property.slug} onChange={() => { setSelectedSlug(candidate.property.slug); setPreparedEvidence(null); changed(); }} className="h-4 w-4 shrink-0 accent-cyan-200" /></label>) : null}</div></fieldset><fieldset className="mt-7 border-t border-white/10 pt-6"><legend className="text-sm font-semibold text-white">Choose the topics to emphasize</legend><p className="mt-1 text-sm leading-6 text-slate-400">Select at least two. Every applicable topic may receive Priority Focus.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{AGENT_LISTING_PREPARATION_PRIORITIES.map((topic) => <label key={topic} className="flex cursor-pointer items-start gap-3 border border-white/10 bg-black/10 p-4"><input type="checkbox" checked={priorities.includes(topic)} onChange={() => togglePriority(topic)} className="mt-1 h-4 w-4 accent-cyan-200" /><span className="text-sm font-medium leading-6 text-slate-200">{topicLabels[topic]}</span></label>)}</div></fieldset><div className="mt-7 border-t border-white/10 pt-6"><div className="flex items-center gap-3"><SlidersHorizontal className="h-5 w-5 text-cyan-100" aria-hidden="true" /><div><h2 className="text-sm font-semibold text-white">Optional timing context</h2><p className="mt-1 text-sm leading-6 text-slate-400">Use only a stated preparation horizon. It remains separate from launch authority.</p></div></div><label className="mt-4 block text-sm font-medium text-slate-200">Possible preparation horizon<select value={launchHorizon ?? ''} onChange={(event) => { setLaunchHorizon((event.target.value || null) as AgentListingLaunchHorizon | null); changed(); }} className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"><option value="">Not discussed</option>{AGENT_LISTING_LAUNCH_HORIZONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><span className="mt-2 block text-xs font-normal leading-5 text-slate-400">{selectedHorizon?.description ?? 'Choose a horizon only when it has been explicitly discussed.'}</span></label></div><div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-400" aria-live="polite">{experience?.humanState.message ?? 'Confirm the property context and choose at least two Listing topics to prepare the briefing.'}</p><button type="button" onClick={() => void prepare()} disabled={!canPrepare || isPreparing} className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100" data-testid="agent-listing-prepare-briefing">{isPreparing ? 'Preparing briefing' : preparedRequest ? 'Update my briefing' : 'Prepare my briefing'} <ArrowRight size={16} aria-hidden="true" /></button></div></div><aside className="border border-white/10 bg-[#0b171c] p-5" aria-label="Listing briefing scope"><ShieldCheck className="h-5 w-5 text-cyan-100" aria-hidden="true" /><h2 className="mt-4 text-base font-semibold text-white">A bounded Listing briefing</h2><p className="mt-2 text-sm leading-6 text-slate-400">Questions, limited admitted facts, limitations, and professional checkpoints only. No pricing, marketing, MLS, listing, or launch action is available here.</p></aside></section>
      {!experience ? <section className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400" data-testid="agent-listing-empty-state">Confirm the identified Seller property and choose at least two Listing topics, then prepare your briefing.</section> : null}
      {experience?.composition && needsUpdate ? <section className="mt-8 border border-cyan-200/20 bg-cyan-100/[0.06] p-5" data-testid="agent-listing-briefing-update-state" aria-live="polite">Selections ready to update. The briefing remains visible for comparison. Select Update my briefing to regenerate it without leaving this page.</section> : null}
      {evidenceError ? <section className="mt-8 border border-amber-200/20 bg-amber-100/[0.05] p-5 text-sm leading-6 text-amber-50/80" data-testid="agent-listing-evidence-error">{evidenceError}</section> : null}
      {experience?.composition ? <div data-testid="agent-listing-briefing"><AgentBriefingComposition briefing={experience.composition} showNextActions={false} />{preparedEvidence ? <EvidenceReadiness evidence={preparedEvidence} /> : null}{experience.playbook ? <ListingPreparationPlaybook playbook={experience.playbook} /> : null}</div> : null}
      <section className="mt-5 flex items-start gap-3 border border-amber-100/20 bg-amber-100/[0.04] p-5 text-sm leading-6 text-slate-300"><Compass className="mt-0.5 h-5 w-5 shrink-0 text-amber-100" aria-hidden="true" /><p>Unknown rights, stale or conflicting material, ambiguous identity, unsupported jurisdiction, editorial-only context, and unverified professional questions fail closed. Existing routes and source registry metadata do not create permission to use, publish, or activate material.</p></section>
    </div>
  </main>;
}
