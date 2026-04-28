import { randomUUID } from "node:crypto";
import { db, schema } from "@cometa/db";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { hashFile } from "../lib/hash.js";
import { processDocument } from "../lib/process-document.js";
import { pushToProcessingQueue } from "../lib/queue.js";
import { uploadFile } from "../lib/s3.js";

export const uploadRoutes = new Hono();

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
    const buffer = Buffer.from(arrayBuffer);

    // Generate hash from original file
    const fileHash = await hashFile(arrayBuffer);

    // Upload to S3
    const timestamp = Date.now();
    const s3Key = `documents/${timestamp}-${file.name}`;
    const s3Url = await uploadFile(s3Key, buffer, file.type);

    // Create document record — `doc_` prefix is the canonical ID format.
    const [document] = await db
      .insert(schema.documents)
      .values({
        id: `doc_${randomUUID()}`,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: buffer.length,
        fileHash,
        s3Url,
        s3Key,
        status: "processing",
        source: "upload",
      })
      .returning();

    // Queue for processing — falls back to inline if no SQS configured
    const queued = await pushToProcessingQueue({
      documentId: document.id,
      s3Key,
      mimeType: file.type,
      hint: file.name,
    });

    if (!queued) {
      // Local dev: process inline (fire-and-forget)
      processDocument({
        documentId: document.id,
        s3Key,
        mimeType: file.type,
        hint: file.name,
      }).catch((err) => {
        console.error(`[upload] Background processing failed for ${document.id}:`, err);
      });
    }

    return c.json({ id: document.id, status: "processing" as const }, 201);
  },
);
