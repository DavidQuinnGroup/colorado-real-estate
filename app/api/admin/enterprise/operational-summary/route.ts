import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildEoiExecutiveOperationalSummaryRoutePayload } from "@/lib/eoi/executiveOperationalSummaryRouteAdapter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const summary = buildEoiExecutiveOperationalSummaryRoutePayload();

  return NextResponse.json({
    success: true,
    module: "enterprise-operations-intelligence-operational-summary",
    schemaVersion: 1,
    access: "internal_admin",
    mode: "read_only",
    runtimeBehavior: {
      liveKpiComputationAuthorized: false,
      automationAuthorized: false,
      telemetryAuthorized: false,
      persistenceAuthorized: false,
      mutationAuthorized: false,
    },
    summary,
  });
}
