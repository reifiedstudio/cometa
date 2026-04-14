import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Handoff } from "./types.js";

const raw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

function table(): string {
  const name = process.env.DYNAMODB_TABLE;
  if (!name) throw new Error("DYNAMODB_TABLE env var is not set");
  return name;
}

// ── Handoffs ──

export async function putHandoff(handoff: Handoff): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: table(),
      Item: {
        PK: `HANDOFF#${handoff.id}`,
        SK: `HANDOFF#${handoff.id}`,
        GSI1PK: `DEPT#${handoff.toDepartment}`,
        GSI1SK: `TS#${handoff.createdAt}`,
        GSI2PK: `FILE#${handoff.googleDriveFileId}`,
        GSI2SK: `TS#${handoff.createdAt}`,
        entityType: "handoff",
        ...handoff,
      },
    }),
  );
}

export async function getHandoff(id: string): Promise<Handoff | undefined> {
  const result = await ddb.send(
    new GetCommand({
      TableName: table(),
      Key: { PK: `HANDOFF#${id}`, SK: `HANDOFF#${id}` },
    }),
  );
  if (!result.Item) return undefined;
  return stripKeys(result.Item) as unknown as Handoff;
}

export async function updateHandoffStatus(
  id: string,
  status: Handoff["status"],
  completedAt?: string,
): Promise<void> {
  const expressionParts = ["#status = :status"];
  const names: Record<string, string> = { "#status": "status" };
  const values: Record<string, unknown> = { ":status": status };

  if (completedAt) {
    expressionParts.push("completedAt = :completedAt");
    values[":completedAt"] = completedAt;
  }

  await ddb.send(
    new UpdateCommand({
      TableName: table(),
      Key: { PK: `HANDOFF#${id}`, SK: `HANDOFF#${id}` },
      UpdateExpression: `SET ${expressionParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(PK)",
    }),
  );
}

export interface HandoffQueryOptions {
  limit?: number;
  startKey?: Record<string, unknown>;
}

/** Query handoffs by target department (GSI1) */
export async function queryHandoffsByDepartment(
  department: string,
  opts: HandoffQueryOptions = {},
): Promise<{ items: Handoff[]; lastKey?: Record<string, unknown> }> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      FilterExpression: "entityType = :et",
      ExpressionAttributeValues: {
        ":pk": `DEPT#${department}`,
        ":et": "handoff",
      },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as Handoff[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

/** Query handoff history for a file (GSI2) */
export async function queryHandoffsByFile(
  googleDriveFileId: string,
  opts: HandoffQueryOptions = {},
): Promise<{ items: Handoff[]; lastKey?: Record<string, unknown> }> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      FilterExpression: "entityType = :et",
      ExpressionAttributeValues: {
        ":pk": `FILE#${googleDriveFileId}`,
        ":et": "handoff",
      },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as Handoff[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

/** Find an active handoff linked to a task ID */
export async function findHandoffByTaskId(taskId: string): Promise<Handoff | undefined> {
  // No GSI for taskId — scan is acceptable since this is called infrequently
  // (only on task completion). In practice, the handoff ID should be stored
  // in the task metadata for direct lookup.
  // For now, we'll use a simple scan with filter.
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI1",
      KeyConditionExpression: "begins_with(GSI1PK, :prefix)",
      FilterExpression: "entityType = :et AND taskId = :taskId",
      ExpressionAttributeValues: {
        ":prefix": "DEPT#",
        ":et": "handoff",
        ":taskId": taskId,
      },
      Limit: 1,
    }),
  );

  const item = result.Items?.[0];
  if (!item) return undefined;
  return stripKeys(item) as unknown as Handoff;
}

// ── Helpers ──

function stripKeys(item: Record<string, unknown>): Record<string, unknown> {
  const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, entityType, ...rest } = item;
  return rest;
}
