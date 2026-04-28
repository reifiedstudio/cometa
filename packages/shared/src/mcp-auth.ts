import type { Context, Next } from "hono";

/**
 * Bearer-token auth for MCP routes.
 *
 * Requires `Authorization: Bearer <MCP_AUTH_TOKEN>` on every request.
 * The token is shared between the Lambda (via env) and Anthropic's
 * managed-agent runtime (via `authorization_token` on the agent definition).
 *
 * Behaviour:
 * - 503 if `MCP_AUTH_TOKEN` is not configured (fail closed)
 * - 401 if the header is missing or doesn't match
 * - calls `next()` otherwise
 */
export async function mcpAuthMiddleware(c: Context, next: Next) {
  const expected = process.env["MCP_AUTH_TOKEN"];
  if (!expected) {
    return c.json({ error: "MCP auth not configured" }, 503);
  }

  const got = c.req.header("Authorization");
  if (got !== `Bearer ${expected}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return next();
}
