import type { AgentObjectivePropertyRelationshipSummary } from '@/lib/clientCaseObjectivePropertyRelationshipPresentation';

const ROUTE = '/api/agent/client-case-objective-property-relationships';

export type RelationshipResponse = {
  clientCaseId: string;
  relationships: AgentObjectivePropertyRelationshipSummary[];
};

function message(payload: unknown, fallback: string) {
  return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : fallback;
}

async function response<T>(request: Promise<Response>, fallback: string): Promise<T> {
  const result = await request;
  const payload = await result.json() as T & { error?: string };
  if (!result.ok) throw new Error(message(payload, fallback));
  return payload;
}

export function fetchCurrentObjectivePropertyRelationships(clientCaseId: string) {
  return response<RelationshipResponse>(fetch(`${ROUTE}?clientCaseId=${encodeURIComponent(clientCaseId)}&view=active`, { cache: 'no-store' }), 'Current Property relationships are unavailable.');
}

export function fetchObjectivePropertyRelationshipHistory(clientCaseId: string, objectiveId: string) {
  return response<RelationshipResponse>(fetch(`${ROUTE}?clientCaseId=${encodeURIComponent(clientCaseId)}&view=history&objectiveId=${encodeURIComponent(objectiveId)}`, { cache: 'no-store' }), 'Relationship history is unavailable.');
}

export function mutateObjectivePropertyRelationship(clientCaseId: string, action: 'LINK' | 'END', input: Record<string, string>) {
  return response<{ relationship: AgentObjectivePropertyRelationshipSummary }>(fetch(ROUTE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, clientCaseId, input }),
  }), 'The Property relationship could not be updated.');
}
