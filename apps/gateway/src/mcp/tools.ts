import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  listDocuments,
  getDocument,
  searchDocuments,
  approveDocument,
  deleteDocument,
} from "../lib/documents.js";
import {
  createSignatureRequest,
  getSignatureRequestByDocument,
} from "../lib/signatures.js";

export function registerDocumentTools(server: McpServer): void {
  server.tool(
    "list_documents",
    "List documents with optional filters for type, status, date range, and sort order.",
    {
      type: z.enum(["invoice", "receipt", "contract", "delivery_note", "bill"]).optional(),
      status: z.enum(["processing", "pending", "reviewed", "approved", "overdue", "awaiting_signature"]).optional(),
      sort: z.enum(["newest", "oldest"]).optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    },
    async ({ type, status, sort, dateFrom, dateTo }) => {
      const result = await listDocuments({ type, status, sort, dateFrom, dateTo });
      return {
        content: [
          {
            type: "text" as const,
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
  );

  server.tool(
    "get_document",
    "Get full details of a document by its ID, including extracted data and AI summary.",
    {
      id: z.string().uuid(),
    },
    async ({ id }) => {
      const document = await getDocument(id);

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
            text: JSON.stringify(document, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "search_documents",
    "Search documents by text query. Searches across description, AI summary, and OCR text.",
    {
      query: z.string().min(1),
      type: z.enum(["invoice", "receipt", "contract", "delivery_note", "bill"]).optional(),
    },
    async ({ query, type }) => {
      const result = await searchDocuments(query, type);
      return {
        content: [
          {
            type: "text" as const,
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
  );

  server.tool(
    "approve_document",
    "Approve a document, changing its status to approved.",
    {
      id: z.string().uuid(),
    },
    async ({ id }) => {
      const document = await approveDocument(id);

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
            text: `Document ${id} approved. Type: ${document.type}, Description: ${document.description}`,
          },
        ],
      };
    },
  );

  server.tool(
    "delete_document",
    "Soft-delete a document by moving it to trash.",
    {
      id: z.string().uuid(),
    },
    async ({ id }) => {
      const document = await deleteDocument(id);

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
            text: `Document ${id} moved to trash.`,
          },
        ],
      };
    },
  );

  server.tool(
    "request_signature",
    "Send a document for signature to one or more people via email. Each signer receives a secure link to review and sign the document.",
    {
      documentId: z.string().uuid(),
      signerEmails: z.array(z.string().email()).min(1),
      message: z.string().optional(),
    },
    async ({ documentId, signerEmails, message }) => {
      const result = await createSignatureRequest({
        documentId,
        signerEmails,
        message,
        requestedBy: "mcp-user",
        requestedByEmail: "mcp@cometa.co",
      });

      if (!result) {
        return {
          content: [{ type: "text" as const, text: "Document not found." }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Signature request created for "${result.document.originalName}". Sent to: ${signerEmails.join(", ")}. ${result.signers.length} signer(s) will receive an email with a secure signing link.`,
          },
        ],
      };
    },
  );

  server.tool(
    "get_signature_status",
    "Check the signature status of a document — who has signed and who hasn't.",
    {
      documentId: z.string().uuid(),
    },
    async ({ documentId }) => {
      const result = await getSignatureRequestByDocument(documentId);

      if (!result) {
        return {
          content: [{ type: "text" as const, text: "No signature request found for this document." }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                status: result.request.status,
                createdAt: result.request.createdAt,
                expiresAt: result.request.expiresAt,
                signers: result.signers.map((s) => ({
                  email: s.email,
                  name: s.name,
                  status: s.status,
                  signedAt: s.signedAt,
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
}
