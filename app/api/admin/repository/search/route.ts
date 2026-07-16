import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { searchRepository } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({
        success: true,
        query,
        count: 0,
        results: [],
      });
    }

    const results = await searchRepository({
      query,
      family: searchParams.get("family") || undefined,
      limit: Number(searchParams.get("limit") || "50"),
    });

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
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
