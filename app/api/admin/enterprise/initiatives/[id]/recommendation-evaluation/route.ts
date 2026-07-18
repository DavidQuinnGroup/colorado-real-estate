import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRecommendationEvaluation } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const evaluation = getRecommendationEvaluation(id);
  if (!evaluation) {
    return NextResponse.json({ success: false, module: "enterprise-learning-recommendation-evaluation", error: "Recommendation evaluation not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-learning-recommendation-evaluation",
    schemaVersion: 1,
    access: "internal_admin",
    initiativeId: id,
    evaluation,
  });
}
