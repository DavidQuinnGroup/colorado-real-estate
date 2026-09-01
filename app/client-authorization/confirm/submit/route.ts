import { NextRequest, NextResponse } from 'next/server';

import { CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE, createClientAuthorizationSecureConfirmationService, getExpiredClientAuthorizationSessionCookieOptions } from '@/lib/clientAuthorizationSecureConfirmation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie', 'Referrer-Policy': 'no-referrer', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Request origin rejected.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as { csrfToken?: string; decision?: unknown };
    const result = await createClientAuthorizationSecureConfirmationService(prisma).decide(request.cookies.get(CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE)?.value, body.csrfToken, body.decision);
    return NextResponse.json({ decision: result.evidence.decision, decidedAt: result.evidence.decidedAt, created: result.created }, { status: result.created ? 201 : 200, headers: HEADERS });
  } catch {
    const response = NextResponse.json({ error: 'This confirmation is unavailable.' }, { status: 403, headers: HEADERS });
    response.cookies.set(CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE, '', getExpiredClientAuthorizationSessionCookieOptions());
    return response;
  }
}
