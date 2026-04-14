import { db, schema } from "@cometa/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import sharp from "sharp";
import { hashFile } from "../lib/hash.js";
import { processDocument } from "../lib/process-document.js";
import { pushToProcessingQueue } from "../lib/queue.js";
import { getS3BucketAndKey, uploadFile } from "../lib/s3.js";
import { generateThumbnail } from "../lib/thumbnail.js";

export const uploadRoutes = new Hono();

async function compressImage(
  buffer: Buffer,
  mimeType: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!mimeType.startsWith("image/")) {
    return { buffer, mimeType };
  }

  const compressed = await sharp(buffer)
    .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();

  console.log(
    `[upload] Compressed image: ${(buffer.length / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB`,
  );
  return { buffer: compressed, mimeType: "image/jpeg" };
}

uploadRoutes.post(
  "/",
  describeRoute({
    tags: ["Upload"],
    summary: "Upload a document",
    description: "Upload a file for ingestion, OCR, and classification.",
    responses: {
      201: {
        description: "Document created and queued for processing",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      400: { description: "No file provided" },
    },
  }),
  async (c) => {
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
    const fileName =
      mimeType === "image/jpeg" && !file.name.endsWith(".jpg") ? `${file.name}.jpg` : file.name;
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

    // Queue for processing — falls back to inline if no SQS configured
    const queued = await pushToProcessingQueue({
      documentId: document.id,
      s3Key,
      mimeType,
      hint: file.name,
    });

    if (!queued) {
      // Local dev: process inline (fire-and-forget)
      processDocument({
        documentId: document.id,
        s3Key,
        mimeType,
        hint: file.name,
      }).catch((err) => {
        console.error(`[upload] Background processing failed for ${document.id}:`, err);
      });
    }

    return c.json({ id: document.id, status: "processing" as const }, 201);
  },
);
