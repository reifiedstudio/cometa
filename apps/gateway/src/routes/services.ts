import { getSession, sendSessionEvent, startSession, streamSession } from "@cometa/agents";
import {
  getMessage,
  getTask,
  listServices,
  queryByTrace,
  queryMessagesByDepartment,
  queryTasksByDepartment,
  sendMessage,
  updateTask,
} from "@cometa/service-core";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import type { GatewayEnv } from "../lib/types.js";

const app = new Hono<GatewayEnv>();

// ── List available services ──

app.get(
  "/",
  describeRoute({
    tags: ["Services"],
    summary: "List available department services",
    description: "Returns all department services registered in SSM Parameter Store.",
    responses: {
      200: {
        description: "List of services",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                services: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { slug: { type: "string" }, queueUrl: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const services = await listServices();
    return c.json({ services });
  },
);

// ── List messages for a department ──

app.get(
  "/:slug/messages",
  describeRoute({
    tags: ["Services"],
    summary: "List messages for a department",
    description: "Query messages sent to a department, ordered by most recent first.",
    responses: {
      200: {
        description: "Paginated list of messages",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { items: { type: "array", items: {} }, lastKey: {} },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const limitStr = c.req.query("limit");
    const limit = limitStr ? Number(limitStr) : undefined;
    const result = await queryMessagesByDepartment(slug, { limit });
    return c.json(result);
  },
);

// ── Get a single message ──

app.get(
  "/:slug/messages/:id",
  describeRoute({
    tags: ["Services"],
    summary: "Get a single message",
    description: "Retrieve a message by its ID.",
    responses: {
      200: {
        description: "Message details",
        content: {
          "application/json": { schema: { type: "object" } },
        },
      },
      404: { description: "Message not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const message = await getMessage(id);

    if (!message) {
      return c.json({ error: "Message not found" }, 404);
    }

    return c.json(message);
  },
);

// ── Send a message to a department ──

app.post(
  "/:slug/messages",
  describeRoute({
    tags: ["Services"],
    summary: "Send a message to a department",
    description:
      "Write a message to DynamoDB and enqueue it to the department's SQS queue for processing.",
    responses: {
      201: {
        description: "Message sent successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { messageId: { type: "string" }, traceId: { type: "string" } },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const user = c.get("user");
    const { body, type, traceId, referenceId, attachments } = await c.req.json();

    const message = await sendMessage("gateway", slug, body, {
      type,
      traceId,
      referenceId,
      attachments,
      userId: user.id,
      userEmail: user.email,
    });

    return c.json({ messageId: message.id, traceId: message.traceId }, 201);
  },
);

// ── List tasks for a department ──

app.get(
  "/:slug/tasks",
  describeRoute({
    tags: ["Services"],
    summary: "List tasks for a department",
    description: "Query tasks assigned to a department with optional status filter.",
    responses: {
      200: {
        description: "Paginated list of tasks",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { items: { type: "array", items: {} }, lastKey: {} },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const status = c.req.query("status") as any;
    const limitStr = c.req.query("limit");
    const limit = limitStr ? Number(limitStr) : undefined;
    const result = await queryTasksByDepartment(slug, { status, limit });
    return c.json(result);
  },
);

// ── Get a single task ──

app.get(
  "/:slug/tasks/:id",
  describeRoute({
    tags: ["Services"],
    summary: "Get a single task",
    description: "Retrieve a task by its ID.",
    responses: {
      200: {
        description: "Task details",
        content: {
          "application/json": { schema: { type: "object" } },
        },
      },
      404: { description: "Task not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const task = await getTask(id);

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(task);
  },
);

// ── Perform an action on a task ──

app.post(
  "/:slug/tasks/:id/action",
  describeRoute({
    tags: ["Services"],
    summary: "Perform an action on a task",
    description:
      "Approve, reject, or reassign a task. Creates a new 'action' message and enqueues it to the department's SQS queue.",
    responses: {
      201: {
        description: "Action message sent",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { messageId: { type: "string" }, traceId: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Task not found" },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const taskId = c.req.param("id");
    const user = c.get("user");
    const { action, assignTo, comment } = await c.req.json();

    const task = await getTask(taskId);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const parts = [`User action: ${action}`];
    if (assignTo) parts.push(`Assign to: ${assignTo}`);
    if (comment) parts.push(`Comment: ${comment}`);
    const body = parts.join(". ");

    const message = await sendMessage("gateway", slug, body, {
      type: "action",
      traceId: task.traceId,
      referenceId: taskId,
      userId: user.id,
      userEmail: user.email,
    });

    return c.json({ messageId: message.id, traceId: message.traceId }, 201);
  },
);

// ── Start an agent session for a task ──

app.post(
  "/:slug/tasks/:id/session",
  describeRoute({
    tags: ["Services"],
    summary: "Start a managed agent session for a task",
    description:
      "Creates a new managed agent session on Anthropic's infrastructure. The session ID is stored on the task for streaming.",
    responses: {
      201: {
        description: "Session started",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { sessionId: { type: "string" }, taskId: { type: "string" } },
            },
          },
        },
      },
      404: { description: "Task not found" },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const taskId = c.req.param("id");
    const { message } = await c.req.json();

    const task = await getTask(taskId);
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const { sessionId } = await startSession({
      slug,
      message,
      title: `${slug}: ${message.slice(0, 80)}`,
    });

    // Store session ID on the task
    await updateTask(taskId, {
      metadata: { ...task.metadata, sessionId },
    });

    return c.json({ sessionId, taskId }, 201);
  },
);

// ── Stream a session (SSE proxy) ──

app.get(
  "/:slug/tasks/:id/stream",
  describeRoute({
    tags: ["Services"],
    summary: "Stream agent session events",
    description:
      "Proxies the managed agent session SSE stream. Returns real-time events as the agent works.",
    responses: {
      200: { description: "SSE event stream" },
      404: { description: "Task not found or no active session" },
    },
  }),
  async (c) => {
    const taskId = c.req.param("id");

    const task = await getTask(taskId);
    if (!task?.metadata?.sessionId) {
      return c.json({ error: "No active session for this task" }, 404);
    }

    const sessionId = task.metadata.sessionId as string;

    // Check session is still alive
    const session = await getSession(sessionId);
    if (session.status === "terminated") {
      return c.json({ error: "Session has terminated" }, 404);
    }

    // Stream SSE events
    const stream = await streamSession(sessionId);

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          try {
            for await (const event of stream) {
              const data = `data: ${JSON.stringify(event)}\n\n`;
              controller.enqueue(encoder.encode(data));

              if (event.type === "session.status_idle") {
                break;
              }
            }
          } catch {
            // Stream closed
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      },
    );
  },
);

// ── Get session status ──

app.get(
  "/:slug/tasks/:id/session",
  describeRoute({
    tags: ["Services"],
    summary: "Get agent session status",
    description: "Returns the current status of the managed agent session for a task.",
    responses: {
      200: {
        description: "Session status",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { sessionId: { type: "string" }, status: { type: "string" } },
            },
          },
        },
      },
      404: { description: "No session found" },
    },
  }),
  async (c) => {
    const taskId = c.req.param("id");

    const task = await getTask(taskId);
    if (!task?.metadata?.sessionId) {
      return c.json({ error: "No session for this task" }, 404);
    }

    const sessionId = task.metadata.sessionId as string;
    const session = await getSession(sessionId);

    return c.json({ sessionId, status: session.status });
  },
);

// ── Send event to session (approve/reject/steer) ──

app.post(
  "/:slug/tasks/:id/session/events",
  describeRoute({
    tags: ["Services"],
    summary: "Send an event to an agent session",
    description: "Send a message to steer or interact with a running agent session.",
    responses: {
      200: { description: "Event sent" },
      404: { description: "No active session" },
    },
  }),
  async (c) => {
    const taskId = c.req.param("id");
    const { message } = await c.req.json();

    const task = await getTask(taskId);
    if (!task?.metadata?.sessionId) {
      return c.json({ error: "No session for this task" }, 404);
    }

    const sessionId = task.metadata.sessionId as string;
    await sendSessionEvent(sessionId, message);

    return c.json({ ok: true });
  },
);

// ── Get all items for a trace ──

app.get(
  "/traces/:traceId",
  describeRoute({
    tags: ["Services"],
    summary: "Get trace",
    description: "Get all messages and tasks across all departments for a given trace ID.",
    responses: {
      200: {
        description: "Trace items",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { items: { type: "array", items: {} }, lastKey: {} },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const traceId = c.req.param("traceId");
    const result = await queryByTrace(traceId);
    return c.json(result);
  },
);

export { app as serviceRoutes };
