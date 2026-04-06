import { Hono } from "hono";
import { cors } from "hono/cors";
import { documentRoutes } from "./routes/documents";
import { uploadRoutes } from "./routes/upload";
import { searchRoutes } from "./routes/search";
import { healthRoutes } from "./routes/health";
import { fileRoutes } from "./routes/files";
import { signatureRoutes, publicSignatureRoutes } from "./routes/signatures";
import { cleanupTrashedDocuments } from "./lib/cleanup";
import { authMiddleware } from "./middleware/auth";

export type AppEnv = {
  Variables: {
    user: { id: string; email: string; role: string };
  };
};

const app = new Hono<AppEnv>();

// ── Health ──
app.get("/health", (c) => c.json({ status: "ok" }));

// ── Public signing routes (token-based, no auth) ──
app.route("/api/sign", publicSignatureRoutes);

// ── Authenticated API routes ──
app.use("/api/*", authMiddleware);
app.route("/api/documents", documentRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/files", fileRoutes);
app.route("/api/signatures", signatureRoutes);

app.post("/api/admin/cleanup", async (c) => {
  const result = await cleanupTrashedDocuments();
  return c.json(result);
});

export default app;
