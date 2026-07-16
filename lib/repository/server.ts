import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
}

if (!serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
}

export const repositorySupabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export type RepositoryHealthSummary = {
  total_objects: number;
  canonical_objects: number;
  operational_objects: number;
  missing_governing_authority: number;
  missing_steward: number;
  orphan_objects: number;
  platform_traceability_gaps: number;
  capability_lineage_gaps: number;
  governance_completeness_pct: number | null;
  stewardship_completeness_pct: number | null;
  relationship_completeness_pct: number | null;
};

export type RepositoryObjectSummary = {
  id: string;
  rid: string;
  cid: string | null;
  family: string;
  object_type: string;
  official_name: string;
  lifecycle_state: string;
  approval_status: string;
  governing_authority: string | null;
  primary_steward_rid: string | null;
  updated_at: string;
};

export type RepositoryObjectDetail = RepositoryObjectSummary & {
  namespace: string;
  display_name: string | null;
  short_name: string | null;
  slug: string;
  canonical_definition: string | null;
  purpose: string | null;
  scope: string | null;
  exclusions: string | null;
  description: string | null;
  enterprise_domain: string | null;
  architecture_layer: string | null;
  capability_domain: string | null;
  canon_collection: string | null;
  stability_class: string;
  version_major: number;
  version_minor: number;
  version_patch: number;
  effective_at: string | null;
  next_review_at: string | null;
  governing_publication_rid: string | null;
  governing_office_rid: string | null;
  implementation_owner: string | null;
  technical_location: string | null;
  runtime_status: string | null;
  evidence_status: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type RepositoryRelationshipView = {
  relationship_rid: string;
  relationship_type_code: string;
  status: string;
  traceability_status: string;
  confidence: number | null;
  notes: string | null;
  direction: "OUTGOING" | "INCOMING";
  related_rid: string;
  related_name: string;
  related_family: string;
};

export async function getRepositoryHealth(): Promise<RepositoryHealthSummary> {
  const { data, error } = await repositorySupabase
    .from("repository_health_summary")
    .select("*")
    .single();

  if (error) {
    throw new Error(`Unable to load Repository health: ${error.message}`);
  }

  return data as RepositoryHealthSummary;
}

export async function getRepositoryObjects(params?: {
  family?: string;
  lifecycle?: string;
  query?: string;
  limit?: number;
}): Promise<RepositoryObjectSummary[]> {
  const limit = Math.min(Math.max(params?.limit ?? 100, 1), 500);

  let query = repositorySupabase
    .from("repository_object")
    .select(
      [
        "id",
        "rid",
        "cid",
        "family",
        "object_type",
        "official_name",
        "lifecycle_state",
        "approval_status",
        "governing_authority",
        "primary_steward_rid",
        "updated_at",
      ].join(","),
    )
    .order("official_name", { ascending: true })
    .limit(limit);

  if (params?.family) {
    query = query.eq("family", params.family);
  }

  if (params?.lifecycle) {
    query = query.eq("lifecycle_state", params.lifecycle);
  }

  if (params?.query) {
    const escaped = params.query.replaceAll(",", " ");
    query = query.or(
      `official_name.ilike.%${escaped}%,rid.ilike.%${escaped}%,cid.ilike.%${escaped}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Unable to load Repository objects: ${error.message}`);
  }

  return (data ?? []) as unknown as RepositoryObjectSummary[];
}

export async function getRepositoryObjectByRid(
  rid: string,
): Promise<{
  object: RepositoryObjectDetail;
  relationships: RepositoryRelationshipView[];
} | null> {
  const { data: object, error: objectError } = await repositorySupabase
    .from("repository_object")
    .select("*")
    .eq("rid", rid)
    .maybeSingle();

  if (objectError) {
    throw new Error(`Unable to load Repository object: ${objectError.message}`);
  }

  if (!object) {
    return null;
  }

  const { data: outgoing, error: outgoingError } = await repositorySupabase
    .from("repository_relationship")
    .select(
      `
        relationship_rid,
        relationship_type_code,
        status,
        traceability_status,
        confidence,
        notes,
        target:repository_object!repository_relationship_target_object_id_fkey (
          rid,
          official_name,
          family
        )
      `,
    )
    .eq("source_object_id", object.id)
    .order("relationship_type_code");

  if (outgoingError) {
    throw new Error(
      `Unable to load outgoing relationships: ${outgoingError.message}`,
    );
  }

  const { data: incoming, error: incomingError } = await repositorySupabase
    .from("repository_relationship")
    .select(
      `
        relationship_rid,
        relationship_type_code,
        status,
        traceability_status,
        confidence,
        notes,
        source:repository_object!repository_relationship_source_object_id_fkey (
          rid,
          official_name,
          family
        )
      `,
    )
    .eq("target_object_id", object.id)
    .order("relationship_type_code");

  if (incomingError) {
    throw new Error(
      `Unable to load incoming relationships: ${incomingError.message}`,
    );
  }

  const relationships: RepositoryRelationshipView[] = [
    ...(outgoing ?? []).map((row: any) => ({
      relationship_rid: row.relationship_rid,
      relationship_type_code: row.relationship_type_code,
      status: row.status,
      traceability_status: row.traceability_status,
      confidence: row.confidence,
      notes: row.notes,
      direction: "OUTGOING" as const,
      related_rid: row.target.rid,
      related_name: row.target.official_name,
      related_family: row.target.family,
    })),
    ...(incoming ?? []).map((row: any) => ({
      relationship_rid: row.relationship_rid,
      relationship_type_code: row.relationship_type_code,
      status: row.status,
      traceability_status: row.traceability_status,
      confidence: row.confidence,
      notes: row.notes,
      direction: "INCOMING" as const,
      related_rid: row.source.rid,
      related_name: row.source.official_name,
      related_family: row.source.family,
    })),
  ];

  return {
    object: object as RepositoryObjectDetail,
    relationships,
  };
}
