import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerNoteTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Cometa Notes",
    version: "0.1.0",
    instructions: `You are connected to the Cometa Notes service. Use these tools to create shareable notes with data, charts, and tables. Notes are rendered as styled pages with markdown and interactive charts.`,
  });

  registerNoteTools(server);

  return server;
}
