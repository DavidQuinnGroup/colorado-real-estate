import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientCaseError, createClientCaseContextService } from '@/lib/clientCaseContextFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-cases';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const auth = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return auth.authenticated && auth.identityType === 'HUMAN_AGENT' && auth.role === 'AGENT' && auth.mechanism === 'HUMAN_AGENT_SESSION' && auth.subject && (method === 'GET' || auth.canMutate && isSameOriginAdminRequest(request)) ? auth.subject : null;
}

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400, headers: HEADERS });
  return NextResponse.json({ error: 'Client Cases are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const service = createClientCaseContextService(prisma);
    const id = request.nextUrl.searchParams.get('id');
    if (id) return NextResponse.json({ clientCase: await service.detail(subject, id) }, { headers: HEADERS });
    return NextResponse.json({ clientCases: await service.listOwned(subject, request.nextUrl.searchParams.get('archived') === 'true') }, { headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createClientCaseContextService(prisma);
    if (body.action === 'CREATE') return NextResponse.json({ clientCase: await service.create(subject, body.input) }, { status: 201, headers: HEADERS });
    if (typeof body.clientCaseId !== 'string') throw new ClientCaseError('INVALID_REQUEST', 'clientCaseId is required.');
    if (body.action === 'UPDATE') return NextResponse.json({ clientCase: await service.update(subject, body.clientCaseId, body.input) }, { headers: HEADERS });
    if (body.action === 'ARCHIVE') return NextResponse.json({ clientCase: await service.archive(subject, body.clientCaseId) }, { headers: HEADERS });
    if (body.action === 'REACTIVATE') return NextResponse.json({ clientCase: await service.reactivate(subject, body.clientCaseId) }, { headers: HEADERS });
    if (body.action === 'ADD_PARTY') return NextResponse.json({ clientCase: await service.addParty(subject, body.clientCaseId, body.input) }, { headers: HEADERS });
    if (body.action === 'ATTACH_PROPERTY') return NextResponse.json({ clientCase: await service.attachProperty(subject, body.clientCaseId, body.input) }, { headers: HEADERS });
    if (body.action === 'UPDATE_PROPERTY_ROLE') {
      if (typeof body.clientCasePropertyId !== 'string') throw new ClientCaseError('INVALID_REQUEST', 'clientCasePropertyId is required.');
      return NextResponse.json({ clientCase: await service.updatePropertyRole(subject, body.clientCaseId, body.clientCasePropertyId, body.input) }, { headers: HEADERS });
    }
    if (body.action === 'ATTACH_TRANSACTION') {
      if (typeof body.transactionId !== 'string') throw new ClientCaseError('INVALID_REQUEST', 'transactionId is required.');
      return NextResponse.json({ clientCase: await service.attachTransaction(subject, body.clientCaseId, body.transactionId) }, { headers: HEADERS });
    }
    throw new ClientCaseError('INVALID_REQUEST', 'Unsupported Client Case action.');
  } catch (error) { return errorResponse(error); }
}
