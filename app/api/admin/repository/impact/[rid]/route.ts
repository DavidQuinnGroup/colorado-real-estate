import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { analyzeImpact } from "@/lib/repository/intelligence";

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
    const url = new URL(request.url);
    const depth = Math.min(
      Math.max(Number(url.searchParams.get("depth") || "8"), 1),
      20,
    );

    const analysis = await analyzeImpact(decodeURIComponent(rid), depth);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Repository error.";

    return NextResponse.json(
      { success: false, error: message },
      { status: message.includes("not found") ? 404 : 500 },
    );
  }
}
