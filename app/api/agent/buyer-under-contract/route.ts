import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { BuyerUnderContractError, createBuyerUnderContractService } from '@/lib/buyerUnderContractFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/buyer-under-contract';
const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.mechanism !== 'HUMAN_AGENT_SESSION' || !authorization.subject || (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))) return null;
  return authorization.subject;
}

function errorResponse(error: unknown) {
  if (error instanceof BuyerUnderContractError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  return NextResponse.json({ error: 'Buyer Under Contract is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const transactionId = request.nextUrl.searchParams.get('transactionId');
    const service = createBuyerUnderContractService(prisma);
    return NextResponse.json(transactionId ? { transaction: await service.getOwned(subject, transactionId) } : { transactions: await service.listOwned(subject) }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createBuyerUnderContractService(prisma);
    if (body.action === 'CREATE_TRANSACTION') return NextResponse.json({ transaction: await service.createTransaction(subject, body.input) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'CREATE_DEADLINE') return NextResponse.json({ deadline: await service.createDeadline(subject, body.input) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'SUPERSEDE_DEADLINE') return NextResponse.json({ deadline: await service.supersedeDeadline(subject, body.input) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'CREATE_ISSUE') return NextResponse.json({ issue: await service.createIssue(subject, body.input) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'RECORD_ISSUE_STATE') return NextResponse.json({ issue: await service.recordIssueState(subject, body.input) }, { headers: RESPONSE_HEADERS });
    if (body.action === 'RECORD_DECISION') return NextResponse.json({ decision: await service.recordDecision(subject, body.input) }, { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'PERSIST_BRIEF') {
      const input = body.input as Record<string, unknown> | null;
      if (!input || typeof input.transactionId !== 'string' || typeof input.versionLabel !== 'string') throw new BuyerUnderContractError('INVALID_REQUEST', 'transactionId and versionLabel are required.');
      return NextResponse.json({ output: await service.persistUnderContractBrief(subject, input.transactionId, input.versionLabel, typeof input.reviewNote === 'string' ? input.reviewNote : undefined) }, { status: 201, headers: RESPONSE_HEADERS });
    }
    throw new BuyerUnderContractError('INVALID_REQUEST', 'Unsupported Buyer Under Contract action.');
  } catch (error) {
    return errorResponse(error);
  }
}
