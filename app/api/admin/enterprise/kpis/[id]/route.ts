import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getEnterpriseKpi, getLatestKpiEvaluations } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const kpi = getEnterpriseKpi(id);

  if (!kpi) {
    return NextResponse.json(
      {
        success: false,
        error: "Enterprise KPI definition not found.",
        id,
      },
      { status: 404 },
    );
  }

  const evaluation =
    getLatestKpiEvaluations().find((item) => item.kpi.id === kpi.id) ?? null;

  return NextResponse.json({
    success: true,
    module: "enterprise-kpi-definition",
    schemaVersion: 1,
    access: "internal_admin",
    kpi,
    latestEvaluation: evaluation,
  });
}
