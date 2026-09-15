import type {
  ClientCaseAdvisoryRole,
  ClientCasePartyRole,
  ClientCaseParticipationStatus,
  ContactEntityType,
  ContactLifecycleStatus,
  ContactMethodKind,
  PrismaClient,
} from '@prisma/client';

export const CLIENT_INFORMATION_WAVE_A_FOUNDATION_VERSION = 'CLIENT_INFORMATION_WAVE_A_FOUNDATION_V1' as const;

export const CONTACT_ENTITY_TYPES = ['PERSON', 'ORGANIZATION'] as const satisfies readonly ContactEntityType[];
export const CONTACT_METHOD_KINDS = ['EMAIL', 'PHONE'] as const satisfies readonly ContactMethodKind[];
export const CONTACT_LIFECYCLE_STATUSES = ['ACTIVE', 'INACTIVE'] as const satisfies readonly ContactLifecycleStatus[];
export const CASE_PARTICIPATION_ROLES = ['PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY'] as const satisfies readonly ClientCasePartyRole[];
export const CASE_PARTICIPATION_STATUSES = ['ACTIVE', 'ENDED'] as const satisfies readonly ClientCaseParticipationStatus[];
export const CASE_ADVISORY_ROLES = ['BUYER', 'SELLER', 'INVESTOR', 'AUTHORIZED_PARTICIPANT', 'CO_PARTICIPANT'] as const satisfies readonly ClientCaseAdvisoryRole[];

type ContactDatabase = Pick<
  PrismaClient,
  'clientCase' | 'clientCaseParty' | 'clientCasePartyAdvisoryRole' | 'contact' | 'contactMethod' | '$transaction'
>;
type RecordValue = Record<string, unknown>;

export class ClientInformationWaveAError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientInformationWaveAError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new ClientInformationWaveAError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientInformationWaveAError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function enumValue<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new ClientInformationWaveAError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

export function normalizeContactEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeContactPhone(value: string) {
  const trimmed = value.trim();
  const leadingPlus = trimmed.startsWith('+') ? '+' : '';
  const digits = trimmed.replace(/\D/g, '');
  return `${leadingPlus}${digits}`;
}

function normalizeMethod(kind: ContactMethodKind, displayValue: string) {
  if (kind === 'EMAIL') {
    const normalized = normalizeContactEmail(displayValue);
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(normalized)) throw new ClientInformationWaveAError('INVALID_REQUEST', 'email is invalid.');
    return normalized;
  }
  const normalized = normalizeContactPhone(displayValue);
  if (normalized.replace(/\D/g, '').length < 7 || normalized.replace(/\D/g, '').length > 15) throw new ClientInformationWaveAError('INVALID_REQUEST', 'phone is invalid.');
  return normalized;
}

function parseMethods(value: unknown) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 8) throw new ClientInformationWaveAError('INVALID_REQUEST', 'contact methods are invalid.');
  return value.map((entry) => {
    const input = object(entry, 'contact method');
    const kind = enumValue(input.kind, CONTACT_METHOD_KINDS, 'contact method kind') as ContactMethodKind;
    const displayValue = text(input.displayValue, 'contact method displayValue', 180)!;
    return {
      kind,
      displayValue,
      normalizedValue: normalizeMethod(kind, displayValue),
      isPrimary: input.isPrimary === true,
      lifecycleStatus: enumValue(input.lifecycleStatus ?? 'ACTIVE', CONTACT_LIFECYCLE_STATUSES, 'contact method lifecycleStatus') as ContactLifecycleStatus,
    };
  });
}

async function ownedCase(prisma: ContactDatabase, ownerAgentSubject: string, clientCaseId: string) {
  const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
  if (!clientCase) throw new ClientInformationWaveAError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  return clientCase;
}

async function ownedContact(prisma: ContactDatabase, ownerAgentSubject: string, contactId: string) {
  const contact = await prisma.contact.findFirst({ where: { id: contactId, ownerAgentSubject } });
  if (!contact) throw new ClientInformationWaveAError('OWNERSHIP_DENIED', 'The Contact is unavailable to this Agent.');
  return contact;
}

function contactInput(raw: unknown) {
  const input = object(raw, 'contact');
  return {
    displayName: text(input.displayName, 'displayName', 160)!,
    givenName: text(input.givenName, 'givenName', 100, false),
    familyName: text(input.familyName, 'familyName', 100, false),
    entityType: enumValue(input.entityType ?? 'PERSON', CONTACT_ENTITY_TYPES, 'entityType') as ContactEntityType,
    lifecycleStatus: enumValue(input.lifecycleStatus ?? 'ACTIVE', CONTACT_LIFECYCLE_STATUSES, 'lifecycleStatus') as ContactLifecycleStatus,
    methods: parseMethods(input.methods),
  };
}

function participationInput(raw: unknown) {
  const input = object(raw, 'participation');
  const advisoryRoles = input.advisoryRoles === undefined || input.advisoryRoles === null ? [] : input.advisoryRoles;
  if (!Array.isArray(advisoryRoles) || advisoryRoles.length > CASE_ADVISORY_ROLES.length) throw new ClientInformationWaveAError('INVALID_REQUEST', 'advisoryRoles are invalid.');
  const roles = advisoryRoles.map((role) => enumValue(role, CASE_ADVISORY_ROLES, 'advisory role') as ClientCaseAdvisoryRole);
  if (new Set(roles).size !== roles.length) throw new ClientInformationWaveAError('INVALID_REQUEST', 'advisoryRoles contain duplicates.');
  return {
    role: enumValue(input.role ?? 'ADDITIONAL_CLIENT', CASE_PARTICIPATION_ROLES, 'participation role') as ClientCasePartyRole,
    advisoryRoles: roles,
  };
}

async function replaceMethods(prisma: ContactDatabase, contactId: string, methods: ReturnType<typeof parseMethods>) {
  if (!methods.length) return;
  await prisma.contactMethod.updateMany({ where: { contactId }, data: { lifecycleStatus: 'INACTIVE', isPrimary: false } });
  for (const method of methods) {
    if (method.isPrimary) await prisma.contactMethod.updateMany({ where: { contactId, kind: method.kind }, data: { isPrimary: false } });
    await prisma.contactMethod.create({ data: { contactId, ...method } });
  }
}

async function replaceAdvisoryRoles(prisma: ContactDatabase, clientCasePartyId: string, roles: readonly ClientCaseAdvisoryRole[]) {
  await prisma.clientCasePartyAdvisoryRole.deleteMany({ where: { clientCasePartyId } });
  if (roles.length) await prisma.clientCasePartyAdvisoryRole.createMany({ data: roles.map((role) => ({ clientCasePartyId, role })), skipDuplicates: true });
}

export function createClientInformationWaveAService(prisma: ContactDatabase) {
  return {
    async listPeople(ownerAgentSubject: string, clientCaseId: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const [contacts, participations] = await Promise.all([
        prisma.contact.findMany({
          where: { ownerAgentSubject },
          include: { methods: { where: { lifecycleStatus: 'ACTIVE' }, orderBy: [{ kind: 'asc' }, { isPrimary: 'desc' }, { createdAt: 'asc' }] } },
          orderBy: [{ lifecycleStatus: 'asc' }, { updatedAt: 'desc' }],
          take: 100,
        }),
        prisma.clientCaseParty.findMany({
          where: { clientCaseId },
          include: { contact: { include: { methods: { where: { lifecycleStatus: 'ACTIVE' }, orderBy: [{ kind: 'asc' }, { isPrimary: 'desc' }, { createdAt: 'asc' }] } } }, advisoryRoles: { orderBy: { role: 'asc' } } },
          orderBy: [{ participationStatus: 'asc' }, { createdAt: 'asc' }],
        }),
      ]);
      return { contacts, participations };
    },

    async duplicateCandidates(ownerAgentSubject: string, raw: unknown) {
      const methods = parseMethods(object(raw, 'duplicate candidate request').methods);
      const signals = methods.map((method) => ({ kind: method.kind, normalizedValue: method.normalizedValue }));
      if (!signals.length) return [];
      return prisma.contact.findMany({
        where: {
          ownerAgentSubject,
          methods: { some: { OR: signals, lifecycleStatus: 'ACTIVE' } },
        },
        include: { methods: { where: { lifecycleStatus: 'ACTIVE' }, orderBy: [{ kind: 'asc' }, { isPrimary: 'desc' }, { createdAt: 'asc' }] } },
        orderBy: { updatedAt: 'desc' },
        take: 12,
      });
    },

    async createContact(ownerAgentSubject: string, raw: unknown) {
      const input = contactInput(raw);
      return prisma.$transaction(async (tx) => {
        const contact = await tx.contact.create({ data: { ownerAgentSubject, displayName: input.displayName, givenName: input.givenName, familyName: input.familyName, entityType: input.entityType, lifecycleStatus: input.lifecycleStatus, createdBySubject: ownerAgentSubject } });
        await replaceMethods(tx as never, contact.id, input.methods);
        return tx.contact.findUniqueOrThrow({ where: { id: contact.id }, include: { methods: { orderBy: [{ kind: 'asc' }, { createdAt: 'asc' }] } } });
      });
    },

    async updateContact(ownerAgentSubject: string, contactId: string, raw: unknown) {
      await ownedContact(prisma, ownerAgentSubject, contactId);
      const input = contactInput(raw);
      return prisma.$transaction(async (tx) => {
        await tx.contact.update({ where: { id: contactId }, data: { displayName: input.displayName, givenName: input.givenName, familyName: input.familyName, entityType: input.entityType, lifecycleStatus: input.lifecycleStatus } });
        await replaceMethods(tx as never, contactId, input.methods);
        return tx.contact.findUniqueOrThrow({ where: { id: contactId }, include: { methods: { orderBy: [{ kind: 'asc' }, { createdAt: 'asc' }] } } });
      });
    },

    async createContactAndParticipation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const request = object(raw);
      const contact = contactInput(request.contact);
      const participation = participationInput(request.participation);
      return prisma.$transaction(async (tx) => {
        const created = await tx.contact.create({ data: { ownerAgentSubject, displayName: contact.displayName, givenName: contact.givenName, familyName: contact.familyName, entityType: contact.entityType, lifecycleStatus: contact.lifecycleStatus, createdBySubject: ownerAgentSubject } });
        await replaceMethods(tx as never, created.id, contact.methods);
        const party = await tx.clientCaseParty.create({ data: { clientCaseId, contactId: created.id, role: participation.role, displayLabel: created.displayName } });
        await replaceAdvisoryRoles(tx as never, party.id, participation.advisoryRoles);
        return party;
      });
    },

    async linkContact(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const input = object(raw);
      const contactId = text(input.contactId, 'contactId', 160)!;
      const contact = await ownedContact(prisma, ownerAgentSubject, contactId);
      const participation = participationInput(input.participation);
      const existing = await prisma.clientCaseParty.findFirst({ where: { clientCaseId, contactId, participationStatus: 'ACTIVE' }, select: { id: true } });
      if (existing) throw new ClientInformationWaveAError('CONFLICT', 'That Contact already has active participation in this Client Case.');
      return prisma.$transaction(async (tx) => {
        const party = await tx.clientCaseParty.create({ data: { clientCaseId, contactId, role: participation.role, displayLabel: contact.displayName } });
        await replaceAdvisoryRoles(tx as never, party.id, participation.advisoryRoles);
        return party;
      });
    },

    async updateParticipation(ownerAgentSubject: string, clientCaseId: string, clientCasePartyId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const participation = await prisma.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId }, select: { id: true } });
      if (!participation) throw new ClientInformationWaveAError('NOT_FOUND', 'The Case participation is unavailable to this Agent.');
      const input = participationInput(raw);
      return prisma.$transaction(async (tx) => {
        await tx.clientCaseParty.update({ where: { id: clientCasePartyId }, data: { role: input.role } });
        await replaceAdvisoryRoles(tx as never, clientCasePartyId, input.advisoryRoles);
        return tx.clientCaseParty.findUniqueOrThrow({ where: { id: clientCasePartyId }, include: { advisoryRoles: true, contact: { include: { methods: true } } } });
      });
    },

    async endParticipation(ownerAgentSubject: string, clientCaseId: string, clientCasePartyId: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const participation = await prisma.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId } });
      if (!participation) throw new ClientInformationWaveAError('NOT_FOUND', 'The Case participation is unavailable to this Agent.');
      if (participation.participationStatus === 'ENDED') return participation;
      return prisma.clientCaseParty.update({ where: { id: clientCasePartyId }, data: { participationStatus: 'ENDED', endedAt: new Date() } });
    },
  };
}
