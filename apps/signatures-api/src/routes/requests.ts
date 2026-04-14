import { db, schema } from "@cometa/db";
import { and, eq, lt, ne } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { sendSigningInvite } from "../lib/email.js";
import { uploadFile } from "../lib/s3.js";
import {
  createSignatureRequest,
  getSignatureRequest,
  getSignatureRequestBySourceRef,
  listSignatureRequests,
} from "../lib/signatures.js";
import type { SignaturesEnv } from "../lib/types.js";

export const requestRoutes = new Hono<SignaturesEnv>();

// POST / — Create signature request with file upload
requestRoutes.post(
  "/",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "Create signature request",
    description: "Create a new signature request with file upload and signer emails.",
    responses: {
      201: {
        description: "Signature request created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { type: "string" },
                signers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      email: { type: "string" },
                      status: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      400: { description: "Missing required fields" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    const body = await c.req.parseBody();

    const file = body.file;
    const signerEmailsRaw = body.signerEmails;
    const message = body.message as string | undefined;
    const sourceRef = body.sourceRef as string | undefined;
    const expiresInDays = body.expiresInDays ? Number(body.expiresInDays) : undefined;

    const signerEmails =
      typeof signerEmailsRaw === "string" ? (JSON.parse(signerEmailsRaw) as string[]) : [];

    if (!signerEmails.length) {
      return c.json({ error: "signerEmails are required" }, 400);
    }

    let fileKey: string | undefined;
    let fileBucket: string | undefined;
    let fileName = "document";
    let fileMimeType = "application/octet-stream";
    let fileSizeBytes = 0;
    let fileHash = "";

    // Handle file upload
    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      fileHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      fileName = file.name;
      fileMimeType = file.type || "application/octet-stream";
      fileSizeBytes = buffer.length;
      fileBucket = process.env.SIGNATURES_S3_BUCKET ?? "";
      fileKey = `signatures/${Date.now()}-${file.name}`;

      await uploadFile(fileKey, buffer, fileMimeType);
    } else if (body.fileHash) {
      // External file reference (e.g. from documents-api)
      fileHash = body.fileHash as string;
      fileName = (body.fileName as string) ?? "document";
    } else {
      return c.json({ error: "file or fileHash is required" }, 400);
    }

    const result = await createSignatureRequest({
      sourceRef,
      signerEmails,
      message,
      requestedBy: user.id,
      requestedByEmail: user.email,
      expiresInDays,
      fileHash,
      fileKey,
      fileBucket,
      fileName,
      fileMimeType,
      fileSizeBytes,
    });

    // Send emails to signers
    for (const signer of result.signers) {
      try {
        await sendSigningInvite({
          signerEmail: signer.email,
          signerToken: signer.token,
          senderEmail: user.email,
          fileName,
          message,
        });
      } catch (err) {
        console.error(`Failed to send signature email to ${signer.email}:`, err);
      }
    }

    return c.json(
      {
        id: result.request.id,
        status: result.request.status,
        signers: result.signers.map((s) => ({
          id: s.id,
          email: s.email,
          status: s.status,
        })),
      },
      201,
    );
  },
);

// GET / — List signature requests
requestRoutes.get(
  "/",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "List signature requests",
    responses: {
      200: {
        description: "List of signature requests",
        content: {
          "application/json": {
            schema: { type: "object", properties: { requests: { type: "array", items: {} } } },
          },
        },
      },
    },
  }),
  async (c) => {
    const status = c.req.query("status");
    const requestedBy = c.req.query("requestedBy");
    const limit = c.req.query("limit") ? Number(c.req.query("limit")) : undefined;

    const requests = await listSignatureRequests({ status, requestedBy, limit });
    return c.json({ requests });
  },
);

// GET /overdue — Fetch overdue pending requests
requestRoutes.get(
  "/overdue",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "List overdue requests",
    responses: {
      200: {
        description: "Overdue signature requests",
        content: {
          "application/json": {
            schema: { type: "object", properties: { requests: { type: "array", items: {} } } },
          },
        },
      },
    },
  }),
  async (c) => {
    const requests = await db
      .select()
      .from(schema.signatureRequests)
      .where(
        and(
          eq(schema.signatureRequests.status, "pending"),
          lt(schema.signatureRequests.expiresAt, new Date()),
        ),
      );
    return c.json({ requests });
  },
);

// GET /source/:sourceRef — Get by source reference (e.g. document ID)
requestRoutes.get(
  "/source/:sourceRef",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "Get request by source reference",
    responses: {
      200: {
        description: "Signature request",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const sourceRef = c.req.param("sourceRef");
    const result = await getSignatureRequestBySourceRef(sourceRef);
    if (!result) return c.json({ error: "No signature request found" }, 404);
    return c.json({
      id: result.request.id,
      status: result.request.status,
      message: result.request.message,
      expiresAt: result.request.expiresAt,
      createdAt: result.request.createdAt,
      signers: result.signers,
    });
  },
);

// GET /:id — Get single request
requestRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "Get signature request by ID",
    responses: {
      200: {
        description: "Signature request details",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const result = await getSignatureRequest(id);
    if (!result) return c.json({ error: "Signature request not found" }, 404);
    return c.json(result);
  },
);

// PATCH /:id — Update request (e.g. due date)
requestRoutes.patch(
  "/:id",
  describeRoute({
    tags: ["Signature Requests"],
    summary: "Update signature request",
    responses: {
      200: {
        description: "Updated request",
        content: {
          "application/json": {
            schema: { type: "object", properties: { id: { type: "string" }, expiresAt: {} } },
          },
        },
      },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.expiresAt !== undefined && body.expiresAt !== null) {
      updates.expiresAt = new Date(body.expiresAt);
    }

    const [updated] = await db
      .update(schema.signatureRequests)
      .set(updates)
      .where(eq(schema.signatureRequests.id, id))
      .returning();

    if (!updated) return c.json({ error: "Request not found" }, 404);
    return c.json({ id: updated.id, expiresAt: updated.expiresAt });
  },
);

// POST /signers — Add signer to existing request
requestRoutes.post(
  "/signers",
  describeRoute({
    tags: ["Signers"],
    summary: "Add signer to request",
    responses: {
      201: {
        description: "Signer added",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                status: { type: "string" },
              },
            },
          },
        },
      },
      400: { description: "Missing fields" },
      404: { description: "Request not found" },
      409: { description: "Signer already exists" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    const { requestId, email } = body;

    if (!requestId || !email) {
      return c.json({ error: "requestId and email are required" }, 400);
    }

    const [request] = await db
      .select()
      .from(schema.signatureRequests)
      .where(eq(schema.signatureRequests.id, requestId))
      .limit(1);

    if (!request) return c.json({ error: "Signature request not found" }, 404);

    const existing = await db
      .select()
      .from(schema.signers)
      .where(
        and(
          eq(schema.signers.requestId, requestId),
          eq(schema.signers.email, email.toLowerCase().trim()),
        ),
      );

    const activeSigner = existing.find((s) => s.status !== "declined");
    if (activeSigner) {
      return c.json({ error: "This email is already a signer on this request" }, 409);
    }

    const { randomBytes } = await import("crypto");
    const token = randomBytes(32).toString("hex");
    const [signer] = await db
      .insert(schema.signers)
      .values({
        requestId,
        email: email.toLowerCase().trim(),
        token,
        status: "pending",
        order: 0,
      })
      .returning();

    // Get file name for email
    const files = await db
      .select()
      .from(schema.signatureFiles)
      .where(eq(schema.signatureFiles.requestId, requestId))
      .limit(1);

    try {
      await sendSigningInvite({
        signerEmail: signer.email,
        signerToken: token,
        senderEmail: user.email,
        fileName: files[0]?.originalName ?? "Document",
        message: request.message ?? undefined,
      });
    } catch (err) {
      console.error(`Failed to send signature email to ${signer.email}:`, err);
    }

    if (request.status === "completed") {
      await db
        .update(schema.signatureRequests)
        .set({ status: "pending", updatedAt: new Date() })
        .where(eq(schema.signatureRequests.id, requestId));
    }

    return c.json({ id: signer.id, email: signer.email, status: signer.status }, 201);
  },
);

// DELETE /signers/:signerId — Remove signer
requestRoutes.delete(
  "/signers/:signerId",
  describeRoute({
    tags: ["Signers"],
    summary: "Remove signer",
    responses: {
      200: {
        description: "Signer removed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Signer not found" },
    },
  }),
  async (c) => {
    const signerId = c.req.param("signerId");

    const [updated] = await db
      .update(schema.signers)
      .set({ status: "declined" as const, updatedAt: new Date() })
      .where(eq(schema.signers.id, signerId))
      .returning();

    if (!updated) return c.json({ error: "Signer not found" }, 404);
    return c.json({ id: updated.id, status: updated.status });
  },
);

// POST /signers/:signerId/resend — Resend signing email
requestRoutes.post(
  "/signers/:signerId/resend",
  describeRoute({
    tags: ["Signers"],
    summary: "Resend signing email",
    responses: {
      200: {
        description: "Email resent",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { resent: { type: "boolean" }, email: { type: "string" } },
            },
          },
        },
      },
      400: { description: "Already signed or declined" },
      404: { description: "Signer not found" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    const signerId = c.req.param("signerId");

    const [signer] = await db
      .select()
      .from(schema.signers)
      .where(eq(schema.signers.id, signerId))
      .limit(1);

    if (!signer) return c.json({ error: "Signer not found" }, 404);
    if (signer.status === "signed") return c.json({ error: "Already signed" }, 400);
    if (signer.status === "declined") return c.json({ error: "Signer has been removed" }, 400);

    const [request] = await db
      .select()
      .from(schema.signatureRequests)
      .where(eq(schema.signatureRequests.id, signer.requestId))
      .limit(1);

    if (!request) return c.json({ error: "Request not found" }, 404);

    const files = await db
      .select()
      .from(schema.signatureFiles)
      .where(eq(schema.signatureFiles.requestId, request.id))
      .limit(1);

    try {
      await sendSigningInvite({
        signerEmail: signer.email,
        signerToken: signer.token,
        senderEmail: user.email,
        fileName: files[0]?.originalName ?? "Document",
        message: request.message ?? undefined,
      });
    } catch (err) {
      console.error(`Failed to resend email to ${signer.email}:`, err);
      return c.json({ error: "Failed to send email" }, 500);
    }

    return c.json({ resent: true, email: signer.email });
  },
);
