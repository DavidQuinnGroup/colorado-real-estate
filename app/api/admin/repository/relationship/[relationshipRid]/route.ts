import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRepositoryRelationshipByRid } from "@/lib/repository/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    relationshipRid: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const { relationshipRid } = await context.params;
    const relationship = await getRepositoryRelationshipByRid(
      decodeURIComponent(relationshipRid),
    );

    if (!relationship) {
      return NextResponse.json(
        {
          success: false,
          error: "Repository relationship not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      relationship,
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
