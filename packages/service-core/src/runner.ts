import { randomUUID } from "node:crypto";
import { startSession } from "@cometa/agents-sdk";
import { getTask, putTask, updateTask } from "./db.js";
import { sendMessage } from "./sqs.js";
import type { ServiceConfig, ServiceMessage, Task } from "./types.js";

/**
 * Process an incoming ServiceMessage using a Managed Agent session.
 *
 * 1. Load or create a task
 * 2. Start a managed agent session (fire-and-forget to Anthropic)
 *
 * The managed agent handles tool calls via MCP — no callback loop needed.
 */
export async function processMessage(
  message: ServiceMessage,
  config: ServiceConfig,
): Promise<{ sessionId: string; taskId: string }> {
  // 1. Load or create a task
  let task: Task | undefined;
  if (message.referenceId) {
    task = await getTask(message.referenceId);
  }

  if (!task) {
    const now = new Date().toISOString();
    task = {
      id: randomUUID(),
      department: config.name,
      traceId: message.traceId,
      type: message.type === "task" ? "request" : message.type,
      status: "processing",
      assignedTo: "agent",
      body: message.body,
      messages: [message.id],
      createdAt: now,
      updatedAt: now,
    };
    await putTask(task);
  } else {
    const updatedMessages = [...task.messages, message.id];
    await updateTask(task.id, { messages: updatedMessages, status: "processing" });
    task.messages = updatedMessages;
  }

  // 2. Build the user message with context
  const userContent = [
    `From: ${message.from}`,
    `Message type: ${message.type}`,
    `Trace: ${message.traceId}`,
    `Task ID: ${task.id}`,
    `Task status: ${task.status}`,
    task.metadata ? `Metadata: ${JSON.stringify(task.metadata)}` : "",
    "",
    message.body,
    ...(message.attachments?.map(
      (a) => `\nAttachment [${a.type}]: ${a.url}${a.name ? ` (${a.name})` : ""}`,
    ) ?? []),
  ]
    .filter(Boolean)
    .join("\n");

  // 3. Start managed agent session — agent handles everything via MCP
  const { sessionId } = await startSession({
    slug: config.name,
    message: userContent,
    title: `${config.name}: ${message.body.slice(0, 80)}`,
  });

  // Store session ID on the task
  await updateTask(task.id, { metadata: { ...task.metadata, sessionId } });

  return { sessionId, taskId: task.id };
}
