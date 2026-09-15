"use client";

import { ArrowRight, Compass, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import AgentBriefingComposition from "@/components/agent/AgentBriefingComposition";
import PropertyCriteriaProfileEditor from "@/components/agent/PropertyCriteriaProfileEditor";
import { PreparationField, PreparationSessionStatus, PreparationStartingStateOption, PreparationTopicOption, preparationWorkspaceStyles as styles } from "@/components/agent/PreparationWorkspace";
import SellerConsultationPlaybook from "@/components/agent/SellerConsultationPlaybook";
import {
  AGENT_SELLER_CONSULTATION_POSITIONS,
  AGENT_SELLER_DISCUSSION_PRIORITIES,
  AGENT_SELLER_PREPARATION_CAPABILITY,
  AGENT_SELLER_PREPARATION_ROUTE,
  AGENT_SELLER_TIMING_OPTIONS,
  type AgentSellerDiscussionPriority,
  type AgentSellerPreparationRequest,
} from "@/lib/agent-advisory-workbench/agentSellerPreparationAdmission";
import { prepareAgentSellerConsultation } from "@/lib/agent-advisory-workbench/agentSellerConsultationPreparation";

const labels: Record<AgentSellerDiscussionPriority, string> = {
  SELLING_PROCESS: "Selling process", TIMING: "Timing", PROPERTY_CONDITION_PREPARATION: "Property condition / preparation", PRICING_DISCUSSION: "Pricing discussion", CURRENT_MARKET_QUESTIONS: "Current market questions", PROPERTY_FACTS_RECORDS: "Property facts / records", SHOWING_LAUNCH_PREPARATION: "Showing / launch preparation", SELLER_PROCEEDS_FINANCIAL_QUESTIONS: "Seller proceeds / financial questions", OFFER_REVIEW_PROCESS: "Offer review process", DECISION_PROCESS: "Decision process", REPRESENTATION_BROKERAGE_PROCESS: "Representation / brokerage process", PROFESSIONAL_QUESTIONS: "Professional questions to clarify",
};

type Position = AgentSellerPreparationRequest["position"];
type Timing = NonNullable<AgentSellerPreparationRequest["timing"]>;

export default function SellerConsultationExperience() {
  const [position, setPosition] = useState<Position | null>(null);
  const [priorities, setPriorities] = useState<AgentSellerDiscussionPriority[]>([]);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [cityContext, setCityContext] = useState<AgentSellerPreparationRequest["cityContext"]>(null);
  const [propertyReadiness, setPropertyReadiness] = useState<AgentSellerPreparationRequest["propertyReadiness"]>(null);
  const [proceedsDiscussion, setProceedsDiscussion] = useState<AgentSellerPreparationRequest["proceedsDiscussion"]>(null);
  const [preparedRequest, setPreparedRequest] = useState<AgentSellerPreparationRequest | null>(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [message, setMessage] = useState("Choose a consultation position and at least two Seller topics to prepare the briefing.");
  const experience = useMemo(() => preparedRequest ? prepareAgentSellerConsultation(preparedRequest) : null, [preparedRequest]);
  const canPrepare = Boolean(position && priorities.length >= 2);
  const selectedTiming = AGENT_SELLER_TIMING_OPTIONS.find((option) => option.value === timing);

  function changed() {
    if (!preparedRequest) return;
    setNeedsUpdate(true);
    setMessage("Your selections changed. The visible briefing reflects the previous choices until you update it.");
  }

  function toggle(priority: AgentSellerDiscussionPriority) {
    changed();
    setPriorities((current) => current.includes(priority) ? current.filter((value) => value !== priority) : [...current, priority]);
  }

  function prepare() {
    if (!position || priorities.length < 2) { setMessage("Choose a consultation position and at least two Seller topics before preparing the briefing."); return; }
    const updating = Boolean(preparedRequest);
    setPreparedRequest({
      actorIdentityType: "HUMAN_AGENT", actorRole: "AGENT", sessionMechanism: "HUMAN_AGENT_SESSION", capability: AGENT_SELLER_PREPARATION_CAPABILITY, route: AGENT_SELLER_PREPARATION_ROUTE,
      position, priorities, timing, cityContext, propertyReadiness, proceedsDiscussion, customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false, mcpContext: false, protectedClassRequest: false, demographicInferenceRequested: false, suitabilityConclusionRequested: false, pricingRecommendationRequested: false, legalConclusionRequested: false, taxAdviceRequested: false,
    });
    setNeedsUpdate(false);
    setMessage(updating ? "Your session-only Seller consultation briefing has been updated for the current selections." : "Your session-only Seller consultation briefing is ready for review.");
  }

  return <main className={`${styles.page} atlas-agent-page-canvas`} data-testid="agent-seller-consultation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-recommendation="false" data-suitability="false" data-fair-housing-inference="false" data-same-page-decision-continuity="true">
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div><p className={styles.eyebrow}>Project Atlas / Agent Workspace</p><p className={styles.pageLabel}>SELLER PREPARATION</p><h1 className={styles.pageTitle}>Prepare for a seller consultation</h1><p className={styles.pageDescription}>Organize an explicit, session-only Seller consultation briefing before the conversation begins.</p></div>
        <p className={styles.scopeNote}>Use explicit context, evidence, and professional verification to prepare the consultation.</p>
      </header>

      <section className={styles.workspaceGrid} aria-labelledby="seller-setup-heading">
        <div className={styles.workspace}>
          <section className={`${styles.section} ${styles.consultationSetup}`}>
            <div className={styles.sectionHeader}><p className={styles.sectionEyebrow}>Consultation setup</p><PreparationSessionStatus /><h2 id="seller-setup-heading" className={styles.sectionTitle}>Choose what the conversation needs to emphasize</h2></div>
            <fieldset className={styles.flatSection}>
              <legend className={styles.sectionTitle}>Choose where this seller conversation begins</legend>
              <p className={styles.sectionCopy}>Choose the description that best matches the conversation you are preparing.</p>
              <div className={styles.optionGrid}>
                <PreparationStartingStateOption name="seller-consultation-position" value={AGENT_SELLER_CONSULTATION_POSITIONS[0]} checked={position === AGENT_SELLER_CONSULTATION_POSITIONS[0]} onChange={() => { setPosition(AGENT_SELLER_CONSULTATION_POSITIONS[0]); changed(); }} title="Starting the seller conversation" description="Clarify goals, property situation, timing, process, and what should be prepared." />
                <PreparationStartingStateOption name="seller-consultation-position" value={AGENT_SELLER_CONSULTATION_POSITIONS[1]} checked={position === AGENT_SELLER_CONSULTATION_POSITIONS[1]} onChange={() => { setPosition(AGENT_SELLER_CONSULTATION_POSITIONS[1]); changed(); }} title="Preparing to move toward market" description="Organize readiness questions and preparation steps before a listing plan is treated as settled." />
              </div>
            </fieldset>
            <fieldset className={styles.flatSection}>
              <legend className={styles.sectionTitle}>Choose the topics to emphasize</legend>
              <p className={styles.sectionCopy}>{priorities.length} selected. Every selected topic receives Priority Focus treatment; the complete Seller consultation playbook remains available.</p>
              <div className={styles.topicGrid}>{AGENT_SELLER_DISCUSSION_PRIORITIES.map((priority) => <PreparationTopicOption key={priority} checked={priorities.includes(priority)} onChange={() => toggle(priority)} label={labels[priority]} />)}</div>
            </fieldset>
          </section>

          <section className={styles.section} aria-labelledby="seller-context-heading">
            <div className={styles.sectionHeader}><div><p className={styles.sectionEyebrow}>Optional Seller context</p><h2 id="seller-context-heading" className={styles.sectionTitle}>Use only explicit conversation context</h2></div><SlidersHorizontal className={styles.guidanceIcon} size={20} aria-hidden="true" /></div>
            <p className={styles.sectionCopy}>These prompts do not create a property or customer record.</p>
            <div className={styles.contextGrid}>
              <PreparationField label="City / location context"><select value={cityContext ?? ""} onChange={(event) => { setCityContext((event.target.value || null) as AgentSellerPreparationRequest["cityContext"]); changed(); }} className={styles.select}><option value="">No City chosen</option>{["Boulder", "Louisville", "Lafayette"].map((value) => <option key={value} value={value}>{value}</option>)}</select></PreparationField>
              <PreparationField label="When might they want to sell?" helper={selectedTiming?.description ?? "Choose a clear horizon only when it has been discussed."}><select value={timing ?? ""} onChange={(event) => { setTiming((event.target.value || null) as Timing | null); changed(); }} className={styles.select}><option value="">Not discussed</option>{AGENT_SELLER_TIMING_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></PreparationField>
              <PreparationField label="Property occupancy / readiness context"><select value={propertyReadiness ?? ""} onChange={(event) => { setPropertyReadiness((event.target.value || null) as AgentSellerPreparationRequest["propertyReadiness"]); changed(); }} className={styles.select}><option value="">Not discussed</option><option value="OWNER_OCCUPIED_REPORTED">Owner-occupied (reported)</option><option value="VACANT_REPORTED">Vacant (reported)</option><option value="PREPARATION_NEEDS_DISCUSSION">Preparation needs discussion</option></select></PreparationField>
              <PreparationField label="Known proceeds discussion" helper="Use only what was stated. Confirm financial, title, tax, and legal questions with the appropriate professional."><select value={proceedsDiscussion ?? ""} onChange={(event) => { setProceedsDiscussion((event.target.value || null) as AgentSellerPreparationRequest["proceedsDiscussion"]); changed(); }} className={styles.select}><option value="">Not discussed</option><option value="PAYOFF_OR_LIEN_QUESTION">Payoff or lien question</option><option value="SELLING_COST_QUESTION">Selling-cost question</option><option value="TAX_QUESTION">Tax question</option><option value="OTHER_REPORTED">Another reported question</option></select></PreparationField>
            </div>
          </section>
          <PropertyCriteriaProfileEditor context="SELLER_PROPERTY_FACT" />
          <div className={styles.actionBar}><p className={styles.actionMessage} aria-live="polite">{message}</p><button type="button" onClick={prepare} disabled={!canPrepare} className={styles.action} data-testid="agent-seller-prepare-briefing">{preparedRequest ? "Update my briefing" : "Prepare my briefing"}<ArrowRight size={16} aria-hidden="true" /></button></div>
        </div>
        <aside className={styles.guidance} aria-label="Briefing scope"><Compass className={styles.guidanceIcon} size={20} aria-hidden="true" /><h2 className={styles.guidanceTitle}>A focused Seller briefing</h2><p className={styles.guidanceCopy}>Review the selected priorities, then inspect the complete playbook and professional checkpoints when needed.</p></aside>
      </section>

      {!experience ? <section className={styles.emptyState} data-testid="agent-seller-empty-state">Choose a consultation position and at least two Seller topics, then prepare your briefing.</section> : null}
      {experience?.composition && needsUpdate ? <section className={styles.updateState} data-testid="agent-seller-briefing-update-state" aria-live="polite">Selections ready to update. The briefing remains visible for comparison. Select Update my briefing to regenerate it without leaving this page.</section> : null}
      {experience?.composition ? <div className={styles.briefing} data-testid="agent-seller-briefing"><AgentBriefingComposition briefing={experience.composition} showNextActions={false} />{experience.playbook ? <SellerConsultationPlaybook playbook={experience.playbook} /> : null}</div> : null}
    </div>
  </main>;
}
