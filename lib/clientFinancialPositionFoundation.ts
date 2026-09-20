import type {
  ClientFinancialAssetCategory,
  ClientFinancialConstraintType,
  ClientFinancialFrequency,
  ClientFinancialIncomeCategory,
  ClientFinancialLiabilityCategory,
  ClientFinancialObservationKind,
  ClientFinancialQualificationType,
  ClientFinancialSourcePosture,
  ClientFinancialVerificationState,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { assertEligibleClientCaseGovernedSource, ClientCaseGovernedSourceError } from './clientCaseGovernedSourceFoundation';

export const CLIENT_FINANCIAL_POSITION_FOUNDATION_VERSION = 'CLIENT_FINANCIAL_POSITION_FOUNDATION_V1' as const;
export const CLIENT_FINANCIAL_POSITION_CURRENCY = 'USD' as const;
export const CLIENT_FINANCIAL_POSITION_MAX_CENTS = 1_000_000_000_000_000;
export const CLIENT_FINANCIAL_POSITION_MAX_RATE_BPS = 100_000;

export const CLIENT_FINANCIAL_ASSET_CATEGORIES = ['CASH', 'LIQUID_INVESTMENT', 'RETIREMENT_ACCESSIBLE', 'OTHER_AVAILABLE_RESOURCE'] as const satisfies readonly ClientFinancialAssetCategory[];
export const CLIENT_FINANCIAL_LIABILITY_CATEGORIES = ['MORTGAGE', 'HELOC', 'AUTO_LOAN', 'STUDENT_LOAN', 'CREDIT_CARD', 'PERSONAL_LOAN', 'OTHER'] as const satisfies readonly ClientFinancialLiabilityCategory[];
export const CLIENT_FINANCIAL_INCOME_CATEGORIES = ['SALARY', 'SELF_EMPLOYMENT', 'COMMISSION', 'BONUS', 'RENTAL', 'OTHER'] as const satisfies readonly ClientFinancialIncomeCategory[];
export const CLIENT_FINANCIAL_FREQUENCIES = ['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL'] as const satisfies readonly ClientFinancialFrequency[];
export const CLIENT_FINANCIAL_QUALIFICATION_TYPES = ['PREAPPROVAL', 'PREQUALIFICATION', 'OTHER_LENDER_QUALIFICATION'] as const satisfies readonly ClientFinancialQualificationType[];
export const CLIENT_FINANCIAL_CONSTRAINT_TYPES = ['MINIMUM_RETAINED_LIQUIDITY', 'MAXIMUM_CASH_DEPLOYMENT', 'MAXIMUM_COMFORTABLE_HOUSING_PAYMENT'] as const satisfies readonly ClientFinancialConstraintType[];
export const CLIENT_FINANCIAL_SOURCE_POSTURES = ['CLIENT_STATED', 'AGENT_ENTERED_FROM_CLIENT', 'PROFESSIONAL_PROVIDED', 'DOCUMENT_SUPPORTED', 'SYSTEM_DERIVED_CANONICAL'] as const satisfies readonly ClientFinancialSourcePosture[];
export const CLIENT_FINANCIAL_VERIFICATION_STATES = ['UNVERIFIED', 'CLIENT_CONFIRMED', 'DOCUMENT_SUPPORTED', 'PROFESSIONAL_CONFIRMED'] as const satisfies readonly ClientFinancialVerificationState[];
export const CLIENT_FINANCIAL_OBSERVATION_KINDS = ['REPORTED', 'CORRECTION'] as const satisfies readonly ClientFinancialObservationKind[];

type RecordValue = Record<string, unknown>;
type Source = { id: string; kind: 'EVIDENCE' | 'PROFESSIONAL_INPUT' };

export class ClientFinancialPositionError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT', message: string) {
    super(message);
  }
}

function object(value: unknown, field = 'input'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function rejectUnexpectedKeys(value: RecordValue, allowed: readonly string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', 'Financial Position input contains unsupported fields.');
  }
}

function identifier(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function optionalIdentifier(value: unknown, field: string) {
  return value === undefined || value === null ? null : identifier(value, field);
}

function boundedText(value: unknown, field: string, maximum: number, required = false) {
  if (value === undefined || value === null) {
    if (required) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is required.`);
    return null;
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function oneOf<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function cents(value: unknown, field: string, required = false): bigint | null {
  if (value === undefined || value === null) {
    if (required) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is required.`);
    return null;
  }
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > CLIENT_FINANCIAL_POSITION_MAX_CENTS) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} must be a nonnegative safe integer cents value.`);
  }
  return BigInt(value);
}

function rate(value: unknown, field: string): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > CLIENT_FINANCIAL_POSITION_MAX_RATE_BPS) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} must be an integer basis-point value.`);
  }
  return value;
}

function date(value: unknown, field: string, required = false): Date | null {
  if (value === undefined || value === null) {
    if (required) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is required.`);
    return null;
  }
  if (typeof value !== 'string' || !value.trim()) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  return parsed;
}

function optionalCurrency(value: unknown) {
  if (value === undefined || value === null) return CLIENT_FINANCIAL_POSITION_CURRENCY;
  if (value !== CLIENT_FINANCIAL_POSITION_CURRENCY) throw new ClientFinancialPositionError('INVALID_REQUEST', 'currencyCode must be USD in Financial Position V1.');
  return CLIENT_FINANCIAL_POSITION_CURRENCY;
}

function temporal(input: RecordValue, includeExpiration = false) {
  const asOf = date(input.asOf, 'asOf', true)!;
  const observedAt = date(input.observedAt, 'observedAt');
  const effectiveAt = date(input.effectiveAt, 'effectiveAt');
  const reviewAfter = date(input.reviewAfter, 'reviewAfter');
  const expiresAt = includeExpiration ? date(input.expiresAt, 'expiresAt') : null;
  if (expiresAt && effectiveAt && expiresAt < effectiveAt) throw new ClientFinancialPositionError('INVALID_REQUEST', 'expiresAt cannot precede effectiveAt.');
  return { asOf, observedAt, effectiveAt, reviewAfter, ...(includeExpiration ? { expiresAt } : {}) };
}

type ParsedObservationInput = RecordValue & {
  financialSourceId: string | null;
  currencyCode: typeof CLIENT_FINANCIAL_POSITION_CURRENCY;
  sourcePosture: ClientFinancialSourcePosture;
  verificationState: ClientFinancialVerificationState;
  observationKind: ClientFinancialObservationKind;
  limitation: string | null;
  supersedesObservationId: string | null;
  asOf: Date;
  observedAt: Date | null;
  effectiveAt: Date | null;
  reviewAfter: Date | null;
  expiresAt?: Date | null;
};

function observationInput(raw: unknown, extras: readonly string[], includeExpiration = false): ParsedObservationInput {
  const input = object(raw);
  rejectUnexpectedKeys(input, [
    ...extras,
    'financialSourceId', 'currencyCode', 'sourcePosture', 'verificationState', 'observationKind', 'limitation',
    'asOf', 'observedAt', 'effectiveAt', 'reviewAfter', ...(includeExpiration ? ['expiresAt'] : []), 'supersedesObservationId',
  ]);
  return {
    ...input,
    financialSourceId: optionalIdentifier(input.financialSourceId, 'financialSourceId'),
    currencyCode: optionalCurrency(input.currencyCode),
    sourcePosture: oneOf(input.sourcePosture, CLIENT_FINANCIAL_SOURCE_POSTURES, 'sourcePosture') as ClientFinancialSourcePosture,
    verificationState: oneOf(input.verificationState, CLIENT_FINANCIAL_VERIFICATION_STATES, 'verificationState') as ClientFinancialVerificationState,
    observationKind: input.observationKind === undefined ? 'REPORTED' as ClientFinancialObservationKind : oneOf(input.observationKind, CLIENT_FINANCIAL_OBSERVATION_KINDS, 'observationKind') as ClientFinancialObservationKind,
    limitation: boundedText(input.limitation, 'limitation', 500),
    supersedesObservationId: optionalIdentifier(input.supersedesObservationId, 'supersedesObservationId'),
    ...temporal(input, includeExpiration),
  } as ParsedObservationInput;
}

function newRecordInput(raw: unknown, entityKeys: readonly string[], observationKeys: readonly string[], includeExpiration = false) {
  const input = object(raw);
  rejectUnexpectedKeys(input, ['entity', 'observation', 'clientCaseGovernedSourceId']);
  const entity = object(input.entity, 'entity');
  rejectUnexpectedKeys(entity, entityKeys);
  const observation = object(input.observation, 'observation');
  if ('financialSourceId' in observation) throw new ClientFinancialPositionError('INVALID_REQUEST', 'financialSourceId is derived from the selected governed source.');
  return {
    entity,
    observation: observationInput({ ...observation, financialSourceId: null }, observationKeys, includeExpiration),
    clientCaseGovernedSourceId: optionalIdentifier(input.clientCaseGovernedSourceId, 'clientCaseGovernedSourceId'),
  };
}

function assertProvenance(source: Source | null, posture: ClientFinancialSourcePosture, verification: ClientFinancialVerificationState) {
  if (posture === 'DOCUMENT_SUPPORTED' || verification === 'DOCUMENT_SUPPORTED') {
    if (!source || source.kind !== 'EVIDENCE') throw new ClientFinancialPositionError('INVALID_REQUEST', 'Document-supported observations require an Evidence financial source binding.');
  }
  if (posture === 'PROFESSIONAL_PROVIDED' || verification === 'PROFESSIONAL_CONFIRMED') {
    if (!source || source.kind !== 'PROFESSIONAL_INPUT') throw new ClientFinancialPositionError('INVALID_REQUEST', 'Professional observations require a Professional Input financial source binding.');
  }
  if (!source && !['CLIENT_STATED', 'AGENT_ENTERED_FROM_CLIENT', 'SYSTEM_DERIVED_CANONICAL'].includes(posture)) {
    throw new ClientFinancialPositionError('INVALID_REQUEST', 'The observation source posture requires a financial source binding.');
  }
}

function currentState(expiresAt: Date | null) {
  return expiresAt && expiresAt.getTime() < Date.now() ? 'EXPIRED' as const : 'CURRENT' as const;
}

function isPrismaError(error: unknown, code: string) {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === code);
}

export function createClientFinancialPositionService(prisma: PrismaClient) {
  async function authorize(ownerAgentSubject: unknown, clientCaseId: unknown, mutation = false) {
    const subject = identifier(ownerAgentSubject, 'authenticated subject');
    const caseId = identifier(clientCaseId, 'clientCaseId');
    const clientCase = await prisma.clientCase.findFirst({ where: { id: caseId, ownerAgentSubject: subject }, select: { id: true, status: true } });
    if (!clientCase) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    if (mutation && clientCase.status !== 'ACTIVE') throw new ClientFinancialPositionError('CONFLICT', 'Archived Client Cases are read-only for Financial Position.');
    return { subject, caseId };
  }

  async function ensure(subject: string, caseId: string, tx: Prisma.TransactionClient = prisma) {
    const existing = await tx.clientFinancialPosition.findUnique({ where: { clientCaseId: caseId } });
    if (existing) return existing;
    try {
      return await tx.clientFinancialPosition.create({ data: { clientCaseId: caseId, createdBySubject: subject } });
    } catch (error) {
      if (!isPrismaError(error, 'P2002')) throw error;
      const concurrent = await tx.clientFinancialPosition.findUnique({ where: { clientCaseId: caseId } });
      if (!concurrent) throw error;
      return concurrent;
    }
  }

  async function sourceFor(tx: Prisma.TransactionClient, ownerAgentSubject: string, caseId: string, sourceId: string | null) {
    if (!sourceId) return null;
    const source = await tx.clientFinancialSource.findFirst({ where: { id: sourceId, clientCaseId: caseId }, select: { id: true, clientCaseGovernedSourceId: true } });
    if (!source) throw new ClientFinancialPositionError('NOT_FOUND', 'The financial source binding is unavailable to this Client Case.');
    try {
      const governedSource = await assertEligibleClientCaseGovernedSource(tx, ownerAgentSubject, caseId, source.clientCaseGovernedSourceId);
      return { id: source.id, kind: governedSource.sourceKind };
    } catch (error) {
      if (error instanceof ClientCaseGovernedSourceError) throw new ClientFinancialPositionError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : error.code === 'CONFLICT' ? 'CONFLICT' : 'INVALID_REQUEST', error.message);
      throw error;
    }
  }

  async function sourceForGovernedSource(
    tx: Prisma.TransactionClient,
    ownerAgentSubject: string,
    caseId: string,
    financialPositionId: string,
    clientCaseGovernedSourceId: string | null,
  ): Promise<Source | null> {
    if (!clientCaseGovernedSourceId) return null;
    try {
      const governedSource = await assertEligibleClientCaseGovernedSource(tx, ownerAgentSubject, caseId, clientCaseGovernedSourceId);
      const existing = await tx.clientFinancialSource.findFirst({
        where: { clientCaseId: caseId, clientCaseGovernedSourceId: governedSource.id },
        select: { id: true },
      });
      if (existing) return { id: existing.id, kind: governedSource.sourceKind };
      const source = await tx.clientFinancialSource.create({
        data: { clientCaseId: caseId, financialPositionId, clientCaseGovernedSourceId: governedSource.id, createdBySubject: ownerAgentSubject },
        select: { id: true },
      });
      return { id: source.id, kind: governedSource.sourceKind };
    } catch (error) {
      if (error instanceof ClientCaseGovernedSourceError) throw new ClientFinancialPositionError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : error.code === 'CONFLICT' ? 'CONFLICT' : 'INVALID_REQUEST', error.message);
      throw error;
    }
  }

  async function stableEntity(tx: Prisma.TransactionClient, model: 'asset' | 'liability' | 'income' | 'qualification' | 'constraint', caseId: string, id: string) {
    if (model === 'asset') return tx.clientFinancialAsset.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
    if (model === 'liability') return tx.clientFinancialLiability.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
    if (model === 'income') return tx.clientFinancialIncomeSource.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
    if (model === 'qualification') return tx.clientFinancialQualification.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
    return tx.clientFinancialConstraint.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } });
  }

  async function assertCurrentPredecessor(
    tx: Prisma.TransactionClient,
    model: 'asset' | 'liability' | 'income' | 'qualification' | 'constraint',
    caseId: string,
    entityId: string,
    predecessorId: string | null,
  ) {
    const current = model === 'asset'
      ? await tx.clientFinancialAssetObservation.findFirst({ where: { clientCaseId: caseId, assetId: entityId, supersededAt: null }, select: { id: true } })
      : model === 'liability'
        ? await tx.clientFinancialLiabilityObservation.findFirst({ where: { clientCaseId: caseId, liabilityId: entityId, supersededAt: null }, select: { id: true } })
        : model === 'income'
          ? await tx.clientFinancialIncomeObservation.findFirst({ where: { clientCaseId: caseId, incomeSourceId: entityId, supersededAt: null }, select: { id: true } })
          : model === 'qualification'
            ? await tx.clientFinancialQualificationObservation.findFirst({ where: { clientCaseId: caseId, qualificationId: entityId, supersededAt: null }, select: { id: true } })
            : await tx.clientFinancialConstraintObservation.findFirst({ where: { clientCaseId: caseId, constraintId: entityId, supersededAt: null }, select: { id: true } });
    if (predecessorId === null) {
      if (current) throw new ClientFinancialPositionError('CONFLICT', 'A current observation already exists; identify it explicitly to supersede it.');
      return null;
    }
    if (!current || current.id !== predecessorId) throw new ClientFinancialPositionError('CONFLICT', 'The requested predecessor is unavailable or no longer current.');
    return current;
  }

  async function markSuperseded(tx: Prisma.TransactionClient, model: 'asset' | 'liability' | 'income' | 'qualification' | 'constraint', id: string) {
    const data = { supersededAt: new Date() };
    if (model === 'asset') return tx.clientFinancialAssetObservation.update({ where: { id }, data });
    if (model === 'liability') return tx.clientFinancialLiabilityObservation.update({ where: { id }, data });
    if (model === 'income') return tx.clientFinancialIncomeObservation.update({ where: { id }, data });
    if (model === 'qualification') return tx.clientFinancialQualificationObservation.update({ where: { id }, data });
    return tx.clientFinancialConstraintObservation.update({ where: { id }, data });
  }

  return {
    async createAssetWithInitialObservation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = newRecordInput(raw, ['category', 'label', 'clientCasePartyId'], ['marketValueCents', 'liquidValueCents', 'availableAmountCents']);
      const category = oneOf(input.entity.category, CLIENT_FINANCIAL_ASSET_CATEGORIES, 'category') as ClientFinancialAssetCategory;
      const label = boundedText(input.entity.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.entity.clientCasePartyId, 'clientCasePartyId');
      const marketValueCents = cents(input.observation.marketValueCents, 'marketValueCents');
      const liquidValueCents = cents(input.observation.liquidValueCents, 'liquidValueCents');
      const availableAmountCents = cents(input.observation.availableAmountCents, 'availableAmountCents');
      if (marketValueCents === null && liquidValueCents === null && availableAmountCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'An Asset observation requires at least one amount.');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        const source = await sourceForGovernedSource(tx, subject, caseId, position.id, input.clientCaseGovernedSourceId);
        assertProvenance(source, input.observation.sourcePosture, input.observation.verificationState);
        const asset = await tx.clientFinancialAsset.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, category, label, createdBySubject: subject } });
        const observation = await tx.clientFinancialAssetObservation.create({ data: { clientCaseId: caseId, assetId: asset.id, financialSourceId: source?.id ?? null, marketValueCents, liquidValueCents, availableAmountCents, currencyCode: input.observation.currencyCode, sourcePosture: input.observation.sourcePosture, verificationState: input.observation.verificationState, observationKind: input.observation.observationKind, limitation: input.observation.limitation, asOf: input.observation.asOf, observedAt: input.observation.observedAt, effectiveAt: input.observation.effectiveAt, reviewAfter: input.observation.reviewAfter, createdBySubject: subject } });
        return { asset, observation };
      });
    },

    async createLiabilityWithInitialObservation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = newRecordInput(raw, ['category', 'label', 'clientCasePartyId', 'clientCasePropertyId'], ['currentBalanceCents', 'monthlyObligationCents', 'rateBps']);
      const category = oneOf(input.entity.category, CLIENT_FINANCIAL_LIABILITY_CATEGORIES, 'category') as ClientFinancialLiabilityCategory;
      const label = boundedText(input.entity.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.entity.clientCasePartyId, 'clientCasePartyId');
      const clientCasePropertyId = optionalIdentifier(input.entity.clientCasePropertyId, 'clientCasePropertyId');
      const currentBalanceCents = cents(input.observation.currentBalanceCents, 'currentBalanceCents');
      const monthlyObligationCents = cents(input.observation.monthlyObligationCents, 'monthlyObligationCents');
      const rateBps = rate(input.observation.rateBps, 'rateBps');
      if (currentBalanceCents === null && monthlyObligationCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'A Liability observation requires a balance or monthly obligation.');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        if (clientCasePropertyId && !await tx.clientCaseProperty.findFirst({ where: { id: clientCasePropertyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case Property is unavailable to this Client Case.');
        const source = await sourceForGovernedSource(tx, subject, caseId, position.id, input.clientCaseGovernedSourceId);
        assertProvenance(source, input.observation.sourcePosture, input.observation.verificationState);
        const liability = await tx.clientFinancialLiability.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, clientCasePropertyId, category, label, createdBySubject: subject } });
        const observation = await tx.clientFinancialLiabilityObservation.create({ data: { clientCaseId: caseId, liabilityId: liability.id, financialSourceId: source?.id ?? null, currentBalanceCents, monthlyObligationCents, rateBps, currencyCode: input.observation.currencyCode, sourcePosture: input.observation.sourcePosture, verificationState: input.observation.verificationState, observationKind: input.observation.observationKind, limitation: input.observation.limitation, asOf: input.observation.asOf, observedAt: input.observation.observedAt, effectiveAt: input.observation.effectiveAt, reviewAfter: input.observation.reviewAfter, createdBySubject: subject } });
        return { liability, observation };
      });
    },

    async createIncomeWithInitialObservation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = newRecordInput(raw, ['category', 'label', 'clientCasePartyId', 'clientCasePropertyId'], ['amountCents', 'frequency']);
      const category = oneOf(input.entity.category, CLIENT_FINANCIAL_INCOME_CATEGORIES, 'category') as ClientFinancialIncomeCategory;
      const label = boundedText(input.entity.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.entity.clientCasePartyId, 'clientCasePartyId');
      const clientCasePropertyId = optionalIdentifier(input.entity.clientCasePropertyId, 'clientCasePropertyId');
      const amountCents = cents(input.observation.amountCents, 'amountCents', true)!;
      const frequency = oneOf(input.observation.frequency, CLIENT_FINANCIAL_FREQUENCIES, 'frequency') as ClientFinancialFrequency;
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        if (clientCasePropertyId && !await tx.clientCaseProperty.findFirst({ where: { id: clientCasePropertyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case Property is unavailable to this Client Case.');
        const source = await sourceForGovernedSource(tx, subject, caseId, position.id, input.clientCaseGovernedSourceId);
        assertProvenance(source, input.observation.sourcePosture, input.observation.verificationState);
        const income = await tx.clientFinancialIncomeSource.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, clientCasePropertyId, category, label, createdBySubject: subject } });
        const observation = await tx.clientFinancialIncomeObservation.create({ data: { clientCaseId: caseId, incomeSourceId: income.id, financialSourceId: source?.id ?? null, amountCents, frequency, currencyCode: input.observation.currencyCode, sourcePosture: input.observation.sourcePosture, verificationState: input.observation.verificationState, observationKind: input.observation.observationKind, limitation: input.observation.limitation, asOf: input.observation.asOf, observedAt: input.observation.observedAt, effectiveAt: input.observation.effectiveAt, reviewAfter: input.observation.reviewAfter, createdBySubject: subject } });
        return { income, observation };
      });
    },

    async createQualificationWithInitialObservation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = newRecordInput(raw, ['qualificationType', 'label'], ['maximumLoanAmountCents', 'maximumPurchaseAmountCents', 'rateBps', 'programLabel', 'conditions'], true);
      const qualificationType = oneOf(input.entity.qualificationType, CLIENT_FINANCIAL_QUALIFICATION_TYPES, 'qualificationType') as ClientFinancialQualificationType;
      const label = boundedText(input.entity.label, 'label', 160, true)!;
      const maximumLoanAmountCents = cents(input.observation.maximumLoanAmountCents, 'maximumLoanAmountCents');
      const maximumPurchaseAmountCents = cents(input.observation.maximumPurchaseAmountCents, 'maximumPurchaseAmountCents');
      const rateBps = rate(input.observation.rateBps, 'rateBps');
      const programLabel = boundedText(input.observation.programLabel, 'programLabel', 160);
      const conditions = boundedText(input.observation.conditions, 'conditions', 1000);
      if (maximumLoanAmountCents === null && maximumPurchaseAmountCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'A Qualification observation requires a maximum loan or purchase amount.');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        const source = await sourceForGovernedSource(tx, subject, caseId, position.id, input.clientCaseGovernedSourceId);
        assertProvenance(source, input.observation.sourcePosture, input.observation.verificationState);
        const qualification = await tx.clientFinancialQualification.create({ data: { clientCaseId: caseId, financialPositionId: position.id, qualificationType, label, createdBySubject: subject } });
        const observation = await tx.clientFinancialQualificationObservation.create({ data: { clientCaseId: caseId, qualificationId: qualification.id, financialSourceId: source?.id ?? null, maximumLoanAmountCents, maximumPurchaseAmountCents, rateBps, programLabel, conditions, currencyCode: input.observation.currencyCode, sourcePosture: input.observation.sourcePosture, verificationState: input.observation.verificationState, observationKind: input.observation.observationKind, limitation: input.observation.limitation, asOf: input.observation.asOf, observedAt: input.observation.observedAt, effectiveAt: input.observation.effectiveAt, expiresAt: input.observation.expiresAt ?? null, reviewAfter: input.observation.reviewAfter, createdBySubject: subject } });
        return { qualification, observation };
      });
    },

    async createConstraintWithInitialObservation(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = newRecordInput(raw, ['constraintType'], ['amountCents']);
      const constraintType = oneOf(input.entity.constraintType, CLIENT_FINANCIAL_CONSTRAINT_TYPES, 'constraintType') as ClientFinancialConstraintType;
      const amountCents = cents(input.observation.amountCents, 'amountCents', true)!;
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        const source = await sourceForGovernedSource(tx, subject, caseId, position.id, input.clientCaseGovernedSourceId);
        assertProvenance(source, input.observation.sourcePosture, input.observation.verificationState);
        const constraint = await tx.clientFinancialConstraint.create({ data: { clientCaseId: caseId, financialPositionId: position.id, constraintType, createdBySubject: subject } });
        const observation = await tx.clientFinancialConstraintObservation.create({ data: { clientCaseId: caseId, constraintId: constraint.id, financialSourceId: source?.id ?? null, amountCents, currencyCode: input.observation.currencyCode, sourcePosture: input.observation.sourcePosture, verificationState: input.observation.verificationState, observationKind: input.observation.observationKind, limitation: input.observation.limitation, asOf: input.observation.asOf, observedAt: input.observation.observedAt, effectiveAt: input.observation.effectiveAt, reviewAfter: input.observation.reviewAfter, createdBySubject: subject } });
        return { constraint, observation };
      });
    },

    async ensureClientFinancialPosition(ownerAgentSubject: string, clientCaseId: string) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      return prisma.$transaction((tx) => ensure(subject, caseId, tx));
    },

    async bindFinancialSource(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['clientCaseGovernedSourceId']);
      const clientCaseGovernedSourceId = identifier(input.clientCaseGovernedSourceId, 'clientCaseGovernedSourceId');
      try {
        return await prisma.$transaction(async (tx) => {
          const position = await ensure(subject, caseId, tx);
          const governedSource = await assertEligibleClientCaseGovernedSource(tx, subject, caseId, clientCaseGovernedSourceId);
          return tx.clientFinancialSource.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCaseGovernedSourceId: governedSource.id, createdBySubject: subject } });
        });
      } catch (error) {
        if (error instanceof ClientCaseGovernedSourceError) throw new ClientFinancialPositionError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : error.code === 'CONFLICT' ? 'CONFLICT' : 'INVALID_REQUEST', error.message);
        if (isPrismaError(error, 'P2002')) throw new ClientFinancialPositionError('CONFLICT', 'That governed source is already bound to a Client Case Financial Position.');
        throw error;
      }
    },

    async createAsset(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['category', 'label', 'clientCasePartyId']);
      const category = oneOf(input.category, CLIENT_FINANCIAL_ASSET_CATEGORIES, 'category') as ClientFinancialAssetCategory;
      const label = boundedText(input.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.clientCasePartyId, 'clientCasePartyId');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        return tx.clientFinancialAsset.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, category, label, createdBySubject: subject } });
      });
    },

    async recordAssetObservation(ownerAgentSubject: string, clientCaseId: string, assetId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(assetId, 'assetId');
      const input = observationInput(raw, ['marketValueCents', 'liquidValueCents', 'availableAmountCents']);
      const marketValueCents = cents(input.marketValueCents, 'marketValueCents');
      const liquidValueCents = cents(input.liquidValueCents, 'liquidValueCents');
      const availableAmountCents = cents(input.availableAmountCents, 'availableAmountCents');
      if (marketValueCents === null && liquidValueCents === null && availableAmountCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'An Asset observation requires at least one amount.');
      return prisma.$transaction(async (tx) => {
        if (!await stableEntity(tx, 'asset', caseId, id)) throw new ClientFinancialPositionError('NOT_FOUND', 'The Asset is unavailable to this Client Case.');
        const source = await sourceFor(tx, subject, caseId, input.financialSourceId);
        assertProvenance(source, input.sourcePosture, input.verificationState);
        const predecessor = await assertCurrentPredecessor(tx, 'asset', caseId, id, input.supersedesObservationId);
        if (predecessor) await markSuperseded(tx, 'asset', predecessor.id);
        return tx.clientFinancialAssetObservation.create({ data: { clientCaseId: caseId, assetId: id, financialSourceId: source?.id ?? null, marketValueCents, liquidValueCents, availableAmountCents, currencyCode: input.currencyCode, sourcePosture: input.sourcePosture, verificationState: input.verificationState, observationKind: input.observationKind, limitation: input.limitation, asOf: input.asOf, observedAt: input.observedAt, effectiveAt: input.effectiveAt, reviewAfter: input.reviewAfter, supersedesObservationId: predecessor?.id ?? null, createdBySubject: subject } });
      });
    },

    async createLiability(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['category', 'label', 'clientCasePartyId', 'clientCasePropertyId']);
      const category = oneOf(input.category, CLIENT_FINANCIAL_LIABILITY_CATEGORIES, 'category') as ClientFinancialLiabilityCategory;
      const label = boundedText(input.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.clientCasePartyId, 'clientCasePartyId');
      const clientCasePropertyId = optionalIdentifier(input.clientCasePropertyId, 'clientCasePropertyId');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        if (clientCasePropertyId && !await tx.clientCaseProperty.findFirst({ where: { id: clientCasePropertyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case Property is unavailable to this Client Case.');
        return tx.clientFinancialLiability.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, clientCasePropertyId, category, label, createdBySubject: subject } });
      });
    },

    async recordLiabilityObservation(ownerAgentSubject: string, clientCaseId: string, liabilityId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(liabilityId, 'liabilityId');
      const input = observationInput(raw, ['currentBalanceCents', 'monthlyObligationCents', 'rateBps']);
      const currentBalanceCents = cents(input.currentBalanceCents, 'currentBalanceCents');
      const monthlyObligationCents = cents(input.monthlyObligationCents, 'monthlyObligationCents');
      const rateBps = rate(input.rateBps, 'rateBps');
      if (currentBalanceCents === null && monthlyObligationCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'A Liability observation requires a balance or monthly obligation.');
      return prisma.$transaction(async (tx) => {
        if (!await stableEntity(tx, 'liability', caseId, id)) throw new ClientFinancialPositionError('NOT_FOUND', 'The Liability is unavailable to this Client Case.');
        const source = await sourceFor(tx, subject, caseId, input.financialSourceId);
        assertProvenance(source, input.sourcePosture, input.verificationState);
        const predecessor = await assertCurrentPredecessor(tx, 'liability', caseId, id, input.supersedesObservationId);
        if (predecessor) await markSuperseded(tx, 'liability', predecessor.id);
        return tx.clientFinancialLiabilityObservation.create({ data: { clientCaseId: caseId, liabilityId: id, financialSourceId: source?.id ?? null, currentBalanceCents, monthlyObligationCents, rateBps, currencyCode: input.currencyCode, sourcePosture: input.sourcePosture, verificationState: input.verificationState, observationKind: input.observationKind, limitation: input.limitation, asOf: input.asOf, observedAt: input.observedAt, effectiveAt: input.effectiveAt, reviewAfter: input.reviewAfter, supersedesObservationId: predecessor?.id ?? null, createdBySubject: subject } });
      });
    },

    async createIncomeSource(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['category', 'label', 'clientCasePartyId', 'clientCasePropertyId']);
      const category = oneOf(input.category, CLIENT_FINANCIAL_INCOME_CATEGORIES, 'category') as ClientFinancialIncomeCategory;
      const label = boundedText(input.label, 'label', 160, true)!;
      const clientCasePartyId = optionalIdentifier(input.clientCasePartyId, 'clientCasePartyId');
      const clientCasePropertyId = optionalIdentifier(input.clientCasePropertyId, 'clientCasePropertyId');
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        if (clientCasePartyId && !await tx.clientCaseParty.findFirst({ where: { id: clientCasePartyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case participant is unavailable to this Client Case.');
        if (clientCasePropertyId && !await tx.clientCaseProperty.findFirst({ where: { id: clientCasePropertyId, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case Property is unavailable to this Client Case.');
        return tx.clientFinancialIncomeSource.create({ data: { clientCaseId: caseId, financialPositionId: position.id, clientCasePartyId, clientCasePropertyId, category, label, createdBySubject: subject } });
      });
    },

    async recordIncomeObservation(ownerAgentSubject: string, clientCaseId: string, incomeSourceId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(incomeSourceId, 'incomeSourceId');
      const input = observationInput(raw, ['amountCents', 'frequency']);
      const amountCents = cents(input.amountCents, 'amountCents', true)!;
      const frequency = oneOf(input.frequency, CLIENT_FINANCIAL_FREQUENCIES, 'frequency') as ClientFinancialFrequency;
      return prisma.$transaction(async (tx) => {
        if (!await stableEntity(tx, 'income', caseId, id)) throw new ClientFinancialPositionError('NOT_FOUND', 'The Income source is unavailable to this Client Case.');
        const source = await sourceFor(tx, subject, caseId, input.financialSourceId);
        assertProvenance(source, input.sourcePosture, input.verificationState);
        const predecessor = await assertCurrentPredecessor(tx, 'income', caseId, id, input.supersedesObservationId);
        if (predecessor) await markSuperseded(tx, 'income', predecessor.id);
        return tx.clientFinancialIncomeObservation.create({ data: { clientCaseId: caseId, incomeSourceId: id, financialSourceId: source?.id ?? null, amountCents, frequency, currencyCode: input.currencyCode, sourcePosture: input.sourcePosture, verificationState: input.verificationState, observationKind: input.observationKind, limitation: input.limitation, asOf: input.asOf, observedAt: input.observedAt, effectiveAt: input.effectiveAt, reviewAfter: input.reviewAfter, supersedesObservationId: predecessor?.id ?? null, createdBySubject: subject } });
      });
    },

    async createQualification(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['qualificationType', 'label']);
      const qualificationType = oneOf(input.qualificationType, CLIENT_FINANCIAL_QUALIFICATION_TYPES, 'qualificationType') as ClientFinancialQualificationType;
      const label = boundedText(input.label, 'label', 160, true)!;
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        return tx.clientFinancialQualification.create({ data: { clientCaseId: caseId, financialPositionId: position.id, qualificationType, label, createdBySubject: subject } });
      });
    },

    async recordQualificationObservation(ownerAgentSubject: string, clientCaseId: string, qualificationId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(qualificationId, 'qualificationId');
      const input = observationInput(raw, ['maximumLoanAmountCents', 'maximumPurchaseAmountCents', 'rateBps', 'programLabel', 'conditions'], true);
      const maximumLoanAmountCents = cents(input.maximumLoanAmountCents, 'maximumLoanAmountCents');
      const maximumPurchaseAmountCents = cents(input.maximumPurchaseAmountCents, 'maximumPurchaseAmountCents');
      const rateBps = rate(input.rateBps, 'rateBps');
      const programLabel = boundedText(input.programLabel, 'programLabel', 160);
      const conditions = boundedText(input.conditions, 'conditions', 1000);
      if (maximumLoanAmountCents === null && maximumPurchaseAmountCents === null) throw new ClientFinancialPositionError('INVALID_REQUEST', 'A Qualification observation requires a maximum loan or purchase amount.');
      return prisma.$transaction(async (tx) => {
        if (!await stableEntity(tx, 'qualification', caseId, id)) throw new ClientFinancialPositionError('NOT_FOUND', 'The Qualification is unavailable to this Client Case.');
        const source = await sourceFor(tx, subject, caseId, input.financialSourceId);
        assertProvenance(source, input.sourcePosture, input.verificationState);
        const predecessor = await assertCurrentPredecessor(tx, 'qualification', caseId, id, input.supersedesObservationId);
        if (predecessor) await markSuperseded(tx, 'qualification', predecessor.id);
        return tx.clientFinancialQualificationObservation.create({ data: { clientCaseId: caseId, qualificationId: id, financialSourceId: source?.id ?? null, maximumLoanAmountCents, maximumPurchaseAmountCents, rateBps, programLabel, conditions, currencyCode: input.currencyCode, sourcePosture: input.sourcePosture, verificationState: input.verificationState, observationKind: input.observationKind, limitation: input.limitation, asOf: input.asOf, observedAt: input.observedAt, effectiveAt: input.effectiveAt, expiresAt: input.expiresAt, reviewAfter: input.reviewAfter, supersedesObservationId: predecessor?.id ?? null, createdBySubject: subject } });
      });
    },

    async createConstraint(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const input = object(raw);
      rejectUnexpectedKeys(input, ['constraintType']);
      const constraintType = oneOf(input.constraintType, CLIENT_FINANCIAL_CONSTRAINT_TYPES, 'constraintType') as ClientFinancialConstraintType;
      return prisma.$transaction(async (tx) => {
        const position = await ensure(subject, caseId, tx);
        return tx.clientFinancialConstraint.create({ data: { clientCaseId: caseId, financialPositionId: position.id, constraintType, createdBySubject: subject } });
      });
    },

    async recordConstraintObservation(ownerAgentSubject: string, clientCaseId: string, constraintId: string, raw: unknown) {
      const { subject, caseId } = await authorize(ownerAgentSubject, clientCaseId, true);
      const id = identifier(constraintId, 'constraintId');
      const input = observationInput(raw, ['amountCents']);
      const amountCents = cents(input.amountCents, 'amountCents', true)!;
      return prisma.$transaction(async (tx) => {
        if (!await stableEntity(tx, 'constraint', caseId, id)) throw new ClientFinancialPositionError('NOT_FOUND', 'The Financial Constraint is unavailable to this Client Case.');
        const source = await sourceFor(tx, subject, caseId, input.financialSourceId);
        assertProvenance(source, input.sourcePosture, input.verificationState);
        const predecessor = await assertCurrentPredecessor(tx, 'constraint', caseId, id, input.supersedesObservationId);
        if (predecessor) await markSuperseded(tx, 'constraint', predecessor.id);
        return tx.clientFinancialConstraintObservation.create({ data: { clientCaseId: caseId, constraintId: id, financialSourceId: source?.id ?? null, amountCents, currencyCode: input.currencyCode, sourcePosture: input.sourcePosture, verificationState: input.verificationState, observationKind: input.observationKind, limitation: input.limitation, asOf: input.asOf, observedAt: input.observedAt, effectiveAt: input.effectiveAt, reviewAfter: input.reviewAfter, supersedesObservationId: predecessor?.id ?? null, createdBySubject: subject } });
      });
    },

    async getCurrentFinancialPosition(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const position = await prisma.clientFinancialPosition.findUnique({ where: { clientCaseId: caseId }, select: { id: true, clientCaseId: true, createdAt: true } });
      if (!position) return null;
      const [assets, liabilities, incomeSources, qualifications, constraints] = await Promise.all([
        prisma.clientFinancialAsset.findMany({ where: { clientCaseId: caseId }, select: { id: true, category: true, label: true, clientCasePartyId: true, observations: { where: { supersededAt: null }, select: { id: true, marketValueCents: true, liquidValueCents: true, availableAmountCents: true, sourcePosture: true, verificationState: true, observationKind: true, asOf: true, observedAt: true, effectiveAt: true, reviewAfter: true, financialSourceId: true } } }, orderBy: { createdAt: 'asc' } }),
        prisma.clientFinancialLiability.findMany({ where: { clientCaseId: caseId }, select: { id: true, category: true, label: true, clientCasePartyId: true, clientCasePropertyId: true, observations: { where: { supersededAt: null }, select: { id: true, currentBalanceCents: true, monthlyObligationCents: true, rateBps: true, sourcePosture: true, verificationState: true, observationKind: true, asOf: true, observedAt: true, effectiveAt: true, reviewAfter: true, financialSourceId: true } } }, orderBy: { createdAt: 'asc' } }),
        prisma.clientFinancialIncomeSource.findMany({ where: { clientCaseId: caseId }, select: { id: true, category: true, label: true, clientCasePartyId: true, clientCasePropertyId: true, observations: { where: { supersededAt: null }, select: { id: true, amountCents: true, frequency: true, sourcePosture: true, verificationState: true, observationKind: true, asOf: true, observedAt: true, effectiveAt: true, reviewAfter: true, financialSourceId: true } } }, orderBy: { createdAt: 'asc' } }),
        prisma.clientFinancialQualification.findMany({ where: { clientCaseId: caseId }, select: { id: true, qualificationType: true, label: true, observations: { where: { supersededAt: null }, select: { id: true, maximumLoanAmountCents: true, maximumPurchaseAmountCents: true, rateBps: true, programLabel: true, conditions: true, sourcePosture: true, verificationState: true, observationKind: true, asOf: true, observedAt: true, effectiveAt: true, expiresAt: true, reviewAfter: true, financialSourceId: true } } }, orderBy: { createdAt: 'asc' } }),
        prisma.clientFinancialConstraint.findMany({ where: { clientCaseId: caseId }, select: { id: true, constraintType: true, observations: { where: { supersededAt: null }, select: { id: true, amountCents: true, sourcePosture: true, verificationState: true, observationKind: true, asOf: true, observedAt: true, effectiveAt: true, reviewAfter: true, financialSourceId: true } } }, orderBy: { createdAt: 'asc' } }),
      ]);
      return { ...position, assets, liabilities, incomeSources, qualifications: qualifications.map((qualification) => ({ ...qualification, observations: qualification.observations.map((observation) => ({ ...observation, currentState: currentState(observation.expiresAt) })) })), constraints };
    },

    async listCurrentAssets(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      return prisma.clientFinancialAsset.findMany({ where: { clientCaseId: caseId }, include: { observations: { where: { supersededAt: null } } }, orderBy: { createdAt: 'asc' } });
    },

    async listCurrentLiabilities(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      return prisma.clientFinancialLiability.findMany({ where: { clientCaseId: caseId }, include: { observations: { where: { supersededAt: null } } }, orderBy: { createdAt: 'asc' } });
    },

    async listCurrentIncome(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      return prisma.clientFinancialIncomeSource.findMany({ where: { clientCaseId: caseId }, include: { observations: { where: { supersededAt: null } } }, orderBy: { createdAt: 'asc' } });
    },

    async listCurrentQualifications(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const qualifications = await prisma.clientFinancialQualification.findMany({ where: { clientCaseId: caseId }, include: { observations: { where: { supersededAt: null } } }, orderBy: { createdAt: 'asc' } });
      return qualifications.map((qualification) => ({ ...qualification, observations: qualification.observations.map((observation) => ({ ...observation, currentState: currentState(observation.expiresAt) })) }));
    },

    async listCurrentConstraints(ownerAgentSubject: string, clientCaseId: string) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      return prisma.clientFinancialConstraint.findMany({ where: { clientCaseId: caseId }, include: { observations: { where: { supersededAt: null } } }, orderBy: { createdAt: 'asc' } });
    },

    async listObservationHistory(ownerAgentSubject: string, clientCaseId: string, domain: 'ASSET' | 'LIABILITY' | 'INCOME' | 'QUALIFICATION' | 'CONSTRAINT', entityId: string, take = 100) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const id = identifier(entityId, 'financial entity id');
      if (!Number.isInteger(take) || take < 1 || take > 100) throw new ClientFinancialPositionError('INVALID_REQUEST', 'take is invalid.');
      if (domain === 'ASSET') return prisma.clientFinancialAssetObservation.findMany({ where: { clientCaseId: caseId, assetId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
      if (domain === 'LIABILITY') return prisma.clientFinancialLiabilityObservation.findMany({ where: { clientCaseId: caseId, liabilityId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
      if (domain === 'INCOME') return prisma.clientFinancialIncomeObservation.findMany({ where: { clientCaseId: caseId, incomeSourceId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
      if (domain === 'QUALIFICATION') return prisma.clientFinancialQualificationObservation.findMany({ where: { clientCaseId: caseId, qualificationId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
      return prisma.clientFinancialConstraintObservation.findMany({ where: { clientCaseId: caseId, constraintId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
    },

    async listAssetHistory(ownerAgentSubject: string, clientCaseId: string, assetId: string, take = 100) {
      const { caseId } = await authorize(ownerAgentSubject, clientCaseId);
      const id = identifier(assetId, 'assetId');
      if (!Number.isInteger(take) || take < 1 || take > 100) throw new ClientFinancialPositionError('INVALID_REQUEST', 'take is invalid.');
      if (!await prisma.clientFinancialAsset.findFirst({ where: { id, clientCaseId: caseId }, select: { id: true } })) throw new ClientFinancialPositionError('NOT_FOUND', 'The Asset is unavailable to this Client Case.');
      return prisma.clientFinancialAssetObservation.findMany({ where: { clientCaseId: caseId, assetId: id }, orderBy: [{ asOf: 'desc' }, { createdAt: 'desc' }], take });
    },
  };
}
