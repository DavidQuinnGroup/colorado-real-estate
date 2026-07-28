import { NextRequest, NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  getExpiredAdminSessionCookieOptions,
  sanitizeAdminReturnPath,
} from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const nextPath = sanitizeAdminReturnPath(request.nextUrl.searchParams.get('next') || '/admin/login');
  const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), { status: 303 });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', getExpiredAdminSessionCookieOptions());
  return response;
}

export function POST(request: NextRequest) {
  return GET(request);
}
