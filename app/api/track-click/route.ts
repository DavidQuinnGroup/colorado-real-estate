import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { updateUserPreferences } from '@/lib/preferences/updateUserPreferences';

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

async function getTrackableUser(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      isUnsubscribed: true,
    },
  });
}

function markAlertClick(userId: string, listingId: string, clickedAt: Date) {
  return prisma.alertQueue.updateMany({
    where: {
      userId,
      status: {
        in: ['sent', 'pending', 'processing'],
      },
      clickedAt: null,
      OR: [
        { payload: { path: ['propertyId'], equals: listingId } },
        { payload: { path: ['id'], equals: listingId } },
        { payload: { path: ['mlsId'], equals: listingId } },
        { payload: { path: ['listingId'], equals: listingId } },
        { payload: { path: ['slug'], equals: listingId } },
      ],
    },
    data: {
      clickedAt,
    },
  });
}

async function trackClick(userId: string, listingId: string, source: string, destination: string) {
  const user = await getTrackableUser(userId);

  if (!user || user.isUnsubscribed) {
    return {
      tracked: false,
      reason: !user ? 'User not found.' : 'User is unsubscribed.',
    };
  }

  const trackedAt = new Date();

  await prisma.$transaction([
    prisma.userInteraction.create({
      data: {
        userId,
        type: 'LISTING_CLICK',
        metadata: {
          listingId,
          source,
          destination,
          trackedAt: trackedAt.toISOString(),
        },
      },
    }),
    markAlertClick(userId, listingId, trackedAt),
    prisma.user.update({
      where: { id: userId },
      data: {
        heatScore: { increment: 5 },
      },
    }),
  ]);

  updateUserPreferences(userId).catch((error) => {
    console.error('[REIE CRM] Preference update failed:', error);
  });

  return {
    tracked: true,
    reason: '',
  };
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
    }
  } catch (error) {
    console.error('[REIE CRM] Track click error:', error);
  }

  return withNoStore(NextResponse.redirect(redirectUrl));
}

// app/api/track-click/route.ts
