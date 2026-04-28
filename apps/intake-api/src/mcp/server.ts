import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerIntakeTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Cometa Intake",
    version: "0.1.0",
    instructions: `You are connected to the Cometa Intake service. Use these tools to list, search, fetch, approve, or delete intake documents (invoices, receipts, contracts, delivery notes, bills). Documents include OCR text, AI summaries, and a short-lived presigned URL to the source PDF.`,
  });

  registerIntakeTools(server);

  return server;
}
