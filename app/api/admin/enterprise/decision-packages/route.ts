import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildDecisionSupportSnapshot,
  getDecisionPackages,
  type KpiDomain,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

const DOMAINS: KpiDomain[] = ["PLATFORM", "CUSTOMER", "OPERATIONS", "BUSINESS", "GROWTH", "GOVERNANCE"];

function toDomain(value: string | null): KpiDomain | undefined {
  return DOMAINS.find((item) => item === value) ?? undefined;
}

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const snapshot = buildDecisionSupportSnapshot();
    const result = getDecisionPackages({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
      domain: toDomain(searchParams.get("domain")),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-decision-packages",
      schemaVersion: 1,
      access: "internal_admin",
      metadata: snapshot.metadata,
      summary: snapshot.summary,
      criteria: snapshot.criteria,
      criteriaValidation: snapshot.criteriaValidation,
      scoringRules: snapshot.scoringRules,
      ...result,
      filters: { domain: searchParams.get("domain") },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-decision-packages",
        error: error instanceof Error ? error.message : "Unknown decision package error.",
      },
      { status: 500 },
    );
  }
}
