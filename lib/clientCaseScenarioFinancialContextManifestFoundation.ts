import { createHash } from 'node:crypto';

import type {
  ClientCaseScenarioFinancialContextEntryDomain,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import { assertEligibleClientCaseGovernedSource, ClientCaseGovernedSourceError } from './clientCaseGovernedSourceFoundation';
import {
  createClientCaseScenarioVersion,
  definitionFromClientCaseScenarioVersion,
} from './clientCaseScenarioFoundation';

export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_FOUNDATION_VERSION = 'CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_FOUNDATION_V1' as const;
export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION = 1 as const;

const DOMAINS = ['ASSET', 'LIABILITY', 'INCOME', 'BORROWING_QUALIFICATION', 'FINANCIAL_CONSTRAINT'] as const satisfies readonly ClientCaseScenarioFinancialContextEntryDomain[];

type RecordValue = Record<string, unknown>;
type Database = Pick<
  PrismaClient,
  | 'clientCase'
  | 'clientFinancialPosition'
  | 'clientFinancialSource'
  | 'clientFinancialAssetObservation'
  | 'clientFinancialLiabilityObservation'
  | 'clientFinancialIncomeObservation'
  | 'clientFinancialQualificationObservation'
  | 'clientFinancialConstraintObservation'
  | 'clientCaseScenario'
  | 'clientCaseScenarioVersion'
  | 'clientCaseScenarioFinancialContextManifest'
  | 'clientCaseScenarioFinancialContextManifestEntry'
  | '$transaction'
>;

type Transaction = Prisma.TransactionClient;

export class ClientCaseScenarioFinancialContextManifestError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT', message: string) {
    super(message);
  }
}

type Selection = Readonly<{
  domain: ClientCaseScenarioFinancialContextEntryDomain;
  entityId: string;
  observationId: string;
}>;

type Entry = Record<string, unknown> & Readonly<{
  domain: ClientCaseScenarioFinancialContextEntryDomain;
  entityId: string;
  observationId: string;
}>;

function record(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum = 160): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function exactKeys(value: RecordValue, keys: readonly string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', 'The request contains unsupported fields.');
}

function selections(value: unknown): Selection[] {
  if (!Array.isArray(value) || value.length > 100) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', 'selectedFacts is invalid.');
  const parsed = value.map((entry) => {
    const input = record(entry, 'selectedFacts');
    exactKeys(input, ['domain', 'entityId', 'observationId']);
    const domain = text(input.domain, 'selectedFacts.domain', 80) as ClientCaseScenarioFinancialContextEntryDomain;
    if (!(DOMAINS as readonly string[]).includes(domain)) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', 'selectedFacts.domain is invalid.');
    return Object.freeze({ domain, entityId: text(input.entityId, 'selectedFacts.entityId'), observationId: text(input.observationId, 'selectedFacts.observationId') });
  });
  const keys = parsed.map((entry) => `${entry.domain}:${entry.observationId}`);
  if (new Set(keys).size !== keys.length) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', 'selectedFacts contains duplicate observations.');
  return parsed;
}

function stable(value: unknown): string {
  if (value === null || value === undefined) return JSON.stringify(value);
  if (typeof value === 'bigint') return JSON.stringify(value.toString());
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function scenarioFinancialContextManifestFingerprint(value: unknown) {
  return createHash('sha256').update(stable(value)).digest('hex');
}

function fingerprintEntry(entry: Entry) {
  const { entityId, observationId, ...stored } = entry;
  return { ...stored, entityId, observationId };
}

function canonicalManifestContent(captureState: 'CAPTURED' | 'NO_FINANCIAL_POSITION' | 'EMPTY_SELECTION', entries: readonly Entry[]) {
  return {
    schemaVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION,
    captureState,
    entries: [...entries]
      .sort((left, right) => `${left.domain}:${left.entityId}:${left.observationId}`.localeCompare(`${right.domain}:${right.entityId}:${right.observationId}`))
      .map(fingerprintEntry),
  };
}

function propertyDisplay(property: { canonicalProperty: { sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null } } | null) {
  if (!property) return null;
  return property.canonicalProperty.sourceFormattedSitusAddress
    ?? property.canonicalProperty.normalizedSitusAddress
    ?? ([property.canonicalProperty.city, property.canonicalProperty.state].filter(Boolean).join(', ') || null);
}

function temporalGuard(observation: { effectiveAt: Date | null; expiresAt?: Date | null }, capturedAt: Date) {
  if (observation.effectiveAt && observation.effectiveAt > capturedAt) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'A selected observation is not effective at capture.');
  if (observation.expiresAt && observation.expiresAt <= capturedAt) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'An expired qualification cannot be selected for current capture.');
}

async function sourceLineage(tx: Transaction, ownerAgentSubject: string, clientCaseId: string, source: { id: string; clientCaseGovernedSourceId: string; clientCaseGovernedSource: { id: string; sourceKind: string } } | null) {
  if (!source) return { financialSourceId: null, clientCaseGovernedSourceId: null, sourceKind: null };
  try {
    await assertEligibleClientCaseGovernedSource(tx as never, ownerAgentSubject, clientCaseId, source.clientCaseGovernedSourceId);
  } catch (error) {
    if (error instanceof ClientCaseGovernedSourceError) throw new ClientCaseScenarioFinancialContextManifestError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'CONFLICT', error.message);
    throw error;
  }
  return {
    financialSourceId: source.id,
    clientCaseGovernedSourceId: source.clientCaseGovernedSourceId,
    sourceKind: source.clientCaseGovernedSource.sourceKind,
  };
}

const SOURCE_INCLUDE = {
  select: {
    id: true,
    clientCaseGovernedSourceId: true,
    clientCaseGovernedSource: { select: { id: true, sourceKind: true } },
  },
} as const;

async function lockCurrentObservation(tx: Transaction, domain: ClientCaseScenarioFinancialContextEntryDomain, clientCaseId: string, observationId: string) {
  const table = {
    ASSET: 'ClientFinancialAssetObservation',
    LIABILITY: 'ClientFinancialLiabilityObservation',
    INCOME: 'ClientFinancialIncomeObservation',
    BORROWING_QUALIFICATION: 'ClientFinancialQualificationObservation',
    FINANCIAL_CONSTRAINT: 'ClientFinancialConstraintObservation',
  }[domain];
  const rows = await tx.$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT "id" FROM "${table}" WHERE "id" = $1 AND "clientCaseId" = $2 AND "supersededAt" IS NULL FOR UPDATE`,
    observationId,
    clientCaseId,
  );
  if (!rows.length) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'The selected observation is no longer current.');
}

async function resolveEntry(tx: Transaction, ownerAgentSubject: string, clientCaseId: string, financialPositionId: string, selection: Selection, capturedAt: Date): Promise<Entry> {
  await lockCurrentObservation(tx, selection.domain, clientCaseId, selection.observationId);
  if (selection.domain === 'ASSET') {
    const observation = await tx.clientFinancialAssetObservation.findFirst({
      where: { id: selection.observationId, clientCaseId, assetId: selection.entityId, supersededAt: null },
      include: { asset: { include: { clientCaseParty: { select: { id: true, displayLabel: true } } } }, financialSource: SOURCE_INCLUDE },
    });
    if (!observation || observation.asset.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The selected Asset observation is unavailable to this Financial Position.');
    temporalGuard(observation, capturedAt);
    const source = await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource);
    return {
      domain: 'ASSET', entityId: observation.asset.id, observationId: observation.id, clientCaseId,
      assetId: observation.asset.id, assetObservationId: observation.id,
      clientCasePartyId: observation.asset.clientCasePartyId, entityLabel: observation.asset.label,
      participantDisplayLabel: observation.asset.clientCaseParty?.displayLabel ?? null,
      ...source, sourcePosture: observation.sourcePosture, verificationState: observation.verificationState, observationKind: observation.observationKind,
      limitation: observation.limitation, currencyCode: observation.currencyCode, asOf: observation.asOf, observedAt: observation.observedAt, effectiveAt: observation.effectiveAt, expiresAt: null, reviewAfter: observation.reviewAfter,
      assetCategory: observation.asset.category, assetMarketValueCents: observation.marketValueCents, assetLiquidValueCents: observation.liquidValueCents, assetAvailableAmountCents: observation.availableAmountCents,
    };
  }
  if (selection.domain === 'LIABILITY') {
    const observation = await tx.clientFinancialLiabilityObservation.findFirst({
      where: { id: selection.observationId, clientCaseId, liabilityId: selection.entityId, supersededAt: null },
      include: { liability: { include: { clientCaseParty: { select: { id: true, displayLabel: true } }, clientCaseProperty: { include: { canonicalProperty: { select: { sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true } } } } } }, financialSource: SOURCE_INCLUDE },
    });
    if (!observation || observation.liability.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The selected Liability observation is unavailable to this Financial Position.');
    temporalGuard(observation, capturedAt);
    const source = await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource);
    return {
      domain: 'LIABILITY', entityId: observation.liability.id, observationId: observation.id, clientCaseId,
      liabilityId: observation.liability.id, liabilityObservationId: observation.id, clientCasePartyId: observation.liability.clientCasePartyId, clientCasePropertyId: observation.liability.clientCasePropertyId,
      entityLabel: observation.liability.label, participantDisplayLabel: observation.liability.clientCaseParty?.displayLabel ?? null, propertyDisplayLabel: propertyDisplay(observation.liability.clientCaseProperty),
      ...source, sourcePosture: observation.sourcePosture, verificationState: observation.verificationState, observationKind: observation.observationKind,
      limitation: observation.limitation, currencyCode: observation.currencyCode, asOf: observation.asOf, observedAt: observation.observedAt, effectiveAt: observation.effectiveAt, expiresAt: null, reviewAfter: observation.reviewAfter,
      liabilityCategory: observation.liability.category, liabilityCurrentBalanceCents: observation.currentBalanceCents, liabilityMonthlyObligationCents: observation.monthlyObligationCents, liabilityRateBps: observation.rateBps,
    };
  }
  if (selection.domain === 'INCOME') {
    const observation = await tx.clientFinancialIncomeObservation.findFirst({
      where: { id: selection.observationId, clientCaseId, incomeSourceId: selection.entityId, supersededAt: null },
      include: { incomeSource: { include: { clientCaseParty: { select: { id: true, displayLabel: true } }, clientCaseProperty: { include: { canonicalProperty: { select: { sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true } } } } } }, financialSource: SOURCE_INCLUDE },
    });
    if (!observation || observation.incomeSource.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The selected Income observation is unavailable to this Financial Position.');
    temporalGuard(observation, capturedAt);
    const source = await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource);
    return {
      domain: 'INCOME', entityId: observation.incomeSource.id, observationId: observation.id, clientCaseId,
      incomeSourceId: observation.incomeSource.id, incomeObservationId: observation.id, clientCasePartyId: observation.incomeSource.clientCasePartyId, clientCasePropertyId: observation.incomeSource.clientCasePropertyId,
      entityLabel: observation.incomeSource.label, participantDisplayLabel: observation.incomeSource.clientCaseParty?.displayLabel ?? null, propertyDisplayLabel: propertyDisplay(observation.incomeSource.clientCaseProperty),
      ...source, sourcePosture: observation.sourcePosture, verificationState: observation.verificationState, observationKind: observation.observationKind,
      limitation: observation.limitation, currencyCode: observation.currencyCode, asOf: observation.asOf, observedAt: observation.observedAt, effectiveAt: observation.effectiveAt, expiresAt: null, reviewAfter: observation.reviewAfter,
      incomeCategory: observation.incomeSource.category, incomeAmountCents: observation.amountCents, incomeFrequency: observation.frequency,
    };
  }
  if (selection.domain === 'BORROWING_QUALIFICATION') {
    const observation = await tx.clientFinancialQualificationObservation.findFirst({
      where: { id: selection.observationId, clientCaseId, qualificationId: selection.entityId, supersededAt: null },
      include: { qualification: true, financialSource: SOURCE_INCLUDE },
    });
    if (!observation || observation.qualification.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The selected Qualification observation is unavailable to this Financial Position.');
    temporalGuard(observation, capturedAt);
    const source = await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource);
    return {
      domain: 'BORROWING_QUALIFICATION', entityId: observation.qualification.id, observationId: observation.id, clientCaseId,
      qualificationId: observation.qualification.id, qualificationObservationId: observation.id, entityLabel: observation.qualification.label,
      ...source, sourcePosture: observation.sourcePosture, verificationState: observation.verificationState, observationKind: observation.observationKind,
      limitation: observation.limitation, currencyCode: observation.currencyCode, asOf: observation.asOf, observedAt: observation.observedAt, effectiveAt: observation.effectiveAt, expiresAt: observation.expiresAt, reviewAfter: observation.reviewAfter,
      qualificationType: observation.qualification.qualificationType, qualificationMaximumLoanAmountCents: observation.maximumLoanAmountCents, qualificationMaximumPurchaseAmountCents: observation.maximumPurchaseAmountCents, qualificationRateBps: observation.rateBps, qualificationProgramLabel: observation.programLabel,
    };
  }
  const observation = await tx.clientFinancialConstraintObservation.findFirst({
    where: { id: selection.observationId, clientCaseId, constraintId: selection.entityId, supersededAt: null },
    include: { constraint: true, financialSource: SOURCE_INCLUDE },
  });
  if (!observation || observation.constraint.financialPositionId !== financialPositionId) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The selected Constraint observation is unavailable to this Financial Position.');
  temporalGuard(observation, capturedAt);
  const source = await sourceLineage(tx, ownerAgentSubject, clientCaseId, observation.financialSource);
  return {
    domain: 'FINANCIAL_CONSTRAINT', entityId: observation.constraint.id, observationId: observation.id, clientCaseId,
    constraintId: observation.constraint.id, constraintObservationId: observation.id, entityLabel: observation.constraint.constraintType,
    ...source, sourcePosture: observation.sourcePosture, verificationState: observation.verificationState, observationKind: observation.observationKind,
    limitation: observation.limitation, currencyCode: observation.currencyCode, asOf: observation.asOf, observedAt: observation.observedAt, effectiveAt: observation.effectiveAt, expiresAt: null, reviewAfter: observation.reviewAfter,
    constraintType: observation.constraint.constraintType, constraintAmountCents: observation.amountCents,
  };
}

function idempotencyKey(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, predecessorVersionId: string, clientMutationKey: string) {
  return `ATLAS_SCENARIO_FINANCIAL_CONTEXT_FREEZE_V1|${ownerAgentSubject}|${clientCaseId}|${scenarioId}|${predecessorVersionId}|${clientMutationKey}`;
}

export function createClientCaseScenarioFinancialContextManifestService(prisma: Database) {
  async function existingResult(ownerAgentSubject: string, clientCaseId: string, key: string, database: Database = prisma) {
    return database.clientCaseScenarioFinancialContextManifest.findFirst({
      where: { idempotencyKey: key, ownerAgentSubject, clientCaseId },
      include: { entries: { orderBy: [{ domain: 'asc' }, { id: 'asc' }] }, scenarioVersion: true },
    });
  }

  return Object.freeze({
    async freezeScenarioForAnalysisWithFinancialContext(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
      const input = record(raw);
      exactKeys(input, ['expectedCurrentVersionId', 'selectedFacts', 'clientMutationKey']);
      const expectedCurrentVersionId = text(input.expectedCurrentVersionId, 'expectedCurrentVersionId');
      const selectedFacts = selections(input.selectedFacts);
      const clientMutationKey = text(input.clientMutationKey, 'clientMutationKey');
      const key = idempotencyKey(ownerAgentSubject, clientCaseId, scenarioId, expectedCurrentVersionId, clientMutationKey);
      const prior = await existingResult(ownerAgentSubject, clientCaseId, key);
      if (prior) return Object.freeze({ manifest: prior, scenarioVersion: prior.scenarioVersion, created: false });

      try {
        return await prisma.$transaction(async (tx) => {
          const alreadyCreated = await existingResult(ownerAgentSubject, clientCaseId, key, tx as never);
          if (alreadyCreated) return Object.freeze({ manifest: alreadyCreated, scenarioVersion: alreadyCreated.scenarioVersion, created: false });
          const scenario = await tx.clientCaseScenario.findFirst({
            where: { id: scenarioId, clientCaseId, status: 'ACTIVE', currentVersionId: expectedCurrentVersionId, clientCase: { ownerAgentSubject } },
            select: { id: true, currentVersionId: true },
          });
          if (!scenario) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'The Scenario is unavailable or stale for financial-context capture.');
          const predecessor = await tx.clientCaseScenarioVersion.findFirst({
            where: { id: expectedCurrentVersionId, scenarioId },
            include: { assumptions: true, criteria: true, propertyDispositions: true, objectiveLinks: true },
          });
          if (!predecessor) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'The Scenario current-version relationship is invalid.');
          const capturedAt = new Date();
          const position = await tx.clientFinancialPosition.findUnique({ where: { clientCaseId }, select: { id: true } });
          if (!position && selectedFacts.length) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'Selected financial facts require a Client Financial Position.');
          const captureState = !position ? 'NO_FINANCIAL_POSITION' : selectedFacts.length ? 'CAPTURED' : 'EMPTY_SELECTION';
          const entries = position
            ? await Promise.all(selectedFacts.map((selection) => resolveEntry(tx, ownerAgentSubject, clientCaseId, position.id, selection, capturedAt)))
            : [];
          const content = canonicalManifestContent(captureState, entries);
          const fingerprint = scenarioFinancialContextManifestFingerprint(content);
          const successor = await createClientCaseScenarioVersion(tx, scenario.id, predecessor.versionNumber + 1, ownerAgentSubject, definitionFromClientCaseScenarioVersion(predecessor));
          const advanced = await tx.clientCaseScenario.updateMany({
            where: { id: scenario.id, currentVersionId: expectedCurrentVersionId, status: 'ACTIVE' },
            data: { currentVersionId: successor.id },
          });
          if (advanced.count !== 1) throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'The Scenario changed during financial-context capture.');
          const manifest = await tx.clientCaseScenarioFinancialContextManifest.create({
            data: {
              scenarioVersionId: successor.id, clientCaseId, ownerAgentSubject, captureState,
              manifestSchemaVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION,
              fingerprint, idempotencyKey: key, capturedAt, capturedBySubject: ownerAgentSubject,
              entries: entries.length ? {
                create: entries.map((entry) => {
                  const { entityId, observationId, ...persistedEntry } = entry;
                  void entityId;
                  void observationId;
                  return persistedEntry as unknown as Prisma.ClientCaseScenarioFinancialContextManifestEntryCreateWithoutManifestInput;
                }),
              } : undefined,
            },
            include: { entries: { orderBy: [{ domain: 'asc' }, { id: 'asc' }] } },
          });
          return Object.freeze({ manifest, scenarioVersion: successor, created: true });
        });
      } catch (error) {
        if ((error as { code?: string }).code === 'P2002') throw new ClientCaseScenarioFinancialContextManifestError('CONFLICT', 'A concurrent financial-context capture already created a successor.');
        throw error;
      }
    },

    async readScenarioFinancialContextManifest(ownerAgentSubject: string, clientCaseId: string, scenarioVersionId: string) {
      const version = await prisma.clientCaseScenarioVersion.findFirst({
        where: { id: scenarioVersionId, scenario: { clientCaseId, clientCase: { ownerAgentSubject } } },
        select: { id: true, scenarioId: true, versionNumber: true },
      });
      if (!version) throw new ClientCaseScenarioFinancialContextManifestError('NOT_FOUND', 'The Scenario Version is unavailable to this Agent.');
      const manifest = await prisma.clientCaseScenarioFinancialContextManifest.findFirst({
        where: { scenarioVersionId, clientCaseId, ownerAgentSubject },
        include: { entries: { orderBy: [{ domain: 'asc' }, { id: 'asc' }] } },
      });
      return Object.freeze({ scenarioVersion: version, financialContext: manifest ?? null, legacyState: manifest ? null : 'LEGACY_NO_FINANCIAL_CONTEXT' as const });
    },

    async listObservationManifestLineage(ownerAgentSubject: string, clientCaseId: string, raw: unknown) {
      const input = record(raw);
      exactKeys(input, ['domain', 'observationId']);
      const domain = text(input.domain, 'domain', 80) as ClientCaseScenarioFinancialContextEntryDomain;
      if (!(DOMAINS as readonly string[]).includes(domain)) throw new ClientCaseScenarioFinancialContextManifestError('INVALID_REQUEST', 'domain is invalid.');
      const observationId = text(input.observationId, 'observationId');
      const field = {
        ASSET: 'assetObservationId',
        LIABILITY: 'liabilityObservationId',
        INCOME: 'incomeObservationId',
        BORROWING_QUALIFICATION: 'qualificationObservationId',
        FINANCIAL_CONSTRAINT: 'constraintObservationId',
      }[domain];
      return prisma.clientCaseScenarioFinancialContextManifestEntry.findMany({
        where: { clientCaseId, domain, [field]: observationId, manifest: { ownerAgentSubject, clientCaseId } } as never,
        select: { id: true, domain: true, manifest: { select: { id: true, scenarioVersionId: true, captureState: true, fingerprint: true, capturedAt: true } } },
        orderBy: { createdAt: 'asc' },
      });
    },
  });
}
