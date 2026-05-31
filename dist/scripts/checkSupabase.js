import dns from 'node:dns/promises';
import net from 'node:net';
import dotenv from 'dotenv';
const REST_TIMEOUT_MS = 8000;
const POSTGRES_TIMEOUT_MS = 8000;
dotenv.config({ path: '.env.local' });
dotenv.config();
function getEnv(name) {
    const value = process.env[name];
    return typeof value === 'string' && value.trim() ? value.trim() : '';
}
function parseHost(value) {
    if (!value)
        return '';
    try {
        return new URL(value).host;
    }
    catch {
        return '';
    }
}
function parsePostgresHost(value) {
    if (!value)
        return '';
    try {
        return new URL(value).hostname;
    }
    catch {
        return '';
    }
}
function parsePostgresEndpoint(value) {
    if (!value)
        return null;
    try {
        const url = new URL(value);
        return {
            host: url.hostname,
            port: url.port ? Number(url.port) : 5432,
        };
    }
    catch {
        return null;
    }
}
function parseSupabaseProjectRefFromUrl(value) {
    const host = parseHost(value);
    const [projectRef] = host.split('.');
    return projectRef || '';
}
function parseSupabaseProjectRefFromDatabaseUrl(value) {
    if (!value)
        return '';
    try {
        const url = new URL(value);
        const username = decodeURIComponent(url.username);
        const match = username.match(/^postgres\.([a-z0-9]+)$/i);
        return match?.[1] || '';
    }
    catch {
        return '';
    }
}
function decodeJwtPayload(token) {
    const [, payload] = token.split('.');
    if (!payload)
        return null;
    try {
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    }
    catch {
        return null;
    }
}
function parseSupabaseProjectRefFromJwt(token) {
    const payload = decodeJwtPayload(token);
    const ref = payload?.ref;
    return typeof ref === 'string' ? ref : '';
}
function getUniqueValues(values) {
    return [...new Set(values.filter(Boolean))];
}
function formatError(error) {
    if (error instanceof Error) {
        const candidate = error;
        const cause = candidate.cause instanceof Error ? ` ${candidate.cause.message}` : '';
        const singleLine = `${error.message}${cause}`.replace(/\s+/g, ' ').trim();
        const dnsFailure = singleLine.match(/getaddrinfo\s+(ENOTFOUND|EAI_AGAIN)\s+([^\s)]+)/);
        return dnsFailure ? `DNS lookup failed: ${dnsFailure[1]} ${dnsFailure[2]}` : singleLine;
    }
    return String(error);
}
function checkProjectRefConsistency(values) {
    const comparableValues = Object.fromEntries(Object.entries(values).filter(([, ref]) => ref && ref !== 'unavailable'));
    const uniqueRefs = getUniqueValues(Object.values(comparableValues));
    if (uniqueRefs.length === 0) {
        return {
            name: 'Supabase project ref consistency',
            status: 'skip',
            detail: 'No project refs could be parsed from configured Supabase values.',
        };
    }
    const details = Object.entries(values)
        .map(([name, ref]) => `${name}=${ref || 'unparsed'}`)
        .join(', ');
    return {
        name: 'Supabase project ref consistency',
        status: uniqueRefs.length === 1 ? 'pass' : 'fail',
        detail: uniqueRefs.length === 1 ? `All parsed refs match: ${uniqueRefs[0]}. ${details}` : `Parsed refs differ. ${details}`,
    };
}
function hasFailed(results, name) {
    return results.some((result) => result.name === name && result.status === 'fail');
}
function logResult(result) {
    console.log(`${result.status.toUpperCase()} ${result.name}: ${result.detail}`);
}
async function checkDns(name, host) {
    if (!host) {
        return {
            name,
            status: 'skip',
            detail: 'No host could be parsed.',
        };
    }
    try {
        const addresses = await dns.lookup(host, { all: true });
        return {
            name,
            status: 'pass',
            detail: `${host} resolved to ${addresses.map((address) => address.address).join(', ') || 'no addresses'}.`,
        };
    }
    catch (error) {
        return {
            name,
            status: 'fail',
            detail: `${host} did not resolve. ${formatError(error)}`,
        };
    }
}
async function checkSupabaseRest(url, serviceRoleKey) {
    if (!url) {
        return {
            name: 'Supabase REST',
            status: 'skip',
            detail: 'NEXT_PUBLIC_SUPABASE_URL is missing.',
        };
    }
    if (!serviceRoleKey) {
        return {
            name: 'Supabase REST',
            status: 'skip',
            detail: 'SUPABASE_SERVICE_ROLE_KEY is missing.',
        };
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REST_TIMEOUT_MS);
    try {
        const response = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/`, {
            headers: {
                apikey: serviceRoleKey,
                authorization: `Bearer ${serviceRoleKey}`,
            },
            signal: controller.signal,
        });
        return {
            name: 'Supabase REST',
            status: response.ok || response.status === 404 ? 'pass' : 'fail',
            detail: `HTTP ${response.status} from REST endpoint.`,
        };
    }
    catch (error) {
        return {
            name: 'Supabase REST',
            status: 'fail',
            detail: formatError(error),
        };
    }
    finally {
        clearTimeout(timeout);
    }
}
async function checkPostgresTcp(databaseUrl) {
    const endpoint = parsePostgresEndpoint(databaseUrl);
    if (!endpoint) {
        return {
            name: 'Supabase Postgres TCP',
            status: 'skip',
            detail: databaseUrl ? 'DATABASE_URL is not a valid URL.' : 'DATABASE_URL is missing.',
        };
    }
    return new Promise((resolve) => {
        const socket = net.createConnection(endpoint);
        const timeout = setTimeout(() => {
            socket.destroy();
            resolve({
                name: 'Supabase Postgres TCP',
                status: 'fail',
                detail: `${endpoint.host}:${endpoint.port} timed out after ${POSTGRES_TIMEOUT_MS}ms.`,
            });
        }, POSTGRES_TIMEOUT_MS);
        socket.once('connect', () => {
            clearTimeout(timeout);
            socket.end();
            resolve({
                name: 'Supabase Postgres TCP',
                status: 'pass',
                detail: `${endpoint.host}:${endpoint.port} accepted a TCP connection.`,
            });
        });
        socket.once('error', (error) => {
            clearTimeout(timeout);
            resolve({
                name: 'Supabase Postgres TCP',
                status: 'fail',
                detail: `${endpoint.host}:${endpoint.port} connection failed. ${formatError(error)}`,
            });
        });
    });
}
async function checkPrismaDatabase(databaseUrl, skip) {
    if (!databaseUrl) {
        return {
            name: 'Prisma database',
            status: 'skip',
            detail: 'DATABASE_URL is missing.',
        };
    }
    if (skip) {
        return {
            name: 'Prisma database',
            status: 'skip',
            detail: 'Skipped because Postgres DNS or TCP failed.',
        };
    }
    try {
        const { prisma } = await import('../lib/prisma.js');
        await prisma.$queryRaw `SELECT 1`;
        await prisma.$disconnect();
        return {
            name: 'Prisma database',
            status: 'pass',
            detail: 'SELECT 1 succeeded.',
        };
    }
    catch (error) {
        return {
            name: 'Prisma database',
            status: 'fail',
            detail: formatError(error),
        };
    }
}
async function main() {
    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const publishableKey = getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    const databaseUrl = getEnv('DATABASE_URL');
    const supabaseHost = parseHost(supabaseUrl);
    const databaseHost = parsePostgresHost(databaseUrl);
    const projectRefs = {
        url: parseSupabaseProjectRefFromUrl(supabaseUrl),
        databaseUser: parseSupabaseProjectRefFromDatabaseUrl(databaseUrl),
        anonKey: parseSupabaseProjectRefFromJwt(anonKey),
        serviceRoleKey: parseSupabaseProjectRefFromJwt(serviceRoleKey),
        publishableKey: publishableKey.startsWith('sb_publishable_') ? 'unavailable' : '',
    };
    const results = [
        {
            name: 'NEXT_PUBLIC_SUPABASE_URL',
            status: supabaseUrl ? 'pass' : 'fail',
            detail: supabaseUrl ? `Configured host: ${supabaseHost || 'invalid URL'}.` : 'Missing.',
        },
        {
            name: 'SUPABASE_SERVICE_ROLE_KEY',
            status: serviceRoleKey ? 'pass' : 'fail',
            detail: serviceRoleKey ? 'Configured.' : 'Missing.',
        },
        {
            name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            status: anonKey ? 'pass' : 'warn',
            detail: anonKey ? 'Configured.' : 'Missing; server-side preflight can still run.',
        },
        {
            name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
            status: publishableKey ? 'pass' : 'warn',
            detail: publishableKey ? 'Configured.' : 'Missing; legacy anon key may still support local checks.',
        },
        {
            name: 'DATABASE_URL',
            status: databaseUrl ? 'pass' : 'warn',
            detail: databaseUrl ? `Configured host: ${databaseHost || 'invalid URL'}.` : 'Missing; REST checks can still run.',
        },
        checkProjectRefConsistency(projectRefs),
    ];
    results.push(await checkDns('Supabase project DNS', supabaseHost));
    results.push(await checkDns('Supabase Postgres DNS', databaseHost));
    results.push(await checkPostgresTcp(databaseUrl));
    results.push(await checkPrismaDatabase(databaseUrl, hasFailed(results, 'Supabase Postgres DNS') || hasFailed(results, 'Supabase Postgres TCP')));
    results.push(await checkSupabaseRest(supabaseUrl, serviceRoleKey));
    console.log('Supabase connectivity preflight starting.');
    for (const result of results) {
        logResult(result);
    }
    const failed = results.filter((result) => result.status === 'fail');
    if (failed.length) {
        throw new Error(`Supabase preflight failed: ${failed.map((result) => result.name).join(', ')}. Verify Supabase project status, endpoint values, DNS, and local network access.`);
    }
    console.log('Supabase connectivity preflight passed.');
}
main().catch((error) => {
    console.log(formatError(error));
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSupabase.ts
