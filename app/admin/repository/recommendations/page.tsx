import Link from "next/link";

import { getRepositoryRecommendations } from "@/lib/repository/intelligence";

export const dynamic = "force-dynamic";

export default async function RepositoryRecommendationsPage() {
  const recommendations = await getRepositoryRecommendations();

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/repository"
          className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
        >
          Repository Studio
        </Link>

        <div className="mt-3 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-semibold tracking-tight">
            Governance Recommendations
          </h1>
          <p className="mt-3 text-sm text-white/45">
            Deterministic guidance generated from Repository health conditions.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {recommendations.map((recommendation) => (
            <Link
              key={recommendation.recommendation_id}
              href={`/admin/repository/object/${encodeURIComponent(
                recommendation.object_rid,
              )}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
                      {recommendation.severity}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
                      {recommendation.type}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-medium">
                    {recommendation.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {recommendation.object_name} · {recommendation.object_rid}
                  </p>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-white/65">
                    {recommendation.explanation}
                  </p>
                  <p className="mt-3 text-sm text-white/75">
                    {recommendation.suggested_action}
                  </p>
                </div>

                <div className="text-sm text-white/40">
                  Confidence {(recommendation.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </Link>
          ))}

          {recommendations.length === 0 ? (
            <div className="rounded-2xl border border-white/10 px-6 py-14 text-center text-sm text-white/45">
              No governance recommendations are currently open.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
