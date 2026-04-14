import { db, schema } from "@cometa/db";
import { and, desc, eq, ne } from "drizzle-orm";

function generateToken(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateOtp(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  const num = (bytes[0] * 65536 + bytes[1] * 256 + bytes[2]) % 1000000;
  return num.toString().padStart(6, "0");
}

export async function createSignatureRequest(params: {
  sourceRef?: string;
  signerEmails: string[];
  message?: string;
  requestedBy: string;
  requestedByEmail: string;
  expiresInDays?: number;
  fileHash: string;
  fileKey?: string;
  fileBucket?: string;
  fileName?: string;
  fileMimeType?: string;
  fileSizeBytes?: number;
}) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays ?? 7));

  const [request] = await db
    .insert(schema.signatureRequests)
    .values({
      sourceRef: params.sourceRef,
      message: params.message,
      requestedBy: params.requestedBy,
      requestedByEmail: params.requestedByEmail,
      documentHash: params.fileHash,
      expiresAt,
    })
    .returning();

  // Store file reference if provided
  if (params.fileKey && params.fileBucket) {
    await db.insert(schema.signatureFiles).values({
      requestId: request.id,
      s3Key: params.fileKey,
      s3Bucket: params.fileBucket,
      originalName: params.fileName ?? "document",
      mimeType: params.fileMimeType ?? "application/octet-stream",
      sizeBytes: params.fileSizeBytes ?? 0,
    });
  }

  // Create signers
  const signerValues = params.signerEmails.map((email, i) => ({
    requestId: request.id,
    email: email.toLowerCase().trim(),
    token: generateToken(),
    order: i,
  }));

  const signers = await db.insert(schema.signers).values(signerValues).returning();

  return { request, signers };
}

export async function getSignatureRequest(id: string) {
  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.id, id))
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

  const files = await db
    .select()
    .from(schema.signatureFiles)
    .where(eq(schema.signatureFiles.requestId, request.id));

  return { request, signers, files };
}

export async function listSignatureRequests(params?: {
  status?: string;
  requestedBy?: string;
  limit?: number;
}) {
  const conditions = [];
  if (params?.status) {
    conditions.push(eq(schema.signatureRequests.status, params.status as any));
  }
  if (params?.requestedBy) {
    conditions.push(eq(schema.signatureRequests.requestedBy, params.requestedBy));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const requests = await db
    .select()
    .from(schema.signatureRequests)
    .where(where)
    .orderBy(desc(schema.signatureRequests.createdAt))
    .limit(params?.limit ?? 50);

  return requests;
}

export async function getSignerByToken(token: string) {
  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return null;

  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.id, signer.requestId))
    .limit(1);

  if (!request) return null;
  if (new Date() > request.expiresAt) return null;

  const files = await db
    .select()
    .from(schema.signatureFiles)
    .where(eq(schema.signatureFiles.requestId, request.id));

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

  return { signer, request, files, allSigners };
}

export async function sendSignerOtp(token: string) {
  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return null;

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db
    .update(schema.signers)
    .set({ otpCode: otp, otpExpiresAt, updatedAt: new Date() })
    .where(eq(schema.signers.id, signer.id));

  return { email: signer.email, otp };
}

export async function verifySignerOtp(token: string, otp: string) {
  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, token))
    .limit(1);

  if (!signer) return { valid: false as const, error: "Signer not found" };
  if (!signer.otpCode || !signer.otpExpiresAt)
    return { valid: false as const, error: "No OTP sent" };
  if (new Date() > signer.otpExpiresAt) return { valid: false as const, error: "OTP expired" };
  if (signer.otpCode !== otp) return { valid: false as const, error: "Invalid OTP" };

  if (signer.status === "pending") {
    await db
      .update(schema.signers)
      .set({ status: "viewed" as const, updatedAt: new Date() })
      .where(eq(schema.signers.id, signer.id));
  }

  return { valid: true as const };
}

export async function completeSigning(params: {
  token: string;
  name: string;
  ipAddress: string;
  userAgent: string;
}) {
  const [signer] = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.token, params.token))
    .limit(1);

  if (!signer) return null;
  if (signer.status === "signed") return null;
  if (signer.status === "pending") return null;

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

  const allSigners = await db
    .select()
    .from(schema.signers)
    .where(eq(schema.signers.requestId, signer.requestId));

  const allSigned = allSigners.every((s) => s.status === "signed");

  const [request] = await db
    .update(schema.signatureRequests)
    .set({
      status: allSigned ? ("completed" as const) : ("partially_signed" as const),
      updatedAt: new Date(),
    })
    .where(eq(schema.signatureRequests.id, signer.requestId))
    .returning();

  return { signer: updated, request, allSigned, allSigners };
}

export async function getSignatureRequestBySourceRef(sourceRef: string) {
  const [request] = await db
    .select()
    .from(schema.signatureRequests)
    .where(eq(schema.signatureRequests.sourceRef, sourceRef))
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
