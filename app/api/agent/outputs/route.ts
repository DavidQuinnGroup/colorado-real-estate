import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  createOutputPersistenceService,
  OUTPUT_PERSISTENCE_API_ROUTE,
  OutputPersistenceError,
  parseOutputPersistenceSaveRequest,
} from '@/lib/outputPersistenceFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

function errorResponse(error: unknown) {
  if (error instanceof OutputPersistenceError) {
    const status = error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_CONFLICT' ? 409 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  return NextResponse.json({ error: 'Output persistence is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

async function authorizeAgentOutputRequest(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: OUTPUT_PERSISTENCE_API_ROUTE, method });
  if (
    !authorization.authenticated ||
    authorization.identityType !== 'HUMAN_AGENT' ||
    authorization.role !== 'AGENT' ||
    authorization.mechanism !== 'HUMAN_AGENT_SESSION' ||
    !authorization.subject ||
    (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))
  ) {
    return null;
  }
  return authorization;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAgentOutputRequest(request, 'GET');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const history = await createOutputPersistenceService(prisma).listOwnedOutputHistory(authorization.subject!);
    return NextResponse.json({ outputs: history }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAgentOutputRequest(request, 'POST');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json();
    const input = parseOutputPersistenceSaveRequest(body);
    const output = await createOutputPersistenceService(prisma).persistReviewedOutput(authorization.subject!, input);
    return NextResponse.json({ output }, { status: output.created ? 201 : 200, headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
