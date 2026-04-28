import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { processMessage, processTask, updateMessageStatus } from "@cometa/service-core";
import type { ServiceConfig, ServiceMessage, Task } from "@cometa/service-core";
/**
 * Task Worker Lambda
 *
 * Triggered by SQS queues (one per department).
 * Each SQS message body is a DynamoDB NewImage written by stream-router.
 * Two payload shapes arrive:
 *   - Task   — fresh task created in DDB, agent runs triage if assignedTo is "agent" or empty
 *   - Message — reply in a task thread or new request, runs through processMessage
 */
import type { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from "aws-lambda";

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

function isTask(item: Record<string, unknown>): item is Task {
  return typeof (item as { department?: unknown }).department === "string"
    && typeof (item as { body?: unknown }).body === "string"
    && Array.isArray((item as { messages?: unknown }).messages);
}

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      const dynamoImage = JSON.parse(record.body) as Record<string, AttributeValue>;
      const item = unmarshall(dynamoImage) as Record<string, unknown>;

      if (isTask(item)) {
        const task = item as unknown as Task;
        const result = await processTask(task);
        if (result.skipped) {
          console.log(`Skipped task ${task.id} (${result.skipped})`);
        } else {
          console.log(`Started session ${result.sessionId} for task ${task.id} (${task.department})`);
        }
        continue;
      }

      const message = item as unknown as ServiceMessage;
      const config = configs[message.to];
      if (!config) {
        console.error(`No config for department: ${message.to}`);
        continue;
      }

      await updateMessageStatus(message.id, "processing");

      const result = await processMessage(message, config);
      if (result.skipped) {
        console.log(`Skipped message ${message.id} on task ${result.taskId} (${result.skipped})`);
      } else {
        console.log(`Started session ${result.sessionId} for task ${result.taskId} (${message.to})`);
      }

      await updateMessageStatus(message.id, "completed");
    } catch (err) {
      console.error("Failed to process record", record.messageId, err);

      try {
        const parsed = JSON.parse(record.body);
        const item = unmarshall(parsed) as Record<string, unknown>;
        if (!isTask(item) && typeof item.id === "string") {
          const error = err instanceof Error ? err.message : String(err);
          await updateMessageStatus(item.id, "failed", error);
        }
      } catch {
        // couldn't parse — skip status update
      }

      failures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures: failures };
};
