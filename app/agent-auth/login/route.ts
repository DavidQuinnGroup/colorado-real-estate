import { NextRequest, NextResponse } from 'next/server';

import {
  AGENT_SESSION_COOKIE,
  createAgentSessionCookieValue,
  getAgentSessionCookieOptions,
  isSameOriginAdminRequest,
  sanitizeAgentReturnPath,
  validateAgentCredentialSubmission,
} from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return NextResponse.json({ success: false, error: 'Invalid internal request.' }, { status: 403 });
  const formData = await request.formData();
  const credentialField = formData.get('agentCredential');
  const nextPath = sanitizeAgentReturnPath(typeof formData.get('next') === 'string' ? formData.get('next') as string : null);
  const credential = typeof credentialField === 'string' ? credentialField.trim() : '';
  if (!(await validateAgentCredentialSubmission(credential))) {
    const failureUrl = new URL('/agent/login', request.nextUrl.origin);
    failureUrl.searchParams.set('next', nextPath);
    failureUrl.searchParams.set('error', '1');
    return NextResponse.redirect(failureUrl, { status: 303 });
  }
  const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), { status: 303 });
  response.cookies.set(AGENT_SESSION_COOKIE, await createAgentSessionCookieValue(), getAgentSessionCookieOptions());
  return response;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/agent/login', request.nextUrl.origin), { status: 303 });
}
