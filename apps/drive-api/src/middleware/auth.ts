import { getEffectivePermissions } from "@cometa/auth";
import { createMiddleware } from "hono/factory";
import type { DriveEnv } from "../lib/types.js";

/**
 * Auth middleware for the Drive service.
 * Accepts Clerk JWTs via Bearer token.
 */
export const authMiddleware = createMiddleware<DriveEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  // Internal service-to-service calls (from gateway) have no auth header.
  // The Lambda URL is not exposed to users — only the gateway proxies to it.
  if (!authHeader?.startsWith("Bearer ")) {
    c.set("user", {
      id: "service:gateway",
      email: "gateway@cometa.internal",
      role: "org:admin",
      orgId: undefined,
      permissions: getEffectivePermissions("org:admin"),
    });
    return next();
  }

  const token = authHeader.slice(7);

  if (!process.env.CLERK_SECRET_KEY) {
    return c.json({ error: "Authentication required" }, 401);
  }

  try {
    const { verifyToken } = await import("@clerk/backend");
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const claims = payload as Record<string, unknown>;
    const role = (claims.org_role as string) ?? "org:member";
    const extraPermissions =
      ((claims.metadata as Record<string, unknown>)?.extraPermissions as string[]) ?? undefined;

    c.set("user", {
      id: payload.sub,
      email: (claims.email as string) ?? "",
      role,
      orgId: claims.org_id as string | undefined,
      permissions: getEffectivePermissions(role, extraPermissions),
    });

    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});
