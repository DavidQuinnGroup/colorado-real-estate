import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRepositoryRelationships } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    const relationships = await getRepositoryRelationships({
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      traceability: searchParams.get("traceability") || undefined,
      limit: Number(searchParams.get("limit") || "100"),
    });

    return NextResponse.json({
      success: true,
      count: relationships.length,
      relationships,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Repository error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
