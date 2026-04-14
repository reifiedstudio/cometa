import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTaskTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Cometa Tasks",
    version: "0.1.0",
    instructions: `You are connected to the Cometa Tasks service. Use these tools to manage tasks, messages, and workflows across departments (accounting, legal, etc.). You can list tasks, send messages between departments, perform actions on tasks (approve, reject), and trace work across departments.`,
  });

  registerTaskTools(server);

  return server;
}
