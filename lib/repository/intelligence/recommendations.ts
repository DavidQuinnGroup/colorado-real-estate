import "server-only";

import { repositorySupabase } from "@/lib/repository/server";

import type { RepositoryRecommendation } from "./types";

type CandidateRow = {
  object_id: string;
  rid: string;
  official_name: string;
  family: string;
  object_type: string;
  exception_type: string;
};

function recommendationFor(row: CandidateRow): RepositoryRecommendation {
  const base = {
    recommendation_id: `REC-${row.rid}-${row.exception_type}`,
    object_rid: row.rid,
    object_name: row.official_name,
  };

  switch (row.exception_type) {
    case "MISSING_GOVERNING_AUTHORITY":
      return {
        ...base,
        type: "ADD_GOVERNING_AUTHORITY",
        severity: "HIGH",
        confidence: 1,
        title: "Assign governing authority",
        explanation:
          "The object has no registered governing authority and cannot be certified as fully governed.",
        suggested_action:
          "Assign the constitutional, architectural, or operational authority responsible for this object.",
        suggested_owner: "REIE Canon Office™",
      };

    case "MISSING_STEWARD":
      return {
        ...base,
        type: "ASSIGN_STEWARD",
        severity: "HIGH",
        confidence: 1,
        title: "Assign active stewardship",
        explanation:
          "The object has no active stewardship assignment. Active objects require accountable stewardship.",
        suggested_action:
          "Assign a primary steward and establish a review cadence.",
        suggested_owner:
          row.family === "PLAT"
            ? "REIE Platform Organization™"
            : row.family === "ARCH" || row.family === "CAP"
              ? "Enterprise Architecture Office™"
              : "Canon Registry Office™",
      };

    case "ORPHAN_OBJECT":
      return {
        ...base,
        type: "ADD_RELATIONSHIP",
        severity: "MEDIUM",
        confidence: 0.95,
        title: "Connect orphan object",
        explanation:
          "The object has no registered incoming or outgoing relationships.",
        suggested_action:
          "Register at least one authoritative structural, governance, lineage, or implementation relationship.",
        suggested_owner: "Enterprise Architecture Office™",
      };

    case "PLATFORM_OBJECT_WITHOUT_CAPABILITY":
      return {
        ...base,
        type: "ADD_PLATFORM_TRACEABILITY",
        severity: "HIGH",
        confidence: 1,
        title: "Add platform-to-capability traceability",
        explanation:
          "The platform object does not trace to an approved capability or governing architecture.",
        suggested_action:
          "Register an IMPLEMENTS, REALIZES, or GOVERNED_BY relationship to the governing capability.",
        suggested_owner: "REIE Platform Organization™",
      };

    case "CAPABILITY_WITHOUT_CONSTITUTIONAL_LINEAGE":
      return {
        ...base,
        type: "ADD_CAPABILITY_LINEAGE",
        severity: "CRITICAL",
        confidence: 1,
        title: "Add constitutional lineage",
        explanation:
          "The capability does not trace to a principle, constitutional requirement, or architectural authority.",
        suggested_action:
          "Register a JUSTIFIED_BY, GOVERNED_BY, or DERIVES_FROM relationship.",
        suggested_owner: "Enterprise Architecture Office™",
      };

    default:
      return {
        ...base,
        type: "ADD_RELATIONSHIP",
        severity: "LOW",
        confidence: 0.5,
        title: "Review Repository exception",
        explanation:
          "The Repository identified a governance condition requiring manual review.",
        suggested_action: "Review and classify the condition.",
        suggested_owner: "Canon Registry Office™",
      };
  }
}

export async function getRepositoryRecommendations(): Promise<
  RepositoryRecommendation[]
> {
  const { data, error } = await repositorySupabase
    .from("repository_governance_exception_candidates")
    .select(
      "object_id,rid,official_name,family,object_type,exception_type",
    )
    .order("family")
    .order("official_name");

  if (error) {
    throw new Error(
      `Unable to load Repository recommendations: ${error.message}`,
    );
  }

  return ((data ?? []) as CandidateRow[]).map(recommendationFor);
}
