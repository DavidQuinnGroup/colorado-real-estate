import Link from "next/link";

import { getRepositoryObjects } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    family?: string;
    lifecycle?: string;
    q?: string;
  }>;
};

export default async function RepositoryObjectsPage({
  searchParams,
}: PageProps) {
  const filters = await searchParams;

  const objects = await getRepositoryObjects({
    family: filters.family,
    lifecycle: filters.lifecycle,
    query: filters.q,
    limit: 250,
  });

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
              Enterprise Objects
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {objects.length} governed objects in the current result.
            </p>
          </div>

          <form className="flex w-full max-w-xl gap-2" method="get">
            <input
              name="q"
              defaultValue={filters.q ?? ""}
              placeholder="Search name, RID, or CID"
              className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />
            <button
              type="submit"
              className="h-11 rounded-full bg-white px-5 text-sm font-medium text-black"
            >
              Search
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.14em] text-white/40">
                <tr>
                  <th className="px-5 py-4 font-medium">Object</th>
                  <th className="px-5 py-4 font-medium">Family</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">State</th>
                  <th className="px-5 py-4 font-medium">Steward</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10 bg-white/[0.02]">
                {objects.map((object) => (
                  <tr key={object.id} className="hover:bg-white/[0.04]">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/repository/object/${encodeURIComponent(object.rid)}`}
                        className="font-medium hover:underline"
                      >
                        {object.official_name}
                      </Link>
                      <div className="mt-1 text-xs text-white/35">
                        {object.rid}
                        {object.cid ? ` · ${object.cid}` : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/65">
                      {object.family}
                    </td>
                    <td className="px-5 py-4 text-white/65">
                      {object.object_type}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                        {object.lifecycle_state}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/55">
                      {object.primary_steward_rid ?? "Unassigned"}
                    </td>
                  </tr>
                ))}

                {objects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-white/45"
                    >
                      No Repository objects matched this query.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
