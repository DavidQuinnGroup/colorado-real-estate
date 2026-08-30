import { NextRequest, NextResponse } from "next/server";

import {
  authorizeAdminRequest,
  buildAgentLoginRedirect,
  buildAdminLoginRedirect,
  buildAdminUnauthorizedResponse,
  withTrustedAdminHeaders,
} from "@/lib/admin/adminAuth";
import { PRIVATE_SITE_ACCESS_COOKIE, getPrivateSiteAccessConfiguration, sanitizePrivateAccessReturnPath, validatePrivateSiteAccessSessionValue } from '@/lib/privateSiteAccess';

function withPrivateResponseHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

function isPrivateAccessAllowlist(pathname: string) {
  return pathname === '/private-access' || pathname.startsWith('/private-access/') || pathname === '/robots.txt' || pathname === '/favicon.svg';
}

function privateAccessPageResponse(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-project-atlas-private-gate', 'true');
  return withPrivateResponseHeaders(NextResponse.next({ request: { headers } }));
}

function privateAccessGateResponse(request: NextRequest, unavailable = false) {
  const url = new URL('/private-access', request.nextUrl.origin);
  url.searchParams.set('next', sanitizePrivateAccessReturnPath(`${request.nextUrl.pathname}${request.nextUrl.search}`));
  if (unavailable) url.searchParams.set('unavailable', '1');
  const headers = new Headers(request.headers);
  headers.set('x-project-atlas-private-gate', 'true');
  return withPrivateResponseHeaders(NextResponse.rewrite(url, { request: { headers } }));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const privateConfiguration = getPrivateSiteAccessConfiguration();
  if (isPrivateAccessAllowlist(pathname)) return pathname.startsWith('/private-access') ? privateAccessPageResponse(request) : withPrivateResponseHeaders(NextResponse.next());
  if (privateConfiguration.enabled) {
    if (privateConfiguration.configurationState !== 'ENABLED') {
      if (pathname.startsWith('/api/')) return withPrivateResponseHeaders(NextResponse.json({ success: false, error: 'Private development access is unavailable.' }, { status: 503 }));
      return privateAccessGateResponse(request, true);
    }
    const authenticated = await validatePrivateSiteAccessSessionValue(request.cookies.get(PRIVATE_SITE_ACCESS_COOKIE)?.value, privateConfiguration);
    if (!authenticated) {
      if (pathname.startsWith('/api/')) return withPrivateResponseHeaders(NextResponse.json({ success: false, error: 'Private access required.' }, { status: 401 }));
      return privateAccessGateResponse(request);
    }
  }
  const isAgentWorkspaceRoute = pathname === "/agent" || pathname === "/agent/prepare/market" || pathname === "/agent/prepare/market-update" || pathname === "/agent/prepare/property" || pathname === "/agent/prepare/place" || pathname === "/agent/prepare/buyer" || pathname === "/agent/prepare/seller" || pathname === "/agent/prepare/seller/presentation" || pathname === "/agent/prepare/seller/financial" || pathname === "/agent/prepare/professional-inputs" || pathname === "/agent/prepare/listing";
  const isAgentProtectedApiRoute = pathname === "/api/agent/output/pdf" || pathname === "/api/agent/evidence" || pathname === "/api/agent/professional-inputs" || pathname === "/api/agent/seller-financial";
  const isAdminProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin/');

  if (!isAgentWorkspaceRoute && !isAgentProtectedApiRoute && !isAdminProtectedRoute) {
    return privateConfiguration.enabled ? withPrivateResponseHeaders(NextResponse.next()) : NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/admin/logout" || pathname === "/agent/login" || pathname === "/agent/logout") {
    return privateConfiguration.enabled ? withPrivateResponseHeaders(NextResponse.next()) : NextResponse.next();
  }

  const result = await authorizeAdminRequest(request);

  if (!result.authenticated) {
    if (pathname.startsWith("/admin")) {
      return privateConfiguration.enabled ? withPrivateResponseHeaders(buildAdminLoginRedirect(request)) : buildAdminLoginRedirect(request);
    }

    if (isAgentWorkspaceRoute) {
      return privateConfiguration.enabled ? withPrivateResponseHeaders(buildAgentLoginRedirect(request)) : buildAgentLoginRedirect(request);
    }

    if (isAgentProtectedApiRoute) {
      const response = NextResponse.json({ error: 'Agent authentication required.' }, { status: 403 });
      return privateConfiguration.enabled ? withPrivateResponseHeaders(response) : response;
    }

    return privateConfiguration.enabled ? withPrivateResponseHeaders(buildAdminUnauthorizedResponse()) : buildAdminUnauthorizedResponse();
  }

  const response = NextResponse.next({
    request: {
      headers: withTrustedAdminHeaders(request, result),
    },
  });

  if (isAgentWorkspaceRoute || isAgentProtectedApiRoute) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('x-middleware-cache', 'no-cache');
  }

  return privateConfiguration.enabled ? withPrivateResponseHeaders(response) : response;
}

export const config = {
  matcher: ['/((?!_next/).*)', "/admin/:path*", "/api/admin/:path*", "/api/agent/output/pdf", "/api/agent/evidence", "/api/agent/professional-inputs", "/api/agent/seller-financial", "/agent", "/agent/prepare/market", "/agent/prepare/market-update", "/agent/prepare/property", "/agent/prepare/place", "/agent/prepare/buyer", "/agent/prepare/seller", "/agent/prepare/seller/presentation", "/agent/prepare/seller/financial", "/agent/prepare/professional-inputs", "/agent/prepare/listing"],
};
