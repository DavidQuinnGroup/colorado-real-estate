import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/globals.css', 'utf8');
const workspace = readFileSync('components/agent/ClientAuthorizationWorkspace.tsx', 'utf8');
const confirmation = readFileSync('components/client-authorization/ClientAuthorizationConfirmationForm.tsx', 'utf8');

for (const className of ['atlas-action-primary', 'atlas-action-secondary', 'atlas-action-destructive', 'atlas-action-secure', 'atlas-status-badge', 'atlas-authorization-record-current', 'atlas-authorization-record-historical', 'atlas-secure-link-panel', 'atlas-issued-capability']) assert.match(styles, new RegExp(`\\.${className}`));
assert.match(styles, /\.atlas-action:focus-visible/);
assert.match(styles, /\.atlas-action:disabled/);
assert.match(styles, /\.atlas-status-pending-confirmation/);
assert.match(styles, /\.atlas-status-superseded/);
assert.match(workspace, /Secure link ready/);
assert.match(workspace, /only display of this bearer link/);
assert.match(workspace, /cannot be safely recovered or redisplayed/);
assert.match(workspace, /Secure link issued and active/);
assert.match(workspace, /Recover lost secure link/);
assert.match(workspace, /Recovery revokes this unused capability before issuing one replacement/);
assert.match(workspace, /!currentCapability/);
assert.match(workspace, /atlas-authorization-record-historical/);
assert.match(workspace, /atlas-action atlas-action-primary/);
assert.match(workspace, /atlas-action atlas-action-destructive/);
assert.match(confirmation, /atlas-confirmation-shell/);
assert.match(confirmation, /atlas-action atlas-action-primary atlas-confirmation-action/);
assert.match(confirmation, /atlas-action atlas-action-secondary atlas-confirmation-action/);

console.log('CLIENT_AUTHORIZATION_INTERACTION_HIERARCHY_CHECK: PASS');
