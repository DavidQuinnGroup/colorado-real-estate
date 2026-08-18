import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceExtensions = ['.ts', '.tsx', '.mts', '.js', '.jsx'];
const appRoot = path.resolve(root, 'app');
const runtimeEntryFiles: string[] = [];

function collectRuntimeEntries(directory: string) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api' || entry.name === 'admin') continue;
      collectRuntimeEntries(filePath);
      continue;
    }

    if (sourceExtensions.includes(path.extname(entry.name))) runtimeEntryFiles.push(filePath);
  }
}

collectRuntimeEntries(appRoot);

function candidatePaths(filePath: string) {
  const extension = path.extname(filePath);
  const candidates: string[] = [];
  if (['.js', '.jsx', '.mjs', '.cjs'].includes(extension)) {
    const withoutExtension = filePath.slice(0, -extension.length);
    for (const sourceExtension of sourceExtensions) candidates.push(`${withoutExtension}${sourceExtension}`);
  } else {
    candidates.push(filePath);
    for (const sourceExtension of sourceExtensions) candidates.push(`${filePath}${sourceExtension}`);
  }
  for (const sourceExtension of sourceExtensions) candidates.push(path.join(filePath, `index${sourceExtension}`));
  return candidates;
}

function resolveLocalImport(specifier: string, importer: string) {
  const unresolvedPath = specifier.startsWith('@/')
    ? path.resolve(root, specifier.slice(2))
    : specifier.startsWith('.')
      ? path.resolve(path.dirname(importer), specifier)
      : null;
  if (!unresolvedPath) return null;
  return candidatePaths(unresolvedPath).find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

const importPattern = /(?:\bfrom\s*|\bimport\s*\()\s*['"]([^'"]+)['"]/g;
const queue = [...runtimeEntryFiles];
const visited = new Set<string>();
const violations: string[] = [];

while (queue.length > 0) {
  const importer = queue.pop();
  if (!importer || visited.has(importer)) continue;
  visited.add(importer);

  const source = fs.readFileSync(importer, 'utf8');
  importPattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = importPattern.exec(source)) !== null) {
    const specifier = match[1];
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;

    const target = resolveLocalImport(specifier, importer);
    if (specifier.endsWith('.js')) {
      if (!target) {
        violations.push(`${path.relative(root, importer)} -> ${specifier}: unresolved local source import`);
      } else if (['.ts', '.tsx', '.mts'].includes(path.extname(target))) {
        violations.push(`${path.relative(root, importer)} -> ${specifier}: use an extensionless source import for ${path.relative(root, target)}`);
      }
    }

    if (target) queue.push(target);
  }
}

assert.equal(violations.length, 0, `Public runtime source import resolution violations:\n${violations.join('\n')}`);
console.log(`[runtime-source-import-resolution] PASS: ${runtimeEntryFiles.length} public app entry files, ${visited.size} reachable source files, no local .js-to-TypeScript source imports.`);
