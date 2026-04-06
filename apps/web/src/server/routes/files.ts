import { Hono } from "hono";
import { getFileBuffer } from "../lib/s3";

export const fileRoutes = new Hono();

fileRoutes.get("/*", async (c) => {
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
});
