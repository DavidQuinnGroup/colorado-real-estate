import { NextResponse } from 'next/server';

const PUBLIC_HOME_PATH = '/';

export function createProjectAtlasExternalUnavailableResponse({ title, message, status }: { title: string; message: string; status: number }) {
  const response = new NextResponse(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>${title}</title></head><body><main><p>David Quinn Group</p><h1>${title}</h1><p>${message}</p><p><a href="${PUBLIC_HOME_PATH}">Return to David Quinn Group</a></p></main></body></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}
