import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { createSellerFinancialScenarioService, SellerFinancialScenarioError, validateSellerFinancialScenarioRequest } from '@/lib/sellerFinancialEstimatedScenario';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/seller-financial';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return authorization.authenticated && authorization.identityType === 'HUMAN_AGENT' && authorization.role === 'AGENT' && authorization.mechanism === 'HUMAN_AGENT_SESSION' && authorization.subject && (method === 'GET' || authorization.canMutate && isSameOriginAdminRequest(request)) ? authorization.subject : null;
}
function errorResponse(error: unknown) {
  if (error instanceof SellerFinancialScenarioError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Seller financial scenario is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}
export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const [history, professionalInputs] = await Promise.all([
      createSellerFinancialScenarioService(prisma).listOwned(subject),
      prisma.professionalInput.findMany({ where: { ownerAgentSubject: subject, claimKind: 'PAYOFF_AMOUNT' }, include: { evidenceAdmission: { include: { supersededByAdmission: { select: { id: true } } } } }, orderBy: [{ versionOrdinal: 'desc' }] }),
    ]);
    return NextResponse.json({ history, professionalInputs }, { headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.action !== 'CREATE_SCENARIO') throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Unsupported seller financial action.');
    const result = await createSellerFinancialScenarioService(prisma).createScenario(subject, validateSellerFinancialScenarioRequest(body.scenario));
    return NextResponse.json(result, { status: result.created ? 201 : 200, headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}
