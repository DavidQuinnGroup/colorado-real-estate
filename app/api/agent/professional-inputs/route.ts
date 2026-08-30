import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { createProfessionalInputService, ProfessionalInputError, validateProfessionalInputRequest, validateProfessionalInputResponse } from '@/lib/professionalInputFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/professional-inputs';
const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function authorizeProfessionalInputRequest(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.mechanism !== 'HUMAN_AGENT_SESSION' || !authorization.subject || (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))) return null;
  return authorization.subject;
}

function errorResponse(error: unknown) {
  if (error instanceof ProfessionalInputError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : error.code === 'OWNERSHIP_DENIED' ? 403 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  return NextResponse.json({ error: 'Professional input is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

export async function POST(request: NextRequest) {
  const subject = await authorizeProfessionalInputRequest(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createProfessionalInputService(prisma);
    if (body.action === 'CREATE_REQUEST') return NextResponse.json({ request: await service.createProfessionalInputRequest(subject, validateProfessionalInputRequest(body.request)) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'REQUEST') {
      if (typeof body.requestId !== 'string') throw new ProfessionalInputError('INVALID_REQUEST', 'requestId is required.');
      return NextResponse.json({ request: await service.requestProfessionalInput(subject, body.requestId) }, { headers: RESPONSE_HEADERS });
    }
    if (body.action === 'RECORD_RESPONSE') {
      const result = await service.recordProfessionalInputResponse(subject, validateProfessionalInputResponse(body.response));
      return NextResponse.json(result, { status: result.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (body.action === 'MATERIALIZE_INPUT') {
      if (typeof body.evidenceAdmissionId !== 'string') throw new ProfessionalInputError('INVALID_REQUEST', 'evidenceAdmissionId is required.');
      const result = await service.materializeProfessionalInput(subject, body.evidenceAdmissionId);
      return NextResponse.json(result, { status: result.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    throw new ProfessionalInputError('INVALID_REQUEST', 'Unsupported professional input action.');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  const subject = await authorizeProfessionalInputRequest(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    return NextResponse.json({ history: await createProfessionalInputService(prisma).listOwnedProfessionalInputHistory(subject) }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
