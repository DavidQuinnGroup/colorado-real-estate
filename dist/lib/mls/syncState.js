import { prisma } from '../prisma.js';
export const MLS_SYNC_STATE_ID = 1;
export const DEFAULT_LAST_SYNC = '2000-01-01T00:00:00.000Z';
function toDate(value, fallback) {
    if (!value)
        return fallback;
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime()))
        return fallback;
    return date;
}
function toNullableDate(value) {
    if (value === null)
        return null;
    if (!value)
        return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime()))
        return undefined;
    return date;
}
function toNonNegativeInteger(value, fallback) {
    if (!Number.isFinite(value) || value === undefined)
        return fallback;
    return Math.max(0, Math.floor(value));
}
function normalizeUpdate(values) {
    const update = {};
    if (values.isSyncing !== undefined) {
        update.isSyncing = values.isSyncing;
    }
    if (values.lastSync !== undefined) {
        update.lastSync = toDate(values.lastSync, new Date());
    }
    if (values.lastIntelligenceSync !== undefined) {
        update.lastIntelligenceSync = toNullableDate(values.lastIntelligenceSync);
    }
    if (values.lastPage !== undefined) {
        update.lastPage = toNonNegativeInteger(values.lastPage, 0);
    }
    if (values.totalRecords !== undefined) {
        update.totalRecords = toNonNegativeInteger(values.totalRecords, 0);
    }
    return update;
}
export async function getOrCreateMlsSyncState() {
    const existing = await prisma.mlsSyncState.findUnique({
        where: {
            id: MLS_SYNC_STATE_ID,
        },
    });
    if (existing)
        return existing;
    return prisma.mlsSyncState.upsert({
        where: {
            id: MLS_SYNC_STATE_ID,
        },
        update: {},
        create: {
            id: MLS_SYNC_STATE_ID,
            lastSync: new Date(DEFAULT_LAST_SYNC),
            lastPage: 0,
            totalRecords: 0,
            isSyncing: false,
        },
    });
}
export async function getLastSync() {
    const state = await getOrCreateMlsSyncState();
    const date = toDate(state.lastSync, new Date(DEFAULT_LAST_SYNC));
    return date.toISOString();
}
export async function updateMlsSyncState(values) {
    const update = normalizeUpdate(values);
    await getOrCreateMlsSyncState();
    return prisma.mlsSyncState.update({
        where: {
            id: MLS_SYNC_STATE_ID,
        },
        data: update,
    });
}
export async function updateLastSync(date) {
    return updateMlsSyncState({
        lastSync: date,
    });
}
export async function markMlsSyncStarted(values = {}) {
    return updateMlsSyncState({
        ...values,
        isSyncing: true,
        lastSync: values.lastSync ?? new Date(),
    });
}
export async function markMlsSyncFinished(values = {}) {
    return updateMlsSyncState({
        ...values,
        isSyncing: false,
        lastSync: values.lastSync ?? new Date(),
    });
}
// lib/mls/syncState.ts
