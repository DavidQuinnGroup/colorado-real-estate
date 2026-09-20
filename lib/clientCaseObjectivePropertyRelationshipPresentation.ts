import type { ObjectivePropertyRelationshipSummary } from './clientCaseObjectivePropertyRelationships';
import { clientCasePropertyDisplayLabel } from './clientCasePropertyRelationshipRoles';

export type AgentRelationshipRole = 'SUBJECT' | 'CANDIDATE';
export type AgentRelationshipStatus = 'ACTIVE' | 'ENDED';

export type AgentPropertyDisplaySummary = {
  clientCasePropertyId: string;
  label: string;
  location: string | null;
};

export type AgentObjectiveDisplaySummary = {
  objectiveId: string;
  objectiveType: string;
  title: string;
};

export type AgentObjectivePropertyRelationshipSummary = {
  relationshipId: string;
  clientCasePropertyId: string;
  objectiveId: string;
  role: AgentRelationshipRole | string;
  status: AgentRelationshipStatus | string;
  startedAt: string;
  endedAt: string | null;
  property: AgentPropertyDisplaySummary;
  objective: AgentObjectiveDisplaySummary;
};

export function relationshipRoleDefault(objectiveType: string): AgentRelationshipRole | null {
  if (objectiveType === 'SELL_CURRENT_HOME') return 'SUBJECT';
  if (objectiveType === 'BUY_PRIMARY_HOME' || objectiveType === 'INVESTMENT_ACQUISITION') return 'CANDIDATE';
  return null;
}

export function relationshipRoleLabel(role: string) {
  if (role === 'SUBJECT') return 'Property being sold';
  if (role === 'CANDIDATE') return 'Property being considered';
  return 'Unknown relationship role';
}

export function relationshipStatusLabel(status: string) {
  if (status === 'ACTIVE') return 'Current';
  if (status === 'ENDED') return 'Past';
  return 'Unknown relationship status';
}

function propertySummary(relationship: ObjectivePropertyRelationshipSummary): AgentPropertyDisplaySummary {
  const property = relationship.clientCaseProperty.canonicalProperty;
  return {
    clientCasePropertyId: relationship.clientCasePropertyId,
    label: clientCasePropertyDisplayLabel(property),
    location: [property.city, property.state, property.postalCode].filter(Boolean).join(', ') || null,
  };
}

export function presentObjectivePropertyRelationship(relationship: ObjectivePropertyRelationshipSummary): AgentObjectivePropertyRelationshipSummary {
  return {
    relationshipId: relationship.id,
    clientCasePropertyId: relationship.clientCasePropertyId,
    objectiveId: relationship.objectiveId,
    role: relationship.role,
    status: relationship.status,
    startedAt: relationship.startedAt.toISOString(),
    endedAt: relationship.endedAt?.toISOString() ?? null,
    property: propertySummary(relationship),
    objective: {
      objectiveId: relationship.objective.id,
      objectiveType: relationship.objective.objectiveType,
      title: relationship.objective.title,
    },
  };
}
