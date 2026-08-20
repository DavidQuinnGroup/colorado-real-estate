import { NextRequest, NextResponse } from "next/server";

import {
  authorizeAdminRequest,
  buildAgentLoginRedirect,
  buildAdminLoginRedirect,
  buildAdminUnauthorizedResponse,
  withTrustedAdminHeaders,
} from "@/lib/admin/adminAuth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login" || pathname === "/admin/logout" || pathname === "/agent/login" || pathname === "/agent/logout") {
    return NextResponse.next();
  }

  const result = await authorizeAdminRequest(request);

  if (!result.authenticated) {
    if (pathname.startsWith("/admin")) {
      return buildAdminLoginRedirect(request);
    }

    if (pathname === "/agent/prepare/market" || pathname === "/agent/prepare/property") {
      return buildAgentLoginRedirect(request);
    }

    return buildAdminUnauthorizedResponse();
  }

  return NextResponse.next({
    request: {
      headers: withTrustedAdminHeaders(request, result),
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/agent/prepare/market", "/agent/prepare/property"],
};
