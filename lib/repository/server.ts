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

export const repositorySupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

export type RepositoryRelationshipSummary = {
  relationship_rid: string;
  relationship_type_code: string;
  status: string;
  traceability_status: string;
  confidence: number | null;
  notes: string | null;
  created_at: string;
  source: {
    rid: string;
    official_name: string;
    family: string;
  };
  target: {
    rid: string;
    official_name: string;
    family: string;
  };
};

export type RepositorySearchResult = {
  result_type: "OBJECT" | "RELATIONSHIP";
  score: number;
  title: string;
  subtitle: string;
  rid: string;
  href: string;
  family: string | null;
  object_type: string | null;
  relationship_type: string | null;
  matched_text: string | null;
};

type RepositoryRelationshipObjectRow = {
  rid: string;
  official_name: string;
  family: string;
};

type RepositoryRelationshipBaseRow = {
  relationship_rid: string;
  relationship_type_code: string;
  status: string;
  traceability_status: string;
  confidence: number | null;
  notes: string | null;
};

type RepositoryOutgoingRelationshipRow = RepositoryRelationshipBaseRow & {
  target: RepositoryRelationshipObjectRow;
};

type RepositoryIncomingRelationshipRow = RepositoryRelationshipBaseRow & {
  source: RepositoryRelationshipObjectRow;
};

type RepositorySearchObjectRow = {
  rid: string;
  cid: string | null;
  family: string;
  object_type: string;
  official_name: string;
  display_name: string | null;
  canonical_definition: string | null;
  purpose: string | null;
  description: string | null;
};

type RepositorySearchRelationshipRow = {
  relationship_rid: string;
  relationship_type_code: string;
  notes: string | null;
  source: RepositoryRelationshipObjectRow & {
    object_type: string;
  };
  target: RepositoryRelationshipObjectRow & {
    object_type: string;
  };
};

function normalizeQuery(value: string): string {
  return value.trim().replaceAll(",", " ").replace(/\s+/g, " ");
}

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
    const escaped = normalizeQuery(params.query);
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

  const outgoingRows =
    (outgoing ?? []) as unknown as RepositoryOutgoingRelationshipRow[];
  const incomingRows =
    (incoming ?? []) as unknown as RepositoryIncomingRelationshipRow[];

  const relationships: RepositoryRelationshipView[] = [
    ...outgoingRows.map((row) => ({
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
    ...incomingRows.map((row) => ({
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

export async function searchRepository(params: {
  query: string;
  family?: string;
  limit?: number;
}): Promise<RepositorySearchResult[]> {
  const q = normalizeQuery(params.query);
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 100);

  if (!q) {
    return [];
  }

  let objectQuery = repositorySupabase
    .from("repository_object")
    .select(
      [
        "rid",
        "cid",
        "official_name",
        "display_name",
        "short_name",
        "family",
        "object_type",
        "canonical_definition",
        "purpose",
        "description",
      ].join(","),
    )
    .or(
      [
        `official_name.ilike.%${q}%`,
        `display_name.ilike.%${q}%`,
        `short_name.ilike.%${q}%`,
        `rid.ilike.%${q}%`,
        `cid.ilike.%${q}%`,
        `canonical_definition.ilike.%${q}%`,
        `purpose.ilike.%${q}%`,
        `description.ilike.%${q}%`,
      ].join(","),
    )
    .limit(limit);

  if (params.family) {
    objectQuery = objectQuery.eq("family", params.family);
  }

  const { data: objects, error: objectError } = await objectQuery;

  if (objectError) {
    throw new Error(`Unable to search Repository objects: ${objectError.message}`);
  }

  const { data: relationships, error: relationshipError } =
    await repositorySupabase
      .from("repository_relationship")
      .select(
        `
          relationship_rid,
          relationship_type_code,
          notes,
          source:repository_object!repository_relationship_source_object_id_fkey (
            rid,
            official_name,
            family,
            object_type
          ),
          target:repository_object!repository_relationship_target_object_id_fkey (
            rid,
            official_name,
            family,
            object_type
          )
        `,
      )
      .or(`relationship_type_code.ilike.%${q}%,notes.ilike.%${q}%`)
      .limit(limit);

  if (relationshipError) {
    throw new Error(
      `Unable to search Repository relationships: ${relationshipError.message}`,
    );
  }

  const lower = q.toLowerCase();
  const objectRows = (objects ?? []) as unknown as RepositorySearchObjectRow[];
  const relationshipRows =
    (relationships ?? []) as unknown as RepositorySearchRelationshipRow[];

  const objectResults: RepositorySearchResult[] = objectRows.map((row) => {
    const exactRid =
      row.rid?.toLowerCase() === lower || row.cid?.toLowerCase() === lower;
    const exactName = row.official_name?.toLowerCase() === lower;
    const startsWith = row.official_name?.toLowerCase().startsWith(lower);

    let score = 50;
    if (exactRid) score = 100;
    else if (exactName) score = 95;
    else if (startsWith) score = 80;

    const matchedText =
      row.canonical_definition ??
      row.purpose ??
      row.description ??
      row.display_name ??
      null;

    return {
      result_type: "OBJECT",
      score,
      title: row.official_name,
      subtitle: `${row.family} · ${row.object_type}`,
      rid: row.rid,
      href: `/admin/repository/object/${encodeURIComponent(row.rid)}`,
      family: row.family,
      object_type: row.object_type,
      relationship_type: null,
      matched_text: matchedText,
    };
  });

  const relationshipResults: RepositorySearchResult[] = relationshipRows.map(
    (row) => ({
      result_type: "RELATIONSHIP",
      score:
        row.relationship_type_code?.toLowerCase() === lower
          ? 90
          : row.relationship_type_code?.toLowerCase().includes(lower)
            ? 70
            : 45,
      title: `${row.source.official_name} → ${row.target.official_name}`,
      subtitle: row.relationship_type_code,
      rid: row.relationship_rid,
      href: `/admin/repository/relationship/${encodeURIComponent(
        row.relationship_rid,
      )}`,
      family: null,
      object_type: null,
      relationship_type: row.relationship_type_code,
      matched_text: row.notes,
    }),
  );

  return [...objectResults, ...relationshipResults]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export async function getRepositoryRelationships(params?: {
  type?: string;
  status?: string;
  traceability?: string;
  limit?: number;
}): Promise<RepositoryRelationshipSummary[]> {
  const limit = Math.min(Math.max(params?.limit ?? 100, 1), 500);

  let query = repositorySupabase
    .from("repository_relationship")
    .select(
      `
        relationship_rid,
        relationship_type_code,
        status,
        traceability_status,
        confidence,
        notes,
        created_at,
        source:repository_object!repository_relationship_source_object_id_fkey (
          rid,
          official_name,
          family
        ),
        target:repository_object!repository_relationship_target_object_id_fkey (
          rid,
          official_name,
          family
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params?.type) {
    query = query.eq("relationship_type_code", params.type);
  }

  if (params?.status) {
    query = query.eq("status", params.status);
  }

  if (params?.traceability) {
    query = query.eq("traceability_status", params.traceability);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Unable to load Repository relationships: ${error.message}`,
    );
  }

  return (data ?? []) as unknown as RepositoryRelationshipSummary[];
}

export async function getRepositoryRelationshipByRid(
  relationshipRid: string,
): Promise<RepositoryRelationshipSummary | null> {
  const { data, error } = await repositorySupabase
    .from("repository_relationship")
    .select(
      `
        relationship_rid,
        relationship_type_code,
        status,
        traceability_status,
        confidence,
        notes,
        created_at,
        source:repository_object!repository_relationship_source_object_id_fkey (
          rid,
          official_name,
          family
        ),
        target:repository_object!repository_relationship_target_object_id_fkey (
          rid,
          official_name,
          family
        )
      `,
    )
    .eq("relationship_rid", relationshipRid)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load Repository relationship: ${error.message}`,
    );
  }

  return data as unknown as RepositoryRelationshipSummary | null;
}
