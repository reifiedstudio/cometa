import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { ProcessingMessage } from "@cometa/shared";

const queueUrl = process.env.AWS_SQS_QUEUE_URL;
const sqs = queueUrl ? new SQSClient({ region: process.env.AWS_REGION ?? "us-east-1" }) : null;

export async function pushToProcessingQueue(message: ProcessingMessage) {
  if (!sqs || !queueUrl) {
    console.log("[queue] No SQS configured — processing inline");
    return null;
  }

  try {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
      }),
    );

    console.log(`[queue] Queued document ${message.documentId} for processing`);
    return true;
  } catch (err) {
    console.error(`[queue] Failed to queue document ${message.documentId}:`, err);
    return null;
  }
}
