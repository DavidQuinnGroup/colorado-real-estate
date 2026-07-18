import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildLearningSystemSnapshot,
  getImprovementActions,
  type ImprovementActionState,
  type KpiDomain,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

const DOMAINS: KpiDomain[] = ["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"];
const STATES: ImprovementActionState[] = ["PROPOSED", "NEEDS_REVIEW", "ACCEPTED_CONCEPTUALLY", "DEFERRED", "REJECTED"];

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
    const result = getImprovementActions({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
      domain: oneOf(searchParams.get("domain"), DOMAINS),
      state: oneOf(searchParams.get("state"), STATES),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-improvement-actions",
      schemaVersion: 1,
      access: "internal_admin",
      metadata: snapshot.metadata,
      ...result,
      filters: { domain: searchParams.get("domain"), state: searchParams.get("state") },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-improvement-actions",
        error: error instanceof Error ? error.message : "Unknown improvement action error.",
      },
      { status: 500 },
    );
  }
}
