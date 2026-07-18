import { NextRequest, NextResponse } from 'next/server';

import { updateUserPreferences } from '@/lib/preferences/updateUserPreferences';
import { trackClick } from '@/lib/tracking/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MAX_ID_LENGTH = 160;
const MAX_SOURCE_LENGTH = 48;
const MAX_DESTINATION_LENGTH = 2048;

function withNoStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

function normalizeParam(searchParams: URLSearchParams, key: string, maxLength: number) {
  const value = searchParams.get(key)?.trim();
  if (!value) return null;

  return value.slice(0, maxLength);
}

function getSafeSource(searchParams: URLSearchParams) {
  const source = normalizeParam(searchParams, 'src', MAX_SOURCE_LENGTH) || 'organic';
  return source.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, MAX_SOURCE_LENGTH) || 'organic';
}

function isAllowedDestination(url: URL, req: NextRequest) {
  const allowedHosts = new Set([
    req.nextUrl.hostname,
    'davidquinngroup.com',
    'www.davidquinngroup.com',
    'localhost',
    '127.0.0.1',
    '::1',
  ]);

  return ['http:', 'https:'].includes(url.protocol) && allowedHosts.has(url.hostname);
}

function buildFallbackRedirectUrl(req: NextRequest, listingId: string | null) {
  const redirectUrl = new URL('/search', req.url);

  if (listingId) {
    redirectUrl.searchParams.set('selected', listingId);
  }

  return redirectUrl;
}

function buildRedirectUrl(req: NextRequest, listingId: string | null) {
  const rawDestination = normalizeParam(req.nextUrl.searchParams, 'to', MAX_DESTINATION_LENGTH);

  if (!rawDestination) return buildFallbackRedirectUrl(req, listingId);

  try {
    const destinationUrl = new URL(rawDestination, req.url);
    if (isAllowedDestination(destinationUrl, req)) return destinationUrl;
  } catch {
    return buildFallbackRedirectUrl(req, listingId);
  }

  return buildFallbackRedirectUrl(req, listingId);
}

async function updatePreferences(userId: string) {
  updateUserPreferences(userId).catch((error) => {
    console.error('[REIE CRM] Preference update failed:', error);
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const listingId = normalizeParam(searchParams, 'l', MAX_ID_LENGTH);
  const userId = normalizeParam(searchParams, 'u', MAX_ID_LENGTH);
  const source = getSafeSource(searchParams);
  const redirectUrl = buildRedirectUrl(req, listingId);

  if (!listingId || !userId) {
    return withNoStore(NextResponse.redirect(redirectUrl));
  }

  try {
    const result = await trackClick(userId, listingId, source, redirectUrl.toString());

    if (!result.tracked) {
      console.info('[REIE CRM] Click redirect without tracking:', result.reason);
    } else {
      await updatePreferences(userId);
    }
  } catch (error) {
    console.error('[REIE CRM] Track click error:', error);
  }

  return withNoStore(NextResponse.redirect(redirectUrl));
}

// app/api/track-click/route.ts
