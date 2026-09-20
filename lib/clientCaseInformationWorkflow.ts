import type { ClientCaseContextSourcePosture, Prisma, PrismaClient } from '@prisma/client';

import { createClientCaseCapabilityReadinessService } from './clientCaseCapabilityReadinessEvaluator';
import { createClientCaseContextService } from './clientCaseContextFoundation';
import { createClientCaseContextRecordsService } from './clientCaseContextRecordsFoundation';
import { CRITERION_SEMANTICS, FACT_SEMANTICS } from './clientCaseContextSemanticRegistry';
import { createClientCasePropertyRelationshipService } from './clientCasePropertyRelationshipRoles';
import { createClientInformationWaveAService } from './clientInformationWaveAFoundation';

export const CLIENT_CASE_INFORMATION_WORKFLOW_VERSION = 'CANONICAL_CLIENT_CASE_INFORMATION_WORKFLOW_V1' as const;
export const CLIENT_CASE_INFORMATION_API_ROUTE = '/api/agent/client-case-information' as const;

const DIRECT_ENTRY_POSTURES = ['CLIENT_STATED', 'AGENT_ENTERED'] as const satisfies readonly ClientCaseContextSourcePosture[];
const PROPERTY_OCCUPANCY_VALUES = FACT_SEMANTICS.PROPERTY_OCCUPANCY_STATUS.enumValues;

type DirectEntryPosture = (typeof DIRECT_ENTRY_POSTURES)[number];
type RecordValue = Record<string, unknown>;
type InformationDatabase = Pick<
  PrismaClient,
  | 'clientCase'
  | 'clientCaseObjective'
  | 'clientCaseObjectivePropertyRelationship'
  | 'clientCaseProperty'
  | 'canonicalPhysicalProperty'
  | 'clientCasePropertyRelationshipRole'
  | 'clientCaseFact'
  | 'clientCaseCriterion'
  | 'evidenceAdmission'
  | 'professionalInput'
  | 'clientCaseScenarioVersion'
  | '$transaction'
>;

export type ClientCaseInformationSaveInput = Readonly<{
  targetCities?: readonly string[];
  purchasePriceRange?: Readonly<{ minimumDollars: string | number; maximumDollars: string | number }>;
  minBedrooms?: string | number | null;
  propertyOccupancy?: readonly Readonly<{ clientCasePropertyId: string; value: string }>[];
  sourcePosture?: DirectEntryPosture;
  observedAt?: string | null;
  effectiveAt?: string | null;
  reviewAfter?: string | null;
}>;

export class ClientCaseInformationError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function object(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function id(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function optionalDate(value: unknown, field: string) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  return parsed.toISOString();
}

function sourcePosture(value: unknown): DirectEntryPosture {
  if (value === undefined || value === null || value === '') return 'AGENT_ENTERED';
  if (value !== 'CLIENT_STATED' && value !== 'AGENT_ENTERED') throw new ClientCaseInformationError('INVALID_REQUEST', 'sourcePosture is unsupported for direct Agent entry.');
  return value;
}

function cents(value: unknown, field: string) {
  const raw = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim().replace(/[$,\s]/g, '') : '';
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  const [dollars, fractional = ''] = raw.split('.');
  const parsed = Number(dollars) * 100 + Number((fractional + '00').slice(0, 2));
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 10_000_000_000) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  return parsed;
}

function integer(value: unknown, field: string) {
  const raw = typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value.trim()) : NaN;
  if (!Number.isSafeInteger(raw) || raw < 0 || raw > 100_000) throw new ClientCaseInformationError('INVALID_REQUEST', `${field} is invalid.`);
  return raw;
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value as RecordValue).sort().map((key) => `${JSON.stringify(key)}:${stable((value as RecordValue)[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function sameValue(left: unknown, right: unknown) {
  return stable(left) === stable(right);
}

function directContext(input: ClientCaseInformationSaveInput) {
  return {
    sourcePosture: sourcePosture(input.sourcePosture),
    observedAt: optionalDate(input.observedAt, 'observedAt'),
    effectiveAt: optionalDate(input.effectiveAt, 'effectiveAt'),
    reviewAfter: optionalDate(input.reviewAfter, 'reviewAfter'),
  };
}

function normalizeCities(value: unknown) {
  if (!Array.isArray(value)) throw new ClientCaseInformationError('INVALID_REQUEST', 'targetCities must be a list.');
  const cities = value.map((entry) => {
    if (typeof entry !== 'string' || !entry.trim() || entry.trim().length > 80 || /[<>]/.test(entry)) throw new ClientCaseInformationError('INVALID_REQUEST', 'targetCities includes an invalid city.');
    return entry.trim();
  });
  if (cities.length > 12 || new Set(cities).size !== cities.length) throw new ClientCaseInformationError('INVALID_REQUEST', 'targetCities is invalid.');
  return cities;
}

async function ownedCase(prisma: InformationDatabase, ownerAgentSubject: string, clientCaseId: string) {
  const found = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
  if (!found) throw new ClientCaseInformationError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
}

function currentBySemantic<T extends { semanticKey: string; scopeReference: string; createdAt: Date }>(records: readonly T[], semanticKey: string, scopeReference: string) {
  return [...records].filter((entry) => entry.semanticKey === semanticKey && entry.scopeReference === scopeReference).sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())[0] ?? null;
}

export function createClientCaseInformationWorkflowService(prisma: InformationDatabase) {
  const cases = createClientCaseContextService(prisma as PrismaClient);
  const records = createClientCaseContextRecordsService(prisma);
  const readiness = createClientCaseCapabilityReadinessService(prisma);
  const people = createClientInformationWaveAService(prisma as PrismaClient);
  const propertyRelationships = createClientCasePropertyRelationshipService(prisma as PrismaClient);

  async function load(ownerAgentSubject: string, clientCaseId: string) {
    await ownedCase(prisma, ownerAgentSubject, clientCaseId);
    const [clientCase, current, peopleState, relationshipProperties] = await Promise.all([
      cases.detail(ownerAgentSubject, clientCaseId),
      records.readCurrent(ownerAgentSubject, clientCaseId),
      people.listPeople(ownerAgentSubject, clientCaseId),
      propertyRelationships.listProperties(ownerAgentSubject, clientCaseId),
    ]);
    const buyerObjective = current.objectives.find((entry) => entry.objectiveType === 'BUY_PRIMARY_HOME' && entry.status === 'ACTIVE' && !entry.archivedAt) ?? null;
    const targetCities = currentBySemantic(current.criteria, 'TARGET_CITIES', 'CASE');
    const purchaseRange = buyerObjective ? currentBySemantic(current.criteria, 'PURCHASE_PRICE_RANGE_CENTS', `OBJECTIVE:${buyerObjective.id}`) : null;
    const minBedrooms = buyerObjective ? currentBySemantic(current.criteria, 'MIN_BEDROOMS', `OBJECTIVE:${buyerObjective.id}`) : null;
    const occupancy = current.properties.map((property) => ({
      clientCasePropertyId: property.id,
      current: currentBySemantic(current.facts, 'PROPERTY_OCCUPANCY_STATUS', `PROPERTY:${property.id}`),
    }));
    const [buyerReadiness, financialReadiness] = await Promise.all([
      readiness.evaluate(ownerAgentSubject, { clientCaseId, capability: 'BUYER_DECISION' }).catch(() => null),
      readiness.evaluate(ownerAgentSubject, { clientCaseId, capability: 'FINANCIAL_STRATEGY' }).catch(() => null),
    ]);
    return {
      workflowVersion: CLIENT_CASE_INFORMATION_WORKFLOW_VERSION,
      clientCase,
      supported: {
        criteria: Object.keys(CRITERION_SEMANTICS),
        facts: Object.keys(FACT_SEMANTICS),
        sourcePostures: [...DIRECT_ENTRY_POSTURES],
      },
      current: {
        objectiveRecords: current.objectives,
        targetCities,
        purchasePriceRange: purchaseRange,
        minBedrooms,
        propertyOccupancy: occupancy,
        properties: relationshipProperties,
      },
      propertyRelationships: {
        relationshipRoles: ['CURRENT_HOME', 'TARGET_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_RELEVANT', 'OTHER'],
        currentLinkingMechanism: 'AGENT_PROPERTY_SEARCH_SELECT',
        propertyDiscoveryUx: 'STAGE_1_EXISTING_DATA_SEARCH_SELECT',
        addressAutocomplete: 'REPOSITORY_DATA_SEARCH_AS_YOU_TYPE',
        offMarketDiscovery: 'DEFERRED',
        provisionalPropertyCreate: 'NOT_IMPLEMENTED',
      },
      people: peopleState,
      readinessPreview: {
        BUYER_DECISION: buyerReadiness,
        FINANCIAL_STRATEGY: financialReadiness,
      },
    };
  }

  async function save(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
    await ownedCase(prisma, ownerAgentSubject, clientCaseId);
    const input = object(raw, 'input') as ClientCaseInformationSaveInput & RecordValue;
    if ('evidenceAdmissionId' in input || 'professionalInputId' in input) throw new ClientCaseInformationError('INVALID_REQUEST', 'Direct information entry cannot claim Evidence or Professional Input references.');
    const context = directContext(input);
    const before = await records.readCurrent(ownerAgentSubject, clientCaseId);

    const current = before;
    const buyerObjective = current.objectives.find((entry) => entry.objectiveType === 'BUY_PRIMARY_HOME' && entry.status === 'ACTIVE' && !entry.archivedAt) ?? null;

    async function upsertCriterion(semanticKey: 'TARGET_CITIES' | 'PURCHASE_PRICE_RANGE_CENTS' | 'MIN_BEDROOMS', value: Prisma.InputJsonValue, scope: 'CASE' | 'OBJECTIVE', objectiveId?: string) {
      const scopeReference = scope === 'CASE' ? 'CASE' : `OBJECTIVE:${objectiveId}`;
      const existing = currentBySemantic(current.criteria, semanticKey, scopeReference);
      if (existing && sameValue(existing.value, value)) return existing;
      return records.createCriterion(ownerAgentSubject, clientCaseId, { semanticKey, scope, ...(objectiveId ? { objectiveId } : {}), value, ...context, ...(existing ? { supersedesId: existing.id } : {}) });
    }

    if (input.targetCities !== undefined) {
      const cities = normalizeCities(input.targetCities);
      if (cities.length) await upsertCriterion('TARGET_CITIES', cities, 'CASE');
    }
    if (input.purchasePriceRange !== undefined) {
      if (!buyerObjective) throw new ClientCaseInformationError('INVALID_REQUEST', 'A Buyer objective is required before saving purchase price range.');
      const range = object(input.purchasePriceRange, 'purchasePriceRange');
      const minimumCents = cents(range.minimumDollars, 'minimumDollars');
      const maximumCents = cents(range.maximumDollars, 'maximumDollars');
      if (minimumCents > maximumCents) throw new ClientCaseInformationError('INVALID_REQUEST', 'Purchase price minimum must be less than or equal to maximum.');
      await upsertCriterion('PURCHASE_PRICE_RANGE_CENTS', { minimumCents, maximumCents, currency: 'USD' }, 'OBJECTIVE', buyerObjective.id);
    }
    if (input.minBedrooms !== undefined && input.minBedrooms !== null && input.minBedrooms !== '') {
      if (!buyerObjective) throw new ClientCaseInformationError('INVALID_REQUEST', 'A Buyer objective is required before saving minimum bedrooms.');
      await upsertCriterion('MIN_BEDROOMS', integer(input.minBedrooms, 'minBedrooms'), 'OBJECTIVE', buyerObjective.id);
    }
    if (input.propertyOccupancy !== undefined) {
      if (!Array.isArray(input.propertyOccupancy)) throw new ClientCaseInformationError('INVALID_REQUEST', 'propertyOccupancy is invalid.');
      for (const item of input.propertyOccupancy) {
        const entry = object(item, 'propertyOccupancy');
        const clientCasePropertyId = id(entry.clientCasePropertyId, 'clientCasePropertyId');
        const value = id(entry.value, 'propertyOccupancy.value');
        if (!PROPERTY_OCCUPANCY_VALUES.includes(value as (typeof PROPERTY_OCCUPANCY_VALUES)[number])) throw new ClientCaseInformationError('INVALID_REQUEST', 'PROPERTY_OCCUPANCY_STATUS value is unsupported.');
        const property = current.properties.find((candidate) => candidate.id === clientCasePropertyId);
        if (!property) throw new ClientCaseInformationError('OWNERSHIP_DENIED', 'The selected property relationship is unavailable to this Agent.');
        const existing = currentBySemantic(current.facts, 'PROPERTY_OCCUPANCY_STATUS', `PROPERTY:${clientCasePropertyId}`);
        if (existing && sameValue(existing.value, value)) continue;
        await records.createFact(ownerAgentSubject, clientCaseId, { semanticKey: 'PROPERTY_OCCUPANCY_STATUS', scope: 'PROPERTY', clientCasePropertyId, value, ...context, ...(existing ? { supersedesId: existing.id } : {}) });
      }
    }

    return load(ownerAgentSubject, clientCaseId);
  }

  async function attachExistingProperty(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
    await propertyRelationships.attachExistingProperty(ownerAgentSubject, clientCaseId, raw);
    return load(ownerAgentSubject, clientCaseId);
  }

  async function addRelationshipRole(ownerAgentSubject: string, clientCaseId: string, clientCasePropertyId: string, raw: unknown) {
    await propertyRelationships.addRelationshipRole(ownerAgentSubject, clientCaseId, clientCasePropertyId, raw);
    return load(ownerAgentSubject, clientCaseId);
  }

  async function endRelationshipRole(ownerAgentSubject: string, clientCaseId: string, relationshipRoleId: string) {
    await propertyRelationships.endRelationshipRole(ownerAgentSubject, clientCaseId, relationshipRoleId);
    return load(ownerAgentSubject, clientCaseId);
  }

  return { load, save, attachExistingProperty, addRelationshipRole, endRelationshipRole };
}
