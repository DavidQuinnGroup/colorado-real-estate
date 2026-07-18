import { createClient } from '@supabase/supabase-js';
import { prisma } from '../prisma.js';
export class UnsubscribeStoreError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnsubscribeStoreError';
    }
}
let cachedClient = null;
function getSupabaseUnsubscribeClient() {
    if (cachedClient)
        return cachedClient;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase unsubscribe fallback is not configured.');
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
    return dependencies.supabaseClient || getSupabaseUnsubscribeClient();
}
function toRecord(row) {
    if (!row)
        return null;
    return {
        token: row.token,
        userId: row.userId,
        searchId: row.searchId,
        usedAt: row.usedAt,
    };
}
async function findWithSupabase(token, dependencies) {
    const client = getSupabaseClient(dependencies);
    const { data, error } = await client
        .from('UnsubscribeToken')
        .select('token,userId,searchId,usedAt')
        .eq('token', token)
        .maybeSingle();
    if (error) {
        throw new Error('Supabase unsubscribe lookup failed.');
    }
    return toRecord(data);
}
export async function findUnsubscribeToken(token, dependencies = {}) {
    const prismaClient = dependencies.prismaClient || prisma;
    try {
        return await prismaClient.unsubscribeToken.findUnique({
            where: { token },
            select: {
                token: true,
                userId: true,
                searchId: true,
                usedAt: true,
            },
        });
    }
    catch (error) {
        console.error('[unsubscribe] Prisma lookup failed; attempting Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');
        try {
            return await findWithSupabase(token, dependencies);
        }
        catch {
            throw new UnsubscribeStoreError('Unsubscribe token lookup is temporarily unavailable.');
        }
    }
}
async function applyWithSupabase(record, usedAt, dependencies) {
    const client = getSupabaseClient(dependencies);
    const usedAtIso = usedAt.toISOString();
    const tokenUpdate = await client.from('UnsubscribeToken').update({ usedAt: usedAtIso }).eq('token', record.token);
    if (tokenUpdate.error) {
        throw new Error('Supabase unsubscribe token update failed.');
    }
    if (record.searchId) {
        const searchUpdate = await client.from('SavedSearch').update({ isActive: false }).eq('id', record.searchId);
        if (searchUpdate.error) {
            throw new Error('Supabase saved-search unsubscribe update failed.');
        }
        return 'search';
    }
    const userUpdate = await client
        .from('User')
        .update({
        isUnsubscribed: true,
        unsubscribedAt: usedAtIso,
    })
        .eq('id', record.userId);
    if (userUpdate.error) {
        throw new Error('Supabase global unsubscribe update failed.');
    }
    return 'global';
}
export async function applyUnsubscribe(record, dependencies = {}) {
    const prismaClient = dependencies.prismaClient || prisma;
    const usedAt = new Date();
    try {
        if (record.searchId) {
            await prismaClient.$transaction([
                prismaClient.unsubscribeToken.update({
                    where: { token: record.token },
                    data: { usedAt },
                }),
                prismaClient.savedSearch.update({
                    where: { id: record.searchId },
                    data: { isActive: false },
                }),
            ]);
            return 'search';
        }
        await prismaClient.$transaction([
            prismaClient.unsubscribeToken.update({
                where: { token: record.token },
                data: { usedAt },
            }),
            prismaClient.user.update({
                where: { id: record.userId },
                data: {
                    isUnsubscribed: true,
                    unsubscribedAt: usedAt,
                },
            }),
        ]);
        return 'global';
    }
    catch (error) {
        console.error('[unsubscribe] Prisma mutation failed; attempting Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');
        try {
            return await applyWithSupabase(record, usedAt, dependencies);
        }
        catch {
            throw new UnsubscribeStoreError('Unsubscribe update is temporarily unavailable.');
        }
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/unsubscribe/store.ts
