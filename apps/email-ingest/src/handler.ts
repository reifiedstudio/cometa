import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { db, schema } from "@cometa/db";
import type { ProcessingMessage } from "@cometa/shared";
import { storage } from "@cometa/storage";
import type { SESEvent } from "aws-lambda";
import { simpleParser } from "mailparser";

const sqs = new SQSClient({ region: process.env.AWS_REGION ?? "us-east-1" });
const queueUrl = process.env.AWS_SQS_QUEUE_URL!;

export async function handler(event: SESEvent) {
  for (const record of event.Records) {
    const messageId = record.ses.mail.messageId;
    const emailKey = `emails/${messageId}`;
    console.log(`[email-ingest] Processing email: ${storage.fullKey(emailKey)} from ${record.ses.mail.source}`);

    try {
      // 1. Read raw email from S3 (saved by the SES S3 action)
      const file = await storage.getBuffer(emailKey);
      if (!file) {
        console.error(`[email-ingest] Empty email body for ${emailKey}`);
        continue;
      }
      const raw = file.buffer.toString("utf-8");

      // 2. Parse the email
      const parsed = await simpleParser(raw);
      const from = parsed.from?.value?.[0]?.address ?? record.ses.mail.source;
      const subject = parsed.subject ?? "No subject";
      const attachments = parsed.attachments ?? [];

      console.log(
        `[email-ingest] From: ${from}, Subject: ${subject}, Attachments: ${attachments.length}`,
      );

      if (attachments.length === 0) {
        console.log(`[email-ingest] No attachments — skipping`);
        continue;
      }

      // 3. Process each attachment
      for (const attachment of attachments) {
        const contentType = attachment.contentType ?? "application/octet-stream";

        // Only process documents (images, PDFs)
        const allowed = ["image/", "application/pdf"];
        if (!allowed.some((t) => contentType.startsWith(t))) {
          console.log(
            `[email-ingest] Skipping attachment: ${attachment.filename} (${contentType})`,
          );
          continue;
        }

        const buffer = attachment.content;
        const filename = attachment.filename ?? `attachment-${Date.now()}`;
        const timestamp = Date.now();
        const s3Key = `documents/${timestamp}-${filename}`;

        // Upload attachment to S3
        const s3Url = await storage.upload(s3Key, buffer, contentType);
        const fullKey = storage.fullKey(s3Key);

        // Hash the file
        const hashBuffer = await crypto.subtle.digest("SHA-256", new Uint8Array(buffer));
        const fileHash = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        // Create document record
        const [document] = await db
          .insert(schema.documents)
          .values({
            originalName: filename,
            mimeType: contentType,
            sizeBytes: buffer.length,
            fileHash,
            s3Url,
            s3Key: fullKey,
            status: "processing",
            source: "email",
            senderEmail: from,
          })
          .returning();

        // Push to processing queue
        const message: ProcessingMessage = {
          documentId: document.id,
          s3Key: fullKey,
          mimeType: contentType,
          hint: subject,
        };

        await sqs.send(
          new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(message),
          }),
        );

        console.log(`[email-ingest] Queued document ${document.id} from ${from}: ${filename}`);
      }
    } catch (err) {
      console.error(`[email-ingest] Failed to process ${storage.fullKey(emailKey)}:`, err);
    }
  }
}
