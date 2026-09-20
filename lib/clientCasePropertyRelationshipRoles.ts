import type {
  ClientCasePropertyRelationshipRoleStatus,
  ClientCasePropertyRelationshipRoleType,
  ClientCasePropertyRole,
  PrismaClient,
} from '@prisma/client';

export const CLIENT_CASE_PROPERTY_RELATIONSHIP_ROLES_VERSION = 'CLIENT_CASE_PROPERTY_RELATIONSHIP_ROLES_WAVE_B_V1' as const;

export const RELATIONSHIP_ROLES = ['CURRENT_HOME', 'TARGET_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_RELEVANT', 'OTHER'] as const satisfies readonly ClientCasePropertyRelationshipRoleType[];

export const LEGACY_ROLE_TO_RELATIONSHIP_ROLE = Object.freeze({
  CURRENT_HOME: 'CURRENT_HOME',
  NEW_PRIMARY: 'TARGET_PRIMARY',
  INVESTMENT_PROPERTY: 'INVESTMENT_PROPERTY',
  SALE_PROPERTY: 'SALE_RELEVANT',
  OTHER: 'OTHER',
} as const satisfies Record<ClientCasePropertyRole, ClientCasePropertyRelationshipRoleType>);

export const RELATIONSHIP_ROLE_TO_LEGACY_ROLE = Object.freeze({
  CURRENT_HOME: 'CURRENT_HOME',
  TARGET_PRIMARY: 'NEW_PRIMARY',
  INVESTMENT_PROPERTY: 'INVESTMENT_PROPERTY',
  SALE_RELEVANT: 'SALE_PROPERTY',
  OTHER: 'OTHER',
} as const satisfies Record<ClientCasePropertyRelationshipRoleType, ClientCasePropertyRole>);

export const RELATIONSHIP_ROLE_LABELS = Object.freeze({
  CURRENT_HOME: 'Current home',
  TARGET_PRIMARY: 'Primary-home target',
  INVESTMENT_PROPERTY: 'Investment property',
  SALE_RELEVANT: 'Planning to sell',
  OTHER: 'Other property',
} as const satisfies Record<ClientCasePropertyRelationshipRoleType, string>);

type Database = Pick<
  PrismaClient,
  | 'clientCase'
  | 'canonicalPhysicalProperty'
  | 'clientCaseProperty'
  | 'clientCasePropertyRelationshipRole'
  | '$transaction'
>;

type RecordValue = Record<string, unknown>;

export class ClientCasePropertyRelationshipError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum = 160, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function role(value: unknown): ClientCasePropertyRelationshipRoleType {
  if (typeof value !== 'string' || !(RELATIONSHIP_ROLES as readonly string[]).includes(value)) throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', 'Relationship role is unsupported.');
  return value as ClientCasePropertyRelationshipRoleType;
}

function roles(value: unknown): ClientCasePropertyRelationshipRoleType[] {
  const entries = Array.isArray(value) ? value : [value];
  if (!entries.length || entries.length > RELATIONSHIP_ROLES.length) throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', 'At least one relationship role is required.');
  const parsed = entries.map(role);
  if (new Set(parsed).size !== parsed.length) throw new ClientCasePropertyRelationshipError('INVALID_REQUEST', 'Relationship roles must not contain duplicates.');
  return parsed;
}

export function clientCasePropertyDisplayLabel(property: { sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null; postalCode: string | null; id: string }) {
  const address = property.sourceFormattedSitusAddress || property.normalizedSitusAddress || property.id;
  const place = [property.city, property.state, property.postalCode].filter(Boolean).join(', ');
  return place && address !== property.id ? `${address} · ${place}` : address;
}

export function activeRelationshipRoles<T extends { relationshipRoles?: Array<{ status: ClientCasePropertyRelationshipRoleStatus; role: ClientCasePropertyRelationshipRoleType }> ; role: ClientCasePropertyRole }>(property: T) {
  const normalized = property.relationshipRoles?.filter((entry) => entry.status === 'ACTIVE').map((entry) => entry.role) ?? [];
  return normalized.length ? normalized : [LEGACY_ROLE_TO_RELATIONSHIP_ROLE[property.role]];
}

export function relationshipRoleSummary(property: { relationshipRoles?: Array<{ status: ClientCasePropertyRelationshipRoleStatus; role: ClientCasePropertyRelationshipRoleType }> ; role: ClientCasePropertyRole }) {
  return activeRelationshipRoles(property).map((entry) => RELATIONSHIP_ROLE_LABELS[entry]);
}

export function createClientCasePropertyRelationshipService(prisma: Database) {
  async function ownedCase(ownerAgentSubject: string, clientCaseId: string) {
    const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true, status: true } });
    if (!clientCase) throw new ClientCasePropertyRelationshipError('OWNERSHIP_DENIED', 'The Client Case is unavailable to this Agent.');
    return clientCase;
  }

  async function ownedProperty(ownerAgentSubject: string, clientCaseId: string, clientCasePropertyId: string) {
    await ownedCase(ownerAgentSubject, clientCaseId);
    const property = await prisma.clientCaseProperty.findFirst({
      where: { id: clientCasePropertyId, clientCaseId, clientCase: { ownerAgentSubject } },
      include: { canonicalProperty: true, relationshipRoles: { orderBy: [{ status: 'asc' }, { startedAt: 'asc' }] } },
    });
    if (!property) throw new ClientCasePropertyRelationshipError('NOT_FOUND', 'The Client Case property relationship is unavailable.');
    return property;
  }

  async function ensureActiveRole(clientCasePropertyId: string, nextRole: ClientCasePropertyRelationshipRoleType, actor: string) {
    const existing = await prisma.clientCasePropertyRelationshipRole.findFirst({ where: { clientCasePropertyId, role: nextRole, status: 'ACTIVE' }, select: { id: true } });
    if (existing) throw new ClientCasePropertyRelationshipError('CONFLICT', 'That relationship role is already active for this property.');
    return prisma.clientCasePropertyRelationshipRole.create({ data: { clientCasePropertyId, role: nextRole, status: 'ACTIVE', createdBySubject: actor } });
  }

  async function listProperties(ownerAgentSubject: string, clientCaseId: string) {
    await ownedCase(ownerAgentSubject, clientCaseId);
    const properties = await prisma.clientCaseProperty.findMany({
      where: { clientCaseId, clientCase: { ownerAgentSubject } },
      include: {
        canonicalProperty: { select: { id: true, sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true, postalCode: true } },
        relationshipRoles: { orderBy: [{ status: 'asc' }, { startedAt: 'asc' }, { createdAt: 'asc' }] },
        facts: { where: { semanticKey: 'PROPERTY_OCCUPANCY_STATUS', supersededAt: null }, orderBy: { createdAt: 'desc' }, take: 1 },
        scenarioPropertyDispositions: { include: { scenarioVersion: { select: { id: true, versionNumber: true, scenario: { select: { id: true, name: true, currentVersionId: true } } } } }, orderBy: { createdAt: 'desc' }, take: 8 },
      },
      orderBy: { createdAt: 'asc' },
    });
    return properties.map((property) => ({
      ...property,
      displayLabel: clientCasePropertyDisplayLabel(property.canonicalProperty),
      activeRelationshipRoleLabels: relationshipRoleSummary(property),
      legacyRoleReadBehavior: property.relationshipRoles.some((entry) => entry.status === 'ACTIVE') ? 'NORMALIZED_AUTHORITATIVE' : 'LEGACY_FALLBACK',
    }));
  }

  return {
    listProperties,

    async detail(ownerAgentSubject: string, clientCaseId: string, clientCasePropertyId: string) {
      await ownedProperty(ownerAgentSubject, clientCaseId, clientCasePropertyId);
      return (await listProperties(ownerAgentSubject, clientCaseId)).find((property) => property.id === clientCasePropertyId) ?? null;
    },

    async attachExistingProperty(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const input = object(raw, 'input');
      const canonicalPropertyId = text(input.canonicalPropertyId, 'canonicalPropertyId')!;
      const nextRoles = roles(input.roles ?? input.role);
      await ownedCase(ownerAgentSubject, clientCaseId);
      const canonical = await prisma.canonicalPhysicalProperty.findUnique({ where: { id: canonicalPropertyId }, select: { id: true } });
      if (!canonical) throw new ClientCasePropertyRelationshipError('NOT_FOUND', 'The canonical property is unavailable.');
      try {
        await prisma.$transaction(async (tx) => {
          let anchor = await tx.clientCaseProperty.findFirst({ where: { clientCaseId, canonicalPropertyId }, select: { id: true } });
          if (!anchor) {
            anchor = await tx.clientCaseProperty.create({ data: { clientCaseId, canonicalPropertyId, role: RELATIONSHIP_ROLE_TO_LEGACY_ROLE[nextRoles[0]] }, select: { id: true } });
          }
          for (const nextRole of nextRoles) {
            const existing = await tx.clientCasePropertyRelationshipRole.findFirst({ where: { clientCasePropertyId: anchor.id, role: nextRole, status: 'ACTIVE' }, select: { id: true } });
            if (!existing) await tx.clientCasePropertyRelationshipRole.create({ data: { clientCasePropertyId: anchor.id, role: nextRole, status: 'ACTIVE', createdBySubject: ownerAgentSubject } });
          }
        });
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002') throw new ClientCasePropertyRelationshipError('CONFLICT', 'That property or relationship role is already linked.');
        if (error instanceof ClientCasePropertyRelationshipError) throw error;
        throw new ClientCasePropertyRelationshipError('PERSISTENCE_UNAVAILABLE', 'The property relationship could not be saved.');
      }
      return listProperties(ownerAgentSubject, clientCaseId);
    },

    async addRelationshipRole(ownerAgentSubject: string, clientCaseId: string, clientCasePropertyId: string, raw: unknown) {
      const input = object(raw, 'input');
      const property = await ownedProperty(ownerAgentSubject, clientCaseId, clientCasePropertyId);
      try {
        await ensureActiveRole(property.id, role(input.role), ownerAgentSubject);
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002') throw new ClientCasePropertyRelationshipError('CONFLICT', 'That relationship role is already active for this property.');
        throw error;
      }
      return listProperties(ownerAgentSubject, clientCaseId);
    },

    async endRelationshipRole(ownerAgentSubject: string, clientCaseId: string, relationshipRoleId: string) {
      await ownedCase(ownerAgentSubject, clientCaseId);
      const existing = await prisma.clientCasePropertyRelationshipRole.findFirst({
        where: { id: relationshipRoleId, status: 'ACTIVE', clientCaseProperty: { clientCaseId, clientCase: { ownerAgentSubject } } },
        select: { id: true },
      });
      if (!existing) throw new ClientCasePropertyRelationshipError('NOT_FOUND', 'The active relationship role is unavailable.');
      await prisma.clientCasePropertyRelationshipRole.update({ where: { id: relationshipRoleId }, data: { status: 'ENDED', endedAt: new Date() } });
      return listProperties(ownerAgentSubject, clientCaseId);
    },
  };
}
