import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const globals = read('app/globals.css');
const adminLayout = read('app/admin/layout.tsx');
const adminPanel = read('components/admin/MasterControlPanel.tsx');
const proof = read('components/AgentConversationPreparationCompositionProof.tsx');
const market = read('app/market/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const cssDirectory = resolve(root, '.next/static/css');

assert(globals.includes('@import "tailwindcss";'), 'globals.css must use the Tailwind v4 CSS entrypoint');
assert(globals.includes('@config "../tailwind.config.js";'), 'globals.css must explicitly preserve the legacy Tailwind theme configuration');
assert(!/@tailwind\s+(?:base|components|utilities)/.test(globals), 'removed Tailwind v3 entry directives must not remain');
assert(existsSync(resolve(root, 'postcss.config.mjs')), 'the canonical PostCSS configuration must exist');
assert(!existsSync(resolve(root, 'postcss.config.js')), 'the duplicate PostCSS configuration must remain absent');
assert.equal(packageJson.scripts?.['check:tailwind-v4-style-pipeline'], 'jiti scripts/checkTailwindV4StylePipeline.ts');

for (const marker of ['fixed inset-0 z-50 overflow-auto']) assert(adminLayout.includes(marker), `admin layout lost required viewport marker: ${marker}`);
for (const marker of ['max-w-7xl', 'px-5', 'sm:px-8', 'xl:grid-cols-4']) assert(adminPanel.includes(marker), `admin panel lost structural utility: ${marker}`);
for (const marker of ['max-w-7xl', 'px-5', 'lg:px-12', 'lg:grid-cols-2']) assert(proof.includes(marker), `proof lost structural utility: ${marker}`);
for (const marker of ['max-w-6xl', 'px-5', 'sm:px-8', 'lg:px-12', 'lg:grid-cols-[0.9fr_1.1fr]']) assert(market.includes(marker), `market lost structural utility: ${marker}`);

assert(existsSync(cssDirectory), 'run npm run build before the stylesheet regression checker');
const emittedCss = readdirSync(cssDirectory)
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(resolve(cssDirectory, file), 'utf8'))
  .join('\n');
assert(emittedCss.length > 0, 'production CSS output must not be empty');

for (const utility of [
  '.fixed',
  '.inset-0',
  '.overflow-auto',
  '.max-w-7xl',
  '.px-5',
  '.grid',
  '.gap-5',
  '.font-black',
  '.text-3xl',
  '.sm\\:px-8',
  '.lg\\:px-12',
  '.lg\\:grid-cols-2',
  '.xl\\:grid-cols-4',
]) {
  assert(emittedCss.includes(utility), `missing emitted Tailwind utility: ${utility}`);
}

console.log('TAILWIND_V4_STYLE_PIPELINE_CHECK: PASS');
