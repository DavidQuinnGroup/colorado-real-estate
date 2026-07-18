import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getLatestKpiEvaluations } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const evaluations = getLatestKpiEvaluations().filter((item) =>
    domain ? item.kpi.domain === domain : true,
  );

  return NextResponse.json({
    success: true,
    module: "enterprise-kpi-evaluations",
    schemaVersion: 1,
    access: "internal_admin",
    provenance: "NON_PRODUCTION_FIXTURE",
    count: evaluations.length,
    evaluations,
  });
}
