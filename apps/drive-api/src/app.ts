import { apiReference } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import type { DriveEnv } from "./lib/types.js";
import { authMiddleware } from "./middleware/auth.js";
import { accessRoutes } from "./routes/access.js";
import { fileRoutes } from "./routes/files.js";
import { handoffRoutes } from "./routes/handoffs.js";
import { healthRoutes } from "./routes/health.js";

export function createApp(): Hono<DriveEnv> {
  const app = new Hono<DriveEnv>();

  // ── CORS ──
  app.use(
    "/*",
    cors({
      origin: (origin) => origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // ── Request logger ──
  app.use("*", async (c, next) => {
    console.log(`[req] ${c.req.method} ${new URL(c.req.url).pathname}`);
    await next();
    console.log(`[res] ${c.req.method} ${new URL(c.req.url).pathname} → ${c.res.status}`);
  });

  // ── Health (no auth) ──
  app.route("/", healthRoutes);

  // ── OpenAPI spec ──
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Cometa Drive API",
          version: "0.1.0",
          description:
            "Google Drive integration — file handoffs, access control, and department file management.",
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

  // ── Authenticated API routes ──
  app.use("/api/*", authMiddleware);
  app.route("/api/handoffs", handoffRoutes);
  app.route("/api/access", accessRoutes);
  app.route("/api/files", fileRoutes);

  return app;
}
