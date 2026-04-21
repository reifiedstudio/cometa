import { toolUiMap, uriToViewMap, viewMap } from "@cometa/mcp-apps";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { callUpstreamTool, getUpstreamTools } from "./proxy.js";
import { localTools } from "./tools.js";

export interface ToolContext {
  user: { id: string; email: string; orgId?: string };
}

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>, ctx?: ToolContext) => Promise<{
    content: (
      | { type: "text"; text: string }
      | { type: "resource"; resource: { uri: string; mimeType: string; text: string } }
    )[];
    isError?: boolean;
  }>;
}

const TASKS_MCP_URL =
  process.env["TASKS_MCP_URL"] ??
  "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws/mcp";

const SIGNATURES_MCP_URL = process.env["SIGNATURES_MCP_URL"] ?? "";
const UTILITIES_MCP_URL = process.env["UTILITIES_MCP_URL"] ?? "";

/** MIME type for MCP App UI resources */
const UI_RESOURCE_MIME = "text/html;profile=mcp-app";

export async function createMcpServer(user?: ToolContext["user"]): Promise<Server> {
  const server = new Server(
    {
      name: "Cometa",
      version: "0.1.0",
    },
    {
      capabilities: { tools: {}, resources: {} },
      instructions: `You are connected to Cometa, a document management and department coordination platform for South African businesses.

Use the Cometa tools whenever the user asks about:
- Intake: listing, searching, viewing, approving, deleting incoming invoices, receipts, contracts, delivery notes, or bills.
- Signatures: creating signature requests, checking status, nudging signers, cancelling requests.
- Tasks: sending messages, creating or managing tasks, checking task status, approving or rejecting work.
- Document generation: creating branded company documents (contracts, NDAs, proposals) and converting to PDF.

When the user says "my documents", "my invoices", etc., always use the Cometa tools — never try to access local files.
To send work to a department (e.g. "review this invoice"), use send_message — the department's AI agent will handle it.

SIGNATURES: Use the signature tools (request_signature, get_signature_status, list_signature_requests, nudge_signer, cancel_signature_request) when the user wants to send documents for signing, check signing progress, or manage signature workflows.

NOTES: Use the create_note tool when the user asks to see, show, or share reports and summaries. It generates a shareable link to a styled page with markdown tables and Mermaid charts. Notes can be downloaded or printed to PDF. They expire after 30 days. Pass raw markdown content with chart blocks. Always prefer create_note over inline text for reports — notes are shareable and look professional.

UTILITIES: Use the utilities tools for document generation and PDF conversion:
- create_branded_document: generates a professional branded PDF with company letterhead, signature blocks, and page numbers. Use for contracts, service agreements, NDAs, proposals, invoices, or any formal business document. Returns a download link directly — one tool call does everything.
- convert_to_pdf: converts arbitrary HTML to PDF. For branded company documents, prefer create_branded_document.

`,
    },
  );

  // Build tool registry: local tools + upstream proxy tools
  const toolMap = new Map<string, ToolDef>();

  for (const tool of localTools) {
    toolMap.set(tool.name, tool);
  }

  // Discover upstream tools from tasks service
  try {
    const upstream = await getUpstreamTools(TASKS_MCP_URL);
    console.log(`[proxy] Discovered ${upstream.length} tools from tasks`);
    for (const t of upstream) {
      toolMap.set(t.name, {
        name: t.name,
        description: t.description ?? "",
        inputSchema: t.inputSchema ?? { type: "object", properties: {} },
        handler: async (args) => {
          const result = await callUpstreamTool(TASKS_MCP_URL, t.name, args);
          return result as any;
        },
      });
    }
  } catch (err) {
    console.warn("[proxy] Failed to discover tasks tools:", err);
  }

  // Discover upstream tools from signatures service
  if (SIGNATURES_MCP_URL) {
    try {
      const upstream = await getUpstreamTools(SIGNATURES_MCP_URL);
      console.log(`[proxy] Discovered ${upstream.length} tools from signatures`);
      for (const t of upstream) {
        toolMap.set(t.name, {
          name: t.name,
          description: t.description ?? "",
          inputSchema: t.inputSchema ?? { type: "object", properties: {} },
          handler: async (args) => {
            const result = await callUpstreamTool(SIGNATURES_MCP_URL, t.name, args);
            return result as any;
          },
        });
      }
    } catch (err) {
      console.warn("[proxy] Failed to discover signatures tools:", err);
    }
  }

  // Discover upstream tools from utilities service
  if (UTILITIES_MCP_URL) {
    try {
      const upstream = await getUpstreamTools(UTILITIES_MCP_URL);
      console.log(`[proxy] Discovered ${upstream.length} tools from utilities`);
      for (const t of upstream) {
        toolMap.set(t.name, {
          name: t.name,
          description: t.description ?? "",
          inputSchema: t.inputSchema ?? { type: "object", properties: {} },
          handler: async (args) => {
            const result = await callUpstreamTool(UTILITIES_MCP_URL, t.name, args);
            return result as any;
          },
        });
      }
    } catch (err) {
      console.warn("[proxy] Failed to discover utilities tools:", err);
    }
  }

  // ── tools/list — inject _meta.ui for tools that have MCP App views ──
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Array.from(toolMap.values()).map((t) => {
      const resourceUri = toolUiMap[t.name];
      return {
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
        ...(resourceUri ? { _meta: { ui: { resourceUri } } } : {}),
      };
    }),
  }));

  // ── tools/call — dispatch to the right handler ──
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = toolMap.get(name);
    if (!tool) {
      return {
        content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }
    return tool.handler(args ?? {}, user ? { user } : undefined);
  });

  // ── resources/list — declare all MCP App UI resources ──
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: Object.entries(uriToViewMap).map(([uri]) => ({
      uri,
      name: uri,
      mimeType: UI_RESOURCE_MIME,
    })),
  }));

  // ── resources/read — serve the bundled HTML for a ui:// resource ──
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const viewName = uriToViewMap[uri];
    const html = viewName ? viewMap[viewName] : undefined;

    if (!html) {
      throw new Error(`Unknown resource: ${uri}`);
    }

    return {
      contents: [{ uri, mimeType: UI_RESOURCE_MIME, text: html }],
    };
  });

  return server;
}
