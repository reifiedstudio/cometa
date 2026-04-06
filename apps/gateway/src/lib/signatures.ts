/**
 * Signature request operations — create requests, send OTPs, verify, and sign.
 */

function generateToken(length = 48): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateOtp(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  const num = (bytes[0] * 65536 + bytes[1] * 256 + bytes[2]) % 1000000;
  return num.toString().padStart(6, "0");
}

// ── Create a signature request with multiple signers ──

export async function createSignatureRequest(params: {
  documentId: string;
  signerEmails: string[];
  message?: string;
  requestedBy: string;
  requestedByEmail: string;
  expiresInDays?: number;
}) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  // Get document and hash it
  const [doc] = await db
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.id, params.documentId))
    .limit(1);

  if (!doc) return null;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays ?? 7));

  // Create the request
  const [request] = await db
    .insert(schema.signatureRequests)
    .values({
      documentId: params.documentId,
      message: params.message,
      requestedBy: params.requestedBy,
      requestedByEmail: params.requestedByEmail,
      documentHash: doc.fileHash,
      expiresAt,
    })
    .returning();

  // Create signers
  const signerValues = params.signerEmails.map((email, i) => ({
    requestId: request.id,
    email,
    token: generateToken(),
    order: i,
  }));

  const signers = await db
    .insert(schema.signers)
    .values(signerValues)
    .returning();

  // Update document status
  await db
    .update(schema.documents)
    .set({ status: "awaiting_signature" as const, updatedAt: new Date() })
    .where(eq(schema.documents.id, params.documentId));

  return { request, signers, document: doc };
}

// ── Get a signer by token (for the signing page) ──

export async function getSignerByToken(token: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq, and } = await import("drizzle-orm");

  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return null;

  // Get the request
  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.id, signer.requestId))
    .limit(1);

  if (!request) return null;

  // Check expiry
  if (new Date() > request.expiresAt) return null;

  // Get the document
  const [document] = await db
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.id, request.documentId))
    .limit(1);

  // Get all signers for this request (to show who has signed)
  const allSigners = await db
    .select({
      id: schema.signers.id,
      email: schema.signers.email,
      name: schema.signers.name,
      status: schema.signers.status,
      signedAt: schema.signers.signedAt,
      order: schema.signers.order,
    })
    .from(schema.signers)
    .where(eq(schema.signers.requestId, request.id));

  return { signer, request, document, allSigners };
}

// ── Send OTP to signer ──

export async function sendSignerOtp(token: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return null;

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db
    .update(schema.signers)
    .set({ otpCode: otp, otpExpiresAt, updatedAt: new Date() })
    .where(eq(schema.signers.id, signer.id));

  return { email: signer.email, otp };
}

// ── Verify OTP ──

export async function verifySignerOtp(token: string, otp: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return { valid: false, error: "Signer not found" };
  if (!signer.otpCode || !signer.otpExpiresAt) return { valid: false, error: "No OTP sent" };
  if (new Date() > signer.otpExpiresAt) return { valid: false, error: "OTP expired" };
  if (signer.otpCode !== otp) return { valid: false, error: "Invalid OTP" };

  // Mark as viewed
  if (signer.status === "pending") {
    await db
      .update(schema.signers)
      .set({ status: "viewed" as const, updatedAt: new Date() })
      .where(eq(schema.signers.id, signer.id));
  }

  return { valid: true };
}

// ── Complete signing ──

export async function completeSigning(params: {
  token: string;
  name: string;
  ipAddress: string;
  userAgent: string;
}) {
  const { db, schema } = await import("@cometa/db");
  const { eq } = await import("drizzle-orm");

  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, params.token))
    .limit(1);

  if (!signer) return null;
  if (signer.status === "signed") return null;

  // Verify OTP was completed (status should be "viewed")
  if (signer.status === "pending") return null;

  // Sign
  const [updated] = await db
    .update(schema.signers)
    .set({
      status: "signed" as const,
      name: params.name,
      signedAt: new Date(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      updatedAt: new Date(),
    })
    .where(eq(schema.signers.id, signer.id))
    .returning();

  // Check if all signers have signed
  const allSigners = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.requestId, signer.requestId));

  const allSigned = allSigners.every((s) => s.status === "signed");
  const someSigned = allSigners.some((s) => s.status === "signed");

  // Update request status
  const [request] = await db
    .update(schema.signatureRequests)
    .set({
      status: allSigned ? ("completed" as const) : ("partially_signed" as const),
      updatedAt: new Date(),
    })
    .where(eq(schema.signatureRequests.id, signer.requestId))
    .returning();

  // If all signed, update document status to approved
  if (allSigned) {
    await db
      .update(schema.documents)
      .set({ status: "approved" as const, updatedAt: new Date() })
      .where(eq(schema.documents.id, request.documentId));
  }

  return { signer: updated, request, allSigned, allSigners };
}

// ── Get signature request by document ID ──

export async function getSignatureRequestByDocument(documentId: string) {
  const { db, schema } = await import("@cometa/db");
  const { eq, desc } = await import("drizzle-orm");

  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.documentId, documentId))
    .orderBy(desc(schema.signatureRequests.createdAt))
    .limit(1);

  if (!request) return null;

  const signers = await db
    .select({
      id: schema.signers.id,
      email: schema.signers.email,
      name: schema.signers.name,
      status: schema.signers.status,
      signedAt: schema.signers.signedAt,
      order: schema.signers.order,
    })
    .from(schema.signers)
    .where(eq(schema.signers.requestId, request.id));

  return { request, signers };
}
