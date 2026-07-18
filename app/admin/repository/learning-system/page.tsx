import Link from "next/link";
import type React from "react";

import { buildLearningSystemSnapshot } from "@/lib/enterprise-kpi";
import type {
  LearningLifecycle,
  OutcomeVariance,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export default function LearningSystemPage() {
  const snapshot = buildLearningSystemSnapshot();
  const featured = snapshot.lifecycles[0] ?? null;

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
                Learning System
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                Deterministic EIF 1.0 post-implementation learning from
                decision packages to initiatives, outcomes, variances, reviews,
                lessons, and proposed improvement actions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Label>NON_PRODUCTION_FIXTURE</Label>
              <Label>HUMAN_REVIEW_REQUIRED</Label>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Initiatives" value={String(snapshot.summary.initiativeCount)} />
          <Metric label="Under review" value={String(snapshot.summary.initiativesUnderReview)} />
          <Metric label="Missed outcomes" value={String(snapshot.summary.outcomesMissed)} />
          <Metric label="Live outputs" value={String(snapshot.summary.liveDataBackedOutputs)} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel title="Initiative Lifecycles">
            <div className="space-y-3">
              {snapshot.lifecycles.map((lifecycle) => (
                <a
                  key={lifecycle.initiative.initiativeId}
                  href={`#${lifecycle.initiative.initiativeId}`}
                  className="block border border-white/10 bg-black/20 p-4 transition hover:border-white/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold">{lifecycle.initiative.title}</h2>
                    <span className="text-xs text-white/40">{lifecycle.variances[0]?.state ?? "UNKNOWN"}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {lifecycle.initiative.description}
                  </p>
                  <p className="mt-2 text-xs text-white/40">
                    {lifecycle.initiative.originatingDecisionPackageId} - {lifecycle.initiative.lifecycleState}
                  </p>
                </a>
              ))}
            </div>
          </Panel>

          <Panel title="Featured Review">
            {featured ? <ReviewSummary lifecycle={featured} /> : <EmptyState text="No initiative lifecycle is available." />}
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Lessons Learned Repository">
            {snapshot.lessons.length === 0 ? (
              <EmptyState text="No fixture-backed lesson is available." />
            ) : (
              <div className="space-y-3">
                {snapshot.lessons.map((lesson) => (
                  <div key={lesson.lessonId} className="border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-semibold">{lesson.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{lesson.summary}</p>
                    <div className="mt-3 grid gap-2 text-xs text-white/45 sm:grid-cols-3">
                      <span>{lesson.lessonType}</span>
                      <span>{lesson.confidence}</span>
                      <span>{lesson.applicability}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Continuous Improvement Backlog">
            {snapshot.continuousImprovementBacklog.length === 0 ? (
              <EmptyState text="No proposed improvement action is available." />
            ) : (
              <div className="space-y-3">
                {snapshot.continuousImprovementBacklog.map((item) => {
                  const action = snapshot.improvementActions.find((candidate) => candidate.actionId === item.actionId);
                  return (
                    <div key={item.actionId} className="border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold">{action?.title ?? item.actionId}</p>
                        <span className="text-xl font-semibold">{item.ranking.totalScore ?? "UNKNOWN"}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {action?.description ?? "Action details unavailable."}
                      </p>
                      <p className="mt-3 text-xs text-white/40">
                        Rank {item.rank} - {action?.currentState ?? "UNKNOWN"} - no task created
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </section>

        <div className="mt-8 space-y-8">
          {snapshot.lifecycles.map((lifecycle) => (
            <LifecyclePanel key={lifecycle.initiative.initiativeId} lifecycle={lifecycle} />
          ))}
        </div>
      </div>
    </main>
  );
}

function LifecyclePanel({ lifecycle }: { lifecycle: LearningLifecycle }) {
  const variance = lifecycle.variances[0] ?? null;

  return (
    <section id={lifecycle.initiative.initiativeId} className="border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Label>{lifecycle.initiative.provenance}</Label>
            <Label>{lifecycle.initiative.humanReviewRequired}</Label>
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{lifecycle.initiative.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/55">
            {lifecycle.review.initiativeSummary}
          </p>
        </div>
        <div className="text-sm text-white/45">
          Review: {lifecycle.initiative.plannedReviewDate}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Expected vs Actual">
          {lifecycle.initiative.expectedOutcomes.map((outcome) => {
            const observation = lifecycle.observations.find((item) => item.expectedOutcomeId === outcome.outcomeId);
            return (
              <div key={outcome.outcomeId} className="border-b border-white/10 py-3 first:pt-0 last:border-b-0 last:pb-0">
                <p className="text-sm font-semibold">{outcome.outcomeId}</p>
                <div className="mt-2 grid gap-2 text-xs text-white/45">
                  <span>Baseline: {outcome.baseline}</span>
                  <span>Target: {outcome.target}</span>
                  <span>Actual: {observation?.actualValue ?? "UNAVAILABLE"}</span>
                  <span>Direction: {outcome.desiredDirection}</span>
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Variance">
          {variance ? <VarianceSummary variance={variance} /> : <EmptyState text="No variance is available." />}
        </Panel>

        <Panel title="Decision And Recommendation">
          <div className="space-y-3 text-sm leading-6 text-white/60">
            <p>Decision process: {lifecycle.decisionEvaluation.result}</p>
            <p>Outcome quality: {lifecycle.decisionEvaluation.outcomeQuality}</p>
            <p>Recommendation calibration: {lifecycle.recommendationEvaluation.calibrationFinding}</p>
            <p>Auto weight change: {lifecycle.recommendationEvaluation.proposedWeightAdjustment}</p>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel title="Post-Implementation Review">
          <ReviewList title="What worked" items={lifecycle.review.whatWorked} />
          <ReviewList title="What did not work" items={lifecycle.review.whatDidNotWork} />
          <ReviewList title="Remaining unknowns" items={lifecycle.review.remainingUnknowns} />
        </Panel>

        <Panel title="Evidence Drill-Down">
          <div className="space-y-3">
            <Trace label="Initiative" value={lifecycle.initiative.initiativeId} />
            <Trace label="Decision package" value={lifecycle.initiative.originatingDecisionPackageId} />
            <Trace label="Selected option" value={lifecycle.initiative.selectedDecisionOptionId} />
            <Trace label="Review" value={lifecycle.review.reviewId} />
            <Trace label="Evidence refs" value={String(lifecycle.traceability.length)} />
            <Trace label="Provenance" value={lifecycle.initiative.provenance} />
          </div>
        </Panel>

        <Panel title="Limitations">
          <div className="space-y-3">
            {[
              ...lifecycle.initiative.knownLimitations,
              ...lifecycle.review.remainingUnknowns.map((item) => ({ limitationId: item, description: item, severity: "HIGH" as const })),
            ].slice(0, 6).map((limitation) => (
              <p key={limitation.limitationId} className="text-sm leading-6 text-white/55">
                {limitation.description}
              </p>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function ReviewSummary({ lifecycle }: { lifecycle: LearningLifecycle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{lifecycle.initiative.title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">{lifecycle.review.initiativeSummary}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric label="Variance" value={lifecycle.variances[0]?.state ?? "UNKNOWN"} />
        <Metric label="Decision" value={lifecycle.decisionEvaluation.result} />
        <Metric label="Calibration" value={lifecycle.recommendationEvaluation.calibrationFinding} />
        <Metric label="Review required" value={lifecycle.review.humanReviewRequired} />
      </div>
    </div>
  );
}

function VarianceSummary({ variance }: { variance: OutcomeVariance }) {
  return (
    <div className="space-y-3 text-sm leading-6 text-white/60">
      <p className="text-base font-semibold text-white">{variance.state}</p>
      <p>Expected {variance.expectedValue} and actual {variance.actualValue}</p>
      <p>Absolute variance: {variance.absoluteVariance ?? "UNKNOWN"}</p>
      <p>Percentage variance: {variance.percentageVariance ?? "UNKNOWN"}</p>
      <p>Interpretation: {variance.interpretation}</p>
      <p>Materiality: {variance.materiality}</p>
    </div>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-b border-white/10 py-3 first:pt-0 last:border-b-0 last:pb-0">
      <p className="text-sm font-semibold">{title}</p>
      {items.length === 0 ? (
        <p className="mt-1 text-sm leading-6 text-white/40">None recorded in fixture.</p>
      ) : (
        items.map((item) => (
          <p key={item} className="mt-1 text-sm leading-6 text-white/55">
            {item}
          </p>
        ))
      )}
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-white/15 px-3 py-1 text-xs font-medium text-white/60">
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm leading-6 text-white/45">{text}</p>;
}

function Trace({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-2 text-xs last:border-b-0">
      <span className="text-white/40">{label}</span>
      <span className="break-words text-right text-white/70">{value}</span>
    </div>
  );
}
