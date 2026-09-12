import { createHash } from 'node:crypto';

import { Prisma, type PrismaClient, type TransactionLifecycleStatus, type TransactionOperationalStage, type TransactionPartyRole, type TransactionSide } from '@prisma/client';

export const TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_VERSION = 'TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_V1' as const;

const SIDES = ['BUYER', 'SELLER'] as const satisfies readonly TransactionSide[];
const STATUSES = ['DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED'] as const satisfies readonly TransactionLifecycleStatus[];
const STAGES = ['PREPARATION', 'UNDER_CONTRACT', 'INSPECTION_PERIOD', 'TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'CLOSED', 'CANCELLED_REPORTED', 'OTHER_REVIEW_REQUIRED'] as const satisfies readonly TransactionOperationalStage[];

const STAGE_TRANSITIONS: Record<TransactionOperationalStage, readonly TransactionOperationalStage[]> = {
  PREPARATION: ['UNDER_CONTRACT'],
  UNDER_CONTRACT: ['INSPECTION_PERIOD', 'TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'OTHER_REVIEW_REQUIRED'],
  INSPECTION_PERIOD: ['TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'OTHER_REVIEW_REQUIRED'],
  TITLE_DUE_DILIGENCE: ['APPRAISAL_FINANCING', 'PRE_CLOSING', 'OTHER_REVIEW_REQUIRED'],
  APPRAISAL_FINANCING: ['PRE_CLOSING', 'OTHER_REVIEW_REQUIRED'],
  PRE_CLOSING: ['OTHER_REVIEW_REQUIRED'],
  OTHER_REVIEW_REQUIRED: ['PRE_CLOSING'],
  CLOSED: [],
  CANCELLED_REPORTED: [],
};

const STATUS_TRANSITIONS: Record<TransactionLifecycleStatus, readonly TransactionLifecycleStatus[]> = {
  DRAFT: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['CLOSED', 'CANCELLED'],
  CLOSED: [],
  CANCELLED: [],
};

export function isAllowedTransactionStatusTransition(from: TransactionLifecycleStatus, to: TransactionLifecycleStatus) {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function isAllowedTransactionStageTransition(from: TransactionOperationalStage, to: TransactionOperationalStage) {
  return STAGE_TRANSITIONS[from].includes(to);
}

export class TransactionCaseHandoffError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT' | 'INVALID_TRANSITION' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;

function record(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TransactionCaseHandoffError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new TransactionCaseHandoffError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new TransactionCaseHandoffError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function enumValue<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new TransactionCaseHandoffError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function selectedPartyIds(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 8 || value.some((id) => typeof id !== 'string' || !id.trim() || id.length > 100)) {
    throw new TransactionCaseHandoffError('INVALID_REQUEST', 'selectedCasePartyIds must contain one to eight Case party identifiers.');
  }
  const ids = value.map((id) => (id as string).trim());
  if (new Set(ids).size !== ids.length) throw new TransactionCaseHandoffError('INVALID_REQUEST', 'selectedCasePartyIds must not contain duplicates.');
  return ids;
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function sideLabel(side: TransactionSide) {
  return side === 'BUYER' ? 'Buyer purchase' : 'Seller listing';
}

function propertyTitle(property: { sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null } | null) {
  return property?.sourceFormattedSitusAddress || property?.normalizedSitusAddress || 'Property TBD';
}

function assertNoBrowserTimestamp(input: RecordValue) {
  if ('occurredAt' in input || 'recordedAt' in input || 'transitionedAt' in input) throw new TransactionCaseHandoffError('INVALID_REQUEST', 'Transition time is assigned by the server.');
}

export function createTransactionCaseHandoffService(prisma: PrismaClient) {
  async function ownedTransaction(ownerAgentSubject: string, id: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, ownerAgentSubject } });
    if (!transaction) throw new TransactionCaseHandoffError('NOT_FOUND', 'The transaction is unavailable to this Agent.');
    return transaction;
  }

  async function ownedCase(ownerAgentSubject: string, id: string) {
    const clientCase = await prisma.clientCase.findFirst({ where: { id, ownerAgentSubject } });
    if (!clientCase) throw new TransactionCaseHandoffError('OWNERSHIP_DENIED', 'The Client Case is unavailable to this Agent.');
    return clientCase;
  }

  async function ownedActiveCase(ownerAgentSubject: string, id: string) {
    const clientCase = await ownedCase(ownerAgentSubject, id);
    if (clientCase.status !== 'ACTIVE') throw new TransactionCaseHandoffError('CONFLICT', 'An archived Client Case cannot create a new transaction.');
    return clientCase;
  }

  async function timeline(transactionId: string, actorSubject: string, eventType: 'TRANSACTION_CREATED' | 'TRANSACTION_STATUS_CHANGED' | 'STAGE_REPORTED' | 'PROPERTY_ASSOCIATED' | 'PARTY_ATTACHED', objectReference: string, payload: Prisma.JsonObject) {
    return prisma.transactionTimelineEvent.create({ data: { transactionId, actorSubject, eventType, objectReference, sourceType: 'AGENT_RECORDED', payload, occurredAt: new Date() } });
  }

  async function ensurePropertyForCase(clientCaseId: string, canonicalPropertyId: string) {
    const relation = await prisma.clientCaseProperty.findFirst({ where: { clientCaseId, canonicalPropertyId }, select: { canonicalPropertyId: true } });
    if (!relation) throw new TransactionCaseHandoffError('OWNERSHIP_DENIED', 'The canonical property is not attached to this Client Case.');
  }

  async function detail(ownerAgentSubject: string, id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, ownerAgentSubject },
      include: {
        clientCase: { select: { id: true, displayName: true, status: true } },
        canonicalProperty: { select: { id: true, sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true } },
        parties: { include: { clientCaseParty: { select: { id: true, role: true, displayLabel: true } } }, orderBy: { createdAt: 'asc' } },
        timelineEvents: { orderBy: { recordedAt: 'asc' }, select: { id: true, eventType: true, objectReference: true, actorSubject: true, occurredAt: true, recordedAt: true, payload: true } },
      },
    });
    if (!transaction) throw new TransactionCaseHandoffError('NOT_FOUND', 'The transaction is unavailable to this Agent.');
    return { ...transaction, displayTitle: transaction.label, propertyDisplay: propertyTitle(transaction.canonicalProperty) };
  }

  async function listOwned(ownerAgentSubject: string, clientCaseId?: string | null) {
    if (clientCaseId) await ownedCase(ownerAgentSubject, clientCaseId);
    const transactions = await prisma.transaction.findMany({
      where: { ownerAgentSubject, ...(clientCaseId ? { clientCaseId } : {}) },
      include: {
        clientCase: { select: { id: true, displayName: true } },
        canonicalProperty: { select: { sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true } },
        _count: { select: { parties: true, timelineEvents: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    return transactions.map((transaction) => ({ ...transaction, displayTitle: transaction.label, propertyDisplay: propertyTitle(transaction.canonicalProperty) }));
  }

  return {
    detail,
    listOwned,

    async create(ownerAgentSubject: string, raw: unknown) {
      const input = record(raw);
      const clientCaseId = text(input.clientCaseId, 'clientCaseId', 100)!;
      const side = enumValue(input.side, SIDES, 'side') as TransactionSide;
      const partyIds = selectedPartyIds(input.selectedCasePartyIds);
      const canonicalPropertyId = text(input.canonicalPropertyId, 'canonicalPropertyId', 100, false);
      const clientMutationKey = text(input.clientMutationKey, 'clientMutationKey', 160)!;
      const clientCase = await ownedActiveCase(ownerAgentSubject, clientCaseId);
      if (side === 'SELLER' && !canonicalPropertyId) throw new TransactionCaseHandoffError('INVALID_REQUEST', 'Seller listings require a subject property.');
      if (canonicalPropertyId) await ensurePropertyForCase(clientCase.id, canonicalPropertyId);
      const parties = await prisma.clientCaseParty.findMany({ where: { id: { in: partyIds }, clientCaseId: clientCase.id }, select: { id: true, displayLabel: true } });
      if (parties.length !== partyIds.length) throw new TransactionCaseHandoffError('OWNERSHIP_DENIED', 'Each selected party must belong to the Client Case.');
      const label = text(input.label, 'label', 160, false) ?? `${clientCase.displayName} - ${sideLabel(side)}`;
      const idempotencyKey = `ATLAS_TRANSACTION_CASE_HANDOFF_V1|${ownerAgentSubject}|${fingerprint({ clientCaseId, side, canonicalPropertyId: canonicalPropertyId ?? 'PROPERTY_TBD', partyIds: [...partyIds].sort(), clientMutationKey })}`;
      const existing = await prisma.transaction.findUnique({ where: { idempotencyKey }, select: { id: true } });
      if (existing) return detail(ownerAgentSubject, existing.id);
      const role: TransactionPartyRole = side === 'BUYER' ? 'BUYER' : 'SELLER';
      const created = await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({ data: {
          ownerAgentSubject,
          clientCaseId: clientCase.id,
          canonicalPropertyId,
          label,
          side,
          status: 'DRAFT',
          stage: 'PREPARATION',
          clientContextLabel: clientCase.displayName,
          clientContextStatus: 'CASE_HANDOFF_SYNTHETIC_OR_REVIEW_REQUIRED',
          archivePolicyVersion: 'DQG_TRANSACTION_ARCHIVE_POLICY_V1',
          idempotencyKey,
        } });
        await tx.transactionParty.createMany({ data: parties.map((party) => ({ transactionId: transaction.id, clientCasePartyId: party.id, role, displayLabelSnapshot: party.displayLabel })) });
        await tx.transactionTimelineEvent.createMany({ data: [
          { transactionId: transaction.id, actorSubject: ownerAgentSubject, eventType: 'TRANSACTION_CREATED', objectReference: `Transaction:${transaction.id}`, sourceType: 'AGENT_RECORDED', occurredAt: new Date(), payload: { clientCaseId: clientCase.id, side, status: 'DRAFT', stage: 'PREPARATION', property: canonicalPropertyId ? 'ASSOCIATED' : 'PROPERTY_TBD' } },
          ...parties.map((party) => ({ transactionId: transaction.id, actorSubject: ownerAgentSubject, eventType: 'PARTY_ATTACHED' as const, objectReference: `ClientCaseParty:${party.id}`, sourceType: 'CASE_HANDOFF', occurredAt: new Date(), payload: { role, displayLabelSnapshot: party.displayLabel } })),
        ] });
        return transaction;
      });
      return detail(ownerAgentSubject, created.id);
    },

    async updateStatus(ownerAgentSubject: string, id: string, raw: unknown) {
      const input = record(raw); assertNoBrowserTimestamp(input);
      const status = enumValue(input.status, STATUSES, 'status') as TransactionLifecycleStatus;
      const transaction = await ownedTransaction(ownerAgentSubject, id);
      if (!isAllowedTransactionStatusTransition(transaction.status, status)) throw new TransactionCaseHandoffError('INVALID_TRANSITION', 'That status transition is not allowed.');
      if (status === 'ACTIVE' && transaction.stage !== 'PREPARATION' && transaction.stage !== 'UNDER_CONTRACT') throw new TransactionCaseHandoffError('INVALID_TRANSITION', 'Only a preparation or under-contract transaction can become active.');
      const now = new Date();
      const nextStage = status === 'CLOSED' ? 'CLOSED' : status === 'CANCELLED' ? 'CANCELLED_REPORTED' : transaction.stage;
      await prisma.$transaction(async (tx) => {
        await tx.transaction.update({ where: { id: transaction.id }, data: { status, stage: nextStage, closedAt: status === 'CLOSED' ? now : null, cancelledAt: status === 'CANCELLED' ? now : null } });
        await tx.transactionTimelineEvent.create({ data: { transactionId: transaction.id, actorSubject: ownerAgentSubject, eventType: 'TRANSACTION_STATUS_CHANGED', objectReference: `Transaction:${transaction.id}`, sourceType: 'AGENT_RECORDED', occurredAt: now, payload: { from: transaction.status, to: status } } });
        if (nextStage !== transaction.stage) await tx.transactionTimelineEvent.create({ data: { transactionId: transaction.id, actorSubject: ownerAgentSubject, eventType: 'STAGE_REPORTED', objectReference: `Transaction:${transaction.id}`, sourceType: 'SYSTEM_STATUS_ALIGNMENT', occurredAt: now, payload: { from: transaction.stage, to: nextStage, reason: status } } });
      });
      return detail(ownerAgentSubject, transaction.id);
    },

    async advanceStage(ownerAgentSubject: string, id: string, raw: unknown) {
      const input = record(raw); assertNoBrowserTimestamp(input);
      const stage = enumValue(input.stage, STAGES, 'stage') as TransactionOperationalStage;
      const transaction = await ownedTransaction(ownerAgentSubject, id);
      if (transaction.status !== 'ACTIVE') throw new TransactionCaseHandoffError('INVALID_TRANSITION', 'Only active transactions can advance operational stage.');
      if (stage === 'CLOSED' || stage === 'CANCELLED_REPORTED' || !isAllowedTransactionStageTransition(transaction.stage, stage)) throw new TransactionCaseHandoffError('INVALID_TRANSITION', 'That stage transition is not allowed.');
      if (stage === 'UNDER_CONTRACT' && !transaction.canonicalPropertyId) throw new TransactionCaseHandoffError('CONFLICT', 'A subject property is required before moving to under contract.');
      await prisma.transaction.update({ where: { id: transaction.id }, data: { stage } });
      await timeline(transaction.id, ownerAgentSubject, 'STAGE_REPORTED', `Transaction:${transaction.id}`, { from: transaction.stage, to: stage });
      return detail(ownerAgentSubject, transaction.id);
    },

    async associateProperty(ownerAgentSubject: string, id: string, raw: unknown) {
      const input = record(raw); assertNoBrowserTimestamp(input);
      const canonicalPropertyId = text(input.canonicalPropertyId, 'canonicalPropertyId', 100)!;
      const transaction = await ownedTransaction(ownerAgentSubject, id);
      if (!transaction.clientCaseId) throw new TransactionCaseHandoffError('CONFLICT', 'A Client Case is required before associating a property.');
      if (transaction.canonicalPropertyId || transaction.stage !== 'PREPARATION') throw new TransactionCaseHandoffError('INVALID_TRANSITION', 'A subject property may only be associated while the transaction is in preparation.');
      await ownedActiveCase(ownerAgentSubject, transaction.clientCaseId);
      await ensurePropertyForCase(transaction.clientCaseId, canonicalPropertyId);
      await prisma.transaction.update({ where: { id: transaction.id }, data: { canonicalPropertyId } });
      await timeline(transaction.id, ownerAgentSubject, 'PROPERTY_ASSOCIATED', `CanonicalPhysicalProperty:${canonicalPropertyId}`, { from: 'PROPERTY_TBD', to: canonicalPropertyId });
      return detail(ownerAgentSubject, transaction.id);
    },
  };
}
