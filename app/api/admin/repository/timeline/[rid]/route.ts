import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { getRepositoryTimeline } from "@/lib/repository/intelligence";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ rid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const { rid } = await context.params;
    const timeline = await getRepositoryTimeline(decodeURIComponent(rid));

    return NextResponse.json({ success: true, timeline });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Repository error.";

    return NextResponse.json(
      { success: false, error: message },
      { status: message.includes("not found") ? 404 : 500 },
    );
  }
}
