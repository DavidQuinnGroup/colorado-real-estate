import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_SITE_ACCESS_COOKIE, getExpiredPrivateSiteAccessCookieOptions } from '@/lib/privateSiteAccess';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/private-access', request.nextUrl.origin), { status: 303 });
  response.cookies.set(PRIVATE_SITE_ACCESS_COOKIE, '', getExpiredPrivateSiteAccessCookieOptions());
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
