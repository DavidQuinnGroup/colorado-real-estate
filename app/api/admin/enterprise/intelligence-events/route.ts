import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildIntelligenceEvents } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const severity = searchParams.get("severity");
  const confidence = searchParams.get("confidence");
  const provenance = searchParams.get("provenance");
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || "100"), 1), 250);
  const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);
  const events = buildIntelligenceEvents().filter((item) => {
    if (domain && item.domain !== domain) return false;
    if (severity && item.severity !== severity) return false;
    if (confidence && item.confidence.level !== confidence) return false;
    if (provenance && item.provenance !== provenance) return false;
    return true;
  });

  return NextResponse.json({
    success: true,
    module: "enterprise-intelligence-events",
    schemaVersion: 1,
    access: "internal_admin",
    count: events.length,
    limit,
    offset,
    events: events.slice(offset, offset + limit),
  });
}
