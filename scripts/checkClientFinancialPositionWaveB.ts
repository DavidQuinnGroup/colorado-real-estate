import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const service = readFileSync('lib/clientFinancialPositionFoundation.ts', 'utf8');
const presentation = readFileSync('lib/clientFinancialPositionPresentation.ts', 'utf8');
const route = readFileSync('app/api/agent/client-financial-position/route.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientFinancialPositionWorkspace.tsx', 'utf8');
const fixture = readFileSync('components/agent/ClientFinancialPositionVisualFixture.tsx', 'utf8');
const clientInformationStyles = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const commandCenter = readFileSync('components/agent/ClientCommandCenter.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');

for (const operation of [
  'createAssetWithInitialObservation',
  'createLiabilityWithInitialObservation',
  'createIncomeWithInitialObservation',
  'createQualificationWithInitialObservation',
  'createConstraintWithInitialObservation',
]) assert.match(service, new RegExp(operation));
assert.match(service, /prisma\.\$transaction\(async \(tx\)/);
assert.match(service, /sourceForGovernedSource/);
assert.match(service, /assertEligibleClientCaseGovernedSource/);
assert.match(presentation, /listClientCaseGovernedSources/);
assert.match(presentation, /reviewRecommended/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /Cache-Control': 'private, no-store'/);
assert.match(route, /dollarsToCents/);
assert.match(route, /percentToBps/);
for (const action of ['CREATE_ASSET', 'CREATE_LIABILITY', 'CREATE_INCOME', 'CREATE_QUALIFICATION', 'CREATE_CONSTRAINT', 'UPDATE_ASSET', 'UPDATE_LIABILITY', 'UPDATE_INCOME', 'UPDATE_QUALIFICATION', 'UPDATE_CONSTRAINT']) assert.match(route, new RegExp(action));
assert.doesNotMatch(route, /prisma\.(clientFinancialAsset|clientFinancialLiability|clientFinancialIncomeSource|clientFinancialQualification|clientFinancialConstraint)\.(create|update|delete)/);
assert.match(workspace, /Financial Position/);
assert.match(workspace, /Clear All Selections/);
assert.match(workspace, /View history/);
assert.match(workspace, /Joint \/ Client Case/);
assert.match(workspace, /No eligible source is associated/);
assert.match(fixture, /informationStyles from '\.\/ClientCaseInformationWorkspace\.module\.css'/);
assert.match(fixture, /informationStyles\.page/);
assert.match(fixture, /informationStyles\.container/);
assert.match(clientInformationStyles, /\.page \{ padding: clamp\(var\(--atlas-space-5\), 3vw, var\(--atlas-space-8\)\);/);
assert.match(clientInformationStyles, /\.container \{ display: grid; width: min\(100%, 74rem\); gap: var\(--atlas-space-5\); margin-inline: auto; \}/);
assert.match(commandCenter, /financial-position/);
assert.match(commandCenter, /Exact dollar amounts are shown only in Client Information/);
assert.match(auth, /\/api\/agent\/client-financial-position/);
assert.match(auth, /\/agent\/design-system\/visual-certification\/client-financial-position/);

console.log('Client Financial Position Wave B static foundation check passed.');
