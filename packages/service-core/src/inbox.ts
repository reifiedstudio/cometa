import { randomUUID } from "node:crypto";
import type { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from "aws-lambda";
import {
  getTask,
  putTask,
  queryMessagesByDepartment,
  queryTasksByDepartment,
  updateMessageStatus,
  updateTask,
} from "./db.js";
import type { QueryOptions, TaskQueryOptions } from "./db.js";
import { processMessage } from "./runner.js";
import { sendMessage } from "./sqs.js";
import type { SendMessageOptions } from "./sqs.js";
import type { ServiceConfig, ServiceMessage, Task } from "./types.js";

/**
 * Create a service inbox — the main entry point for a department Lambda.
 *
 * Returns an SQS handler plus convenience methods for sending messages,
 * creating/updating tasks, and querying data.
 */
export function createServiceInbox(config: ServiceConfig) {
  return {
    /**
     * Returns an SQS Lambda handler that processes messages through the
     * Claude agent loop using this department's guidance.
     */
    handler:
      () =>
      async (event: SQSEvent): Promise<SQSBatchResponse> => {
        const failures: SQSBatchItemFailure[] = [];

        for (const record of event.Records) {
          try {
            const message: ServiceMessage = JSON.parse(record.body);
            await updateMessageStatus(message.id, "processing");
            await processMessage(message, config);
            await updateMessageStatus(message.id, "completed");
          } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            let messageId: string | undefined;
            try {
              const parsed = JSON.parse(record.body) as ServiceMessage;
              messageId = parsed.id;
            } catch {
              // body wasn't valid JSON — skip status update
            }
            if (messageId) {
              await updateMessageStatus(messageId, "failed", error);
            }
            failures.push({ itemIdentifier: record.messageId });
          }
        }

        return { batchItemFailures: failures };
      },

    /**
     * Send a message to another department's queue.
     */
    send: (
      to: string,
      body: string,
      options?: Omit<SendMessageOptions, "traceId"> & { traceId?: string },
    ) => sendMessage(config.name, to, body, options),

    /**
     * Create a new task in this department.
     */
    createTask: (task: Partial<Task> & { body: string; traceId: string }) => {
      const now = new Date().toISOString();
      const full: Task = {
        id: task.id ?? randomUUID(),
        department: task.department ?? config.name,
        traceId: task.traceId,
        type: task.type ?? "request",
        status: task.status ?? "pending",
        assignedTo: task.assignedTo,
        body: task.body,
        messages: task.messages ?? [],
        metadata: task.metadata,
        createdAt: task.createdAt ?? now,
        updatedAt: task.updatedAt ?? now,
      };
      return putTask(full);
    },

    /**
     * Update an existing task.
     */
    updateTask: (
      taskId: string,
      updates: Partial<Pick<Task, "status" | "body" | "assignedTo" | "metadata" | "messages">>,
    ) => updateTask(taskId, updates),

    /**
     * Get a task by ID.
     */
    getTask: (taskId: string) => getTask(taskId),

    /**
     * List tasks for this department with optional filters.
     */
    listTasks: (filters?: TaskQueryOptions) => queryTasksByDepartment(config.name, filters),

    /**
     * List messages for this department with optional pagination.
     */
    listMessages: (filters?: QueryOptions) => queryMessagesByDepartment(config.name, filters),
  };
}
