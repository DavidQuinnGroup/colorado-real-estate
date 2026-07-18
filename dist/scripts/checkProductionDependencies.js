import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const requireFromProject = createRequire(join(process.cwd(), 'package.json'));
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const requiredDependencies = [
    {
        name: 'recharts',
        reason: 'Market chart components import Recharts and Vercel type-checks them during production builds.',
    },
    {
        name: '@prisma/client',
        reason: 'Application routes and worker scripts import the generated Prisma runtime client.',
    },
    {
        name: 'next',
        reason: 'The production build and app route runtime depend on Next.js.',
    },
    {
        name: 'react',
        reason: 'Client and server components import React runtime APIs.',
    },
    {
        name: 'react-dom',
        reason: 'Next.js production rendering depends on React DOM.',
    },
];
function fail(message) {
    console.error(`[production-dependencies] ${message}`);
    process.exit(1);
}
for (const dependency of requiredDependencies) {
    const declaredVersion = packageJson.dependencies?.[dependency.name] ?? packageJson.devDependencies?.[dependency.name];
    if (!declaredVersion) {
        fail(`${dependency.name} is not declared in package.json. ${dependency.reason}`);
    }
    try {
        requireFromProject.resolve(`${dependency.name}/package.json`);
    }
    catch {
        fail(`${dependency.name}@${declaredVersion} is declared but cannot be resolved from the project.`);
    }
}
console.log(`[production-dependencies] ok: verified ${requiredDependencies.length} declared production dependencies.`);
