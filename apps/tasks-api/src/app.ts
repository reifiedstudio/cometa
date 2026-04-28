import { extractMcpTools, mcpAuthMiddleware } from "@cometa/shared";
import { StreamableHTTPTransport } from "@hono/mcp";
import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import type { TasksEnv } from "./lib/types.js";
import { createMcpServer } from "./mcp/server.js";
import { authMiddleware } from "./middleware/auth.js";
import { serviceRoutes } from "./routes/services.js";

export function createApp(): Hono<TasksEnv> {
  const app = new Hono<TasksEnv>();

  // ── CORS ──
  app.use(
    "/*",
    cors({
      origin: (origin) => origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "Mcp-Session-Id",
        "MCP-Protocol-Version",
      ],
      exposeHeaders: ["Mcp-Session-Id"],
    }),
  );

  // ── Request logger ──
  app.use("*", async (c, next) => {
    console.log(`[req] ${c.req.method} ${new URL(c.req.url).pathname}`);
    await next();
    console.log(`[res] ${c.req.method} ${new URL(c.req.url).pathname} → ${c.res.status}`);
  });

  // ── Health ──
  app.get("/health", (c) => c.json({ status: "ok" }));

  // ── OpenAPI spec ──
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Cometa Tasks API",
          version: "0.1.0",
          description: "Task management, inter-department messaging, and agent sessions.",
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

  // ── MCP Tool Catalog (plain JSON for gateway discovery) ──
  app.get("/mcp/tools", (c) => {
    const mcpServer = createMcpServer();
    return c.json(extractMcpTools(mcpServer));
  });

  // ── MCP Server ──
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

  // ── Authenticated API routes ──
  app.use("/api/*", authMiddleware);
  app.route("/api/services", serviceRoutes);

  return app;
}
