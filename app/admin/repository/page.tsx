import Link from "next/link";

import { getRepositoryHealth } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

function formatPercent(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return `${Number(value).toFixed(2)}%`;
}

export default async function RepositoryDashboardPage() {
  const health = await getRepositoryHealth();

  const cards = [
    {
      label: "Enterprise Objects",
      value: String(health.total_objects),
      href: "/admin/repository/objects",
    },
    {
      label: "Canonical Objects",
      value: String(health.canonical_objects),
      href: "/admin/repository/objects?lifecycle=CANONICAL",
    },
    {
      label: "Operational Objects",
      value: String(health.operational_objects),
      href: "/admin/repository/objects?lifecycle=OPERATIONAL",
    },
    {
      label: "Governance Coverage",
      value: formatPercent(health.governance_completeness_pct),
      href: "/admin/repository/objects",
    },
    {
      label: "Stewardship Coverage",
      value: formatPercent(health.stewardship_completeness_pct),
      href: "/admin/repository/objects",
    },
    {
      label: "Relationship Coverage",
      value: formatPercent(health.relationship_completeness_pct),
      href: "/admin/repository/objects",
    },
  ];

  const exceptions = [
    {
      label: "Missing governing authority",
      value: health.missing_governing_authority,
    },
    {
      label: "Missing steward",
      value: health.missing_steward,
    },
    {
      label: "Orphan objects",
      value: health.orphan_objects,
    },
    {
      label: "Platform traceability gaps",
      value: health.platform_traceability_gaps,
    },
    {
      label: "Capability lineage gaps",
      value: health.capability_lineage_gaps,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-white/45">
              PROJECT ATLAS
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Repository Studio
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              The governed operational interface to the REIE Enterprise
              Repository.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/repository/search"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              Search
            </Link>
            <Link
              href="/admin/repository/relationships"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              Relationships
            </Link>
            <Link
              href="/admin/repository/objects"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium transition hover:bg-white hover:text-black"
            >
              Explore objects
            </Link>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.05]"
            >
              <p className="text-sm text-white/50">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-tight">
                {card.value}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-medium">Governance watchlist</h2>
            <p className="mt-1 text-sm text-white/45">
              Open completeness and traceability conditions surfaced by the
              Repository.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {exceptions.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-sm text-white/65">{item.label}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-sm font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
