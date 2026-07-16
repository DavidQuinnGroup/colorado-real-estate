import "server-only";

import { analyzeDependencies } from "./dependency";
import type { ImpactAnalysis, ImpactRisk, TraversalNode } from "./types";

function countBy<T extends string>(
  items: TraversalNode[],
  selector: (item: TraversalNode) => T,
): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function computeRiskScore(items: TraversalNode[]): number {
  let score = 0;

  for (const item of items) {
    score += item.depth === 1 ? 8 : 3;

    if (item.family === "CONST") score += 15;
    if (item.family === "ARCH") score += 10;
    if (item.family === "CAP") score += 8;
    if (item.family === "PLAT") score += 6;
    if (item.family === "GOV") score += 8;

    if (item.stability_class === "C1_CONSTITUTIONAL") score += 15;
    if (item.stability_class === "C2_ARCHITECTURAL") score += 10;
  }

  return Math.min(100, score);
}

function classifyRisk(score: number): ImpactRisk {
  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MEDIUM";
  return "LOW";
}

export async function analyzeImpact(
  rid: string,
  maxDepth = 8,
): Promise<ImpactAnalysis> {
  const dependency = await analyzeDependencies(rid, maxDepth);
  const allImpacts = dependency.downstream;
  const direct = allImpacts.filter((item) => item.depth === 1);
  const indirect = allImpacts.filter((item) => item.depth > 1);

  const riskScore = computeRiskScore(allImpacts);
  const reviewRequirements = new Set<string>();

  if (dependency.root.stability_class === "C1_CONSTITUTIONAL") {
    reviewRequirements.add("Constitutional Review");
  }

  if (
    allImpacts.some(
      (item) =>
        item.family === "ARCH" || item.stability_class === "C2_ARCHITECTURAL",
    )
  ) {
    reviewRequirements.add("Enterprise Architecture Review");
  }

  if (allImpacts.some((item) => item.family === "PLAT")) {
    reviewRequirements.add("Platform Implementation Review");
  }

  if (allImpacts.some((item) => item.family === "GOV")) {
    reviewRequirements.add("Governance Review");
  }

  return {
    root: dependency.root,
    generated_at: new Date().toISOString(),
    risk: classifyRisk(riskScore),
    risk_score: riskScore,
    direct_impacts: direct,
    indirect_impacts: indirect,
    affected_by_family: countBy(allImpacts, (item) => item.family),
    affected_relationship_types: countBy(
      allImpacts,
      (item) => item.via_relationship_type ?? "UNKNOWN",
    ),
    review_requirements: [...reviewRequirements],
    summary: {
      total_affected_objects: allImpacts.length,
      direct_count: direct.length,
      indirect_count: indirect.length,
      affected_capabilities: allImpacts.filter((item) => item.family === "CAP")
        .length,
      affected_platform_objects: allImpacts.filter(
        (item) => item.family === "PLAT",
      ).length,
      affected_governance_objects: allImpacts.filter(
        (item) => item.family === "GOV",
      ).length,
      affected_publications: allImpacts.filter((item) => item.family === "PUB")
        .length,
    },
  };
}
