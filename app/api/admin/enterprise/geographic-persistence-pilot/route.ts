import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import type { EipSprint6PilotMode } from "@/lib/eip/controlledProductionInternalGeographicPersistencePilot";

const EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME = "Thornton";
const EIP_SPRINT_6_AUTHORIZED_SCOPE = "CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const [{ prisma }, pilot] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/eip/controlledProductionInternalGeographicPersistencePilot"),
    ]);
    const mode = modeFrom(request.nextUrl.searchParams.get("mode")) ?? "inspection";
    const result = mode === "retirement-plan"
      ? await pilot.invokeEipSprint6Pilot(prisma, {
        mode,
        subject: request.nextUrl.searchParams.get("subject") ?? EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
        scope: request.nextUrl.searchParams.get("scope") ?? EIP_SPRINT_6_AUTHORIZED_SCOPE,
        authorized: true,
      })
      : await pilot.inspectEipSprint6Pilot(prisma);

    return NextResponse.json({
      success: result.success,
      module: result.module,
      schemaVersion: 1,
      access: "internal_admin",
      result,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  try {
    const [{ prisma }, pilot] = await Promise.all([
      import("@/lib/prisma"),
      import("@/lib/eip/controlledProductionInternalGeographicPersistencePilot"),
    ]);
    const body = await safeJson(request);
    const searchParams = request.nextUrl.searchParams;
    const execute = body.execute === true || searchParams.get("execute") === "true";
    const mode = execute ? "execute" : "dry-run";
    const result = await pilot.invokeEipSprint6Pilot(prisma, {
      mode,
      subject: String(body.subject ?? searchParams.get("subject") ?? EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME),
      scope: String(body.scope ?? searchParams.get("scope") ?? EIP_SPRINT_6_AUTHORIZED_SCOPE),
      invocationId: String(body.invocationId ?? searchParams.get("invocationId") ?? ""),
      authorized: true,
    });

    return NextResponse.json({
      success: result.success,
      module: result.module,
      schemaVersion: 1,
      access: "internal_admin",
      result,
    }, { status: result.success ? 200 : 409 });
  } catch (error) {
    return errorResponse(error);
  }
}

function modeFrom(value: string | null): EipSprint6PilotMode | null {
  if (value === "inspection" || value === "retirement-plan") return value;
  return null;
}

async function safeJson(request: NextRequest) {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return {};
  }
}

function errorResponse(error: unknown) {
  return NextResponse.json(
    {
      success: false,
      module: "eip-sprint-6-controlled-production-internal-geographic-persistence-pilot",
      error: error instanceof Error ? error.message : "Unknown Sprint 6 pilot error.",
    },
    { status: 500 },
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/enterprise/geographic-persistence-pilot/route.ts
