import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildExecutiveCommandCenterPayload } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    return NextResponse.json({
      success: true,
      module: "enterprise-executive-command-center",
      schemaVersion: 1,
      access: "internal_admin",
      payload: buildExecutiveCommandCenterPayload(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-executive-command-center",
        error: error instanceof Error ? error.message : "Unknown executive workspace error.",
      },
      { status: 500 },
    );
  }
}
