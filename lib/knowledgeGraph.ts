import { knowledgeGraph } from "@/data/knowledgeGraph"

export function getRelatedNodes(nodeId: string) {

  const node = knowledgeGraph.find(n => n.id === nodeId)

  if (!node || !node.related) return []

  return knowledgeGraph.filter(n =>
    node.related?.includes(n.id)
  )
}