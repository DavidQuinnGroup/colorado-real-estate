import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientCaseScenarioError, createClientCaseScenarioService } from '@/lib/clientCaseScenarioFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-case-scenarios';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return authorization.authenticated
    && authorization.identityType === 'HUMAN_AGENT'
    && authorization.role === 'AGENT'
    && authorization.mechanism === 'HUMAN_AGENT_SESSION'
    && authorization.subject
    && (method === 'GET' || (authorization.canMutate && isSameOriginAdminRequest(request)))
    ? authorization.subject
    : null;
}

function requiredText(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) throw new ClientCaseScenarioError('INVALID_REQUEST', `${field} is required.`);
  return value.trim();
}

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseScenarioError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Scenarios are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = requiredText(request.nextUrl.searchParams.get('clientCaseId'), 'clientCaseId');
    const scenarioId = request.nextUrl.searchParams.get('scenarioId');
    const service = createClientCaseScenarioService(prisma);
    if (!scenarioId) return NextResponse.json({ scenarios: await service.list(subject, clientCaseId) }, { headers: HEADERS });
    const [scenario, versions] = await Promise.all([
      service.get(subject, clientCaseId, scenarioId),
      service.history(subject, clientCaseId, scenarioId),
    ]);
    return NextResponse.json({ scenario, versions }, { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.action !== 'CREATE') throw new ClientCaseScenarioError('INVALID_REQUEST', 'Unsupported Scenario action.');
    const clientCaseId = requiredText(body.clientCaseId, 'clientCaseId');
    const scenario = await createClientCaseScenarioService(prisma).create(subject, clientCaseId, body.input);
    return NextResponse.json({ scenario }, { status: 201, headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
