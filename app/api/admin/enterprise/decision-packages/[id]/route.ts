import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionPackage } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;

  try {
    const decisionPackage = getDecisionPackage(id);
    if (!decisionPackage) {
      return NextResponse.json(
        {
          success: false,
          module: "enterprise-decision-package",
          error: "Decision package not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      module: "enterprise-decision-package",
      schemaVersion: 1,
      access: "internal_admin",
      package: decisionPackage,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-decision-package",
        error: error instanceof Error ? error.message : "Unknown decision package error.",
      },
      { status: 500 },
    );
  }
}
