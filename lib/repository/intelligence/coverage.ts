import "server-only";

import { repositorySupabase } from "@/lib/repository/server";

import type { CoverageBreakdown, CoverageReport } from "./types";

type HealthRow = {
  id: string;
  rid: string;
  family: string;
  architecture_layer: string | null;
  enterprise_domain: string | null;
  has_governing_authority: boolean;
  has_active_steward: boolean;
  has_relationships: boolean;
  platform_traceability_ok: boolean;
  capability_lineage_ok: boolean;
};

type ObjectClassificationRow = {
  id: string;
  architecture_layer: string | null;
  enterprise_domain: string | null;
};

function percentage(value: number, total: number): number | null {
  if (total === 0) return null;
  return Number(((value / total) * 100).toFixed(2));
}

function buildBreakdown(
  rows: HealthRow[],
  selector: (row: HealthRow) => string,
): CoverageBreakdown[] {
  const groups = new Map<string, HealthRow[]>();

  for (const row of rows) {
    const key = selector(row) || "UNCLASSIFIED";
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  return [...groups.entries()]
    .map(([key, group]) => {
      const total = group.length;
      const governed = group.filter((row) => row.has_governing_authority).length;
      const stewarded = group.filter((row) => row.has_active_steward).length;
      const related = group.filter((row) => row.has_relationships).length;
      const traceable = group.filter(
        (row) => row.platform_traceability_ok && row.capability_lineage_ok,
      ).length;

      return {
        key,
        total,
        governed,
        stewarded,
        related,
        traceable,
        governance_pct: percentage(governed, total),
        stewardship_pct: percentage(stewarded, total),
        relationship_pct: percentage(related, total),
        traceability_pct: percentage(traceable, total),
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
}

export async function getCoverageReport(): Promise<CoverageReport> {
  const [
    { data: healthData, error: healthError },
    { data: classificationData, error: classificationError },
  ] = await Promise.all([
    repositorySupabase
      .from("repository_object_health")
      .select(
        [
          "id",
          "rid",
          "family",
          "has_governing_authority",
          "has_active_steward",
          "has_relationships",
          "platform_traceability_ok",
          "capability_lineage_ok",
        ].join(","),
      ),
    repositorySupabase
      .from("repository_object")
      .select("id,architecture_layer,enterprise_domain"),
  ]);

  if (healthError) {
    throw new Error(`Unable to load Repository coverage: ${healthError.message}`);
  }

  if (classificationError) {
    throw new Error(
      `Unable to load Repository classifications: ${classificationError.message}`,
    );
  }

  const classifications = new Map(
    ((classificationData ?? []) as unknown as ObjectClassificationRow[]).map(
      (row) => [row.id, row],
    ),
  );
  const rows = ((healthData ?? []) as unknown as Omit<
    HealthRow,
    "architecture_layer" | "enterprise_domain"
  >[]).map((row) => ({
    ...row,
    architecture_layer:
      classifications.get(row.id)?.architecture_layer ?? null,
    enterprise_domain:
      classifications.get(row.id)?.enterprise_domain ?? null,
  }));
  const total = rows.length;
  const governed = rows.filter((row) => row.has_governing_authority).length;
  const stewarded = rows.filter((row) => row.has_active_steward).length;
  const related = rows.filter((row) => row.has_relationships).length;
  const traceable = rows.filter(
    (row) => row.platform_traceability_ok && row.capability_lineage_ok,
  ).length;

  return {
    generated_at: new Date().toISOString(),
    overall: {
      total_objects: total,
      governance_pct: percentage(governed, total),
      stewardship_pct: percentage(stewarded, total),
      relationship_pct: percentage(related, total),
      traceability_pct: percentage(traceable, total),
    },
    by_family: buildBreakdown(rows, (row) => row.family),
    by_architecture_layer: buildBreakdown(
      rows,
      (row) => row.architecture_layer ?? "UNCLASSIFIED",
    ),
    by_enterprise_domain: buildBreakdown(
      rows,
      (row) => row.enterprise_domain ?? "UNCLASSIFIED",
    ),
  };
}
