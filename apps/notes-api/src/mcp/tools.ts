import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getNote, putNote, queryAllNotes, queryTasksByDepartment } from "@cometa/service-core";
import { mdTaskSummary } from "@cometa/renderer/templates";
import { storage } from "../lib/s3.js";
import { sendNoteCreatedEmail } from "../lib/email.js";

const NOTES_DOMAIN = process.env["NOTES_DOMAIN"] ?? "notes.daniellourie.me";

export function registerNoteTools(server: McpServer): void {
  server.tool(
    "create_note",
    `Create a shareable note with data, charts, and tables. Returns a link anyone can view and export as PDF. Notes expire after 30 days.

Available templates: tasks.

You can also pass raw markdown content directly. The renderer supports full GitHub-Flavored Markdown: headings, bold/italic, tables, lists, blockquotes, code blocks, links, and horizontal rules.

To embed interactive charts, use a \`\`\`chart fenced code block containing a JSON object:

\`\`\`chart
{"type":"bar","title":"Monthly Revenue","data":[{"label":"Jan","value":50000},{"label":"Feb","value":62000}]}
\`\`\`

Chart JSON schema:
- type (required): "bar" | "line" | "pie" | "area" | "stacked-bar"
- title (optional): chart heading
- data (required): array of {"label":"...","value":N}
- For stacked-bar, data items have multiple numeric keys instead of "value", plus a "series" array listing those keys

Guidelines:
- Use "pie" for proportions/breakdowns (2-6 slices)
- Use "bar" for comparisons across categories
- Use "line" or "area" for trends over time
- Use "stacked-bar" for multi-series comparisons
- Keep data labels short
- Place charts after the related table or paragraph for context`,
    {
      template: z
        .enum(["tasks"])
        .optional()
        .describe("Use a built-in template to generate the note content"),
      title: z.string().optional().describe("Title for the note"),
      content: z
        .string()
        .optional()
        .describe(
          "Raw markdown content with optional ```chart JSON blocks. Use this instead of template for custom notes.",
        ),
      params: z
        .record(z.string(), z.any())
        .optional()
        .describe(
          "Template-specific parameters. tasks: {department, status}.",
        ),
      _user_id: z.string().optional().describe("Injected by gateway — caller user ID"),
      _user_email: z.string().optional().describe("Injected by gateway — caller email"),
      _user_org_id: z.string().optional().describe("Injected by gateway — caller org ID"),
    },
    async ({ template, title, content: rawContent, params, _user_id, _user_email, _user_org_id }) => {
      const p = (params ?? {}) as Record<string, any>;

      try {
        let markdown: string;
        let defaultTitle: string;

        if (rawContent) {
          markdown = rawContent;
          defaultTitle = title ?? "Note";
        } else if (template) {
          switch (template) {
            case "tasks": {
              const dept = p.department ?? "accounting";
              const result = await queryTasksByDepartment(dept, {
                status: p.status,
                limit: 50,
              });
              markdown = mdTaskSummary({ department: dept, tasks: result.items });
              defaultTitle = `${dept.charAt(0).toUpperCase() + dept.slice(1)} Tasks`;
              break;
            }
            default:
              return {
                content: [
                  {
                    type: "text" as const,
                    text: `Unknown template: ${template}. Pass raw markdown content instead.`,
                  },
                ],
                isError: true,
              };
          }
        } else {
          return {
            content: [
              { type: "text" as const, text: "Provide either a template or content." },
            ],
            isError: true,
          };
        }

        const noteTitle = title ?? defaultTitle;
        // Prefixed at source — `note_` is the canonical ID prefix for notes.
        const id = `note_${template ? `${template}_` : ""}${Date.now()}`;
        const filename = `${id}.md`;

        await storage.upload(
          filename,
          Buffer.from(markdown, "utf-8"),
          "text/markdown; charset=utf-8",
        );
        const s3Key = storage.fullKey(filename);

        const cleaned = markdown
          .replace(/[#*`>\-\[\]()!|]/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const snippet = cleaned.length > 200 ? cleaned.slice(0, 197) + "..." : cleaned;
        const now = new Date().toISOString();

        const userId = _user_id ?? "mcp:notes";
        const userEmail = _user_email ?? "";
        const orgId = _user_org_id ?? "";

        await putNote({
          id,
          userId,
          userEmail,
          orgId,
          title: noteTitle,
          snippet,
          s3Key,
          template,
          starred: false,
          deleted: false,
          createdAt: now,
          updatedAt: now,
        });

        const url = `https://${NOTES_DOMAIN}/view/${id}`;

        // Send confirmation email (must await — Lambda freezes after response)
        if (userEmail) {
          try {
            await sendNoteCreatedEmail({
              to: userEmail,
              title: noteTitle,
              snippet,
              noteId: id,
            });
          } catch (err) {
            console.error("[create_note] Failed to send email:", err);
          }
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                type: "note",
                badge: "Note",
                title: noteTitle,
                subtitle: "Created just now · Expires in 30 days",
                snippet,
                actionLabel: "View Note",
                actionUrl: url,
              }),
            },
            {
              type: "text" as const,
              text: `Note created: [${noteTitle}](${url})\n\nExpires in 30 days.`,
            },
          ],
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Note error: ${msg}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    "get_note",
    "Fetch a note by ID. Returns the note's metadata, the full markdown content, and a short-lived presigned URL to the underlying file in S3 so an agent or model can read it directly.",
    {
      id: z.string().describe("Note ID (e.g. note_<id>)"),
    },
    async ({ id }) => {
      const note = await getNote(id);
      if (!note) {
        return {
          content: [{ type: "text" as const, text: "Note not found." }],
          isError: true,
        };
      }

      let markdown: string | undefined;
      try {
        const buf = await storage.getBuffer(note.s3Key);
        markdown = buf?.buffer.toString("utf-8");
      } catch (err) {
        console.error("[get_note] Failed to read S3 object:", err);
      }

      let presignedUrl: string | undefined;
      try {
        presignedUrl = await storage.getSignedUrl(note.s3Key, 300);
      } catch (err) {
        console.error("[get_note] Failed to sign URL:", err);
      }

      const url = `https://${NOTES_DOMAIN}/view/${note.id}`;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                id: note.id,
                title: note.title,
                snippet: note.snippet,
                template: note.template,
                starred: note.starred,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                viewUrl: url,
                presignedUrl,
                contentType: "text/markdown; charset=utf-8",
                markdown,
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
    "list_notes",
    "List all available notes with their titles and creation dates.",
    {},
    async () => {
      const result = await queryAllNotes({ limit: 50 });
      const notes = result.items.map((n) => ({
        id: n.id,
        title: n.title,
        snippet: n.snippet,
        starred: n.starred,
        createdAt: n.createdAt,
        url: `https://${NOTES_DOMAIN}/view/${n.id}`,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ total: notes.length, notes }, null, 2),
          },
        ],
      };
    },
  );
}
