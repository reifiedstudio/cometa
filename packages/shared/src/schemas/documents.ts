import { z } from "zod";

export const documentTypeSchema = z.enum([
  "invoice",
  "receipt",
  "contract",
  "delivery_note",
  "bill",
]);
export type DocumentType = z.infer<typeof documentTypeSchema>;

export const documentStatusSchema = z.enum([
  "processing",
  "pending",
  "reviewed",
  "approved",
  "rejected",
  "overdue",
  "awaiting_signature",
]);
export type DocumentStatus = z.infer<typeof documentStatusSchema>;

export const documentSourceSchema = z.enum(["upload", "email"]);
export type DocumentSource = z.infer<typeof documentSourceSchema>;

export const documentSchema = z.object({
  id: z.string().uuid(),
  originalName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number(),
  fileHash: z.string(),
  s3Url: z.string(),
  thumbnailUrl: z.string().nullable(),
  type: documentTypeSchema.nullable(),
  status: documentStatusSchema,
  source: documentSourceSchema,
  description: z.string().nullable(),
  aiSummary: z.string().nullable(),
  extractedData: z.record(z.string(), z.unknown()).nullable(),
  isDuplicate: z.boolean(),
  isVerified: z.boolean(),
  flags: z.array(
    z.object({
      type: z.enum(["warning", "success"]),
      message: z.string(),
    }),
  ),
  senderEmail: z.string().email().nullable(),
  receivedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Document = z.infer<typeof documentSchema>;

export const documentListResponseSchema = z.object({
  documents: z.array(documentSchema),
  total: z.number(),
  counts: z.object({
    all: z.number(),
    invoice: z.number(),
    receipt: z.number(),
    contract: z.number(),
    delivery_note: z.number(),
    bill: z.number(),
  }),
});

export type DocumentListResponse = z.infer<typeof documentListResponseSchema>;

export const uploadResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.literal("processing"),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
