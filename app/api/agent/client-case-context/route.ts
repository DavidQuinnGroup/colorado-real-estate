import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import { ClientCaseContextSummaryError, createClientCaseContextSummaryService } from '@/lib/clientCaseContextSummary';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-case-context';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest) {
  const auth = await authorizeAdminRequest(request, { pathname: ROUTE, method: 'GET' });
  return auth.authenticated && auth.identityType === 'HUMAN_AGENT' && auth.role === 'AGENT' && auth.mechanism === 'HUMAN_AGENT_SESSION' && auth.subject ? auth.subject : null;
}

function unavailable(error: unknown) {
  const status = error instanceof ClientCaseContextSummaryError ? error.code === 'INVALID_REQUEST' ? 400 : 404 : 503;
  return NextResponse.json({ error: 'Client Case context is unavailable.' }, { status, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request);
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (!clientCaseId) throw new ClientCaseContextSummaryError('INVALID_REQUEST', 'Client Case context is unavailable.');
    const clientCase = await createClientCaseContextSummaryService(prisma).load(subject, clientCaseId);
    return NextResponse.json({ clientCase }, { headers: HEADERS });
  } catch (error) {
    return unavailable(error);
  }
}
