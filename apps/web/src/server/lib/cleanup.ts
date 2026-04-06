import { db, schema } from "@cometa/db";
import { eq, lt, and } from "drizzle-orm";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION ?? "us-east-1";
const s3 = bucket ? new S3Client({ region }) : null;

const RETENTION_DAYS = 90;

export async function cleanupTrashedDocuments() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const trashedDocs = await db
    .select()
    .from(schema.documents)
    .where(
      and(
        eq(schema.documents.status, "rejected"),
        lt(schema.documents.updatedAt, cutoff),
      ),
    );

  if (trashedDocs.length === 0) {
    console.log("[cleanup] No documents to clean up");
    return { deleted: 0 };
  }

  console.log(`[cleanup] Found ${trashedDocs.length} rejected documents older than ${RETENTION_DAYS} days`);

  for (const doc of trashedDocs) {
    // Delete files from S3
    if (s3 && bucket) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: doc.s3Key }));
        if (doc.thumbnailKey) {
          await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: doc.thumbnailKey }));
        }
      } catch (err) {
        console.error(`[cleanup] Failed to delete S3 objects for ${doc.id}:`, err);
      }
    }

    // Delete from DB
    await db
      .delete(schema.documents)
      .where(eq(schema.documents.id, doc.id));

    console.log(`[cleanup] Deleted ${doc.id} (${doc.originalName})`);
  }

  console.log(`[cleanup] Done — deleted ${trashedDocs.length} documents`);
  return { deleted: trashedDocs.length };
}
