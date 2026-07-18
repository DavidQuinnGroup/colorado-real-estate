import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getLearningLifecycle } from "@/lib/enterprise-kpi";

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
    const lifecycle = getLearningLifecycle(id);
    if (!lifecycle) {
      return NextResponse.json(
        {
          success: false,
          module: "enterprise-learning-initiative",
          error: "Initiative not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      module: "enterprise-learning-initiative",
      schemaVersion: 1,
      access: "internal_admin",
      lifecycle,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "enterprise-learning-initiative",
        error: error instanceof Error ? error.message : "Unknown learning initiative error.",
      },
      { status: 500 },
    );
  }
}
