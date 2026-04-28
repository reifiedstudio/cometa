import type { ToolDef } from "./server.js";

/**
 * Local tools served directly by the gateway. Currently empty —
 * intake tools moved to the intake-api MCP server and reach the gateway
 * via the upstream proxy in `server.ts`.
 */
export const localTools: ToolDef[] = [];
