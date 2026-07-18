import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { detectKpiTransitions, getEnterpriseKpi } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const status = searchParams.get("status");
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || "100"), 1), 250);
  const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);
  const transitions = detectKpiTransitions().filter((item) => {
    const kpi = getEnterpriseKpi(item.kpiId);
    if (domain && kpi?.domain !== domain) return false;
    if (status && item.currentStatus !== status) return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    module: "enterprise-kpi-transitions",
    schemaVersion: 1,
    access: "internal_admin",
    count: transitions.length,
    limit,
    offset,
    transitions: transitions.slice(offset, offset + limit),
  });
}
