/**
 * Auth middleware for the API.
 * Supports:
 * 1. Clerk auth injected by the Next.js route handler (X-Clerk-User-Id header)
 * 2. Service token + user headers (from gateway)
 */
import type { Context, Next } from "hono";
import type { AppEnv } from "../app";

const SERVICE_TOKEN = process.env.GATEWAY_SERVICE_TOKEN;

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header("Authorization");

  // Service-to-service call from the gateway
  if (authHeader?.startsWith("Bearer ") && SERVICE_TOKEN) {
    const token = authHeader.slice(7);
    if (token === SERVICE_TOKEN) {
      const userId = c.req.header("X-User-Id");
      const userEmail = c.req.header("X-User-Email");
      const userRole = c.req.header("X-User-Role") ?? "member";

      if (!userId || !userEmail) {
        return c.json({ error: "Missing user identity headers" }, 400);
      }

      c.set("user", { id: userId, email: userEmail, role: userRole });
      return next();
    }
  }

  // Clerk auth — injected by the Next.js route handler
  const clerkUserId = c.req.header("X-Clerk-User-Id");
  if (clerkUserId) {
    const clerkEmail = c.req.header("X-Clerk-User-Email") ?? "";
    c.set("user", {
      id: clerkUserId,
      email: clerkEmail,
      role: "member",
    });
    return next();
  }

  return c.json({ error: "Unauthorized" }, 401);
}
