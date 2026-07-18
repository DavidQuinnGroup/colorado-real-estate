import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import { buildIntelligenceHealthSnapshot } from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const domain = request.nextUrl.searchParams.get("domain");
  const snapshot = buildIntelligenceHealthSnapshot();
  const domains = snapshot.domainResults.filter((item) =>
    domain ? item.domain === domain : true,
  );

  return NextResponse.json({
    success: true,
    module: "enterprise-domain-health",
    schemaVersion: 1,
    access: "internal_admin",
    provenance: snapshot.provenance,
    calculationVersion: snapshot.calculationVersion,
    count: domains.length,
    domains,
  });
}
