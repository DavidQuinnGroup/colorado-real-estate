import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import type { EipSprint7ReadOperation } from "@/lib/eip/productionInternalGeographicReadAdapter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const [{ prisma }, adapter] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/eip/productionInternalGeographicReadAdapter"),
    ]);
    const searchParams = request.nextUrl.searchParams;
    const operation = operationFrom(searchParams.get("mode") ?? searchParams.get("operation"));
    const result = await adapter.retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma, {
      operation,
      objectId: searchParams.get("objectId") ?? undefined,
      canonicalName: searchParams.get("canonicalName") ?? searchParams.get("subject") ?? undefined,
      alias: searchParams.get("alias") ?? undefined,
      requestId: searchParams.get("requestId") ?? searchParams.get("invocationId") ?? undefined,
    });

    return NextResponse.json({
      success: result.success,
      module: result.module,
      schemaVersion: 1,
      access: "internal_admin",
      result,
    }, { status: result.success ? 200 : 409 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "eip-sprint-7-production-internal-geographic-read-adapter",
        error: error instanceof Error ? error.message : "Unknown Sprint 7 read-adapter error.",
      },
      { status: 500 },
    );
  }
}

function operationFrom(value: string | null): EipSprint7ReadOperation {
  if (value === "object-id" || value === "canonical-name" || value === "alias" || value === "aggregate" || value === "health") return value;
  return "aggregate";
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/enterprise/geographic-read-adapter/route.ts
