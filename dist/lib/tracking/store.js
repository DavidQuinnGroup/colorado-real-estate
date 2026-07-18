import { createClient } from '@supabase/supabase-js';
import { prisma } from '../prisma.js';
let cachedClient = null;
const DEFAULT_ALERT_PAGE_SIZE = 100;
const DEFAULT_ALERT_MAX_PAGES = 20;
function getSupabaseTrackingClient() {
    if (cachedClient)
        return cachedClient;
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
function getSupabaseClient(dependencies) {
    return dependencies.supabaseClient || getSupabaseTrackingClient();
}
function isPayloadMatch(payload, listingId) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload))
        return false;
    const record = payload;
    return ['propertyId', 'id', 'mlsId', 'listingId', 'slug'].some((key) => record[key] === listingId);
}
function getPageSize(dependencies) {
    const configured = dependencies.supabaseAlertPageSize;
    if (!configured || !Number.isFinite(configured))
        return DEFAULT_ALERT_PAGE_SIZE;
    return Math.min(Math.max(Math.floor(configured), 1), DEFAULT_ALERT_PAGE_SIZE);
}
function getMaxPages(dependencies) {
    const configured = dependencies.supabaseAlertMaxPages;
    if (!configured || !Number.isFinite(configured))
        return DEFAULT_ALERT_MAX_PAGES;
    return Math.min(Math.max(Math.floor(configured), 1), DEFAULT_ALERT_MAX_PAGES);
}
function getPrismaClient(dependencies) {
    return dependencies.prismaClient || prisma;
}
async function getTrackableUserWithSupabase(userId, dependencies) {
    const client = getSupabaseClient(dependencies);
    const { data, error } = await client
        .from('User')
        .select('id,isUnsubscribed,heatScore')
        .eq('id', userId)
        .maybeSingle();
    if (error)
        throw new Error('Supabase tracking user lookup failed.');
    return data;
}
async function markAlertClickWithSupabase(userId, listingId, clickedAt, dependencies) {
    const client = getSupabaseClient(dependencies);
    const pageSize = getPageSize(dependencies);
    const maxPages = getMaxPages(dependencies);
    const matchingIds = [];
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
        if (error)
            throw new Error('Supabase tracking alert lookup failed.');
        const rows = (data || []);
        matchingIds.push(...__test_collectMatchingAlertIds(rows, listingId));
        if (rows.length < pageSize)
            break;
    }
    if (!matchingIds.length)
        return { count: 0 };
    const update = await client.from('AlertQueue').update({ clickedAt: clickedAt.toISOString() }).in('id', matchingIds);
    if (update.error)
        throw new Error('Supabase tracking alert update failed.');
    return { count: matchingIds.length };
}
async function trackClickWithSupabase(userId, listingId, source, destination, dependencies) {
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
    if (interaction.error)
        throw new Error('Supabase tracking interaction insert failed.');
    const heatScore = Number.isFinite(user.heatScore) ? Number(user.heatScore) : 0;
    const userUpdate = await client
        .from('User')
        .update({
        heatScore: heatScore + 5,
    })
        .eq('id', userId);
    if (userUpdate.error)
        throw new Error('Supabase tracking user heat-score update failed.');
    return {
        tracked: true,
        reason: '',
    };
}
function markAlertClick(prismaClient, userId, listingId, clickedAt) {
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
function getMarkedAlertCount(result) {
    if (!result || typeof result !== 'object')
        return 0;
    const count = result.count;
    return typeof count === 'number' && Number.isFinite(count) ? count : 0;
}
export async function trackClick(userId, listingId, source, destination, dependencies = {}) {
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
    }
    catch (error) {
        console.error('[REIE CRM] Prisma click tracking failed; attempting Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');
        return trackClickWithSupabase(userId, listingId, source, destination, dependencies);
    }
}
export function __test_isPayloadMatch(payload, listingId) {
    return isPayloadMatch(payload, listingId);
}
export function __test_collectMatchingAlertIds(rows, listingId) {
    return rows.filter((row) => isPayloadMatch(row.payload, listingId)).map((row) => row.id);
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/tracking/store.ts
