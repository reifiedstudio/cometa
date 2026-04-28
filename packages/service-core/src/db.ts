import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Note, ServiceMessage, Task } from "./types.js";

const raw = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

function table(): string {
  const name = process.env.DYNAMODB_TABLE;
  if (!name) throw new Error("DYNAMODB_TABLE env var is not set");
  return name;
}

// ── Messages ──

export async function putMessage(msg: ServiceMessage): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: table(),
      Item: {
        PK: `MSG#${msg.id}`,
        SK: `MSG#${msg.id}`,
        GSI1PK: `DEPT#${msg.to}`,
        GSI1SK: `TS#${msg.timestamp}`,
        GSI2PK: `TRACE#${msg.traceId}`,
        GSI2SK: `TS#${msg.timestamp}`,
        entityType: "message",
        ...msg,
      },
    }),
  );
}

export async function getMessage(id: string): Promise<ServiceMessage | undefined> {
  const result = await ddb.send(
    new GetCommand({
      TableName: table(),
      Key: { PK: `MSG#${id}`, SK: `MSG#${id}` },
    }),
  );
  if (!result.Item) return undefined;
  return stripKeys(result.Item) as unknown as ServiceMessage;
}

export async function updateMessageStatus(
  id: string,
  status: ServiceMessage["status"],
  error?: string,
): Promise<void> {
  const expressionParts = ["#status = :status"];
  const names: Record<string, string> = { "#status": "status" };
  const values: Record<string, unknown> = { ":status": status };

  if (error !== undefined) {
    expressionParts.push("#error = :error");
    names["#error"] = "error";
    values[":error"] = error;
  }

  await ddb.send(
    new UpdateCommand({
      TableName: table(),
      Key: { PK: `MSG#${id}`, SK: `MSG#${id}` },
      UpdateExpression: `SET ${expressionParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }),
  );
}

export interface QueryOptions {
  limit?: number;
  startKey?: Record<string, unknown>;
}

export async function queryMessagesByDepartment(
  department: string,
  opts: QueryOptions = {},
): Promise<{ items: ServiceMessage[]; lastKey?: Record<string, unknown> }> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      FilterExpression: "entityType = :et",
      ExpressionAttributeValues: {
        ":pk": `DEPT#${department}`,
        ":et": "message",
      },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as ServiceMessage[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

// ── Tasks ──

export async function putTask(task: Task): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: table(),
      Item: {
        PK: `TASK#${task.id}`,
        SK: `TASK#${task.id}`,
        GSI1PK: `DEPT#${task.department}`,
        GSI1SK: `STATUS#${task.status}#${task.updatedAt}`,
        GSI2PK: `TRACE#${task.traceId}`,
        GSI2SK: `TASK#${task.createdAt}`,
        entityType: "task",
        ...task,
      },
    }),
  );
}

export async function getTask(id: string): Promise<Task | undefined> {
  const result = await ddb.send(
    new GetCommand({
      TableName: table(),
      Key: { PK: `TASK#${id}`, SK: `TASK#${id}` },
    }),
  );
  if (!result.Item) return undefined;
  return stripKeys(result.Item) as unknown as Task;
}

export async function updateTask(
  id: string,
  updates: Partial<
    Pick<Task, "status" | "body" | "assignedTo" | "requestedBy" | "metadata" | "messages" | "seenByAgent">
  >,
): Promise<void> {
  const now = new Date().toISOString();

  const expressionParts: string[] = ["#updatedAt = :updatedAt"];
  const names: Record<string, string> = { "#updatedAt": "updatedAt" };
  const values: Record<string, unknown> = { ":updatedAt": now };

  if (updates.status !== undefined) {
    expressionParts.push("#status = :status");
    names["#status"] = "status";
    values[":status"] = updates.status;
  }
  if (updates.body !== undefined) {
    expressionParts.push("#body = :body");
    names["#body"] = "body";
    values[":body"] = updates.body;
  }
  if (updates.assignedTo !== undefined) {
    expressionParts.push("#assignedTo = :assignedTo");
    names["#assignedTo"] = "assignedTo";
    values[":assignedTo"] = updates.assignedTo;
  }
  if (updates.metadata !== undefined) {
    expressionParts.push("#metadata = :metadata");
    names["#metadata"] = "metadata";
    values[":metadata"] = updates.metadata;
  }
  if (updates.messages !== undefined) {
    expressionParts.push("#messages = :messages");
    names["#messages"] = "messages";
    values[":messages"] = updates.messages;
  }
  if (updates.seenByAgent !== undefined) {
    expressionParts.push("#seenByAgent = :seenByAgent");
    names["#seenByAgent"] = "seenByAgent";
    values[":seenByAgent"] = updates.seenByAgent;
  }

  // Also update the GSI1SK if status changed so queries by status remain correct
  if (updates.status !== undefined) {
    expressionParts.push("GSI1SK = :gsi1sk");
    values[":gsi1sk"] = `STATUS#${updates.status}#${now}`;
  }

  await ddb.send(
    new UpdateCommand({
      TableName: table(),
      Key: { PK: `TASK#${id}`, SK: `TASK#${id}` },
      UpdateExpression: `SET ${expressionParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(PK)",
    }),
  );
}

export interface TaskQueryOptions extends QueryOptions {
  status?: Task["status"];
}

export async function queryTasksByDepartment(
  department: string,
  opts: TaskQueryOptions = {},
): Promise<{ items: Task[]; lastKey?: Record<string, unknown> }> {
  let keyCondition = "GSI1PK = :pk";
  const exprValues: Record<string, unknown> = {
    ":pk": `DEPT#${department}`,
  };

  if (opts.status) {
    keyCondition += " AND begins_with(GSI1SK, :skPrefix)";
    exprValues[":skPrefix"] = `STATUS#${opts.status}#`;
  }

  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI1",
      KeyConditionExpression: keyCondition,
      FilterExpression: "entityType = :et",
      ExpressionAttributeValues: { ...exprValues, ":et": "task" },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as Task[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

// ── Cross-entity queries ──

export async function queryByTrace(
  traceId: string,
  opts: QueryOptions = {},
): Promise<{
  items: (ServiceMessage | Task)[];
  lastKey?: Record<string, unknown>;
}> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: { ":pk": `TRACE#${traceId}` },
      ScanIndexForward: true,
      Limit: opts.limit ?? 100,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as (ServiceMessage | Task)[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

// ── Notes ──

export async function putNote(note: Note): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: table(),
      Item: {
        PK: `NOTE#${note.id}`,
        SK: `NOTE#${note.id}`,
        GSI1PK: `USER#${note.userId}`,
        GSI1SK: `TS#${note.createdAt}`,
        GSI2PK: "NOTES#ALL",
        GSI2SK: `TS#${note.createdAt}`,
        entityType: "note",
        ...note,
      },
    }),
  );
}

export async function getNote(id: string): Promise<Note | undefined> {
  const result = await ddb.send(
    new GetCommand({
      TableName: table(),
      Key: { PK: `NOTE#${id}`, SK: `NOTE#${id}` },
    }),
  );
  if (!result.Item) return undefined;
  return stripKeys(result.Item) as unknown as Note;
}

export async function updateNote(
  id: string,
  updates: Partial<Pick<Note, "starred" | "deleted" | "updatedAt">>,
): Promise<void> {
  const now = updates.updatedAt ?? new Date().toISOString();

  const expressionParts: string[] = ["#updatedAt = :updatedAt"];
  const names: Record<string, string> = { "#updatedAt": "updatedAt" };
  const values: Record<string, unknown> = { ":updatedAt": now };

  if (updates.starred !== undefined) {
    expressionParts.push("#starred = :starred");
    names["#starred"] = "starred";
    values[":starred"] = updates.starred;
  }
  if (updates.deleted !== undefined) {
    expressionParts.push("#deleted = :deleted");
    names["#deleted"] = "deleted";
    values[":deleted"] = updates.deleted;
  }

  await ddb.send(
    new UpdateCommand({
      TableName: table(),
      Key: { PK: `NOTE#${id}`, SK: `NOTE#${id}` },
      UpdateExpression: `SET ${expressionParts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(PK)",
    }),
  );
}

export async function queryNotesByUser(
  userId: string,
  opts: QueryOptions = {},
): Promise<{ items: Note[]; lastKey?: Record<string, unknown> }> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      FilterExpression: "entityType = :et AND (attribute_not_exists(deleted) OR deleted = :false)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":et": "note",
        ":false": false,
      },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as Note[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

export async function queryAllNotes(
  opts: QueryOptions = {},
): Promise<{ items: Note[]; lastKey?: Record<string, unknown> }> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: table(),
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      FilterExpression: "attribute_not_exists(deleted) OR deleted = :false",
      ExpressionAttributeValues: {
        ":pk": "NOTES#ALL",
        ":false": false,
      },
      ScanIndexForward: false,
      Limit: opts.limit ?? 50,
      ...(opts.startKey ? { ExclusiveStartKey: opts.startKey } : {}),
    }),
  );

  return {
    items: (result.Items ?? []).map(stripKeys) as unknown as Note[],
    lastKey: result.LastEvaluatedKey as Record<string, unknown> | undefined,
  };
}

// ── Helpers ──

/** Remove DynamoDB key attributes that aren't part of the domain model */
function stripKeys(item: Record<string, unknown>): Record<string, unknown> {
  const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, entityType, ...rest } = item;
  return rest;
}
