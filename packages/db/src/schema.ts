import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const documentTypeEnum = pgEnum("document_type", [
  "invoice",
  "receipt",
  "contract",
  "delivery_note",
  "bill",
]);

// ── Document Types (user-defined) ──

export const documentTypes = pgTable("document_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  pluralName: varchar("plural_name", { length: 128 }).notNull(),
  badgeColor: varchar("badge_color", { length: 64 }).notNull().default("bg-gray-100 text-gray-700"),
  description: text("description"),
  fields: jsonb("fields").notNull().default([]),
  version: integer("version").default(1).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentStatusEnum = pgEnum("document_status", [
  "processing",
  "pending",
  "reviewed",
  "approved",
  "rejected",
  "overdue",
  "awaiting_signature",
]);

export const documentSourceEnum = pgEnum("document_source", ["upload", "email"]);

export const signatureRequestStatusEnum = pgEnum("signature_request_status", [
  "pending",
  "partially_signed",
  "completed",
  "expired",
  "cancelled",
]);

export const signerStatusEnum = pgEnum("signer_status", [
  "pending",
  "viewed",
  "signed",
  "declined",
  "expired",
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

  // Classification (text to support user-defined types)
  type: text("type"),
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
  isFlagged: boolean("is_flagged").default(false).notNull(),
  flags: jsonb("flags").default([]),

  // Type versioning
  typeVersion: integer("type_version"),

  // Rejection
  rejectionReason: text("rejection_reason"),

  // Source metadata
  senderEmail: text("sender_email"),

  // Link to signature request (informational, not a FK — lives in signatures schema)
  signatureRequestId: text("signature_request_id"),

  // Timestamps
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Audit Log ──

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  action: varchar("action", { length: 64 }).notNull(),
  detail: text("detail"),
  previousValue: text("previous_value"),
  newValue: text("new_value"),
  userId: text("user_id"),
  userEmail: text("user_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Signatures Schema (separate schema for the signatures service) ──

export const signaturesSchema = pgSchema("signatures");

export const signatureRequests = signaturesSchema.table("signature_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceRef: text("source_ref"), // informational reference (e.g. document ID), not a FK
  status: signatureRequestStatusEnum("status").default("pending").notNull(),
  message: text("message"),
  requestedBy: text("requested_by").notNull(),
  requestedByEmail: text("requested_by_email").notNull(),
  documentHash: text("document_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const signers = signaturesSchema.table("signers", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id")
    .notNull()
    .references(() => signatureRequests.id),
  email: text("email").notNull(),
  name: text("name"),
  token: varchar("token", { length: 64 }).notNull().unique(),
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at"),
  status: signerStatusEnum("status").default("pending").notNull(),
  order: integer("order").default(0).notNull(),

  // Audit trail (filled on sign)
  signedAt: timestamp("signed_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const signatureFiles = signaturesSchema.table("signature_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id")
    .notNull()
    .references(() => signatureRequests.id),
  s3Key: text("s3_key").notNull(),
  s3Bucket: text("s3_bucket").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
