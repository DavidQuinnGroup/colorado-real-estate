import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  REIE_SOURCE_REGISTRY_REFERENCE_DATE,
  REIE_SOURCE_REGISTRY_STATUS,
  getPublicSourceRegistryRecords,
  getReieSourceRegistry,
} from '../lib/sourceRegistry.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function record(sourceId: string) {
  const match = getReieSourceRegistry().records.find((item) => item.sourceId === sourceId);
  assert.ok(match, `Expected Source Registry record ${sourceId}.`);
  return match;
}

const registry = getReieSourceRegistry();
const publicRecords = getPublicSourceRegistryRecords();
const sourceIds = registry.records.map((item) => item.sourceId);

assert.equal(registry.status, REIE_SOURCE_REGISTRY_STATUS, 'Source Registry status must be implemented.');
assert.equal(registry.referenceDate, REIE_SOURCE_REGISTRY_REFERENCE_DATE, 'Source Registry reference date must be stable.');
assert.equal(new Set(sourceIds).size, sourceIds.length, 'Source Registry source ids must be unique.');
assert.ok(registry.records.length >= 9, 'Source Registry must include initial governed records.');
assert.equal(publicRecords.length, registry.records.length, 'Initial public registry records must be disclosure eligible.');

for (const sourceClass of ['AUTHORITATIVE_SOURCE', 'LICENSED_PROFESSIONAL_SOURCE', 'SUPPLEMENTAL_SOURCE', 'REIE_DERIVED_INTELLIGENCE'] as const) {
  assert.ok(registry.records.some((item) => item.sourceClass === sourceClass), `Expected source class ${sourceClass}.`);
}

for (const state of ['ACTIVE_AUTHORIZED', 'AWAITING_PROVIDER_CONFIRMATION', 'BLOCKED_NOT_AUTHORIZED', 'REFERENCE_ONLY', 'REIE_DERIVED'] as const) {
  assert.ok(registry.records.some((item) => item.productionActivationState === state), `Expected activation state ${state}.`);
}

const assessor = record('SRC-BOULDER-COUNTY-ASSESSOR');
assert.equal(assessor.publicName, 'Boulder County Assessor');
assert.equal(assessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(assessor.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(assessor.claimEligible, false);
assert.match(assessor.currentReieUse, /Identified source candidate only/);
assert.match(assessor.currentReieUse, /no automated retrieval/);

const permitSourceIds = [
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
] as const;
assert.equal(registry.records.filter((item) => permitSourceIds.includes(item.sourceId as (typeof permitSourceIds)[number])).length, permitSourceIds.length);
for (const sourceId of permitSourceIds) {
  const permit = record(sourceId);
  assert.equal(permit.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(permit.category, 'BUILDING_PERMITS');
  assert.equal(permit.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(permit.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(permit.claimEligible, false);
  assert.equal(permit.customerDisclosureEligible, true);
  assert.match(permit.currentReieUse, /Verification prompt only/);
  assert.match(permit.currentReieUse, /no .* retrieval/);
  assert.match(permit.currentReieUse, /no .* customer display/);
  assert.ok(permit.limitations.some((limitation) => /rights|access|freshness|attribution|privacy|automation|display/i.test(limitation)));
}
assert.equal(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').responsibleOrganization, 'Boulder County Community Planning & Permitting / Accela');
assert.match(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').limitations.join(' '), /Open-data availability does not establish unrestricted reuse/);
assert.match(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').limitations.join(' '), /Portal availability does not establish approved automated access/);
assert.match(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').limitations.join(' '), /Boulder County channel only; no municipal authority inference/);
const permitCandidate = record('SRC-BOULDER-PERMIT-CANDIDATES');
assert.match(permitCandidate.currentReieUse, /Source-candidate and verification-prompt context only/);
assert.match(permitCandidate.currentReieUse, /no permit record is retrieved or displayed/);
assert.doesNotMatch(permitCandidate.currentReieUse, /aggregate|member|parent|child/i);
assert.doesNotMatch(JSON.stringify(permitCandidate), /memberSourceIds|parentSourceId|aggregateSource/i);
assert.ok(!fs.existsSync('lib/sourceQualityCityBoulderOpenDataPermitsEvidence.ts'));
assert.ok(!fs.existsSync('lib/sourceQualityCityBoulderBuildingPermitsPortalEvidence.ts'));
assert.ok(!fs.existsSync('lib/sourceQualityBoulderCountyAccelaPermitsEvidence.ts'));

for (const sourceId of ['SRC-BCOD-ADDRESS-POINTS', 'SRC-BCOD-PARK-BOUNDARIES']) {
  const bcod = record(sourceId);
  assert.equal(bcod.responsibleOrganization, 'Boulder County Open Data');
  assert.equal(bcod.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(bcod.claimEligible, false);
  assert.ok(
    bcod.limitations.some((limitation) => limitation.includes('No API use, download, persistence, transformation, geometry, map rendering')),
    `${sourceId} must preserve no-activation BCOD boundaries.`,
  );
}

for (const sourceId of ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE']) {
  const derived = record(sourceId);
  assert.equal(derived.sourceClass, 'REIE_DERIVED_INTELLIGENCE');
  assert.equal(derived.productionActivationState, 'REIE_DERIVED');
  assert.equal(derived.officialUrl, null);
}

for (const [boundary, value] of Object.entries(registry.protectedBoundaries)) {
  assert.equal(value, false, `Protected boundary ${boundary} must remain false.`);
}

assert.ok(
  registry.statewideScalingContract.some((item) => item.includes('A Boulder County source decision does not authorize another county')),
  'Statewide scaling contract must prevent Boulder decisions from authorizing statewide use.',
);

const sourcesPage = read('app/sources/page.tsx');
assert.match(sourcesPage, /Sources & Methodology/, 'Sources page must expose public methodology title.');
assert.match(sourcesPage, /getPublicSourceRegistryRecords/, 'Sources page must use governed registry records.');
assert.match(sourcesPage, /data-testid="sources-registry-records"/, 'Sources page must expose registry record collection handle.');
assert.match(sourcesPage, /data-source-activation-state/, 'Sources page must expose activation state metadata.');
assert.match(sourcesPage, /authorized automated use/, 'Sources page must explain public availability is not automation authorization.');
assert.doesNotMatch(sourcesPage, /process\.env|api key|credential|secret|internal endpoint/i, 'Sources page must not expose private integration details.');

const publicTrustSource = read('lib/publicTrust.ts');
const footer = read('components/Footer.tsx');
const sitemap = read('app/sitemap.ts');
assert.match(publicTrustSource, /href:\s*'\/sources'/, 'Public trust routes must include /sources.');
assert.match(footer, /publicTrustRoutes/, 'Footer must render governed public trust routes.');
assert.match(sitemap, /publicTrustRoutes/, 'Sitemap must include governed public trust routes.');

const grandPlanPage = read('app/grand-plan/page.tsx');
assert.match(grandPlanPage, /data-grand-plan-advancement="SOURCE_REGISTRY_GRAND_PLAN_ADVANCEMENT"/, 'Grand Plan must expose advancement marker.');
assert.match(grandPlanPage, /data-testid="grand-plan-decision-orchestration"/, 'Grand Plan must expose decision orchestration section.');
assert.match(grandPlanPage, /data-testid="grand-plan-certified-continuity"/, 'Grand Plan must expose certified continuity section.');
assert.match(grandPlanPage, /href: '\/sources'/, 'Grand Plan continuity must link Sources & Methodology.');
assert.match(grandPlanPage, /data-grand-plan-hidden-state-transfer="false"/, 'Grand Plan must preserve no hidden state transfer.');
assert.match(grandPlanPage, /data-grand-plan-scoring="false"/, 'Grand Plan must preserve no-scoring boundary.');
assert.match(grandPlanPage, /data-grand-plan-telemetry="false"/, 'Grand Plan must preserve no-telemetry boundary.');
assert.doesNotMatch(grandPlanPage, /localStorage|sessionStorage|navigator\.sendBeacon|data-grand-plan-scoring="true"/, 'Grand Plan must not introduce hidden state or telemetry.');
assert.ok(!fs.existsSync('app/api/grand-plan/route.ts'), 'Grand Plan must not introduce a duplicate API route.');

const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');
assert.match(packageJson, /check:reie-source-registry-grand-plan-advancement/, 'Package scripts must expose the advancement check.');
assert.match(workerConfig, /scripts\/checkReieSourceRegistryGrandPlanAdvancement\.ts/, 'Worker build must include the advancement check.');
assert.match(workerConfig, /lib\/sourceRegistry\.ts/, 'Worker build must include the Source Registry.');

console.log(
  `[reie-source-registry-grand-plan-advancement] ok: ${registry.records.length} source records, public /sources methodology, Grand Plan orchestration, certified continuity, statewide source boundaries, and protected no-activation contract verified.`,
);
