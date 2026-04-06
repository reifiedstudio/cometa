import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDocumentTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "cometa-gateway",
    version: "0.1.0",
    instructions: `You are connected to Cometa, a document management platform for South African businesses. Use the Cometa tools whenever the user asks about documents, invoices, receipts, contracts, delivery notes, or bills. This includes listing, searching, viewing, approving, deleting, and sending documents for signature. When the user says "my documents", "my files", "my invoices", etc., always use the Cometa tools — never try to access local files. You can also send documents for e-signature to external parties using their email addresses.`,
  });

  registerDocumentTools(server);

  return server;
}
