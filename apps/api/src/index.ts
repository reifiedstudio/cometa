import { Hono } from "hono";
import { cors } from "hono/cors";
import { documentRoutes } from "./routes/documents.js";
import { uploadRoutes } from "./routes/upload.js";
import { searchRoutes } from "./routes/search.js";
import { healthRoutes } from "./routes/health.js";

const app = new Hono();

app.use("/*", cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.route("/health", healthRoutes);
app.route("/api/documents", documentRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api/search", searchRoutes);

export default {
  port: Number(process.env.PORT ?? 3001),
  fetch: app.fetch,
};
