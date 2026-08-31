import { createHash } from 'node:crypto';

import { Prisma, type PrismaClient } from '@prisma/client';

import { createOutputPersistenceService, type PersistableOutputFixture } from './outputPersistenceFoundation';

export const BUYER_UNDER_CONTRACT_FOUNDATION_VERSION = 'BUYER_UNDER_CONTRACT_FOUNDATION_V1' as const;
export const DQG_TRANSACTION_ARCHIVE_POLICY_VERSION = 'DQG_TRANSACTION_ARCHIVE_POLICY_V1' as const;
export const BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION = 'BUYER_UNDER_CONTRACT_DECISION_BRIEF_V1' as const;

export const LOW_RISK_TRANSACTION_DECISION_PROFILES = [
  'REQUEST_ADDITIONAL_INFORMATION',
  'REQUEST_PROFESSIONAL_ESTIMATE',
  'REQUEST_INSPECTION_OR_QUOTE',
  'PREFERRED_SCHEDULING_OPTION',
  'PREFERRED_PROVIDER_SELECTION',
  'NON_BINDING_PRIORITY',
  'ACKNOWLEDGED_AGENT_REVIEWED_INFORMATION',
] as const;

export const PROHIBITED_TRANSACTION_DECISION_PROFILES = [
  'NOTICE_TO_TERMINATE',
  'CONTRACT_AMENDMENT',
  'BINDING_DIRECTION',
  'LEGAL_INTERPRETATION',
  'WAIVER',
] as const;

const transactionStages = ['UNDER_CONTRACT', 'INSPECTION_PERIOD', 'TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'CLOSED', 'CANCELLED_REPORTED', 'OTHER_REVIEW_REQUIRED'] as const;
const deadlineCategories = ['INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'HOA', 'INSURANCE', 'CLOSING', 'POSSESSION', 'CONTRACTUAL_OTHER', 'BROKERAGE_OPERATIONAL', 'OTHER'] as const;
const deadlineSourceClasses = ['AGENT_RECORDED_SYNTHETIC_CONTRACT_FACT', 'AGENT_RECORDED_MANUAL_FACT', 'AGENT_REPORTED_AMENDMENT', 'AGENT_CORRECTION', 'SOURCE_CONFLICT', 'OTHER_REVIEW_REQUIRED'] as const;
const deadlineVerifications = ['RECORDED', 'AGENT_VERIFIED', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN'] as const;
const issueCategories = ['INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'INSURANCE', 'HOA_DOCUMENTS', 'PROPERTY_CONDITION', 'PROFESSIONAL_INPUT_DEPENDENCY', 'DEADLINE_DEPENDENCY', 'UNRESOLVED_FACTUAL_QUESTION', 'OTHER'] as const;
const issueAttentionLevels = ['INFORMATIONAL', 'FOLLOW_UP', 'MATERIAL_REVIEW', 'URGENT_AGENT_ATTENTION', 'REVIEW_REQUIRED'] as const;
const issueStates = ['OPEN', 'IN_REVIEW', 'AWAITING_PROFESSIONAL_INPUT', 'AWAITING_CLIENT_INPUT', 'RESOLVED_REPORTED', 'SUPERSEDED', 'CLOSED_INFORMATIONAL'] as const;
const decisionSourceMethods = ['AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT', 'AGENT_RECORDED_MEETING', 'AGENT_RECORDED_OTHER', 'SYSTEM_RECORDED_AGENT_ACTION'] as const;

export class BuyerUnderContractError extends Error {
  constructor(
    readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'PROHIBITED_DECISION' | 'PERSISTENCE_UNAVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

export function transactionArchivePolicy() {
  return Object.freeze({
    version: DQG_TRANSACTION_ARCHIVE_POLICY_VERSION,
    archiveOwner: 'DAVID_QUINN_GROUP',
    coverage: 'ALL_TRANSACTION_DOCUMENTS',
    retention: 'INDEFINITE',
    relationshipToBrokerageFile: 'ADDITIVE_NOT_REPLACEMENT',
    secureDocumentSystemRequired: true,
    storageActive: false,
    destructiveDeletionAuthorized: false,
    documentWorkflowActive: false,
  });
}

export function isLowRiskTransactionDecisionProfile(value: unknown): value is (typeof LOW_RISK_TRANSACTION_DECISION_PROFILES)[number] {
  return typeof value === 'string' && LOW_RISK_TRANSACTION_DECISION_PROFILES.includes(value as (typeof LOW_RISK_TRANSACTION_DECISION_PROFILES)[number]);
}

export function assertLowRiskTransactionDecisionProfile(value: unknown) {
  if (PROHIBITED_TRANSACTION_DECISION_PROFILES.includes(value as never) || !isLowRiskTransactionDecisionProfile(value)) {
    throw new BuyerUnderContractError('PROHIBITED_DECISION', 'Only the explicit low-risk transaction decision profiles are recordable.');
  }
  return value;
}

function record(value: unknown, field = 'request') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BuyerUnderContractError('INVALID_REQUEST', `${field} must be an object.`);
  return value as Record<string, unknown>;
}

function string(value: unknown, field: string, max = 500, required = true) {
  if (value === undefined || value === null) {
    if (!required) return null;
    throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function optionalString(value: unknown, field: string, max = 500) {
  return value === undefined || value === null || value === '' ? null : string(value, field, max);
}

function enumValue<T extends readonly string[]>(value: unknown, values: T, field: string): T[number] {
  if (typeof value !== 'string' || !values.includes(value)) throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is invalid.`);
  return value as T[number];
}

function isoDate(value: unknown, field: string, required = true) {
  if (value === undefined || value === null || value === '') {
    if (!required) return null;
    throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is required.`);
  }
  if (typeof value !== 'string') throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is invalid.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new BuyerUnderContractError('INVALID_REQUEST', `${field} is invalid.`);
  return parsed;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (!value || typeof value !== 'object') return JSON.stringify(value);
  return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, nested]) => `${JSON.stringify(key)}:${stableJson(nested)}`).join(',')}}`;
}

function fingerprint(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

function assertTimeZone(value: unknown) {
  const timezone = string(value, 'timezone', 100)!;
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone });
  } catch {
    throw new BuyerUnderContractError('INVALID_REQUEST', 'timezone is invalid.');
  }
  return timezone;
}

async function ownedTransaction(prisma: PrismaClient, ownerAgentSubject: string, id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, ownerAgentSubject } });
  if (!transaction) throw new BuyerUnderContractError('NOT_FOUND', 'The transaction is unavailable to this Agent.');
  return transaction;
}

export function createBuyerUnderContractService(prisma: PrismaClient) {
  async function appendTimeline(transactionId: string, actorSubject: string, eventType: 'TRANSACTION_CREATED' | 'STAGE_REPORTED' | 'DEADLINE_RECORDED' | 'DEADLINE_VERIFIED' | 'DEADLINE_SUPERSEDED' | 'ISSUE_CREATED' | 'ISSUE_STATE_RECORDED' | 'DECISION_RECORDED' | 'OUTPUT_REVIEWED' | 'COMPLIANCE_CHECKPOINT_RECORDED', objectReference: string, sourceType: string, payload: Prisma.JsonObject, occurredAt: Date | null = null) {
    return prisma.transactionTimelineEvent.create({ data: { transactionId, actorSubject, eventType, objectReference, sourceType, payload, occurredAt } });
  }

  async function assertOwnedProfessionalResponse(ownerAgentSubject: string, id: string | null) {
    if (!id) return null;
    if (!await prisma.professionalInputResponse.findFirst({ where: { id, ownerAgentSubject }, select: { id: true } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The professional response is unavailable to this Agent.');
    return id;
  }

  async function assertOwnedEvidenceAdmission(ownerAgentSubject: string, id: string | null) {
    if (!id) return null;
    if (!await prisma.evidenceAdmission.findFirst({ where: { id, ownerAgentSubject }, select: { id: true } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The evidence admission is unavailable to this Agent.');
    return id;
  }

  async function createTransaction(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const canonicalPropertyId = string(input.canonicalPropertyId, 'canonicalPropertyId', 100)!;
    const label = string(input.label, 'label', 160)!;
    const clientMutationKey = string(input.clientMutationKey, 'clientMutationKey', 160)!;
    const stage = enumValue(input.stage ?? 'UNDER_CONTRACT', transactionStages, 'stage');
    const property = await prisma.canonicalPhysicalProperty.findUnique({ where: { id: canonicalPropertyId }, select: { id: true } });
    if (!property) throw new BuyerUnderContractError('NOT_FOUND', 'The canonical property is unavailable.');
    const idempotencyKey = `ATLAS_BUYER_UNDER_CONTRACT_V1|${ownerAgentSubject}|${fingerprint({ canonicalPropertyId, label, clientMutationKey })}`;
    const existing = await prisma.transaction.findUnique({ where: { idempotencyKey } });
    if (existing) return existing;
    const transaction = await prisma.transaction.create({
      data: {
        ownerAgentSubject,
        canonicalPropertyId,
        label,
        side: 'BUYER',
        stage,
        clientContextLabel: optionalString(input.clientContextLabel, 'clientContextLabel', 160),
        clientContextStatus: optionalString(input.clientContextStatus, 'clientContextStatus', 100) ?? 'SYNTHETIC_OR_REVIEW_REQUIRED',
        mutualExecutionAt: isoDate(input.mutualExecutionAt, 'mutualExecutionAt', false),
        executionVerificationStatus: enumValue(input.executionVerificationStatus ?? 'UNKNOWN', ['REPORTED', 'AGENT_VERIFIED', 'SOURCE_DOCUMENT_VERIFICATION_PENDING', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN'] as const, 'executionVerificationStatus'),
        contractProfileReference: optionalString(input.contractProfileReference, 'contractProfileReference', 160),
        sourceReference: optionalString(input.sourceReference, 'sourceReference', 500),
        limitations: optionalString(input.limitations, 'limitations', 1000),
        archivePolicyVersion: DQG_TRANSACTION_ARCHIVE_POLICY_VERSION,
        idempotencyKey,
      },
    });
    await appendTimeline(transaction.id, ownerAgentSubject, 'TRANSACTION_CREATED', `Transaction:${transaction.id}`, 'AGENT_RECORDED', { stage, archivePolicyVersion: DQG_TRANSACTION_ARCHIVE_POLICY_VERSION }, transaction.mutualExecutionAt);
    return transaction;
  }

  async function createDeadline(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const transaction = await ownedTransaction(prisma, ownerAgentSubject, string(input.transactionId, 'transactionId', 100)!);
    const verificationStatus = enumValue(input.verificationStatus ?? 'RECORDED', deadlineVerifications, 'verificationStatus');
    const deadline = await prisma.transactionDeadline.create({
      data: {
        transactionId: transaction.id,
        category: enumValue(input.category, deadlineCategories, 'category'),
        label: string(input.label, 'label', 160)!,
        dueAt: isoDate(input.dueAt, 'dueAt')!,
        timezone: assertTimeZone(input.timezone),
        sourceClass: enumValue(input.sourceClass, deadlineSourceClasses, 'sourceClass'),
        sourceReference: optionalString(input.sourceReference, 'sourceReference', 500),
        verificationStatus,
        attentionState: verificationStatus === 'CONFLICT_REQUIRES_REVIEW' ? 'CONFLICT_REQUIRES_REVIEW' : 'UPCOMING',
        recordedBySubject: ownerAgentSubject,
        verifiedBySubject: verificationStatus === 'AGENT_VERIFIED' ? ownerAgentSubject : null,
        verifiedAt: verificationStatus === 'AGENT_VERIFIED' ? new Date() : null,
        notes: optionalString(input.notes, 'notes', 1000),
      },
    });
    await appendTimeline(transaction.id, ownerAgentSubject, 'DEADLINE_RECORDED', `TransactionDeadline:${deadline.id}`, deadline.sourceClass, { category: deadline.category, verificationStatus: deadline.verificationStatus, dueAt: deadline.dueAt.toISOString() });
    if (verificationStatus === 'AGENT_VERIFIED') await appendTimeline(transaction.id, ownerAgentSubject, 'DEADLINE_VERIFIED', `TransactionDeadline:${deadline.id}`, 'AGENT_REVIEW', { verificationStatus }, deadline.verifiedAt);
    return deadline;
  }

  async function supersedeDeadline(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const prior = await prisma.transactionDeadline.findFirst({ where: { id: string(input.deadlineId, 'deadlineId', 100)!, transaction: { ownerAgentSubject } } });
    if (!prior) throw new BuyerUnderContractError('NOT_FOUND', 'The deadline is unavailable to this Agent.');
    if (await prisma.transactionDeadline.findFirst({ where: { supersedesDeadlineId: prior.id } })) throw new BuyerUnderContractError('INVALID_REQUEST', 'A successor deadline already exists.');
    const successor = await prisma.transactionDeadline.create({
      data: {
        transactionId: prior.transactionId,
        category: enumValue(input.category ?? prior.category, deadlineCategories, 'category'),
        label: string(input.label ?? prior.label, 'label', 160)!,
        dueAt: isoDate(input.dueAt, 'dueAt')!,
        timezone: assertTimeZone(input.timezone ?? prior.timezone),
        sourceClass: enumValue(input.sourceClass ?? 'AGENT_REPORTED_AMENDMENT', deadlineSourceClasses, 'sourceClass'),
        sourceReference: optionalString(input.sourceReference, 'sourceReference', 500),
        verificationStatus: enumValue(input.verificationStatus ?? 'RECORDED', deadlineVerifications, 'verificationStatus'),
        recordedBySubject: ownerAgentSubject,
        notes: optionalString(input.notes, 'notes', 1000),
        successorReason: string(input.successorReason, 'successorReason', 500)!,
        supersedesDeadlineId: prior.id,
      },
    });
    await prisma.transactionDeadline.update({ where: { id: prior.id }, data: { attentionState: 'SUPERSEDED' } });
    await appendTimeline(prior.transactionId, ownerAgentSubject, 'DEADLINE_SUPERSEDED', `TransactionDeadline:${prior.id}`, successor.sourceClass, { successorDeadlineId: successor.id, successorReason: successor.successorReason, priorDueAt: prior.dueAt.toISOString(), successorDueAt: successor.dueAt.toISOString() });
    return successor;
  }

  async function createIssue(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const transaction = await ownedTransaction(prisma, ownerAgentSubject, string(input.transactionId, 'transactionId', 100)!);
    const relatedDeadlineId = optionalString(input.relatedDeadlineId, 'relatedDeadlineId', 100);
    if (relatedDeadlineId && !await prisma.transactionDeadline.findFirst({ where: { id: relatedDeadlineId, transactionId: transaction.id } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The referenced deadline is unavailable to this transaction.');
    const professionalInputResponseId = optionalString(input.professionalInputResponseId, 'professionalInputResponseId', 100);
    if (professionalInputResponseId && !await prisma.professionalInputResponse.findFirst({ where: { id: professionalInputResponseId, ownerAgentSubject } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The professional response is unavailable to this Agent.');
    const evidenceCandidateId = optionalString(input.evidenceCandidateId, 'evidenceCandidateId', 100);
    if (evidenceCandidateId && !await prisma.evidenceCandidate.findFirst({ where: { id: evidenceCandidateId, ownerAgentSubject } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The evidence candidate is unavailable to this Agent.');
    const evidenceAdmissionId = optionalString(input.evidenceAdmissionId, 'evidenceAdmissionId', 100);
    if (evidenceAdmissionId && !await prisma.evidenceAdmission.findFirst({ where: { id: evidenceAdmissionId, ownerAgentSubject } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The evidence admission is unavailable to this Agent.');
    const outputVersionId = optionalString(input.outputVersionId, 'outputVersionId', 100);
    if (outputVersionId && !await prisma.outputVersion.findFirst({ where: { id: outputVersionId, ownerAgentSubject } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The reviewed output is unavailable to this Agent.');
    const issue = await prisma.transactionIssue.create({
      data: {
        transactionId: transaction.id,
        category: enumValue(input.category, issueCategories, 'category'),
        title: string(input.title, 'title', 160)!,
        factualSummary: string(input.factualSummary, 'factualSummary', 2000)!,
        sourceClass: string(input.sourceClass, 'sourceClass', 100)!,
        sourceReference: optionalString(input.sourceReference, 'sourceReference', 500),
        attentionLevel: enumValue(input.attentionLevel, issueAttentionLevels, 'attentionLevel'),
        state: enumValue(input.state ?? 'OPEN', issueStates, 'state'),
        relatedDeadlineId,
        professionalInputResponseId,
        evidenceCandidateId,
        evidenceAdmissionId,
        outputVersionId,
        agentNotes: optionalString(input.agentNotes, 'agentNotes', 1000),
        createdBySubject: ownerAgentSubject,
      },
    });
    await appendTimeline(transaction.id, ownerAgentSubject, 'ISSUE_CREATED', `TransactionIssue:${issue.id}`, issue.sourceClass, { category: issue.category, attentionLevel: issue.attentionLevel, state: issue.state, professionalInputResponseId: issue.professionalInputResponseId, evidenceCandidateId: issue.evidenceCandidateId, evidenceAdmissionId: issue.evidenceAdmissionId });
    return issue;
  }

  async function recordIssueState(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const issue = await prisma.transactionIssue.findFirst({ where: { id: string(input.issueId, 'issueId', 100)!, transaction: { ownerAgentSubject } } });
    if (!issue) throw new BuyerUnderContractError('NOT_FOUND', 'The issue is unavailable to this Agent.');
    const state = enumValue(input.state, issueStates, 'state');
    const resolved = state === 'RESOLVED_REPORTED' || state === 'CLOSED_INFORMATIONAL';
    const updated = await prisma.transactionIssue.update({ where: { id: issue.id }, data: { state, agentNotes: optionalString(input.agentNotes, 'agentNotes', 1000) ?? issue.agentNotes, resolvedBySubject: resolved ? ownerAgentSubject : null, resolvedAt: resolved ? new Date() : null } });
    await appendTimeline(issue.transactionId, ownerAgentSubject, 'ISSUE_STATE_RECORDED', `TransactionIssue:${issue.id}`, 'AGENT_RECORDED', { priorState: issue.state, state, reason: optionalString(input.reason, 'reason', 500) });
    return updated;
  }

  async function recordDecision(ownerAgentSubject: string, raw: unknown) {
    const input = record(raw);
    const transaction = await ownedTransaction(prisma, ownerAgentSubject, string(input.transactionId, 'transactionId', 100)!);
    const profile = assertLowRiskTransactionDecisionProfile(input.profile);
    const relatedIssueId = optionalString(input.relatedIssueId, 'relatedIssueId', 100);
    const relatedDeadlineId = optionalString(input.relatedDeadlineId, 'relatedDeadlineId', 100);
    if (relatedIssueId && !await prisma.transactionIssue.findFirst({ where: { id: relatedIssueId, transactionId: transaction.id } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The issue is unavailable to this transaction.');
    if (relatedDeadlineId && !await prisma.transactionDeadline.findFirst({ where: { id: relatedDeadlineId, transactionId: transaction.id } })) throw new BuyerUnderContractError('OWNERSHIP_DENIED', 'The deadline is unavailable to this transaction.');
    const description = string(input.description, 'description', 2000)!;
    const sourceMethod = enumValue(input.sourceMethod, decisionSourceMethods, 'sourceMethod');
    const occurredAt = isoDate(input.occurredAt, 'occurredAt', false);
    const idempotencyKey = `ATLAS_TRANSACTION_DECISION_V1|${ownerAgentSubject}|${fingerprint({ transactionId: transaction.id, profile, description, sourceMethod, occurredAt: occurredAt?.toISOString() ?? null, clientMutationKey: string(input.clientMutationKey, 'clientMutationKey', 160)! })}`;
    const existing = await prisma.transactionDecision.findUnique({ where: { idempotencyKey } });
    if (existing) return existing;
    const decision = await prisma.transactionDecision.create({
      data: {
        transactionId: transaction.id,
        profile,
        description,
        sourceMethod,
        clientContextLabel: optionalString(input.clientContextLabel, 'clientContextLabel', 160),
        occurredAt,
        recordedBySubject: ownerAgentSubject,
        provenance: { sourceMethod, explicitAgentRecord: true, clientAuthorityInferred: false, limitations: 'Low-risk operational record only; not binding direction, legal interpretation, contract amendment, waiver, or termination notice.' },
        limitations: string(input.limitations ?? 'Low-risk operational record only; no binding transaction instruction is represented.', 'limitations', 1000)!,
        relatedIssueId,
        relatedDeadlineId,
        professionalInputResponseId: await assertOwnedProfessionalResponse(ownerAgentSubject, optionalString(input.professionalInputResponseId, 'professionalInputResponseId', 100)),
        evidenceAdmissionId: await assertOwnedEvidenceAdmission(ownerAgentSubject, optionalString(input.evidenceAdmissionId, 'evidenceAdmissionId', 100)),
        policyClassification: 'LOW_RISK_TRANSACTION_DECISION_V1',
        idempotencyKey,
      },
    });
    await appendTimeline(transaction.id, ownerAgentSubject, 'DECISION_RECORDED', `TransactionDecision:${decision.id}`, sourceMethod, { profile, policyClassification: decision.policyClassification }, occurredAt);
    return decision;
  }

  async function getOwned(ownerAgentSubject: string, id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, ownerAgentSubject },
      include: {
        canonicalProperty: true,
        deadlines: { include: { supersededByDeadline: true }, orderBy: { createdAt: 'asc' } },
        issues: { include: { relatedDeadline: true, professionalInputResponse: { include: { candidate: true } }, evidenceCandidate: true, evidenceAdmission: true, outputVersion: true }, orderBy: { createdAt: 'asc' } },
        decisions: { orderBy: { recordedAt: 'asc' } },
        timelineEvents: { orderBy: { recordedAt: 'asc' } },
      },
    });
    if (!transaction) throw new BuyerUnderContractError('NOT_FOUND', 'The transaction is unavailable to this Agent.');
    const outputs = await prisma.outputVersion.findMany({ where: { ownerAgentSubject, subjectRef: `Transaction:${id}` }, orderBy: [{ versionOrdinal: 'asc' }, { immutableAt: 'asc' }] });
    return Object.freeze({ ...transaction, archivePolicy: transactionArchivePolicy(), outputs });
  }

  async function listOwned(ownerAgentSubject: string) {
    return prisma.transaction.findMany({ where: { ownerAgentSubject }, include: { canonicalProperty: true }, orderBy: { updatedAt: 'desc' } });
  }

  async function persistUnderContractBrief(ownerAgentSubject: string, transactionId: string, versionLabel: string, reviewNote?: string) {
    const transaction = await getOwned(ownerAgentSubject, transactionId);
    const fixture = buildUnderContractBriefFixture(transaction, versionLabel);
    const output = await createOutputPersistenceService(prisma).persistReviewedFixture(ownerAgentSubject, fixture, reviewNote);
    if (output.created) await appendTimeline(transaction.id, ownerAgentSubject, 'OUTPUT_REVIEWED', `OutputVersion:${output.id}`, 'AGENT_REVIEW', { outputVersionId: output.id, sourceVersionRef: output.sourceVersionRef, contentFingerprint: output.contentFingerprint });
    return output;
  }

  return Object.freeze({ createTransaction, createDeadline, supersedeDeadline, createIssue, recordIssueState, recordDecision, getOwned, listOwned, persistUnderContractBrief });
}

export function buildUnderContractBriefFixture(transaction: Awaited<ReturnType<ReturnType<typeof createBuyerUnderContractService>['getOwned']>>, versionLabel: string): PersistableOutputFixture {
  const trimmedVersion = string(versionLabel, 'versionLabel', 80);
  const archivePolicy = transactionArchivePolicy();
  const contentPayload = {
    schemaVersion: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION,
    transaction: {
      id: transaction.id,
      label: transaction.label,
      side: transaction.side,
      stage: transaction.stage,
      mutualExecutionAt: transaction.mutualExecutionAt?.toISOString() ?? null,
      executionVerificationStatus: transaction.executionVerificationStatus,
      sourceReference: transaction.sourceReference,
      limitations: transaction.limitations,
      canonicalProperty: { id: transaction.canonicalProperty.id, label: transaction.canonicalProperty.sourceFormattedSitusAddress, city: transaction.canonicalProperty.city, state: transaction.canonicalProperty.state, identityStatus: transaction.canonicalProperty.identityStatus, identityConfidence: transaction.canonicalProperty.identityConfidence },
    },
    deadlines: transaction.deadlines.map((deadline) => ({ id: deadline.id, label: deadline.label, category: deadline.category, dueAt: deadline.dueAt.toISOString(), timezone: deadline.timezone, verificationStatus: deadline.verificationStatus, attentionState: deadline.attentionState, supersededByDeadlineId: deadline.supersededByDeadline?.id ?? null })),
    issues: transaction.issues.map((issue) => ({ id: issue.id, title: issue.title, category: issue.category, factualSummary: issue.factualSummary, sourceClass: issue.sourceClass, state: issue.state, attentionLevel: issue.attentionLevel, professionalInputResponseId: issue.professionalInputResponseId, evidenceCandidateId: issue.evidenceCandidateId, evidenceCandidateStatus: issue.evidenceCandidate?.status ?? issue.professionalInputResponse?.candidate.status ?? null, evidenceAdmissionId: issue.evidenceAdmissionId })),
    decisions: transaction.decisions.map((decision) => ({ id: decision.id, profile: decision.profile, description: decision.description, sourceMethod: decision.sourceMethod, occurredAt: decision.occurredAt?.toISOString() ?? null, recordedAt: decision.recordedAt.toISOString(), limitations: decision.limitations })),
    archivePolicy,
    limitations: [
      'Operational coordination only. This brief is not a contract, legal conclusion, notice, amendment, waiver, or binding direction.',
      'No document workflow or document bytes are stored or activated by this foundation.',
      'Professional response and evidence candidate links are provenance only; no EvidenceAdmission or ProfessionalInput is created automatically.',
    ],
  };
  const contentFingerprint = fingerprint(contentPayload);
  return Object.freeze({
    sourceVersionRef: `buyer-under-contract-decision-brief-v1:${transaction.id}:${contentFingerprint}`,
    outputProductId: `buyer-under-contract-product:${transaction.id}`,
    productKind: 'AGENT_INTERNAL_ANALYSIS',
    audience: 'AGENT_INTERNAL',
    subjectRef: `Transaction:${transaction.id}`,
    purpose: 'Agent-reviewed Buyer Under Contract decision brief for bounded operational coordination.',
    displayVersion: `Buyer Under Contract Decision Brief / ${trimmedVersion}`,
    effectiveAsOf: new Date().toISOString().slice(0, 10),
    contentVersion: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION,
    compositionVersion: BUYER_UNDER_CONTRACT_FOUNDATION_VERSION,
    presentationVisualVersion: 'BUYER_UNDER_CONTRACT_AGENT_WORKSPACE_V1',
    outputContractVersion: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION,
    payloadSchemaVersion: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION,
    contentFingerprint,
    contentPayload: contentPayload as Prisma.JsonObject,
    lineage: { priorReviewedVersion: transaction.outputs.at(-1)?.id ?? null, transactionTimelineHead: transaction.timelineEvents.at(-1)?.id ?? null },
    evidence: {
      sourceSnapshotRefs: [`CanonicalPhysicalProperty:${transaction.canonicalPropertyId}`],
      metricRefs: [],
      analysisRefs: [],
      agentInputRefs: transaction.issues.flatMap((issue) => issue.professionalInputResponseId ? [`ProfessionalInputResponse:${issue.professionalInputResponseId}`] : []),
      assumptionRefs: ['NO_DOCUMENT_WORKFLOW_ACTIVE', 'NO_AUTOMATIC_EVIDENCE_ADMISSION'],
      limitationRefs: contentPayload.limitations,
      rightsRefs: ['INTERNAL_AGENT_REVIEW_ONLY'],
      freshnessRefs: [`TRANSACTION_UPDATED:${transaction.updatedAt.toISOString()}`],
      reviewState: 'AGENT_REVIEWED',
      fingerprint: fingerprint({ contentFingerprint, archivePolicy }),
    },
    dependencies: [
      { upstreamArtifact: `Transaction:${transaction.id}`, downstreamArtifact: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION, dependencyType: 'AGENT_INPUT_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: transaction.updatedAt.toISOString(), fieldMetricScope: ['stage', 'mutualExecutionAt', 'executionVerificationStatus', 'deadlines', 'issues', 'decisions'], changePolicy: 'A material transaction, deadline, issue, decision, or provenance change requires a new reviewed brief.', invalidationPolicy: 'RECOMPOSE_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const },
      { upstreamArtifact: DQG_TRANSACTION_ARCHIVE_POLICY_VERSION, downstreamArtifact: BUYER_UNDER_CONTRACT_DECISION_BRIEF_VERSION, dependencyType: 'RIGHTS_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: DQG_TRANSACTION_ARCHIVE_POLICY_VERSION, fieldMetricScope: ['archiveOwner', 'retention', 'secureDocumentSystemRequired', 'storageActive'], changePolicy: 'A changed archive policy requires a new reviewed brief.', invalidationPolicy: 'REVIEW_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const },
    ],
    decisionRefs: transaction.decisions.map((decision) => `TransactionDecision:${decision.id}`),
  });
}
