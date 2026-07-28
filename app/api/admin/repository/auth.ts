import { NextRequest } from "next/server";

import {
  ADMIN_MACHINE_KEY_COOKIE,
  buildAdminUnauthorizedResponse,
  getConfiguredAdminCredential,
  isTrustedMiddlewareAuthorizedRequest,
} from "@/lib/admin/adminAuth";

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  const bearerToken = authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";

  return (
    request.headers.get("x-admin-key") ||
    bearerToken ||
    request.cookies.get(ADMIN_MACHINE_KEY_COOKIE)?.value ||
    ""
  );
}

export function authorizeRepositoryAdminRequest(request: NextRequest) {
  if (isTrustedMiddlewareAuthorizedRequest(request)) {
    return true;
  }

  const configuredKey = getConfiguredAdminCredential();

  if (!configuredKey) {
    return process.env.NODE_ENV !== "production";
  }

  return getRequestAdminKey(request) === configuredKey;
}

export function repositoryAdminUnauthorizedResponse() {
  return buildAdminUnauthorizedResponse();
}
