import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionPackageComparison } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const comparison = getDecisionPackageComparison(id);
  if (!comparison) {
    return NextResponse.json(
      { success: false, module: "enterprise-decision-package-comparison", error: "Decision package not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-decision-package-comparison",
    schemaVersion: 1,
    access: "internal_admin",
    packageId: id,
    comparison,
  });
}
