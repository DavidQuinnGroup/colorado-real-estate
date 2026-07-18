import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionPackageRecommendation } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const recommendation = getDecisionPackageRecommendation(id);
  if (!recommendation) {
    return NextResponse.json(
      { success: false, module: "enterprise-decision-package-recommendation", error: "Decision package not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-decision-package-recommendation",
    schemaVersion: 1,
    access: "internal_admin",
    packageId: id,
    recommendation,
  });
}
