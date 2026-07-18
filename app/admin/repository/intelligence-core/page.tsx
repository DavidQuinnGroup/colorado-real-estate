import Link from "next/link";
import type React from "react";

import {
  buildIntelligenceEvents,
  buildIntelligenceHealthSnapshot,
  detectKpiTransitions,
  detectOpportunitySignals,
  detectRiskSignals,
  getKpiTrends,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export default function IntelligenceCorePage() {
  const snapshot = buildIntelligenceHealthSnapshot();
  const trends = getKpiTrends();
  const transitions = detectKpiTransitions();
  const risks = detectRiskSignals();
  const opportunities = detectOpportunitySignals();
  const events = buildIntelligenceEvents();

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-white/10 pb-7">
          <Link
            href="/admin/repository"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Repository Studio
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Intelligence Core
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Deterministic EIF 1.0 Sprint 2 intelligence. All current output is
            fixture-backed and must not be presented as live enterprise health.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Overall Status" value={snapshot.overallStatus} />
          <Metric label="Overall Score" value={snapshot.overallScore?.toFixed(1) ?? "UNKNOWN"} />
          <Metric label="Confidence" value={snapshot.confidence ?? "INSUFFICIENT"} />
          <Metric label="Provenance" value={snapshot.provenance} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Domain Health">
            <div className="divide-y divide-white/10">
              {snapshot.domainResults.map((domain) => (
                <div key={domain.domain} className="grid grid-cols-5 gap-3 py-3 text-sm">
                  <span className="font-medium">{domain.domain}</span>
                  <span className="text-white/60">{domain.status}</span>
                  <span className="text-white/60">{domain.score?.toFixed(1) ?? "UNKNOWN"}</span>
                  <span className="text-white/60">{domain.coveragePercentage ?? 0}% coverage</span>
                  <span className="text-white/45">{domain.freshness ?? "UNKNOWN"}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Data Coverage">
            <div className="grid gap-3 text-sm text-white/65">
              <div>Included KPIs: {snapshot.includedKpis.length}</div>
              <div>Unknown KPIs: {snapshot.unknownKpis.length}</div>
              <div>Included domains: {snapshot.includedDomains?.join(", ") || "None"}</div>
              <div>Excluded domains: {snapshot.excludedDomains?.join(", ") || "None"}</div>
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <Panel title="KPI Trends">
            {trends.slice(0, 8).map((trend) => (
              <Row key={trend.kpiId} label={trend.kpiId} value={trend.trend} />
            ))}
          </Panel>
          <Panel title="Recent Transitions">
            {transitions.slice(0, 8).map((transition) => (
              <Row
                key={transition.transitionId}
                label={transition.kpiId}
                value={`${transition.previousStatus} -> ${transition.currentStatus}`}
              />
            ))}
          </Panel>
          <Panel title="Intelligence Events">
            {events.slice(0, 8).map((event) => (
              <Row key={event.eventId} label={event.eventClass} value={event.severity} />
            ))}
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Risk Signals">
            {risks.map((risk) => (
              <div key={risk.signalId} className="border-b border-white/10 py-3 last:border-b-0">
                <p className="text-sm font-medium">{risk.condition}</p>
                <p className="mt-1 text-xs text-white/50">
                  {risk.severity} · {risk.confidence.level} · {risk.affectedDomains.join(", ")}
                </p>
              </div>
            ))}
          </Panel>
          <Panel title="Opportunity Signals">
            {opportunities.map((opportunity) => (
              <div key={opportunity.signalId} className="border-b border-white/10 py-3 last:border-b-0">
                <p className="text-sm font-medium">{opportunity.condition}</p>
                <p className="mt-1 text-xs text-white/50">
                  {opportunity.relevantDomain} · {opportunity.confidence.level}
                </p>
              </div>
            ))}
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-3 text-xl font-semibold">{value}</p>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2 text-sm last:border-b-0">
      <span className="text-white/65">{label}</span>
      <span className="text-white/45">{value}</span>
    </div>
  );
}
