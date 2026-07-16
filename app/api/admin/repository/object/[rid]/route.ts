import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRepositoryObjectByRid } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    rid: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const { rid } = await context.params;
    const result = await getRepositoryObjectByRid(decodeURIComponent(rid));

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Repository object not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
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
