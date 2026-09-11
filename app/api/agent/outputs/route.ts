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
    const service = createOutputPersistenceService(prisma);
    const productId = request.nextUrl.searchParams.get('productId');
    const outputVersionId = request.nextUrl.searchParams.get('outputVersionId');
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (productId && outputVersionId) return NextResponse.json({ error: 'Select either an OutputProduct or OutputVersion.' }, { status: 400, headers: RESPONSE_HEADERS });
    if (productId) return NextResponse.json({ product: await service.loadOwnedOutputProduct(authorization.subject!, productId) }, { headers: RESPONSE_HEADERS });
    if (outputVersionId) return NextResponse.json({ product: await service.loadOwnedOutputVersion(authorization.subject!, outputVersionId) }, { headers: RESPONSE_HEADERS });
    const [history, products] = await Promise.all([
      service.listOwnedOutputHistory(authorization.subject!),
      service.listOwnedOutputProducts(authorization.subject!, clientCaseId),
    ]);
    return NextResponse.json({ outputs: history, products }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAgentOutputRequest(request, 'POST');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json();
    const service = createOutputPersistenceService(prisma);
    if (body && typeof body === 'object' && !Array.isArray(body) && (body as { action?: unknown }).action === 'CREATE_SYNTHETIC_DRAFT') {
      const clientCaseId = (body as { clientCaseId?: unknown }).clientCaseId;
      if (typeof clientCaseId !== 'string') throw new OutputPersistenceError('INVALID_REQUEST', 'clientCaseId is required.');
      return NextResponse.json({ output: await service.createSyntheticOutputDraft(authorization.subject!, clientCaseId) }, { status: 201, headers: RESPONSE_HEADERS });
    }
    if (body && typeof body === 'object' && !Array.isArray(body) && (body as { action?: unknown }).action === 'REVIEW_OUTPUT_VERSION') {
      const outputVersionId = (body as { outputVersionId?: unknown }).outputVersionId;
      const reviewNote = (body as { reviewNote?: unknown }).reviewNote;
      if (typeof outputVersionId !== 'string') throw new OutputPersistenceError('INVALID_REQUEST', 'outputVersionId is required.');
      if (reviewNote !== undefined && typeof reviewNote !== 'string') throw new OutputPersistenceError('INVALID_REQUEST', 'reviewNote is invalid.');
      return NextResponse.json({ output: await service.reviewOutputVersion(authorization.subject!, outputVersionId, reviewNote) }, { status: 201, headers: RESPONSE_HEADERS });
    }
    const input = parseOutputPersistenceSaveRequest(body);
    const output = await service.persistReviewedOutput(authorization.subject!, input);
    return NextResponse.json({ output }, { status: output.created ? 201 : 200, headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
