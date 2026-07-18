import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

type ParsedVersion = {
  major: number;
  minor: number;
  patch: number;
};

const minimumPatchedVersion = '15.1.11';
const packageJsonPath = join(process.cwd(), 'package.json');
const requireFromProject = createRequire(packageJsonPath);

function fail(message: string): never {
  console.error(`[next-security-version] ${message}`);
  process.exit(1);
}

function parseVersion(version: string): ParsedVersion {
  const normalized = version.trim().replace(/^[^\d]*/, '');
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    fail(`Unable to parse Next.js version "${version}".`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function compareVersions(left: ParsedVersion, right: ParsedVersion) {
  if (left.major !== right.major) {
    return left.major - right.major;
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }

  return left.patch - right.patch;
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
const declaredVersion =
  packageJson.dependencies?.next ?? packageJson.devDependencies?.next ?? '';

if (!declaredVersion) {
  fail('Next.js is not declared in package.json.');
}

const installedPackagePath = requireFromProject.resolve('next/package.json');
const installedPackage = JSON.parse(readFileSync(installedPackagePath, 'utf8')) as {
  version?: string;
};

if (!installedPackage.version) {
  fail(`Installed Next.js package at ${installedPackagePath} does not expose a version.`);
}

const declared = parseVersion(declaredVersion);
const installed = parseVersion(installedPackage.version);
const floor = parseVersion(minimumPatchedVersion);

for (const [label, version] of [
  ['declared', declared],
  ['installed', installed],
] as const) {
  if (version.major === 15 && version.minor === 1 && compareVersions(version, floor) < 0) {
    fail(
      `${label} Next.js version is below the approved 15.1 security floor: ${minimumPatchedVersion}.`
    );
  }
}

console.log(
  `[next-security-version] ok: declared ${declaredVersion}, installed ${installedPackage.version}, floor ${minimumPatchedVersion}.`
);
