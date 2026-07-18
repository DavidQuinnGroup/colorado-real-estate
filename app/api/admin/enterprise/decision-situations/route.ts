import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionSituations, type KpiDomain } from "@/lib/enterprise-kpi";

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
    const result = getDecisionSituations({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
      domain: toDomain(searchParams.get("domain")),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-decision-situations",
      schemaVersion: 1,
      access: "internal_admin",
      provenance: "NON_PRODUCTION_FIXTURE",
      humanDecisionRequired: "HUMAN_DECISION_REQUIRED",
      ...result,
      filters: { domain: searchParams.get("domain") },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-decision-situations",
        error: error instanceof Error ? error.message : "Unknown decision situation error.",
      },
      { status: 500 },
    );
  }
}
