/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma transaction client and deterministic checker doubles share this narrow adapter. */
import { createHash } from 'node:crypto';

export const EVIDENCE_ADMISSION_FOUNDATION_VERSION = 'EVIDENCE_ADMISSION_FOUNDATION_V1' as const;

export const EVIDENCE_SOURCE_KINDS = [
  'TRUSTED_INTERNAL_DETERMINISTIC',
  'PROFESSIONAL_REPORTED',
  'PROFESSIONAL_DOCUMENT',
  'OTHER_REVIEW_REQUIRED',
] as const;
export const EVIDENCE_CLAIM_KINDS = [
  'LENDER_RATE',
  'LENDER_TERM',
  'PAYOFF_AMOUNT',
  'INSURANCE_PREMIUM',
  'INSURANCE_COVERAGE',
  'PROPERTY_MANAGER_RENT',
  'TAX_AMOUNT',
  'TAX_ASSESSMENT',
  'INSPECTION_OBSERVATION',
  'HOA_INFORMATION',
  'TITLE_INFORMATION',
] as const;
export const EVIDENCE_VERIFICATION_STATUSES = [
  'UNVERIFIED',
  'SOURCE_ROLE_CLAIMED',
  'SOURCE_ROLE_VERIFIED',
  'VERIFICATION_LIMITED',
  'VERIFICATION_FAILED',
] as const;
export const EVIDENCE_ADMISSION_POLICIES = [
  'TRUSTED_INTERNAL_DETERMINISTIC_AUTO_ADMISSION',
  'AGENT_REVIEWED_PROFESSIONAL_INPUT',
  'AGENT_REVIEWED_MANUAL_EVIDENCE',
] as const;

export type EvidenceSourceKind = (typeof EVIDENCE_SOURCE_KINDS)[number];
export type EvidenceClaimKind = (typeof EVIDENCE_CLAIM_KINDS)[number];
export type EvidenceVerificationStatus = (typeof EVIDENCE_VERIFICATION_STATUSES)[number];
export type EvidenceAdmissionPolicy = (typeof EVIDENCE_ADMISSION_POLICIES)[number];
export type EvidenceCandidateStatus = 'PENDING_REVIEW' | 'ADMITTED' | 'REJECTED';

type JsonRecord = Readonly<Record<string, unknown>>;

export type EvidenceProvenance = Readonly<{
  sourceType: string;
  sourceReference: string;
  receivedAt: string;
  observedAt?: string | null;
  providedAt?: string | null;
  sourceRoleClaim?: string | null;
  sourceIdentityReference?: string | null;
  verificationStatus: EvidenceVerificationStatus;
  verificationMethod?: string | null;
  verificationLimitations?: string | null;
}>;

export type EvidenceCandidateInput = Readonly<{
  sourceKind: EvidenceSourceKind;
  sourceRef: string;
  claimKind: EvidenceClaimKind;
  candidatePayload: JsonRecord;
  provenance: EvidenceProvenance;
  observedAt?: string | null;
  receivedAt: string;
}>;

export type EvidenceAdmissionInput = Readonly<{
  candidateId: string;
  policy: EvidenceAdmissionPolicy;
  effectiveAt?: string | null;
  expiresAt?: string | null;
  reviewAfter?: string | null;
  supersedesAdmissionId?: string | null;
}>;

export type EligibleEvidenceResolution =
  | Readonly<{ state: 'NONE'; admissions: readonly EvidenceAdmissionRecord[] }>
  | Readonly<{ state: 'ELIGIBLE'; admissions: readonly EvidenceAdmissionRecord[] }>
  | Readonly<{ state: 'CONFLICT_REQUIRES_REVIEW'; admissions: readonly EvidenceAdmissionRecord[] }>;

export type EvidenceAdmissionRecord = Readonly<{
  id: string;
  ownerAgentSubject: string;
  candidateId: string;
  claimKind: EvidenceClaimKind;
  effectiveAt: Date | null;
  expiresAt: Date | null;
  supersedesAdmissionId: string | null;
  supersededByAdmission?: { id: string } | null;
}>;

export class EvidenceAdmissionError extends Error {
  constructor(
    readonly code:
      | 'INVALID_REQUEST'
      | 'SENSITIVE_DATA_PROHIBITED'
      | 'OWNERSHIP_DENIED'
      | 'NOT_REVIEWABLE'
      | 'ADMISSION_POLICY_DENIED'
      | 'NOT_FOUND'
      | 'PERSISTENCE_UNAVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isOneOf<T extends readonly string[]>(value: unknown, values: T): value is T[number] {
  return typeof value === 'string' && values.includes(value as T[number]);
}

function requireBoundedString(value: unknown, field: string, maximum = 500) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum) {
    throw new EvidenceAdmissionError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function requireDate(value: unknown, field: string, nullable = false) {
  if (nullable && (value === null || value === undefined)) return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new EvidenceAdmissionError('INVALID_REQUEST', `${field} must be an ISO timestamp.`);
  }
  return new Date(value);
}

function containsSensitiveData(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsSensitiveData);
  if (!isRecord(value)) return typeof value === 'string' && (/\b\d{3}-?\d{2}-?\d{4}\b/.test(value) || /\b(?:\d[ -]*?){13,19}\b/.test(value));
  return Object.entries(value).some(([key, nested]) => /password|secret|token|ssn|social.?security|credit.?card|bank.?account|routing.?number/i.test(key) || containsSensitiveData(nested));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function evidenceAdmissionFingerprint(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

function validatePayload(claimKind: EvidenceClaimKind, payload: JsonRecord) {
  if (containsSensitiveData(payload)) throw new EvidenceAdmissionError('SENSITIVE_DATA_PROHIBITED', 'Reusable evidence payloads cannot contain sensitive financial or account data.');
  const amountClaim = ['PAYOFF_AMOUNT', 'INSURANCE_PREMIUM', 'INSURANCE_COVERAGE', 'PROPERTY_MANAGER_RENT', 'TAX_AMOUNT', 'TAX_ASSESSMENT'] as const;
  if (claimKind === 'LENDER_RATE') {
    if (typeof payload.rate !== 'number' || !Number.isFinite(payload.rate) || payload.rate < 0 || payload.rate > 100 || payload.unit !== 'PERCENT') throw new EvidenceAdmissionError('INVALID_REQUEST', 'LENDER_RATE requires a bounded percent rate.');
  } else if (claimKind === 'LENDER_TERM') {
    if (typeof payload.duration !== 'number' || !Number.isInteger(payload.duration) || payload.duration < 1 || payload.duration > 600 || !['MONTHS', 'YEARS'].includes(String(payload.unit))) throw new EvidenceAdmissionError('INVALID_REQUEST', 'LENDER_TERM requires a bounded duration and unit.');
  } else if (amountClaim.includes(claimKind as (typeof amountClaim)[number])) {
    if (typeof payload.amount !== 'number' || !Number.isFinite(payload.amount) || payload.amount < 0 || payload.currency !== 'USD') throw new EvidenceAdmissionError('INVALID_REQUEST', `${claimKind} requires a non-negative USD amount.`);
    if (claimKind === 'INSURANCE_PREMIUM' && !['MONTHLY', 'ANNUAL'].includes(String(payload.period))) throw new EvidenceAdmissionError('INVALID_REQUEST', 'INSURANCE_PREMIUM requires a period.');
    if (claimKind === 'PROPERTY_MANAGER_RENT') {
      if (payload.period !== 'MONTHLY') throw new EvidenceAdmissionError('INVALID_REQUEST', 'PROPERTY_MANAGER_RENT requires a monthly period.');
      const rangeLow = payload.rentRangeLow;
      const rangeHigh = payload.rentRangeHigh;
      if ((rangeLow === undefined) !== (rangeHigh === undefined) || (rangeLow !== undefined && (typeof rangeLow !== 'number' || typeof rangeHigh !== 'number' || !Number.isFinite(rangeLow) || !Number.isFinite(rangeHigh) || rangeLow < 0 || rangeLow > rangeHigh || payload.amount < rangeLow || payload.amount > rangeHigh))) throw new EvidenceAdmissionError('INVALID_REQUEST', 'PROPERTY_MANAGER_RENT range values must be a valid monthly range containing the estimate.');
      if (payload.asOf !== undefined && (typeof payload.asOf !== 'string' || Number.isNaN(Date.parse(payload.asOf)))) throw new EvidenceAdmissionError('INVALID_REQUEST', 'PROPERTY_MANAGER_RENT asOf must be an ISO timestamp.');
      if (payload.note !== undefined && (typeof payload.note !== 'string' || !payload.note.trim() || payload.note.length > 1000 || /[<>]/.test(payload.note))) throw new EvidenceAdmissionError('INVALID_REQUEST', 'PROPERTY_MANAGER_RENT note must be bounded plain text.');
    }
    if ((claimKind === 'TAX_AMOUNT' || claimKind === 'TAX_ASSESSMENT') && typeof payload.taxPeriod !== 'string') throw new EvidenceAdmissionError('INVALID_REQUEST', `${claimKind} requires a tax period.`);
  } else {
    if (typeof payload.summary !== 'string' || !payload.summary.trim() || payload.summary.length > 1000) throw new EvidenceAdmissionError('INVALID_REQUEST', `${claimKind} requires a bounded summary.`);
  }
}

export function validateEvidenceCandidateInput(value: unknown): EvidenceCandidateInput {
  if (!isRecord(value)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'Evidence candidate input must be an object.');
  if (!isOneOf(value.sourceKind, EVIDENCE_SOURCE_KINDS) || !isOneOf(value.claimKind, EVIDENCE_CLAIM_KINDS)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'Evidence source or claim kind is unsupported.');
  if (!isRecord(value.candidatePayload) || !isRecord(value.provenance)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'Evidence payload and provenance must be structured objects.');
  if (containsSensitiveData(value.provenance)) throw new EvidenceAdmissionError('SENSITIVE_DATA_PROHIBITED', 'Evidence provenance cannot contain sensitive financial or account data.');
  const provenance = value.provenance;
  if (!isOneOf(provenance.verificationStatus, EVIDENCE_VERIFICATION_STATUSES)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'Evidence verification status is invalid.');
  const normalized: EvidenceCandidateInput = Object.freeze({
    sourceKind: value.sourceKind,
    sourceRef: requireBoundedString(value.sourceRef, 'sourceRef'),
    claimKind: value.claimKind,
    candidatePayload: Object.freeze({ ...value.candidatePayload }),
    provenance: Object.freeze({
      sourceType: requireBoundedString(provenance.sourceType, 'provenance.sourceType'),
      sourceReference: requireBoundedString(provenance.sourceReference, 'provenance.sourceReference'),
      receivedAt: requireBoundedString(provenance.receivedAt, 'provenance.receivedAt'),
      observedAt: provenance.observedAt === undefined || provenance.observedAt === null ? null : requireBoundedString(provenance.observedAt, 'provenance.observedAt'),
      providedAt: provenance.providedAt === undefined || provenance.providedAt === null ? null : requireBoundedString(provenance.providedAt, 'provenance.providedAt'),
      sourceRoleClaim: provenance.sourceRoleClaim === undefined || provenance.sourceRoleClaim === null ? null : requireBoundedString(provenance.sourceRoleClaim, 'provenance.sourceRoleClaim'),
      sourceIdentityReference: provenance.sourceIdentityReference === undefined || provenance.sourceIdentityReference === null ? null : requireBoundedString(provenance.sourceIdentityReference, 'provenance.sourceIdentityReference'),
      verificationStatus: provenance.verificationStatus,
      verificationMethod: provenance.verificationMethod === undefined || provenance.verificationMethod === null ? null : requireBoundedString(provenance.verificationMethod, 'provenance.verificationMethod'),
      verificationLimitations: provenance.verificationLimitations === undefined || provenance.verificationLimitations === null ? null : requireBoundedString(provenance.verificationLimitations, 'provenance.verificationLimitations'),
    }),
    observedAt: value.observedAt === undefined || value.observedAt === null ? null : requireDate(value.observedAt, 'observedAt')!.toISOString(),
    receivedAt: requireDate(value.receivedAt, 'receivedAt')!.toISOString(),
  });
  requireDate(normalized.provenance.receivedAt, 'provenance.receivedAt');
  if (normalized.observedAt && new Date(normalized.observedAt) > new Date(normalized.receivedAt)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'observedAt cannot be after receivedAt.');
  validatePayload(normalized.claimKind, normalized.candidatePayload);
  return normalized;
}

export function policyForEvidenceSource(sourceKind: EvidenceSourceKind): EvidenceAdmissionPolicy | null {
  if (sourceKind === 'TRUSTED_INTERNAL_DETERMINISTIC') return 'TRUSTED_INTERNAL_DETERMINISTIC_AUTO_ADMISSION';
  if (sourceKind === 'PROFESSIONAL_REPORTED') return 'AGENT_REVIEWED_PROFESSIONAL_INPUT';
  if (sourceKind === 'OTHER_REVIEW_REQUIRED') return 'AGENT_REVIEWED_MANUAL_EVIDENCE';
  return null;
}

export function resolveEligibleEvidence(admissions: readonly EvidenceAdmissionRecord[], evaluationTime: Date): EligibleEvidenceResolution {
  const eligible = admissions.filter((admission) =>
    !admission.supersededByAdmission
    && (!admission.effectiveAt || admission.effectiveAt <= evaluationTime)
    && (!admission.expiresAt || admission.expiresAt > evaluationTime),
  );
  if (!eligible.length) return Object.freeze({ state: 'NONE', admissions: [] });
  if (eligible.length === 1) return Object.freeze({ state: 'ELIGIBLE', admissions: [eligible[0]] });
  return Object.freeze({ state: 'CONFLICT_REQUIRES_REVIEW', admissions: eligible });
}

type EvidenceDatabase = {
  $transaction: any;
  evidenceCandidate: any;
  evidenceAdmission: any;
  evidenceAdmissionAuditEvent: any;
};

function ownerScope(ownerAgentSubject: string) {
  if (!ownerAgentSubject.trim()) throw new EvidenceAdmissionError('OWNERSHIP_DENIED', 'An authenticated Agent owner identity is required.');
  return ownerAgentSubject;
}

export async function persistEvidenceCandidateInTransaction(tx: EvidenceDatabase, ownerAgentSubject: string, input: EvidenceCandidateInput, actorSubject = ownerAgentSubject) {
  const owner = ownerScope(ownerAgentSubject);
  const candidate = validateEvidenceCandidateInput(input);
  const fingerprint = evidenceAdmissionFingerprint({ owner, ...candidate });
  const existing = await tx.evidenceCandidate.findUnique({ where: { ownerAgentSubject_fingerprint: { ownerAgentSubject: owner, fingerprint } } });
  if (existing) return Object.freeze({ candidate: existing, created: false });
  const created = await tx.evidenceCandidate.create({
    data: {
      ownerAgentSubject: owner,
      sourceKind: candidate.sourceKind,
      sourceRef: candidate.sourceRef,
      claimKind: candidate.claimKind,
      candidatePayload: candidate.candidatePayload,
      observedAt: candidate.observedAt ? new Date(candidate.observedAt) : null,
      receivedAt: new Date(candidate.receivedAt),
      provenance: candidate.provenance,
      fingerprint,
      admissionPolicyContext: { foundationVersion: EVIDENCE_ADMISSION_FOUNDATION_VERSION },
    },
  });
  await tx.evidenceAdmissionAuditEvent.create({ data: { ownerAgentSubject: owner, candidateId: created.id, eventType: 'CANDIDATE_CREATED', actorSubject, policyContext: { foundationVersion: EVIDENCE_ADMISSION_FOUNDATION_VERSION } } });
  return Object.freeze({ candidate: created, created: true });
}

export function createEvidenceAdmissionService(prisma: EvidenceDatabase) {
  async function createEvidenceCandidate(ownerAgentSubject: string, input: EvidenceCandidateInput) {
    ownerScope(ownerAgentSubject);
    try {
      return await prisma.$transaction(async (tx: EvidenceDatabase) => persistEvidenceCandidateInTransaction(tx, ownerAgentSubject, input));
    } catch (error) {
      if (error instanceof EvidenceAdmissionError) throw error;
      throw new EvidenceAdmissionError('PERSISTENCE_UNAVAILABLE', 'Evidence candidate persistence is unavailable.');
    }
  }

  async function admitEvidenceCandidate(ownerAgentSubject: string, input: EvidenceAdmissionInput) {
    const owner = ownerScope(ownerAgentSubject);
    if (!input.candidateId.trim()) throw new EvidenceAdmissionError('INVALID_REQUEST', 'candidateId is required.');
    return prisma.$transaction(async (tx: EvidenceDatabase) => {
      const candidate = await tx.evidenceCandidate.findFirst({ where: { id: input.candidateId, ownerAgentSubject: owner } });
      if (!candidate) throw new EvidenceAdmissionError('NOT_FOUND', 'The requested evidence candidate is unavailable.');
      if (candidate.status === 'ADMITTED' && candidate.admissionId) {
        const admission = await tx.evidenceAdmission.findFirst({ where: { id: candidate.admissionId, ownerAgentSubject: owner } });
        if (!admission) throw new EvidenceAdmissionError('PERSISTENCE_UNAVAILABLE', 'The admitted evidence record is unavailable.');
        return Object.freeze({ admission, created: false });
      }
      if (candidate.status !== 'PENDING_REVIEW') throw new EvidenceAdmissionError('NOT_REVIEWABLE', 'The evidence candidate is no longer reviewable.');
      const requiredPolicy = policyForEvidenceSource(candidate.sourceKind as EvidenceSourceKind);
      if (!requiredPolicy || input.policy !== requiredPolicy) throw new EvidenceAdmissionError('ADMISSION_POLICY_DENIED', 'The evidence source is not eligible for the requested admission policy.');
      const effectiveAt = requireDate(input.effectiveAt, 'effectiveAt', true);
      const expiresAt = requireDate(input.expiresAt, 'expiresAt', true);
      const reviewAfter = requireDate(input.reviewAfter, 'reviewAfter', true);
      if (effectiveAt && expiresAt && expiresAt <= effectiveAt) throw new EvidenceAdmissionError('INVALID_REQUEST', 'expiresAt must be after effectiveAt.');
      let supersedesAdmissionId: string | null = null;
      if (input.supersedesAdmissionId) {
        const superseded = await tx.evidenceAdmission.findFirst({ where: { id: input.supersedesAdmissionId, ownerAgentSubject: owner } });
        if (!superseded || superseded.claimKind !== candidate.claimKind) throw new EvidenceAdmissionError('NOT_FOUND', 'The superseded admission is unavailable.');
        supersedesAdmissionId = superseded.id;
      }
      const admittedAt = new Date();
      const fingerprint = evidenceAdmissionFingerprint({ owner, candidateId: candidate.id, sourceKind: candidate.sourceKind, sourceRef: candidate.sourceRef, claimKind: candidate.claimKind, candidatePayload: candidate.candidatePayload, provenance: candidate.provenance, policy: input.policy, effectiveAt: effectiveAt?.toISOString() ?? null, expiresAt: expiresAt?.toISOString() ?? null, reviewAfter: reviewAfter?.toISOString() ?? null, supersedesAdmissionId });
      const admission = await tx.evidenceAdmission.create({ data: { ownerAgentSubject: owner, candidateId: candidate.id, sourceKind: candidate.sourceKind, sourceRef: candidate.sourceRef, claimKind: candidate.claimKind, admittedValue: candidate.candidatePayload, provenance: candidate.provenance, admissionPolicy: input.policy, admittedBySubject: owner, admittedAt, effectiveAt, expiresAt, reviewAfter, supersedesAdmissionId, fingerprint } });
      await tx.evidenceCandidate.update({ where: { id: candidate.id }, data: { status: 'ADMITTED', admissionId: admission.id, reviewedBySubject: owner, reviewedAt: admittedAt, admissionPolicyContext: { foundationVersion: EVIDENCE_ADMISSION_FOUNDATION_VERSION, policy: input.policy } } });
      await tx.evidenceAdmissionAuditEvent.createMany({ data: [
        { ownerAgentSubject: owner, candidateId: candidate.id, admissionId: admission.id, eventType: 'CANDIDATE_REVIEWED', actorSubject: owner, policyContext: { decision: 'ADMIT', policy: input.policy } },
        { ownerAgentSubject: owner, candidateId: candidate.id, admissionId: admission.id, eventType: 'CANDIDATE_ADMITTED', actorSubject: owner, policyContext: { policy: input.policy } },
        ...(supersedesAdmissionId ? [{ ownerAgentSubject: owner, candidateId: candidate.id, admissionId: admission.id, eventType: 'ADMISSION_SUPERSEDED', actorSubject: owner, policyContext: { supersedesAdmissionId } }] : []),
      ] });
      return Object.freeze({ admission, created: true });
    });
  }

  async function rejectEvidenceCandidate(ownerAgentSubject: string, candidateId: string, rejectionReason: string) {
    const owner = ownerScope(ownerAgentSubject);
    const reason = requireBoundedString(rejectionReason, 'rejectionReason', 1000);
    return prisma.$transaction(async (tx: EvidenceDatabase) => {
      const candidate = await tx.evidenceCandidate.findFirst({ where: { id: candidateId, ownerAgentSubject: owner } });
      if (!candidate) throw new EvidenceAdmissionError('NOT_FOUND', 'The requested evidence candidate is unavailable.');
      if (candidate.status !== 'PENDING_REVIEW') throw new EvidenceAdmissionError('NOT_REVIEWABLE', 'The evidence candidate is no longer reviewable.');
      const reviewedAt = new Date();
      const rejected = await tx.evidenceCandidate.update({ where: { id: candidate.id }, data: { status: 'REJECTED', reviewedBySubject: owner, reviewedAt, rejectionReason: reason, admissionPolicyContext: { foundationVersion: EVIDENCE_ADMISSION_FOUNDATION_VERSION, decision: 'REJECT' } } });
      await tx.evidenceAdmissionAuditEvent.createMany({ data: [
        { ownerAgentSubject: owner, candidateId: candidate.id, eventType: 'CANDIDATE_REVIEWED', actorSubject: owner, policyContext: { decision: 'REJECT' } },
        { ownerAgentSubject: owner, candidateId: candidate.id, eventType: 'CANDIDATE_REJECTED', actorSubject: owner, policyContext: { reasonCode: 'AGENT_REVIEW_REJECTED' } },
      ] });
      return rejected;
    });
  }

  async function getEvidenceAdmission(ownerAgentSubject: string, admissionId: string) {
    const admission = await prisma.evidenceAdmission.findFirst({ where: { id: admissionId, ownerAgentSubject: ownerScope(ownerAgentSubject) } });
    if (!admission) throw new EvidenceAdmissionError('NOT_FOUND', 'The requested evidence admission is unavailable.');
    return admission;
  }

  async function resolveOwnedEligibleEvidence(ownerAgentSubject: string, claimKind: EvidenceClaimKind, evaluationTime: Date) {
    const owner = ownerScope(ownerAgentSubject);
    const admissions = await prisma.evidenceAdmission.findMany({ where: { ownerAgentSubject: owner, claimKind }, include: { supersededByAdmission: { select: { id: true } } } });
    return resolveEligibleEvidence(admissions as EvidenceAdmissionRecord[], evaluationTime);
  }

  async function listOwnedEvidenceHistory(ownerAgentSubject: string) {
    const owner = ownerScope(ownerAgentSubject);
    return prisma.evidenceCandidate.findMany({
      where: { ownerAgentSubject: owner },
      include: { admissionRecord: true },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  return Object.freeze({ createEvidenceCandidate, admitEvidenceCandidate, rejectEvidenceCandidate, getEvidenceAdmission, resolveOwnedEligibleEvidence, listOwnedEvidenceHistory });
}
