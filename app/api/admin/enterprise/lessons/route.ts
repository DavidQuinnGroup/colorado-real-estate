import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildLearningSystemSnapshot,
  getLessonsLearned,
  type KpiDomain,
  type LessonType,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

const DOMAINS: KpiDomain[] = ["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"];
const TYPES: LessonType[] = ["CUSTOMER", "PLATFORM", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE", "DECISION_PROCESS", "DATA_QUALITY", "EXECUTION", "RISK"];

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
    const result = getLessonsLearned({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
      domain: oneOf(searchParams.get("domain"), DOMAINS),
      type: oneOf(searchParams.get("type"), TYPES),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-lessons-learned",
      schemaVersion: 1,
      access: "internal_admin",
      metadata: snapshot.metadata,
      ...result,
      filters: { domain: searchParams.get("domain"), type: searchParams.get("type") },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-lessons-learned",
        error: error instanceof Error ? error.message : "Unknown lessons learned error.",
      },
      { status: 500 },
    );
  }
}
