export const EXTERNAL_SCHEMA_OWNERSHIP = {
  PROJECT_ATLAS_OWNED_EXTERNAL_TO_PRISMA: [
    'email_replies',
    'repository_approval',
    'repository_audit_event',
    'repository_evidence',
    'repository_governance_exception',
    'repository_lifecycle_transition',
    'repository_measurement',
    'repository_metric_definition',
    'repository_object',
    'repository_object_alias',
    'repository_object_evidence',
    'repository_object_stewardship',
    'repository_object_tag',
    'repository_object_version',
    'repository_relationship',
    'repository_relationship_evidence',
    'repository_relationship_type',
    'repository_steward',
    'repository_tag',
  ],
  LEGACY_BUT_ACTIVE: [
    'leads',
    'listings',
    'mls_sync_runs',
    'mls_sync_state',
    'saved_searches',
  ],
  PROVIDER_AUTH_ADJACENT: ['profiles'],
  OBSOLETE_CANDIDATE: [],
  UNKNOWN: [],
} as const;

export const EXTERNAL_SCHEMA_TABLES = Object.freeze(
  Object.values(EXTERNAL_SCHEMA_OWNERSHIP).flatMap((tables) => tables),
);

export const EXTERNAL_SCHEMA_CROSS_SCHEMA_DEPENDENCIES = Object.freeze([
  'profiles.id -> auth.users.id',
  'leads.assigned_to -> auth.users.id',
]);

export const PRISMA_RAW_NAME_PRESERVATION = Object.freeze({
  foreignKeyConstraintNames: ['ClientAuthorizationConfirmationEvidence_clientAuthorizationPrin'],
});

export const PRISMA_SCHEMA_OWNERSHIP_SOURCE = 'prisma/schema.prisma';
