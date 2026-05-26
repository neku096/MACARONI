const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

export function isAdminEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.MACARONI_ADMIN_ENABLED === "1";
}

export function getAdminAccessError(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return "Admin API is disabled in production.";
  }

  if (process.env.MACARONI_ADMIN_ENABLED !== "1") {
    return "Admin API requires MACARONI_ADMIN_ENABLED=1.";
  }

  if (!isLocalRequest(request)) {
    return "Admin API is only available from a local host.";
  }

  return "";
}

export function getAdminWriteError(request: Request) {
  return getAdminAccessError(request);
}

export function isLocalRequest(request: Request) {
  const hostname = new URL(request.url).hostname.toLowerCase();
  return localHosts.has(hostname);
}
