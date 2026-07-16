import Link from "next/link";
import { notFound } from "next/navigation";

import { getRepositoryRelationshipByRid } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    relationshipRid: string;
  }>;
};

export default async function RepositoryRelationshipDetailPage({
  params,
}: PageProps) {
  const { relationshipRid } = await params;
  const relationship = await getRepositoryRelationshipByRid(
    decodeURIComponent(relationshipRid),
  );

  if (!relationship) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-white/10 pb-8">
          <Link
            href="/admin/repository/relationships"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Relationship Navigator
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {relationship.relationship_type_code}
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {relationship.relationship_rid}
          </p>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Link
            href={`/admin/repository/object/${encodeURIComponent(
              relationship.source.rid,
            )}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-white/35">
              Source
            </p>
            <h2 className="mt-3 text-xl font-medium">
              {relationship.source.official_name}
            </h2>
            <p className="mt-2 text-sm text-white/40">
              {relationship.source.rid} · {relationship.source.family}
            </p>
          </Link>

          <div className="text-center">
            <div className="text-2xl text-white/35">→</div>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/40">
              {relationship.relationship_type_code}
            </p>
          </div>

          <Link
            href={`/admin/repository/object/${encodeURIComponent(
              relationship.target.rid,
            )}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-white/35">
              Target
            </p>
            <h2 className="mt-3 text-xl font-medium">
              {relationship.target.official_name}
            </h2>
            <p className="mt-2 text-sm text-white/40">
              {relationship.target.rid} · {relationship.target.family}
            </p>
          </Link>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-medium">Governance record</h2>

          <dl className="mt-5 grid gap-x-8 md:grid-cols-2">
            <div className="border-b border-white/10 py-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/35">
                Status
              </dt>
              <dd className="mt-2 text-sm text-white/70">
                {relationship.status}
              </dd>
            </div>

            <div className="border-b border-white/10 py-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/35">
                Traceability
              </dt>
              <dd className="mt-2 text-sm text-white/70">
                {relationship.traceability_status}
              </dd>
            </div>

            <div className="border-b border-white/10 py-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/35">
                Confidence
              </dt>
              <dd className="mt-2 text-sm text-white/70">
                {relationship.confidence ?? "—"}
              </dd>
            </div>

            <div className="border-b border-white/10 py-4">
              <dt className="text-xs uppercase tracking-[0.14em] text-white/35">
                Created
              </dt>
              <dd className="mt-2 text-sm text-white/70">
                {relationship.created_at}
              </dd>
            </div>
          </dl>

          <div className="pt-5">
            <p className="text-xs uppercase tracking-[0.14em] text-white/35">
              Notes
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/65">
              {relationship.notes || "—"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
