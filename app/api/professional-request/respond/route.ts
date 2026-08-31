import { NextRequest, NextResponse } from 'next/server';

import { createProfessionalExternalRequestService, EXTERNAL_REQUEST_SESSION_COOKIE, getExpiredExternalRequestSessionCookieOptions } from '@/lib/professionalExternalRequestFoundation';
import { ProfessionalExternalRequestError } from '@/lib/professionalExternalRequestProfileRegistry';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'Referrer-Policy': 'no-referrer' };

function sameOrigin(request: NextRequest) {
  return request.headers.get('origin') === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Request origin rejected.' }, { status: 403, headers: RESPONSE_HEADERS });
  try {
    const body = await request.json() as { csrfToken?: string; response?: unknown };
    const result = await createProfessionalExternalRequestService(prisma).externalResponse(request.cookies.get(EXTERNAL_REQUEST_SESSION_COOKIE)?.value, body.csrfToken, body.response);
    return NextResponse.json({ acceptedForAgentReview: true, created: result.created }, { status: result.created ? 201 : 200, headers: RESPONSE_HEADERS });
  } catch (error) {
    const status = error instanceof ProfessionalExternalRequestError && ['NOT_AUTHORIZED', 'SESSION_INVALID', 'CSRF_DENIED', 'REVOKED'].includes(error.code) ? 403 : error instanceof ProfessionalExternalRequestError && error.code === 'EXPIRED' ? 410 : 400;
    const response = NextResponse.json({ error: error instanceof Error ? error.message : 'The response could not be accepted.' }, { status, headers: RESPONSE_HEADERS });
    if (error instanceof ProfessionalExternalRequestError && ['SESSION_INVALID', 'REVOKED', 'EXPIRED'].includes(error.code)) response.cookies.set(EXTERNAL_REQUEST_SESSION_COOKIE, '', getExpiredExternalRequestSessionCookieOptions());
    return response;
  }
}
