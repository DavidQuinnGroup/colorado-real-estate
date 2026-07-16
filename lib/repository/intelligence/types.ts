export type RepositoryNode = {
  id: string;
  rid: string;
  cid: string | null;
  official_name: string;
  family: string;
  object_type: string;
  lifecycle_state: string;
  stability_class: string;
  governing_authority: string | null;
  primary_steward_rid: string | null;
};

export type RepositoryEdge = {
  relationship_rid: string;
  relationship_type_code: string;
  status: string;
  traceability_status: string;
  confidence: number | null;
  source_object_id: string;
  target_object_id: string;
};

export type TraversalNode = RepositoryNode & {
  depth: number;
  via_relationship_rid: string | null;
  via_relationship_type: string | null;
  direction: "ROOT" | "UPSTREAM" | "DOWNSTREAM";
};

export type DependencyAnalysis = {
  root: RepositoryNode;
  max_depth: number;
  upstream: TraversalNode[];
  downstream: TraversalNode[];
  circular_paths: string[][];
  statistics: {
    upstream_count: number;
    downstream_count: number;
    total_unique_objects: number;
    max_observed_depth: number;
  };
};

export type ImpactRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ImpactAnalysis = {
  root: RepositoryNode;
  generated_at: string;
  risk: ImpactRisk;
  risk_score: number;
  direct_impacts: TraversalNode[];
  indirect_impacts: TraversalNode[];
  affected_by_family: Record<string, number>;
  affected_relationship_types: Record<string, number>;
  review_requirements: string[];
  summary: {
    total_affected_objects: number;
    direct_count: number;
    indirect_count: number;
    affected_capabilities: number;
    affected_platform_objects: number;
    affected_governance_objects: number;
    affected_publications: number;
  };
};

export type LineageAnalysis = {
  root: RepositoryNode;
  generated_at: string;
  upstream_paths: TraversalNode[];
  downstream_paths: TraversalNode[];
  constitutional_ancestors: TraversalNode[];
  implementation_descendants: TraversalNode[];
};

export type CoverageBreakdown = {
  key: string;
  total: number;
  governed: number;
  stewarded: number;
  related: number;
  traceable: number;
  governance_pct: number | null;
  stewardship_pct: number | null;
  relationship_pct: number | null;
  traceability_pct: number | null;
};

export type CoverageReport = {
  generated_at: string;
  overall: {
    total_objects: number;
    governance_pct: number | null;
    stewardship_pct: number | null;
    relationship_pct: number | null;
    traceability_pct: number | null;
  };
  by_family: CoverageBreakdown[];
  by_architecture_layer: CoverageBreakdown[];
  by_enterprise_domain: CoverageBreakdown[];
};

export type RepositoryRecommendation = {
  recommendation_id: string;
  object_rid: string;
  object_name: string;
  type:
    | "ASSIGN_STEWARD"
    | "ADD_GOVERNING_AUTHORITY"
    | "ADD_RELATIONSHIP"
    | "ADD_PLATFORM_TRACEABILITY"
    | "ADD_CAPABILITY_LINEAGE";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  title: string;
  explanation: string;
  suggested_action: string;
  suggested_owner: string | null;
};

export type TimelineEvent = {
  event_id: string;
  event_type:
    | "OBJECT_CREATED"
    | "LIFECYCLE"
    | "VERSION"
    | "APPROVAL"
    | "EVIDENCE"
    | "AUDIT";
  occurred_at: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
};

export type RepositoryTimeline = {
  object: RepositoryNode;
  generated_at: string;
  events: TimelineEvent[];
};
