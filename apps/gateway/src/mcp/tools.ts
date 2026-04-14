import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { putNote } from "@cometa/service-core";
import { mdTaskSummary } from "@cometa/renderer/templates";
import {
  approveDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  searchDocuments,
} from "../lib/documents.js";
import type { ToolContext, ToolDef } from "./server.js";

const s3 = new S3Client({});
const NOTES_BUCKET = process.env["NOTES_BUCKET"] ?? "cometa-dev-use1-notes-content";
const NOTES_DOMAIN = process.env["NOTES_DOMAIN"] ?? "notes.daniellourie.me";

export const localTools: ToolDef[] = [
  // ── Documents ──
  {
    name: "list_documents",
    description:
      "List documents with optional filters for type, status, date range, and sort order.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["invoice", "receipt", "contract", "delivery_note", "bill"] },
        status: {
          type: "string",
          enum: ["processing", "pending", "reviewed", "approved", "overdue", "awaiting_signature"],
        },
        sort: { type: "string", enum: ["newest", "oldest"] },
        dateFrom: { type: "string" },
        dateTo: { type: "string" },
      },
    },
    handler: async (args) => {
      const result = await listDocuments(args as any);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.total,
                counts: result.counts,
                documents: result.documents.map((d) => ({
                  id: d.id,
                  type: d.type,
                  status: d.status,
                  description: d.description,
                  receivedAt: d.receivedAt,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  },
  {
    name: "get_document",
    description:
      "Get full details of a document by its ID, including extracted data and AI summary.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await getDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return { content: [{ type: "text", text: JSON.stringify(document, null, 2) }] };
    },
  },
  {
    name: "search_documents",
    description:
      "Search documents by text query. Searches across description, AI summary, and OCR text.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 1 },
        type: { type: "string", enum: ["invoice", "receipt", "contract", "delivery_note", "bill"] },
      },
      required: ["query"],
    },
    handler: async ({ query, type }) => {
      const result = await searchDocuments(query as string, type as any);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.total,
                documents: result.documents.map((d) => ({
                  id: d.id,
                  type: d.type,
                  status: d.status,
                  description: d.description,
                  aiSummary: d.aiSummary,
                  receivedAt: d.receivedAt,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  },
  {
    name: "approve_document",
    description: "Approve a document, changing its status to approved.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await approveDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return {
        content: [
          {
            type: "text",
            text: `Document ${id} approved. Type: ${document.type}, Description: ${document.description}`,
          },
        ],
      };
    },
  },
  {
    name: "delete_document",
    description: "Soft-delete a document by moving it to trash.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
    handler: async ({ id }) => {
      const document = await deleteDocument(id as string);
      if (!document)
        return { content: [{ type: "text", text: "Document not found." }], isError: true };
      return { content: [{ type: "text", text: `Document ${id} moved to trash.` }] };
    },
  },

  // ── Visual Reports ──
  {
    name: "create_note",
    description: `Create a shareable note with data, charts, and tables. Returns a link anyone can view and export as PDF. Notes expire after 30 days.

Available templates: financial_summary, profit_and_loss, invoices, contacts, tasks.

You can also pass raw markdown content directly. The renderer supports full GitHub-Flavored Markdown: headings, bold/italic, tables, lists, blockquotes, code blocks, links, and horizontal rules.

To embed interactive charts, use a \`\`\`chart fenced code block containing a JSON object:

\`\`\`chart
{"type":"bar","title":"Monthly Revenue","data":[{"label":"Jan","value":50000},{"label":"Feb","value":62000}]}
\`\`\`

Chart JSON schema:
- type (required): "bar" | "line" | "pie" | "area" | "stacked-bar"
- title (optional): chart heading
- data (required): array of {"label":"...","value":N}
- For stacked-bar, data items have multiple numeric keys instead of "value", plus a "series" array listing those keys, e.g.: {"type":"stacked-bar","series":["revenue","expenses"],"data":[{"label":"Jan","revenue":50000,"expenses":30000}]}

Guidelines:
- Use "pie" for proportions/breakdowns (2-6 slices)
- Use "bar" for comparisons across categories
- Use "line" or "area" for trends over time
- Use "stacked-bar" for multi-series comparisons
- Keep data labels short (e.g. "Jan" not "January 2026")
- Format currency values as raw numbers (the chart handles display)
- Place charts after the related table or paragraph for context`,
    inputSchema: {
      type: "object",
      properties: {
        template: {
          type: "string",
          enum: ["financial_summary", "profit_and_loss", "invoices", "contacts", "tasks"],
          description: "Use a built-in template to generate the note content",
        },
        title: {
          type: "string",
          description: "Title for the note",
        },
        content: {
          type: "string",
          description:
            "Raw markdown content with optional ```chart JSON blocks. Use this instead of template for custom notes.",
        },
        params: {
          type: "object",
          description:
            "Template-specific parameters. invoices: {type, status, contact}. profit_and_loss: {fromMonth, toMonth}. tasks: {department, status}.",
        },
      },
    },
    handler: async ({ template, title, content: rawContent, params }, ctx?: ToolContext) => {
      const p = (params ?? {}) as Record<string, any>;
      const templateName = template as string | undefined;

      try {
        let markdown: string;
        let defaultTitle: string;

        if (rawContent) {
          markdown = rawContent as string;
          defaultTitle = (title as string) ?? "Note";
        } else if (templateName) {
          switch (templateName) {
            case "tasks": {
              const { queryTasksByDepartment } = await import("@cometa/service-core");
              const dept = p.department ?? "accounting";
              const result = await queryTasksByDepartment(dept, { status: p.status, limit: 50 });
              markdown = mdTaskSummary({ department: dept, tasks: result.items });
              defaultTitle = `${dept.charAt(0).toUpperCase() + dept.slice(1)} Tasks`;
              break;
            }
            default:
              return {
                content: [{ type: "text", text: `Unknown or unsupported template: ${templateName}. Accounting templates have been removed — pass raw markdown content instead.` }],
                isError: true,
              };
          }
        } else {
          return {
            content: [{ type: "text", text: "Provide either a template or content." }],
            isError: true,
          };
        }

        const noteTitle = (title as string) ?? defaultTitle;

        const slug = templateName ?? "note";
        const id = `${slug}-${Date.now()}`;
        const key = `${id}.md`;

        await s3.send(
          new PutObjectCommand({
            Bucket: NOTES_BUCKET,
            Key: key,
            Body: markdown,
            ContentType: "text/markdown; charset=utf-8",
            CacheControl: "public, max-age=3600",
          }),
        );

        // Store note metadata in DynamoDB
        const snippet = markdown
          .replace(/[#*`>\-\[\]()!|]/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 200);
        const now = new Date().toISOString();

        if (!ctx?.user?.id) {
          throw new Error("User context required to create a note");
        }

        await putNote({
          id,
          userId: ctx.user.id,
          userEmail: ctx.user.email ?? "",
          orgId: ctx.user.orgId ?? "",
          title: noteTitle,
          snippet,
          s3Key: key,
          template: templateName,
          starred: false,
          deleted: false,
          createdAt: now,
          updatedAt: now,
        });

        const url = `https://${NOTES_DOMAIN}/view/${id}`;
        return {
          content: [
            {
              type: "text",
              text: `Note created: ${url}\n\nTitle: ${noteTitle}\nExpires in 30 days.`,
            },
          ],
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Note error: ${msg}` }], isError: true };
      }
    },
  },

  // ── Drive (proxied to drive service) ──
  {
    name: "create_file",
    description:
      "Create a new Google Drive file (document, spreadsheet, presentation, or folder). Optionally share it with a department immediately.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "File name" },
        type: {
          type: "string",
          enum: ["document", "spreadsheet", "presentation", "folder"],
          description: "Type of file to create",
        },
        content: { type: "string", description: "Initial text content (only for documents)" },
        parentFolderId: {
          type: "string",
          description: "Google Drive folder ID to create the file in",
        },
        shareTo: {
          type: "string",
          description: "Department slug to share with (accounting, legal, operations, hr)",
        },
      },
      required: ["name", "type"],
    },
    handler: async (args) => {
      try {
        const driveUrl = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";
        const res = await fetch(`${driveUrl}/api/files`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });
        const data = await res.json();
        if (!res.ok)
          return {
            content: [{ type: "text", text: `Create failed: ${JSON.stringify(data)}` }],
            isError: true,
          };
        return {
          content: [
            {
              type: "text",
              text: `Created ${data.name} (${args.type})\nID: ${data.id}\nLink: ${data.webViewLink}${data.sharedTo ? `\nShared with: ${data.sharedTo}` : ""}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Create error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: "handoff_file",
    description:
      "Hand off a Google Drive file to a department. Shares the file with the department's Google Group and creates a handoff record. Optionally creates a task for the receiving department.",
    inputSchema: {
      type: "object",
      properties: {
        googleDriveFileId: { type: "string", description: "The Google Drive file ID" },
        toDepartment: {
          type: "string",
          description: "Target department slug (accounting, legal, operations, hr)",
        },
        note: { type: "string", description: "Context for the receiving department" },
        senderAccess: {
          type: "string",
          enum: ["editor", "viewer", "none"],
          description: "What access the sender keeps after handoff",
        },
        onComplete: {
          type: "string",
          enum: ["revoke", "keep", "return"],
          description: "What happens to the department's access when the task is done",
        },
        createTask: {
          type: "boolean",
          description: "Whether to create a task in the receiving department",
        },
        taskType: {
          type: "string",
          description: "Type of task to create (e.g. review, sign, process)",
        },
      },
      required: ["googleDriveFileId", "toDepartment", "senderAccess", "onComplete"],
    },
    handler: async (args) => {
      try {
        const driveUrl = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";
        const res = await fetch(`${driveUrl}/api/handoffs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleDriveFileId: args.googleDriveFileId,
            toDepartment: args.toDepartment,
            note: args.note,
            createTask: args.createTask ?? false,
            taskType: args.taskType ?? "review",
            policy: {
              senderAccess: args.senderAccess,
              onComplete: args.onComplete,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok)
          return {
            content: [{ type: "text", text: `Handoff failed: ${JSON.stringify(data)}` }],
            isError: true,
          };
        return {
          content: [
            {
              type: "text",
              text: `File handed off to ${args.toDepartment}. Handoff ID: ${data.id}${data.taskId ? `, Task ID: ${data.taskId}` : ""}. File: ${data.fileName}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Handoff error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: "request_file_access",
    description:
      "Request access to a Google Drive file. Identifies which department owns the file and routes the request to them as a task.",
    inputSchema: {
      type: "object",
      properties: {
        googleDriveFileId: { type: "string", description: "The Google Drive file ID" },
        reason: { type: "string", description: "Why access is needed" },
      },
      required: ["googleDriveFileId"],
    },
    handler: async (args) => {
      try {
        const driveUrl = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";
        const res = await fetch(`${driveUrl}/api/access/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleDriveFileId: args.googleDriveFileId,
            reason: args.reason,
          }),
        });
        const data = await res.json();
        if (!res.ok)
          return {
            content: [{ type: "text", text: `Access request failed: ${JSON.stringify(data)}` }],
            isError: true,
          };
        return {
          content: [
            {
              type: "text",
              text: `Access request sent to ${data.department} for "${data.fileName}". Task ID: ${data.taskId}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Access request error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: "check_file_access",
    description:
      "Check who has access to a Google Drive file, which department it belongs to, and its handoff history.",
    inputSchema: {
      type: "object",
      properties: {
        googleDriveFileId: { type: "string", description: "The Google Drive file ID" },
      },
      required: ["googleDriveFileId"],
    },
    handler: async (args) => {
      try {
        const driveUrl = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";
        const res = await fetch(`${driveUrl}/api/access/file/${args.googleDriveFileId}`);
        const data = await res.json();
        if (!res.ok)
          return {
            content: [{ type: "text", text: `Check failed: ${JSON.stringify(data)}` }],
            isError: true,
          };
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Check error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: "list_department_files",
    description: "List Google Drive files shared with a department's Google Group.",
    inputSchema: {
      type: "object",
      properties: {
        department: {
          type: "string",
          description: "Department slug (accounting, legal, operations, hr)",
        },
      },
      required: ["department"],
    },
    handler: async (args) => {
      try {
        const { getTask } = await import("@cometa/auth");
        const dept = getTask(args.department as string);
        if (!dept)
          return {
            content: [{ type: "text", text: `Unknown department: ${args.department}` }],
            isError: true,
          };
        if (!dept.googleGroupEmail)
          return {
            content: [
              {
                type: "text",
                text: `Department "${args.department}" has no Google Group configured`,
              },
            ],
            isError: true,
          };

        const driveUrl = process.env["DRIVE_API_URL"] ?? "http://localhost:3004";
        const res = await fetch(`${driveUrl}/api/access/department/${args.department}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Could not list files: ${JSON.stringify(data)}` }],
            isError: true,
          };
        }
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `List error: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];
