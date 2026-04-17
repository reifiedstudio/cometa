import { Hono } from "hono";
import { describeRoute } from "hono-openapi";

export const healthRoutes = new Hono();

healthRoutes.get(
  "/",
  describeRoute({
    tags: ["Health"],
    summary: "Health check",
    responses: {
      200: {
        description: "Service is healthy",
        content: {
          "application/json": {
            schema: { type: "object", properties: { status: { type: "string" } } },
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({ status: "ok" });
  },
);
