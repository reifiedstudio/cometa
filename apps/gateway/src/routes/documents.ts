import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator } from "hono-openapi/zod";
import { z } from "zod";
import type { GatewayEnv } from "../lib/types.js";
import {
  listDocuments,
  getDocument,
  searchDocuments,
  approveDocument,
  deleteDocument,
} from "../lib/documents.js";

const documentTypeEnum = z.enum([
  "invoice",
  "receipt",
  "contract",
  "delivery_note",
  "bill",
]);

const documentStatusEnum = z.enum([
  "processing",
  "pending",
  "reviewed",
  "approved",
  "overdue",
  "awaiting_signature",
]);

const documentSchema = z.object({
  id: z.string().uuid(),
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  fileHash: z.string(),
  s3Url: z.string(),
  thumbnailUrl: z.string().nullable(),
  type: documentTypeEnum.nullable(),
  status: documentStatusEnum,
  source: z.enum(["upload", "email"]),
  description: z.string().nullable(),
  aiSummary: z.string().nullable(),
  extractedData: z.unknown().nullable(),
  isDuplicate: z.boolean(),
  isVerified: z.boolean(),
  flags: z.unknown(),
  receivedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const listQuerySchema = z.object({
  type: documentTypeEnum.optional(),
  status: documentStatusEnum.optional(),
  sort: z.enum(["newest", "oldest"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

const searchQuerySchema = z.object({
  q: z.string().min(1),
  type: documentTypeEnum.optional(),
});

export const documentRoutes = new Hono<GatewayEnv>();

// List documents
documentRoutes.get(
  "/",
  describeRoute({
    tags: ["Documents"],
    summary: "List documents",
    description: "List documents with optional filters for type, status, date range, and sort order.",
    responses: {
      200: {
        description: "List of documents with counts",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                documents: z.array(documentSchema),
                total: z.number(),
                counts: z.record(z.string(), z.number()),
              }),
            ),
          },
        },
      },
    },
  }),
  validator("query", listQuerySchema),
  async (c) => {
    const { type, status, sort, dateFrom, dateTo } = c.req.valid("query");
    const result = await listDocuments({ type, status, sort, dateFrom, dateTo });
    return c.json(result);
  },
);

// Search documents
documentRoutes.get(
  "/search",
  describeRoute({
    tags: ["Documents"],
    summary: "Search documents",
    description: "Search documents by text query across description, AI summary, and OCR text.",
    responses: {
      200: {
        description: "Search results",
        content: {
          "application/json": {
            schema: resolver(
              z.object({
                documents: z.array(documentSchema),
                total: z.number(),
              }),
            ),
          },
        },
      },
    },
  }),
  validator("query", searchQuerySchema),
  async (c) => {
    const { q, type } = c.req.valid("query");
    const result = await searchDocuments(q, type);
    return c.json(result);
  },
);

// Get document by ID
documentRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Documents"],
    summary: "Get document by ID",
    description: "Retrieve a single document with all its details.",
    responses: {
      200: {
        description: "Document details",
        content: {
          "application/json": { schema: resolver(documentSchema) },
        },
      },
      404: {
        description: "Document not found",
      },
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
documentRoutes.post(
  "/:id/approve",
  describeRoute({
    tags: ["Documents"],
    summary: "Approve a document",
    description: "Mark a document as approved.",
    responses: {
      200: {
        description: "Updated document",
        content: {
          "application/json": { schema: resolver(documentSchema) },
        },
      },
      404: {
        description: "Document not found",
      },
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
documentRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["Documents"],
    summary: "Delete a document",
    description: "Soft-delete a document by moving it to trash.",
    responses: {
      200: {
        description: "Deleted document confirmation",
        content: {
          "application/json": {
            schema: resolver(
              z.object({ id: z.string().uuid(), status: z.literal("deleted") }),
            ),
          },
        },
      },
      404: {
        description: "Document not found",
      },
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
