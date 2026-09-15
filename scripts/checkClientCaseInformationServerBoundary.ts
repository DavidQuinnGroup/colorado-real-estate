import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  clientCaseInformationHref,
  informationIntentFromRequirement,
} from '../lib/clientCaseInformationIntent';

const page = readFileSync('app/agent/clients/[clientCaseId]/information/page.tsx', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const intent = readFileSync('lib/clientCaseInformationIntent.ts', 'utf8');
const readinessWorkspace = readFileSync('components/agent/ClientCaseReadinessWorkspace.tsx', 'utf8');

assert.doesNotMatch(intent, /['"]use client['"]/, 'intent mapping must remain server-safe');
assert.match(page, /@\/lib\/clientCaseInformationIntent/, 'server page must import the mapping from the server-safe module');
assert.doesNotMatch(page, /informationIntentFromRequirement\s*} from '@\/components\/agent\/ClientCaseInformationWorkspace'/, 'server page must not import callable values from the client workspace');
assert.match(workspace, /^'use client';/, 'workspace remains a client component');
assert.doesNotMatch(workspace, /export function informationIntentFromRequirement/, 'client component must not own the server-called intent mapping');
assert.match(readinessWorkspace, /@\/lib\/clientCaseInformationIntent/, 'readiness deep links must share the allowlisted mapping');

assert.equal(informationIntentFromRequirement('BUYER_DECISION_TARGET_CITIES'), 'target-cities');
assert.equal(informationIntentFromRequirement('BUYER_DECISION_PRICE_RANGE'), 'purchase-price-range');
assert.equal(informationIntentFromRequirement('PROPERTY_OCCUPANCY_STATUS'), null);
assert.equal(informationIntentFromRequirement('TARGET_ACQUISITION_PRICE_CENTS'), null);
assert.equal(informationIntentFromRequirement(undefined), null);
assert.equal(
  clientCaseInformationHref('case-a', 'BUYER_DECISION_TARGET_CITIES'),
  '/agent/clients/case-a/information?requirement=BUYER_DECISION_TARGET_CITIES',
);
assert.equal(clientCaseInformationHref('case-a', 'TARGET_ACQUISITION_PRICE_CENTS'), null);

console.log('client-case-information-server-boundary: PASS');
