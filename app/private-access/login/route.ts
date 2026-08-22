import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_SITE_ACCESS_COOKIE, createPrivateSiteAccessSessionValue, getPrivateSiteAccessConfiguration, getPrivateSiteAccessCookieOptions, isSameOriginPrivateAccessRequest, sanitizePrivateAccessReturnPath, validatePrivateSiteAccessSecret } from '@/lib/privateSiteAccess';

export const dynamic = 'force-dynamic';

function failureResponse(request: NextRequest, nextPath: string) {
  const url = new URL('/private-access', request.nextUrl.origin);
  url.searchParams.set('next', nextPath);
  url.searchParams.set('error', '1');
  const response = NextResponse.redirect(url, { status: 303 });
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginPrivateAccessRequest(request)) return NextResponse.json({ success: false, error: 'Access denied.' }, { status: 403 });
  if (Number(request.headers.get('content-length') || '0') > 4096) return failureResponse(request, '/');
  const formData = await request.formData();
  const nextPath = sanitizePrivateAccessReturnPath(typeof formData.get('next') === 'string' ? formData.get('next') as string : null);
  const candidate = typeof formData.get('privateAccessSecret') === 'string' ? formData.get('privateAccessSecret') as string : '';
  const configuration = getPrivateSiteAccessConfiguration();
  if (candidate.length > 512 || !(await validatePrivateSiteAccessSecret(candidate, configuration))) return failureResponse(request, nextPath);
  const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), { status: 303 });
  response.cookies.set(PRIVATE_SITE_ACCESS_COOKIE, await createPrivateSiteAccessSessionValue(configuration), getPrivateSiteAccessCookieOptions());
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/private-access', request.nextUrl.origin), { status: 303 });
}
