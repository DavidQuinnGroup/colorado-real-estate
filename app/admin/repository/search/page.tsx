import Link from "next/link";

import { searchRepository } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    family?: string;
  }>;
};

const families = [
  "",
  "CONST",
  "PUB",
  "ARCH",
  "CAP",
  "ENG",
  "KNOW",
  "GOV",
  "PLAT",
  "EXP",
  "OPS",
  "MEAS",
  "IP",
];

export default async function RepositorySearchPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = query
    ? await searchRepository({
        query,
        family: params.family || undefined,
        limit: 75,
      })
    : [];

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-white/10 pb-8">
          <Link
            href="/admin/repository"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Repository Studio
          </Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Enterprise Search
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Search governed objects, identifiers, definitions, purposes, and
            registered relationships.
          </p>

          <form
            method="get"
            className="mt-7 grid gap-3 md:grid-cols-[1fr_180px_auto]"
          >
            <input
              name="q"
              defaultValue={query}
              placeholder="Search the REIE Repository"
              autoFocus
              className="h-12 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
            />

            <select
              name="family"
              defaultValue={params.family ?? ""}
              className="h-12 rounded-full border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none focus:border-white/30"
            >
              {families.map((family) => (
                <option key={family || "ALL"} value={family}>
                  {family || "All families"}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-12 rounded-full bg-white px-6 text-sm font-medium text-black"
            >
              Search
            </button>
          </form>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-white/45">
              {query
                ? `${results.length} results for “${query}”`
                : "Enter a search term to begin."}
            </p>

            <Link
              href="/admin/repository/relationships"
              className="text-sm text-white/55 hover:text-white"
            >
              Browse relationships
            </Link>
          </div>

          <div className="space-y-3">
            {results.map((result) => (
              <Link
                key={`${result.result_type}-${result.rid}`}
                href={result.href}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white/45">
                        {result.result_type}
                      </span>
                      {result.family ? (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white/45">
                          {result.family}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-3 text-lg font-medium">{result.title}</h2>
                    <p className="mt-1 text-sm text-white/45">
                      {result.subtitle} · {result.rid}
                    </p>

                    {result.matched_text ? (
                      <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-white/60">
                        {result.matched_text}
                      </p>
                    ) : null}
                  </div>

                  <span className="text-xs text-white/30">
                    Relevance {result.score}
                  </span>
                </div>
              </Link>
            ))}

            {query && results.length === 0 ? (
              <div className="rounded-2xl border border-white/10 px-6 py-14 text-center text-sm text-white/45">
                No governed Repository records matched this query.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
