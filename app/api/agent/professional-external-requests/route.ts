import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { assertProfessionalExternalRequestDeliveryAuthorized, sendProfessionalExternalRequestEmail, PROFESSIONAL_EXTERNAL_REQUEST_DELIVERY_GATE } from '@/lib/email/sendProfessionalExternalRequest';
import { createProfessionalExternalRequestService } from '@/lib/professionalExternalRequestFoundation';
import { ProfessionalExternalRequestError } from '@/lib/professionalExternalRequestProfileRegistry';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const ROUTE = '/api/agent/professional-external-requests';
const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.mechanism !== 'HUMAN_AGENT_SESSION' || !authorization.subject || (method === 'POST' && (!authorization.canMutate || !isSameOriginAdminRequest(request)))) return null;
  return authorization.subject;
}

function errorResponse(error: unknown) {
  if (error instanceof ProfessionalExternalRequestError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'NOT_AUTHORIZED' || error.code === 'SESSION_INVALID' ? 403 : error.code === 'DELIVERY_AUTHORIZATION_REQUIRED' ? 409 : error.code === 'PERSISTENCE_UNAVAILABLE' ? 503 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: RESPONSE_HEADERS });
  }
  if (error instanceof Error && error.message === PROFESSIONAL_EXTERNAL_REQUEST_DELIVERY_GATE) return NextResponse.json({ error: error.message, code: 'DELIVERY_AUTHORIZATION_REQUIRED' }, { status: 409, headers: RESPONSE_HEADERS });
  return NextResponse.json({ error: 'Professional external requests are unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: RESPONSE_HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    return NextResponse.json({ deliveries: await createProfessionalExternalRequestService(prisma).listOwned(subject) }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>;
    const service = createProfessionalExternalRequestService(prisma);
    if (body.action === 'PREPARE') return NextResponse.json(await service.prepare(subject, body.draft), { status: 201, headers: RESPONSE_HEADERS });
    if (body.action === 'PREPARE_SUCCESSOR') {
      if (typeof body.supersedesRequestId !== 'string') throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'supersedesRequestId is required.');
      return NextResponse.json(await service.prepare(subject, body.draft, body.supersedesRequestId), { status: 201, headers: RESPONSE_HEADERS });
    }
    if (body.action === 'REVOKE') {
      if (typeof body.deliveryId !== 'string') throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'deliveryId is required.');
      return NextResponse.json({ delivery: await service.revoke(subject, body.deliveryId) }, { headers: RESPONSE_HEADERS });
    }
    if (body.action === 'VERIFY_IDENTITY') {
      if (typeof body.deliveryId !== 'string' || typeof body.dimension !== 'string') throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'deliveryId and dimension are required.');
      return NextResponse.json({ verification: await service.verifyIdentity(subject, body.deliveryId, body.dimension, typeof body.assertedValue === 'string' ? body.assertedValue : null) }, { status: 201, headers: RESPONSE_HEADERS });
    }
    if (body.action === 'SEND') {
      if (typeof body.deliveryId !== 'string') throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'deliveryId is required.');
      assertProfessionalExternalRequestDeliveryAuthorized();
      const activated = await service.activateForDelivery(subject, body.deliveryId);
      const snapshot = await prisma.externalRequestDisclosureSnapshot.findUnique({ where: { deliveryId: body.deliveryId } });
      const disclosure = snapshot?.disclosure as { property?: { label?: string } } | null;
      const provider = await sendProfessionalExternalRequestEmail({ recipientEmail: activated.delivery.recipientEmail, recipientDisplayName: activated.delivery.recipientDisplayName, propertyLabel: disclosure?.property?.label || 'the identified property', capability: activated.capabilityPlaintext, deliveryFingerprint: activated.delivery.requestFingerprint });
      return NextResponse.json({ delivery: await service.markDeliverySent(subject, body.deliveryId, provider.providerMessageId) }, { headers: RESPONSE_HEADERS });
    }
    throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'Unsupported external request action.');
  } catch (error) {
    return errorResponse(error);
  }
}
