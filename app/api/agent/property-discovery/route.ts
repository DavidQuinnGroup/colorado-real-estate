import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import { createAgentPropertyDiscoveryService } from '@/lib/agentPropertyDiscovery';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/property-discovery';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method: 'GET' });
  return authorization.authenticated
    && authorization.identityType === 'HUMAN_AGENT'
    && authorization.role === 'AGENT'
    && authorization.mechanism === 'HUMAN_AGENT_SESSION'
    && authorization.subject
    ? authorization.subject
    : null;
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request);
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  const clientCaseId = request.nextUrl.searchParams.get('clientCaseId')?.trim();
  if (!clientCaseId) return NextResponse.json({ error: 'clientCaseId is required.', code: 'INVALID_REQUEST' }, { status: 400, headers: HEADERS });
  const query = request.nextUrl.searchParams.get('q') ?? '';
  try {
    return NextResponse.json(await createAgentPropertyDiscoveryService(prisma).search(subject, clientCaseId, query), { headers: HEADERS });
  } catch (error) {
    if (error instanceof Error && error.message === 'OWNERSHIP_DENIED') return NextResponse.json({ error: 'The Client Case is unavailable to this Agent.', code: 'OWNERSHIP_DENIED' }, { status: 403, headers: HEADERS });
    return NextResponse.json({ error: 'Property search is unavailable right now.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
  }
}
