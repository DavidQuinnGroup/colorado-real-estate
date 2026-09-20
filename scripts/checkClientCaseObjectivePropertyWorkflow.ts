import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path: string) => readFileSync(path, 'utf8');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
const route = source('app/api/agent/client-case-objective-property-relationships/route.ts');
const relationshipService = source('lib/clientCaseObjectivePropertyRelationships.ts');
const contextService = source('lib/clientCaseContextRecordsFoundation.ts');
const presentation = source('lib/clientCaseObjectivePropertyRelationshipPresentation.ts');
const commandCenter = source('components/agent/ClientCommandCenter.tsx');
const objectiveUi = source('components/agent/ClientObjectivePropertyRelationships.tsx');
const informationWorkspace = source('components/agent/ClientCaseInformationWorkspace.tsx');
const fixture = source('components/agent/ClientObjectivePropertyRelationshipVisualFixture.tsx');
const fixtureStyles = source('components/agent/ClientObjectivePropertyRelationshipVisualFixture.module.css');
const auth = source('lib/admin/adminAuth.ts');

assert.equal(packageJson.scripts?.['check:client-case-objective-property-workflow'], 'jiti scripts/checkClientCaseObjectivePropertyWorkflow.ts');
assert.match(route, /const ROUTE = '\/api\/agent\/client-case-objective-property-relationships'/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /Cache-Control': 'private, no-store'/);
assert.match(route, /Vary: 'Cookie'/);
assert.match(route, /service\.link\(/);
assert.match(route, /service\.end\(/);
assert.match(route, /service\.listByClientCase\(/);
assert.match(route, /service\.listByObjective\(/);
assert.doesNotMatch(route, /clientCaseObjectivePropertyRelationship\.(?:create|update|delete)/);

assert.match(relationshipService, /clientCase\.status !== 'ACTIVE'/);
assert.match(relationshipService, /status: 'ACTIVE'/);
assert.match(contextService, /ACTIVE_PROPERTY_RELATIONSHIPS_EXIST/);
assert.match(contextService, /clientCaseObjectivePropertyRelationship\.count/);
assert.match(presentation, /relationshipRoleDefault/);
assert.match(presentation, /Unknown relationship role/);
assert.match(presentation, /Unknown relationship status/);

assert.match(commandCenter, /ClientObjectivePropertyRelationships/);
assert.match(objectiveUi, /fetchCurrentObjectivePropertyRelationships/);
assert.match(objectiveUi, /fetchObjectivePropertyRelationshipHistory/);
assert.match(objectiveUi, /mutateObjectivePropertyRelationship/);
assert.match(objectiveUi, /Clear selection/);
assert.match(objectiveUi, /End relationship/);
assert.match(objectiveUi, /Relationship history/);
assert.match(informationWorkspace, /fetchCurrentObjectivePropertyRelationships/);
assert.match(informationWorkspace, /Current Objective relationships/);
assert.doesNotMatch(informationWorkspace, /OBJECTIVE_PROPERTY.*(?:LINK|END)/);

assert.match(fixture, /Static synthetic interface only/);
assert.match(fixture, /Simple Client/);
assert.match(fixture, /Complex Client/);
assert.match(fixture, /Relationship history/);
assert.match(fixtureStyles, /\.fixture > :global\(\.atlas-ds-canvas\) \{ min-height: 100%; padding: clamp\(var\(--atlas-space-5\), 3vw, var\(--atlas-space-8\)\); \}/);
assert.match(fixtureStyles, /\.header, \.grid, \.complex \{ width: min\(100%, 74rem\); margin-inline: auto; \}/);
assert.match(auth, /\/api\/agent\/client-case-objective-property-relationships/);
assert.match(auth, /\/agent\/design-system\/visual-certification\/objective-property-relationships/);

console.log('[client-case-objective-property-workflow] ok: protected canonical adapter, lifecycle guards, Objective UI, property context, and synthetic fixture are present.');
