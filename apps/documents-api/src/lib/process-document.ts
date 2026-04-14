import { db, schema } from "@cometa/db";
import type { ProcessingMessage } from "@cometa/shared";
import { eq } from "drizzle-orm";
import { classifyAndExtract } from "./openai.js";
import { getFileBuffer, uploadFile } from "./s3.js";
import { extractText } from "./textract.js";
import { generateThumbnail } from "./thumbnail.js";

async function detectTypeFromHint(hint?: string): Promise<string | null> {
  if (!hint) return null;
  const lower = hint.toLowerCase().trim();

  const dbTypes = await db
    .select({ slug: schema.documentTypes.slug, name: schema.documentTypes.name })
    .from(schema.documentTypes)
    .where(eq(schema.documentTypes.isActive, true));

  if (!dbTypes.length) return null;

  for (const t of dbTypes) {
    const slugWords = t.slug.replace(/_/g, "[\\s_-]?");
    const pattern = new RegExp(`\\b${slugWords}\\b`, "i");
    if (pattern.test(lower)) return t.slug;
    if (t.name && lower.includes(t.name.toLowerCase())) return t.slug;
  }

  return null;
}

export async function processDocument(payload: ProcessingMessage) {
  const { documentId, s3Key, mimeType, hint } = payload;
  const hintType = await detectTypeFromHint(hint);

  if (hintType) {
    console.log(`[process] Subject/hint matched type "${hintType}" for ${documentId}`);
  }

  try {
    // Generate thumbnail if missing
    const [doc] = await db
      .select({ thumbnailKey: schema.documents.thumbnailKey })
      .from(schema.documents)
      .where(eq(schema.documents.id, documentId))
      .limit(1);

    if (!doc?.thumbnailKey) {
      const file = await getFileBuffer(s3Key);
      if (file) {
        const thumb = await generateThumbnail(file.buffer, mimeType);
        if (thumb) {
          const thumbnailKey = `thumbnails/${s3Key.split("/").pop()}.jpg`;
          await uploadFile(thumbnailKey, thumb, "image/jpeg");
          await db
            .update(schema.documents)
            .set({ thumbnailUrl: `/api/files/${thumbnailKey}`, thumbnailKey })
            .where(eq(schema.documents.id, documentId));
        }
      }
    }

    // OCR
    const bucket = process.env.S3_BUCKET ?? "";
    const ocrText = await extractText(bucket, s3Key);

    // Classify + extract
    const classification = await classifyAndExtract(ocrText, hint, hintType);

    // Type version
    let typeVersion: number | null = null;
    if (classification.type) {
      const [docType] = await db
        .select({ version: schema.documentTypes.version })
        .from(schema.documentTypes)
        .where(eq(schema.documentTypes.slug, classification.type))
        .limit(1);
      typeVersion = docType?.version ?? null;
    }

    // Update document
    await db
      .update(schema.documents)
      .set({
        ocrText,
        type: classification.type,
        description: classification.description,
        aiSummary: classification.aiSummary,
        extractedData: classification.extractedData,
        flags: classification.flags,
        typeVersion,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId));

    console.log(`[process] Document ${documentId} processed successfully`);
  } catch (err) {
    console.error(`[process] Failed to process ${documentId}:`, err);

    await db
      .update(schema.documents)
      .set({
        status: "pending",
        flags: [
          { type: "warning" as const, message: "AI processing failed — manual review required" },
        ],
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId));

    throw err;
  }
}
