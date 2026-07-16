import "server-only";

import { repositorySupabase } from "@/lib/repository/server";

import type {
  RepositoryEdge,
  RepositoryNode,
  TraversalNode,
} from "./types";

const UPSTREAM_RELATIONSHIPS = new Set([
  "DERIVES_FROM",
  "GOVERNED_BY",
  "JUSTIFIED_BY",
  "DEFINED_BY",
  "PART_OF",
  "DEPENDS_ON",
  "PUBLISHED_IN",
  "STEWARDED_BY",
]);

const DOWNSTREAM_RELATIONSHIPS = new Set([
  "IMPLEMENTS",
  "IMPLEMENTED_BY",
  "REALIZES",
  "REALIZED_BY",
  "CONTAINS",
  "DEFINES",
  "REFERENCES",
  "MEASURED_BY",
  "VALIDATED_BY",
]);

export async function loadRepositoryGraph(): Promise<{
  nodes: RepositoryNode[];
  edges: RepositoryEdge[];
}> {
  const [{ data: nodes, error: nodeError }, { data: edges, error: edgeError }] =
    await Promise.all([
      repositorySupabase
        .from("repository_object")
        .select(
          [
            "id",
            "rid",
            "cid",
            "official_name",
            "family",
            "object_type",
            "lifecycle_state",
            "stability_class",
            "governing_authority",
            "primary_steward_rid",
          ].join(","),
        ),
      repositorySupabase
        .from("repository_relationship")
        .select(
          [
            "relationship_rid",
            "relationship_type_code",
            "status",
            "traceability_status",
            "confidence",
            "source_object_id",
            "target_object_id",
          ].join(","),
        )
        .in("status", ["ACTIVE", "PROPOSED"]),
    ]);

  if (nodeError) {
    throw new Error(`Unable to load Repository graph nodes: ${nodeError.message}`);
  }

  if (edgeError) {
    throw new Error(`Unable to load Repository graph edges: ${edgeError.message}`);
  }

  return {
    nodes: (nodes ?? []) as unknown as RepositoryNode[],
    edges: (edges ?? []) as unknown as RepositoryEdge[],
  };
}

export function findRootNode(
  nodes: RepositoryNode[],
  rid: string,
): RepositoryNode {
  const root = nodes.find((node) => node.rid === rid);

  if (!root) {
    throw new Error(`Repository object not found: ${rid}`);
  }

  return root;
}

export function traverseGraph(params: {
  root: RepositoryNode;
  nodes: RepositoryNode[];
  edges: RepositoryEdge[];
  direction: "UPSTREAM" | "DOWNSTREAM";
  maxDepth: number;
}): {
  items: TraversalNode[];
  circularPaths: string[][];
} {
  const nodeById = new Map(params.nodes.map((node) => [node.id, node]));
  const queue: Array<{
    node: RepositoryNode;
    depth: number;
    path: string[];
    viaEdge: RepositoryEdge | null;
  }> = [
    {
      node: params.root,
      depth: 0,
      path: [params.root.id],
      viaEdge: null,
    },
  ];

  const visitedAtDepth = new Map<string, number>([[params.root.id, 0]]);
  const items: TraversalNode[] = [];
  const circularPaths: string[][] = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || current.depth >= params.maxDepth) {
      continue;
    }

    const matchingEdges = params.edges.filter((edge) => {
      if (params.direction === "UPSTREAM") {
        return (
          edge.source_object_id === current.node.id &&
          UPSTREAM_RELATIONSHIPS.has(edge.relationship_type_code)
        );
      }

      return (
        edge.source_object_id === current.node.id &&
        DOWNSTREAM_RELATIONSHIPS.has(edge.relationship_type_code)
      );
    });

    for (const edge of matchingEdges) {
      const nextId = edge.target_object_id;
      const nextNode = nodeById.get(nextId);

      if (!nextNode) {
        continue;
      }

      if (current.path.includes(nextId)) {
        circularPaths.push([...current.path, nextId]);
        continue;
      }

      const nextDepth = current.depth + 1;
      const previousDepth = visitedAtDepth.get(nextId);

      if (previousDepth !== undefined && previousDepth <= nextDepth) {
        continue;
      }

      visitedAtDepth.set(nextId, nextDepth);

      items.push({
        ...nextNode,
        depth: nextDepth,
        via_relationship_rid: edge.relationship_rid,
        via_relationship_type: edge.relationship_type_code,
        direction: params.direction,
      });

      queue.push({
        node: nextNode,
        depth: nextDepth,
        path: [...current.path, nextId],
        viaEdge: edge,
      });
    }
  }

  return {
    items,
    circularPaths,
  };
}
