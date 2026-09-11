import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  createMultiPropertyFinancialScenarioService,
  MULTI_PROPERTY_FINANCIAL_SCENARIO_API_ROUTE,
  MultiPropertyFinancialScenarioError,
} from '@/lib/multiPropertyFinancialScenarioFoundation';
import { createOutputPersistenceService, OutputPersistenceError } from '@/lib/outputPersistenceFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

function errorResponse(error: unknown) {
  if (error instanceof MultiPropertyFinancialScenarioError || error instanceof OutputPersistenceError) {
    const status = error.code === 'OWNERSHIP_DENIED' ? 403 : error.code === 'NOT_FOUND' ? 404 : error.code === 'PERSISTENCE_CONFLICT' ? 409 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  return NextResponse.json({ error: 'Multi-property financial scenarios are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

async function authorizeAgent(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: MULTI_PROPERTY_FINANCIAL_SCENARIO_API_ROUTE, method });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.mechanism !== 'HUMAN_AGENT_SESSION' || !authorization.subject || (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))) return null;
  return authorization;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAgent(request, 'GET');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const ownerAgentSubject = authorization.subject!;
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    const scenarios = await createMultiPropertyFinancialScenarioService(prisma).listOwned(ownerAgentSubject, clientCaseId);
    return NextResponse.json({ scenarios }, { headers: RESPONSE_HEADERS });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAgent(request, 'POST');
  if (!authorization) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const ownerAgentSubject = authorization.subject!;
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body) || typeof (body as { action?: unknown }).action !== 'string') throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'A scenario action is required.');
    const action = (body as { action: string }).action;
    const service = createMultiPropertyFinancialScenarioService(prisma);
    if (action === 'CREATE_SCENARIO') {
      const outcome = await service.createScenario(ownerAgentSubject, (body as { input?: unknown }).input);
      return NextResponse.json({ scenario: outcome.scenario, version: outcome.version, created: outcome.created }, { status: outcome.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (action === 'CREATE_REVISION') {
      const predecessorVersionId = (body as { predecessorVersionId?: unknown }).predecessorVersionId;
      if (typeof predecessorVersionId !== 'string') throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'predecessorVersionId is required.');
      const outcome = await service.createRevision(ownerAgentSubject, predecessorVersionId, (body as { input?: unknown }).input);
      return NextResponse.json({ version: outcome.version, created: outcome.created }, { status: outcome.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (action === 'ANALYZE_VERSION') {
      const versionId = (body as { versionId?: unknown }).versionId;
      if (typeof versionId !== 'string') throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'versionId is required.');
      const outcome = await service.analyzeVersion(ownerAgentSubject, versionId);
      return NextResponse.json({ result: outcome.result, created: outcome.created }, { status: outcome.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    if (action === 'COMPARE_VERSIONS') {
      const versionIds = (body as { versionIds?: unknown }).versionIds;
      if (!Array.isArray(versionIds) || versionIds.some((value) => typeof value !== 'string')) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'versionIds are required.');
      return NextResponse.json({ comparison: await service.compareVersions(ownerAgentSubject, versionIds) }, { headers: RESPONSE_HEADERS });
    }
    if (action === 'CREATE_OUTPUT_DRAFT') {
      const versionId = (body as { versionId?: unknown }).versionId;
      if (typeof versionId !== 'string') throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'versionId is required.');
      const output = await createOutputPersistenceService(prisma).createMultiPropertyFinancialScenarioOutputDraft(ownerAgentSubject, versionId);
      return NextResponse.json({ output }, { status: output.created ? 201 : 200, headers: RESPONSE_HEADERS });
    }
    throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'The scenario action is unsupported.');
  } catch (error) { return errorResponse(error); }
}
