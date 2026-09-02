import { NextResponse } from 'next/server';

import { getExternalRequestSessionCookieOptions } from './professionalExternalRequestFoundation';

const RESPONSE_PATH = '/professional-request/respond';

export function createProfessionalExternalRequestBootstrapResponse(cookieValue: string) {
  const response = new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${RESPONSE_PATH}"><title>Opening secure request</title></head><body><main><p>David Quinn Group</p><p>Opening secure request...</p><p><a href="${RESPONSE_PATH}">Continue</a></p><p><a href="/">Return to David Quinn Group</a></p></main></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  response.cookies.set('project_atlas_external_request_session', cookieValue, getExternalRequestSessionCookieOptions());
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
