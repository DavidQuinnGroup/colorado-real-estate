import { Prisma, type ClientCaseScenarioFinancialContextEntryDomain, type PrismaClient } from '@prisma/client';

import {
  ClientCaseScenarioFinancialContextDraftError,
  createClientCaseScenarioFinancialContextDraftService,
} from './clientCaseScenarioFinancialContextDraftFoundation';
import {
  ClientCaseScenarioFinancialContextManifestError,
  createClientCaseScenarioFinancialContextManifestService,
  freezeScenarioForAnalysisWithFinancialContextInTransaction,
  scenarioFinancialContextManifestIdempotencyKey,
  type ClientCaseScenarioFinancialContextFreezeSelection,
} from './clientCaseScenarioFinancialContextManifestFoundation';
import { createClientFinancialPositionPresentationService } from './clientFinancialPositionPresentation';

export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION = 'CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_V1' as const;
export const CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE = 'RETAIN_UNCHANGED_AS_CONTINUING_SCENARIO_LEVEL_WORKING_INTENT' as const;

const DOMAIN_MAP = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  INCOME: 'INCOME',
  QUALIFICATION: 'BORROWING_QUALIFICATION',
  CONSTRAINT: 'FINANCIAL_CONSTRAINT',
} as const;

type RecordValue = Record<string, unknown>;
type DraftSelection = RecordValue & { id: string; domain: ClientCaseScenarioFinancialContextEntryDomain };
type CurrentFact = ReturnType<typeof shapeCurrentFact>;

export class ClientCaseScenarioFinancialContextTransportError extends Error {
  constructor(
    readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'CONFLICT' | 'REVIEW_REQUIRED' | 'NO_FINANCIAL_POSITION' | 'LEGACY_NO_FINANCIAL_CONTEXT',
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

function record(value: unknown, field = 'request'): RecordValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', `${field} must be an object.`);
  return value as RecordValue;
}

function text(value: unknown, field: string, maximum = 160): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function exactKeys(value: RecordValue, keys: readonly string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'The request contains unsupported fields.');
}

function expectedDraftRevision(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'expectedDraftRevision is invalid.');
  return value;
}

function date(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function cents(value: bigint | number | null | undefined) {
  return typeof value === 'bigint' ? Number(value) : value ?? null;
}

function selectionEntityId(selection: DraftSelection) {
  const field = {
    ASSET: 'assetId',
    LIABILITY: 'liabilityId',
    INCOME: 'incomeSourceId',
    BORROWING_QUALIFICATION: 'qualificationId',
    FINANCIAL_CONSTRAINT: 'constraintId',
  }[selection.domain];
  return String(selection[field]);
}

function selectionObservationId(selection: DraftSelection) {
  const field = {
    ASSET: 'assetObservationId',
    LIABILITY: 'liabilityObservationId',
    INCOME: 'incomeObservationId',
    BORROWING_QUALIFICATION: 'qualificationObservationId',
    FINANCIAL_CONSTRAINT: 'constraintObservationId',
  }[selection.domain];
  return String(selection[field]);
}

function draftSelectionSnapshot(selection: DraftSelection) {
  return {
    id: selection.id,
    domain: selection.domain,
    entityId: selectionEntityId(selection),
    observationId: selectionObservationId(selection),
    reviewedAt: date(selection.reviewedAt as Date | null),
    mutationKind: selection.mutationKind,
  };
}

function selectionKey(domain: string, entityId: string) {
  return `${domain}:${entityId}`;
}

function shapeCurrentFact(raw: RecordValue, participants: Map<string, RecordValue>, properties: Map<string, RecordValue>) {
  const current = raw.current as RecordValue | null;
  const domain = DOMAIN_MAP[raw.domain as keyof typeof DOMAIN_MAP];
  const participantId = typeof raw.clientCasePartyId === 'string' ? raw.clientCasePartyId : null;
  const propertyId = typeof raw.clientCasePropertyId === 'string' ? raw.clientCasePropertyId : null;
  return {
    domain,
    entityId: String(raw.id),
    label: String(raw.label),
    category: String(raw.category),
    participant: participantId ? participants.get(participantId) ?? { id: participantId, label: 'Participant unavailable' } : null,
    property: propertyId ? properties.get(propertyId) ?? { id: propertyId, label: 'Property unavailable' } : null,
    currentObservation: current ? {
      id: String(current.id),
      value: {
        category: raw.category ?? null,
        marketValueCents: current.marketValueCents ?? null,
        liquidValueCents: current.liquidValueCents ?? null,
        availableAmountCents: current.availableAmountCents ?? null,
        currentBalanceCents: current.currentBalanceCents ?? null,
        monthlyObligationCents: current.monthlyObligationCents ?? null,
        amountCents: current.amountCents ?? null,
        maximumLoanAmountCents: current.maximumLoanAmountCents ?? null,
        maximumPurchaseAmountCents: current.maximumPurchaseAmountCents ?? null,
        rateBps: current.rateBps ?? null,
        frequency: current.frequency ?? null,
        programLabel: current.programLabel ?? null,
      },
      sourcePosture: current.sourcePosture,
      verificationState: current.verificationState,
      observationKind: current.observationKind,
      financialSourceId: current.financialSourceId ?? null,
      source: current.source ?? null,
      asOf: current.asOf,
      observedAt: current.observedAt,
      effectiveAt: current.effectiveAt,
      expiresAt: current.expiresAt,
      reviewAfter: current.reviewAfter,
      freshness: current.freshness,
    } : null,
  };
}

function overlaySelections(facts: CurrentFact[], selections: DraftSelection[]) {
  const byKey = new Map(facts.map((fact) => [selectionKey(fact.domain, fact.entityId), fact]));
  const selected = new Map(selections.map((selection) => [selectionKey(selection.domain, selectionEntityId(selection)), selection]));
  const shaped = facts.map((fact) => {
    const selection = selected.get(selectionKey(fact.domain, fact.entityId));
    const selectedObservationId = selection ? selectionObservationId(selection) : null;
    const currentObservationId = fact.currentObservation?.id ?? null;
    const reviewState = !selection
      ? 'UNSELECTED'
      : !currentObservationId
        ? 'SELECTED_NO_LONGER_AVAILABLE'
        : currentObservationId === selectedObservationId
          ? fact.currentObservation?.freshness === 'CURRENT'
            ? 'SELECTED_CURRENT'
            : 'SELECTED_TIME_REVIEW_REQUIRED'
          : 'SELECTED_CURRENT_OBSERVATION_CHANGED';
    return {
      ...fact,
      selected: Boolean(selection),
      selectedObservationId,
      selectedAt: selection ? date(selection.selectedAt as Date) : null,
      reviewedAt: selection ? date(selection.reviewedAt as Date | null) : null,
      reviewState,
      reviewRequired: reviewState === 'SELECTED_NO_LONGER_AVAILABLE' || reviewState === 'SELECTED_CURRENT_OBSERVATION_CHANGED' || reviewState === 'SELECTED_TIME_REVIEW_REQUIRED',
    };
  });
  selections.forEach((selection) => {
    const entityId = selectionEntityId(selection);
    if (byKey.has(selectionKey(selection.domain, entityId))) return;
    shaped.push({
      domain: selection.domain,
      entityId,
      label: 'Selected financial fact is no longer current',
      category: 'UNAVAILABLE',
      participant: null,
      property: null,
      currentObservation: null,
      selected: true,
      selectedObservationId: selectionObservationId(selection),
      selectedAt: date(selection.selectedAt as Date),
      reviewedAt: date(selection.reviewedAt as Date | null),
      reviewState: 'SELECTED_NO_LONGER_AVAILABLE',
      reviewRequired: true,
    });
  });
  return shaped;
}

function entryEntityId(entry: RecordValue) {
  return String(entry.assetId ?? entry.liabilityId ?? entry.incomeSourceId ?? entry.qualificationId ?? entry.constraintId);
}

function entryObservationId(entry: RecordValue) {
  return String(entry.assetObservationId ?? entry.liabilityObservationId ?? entry.incomeObservationId ?? entry.qualificationObservationId ?? entry.constraintObservationId);
}

function shapeManifestEntry(entry: RecordValue) {
  return {
    domain: entry.domain,
    entityId: entryEntityId(entry),
    observationId: entryObservationId(entry),
    label: entry.entityLabel ?? null,
    participantLabel: entry.participantDisplayLabel ?? null,
    propertyLabel: entry.propertyDisplayLabel ?? null,
    source: {
      financialSourceId: entry.financialSourceId ?? null,
      governedSourceId: entry.clientCaseGovernedSourceId ?? null,
      kind: entry.sourceKind ?? null,
      posture: entry.sourcePosture,
      verificationState: entry.verificationState,
    },
    observationKind: entry.observationKind,
    limitation: entry.limitation ?? null,
    currencyCode: entry.currencyCode,
    asOf: date(entry.asOf as Date),
    observedAt: date(entry.observedAt as Date | null),
    effectiveAt: date(entry.effectiveAt as Date | null),
    expiresAt: date(entry.expiresAt as Date | null),
    reviewAfter: date(entry.reviewAfter as Date | null),
    value: {
      category: entry.assetCategory ?? entry.liabilityCategory ?? entry.incomeCategory ?? entry.qualificationType ?? entry.constraintType ?? null,
      marketValueCents: cents(entry.assetMarketValueCents as bigint | null),
      liquidValueCents: cents(entry.assetLiquidValueCents as bigint | null),
      availableAmountCents: cents(entry.assetAvailableAmountCents as bigint | null),
      currentBalanceCents: cents(entry.liabilityCurrentBalanceCents as bigint | null),
      monthlyObligationCents: cents(entry.liabilityMonthlyObligationCents as bigint | null),
      amountCents: cents((entry.incomeAmountCents ?? entry.constraintAmountCents) as bigint | null),
      maximumLoanAmountCents: cents(entry.qualificationMaximumLoanAmountCents as bigint | null),
      maximumPurchaseAmountCents: cents(entry.qualificationMaximumPurchaseAmountCents as bigint | null),
      rateBps: entry.liabilityRateBps ?? entry.qualificationRateBps ?? null,
      frequency: entry.incomeFrequency ?? null,
      programLabel: entry.qualificationProgramLabel ?? null,
    },
  };
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value as RecordValue).sort().map((key) => `${JSON.stringify(key)}:${stable((value as RecordValue)[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function classifyScenarioFinancialContextDifference(fixed: ReturnType<typeof shapeManifestEntry>, current: CurrentFact | null, checkedAt: Date) {
  if (!current?.currentObservation) return 'NO_LONGER_CURRENT' as const;
  const currentObservation = current.currentObservation;
  if (currentObservation.id === fixed.observationId) {
    const timeReviewChanged = (fixed.expiresAt !== null && new Date(fixed.expiresAt).getTime() <= checkedAt.getTime())
      || (fixed.reviewAfter !== null && new Date(fixed.reviewAfter).getTime() <= checkedAt.getTime());
    return timeReviewChanged ? 'TIME_REVIEW_CHANGED' as const : 'UNCHANGED' as const;
  }
  if (currentObservation.observationKind === 'CORRECTION') return 'LATER_CORRECTION' as const;
  const fixedSourceId = fixed.source.financialSourceId;
  const currentSourceId = currentObservation.financialSourceId;
  if (fixedSourceId !== currentSourceId) return 'SOURCE_CHANGED' as const;
  return stable(fixed.value) === stable(currentObservation.value) ? 'UNCHANGED' as const : 'CHANGED' as const;
}

function mapFoundationError(error: unknown): never {
  if (error instanceof ClientCaseScenarioFinancialContextDraftError || error instanceof ClientCaseScenarioFinancialContextManifestError) {
    throw new ClientCaseScenarioFinancialContextTransportError(error.code, error.message);
  }
  throw error;
}

export function createClientCaseScenarioFinancialContextTransportService(prisma: PrismaClient) {
  const drafts = createClientCaseScenarioFinancialContextDraftService(prisma);
  const manifests = createClientCaseScenarioFinancialContextManifestService(prisma);

  async function scenario(ownerAgentSubject: string, clientCaseId: string, scenarioId: string) {
    const value = await prisma.clientCaseScenario.findFirst({
      where: { id: scenarioId, clientCaseId, clientCase: { ownerAgentSubject } },
      select: {
        id: true, name: true, description: true, status: true, currentVersionId: true,
        currentVersion: { select: { id: true, versionNumber: true, assumptions: { select: { semanticKey: true, valueType: true, value: true }, orderBy: { semanticKey: 'asc' } } } },
      },
    });
    if (!value) throw new ClientCaseScenarioFinancialContextTransportError('NOT_FOUND', 'The Scenario is unavailable to this Agent.');
    return value;
  }

  async function readWorkingContext(ownerAgentSubject: string, clientCaseId: string, scenarioId: string) {
    const [scenarioValue, workspace, draftResult] = await Promise.all([
      scenario(ownerAgentSubject, clientCaseId, scenarioId),
      createClientFinancialPositionPresentationService(prisma).load(ownerAgentSubject, clientCaseId),
      drafts.readDraft(ownerAgentSubject, clientCaseId, scenarioId),
    ]).catch(mapFoundationError);
    if (!workspace) throw new ClientCaseScenarioFinancialContextTransportError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    const participants = new Map(workspace.clientCase.participants.map((participant) => [participant.id, { id: participant.id, label: participant.displayLabel, role: participant.role }]));
    const properties = new Map(workspace.clientCase.properties.map((property) => [property.id, property]));
    const facts = workspace.position?.domains
      .filter((domain) => domain.current)
      .map((domain) => shapeCurrentFact(domain as unknown as RecordValue, participants, properties)) ?? [];
    const draft = draftResult.draft;
    const selections = (draft?.selections ?? []) as unknown as DraftSelection[];
    const contextualFacts = overlaySelections(facts, selections);
    return Object.freeze({
      contractVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION,
      lifecycle: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE,
      state: !workspace.position ? 'NO_FINANCIAL_POSITION' as const : selections.length ? 'WORKING_CONTEXT' as const : 'EMPTY_SELECTION' as const,
      clientCase: { id: workspace.clientCase.id, displayName: workspace.clientCase.displayName },
      scenario: scenarioValue,
      draft: draft ? { id: draft.id, revision: draft.revision, selectionCount: selections.length } : null,
      facts: contextualFacts,
      reviewRequiredCount: contextualFacts.filter((fact) => fact.reviewRequired).length,
    });
  }

  async function mutateDraft(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, action: string, raw: unknown) {
    try {
      if (action === 'SELECT') await drafts.selectFinancialContext(ownerAgentSubject, clientCaseId, scenarioId, raw);
      else if (action === 'DESELECT') await drafts.deselectFinancialContext(ownerAgentSubject, clientCaseId, scenarioId, raw);
      else if (action === 'REVIEW') await drafts.reviewFinancialContextSelection(ownerAgentSubject, clientCaseId, scenarioId, raw);
      else if (action === 'CLEAR_ALL') await drafts.clearDraftSelections(ownerAgentSubject, clientCaseId, scenarioId, raw);
      else throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'Unsupported Scenario Financial Context draft action.');
      return readWorkingContext(ownerAgentSubject, clientCaseId, scenarioId);
    } catch (error) {
      mapFoundationError(error);
    }
  }

  async function reviewCreateAnalysisVersion(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
    const input = record(raw);
    exactKeys(input, ['expectedDraftRevision', 'expectedCurrentVersionId']);
    const revision = expectedDraftRevision(input.expectedDraftRevision);
    const versionId = text(input.expectedCurrentVersionId, 'expectedCurrentVersionId');
    const working = await readWorkingContext(ownerAgentSubject, clientCaseId, scenarioId);
    if (working.scenario.status !== 'ACTIVE' || working.scenario.currentVersionId !== versionId) throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'The Scenario current version is stale.');
    if ((working.draft?.revision ?? null) !== revision) throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'The Scenario Financial Context draft revision is stale.');
    return Object.freeze({
      ...working,
      freezeReview: {
        expectedCurrentVersionId: versionId,
        expectedDraftRevision: revision,
        captureState: working.state === 'NO_FINANCIAL_POSITION' ? 'NO_FINANCIAL_POSITION' : working.draft?.selectionCount ? 'CAPTURED' : 'EMPTY_SELECTION',
        canFreeze: working.reviewRequiredCount === 0,
        reviewRequiredCount: working.reviewRequiredCount,
        assumptions: working.scenario.currentVersion?.assumptions ?? [],
      },
    });
  }

  async function createAnalysisVersion(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, raw: unknown) {
    const input = record(raw);
    exactKeys(input, ['expectedDraftRevision', 'expectedCurrentVersionId', 'clientMutationKey']);
    const revision = expectedDraftRevision(input.expectedDraftRevision);
    const expectedCurrentVersionId = text(input.expectedCurrentVersionId, 'expectedCurrentVersionId');
    const clientMutationKey = text(input.clientMutationKey, 'clientMutationKey');
    const existingKey = scenarioFinancialContextManifestIdempotencyKey(ownerAgentSubject, clientCaseId, scenarioId, expectedCurrentVersionId, clientMutationKey);
    const existing = await prisma.clientCaseScenarioFinancialContextManifest.findFirst({
      where: { idempotencyKey: existingKey, clientCaseId, ownerAgentSubject, scenarioVersion: { scenarioId } },
      include: { entries: { select: { id: true } }, scenarioVersion: { select: { id: true, versionNumber: true } } },
    });
    if (existing) {
      const retained = await drafts.readDraft(ownerAgentSubject, clientCaseId, scenarioId).catch(mapFoundationError);
      const retainedSelections = (retained.draft?.selections ?? []).map((selection) => draftSelectionSnapshot(selection as unknown as DraftSelection));
      return Object.freeze({
        created: false,
        scenarioVersion: existing.scenarioVersion,
        manifest: { id: existing.id, captureState: existing.captureState, fingerprint: existing.fingerprint, capturedAt: date(existing.capturedAt), entryCount: existing.entries.length },
        draftRetention: {
          lifecycle: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE,
          before: { id: retained.draft?.id ?? null, revision: retained.draft?.revision ?? null, selections: retainedSelections },
          after: { id: retained.draft?.id ?? null, revision: retained.draft?.revision ?? null, selections: retainedSelections },
          unchanged: true,
        },
      });
    }
    const review = await reviewCreateAnalysisVersion(ownerAgentSubject, clientCaseId, scenarioId, { expectedDraftRevision: revision, expectedCurrentVersionId });
    if (!review.freezeReview.canFreeze) throw new ClientCaseScenarioFinancialContextTransportError('REVIEW_REQUIRED', 'Selected financial facts changed after their last review.', { reviewRequiredCount: review.reviewRequiredCount });

    try {
      const frozen = await prisma.$transaction(async (tx) => {
        const scenarioValue = await tx.clientCaseScenario.findFirst({
          where: { id: scenarioId, clientCaseId, status: 'ACTIVE', currentVersionId: expectedCurrentVersionId, clientCase: { ownerAgentSubject } },
          select: { id: true },
        });
        if (!scenarioValue) throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'The Scenario current version is stale.');
        const locked = await tx.$queryRawUnsafe<Array<{ id: string; revision: number }>>(
          'SELECT "id", "revision" FROM "ClientCaseScenarioFinancialContextDraft" WHERE "clientCaseId" = $1 AND "scenarioId" = $2 AND "ownerAgentSubject" = $3 FOR UPDATE',
          clientCaseId,
          scenarioId,
          ownerAgentSubject,
        );
        const lockedDraft = locked[0] ?? null;
        if ((lockedDraft?.revision ?? null) !== revision) throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'The Scenario Financial Context draft revision is stale.');
        const draft = lockedDraft ? await tx.clientCaseScenarioFinancialContextDraft.findUnique({
          where: { id: lockedDraft.id },
          include: { selections: { orderBy: [{ domain: 'asc' }, { selectedAt: 'asc' }, { id: 'asc' }] } },
        }) : null;
        const beforeSelections = (draft?.selections ?? []).map((selection) => draftSelectionSnapshot(selection as unknown as DraftSelection));
        const selectedFacts: ClientCaseScenarioFinancialContextFreezeSelection[] = (draft?.selections ?? []).map((selection) => ({
          domain: selection.domain,
          entityId: selectionEntityId(selection as unknown as DraftSelection),
          observationId: selectionObservationId(selection as unknown as DraftSelection),
        }));
        const result = await freezeScenarioForAnalysisWithFinancialContextInTransaction(tx, ownerAgentSubject, clientCaseId, scenarioId, {
          expectedCurrentVersionId,
          selectedFacts,
          clientMutationKey,
        });
        const after = lockedDraft ? await tx.clientCaseScenarioFinancialContextDraft.findUnique({
          where: { id: lockedDraft.id },
          include: { selections: { orderBy: [{ domain: 'asc' }, { selectedAt: 'asc' }, { id: 'asc' }] } },
        }) : null;
        const afterSelections = (after?.selections ?? []).map((selection) => draftSelectionSnapshot(selection as unknown as DraftSelection));
        if ((after?.id ?? null) !== (draft?.id ?? null) || (after?.revision ?? null) !== (draft?.revision ?? null) || stable(afterSelections) !== stable(beforeSelections)) {
          throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'Freeze changed continuing Scenario-level working intent.');
        }
        return {
          ...result,
          draftRetention: {
            lifecycle: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE,
            before: { id: draft?.id ?? null, revision: draft?.revision ?? null, selections: beforeSelections },
            after: { id: after?.id ?? null, revision: after?.revision ?? null, selections: afterSelections },
            unchanged: true,
          },
        };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return Object.freeze({
        created: frozen.created,
        scenarioVersion: { id: frozen.scenarioVersion.id, versionNumber: frozen.scenarioVersion.versionNumber },
        manifest: { id: frozen.manifest.id, captureState: frozen.manifest.captureState, fingerprint: frozen.manifest.fingerprint, capturedAt: date(frozen.manifest.capturedAt), entryCount: frozen.manifest.entries.length },
        draftRetention: frozen.draftRetention,
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002' || (error as { code?: string }).code === 'P2034') throw new ClientCaseScenarioFinancialContextTransportError('CONFLICT', 'A concurrent Scenario Financial Context change must be reviewed.');
      mapFoundationError(error);
    }
  }

  async function readFixedContext(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, scenarioVersionId: string) {
    const version = await prisma.clientCaseScenarioVersion.findFirst({
      where: { id: scenarioVersionId, scenarioId, scenario: { clientCaseId, clientCase: { ownerAgentSubject } } },
      select: { id: true, scenarioId: true, versionNumber: true },
    });
    if (!version) throw new ClientCaseScenarioFinancialContextTransportError('NOT_FOUND', 'The Scenario Version is unavailable to this Agent.');
    const adjacentVersions = await prisma.clientCaseScenarioVersion.findMany({
      where: { scenarioId, versionNumber: { in: [version.versionNumber - 1, version.versionNumber + 1] } },
      select: { id: true, versionNumber: true },
      orderBy: { versionNumber: 'asc' },
    });
    const versionContext = {
      predecessor: adjacentVersions.find((candidate) => candidate.versionNumber === version.versionNumber - 1) ?? null,
      fixed: { id: version.id, versionNumber: version.versionNumber },
      successor: adjacentVersions.find((candidate) => candidate.versionNumber === version.versionNumber + 1) ?? null,
    };
    try {
      const result = await manifests.readScenarioFinancialContextManifest(ownerAgentSubject, clientCaseId, scenarioVersionId);
      if (!result.financialContext) return Object.freeze({ contractVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION, state: 'LEGACY_NO_FINANCIAL_CONTEXT' as const, scenarioVersion: versionContext.fixed, versionContext, manifest: null, entries: [] });
      return Object.freeze({
        contractVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION,
        state: result.financialContext.captureState,
        scenarioVersion: versionContext.fixed,
        versionContext,
        manifest: {
          id: result.financialContext.id,
          fingerprint: result.financialContext.fingerprint,
          capturedAt: date(result.financialContext.capturedAt),
          schemaVersion: result.financialContext.manifestSchemaVersion,
        },
        entries: result.financialContext.entries.map((entry) => shapeManifestEntry(entry as unknown as RecordValue)),
      });
    } catch (error) {
      mapFoundationError(error);
    }
  }

  async function compareToCurrent(ownerAgentSubject: string, clientCaseId: string, scenarioId: string, scenarioVersionId: string) {
    const [fixed, working] = await Promise.all([
      readFixedContext(ownerAgentSubject, clientCaseId, scenarioId, scenarioVersionId),
      readWorkingContext(ownerAgentSubject, clientCaseId, scenarioId),
    ]);
    if (fixed.state === 'LEGACY_NO_FINANCIAL_CONTEXT') return Object.freeze({ state: fixed.state, checkedAt: new Date().toISOString(), differences: [] });
    const checkedAt = new Date();
    const currentByKey = new Map(working.facts.map((fact) => [selectionKey(fact.domain, fact.entityId), fact]));
    const fixedKeys = new Set(fixed.entries.map((entry) => selectionKey(String(entry.domain), entry.entityId)));
    const differences: Array<{
      domain: string;
      entityId: string;
      fixedObservationId: string | null;
      currentObservationId: string | null;
      classification: 'UNCHANGED' | 'CHANGED' | 'LATER_CORRECTION' | 'SOURCE_CHANGED' | 'NO_LONGER_CURRENT' | 'TIME_REVIEW_CHANGED' | 'CURRENT_FACT_NOT_PART_OF_VERSION';
    }> = fixed.entries.map((entry) => {
      const current = currentByKey.get(selectionKey(String(entry.domain), entry.entityId)) ?? null;
      return { domain: String(entry.domain), entityId: entry.entityId, fixedObservationId: entry.observationId, currentObservationId: current?.currentObservation?.id ?? null, classification: classifyScenarioFinancialContextDifference(entry, current, checkedAt) };
    });
    working.facts.forEach((fact) => {
      if (!fact.currentObservation || fixedKeys.has(selectionKey(fact.domain, fact.entityId))) return;
      differences.push({ domain: fact.domain, entityId: fact.entityId, fixedObservationId: null, currentObservationId: fact.currentObservation.id, classification: 'CURRENT_FACT_NOT_PART_OF_VERSION' });
    });
    return Object.freeze({ state: 'COMPARISON_AVAILABLE' as const, checkedAt: checkedAt.toISOString(), scenarioVersion: fixed.scenarioVersion, differences });
  }

  return Object.freeze({ readWorkingContext, mutateDraft, reviewCreateAnalysisVersion, createAnalysisVersion, readFixedContext, compareToCurrent });
}
