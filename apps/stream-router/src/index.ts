import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import type { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";

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

  // Report failures so DynamoDB Streams retries only the failed records
  return {
    batchItemFailures: failures.map((id) => ({ itemIdentifier: id })),
  };
};

async function routeRecord(record: DynamoDBRecord) {
  const item = record.dynamodb?.NewImage;
  if (!item) return;

  const status = item.status?.S;
  if (status !== "queued") return;

  const slug = item.to?.S ?? item.GSI1PK?.S?.replace("DEPT#", "");
  if (!slug) {
    console.warn("No target service found in record", record.eventID);
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
      MessageBody: JSON.stringify(record.dynamodb?.NewImage),
    }),
  );

  console.log(`Routed to ${slug}`, record.eventID);
}
