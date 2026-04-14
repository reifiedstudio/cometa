import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import type { DocumentsEnv } from "../lib/types.js";

/**
 * Document types are CANONICAL and read-only at runtime. They are defined
 * in `lib/seed-document-types.ts` and pushed via `POST /api/admin/seed-types`.
 * No create / update / delete endpoints are exposed — the UI is view-only.
 */
export const documentTypeRoutes = new Hono<DocumentsEnv>();

// List all document types
documentTypeRoutes.get(
  "/",
  describeRoute({
    tags: ["Document Types"],
    summary: "List document types",
    responses: {
      200: {
        description: "List of document types",
        content: {
          "application/json": {
            schema: { type: "object", properties: { types: { type: "array", items: {} } } },
          },
        },
      },
    },
  }),
  async (c) => {
    const { db, schema } = await import("@cometa/db");
    const { asc } = await import("drizzle-orm");

    const types = await db
      .select()
      .from(schema.documentTypes)
      .orderBy(asc(schema.documentTypes.createdAt));

    return c.json({ types });
  },
);

// Get a single document type
documentTypeRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Document Types"],
    summary: "Get document type by ID",
    responses: {
      200: {
        description: "Document type",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const { db, schema } = await import("@cometa/db");
    const { eq } = await import("drizzle-orm");

    const [docType] = await db
      .select()
      .from(schema.documentTypes)
      .where(eq(schema.documentTypes.id, c.req.param("id")))
      .limit(1);

    if (!docType) return c.json({ error: "Not found" }, 404);
    return c.json(docType);
  },
);
