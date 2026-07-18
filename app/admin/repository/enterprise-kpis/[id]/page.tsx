import Link from "next/link";
import { notFound } from "next/navigation";

import { getEnterpriseKpi, getLatestKpiEvaluations } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/75">{value ?? "Unavailable"}</p>
    </div>
  );
}

export default async function EnterpriseKpiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const definition = getEnterpriseKpi(id);
  if (!definition) notFound();

  const evaluation =
    getLatestKpiEvaluations().find((item) => item.kpi.id === definition.id) ?? null;

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b border-white/10 pb-7">
          <Link
            href="/admin/repository/enterprise-kpis"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white"
          >
            Enterprise KPI Registry
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {definition.name}
          </h1>
          <p className="mt-2 text-sm text-white/45">{definition.id}</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <Field label="Domain" value={definition.domain} />
          <Field label="Owner" value={definition.executiveOwnerRole} />
          <Field label="Lifecycle" value={definition.lifecycle} />
          <Field label="Source availability" value={definition.source.availability} />
          <Field label="Current status" value={evaluation?.status ?? "UNKNOWN"} />
          <Field label="Freshness" value={evaluation?.freshness ?? "UNKNOWN"} />
        </section>

        <section className="mt-8 grid gap-4">
          <Field label="Description" value={definition.description} />
          <Field label="Business purpose" value={definition.businessPurpose} />
          <Field label="Formula" value={definition.formula} />
          <Field label="Source-system definition" value={definition.source.definition} />
          <Field label="Governance notes" value={definition.governanceNotes} />
          <Field
            label="Latest observation"
            value={
              evaluation?.observation
                ? `${evaluation.observation.value ?? "Unavailable"} (${evaluation.observation.provenance})`
                : "Unavailable"
            }
          />
          <Field
            label="Thresholds"
            value={`Target ${definition.thresholds.target ?? "n/a"} · Warning ${
              definition.thresholds.warning ?? "n/a"
            } · Critical ${definition.thresholds.critical ?? "n/a"}`}
          />
          <Field
            label="Health inclusion"
            value={
              evaluation?.includedInHealth
                ? "Included"
                : evaluation?.exclusionReason ?? "No trustworthy observation is available."
            }
          />
        </section>
      </div>
    </main>
  );
}
