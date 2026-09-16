import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

type BuildContract = Readonly<{
  build: string | undefined;
  nextConfig: string;
}>;

function assertProductionBuildValidationContract({ build, nextConfig }: BuildContract) {
  assert.equal(
    build,
    'prisma generate && npm run lint && next build && npm run typecheck',
    'The production build must serialize Prisma generation, lint, Next compilation, and the final generated-route-aware typecheck.',
  );
  assert.match(nextConfig, /eslint:\s*\{\s*ignoreDuringBuilds:\s*true,?\s*\}/);
  assert.match(nextConfig, /typescript:\s*\{\s*ignoreBuildErrors:\s*true,?\s*\}/);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const nextConfig = readFileSync('next.config.ts', 'utf8');

assert.equal(packageJson.scripts?.['check:production-build-validation'], 'jiti scripts/checkProductionBuildValidation.ts');
assertProductionBuildValidationContract({ build: packageJson.scripts?.build, nextConfig });

assert.throws(() => assertProductionBuildValidationContract({ build: 'prisma generate && npm run lint && next build', nextConfig }));
assert.throws(() => assertProductionBuildValidationContract({ build: 'prisma generate && next build && npm run typecheck', nextConfig }));

console.log('production-build-validation: PASS');
