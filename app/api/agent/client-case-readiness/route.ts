import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import { presentAgentReadinessResult, getAgentReadinessCapabilities } from '@/lib/clientCaseAgentReadinessPresentation';
import { ClientCaseCapabilityReadinessError, createClientCaseCapabilityReadinessService } from '@/lib/clientCaseCapabilityReadinessEvaluator';
import { ClientCaseEffectiveContextError } from '@/lib/clientCaseEffectiveContextResolver';
import { createClientCaseContextService, ClientCaseError } from '@/lib/clientCaseContextFoundation';
import { createClientCaseScenarioService, ClientCaseScenarioError } from '@/lib/clientCaseScenarioFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-case-readiness';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const auth = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return auth.authenticated && auth.identityType === 'HUMAN_AGENT' && auth.role === 'AGENT' && auth.mechanism === 'HUMAN_AGENT_SESSION' && auth.subject
    ? auth.subject
    : null;
}

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseCapabilityReadinessError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 400, headers: HEADERS });
  }
  if (error instanceof ClientCaseError || error instanceof ClientCaseScenarioError || error instanceof ClientCaseEffectiveContextError) {
    const code = 'code' in error ? error.code : 'NOT_FOUND';
    return NextResponse.json({ error: error.message, code }, { status: code === 'NOT_FOUND' || code === 'OWNERSHIP_DENIED' ? 404 : 503, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Client Case readiness is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseService = createClientCaseContextService(prisma);
    const clientCases = await clientCaseService.listOwned(subject, false);
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (!clientCaseId) return NextResponse.json({ clientCases, capabilities: getAgentReadinessCapabilities() }, { headers: HEADERS });
    const clientCase = await clientCaseService.detail(subject, clientCaseId);
    const scenarios = await createClientCaseScenarioService(prisma).list(subject, clientCaseId);
    return NextResponse.json({ clientCase, clientCases, scenarios, capabilities: getAgentReadinessCapabilities() }, { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const result = await createClientCaseCapabilityReadinessService(prisma).evaluate(subject, {
      clientCaseId: body.clientCaseId as string,
      capability: body.capability as never,
      ...(body.scenarioVersionId === undefined ? {} : { scenarioVersionId: body.scenarioVersionId as string }),
      ...(body.executionParameters === undefined ? {} : { executionParameters: body.executionParameters as never }),
    });
    return NextResponse.json(presentAgentReadinessResult(result), { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
