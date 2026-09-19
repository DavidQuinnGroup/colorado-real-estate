import { EXTERNAL_SCHEMA_OWNERSHIP } from './canonicalSchemaOwnership';

export const CANONICAL_DATABASE_BASELINE = Object.freeze({
  identity: '20260919_production_aligned_hybrid_v1',
  canonicalSchemaCommit: 'd5216387641c32b60f68f50f488a2ec342c505da',
  artifactPath: 'prisma/baseline/20260919_production_aligned_hybrid_v1/schema.sql',
  historicalMigrationCutoff: '20260919000000_canonical_schema_reconciliation_v1',
  requiredExtensions: ['pgcrypto'],
  postgres: {
    localCertification: '16.15',
    productionObserved: '17.6',
    postgisRequired: false,
  },
  freshDatabaseRules: {
    businessData: 'EMPTY',
    leadInteractionForeignKeys: 'VALID',
    cityNeighborhood: 'INCLUDED_FROM_CANONICAL_PRISMA_SCHEMA',
  },
  externalSchemaPolicy: {
    ownershipSource: 'lib/schema/canonicalSchemaOwnership.ts',
    projectAtlasOwned: EXTERNAL_SCHEMA_OWNERSHIP.PROJECT_ATLAS_OWNED_EXTERNAL_TO_PRISMA,
    legacyButActive: EXTERNAL_SCHEMA_OWNERSHIP.LEGACY_BUT_ACTIVE,
    providerAuthAdjacent: EXTERNAL_SCHEMA_OWNERSHIP.PROVIDER_AUTH_ADJACENT,
    bootstrapDisposition: 'DEFERRED_TO_OWNING_SUBSYSTEM_OR_PROVIDER',
  },
  intentionalProductionDifferences: [
    'Fresh bootstrap contains no business data.',
    'LeadInteraction foreign keys are valid on an empty fresh database; production constraints remain NOT VALID pending separate validation authorization.',
    'City and Neighborhood are included because they remain canonical Prisma models, while their production absence is a dormant historical distinction.',
  ],
  firstForwardMigration: 'OBJECTIVE_PROPERTY_RELATIONSHIP_FOUNDATION_WAVE_A',
} as const);

export const CANONICAL_BASELINE_LOCAL_DATABASES = Object.freeze([
  'atlas_canonical_baseline_run1',
  'atlas_canonical_baseline_run2',
  'atlas_canonical_baseline_path_a',
  'atlas_canonical_baseline_path_b',
]);
