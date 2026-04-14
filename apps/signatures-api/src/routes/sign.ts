import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { sendAllSignedEmail, sendOtpEmail } from "../lib/email.js";
import { getPresignedUrl } from "../lib/s3.js";
import {
  completeSigning,
  getSignerByToken,
  sendSignerOtp,
  verifySignerOtp,
} from "../lib/signatures.js";

export const signRoutes = new Hono();

signRoutes.get(
  "/:token",
  describeRoute({
    tags: ["Signing"],
    summary: "Get signing info",
    description: "Get document and signer info for a signing token.",
    responses: {
      200: {
        description: "Signing details",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Invalid or expired signing link" },
    },
  }),
  async (c) => {
    const token = c.req.param("token");
    const result = await getSignerByToken(token);
    if (!result) return c.json({ error: "Invalid or expired signing link" }, 404);

    const file = result.files[0];

    return c.json({
      document: file
        ? {
            name: file.originalName,
            type: file.mimeType,
          }
        : null,
      signer: {
        email: result.signer.email,
        status: result.signer.status,
      },
      request: {
        message: result.request.message,
        requestedByEmail: result.request.requestedByEmail,
        expiresAt: result.request.expiresAt,
      },
      signatures: result.allSigners.map((s) => ({
        email: s.email,
        name: s.name,
        status: s.status,
        signedAt: s.signedAt,
      })),
    });
  },
);

signRoutes.get(
  "/:token/document",
  describeRoute({
    tags: ["Signing"],
    summary: "Get document for signing",
    description: "Get a presigned URL to view the document being signed.",
    responses: {
      200: {
        description: "Presigned document URL",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { url: { type: "string" }, mimeType: { type: "string" } },
            },
          },
        },
      },
      403: { description: "Identity not verified" },
      404: { description: "Invalid token or document not available" },
    },
  }),
  async (c) => {
    const token = c.req.param("token");
    const result = await getSignerByToken(token);
    if (!result) return c.json({ error: "Invalid or expired signing link" }, 404);

    if (result.signer.status === "pending") {
      return c.json({ error: "Please verify your identity first" }, 403);
    }

    const file = result.files[0];
    if (!file) return c.json({ error: "Document not available" }, 404);

    const url = await getPresignedUrl(file.s3Key, 300);
    if (!url) return c.json({ error: "Unable to generate document link" }, 500);

    return c.json({ url, mimeType: file.mimeType });
  },
);

signRoutes.post(
  "/:token/otp",
  describeRoute({
    tags: ["Signing"],
    summary: "Send OTP to signer",
    responses: {
      200: {
        description: "OTP sent",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { sent: { type: "boolean" }, email: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Invalid signing link" },
    },
  }),
  async (c) => {
    const token = c.req.param("token");
    const result = await sendSignerOtp(token);
    if (!result) return c.json({ error: "Invalid signing link" }, 404);

    try {
      await sendOtpEmail(result.email, result.otp);
    } catch (err) {
      console.error(`Failed to send OTP to ${result.email}:`, err);
    }

    return c.json({ sent: true, email: result.email });
  },
);

signRoutes.post(
  "/:token/verify",
  describeRoute({
    tags: ["Signing"],
    summary: "Verify OTP",
    responses: {
      200: {
        description: "OTP verified",
        content: {
          "application/json": {
            schema: { type: "object", properties: { verified: { type: "boolean" } } },
          },
        },
      },
      400: { description: "Invalid OTP" },
    },
  }),
  async (c) => {
    const token = c.req.param("token");
    const body = await c.req.json();
    if (!body.otp) return c.json({ error: "OTP is required" }, 400);

    const result = await verifySignerOtp(token, body.otp);
    if (!result.valid) return c.json({ error: result.error }, 400);
    return c.json({ verified: true });
  },
);

signRoutes.post(
  "/:token/sign",
  describeRoute({
    tags: ["Signing"],
    summary: "Complete signing",
    description: "Submit signature with name. Records IP address and user agent for audit.",
    responses: {
      200: {
        description: "Signature recorded",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                signed: { type: "boolean" },
                allSigned: { type: "boolean" },
                signer: { type: "object" },
              },
            },
          },
        },
      },
      400: { description: "Invalid or already signed" },
    },
  }),
  async (c) => {
    const token = c.req.param("token");
    const body = await c.req.json();
    if (!body.name) return c.json({ error: "Name is required" }, 400);

    const ipAddress =
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      c.req.header("x-real-ip") ||
      "unknown";
    const userAgent = c.req.header("user-agent") || "unknown";

    const result = await completeSigning({ token, name: body.name, ipAddress, userAgent });
    if (!result) return c.json({ error: "Invalid signing link or already signed" }, 400);

    if (result.allSigned) {
      try {
        const { db, schema } = await import("@cometa/db");
        const { eq } = await import("drizzle-orm");

        const files = await db
          .select()
          .from(schema.signatureFiles)
          .where(eq(schema.signatureFiles.requestId, result.request.id))
          .limit(1);

        await sendAllSignedEmail({
          to: result.request.requestedByEmail,
          fileName: files[0]?.originalName ?? "Document",
          signers: result.allSigners.map((s) => ({
            name: s.name ?? s.email,
            email: s.email,
            signedAt: s.signedAt?.toISOString() ?? "",
          })),
        });
      } catch (err) {
        console.error("Failed to send all-signed notification:", err);
      }
    }

    return c.json({
      signed: true,
      allSigned: result.allSigned,
      signer: {
        name: result.signer.name,
        email: result.signer.email,
        signedAt: result.signer.signedAt,
      },
    });
  },
);
