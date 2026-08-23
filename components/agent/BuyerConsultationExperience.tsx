"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Compass,
  MapPinned,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import { projectAtlasTitleHierarchy } from "@/components/ProjectAtlasTitleHierarchy";
import AgentBriefingComposition from "@/components/agent/AgentBriefingComposition";
import BuyerConsultationPlaybook from "@/components/agent/BuyerConsultationPlaybook";
import AgentPreparationPageHeader from "@/components/agent/AgentPreparationPageHeader";
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

const PRIORITY_LABELS: Record<AgentBuyerDiscussionPriority, string> = {
  BUYING_PROCESS: "How buying works",
  TIMING: "When they may want to buy",
  SEARCH_GEOGRAPHY: "Location criteria",
  PROPERTY_NEEDS: "Property needs and trade-offs",
  FINANCING_READINESS: "Financing discussion",
  MARKET_CONTEXT: "Current market questions",
  PLACE_CONTEXT: "City and location context",
  SEARCH_STRATEGY: "Search approach",
  TOURING_PROCESS: "Touring approach",
  DECISION_PROCESS: "Decision participants and process",
  PROFESSIONAL_DUE_DILIGENCE: "Professional questions to clarify",
};

const FINANCING_LABELS: Record<AgentBuyerFinancingStatus, string> = {
  NOT_DISCUSSED: "Not discussed yet",
  CASH_REPORTED: "They said they plan to pay cash",
  FINANCING_EXPECTED: "They expect to use financing",
  PREAPPROVAL_REPORTED: "They said they are preapproved",
  LENDER_CONVERSATION_REPORTED: "They have spoken with a lender",
  UNKNOWN_OR_OTHER: "Not known or another situation",
};

const PROPERTY_OBJECTIVES = [
  ["SINGLE_FAMILY", "Single-family home"],
  ["CONDO_TOWNHOME", "Condo or townhome"],
  ["MULTI_FAMILY", "Multi-family"],
  ["LAND", "Land"],
  ["UNSPECIFIED", "Not decided yet"],
] as const;

type Stage = AgentBuyerPreparationRequest["stage"];
type PropertyObjective = NonNullable<
  AgentBuyerPreparationRequest["propertyObjective"]
>;
type Timing = AgentBuyerTiming;

function SelectionStatus({
  message,
  caution = false,
}: {
  message: string;
  caution?: boolean;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-sm font-semibold ${caution ? "text-amber-100" : "text-emerald-100"}`}
      role="status"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${caution ? "bg-amber-200/15" : "bg-emerald-200/15"}`}
      >
        {caution ? (
          <CircleAlert size={13} aria-hidden="true" />
        ) : (
          <CheckCircle2 size={13} aria-hidden="true" />
        )}
      </span>
      {message}
    </p>
  );
}

export default function BuyerConsultationExperience() {
  const [stage, setStage] = useState<Stage | null>(null);
  const [priorities, setPriorities] = useState<AgentBuyerDiscussionPriority[]>(
    [],
  );
  const [city, setCity] =
    useState<AgentBuyerPreparationRequest["certifiedCity"]>(null);
  const [propertyObjective, setPropertyObjective] =
    useState<PropertyObjective | null>(null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [financingStatus, setFinancingStatus] =
    useState<AgentBuyerFinancingStatus | null>(null);
  const [preparedRequest, setPreparedRequest] =
    useState<AgentBuyerPreparationRequest | null>(null);
  const [briefingNeedsUpdate, setBriefingNeedsUpdate] = useState(false);
  const [formMessage, setFormMessage] = useState(
    "Choose a stage and at least two discussion priorities to prepare the briefing.",
  );

  const experience = useMemo(
    () =>
      preparedRequest ? prepareAgentBuyerConsultation(preparedRequest) : null,
    [preparedRequest],
  );
  const canPrepare = Boolean(stage && priorities.length >= 2);
  const selectedTiming = timing
    ? AGENT_BUYER_TIMING_OPTIONS.find((option) => option.value === timing)
    : null;

  function markBriefingForUpdate() {
    if (!preparedRequest) return;
    setBriefingNeedsUpdate(true);
    setFormMessage(
      "Your selections changed. The visible briefing reflects the previous choices until you update it.",
    );
  }

  function togglePriority(priority: AgentBuyerDiscussionPriority) {
    markBriefingForUpdate();
    setPriorities((current) => {
      if (current.includes(priority))
        return current.filter((value) => value !== priority);
      return [...current, priority];
    });
  }

  function prepareBriefing() {
    if (!stage) {
      setFormMessage(
        "Choose where this buyer conversation begins before preparing the briefing.",
      );
      return;
    }
    if (priorities.length < 2) {
      setFormMessage(
        "Choose at least two discussion priorities before preparing the briefing.",
      );
      return;
    }
    const updating = Boolean(preparedRequest);
    setPreparedRequest({
      actorIdentityType: "HUMAN_AGENT",
      actorRole: "AGENT",
      sessionMechanism: "HUMAN_AGENT_SESSION",
      capability: AGENT_BUYER_PREPARATION_CAPABILITY,
      route: AGENT_BUYER_PREPARATION_ROUTE,
      stage,
      priorities,
      certifiedCity: city,
      propertyObjective,
      timing,
      financingStatus,
      marketContext: "NONE",
      supportedPropertyContext: false,
      customerContext: false,
      persistenceRequested: false,
      providerRuntimeRequired: false,
      adminContext: false,
      mcpContext: false,
      protectedClassRequest: false,
      schoolQualityRequest: false,
      safetyRequest: false,
      affordabilityConclusionRequested: false,
      loanRecommendationRequested: false,
      legalConclusionRequested: false,
      representationRequirementClaimRequested: false,
    });
    setBriefingNeedsUpdate(false);
    setFormMessage(
      updating
        ? "Your session-only consultation briefing has been updated for the current selections."
        : "Your session-only consultation briefing is ready for review.",
    );
  }

  return (
    <main
      className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12"
      data-testid="agent-buyer-consultation-experience"
      data-agent-only="true"
      data-persistence="false"
      data-customer-data="false"
      data-provider-activity="false"
      data-recommendation="false"
      data-suitability="false"
      data-fair-housing-inference="false"
      data-same-page-decision-continuity="true"
    >
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <AgentPreparationPageHeader
            pageTitle="BUYER PREPARATION"
            taskHeading="Prepare for a buyer consultation"
            description="Organize an explicit, session-only consultation briefing before the conversation begins."
            scopeNote="This preparation clarifies process, questions, and verification needs. It does not create a customer profile or a recommendation."
          />
        </header>

        <section
          className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"
          aria-labelledby="buyer-setup-heading"
        >
          <div className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
                  Consultation setup
                </p>
                <h2
                  id="buyer-setup-heading"
                  className={`mt-2 ${projectAtlasTitleHierarchy.selectionSection}`}
                >
                  Choose what the conversation needs to cover
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                No information is saved
              </span>
            </div>

            <fieldset className="mt-6">
              <legend className={projectAtlasTitleHierarchy.selectionGroup}>
                Choose where this buyer conversation begins
              </legend>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Choose the description that best matches the conversation you are preparing.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    [
                      "DISCOVERY",
                      "Starting the buyer conversation",
                      "Clarify goals, timing, search direction, and how the buying process works.",
                    ],
                    [
                      "READINESS",
                      "Preparing for an active search",
                      "Organize the open questions and verification steps before search activity begins.",
                    ],
                  ] as const
                ).map(([value, title, description]) => (
                  <label
                    key={value}
                    className={`cursor-pointer border p-4 transition ${stage === value ? "border-cyan-200/70 bg-cyan-200/10" : "border-white/10 bg-black/10 hover:border-white/30"}`}
                  >
                    <input
                      type="radio"
                      name="consultation-stage"
                      value={value}
                      checked={stage === value}
                      onChange={() => {
                        setStage(value);
                        markBriefingForUpdate();
                      }}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold text-white">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-400">
                      {description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className={projectAtlasTitleHierarchy.selectionGroup}>
                Choose the topics to emphasize
              </legend>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {priorities.length} selected. Every selected topic receives
                Priority Focus treatment; the complete Buyer consultation
                playbook remains available.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {AGENT_BUYER_DISCUSSION_PRIORITIES.map((priority) => {
                  const checked = priorities.includes(priority);
                  return (
                    <label
                      key={priority}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 transition ${checked ? "border-cyan-200/70 bg-cyan-200/10 text-white" : "border-white/10 bg-black/10 text-slate-300 hover:border-white/30"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePriority(priority)}
                        className="h-4 w-4 accent-cyan-200"
                      />
                      <span className="text-sm font-medium">
                        {PRIORITY_LABELS[priority]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-7 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <SlidersHorizontal
                  className="h-5 w-5 text-cyan-100"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Optional conversation context
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    These are explicit conversation prompts, not verified
                    client information or a client profile.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-200">
                  City to discuss
                  <select
                    value={city ?? ""}
                    onChange={(event) => {
                      setCity(
                        (event.target.value ||
                          null) as AgentBuyerPreparationRequest["certifiedCity"],
                      );
                      markBriefingForUpdate();
                    }}
                    className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">No city chosen</option>
                    {AGENT_BUYER_CERTIFIED_CITIES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-200">
                  Property type to discuss
                  <select
                    value={propertyObjective ?? ""}
                    onChange={(event) => {
                      setPropertyObjective(
                        (event.target.value ||
                          null) as PropertyObjective | null,
                      );
                      markBriefingForUpdate();
                    }}
                    className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Not discussed</option>
                    {PROPERTY_OBJECTIVES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-200">
                  When might they want to buy?
                  <select
                    value={timing ?? ""}
                    onChange={(event) => {
                      setTiming((event.target.value || null) as Timing | null);
                      markBriefingForUpdate();
                    }}
                    className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Not discussed</option>
                    {AGENT_BUYER_TIMING_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-xs font-normal leading-5 text-slate-400">
                    {selectedTiming?.description ??
                      "Choose a clear time horizon only when it has been discussed."}
                  </span>
                </label>
                <label className="text-sm font-medium text-slate-200">
                  What is known about financing?
                  <select
                    value={financingStatus ?? ""}
                    onChange={(event) => {
                      setFinancingStatus(
                        (event.target.value ||
                          null) as AgentBuyerFinancingStatus | null,
                      );
                      markBriefingForUpdate();
                    }}
                    className="mt-2 block min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">Not discussed</option>
                    {AGENT_BUYER_FINANCING_STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {FINANCING_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-xs font-normal leading-5 text-slate-400">
                    Use only what was stated. Confirm financing information
                    directly with a lender.
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p
                className="text-sm leading-6 text-slate-400"
                aria-live="polite"
              >
                {formMessage}
              </p>
              <button
                type="button"
                onClick={prepareBriefing}
                disabled={!canPrepare}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#071014]"
                data-testid="agent-buyer-prepare-briefing"
              >
                {preparedRequest ? "Update my briefing" : "Prepare my briefing"}{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
          <aside
            className="border border-white/10 bg-[#0b171c] p-5"
            aria-label="Briefing scope"
          >
            <Compass className="h-5 w-5 text-cyan-100" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold text-white">
              A focused buyer briefing
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Review the conversation priorities in about a minute, then inspect
              source limits and professional checkpoints when needed.
            </p>
          </aside>
        </section>

        {!experience ? (
          <section
            className="mt-8 border border-dashed border-white/15 px-5 py-7 text-sm text-slate-400"
            data-testid="agent-buyer-empty-state"
          >
            Choose a consultation stage and at least two discussion priorities,
            then prepare your briefing.
          </section>
        ) : null}
        {experience && !experience.composition ? (
          <section
            className="mt-8 border border-amber-200/20 bg-amber-100/[0.06] p-5"
            data-testid="agent-buyer-failure-state"
          >
            <SelectionStatus message={experience.humanState.label} caution />
            <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-50/80">
              {experience.humanState.message}
            </p>
          </section>
        ) : null}

        {experience?.composition && briefingNeedsUpdate ? (
          <section
            className="mt-8 border border-cyan-200/20 bg-cyan-100/[0.06] p-5"
            data-testid="agent-buyer-briefing-update-state"
            aria-live="polite"
          >
            <SelectionStatus message="Selections ready to update" />
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The briefing below remains visible so you can compare it with the
              changed selections. Select Update my briefing to regenerate it
              without leaving this page.
            </p>
          </section>
        ) : null}

        {experience?.composition ? (
          <div data-testid="agent-buyer-briefing">
            <section className="mt-8 grid gap-5 lg:grid-cols-2">
              <article className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
                  Consultation objective
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">
                  What this conversation should accomplish
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {experience.consultationObjective}
                </p>
              </article>
              <article className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">
                  Buyer journey position
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">
                  Where this fits
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {experience.journeyPosition}
                </p>
              </article>
            </section>
            <AgentBriefingComposition briefing={experience.composition} showNextActions={false} />
            {experience.playbook ? (
              <BuyerConsultationPlaybook playbook={experience.playbook} />
            ) : null}
            <section className="mt-5 grid gap-5 lg:grid-cols-2">
              {experience.cityContext ? (
                <article className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <MapPinned
                      className="h-5 w-5 text-cyan-100"
                      aria-hidden="true"
                    />
                    <h2 className="text-lg font-semibold">Location context</h2>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {experience.cityContext.summary}
                  </p>
                </article>
              ) : null}
              {experience.searchStrategyContext.length ? (
                <article className="border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className="h-5 w-5 text-cyan-100"
                      aria-hidden="true"
                    />
                    <h2 className="text-lg font-semibold">
                      Search strategy context
                    </h2>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    {experience.searchStrategyContext.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
