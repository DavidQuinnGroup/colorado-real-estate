import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  ClientCaseScenarioFinancialContextTransportError,
  createClientCaseScenarioFinancialContextTransportService,
} from '@/lib/clientCaseScenarioFinancialContextTransport';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-case-scenario-financial-context';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'The request must be an object.');
  return value as Record<string, unknown>;
}

function requiredText(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', `${field} is required.`);
  return value.trim();
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'The request contains unsupported fields.');
}

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

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseScenarioFinancialContextTransportError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' || error.code === 'REVIEW_REQUIRED' ? 409 : 400;
    return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Scenario Financial Context is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = requiredText(request.nextUrl.searchParams.get('clientCaseId'), 'clientCaseId');
    const scenarioId = requiredText(request.nextUrl.searchParams.get('scenarioId'), 'scenarioId');
    const view = request.nextUrl.searchParams.get('view') ?? 'working';
    const service = createClientCaseScenarioFinancialContextTransportService(prisma);
    if (view === 'working') return NextResponse.json(await service.readWorkingContext(subject, clientCaseId, scenarioId), { headers: HEADERS });
    const scenarioVersionId = requiredText(request.nextUrl.searchParams.get('scenarioVersionId'), 'scenarioVersionId');
    if (view === 'fixed') return NextResponse.json(await service.readFixedContext(subject, clientCaseId, scenarioId, scenarioVersionId), { headers: HEADERS });
    if (view === 'comparison') return NextResponse.json(await service.compareToCurrent(subject, clientCaseId, scenarioId, scenarioVersionId), { headers: HEADERS });
    throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'Unsupported Scenario Financial Context view.');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = object(await request.json());
    exactKeys(body, ['clientCaseId', 'scenarioId', 'action', 'input']);
    const clientCaseId = requiredText(body.clientCaseId, 'clientCaseId');
    const scenarioId = requiredText(body.scenarioId, 'scenarioId');
    const action = requiredText(body.action, 'action');
    const input = body.input ?? {};
    const service = createClientCaseScenarioFinancialContextTransportService(prisma);
    if (action === 'SELECT' || action === 'DESELECT' || action === 'REVIEW' || action === 'CLEAR_ALL') {
      return NextResponse.json(await service.mutateDraft(subject, clientCaseId, scenarioId, action, input), { headers: HEADERS });
    }
    if (action === 'REVIEW_CREATE_ANALYSIS_VERSION') {
      return NextResponse.json(await service.reviewCreateAnalysisVersion(subject, clientCaseId, scenarioId, input), { headers: HEADERS });
    }
    if (action === 'CREATE_ANALYSIS_VERSION') {
      return NextResponse.json(await service.createAnalysisVersion(subject, clientCaseId, scenarioId, input), { headers: HEADERS });
    }
    throw new ClientCaseScenarioFinancialContextTransportError('INVALID_REQUEST', 'Unsupported Scenario Financial Context action.');
  } catch (error) {
    return errorResponse(error);
  }
}
