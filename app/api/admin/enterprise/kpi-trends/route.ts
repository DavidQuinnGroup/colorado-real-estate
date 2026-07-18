import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getEnterpriseKpi, getKpiTrends } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const trend = searchParams.get("trend");
  const provenance = searchParams.get("provenance");
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || "100"), 1), 250);
  const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);
  const trends = getKpiTrends().filter((item) => {
    const kpi = getEnterpriseKpi(item.kpiId);
    if (domain && kpi?.domain !== domain) return false;
    if (trend && item.trend !== trend) return false;
    if (provenance && item.provenance !== provenance) return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    module: "enterprise-kpi-trends",
    schemaVersion: 1,
    access: "internal_admin",
    count: trends.length,
    limit,
    offset,
    trends: trends.slice(offset, offset + limit),
  });
}
