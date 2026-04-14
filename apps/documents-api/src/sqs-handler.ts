import type { ProcessingMessage } from "@cometa/shared";
import type { SQSEvent } from "aws-lambda";
import { processDocument } from "./lib/process-document.js";

export async function handler(event: SQSEvent) {
  const results = [];

  for (const record of event.Records) {
    const payload: ProcessingMessage = JSON.parse(record.body);
    console.log(`[sqs] Processing document ${payload.documentId}`);

    try {
      await processDocument(payload);
      results.push({ documentId: payload.documentId, status: "ok" });
    } catch (err) {
      console.error(`[sqs] Failed for ${payload.documentId}:`, err);
      throw err; // Let Lambda retry / send to DLQ
    }
  }

  return { results };
}
