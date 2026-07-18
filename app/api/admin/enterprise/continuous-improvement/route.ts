import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  buildLearningSystemSnapshot,
  getContinuousImprovementBacklog,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const snapshot = buildLearningSystemSnapshot();
    const result = getContinuousImprovementBacklog({
      limit: Number(searchParams.get("limit") || "100"),
      offset: Number(searchParams.get("offset") || "0"),
    });

    return NextResponse.json({
      success: true,
      module: "enterprise-continuous-improvement",
      schemaVersion: 1,
      access: "internal_admin",
      metadata: snapshot.metadata,
      summary: snapshot.summary,
      criteria: snapshot.materialityRules,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-continuous-improvement",
        error: error instanceof Error ? error.message : "Unknown continuous improvement error.",
      },
      { status: 500 },
    );
  }
}
