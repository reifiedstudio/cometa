import { db, schema } from "@cometa/db";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { and, asc, desc, eq, ne, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getPresignedUrl } from "../lib/s3.js";

const documentTypeEnum = z.enum(["invoice", "receipt", "contract", "delivery_note", "bill"]);
const documentStatusEnum = z.enum([
  "processing",
  "pending",
  "reviewed",
  "approved",
  "overdue",
  "awaiting_signature",
]);

export function registerIntakeTools(server: McpServer): void {
  server.tool(
    "list_intake_documents",
    "List intake documents with optional filters for type, status, date range, and sort order.",
    {
      type: documentTypeEnum.optional(),
      status: documentStatusEnum.optional(),
      sort: z.enum(["newest", "oldest"]).optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    },
    async ({ type, status, sort, dateFrom, dateTo }) => {
      const conditions = [];

      if (status !== "rejected") {
        conditions.push(ne(schema.documents.status, "rejected"));
      }
      if (type) conditions.push(eq(schema.documents.type, type));
      if (status) conditions.push(eq(schema.documents.status, status));
      if (dateFrom) conditions.push(sql`${schema.documents.receivedAt} >= ${dateFrom}`);
      if (dateTo) conditions.push(sql`${schema.documents.receivedAt} <= ${dateTo}`);

      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const orderBy =
        sort === "oldest" ? asc(schema.documents.receivedAt) : desc(schema.documents.receivedAt);

      const documents = await db.select().from(schema.documents).where(where).orderBy(orderBy);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                total: documents.length,
                documents: documents.map((d) => ({
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
  );

  server.tool(
    "get_intake_document",
    "Get full details of an intake document by its ID, including extracted data, AI summary, and a short-lived presigned URL the agent can read directly.",
    {
      id: z.string().describe("Document ID (e.g. doc_<uuid>)"),
    },
    async ({ id }) => {
      const [document] = await db
        .select()
        .from(schema.documents)
        .where(eq(schema.documents.id, id))
        .limit(1);

      if (!document) {
        return {
          content: [{ type: "text" as const, text: "Document not found." }],
          isError: true,
        };
      }

      let presignedUrl: string | undefined;
      if (document.s3Key) {
        try {
          presignedUrl = await getPresignedUrl(document.s3Key, 300);
        } catch (err) {
          console.error("[get_intake_document] failed to sign URL:", err);
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ ...document, presignedUrl }, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "search_intake_documents",
    "Search intake documents by text query. Searches across description, AI summary, and OCR text.",
    {
      query: z.string().min(1).describe("Search query"),
      type: documentTypeEnum.optional(),
    },
    async ({ query, type }) => {
      const pattern = `%${query}%`;
      const conditions = [
        or(
          sql`${schema.documents.description} ILIKE ${pattern}`,
          sql`${schema.documents.aiSummary} ILIKE ${pattern}`,
          sql`${schema.documents.ocrText} ILIKE ${pattern}`,
        ),
      ];
      if (type) conditions.push(eq(schema.documents.type, type));

      const documents = await db
        .select()
        .from(schema.documents)
        .where(and(...conditions))
        .orderBy(desc(schema.documents.receivedAt));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                total: documents.length,
                documents: documents.map((d) => ({
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
  );

  server.tool(
    "approve_intake_document",
    "Approve an intake document, changing its status to approved.",
    {
      id: z.string().describe("Document ID (e.g. doc_<uuid>)"),
    },
    async ({ id }) => {
      const [document] = await db
        .update(schema.documents)
        .set({ status: "approved", updatedAt: new Date() })
        .where(eq(schema.documents.id, id))
        .returning();

      if (!document) {
        return {
          content: [{ type: "text" as const, text: "Document not found." }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Document ${document.id} approved. Type: ${document.type}, Description: ${document.description}`,
          },
        ],
      };
    },
  );

  server.tool(
    "delete_intake_document",
    "Soft-delete an intake document by moving it to trash.",
    {
      id: z.string().describe("Document ID (e.g. doc_<uuid>)"),
    },
    async ({ id }) => {
      const [document] = await db
        .update(schema.documents)
        .set({ status: "rejected", updatedAt: new Date() })
        .where(eq(schema.documents.id, id))
        .returning();

      if (!document) {
        return {
          content: [{ type: "text" as const, text: "Document not found." }],
          isError: true,
        };
      }

      return {
        content: [{ type: "text" as const, text: `Document ${document.id} moved to trash.` }],
      };
    },
  );
}
