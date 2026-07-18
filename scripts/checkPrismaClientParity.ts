import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type RequiredPrismaModel = {
  model: string;
  accessor: string;
};

const generatedClientPath = join(
  process.cwd(),
  'node_modules',
  '.prisma',
  'client',
  'index.d.ts'
);

const requiredModels: RequiredPrismaModel[] = [
  { model: 'REIEControlState', accessor: 'rEIEControlState' },
  { model: 'Property', accessor: 'property' },
  { model: 'User', accessor: 'user' },
  { model: 'SavedSearch', accessor: 'savedSearch' },
  { model: 'AlertQueue', accessor: 'alertQueue' },
  { model: 'CRMTask', accessor: 'cRMTask' },
  { model: 'UserPreference', accessor: 'userPreference' },
  { model: 'UnsubscribeToken', accessor: 'unsubscribeToken' },
];

function fail(message: string): never {
  console.error(`[prisma-client-parity] ${message}`);
  process.exit(1);
}

if (!existsSync(generatedClientPath)) {
  fail(
    `Generated Prisma Client type file is missing at ${generatedClientPath}. Run "npx prisma generate".`
  );
}

const generatedTypes = readFileSync(generatedClientPath, 'utf8');
const missingModels: string[] = [];
const missingAccessors: string[] = [];

for (const requiredModel of requiredModels) {
  if (!generatedTypes.includes(requiredModel.model)) {
    missingModels.push(requiredModel.model);
  }

  if (!generatedTypes.includes(`get ${requiredModel.accessor}()`)) {
    missingAccessors.push(requiredModel.accessor);
  }
}

if (missingModels.length > 0 || missingAccessors.length > 0) {
  const details = [
    missingModels.length > 0 ? `missing models: ${missingModels.join(', ')}` : '',
    missingAccessors.length > 0
      ? `missing accessors: ${missingAccessors.join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('; ');

  fail(`Generated Prisma Client is out of sync with the launch schema (${details}).`);
}

console.log(
  `[prisma-client-parity] ok: verified ${requiredModels.length} generated Prisma model accessors.`
);
