import { extractMcpTools, mcpAuthMiddleware } from "@cometa/shared";
import { StreamableHTTPTransport } from "@hono/mcp";
import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import type { SignaturesEnv } from "./lib/types.js";
import { createMcpServer } from "./mcp/server.js";
import { authMiddleware } from "./middleware/auth.js";
import { healthRoutes } from "./routes/health.js";
import { requestRoutes } from "./routes/requests.js";
import { signRoutes } from "./routes/sign.js";

export function createApp(): Hono<SignaturesEnv> {
  const app = new Hono<SignaturesEnv>();

  app.use(
    "/*",
    cors({
      origin: (origin) => origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization", "Mcp-Session-Id"],
      exposeHeaders: ["Mcp-Session-Id"],
    }),
  );

  app.use("*", async (c, next) => {
    console.log(`[req] ${c.req.method} ${new URL(c.req.url).pathname}`);
    await next();
    console.log(`[res] ${c.req.method} ${new URL(c.req.url).pathname} → ${c.res.status}`);
  });

  // Health (no auth)
  app.route("/", healthRoutes);

  // OpenAPI spec
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Cometa Signatures API",
          version: "0.1.0",
          description: "E-signature lifecycle, signing flows, and MCP tools.",
        },
      },
    }),
  );

  // ── Scalar API docs ──
  app.get(
    "/docs",
    apiReference({
      theme: "kepler",
      spec: { url: "/openapi" },
    }),
  );

  // MCP routes — bearer-token auth shared between Lambda env and Anthropic agent definition
  app.use("/mcp", mcpAuthMiddleware);
  app.use("/mcp/tools", mcpAuthMiddleware);

  // MCP tool catalog for gateway discovery
  app.get("/mcp/tools", (c) => {
    const mcpServer = createMcpServer();
    return c.json(extractMcpTools(mcpServer));
  });

  // MCP endpoint
  app.all("/mcp", async (c) => {
    const mcpServer = createMcpServer();
    const transport = new StreamableHTTPTransport();
    await mcpServer.connect(transport);

    const response = await transport.handleRequest(c);
    if (response) {
      return response;
    }

    return c.json({ error: "MCP request failed" }, 500);
  });

  // Public signing routes (token-based, no auth)
  app.route("/api/sign", signRoutes);

  // Authenticated API routes
  app.use("/api/*", authMiddleware);
  app.route("/api/requests", requestRoutes);

  return app;
}
