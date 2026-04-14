import { StreamableHTTPTransport } from "@hono/mcp";
import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import { createOAuthRoutes } from "./auth/routes.js";
import { faviconSvg } from "./favicon.js";
import type { GatewayEnv } from "./lib/types.js";
import { getProxyStatus, getUpstreamTools } from "./mcp/proxy.js";
import { createMcpServer } from "./mcp/server.js";
import { localTools } from "./mcp/tools.js";
import { authMiddleware, mcpAuth } from "./middleware/auth.js";
import { documentRoutes } from "./routes/documents.js";
import { noteRoutes } from "./routes/notes.js";
import { publicSignatureRoutes, signatureRoutes } from "./routes/signatures.js";

export function createApp(): Hono<GatewayEnv> {
  const app = new Hono<GatewayEnv>();

  // ── CORS ──
  // CORS is handled here, NOT on the Lambda function URL (cors_enabled=false
  // in terraform) to avoid duplicate Access-Control-Allow-Origin headers.
  const ALLOWED_ORIGINS = new Set([
    "https://notes.daniellourie.me",
    "https://docs.daniellourie.me",
    "https://admin.daniellourie.me",
    "https://drive.daniellourie.me",
    "https://sign.daniellourie.me",
    "https://departments.daniellourie.me",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ]);

  app.use(
    "/*",
    cors({
      origin: (origin) => {
        if (ALLOWED_ORIGINS.has(origin)) return origin;
        // MCP/OAuth clients (Claude Desktop, etc.) can connect from any origin
        return origin;
      },
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
    console.log(
      `[req] ${c.req.method} ${new URL(c.req.url).pathname} auth:${!!c.req.header("Authorization")}`,
    );
    await next();
    console.log(`[res] ${c.req.method} ${new URL(c.req.url).pathname} → ${c.res.status}`);
  });

  // ── Health ──
  app.get("/health", (c) => c.json({ status: "ok" }));

  // ── Favicon ──
  app.get("/favicon.ico", (c) => {
    return c.body(faviconSvg, 200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    });
  });

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
          description: "API gateway and MCP server for the Cometa document management platform.",
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

  // ── Proxied API docs for downstream services ──
  const DOCUMENTS_API_URL = process.env["DOCUMENTS_API_URL"] ?? "http://localhost:3006";
  const SIGNATURES_API_URL = process.env["SIGNATURES_API_URL"] ?? "http://localhost:3007";
  const TASKS_API_BASE_URL = process.env["TASKS_API_URL"] ?? "http://localhost:3005";
  const DRIVE_API_URL = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";

  // Proxy OpenAPI specs from downstream services
  app.get("/docs/documents/openapi", async (c) => {
    try {
      const res = await fetch(`${DOCUMENTS_API_URL}openapi`);
      if (!res.ok) return c.json({ error: "Documents API spec unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Documents API unreachable" }, 502);
    }
  });

  app.get("/docs/signatures/openapi", async (c) => {
    try {
      const res = await fetch(`${SIGNATURES_API_URL}openapi`);
      if (!res.ok) return c.json({ error: "Signatures API spec unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Signatures API unreachable" }, 502);
    }
  });

  app.get("/docs/tasks/openapi", async (c) => {
    try {
      const res = await fetch(`${TASKS_API_BASE_URL}openapi`);
      if (!res.ok) return c.json({ error: "Tasks API spec unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Tasks API unreachable" }, 502);
    }
  });

  app.get("/docs/drive/openapi", async (c) => {
    try {
      const res = await fetch(`${DRIVE_API_URL}openapi`);
      if (!res.ok) return c.json({ error: "Drive API spec unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Drive API unreachable" }, 502);
    }
  });

  // Scalar UIs for downstream services
  app.get(
    "/docs/documents",
    apiReference({
      theme: "kepler",
      spec: { url: "/docs/documents/openapi" },
    }),
  );

  app.get(
    "/docs/signatures",
    apiReference({
      theme: "kepler",
      spec: { url: "/docs/signatures/openapi" },
    }),
  );

  app.get(
    "/docs/tasks",
    apiReference({
      theme: "kepler",
      spec: { url: "/docs/tasks/openapi" },
    }),
  );

  app.get(
    "/docs/drive",
    apiReference({
      theme: "kepler",
      spec: { url: "/docs/drive/openapi" },
    }),
  );

  // ── Per-service MCP tool proxies ──
  const TASKS_MCP_BASE =
    process.env["TASKS_MCP_URL"]?.replace(/\/mcp$/, "/") ??
    "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws/";

  app.get("/mcp/tools/signatures", async (c) => {
    try {
      const res = await fetch(`${SIGNATURES_API_URL}mcp/tools`);
      if (!res.ok) return c.json({ error: "Signatures tools unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Signatures unreachable" }, 502);
    }
  });

  app.get("/mcp/tools/tasks", async (c) => {
    try {
      const res = await fetch(`${TASKS_MCP_BASE}mcp/tools`);
      if (!res.ok) return c.json({ error: "Tasks tools unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Tasks unreachable" }, 502);
    }
  });

  app.get("/mcp/tools/drive", (c) =>
    c.json({
      total: 0,
      tools: [],
      note: "Drive service does not have MCP tools yet — REST API only",
    }),
  );

  const UTILITIES_API_URL = process.env["UTILITIES_API_URL"] ?? "http://localhost:3008";

  app.get("/mcp/tools/utilities", async (c) => {
    try {
      const res = await fetch(`${UTILITIES_API_URL}mcp/tools`);
      if (!res.ok) return c.json({ error: "Utilities tools unavailable" }, 502);
      return c.json(await res.json());
    } catch {
      return c.json({ error: "Utilities unreachable" }, 502);
    }
  });

  // ── MCP Explorer ──
  const mcpExplorerStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e5e5; }
  a { color: #e5e5e5; text-decoration: none; }
  a:hover { color: #fff; }
  .header { padding: 24px 32px; border-bottom: 1px solid #262626; }
  .header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .header h1 { font-size: 18px; font-weight: 600; }
  .header .badge { font-size: 12px; color: #737373; background: #1a1a1a; padding: 2px 8px; border-radius: 10px; }
  .nav { display: flex; gap: 6px; flex-wrap: wrap; }
  .nav a { font-size: 13px; padding: 6px 14px; border-radius: 6px; border: 1px solid #262626; transition: all 0.15s; }
  .nav a:hover { border-color: #404040; background: #1a1a1a; }
  .nav a.active { background: #f5f5f5; color: #0a0a0a; border-color: #f5f5f5; }
  .container { max-width: 960px; margin: 0 auto; padding: 24px 32px; }
  .service-card { border: 1px solid #262626; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: #111; transition: border-color 0.15s; display: block; }
  .service-card:hover { border-color: #404040; }
  .service-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .service-card p { font-size: 13px; color: #737373; margin-bottom: 12px; }
  .service-card .links { display: flex; gap: 12px; }
  .service-card .links a { font-size: 12px; color: #a3a3a3; padding: 4px 10px; border: 1px solid #262626; border-radius: 4px; }
  .service-card .links a:hover { color: #fff; border-color: #525252; }
  .tool { border: 1px solid #262626; border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
  .tool-header { padding: 14px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #111; }
  .tool-header:hover { background: #1a1a1a; }
  .tool-name { font-size: 14px; font-weight: 600; font-family: 'SF Mono', Monaco, monospace; color: #f5f5f5; }
  .tool-desc { font-size: 13px; color: #a3a3a3; padding: 0 16px 12px; background: #111; }
  .tool-body { padding: 16px; border-top: 1px solid #262626; display: none; background: #0d0d0d; }
  .tool.open .tool-body { display: block; }
  .schema { font-family: 'SF Mono', Monaco, monospace; font-size: 12px; background: #111; border: 1px solid #262626; border-radius: 6px; padding: 12px; white-space: pre-wrap; color: #a3a3a3; overflow-x: auto; }
  .schema-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #737373; margin-bottom: 8px; }
  .loading { color: #737373; font-size: 14px; text-align: center; padding: 48px; }
  .chevron { transition: transform 0.15s; color: #525252; }
  .tool.open .chevron { transform: rotate(90deg); }`;

  const mcpExplorerNav = (active: string) => `
<div class="nav">
  <a href="/mcp/explorer" class="${active === "index" ? "active" : ""}">Overview</a>
  <a href="/mcp/explorer/all" class="${active === "all" ? "active" : ""}">All Tools</a>
  <a href="/mcp/explorer/gateway" class="${active === "gateway" ? "active" : ""}">Gateway</a>
  <a href="/mcp/explorer/signatures" class="${active === "signatures" ? "active" : ""}">Signatures</a>
  <a href="/mcp/explorer/tasks" class="${active === "tasks" ? "active" : ""}">Tasks</a>
  <a href="/mcp/explorer/drive" class="${active === "drive" ? "active" : ""}">Drive</a>
  <a href="/mcp/explorer/utilities" class="${active === "utilities" ? "active" : ""}">Utilities</a>
</div>`;

  const mcpToolListScript = (endpoint: string) => `
<script>
(async () => {
  const container = document.getElementById('tools');
  const countEl = document.getElementById('tool-count');
  try {
    const res = await fetch('${endpoint}');
    const data = await res.json();
    countEl.textContent = data.total + ' tools';
    if (!data.tools?.length) {
      container.innerHTML = '<div class="loading">No tools discovered</div>';
      return;
    }
    container.innerHTML = '';
    for (const tool of data.tools) {
      const div = document.createElement('div');
      div.className = 'tool';
      const schema = tool.inputSchema ? JSON.stringify(tool.inputSchema, null, 2) : null;
      div.innerHTML =
        '<div class="tool-header" onclick="this.parentElement.classList.toggle(\\'open\\')">' +
          '<div><span class="tool-name">' + tool.name + '</span></div>' +
          '<span class="chevron">\\u25B8</span>' +
        '</div>' +
        '<div class="tool-desc">' + (tool.description || '') + '</div>' +
        '<div class="tool-body">' +
          (schema ? '<div class="schema-label">Input Schema</div><div class="schema">' + schema + '</div>' : '<p style="color:#737373;font-size:13px">No input schema</p>') +
        '</div>';
      container.appendChild(div);
    }
  } catch (e) {
    container.innerHTML = '<div class="loading" style="color:#fca5a5">Failed to load tools: ' + e.message + '</div>';
  }
})();
</script>`;

  const mcpToolPage = (title: string, active: string, endpoint: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — Cometa MCP Explorer</title>
<style>${mcpExplorerStyles}</style>
</head>
<body>
<div class="header">
  <div class="header-top">
    <h1>${title}</h1>
    <span class="badge" id="tool-count">loading...</span>
  </div>
  ${mcpExplorerNav(active)}
</div>
<div class="container" id="tools">
  <div class="loading">Loading tools...</div>
</div>
${mcpToolListScript(endpoint)}
</body>
</html>`;

  // Index page — service overview
  app.get("/mcp/explorer", async (c) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cometa MCP Explorer</title>
<style>${mcpExplorerStyles}</style>
</head>
<body>
<div class="header">
  <div class="header-top">
    <h1>MCP Explorer</h1>
  </div>
  ${mcpExplorerNav("index")}
</div>
<div class="container">
  <div class="service-card">
    <h3>Gateway</h3>
    <p>Central MCP server — aggregates tools from all services. Document management, accounting, drive, and more.</p>
    <div class="links">
      <a href="/mcp/explorer/gateway">MCP Tools</a>
      <a href="/docs">API Docs</a>
    </div>
  </div>
  <div class="service-card">
    <h3>Signatures</h3>
    <p>E-signature lifecycle — request signatures, track status, nudge signers, cancel requests.</p>
    <div class="links">
      <a href="/mcp/explorer/signatures">MCP Tools</a>
      <a href="/docs/signatures">API Docs</a>
    </div>
  </div>
  <div class="service-card">
    <h3>Tasks</h3>
    <p>Task management, assignment workflows, and cross-service orchestration.</p>
    <div class="links">
      <a href="/mcp/explorer/tasks">MCP Tools</a>
      <a href="/docs/tasks">API Docs</a>
    </div>
  </div>
  <div class="service-card">
    <h3>Drive</h3>
    <p>Internal file management — Google Drive integration, file handoffs, and access control.</p>
    <div class="links">
      <a href="/mcp/explorer/drive">MCP Tools</a>
      <a href="/docs/drive">API Docs</a>
    </div>
  </div>
  <div class="service-card">
    <h3>Utilities</h3>
    <p>Document generation with company branding, PDF conversion, and link unfurling.</p>
    <div class="links">
      <a href="/mcp/explorer/utilities">MCP Tools</a>
    </div>
  </div>
  <div class="service-card">
    <h3>Documents</h3>
    <p>Document ingestion, OCR, AI classification, and CRUD. No MCP tools — REST API only.</p>
    <div class="links">
      <a href="/docs/documents">API Docs</a>
    </div>
  </div>
</div>
</body>
</html>`;
    return c.html(html);
  });

  // Per-service tool pages
  app.get("/mcp/explorer/all", (c) => c.html(mcpToolPage("All Tools", "all", "/mcp/tools")));
  app.get("/mcp/explorer/gateway", (c) =>
    c.html(mcpToolPage("Gateway Tools", "gateway", "/mcp/tools")),
  );
  app.get("/mcp/explorer/signatures", (c) =>
    c.html(mcpToolPage("Signatures Tools", "signatures", "/mcp/tools/signatures")),
  );
  app.get("/mcp/explorer/tasks", (c) =>
    c.html(mcpToolPage("Tasks Tools", "tasks", "/mcp/tools/tasks")),
  );
  app.get("/mcp/explorer/drive", (c) =>
    c.html(mcpToolPage("Drive Tools", "drive", "/mcp/tools/drive")),
  );
  app.get("/mcp/explorer/utilities", (c) =>
    c.html(mcpToolPage("Utilities Tools", "utilities", "/mcp/tools/utilities")),
  );

  // ── Public signing routes (no auth — token-based) ──
  app.route("/sign", publicSignatureRoutes);

  // ── REST API routes (documents only — tasks has its own API) ──
  app.use("/api/*", authMiddleware);
  app.route("/api/documents", documentRoutes);
  app.route("/api/notes", noteRoutes);
  app.route("/api/signatures", signatureRoutes);

  // ── MCP Tool Catalog (public, no auth) ──
  app.get("/mcp/tools", async (c) => {
    const TASKS_MCP_URL =
      process.env["TASKS_MCP_URL"] ??
      "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws/mcp";

    const catalog = localTools.map((t) => ({ name: t.name, description: t.description }));

    try {
      const upstream = await getUpstreamTools(TASKS_MCP_URL);
      for (const t of upstream) {
        catalog.push({ name: t.name, description: t.description ?? "" });
      }
    } catch {
      /* proxy error is captured in getProxyStatus */
    }

    const proxyError = getProxyStatus();
    return c.json({
      total: catalog.length,
      tools: catalog,
      ...(proxyError && { upstream: { status: "error", ...proxyError } }),
    });
  });

  // ── MCP Server (OAuth auth required) ──
  app.all("/mcp", mcpAuth, async (c) => {
    const mcpServer = await createMcpServer(c.get("user"));
    const transport = new StreamableHTTPTransport({
      enableJsonResponse: true, // No SSE — pure JSON request/response (Lambda-compatible)
    });
    await mcpServer.connect(transport);

    const response = await transport.handleRequest(c);
    if (response) {
      return response;
    }

    return c.json({ error: "MCP request failed" }, 500);
  });

  return app;
}
