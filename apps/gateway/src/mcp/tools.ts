import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NoteCreatedEmail, sendEmail } from "@cometa/email";
import { putNote } from "@cometa/service-core";
import { mdTaskSummary } from "@cometa/renderer/templates";
import {
  approveDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  searchDocuments,
} from "../lib/intake.js";
import type { ToolContext, ToolDef } from "./server.js";

const s3 = new S3Client({});
const NOTES_BUCKET = process.env["NOTES_BUCKET"] ?? "cometa-dev-private";
const NOTES_PREFIX = process.env["NOTES_PREFIX"] ?? "notes/";
const NOTES_DOMAIN = process.env["NOTES_DOMAIN"] ?? "notes.daniellourie.me";

export const localTools: ToolDef[] = [
  // ── Intake ──
  {
    name: "list_intake_documents",
    description:
      "List intake documents with optional filters for type, status, date range, and sort order.",
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
    name: "get_intake_document",
    description:
      "Get full details of an intake document by its ID, including extracted data and AI summary.",
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
    name: "search_intake_documents",
    description:
      "Search intake documents by text query. Searches across description, AI summary, and OCR text.",
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
    name: "approve_intake_document",
    description: "Approve an intake document, changing its status to approved.",
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
    name: "delete_intake_document",
    description: "Soft-delete an intake document by moving it to trash.",
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
        const key = `${NOTES_PREFIX}${id}.md`;

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

        // Send confirmation email
        console.log("[create_note] user email:", ctx?.user?.email || "(empty)");
        if (ctx?.user?.email) {
          sendEmail({
            to: ctx.user.email,
            subject: `Note created: ${noteTitle}`,
            react: NoteCreatedEmail({ title: noteTitle, snippet, viewUrl: url }),
          }).catch((err) => console.error("[create_note] Failed to send email:", err));
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                type: "note",
                badge: "Note",
                title: noteTitle,
                subtitle: `Created just now · Expires in 30 days`,
                snippet,
                actionLabel: "View Note",
                actionUrl: url,
              }),
            },
            {
              type: "text",
              text: `Note created: [${noteTitle}](${url})\n\nExpires in 30 days.`,
            },
          ],
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Note error: ${msg}` }], isError: true };
      }
    },
  },

];
