import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildEoiOperationalKpiReport,
  validateEoiOperationalKpiReportingContract,
} from "@/lib/eoi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const report = buildEoiOperationalKpiReport();
  const validation = validateEoiOperationalKpiReportingContract();

  return NextResponse.json({
    success: true,
    module: "enterprise-operations-intelligence-operational-kpis",
    schemaVersion: 1,
    access: "internal_admin",
    mode: "read_only",
    runtimeBehavior: {
      automationAuthorized: false,
      telemetryAuthorized: false,
      persistenceAuthorized: false,
      mutationAuthorized: false,
    },
    validation,
    report,
  });
}
