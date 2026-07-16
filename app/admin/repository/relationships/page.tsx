import Link from "next/link";

import { getRepositoryRelationships } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    type?: string;
    status?: string;
    traceability?: string;
  }>;
};

export default async function RepositoryRelationshipsPage({
  searchParams,
}: PageProps) {
  const filters = await searchParams;

  const relationships = await getRepositoryRelationships({
    type: filters.type,
    status: filters.status,
    traceability: filters.traceability,
    limit: 250,
  });

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-white/10 pb-8">
          <Link
            href="/admin/repository"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Repository Studio
          </Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Relationship Navigator
          </h1>
          <p className="mt-3 text-sm text-white/50">
            {relationships.length} governed relationships in the current view.
          </p>

          <form
            method="get"
            className="mt-6 grid gap-3 md:grid-cols-4"
          >
            <input
              name="type"
              defaultValue={filters.type ?? ""}
              placeholder="Relationship type"
              className="h-11 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />
            <input
              name="status"
              defaultValue={filters.status ?? ""}
              placeholder="Status"
              className="h-11 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />
            <input
              name="traceability"
              defaultValue={filters.traceability ?? ""}
              placeholder="Traceability status"
              className="h-11 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />
            <button
              type="submit"
              className="h-11 rounded-full bg-white px-5 text-sm font-medium text-black"
            >
              Apply filters
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {relationships.map((relationship) => (
            <Link
              key={relationship.relationship_rid}
              href={`/admin/repository/relationship/${encodeURIComponent(
                relationship.relationship_rid,
              )}`}
              className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.05] md:grid-cols-[1fr_190px_1fr_130px]"
            >
              <div>
                <p className="font-medium">{relationship.source.official_name}</p>
                <p className="mt-1 text-xs text-white/35">
                  {relationship.source.rid} · {relationship.source.family}
                </p>
              </div>

              <div className="md:text-center">
                <p className="text-sm font-medium text-white/70">
                  {relationship.relationship_type_code}
                </p>
                <p className="mt-1 text-xs text-white/35">
                  {relationship.traceability_status}
                </p>
              </div>

              <div>
                <p className="font-medium">{relationship.target.official_name}</p>
                <p className="mt-1 text-xs text-white/35">
                  {relationship.target.rid} · {relationship.target.family}
                </p>
              </div>

              <div className="md:text-right">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                  {relationship.status}
                </span>
              </div>
            </Link>
          ))}

          {relationships.length === 0 ? (
            <div className="rounded-2xl border border-white/10 px-6 py-14 text-center text-sm text-white/45">
              No Repository relationships matched these filters.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
