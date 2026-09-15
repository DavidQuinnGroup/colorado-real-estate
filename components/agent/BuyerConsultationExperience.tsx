"use client";

import { ArrowRight, CheckCircle2, CircleAlert, Compass, MapPinned, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import AgentBriefingComposition from "@/components/agent/AgentBriefingComposition";
import AgentCurrentSnapshotComparison from "@/components/agent/AgentCurrentSnapshotComparison";
import BuyerConsultationPlaybook from "@/components/agent/BuyerConsultationPlaybook";
import PropertyCriteriaProfileEditor from "@/components/agent/PropertyCriteriaProfileEditor";
import { PreparationField, PreparationSessionStatus, PreparationStartingStateOption, PreparationTopicOption, preparationWorkspaceStyles as styles } from "@/components/agent/PreparationWorkspace";
import {
  AGENT_BUYER_CERTIFIED_CITIES,
  AGENT_BUYER_DISCUSSION_PRIORITIES,
  AGENT_BUYER_FINANCING_STATUSES,
  AGENT_BUYER_PREPARATION_CAPABILITY,
  AGENT_BUYER_PREPARATION_ROUTE,
  AGENT_BUYER_TIMING_OPTIONS,
  type AgentBuyerDiscussionPriority,
  type AgentBuyerFinancingStatus,
  type AgentBuyerPreparationRequest,
  type AgentBuyerTiming,
} from "@/lib/agent-advisory-workbench/agentBuyerPreparationAdmission";
import { prepareAgentBuyerConsultation } from "@/lib/agent-advisory-workbench/agentBuyerConsultationPreparation";
import { createPropertyCriteriaProfile, type PropertyCriteriaProfile } from "@/lib/agent-advisory-workbench/propertyCriteriaProfile";

const PRIORITY_LABELS: Record<AgentBuyerDiscussionPriority, string> = {
  BUYING_PROCESS: "How buying works", TIMING: "When they may want to buy", SEARCH_GEOGRAPHY: "Location criteria", PROPERTY_NEEDS: "Property needs and trade-offs", FINANCING_READINESS: "Financing discussion", MARKET_CONTEXT: "Current market questions", PLACE_CONTEXT: "City and location context", SEARCH_STRATEGY: "Search approach", TOURING_PROCESS: "Touring approach", DECISION_PROCESS: "Decision participants and process", PROFESSIONAL_DUE_DILIGENCE: "Professional questions to clarify",
};

const FINANCING_LABELS: Record<AgentBuyerFinancingStatus, string> = {
  NOT_DISCUSSED: "Not discussed yet", CASH_REPORTED: "They said they plan to pay cash", FINANCING_EXPECTED: "They expect to use financing", PREAPPROVAL_REPORTED: "They said they are preapproved", LENDER_CONVERSATION_REPORTED: "They have spoken with a lender", UNKNOWN_OR_OTHER: "Not known or another situation",
};

const PROPERTY_OBJECTIVES = [["SINGLE_FAMILY", "Single-family home"], ["CONDO_TOWNHOME", "Condo or townhome"], ["MULTI_FAMILY", "Multi-family"], ["LAND", "Land"], ["UNSPECIFIED", "Not decided yet"]] as const;
type Stage = AgentBuyerPreparationRequest["stage"];
type PropertyObjective = NonNullable<AgentBuyerPreparationRequest["propertyObjective"]>;
type Timing = AgentBuyerTiming;

function SelectionStatus({ message, caution = false }: { message: string; caution?: boolean }) {
  return <p className={styles.statusMessage} role="status"><span className={caution ? styles.statusCaution : styles.statusSuccess}>{caution ? <CircleAlert size={13} aria-hidden="true" /> : <CheckCircle2 size={13} aria-hidden="true" />}</span>{message}</p>;
}

export default function BuyerConsultationExperience() {
  const [stage, setStage] = useState<Stage | null>(null);
  const [priorities, setPriorities] = useState<AgentBuyerDiscussionPriority[]>([]);
  const [city, setCity] = useState<AgentBuyerPreparationRequest["certifiedCity"]>(null);
  const [propertyObjective, setPropertyObjective] = useState<PropertyObjective | null>(null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [financingStatus, setFinancingStatus] = useState<AgentBuyerFinancingStatus | null>(null);
  const [preparedRequest, setPreparedRequest] = useState<AgentBuyerPreparationRequest | null>(null);
  const [propertyCriteriaProfile, setPropertyCriteriaProfile] = useState<PropertyCriteriaProfile>(() => createPropertyCriteriaProfile("BUYER_PREFERENCE"));
  const [briefingNeedsUpdate, setBriefingNeedsUpdate] = useState(false);
  const [formMessage, setFormMessage] = useState("Choose a stage and at least two discussion priorities to prepare the briefing.");

  const experience = useMemo(() => preparedRequest ? prepareAgentBuyerConsultation(preparedRequest) : null, [preparedRequest]);
  const canPrepare = Boolean(stage && priorities.length >= 2);
  const selectedTiming = timing ? AGENT_BUYER_TIMING_OPTIONS.find((option) => option.value === timing) : null;

  function markBriefingForUpdate() {
    if (!preparedRequest) return;
    setBriefingNeedsUpdate(true);
    setFormMessage("Your selections changed. The visible briefing reflects the previous choices until you update it.");
  }

  function togglePriority(priority: AgentBuyerDiscussionPriority) {
    markBriefingForUpdate();
    setPriorities((current) => current.includes(priority) ? current.filter((value) => value !== priority) : [...current, priority]);
  }

  function prepareBriefing() {
    if (!stage) { setFormMessage("Choose where this buyer conversation begins before preparing the briefing."); return; }
    if (priorities.length < 2) { setFormMessage("Choose at least two discussion priorities before preparing the briefing."); return; }
    const updating = Boolean(preparedRequest);
    setPreparedRequest({
      actorIdentityType: "HUMAN_AGENT", actorRole: "AGENT", sessionMechanism: "HUMAN_AGENT_SESSION", capability: AGENT_BUYER_PREPARATION_CAPABILITY, route: AGENT_BUYER_PREPARATION_ROUTE,
      stage, priorities, certifiedCity: city, propertyObjective, timing, financingStatus, marketContext: "NONE", supportedPropertyContext: false, customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false, mcpContext: false, protectedClassRequest: false, schoolQualityRequest: false, safetyRequest: false, affordabilityConclusionRequested: false, loanRecommendationRequested: false, legalConclusionRequested: false, representationRequirementClaimRequested: false,
    });
    setBriefingNeedsUpdate(false);
    setFormMessage(updating ? "Your session-only consultation briefing has been updated for the current selections." : "Your session-only consultation briefing is ready for review.");
  }

  return <main className={styles.page} data-testid="agent-buyer-consultation-experience" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false" data-recommendation="false" data-suitability="false" data-fair-housing-inference="false" data-same-page-decision-continuity="true">
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Project Atlas / Agent Workspace</p>
          <p className={styles.pageLabel}>BUYER PREPARATION</p>
          <h1 className={styles.pageTitle}>Prepare for a buyer consultation</h1>
          <p className={styles.pageDescription}>Organize an explicit, session-only consultation briefing before the conversation begins.</p>
        </div>
        <p className={styles.scopeNote}>This preparation clarifies process, questions, and verification needs. It does not create a customer profile or a recommendation.</p>
      </header>

      <section className={styles.workspaceGrid} aria-labelledby="buyer-setup-heading">
        <div className={styles.workspace}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>Consultation setup</p>
              <PreparationSessionStatus />
              <h2 id="buyer-setup-heading" className={styles.sectionTitle}>Choose what the conversation needs to cover</h2>
            </div>
            <fieldset className={styles.flatSection}>
              <legend className={styles.sectionTitle}>Choose where this buyer conversation begins</legend>
              <p className={styles.sectionCopy}>Choose the description that best matches the conversation you are preparing.</p>
              <div className={styles.optionGrid}>
                <PreparationStartingStateOption name="consultation-stage" value="DISCOVERY" checked={stage === "DISCOVERY"} onChange={() => { setStage("DISCOVERY"); markBriefingForUpdate(); }} title="Starting the buyer conversation" description="Clarify goals, timing, search direction, and how the buying process works." />
                <PreparationStartingStateOption name="consultation-stage" value="READINESS" checked={stage === "READINESS"} onChange={() => { setStage("READINESS"); markBriefingForUpdate(); }} title="Preparing for an active search" description="Organize the open questions and verification steps before search activity begins." />
              </div>
            </fieldset>
            <fieldset className={styles.flatSection}>
              <legend className={styles.sectionTitle}>Choose the topics to emphasize</legend>
              <p className={styles.sectionCopy}>{priorities.length} selected. Every selected topic receives Priority Focus treatment; the complete Buyer consultation playbook remains available.</p>
              <div className={styles.topicGrid}>{AGENT_BUYER_DISCUSSION_PRIORITIES.map((priority) => <PreparationTopicOption key={priority} checked={priorities.includes(priority)} onChange={() => togglePriority(priority)} label={PRIORITY_LABELS[priority]} />)}</div>
            </fieldset>
          </section>

          <section className={styles.section} aria-labelledby="buyer-context-heading">
            <div className={styles.sectionHeader}><div><p className={styles.sectionEyebrow}>Optional conversation context</p><h2 id="buyer-context-heading" className={styles.sectionTitle}>Use only what was stated</h2></div><SlidersHorizontal className={styles.guidanceIcon} size={20} aria-hidden="true" /></div>
            <p className={styles.sectionCopy}>These are explicit conversation prompts, not verified client information or a client profile.</p>
            <div className={styles.contextGrid}>
              <PreparationField label="City to discuss"><select value={city ?? ""} onChange={(event) => { setCity((event.target.value || null) as AgentBuyerPreparationRequest["certifiedCity"]); markBriefingForUpdate(); }} className={styles.select}><option value="">No city chosen</option>{AGENT_BUYER_CERTIFIED_CITIES.map((value) => <option key={value} value={value}>{value}</option>)}</select></PreparationField>
              <PreparationField label="Property type to discuss"><select value={propertyObjective ?? ""} onChange={(event) => { setPropertyObjective((event.target.value || null) as PropertyObjective | null); markBriefingForUpdate(); }} className={styles.select}><option value="">Not discussed</option>{PROPERTY_OBJECTIVES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></PreparationField>
              <PreparationField label="When might they want to buy?" helper={selectedTiming?.description ?? "Choose a clear time horizon only when it has been discussed."}><select value={timing ?? ""} onChange={(event) => { setTiming((event.target.value || null) as Timing | null); markBriefingForUpdate(); }} className={styles.select}><option value="">Not discussed</option>{AGENT_BUYER_TIMING_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></PreparationField>
              <PreparationField label="What is known about financing?" helper="Use only what was stated. Confirm financing information directly with a lender."><select value={financingStatus ?? ""} onChange={(event) => { setFinancingStatus((event.target.value || null) as AgentBuyerFinancingStatus | null); markBriefingForUpdate(); }} className={styles.select}><option value="">Not discussed</option>{AGENT_BUYER_FINANCING_STATUSES.map((value) => <option key={value} value={value}>{FINANCING_LABELS[value]}</option>)}</select></PreparationField>
            </div>
          </section>

          <PropertyCriteriaProfileEditor context="BUYER_PREFERENCE" onProfileChange={setPropertyCriteriaProfile} />
          <div className={styles.actionBar}><p className={styles.actionMessage} aria-live="polite">{formMessage}</p><button type="button" onClick={prepareBriefing} disabled={!canPrepare} className={styles.action} data-testid="agent-buyer-prepare-briefing">{preparedRequest ? "Update my briefing" : "Prepare my briefing"}<ArrowRight size={16} aria-hidden="true" /></button></div>
        </div>
        <aside className={styles.guidance} aria-label="Briefing scope"><Compass className={styles.guidanceIcon} size={20} aria-hidden="true" /><h2 className={styles.guidanceTitle}>A focused buyer briefing</h2><p className={styles.guidanceCopy}>Review the conversation priorities in about a minute, then inspect source limits and professional checkpoints when needed.</p></aside>
      </section>

      {!experience ? <section className={styles.emptyState} data-testid="agent-buyer-empty-state">Choose a consultation stage and at least two discussion priorities, then prepare your briefing.</section> : null}
      {experience && !experience.composition ? <section className={styles.failureState} data-testid="agent-buyer-failure-state"><SelectionStatus message={experience.humanState.label} caution /><p>{experience.humanState.message}</p></section> : null}
      {experience?.composition && briefingNeedsUpdate ? <section className={styles.updateState} data-testid="agent-buyer-briefing-update-state" aria-live="polite"><SelectionStatus message="Selections ready to update" /><p>The briefing remains visible so you can compare it with the changed selections. Select Update my briefing to regenerate it without leaving this page.</p></section> : null}

      <div className={styles.briefing}>
        <AgentCurrentSnapshotComparison key={JSON.stringify(propertyCriteriaProfile)} surface="BUYER_PREPARATION" buyerCriteriaProfile={propertyCriteriaProfile} />
        {experience?.composition ? <div data-testid="agent-buyer-briefing">
          <section className={styles.briefingSummary}><article className={styles.briefingCard}><p className={styles.sectionEyebrow}>Consultation objective</p><h2 className={styles.guidanceTitle}>What this conversation should accomplish</h2><p className={styles.guidanceCopy}>{experience.consultationObjective}</p></article><article className={styles.briefingCard}><p className={styles.sectionEyebrow}>Buyer journey position</p><h2 className={styles.guidanceTitle}>Where this fits</h2><p className={styles.guidanceCopy}>{experience.journeyPosition}</p></article></section>
          <AgentBriefingComposition briefing={experience.composition} showNextActions={false} />
          {experience.playbook ? <BuyerConsultationPlaybook playbook={experience.playbook} /> : null}
          <section className={styles.briefingSummary}>{experience.cityContext ? <article className={styles.briefingCard}><MapPinned className={styles.guidanceIcon} size={20} aria-hidden="true" /><h2 className={styles.guidanceTitle}>Location context</h2><p className={styles.guidanceCopy}>{experience.cityContext.summary}</p></article> : null}{experience.searchStrategyContext.length ? <article className={styles.briefingCard}><ShieldCheck className={styles.guidanceIcon} size={20} aria-hidden="true" /><h2 className={styles.guidanceTitle}>Search strategy context</h2><ul className={styles.briefingList}>{experience.searchStrategyContext.map((item) => <li key={item}>{item}</li>)}</ul></article> : null}</section>
        </div> : null}
      </div>
    </div>
  </main>;
}
