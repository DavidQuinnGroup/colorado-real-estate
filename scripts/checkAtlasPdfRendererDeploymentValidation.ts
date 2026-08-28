import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION,
  ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE,
  ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION,
  buildAtlasPdfRuntimeVersion,
  resolveAtlasPdfChromiumExecutable,
  resolveAtlasPdfRuntimeEnvironment,
} from '../lib/atlasPdfDeploymentRuntime';

const route = readFileSync('app/api/agent/output/pdf/route.ts', 'utf8');
const renderer = readFileSync('lib/atlasPdfRenderer.ts', 'utf8');
const config = readFileSync('next.config.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

assert.equal(ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_VERSION, 'ATLAS_PDF_DEPLOYMENT_RUNTIME_CONTRACT_V1');
assert.equal(ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION, 'PLAYWRIGHT_CORE_SPARTICUZ_CHROMIUM_ADAPTER_V1');
assert.equal(ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE, '@sparticuz/chromium@149.0.0');
assert.equal(resolveAtlasPdfRuntimeEnvironment({}), 'LOCAL_DEVELOPMENT');
assert.equal(resolveAtlasPdfRuntimeEnvironment({ NODE_ENV: 'test' }), 'TEST');
assert.equal(resolveAtlasPdfRuntimeEnvironment({ VERCEL: '1' }), 'DEPLOYED_SERVER');
assert.equal(resolveAtlasPdfRuntimeEnvironment({ ATLAS_PDF_RUNTIME_OVERRIDE: 'DEPLOYED_SERVER' }), 'DEPLOYED_SERVER');

const local = await resolveAtlasPdfChromiumExecutable('LOCAL_DEVELOPMENT');
assert.equal(local.environment, 'LOCAL_DEVELOPMENT');
assert.equal(local.source, 'PLAYWRIGHT_BUNDLED_CHROMIUM');
assert.equal(local.headless, true);
assert.equal(local.args.length, 0);
assert(existsSync(local.executablePath), 'local Chromium executable must resolve');

const runtimeVersion = buildAtlasPdfRuntimeVersion({
  environment: 'DEPLOYED_SERVER',
  chromiumPackage: ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE,
  chromiumVersion: '149.0.0',
  playwrightVersion: '1.62.1',
});
assert.equal(runtimeVersion.adapterVersion, ATLAS_PDF_DEPLOYMENT_ADAPTER_VERSION);
assert.equal(runtimeVersion.deploymentRuntime, 'DEPLOYED_SERVER');
assert.equal(runtimeVersion.chromiumPackage, ATLAS_PDF_DEPLOYMENT_CHROMIUM_PACKAGE);

for (const token of [
  "export const runtime = 'nodejs'",
  "export const preferredRegion = 'iad1'",
  'export const maxDuration = 60',
  'authorizeAdminRequest',
  'identityType !== \'HUMAN_AGENT\'',
  'role !== \'AGENT\'',
  'X-Atlas-Pdf-Runtime-Environment',
  'X-Atlas-Pdf-Runtime-Adapter-Version',
  'X-Atlas-Pdf-Chromium-Package',
  'X-Atlas-Pdf-Chromium-Version',
  'X-Atlas-Pdf-Duration-Ms',
]) assert(route.includes(token), `route missing deployment token ${token}`);

for (const token of [
  'resolveAtlasPdfRuntimeEnvironment',
  'resolveAtlasPdfChromiumExecutable',
  'resolveAtlasPdfPlaywrightChromium',
  'resolveRuntimePackageVersion',
  "requireFromRuntime.resolve(packageName)",
  'runAtlasPdfStructuralQaForRuntime',
  'LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH',
  'page.close',
  'browser.close',
  'unlinkSync(tempPath)',
  'ATLAS_PDF_RENDERER_RUNTIME_FAILURE',
  'errorMessage: runtimeError.message',
]) assert(renderer.includes(token), `renderer missing deployment policy ${token}`);

assert.equal(
  renderer.includes("requireFromRuntime(`${runtimeEnvironment === 'DEPLOYED_SERVER' ? 'playwright-core' : 'playwright'}/package.json`)"),
  false,
  'renderer must not import Playwright package metadata through the package exports boundary',
);

for (const token of [
  "'/api/agent/output/pdf': ['./node_modules/@sparticuz/chromium/bin/**']",
  "serverExternalPackages: ['@sparticuz/chromium', 'playwright-core']",
]) assert(config.includes(token), `next config missing deployment trace policy ${token}`);

assert.equal(packageJson.dependencies?.['@sparticuz/chromium'], '149.0.0');
assert.equal(packageJson.dependencies?.['pdfjs-dist'], '5.4.530');
assert.equal(packageJson.scripts?.['check:atlas-pdf-renderer-deployment-validation'], 'jiti scripts/checkAtlasPdfRendererDeploymentValidation.ts');

console.log('ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_CHECK: PASS');
