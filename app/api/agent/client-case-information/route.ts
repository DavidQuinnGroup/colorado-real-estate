import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  CLIENT_CASE_INFORMATION_API_ROUTE,
  ClientCaseInformationError,
  createClientCaseInformationWorkflowService,
} from '@/lib/clientCaseInformationWorkflow';
import { ClientCaseError } from '@/lib/clientCaseContextFoundation';
import { ClientCaseContextRecordsError } from '@/lib/clientCaseContextRecordsFoundation';
import { ClientCaseCapabilityReadinessError } from '@/lib/clientCaseCapabilityReadinessEvaluator';
import { ClientCaseEffectiveContextError } from '@/lib/clientCaseEffectiveContextResolver';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: CLIENT_CASE_INFORMATION_API_ROUTE, method });
  return authorization.authenticated
    && authorization.identityType === 'HUMAN_AGENT'
    && authorization.role === 'AGENT'
    && authorization.mechanism === 'HUMAN_AGENT_SESSION'
    && authorization.subject
    && (method === 'GET' || (authorization.canMutate && isSameOriginAdminRequest(request)))
    ? authorization.subject
    : null;
}

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseInformationError || error instanceof ClientCaseContextRecordsError || error instanceof ClientCaseError || error instanceof ClientCaseEffectiveContextError || error instanceof ClientCaseCapabilityReadinessError) {
    const code = 'code' in error ? error.code : 'PERSISTENCE_UNAVAILABLE';
    const status = code === 'NOT_FOUND' ? 404 : code === 'OWNERSHIP_DENIED' ? 403 : code === 'CONFLICT' ? 409 : code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Client Case information is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (!clientCaseId) throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCaseId is required.');
    return NextResponse.json(await createClientCaseInformationWorkflowService(prisma).load(subject, clientCaseId), { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.action !== 'SAVE_CANONICAL_INFORMATION') throw new ClientCaseInformationError('INVALID_REQUEST', 'Unsupported Client Case information action.');
    if (typeof body.clientCaseId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCaseId is required.');
    return NextResponse.json(await createClientCaseInformationWorkflowService(prisma).save(subject, body.clientCaseId, body.input), { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
