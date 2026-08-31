import { NextRequest, NextResponse } from 'next/server';

import { createProfessionalExternalRequestService, getExternalRequestSessionCookieOptions } from '@/lib/professionalExternalRequestFoundation';
import { ProfessionalExternalRequestError } from '@/lib/professionalExternalRequestProfileRegistry';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  try {
    const exchange = await createProfessionalExternalRequestService(prisma).bootstrap(token);
    const response = NextResponse.redirect(new URL('/professional-request/respond', request.url), 303);
    response.cookies.set('project_atlas_external_request_session', exchange.cookieValue, getExternalRequestSessionCookieOptions());
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  } catch (error) {
    const status = error instanceof ProfessionalExternalRequestError && error.code === 'EXPIRED' ? 410 : error instanceof ProfessionalExternalRequestError && error.code === 'REVOKED' ? 403 : 404;
    return new NextResponse('This request link is unavailable.', { status, headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  }
}
