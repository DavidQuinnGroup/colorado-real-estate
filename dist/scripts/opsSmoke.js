import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
const BASE_URL = (process.env.OPS_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = Number(process.env.OPS_SMOKE_REQUEST_TIMEOUT_MS || 8000);
const MAX_ATTEMPTS = Number(process.env.OPS_SMOKE_MAX_ATTEMPTS || 4);
const RETRY_DELAY_MS = Number(process.env.OPS_SMOKE_RETRY_DELAY_MS || 1000);
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function fetchJson(path) {
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const response = await fetch(`${BASE_URL}${path}`, {
                headers: {
                    accept: 'application/json',
                },
                signal: controller.signal,
            });
            const payload = (await response.json().catch(() => null));
            assert.equal(response.status, 200, `Expected HTTP 200 for ${path}, got ${response.status}.`);
            assert.ok(isRecord(payload), `Expected ${path} to return a JSON object.`);
            return payload;
        }
        catch (error) {
            lastError = error;
            if (attempt < MAX_ATTEMPTS) {
                await delay(RETRY_DELAY_MS);
            }
        }
        finally {
            clearTimeout(timeout);
        }
    }
    throw new Error(`Failed to fetch ${path} after ${MAX_ATTEMPTS} attempts: ${errorMessage(lastError)}`);
}
async function assertMlsStatus() {
    const payload = await fetchJson('/api/mls/status');
    assert.equal(payload.success, true, 'Expected MLS status success=true.');
    assert.equal(payload.module, 'MLS Operations Status', 'Expected MLS operations status payload.');
    return {
        path: '/api/mls/status',
        status: payload.status,
        readiness: isRecord(payload.operationalReadiness) ? payload.operationalReadiness.level : null,
    };
}
async function assertSearch() {
    const payload = await fetchJson('/api/search?limit=5');
    assert.ok(Array.isArray(payload.results), 'Expected search results array.');
    assert.ok(payload.results.length > 0, 'Expected at least one public search result.');
    assert.equal(payload.accessLevel, 'public', 'Expected public search access level.');
    return {
        path: '/api/search?limit=5',
        returned: payload.results.length,
        source: isRecord(payload.meta) ? payload.meta.source : null,
        health: isRecord(payload.meta) ? payload.meta.health : null,
    };
}
function runPublicExperienceSmoke() {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, ['dist/scripts/publicExperienceSmoke.js'], {
            env: {
                ...process.env,
                PUBLIC_EXPERIENCE_SMOKE_BASE_URL: BASE_URL,
            },
            stdio: 'inherit',
        });
        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`Public experience smoke exited with code ${code ?? 'unknown'}.`));
        });
    });
}
async function main() {
    const mlsStatus = await assertMlsStatus();
    const search = await assertSearch();
    await runPublicExperienceSmoke();
    console.log(JSON.stringify({
        success: true,
        check: 'ops-smoke',
        baseUrl: BASE_URL,
        assertions: {
            mlsStatus,
            search,
            publicExperience: true,
        },
    }, null, 2));
}
main().catch((error) => {
    console.error(`Ops smoke failed: ${errorMessage(error)}`);
    process.exitCode = 1;
});
