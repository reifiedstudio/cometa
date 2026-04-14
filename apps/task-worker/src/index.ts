import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { processMessage, updateMessageStatus } from "@cometa/service-core";
import type { ServiceConfig, ServiceMessage } from "@cometa/service-core";
/**
 * Task Worker Lambda
 *
 * Triggered by SQS queues (one per task).
 * Each SQS message body is a DynamoDB NewImage (from the stream router).
 * Unmarshalls it to a ServiceMessage, then starts a managed agent session.
 */
import type { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from "aws-lambda";

/**
 * Map task slugs to their ServiceConfig.
 * The agent's system prompt lives in Anthropic now, so guidance is minimal here.
 */
const configs: Record<string, ServiceConfig> = {
  accounting: {
    name: "accounting",
    guidance: "Accounting task — managed by Anthropic agent",
  },
  legal: {
    name: "legal",
    guidance: "Legal task — managed by Anthropic agent",
  },
};

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      // The stream router sends the DynamoDB NewImage as the message body
      const dynamoImage = JSON.parse(record.body) as Record<string, AttributeValue>;
      const item = unmarshall(dynamoImage) as ServiceMessage;

      const config = configs[item.to];
      if (!config) {
        console.error(`No config for task: ${item.to}`);
        // Don't retry — this message can't be processed
        continue;
      }

      await updateMessageStatus(item.id, "processing");

      const { sessionId, taskId } = await processMessage(item, config);
      console.log(`Started session ${sessionId} for task ${taskId} (${item.to})`);

      await updateMessageStatus(item.id, "completed");
    } catch (err) {
      console.error("Failed to process message", record.messageId, err);

      // Try to mark the message as failed in DynamoDB
      try {
        const parsed = JSON.parse(record.body);
        const item = unmarshall(parsed);
        if (item.id) {
          const error = err instanceof Error ? err.message : String(err);
          await updateMessageStatus(item.id as string, "failed", error);
        }
      } catch {
        // couldn't parse — skip status update
      }

      failures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures: failures };
};
