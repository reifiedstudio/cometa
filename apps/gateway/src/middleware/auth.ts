import { createMiddleware } from "hono/factory";
import type { GatewayEnv } from "../lib/types.js";
import { verifyAccessToken } from "../auth/store.js";

/**
 * Auth middleware for REST API routes.
 * Accepts both Clerk JWTs and OAuth access tokens from our MCP auth flow.
 */
export const authMiddleware = createMiddleware<GatewayEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.slice(7);

  // Try our OAuth access token store first
  const oauthToken = verifyAccessToken(token);
  if (oauthToken) {
    c.set("user", {
      id: oauthToken.userId,
      email: oauthToken.userEmail,
      role: oauthToken.userRole,
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

    c.set("user", {
      id: payload.sub,
      email: (payload as Record<string, unknown>).email as string ?? "",
      role: (payload as Record<string, unknown>).role as string ?? "member",
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

  if (!authHeader?.startsWith("Bearer ")) {
    const issuer = `${new URL(c.req.url).origin}`;
    return c.json({ error: "unauthorized" }, 401, {
      "WWW-Authenticate": `Bearer resource_metadata="${issuer}/.well-known/oauth-protected-resource"`,
    });
  }

  const token = authHeader.slice(7);

  // Check OAuth access token
  const oauthToken = verifyAccessToken(token);
  if (oauthToken) {
    c.set("user", {
      id: oauthToken.userId,
      email: oauthToken.userEmail,
      role: oauthToken.userRole,
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
  if (process.env.CLERK_SECRET_KEY) {
    try {
      const { verifyToken } = await import("@clerk/backend");
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      c.set("user", {
        id: payload.sub,
        email: (payload as Record<string, unknown>).email as string ?? "",
        role: (payload as Record<string, unknown>).role as string ?? "member",
      });
      c.set("auth", {
        token,
        clientId: "clerk",
        scopes: ["read", "write"],
      });
      return next();
    } catch {
      // Fall through to 401
    }
  }

  const issuer = `${new URL(c.req.url).origin}`;
  return c.json({ error: "invalid_token" }, 401, {
    "WWW-Authenticate": `Bearer error="invalid_token", resource_metadata="${issuer}/.well-known/oauth-protected-resource"`,
  });
});
