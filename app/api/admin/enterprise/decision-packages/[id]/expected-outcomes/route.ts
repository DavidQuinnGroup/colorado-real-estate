import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionPackageExpectedOutcomes } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const expectedOutcomes = getDecisionPackageExpectedOutcomes(id);
  if (!expectedOutcomes) {
    return NextResponse.json(
      { success: false, module: "enterprise-decision-package-expected-outcomes", error: "Decision package not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-decision-package-expected-outcomes",
    schemaVersion: 1,
    access: "internal_admin",
    packageId: id,
    expectedOutcomes,
  });
}
