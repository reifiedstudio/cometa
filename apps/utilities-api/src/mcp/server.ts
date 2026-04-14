import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerUtilitiesTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Cometa Utilities",
    version: "0.1.0",
    instructions: `You are connected to the Cometa Utilities service. Use these tools for document generation and PDF conversion:

BRANDED DOCUMENTS: Use create_branded_document when the user wants a formal business document — contracts, service agreements, NDAs, proposals, invoices, letters. It generates a professional PDF with company letterhead, signature blocks, and page numbers, then returns a download link. One tool call does everything.

PDF CONVERSION: Use convert_to_pdf for converting arbitrary HTML to PDF. For branded company documents, prefer create_branded_document instead.`,
  });

  registerUtilitiesTools(server);

  return server;
}
