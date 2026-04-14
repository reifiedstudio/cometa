import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { checkConnection } from "../lib/google-drive.js";

export const healthRoutes = new Hono();

healthRoutes.get(
  "/health",
  describeRoute({
    tags: ["Health"],
    summary: "Health check",
    description: "Check service health including Google Drive connection.",
    responses: {
      200: {
        description: "Service health status",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { status: { type: "string" }, services: { type: "object" } },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const drive = await checkConnection();
    return c.json({
      status: drive.ok ? "ok" : "degraded",
      services: {
        googleDrive: drive,
      },
    });
  },
);
