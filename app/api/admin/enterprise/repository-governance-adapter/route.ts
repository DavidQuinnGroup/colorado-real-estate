import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  inspectRepositoryGovernanceAdapter,
  invokeRepositoryGovernanceAdapter,
} from "@/lib/repository/governanceAdapter";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    return NextResponse.json({
      success: true,
      module: "repository-governance-adapter",
      schemaVersion: 1,
      access: "internal_admin",
      inspection: await inspectRepositoryGovernanceAdapter(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        module: "repository-governance-adapter",
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
    const result = await invokeRepositoryGovernanceAdapter({
      execute,
      invocationId,
    });

    return NextResponse.json({
      success: result.overallStatus !== "PERSISTENCE_FAILURE" && result.overallStatus !== "INVALID",
      module: "repository-governance-adapter",
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
        module: "repository-governance-adapter",
        error: error instanceof Error ? error.message : "Unknown adapter invocation error.",
      },
      { status: 500 },
    );
  }
}
