import "server-only";

import { findRootNode, loadRepositoryGraph, traverseGraph } from "./core";
import type { DependencyAnalysis } from "./types";

export async function analyzeDependencies(
  rid: string,
  maxDepth = 8,
): Promise<DependencyAnalysis> {
  const { nodes, edges } = await loadRepositoryGraph();
  const root = findRootNode(nodes, rid);

  const upstream = traverseGraph({
    root,
    nodes,
    edges,
    direction: "UPSTREAM",
    maxDepth,
  });

  const downstream = traverseGraph({
    root,
    nodes,
    edges,
    direction: "DOWNSTREAM",
    maxDepth,
  });

  const uniqueIds = new Set([
    ...upstream.items.map((item) => item.id),
    ...downstream.items.map((item) => item.id),
  ]);

  const maxObservedDepth = Math.max(
    0,
    ...upstream.items.map((item) => item.depth),
    ...downstream.items.map((item) => item.depth),
  );

  return {
    root,
    max_depth: maxDepth,
    upstream: upstream.items,
    downstream: downstream.items,
    circular_paths: [...upstream.circularPaths, ...downstream.circularPaths],
    statistics: {
      upstream_count: upstream.items.length,
      downstream_count: downstream.items.length,
      total_unique_objects: uniqueIds.size,
      max_observed_depth: maxObservedDepth,
    },
  };
}
