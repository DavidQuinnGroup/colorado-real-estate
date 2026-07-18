import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getDecisionEvaluation } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const { id } = await params;
  const evaluation = getDecisionEvaluation(id);
  if (!evaluation) {
    return NextResponse.json({ success: false, module: "enterprise-learning-decision-evaluation", error: "Decision evaluation not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    module: "enterprise-learning-decision-evaluation",
    schemaVersion: 1,
    access: "internal_admin",
    initiativeId: id,
    evaluation,
  });
}
