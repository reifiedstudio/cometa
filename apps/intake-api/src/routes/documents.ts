import { db, schema } from "@cometa/db";
import { DocumentRejectedEmail, sendEmail } from "@cometa/email";
import { createImageService } from "@cometa/storage";
import { and, asc, count, desc, eq, inArray, like, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { logAudit } from "../lib/audit.js";
import { pushToProcessingQueue } from "../lib/queue.js";
import type { DocumentsEnv } from "../lib/types.js";

// Lazy-init image service (env vars may not be set at import time)
let _images: ReturnType<typeof createImageService> | null = null;
let _imagesInitAttempted = false;

function getImageService() {
  if (!_imagesInitAttempted) {
    _imagesInitAttempted = true;
    try {
      _images = createImageService();
      console.log("[images] Image service initialized");
    } catch (err) {
      console.error("[images] Failed to init image service:", err);
      _images = null;
    }
  }
  return _images;
}

function addPreviewUrl<T extends { s3Key: string; mimeType: string }>(doc: T) {
  const images = getImageService();
  if (!images || !doc.s3Key) return { ...doc, previewUrl: null };
  if (!doc.mimeType?.startsWith("image/")) return { ...doc, previewUrl: null };
  try {
    return {
      ...doc,
      previewUrl: images.url(doc.s3Key, { w: 800 }),
    };
  } catch (err) {
    console.error("[images] Failed to generate URL:", err);
    return { ...doc, previewUrl: null };
  }
}

export const documentRoutes = new Hono<DocumentsEnv>();

// GET / — List documents with optional filters
documentRoutes.get(
  "/",
  describeRoute({
    tags: ["Documents"],
    summary: "List documents",
    description:
      "List documents with optional filters for type, status, date range, and sort order.",
    responses: {
      200: {
        description: "List of documents with counts",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                documents: { type: "array", items: {} },
                total: { type: "number" },
                counts: { type: "object" },
              },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const type = c.req.query("type");
    const status = c.req.query("status");
    const sort = c.req.query("sort") ?? "newest";
    const dateFrom = c.req.query("dateFrom");
    const dateTo = c.req.query("dateTo");

    const conditions = [];

    // Exclude rejected docs from main list unless explicitly filtering for them
    if (status !== "rejected") {
      conditions.push(ne(schema.documents.status, "rejected"));
    }

    if (type && type !== "all") {
      conditions.push(
        eq(schema.documents.type, type as (typeof schema.documents.type.enumValues)[number]),
      );
    }

    if (status) {
      conditions.push(
        eq(schema.documents.status, status as (typeof schema.documents.status.enumValues)[number]),
      );
    }

    if (dateFrom) {
      conditions.push(sql`${schema.documents.receivedAt} >= ${dateFrom}`);
    }

    if (dateTo) {
      conditions.push(sql`${schema.documents.receivedAt} <= ${dateTo}`);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
      sort === "oldest" ? asc(schema.documents.receivedAt) : desc(schema.documents.receivedAt);

    const [documents, countResults] = await Promise.all([
      db.select().from(schema.documents).where(where).orderBy(orderBy),
      db
        .select({
          type: schema.documents.type,
          count: count(),
        })
        .from(schema.documents)
        .groupBy(schema.documents.type),
    ]);

    // Aggregate signature progress per document (non-cancelled requests only).
    const docIds = documents.map((d) => d.id);
    const signatureProgress = new Map<string, { signed: number; total: number }>();
    if (docIds.length > 0) {
      const rows = await db
        .select({
          sourceRef: schema.signatureRequests.sourceRef,
          signerStatus: schema.signers.status,
        })
        .from(schema.signers)
        .innerJoin(
          schema.signatureRequests,
          eq(schema.signers.requestId, schema.signatureRequests.id),
        )
        .where(
          and(
            ne(schema.signatureRequests.status, "cancelled"),
            inArray(schema.signatureRequests.sourceRef, docIds),
          ),
        );

      for (const row of rows) {
        if (!row.sourceRef) continue;
        const entry = signatureProgress.get(row.sourceRef) ?? { signed: 0, total: 0 };
        if (row.signerStatus !== "declined") entry.total += 1;
        if (row.signerStatus === "signed") entry.signed += 1;
        signatureProgress.set(row.sourceRef, entry);
      }
    }

    const documentsWithSignatures = documents.map((d) =>
      addPreviewUrl({
        ...d,
        signatureProgress: signatureProgress.get(d.id) ?? null,
      }),
    );

    const totalResult = await db.select({ count: count() }).from(schema.documents);

    const total = totalResult[0]?.count ?? 0;

    const counts = {
      all: total,
      invoice: 0,
      receipt: 0,
      contract: 0,
      delivery_note: 0,
      bill: 0,
    };

    for (const row of countResults) {
      if (row.type && row.type in counts) {
        counts[row.type as keyof Omit<typeof counts, "all">] = row.count;
      }
    }

    return c.json({ documents: documentsWithSignatures, total, counts });
  },
);

// GET /:id — Get single document
documentRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Documents"],
    summary: "Get document by ID",
    responses: {
      200: {
        description: "Document details",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");

    const [document] = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, id))
      .limit(1);

    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    return c.json(addPreviewUrl(document));
  },
);

// GET /:id/audit — Get audit log for a document
documentRoutes.get(
  "/:id/audit",
  describeRoute({
    tags: ["Documents"],
    summary: "Get document audit log",
    responses: {
      200: {
        description: "Audit log entries",
        content: {
          "application/json": {
            schema: { type: "object", properties: { logs: { type: "array", items: {} } } },
          },
        },
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");

    const logs = await db
      .select()
      .from(schema.auditLogs)
      .where(eq(schema.auditLogs.documentId, id))
      .orderBy(desc(schema.auditLogs.createdAt));

    return c.json({ logs });
  },
);

// PATCH /:id — Update document
documentRoutes.patch(
  "/:id",
  describeRoute({
    tags: ["Documents"],
    summary: "Update document",
    description:
      "Update document fields like status, type, description, flags, and extracted data.",
    responses: {
      200: {
        description: "Updated document",
        content: { "application/json": { schema: { type: "object" } } },
      },
      400: { description: "No valid fields to update" },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const user = c.get("user");

    // Fetch current doc for audit comparison
    const [current] = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, id))
      .limit(1);

    if (!current) {
      return c.json({ error: "Document not found" }, 404);
    }

    const allowedFields = [
      "status",
      "type",
      "description",
      "isVerified",
      "isFlagged",
      "flags",
      "extractedData",
      "rejectionReason",
    ] as const;

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return c.json({ error: "No valid fields to update" }, 400);
    }

    updates.updatedAt = new Date();

    // Stamp type version when type changes
    if ("type" in body && body.type) {
      const [docType] = await db
        .select({ version: schema.documentTypes.version })
        .from(schema.documentTypes)
        .where(eq(schema.documentTypes.slug, body.type))
        .limit(1);
      updates.typeVersion = docType?.version ?? null;
    }

    const [updated] = await db
      .update(schema.documents)
      .set(updates)
      .where(eq(schema.documents.id, id))
      .returning();

    // Audit logging
    if ("status" in body && body.status !== current.status) {
      const reason = body.rejectionReason ? ` (${body.rejectionReason.replace(/_/g, " ")})` : "";
      await logAudit(
        id,
        "status_changed",
        `Status changed from ${current.status} to ${body.status}${reason}`,
        user,
        current.status,
        body.status,
      );
    }
    if ("type" in body && body.type !== current.type) {
      await logAudit(
        id,
        "type_changed",
        `Type changed from ${current.type} to ${body.type}`,
        user,
        current.type ?? undefined,
        body.type,
      );
    }
    if ("isFlagged" in body && body.isFlagged !== current.isFlagged) {
      await logAudit(
        id,
        body.isFlagged ? "flagged" : "unflagged",
        body.isFlagged ? "Document flagged for review" : "Flag removed",
        user,
      );
    }
    if ("description" in body && body.description !== current.description) {
      await logAudit(id, "description_changed", "Document description updated", user);
    }
    if ("extractedData" in body) {
      await logAudit(id, "fields_edited", "Extracted data fields updated", user);
    }

    if (!updated) {
      return c.json({ error: "Document not found" }, 404);
    }

    // Send rejection email if status changed to rejected and sender email exists
    if (body.status === "rejected" && body.notifySender && current.senderEmail) {
      const docName = current.description ?? current.originalName ?? "Document";
      const reason = body.rejectionReason?.replace(/_/g, " ");
      sendEmail({
        to: current.senderEmail,
        subject: `Document rejected: ${docName}`,
        react: DocumentRejectedEmail({ documentName: docName, reason }),
      }).catch((err) => console.error("[documents] Failed to send rejection email:", err));
    }

    return c.json(updated);
  },
);

// POST /:id/reprocess — Re-run classification
documentRoutes.post(
  "/:id/reprocess",
  describeRoute({
    tags: ["Documents"],
    summary: "Reprocess document",
    description: "Re-run OCR and classification on a document.",
    responses: {
      200: {
        description: "Reprocessing started",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      400: { description: "No file available" },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");

    const [document] = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, id))
      .limit(1);

    if (!document) {
      return c.json({ error: "Document not found" }, 404);
    }

    if (!document.s3Key) {
      return c.json({ error: "No file available to reprocess" }, 400);
    }

    // Update status to processing
    await db
      .update(schema.documents)
      .set({ status: "processing", updatedAt: new Date() })
      .where(eq(schema.documents.id, id));

    const user = c.get("user");
    await logAudit(id, "reprocessed", "Document sent for reprocessing", user);

    // Push to queue — falls back to inline
    const queued = await pushToProcessingQueue({
      documentId: id,
      s3Key: document.s3Key,
      mimeType: document.mimeType ?? "application/octet-stream",
      hint: document.originalName ?? document.description ?? undefined,
    });

    if (!queued) {
      // Local dev: inline reprocess (OCR + classify)
      const { extractText } = await import("../lib/textract.js");
      const { classifyDocument } = await import("../lib/openai.js");
      const bucket = process.env.S3_BUCKET ?? "";

      void (async () => {
        // Re-run OCR
        let ocrText = document.ocrText ?? "";
        if (bucket && document.s3Key) {
          try {
            ocrText = await extractText(bucket, document.s3Key);
            console.log(`[reprocess] OCR complete for ${id} — ${ocrText.length} chars`);
          } catch (err) {
            console.error(`[reprocess] OCR failed for ${id}:`, err);
          }
        }

        const classification = await classifyDocument(ocrText, document.originalName ?? undefined);

        let typeVersion: number | null = null;
        if (classification.type) {
          const [docType] = await db
            .select({ version: schema.documentTypes.version })
            .from(schema.documentTypes)
            .where(eq(schema.documentTypes.slug, classification.type))
            .limit(1);
          typeVersion = docType?.version ?? null;
        }

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
          .where(eq(schema.documents.id, id));
        console.log(`[reprocess] Document ${id} reprocessed successfully`);
      })().catch(async (err: any) => {
        console.error(`[reprocess] Failed for ${id}:`, err);
        await db
          .update(schema.documents)
          .set({
            status: "pending",
            flags: [{ type: "warning" as const, message: "Reprocessing failed" }],
            updatedAt: new Date(),
          })
          .where(eq(schema.documents.id, id));
      });
    }

    return c.json({ id, status: "processing" });
  },
);

// DELETE /:id — Soft delete (move to trash)
documentRoutes.delete(
  "/:id",
  describeRoute({
    tags: ["Documents"],
    summary: "Delete document",
    description: "Soft delete — moves document to trash.",
    responses: {
      200: {
        description: "Document trashed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const user = c.get("user");

    const [deleted] = await db
      .update(schema.documents)
      .set({
        status: "rejected" as const,
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, id))
      .returning();

    if (!deleted) {
      return c.json({ error: "Document not found" }, 404);
    }

    await logAudit(id, "trashed", "Document moved to trash", user);

    return c.json({ id: deleted.id, status: "deleted" });
  },
);

// POST /:id/restore — Restore from trash
documentRoutes.post(
  "/:id/restore",
  describeRoute({
    tags: ["Documents"],
    summary: "Restore document",
    description: "Restore a document from trash.",
    responses: {
      200: {
        description: "Restored document",
        content: { "application/json": { schema: { type: "object" } } },
      },
      404: { description: "Document not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const user = c.get("user");

    const [restored] = await db
      .update(schema.documents)
      .set({
        status: "pending" as const,
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, id))
      .returning();

    if (!restored) {
      return c.json({ error: "Document not found" }, 404);
    }

    await logAudit(id, "restored", "Document restored from trash", user);

    return c.json(restored);
  },
);
