import { randomUUID } from "node:crypto";
import { putMessage } from "./db.js";
import type { Attachment, ServiceMessage } from "./types.js";

export interface SendMessageOptions {
  type?: ServiceMessage["type"];
  traceId?: string;
  referenceId?: string;
  attachments?: Attachment[];
  userId?: string;
  userEmail?: string;
}

/**
 * Send a message to another department.
 * Writes to DynamoDB with status "queued" — the DynamoDB stream
 * routes it to the correct department's SQS queue automatically.
 */
export async function sendMessage(
  from: string,
  to: string,
  body: string,
  options: SendMessageOptions = {},
): Promise<ServiceMessage> {
  const message: ServiceMessage = {
    id: `msg_${randomUUID()}`,
    traceId: options.traceId ?? `trace_${randomUUID()}`,
    from,
    to,
    type: options.type ?? "task",
    body,
    referenceId: options.referenceId,
    attachments: options.attachments,
    status: "queued",
    userId: options.userId,
    userEmail: options.userEmail,
    timestamp: new Date().toISOString(),
  };

  // Write to DynamoDB — stream router picks it up and routes to the right queue
  await putMessage(message);

  return message;
}
