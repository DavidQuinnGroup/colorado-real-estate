import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  inspectPlatformAvailabilityAdapter,
  invokePlatformAvailabilityAdapter,
} from "@/lib/platform/availabilityAdapter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    return NextResponse.json({
      success: true,
      module: "platform-availability-adapter",
      schemaVersion: 1,
      access: "internal_admin",
      inspection: await inspectPlatformAvailabilityAdapter(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "platform-availability-adapter",
        error: error instanceof Error ? error.message : "Unknown adapter inspection error.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const execute = searchParams.get("execute") === "true";
    const invocationId = searchParams.get("invocationId") || undefined;
    const result = await invokePlatformAvailabilityAdapter({
      execute,
      invocationId,
    });

    return NextResponse.json({
      success: result.overallStatus !== "PERSISTENCE_FAILURE" && result.overallStatus !== "INVALID",
      module: "platform-availability-adapter",
      schemaVersion: 1,
      access: "internal_admin",
      writesEiaPersistence: execute,
      dryRun: !execute,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "platform-availability-adapter",
        error: error instanceof Error ? error.message : "Unknown adapter invocation error.",
      },
      { status: 500 },
    );
  }
}
