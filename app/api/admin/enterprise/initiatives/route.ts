import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildLearningSystemSnapshot,
  getLearningInitiatives,
  type InitiativeLifecycleState,
  type KpiDomain,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

const DOMAINS: KpiDomain[] = ["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"];
const STATES: InitiativeLifecycleState[] = ["PROPOSED", "APPROVED", "PLANNED", "IN_PROGRESS", "COMPLETED", "PAUSED", "CANCELLED", "UNDER_REVIEW"];

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  return allowed.find((item) => item === value);
}

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const snapshot = buildLearningSystemSnapshot();
    const result = getLearningInitiatives({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
      domain: oneOf(searchParams.get("domain"), DOMAINS),
      state: oneOf(searchParams.get("state"), STATES),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-learning-initiatives",
      schemaVersion: 1,
      access: "internal_admin",
      metadata: snapshot.metadata,
      summary: snapshot.summary,
      materialityRules: snapshot.materialityRules,
      ...result,
      filters: { domain: searchParams.get("domain"), state: searchParams.get("state") },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-learning-initiatives",
        error: error instanceof Error ? error.message : "Unknown learning initiative error.",
      },
      { status: 500 },
    );
  }
}
