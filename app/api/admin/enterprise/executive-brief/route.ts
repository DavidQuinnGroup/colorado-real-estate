import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildDailyExecutiveBrief } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    return NextResponse.json({
      success: true,
      module: "enterprise-executive-brief",
      schemaVersion: 1,
      access: "internal_admin",
      brief: buildDailyExecutiveBrief(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-executive-brief",
        error: error instanceof Error ? error.message : "Unknown executive brief error.",
      },
      { status: 500 },
    );
  }
}
