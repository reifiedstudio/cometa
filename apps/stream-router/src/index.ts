import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

/**
 * Stream router — DynamoDB Streams → per-department SQS queues.
 *
 * Routes two kinds of INSERT events to the right department queue:
 *   1. Tasks (PK starts with `TASK#`)             → routed by `department`
 *   2. Queued messages (PK starts with `MSG#` and `status = "queued"`) → routed by `to`
 *
 * UPDATE / REMOVE events are ignored, so status flips never re-trigger the agent.
 */
const sqs = new SQSClient({});
const QUEUE_URLS: Record<string, string> = JSON.parse(process.env.QUEUE_URLS ?? "{}");

export const handler = async (event: DynamoDBStreamEvent) => {
  const failures: string[] = [];

  for (const record of event.Records) {
    if (record.eventName !== "INSERT") continue;

    try {
      await routeRecord(record);
    } catch (err) {
      console.error("Failed to route record", record.eventID, err);
      if (record.eventID) failures.push(record.eventID);
    }
  }

  return {
    batchItemFailures: failures.map((id) => ({ itemIdentifier: id })),
  };
};

async function routeRecord(record: DynamoDBRecord) {
  const item = record.dynamodb?.NewImage;
  if (!item) return;

  const pk = record.dynamodb?.Keys?.PK?.S ?? "";
  let slug: string | undefined;

  if (pk.startsWith("TASK#")) {
    slug = item.department?.S;
  } else if (pk.startsWith("MSG#")) {
    if (item.status?.S !== "queued") return;
    slug = item.to?.S ?? item.GSI1PK?.S?.replace("DEPT#", "");
  } else {
    return;
  }

  if (!slug) {
    console.warn("No target department found in record", record.eventID);
    return;
  }

  const queueUrl = QUEUE_URLS[slug];
  if (!queueUrl) {
    console.warn(`No queue URL for service "${slug}"`, record.eventID);
    return;
  }

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(item),
    }),
  );

  console.log(`Routed ${pk.split("#")[0]} to ${slug}`, record.eventID);
}
