import { createHash } from 'node:crypto';

import type { Prisma, PrismaClient } from '@prisma/client';

import {
  CONTEXT_SCOPES,
  CREATABLE_PURSUIT_OBJECTIVE_TYPES,
  CRITERION_SEMANTICS,
  FACT_SEMANTICS,
  OBJECTIVE_STATUSES,
  OBJECTIVE_TYPES,
  SOURCE_POSTURES,
  type ContextScope,
  type CriterionSemanticKey,
  type FactSemanticKey,
  type ObjectiveStatus,
  type ObjectiveType,
  type SemanticDefinition,
  type SourcePosture,
} from './clientCaseContextSemanticRegistry';

export { CLIENT_CASE_CONTEXT_RECORDS_FOUNDATION_VERSION } from './clientCaseContextSemanticRegistry';

export class ClientCaseContextRecordsError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT', message: string) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;
type ContextKind = 'fact' | 'criterion';
type ContextDatabase = Pick<PrismaClient, 'clientCase' | 'clientCaseObjective' | 'clientCaseProperty' | 'clientCaseFact' | 'clientCaseCriterion' | 'evidenceAdmission' | 'professionalInput' | '$transaction'>;

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function label(value: unknown, field: string, maximum: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function requiredId(value: unknown, field: string) {
  return label(value, field, 160)!;
}

function registryValue<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function optionalDate(value: unknown, field: string) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} is invalid.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${field} is invalid.`);
  return parsed;
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function semanticDefinition(kind: ContextKind, value: unknown): [string, SemanticDefinition] {
  const key = typeof value === 'string' ? value : '';
  const registry = kind === 'fact' ? FACT_SEMANTICS : CRITERION_SEMANTICS;
  const definition = registry[key as keyof typeof registry] as SemanticDefinition | undefined;
  if (!definition) throw new ClientCaseContextRecordsError('INVALID_REQUEST', `${kind} semanticKey is unsupported.`);
  return [key, definition];
}

function validateValue(definition: SemanticDefinition, value: unknown): Prisma.InputJsonValue {
  if (definition.valueType === 'ENUM') {
    if (typeof value !== 'string' || !definition.enumValues?.includes(value)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Context value is invalid for its semantic key.');
    return value;
  }
  if (definition.valueType === 'INTEGER') {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 100_000) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Context value is invalid for its semantic key.');
    return value;
  }
  if (definition.valueType === 'STRING_SET') {
    if (!Array.isArray(value) || value.length === 0 || value.length > 12 || value.some((entry) => typeof entry !== 'string' || !entry.trim() || entry.trim().length > 80 || /[<>]/.test(entry))) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Context value is invalid for its semantic key.');
    const normalized = value.map((entry) => entry.trim());
    if (new Set(normalized).size !== normalized.length) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Context value is invalid for its semantic key.');
    return normalized;
  }
  const range = object(value, 'Context value');
  const minimumCents = range.minimumCents;
  const maximumCents = range.maximumCents;
  if (typeof minimumCents !== 'number' || typeof maximumCents !== 'number' || !Number.isSafeInteger(minimumCents) || !Number.isSafeInteger(maximumCents) || minimumCents < 0 || maximumCents < minimumCents || maximumCents > 10_000_000_000 || range.currency !== 'USD') throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Context value is invalid for its semantic key.');
  return { minimumCents, maximumCents, currency: 'USD' };
}

async function ownedCase(prisma: ContextDatabase, ownerAgentSubject: string, clientCaseId: string) {
  const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
  if (!clientCase) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  return clientCase;
}

async function resolveScope(prisma: ContextDatabase, ownerAgentSubject: string, clientCaseId: string, input: RecordValue, definition: SemanticDefinition) {
  const scope = registryValue(input.scope, CONTEXT_SCOPES, 'scope') as ContextScope;
  if (!definition.allowedScopes.includes(scope)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'The semantic key does not support that scope.');
  const objectiveId = input.objectiveId === undefined || input.objectiveId === null ? null : requiredId(input.objectiveId, 'objectiveId');
  const clientCasePropertyId = input.clientCasePropertyId === undefined || input.clientCasePropertyId === null ? null : requiredId(input.clientCasePropertyId, 'clientCasePropertyId');
  if (scope === 'CASE') {
    if (objectiveId || clientCasePropertyId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Case scope cannot include an Objective or Property relationship.');
    return { scope, scopeReference: 'CASE', objectiveId: null, clientCasePropertyId: null };
  }
  if (scope === 'OBJECTIVE') {
    if (!objectiveId || clientCasePropertyId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Objective scope requires exactly one owned Objective.');
    const objective = await prisma.clientCaseObjective.findFirst({ where: { id: objectiveId, clientCaseId }, select: { id: true } });
    if (!objective) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The Client Case Objective is unavailable to this Agent.');
    return { scope, scopeReference: `OBJECTIVE:${objective.id}`, objectiveId: objective.id, clientCasePropertyId: null };
  }
  if (!clientCasePropertyId || objectiveId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Property scope requires exactly one owned Case Property relationship.');
  const property = await prisma.clientCaseProperty.findFirst({ where: { id: clientCasePropertyId, clientCaseId }, select: { id: true } });
  if (!property) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The Client Case Property relationship is unavailable to this Agent.');
  return { scope, scopeReference: `PROPERTY:${property.id}`, objectiveId: null, clientCasePropertyId: property.id };
}

async function resolveProvenance(prisma: ContextDatabase, ownerAgentSubject: string, input: RecordValue, definition: SemanticDefinition) {
  const sourcePosture = registryValue(input.sourcePosture, SOURCE_POSTURES, 'sourcePosture') as SourcePosture;
  if (!definition.allowedSourcePostures.includes(sourcePosture)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'The semantic key does not support that source posture.');
  const evidenceAdmissionId = input.evidenceAdmissionId === undefined || input.evidenceAdmissionId === null ? null : requiredId(input.evidenceAdmissionId, 'evidenceAdmissionId');
  const professionalInputId = input.professionalInputId === undefined || input.professionalInputId === null ? null : requiredId(input.professionalInputId, 'professionalInputId');
  if (evidenceAdmissionId && professionalInputId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Only one provenance reference may support a context record.');
  if (sourcePosture === 'EVIDENCE_SUPPORTED' && !evidenceAdmissionId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Evidence-supported context requires an admitted Evidence reference.');
  if (sourcePosture === 'PROFESSIONAL_INPUT_SUPPORTED' && !professionalInputId) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Professional-input-supported context requires a Professional Input reference.');
  if ((sourcePosture === 'CLIENT_STATED' || sourcePosture === 'AGENT_ENTERED' || sourcePosture === 'SYSTEM_DERIVED') && (evidenceAdmissionId || professionalInputId)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'The source posture does not permit a provenance reference.');
  if (evidenceAdmissionId && !await prisma.evidenceAdmission.findFirst({ where: { id: evidenceAdmissionId, ownerAgentSubject }, select: { id: true } })) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The admitted Evidence reference is unavailable to this Agent.');
  if (professionalInputId && !await prisma.professionalInput.findFirst({ where: { id: professionalInputId, ownerAgentSubject }, select: { id: true } })) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The Professional Input reference is unavailable to this Agent.');
  return { sourcePosture, evidenceAdmissionId, professionalInputId };
}

function contextInput(kind: ContextKind, value: unknown) {
  const input = object(value);
  const [semanticKey, definition] = semanticDefinition(kind, input.semanticKey);
  return {
    input,
    semanticKey,
    definition,
    value: validateValue(definition, input.value),
    observedAt: optionalDate(input.observedAt, 'observedAt'),
    effectiveAt: optionalDate(input.effectiveAt, 'effectiveAt'),
    reviewAfter: optionalDate(input.reviewAfter, 'reviewAfter'),
    limitation: label(input.limitation, 'limitation', 600, false),
  };
}

export function createClientCaseContextRecordsService(prisma: ContextDatabase) {
  async function createContextRecord(kind: ContextKind, ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
    await ownedCase(prisma, ownerAgentSubject, clientCaseId);
    const parsed = contextInput(kind, raw);
    const scope = await resolveScope(prisma, ownerAgentSubject, clientCaseId, parsed.input, parsed.definition);
    const provenance = await resolveProvenance(prisma, ownerAgentSubject, parsed.input, parsed.definition);
    const predecessorId = parsed.input.supersedesId === undefined || parsed.input.supersedesId === null ? null : requiredId(parsed.input.supersedesId, 'supersedesId');
    const currentWhere = { clientCaseId, semanticKey: parsed.semanticKey, scopeReference: scope.scopeReference, supersededAt: null };
    const common = { clientCaseId, ...scope, semanticKey: parsed.semanticKey, value: parsed.value, ...provenance, recordedBySubject: ownerAgentSubject, observedAt: parsed.observedAt, effectiveAt: parsed.effectiveAt, reviewAfter: parsed.reviewAfter, limitation: parsed.limitation };
    try {
      return await prisma.$transaction(async (tx) => {
        if (kind === 'fact') {
          if (predecessorId) {
            const predecessor = await tx.clientCaseFact.findFirst({ where: { id: predecessorId, clientCaseId }, select: { id: true, semanticKey: true, scopeReference: true, supersededAt: true } });
            if (!predecessor) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The superseded fact is unavailable to this Agent.');
            if (predecessor.supersededAt || predecessor.semanticKey !== parsed.semanticKey || predecessor.scopeReference !== scope.scopeReference) throw new ClientCaseContextRecordsError('CONFLICT', 'The superseded fact is no longer current for this semantic scope.');
            await tx.clientCaseFact.update({ where: { id: predecessor.id }, data: { supersededAt: new Date() } });
            return tx.clientCaseFact.create({ data: { ...common, supersedesFactId: predecessor.id } });
          }
          if (await tx.clientCaseFact.findFirst({ where: currentWhere, select: { id: true } })) throw new ClientCaseContextRecordsError('CONFLICT', 'A current fact already exists for this semantic scope; create an explicit successor instead.');
          return tx.clientCaseFact.create({ data: common });
        }
        if (predecessorId) {
          const predecessor = await tx.clientCaseCriterion.findFirst({ where: { id: predecessorId, clientCaseId }, select: { id: true, semanticKey: true, scopeReference: true, supersededAt: true } });
          if (!predecessor) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The superseded criterion is unavailable to this Agent.');
          if (predecessor.supersededAt || predecessor.semanticKey !== parsed.semanticKey || predecessor.scopeReference !== scope.scopeReference) throw new ClientCaseContextRecordsError('CONFLICT', 'The superseded criterion is no longer current for this semantic scope.');
          await tx.clientCaseCriterion.update({ where: { id: predecessor.id }, data: { supersededAt: new Date() } });
          return tx.clientCaseCriterion.create({ data: { ...common, supersedesCriterionId: predecessor.id } });
        }
        if (await tx.clientCaseCriterion.findFirst({ where: currentWhere, select: { id: true } })) throw new ClientCaseContextRecordsError('CONFLICT', 'A current criterion already exists for this semantic scope; create an explicit successor instead.');
        return tx.clientCaseCriterion.create({ data: common });
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') throw new ClientCaseContextRecordsError('CONFLICT', `A concurrent ${kind} revision already exists for this semantic scope.`);
      throw error;
    }
  }

  return {
    async listObjectiveSummary(ownerAgentSubject: string, clientCaseId: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const objectives = await prisma.clientCaseObjective.findMany({
        where: { clientCaseId },
        select: { id: true, objectiveType: true, status: true, title: true, createdAt: true, completedAt: true, archivedAt: true },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      });
      const current = objectives.filter((objective) => objective.status === 'ACTIVE');
      const historical = objectives.filter((objective) => objective.status !== 'ACTIVE');
      return {
        clientCaseId,
        current,
        historical,
        currentCount: current.length,
        historicalCount: historical.length,
      };
    },

    async createObjective(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const input = object(raw);
      const objectiveType = registryValue(input.objectiveType, OBJECTIVE_TYPES, 'objectiveType') as ObjectiveType;
      const title = label(input.title, 'title', 160)!;
      const mutationKey = requiredId(input.clientMutationKey, 'clientMutationKey');
      const idempotencyKey = `ATLAS_CLIENT_CASE_OBJECTIVE_V1|${ownerAgentSubject}|${clientCaseId}|${fingerprint({ objectiveType, title, mutationKey })}`;
      const existing = await prisma.clientCaseObjective.findUnique({ where: { idempotencyKey } });
      if (existing) return existing;
      return prisma.clientCaseObjective.create({ data: { clientCaseId, objectiveType, title, createdBySubject: ownerAgentSubject, idempotencyKey } });
    },

    async createPursuitObjective(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const input = object(raw);
      const objectiveType = registryValue(input.objectiveType, OBJECTIVE_TYPES, 'objectiveType') as ObjectiveType;
      if (!CREATABLE_PURSUIT_OBJECTIVE_TYPES.includes(objectiveType)) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'This Objective type is not available for new pursuits.');
      const title = label(input.title, 'title', 160)!;
      const mutationKey = requiredId(input.clientMutationKey, 'clientMutationKey');
      const idempotencyKey = `ATLAS_CLIENT_CASE_OBJECTIVE_V1|${ownerAgentSubject}|${clientCaseId}|${fingerprint({ objectiveType, title, mutationKey })}`;
      const existing = await prisma.clientCaseObjective.findUnique({ where: { idempotencyKey } });
      if (existing) return existing;
      return prisma.clientCaseObjective.create({ data: { clientCaseId, objectiveType, title, createdBySubject: ownerAgentSubject, idempotencyKey } });
    },

    async transitionObjective(ownerAgentSubject: string, clientCaseId: string, objectiveId: string, raw: unknown) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const input = object(raw);
      const status = registryValue(input.status, OBJECTIVE_STATUSES, 'status') as ObjectiveStatus;
      const objective = await prisma.clientCaseObjective.findFirst({ where: { id: objectiveId, clientCaseId } });
      if (!objective) throw new ClientCaseContextRecordsError('NOT_FOUND', 'The Client Case Objective is unavailable to this Agent.');
      if (objective.status === status) return objective;
      if (objective.status !== 'ACTIVE') throw new ClientCaseContextRecordsError('CONFLICT', 'Completed or archived Objectives are immutable in Foundation V1.');
      return prisma.clientCaseObjective.update({ where: { id: objective.id }, data: { status, completedAt: status === 'COMPLETED' ? new Date() : null, archivedAt: status === 'ARCHIVED' ? new Date() : null } });
    },

    createFact(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      return createContextRecord('fact', ownerAgentSubject, clientCaseId, raw);
    },

    createCriterion(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      return createContextRecord('criterion', ownerAgentSubject, clientCaseId, raw);
    },

    async readCurrent(ownerAgentSubject: string, clientCaseId: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      const [objectives, facts, criteria, properties] = await Promise.all([
        prisma.clientCaseObjective.findMany({ where: { clientCaseId }, orderBy: { createdAt: 'asc' } }),
        prisma.clientCaseFact.findMany({ where: { clientCaseId, supersededAt: null }, orderBy: { createdAt: 'asc' } }),
        prisma.clientCaseCriterion.findMany({ where: { clientCaseId, supersededAt: null }, orderBy: { createdAt: 'asc' } }),
        prisma.clientCaseProperty.findMany({ where: { clientCaseId }, orderBy: { createdAt: 'asc' } }),
      ]);
      return { clientCaseId, objectives, facts, criteria, properties };
    },

    async factHistory(ownerAgentSubject: string, clientCaseId: string, semanticKey: FactSemanticKey, scopeReference: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      semanticDefinition('fact', semanticKey);
      return prisma.clientCaseFact.findMany({ where: { clientCaseId, semanticKey, scopeReference }, orderBy: { createdAt: 'asc' } });
    },

    async criterionHistory(ownerAgentSubject: string, clientCaseId: string, semanticKey: CriterionSemanticKey, scopeReference: string) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      semanticDefinition('criterion', semanticKey);
      return prisma.clientCaseCriterion.findMany({ where: { clientCaseId, semanticKey, scopeReference }, orderBy: { createdAt: 'asc' } });
    },
  };
}
