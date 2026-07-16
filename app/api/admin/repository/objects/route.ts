import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRepositoryObjects } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    const objects = await getRepositoryObjects({
      family: searchParams.get("family") || undefined,
      lifecycle: searchParams.get("lifecycle") || undefined,
      query: searchParams.get("q") || undefined,
      limit: Number(searchParams.get("limit") || "100"),
    });

    return NextResponse.json({
      success: true,
      count: objects.length,
      objects,
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
