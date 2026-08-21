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
  const isAgentPreparationRoute = pathname === "/agent/prepare/market" || pathname === "/agent/prepare/property" || pathname === "/agent/prepare/place";

  if (pathname === "/admin/login" || pathname === "/admin/logout" || pathname === "/agent/login" || pathname === "/agent/logout") {
    return NextResponse.next();
  }

  const result = await authorizeAdminRequest(request);

  if (!result.authenticated) {
    if (pathname.startsWith("/admin")) {
      return buildAdminLoginRedirect(request);
    }

    if (isAgentPreparationRoute) {
      return buildAgentLoginRedirect(request);
    }

    return buildAdminUnauthorizedResponse();
  }

  const response = NextResponse.next({
    request: {
      headers: withTrustedAdminHeaders(request, result),
    },
  });

  if (isAgentPreparationRoute) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('x-middleware-cache', 'no-cache');
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/agent/prepare/market", "/agent/prepare/property", "/agent/prepare/place"],
};
