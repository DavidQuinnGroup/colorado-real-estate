import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  REIE_LEGACY_CAPABILITY_DISPOSITIONS,
  REIE_LEGACY_CAPABILITY_PROTECTED_CONSUMER_ROOTS,
} from '../lib/reieLegacyCapabilityDisposition.js';

type SourceFile = { relativePath: string; absolutePath: string };
type ImportEdge = { importer: string; target: string };

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieLegacyCapabilityDisposition.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail']) {
  assert.equal(source.includes(token), false, `legacy consumer rules must not depend on ${token}`);
}

function collectSourceFiles(relativeDirectory: string): SourceFile[] {
  const absoluteDirectory = path.resolve(process.cwd(), relativeDirectory);
  if (!fs.existsSync(absoluteDirectory)) return [];
  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name).replaceAll(path.sep, '/');
    if (entry.isDirectory()) return collectSourceFiles(relativePath);
    if (!/\.(?:ts|tsx|mts|cts|js|jsx)$/.test(entry.name)) return [];
    return [{ relativePath, absolutePath: path.resolve(process.cwd(), relativePath) }];
  });
}

const files = [
  ...collectSourceFiles('app'),
  ...collectSourceFiles('components'),
  ...collectSourceFiles('lib'),
  ...collectSourceFiles('scripts'),
].filter((file) => !file.relativePath.startsWith('dist/'));

function normalizeModulePath(relativePath: string) {
  return relativePath.replace(/\.(?:ts|tsx|mts|cts|js|jsx)$/, '').replace(/\/index$/, '');
}

function resolveImport(importer: string, specifier: string) {
  if (specifier.startsWith('@/')) return normalizeModulePath(specifier.slice(2));
  if (!specifier.startsWith('.')) return null;
  return normalizeModulePath(path.posix.normalize(path.posix.join(path.posix.dirname(importer), specifier)));
}

function getImportEdges(file: SourceFile): ImportEdge[] {
  const contents = fs.readFileSync(file.absolutePath, 'utf8');
  const edges: ImportEdge[] = [];
  const importPattern = /(?:from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;
  for (const match of contents.matchAll(importPattern)) {
    const target = resolveImport(file.relativePath, match[1]);
    if (target) edges.push({ importer: normalizeModulePath(file.relativePath), target });
  }
  return edges;
}

const edges = files.flatMap(getImportEdges);
const dispositionsByPath = new Map(REIE_LEGACY_CAPABILITY_DISPOSITIONS.map((record) => [normalizeModulePath(record.path), record]));
const protectedRootFiles = files.filter((file) => REIE_LEGACY_CAPABILITY_PROTECTED_CONSUMER_ROOTS.some((root) => file.relativePath === root || file.relativePath.startsWith(`${root}/`))).map((file) => normalizeModulePath(file.relativePath));

for (const record of REIE_LEGACY_CAPABILITY_DISPOSITIONS) {
  const target = normalizeModulePath(record.path);
  const actualConsumers = edges.filter((edge) => edge.target === target).map((edge) => edge.importer).sort();
  assert.deepEqual(actualConsumers, [...record.directConsumers.map(normalizeModulePath)].sort(), `${record.path} exact consumer evidence changed`);
  for (const edge of edges.filter((candidate) => candidate.target === target)) {
    const importerRecord = dispositionsByPath.get(edge.importer);
    const isGovernedLegacyException = record.governedImportExceptions.map(normalizeModulePath).includes(edge.importer);
    if (protectedRootFiles.includes(edge.importer) && !isGovernedLegacyException) {
      assert.fail(`${record.path} is imported by protected consumer ${edge.importer}`);
    }
    if (importerRecord) assert.ok(isGovernedLegacyException, `${record.path} legacy edge from ${edge.importer} must be explicitly governed`);
  }
}

for (const protectedRoot of protectedRootFiles) {
  const protectedEdges = edges.filter((edge) => edge.importer === protectedRoot);
  for (const edge of protectedEdges) {
    const targetRecord = dispositionsByPath.get(edge.target);
    if (!targetRecord) continue;
    assert.fail(`${protectedRoot} imports designated legacy artifact ${targetRecord.path}`);
  }
}

assert.ok(files.some((file) => file.relativePath === 'app/grand-plan/page.tsx'));
assert.ok(files.some((file) => file.relativePath === 'components/BuyerFinancingDecisionPlanner.tsx'));
assert.ok(files.some((file) => file.relativePath === 'lib/multiDimensionalStrategyOrchestration.ts'));
assert.equal(edges.some((edge) => edge.importer === 'app/grand-plan/page' && edge.target.includes('strategyGenerator')), false);
assert.equal(edges.some((edge) => edge.importer === 'lib/multiDimensionalStrategyOrchestration' && edge.target.includes('strategyGenerator')), false);

console.log('[reie-legacy-import-consumer-safety] ok: static import graph, exact legacy exceptions, public/customer route protection, certified contract protection, Module 8 protection, and no-refactor posture verified.');
