import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientCaseContextRecordsError, createClientCaseContextRecordsService } from '@/lib/clientCaseContextRecordsFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const CLIENT_CASE_OBJECTIVES_API_ROUTE = '/api/agent/client-case-objectives' as const;

const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: CLIENT_CASE_OBJECTIVES_API_ROUTE, method });
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
  if (error instanceof ClientCaseContextRecordsError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'CONFLICT' || error.code === 'ACTIVE_PROPERTY_RELATIONSHIPS_EXIST' ? 409 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Client Case Objectives are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

function clientCaseId(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'clientCaseId is required.');
  return value;
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    return NextResponse.json(await createClientCaseContextRecordsService(prisma).listObjectiveSummary(subject, clientCaseId(request.nextUrl.searchParams.get('clientCaseId'))), { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createClientCaseContextRecordsService(prisma);
    const ownerClientCaseId = clientCaseId(body.clientCaseId);
    if (body.action === 'CREATE_PURSUIT_OBJECTIVE') return NextResponse.json({ objective: await service.createPursuitObjective(subject, ownerClientCaseId, body.input) }, { headers: HEADERS });
    if (body.action === 'TRANSITION_OBJECTIVE') {
      if (typeof body.objectiveId !== 'string') throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'objectiveId is required.');
      return NextResponse.json({ objective: await service.transitionObjective(subject, ownerClientCaseId, body.objectiveId, body.input) }, { headers: HEADERS });
    }
    throw new ClientCaseContextRecordsError('INVALID_REQUEST', 'Unsupported Client Case Objective action.');
  } catch (error) {
    return errorResponse(error);
  }
}
