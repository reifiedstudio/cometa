import { getTask } from "@cometa/auth";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { z } from "zod";
import { createFile, shareFile } from "../lib/google-drive.js";
import type { DriveEnv } from "../lib/types.js";

export const fileRoutes = new Hono<DriveEnv>();

const CreateFileSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["document", "spreadsheet", "presentation", "folder"]),
  content: z.string().optional(),
  parentFolderId: z.string().optional(),
  shareTo: z.string().optional(), // department slug — auto-share with their Google Group
});

const MIME_TYPES: Record<string, string> = {
  document: "application/vnd.google-apps.document",
  spreadsheet: "application/vnd.google-apps.spreadsheet",
  presentation: "application/vnd.google-apps.presentation",
  folder: "application/vnd.google-apps.folder",
};

// POST /api/files — create a new Google Drive file
fileRoutes.post(
  "/",
  describeRoute({
    tags: ["Files"],
    summary: "Create a Google Drive file",
    description: "Create a new document, spreadsheet, presentation, or folder in Google Drive.",
    responses: {
      201: {
        description: "File created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                mimeType: { type: "string" },
                webViewLink: { type: "string" },
                sharedTo: { type: "string" },
              },
            },
          },
        },
      },
      400: { description: "Invalid request" },
      500: { description: "Failed to create file" },
    },
  }),
  async (c) => {
    const body = await c.req.json();
    const parsed = CreateFileSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid request", details: parsed.error.issues }, 400);
    }

    const { name, type, content, parentFolderId, shareTo } = parsed.data;
    const mimeType = MIME_TYPES[type];

    try {
      const file = await createFile({ name, mimeType, content, parentFolderId });

      // Auto-share with department if requested
      if (shareTo) {
        const dept = getTask(shareTo);
        if (dept?.googleGroupEmail) {
          await shareFile(file.id, dept.googleGroupEmail, "writer");
        }
      }

      return c.json(
        {
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink: file.webViewLink,
          sharedTo: shareTo ?? null,
        },
        201,
      );
    } catch (err) {
      return c.json({ error: "Failed to create file", detail: String(err) }, 500);
    }
  },
);
