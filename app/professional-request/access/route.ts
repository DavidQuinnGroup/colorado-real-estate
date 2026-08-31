import { NextRequest, NextResponse } from 'next/server';

import { createProfessionalExternalRequestService, getExternalRequestSessionCookieOptions } from '@/lib/professionalExternalRequestFoundation';
import { ProfessionalExternalRequestError } from '@/lib/professionalExternalRequestProfileRegistry';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const RESPONSE_PATH = '/professional-request/respond';

function bootstrapResponse(cookieValue: string) {
  const response = new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${RESPONSE_PATH}"><title>Opening secure request</title></head><body><p>Opening secure request...</p><p><a href="${RESPONSE_PATH}">Continue</a></p></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  response.cookies.set('project_atlas_external_request_session', cookieValue, getExternalRequestSessionCookieOptions());
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  try {
    const exchange = await createProfessionalExternalRequestService(prisma).bootstrap(token);
    return bootstrapResponse(exchange.cookieValue);
  } catch (error) {
    const status = error instanceof ProfessionalExternalRequestError && error.code === 'EXPIRED' ? 410 : error instanceof ProfessionalExternalRequestError && error.code === 'REVOKED' ? 403 : 404;
    return new NextResponse('This request link is unavailable.', { status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  }
}
