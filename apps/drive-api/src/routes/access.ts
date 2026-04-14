import { TASKS, getTask, hasPermission } from "@cometa/auth";
import { putTask } from "@cometa/service-core";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { queryHandoffsByFile } from "../lib/db.js";
import {
  getFileInfo,
  getFilePermissions,
  listFilesSharedWith,
  resolveFileDepartment,
} from "../lib/google-drive.js";
import type { DriveEnv } from "../lib/types.js";

export const accessRoutes = new Hono<DriveEnv>();

const RequestAccessSchema = z.object({
  googleDriveFileId: z.string().min(1),
  reason: z.string().optional(),
});

// POST /api/access/request — request access to a file
accessRoutes.post(
  "/request",
  describeRoute({
    tags: ["Access"],
    summary: "Request access to a file",
    description: "Create an access request task in the owning department.",
    responses: {
      201: {
        description: "Access request created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                taskId: { type: "string" },
                department: { type: "string" },
                fileName: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      400: { description: "Invalid request" },
      403: { description: "Missing permission" },
      404: { description: "Could not determine file owner" },
    },
  }),
  async (c) => {
    const user = c.get("user");

    if (!hasPermission(user.permissions, "org:drive:request")) {
      return c.json({ error: "Missing org:drive:request permission" }, 403);
    }

    const body = await c.req.json();
    const parsed = RequestAccessSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.issues }, 400);
    }

    const { googleDriveFileId, reason } = parsed.data;

    // Check who owns the file via Google Drive permissions
    let ownerDepartment: string | null;
    let fileInfo;
    try {
      [ownerDepartment, fileInfo] = await Promise.all([
        resolveFileDepartment(googleDriveFileId),
        getFileInfo(googleDriveFileId),
      ]);
    } catch (err) {
      return c.json(
        { error: "Could not access file info from Google Drive", detail: String(err) },
        400,
      );
    }

    if (!ownerDepartment) {
      return c.json(
        {
          error:
            "Could not determine which department owns this file. No matching Google Group found in permissions.",
        },
        404,
      );
    }

    // Create a task in the owning department to approve access
    const now = new Date().toISOString();
    const taskId = crypto.randomUUID();
    const traceId = crypto.randomUUID();

    await putTask({
      id: taskId,
      department: ownerDepartment,
      traceId,
      type: "access_request",
      status: "pending",
      body: `Access request: ${user.email} is requesting access to "${fileInfo.name}"${reason ? ` — Reason: ${reason}` : ""}`,
      messages: [],
      metadata: {
        googleDriveFileId,
        requesterUserId: user.id,
        requesterEmail: user.email,
        reason: reason ?? null,
      },
      createdAt: now,
      updatedAt: now,
    });

    return c.json(
      {
        taskId,
        department: ownerDepartment,
        fileName: fileInfo.name,
        message: `Access request sent to ${ownerDepartment} department`,
      },
      201,
    );
  },
);

// GET /api/access/file/:googleDriveFileId — who has access (proxied from Google Drive)
accessRoutes.get(
  "/file/:googleDriveFileId",
  describeRoute({
    tags: ["Access"],
    summary: "Get file access details",
    description:
      "List who has access to a file, including department mappings and handoff history.",
    responses: {
      200: {
        description: "File access details",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                file: { type: "object" },
                permissions: { type: "array", items: { type: "object" } },
                handoffHistory: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
      },
      400: { description: "Could not access file" },
    },
  }),
  async (c) => {
    const fileId = c.req.param("googleDriveFileId");

    let permissions;
    let fileInfo;
    try {
      [permissions, fileInfo] = await Promise.all([
        getFilePermissions(fileId),
        getFileInfo(fileId),
      ]);
    } catch (err) {
      return c.json({ error: "Could not access file from Google Drive", detail: String(err) }, 400);
    }

    // Map permissions to departments where possible
    const enriched = permissions.map((p) => {
      let department: string | undefined;
      if (p.emailAddress) {
        const dept = TASKS.find((d) => d.googleGroupEmail === p.emailAddress);
        if (dept) department = dept.slug;
      }
      return { ...p, department };
    });

    // Get handoff history
    const handoffs = await queryHandoffsByFile(fileId);

    return c.json({
      file: { id: fileInfo.id, name: fileInfo.name, mimeType: fileInfo.mimeType },
      permissions: enriched,
      handoffHistory: handoffs.items,
    });
  },
);

// GET /api/access/department/:slug — list files shared with a department
accessRoutes.get(
  "/department/:slug",
  describeRoute({
    tags: ["Access"],
    summary: "List files shared with a department",
    description: "List all Google Drive files shared with a department's Google Group.",
    responses: {
      200: {
        description: "Department files",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                department: { type: "string" },
                files: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
      },
      400: { description: "No Google Group configured" },
      404: { description: "Unknown department" },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const dept = getTask(slug);
    if (!dept) {
      return c.json({ error: `Unknown department: ${slug}` }, 404);
    }
    if (!dept.googleGroupEmail) {
      return c.json({ error: `Department "${slug}" has no Google Group configured` }, 400);
    }

    try {
      const files = await listFilesSharedWith(dept.googleGroupEmail);
      return c.json({ department: slug, files });
    } catch (err) {
      return c.json({ error: "Failed to list files from Google Drive", detail: String(err) }, 500);
    }
  },
);
