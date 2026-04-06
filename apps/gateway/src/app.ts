import { Hono } from "hono";
import { cors } from "hono/cors";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { StreamableHTTPTransport } from "@hono/mcp";
import { authMiddleware, mcpAuth } from "./middleware/auth.js";
import { documentRoutes } from "./routes/documents.js";
import { signatureRoutes, publicSignatureRoutes } from "./routes/signatures.js";
import { createMcpServer } from "./mcp/server.js";
import { createOAuthRoutes } from "./auth/routes.js";
import type { GatewayEnv } from "./lib/types.js";

export function createApp(): Hono<GatewayEnv> {
  const app = new Hono<GatewayEnv>();

  // ── CORS ──
  app.use(
    "/*",
    cors({
      origin: (origin) => origin, // Allow any origin for OAuth redirects
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization", "Accept", "Mcp-Session-Id", "MCP-Protocol-Version"],
      exposeHeaders: ["Mcp-Session-Id"],
    }),
  );

  // ── Health ──
  app.get("/health", (c) => c.json({ status: "ok" }));

  // ── OAuth routes (must be before auth middleware) ──
  app.route("/", createOAuthRoutes());

  // ── OpenAPI spec ──
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Cometa Gateway API",
          version: "0.1.0",
          description:
            "API gateway and MCP server for the Cometa document management platform.",
        },
        servers: [
          {
            url: "http://localhost:3002",
            description: "Local development",
          },
        ],
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Clerk JWT session token",
            },
          },
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

  // ── Public signing routes (no auth — token-based) ──
  app.route("/sign", publicSignatureRoutes);

  // ── REST API routes (auth required) ──
  app.use("/api/*", authMiddleware);
  app.route("/api/documents", documentRoutes);
  app.route("/api/signatures", signatureRoutes);

  // ── MCP Server (OAuth auth required) ──
  app.all("/mcp", mcpAuth, async (c) => {
    const mcpServer = createMcpServer();
    const transport = new StreamableHTTPTransport();
    await mcpServer.connect(transport);

    const response = await transport.handleRequest(c);
    if (response) {
      return response;
    }

    return c.json({ error: "MCP request failed" }, 500);
  });

  return app;
}
