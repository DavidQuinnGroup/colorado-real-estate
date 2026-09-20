import type {
  ClientCaseObjectivePropertyRelationshipRole,
  ClientCaseObjectivePropertyRelationshipStatus,
  Prisma,
  PrismaClient,
} from '@prisma/client';

export const CLIENT_CASE_OBJECTIVE_PROPERTY_RELATIONSHIPS_VERSION = 'CLIENT_CASE_OBJECTIVE_PROPERTY_RELATIONSHIPS_WAVE_A_V1' as const;

export const OBJECTIVE_PROPERTY_RELATIONSHIP_ROLES = ['SUBJECT', 'CANDIDATE'] as const satisfies readonly ClientCaseObjectivePropertyRelationshipRole[];
export const OBJECTIVE_PROPERTY_RELATIONSHIP_STATUSES = ['ACTIVE', 'ENDED'] as const satisfies readonly ClientCaseObjectivePropertyRelationshipStatus[];

type Database = Pick<
  PrismaClient,
  | 'clientCase'
  | 'clientCaseObjective'
  | 'clientCaseProperty'
  | 'clientCaseObjectivePropertyRelationship'
  | '$transaction'
>;

type RecordValue = Record<string, unknown>;

export type ObjectivePropertyRelationshipSummary = {
  id: string;
  clientCaseId: string;
  objectiveId: string;
  clientCasePropertyId: string;
  role: ClientCaseObjectivePropertyRelationshipRole;
  status: ClientCaseObjectivePropertyRelationshipStatus;
  startedAt: Date;
  endedAt: Date | null;
  createdBySubject: string;
  createdAt: Date;
  updatedAt: Date;
  objective: {
    id: string;
    objectiveType: string;
    status: string;
    title: string;
  };
  clientCaseProperty: {
    id: string;
    canonicalProperty: {
      id: string;
      sourceFormattedSitusAddress: string | null;
      normalizedSitusAddress: string | null;
      city: string | null;
      state: string | null;
      postalCode: string | null;
    };
  };
};

export class ClientCaseObjectivePropertyRelationshipError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT', message: string) {
    super(message);
  }
}

const relationshipSummarySelect = {
  id: true,
  clientCaseId: true,
  objectiveId: true,
  clientCasePropertyId: true,
  role: true,
  status: true,
  startedAt: true,
  endedAt: true,
  createdBySubject: true,
  createdAt: true,
  updatedAt: true,
  objective: {
    select: {
      id: true,
      objectiveType: true,
      status: true,
      title: true,
    },
  },
  clientCaseProperty: {
    select: {
      id: true,
      canonicalProperty: {
        select: {
          id: true,
          sourceFormattedSitusAddress: true,
          normalizedSitusAddress: true,
          city: true,
          state: true,
          postalCode: true,
        },
      },
    },
  },
} satisfies Prisma.ClientCaseObjectivePropertyRelationshipSelect;

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function identifier(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function oneOf<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function rejectUnexpectedKeys(input: RecordValue, allowed: readonly string[]) {
  if (Object.keys(input).some((key) => !allowed.includes(key))) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', 'Relationship input contains unsupported fields.');
  }
}

function linkInput(raw: unknown) {
  const input = object(raw, 'input');
  rejectUnexpectedKeys(input, ['objectiveId', 'clientCasePropertyId', 'role']);
  return {
    objectiveId: identifier(input.objectiveId, 'objectiveId'),
    clientCasePropertyId: identifier(input.clientCasePropertyId, 'clientCasePropertyId'),
    role: oneOf(input.role, OBJECTIVE_PROPERTY_RELATIONSHIP_ROLES, 'role') as ClientCaseObjectivePropertyRelationshipRole,
  };
}

function listInput(raw: unknown) {
  if (raw === undefined) return { status: undefined, take: 100 };
  const input = object(raw, 'list options');
  rejectUnexpectedKeys(input, ['status', 'take']);
  const status = input.status === undefined
    ? undefined
    : oneOf(input.status, OBJECTIVE_PROPERTY_RELATIONSHIP_STATUSES, 'status') as ClientCaseObjectivePropertyRelationshipStatus;
  const take = input.take === undefined ? 100 : input.take;
  if (typeof take !== 'number' || !Number.isInteger(take) || take < 1 || take > 100) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', 'take is invalid.');
  }
  return { status, take };
}

async function ownedCase(prisma: Database, ownerAgentSubject: string, clientCaseId: string) {
  const clientCase = await prisma.clientCase.findFirst({
    where: { id: clientCaseId, ownerAgentSubject },
    select: { id: true, status: true },
  });
  if (!clientCase) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  return clientCase;
}

function isPrismaError(error: unknown, code: string) {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === code);
}

export function createClientCaseObjectivePropertyRelationshipService(prisma: Database) {
  async function authorize(ownerAgentSubject: unknown, clientCaseId: unknown, mutation = false) {
    const subject = identifier(ownerAgentSubject, 'authenticated subject');
    const caseId = identifier(clientCaseId, 'clientCaseId');
    const clientCase = await ownedCase(prisma, subject, caseId);
    if (mutation && clientCase.status !== 'ACTIVE') {
      throw new ClientCaseObjectivePropertyRelationshipError('CONFLICT', 'Archived Client Cases are read-only for Objective-Property relationships.');
    }
    return { subject, caseId };
  }

  async function list(where: Prisma.ClientCaseObjectivePropertyRelationshipWhereInput, take: number) {
    return prisma.clientCaseObjectivePropertyRelationship.findMany({
      where,
      select: relationshipSummarySelect,
      orderBy: [{ startedAt: 'desc' }, { id: 'desc' }],
      take,
    }) as Promise<ObjectivePropertyRelationshipSummary[]>;
  }

  return {
    async link(ownerAgentSubject: string, clientCaseId: string, raw: unknown): Promise<ObjectivePropertyRelationshipSummary> {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = linkInput(raw);
      try {
        return await prisma.$transaction(async (tx) => {
          const [objective, clientCaseProperty] = await Promise.all([
            tx.clientCaseObjective.findFirst({ where: { id: input.objectiveId, clientCaseId: caseId, status: 'ACTIVE' }, select: { id: true } }),
            tx.clientCaseProperty.findFirst({ where: { id: input.clientCasePropertyId, clientCaseId: caseId }, select: { id: true } }),
          ]);
          if (!objective) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The Client Case Objective is unavailable to this Agent.');
          if (!clientCaseProperty) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The Client Case Property is unavailable to this Agent.');
          return tx.clientCaseObjectivePropertyRelationship.create({
            data: {
              clientCaseId: caseId,
              objectiveId: objective.id,
              clientCasePropertyId: clientCaseProperty.id,
              role: input.role,
              createdBySubject: subject,
            },
            select: relationshipSummarySelect,
          });
        });
      } catch (error) {
        if (isPrismaError(error, 'P2002')) throw new ClientCaseObjectivePropertyRelationshipError('CONFLICT', 'That Objective and Client Case Property are already actively linked.');
        throw error;
      }
    },

    async end(ownerAgentSubject: string, clientCaseId: string, relationshipId: string): Promise<ObjectivePropertyRelationshipSummary> {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(relationshipId, 'relationshipId');
      const existing = await prisma.clientCaseObjectivePropertyRelationship.findFirst({
        where: { id, clientCaseId: caseId, status: 'ACTIVE' },
        select: { id: true },
      });
      if (!existing) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The active Objective-Property relationship is unavailable to this Agent.');
      try {
        return await prisma.clientCaseObjectivePropertyRelationship.update({
          where: { id: existing.id },
          data: { status: 'ENDED', endedAt: new Date() },
          select: relationshipSummarySelect,
        });
      } catch (error) {
        if (isPrismaError(error, 'P2025')) throw new ClientCaseObjectivePropertyRelationshipError('CONFLICT', 'The active Objective-Property relationship changed before it could be ended.');
        throw error;
      }
    },

    async listByObjective(ownerAgentSubject: string, clientCaseId: string, objectiveId: string, raw?: unknown) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const id = identifier(objectiveId, 'objectiveId');
      const options = listInput(raw);
      const objective = await prisma.clientCaseObjective.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
      if (!objective) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The Client Case Objective is unavailable to this Agent.');
      return list({ clientCaseId: caseId, objectiveId: objective.id, ...(options.status ? { status: options.status } : {}) }, options.take);
    },

    async listByClientCaseProperty(ownerAgentSubject: string, clientCaseId: string, clientCasePropertyId: string, raw?: unknown) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const id = identifier(clientCasePropertyId, 'clientCasePropertyId');
      const options = listInput(raw);
      const clientCaseProperty = await prisma.clientCaseProperty.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
      if (!clientCaseProperty) throw new ClientCaseObjectivePropertyRelationshipError('NOT_FOUND', 'The Client Case Property is unavailable to this Agent.');
      return list({ clientCaseId: caseId, clientCasePropertyId: clientCaseProperty.id, ...(options.status ? { status: options.status } : {}) }, options.take);
    },

    async listByClientCase(ownerAgentSubject: string, clientCaseId: string, raw?: unknown) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const options = listInput(raw);
      return list({ clientCaseId: caseId, ...(options.status ? { status: options.status } : {}) }, options.take);
    },
  };
}
