import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientAuthorizationError, createClientAuthorizationService } from '@/lib/clientAuthorizationFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-authorizations';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return authorization.authenticated && authorization.identityType === 'HUMAN_AGENT' && authorization.role === 'AGENT' && authorization.mechanism === 'HUMAN_AGENT_SESSION' && authorization.subject && (method === 'GET' || authorization.canMutate && isSameOriginAdminRequest(request)) ? authorization.subject : null;
}

function errorResponse(error: unknown) {
  if (error instanceof ClientAuthorizationError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Client authorizations are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const service = createClientAuthorizationService(prisma);
    await service.ensureSyntheticProfile();
    return NextResponse.json({ authorizations: await service.listOwned(subject) }, { headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createClientAuthorizationService(prisma);
    if (body.action === 'CREATE_SYNTHETIC') return NextResponse.json({ authorization: await service.createSynthetic(subject, body.input) }, { status: 201, headers: HEADERS });
    if (body.action === 'SUPERSEDE') {
      if (typeof body.authorizationId !== 'string') throw new ClientAuthorizationError('INVALID_REQUEST', 'authorizationId is required.');
      return NextResponse.json({ authorization: await service.supersede(subject, body.authorizationId, body.input) }, { status: 201, headers: HEADERS });
    }
    if (body.action === 'REVOKE') {
      if (typeof body.authorizationId !== 'string' || typeof body.reason !== 'string') throw new ClientAuthorizationError('INVALID_REQUEST', 'authorizationId and reason are required.');
      return NextResponse.json({ authorization: await service.revoke(subject, body.authorizationId, body.reason) }, { headers: HEADERS });
    }
    if (body.action === 'RESOLVE' || body.action === 'RECORD_SYNTHETIC_USE') {
      if (!body.input || typeof body.input !== 'object') throw new ClientAuthorizationError('INVALID_REQUEST', 'resolution input is required.');
      if (body.action === 'RESOLVE') return NextResponse.json({ resolution: await service.resolve(subject, body.input as never) }, { headers: HEADERS });
      if (typeof body.downstreamReference !== 'string' || typeof body.clientMutationKey !== 'string') throw new ClientAuthorizationError('INVALID_REQUEST', 'synthetic use fields are required.');
      return NextResponse.json(await service.recordUse(subject, body.input as never, body.downstreamReference, body.clientMutationKey), { status: 201, headers: HEADERS });
    }
    throw new ClientAuthorizationError('INVALID_REQUEST', 'Unsupported Client Authorization action.');
  } catch (error) { return errorResponse(error); }
}
