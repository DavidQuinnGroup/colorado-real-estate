import { NextRequest, NextResponse } from 'next/server';

import { createClientAuthorizationSecureConfirmationService, getClientAuthorizationSessionCookieOptions } from '@/lib/clientAuthorizationSecureConfirmation';
import { createProjectAtlasExternalUnavailableResponse } from '@/lib/projectAtlasExternalNavigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  try {
    const exchange = await createClientAuthorizationSecureConfirmationService(prisma).bootstrap(token);
    const response = NextResponse.redirect(new URL('/client-authorization/confirm', request.url), { status: 303 });
    response.cookies.set('project_atlas_client_authorization_session', exchange.cookieValue, getClientAuthorizationSessionCookieOptions());
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return response;
  } catch {
    return createProjectAtlasExternalUnavailableResponse({ title: 'Confirmation unavailable', message: 'This secure confirmation link is unavailable or has expired.', status: 404 });
  }
}
