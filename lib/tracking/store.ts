import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { prisma } from '../prisma.js';

export type TrackingStoreDependencies = {
  prismaClient?: TrackingPrismaClient;
  supabaseClient?: SupabaseClient;
  supabaseAlertPageSize?: number;
  supabaseAlertMaxPages?: number;
};

type TrackingPrismaClient = {
  user: {
    findUnique: (args: unknown) => Promise<{ id: string; isUnsubscribed: boolean; heatScore?: number | null } | null>;
    update: (args: unknown) => Promise<unknown>;
  };
  userInteraction: {
    create: (args: unknown) => Promise<unknown>;
  };
  alertQueue: {
    updateMany: (args: unknown) => Promise<{ count: number }>;
  };
  $transaction: (actions: Promise<unknown>[]) => Promise<unknown[]>;
};

type TrackClickResult = {
  tracked: boolean;
  reason: string;
};

type AlertQueueRow = {
  id: string;
  payload: unknown;
};

type UserRow = {
  id: string;
  isUnsubscribed: boolean;
  heatScore: number | null;
};

let cachedClient: SupabaseClient | null = null;
const DEFAULT_ALERT_PAGE_SIZE = 100;
const DEFAULT_ALERT_MAX_PAGES = 20;

function getSupabaseTrackingClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase tracking fallback is not configured.');
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

function getSupabaseClient(dependencies: TrackingStoreDependencies) {
  return dependencies.supabaseClient || getSupabaseTrackingClient();
}

function isPayloadMatch(payload: unknown, listingId: string) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;

  const record = payload as Record<string, unknown>;
  return ['propertyId', 'id', 'mlsId', 'listingId', 'slug'].some((key) => record[key] === listingId);
}

function getPageSize(dependencies: TrackingStoreDependencies) {
  const configured = dependencies.supabaseAlertPageSize;
  if (!configured || !Number.isFinite(configured)) return DEFAULT_ALERT_PAGE_SIZE;
  return Math.min(Math.max(Math.floor(configured), 1), DEFAULT_ALERT_PAGE_SIZE);
}

function getMaxPages(dependencies: TrackingStoreDependencies) {
  const configured = dependencies.supabaseAlertMaxPages;
  if (!configured || !Number.isFinite(configured)) return DEFAULT_ALERT_MAX_PAGES;
  return Math.min(Math.max(Math.floor(configured), 1), DEFAULT_ALERT_MAX_PAGES);
}

function getPrismaClient(dependencies: TrackingStoreDependencies) {
  return dependencies.prismaClient || (prisma as unknown as TrackingPrismaClient);
}

async function getTrackableUserWithSupabase(
  userId: string,
  dependencies: TrackingStoreDependencies,
): Promise<UserRow | null> {
  const client = getSupabaseClient(dependencies);
  const { data, error } = await client
    .from('User')
    .select('id,isUnsubscribed,heatScore')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error('Supabase tracking user lookup failed.');

  return data as UserRow | null;
}

async function markAlertClickWithSupabase(
  userId: string,
  listingId: string,
  clickedAt: Date,
  dependencies: TrackingStoreDependencies,
) {
  const client = getSupabaseClient(dependencies);
  const pageSize = getPageSize(dependencies);
  const maxPages = getMaxPages(dependencies);
  const matchingIds: string[] = [];

  for (let page = 0; page < maxPages; page++) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await client
      .from('AlertQueue')
      .select('id,payload')
      .eq('userId', userId)
      .is('clickedAt', null)
      .in('status', ['sent', 'pending', 'processing'])
      .order('createdAt', { ascending: false })
      .range(from, to);

    if (error) throw new Error('Supabase tracking alert lookup failed.');

    const rows = (data || []) as AlertQueueRow[];
    matchingIds.push(...__test_collectMatchingAlertIds(rows, listingId));

    if (rows.length < pageSize) break;
  }

  if (!matchingIds.length) return { count: 0 };

  const update = await client.from('AlertQueue').update({ clickedAt: clickedAt.toISOString() }).in('id', matchingIds);

  if (update.error) throw new Error('Supabase tracking alert update failed.');

  return { count: matchingIds.length };
}

async function trackClickWithSupabase(
  userId: string,
  listingId: string,
  source: string,
  destination: string,
  dependencies: TrackingStoreDependencies,
): Promise<TrackClickResult> {
  const client = getSupabaseClient(dependencies);
  const user = await getTrackableUserWithSupabase(userId, dependencies);

  if (!user || user.isUnsubscribed) {
    return {
      tracked: false,
      reason: !user ? 'User not found.' : 'User is unsubscribed.',
    };
  }

  const trackedAt = new Date();
  const markedAlert = await markAlertClickWithSupabase(userId, listingId, trackedAt, dependencies);

  if (markedAlert.count < 1) {
    return {
      tracked: false,
      reason: 'No unclicked alert matched the tracked listing.',
    };
  }

  const interaction = await client.from('UserInteraction').insert({
    userId,
    type: 'LISTING_CLICK',
    metadata: {
      listingId,
      source,
      destination,
      trackedAt: trackedAt.toISOString(),
    },
  });

  if (interaction.error) throw new Error('Supabase tracking interaction insert failed.');

  const heatScore = Number.isFinite(user.heatScore) ? Number(user.heatScore) : 0;
  const userUpdate = await client
    .from('User')
    .update({
      heatScore: heatScore + 5,
    })
    .eq('id', userId);

  if (userUpdate.error) throw new Error('Supabase tracking user heat-score update failed.');

  return {
    tracked: true,
    reason: '',
  };
}

function markAlertClick(prismaClient: TrackingPrismaClient, userId: string, listingId: string, clickedAt: Date) {
  return prismaClient.alertQueue.updateMany({
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

function getMarkedAlertCount(result: unknown) {
  if (!result || typeof result !== 'object') return 0;
  const count = (result as { count?: unknown }).count;
  return typeof count === 'number' && Number.isFinite(count) ? count : 0;
}

export async function trackClick(
  userId: string,
  listingId: string,
  source: string,
  destination: string,
  dependencies: TrackingStoreDependencies = {},
): Promise<TrackClickResult> {
  const prismaClient = getPrismaClient(dependencies);

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        isUnsubscribed: true,
      },
    });

    if (!user || user.isUnsubscribed) {
      return {
        tracked: false,
        reason: !user ? 'User not found.' : 'User is unsubscribed.',
      };
    }

    const trackedAt = new Date();
    let markedAlert = await markAlertClick(prismaClient, userId, listingId, trackedAt);
    let markedAlertCount = getMarkedAlertCount(markedAlert);

    if (markedAlertCount < 1) {
      markedAlert = await markAlertClickWithSupabase(userId, listingId, trackedAt, dependencies);
      markedAlertCount = getMarkedAlertCount(markedAlert);
    }

    if (markedAlertCount < 1) {
      return {
        tracked: false,
        reason: 'No unclicked alert matched the tracked listing.',
      };
    }

    await prismaClient.$transaction([
      prismaClient.userInteraction.create({
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
      prismaClient.user.update({
        where: { id: userId },
        data: {
          heatScore: { increment: 5 },
        },
      }),
    ]);

    return {
      tracked: true,
      reason: '',
    };
  } catch (error) {
    console.error(
      '[REIE CRM] Prisma click tracking failed; attempting Supabase REST fallback:',
      error instanceof Error ? error.message : 'unknown error',
    );

    return trackClickWithSupabase(userId, listingId, source, destination, dependencies);
  }
}

export function __test_isPayloadMatch(payload: unknown, listingId: string) {
  return isPayloadMatch(payload, listingId);
}

export function __test_collectMatchingAlertIds(rows: AlertQueueRow[], listingId: string) {
  return rows.filter((row) => isPayloadMatch(row.payload, listingId)).map((row) => row.id);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/tracking/store.ts
