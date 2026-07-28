import { NextRequest, NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionCookieValue,
  getAdminSessionCookieOptions,
  isSameOriginAdminRequest,
  sanitizeAdminReturnPath,
  validateAdminCredentialSubmission,
} from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Invalid administrative request.' }, { status: 403 });
  }

  const formData = await request.formData();
  const credentialField = formData.get('adminCredential');
  const nextField = formData.get('next');
  const credential = typeof credentialField === 'string' ? credentialField.trim() : '';
  const nextPath = sanitizeAdminReturnPath(typeof nextField === 'string' ? nextField : null);

  const valid = await validateAdminCredentialSubmission(credential);
  if (!valid) {
    const failureUrl = new URL('/admin/login', request.nextUrl.origin);
    failureUrl.searchParams.set('next', nextPath);
    failureUrl.searchParams.set('error', '1');
    return NextResponse.redirect(failureUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), { status: 303 });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionCookieValue(), getAdminSessionCookieOptions());
  return response;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/admin/login', request.nextUrl.origin), { status: 303 });
}
