import { Hono } from "hono";
import type { AppEnv } from "../app";
import {
  createSignatureRequest,
  getSignerByToken,
  sendSignerOtp,
  verifySignerOtp,
  completeSigning,
  getSignatureRequestByDocument,
} from "../lib/signatures";

// ── Authenticated routes (internal users) ──

export const signatureRoutes = new Hono<AppEnv>();

signatureRoutes.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { documentId, signerEmails, message, expiresInDays } = body;

  if (!documentId || !signerEmails?.length) {
    return c.json({ error: "documentId and signerEmails are required" }, 400);
  }

  let result;
  try {
    result = await createSignatureRequest({
      documentId,
      signerEmails,
      message,
      requestedBy: user.id,
      requestedByEmail: user.email,
      expiresInDays,
    });
  } catch (err) {
    console.error("Failed to create signature request:", err);
    return c.json({ error: "Failed to create signature request" }, 500);
  }

  if (!result) return c.json({ error: "Document not found" }, 404);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

signatureRoutes.get("/document/:documentId", async (c) => {
  const documentId = c.req.param("documentId");
  const result = await getSignatureRequestByDocument(documentId);
  if (!result) return c.json({ error: "No signature request found" }, 404);
  return c.json(result);
});

// ── Public routes (external signers, no auth) ──

export const publicSignatureRoutes = new Hono<AppEnv>();

publicSignatureRoutes.get("/:token", async (c) => {
  const token = c.req.param("token");
  const result = await getSignerByToken(token);
  if (!result) return c.json({ error: "Invalid or expired signing link" }, 404);

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

publicSignatureRoutes.post("/:token/otp", async (c) => {
  const token = c.req.param("token");
  const result = await sendSignerOtp(token);
  if (!result) return c.json({ error: "Invalid signing link" }, 404);

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

publicSignatureRoutes.post("/:token/verify", async (c) => {
  const token = c.req.param("token");
  const body = await c.req.json();
  if (!body.otp) return c.json({ error: "OTP is required" }, 400);

  const result = await verifySignerOtp(token, body.otp);
  if (!result.valid) return c.json({ error: result.error }, 400);
  return c.json({ verified: true });
});

publicSignatureRoutes.post("/:token/sign", async (c) => {
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
      const { sendEmail } = await import("@cometa/email");
      const { AllSignedEmail } = await import("@cometa/email");
      const { db, schema } = await import("@cometa/db");
      const { eq } = await import("drizzle-orm");

      // Mark document as reviewed now that all signatures are collected
      await db
        .update(schema.documents)
        .set({ status: "reviewed", updatedAt: new Date() })
        .where(eq(schema.documents.id, result.request.documentId));

      const [doc] = await db
        .select().from(schema.documents)
        .where(eq(schema.documents.id, result.request.documentId)).limit(1);

      await sendEmail({
        to: result.request.requestedByEmail,
        subject: "All signatures collected",
        react: AllSignedEmail({
          documentName: doc?.originalName ?? "Document",
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
    signer: { name: result.signer.name, email: result.signer.email, signedAt: result.signer.signedAt },
  });
});
