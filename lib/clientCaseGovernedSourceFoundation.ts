import type { Prisma, PrismaClient } from '@prisma/client';

export const CLIENT_CASE_GOVERNED_SOURCE_FOUNDATION_VERSION = 'CLIENT_CASE_GOVERNED_SOURCE_FOUNDATION_V1' as const;
export const CLIENT_CASE_GOVERNED_SOURCE_KINDS = ['EVIDENCE', 'PROFESSIONAL_INPUT'] as const;

type Database = Pick<
  PrismaClient,
  | 'clientCase'
  | 'clientCaseGovernedSource'
  | 'evidenceAdmission'
  | 'professionalInput'
  | '$transaction'
>;

type SourceDatabase = Pick<Prisma.TransactionClient, 'clientCase' | 'clientCaseGovernedSource' | 'evidenceAdmission' | 'professionalInput'>;
type RecordValue = Record<string, unknown>;

export class ClientCaseGovernedSourceError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function object(value: unknown, field = 'input'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseGovernedSourceError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function identifier(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) throw new ClientCaseGovernedSourceError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function exactKeys(value: RecordValue, allowed: readonly string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new ClientCaseGovernedSourceError('INVALID_REQUEST', 'Governed source input contains unsupported fields.');
}

function isPrismaError(error: unknown, code: string) {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === code);
}

function isCurrent(source: { effectiveAt: Date | null; expiresAt: Date | null; supersededByAdmission?: { id: string } | null }) {
  const now = new Date();
  return !source.supersededByAdmission && (!source.effectiveAt || source.effectiveAt <= now) && (!source.expiresAt || source.expiresAt > now);
}

async function ownedCase(database: SourceDatabase, ownerAgentSubject: string, clientCaseId: string, mutation: boolean) {
  const owner = identifier(ownerAgentSubject, 'authenticated subject');
  const caseId = identifier(clientCaseId, 'clientCaseId');
  const clientCase = await database.clientCase.findFirst({ where: { id: caseId, ownerAgentSubject: owner }, select: { id: true, status: true } });
  if (!clientCase) throw new ClientCaseGovernedSourceError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  if (mutation && clientCase.status !== 'ACTIVE') throw new ClientCaseGovernedSourceError('CONFLICT', 'Archived Client Cases are read-only for governed sources.');
  return { owner, caseId };
}

async function eligibleEvidence(database: SourceDatabase, ownerAgentSubject: string, evidenceAdmissionId: string) {
  const evidence = await database.evidenceAdmission.findFirst({
    where: { id: identifier(evidenceAdmissionId, 'evidenceAdmissionId'), ownerAgentSubject },
    include: { supersededByAdmission: { select: { id: true } } },
  });
  if (!evidence) throw new ClientCaseGovernedSourceError('NOT_FOUND', 'The Evidence Admission is unavailable to this Agent.');
  if (!isCurrent(evidence)) throw new ClientCaseGovernedSourceError('CONFLICT', 'The Evidence Admission is not currently eligible for Client Case association.');
  return evidence;
}

async function eligibleProfessionalInput(database: SourceDatabase, ownerAgentSubject: string, professionalInputId: string) {
  const professionalInput = await database.professionalInput.findFirst({
    where: { id: identifier(professionalInputId, 'professionalInputId'), ownerAgentSubject },
    include: { evidenceAdmission: { include: { supersededByAdmission: { select: { id: true } } } } },
  });
  if (!professionalInput) throw new ClientCaseGovernedSourceError('NOT_FOUND', 'The Professional Input is unavailable to this Agent.');
  if (!isCurrent(professionalInput.evidenceAdmission) || (professionalInput.effectiveAt && professionalInput.effectiveAt > new Date()) || (professionalInput.expiresAt && professionalInput.expiresAt <= new Date())) {
    throw new ClientCaseGovernedSourceError('CONFLICT', 'The Professional Input is not currently eligible for Client Case association.');
  }
  return professionalInput;
}

export type ClientCaseGovernedSourceSummary = Readonly<{
  id: string;
  sourceKind: (typeof CLIENT_CASE_GOVERNED_SOURCE_KINDS)[number];
  createdAt: Date;
  source: Readonly<{
    claimKind: string;
    effectiveAt: Date | null;
    expiresAt: Date | null;
    reviewAfter: Date | null;
    sourceKind?: string;
  }>;
}>;

export async function assertEligibleClientCaseGovernedSource(database: SourceDatabase, ownerAgentSubject: string, clientCaseId: string, clientCaseGovernedSourceId: string) {
  const { owner, caseId } = await ownedCase(database, ownerAgentSubject, clientCaseId, false);
  const association = await database.clientCaseGovernedSource.findFirst({
    where: { id: identifier(clientCaseGovernedSourceId, 'clientCaseGovernedSourceId'), clientCaseId: caseId, ownerAgentSubject: owner },
    include: {
      evidenceAdmission: { include: { supersededByAdmission: { select: { id: true } } } },
      professionalInput: { include: { evidenceAdmission: { include: { supersededByAdmission: { select: { id: true } } } } } },
    },
  });
  if (!association) throw new ClientCaseGovernedSourceError('NOT_FOUND', 'The governed source is unavailable to this Client Case.');
  if (association.sourceKind === 'EVIDENCE') {
    if (!association.evidenceAdmission || association.professionalInputId || !isCurrent(association.evidenceAdmission)) throw new ClientCaseGovernedSourceError('CONFLICT', 'The Evidence governed source is not currently eligible.');
  } else if (association.sourceKind === 'PROFESSIONAL_INPUT') {
    const input = association.professionalInput;
    if (!input || association.evidenceAdmissionId || !isCurrent(input.evidenceAdmission) || (input.effectiveAt && input.effectiveAt > new Date()) || (input.expiresAt && input.expiresAt <= new Date())) {
      throw new ClientCaseGovernedSourceError('CONFLICT', 'The Professional Input governed source is not currently eligible.');
    }
  } else {
    throw new ClientCaseGovernedSourceError('CONFLICT', 'The governed source kind is invalid.');
  }
  return association;
}

export function createClientCaseGovernedSourceService(prisma: Database) {
  async function associateEvidenceToClientCase(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
    const input = object(raw);
    exactKeys(input, ['evidenceAdmissionId']);
    return prisma.$transaction(async (tx) => {
      const { owner, caseId } = await ownedCase(tx, ownerAgentSubject, clientCaseId, true);
      const evidence = await eligibleEvidence(tx, owner, identifier(input.evidenceAdmissionId, 'evidenceAdmissionId'));
      try {
        return await tx.clientCaseGovernedSource.create({ data: { clientCaseId: caseId, ownerAgentSubject: owner, sourceKind: 'EVIDENCE', evidenceAdmissionId: evidence.id, createdBySubject: owner } });
      } catch (error) {
        if (isPrismaError(error, 'P2002')) throw new ClientCaseGovernedSourceError('CONFLICT', 'That Evidence Admission is already associated with this Client Case.');
        throw error;
      }
    });
  }

  async function associateProfessionalInputToClientCase(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
    const input = object(raw);
    exactKeys(input, ['professionalInputId']);
    return prisma.$transaction(async (tx) => {
      const { owner, caseId } = await ownedCase(tx, ownerAgentSubject, clientCaseId, true);
      const professionalInput = await eligibleProfessionalInput(tx, owner, identifier(input.professionalInputId, 'professionalInputId'));
      try {
        return await tx.clientCaseGovernedSource.create({ data: { clientCaseId: caseId, ownerAgentSubject: owner, sourceKind: 'PROFESSIONAL_INPUT', professionalInputId: professionalInput.id, createdBySubject: owner } });
      } catch (error) {
        if (isPrismaError(error, 'P2002')) throw new ClientCaseGovernedSourceError('CONFLICT', 'That Professional Input is already associated with this Client Case.');
        throw error;
      }
    });
  }

  async function listClientCaseGovernedSources(ownerAgentSubject: string, clientCaseId: string, take = 100): Promise<ClientCaseGovernedSourceSummary[]> {
    const { owner, caseId } = await ownedCase(prisma, ownerAgentSubject, clientCaseId, false);
    if (!Number.isInteger(take) || take < 1 || take > 100) throw new ClientCaseGovernedSourceError('INVALID_REQUEST', 'take is invalid.');
    const associations = await prisma.clientCaseGovernedSource.findMany({
      where: { clientCaseId: caseId, ownerAgentSubject: owner },
      include: {
        evidenceAdmission: { select: { claimKind: true, effectiveAt: true, expiresAt: true, reviewAfter: true, sourceKind: true, supersededByAdmission: { select: { id: true } } } },
        professionalInput: { select: { claimKind: true, effectiveAt: true, expiresAt: true, reviewAfter: true, evidenceAdmission: { select: { effectiveAt: true, expiresAt: true, supersededByAdmission: { select: { id: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
    return associations.reduce<ClientCaseGovernedSourceSummary[]>((summaries, association) => {
      if (association.sourceKind === 'EVIDENCE' && association.evidenceAdmission && isCurrent(association.evidenceAdmission)) {
        summaries.push({ id: association.id, sourceKind: 'EVIDENCE', createdAt: association.createdAt, source: { claimKind: association.evidenceAdmission.claimKind, effectiveAt: association.evidenceAdmission.effectiveAt, expiresAt: association.evidenceAdmission.expiresAt, reviewAfter: association.evidenceAdmission.reviewAfter, sourceKind: association.evidenceAdmission.sourceKind } });
      }
      const input = association.professionalInput;
      if (association.sourceKind === 'PROFESSIONAL_INPUT' && input && isCurrent(input.evidenceAdmission) && (!input.effectiveAt || input.effectiveAt <= new Date()) && (!input.expiresAt || input.expiresAt > new Date())) {
        summaries.push({ id: association.id, sourceKind: 'PROFESSIONAL_INPUT', createdAt: association.createdAt, source: { claimKind: input.claimKind, effectiveAt: input.effectiveAt, expiresAt: input.expiresAt, reviewAfter: input.reviewAfter } });
      }
      return summaries;
    }, []);
  }

  return Object.freeze({ associateEvidenceToClientCase, associateProfessionalInputToClientCase, listClientCaseGovernedSources, assertEligibleClientCaseGovernedSource });
}
