import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendSigningInvite } from "../lib/email.js";
import {
  getSignatureRequest,
  getSignatureRequestBySourceRef,
  listSignatureRequests,
} from "../lib/signatures.js";

export function registerSignatureTools(server: McpServer): void {
  server.tool(
    "get_signature_status",
    "Check status of a signature request — who signed, who hasn't.",
    {
      requestId: z.string().optional().describe("Signature request ID"),
      sourceRef: z.string().optional().describe("Source reference (e.g. document ID)"),
    },
    async ({ requestId, sourceRef }) => {
      let result;
      if (requestId) {
        result = await getSignatureRequest(requestId);
      } else if (sourceRef) {
        result = await getSignatureRequestBySourceRef(sourceRef);
      } else {
        return {
          content: [{ type: "text" as const, text: "Provide either requestId or sourceRef." }],
          isError: true,
        };
      }

      if (!result) {
        return {
          content: [{ type: "text" as const, text: "No signature request found." }],
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

  server.tool(
    "list_signature_requests",
    "List signature requests with optional filters (status, requester, overdue).",
    {
      status: z
        .enum(["pending", "partially_signed", "completed", "expired", "cancelled"])
        .optional(),
      requestedBy: z.string().optional(),
      limit: z.number().optional(),
    },
    async ({ status, requestedBy, limit }) => {
      const requests = await listSignatureRequests({ status, requestedBy, limit });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ total: requests.length, requests }, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "nudge_signer",
    "Resend signing email to a signer.",
    {
      signerId: z.string().describe("Signer ID to nudge"),
    },
    async ({ signerId }) => {
      const { db, schema } = await import("@cometa/db");
      const { eq } = await import("drizzle-orm");

      const [signer] = await db
        .select()
        .from(schema.signers)
        .where(eq(schema.signers.id, signerId))
        .limit(1);

      if (!signer)
        return { content: [{ type: "text" as const, text: "Signer not found." }], isError: true };
      if (signer.status === "signed")
        return { content: [{ type: "text" as const, text: "Already signed." }], isError: true };

      const [request] = await db
        .select()
        .from(schema.signatureRequests)
        .where(eq(schema.signatureRequests.id, signer.requestId))
        .limit(1);

      const files = await db
        .select()
        .from(schema.signatureFiles)
        .where(eq(schema.signatureFiles.requestId, signer.requestId))
        .limit(1);

      try {
        await sendSigningInvite({
          signerEmail: signer.email,
          signerToken: signer.token,
          senderEmail: request?.requestedByEmail ?? "cometa@cometa.co",
          fileName: files[0]?.originalName ?? "Document",
          message: request?.message ?? undefined,
        });
      } catch (err) {
        return {
          content: [{ type: "text" as const, text: `Failed to send email: ${err}` }],
          isError: true,
        };
      }

      return { content: [{ type: "text" as const, text: `Reminder sent to ${signer.email}.` }] };
    },
  );

  server.tool(
    "cancel_signature_request",
    "Cancel a pending signature request.",
    {
      requestId: z.string().describe("Signature request ID to cancel"),
    },
    async ({ requestId }) => {
      const { db, schema } = await import("@cometa/db");
      const { eq } = await import("drizzle-orm");

      const [updated] = await db
        .update(schema.signatureRequests)
        .set({ status: "cancelled" as const, updatedAt: new Date() })
        .where(eq(schema.signatureRequests.id, requestId))
        .returning();

      if (!updated)
        return { content: [{ type: "text" as const, text: "Request not found." }], isError: true };
      return {
        content: [{ type: "text" as const, text: `Signature request ${requestId} cancelled.` }],
      };
    },
  );
}
