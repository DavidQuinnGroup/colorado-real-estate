import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync('app/agent/design-system/visual-certification/client-readiness/page.tsx', 'utf8');
const fixture = readFileSync('components/agent/ClientCaseReadinessVisualFixture.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseReadinessVisualFixture.module.css', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');

assert.match(page, /ClientCaseReadinessVisualFixture/);
assert.match(page, /index: false/);
assert.match(fixture, /Static synthetic interface only/);
assert.match(fixture, /atlas-ds-root atlas-ds-shell-agent/);
assert.match(fixture, /AtlasField/);
assert.match(fixture, /AtlasNotice/);
assert.match(fixture, /AtlasStatusLabel/);
assert.match(fixture, /No active scenarios/);
assert.doesNotMatch(fixture, /fetch\(|prisma|createClientCase|scenarioService|readinessService|\/api\//i);
assert.match(styles, /@media \(max-width: 760px\)/);
assert.match(auth, /\/agent\/design-system\/visual-certification\/client-readiness/);

console.log('client-case-agent-readiness-visual-structure: PASS');
