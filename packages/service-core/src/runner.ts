import { randomUUID } from "node:crypto";
import { startSession } from "@cometa/agents-sdk";
import { getTask, putTask, updateTask } from "./db.js";
import type { ServiceConfig, ServiceMessage, Task } from "./types.js";

/**
 * True if the task is owned by an agent (i.e. should auto-process).
 * If a task is assigned to a human, we leave it alone.
 */
function isAgentTask(task: Pick<Task, "assignedTo">): boolean {
  return !task.assignedTo || task.assignedTo === "agent";
}

/**
 * Process a brand-new Task that arrived via the DynamoDB stream.
 *
 * Triage policy:
 *   - assignedTo missing or "agent" → start an agent session
 *   - assignedTo is a human (any other string) → no-op, leave it for the human
 */
export async function processTask(
  task: Task,
): Promise<{ sessionId?: string; taskId: string; skipped?: string }> {
  if (!isAgentTask(task)) {
    return { taskId: task.id, skipped: `assigned to ${task.assignedTo}` };
  }

  const userContent = [
    `Task ID: ${task.id}`,
    `Department: ${task.department}`,
    `Trace: ${task.traceId}`,
    `Type: ${task.type}`,
    `Status: ${task.status}`,
    task.metadata ? `Metadata: ${JSON.stringify(task.metadata)}` : "",
    "",
    task.body,
  ]
    .filter(Boolean)
    .join("\n");

  const { sessionId } = await startSession({
    slug: task.department,
    message: userContent,
    title: `${task.department}: ${task.body.slice(0, 80)}`,
  });

  await updateTask(task.id, { metadata: { ...task.metadata, sessionId } });

  return { sessionId, taskId: task.id };
}

/**
 * Process an incoming ServiceMessage. If it references an existing task,
 * append to that task's thread and re-wake the agent. Otherwise create a
 * fresh task and run triage.
 */
export async function processMessage(
  message: ServiceMessage,
  config: ServiceConfig,
): Promise<{ sessionId?: string; taskId: string; skipped?: string }> {
  let task: Task | undefined;
  if (message.referenceId) {
    task = await getTask(message.referenceId);
  }

  if (!task) {
    const now = new Date().toISOString();
    task = {
      id: `task_${randomUUID()}`,
      department: config.name,
      traceId: message.traceId,
      type: message.type === "task" ? "request" : message.type,
      status: "processing",
      assignedTo: "agent",
      // Prefer the authenticated user's email, fall back to the sender slug.
      requestedBy: message.userEmail ?? message.from,
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

  if (!isAgentTask(task)) {
    return { taskId: task.id, skipped: `assigned to ${task.assignedTo}` };
  }

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

  const { sessionId } = await startSession({
    slug: config.name,
    message: userContent,
    title: `${config.name}: ${message.body.slice(0, 80)}`,
  });

  await updateTask(task.id, { metadata: { ...task.metadata, sessionId } });

  return { sessionId, taskId: task.id };
}
