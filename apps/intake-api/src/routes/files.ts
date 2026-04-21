import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { getPresignedUrl } from "../lib/s3.js";

export const fileRoutes = new Hono();

fileRoutes.get(
  "/*",
  describeRoute({
    tags: ["Files"],
    summary: "Get file by key",
    description: "Redirects to a time-limited signed S3 URL for direct browser access.",
    responses: {
      302: { description: "Redirect to signed S3 URL" },
      400: { description: "No file key provided" },
      404: { description: "File not found or S3 not configured" },
    },
  }),
  async (c) => {
    const key = c.req.path.replace("/api/files/", "");

    if (!key) {
      return c.json({ error: "No file key provided" }, 400);
    }

    const url = await getPresignedUrl(key, 3600);
    if (!url) {
      return c.json({ error: "File not found" }, 404);
    }

    return c.redirect(url, 302);
  },
);
