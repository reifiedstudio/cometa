import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const documentTypeEnum = pgEnum("document_type", [
  "invoice", "receipt", "contract", "delivery_note", "bill"
]);

export const documentStatusEnum = pgEnum("document_status", [
  "processing", "pending", "reviewed", "approved", "rejected", "overdue", "awaiting_signature"
]);

export const documentSourceEnum = pgEnum("document_source", [
  "upload", "email"
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
