import { NextRequest, NextResponse } from 'next/server';

import { AGENT_SESSION_COOKIE, getExpiredAgentSessionCookieOptions, sanitizeAgentReturnPath } from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL(sanitizeAgentReturnPath(request.nextUrl.searchParams.get('next')), request.nextUrl.origin), { status: 303 });
  response.cookies.set(AGENT_SESSION_COOKIE, '', getExpiredAgentSessionCookieOptions());
  return response;
}

export function POST(request: NextRequest) {
  return GET(request);
}
