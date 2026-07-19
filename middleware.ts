import { NextRequest, NextResponse } from "next/server";

const ADMIN_KEY_COOKIE = "reie_admin_key";

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";

  return (
    request.headers.get("x-admin-key") ||
    bearerToken ||
    request.cookies.get(ADMIN_KEY_COOKIE)?.value ||
    ""
  );
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Unauthorized. Send x-admin-key or Authorization: Bearer <key> when an admin key is configured.",
    },
    { status: 401 },
  );
}

export function middleware(request: NextRequest) {
  const configuredKey = getAdminKey();

  if (!configuredKey) {
    return process.env.NODE_ENV !== "production"
      ? NextResponse.next()
      : unauthorizedResponse();
  }

  if (getRequestAdminKey(request) !== configuredKey) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
