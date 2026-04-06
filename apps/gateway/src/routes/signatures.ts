import { Hono } from "hono";
import type { GatewayEnv } from "../lib/types.js";
import {
  createSignatureRequest,
  getSignerByToken,
  sendSignerOtp,
  verifySignerOtp,
  completeSigning,
  getSignatureRequestByDocument,
} from "../lib/signatures.js";

// ── Authenticated routes (internal users) ──

export const signatureRoutes = new Hono<GatewayEnv>();

// Create a signature request for a document
signatureRoutes.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();

  const { documentId, signerEmails, message, expiresInDays } = body;

  if (!documentId || !signerEmails?.length) {
    return c.json({ error: "documentId and signerEmails are required" }, 400);
  }

  const result = await createSignatureRequest({
    documentId,
    signerEmails,
    message,
    requestedBy: user.id,
    requestedByEmail: user.email,
    expiresInDays,
  });

  if (!result) {
    return c.json({ error: "Document not found" }, 404);
  }

  // Send emails to signers
  const baseUrl = new URL(c.req.url);
  const appUrl = process.env.CORS_ORIGIN || `${baseUrl.protocol}//${baseUrl.host}`;

  for (const signer of result.signers) {
    const signUrl = `${appUrl}/sign/${signer.token}`;

    try {
      const { sendEmail } = await import("@cometa/email");
      const { SignatureRequestEmail } = await import("@cometa/email");
      await sendEmail({
        to: signer.email,
        subject: `${user.email} sent you a document to sign`,
        react: SignatureRequestEmail({
          documentName: result.document.originalName,
          documentType: result.document.type ?? "document",
          senderEmail: user.email,
          message: message ?? undefined,
          signUrl,
        }),
      });
    } catch (err) {
      console.error(`Failed to send signature email to ${signer.email}:`, err);
    }
  }

  return c.json({
    id: result.request.id,
    status: result.request.status,
    signers: result.signers.map((s) => ({
      id: s.id,
      email: s.email,
      status: s.status,
    })),
  }, 201);
});

// Get signature status for a document
signatureRoutes.get("/document/:documentId", async (c) => {
  const documentId = c.req.param("documentId");
  const result = await getSignatureRequestByDocument(documentId);

  if (!result) {
    return c.json({ error: "No signature request found" }, 404);
  }

  return c.json(result);
});

// ── Public routes (external signers, no auth) ──

export const publicSignatureRoutes = new Hono<GatewayEnv>();

// Get signing page data
publicSignatureRoutes.get("/:token", async (c) => {
  const token = c.req.param("token");
  const result = await getSignerByToken(token);

  if (!result) {
    return c.json({ error: "Invalid or expired signing link" }, 404);
  }

  return c.json({
    document: {
      id: result.document?.id,
      name: result.document?.originalName,
      type: result.document?.type,
      description: result.document?.description,
      thumbnailUrl: result.document?.thumbnailUrl,
    },
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
});

// Send OTP
publicSignatureRoutes.post("/:token/otp", async (c) => {
  const token = c.req.param("token");
  const result = await sendSignerOtp(token);

  if (!result) {
    return c.json({ error: "Invalid signing link" }, 404);
  }

  // Send OTP email
  try {
    const { sendEmail } = await import("@cometa/email");
    const { OtpEmail } = await import("@cometa/email");
    await sendEmail({
      to: result.email,
      subject: "Your verification code",
      react: OtpEmail({ otp: result.otp }),
    });
  } catch (err) {
    console.error(`Failed to send OTP to ${result.email}:`, err);
  }

  return c.json({ sent: true, email: result.email });
});

// Verify OTP
publicSignatureRoutes.post("/:token/verify", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json();

  if (!body.otp) {
    return c.json({ error: "OTP is required" }, 400);
  }

  const result = await verifySignerOtp(token, body.otp);

  if (!result.valid) {
    return c.json({ error: result.error }, 400);
  }

  return c.json({ verified: true });
});

// Complete signing
publicSignatureRoutes.post("/:token/sign", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json();

  if (!body.name) {
    return c.json({ error: "Name is required" }, 400);
  }

  const ipAddress =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";
  const userAgent = c.req.header("user-agent") || "unknown";

  const result = await completeSigning({
    token,
    name: body.name,
    ipAddress,
    userAgent,
  });

  if (!result) {
    return c.json({ error: "Invalid signing link or already signed" }, 400);
  }

  // Send notification to requester if all signed
  if (result.allSigned) {
    try {
      const { sendEmail } = await import("@cometa/email");
      const { AllSignedEmail } = await import("@cometa/email");
      const [request] = await (async () => {
        const { db, schema } = await import("@cometa/db");
        const { eq } = await import("drizzle-orm");
        const [doc] = await db
          .select()
          .from(schema.documents)
          .where(eq(schema.documents.id, result.request.documentId))
          .limit(1);
        return [doc];
      })();

      await sendEmail({
        to: result.request.requestedByEmail,
        subject: "All signatures collected",
        react: AllSignedEmail({
          documentName: request?.originalName ?? "Document",
          signers: result.allSigners.map((s) => ({
            name: s.name ?? s.email,
            email: s.email,
            signedAt: s.signedAt?.toISOString() ?? "",
          })),
        }),
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
});
