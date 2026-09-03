import { createHash } from 'node:crypto';

import type { ClientCasePartyRole, ClientCasePropertyRole, PrismaClient } from '@prisma/client';

const PARTY_ROLES = ['PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY'] as const satisfies readonly ClientCasePartyRole[];
const PROPERTY_ROLES = ['CURRENT_HOME', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_PROPERTY', 'OTHER'] as const satisfies readonly ClientCasePropertyRole[];

export const CLIENT_CASE_CONTEXT_FOUNDATION_VERSION = 'CANONICAL_CLIENT_CASE_CONTEXT_FOUNDATION_V1' as const;

export class ClientCaseError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;

function record(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new ClientCaseError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function enumValue<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new ClientCaseError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function parseParties(value: unknown) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 8) throw new ClientCaseError('INVALID_REQUEST', 'parties is invalid.');
  return value.map((item) => {
    const party = record(item, 'party');
    return { role: enumValue(party.role, PARTY_ROLES, 'party role') as ClientCasePartyRole, displayLabel: text(party.displayLabel, 'party displayLabel', 160)! };
  });
}

async function ownedCase(prisma: PrismaClient, ownerAgentSubject: string, id: string) {
  const found = await prisma.clientCase.findFirst({ where: { id, ownerAgentSubject } });
  if (!found) throw new ClientCaseError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  return found;
}

export function createClientCaseContextService(prisma: PrismaClient) {
  async function detail(ownerAgentSubject: string, id: string) {
    const clientCase = await prisma.clientCase.findFirst({
      where: { id, ownerAgentSubject },
      include: {
        parties: { orderBy: { createdAt: 'asc' } },
        properties: { include: { canonicalProperty: { select: { id: true, sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true, postalCode: true } } }, orderBy: { createdAt: 'asc' } },
        transactions: { select: { id: true, label: true, side: true, stage: true, updatedAt: true }, orderBy: { updatedAt: 'desc' }, take: 12 },
      },
    });
    if (!clientCase) throw new ClientCaseError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    return clientCase;
  }

  return {
    async listOwned(ownerAgentSubject: string, archived = false) {
      return prisma.clientCase.findMany({
        where: { ownerAgentSubject, status: archived ? 'ARCHIVED' : 'ACTIVE' },
        select: { id: true, displayName: true, status: true, archivedAt: true, createdAt: true, updatedAt: true, _count: { select: { parties: true, properties: true, transactions: true } } },
        orderBy: { updatedAt: 'desc' },
        take: 100,
      });
    },

    detail,

    async create(ownerAgentSubject: string, raw: unknown) {
      const input = record(raw);
      const displayName = text(input.displayName, 'displayName', 160)!;
      const clientMutationKey = text(input.clientMutationKey, 'clientMutationKey', 160)!;
      const parties = parseParties(input.parties);
      const idempotencyKey = `ATLAS_CLIENT_CASE_V1|${ownerAgentSubject}|${fingerprint({ displayName, clientMutationKey })}`;
      const existing = await prisma.clientCase.findUnique({ where: { idempotencyKey } });
      if (existing) return detail(ownerAgentSubject, existing.id);
      return prisma.clientCase.create({ data: { ownerAgentSubject, displayName, createdBySubject: ownerAgentSubject, idempotencyKey, parties: parties.length ? { create: parties } : undefined }, include: { parties: true, properties: { include: { canonicalProperty: true } }, transactions: true } });
    },

    async update(ownerAgentSubject: string, id: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, id);
      const input = record(raw);
      const displayName = text(input.displayName, 'displayName', 160)!;
      await prisma.clientCase.update({ where: { id }, data: { displayName } });
      return detail(ownerAgentSubject, id);
    },

    async archive(ownerAgentSubject: string, id: string) {
      const clientCase = await ownedCase(prisma, ownerAgentSubject, id);
      if (clientCase.status === 'ARCHIVED') return detail(ownerAgentSubject, id);
      await prisma.clientCase.update({ where: { id }, data: { status: 'ARCHIVED', archivedAt: new Date() } });
      return detail(ownerAgentSubject, id);
    },

    async reactivate(ownerAgentSubject: string, id: string) {
      const clientCase = await ownedCase(prisma, ownerAgentSubject, id);
      if (clientCase.status === 'ACTIVE') return detail(ownerAgentSubject, id);
      await prisma.clientCase.update({ where: { id }, data: { status: 'ACTIVE', archivedAt: null } });
      return detail(ownerAgentSubject, id);
    },

    async addParty(ownerAgentSubject: string, id: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, id);
      const input = record(raw);
      await prisma.clientCaseParty.create({ data: { clientCaseId: id, role: enumValue(input.role, PARTY_ROLES, 'role') as ClientCasePartyRole, displayLabel: text(input.displayLabel, 'displayLabel', 160)! } });
      return detail(ownerAgentSubject, id);
    },

    async attachProperty(ownerAgentSubject: string, id: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, id);
      const input = record(raw);
      const canonicalPropertyId = text(input.canonicalPropertyId, 'canonicalPropertyId', 160)!;
      if (!await prisma.canonicalPhysicalProperty.findUnique({ where: { id: canonicalPropertyId }, select: { id: true } })) throw new ClientCaseError('NOT_FOUND', 'The canonical property is unavailable.');
      try {
        await prisma.clientCaseProperty.create({ data: { clientCaseId: id, canonicalPropertyId, role: enumValue(input.role, PROPERTY_ROLES, 'role') as ClientCasePropertyRole } });
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002') throw new ClientCaseError('CONFLICT', 'That property is already attached to this Client Case.');
        throw error;
      }
      return detail(ownerAgentSubject, id);
    },

    async updatePropertyRole(ownerAgentSubject: string, id: string, propertyId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, id);
      const input = record(raw);
      const relation = await prisma.clientCaseProperty.findFirst({ where: { id: propertyId, clientCaseId: id } });
      if (!relation) throw new ClientCaseError('NOT_FOUND', 'The Client Case property relationship is unavailable.');
      await prisma.clientCaseProperty.update({ where: { id: propertyId }, data: { role: enumValue(input.role, PROPERTY_ROLES, 'role') as ClientCasePropertyRole } });
      return detail(ownerAgentSubject, id);
    },

    async attachTransaction(ownerAgentSubject: string, id: string, transactionId: string) {
      await ownedCase(prisma, ownerAgentSubject, id);
      const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, ownerAgentSubject }, select: { id: true, clientCaseId: true } });
      if (!transaction) throw new ClientCaseError('OWNERSHIP_DENIED', 'The transaction is unavailable to this Agent.');
      if (transaction.clientCaseId && transaction.clientCaseId !== id) throw new ClientCaseError('CONFLICT', 'The transaction is already attached to another Client Case.');
      await prisma.transaction.update({ where: { id: transactionId }, data: { clientCaseId: id } });
      return detail(ownerAgentSubject, id);
    },
  };
}
