import "server-only";

import { repositorySupabase } from "@/lib/repository/server";

import { findRootNode, loadRepositoryGraph } from "./core";
import type { RepositoryTimeline, TimelineEvent } from "./types";

export async function getRepositoryTimeline(
  rid: string,
): Promise<RepositoryTimeline> {
  const { nodes } = await loadRepositoryGraph();
  const object = findRootNode(nodes, rid);

  const [
    { data: lifecycle, error: lifecycleError },
    { data: versions, error: versionError },
    { data: approvals, error: approvalError },
    { data: evidenceLinks, error: evidenceError },
    { data: audit, error: auditError },
  ] = await Promise.all([
    repositorySupabase
      .from("repository_lifecycle_transition")
      .select("id,from_state,to_state,reason,effective_at,metadata")
      .eq("object_id", object.id),
    repositorySupabase
      .from("repository_object_version")
      .select(
        "id,version_major,version_minor,version_patch,change_summary,change_rationale,created_at",
      )
      .eq("object_id", object.id),
    repositorySupabase
      .from("repository_approval")
      .select(
        "id,approval_rid,approval_class,status,requested_at,decided_at,decision_summary",
      )
      .eq("object_id", object.id),
    repositorySupabase
      .from("repository_object_evidence")
      .select(
        `
          relationship_type,
          notes,
          created_at,
          evidence:repository_evidence (
            id,
            evidence_rid,
            title,
            description,
            observed_at,
            created_at
          )
        `,
      )
      .eq("object_id", object.id),
    repositorySupabase
      .from("repository_audit_event")
      .select(
        "id,action,occurred_at,rationale,metadata,before_state,after_state",
      )
      .eq("entity_table", "repository_object")
      .eq("entity_id", object.id),
  ]);

  for (const [label, error] of [
    ["lifecycle", lifecycleError],
    ["versions", versionError],
    ["approvals", approvalError],
    ["evidence", evidenceError],
    ["audit", auditError],
  ] as const) {
    if (error) {
      throw new Error(`Unable to load Repository ${label}: ${error.message}`);
    }
  }

  const events: TimelineEvent[] = [
    {
      event_id: `OBJECT-${object.rid}`,
      event_type: "OBJECT_CREATED",
      occurred_at: new Date().toISOString(),
      title: "Object registered",
      description: object.official_name,
      metadata: {},
    },
    ...(lifecycle ?? []).map((row: any) => ({
      event_id: row.id,
      event_type: "LIFECYCLE" as const,
      occurred_at: row.effective_at,
      title: `Lifecycle: ${row.from_state ?? "UNREGISTERED"} → ${row.to_state}`,
      description: row.reason,
      metadata: row.metadata ?? {},
    })),
    ...(versions ?? []).map((row: any) => ({
      event_id: row.id,
      event_type: "VERSION" as const,
      occurred_at: row.created_at,
      title: `Version ${row.version_major}.${row.version_minor}.${row.version_patch}`,
      description: row.change_summary,
      metadata: {
        rationale: row.change_rationale,
      },
    })),
    ...(approvals ?? []).map((row: any) => ({
      event_id: row.id,
      event_type: "APPROVAL" as const,
      occurred_at: row.decided_at ?? row.requested_at,
      title: `${row.approval_class}: ${row.status}`,
      description: row.decision_summary,
      metadata: {
        approval_rid: row.approval_rid,
      },
    })),
    ...(evidenceLinks ?? []).map((row: any) => ({
      event_id: row.evidence.id,
      event_type: "EVIDENCE" as const,
      occurred_at:
        row.evidence.observed_at ?? row.evidence.created_at ?? row.created_at,
      title: row.evidence.title,
      description: row.notes ?? row.evidence.description,
      metadata: {
        evidence_rid: row.evidence.evidence_rid,
        relationship_type: row.relationship_type,
      },
    })),
    ...(audit ?? []).map((row: any) => ({
      event_id: row.id,
      event_type: "AUDIT" as const,
      occurred_at: row.occurred_at,
      title: `Audit: ${row.action}`,
      description: row.rationale,
      metadata: row.metadata ?? {},
    })),
  ];

  events.sort(
    (a, b) =>
      new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime(),
  );

  return {
    object,
    generated_at: new Date().toISOString(),
    events,
  };
}
