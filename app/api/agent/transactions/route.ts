import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { createTransactionCaseHandoffService, TransactionCaseHandoffError } from '@/lib/transactionCaseHandoff';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/transactions';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const auth = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return auth.authenticated && auth.identityType === 'HUMAN_AGENT' && auth.role === 'AGENT' && auth.mechanism === 'HUMAN_AGENT_SESSION' && auth.subject && (method === 'GET' || auth.canMutate && isSameOriginAdminRequest(request)) ? auth.subject : null;
}

function errorResponse(error: unknown) {
  if (error instanceof TransactionCaseHandoffError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'CONFLICT' || error.code === 'INVALID_TRANSITION' ? 409 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Transactions are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const service = createTransactionCaseHandoffService(prisma);
    const id = request.nextUrl.searchParams.get('id');
    if (id) return NextResponse.json({ transaction: await service.detail(subject, id) }, { headers: HEADERS });
    return NextResponse.json({ transactions: await service.listOwned(subject, request.nextUrl.searchParams.get('clientCaseId')) }, { headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createTransactionCaseHandoffService(prisma);
    if (body.action === 'CREATE') return NextResponse.json({ transaction: await service.create(subject, body.input) }, { status: 201, headers: HEADERS });
    if (typeof body.transactionId !== 'string') throw new TransactionCaseHandoffError('INVALID_REQUEST', 'transactionId is required.');
    if (body.action === 'UPDATE_STATUS') return NextResponse.json({ transaction: await service.updateStatus(subject, body.transactionId, body.input) }, { headers: HEADERS });
    if (body.action === 'ADVANCE_STAGE') return NextResponse.json({ transaction: await service.advanceStage(subject, body.transactionId, body.input) }, { headers: HEADERS });
    if (body.action === 'ASSOCIATE_PROPERTY') return NextResponse.json({ transaction: await service.associateProperty(subject, body.transactionId, body.input) }, { headers: HEADERS });
    throw new TransactionCaseHandoffError('INVALID_REQUEST', 'Unsupported Transaction action.');
  } catch (error) { return errorResponse(error); }
}
