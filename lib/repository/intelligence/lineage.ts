import "server-only";

import { analyzeDependencies } from "./dependency";
import type { LineageAnalysis } from "./types";

export async function analyzeLineage(
  rid: string,
  maxDepth = 8,
): Promise<LineageAnalysis> {
  const dependency = await analyzeDependencies(rid, maxDepth);

  return {
    root: dependency.root,
    generated_at: new Date().toISOString(),
    upstream_paths: dependency.upstream,
    downstream_paths: dependency.downstream,
    constitutional_ancestors: dependency.upstream.filter((item) =>
      ["CONST", "GOV"].includes(item.family),
    ),
    implementation_descendants: dependency.downstream.filter((item) =>
      ["PLAT", "EXP", "OPS", "MEAS"].includes(item.family),
    ),
  };
}
