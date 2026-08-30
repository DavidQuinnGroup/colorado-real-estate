/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma transaction client and deterministic checker doubles share this narrow adapter. */
import {
  EVIDENCE_CLAIM_KINDS,
  EVIDENCE_VERIFICATION_STATUSES,
  evidenceAdmissionFingerprint,
  persistEvidenceCandidateInTransaction,
  type EvidenceClaimKind,
  type EvidenceCandidateInput,
  type EvidenceVerificationStatus,
  validateEvidenceCandidateInput,
} from './evidenceAdmissionFoundation';

export const PROFESSIONAL_INPUT_FOUNDATION_VERSION = 'PROFESSIONAL_INPUT_REQUEST_AND_VERIFICATION_FOUNDATION_V1' as const;
export const PROFESSIONAL_INPUT_REQUEST_STATUSES = ['DRAFT', 'REQUESTED', 'ACKNOWLEDGED', 'RESPONDED', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'EXPIRED'] as const;

type ProfessionalInputRequestStatus = (typeof PROFESSIONAL_INPUT_REQUEST_STATUSES)[number];

export class ProfessionalInputError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'NOT_REVIEWABLE' | 'OWNERSHIP_DENIED' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireString(value: unknown, field: string, maximum = 500) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum) throw new ProfessionalInputError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function requireDate(value: unknown, field: string, nullable = false) {
  if (nullable && (value === null || value === undefined)) return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new ProfessionalInputError('INVALID_REQUEST', `${field} must be an ISO timestamp.`);
  return new Date(value);
}

function ownerScope(ownerAgentSubject: string) {
  if (!ownerAgentSubject.trim()) throw new ProfessionalInputError('OWNERSHIP_DENIED', 'An authenticated Agent owner identity is required.');
  return ownerAgentSubject;
}

export type ProfessionalInputRequestInput = Readonly<{
  claimKind: EvidenceClaimKind;
  requestedSourceRole: string;
  purpose: string;
  dueAt?: string | null;
  supportDocumentRequired?: boolean;
}>;

export type ProfessionalInputResponseInput = Readonly<{
  requestId: string;
  candidate: EvidenceCandidateInput;
}>;

export function validateProfessionalInputRequest(value: unknown): ProfessionalInputRequestInput {
  if (!isRecord(value) || !EVIDENCE_CLAIM_KINDS.includes(value.claimKind as EvidenceClaimKind)) throw new ProfessionalInputError('INVALID_REQUEST', 'A supported claimKind is required.');
  return Object.freeze({
    claimKind: value.claimKind as EvidenceClaimKind,
    requestedSourceRole: requireString(value.requestedSourceRole, 'requestedSourceRole'),
    purpose: requireString(value.purpose, 'purpose', 1000),
    dueAt: value.dueAt === undefined || value.dueAt === null ? null : requireDate(value.dueAt, 'dueAt')!.toISOString(),
    supportDocumentRequired: value.supportDocumentRequired === true,
  });
}

export function validateProfessionalInputResponse(value: unknown): ProfessionalInputResponseInput {
  if (!isRecord(value)) throw new ProfessionalInputError('INVALID_REQUEST', 'Professional input response is malformed.');
  let candidate: EvidenceCandidateInput;
  try {
    candidate = validateEvidenceCandidateInput(value.candidate);
  } catch (error) {
    if (error instanceof Error) throw new ProfessionalInputError('INVALID_REQUEST', error.message);
    throw error;
  }
  if (candidate.sourceKind !== 'PROFESSIONAL_REPORTED' || !EVIDENCE_VERIFICATION_STATUSES.includes(candidate.provenance.verificationStatus as EvidenceVerificationStatus)) throw new ProfessionalInputError('INVALID_REQUEST', 'Professional response must identify an explicit professional source and verification status.');
  return Object.freeze({
    requestId: requireString(value.requestId, 'requestId'),
    candidate,
  });
}

type ProfessionalDatabase = {
  $transaction: any;
  professionalInputRequest: any;
  professionalInputResponse: any;
  professionalInput: any;
  evidenceCandidate: any;
  evidenceAdmission: any;
  evidenceAdmissionAuditEvent: any;
};

export function createProfessionalInputService(prisma: ProfessionalDatabase) {
  async function createProfessionalInputRequest(ownerAgentSubject: string, input: ProfessionalInputRequestInput) {
    const owner = ownerScope(ownerAgentSubject);
    const request = validateProfessionalInputRequest(input);
    return prisma.professionalInputRequest.create({ data: { ownerAgentSubject: owner, claimKind: request.claimKind, requestedSourceRole: request.requestedSourceRole, status: 'DRAFT', requestedBySubject: owner, purpose: request.purpose, dueAt: request.dueAt ? new Date(request.dueAt) : null, supportDocumentRequired: request.supportDocumentRequired } });
  }

  async function requestProfessionalInput(ownerAgentSubject: string, requestId: string) {
    const owner = ownerScope(ownerAgentSubject);
    const request = await prisma.professionalInputRequest.findFirst({ where: { id: requestId, ownerAgentSubject: owner } });
    if (!request) throw new ProfessionalInputError('NOT_FOUND', 'The requested professional input request is unavailable.');
    if (request.status !== 'DRAFT') throw new ProfessionalInputError('NOT_REVIEWABLE', 'The professional input request cannot be sent from its current state.');
    return prisma.professionalInputRequest.update({ where: { id: request.id }, data: { status: 'REQUESTED', requestedAt: new Date() } });
  }

  async function recordProfessionalInputResponse(ownerAgentSubject: string, input: ProfessionalInputResponseInput) {
    const owner = ownerScope(ownerAgentSubject);
    const response = validateProfessionalInputResponse(input);
    return prisma.$transaction(async (tx: ProfessionalDatabase) => {
      const request = await tx.professionalInputRequest.findFirst({ where: { id: response.requestId, ownerAgentSubject: owner } });
      if (!request) throw new ProfessionalInputError('NOT_FOUND', 'The requested professional input request is unavailable.');
      const existing = await tx.professionalInputResponse.findFirst({ where: { requestId: request.id, ownerAgentSubject: owner }, include: { candidate: true } });
      if (existing) {
        const candidateFingerprint = evidenceAdmissionFingerprint({ owner, ...response.candidate });
        if (existing.candidate.fingerprint === candidateFingerprint) return Object.freeze({ response: existing, candidate: existing.candidate, created: false });
        throw new ProfessionalInputError('NOT_REVIEWABLE', 'A different response is already recorded for this request.');
      }
      if (!['REQUESTED', 'ACKNOWLEDGED'].includes(request.status as ProfessionalInputRequestStatus) || (request.dueAt && request.dueAt < new Date())) throw new ProfessionalInputError('NOT_REVIEWABLE', 'The professional input request cannot accept a response.');
      if (response.candidate.claimKind !== request.claimKind) throw new ProfessionalInputError('NOT_REVIEWABLE', 'The response claim kind must match the request.');
      const candidateResult = await persistEvidenceCandidateInTransaction(tx, owner, response.candidate);
      const candidate = candidateResult.candidate;
      if (candidate.status !== 'PENDING_REVIEW') throw new ProfessionalInputError('NOT_REVIEWABLE', 'The response candidate is no longer reviewable.');
      const created = await tx.professionalInputResponse.create({ data: { requestId: request.id, ownerAgentSubject: owner, sourceReference: response.candidate.sourceRef, sourceRoleClaim: response.candidate.provenance.sourceRoleClaim, sourceIdentityReference: response.candidate.provenance.sourceIdentityReference, providedAt: response.candidate.provenance.providedAt ? new Date(response.candidate.provenance.providedAt) : null, receivedAt: new Date(response.candidate.receivedAt), responsePayload: response.candidate.candidatePayload, provenance: response.candidate.provenance, verificationStatus: response.candidate.provenance.verificationStatus, candidateId: candidate.id } });
      await tx.professionalInputRequest.update({ where: { id: request.id }, data: { status: 'RESPONDED' } });
      return Object.freeze({ response: created, candidate, created: true });
    });
  }

  async function materializeProfessionalInput(ownerAgentSubject: string, evidenceAdmissionId: string) {
    const owner = ownerScope(ownerAgentSubject);
    return prisma.$transaction(async (tx: ProfessionalDatabase) => {
      const admission = await tx.evidenceAdmission.findFirst({ where: { id: evidenceAdmissionId, ownerAgentSubject: owner }, include: { candidate: true } });
      if (!admission || admission.sourceKind !== 'PROFESSIONAL_REPORTED') throw new ProfessionalInputError('NOT_FOUND', 'The professional evidence admission is unavailable.');
      const response = await tx.professionalInputResponse.findFirst({ where: { candidateId: admission.candidateId, ownerAgentSubject: owner } });
      if (!response) throw new ProfessionalInputError('NOT_REVIEWABLE', 'The admitted evidence is not linked to a professional input response.');
      const existing = await tx.professionalInput.findFirst({ where: { evidenceAdmissionId: admission.id, ownerAgentSubject: owner } });
      if (existing) return Object.freeze({ input: existing, created: false });
      const count = await tx.professionalInput.count({ where: { ownerAgentSubject: owner, claimKind: admission.claimKind } });
      const fingerprint = evidenceAdmissionFingerprint({ owner, evidenceAdmissionId: admission.id, claimKind: admission.claimKind, value: admission.admittedValue, provenance: admission.provenance, versionOrdinal: count + 1 });
      const created = await tx.professionalInput.create({ data: { ownerAgentSubject: owner, claimKind: admission.claimKind, versionOrdinal: count + 1, value: admission.admittedValue, evidenceAdmissionId: admission.id, effectiveAt: admission.effectiveAt, expiresAt: admission.expiresAt, reviewAfter: admission.reviewAfter, provenance: admission.provenance, fingerprint } });
      await tx.professionalInputRequest.update({ where: { id: response.requestId }, data: { status: 'COMPLETED' } });
      return Object.freeze({ input: created, created: true });
    });
  }

  async function listOwnedProfessionalInputHistory(ownerAgentSubject: string) {
    const owner = ownerScope(ownerAgentSubject);
    const [requests, inputs] = await Promise.all([
      prisma.professionalInputRequest.findMany({ where: { ownerAgentSubject: owner }, include: { response: { include: { candidate: true } } }, orderBy: [{ createdAt: 'desc' }] }),
      prisma.professionalInput.findMany({ where: { ownerAgentSubject: owner }, include: { evidenceAdmission: true }, orderBy: [{ claimKind: 'asc' }, { versionOrdinal: 'desc' }] }),
    ]);
    return Object.freeze({ requests, inputs });
  }

  return Object.freeze({ createProfessionalInputRequest, requestProfessionalInput, recordProfessionalInputResponse, materializeProfessionalInput, listOwnedProfessionalInputHistory });
}
