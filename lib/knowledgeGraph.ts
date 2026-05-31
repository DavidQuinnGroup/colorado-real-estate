import { knowledgeGraph, type KnowledgeNode } from "@/data/knowledgeGraph";

export type RelatedKnowledgeNode = KnowledgeNode;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getKnowledgeNode(nodeId: string): KnowledgeNode | null {
  const normalizedNodeId = normalize(nodeId);

  return (
    knowledgeGraph.find(
      (node) => normalize(node.id) === normalizedNodeId || normalize(node.slug) === normalizedNodeId,
    ) ?? null
  );
}

export function getRelatedNodes(nodeId: string): RelatedKnowledgeNode[] {
  const node = getKnowledgeNode(nodeId);

  if (!node?.related?.length) {
    return [];
  }

  const relatedIds = new Set(node.related.map(normalize));

  return knowledgeGraph.filter((candidate) => relatedIds.has(normalize(candidate.id)));
}

// lib/knowledgeGraph.ts
