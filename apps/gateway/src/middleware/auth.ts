import { getEffectivePermissions } from "@cometa/auth";
import { createMiddleware } from "hono/factory";
import { verifyAccessToken } from "../auth/store.js";
import type { GatewayEnv } from "../lib/types.js";

/**
 * Auth middleware for REST API routes.
 * Accepts both Clerk JWTs and OAuth access tokens from our MCP auth flow.
 *
 * Clerk org JWTs include:
 *   - sub: user ID
 *   - org_id: active organization ID
 *   - org_role: e.g. "org:admin", "org:accounting_member"
 *   - org_permissions: array of permission strings (optional, depends on Clerk config)
 *   - metadata.extraPermissions: per-user overrides
 */
export const authMiddleware = createMiddleware<GatewayEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.slice(7);

  // Try our OAuth access token store first
  const oauthToken = await verifyAccessToken(token);
  if (oauthToken) {
    c.set("user", {
      id: oauthToken.userId,
      email: oauthToken.userEmail,
      role: oauthToken.userRole,
      permissions: getEffectivePermissions(oauthToken.userRole),
    });
    return next();
  }

  // Fall back to Clerk JWT verification
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
    const orgId = claims.org_id as string | undefined;
    const extraPermissions =
      ((claims.metadata as Record<string, unknown>)?.extraPermissions as string[]) ?? undefined;

    c.set("user", {
      id: payload.sub,
      email: (claims.email as string) ?? "",
      role,
      orgId,
      permissions: getEffectivePermissions(role, extraPermissions),
    });

    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

/**
 * MCP auth middleware — validates OAuth Bearer tokens and sets the `auth`
 * variable that @hono/mcp reads via `ctx.get("auth")`.
 * Returns 401 with proper WWW-Authenticate header if no valid token.
 */
export const mcpAuth = createMiddleware<GatewayEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  console.log("[mcpAuth] method:", c.req.method, "has auth:", !!authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    const issuer = `${new URL(c.req.url).origin}`;
    return c.json({ error: "unauthorized" }, 401, {
      "WWW-Authenticate": `Bearer resource_metadata="${issuer}/.well-known/oauth-protected-resource"`,
    });
  }

  const token = authHeader.slice(7);

  // Check OAuth access token
  const oauthToken = await verifyAccessToken(token);
  if (oauthToken) {
    console.log("[mcpAuth] valid OAuth token for user:", oauthToken.userId);
    c.set("user", {
      id: oauthToken.userId,
      email: oauthToken.userEmail,
      role: oauthToken.userRole,
      permissions: getEffectivePermissions(oauthToken.userRole),
    });
    c.set("auth", {
      token,
      clientId: oauthToken.clientId,
      scopes: oauthToken.scopes,
      expiresAt: Math.floor(oauthToken.expiresAt / 1000),
    });
    return next();
  }

  // Fall back to Clerk JWT
  console.log("[mcpAuth] OAuth token not found, trying Clerk JWT...");
  if (process.env.CLERK_SECRET_KEY) {
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
      c.set("auth", {
        token,
        clientId: "clerk",
        scopes: ["read", "write"],
      });
      return next();
    } catch (err) {
      console.error("[mcpAuth] Clerk JWT verification failed:", err);
    }
  }

  console.log("[mcpAuth] all auth methods failed, returning 401");
  const issuer = `${new URL(c.req.url).origin}`;
  return c.json({ error: "invalid_token" }, 401, {
    "WWW-Authenticate": `Bearer error="invalid_token", resource_metadata="${issuer}/.well-known/oauth-protected-resource"`,
  });
});
