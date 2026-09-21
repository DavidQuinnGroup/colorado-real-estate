import type {
  ClientCaseScenarioFinancialContextEntryDomain,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { assertEligibleClientCaseGovernedSource, ClientCaseGovernedSourceError } from './clientCaseGovernedSourceFoundation';

export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_FOUNDATION_VERSION = 'CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_FOUNDATION_V1' as const;
export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_SCHEMA_VERSION = 1 as const;

const DOMAINS = ['ASSET', 'LIABILITY', 'INCOME', 'BORROWING_QUALIFICATION', 'FINANCIAL_CONSTRAINT'] as const satisfies readonly ClientCaseScenarioFinancialContextEntryDomain[];

type RecordValue = Record<string, unknown>;
type Database = Pick<
  PrismaClient,
  | 'clientCase'
  | 'clientFinancialPosition'
  | 'clientFinancialAssetObservation'
  | 'clientFinancialLiabilityObservation'
  | 'clientFinancialIncomeObservation'
  | 'clientFinancialQualificationObservation'
  | 'clientFinancialConstraintObservation'
  | 'clientCaseScenario'
  | 'clientCaseScenarioFinancialContextDraft'
  | 'clientCaseScenarioFinancialContextDraftSelection'
  | '$transaction'
>;
type Transaction = Prisma.TransactionClient;

export class ClientCaseScenarioFinancialContextDraftError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT', message: string) {
    super(message);
  }
}

type SelectionInput = Readonly<{
  domain: ClientCaseScenarioFinancialContextEntryDomain;
  entityId: string;
  observationId: string;
}>;

type ResolvedSelection = Readonly<{
  domain: ClientCaseScenarioFinancialContextEntryDomain;
  assetId?: string | null;
  assetObservationId?: string | null;
  liabilityId?: string | null;
  liabilityObservationId?: string | null;
  incomeSourceId?: string | null;
  incomeObservationId?: string | null;
  qualificationId?: string | null;
  qualificationObservationId?: string | null;
  constraintId?: string | null;
  constraintObservationId?: string | null;
  clientCasePartyId?: string | null;
  clientCasePropertyId?: string | null;
  financialSourceId: string | null;
  clientCaseGovernedSourceId: string | null;
}>;

function record(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum = 160): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function optionalText(value: unknown, field: string) {
  return value === undefined || value === null ? null : text(value, field);
}

function exactKeys(value: RecordValue, keys: readonly string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', 'The request contains unsupported fields.');
}

function revision(value: unknown, required = true): number | null {
  if (value === undefined || value === null) {
    if (!required) return null;
    throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', 'expectedRevision is required.');
  }
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', 'expectedRevision is invalid.');
  return value;
}

function selection(value: unknown): SelectionInput {
  const input = record(value, 'selection');
  exactKeys(input, ['domain', 'entityId', 'observationId']);
  const domain = text(input.domain, 'domain', 80) as ClientCaseScenarioFinancialContextEntryDomain;
  if (!(DOMAINS as readonly string[]).includes(domain)) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', 'domain is invalid.');
  return Object.freeze({ domain, entityId: text(input.entityId, 'entityId'), observationId: text(input.observationId, 'observationId') });
}

function mutationInput(raw: unknown) {
  const input = record(raw);
  exactKeys(input, ['expectedRevision', 'selection']);
  return { expectedRevision: revision(input.expectedRevision, false), selection: selection(input.selection) };
}

function reviewedInput(raw: unknown) {
  const input = record(raw);
  exactKeys(input, ['expectedRevision', 'selection']);
  const parsed = mutationInput(input);
  if (parsed.expectedRevision === null) throw new ClientCaseScenarioFinancialContextDraftError('INVALID_REQUEST', 'expectedRevision is required.');
  return parsed as { expectedRevision: number; selection: SelectionInput };
}

function expectedRevisionOnly(raw: unknown) {
  const input = record(raw);
  exactKeys(input, ['expectedRevision']);
  return revision(input.expectedRevision);
}

async function authorizeScenario(database: Pick<Database, 'clientCaseScenario'>, ownerAgentSubject: string, clientCaseId: string, scenarioId: string, mutation = false) {
  const scenario = await database.clientCaseScenario.findFirst({
    where: { id: scenarioId, clientCaseId, clientCase: { ownerAgentSubject } },
    select: { id: true, clientCaseId: true, status: true, currentVersionId: true },
  });
  if (!scenario) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The Scenario is unavailable to this Agent.');
  if (mutation && scenario.status !== 'ACTIVE') throw new ClientCaseScenarioFinancialContextDraftError('CONFLICT', 'Archived Scenarios cannot receive draft financial context selections.');
  return scenario;
}

async function sourceLineage(tx: Transaction, ownerAgentSubject: string, clientCaseId: string, source: { id: string; clientCaseGovernedSourceId: string } | null) {
  if (!source) return { financialSourceId: null, clientCaseGovernedSourceId: null };
  try {
    await assertEligibleClientCaseGovernedSource(tx as never, ownerAgentSubject, clientCaseId, source.clientCaseGovernedSourceId);
  } catch (error) {
    if (error instanceof ClientCaseGovernedSourceError) throw new ClientCaseScenarioFinancialContextDraftError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'CONFLICT', error.message);
    throw error;
  }
  return { financialSourceId: source.id, clientCaseGovernedSourceId: source.clientCaseGovernedSourceId };
}

const SOURCE_SELECT = { select: { id: true, clientCaseGovernedSourceId: true } } as const;

async function resolveSelection(tx: Transaction, ownerAgentSubject: string, clientCaseId: string, financialPositionId: string, input: SelectionInput): Promise<ResolvedSelection> {
  if (input.domain === 'ASSET') {
    const observation = await tx.clientFinancialAssetObservation.findFirst({
      where: { id: input.observationId, clientCaseId, assetId: input.entityId, supersededAt: null },
      include: { asset: true, financialSource: SOURCE_SELECT },
    });
    if (!observation || observation.asset.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected Asset observation is unavailable to this Financial Position.');
    return { domain: 'ASSET', assetId: observation.asset.id, assetObservationId: observation.id, clientCasePartyId: observation.asset.clientCasePartyId, ...(await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource)) };
  }
  if (input.domain === 'LIABILITY') {
    const observation = await tx.clientFinancialLiabilityObservation.findFirst({
      where: { id: input.observationId, clientCaseId, liabilityId: input.entityId, supersededAt: null },
      include: { liability: true, financialSource: SOURCE_SELECT },
    });
    if (!observation || observation.liability.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected Liability observation is unavailable to this Financial Position.');
    return { domain: 'LIABILITY', liabilityId: observation.liability.id, liabilityObservationId: observation.id, clientCasePartyId: observation.liability.clientCasePartyId, clientCasePropertyId: observation.liability.clientCasePropertyId, ...(await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource)) };
  }
  if (input.domain === 'INCOME') {
    const observation = await tx.clientFinancialIncomeObservation.findFirst({
      where: { id: input.observationId, clientCaseId, incomeSourceId: input.entityId, supersededAt: null },
      include: { incomeSource: true, financialSource: SOURCE_SELECT },
    });
    if (!observation || observation.incomeSource.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected Income observation is unavailable to this Financial Position.');
    return { domain: 'INCOME', incomeSourceId: observation.incomeSource.id, incomeObservationId: observation.id, clientCasePartyId: observation.incomeSource.clientCasePartyId, clientCasePropertyId: observation.incomeSource.clientCasePropertyId, ...(await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource)) };
  }
  if (input.domain === 'BORROWING_QUALIFICATION') {
    const observation = await tx.clientFinancialQualificationObservation.findFirst({
      where: { id: input.observationId, clientCaseId, qualificationId: input.entityId, supersededAt: null },
      include: { qualification: true, financialSource: SOURCE_SELECT },
    });
    if (!observation || observation.qualification.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected Qualification observation is unavailable to this Financial Position.');
    return { domain: 'BORROWING_QUALIFICATION', qualificationId: observation.qualification.id, qualificationObservationId: observation.id, ...(await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource)) };
  }
  const observation = await tx.clientFinancialConstraintObservation.findFirst({
    where: { id: input.observationId, clientCaseId, constraintId: input.entityId, supersededAt: null },
    include: { constraint: true, financialSource: SOURCE_SELECT },
  });
  if (!observation || observation.constraint.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected Constraint observation is unavailable to this Financial Position.');
  return { domain: 'FINANCIAL_CONSTRAINT', constraintId: observation.constraint.id, constraintObservationId: observation.id, ...(await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource)) };
}

function entityDeleteWhere(draftId: string, resolved: ResolvedSelection) {
  if (resolved.domain === 'ASSET') return { draftId, assetId: resolved.assetId };
  if (resolved.domain === 'LIABILITY') return { draftId, liabilityId: resolved.liabilityId };
  if (resolved.domain === 'INCOME') return { draftId, incomeSourceId: resolved.incomeSourceId };
  if (resolved.domain === 'BORROWING_QUALIFICATION') return { draftId, qualificationId: resolved.qualificationId };
  return { draftId, constraintId: resolved.constraintId };
}

function selectionCreateData(draftId: string, clientCaseId: string, subject: string, resolved: ResolvedSelection): Prisma.ClientCaseScenarioFinancialContextDraftSelectionUncheckedCreateInput {
  return {
    draftId,
    clientCaseId,
    domain: resolved.domain,
    assetId: resolved.assetId ?? null,
    assetObservationId: resolved.assetObservationId ?? null,
    liabilityId: resolved.liabilityId ?? null,
    liabilityObservationId: resolved.liabilityObservationId ?? null,
    incomeSourceId: resolved.incomeSourceId ?? null,
    incomeObservationId: resolved.incomeObservationId ?? null,
    qualificationId: resolved.qualificationId ?? null,
    qualificationObservationId: resolved.qualificationObservationId ?? null,
    constraintId: resolved.constraintId ?? null,
    constraintObservationId: resolved.constraintObservationId ?? null,
    clientCasePartyId: resolved.clientCasePartyId ?? null,
    clientCasePropertyId: resolved.clientCasePropertyId ?? null,
    financialSourceId: resolved.financialSourceId,
    clientCaseGovernedSourceId: resolved.clientCaseGovernedSourceId,
    selectedBySubject: subject,
    mutationKind: 'SELECT',
  };
}

function includeDraft() {
  return { selections: { orderBy: [{ domain: 'asc' as const }, { selectedAt: 'asc' as const }, { id: 'asc' as const }] } };
}

export function createClientCaseScenarioFinancialContextDraftService(prisma: Database) {
  async function readDraft(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, database: Database = prisma) {
    await authorizeScenario(database, ownerAgentSubject, clientCaseId, scenarioId);
    const draft = await database.clientCaseScenarioFinancialContextDraft.findFirst({
      where: { clientCaseId, scenarioId, ownerAgentSubject },
      include: includeDraft(),
    });
    return Object.freeze({ draft, state: draft ? 'DRAFT_AVAILABLE' as const : 'NO_DRAFT' as const });
  }

  async function draftForMutation(tx: Transaction, ownerAgentSubject: string, clientCaseId: string, scenarioId: string, expectedRevision: number | null) {
    await authorizeScenario(tx as never, ownerAgentSubject, clientCaseId, scenarioId, true);
    const existing = await tx.clientCaseScenarioFinancialContextDraft.findFirst({ where: { clientCaseId, scenarioId, ownerAgentSubject }, select: { id: true, revision: true } });
    if (!existing) {
      if (expectedRevision !== null) throw new ClientCaseScenarioFinancialContextDraftError('CONFLICT', 'The Scenario Financial Context draft revision is stale.');
      const draft = await tx.clientCaseScenarioFinancialContextDraft.create({
        data: {
          clientCaseId,
          scenarioId,
          ownerAgentSubject,
          draftSchemaVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_SCHEMA_VERSION,
          createdBySubject: ownerAgentSubject,
          updatedBySubject: ownerAgentSubject,
        },
        select: { id: true, revision: true },
      });
      return { ...draft, created: true };
    }
    if (expectedRevision === null || existing.revision !== expectedRevision) throw new ClientCaseScenarioFinancialContextDraftError('CONFLICT', 'The Scenario Financial Context draft revision is stale.');
    return { ...existing, created: false };
  }

  async function advanceRevision(tx: Transaction, draftId: string, expectedRevision: number, ownerAgentSubject: string) {
    const advanced = await tx.clientCaseScenarioFinancialContextDraft.updateMany({
      where: { id: draftId, revision: expectedRevision },
      data: { revision: { increment: 1 }, updatedBySubject: ownerAgentSubject },
    });
    if (advanced.count !== 1) throw new ClientCaseScenarioFinancialContextDraftError('CONFLICT', 'The Scenario Financial Context draft revision is stale.');
    return expectedRevision + 1;
  }

  async function positionId(tx: Transaction, clientCaseId: string) {
    const position = await tx.clientFinancialPosition.findUnique({ where: { clientCaseId }, select: { id: true } });
    if (!position) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'Selected financial facts require a Client Financial Position.');
    return position.id;
  }

  return Object.freeze({
    readDraft,

    async selectFinancialContext(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const input = mutationInput(raw);
      return prisma.$transaction(async (tx) => {
        const draft = await draftForMutation(tx, ownerAgentSubject, clientCaseId, scenarioId, input.expectedRevision);
        const nextRevision = await advanceRevision(tx, draft.id, draft.revision, ownerAgentSubject);
        const resolved = await resolveSelection(tx, ownerAgentSubject, clientCaseId, await positionId(tx, clientCaseId), input.selection);
        await tx.clientCaseScenarioFinancialContextDraftSelection.deleteMany({ where: entityDeleteWhere(draft.id, resolved) });
        await tx.clientCaseScenarioFinancialContextDraftSelection.create({ data: selectionCreateData(draft.id, clientCaseId, ownerAgentSubject, resolved) });
        const result = await readDraft(ownerAgentSubject, clientCaseId, scenarioId, tx as never);
        return Object.freeze({ ...result, revision: nextRevision, created: draft.created });
      });
    },

    async deselectFinancialContext(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const input = reviewedInput(raw);
      return prisma.$transaction(async (tx) => {
        const draft = await draftForMutation(tx, ownerAgentSubject, clientCaseId, scenarioId, input.expectedRevision);
        const nextRevision = await advanceRevision(tx, draft.id, draft.revision, ownerAgentSubject);
        const resolved = await resolveSelection(tx, ownerAgentSubject, clientCaseId, await positionId(tx, clientCaseId), input.selection);
        await tx.clientCaseScenarioFinancialContextDraftSelection.deleteMany({ where: entityDeleteWhere(draft.id, resolved) });
        const result = await readDraft(ownerAgentSubject, clientCaseId, scenarioId, tx as never);
        return Object.freeze({ ...result, revision: nextRevision, created: false });
      });
    },

    async reviewFinancialContextSelection(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const input = reviewedInput(raw);
      return prisma.$transaction(async (tx) => {
        const draft = await draftForMutation(tx, ownerAgentSubject, clientCaseId, scenarioId, input.expectedRevision);
        const nextRevision = await advanceRevision(tx, draft.id, draft.revision, ownerAgentSubject);
        const resolved = await resolveSelection(tx, ownerAgentSubject, clientCaseId, await positionId(tx, clientCaseId), input.selection);
        const existing = await tx.clientCaseScenarioFinancialContextDraftSelection.findFirst({ where: entityDeleteWhere(draft.id, resolved), select: { id: true } });
        if (!existing) throw new ClientCaseScenarioFinancialContextDraftError('NOT_FOUND', 'The selected financial context entry is unavailable to this draft.');
        await tx.clientCaseScenarioFinancialContextDraftSelection.update({
          where: { id: existing.id },
          data: { ...selectionCreateData(draft.id, clientCaseId, ownerAgentSubject, resolved), reviewedAt: new Date(), reviewedBySubject: ownerAgentSubject, mutationKind: 'REVIEW' },
        });
        const result = await readDraft(ownerAgentSubject, clientCaseId, scenarioId, tx as never);
        return Object.freeze({ ...result, revision: nextRevision, created: false });
      });
    },

    async clearDraftSelections(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const expectedRevision = expectedRevisionOnly(raw);
      return prisma.$transaction(async (tx) => {
        const draft = await draftForMutation(tx, ownerAgentSubject, clientCaseId, scenarioId, expectedRevision);
        const nextRevision = await advanceRevision(tx, draft.id, draft.revision, ownerAgentSubject);
        await tx.clientCaseScenarioFinancialContextDraftSelection.deleteMany({ where: { draftId: draft.id, clientCaseId } });
        const result = await readDraft(ownerAgentSubject, clientCaseId, scenarioId, tx as never);
        return Object.freeze({ ...result, revision: nextRevision, created: false });
      });
    },

    parseDraftSelectionForCertification(raw: unknown) {
      return selection(raw);
    },

    optionalDraftSelectionIdentifierForCertification(raw: unknown) {
      return optionalText(raw, 'identifier');
    },
  });
}
