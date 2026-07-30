"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  ArrowRightLeft,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  Hammer,
  ShieldAlert,
} from "lucide-react";

import type { PropertyAuthorityLink } from "@/lib/linking/getPropertyLinks";

type StrategyTab = "prep" | "timeline";

type RelatedPropertyLinksProps = {
  city: string;
  authorityLinks?: PropertyAuthorityLink[];
  neighborhood?: string | null;
};

type PrepScenario = {
  label: string;
  scope: string;
  planningSignal: string;
  reviewTiming: string;
  description: string;
};

type TimelineStep = {
  label: string;
  date: string;
  active?: boolean;
  highlight?: boolean;
};

type TimelinePointProps = TimelineStep;

const prepScenarios: PrepScenario[] = [
  {
    label: "Current Presentation",
    scope: "Baseline presentation",
    planningSignal: "Review buyer confidence",
    reviewTiming: "Timing varies",
    description: "Use public context to compare how this property is presented before assuming updates or next steps are warranted.",
  },
  {
    label: "Focused Updates",
    scope: "Targeted preparation",
    planningSignal: "Clarify showing questions",
    reviewTiming: "Focused timing",
    description: "Review whether visible presentation, records, and buyer questions should be discussed before relying on assumptions.",
  },
  {
    label: "Expanded Review",
    scope: "Broader preparation",
    planningSignal: "Organize records and timing",
    reviewTiming: "Expanded timing",
    description: "Use advisor and professional input when timing, records, or property presentation need a broader review.",
  },
];

const timelineSteps: TimelineStep[] = [
  { label: "Listing Prep", date: "Day 1-14", active: true },
  { label: "Market Debut", date: "Day 15", active: true },
  { label: "Contingent Offer", date: "Day 22" },
  { label: "Due Diligence", date: "Day 35" },
  { label: "Closing Review", date: "Day 45", highlight: true },
];

export default function RelatedPropertyLinks({
  authorityLinks = [],
  city,
  neighborhood,
}: RelatedPropertyLinksProps) {
  const [activeTab, setActiveTab] = useState<StrategyTab>("prep");
  const primaryHref = authorityLinks[0]?.href ?? `/search?city=${encodeURIComponent(city)}`;
  const authorityLabel = neighborhood ? `${city} / ${neighborhood}` : city;
  const visibleAuthorityLinks = authorityLinks.slice(0, 3);

  return (
    <section
      className="mt-24 overflow-hidden border border-white/10 bg-[#050505] text-white shadow-2xl"
      data-testid="reie-related-property-links"
      data-related-property-city={city}
      data-related-property-neighborhood={neighborhood || ""}
      data-related-property-authority-label={authorityLabel}
      data-related-property-active-tab={activeTab}
      data-related-property-authority-link-count={authorityLinks.length}
      data-related-property-visible-authority-link-count={visibleAuthorityLinks.length}
      data-related-property-primary-href={primaryHref}
      data-related-property-prep-scenario-count={prepScenarios.length}
      data-related-property-timeline-step-count={timelineSteps.length}
    >
      <div className="border-b border-white/5 bg-cyan-100/[0.045] p-5 md:p-6">
        <div className="mb-2 flex items-center gap-3">
          <ArrowRightLeft className="h-4 w-4 text-cyan-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/76">
            Continue Comparing
          </span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Related Property Paths
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/52">
          Search and market context for continued review in {authorityLabel}
        </p>
      </div>

      <div className="grid border-b border-white/5 bg-white/[0.02] sm:grid-cols-2">
        <StrategyButton
          icon={<Hammer size={18} />}
          isActive={activeTab === "prep"}
          label="Preparation Considerations"
          onClick={() => setActiveTab("prep")}
          tab="prep"
        />
        <StrategyButton
          icon={<Calendar size={18} />}
          isActive={activeTab === "timeline"}
          label="Timing Review"
          onClick={() => setActiveTab("timeline")}
          tab="timeline"
        />
        <span className="sr-only">Critical Path Timeline</span>
      </div>

      <div
        className="p-5 md:p-6"
        data-testid="reie-related-property-active-panel"
        data-related-property-active-tab={activeTab}
      >
        {activeTab === "prep" ? (
          <div
            className="animate-in fade-in duration-700"
            data-testid="reie-related-property-prep-panel"
            data-related-property-prep-scenario-count={prepScenarios.length}
          >
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              Compare Review Paths
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {prepScenarios.map((scenario) => (
                  <div
                    key={scenario.label}
                    className="group rounded-[8px] border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-cyan-100/32 hover:bg-white/[0.05]"
                    data-testid="reie-related-property-prep-scenario"
                    data-related-property-scenario-label={scenario.label}
                    data-related-property-scenario-velocity={scenario.reviewTiming}
                    data-related-property-scenario-scope={scenario.scope}
                  >
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/42">
                      {scenario.label}
                    </div>
                    <div className="text-base font-black uppercase tracking-normal text-white">
                      {scenario.scope}
                    </div>
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/38">
                      Review Scope
                    </div>

                    <div className="mt-4 space-y-3 border-t border-white/8 pt-4">
                      <MetricRow
                        label="Marketability Focus"
                        value={scenario.planningSignal}
                      />
                      <MetricRow label="Timing" value={scenario.reviewTiming} />
                    </div>
                    <p className="mt-4 text-xs leading-5 text-white/46">
                      {scenario.description}
                    </p>
                  </div>
                ))}
            </div>
            <p className="mt-6 text-[10px] leading-5 text-white/38">
              Actual costs, timing, and outcomes vary. Treat these paths as conversation context, not as recommendations.
            </p>
          </div>
        ) : (
          <div
            className="animate-in fade-in duration-700"
            data-testid="reie-related-property-timeline-panel"
            data-related-property-timeline-step-count={timelineSteps.length}
          >
            <h3 className="mb-5 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              Timing Questions to Review
            </h3>
            <div className="relative overflow-x-auto rounded-[8px] border border-white/10 bg-white/[0.025] px-4 pb-6 pt-10">
              <div className="absolute left-0 top-1/2 h-px min-w-full bg-white/10" />
              <div className="relative z-10 flex min-w-[720px] justify-between">
                {timelineSteps.map((step) => (
                  <TimelinePoint key={step.label} {...step} />
                ))}
              </div>
            </div>
            <div
              className="mt-5 flex items-start gap-4 rounded-[8px] border border-amber-100/18 bg-amber-100/[0.07] p-4"
              data-testid="reie-related-property-contingency-alert"
              data-related-property-alert-type="timing-review"
              data-related-property-risk-window-days="review-required"
            >
              <ShieldAlert className="shrink-0 text-amber-100" size={18} />
              <div>
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100">
                  Timing Review
                </p>
                <p className="text-xs leading-5 text-white/58">
                  When timing questions overlap, review closing dates, occupancy needs, financing terms, and contingency options with
                  the appropriate professionals before relying on a plan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex flex-col items-start justify-between gap-5 border-t border-white/5 bg-black/34 p-5 md:flex-row md:items-center md:p-6"
        data-testid="reie-related-property-footer"
        data-related-property-authority-link-count={authorityLinks.length}
        data-related-property-visible-authority-link-count={visibleAuthorityLinks.length}
        data-related-property-primary-href={primaryHref}
      >
        <div className="w-full min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardCheck className="text-cyan-300/50" size={16} />
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/34">
              Continued Exploration
            </span>
          </div>
          {authorityLinks.length ? (
            <div
              className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3"
              data-testid="reie-related-property-authority-links"
              data-related-property-visible-authority-link-count={visibleAuthorityLinks.length}
            >
              {visibleAuthorityLinks.map((link, index) => (
                <Link
                  key={`${link.status}-${link.href}-${link.label}-${index}`}
                  href={link.href}
                  className="group bg-black p-4 transition-colors hover:bg-white/[0.05]"
                  data-testid="reie-related-property-authority-link"
                  data-related-property-link-status={link.status}
                  data-related-property-link-label={link.label}
                  data-related-property-link-href={link.href}
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.24em] text-cyan-300">
                    {link.status}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase leading-5 tracking-[0.12em] text-white/55 transition-colors group-hover:text-white">
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <Link
          href={primaryHref}
          className="group flex min-h-11 shrink-0 items-center gap-2 rounded-[6px] bg-cyan-100 px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#061017] transition-colors hover:bg-white"
          data-testid="reie-related-property-primary-link"
          data-related-property-primary-href={primaryHref}
          data-related-property-link-source={authorityLinks[0] ? "authority-link" : "city-search-fallback"}
        >
          Continue Comparing
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function StrategyButton({
  icon,
  isActive,
  label,
  onClick,
  tab,
}: {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
  tab: StrategyTab;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      data-testid="reie-related-property-tab"
      data-related-property-tab={tab}
      data-related-property-tab-active={isActive ? "true" : "false"}
      className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-2 px-3 py-4 transition-colors ${
        isActive
          ? "border-b-2 border-cyan-100 bg-white/5 text-white"
          : "text-white/38 hover:text-white/62"
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
        {label}
      </span>
    </button>
  );
}

function MetricRow({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string;
  isPositive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/34">
        {label}
      </span>
      <span
        className={`text-sm font-black ${
          isPositive === undefined ? "text-white/78" : isPositive ? "text-emerald-100" : "text-amber-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TimelinePoint({
  label,
  date,
  active = false,
  highlight = false,
}: TimelinePointProps) {
  return (
    <div
      className="flex w-32 flex-col items-center text-center"
      data-testid="reie-related-property-timeline-step"
      data-related-property-timeline-label={label}
      data-related-property-timeline-date={date}
      data-related-property-timeline-active={active ? "true" : "false"}
      data-related-property-timeline-highlight={highlight ? "true" : "false"}
    >
      <div
        className={`mb-4 h-3 w-3 rounded-full transition-all ${
          highlight
            ? "scale-150 bg-cyan-100 shadow-[0_0_15px_rgba(183,219,226,0.55)]"
            : active
              ? "bg-emerald-100"
              : "bg-white/20"
        }`}
      />
      <div
        className={`mb-1 text-[9px] font-black uppercase tracking-tighter ${
          active || highlight ? "text-white" : "text-white/34"
        }`}
      >
        {label}
      </div>
      <div className="text-[8px] font-bold uppercase text-white/30">{date}</div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/RelatedPropertyLinks.tsx
