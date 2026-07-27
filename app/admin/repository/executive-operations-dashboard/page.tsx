import Link from "next/link";
import type React from "react";

import {
  buildEoiOperationalDashboardRoutePayload,
  type EoiOperationalDashboardRouteSection,
} from "@/lib/eoi/operationalDashboardRouteAdapter";

export const dynamic = "force-dynamic";

function classificationClass(classification: EoiOperationalDashboardRouteSection["evidenceClassification"]) {
  if (classification === "GOVERNED_FACT") return "border-emerald-400/30 text-emerald-200";
  if (classification === "GOVERNED_METADATA") return "border-sky-400/30 text-sky-200";
  if (classification === "HUMAN_INTERPRETATION") return "border-amber-400/30 text-amber-200";
  return "border-white/15 text-white/60";
}

export default function ExecutiveOperationsDashboardPage() {
  const dashboard = buildEoiOperationalDashboardRoutePayload();

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
                PROJECT ATLAS / EOI 1.0
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                Executive Operations Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
                Protected administrative dashboard for governed operational metadata.
                This view does not compute live KPIs, trends, analytics, or operational
                recommendations.
              </p>
            </div>
            <div className="border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              PROTECTED READ-ONLY
            </div>
          </div>
        </header>

        <section
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Dashboard governance labels: READ-ONLY, GOVERNED METADATA, NO LIVE KPI COMPUTATION, NO TREND ANALYSIS, NO OPERATIONAL AUTOMATION"
        >
          {dashboard.labels.map((label) => (
            <span
              key={label}
              className="border border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70"
            >
              {label}
            </span>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Governed source metadata">
          <Metric label="KPI Definitions" value={String(dashboard.sourceMetadata.kpiDefinitionCount)} />
          <Metric label="Summary Sections" value={String(dashboard.sourceMetadata.summarySectionCount)} />
          <Metric label="Live Observations" value={String(dashboard.sourceMetadata.liveObservationCount)} />
          <Metric label="Dashboard Mode" value={dashboard.generatedFrom} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Source Contracts">
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric label="KPI Source" value={dashboard.sourceKpiContractVersion} />
              <Metric label="Summary Source" value={dashboard.sourceSummaryContractVersion} />
              <Metric label="Access" value={dashboard.access} />
              <Metric label="Read Only" value={String(dashboard.readOnly)} />
            </div>
          </Panel>

          <Panel title="Disabled Runtime Capabilities">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Capability label="Live KPI computation" enabled={dashboard.liveKpiComputationAuthorized} />
              <Capability label="Trend analysis" enabled={dashboard.trendAnalysisAuthorized} />
              <Capability label="Analytics" enabled={dashboard.analyticsAuthorized} />
              <Capability label="Operational automation" enabled={dashboard.automationAuthorized} />
              <Capability label="Telemetry" enabled={dashboard.telemetryAuthorized} />
              <Capability label="Persistence or mutation" enabled={dashboard.persistenceAuthorized || dashboard.mutationAuthorized} />
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-2" aria-label="Operational dashboard sections">
          {dashboard.sections.map((section) => (
            <article key={section.identifier} className="border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                    {section.identifier}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{section.displayName}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">{section.purpose}</p>
                </div>
                <span className={`w-fit border px-2 py-1 text-xs ${classificationClass(section.evidenceClassification)}`}>
                  {section.evidenceClassification}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <Metadata label="Governing Source" value={section.governingSource} />
                <Metadata label="Owner" value={section.owner} />
                <Metadata label="Confidence" value={section.confidence} />
                <Metadata label="Freshness" value={section.freshness} />
                <Metadata label="Boundary" value={section.interpretationBoundary} />
              </dl>

              <ul className="mt-5 space-y-2 text-sm leading-6 text-white/55">
                {section.displayItems.map((item) => (
                  <li key={item} className="border-l border-white/10 pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-8 border border-white/10 bg-white/[0.03] p-5" aria-label="Operational dashboard boundaries">
          <h2 className="text-lg font-semibold">Governance Boundaries</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-white/55 md:grid-cols-2">
            {dashboard.boundaries.map((boundary) => (
              <li key={boundary} className="border-l border-white/10 pl-3">
                {boundary}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
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
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-3 break-words text-xl font-semibold">{value}</p>
    </div>
  );
}

function Capability({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-2 text-sm font-semibold text-emerald-200">
        {enabled ? "AUTHORIZED" : "NOT AUTHORIZED"}
      </p>
    </div>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-white/75">{value}</dd>
    </div>
  );
}
