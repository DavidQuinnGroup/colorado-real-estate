import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { createProjectAtlasExternalUnavailableResponse } from '../lib/projectAtlasExternalNavigation';

const applicationShell = readFileSync('components/ApplicationShell.tsx', 'utf8');
const publicNavigation = readFileSync('components/PublicNavigation.tsx', 'utf8');
const agentShell = readFileSync('components/agent/AgentWorkspaceShell.tsx', 'utf8');
const externalShell = readFileSync('components/project-atlas/ProjectAtlasExternalShell.tsx', 'utf8');
const clientLayout = readFileSync('app/client-authorization/layout.tsx', 'utf8');
const professionalLayout = readFileSync('app/professional-request/layout.tsx', 'utf8');
const clientAccess = readFileSync('app/client-authorization/access/route.ts', 'utf8');
const professionalAccess = readFileSync('app/professional-request/access/route.ts', 'utf8');
const styles = readFileSync('app/globals.css', 'utf8');

assert.match(applicationShell, /<PublicNavigation \/>/);
assert.match(publicNavigation, /href="\/"/);
assert.match(agentShell, /agent-workspace-home-control/);
assert.match(agentShell, /agent-workspace-public-site-link/);
assert.match(externalShell, /data-project-atlas-navigation-surface="PUBLIC_EXTERNAL"/);
assert.match(externalShell, /Return to David Quinn Group/);
assert.doesNotMatch(externalShell, /agent|token|cookie|session/i);
assert.match(clientLayout, /ProjectAtlasExternalShell/);
assert.match(professionalLayout, /ProjectAtlasExternalShell/);
assert.match(clientAccess, /createProjectAtlasExternalUnavailableResponse/);
assert.match(professionalAccess, /createProjectAtlasExternalUnavailableResponse/);
assert.match(styles, /\.atlas-public-home-action/);
assert.match(styles, /\.atlas-action:focus-visible/);

const unavailable = createProjectAtlasExternalUnavailableResponse({ title: 'Request unavailable', message: 'This secure request is unavailable.', status: 410 });
assert.equal(unavailable.status, 410);
assert.equal(unavailable.headers.get('cache-control'), 'private, no-store');
assert.equal(unavailable.headers.get('referrer-policy'), 'no-referrer');
assert.match(unavailable.headers.get('x-robots-tag') || '', /noindex/);
const unavailableHtml = await unavailable.text();
assert.match(unavailableHtml, /href="\/"/);
assert.match(unavailableHtml, /Return to David Quinn Group/);
assert.doesNotMatch(unavailableHtml, /token|cookie|session/i);

console.log('PROJECT_ATLAS_NAVIGATION_INVARIANT_CHECK: PASS');
