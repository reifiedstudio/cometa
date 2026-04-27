import { randomUUID } from "node:crypto";
import {
  getMessage,
  getTask,
  listServices,
  putMessage,
  putTask,
  queryByTrace,
  queryMessagesByDepartment,
  queryTasksByDepartment,
  sendMessage,
  updateTask,
} from "@cometa/service-core";
import type { ServiceMessage } from "@cometa/service-core";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTaskTools(server: McpServer): void {
  // ── Services ──

  server.tool(
    "list_services",
    "List all available department services and their queue URLs.",
    {},
    async () => {
      const services = await listServices();
      return {
        content: [{ type: "text" as const, text: JSON.stringify(services, null, 2) }],
      };
    },
  );

  // ── Messages ──

  server.tool(
    "list_messages",
    "List messages for a department, ordered by most recent first.",
    {
      department: z.string().describe("Department slug, e.g. 'accounting', 'legal'"),
      limit: z.number().int().positive().max(100).optional(),
    },
    async ({ department, limit }) => {
      const result = await queryMessagesByDepartment(department, { limit });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    "get_message",
    "Get a single message by its ID.",
    {
      id: z.string().describe("Message ID"),
    },
    async ({ id }) => {
      const message = await getMessage(id);
      if (!message) {
        return { content: [{ type: "text" as const, text: "Message not found." }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(message, null, 2) }] };
    },
  );

  server.tool(
    "send_message",
    "Send a message to a department. The message will be written to DynamoDB and automatically routed to the department's queue for processing.",
    {
      to: z.string().describe("Target department slug, e.g. 'accounting', 'legal'"),
      body: z.string().describe("Natural language message describing the work"),
      type: z.enum(["task", "approval", "action", "system"]).optional(),
      traceId: z
        .string()
        .optional()
        .describe("Trace ID to link related messages across departments"),
      referenceId: z.string().optional().describe("Task ID this message relates to"),
    },
    async ({ to, body, type, traceId, referenceId }) => {
      const message = await sendMessage("gateway", to, body, {
        type,
        traceId,
        referenceId,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: `Message sent to ${to}. Message ID: ${message.id}, Trace ID: ${message.traceId}`,
          },
        ],
      };
    },
  );

  // ── Tasks ──

  server.tool(
    "list_tasks",
    "List tasks for a department with optional status filter.",
    {
      department: z.string().describe("Department slug"),
      status: z
        .enum(["pending", "assigned", "processing", "awaiting_approval", "completed", "failed"])
        .optional(),
      limit: z.number().int().positive().max(100).optional(),
    },
    async ({ department, status, limit }) => {
      const result = await queryTasksByDepartment(department, { status, limit });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                total: result.items.length,
                tasks: result.items.map((t) => ({
                  id: t.id,
                  type: t.type,
                  status: t.status,
                  assignedTo: t.assignedTo,
                  body: t.body,
                  createdAt: t.createdAt,
                  updatedAt: t.updatedAt,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    "get_task",
    "Get full details of a task by its ID.",
    {
      id: z.string().describe("Task ID"),
    },
    async ({ id }) => {
      const task = await getTask(id);
      if (!task) {
        return { content: [{ type: "text" as const, text: "Task not found." }], isError: true };
      }
      return { content: [{ type: "text" as const, text: JSON.stringify(task, null, 2) }] };
    },
  );

  server.tool(
    "create_task",
    "Create a new task in a department.",
    {
      department: z.string().describe("Department slug"),
      body: z.string().describe("Task description"),
      type: z.string().optional().describe("Task type, e.g. 'invoice-approval', 'contract-review'"),
      traceId: z.string().optional().describe("Trace ID to link to existing workflow"),
      assignedTo: z.string().optional().describe("User ID or 'agent'"),
      status: z.enum(["pending", "assigned", "processing", "awaiting_approval"]).optional(),
      metadata: z.record(z.unknown()).optional(),
    },
    async ({ department, body, type, traceId, assignedTo, status, metadata }) => {
      const now = new Date().toISOString();
      const task = {
        id: randomUUID(),
        department,
        traceId: traceId ?? randomUUID(),
        type: type ?? "request",
        status: status ?? ("pending" as const),
        assignedTo,
        body,
        messages: [] as string[],
        metadata,
        createdAt: now,
        updatedAt: now,
      };
      await putTask(task);
      return {
        content: [
          {
            type: "text" as const,
            text: `Task created. ID: ${task.id}, Department: ${department}, Status: ${task.status}`,
          },
        ],
      };
    },
  );

  server.tool(
    "update_task",
    "Update an existing task's status, body, or metadata.",
    {
      id: z.string().describe("Task ID to update"),
      status: z
        .enum(["pending", "assigned", "processing", "awaiting_approval", "completed", "failed"])
        .optional(),
      body: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
      assignedTo: z.string().optional(),
    },
    async ({ id, status, body, metadata, assignedTo }) => {
      const updates: Record<string, unknown> = {};
      if (status) updates.status = status;
      if (body) updates.body = body;
      if (metadata) updates.metadata = metadata;
      if (assignedTo) updates.assignedTo = assignedTo;
      await updateTask(id, updates);
      return {
        content: [{ type: "text" as const, text: `Task ${id} updated.` }],
      };
    },
  );

  server.tool(
    "log_activity",
    "Log a progress update or action taken on a task. Use this to record each meaningful step — what you checked, what you decided, what you're doing next. These entries appear as a timeline on the task so humans can follow along.",
    {
      taskId: z.string().describe("Task ID this activity belongs to"),
      body: z
        .string()
        .describe(
          "What happened — be specific and concise, e.g. 'Verified PO number matches invoice. Amount is R45,000 which exceeds auto-approval threshold.'",
        ),
      from: z.string().describe("Department slug of the agent logging this, e.g. 'accounting'"),
    },
    async ({ taskId, body, from }) => {
      const task = await getTask(taskId);
      if (!task) {
        return { content: [{ type: "text" as const, text: "Task not found." }], isError: true };
      }

      const now = new Date().toISOString();
      const message: ServiceMessage = {
        id: randomUUID(),
        traceId: task.traceId,
        from,
        to: task.department,
        type: "system",
        body,
        referenceId: taskId,
        status: "completed",
        timestamp: now,
      };

      await putMessage(message);
      await updateTask(taskId, {
        messages: [...task.messages, message.id],
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Activity logged on task ${taskId}. Message ID: ${message.id}`,
          },
        ],
      };
    },
  );

  server.tool(
    "link_task",
    "Link a related task to an existing task. Posts a reference card in the task thread showing the linked task and its status. Use this after creating a cross-department task to connect them visually.",
    {
      taskId: z.string().describe("The task to post the link into"),
      linkedTaskId: z.string().describe("The task being linked to"),
      linkedDepartment: z.string().describe("Department of the linked task (e.g. 'legal')"),
      message: z.string().optional().describe("Context for why the tasks are linked"),
    },
    async ({ taskId, linkedTaskId, linkedDepartment, message: body }) => {
      const task = await getTask(taskId);
      if (!task) {
        return { content: [{ type: "text" as const, text: "Task not found." }], isError: true };
      }

      const linkedTask = await getTask(linkedTaskId);
      const linkedStatus = linkedTask?.status ?? "open";

      const now = new Date().toISOString();
      const msg: ServiceMessage = {
        id: randomUUID(),
        traceId: task.traceId,
        from: "gateway",
        to: task.department,
        type: "task",
        body: body ?? `Linked task in ${linkedDepartment}`,
        referenceId: taskId,
        data: {
          linkedTaskId,
          linkedDepartment,
          linkedTaskStatus: linkedStatus,
        },
        status: "completed",
        timestamp: now,
      };

      await putMessage(msg);
      await updateTask(taskId, {
        messages: [...task.messages, msg.id],
      });

      // Store back-reference on the linked task so it knows where it came from
      if (linkedTask) {
        await updateTask(linkedTaskId, {
          metadata: {
            ...linkedTask.metadata,
            parentTaskId: taskId,
            parentDepartment: task.department,
          },
        });
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Linked task ${linkedTaskId} (${linkedDepartment}) to task ${taskId}.`,
          },
        ],
      };
    },
  );

  server.tool(
    "perform_action",
    "Perform an action on a task (approve, reject, reassign). Creates an action message and routes it for processing.",
    {
      department: z.string().describe("Department slug"),
      taskId: z.string().describe("Task ID"),
      action: z.enum(["approve", "reject", "reassign"]),
      assignTo: z.string().optional().describe("User ID to reassign to"),
      comment: z.string().optional(),
    },
    async ({ department, taskId, action, assignTo, comment }) => {
      const task = await getTask(taskId);
      if (!task) {
        return { content: [{ type: "text" as const, text: "Task not found." }], isError: true };
      }

      const parts = [`Action: ${action}`];
      if (assignTo) parts.push(`Assign to: ${assignTo}`);
      if (comment) parts.push(`Comment: ${comment}`);

      const message = await sendMessage("gateway", department, parts.join(". "), {
        type: "action",
        traceId: task.traceId,
        referenceId: taskId,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Action "${action}" performed on task ${taskId}. Message ID: ${message.id}`,
          },
        ],
      };
    },
  );

  // ── Traces ──

  server.tool(
    "get_trace",
    "Get all messages and tasks across departments for a trace ID. Use this to see the full workflow history.",
    {
      traceId: z.string(),
    },
    async ({ traceId }) => {
      const result = await queryByTrace(traceId);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ total: result.items.length, items: result.items }, null, 2),
          },
        ],
      };
    },
  );
}
