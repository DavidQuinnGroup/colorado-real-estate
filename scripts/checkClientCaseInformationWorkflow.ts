import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { sanitizeAgentReturnPath } from '../lib/admin/adminAuth';

const service = readFileSync('lib/clientCaseInformationWorkflow.ts', 'utf8');
const route = readFileSync('app/api/agent/client-case-information/route.ts', 'utf8');
const page = readFileSync('app/agent/clients/[clientCaseId]/information/page.tsx', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const readinessWorkspace = readFileSync('components/agent/ClientCaseReadinessWorkspace.tsx', 'utf8');
const intent = readFileSync('lib/clientCaseInformationIntent.ts', 'utf8');
const clientCaseWorkspace = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-case-information-workflow'], 'jiti scripts/checkClientCaseInformationWorkflow.ts');

assert.match(service, /CANONICAL_CLIENT_CASE_INFORMATION_WORKFLOW_V1/);
assert.match(service, /createClientCaseContextRecordsService\(prisma\)/);
assert.match(service, /createClientCaseCapabilityReadinessService\(prisma\)/);
assert.match(service, /SUPPORTED_OBJECTIVES = \['BUY_PRIMARY_HOME', 'FINANCIAL_STRATEGY'\]/);
assert.match(service, /TARGET_CITIES/);
assert.match(service, /PURCHASE_PRICE_RANGE_CENTS/);
assert.match(service, /MIN_BEDROOMS/);
assert.match(service, /PROPERTY_OCCUPANCY_STATUS/);
assert.match(service, /DIRECT_ENTRY_POSTURES = \['CLIENT_STATED', 'AGENT_ENTERED'\]/);
assert.match(service, /evidenceAdmissionId/);
assert.match(service, /professionalInputId/);
assert.match(service, /cannot claim Evidence or Professional Input references/);
assert.match(service, /records\.createCriterion/);
assert.match(service, /records\.createFact/);
assert.match(service, /supersedesId: existing\.id/);
assert.match(service, /scope: 'PROPERTY'/);
assert.match(service, /'OBJECTIVE', buyerObjective\.id/);
assert.doesNotMatch(service, /TARGET_ACQUISITION_PRICE_CENTS|DOWN_PAYMENT_BPS|CASH_ALLOCATION|HOLDING_PERIOD|MAX_PURCHASE_PRICE|annualInterestRateBasisPoints|marketScope/);
assert.doesNotMatch(service, /prisma\.clientCaseScenario|createClientCaseScenarioService|scenarioService/);

assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /SAVE_CANONICAL_INFORMATION/);
assert.match(route, /createClientCaseInformationWorkflowService\(prisma\)\.load/);
assert.match(route, /createClientCaseInformationWorkflowService\(prisma\)\.save/);
assert.doesNotMatch(route, /semanticKey/);
assert.match(route, /Cache-Control': 'private, no-store/);

assert.match(page, /ClientCaseInformationWorkspace/);
assert.match(page, /@\/lib\/clientCaseInformationIntent/);
assert.doesNotMatch(page, /informationIntentFromRequirement } from '@\/components\/agent\/ClientCaseInformationWorkspace'/);
assert.match(workspace, /data-testid="client-case-information-workspace"/);
assert.match(workspace, /data-canonical-information-route="true"/);
assert.match(workspace, /data-scenario-authoring="false"/);
assert.match(workspace, /data-readiness-persistence="false"/);
assert.match(workspace, /Save and review readiness/);
assert.match(workspace, /\/api\/agent\/client-case-information/);
assert.match(workspace, /SAVE_CANONICAL_INFORMATION/);
assert.doesNotMatch(workspace, /export function informationIntentFromRequirement/);
assert.match(intent, /CLIENT_CASE_INFORMATION_REQUIREMENT_INTENTS/);
assert.match(intent, /BUYER_DECISION_TARGET_CITIES/);
assert.match(intent, /return value \? CLIENT_CASE_INFORMATION_REQUIREMENT_INTENTS\[value\] \?\? null : null/);
assert.match(workspace, /Target acquisition price, down payment, cash allocation, holding period/i);
assert.match(workspace, /Evidence and Professional Input references are handled by their owning workflows/);

assert.match(clientCaseWorkspace, /\/information/);
assert.match(clientCaseWorkspace, /client-case-information-summary-card/);
assert.match(readinessWorkspace, /clientCaseInformationHref/);
assert.match(auth, /\/api\/agent\/client-case-information/);
assert.match(auth, /surface\('\/api\/agent\/client-case-information', 'MUTATING_ADMIN_API'/);
assert.match(auth, /\^\\\/agent\\\/clients\\\/\[\^\/\]\+\\\/information\$/);
assert.equal(sanitizeAgentReturnPath('/agent/clients/case-a/information'), '/agent/clients/case-a/information');
assert.equal(sanitizeAgentReturnPath('/agent/clients/case-a/information?requirement=BUYER_DECISION_TARGET_CITIES'), '/agent/clients/case-a/information?requirement=BUYER_DECISION_TARGET_CITIES');
assert.equal(sanitizeAgentReturnPath('/agent/clients/case-a/information/other'), '/agent');
assert.doesNotMatch(schema, /ClientCaseInformationWorkflow|CanonicalInformationWorkflow|InformationWorkflowRecord/);

console.log('client-case-information-workflow: PASS');
