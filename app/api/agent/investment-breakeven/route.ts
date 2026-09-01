import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { createInvestmentBreakevenService, InvestmentBreakevenError } from '@/lib/investmentBreakevenAnalysis';
import { buildInvestmentBreakevenOutputFixture, InvestmentBreakevenOutputError } from '@/lib/investmentBreakevenOutputPersistence';
import { createOutputPersistenceService, OutputPersistenceError } from '@/lib/outputPersistenceFoundation';
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
  if (error instanceof InvestmentBreakevenOutputError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : 400, headers: HEADERS });
  if (error instanceof OutputPersistenceError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'PERSISTENCE_CONFLICT' ? 409 : 400, headers: HEADERS });
  return NextResponse.json({ error: 'Investment analysis is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}
export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const [analyses, outputs] = await Promise.all([
      createInvestmentBreakevenService(prisma).listOwned(subject),
      createOutputPersistenceService(prisma).listOwnedOutputHistory(subject),
    ]);
    return NextResponse.json({ analyses, outputs }, { headers: HEADERS });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createInvestmentBreakevenService(prisma);
    if (body.action === 'CREATE_SCENARIO') {
      const outcome = await service.createScenario(subject, body.scenario);
      return NextResponse.json(outcome, { status: outcome.created ? 201 : 200, headers: HEADERS });
    }
    if (body.action === 'CLONE_SCENARIO') {
      const outcome = await service.cloneScenario(subject, body.clone);
      return NextResponse.json(outcome, { status: outcome.created ? 201 : 200, headers: HEADERS });
    }
    if (body.action === 'REVIEW_SCENARIO') {
      if (typeof body.scenarioId !== 'string') throw new InvestmentBreakevenError('INVALID_REQUEST', 'scenarioId is required.');
      return NextResponse.json(await service.reviewScenario(subject, body.scenarioId), { headers: HEADERS });
    }
    if (body.action === 'CALCULATE_SENSITIVITY') {
      if (typeof body.scenarioId !== 'string' || typeof body.rentDeltaCents !== 'number') throw new InvestmentBreakevenError('INVALID_REQUEST', 'scenarioId and rentDeltaCents are required.');
      return NextResponse.json(await service.calculateSensitivity(subject, body.scenarioId, body.rentDeltaCents), { headers: HEADERS });
    }
    if (body.action === 'PERSIST_REVIEWED_OUTPUT') {
      if (typeof body.analysisId !== 'string' || !Array.isArray(body.scenarioIds) || body.scenarioIds.some((id) => typeof id !== 'string')) {
        throw new InvestmentBreakevenError('INVALID_REQUEST', 'analysisId and scenarioIds are required.');
      }
      const fixture = await buildInvestmentBreakevenOutputFixture(prisma, subject, { analysisId: body.analysisId, scenarioIds: body.scenarioIds as string[] });
      const output = await createOutputPersistenceService(prisma).persistReviewedFixture(subject, fixture, 'Investment breakeven comparison reviewed in Agent workspace.');
      return NextResponse.json({ output }, { status: output.created ? 201 : 200, headers: HEADERS });
    }
    throw new InvestmentBreakevenError('INVALID_REQUEST', 'Unsupported investment action.');
  } catch (error) { return errorResponse(error); }
}
