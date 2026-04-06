import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const documentTypeEnum = pgEnum("document_type", [
  "invoice", "receipt", "contract", "delivery_note", "bill"
]);

export const documentStatusEnum = pgEnum("document_status", [
  "processing", "pending", "reviewed", "approved", "rejected", "overdue", "awaiting_signature"
]);

export const documentSourceEnum = pgEnum("document_source", [
  "upload", "email"
]);

export const signatureRequestStatusEnum = pgEnum("signature_request_status", [
  "pending", "partially_signed", "completed", "expired", "cancelled"
]);

export const signerStatusEnum = pgEnum("signer_status", [
  "pending", "viewed", "signed", "declined", "expired"
]);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),

  // File info
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  fileHash: text("file_hash").notNull(),

  // Storage
  s3Url: text("s3_url").notNull(),
  s3Key: text("s3_key").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),

  // Classification
  type: documentTypeEnum("type"),
  status: documentStatusEnum("status").default("processing").notNull(),
  source: documentSourceEnum("source").default("upload").notNull(),

  // Extracted data
  description: text("description"),
  aiSummary: text("ai_summary"),
  extractedData: jsonb("extracted_data"),
  ocrText: text("ocr_text"),
  textractResponse: jsonb("textract_response"),

  // Flags
  isDuplicate: boolean("is_duplicate").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  flags: jsonb("flags").default([]),

  // Source metadata
  senderEmail: text("sender_email"),

  // Timestamps
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Signature Requests ──

export const signatureRequests = pgTable("signature_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id),
  status: signatureRequestStatusEnum("status").default("pending").notNull(),
  message: text("message"), // optional message to signers
  requestedBy: text("requested_by").notNull(), // Clerk user ID
  requestedByEmail: text("requested_by_email").notNull(),
  documentHash: text("document_hash").notNull(), // SHA-256 of doc at time of request
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Signers (one per email per request) ──

export const signers = pgTable("signers", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull().references(() => signatureRequests.id),
  email: text("email").notNull(),
  name: text("name"), // filled in when they sign
  token: varchar("token", { length: 64 }).notNull().unique(), // magic link token
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),
  status: signerStatusEnum("status").default("pending").notNull(),
  order: integer("order").default(0).notNull(), // signing order (0 = any order)

  // Audit trail (filled on sign)
  signedAt: timestamp("signed_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
