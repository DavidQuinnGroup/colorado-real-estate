import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import {
  CLIENT_CASE_INFORMATION_API_ROUTE,
  ClientCaseInformationError,
  createClientCaseInformationWorkflowService,
} from '@/lib/clientCaseInformationWorkflow';
import { ClientCaseError } from '@/lib/clientCaseContextFoundation';
import { ClientCaseContextRecordsError } from '@/lib/clientCaseContextRecordsFoundation';
import { ClientCaseCapabilityReadinessError } from '@/lib/clientCaseCapabilityReadinessEvaluator';
import { ClientCaseEffectiveContextError } from '@/lib/clientCaseEffectiveContextResolver';
import { ClientCasePropertyRelationshipError } from '@/lib/clientCasePropertyRelationshipRoles';
import { ClientInformationWaveAError, createClientInformationWaveAService } from '@/lib/clientInformationWaveAFoundation';
import { createAgentPropertyDiscoveryService } from '@/lib/agentPropertyDiscovery';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: CLIENT_CASE_INFORMATION_API_ROUTE, method });
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
  if (error instanceof ClientCaseInformationError || error instanceof ClientCaseContextRecordsError || error instanceof ClientCaseError || error instanceof ClientCaseEffectiveContextError || error instanceof ClientCaseCapabilityReadinessError || error instanceof ClientInformationWaveAError || error instanceof ClientCasePropertyRelationshipError) {
    const code = 'code' in error ? error.code : 'PERSISTENCE_UNAVAILABLE';
    const status = code === 'NOT_FOUND' ? 404 : code === 'OWNERSHIP_DENIED' ? 403 : code === 'CONFLICT' ? 409 : code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Client Case information is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (!clientCaseId) throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCaseId is required.');
    return NextResponse.json(await createClientCaseInformationWorkflowService(prisma).load(subject, clientCaseId), { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    if (typeof body.clientCaseId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCaseId is required.');
    const workflow = createClientCaseInformationWorkflowService(prisma);
    const waveA = createClientInformationWaveAService(prisma);
    if (body.action === 'SAVE_CANONICAL_INFORMATION') return NextResponse.json(await workflow.save(subject, body.clientCaseId, body.input), { headers: HEADERS });
    if (body.action === 'ATTACH_DISCOVERED_PROPERTY') {
      const input = body.input && typeof body.input === 'object' && !Array.isArray(body.input) ? body.input as Record<string, unknown> : {};
      const resultToken = typeof input.discoveryResultToken === 'string' ? input.discoveryResultToken : '';
      const canonicalPropertyId = await createAgentPropertyDiscoveryService(prisma).canonicalPropertyIdForResultToken(subject, body.clientCaseId, resultToken);
      if (!canonicalPropertyId) throw new ClientCaseInformationError('INVALID_REQUEST', 'Property is no longer available for attachment.');
      return NextResponse.json(await workflow.attachExistingProperty(subject, body.clientCaseId, { canonicalPropertyId, roles: input.roles }), { headers: HEADERS });
    }
    if (body.action === 'ADD_PROPERTY_RELATIONSHIP_ROLE') {
      if (typeof body.clientCasePropertyId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCasePropertyId is required.');
      return NextResponse.json(await workflow.addRelationshipRole(subject, body.clientCaseId, body.clientCasePropertyId, body.input), { headers: HEADERS });
    }
    if (body.action === 'END_PROPERTY_RELATIONSHIP_ROLE') {
      if (typeof body.relationshipRoleId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'relationshipRoleId is required.');
      return NextResponse.json(await workflow.endRelationshipRole(subject, body.clientCaseId, body.relationshipRoleId), { headers: HEADERS });
    }
    if (body.action === 'CREATE_CONTACT_PARTICIPATION') return NextResponse.json({ result: await waveA.createContactAndParticipation(subject, body.clientCaseId, body.input), workspace: await createClientCaseInformationWorkflowService(prisma).load(subject, body.clientCaseId) }, { headers: HEADERS });
    if (body.action === 'LINK_CONTACT') return NextResponse.json({ result: await waveA.linkContact(subject, body.clientCaseId, body.input), workspace: await createClientCaseInformationWorkflowService(prisma).load(subject, body.clientCaseId) }, { headers: HEADERS });
    if (body.action === 'UPDATE_CONTACT') {
      if (typeof body.contactId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'contactId is required.');
      return NextResponse.json({ result: await waveA.updateContact(subject, body.contactId, body.input), workspace: await createClientCaseInformationWorkflowService(prisma).load(subject, body.clientCaseId) }, { headers: HEADERS });
    }
    if (body.action === 'UPDATE_PARTICIPATION') {
      if (typeof body.clientCasePartyId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCasePartyId is required.');
      return NextResponse.json({ result: await waveA.updateParticipation(subject, body.clientCaseId, body.clientCasePartyId, body.input), workspace: await createClientCaseInformationWorkflowService(prisma).load(subject, body.clientCaseId) }, { headers: HEADERS });
    }
    if (body.action === 'END_PARTICIPATION') {
      if (typeof body.clientCasePartyId !== 'string') throw new ClientCaseInformationError('INVALID_REQUEST', 'clientCasePartyId is required.');
      return NextResponse.json({ result: await waveA.endParticipation(subject, body.clientCaseId, body.clientCasePartyId), workspace: await createClientCaseInformationWorkflowService(prisma).load(subject, body.clientCaseId) }, { headers: HEADERS });
    }
    if (body.action === 'DUPLICATE_CANDIDATES') return NextResponse.json({ candidates: await waveA.duplicateCandidates(subject, body.input) }, { headers: HEADERS });
    throw new ClientCaseInformationError('INVALID_REQUEST', 'Unsupported Client Case information action.');
  } catch (error) {
    return errorResponse(error);
  }
}
