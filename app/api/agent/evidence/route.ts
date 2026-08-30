import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  createEvidenceAdmissionService,
  type EvidenceAdmissionInput,
  EvidenceAdmissionError,
  type EvidenceClaimKind,
  EVIDENCE_CLAIM_KINDS,
  validateEvidenceCandidateInput,
} from '@/lib/evidenceAdmissionFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/evidence';
const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function authorizeEvidenceRequest(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.mechanism !== 'HUMAN_AGENT_SESSION' || !authorization.subject || (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))) return null;
  return authorization;
}

function errorResponse(error: unknown) {
  if (error instanceof EvidenceAdmissionError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : error.code === 'OWNERSHIP_DENIED' ? 403 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  return NextResponse.json({ error: 'Evidence admission is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeEvidenceRequest(request, 'GET');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  const subject = authorization.subject!;
  try {
    const service = createEvidenceAdmissionService(prisma);
    if (request.nextUrl.searchParams.get('history') === '1') return NextResponse.json({ candidates: await service.listOwnedEvidenceHistory(subject) }, { headers: RESPONSE_HEADERS });
    const admissionId = request.nextUrl.searchParams.get('admissionId');
    if (admissionId) return NextResponse.json({ admission: await service.getEvidenceAdmission(subject, admissionId) }, { headers: RESPONSE_HEADERS });
    const claimKind = request.nextUrl.searchParams.get('claimKind');
    if (!claimKind || !EVIDENCE_CLAIM_KINDS.includes(claimKind as EvidenceClaimKind)) throw new EvidenceAdmissionError('INVALID_REQUEST', 'A supported claimKind is required.');
    const at = request.nextUrl.searchParams.get('at');
    const evaluationTime = at ? new Date(at) : new Date();
    if (Number.isNaN(evaluationTime.getTime())) throw new EvidenceAdmissionError('INVALID_REQUEST', 'at must be an ISO timestamp.');
    return NextResponse.json({ resolution: await service.resolveOwnedEligibleEvidence(subject, claimKind as EvidenceClaimKind, evaluationTime) }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeEvidenceRequest(request, 'POST');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  const subject = authorization.subject!;
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createEvidenceAdmissionService(prisma);
    if (body.action === 'CREATE_CANDIDATE') {
      const result = await service.createEvidenceCandidate(subject, validateEvidenceCandidateInput(body.candidate));
      return NextResponse.json(result, { status: result.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (body.action === 'ADMIT_CANDIDATE') {
      const result = await service.admitEvidenceCandidate(subject, body.admission as EvidenceAdmissionInput);
      return NextResponse.json(result, { status: result.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (body.action === 'REJECT_CANDIDATE') {
      if (typeof body.candidateId !== 'string' || typeof body.rejectionReason !== 'string') throw new EvidenceAdmissionError('INVALID_REQUEST', 'candidateId and rejectionReason are required.');
      return NextResponse.json({ candidate: await service.rejectEvidenceCandidate(subject, body.candidateId, body.rejectionReason) }, { headers: RESPONSE_HEADERS });
    }
    throw new EvidenceAdmissionError('INVALID_REQUEST', 'Unsupported evidence admission action.');
  } catch (error) {
    return errorResponse(error);
  }
}
