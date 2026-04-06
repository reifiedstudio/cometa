import { Hono } from "hono";
import { db, schema } from "@cometa/db";
import { eq } from "drizzle-orm";
import { hashFile } from "../lib/hash";
import { uploadFile, getS3BucketAndKey } from "../lib/s3";
import { extractText } from "../lib/textract";
import { classifyDocument } from "../lib/openai";
import { generateThumbnail } from "../lib/thumbnail";
import sharp from "sharp";

export const uploadRoutes = new Hono();

async function compressImage(buffer: Buffer, mimeType: string): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!mimeType.startsWith("image/")) {
    return { buffer, mimeType };
  }

  const compressed = await sharp(buffer)
    .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  console.log(`[upload] Compressed image: ${(buffer.length / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB`);
  return { buffer: compressed, mimeType: "image/jpeg" };
}

uploadRoutes.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;

  if (!file || !(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  const arrayBuffer = await file.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);

  // Generate hash from original file
  const fileHash = await hashFile(arrayBuffer);

  // Compress images before storing
  const { buffer, mimeType } = await compressImage(rawBuffer, file.type);

  // Upload to S3 (or local)
  const timestamp = Date.now();
  const fileName = mimeType === "image/jpeg" && !file.name.endsWith(".jpg")
    ? `${file.name}.jpg`
    : file.name;
  const s3Key = `documents/${timestamp}-${fileName}`;
  const s3Url = await uploadFile(s3Key, buffer, mimeType);

  // Generate and upload thumbnail
  let thumbnailUrl: string | null = null;
  let thumbnailKey: string | null = null;
  const thumb = await generateThumbnail(buffer, file.type);
  if (thumb) {
    thumbnailKey = `thumbnails/${timestamp}-${file.name}.jpg`;
    await uploadFile(thumbnailKey, thumb, "image/jpeg");
    thumbnailUrl = `/api/files/${thumbnailKey}`;
  }

  // Create document record
  const [document] = await db
    .insert(schema.documents)
    .values({
      originalName: file.name,
      mimeType,
      sizeBytes: buffer.length,
      fileHash,
      s3Url,
      s3Key,
      thumbnailUrl,
      thumbnailKey,
      status: "processing",
      source: "upload",
    })
    .returning();

  // Fire-and-forget async processing
  processDocument(document.id, s3Url, s3Key).catch((err) => {
    console.error(`[upload] Background processing failed for ${document.id}:`, err);
  });

  return c.json({ id: document.id, status: "processing" as const }, 201);
});

async function processDocument(documentId: string, s3Url: string, s3Key: string) {
  try {
    // Extract text via Textract
    const s3Info = getS3BucketAndKey(s3Url);
    const ocrText = await extractText(
      s3Info?.bucket ?? "",
      s3Info?.key ?? s3Key,
    );

    // Classify via OpenAI
    const classification = await classifyDocument(ocrText);

    // Update document with results
    await db
      .update(schema.documents)
      .set({
        ocrText,
        type: classification.type,
        description: classification.description,
        aiSummary: classification.aiSummary,
        extractedData: classification.extractedData,
        flags: classification.flags,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId));

    console.log(`[upload] Document ${documentId} processed successfully`);
  } catch (err) {
    console.error(`[upload] Failed to process document ${documentId}:`, err);

    // Mark as pending even on failure so it's not stuck in processing
    await db
      .update(schema.documents)
      .set({
        status: "pending",
        flags: [{ type: "warning" as const, message: "AI processing failed — manual review required" }],
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, documentId));
  }
}
