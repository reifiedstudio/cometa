import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import {
  approveDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  searchDocuments,
} from "../lib/intake.js";
import type { GatewayEnv } from "../lib/types.js";

export const intakeRoutes = new Hono<GatewayEnv>();

// List documents
intakeRoutes.get(
  "/",
  describeRoute({
    tags: ["Intake"],
    summary: "List documents",
    description:
      "List documents with optional filters for type, status, date range, and sort order.",
    responses: {
      200: {
        description: "List of documents with counts",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                documents: { type: "array", items: {} },
                total: { type: "number" },
                counts: { type: "object" },
              },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const type = c.req.query("type");
    const status = c.req.query("status");
    const sort = c.req.query("sort");
    const dateFrom = c.req.query("dateFrom");
    const dateTo = c.req.query("dateTo");
    const result = await listDocuments({ type, status, sort, dateFrom, dateTo });
    return c.json(result);
  },
);

// Search documents
intakeRoutes.get(
  "/search",
  describeRoute({
    tags: ["Intake"],
    summary: "Search documents",
    description: "Search documents by text query across description, AI summary, and OCR text.",
    responses: {
      200: {
        description: "Search results",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { documents: { type: "array", items: {} }, total: { type: "number" } },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const q = c.req.query("q");
    const type = c.req.query("type");
    if (!q) return c.json({ error: "Query parameter 'q' is required" }, 400);
    const result = await searchDocuments(q, type);
    return c.json(result);
  },
);

// Get document by ID
intakeRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Intake"],
    summary: "Get document by ID",
    description: "Retrieve a single document with all its details.",
    responses: {
      200: {
        description: "Document details",
        content: {
          "application/json": { schema: { type: "object" } },
        },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const document = await getDocument(id);

    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    return c.json(document);
  },
);

// Approve document
intakeRoutes.post(
  "/:id/approve",
  describeRoute({
    tags: ["Intake"],
    summary: "Approve a document",
    description: "Mark a document as approved.",
    responses: {
      200: {
        description: "Updated document",
        content: {
          "application/json": { schema: { type: "object" } },
        },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const document = await approveDocument(id);

    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    return c.json(document);
  },
);

// Delete document (soft delete)
intakeRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["Intake"],
    summary: "Delete a document",
    description: "Soft-delete a document by moving it to trash.",
    responses: {
      200: {
        description: "Deleted document confirmation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const document = await deleteDocument(id);

    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    return c.json({ id: document.id, status: "deleted" as const });
  },
);
