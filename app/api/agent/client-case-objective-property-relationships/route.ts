import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientCaseObjectivePropertyRelationshipError, createClientCaseObjectivePropertyRelationshipService } from '@/lib/clientCaseObjectivePropertyRelationships';
import { presentObjectivePropertyRelationship } from '@/lib/clientCaseObjectivePropertyRelationshipPresentation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/client-case-objective-property-relationships' as const;
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

function identifier(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function record(value: unknown, field = 'request') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', `${field} must be an object.`);
  }
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', 'Relationship request contains unsupported fields.');
  }
}

function errorResponse(error: unknown) {
  if (error instanceof ClientCaseObjectivePropertyRelationshipError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Objective-Property relationships are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });

  try {
    const clientCaseId = identifier(request.nextUrl.searchParams.get('clientCaseId'), 'clientCaseId');
    const view = request.nextUrl.searchParams.get('view') || 'active';
    const service = createClientCaseObjectivePropertyRelationshipService(prisma);
    const relationships = view === 'active'
      ? await service.listByClientCase(subject, clientCaseId, { status: 'ACTIVE', take: 100 })
      : view === 'history'
        ? await service.listByObjective(subject, clientCaseId, identifier(request.nextUrl.searchParams.get('objectiveId'), 'objectiveId'), { status: 'ENDED', take: 100 })
        : view === 'property'
          ? await service.listByClientCaseProperty(subject, clientCaseId, identifier(request.nextUrl.searchParams.get('clientCasePropertyId'), 'clientCasePropertyId'), { status: 'ACTIVE', take: 100 })
          : (() => { throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', 'Relationship view is invalid.'); })();
    return NextResponse.json({ clientCaseId, relationships: relationships.map(presentObjectivePropertyRelationship) }, { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });

  try {
    const body = record(await request.json());
    exactKeys(body, ['action', 'clientCaseId', 'input']);
    const clientCaseId = identifier(body.clientCaseId, 'clientCaseId');
    const service = createClientCaseObjectivePropertyRelationshipService(prisma);
    if (body.action === 'LINK') {
      const relationship = await service.link(subject, clientCaseId, body.input);
      return NextResponse.json({ relationship: presentObjectivePropertyRelationship(relationship) }, { headers: HEADERS });
    }
    if (body.action === 'END') {
      const input = record(body.input, 'input');
      exactKeys(input, ['relationshipId']);
      const relationship = await service.end(subject, clientCaseId, identifier(input.relationshipId, 'relationshipId'));
      return NextResponse.json({ relationship: presentObjectivePropertyRelationship(relationship) }, { headers: HEADERS });
    }
    throw new ClientCaseObjectivePropertyRelationshipError('INVALID_REQUEST', 'Relationship action is unsupported.');
  } catch (error) {
    return errorResponse(error);
  }
}
