import {
  approveDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  searchDocuments,
} from "../lib/intake.js";
import type { ToolContext, ToolDef } from "./server.js";

export const localTools: ToolDef[] = [
  // ── Intake ──
  {
    name: "list_intake_documents",
    description:
      "List intake documents with optional filters for type, status, date range, and sort order.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["invoice", "receipt", "contract", "delivery_note", "bill"] },
        status: {
          type: "string",
          enum: ["processing", "pending", "reviewed", "approved", "overdue", "awaiting_signature"],
        },
        sort: { type: "string", enum: ["newest", "oldest"] },
        dateFrom: { type: "string" },
        dateTo: { type: "string" },
      },
    },
    handler: async (args) => {
      const result = await listDocuments(args as any);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.total,
                counts: result.counts,
                documents: result.documents.map((d) => ({
                  id: d.id,
                  type: d.type,
                  status: d.status,
                  description: d.description,
                  receivedAt: d.receivedAt,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  },
  {
    name: "get_intake_document",
    description:
      "Get full details of an intake document by its ID, including extracted data and AI summary.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await getDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return { content: [{ type: "text", text: JSON.stringify(document, null, 2) }] };
    },
  },
  {
    name: "search_intake_documents",
    description:
      "Search intake documents by text query. Searches across description, AI summary, and OCR text.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 1 },
        type: { type: "string", enum: ["invoice", "receipt", "contract", "delivery_note", "bill"] },
      },
      required: ["query"],
    },
    handler: async ({ query, type }) => {
      const result = await searchDocuments(query as string, type as any);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.total,
                documents: result.documents.map((d) => ({
                  id: d.id,
                  type: d.type,
                  status: d.status,
                  description: d.description,
                  aiSummary: d.aiSummary,
                  receivedAt: d.receivedAt,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  },
  {
    name: "approve_intake_document",
    description: "Approve an intake document, changing its status to approved.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await approveDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return {
        content: [
          {
            type: "text",
            text: `Document ${id} approved. Type: ${document.type}, Description: ${document.description}`,
          },
        ],
      };
    },
  },
  {
    name: "delete_intake_document",
    description: "Soft-delete an intake document by moving it to trash.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await deleteDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return { content: [{ type: "text", text: `Document ${id} moved to trash.` }] };
    },
  },
];
