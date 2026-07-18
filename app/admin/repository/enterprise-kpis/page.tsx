import Link from "next/link";

import {
  buildEnterpriseHealthSnapshot,
  listEnterpriseKpis,
  type KpiStatus,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    domain?: string;
  }>;
};

function statusClass(status: KpiStatus) {
  if (status === "HEALTHY") return "border-emerald-400/30 text-emerald-200";
  if (status === "WARNING") return "border-amber-400/30 text-amber-200";
  if (status === "CRITICAL") return "border-red-400/30 text-red-200";
  return "border-white/10 text-white/55";
}

function formatValue(value: number | null | undefined, unit: string) {
  if (value === null || value === undefined) return "Unavailable";
  if (unit === "PERCENT") return `${value}%`;
  if (unit === "MILLISECONDS") return `${value} ms`;
  return String(value);
}

export default async function EnterpriseKpiRegistryPage({
  searchParams,
}: PageProps) {
  const filters = await searchParams;
  const domain = filters.domain;
  const definitions = listEnterpriseKpis(
    domain &&
      ["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"].includes(domain)
      ? { domain: domain as never }
      : {},
  );
  const snapshot = buildEnterpriseHealthSnapshot();
  const evaluationById = new Map(
    snapshot.evaluations.map((evaluation) => [evaluation.kpi.id, evaluation]),
  );

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin/repository"
              className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
            >
              Repository Studio
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Enterprise KPI Registry
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
              Canonical EIF 1.0 Sprint 1 measurement definitions. Fixture-backed
              health demonstrations are labeled and are not live enterprise health.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/admin/repository/enterprise-kpis?domain=${item}`}
                  className="border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:border-white/30 hover:text-white"
                >
                  {item}
                </Link>
              ),
            )}
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Demonstration Status
            </p>
            <p className="mt-3 text-2xl font-semibold">{snapshot.overallStatus}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Included KPIs
            </p>
            <p className="mt-3 text-2xl font-semibold">
              {snapshot.includedKpis.length}
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              Provenance
            </p>
            <p className="mt-3 text-lg font-semibold">{snapshot.provenance}</p>
          </div>
        </section>

        <div className="overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-4 font-medium">KPI</th>
                  <th className="px-5 py-4 font-medium">Domain</th>
                  <th className="px-5 py-4 font-medium">Owner</th>
                  <th className="px-5 py-4 font-medium">Source</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Latest</th>
                  <th className="px-5 py-4 font-medium">Freshness</th>
                  <th className="px-5 py-4 font-medium">Thresholds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.02]">
                {definitions.map((definition) => {
                  const evaluation = evaluationById.get(definition.id);
                  return (
                    <tr key={definition.id} className="hover:bg-white/[0.04]">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/repository/enterprise-kpis/${encodeURIComponent(definition.id)}`}
                          className="font-medium hover:underline"
                        >
                          {definition.name}
                        </Link>
                        <div className="mt-1 text-xs text-white/35">{definition.id}</div>
                      </td>
                      <td className="px-5 py-4 text-white/65">{definition.domain}</td>
                      <td className="px-5 py-4 text-white/55">
                        {definition.executiveOwnerRole}
                      </td>
                      <td className="px-5 py-4">
                        <span className="border border-white/10 px-2 py-1 text-xs text-white/65">
                          {definition.source.availability}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`border px-2 py-1 text-xs ${statusClass(
                            evaluation?.status ?? "UNKNOWN",
                          )}`}
                        >
                          {evaluation?.status ?? "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/65">
                        {formatValue(evaluation?.observation?.value, definition.unit)}
                      </td>
                      <td className="px-5 py-4 text-white/55">
                        {evaluation?.freshness ?? "UNKNOWN"}
                      </td>
                      <td className="px-5 py-4 text-xs text-white/50">
                        Target {definition.thresholds.target ?? "n/a"} · Warn{" "}
                        {definition.thresholds.warning ?? "n/a"} · Critical{" "}
                        {definition.thresholds.critical ?? "n/a"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
