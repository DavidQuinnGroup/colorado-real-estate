import type { ClientCaseScenarioPropertyDispositionType, ClientCaseScenarioValueType, Prisma, PrismaClient } from '@prisma/client';

import {
  SCENARIO_ASSUMPTION_SEMANTICS,
  SCENARIO_CRITERION_SEMANTICS,
  SCENARIO_PROPERTY_DISPOSITIONS,
  type ScenarioSemanticDefinition,
} from './clientCaseScenarioSemanticRegistry';

export { CLIENT_CASE_SCENARIO_FOUNDATION_VERSION } from './clientCaseScenarioSemanticRegistry';

export class ClientCaseScenarioError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT', message: string) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;
type ScenarioDatabase = Pick<PrismaClient, 'clientCase' | 'clientCaseObjective' | 'clientCaseProperty' | 'clientCaseScenario' | 'clientCaseScenarioVersion' | '$transaction'>;
type ScenarioTransaction = Prisma.TransactionClient;
export type ClientCaseScenarioDefinition = {
  assumptions: Array<{ semanticKey: string; valueType: ClientCaseScenarioValueType; value: Prisma.InputJsonValue }>;
  criteria: Array<{ semanticKey: string; valueType: ClientCaseScenarioValueType; value: Prisma.InputJsonValue }>;
  propertyDispositions: Array<{ clientCasePropertyId: string; disposition: ClientCaseScenarioPropertyDispositionType }>;
  objectiveIds: string[];
};

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function id(value: unknown, field: string) {
  return text(value, field, 160)!;
}

function array(value: unknown, field: string): unknown[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 24) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} is invalid.`);
  return value;
}

function unique<T>(values: T[], field: string, key: (value: T) => string) {
  if (new Set(values.map(key)).size !== values.length) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} contains duplicates.`);
  return values;
}

function valueFor(definition: ScenarioSemanticDefinition, value: unknown): Prisma.InputJsonValue {
  if (definition.valueType === 'MONEY_CENTS') {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 10_000_000_000) throw new ClientCaseScenarioError('INVALID_REQUEST', 'Scenario value is invalid for its semantic key.');
    return value;
  }
  if (definition.valueType === 'PERCENT_BPS') {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 10_000) throw new ClientCaseScenarioError('INVALID_REQUEST', 'Scenario value is invalid for its semantic key.');
    return value;
  }
  if (definition.valueType === 'INTEGER') {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 10_000) throw new ClientCaseScenarioError('INVALID_REQUEST', 'Scenario value is invalid for its semantic key.');
    return value;
  }
  if (!Array.isArray(value) || value.length === 0 || value.length > 12 || value.some((entry) => typeof entry !== 'string' || !entry.trim() || entry.trim().length > 80 || /[<>]/.test(entry))) {
    throw new ClientCaseScenarioError('INVALID_REQUEST', 'Scenario value is invalid for its semantic key.');
  }
  const normalized = value.map((entry) => entry.trim());
  if (new Set(normalized).size !== normalized.length) throw new ClientCaseScenarioError('INVALID_REQUEST', 'Scenario value is invalid for its semantic key.');
  return normalized;
}

function semanticEntries(value: unknown, registry: Record<string, ScenarioSemanticDefinition>, field: string) {
  const entries = array(value, field).map((entry) => {
    const input = object(entry, field);
    const semanticKey = text(input.semanticKey, `${field}.semanticKey`, 100)!;
    const definition = registry[semanticKey];
    if (!definition) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} semanticKey is unsupported.`);
    return { semanticKey, valueType: definition.valueType, value: valueFor(definition, input.value) };
  });
  return unique(entries, field, (entry) => entry.semanticKey);
}

function definition(value: unknown): ClientCaseScenarioDefinition {
  const input = object(value, 'definition');
  const propertyDispositions = array(input.propertyDispositions, 'propertyDispositions').map((entry) => {
    const disposition = object(entry, 'propertyDisposition');
    const value = text(disposition.disposition, 'propertyDisposition.disposition', 80)!;
    if (!(SCENARIO_PROPERTY_DISPOSITIONS as readonly string[]).includes(value)) throw new ClientCaseScenarioError('INVALID_REQUEST', 'propertyDisposition.disposition is invalid.');
    return { clientCasePropertyId: id(disposition.clientCasePropertyId, 'propertyDisposition.clientCasePropertyId'), disposition: value as ClientCaseScenarioPropertyDispositionType };
  });
  const objectiveIds = array(input.objectiveIds, 'objectiveIds').map((entry) => id(entry, 'objectiveId'));
  return {
    assumptions: semanticEntries(input.assumptions, SCENARIO_ASSUMPTION_SEMANTICS, 'assumptions') as ClientCaseScenarioDefinition['assumptions'],
    criteria: semanticEntries(input.criteria, SCENARIO_CRITERION_SEMANTICS, 'criteria') as ClientCaseScenarioDefinition['criteria'],
    propertyDispositions: unique(propertyDispositions, 'propertyDispositions', (entry) => entry.clientCasePropertyId),
    objectiveIds: unique(objectiveIds, 'objectiveIds', (entry) => entry),
  };
}

async function ownedCase(prisma: Pick<ScenarioDatabase, 'clientCase'>, ownerAgentSubject: string, clientCaseId: string) {
  const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
  if (!clientCase) throw new ClientCaseScenarioError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
  return clientCase;
}

async function ownedScenario(prisma: Pick<ScenarioDatabase, 'clientCaseScenario'>, ownerAgentSubject: string, clientCaseId: string, scenarioId: string) {
  const scenario = await prisma.clientCaseScenario.findFirst({ where: { id: scenarioId, clientCaseId, clientCase: { ownerAgentSubject } }, select: { id: true, status: true, currentVersionId: true, name: true, description: true } });
  if (!scenario) throw new ClientCaseScenarioError('NOT_FOUND', 'The Scenario is unavailable to this Agent.');
  return scenario;
}

async function validateDefinitionReferences(prisma: Pick<ScenarioDatabase, 'clientCaseObjective' | 'clientCaseProperty'>, clientCaseId: string, next: ClientCaseScenarioDefinition) {
  for (const objectiveId of next.objectiveIds) {
    if (!await prisma.clientCaseObjective.findFirst({ where: { id: objectiveId, clientCaseId }, select: { id: true } })) throw new ClientCaseScenarioError('NOT_FOUND', 'A Scenario Objective is unavailable to this Client Case.');
  }
  for (const property of next.propertyDispositions) {
    if (!await prisma.clientCaseProperty.findFirst({ where: { id: property.clientCasePropertyId, clientCaseId }, select: { id: true } })) throw new ClientCaseScenarioError('NOT_FOUND', 'A Scenario Property relationship is unavailable to this Client Case.');
  }
}

export async function createClientCaseScenarioVersion(prisma: ScenarioTransaction, scenarioId: string, versionNumber: number, createdBySubject: string, next: ClientCaseScenarioDefinition) {
  return prisma.clientCaseScenarioVersion.create({
    data: {
      scenarioId,
      versionNumber,
      createdBySubject,
      assumptions: next.assumptions.length ? { create: next.assumptions } : undefined,
      criteria: next.criteria.length ? { create: next.criteria } : undefined,
      propertyDispositions: next.propertyDispositions.length ? { create: next.propertyDispositions.map(({ clientCasePropertyId, disposition }) => ({ disposition, clientCaseProperty: { connect: { id: clientCasePropertyId } } })) } : undefined,
      objectiveLinks: next.objectiveIds.length ? { create: next.objectiveIds.map((clientCaseObjectiveId) => ({ clientCaseObjective: { connect: { id: clientCaseObjectiveId } } })) } : undefined,
    },
  });
}

export function definitionFromClientCaseScenarioVersion(version: {
  assumptions: ReadonlyArray<{ semanticKey: string; valueType: ClientCaseScenarioValueType; value: Prisma.JsonValue }>;
  criteria: ReadonlyArray<{ semanticKey: string; valueType: ClientCaseScenarioValueType; value: Prisma.JsonValue }>;
  propertyDispositions: ReadonlyArray<{ clientCasePropertyId: string; disposition: ClientCaseScenarioPropertyDispositionType }>;
  objectiveLinks: ReadonlyArray<{ clientCaseObjectiveId: string }>;
}): ClientCaseScenarioDefinition {
  return {
    assumptions: version.assumptions.map((entry) => ({ semanticKey: entry.semanticKey, valueType: entry.valueType, value: entry.value as Prisma.InputJsonValue })),
    criteria: version.criteria.map((entry) => ({ semanticKey: entry.semanticKey, valueType: entry.valueType, value: entry.value as Prisma.InputJsonValue })),
    propertyDispositions: version.propertyDispositions.map((entry) => ({ clientCasePropertyId: entry.clientCasePropertyId, disposition: entry.disposition })),
    objectiveIds: version.objectiveLinks.map((entry) => entry.clientCaseObjectiveId),
  };
}

function scenarioInclude() {
  return {
    currentVersion: {
      include: {
        assumptions: { orderBy: { semanticKey: 'asc' as const } },
        criteria: { orderBy: { semanticKey: 'asc' as const } },
        propertyDispositions: { orderBy: { clientCasePropertyId: 'asc' as const } },
        objectiveLinks: { orderBy: { clientCaseObjectiveId: 'asc' as const } },
      },
    },
  };
}

export function createClientCaseScenarioService(prisma: ScenarioDatabase) {
  async function get(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, database: ScenarioDatabase = prisma) {
    await ownedCase(database, ownerAgentSubject, clientCaseId);
    const scenario = await database.clientCaseScenario.findFirst({ where: { id: scenarioId, clientCaseId, clientCase: { ownerAgentSubject } }, include: scenarioInclude() });
    if (!scenario) throw new ClientCaseScenarioError('NOT_FOUND', 'The Scenario is unavailable to this Agent.');
    return scenario;
  }

  return {
    async list(ownerAgentSubject: string, clientCaseId: string, archived = false) {
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      return prisma.clientCaseScenario.findMany({
        where: { clientCaseId, clientCase: { ownerAgentSubject }, status: archived ? 'ARCHIVED' : 'ACTIVE' },
        select: { id: true, name: true, description: true, status: true, archivedAt: true, currentVersionId: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: 'asc' },
      });
    },

    get,

    async history(ownerAgentSubject: string, clientCaseId: string, scenarioId: string) {
      await ownedScenario(prisma, ownerAgentSubject, clientCaseId, scenarioId);
      return prisma.clientCaseScenarioVersion.findMany({
        where: { scenarioId },
        include: {
          assumptions: { orderBy: { semanticKey: 'asc' } },
          criteria: { orderBy: { semanticKey: 'asc' } },
          propertyDispositions: { orderBy: { clientCasePropertyId: 'asc' } },
          objectiveLinks: { orderBy: { clientCaseObjectiveId: 'asc' } },
        },
        orderBy: { versionNumber: 'asc' },
      });
    },

    async create(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const input = object(raw);
      const name = text(input.name, 'name', 160)!;
      const description = text(input.description, 'description', 1_000, false);
      const initialDefinition = definition(input.initialDefinition);
      await ownedCase(prisma, ownerAgentSubject, clientCaseId);
      return prisma.$transaction(async (tx) => {
        await validateDefinitionReferences(tx as never, clientCaseId, initialDefinition);
        const scenario = await tx.clientCaseScenario.create({ data: { clientCaseId, name, description, createdBySubject: ownerAgentSubject } });
        const version = await createClientCaseScenarioVersion(tx, scenario.id, 1, ownerAgentSubject, initialDefinition);
        await tx.clientCaseScenario.update({ where: { id: scenario.id }, data: { currentVersionId: version.id } });
        return get(ownerAgentSubject, clientCaseId, scenario.id, tx as never);
      });
    },

    async updateDefinition(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const input = object(raw);
      const expectedCurrentVersionId = id(input.expectedCurrentVersionId, 'expectedCurrentVersionId');
      const nextDefinition = definition(input.definition);
      await ownedScenario(prisma, ownerAgentSubject, clientCaseId, scenarioId);
      return prisma.$transaction(async (tx) => {
        const scenario = await tx.clientCaseScenario.findFirst({ where: { id: scenarioId, clientCaseId, clientCase: { ownerAgentSubject } }, select: { id: true, status: true, currentVersionId: true } });
        if (!scenario) throw new ClientCaseScenarioError('NOT_FOUND', 'The Scenario is unavailable to this Agent.');
        if (scenario.status !== 'ACTIVE') throw new ClientCaseScenarioError('CONFLICT', 'Archived Scenarios cannot receive a new definition.');
        if (scenario.currentVersionId !== expectedCurrentVersionId) throw new ClientCaseScenarioError('CONFLICT', 'The Scenario definition is stale.');
        const current = await tx.clientCaseScenarioVersion.findFirst({ where: { id: expectedCurrentVersionId, scenarioId }, select: { versionNumber: true } });
        if (!current) throw new ClientCaseScenarioError('CONFLICT', 'The Scenario current-version relationship is invalid.');
        await validateDefinitionReferences(tx as never, clientCaseId, nextDefinition);
        const version = await createClientCaseScenarioVersion(tx, scenarioId, current.versionNumber + 1, ownerAgentSubject, nextDefinition);
        const advanced = await tx.clientCaseScenario.updateMany({ where: { id: scenarioId, currentVersionId: expectedCurrentVersionId, status: 'ACTIVE' }, data: { currentVersionId: version.id } });
        if (advanced.count !== 1) throw new ClientCaseScenarioError('CONFLICT', 'The Scenario definition is stale.');
        return get(ownerAgentSubject, clientCaseId, scenarioId, tx as never);
      }).catch((error: unknown) => {
        if ((error as { code?: string }).code === 'P2002') throw new ClientCaseScenarioError('CONFLICT', 'A concurrent Scenario version already exists.');
        throw error;
      });
    },

    async rename(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const name = text(object(raw).name, 'name', 160)!;
      await ownedScenario(prisma, ownerAgentSubject, clientCaseId, scenarioId);
      await prisma.clientCaseScenario.update({ where: { id: scenarioId }, data: { name } });
      return get(ownerAgentSubject, clientCaseId, scenarioId);
    },

    async archive(ownerAgentSubject: string, clientCaseId: string, scenarioId: string) {
      const scenario = await ownedScenario(prisma, ownerAgentSubject, clientCaseId, scenarioId);
      if (scenario.status === 'ARCHIVED') return get(ownerAgentSubject, clientCaseId, scenarioId);
      await prisma.clientCaseScenario.update({ where: { id: scenarioId }, data: { status: 'ARCHIVED', archivedAt: new Date() } });
      return get(ownerAgentSubject, clientCaseId, scenarioId);
    },

    async duplicate(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown = {}) {
      const input = object(raw);
      const source = await ownedScenario(prisma, ownerAgentSubject, clientCaseId, scenarioId);
      const sourceCurrentVersionId = source.currentVersionId;
      if (source.status !== 'ACTIVE' || !sourceCurrentVersionId) throw new ClientCaseScenarioError('CONFLICT', 'Only active Scenarios with a current version can be duplicated.');
      const name = input.name === undefined || input.name === null || input.name === '' ? `Copy of ${source.name}` : text(input.name, 'name', 160)!;
      return prisma.$transaction(async (tx) => {
        const current = await tx.clientCaseScenarioVersion.findFirst({
          where: { id: sourceCurrentVersionId, scenarioId },
          include: { assumptions: true, criteria: true, propertyDispositions: true, objectiveLinks: true },
        });
        if (!current) throw new ClientCaseScenarioError('CONFLICT', 'The Scenario current-version relationship is invalid.');
        const copied = definitionFromClientCaseScenarioVersion(current);
        const duplicate = await tx.clientCaseScenario.create({ data: { clientCaseId, name, description: source.description, duplicatedFromScenarioId: scenarioId, duplicatedFromScenarioVersionId: current.id, createdBySubject: ownerAgentSubject } });
        const version = await createClientCaseScenarioVersion(tx, duplicate.id, 1, ownerAgentSubject, copied);
        await tx.clientCaseScenario.update({ where: { id: duplicate.id }, data: { currentVersionId: version.id } });
        return get(ownerAgentSubject, clientCaseId, duplicate.id, tx as never);
      });
    },
  };
}
