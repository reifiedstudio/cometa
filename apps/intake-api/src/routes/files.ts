import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { getFileBuffer } from "../lib/s3.js";

export const fileRoutes = new Hono();

fileRoutes.get(
  "/*",
  describeRoute({
    tags: ["Files"],
    summary: "Get file by key",
    description: "Serve a file from S3 by its key path.",
    responses: {
      200: { description: "File content" },
      400: { description: "No file key provided" },
      404: { description: "File not found" },
    },
  }),
  async (c) => {
    const key = c.req.path.replace("/api/files/", "");

    if (!key) {
      return c.json({ error: "No file key provided" }, 400);
    }

    const file = await getFileBuffer(key);
    if (!file) {
      return c.json({ error: "File not found" }, 404);
    }

    return new Response(new Uint8Array(file.buffer), {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
);
