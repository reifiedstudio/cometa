import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import { cleanupTrashedDocuments } from "./lib/cleanup.js";
import { seedDefaultDocumentTypes } from "./lib/seed-document-types.js";
import type { DocumentsEnv } from "./lib/types.js";
import { authMiddleware } from "./middleware/auth.js";
import { documentTypeRoutes } from "./routes/document-types.js";
import { documentRoutes } from "./routes/documents.js";
import { fileRoutes } from "./routes/files.js";
import { healthRoutes } from "./routes/health.js";
import { searchRoutes } from "./routes/search.js";
import { uploadRoutes } from "./routes/upload.js";

export function createApp(): Hono<DocumentsEnv> {
  const app = new Hono<DocumentsEnv>();

  app.use(
    "/*",
    cors({
      origin: (origin) => origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
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
          title: "Cometa Documents API",
          version: "0.1.0",
          description: "Document ingestion, OCR, classification, and CRUD.",
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

  // Authenticated API routes
  app.use("/api/*", authMiddleware);
  app.route("/api/documents", documentRoutes);
  app.route("/api/upload", uploadRoutes);
  app.route("/api/search", searchRoutes);
  app.route("/api/files", fileRoutes);
  app.route("/api/document-types", documentTypeRoutes);

  app.post("/api/admin/cleanup", async (c) => {
    const result = await cleanupTrashedDocuments();
    return c.json(result);
  });

  app.post("/api/admin/seed-types", async (c) => {
    const result = await seedDefaultDocumentTypes();
    return c.json(result);
  });

  return app;
}
