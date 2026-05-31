import dns from 'node:dns/promises';
import dotenv from 'dotenv';
const REST_TIMEOUT_MS = 8000;
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
async function main() {
    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
    const databaseUrl = getEnv('DATABASE_URL');
    const supabaseHost = parseHost(supabaseUrl);
    const databaseHost = parsePostgresHost(databaseUrl);
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
            name: 'DATABASE_URL',
            status: databaseUrl ? 'pass' : 'warn',
            detail: databaseUrl ? `Configured host: ${databaseHost || 'invalid URL'}.` : 'Missing; REST checks can still run.',
        },
        await checkDns('Supabase project DNS', supabaseHost),
        await checkDns('Supabase Postgres DNS', databaseHost),
        await checkSupabaseRest(supabaseUrl, serviceRoleKey),
    ];
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
    console.error(formatError(error));
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSupabase.ts
