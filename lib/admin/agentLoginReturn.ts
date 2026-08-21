import { NextResponse } from 'next/server';

import {
  AGENT_SESSION_COOKIE,
  createAgentSessionCookieValue,
  getAgentSessionCookieOptions,
  sanitizeAgentReturnPath,
} from './adminAuth';

export async function createAgentLoginSuccessResponse(origin: string, next: string | null) {
  const response = NextResponse.redirect(new URL(sanitizeAgentReturnPath(next), origin), { status: 303 });
  response.cookies.set(AGENT_SESSION_COOKIE, await createAgentSessionCookieValue(), getAgentSessionCookieOptions());
  return response;
}
