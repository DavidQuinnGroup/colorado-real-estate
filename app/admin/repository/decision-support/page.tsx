import Link from "next/link";
import type React from "react";

import { buildDecisionSupportSnapshot } from "@/lib/enterprise-kpi";
import type {
  DecisionOption,
  EnterpriseDecisionPackage,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export default function DecisionSupportPage() {
  const snapshot = buildDecisionSupportSnapshot();
  const featured = snapshot.packages[0] ?? null;

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <Link
            href="/admin/repository"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Repository Studio
          </Link>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                PROJECT ATLAS
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                Decision Support
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                Deterministic EIF 1.0 decision packages for leadership review.
                Recommendations are explainable, fixture-backed, and never
                execute or persist a decision.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Label>NON_PRODUCTION_FIXTURE</Label>
              <Label>HUMAN_DECISION_REQUIRED</Label>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Packages" value={String(snapshot.summary.packageCount)} />
          <Metric label="Human review" value={String(snapshot.summary.recommendationsAwaitingHumanReview)} />
          <Metric label="More evidence" value={String(snapshot.summary.moreEvidenceRequired)} />
          <Metric label="Live outputs" value={String(snapshot.summary.liveDataBackedOutputs)} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Decision Situations">
            <div className="space-y-3">
              {snapshot.packages.map((decisionPackage) => (
                <a
                  key={decisionPackage.packageId}
                  href={`#${decisionPackage.packageId}`}
                  className="block border border-white/10 bg-black/20 p-4 transition hover:border-white/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold">{decisionPackage.situation.title}</h2>
                    <span className="text-xs text-white/40">{decisionPackage.situation.urgency}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {decisionPackage.situation.executiveQuestion}
                  </p>
                  <p className="mt-2 text-xs text-white/40">
                    {decisionPackage.packageId} · {decisionPackage.situation.relevantDomains.join(", ")}
                  </p>
                </a>
              ))}
            </div>
          </Panel>

          <Panel title="Highest-Priority Package">
            {featured ? <PackageSummary decisionPackage={featured} /> : <EmptyState text="No decision package is available." />}
          </Panel>
        </section>

        <section className="mt-8">
          <Panel title="Provisional Criteria">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {snapshot.criteria.map((criterion) => (
                <div key={criterion.criterionId} className="border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold">{criterion.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{Math.round(criterion.weight * 100)}%</p>
                  <p className="mt-2 text-xs text-white/45">{criterion.direction} · provisional</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <div className="mt-8 space-y-8">
          {snapshot.packages.map((decisionPackage) => (
            <DecisionPackagePanel key={decisionPackage.packageId} decisionPackage={decisionPackage} />
          ))}
        </div>
      </div>
    </main>
  );
}

function DecisionPackagePanel({ decisionPackage }: { decisionPackage: EnterpriseDecisionPackage }) {
  return (
    <section id={decisionPackage.packageId} className="border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            {decisionPackage.labels.map((label) => <Label key={label}>{label}</Label>)}
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{decisionPackage.situation.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/55">
            {decisionPackage.whyItMatters}
          </p>
        </div>
        <div className="text-sm text-white/45">
          Review: {decisionPackage.reviewSchedule.reviewDate}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h3 className="text-lg font-medium">Option Comparison</h3>
          <div className="mt-4 space-y-3">
            {decisionPackage.options.map((option) => (
              <OptionCard key={option.optionId} option={option} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Recommendation">
            <p className="text-sm font-semibold">{decisionPackage.recommendation.recommendationKind}</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{decisionPackage.recommendation.reason}</p>
            <div className="mt-4 grid gap-2 text-xs text-white/45">
              <span>Recommended: {decisionPackage.recommendation.recommendedOptionId ?? "None"}</span>
              <span>Alternative: {decisionPackage.recommendation.alternativeOptionId ?? "None"}</span>
              <span>Confidence: {decisionPackage.recommendation.confidence.level}</span>
              <span>{decisionPackage.recommendation.humanReviewRequirement}</span>
            </div>
          </Panel>

          <Panel title="Non-Persistent Disposition">
            <p className="text-sm leading-6 text-white/60">
              {decisionPackage.dispositionDemo.note}
            </p>
            <div className="mt-4 grid gap-2 text-xs text-white/45">
              <span>Status: {decisionPackage.dispositionDemo.status}</span>
              <span>Rationale required: yes</span>
              <span>Official decision: no</span>
              <span>Persistence: none</span>
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Risks and Tradeoffs">
          {decisionPackage.risksAndTradeoffs.slice(0, 6).map((risk) => (
            <div key={risk.riskId} className="border-b border-white/10 py-3 first:pt-0 last:border-b-0 last:pb-0">
              <p className="text-sm font-semibold">{risk.category} · {risk.level}</p>
              <p className="mt-1 text-sm leading-6 text-white/55">{risk.description}</p>
            </div>
          ))}
        </Panel>

        <Panel title="Expected Outcomes">
          {decisionPackage.expectedOutcomes.slice(0, 5).map((outcome) => (
            <div key={outcome.outcomeId} className="border-b border-white/10 py-3 first:pt-0 last:border-b-0 last:pb-0">
              <p className="text-sm font-semibold">{outcome.outcomeId}</p>
              <p className="mt-1 text-sm leading-6 text-white/55">{outcome.description}</p>
              <p className="mt-1 text-xs text-white/40">
                Baseline {outcome.baseline} · Target {outcome.target}
              </p>
            </div>
          ))}
        </Panel>

        <Panel title="Evidence Traceability">
          <div className="space-y-3">
            <Trace label="Package" value={decisionPackage.packageId} />
            <Trace label="Situation" value={decisionPackage.situation.situationId} />
            <Trace label="Events" value={decisionPackage.situation.triggeringIntelligenceEventIds.join(", ") || "No event"} />
            <Trace label="KPI" value={decisionPackage.situation.relevantKpis.join(", ") || "No KPI"} />
            <Trace label="Evidence" value={String(decisionPackage.supportingEvidence.length)} />
            <Trace label="Provenance" value={decisionPackage.provenance} />
          </div>
        </Panel>
      </div>
    </section>
  );
}

function PackageSummary({ decisionPackage }: { decisionPackage: EnterpriseDecisionPackage }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{decisionPackage.situation.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">{decisionPackage.situation.situationSummary}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Package" value={decisionPackage.packageId} />
        <Metric label="Urgency" value={decisionPackage.situation.urgency} />
        <Metric label="Recommendation" value={decisionPackage.recommendation.recommendationKind} />
        <Metric label="Confidence" value={decisionPackage.confidence.level} />
      </div>
    </div>
  );
}

function OptionCard({ option }: { option: DecisionOption }) {
  return (
    <div className="border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{option.title}</p>
          <p className="mt-1 text-xs text-white/40">{option.optionId} · {option.type}</p>
        </div>
        <span className="text-2xl font-semibold">{option.score.totalScore ?? "UNKNOWN"}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/55">{option.proposedAction}</p>
      <div className="mt-4 grid gap-2 text-xs text-white/45 sm:grid-cols-3">
        <span>Coverage {option.score.coveragePercentage}%</span>
        <span>Risk adjusted {option.score.riskAdjusted ? "yes" : "no"}</span>
        <span>Unknown {option.score.unknownCriteria.length}</span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
      {children}
    </span>
  );
}

function Trace({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-1 break-words text-sm text-white/65">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="border border-white/10 bg-black/20 p-4 text-sm text-white/50">{text}</p>;
}
