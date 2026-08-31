import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { createInvestmentBreakevenService, InvestmentBreakevenError } from '@/lib/investmentBreakevenAnalysis';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/investment-breakeven';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return authorization.authenticated && authorization.identityType === 'HUMAN_AGENT' && authorization.role === 'AGENT' && authorization.mechanism === 'HUMAN_AGENT_SESSION' && authorization.subject && (method === 'GET' || authorization.canMutate && isSameOriginAdminRequest(request)) ? authorization.subject : null;
}
function errorResponse(error: unknown) {
  if (error instanceof InvestmentBreakevenError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : 400, headers: HEADERS });
  return NextResponse.json({ error: 'Investment analysis is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}
export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try { return NextResponse.json({ analyses: await createInvestmentBreakevenService(prisma).listOwned(subject) }, { headers: HEADERS }); } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try { const body = await request.json() as Record<string, unknown>; if (body.action !== 'CREATE_SCENARIO') throw new InvestmentBreakevenError('INVALID_REQUEST', 'Unsupported investment action.'); const outcome = await createInvestmentBreakevenService(prisma).createScenario(subject, body.scenario); return NextResponse.json(outcome, { status: outcome.created ? 201 : 200, headers: HEADERS }); } catch (error) { return errorResponse(error); }
}
