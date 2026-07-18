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
    request.nextUrl.searchParams.get("adminKey") ||
    request.cookies.get(ADMIN_KEY_COOKIE)?.value ||
    ""
  );
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Unauthorized. Send x-admin-key, Authorization: Bearer <key>, or adminKey when an admin key is configured.",
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

  const queryAdminKey = request.nextUrl.searchParams.get("adminKey");
  const response =
    queryAdminKey && request.nextUrl.pathname.startsWith("/admin/repository")
      ? (() => {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.searchParams.delete("adminKey");
          return NextResponse.redirect(redirectUrl);
        })()
      : NextResponse.next();

  if (queryAdminKey === configuredKey) {
    response.cookies.set(ADMIN_KEY_COOKIE, configuredKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin/repository/:path*", "/api/admin/repository/:path*", "/api/admin/enterprise/:path*"],
};
