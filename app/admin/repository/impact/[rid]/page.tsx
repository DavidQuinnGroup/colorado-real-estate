import Link from "next/link";
import { notFound } from "next/navigation";

import { analyzeImpact } from "@/lib/repository/intelligence";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ rid: string }>;
};

export default async function RepositoryImpactPage({ params }: PageProps) {
  const { rid } = await params;

  let analysis;
  try {
    analysis = await analyzeImpact(decodeURIComponent(rid), 8);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/admin/repository/object/${encodeURIComponent(analysis.root.rid)}`}
          className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
        >
          {analysis.root.official_name}
        </Link>

        <div className="mt-3 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Impact Analysis
            </h1>
            <p className="mt-2 text-sm text-white/45">{analysis.root.rid}</p>
          </div>

          <div className="rounded-full border border-white/15 px-4 py-2 text-sm">
            Risk: {analysis.risk} · {analysis.risk_score}/100
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Affected objects", analysis.summary.total_affected_objects],
            ["Direct impacts", analysis.summary.direct_count],
            ["Indirect impacts", analysis.summary.indirect_count],
            ["Platform objects", analysis.summary.affected_platform_objects],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm text-white/45">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-medium">Review requirements</h2>
          </div>

          <div className="flex flex-wrap gap-3 p-6">
            {analysis.review_requirements.length ? (
              analysis.review_requirements.map((requirement) => (
                <span
                  key={requirement}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
                >
                  {requirement}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/45">
                No additional review requirements detected.
              </span>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-medium">Affected objects</h2>
          </div>

          <div className="divide-y divide-white/10">
            {[...analysis.direct_impacts, ...analysis.indirect_impacts].map(
              (item) => (
                <Link
                  key={item.rid}
                  href={`/admin/repository/object/${encodeURIComponent(item.rid)}`}
                  className="grid gap-3 px-6 py-4 hover:bg-white/[0.03] md:grid-cols-[90px_1fr_180px]"
                >
                  <span className="text-xs text-white/35">
                    Depth {item.depth}
                  </span>
                  <span className="text-sm font-medium">
                    {item.official_name}
                  </span>
                  <span className="text-xs text-white/40">
                    {item.via_relationship_type}
                  </span>
                </Link>
              ),
            )}

            {analysis.summary.total_affected_objects === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-white/45">
                No downstream impact was detected.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
