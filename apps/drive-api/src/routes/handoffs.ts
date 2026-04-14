import { getTask, hasPermission } from "@cometa/auth";
import { putTask } from "@cometa/service-core";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { getHandoff, putHandoff, queryHandoffsByFile, updateHandoffStatus } from "../lib/db.js";
import { executeCompletion, executeHandoff } from "../lib/executor.js";
import { getFileInfo } from "../lib/google-drive.js";
import type { DriveEnv } from "../lib/types.js";
import type { Handoff } from "../lib/types.js";

export const handoffRoutes = new Hono<DriveEnv>();

const CreateHandoffSchema = z.object({
  googleDriveFileId: z.string().min(1),
  toDepartment: z.string().min(1),
  note: z.string().optional(),
  createTask: z.boolean().optional().default(false),
  taskType: z.string().optional().default("review"),
  policy: z.object({
    senderAccess: z.enum(["editor", "viewer", "none"]),
    onComplete: z.enum(["revoke", "keep", "return"]),
  }),
});

// POST /api/handoffs — hand off a file to a department
handoffRoutes.post(
  "/",
  describeRoute({
    tags: ["Handoffs"],
    summary: "Hand off a file to a department",
    description:
      "Share a Google Drive file with a department's Google Group and optionally create a task.",
    responses: {
      201: {
        description: "Handoff created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                taskId: { type: "string" },
                fileName: { type: "string" },
              },
            },
          },
        },
      },
      400: { description: "Invalid request" },
      403: { description: "Missing permission" },
    },
  }),
  async (c) => {
    const user = c.get("user");

    if (!hasPermission(user.permissions, "org:drive:handoff")) {
      return c.json({ error: "Missing org:drive:handoff permission" }, 403);
    }

    const body = await c.req.json();
    const parsed = CreateHandoffSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.issues }, 400);
    }

    const input = parsed.data;

    // Validate target department exists
    const targetDept = getTask(input.toDepartment);
    if (!targetDept) {
      return c.json({ error: `Unknown department: ${input.toDepartment}` }, 400);
    }
    if (!targetDept.googleGroupEmail) {
      return c.json(
        { error: `Department "${input.toDepartment}" has no Google Group email configured` },
        400,
      );
    }

    // Get file info from Google Drive
    let fileInfo;
    try {
      fileInfo = await getFileInfo(input.googleDriveFileId);
    } catch (err) {
      return c.json({ error: "Could not access Google Drive file", detail: String(err) }, 400);
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    // Optionally create a task in service-core
    let taskId: string | null = null;
    if (input.createTask) {
      taskId = crypto.randomUUID();
      const traceId = crypto.randomUUID();
      await putTask({
        id: taskId,
        department: input.toDepartment,
        traceId,
        type: input.taskType,
        status: "pending",
        body: `${input.taskType}: ${fileInfo.name}${input.note ? ` — ${input.note}` : ""}`,
        messages: [],
        metadata: { handoffId: id, googleDriveFileId: input.googleDriveFileId },
        createdAt: now,
        updatedAt: now,
      });
    }

    const handoff: Handoff = {
      id,
      googleDriveFileId: input.googleDriveFileId,
      fileName: fileInfo.name,
      fromDepartment: null, // Could be resolved from user's department
      fromUserId: user.id,
      fromUserEmail: user.email,
      toDepartment: input.toDepartment,
      note: input.note ?? null,
      taskId,
      policy: input.policy,
      status: "active",
      createdAt: now,
      completedAt: null,
    };

    // Save to DynamoDB
    await putHandoff(handoff);

    // Execute the handoff (share via Google Drive API)
    try {
      await executeHandoff(handoff);
    } catch (err) {
      // Record was created but Drive sharing failed — log and return partial success
      console.error("[handoff] Google Drive sharing failed:", err);
      return c.json(
        {
          id: handoff.id,
          taskId,
          warning:
            "Handoff record created but Google Drive sharing failed. Manual sharing may be required.",
          error: String(err),
        },
        201,
      );
    }

    return c.json({ id: handoff.id, taskId, fileName: fileInfo.name }, 201);
  },
);

// GET /api/handoffs/file/:googleDriveFileId — handoff history for a file
handoffRoutes.get(
  "/file/:googleDriveFileId",
  describeRoute({
    tags: ["Handoffs"],
    summary: "Get handoff history for a file",
    description: "List all handoffs for a specific Google Drive file.",
    responses: {
      200: {
        description: "Handoff history",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { handoffs: { type: "array", items: { type: "object" } } },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const fileId = c.req.param("googleDriveFileId");
    const result = await queryHandoffsByFile(fileId);
    return c.json({ handoffs: result.items });
  },
);

// POST /api/handoffs/:id/complete — mark handoff complete, execute policy
handoffRoutes.post(
  "/:id/complete",
  describeRoute({
    tags: ["Handoffs"],
    summary: "Complete a handoff",
    description:
      "Mark a handoff as complete and execute the completion policy (adjust Google Drive permissions).",
    responses: {
      200: {
        description: "Handoff completed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                status: { type: "string" },
                completedAt: { type: "string" },
              },
            },
          },
        },
      },
      400: { description: "Already completed" },
      404: { description: "Handoff not found" },
    },
  }),
  async (c) => {
    const id = c.req.param("id");

    const handoff = await getHandoff(id);
    if (!handoff) {
      return c.json({ error: "Handoff not found" }, 404);
    }
    if (handoff.status === "completed") {
      return c.json({ error: "Handoff already completed" }, 400);
    }

    const now = new Date().toISOString();

    // Execute the completion policy (adjust Google Drive permissions)
    try {
      await executeCompletion(handoff);
    } catch (err) {
      console.error("[handoff] Completion policy execution failed:", err);
      return c.json(
        {
          error: "Failed to execute completion policy",
          detail: String(err),
        },
        500,
      );
    }

    // Update the handoff record
    await updateHandoffStatus(id, "completed", now);

    return c.json({ id, status: "completed", completedAt: now });
  },
);
