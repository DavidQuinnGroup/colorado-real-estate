import Link from "next/link";
import { notFound } from "next/navigation";

import { getRepositoryObjectByRid } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    rid: string;
  }>;
};

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <dt className="text-xs uppercase tracking-[0.14em] text-white/35">
        {label}
      </dt>
      <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">
        {value === null || value === undefined || value === "" ? "—" : value}
      </dd>
    </div>
  );
}

export default async function RepositoryObjectDetailPage({
  params,
}: PageProps) {
  const { rid } = await params;
  const result = await getRepositoryObjectByRid(decodeURIComponent(rid));

  if (!result) {
    notFound();
  }

  const { object, relationships } = result;

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-white/10 pb-8">
          <Link
            href="/admin/repository/objects"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Enterprise Objects
          </Link>

          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                {object.official_name}
              </h1>
              <p className="mt-3 text-sm text-white/45">
                {object.rid}
                {object.cid ? ` · ${object.cid}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {object.family}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                {object.lifecycle_state}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                v{object.version_major}.{object.version_minor}.
                {object.version_patch}
              </span>
              <Link
                href={`/admin/repository/impact/${encodeURIComponent(
                  object.rid,
                )}`}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white hover:text-black"
              >
                Impact
              </Link>
              <Link
                href={`/admin/repository/timeline/${encodeURIComponent(
                  object.rid,
                )}`}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white hover:text-black"
              >
                Timeline
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-medium">Enterprise record</h2>

            <dl className="mt-4">
              <Field label="Canonical definition" value={object.canonical_definition} />
              <Field label="Purpose" value={object.purpose} />
              <Field label="Description" value={object.description} />
              <Field label="Scope" value={object.scope} />
              <Field label="Exclusions" value={object.exclusions} />
              <Field label="Object type" value={object.object_type} />
              <Field label="Enterprise domain" value={object.enterprise_domain} />
              <Field label="Architecture layer" value={object.architecture_layer} />
              <Field label="Capability domain" value={object.capability_domain} />
              <Field label="Canon collection" value={object.canon_collection} />
              <Field label="Stability class" value={object.stability_class} />
            </dl>
          </section>

          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-medium">Governance</h2>

              <dl className="mt-4">
                <Field label="Authority" value={object.governing_authority} />
                <Field
                  label="Governing publication"
                  value={object.governing_publication_rid}
                />
                <Field
                  label="Governing office"
                  value={object.governing_office_rid}
                />
                <Field
                  label="Primary steward"
                  value={object.primary_steward_rid}
                />
                <Field
                  label="Implementation owner"
                  value={object.implementation_owner}
                />
                <Field label="Approval status" value={object.approval_status} />
                <Field label="Next review" value={object.next_review_at} />
              </dl>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-medium">Implementation</h2>

              <dl className="mt-4">
                <Field
                  label="Technical location"
                  value={object.technical_location}
                />
                <Field label="Runtime status" value={object.runtime_status} />
                <Field label="Evidence status" value={object.evidence_status} />
              </dl>
            </section>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-medium">Relationships</h2>
            <p className="mt-1 text-sm text-white/45">
              Incoming and outgoing governed relationships.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {relationships.map((relationship) => (
              <div
                key={relationship.relationship_rid}
                className="grid gap-3 px-6 py-5 md:grid-cols-[130px_180px_1fr_120px]"
              >
                <span className="text-xs uppercase tracking-[0.14em] text-white/35">
                  {relationship.direction}
                </span>

                <span className="text-sm text-white/65">
                  {relationship.relationship_type_code}
                </span>

                <Link
                  href={`/admin/repository/object/${encodeURIComponent(
                    relationship.related_rid,
                  )}`}
                  className="text-sm font-medium hover:underline"
                >
                  {relationship.related_name}
                  <span className="ml-2 text-xs text-white/35">
                    {relationship.related_rid}
                  </span>
                </Link>

                <span className="text-xs text-white/45">
                  {relationship.traceability_status}
                </span>
              </div>
            ))}

            {relationships.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-white/45">
                No relationships are registered for this object.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
