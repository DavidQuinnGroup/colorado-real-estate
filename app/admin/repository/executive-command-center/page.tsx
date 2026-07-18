import Link from "next/link";
import type React from "react";

import { buildDailyExecutiveBrief, buildExecutiveCommandCenterPayload } from "@/lib/enterprise-kpi";
import type {
  DomainExecutiveSummary,
  ExecutiveAttentionItem,
  ExecutiveMaterialChange,
  OpportunitySignal,
  RiskSignal,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export default function ExecutiveCommandCenterPage() {
  const commandCenter = buildExecutiveCommandCenterPayload();
  const brief = buildDailyExecutiveBrief();
  const status = commandCenter.enterpriseStatus;

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
                Executive Command Center
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                Internal leadership workspace for deterministic EIF 1.0
                intelligence. Current output is fixture-backed and does not
                represent live enterprise condition.
              </p>
            </div>
            <div className="border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100">
              NON_PRODUCTION_FIXTURE
            </div>
          </div>
        </header>

        <section className="mt-8 border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Enterprise Status
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-6xl font-semibold tracking-tight">
                  {status.overallScore === null ? "UNKNOWN" : status.overallScore.toFixed(1)}
                </span>
                <span className="text-xl text-white/55">{status.overallStatus}</span>
              </div>
              <p className="mt-3 text-sm text-white/55">
                Internal Preview: {status.internalPreviewState}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Confidence" value={status.confidence} />
              <Metric label="Freshness" value={status.freshness} />
              <Metric label="Coverage" value={`${status.coveragePercentage}%`} />
              <Metric label="Provenance" value={status.provenance} />
              <Metric label="Critical risks" value={String(status.activeCriticalRisks)} />
              <Metric label="Warning risks" value={String(status.activeWarningRisks)} />
              <Metric label="Unknown domains" value={String(status.unknownDomains)} />
              <Metric label="Stale KPIs" value={String(status.staleKpiCount)} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-3">
          <Panel title="Material Changes" className="xl:col-span-1">
            {commandCenter.materialChanges.length === 0 ? (
              <EmptyState text="No material changes are available from the governed fixture set." />
            ) : (
              commandCenter.materialChanges.slice(0, 5).map((change) => (
                <MaterialChangeRow key={change.changeId} change={change} />
              ))
            )}
          </Panel>

          <Panel title="Top Risks">
            {commandCenter.risks.length === 0 ? (
              <EmptyState text="No risk signals are available from the governed fixture set." />
            ) : (
              commandCenter.risks.slice(0, 4).map((risk) => <RiskRow key={risk.signalId} risk={risk} />)
            )}
          </Panel>

          <Panel title="Top Opportunities">
            {commandCenter.opportunities.length === 0 ? (
              <EmptyState text="No opportunity signals are available from the governed fixture set." />
            ) : (
              commandCenter.opportunities
                .slice(0, 4)
                .map((opportunity) => (
                  <OpportunityRow key={opportunity.signalId} opportunity={opportunity} />
                ))
            )}
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Executive Attention Queue">
            <p className="mb-4 text-sm leading-6 text-white/50">
              Presentation-only review queue. Acknowledgment, assignment, notes,
              and history are not persisted in Sprint 3.
            </p>
            {commandCenter.attentionItems.length === 0 ? (
              <EmptyState text="No attention item is generated by the deterministic rules." />
            ) : (
              commandCenter.attentionItems
                .slice(0, 7)
                .map((item) => <AttentionRow key={item.stableId} item={item} />)
            )}
          </Panel>

          <Panel title="Daily Executive Brief">
            <div className="space-y-4">
              {brief.sections.map((section) => (
                <div key={section.heading} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-sm font-semibold">{section.heading}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{section.body}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8">
          <Panel title="Domain Health">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {commandCenter.domains.map((domain) => (
                <DomainCard key={domain.domain} domain={domain} />
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Data Integrity Panel">
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="Overall provenance" value={commandCenter.dataIntegrity.overallProvenance} />
              <Metric label="GAP-006" value={commandCenter.dataIntegrity.gap006Status} />
              <Metric label="Fixture outputs" value={String(commandCenter.dataIntegrity.fixtureBackedOutputCount)} />
              <Metric label="Live outputs" value={String(commandCenter.dataIntegrity.liveDataBackedOutputCount)} />
              <Metric label="Defined unavailable" value={String(commandCenter.dataIntegrity.definedButUnavailableKpiCount)} />
              <Metric label="Unknown KPIs" value={String(commandCenter.dataIntegrity.unknownKpiCount)} />
              <Metric label="Stale KPIs" value={String(commandCenter.dataIntegrity.staleKpiCount)} />
              <Metric label="Unknown domains" value={String(commandCenter.dataIntegrity.unknownDomainCount)} />
            </div>
            <div className="mt-5 space-y-2 text-sm leading-6 text-white/55">
              {[...commandCenter.dataIntegrity.confidenceLimitations, ...commandCenter.dataIntegrity.freshnessLimitations, ...commandCenter.dataIntegrity.persistenceLimitations].map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </Panel>

          <Panel title="Evidence Drill-Down">
            {commandCenter.materialChanges.slice(0, 5).map((change) => (
              <div key={change.changeId} className="border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
                <h3 className="text-sm font-semibold">{change.title}</h3>
                <div className="mt-3 grid gap-2 text-xs text-white/55 sm:grid-cols-2">
                  <span>Event: {change.drillDown.intelligenceEventId ?? "No event"}</span>
                  <span>Rule: {change.drillDown.detectionRuleId}</span>
                  <span>KPI: {change.drillDown.kpiIds.join(", ") || "No KPI"}</span>
                  <span>Evidence: {change.drillDown.evidence.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {change.drillDown.evaluations.map((evaluation) => (
                    <Link
                      key={evaluation.kpiId}
                      href={`/admin/repository/enterprise-kpis/${encodeURIComponent(evaluation.kpiId)}`}
                      className="block border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:border-white/30 hover:text-white"
                    >
                      {evaluation.kpiId} · {evaluation.status} · {evaluation.provenance}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </Panel>
        </section>

        <section className="mt-8 border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-medium">Known Limitations</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {commandCenter.knownLimitations.map((limitation) => (
              <p key={limitation} className="text-sm leading-6 text-white/55">
                {limitation}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
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
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MaterialChangeRow({ change }: { change: ExecutiveMaterialChange }) {
  return (
    <div className="border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{change.title}</h3>
        <Pill>{change.severity}</Pill>
      </div>
      <p className="mt-2 text-sm leading-6 text-white/55">{change.summary}</p>
      <p className="mt-2 text-xs text-white/40">
        {change.domain} · {change.confidence.level} confidence · {change.freshness.state}
      </p>
    </div>
  );
}

function RiskRow({ risk }: { risk: RiskSignal }) {
  return (
    <div className="border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{risk.condition}</h3>
        <Pill>{risk.severity}</Pill>
      </div>
      <p className="mt-2 text-sm leading-6 text-white/55">{risk.potentialConsequence}</p>
      <p className="mt-2 text-xs text-white/40">
        {risk.affectedDomains.join(", ")} · {risk.confidence.level} confidence · {risk.evidence.length} evidence
      </p>
      <p className="mt-2 text-xs text-white/45">{risk.suggestedInvestigationArea}</p>
    </div>
  );
}

function OpportunityRow({ opportunity }: { opportunity: OpportunitySignal }) {
  return (
    <div className="border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-semibold">{opportunity.condition}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{opportunity.potentialEnterpriseValue}</p>
      <p className="mt-2 text-xs text-white/40">
        {opportunity.relevantDomain} · {opportunity.confidence.level} confidence · {opportunity.evidence.length} evidence · {opportunity.provenance}
      </p>
      <p className="mt-2 text-xs text-white/45">{opportunity.suggestedReviewArea}</p>
    </div>
  );
}

function AttentionRow({ item }: { item: ExecutiveAttentionItem }) {
  return (
    <div className="border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{item.title}</h3>
        <Pill>{item.priority}</Pill>
      </div>
      <p className="mt-2 text-sm leading-6 text-white/55">{item.reasonForAttention}</p>
      <div className="mt-3 grid gap-2 text-xs text-white/45 sm:grid-cols-2">
        <span>ID: {item.stableId}</span>
        <span>Type: {item.type}</span>
        <span>Domain: {item.domain}</span>
        <span>Action: {item.suggestedReviewAction}</span>
        <span>Event: {item.supportingIntelligenceEventId ?? "None"}</span>
        <span>Evidence: {item.evidence.length}</span>
      </div>
    </div>
  );
}

function DomainCard({ domain }: { domain: DomainExecutiveSummary }) {
  return (
    <div className="border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{domain.domain}</h3>
        <Pill>{domain.status}</Pill>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-white/55">
        <span>Score: {domain.score === null ? "UNKNOWN" : domain.score.toFixed(1)}</span>
        <span>Coverage: {domain.coveragePercentage ?? 0}%</span>
        <span>Confidence: {domain.confidence ?? "INSUFFICIENT"}</span>
        <span>Freshness: {domain.freshness ?? "UNKNOWN"}</span>
        <span>Included KPIs: {domain.includedKpis.length}</span>
        <span>Unknown KPIs: {domain.unknownKpis.length}</span>
        <span>Stale KPIs: {domain.staleKpis?.length ?? 0}</span>
      </div>
      <div className="mt-4 space-y-2 text-xs text-white/45">
        <p>
          Positive contributor: {domain.primaryPositiveContributor?.kpiId ?? "Not supported by current evidence"}
        </p>
        <p>
          Negative contributor: {domain.primaryNegativeContributor?.kpiId ?? "Not supported by current evidence"}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="border border-white/10 bg-black/20 p-4 text-sm text-white/50">{text}</p>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/65">
      {children}
    </span>
  );
}
