import Link from "next/link";

import { getCoverageReport } from "@/lib/repository/intelligence";

export const dynamic = "force-dynamic";

function formatPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(2)}%`;
}

export default async function RepositoryCoveragePage() {
  const coverage = await getCoverageReport();

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/repository"
          className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
        >
          Repository Studio
        </Link>

        <div className="mt-3 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            Architecture Coverage
          </h1>
          <p className="mt-3 text-sm text-white/45">
            Deterministic coverage derived from current Repository state.
          </p>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Governance", coverage.overall.governance_pct],
            ["Stewardship", coverage.overall.stewardship_pct],
            ["Relationships", coverage.overall.relationship_pct],
            ["Traceability", coverage.overall.traceability_pct],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm text-white/45">{label}</p>
              <p className="mt-3 text-3xl font-semibold">
                {formatPercent(value as number | null)}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5">
            <h2 className="text-lg font-medium">Coverage by family</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.12em] text-white/35">
                <tr>
                  <th className="px-5 py-4">Family</th>
                  <th className="px-5 py-4">Objects</th>
                  <th className="px-5 py-4">Governance</th>
                  <th className="px-5 py-4">Stewardship</th>
                  <th className="px-5 py-4">Relationships</th>
                  <th className="px-5 py-4">Traceability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-white/[0.02]">
                {coverage.by_family.map((row) => (
                  <tr key={row.key}>
                    <td className="px-5 py-4 font-medium">{row.key}</td>
                    <td className="px-5 py-4 text-white/60">{row.total}</td>
                    <td className="px-5 py-4 text-white/60">
                      {formatPercent(row.governance_pct)}
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {formatPercent(row.stewardship_pct)}
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {formatPercent(row.relationship_pct)}
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {formatPercent(row.traceability_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
