import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSignatureTools } from "./tools.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Cometa Signatures",
    version: "0.1.0",
    instructions: `You are connected to the Cometa Signatures service. Use these tools to manage e-signature workflows: create signature requests, check status, nudge signers, and cancel requests.`,
  });

  registerSignatureTools(server);

  return server;
}
