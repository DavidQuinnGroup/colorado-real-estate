import { NextRequest, NextResponse } from "next/server";

import {
  authorizeRepositoryAdminRequest,
  repositoryAdminUnauthorizedResponse,
} from "@/app/api/admin/repository/auth";
import {
  listEnterpriseKpis,
  validateEnterpriseKpiRegistry,
  type KpiDomain,
  type KpiLifecycleState,
  type SourceAvailability,
} from "@/lib/enterprise-kpi";

export const dynamic = "force-dynamic";

function toDomain(value: string | null): KpiDomain | undefined {
  const allowed: KpiDomain[] = [
    "PLATFORM",
    "CUSTOMER",
    "OPERATIONS",
    "BUSINESS",
    "GROWTH",
    "GOVERNANCE",
  ];
  return allowed.find((item) => item === value) ?? undefined;
}

function toLifecycle(value: string | null): KpiLifecycleState | undefined {
  const allowed: KpiLifecycleState[] = ["CANONICAL", "DRAFT", "DEPRECATED"];
  return allowed.find((item) => item === value) ?? undefined;
}

function toAvailability(value: string | null): SourceAvailability | undefined {
  const allowed: SourceAvailability[] = [
    "LIVE_AVAILABLE",
    "FIXTURE_AVAILABLE",
    "DEFINED_BUT_UNAVAILABLE",
  ];
  return allowed.find((item) => item === value) ?? undefined;
}

export async function GET(request: NextRequest) {
  if (!authorizeRepositoryAdminRequest(request)) {
    return repositoryAdminUnauthorizedResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || "100"), 1), 250);
  const offset = Math.max(Number(searchParams.get("offset") || "0"), 0);
  const definitions = listEnterpriseKpis({
    domain: toDomain(searchParams.get("domain")),
    lifecycle: toLifecycle(searchParams.get("lifecycle")),
    sourceAvailability: toAvailability(searchParams.get("sourceAvailability")),
  });
  const validation = validateEnterpriseKpiRegistry();

  return NextResponse.json({
    success: true,
    module: "enterprise-kpi-registry",
    schemaVersion: 1,
    access: "internal_admin",
    registryValidation: validation,
    count: definitions.length,
    limit,
    offset,
    kpis: definitions.slice(offset, offset + limit),
    filters: {
      domain: searchParams.get("domain"),
      lifecycle: searchParams.get("lifecycle"),
      sourceAvailability: searchParams.get("sourceAvailability"),
    },
  });
}
