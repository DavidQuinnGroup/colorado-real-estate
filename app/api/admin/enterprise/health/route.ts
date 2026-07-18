import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildEnterpriseHealthSnapshot } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-health",
    schemaVersion: 1,
    access: "internal_admin",
    snapshot: buildEnterpriseHealthSnapshot(),
  });
}
